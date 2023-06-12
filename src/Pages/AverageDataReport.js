import React, { useCallback, useEffect, useState, useRef } from "react";

import { toast } from 'react-toastify';

import DatePicker from "react-datepicker";

import CommonFunctions from "../utils/CommonFunctions";

import { jsPDF } from "jspdf";

import "jspdf-autotable";




function AverageDataReport() {

  const $ = window.jQuery;

  const gridRefjsgridreport = useRef();

  const [selectedStations, setselectedStations] = useState([]);

  const [fromDate, setFromDate] = useState(new Date());

  const [toDate, setToDate] = useState(new Date());

  const [ListReportData, setListReportData] = useState(0);

  const [ReportData, setReportData] = useState([]);

  const [sortOrder, setsortOrder] = useState('asc');

  const [ItemCount, setItemCount] = useState(0);

  const [SelectedPollutents, setSelectedPollutents] = useState([]);

  const [AllLookpdata, setAllLookpdata] = useState(null);

  const [Pollutents, setPollutents] = useState([]);

  const [Criteria, setcriteria] = useState([]);
  const PollutentsRef = useRef([]);
  PollutentsRef.current = SelectedPollutents;
  const Itemcount = useRef();

  Itemcount.current = ItemCount;
  var dataForGrid = [];




  useEffect(() => {

    fetch(process.env.REACT_APP_WSurl + "api/AirQuality/GetAverageLookupData")

      .then((response) => response.json())

      .then((data) => {

        setAllLookpdata(data);

        let parameterslist = [];

        data.listPollutents.filter(function (item) {

          var i = parameterslist.findIndex(x => (x.parameterName == item.parameterName));

          if (i <= -1) {

            parameterslist.push(item);

          }

          return null;

        });

        setPollutents(parameterslist);

        setTimeout(function () {

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
  }, [SelectedPollutents]);
  /* reported data start */




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

    layout.push({ name: "Date", title: "Date", type: "text", width: "140px", sorting: true });

    for (var i = 0; i < SelectedPollutents.length; i++) {

      let filter = AllLookpdata.listPollutents.filter(x => x.parameterName == SelectedPollutents[i]);

      let unitname = AllLookpdata.listReportedUnits.filter(x => x.id == filter[0].unitID);

      gridheadertitle = SelectedPollutents[i] + "<br>" + unitname[0].unitName

      layout.push({

        name: SelectedPollutents[i], title: gridheadertitle, type: "text", width: "100px", sorting: false, cellRenderer: function (item, value) {

          let flag = AllLookpdata.listFlagCodes.filter(x => x.id == value[Object.keys(value).find(key => value[key] === item) + "flag"]);

          let bgcolor = flag.length > 0 ? flag[0].colorCode : "#FFFFF"

          return $("<td>").css("background-color", bgcolor).append(item);

        }

      });




      // layout.push({ name:SelectedPollutents[i] , title:  gridheadertitle , type: "text",width:"100px" });

    }

    if (SelectedPollutents.length < 10) {

      for (var p = SelectedPollutents.length; p < 10; p++) {
        layout.push({ name: " " + p, title: " ", type: "text", width: "100px", sorting: false });
      }

    }

    window.jQuery(gridRefjsgridreport.current).jsGrid({

      width: "100%",

      height: "auto",

      filtering: false,

      editing: false,

      inserting: false,

      sorting: true,

      autoload: true,

      paging: true,

      pageLoading: true,

      pageButtonCount: 5,

      pageSize: 100,

      pageIndex: 1,

      controller: {

        loadData: async function (filter) {

          var startIndex = (filter.pageIndex - 1) * filter.pageSize;

          // console.log(filter);

          // RefsortOrder.current = sortOrder;

          // now the oldText.current holds the old value

          // setsortOrder(filter.sortOrder);

          return {

            data: await AvgDataReport(startIndex, startIndex + filter.pageSize, filter.sortOrder),

            itemsCount: await Itemcount.current

          };

        }

      },

      fields: layout

    });

    $('.jsgrid-grid-body').scroll(function () {

      UpdateColPos(1);

    });

  }




  const generateDatabaseDateTime = function (date) {

    return date.replace("T", " ").substring(0, 19);

  }




  const AvgDataReport = async function (startIndex, lastIndex, sortorder) {

    let Pollutent = $("#pollutentid").val();
    // setSelectedPollutents(Pollutent);
    if (Pollutent.length > 0) {

      Pollutent.join(',')

    }

    let Fromdate = document.getElementById("fromdateid").value;

    let Todate = document.getElementById("todateid").value;
    let interval = document.getElementById("criteriaid").value;
    let valid = ReportValidations(Pollutent, Fromdate, Todate, interval);
    if (!valid) {

      return false;

    }
    let type = interval.substr(interval.length - 1);
    let Interval;
    if (type == 'H') {
      Interval = interval.substr(0, interval.length - 1) * 60;
    } else {
      Interval = interval.substr(0, interval.length - 1);
    }
    document.getElementById('loader').style.display = "block";

    let params = new URLSearchParams({ Pollutent: Pollutent, Fromdate: Fromdate, Todate: Todate, Interval: Interval, StartIndex: startIndex, SortOrder: sortorder });

    let url = process.env.REACT_APP_WSurl + "api/AirQuality/AvergaeDataReport?"

    /* fetch(url + params, {

      method: 'GET',

    }).then((response) => response.json())

      .then((data) => {

        if (data) {

          console.log(new Date());

          let data1 = data.map((x) => { x.interval = x.interval.replace('T', ' '); return x; });

          setListReportData(data1);

        } */

    return await fetch(url + params, {

      method: 'GET',

    }).then((response) => response.json())

      .then((data) => {

        if (data) {

          dataForGrid = [];

          let data1 = data.map((x) => { x.interval = x.interval.replace('T', ' '); return x; });

          for (var k = 0; k < data1.length; k++) {

            if (k == 0) {

              // setItemCount(data1[0].count);

              Itemcount.current = data1[0].count;

            }

            var obj = {};

            var temp = dataForGrid.findIndex(x => x.Date === data1[k].interval);

            let tempparameter = AllLookpdata.listPollutents

            let paramater = AllLookpdata.listPollutents.filter(x => x.id == data1[k].parameterID);

            if (paramater.length > 0) {

              let roundedNumber = 0;

              let digit = window.decimalDigit

              if (window.TruncateorRound == "RoundOff") {

                let num = data1[k].parametervalue;
                roundedNumber = num==null?num:num.toFixed(digit);
              }

              else {
                roundedNumber = data1[k].parametervalue==null?data1[k].parametervalue:CommonFunctions.truncateNumber(data1[k].parametervalue, digit);
              }

              if (temp >= 0) {

                dataForGrid[temp][paramater[0].parameterName] = roundedNumber;

                dataForGrid[temp][paramater[0].parameterName + "flag"] = data1[k].loggerFlags;

              } else {

                obj[paramater[0].parameterName] = roundedNumber;

                obj[paramater[0].parameterName + "flag"] = data1[k].loggerFlags;

                obj["Date"] = data1[k].interval;
                dataForGrid.push(obj);

              }

            }
          }

          document.getElementById('loader').style.display = "none";

          setReportData(dataForGrid);

          return dataForGrid;

        }

        document.getElementById('loader').style.display = "none";

      }).catch((error) => console.log(error));

  }




  const getdtareport = function () {

    let Pollutent = $("#pollutentid").val();

    setSelectedPollutents(Pollutent);
    if (Pollutent.length > 0) {

      Pollutent.join(',')

    }

    let Fromdate = document.getElementById("fromdateid").value;

    let Todate = document.getElementById("todateid").value;

    let Interval = document.getElementById("criteriaid").value;

    let valid = ReportValidations(Pollutent, Fromdate, Todate, Interval);

    if (!valid) {

      return false;

    }

    setListReportData(1);

    //initializeJsGrid();

    // AvgDataReport();

  }

  const DownloadPDF = function () {
    let Pollutent = $("#pollutentid").val();
    if (Pollutent.length > 0) {
      Pollutent.join(',')
    }
    let Fromdate = document.getElementById("fromdateid").value;
    let Todate = document.getElementById("todateid").value;
    let interval = document.getElementById("criteriaid").value;
    let valid = ReportValidations(Pollutent, Fromdate, Todate, interval);
    if (!valid) {
      return false;
    }
    let type = interval.substr(interval.length - 1);
    let Interval;
    if (type == 'H') {
      Interval = interval.substr(0, interval.length - 1) * 60;
    } else {
      Interval = interval.substr(0, interval.length - 1);
    }
    let paramUnitnames;
    var tableheading = [];
    var rows = [];
    var layout = "";
    layout = "Date";
    tableheading.push(layout);
    for (var i = 0; i < SelectedPollutents.length; i++) {
      let filter = AllLookpdata.listPollutents.filter(x => x.parameterName == SelectedPollutents[i]);
      let unitname = AllLookpdata.listReportedUnits.filter(x => x.id == filter[0].unitID);
      if (paramUnitnames == undefined) {
        paramUnitnames = filter[0].parameterName + "-" + unitname[0].unitName + ",";
        layout = filter[0].parameterName + "-" + unitname[0].unitName;
        tableheading.push(layout);
      }
      else {
        paramUnitnames += filter[0].parameterName + "-" + unitname[0].unitName + ",";
        layout = filter[0].parameterName + "-" + unitname[0].unitName;
        tableheading.push(layout);
      }
    }

    const styles = {
      fontFamily: "sans-serif",
      textAlign: "center"
    };
    const colstyle = {
      width: "30%"
    };
    const tableStyle = {
      width: "100%"
    };
    var b = 0;
    let params = new URLSearchParams({ Pollutent: Pollutent, Fromdate: Fromdate, Todate: Todate, Interval: Interval });
    fetch(process.env.REACT_APP_WSurl + 'api/AirQuality/ExportToPDFAverageData?' + params, {
      method: 'GET',
    }).then((response) => response.json())
      .then((pdfdata) => {
        if (pdfdata) {
          for (var k = 0; k < pdfdata.length; k++) {
            var temp = rows.findIndex(x => x[0] === pdfdata[k].interval.replace('T', ' '));
            let roundedNumber = 0;
            let digit = window.decimalDigit;
            if (window.TruncateorRound == "RoundOff") {
              let num = pdfdata[k].parametervalue;
              roundedNumber = num==null?num:num.toFixed(digit);
            }
            else {
              roundedNumber = pdfdata[k].parametervalue==null?pdfdata[k].parametervalue:CommonFunctions.truncateNumber(pdfdata[k].parametervalue, digit);
            }
            if (temp >= 0) {
              var n = 1;
              for (var e = 0; e < SelectedPollutents.length; e++) {
                if (pdfdata[k].parameterName == SelectedPollutents[e]) {
                  rows[temp][n] = roundedNumber;
                }
                n++;
              }
            }
            else {
              var d = 1;
              rows.push([pdfdata[k].interval.replace('T', ' ')]);
              for (var e = 0; e < SelectedPollutents.length; e++) {
                if (pdfdata[k].parameterName == SelectedPollutents[e]) {
                  //Columnfields.push([ListReportData[k].interval ,roundedNumber]); 
                  rows[b][d] = roundedNumber;
                }
                d++;
              }
              b++;
            }
          }
          var pdf = new jsPDF("p", "pt", "a4");
          const columns = tableheading;
          pdf.text(235, 40, "Average Data Report");
          pdf.autoTable(columns, rows, {
            startY: 65,
            theme: "grid",
            styles: {
              font: "times",
              halign: "center",
              cellPadding: 3.5,
              lineWidth: 0.5,
              lineColor: [0, 0, 0],
              textColor: [0, 0, 0]
            },
            headStyles: {
              textColor: [0, 0, 0],
              fontStyle: "normal",
              lineWidth: 0.5,
              lineColor: [0, 0, 0],
              fillColor: [166, 204, 247]
            },
            alternateRowStyles: {
              fillColor: [212, 212, 212],
              textColor: [0, 0, 0],
              lineWidth: 0.5,
              lineColor: [0, 0, 0]
            },
            rowStyles: {
              lineWidth: 0.5,
              lineColor: [0, 0, 0]
            },
            tableLineColor: [0, 0, 0]
          });
          console.log(pdf.output("datauristring"));
          pdf.save("Average Data Report");
        }
      }).catch((error) => toast.error('Unable to download the PDF File. Please contact adminstrator'));
  }

  const DownloadExcel = function () {
    let Pollutent = $("#pollutentid").val();
    if (Pollutent.length > 0) {
      Pollutent.join(',')
    }
    let Fromdate = document.getElementById("fromdateid").value;

    let Todate = document.getElementById("todateid").value;
    let interval = document.getElementById("criteriaid").value;
    let valid = ReportValidations(Pollutent, Fromdate, Todate, interval);
    if (!valid) {
      return false;
    }
    let type = interval.substr(interval.length - 1);
    let Interval;
    if (type == 'H') {
      Interval = interval.substr(0, interval.length - 1) * 60;
    } else {
      Interval = interval.substr(0, interval.length - 1);
    }
    let paramUnitnames;

    for (var i = 0; i < SelectedPollutents.length; i++) {

      let filter = AllLookpdata.listPollutents.filter(x => x.parameterName == SelectedPollutents[i]);

      let unitname = AllLookpdata.listReportedUnits.filter(x => x.id == filter[0].unitID);

      if (paramUnitnames == undefined) {

        paramUnitnames = filter[0].parameterName + "-" + unitname[0].unitName + ",";

      }

      else {

        paramUnitnames += filter[0].parameterName + "-" + unitname[0].unitName + ",";

      }
    }
    let params = new URLSearchParams({ Pollutent: Pollutent, Fromdate: Fromdate, Todate: Todate, Interval: Interval, Units: paramUnitnames,digit: window.decimalDigit,TruncateorRound: window.TruncateorRound });

    window.open(process.env.REACT_APP_WSurl + "api/AirQuality/ExportToExcelAverageData?" + params, "_blank");
  }




  const ReportValidations = function (Pollutent, Fromdate, Todate, Interval) {

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

    let finaldata = AllLookpdata.listPollutents.filter(obj => filter1.includes(obj.parameterName));
 
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

  const Resetfilters = function () {

    $('.pollutentid')[0].sumo.reload();

    $('.pollutentid')[0].sumo.unSelectAll();

    setcriteria([]);

    setToDate(new Date());

    setFromDate(new Date());

    setListReportData(0);

    setSelectedPollutents([]);

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

      <section>

        <div>

          <div>

            <div className="row">

              {/*  <div className="col-md-2">

                <label className="form-label">Station Name</label>

                <select className="form-select stationid" id="stationid" multiple="multiple" onChange={ChangeStation}>




                  {Stations.map((x, y) =>

                    <option value={x.id} key={y} >{x.stationName}</option>

                  )}

                </select>

              </div> */}

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

              <div className="col-md-4 my-4">

                <button type="button" className="btn btn-primary datashow" onClick={getdtareport}>GetData</button>

                <button type="button" className="btn btn-primary mx-1 datashow" onClick={Resetfilters}>Reset</button>

                {ListReportData != 0 && (

                  <span>

                    <button type="button" className="btn btn-primary mx-1" onClick={Codesinformation}>Flags</button>

                    <button type="button" className="btn btn-primary datashow" onClick={DownloadExcel}>Download Excel</button>

                   {/*  <button type="button" className="btn btn-primary mx-1 datashow" onClick={DownloadPDF}>Download PDF</button> */}

                  </span>

                )}

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

            {ListReportData != 0 && (

              <div id="jsGridData" className="jsGrid" ref={gridRefjsgridreport} />

            )}
          </div>

        </div>

      </section>
    </main>

  );

}

export default AverageDataReport;