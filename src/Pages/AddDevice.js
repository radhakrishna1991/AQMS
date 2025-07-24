import { id } from "chartjs-plugin-dragdata";
import React, { Component, useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import CommonFunctions from "../utils/CommonFunctions";
function AddDevice() {
  const $ = window.jQuery;
  const gridRefjsgridreport = useRef();
  const [ListStations, setListStations] = useState([]);
  const [ListDevices, setListDevices] = useState([]);
  const [ListCommandType, setListCommandType] = useState([]);
  const [ListParameterDataFormat, setListParameterDataFormat] = useState([]);
  const [DeviceList, setDeviceList] = useState(true);
  const [ListDeviceModels, setListDeviceModels] = useState([]);
  const [Deviceid, setDeviceid] = useState(0);
  const [Status, setStatus] = useState(true);
  const [ServiceMode, setServiceMode] = useState(false);
  const [Enable, setEnable] = useState(false);
  const [Type, setType] = useState(true);
  const currentUser = JSON.parse(sessionStorage.getItem("UserData"));
  const [gridLoad, setgridLoad] = useState(false);
  const [display, setDisplay] = useState({
    name: "none",
    instrumentid: "none",
    databitsid: "none",
    portid: "none",
    ipaddressid: "none",
  });
  const [value, setValue] = useState({
    name: "",
    instrumentid: "",
    databitsid: "",
    portid: "",
    ipaddressid: "",
  });

  const Deviceaddvalidation = function (
    StationID,
    DeviceName,
    DeviceModel,
    IPAddress,
    Port,
    Type,
    Number
  ) {
    let isvalid = true;
    let form = document.querySelectorAll("#AddDeviceform")[0];
    if (Type == "Tcp/IP") {
      $("#invalidIPaddress")[0].style.display = "none";
      let validIPaddress = validateIPaddress(IPAddress);
      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        isvalid = false;
      } else if (!validIPaddress && IPAddress != "") {
        form.classList.add("was-validated");
        $("#invalidIPaddress")[0].style.display = "block";
        isvalid = false;
      }
    } else {
      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        isvalid = false;
      }
    }
    return isvalid;
  };

  const validateIPaddress = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])$/
      );
  };

  const Deviceadd = async function () {
    let StationID = document.getElementById("stationname").value;
    let DeviceName = document.getElementById("devicename").value;
    let DeviceModel = document.getElementById("devicemodel").value;
    let deviceId = document.getElementById("deviceid").value;
    let commandTypeId = document.getElementById("modbusCommandType").value;
    let dataFormatTypeId = document.getElementById("dataFormatType").value;
    let IPAddress = "";
    let Port = "";
    let CommPort = "";
    let BaudRate = "";
    let Parity = "";
    let StopBits = "";
    let DataBits = "";
    let SerialRtuMode = "";
    let DataCollectionMode = "";
    let Type = document.getElementById("type").value;
    if (Type == "Tcp/IP") {
      IPAddress = document.getElementById("ipaddress").value;
      Port = document.getElementById("port").value;
    } else if (Type == "Serial") {
      CommPort = document.getElementById("commport").value;
      BaudRate = document.getElementById("baudrate").value;
      Parity = document.getElementById("parity").value;
      StopBits = document.getElementById("stopbits").value;
      DataBits = document.getElementById("databits").value;
      SerialRtuMode = document.getElementById("serialrtumode").checked;
      DataCollectionMode = document.getElementById("datacollectionmode").value;
    }
    let CreatedBy = currentUser.id;
    let ModifiedBy = currentUser.id;
    let status = Status ? 1 : 0;
    let servicemode = ServiceMode ? 1 : 0;
    let enable = Enable ? 1 : 0;
    let validation = Deviceaddvalidation(
      StationID,
      DeviceName,
      DeviceModel,
      IPAddress,
      Port,
      Type
    );
    if (!validation) {
      return false;
    }
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + "api/Devices", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: authHeader.Authorization,
        "app-origin": authHeader["app-origin"],
      },
      body: JSON.stringify({
        StationID: StationID,
        DeviceName: DeviceName,
        DeviceModel: DeviceModel,
        InstrumentID: deviceId,
        IPAddress: IPAddress,
        Port: Port,
        Type: Type,
        CommPort: CommPort,
        BaudRate: BaudRate,
        Parity: Parity,
        StopBits: StopBits,
        DataBits: DataBits,
        ServiceMode: servicemode,
        SerialRtuMode: SerialRtuMode,
        Status: status,
        CreatedBy: CreatedBy,
        ModifiedBy: ModifiedBy,
        IsEnable: enable,
        DataCollectionMode: DataCollectionMode,
        DataFormatType: dataFormatTypeId,
        ModbusCommandType: commandTypeId
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == "Deviceadd") {
          toast.success("Device added successfully");
          GetDevices();
          setDeviceList(true);
        } else if (responseJson == "Deviceexist") {
          toast.error(
            "Device already exist with given Device Name. Please try with another Device Name."
          );
        } else {
          toast.error("Unable to add the Device. Please contact adminstrator");
        }
      })
      .catch((error) =>
        toast.error("Unable to add the Device. Please contact adminstrator")
      );
  };

  const EditDevice = function (param) {
    setDeviceList(false);
    setDeviceid(param.id);
    setType(param.type);
    setStatus(param.status == 1 ? true : false);
    setServiceMode(param.serviceMode == 1 ? true : false);
    setEnable(param.isEnable == 1 ? true : false);
    setTimeout(() => {
      document.getElementById("stationname").value = param.stationID;
      document.getElementById("devicename").value = param.deviceName;
      setValue((prevDisplay) => ({
        ...prevDisplay,
        ["name"]: param.deviceName,
      }));
      document.getElementById("devicemodel").value = param.deviceModel;
      document.getElementById("type").value = param.type;
      document.getElementById("deviceid").value = param.instrumentID;
      setValue((prevDisplay) => ({
        ...prevDisplay,
        ["instrumentid"]: param.instrumentID,
      }));
      if (param.type == "Tcp/IP") {
        document.getElementById("ipaddress").value = param.ipAddress;
        document.getElementById("port").value = param.port;
        setValue((prevDisplay) => ({ ...prevDisplay, ["portid"]: param.port }));
        setValue((prevDisplay) => ({
          ...prevDisplay,
          ["ipaddressid"]: param.ipAddress,
        }));
      } else if (param.type == "Serial") {
        document.getElementById("commport").value = param.commPort;
        document.getElementById("baudrate").value = param.baudRate;
        document.getElementById("parity").value = param.parity;
        document.getElementById("stopbits").value = param.stopBits;
        document.getElementById("databits").value = param.dataBits;
        setValue((prevDisplay) => ({
          ...prevDisplay,
          ["databitsid"]: param.dataBits,
        }));
        document.getElementById("serialrtumode").checked = param.serialRtuMode;
        document.getElementById("datacollectionmode").value =
          param.dataCollectionMode;
      }
      document.getElementById("dataFormatType").value = param.dataFormatType ?? "";
      document.getElementById("modbusCommandType").value = param.modbusCommandType ?? "";
    }, 10);
  };

  const UpdateDevice = async function () {
    let StationID = document.getElementById("stationname").value;
    let DeviceName = document.getElementById("devicename").value;
    let DeviceModel = document.getElementById("devicemodel").value;
    let deviceId = document.getElementById("deviceid").value;
    let commandTypeId = document.getElementById("modbusCommandType").value;
    let dataFormatTypeId = document.getElementById("dataFormatType").value;
    let IPAddress = "";
    let Port = "";
    let CommPort = "";
    let BaudRate = "";
    let Parity = "";
    let StopBits = "";
    let DataBits = "";
    let SerialRtuMode = "";
    let DataCollectionMode = 1;
    let Type = document.getElementById("type").value;
    if (Type == "Tcp/IP") {
      IPAddress = document.getElementById("ipaddress").value;
      Port = document.getElementById("port").value;
    } else if (Type == "Serial") {
      CommPort = document.getElementById("commport").value;
      BaudRate = document.getElementById("baudrate").value;
      Parity = document.getElementById("parity").value;
      StopBits = document.getElementById("stopbits").value;
      DataBits = document.getElementById("databits").value;
      SerialRtuMode = document.getElementById("serialrtumode").checked;
      DataCollectionMode = document.getElementById("datacollectionmode").value;
    }
    let CreatedBy = currentUser.id;
    let ModifiedBy = currentUser.id;
    let status = Status ? 1 : 0;
    let servicemode = ServiceMode ? 1 : 0;
    //let enable=Enable?1:0;
    let validation = Deviceaddvalidation();
    if (!validation) {
      return false;
    }
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + "api/Devices/" + Deviceid, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: authHeader.Authorization,
        "app-origin": authHeader["app-origin"],
      },
      body: JSON.stringify({
        StationID: StationID,
        DeviceName: DeviceName,
        DeviceModel: DeviceModel,
        InstrumentID: deviceId,
        IPAddress: IPAddress,
        Port: Port,
        Type: Type,
        ID: Deviceid,
        Status: status,
        CommPort: CommPort,
        BaudRate: BaudRate,
        Parity: Parity,
        StopBits: StopBits,
        DataBits: DataBits,
        ServiceMode: servicemode,
        SerialRtuMode: SerialRtuMode,
        CreatedBy: CreatedBy,
        ModifiedBy: ModifiedBy,
        DataCollectionMode: DataCollectionMode,
        DataFormatType: dataFormatTypeId,
        ModbusCommandType: commandTypeId
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == 1) {
          toast.success("Device Updated successfully");
          GetDevices();
          setDeviceList(true);
        } else if (responseJson == 2) {
          toast.error(
            "Device already exist with given Device Name. Please try with another Device Name."
          );
        } else {
          toast.error(
            "Unable to update the Device. Please contact adminstrator"
          );
        }
      })
      .catch((error) =>
        toast.error("Unable to update the Device. Please contact adminstrator")
      );
  };

  const DeleteDevice = function (item) {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this Device !",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5cb85c",
      confirmButtonText: "Yes",
      closeOnConfirm: false,
    }).then(async function (isConfirm) {
      if (isConfirm.isConfirmed) {
        let id = item.id;
        let authHeader = await CommonFunctions.getAuthHeader();
        await fetch(CommonFunctions.getWebApiUrl() + "api/Devices/" + id, {
          method: "DELETE",
          headers: authHeader,
        })
          .then((response) => response.json())
          .then((responseJson) => {
            if (responseJson == 1) {
              toast.success("Device deleted successfully");
              GetDevices();
            } else {
              toast.error(
                "Unable to delete Device. Please contact adminstrator"
              );
            }
          })
          .catch((error) =>
            toast.error("Unable to delete Device. Please contact adminstrator")
          );
      }
    });
  };
  const GetLookupdata = async function () {
    document.getElementById("loader").style.display = "block";
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + "api/Deviceslookup", {
      method: "GET",
      headers: authHeader,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setListStations(data.listStations);
          setListDevices(data.listDevices);
          setListDeviceModels(data.listDeviceModels);
          setListCommandType(data.listCommandType);
          setListParameterDataFormat(data.listDataFormat);
        }
      })
      .catch((error) =>
        toast.error(
          "Unable to get the Devices lookup list. Please contact adminstrator"
        )
      )
      .finally(() => {
        setgridLoad(true);
        document.getElementById("loader").style.display = "none";
      });
  };

  const GetDevices = async function () {
    document.getElementById("loader").style.display = "block";
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + "api/Devices", {
      method: "GET",
      headers: authHeader,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setListDevices(data);
        }
      })
      .catch((error) =>
        toast.error(
          "Unable to get the devices list. Please contact adminstrator"
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
    GetLookupdata();
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
        data: ListDevices,
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
              (!filter.stationID || item.stationID === filter.stationID) &&
              (!filter.deviceModel ||
                item.deviceModel === filter.deviceModel) &&
              (!filter.deviceName ||
                item.deviceName
                  .toUpperCase()
                  .indexOf(filter.deviceName.toUpperCase()) >= 0) &&
              (!filter.ipAddress ||
                item.ipAddress
                  .toUpperCase()
                  .indexOf(filter.ipAddress.toUpperCase()) >= 0) &&
              (!filter.port ||
                (item.port == null
                  ? false
                  : item.port.toString().indexOf(filter.port) >= 0)) &&
              (!filter.type ||
                item.type.toUpperCase().indexOf(filter.type.toUpperCase()) >= 0) &&
              (!filter.modbusCommandType ||
                (item.modbusCommandType == null
                  ? false
                  : item.modbusCommandType === filter.modbusCommandType)) &&
              (!filter.dataFormatType ||
                (item.dataFormatType == null
                  ? false
                  : item.dataFormatType === filter.dataFormatType))
            );
          });
        },
      },
      fields: [
        {
          name: "stationID",
          title: "Station Name",
          align: "left",
          type: "select",
          items: ListStations,
          valueField: "id",
          textField: "stationName",
        },
        {
          name: "deviceName",
          title: "Device Name",
          align: "left",
          type: "text",
        },
        {
          name: "deviceModel",
          title: "Device Model",
          align: "left",
          type: "select",
          items: ListDeviceModels,
          valueField: "id",
          textField: "deviceModelName",
        },
        { name: "ipAddress", title: "IP Address", align: "left", type: "text" },
        { name: "port", title: "Port", align: "left", type: "text" },
        { name: "type", title: "Type", align: "left", type: "text" },
        {
          name: "modbusCommandType",
          title: "Modbus Command Type",
          align: "left",
          type: "select",
          items: ListCommandType,
          valueField: "id",
          textField: "commandType",
        },
        {
          name: "dataFormatType",
          title: "Data Format Type",
          align: "left",
          type: "select",
          items: ListParameterDataFormat,
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
                EditDevice(item);
                /* alert("ID: " + item.id); */
                e.stopPropagation();
              });

            var $customDeleteButton = $("<button>")
              .attr({
                class:
                  "customGridDeletebutton jsgrid-button jsgrid-delete-button",
              })
              .click(function (e) {
                DeleteDevice(item);
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
      setDeviceList(true);
    } else {
      setDeviceList(false);
      setType(false);
      setDeviceid(0);
      resetState();
      setTimeout(() => {
        setType("Tcp/IP");
        document.getElementById("type").value = "Tcp/IP";
      }, 10);
    }
  };

  const resetState = () => {
    const newState = { ...value };
    for (const key in newState) {
      if (newState.hasOwnProperty(key)) {
        newState[key] = "";
      }
    }
    setValue(newState);
  };

  const DownloadExcel = async function (filetype) {
    {
      /*edited*/
    }
    let params = new URLSearchParams({ filetype: filetype });
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(
      CommonFunctions.getWebApiUrl() +
        "api/AirQuality/DeviceListExportToExcel?" +
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
    //  document.getElementById('loader').style.display = "none";
    /* fetch(url + params, {
       method: 'GET',
     }).then((response) => response.json())
       .then((data) => {
       }).catch((error) => console.log(error)); */
  };

  const DeviceModelChange = (event, index) => {
    // debugger;
    let DeviceModel = ListDeviceModels[index - 1];
    setTimeout(() => {
      let deviceid = document.getElementById("deviceid");
      let port = document.getElementById("port");
      if (deviceid != null) {
        deviceid.value = DeviceModel.modbusCode ?? "";
        setValue((prevDisplay) => ({
          ...prevDisplay,
          ["instrumentid"]: DeviceModel.modbusCode,
        }));
      }
      if (port != null) {
        port.value = DeviceModel.tcpIpPort;
        setValue((prevDisplay) => ({
          ...prevDisplay,
          ["portid"]: DeviceModel.tcpIpPort,
        }));
      }
    }, 10);
  };

  const setTypechange = (event) => {
    setType(event);
    let SelDeviceModel = document.getElementById("devicemodel").value;
    let DeviceModel = ListDeviceModels.find((x) => x.id == SelDeviceModel);
    setTimeout(() => {
      let deviceid = document.getElementById("deviceid");
      let port = document.getElementById("port");
      if (deviceid != null) {
        deviceid.value = DeviceModel.modbusCode;
      }
      if (port != null) {
        port.value = DeviceModel.tcpIpPort;
      }
    }, 10);
  };

  /* const handleTextBox = (event, character, elementId) => {
    debugger;
    const value = event;  
        if (value.length < character) {
         $(`#${elementId}`)[0].style.display="none";
        } else {
          $(`#${elementId}`)[0].style.display="block";
        }  
  } */

  const handleTextBox = (value, characterLimit, elementId) => {
    if (value.length <= characterLimit) {
      setDisplay((prevDisplay) => ({
        ...prevDisplay,
        [elementId]: "none",
      }));
      setValue((prevDisplay) => ({
        ...prevDisplay,
        [elementId]: value,
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
            {!DeviceList && Deviceid == 0 && <h1>Add Device</h1>}
            {!DeviceList && Deviceid != 0 && <h1>Update Device</h1>}
            {DeviceList && <h1>Devices List</h1>}
          </div>
          <div className="col text-end">
            {DeviceList ? (
              <span
                className="operation_class"
                onClick={() => AddStationchange()}
              >
                <i className="bi bi-plus-circle-fill"></i>{" "}
                <span>Create New Device</span>
              </span>
            ) : (
              <span
                className="operation_class"
                onClick={() => AddStationchange("gridlist")}
              >
                <i className="bi bi-card-list"></i>{" "}
                <span>View All Devices</span>
              </span>
            )}
          </div>
        </div>

        <section className="section">
          <div>
            {!DeviceList && (
              <>
                <div
                  className="text-danger mb-3 text-start"
                  style={{ fontSize: "12px" }}
                >
                  * Mark fields are mandatory to fill
                </div>
                <form id="AddDeviceform" className="row" noValidate>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="StationName" className="form-label">
                      <span className="text-danger">*</span> Station Name:
                    </label>
                    <select className="form-select" id="stationname" required>
                      <option selected value="">
                        Select station name
                      </option>
                      {ListStations.map((x, y) => (
                        <option value={x.id} key={y}>
                          {x.stationName}
                        </option>
                      ))}
                    </select>
                    <div className="invalid-feedback">
                      Please select station name
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="devicename" className="form-label">
                      <span className="text-danger">*</span> Device Name:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="devicename"
                      placeholder="Enter device name"
                      value={value.name}
                      onChange={(e) =>
                        handleTextBox(e.target.value, 50, "name")
                      }
                      required
                    />
                    <div
                      id="name"
                      style={{ display: display.name }}
                      className="invalid-feedback"
                    >
                      Character limit exceeded! Maximum 50 characters are
                      allowed.
                    </div>
                    <div className="invalid-feedback">
                      Please enter device name
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="devicemodel" className="form-label">
                      <span className="text-danger">*</span> Device Model:
                    </label>
                    <select
                      className="form-select"
                      id="devicemodel"
                      required
                      onChange={(e) =>
                        DeviceModelChange(e, e.target.selectedIndex)
                      }
                    >
                      <option selected value="">
                        Select device model
                      </option>
                      {ListDeviceModels.map((x, y) => (
                        <option value={x.id} key={y}>
                          {x.deviceModelName}
                        </option>
                      ))}
                    </select>
                    <div className="invalid-feedback">
                      Please select device model
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="deviceid" className="form-label">
                      <span className="text-danger">*</span> Instrument ID:
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="deviceid"
                      placeholder="Enter instrument id"
                      value={value.instrumentid}
                      onChange={(e) =>
                        handleTextBox(e.target.value, 9, "instrumentid")
                      }
                      required
                    />
                    <div
                      id="instrumentid"
                      style={{ display: display.instrumentid }}
                      className="invalid-feedback"
                    >
                      Character limit exceeded! Maximum 9 characters are
                      allowed.
                    </div>
                    <div className="invalid-feedback">Please enter id</div>
                  </div>
                  <div className="col-md-12 mb-3">
                    <label htmlFor="type" className="form-label">
                      <span className="text-danger">*</span> Type:
                    </label>
                    <select
                      className="form-select"
                      id="type"
                      onChange={(e) => setTypechange(e.target.value)}
                      required
                    >
                      <option selected value="">
                        Select type
                      </option>
                      <option value="Serial">Serial</option>
                      <option value="Tcp/IP">Tcp/IP</option>
                      <option value="Analog">Analog</option>
                      {/*  <option value="modbus"  >Modbus</option> */}
                    </select>
                    <div className="invalid-feedback">Please select type</div>
                  </div>
                  {Type == "Serial" && (
                    <div className="row mx-0 px-0">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="commport" className="form-label">
                          <span className="text-danger">*</span> Comm Port:
                        </label>
                        <select className="form-select" id="commport" required>
                          <option selected value="">
                            Select comm port
                          </option>
                          {window.CommPort.map((x, y) => (
                            <option value={x}>{x}</option>
                          ))}
                        </select>
                        <div className="invalid-feedback">
                          Please select comm port
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="baudrate" className="form-label">
                          <span className="text-danger">*</span> Baud Rate:
                        </label>
                        <select className="form-select" id="baudrate" required>
                          <option selected value="">
                            Select baud rate
                          </option>
                          {window.BaudRate.map((x, y) => (
                            <option value={x}>{x}</option>
                          ))}
                        </select>
                        <div className="invalid-feedback">
                          Please select Baud Rate
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="parity" className="form-label">
                          <span className="text-danger">*</span> Parity:
                        </label>
                        <select className="form-select" id="parity" required>
                          <option selected value="">
                            Select parity
                          </option>
                          {window.Parity.map((x, y) => (
                            <option value={x}>{x}</option>
                          ))}
                        </select>
                        <div className="invalid-feedback">
                          Please select parity
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="stopbits" className="form-label">
                          <span className="text-danger">*</span> Stop Bits:
                        </label>
                        <select className="form-select" id="stopbits" required>
                          <option selected value="">
                            Select bits
                          </option>
                          {window.StopBits.map((x, y) => (
                            <option value={x}>{x}</option>
                          ))}
                        </select>
                        <div className="invalid-feedback">
                          Please select stop bits
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label htmlFor="databits" className="form-label">
                          <span className="text-danger">*</span> Data Bits:
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="databits"
                          placeholder="Enter IP Data Bits"
                          defaultValue="8"
                          value={value.databitsid}
                          onChange={(e) =>
                            handleTextBox(e.target.value, 9, "databitsid")
                          }
                          required
                        />
                        <div
                          id="databitsid"
                          style={{ display: display.databitsid }}
                          className="invalid-feedback"
                        >
                          Character limit exceeded! Maximum 9 characters are
                          allowed.
                        </div>
                        <div className="invalid-feedback">
                          Please enter data bits
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label
                          htmlFor="datacollectionmode"
                          className="form-label"
                        >
                          Data Collection Mode:
                        </label>
                        <select className="form-select" id="datacollectionmode">
                          <option selected value="">
                            Select mode
                          </option>
                          {window.DataCollectionMode.map((x, y) => (
                            <option value={x.Value}>{x.Name}</option>
                          ))}
                        </select>
                        <div className="invalid-feedback">
                          Please select data collection mode
                        </div>
                      </div>
                      <div className="col-md-3 offset-md-1 mb-3">
                        <div className="mt-md-4 mt-2 form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="serialrtumode"
                            defaultChecked={false}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="serialrtumode"
                          >
                            Serial RTU Mode
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                  {Type == "Tcp/IP" && (
                    <div className="row mx-0 px-0">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="port" className="form-label">
                          <span className="text-danger">*</span> Port:
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="port"
                          placeholder="Enter port"
                          value={value.portid}
                          onChange={(e) =>
                            handleTextBox(e.target.value, 9, "portid")
                          }
                          required
                        />
                        <div
                          id="portid"
                          style={{ display: display.portid }}
                          className="invalid-feedback"
                        >
                          Character limit exceeded! Maximum 9 characters are
                          allowed.
                        </div>
                        <div className="invalid-feedback">
                          Please enter port
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="ipaddress" className="form-label">
                          <span className="text-danger">*</span> IP Address:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="ipaddress"
                          placeholder="Enter IP address"
                          value={value.ipaddressid}
                          onChange={(e) =>
                            handleTextBox(e.target.value, 30, "ipaddressid")
                          }
                          required
                        />
                        <div
                          id="ipaddressid"
                          style={{ display: display.ipaddressid }}
                          className="invalid-feedback"
                        >
                          Character limit exceeded! Maximum 30 characters are
                          allowed.
                        </div>
                        <div className="invalid-feedback">
                          Please enter IP address
                        </div>
                        <div
                          className="invalid-feedback"
                          style={{ display: "none" }}
                          id="invalidIPaddress"
                        >
                          Please enter valid IPaddress.
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="modbusCommandType" className="form-label">
                       Modbus Command Type:
                    </label>
                    <select
                      className="form-select"
                      id="modbusCommandType"
                      // required
                    >
                      <option selected value="">
                        Select Modbus Command Type
                      </option>
                      {ListCommandType.map((x, y) => (
                        <option value={x.id} key={y}>
                          {x.commandType}
                        </option>
                      ))}
                    </select>
                  </div>  
                   <div className="col-md-6 mb-3">
                    <label htmlFor="dataFormatType" className="form-label">
                       Data Format Type:
                    </label>
                    <select
                      className="form-select"
                      id="dataFormatType"
                      // required
                    >
                      <option selected value="">
                        Select Data Format Type
                      </option>
                      {ListParameterDataFormat.map((x, y) => (
                        <option value={x.id} key={y}>
                          {x.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="servicemode" className="form-label">
                      Service Mode:{" "}
                    </label>
                    <div className="form-check d-inline-block form-switch ms-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="servicemode"
                        onChange={(e) => setServiceMode(e.target.checked)}
                        defaultChecked={ServiceMode}
                      />
                      {ServiceMode && (
                        <label
                          className="form-check-label"
                          htmlFor="flexSwitchCheckChecked"
                        >
                          On
                        </label>
                      )}
                      {!ServiceMode && (
                        <label
                          className="form-check-label"
                          htmlFor="flexSwitchCheckChecked"
                        >
                          Off
                        </label>
                      )}
                    </div>
                  </div>
                  {/*  <div className="col-md-4 mb-3">
                  <label htmlFor="Status" className="form-label">Enabled: </label>
                  <div className="form-check d-inline-block form-switch ms-2">
                    <input className="form-check-input" type="checkbox" role="switch" id="enabled" onChange={(e) => setEnable(e.target.checked)} defaultChecked={Enable} />
                    {Enable && (
                      <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Yes</label>
                    )}
                    {!Enable && (
                      <label className="form-check-label" htmlFor="flexSwitchCheckChecked">No</label>
                    )}
                  </div>
                </div> */}
                  <div className="col-md-4 mb-3">
                    <label htmlFor="Status" className="form-label">
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
                          htmlFor="flexSwitchCheckChecked"
                        >
                          Active
                        </label>
                      )}
                      {!Status && (
                        <label
                          className="form-check-label"
                          htmlFor="flexSwitchCheckChecked"
                        >
                          Inactive
                        </label>
                      )}
                    </div>
                  </div>
                  <div className="col-md-12 text-center">
                    {!DeviceList && Deviceid == 0 && (
                      <button
                        className="btn btn-primary"
                        onClick={Deviceadd}
                        type="button"
                      >
                        Add Device
                      </button>
                    )}
                    {!DeviceList && Deviceid != 0 && (
                      <button
                        className="btn btn-primary"
                        onClick={UpdateDevice}
                        type="button"
                      >
                        Update Device
                      </button>
                    )}
                  </div>
                </form>
              </>
            )}
            {DeviceList && <div className="jsGrid" ref={gridRefjsgridreport} />}
          </div>
          <div className="col-md-4">
            <div className="row">
              <div id="loader" className="loader"></div>
            </div>
          </div>
        </section>
        <br></br>

        {DeviceList && ListDevices.length > 0 && (
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
export default AddDevice;
