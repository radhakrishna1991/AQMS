
import React, { Component, useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";

function AverageAlarm() {
  const $ = window.jQuery;
  const AvgAlarmjsgridref = useRef();
  const [AvgAlarmgridlist, setAvgAlarmgridlist] = useState(true);
  const [AvgAlarmList, setAvgAlarmList] = useState([]);
  const [AvgAlarmId, setAvgAlarmId] = useState(0);
  const [Status, setStatus] = useState(true);
  const [AvgAlarmAddbtn, setAvgAlarmAddbtn] = useState(true);

  const AvgAlarmvalidation = function (AvgAlarmName, Description) {
    let isvalid = true;
    let form = document.querySelectorAll('#AddStationform')[0];
    if (AvgAlarmName == "") {
      //toast.warning('Please enter Station Name');
      form.classList.add('was-validated');
      isvalid = false;
    } else if (Description == "") {
      //toast.warning('Please enter Descriptin');
      form.classList.add('was-validated');
      isvalid = false;
    }
    return isvalid;
  }

  const AddAvgAlarm = (event) => {
    let AverageAlarmName = document.getElementById("alarmname").value;
    let Enabled="1";
    let SourceID="1";
    let ReadingAverageIntervalID="1";
    let AlarmOnFlags="0";
    let InhibitingFlags="0";
    let OutputPattern="1";
    let OutputToAlarmPort="0";
    let AcknowledgeInputPattern="2";
    let AutoAcknowledgeInterval="1";
    let EndOnNoFlags="0";
    let CreatedBy = "";
    let ModifiedBy = "";

    let validation = AvgAlarmvalidation(AverageAlarmName, SourceID);
    if (!validation) {
      return false;
    }
    
    fetch(process.env.REACT_APP_WSurl + 'api/AverageAlarm', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ AverageAlarmName: AverageAlarmName, Enabled: Enabled,SourceID:SourceID,ReadingAverageIntervalID:ReadingAverageIntervalID,AlarmOnFlags:AlarmOnFlags,InhibitingFlags:InhibitingFlags,OutputPattern:OutputPattern,OutputToAlarmPort:OutputToAlarmPort,AcknowledgeInputPattern:AcknowledgeInputPattern,AutoAcknowledgeInterval:AutoAcknowledgeInterval,EndOnNoFlags:EndOnNoFlags }),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == "AvgAlarmadd") {
          GetAvgAlarm();
          setAvgAlarmAddbtn(true);
          setAvgAlarmgridlist(true);
          toast.success('Average alarm added successfully');
        } else if (responseJson == "Instrumentexist") {
            toast.error('Average alarm already exist with given Name. Please try with another Name.');
        } else {
            toast.error('Unable to add the Alarm. Please contact adminstrator');
        }
      }).catch((error) => toast.error('Unable to add the alarm. Please contact adminstrator'));
  }
 
  const EditAvgAlarm = function (param) {
    setAvgAlarmgridlist(false);
    setAvgAlarmId(param.id);
    setAvgAlarmAddbtn(false);
    setStatus(param.status==1?true:false)
    setTimeout(() => {
      document.getElementById("alarmname").value = param.averageAlarmName;
      document.getElementById("alarmFlag").value = param.alarmOnFlags;
      document.getElementById("inhibitingFlags").value = param.inhibitingFlags;
      document.getElementById("Enablealarm").value = param.enabled;
      document.getElementById("avgInterval").value = param.autoAcknowledgeInterval;
      
      //setStatus(param.status==1?true:false)
    }, 1);

  }

  const UpdateAvgAlarm = function () {
    let AverageAlarmName = document.getElementById("alarmname").value;
    let Enabled="1";
    let SourceID="1";
    let ReadingAverageIntervalID="1";
    let AlarmOnFlags="0";
    let InhibitingFlags="0";
    let OutputPattern="1";
    let OutputToAlarmPort="0";
    let AcknowledgeInputPattern="2";
    let AutoAcknowledgeInterval="1";
    let EndOnNoFlags="0";
    let CreatedBy = "";
    let ModifiedBy = "";
    let validation = AvgAlarmvalidation(AverageAlarmName, SourceID);
    if (!validation) {
      return false;
    }
    fetch(process.env.REACT_APP_WSurl + 'api/AverageAlarm/' + AvgAlarmId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ AverageAlarmName: AverageAlarmName, Enabled: Enabled,SourceID:SourceID,ReadingAverageIntervalID:ReadingAverageIntervalID,AlarmOnFlags:AlarmOnFlags,InhibitingFlags:InhibitingFlags,OutputPattern:OutputPattern,OutputToAlarmPort:OutputToAlarmPort,AcknowledgeInputPattern:AcknowledgeInputPattern,AutoAcknowledgeInterval:AutoAcknowledgeInterval,EndOnNoFlags:EndOnNoFlags }),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == 1) {
          toast.success('Average alarm Updated successfully');
          GetAvgAlarm();
          setAvgAlarmAddbtn(true);
        } else if (responseJson == 2) {
          toast.error('Alarm already exist with given Name. Please try with another Name.');
        } else {
          toast.error('Unable to update the Alarm. Please contact adminstrator');
        }
      }).catch((error) => toast.error('Unable to update the Alarm. Please contact adminstrator'));
  }

  const DeleteAvgAlarm = function (item) {
    Swal.fire({
      title: "Are you sure?",
      text: ("You want to delete this Station !"),
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5cb85c",
      confirmButtonText: "Yes",
      closeOnConfirm: false
    })
      .then(function (isConfirm) {
        if (isConfirm.isConfirmed) {
          let id = item.id;
          fetch(process.env.REACT_APP_WSurl + 'api/AverageAlarm/' + id, {
            method: 'DELETE'
          }).then((response) => response.json())
            .then((responseJson) => {
              if (responseJson == 1) {
                toast.success('Alarm deleted successfully')
                GetAvgAlarm();
              } else {
                toast.error('Unable to delete Alarm. Please contact adminstrator');
              }
            }).catch((error) => toast.error('Unable to delete Alarm. Please contact adminstrator'));
        }
      });
  }
  const GetAvgAlarm = function () {
    fetch(process.env.REACT_APP_WSurl + "api/AverageAlarm", {
      method: 'GET',
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
            setAvgAlarmList(data);
        }
      }).catch((error) => toast.error('Unable to get the Average Alarm list. Please contact adminstrator'));
  }
  useEffect(() => {
    initializeJsGrid();
  });
  useEffect(() => {
    GetAvgAlarm();
  }, [])
  const initializeJsGrid = function () {
    window.jQuery(AvgAlarmjsgridref.current).jsGrid({
      width: "100%",
      height: "auto",
      filtering: true,
      editing: false,
      inserting: false,
      sorting: true,
      paging: true,
      autoload: true,
      pageSize: 100,
      pageButtonCount: 5,
      controller: {
        data: AvgAlarmList,
        loadData: function (filter) {
          $(".jsgrid-filter-row input:text").addClass("form-control").addClass("form-control-sm");
          $(".jsgrid-filter-row select").addClass("custom-select").addClass("custom-select-sm");
          return $.grep(this.data, function (item) {
            return ((!filter.averageAlarmName || item.averageAlarmName.toUpperCase().indexOf(filter.averageAlarmName.toUpperCase()) >= 0)
              && (!filter.autoAcknowledgeInterval || item.autoAcknowledgeInterval.indexOf(filter.autoAcknowledgeInterval) >= 0)
            );
          });
        }
      },
      fields: [
        { name: "averageAlarmName", title: "Average Alarm Name", type: "text" },
        { name: "autoAcknowledgeInterval", title: "Average Interval", type: "text" },
        {
          type: "control", width: 100, editButton: false, deleteButton: false,
          itemTemplate: function (value, item) {
            // var $result = gridRefjsgrid.current.fields.control.prototype.itemTemplate.apply(this, arguments);

            var $customEditButton = $("<button>").attr({ class: "customGridEditbutton jsgrid-button jsgrid-edit-button" })
              .click(function (e) {
                EditAvgAlarm(item);
                /* alert("ID: " + item.id); */
                e.stopPropagation();
              });

            var $customDeleteButton = $("<button>").attr({ class: "customGridDeletebutton jsgrid-button jsgrid-delete-button" })
              .click(function (e) {
                DeleteAvgAlarm(item);
                e.stopPropagation();
              });

            return $("<div>").append($customEditButton).append($customDeleteButton);
            //return $result.add($customButton);
          }
        },
      ]
    });
  }
  const AddAvgAlarmchange = function (param) {
    if (param) {
        setAvgAlarmgridlist(true);
    } else {
        setAvgAlarmgridlist(false);
        setAvgAlarmAddbtn(true);
        setAvgAlarmId(0);
    }
  }
  return (
    <main id="main" className="main" >
      <div className="container">
      <div className="me-2 mb-2 float-end">
                {AvgAlarmgridlist && (
                  <span className="operation_class mx-2" onClick={() => AddAvgAlarmchange()}><i className="bi bi-plus-circle-fill"></i> <span>Add</span></span>
                )}
                {!AvgAlarmgridlist && (
                  <span className="operation_class mx-2" onClick={() => AddAvgAlarmchange('AvgAlarmList')}><i className="bi bi-card-list"></i> <span>List</span></span>
                )}
              </div>
              {!AvgAlarmgridlist && (
                <form id="AvgAlarmform" className="row w100 px-0 mx-0" noValidate>
                  <div className="accordion px-0" id="accordionAlarm">
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingOne">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                          Average Alarms
                        </button>
                      </h2>
                      <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionAlarm">
                        <div className="accordion-body">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="row">
                                <label htmlFor="alarmname" className="form-label col-sm-4">Alarm Name:</label>
                                <div className="col-sm-8">
                                  <input type="text" className="form-control" id="alarmname" placeholder="Enter alarm name" required />
                                  <div class="invalid-feedback">Please enter alarm name</div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="row">
                                <label htmlFor="avgInterval" className="form-label col-sm-4">Average Interval:</label>
                                <div className="col-sm-8">
                                  <input type="text" className="form-control" id="avgInterval" placeholder="Enter average interval" required/>
                                  <div class="invalid-feedback">Please enter average interval</div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="row">
                                <label htmlFor="alarmFlag" className="form-label col-sm-4">Alarm on Flags:</label>
                                <div className="col-sm-8">
                                  <input type="text" className="form-control" id="alarmFlag" maxLength="3" placeholder="Enter alarm flag" />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="row">
                                <label htmlFor="inhibitingFlags" className="form-label col-sm-4">Inhibiting Flags:</label>
                                <div className="col-sm-8">
                                  <input type="text" className="form-control" id="inhibitingFlags" maxLength="3" placeholder="Enter inhibiting flags" />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="row">
                                <div className="col-sm-12">
                                  <div className="form-check mt-3">
                                    <label className="form-check-label" htmlFor="Enablealarm">
                                      Enabled
                                    </label>
                                    <input className="form-check-input" type="checkbox" id="Enablealarm" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-12 text-center mt-2">
                    {AvgAlarmAddbtn && (
                      <button class="btn btn-primary" onClick={AddAvgAlarm} type="button">Add Average Alarm</button>
                    )}
                    {!AvgAlarmAddbtn && (
                      <button class="btn btn-primary" onClick={UpdateAvgAlarm} type="button">Update Average Alarm</button>
                    )}
                  </div>
                </form>
              )}
              {AvgAlarmgridlist && (
                <div>
                  <div className="jsGrid" ref={AvgAlarmjsgridref} />
                </div>
              )}

      </div>
    </main>
  );
}
export default AverageAlarm;