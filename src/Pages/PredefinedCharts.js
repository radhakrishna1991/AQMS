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
function PredefinedCharts() {
  //defaults.animation=false;
  const $ = window.jQuery;
  const gridRefjsgridreport = useRef();
  const chartRef = useRef();
  const [selectedStations, setselectedStations] = useState([]);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [ChartData, setChartData] = useState({ labels: [], datasets: [] });
  const [ChartOptions, setChartOptions] = useState();
  const [AllLookpdata, setAllLookpdata] = useState(null);
  const [Stations, setStations] = useState([]);
  const [Pollutents, setPollutents] = useState([]);
  const [Criteria, setcriteria] = useState([]);
  const [ChartType, setChartType] = useState();
  const colorArray = ["#96cdf5", "#fbaec1", "#00ff00", "#800000", "#808000", "#008000", "#008080", "#000080", "#FF00FF", "#800080",
    "#CD5C5C", "#FF5733", "#1ABC9C", "#F8C471", "#196F3D", "#707B7C", "#9A7D0A", "#B03A2E", "#F8C471", "#7E5109"];
  useEffect(() => {
    GenarateChart();
  }, []);
  const GenarateChart = function () {
    let url = process.env.REACT_APP_WSurl + "api/AirQuality/getPredefinedchartData";
    let Pollutent = $("input[type='radio'][name='parametersradio']:checked").val();
    let DataFilter = 1440;
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ DataFilter: DataFilter, Pollutant: Pollutent.toString() }),
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          let data1 = JSON.parse(data);
          getchartdata(data1, Pollutent, ChartType, Criteria)
        }
      }).catch((error) => console.log(error));
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
      return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',0.5)';
    }
    throw new Error('Bad Hex');
  }

  const getchartdata = function (data, pollutent, charttype, criteria) {
    if (chartRef.current != null) {
      chartRef.current.data = {};
    }
    setChartType(charttype);
    setChartData({ labels: [], datasets: [] });
    setChartOptions();
    let datasets = [];
    let chartdata = [];
    let labels = [];
    let Stations = [];
    let pollutentdata = data[pollutent];
    for (let k = 0; k < pollutentdata.length; k++) {
      let index = labels.indexOf(pollutentdata[k].Period);
      let index1 = Stations.indexOf(pollutentdata[k].StationName);
      if (index == -1) {
        labels.push(pollutentdata[k].Period)
      }
      if (index1 == -1) {
        Stations.push(pollutentdata[k].StationName)
      }
    }
    for (let i = 0; i < Stations.length; i++) {
      chartdata = [];
      for (let j = 0; j < pollutentdata.length; j++) {
        if (pollutentdata[j].StationName === Stations[i]) {
          chartdata.push(pollutentdata[j].PollutantValue)
        }
      }
      datasets.push({ label: Stations[i] + " - " + pollutent, data: chartdata, borderColor: colorArray[i], backgroundColor: hexToRgbA(colorArray[i]) })
    }



    setChartOptions({
      responsive: true,
      /* interaction: {
        mode: 'index',
        intersect: false,
      }, */
    maintainAspectRatio: true,
    /* scales: {
      y: {
        beginAtZero: true,
      },
    }, */
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: pollutent+' ANNUAL TENDENCY DIAGRAM',
        },
      },
    });
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
      <div className="container">
        <section>
          <div>
            <div>
              <div>
                <h6 className="my-3">Select Parameter(To Genarate Chart)</h6>
              </div>
              <div className="">
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="parametersradio" onChange={GenarateChart} id="coradio" value="CO" />
                  <label className="form-check-label" for="coradio">CO</label>
                </div>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="parametersradio" onChange={GenarateChart} id="no2radio" value="NO2" />
                  <label className="form-check-label" for="no2radio">NO2</label>
                </div>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="parametersradio" onChange={GenarateChart} defaultChecked={true} id="so2radio" value="SO2" />
                  <label className="form-check-label" for="so2radio">SO2</label>
                </div>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="parametersradio" onChange={GenarateChart} id="o3radio" value="O3" />
                  <label className="form-check-label" for="o3radio">O3</label>
                </div>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="parametersradio" onChange={GenarateChart} id="pm10radio" value="PM10" />
                  <label className="form-check-label" for="pm10radio">PM10</label>
                </div>
              </div>
              {ChartData && (
                <div className="col-md-12">
                  <Line ref={chartRef} options={ChartOptions} data={ChartData}  height={120}/>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
export default PredefinedCharts;