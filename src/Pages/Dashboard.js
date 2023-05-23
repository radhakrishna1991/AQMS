import React, { useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import 'chartjs-adapter-moment';
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
  const [LiveChartStatus, setLiveChartStatus] = useState([]);
  const [LiveCharticons, setLiveCharticons] = useState([]);
  const [ChartOptions, setChartOptions] = useState();
  const [currentdatetime, setcurrentdatetime] = useState(new Date().toLocaleString());
  const [ChartData, setChartData] = useState({ labels: [], datasets: [] });
  const currentUser = JSON.parse(sessionStorage.getItem('UserData'));
  const ListAllDataCopy = useRef();
  ListAllDataCopy.current = ListAllData;
  const colorArray = ["#96cdf5", "#fbaec1", "#00ff00", "#800000", "#808000", "#008000", "#008080", "#000080", "#FF00FF", "#800080",
    "#CD5C5C", "#FF5733 ", "#1ABC9C", "#F8C471", "#196F3D", "#707B7C", "#9A7D0A", "#B03A2E", "#F8C471", "#7E5109"];
  let parameterChartStatus = [];
  const Minute = window.DashboardRefreshtime;

  useEffect(() => {
    fetch(process.env.REACT_APP_WSurl + "api/Dashboard", {
      method: 'GET',
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          setListAllData(data);
          for (var i = 0; i < data.listPollutents.length; i++) {
            //sessionStorage.setItem(data.listPollutents[i].id + "_ChartStatus", false);
            if (Cookies.get(data.listPollutents[i].id + "_ChartStatus") != 'false') {
              Cookies.set(data.listPollutents[i].id + "_ChartStatus", true, { expires: 7 });
              parameterChartStatus.push({ paramaterID: data.listPollutents[i].id, paramaterName: data.listPollutents[i].parameterName, ChartStatus: true })
            }else {
              parameterChartStatus.push({ paramaterID: data.listPollutents[i].id, paramaterName: data.listPollutents[i].parameterName, ChartStatus: false })
            }
          }
          setLiveChartStatus(parameterChartStatus);
          GenerateChart(data);
        }
      }).catch((error) => toast.error('Unable to get the data. Please contact adminstrator'));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      //  console.log('Logs every minute');
      fetch(process.env.REACT_APP_WSurl + "api/Livedata", {
        method: 'GET',
      }).then((response) => response.json())
        .then((data) => {
          if (data) {
            ListAllDataCopy.current.listParametervalues = data;
            GenerateChart(ListAllDataCopy.current);
          }
        }).catch((error) =>
          toast.error('Unable to get the data. Please contact adminstrator')
        );
    }, Minute);

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
    setInfoParameters(parameters);
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
  const Codesinformation = function () {
    $('#alertcode').modal('show');
  }

  const Devicecalibration = function (param) {
    let parameters = ListAllData.listPollutents.filter(x => x.deviceID == param.id);
    setInfoParameters(parameters);
    $('#calibrationmodal').modal('show');
  }

  const generateDatabaseDateTime = function (date) {

    return date.replace("T", " ").substring(0, 19);

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
          time: {
            unit: 'second',
            displayFormats: {
              second: 'HH:mm:ss'
            },
            tooltipFormat: 'D MMM YYYY - HH:mm:ss'
          }
        }

      },
      // maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'top',
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
                          <td>Number</td>
                          <td>{Infodevices.number}</td>
                        </tr>
                      )}
                      <tr className="body_active">
                        <td>Protocol</td>
                        <td>Type</td>
                        <td>APIIP</td>
                      </tr>
                      {InfoParameters.map((x, y) =>
                        <React.Fragment>
                          <tr>
                            <td rowSpan={3}>{x.parameterName}</td>
                            <td>Number</td>
                            <td>2</td>
                          </tr>
                          <tr>
                            <td>COEF A</td>
                            <td>1</td>
                          </tr>
                          <tr>
                            <td>COEF B</td>
                            <td>0</td>
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
                        <td rowSpan={14}>{Infodevices.deviceName}</td>
                        <td>Serial link failure</td>
                        <td>Active</td>
                      </tr>
                      <tr>
                        <td>MAINT</td>
                        <td>Inactive</td>
                      </tr>
                      <tr>
                        <td>DEBIT</td>
                        <td>Inactive</td>
                      </tr>
                      <tr>
                        <td>DEBOZONE</td>
                        <td>Inactive</td>
                      </tr>
                      <tr>
                        <td>OZONEUR</td>
                        <td>Inactive</td>
                      </tr>
                      <tr>
                        <td>PRESSION</td>
                        <td>Inactive</td>
                      </tr>
                      <tr>
                        <td>TMPINT</td>
                        <td>Inactive</td>
                      </tr>
                      <tr>
                        <td>TMPCHAM</td>
                        <td>Inactive</td>
                      </tr>
                      <tr>
                        <td>TMPIZS</td>
                        <td>Inactive</td>
                      </tr>
                      <tr>
                        <td>TMPCONV</td>
                        <td>Inactive</td>
                      </tr>
                      <tr>
                        <td>TMPPM</td>
                        <td>Inactive</td>
                      </tr>
                      <tr>
                        <td>ZERODYAN</td>
                        <td>Inactive</td>
                      </tr>
                      <tr>
                        <td>SPANDYN</td>
                        <td>Inactive</td>
                      </tr>
                      <tr>
                        <td>DCALIM</td>
                        <td>Inactive</td>
                      </tr>
                      {InfoParameters.map((x, y) =>
                        <React.Fragment>
                          <tr>
                            <td rowSpan={4}>{x.parameterName}</td>
                            <td>Overrange under a signal value threshold</td>
                            <td>Inactive</td>
                          </tr>
                          <tr>
                            <td>Overrange above a signal value threshold</td>
                            <td>Inactive</td>
                          </tr>
                          <tr>
                            <td>Overrange of signal slope</td>
                            <td>Inactive</td>
                          </tr>
                          <tr>
                            <td>Overrange of immobile signal</td>
                            <td>Inactive</td>
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
                            <td rowSpan={21}>{x.parameterName}</td>
                            <td>Low threshold 1 sample</td>
                            <td>Inactive</td>
                          </tr>
                          <tr>
                            <td>Low threshold 2 sample</td>
                            <td>Inactive</td>
                          </tr>
                          <tr>
                            <td>Low threshold 3 sample</td>
                            <td>Inactive</td>
                          </tr>
                          <tr>
                            <td>Low threshold 4 sample</td>
                            <td>Inactive</td>
                          </tr>
                          <tr>
                            <td>Low threshold 5 sample</td>
                            <td>Inactive</td>
                          </tr>
                          <tr>
                            <td>High threshold 1 sample</td>
                            <td>Inactive</td>
                          </tr>
                          <tr>
                            <td>High threshold 2 sample</td>
                            <td>Inactive</td>
                          </tr>
                          <tr>
                            <td>High threshold 3 sample</td>
                            <td>Inactive</td>
                          </tr>
                          <tr>
                            <td>High threshold 4 sample</td>
                            <td>Inactive</td>
                          </tr>
                          <tr>
                            <td>High threshold 5 sample</td>
                            <td>Inactive</td>
                          </tr>
                          <tr>
                            <td>Low threshold 1 mean</td>
                            <td>Inactive</td>
                          </tr>
                          <tr></tr>
                          <tr>
                            <td>Low threshold 2 mean</td>
                            <td>Inactive</td>
                          </tr>
                          <tr>
                            <td>Low threshold 3 mean</td>
                            <td>Inactive</td>
                          </tr>
                          <tr>
                            <td>Low threshold 4 mean</td>
                            <td>Inactive</td>
                          </tr>
                          <tr>
                            <td>Low threshold 5 mean</td>
                            <td>Inactive</td>
                          </tr>
                          <tr>
                            <td>High threshold 1 mean</td>
                            <td>Inactive</td>
                          </tr>
                          <tr>
                            <td>High threshold 2 mean</td>
                            <td>Inactive</td>
                          </tr>
                          <tr>
                            <td>High threshold 3 mean</td>
                            <td>Inactive</td>
                          </tr>
                          <tr>
                            <td>High threshold 4 mean</td>
                            <td>Inactive</td>
                          </tr>
                          <tr>
                            <td>High threshold 5 mean</td>
                            <td>Inactive</td>
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
                  <tbody>
                    <tr>
                      <td>A</td>
                      <td>OK</td>
                    </tr>
                    <tr>
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
                    </tr>
                  </tbody>
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
                    <select className="form-select">
                      {InfoParameters.map((x, y) =>
                        <option value={x.parameterName}>{x.parameterName}</option>
                      )}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <select className="form-select">
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
                <div className="tab-content" id="calibrationTabContent">
                  <div className="tab-pane fade show active" id="sequence1-tab-pane" role="tabpanel" aria-labelledby="sequence1-tab" >
                    <div className="dashboard_row">
                      <div className="col-md-9">
                        <fieldset>
                          <legend>Configuration</legend>
                          <div className="row">
                            <div className="col-md-6">
                            </div>
                            <div className="col-md-6">
                              <div className="row mb-3">
                                <label htmlFor="typeofsequence" className="col-md-4 col-form-label">Type of the sequence</label>
                                <div className="col-md-8">
                                  <select id="typeofsequence" className="form-select">
                                    <option selected>Choose...</option>
                                    <option>...</option>
                                  </select>
                                </div>
                              </div>
                              <div className="row mb-3">
                                <label htmlFor="totaltime" className="col-md-4 col-form-label">1 - Total time</label>
                                <div className="col-md-8">
                                  <select id="totaltime" className="form-select">
                                    <option selected>Choose...</option>
                                    <option>...</option>
                                  </select>
                                </div>
                              </div>
                              <div className="row mb-3">
                                <label htmlFor="risingtime" className="col-md-4 col-form-label">2 - Rising time</label>
                                <div className="col-md-8">
                                  <select id="risingtime" className="form-select">
                                    <option selected>Choose...</option>
                                    <option>...</option>
                                  </select>
                                </div>
                              </div>
                              <div className="row mb-3">
                                <label htmlFor="fallingtime" className="col-md-4 col-form-label">3 - Falling time</label>
                                <div className="col-md-8">
                                  <input type="number" className="form-control" id="fallingtime" />
                                </div>
                              </div>
                              <div className="row mb-3">
                                <label htmlFor="highdrift" className="col-md-4 col-form-label">4 - High Drift</label>
                                <div className="col-md-8">
                                  <input type="number" className="form-control" id="highdrift" />
                                </div>
                              </div>
                              <div className="row mb-3">
                                <label htmlFor="lowdrift" className="col-md-4 col-form-label">5 - Low Drift</label>
                                <div className="col-md-8">
                                  <input type="number" className="form-control" id="lowdrift" />
                                </div>
                              </div>
                              <div className="row mb-3">
                                <label htmlFor="signalvalue" className="col-md-4 col-form-label">6 - Signal value</label>
                                <div className="col-md-8">
                                  <input type="number" className="form-control" id="signalvalue" />
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
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                          </div>
                        </fieldset>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="sequence2-tab-pane" role="tabpanel" aria-labelledby="sequence2-tab" >
                    <div className="dashboard_row">
                      <div className="col-md-9">
                        <fieldset>
                          <legend>Configuration</legend>
                          <div className="row">
                            <div className="col-md-6">
                            </div>
                            <div className="col-md-6">
                              <div className="row mb-3">
                                <label htmlFor="typeofsequence" className="col-md-4 col-form-label">Type of the sequence</label>
                                <div className="col-md-8">
                                  <select id="typeofsequence" className="form-select">
                                    <option selected>Choose...</option>
                                    <option>...</option>
                                  </select>
                                </div>
                              </div>
                              <div className="row mb-3">
                                <label htmlFor="totaltime" className="col-md-4 col-form-label">1 - Total time</label>
                                <div className="col-md-8">
                                  <select id="totaltime" className="form-select">
                                    <option selected>Choose...</option>
                                    <option>...</option>
                                  </select>
                                </div>
                              </div>
                              <div className="row mb-3">
                                <label htmlFor="risingtime" className="col-md-4 col-form-label">2 - Rising time</label>
                                <div className="col-md-8">
                                  <select id="risingtime" className="form-select">
                                    <option selected>Choose...</option>
                                    <option>...</option>
                                  </select>
                                </div>
                              </div>
                              <div className="row mb-3">
                                <label htmlFor="fallingtime" className="col-md-4 col-form-label">3 - Falling time</label>
                                <div className="col-md-8">
                                  <input type="number" className="form-control" id="fallingtime" />
                                </div>
                              </div>
                              <div className="row mb-3">
                                <label htmlFor="highdrift" className="col-md-4 col-form-label">4 - High Drift</label>
                                <div className="col-md-8">
                                  <input type="number" className="form-control" id="highdrift" />
                                </div>
                              </div>
                              <div className="row mb-3">
                                <label htmlFor="lowdrift" className="col-md-4 col-form-label">5 - Low Drift</label>
                                <div className="col-md-8">
                                  <input type="number" className="form-control" id="lowdrift" />
                                </div>
                              </div>
                              <div className="row mb-3">
                                <label htmlFor="signalvalue" className="col-md-4 col-form-label">6 - Signal value</label>
                                <div className="col-md-8">
                                  <input type="number" className="form-control" id="signalvalue" />
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
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                          </div>
                        </fieldset>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="sequence3-tab-pane" role="tabpanel" aria-labelledby="sequence3-tab" >
                    <div className="dashboard_row">
                      <div className="col-md-9">
                        <fieldset>
                          <legend>Configuration</legend>
                          <div className="row">
                            <div className="col-md-6">
                            </div>
                            <div className="col-md-6">
                              <div className="row mb-3">
                                <label htmlFor="typeofsequence" className="col-md-4 col-form-label">Type of the sequence</label>
                                <div className="col-md-8">
                                  <select id="typeofsequence" className="form-select">
                                    <option selected>Choose...</option>
                                    <option>...</option>
                                  </select>
                                </div>
                              </div>
                              <div className="row mb-3">
                                <label htmlFor="totaltime" className="col-md-4 col-form-label">1 - Total time</label>
                                <div className="col-md-8">
                                  <select id="totaltime" className="form-select">
                                    <option selected>Choose...</option>
                                    <option>...</option>
                                  </select>
                                </div>
                              </div>
                              <div className="row mb-3">
                                <label htmlFor="risingtime" className="col-md-4 col-form-label">2 - Rising time</label>
                                <div className="col-md-8">
                                  <select id="risingtime" className="form-select">
                                    <option selected>Choose...</option>
                                    <option>...</option>
                                  </select>
                                </div>
                              </div>
                              <div className="row mb-3">
                                <label htmlFor="fallingtime" className="col-md-4 col-form-label">3 - Falling time</label>
                                <div className="col-md-8">
                                  <input type="number" className="form-control" id="fallingtime" />
                                </div>
                              </div>
                              <div className="row mb-3">
                                <label htmlFor="highdrift" className="col-md-4 col-form-label">4 - High Drift</label>
                                <div className="col-md-8">
                                  <input type="number" className="form-control" id="highdrift" />
                                </div>
                              </div>
                              <div className="row mb-3">
                                <label htmlFor="lowdrift" className="col-md-4 col-form-label">5 - Low Drift</label>
                                <div className="col-md-8">
                                  <input type="number" className="form-control" id="lowdrift" />
                                </div>
                              </div>
                              <div className="row mb-3">
                                <label htmlFor="signalvalue" className="col-md-4 col-form-label">6 - Signal value</label>
                                <div className="col-md-8">
                                  <input type="number" className="form-control" id="signalvalue" />
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
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                          </div>
                        </fieldset>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="sequence4-tab-pane" role="tabpanel" aria-labelledby="sequence4-tab" >
                    <div className="dashboard_row">
                      <div className="col-md-9">
                        <fieldset>
                          <legend>Configuration</legend>
                          <div className="row">
                            <div className="col-md-6">
                            </div>
                            <div className="col-md-6">
                              <div className="row mb-3">
                                <label htmlFor="typeofsequence" className="col-md-4 col-form-label">Type of the sequence</label>
                                <div className="col-md-8">
                                  <select id="typeofsequence" className="form-select">
                                    <option selected>Choose...</option>
                                    <option>...</option>
                                  </select>
                                </div>
                              </div>
                              <div className="row mb-3">
                                <label htmlFor="totaltime" className="col-md-4 col-form-label">1 - Total time</label>
                                <div className="col-md-8">
                                  <select id="totaltime" className="form-select">
                                    <option selected>Choose...</option>
                                    <option>...</option>
                                  </select>
                                </div>
                              </div>
                              <div className="row mb-3">
                                <label htmlFor="risingtime" className="col-md-4 col-form-label">2 - Rising time</label>
                                <div className="col-md-8">
                                  <select id="risingtime" className="form-select">
                                    <option selected>Choose...</option>
                                    <option>...</option>
                                  </select>
                                </div>
                              </div>
                              <div className="row mb-3">
                                <label htmlFor="fallingtime" className="col-md-4 col-form-label">3 - Falling time</label>
                                <div className="col-md-8">
                                  <input type="number" className="form-control" id="fallingtime" />
                                </div>
                              </div>
                              <div className="row mb-3">
                                <label htmlFor="highdrift" className="col-md-4 col-form-label">4 - High Drift</label>
                                <div className="col-md-8">
                                  <input type="number" className="form-control" id="highdrift" />
                                </div>
                              </div>
                              <div className="row mb-3">
                                <label htmlFor="lowdrift" className="col-md-4 col-form-label">5 - Low Drift</label>
                                <div className="col-md-8">
                                  <input type="number" className="form-control" id="lowdrift" />
                                </div>
                              </div>
                              <div className="row mb-3">
                                <label htmlFor="signalvalue" className="col-md-4 col-form-label">6 - Signal value</label>
                                <div className="col-md-8">
                                  <input type="number" className="form-control" id="signalvalue" />
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
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                          </div>
                        </fieldset>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="sequence5-tab-pane" role="tabpanel" aria-labelledby="sequence5-tab" >
                    <div className="dashboard_row">
                      <div className="col-md-9">
                        <fieldset>
                          <legend>Configuration</legend>
                          <div className="row">
                            <div className="col-md-6">
                            </div>
                            <div className="col-md-6">
                              <div className="row mb-3">
                                <label htmlFor="typeofsequence" className="col-md-4 col-form-label">Type of the sequence</label>
                                <div className="col-md-8">
                                  <select id="typeofsequence" className="form-select">
                                    <option selected>Choose...</option>
                                    <option>...</option>
                                  </select>
                                </div>
                              </div>
                              <div className="row mb-3">
                                <label htmlFor="totaltime" className="col-md-4 col-form-label">1 - Total time</label>
                                <div className="col-md-8">
                                  <select id="totaltime" className="form-select">
                                    <option selected>Choose...</option>
                                    <option>...</option>
                                  </select>
                                </div>
                              </div>
                              <div className="row mb-3">
                                <label htmlFor="risingtime" className="col-md-4 col-form-label">2 - Rising time</label>
                                <div className="col-md-8">
                                  <select id="risingtime" className="form-select">
                                    <option selected>Choose...</option>
                                    <option>...</option>
                                  </select>
                                </div>
                              </div>
                              <div className="row mb-3">
                                <label htmlFor="fallingtime" className="col-md-4 col-form-label">3 - Falling time</label>
                                <div className="col-md-8">
                                  <select id="fallingtime" className="form-select">
                                    <option selected>Choose...</option>
                                    <option>...</option>
                                  </select>
                                </div>
                              </div>
                              <div className="row mb-3">
                                <label htmlFor="highdrift" className="col-md-4 col-form-label">4 - High Drift</label>
                                <div className="col-md-8">
                                  <input type="number" className="form-control" id="highdrift" />
                                </div>
                              </div>
                              <div className="row mb-3">
                                <label htmlFor="lowdrift" className="col-md-4 col-form-label">5 - Low Drift</label>
                                <div className="col-md-8">
                                  <input type="number" className="form-control" id="lowdrift" />
                                </div>
                              </div>
                              <div className="row mb-3">
                                <label htmlFor="signalvalue" className="col-md-4 col-form-label">6 - Signal value</label>
                                <div className="col-md-8">
                                  <input type="number" className="form-control" id="signalvalue" />
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
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                            <div className="col-md-12 mb-2">
                              <select className="form-select">
                                <option selected>Nothing</option>
                                <option>...</option>
                              </select>
                            </div>
                          </div>
                        </fieldset>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Ok</button>
            </div>
          </div>
        </div>
      </div>
      <div className="pagetitle d-flex justify-content-between">
        <h1>Dashboard</h1>
        <div className="col-md-3 mb-3 d-inline-flex">
          <label for="Interval" className="form-label me-3">Date & Time:</label>
          <span>  {currentdatetime} </span>
          {/* <select className="form-select" id="Interval" ref={Interval} >
            <option value="15000">15 Seconds</option>
            <option value="30000">30 Seconds</option>
            <option value="60000">1 Minute</option>
          </select> */}
        </div>
        {/* <nav>
    <ol className="breadcrumb">
      <li className="breadcrumb-item"><a href="index.html">Home</a></li>
      <li className="breadcrumb-item active">Dashboard</li>
    </ol>
  </nav> */}
      </div>

      <section className="section dashboard">
        {ListAllData && (
          <div className="row">

            <div className="col-lg-12">
              <div className="row" style={{ display: "none" }}>

                <div className="col-xxl-4 col-md-4">
                  <div className="card info-card sales-card">

                    {/*  <div className="filter">
              <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></a>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                <li className="dropdown-header text-start">
                  <h6>Filter</h6>
                </li>

                <li><a className="dropdown-item" href="#">Today</a></li>
                <li><a className="dropdown-item" href="#">This Month</a></li>
                <li><a className="dropdown-item" href="#">This Year</a></li>
              </ul>
            </div> */}

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
                    {/* 
            <div className="filter">
              <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></a>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                <li className="dropdown-header text-start">
                  <h6>Filter</h6>
                </li>

                <li><a className="dropdown-item" href="#">Today</a></li>
                <li><a className="dropdown-item" href="#">This Month</a></li>
                <li><a className="dropdown-item" href="#">This Year</a></li>
              </ul>
            </div> */}

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

                    {/*     <div className="filter">
              <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></a>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                <li className="dropdown-header text-start">
                  <h6>Filter</h6>
                </li>

                <li><a className="dropdown-item" href="#">Today</a></li>
                <li><a className="dropdown-item" href="#">This Month</a></li>
                <li><a className="dropdown-item" href="#">This Year</a></li>
              </ul>
            </div> */}

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

                {/*  <div className="col-12">
          <div className="card">

            <div className="filter">
              <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></a>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                <li className="dropdown-header text-start">
                  <h6>Filter</h6>
                </li>

                <li><a className="dropdown-item" href="#">Today</a></li>
                <li><a className="dropdown-item" href="#">This Month</a></li>
                <li><a className="dropdown-item" href="#">This Year</a></li>
              </ul>
            </div>

            <div className="card-body">
              <h5 className="card-title">Reports <span>/Today</span></h5>
              <div id="reportsChart"></div>
            </div>

          </div>
        </div>

        <div className="col-12">
          <div className="card recent-sales overflow-auto">

            <div className="filter">
              <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></a>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                <li className="dropdown-header text-start">
                  <h6>Filter</h6>
                </li>

                <li><a className="dropdown-item" href="#">Today</a></li>
                <li><a className="dropdown-item" href="#">This Month</a></li>
                <li><a className="dropdown-item" href="#">This Year</a></li>
              </ul>
            </div>

            <div className="card-body">
              <h5 className="card-title">Recent Sales <span>| Today</span></h5>

              <table className="table table-borderless datatable">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Customer</th>
                    <th scope="col">Product</th>
                    <th scope="col">Price</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row"><a href="#">#2457</a></th>
                    <td>Brandon Jacob</td>
                    <td><a href="#" className="text-primary">At praesentium minu</a></td>
                    <td>$64</td>
                    <td><span className="badge bg-success">Approved</span></td>
                  </tr>
                  <tr>
                    <th scope="row"><a href="#">#2147</a></th>
                    <td>Bridie Kessler</td>
                    <td><a href="#" className="text-primary">Blanditiis dolor omnis similique</a></td>
                    <td>$47</td>
                    <td><span className="badge bg-warning">Pending</span></td>
                  </tr>
                  <tr>
                    <th scope="row"><a href="#">#2049</a></th>
                    <td>Ashleigh Langosh</td>
                    <td><a href="#" className="text-primary">At recusandae consectetur</a></td>
                    <td>$147</td>
                    <td><span className="badge bg-success">Approved</span></td>
                  </tr>
                  <tr>
                    <th scope="row"><a href="#">#2644</a></th>
                    <td>Angus Grady</td>
                    <td><a href="#" className="text-primar">Ut voluptatem id earum et</a></td>
                    <td>$67</td>
                    <td><span className="badge bg-danger">Rejected</span></td>
                  </tr>
                  <tr>
                    <th scope="row"><a href="#">#2644</a></th>
                    <td>Raheem Lehner</td>
                    <td><a href="#" className="text-primary">Sunt similique distinctio</a></td>
                    <td>$165</td>
                    <td><span className="badge bg-success">Approved</span></td>
                  </tr>
                </tbody>
              </table>

            </div>

          </div>
        </div>

        <div className="col-12">
          <div className="card top-selling overflow-auto">

            <div className="filter">
              <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></a>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                <li className="dropdown-header text-start">
                  <h6>Filter</h6>
                </li>

                <li><a className="dropdown-item" href="#">Today</a></li>
                <li><a className="dropdown-item" href="#">This Month</a></li>
                <li><a className="dropdown-item" href="#">This Year</a></li>
              </ul>
            </div>

            <div className="card-body pb-0">
              <h5 className="card-title">Top Selling <span>| Today</span></h5>

              <table className="table table-borderless">
                <thead>
                  <tr>
                    <th scope="col">Preview</th>
                    <th scope="col">Product</th>
                    <th scope="col">Price</th>
                    <th scope="col">Sold</th>
                    <th scope="col">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row"><a href="#"><img src="assets/img/product-1.jpg" alt=""/></a></th>
                    <td><a href="#" className="text-primary fw-bold">Ut inventore ipsa voluptas nulla</a></td>
                    <td>$64</td>
                    <td className="fw-bold">124</td>
                    <td>$5,828</td>
                  </tr>
                  <tr>
                    <th scope="row"><a href="#"><img src="assets/img/product-2.jpg" alt=""/></a></th>
                    <td><a href="#" className="text-primary fw-bold">Exercitationem similique doloremque</a></td>
                    <td>$46</td>
                    <td className="fw-bold">98</td>
                    <td>$4,508</td>
                  </tr>
                  <tr>
                    <th scope="row"><a href="#"><img src="assets/img/product-3.jpg" alt=""/></a></th>
                    <td><a href="#" className="text-primary fw-bold">Doloribus nisi exercitationem</a></td>
                    <td>$59</td>
                    <td className="fw-bold">74</td>
                    <td>$4,366</td>
                  </tr>
                  <tr>
                    <th scope="row"><a href="#"><img src="assets/img/product-4.jpg" alt=""/></a></th>
                    <td><a href="#" className="text-primary fw-bold">Officiis quaerat sint rerum error</a></td>
                    <td>$32</td>
                    <td className="fw-bold">63</td>
                    <td>$2,016</td>
                  </tr>
                  <tr>
                    <th scope="row"><a href="#"><img src="assets/img/product-5.jpg" alt=""/></a></th>
                    <td><a href="#" className="text-primary fw-bold">Sit unde debitis delectus repellendus</a></td>
                    <td>$79</td>
                    <td className="fw-bold">41</td>
                    <td>$3,239</td>
                  </tr>
                </tbody>
              </table>

            </div>

          </div>
        </div> */}

              </div>

              <div className="dashboard_row">
                {ListAllData.listDevices.map((x, y) =>

                  <div className="dashboard_col">
                    <div className="card info-card revenue-card">
                      <div className="card-body ">
                        <div className="d-flex justify-content-between">
                          <div className="icons"><i className="bi bi-sliders2-vertical"></i></div>
                          <div className="device">{x.deviceName}</div>
                          <div className="icons" title="Info" onClick={() => Deviceinfo(x)}><i className="bi bi-info-circle"></i></div>
                        </div>
                        <div className="d-flex justify-content-start mt-2">
                          <div className="icons" title="Service Mode"> <i class="bi bi-modem"></i>&nbsp;</div>
                          <div className="icons" title="Calibration" onClick={() => Devicecalibration(x)}><i class="bi bi-gear"></i>&nbsp;</div>
                          <div className="icons" title="Alarm" onClick={() => Devicealarm(x)}><i class="bi bi-alarm"></i>&nbsp; </div>
              
                       {/*      <div className="icons blink" title="Alert" onClick={() => Devicealert(x)}><i className="bi bi-lightbulb-fill"></i>&nbsp; </div>
           */}
                            <div className="icons"><i className="bi bi-lightbulb"></i></div>
                        </div>
                        {ListAllData.listPollutents.map((i, j) =>
                          i.deviceID == x.id && (
                            <div className="d-flex justify-content-between mt-2">
                              <div className="parameter"><i className="bi bi-check2"></i> <span>{i.parameterName}</span></div>
                              <div className="values"><button className="btn1" onClick={Codesinformation} >{ListAllData.listParametervalues.filter(z => z.parameterID === i.id && z.deviceID === i.deviceID).length > 0 ? ListAllData.listParametervalues.filter(z => z.parameterID === i.id && z.deviceID === i.deviceID)[0].loggerFlags : "A"}</button>
                                <button className="btn2">{ListAllData.listParametervalues.filter(z => z.parameterID === i.id && z.deviceID === i.deviceID).length > 0 ? ListAllData.listParametervalues.filter(z => z.parameterID === i.id && z.deviceID === i.deviceID)[0].parametervalue : 0}</button>&nbsp;<sub>{ListAllData.listReportedUnits.filter(x => x.id === i.unitID).length > 0 ? ListAllData.listReportedUnits.filter(x => x.id === i.unitID)[0].unitName.toLowerCase() : ""}</sub></div>
                              {LiveChartStatus[j].ChartStatus && (
                                <div className="icons" title="Graph" onClick={() => DeviceGraphold(x, i)}><i className="bi bi-graph-up"></i></div>
                              )}
                              {!LiveChartStatus[j].ChartStatus && (
                                <div className="icons" title="Graph" onClick={() => DeviceGraphold(x, i)}><i className="bi bi-alt"></i></div>
                              )}
                            </div>
                          )
                        )}
                      </div>

                    </div>
                  </div>

                )}
              </div>
              <div className="row">
                <div className="col-md-11">
                  <Line ref={chartRef} options={ChartOptions} data={ChartData} height={100} />
                </div>
                <div className="col-md-1 mt-5">
                {ListAllData.listPollutents.map((i, j) =>
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" value={i.id} defaultChecked={LiveChartStatus[j].ChartStatus}  onChange={() => DeviceGraph(i)}/>
                      <label class="form-check-label" htmlFor="flexCheckDefault">
                      {i.parameterName}
                      </label>
                  </div>
                )}
                </div>
              </div>

            </div>

            {/* 
    <div className="col-lg-4">
      <div className="card">
        <div className="filter">
          <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></a>
          <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
            <li className="dropdown-header text-start">
              <h6>Filter</h6>
            </li>

            <li><a className="dropdown-item" href="#">Today</a></li>
            <li><a className="dropdown-item" href="#">This Month</a></li>
            <li><a className="dropdown-item" href="#">This Year</a></li>
          </ul>
        </div>

        <div className="card-body">
          <h5 className="card-title">Recent Activity <span>| Today</span></h5>

          <div className="activity">

            <div className="activity-item d-flex">
              <div className="activite-label">32 min</div>
              <i className='bi bi-circle-fill activity-badge text-success align-self-start'></i>
              <div className="activity-content">
                Quia quae rerum <a href="#" className="fw-bold text-dark">explicabo officiis</a> beatae
              </div>
            </div>
            <div className="activity-item d-flex">
              <div className="activite-label">56 min</div>
              <i className='bi bi-circle-fill activity-badge text-danger align-self-start'></i>
              <div className="activity-content">
                Voluptatem blanditiis blanditiis eveniet
              </div>
            </div>

            <div className="activity-item d-flex">
              <div className="activite-label">2 hrs</div>
              <i className='bi bi-circle-fill activity-badge text-primary align-self-start'></i>
              <div className="activity-content">
                Voluptates corrupti molestias voluptatem
              </div>
            </div>

            <div className="activity-item d-flex">
              <div className="activite-label">1 day</div>
              <i className='bi bi-circle-fill activity-badge text-info align-self-start'></i>
              <div className="activity-content">
                Tempore autem saepe <a href="#" className="fw-bold text-dark">occaecati voluptatem</a> tempore
              </div>
            </div>

            <div className="activity-item d-flex">
              <div className="activite-label">2 days</div>
              <i className='bi bi-circle-fill activity-badge text-warning align-self-start'></i>
              <div className="activity-content">
                Est sit eum reiciendis exercitationem
              </div>
            </div>

            <div className="activity-item d-flex">
              <div className="activite-label">4 weeks</div>
              <i className='bi bi-circle-fill activity-badge text-muted align-self-start'></i>
              <div className="activity-content">
                Dicta dolorem harum nulla eius. Ut quidem quidem sit quas
              </div>
            </div>

          </div>

        </div>
      </div>

      <div className="card">
        <div className="filter">
          <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></a>
          <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
            <li className="dropdown-header text-start">
              <h6>Filter</h6>
            </li>

            <li><a className="dropdown-item" href="#">Today</a></li>
            <li><a className="dropdown-item" href="#">This Month</a></li>
            <li><a className="dropdown-item" href="#">This Year</a></li>
          </ul>
        </div>

        <div className="card-body pb-0">
          <h5 className="card-title">Budget Report <span>| This Month</span></h5>

          <div id="budgetChart"  className="echart"></div>

        </div>
      </div>
      <div className="card">
        <div className="filter">
          <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></a>
          <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
            <li className="dropdown-header text-start">
              <h6>Filter</h6>
            </li>

            <li><a className="dropdown-item" href="#">Today</a></li>
            <li><a className="dropdown-item" href="#">This Month</a></li>
            <li><a className="dropdown-item" href="#">This Year</a></li>
          </ul>
        </div>

        <div className="card-body pb-0">
          <h5 className="card-title">Website Traffic <span>| Today</span></h5>

          <div id="trafficChart"  className="echart"></div>


        </div>
      </div>

      <div className="card">
        <div className="filter">
          <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></a>
          <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
            <li className="dropdown-header text-start">
              <h6>Filter</h6>
            </li>

            <li><a className="dropdown-item" href="#">Today</a></li>
            <li><a className="dropdown-item" href="#">This Month</a></li>
            <li><a className="dropdown-item" href="#">This Year</a></li>
          </ul>
        </div>

        <div className="card-body pb-0">
          <h5 className="card-title">News &amp; Updates <span>| Today</span></h5>

          <div className="news">
            <div className="post-item clearfix">
              <img src="assets/img/news-1.jpg" alt="" />
              <h4><a href="#">Nihil blanditiis at in nihil autem</a></h4>
              <p>Sit recusandae non aspernatur laboriosam. Quia enim eligendi sed ut harum...</p>
            </div>

            <div className="post-item clearfix">
              <img src="assets/img/news-2.jpg" alt="" />
              <h4><a href="#">Quidem autem et impedit</a></h4>
              <p>Illo nemo neque maiores vitae officiis cum eum turos elan dries werona nande...</p>
            </div>

            <div className="post-item clearfix">
              <img src="assets/img/news-3.jpg" alt="" />
              <h4><a href="#">Id quia et et ut maxime similique occaecati ut</a></h4>
              <p>Fugiat voluptas vero eaque accusantium eos. Consequuntur sed ipsam et totam...</p>
            </div>

            <div className="post-item clearfix">
              <img src="assets/img/news-4.jpg" alt="" />
              <h4><a href="#">Laborum corporis quo dara net para</a></h4>
              <p>Qui enim quia optio. Eligendi aut asperiores enim repellendusvel rerum cuder...</p>
            </div>

            <div className="post-item clearfix">
              <img src="assets/img/news-5.jpg" alt="" />
              <h4><a href="#">Et dolores corrupti quae illo quod dolor</a></h4>
              <p>Odit ut eveniet modi reiciendis. Atque cupiditate libero beatae dignissimos eius...</p>
            </div>

          </div>

        </div>
      </div>

    </div> */}

          </div>
        )}
      </section>

    </main>
  );
}
export default Dashboard;