import React, { useCallback, useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import { Line } from 'react-chartjs-2';
import 'chartjs-plugin-dragdata'
import jspreadsheet from "jspreadsheet-ce";
import "jspreadsheet-ce/dist/jspreadsheet.css";
import CommonFunctions from "../utils/CommonFunctions";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
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

function LiveData() {
  const $ = window.jQuery;
  const chartRef = useRef();
  const jspreadRef = useRef(null);
  const [selectedStations, setselectedStations] = useState([]);
  const [ListReportData, setListReportData] = useState([]);
  const [AllLookpdata, setAllLookpdata] = useState(null);
  const [Stations, setStations] = useState([]);
  const [Pollutents, setPollutents] = useState([]);
  const [selectedgrid, setselectedgrid] = useState([]);
  const [SelectedPollutents, setSelectedPollutents] = useState([]);
  const [Criteria, setcriteria] = useState([]);
  const [dataForGridcopy, setdataForGridcopy] = useState([]);
  const [ChartData, setChartData] = useState({ labels: [], datasets: [] });
  const [ChartOptions, setChartOptions] = useState();
  const [ListHistory, setListHistory] = useState([]);
  const [SelectedCells, setSelectedCells] = useState([]);
  const [Flagcodelist,SetFlagcodelist]=useState([]);
  const [revert, setrevert] = useState(false);
  const revertRef = useRef();
  revertRef.current = revert;
  let jsptable = null;
  var lastSelectedRow;
  let cellnames = [];
  var dataForGrid = [];

  const colorArray = ["#96cdf5", "#fbaec1", "#00ff00", "#800000", "#808000", "#008000", "#008080", "#000080", "#FF00FF", "#800080",
    "#CD5C5C", "#FF5733 ", "#1ABC9C", "#F8C471", "#196F3D", "#707B7C", "#9A7D0A", "#B03A2E", "#F8C471", "#7E5109"];

  useEffect(() => {
    fetch(process.env.REACT_APP_WSurl + "api/AirQuality/GetAllLookupData")
      .then((response) => response.json())
      .then((data) => {
        setAllLookpdata(data);
        setStations(data.listStations);
        SetFlagcodelist(data.listFlagCodes);
        setTimeout(function () {
          $('#stationid').SumoSelect({
            triggerChangeCombined: true, placeholder: 'Select Station', floatWidth: 200, selectAll: true,
            search: true
          });
        }, 100);
        
      })
      .catch((error) => console.log(error));
  }, []);
  useEffect(() => {
    if (jsptable) {
      jsptable.refresh();
    }
    initializeJsGrid();
  }, [ListReportData]);

  const selectionActive = function (a, startcolindex, stratrowindex, endcolindex, endrowidex) { //a-enire value,b-1stcolumn index, c-start row index, d-last column index
    var data = jsptable.getData(true);
    var data1 = jsptable.getSelectedRows(true);
    setselectedgrid([startcolindex, stratrowindex])
    setdataForGridcopy(dataForGrid)
    let cellnames1 = [];
    for (var i = stratrowindex; i <= endrowidex; i++) {
      for (var k = startcolindex; k <= endcolindex; k++) {
        var cellName1 = jspreadsheet.helpers.getColumnNameFromCoords(k, i);
        cellnames1.push(cellName1);
      }
    }
    for (var p = 0; p < cellnames.length; p++) {
      let index = cellnames1.indexOf(cellnames[p]);
      if (index == -1) {
        jsptable.getCell(cellnames[p]).classList.remove('cellhelight');
      }
    }


    cellnames = [];
    for (var i = stratrowindex; i <= endrowidex; i++) {
      for (var k = startcolindex; k <= endcolindex; k++) {
        var cellName = jspreadsheet.helpers.getColumnNameFromCoords(k, i);
        cellnames.push(cellName);
        if (cellName) {
          jsptable.getCell(cellName).classList.add('cellhelight');
        }
      }
    }

    // let finalarr = [];
    // for (let j = data1[0]; j <= data1[(data1.length - 1)]; j++) {
    //   finalarr.push(dataForGrid[j]);
    // }
    // let key = Object.keys(finalarr[0]);
    // let chart = chartRef.current;
    // let chartdata = chart != null ? chart.data : [];
    // for (let j = 0; j < SelectedPollutents.length; j++) {
    //   chartdata.datasets[j].pointRadius = chartdata.datasets[j].pointRadius.map(function (x) { x = 2; return x });
    // }
    // for (let k = startcolindex; k <= endcolindex; k++) {
    //   for (var i = 0; i < chartdata.datasets[k - 1].data.length; i++) {
    //     const index = finalarr.findIndex(data => data.Date == chartdata.labels[i]);
    //     if (index > -1) {
    //       chartdata.datasets[k - 1].pointRadius[i] = 10;
    //     } else {
    //       chartdata.datasets[k - 1].pointRadius[i] = 2;
    //     }
    //   }
    // }
    // chart.update();
  }
 
  const loadtable = function (instance) {
    for (let i = 0; i < SelectedPollutents.length; i++) {
      let filnallist = ListReportData.filter(x => x.parameterID === SelectedPollutents[i].id);
      for (let j = 0; j < filnallist.length; j++) {
        let index = dataForGrid.findIndex(y => y.Date === filnallist[j].interval);
        if (index > -1) {
          let cell = instance.jexcel.getCellFromCoords(i+ 1, index);
          if(filnallist[j].flagStatus!=null){
            let classname=CommonFunctions.SetFlagColor(filnallist[j].flagStatus,Flagcodelist);
            if(cell!= undefined){
              cell.style.backgroundColor=classname;
              //cell.classList.add(classname);
            }
          }
        }
      }
    }
  }

  const gethistory = function () {
    let changearr = dataForGridcopy[selectedgrid[1]];
    let filtered = ListReportData.filter(row => row.interval === changearr["Date"] && row.parameterName == SelectedPollutents[selectedgrid[0] - 1]);
    let params = new URLSearchParams({ id: filtered[0].id });

    fetch(process.env.REACT_APP_WSurl + 'api/DataProcessing?' + params, {
      method: 'GET',
    }).then((response) => response.json())
      .then((historydata) => {
        if (historydata) {
          setListHistory(historydata);
        }
      }).catch((error) => toast.error('Unable to update the parameter. Please contact adminstrator'));
    $('#historymodal').modal('show');
  }

  const generateDatabaseDateTime = function (date) {
    return date.replace("T", " ").substring(0, 19);
  }
  /* reported data start */
  const initializeJsGrid = function () {
    dataForGrid = [];
    var layout = [];
    layout.push({ name: "Date", title: "Date", type: "text", readOnly: true });
    
    
      for (var i = 0; i < SelectedPollutents.length; i++) {
        let paramName = ListReportData.filter(obj => obj.parameterID == SelectedPollutents[i].id);
        if(paramName.length>0){
          layout.push({ name: SelectedPollutents[i].parameterName, title: SelectedPollutents[i].parameterName + " - ppb", type: "numeric", readOnly: true });
        }
      }
    
    //  layout.push({ type: "control", width: 100, editButton: false, deleteButton: false });
    for (var k = 0; k < ListReportData.length; k++) {
      var obj = {};
      var temp = dataForGrid.findIndex(x => x.Date === ListReportData[k].interval);
      let paramName = SelectedPollutents.filter(obj => obj.id == ListReportData[k].parameterID);
      if (temp >= 0) {
        dataForGrid[temp][paramName[0].parameterName] = ListReportData[k].parametervalue;
      } else {
        obj["Date"] = ListReportData[k].interval;
        obj[paramName[0].parameterName] = ListReportData[k].parametervalue;
        dataForGrid.push(obj);
      }
    }
    jsptable = jspreadsheet(jspreadRef.current, {
      data: dataForGrid,
      rowResize: true,
      tableOverflow: true,
      columns: layout,
      onselection: selectionActive,
      onload: loadtable,
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
    setListReportData([]);
    document.getElementById('loader').style.display = "block";
    console.log(new Date());
    
    let Station = $("#stationid").val();
    if (Station.length > 0) {
      Station.join(',')
    }
    
    let Interval = document.getElementById("criteriaid").value;
    let valid = ReportValidations(Station);
    if (!valid) {
      return false;
    }
    let params = new URLSearchParams({ Station: Station, Interval: Interval });
    let url = process.env.REACT_APP_WSurl + "api/AirQuality/LiveData?"
    fetch(url + params, {
      method: 'GET',
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
            let data1 = data.map((x) => { x.interval = x.interval.replace('T', ' '); return x; });
            setListReportData(data1);
            getchartdata(data1, "line", "Raw");
        }
        document.getElementById('loader').style.display = "none";
      }).catch((error) => console.log(error));
  }

  const DownloadExcel = function () {
    let Station = $("#stationid").val();
    if (Station.length > 0) {
      Station.join(',')
    }

    let Interval = document.getElementById("criteriaid").value;
    let valid = ReportValidations(Station);
    if (!valid) {
      return false;
    }
    let params = new URLSearchParams({ Station: Station, Interval: Interval });
    window.open(process.env.REACT_APP_WSurl + "api/AirQuality/ExportToExcel?" + params, "_blank");
  }

  const ReportValidations = function (Station) {
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
    } 
    return isvalid;
  }
  /* reported data end */
  const GetInterval = function () {
    setcriteria([]);
    let stationID =  $("#stationid").val();
    let finaldata = AllLookpdata.listPollutents.filter(obj => obj.stationID == stationID);
    if (finaldata.length > 0) {
      let finalinterval = [];
      let intervalarr = finaldata[0].avgInterval.split(',');
      for (let i = 0; i < intervalarr.length; i++) {
        let intervalsplitarr = intervalarr[i].split('-');
        finalinterval.push({ value: intervalsplitarr[0], type: intervalsplitarr[1] })
      }
      // let finalinterval1 = finalinterval.reduce((unique, o) => {
      //   if (!unique.some(obj => obj.value != o.value && obj.type === o.type)) {
      //     unique.push(o);
      //   }
      //   return unique;
      // }, []);
      setcriteria(finalinterval);
    }
  }
  
  $('#stationid').change(function (event) {
   
    let filter = $(this).val();
    setselectedStations(filter);
    let Pollutent = AllLookpdata.listPollutents.filter(function (item) {
      for (var i = 0; i < filter.length; i++) {
        if (item['stationID'] == filter[i])
          return true;
      }
    });
    
    setSelectedPollutents(Pollutent);
    GetInterval(); 
    
  })
  
  const Resetfilters = function () {
   
    $('.stationid')[0].sumo.reload();
    $('.stationid')[0].sumo.unSelectAll();
    setcriteria([]);
    
    setListReportData([]);
    
  }
  
  

  const getchartdata = function (data, charttype, criteria) {
    if (chartRef.current != null) {
      chartRef.current.data = {};
    }
    
    setChartData({ labels: [], datasets: [] });
    setChartOptions();
    let datasets = [];
    let chartdata = [];
    let labels = [];
    let pointRadius = [];
    let xAxislabel = [];
    for (let i = 0; i < SelectedPollutents.length; i++) {
      chartdata = [];
      pointRadius = [];
      let parameterlabel="";
      let pollutentdata = data.filter(val => val.parameterID == SelectedPollutents[i].id);
      if(pollutentdata.length>0){
        for (let k = 0; k < pollutentdata.length; k++) {
          parameterlabel=pollutentdata[k].parameterName;
          let index = labels.indexOf(pollutentdata[k].interval);
          if (index == -1) {
            labels.push(pollutentdata[k].interval)
          }
          chartdata.push(pollutentdata[k].parametervalue)
          pointRadius.push(2);
        }
        datasets.push({ label: parameterlabel, data: chartdata, borderColor: colorArray[i], backgroundColor: hexToRgbA(colorArray[i]), pointRadius: pointRadius, spanGaps: false, })
      }
      
    }
    setChartOptions({
      responsive: true,
      dragData: true,
      onDragStart: function (e) {
        console.log(e)
      },
      onDrag: function (e, datasetIndex, index, value) {
        console.log(datasetIndex, index, value)
      },
      
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
      <div className="modal fade zoom dashboard_dmodal" id="historymodal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">Parameter History</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="table-responsive">
                <table className="table align-middle table-bordered">
                  <thead>
                    <tr className="header_active">
                      <th>Parameter Name</th>
                      <th>Old Value </th>
                      <th>New Value</th>
                      <th>Modified By</th>
                      <th>Modified On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ListHistory && (
                      ListHistory.map((x, y) =>
                        <tr className="body_active">
                          <td>{AllLookpdata.listPollutents.filter(z => z.id == x.parameterID)[0].parameterName}</td>
                          <td>{x.parameterValueOld}</td>
                          <td>{x.parameterValueNew}</td>
                          <td>{x.modifiedBy}</td>
                          <td>{x.modifiedOn != null ? generateDatabaseDateTime(x.modifiedOn) : x.modifiedOn}</td>
                        </tr>
                      )
                    )}
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
      <section>
        <div>
          <div>
            <div className="row">
              <div className="col-md-2">
                <label className="form-label">Station Name</label>
                <select className="form-select stationid" id="stationid" multiple="multiple">

                  {Stations.map((x, y) =>
                    <option value={x.id} key={y} >{x.stationName}</option>
                  )}
                </select>
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
                    <button type="button" className="btn btn-primary" title="History" onClick={gethistory}><i class="bi bi-clock-history"></i></button>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 mb-3">
                    {AllLookpdata.listFlagCodes.map((i) =>
                      <button type="button" className="btn btn-primary flag mx-1" style={{ backgroundColor: i.colorCode }} data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title={i.name}>{i.code}</button>
                    )}                    
                  </div>
                </div>
                <div className="jsGrid" ref={jspreadRef} />
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
export default LiveData;