import React, { Component, useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
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
  const [gridLoad, setgridLoad] = useState(false);
  const [ParseParamValue, setParseParamValue] = useState(true);
  const currentUser = JSON.parse(sessionStorage.getItem("UserData"));
  const [display, setDisplay] = useState({
    parameternameid: "none",
    scalefactorid: "none",
    coefaid: "none",
    coefbid: "none",
    frequencyid: "none",
    pollingintervalid: "none",
    averageintervalid: "none",
    registerindexid: "none",
    parsefuncitonid: "none",
    sendcommandid: "none",
    highhighlimitid: "none",
    highlimitid: "none",
    lowlowlimitid: "none",
    lowlimitid: "none",
    thresholdlimitid: "none",
  });
  const [value, setValue] = useState({
    parameternameid: "",
    scalefactorid: "",
    coefaid: "",
    coefbid: "",
    frequencyid: "",
    pollingintervalid: "",
    averageintervalid: "",
    registerindexid: "",
    parsefuncitonid: "",
    sendcommandid: "",
    highhighlimitid: "",
    highlimitid: "",
    lowlowlimitid: "",
    lowlimitid: "",
    thresholdlimitid: "",
  });

  const parameteraddvalidation = function (
    StationID,
    DeviceID,
    DriverID,
    ParameterName,
    PollingInterval,
    AvgInterval,
    Unit,
    ScaleFactor
  ) {
    let isvalid = true;
    let form = document.querySelectorAll("#AddParametersform")[0];
    /*  if (StationID == "") {
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
    } */
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      isvalid = false;
    }
    return isvalid;
    return isvalid;
  };
  const parameteradd = async function () {
    debugger;
    let StationID = document.getElementById("stationname").value;
    let DeviceID = document.getElementById("devicename").value;
    let DriverID = document.getElementById("drivername").value;
    let ParameterName = document.getElementById("parametername").value;
    let ScaleFactor = document.getElementById("scalefactor").value;
    let PollingInterval = document.getElementById("pollinginterval").value;
    let AvgInterval = document.getElementById("avginterval").value;
    let UnitID = document.getElementById("unit").value;
    let CoefA = document.getElementById("coefa").value;
    let CoefB = document.getElementById("coefb").value;
    let CreatedBy = currentUser.id;
    let ModifiedBy = currentUser.id;
    let status = Status ? 1 : 0;
    let Frequency = document.getElementById("frequency").value;
    let Frequency1 = document.getElementById("frequency1").value;
    //let finalFrequency=Frequency==""?"":Frequency1==""?Frequency+"-"+"M":Frequency+"-"+Frequency1;
    let finalFrequency =
      Frequency == "" ? "" : Frequency1 == "M" ? Frequency : Frequency * 60;
    let RegisterIndex = document.getElementById("registerindex").value;
    let ParseFunction = document.getElementById("parsefunciton").value;
    let SendCommand = document.getElementById("sendcommand").value;
    let HighHigh = document.getElementById("highhighlimit").value;
    let High = document.getElementById("highlimit").value;
    let LowLow = document.getElementById("lowlowlimit").value;
    let Low = document.getElementById("lowlimit").value;
    let Threshold = document.getElementById("thresholdlimit").value;
    let enableParametersAlarms = EnableParametersAlarms ? true : false;
    let ParseParmvalue = ParseParamValue ? true : false;
    let isDerived = IsDerived ? 1 : 0;

    let validation = parameteraddvalidation(
      StationID,
      DeviceID,
      DriverID,
      ParameterName,
      PollingInterval,
      AvgInterval,
      UnitID,
      ScaleFactor,
      CoefA,
      CoefB
    );
    if (!validation) {
      return false;
    }
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + "api/ParametersAdd", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: authHeader.Authorization,
        "app-origin": authHeader["app-origin"],
      },
      body: JSON.stringify({
        StationID: StationID,
        DeviceID: DeviceID,
        DriverID: DriverID,
        ParameterName: ParameterName,
        PollingInterval: PollingInterval,
        AvgInterval: AvgInterval,
        CoefA: CoefA,
        CoefB: CoefB,
        UnitID: UnitID,
        ScaleFactor: ScaleFactor,
        Status: status,
        CreatedBy: CreatedBy,
        ModifiedBy: ModifiedBy,
        RegisterIndex: RegisterIndex,
        ParseParamValue: ParseParmvalue,
        ParseFunction: ParseFunction,
        SendCommand: SendCommand,
        IsDerived: isDerived,
        HighHigh: HighHigh,
        High: High,
        LowLow: LowLow,
        Low: Low,
        Threshold: Threshold,
        EnableParametersAlarms: enableParametersAlarms,
        DataSyncFrequency: finalFrequency,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == "Parameteradd") {
          toast.success("Parameter added successfully");
          Getparameters();
          setparameterList(true);
        } else if (responseJson == "Parameterexist") {
          toast.error(
            "Parameter already exist with given parameter Name. Please try with another parameter Name."
          );
        } else {
          toast.error(
            "Unable to add the parameter. Please contact adminstrator"
          );
        }
      })
      .catch((error) =>
        toast.error("Unable to add the parameter. Please contact adminstrator")
      );
  };

  const Editparameter = function (param) {
    setparameterList(false);
    setparameterId(param.id);
    setStatus(param.status == 1 ? true : false);
    setIsDerived(param.isDerived == 1 ? true : false);
    setEnableParametersAlarms(param.enableParametersAlarms);
    setTimeout(() => {
      document.getElementById("stationname").value = param.stationID;
      document.getElementById("devicename").value = param.deviceID;
      Deviceschange();
      console.log(param);
      //document.getElementById("drivername").value = param.driverID;

      setTimeout(function () {
        document.getElementById("parametername").value = param.parameterName;
        setValue((prevDisplay) => ({
          ...prevDisplay,
          ["parameternameid"]: param.parameterName,
        }));
        document.getElementById("pollinginterval").value =
          param.pollingInterval;
        setValue((prevDisplay) => ({
          ...prevDisplay,
          ["pollingintervalid"]: param.pollingInterval,
        }));
        document.getElementById("avginterval").value = param.avgInterval;
        setValue((prevDisplay) => ({
          ...prevDisplay,
          ["averageintervalid"]: param.avgInterval,
        }));
        document.getElementById("unit").value = param.unitID;
        document.getElementById("scalefactor").value = param.scaleFactor;
        setValue((prevDisplay) => ({
          ...prevDisplay,
          ["scalefactorid"]: param.scaleFactor,
        }));
        document.getElementById("coefa").value = param.coefA;
        setValue((prevDisplay) => ({
          ...prevDisplay,
          ["coefaid"]: param.coefA,
        }));
        document.getElementById("coefb").value = param.coefB;
        setValue((prevDisplay) => ({
          ...prevDisplay,
          ["coefbid"]: param.coefB,
        }));
        //  let Frequency=param.frequency !=null?param.frequency.split("-"):"";
        // document.getElementById("frequency").value = Frequency==""?"":Frequency[0];
        // document.getElementById("frequency1").value = Frequency==""?"M":Frequency[1];
        if (param.dataSyncFrequency != null && param.dataSyncFrequency >= 60) {
          document.getElementById("frequency").value =
            param.dataSyncFrequency / 60;
          setValue((prevDisplay) => ({
            ...prevDisplay,
            ["frequencyid"]: param.dataSyncFrequency / 60,
          }));
          document.getElementById("frequency1").value = "H";
        } else if (
          param.dataSyncFrequency != null &&
          param.dataSyncFrequency < 60
        ) {
          document.getElementById("frequency").value = param.dataSyncFrequency;
          setValue((prevDisplay) => ({
            ...prevDisplay,
            ["frequencyid"]: param.dataSyncFrequency,
          }));
          document.getElementById("frequency1").value = "M";
        } else if (param.dataSyncFrequency == null) {
          document.getElementById("frequency").value = param.dataSyncFrequency;
          setValue((prevDisplay) => ({
            ...prevDisplay,
            ["frequencyid"]: param.dataSyncFrequency,
          }));
          document.getElementById("frequency1").value = "M";
        }
        document.getElementById("registerindex").value = param.registerIndex;
        setValue((prevDisplay) => ({
          ...prevDisplay,
          ["registerindexid"]: param.registerIndex,
        }));
        document.getElementById("parsefunciton").value = param.parseFunction;
        setValue((prevDisplay) => ({
          ...prevDisplay,
          ["parsefuncitonid"]: param.parseFunction,
        }));
        document.getElementById("sendcommand").value = param.sendCommand;
        setValue((prevDisplay) => ({
          ...prevDisplay,
          ["sendcommandid"]: param.sendCommand,
        }));
        document.getElementById("highhighlimit").value = param.highHigh;
        setValue((prevDisplay) => ({
          ...prevDisplay,
          ["highhighlimitid"]: param.highHigh,
        }));
        document.getElementById("highlimit").value = param.high;
        setValue((prevDisplay) => ({
          ...prevDisplay,
          ["highlimitid"]: param.high,
        }));
        document.getElementById("lowlowlimit").value = param.lowLow;
        setValue((prevDisplay) => ({
          ...prevDisplay,
          ["lowlowlimitid"]: param.lowLow,
        }));
        document.getElementById("lowlimit").value = param.low;
        setValue((prevDisplay) => ({
          ...prevDisplay,
          ["lowlimitid"]: param.low,
        }));
        document.getElementById("thresholdlimit").value = param.threshold;
        setValue((prevDisplay) => ({
          ...prevDisplay,
          ["thresholdlimitid"]: param.threshold,
        }));
        document.getElementById("drivername").value = param.driverID;
      }, 100);
    }, 10);
  };

  const Updateparameter = async function () {
    let StationID = document.getElementById("stationname").value;
    let DeviceID = document.getElementById("devicename").value;
    let DriverID = document.getElementById("drivername").value;
    let ScaleFactor = document.getElementById("scalefactor").value;
    let ParameterName = document.getElementById("parametername").value;
    let PollingInterval = document.getElementById("pollinginterval").value;
    let AvgInterval = document.getElementById("avginterval").value;
    let UnitID = document.getElementById("unit").value;
    let CoefA = document.getElementById("coefa").value;
    let CoefB = document.getElementById("coefb").value;
    let CreatedBy = currentUser.id;
    let ModifiedBy = currentUser.id;
    let status = Status ? 1 : 0;
    let Frequency = document.getElementById("frequency").value;
    let Frequency1 = document.getElementById("frequency1").value;
    // let finalFrequency=Frequency==""?"":Frequency1==""?Frequency+"-"+"M":Frequency+"-"+Frequency1;
    let finalFrequency =
      Frequency == "" ? "" : Frequency1 == "M" ? Frequency : Frequency * 60;
    let RegisterIndex = document.getElementById("registerindex").value;
    let ParseFunction = document.getElementById("parsefunciton").value;
    let SendCommand = document.getElementById("sendcommand").value;
    let HighHigh = document.getElementById("highhighlimit").value;
    let High = document.getElementById("highlimit").value;
    let LowLow = document.getElementById("lowlowlimit").value;
    let Low = document.getElementById("lowlimit").value;
    let Threshold = document.getElementById("thresholdlimit").value;
    let enableParametersAlarms = EnableParametersAlarms ? true : false;
    let ParseParmvalue = ParseParamValue ? true : false;
    let isDerived = IsDerived ? 1 : 0;

    let validation = parameteraddvalidation(
      StationID,
      DeviceID,
      DriverID,
      ParameterName,
      PollingInterval,
      AvgInterval,
      UnitID,
      CoefA,
      CoefB
    );
    if (!validation) {
      return false;
    }
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(
      CommonFunctions.getWebApiUrl() + "api/ParametersUpdate/" + parameterId,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: authHeader.Authorization,
          "app-origin": authHeader["app-origin"],
        },
        body: JSON.stringify({
          StationID: StationID,
          DeviceID: DeviceID,
          DriverID: DriverID,
          ParameterName: ParameterName,
          PollingInterval: PollingInterval,
          AvgInterval: AvgInterval,
          CoefA: CoefA,
          CoefB: CoefB,
          UnitID: UnitID,
          ID: parameterId,
          ScaleFactor: ScaleFactor,
          Status: status,
          CreatedBy: CreatedBy,
          ModifiedBy: ModifiedBy,
          RegisterIndex: RegisterIndex,
          ParseParamValue: ParseParmvalue,
          ParseFunction: ParseFunction,
          SendCommand: SendCommand,
          IsDerived: isDerived,
          HighHigh: HighHigh,
          High: High,
          LowLow: LowLow,
          Low: Low,
          Threshold: Threshold,
          EnableParametersAlarms: enableParametersAlarms,
          DataSyncFrequency: finalFrequency,
        }),
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == 1) {
          toast.success("Parameter updated successfully");
          Getparameters();
          setparameterList(true);
        } else if (responseJson == 2) {
          toast.error(
            "Parameter already exist with given parameter Name. Please try with another parameter Name."
          );
        } else {
          toast.error(
            "Unable to update the parameter. Please contact adminstrator"
          );
        }
      })
      .catch((error) =>
        toast.error(
          "Unable to update the parameter. Please contact adminstrator"
        )
      );
  };

  const Deleteparameter = function (item) {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this parameter !",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5cb85c",
      confirmButtonText: "Yes",
      closeOnConfirm: false,
    }).then(async function (isConfirm) {
      if (isConfirm.isConfirmed) {
        let id = item.id;
        let authHeader = await CommonFunctions.getAuthHeader();
        await fetch(
          CommonFunctions.getWebApiUrl() + "api/ParametersDelete/" + id,
          {
            method: "DELETE",
            headers: authHeader,
          }
        )
          .then((response) => response.json())
          .then((responseJson) => {
            if (responseJson == 1) {
              toast.success("Parameter deleted successfully");
              Getparameters();
            } else {
              toast.error(
                "Unable to delete parameter. Please contact adminstrator"
              );
            }
          })
          .catch((error) =>
            toast.error(
              "Unable to delete parameter. Please contact adminstrator"
            )
          );
      }
    });
  };

  const Getparameters = async function () {
    document.getElementById("loader").style.display = "block";
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + "api/ParametersList", {
      method: "GET",
      headers: authHeader,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setListparameters(data);
        }
      })
      .catch((error) =>
        toast.error(
          "Unable to get the parameters list. Please contact adminstrator"
        )
      )
      .finally(() => {
        setgridLoad(true);
        document.getElementById("loader").style.display = "none";
      });
  };

  const GetparametersLookup = async function () {
    document.getElementById("loader").style.display = "block";
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(
      CommonFunctions.getWebApiUrl() + "api/Parameters/ParameterLookup",
      {
        method: "GET",
        headers: authHeader,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setListDevices(data.listDevices);
          setListStations(data.listStations);
          setListparameters(data.listParameters);
          setListReportedUnits(data.listReportedunits);
          setListDrivers(data.listDrivers);
        }
      })
      .catch((error) =>
        toast.error(
          "Unable to get the parameters list. Please contact adminstrator"
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
    GetparametersLookup();
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
        data: Listparameters,
        loadData: function (filter) {
          console.log(filter);
          $(".jsgrid-filter-row input:text")
            .addClass("form-control")
            .addClass("form-control-sm");
          $(".jsgrid-filter-row select")
            .addClass("custom-select")
            .addClass("custom-select-sm");
          return $.grep(this.data, function (item) {
            // console.log(item);
            return (
              (!filter.stationID || item.stationID === filter.stationID) &&
              (!filter.deviceID || item.deviceID === filter.deviceID) &&
              (!filter.unitID || item.unitID === filter.unitID) &&
              (!filter.driverID || item.driverID === filter.driverID) &&
              (!filter.parameterName ||
                item.parameterName
                  .toUpperCase()
                  .indexOf(filter.parameterName.toUpperCase()) >= 0) &&
              // (!filter.unit ||
              //   item.unit.toUpperCase().indexOf(filter.unit.toUpperCase()) >=
              //     0) &&
              (!filter.pollingInterval ||
                item.pollingInterval
                  .toUpperCase()
                  .indexOf(filter.pollingInterval.toUpperCase()) >= 0) &&
              (!filter.avgInterval ||
                item.avgInterval
                  .toUpperCase()
                  .indexOf(filter.avgInterval.toUpperCase()) >= 0)
            );
          });
        },
      },
      fields: [
        {
          name: "stationID",
          title: "Station Name",
          type: "select",
          align: "left",
          items: ListStations,
          valueField: "id",
          textField: "stationName",
          width: 200,
          sorting: false,
          filtering: false,
        },
        {
          name: "deviceID",
          title: "Device Name",
          type: "select",
          align: "left",
          items: ListDevices,
          valueField: "id",
          textField: "deviceName",
          width: 200,
        },
        {
          name: "driverID",
          title: "Driver Name",
          type: "select",
          align: "left",
          items: ListDrivers,
          valueField: "id",
          textField: "driverName",
          width: 200,
        },
        {
          name: "parameterName",
          title: "Parameter Name",
          align: "left",
          type: "text",
        },
        {
          name: "unitID",
          title: "Units",
          align: "left",
          type: "select",
          items: ListReportedUnits,
          valueField: "id",
          textField: "unitName",
          width: 100,
        },
        { name: "pollingInterval", title: "Polling Interval", type: "text" },
        { name: "avgInterval", title: "Average Interval", type: "text" },
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
                Editparameter(item);
                /* alert("ID: " + item.id); */
                e.stopPropagation();
              });

            var $customDeleteButton = $("<button>")
              .attr({
                class:
                  "customGridDeletebutton jsgrid-button jsgrid-delete-button",
              })
              .click(function (e) {
                Deleteparameter(item);
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
  const Addparameterchange = function (param) {
    if (param) {
      setparameterList(true);
    } else {
      setparameterList(false);
      setparameterId(0);
      setListdeviceDrivers([]);
      resetState();
    }
    setIsDerived(false);
    setStatus(true);
    setParseParamValue(true);
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

  const Deviceschange = function () {
    setListdeviceDrivers([]);
    let DeviceID = document.getElementById("devicename").value;
    let finaldevices = ListDevices.filter((val) => val.id == DeviceID);
    let finaldrivers = ListDrivers.filter(
      (val) => val.deviceModelID == finaldevices[0].deviceModel
    );
    setListdeviceDrivers(finaldrivers);
  };

  const DriverChange = (event, index) => {
    let DeviceModel = ListdeviceDrivers[index - 1];
    //setTimeout(() => {
    let registerindex = document.getElementById("registerindex");
    let parsefunciton = document.getElementById("parsefunciton");
    let sendcommand = document.getElementById("sendcommand");
    if (registerindex != null) {
      registerindex.value = DeviceModel.registerIndex;
    }
    if (parsefunciton != null) {
      parsefunciton.value = DeviceModel.parseFunction;
    }
    if (sendcommand != null) {
      sendcommand.value = DeviceModel.sendCommand;
    }
    // }, 10);
  };

  const DownloadExcel = async function (filetype) {
    {
      /*edited*/
    }

    let params = new URLSearchParams({ filetype: filetype });
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(
      CommonFunctions.getWebApiUrl() +
        "api/AirQuality/ParameterListExportToExcel?" +
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
        <div className="pagetitle">
          {!parameterList && parameterId == 0 && <h1>Add parameter</h1>}
          {!parameterList && parameterId != 0 && <h1>Update parameter</h1>}
          {parameterList && <h1>Parameters List</h1>}
        </div>
        <section className="section">
          <div className="container">
            <div className="me-2 mb-2 float-end">
              {parameterList && (
                <span
                  className="operation_class mx-2"
                  onClick={() => Addparameterchange()}
                >
                  <i className="bi bi-plus-circle-fill"></i> <span>Add</span>
                </span>
              )}
              {!parameterList && (
                <span
                  className="operation_class mx-2"
                  onClick={() => Addparameterchange("gridlist")}
                >
                  <i className="bi bi-card-list"></i> <span>List</span>
                </span>
              )}
            </div>
            {!parameterList && (
              <form id="AddParametersform" className="row" noValidate>
                <div className="col-md-12 mb-3">
                  <label for="StationName" className="form-label">
                    Station Name:
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
                  <div class="invalid-feedback">Please select station name</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="devicename" className="form-label">
                    Device Name:
                  </label>
                  <select
                    className="form-select"
                    id="devicename"
                    onChange={Deviceschange}
                    required
                  >
                    <option selected value="">
                      Select device name
                    </option>
                    {ListDevices.map((x, y) => (
                      <option value={x.id} key={y}>
                        {x.deviceName}
                      </option>
                    ))}
                  </select>
                  <div class="invalid-feedback">Please select device name</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="devicename" className="form-label">
                    Driver Name:
                  </label>
                  <select
                    className="form-select"
                    id="drivername"
                    onChange={(e) => DriverChange(e, e.target.selectedIndex)}
                    required
                  >
                    <option selected value="">
                      Select driver name
                    </option>
                    {ListdeviceDrivers.map((x, y) => (
                      <option value={x.id} key={y}>
                        {x.driverName}
                      </option>
                    ))}
                  </select>
                  <div class="invalid-feedback">Please select driver name</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="parametername" className="form-label">
                    Parameter Name:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="parametername"
                    placeholder="Enter parameter name"
                    value={value.parameternameid}
                    onChange={(e) =>
                      handleTextBox(e.target.value, 50, "parameternameid")
                    }
                    required
                  />
                  <div
                    id="parameternameid"
                    style={{ display: display.parameternameid }}
                    className="invalid-feedback"
                  >
                    Character limit exceeded! Maximum 50 characters are allowed.
                  </div>
                  <div class="invalid-feedback">
                    Please enter parameter name
                  </div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="units" className="form-label">
                    Units:
                  </label>
                  <select className="form-select" id="unit" required>
                    <option selected value="" title="Select Units">
                      Select unit
                    </option>
                    {ListReportedUnits.map((x, y) => (
                      <option value={x.id} key={y}>
                        {x.unitName}
                      </option>
                    ))}
                  </select>
                  <div class="invalid-feedback">Please select units</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="scalefactor" className="form-label">
                    Scale Factor:
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="scalefactor"
                    placeholder="Enter scale factor"
                    value={value.scalefactorid}
                    onChange={(e) =>
                      handleTextBox(e.target.value, 9, "scalefactorid")
                    }
                    required
                  />
                  <div
                    id="scalefactorid"
                    style={{ display: display.scalefactorid }}
                    className="invalid-feedback"
                  >
                    Character limit exceeded! Maximum 9 characters are allowed.
                  </div>
                  <div class="invalid-feedback">Please enter scale factor</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="coefa" className="form-label">
                    COEF A:
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="coefa"
                    placeholder="Enter COEF A"
                    defaultValue="1"
                    value={value.coefaid}
                    onChange={(e) =>
                      handleTextBox(e.target.value, 9, "coefaid")
                    }
                    required
                  />
                  <div
                    id="coefaid"
                    style={{ display: display.coefaid }}
                    className="invalid-feedback"
                  >
                    Character limit exceeded! Maximum 9 characters are allowed.
                  </div>
                  <div class="invalid-feedback">Please enter COEF A</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="coefb" className="form-label">
                    COEF B:
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="coefb"
                    placeholder="Enter COEF B"
                    defaultValue="0"
                    value={value.coefbid}
                    onChange={(e) =>
                      handleTextBox(e.target.value, 9, "coefbid")
                    }
                    required
                  />
                  <div
                    id="coefbid"
                    style={{ display: display.coefbid }}
                    className="invalid-feedback"
                  >
                    Character limit exceeded! Maximum 9 characters are allowed.
                  </div>
                  <div class="invalid-feedback">Please enter COEF B</div>
                </div>
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-md-8 mb-3">
                      <label for="frequency" className="form-label">
                        Frequency:
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="frequency"
                        placeholder="Enter Frequency"
                        value={value.frequencyid}
                        onChange={(e) =>
                          handleTextBox(e.target.value, 7, "frequencyid")
                        }
                        required
                      />
                      <div
                        id="frequencyid"
                        style={{ display: display.frequencyid }}
                        className="invalid-feedback"
                      >
                        Character limit exceeded! Maximum 7 characters are
                        allowed.
                      </div>
                      <div class="invalid-feedback">Please enter Frequency</div>
                    </div>
                    <div className="col-md-4 Frequency1 mb-3">
                      <select className="form-select" id="frequency1">
                        <option value="M">Minutes</option>
                        <option value="H">Hours</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="pollinginterval" className="form-label">
                    Polling Interval:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="pollinginterval"
                    placeholder="Enter polling interval"
                    value={value.pollingintervalid}
                    onChange={(e) =>
                      handleTextBox(e.target.value, 10, "pollingintervalid")
                    }
                    required
                  />
                  <div
                    id="pollingintervalid"
                    style={{ display: display.pollingintervalid }}
                    className="invalid-feedback"
                  >
                    Character limit exceeded! Maximum 10 characters are allowed.
                  </div>
                  <div class="invalid-feedback">
                    Please enter polling interval
                  </div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="avginterval" className="form-label">
                    Average Interval:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="avginterval"
                    placeholder="Enter average interval"
                    value={value.averageintervalid}
                    onChange={(e) =>
                      handleTextBox(e.target.value, 50, "averageintervalid")
                    }
                    required
                  />
                  <div
                    id="averageintervalid"
                    style={{ display: display.averageintervalid }}
                    className="invalid-feedback"
                  >
                    Character limit exceeded! Maximum 50 characters are allowed.
                  </div>
                  <div class="invalid-feedback">
                    Please enter average interval
                  </div>
                </div>

                <div className="col-md-12 mb-3">
                  <label for="registerindex" className="form-label">
                    Register Index:
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="registerindex"
                    placeholder="Enter Register Index"
                    value={value.registerindexid}
                    onChange={(e) =>
                      handleTextBox(e.target.value, 9, "registerindexid")
                    }
                  />
                  <div
                    id="registerindexid"
                    style={{ display: display.registerindexid }}
                    className="invalid-feedback"
                  >
                    Character limit exceeded! Maximum 9 characters are allowed.
                  </div>
                  <div class="invalid-feedback">
                    Please enter average interval
                  </div>
                </div>

                <div className="col-md-12 mb-3">
                  <label for="parsefunciton" className="form-label">
                    Parse Function:
                  </label>
                  <textarea
                    class="form-control"
                    id="parsefunciton"
                    placeholder="Enter Parse Function"
                    rows="3"
                    value={value.parsefuncitonid}
                    onChange={(e) =>
                      handleTextBox(e.target.value, 1000, "parsefuncitonid")
                    }
                  ></textarea>
                  <div
                    id="parsefuncitonid"
                    style={{ display: display.parsefuncitonid }}
                    className="invalid-feedback"
                  >
                    Character limit exceeded! Maximum 1000 characters are
                    allowed.
                  </div>
                  <div class="invalid-feedback">
                    Please enter parse function
                  </div>
                </div>

                <div className="col-md-12 mb-3">
                  <label for="sendcommand" className="form-label">
                    Send Command:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="sendcommand"
                    placeholder="Enter send command"
                    value={value.sendcommandid}
                    onChange={(e) =>
                      handleTextBox(e.target.value, 150, "sendcommandid")
                    }
                  />
                  <div
                    id="sendcommandid"
                    style={{ display: display.sendcommandid }}
                    className="invalid-feedback"
                  >
                    Character limit exceeded! Maximum 150 characters are
                    allowed.
                  </div>
                  <div class="invalid-feedback">Please enter send command</div>
                </div>
                <div className="col-md-6 mb-3">
                  <label for="sendcommand" className="form-label">
                    High High Limit:
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="highhighlimit"
                    placeholder="high high limit"
                    value={value.highhighlimitid}
                    onChange={(e) =>
                      handleTextBox(e.target.value, 9, "highhighlimitid")
                    }
                  />
                  <div
                    id="highhighlimitid"
                    style={{ display: display.highhighlimitid }}
                    className="invalid-feedback"
                  >
                    Character limit exceeded! Maximum 9 characters are allowed.
                  </div>
                  <div class="invalid-feedback">
                    Please enter High High Limit
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label for="sendcommand" className="form-label">
                    High Limit:
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="highlimit"
                    placeholder="high limit"
                    value={value.highlimitid}
                    onChange={(e) =>
                      handleTextBox(e.target.value, 9, "highlimitid")
                    }
                  />
                  <div
                    id="highlimitid"
                    style={{ display: display.highlimitid }}
                    className="invalid-feedback"
                  >
                    Character limit exceeded! Maximum 9 characters are allowed.
                  </div>
                  <div class="invalid-feedback">Please enter High Limit</div>
                </div>
                <div className="col-md-6 mb-3">
                  <label for="sendcommand" className="form-label">
                    Low Low Limit:
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="lowlowlimit"
                    placeholder="Enter low low limit"
                    value={value.lowlowlimitid}
                    onChange={(e) =>
                      handleTextBox(e.target.value, 9, "lowlowlimitid")
                    }
                  />
                  <div
                    id="lowlowlimitid"
                    style={{ display: display.lowlowlimitid }}
                    className="invalid-feedback"
                  >
                    Character limit exceeded! Maximum 9 characters are allowed.
                  </div>
                  <div class="invalid-feedback">
                    Please enter Low Low Limit:
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label for="sendcommand" className="form-label">
                    Low Limit:
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="lowlimit"
                    placeholder="Enter low limit"
                    value={value.lowlimitid}
                    onChange={(e) =>
                      handleTextBox(e.target.value, 9, "lowlimitid")
                    }
                  />
                  <div
                    id="lowlimitid"
                    style={{ display: display.lowlimitid }}
                    className="invalid-feedback"
                  >
                    Character limit exceeded! Maximum 9 characters are allowed.
                  </div>
                  <div class="invalid-feedback">Please enter Low Limit:</div>
                </div>
                <div className="col-md-6 mb-3">
                  <label for="sendcommand" className="form-label">
                    Threshold Limit:
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="thresholdlimit"
                    placeholder="Enter threshold limit"
                    value={value.thresholdlimitid}
                    onChange={(e) =>
                      handleTextBox(e.target.value, 9, "thresholdlimitid")
                    }
                  />
                  <div
                    id="thresholdlimitid"
                    style={{ display: display.thresholdlimitid }}
                    className="invalid-feedback"
                  >
                    Character limit exceeded! Maximum 9 characters are allowed.
                  </div>
                  <div class="invalid-feedback">
                    Please enter Threshold Limit
                  </div>
                </div>
                <div className="col-md-6 mt-4 mb-3">
                  <div className="form-check mt-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="enableparametersalarms"
                      onChange={(e) =>
                        setEnableParametersAlarms(e.target.checked)
                      }
                      defaultChecked={EnableParametersAlarms}
                    />
                    <label
                      className="form-check-label form-label"
                      for="isderived"
                    >
                      EnableParametersAlarms
                    </label>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <label for="parseparamvalue" className="form-label">
                    Parse Param Value:{" "}
                  </label>
                  <div className="form-check d-inline-block form-switch ms-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="parseparamvalue"
                      onChange={(e) => setParseParamValue(e.target.checked)}
                      defaultChecked={ParseParamValue}
                    />
                    {ParseParamValue && (
                      <label
                        className="form-check-label"
                        for="flexSwitchCheckChecked"
                      >
                        Enable
                      </label>
                    )}
                    {!ParseParamValue && (
                      <label
                        className="form-check-label"
                        for="flexSwitchCheckChecked"
                      >
                        Disable
                      </label>
                    )}
                  </div>
                </div>

                <div className="col-md-4 mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isderived"
                      onChange={(e) => setIsDerived(e.target.checked)}
                      defaultChecked={IsDerived}
                    />
                    <label
                      className="form-check-label form-label"
                      for="isderived"
                    >
                      IsDerived
                    </label>
                  </div>
                </div>

                <div className="col-md-4 mb-3">
                  <label for="Status" className="form-label">
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
                        for="flexSwitchCheckChecked"
                      >
                        Active
                      </label>
                    )}
                    {!Status && (
                      <label
                        className="form-check-label"
                        for="flexSwitchCheckChecked"
                      >
                        Inactive
                      </label>
                    )}
                  </div>
                </div>
                <div className="col-md-12 text-center">
                  {!parameterList && parameterId == 0 && (
                    <button
                      className="btn btn-primary"
                      onClick={parameteradd}
                      type="button"
                    >
                      Add Parameter
                    </button>
                  )}
                  {!parameterList && parameterId != 0 && (
                    <button
                      className="btn btn-primary"
                      onClick={Updateparameter}
                      type="button"
                    >
                      Update Parameter
                    </button>
                  )}
                </div>
              </form>
            )}
            {parameterList && (
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
        {parameterList && Listparameters.length > 0 && (
          <div align="center">
            <button
              type="button"
              className="btn btn-primary datashow me-0"
              onClick={() => DownloadExcel("excel")}
            >
              Download Excel
            </button>
            &nbsp; {/*edited*/}
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
export default AddParameter;
