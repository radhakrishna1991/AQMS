import React, {useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import Roles from "../config/Roles";

function Sidenavbar() {
  let Params = useParams();
  console.log(Params);
  

  const getUserRole = function ()  {
    const currentUser = JSON.parse(sessionStorage.getItem('UserData'));  
    
    if(currentUser.role.toUpperCase()==window.UserRoles[0].ADMIN.toUpperCase()){
      document.getElementById("Configuration-Panel").style.display="block";
      //document.getElementById("User-subpannel").style.display="block";
      document.getElementById("Admin-Pannel").style.display="block";
    }
    else if(currentUser.role.toUpperCase()==window.UserRoles[0].GUEST.toUpperCase()){      
      document.getElementById("Configuration-Panel").style.display="none";
      //document.getElementById("User-subpannel").style.display="none";
      document.getElementById("Admin-Pannel").style.display="none";
    }
  }
  useEffect(() => {
    getUserRole();
  });

  return (
    <aside id="sidebar" className="sidebar">
      <ul className="sidebar-nav" id="sidebar-nav">

        <li className="nav-item">
          <NavLink to="/Dashboard" className="nav-link animation-forwards animate-delay-1" >
            <i className="bi bi-grid"></i>
            <span>Dashboard</span>
          </NavLink >
        </li>
        {/*  <li className="nav-item">
    <NavLink  to="/Parameters" className="nav-link animation-forwards animate-delay-1" >
      <i className="bi bi-grid"></i>
      <span>Parameters</span>
    </NavLink >
  </li> */}
       
            <li className="nav-item" id="Configuration-Panel">
              <a className="nav-link collapsed animation-forwards animate-delay-2" data-bs-target="#configuration-nav" data-bs-toggle="collapse" href="#">
                <i className="bi bi-menu-button-wide"></i><span>Configuration</span><i className="bi bi-chevron-down ms-auto"></i>
              </a>
              <ul id="configuration-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
                {/* <li>
                  <a className="animation-forwards animate-delay-1 disable" href="components-alerts.html">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                    <span className="animate-fill-mode-forwards">Cal Expected Values</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-2 disable" href="components-accordion.html">
                    <i className="bi bi-circle"></i><span className="animate-fill-mode-forwards">Favorites Editors - All Users</span>
                  </a>
                </li> */}
               {/*  <li>
                  <NavLink to="/GsiModbusDrivers" className="animation-forwards animate-delay-3">
                    <i className="bi bi-circle"></i><span className="animate-fill-mode-forwards">Gsi/Modbus Drivers</span>
                  </NavLink>
                </li> */}
                
              {/*  <li>
                  <a className="animation-forwards animate-delay-4 disable" href="components-breadcrumbs.html">
                    <i className="bi bi-circle"></i><span>Logger Channels</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-5 disable" href="components-buttons.html">
                    <i className="bi bi-circle"></i><span>My Favorites Editor</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-6 disable" href="components-buttons.html">
                    <i className="bi bi-circle"></i><span>Parameter MDL Editor</span>
                  </a>
                </li> */}
               {/*  <li>
                  <NavLink to="/Parameters" className="animation-forwards animate-delay-7">
                    <i className="bi bi-circle"></i><span>Parameter Settings</span>
                  </NavLink>
                </li> */}
                <li>
              <NavLink to="/AddStation" className="animation-forwards animate-delay-2" >
                <i className="bi bi-circle"></i>
                <span>Stations</span>
              </NavLink >
            </li>
            <li>
              <NavLink to="/AddDevice" className="animation-forwards animate-delay-3" >
                <i className="bi bi-circle"></i>
                <span>Devices</span>
              </NavLink >
            </li>
            <li>
              <NavLink to="/AddParameter" className="animation-forwards animate-delay-3" >
                <i className="bi bi-circle"></i>
                <span>Parameters</span>
              </NavLink >
            </li>
           {/*  <li>
                  <NavLink to="/AverageAlarm" className="animation-forwards animate-delay-2" >
                    <i className="bi bi-circle"></i>
                    <span>Average Alarms</span>
                  </NavLink >
                </li>
                <li>
                  <NavLink to="/Channels" className="animation-forwards animate-delay-3">
                    <i className="bi bi-circle"></i><span className="animate-fill-mode-forwards">Channels</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/Calibrations" className="animation-forwards animate-delay-3">
                    <i className="bi bi-circle"></i><span className="animate-fill-mode-forwards">Calibrations</span>
                  </NavLink>
                </li> */}
                {/* <li>
                  <a className="animation-forwards animate-delay-8 disable" href="components-buttons.html">
                    <i className="bi bi-circle"></i><span>PC Configuration</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link collapsed animation-forwards animate-delay-9 disable" data-bs-target="#configuration-nav-sub" data-bs-toggle="collapse" href="#">
                    <i className="bi bi-folder-fill"></i><span>Report Configuration</span><i className="bi bi-chevron-down ms-auto"></i>
                  </a>
                  <ul id="configuration-nav-sub" className="nav-content collapse nav_sub" data-bs-parent="#configuration-nav">
                    <li>
                      <a className="animation-forwards animate-delay-1" href="components-buttons.html">
                        <i className="bi bi-circle"></i><span>Calibration Asset Editor</span>
                      </a>
                    </li>
                    <li>
                      <a className="animation-forwards animate-delay-2" href="components-buttons.html">
                        <i className="bi bi-circle"></i><span>Report Logo Editor</span>
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <a className="nav-link collapsed animation-forwards animate-delay-10 disable" data-bs-target="#configuration-nav-sub1" data-bs-toggle="collapse" href="#">
                    <i className="bi bi-folder-fill"></i><span>Security</span><i className="bi bi-chevron-down ms-auto"></i>
                  </a>
                  <ul id="configuration-nav-sub1" className="nav-content collapse nav_sub" data-bs-parent="#configuration-nav">
                    <li>
                      <a className="animation-forwards animate-delay-1" href="components-buttons.html">
                        <i className="bi bi-circle"></i><span>Api Key Editor</span>
                      </a>
                    </li>
                    <li>
                      <a className="animation-forwards animate-delay-2" href="components-buttons.html">
                        <i className="bi bi-circle"></i><span>Group Permissions</span>
                      </a>
                    </li>
                    <li>
                      <a className="animation-forwards animate-delay-3" href="components-buttons.html">
                        <i className="bi bi-circle"></i><span>Groups Editor</span>
                      </a>
                    </li>
                    <li>
                      <a className="animation-forwards animate-delay-4" href="components-buttons.html">
                        <i className="bi bi-circle"></i><span>My User Info</span>
                      </a>
                    </li>
                    <li>
                      <a className="animation-forwards animate-delay-5" href="components-buttons.html">
                        <i className="bi bi-circle"></i><span>User Editor</span>
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-11 disable" href="components-buttons.html">
                    <i className="bi bi-circle"></i><span>Task Scheduler</span>
                  </a>
                </li> */}
              </ul>
            </li>

            {/* <li className="nav-item">
              <a className="nav-link collapsed animation-forwards animate-delay-2" data-bs-target="#loggerchannels-nav" data-bs-toggle="collapse" href="#">
                <i className="bi bi-menu-button-wide"></i><span>Logger Channels</span><i className="bi bi-chevron-down ms-auto"></i>
              </a>
              <ul id="loggerchannels-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
                <li>
                  <NavLink to="/AverageAlarm" className="animation-forwards animate-delay-2" >
                    <i className="bi bi-circle"></i>
                    <span>Average Alarms</span>
                  </NavLink >
                </li>
                <li>
                  <NavLink to="/Channels" className="animation-forwards animate-delay-3">
                    <i className="bi bi-circle"></i><span className="animate-fill-mode-forwards">Channels</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/Calibrations" className="animation-forwards animate-delay-3">
                    <i className="bi bi-circle"></i><span className="animate-fill-mode-forwards">Calibrations</span>
                  </NavLink>
                </li>

              </ul>

            </li> */}
       
        <li className="nav-item" id="Admin-Pannel">
          <a className="nav-link collapsed animation-forwards animate-delay-2" data-bs-target="#admin-nav" data-bs-toggle="collapse" href="#">
            <i className="bi bi-menu-button-wide"></i><span>Admin</span><i className="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul id="admin-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
            <li id="User-subpannel">
              <NavLink to="/Adduser" className="animation-forwards animate-delay-1" >
                <i className="bi bi-circle"></i>
                <span>Users</span>
              </NavLink >
            </li>
            <li>
              <NavLink to="/UserLogHistory" className="animation-forwards animate-delay-3" >
                <i className="bi bi-circle"></i>
                <span>Users Log</span>
              </NavLink >
            </li>
            <li>
              <NavLink to="/AppLogHistory" className="animation-forwards animate-delay-3" >
                <i className="bi bi-circle"></i>
                <span>Application Log</span>
              </NavLink >
            </li>
          </ul>
        </li>
      {/*   <li className="nav-item">
          <a className="nav-link collapsed animation-forwards animate-delay-3 disable" data-bs-target="#Data-nav" data-bs-toggle="collapse" href="#">
            <i className="bi bi-journal-text"></i><span>Data Editors</span><i className="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul id="Data-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
            <li>
              <a className="animation-forwards animate-delay-1" href="forms-elements.html">
                <i className="bi bi-circle"></i><span>Annotate Data</span>
              </a>
            </li>
            <li>
              <a className="animation-forwards animate-delay-2" href="forms-layouts.html">
                <i className="bi bi-circle"></i><span>Average Data Editor</span>
              </a>
            </li>
            <li>
              <a className="animation-forwards animate-delay-3" href="forms-editors.html">
                <i className="bi bi-circle"></i><span>Batch Reading Updater</span>
              </a>
            </li>
            <li>
              <a className="animation-forwards animate-delay-4" href="forms-validation.html">
                <i className="bi bi-circle"></i><span>LogBook Entry Editor</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link collapsed animation-forwards animate-delay-5" data-bs-target="#Data-nav-sub" data-bs-toggle="collapse" href="#">
                <i className="bi bi-folder-fill"></i><span>Monitor Assessment</span><i className="bi bi-chevron-down ms-auto"></i>
              </a>
              <ul id="Data-nav-sub" className="nav-content collapse nav_sub" data-bs-parent="#Data-nav">
                <li>
                  <a className="animation-forwards animate-delay-1" href="forms-elements.html">
                    <i className="bi bi-circle"></i><span>Pb Analysis Audit</span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </li> */}

        <li className="nav-item">
          <a className="nav-link collapsed animation-forwards animate-delay-4" data-bs-target="#report-nav" data-bs-toggle="collapse" href="#">
            <i className="bi bi-bar-chart"></i><span>Reports</span><i className="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul id="report-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
         {/*    <li>
              <NavLink to="/AirQuality" className="nav-item animation-forwards animate-delay-1" >
                <i className="bi bi-circle"></i>
                <span>AirQuality-Legacy</span>
              </NavLink >
            </li> */}
            <li>
              <NavLink to="/StatisticalReport" className="nav-item animation-forwards animate-delay-2" >
                <i className="bi bi-circle"></i>
                <span>Statistical Reports</span>
              </NavLink >
            </li>
            {/* <li>
              <NavLink to="/PredefinedCharts" className="nav-item animation-forwards animate-delay-3" >
                <i className="bi bi-circle"></i>
                <span>Pre-Defned Charts</span>
              </NavLink >
            </li> <li>
              <NavLink to="/DetailedAnalysisReports" className="nav-item animation-forwards animate-delay-4" >
                <i className="bi bi-circle"></i>
                <span>Detailed Analysis Reports</span>
              </NavLink >
            </li> */}
            <li>
              <NavLink to="/AverageDataReport" className="nav-item animation-forwards animate-delay-5" >
                <i className="bi bi-circle"></i>
                <span>Average Data Reports</span>
              </NavLink >
            </li>
           {/*  <li>
              <NavLink to="/StasticsDataReport" className="nav-item animation-forwards animate-delay-6" >
                <i className="bi bi-circle"></i>
                <span>Statistical Data Reports</span>
              </NavLink >
            </li> */}

            <li>
              <NavLink to="/LiveDataReports" className="nav-item animation-forwards animate-delay-6" >
                <i className="bi bi-circle"></i>
                <span>Live Data Reports</span>
              </NavLink >
            </li>



           {/*  <li className="nav-item">
              <a className="nav-link collapsed animation-forwards animate-delay-1 disable" data-bs-target="#report-nav-sub" data-bs-toggle="collapse" href="#">
                <i className="bi bi-folder-fill"></i><span>Average Reports</span><i className="bi bi-chevron-down ms-auto"></i>
              </a>
              <ul id="report-nav-sub" className="nav-content collapse nav_sub" data-bs-parent="#report-nav">
                <li>
                  <a className="animation-forwards animate-delay-1" href="tables-general.html">
                    <i className="bi bi-circle"></i><span>Average Data Trend</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-2" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Basic Data Export</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-3" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Data With Flags</span>
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link collapsed animation-forwards animate-delay-2 disable" data-bs-target="#report-nav-sub1" data-bs-toggle="collapse" href="#">
                <i className="bi bi-folder-fill"></i><span>Calibration Reports</span><i className="bi bi-chevron-down ms-auto"></i>
              </a>
              <ul id="report-nav-sub1" className="nav-content collapse nav_sub" data-bs-parent="#report-nav">
                <li>
                  <a className="animation-forwards animate-delay-1" href="tables-general.html">
                    <i className="bi bi-circle"></i><span>1-Point QC Summary Report</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-2" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Calibration Annotations Report</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-3" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Calibration Export</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-4" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Calibration Graph Report</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-5" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Calibration Results</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-6" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Calibration Trend Graph</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-7" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Calibration Zero/Span Graph Viewer</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-8" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>DASC Report</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-9" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Multi Phase Calibration Report</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-10" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>USEPA Cal Zero Drift Report</span>
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link collapsed animation-forwards animate-delay-3 disable" data-bs-target="#report-nav-sub2" data-bs-toggle="collapse" href="#">
                <i className="bi bi-folder-fill"></i><span>Configuration</span><i className="bi bi-chevron-down ms-auto"></i>
              </a>
              <ul id="report-nav-sub2" className="nav-content collapse nav_sub" data-bs-parent="#report-nav">
                <li>
                  <a className="animation-forwards animate-delay-1" href="tables-general.html">
                    <i className="bi bi-circle"></i><span>Analog Outputs Configuration Report</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-2" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Average Alarm Report</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-3" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Calibration Alarm Configuration Report</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-4" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Calibration Configuration Report</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-5" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Channel Configuration Report</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-6" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Channel Equation Report</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-7" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Digital IO Configuration Report</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-8" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>GSI Configuration Report</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-9" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Logger Configuration Report</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-10" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Math Equation Report</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-11" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Modbus Instrument Configuration Report</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-12" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Notification Configuration Report</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-13" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Parameter Configuration Report</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-14" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Site Configuration Report</span>
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link collapsed animation-forwards animate-delay-4 disable" data-bs-target="#report-nav-sub3" data-bs-toggle="collapse" href="#">
                <i className="bi bi-folder-fill"></i><span>Converter Efficiency Reports</span><i className="bi bi-chevron-down ms-auto"></i>
              </a>
              <ul id="report-nav-sub3" className="nav-content collapse nav_sub" data-bs-parent="#report-nav">
                <li>
                  <a className="animation-forwards animate-delay-1" href="tables-general.html">
                    <i className="bi bi-circle"></i><span>NO2 Converter Efficiency Precision Report</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-2" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>NO2 Converter Efficiency Span Report</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-3" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>NOy Converter Efficiency Span Report</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-4" href="tables-general.html">
                    <i className="bi bi-circle"></i><span>NOy Converter Efficiency Precision Report</span>
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link collapsed animation-forwards animate-delay-5 disable" data-bs-target="#report-nav-sub4" data-bs-toggle="collapse" href="#">
                <i className="bi bi-folder-fill"></i><span>Internal Reports</span><i className="bi bi-chevron-down ms-auto"></i>
              </a>
              <ul id="report-nav-sub4" className="nav-content collapse nav_sub" data-bs-parent="#report-nav">
                <li>
                  <a className="animation-forwards animate-delay-1" href="tables-general.html">
                    <i className="bi bi-circle"></i><span>Audit Change Viewer</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-2" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Diagnostic Report</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-3" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Exceptional Journal</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-4" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Historical Log Viewer</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-5" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Journal Message Log</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-6" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Login Event History</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-7" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Login Session History</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-8" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Site Node Logger Status</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-9" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Software Version Report</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-10" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Table Size Information</span>
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link collapsed animation-forwards animate-delay-6 disable" data-bs-target="#report-nav-sub5" data-bs-toggle="collapse" href="#">
                <i className="bi bi-folder-fill"></i><span>Logger Reports</span><i className="bi bi-chevron-down ms-auto"></i>
              </a>
              <ul id="report-nav-sub5" className="nav-content collapse nav_sub" data-bs-parent="#report-nav">
                <li>
                  <a className="animation-forwards animate-delay-1" href="tables-general.html">
                    <i className="bi bi-circle"></i><span>Alarm Journal</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-2" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Line Status Report</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-3" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Power Failure Report</span>
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link collapsed animation-forwards animate-delay-7 disable" data-bs-target="#report-nav-sub6" data-bs-toggle="collapse" href="#">
                <i className="bi bi-folder-fill"></i><span>National Reports</span><i className="bi bi-chevron-down ms-auto"></i>
              </a>
              <ul id="report-nav-sub6" className="nav-content collapse nav_sub" data-bs-parent="#report-nav">
                <li>
                  <a className="animation-forwards animate-delay-1" href="tables-general.html">
                    <i className="bi bi-circle"></i><span>Annotations Report</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-2" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Audit Trial Report</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-3" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Logbook Report</span>
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link collapsed animation-forwards animate-delay-8 disable" data-bs-target="#report-nav-sub7" data-bs-toggle="collapse" href="#">
                <i className="bi bi-folder-fill"></i><span>Sample Data Reports</span><i className="bi bi-chevron-down ms-auto"></i>
              </a>
              <ul id="report-nav-sub7" className="nav-content collapse nav_sub" data-bs-parent="#report-nav">
                <li>
                  <a className="animation-forwards animate-delay-1" href="tables-general.html">
                    <i className="bi bi-circle"></i><span>Chromatogram Report</span>
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <a className="animation-forwards animate-delay-9 disable" href="components-buttons.html">
                <i className="bi bi-circle"></i><span>Site Health Report</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link collapsed animation-forwards animate-delay-10 disable" data-bs-target="#report-nav-sub8" data-bs-toggle="collapse" href="#">
                <i className="bi bi-folder-fill"></i><span>Statistical Reports</span><i className="bi bi-chevron-down ms-auto"></i>
              </a>
              <ul id="report-nav-sub8" className="nav-content collapse nav_sub" data-bs-parent="#report-nav">
                <li>
                  <a className="animation-forwards animate-delay-1" href="tables-general.html">
                    <i className="bi bi-circle"></i><span>Data Complettenes Report</span>
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link collapsed animation-forwards animate-delay-11 disable" data-bs-target="#report-nav-sub9" data-bs-toggle="collapse" href="#">
                <i className="bi bi-folder-fill"></i><span>Summary Reports</span><i className="bi bi-chevron-down ms-auto"></i>
              </a>
              <ul id="report-nav-sub9" className="nav-content collapse nav_sub" data-bs-parent="#report-nav">
                <li>
                  <a className="animation-forwards animate-delay-1" href="tables-general.html">
                    <i className="bi bi-circle"></i><span>24 Hour Averages Summary Report</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-2" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Annual Averages Report</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-3" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Annual Maximums Report</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-4" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Dialy Parameter Report</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-5" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Daily Summary Report</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-6" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Daily Valid SO2 Maximum Average Report</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-7" href="tables-data.html">
                    <i className="bi bi-circle"></i><span>Monthly Report</span>
                  </a>
                </li>
              </ul>
            </li> */}
          </ul>
        </li>

       {/*  <li className="nav-item">
          <NavLink to="/DataProcessing" className="nav-link animation-forwards animate-delay-4" >
            <i className="bi bi-grid"></i>
            <span>Data Processing</span>
          </NavLink >
        </li>
        <li className="nav-item">
          <NavLink to="/DataProcessingClient" className="nav-link animation-forwards animate-delay-5" >
            <i className="bi bi-grid"></i>
            <span>Logger Channel Data Processing</span>
          </NavLink >
        </li>
        <li className="nav-item">
          <NavLink to="/LiveData" className="nav-link animation-forwards animate-delay-6" >
            <i className="bi bi-grid"></i>
            <span>Live Data</span>
          </NavLink >
        </li>
        <li className="nav-item">
          <NavLink to="/HistoricalData" className="nav-link animation-forwards animate-delay-7" >
            <i className="bi bi-grid"></i>
            <span>Historical Data</span>
          </NavLink >
        </li> */}
       {/*  <li className="nav-item">
          <a className="nav-link collapsed animation-forwards animate-delay-5 disable" data-bs-target="#utilities-nav" data-bs-toggle="collapse" href="#">
            <i className="bi bi-bar-chart"></i><span>Utilities</span><i className="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul id="utilities-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
            <li className="nav-item">
              <a className="nav-link collapsed animation-forwards animate-delay-1" data-bs-target="#utilities-nav-sub" data-bs-toggle="collapse" href="#">
                <i className="bi bi-folder-fill"></i><span>Archive/Purge Data</span><i className="bi bi-chevron-down ms-auto"></i>
              </a>
              <ul id="utilities-nav-sub" className="nav-content collapse nav_sub" data-bs-parent="#utilities-nav">
                <li>
                  <a className="animation-forwards animate-delay-1" href="charts-chartjs.html">
                    <i className="bi bi-circle"></i><span>Archive Annotations</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-2" href="charts-apexcharts.html">
                    <i className="bi bi-circle"></i><span>Archive Logbook</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-3" href="charts-echarts.html">
                    <i className="bi bi-circle"></i><span>Purge Audit Data</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-4" href="charts-echarts.html">
                    <i className="bi bi-circle"></i><span>Purge Average Data</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-5" href="charts-echarts.html">
                    <i className="bi bi-circle"></i><span>Purge Calibration Data</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-6" href="charts-echarts.html">
                    <i className="bi bi-circle"></i><span>Purge Digital Line Data</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-7" href="charts-echarts.html">
                    <i className="bi bi-circle"></i><span>Purge Journal Messages</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-8" href="charts-echarts.html">
                    <i className="bi bi-circle"></i><span>Purge LogBook Entries</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-9" href="charts-echarts.html">
                    <i className="bi bi-circle"></i><span>Purge Notification</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-10" href="charts-echarts.html">
                    <i className="bi bi-circle"></i><span>Purge Sample Data</span>
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <a className="animation-forwards animate-delay-2" href="charts-apexcharts.html">
                <i className="bi bi-circle"></i><span>Feature Licensing Tool</span>
              </a>
            </li>
            <li>
              <a className="animation-forwards animate-delay-3" href="charts-echarts.html">
                <i className="bi bi-circle"></i><span>Intractive Calibration Tool</span>
              </a>
            </li>
            <li>
              <a className="animation-forwards animate-delay-4" href="charts-echarts.html">
                <i className="bi bi-circle"></i><span>Logger Response File Import</span>
              </a>
            </li>
            <li>
              <a className="animation-forwards animate-delay-5" href="charts-echarts.html">
                <i className="bi bi-circle"></i><span>Math Parameter Calculator</span>
              </a>
            </li>
            <li>
              <a className="animation-forwards animate-delay-6" href="charts-echarts.html">
                <i className="bi bi-circle"></i><span>Site Node Loggeer Toolbox</span>
              </a>
            </li>
            <li>
              <a className="animation-forwards animate-delay-7" href="charts-echarts.html">
                <i className="bi bi-circle"></i><span>SQL Excecution Tool</span>
              </a>
            </li>
            <li>
              <a className="animation-forwards animate-delay-8" href="charts-echarts.html">
                <i className="bi bi-circle"></i><span>System Restart</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link collapsed animation-forwards animate-delay-9" data-bs-target="#utilities-nav-sub1" data-bs-toggle="collapse" href="#">
                <i className="bi bi-folder-fill"></i><span>Table Import/Export</span><i className="bi bi-chevron-down ms-auto"></i>
              </a>
              <ul id="utilities-nav-sub1" className="nav-content collapse nav_sub" data-bs-parent="#utilities-nav">
                <li>
                  <a className="animation-forwards animate-delay-1" href="charts-chartjs.html">
                    <i className="bi bi-circle"></i><span>Average Data Archive Loader</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-2" href="charts-apexcharts.html">
                    <i className="bi bi-circle"></i><span>Database Export</span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </li>

        <li className="nav-item">
          <a className="nav-link collapsed animation-forwards animate-delay-6 disable" data-bs-target="#Status-nav" data-bs-toggle="collapse" href="#">
            <i className="bi bi-gem"></i><span>Status Displays</span><i className="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul id="Status-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
            <li>
              <a className="animation-forwards animate-delay-1" href="icons-bootstrap.html">
                <i className="bi bi-circle"></i><span>Log Viewer</span>
              </a>
            </li>
            <li>
              <a className="animation-forwards animate-delay-2" href="icons-remix.html">
                <i className="bi bi-circle"></i><span>Realtime Data Trending</span>
              </a>
            </li>
            <li>
              <a className="animation-forwards animate-delay-3" href="icons-boxicons.html">
                <i className="bi bi-circle"></i><span>Realtime Tabular Display</span>
              </a>
            </li>
            <li>
              <a className="animation-forwards animate-delay-4" href="icons-boxicons.html">
                <i className="bi bi-circle"></i><span>Service Status</span>
              </a>
            </li>
            <li>
              <a className="animation-forwards animate-delay-5" href="icons-boxicons.html">
                <i className="bi bi-circle"></i><span>Task Status</span>
              </a>
            </li>
          </ul>
        </li>
        <li className="nav-item">
          <a className="nav-link collapsed animation-forwards animate-delay-7 disable" data-bs-target="#List-nav" data-bs-toggle="collapse" href="#">
            <i className="bi bi-gem"></i><span>List Editors</span><i className="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul id="List-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
            <li>
              <a className="animation-forwards animate-delay-1" href="icons-bootstrap.html">
                <i className="bi bi-circle"></i><span>Annotation Category Editor</span>
              </a>
            </li>
            <li>
              <a className="animation-forwards animate-delay-2" href="icons-remix.html">
                <i className="bi bi-circle"></i><span>Logbook Category Editor</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link collapsed animation-forwards animate-delay-3" data-bs-target="#List-nav-sub" data-bs-toggle="collapse" href="#">
                <i className="bi bi-gem"></i><span>Math</span><i className="bi bi-chevron-down ms-auto"></i>
              </a>
              <ul id="List-nav-sub" className="nav-content collapse nav_sub" data-bs-parent="#List-nav">
                <li>
                  <a className="animation-forwards animate-delay-1" href="icons-bootstrap.html">
                    <i className="bi bi-circle"></i><span>Math Consulation Editor</span>
                  </a>
                </li>
                <li>
                  <a className="animation-forwards animate-delay-2" href="icons-remix.html">
                    <i className="bi bi-circle"></i><span>Math Equation Editor</span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </li> */}
        {/*  <li className="nav-heading animation-forwards animate-delay-7">Pages</li> */}
      </ul>
    </aside>
  );
}
export default Sidenavbar;