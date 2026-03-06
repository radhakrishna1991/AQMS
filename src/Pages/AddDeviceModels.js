import { id } from "chartjs-plugin-dragdata";
import React, { Component, useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import CommonFunctions from "../utils/CommonFunctions";
function AddDeviceModels() {
  const $ = window.jQuery;
  const gridRefjsgridreport = useRef();
  const [ListInstruments, setListInstruments] = useState([]);
  const [InstrumentList, setInstrumentList] = useState(true);
  const [Instrumentid, setInstrumentid] = useState(0);
  const [Type, setType] = useState(true);
  const currentUser = JSON.parse(sessionStorage.getItem("UserData"));
  const [gridLoad, setgridLoad] = useState(false);
  const [display, setDisplay] = useState({
    nameid: "none",
    tcpipportid: "none",
    modbuscodeid: "none",
    modbuscommandtypeid: "none",
    defaulttimeoutid: "none",
  });
  const [value, setValue] = useState({
    nameid: "",
    tcpipportid: "",
    modbuscodeid: "",
    modbuscommandtypeid: "",
    defaulttimeoutid: "",
  });

  const Instrumentaddvalidation = function (
    InstrumentName,
    DefaultTcpIpPort,
    DefaultModbusCode,
    DefaultModbusCommandType,
    DefaultTimeoutMs,
    SupportsForceMultipleCoils
  ) {
    let isvalid = true;
    let form = document.querySelectorAll("#AddInstrumentform")[0];
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      isvalid = false;
    }
    return isvalid;
  };
  const Instrumentadd = async function () {
    let InstrumentName = document.getElementById("instrumentname").value;
    let DefaultTcpIpPort = document.getElementById("tcpipport").value;
    let DefaultModbusCode = document.getElementById("modbuscode").value;
    let DefaultModbusCommandType =
      document.getElementById("modbuscommandtype").value;
    let DefaultTimeoutMs = document.getElementById("defaulttimeout").value;
    let SupportsForceMultipleCoils =
      document.getElementById("forcemultiplecoils").checked;
    let CreatedBy = currentUser.id;
    let ModifiedBy = currentUser.id;

    let validation = Instrumentaddvalidation(
      InstrumentName,
      DefaultTcpIpPort,
      DefaultModbusCode,
      DefaultModbusCommandType,
      DefaultTimeoutMs,
      SupportsForceMultipleCoils
    );
    if (!validation) {
      return false;
    }
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + "api/DeviceModel", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: authHeader.Authorization,
        "app-origin": authHeader["app-origin"],
      },
      body: JSON.stringify({
        DeviceModelName: InstrumentName,
        TcpIpPort: DefaultTcpIpPort,
        ModbusCode: DefaultModbusCode,
        ModbusCommandType: DefaultModbusCommandType,
        DefaultTimeout: DefaultTimeoutMs,
        SupportsForceMultipleCoils: SupportsForceMultipleCoils,
        CreatedBy: CreatedBy,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == "DeviceModeladd") {
          toast.success("Device Model added successfully");
          GetInstruments();
          setInstrumentList(true);
        } else if (responseJson == "DeviceModelexist") {
          toast.error(
            "DeviceModel already exist with given Device Model Name. Please try with another Device Model Name."
          );
        } else {
          toast.error(
            "Unable to add the Device Model. Please contact adminstrator"
          );
        }
      })
      .catch((error) =>
        toast.error(
          "Unable to add the Device Model. Please contact adminstrator"
        )
      );
  };

  const EditInstrument = function (param) {
    setInstrumentList(false);
    setInstrumentid(param.id);
    setTimeout(() => {
      document.getElementById("instrumentname").value = param.deviceModelName;
      setValue((prevDisplay) => ({
        ...prevDisplay,
        ["nameid"]: param.deviceModelName,
      }));
      document.getElementById("tcpipport").value = param.tcpIpPort;
      setValue((prevDisplay) => ({
        ...prevDisplay,
        ["tcpipportid"]: param.tcpIpPort,
      }));
      document.getElementById("modbuscode").value = param.modbusCode;
      setValue((prevDisplay) => ({
        ...prevDisplay,
        ["modbuscodeid"]: param.modbusCode,
      }));
      document.getElementById("modbuscommandtype").value =
        param.modbusCommandType;
      setValue((prevDisplay) => ({
        ...prevDisplay,
        ["modbuscommandtypeid"]: param.modbusCommandType,
      }));
      document.getElementById("defaulttimeout").value = param.defaultTimeout;
      setValue((prevDisplay) => ({
        ...prevDisplay,
        ["defaulttimeoutid"]: param.defaultTimeout,
      }));
      document.getElementById("forcemultiplecoils").checked =
        param.supportsForceMultipleCoils;
    }, 10);
  };

  const UpdateInstrument = async function () {
    debugger;
    let InstrumentName = document.getElementById("instrumentname").value;
    let DefaultTcpIpPort = document.getElementById("tcpipport").value;
    let DefaultModbusCode = document.getElementById("modbuscode").value;
    let DefaultModbusCommandType =
      document.getElementById("modbuscommandtype").value;
    let DefaultTimeoutMs = document.getElementById("defaulttimeout").value;
    let SupportsForceMultipleCoils =
      document.getElementById("forcemultiplecoils").checked;
    let CreatedBy = currentUser.id;
    let ModifiedBy = currentUser.id;
    let validation = Instrumentaddvalidation(
      InstrumentName,
      DefaultTcpIpPort,
      DefaultModbusCode,
      DefaultModbusCommandType,
      DefaultTimeoutMs,
      SupportsForceMultipleCoils
    );
    if (!validation) {
      return false;
    }
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(
      CommonFunctions.getWebApiUrl() + "api/DeviceModel/" + Instrumentid,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: authHeader.Authorization,
          "app-origin": authHeader["app-origin"],
        },
        body: JSON.stringify({
          DeviceModelName: InstrumentName,
          TcpIpPort: DefaultTcpIpPort,
          ModbusCode: DefaultModbusCode,
          ModbusCommandType: DefaultModbusCommandType,
          DefaultTimeout: DefaultTimeoutMs,
          SupportsForceMultipleCoils: SupportsForceMultipleCoils,
          CreatedBy: CreatedBy,
          ModifiedBy: ModifiedBy,
        }),
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == 1) {
          toast.success("Device Model Updated successfully");
          GetInstruments();
          setInstrumentList(true);
        } else if (responseJson == 2) {
          toast.error(
            "Device Model already exist with given Device Model Name. Please try with another Device Model Name."
          );
        } else {
          toast.error(
            "Unable to update the Device Model. Please contact adminstrator"
          );
        }
      })
      .catch((error) =>
        toast.error(
          "Unable to update the Device Model. Please contact adminstrator"
        )
      );
  };

  const DeleteInstrument = function (item) {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this Device Model !",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5cb85c",
      confirmButtonText: "Yes",
      closeOnConfirm: false,
    }).then(async function (isConfirm) {
      if (isConfirm.isConfirmed) {
        let id = item.id;
        let authHeader = await CommonFunctions.getAuthHeader();
        await fetch(CommonFunctions.getWebApiUrl() + "api/DeviceModel/" + id, {
          method: "DELETE",
          headers: authHeader,
        })
          .then((response) => response.json())
          .then((responseJson) => {
            if (responseJson == 1) {
              toast.success("Device Model deleted successfully");
              GetInstruments();
            } else {
              toast.error(
                "Unable to delete Device Model. Please contact adminstrator"
              );
            }
          })
          .catch((error) =>
            toast.error(
              "Unable to delete Device Model. Please contact adminstrator"
            )
          );
      }
    });
  };
  const GetLookupdata = async function () {
    document.getElementById("loader").style.display = "block";
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + "api/DeviceModellookup", {
      method: "GET",
      headers: authHeader,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setListInstruments(data);
        }
      })
      .catch((error) =>
        toast.error(
          "Unable to get the Device Model lookup list. Please contact adminstrator"
        )
      )
      .finally(() => {
        setgridLoad(true);
        document.getElementById("loader").style.display = "none";
      });
  };

  const GetInstruments = async function () {
    document.getElementById("loader").style.display = "block";
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + "api/DeviceModel", {
      method: "GET",
      headers: authHeader,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setListInstruments(data);
        }
      })
      .catch((error) =>
        toast.error(
          "Unable to get the Device Models list. Please contact adminstrator"
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
        data: ListInstruments,
        loadData: function (filter) {
          $(".jsgrid-filter-row input:text")
            .addClass("form-control")
            .addClass("form-control-sm");
          $(".jsgrid-filter-row select")
            .addClass("custom-select")
            .addClass("custom-select-sm");
          // debugger;
          return $.grep(this.data, function (item) {
            return (
              (!filter.deviceModelName ||
                item.deviceModelName
                  .toUpperCase()
                  .indexOf(filter.deviceModelName.toUpperCase()) >= 0) &&
              (!filter.tcpIpPort ||
                (item.tcpIpPort == null
                  ? false
                  : item.tcpIpPort.toString().includes(filter.tcpIpPort))) &&
              (!filter.modbusCode ||
                (item.modbusCode == null
                  ? false
                  : item.modbusCode.toString().includes(filter.modbusCode))) &&
              (!filter.modbusCommandType ||
                (item.modbusCommandType == null
                  ? false
                  : item.modbusCommandType
                      .toString()
                      .indexOf(filter.modbusCommandType) >= 0)) &&
              (!filter.defaultTimeout ||
                (item.defaultTimeout == null
                  ? false
                  : item.defaultTimeout
                      .toString()
                      .indexOf(filter.defaultTimeout) >= 0))
            );
          });
        },
      },
      fields: [
        {
          name: "deviceModelName",
          title: "Device Model Name",
          align: "left",
          type: "text",
        },
        { name: "tcpIpPort", title: "TcpIp Port", align: "left", type: "text" },
        {
          name: "modbusCode",
          title: "Modbus Code",
          align: "left",
          type: "text",
        },
        {
          name: "modbusCommandType",
          title: "Modbus CommandType",
          align: "left",
          type: "text",
        },
        {
          name: "defaultTimeout",
          title: "Default Timeout",
          align: "left",
          type: "text",
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
                EditInstrument(item);
                /* alert("ID: " + item.id); */
                e.stopPropagation();
              });

            var $customDeleteButton = $("<button>")
              .attr({
                class:
                  "customGridDeletebutton jsgrid-button jsgrid-delete-button",
              })
              .click(function (e) {
                DeleteInstrument(item);
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
      setInstrumentList(true);
    } else {
      setInstrumentList(false);
      setType(false);
      setInstrumentid(0);
      resetState();
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
        "api/DeviceModelsExportToExcel?" +
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
    // document.getElementById('loader').style.display = "none";
    /* fetch(url + params, {
       method: 'GET',
     }).then((response) => response.json())
       .then((data) => {
       }).catch((error) => console.log(error)); */
  };

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
        <div className="row my-3">
          <div className="pagetitle col">
            {!InstrumentList && Instrumentid == 0 && <h1>Add Device Model</h1>}
            {!InstrumentList && Instrumentid != 0 && (
              <h1>Update Device Model</h1>
            )}
            {InstrumentList && <h1>Device Models List</h1>}
          </div>
          <div className="text-end col">
            {InstrumentList ? (
              <span
                className="operation_class mx-2"
                onClick={() => AddStationchange()}
              >
                <i className="bi bi-plus-circle-fill"></i>{" "}
                <span>Create New Device Model</span>
              </span>
            ) : (
              <span
                className="operation_class mx-2"
                onClick={() => AddStationchange("gridlist")}
              >
                <i className="bi bi-card-list"></i>{" "}
                <span>View All Device Models</span>
              </span>
            )}
          </div>
        </div>
        <section className="section">
          <div>
            {!InstrumentList && (
              <>
                <div
                  className="text-danger mb-3 text-start"
                  style={{ fontSize: "12px" }}
                >
                  * Mark fields are mandatory to fill
                </div>
                <form id="AddInstrumentform" className="row" noValidate>
                  <div className="col-md-6 mb-3">
                    <label for="instrumentname" className="form-label">
                      <span className="text-danger">*</span> Device Model Name:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="instrumentname"
                      placeholder="Enter Device Model"
                      value={value.nameid}
                      onChange={(e) =>
                        handleTextBox(e.target.value, 50, "nameid")
                      }
                      required
                    />
                    <div
                      id="nameid"
                      style={{ display: display.nameid }}
                      className="invalid-feedback"
                    >
                      Character limit exceeded! Maximum 50 characters are
                      allowed.
                    </div>
                    <div class="invalid-feedback">
                      Please enter Device Model Name
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label for="tcpipport" className="form-label">
                      TcpIp Port:
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="tcpipport"
                      placeholder="Enter TcpIp Port number"
                      value={value.tcpipportid}
                      onChange={(e) =>
                        handleTextBox(e.target.value, 9, "tcpipportid")
                      }
                    />
                    <div
                      id="tcpipportid"
                      style={{ display: display.tcpipportid }}
                      className="invalid-feedback"
                    >
                      Character limit exceeded! Maximum 9 characters are
                      allowed.
                    </div>
                    <div class="invalid-feedback">
                      Please enter TcpIp Port number
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label for="modbuscode" className="form-label">
                      Modbus Code:
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="modbuscode"
                      placeholder="Enter Modbus Code"
                      value={value.modbuscodeid}
                      onChange={(e) =>
                        handleTextBox(e.target.value, 9, "modbuscodeid")
                      }
                    />
                    <div
                      id="modbuscodeid"
                      style={{ display: display.modbuscodeid }}
                      className="invalid-feedback"
                    >
                      Character limit exceeded! Maximum 9 characters are
                      allowed.
                    </div>
                    <div class="invalid-feedback">Please enter Modbus Code</div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label for="modbuscommandtype" className="form-label">
                      Modbus Command Type:
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="modbuscommandtype"
                      placeholder="Enter Modbus Command Type"
                      value={value.modbuscommandtypeid}
                      onChange={(e) =>
                        handleTextBox(e.target.value, 9, "modbuscommandtypeid")
                      }
                    />
                    <div
                      id="modbuscommandtypeid"
                      style={{ display: display.modbuscommandtypeid }}
                      className="invalid-feedback"
                    >
                      Character limit exceeded! Maximum 9 characters are
                      allowed.
                    </div>
                    <div class="invalid-feedback">
                      Please enter Modbus Command Type
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label for="defaulttimeout" className="form-label">
                      Default Timeout:
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="defaulttimeout"
                      placeholder="Enter Default Timeout"
                      value={value.defaulttimeoutid}
                      onChange={(e) =>
                        handleTextBox(e.target.value, 9, "defaulttimeoutid")
                      }
                    />
                    <div
                      id="defaulttimeoutid"
                      style={{ display: display.defaulttimeoutid }}
                      className="invalid-feedback"
                    >
                      Character limit exceeded! Maximum 9 characters are
                      allowed.
                    </div>
                    <div class="invalid-feedback">
                      Please enter Default Timeout
                    </div>
                  </div>
                  <div className="col-md-6 mt-md-4 mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input mx-0"
                      defaultChecked={false}
                      id="forcemultiplecoils"
                    />
                    &nbsp;
                    <label for="forcemultiplecoils" className="form-label ms-2 mt-0">
                      Supports Force Multiple Coils
                    </label>
                  </div>
                  <br></br>
                  <div className="col-md-12 text-center">
                    {!InstrumentList && Instrumentid == 0 && (
                      <button
                        className="btn btn-primary"
                        onClick={Instrumentadd}
                        type="button"
                      >
                        Add Device Model
                      </button>
                    )}
                    {!InstrumentList && Instrumentid != 0 && (
                      <button
                        className="btn btn-primary"
                        onClick={UpdateInstrument}
                        type="button"
                      >
                        Update Device Model
                      </button>
                    )}
                  </div>
                </form>
              </>
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

        {InstrumentList && ListInstruments.length > 0 && (
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
export default AddDeviceModels;
