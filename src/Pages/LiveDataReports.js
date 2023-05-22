import React, { useCallback, useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import DatePicker from "react-datepicker";
function LiveDataReports() {
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
    let params = new URLSearchParams({ Pollutent: "", Fromdate: null, Todate: null });
    fetch(process.env.REACT_APP_WSurl + "api/LiveDataLookup?" + params)
      .then((response) => response.json())
      .then((data) => {
        if (data != null) {
          setAllLookpdata(data);
          setListReportData(data.listParametervalues);
          // let parameterslist=[...new Set(data.listPollutents.map(item => item.parameterName))]
          let parameterslist = [];
          data.listPollutents.filter(function (item) {
            var i = parameterslist.findIndex(x => (x.parameterName == item.parameterName));
            if (i <= -1) {
              parameterslist.push(item);
            }
            return null;
          });
          setPollutents(parameterslist);
          setSelectedPollutents(parameterslist);

          setTimeout(function () {
            $('#pollutentid').SumoSelect({
              triggerChangeCombined: true, placeholder: 'Select Parameter', floatWidth: 200, selectAll: true,
              search: true
            });

          }, 100);
          // initializeJsGrid();
        }
        //setcriteria(data.listPollutentsConfig);
      })
      .catch((error) => console.log(error));
    // initializeJsGrid();
  }, []);
  useEffect(() => {
    initializeJsGrid();
  });

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     initializeJsGrid()
  //   }, 60000);
  //   return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  // }, [])

  /* reported data start */
  const generateDatabaseDateTime = function (date) {
    return date.replace("T", " ").substring(0, 19);
  }
  const UpdateColPos = function (cols) {
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
    layout.push({ name: "Date", title: "Date", type: "text", width:"140px"});
    for (var i = 0; i < SelectedPollutents.length; i++) {
      let unitname = AllLookpdata.listReportedUnits.filter(x => x.id == SelectedPollutents[i].unitID)
      layout.push({ name: SelectedPollutents[i].parameterName, title: SelectedPollutents[i].parameterName + " - " + unitname[0].unitName, type: "text",width:"100px" });
    }
    // let dummycolumns =0 ;
    // if(SelectedPollutents.length<10){
    //   dummycolumns = 10 - SelectedPollutents.length;
    // }
    // for(var p = 0; p < dummycolumns.length; p++){
    //   layout.push({ name: "CO_" + p, title: "CO" + " - " + "Ppb", type: "text",width:"100px" });
    // }
    // layout.push({ type: "control", width: 100, editButton: false, deleteButton: false });
    for (var k = 0; k < ListReportData.length; k++) {
      var obj = {};
      var temp = dataForGrid.findIndex(x => x.Date === generateDatabaseDateTime(ListReportData[k].createdTime));
      let paramater = SelectedPollutents.filter(x => x.id == ListReportData[k].parameterID);
      if(paramater.length>0){
      if (temp >= 0) {
        dataForGrid[temp][paramater[0].parameterName] = ListReportData[k].parametervalue;
      } else {
        obj[paramater[0].parameterName] = ListReportData[k].parametervalue;
        obj["Date"] = generateDatabaseDateTime(ListReportData[k].createdTime);
        
        dataForGrid.push(obj);
      }
    }
    // for(var p = 0; p < dummycolumns.length; p++){
    //   dataForGrid[ "CO_" + p] = "0.00";
    // }
    }

    window.jQuery(gridRefjsgridreport.current).jsGrid({
      width: "100%",
      height: "auto",
      filtering: false,
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
                if (!filter[prop] || item[prop].toString().indexOf(filter[prop]) >= 0) {
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
  const getdtareport = function (param) {
    setListReportData([]);
   let Pollutent = $("#pollutentid").val();
    let finalpollutent = [];
    for (let i = 0; i < Pollutent.length; i++) {
      let filter=Pollutents.filter(x=>x.parameterName==Pollutent[i]);
      finalpollutent.push(filter[0]);
    }
    if(param=='reset' || Pollutent.length==0){
      setSelectedPollutents(Pollutents);
    }else{
      setSelectedPollutents(finalpollutent);
    }
    if (Pollutent.length > 0) {
      Pollutent.join(',')
    }
    // let Fromdate = document.getElementById("fromdateid").value;
    // let Todate = document.getElementById("todateid").value;
    //let Interval = document.getElementById("criteriaid").value;
    if(param!='reset'){
    let valid = ReportValidations(Pollutent);
    if (!valid) {
      return false;
    }
  }
    document.getElementById('loader').style.display = "block";
    //let params = new URLSearchParams({ Pollutent: Pollutent, Fromdate: Fromdate, Todate: Todate });
    let params = new URLSearchParams({ Pollutent: Pollutent });
    let url = process.env.REACT_APP_WSurl + "api/LiveDataReport?"
    fetch(url + params, {
      method: 'GET',
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          console.log(new Date());
          let data1 = data.map((x) => { x.interval = x.createdTime.replace('T', ' '); return x; });
          setListReportData(data1);
        }
        document.getElementById('loader').style.display = "none";
      }).catch((error) => console.log(error));
  }
  /*  const DownloadExcel = function () {
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
   } */

  const ReportValidations = function (Pollutent) {
    let isvalid = true;
    if (Pollutent == "") {
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
    // else if (Fromdate == "") {
    //   toast.error('Please select from date', {
    //     position: "top-right",
    //     autoClose: 5000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     theme: "colored",
    //   });
    //   isvalid = false;
    // } else if (Todate == "") {
    //   toast.error('Please select to date', {
    //     position: "top-right",
    //     autoClose: 5000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     theme: "colored",
    //   });
    //   isvalid = false;
    // }
    return isvalid;
  }
  /* reported data end */
  const Resetfilters = function () {
    $('.pollutentid')[0].sumo.reload();
    $('.pollutentid')[0].sumo.unSelectAll();
    getdtareport('reset');
    /*  $('.stationid')[0].sumo.reload();
     $('.stationid')[0].sumo.unSelectAll(); */
   // setcriteria([]);
   // setToDate(new Date());
    //setFromDate(new Date());
    //setListReportData([]);
   // setSelectedPollutents([]);
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
              {/* <div className="col-md-2">
                <label className="form-label">Station Name</label>
                <select className="form-select stationid" id="stationid" multiple="multiple" >

                  {Stations.map((x, y) =>
                    <option value={x.id} key={y} >{x.stationName}</option>
                  )}
                </select>
              </div> */}
              <div className="col-md-3">
                <label className="form-label">Parameters</label>
                <select className="form-select pollutentid" id="pollutentid" multiple="multiple">
                  {/* <option selected> Select Pollutents</option> */}
                  {Pollutents.map((x, y) =>
                    <option value={x.parameterName} key={y} >{x.parameterName}</option>
                  )}
                </select>
              </div>
              {/* <div className="col-md-3">
                <label className="form-label">From Date</label>
                <DatePicker className="form-control" id="fromdateid" selected={fromDate} onChange={(date) => setFromDate(date)} />
              </div>
              <div className="col-md-3">
                <label className="form-label">To Date</label>
                <DatePicker className="form-control" id="todateid" selected={toDate} onChange={(date) => setToDate(date)} />
              </div> */}
              {/* <div className="col-md-2">
                <label className="form-label">Interval</label>
                <select className="form-select" id="criteriaid">
                  <option value="" selected>Select Interval</option>
                  {Criteria.map((x, y) =>
                    <option value={x.value + x.type} key={y} >{x.value + '-' + x.type}</option>
                  )}
                </select>
              </div> */}
              <div className="col-md-3 my-4">
                <button type="button" className="btn btn-primary" onClick={getdtareport}>GetData</button>
                <button type="button" className="btn btn-primary mx-1" onClick={Resetfilters}>Reset</button>
              </div>
              <div className="col-md-4">
                <div className="row">
                  <div id="loader" className="loader"></div>
                </div>
              </div>
              {/* {ListReportData.length>0 &&(
              <div className="col-md-12 my-2">
                <button type="button" className="btn btn-primary float-end" onClick={DownloadExcel}>Download Excel</button>
              </div>
              )} */}
            </div>
            {ListReportData.length > 0 && (
              <div className="jsGrid" ref={gridRefjsgridreport} />
            )}
          </div>
        </div>
      </section>

    </main>
  );
}
export default LiveDataReports;