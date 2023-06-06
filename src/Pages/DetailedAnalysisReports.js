import React, { useCallback, useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import 'chartjs-adapter-moment';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  TimeScale,
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
  TimeScale,
  Filler,
  Title,
  Tooltip,
  Legend
);
function DetailedAnalysisReports() {
  //defaults.animation=false;
  const $ = window.jQuery;
  const gridRefjsgridreport = useRef();
  const chartRef = useRef();
  const [selectedStations, setselectedStations] = useState([]);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [ChartDataAvg, setChartDataAvg] = useState({ labels: [], datasets: [] });
  const [ChartOptionsAvg, setChartOptionsAvg] = useState();
  const [ChartDataMax, setChartDataMax] = useState({ labels: [], datasets: [] });
  const [ChartOptionsMax, setChartOptionsMax] = useState();
  const [ChartData24h, setChartData24h] = useState({ labels: [], datasets: [] });
  const [ChartOptions24h, setChartOptions24h] = useState();
  const [ChartDatah, setChartDatah] = useState({ labels: [], datasets: [] });
  const [ChartOptionsh, setChartOptionsh] = useState();
  const [ChartDataExcedence24h, setChartDataExcedence24h] = useState({ labels: [], datasets: [] });
  const [ChartOptionsExcedence24h, setChartOptionsExcedence24h] = useState();
  const [ChartDataExcedence1h, setChartDataExcedence1h] = useState({ labels: [], datasets: [] });
  const [ChartOptionsExcedence1h, setChartOptionsExcedence1h] = useState();
  const [AllLookpdata, setAllLookpdata] = useState(null);
  const [Stations, setStations] = useState([]);
  const [Pollutents, setPollutents] = useState([]);
  const [Criteria, setcriteria] = useState([]);
  const [ChartType, setChartType] = useState();
  const colorArray = ["#96cdf5", "#fbaec1", "#00ff00", "#800000", "#808000", "#008000", "#008080", "#000080", "#FF00FF", "#800080",
    "#CD5C5C", "#FF5733","#1ABC9C", "#F8C471", "#196F3D", "#707B7C", "#9A7D0A", "#B03A2E", "#F8C471", "#7E5109"];
  useEffect(() => {
    var d = new Date();
    var currentyear = d.getFullYear();
    $(".js-range-slider").ionRangeSlider({
      min: 2007,
      max: currentyear,
      from: currentyear - 5,
      type: "double",
      to: currentyear,
      grid: true,
      grid_snap: true,
      from_fixed: false, // fix position of FROM handle
      to_fixed: false,
      onStart: function (data) {
        // console.log("onstart", data);
        setFromDate(data.from);
        setToDate(data.to);
      },
      onFinish: function (data) {
        //console.log("afterchange", data);
        setFromDate(data.from);
        setToDate(data.to);
      }
    });
  })
  useEffect(() => {
    fetch(process.env.REACT_APP_WSurl + "api/AirQuality/GetAllLookupData")
      .then((response) => response.json())
      .then((data) => {
        setAllLookpdata(data);
        setStations(data.listStations);
      })
      .catch((error) => console.log(error));
    // initializeJsGrid();
  }, []);
  const GenarateChart = function () {
    let Station = $("#stationid").val();
    let Pollutent = $("#pollutentid").val();
    let FromYear = fromDate;
    let ToYear = toDate;
    let Interval = '1440,60';
    let Interval1=Interval.split(',');
    let valid = ReportValidations(Station, Pollutent, FromYear, ToYear, Interval);
    if (!valid) {
      return false;
    }
    let url = process.env.REACT_APP_WSurl + "api/AirQuality/"
    let suburl = "getAnnualAveragesbyYear";
    fetch(url + suburl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ StationName: Station, FromYear: FromYear, ToYear: ToYear, DataFilter: Interval, Pollutant: Pollutent }),
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          let data1 = JSON.parse(data);
          getchartdataAvg(data1.AvgData, Pollutent, ChartType, Criteria);
          getchartdataMax(data1.MaxData, Pollutent, ChartType, Criteria);
          getchartdata24Hourly(data1.Hourly24Data, Pollutent, ChartType, Criteria);
          getchartdataHourly(data1.HourlyData, Pollutent, ChartType, Criteria);
          getchartdataExcedence24H(data1['HourlyDataExedence'+Interval1[0]], Pollutent, ChartType, Criteria);
          getchartdataExcedence1H(data1['HourlyDataExedence'+Interval1[1]], Pollutent, ChartType, Criteria);
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
    }
    return isvalid;
  }
  /* reported data end */
  const Stationchange = function (e) {
    setPollutents([]);
    let filter = e.currentTarget.value;
    setselectedStations(filter);
    let finaldata = AllLookpdata.listPollutents.filter(function (item) {
      if (item['stationID'] == filter)
        return true;
    });
    setPollutents(finaldata);
  }
  /* Barchart Start */
  const hexToRgbA = function (hex) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length == 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      console.log('rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',0.5)');
      return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',0.5)';
    }
    throw new Error('Bad Hex');
  }

  const getchartdataAvg = function (data, pollutent, charttype, criteria) {
    if (chartRef.current != null) {
      chartRef.current.data = {};
    }
    setChartType(charttype);
    setChartDataAvg({ labels: [], datasets: [] });
    setChartOptionsAvg();
    let datasets = [];
    let chartdata = [];
    let labels = [];
    let bgcolors = [];
    let pollutentdata = data;
    for (let k = 0; k < pollutentdata.length; k++) {
      let index = labels.indexOf(pollutentdata[k].YearValue);
      if (index == -1) {
        labels.push(pollutentdata[k].YearValue);
        chartdata.push(pollutentdata[k].PollutantValue)
        bgcolors.push(hexToRgbA(colorArray[k]));
      }
    }
    datasets.push({ label: "", data: chartdata, borderColor: colorArray, borderWidth: 2, borderRadius: 5, backgroundColor: bgcolors })
    setChartOptionsAvg({
      responsive: true,
      /* interaction: {
        mode: 'index',
        intersect: false,
      }, */
      //maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
          position: 'top',
        },
        title: {
          display: true,
          text: 'ANNUAL AVERAGE CONCENTRATION',
        },
      },
    });
    setTimeout(() => {
      setChartDataAvg({
        labels,
        datasets: datasets
      })
    }, 10);
  }
  const getchartdataMax = function (data, pollutent, charttype, criteria) {
    if (chartRef.current != null) {
      chartRef.current.data = {};
    }
    setChartDataMax({ labels: [], datasets: [] });
    setChartOptionsMax();
    let datasets = [];
    let chartdata = [];
    let labels = [];
    let bgcolors = [];
    let pollutentdata = data;
    for (let k = 0; k < pollutentdata.length; k++) {
      let index = labels.indexOf(pollutentdata[k].YearValue);
      if (index == -1) {
        labels.push(pollutentdata[k].YearValue);
        chartdata.push(pollutentdata[k].PollutantValue)
        bgcolors.push(hexToRgbA(colorArray[k]));
      }
    }
    datasets.push({ label: "", data: chartdata, borderColor: colorArray, borderWidth: 2, borderRadius: 5, backgroundColor: bgcolors })
    setChartOptionsMax({
      responsive: true,
      /* interaction: {
        mode: 'index',
        intersect: false,
      }, */
      //maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
          position: 'top',
        },
        title: {
          display: true,
          text: 'MAXIMUM 1-HOUR CONCENTRATION',
        },
      },
    });
    setTimeout(() => {
      setChartDataMax({
        labels,
        datasets: datasets
      })
    }, 10);
  }

  const getchartdata24Hourly = function (data, pollutent, charttype, criteria) {
    if (chartRef.current != null) {
      chartRef.current.data = {};
    }
    setChartData24h({ labels: [], datasets: [] });
    setChartOptions24h();
    let datasets = [];
    let chartdata = [];
    let labels = [];
    let bgcolors = [];
    let pollutentdata = data;
    for (let k = 0; k < pollutentdata.length; k++) {
      let index = labels.indexOf(pollutentdata[k].YearValue);
      if (index == -1) {
        labels.push(pollutentdata[k].YearValue);
     //   bgcolors.push(hexToRgbA(colorArray[k]));
      }
    }
    for (let i = 0; i < labels.length; i++) {
      chartdata = [];
      for (let j = 0; j < pollutentdata.length; j++) {
        if (pollutentdata[j].YearValue == labels[i]) {
          chartdata.push({x:pollutentdata[j].Interval,y:pollutentdata[j].PollutantValue});
        }
      }
      datasets.push({ label: labels[i], data: chartdata, borderColor: colorArray[i], borderWidth: 2, borderRadius: 5, backgroundColor: hexToRgbA(colorArray[i]) });
    }
    //    chartdata.push(pollutentdata[k].PollutantValue)
    setChartOptions24h({
      responsive: true,
      /* interaction: {
        mode: 'index',
        intersect: false,
      }, */
      //maintainAspectRatio: false,
      scales: {
        x: {
          type: "time",
          time: {
            unit: "year"
          },
          bounds: 'ticks'
        },
        /* y: {
          beginAtZero: true,
        }, */
      },
      plugins: {
        legend: {
         // display: false,
          position: 'top',
        },
        title: {
          display: true,
          text: pollutent+' HOUR CONCENTRATIONS - 24Hr',
        },
      },
    });
    setTimeout(() => {
      setChartData24h({
       // labels,
        datasets: datasets
      })
    }, 10);
  }
  const getchartdataHourly = function (data, pollutent, charttype, criteria) {
    if (chartRef.current != null) {
      chartRef.current.data = {};
    }
    setChartDatah({ labels: [], datasets: [] });
    setChartOptionsh();
    let datasets = [];
    let chartdata = [];
    let labels = [];
    let bgcolors = [];
    let pollutentdata = data;
    for (let k = 0; k < pollutentdata.length; k++) {
      let index = labels.indexOf(pollutentdata[k].YearValue);
      if (index == -1) {
        labels.push(pollutentdata[k].YearValue);
     //   bgcolors.push(hexToRgbA(colorArray[k]));
      }
    }
    for (let i = 0; i < labels.length; i++) {
      chartdata = [];
      for (let j = 0; j < pollutentdata.length; j++) {
        if (pollutentdata[j].YearValue == labels[i]) {
          chartdata.push({x:pollutentdata[j].Interval,y:pollutentdata[j].PollutantValue});
        }
      }
      datasets.push({ label: labels[i], data: chartdata, borderColor: colorArray[i], borderWidth: 2, borderRadius: 5, backgroundColor: hexToRgbA(colorArray[i]) });
    }
    //    chartdata.push(pollutentdata[k].PollutantValue)
    setChartOptionsh({
      responsive: true,
      scales: {
        x: {
          type: "time",
          time: {
            unit: "year"
          },
          bounds: 'ticks'
        },
        /* y: {
          beginAtZero: true,
        }, */
      },
      plugins: {
        legend: {
         // display: false,
          position: 'top',
        },
        title: {
          display: true,
          text: pollutent+' HOUR CONCENTRATIONS - 1Hr',
        },
      },
    });
    setTimeout(() => {
      setChartDatah({
        labels,
        datasets: datasets
      })
    }, 10);
  }

  const getchartdataExcedence24H = function (data, pollutent, charttype, criteria) {
    if (chartRef.current != null) {
      chartRef.current.data = {};
    }
    setChartDataExcedence24h({ labels: [], datasets: [] });
    setChartOptionsExcedence24h();
    let datasets = [];
    let chartdata = [];
    let labels = [];
    let bgcolors = [];
    let pollutentdata = data;
    for (let k = 0; k < pollutentdata.length; k++) {
      let index = labels.indexOf(pollutentdata[k].YearValue);
      if (index == -1) {
        labels.push(pollutentdata[k].YearValue);
        chartdata.push(pollutentdata[k].PollutantValue)
        bgcolors.push(hexToRgbA(colorArray[k]));
      }
    }
    datasets.push({ label: "", data: chartdata, borderColor: colorArray, borderWidth: 2, borderRadius: 5, backgroundColor: bgcolors })
    setChartOptionsExcedence24h({
      responsive: true,
      /* interaction: {
        mode: 'index',
        intersect: false,
      }, */
      //maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
          position: 'top',
        },
        title: { 
          display: true,
          text: pollutent+' HOURS EXCEEDING -24Hr',
        },
      },
    });
    setTimeout(() => {
      setChartDataExcedence24h({
        labels,
        datasets: datasets
      })
    }, 10);
  }
  const getchartdataExcedence1H = function (data, pollutent, charttype, criteria) {
    if (chartRef.current != null) {
      chartRef.current.data = {};
    }
    setChartDataExcedence1h({ labels: [], datasets: [] });
    setChartOptionsExcedence1h();
    let datasets = [];
    let chartdata = [];
    let labels = [];
    let bgcolors = [];
    let pollutentdata = data;
    for (let k = 0; k < pollutentdata.length; k++) {
      let index = labels.indexOf(pollutentdata[k].YearValue);
      if (index == -1) {
        labels.push(pollutentdata[k].YearValue);
        chartdata.push(pollutentdata[k].PollutantValue)
        bgcolors.push(hexToRgbA(colorArray[k]));
      }
    }
    datasets.push({ label: "", data: chartdata, borderColor: colorArray, borderWidth: 2, borderRadius: 5, backgroundColor: bgcolors })
    setChartOptionsExcedence1h({
      responsive: true,
      /* interaction: {
        mode: 'index',
        intersect: false,
      }, */
      //maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
          position: 'top',
        },
        title: {
          display: true,
          text: pollutent+' HOURS EXCEEDING -1Hr',
        },
      },
    });
    setTimeout(() => {
      setChartDataExcedence1h({
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
              <div className="col-md-3">
                <label className="form-label">Station Name</label>
                <select className="form-select stationid" id="stationid" onChange={Stationchange}>
                  <option selected value="">Select Station</option>
                  {Stations.map((x, y) =>
                    <option value={x.id} key={y} >{x.stationName}</option>
                  )}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Parameters</label>
                <select className="form-select pollutentid" id="pollutentid">
                  <option selected value=""> Select Parameter</option>
                  {Pollutents.map((x, y) =>
                    <option value={x.parameterName} key={y} >{x.parameterName}</option>
                  )}
                </select>
              </div>
              <div className="col-md-4">
                <div className="ion-slider-container pull-left" style={{ width: '100%' }}>
                  <input type="range" className="js-range-slider" value="3" data-orientation="vertical" />
                </div>
              </div>
              <div className="col-md-2 text-center my-3">
                <button type="button" className="btn btn-primary" onClick={GenarateChart}>Generate Chart</button>
              </div>
            </div>
            <div className="row mt-5">
              {ChartDataAvg && (
                <div className="col-md-6">
                  <Bar ref={chartRef} options={ChartOptionsAvg} data={ChartDataAvg} height={90} />
                </div>
              )}
              {ChartDataMax && (
                <div className="col-md-6">
                  <Bar ref={chartRef} options={ChartOptionsMax} data={ChartDataMax} height={90} />
                </div>
              )}
              {ChartData24h && (
                <div className="col-md-6">
                  <Line ref={chartRef} options={ChartOptions24h} data={ChartData24h} height={90}/>
                </div>
              )}
              {ChartOptionsh && (
                <div className="col-md-6">
                  <Line ref={chartRef} options={ChartOptionsh} data={ChartDatah} height={90}/>
                </div>
              )}
              {ChartOptionsExcedence24h && (
                <div className="col-md-6">
                  <Bar ref={chartRef} options={ChartOptionsExcedence24h} data={ChartDataExcedence24h} height={90} />
                </div>
              )}
              {ChartOptionsExcedence1h && (
                <div className="col-md-6">
                  <Bar ref={chartRef} options={ChartOptionsExcedence1h} data={ChartDataExcedence1h} height={90} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
export default DetailedAnalysisReports;