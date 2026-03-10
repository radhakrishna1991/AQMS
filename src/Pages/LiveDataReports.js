import React, { useCallback, useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import CommonFunctions from "../utils/CommonFunctions";

function LiveDataReports() {
  const $ = window.jQuery;
  const gridRefjsgridreport = useRef();
  const [ListReportData, setListReportData] = useState(0);
  const [SelectedPollutents, setSelectedPollutents] = useState([]);
  const [AllLookpdata, setAllLookpdata] = useState(null);
  const [Autorefresh, setAutorefresh] = useState(true);
  const [Pollutents, setPollutents] = useState([]);
  const [Stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [ListMonitoringTypes, setListMonitoringTypes] = useState([]);
  const [selectedStationId, setSelectedStationId] = useState("");
  const [filteredPollutents, setFilteredPollutents] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [ItemCount, setItemCount] = useState(0);
  const [Gridcall, setGridcall] = useState(false);
  const [RefreshGrid, setRefreshGrid] = useState(false);
  const ListPollutents = useRef([]);
  ListPollutents.current = SelectedPollutents;
  const getDuration = window.LiveDataDuration;
  const Itemcount = useRef();
  Itemcount.current = ItemCount;
  var dataForGrid = [];
  useEffect(() => {
    async function fetchData() {
      let authHeader = await CommonFunctions.getAuthHeader();
      let params = new URLSearchParams({ Pollutent: "", StartIndex: 0 });
      await fetch(
        CommonFunctions.getWebApiUrl() + "api/LiveDataLookup?" + params,
        {
          method: "GET",
          headers: authHeader,
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data != null) {
            setAllLookpdata(data);
            setListReportData(data.count);
            setGridcall(true);
            setRefreshGrid(true);
            // setItemCount(data.count);
            setStations(data.listStations);
            const stationIds = data.listStations.map(s => s.id);
            let finaldata = data.listPollutents.filter(
              x => stationIds.includes(x.stationID)
            );
            // var finaldata1 = [];
            // finaldata1 = finaldata.reduce((unique, o) => {
            //   if (
            //     !unique.some(
            //       (obj) =>
            //         obj.stationID == o.stationID &&
            //         obj.parameterName === o.parameterName
            //     )
            //   ) {
            //     unique.push(o);
            //   }
            //   return unique;
            // }, []);
             setPollutents(finaldata);
             setSelectedPollutents(finaldata);
            setListMonitoringTypes(data.listMonitoringTypes);
            setTimeout(function () {
              $("#pollutentid").SumoSelect({
                triggerChangeCombined: true,
                placeholder: "Select Parameter",
                floatWidth: 200,
                selectAll: true,
                search: true,
                nativeOnDevice: [],
                forceCustomRendering: true,
              });
            }, 100);
          }
        })
        .catch((error) => console.log(error));
    }
    fetchData();
  }, []);
  useEffect(() => {
    initializeJsGrid();
  }, [RefreshGrid, SelectedPollutents]);
  useEffect(() => {
    setFilteredStations(Stations);
  }, [Stations]);
  useEffect(() => {
    if (filteredStations.length > 0) {
  
      const firstStationId = filteredStations[0].id;
  
      setSelectedStationId(firstStationId);
  
      handleStationChange(
        { target: { value: firstStationId } },
        false 
      );
  
    }
  }, [filteredStations]);
  useEffect(() => {
    if (filteredPollutents.length > 0) {
      setTimeout(() => {
        const select = $('#pollutentid')[0];
  
        if (select?.sumo && isInitialLoad) {
          select.sumo.reload();
          select.sumo.selectAll();   // select all parameters
          getdtareport("refresh");
        }
      }, 100);
    }
  }, [filteredPollutents]);
  /* useEffect(() => {
    initializeJsGrid();
  }, [SelectedPollutents]);
   */
  useEffect(() => {
    const interval = setInterval(() => {
      if (Autorefresh) {
        getdtareport("refresh");
      }
    }, getDuration);
    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  });

  /* reported data start */
  const generateDatabaseDateTime = function (date) {
    return date.replace("T", " ").substring(0, 19);
  };
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
      let unitname = AllLookpdata.listReportedUnits.filter(
        (x) => x.id == SelectedPollutents[i].unitID
      );
      var gridheadertitle =
        SelectedPollutents[i].parameterName + "<br>" + unitname[0].unitName;
      let Selectedparametersplit =
        SelectedPollutents[i].parameterName.split(".");
      let Selectedparameter =
        Selectedparametersplit.length > 1
          ? SelectedPollutents[i].parameterName.replace(/\./g, "_@_")
          : SelectedPollutents[i].parameterName;

          layout.push({
            name: Selectedparameter, title: gridheadertitle, type: "text", width: "100px", sorting: false, cellRenderer: function (item, value) {
            let flag = AllLookpdata.listFlagCodes.filter(x => x.id == value[Selectedparameter + "flag"]);
              //let flag = AllLookpdata.listFlagCodes.filter(x => x.id == value[Object.keys(value).find(key => value[key] === item) + "flag"]);
              console.log(item, value,value[Selectedparameter]); 
              
              let bgcolor = flag.length > 0 ? flag[0].colorCode : "#FFFFFF"
              return $("<td>").css("background-color", bgcolor).append(item);
            }
          });
    }
    if (SelectedPollutents.length < 10) {
      for (var p = SelectedPollutents.length; p < 10; p++) {
        layout.push({
          name: "",
          title: "",
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
      paging: true,
      autoload: true,
      pageLoading: true,
      pageButtonCount: 5,
      pageSize: 100,
      pageIndex: 1,
      controller: {
        loadData: async function (filter) {
          var startIndex = (filter.pageIndex - 1) * filter.pageSize;
          return {
            data: await LiveData(
              startIndex,
              startIndex + filter.pageSize,
              filter.sortOrder
            ),
            itemsCount: await Itemcount.current,
          };
        },
      },
      fields: layout,
    });
    $(".jsgrid-grid-body").scroll(function () {
      UpdateColPos(1);
    });
  };
  const LiveData = async function (startIndex, lastIndex, sortorder) {
    dataForGrid = [];
    let StationID = parseInt(selectedStationId);
    let Pollutent = $("#pollutentid").val();
    let finalpollutent = [];
    for (let i = 0; i < Pollutent.length; i++) {
      let filter = Pollutents.filter((x) => x.parameterName == Pollutent[i]);
      finalpollutent.push(filter[0]);
    }
    if (Pollutent.length == 0) {
      //setSelectedPollutents(Pollutents);
      //ListPollutents.current = Pollutents;
    } else {
      //ListPollutents.current = finalpollutent;
      //setSelectedPollutents(finalpollutent);
    }
    if (Pollutent.length > 0) {
      Pollutent.join(",");
    }
    document.getElementById("loader").style.display = "block";
    let params = new URLSearchParams({
      StationID: StationID,
      Pollutent: Pollutent,
      StartIndex: startIndex,
      SortOrder: sortorder,
    });
    let url = CommonFunctions.getWebApiUrl() + "api/LiveDataReport?";
    let authHeader = await CommonFunctions.getAuthHeader();
    return await fetch(url + params, {
      method: "GET",
      headers: authHeader,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          console.log(new Date());
          let data1 = data.map((x) => {
            x.interval = x.createdTime.replace("T", " ");
            return x;
          });

          for (var k = 0; k < data1.length; k++) {
            if (k == 0) {
              //setItemCount(data1[0].count);
              Itemcount.current = data1[0].count;
            }
            var obj = {};
            var temp = dataForGrid.findIndex(
              (x) => x.Date === generateDatabaseDateTime(data1[k].createdTime)
            );
            let paramater = SelectedPollutents.filter(
              (x) => x.id == data1[k].parameterID
            );
            if (paramater.length > 0) {
              let roundedNumber = 0;
              let digit = window.decimalDigit;
              if (window.TruncateorRound == "RoundOff") {
                let num = data1[k].parametervalue;
                roundedNumber = num == null ? num : num.toFixed(digit);
              } else {
                roundedNumber =
                  data1[k].parametervalue == null
                    ? data1[k].parametervalue
                    : CommonFunctions.truncateNumber(
                        data1[k].parametervalue,
                        digit
                      );
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
                dataForGrid[temp][Selectedparameter + "flag"] =
                  data1[k].loggerFlags;
              } else {
                //obj[paramater[0].parameterName] = roundedNumber;

                //obj[paramater[0].parameterName + "flag"] = data1[k].loggerFlags;
                obj[Selectedparameter] = roundedNumber;
                obj[Selectedparameter + "flag"] = data1[k].loggerFlags;
                obj["Date"] = generateDatabaseDateTime(data1[k].createdTime);

                dataForGrid.push(obj);
              }
            }
          }
          document.getElementById("loader").style.display = "none";
          console.log(dataForGrid);
          return dataForGrid;
        }
        document.getElementById("loader").style.display = "none";
      })
      .catch((error) => console.log(error));
  };
  const getdtareport = function (param) {
    //setListReportData([]);
    let Pollutent = $("#pollutentid").val() || [];
    if (Pollutent.length <= 0) {
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
      return;
    }
    let finalpollutent = [];
    for (let i = 0; i < Pollutent.length; i++) {
      let filter = Pollutents.filter((x) => x.parameterName == Pollutent[i] && x.stationID == selectedStationId);
      finalpollutent.push(filter[0]);
    }
    if (param == "reset" || Pollutent.length == 0) {
      //ListPollutents.current = Pollutents;
      setSelectedPollutents(Pollutents);
    } else {
      //ListPollutents.current = finalpollutent;
      setSelectedPollutents(finalpollutent);
    }
    setRefreshGrid(RefreshGrid ? false : true);
    // initializeJsGrid();
  };

  /* reported data end */
  // const Resetfilters = function () {
  //   $(".pollutentid")[0].sumo.reload();
  //   $(".pollutentid")[0].sumo.unSelectAll();
  //   //setGridcall(false);
  //   getdtareport("reset");
  //  setSelectedPollutents(Pollutents);
  // };
  const Resetfilters = function () {

    // make reset behave like initial load
    setIsInitialLoad(true);
  
    if (filteredStations && filteredStations.length > 0) {
  
      const firstStationId = filteredStations[0].id;
  
      setSelectedStationId(firstStationId);
  
      // pass false because this is not a user action
      handleStationChange(
        { target: { value: firstStationId } },
        false
      );
    }
  
    setTimeout(() => {
  
      const select = $("#pollutentid")[0];
  
      if (select?.sumo) {
        select.sumo.reload();
        select.sumo.selectAll();
      }
  
    }, 100);
  
    setSelectedPollutents(Pollutents);
  
    getdtareport("reset");
  
  };
  const handleMonitoringTypeChange = (e) => {
    const value = e.target.value;
    $('#stationid').val("");
    setSelectedStationId("");
  
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
 
  const handleStationChange = (e, isUserAction = true) => {

    const stationId = e.target.value;
  
    if (isUserAction) {
      setIsInitialLoad(false);   // only for manual change
    }
  
    if (stationId === "") {
      setSelectedStationId("");
      setFilteredPollutents([]);
  
      setTimeout(() => {
        if ($('.pollutentid')[0]?.sumo) {
          $('.pollutentid')[0].sumo.reload();
          $(".pollutentid")[0].sumo.unSelectAll();
        }
      }, 10);
  
      return;
    }
  
    const filtered = Pollutents.filter(
      (p) => p.stationID === parseInt(stationId)
    );
  
    setFilteredPollutents(filtered);
    setSelectedStationId(stationId);
  
    setTimeout(() => {
      if ($('.pollutentid')[0]?.sumo) {
        $('.pollutentid')[0].sumo.reload();
        $(".pollutentid")[0].sumo.unSelectAll();
      }
    }, 10);
  };
  return (
    <main id="main" className="main">
      <div
        className="modal fade zoom dashboard_dmodal"
        id="alertcode"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
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
          <div className="mb-4">
            <div className="row align-items-end">
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

              <select
                className="form-select stationid"
                id="stationid"
                value={selectedStationId || ""}
                onChange={handleStationChange}
              >
                <option value="">Select Station</option>
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
                >
                  {filteredPollutents.map((x, y) => (
                    <option value={x.parameterName} key={y}>
                      {x.parameterName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-sm-6 col-9 mt-3">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={getdtareport}
                >
                  Get Data
                </button>
                <button
                  type="button"
                  className="btn btn-secondary mx-1"
                  onClick={Resetfilters}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="btn btn-primary mx-1"
                  onClick={Codesinformation}
                >
                  Flags
                </button>
              </div>
              <div className="col-2 mt-3 mx-auto">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="autorefresh"
                    onChange={(e) => setAutorefresh(e.target.checked)}
                    defaultChecked={Autorefresh}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="autorefresh"
                  >
                    Autorefresh
                  </label>
                </div>
              </div>
              <div className="col-md-12">
                <div className="row">
                  <div id="loader" className="loader"></div>
                </div>
              </div>
            </div>
          </div>
          {Gridcall && <div className="jsGrid" ref={gridRefjsgridreport} />}
        </div>
      </section>
    </main>
  );
}
export default LiveDataReports;
