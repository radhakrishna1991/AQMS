import React, { Component, useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";
import CommonFunctions from "../utils/CommonFunctions";
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
  const [Status, setStatus] = useState(true);
  const [IsDerived, setIsDerived] = useState(false);
  const [EnableParametersAlarms, setEnableParametersAlarms] = useState(false);
  
  const [ParseParamValue, setParseParamValue] = useState(true);
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
  const parameteradd = async function () {
    let StationID = document.getElementById("stationname").value;
    let DeviceID = document.getElementById("devicename").value;
    let DriverID = document.getElementById("drivername").value;
    let ParameterName = document.getElementById("parametername").value;
    let ScaleFactor = document.getElementById("scalefactor").value;
    let PollingInterval = document.getElementById("pollinginterval").value;
    let AvgInterval = document.getElementById("avginterval").value;
    let UnitID = document.getElementById("unit").value;
    let CoefA = document.getElementById('coefa').value;
    let CoefB = document.getElementById('coefb').value;
    let CreatedBy = currentUser.id;
    let ModifiedBy = currentUser.id;
    let status = Status ? 1 : 0;

    let RegisterIndex = document.getElementById("registerindex").value;
    let ParseFunction = document.getElementById("parsefunciton").value;
    let SendCommand  = document.getElementById("sendcommand").value;
    let HighHigh  = document.getElementById("highhighlimit").value;
    let High  = document.getElementById("highlimit").value;
    let LowLow  = document.getElementById("lowlowlimit").value;
    let Low  = document.getElementById("lowlimit").value;
    let Threshold  = document.getElementById("thresholdlimit").value;
    let enableParametersAlarms  = EnableParametersAlarms ? true : false;
    let ParseParmvalue = ParseParamValue ? true : false;
    let isDerived = IsDerived ? 1 : 0;


    let validation = parameteraddvalidation(StationID, DeviceID, DriverID, ParameterName, PollingInterval, AvgInterval, UnitID, ScaleFactor, CoefA, CoefB);
    if (!validation) {
      return false;
    }
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + 'api/ParametersAdd', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: authHeader.Authorization,
        'app-origin':authHeader["app-origin"]
      },
      body: JSON.stringify({ StationID: StationID, DeviceID: DeviceID, DriverID: DriverID, ParameterName: ParameterName,
         PollingInterval: PollingInterval, AvgInterval: AvgInterval, CoefA: CoefA, CoefB: CoefB, UnitID: UnitID, 
         ScaleFactor: ScaleFactor, Status: status, CreatedBy: CreatedBy, ModifiedBy: ModifiedBy, RegisterIndex: RegisterIndex, 
         ParseParamValue: ParseParmvalue, ParseFunction: ParseFunction,SendCommand:SendCommand, IsDerived:isDerived,
         HighHigh:HighHigh,High:High,LowLow:LowLow,Low:Low,Threshold:Threshold,EnableParametersAlarms:enableParametersAlarms}),
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
    setStatus(param.status == 1 ? true : false);
    setIsDerived(param.isDerived == 1 ? true : false);
    setEnableParametersAlarms(param.enableParametersAlarms);
    setTimeout(() => {
      document.getElementById("stationname").value = param.stationID;
      document.getElementById("devicename").value = param.deviceID;
      Deviceschange();
      //document.getElementById("drivername").value = param.driverID;
      document.getElementById("parametername").value = param.parameterName;
      document.getElementById("pollinginterval").value = param.pollingInterval;
      document.getElementById("avginterval").value = param.avgInterval;
      document.getElementById("unit").value = param.unitID;
      document.getElementById("scalefactor").value = param.scaleFactor;
      document.getElementById("coefa").value = param.coefA;
      document.getElementById("coefb").value = param.coefB;

      document.getElementById("registerindex").value = param.registerIndex;
      document.getElementById("parsefunciton").value = param.parseFunction;
      document.getElementById("sendcommand").value = param.sendCommand;
     document.getElementById("highhighlimit").value = param.highHigh;
      document.getElementById("highlimit").value = param.high;
      document.getElementById("lowlowlimit").value = param.lowLow;
      document.getElementById("lowlimit").value = param.low;
      document.getElementById("thresholdlimit").value = param.threshold;
      setTimeout(function () {
        document.getElementById("drivername").value = param.driverID;
      }, 100);
    }, 10);

  }

  const Updateparameter = async function () {
    let StationID = document.getElementById("stationname").value;
    let DeviceID = document.getElementById("devicename").value;
    let DriverID = document.getElementById("drivername").value;
    let ScaleFactor = document.getElementById("scalefactor").value;
    let ParameterName = document.getElementById("parametername").value;
    let PollingInterval = document.getElementById("pollinginterval").value;
    let AvgInterval = document.getElementById("avginterval").value;
    let UnitID = document.getElementById("unit").value;
    let CoefA = document.getElementById('coefa').value;
    let CoefB = document.getElementById('coefb').value;
    let CreatedBy = currentUser.id;
    let ModifiedBy = currentUser.id;
    let status = Status ? 1 : 0;

    let RegisterIndex = document.getElementById("registerindex").value;
    let ParseFunction = document.getElementById("parsefunciton").value;
    let SendCommand  = document.getElementById("sendcommand").value;
    let HighHigh  = document.getElementById("highhighlimit").value;
    let High  = document.getElementById("highlimit").value;
    let LowLow  = document.getElementById("lowlowlimit").value;
    let Low  = document.getElementById("lowlimit").value;
    let Threshold  = document.getElementById("thresholdlimit").value;
    let enableParametersAlarms  = EnableParametersAlarms ? true : false;
    let ParseParmvalue = ParseParamValue ? true : false;
    let isDerived = IsDerived ? 1 : 0;

    let validation = parameteraddvalidation(StationID, DeviceID, DriverID, ParameterName, PollingInterval, AvgInterval, UnitID, CoefA, CoefB);
    if (!validation) {
      return false;
    }
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + 'api/ParametersUpdate/' + parameterId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: authHeader.Authorization,
        'app-origin':authHeader["app-origin"]
      },
      body: JSON.stringify({ StationID: StationID, DeviceID: DeviceID, DriverID: DriverID, ParameterName: ParameterName, 
        PollingInterval: PollingInterval, AvgInterval: AvgInterval, CoefA: CoefA, CoefB: CoefB, UnitID: UnitID, ID: parameterId,
         ScaleFactor: ScaleFactor, Status: status, CreatedBy: CreatedBy, ModifiedBy: ModifiedBy, RegisterIndex: RegisterIndex, 
         ParseParamValue: ParseParmvalue, ParseFunction: ParseFunction,SendCommand:SendCommand,IsDerived:isDerived,
         HighHigh:HighHigh,High:High,LowLow:LowLow,Low:Low,Threshold:Threshold,EnableParametersAlarms:enableParametersAlarms }),
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
      .then(async function (isConfirm) {
        if (isConfirm.isConfirmed) {
          let id = item.id;
          let authHeader = await CommonFunctions.getAuthHeader();
          await fetch(CommonFunctions.getWebApiUrl() + 'api/ParametersDelete/' + id, {
            method: 'DELETE',
            headers:authHeader
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

  const Getparameters = async function () {
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + "api/ParametersList", {
      method: 'GET',
      headers:authHeader
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          setListparameters(data);
        }
      }).catch((error) => toast.error('Unable to get the parameters list. Please contact adminstrator'));
  }

  const GetparametersLookup = async function () {
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + "api/Parameters/ParameterLookup", {
      method: 'GET',
      headers: authHeader
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
        { name: "stationID", title: "Station Name", type: "select", align: "left", items: ListStations, valueField: "id", textField: "stationName", width: 200, sorting: false, filtering: false },
        { name: "deviceID", title: "Device Name", type: "select", align: "left", items: ListDevices, valueField: "id", textField: "deviceName", width: 200 },
        { name: "driverID", title: "Driver Name", type: "select", align: "left", items: ListDrivers, valueField: "id", textField: "driverName", width: 200 },
        { name: "parameterName", title: "parameter Name", align: "left", type: "text" },
        { name: "unitID", title: "Units", align: "left", type: "select", items: ListReportedUnits, valueField: "id", textField: "unitName", width: 100 },
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
    setIsDerived(false);
    setStatus(true);
    setParseParamValue(true);
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
            <h1>Parameters List</h1>
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
                  <input type="number" className="form-control" id="coefa" placeholder="Enter COEF A" defaultValue="1" required />
                  <div class="invalid-feedback">Please enter COEF A</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="coefb" className="form-label">COEF B:</label>
                  <input type="number" className="form-control" id="coefb" placeholder="Enter COEF B" defaultValue="0" required />
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
                  <label for="registerindex" className="form-label">Register Index:</label>
                  <input type="number" className="form-control" id="registerindex" placeholder="Enter Register Index" />
                  <div class="invalid-feedback">Please enter average interval</div>
                </div>

                <div className="col-md-12 mb-3">
                  <label for="parsefunciton" className="form-label">Parse Function:</label>
                  <textarea class="form-control" id="parsefunciton" placeholder="Enter Parse Function" rows="3"></textarea>
                  <div class="invalid-feedback">Please enter parse function</div>
                </div>

                <div className="col-md-12 mb-3">
                  <label for="sendcommand" className="form-label">Send Command:</label>
                  <input type="text" className="form-control" id="sendcommand" placeholder="Enter send command" />
                  <div class="invalid-feedback">Please enter send command</div>
                </div>
                <div className="col-md-6 mb-3">
                  <label for="sendcommand" className="form-label">High High Limit:</label>
                  <input type="text" className="form-control" id="highhighlimit" placeholder="high high limit" />
                  <div class="invalid-feedback">Please enter High High Limit</div>
                </div>
                <div className="col-md-6 mb-3">
                  <label for="sendcommand" className="form-label">High Limit:</label>
                  <input type="text" className="form-control" id="highlimit" placeholder="high limit" />
                  <div class="invalid-feedback">Please enter High Limit</div>
                </div>
                <div className="col-md-6 mb-3">
                  <label for="sendcommand" className="form-label">Low Low Limit:</label>
                  <input type="text" className="form-control" id="lowlowlimit" placeholder="Enter low low limit" />
                  <div class="invalid-feedback">Please enter Low Low Limit:</div>
                </div>
                <div className="col-md-6 mb-3">
                  <label for="sendcommand" className="form-label">Low Limit:</label>
                  <input type="text" className="form-control" id="lowlimit" placeholder="Enter low limit" />
                  <div class="invalid-feedback">Please enter Low Limit:</div>
                </div>
                <div className="col-md-6 mb-3">
                  <label for="sendcommand" className="form-label">Threshold Limit:</label>
                  <input type="text" className="form-control" id="thresholdlimit" placeholder="Enter threshold limit" />
                  <div class="invalid-feedback">Please enter Threshold Limit</div>
                </div>
                <div className="col-md-6 mt-4 mb-3">
                  <div className="form-check mt-2">
                    <input className="form-check-input" type="checkbox" id="enableparametersalarms" onChange={(e) => setEnableParametersAlarms(e.target.checked)} defaultChecked={EnableParametersAlarms}/>
                    <label className="form-check-label form-label" for="isderived">
                    EnableParametersAlarms
                    </label>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <label for="parseparamvalue" className="form-label">Parse Param Value: </label>
                  <div className="form-check d-inline-block form-switch ms-2">
                    <input className="form-check-input" type="checkbox" role="switch" id="parseparamvalue" onChange={(e) => setParseParamValue(e.target.checked)} defaultChecked={ParseParamValue} />
                    {ParseParamValue && (
                      <label className="form-check-label" for="flexSwitchCheckChecked">Enable</label>
                    )}
                    {!ParseParamValue && (
                      <label className="form-check-label" for="flexSwitchCheckChecked">Disable</label>
                    )}
                  </div>
                </div>

                <div className="col-md-4 mb-3">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="isderived" onChange={(e) => setIsDerived(e.target.checked)} defaultChecked={IsDerived}/>
                    <label className="form-check-label form-label" for="isderived">
                    IsDerived
                    </label>
                  </div>
                </div>

                <div className="col-md-4 mb-3">
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