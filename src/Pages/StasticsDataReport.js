import React, { useCallback, useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Filler,
    Title,
    Tooltip,
    Legend,
    defaults 
  } from 'chart.js';
  ChartJS.register(
     CategoryScale,
     LinearScale,
     PointElement,
     LineElement,
     Filler,
     Title,
     Tooltip,
     Legend
    );
function StasticsDataReport() {
  const $ = window.jQuery;
  const gridRefjsgridreport = useRef();
  const chartRef = useRef();
  const [selectedStations, setselectedStations] = useState([]);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [ListReportData, setListReportData] = useState([]);
  const [AllLookpdata, setAllLookpdata] = useState(null);
  const [Stations, setStations] = useState([]);
  const [Pollutents, setPollutents] = useState([]);
  const [SelectedPollutents, setSelectedPollutents] = useState([]);
  const [Criteria, setcriteria] = useState([]);
  const [ChartData, setChartData] = useState({labels:[],datasets:[]});
  const [ChartOptions, setChartOptions] = useState();
 var lastSelectedRow;

  const colorArray = ["#96cdf5", "#fbaec1", "#00ff00", "#800000", "#808000", "#008000", "#008080", "#000080", "#FF00FF", "#800080",
    "#CD5C5C", "#FF5733", "#1ABC9C", "#F8C471", "#196F3D", "#707B7C", "#9A7D0A", "#B03A2E", "#F8C471", "#7E5109"];

  useEffect(() => {
    fetch(process.env.REACT_APP_WSurl + "api/AirQuality/GetAllLookupData")
      .then((response) => response.json())
      .then((data) => {
        setAllLookpdata(data);
        setStations(data.listStations);
        setTimeout(function () {
          $('#stationid').SumoSelect({
            triggerChangeCombined: true, placeholder: 'Select Station', floatWidth: 200, selectAll: true,
            search: true
          });
          $('#pollutentid').SumoSelect({
            triggerChangeCombined: true, placeholder: 'Select Parameter', floatWidth: 200, selectAll: true,
            search: true
          });
        }, 100);

        //setcriteria(data.listPollutentsConfig);
      })
      .catch((error) => console.log(error));
    // initializeJsGrid();
  }, []);
  useEffect(() => {
    initializeJsGrid();
  });

  const toggleRow=function(row,lastSelectedRow) {
    //row.className = row.className == 'selected' ? '' : 'selected';
    row.classList.toggle('highlight');
   return lastSelectedRow=row;
}

const selectRowsBetweenIndexes=function(indexes,trs) {
    indexes.sort(function(a, b) {
        return a - b;
    });

    for (var i = indexes[0]; i <= indexes[1]; i++) {
       // trs[i-1].className = 'selected';
        trs[i-1].classList.add('highlight');
    }
}

const UpdateColPos=function (cols) {
  var left = $('.jsgrid-grid-body').scrollLeft() < $('.jsgrid-grid-body .jsgrid-table').width() - $('.jsgrid-grid-body').width() + 16
      ? $('.jsgrid-grid-body').scrollLeft() : $('.jsgrid-grid-body .jsgrid-table').width() - $('.jsgrid-grid-body').width() + 16;
  $('.jsgrid-header-row th:nth-child(-n+' + cols + '), .jsgrid-filter-row td:nth-child(-n+' + cols + '), .jsgrid-insert-row td:nth-child(-n+' + cols + '), .jsgrid-grid-body tr td:nth-child(-n+' + cols + ')')
      .css({
          "position": "relative",
          "left": left
      });
}

const clearAll=function(trs) {
    for (var i = 0; i < trs.length; i++) {
      trs[i].classList.remove('highlight');
       // trs[i].className = 'selected';
    }
}
  /* reported data start */
  const initializeJsGrid = function () {
        var dataForGrid = [];
        var layout = [];
        layout.push({ name: "Date", title: "Date", type: "text" });
        for(var i=0; i< SelectedPollutents.length;i++){
            layout.push({ name:SelectedPollutents[i] , title:  SelectedPollutents[i] + " - ppb" , type: "text" });
        }
        
        layout.push({ type: "control", width: 100, editButton: false, deleteButton: false });
        for (var k = 0; k < ListReportData.length; k++) {
            var obj = {};
            var temp= dataForGrid.findIndex(x => x.Date ===ListReportData[k].interval) 
            if(temp >= 0)
            {
                dataForGrid[temp][ListReportData[k].parameterName]=ListReportData[k].parametervalue;
            }else{
                obj["Date"] = ListReportData[k].interval;
                obj[ListReportData[k].parameterName] = ListReportData[k].parametervalue;
                dataForGrid.push(obj);
            }
        }

    window.jQuery(gridRefjsgridreport.current).jsGrid({
      width: "100%",
      height: "300px",
      filtering: true,
      editing: false,
      inserting: false,
      sorting: true,
      paging: true,
      autoload: true,
      pageSize: 100,
      pageButtonCount: 5,      
      controller: {
        data: dataForGrid,
        loadData: function (filter) {
          let resultData = this.data;
          var d = $.Deferred();
          $(".jsgrid-filter-row input:text").addClass("form-control").addClass("form-control-sm");
          $(".jsgrid-filter-row select").addClass("custom-select").addClass("custom-select-sm");
          for (var prop in filter) {
              if (filter[prop].length > 0) {
                resultData = $.grep(resultData, function (item) {
                  if(!filter[prop]  || item[prop].toString().indexOf(filter[prop]) >= 0){
                    return item;
                  }
                });
                break;
              }
            }
            d.resolve(resultData);
            return d.promise();
        }
      },
    //  rowSelection: 'multiple',
//       rowClick: function(args) {
// var trs = this._body[0].getElementsByTagName('tr')
//         var $row1 = args.event.target;
//         var currenttr = this.rowByItem(args.item)[0],
//             selectedRow = $(".jsGrid").find('table tr.highlight');
//             if (window.event.ctrlKey) {
//               lastSelectedRow=toggleRow(currenttr,lastSelectedRow);
//           }
          
//           if (window.event.button === 0) {
//               if (!window.event.ctrlKey && !window.event.shiftKey) {
//                   clearAll(trs);
//                   lastSelectedRow=toggleRow(currenttr,lastSelectedRow);
//               }
          
//               if (window.event.shiftKey) {
//                   selectRowsBetweenIndexes([lastSelectedRow.rowIndex+1, args.itemIndex+1],trs)
//               }
//           }
        
//        /*  if (selectedRow.length) {
//             selectedRow.toggleClass('highlight');
//         }; */
//         $row1.classList.toggle('highlight');
//         //$row.toggleClass("highlight");
//       },
      fields: layout
    //   fields: [
    //     //{ name: "stationID", title: "Station Name", type: "select", items: Stations, valueField: "id", textField: "stationName", width: 200 },
        
    //     { name: "parametervalue", title: "NO2 Value", type: "text" },
    //     //{ name: "parameterName", title: "Parameter Name", type: "text" },
    //     { name: "parametervalue", title: "SO2 Value", type: "text", },
    //     { name: "interval", title: "Date", type: "text" },
    //     //{ name: "type", title: "Interval", type: "text" },
    //     { type: "control", width: 100, editButton: false, deleteButton: false },
    //   ]
    });

    $('.jsgrid-grid-body').scroll(function () {
      UpdateColPos(1);
    });
  }
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
  const getdatareport = function () {
    console.log(new Date());
    document.getElementById('loader').style.display = "block";
    // if (chartRef.current != null) {
    //     chartRef.current.data = {};
    //   }
    let Station = $("#stationid").val();
    if (Station.length > 0) {
      Station.join(',')
    }
    let Pollutent = $("#pollutentid").val();
    setSelectedPollutents(Pollutent);
    if (Pollutent.length > 0) {
      Pollutent.join(',')
    }
    let Fromdate = document.getElementById("fromdateid").value;
    let Todate = document.getElementById("todateid").value;
    let Interval = document.getElementById("criteriaid").value;
    let valid = ReportValidations(Station, Pollutent, Fromdate, Todate, Interval);
    if (!valid) {
      return false;
    }
    let params = new URLSearchParams({ Station: Station, Pollutent: Pollutent, Fromdate: Fromdate, Todate: Todate, Interval: Interval });
    let url = process.env.REACT_APP_WSurl + "api/AirQuality?"
    fetch(url + params, {
      method: 'GET',
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          console.log(new Date());
          //let Chart_data = JSON.parse(data);
          let data1 = data.map((x) => { x.interval = x.interval.replace('T', ' '); return x; });
          setListReportData(data1);
          GenarateChart(Station,Pollutent,Fromdate,Todate,Interval);
          //getchartdata(Chart_data, Pollutent, "Raw")
        }
        document.getElementById('loader').style.display = "none";
      }).catch((error) => console.log(error));
    

  }
  const GenarateChart = function (Station,Pollutent,Fromdate,Todate,Interval) {
    // let Station = $("#stationid").val();
    // let Pollutent = $("#pollutentid").val();
    // let Fromdate = document.getElementById("fromdateid").value;
    // let Todate = document.getElementById("todateid").value;
    // let Interval = document.getElementById("intervalid").value;
    // let Criteria = document.getElementById("criteriaid").value;
    let Criteria ="Raw";
    if (Criteria == "Raw") {
      if (Station.length > 1) {
        toast.error('Please select only one station at a time to generate chart.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        return false;
      }
    }
    // if (Station.length > 1) {
    //   Station.join(',')
    // }
    if (Pollutent.length > 1) {
      Pollutent.join(',')
    }
    //let ChartType = document.getElementById("charttypeid").value;
    let valid = ReportValidations(Station, Pollutent, Fromdate, Todate, Interval);
    if (!valid) {
      return false;
    }
    let url = process.env.REACT_APP_WSurl + "api/AirQuality/"
    let suburl = "getRawData";
    // let suburl = "getAnnualAverages";
    // if (Criteria == 'Max') {
    //   suburl = "geMaxValuePollutants";
    // } else if (Criteria == 'Percentile') {
    //   suburl = "getPercentile";
    // } else if (Criteria == 'MeanTimeseries') {
    //   suburl = "getMetParametersValues";
    // } else if (Criteria == "Raw") {
    //   suburl = "getRawData";
    // }
    fetch(url + suburl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ StationName: Station.toString(), FromDate: Fromdate, ToDate: Todate, Criteria: Criteria, DataFilter: Interval, Pollutant: Pollutent.toString() }),
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          let data1 = JSON.parse(data);
          getchartdata(data1, Pollutent, "line", "Raw")
        }
      }).catch((error) => console.log(error));
  }
  const DownloadExcel = function () {
    let Station = $("#stationid").val();
    if (Station.length > 0) {
      Station.join(',')
    }
    let Pollutent = $("#pollutentid").val();
    if (Pollutent.length > 0) {
      Pollutent.join(',')
    }
    let Fromdate = document.getElementById("fromdateid").value;
    let Todate = document.getElementById("todateid").value;
    let Interval = document.getElementById("criteriaid").value;
    let valid = ReportValidations(Station, Pollutent, Fromdate, Todate, Interval);
    if (!valid) {
      return false;
    }
    let params = new URLSearchParams({ Station: Station, Pollutent: Pollutent, Fromdate: Fromdate, Todate: Todate, Interval: Interval });
    window.open(process.env.REACT_APP_WSurl + "api/AirQuality/ExportToExcel?" + params,"_blank");
    /*  fetch(url + params, {
       method: 'GET',
     }).then((response) => response.json())
       .then((data) => {
       }).catch((error) => console.log(error)); */
  }

  const ReportValidations = function (Station, Pollutent, Fromdate, Todate, Interval) {
    let isvalid = true;
    if (Station == "") {
      toast.error('Please select station', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      isvalid = false;
    } else if (Pollutent == "") {
      toast.error('Please select parameter', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      isvalid = false;
    } else if (Fromdate == "") {
      toast.error('Please select from date', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      isvalid = false;
    } else if (Todate == "") {
      toast.error('Please select to date', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      isvalid = false;
    } else if (Interval == "") {
      toast.error('Please select interval', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      isvalid = false;
    }
    return isvalid;
  }
  /* reported data end */

  const ChangeStation = function (e) {
    setPollutents([]);
    setcriteria([]);
    let finaldata = AllLookpdata.listPollutents.filter(obj => obj.stationID == e.target.value);
    setPollutents(finaldata);
  }
  $('#stationid').change(function (event) {
    setPollutents([]);
    setcriteria([]);
    let filter = $(this).val();
    setselectedStations(filter);
    let finaldata = AllLookpdata.listPollutents.filter(function (item) {
      for (var i = 0; i < filter.length; i++) {
        if (item['stationID'] == filter[i])
          return true;
      }
    });
    var finaldata1 = [];
  /*   if (filter.length >= 2) { */
      finaldata1 = finaldata.reduce((unique, o) => {
        if (!unique.some(obj => obj.stationID == o.stationID && obj.pollutentName === o.pollutentName)) {
          unique.push(o);
        }
        return unique;
      }, []);
    /* } else {
      finaldata1 = finaldata;
    } */
    setPollutents(finaldata1);
    setTimeout(function () {
     // $('.pollutentid')[0].sumo.unSelectAll(); 
      $('.pollutentid')[0].sumo.reload();
    }, 10);
  })
  const Changepollutent = function (e) {
    setcriteria([]);
    console.log(selectedStations);
    let stationID = document.getElementById("stationid").val();
    let finaldata = AllLookpdata.listPollutents.filter(obj => obj.stationID == stationID && obj.parameterName == e.target.value);
    if (finaldata.length > 0) {
      let finalinterval = [];
      let intervalarr = finaldata[0].avgInterval.split(',');
      for (let i = 0; i < intervalarr.length; i++) {
        let intervalsplitarr = intervalarr[i].split('-');
        finalinterval.push({ value: intervalsplitarr[0], type: intervalsplitarr[1] })
      }
      let finalinterval1 = finalinterval.reduce((unique, o) => {
        if (!unique.some(obj => obj.value != o.value && obj.type === o.type)) {
          unique.push(o);
        }
        return unique;
      }, []);
      setcriteria(finalinterval1);
    }
  }
  $('#pollutentid').change(function (e) {
    setcriteria([]);
    let stationID = $("#stationid").val();
    let filter1 = $(this).val();
    
    // let finaldata = AllLookpdata.listPollutentsConfig.filter(obj => obj.stationID == stationID && obj.parameterName == e.target.value);
    let finaldata = AllLookpdata.listPollutentsConfig.filter(obj => stationID.includes(obj.stationID) || filter1.includes(obj.parameterName));
    if (finaldata.length > 0) {
      let finalinterval = [];
      for (let j = 0; j < finaldata.length; j++) {
        let intervalarr = finaldata[j].interval.split(',');
        for (let i = 0; i < intervalarr.length; i++) {
          let intervalsplitarr = intervalarr[i].split('-');
          let index = finalinterval.findIndex(x => x.value === intervalsplitarr[0] && x.type === intervalsplitarr[1]);
          if (index == -1) {
            finalinterval.push({ value: intervalsplitarr[0], type: intervalsplitarr[1] })
          }
        }
      }
      setcriteria(finalinterval);
    }
  })
  const Resetfilters=function(){
    $('.pollutentid')[0].sumo.reload();
    $('.pollutentid')[0].sumo.unSelectAll();
    $('.stationid')[0].sumo.reload();
    $('.stationid')[0].sumo.unSelectAll();
    setcriteria([]);
    setToDate(new Date());
    setFromDate(new Date());
    setListReportData([]);
    setSelectedPollutents([]);
  }

  const getchartdata = function (data, pollutent, charttype, criteria) {
    if (chartRef.current != null) {
      chartRef.current.data = {};
    }
    
    setChartData({labels:[],datasets:[]});
    setChartOptions();
    let datasets = [];
    let chartdata = [];
    let tempdata = [];
    let NinetyEightPercentile = [];
    let FiftyPercentile = [];
    let labels = [];
    let NinetyEightPercentileValue = 0;
    let FiftyPercentileValue = 0;
    let MaxVal = 0;
    let xAxislabel = [];
    for (let i = 0; i < pollutent.length; i++) {
      chartdata = [];
      NinetyEightPercentile = [];
      FiftyPercentile = [];
      let pollutentdata = data[pollutent[i]];
      if (criteria == 'MeanTimeseries') {
        for (var x = 0; x < data[pollutent[i] + "xAxisData"].length; x++) {
          let index = xAxislabel.indexOf(data[pollutent[i] + "xAxisData"][x].Value);
          if (index == -1) {
            xAxislabel.push(data[pollutent[i] + "xAxisData"][x].Value)
          }
        }
      }
      if (criteria != 'Raw') {
        for (let j = 0; j < data.StationNames.length; j++) {
          NinetyEightPercentileValue = 0;
          FiftyPercentileValue = 0;
          let index = labels.indexOf(data.StationNames[j].StationName);
          if (index == -1) {
            labels.push(data.StationNames[j].StationName)
          }
          tempdata = [];
          for (let k = 0; k < pollutentdata.length; k++) {
            if (data.StationNames[j].StationName == pollutentdata[k].StationName) {
              if (criteria == 'Percentile') {
                NinetyEightPercentileValue = pollutentdata[k][pollutent[i] + "98Percentile"];
                FiftyPercentileValue = pollutentdata[k][pollutent[i] + "50Percentile"];
                NinetyEightPercentile.push(NinetyEightPercentileValue);
                FiftyPercentile.push(FiftyPercentileValue);
                if (MaxVal < pollutentdata[k][pollutent[i] + "98Percentile"]) {
                  MaxVal = pollutentdata[k][pollutent[i] + "98Percentile"];
                }
              } else if (criteria == 'MeanTimeseries') {
                tempdata.push({ value: pollutentdata[k].PollutantValue, period: pollutentdata[k].Value })
              } else {
                chartdata.push(pollutentdata[k][pollutent[i]]);
              }
            }
          }
          if (criteria == 'MeanTimeseries') {
            chartdata = [];
            for (var t = 0; t < xAxislabel.length; t++) {
              let index1 = tempdata.findIndex(y => y.period === xAxislabel[t]);
              if (index1 == -1) {
                chartdata.push(0)
              } else {
                chartdata.push(tempdata[index1].value)
              }
            }
            datasets.push({ label: data.StationNames[j].StationName + "-" + pollutent[i], data: chartdata, borderColor: colorArray[j],borderWidth: 2, borderRadius: 5, backgroundColor: hexToRgbA(colorArray[j]) })
          }

        }
      } else {
        for (let k = 0; k < pollutentdata.length; k++) {
          let index = labels.indexOf(pollutentdata[k].Period1);
          if (index == -1) {
            labels.push(pollutentdata[k].Period1)
          }
          chartdata.push(pollutentdata[k].PollutantValue)
        }
      }
      if (criteria != 'MeanTimeseries') {
        if (charttype == 'bar') {
          if (criteria == 'Percentile') {
            datasets.push({ label: pollutent[i] + " - 98 %ile", data: NinetyEightPercentile, borderColor: colorArray[(colorArray.length) - (i + 1)],borderWidth: 2, borderRadius: 5, backgroundColor: hexToRgbA(colorArray[(colorArray.length) - (i + 1)]) })
            datasets.push({ label: pollutent[i] + " - 50 %ile", data: FiftyPercentile, borderColor: colorArray[i],borderWidth: 2, borderRadius: 5, backgroundColor: hexToRgbA(colorArray[i]) })
          } else {
            datasets.push({ label: pollutent[i], data: chartdata, borderColor: colorArray[i],borderWidth: 2, borderRadius: 5, backgroundColor: hexToRgbA(colorArray[i]) })
          }
        } else if (charttype == 'line') {
          if (criteria == 'Percentile') {
            datasets.push({ label: pollutent[i] + " - 98 %ile", data: NinetyEightPercentile, borderColor: colorArray[(colorArray.length) - (i + 1)], backgroundColor: hexToRgbA(colorArray[(colorArray.length) - (i + 1)]) })
            datasets.push({ label: pollutent[i] + " - 50 %ile", data: FiftyPercentile, borderColor: colorArray[i], backgroundColor: hexToRgbA(colorArray[i]) })
          } else {
            datasets.push({ label: pollutent[i], data: chartdata, borderColor: colorArray[i], backgroundColor: hexToRgbA(colorArray[i]) })
          }
        } else if (charttype == 'area') {
          if (criteria == 'Percentile') {
            datasets.push({ fill: true, label: pollutent[i] + " - 98 %ile", data: NinetyEightPercentile, borderColor: colorArray[(colorArray.length) - (i + 1)], backgroundColor: hexToRgbA(colorArray[(colorArray.length) - (i + 1)]) })
            datasets.push({ fill: true, label: pollutent[i] + " - 50 %ile", data: FiftyPercentile, borderColor: colorArray[i], backgroundColor: hexToRgbA(colorArray[i]) })
          } else {
            datasets.push({ fill: true, label: pollutent[i], data: chartdata, borderColor: colorArray[i], backgroundColor: hexToRgbA(colorArray[i]) })
          }
        }
      }
    }
    setChartOptions({
      responsive: true,
      /* interaction: {
        mode: 'index',
        intersect: false,
      }, */
   //   maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          //text: 'Chart.js Bar Chart',
        },
      },
    });
    if (criteria == 'MeanTimeseries') {
      labels = xAxislabel;
    }
    setTimeout(() => {
      setChartData({
        labels,
        datasets: datasets
      })
    }, 10);
  }
 
  return (
    <main id="main" className="main" >
      {/* Same as */}
      {/* <section className="section grid_section h100 w100">
        <div className="h100 w100"> */}
      <section>
        <div>
          <div>
            <div className="row">
              <div className="col-md-2">
                <label className="form-label">Station Name</label>
                <select className="form-select stationid" id="stationid" multiple="multiple" onChange={ChangeStation}>

                  {Stations.map((x, y) =>
                    <option value={x.id} key={y} >{x.stationName}</option>
                  )}
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label">Parameters</label>
                <select className="form-select pollutentid" id="pollutentid" multiple="multiple" onChange={Changepollutent}>
                  {/* <option selected> Select Pollutents</option> */}
                  {Pollutents.map((x, y) =>
                    <option value={x.parameterName} key={y} >{x.parameterName}</option>
                  )}
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label">From Date</label>
                <DatePicker className="form-control" id="fromdateid" selected={fromDate} onChange={(date) => setFromDate(date)} />
              </div>
              <div className="col-md-2">
                <label className="form-label">To Date</label>
                <DatePicker className="form-control" id="todateid" selected={toDate} onChange={(date) => setToDate(date)} />
              </div>
              <div className="col-md-2">
                <label className="form-label">Interval</label>
                <select className="form-select" id="criteriaid">
                  <option value="" selected>Select Interval</option>
                  {Criteria.map((x, y) =>
                    <option value={x.value + x.type} key={y} >{x.value + '-' + x.type}</option>
                  )}
                </select>
              </div>
              <div className="col-md-2 my-4">
                <button type="button" className="btn btn-primary" onClick={getdatareport}>GetData</button>
                <button type="button" className="btn btn-primary mx-1" onClick={Resetfilters}>Reset</button>
              </div>
              <div className="col-md-4">
                <div className="row">
                  <div id="loader" className="loader"></div>
                </div>
              </div>
          </div>
          {ListReportData.length > 0 && (
              <div>
                <div className="row">
                  <div className="col-md-12 mb-3">
                      <button type="button" className="btn btn-primary float-end" onClick={DownloadExcel}>Download Excel</button>
                  </div>
                </div>
                <div className="jsGrid" ref={gridRefjsgridreport} />
              </div>
            )}
            {ListReportData.length > 0 && ChartData && (
              <div >
                <Line ref={chartRef} options={ChartOptions} data={ChartData} height={120} />
              </div>
            )}
          </div>
        </div>
      </section>

    </main>
  );
}
export default StasticsDataReport;