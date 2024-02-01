import React, { useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import 'chartjs-adapter-moment';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import html2canvas from 'html2canvas';
import CommonFunctions from "../utils/CommonFunctions";
import jsPDF from 'jspdf';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

function Dashboard() {
  const $ = window.jQuery;
  const chartRef = useRef();
  const [ListAllData, setListAllData] = useState();
  const [Infodevices, setInfodevices] = useState([]);
  const [InfoParameters, setInfoParameters] = useState([]);
  const [Infoalarms, setInfoalarms] = useState([]);
  const [InfoParameteralarms, setInfoParameteralarms] = useState([]);
  const [Commands, setCommands] = useState([]);
  const [CalibrationsCommands, setCalibrationsCommands] = useState([]);
  const [LiveChartStatus, setLiveChartStatus] = useState([]);
  const [LiveCharticons, setLiveCharticons] = useState([]);
  const [ChartOptions, setChartOptions] = useState();
  const [currentdatetime, setcurrentdatetime] = useState(new Date().toLocaleString());
  const [ChartData, setChartData] = useState({ labels: [], datasets: [] });
  const currentUser = JSON.parse(sessionStorage.getItem('UserData'));
  const ListAllDataCopy = useRef();
  const [StartDatetime1, onChange1] = useState(new Date());
  const [StartDatetime2, onChange2] = useState(new Date());
  const [StartDatetime3, onChange3] = useState(new Date());
  const [StartDatetime4, onChange4] = useState(new Date());
  const [StartDatetime5, onChange5] = useState(new Date());
  const [CalibrationSequence, setCalibrationSequence] = useState([]);
  const [ListCalibration, setListCalibration] = useState([]);
  const [UserRole, setUserRole] = useState(true);
  const [IntervalCriteria, setIntervalCriteria] = useState([]);
  const [SelectedInterval, setSelectedInterval] = useState("1M");
  ListAllDataCopy.current = ListAllData;
  const colorArray = ["#96cdf5", "#fbaec1", "#00ff00", "#800000", "#808000", "#008000", "#008080", "#000080", "#FF00FF", "#800080",
  "#CD5C5C", "#FF5733", "#1ABC9C", "#F8C471", "#196F3D", "#707B7C", "#9A7D0A", "#B03A2E", "#F8C471", "#7E5109",
  "#b276b2", "#c6b2b2", "#8fb28f", "#ff6868", "#4d4dff",
  "#ff4dff", "#ffdb4d", "#4dff4d", "#4dffd1", "#ff964d",
  "#964d4d", "#965c96", "#dbdb4d", "#db964d", "#4ddbdb",
  "#964ddb", "#4d4ddb", "#db4ddb", "#809fff", "#ff809f",
  "#a380ff", "#ff807f", "#7f80ff", "#80a3ff", "#80ffb2",
  "#ffd180", "#4d4d4d", "#b2b2b2", "#ffd1db", "#ffdbd1"];
  let parameterChartStatus = [];
  const Minute = window.DashboardRefreshtime;

  useEffect(() => {
    async function fetchDataload() {
      let authHeader = await CommonFunctions.getAuthHeader();
    let Interval=SelectedInterval;
    let type = Interval.substr(Interval.length - 1);
   let Intervaltype;
   if (type == 'H') {
     Intervaltype = Interval.substr(0, Interval.length - 1) * 60;
   } else {
     Intervaltype = Interval.substr(0, Interval.length - 1);
   }
   await fetch(CommonFunctions.getWebApiUrl() + "api/Dashboard?Interval="+Intervaltype, {
      method: 'GET',
      headers: authHeader ,
        }).then((response) => response.json())
      .then((data) => {
        if (data) {
          setListAllData(data);
          var checkedcnt = 0;
          let finalinterval = [];
          for (var i = 0; i < data.listPollutents.length; i++) {
            let intervalarr = data.listPollutents[i].avgInterval.split(',');
                for (let j = 0; j < intervalarr.length; j++) {
                  let intervalsplitarr = intervalarr[j].split('-');
                  let index = finalinterval.findIndex(x => x.value === intervalsplitarr[0] && x.type === intervalsplitarr[1]);
                  if (index == -1) {
                    finalinterval.push({ value: intervalsplitarr[0], type: intervalsplitarr[1] })
                  }
                }
            //sessionStorage.setItem(data.listPollutents[i].id + "_ChartStatus", false);
            if (Cookies.get(data.listPollutents[i].id + "_ChartStatus") != 'false') {
              checkedcnt++;
              Cookies.set(data.listPollutents[i].id + "_ChartStatus", true, { expires: 7 });
              parameterChartStatus.push({ paramaterID: data.listPollutents[i].id, paramaterName: data.listPollutents[i].parameterName, ChartStatus: true })
            } else {
              parameterChartStatus.push({ paramaterID: data.listPollutents[i].id, paramaterName: data.listPollutents[i].parameterName, ChartStatus: false })
            }
          }
          setIntervalCriteria(finalinterval);
          // if(checkedcnt==data.listPollutents.length){
          //     var ele=document.getElementById("selectall");
          //     ele.checked=true;
          // }
          setLiveChartStatus(parameterChartStatus);
          GenerateChart(data);
          getUserRole();
        }
      }).catch((error) => toast.error('Unable to get the data. Please contact adminstrator'));
    }
    fetchDataload();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      GetLivedata();
    }, window.DashboardChartRefreshtime);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [])

  const GetLivedata=async function(){
     //  console.log('Logs every minute');
     let Intervalvalue=document.getElementById("criteriaid").value;
     let type = Intervalvalue.substr(Intervalvalue.length - 1);
    let Intervaltype;
    if (type == 'H') {
      Intervaltype = Intervalvalue.substr(0, Intervalvalue.length - 1) * 60;
    } else {
      Intervaltype = Intervalvalue.substr(0, Intervalvalue.length - 1);
    }
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + "api/Livedata?Interval="+Intervaltype, {
      method: 'GET',
      headers: authHeader ,
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          ListAllDataCopy.current.listParametervalues = data;
          GenerateChart(ListAllDataCopy.current);
        }
      }).catch((error) =>
        toast.error('Unable to get the data. Please contact adminstrator')
      );
  }

  async function fetchData() {
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + "api/LiveDashboard", {
    method: 'GET',
    headers: authHeader ,
  }).then((response) => response.json())
    .then((data) => {
      if (data) {
        ListAllDataCopy.current.listDevices = data.listDevices;
        ListAllDataCopy.current.listAlarms = data.listAlarms;
        ListAllDataCopy.current.listPollutents = data.listPollutents;
        ListAllDataCopy.current.rainLiveValue=data.rainLiveValue;
      }
    }).catch((error) =>
      toast.error('Unable to get the data. Please contact adminstrator')
    );
  }

  useEffect(() => {
    const interval = setInterval(() => {
      //console.log(CommonFunctions.getAuthHeader());
    
      fetchData();
    }, window.DashboardRefreshtime);
  
    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [])

  useEffect(() => {
    const interval1 = setInterval(() => {
      setcurrentdatetime(new Date().toLocaleString());
    }, window.Dashboarddatetime);

    return () => clearInterval(interval1); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [])

  const hexToRgbA = function (hex) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length == 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',0.5)';
    }
    throw new Error('Bad Hex');
  }

  const Deviceinfo = function (param) {
    setInfodevices(param);
    let parameters = ListAllData.listPollutents.filter(x => x.deviceID == param.id);
    setInfoParameters(parameters);
    $('#infomodal').modal('show');
  }
  const Devicealert = function (param) {
    setInfodevices(param);
    let parameters = ListAllData.listPollutents.filter(x => x.deviceID == param.id);
    let alarms = ListAllData.listAlarms.filter(x => x.deviceModelId == param.deviceModel);
    setInfoParameters(parameters);
    setInfoalarms(alarms);
    $('#alertmodal').modal('show');
  }
  const Devicealarm = function (param) {
    setInfodevices(param);
    let parameters = ListAllData.listPollutents.filter(x => x.deviceID == param.id);
    setInfoParameters(parameters);
    $('#alarmmodal').modal('show');
  }

  const DeviceGraphold = function (param, data) {
    setInfodevices(param);
    let parameters = ListAllData.listPollutents.filter(x => x.deviceID == param.id);
    setInfoParameters(parameters);
    for (var i = 0; i < LiveChartStatus.length; i++) {
      if (data.parameterName == LiveChartStatus[i].paramaterName && data.id == LiveChartStatus[i].paramaterID) {
        if (Cookies.get(data.id + "_ChartStatus") == 'true') {
          Cookies.set(data.id + "_ChartStatus", false, { expires: 7 });
          LiveChartStatus[i].ChartStatus = false;
          // GenerateChart(ListAllData.listPollutents,LiveChartStatus[i].paramaterID);
        }
        else {
          Cookies.set(data.id + "_ChartStatus", true, { expires: 7 });
          LiveChartStatus[i].ChartStatus = true;
        }
      }
    }
    GenerateChart(ListAllData);
  }
  const DeviceGraph = function (data) {
    let checkedCount = 0;
    for (var i = 0; i < LiveChartStatus.length; i++) {
      if (data.parameterName == LiveChartStatus[i].paramaterName && data.id == LiveChartStatus[i].paramaterID) {
        if (Cookies.get(data.id + "_ChartStatus") == 'true') {
          Cookies.set(data.id + "_ChartStatus", false, { expires: 7 });
          LiveChartStatus[i].ChartStatus = false;
          var ele = document.getElementById('selectall');
          ele.checked = false;
          // GenerateChart(ListAllData.listPollutents,LiveChartStatus[i].paramaterID);
        }
        else {
          Cookies.set(data.id + "_ChartStatus", true, { expires: 7 });
          LiveChartStatus[i].ChartStatus = true;
        }
      }
    }
    for (var k = 0; k < LiveChartStatus.length; k++) {
      if (Cookies.get(LiveChartStatus[k].paramaterID + "_ChartStatus") == 'true') {
        checkedCount++;
      }
    }
    if (checkedCount == LiveChartStatus.length) {
      var ele = document.getElementById('selectall');
      ele.checked = true;
    }
    GenerateChart(ListAllData);
  }
  const Codesinformation = function () {
    $('#alertcode').modal('show');
  }

  const Devicecalibration = async function (param) {
    let parameters = ListAllData.listPollutents.filter(x => x.deviceID == param.id);
    let listcommands = ListAllData.listCommands.filter(x => x.deviceModelId == param.deviceModel);
    let listcalibartioncommands = ListAllData.listCalibrationCommands;
    setInfoParameters(parameters);
    setCommands(listcommands);
    setCalibrationsCommands(listcalibartioncommands);
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + "api/Calibration?Deviceid=" + param.id, {
      method: 'GET',
      headers:authHeader
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          setCalibrationSequence(data);
          let listcalibration = data.filter(x => x.parameterId == parameters[0].id);
          $("#parameter").val(parameters[0].id);
          setListCalibration(listcalibration);
          $('#calibrationmodal').modal('show');
          $("#sequence1-tab").tab('show');
          Setformvalues(listcalibration);
        }
      }).catch((error) =>
        toast.error('Unable to get the data. Please contact adminstrator')
      );
  }

  const generateDatabaseDateTime = function (date) {

    return date.replace("T", " ").substring(0, 19);

  }

  const Intervalchange = function(e){
    let value=e.target.value;
    setSelectedInterval(value); 
    GetLivedata();
  }

  const GenerateChart = function (data) {
    /*  if (chartRef.current != null) {
       chartRef.current.data = {};
     } */
    let Parametervalues = data.listParametervalues;
    let pollutents = data.listPollutents;

    //setChartData({ labels: [], datasets: [] });
    setChartOptions();
    let datasets = [];
    let chartdata = [];
    let labels = [];


    for (let i = 0; i < pollutents.length; i++) {
      if (Cookies.get(pollutents[i].id + "_ChartStatus") == 'true') {
        chartdata = [];
        for (let k = 0; k < Parametervalues.length; k++) {
          if (Parametervalues[k].parameterID == pollutents[i].id) {
            let temp = generateDatabaseDateTime(Parametervalues[k].createdTime);
            // let index = labels.indexOf(temp);
            // if (index == -1) {
            //   labels.push(temp);
            // }
            chartdata.push({ x: temp, y: Parametervalues[k].parametervalue });
          }
        }
        datasets.push({ label: pollutents[i].parameterName, data: chartdata, borderColor: colorArray[i], backgroundColor: hexToRgbA(colorArray[i]) })
      }

    }
    setChartOptions({
      responsive: true,
      scales: {
        xAxes: {
          type: 'time',
          ticks: {
            font: {
              size: 11, // Adjust the font size for x-axis labels
              family: 'Roboto Light',// Change the font type for x-axis labels
              weight: 'bold',
              color: 'blue'
            }
          },
          time: {
            unit: 'second',
            displayFormats: {
              second: 'HH:mm:ss'
            },
            tooltipFormat: 'D MMM YYYY - HH:mm:ss'
          }
        },


      },
      // maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'top',
          align: 'center',
          fullSize: true,
          labels: {
            color: 'navy',
            boxWidth: 20,
            padding: 20,

            //boxHeight:20
            font: {
              size: 11,
              family: "Roboto Light",
              weight: 'bold'
            }
          },
        },

      },
    });
    setTimeout(() => {
      setChartData({
        //labels,
        datasets: datasets
      })
    }, 10);
  }
  const SequenceValidation = function (param) {
    let isvalid = true;
    let form1 = document.querySelectorAll('#Sequenceform' + param)[0];
    if (!form1.checkValidity()) {
      form1.classList.add('was-validated');
      isvalid = false;
    }
    return isvalid;
  }
  const SaveCalibrationSequence = async function () {
    let finaldata = [];
    for (let i = 1; i <= 5; i++) {
      let data = Getformvalues(i);

      if (parseInt(data.FallingTime) + parseInt(data.RisingTime) > parseInt(data.TotalTime)) {
        toast.error('Total Time should be less than or equal to the sum of Raising Time and Falling Time');
        return false;
      }

      let status = $("#enable" + i).is(':checked') ? 1 : 0;
      if (data == false) {
        return false;
      } else if (status == 1) {
        if (data.Command1 == "" && data.Command2 == "" && data.Command3 == "" && data.Command4 == "" && data.Command5 == "" && data.Command6 == "" && data.Command7 == "" && data.Command8 == "" && data.Command9 == "" && data.Command10 == "") {
          toast.error('Please select at least one command in sequence' + i);
          return false;
        }
      }
      finaldata.push(data);
    }
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + 'api/Calibration', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: authHeader.Authorization,
        'app-origin':authHeader["app-origin"]
      },
      body: JSON.stringify(finaldata),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == 1) {
          toast.success('Calibration sequence updated successfully');
          $('#calibrationmodal').modal('hide');
        } else {
          toast.error('Unable to add the Calibration sequence. Please contact adminstrator');
        }
      }).catch((error) => toast.error('Unable to add the Calibration sequence. Please contact adminstrator'));
  }

  const Parameterchange = function (e) {
    let listcalibration = CalibrationSequence.filter(x => x.parameterId == e.target.value);
    Setformvalues(listcalibration);
  }
  const Getformvalues = function (param) {
    let status = $("#enable" + param).is(':checked') ? 1 : 0;
    if (status == 1) {
      let isvalid = SequenceValidation(param);
      if (!isvalid) {
        var sequencetab = "sequence" + param + "-tab";
        $("#" + sequencetab).tab('show');
        return false;
      }
    }
    let form1 = document.querySelectorAll('#Sequenceform' + param)[0];
    form1.classList.remove('was-validated');
    let recid = $("#recid" + param).text();
    let parameter = $("#parameter").val();
    let profile = 1;
    let typeofsequence = $("#typeofsequence" + param).val();
    let totaltime = $("#totaltime" + param).val();
    let risingtime = $("#risingtime" + param).val();
    let fallingtime = $("#fallingtime" + param).val();
    let stabilizationtime = $("#stabilizationtime" + param).val();
    let highdrift = $("#highdrift" + param).val();
    let lowdrift = $("#lowdrift" + param).val();
    let signalvalue = $("#signalvalue" + param).val();
    let startdatetime = window.moment(StartDatetime1).format("YYYY-MM-DD HH:mm:ss");
    if (param == 2) {
      startdatetime = window.moment(StartDatetime2).format("YYYY-MM-DD HH:mm:ss");
    } else if (param == 3) {
      startdatetime = window.moment(StartDatetime3).format("YYYY-MM-DD HH:mm:ss");
    } else if (param == 4) {
      startdatetime = window.moment(StartDatetime4).format("YYYY-MM-DD HH:mm:ss");
    } else if (param == 5) {
      startdatetime = window.moment(StartDatetime4).format("YYYY-MM-DD HH:mm:ss");
    }
    let repeatedinterval = $("#repeatedinterval" + param).val();
    let repeatedintervaltype = $("#repeatedintervaltype" + param).val();
    let command1 = $("#command" + param + "1").val();
    let command2 = $("#command" + param + "2").val();
    let command3 = $("#command" + param + "3").val();
    let command4 = $("#command" + param + "4").val();
    let command5 = $("#command" + param + "5").val();
    let command6 = $("#command" + param + "6").val();
    let command7 = $("#command" + param + "7").val();
    let command8 = $("#command" + param + "8").val();
    let command9 = $("#command" + param + "9").val();
    let command10 = $("#command" + param + "0").val();

    let CommandsArray = [];
    for (let k = 0; k < 10; k++) {
      let command = k == 9 ? $("#command" + param + "0").val() : $("#command" + param + (k + 1)).val();
      if (command != "") {
        let commandsplit = command.split("_");
        let obj = {};
        obj.CalibrationID = recid;
        obj.Command = commandsplit[0];
        obj.Type = commandsplit[1];
        obj.CommandNumber = k + 1;
        obj.Status = 1;
        CommandsArray.push(obj);
      }
    }

    let CreatedBy = currentUser.id;
    let ModifiedBy = currentUser.id;
    let finalobject = {
      ParameterId: parameter, ProfileId: profile, SequenceNumber: param, RepeatedInterval: repeatedinterval, RepeatedIntervalType: repeatedintervaltype, StartTime: startdatetime, TypeofSequence: typeofsequence,
      TotalTime: totaltime, RisingTime: risingtime, FallingTime: fallingtime, StabilizationTime: stabilizationtime, HighDrift: highdrift, LowDrift: lowdrift, SignalValue: signalvalue,
      CreatedBy: CreatedBy, ModifiedBy: ModifiedBy, ID: recid, Status: status, listCalibrationCommandsSequence: CommandsArray
    }
    return finalobject;
  }

  const Setformvalues = function (list) {
    for (var k = 1; k <= 5; k++) {
      Clearformvalues(k);
    }
    for (let i = 0; i < list.length; i++) {
      let param = i + 1;
      let form1 = document.querySelectorAll('#Sequenceform' + param)[0];
      form1.classList.remove('was-validated');
      $("#recid" + param).text(list[i].id);
      $("#enable" + param).prop('checked', list[i].status == 1 ? true : false);
      $("#typeofsequence" + param).val(list[i].typeofSequence);
      $("#totaltime" + param).val(list[i].totalTime);
      $("#risingtime" + param).val(list[i].risingTime);
      $("#fallingtime" + param).val(list[i].fallingTime);
      $("#stabilizationtime" + param).val(list[i].stabilizationTime);
      $("#highdrift" + param).val(list[i].highDrift);
      $("#lowdrift" + param).val(list[i].lowDrift);
      $("#signalvalue" + param).val(list[i].signalValue);
      let starttime = list[i].startTime == null ? new Date() : list[i].startTime;
      if (param == 1) {
        onChange1(starttime);
      } else if (param == 2) {
        onChange2(starttime);
      } else if (param == 3) {
        onChange3(starttime);
      } else if (param == 4) {
        onChange4(starttime);
      } else if (param == 5) {
        onChange5(starttime);
      }
      $("#repeatedinterval" + param).val(list[i].repeatedInterval);
      $("#repeatedintervaltype" + param).val(list[i].repeatedIntervalType);

      let listcommands = list[i].listCalibrationCommandsSequence;

      for (var j = 0; j < listcommands.length; j++) {
        $("#command" + param + listcommands[j].commandNumber).val(listcommands[j].command + "_" + listcommands[j].type);
      }

      /*  $("#command" + param + "2").val(list[i].command2);
       $("#command" + param + "3").val(list[i].command3);
       $("#command" + param + "4").val(list[i].command4);
       $("#command" + param + "5").val(list[i].command5);
       $("#command" + param + "6").val(list[i].command6);
       $("#command" + param + "7").val(list[i].command7);
       $("#command" + param + "8").val(list[i].command8);
       $("#command" + param + "9").val(list[i].command9);
       $("#command" + param + "0").val(list[i].command10); */
    }
  }

  const Clearformvalues = function (param) {
    let form1 = document.querySelectorAll('#Sequenceform' + param)[0];
    form1.classList.remove('was-validated');
    $("#enable" + param).prop('checked', false);
    $("#typeofsequence" + param).val("");
    $("#totaltime" + param).val("");
    $("#risingtime" + param).val("");
    $("#fallingtime" + param).val("");
    $("#stabilizationtime" + param).val("");
    $("#highdrift" + param).val("");
    $("#lowdrift" + param).val("");
    $("#signalvalue" + param).val("");
    //  let startdatetime = window.moment(StartDatetime).format("YYYY-MM-DD HH:mm:ss");
    let starttime = new Date();
    if (param == 1) {
      onChange1(starttime);
    } else if (param == 2) {
      onChange2(starttime);
    } else if (param == 3) {
      onChange3(starttime);
    } else if (param == 4) {
      onChange4(starttime);
    } else if (param == 5) {
      onChange5(starttime);
    }
    $("#repeatedinterval" + param).val("");
    $("#repeatedintervaltype" + param).val("M");
    $("#command" + param + "1").val("");
    $("#command" + param + "2").val("");
    $("#command" + param + "3").val("");
    $("#command" + param + "4").val("");
    $("#command" + param + "5").val("");
    $("#command" + param + "6").val("");
    $("#command" + param + "7").val("");
    $("#command" + param + "8").val("");
    $("#command" + param + "9").val("");
    $("#command" + param + "0").val("");
  }

  const selects = function (data) {
    var ele = document.getElementById('selectall');
    if (ele.checked == true) {
      for (var i = 0; i < LiveChartStatus.length; i++) {
        Cookies.set(LiveChartStatus[i].paramaterID + "_ChartStatus", true, { expires: 7 });
        LiveChartStatus[i].ChartStatus = true;
        var checkallvalues = document.getElementById(LiveChartStatus[i].paramaterID);
        checkallvalues.checked = true;
      }
    }
    else {
      for (var i = 0; i < LiveChartStatus.length; i++) {
        Cookies.set(LiveChartStatus[i].paramaterID + "_ChartStatus", false, { expires: 7 });
        LiveChartStatus[i].ChartStatus = false;
        var checkallvalues = document.getElementById(LiveChartStatus[i].paramaterID);
        checkallvalues.checked = false;
      }
    }
    GenerateChart(ListAllData)

    // var ele=document.getElementById('paramtername');
    // if(e.target.checked==true){       
    //   for(var i=0; i<ele.length; i++){  
    //     if(ele[i].type=='checkbox')  
    //         ele[i].checked=true;  
    //   }  
    // }
    // else{      
    //   for(var i=0; i<ele.length; i++){  
    //     if(ele[i].type=='checkbox')  
    //         ele[i].checked=false;  
    //   }
    // } 
  }

  const DeviceServiceMode = async function (param) {
    let servicemode = !param.serviceMode;
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + 'api/Devices/ServiceMode/' + param.id, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: authHeader.Authorization,
        'app-origin':authHeader["app-origin"]
      },
      body: JSON.stringify({ ServiceMode: servicemode }),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == 1) {
          //  toast.success('Device Updated successfully');
          param.serviceMode = !param.serviceMode;
          ListAllDataCopy.current.listPollutents.filter(x => x.deviceID == param.id)
            .forEach(x => x.flag = !x.isEnable ? null : param.serviceMode ? 5 : 1);

        } else {
          toast.error('Unable to change the service mode. Please contact adminstrator');
        }
      }).catch((error) => toast.error('Unable to change the service mode. Please contact adminstrator'));

  }
  const ParameterEnable = async function (param) {
    let isEnable = !param.isEnable;
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + 'api/Parametres/IsEnable/' + param.id, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: authHeader.Authorization,
        'app-origin':authHeader["app-origin"]
      },
      body: JSON.stringify({ IsEnable: isEnable }),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == 1) {
          //  toast.success('Device Updated successfully');
          param.isEnable = !param.isEnable;
          param.parameterValue = null;
          param.flag = !param.isEnable ? null : 1;
        } else {
          toast.error('Unable to change the parameter status. Please contact adminstrator');
        }
      }).catch((error) => toast.error('Unable to change the parameter status. Please contact adminstrator'));
  }



  const GetTotalTime = function () {
    for (let i = 1; i <= 5; i++) {
      var raisingtime = document.getElementById("risingtime" + i).value;
      var fallingTime = document.getElementById("fallingtime" + i).value;
      var totaltime = document.getElementById("totaltime" + i).value;
      var addValue = Number(totaltime) - (Number(raisingtime) + Number(fallingTime));
      document.getElementById("stabilizationtime" + i).value = addValue;
    }
  }

  const getUserRole = function () {
    const currentUser = JSON.parse(sessionStorage.getItem('UserData'));

    if (currentUser.role.toUpperCase() == window.UserRoles[0].ADMIN.toUpperCase()) {
      setUserRole(true);
    }
    else if (currentUser.role.toUpperCase() == window.UserRoles[0].GUEST.toUpperCase()) {
      setUserRole(false);
    }
  }

  const DownloadPng = function () {
    const chartElement = chartRef.current.canvas;
    html2canvas(chartElement, {
      backgroundColor: 'white', // Set null to preserve the original chart background color
    }).then((canvas) => {
      const image = canvas.toDataURL('image/png');

      // Create a download link and trigger click event
      const downloadLink = document.createElement('a');
      downloadLink.href = image;
      downloadLink.download = 'DashboardChart.png';
      downloadLink.click();
    });
    /* var a = document.createElement('a');
    a.href = chartRef.current.toBase64Image();
    a.download = 'chart.png';
    a.click(); */
    return;
  }


  const DownloadPdf = () => {
    const chartElement = chartRef.current.canvas;
    html2canvas(chartElement, {
      backgroundColor: 'white', // Set null to preserve the original chart background color
    }).then((canvas) => {
      const chartImage = canvas.toDataURL('image/png');

      // Create a PDF using jsPDF
      const pdf = new jsPDF();
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(chartImage, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('DashboardChart.pdf');
    });
  };


  return (
    <main id="main" className="main">
      <div className="modal fade zoom dashboard_dmodal" id="infomodal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">Device Information</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="table-responsive">
                <table className="table align-middle table-bordered">
                  <thead>
                    <tr className="header_active">
                      <th>From</th>
                      <th>Property</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  {Infodevices && (
                    <tbody>
                      <tr className="body_active">
                        <td>Device</td>
                        <td>Wording</td>
                        <td>{Infodevices.deviceName}</td>
                      </tr>
                      <tr className="body_active">
                        <td>Acquisition</td>
                        <td>Type</td>
                        <td>{Infodevices.type}</td>
                      </tr>
                      {Infodevices.type == 'Tcp/IP' && (
                        <tr className="body_active">
                          <td>Physcical Channel</td>
                          <td>IP Address</td>
                          <td>{Infodevices.ipAddress}</td>
                        </tr>
                      )}
                      {Infodevices.type == 'Serial' && (
                        <tr className="body_active">
                          <td>Physcical Channel</td>
                          <td>Comm Port</td>
                          <td>{Infodevices.commPort}</td>
                        </tr>
                      )}
                      <tr className="body_active">
                        <td>Protocol</td>
                        <td>Type</td>
                        <td>{Infodevices.type == 'Serial' ? 'Serial' : 'Modbus'}</td>
                      </tr>
                      {InfoParameters.map((x, y) =>
                        <React.Fragment>
                          <tr>
                            <td rowSpan={3}>{x.parameterName}</td>
                          </tr>
                          <tr>
                            <td>COEF A</td>
                            <td>{x.coefA}</td>
                          </tr>
                          <tr>
                            <td>COEF B</td>
                            <td>{x.coefB}</td>
                          </tr>
                        </React.Fragment>
                      )}
                    </tbody>
                  )}
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Ok</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade zoom dashboard_dmodal" id="alertmodal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">View of the device failures</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="table-responsive">
                <table className="table align-middle table-bordered">
                  <thead>
                    <tr className="header_active">
                      <th>From</th>
                      <th>Wording</th>
                      <th>State</th>
                    </tr>
                  </thead>
                  {Infodevices && (
                    <tbody>
                      <tr>
                        <td rowSpan={Infoalarms.length + 1}>{Infodevices.deviceName}</td>
                      </tr>
                      {Infoalarms.map((i, j) =>
                        <tr className={i.status == 1 ? "text-danger" : ""}>
                          <td >{i.description}</td>
                          <td >{i.status == 1 ? "Active" : "Inactive"}</td>
                        </tr>
                      )}
                    </tbody>
                  )}
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Ok</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade zoom dashboard_dmodal" id="alarmmodal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">View of the device alarm</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="table-responsive">
                <table className="table align-middle table-bordered">
                  <thead>
                    <tr className="header_active">
                      <th>Measure</th>
                      <th>From</th>
                      <th>State</th>
                    </tr>
                  </thead>
                  {Infodevices && (
                    <tbody>
                      {InfoParameters.map((x, y) =>
                        <React.Fragment>
                          <tr>
                            <td rowSpan={ListAllData.parameterAlarmsList.filter(z => z.parameterID == x.id).length + 1}>{x.parameterName}</td>
                          </tr>
                          {ListAllData.parameterAlarmsList.filter(z => z.parameterID == x.id).map((k, l) =>
                            <React.Fragment>
                              {!k.status == 1 && (
                                <tr>
                                  <td>{k.flag}</td>
                                  <td>Inactive</td>
                                </tr>
                              )}

                              {k.status == 1 && (
                                <tr className="text-danger">
                                  <td>{k.flag}</td>
                                  <td>Active</td>
                                </tr>
                              )}
                            </React.Fragment>
                          )}
                        </React.Fragment>
                      )}
                    </tbody>
                  )}
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Ok</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade zoom dashboard_dmodal" id="alertcode" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">Codes Information</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="table-responsive">
                <table className="table align-middle table-bordered">
                  <thead>
                    <tr className="header_active">
                      <th>Code</th>
                      <th>Message</th>
                    </tr>
                  </thead>
                  {ListAllData && (
                    <tbody>
                      {ListAllData.listFlagCodes.map((x, y) =>
                        <tr>
                          <td>{x.code}</td>
                          <td style={{ backgroundColor: x.colorCode }}>{x.name}</td>
                        </tr>
                      )}
                      {/* <tr>
                      <td>R</td>
                      <td>Rebuild</td>
                    </tr>
                    <tr>
                      <td>O</td>
                      <td>Corrected</td>
                    </tr>
                    <tr>
                      <td>P</td>
                      <td>Drift</td>
                    </tr>
                    <tr>
                      <td>W</td>
                      <td>Warning</td>
                    </tr>
                    <tr>
                      <td>I</td>
                      <td>Invalid</td>
                    </tr>
                    <tr>
                      <td>D</td>
                      <td>Failed</td>
                    </tr>
                    <tr>
                      <td>M</td>
                      <td>Maint</td>
                    </tr>
                    <tr>
                      <td>Z</td>
                      <td>Zero</td>
                    </tr>
                    <tr>
                      <td>B</td>
                      <td>Anomaly</td>
                    </tr>
                    <tr>
                      <td>X</td>
                      <td>Stop</td>
                    </tr>
                    <tr>
                      <td>G</td>
                      <td>Out of range</td>
                    </tr>
                    <tr>
                      <td>g</td>
                      <td>Out of range but valid</td>
                    </tr>
                    <tr>
                      <td>H</td>
                      <td>Out of domain</td>
                    </tr>
                    <tr>
                      <td>S</td>
                      <td>Alternative value</td>
                    </tr>
                    <tr>
                      <td>C</td>
                      <td>Span</td>
                    </tr> */}
                    </tbody>
                  )}
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Ok</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade zoom dashboard_dmodal" id="calibrationmodal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">Punctual calibration</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="calibrationmodal">
                <div className="row">
                  <div className="col-md-2">
                    <label for="formGroupExampleInput" class="form-label">Measure</label>
                  </div>
                  <div className="col-md-4">
                    <select className="form-select" id="parameter" onChange={(e) => Parameterchange(e)}>
                      {InfoParameters.map((x, y) =>
                        <option value={x.id}>{x.parameterName}</option>
                      )}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <select className="form-select" id="userprofile">
                      <option value="User Profile">User Profile</option>
                    </select>
                  </div>
                </div>
                <ul className="nav nav-tabs mt-3" id="calibrationTab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="sequence1-tab" data-bs-toggle="tab" data-bs-target="#sequence1-tab-pane" type="button" role="tab" aria-controls="sequence1-tab-pane" aria-selected="true">Sequence1</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link" id="sequence2-tab" data-bs-toggle="tab" data-bs-target="#sequence2-tab-pane" type="button" role="tab" aria-controls="sequence2-tab-pane" aria-selected="false">Sequence2</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link " id="sequence3-tab" data-bs-toggle="tab" data-bs-target="#sequence3-tab-pane" type="button" role="tab" aria-controls="sequence3-tab-pane" aria-selected="false" >Sequence3</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link " id="sequence4-tab" data-bs-toggle="tab" data-bs-target="#sequence4-tab-pane" type="button" role="tab" aria-controls="sequence4-tab-pane" aria-selected="false" >Sequence4</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link " id="sequence5-tab" data-bs-toggle="tab" data-bs-target="#sequence5-tab-pane" type="button" role="tab" aria-controls="sequence5-tab-pane" aria-selected="false" >Sequence5</button>
                  </li>
                </ul>
                <div className={"tab-content " + (UserRole ? "" : "sequencedisable")} id="calibrationTabContent">
                  {(() => {
                    let calibration = [];
                    for (let i = 1; i <= 5; i++) {
                      calibration.push(<div className={i == 1 ? "tab-pane fade show active" : "tab-pane fade"} id={"sequence" + i + "-tab-pane"} role="tabpanel" aria-labelledby={"sequence" + i + "-tab"} >
                        <form id={"Sequenceform" + i} noValidate>
                          <div className="dashboard_row">
                            <div className="col-md-9">
                              <fieldset>
                                <legend>Configuration</legend>
                                <div className="row">
                                  <div className="col-md-6">
                                  </div>
                                  <div className="col-md-6">
                                    <div className="row mb-3 form-check">
                                      <div className="col align-self-center form-check">
                                        <input type="checkbox" className="form-check-input px-0" id={"enable" + i} />
                                        <label className="form-check-label" for="enable">Enable</label>
                                      </div>
                                    </div>
                                    <div className="row mb-3">
                                      <span style={{ "visibility": "hidden", "height": "0px" }} id={"recid" + i} ></span>
                                      <label htmlFor="typeofsequence" className="col-md-4 col-form-label">Type of the sequence</label>
                                      <div className="col-md-8">
                                        <select id={"typeofsequence" + i} className="form-select" required>
                                          <option value="" selected>Select Type of the sequence</option>
                                          {window.Typeofsequence.map((x, y) =>
                                            <option value={x}>{x}</option>
                                          )}
                                        </select>
                                      </div>
                                    </div>
                                    <div className="row mb-3">
                                      <label htmlFor="totaltime" className="col-md-4 col-form-label">Repeated Interval</label>
                                      <div className="col-md-8 repeatedinterval">
                                        <input type="number" className="form-control" id={"repeatedinterval" + i} placeholder="Enter Interval" required />
                                        <select className="form-select" id={"repeatedintervaltype" + i}>
                                          <option value="S">Seconds</option>
                                          <option value="M" selected>Minutes</option>
                                          <option value="H">Hours</option>
                                          <option value="D">Days</option>
                                        </select>
                                      </div>
                                    </div>
                                    <div className="row mb-3">
                                      <label htmlFor="starttime" className="col-md-4 col-form-label">Start Time</label>
                                      <div className="col-md-8">
                                        {i == 1 && (
                                          <DateTimePicker id={"starttime" + i} onChange={onChange1} value={StartDatetime1} required />
                                        )}
                                        {i == 2 && (
                                          <DateTimePicker id={"starttime" + i} onChange={onChange2} value={StartDatetime2} required />
                                        )}
                                        {i == 3 && (
                                          <DateTimePicker id={"starttime" + i} onChange={onChange3} value={StartDatetime3} required />
                                        )}
                                        {i == 4 && (
                                          <DateTimePicker id={"starttime" + i} onChange={onChange4} value={StartDatetime4} required />
                                        )}
                                        {i == 5 && (
                                          <DateTimePicker id={"starttime" + i} onChange={onChange5} value={StartDatetime5} required />
                                        )}
                                      </div>
                                    </div>
                                    <div className="row mb-3">
                                      <label htmlFor="totaltime" className="col-md-4 col-form-label">1 - Total time</label>
                                      <div className="col-md-8">
                                        <input type="number" className="form-control" step="any" id={"totaltime" + i} required />
                                      </div>
                                    </div>
                                    <div className="row mb-3">
                                      <label htmlFor="risingtime" className="col-md-4 col-form-label">2 - Rising time</label>
                                      <div className="col-md-8">
                                        <input type="number" className="form-control" step="any" id={"risingtime" + i} onChange={GetTotalTime} required />
                                      </div>
                                    </div>
                                    <div className="row mb-3">
                                      <label htmlFor="fallingtime" className="col-md-4 col-form-label">3 - Falling time</label>
                                      <div className="col-md-8">
                                        <input type="number" className="form-control" step="any" id={"fallingtime" + i} onChange={GetTotalTime} required />
                                      </div>
                                    </div>
                                    <div className="row mb-3">
                                      <label htmlFor="stabilizationtime" className="col-md-4 col-form-label">4 - Stabilization time</label>
                                      <div className="col-md-8">
                                        <input type="number" className="form-control" id={"stabilizationtime" + i} onChange={GetTotalTime} disabled />
                                      </div>
                                    </div>
                                    <div className="row mb-3">
                                      <label htmlFor="highdrift" className="col-md-4 col-form-label">5 - High Drift</label>
                                      <div className="col-md-8">
                                        <input type="number" className="form-control" step="any" id={"highdrift" + i} required />
                                      </div>
                                    </div>
                                    <div className="row mb-3">
                                      <label htmlFor="lowdrift" className="col-md-4 col-form-label">6 - Low Drift</label>
                                      <div className="col-md-8">
                                        <input type="number" className="form-control" step="any" id={"lowdrift" + i} required />
                                      </div>
                                    </div>
                                    <div className="row mb-3">
                                      <label htmlFor="signalvalue" className="col-md-4 col-form-label">7 - Signal value</label>
                                      <div className="col-md-8">
                                        <input type="number" className="form-control" step="any" id={"signalvalue" + i} required />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </fieldset>
                            </div>
                            <div className="col-md-3">
                              <fieldset>
                                <legend>Commands</legend>
                                <div className="row">
                                  <div className="col-md-12 mb-2">
                                    <select className="form-select" id={"command" + i + "1"}>
                                      <option value="" selected>Select Commands</option>
                                      <optgroup label="Device">
                                        {Commands.map((x, y) =>
                                          <option value={x.id + "_" + "D"}>{x.description}</option>
                                        )}
                                      </optgroup>
                                      <optgroup label="Calibration">
                                        {CalibrationsCommands.map((x, y) =>
                                          <option value={x.id + "_" + "C"}>{x.description}</option>
                                        )}
                                      </optgroup>
                                    </select>
                                  </div>
                                  <div className="col-md-12 mb-2">
                                    <select className="form-select" id={"command" + i + "2"}>
                                      <option value="" selected>Select Commands</option>
                                      <optgroup label="Device">
                                        {Commands.map((x, y) =>
                                          <option value={x.id + "_" + "D"}>{x.description}</option>
                                        )}
                                      </optgroup>
                                      <optgroup label="Calibration">
                                        {CalibrationsCommands.map((x, y) =>
                                          <option value={x.id + "_" + "C"}>{x.description}</option>
                                        )}
                                      </optgroup>
                                    </select>
                                  </div>
                                  <div className="col-md-12 mb-2">
                                    <select className="form-select" id={"command" + i + "3"}>
                                      <option value="" selected>Select Commands</option>
                                      <optgroup label="Device">
                                        {Commands.map((x, y) =>
                                          <option value={x.id + "_" + "D"}>{x.description}</option>
                                        )}
                                      </optgroup>
                                      <optgroup label="Calibration">
                                        {CalibrationsCommands.map((x, y) =>
                                          <option value={x.id + "_" + "C"}>{x.description}</option>
                                        )}
                                      </optgroup>
                                    </select>
                                  </div>
                                  <div className="col-md-12 mb-2">
                                    <select className="form-select" id={"command" + i + "4"}>
                                      <option value="" selected>Select Commands</option>
                                      <optgroup label="Device">
                                        {Commands.map((x, y) =>
                                          <option value={x.id + "_" + "D"}>{x.description}</option>
                                        )}
                                      </optgroup>
                                      <optgroup label="Calibration">
                                        {CalibrationsCommands.map((x, y) =>
                                          <option value={x.id + "_" + "C"}>{x.description}</option>
                                        )}
                                      </optgroup>
                                    </select>
                                  </div>
                                  <div className="col-md-12 mb-2">
                                    <select className="form-select" id={"command" + i + "5"}>
                                      <option value="" selected>Select Commands</option>
                                      <optgroup label="Device">
                                        {Commands.map((x, y) =>
                                          <option value={x.id + "_" + "D"}>{x.description}</option>
                                        )}
                                      </optgroup>
                                      <optgroup label="Calibration">
                                        {CalibrationsCommands.map((x, y) =>
                                          <option value={x.id + "_" + "C"}>{x.description}</option>
                                        )}
                                      </optgroup>
                                    </select>
                                  </div>
                                  <div className="col-md-12 mb-2">
                                    <select className="form-select" id={"command" + i + "6"}>
                                      <option value="" selected>Select Commands</option>
                                      <optgroup label="Device">
                                        {Commands.map((x, y) =>
                                          <option value={x.id + "_" + "D"}>{x.description}</option>
                                        )}
                                      </optgroup>
                                      <optgroup label="Calibration">
                                        {CalibrationsCommands.map((x, y) =>
                                          <option value={x.id + "_" + "C"}>{x.description}</option>
                                        )}
                                      </optgroup>
                                    </select>
                                  </div>
                                  <div className="col-md-12 mb-2">
                                    <select className="form-select" id={"command" + i + "7"}>
                                      <option value="" selected>Select Commands</option>
                                      <optgroup label="Device">
                                        {Commands.map((x, y) =>
                                          <option value={x.id + "_" + "D"}>{x.description}</option>
                                        )}
                                      </optgroup>
                                      <optgroup label="Calibration">
                                        {CalibrationsCommands.map((x, y) =>
                                          <option value={x.id + "_" + "C"}>{x.description}</option>
                                        )}
                                      </optgroup>
                                    </select>
                                  </div>
                                  <div className="col-md-12 mb-2">
                                    <select className="form-select" id={"command" + i + "8"}>
                                      <option value="" selected>Select Commands</option>
                                      <optgroup label="Device">
                                        {Commands.map((x, y) =>
                                          <option value={x.id + "_" + "D"}>{x.description}</option>
                                        )}
                                      </optgroup>
                                      <optgroup label="Calibration">
                                        {CalibrationsCommands.map((x, y) =>
                                          <option value={x.id + "_" + "C"}>{x.description}</option>
                                        )}
                                      </optgroup>
                                    </select>
                                  </div>
                                  <div className="col-md-12 mb-2">
                                    <select className="form-select" id={"command" + i + "9"}>
                                      <option value="" selected>Select Commands</option>
                                      <optgroup label="Device">
                                        {Commands.map((x, y) =>
                                          <option value={x.id + "_" + "D"}>{x.description}</option>
                                        )}
                                      </optgroup>
                                      <optgroup label="Calibration">
                                        {CalibrationsCommands.map((x, y) =>
                                          <option value={x.id + "_" + "C"}>{x.description}</option>
                                        )}
                                      </optgroup>
                                    </select>
                                  </div>
                                  <div className="col-md-12 mb-2">
                                    <select className="form-select" id={"command" + i + "0"}>
                                      <option value="" selected>Select Commands</option>
                                      <optgroup label="Device">
                                        {Commands.map((x, y) =>
                                          <option value={x.id + "_" + "D"}>{x.description}</option>
                                        )}
                                      </optgroup>
                                      <optgroup label="Calibration">
                                        {CalibrationsCommands.map((x, y) =>
                                          <option value={x.id + "_" + "C"}>{x.description}</option>
                                        )}
                                      </optgroup>
                                    </select>
                                  </div>
                                </div>
                              </fieldset>
                            </div>

                          </div>
                          <div className="float-end ">
                            <button type="button" className={"btn btn-primary px-3 py-1 my-1 " + (UserRole ? "" : "disable")} onClick={() => Clearformvalues(i)} >Clear</button>
                          </div>
                        </form>
                      </div>);
                    }
                    return calibration;
                  })()}


                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className={"btn btn-primary " + (UserRole ? "" : "disable")} onClick={SaveCalibrationSequence} >Save</button>
            </div>
          </div>
        </div>
      </div>
      <div className="pagetitle d-flex justify-content-between">
        <h1>Dashboard</h1>
        <div className="col-md-3 mb-3 d-inline-flex">
          <label for="Interval" className="form-label me-3">Date & Time:</label>
          <span className="dashboard_date">  {currentdatetime} </span>
        </div>
      </div>

      <section className="section dashboard">
        {ListAllData && (
          <div className="row">

            <div className="col-lg-12">
              <div className="row" style={{ display: "none" }}>

                <div className="col-xxl-4 col-md-4">
                  <div className="card info-card sales-card">
                    <div className="card-body">
                      <h5 className="card-title text-center">Stations</h5>

                      <div className="align-items-center text-center">
                        {/* <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                  <i className="bi bi-cart"></i>
                </div> */}
                        <div className="ps-3">
                          {/*  <h6>{ListAllData.listStations.length}</h6> */}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="col-xxl-4 col-md-4">
                  <div className="card info-card revenue-card">
                    <div className="card-body">
                      <h5 className="card-title text-center">Devices</h5>

                      <div className="align-items-center text-center">
                        {/* <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                  <i className="bi bi-currency-dollar"></i>
                </div> */}
                        <div className="ps-3">
                          <h6>{ListAllData.listDevices.length}</h6>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="col-xxl-4 col-md-4">

                  <div className="card info-card customers-card">
                    <div className="card-body">
                      <h5 className="card-title text-center">Parameters</h5>

                      <div className="align-items-center text-center">
                        {/*  <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                  <i className="bi bi-people"></i>
                </div> */}
                        <div className="ps-3 text-center">
                          <h6>{ListAllData.listPollutents.length}</h6>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

              </div>

              <div className="dashboard_row">
                {ListAllData.listDevices.map((x, y) =>
                  x.status == 1 && (
                    <div className="dashboard_col">
                      <div className="card info-card revenue-card">
                        <div className="card-body ">
                          <div className="d-flex justify-content-between">
                            {/*     <div className="icons"><i className="bi bi-sliders2-vertical"></i></div> */}
                            <div className="device">{x.deviceName}</div>
                            <div className="icons" title="Info" onClick={() => Deviceinfo(x)}><i className="bi bi-info-circle"></i></div>
                          </div>
                          <div className="d-flex justify-content-start mt-2">
                            {!x.serviceMode && (
                              <div className={"icons " + (UserRole ? "" : "disable")} title="Service Mode" onClick={() => DeviceServiceMode(x)}>
                                <i class="bi bi-modem"></i>&nbsp;
                              </div>
                            )}
                            {x.serviceMode && (
                              <div className={"icons " + (UserRole ? "" : "disable")} title="Service Mode" onClick={() => DeviceServiceMode(x)}>
                                <i class="bi bi-modem text-danger" ></i>&nbsp;
                              </div>
                            )}
                            <div className="icons" title="Calibration" onClick={() => Devicecalibration(x)}><i class="bi bi-gear"></i>&nbsp;</div>
                            <div className="icons" title="Alarm" onClick={() => Devicealarm(x)}><i class="bi bi-alarm"></i>&nbsp; </div>
                            {ListAllData.listAlarms.filter(z => z.deviceModelId == x.deviceModel && z.status == 1).length > 0 && (
                              <div className="icons blink" title="Alert" onClick={() => Devicealert(x)}><i className="bi bi-lightbulb-fill"></i>&nbsp; </div>
                            )}
                            {!ListAllData.listAlarms.filter(z => z.deviceModelId == x.deviceModel && z.status == 1).length > 0 && (
                              <div className="icons"><i className="bi bi-lightbulb" onClick={() => Devicealert(x)}></i></div>
                            )}
                          </div>
                          {ListAllData.listPollutents.map((i, j) =>
                            (i.deviceID == x.id && i.status == 1) && (
                              <div className="d-flex justify-content-between mt-2">
                                <div className="parameter"><span onClick={() => ParameterEnable(i)}>{i.isEnable && (<i className={"bi bi-check2 " + (UserRole ? "" : "disable")} ></i>)} {!i.isEnable && (<i className={"bi bi-x-lg " + (UserRole ? " text-danger" : "disable")} ></i>)}</span> <span>{i.parameterName}</span></div>
                                {(i.parameterName.toUpperCase() == "RAIN" && i.parseFunction == "") ? (
                                <div className="values"><button className="btn1" style={{ backgroundColor: i.flag != null ? ListAllData.listFlagCodes.filter(y => y.id == i.flag)[0].colorCode : "#FFFFFF" }} onClick={Codesinformation} >{i.flag == null ? "-" : ListAllData.listFlagCodes.filter(y => y.id == i.flag)[0].code}</button>
                                  <button className="btn2">{ListAllData.rainLiveValue == null ? '-' : ListAllData.rainLiveValue.toFixed(window.DashboardLivenumberround)}</button>&nbsp;<sub>{ListAllData.listReportedUnits.filter(x => x.id === i.unitID).length > 0 ? ListAllData.listReportedUnits.filter(x => x.id === i.unitID)[0].unitName.toLowerCase() : ""}</sub>
                                  </div>
                                  ):
                                  (
                                <div className="values"><button className="btn1" style={{ backgroundColor: i.flag != null ? ListAllData.listFlagCodes.filter(y => y.id == i.flag)[0].colorCode : "#FFFFFF" }} onClick={Codesinformation} >{i.flag == null ? "-" : ListAllData.listFlagCodes.filter(y => y.id == i.flag)[0].code}</button>
                                  <button className="btn2">{i.parameterValue == null ? '-' : i.parameterValue.toFixed(window.DashboardLivenumberround)}</button>&nbsp;<sub>{ListAllData.listReportedUnits.filter(x => x.id === i.unitID).length > 0 ? ListAllData.listReportedUnits.filter(x => x.id === i.unitID)[0].unitName.toLowerCase() : ""}</sub>
                                  </div>
                                  )}
                                  </div>
                            )
                          )}
                        </div>

                      </div>
                    </div>
                  )

                )}
              </div>
              <div class="row mt-3 justify-content-center">
                <label class="col-sm-2 col-form-label text-end">Select Interval</label>
                <div class="col-sm-2">
                  <select className="form-select" id="criteriaid" onChange={(e) => Intervalchange(e)}>
                    <option value="1M" selected>1-M</option>
                     {IntervalCriteria.map((x, y) =>
                    <option value={x.value + x.type} key={y} >{x.value + '-' + x.type}</option>
                  )}
                  </select>
                </div>
              </div>
              <div className="row">
                <div className="col-md-11">
                  <Line ref={chartRef} options={ChartOptions} data={ChartData} height={100} />
                </div>
                <div className="col-md-1 mt-5">
                  <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="selectall" defaultChecked={LiveChartStatus.filter(x => x.ChartStatus == false).length == 0 ? true : false} onChange={() => selects(ListAllData.listPollutents)} ></input>
                    <label class="form-check-label">Select All</label>
                  </div>
                  {ListAllData.listPollutents.map((i, j) =>

                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id={i.id} value={i.id} defaultChecked={LiveChartStatus[j].ChartStatus} onChange={() => DeviceGraph(i)} />
                      {/* <input class="form-check-input" type="checkbox" name="paramtername" value={i.id}  onChange={() => DeviceGraph(i)}/> */}
                      <label class="form-check-label" htmlFor="flexCheckDefault">
                        {i.parameterName}
                      </label>
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <button type="button" className="btn btn-primary mx-1" onClick={DownloadPng}>Download as Image</button>
                  <button type="button" className="btn btn-primary mx-1" onClick={DownloadPdf}>Download as Pdf</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

    </main>
  );
}
export default Dashboard;