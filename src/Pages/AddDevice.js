
import React, { Component, useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";
function AddDevice() {
  const $ = window.jQuery;
  const gridRefjsgridreport = useRef();
  const [ListStations, setListStations] = useState([]);
  const [ListDevices, setListDevices] = useState([]);
  const [DeviceList, setDeviceList] = useState(true);
  const [ListDeviceModels, setListDeviceModels] = useState([]);
  const [DeviceId, setDeviceId] = useState(0);

  const Deviceaddvalidation = function (StationID, DeviceName, DeviceModel, IPAddress, Port, Type) {
    let isvalid = true;
    let form = document.querySelectorAll('#AddDeviceform')[0];
    if (StationID == "") {
      //toast.warning('Please select Station');
      form.classList.add('was-validated');
      isvalid = false;
    } else if (DeviceName == "") {
      //toast.warning('Please enter device name');
      form.classList.add('was-validated');
      isvalid = false;
    } else if (DeviceModel == "") {
      //toast.warning('Please select device model');
      form.classList.add('was-validated');
      isvalid = false;
    } else if (IPAddress == "") {
      //toast.warning('Please enter ipaddress');
      form.classList.add('was-validated');
      isvalid = false;
    } else if (Port == "") {
      //toast.warning('Please enter port');
      form.classList.add('was-validated');
      isvalid = false;
    } else if (Type == "") {
      //toast.warning('Please enter type');
      form.classList.add('was-validated');
      isvalid = false;
    }
    return isvalid;
  }
  const Deviceadd = function () {
    let StationID = document.getElementById("stationname").value;
    let DeviceName = document.getElementById("devicename").value;
    let DeviceModel = document.getElementById("devicemodel").value;
    let IPAddress = document.getElementById("ipaddress").value;
    let Port = document.getElementById("port").value;
    let Type = document.getElementById("type").value;
    let validation = Deviceaddvalidation(StationID, DeviceName, DeviceModel, IPAddress, Port, Type);
    if (!validation) {
      return false;
    }
    fetch(process.env.REACT_APP_WSurl + 'api/Devices', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ StationID: StationID, DeviceName: DeviceName, DeviceModel: DeviceModel, IPAddress: IPAddress, Port: Port, Type: Type }),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == "Deviceadd") {
          toast.success('Device added successfully');
          GetDevices();
          setDeviceList(true);
        } else if (responseJson == "Deviceexist") {
          toast.error('Device already exist with given Device Name. Please try with another Device Name.');
        } else {
          toast.error('Unable to add the Device. Please contact adminstrator');
        }
      }).catch((error) => toast.error('Unable to add the Device. Please contact adminstrator'));
  }

  const EditStation = function (param) {
    setDeviceList(false);
    setDeviceId(param.id)
    setTimeout(() => {
      document.getElementById("stationname").value = param.stationID;
      document.getElementById("devicename").value = param.deviceName;
      document.getElementById("devicemodel").value = param.deviceModel;
      document.getElementById("ipaddress").value = param.ipAddress;
      document.getElementById("port").value = param.port;
      document.getElementById("type").value = param.type;
    }, 10);

  }

  const UpdateStation = function () {
    let StationID = document.getElementById("stationname").value;
    let DeviceName = document.getElementById("devicename").value;
    let DeviceModel = document.getElementById("devicemodel").value;
    let IPAddress = document.getElementById("ipaddress").value;
    let Port = document.getElementById("port").value;
    let Type = document.getElementById("type").value;
    let validation = Deviceaddvalidation(StationID, DeviceName, DeviceModel, IPAddress, Port, Type);
    if (!validation) {
      return false;
    }
    fetch(process.env.REACT_APP_WSurl + 'api/Devices/' + DeviceId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ StationID: StationID, DeviceName: DeviceName, DeviceModel: DeviceModel, IPAddress: IPAddress, Port: Port, Type: Type, ID: DeviceId }),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == 1) {
          toast.success('Device Updated successfully');
          GetDevices();
          setDeviceList(true);
        } else if (responseJson == 2) {
          toast.error('Device already exist with given Device Name. Please try with another Device Name.');
        } else {
          toast.error('Unable to update the Device. Please contact adminstrator');
        }
      }).catch((error) => toast.error('Unable to update the Device. Please contact adminstrator'));
  }

  const DeleteStation = function (item) {
    Swal.fire({
      title: "Are you sure?",
      text: ("You want to delete this Device !"),
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5cb85c",
      confirmButtonText: "Yes",
      closeOnConfirm: false
    })
      .then(function (isConfirm) {
        if (isConfirm) {
          let id = item.id;
          fetch(process.env.REACT_APP_WSurl + 'api/Devices/' + id, {
            method: 'DELETE'
          }).then((response) => response.json())
            .then((responseJson) => {
              if (responseJson == 1) {
                toast.success('Device deleted successfully')
                GetDevices();
              } else {
                toast.error('Unable to delete Device. Please contact adminstrator');
              }
            }).catch((error) => toast.error('Unable to delete Device. Please contact adminstrator'));
        }
      });
  }
  const GetLookupdata = function () {
    fetch(process.env.REACT_APP_WSurl + "api/Deviceslookup", {
      method: 'GET',
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          setListStations(data.listStations);
          setListDevices(data.listDevices);
          setListDeviceModels(data.listDeviceModels);
        }
      }).catch((error) => toast.error('Unable to get the Devices lookup list. Please contact adminstrator'));
  }
  const GetDevices = function () {
    fetch(process.env.REACT_APP_WSurl + "api/Devices", {
      method: 'GET',
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          setListDevices(data);
        }
      }).catch((error) => toast.error('Unable to get the devices list. Please contact adminstrator'));
  }
  useEffect(() => {
    initializeJsGrid();
  });
  useEffect(() => {
    GetLookupdata();
  }, [])
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
        data: ListDevices,
        loadData: function (filter) {
          $(".jsgrid-filter-row input:text").addClass("form-control").addClass("form-control-sm");
          $(".jsgrid-filter-row select").addClass("custom-select").addClass("custom-select-sm");
          return $.grep(this.data, function (item) {
            return ((!filter.stationName || item.stationName.toUpperCase().indexOf(filter.stationName.toUpperCase()) >= 0)
              && (!filter.stationID || item.stationID === filter.stationID)
              && (!filter.deviceModel || item.deviceModel === filter.deviceModel)
              && (!filter.deviceName || item.deviceName.toUpperCase().indexOf(filter.deviceName.toUpperCase()) >= 0)
              && (!filter.ipAddress || item.ipAddress.toUpperCase().indexOf(filter.ipAddress.toUpperCase()) >= 0)
              && (!filter.port || item.port.toUpperCase().indexOf(filter.port.toUpperCase()) >= 0)
              && (!filter.type || item.type.toUpperCase().indexOf(filter.type.toUpperCase()) >= 0)
            );
          });
        }
      },
      fields: [
        { name: "stationID", title: "Station Name", type: "select", items: ListStations, valueField: "id", textField: "stationName", width: 200 },
        { name: "deviceName", title: "Device Name", type: "text" },
        { name: "deviceModel", title: "Device Model", type: "select", items: ListDeviceModels, valueField: "id", textField: "deviceModelName", width: 200 },
        { name: "ipAddress", title: "IP Address", type: "text" },
        { name: "port", title: "Port", type: "text" },
        { name: "type", title: "Type", type: "text" },
        {
          type: "control", width: 100, editButton: false, deleteButton: false,
          itemTemplate: function (value, item) {
            // var $result = gridRefjsgrid.current.fields.control.prototype.itemTemplate.apply(this, arguments);

            var $customEditButton = $("<button>").attr({ class: "customGridEditbutton jsgrid-button jsgrid-edit-button" })
              .click(function (e) {
                EditStation(item);
                /* alert("ID: " + item.id); */
                e.stopPropagation();
              });

            var $customDeleteButton = $("<button>").attr({ class: "customGridDeletebutton jsgrid-button jsgrid-delete-button" })
              .click(function (e) {
                DeleteStation(item);
                e.stopPropagation();
              });

            return $("<div>").append($customEditButton).append($customDeleteButton);
            //return $result.add($customButton);
          }
        },
      ]
    });
  }
  const AddStationchange = function (param) {
    if (param) {
      setDeviceList(true);
    } else {
      setDeviceList(false);
      setDeviceId(0);
    }
  }
  return (
    <main id="main" className="main" >
      <div className="container">
        <div className="pagetitle">
          {!DeviceList && DeviceId == 0 && (
            <h1>Add Device</h1>
          )}
          {!DeviceList && DeviceId != 0 && (
            <h1>Update Device</h1>
          )}
          {DeviceList && (
            <h1>Devices List</h1>
          )}
        </div>
        <section className="section">
          <div className="container">
            <div className="me-2 mb-2 float-end">
              {DeviceList && (
                <span className="operation_class mx-2" onClick={() => AddStationchange()}><i className="bi bi-plus-circle-fill"></i> <span>Add</span></span>
              )}
              {!DeviceList && (
                <span className="operation_class mx-2" onClick={() => AddStationchange('gridlist')}><i className="bi bi-card-list"></i> <span>List</span></span>
              )}
            </div>
            {!DeviceList && (
              <form id="AddDeviceform" className="row" noValidate>
                <div className="col-md-12 mb-3">
                  <label for="StationName" className="form-label">Station Name:</label>
                  <select className="form-select required" id="stationname" data-toggle="tooltip" data-placement="top" title="Enter Station Name" required>
                    <option selected>Please select station name</option>
                    {ListStations.map((x, y) =>
                      <option value={x.id} key={y} >{x.stationName}</option>
                    )}
                  </select>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="devicename" className="form-label">Device Name:</label>
                  <input type="text" className="form-control required" id="devicename" placeholder="Please enter Device Name" data-toggle="tooltip" data-placement="top" title="Enter Device Name" required />
                </div>
                <div className="col-md-12 mb-3">
                  <label for="devicemodel" className="form-label">Device Model:</label>
                  <select className="form-select required" id="devicemodel" data-toggle="tooltip" data-placement="top" title="Select Device Model" required>
                    <option selected>Please select Device Model</option>
                    {ListDeviceModels.map((x, y) =>
                      <option value={x.id} key={y} >{x.deviceModelName}</option>
                    )}
                  </select>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="ipaddress" className="form-label">IP Address:</label>
                  <input type="text" className="form-control required" id="ipaddress" placeholder="Please enter IP Address" data-toggle="tooltip" data-placement="top" title="Enter IP Address" required />
                </div>
                <div className="col-md-12 mb-3">
                  <label for="port" className="form-label">Port:</label>
                  <input type="text" className="form-control required" id="port" placeholder="Please enter port" data-toggle="tooltip" data-placement="top" title="Enter Port" required />
                </div>
                <div className="col-md-12 mb-3">
                  <label for="type" className="form-label">Type:</label>
                  <select className="form-select required" id="type" data-toggle="tooltip" data-placement="top" title="Select Type" required>
                    <option selected value="">Please select Type</option>
                    <option value="modbus"  >Modbus</option>
                  </select>
                </div>
                <div className="col-md-12 text-center">
                  {!DeviceList && DeviceId == 0 && (
                    <button className="btn btn-primary" onClick={Deviceadd} type="button">Add Device</button>
                  )}
                  {!DeviceList && DeviceId != 0 && (
                    <button className="btn btn-primary" onClick={UpdateStation} type="button">Update Device</button>
                  )}
                </div>
              </form>
            )}
            {DeviceList && (
              <div className="jsGrid" ref={gridRefjsgridreport} />
            )}
          </div>

        </section>
      </div>
    </main>
  );
}
export default AddDevice;