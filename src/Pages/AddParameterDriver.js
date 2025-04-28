import { id } from "chartjs-plugin-dragdata";
import React, { Component, useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";
import CommonFunctions from "../utils/CommonFunctions";
function AddParameterTemplates() {
  const $ = window.jQuery;
  const gridRefjsgridreport = useRef();
  const [AllLookupData, setAllLookupData] = useState([]);
  const [ListDeviceModels, setListDeviceModels] = useState([]);
  const [ListDrivers, setListDrivers] = useState([]);
  const [ParameterTemplatesConfig, setParameterTemplatesConfig] = useState([]);
  const [ParameterDataType, setParameterDataType] = useState([]);
  const [ParameterDataFormat, setParameterDataFormat] = useState([]);
  const [ListDataFormat, setListDataFormat] = useState([]);
  const [InstrumentList, setInstrumentList] = useState(true);
  const [Instrumentid, setInstrumentid] = useState(0);
  const [Type, setType] = useState(true);
  const currentUser = JSON.parse(sessionStorage.getItem('UserData'));
  const [gridLoad,setgridLoad]= useState(false);
  const [display, setDisplay] = useState({
    ParameterDriverid: 'none',
    ModusRegisterIndexid: 'none',
    SendCommandid: 'none',
    SendIntervalid: 'none',
    ParseFunctionid: 'none',
  });
  const [value, setValue] = useState({
    ParameterDriverid: '',
    ModusRegisterIndexid: '',
    SendCommandid: '',
    SendIntervalid: '',
    ParseFunctionid: '',
  });

  const Instrumentaddvalidation = function () {
    let isvalid = true;
    let form = document.querySelectorAll('#AddParameterDriverForm')[0];
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      isvalid = false;
    }
    return isvalid;
  }
  const ParameterDriveradd = async function () {
    let ParameterDriver = document.getElementById("ParameterDriver").value;
    let associatedinstrument =   document.getElementById("associatedinstrument").value;
    let DataType =   document.getElementById("DataType").value;
    let DataFormat =  document.getElementById("DataFormat").value;
    let ModusRegisterIndex =  document.getElementById("ModusRegisterIndex").value;
    let SendCommand =  document.getElementById("SendCommand").value;
    let SendInterval =  document.getElementById("SendInterval").value;
    let SendInterval1 =  document.getElementById("SendInterval1").value;
    let finalInterval=SendInterval==""?"":SendInterval1==""?SendInterval+"-"+"M":SendInterval+"-"+SendInterval1;
    let ParseFunction =  document.getElementById("ParseFunction").value;
    let CreatedBy = currentUser.id;
    let validation = Instrumentaddvalidation();
    if (!validation) {
      return false;
    }
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + 'api/ParameterDriver', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: authHeader.Authorization,
        'app-origin':authHeader["app-origin"]
      },
      body: JSON.stringify({
        DriverName: ParameterDriver, DeviceModelID: associatedinstrument, DataType: DataType, 
        DataFormat: DataFormat, RegisterIndex: ModusRegisterIndex, SendCommand: SendCommand,
        SendInterval: finalInterval,ParseFunction: ParseFunction, CreatedBy: CreatedBy
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == "Parameterdriveradded") {
          toast.success('Parameter Driver added successfully');
          GetParameterDrivers();
          setInstrumentList(true);
        } else if (responseJson == "Parameterdriverexist") {
          toast.error('Parameter Driver already exist with given Parameter Driver Name. Please try with another Parameter Driver Name.');
        } else {
          toast.error('Unable to add the Parameter Driver. Please contact adminstrator');
        }
      }).catch((error) => toast.error('Unable to add the Parameter Driver. Please contact adminstrator'));
  }

  const EditParameterDriver = function (param) {
    setInstrumentList(false);
    setInstrumentid(param.id);
    setTimeout(() => {
      document.getElementById("ParameterDriver").value = param.driverName;
      setValue((prevDisplay) => ({ ...prevDisplay, ["ParameterDriverid"]: param.driverName, }));
      document.getElementById("associatedinstrument").value = param.deviceModelID;
      document.getElementById("DataType").value = param.dataType;
      document.getElementById("DataFormat").value = param.dataFormat;
      document.getElementById("ModusRegisterIndex").value = param.registerIndex;
      setValue((prevDisplay) => ({ ...prevDisplay, ["ModusRegisterIndexid"]: param.registerIndex, }));
      document.getElementById("SendCommand").value = param.sendCommand;
      setValue((prevDisplay) => ({ ...prevDisplay, ["SendCommandid"]: param.sendCommand, }));
      let SendInterval=param.sendInterval !=null?param.sendInterval.split("-"):"";
      document.getElementById("SendInterval").value = SendInterval==""?"":SendInterval[0];
      setValue((prevDisplay) => ({ ...prevDisplay, ["SendIntervalid"]: SendInterval==""?"":SendInterval[0], }));
      document.getElementById("SendInterval1").value = SendInterval==""?"":SendInterval[1];
      document.getElementById("ParseFunction").value = param.parseFunction;
      setValue((prevDisplay) => ({ ...prevDisplay, ["ParseFunctionid"]: param.parseFunction, }));
    }, 10); 

  }

  const UpdateParameterDriver= async function () {
    let ParameterDriver = document.getElementById("ParameterDriver").value;
    let associatedinstrument =   document.getElementById("associatedinstrument").value;
    let DataType =   document.getElementById("DataType").value;
    let DataFormat =  document.getElementById("DataFormat").value;
    let ModusRegisterIndex =  document.getElementById("ModusRegisterIndex").value;
    let SendCommand =  document.getElementById("SendCommand").value;
    let SendInterval =  document.getElementById("SendInterval").value;
    let SendInterval1 =  document.getElementById("SendInterval1").value;
    let finalInterval=SendInterval==""?"":SendInterval1==""?SendInterval+"-"+"M":SendInterval+"-"+SendInterval;
    let ParseFunction =  document.getElementById("ParseFunction").value;
    let ModifiedBy = currentUser.id;
    let validation = Instrumentaddvalidation();
    if (!validation) {
      return false;
    }
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + 'api/ParameterDriver/' + Instrumentid, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: authHeader.Authorization,
        'app-origin':authHeader["app-origin"]
      },
      body: JSON.stringify({
        DriverName: ParameterDriver, DeviceModelID: associatedinstrument, DataType: DataType, 
        DataFormat: DataFormat, RegisterIndex: ModusRegisterIndex, SendCommand: SendCommand,
        SendInterval: finalInterval,ParseFunction: ParseFunction, ModifiedBy: ModifiedBy
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == 1) {
          toast.success('Parameter Driver Updated successfully');
          GetParameterDrivers();
          setInstrumentList(true);
        } else if (responseJson == 2) {
          toast.error('Parameter Driver already exist with given Parameter Driver Name. Please try with another Parameter Driver Name.');
        } else {
          toast.error('Unable to update the Parameter Driver. Please contact adminstrator');
        }
      }).catch((error) => toast.error('Unable to update the Parameter Driver. Please contact adminstrator'));
  }

  const DeleteParameterDriver = function (item) {
    Swal.fire({
      title: "Are you sure?",
      text: ("You want to delete this Device Model !"),
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
          await fetch(CommonFunctions.getWebApiUrl() + 'api/ParameterDriver/' + id, {
            method: 'DELETE',
            headers:authHeader
          }).then((response) => response.json())
            .then((responseJson) => {
              if (responseJson == 1) {
                toast.success('Parameter Driver deleted successfully')
                GetParameterDrivers();
              } else {
                toast.error('Unable to delete Parameter Driver. Please contact adminstrator');
              }
            }).catch((error) => toast.error('Unable to delete Parameter Driver. Please contact adminstrator'));
        }
      });
  }
  const GetLookupdata = async function () {
    document.getElementById('loader').style.display = "block";
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + "api/ParametersTemplateslookup", {
      method: 'GET',
      headers:authHeader
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          setAllLookupData(data);
          setListDeviceModels(data.listDeviceModels);
          setListDrivers(data.listDrivers);
          setParameterDataType(data.listParameterDataType);
          setParameterDataFormat(data.listParameterDataFormat);
         // setParameterTemplatesConfig(JSON.parse(data.parameterTemplateConfig));
        }
      }).catch((error) => toast.error('Unable to get the lookup list. Please contact adminstrator'))
      .finally(() => {
        setgridLoad(true);
        document.getElementById('loader').style.display = "none";
    });
  }
  
  const GetParameterDrivers = async function () {
    document.getElementById('loader').style.display = "block";
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + "api/ParameterDriver", {
      method: 'GET',
      headers:authHeader
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          setListDrivers(data);
        }
      }).catch((error) => toast.error('Unable to get the Parameter Drivers list. Please contact adminstrator'))
      .finally(() => {
        setgridLoad(true);
        document.getElementById('loader').style.display = "none";
    });
  }
  useEffect(() => {
    if(gridLoad){
      initializeJsGrid();
    }
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
        data: ListDrivers,
        loadData: function (filter) {
          $(".jsgrid-filter-row input:text").addClass("form-control").addClass("form-control-sm");
          $(".jsgrid-filter-row select").addClass("custom-select").addClass("custom-select-sm");
          return $.grep(this.data, function (item) {
            return ((!filter.driverName || item.driverName.toUpperCase().indexOf(filter.driverName.toUpperCase()) >= 0)
             && (!filter.deviceModelID || item.deviceModelID === filter.deviceModelID)
              && (!filter.registerIndex || item.registerIndex.toUpperCase().indexOf(filter.registerIndex.toUpperCase()) >= 0)
             );
          });
        }
      },
      fields: [
        { name: "driverName", title: "Parameter Driver Name",align:"left", type: "text" },
        { name: "deviceModelID", title: "Device Model",align:"left", type: "select", items: ListDeviceModels, valueField: "id", textField: "deviceModelName", width: 200 },
        { name: "registerIndex", title: "Register Index",align:"left", type: "text" },
        {
          type: "control", width: 100, editButton: false, deleteButton: false,
          itemTemplate: function (value, item) {
            // var $result = gridRefjsgrid.current.fields.control.prototype.itemTemplate.apply(this, arguments);

            var $customEditButton = $("<button>").attr({ class: "customGridEditbutton jsgrid-button jsgrid-edit-button" })
              .click(function (e) {
                EditParameterDriver(item);
                /* alert("ID: " + item.id); */
                e.stopPropagation();
              });

            var $customDeleteButton = $("<button>").attr({ class: "customGridDeletebutton jsgrid-button jsgrid-delete-button" })
              .click(function (e) {
                DeleteParameterDriver(item);
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
      setInstrumentList(true);
    } else {
      setInstrumentList(false);
      setType(false);
      setInstrumentid(0);
      resetState();
    }
  }

  const resetState = () => {
    const newState = { ...value };
    for (const key in newState) {
      if (newState.hasOwnProperty(key)) {
        newState[key] = '';
      }
    }
    setValue(newState);
  };

  const DataTypeChange = (event, index) => {
    let value =event.currentTarget.value;
    let DataFormat=ParameterDataFormat.filter(x=>x.dataTypeID == value);
    setListDataFormat(DataFormat);
  };

  const DownloadExcel = async function (filetype) {          {/*edited*/}

    let params = new URLSearchParams({ filetype : filetype });
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl()+ "api/ParameterDriversExportToExcel?" + params,{
      method: 'GET',
      headers: authHeader ,
    }).then(response => response.blob())
      .then(blob => {
        // Create a link element and trigger a click on it to download the file
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        if(filetype=='excel'){
       link.download = Date.now()+".xlsx";
        }else{
          link.download = Date.now()+".csv";
        }
        link.click();
      })
      .catch(error => console.error('Error:', error));
   // document.getElementById('loader').style.display = "none";
     /* fetch(url + params, {
       method: 'GET',
     }).then((response) => response.json())
       .then((data) => {
       }).catch((error) => console.log(error)); */
  }

  const handleTextBox = (value, characterLimit, elementId) => { 
    if (value.length <= characterLimit) {
      setDisplay((prevDisplay) => ({
        ...prevDisplay,
        [elementId]: 'none',
      }));
      setValue((prevDisplay) => ({
        ...prevDisplay,
        [elementId]: value,
      }));
    } else {
      setDisplay((prevDisplay) => ({
        ...prevDisplay,
        [elementId]: 'block',
      }));
    }
  }

  return (
    <main id="main" className="main" >
      <div className="container">
        <div className="pagetitle">
          {!InstrumentList && Instrumentid == 0 && (
            <h1>Add Parameter Driver</h1>
          )}
          {!InstrumentList && Instrumentid != 0 && (
            <h1>Update Parameter Driver</h1>
          )}
          {InstrumentList && (
            <h1>Parameter Drivers List</h1>
          )}
        </div>
        <section className="section">
          <div className="container">
          
            <div className="me-2 mb-2 float-end">
              {InstrumentList && (
                <span className="operation_class mx-2" onClick={() => AddStationchange()}><i className="bi bi-plus-circle-fill"></i> <span>Create New Parameter Driver</span></span>
              )}
              {!InstrumentList && (
                <span className="operation_class mx-2" onClick={() => AddStationchange('gridlist')}><i className="bi bi-card-list"></i> <span>View All Parameter Drivers</span></span>
              )}
            </div>
            {!InstrumentList && (
              <form id="AddParameterDriverForm" className="row" noValidate>
                <div className="col-md-12 mb-3">
                  <label for="instrument" className="form-label">Associated Device Model:</label>
                  <select className="form-select" id="associatedinstrument" required>
                    <option selected value="">Select Associated Device Model</option>
                    {ListDeviceModels.map((x, y) =>
                      <option value={x.id} key={y} >{x.deviceModelName}</option>,
                    )}
                  </select>
                  <div class="invalid-feedback">Please select Associated Device Model</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="ParameterDriver" className="form-label">Parameter Driver Name:</label>
                  <input type="text" className="form-control" id="ParameterDriver" placeholder="Enter Parameter Driver Name" value={value.ParameterDriverid} onChange={(e) => handleTextBox(e.target.value, 50, "ParameterDriverid" )} required />
                  <div id="ParameterDriverid" style={{ display: display.ParameterDriverid}} className="invalid-feedback">Character limit exceeded! Maximum 50 characters are allowed.</div>
                  <div class="invalid-feedback">Parameter Name</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="DataType" className="form-label">Data Type:</label>
                  <select className="form-select" id="DataType" onChange={(e) => DataTypeChange(e, e.target.selectedIndex)}>
                    <option selected value="">Select Data Type</option>
                    {ParameterDataType.map((x, y) =>
                      <option value={x.id} key={y} >{x.name}</option>,
                    )}
                  </select>
                  <div class="invalid-feedback">Please Data Type</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="DataFormat" className="form-label">Data Format:</label>
                  <select className="form-select" id="DataFormat">
                    <option selected value="">Select Data Format</option>
                    {ListDataFormat.map((x, y) =>
                      <option value={x.id} key={y} >{x.name}</option>,
                    )}
                  </select>
                  <div class="invalid-feedback">Please select Data Format</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="ModusRegisterIndex" className="form-label">Modus Register Index:</label>
                  <input type="number" className="form-control" id="ModusRegisterIndex" placeholder="Enter Modus Register Index" value={value.ModusRegisterIndexid} onChange={(e) => handleTextBox(e.target.value, 9, "ModusRegisterIndexid" )} />
                  <div id="ModusRegisterIndexid" style={{ display: display.ModusRegisterIndexid}}  className="invalid-feedback">Character limit exceeded! Maximum 9 characters are allowed.</div>
                  <div class="invalid-feedback">Please enter Modus Register Index</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="SendCommand" className="form-label">Send Command:</label>
                  <input type="text" className="form-control" id="SendCommand" placeholder="Enter Send Command" value={value.SendCommandid} onChange={(e) => handleTextBox(e.target.value, 150, "SendCommandid" )} />
                  <div id="SendCommandid" style={{ display: display.SendCommandid}} className="invalid-feedback">Character limit exceeded! Maximum 150 characters are allowed.</div>
                  <div class="invalid-feedback">Please enter Send Command</div>
                </div>
                <div className="col-md-12">
                  <div className="row">
                <div className="col-md-8 mb-3">
                  <label for="SendInterval" className="form-label">Send Interval:</label>
                  <input type="number" className="form-control" id="SendInterval" placeholder="Enter Send Interval" value={value.SendIntervalid} onChange={(e) => handleTextBox(e.target.value, 20, "SendIntervalid" )} />
                  <div id="SendIntervalid" style={{ display: display.SendIntervalid}} className="invalid-feedback">Character limit exceeded! Maximum 20 characters are allowed.</div>
                  <div class="invalid-feedback">Please enter Send Interval</div>
                </div>
                <div className="col-md-4 SendInterval1 mb-3">
                <select className="form-select" id="SendInterval1">
                  <option selected value=""></option>
                  <option  value="S">Seconds</option>
                  <option  value="M">Minutes</option>
                  <option  value="H">Hours</option>
                  <option  value="D">Days</option>
                  </select>
                </div>
                </div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="ParseFunction" className="form-label">Parse Function:</label>
                  <textarea className="form-control" id="ParseFunction" placeholder="Enter Parse Function" value={value.ParseFunctionid} onChange={(e) => handleTextBox(e.target.value, 1000, "ParseFunctionid" )} ></textarea>
                  <div id="ParseFunctionid" style={{ display: display.ParseFunctionid}} className="invalid-feedback">Character limit exceeded! Maximum 1000 characters are allowed.</div>
                  <div class="invalid-feedback">Please enter Parse Function</div>
                </div>
               <br></br>
                <div className="col-md-12 text-center">
                  {!InstrumentList && Instrumentid == 0 && (
                    <button className="btn btn-primary" onClick={ParameterDriveradd} type="button">Add Parameter Driver</button>
                  )}
                  {!InstrumentList && Instrumentid != 0 && (
                    <button className="btn btn-primary" onClick={UpdateParameterDriver} type="button">Update Parameter Driver</button>
                  )}
                </div>
              </form>
            )}
            {InstrumentList && (
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
       
        {InstrumentList && ListDrivers.length > 0 && (   
           <div align="center">            
            <button type="button" className="btn btn-primary datashow me-0" onClick={() => DownloadExcel('excel')} >Download Excel</button> &nbsp;
            <button type="button" className="btn btn-primary datashow me-0" onClick={() => DownloadExcel('csv')} >Download Csv</button>  
           </div>   
          )}
        
      </div>
    </main>
  );
}
export default AddParameterTemplates;