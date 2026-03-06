import React, { Component, useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import CommonFunctions from "../utils/CommonFunctions";
function AlarmHistory() {
  const $ = window.jQuery;
  const gridRefjsgridreport = useRef();
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [Isgrid, setIsgrid] = useState(0);
  const [grid, setgrid] = useState(false);
  const [ListStations, setListStations] = useState([]);
  const [AllLookpdata, setAllLookpdata] = useState(null);
  const [Stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [ListMonitoringTypes, setListMonitoringTypes] = useState([]);
  const [Listparameters, setListparameters] = useState([]);
  const [filteredPollutents, setFilteredPollutents] = useState([]);
  const [selectedStations, setselectedStations] = useState([]);
  const currentUser = JSON.parse(sessionStorage.getItem("UserData"));
  const [ItemCount, setItemCount] = useState(0);

  const Itemcount = useRef();
  Itemcount.current = ItemCount;
  var dataForGrid = [];

  useEffect(() => {
    GetParameters();
  }, []);
  useEffect(() => {
    grid && initializeJsGrid();
  }, [grid]);
  useEffect(() => {
    setFilteredStations(Stations);
  }, [Stations]);

  const GetParameters = async function () {
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + "api/AirQuality/GetAllLookupData", {
      method: "GET",
      headers: authHeader,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
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
          setListMonitoringTypes(data.listMonitoringTypes);
          setListparameters(finaldata1);
          setTimeout(function () {
            $("#pollutentid").SumoSelect({
              triggerChangeCombined: true,
              placeholder: "Select Parameters",
              floatWidth: 200,
              selectAll: true,
              search: true,
              nativeOnDevice: [],
              forceCustomRendering: true,
            });
          }, 100);
        }
      })
      .catch((error) =>
        toast.error(
          "Unable to get the parameter list. Please contact adminstrator"
        )
      );
  };

  const getalarmdata = function () {
    let Pollutent = $("#pollutentid").val();
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
    setgrid(true);
    setIsgrid(1);
  };

  const getdata = async function (startIndex, lastIndex, sortorder) {
    // debugger;
    let Pollutent = $("#pollutentid").val();
    if (Pollutent.length > 0) {
      Pollutent.join(",").toString();
    }
    let Fromdate = document.getElementById("fromdateid").value;
    let Todate = document.getElementById("todateid").value;
    document.getElementById("loader").style.display = "block";
    let SortOrder =
      sortorder == undefined || sortorder == "desc" ? "asc" : "desc";
    let params = new URLSearchParams({
      Pollutent: Pollutent,
      Fromdate: Fromdate,
      Todate: Todate,
      StartIndex: startIndex,
      SortOrder: SortOrder,
    });
    let authHeader = await CommonFunctions.getAuthHeader();
    return await fetch(
      CommonFunctions.getWebApiUrl() + "api/AlarmHistory?" + params,
      {
        method: "GET",
        headers: authHeader,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          let finallist = data.listAlarms;
          Itemcount.current = data.count;
          let data1 = finallist.map((x) => {
            x.startDate = x.startDate.replace("T", " ").substring(0, 19);
            return x;
          });
          let data2 = data1.map((x) => {
            x.endDate = x.endDate?.replace("T", " ").substring(0, 19);
            return x;
          });
          dataForGrid = data2;
          document.getElementById("loader").style.display = "none";
          return dataForGrid;
        }
      })
      .catch((error) =>
        toast.error(
          "Unable to get the parameter list. Please contact adminstrator"
        )
      )
      .finally(() => {
        setgrid(false);
      });
  };

  const Resetalarmdata = function () {
    $(".pollutentid")[0].sumo.reload();
    $(".pollutentid")[0].sumo.unSelectAll();
    setFromDate(new Date());
    setToDate(new Date());
    setIsgrid(0);
  };

  const initializeJsGrid = function () {
    dataForGrid = [];
    window.jQuery(gridRefjsgridreport.current).jsGrid({
      width: "100%",
      height: "auto",
      filtering: false,
      editing: false,
      inserting: false,
      sorting: false,
      autoload: true,
      paging: true,
      pageLoading: true,
      pageButtonCount: 5,
      pageSize: 100,
      pageIndex: 1,
      controller: {
        loadData: async function (filter) {
          var startIndex = (filter.pageIndex - 1) * filter.pageSize;
          return {
            data: await getdata(
              startIndex,
              startIndex + filter.pageSize,
              filter.sortOrder
            ),
            itemsCount: await Itemcount.current,
          };
        },
      },
      fields: [
        {
          name: "parameterName",
          title: "Paremeter Name",
          type: "text",
          align: "left",
        },
        {
          name: "deviceName",
          title: "Device Name",
          type: "text",
          align: "left",
        },
        { name: "alarmName", title: "Alarm", type: "text", align: "left" },
        { name: "startDate", title: "Start Date", type: "text", align: "left" },
        { name: "endDate", title: "End Date", type: "text", align: "left" },
      ],
    });
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
      return;
    }
  
    const filtered = Listparameters.filter(
      (p) => p.stationID === parseInt(stationId)
    );
  
    setFilteredPollutents(filtered);
    setselectedStations(stationId);

     // 🔹 Reload SumoSelect
    setTimeout(() => {
      if ($('.pollutentid')[0]?.sumo) {
        $('.pollutentid')[0].sumo.reload();
        $('.pollutentid')[0].sumo.unSelectAll();
        $('#pollutentid').trigger('change');
      }
    }, 10);
  };

  return (
    <main id="main" className="main">
      <div className="container">
        <section className="section">
          <div className="container">
            <div className="row row-cols-lg-5 row-cols-sm-2 g-3">
            <div className="col">
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
              <div className="col">
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
              <div className="col">
                <label className="form-label">Parameters</label>
                <select
                  className="form-select pollutentid"
                  id="pollutentid"
                  multiple="multiple"
                >
                  {/* <option selected> Select Pollutents</option> */}
                  {filteredPollutents.map((x, y) => (
                    <option value={x.id} key={y}>
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
              <div className="col-md-3 my-4">
                <button
                  type="button"
                  className="btn btn-primary datashow"
                  onClick={getalarmdata}
                >
                  GetData
                </button>
                <button
                  type="button"
                  className="btn btn-secondary mx-1 datashow"
                  onClick={Resetalarmdata}
                >
                  Reset
                </button>
              </div>
              <div className="col-md-4">
                <div className="row">
                  <div id="loader" className="loader"></div>
                </div>
              </div>
            </div>
            {Isgrid != 0 && (
              <div className="jsGrid" ref={gridRefjsgridreport} />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
export default AlarmHistory;
