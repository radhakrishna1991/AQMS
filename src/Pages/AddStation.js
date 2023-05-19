
import React, { Component, useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";
function AddStation() {
  const $ = window.jQuery;
  const gridRefjsgridreport = useRef();
  const [ListStations, setListStations] = useState([]);
  const [StationList, setStationList] = useState(true);
  const [StationId, setStationId] = useState(0);
  const [Status, setStatus] = useState(true);
  const currentUser = JSON.parse(sessionStorage.getItem('UserData'));

  const Stationaddvalidation = function (StationName, Description) {
    let isvalid = true;
    let form = document.querySelectorAll('#AddStationform')[0];
    if (StationName == "") {
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
  const Stationadd = function () {
    let StationName = document.getElementById("StationName").value;
    let Description = document.getElementById("Description").value;
   let CreatedBy = currentUser.id;
    let ModifiedBy = currentUser.id;
    let status = Status?1:0;
    let validation = Stationaddvalidation(StationName, Description);
    if (!validation) {
      return false;
    }
    fetch(process.env.REACT_APP_WSurl + 'api/Stations', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ StationName: StationName, Description: Description,Status:status,CreatedBy:CreatedBy,ModifiedBy:ModifiedBy }),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == "Stationadd") {
          toast.success('Station added successfully');
          GetStation();
          setStationList(true);
        } else if (responseJson == "Stationexist") {
          toast.error('Station already exist with given Station Name. Please try with another Station Name.');
        } else {
          toast.error('Unable to add the Station. Please contact adminstrator');
        }
      }).catch((error) => toast.error('Unable to add the Station. Please contact adminstrator'));
  }

  const EditStation = function (param) {
    setStationList(false);
    setStationId(param.id);
    setStatus(param.status==1?true:false)
    setTimeout(() => {
      document.getElementById("StationName").value = param.stationName;
      document.getElementById("Description").value = param.description;
      //setStatus(param.status==1?true:false)
    }, 1);

  }

  const UpdateStation = function () {
    let StationName = document.getElementById("StationName").value;
    let Description = document.getElementById("Description").value;
    let CreatedBy = currentUser.id;
    let ModifiedBy = currentUser.id;
    let status = Status?1:0;
    let validation = Stationaddvalidation(StationName, Description);
    if (!validation) {
      return false;
    }
    fetch(process.env.REACT_APP_WSurl + 'api/Stations/' + StationId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ StationName: StationName, Description: Description,Status:status,CreatedBy:CreatedBy,ModifiedBy:ModifiedBy}),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == 1) {
          toast.success('Station Updated successfully');
          GetStation();
          setStationList(true);
        } else if (responseJson == 2) {
          toast.error('Station already exist with given Station Name. Please try with another Station Name.');
        } else {
          toast.error('Unable to update the Station. Please contact adminstrator');
        }
      }).catch((error) => toast.error('Unable to update the Station. Please contact adminstrator'));
  }

  const DeleteStation = function (item) {
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
          fetch(process.env.REACT_APP_WSurl + 'api/Stations/' + id, {
            method: 'DELETE'
          }).then((response) => response.json())
            .then((responseJson) => {
              if (responseJson == 1) {
                toast.success('Station deleted successfully')
                GetStation();
              } else {
                toast.error('Unable to delete Station. Please contact adminstrator');
              }
            }).catch((error) => toast.error('Unable to delete Station. Please contact adminstrator'));
        }
      });
  }
  const GetStation = function () {
    fetch(process.env.REACT_APP_WSurl + "api/Stations", {
      method: 'GET',
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          setListStations(data);
        }
      }).catch((error) => toast.error('Unable to get the Stations list. Please contact adminstrator'));
  }
  useEffect(() => {
    initializeJsGrid();
  });
  useEffect(() => {
    GetStation();
  }, [])
  const initializeJsGrid = function () {
    window.jQuery(gridRefjsgridreport.current).jsGrid({
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
        data: ListStations,
        loadData: function (filter) {
          $(".jsgrid-filter-row input:text").addClass("form-control").addClass("form-control-sm");
          $(".jsgrid-filter-row select").addClass("custom-select").addClass("custom-select-sm");
          return $.grep(this.data, function (item) {
            return ((!filter.stationName || item.stationName.toUpperCase().indexOf(filter.stationName.toUpperCase()) >= 0)
              && (!filter.description || item.description.toUpperCase().indexOf(filter.description.toUpperCase()) >= 0)
            );
          });
        }
      },
      fields: [
        { name: "stationName", title: "Station Name", type: "text" },
        { name: "description", title: "Description", type: "text" },
        {
          type: "control", width: 100, editButton: false, deleteButton: false,
          itemTemplate: function (value, item) {
            // var $result = gridRefjsgrid.current.fields.control.prototype.itemTemplate.apply(this, arguments);

            var $customEditButton = $("<button>").attr({ class: "customGridEditbutton jsgrid-button jsgrid-edit-button" })
              .click(function (e) {
                EditStation(item);
                /* alert("ID: " + item.id); */
                e.stopPropagation();
              });

            var $customDeleteButton = $("<button>").attr({ class: "customGridDeletebutton jsgrid-button jsgrid-delete-button" })
              .click(function (e) {
                DeleteStation(item);
                e.stopPropagation();
              });

            return $("<div>").append($customEditButton).append($customDeleteButton);
            //return $result.add($customButton);
          }
        },
      ]
    });
  }
  const AddStationchange = function (param) {
    if (param) {
      setStationList(true);
    } else {
      setStationList(false);
      setStationId(0);
    }
  }
  return (
    <main id="main" className="main" >
      <div className="container">
        <div className="pagetitle">
          {!StationList && StationId == 0 && (
            <h1>Add Station</h1>
          )}
          {!StationList && StationId != 0 && (
            <h1>Update Station</h1>
          )}
          {StationList && (
            <h1>Stations List</h1>
          )}
        </div>
        <section className="section">
          <div className="container">
            <div className="me-2 mb-2 float-end">
              {StationList && (
                <span className="operation_class mx-2" onClick={() => AddStationchange()}><i className="bi bi-plus-circle-fill"></i> <span>Add</span></span>
              )}
              {!StationList && (
                <span className="operation_class mx-2" onClick={() => AddStationchange('gridlist')}><i className="bi bi-card-list"></i> <span>List</span></span>
              )}
            </div>
            {!StationList && (
              <form id="AddStationform" className="row">
                <div className="col-md-12 mb-3">
                  <label for="StationName" className="form-label">Station Name:</label>
                  <input type="text" className="form-control" id="StationName" placeholder="Enter station name" required />
                  <div class="invalid-feedback">Please enter station name</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="Description" className="form-label">Description:</label>
                  <textarea class="form-control required" id="Description" rows="3" placeholder="Enter description" required></textarea>
                  <div class="invalid-feedback">Please enter description</div>
                </div>
                <div className="col-md-12">
                  <label for="Status" className="form-label">Status: </label>
                  <div className="form-check d-inline-block form-switch ms-2">
                    <input className="form-check-input" type="checkbox" role="switch" id="Status" onChange={(e) => setStatus(e.target.checked)} defaultChecked={Status} />
                    {Status && (
                      <label className="form-check-label" for="flexSwitchCheckChecked">Active</label>
                    )}
                    {!Status && (
                      <label className="form-check-label" for="flexSwitchCheckChecked">Inactive</label>
                    )}
                  </div>
                </div>

                <div className="col-md-12 text-center">
                  {!StationList && StationId == 0 && (
                    <button className="btn btn-primary" onClick={Stationadd} type="button">Add Station</button>
                  )}
                  {!StationList && StationId != 0 && (
                    <button className="btn btn-primary" onClick={UpdateStation} type="button">Update Station</button>
                  )}
                </div>
              </form>
            )}
            {StationList && (
              <div className="jsGrid" ref={gridRefjsgridreport} />
            )}
          </div>

        </section>

      </div>
    </main>
  );
}
export default AddStation;