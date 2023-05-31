import React, { useCallback, useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import CommonFunctions from "../utils/CommonFunctions";

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
  const ListAllDataCopy=useRef([]);
  const Interval=useRef();
  const getDuration= window.LiveDataDuration;
  var dataForGrid=[]; 
 // const [dataForGrid1,setdataForGrid1]=useState([]);
 // ListAllDataCopy.current=dataForGrid1;
  useEffect(() => {
    let params = new URLSearchParams({ Pollutent: "", StartIndex:0 });
    fetch(process.env.REACT_APP_WSurl + "api/LiveDataLookup?" + params)
      .then((response) => response.json())
      .then((data) => {
        if (data != null) {
          setAllLookpdata(data);
         setListReportData(data.listLivedata);
        // getdtareport();
          //setListReportData(data.listParametervalues);
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
          
        }
        
      })
      .catch((error) => console.log(error));
    
  }, []);
  useEffect(() => {
    initializeJsGrid();
  },[ListReportData]);

  useEffect(() => {
    const interval = setInterval(() => {
      getdtareport('refresh');
    }, getDuration);
    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  })

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

  const Codesinformation = function () {
    $('#alertcode').modal('show');
  }
  const initializeJsGrid = function () {
     dataForGrid = [];
    var layout = [];
    var gridheadertitle;
    layout.push({ name: "Date", title: "Date", type: "text", width:"140px"});
    for (var i = 0; i < SelectedPollutents.length; i++) {
      let unitname = AllLookpdata.listReportedUnits.filter(x => x.id == SelectedPollutents[i].unitID);
      gridheadertitle=SelectedPollutents[i].parameterName + "<br>" + unitname[0].unitName
      layout.push({ name: SelectedPollutents[i].parameterName, title: gridheadertitle, type: "text",width:"100px", cellRenderer: function(item, value){
        let flag=AllLookpdata.listFlagCodes.filter(x=>x.id==value[Object.keys(value).find(key => value[key] === item)+"flag"]);
       let bgcolor=flag.length>0?flag[0].colorCode:"#FFFFF"
        return $("<td>").css("background-color", bgcolor).append(item); 
      }});
    }
    if(SelectedPollutents.length<10){
       for(var p = SelectedPollutents.length; p < 10; p++){
          //layout.push({ name: "CO_" + p, title: "CO" + " - " + "PPM", type: "text",width:"100px" });
          layout.push({ name: "", title: "", type: "text",width:"100px" });
        }
    }
    // layout.push({ type: "control", width: 100, editButton: false, deleteButton: false });
    /* for (var k = 0; k < ListReportData.length; k++) {
      var obj = {};
      var temp = dataForGrid.findIndex(x => x.Date === generateDatabaseDateTime(ListReportData[k].createdTime));
      let paramater = SelectedPollutents.filter(x => x.id == ListReportData[k].parameterID);
      if(paramater.length>0){
            let roundedNumber=0;
            let digit = window.decimalDigit
            if(window.TruncateorRound=="RoundOff"){
              let num =ListReportData[k].parametervalue;
               roundedNumber=num.toFixed(digit);
            }
            else {
              roundedNumber = CommonFunctions.truncateNumber(ListReportData[k].parametervalue,digit);
            }
            if (temp >= 0) {
              dataForGrid[temp][paramater[0].parameterName] = roundedNumber;
              dataForGrid[temp][paramater[0].parameterName+"flag"] = ListReportData[k].loggerFlags;
            } else {
              obj[paramater[0].parameterName] = roundedNumber;
              obj[paramater[0].parameterName+"flag"] = ListReportData[k].loggerFlags;
              obj["Date"] = generateDatabaseDateTime(ListReportData[k].createdTime);
              
              dataForGrid.push(obj);
            }
      }
    
    } */

    window.jQuery(gridRefjsgridreport.current).jsGrid({
      width: "100%",
      height: "auto",
      filtering: false,
      editing: false,
      inserting: false,
      sorting: true,
      paging: true,
      autoload: true,
      pageLoading: true,
      pageButtonCount: 5,
      pageSize: 100,
      pageIndex: 1,
      /* controller: {
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
      }, */
      controller: {
        loadData:  async function (filter) {
          var startIndex = (filter.pageIndex - 1) * filter.pageSize;
         // let livedata=  LiveData(startIndex, startIndex + filter.pageSize);
          return {
            data: await LiveData(startIndex, startIndex + filter.pageSize),
            itemsCount: ListReportData.length>0?ListReportData[0].count:0
          };
        }
      },
      fields: layout
    });
    $('.jsgrid-grid-body').scroll(function () {
      UpdateColPos(1);
    });
  }
  const LiveData= async function(startIndex,lastIndex){
   /*  if(startIndex==0){
      for (var k = 0; k < ListReportData.length; k++) {
        var obj = {};
        var temp = dataForGrid.findIndex(x => x.Date === generateDatabaseDateTime(ListReportData[k].createdTime));
        let paramater = SelectedPollutents.filter(x => x.id == ListReportData[k].parameterID);
        if(paramater.length>0){
              let roundedNumber=0;
              let digit = window.decimalDigit
              if(window.TruncateorRound=="RoundOff"){
                let num =ListReportData[k].parametervalue;
                 roundedNumber=num.toFixed(digit);
              }
              else {
                roundedNumber = CommonFunctions.truncateNumber(ListReportData[k].parametervalue,digit);
              }
              if (temp >= 0) {
                dataForGrid[temp][paramater[0].parameterName] = roundedNumber;
                dataForGrid[temp][paramater[0].parameterName+"flag"] = ListReportData[k].loggerFlags;
              } else {
                obj[paramater[0].parameterName] = roundedNumber;
                obj[paramater[0].parameterName+"flag"] = ListReportData[k].loggerFlags;
                obj["Date"] = generateDatabaseDateTime(ListReportData[k].createdTime);
                
                dataForGrid.push(obj);
              }
        }
      
      }
      //setdataForGrid1(dataForGrid);
     // ListAllDataCopy.current=dataForGrid;
    return dataForGrid;
    }else{ */
      dataForGrid=[];
      let Pollutent = $("#pollutentid").val();
      let finalpollutent = [];
      for (let i = 0; i < Pollutent.length; i++) {
        let filter=Pollutents.filter(x=>x.parameterName==Pollutent[i]);
        finalpollutent.push(filter[0]);
      }
      if(Pollutent.length==0){
        setSelectedPollutents(Pollutents);
      }else{
        setSelectedPollutents(finalpollutent);
      }
      if (Pollutent.length > 0) {
        Pollutent.join(',')
      }
      document.getElementById('loader').style.display = "block";
      let params = new URLSearchParams({ Pollutent: Pollutent,StartIndex:startIndex });
      let url = process.env.REACT_APP_WSurl + "api/LiveDataReport?"
      return await fetch(url + params, {
        method: 'GET',
      }).then((response) => response.json())
        .then((data) => {
          if (data) {
            console.log(new Date());
            let data1 = data.map((x) => { x.interval = x.createdTime.replace('T', ' '); return x; });
           
              for (var k = 0; k < data1.length; k++) {
                var obj = {};
                var temp = dataForGrid.findIndex(x => x.Date === generateDatabaseDateTime(data1[k].createdTime));
                let paramater = SelectedPollutents.filter(x => x.id == data1[k].parameterID);
                if(paramater.length>0){
                      let roundedNumber=0;
                      let digit = window.decimalDigit
                      if(window.TruncateorRound=="RoundOff"){
                        let num =data1[k].parametervalue;
                         roundedNumber=num.toFixed(digit);
                      }
                      else {
                        roundedNumber = CommonFunctions.truncateNumber(data1[k].parametervalue,digit);
                      }
                      if (temp >= 0) {
                        dataForGrid[temp][paramater[0].parameterName] = roundedNumber;
                        dataForGrid[temp][paramater[0].parameterName+"flag"] = data1[k].loggerFlags;
                      } else {
                        obj[paramater[0].parameterName] = roundedNumber;
                        obj[paramater[0].parameterName+"flag"] = data1[k].loggerFlags;
                        obj["Date"] = generateDatabaseDateTime(data1[k].createdTime);
                        
                        dataForGrid.push(obj);
                      }
                }
              
              }
              document.getElementById('loader').style.display = "none";
              return  dataForGrid;
          }
          document.getElementById('loader').style.display = "none";
        }).catch((error) => console.log(error));
   // }
   // return dataForGrid;
  }
  const getdtareport = function (param) {
    initializeJsGrid();
    //setListReportData([]);
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
                  {AllLookpdata && (
                    <tbody>
                      {AllLookpdata.listFlagCodes.map((x, y) =>
                        <tr>
                          <td>{x.code}</td>
                          <td style={{ backgroundColor: x.colorCode }}>{x.name}</td>
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
                <button type="button" className="btn btn-primary mx-1" onClick={Codesinformation}>Flags</button>
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