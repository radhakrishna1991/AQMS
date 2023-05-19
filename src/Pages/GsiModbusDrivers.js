import React, { useCallback, useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";
function GsiModbusDrivers() {
  const InstrumentgridRef = useRef();
  const DigitalgridRef = useRef();
  const DriverEntrygridRef = useRef();
  const $ = window.jQuery;
  const [Instrumentgridlist, setInstrumentgridlist] = useState(true);
  const [InstrumentId, setInstrumentId] = useState(0);
  const [InstrumentsList, setInstrumentsList] = useState([]);
  const [InstrumenttAddbtn, setInstrumenttAddbtn] = useState(true);

  const [Digitalgridlist, setDigitalgridlist] = useState(true);
  const [DigitalId, setDigitalId] = useState(0);
  const [DigitalList, setDigitalList] = useState([]);
  const [Type, setType] = useState();
  const [DigitalAddbtn, setDigitalAddbtn] = useState(true);
  const [OutputDivValues, setOutputDivValues]=useState(true);

  const [DriverEntrygridlist, setDriverEntrygridlist] = useState(true);
  const [DriverEntryId, setDriverEntryId] = useState(0);
  const [DriverEntryList, setDriverEntryList] = useState([]);
  const [DriverEntryAddbtn, setDriverEntryAddbtn] = useState(true);

  let cuser = process.env.REACT_APP_CurrentUser1;
  
  const AddDriverEntrychange = (param) => {
    if (param == 'driverentrylist') {
      setDriverEntrygridlist(true);
    } else {
      setDriverEntrygridlist(false);
      setDriverEntryAddbtn(true)
    }
  }
  const DriverEntryValidations = (DriverEntryName, DriverInstrID,EntryType) => {
    let isvalid = true;
    let form = document.querySelectorAll('#GSIDriverEntryform')[0];
    if (DriverEntryName == "" || DriverEntryName == null) {
      // //toast.error('Please enter Driver Entry Name');      
      form.classList.add('was-validated');
      isvalid = false;
    } else if (DriverInstrID == "" || DriverInstrID == null) {
      //toast.error('Please select instrument');
      form.classList.add('was-validated');
      isvalid = false;
    }else if (EntryType == "" || EntryType == null) {
      //toast.error('Please enter coil number');
      form.classList.add('was-validated');
      isvalid = false;
    }
    return isvalid;
  }
  const AddDriverEntry = (event) => {
    let DriverEntryName = document.getElementById("driverentryname").value;
    let DriverInstrumentID = document.getElementById("associatedinstument").value;
    let ModbusRegister = document.getElementById("modbusregister").value;
    let DataValueFormat = document.getElementById("datavalueformat").value;
    let DataFieldType = document.getElementById("datafieldtype").value;
    let AutoSendString = document.getElementById("autosendstring").value;
    let SendName = document.getElementById("sendname").value;
    let AutosendRepeatInterval = document.getElementById("autosendRepeatintervalString").value + document.getElementById("autosendRepeatinterval").value;
    let ParseName = document.getElementById("parsename").value;
    let ParseSyncString = document.getElementById("parsestring").value;
    let NumCharsToData = document.getElementById("numcharstodata").value;
    let DateFieldWidth = document.getElementById("datafieldwidth").value;
    let NumParseCharsinString = document.getElementById("numcharsinstring").value;
    let DelimiterChars = document.getElementById("delimiterchars").value;
    let NumDelimiData = document.getElementById("NumDelimiterData").value;
    let NumDelimiString = document.getElementById("numdelimitersinstring").value;
    let PrimaryDriver = document.getElementById("primarydriver").value;
    let InputIndex = document.getElementById("inputindex").value;
    let CreatedBy = document.getElementById("driverentryname").value;
    let ModifiedBy = document.getElementById("driverentryname").value;
    
    let isvalid = DriverEntryValidations(DriverEntryName, DriverInstrumentID,DataFieldType);
    if (!isvalid) {
       return false;
    }
    fetch(process.env.REACT_APP_WSurl + 'api/DriverEntry', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      //body: JSON.stringify({ DriverInstrID: DriverInstrumentID, DriverEntryName: DriverEntryName,DataFieldType:DataFieldType}),
      body: JSON.stringify({ GsiDriverInstrID: DriverInstrumentID, GsiDriverEntryName: DriverEntryName,DataFieldType:DataFieldType,EntryType: DataFieldType,DataValueFormat: DataValueFormat,ModbusRegister: ModbusRegister,SendName: SendName, AutosendString: AutoSendString, AutosendRepeatInterval: AutosendRepeatInterval,ParseName: ParseName, ParseSyncString: ParseSyncString,NumberOfCharsToData: NumCharsToData, DelimiterChars: DelimiterChars,DataFieldWidth: DateFieldWidth,NumberParseCharsInString:NumParseCharsinString, NumberOfDelimitersToData: NumDelimiData, NumberOfDelimitersInString: NumDelimiString, PrimaryDriverEntryID: PrimaryDriver,InputIndex: InputIndex, DigitalIOString: "", Units:""}),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == "DriverEntryadd") {
          GetDriverEntry();
          setDriverEntrygridlist(true);
          setDriverEntryAddbtn(true);
          toast.success('Driver Entry added successfully');
        } else if (responseJson == "DriverEntryexist") {
          toast.error('Driver Entry already exists with given name. Please try with another driver digital name');
        } else {
          toast.error('Unable to add Driver Entry. Please contact adminstrator');
        }
      })
  }

  const UpdateDriverEntry = (event) => {

    let DriverEntryName = document.getElementById("driverentryname").value;
    let DriverInstrumentID = document.getElementById("associatedinstument").value;
    let ModbusRegister = document.getElementById("modbusregister").value;
    let DataValueFormat = document.getElementById("datavalueformat").value;
    let DataFieldType = document.getElementById("datafieldtype").value;
    let AutoSendString = document.getElementById("autosendstring").value;
    let SendName = document.getElementById("sendname").value;
    let AutosendRepeatInterval = document.getElementById("autosendRepeatintervalString").value + document.getElementById("autosendRepeatinterval").value;
    let ParseName = document.getElementById("parsename").value;
    let ParseSyncString = document.getElementById("parsestring").value;
    let NumCharsToData = document.getElementById("numcharstodata").value;
    let DateFieldWidth = document.getElementById("datafieldwidth").value;
    let NumParseCharsinString = document.getElementById("numcharsinstring").value;
    let DelimiterChars = document.getElementById("delimiterchars").value;
    let NumDelimiData = document.getElementById("NumDelimiterData").value;
    let NumDelimiString = document.getElementById("numdelimitersinstring").value;
    let PrimaryDriver = document.getElementById("primarydriver").value;
    let InputIndex = document.getElementById("inputindex").value;
    let CreatedBy = document.getElementById("driverentryname").value;
    let ModifiedBy = document.getElementById("driverentryname").value;

    let isvalid = DriverEntryValidations(DriverEntryName, DriverInstrumentID,DataFieldType);
    if (!isvalid) {
      return false;
    }
    fetch(process.env.REACT_APP_WSurl + 'api/DriverEntry/' + DriverEntryId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ GsiDriverInstrID: DriverInstrumentID, GsiDriverEntryName: DriverEntryName,DataFieldType:DataFieldType,EntryType: DataFieldType,DataValueFormat: DataValueFormat,ModbusRegister: ModbusRegister,SendName: SendName, AutosendString: AutoSendString, AutosendRepeatInterval: AutosendRepeatInterval,ParseName: ParseName, ParseSyncString: ParseSyncString,NumberOfCharsToData: NumCharsToData, DelimiterChars: DelimiterChars,DataFieldWidth: DateFieldWidth,NumberParseCharsInString:NumParseCharsinString, NumberOfDelimitersToData: NumDelimiData, NumberOfDelimitersInString: NumDelimiString, PrimaryDriverEntryID: PrimaryDriver,InputIndex: InputIndex, DigitalIOString: "", Units:""}) })
      .then((responseJson) => {
        if (responseJson == 1) {
          GetDriverEntry();
          setDriverEntryList(true);
          setDriverEntryAddbtn(true);
          toast.success('Driver Entry updated successfully');
        } else if (responseJson == 2) {
          toast.error('Driver Entry already exists with given name. Please try with another driver entry name');
        } else {
          toast.error('Unable to update driver entry');
        };
      })
  }

  const EditDriverEntry = (param) => {
    setDriverEntrygridlist(false);
    setDriverEntryId(param.id);
    setDriverEntryAddbtn(false);
    setTimeout(() => {

    document.getElementById("driverentryname").value = param.gsiDriverEntryName;
    document.getElementById("associatedinstument").value= param.gsiDriverInstrID;
    document.getElementById("modbusregister").value = param.modbusRegister;
    document.getElementById("datavalueformat").value= param.dataValueFormat;
    document.getElementById("datafieldtype").value = param.dataFieldType;
    document.getElementById("autosendRepeatintervalString").value = param.autosendRepeatInterval.substring(0,1);
    document.getElementById("autosendRepeatinterval").value = param.autosendRepeatInterval.substring(1,param.autosendRepeatInterval.length);
    document.getElementById("sendname").value = param.sendName;
    document.getElementById("autosendstring").value = param.autosendString;
    document.getElementById("parsename").value = param.parseName;
    document.getElementById("parsestring").value = param.parseSyncString;
    document.getElementById("numcharstodata").value = param.numberOfCharsToData;
    document.getElementById("datafieldwidth").value = param.dataFieldWidth;
    document.getElementById("numcharsinstring").value = param.numberParseCharsInString;
    document.getElementById("delimiterchars").value = param.delimiterChars;
    document.getElementById("NumDelimiterData").value = param.numberOfDelimitersToData;
    document.getElementById("numdelimitersinstring").value = param.numberOfDelimitersInString;
    document.getElementById("primarydriver").value = param.primaryDriverEntryID;
    document.getElementById("inputindex").value = param.inputIndex;

    }, 10);
  }

  const DeleteDriverEntry = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: ("You want to delete this driver entry !"),
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5cb85c",
      confirmButtonText: "Yes",
      closeOnConfirm: false
    })
      .then(function (isConfirm) {
        if (isConfirm.isConfirmed) {
          let id = item.id;
          fetch(process.env.REACT_APP_WSurl + 'api/DriverEntry/' + id, {
            method: 'DELETE'
          }).then((response) => response.json())
            .then((responseJson) => {
              if (responseJson == 1) {
                toast.success('Driver entry deleted successfully')
                GetDriverEntry();
              } else {
                toast.error('Unable to delete driver entry. Please contact adminstrator');
              }
            }).catch((error) => toast.error('Unable to delete driver entry. Please contact adminstrator'));
        }
      });
  }
  const GetDriverEntry = function () {
    fetch(process.env.REACT_APP_WSurl + "api/DriverEntry", {
      method: 'GET',
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          setDriverEntryList(data);
        }
      }).catch((error) => toast.error('Unable to get the driver entry list. Please contact adminstrator'));
  }



  const AddDriverDigitalchange = (param) => {
    if (param == 'driverdigitallist') {
      setDigitalgridlist(true);
    } else {
      setDigitalgridlist(false);
      setDigitalAddbtn(true)
    }
  }
  const DriverDegitalValidations = (DriverDigitalEntryName, DriverInstrumentID,CoilNumber) => {
    let isvalid = true;
    let form = document.querySelectorAll('#GSIDigitalform')[0];
    if (DriverDigitalEntryName == "" || DriverDigitalEntryName == null) {
      // //toast.error('Please enter Driver Entry Name');      
      form.classList.add('was-validated');
      isvalid = false;
    } else if (DriverInstrumentID == "" || DriverInstrumentID == null) {
      //toast.error('Please select instrument');
      form.classList.add('was-validated');
      isvalid = false;
    }else if (CoilNumber == "" || CoilNumber == null) {
      //toast.error('Please enter coil number');
      form.classList.add('was-validated');
      isvalid = false;
    }
    return isvalid;
  }
  const AddDriverDigital = (event) => {
    let DriverDigitalEntryName = document.getElementById("digitaldriverentryname").value;
    let DriverInstrumentID = document.getElementById("associatedinstrument").value;
    let CoilNumber = document.getElementById("coilnumber").value;
    let InputType = document.getElementById("inputradio").checked;
    let OutputType = document.getElementById("outputradio").checked;
    let DiscreteInput = document.getElementById("discreteinput").checked;
    let RegisterOutput = document.getElementById("registeroutput").checked;
    let RegisterValueClosed = document.getElementById("closedvalue").value;
    let RegisterValueOpen = document.getElementById("openvalue").value;
    let CreatedBy = document.getElementById("digitaldriverentryname").value;
    let ModifiedBy = document.getElementById("digitaldriverentryname").value;
    
    let isvalid = DriverDegitalValidations(DriverDigitalEntryName, DriverInstrumentID,CoilNumber);
    if (!isvalid) {
       return false;
    }
    fetch(process.env.REACT_APP_WSurl + 'api/DriverDigital', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ DriverInstrumentID: DriverInstrumentID, DriverDigitalEntryName: DriverDigitalEntryName,  CoilNumber: CoilNumber, InputType: InputType, OutputType: OutputType, DiscreteInput: DiscreteInput, RegisterOutput: RegisterOutput, RegisterValueClosed: RegisterValueClosed, RegisterValueOpen: RegisterValueOpen}),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == "Driverdigitaladd") {
          GetDriverDigital();
          setInstrumentgridlist(true);
          setInstrumenttAddbtn(true);
          toast.success('Driver digital added successfully');
        } else if (responseJson == "Driverdigitalexist") {
          toast.error('Driver digital already exists with given name. Please try with another driver digital name');
        } else {
          toast.error('Unable to add Driver digital. Please contact adminstrator');
        }
      })
  }

  const UpdateDriverDigital = (event) => {
    let DriverDigitalEntryName = document.getElementById("digitaldriverentryname").value;
    let DriverInstrumentID = document.getElementById("associatedinstrument").value;
    let CoilNumber = document.getElementById("coilnumber").value;
    let InputType = document.getElementById("inputradio").checked;
    let OutputType = document.getElementById("outputradio").checked;
    let DiscreteInput = document.getElementById("discreteinput").checked;
    let RegisterOutput = document.getElementById("registeroutput").checked;
    let RegisterValueClosed = document.getElementById("closedvalue").value;
    let RegisterValueOpen = document.getElementById("openvalue").value;
    let CreatedBy = document.getElementById("digitaldriverentryname").value;
    let ModifiedBy = document.getElementById("digitaldriverentryname").value;
    let isvalid = DriverDegitalValidations(DriverDigitalEntryName, DriverInstrumentID,CoilNumber);
    if (!isvalid) {
      return false;
    }
    fetch(process.env.REACT_APP_WSurl + 'api/DriverDigital/' + DigitalId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ DriverInstrumentID: DriverInstrumentID, DriverDigitalEntryName: DriverDigitalEntryName,  CoilNumber: CoilNumber, InputType: InputType, OutputType: OutputType, DiscreteInput: DiscreteInput, RegisterOutput: RegisterOutput, RegisterValueClosed: RegisterValueClosed, RegisterValueOpen: RegisterValueOpen})  }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == 1) {
          GetDriverDigital();
          setDigitalgridlist(true);
          setDigitalAddbtn(true);
          toast.success('Driver digital updated successfully');
        } else if (responseJson == 2) {
          toast.error('Driver digital already exists with given name. Please try with another driver digital name');
        } else {
          toast.error('Unable to update driver digital');
        };
      })
  }

  const EditDriverDigital = (param) => {
    setDigitalgridlist(false);
    setDigitalId(param.id);
    setDigitalAddbtn(false);
    setTimeout(() => {
      document.getElementById("digitaldriverentryname").value = param.driverDigitalEntryName;;
      document.getElementById("associatedinstrument").value = param.driverInstrumentID;
      document.getElementById("coilnumber").value = param.coilNumber;
      document.getElementById("closedvalue").value = param.registerValueClosed;
      document.getElementById("openvalue").value = param.registerValueOpen;
      document.getElementById("inputradio").checked = param.inputType;
      document.getElementById("outputradio").checked = param.outputType;
      document.getElementById("registeroutput").checked = param.registerOutput;
      document.getElementById("discreteinput").checked = param.discreteInput;
    }, 10);
  }

  const DeleteDriverDigital = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: ("You want to delete this driver digital !"),
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5cb85c",
      confirmButtonText: "Yes",
      closeOnConfirm: false
    })
      .then(function (isConfirm) {
        if (isConfirm.isConfirmed) {
          let id = item.id;
          fetch(process.env.REACT_APP_WSurl + 'api/DriverDigital/' + id, {
            method: 'DELETE'
          }).then((response) => response.json())
            .then((responseJson) => {
              if (responseJson == 1) {
                toast.success('Driver digital deleted successfully')
                GetDriverDigital();
              } else {
                toast.error('Unable to delete driver digital. Please contact adminstrator');
              }
            }).catch((error) => toast.error('Unable to delete driver digital. Please contact adminstrator'));
        }
      });
  }
  const GetDriverDigital = function () {
    fetch(process.env.REACT_APP_WSurl + "api/DriverDigital", {
      method: 'GET',
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          setDigitalList(data);
          //setInstrumentsList(data);
        }
      }).catch((error) => toast.error('Unable to get the driver digital list. Please contact adminstrator'));
  }

  const AddInstrumentchange = (param) => {
    if (param == 'instrumentlist') {
      setInstrumentgridlist(true);
    } else {
      setInstrumentgridlist(false);
      setInstrumenttAddbtn(true)
    }
  }
  const InstrumentValidations = (InstrumentName, DefaultModbusTcpIpPort) => {
    let isvalid = true;
    let form = document.querySelectorAll('#GSIInstrumentform')[0];
    if (InstrumentName == "" || InstrumentName == null) {
      //toast.error('Please enter instrument name');
      form.classList.add('was-validated');
      isvalid = false;
    } else if (DefaultModbusTcpIpPort == "" || DefaultModbusTcpIpPort == null) {
      //toast.error('Please enter TcpIp Port');
      form.classList.add('was-validated');
      isvalid = false;
    }
    return isvalid;
  }
  const AddInstrument = (event) => {
    let InstrumentName = document.getElementById("instrumentname").value;
    let DefaultModbusTcpIpPort = document.getElementById("tcpipport").value;
    let DefaultModbusCode = document.getElementById("modbuscode").value;
    let DefaultModbusCommandType = document.getElementById("modbuscommandtype").value;
    let DefaultTimeoutMs = document.getElementById("timeout").value;
    let SupportsForceMultipleCoils = document.getElementById("multiplecoils").checked;
    let CreatedBy = document.getElementById("instrumentname").value;
    let ModifiedBy = document.getElementById("instrumentname").value;
    let isvalid = InstrumentValidations(InstrumentName, DefaultModbusTcpIpPort);
    if (!isvalid) {
      return false;
    }
    fetch(process.env.REACT_APP_WSurl + 'api/Instrument', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ InstrumentName: InstrumentName, DefaultModbusTcpIpPort: DefaultModbusTcpIpPort, DefaultModbusCode: DefaultModbusCode, DefaultModbusCommandType: DefaultModbusCommandType, DefaultTimeoutMs: DefaultTimeoutMs, SupportsForceMultipleCoils: SupportsForceMultipleCoils }),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == "Instrumentadd") {
          GetInstruments();
          setInstrumentgridlist(true);
          setInstrumenttAddbtn(true);
          toast.success('Instrument added successfully');
        } else if (responseJson == "Instrumentexist") {
          toast.error('Instrument already exists with given name. Please try with another instrument name');
        } else {
          toast.error('Unable to add Instrument. Please contact adminstrator');
        }
      })
  }

  const UpdateInstrument = (event) => {
    let InstrumentName = document.getElementById("instrumentname").value;
    let DefaultModbusTcpIpPort = document.getElementById("tcpipport").value;
    let DefaultModbusCode = document.getElementById("modbuscode").value;
    let DefaultModbusCommandType = document.getElementById("modbuscommandtype").value;
    let DefaultTimeoutMs = document.getElementById("timeout").value;
    let SupportsForceMultipleCoils = document.getElementById("multiplecoils").checked;
    let CreatedBy = document.getElementById("instrumentname").value;
    let ModifiedBy = document.getElementById("instrumentname").value;
    let isvalid = InstrumentValidations(InstrumentName, DefaultModbusTcpIpPort);
    if (!isvalid) {
      return false;
    }
    fetch(process.env.REACT_APP_WSurl + 'api/Instrument/' + InstrumentId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ InstrumentName: InstrumentName, DefaultModbusTcpIpPort: DefaultModbusTcpIpPort, DefaultModbusCode: DefaultModbusCode, DefaultModbusCommandType: DefaultModbusCommandType, DefaultTimeoutMs: DefaultTimeoutMs, SupportsForceMultipleCoils: SupportsForceMultipleCoils }),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == 1) {
          GetInstruments();
          setInstrumentgridlist(true);
          setInstrumenttAddbtn(true);
          toast.success('Instrument updated successfully');
        } else if (responseJson == 2) {
          toast.error('Instrument already exists with given name. Please try with another instrument name');
        } else {
          toast.error('Unable to update instrument');
        };
      })
  }

  const EditInstrument = (param) => {
    setInstrumentgridlist(false);
    setInstrumentId(param.id);
    setInstrumenttAddbtn(false);
    setTimeout(() => {
      document.getElementById("instrumentname").value = param.instrumentName;;
      document.getElementById("tcpipport").value = param.defaultModbusTcpIpPort;
      document.getElementById("modbuscode").value = param.defaultModbusCode;
      document.getElementById("modbuscommandtype").value = param.defaultModbusCommandType;
      document.getElementById("timeout").value = param.defaultTimeoutMs;
      document.getElementById("multiplecoils").checked = param.supportsForceMultipleCoils;
    }, 10);
  }

  const DeleteInstrument = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: ("You want to delete this Instrument !"),
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5cb85c",
      confirmButtonText: "Yes",
      closeOnConfirm: false
    })
      .then(function (isConfirm) {
        if (isConfirm.isConfirmed) {
          let id = item.id;
          fetch(process.env.REACT_APP_WSurl + 'api/Instrument/' + id, {
            method: 'DELETE'
          }).then((response) => response.json())
            .then((responseJson) => {
              if (responseJson == 1) {
                toast.success('Instrument deleted successfully')
                GetInstruments();
              } else {
                toast.error('Unable to delete instrument. Please contact adminstrator');
              }
            }).catch((error) => toast.error('Unable to delete instrument. Please contact adminstrator'));
        }
      });
  }
  const GetInstruments = function () {
    fetch(process.env.REACT_APP_WSurl + "api/Instrument", {
      method: 'GET',
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          setInstrumentsList(data);
        }
      }).catch((error) => toast.error('Unable to get the instruments list. Please contact adminstrator'));
  }
  const initializeInstrumentJsGrid = function () {
    window.jQuery(InstrumentgridRef.current).jsGrid({
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
        data: InstrumentsList,
        loadData: function (filter) {
          $(".jsgrid-filter-row input:text").addClass("form-control").addClass("form-control-sm");
          $(".jsgrid-filter-row select").addClass("custom-select").addClass("custom-select-sm");
          return $.grep(this.data, function (item) {
            return ((!filter.id || item.id.toUpperCase().indexOf(filter.id.toUpperCase()) >= 0)
              && (!filter.instrumentName || item.instrumentName.toUpperCase().indexOf(filter.instrumentName.toUpperCase()) >= 0)
            );
          });
        }
      },
      fields: [
        { name: "id", title: "Instrument ID", type: "text" },
        { name: "instrumentName", title: "Instrument Name", type: "text" },
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

  const initializeDigitalJsGrid = function () {
    window.jQuery(DigitalgridRef.current).jsGrid({
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
        data: DigitalList,
        loadData: function (filter) {
          $(".jsgrid-filter-row input:text").addClass("form-control").addClass("form-control-sm");
          $(".jsgrid-filter-row select").addClass("custom-select").addClass("custom-select-sm");
          return $.grep(this.data, function (item) {
            return ((!filter.id || item.id.toUpperCase().indexOf(filter.id.toUpperCase()) >= 0)
              && (!filter.driverDigitalEntryName || item.driverDigitalEntryName.toUpperCase().indexOf(filter.driverDigitalEntryName.toUpperCase()) >= 0)
              && (!filter.DriverInstrumentID || item.DriverInstrumentID.toUpperCase().indexOf(filter.DriverInstrumentID.toUpperCase()) >= 0)
            );
          });
        }
      },
      fields: [
        { name: "id", title: "Driver ID", type: "text" },
        { name: "driverDigitalEntryName", title: "Digital Driver Name", type: "text" },
        { name: "DriverInstrumentID", title: "Driver Instrument ID", type: "text" },
        {
          type: "control", width: 100, editButton: false, deleteButton: false,
          itemTemplate: function (value, item) {
            // var $result = gridRefjsgrid.current.fields.control.prototype.itemTemplate.apply(this, arguments);

            var $customEditButton = $("<button>").attr({ class: "customGridEditbutton jsgrid-button jsgrid-edit-button" })
              .click(function (e) {
                EditDriverDigital(item);
                /* alert("ID: " + item.id); */
                e.stopPropagation();
              });

            var $customDeleteButton = $("<button>").attr({ class: "customGridDeletebutton jsgrid-button jsgrid-delete-button" })
              .click(function (e) {
                DeleteDriverDigital(item);
                e.stopPropagation();
              });

            return $("<div>").append($customEditButton).append($customDeleteButton);
            //return $result.add($customButton);
          }
        },
      ]
    });
  }
  const initializeDriverEntryJsGrid = function () {
    window.jQuery(DriverEntrygridRef.current).jsGrid({
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
        data: DriverEntryList,
        loadData: function (filter) {
          $(".jsgrid-filter-row input:text").addClass("form-control").addClass("form-control-sm");
          $(".jsgrid-filter-row select").addClass("custom-select").addClass("custom-select-sm");
          return $.grep(this.data, function (item) {
            return ((!filter.id || item.id.toUpperCase().indexOf(filter.id.toUpperCase()) >= 0)
              && (!filter.gsiDriverEntryName || item.gsiDriverEntryName.toUpperCase().indexOf(filter.gsiDriverEntryName.toUpperCase()) >= 0)
              && (!filter.gsiDriverInstrID || item.gsiDriverInstrID.toUpperCase().indexOf(filter.gsiDriverInstrID.toUpperCase()) >= 0)
            );
          });
        }
      },
      fields: [
        { name: "id", title: "Driver ID", type: "text" },
        { name: "gsiDriverEntryName", title: "Driver Name", type: "text" },
        { name: "gsiDriverInstrID", title: "Driver Instrument ID", type: "text" },
        {
          type: "control", width: 100, editButton: false, deleteButton: false,
          itemTemplate: function (value, item) {
            // var $result = gridRefjsgrid.current.fields.control.prototype.itemTemplate.apply(this, arguments);

            var $customEditButton = $("<button>").attr({ class: "customGridEditbutton jsgrid-button jsgrid-edit-button" })
              .click(function (e) {
                EditDriverEntry(item);
                /* alert("ID: " + item.id); */
                e.stopPropagation();
              });

            var $customDeleteButton = $("<button>").attr({ class: "customGridDeletebutton jsgrid-button jsgrid-delete-button" })
              .click(function (e) {
                DeleteDriverEntry(item);
                e.stopPropagation();
              });

            return $("<div>").append($customEditButton).append($customDeleteButton);
            //return $result.add($customButton);
          }
        },
      ]
    });
  }
  const inputchange=function(){    
    setOutputDivValues(true);
  }
  const Outputchange=function(){
    setOutputDivValues(false);
  }
  
  useEffect(() => {
    initializeInstrumentJsGrid();
    initializeDigitalJsGrid();
    initializeDriverEntryJsGrid();
  });
  useEffect(() => {
    GetInstruments();
    GetDriverDigital();
    GetDriverEntry();
  }, [])
  return (
    <main id="main" className="main" >
      {/* Same as */}
      <section className="section grid_section h100 w100">
        <div className="h100 w100">
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="general-tab" data-bs-toggle="tab" data-bs-target="#general-tab-pane" type="button" role="tab" aria-controls="general-tab-pane" aria-selected="true"> GSI Driver Entry</button>
            </li>
            {/*  <li className="nav-item" role="presentation">
              <button className="nav-link" id="advanced-tab" data-bs-toggle="tab" data-bs-target="#advanced-tab-pane" type="button" role="tab" aria-controls="advanced-tab-pane" aria-selected="false">Advanced</button>
            </li> */}
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="sites-tab" data-bs-toggle="tab" data-bs-target="#sites-tab-pane" type="button" role="tab" aria-controls="sites-tab-pane" aria-selected="false"> GSI Driver Digital</button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link active" id="parameters-tab" data-bs-toggle="tab" data-bs-target="#parameters-tab-pane" type="button" role="tab" aria-controls="parameters-tab-pane" aria-selected="false" > GSI Driver Instrument</button>
            </li>
          </ul>
          
          <div className="tab-content" id="myTabContent">
            <div className="tab-pane fade" id="general-tab-pane" role="tabpanel" aria-labelledby="general-tab" tabIndex="0">
                <div className="me-2 mb-2 float-end">
                    {DriverEntrygridlist && (
                      <span className="operation_class mx-2" onClick={() => AddDriverEntrychange()}><i className="bi bi-plus-circle-fill"></i> <span>Add</span></span>
                    )}
                    {!DriverEntrygridlist && (
                      <span className="operation_class mx-2" onClick={() => AddDriverEntrychange('driverentrylist')}><i className="bi bi-card-list"></i> <span>List</span></span>
                    )}
                </div>
              {!DriverEntrygridlist && (
                <form id="GSIDriverEntryform" className="row w100 px-0 mx-0" noValidate>  
                   <div className="accordion px-0" id="accordionentry">
                       <div className="accordion-item">
                            <h2 className="accordion-header" id="entryOne">
                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#entrycollapseOne" aria-expanded="true" aria-controls="entrycollapseOne">
                                    Details
                                </button>
                            </h2>
                   <div id="entrycollapseOne" className="accordion-collapse collapse show" aria-labelledby="entryOne" data-bs-parent="#accordionentry">
                     <div className="accordion-body">
                       <div className="">
                         <div className="row">
                           <div className="col-md-6">
                             <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-4">Driver Entry Name:</label>
                              <div className="col-sm-8">
                                <input type="text" id="driverentryname" className="form-control" placeholder="Enter driver name" required />
                                <div class="invalid-feedback">Please enter driver name</div>
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-4">Data Field Type:</label>
                              <div className="col-sm-8">
                                <select id="datafieldtype" className="form-select" required>
                                  <option selected value="">Choose...</option>
                                  <option value="F"> F = Float(GSI and Modbus) </option>
                                  <option value="I"> I = Integer(GSI and Modbus) </option>
                                  <option value="B"> B = Bipolar Int(Modbus) </option>
                                  <option value="U"> U = Unipolar Int(Modbus) </option>
                                  <option value="P"> P = Pulse(Modbus) </option>
                                  <option value="S"> S = IEEE 754 Hex String(GSI) </option>
                                  <option value="R"> R = IEEE 754 Float Bytes(GSI)</option>
                                </select>
                                <div class="invalid-feedback">Please select data type</div>
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-4">Data Value Format:</label>
                              <div className="col-sm-8">
                                <select id="datavalueformat" className="form-select">
                                  <option selected value="">Choose...</option>
                                  <option value="F">F = IEEE754/Little Endian(Modbus) or Float(GSI)</option>
                                  <option value="W"> W = IEEE754/Big Endian(Modbus) </option>
                                  <option value="B"> B = Reverse Little Endian(Modbus) </option>
                                  <option value="2"> 2 = Reverse Big Endian(Modbus)</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-4">Associated Instrument:</label>
                              <div className="col-sm-8">
                                <select id="associatedinstument" className="form-select" required>
                                      <option selected value="">Please select instrument</option>
                                      {InstrumentsList.map((x, y) =>
                                        <option value={x.id} key={y} >{x.instrumentName}</option>
                                      )}
                                </select>
                                <div class="invalid-feedback">Please select instrument</div>
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="modbusregister" className="form-label col-sm-4">Modbus Register:</label>
                              <div className="col-sm-8">
                                <input type="number" id="modbusregister" className="form-control" placeholder="Enter modbus register" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="entryTwo">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#entrycollapseTwo" aria-expanded="true" aria-controls="entrycollapseTwo">
                      Auto Send
                    </button>
                  </h2>
                  <div id="entrycollapseTwo" className="accordion-collapse collapse" aria-labelledby="entryTwo" data-bs-parent="#accordionentry">
                    <div className="accordion-body">
                      <div className="">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-4">Send Name:</label>
                              <div className="col-sm-8">
                                <input type="text" id="sendname" className="form-control" placeholder="Enter send name" />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-4">Auto Send Repeat Interval:</label>
                              <div className="col-sm-3 px-0">
                                <input type="text" id="autosendRepeatintervalString" className="form-control" placeholder="Enter auto send interval" />
                              </div>
                              <div className="col-sm-5">
                                <select id="autosendRepeatinterval" className="form-select">
                                  <option selected value="">Choose...</option>
                                  <option value="S">Seconds</option>
                                  <option value="M">Minutes</option>
                                  <option value="H">Hours</option>
                                  <option value="D">Days</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <label htmlFor="inputAddress" className="form-label col-sm-2">Auto Send String:</label>
                          <div className="col-sm-10">
                            <input type="text" id="autosendstring" className="form-control" placeholder="Enter auto send string" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="entryThree">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#entrycollapseThree" aria-expanded="true" aria-controls="entrycollapseThree">
                      Parsing
                    </button>
                  </h2>
                  <div id="entrycollapseThree" className="accordion-collapse collapse" aria-labelledby="entryThree" data-bs-parent="#accordionentry">
                    <div className="accordion-body">
                      <div className="">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-3">Parse Name:</label>
                              <div className="col-sm-9">
                                <input type="text" id="parsename" className="form-control" placeholder="Enter parse name" />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-3">Parse String:</label>
                              <div className="col-sm-9">
                                <input type="text" id="parsestring" className="form-control" placeholder="Enter parse string" />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 mt-3">
                            <div className="parse_fixed">
                              <h6>Fixed</h6>
                              <div className="row">
                                <label htmlFor="inputAddress" className="form-label col-sm-4">Number of Chars to Data:</label>
                                <div className="col-sm-8">
                                  <input type="number" id="numcharstodata" className="form-control" placeholder="Enter number of chars to date" />
                                </div>
                              </div>
                              <div className="row">
                                <label htmlFor="inputAddress" className="form-label col-sm-4">Data Field Width:</label>
                                <div className="col-sm-8">
                                  <input type="number" id="datafieldwidth" className="form-control" placeholder="Enter date field width" />
                                </div>
                              </div>
                              <div className="row">
                                <label htmlFor="inputAddress" className="form-label col-sm-4">Number of Chars in String:</label>
                                <div className="col-sm-8">
                                  <input type="number" id="numcharsinstring" className="form-control" placeholder="Enter number of chars in string" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 mt-3">
                            <div className="parse_fixed">
                              <h6>Delimited</h6>
                              <div className="row">
                                <label htmlFor="inputAddress" className="form-label col-sm-4">Delimiter Chars:</label>
                                <div className="col-sm-8">
                                  <input type="text" id="delimiterchars" className="form-control" placeholder="Enter delimiter chars" />
                                </div>
                              </div>
                              <div className="row">
                                <label htmlFor="inputAddress" className="form-label col-sm-4">Number of Delimiters to Data:</label>
                                <div className="col-sm-8">
                                  <input type="number" id="NumDelimiterData" className="form-control" placeholder="Enter number of delimiters to date" />
                                </div>
                              </div>
                              <div className="row">
                                <label htmlFor="inputAddress" className="form-label col-sm-4">Number of Delimiters in String:</label>
                                <div className="col-sm-8">
                                  <input type="number" id="numdelimitersinstring" className="form-control" placeholder="Enter number of delimiters in string" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="entryFour">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#entrycollapseFour" aria-expanded="true" aria-controls="entrycollapseFour">
                      Advanced
                    </button>
                  </h2>
                  <div id="entrycollapseFour" className="accordion-collapse collapse" aria-labelledby="entryFour" data-bs-parent="#accordionentry">
                    <div className="accordion-body">
                      <div className="">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-4">Primary Driver:</label>
                              <div className="col-sm-8">
                                <select id="primarydriver" className="form-select">
                                  <option selected value="">Choose...</option>
                                  <option value="1">Driver-1</option>
                                  <option value="2">Driver-2</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="row">
                              <label htmlFor="inputindex" className="form-label col-sm-4">Input Index:</label>
                              <div className="col-sm-8">
                                <input type="number" id="inputindex" className="form-control" placeholder="Enter input index" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            
					<div class="col-12 text-center mt-2">
						{DriverEntryAddbtn && (
						  <button class="btn btn-primary" onClick={AddDriverEntry} type="button">Add Driver Entry</button>
						)}
						{!DriverEntryAddbtn && (
						  <button class="btn btn-primary" onClick={UpdateDriverEntry} type="button">Update Driver Entry</button>
						)}
					</div>
				</form>
				)}
				{DriverEntrygridlist && (
                <div>
                  <div className="jsGrid" ref={DriverEntrygridRef} />
                </div>
              )}
			</div>
            <div className="tab-pane fade" id="sites-tab-pane" role="tabpanel" aria-labelledby="sites-tab" tabIndex="0">
              <div className="me-2 mb-2 float-end">
                {Digitalgridlist && (
                  <span className="operation_class mx-2" onClick={() => AddDriverDigitalchange()}><i className="bi bi-plus-circle-fill"></i> <span>Add</span></span>
                )}
                {!Digitalgridlist && (
                  <span className="operation_class mx-2" onClick={() => AddDriverDigitalchange('driverdigitallist')}><i className="bi bi-card-list"></i> <span>List</span></span>
                )}
              </div>
              {!Digitalgridlist && (
                <form id="GSIDigitalform" className="row w100 px-0 mx-0" noValidate>
                  <div className="accordion px-0" id="accordioninstrumentdigital">
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="digitalheadingOne">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#digitalcollapseOne" aria-expanded="true" aria-controls="digitalcollapseOne">
                          GSI Driver Digital Details
                        </button>
                      </h2>
                      <div id="digitalcollapseOne" className="accordion-collapse collapse show" aria-labelledby="digitalheadingOne" data-bs-parent="#accordioninstrumentdigital">
                        <div className="accordion-body">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="row">
                                <label htmlFor="digitaldriverentryname" className="form-label col-sm-4">Driver Entry Name:</label>
                                <div className="col-sm-8">
                                  <input type="text" className="form-control" id="digitaldriverentryname" placeholder="Enter driver name" required />
                                  <div class="invalid-feedback">Please enter driver name</div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="row">
                                <label htmlFor="associatedinstrument" className="form-label col-sm-4">Associated Instrument:</label>
                                <div className="col-sm-8">
                                  <select className="form-select" id="associatedinstrument" required>
                                      <option selected value="">Select instrument</option>
                                      {InstrumentsList.map((x, y) =>
                                        <option value={x.id} key={y} >{x.instrumentName}</option>
                                      )}
                                  </select>
                                  <div class="invalid-feedback">Please select associated instrument</div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="row">
                                <label htmlFor="coilnumber" className="form-label col-sm-4">Coil Number:</label>
                                <div className="col-sm-8">
                                  <input type="number" className="form-control" id="coilnumber" placeholder="Enter coil number" required />
                                  <div class="invalid-feedback">Please enter coil number</div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="row">
                                <label htmlFor="modbuscommandtype" className="form-label col-sm-4">Input/Output Type:</label>
                                <div className="col-sm-8 mt-3">
                                  <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="inputRadioOptions" defaultChecked="true" id="inputradio" value="input" onChange={inputchange}/>
                                    <label className="form-check-label" htmlFor="inputradio">Input</label>
                                  </div>
                                  <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="inputRadioOptions" id="outputradio" value="output" onChange={Outputchange} />
                                    <label className="form-check-label" htmlFor="outputradio">Output</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 mt-3 InputOptionsDiv">
                              <div className={"parse_fixed " + (OutputDivValues?"":"disable")}>
                                <h6>Input Options</h6>
                                <div className="row">
                                  <div className="col-sm-12">
                                    <div class="form-check">
                                      <input class="form-check-input" type="checkbox" value="" id="discreteinput" />
                                      <label class="form-check-label" for="flexCheckDefault">
                                       Discrete Input(FC=02)
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 mt-3 OutputOptionsDiv">
                              <div className={"parse_fixed "+ (OutputDivValues?"disable":"")}>
                                <h6>Output Options</h6>
                                <div className="row">
                                  <div className="col-sm-12">
                                    <div class="form-check">
                                      <input class="form-check-input" type="checkbox" value="" id="registeroutput" />
                                      <label class="form-check-label" for="flexCheckDefault">
                                       Register Output(FC=06)
                                      </label>
                                    </div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-md-6">
                                  <div className="row">
                                  <label htmlFor="closedvalue" className="form-label col-sm-5">Closed Value:</label>
                                  <div className="col-sm-7">
                                    <input type="number" id="closedvalue" className="form-control" placeholder="Enter Closed Value"  />
                                  </div>
                                  </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="row">
                                  <label htmlFor="openvalue" className="form-label col-sm-5">Open Value:</label>
                                  <div className="col-sm-7">
                                    <input type="number" id="openvalue" className="form-control" placeholder="Enter Open Value"  />
                                  </div>
                                  </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="col-12 text-center mt-2">
                    {DigitalAddbtn && (
                      <button class="btn btn-primary" onClick={AddDriverDigital} type="button">Add Driver Digital</button>
                    )}
                    {!DigitalAddbtn && (
                      <button class="btn btn-primary" onClick={UpdateDriverDigital} type="button">Update Driver Digital</button>
                    )}
                  </div>
                </form>
              )}
              {Digitalgridlist && (
                <div>
                   <div className="jsGrid" ref={DigitalgridRef} />
                </div>

              )}
            </div>
            <div className="tab-pane fade show active" id="parameters-tab-pane" role="tabpanel" aria-labelledby="parameters-tab" tabIndex="0">
              <div className="me-2 mb-2 float-end">
                {Instrumentgridlist && (
                  <span className="operation_class mx-2" onClick={() => AddInstrumentchange()}><i className="bi bi-plus-circle-fill"></i> <span>Add</span></span>
                )}
                {!Instrumentgridlist && (
                  <span className="operation_class mx-2" onClick={() => AddInstrumentchange('instrumentlist')}><i className="bi bi-card-list"></i> <span>List</span></span>
                )}
              </div>
              {!Instrumentgridlist && (
                <form id="GSIInstrumentform" className="row w100 px-0 mx-0" noValidate>
                  <div className="accordion px-0" id="accordioninstrument">
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingOne">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                          GSI Instrument Details
                        </button>
                      </h2>
                      <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordioninstrument">
                        <div className="accordion-body">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="row">
                                <label htmlFor="instrumentname" className="form-label col-sm-4">Instrument Name:</label>
                                <div className="col-sm-8">
                                  <input type="text" className="form-control" id="instrumentname" placeholder="Enter instrument name" required />
                                  <div class="invalid-feedback">Please enter instrument name</div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="row">
                                <label htmlFor="tcpipport" className="form-label col-sm-4">Default Modbus TcpIp Port:</label>
                                <div className="col-sm-8">
                                  <input type="number" className="form-control" id="tcpipport" placeholder="Enter modbus TcpIp port" required/>
                                  <div class="invalid-feedback">Please enter modbus TcpIp port</div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="row">
                                <label htmlFor="modbuscode" className="form-label col-sm-4">Default Modbus Code:</label>
                                <div className="col-sm-8">
                                  <input type="text" className="form-control" id="modbuscode" maxLength="3" placeholder="Enter modbus code" />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="row">
                                <label htmlFor="modbuscommandtype" className="form-label col-sm-4">Default Modbus Command Type:</label>
                                <div className="col-sm-8">
                                  <input type="text" className="form-control" id="modbuscommandtype" maxLength="3" placeholder="Enter modbus type" />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="row">
                                <label htmlFor="modbuscommandtype" className="form-label col-sm-4">Default Timeout(ms):</label>
                                <div className="col-sm-8">
                                  <input type="number" className="form-control" id="timeout" placeholder="Enter timeout" />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="row">
                                <div className="col-sm-12">
                                  <div className="form-check mt-3">
                                    <label className="form-check-label" htmlFor="multiplecoils">
                                      Supports Force Multiple Coils
                                    </label>
                                    <input className="form-check-input" type="checkbox" id="multiplecoils" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-12 text-center mt-2">
                    {InstrumenttAddbtn && (
                      <button class="btn btn-primary" onClick={AddInstrument} type="button">Add Instrument</button>
                    )}
                    {!InstrumenttAddbtn && (
                      <button class="btn btn-primary" onClick={UpdateInstrument} type="button">Update Instrument</button>
                    )}
                  </div>
                </form>
              )}
              {Instrumentgridlist && (
                <div>
                  <div className="jsGrid" ref={InstrumentgridRef} />
                </div>
              )}
            </div>
          
</div>

        </div>
      </section>

    </main>
  );
}
export default GsiModbusDrivers;