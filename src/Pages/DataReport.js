import React, { useCallback, useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import DatePicker from "react-datepicker";
function DataReport() {
  const $ = window.jQuery;
  const gridRefjsgridreport = useRef();
  const [selectedStations, setselectedStations] = useState([]);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [ListReportData, setListReportData] = useState([]);
  const [SelectedPollutents, setSelectedPollutents] = useState([]);
  const [AllLookpdata, setAllLookpdata] = useState(null);
  const [Stations, setStations] = useState([]);
  const [Pollutents, setPollutents] = useState([]);
  const [Criteria, setcriteria] = useState([]);

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
  /* reported data start */

  const UpdateColPos=function (cols) {
    var left = $('.jsgrid-grid-body').scrollLeft() < $('.jsgrid-grid-body .jsgrid-table').width() - $('.jsgrid-grid-body').width() + 16
        ? $('.jsgrid-grid-body').scrollLeft() : $('.jsgrid-grid-body .jsgrid-table').width() - $('.jsgrid-grid-body').width() + 16;
    $('.jsgrid-header-row th:nth-child(-n+' + cols + '), .jsgrid-filter-row td:nth-child(-n+' + cols + '), .jsgrid-insert-row td:nth-child(-n+' + cols + '), .jsgrid-grid-body tr td:nth-child(-n+' + cols + ')')
        .css({
            "position": "relative",
            "left": left
        });
  }
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
            obj[ListReportData[k].parameterName] = ListReportData[k].parametervalue;
            obj["Date"] = ListReportData[k].interval;
            dataForGrid.push(obj);
        }
    }

    window.jQuery(gridRefjsgridreport.current).jsGrid({
      width: "100%",
      height: "400px",
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
          $(".jsgrid-filter-row input:text").addClass("form-control").addClass("form-control-sm");
          $(".jsgrid-filter-row select").addClass("custom-select").addClass("custom-select-sm");
          return $.grep(this.data, function (item) {
            return ((!filter.parameterName || item.parameterName.toUpperCase().indexOf(filter.parameterName.toUpperCase()) >= 0)
              && (!filter.parametervalue || item.parametervalue.toUpperCase().indexOf(filter.parametervalue.toUpperCase()) >= 0)
              && (!filter.stationID || item.stationID === filter.stationID)
              && (!filter.type || item.type.toUpperCase().indexOf(filter.type.toUpperCase()) >= 0)
              && (!filter.interval || item.interval.toUpperCase().indexOf(filter.interval.toUpperCase()) >= 0)
            );
          });
        }
      },
      fields: layout
      /* fields: [
        { name: "stationID", title: "Station Name", type: "select", items: Stations, valueField: "id", textField: "stationName", width: 200 },
        { name: "interval", title: "Date", type: "text" },
        { name: "parameterName", title: "Parameter Name", type: "text" },
        { name: "parametervalue", title: "Value", type: "text", },
        { name: "type", title: "Interval", type: "text" },
        { type: "control", width: 100, editButton: false, deleteButton: false },
      ] */
    });
    $('.jsgrid-grid-body').scroll(function () {
      UpdateColPos(1);
    });
  }
  const getdtareport = function () {
    console.log(new Date());
    document.getElementById('loader').style.display = "block";
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
          let data1 = data.map((x) => { x.interval = x.interval.replace('T', ' '); return x; });
          setListReportData(data1);
        }
        document.getElementById('loader').style.display = "none";
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
    if (filter.length >= 2) {
      finaldata1 = finaldata.reduce((unique, o) => {
        if (!unique.some(obj => obj.stationID != o.stationID && obj.pollutentName === o.pollutentName)) {
          unique.push(o);
        }
        return unique;
      }, []);
    } else {
      finaldata1 = finaldata;
    }
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
                <button type="button" className="btn btn-primary" onClick={getdtareport}>GetData</button>
                <button type="button" className="btn btn-primary mx-1" onClick={Resetfilters}>Reset</button>
              </div>
              <div className="col-md-4">
                <div className="row">
                  <div id="loader" className="loader"></div>
                </div>
              </div>
              {ListReportData.length>0 &&(
              <div className="col-md-12 my-2">
                <button type="button" className="btn btn-primary float-end" onClick={DownloadExcel}>Download Excel</button>
              </div>
              )}
            </div>
            {ListReportData.length>0 &&(
            <div className="jsGrid" ref={gridRefjsgridreport} />
            )}
          </div>
        </div>
      </section>

    </main>
  );
}
export default DataReport;