import React, { useCallback, useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
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

  const [sortOrder, setsortOrder] = useState("asc");

  const [ItemCount, setItemCount] = useState(0);

  const [SelectedPollutents, setSelectedPollutents] = useState([]);

  const [AllLookpdata, setAllLookpdata] = useState(null);
  const [filteredPollutents, setFilteredPollutents] = useState([]);
  const [ListMonitoringTypes, setListMonitoringTypes] = useState([]);
  const [Stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [defaultInterval, setDefaultInterval] = useState([]);

  const [Pollutents, setPollutents] = useState([]);
  const [loadGrid, setLoadGrid] = useState(false);
  const [Criteria, setcriteria] = useState([]);
  const PollutentsRef = useRef([]);
  PollutentsRef.current = SelectedPollutents;
  const Itemcount = useRef();

  Itemcount.current = ItemCount;
  var dataForGrid = [];

  useEffect(() => {
    async function fetchData() {
      let authHeader = await CommonFunctions.getAuthHeader();
      await fetch(
        CommonFunctions.getWebApiUrl() + "api/AirQuality/GetAllLookupData",
        {
          method: "GET",
          headers: authHeader,
        }
      )
        .then((response) => response.json())

        .then((data) => {
          setAllLookpdata(data);
          setStations(data.listStations);
          const stationIds = data.listStations.map(s => s.id);
          let finaldata = data.listPollutents.filter(
            x => stationIds.includes(x.stationID)
          );
          var finaldata1 = [];
          finaldata1 = finaldata.reduce((unique, o) => {
            if (
              !unique.some(
                (obj) =>
                  obj.stationID == o.stationID &&
                  obj.parameterName === o.parameterName
              )
            ) {
              unique.push(o);
            }
            return unique;
          }, []);
          setPollutents(finaldata1);
          setListMonitoringTypes(data.listMonitoringTypes);

          setTimeout(function () {
            $("#pollutentid").SumoSelect({
              triggerChangeCombined: true,
              placeholder: "Select Parameter",
              floatWidth: 200,
              selectAll: true,
              nativeOnDevice: [],
              forceCustomRendering: true,
              search: true,
            });
          }, 100);

          //setcriteria(data.listPollutentsConfig);
        })

        .catch((error) => console.log(error));
    }
    fetchData();
    // initializeJsGrid();
  }, []);

  useEffect(() => {
    if (loadGrid == true) {
      initializeJsGrid();
    }
  }, [SelectedPollutents]);
  useEffect(() => {
    setFilteredStations(Stations);
  }, [Stations]);
  /* reported data start */

  const UpdateColPos = function (cols) {
    var left =
      $(".jsgrid-grid-body").scrollLeft() <
      $(".jsgrid-grid-body .jsgrid-table").width() -
        $(".jsgrid-grid-body").width() +
        16
        ? $(".jsgrid-grid-body").scrollLeft()
        : $(".jsgrid-grid-body .jsgrid-table").width() -
          $(".jsgrid-grid-body").width() +
          16;

    $(
      ".jsgrid-header-row th:nth-child(-n+" +
        cols +
        "), .jsgrid-filter-row td:nth-child(-n+" +
        cols +
        "), .jsgrid-insert-row td:nth-child(-n+" +
        cols +
        "), .jsgrid-grid-body tr td:nth-child(-n+" +
        cols +
        ")"
    ).css({
      position: "relative",

      left: left,
    });
  };

  const Codesinformation = function () {
    $("#alertcode").modal("show");
  };

  const initializeJsGrid = function () {
    dataForGrid = [];

    var layout = [];

    layout.push({
      name: "Date",
      title: "Date",
      type: "text",
      width: "140px",
      sorting: true,
    });

    for (var i = 0; i < SelectedPollutents.length; i++) {
      let filter = AllLookpdata.listPollutents.filter(
        (x) => x.parameterName == SelectedPollutents[i]
      );

      let unitname = AllLookpdata.listReportedUnits.filter(
        (x) => x.id == filter[0].unitID
      );

      var gridheadertitle =
        SelectedPollutents[i] +
        "<br>" +
        unitname[0].unitName +
        "<br>Min: <br>Max: ";
      let Selectedparametersplit = SelectedPollutents[i].split(".");
      let Selectedparameter =
        Selectedparametersplit.length > 1
          ? SelectedPollutents[i].replace(/\./g, "_@_")
          : SelectedPollutents[i];

      layout.push({
        // name: SelectedPollutents[i], title: gridheadertitle, type: "text", width: "100px", sorting: false, cellRenderer: function (item, value) {
        name: Selectedparameter,
        title: gridheadertitle,
        type: "text",
        width: "100px",
        sorting: false,
        cellRenderer: function (item, value) {
          let flag = AllLookpdata.listFlagCodes.filter(
            (x) => x.id == value[Selectedparameter + "flag"]
          );
          //  let flag = AllLookpdata.listFlagCodes.filter(x => x.id == value[Object.keys(value).find(key => value[key] === item) + "flag"]);
          let bgcolor = flag.length > 0 ? flag[0].colorCode : "#FFFFF";
          return $("<td>").css("background-color", bgcolor).append(item);
        },
      });

      // layout.push({ name:SelectedPollutents[i] , title:  gridheadertitle , type: "text",width:"100px" });
    }

    if (SelectedPollutents.length < 10) {
      for (var p = SelectedPollutents.length; p < 10; p++) {
        layout.push({
          name: " " + p,
          title: " ",
          type: "text",
          width: "100px",
          sorting: false,
        });
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
          let data = await AvgDataReport(
            startIndex,
            startIndex + filter.pageSize,
            filter.sortOrder
          );
          updateHeaderWithMinMaxValues(data);
          return {
            data: data,
            itemsCount: await Itemcount.current,
          };

          // console.log(filter);

          // RefsortOrder.current = sortOrder;

          // now the oldText.current holds the old value

          // setsortOrder(filter.sortOrder);

          // return {

          //   data: await AvgDataReport(startIndex, startIndex + filter.pageSize, filter.sortOrder),

          //   itemsCount: await Itemcount.current

          // };
        },
      },

      fields: layout,
    });

    $(".jsgrid-grid-body").scroll(function () {
      UpdateColPos(1);
    });
  };

  function updateHeaderWithMinMaxValues(data) {
    // console.log(data, 'data')
    let minMaxValues = {};

    // Calculate min and max values for each pollutant
    SelectedPollutents.forEach((item) => {
      //Object.keys(item).forEach(key => {
      if (!minMaxValues[item]) {
        minMaxValues[item] = { min: "", max: "" };
      }
      let finalitem =
        item.split(".").length > 1
          ? item.replace(/\./g, "_@_")
          : item.split("@")[0];
      let finadata = data.filter((key) => key.hasOwnProperty(finalitem));
      // console.log(finadata, 'finadata')
      if (finadata.length > 0) {
        minMaxValues[item].min =
          finadata[0][finalitem + "minValue"] == null
            ? ""
            : finadata[0][finalitem + "minValue"];
        minMaxValues[item].max =
          finadata[0][finalitem + "maxValue"] == null
            ? ""
            : finadata[0][finalitem + "maxValue"];
      }
    });
    //});
    // Update the header
    Object.keys(minMaxValues).forEach((key) => {
      if (key !== "Date" && key !== " ") {
        let headerCell = $("th").filter(function () {
          let finaltext = $(this).html().split("<br>")[0];
          let finalparametersplit = finaltext.split(".");
          let finalparameter = finaltext;
          return finalparameter === key.split("@")[0];
        });
        if (headerCell.length > 0) {
          let unitname = headerCell.html().split("<br>")[1];
          headerCell.html(
            `${key.split("@")[0]}<br>${unitname}<br>Min: ${
              minMaxValues[key].min
            }<br>Max: ${minMaxValues[key].max}`
          );
        }
      }
    });
  }

  const generateDatabaseDateTime = function (date) {
    return date.replace("T", " ").substring(0, 19);
  };

  const AvgDataReport = async function (startIndex, lastIndex, sortorder) {
    let Pollutent = $("#pollutentid").val();
    // setSelectedPollutents(Pollutent);
    if (Pollutent.length > 0) {
      Pollutent.join(",");
    }
    let StationID = parseInt(selectedStations);
    let Fromdate = document.getElementById("fromdateid").value;

    let Todate = document.getElementById("todateid").value;
    let Interval = document.getElementById("criteriaid").value;
    let isDefaultInterval = defaultInterval.includes(Interval);
    let valid = ReportValidations(Pollutent, Fromdate, Todate, Interval);
    if (!valid) {
      return false;
    }
    setLoadGrid(true);
    /*
    let type = interval.substr(interval.length - 1);
    let Interval;
    if (type == 'H') {
      Interval = interval.substr(0, interval.length - 1) * 60;
    } else {
      Interval = interval.substr(0, interval.length - 1);
    }
      */

    let Intervaltype;
    let isAvgData = false;
    let isRollingAvg = false;
    let Intervaltypesplit = Interval.split("-");
    if (Interval != "Rolling") {
      if (Intervaltypesplit[1] == "H") {
        Intervaltype = Intervaltypesplit[0] * 60;
      } else {
        Intervaltype = Intervaltypesplit[0];
      }
    } else {
      isRollingAvg = true;
      Intervaltype = 60;
    }
    if (Interval == window.Intervalval) {
      isAvgData = false;
    } else {
      isAvgData = true;
    }

    document.getElementById("loader").style.display = "block";
    let SortOrder =
      sortorder == undefined || sortorder == "desc" ? "asc" : "desc";
    let params = new URLSearchParams({
      StationID: StationID,
      Pollutent: Pollutent,
      Fromdate: Fromdate,
      Todate: Todate,
      Interval: Intervaltype,
      StartIndex: startIndex,
      SortOrder: SortOrder,
    });
    let url = "";
    // console.log(Intervaltype);
    if (isDefaultInterval) {
      url = CommonFunctions.getWebApiUrl() + "api/AirQuality/RawDataReport?";
    } else {
      url =
        CommonFunctions.getWebApiUrl() + "api/AirQuality/AvergaeDataReport?";
    }

    /* fetch(url + params, {

      method: 'GET',

    }).then((response) => response.json())

      .then((data) => {

        if (data) {

          console.log(new Date());

          let data1 = data.map((x) => { x.interval = x.interval.replace('T', ' '); return x; });

          setListReportData(data1);

        } */
    let authHeader = await CommonFunctions.getAuthHeader();
    return await fetch(url + params, {
      method: "GET",
      headers: authHeader,
    })
      .then((response) => response.json())

      .then((data) => {
        if (data) {
          dataForGrid = [];

          let data1 = data.map((x) => {
            x.interval = x.interval.replace("T", " ");
            return x;
          });

          for (var k = 0; k < data1.length; k++) {
            if (k == 0) {
              // setItemCount(data1[0].count);

              Itemcount.current = data1[0].count;
            }

            var obj = {};

            var temp = dataForGrid.findIndex(
              (x) => x.Date === data1[k].interval
            );

            let tempparameter = AllLookpdata.listPollutents;

            let paramater = AllLookpdata.listPollutents.filter(
              (x) => x.id == data1[k].parameterID
            );

            if (paramater.length > 0) {
              let roundedNumber = 0;
              let minValue = 0;
              let maxValue = 0;

              let digit = window.decimalDigit;

              if (window.TruncateorRound == "RoundOff") {
                let num = data1[k].parametervalue;
                let minnum = data1[k].minValue;
                let maxnum = data1[k].maxValue;
                roundedNumber = num == null ? num : num.toFixed(digit);
                minValue = minnum == null ? minnum : minnum.toFixed(digit);
                maxValue = maxnum == null ? maxnum : maxnum.toFixed(digit);
              } else {
                roundedNumber =
                  data1[k].parametervalue == null
                    ? data1[k].parametervalue
                    : CommonFunctions.truncateNumber(
                        data1[k].parametervalue,
                        digit
                      );
                minValue =
                  data1[k].minValue == null
                    ? data1[k].minValue
                    : CommonFunctions.truncateNumber(data1[k].minValue, digit);
                maxValue =
                  data1[k].maxValue == null
                    ? data1[k].maxValue
                    : CommonFunctions.truncateNumber(data1[k].maxValue, digit);
              }
              let Selectedparametersplit =
                paramater[0].parameterName.split(".");
              let Selectedparameter =
                Selectedparametersplit.length > 1
                  ? paramater[0].parameterName.replace(/\./g, "_@_")
                  : paramater[0].parameterName;

              if (temp >= 0) {
                //dataForGrid[temp][paramater[0].parameterName] = roundedNumber;
                dataForGrid[temp][Selectedparameter] = roundedNumber;

                dataForGrid[temp][paramater[0].parameterName + "flag"] =
                  data1[k].loggerFlags;
                dataForGrid[temp][Selectedparameter + "minValue"] = minValue;
                dataForGrid[temp][Selectedparameter + "maxValue"] = maxValue;
              } else {
                //obj[paramater[0].parameterName] = roundedNumber;

                //obj[paramater[0].parameterName + "flag"] = data1[k].loggerFlags;
                obj[Selectedparameter] = roundedNumber;
                obj[Selectedparameter + "flag"] = data1[k].loggerFlags;
                obj[Selectedparameter + "minValue"] = minValue;
                obj[Selectedparameter + "maxValue"] = maxValue;
                obj["Date"] = data1[k].interval;
                dataForGrid.push(obj);
              }
            }
          }

          document.getElementById("loader").style.display = "none";

          setReportData(dataForGrid);
          console.log(dataForGrid);
          return dataForGrid;
        }

        document.getElementById("loader").style.display = "none";
      })
      .catch((error) => console.log(error));
  };

  const getdtareport = function () {
    setReportData([]);
    let Pollutent = $("#pollutentid").val();

    setSelectedPollutents(Pollutent);
    if (Pollutent.length > 0) {
      Pollutent.join(",");
    }

    let Fromdate = document.getElementById("fromdateid").value;

    let Todate = document.getElementById("todateid").value;

    let Interval = document.getElementById("criteriaid").value;

    let valid = ReportValidations(Pollutent, Fromdate, Todate, Interval);

    if (!valid) {
      return false;
    }
    setLoadGrid(true);
    setListReportData(1);

    //initializeJsGrid();

    // AvgDataReport();
  };

  const DownloadPDF = async function () {
    let Pollutent = $("#pollutentid").val();
    if (Pollutent.length > 0) {
      Pollutent.join(",");
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
    if (type == "H") {
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
      let filter = AllLookpdata.listPollutents.filter(
        (x) => x.parameterName == SelectedPollutents[i]
      );
      let unitname = AllLookpdata.listReportedUnits.filter(
        (x) => x.id == filter[0].unitID
      );
      if (paramUnitnames == undefined) {
        paramUnitnames =
          filter[0].parameterName + "-" + unitname[0].unitName + ",";
        layout = filter[0].parameterName + "-" + unitname[0].unitName;
        tableheading.push(layout);
      } else {
        paramUnitnames +=
          filter[0].parameterName + "-" + unitname[0].unitName + ",";
        layout = filter[0].parameterName + "-" + unitname[0].unitName;
        tableheading.push(layout);
      }
    }

    const styles = {
      fontFamily: "sans-serif",
      textAlign: "center",
    };
    const colstyle = {
      width: "30%",
    };
    const tableStyle = {
      width: "100%",
    };
    var b = 0;
    let authHeader = await CommonFunctions.getAuthHeader();
    let params = new URLSearchParams({
      Pollutent: Pollutent,
      Fromdate: Fromdate,
      Todate: Todate,
      Interval: Interval,
    });
    await fetch(
      CommonFunctions.getWebApiUrl() +
        "api/AirQuality/ExportToPDFAverageData?" +
        params,
      {
        method: "GET",
        headers: authHeader,
      }
    )
      .then((response) => response.json())
      .then((pdfdata) => {
        if (pdfdata) {
          for (var k = 0; k < pdfdata.length; k++) {
            var temp = rows.findIndex(
              (x) => x[0] === pdfdata[k].interval.replace("T", " ")
            );
            let roundedNumber = 0;
            let digit = window.decimalDigit;
            if (window.TruncateorRound == "RoundOff") {
              let num = pdfdata[k].parametervalue;
              roundedNumber = num == null ? num : num.toFixed(digit);
            } else {
              roundedNumber =
                pdfdata[k].parametervalue == null
                  ? pdfdata[k].parametervalue
                  : CommonFunctions.truncateNumber(
                      pdfdata[k].parametervalue,
                      digit
                    );
            }
            if (temp >= 0) {
              var n = 1;
              for (var e = 0; e < SelectedPollutents.length; e++) {
                if (pdfdata[k].parameterName == SelectedPollutents[e]) {
                  rows[temp][n] = roundedNumber;
                }
                n++;
              }
            } else {
              var d = 1;
              rows.push([pdfdata[k].interval.replace("T", " ")]);
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
              textColor: [0, 0, 0],
            },
            headStyles: {
              textColor: [0, 0, 0],
              fontStyle: "normal",
              lineWidth: 0.5,
              lineColor: [0, 0, 0],
              fillColor: [166, 204, 247],
            },
            alternateRowStyles: {
              fillColor: [212, 212, 212],
              textColor: [0, 0, 0],
              lineWidth: 0.5,
              lineColor: [0, 0, 0],
            },
            rowStyles: {
              lineWidth: 0.5,
              lineColor: [0, 0, 0],
            },
            tableLineColor: [0, 0, 0],
          });
          console.log(pdf.output("datauristring"));
          pdf.save("Average Data Report");
        }
      })
      .catch((error) =>
        toast.error(
          "Unable to download the PDF File. Please contact adminstrator"
        )
      );
  };

  const DownloadExcel = async function () {
    debugger;
    let Pollutent = $("#pollutentid").val();
    if (Pollutent.length > 0) {
      Pollutent.join(",");
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
    if (type == "H") {
      Interval = interval.substr(0, interval.length - 1) * 60;
    } else {
      Interval = interval.substr(0, interval.length - 1);
    }
    let paramUnitnames;

    for (var i = 0; i < SelectedPollutents.length; i++) {
      let filter = AllLookpdata.listPollutents.filter(
        (x) => x.parameterName == SelectedPollutents[i]
      );

      let unitname = AllLookpdata.listReportedUnits.filter(
        (x) => x.id == filter[0].unitID
      );

      if (paramUnitnames == undefined) {
        paramUnitnames =
          filter[0].parameterName + "-" + unitname[0].unitName + ",";
      } else {
        paramUnitnames +=
          filter[0].parameterName + "-" + unitname[0].unitName + ",";
      }
    }
    let params = new URLSearchParams({
      Pollutent: Pollutent,
      Fromdate: Fromdate,
      Todate: Todate,
      Interval: Interval,
      Units: paramUnitnames,
      digit: window.decimalDigit,
      TruncateorRound: window.TruncateorRound,
    });

    // window.open(CommonFunctions.getWebApiUrl() + "api/AirQuality/ExportToExcelAverageData?" + params, "_blank");
    let authHeader = await CommonFunctions.getAuthHeader();

    await fetch(
      CommonFunctions.getWebApiUrl() +
        "api/AirQuality/ExportToExcelAverageData?" +
        params,
      {
        method: "GET",
        headers: authHeader,
      }
    )
      .then((response) => response.blob())
      .then((blob) => {
        // Create a link element and trigger a click on it to download the file
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = Date.now() + ".xlsx"; // Set the desired filename
        link.click();
      })
      .catch((error) => console.error("Error:", error));
  };

  const DownloadExcel2 = async function (filetype) {
    debugger;
    document.getElementById("loader").style.display = "block";

    let Station = "";
    let Pollutent = "";
    // let GroupId = $("#groupid").val();
    Station = $("#stationid").val();
    Pollutent = $("#pollutentid").val();
    if (Pollutent.length > 0) {
      Pollutent.join(",");
    }

    setSelectedPollutents(Pollutent);
    if (Pollutent.length > 0) {
      Pollutent.join(",");
    }
    let Fromdate = document.getElementById("fromdateid").value;
    let Todate = document.getElementById("todateid").value;
    let Interval = document.getElementById("criteriaid").value;
    let isDefaultInterval = defaultInterval.includes(Interval);

    let valid = ReportValidations(
      Station,
      Pollutent,
      Fromdate,
      Todate,
      Interval
    );
    if (!valid) {
      return false;
    }
    setLoadGrid(false);
    document.getElementById("loader").style.display = "block";
    let Intervaltype;
    let isAvgData = false;
    let isRollingAvg = false;
    /*
     let type = interval.substr(interval.length - 1);
     let Interval;
     if (type == 'H') {
       Interval = interval.substr(0, interval.length - 1) * 60;
     } else {
       Interval = interval.substr(0, interval.length - 1);
     }
     */
    let Intervaltypesplit = Interval.split("-");
    if (Interval != "Rolling") {
      if (Intervaltypesplit[1] == "H") {
        Intervaltype = Intervaltypesplit[0] * 60;
      } else {
        Intervaltype = Intervaltypesplit[0];
      }
    } else {
      isRollingAvg = true;
      Intervaltype = 60;
    }
    if (Interval == window.Intervalval) {
      isAvgData = false;
    } else {
      isAvgData = true;
    }

    let paramUnitnames;

    for (var i = 0; i < SelectedPollutents.length; i++) {
      let filter = AllLookpdata.listPollutents.filter(
        (x) => x.parameterName == SelectedPollutents[i]
      );

      let unitname = AllLookpdata.listReportedUnits.filter(
        (x) => x.id == filter[0].unitID
      );

      if (paramUnitnames == undefined) {
        paramUnitnames =
          filter[0].parameterName + "-" + unitname[0].unitName + ",";
      } else {
        paramUnitnames +=
          filter[0].parameterName + "-" + unitname[0].unitName + ",";
      }
    }

    let validRecord = "Valid";
    let params = new URLSearchParams({
      Pollutent: Pollutent,
      Fromdate: Fromdate,
      Todate: Todate,
      Interval: Intervaltype,
      Units: paramUnitnames,
      digit: window.decimalDigit,
      TruncateorRound: window.TruncateorRound,
      validRecord: validRecord,
      fileType: filetype,
      IsDefaultInterval: isDefaultInterval
    });
    let url = CommonFunctions.getWebApiUrl() + "api/AirQuality/ExportToExcel?";
    //  window.open(url + params, "_blank");
    let authHeader = await CommonFunctions.getAuthHeader();

    await fetch(url + params, {
      method: "GET",
      headers: authHeader,
    })
      .then((response) => response.blob())
      .then((blob) => {
        // Create a link element and trigger a click on it to download the file
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        if (filetype == "excel") {
          link.download = Date.now() + ".xlsx";
        } else {
          link.download = Date.now() + ".csv";
        }
        link.click();
      })
      .catch((error) => console.error("Error:", error));
    document.getElementById("loader").style.display = "none";
    /*  fetch(url + params, {
       method: 'GET',
     }).then((response) => response.json())
       .then((data) => {
       }).catch((error) => console.log(error)); */
  };

  const ReportValidations = function (Pollutent, Fromdate, Todate, Interval) {
    let isvalid = true;

    if (Pollutent == "") {
      toast.error("Please select parameter", {
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
      toast.error("Please select from date", {
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
      toast.error("Please select to date", {
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
      toast.error("Please select interval", {
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
  };

  /* reported data end */

  const ChangeStation = function (e) {
    setPollutents([]);

    setcriteria([]);

    let finaldata = AllLookpdata.listPollutents.filter(
      (obj) => obj.stationID == e.target.value
    );

    setPollutents(finaldata);
  };

  const Changepollutent = function (e) {
    setcriteria([]);

    console.log(selectedStations);

    let stationID = document.getElementById("stationid").val();

    let finaldata = AllLookpdata.listPollutents.filter(
      (obj) => obj.stationID == stationID && obj.parameterName == e.target.value
    );

    if (finaldata.length > 0) {
      let finalinterval = [];

      let intervalarr = finaldata[0].avgInterval.split(",");

      for (let i = 0; i < intervalarr.length; i++) {
        let intervalsplitarr = intervalarr[i].split("-");

        finalinterval.push({
          value: intervalsplitarr[0],
          type: intervalsplitarr[1],
        });
      }

      let finalinterval1 = finalinterval.reduce((unique, o) => {
        if (
          !unique.some((obj) => obj.value != o.value && obj.type === o.type)
        ) {
          unique.push(o);
        }

        return unique;
      }, []);

      setcriteria(finalinterval1);
    }
  };

  $("#pollutentid").change(function (e) {
    setcriteria([]);

    let stationID = $("#stationid").val();

    let filter1 = $(this).val();

    // let finaldata = AllLookpdata.listPollutentsConfig.filter(obj => obj.stationID == stationID && obj.parameterName == e.target.value);

    let finaldata = Pollutents.filter(
      (obj) =>
        selectedStations.includes(obj.stationID) || filter1.includes(obj.parameterName)
    );

    if (finaldata.length > 0) {
      let finalinterval = [];

      for (let j = 0; j < finaldata.length; j++) {
        let intervalarr = finaldata[j].avgInterval.split(",");

        for (let i = 0; i < intervalarr.length; i++) {
          let intervalsplitarr = intervalarr[i].split("-");

          let index = finalinterval.findIndex(
            (x) =>
              x.value === intervalsplitarr[0] && x.type === intervalsplitarr[1]
          );

          if (index == -1) {
            finalinterval.push({
              value: intervalsplitarr[0],
              type: intervalsplitarr[1],
            });
          }
        }
      }

      setcriteria(finalinterval);
    }
  });

  const Resetfilters = function () {
    $(".pollutentid")[0].sumo.reload();

    $(".pollutentid")[0].sumo.unSelectAll();
    $('#monitoringTypeId').val("");
    $('#stationid').val("");

    setcriteria([]);

    setToDate(new Date());

    setFromDate(new Date());

    setListReportData(0);

    setSelectedPollutents([]);
  };

  const handleMonitoringTypeChange = (e) => {
    const value = e.target.value;
    $('#stationid').val("");
  
    // If empty, show all stations
    if (value === "") {
      setFilteredStations(Stations);
      return;
    }
  
    const monitoringTypeId = parseInt(value);
  
    const filtered = Stations.filter(
      (s) => s.monitoringTypeId === monitoringTypeId
    );
  
    setFilteredStations(filtered);
  };

  const handleStationChange = (e) => {
    const stationId = e.target.value;
  
    if (stationId === "") {
      setFilteredPollutents([]); // or set original data if needed
      setTimeout(() => {
        if ($('.pollutentid')[0]?.sumo) {
          $('.pollutentid')[0].sumo.reload();
          $('.pollutentid')[0].sumo.unSelectAll();
          $('#pollutentid').trigger('change');
        }
      }, 10);
      return;
    }
  
    const filtered = Pollutents.filter(
      (p) => p.stationID === parseInt(stationId)
    );
  
    setFilteredPollutents(filtered);
    setselectedStations(stationId);

     // set default interval
     const interval = getDefaultInterval(filtered);
     setDefaultInterval(interval);

     // 🔹 Reload SumoSelect
    setTimeout(() => {
      if ($('.pollutentid')[0]?.sumo) {
        $('.pollutentid')[0].sumo.reload();
        $('.pollutentid')[0].sumo.unSelectAll();
        $('#pollutentid').trigger('change');
      }
    }, 10);
  };

  const getDefaultInterval = (pollutents) => {

    const freqPollutent = pollutents.find(
      p => p.dataSyncFrequency && p.dataSyncFrequency > 0
    );
  
    if (!freqPollutent) {
      return ["1-M"];
    }
  
    const frequency = freqPollutent.dataSyncFrequency;
  
    if (frequency >= 60) {
      return [(frequency / 60) + "-H"];
    }
  
    return [1 + "-M"];
  };

  return (
    <main id="main" className="main">
      <div
        className="modal fade zoom dashboard_dmodal"
        id="alertcode"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Codes Information
              </h1>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
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
                      {AllLookpdata.listFlagCodes.map((x, y) => (
                        <tr key={y}>
                          <td>{x.code}</td>

                          <td style={{ backgroundColor: x.colorCode }}>
                            {x.name}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  )}
                </table>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
                Ok
              </button>
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
              <div className="col-lg-2 col-sm-6">
              <label className="form-label">Monitoring Type</label>
              <select
                className="form-select"
                id="monitoringTypeId"
                onChange={handleMonitoringTypeChange}
              >
                <option value="">All</option>
                {ListMonitoringTypes.map((x, y) => (
                  <option value={x.id} key={y}>
                    {x.name}
                  </option>
                ))}
              </select>
            </div>
              <div className="col-lg-2 col-sm-6">
                <label className="form-label">Station Name</label>
                <select className="form-select stationid" id="stationid" onChange={handleStationChange}>
                <option value="" selected>Select Station</option>
                  {filteredStations.map((x, y) => (
                    <option value={x.id} key={y}>
                      {x.stationName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-lg-2 col-sm-6">
                <label className="form-label">Parameters</label>

                <select
                  className="form-select pollutentid"
                  id="pollutentid"
                  multiple="multiple"
                  onChange={Changepollutent}
                >
                  {/* <option selected> Select Pollutents</option> */}

                  {filteredPollutents.map((x, y) => (
                    <option value={x.parameterName} key={y}>
                      {x.parameterName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-lg-2 col-sm-6">
                <label className="form-label">From Date</label>

                <DatePicker
                  className="form-control"
                  id="fromdateid"
                  selected={fromDate}
                  onChange={(date) => setFromDate(date)}
                />
              </div>

              <div className="col-lg-2 col-sm-6">
                <label className="form-label">To Date</label>

                <DatePicker
                  className="form-control"
                  id="todateid"
                  selected={toDate}
                  onChange={(date) => setToDate(date)}
                />
              </div>

              <div className="col-lg-2 col-sm-6">
                <label className="form-label">Interval</label>

                <select className="form-select" id="criteriaid">
                  <option value="" selected>
                    Select Interval
                  </option>
                  {/* <option value="1-M" selected>
                    1-M
                  </option> */}
                    {defaultInterval.map((val, i) => (
                      <option value={val} key={`default-${i}`}>
                        {val}
                      </option>
                    ))}
                  {Criteria.map((x, y) => (
                    <option value={x.value + "-" + x.type} key={y}>
                      {x.value + "-" + x.type}
                    </option>
                  ))}
                  {/*  {Criteria.map((x, y) =>
                    <option value={x.value + x.type} key={y} >{x.value + '-' + x.type}</option>
                  )}  */}
                </select>
              </div>

              <div className="col-md-3 my-4">
                <button
                  type="button"
                  className="btn btn-primary datashow"
                  onClick={getdtareport}
                >
                  GetData
                </button>

                <button
                  type="button"
                  className="btn btn-secondary mx-1 datashow"
                  onClick={Resetfilters}
                >
                  Reset
                </button>

                {ListReportData != 0 && (
                  <span>
                    <button
                      type="button"
                      className="btn btn-primary mx-1"
                      onClick={Codesinformation}
                    >
                      Flags
                    </button>

                    {/* <button type="button" className="btn btn-primary datashow" onClick={DownloadExcel}>Download Excel</button>   */}
                  </span>
                )}
              </div>

              {ReportData?.length > 0 && ListReportData != 0 && (
                <div className="col-md-12 text-center my-3">
                  <button
                    type="button"
                    className="btn btn-primary datashow me-0 download-btn"
                    onClick={() => DownloadExcel2("excel")}
                  >
                    Download Excel
                  </button>
                  &nbsp;
                  <button
                    type="button"
                    className="btn btn-primary datashow me-0"
                    onClick={() => DownloadExcel2("csv")}
                  >
                    Download Csv
                  </button>
                </div>
              )}

              {/*  <button type="button" className="btn btn-primary mx-1 datashow" onClick={DownloadPDF}>Download PDF</button> */}

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
              <div
                id="jsGridData"
                className="jsGrid"
                ref={gridRefjsgridreport}
              />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default AverageDataReport;
