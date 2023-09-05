import React, { Component, useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";
import CommonFunctions from "../utils/CommonFunctions";
function DeviceAlarams() {
  const $ = window.jQuery;
  const gridRefjsgridreport = useRef();
  const [DeviceAlarmList, setDeviceAlarmList] = useState(true);
  const [DeviceAlarmId, setDeviceAlarmId] = useState(0);
  const [AllLookpdata, setAllLookpdata] = useState(null);
  const [Model, setModel] = useState([]);
  const [Devices, setDevices] = useState([]);
  const [DeviceAlarm, setDeviceAlarm] = useState([]);
  const [DeviceAlarmData, setDeviceAlarmData] = useState([]);
  const [CheckedValues, setCheckedValues] = useState([]);
  const [ChangedAlarmData, setChangedAlarmData] = useState([]);
  const [EnableValue, setEnableValue]=useState(true);
  var dataForGrid = [];

  useEffect(() => {
    GetDeviceAlarmsLookup();
  }, []);
  useEffect(() => {
    initializeJsGrid();
  });


  const GetDeviceAlarmsLookup = function () {
    fetch(CommonFunctions.getWebApiUrl() + "api/DevicesAlarmlookup", {
      method: 'GET',
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          setAllLookpdata(data);
          setDevices(data.listDevices);
          setModel(data.listDeviceModels);
          setDeviceAlarmData(data.listDeviceAlarm);
          var Alarmlist = [];
          data.listAlarms.filter(function (item) {
            var i = Alarmlist.findIndex(x => (x.id == item.id));
            if (i <= -1) {
              Alarmlist.push(item);
            }
          });
          setDeviceAlarm(Alarmlist);
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
    DeviceAlarmData.filter(function (item) {
      var i = dataForGrid.findIndex(x => (x.deviceId == item.deviceId && x.modelId == item.modelId));
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
      data: Devices,
      //data:dataForGrid,

      fields: [
        { name: "deviceName", title: "Device Name",align:"left", type: "text" },
        { name: "deviceModel", title: "Model ID",align:"left", type: "select", items: Model, valueField: "id", textField: "deviceModelName" },
        {
          type: "control", width: 100, editButton: false, deleteButton: false,
          itemTemplate: function (value, item) {
            // var $result = gridRefjsgrid.current.fields.control.prototype.itemTemplate.apply(this, arguments);

            var $customEditButton = $("<button>").attr({ class: "customGridEditbutton jsgrid-button jsgrid-edit-button" })
              .click(function (e) {
                EditDeviceAlarm(item);
                /* alert("ID: " + item.id); */
                e.stopPropagation();
              });

            var $customDeleteButton = $("<button>").attr({ class: "customGridDeletebutton jsgrid-button jsgrid-delete-button" })
              .click(function (e) {
                DeleteDeviceAlarm(item);
                e.stopPropagation();
              });

            return $("<div>").append($customEditButton).append($customDeleteButton);
            //return $result.add($customButton);
          }
        },
      ]
    });
  }

  const DeleteDeviceAlarm = function (item) {
    Swal.fire({
      title: "Are you sure?",
      text: ("You want to delete this Device Alarm !"),
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5cb85c",
      confirmButtonText: "Yes",
      closeOnConfirm: false
    })
      .then(function (isConfirm) {
        if (isConfirm.isConfirmed) {
          let id = item.id;
          fetch(CommonFunctions.getWebApiUrl() + 'api/DeleteDeviceAlarm/' + id, {
            method: 'DELETE'
          }).then((response) => response.json())
            .then((responseJson) => {
              if (responseJson == 1) {
                toast.success('Device Alarm deleted successfully')
                GetDeviceAlarmsLookup();
              } else {
                toast.error('Unable to delete Device Alarm. Please contact adminstrator');
              }
            }).catch((error) => toast.error('Unable to delete Device Alarm. Please contact adminstrator'));
        }
      });
  }

  const AddDeviceAlarmchange = function (param) {
    if (param) {
      setDeviceAlarmList(true);
    }
    else {
      setDeviceAlarmList(false);
      setDeviceAlarmId(0);

      setTimeout(function () {
        $('#alarmname').SumoSelect({
          triggerChangeCombined: true, placeholder: 'Select Alarm', floatWidth: 200, selectAll: true,
          search: true
        });
      }, 100);
    }
  }
  const DeviceAlarmaddvalidation = function (deviceid, modelid, alarmid) {
    let isvalid = true;
    let form = document.querySelectorAll('#DeviceAlarmsform')[0];
    if (deviceid == "") {
      //toast.warning('Please enter Station Name');
      form.classList.add('was-validated');
      isvalid = false;
    } else if (modelid == "") {
      //toast.warning('Please enter Descriptin');
      form.classList.add('was-validated');
      isvalid = false;
    } else if (alarmid.length == 0) {
      form.classList.add('was-validated');
      isvalid = false;
    }
    return isvalid;
  }

  const DeviceAlarmadd = function () {
    let deviceid = document.getElementById("devicename").value;
    let modelid = document.getElementById("modelname").value;
    let alarmid = $("#alarmname").val();
    let enable = EnableValue?1:0;
    var parameterArray = [];
    for (var i = 0; i < alarmid.length; i++) {
      parameterArray.push({ DeviceId: deviceid, ModelId: modelid, AlarmId: alarmid[i], IsEnable: enable });
    }

    let validation = DeviceAlarmaddvalidation(deviceid, modelid, alarmid);
    if (!validation) {
      return false;
    }

    fetch(CommonFunctions.getWebApiUrl() + 'api/DevicesAlarm', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(parameterArray),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == "DeviceAlarmadd") {
          toast.success('Device Alarm added successfully');
          GetDeviceAlarmsLookup();
          setDeviceAlarmList(true);
        } else if (responseJson == "DeviceAlarmexist") {
          toast.error('Device Alarm already exist with given Device Name. Please try with another Device Name.');
        } else {
          toast.error('Unable to add the Device Alarm. Please contact adminstrator');
        }
      }).catch((error) => toast.error('Unable to add the Device Alarm. Please contact adminstrator'));
  }

  const UpdateDeviceAlarm = function () {
    let deviceid = document.getElementById("devicename").value;
    let modelid = document.getElementById("modelname").value;
    let alarmid = $("#alarmname").val();
    let enable = EnableValue?1:0;

    var parameterArray = [];
    for (var i = 0; i < alarmid.length; i++) {
      parameterArray.push({ DeviceId: deviceid, ModelId: modelid, AlarmId: alarmid[i], IsEnable: enable });
    }

    let validation = DeviceAlarmaddvalidation(deviceid, modelid, alarmid);
    if (!validation) {
      return false;
    }
    fetch(CommonFunctions.getWebApiUrl() + 'api/DeviceAlarm/' + DeviceAlarmId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(parameterArray),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == 1) {
          toast.success('Device Alarm Updated successfully');
          GetDeviceAlarmsLookup();
          setDeviceAlarmList(true);
        } else if (responseJson == 2) {
          toast.error('Device Alarm already exist with given Device Name. Please try with another Device Name.');
        } else {
          toast.error('Unable to update the Device Alarm. Please contact adminstrator');
        }
      }).catch((error) => toast.error('Unable to update the Device Alarm. Please contact adminstrator'));
  }
  const EditDeviceAlarm = function (param) {
    setDeviceAlarmList(false);
    setDeviceAlarmId(param.id);
    let devicealarm=DeviceAlarmData.filter(x=>x.deviceId==param.id);
    let enable=devicealarm.length>0 && DeviceAlarmData[0].isEnable==1?true:false;
    setEnableValue(enable);
    setChangedAlarmData([]);
    setTimeout(() => {
      document.getElementById("devicename").value = param.id;
      document.getElementById("modelname").value = param.deviceModel;
     // document.getElementById("status").value = param.status;

      var AlarmArray = [];
      var devicemodelid = Devices.filter(x => x.id == param.id);
      if (devicemodelid.length > 0) {
        AlarmArray = DeviceAlarm.filter(x => x.deviceModelId == devicemodelid[0].deviceModel);
      }
      setChangedAlarmData(AlarmArray);
      var AlarmChecked = [];
      for (var h = 0; h < DeviceAlarmData.length; h++) {
        if (DeviceAlarmData[h].modelId == devicemodelid[0].deviceModel) {
          var alarmid = DeviceAlarmData[h].alarmId;
          AlarmChecked.push(alarmid);
        }
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
    let deviceid = document.getElementById("devicename").value;
    var AlarmArray = [];
    var devicemodelid = Devices.filter(x => x.id == deviceid);
    if (devicemodelid.length > 0) {
      AlarmArray = DeviceAlarm.filter(x => x.deviceModelId == devicemodelid[0].deviceModel);
    }
    setChangedAlarmData(AlarmArray);

    setTimeout(function () {
      $('.alarmname')[0].sumo.reload();
    }, 10);
  }

  const ChangeDeviceAlarm = function (checked) {
    //setCheckedValues(checked.target.value.replace(/\r?\n/g, ""));
    setCheckedValues(checked.target.value);

  }

  return (
    <main id="main" className="main" >
      <div className="container">
        <div className="pagetitle">
          {!DeviceAlarmList && DeviceAlarmId == 0 && (
            <h1>Add Device Alarms</h1>
          )}
          {!DeviceAlarmList && DeviceAlarmId != 0 && (
            <h1>Update Device Alarms</h1>
          )}
          {DeviceAlarmList && (
            <h1>Device Alarm List</h1>
          )}
        </div>
        <section className="section">
          <div className="container">
            <div className="me-2 mb-2 float-end">
              {DeviceAlarmList && (
                <span className="operation_class mx-2" onClick={() => AddDeviceAlarmchange()}><i className="bi bi-plus-circle-fill"></i> <span>Create New Device Alarm</span></span>
              )}
              {!DeviceAlarmList && (
                <span className="operation_class mx-2" onClick={() => AddDeviceAlarmchange('gridlist')}><i className="bi bi-card-list"></i> <span>View Device Alarms</span></span>
              )}
            </div>
            {!DeviceAlarmList && (
              <form id="DeviceAlarmsform" className="row" noValidate>
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
                  <label for="modelname" className="form-label">Model Name:</label>
                  <select className="form-select" id="modelname" required>
                    <option selected value="">Select Model Name</option>
                    {Model.map((x, y) =>
                      <option value={x.id} key={y} >{x.deviceModelName}</option>
                    )}
                  </select>
                  <div class="invalid-feedback">Please select Model name</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label className="form-label">Alarm Name:</label>
                  <select className="form-select alarmname" id="alarmname" multiple="multiple" onChange={ChangeDeviceAlarm}>
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
                  {!DeviceAlarmList && DeviceAlarmId == 0 && (
                    <button className="btn btn-primary" onClick={DeviceAlarmadd} type="button">Add Device Alarm</button>
                  )}
                  {!DeviceAlarmList && DeviceAlarmId != 0 && (
                    <button className="btn btn-primary" onClick={UpdateDeviceAlarm} type="button">Update Device</button>
                  )}
                </div>
              </form>
            )}

            {DeviceAlarmList && (
              <div className="jsGrid" ref={gridRefjsgridreport} />
            )}

          </div>
        </section>
      </div>
    </main>
  )
}
export default DeviceAlarams;