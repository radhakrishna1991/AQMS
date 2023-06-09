import React, { useCallback, useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import CommonFunctions from "../utils/CommonFunctions";

function LiveDataReports() {
  const $ = window.jQuery;
  const gridRefjsgridreport = useRef();
  const [ListReportData, setListReportData] = useState(0);
  const [SelectedPollutents, setSelectedPollutents] = useState([]);
  const [AllLookpdata, setAllLookpdata] = useState(null);
  const [Pollutents, setPollutents] = useState([]);
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
    let params = new URLSearchParams({ Pollutent: "", StartIndex: 0 });
    fetch(process.env.REACT_APP_WSurl + "api/LiveDataLookup?" + params)
      .then((response) => response.json())
      .then((data) => {
        if (data != null) {
          setAllLookpdata(data);
          setListReportData(data.count);
          setGridcall(true);
          setRefreshGrid(true);
         // setItemCount(data.count);
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
  }, [RefreshGrid,SelectedPollutents]);
  /* useEffect(() => {
    initializeJsGrid();
  }, [SelectedPollutents]);
   */
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
    layout.push({ name: "Date", title: "Date", type: "text", width: "140px", sorting: true, });
    for (var i = 0; i < SelectedPollutents.length; i++) {
      let unitname = AllLookpdata.listReportedUnits.filter(x => x.id == SelectedPollutents[i].unitID);
      gridheadertitle = SelectedPollutents[i].parameterName + "<br>" + unitname[0].unitName
      layout.push({
        name: SelectedPollutents[i].parameterName, title: gridheadertitle, type: "text", width: "100px", sorting: false, cellRenderer: function (item, value) {
          let flag = AllLookpdata.listFlagCodes.filter(x => x.id == value[Object.keys(value).find(key => value[key] === item) + "flag"]);
          let bgcolor = flag.length > 0 ? flag[0].colorCode : "#FFFFF"
          return $("<td>").css("background-color", bgcolor).append(item);
        }
      });
    }
    if (SelectedPollutents.length < 10) {
      for (var p = SelectedPollutents.length; p < 10; p++) {
        layout.push({ name: "", title: "", type: "text", width: "100px", sorting: false });
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
            data: await LiveData(startIndex, startIndex + filter.pageSize,filter.sortOrder),
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
  const LiveData = async function (startIndex, lastIndex,sortorder) {
    dataForGrid = [];
    let Pollutent = $("#pollutentid").val();
    let finalpollutent = [];
    for (let i = 0; i < Pollutent.length; i++) {
      let filter = Pollutents.filter(x => x.parameterName == Pollutent[i]);
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
      Pollutent.join(',')
    }
    document.getElementById('loader').style.display = "block";
    let params = new URLSearchParams({ Pollutent: Pollutent, StartIndex: startIndex,SortOrder: sortorder });
    let url = process.env.REACT_APP_WSurl + "api/LiveDataReport?"
    return await fetch(url + params, {
      method: 'GET',
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          console.log(new Date());
          let data1 = data.map((x) => { x.interval = x.createdTime.replace('T', ' '); return x; });

          for (var k = 0; k < data1.length; k++) {
            if (k == 0) {
              //setItemCount(data1[0].count);
              Itemcount.current = data1[0].count;
            }
            var obj = {};
            var temp = dataForGrid.findIndex(x => x.Date === generateDatabaseDateTime(data1[k].createdTime));
            let paramater = SelectedPollutents.filter(x => x.id == data1[k].parameterID);
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
                obj["Date"] = generateDatabaseDateTime(data1[k].createdTime);

                dataForGrid.push(obj);
              }
            }

          }
          document.getElementById('loader').style.display = "none";
          return dataForGrid;
        }
        document.getElementById('loader').style.display = "none";
      }).catch((error) => console.log(error));
  }
  const getdtareport = function (param) {
    //setListReportData([]);
    let Pollutent = $("#pollutentid").val();
    let finalpollutent = [];
    for (let i = 0; i < Pollutent.length; i++) {
      let filter = Pollutents.filter(x => x.parameterName == Pollutent[i]);
      finalpollutent.push(filter[0]);
    }
    if (param == 'reset' || Pollutent.length == 0) {
      //ListPollutents.current = Pollutents;
      setSelectedPollutents(Pollutents);
    } else {
      //ListPollutents.current = finalpollutent;
      setSelectedPollutents(finalpollutent);
    }
    setRefreshGrid(RefreshGrid?false:true);
   // initializeJsGrid();
  }


  /* reported data end */
  const Resetfilters = function () {
    $('.pollutentid')[0].sumo.reload();
    $('.pollutentid')[0].sumo.unSelectAll();
    //setGridcall(false);
    getdtareport('reset');
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
              <div className="col-md-3">
                <label className="form-label">Parameters</label>
                <select className="form-select pollutentid" id="pollutentid" multiple="multiple">
                  {Pollutents.map((x, y) =>
                    <option value={x.parameterName} key={y} >{x.parameterName}</option>
                  )}
                </select>
              </div>
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
            </div>
            {Gridcall && (
              <div className="jsGrid" ref={gridRefjsgridreport} />
            )}
          </div>
        </div>
      </section>

    </main>
  );
}
export default LiveDataReports;