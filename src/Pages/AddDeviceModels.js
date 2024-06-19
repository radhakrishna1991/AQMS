import { id } from "chartjs-plugin-dragdata";
import React, { Component, useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";
import CommonFunctions from "../utils/CommonFunctions";
function AddDeviceModels() {
  const $ = window.jQuery;
  const gridRefjsgridreport = useRef();
  const [ListInstruments, setListInstruments] = useState([]);
  const [InstrumentList, setInstrumentList] = useState(true);
  const [Instrumentid, setInstrumentid] = useState(0);
  const [Type, setType] = useState(true);
  const currentUser = JSON.parse(sessionStorage.getItem('UserData'));

  const Instrumentaddvalidation = function (InstrumentName, DefaultTcpIpPort, DefaultModbusCode, DefaultModbusCommandType, DefaultTimeoutMs, SupportsForceMultipleCoils) {
    let isvalid = true;
    let form = document.querySelectorAll('#AddInstrumentform')[0];
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      isvalid = false;
    }
    return isvalid;
  }
  const Instrumentadd = async function () {
    let InstrumentName = document.getElementById("instrumentname").value;
    let DefaultTcpIpPort = document.getElementById("tcpipport").value;
    let DefaultModbusCode = document.getElementById("modbuscode").value;
    let DefaultModbusCommandType = document.getElementById("modbuscommandtype").value;
    let DefaultTimeoutMs = document.getElementById("defaulttimeout").value;
    let SupportsForceMultipleCoils = document.getElementById("forcemultiplecoils").checked;
    let CreatedBy = currentUser.id;
    let ModifiedBy = currentUser.id;
    
    let validation = Instrumentaddvalidation(InstrumentName, DefaultTcpIpPort, DefaultModbusCode, DefaultModbusCommandType, DefaultTimeoutMs, SupportsForceMultipleCoils);
    if (!validation) {
      return false;
    }
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + 'api/DeviceModel', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: authHeader.Authorization,
        'app-origin':authHeader["app-origin"]
      },
      body: JSON.stringify({
        DeviceModelName: InstrumentName,TcpIpPort: DefaultTcpIpPort, ModbusCode: DefaultModbusCode, 
        ModbusCommandType: DefaultModbusCommandType, DefaultTimeout: DefaultTimeoutMs,
         SupportsForceMultipleCoils: SupportsForceMultipleCoils, CreatedBy: CreatedBy
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == "DeviceModeladd") {
          toast.success('Device Model added successfully');
          GetInstruments();
          setInstrumentList(true);
        } else if (responseJson == "DeviceModelexist") {
          toast.error('DeviceModel already exist with given Device Model Name. Please try with another Device Model Name.');
        } else {
          toast.error('Unable to add the Device Model. Please contact adminstrator');
        }
      }).catch((error) => toast.error('Unable to add the Instrument. Please contact adminstrator'));
  }

  const EditInstrument = function (param) {
    setInstrumentList(false);
    setInstrumentid(param.id);
    setTimeout(() => {
      document.getElementById("instrumentname").value = param.deviceModelName;
      document.getElementById("tcpipport").value = param.tcpIpPort;
      document.getElementById("modbuscode").value = param.modbusCode;
      document.getElementById("modbuscommandtype").value = param.modbusCommandType;
      document.getElementById("defaulttimeout").value = param.defaultTimeout;
      document.getElementById("forcemultiplecoils").checked = param.supportsForceMultipleCoils;
     
    }, 10);

  }

  const UpdateInstrument= async function () {
    let InstrumentName = document.getElementById("instrumentname").value;
    let DefaultTcpIpPort = document.getElementById("tcpipport").value;
    let DefaultModbusCode = document.getElementById("modbuscode").value;
    let DefaultModbusCommandType = document.getElementById("modbuscommandtype").value;
    let DefaultTimeoutMs = document.getElementById("defaulttimeout").value;
    let SupportsForceMultipleCoils = document.getElementById("forcemultiplecoils").checked;
    let CreatedBy = currentUser.id;
    let ModifiedBy = currentUser.id;
    let validation = Instrumentaddvalidation();
    if (!validation) {
      return false;
    }
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + 'api/DeviceModel/' + Instrumentid, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: authHeader.Authorization,
        'app-origin':authHeader["app-origin"]
      },
      body: JSON.stringify({
        DeviceModelName: InstrumentName, DefaultTcpIpPort: DefaultTcpIpPort, DefaultModbusCode: DefaultModbusCode, 
        DefaultModbusCommandType: DefaultModbusCommandType, DefaultTimeoutMs: DefaultTimeoutMs, SupportsForceMultipleCoils: SupportsForceMultipleCoils,
         CreatedBy: CreatedBy, ModifiedBy: ModifiedBy
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == 1) {
          toast.success('Device Model Updated successfully');
          GetInstruments();
          setInstrumentList(true);
        } else if (responseJson == 2) {
          toast.error('Device Model already exist with given Device Model Name. Please try with another Device Model Name.');
        } else {
          toast.error('Unable to update the Device Model. Please contact adminstrator');
        }
      }).catch((error) => toast.error('Unable to update the Device Model. Please contact adminstrator'));
  }

  const DeleteInstrument = function (item) {
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
          await fetch(CommonFunctions.getWebApiUrl() + 'api/DeviceModel/' + id, {
            method: 'DELETE',
            headers:authHeader
          }).then((response) => response.json())
            .then((responseJson) => {
              if (responseJson == 1) {
                toast.success('Device Model deleted successfully')
                GetInstruments();
              } else {
                toast.error('Unable to delete Device Model. Please contact adminstrator');
              }
            }).catch((error) => toast.error('Unable to delete Device Model. Please contact adminstrator'));
        }
      });
  }
  const GetLookupdata = async function () {
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + "api/Instrumentslookup", {
      method: 'GET',
      headers:authHeader
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          setListInstruments(data);
        }
      }).catch((error) => toast.error('Unable to get the Instruments lookup list. Please contact adminstrator'));
  }
  
  const GetInstruments = async function () {
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + "api/DeviceModel", {
      method: 'GET',
      headers:authHeader
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          setListInstruments(data);
        }
      }).catch((error) => toast.error('Unable to get the Device Models list. Please contact adminstrator'));
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
        data: ListInstruments,
        loadData: function (filter) {
          $(".jsgrid-filter-row input:text").addClass("form-control").addClass("form-control-sm");
          $(".jsgrid-filter-row select").addClass("custom-select").addClass("custom-select-sm");
          return $.grep(this.data, function (item) {
            return ((!filter.deviceModelName || item.deviceModelName.toUpperCase().indexOf(filter.deviceModelName.toUpperCase()) >= 0)
              && (!filter.defaultTcpIpPort || item.defaultTcpIpPort.toUpperCase().indexOf(filter.defaultTcpIpPort.toUpperCase()) >= 0)
              && (!filter.defaultModbusCode || item.defaultModbusCode.toUpperCase().indexOf(filter.defaultModbusCode.toUpperCase()) >= 0)
              && (!filter.defaultModbusCommandType || item.defaultModbusCommandType.toUpperCase().indexOf(filter.defaultModbusCommandType.toUpperCase()) >= 0)
              && (!filter.defaultTimeoutMs || item.defaultTimeoutMs.toUpperCase().indexOf(filter.defaultTimeoutMs.toUpperCase()) >= 0)
            );
          });
        }
      },
      fields: [
        { name: "deviceModelName", title: "Device Model Name",align:"left", type: "text" },
        { name: "tcpIpPort", title: "TcpIp Port",align:"left", type: "text" },
        { name: "modbusCode", title: "Modbus Code", align:"left",type: "text" },
        { name: "modbusCommandType", title: "Modbus CommandType",align:"left", type: "text" },
        { name: "defaultTimeout", title: "Default Timeout",align:"left", type: "text" },
        {
          type: "control", width: 100, editButton: false, deleteButton: false,
          itemTemplate: function (value, item) {
            // var $result = gridRefjsgrid.current.fields.control.prototype.itemTemplate.apply(this, arguments);

            var $customEditButton = $("<button>").attr({ class: "customGridEditbutton jsgrid-button jsgrid-edit-button" })
              .click(function (e) {
                EditInstrument(item);
                /* alert("ID: " + item.id); */
                e.stopPropagation();
              });

            var $customDeleteButton = $("<button>").attr({ class: "customGridDeletebutton jsgrid-button jsgrid-delete-button" })
              .click(function (e) {
                DeleteInstrument(item);
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
    }
  }
  const DownloadExcel = async function (filetype) {          {/*edited*/}

    let params = new URLSearchParams({ filetype : filetype });
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl()+ "api/GsiDriver/InstrumentListExportToExcel?" + params,{
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
  return (
    <main id="main" className="main" >
      <div className="container">
        <div className="pagetitle">
          {!InstrumentList && Instrumentid == 0 && (
            <h1>Add Device Model</h1>
          )}
          {!InstrumentList && Instrumentid != 0 && (
            <h1>Update Device Model</h1>
          )}
          {InstrumentList && (
            <h1>Device Models List</h1>
          )}
        </div>
        <section className="section">
          <div className="container">
          
            <div className="me-2 mb-2 float-end">
              {InstrumentList && (
                <span className="operation_class mx-2" onClick={() => AddStationchange()}><i className="bi bi-plus-circle-fill"></i> <span>Create New Instrument</span></span>
              )}
              {!InstrumentList && (
                <span className="operation_class mx-2" onClick={() => AddStationchange('gridlist')}><i className="bi bi-card-list"></i> <span>View All Instruments</span></span>
              )}
            </div>
            {!InstrumentList && (
              <form id="AddInstrumentform" className="row" noValidate>
                
                <div className="col-md-12 mb-3">
                  <label for="instrumentname" className="form-label">Instrument Name:</label>
                  <input type="text" className="form-control" id="instrumentname" placeholder="Enter Instrument name" required />
                  <div class="invalid-feedback">Please enter Instrument name</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="tcpipport" className="form-label">Default Modbus TcpIp Port:</label>
                  <input type="number" className="form-control" id="tcpipport" placeholder="Enter Default Modbus TcpIp Port number"  />
                  <div class="invalid-feedback">Please enter Default Modbus TcpIp Port number</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="modbuscode" className="form-label">Default Modbus Code:</label>
                  <input type="text" className="form-control" id="modbuscode" placeholder="Enter Default Modbus Code"  />
                  <div class="invalid-feedback">Please enter Default Modbus Code</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="modbuscommandtype" className="form-label">Default Modbus Command Type:</label>
                  <input type="text" className="form-control" id="modbuscommandtype" placeholder="Enter Default Modbus Command Type"  />
                  <div class="invalid-feedback">Please enter Default Modbus Command Type</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="defaulttimeout" className="form-label">Default Timeout (ms):</label>
                  <input type="number" className="form-control" id="defaulttimeout" placeholder="Enter Default Timeout"  />
                  <div class="invalid-feedback">Please enter Default Timeout</div>
                </div>
               <div className="form-check">
                  <input type="checkbox" className="form-check-input" defaultChecked={false} id="forcemultiplecoils"/>&nbsp;
                  <label for="forcemultiplecoils" className="form-label">Supports Force Multiple Coils</label>
               </div>
               <br></br>
                <div className="col-md-12 text-center">
                  {!InstrumentList && Instrumentid == 0 && (
                    <button className="btn btn-primary" onClick={Instrumentadd} type="button">Add Instrument</button>
                  )}
                  {!InstrumentList && Instrumentid != 0 && (
                    <button className="btn btn-primary" onClick={UpdateInstrument} type="button">Update Instrument</button>
                  )}
                </div>
              </form>
            )}
            {InstrumentList && (
              <div className="jsGrid" ref={gridRefjsgridreport} />
            )}
          </div>

        </section>
        <br></br>
        <div align="center">
        {InstrumentList && (               
            <button type="button" className="btn btn-primary datashow me-0" onClick={() => DownloadExcel('excel')} >Download Excel</button>)} &nbsp;
             {InstrumentList && (
            <button type="button" className="btn btn-primary datashow me-0" onClick={() => DownloadExcel('csv')} >Download Csv</button>     
          )}
        </div>
      </div>
    </main>
  );
}
export default AddDeviceModels;