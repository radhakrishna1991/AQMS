import React, { useCallback, useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";
// import DateTimePicker from 'react-datetime-picker';
function Calibration() {
  const $ = window.jQuery;
  const AlarmgridRef = useRef();
  const PhasesgridRef = useRef();
  const SequencegridRef = useRef();

  const [Sequencegridlist, setSequencegridlist] = useState(true);
  const [sequenceList, setSequenceList] = useState(true);
  const [sequenceId, setSequenceId] = useState(0);
  const [SequenceAddbtn, setSequenceAddbtn] = useState(true);
  const [ListSequence, setListSequence] = useState([]);

  const [Phasegridlist, setPhasegridlist] = useState(true);
  const [PhaseList, setPhaseList] = useState(true);
  const [PhaseId, setPhaseId] = useState(true);
  const [ListPhase, setListPhase] = useState([]);
  const [PhaseAddbtn, setPhaseAddbtn] = useState(true);

  const [Alarmgridlist, setAlarmgridlist]=useState(true);
  const [AlarmList, setAlarmList]=useState(true);
  const [AlarmId, setAlarmId]=useState(0);
  const [AlarmAddbtn, setAlarmAddbtn]=useState(true);
  const [ListAlarm, setListAlarm]=useState([]);






  const [starttime, setStarttime] = useState(new Date());
  const [EnableStatus, setEnableStatus] = useState(true);

  const AddSequencechange = function (param) {
    if (param == 'sequencelistTab') {
      setSequencegridlist(true);
    } else {
      setSequencegridlist(false);
      setSequenceAddbtn(true)
    }
  }
  const AddPhasechange = (param) => {
    if (param == 'Phaselistdetails') {
      setPhasegridlist(true);
    } else {
      setPhasegridlist(false);
      setPhaseAddbtn(true);
    }
  }

  const AddAlarmchange=function(param){
    if (param == 'Alarmlistdetails') {
      setAlarmgridlist(true);
    } else {
      setAlarmgridlist(false);
      setAlarmAddbtn(true);
    }
  }

  const SequenceAddValidation = function (type, name) {
    let isvalid = true;
    let form = document.querySelectorAll('#Sequenceform')[0];
    if (type == "") {
      form.classList.add('was-validated');
      isvalid = false;
    } else if (name == "") {
      form.classList.add('was-validated');
      isvalid = false;
    }
    return isvalid;
  }

  const PhaseAddValidation = function (number, name) {
    let isvalid = true;
    let form = document.querySelectorAll("#Phaseform")[0];
    if (number == "") {
      form.classList.add('was-validated');
      isvalid = false;
    }
    else if (name == "") {
      form.classList.add('was-validated');
      isvalid = false;
    }
    return isvalid;
  }

  const AddPhase = function () {
    let phaseformCalibarionSequenceId = sequenceId;
    let phaseformname = document.getElementById("phasename").value;
    let phaseformnumber = document.getElementById("phasenumber").value;
    let phaseformenable = document.getElementById("enabledstatus").checked;
    let CreatedBy = "";
    let ModifiedBy = "";
    let phaseformlevel = document.getElementById("levelstatus").value;
    let phaseformduration = document.getElementById("durationtime").value;
    let phaseformresponsetime = document.getElementById("responsetime").value;
    let confirminginputpattern = '00000';    
    let phaseformstatuspattern = document.getElementById("statuspattern").value;
    let phaseformseekflag = "";

    // let phaseformname='Span';
    // let phaseformnumber='1';
    // let phaseformduration='025M';
    // let phaseformresponsetime='010M';
    // let phaseformenable=true;
    // let phaseformstatuspattern='6,5,4';
    // let phaseformlevel='SPAN';
    // let phaseformCalibarionSequenceId='0';
    // let CreatedBy="";        
    // let ModifiedBy="";
    // let confirminginputpattern='';
    // let phaseformseekflag="";


    let validation = PhaseAddValidation(phaseformnumber, phaseformname);
    if (!validation) {
      return false;
    }

    fetch(process.env.REACT_APP_WSurl + 'api/Phase', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ CalibrationSequenceID: phaseformCalibarionSequenceId, PhaseNumber: phaseformnumber, PhaseName: phaseformname, Enabled: phaseformenable, CreatedBy: CreatedBy, ModifiedBy: ModifiedBy, CalibrationLevelID: phaseformlevel, DurationType: phaseformduration, ResponseTime: phaseformresponsetime, ConfirmingInputPattern: confirminginputpattern, OutputInputPattern: phaseformstatuspattern, SeekFlag: phaseformseekflag }),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == "Phaseadd") {
          toast.success('Phase added successfully');
          GetPhase();
          setPhaseList(true);
        } else if (responseJson == "PhaseExist") {
          toast.error('Phase already exist. Please try with another Name.');
        } else {
          toast.error('Unable to add the Phase. Please contact adminstrator');
        }
      }).catch((error) => toast.error('Unable to add the Phase. Please contact adminstrator'));
  }

  const AddSequence = function () {
    let CalibrationSeqName = document.getElementById("sequencename").value;
    let SourceId = "";
    let EnableStatus = document.getElementById("enablecalibration").checked;
    let CreatedBy = "";
    let ModifiedBy = "";
    let CalibrationTypeEnum = document.getElementById("sequencetype").value;
    let dateval=document.getElementById("starttime").value;
    let valuedate=dateval.split('T');
    let StartTime = valuedate[0] +' ' + valuedate[1];
    let RepeatedInterval = document.getElementById("repeatedinterval").value + document.getElementById("repeatedintervalrole").value[0];
    let StartPattern = "";
    let RecoveryTime = document.getElementById("recoverytime").value + document.getElementById("recoverytimerole").value[0];
    let NumberOfCalibrationRecords = "";
    let NumberOfRuns = "";
    let RunInterval = "";
    let StartupDelay = "";
    let StartupMinute = "";
    let OfflineOutOfControlCheck = false;
    let CentralOutOfControlCheck = false;
    let KeepOtherCalibrationsInStartup = false;
    let RecoveryOutputPattern = "";
    let CalibrationSequenceTypeEnum = "";
    let SeekFlag = "";
    
    
    let validation = SequenceAddValidation(CalibrationTypeEnum, CalibrationSeqName);
    if (!validation) {
      return false;
    }
    fetch(process.env.REACT_APP_WSurl + 'api/Sequence', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    body: JSON.stringify({ CalibrationName: CalibrationSeqName, SourceID: SourceId, Enabled: EnableStatus, CreatedBy: CreatedBy,ModifiedBy: ModifiedBy, CalibrationTypeEnum: CalibrationTypeEnum, Started: StartTime, RepeatInterval: RepeatedInterval, StartPattern: StartPattern, RecoveryTime: RecoveryTime, NumberOfCalibrationRecords: NumberOfCalibrationRecords, NumberOfRuns: NumberOfRuns, RunInterval: RunInterval, StartupDelay: StartupDelay, StartupMinute: StartupMinute, OfflineOutOfControlCheck: OfflineOutOfControlCheck, CentralOutOfControlCheck: CentralOutOfControlCheck, KeepOtherCalibrationsInStartup: KeepOtherCalibrationsInStartup, RecoveryOutputPattern: RecoveryOutputPattern, CalibrationSequenceTypeEnum: CalibrationSequenceTypeEnum, SeekFlag: SeekFlag }),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == "Sequenceadd") {
          toast.success('Sequence added successfully');
          GetSequence();
          setSequenceList(true);
        } else if (responseJson == "userexist") {
          toast.error('Sequence already exist with given Type. Please try with another Type.');
        } else {
          toast.error('Unable to add the Sequence. Please contact adminstrator');
        }
      }).catch((error) => toast.error('Unable to add the Sequence. Please contact adminstrator'));
  }
  const UpdateSequence = function () {
    let SequenceType = document.getElementById("sequencetype").value;
    let SequenceName = document.getElementById("sequencename").value;
    let EnableStatus = document.getElementById("enablecalibration").checked;
    let RecoveryTime = document.getElementById("recoverytime").value + document.getElementById("recoverytimerole").value[0];
    let RepeatedInterval = document.getElementById("repeatedinterval").value + document.getElementById("repeatedintervalrole").value[0];
    let StartTime = document.getElementById("starttime").value;
    let SourceId = "";
    let CreatedBy = "";
    let ModifiedBy = "";
    let NumberOfCalibrationRecords = "";
    let StartPattern = "";
    let NumberOfRuns = "";
    let RunInterval = "";
    let StartupDelay = "";
    let StartupMinute = "";
    let OfflineOutOfControlCheck = false;
    let CentralOutOfControlCheck = false;
    let KeepOtherCalibrationsInStartup = false;
    let RecoveryOutputPattern = "";
    let CalibrationSequenceTypeEnum = "";
    let SeekFlag = "";

    let validation = SequenceAddValidation(SequenceType, SequenceName);
    if (!validation) {
      return false;
    }
    fetch(process.env.REACT_APP_WSurl + 'api/Sequence/' + sequenceId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ CalibrationName: SequenceName, SourceID: SourceId, Enabled: EnableStatus, CreatedBy: CreatedBy, ModifiedBy: ModifiedBy, CalibrationTypeEnum: SequenceType, Started: StartTime, RepeatInterval: RepeatedInterval, StartPattern: StartPattern, RecoveryTime: RecoveryTime, NumberOfCalibrationRecords: NumberOfCalibrationRecords, NumberOfRuns: NumberOfRuns, RunInterval: RunInterval, StartupDelay: StartupDelay, StartupMinute: StartupMinute, OfflineOutOfControlCheck: OfflineOutOfControlCheck, CentralOutOfControlCheck: CentralOutOfControlCheck, KeepOtherCalibrationsInStartup: KeepOtherCalibrationsInStartup, RecoveryOutputPattern: RecoveryOutputPattern, CalibrationSequenceTypeEnum: CalibrationSequenceTypeEnum, SeekFlag: SeekFlag }),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == 1) {
          toast.success('Sequence Updated successfully');
          GetSequence();
          setSequenceList(true);
        } else if (responseJson == 2) {
          toast.error('Sequence already exist with given Sequence Name. Please try with another Sequence Name.');
        } else {
          toast.error('Unable to update the Sequence. Please contact adminstrator');
        }
      }).catch((error) => toast.error('Unable to update the Sequence. Please contact adminstrator')
      );
  }


  const EditSequence = function (param) {
    setSequenceList(false);
    setSequenceId(param.calibrationSequenceID);
    setSequenceAddbtn(false);
    //setStatus(param.status==1?true:false)
    setTimeout(() => {
      document.getElementById("sequencetype").value = param.calibrationTypeEnum;
      document.getElementById("sequencename").value = param.calibrationName;
      //setStatus(param.status==1?true:false)
    }, 1);
  }
  const DeleteSequence = function (item) {
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
        if (isConfirm) {
          let id = item.calibrationSequenceID;
          fetch(process.env.REACT_APP_WSurl + 'api/Sequence/' + id, {
            method: 'DELETE'
          }).then((response) => response.json())
            .then((responseJson) => {
              if (responseJson == 1) {
                toast.success('Sequence deleted successfully')
                GetSequence();
              } else {
                toast.error('Unable to delete Sequence. Please contact adminstrator');
              }
            }).catch((error) => toast.error('Unable to delete Sequence. Please contact adminstrator'));
        }
      });
  }

  const GetSequence = function () {
    fetch(process.env.REACT_APP_WSurl + "api/Sequence", {
      method: 'GET',
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          setListSequence(data);
        }
      }).catch((error) => toast.error('Unable to get the Stations list. Please contact adminstrator'));
  }

  const GetPhase = function () {
    fetch(process.env.REACT_APP_WSurl + "api/Phase", {
      method: 'GET',
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          setListPhase(data);
        }
      }).catch((error) => toast.error('Unable to get the Stations list. Please contact adminstrator'));
  }

  const initializeSequenceJsGrid = function () {
    window.jQuery(SequencegridRef.current).jsGrid({
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
        data: ListSequence,
        loadData: function (filter) {
          $(".jsgrid-filter-row input:text").addClass("form-control").addClass("form-control-sm");
          $(".jsgrid-filter-row select").addClass("custom-select").addClass("custom-select-sm");
          return $.grep(this.data, function (item) {
            return ((!filter.calibrationSequenceID || item.calibrationSequenceID.toUpperCase().indexOf(filter.calibrationSequenceID.toUpperCase()) >= 0)
              && (!filter.calibrationName || item.calibrationName.toUpperCase().indexOf(filter.calibrationName.toUpperCase()) >= 0)

            );
          });
        }
      },
      fields: [
        { name: "calibrationSequenceID", title: "Sequence ID", type: "text" },
        { name: "calibrationName", title: "Sequence Name", type: "text" },
        //{ name: "role", title: "Role", type: "text", },
        {
          type: "control", width: 100, editButton: false, deleteButton: false,
          itemTemplate: function (value, item) {
            // var $result = gridRefjsgrid.current.fields.control.prototype.itemTemplate.apply(this, arguments);

            var $customEditButton = $("<button>").attr({ class: "customGridEditbutton jsgrid-button jsgrid-edit-button" })
              .click(function (e) {
                EditSequence(item);
                /* alert("ID: " + item.id); */
                e.stopPropagation();
              });

            var $customDeleteButton = $("<button>").attr({ class: "customGridDeletebutton jsgrid-button jsgrid-delete-button" })
              .click(function (e) {
                DeleteSequence(item);
                e.stopPropagation();
              });

            return $("<div>").append($customEditButton).append($customDeleteButton);
            //return $result.add($customButton);
          }
        },
      ]
    });
  }

  const initializePhaseJsGrid = function () {
    window.jQuery(PhasesgridRef.current).jsGrid({
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
        data: ListPhase,
        loadData: function (filter) {
          $(".jsgrid-filter-row input:text").addClass("form-control").addClass("form-control-sm");
          $(".jsgrid-filter-row select").addClass("custom-select").addClass("custom-select-sm");
          return $.grep(this.data, function (item) {
            return ((!filter.PhaseNumber || item.PhaseNumber.toUpperCase().indexOf(filter.PhaseNumber.toUpperCase()) >= 0)
              && (!filter.PhaseName || item.PhaseName.toUpperCase().indexOf(filter.PhaseName.toUpperCase()) >= 0)

            );
          });
        }
      },
      fields: [
        { name: "PhaseNumber", title: "Phase Number", type: "text" },
        { name: "PhaseName", title: "Phase Name", type: "text" },
        {
          type: "control", width: 100, editButton: false, deleteButton: false,
          itemTemplate: function (value, item) {
            // var $result = gridRefjsgrid.current.fields.control.prototype.itemTemplate.apply(this, arguments);

            var $customEditButton = $("<button>").attr({ class: "customGridEditbutton jsgrid-button jsgrid-edit-button" })
              .click(function (e) {
                //EditUser(item);
                /* alert("ID: " + item.id); */
                //e.stopPropagation();
              });

            var $customDeleteButton = $("<button>").attr({ class: "customGridDeletebutton jsgrid-button jsgrid-delete-button" })
              .click(function (e) {
                //DeleteUser(item);
                //e.stopPropagation();
              });

            return $("<div>").append($customEditButton).append($customDeleteButton);
          }
        },
      ]
    });
  }

  const initializeAlarmJsGrid = function () {
    window.jQuery(AlarmgridRef.current).jsGrid({
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
        data: ListAlarm,
        loadData: function (filter) {
          $(".jsgrid-filter-row input:text").addClass("form-control").addClass("form-control-sm");
          $(".jsgrid-filter-row select").addClass("custom-select").addClass("custom-select-sm");
          return $.grep(this.data, function (item) {
            return ((!filter.PhaseNumber || item.PhaseNumber.toUpperCase().indexOf(filter.PhaseNumber.toUpperCase()) >= 0)
              && (!filter.PhaseName || item.PhaseName.toUpperCase().indexOf(filter.PhaseName.toUpperCase()) >= 0)

            );
          });
        }
      },
      fields: [
        { name: "AlarmID", title: "Alarm ID", type: "text" },
        { name: "AlarmName", title: "Alarm Name", type: "text" },
        {
          type: "control", width: 100, editButton: false, deleteButton: false,
          itemTemplate: function (value, item) {
            // var $result = gridRefjsgrid.current.fields.control.prototype.itemTemplate.apply(this, arguments);

            var $customEditButton = $("<button>").attr({ class: "customGridEditbutton jsgrid-button jsgrid-edit-button" })
              .click(function (e) {
                //EditUser(item);
                /* alert("ID: " + item.id); */
                //e.stopPropagation();
              });

            var $customDeleteButton = $("<button>").attr({ class: "customGridDeletebutton jsgrid-button jsgrid-delete-button" })
              .click(function (e) {
                //DeleteUser(item);
                //e.stopPropagation();
              });

            return $("<div>").append($customEditButton).append($customDeleteButton);
          }
        },
      ]
    });
  }

  useEffect(() => {
    initializeSequenceJsGrid();
    initializePhaseJsGrid();
    initializeAlarmJsGrid();
  });
  useEffect(() => {
    GetSequence();
    GetPhase();
  }, [])
  return (
    <main id="main" className="main" >
      <section className="section grid_section h100 w100">
        <div className="h100 w100">
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="sequence-tab" data-bs-toggle="tab" data-bs-target="#sequence-tab-pane" type="button" role="tab" aria-controls="sequence-tab-pane" aria-selected="true">Sequence</button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="Phase-tab" data-bs-toggle="tab" data-bs-target="#Phase-tab-pane" type="button" role="tab" aria-controls="Phase-tab-pane" aria-selected="false">Phase</button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link active" id="Alarm-tab" data-bs-toggle="tab" data-bs-target="#Alarm-tab-pane" type="button" role="tab" aria-controls="Alarm-tab-pane" aria-se lected="false" >Alarms</button>
            </li>
          </ul>

          <div className="tab-content" id="myTabContent">
            <div className="tab-pane fade" id="sequence-tab-pane" role="tabpanel" aria-labelledby="sequence-tab" tabIndex="0">
              <div className="me-2 mb-2 float-end">
                {Sequencegridlist && (
                  <span className="operation_class mx-2" onClick={() => AddSequencechange()}><i className="bi bi-plus-circle-fill"></i> <span>Add</span></span>
                )}
                {!Sequencegridlist && (
                  <span className="operation_class mx-2" onClick={() => AddSequencechange('sequencelistTab')}><i className="bi bi-card-list"></i> <span>List</span></span>
                )}
              </div>
              {!Sequencegridlist && (
                <form id="Sequenceform" className="row w100 px-0 mx-0" noValidate>
                  <div className="accordion px-0" id="accordionsequence">
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingOne">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                          Sequence
                        </button>
                      </h2>
                      <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionsequence">
                        <div className="accordion-body">
                          <div className="col-md-4">
                            <div className="row">
                              <label htmlFor="sequencetypelabel" className="form-label col-sm-4">Calibration Type:</label>
                              <div className="col-sm-6">
                                <input type="text" className="form-control" id="sequencetype" placeholder="Enter Calibraion Type" required />
                                <div class="invalid-feedback">Please enter calibraion type</div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="row">
                              <label htmlFor="sequencenamelabel" className="form-label col-sm-4">Calibration Name:</label>
                              <div className="col-sm-6">
                                <input type="text" className="form-control" id="sequencename" placeholder="Enter Calibraion Name" required />
                                <div class="invalid-feedback">Please enter calibraion name</div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="row">
                              <label htmlFor="sequenceenablelabel" className="form-label col-sm-4">Enable:</label>
                              <div className="form-check mt-3 col-sm-6">
                                <input className="form-check-input" type="checkbox" id="enablecalibration" />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="row">
                              <label for="recoverytimelabel" className="form-label col-sm-4">Recovery Time:</label>
                              <div className="col-sm-6">
                                <input type="number" className="form-control" id="recoverytime" placeholder="Enter Recovery Time" />
                                <select className="form-select" id="recoverytimerole" required>
                                  <option value="S">Seconds</option>
                                  <option value="M" selected>Minutes</option>
                                  <option value="H">Hours</option>
                                  <option value="D">Days</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="row">
                              <label for="repeatedintervallabel" className="form-label col-sm-4">Repeated Interval:</label>
                              <div className="col-sm-6">
                                <input type="number" className="form-control" id="repeatedinterval" placeholder="Enter Repeated Interval" />
                                <select className="form-select" id="repeatedintervalrole" required>
                                  <option value="S">Seconds</option>
                                  <option value="M">Minutes</option>
                                  <option value="H">Hours</option>
                                  <option value="D" selected>Days</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="row">
                              <label for="starttimelabel" className="form-label col-sm-4">Start Time:</label>
                              <div className="col-sm-6 mt-3">
                                <input type="datetime-local" id="starttime" name="datetime-local" placeholder="Select a date and time"></input>
                                {/* <DatePicker className="form-control datetime-local" id="starttime" selected={starttime}/> */}
                              </div>
                            </div>
                          </div>
                          <div className="col-my-4">
                            <div className="row">
                              <div className="col-sm-6 mt-3">
                                <button type="button" className="col-sm-4 mt-3">
                                  Recovery Pattern
                                </button>
                                <input type="text" id="recoverypattern"></input>
                              </div>

                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-12 text-center mt-2">
                    {SequenceAddbtn && (
                      <button class="btn btn-primary" onClick={AddSequence} type="button">Add Sequence</button>
                    )}
                    {!SequenceAddbtn && (
                      <button class="btn btn-primary" onClick={UpdateSequence} type="button">Update Sequence</button>
                    )}
                  </div>
                </form>
              )}
              {Sequencegridlist && (
                <div>
                  <div className="jsGrid" ref={SequencegridRef} />
                </div>
              )}
            </div>

            <div className="tab-pane fade" id="Phase-tab-pane" role="tabpanel" aria-labelledby="Phase-tab" tabIndex="0">
              <div className="me-2 mb-2 float-end">
                {Phasegridlist && (
                  <span className="operation_class mx-2" onClick={() => AddPhasechange()}><i className="bi bi-plus-circle-fill"></i> <span>Add</span></span>
                )}
                {!Phasegridlist && (
                  <span className="operation_class mx-2" onClick={() => AddPhasechange('Phaselistdetails')}><i className="bi bi-card-list"></i> <span>List</span></span>
                )}
              </div>
              {!Phasegridlist && (
                <form id="Phaseform" className="row w100 px-0 mx-0" noValidate>
                  <div className="accordion px-0" id="accordionPhase">
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="phaseheadingOne">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#phasecollapseOne" aria-expanded="true" aria-controls="phasecollapseOne">
                          Phases
                        </button>
                      </h2>
                      <div id="phasecollapseOne" className="accordion-collapse collapse show" aria-labelledby="phaseheadingOne" data-bs-parent="#accordionphase">
                        <div className="accordion-body">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="row">
                                <label htmlFor="phaseentryname" className="form-label col-sm-4">Phase Name:</label>
                                <div className="col-sm-8">
                                  <input type="text" className="form-control" id="phasename" placeholder="Enter phase name" required />
                                  <div class="invalid-feedback">Please enter phase name</div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="row">
                                <label htmlFor="phaseentrynumber" className="form-label col-sm-4">Phase Number:</label>
                                <div className="col-sm-8">
                                  <input type="number" className="form-control" id="phasenumber" placeholder="Enter phase number" required />
                                  <div class="invalid-feedback">Please enter phase number</div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="row">
                                <label htmlFor="phasedurationtime" className="form-label col-sm-4">Duration Time:</label>
                                <div className="col-sm-8">
                                  <input type="text" className="form-control" id="durationtime" placeholder="Enter duration time" />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="row">
                                <label htmlFor="phaseresponsetime" className="form-label col-sm-4">Response Time:</label>
                                <div className="col-sm-8">
                                  <input type="text" className="form-control" id="responsetime" placeholder="Enter response time" />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="row">
                                <label htmlFor="phaseenabled" className="form-label col-sm-4">Enable:</label>
                                <div className="col-sm-8 mt-3">
                                  <input className="form-check-input" type="checkbox" id="enabledstatus" />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="row">
                                <label htmlFor="phaseenabled" className="form-label col-sm-4">Status Pattern:</label>
                                <div className="col-sm-8">
                                  <input type="text" className="form-control" id="statuspattern" value="6,5,4" />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="row">
                                <label htmlFor="phaseenabled" className="form-label col-sm-4">Level:</label>
                                <div className="col-sm-8">
                                  <select className="form-select" id="levelstatus">
                                    <option value=""></option>
                                    <option value="ZERO" selected>ZERO</option>
                                    <option value="SPAN">SPAN</option>
                                    <option value="PREC">PREC</option>
                                    <option value="GPT_SPAN">GPT_SPAN</option>
                                    <option value="GPT_PREC">GPT_PREC</option>
                                    <option value="20%">20%</option>
                                    <option value="40%">40%</option>
                                    <option value="60%">60%</option>
                                    <option value="80%">80%</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                    <div className="accordition-item">
                      <h2 className="accordion-header" id="phaseheadingTwo">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#phasecollapseTwo" aria-expanded="true" aria-controls="phasecollapseTwo">
                          Phases Channels
                        </button>
                      </h2>
                      <div id="phasecollapseTwo" className="accordion-collapse collapse show" aria-labelledby="phaseheadingTwo" data-bs-parent="#accordionphase">
                        <div className="accordion-body">
                          <div className="">
                            <div className="row">
                              <div className="col-md-6">
                                <div className="row">
                                  <label htmlFor="phasechannelEnterychannel" className="form-label col-sm-4">Channel:</label>
                                  <div className="col-sm-8">
                                    <select className="form-select" id="channels" required>
                                      <option selected value="">Select channel</option>
                                      <option value="BP">BP</option>
                                      <option value="CH4_ppm" >CH4_ppm</option>
                                      <option value="CH4_ug">CH4_ug</option>
                                      <option value="CO_mg">CO_mg</option>
                                      <option value="CO_ppm">CO_ppm</option>
                                      <option value="GS">GS</option>
                                      <option value="H2S_ppb">H2S_ppb</option>
                                      <option value="H2S_ug">H2S_ug</option>
                                      <option value="HC_mg">HC_mg</option>
                                      <option value="HC_ppm">HC_ppm</option>
                                      <option value="Int_Temp">Int_Temp</option>
                                      <option value="nMHC_mg">nMHC_mg</option>
                                      <option value="nMHC_ppm">nMHC_ppm</option>
                                      <option value="NO_ppb">NO_ppb</option>
                                      <option value="NO_ug">NO_ug</option>
                                      <option value="NO2_ppb">NO2_ppb</option>
                                      <option value="NO2_ug">NO2_ug</option>
                                      <option value="NOX_ppb">NOX_ppb</option>
                                      <option value="NOx_ug">NOx_ug</option>
                                      <option value="O3_ppb">O3_ppb</option>
                                      <option value="O3_ug">O3_ug</option>
                                      <option value="PM10">PM10</option>
                                      <option value="PM25">PM25</option>
                                      <option value="RAIN">RAIN</option>
                                      <option value="RH">RH</option>
                                      <option value="SO2_ppb">SO2_ppb</option>
                                      <option value="SO2_ug">SO2_ug</option>
                                      <option value="Spare">Spare</option>
                                      <option value="Temp">Temp</option>
                                      <option value="WD">WD</option>
                                      <option value="WS">WS</option>
                                    </select>
                                    <div class="invalid-feedback">Please select channel</div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="row">
                                  <label htmlFor="phasechannelEntryexpectedvalue" className="form-label col-sm-4">Expected Value:</label>
                                  <div className="col-sm-8">
                                    <input type="number" className="form-control" id="expectedvalue" placeholder="Enter expected value" />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="row">
                                  <label htmlFor="phasechannelEntryexpectedvaluefromconstant" className="form-label col-sm-4">Expected Value From Constant:</label>
                                  <div className="col-sm-8">
                                    <select className="form-select" id="expectdvalueforconstant">
                                      <option value="">Choose...</option>
                                      <option value="K01">K01</option>
                                      <option value="K02">K02</option>
                                      <option value="K03">K03</option>
                                      <option value="K04">K04</option>
                                      <option value="K05">K05</option>
                                      <option value="K06">K06</option>
                                      <option value="K07">K07</option>
                                      <option value="K08">K08</option>
                                      <option value="K09">K09</option>
                                      <option value="K10">K10</option>
                                      <option value="K11">K11</option>
                                      <option value="K12">K12</option>
                                      <option value="K13">K13</option>
                                      <option value="K14">K14</option>
                                      <option value="K15">K15</option>
                                      <option value="K16">K16</option>
                                      <option value="K17">K17</option>
                                      <option value="K18">K18</option>
                                      <option value="K19">K19</option>
                                      <option value="K20">K20</option>
                                      <option value="K21">K21</option>
                                      <option value="K22">K22</option>
                                      <option value="K23">K23</option>
                                      <option value="K24">K24</option>
                                      <option value="K25">K25</option>
                                      <option value="K26">K26</option>
                                      <option value="K27">K27</option>
                                      <option value="K28">K28</option>
                                      <option value="K29">K29</option>
                                      <option value="K30">K30</option>
                                      <option value="K31">K31</option>
                                      <option value="K32">K32</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="row">
                                  <label htmlFor="phasechannelEntrywriteexpectedvaluetoconstant" className="form-label col-sm-4">Write Expected Value To Constant:</label>
                                  <div className="col-sm-8">
                                    <select className="form-select" id="writeexpectdvaluetoconstant">
                                      <option value="">Choose...</option>
                                      <option value="K01">K01</option>
                                      <option value="K02">K02</option>
                                      <option value="K03">K03</option>
                                      <option value="K04">K04</option>
                                      <option value="K05">K05</option>
                                      <option value="K06">K06</option>
                                      <option value="K07">K07</option>
                                      <option value="K08">K08</option>
                                      <option value="K09">K09</option>
                                      <option value="K10">K10</option>
                                      <option value="K11">K11</option>
                                      <option value="K12">K12</option>
                                      <option value="K13">K13</option>
                                      <option value="K14">K14</option>
                                      <option value="K15">K15</option>
                                      <option value="K16">K16</option>
                                      <option value="K17">K17</option>
                                      <option value="K18">K18</option>
                                      <option value="K19">K19</option>
                                      <option value="K20">K20</option>
                                      <option value="K21">K21</option>
                                      <option value="K22">K22</option>
                                      <option value="K23">K23</option>
                                      <option value="K24">K24</option>
                                      <option value="K25">K25</option>
                                      <option value="K26">K26</option>
                                      <option value="K27">K27</option>
                                      <option value="K28">K28</option>
                                      <option value="K29">K29</option>
                                      <option value="K30">K30</option>
                                      <option value="K31">K31</option>
                                      <option value="K32">K32</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="row">
                                  <label htmlFor="phasechannelEntrywriteresulttoconstant" className="form-label col-sm-4">Write Result To Constant:</label>
                                  <div className="col-sm-8">
                                    <select className="form-select" id="writeresulttoconstant">
                                      <option value="">Choose...</option>
                                      <option value="K01">K01</option>
                                      <option value="K02">K02</option>
                                      <option value="K03">K03</option>
                                      <option value="K04">K04</option>
                                      <option value="K05">K05</option>
                                      <option value="K06">K06</option>
                                      <option value="K07">K07</option>
                                      <option value="K08">K08</option>
                                      <option value="K09">K09</option>
                                      <option value="K10">K10</option>
                                      <option value="K11">K11</option>
                                      <option value="K12">K12</option>
                                      <option value="K13">K13</option>
                                      <option value="K14">K14</option>
                                      <option value="K15">K15</option>
                                      <option value="K16">K16</option>
                                      <option value="K17">K17</option>
                                      <option value="K18">K18</option>
                                      <option value="K19">K19</option>
                                      <option value="K20">K20</option>
                                      <option value="K21">K21</option>
                                      <option value="K22">K22</option>
                                      <option value="K23">K23</option>
                                      <option value="K24">K24</option>
                                      <option value="K25">K25</option>
                                      <option value="K26">K26</option>
                                      <option value="K27">K27</option>
                                      <option value="K28">K28</option>
                                      <option value="K29">K29</option>
                                      <option value="K30">K30</option>
                                      <option value="K31">K31</option>
                                      <option value="K32">K32</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="row">
                                  <label htmlFor="phasechannelEnteryStorecalibrationresult" className="form-label col-sm-4">Store Calibration Results:</label>
                                  <div className="mt-3 col-sm-8">
                                    <input className="form-check-input" type="checkbox" id="storecalibrationresult" />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="row">
                                  <label htmlFor="phasechannelEnteryerrormethod" className="form-label col-sm-4">Error Method:</label>
                                  <div className="col-sm-8">
                                    <select className="form-select" id="errormethod">
                                      <option value="Ambient (L)">Ambient (L)</option>
                                      <option value="CEM (S)">CEM (S)</option>
                                      <option value="Difference" selected>Difference</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="row">
                                  <label htmlFor="phasechannelEnterywarningdriftlimit" className="form-label col-sm-4">Warning Drift Limit:</label>
                                  <div className="col-sm-8">
                                    <input type="text" className="form-control" id="warningdriftlimit" placeholder="Enter warning drift limit" />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="row">
                                  <label htmlFor="phasechannelEnteryoutofcontrollimit" className="form-label col-sm-4">Out of Control Limit:</label>
                                  <div className="col-sm-8">
                                    <input type="text" className="form-control" id="outofcontrollimit" placeholder="Enter out of control limit" />
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
                    {PhaseAddbtn && (
                      <button class="btn btn-primary" onClick={AddPhase} type="button">Add Phase</button>
                    )}
                    {!PhaseAddbtn && (
                      <button class="btn btn-primary" onClick={AddPhase} type="button">Update Phase</button>
                    )}
                  </div>
                </form>
              )}
              {Phasegridlist && (
                <div>
                  <div className="jsGrid" ref={PhasesgridRef} />
                </div>
              )}
            </div>

            <div className="tab-pane fade" id="Alarm-tab-pane" role="tabpanel" aria-labelledby="alaram-tab" tabIndex="0">
              <div className="me-2 mb-2 float-end">
                {Alarmgridlist && (
                  <span className="operation_class mx-2" onClick={() => AddAlarmchange()}><i className="bi bi-plus-circle-fill"></i> <span>Add</span></span>
                )}
                {!Alarmgridlist && (
                  <span className="operation_class mx-2" onClick={() => AddAlarmchange('Alarmlistdetails')}><i className="bi bi-card-list"></i> <span>List</span></span>
                )}

                {/* <span className="operation_class mx-2" onClick={() => AddSequencechange()}><i className="bi bi-plus-circle-fill"></i> <span>Add</span></span> */}

                {/*   {!Sequencegridlist && (
                                    <span className="operation_class mx-2" onClick={() => AddSequencechange('sequencelistTab')}><i className="bi bi-card-list"></i> <span>List</span></span>
                                )} */}
              </div>

              {!Alarmgridlist && (
                <form id="alaramform" className="row w100 px-0 mx-0" noValidate>
                <div className="accordion px-0" id="accordionsequence">
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingTwo">
                      <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                        Alarm
                      </button>
                    </h2>
                    <div id="collapseTwo" className="accordion-collapse collapse show" aria-labelledby="headingTwo" data-bs-parent="#accordionsequence">
                      <div className="accordion-body">
                        <div className="col-md-4">
                          <div className="row">
                            <label htmlFor="alarmname" className="form-label col-sm-4">Alarm Name:</label>
                            <div className="col-sm-6">
                              <input type="text" className="form-control" id="alarmname" placeholder="Enter Alarm Name" required />
                              <div class="invalid-feedback">Please enter alarm name</div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-5">
                          <div className="row">
                            <label htmlFor="alaramenable" className="form-label col-sm-4">Enable:</label>
                            <div className="form-check mt-3 col-sm-6">
                              <input className="form-check-input" type="checkbox" id="enablealaram" />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-5">
                          <div className="row">
                            <label htmlFor="controlalaram" className="form-label col-sm-4">Alarm On Out of Control:</label>
                            <div className="form-check mt-3 col-sm-6">
                              <input className="form-check-input" type="checkbox" id="controlalaram" />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-5">
                          <div className="row">
                            <label htmlFor="driftalaram" className="form-label col-sm-4">Alarm On cal Drift:</label>
                            <div className="form-check mt-3 col-sm-6">
                              <input className="form-check-input" type="checkbox" id="driftalaram" />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-5">
                          <div className="row">
                            <label htmlFor="abortedalaram" className="form-label col-sm-4">Alarm On Cal Aborted:</label>
                            <div className="form-check mt-3 col-sm-6">
                              <input className="form-check-input" type="checkbox" id="abortedalaram" />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-5">
                          <div className="row">
                            <label htmlFor="failurealaram" className="form-label col-sm-4">Alarm On Autoscale Failure:</label>
                            <div className="form-check mt-3 col-sm-6">
                              <input className="form-check-input" type="checkbox" id="failurealaram" />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-5">
                          <div className="row">
                            <label htmlFor="abortedalaram" className="form-label col-sm-4">End Alarm On No Flag:</label>
                            <div className="form-check mt-3 col-sm-6">
                              <input className="form-check-input" type="checkbox" id="abortedalaram" />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="row">
                            <label htmlFor="timeoutinterval" className="form-label col-sm-4">Ack Timeout Interval:</label>
                            <div className="col-sm-6">
                              <input type="text" className="form-control" id="timeoutinterval" placeholder="Enter Timeout Interval" required />
                              <div class="invalid-feedback">Please enter timeout interval</div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="row">
                            <label htmlFor="outputlines" className="form-label col-sm-4">Alarm Output Lines:</label>
                            <div className="col-sm-6">
                              <input type="text" className="form-control" id="outputlines" placeholder="Enter Output Lines" required />
                              <div class="invalid-feedback">Please enter output lines</div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="row">
                            <label htmlFor="inputlines" className="form-label col-sm-4">Alarm Input Lines:</label>
                            <div className="col-sm-6">
                              <input type="text" className="form-control" id="inputlines" placeholder="Enter Input Lines" required />
                              <div class="invalid-feedback">Please enter input lines</div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="row">
                            <label htmlFor="monitoredparameters" className="form-label col-sm-4">Monitored Parameters:</label>
                            <div className="col-sm-6">
                              <input type="text" className="form-control" id="monitoredparameters" placeholder="Enter Monitored Parameters" required />
                              <div class="invalid-feedback">Please enter monitored parameters</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-12 text-center mt-2">
                 {/*  {SequenceAddbtn && ( */}
                    <button class="btn btn-primary" onClick={AddSequence} type="button">Add Alarm</button>
                 {/*  )}
                  {!SequenceAddbtn && (
                    <button class="btn btn-primary" onClick={UpdateSequence} type="button">Update Sequence</button>
                  )} */}
                </div>
              </form>

              )}
              {Alarmgridlist && (
                <div>
                  <div className="jsGrid" ref={AlarmgridRef} />
                </div>
              )}

              


            </div>
          </div>

        </div>

      </section>
    </main>
  );

}
export default Calibration;