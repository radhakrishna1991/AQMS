
import React, { Component, useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";
function AddParameter() {
  const $ = window.jQuery;
  const gridRefjsgridreport = useRef();
  const [ListStations, setListStations] = useState([]);
  const [ListDevices, setListDevices] = useState([]);
  const [ListDrivers, setListDrivers] = useState([]);
  const [ListReportedUnits, setListReportedUnits] = useState([]);
  const [ListdeviceDrivers, setListdeviceDrivers] = useState([]);
  const [Listparameters, setListparameters] = useState([]);
  const [parameterList, setparameterList] = useState(true);
  const [parameterId, setparameterId] = useState(0);
  const [Status,setStatus]=useState(true);
  const currentUser = JSON.parse(sessionStorage.getItem('UserData'));

  const parameteraddvalidation = function (StationID, DeviceID, DriverID, ParameterName, PollingInterval, AvgInterval, Unit, ScaleFactor) {
    let isvalid = true;
    let form = document.querySelectorAll('#AddParametersform')[0];
    if (StationID == "") {
      //toast.warning('Please select Station');
      form.classList.add('was-validated');
      isvalid = false;
    } else if (DeviceID == "") {
      //toast.warning('Please select device name');
      form.classList.add('was-validated');
      isvalid = false;
    } else if (DriverID == "") {
      //toast.warning('Please select driver name');
      form.classList.add('was-validated');
      isvalid = false;
    } else if (ParameterName == "") {
      //toast.warning('Please enter parameter name');
      form.classList.add('was-validated');
      isvalid = false;
    } else if (Unit == "") {
      //toast.warning('Please select units');
      form.classList.add('was-validated');
      isvalid = false;
    } else if (ScaleFactor == "") {
      //toast.warning('Please enter scale factor');
      form.classList.add('was-validated');
      isvalid = false;
    } else if (PollingInterval == "") {
      //toast.warning('Please enter polling interval');
      form.classList.add('was-validated');
      isvalid = false;
    } else if (AvgInterval == "") {
      //toast.warning('Please enter average interval');
      form.classList.add('was-validated');
      isvalid = false;
    }
    return isvalid;
  }
  const parameteradd = function () {
    let StationID = document.getElementById("stationname").value;
    let DeviceID = document.getElementById("devicename").value;
    let DriverID = document.getElementById("drivername").value;
    let ParameterName = document.getElementById("parametername").value;
    let ScaleFactor = document.getElementById("scalefactor").value;
    let PollingInterval = document.getElementById("pollinginterval").value;
    let AvgInterval = document.getElementById("avginterval").value;
    let UnitID = document.getElementById("unit").value;    
    let CoefA=document.getElementById('coefa').value;
    let CoefB=document.getElementById('coefb').value;
    let CreatedBy = currentUser.id;
    let ModifiedBy = currentUser.id;
    let status = Status?1:0;
    let validation = parameteraddvalidation(StationID, DeviceID, DriverID, ParameterName, PollingInterval, AvgInterval, UnitID, ScaleFactor, CoefA, CoefB);
    if (!validation) {
      return false;
    }
    fetch(process.env.REACT_APP_WSurl + 'api/ParametersAdd', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ StationID: StationID, DeviceID: DeviceID, DriverID: DriverID, ParameterName: ParameterName, PollingInterval: PollingInterval, AvgInterval: AvgInterval, CoefA:CoefA, CoefB:CoefB, UnitID: UnitID, ScaleFactor: ScaleFactor,Status:status,CreatedBy:CreatedBy,ModifiedBy:ModifiedBy }),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == "Parameteradd") {
          toast.success('Parameter added successfully');
          Getparameters();
          setparameterList(true);
        } else if (responseJson == "Parameterexist") {
          toast.error('Parameter already exist with given parameter Name. Please try with another parameter Name.');
        } else {
          toast.error('Unable to add the parameter. Please contact adminstrator');
        }
      }).catch((error) => toast.error('Unable to add the parameter. Please contact adminstrator'));
  }

  const Editparameter = function (param) {
    setparameterList(false);
    setparameterId(param.id)
    setStatus(param.status==1?true:false)
    setTimeout(() => {
      document.getElementById("stationname").value = param.stationID;
      document.getElementById("devicename").value = param.deviceID;
      Deviceschange();
      document.getElementById("drivername").value = param.driverID;
      document.getElementById("parametername").value = param.parameterName;
      document.getElementById("pollinginterval").value = param.pollingInterval;
      document.getElementById("avginterval").value = param.avgInterval;
      document.getElementById("unit").value = param.unitID;
      document.getElementById("scalefactor").value=param.scaleFactor;
      document.getElementById("coefa").value=param.coefA;
      document.getElementById("coefb").value=param.coefB;
    }, 10);

  }

  const Updateparameter = function () {
    let StationID = document.getElementById("stationname").value;
    let DeviceID = document.getElementById("devicename").value;
    let DriverID = document.getElementById("drivername").value;
    let ScaleFactor = document.getElementById("scalefactor").value;
    let ParameterName = document.getElementById("parametername").value;
    let PollingInterval = document.getElementById("pollinginterval").value;
    let AvgInterval = document.getElementById("avginterval").value;
    let UnitID = document.getElementById("unit").value;
    let CoefA=document.getElementById('coefa').value;
    let CoefB=document.getElementById('coefb').value;
    let CreatedBy = currentUser.id;
    let ModifiedBy = currentUser.id;
    let status = Status?1:0;
    let validation = parameteraddvalidation(StationID, DeviceID, DriverID, ParameterName, PollingInterval, AvgInterval, UnitID, CoefA, CoefB);
    if (!validation) {
      return false;
    }
    fetch(process.env.REACT_APP_WSurl + 'api/ParametersUpdate/' + parameterId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ StationID: StationID, DeviceID: DeviceID, DriverID: DriverID, ParameterName: ParameterName, PollingInterval: PollingInterval, AvgInterval: AvgInterval, CoefA:CoefA, CoefB:CoefB, UnitID: UnitID, ID: parameterId, ScaleFactor: ScaleFactor,Status:status,CreatedBy:CreatedBy,ModifiedBy:ModifiedBy }),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == 1) {
          toast.success('Parameter updated successfully');
          Getparameters();
          setparameterList(true);
        } else if (responseJson == 2) {
          toast.error('Parameter already exist with given parameter Name. Please try with another parameter Name.');
        } else {
          toast.error('Unable to update the parameter. Please contact adminstrator');
        }
      }).catch((error) => toast.error('Unable to update the parameter. Please contact adminstrator'));
  }

  const Deleteparameter = function (item) {
    Swal.fire({
      title: "Are you sure?",
      text: ("You want to delete this parameter !"),
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5cb85c",
      confirmButtonText: "Yes",
      closeOnConfirm: false
    })
      .then(function (isConfirm) {
        if (isConfirm.isConfirmed) {
          let id = item.id;
          fetch(process.env.REACT_APP_WSurl + 'api/ParametersDelete/' + id, {
            method: 'DELETE'
          }).then((response) => response.json())
            .then((responseJson) => {
              if (responseJson == 1) {
                toast.success('Parameter deleted successfully')
                Getparameters();
              } else {
                toast.error('Unable to delete parameter. Please contact adminstrator');
              }
            }).catch((error) => toast.error('Unable to delete parameter. Please contact adminstrator'));
        }
      });
  }

  const Getparameters = function () {
    fetch(process.env.REACT_APP_WSurl + "api/ParametersList", {
      method: 'GET',
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          setListparameters(data);
        }
      }).catch((error) => toast.error('Unable to get the parameters list. Please contact adminstrator'));
  }

  const GetparametersLookup = function () {
    fetch(process.env.REACT_APP_WSurl + "api/Parameters/ParameterLookup", {
      method: 'GET',
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          setListDevices(data.listDevices);
          setListStations(data.listStations);
          setListparameters(data.listParameters);
          setListReportedUnits(data.listReportedunits);
          setListDrivers(data.listDrivers);
        }
      }).catch((error) => toast.error('Unable to get the parameters list. Please contact adminstrator'));
  }
  useEffect(() => {
    initializeJsGrid();
  });
  useEffect(() => {
    GetparametersLookup();
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
        data: Listparameters,
        loadData: function (filter) {
          $(".jsgrid-filter-row input:text").addClass("form-control").addClass("form-control-sm");
          $(".jsgrid-filter-row select").addClass("custom-select").addClass("custom-select-sm");
          return $.grep(this.data, function (item) {
            return ((!filter.stationID || item.stationID === filter.stationID)
              && (!filter.deviceID || item.deviceID === filter.deviceID)
              && (!filter.unitID || item.unitID === filter.unitID)
              && (!filter.driverID || item.driverID === filter.driverID)
              && (!filter.parameterName || item.parameterName.toUpperCase().indexOf(filter.parameterName.toUpperCase()) >= 0)
              && (!filter.unit || item.unit.toUpperCase().indexOf(filter.unit.toUpperCase()) >= 0)
              && (!filter.pollingInterval || item.pollingInterval.toUpperCase().indexOf(filter.pollingInterval.toUpperCase()) >= 0)
              && (!filter.avgInterval || item.avgInterval.toUpperCase().indexOf(filter.avgInterval.toUpperCase()) >= 0)
            );
          });
        }
      },
      fields: [
        { name: "stationID", title: "Station Name", type: "select", items: ListStations, valueField: "id", textField: "stationName", width: 200,sorting: false, filtering: false },
        { name: "deviceID", title: "Device Name", type: "select", items: ListDevices, valueField: "id", textField: "deviceName", width: 200 },
        { name: "driverID", title: "Driver Name", type: "select", items: ListDrivers, valueField: "id", textField: "driverName", width: 200 },
        { name: "parameterName", title: "parameter Name", type: "text" },
        { name: "unitID", title: "Units", type: "select", items: ListReportedUnits, valueField: "id", textField: "unitName", width: 100 },
        { name: "pollingInterval", title: "Polling Interval", type: "text" },
        { name: "avgInterval", title: "Average Interval", type: "text" },
        {
          type: "control", width: 100, editButton: false, deleteButton: false,
          itemTemplate: function (value, item) {
            // var $result = gridRefjsgrid.current.fields.control.prototype.itemTemplate.apply(this, arguments);

            var $customEditButton = $("<button>").attr({ class: "customGridEditbutton jsgrid-button jsgrid-edit-button" })
              .click(function (e) {
                Editparameter(item);
                /* alert("ID: " + item.id); */
                e.stopPropagation();
              });

            var $customDeleteButton = $("<button>").attr({ class: "customGridDeletebutton jsgrid-button jsgrid-delete-button" })
              .click(function (e) {
                Deleteparameter(item);
                e.stopPropagation();
              });

            return $("<div>").append($customEditButton).append($customDeleteButton);
            //return $result.add($customButton);
          }
        },
      ]
    });
  }
  const Addparameterchange = function (param) {
    if (param) {
      setparameterList(true);
    } else {
      setparameterList(false);
      setparameterId(0);
    }
  }
  const Deviceschange = function () {
    setListdeviceDrivers([]);
    let DeviceID = document.getElementById("devicename").value;
    let finaldevices = ListDevices.filter(val => val.id == DeviceID);
    let finaldribers = ListDrivers.filter(val => val.deviceModelID == finaldevices[0].deviceModel);
    setListdeviceDrivers(finaldribers);
  }
  return (
    <main id="main" className="main" >
      <div className="container">
        <div className="pagetitle">
          {!parameterList && parameterId == 0 && (
            <h1>Add parameter</h1>
          )}
          {!parameterList && parameterId != 0 && (
            <h1>Update parameter</h1>
          )}
          {parameterList && (
            <h1>parameters List</h1>
          )}
        </div>
        <section className="section">
          <div className="container">
            <div className="me-2 mb-2 float-end">
              {parameterList && (
                <span className="operation_class mx-2" onClick={() => Addparameterchange()}><i className="bi bi-plus-circle-fill"></i> <span>Add</span></span>
              )}
              {!parameterList && (
                <span className="operation_class mx-2" onClick={() => Addparameterchange('gridlist')}><i className="bi bi-card-list"></i> <span>List</span></span>
              )}
            </div>
            {!parameterList && (
              <form id="AddParametersform" className="row" noValidate>
                <div className="col-md-12 mb-3">
                  <label for="StationName" className="form-label">Station Name:</label>
                  <select className="form-select" id="stationname" required>
                    <option selected value="">Select station name</option>
                    {ListStations.map((x, y) =>
                      <option value={x.id} key={y} >{x.stationName}</option>
                    )}
                  </select>
                  <div class="invalid-feedback">Please select station name</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="devicename" className="form-label">Device Name:</label>
                  <select className="form-select" id="devicename" onChange={Deviceschange} required>
                    <option selected value="">Select device name</option>
                    {ListDevices.map((x, y) =>
                      <option value={x.id} key={y} >{x.deviceName}</option>
                    )}
                  </select>
                  <div class="invalid-feedback">Please select device name</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="devicename" className="form-label">Driver Name:</label>
                  <select className="form-select" id="drivername" required>
                    <option selected value="">Select driver name</option>
                    {ListdeviceDrivers.map((x, y) =>
                      <option value={x.id} key={y} >{x.driverName}</option>
                    )}
                  </select>
                  <div class="invalid-feedback">Please select driver name</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="parametername" className="form-label">Parameter Name:</label>
                  <input type="text" className="form-control" id="parametername" placeholder="Enter parameter name" required />
                  <div class="invalid-feedback">Please enter parameter name</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="units" className="form-label">Units:</label>
                  <select className="form-select" id="unit" required>
                    <option selected value="" title="Select Units">Select unit</option>
                    {ListReportedUnits.map((x, y) =>
                      <option value={x.id} key={y} >{x.unitName}</option>
                    )}
                  </select>
                  <div class="invalid-feedback">Please select units</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="scalefactor" className="form-label">Scale Factor:</label>
                  <input type="number" className="form-control" id="scalefactor" placeholder="Enter scale factor" required />
                  <div class="invalid-feedback">Please enter scale factor</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="coefa" className="form-label">COEF A:</label>
                  <input type="number" className="form-control" id="coefa" placeholder="Enter COEF A" required />
                  <div class="invalid-feedback">Please enter COEF A</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="coefb" className="form-label">COEF B:</label>
                  <input type="number" className="form-control" id="coefb" placeholder="Enter COEF B" required />
                  <div class="invalid-feedback">Please enter COEF B</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="pollinginterval" className="form-label">Polling Interval:</label>
                  <input type="text" className="form-control" id="pollinginterval" placeholder="Enter polling interval" required />
                  <div class="invalid-feedback">Please enter polling interval</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="avginterval" className="form-label">Average Interval:</label>
                  <input type="text" className="form-control" id="avginterval" placeholder="Enter average interval" required />
                  <div class="invalid-feedback">Please enter average interval</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="Status" className="form-label">Status: </label>
                  <div className="form-check d-inline-block form-switch ms-2">
                    <input className="form-check-input" type="checkbox" role="switch" id="Status" onChange={(e) => setStatus(e.target.checked)} defaultChecked={Status} />
                    {Status && (
                      <label className="form-check-label" for="flexSwitchCheckChecked">Active</label>
                    )}
                    {!Status && (
                      <label className="form-check-label" for="flexSwitchCheckChecked">Inactive</label>
                    )}
                  </div>
                </div>
                <div className="col-md-12 text-center">
                  {!parameterList && parameterId == 0 && (
                    <button className="btn btn-primary" onClick={parameteradd} type="button">Add Parameter</button>
                  )}
                  {!parameterList && parameterId != 0 && (
                    <button className="btn btn-primary" onClick={Updateparameter} type="button">Update Parameter</button>
                  )}
                </div>
              </form>
            )}
            {parameterList && (
              <div className="jsGrid" ref={gridRefjsgridreport} />
            )}
          </div>

        </section>
      </div>
    </main>
  );
}
export default AddParameter;