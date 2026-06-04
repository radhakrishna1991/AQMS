import React, { Component, useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";
import CommonFunctions from "../utils/CommonFunctions";

function ExceedanceConfiguration() {
  const $ = window.jQuery;
  const gridRefjsgridreport = useRef();
  const [Pollutents, setPollutents] = useState([]);
  const [Stations, setStations] = useState([]);
  const [ExceedanceConfiguration, setExceedanceConfiguration] = useState([]);
  const [Parameter, setParmeter] = useState([]);
  const [allPollutents, setAllPollutents] = useState([]);
  const [ListDevices, setListDevices] = useState([]);
  const [ListDrivers, setListDrivers] = useState([]);
  const [MonitoringTypes, setMonitoringTypes] = useState([]);
  const [showMonitoringTypeFilter, setShowMonitoringTypeFilter] = useState(false);
  const [selectedMonitoringTypeId, setSelectedMonitoringTypeId] = useState("");
  const [selectedStationIds, setSelectedStationIds] = useState([]);
  const [selectedEditMonitoringTypeId, setSelectedEditMonitoringTypeId] = useState("");
  const [selectedEditStationId, setSelectedEditStationId] = useState("");
  const [ExceedanceList, setExceedanceList] = useState(true);
  const [ConfigurationId, setConfigurationId] = useState(0);
  const currentUser = JSON.parse(sessionStorage.getItem('UserData'));
  const [gridLoad,setgridLoad]= useState(false);

  // Multi-delete state
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  // Refs to always get latest state in jsGrid callbacks
  const selectedRowIdsRef = useRef(selectedRowIds);
  const ExceedanceConfigurationRef = useRef(ExceedanceConfiguration);
  useEffect(() => { selectedRowIdsRef.current = selectedRowIds; }, [selectedRowIds]);
  useEffect(() => { ExceedanceConfigurationRef.current = ExceedanceConfiguration; }, [ExceedanceConfiguration]);

  const GetLookupData = async function () {
    document.getElementById('loader').style.display = "block";
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + "api/GetExceedenceConfigurationLookupData", {
      method: 'GET',
      headers: authHeader,
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          const filteredStations = data?.listStations;
          setStations(filteredStations);
          const monitoringTypes = data?.listMonitoringTypes || data?.listMonitoringType || [];
          setMonitoringTypes(monitoringTypes);
          const stationMonitoringTypeCount = new Set(
            (filteredStations || []).map((x) => x?.monitoringTypeId).filter((x) => x !== null && x !== undefined)
          ).size;
          setShowMonitoringTypeFilter(stationMonitoringTypeCount > 1);
          const filteredConfiguration = data?.listExceedanceConfiguration;
          setExceedanceConfiguration(filteredConfiguration);
          const filteredParameter = data?.listPollutents;
          setParmeter(filteredParameter);
          const filteredDevices = data?.listDevices;
          setListDevices(filteredDevices);
          setListDrivers(data.listDrivers);
          let resArr = [];
          data.listParameters.filter(function (item) {
             // Find the unitName from unitsList using unitId
              let unit = data.listReportedunits.find(unit => unit.id === item.unitID);
              if (unit) {
                  // Add unitName to the item
                  item.unitName = unit.unitName;
              }
            let i = resArr.findIndex(x => (x.parameter == item.parameter));
            if (i <= -1) {
              resArr.push(item);
            }
            return null;
          });
          setAllPollutents(resArr);
          setPollutents(resArr);
          setTimeout(function () {
            $('#stationid').SumoSelect({
              triggerChangeCombined: true, placeholder: 'Select Station', floatWidth: 200, selectAll: true,
              search: true, nativeOnDevice: [], forceCustomRendering: true
            });
            $('#pollutentid').SumoSelect({
              triggerChangeCombined: true, placeholder: 'Select Parameter', floatWidth: 200, selectAll: true,
              search: true, nativeOnDevice: [], forceCustomRendering: true
            });
          }, 100);
          //console.log(resArr)
        }
      }).catch((error) => toast.error('Unable to get the Configuration list. Please contact adminstrator'))
      .finally(() => {
        setgridLoad(true);
        document.getElementById('loader').style.display = "none";
    });
  }

 const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const ValidateMultipeEmails = (emailIds) => {
    let validEmail;
    const MultipleEmailIds = emailIds.split(",");
    for (const email of MultipleEmailIds) {
       validEmail = validateEmail(email);
      if (validEmail == null) {
        break;
      }
    }
    console.log(validEmail);
    return validEmail == null ? false: true; 
  }

  const Configurationaddvalidation = function (StationID, PollutentName, EmailID) {
    let isvalid = true;
    let form = document.querySelectorAll('#AddStationform')[0];
    if (StationID == "") {
      toast.warning('Please Select Station Name');
      form.classList.add('was-validated');
      isvalid = false;
    } else if (PollutentName == "") {
      toast.warning('Please select Parameter');
      form.classList.add('was-validated');
      isvalid = false;
    }else if (EmailID == ""|| !ValidateMultipeEmails(EmailID)) {
      toast.warning('Please enter valid Email-IDs');
      form.classList.add('was-validated');
      isvalid = false;
    }
    return isvalid;
  }
  const Configurationadd = async function () {
    let StationID = $("#stationid").val();
    let PollutentName = $("#pollutentid").val();
    let EmailID = document.getElementById("emailID").value;
    let validation = Configurationaddvalidation(StationID, PollutentName, EmailID);
    if (!validation) {
      return false;
    }
    let params = new URLSearchParams({ StationID: StationID, PollutentName: PollutentName, EmailID:EmailID});
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + "api/ExceedanceConfiguration?" + params, {
      method: 'POST',
      headers: authHeader,
    }).then((response) => {
      if (response.ok) {
        toast.success('Exceedance Configuration Added successfully');
        GetExceedanceConfiguration();
        setExceedanceList(true);
      } else {
        toast.error('Unable to add the Exceedance Configuration. Please contact adminstrator');
      }
    }).catch((error) => toast.error('Unable to add the Exceedance Configuration. Please contact adminstrator'));
  }

  const EditConfigurationId = function (param) {
    setExceedanceList(false);
    setConfigurationId(param.id);
    const selectedStation = (Stations || []).find((x) => String(x?.id) === String(param?.stationID));
    setSelectedEditStationId(String(param?.stationID || ""));
    setSelectedEditMonitoringTypeId(String(selectedStation?.monitoringTypeId || ""));
    setTimeout(() => {
      document.getElementById("Stationid").value = param.stationID;
      let parameterID = param.parameterID;
      let driverID = Parameter.find(x => x.id == parameterID)?.driverID;
      let driverName = ListDrivers.find(x => x.id == driverID)?.driverName;
      document.getElementById("Pollutentid").value = driverName;
      document.getElementById("EmailID").value = param.emailIDs;
    }, 100);
  }
  const UpdateConfigurationId = async (event) => {
    let StationID = document.getElementById("Stationid").value;
    let PollutentName = document.getElementById("Pollutentid").value;
    let EmailID = document.getElementById("EmailID").value;
    let validation = Configurationaddvalidation(StationID, PollutentName, EmailID);
    if (!validation) {
      return false;
    }
    let params = new URLSearchParams({ ID : ConfigurationId , StationID: StationID, PollutentName: PollutentName, EmailID:EmailID});
    let authHeader = await CommonFunctions.getAuthHeader();
    fetch(CommonFunctions.getWebApiUrl() + 'api/UpdateExceedanceConfiguration?' + params,{
      method: 'PUT',
      headers: authHeader,
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == 1) {
          toast.success('Exceedance Configuration Updated successfully');
          GetExceedanceConfiguration();
          setExceedanceList(true);
        } else {
          toast.error('Unable to update the Exceedance Configuration. Please contact adminstrator');
        }
      }).catch((error) => toast.error('Unable to update the Exceedance Configuration. Please contact adminstrator'));
  }

  const DeleteConfiguration = function (item) {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this Exceedance Configuration !",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5cb85c",
      confirmButtonText: "Yes",
      // closeOnConfirm removed as requested
    }).then(async function (isConfirm) {
      if (isConfirm.isConfirmed) {
        const id = item?.id;
        if (!id) {
          toast.error('Unable to delete the Exceedance Configuration. Invalid record.');
          return;
        }
        const authHeader = await CommonFunctions.getAuthHeader();
        fetch(CommonFunctions.getWebApiUrl() + 'api/ExceedanceConfiguration/' + id, {
          method: 'DELETE',
          headers: authHeader,
        }).then((response) => response.json())
          .then((responseJson) => {
            if (responseJson == 1) {
              toast.success('Exceedance Configuration deleted successfully');
              GetExceedanceConfiguration();
            } else {
              toast.error('Unable to delete the Exceedance Configuration. Please contact adminstrator');
            }
          }).catch(() => toast.error('Unable to delete the Exceedance Configuration. Please contact adminstrator'));
      }
    });
  };

  // Multi-delete handler
  const handleDeleteSelected = async () => {
    if (!selectedRowIds.length) {
      toast.warning('Please select at least one record to delete.');
      return;
    }
    Swal.fire({
      title: "Are you sure?",
      text: `You want to delete ${selectedRowIds.length} selected configuration(s)?`,
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5cb85c",
      confirmButtonText: "Yes",
      // closeOnConfirm removed as requested
    }).then(async function (isConfirm) {
      if (isConfirm.isConfirmed) {
        const authHeader = await CommonFunctions.getAuthHeader();
        let successCount = 0;
        let failCount = 0;
        for (const id of selectedRowIds) {
          try {
            const response = await fetch(CommonFunctions.getWebApiUrl() + 'api/ExceedanceConfiguration/' + id, {
              method: 'DELETE',
              headers: authHeader,
            });
            const responseJson = await response.json();
            if (responseJson == 1) {
              successCount++;
            } else {
              failCount++;
            }
          } catch {
            failCount++;
          }
        }
        if (successCount) toast.success(`${successCount} configuration(s) deleted successfully`);
        if (failCount) toast.error(`${failCount} configuration(s) failed to delete`);
        setSelectedRowIds([]);
        GetExceedanceConfiguration();
      }
    });
  };


  const GetExceedanceConfiguration = async function () {
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + "api/ExceedanceConfiguration", {
      method: 'GET',
      headers: authHeader,
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          const filteredConfiguration = data;
          setExceedanceConfiguration(filteredConfiguration);
        }
      }).catch((error) => toast.error('Unable to get the Exceedance Configuration list. Please contact adminstrator'));
  }

  useEffect(() => {
    GetLookupData();
  }, []);

  useEffect(() => {
    const stationsToUse = selectedStationIds || [];
    const stationTypeIds = [...new Set(
      (Stations || [])
        .filter((s) => stationsToUse.includes(String(s?.id)))
        .map((s) => String(s?.monitoringTypeId))
        .filter((x) => x && x !== "undefined" && x !== "null")
    )];

    const filtered = (allPollutents || []).filter((p) => {
      const matchesMonitoringType = selectedMonitoringTypeId
        ? String(p?.monitoringTypeId) === String(selectedMonitoringTypeId)
        : stationTypeIds.length === 1 && p?.monitoringTypeId !== undefined && p?.monitoringTypeId !== null
          ? String(p?.monitoringTypeId) === stationTypeIds[0]
          : true;

      const matchesStation = stationsToUse.length > 0 && p?.stationID !== undefined && p?.stationID !== null
        ? stationsToUse.includes(String(p?.stationID))
        : true;

      return matchesMonitoringType && matchesStation;
    });

    setPollutents(filtered);

    setTimeout(function () {
      const pollutentSelect = window.jQuery('#pollutentid')[0];
      if (pollutentSelect && pollutentSelect.sumo) {
        pollutentSelect.sumo.reload();
      }
    }, 50);
  }, [allPollutents, Stations, selectedMonitoringTypeId, selectedStationIds]);

  useEffect(() => { 
    if(gridLoad){
      initializeJsGrid();
    }
  });
 
  const initializeJsGrid = function () {
    window.jQuery(gridRefjsgridreport.current).jsGrid({
      width: "100%",
      height: "auto",
      filtering: true,
      editing: false,
      inserting: false,
      sorting: true,
      paging: true,
      autoload: true,
      pageSize: 100,
      pageButtonCount: 5,
      controller: {
        data: ExceedanceConfiguration,
        loadData: function (filter) {
          $(".jsgrid-filter-row input:text").addClass("form-control").addClass("form-control-lg border-50 ps-3");
          $(".jsgrid-filter-row select").addClass("custom-select").addClass("custom-select-sm device-select-control");
          return $.grep(this.data, function (item) {
            return ((!filter.stationID || item.stationID === filter.stationID)
            && (!filter.deviceID || item.deviceID === filter.deviceID)
            && (!filter.parameterID || item.parameterID === filter.parameterID)
            && (!filter.emailIDs || item.emailIDs.toUpperCase().indexOf(filter.emailIDs.toUpperCase()) >= 0)
            );
          });
        }
      },
      fields: [
        // Checkbox column for multi-select
        {
          name: "selectRow",
          title: function() {
            // Render select all checkbox
            const checked = selectedRowIdsRef.current.length === ExceedanceConfigurationRef.current.length && ExceedanceConfigurationRef.current.length > 0;
            const $cb = $("<input type='checkbox'>").prop("checked", checked).on("change", function(e) {
              const isChecked = e.target.checked;
              if (isChecked) {
                setSelectedRowIds(ExceedanceConfigurationRef.current.map(x => x.id));
              } else {
                setSelectedRowIds([]);
              }
              // Force grid refresh to update all row checkboxes
              window.jQuery(gridRefjsgridreport.current).jsGrid("refresh");
            });
            return $cb[0];
          },
          width: 30,
          align: "center",
          sorting: false,
          filtering: false,
          itemTemplate: function (_, item) {
            const checked = selectedRowIdsRef.current.includes(item.id);
            return $("<input type='checkbox'>")
              .prop("checked", checked)
              .on("change", function (e) {
                const isChecked = e.target.checked;
                setSelectedRowIds(prev => {
                  let newIds;
                  if (isChecked) {
                    newIds = [...prev, item.id];
                  } else {
                    newIds = prev.filter(id => id !== item.id);
                  }
                  // If all are selected after this, check header; if not, uncheck
                  setTimeout(() => {
                    window.jQuery(gridRefjsgridreport.current).jsGrid("refresh");
                  }, 0);
                  return Array.from(new Set(newIds));
                });
              });
          }
        },
        {
          name: "serialNumber", title: "S. No.", width: 50, align: "center", sorting: false,
          itemTemplate: function (_, item, index) {
            var index = ExceedanceConfiguration.indexOf(item);
            return index + 1;
          }
        },
        { name: "stationID", title: "Station Name", type: "select", items: Stations, valueField: "id", textField: "stationName"},
        { name: "deviceID", title: "Device Name", type: "select", items: ListDevices, valueField: "id", textField: "deviceName"},
        { name: "parameterID", title: "Parameter Name", type: "select", items: Parameter, valueField: "id", textField: "parameterName"},
        {
          name: "emailIDs",
          title: "Email-IDs",
          type: "text",
          width: 220,
          itemTemplate: function (value) {
            return $("<div>")
              .text(value || "")
              .css({
                whiteSpace: "normal",
                wordBreak: "break-word",
                overflowWrap: "anywhere",
                lineHeight: "1.4"
              });
          }
        },
        {
          type: "control", width: 100, editButton: false, deleteButton: false,
           itemTemplate: function (value, item) {
            var $customEditButton = $("<button>").attr({ class: "customGridEditbutton jsgrid-button jsgrid-edit-button" })
              .click(function (e) {
                EditConfigurationId(item);
                e.stopPropagation();
              });

            var $customDeleteButton = $("<button>").attr({ class: "customGridDeletebutton jsgrid-button jsgrid-delete-button" })
              .click(function (e) {
                DeleteConfiguration(item);
                e.stopPropagation();
              });

            return $("<div>").append($customEditButton).append($customDeleteButton);
          } 
        },
      ]
    });
  }
  const AddConfigurationchange = function (param) {
    if (param) {
      setExceedanceList(true);
    } else {
      GetLookupData();
      setSelectedMonitoringTypeId("");
      setSelectedStationIds([]);
      setSelectedEditMonitoringTypeId("");
      setSelectedEditStationId("");
      setExceedanceList(false);
      setConfigurationId(0);
    }
  }

  const handleMonitoringTypeChange = (event) => {
    const value = event?.target?.value || "";
    setSelectedMonitoringTypeId(value);
    setSelectedStationIds([]);
    setTimeout(function () {
      const stationSelect = window.jQuery('#stationid');
      if (stationSelect && stationSelect.length > 0) {
        stationSelect.val([]);
      }
      const stationSumo = window.jQuery('#stationid')[0];
      if (stationSumo && stationSumo.sumo) {
        stationSumo.sumo.reload();
      }
      const pollutentSelect = window.jQuery('#pollutentid')[0];
      if (pollutentSelect && pollutentSelect.sumo) {
        pollutentSelect.sumo.reload();
      }
    }, 50);
  };

  const handleStationSelectionChange = (event) => {
    const values = event?.target?.selectedOptions
      ? Array.from(event.target.selectedOptions).map((opt) => String(opt.value))
      : [];
    setSelectedStationIds(values);
  };

  const handleEditMonitoringTypeChange = (event) => {
    const value = event?.target?.value || "";
    setSelectedEditMonitoringTypeId(value);
    setSelectedEditStationId("");
    const stationElement = document.getElementById("Stationid");
    if (stationElement) stationElement.value = "";
    const pollutentElement = document.getElementById("Pollutentid");
    if (pollutentElement) pollutentElement.value = "";
  };

  const handleEditStationChange = (event) => {
    const value = event?.target?.value || "";
    setSelectedEditStationId(value);
    if (!selectedEditMonitoringTypeId) {
      const selectedStation = (Stations || []).find((x) => String(x?.id) === String(value));
      if (selectedStation?.monitoringTypeId !== undefined && selectedStation?.monitoringTypeId !== null) {
        setSelectedEditMonitoringTypeId(String(selectedStation.monitoringTypeId));
      }
    }
    const pollutentElement = document.getElementById("Pollutentid");
    if (pollutentElement) pollutentElement.value = "";
  };

  const filteredStations = (Stations || []).filter((s) => {
    if (!selectedMonitoringTypeId) return true;
    return String(s?.monitoringTypeId) === String(selectedMonitoringTypeId);
  });

  const filteredEditStations = (Stations || []).filter((s) => {
    if (!selectedEditMonitoringTypeId) return true;
    return String(s?.monitoringTypeId) === String(selectedEditMonitoringTypeId);
  });

  const filteredEditPollutents = (allPollutents || []).filter((p) => {
    const matchesMonitoringType = selectedEditMonitoringTypeId
      ? String(p?.monitoringTypeId) === String(selectedEditMonitoringTypeId)
      : true;

    const matchesStation = selectedEditStationId && p?.stationID !== undefined && p?.stationID !== null
      ? String(p?.stationID) === String(selectedEditStationId)
      : true;

    return matchesMonitoringType && matchesStation;
  });
  return (
    <main id="main" className="main" >
      <div className="container">
        <div className="pagetitle">
        {!ExceedanceList && ConfigurationId==0 && (
            <h1>Add Exceedance Configuration</h1>
                )}
          {ExceedanceList && (
            <h1>Exceedance Configuration List</h1>
          )}
          {!ExceedanceList && ConfigurationId != 0 && (
            <h1>Edit Exceedance Configuration</h1>
          )}
        </div>
        <section className="section">
          <div className="container common-table-pd table-status-bg stationList-filter-bg">
          <div className="me-2 mb-2 col-sm-12 text-right">
          {ExceedanceList && (
                        <span className="operation_class mx-2" onClick={() => AddConfigurationchange()}><img src="images/full-plusicon.png" width="25" height="25" /><span>Add</span></span>
                    )}
              {!ExceedanceList && (
                <span className="operation_class mx-2" onClick={() => AddConfigurationchange('gridlist')}><img src="images/listingicon.png" width="25" height="25" /> <span>View List</span></span>
              )}
            </div>
            {!ExceedanceList && ConfigurationId == 0 &&  (
              <form id="AddStationform" className="row field-props">
                {showMonitoringTypeFilter && (
                  <div className="col-md-6 mb-3">
                    <label htmlFor="monitoringType" className="form-label">Monitoring Type</label>
                    <select
                      className="form-select border-50"
                      id="monitoringType"
                      value={selectedMonitoringTypeId}
                      onChange={handleMonitoringTypeChange}
                    >
                      <option value="">All Monitoring Types</option>
                      {MonitoringTypes.map((x, y) => (
                        <option value={x.id} key={y}>{x.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="col-md-6 mb-3">
                  <label for="StationName" className="form-label">Station Name</label>
                  <select className="form-select stationid border-50" id="stationid" multiple="multiple" onChange={handleStationSelectionChange}>
              
                    {filteredStations.map((x, y) =>
                      <option value={x.id} key={y}>{x.stationName}</option>
                    )}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Parameters</label>
                  <select className="form-select pollutentid border-50" id="pollutentid" multiple="multiple">
                    {Pollutents.map((x, y) =>
                      <option value={x.parameter} key={y} >{x.parameter+"_"+x.unitName}</option>
                    )}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="emailID" className="form-label">Email ID</label>
                  <textarea className="form-control" id="emailID" rows="3" placeholder="Enter email-ID" required></textarea>
                </div>

                <div className="col-md-12 text-center">
                    <button className="btn btn-primary download-btn" onClick={Configurationadd} type="button">Add Configuration</button>
                </div>
              </form>
            )}
              {!ExceedanceList && ConfigurationId != 0 && (
              <form id="AddStationform" className="row field-props">
                {showMonitoringTypeFilter && (
                  <div className="col-md-6 mb-3">
                    <label htmlFor="monitoringTypeEdit" className="form-label">Monitoring Type</label>
                    <select
                      className="form-select border-50"
                      id="monitoringTypeEdit"
                      value={selectedEditMonitoringTypeId}
                      onChange={handleEditMonitoringTypeChange}
                    >
                      <option value="">All Monitoring Types</option>
                      {MonitoringTypes.map((x, y) => (
                        <option value={x.id} key={y}>{x.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="col-md-6 mb-3">
                  <label for="StationName" className="form-label">Station Name</label>
                  <select className="form-select stationid border-50" id="Stationid" onChange={handleEditStationChange}>
              
                    {filteredEditStations.map((x, y) =>
                      <option value={x.id} key={y}>{x.stationName}</option>
                    )}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Parameters</label>
                  <select className="form-select pollutentid border-50" id="Pollutentid">
                    {filteredEditPollutents.map((x, y) =>
                      <option value={x.parameter} key={y} >{x.parameter+"_"+x.unitName}</option>
                    )}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="EmailID" className="form-label">Email ID</label>
                  <textarea className="form-control" id="EmailID" rows="3" placeholder="Enter email-ID" required></textarea>
                </div>

                <div className="col-md-12 text-center">
                    <button className="btn btn-primary download-btn" onClick={UpdateConfigurationId} type="button">Update Configuration</button>
                </div>
              </form>
            )}
            {ExceedanceList && (
              <>
                <div className="mb-2 text-right">
                  <button className="btn btn-danger" type="button" onClick={handleDeleteSelected} disabled={selectedRowIds.length === 0}>
                    Delete Selected
                  </button>
                </div>
                <div className="jsGrid" ref={gridRefjsgridreport} />
              </>
            )}
          </div>
          <div className="col-md-4">
                    <div className="row">
                      <div id="loader" className="loader"></div>
                    </div>
          </div>
        </section>
      </div>
    </main>
  );
}
export default ExceedanceConfiguration;