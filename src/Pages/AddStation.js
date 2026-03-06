import React, { Component, useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import CommonFunctions from "../utils/CommonFunctions";
function AddStation() {
  const $ = window.jQuery;
  const gridRefjsgridreport = useRef();
  const [ListStations, setListStations] = useState([]);
  const [ListMonitoringTypes, setListMonitoringTypes] = useState([]);
  const [ListSourceTypes, setListSourceTypes] = useState([]);
  const [StationList, setStationList] = useState(true);
  const [StationId, setStationId] = useState(0);
  const [Status, setStatus] = useState(true);
  const currentUser = JSON.parse(sessionStorage.getItem("UserData"));
  const [gridLoad, setgridLoad] = useState(false);
  const [display, setDisplay] = useState({
    name: "none",
    description: "none",
  });

  const Stationaddvalidation = function (StationName, Description) {
    let isvalid = true;
    let form = document.querySelectorAll("#AddStationform")[0];
    if (StationName == "") {
      //toast.warning('Please enter Station Name');
      form.classList.add("was-validated");
      isvalid = false;
    } else if (Description == "") {
      //toast.warning('Please enter Descriptin');
      form.classList.add("was-validated");
      isvalid = false;
    }
    return isvalid;
  };
  const Stationadd = async function () {
    let StationName = document.getElementById("StationName").value;
    let Description = document.getElementById("Description").value;
    let MonitoringTypeId = document.getElementById("monitoringtype").value;
    let SourceTypeId = document.getElementById("sourcetype").value;
    let CreatedBy = currentUser.id;
    let ModifiedBy = currentUser.id;
    let status = Status ? 1 : 0;
    let validation = Stationaddvalidation(StationName, Description);
    if (!validation) {
      return false;
    }
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + "api/Stations", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: authHeader.Authorization,
        "app-origin": authHeader["app-origin"],
      },
      body: JSON.stringify({
        StationName: StationName,
        Description: Description,
        Status: status,
        CreatedBy: CreatedBy,
        ModifiedBy: ModifiedBy,
        MonitoringTypeId: MonitoringTypeId,
        SourceTypeId: SourceTypeId,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == "Stationadd") {
          toast.success("Station added successfully");
          GetStation();
          setStationList(true);
        } else if (responseJson == "Stationexist") {
          toast.error(
            "Station already exist with given Station Name. Please try with another Station Name."
          );
        } else {
          toast.error("Unable to add the Station. Please contact adminstrator");
        }
      })
      .catch((error) =>
        toast.error("Unable to add the Station. Please contact adminstrator")
      );
  };

  const EditStation = function (param) {
    setStationList(false);
    setStationId(param.id);
    setStatus(param.status == 1 ? true : false);
    setTimeout(() => {
      document.getElementById("StationName").value = param.stationName;
      document.getElementById("Description").value = param.description;
      document.getElementById("monitoringtype").value = param.monitoringTypeId;
      document.getElementById("sourcetype").value = param.sourceTypeId;
      //setStatus(param.status==1?true:false)
    }, 1);
  };

  const UpdateStation = async function () {
    let StationName = document.getElementById("StationName").value;
    let Description = document.getElementById("Description").value;
    let MonitoringTypeId = document.getElementById("monitoringtype").value;
    let SourceTypeId = document.getElementById("sourcetype").value;
    let CreatedBy = currentUser.id;
    let ModifiedBy = currentUser.id;
    let status = Status ? 1 : 0;
    let validation = Stationaddvalidation(StationName, Description);
    if (!validation) {
      return false;
    }
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + "api/Stations/" + StationId, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: authHeader.Authorization,
        "app-origin": authHeader["app-origin"],
      },
      body: JSON.stringify({
        StationName: StationName,
        Description: Description,
        Status: status,
        CreatedBy: CreatedBy,
        ModifiedBy: ModifiedBy,
        MonitoringTypeId: MonitoringTypeId,
        SourceTypeId: SourceTypeId,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == 1) {
          toast.success("Station Updated successfully");
          GetStation();
          setStationList(true);
        } else if (responseJson == 2) {
          toast.error(
            "Station already exist with given Station Name. Please try with another Station Name."
          );
        } else {
          toast.error(
            "Unable to update the Station. Please contact adminstrator"
          );
        }
      })
      .catch((error) =>
        toast.error("Unable to update the Station. Please contact adminstrator")
      );
  };

  const DeleteStation = function (item) {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this Station !",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5cb85c",
      confirmButtonText: "Yes",
      closeOnConfirm: false,
    }).then(async function (isConfirm) {
      if (isConfirm.isConfirmed) {
        let id = item.id;
        let authHeader = await CommonFunctions.getAuthHeader();
        await fetch(CommonFunctions.getWebApiUrl() + "api/Stations/" + id, {
          method: "DELETE",
          headers: authHeader,
        })
          .then((response) => response.json())
          .then((responseJson) => {
            if (responseJson == 1) {
              toast.success("Station deleted successfully");
              GetStation();
            } else {
              toast.error(
                "Unable to delete Station. Please contact adminstrator"
              );
            }
          })
          .catch((error) =>
            toast.error("Unable to delete Station. Please contact adminstrator")
          );
      }
    });
  };
  const GetStation = async function () {
    document.getElementById("loader").style.display = "block";
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + "api/GetStationsLookup", {
      method: "GET",
      headers: authHeader,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setListStations(data.listStations);
          setListMonitoringTypes(data.listMonitoringTypes);
          setListSourceTypes(data.listSourceTypes);
        }
      })
      .catch((error) =>
        toast.error(
          "Unable to get the Stations list. Please contact adminstrator"
        )
      )
      .finally(() => {
        setgridLoad(true);
        document.getElementById("loader").style.display = "none";
      });
  };
  useEffect(() => {
    if (gridLoad) {
      initializeJsGrid();
    }
  });
  useEffect(() => {
    GetStation();
  }, []);
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
        data: ListStations,
        loadData: function (filter) {
          $(".jsgrid-filter-row input:text")
            .addClass("form-control")
            .addClass("form-control-sm");
          $(".jsgrid-filter-row select")
            .addClass("custom-select")
            .addClass("custom-select-sm");
          return $.grep(this.data, function (item) {
            return (
              (!filter.stationName ||
                item.stationName
                  .toUpperCase()
                  .indexOf(filter.stationName.toUpperCase()) >= 0) &&
              (!filter.description ||
                item.description
                  .toUpperCase()
                  .indexOf(filter.description.toUpperCase()) >= 0) &&
                  (!filter.monitoringTypeId || item.monitoringTypeId === filter.monitoringTypeId) &&
                  (!filter.sourceTypeId || item.sourceTypeId === filter.sourceTypeId)
            );
          });
        },
      },
      fields: [
        {
          name: "stationName",
          title: "Station Name",
          type: "text",
          align: "left",
        },
        {
          name: "description",
          title: "Description",
          type: "text",
          align: "left",
        },
        {
          name: "monitoringTypeId",
          title: "Monitoring Type",
          align: "left",
          type: "select",
          items: ListMonitoringTypes,
          valueField: "id",
          textField: "name",
        },
        {
          name: "sourceTypeId",
          title: "Source Type",
          align: "left",
          type: "select",
          items: ListSourceTypes,
          valueField: "id",
          textField: "name",
        },
        {
          type: "control",
          width: 100,
          editButton: false,
          deleteButton: false,
          itemTemplate: function (value, item) {
            // var $result = gridRefjsgrid.current.fields.control.prototype.itemTemplate.apply(this, arguments);

            var $customEditButton = $("<button>")
              .attr({
                class: "customGridEditbutton jsgrid-button jsgrid-edit-button",
              })
              .click(function (e) {
                EditStation(item);
                /* alert("ID: " + item.id); */
                e.stopPropagation();
              });

            var $customDeleteButton = $("<button>")
              .attr({
                class:
                  "customGridDeletebutton jsgrid-button jsgrid-delete-button",
              })
              .click(function (e) {
                DeleteStation(item);
                e.stopPropagation();
              });

            return $("<div>")
              .append($customEditButton)
              .append($customDeleteButton);
            //return $result.add($customButton);
          },
        },
      ],
    });
  };
  const AddStationchange = function (param) {
    if (param) {
      setStationList(true);
    } else {
      setStationList(false);
      setStationId(0);
    }
  };
  const DownloadExcel = async function (filetype) {
    {
      /*edited*/
    }
    let params = new URLSearchParams({ filetype: filetype });
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(
      CommonFunctions.getWebApiUrl() +
        "api/AirQuality/StationListExportToExcel?" +
        params,
      {
        method: "GET",
        headers: authHeader,
      }
    )
      .then((response) => response.blob())
      .then((blob) => {
        // Create a link element and trigger a click on it to download the file
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        if (filetype == "excel") {
          link.download = Date.now() + ".xlsx";
        } else {
          link.download = Date.now() + ".csv";
        }
        link.click();
      })
      .catch((error) => console.error("Error:", error));
    // document.getElementById('loader').style.display = "none";
    /* fetch(url + params, {
       method: 'GET',
     }).then((response) => response.json())
       .then((data) => {
       }).catch((error) => console.log(error)); */
  };

  const handleTextBox = (value, characterLimit, elementId) => {
    debugger;
    if (value.length < characterLimit) {
      setDisplay((prevDisplay) => ({
        ...prevDisplay,
        [elementId]: "none",
      }));
    } else {
      setDisplay((prevDisplay) => ({
        ...prevDisplay,
        [elementId]: "block",
      }));
    }
  };

  return (
    <main id="main" className="main">
      <div className="container">
        <div className="row my-2">
          <div className="pagetitle col">
            {!StationList && StationId == 0 && <h1>Add Station</h1>}
            {!StationList && StationId != 0 && <h1>Update Station</h1>}
            {StationList && <h1>Stations List</h1>}
          </div>
          <div className="col text-end">
            {StationList && (
              <span
                className="operation_class mx-2"
                onClick={() => AddStationchange()}
              >
                <i className="bi bi-plus-circle-fill"></i>{" "}
                <span>Create New Station</span>
              </span>
            )}
            {!StationList && (
              <span
                className="operation_class mx-2"
                onClick={() => AddStationchange("gridlist")}
              >
                <i className="bi bi-card-list"></i>{" "}
                <span>View All Stations</span>
              </span>
            )}
          </div>
        </div>
        <section className="section">
          <div>
            {!StationList && (
              <form id="AddStationform" className="row">
                <div className="col-md-12 mb-3">
                  <label for="StationName" className="form-label">
                  <span className="text-danger">*</span> Station Name:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="StationName"
                    placeholder="Enter station name"
                    onChange={(e) => handleTextBox(e.target.value, 50, "name")}
                    maxLength={50}
                    required
                  />
                  <div
                    id="name"
                    style={{ display: display.name }}
                    className="invalid-feedback"
                  >
                    Character limit exceeded! Maximum 50 characters are allowed.
                  </div>
                  <div class="invalid-feedback">Please enter station name</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="Description" className="form-label">
                  <span className="text-danger">*</span> Description:
                  </label>
                  <textarea
                    class="form-control"
                    id="Description"
                    rows="3"
                    placeholder="Enter description"
                    onChange={(e) =>
                      handleTextBox(e.target.value, 150, "description")
                    }
                    maxLength={150}
                    required
                  ></textarea>
                  <div
                    id="description"
                    style={{ display: display.description }}
                    className="invalid-feedback"
                  >
                    Character limit exceeded! Maximum 150 characters are
                    allowed.
                  </div>
                  <div class="invalid-feedback">Please enter description</div>
                </div>
                <div className="col-md-12 mb-3">
                    <label htmlFor="MonitoringType" className="form-label">
                      <span className="text-danger">*</span> Monitoring Type:
                    </label>
                    <select className="form-select" id="monitoringtype" required>
                      <option selected value="">
                        Select monitoring type
                      </option>
                      {ListMonitoringTypes.map((x, y) => (
                        <option value={x.id} key={y}>
                          {x.name}
                        </option>
                      ))}
                    </select>
                    <div className="invalid-feedback">
                      Please select monitoring type
                    </div>
                  </div>
                  <div className="col-md-12 mb-3">
                    <label htmlFor="SourceType" className="form-label">
                      <span className="text-danger">*</span> Source Type:
                    </label>
                    <select className="form-select" id="sourcetype" required>
                      <option selected value="">
                        Select source type
                      </option>
                      {ListSourceTypes.map((x, y) => (
                        <option value={x.id} key={y}>
                          {x.name}
                        </option>
                      ))}
                    </select>
                    <div className="invalid-feedback">
                      Please select Source type
                    </div>
                  </div>
                <div className="col-md-12">
                  <label for="Status" className="form-label">
                    Status:{" "}
                  </label>
                  <div className="form-check d-inline-block form-switch ms-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="Status"
                      onChange={(e) => setStatus(e.target.checked)}
                      defaultChecked={Status}
                    />
                    {Status && (
                      <label
                        className="form-check-label"
                        for="flexSwitchCheckChecked"
                      >
                        Active
                      </label>
                    )}
                    {!Status && (
                      <label
                        className="form-check-label"
                        for="flexSwitchCheckChecked"
                      >
                        Inactive
                      </label>
                    )}
                  </div>
                </div>

                <div className="col-md-12 text-center">
                  {!StationList && StationId == 0 && (
                    <button
                      className="btn btn-primary"
                      onClick={Stationadd}
                      type="button"
                    >
                      Add Station
                    </button>
                  )}
                  {!StationList && StationId != 0 && (
                    <button
                      className="btn btn-primary"
                      onClick={UpdateStation}
                      type="button"
                    >
                      Update Station
                    </button>
                  )}
                </div>
              </form>
            )}
            {StationList && (
              <div className="jsGrid" ref={gridRefjsgridreport} />
            )}
          </div>
          <div className="col-md-4">
            <div className="row">
              <div id="loader" className="loader"></div>
            </div>
          </div>
        </section>
        <br></br>

        {StationList && ListStations.length > 0 && (
          <div align="center">
            <button
              type="button"
              className="btn btn-primary datashow me-0"
              onClick={() => DownloadExcel("excel")}
            >
              Download Excel
            </button>{" "}
            &nbsp;
            <button
              type="button"
              className="btn btn-primary datashow me-0"
              onClick={() => DownloadExcel("csv")}
            >
              Download Csv
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
export default AddStation;
