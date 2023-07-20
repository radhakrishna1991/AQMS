import { useState,useEffect } from "react";
import React from "react";
import { NavLink } from "react-router-dom";
import { toast } from 'react-toastify';
function Header() {
  const [ListStations, setListStations] = useState([]);

  const user = JSON.parse(sessionStorage.getItem('UserData'));
  const sidebartoggle = (e) => {
    document.querySelector('body').classList.toggle('toggle-sidebar')
  }
  const Signout = function () {
    fetch(process.env.REACT_APP_WSurl +'api/Users/Logout', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ID: user.id }),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson) {
          sessionStorage.clear();
          window.location.href =process.env.REACT_APP_BASE_URL+ "/";
        }
      })
  }
  useEffect(() => {
    GetStation();
  }, [])

  const GetStation = function () {
    fetch(process.env.REACT_APP_WSurl + "api/Stations", {
      method: 'GET',
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          var station=data[0].stationName;
          setListStations(station);
        }
      }).catch((error) => toast.error('Unable to get the Stations list. Please contact adminstrator'));
  }



  return (
    <header id="header" className="header fixed-top d-flex align-items-center">
      {!sessionStorage.getItem('UserData') ? window.location.href = "/" : ""}
      <div className="d-flex align-items-center justify-content-between">
      <NavLink to="/Dashboard" className="logo d-flex align-items-center">
          <img src="images/logo.png" alt="" />
          </NavLink>
        <i className="bi bi-list toggle-sidebar-btn" onClick={sidebartoggle}></i>
      </div>
      {/* <div> Station Name</div> */}
      &nbsp;&nbsp;
      {ListStations && (
        <div className="headerLable">{ListStations} </div>
      )}

     {/*  <div className="search-bar">
        <form className="search-form d-flex align-items-center" method="POST" action="#">
          <input type="text" name="query" placeholder="Search" title="Enter search keyword" />
          <button type="submit" title="Search"><i className="bi bi-search"></i></button>
        </form>
      </div> */}

      <nav className="header-nav ms-auto">
        <ul className="d-flex align-items-center">

          <li className="nav-item d-block d-lg-none">
            <a className="nav-link nav-icon search-bar-toggle " href="#">
              <i className="bi bi-search"></i>
            </a>
          </li>
          <li className="nav-item dropdown pe-3">
            <a className="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
              <span className="d-none d-md-block dropdown-toggle ps-2">{user.userName}</span>
            </a>
            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
              <li className="dropdown-header">
                <h6>{user.userName}</h6>
                <span>( {user.role} )</span>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              {/* <li>
                <a className="dropdown-item d-flex align-items-center" href="users-profile.html">
                  <i className="bi bi-person"></i>
                  <span>My Profile</span>
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a className="dropdown-item d-flex align-items-center" href="users-profile.html">
                  <i className="bi bi-gear"></i>
                  <span>Account Settings</span>
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a className="dropdown-item d-flex align-items-center" href="pages-faq.html">
                  <i className="bi bi-question-circle"></i>
                  <span>Need Help?</span>
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li> */}
              <li>
                <a className="dropdown-item d-flex align-items-center" onClick={Signout}>
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Sign Out</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  )
}
export default Header;