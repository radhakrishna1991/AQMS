import { id } from "chartjs-plugin-dragdata";
import React, { Component, useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";
import CommonFunctions from "../utils/CommonFunctions";
function AddDriver() {
  const $ = window.jQuery;
  const gridRefjsgridreport = useRef();
  const [ListDrivers, setListDrivers] = useState([]);
  const [DriverList, setDriverList] = useState(true);
  const [ListInstruments, setListInstruments] = useState([]);
  const [Driverid, setDriverid] = useState(0);
  const [Type, setType] = useState(true);
  const currentUser = JSON.parse(sessionStorage.getItem('UserData'));

  const Driveraddvalidation = function (DriverEntryName, DriverInstrumentID, CoilNumber, DiscreteInput, RegisterOutput, RegisterValueClosed, RegisterValueOpen) {
    let isvalid = true;
    let form = document.querySelectorAll('#AddDriverform')[0];
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      isvalid = false;
    }
    return isvalid;
  }
  const Driveradd = async function () {
    let DriverDigitalEntryName = document.getElementById("driverdigitalentryname").value;
    let DriverInstrumentID = document.getElementById("associatedinstrument").value;
    let CoilNumber = document.getElementById("coilnumber").value;
    let InputType = document.getElementById("inputradio").checked;
    let OutputType = document.getElementById("outputradio").checked;
    let DiscreteInput = document.getElementById("descreteinput").checked;
    let RegisterOutput = document.getElementById("registeroutput").checked;
    let RegisterValueClosed = document.getElementById("closedvalue").value;
    let RegisterValueOpen = document.getElementById("openvalue").value;
    let CreatedBy = currentUser.id;
    let ModifiedBy = currentUser.id;
    let validation = Driveraddvalidation(DriverDigitalEntryName, DriverInstrumentID, CoilNumber,  DiscreteInput, RegisterOutput, RegisterValueClosed, RegisterValueOpen);
    if (!validation) {
      return false;
    }
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + "api/DriverDigital", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: authHeader.Authorization,
        'app-origin':authHeader["app-origin"]
      },
      body: JSON.stringify({
        DriverDigitalEntryName: DriverDigitalEntryName, DriverInstrumentID: DriverInstrumentID, CoilNumber: CoilNumber, InputType: InputType, 
        OutputType: OutputType, DiscreteInput: DiscreteInput, RegisterOutput: RegisterOutput, RegisterValueClosed: RegisterValueClosed,
        RegisterValueOpen: RegisterValueOpen, CreatedBy: CreatedBy, ModifiedBy: ModifiedBy
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == "Driverdigitaladd") {
          toast.success('Driver added successfully');
          GetDrivers();
          setDriverList(true);
        } else if (responseJson == "Driverexist") {
          toast.error('Driver already exist with given Driver Name. Please try with another Driver Name.');
        } else {
          toast.error('Unable to add the Driver. Please contact adminstrator');
        }
      }).catch((error) => toast.error('Unable to add the Driver. Please contact adminstrator'));
  }


  const EditDriver = function (param) {
    setDriverList(false);
    setDriverid(param.id);
    setTimeout(() => {
      document.getElementById("driverdigitalentryname").value = param.driverDigitalEntryName;
      document.getElementById("associatedinstrument").value = param.instrumentID;
      document.getElementById("coilnumber").value = param.coilNumber;
      document.getElementById("inputradio").checked = param.inputType;
      document.getElementById("outputradio").checked = param.outputType;
      document.getElementById("descreteinput").checked = param.discreteInput;
      document.getElementById("registeroutput").checked = param.registerOutput;
      document.getElementById("closedvalue").value = param.registerValueClosed;
      document.getElementById("openvalue").value = param.registerValueOpen;
      
    }, 10);

  }

  const UpdateDriver= async function () {
    let DriverDigitalEntryName = document.getElementById("driverdigitalentryname").value;
    let DriverInstrumentID = document.getElementById("associatedinstrument").value;
    let CoilNumber = document.getElementById("coilnumber").value;
    let InputType = document.getElementById("inputradio").checked;
    let OutputType = document.getElementById("outputradio").checked;
    let DiscreteInput = document.getElementById("descreteinput").checked;
    let RegisterOutput = document.getElementById("registeroutput").checked;
    let RegisterValueClosed = document.getElementById("closedvalue").value;
    let RegisterValueOpen = document.getElementById("openvalue").value;
    let CreatedBy = currentUser.id;
    let ModifiedBy = currentUser.id;
    let validation = Driveraddvalidation();
    if (!validation) {
      return false;
    }
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + 'api/DriverDigital/' + Driverid, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: authHeader.Authorization,
        'app-origin':authHeader["app-origin"]
      },
      body: JSON.stringify({
        DriverDigitalEntryName: DriverDigitalEntryName, DriverInstrumentID: DriverInstrumentID, CoilNumber: CoilNumber, InputType: InputType, 
        OutputType: OutputType, DiscreteInput: DiscreteInput, RegisterOutput: RegisterOutput, RegisterValueClosed: RegisterValueClosed,
        RegisterValueOpen: RegisterValueOpen, CreatedBy: CreatedBy, ModifiedBy: ModifiedBy
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == 1) {
          toast.success('Driver Updated successfully');
          GetDrivers();
          setDriverList(true);
        } else if (responseJson == 2) {
          toast.error('Driver already exist with given Driver Name. Please try with another Driver Name.');
        } else {
          toast.error('Unable to update the Driver. Please contact adminstrator');
        }
      }).catch((error) => toast.error('Unable to update the Driver. Please contact adminstrator'));
  }

  const DeleteDriver = function (item) {
    Swal.fire({
      title: "Are you sure?",
      text: ("You want to delete this Driver !"),
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
          await fetch(CommonFunctions.getWebApiUrl() + 'api/DriverDigital/' + id, {
            method: 'DELETE',
            headers:authHeader
          }).then((response) => response.json())
            .then((responseJson) => {
              if (responseJson == 1) {
                toast.success('Driver deleted successfully')
                GetDrivers();
              } else {
                toast.error('Unable to delete Driver. Please contact adminstrator');
              }
            }).catch((error) => toast.error('Unable to delete Driver. Please contact adminstrator'));
        }
      });
  }
  const GetLookupdata = async function () {
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + "api/Driversdigitallookup", {
      method: 'GET',
      headers:authHeader
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          setListDrivers(data.listDrivers);
          setListInstruments(data.listInstrument);
        }
      }).catch((error) => toast.error('Unable to get the Devices lookup list. Please contact adminstrator'));
  }
  
  const GetDrivers = async function () {
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + "api/DriverDigital", {
      method: 'GET',
      headers:authHeader
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          setListDrivers(data);
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
        data: ListDrivers,
        loadData: function (filter) {
          $(".jsgrid-filter-row input:text").addClass("form-control").addClass("form-control-sm");
          $(".jsgrid-filter-row select").addClass("custom-select").addClass("custom-select-sm");
          return $.grep(this.data, function (item) {
            return ((!filter.driverDigitalEntryName || item.driverDigitalEntryName.toUpperCase().indexOf(filter.driverDigitalEntryName.toUpperCase()) >= 0)
              && (!filter.instrumentName || item.instrumentName.toUpperCase().indexOf(filter.instrumentName.toUpperCase()) >= 0)
              && (!filter.coilNumber || item.coilNumber.toUpperCase().indexOf(filter.coilNumber.toUpperCase()) >= 0)
            
            );
          });
        }
      },
      fields: [
        { name: "driverDigitalEntryName", title: "Driver DigitalEntry Name ",align:"left", type: "text" },
        { name: "instrumentName", title: "Instrument Name",align:"left", type: "text"},
        { name: "coilNumber", title: "Coil Number", align:"left",type: "text" },
        {
          type: "control", width: 100, editButton: false, deleteButton: false,
          itemTemplate: function (value, item) {
            // var $result = gridRefjsgrid.current.fields.control.prototype.itemTemplate.apply(this, arguments);

            var $customEditButton = $("<button>").attr({ class: "customGridEditbutton jsgrid-button jsgrid-edit-button" })
              .click(function (e) {
                EditDriver(item);
                /* alert("ID: " + item.id); */
                e.stopPropagation();
              });

            var $customDeleteButton = $("<button>").attr({ class: "customGridDeletebutton jsgrid-button jsgrid-delete-button" })
              .click(function (e) {
                DeleteDriver(item);
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
    }
  }
  const DownloadExcel = async function (filetype) {          {/*edited*/}
    
   
    let params = new URLSearchParams({ filetype : filetype });
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl()+ "api/GsiDriver/DriverListExportToExcel?" + params,{
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
    //document.getElementById('loader').style.display = "none";
     /* fetch(url + params, {
       method: 'GET',
     }).then((response) => response.json())
       .then((data) => {
       }).catch((error) => console.log(error)); */
  }
  return (
    <main id="main" className="main" >
      <div className="container">
        <div className="pagetitle">
          {!DriverList && Driverid == 0 && (
            <h1>Add Driver</h1>
          )}
          {!DriverList && Driverid != 0 && (
            <h1>Update Driver</h1>
          )}
          {DriverList && (
            <h1>Drivers List</h1>
          )}
        </div>
        <section className="section">
          <div className="container">
          
            <div className="me-2 mb-2 float-end">
              {DriverList && (
                <span className="operation_class mx-2" onClick={() => AddStationchange()}><i className="bi bi-plus-circle-fill"></i> <span>Create New Driver</span></span>
              )}
              {!DriverList && (
                <span className="operation_class mx-2" onClick={() => AddStationchange('gridlist')}><i className="bi bi-card-list"></i> <span>View All Drivers</span></span>
              )}
            </div>
            {!DriverList && (
              <form id="AddDriverform" className="row" noValidate>
                <div className="col-md-12 mb-3">
                  <label for="drivername" className="form-label">Driver Entry Name:</label>
                  <input type="text" className="form-control" id="driverdigitalentryname" placeholder="Enter Driver DigitalEntry Name" required />
                  <div class="invalid-feedback">Please enter Driver DigitalEntry Name</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="instrument" className="form-label">Associated Instrument:</label>
                  <select className="form-select" id="associatedinstrument" required>
                    <option selected value="">Select Associated Instrument</option>
                    {ListInstruments.map((x, y) =>
                      <option value={x.id} key={y} >{x.instrumentName}</option>,
                    )}
                  </select>
                  <div class="invalid-feedback">Please select Associated Instrument</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="coilnumber" className="form-label">Coil Number:</label>
                  <input type="number" className="form-control" id="coilnumber" placeholder="Enter Coil Number" required />
                  <div class="invalid-feedback">Please enter Coil Number</div>
                </div>
                <div className="col-md-12 mb-3">
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
                </div> 

                <div className="col-md-12 text-center">
                  {!DriverList && Driverid == 0 && (
                    <button className="btn btn-primary" onClick={Driveradd} type="button">Add Driver</button>
                  )}
                  {!DriverList && Driverid != 0 && (
                    <button className="btn btn-primary" onClick={UpdateDriver} type="button">Update Driver</button>
                  )}
                </div>
              </form>
            )}
            {DriverList && (
              <div className="jsGrid" ref={gridRefjsgridreport} />
            )}
          </div>

        </section>
        <br></br>
        <div align="center">
        {DriverList && (               
            <button type="button" className="btn btn-primary datashow me-0" onClick={() => DownloadExcel('excel')} >Download Excel</button>)} &nbsp;
             {DriverList && (
            <button type="button" className="btn btn-primary datashow me-0" onClick={() => DownloadExcel('csv')} >Download Csv</button>     
          )}
        </div>
      </div>
    </main>
  );
}
export default AddDriver;