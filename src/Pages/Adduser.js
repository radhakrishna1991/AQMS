
import React, { Component, useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";
function Adduser() {
  const $ = window.jQuery;
  const gridRefjsgridreport = useRef();
  const [ListUsers, setListUsers] = useState([]);
  const [UserList, setUserList] = useState(true);
  const [UserId, setUserId] = useState(0);
  const [Notification, setNotification] = useState(true);
  const Useraddvalidation = function (UserName, UserEmail, UserRole) {
    let isvalid = true;
    let form = document.querySelectorAll('#AddUserform')[0];
    if (UserName == "") {
      //toast.warning('Please enter user name');
      form.classList.add('was-validated');
      isvalid = false;
    } else if (UserEmail == "") {
      //toast.warning('Please enter user email');
      form.classList.add('was-validated');
      isvalid = false;
    } else if (UserRole == "") {
      //toast.warning('Please select user role');
      form.classList.add('was-validated');
      isvalid = false;
    }
    return isvalid;
  }
  const Useradd = function () {
    let UserName = document.getElementById("username").value;
    let UserEmail = document.getElementById("useremail").value;
    let UserRole = document.getElementById("userrole").value;
    let validation = Useraddvalidation(UserName, UserEmail, UserRole);
    if (!validation) {
      return false;
    }
    fetch(process.env.REACT_APP_WSurl + 'api/Users', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ UserName: UserName, UserEmail: UserEmail, Role: UserRole }),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == "useradd") {
          toast.success('User added successfully');
          GetUser();
          setUserList(true);
        } else if (responseJson == "userexist") {
          toast.error('User already exist with given email. Please try with another email.');
        } else {
          toast.error('Unable to add the user. Please contact adminstrator');
        }
      }).catch((error) => toast.error('Unable to add the user. Please contact adminstrator'));
  }

  const EditUser = function (param) {
    setUserList(false);
    setUserId(param.id)
    setTimeout(() => {
      document.getElementById("username").value = param.userName;
      document.getElementById("useremail").value = param.userEmail;
     document.getElementById("userrole").value = param.role;
    }, 10);
   
  }

  const UpdateUser=function(){
    let UserName = document.getElementById("username").value;
    let UserEmail = document.getElementById("useremail").value;
    let UserRole = document.getElementById("userrole").value;
    let validation = Useraddvalidation(UserName, UserEmail, UserRole);
    if (!validation) {
      return false;
    }
    fetch(process.env.REACT_APP_WSurl + 'api/Users/' + UserId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ UserName: UserName, UserEmail: UserEmail, Role: UserRole,ID:UserId }),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == 1) {
          toast.success('User Updated successfully');
          GetUser();
          setUserList(true);
        }else if (responseJson == 2) {
          toast.error('User already exist with given email. Please try with another email.');
        } else {
          toast.error('Unable to update the user. Please contact adminstrator');
        }
      }).catch((error) => toast.error('Unable to update the user. Please contact adminstrator'));
  }

  const DeleteUser = function (item) {
    Swal.fire({
      title: "Are you sure?",
      text: ("You want to delete this User !"),
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5cb85c",
      confirmButtonText: "Yes",
      closeOnConfirm: false
    })
      .then(function (isConfirm) {
        if (isConfirm.isConfirmed) {
          let id = item.id;
          fetch(process.env.REACT_APP_WSurl + 'api/Users/' + id, {
            method: 'DELETE'
          }).then((response) => response.json())
            .then((responseJson) => {
              if (responseJson == 1) {
                toast.success('User deleted successfully')
                GetUser();
              } else {
                toast.error('Unable to delete user. Please contact adminstrator');
              }
            }).catch((error) => toast.error('Unable to delete user. Please contact adminstrator'));
        }
      });
  }
  const GetUser = function () {
    fetch(process.env.REACT_APP_WSurl + "api/Users", {
      method: 'GET',
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          setListUsers(data);
        }
      }).catch((error) => toast.error('Unable to get the users list. Please contact adminstrator'));
  }
  useEffect(() => {
    initializeJsGrid();
  });
  useEffect(() => {
    GetUser();
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
        data: ListUsers,
        loadData: function (filter) {
          $(".jsgrid-filter-row input:text").addClass("form-control").addClass("form-control-sm");
          $(".jsgrid-filter-row select").addClass("custom-select").addClass("custom-select-sm");
          return $.grep(this.data, function (item) {
            return ((!filter.userName || item.userName.toUpperCase().indexOf(filter.userName.toUpperCase()) >= 0)
              && (!filter.userEmail || item.userEmail.toUpperCase().indexOf(filter.userEmail.toUpperCase()) >= 0)
              && (!filter.role || item.role.toUpperCase().indexOf(filter.role.toUpperCase()) >= 0)
            );
          });
        }
      },
      fields: [
        { name: "userName", title: "User Name", type: "text" },
        { name: "userEmail", title: "User Email", type: "text" },
        { name: "role", title: "Role", type: "text", },
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
  const Adduserchange = function (param) {
    if (param) {
      setUserList(true);
    } else {
      setUserList(false);
      setUserId(0);
    }
  }
  return (
    <main id="main" className="main" >
      <div className="container">
        <div className="pagetitle">
          {!UserList && UserId==0 && (
            <h1>Add User</h1>
          )}
           {!UserList && UserId!=0 && (
            <h1>Update User</h1>
          )}
          {UserList && (
            <h1>Users List</h1>
          )}
        </div>
        <section className="section">
          <div className="container">
            <div className="me-2 mb-2 float-end">
              {UserList && (
                <span className="operation_class mx-2" onClick={() => Adduserchange()}><i className="bi bi-plus-circle-fill"></i> <span>Add</span></span>
              )}
              {!UserList && (
                <span className="operation_class mx-2" onClick={() => Adduserchange('gridlist')}><i className="bi bi-card-list"></i> <span>List</span></span>
              )}
            </div>
            {!UserList && (
              <form id="AddUserform" className="row">
                <div className="col-md-12 mb-3">
                  <label for="username" className="form-label">User Name:</label>
                  <input type="text" className="form-control" id="username" placeholder="Enter user name" required />
                  <div class="invalid-feedback">Please enter user name.</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="useremail" className="form-label">User Email:</label>
                  <input type="text" className="form-control" id="useremail" placeholder="Enter user email" required />
                  <div class="invalid-feedback">Please enter user email.</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="userrole" className="form-label">User Role:</label>
                  <select className="form-select" id="userrole" required>
                    <option value="" selected>select user role</option>
                    <option value="admin">Admin</option>
                    <option value="guest">Guest</option>
                   {/*  <option value="dataentry">Data Entry</option> */}
                  </select>
                  <div class="invalid-feedback">Please select user role.</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label for="Notification" className="form-label">Notification: </label>
                  <div className="form-check d-inline-block form-switch ms-2">
                    <input className="form-check-input" type="checkbox" role="switch" id="Notification" onChange={(e) => setNotification(e.target.checked)} defaultChecked={Notification} />
                    {Notification && (
                      <label className="form-check-label" for="flexSwitchCheckChecked">On</label>
                    )}
                    {!Notification && (
                      <label className="form-check-label" for="flexSwitchCheckChecked">Off</label>
                    )}
                  </div>
                </div>
                <div className="col-md-12 text-center">
                {!UserList && UserId==0 && (
                  <button className="btn btn-primary" onClick={Useradd} type="button">Add User</button>
                  )}
                  {!UserList && UserId!=0 && (
                      <button className="btn btn-primary" onClick={UpdateUser} type="button">Update User</button>
                  )}
                </div>
              </form>
            )}
            {UserList && (
              <div className="jsGrid" ref={gridRefjsgridreport} />
            )}
          </div>

        </section>

      </div>
    </main>
  );
}
export default Adduser;