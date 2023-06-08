import React, { useCallback, useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import DatePicker from "react-datepicker";
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
import { Chart, Bar, Line, Scatter } from 'react-chartjs-2';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);
function StasticsReportServer() {
  //defaults.animation=false;
  const $ = window.jQuery;
  const gridRefjsgridreport = useRef();
  const chartRef = useRef();
  const [selectedStations, setselectedStations] = useState([]);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [ChartData, setChartData] = useState({labels:[],datasets:[]});
  const [ChartOptions, setChartOptions] = useState();
  const [AllLookpdata, setAllLookpdata] = useState(null);
  const [Stations, setStations] = useState([]);
  const [Pollutents, setPollutents] = useState([]);
  const [Criteria, setcriteria] = useState([]);
  const [ChartType, setChartType] = useState();
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
  const GenarateChart = function () {
    let Station = $("#stationid").val();
    let Pollutent = $("#pollutentid").val();
    let Fromdate = document.getElementById("fromdateid").value;
    let Todate = document.getElementById("todateid").value;
    let Interval = document.getElementById("intervalid").value;
    let Criteria = document.getElementById("criteriaid").value;
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
    if (Station.length > 1) {
      Station.join(',')
    }
    if (Pollutent.length > 1) {
      Pollutent.join(',')
    }
    let ChartType = document.getElementById("charttypeid").value;
    let valid = ReportValidations(Station, Pollutent, Fromdate, Todate, Interval);
    if (!valid) {
      return false;
    }

    let type = Interval.substr(Interval.length - 1);
    let Intervaltype;
    if (type == 'H') {
      Intervaltype = Interval.substr(0, Interval.length - 1) * 60;
    } else {
      Intervaltype = Interval.substr(0, Interval.length - 1);
    }

    let url = process.env.REACT_APP_WSurl + "api/AirQuality/"
    let suburl = "getAnnualAverages";
    if (Criteria == 'Max') {
      suburl = "geMaxValuePollutants";
    } else if (Criteria == 'Percentile') {
      suburl = "getPercentile";
    } else if (Criteria == 'MeanTimeseries') {
      suburl = "getMetParametersValues";
    } else if (Criteria == "Raw") {
      suburl = "getRawData";
    }
    fetch(url + suburl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ StationName: Station.toString(), FromDate: Fromdate, ToDate: Todate, Criteria: Criteria, DataFilter: Interval, Pollutant: Pollutent.toString(), DataFilterID:Intervaltype }),
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          let data1 = JSON.parse(data);
          getchartdata(data1, Pollutent, ChartType, Criteria)
        }
      }).catch((error) => console.log(error));
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
      toast.error('Please select pollutent', {
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
      toast.error('Please select criteria', {
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
   // if (filter.length >= 2) {
      finaldata1 = finaldata.reduce((unique, o) => {
        if (!unique.some(obj => obj.stationID == o.stationID && obj.parameterName === o.parameterName)) {
          unique.push(o);
        }
        return unique;
      }, []);
    /* } else {
      finaldata1 = finaldata;
    } */
    setPollutents(finaldata1);
    setTimeout(function () {
      //$('.pollutentid')[0].sumo.unSelectAll();
      $('.pollutentid')[0].sumo.reload();
    }, 10);
  })

  $('#pollutentid').change(function (e) {
    setcriteria([]);
    let stationID = $("#stationid").val();
    let filter1 = $(this).val();
    // let finaldata = AllLookpdata.listPollutentsConfig.filter(obj => obj.stationID == stationID && obj.parameterName == e.target.value);
    let finaldata = AllLookpdata.listPollutents.filter(obj => stationID.includes(obj.stationID) || filter1.includes(obj.parameterName));
    if (finaldata.length > 0) {
      let finalinterval = [];
      for (let j = 0; j < finaldata.length; j++) {
        let intervalarr = finaldata[j].avgInterval.split(',');
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

  /* Barchart Start */
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

  const getchartdata = function (data, pollutent, charttype, criteria) {
    if (chartRef.current != null) {
      chartRef.current.data = {};
    }
    setChartType(charttype);
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

  /* Barchart End */
  return (
    <main id="main" className="main" >
      {/* Same as */}
      {/* <section className="section grid_section h100 w100">
        <div className="h100 w100"> */}
      <section>
        <div>
          <div>
            <div className="row filtergroup">
              <div className="col">
                <label className="form-label">Station Name</label>
                <select className="form-select stationid" id="stationid" multiple="multiple">

                  {Stations.map((x, y) =>
                    <option value={x.id} key={y} >{x.stationName}</option>
                  )}
                </select>
              </div>
              <div className="col">
                <label className="form-label">Parameters</label>
                <select className="form-select pollutentid" id="pollutentid" multiple="multiple">
                  {/* <option selected> Select Pollutents</option> */}
                  {Pollutents.map((x, y) =>
                    <option value={x.ID} key={y} >{x.parameterName}</option>
                  )}
                </select>
              </div>
              <div className="col">
                <label className="form-label">From Date</label>
                <DatePicker className="form-control" id="fromdateid" selected={fromDate} onChange={(date) => setFromDate(date)} />
              </div>
              <div className="col">
                <label className="form-label">To Date</label>
                <DatePicker className="form-control" id="todateid" selected={toDate} onChange={(date) => setToDate(date)} />
              </div>
              <div className="col">
                <label className="form-label">Type of Chart</label>
                <select className="form-select" id="charttypeid">
                  <option value="bar">Bar Chart</option>
                  <option value="line">Line Chart</option>
                  <option value="area">Area Chart</option>
                  {/*   <option value="scatter">Scatter Chart</option> */}
                </select>
              </div>
              <div className="col">
                <label className="form-label">Criteria</label>
                <select className="form-select" id="criteriaid">
                  <option value="Mean">Mean by Station Name</option>
                  <option value="MeanTimeseries">Mean by Timeseries</option>
                  <option value="Raw">Raw</option>
                  <option value="Max">Maximum</option>
                 {/*  <option value="Compliance">Compliance Percentage</option>
                  <option value="Max %">Concentrations in % limit values</option>
                  <option value="AQL Exceed">Exceedences Numbers</option> */}
                  <option value="Percentile">98 &amp; 50 Percentile </option>
                </select>
              </div>
              <div className="col">
                <label className="form-label">Interval</label>
                <select className="form-select" id="intervalid">
                  <option value="" selected>Select Interval</option>
                  {Criteria.map((x, y) =>
                    <option value={x.value + x.type} key={y} >{x.value + '-' + x.type}</option>
                  )}
                </select>
              </div>

              <div className="col-md-12 text-center my-3">
                <button type="button" className="btn btn-primary" onClick={GenarateChart}>Generate Chart</button>
              </div>
            </div>
            {ChartData && ChartType == 'bar' && (
              <div className="col-md-12">
                 <Bar ref={chartRef} options={ChartOptions} data={ChartData}  height={120} />
              </div>
            )}
            {ChartData && ChartType == 'line' && (
              <div className="col-md-12">
                <Line ref={chartRef} options={ChartOptions} data={ChartData}  height={120} />
              </div>
            )}
            {ChartData && ChartType == 'area' && (
              <div className="col-md-12">
                <Line ref={chartRef} options={ChartOptions} data={ChartData} height={120} />
              </div>
            )}
          </div>
        </div>
      </section>

    </main>
  );
}
export default StasticsReportServer;