import React, { useCallback, useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";
// import DateTimePicker from 'react-datetime-picker';
function Calibration(){
    const $ = window.jQuery;
    const AlarmgridRef = useRef();
    const PhasesgridRef = useRef();
    const SequencegridRef = useRef();

    const [Sequencegridlist, setSequencegridlist] = useState(true);
    const [sequenceList, setSequenceList] = useState(true);
    const [sequenceId, setSequenceId] = useState(0);
    const [SequenceAddbtn, setSequenceAddbtn] = useState(true);
    const [ListSequence, setListSequence] = useState([]);




    const [starttime, setStarttime] = useState(new Date());
    const [EnableStatus, setEnableStatus]=useState(true);

    const AddSequencechange=function(param){
        if (param == 'sequencelistTab') {
            setSequencegridlist(true);
          } else {
            setSequencegridlist(false);
            setSequenceAddbtn(true)
          }
    }

    const SequenceAddValidation=function(type,name){
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

    const AddSequence = function () {
        let SequenceType = document.getElementById("sequencetype").value;
        let SequenceName = document.getElementById("sequencename").value;
        let EnableStatus= document.getElementById("enablecalibration").checked;
        let RecoveryTime = document.getElementById("recoverytime").value + document.getElementById("recoverytimerole").value[0];        
        let RepeatedInterval = document.getElementById("repeatedinterval").value + document.getElementById("repeatedintervalrole").value[0];
        let StartTime=document.getElementById("starttime").value;
        let SourceId="";
        let CreatedBy="";        
        let ModifiedBy="";
        let NumberOfCalibrationRecords="";
        let StartPattern="";
        let NumberOfRuns="";
        let RunInterval="";
        let StartupDelay="";
        let StartupMinute="";
        let OfflineOutOfControlCheck=false;
        let CentralOutOfControlCheck=false;
        let KeepOtherCalibrationsInStartup=false;
        let RecoveryOutputPattern="";
        let CalibrationSequenceTypeEnum="";
        let SeekFlag="";

        let validation = SequenceAddValidation(SequenceType,SequenceName);
        if (!validation) {
          return false;
        }
        fetch(process.env.REACT_APP_WSurl + 'api/Sequence', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ CalibrationName: SequenceName, SourceID: SourceId,Enabled:EnableStatus,CreatedBy:CreatedBy,ModifiedBy:ModifiedBy,CalibrationTypeEnum:SequenceType,Started:StartTime,RepeatInterval:RepeatedInterval,StartPattern:StartPattern,RecoveryTime:RecoveryTime,NumberOfCalibrationRecords:NumberOfCalibrationRecords,NumberOfRuns:NumberOfRuns,RunInterval:RunInterval,StartupDelay:StartupDelay,StartupMinute:StartupMinute,OfflineOutOfControlCheck:OfflineOutOfControlCheck,CentralOutOfControlCheck:CentralOutOfControlCheck,KeepOtherCalibrationsInStartup:KeepOtherCalibrationsInStartup,RecoveryOutputPattern:RecoveryOutputPattern,CalibrationSequenceTypeEnum:CalibrationSequenceTypeEnum,SeekFlag:SeekFlag }),
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
    const UpdateSequence=function(){
        let SequenceType = document.getElementById("sequencetype").value;
        let SequenceName = document.getElementById("sequencename").value;
        let EnableStatus= document.getElementById("enablecalibration").checked;
        let RecoveryTime = document.getElementById("recoverytime").value + document.getElementById("recoverytimerole").value[0];        
        let RepeatedInterval = document.getElementById("repeatedinterval").value + document.getElementById("repeatedintervalrole").value[0];
        let StartTime=document.getElementById("starttime").value;
        let SourceId="";
        let CreatedBy="";        
        let ModifiedBy="";
        let NumberOfCalibrationRecords="";
        let StartPattern="";
        let NumberOfRuns="";
        let RunInterval="";
        let StartupDelay="";
        let StartupMinute="";
        let OfflineOutOfControlCheck=false;
        let CentralOutOfControlCheck=false;
        let KeepOtherCalibrationsInStartup=false;
        let RecoveryOutputPattern="";
        let CalibrationSequenceTypeEnum="";
        let SeekFlag="";

        let validation = SequenceAddValidation(SequenceType,SequenceName);
        if (!validation) {
          return false;
        }
        fetch(process.env.REACT_APP_WSurl + 'api/Sequence/' + sequenceId, {
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ CalibrationName: SequenceName, SourceID: SourceId,Enabled:EnableStatus,CreatedBy:CreatedBy,ModifiedBy:ModifiedBy,CalibrationTypeEnum:SequenceType,Started:StartTime,RepeatInterval:RepeatedInterval,StartPattern:StartPattern,RecoveryTime:RecoveryTime,NumberOfCalibrationRecords:NumberOfCalibrationRecords,NumberOfRuns:NumberOfRuns,RunInterval:RunInterval,StartupDelay:StartupDelay,StartupMinute:StartupMinute,OfflineOutOfControlCheck:OfflineOutOfControlCheck,CentralOutOfControlCheck:CentralOutOfControlCheck,KeepOtherCalibrationsInStartup:KeepOtherCalibrationsInStartup,RecoveryOutputPattern:RecoveryOutputPattern,CalibrationSequenceTypeEnum:CalibrationSequenceTypeEnum,SeekFlag:SeekFlag }),
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

    
    const EditUser=function(param){
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
    const DeleteUser=function(item){
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

    useEffect(() => {
        initializeJsGrid();
    });
    useEffect(() => {
        GetSequence();
    }, [])
    const initializeJsGrid = function () {
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
                    EditUser(item);
                    /* alert("ID: " + item.id); */
                    e.stopPropagation();
                  });
    
                var $customDeleteButton = $("<button>").attr({ class: "customGridDeletebutton jsgrid-button jsgrid-delete-button" })
                  .click(function (e) {
                    DeleteUser(item);
                    e.stopPropagation();
                  });
    
                return $("<div>").append($customEditButton).append($customDeleteButton);
                //return $result.add($customButton);
              }
            },
          ]
        });
    }




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
                            <button className="nav-link active" id="Alarm-tab" data-bs-toggle="tab" data-bs-target="#Alarm-tab-pane" type="button" role="tab" aria-controls="Alarm-tab-pane" aria-se  lected="false" >Alarms</button>
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
                                                            <input type="text" className="form-control" id="sequencetype" placeholder="Enter Calibraion Type" required/>
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
                                                                <option value="Seconds">Seconds</option>
                                                                <option value="Minutes" selected>Minutes</option>
                                                                <option value="Hours">Hours</option>
                                                                <option value="Days">Days</option>
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
                                                                <option value="Seconds">Seconds</option>
                                                                <option value="Minutes">Minutes</option>
                                                                <option value="Hours">Hours</option>
                                                                <option value="Days" selected>Days</option>
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
						                <button class="btn btn-primary" onClick={AddSequence} type="button">Add Sequence Entry</button>
						            )}
						            {!SequenceAddbtn && (
						                <button class="btn btn-primary" onClick={UpdateSequence} type="button">Update Sequence Entry</button>
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
                       
                    </div>

                </div>

            </section>
        </main>
    );

}
export default Calibration;