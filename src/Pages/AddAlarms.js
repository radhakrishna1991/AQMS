import { id } from "chartjs-plugin-dragdata";
import React, { Component, useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";
import CommonFunctions from "../utils/CommonFunctions";
function AddAlarms() {
  const $ = window.jQuery;
  const gridRefjsgridreport = useRef();
  const [ListAlarms, setListAlarms] = useState([]);
  const [DriverList, setDriverList] = useState(true);
  const [ListDeviceModels, setListDeviceModels] = useState([]);
  const [ListFlags, setListFlags] = useState([]);
  const [Driverid, setDriverid] = useState(0);
  const [Type, setType] = useState(true);
  const currentUser = JSON.parse(sessionStorage.getItem('UserData'));
  const [gridLoad,setgridLoad]= useState(false);
  const [display, setDisplay] = useState({
    alarmnameid: 'none',
    coilnumberid: 'none',
  });
  const [value, setValue] = useState({
    alarmnameid: '',
    coilnumberid: '',
  });

  const Alarmaddvalidation = function (DriverEntryName, DriverInstrumentID, CoilNumber, Flag) {
    let isvalid = true;
    let form = document.querySelectorAll('#AddDriverform')[0];
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      isvalid = false;
    }
    return isvalid;
  }
  const Alarmadd = async function () {
    let AlarmName = document.getElementById("driverdigitalentryname").value;
    let DriverInstrumentID = document.getElementById("associatedinstrument").value;
    let CoilNumber = document.getElementById("coilnumber").value;
    let Flag = document.getElementById("flag").value;
    let CreatedBy = currentUser.id;
    let validation = Alarmaddvalidation(AlarmName, DriverInstrumentID, CoilNumber,Flag);
    if (!validation) {
      return false;
    }
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + "api/Alarm", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: authHeader.Authorization,
        'app-origin':authHeader["app-origin"]
      },
      body: JSON.stringify({
        Description: AlarmName, DeviceModelId: DriverInstrumentID, InputIndex: CoilNumber, Flag: Flag, 
         CreatedBy: CreatedBy
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == "Alarmadd") {
          toast.success('Alarm added successfully');
          GetAlarms();
          setDriverList(true);
        } else if (responseJson == "Alarmexist") {
          toast.error('Alarm already exist with given Driver Name. Please try with another Alarm Name.');
        } else {
          toast.error('Unable to add the Alarm. Please contact adminstrator');
        }
      }).catch((error) => toast.error('Unable to add the Alarm. Please contact adminstrator'));
  }


  const EditAlarm = function (param) {
    setDriverList(false);
    setDriverid(param.id);
    setTimeout(() => {
      document.getElementById("driverdigitalentryname").value = param.alarmName;
      setValue((prevDisplay) => ({ ...prevDisplay, ["alarmnameid"]: param.alarmName, }));
      document.getElementById("associatedinstrument").value = param.deviceModelID;
      document.getElementById("coilnumber").value = param.coilNumber;
      setValue((prevDisplay) => ({ ...prevDisplay, ["coilnumberid"]: param.coilNumber, }));
      document.getElementById("flag").value = param.flag;
    }, 10);

  }

  const UpdateAlarm = async function () {
    let AlarmName = document.getElementById("driverdigitalentryname").value;
    let DriverInstrumentID = document.getElementById("associatedinstrument").value;
    let CoilNumber = document.getElementById("coilnumber").value;
    let ModifiedBy = currentUser.id;
    let Flag = document.getElementById("flag").value;
    let validation = Alarmaddvalidation(AlarmName, DriverInstrumentID, CoilNumber,Flag);
    if (!validation) {
      return false;
    }
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + 'api/Alarm/' + Driverid, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: authHeader.Authorization,
        'app-origin':authHeader["app-origin"]
      },
      body: JSON.stringify({
        Description: AlarmName, DeviceModelId: DriverInstrumentID, InputIndex: CoilNumber, Flag: Flag, 
         ModifiedBy: ModifiedBy
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == 1) {
          toast.success('Alarm Updated successfully');
          GetAlarms();
          setDriverList(true);
        } else if (responseJson == 2) {
          toast.error('Alarm already exist with given Alarm Name. Please try with another Alarm Name.');
        } else {
          toast.error('Unable to update the Alarm. Please contact adminstrator');
        }
      }).catch((error) => toast.error('Unable to update the Alarm. Please contact adminstrator'));
  }

  const DeleteAlarm = function (item) {
    Swal.fire({
      title: "Are you sure?",
      text: ("You want to delete this Alarm !"),
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
          await fetch(CommonFunctions.getWebApiUrl() + 'api/Alarm/' + id, {
            method: 'DELETE',
            headers:authHeader
          }).then((response) => response.json())
            .then((responseJson) => {
              if (responseJson == 1) {
                toast.success('Alarm deleted successfully')
                GetAlarms();
              } else {
                toast.error('Unable to delete Alarm. Please contact adminstrator');
              }
            }).catch((error) => toast.error('Unable to delete Alarm. Please contact adminstrator'));
        }
      });
  }
  const GetLookupdata = async function () {
    document.getElementById('loader').style.display = "block";
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + "api/AlarmsLookup", {
      method: 'GET',
      headers:authHeader
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          setListAlarms(data.listAlarms);
          setListDeviceModels(data.listDeviceModel);
          setListFlags(data.listFlags);
        }
      }).catch((error) => toast.error('Unable to get the Alarms lookup list. Please contact adminstrator'))
      .finally(() => {
        setgridLoad(true);
        document.getElementById('loader').style.display = "none";
    });
  }
  
  const GetAlarms = async function () {
    document.getElementById('loader').style.display = "block";
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + "api/Alarm", {
      method: 'GET',
      headers:authHeader
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          setListAlarms(data);
        }
      }).catch((error) => toast.error('Unable to get the alarm list. Please contact adminstrator'))
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
        data: ListAlarms,
        loadData: function (filter) {
          $(".jsgrid-filter-row input:text").addClass("form-control").addClass("form-control-sm");
          $(".jsgrid-filter-row select").addClass("custom-select").addClass("custom-select-sm");
          return $.grep(this.data, function (item) {
            return ((!filter.alarmName || item.alarmName.toUpperCase().indexOf(filter.alarmName.toUpperCase()) >= 0)
              && (!filter.instrumentName || item.instrumentName.toUpperCase().indexOf(filter.instrumentName.toUpperCase()) >= 0)
              && (!filter.coilNumber || item.coilNumber.toUpperCase().indexOf(filter.coilNumber.toUpperCase()) >= 0)
            
            );
          });
        }
      },
      fields: [
        { name: "alarmName", title: "Alarm",align:"left", type: "text" },
        { name: "deviceModelName", title: "Device Model Name",align:"left", type: "text"},
        { name: "coilNumber", title: "Coil Number", align:"left",type: "text" },
        {
          type: "control", width: 100, editButton: false, deleteButton: false,
          itemTemplate: function (value, item) {
            // var $result = gridRefjsgrid.current.fields.control.prototype.itemTemplate.apply(this, arguments);

            var $customEditButton = $("<button>").attr({ class: "customGridEditbutton jsgrid-button jsgrid-edit-button" })
              .click(function (e) {
                EditAlarm(item);
                /* alert("ID: " + item.id); */
                e.stopPropagation();
              });

            var $customDeleteButton = $("<button>").attr({ class: "customGridDeletebutton jsgrid-button jsgrid-delete-button" })
              .click(function (e) {
                DeleteAlarm(item);
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
      setDriverList(true);
    } else {
      setDriverList(false);
      setType(false);
      setDriverid(0);
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

  const DownloadExcel = async function (filetype) {          {/*edited*/}
    
   
    let params = new URLSearchParams({ filetype : filetype });
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl()+ "api/AlarmsExportToExcel?" + params,{
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
          {!DriverList && Driverid == 0 && (
            <h1>Add Alarm</h1>
          )}
          {!DriverList && Driverid != 0 && (
            <h1>Update Alarm</h1>
          )}
          {DriverList && (
            <h1>Alarms List</h1>
          )}
        </div>
        <section className="section">
          <div className="container">
          
            <div className="me-2 mb-2 float-end">
              {DriverList && (
                <span className="operation_class mx-2" onClick={() => AddStationchange()}><i className="bi bi-plus-circle-fill"></i> <span>Create New Alarm</span></span>
              )}
              {!DriverList && (
                <span className="operation_class mx-2" onClick={() => AddStationchange('gridlist')}><i className="bi bi-card-list"></i> <span>View All Alarms</span></span>
              )}
            </div>
            {!DriverList && (
              <form id="AddDriverform" className="row" noValidate>
                <div className="col-md-12 mb-3">
                  <label for="drivername" className="form-label">Alarm Name:</label>
                  <input type="text" className="form-control" id="driverdigitalentryname" placeholder="Enter Alarm Name" value={value.alarmnameid} onChange={(e) => handleTextBox(e.target.value, 100, "alarmnameid" )} required />
                  <div id="alarmnameid" style={{ display: display.alarmnameid}} className="invalid-feedback">Character limit exceeded! Maximum 100 characters are allowed.</div>
                  <div class="invalid-feedback">Please enter Alarm Name</div>
                </div>
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
                  <label for="coilnumber" className="form-label">Coil Number:</label>
                  <input type="number" className="form-control" id="coilnumber" placeholder="Enter Coil Number" value={value.coilnumberid} onChange={(e) => handleTextBox(e.target.value, 9, "coilnumberid" )} />
                  <div id="coilnumberid" style={{ display: display.coilnumberid}}  className="invalid-feedback">Character limit exceeded! Maximum 9 characters are allowed.</div>
                  <div class="invalid-feedback">Please enter Coil Number</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="instrument" className="form-label">Flag:</label>
                  <select className="form-select" id="flag" required>
                    <option selected value="">Select Flag</option>
                    {ListFlags.map((x, y) =>
                      <option value={x.name} key={y} >{x.name}</option>,
                    )}
                  </select>
                  <div class="invalid-feedback">Please select Flag</div>
                </div>
               {/*  <div className="col-md-12 mb-3">
                <label for="type" className="form-label">Input/Output Type:</label><br></br>
                  <input className="form-check-input" type="radio" name="type" id="inputradio" defaultValue={false}  />&nbsp;&nbsp;
                  <label className="form-label" for="inputradio">Input</label><br></br>
                  <input className="form-check-input" type="radio" name="type" id="outputradio" defaultValue={false} />&nbsp;&nbsp;
                  <label className="form-label" for="outputradio">Output</label><br></br>
                </div>

                <div className="col-md-12 mb-3">
                  <label for="descreteinput" className="form-label">Input Options:</label><br></br>
                  <input type="checkbox" className="form-check-input" defaultChecked={false} id="descreteinput"/>&nbsp;&nbsp;
                  <label for="forcemultiplecoils" className="form-label">Descrete Input (FC = 2)</label>
               </div>
               <div className="col-md-12 mb-3">
                  <label for="registeroutput" className="form-label">Output Options:</label><br></br>
                  <input type="checkbox" className="form-check-input" defaultChecked={false} id="registeroutput"/>&nbsp;&nbsp;
                  <label for="forcemultiplecoils" className="form-label">Register Output (FC = 6)</label>
               </div>
               <div className="col-md-12 mb-3">
                  <label for="closedvalue" className="form-label">Closed Value:</label>
                  <input type="number" className="form-control" id="closedvalue" placeholder="Enter Closed Value"  />
                  <div class="invalid-feedback">Please enter Closed Value</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="openvalue" className="form-label">Open Value:</label>
                  <input type="number" className="form-control" id="openvalue" placeholder="Enter Open Value"  />
                  <div class="invalid-feedback">Please enter Open Value</div>
                </div>  */}

                <div className="col-md-12 text-center">
                  {!DriverList && Driverid == 0 && (
                    <button className="btn btn-primary" onClick={Alarmadd} type="button">Add Alarm</button>
                  )}
                  {!DriverList && Driverid != 0 && (
                    <button className="btn btn-primary" onClick={UpdateAlarm} type="button">Update Alarm</button>
                  )}
                </div>
              </form>
            )}
            {DriverList && (
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
        
        {DriverList && ListAlarms.length > 0 && (    
          <div align="center">           
            <button type="button" className="btn btn-primary datashow me-0" onClick={() => DownloadExcel('excel')} >Download Excel</button> &nbsp;
            <button type="button" className="btn btn-primary datashow me-0" onClick={() => DownloadExcel('csv')} >Download Csv</button>  
          </div>   
        )}
        
      </div>
    </main>
  );
}
export default AddAlarms;