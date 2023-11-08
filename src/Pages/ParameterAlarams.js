import React, { Component, useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";
import CommonFunctions from "../utils/CommonFunctions";
function ParameterAlarams() {
  const $ = window.jQuery;
  const gridRefjsgridreport = useRef();
  const [ParameterAlarmList, setParameterAlarmList] = useState(true);
  const [ParameterAlarmId, setParameterAlarmId] = useState(0);
  const [AllLookpdata, setAllLookpdata] = useState(null);
  const [Devices, setDevices] = useState([]);
  const [Parameter, setParameters] = useState([]);
  const [ParameterList, setParameterList] = useState([]);
  const [ParameterAlarm, setParameterAlarm] = useState([]);
  const [ParameterAlarmData, setParameterAlarmData] = useState([]);
  const [CheckedValues, setCheckedValues] = useState([]);
  const [ChangedAlarmData, setChangedAlarmData] = useState([]);
  const [EnableValue, setEnableValue]=useState(true);
  var dataForGrid = [];

  useEffect(() => {
    GetParameterAlarmsLookup();
  }, []);
  useEffect(() => {
    initializeJsGrid();
  });


  const GetParameterAlarmsLookup = async function () {
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + "api/ParameterAlarmlookup", {
      method: 'GET',
      headers:authHeader
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          setAllLookpdata(data);
          setDevices(data.listDevices);
          setParameters(data.listParameters);
          setParameterAlarmData(data.listParameterAlarm);
          var Alarmlist = [];
          data.listAlarms.filter(function (item) {
            var i = Alarmlist.findIndex(x => (x.id == item.id));
            if (i <= -1) {
              Alarmlist.push(item);
            }
          });
          setParameterAlarm(Alarmlist);
          //initializeJsGrid(data.listDevices);
          setTimeout(function () {
            $('#alarmname').SumoSelect({
              triggerChangeCombined: true, placeholder: 'Select Alarm', floatWidth: 200, selectAll: true,
              search: true
            });
          }, 500);
        }
      })
      .catch((error) => {
        toast.error('Unable to get the Devices lookup list. Please contact adminstrator')
      });

  }

  const initializeJsGrid = function () {

    dataForGrid = [];
    ParameterAlarmData.filter(function (item) {
      var i = dataForGrid.findIndex(x => (x.deviceID == item.deviceID && x.parameterID == item.parameterID));
      if (i <= -1) {
        dataForGrid.push(item);
      }
      return null;
    });

    window.jQuery(gridRefjsgridreport.current).jsGrid({
      width: "100%",
      height: "auto",
      filtering: false,
      editing: false,
      inserting: false,
      sorting: true,
      autoload: true,
      paging: true,
      pageLoading: true,
      pageButtonCount: 5,
      pageSize: 100,
      //data: data,
    //  data: Parameter,
      data:dataForGrid,

      fields: [
        { name: "deviceID", title: "Device Name",align:"left", type: "select", items: Devices, valueField: "id", textField: "deviceName" },
        { name: "parameterID", title: "Parameter Name",align:"left", type: "select", items: Parameter, valueField: "id", textField: "parameterName"},
        {
          type: "control", width: 100, editButton: false, deleteButton: false,
          itemTemplate: function (value, item) {
            // var $result = gridRefjsgrid.current.fields.control.prototype.itemTemplate.apply(this, arguments);

            var $customEditButton = $("<button>").attr({ class: "customGridEditbutton jsgrid-button jsgrid-edit-button" })
              .click(function (e) {
                EditParameterAlarm(item);
                /* alert("ID: " + item.id); */
                e.stopPropagation();
              });

            var $customDeleteButton = $("<button>").attr({ class: "customGridDeletebutton jsgrid-button jsgrid-delete-button" })
              .click(function (e) {
                DeleteParameterAlarm(item);
                e.stopPropagation();
              });

            return $("<div>").append($customEditButton).append($customDeleteButton);
            //return $result.add($customButton);
          }
        },
      ]
    });
  }

  const DeleteParameterAlarm = function (item) {
    Swal.fire({
      title: "Are you sure?",
      text: ("You want to delete this Device Alarm !"),
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5cb85c",
      confirmButtonText: "Yes",
      closeOnConfirm: false
    })
      .then(async function (isConfirm) {
        if (isConfirm.isConfirmed) {
          let id = item.parameterID;
          let authHeader = await CommonFunctions.getAuthHeader();
          await fetch(CommonFunctions.getWebApiUrl() + 'api/DeleteParameterAlarm/' + id, {
            method: 'DELETE',
            headers:authHeader
          }).then((response) => response.json())
            .then((responseJson) => {
              if (responseJson == 1) {
                toast.success('Parameter Alarm deleted successfully')
                GetParameterAlarmsLookup();
              } else {
                toast.error('Unable to delete Parameter Alarm. Please contact adminstrator');
              }
            }).catch((error) => toast.error('Unable to delete Parameter Alarm. Please contact adminstrator'));
        }
      });
  }

  const AddParameterAlarmchange = function (param) {
    if (param) {
      setParameterAlarmList(true);
    }
    else {
      setParameterAlarmList(false);
      setParameterAlarmId(0);

      setTimeout(function () {
        $('#alarmname').SumoSelect({
          triggerChangeCombined: true, placeholder: 'Select Alarm', floatWidth: 200, selectAll: true,
          search: true
        });
      }, 100);
    }
  }
  const ParameterAlarmaddvalidation = function (deviceid, parameterid, alarmid) {
    let isvalid = true;
    let form = document.querySelectorAll('#ParameterAlarmsform')[0];
    if (deviceid == "") {
      //toast.warning('Please enter Station Name');
      form.classList.add('was-validated');
      isvalid = false;
    } else if (parameterid == "") {
      //toast.warning('Please enter Descriptin');
      form.classList.add('was-validated');
      isvalid = false;
    } else if (alarmid.length == 0) {
      form.classList.add('was-validated');
      isvalid = false;
    }
    return isvalid;
  }

  const ParameterAlarmadd = async function () {
    let deviceid = document.getElementById("devicename").value;
    let parameterid = document.getElementById("parametername").value;
    let alarmid = $("#alarmname").val();
    let enable = EnableValue?1:0;
    var parameterArray = [];
    let validation = ParameterAlarmaddvalidation(deviceid, parameterid, alarmid);
    if (!validation) {
      return false;
    }
    for (var i = 0; i < alarmid.length; i++) {
      parameterArray.push({ DeviceID: deviceid, ParameterID: parameterid, CustomerAlarmID: alarmid[i], IsEnable: enable });
    }
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + 'api/ParameterAlarm', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: authHeader.Authorization,
        'app-origin':authHeader["app-origin"]
      },
      body: JSON.stringify(parameterArray),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == "ParameterAlarmadd") {
          toast.success('Device Alarm added successfully');
          GetParameterAlarmsLookup();
          setParameterAlarmList(true);
        } else if (responseJson == "ParameterAlarmexist") {
          toast.error('Device Alarm already exist with given Device Name. Please try with another Device Name.');
        } else {
          toast.error('Unable to add the Device Alarm. Please contact adminstrator');
        }
      }).catch((error) => toast.error('Unable to add the Device Alarm. Please contact adminstrator'));
  }

  const UpdateParameterAlarm = async function () {
    let deviceid = document.getElementById("devicename").value;
    let parameterid = document.getElementById("parametername").value;
    let alarmid = $("#alarmname").val();
    let enable = EnableValue?1:0;

    var parameterArray = [];
  
    let validation = ParameterAlarmaddvalidation(deviceid, parameterid, alarmid);
    if (!validation) {
      return false;
    }
    for (var i = 0; i < alarmid.length; i++) {
      parameterArray.push({ DeviceID: deviceid, ParameterID: parameterid, CustomerAlarmID: alarmid[i], IsEnable: enable });
    }
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + 'api/ParameterAlarm/' + ParameterAlarmId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: authHeader.Authorization,
        'app-origin':authHeader["app-origin"]
      },
      body: JSON.stringify(parameterArray),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == 1) {
          toast.success('Parameter Alarm Updated successfully');
          GetParameterAlarmsLookup();
          setParameterAlarmList(true);
        } else if (responseJson == 2) {
          toast.error('Parameter Alarm already exist with given Parameter Name. Please try with another Parameter Name.');
        } else {
          toast.error('Unable to update the Parameter Alarm. Please contact adminstrator');
        }
      }).catch((error) => toast.error('Unable to update the Parameter Alarm. Please contact adminstrator'));
  }

  const EditParameterAlarm = function (param) {
    setParameterAlarmList(false);
    setParameterAlarmId(param.id);
    let parameterAlarm=ParameterAlarmData.filter(x=>x.deviceID==param.deviceID && x.parameterID==param.parameterID);
    let enable=ParameterAlarm.length>0 && ParameterAlarmData[0].isEnable==1?true:false;
    setEnableValue(enable);
    setChangedAlarmData([]);
    setTimeout(() => {
      document.getElementById("devicename").value = param.deviceID;  
      ChangeDeviceName();
      setTimeout(function () {
        document.getElementById("parametername").value = param.parameterID;
      }, 1);
     // document.getElementById("status").value = param.status;

      var AlarmArray = [];
     
      setChangedAlarmData(ParameterAlarm);
      var AlarmChecked = [];
      for (var h = 0; h < parameterAlarm.length; h++) {
          var alarmid = ParameterAlarmData[h].customerAlarmID;
          AlarmChecked.push(alarmid);
      }
      setTimeout(function () {
        $('#alarmname').val(AlarmChecked);
        $('#alarmname').SumoSelect({
          triggerChangeCombined: true, placeholder: 'Select Alarm', floatWidth: 200, selectAll: true,
          search: true
        });

      }, 100);

    }, 1);

  }

  $('.container').on('change', '#alarmname', function () {
    setCheckedValues(this.value);
  });

  const ChangeDeviceName = function () {
    setChangedAlarmData([]);
    setParameterList([]);
   document.getElementById("parametername").value="";
    let deviceid = document.getElementById("devicename").value;
    var AlarmArray = [];
    var parameters = Parameter.filter(x => x.deviceID == deviceid);
    setParameterList(parameters);
    setTimeout(function () {
      $('.alarmname')[0].sumo.reload();
    }, 10);
  }

  const ChangeParameterName = function () {
    setChangedAlarmData([]);
    let parameterid = document.getElementById("parametername").value;
   /*  var AlarmArray = [];
      AlarmArray = ParameterAlarm.filter(x => x.parameterID == parameterid); */
    setChangedAlarmData(ParameterAlarm);

    setTimeout(function () {
      $('.alarmname')[0].sumo.reload();
    }, 10);
  }

  const ChangeParameterAlarm = function (checked) {
    //setCheckedValues(checked.target.value.replace(/\r?\n/g, ""));
    setCheckedValues(checked.target.value);

  }

  return (
    <main id="main" className="main" >
      <div className="container">
        <div className="pagetitle">
          {!ParameterAlarmList && ParameterAlarmId == 0 && (
            <h1>Add Parameter Alarms</h1>
          )}
          {!ParameterAlarmList && ParameterAlarmId != 0 && (
            <h1>Update Parameter Alarms</h1>
          )}
          {ParameterAlarmList && (
            <h1>Parameter Alarm List</h1>
          )}
        </div>
        <section className="section">
          <div className="container">
            <div className="me-2 mb-2 float-end">
              {ParameterAlarmList && (
                <span className="operation_class mx-2" onClick={() => AddParameterAlarmchange()}><i className="bi bi-plus-circle-fill"></i> <span>Create New Parameter Alarm</span></span>
              )}
              {!ParameterAlarmList && (
                <span className="operation_class mx-2" onClick={() => AddParameterAlarmchange('gridlist')}><i className="bi bi-card-list"></i> <span>View Parameter Alarms</span></span>
              )}
            </div>
            {!ParameterAlarmList && (
              <form id="ParameterAlarmsform" className="row" noValidate>
                <div className="col-md-12 mb-3">
                  <label for="devicename" className="form-label">Device Name:</label>
                  <select className="form-select" id="devicename" onChange={ChangeDeviceName} required>
                    <option selected value="">Select Device Name</option>
                    {Devices.map((x, y) =>
                      <option value={x.id} key={y} >{x.deviceName}</option>
                    )}
                  </select>
                  <div class="invalid-feedback">Please select Device name</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="parametername" className="form-label">Parameter Name:</label>
                  <select className="form-select" id="parametername" onChange={ChangeParameterName} required>
                    <option selected value="">Select Parameter Name</option>
                    {ParameterList.map((x, y) =>
                      <option value={x.id} key={y} >{x.parameterName}</option>
                    )}
                  </select>
                  <div class="invalid-feedback">Please select Parameter name</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label className="form-label">Alarm Name:</label>
                  <select className="form-select alarmname" id="alarmname" multiple="multiple" onChange={ChangeParameterAlarm}>
                    {ChangedAlarmData.map((x, y) =>
                      <option value={x.id} key={y} >{x.description}</option>
                    )}
                  </select>
                  <div class="invalid-feedback">Please select Alarm name</div>
                </div>
               {/*  <div className="col-md-12 mb-3">
                  <label for="Enable" className="form-label">Status:</label>
                  <input type="number" className="form-control" id="status" placeholder="Enter Status" />
                </div> */}

                <div className="col-md-6 mb-3">
                  <label for="Enable" className="form-label">Enable: </label>
                  <div className="form-check d-inline-block form-switch ms-2">
                    <input className="form-check-input" type="checkbox" role="switch" id="Enableid" onChange={(e) => setEnableValue(e.target.checked)} defaultChecked={EnableValue} />
                    {EnableValue && (
                      <label className="form-check-label" for="flexSwitchCheckChecked">True</label>
                    )}
                    {!EnableValue && (
                      <label className="form-check-label" for="flexSwitchCheckChecked">False</label>
                    )}
                  </div>
                </div>
                {/* <div className="col-md-12 mb-3">
                                <label for="isenabled" className="form-label">IsEnabled:</label>
                                <input type="number" className="form-control" id="isenable" placeholder="Enter isEnabled" />
                            </div> */}


                <div className="col-md-12 text-center">
                  {!ParameterAlarmList && ParameterAlarmId == 0 && (
                    <button className="btn btn-primary" onClick={ParameterAlarmadd} type="button">Add Parameter Alarm</button>
                  )}
                  {!ParameterAlarmList && ParameterAlarmId != 0 && (
                    <button className="btn btn-primary" onClick={UpdateParameterAlarm} type="button">Update Parameter Alarm</button>
                  )}
                </div>
              </form>
            )}

            {ParameterAlarmList && (
              <div className="jsGrid" ref={gridRefjsgridreport} />
            )}

          </div>
        </section>
      </div>
    </main>
  )
}
export default ParameterAlarams;