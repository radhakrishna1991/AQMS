import React, { useCallback, useEffect, useState, useRef } from "react";
import { AgGridReact } from 'ag-grid-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-alpine.css';

function Parameters() {
  const gridRef = useRef();
  const gridRefsite = useRef();
  const [gitHubUsers, setGitHubUsers] = useState([
    {
      site: "Dukhan Fahahil", parametername: "BP", enable: true, parentparameter: "", parametertemplate: "BARPRESS", parametergroup: "",
      websitedisplayname: "", datatype: "Average / C", epapoc: "", epaparameter: "", epaunits: "", reportedunits: "mbar", acquiredunits: ""
      , description: ""
    }, {
      site: "Dukhan Fahahil", parametername: "CH4_ppm", enable: true, parentparameter: "", parametertemplate: "CH4", parametergroup: "",
      websitedisplayname: "", datatype: "Average / C", epapoc: "", epaparameter: "", epaunits: "", reportedunits: "PPM", acquiredunits: ""
      , description: ""
    }, {
      site: "Dukhan Fahahil", parametername: "CH4_ug", enable: true, parentparameter: "", parametertemplate: "CH4_ug", parametergroup: "",
      websitedisplayname: "", datatype: "Average / C", epapoc: "", epaparameter: "", epaunits: "", reportedunits: "UG/M3", acquiredunits: ""
      , description: ""
    }, {
      site: "Dukhan Fahahil", parametername: "CO_mg", enable: true, parentparameter: "", parametertemplate: "CO_mg", parametergroup: "",
      websitedisplayname: "", datatype: "Average / C", epapoc: "", epaparameter: "", epaunits: "", reportedunits: "MG/M3", acquiredunits: ""
      , description: ""
    }, {
      site: "Dukhan Fahahil", parametername: "CO_ppm", enable: true, parentparameter: "", parametertemplate: "CO", parametergroup: "",
      websitedisplayname: "", datatype: "Average / C", epapoc: "", epaparameter: "", epaunits: "", reportedunits: "PPM", acquiredunits: ""
      , description: ""
    }, {
      site: "Dukhan Fahahil", parametername: "GS", enable: true, parentparameter: "", parametertemplate: "SOLARRAD", parametergroup: "",
      websitedisplayname: "", datatype: "Average / C", epapoc: "", epaparameter: "", epaunits: "", reportedunits: "W/M2", acquiredunits: ""
      , description: ""
    }, {
      site: "Dukhan Fahahil", parametername: "H2S_ppb", enable: true, parentparameter: "", parametertemplate: "H2S", parametergroup: "",
      websitedisplayname: "", datatype: "Average / C", epapoc: "", epaparameter: "", epaunits: "", reportedunits: "PPB", acquiredunits: ""
      , description: ""
    },
  ]);
  const [sites, setsites] = useState([
    {
      site: "Dukhan Fahahil", enable: true, timezone: "", latitude: "", longitude: "", epasite: "", epacountrycode: "", sitegroup: "",
      websitedisplayname: "", description: ""
    }
  ]);
  const [gridApi, setGridApi] = useState(null);
  const [sitegridApi, setSiteGridApi] = useState(null);
  const [gridlist, setgridlist] = useState(true);
  const [Totalpages, setTotalpages] = useState(1);
  const [SiteTotalpages, setSiteTotalpages] = useState(1);
  const PageSize = "10";
  /* const [currentPage, setCurrentPage] = useState(1);
  const [tableRowsPerPage, setTableRowsPerPage] = useState(5);
  const [showlist, setshowlist] = useState(true);
  const [Btntype, setBtntype] = useState("add");
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setlocation] = useState(window.location.pathname); */


  const columnDefs = [
    { headerName: "Site", field: "site", width: 150 },
    { headerName: "Parameter Name", field: "parametername" },
    {
      headerName: "Enabled", field: "enable", minWidth: 100, sortable: false, filter: false, floatingFilter: false, cellRenderer: params => {
        return (<input type='checkbox' checked={params.value ? 'checked' : ''} />);
      }
    },
    { headerName: "Parent Parameter", field: "parentparameter" },
    { headerName: "Parameter Template", field: "parametertemplate" },
    { headerName: "Parameter Group", field: "parametergroup" },
    { headerName: "WebSite Display Name", field: "websitedisplayname" },
    { headerName: "Data Type", field: "datatype" },
    { headerName: "EPA POC", field: "epapoc" },
    { headerName: "EPA Parameter", field: "epaparameter" },
    { headerName: "EPA Units", field: "epaunits" },
    { headerName: "Reported Units", field: "reportedunits" },
    { headerName: "Acquired Units", field: "acquiredunits" },
    { headerName: "Description", field: "description" },
    {
      headerName: "Actions", field: "id", minWidth: 100, sortable: false, filter: false, floatingFilter: false, cellRendererFramework: (params) =>
        <div><i className="bi bi-pencil-square action_btn btn btn-primary mx-2" onClick={() => EditData(params)}></i>
          <i className="bi bi-trash btn action_btn btn-secondary" onClick={() => DeleteData(params)}></i></div>
    }
  ];

  const columnDefsSite = [
    { headerName: "Site", field: "site", width: 150 },
    {
      headerName: "Enabled", field: "enable", minWidth: 100, sortable: false, filter: false, floatingFilter: false, cellRenderer: params => {
        return (<input type='checkbox' name="site" checked={params.value ? 'checked' : ''} />);
      }
    },
    { headerName: "TimeZone", field: "timezone" },
    { headerName: "Latitude", field: "latitude" },
    { headerName: "Longitude", field: "longitude" },
    { headerName: "EPA Site", field: "epasite" },
    { headerName: "EPA Country Code", field: "epacountrycode" },
    { headerName: "Site Group", field: "sitegroup" },
    { headerName: "WebSite Display Name", field: "websitedisplayname" },
    { headerName: "Description", field: "description" },
    {
      headerName: "Actions", field: "id", minWidth: 100, sortable: false, filter: false, floatingFilter: false, cellRendererFramework: (params) =>
        <div><i className="bi bi-pencil-square action_btn btn btn-primary mx-2" onClick={() => EditData(params)}></i>
          <i className="bi bi-trash btn action_btn btn-secondary" onClick={() => DeleteData(params)}></i></div>
    }
  ];

  const EditData = (params) => {
    alert('');
  }
  const DeleteData = (params) => {
    confirmAlert({
      closeOnEscape: false,
      closeOnClickOutside: false,
      title: 'Confirm to submit',
      message: 'Are you sure to do this.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => alert('Click Yes')
        },
        {
          label: 'No',
          onClick: () => alert('Click No')
        }
      ]
    });
  }

  useEffect(() => {
    if (gridRef.current != null && gridRef.current.api != undefined) {
      setTotalpages(gridRef.current.api.paginationGetTotalPages());
    }
     if (gridRefsite.current != null && gridRefsite.current.api != undefined) {
      setSiteTotalpages(gridRefsite.current.api.paginationGetTotalPages());
    }
  });

  const fetchUsers = () => {
    fetch("https://api.github.com/users")
      .then((response) => response.json())
      .then((data) => setGitHubUsers(data))
      .catch((error) => console.log(error));
  };

  const OnGridReady = (params) => {
    setGridApi(params);
    // If you need to resize specific columns 
    var allColIds = params.columnApi.getAllColumns()
      .map(column => column.colId);
    params.columnApi.autoSizeColumns(allColIds);

    // If you want to resize all columns
    params.columnApi.autoSizeAllColumns();
  }

  const OnGridReadysite = (params) => {
    setSiteGridApi(params);
    // If you need to resize specific columns 
    var allColIds = params.columnApi.getAllColumns()
      .map(column => column.colId);
    params.columnApi.autoSizeColumns(allColIds);

    // If you want to resize all columns
    params.columnApi.autoSizeAllColumns();
  }

  const AddSite = (param) => {
    toast.error('Wow so easy!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
    if (param == 'gridlist') {
      setgridlist(true);
    } else {
      setgridlist(false);
    }
  }

  const onPageSizeChanged = useCallback(() => {
    let value = document.getElementById('page-size').value;
    gridRef.current.api.paginationSetPageSize(Number(value));

    setTotalpages(gridRef.current.api.paginationGetTotalPages());
    gridRef.current.api.paginationGoToFirstPage();
    document.getElementById('gotopage').value = 1;
  }, []);

  const onPageChanged = useCallback(() => {
    let value = document.getElementById('gotopage').value;
    if (Number(value) == 1) {
      gridRef.current.api.paginationGoToFirstPage();
    } else {
      gridRef.current.api.paginationGoToPage(Number(value) - 1);
    }
  }, []);

  const onPageSizeChangedsite = useCallback(() => {
    let value = document.getElementById('pagesizesite').value;
    gridRefsite.current.api.paginationSetPageSize(Number(value));

    setSiteTotalpages(gridRefsite.current.api.paginationGetTotalPages());
    gridRefsite.current.api.paginationGoToFirstPage();
    document.getElementById('gotopagesite').value = 1;
  }, []);

  const onPageChangedsite = useCallback(() => {
    let value = document.getElementById('gotopagesite').value;
    if (Number(value) == 1) {
      gridRefsite.current.api.paginationGoToFirstPage();
    } else {
      gridRefsite.current.api.paginationGoToPage(Number(value) - 1);
    }
  }, []);

  const defaultColDef = {
    resizable: true, minWidth: 150, flex: 1,
    wrapHeaderText: true, autoHeaderHeight: true,
    sortable: true, filter: true, floatingFilter: true,
    suppressMenu: true, floatingFilterComponentParams: {suppressFilterButton:true}
  }

  return (
    <main id="main" className="main" >

      {/*   <div className="pagetitle">
        <h1>Dashboard</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="index.html">Home</a></li>
            <li className="breadcrumb-item active">Dashboard</li>
          </ol>
        </nav>
      </div>
 */}
      <ToastContainer />
      {/* Same as */}
      <section className="section grid_section h100 w100">
        <div className="h100 w100">
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="general-tab" data-bs-toggle="tab" data-bs-target="#general-tab-pane" type="button" role="tab" aria-controls="general-tab-pane" aria-selected="true">System</button>
            </li>
            {/*  <li className="nav-item" role="presentation">
              <button className="nav-link" id="advanced-tab" data-bs-toggle="tab" data-bs-target="#advanced-tab-pane" type="button" role="tab" aria-controls="advanced-tab-pane" aria-selected="false">Advanced</button>
            </li> */}
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="sites-tab" data-bs-toggle="tab" data-bs-target="#sites-tab-pane" type="button" role="tab" aria-controls="sites-tab-pane" aria-selected="false">Sites</button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link active" id="parameters-tab" data-bs-toggle="tab" data-bs-target="#parameters-tab-pane" type="button" role="tab" aria-controls="parameters-tab-pane" aria-selected="false" >Parameters</button>
            </li>
          </ul>
          <div className="tab-content" id="myTabContent">
            <div className="tab-pane fade" id="general-tab-pane" role="tabpanel" aria-labelledby="general-tab" tabIndex="0">
              <div className="accordion px-0" id="accordiongeneral">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="generalOne">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#generalcollapseOne" aria-expanded="true" aria-controls="generalcollapseOne">
                      System Details
                    </button>
                  </h2>
                  <div id="generalcollapseOne" className="accordion-collapse collapse show" aria-labelledby="generalOne" data-bs-parent="#accordiongeneral">
                    <div className="accordion-body">
                      <div className="">
                        <div className="row">
                          <label htmlFor="inputAddress" className="form-label col-sm-2">System Name:</label>
                          <div className="col-sm-10">
                            <input type="text" className="form-control" placeholder="" />
                          </div>
                        </div>
                        <div className="row">
                          <label htmlFor="inputAddress" className="form-label col-sm-2">Country Code:</label>
                          <div className="col-sm-10">
                            <input type="text" className="form-control" placeholder="" />
                          </div>
                        </div>
                        <div className="row">
                          <label htmlFor="inputAddress" className="form-label col-sm-2">TimeZone:</label>
                          <div className="col-sm-10">
                            <select id="inputState" className="form-select">
                              <option selected>Choose...</option>
                              <option>...</option>
                            </select>
                          </div>
                        </div>
                        <div className="row">
                          <label htmlFor="inputAddress" className="form-label col-sm-2">AQS Agency Code:</label>
                          <div className="col-sm-10">
                            <select id="inputState" className="form-select">
                              <option selected>Choose...</option>
                              <option>...</option>
                            </select>
                          </div>
                        </div>
                        <div className="row">
                          <label htmlFor="inputAddress" className="form-label col-sm-2">AirNow Agency Code:</label>
                          <div className="col-sm-10">
                            <input type="text" className="form-control" placeholder="" />
                          </div>
                        </div>
                        <div className="row">
                          <label htmlFor="inputAddress" className="form-label col-sm-2">Zip Code:</label>
                          <div className="col-sm-10">
                            <input type="text" className="form-control" placeholder="" />
                          </div>
                        </div>
                        <div className="row">
                          <label htmlFor="inputAddress" className="form-label col-sm-2">System Database Identifier:</label>
                          <div className="col-sm-10">
                            <input type="text" className="form-control" placeholder="" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="tab-pane fade" id="advanced-tab-pane" role="tabpanel" aria-labelledby="advanced-tab" tabIndex="0">
              <div className="accordion-body p-3">
                <div className="">
                  <div className="row">
                    <label htmlFor="inputAddress" className="form-label col-sm-2">System Database Identifier:</label>
                    <div className="col-sm-10">
                      <input type="text" className="form-control" placeholder="" />
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            <div className="tab-pane fade" id="sites-tab-pane" role="tabpanel" aria-labelledby="sites-tab" tabIndex="0">
              <div className="me-2 mb-2 float-end">
                {gridlist && (
                  <span className="operation_class mx-2" onClick={() => AddSite()}><i className="bi bi-plus-circle-fill"></i> <span>Add</span></span>
                )}
                {!gridlist && (
                  <span className="operation_class mx-2" onClick={() => AddSite('gridlist')}><i className="bi bi-card-list"></i> <span>List</span></span>
                )}
              </div>
              {!gridlist && (
                <div className="row w100 px-0 mx-0">
                  <div className="accordion px-0" id="accordionsite">
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingOne">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                          Sites
                        </button>
                      </h2>
                      <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionsite">
                        <div className="accordion-body">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="row">
                                <label htmlFor="inputEmail4" className="form-label col-sm-3">Name:</label>
                                <div className="col-sm-9">
                                  <input type="text" className="form-control" id="inputEmail4" />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="row">
                                <label htmlFor="inputPassword4" className="form-label col-sm-3">Description:</label>
                                <div className="col-sm-9">
                                  <input type="text" className="form-control" id="inputPassword4" />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="row">
                                <label htmlFor="inputAddress" className="form-label col-sm-3">Abbreviation:</label>
                                <div className="col-sm-9">
                                  <input type="text" className="form-control" placeholder="" />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="row">
                                <label htmlFor="inputState" className="form-label col-sm-3">TimeZone:</label>
                                <div className="col-sm-6">
                                  <select id="inputState" className="form-select">
                                    <option selected>Choose...</option>
                                    <option>...</option>
                                  </select>
                                </div>
                                <div className="col-sm-3">
                                  <div className="form-check mt-3">
                                    <label className="form-check-label" htmlFor="gridCheck">
                                      Enabled
                                    </label>
                                    <input className="form-check-input" type="checkbox" id="gridCheck" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>  </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingTwo">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                          Miscellaneous
                        </button>
                      </h2>
                      <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionsite">
                        <div className="accordion-body">
                          <div className="">
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-2">Lattitude:</label>
                              <div className="col-sm-4">
                                <input type="text" className="form-control" placeholder="" />
                              </div>

                              <label htmlFor="inputAddress" className="form-label col-sm-2">EPA Site:</label>
                              <div className="col-sm-4">
                                <input type="text" className="form-control" placeholder="" />
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-2">Longitude:</label>
                              <div className="col-sm-4">
                                <input type="text" className="form-control" placeholder="" />
                              </div>

                              <label htmlFor="inputAddress" className="form-label col-sm-2">AIRNow Mnemonic:</label>
                              <div className="col-sm-4">
                                <input type="text" className="form-control" placeholder="" />
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-2">File Import Code:</label>
                              <div className="col-sm-4">
                                <input type="text" className="form-control" placeholder="" />
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-2">EPA Country or Tribal Code:</label>
                              <div className="col-sm-10">
                                <select className="form-select">
                                  <option selected>Choose...</option>
                                  <option>...</option>
                                </select>
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-2">Site Group:</label>
                              <div className="col-sm-10">
                                <select className="form-select">
                                  <option selected>Choose...</option>
                                  <option>...</option>
                                </select>
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-2">WebSite Display Name:</label>
                              <div className="col-sm-6">
                                <input type="text" className="form-control" placeholder="" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingThree">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                          Address
                        </button>
                      </h2>
                      <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionsite">
                        <div className="accordion-body">
                          <div className="">
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-2">Street Address1:</label>
                              <div className="col-sm-10">
                                <input type="text" className="form-control" placeholder="" />
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-2">Street Address2:</label>
                              <div className="col-sm-10">
                                <input type="text" className="form-control" placeholder="" />
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-2">City:</label>
                              <div className="col-sm-10">
                                <input type="text" className="form-control" placeholder="" />
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-2">Country:</label>
                              <div className="col-sm-10">
                                <input type="text" className="form-control" placeholder="" />
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-2">State Region:</label>
                              <div className="col-sm-10">
                                <input type="text" className="form-control" placeholder="" />
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-2">Zip Code:</label>
                              <div className="col-sm-10">
                                <input type="text" className="form-control" placeholder="" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {gridlist && (
                <div>
                  <div className="ag-theme-alpine mx-0 row h100 w100">
                    <AgGridReact
                      className="px-0"
                      ref={gridRefsite}
                      columnDefs={columnDefsSite}
                      rowData={sites}
                      pagination={true}
                      tooltipShowDelay={0}
                      paginationPageSize={PageSize}
                      defaultColDef={defaultColDef}
                      suppressCellFocus={true}
                      onGridReady={OnGridReadysite}
                    //</div>suppressPaginationPanel={true}
                    //tooltipHideDelay={2000}
                    >
                    </AgGridReact>
                  </div>
                  <div className="pagenation_header">
                    <div className="d-inline p-2 ">
                      Page Size:
                      <select onChange={onPageSizeChangedsite} id="pagesizesite">
                        <option value="5">5</option>
                        <option value="1" selected={true}>1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                      </select>
                    </div>
                    <div className="d-inline p-2 ">
                      Goto Page:
                      <select onChange={onPageChangedsite} id="gotopagesite">
                        {(() => {
                          const options = [];

                          for (let i = 1; i <= SiteTotalpages; i++) {
                            options.push(<option value={i} key={i}>{i}</option>);
                          }

                          return options;
                        })()}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="tab-pane fade show active" id="parameters-tab-pane" role="tabpanel" aria-labelledby="parameters-tab" tabIndex="0">
              <div className="me-2 mb-2 float-end">
                {gridlist && (
                  <span className="operation_class mx-2" onClick={() => AddSite()}><i className="bi bi-plus-circle-fill"></i> <span>Add</span></span>
                )}
                {!gridlist && (
                  <span className="operation_class mx-2" onClick={() => AddSite('gridlist')}><i className="bi bi-card-list"></i> <span>List</span></span>
                )}
              </div>
              {!gridlist && (
                <div className="row w100 px-0 mx-0">
                  <div className="accordion px-0" id="accordionsparameter">
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="parameterheadingOne">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#parametercollapseOne" aria-expanded="true" aria-controls="parametercollapseOne">
                          Site
                        </button>
                      </h2>
                      <div id="parametercollapseOne" className="accordion-collapse collapse show" aria-labelledby="parameterheadingOne" data-bs-parent="#accordionsparameter">
                        <div className="accordion-body">
                          <div className="">
                            <div className="row">
                              <label htmlFor="inputEmail4" className="form-label col-sm-2">Site:</label>
                              <div className="col-sm-10">
                                <input type="text" className="form-control" />
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputEmail4" className="form-label col-sm-2">Parameter:</label>
                              <div className="col-sm-10">
                                <input type="text" className="form-control" />
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputEmail4" className="form-label col-sm-2">Parent Parameter:</label>
                              <div className="col-sm-10">
                                <select id="inputState" className="form-select">
                                  <option selected>Choose...</option>
                                  <option>...</option>
                                </select>
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputEmail4" className="form-label col-sm-2">Parameter Group:</label>
                              <div className="col-sm-10">
                                <select id="inputState" className="form-select">
                                  <option selected>Choose...</option>
                                  <option>...</option>
                                </select>
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputEmail4" className="form-label col-sm-2">WebSite Display Name:</label>
                              <div className="col-sm-10">
                                <input type="text" className="form-control" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="parameterheadingTwo">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#parametercollapseTwo" aria-expanded="false" aria-controls="parametercollapseTwo">
                          Template
                        </button>
                      </h2>
                      <div id="parametercollapseTwo" className="accordion-collapse collapse" aria-labelledby="parameterheadingTwo" data-bs-parent="#accordionsparameter">
                        <div className="accordion-body">
                          <div className="">
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-2">Parameter Template:</label>
                              <div className="col-sm-10">
                                <select id="inputState" className="form-select">
                                  <option selected>Choose...</option>
                                  <option>...</option>
                                </select>
                              </div>
                              <div className="text-center">
                                <button type="button" className="btn btn-primary px-4">Apply</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="parameterheadingThree">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#parametercollapseThree" aria-expanded="false" aria-controls="parametercollapseThree">
                          Address
                        </button>
                      </h2>
                      <div id="parametercollapseThree" className="accordion-collapse collapse" aria-labelledby="parameterheadingThree" data-bs-parent="#accordionsparameter">
                        <div className="accordion-body">
                          <div className="">
                            <div className="row">
                              <div className="col-sm-4">
                                <div className="form-check">
                                  <label className="form-check-label" htmlFor="gridCheck">
                                    Enabled
                                  </label>
                                  <input className="form-check-input" type="checkbox" />
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="form-check">
                                  <label className="form-check-label" htmlFor="gridCheck">
                                    Enable AIRNow Reporting
                                  </label>
                                  <input className="form-check-input" type="checkbox" />
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="form-check">
                                  <label className="form-check-label" htmlFor="gridCheck">
                                    Filter From WebSite
                                  </label>
                                  <input className="form-check-input" type="checkbox" />
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-sm-4">
                                <div className="row">
                                  <label htmlFor="inputAddress" className="form-label col-sm-6">Parameter Data Type:</label>
                                  <div className="col-sm-6">
                                    <div className="form-check">
                                      <input className="form-check-input" type="radio" name="pdtradio" id="exampleRadios1" value="option1" checked />
                                      <label className="form-check-label" htmlFor="exampleRadios1">
                                        Average / Continuous
                                      </label>
                                    </div>
                                    <div className="form-check">
                                      <input className="form-check-input" type="radio" name="pdtradio" id="exampleRadios2" value="option2" />
                                      <label className="form-check-label" htmlFor="exampleRadios2">
                                        Continuous Sample
                                      </label>
                                    </div>
                                    <div className="form-check">
                                      <input className="form-check-input" type="radio" name="pdtradio" id="exampleRadios3" value="option3" />
                                      <label className="form-check-label" htmlFor="exampleRadios3">
                                        Sample / Non-Continuous
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="row">
                                  <label htmlFor="inputAddress" className="form-label col-sm-4">EPA POC:</label>
                                  <div className="col-sm-8">
                                    <input type="text" className="form-control" placeholder="" />
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="row">
                                  <label htmlFor="inputAddress" className="form-label col-sm-4">EPA Method:</label>
                                  <div className="col-sm-8">
                                    <input type="text" className="form-control" placeholder="" />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-2">Description:</label>
                              <div className="col-sm-10">
                                <input type="text" className="form-control" placeholder="" />
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-2">Math Equation(If Calculated):</label>
                              <div className="col-sm-10">
                                <select className="form-select">
                                  <option selected>Choose...</option>
                                  <option>...</option>
                                </select>
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-2">EPA Units:</label>
                              <div className="col-sm-10">
                                <select className="form-select">
                                  <option selected>Choose...</option>
                                  <option>...</option>
                                </select>
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-2">EPA Parameters:</label>
                              <div className="col-sm-10">
                                <select className="form-select">
                                  <option selected>Choose...</option>
                                  <option>...</option>
                                </select>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-sm-4">
                                <div className="row">
                                  <label htmlFor="inputAddress" className="form-label col-sm-4">Reported Digits:</label>
                                  <div className="col-sm-4">
                                    <input type="number" min="0" max="5" className="form-control" placeholder="" />
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="row">
                                  <label htmlFor="inputAddress" className="form-label col-sm-4">Precision:</label>
                                  <div className="col-sm-4">
                                    <input type="number" min="0" max="5" className="form-control" placeholder="" />
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="row">
                                  <label htmlFor="inputAddress" className="form-label col-sm-4">Calibration Precision:</label>
                                  <div className="col-sm-4">
                                    <input type="number" min="0" max="5" className="form-control" placeholder="" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="parameterheadingFour">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#parametercollapseFour" aria-expanded="false" aria-controls="parametercollapseFour">
                          Address
                        </button>
                      </h2>
                      <div id="parametercollapseFour" className="accordion-collapse collapse" aria-labelledby="parameterheadingFour" data-bs-parent="#accordionsparameter">
                        <div className="accordion-body">
                          <div className="">
                            <div className="row">
                              <div className="col-sm-4 mt-3">
                                <div className="row">
                                  <label htmlFor="inputAddress" className="form-label mt-0 col-sm-6">Truncate Round Rule:</label>
                                  <div className="col-sm-6">
                                    <div className="form-check form-check-inline">
                                      <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1" />
                                      <label className="form-check-label" htmlFor="inlineRadio1">Round</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                      <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2" />
                                      <label className="form-check-label" htmlFor="inlineRadio2">Truncate</label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="row">
                                  <label htmlFor="inputAddress" className="form-label col-sm-6">Graph Minium:</label>
                                  <div className="col-sm-6">
                                    <input type="text" className="form-control" placeholder="" />
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="row">
                                  <label htmlFor="inputAddress" className="form-label col-sm-6">Graph Maximum:</label>
                                  <div className="col-sm-6">
                                    <input type="text" className="form-control" placeholder="" />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-2">Reported Units:</label>
                              <div className="col-sm-10">
                                <select className="form-select">
                                  <option selected>Choose...</option>
                                  <option>...</option>
                                </select>
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-2">Analyzer Units (if diffrent):</label>
                              <div className="col-sm-10">
                                <select className="form-select">
                                  <option selected>Choose...</option>
                                  <option>...</option>
                                </select>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-sm-4">
                                <div className="row">
                                  <label htmlFor="inputAddress" className="form-label col-sm-6">Calibration Span:</label>
                                  <div className="col-sm-6">
                                    <input type="text" className="form-control" placeholder="" />
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="row">
                                  <label htmlFor="inputAddress" className="form-label col-sm-6">Instrument Detection Limit:</label>
                                  <div className="col-sm-6">
                                    <input type="text" className="form-control" placeholder="" />
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="row">
                                  <label htmlFor="inputAddress" className="form-label col-sm-6">Limot of Quantization:</label>
                                  <div className="col-sm-6">
                                    <input type="text" className="form-control" placeholder="" />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-sm-4">
                                <div className="row">
                                  <label htmlFor="inputAddress" className="form-label col-sm-6">Minimum Detectable Limit:</label>
                                  <div className="col-sm-6">
                                    <input type="text" className="form-control" placeholder="" />
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="row">
                                  <label htmlFor="inputAddress" className="form-label col-sm-6">Practical Quantitation Limit:</label>
                                  <div className="col-sm-6">
                                    <input type="text" className="form-control" placeholder="" />
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="row">
                                  <label htmlFor="inputAddress" className="form-label col-sm-6">Parameter Report Order:</label>
                                  <div className="col-sm-4">
                                    <input type="number" className="form-control" placeholder="" />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-sm-4">
                                <div className="form-check">
                                  <label className="form-check-label" htmlFor="gridCheck">
                                    Totalize in Reports
                                  </label>
                                  <input className="form-check-input" type="checkbox" />
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="form-check">
                                  <label className="form-check-label" htmlFor="gridCheck">
                                    Minimum in Reports
                                  </label>
                                  <input className="form-check-input" type="checkbox" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {gridlist && (
                <div>
                  <div className="ag-theme-alpine mx-0 row h100 w100">
                    <AgGridReact
                      className="px-0"
                      ref={gridRef}
                      columnDefs={columnDefs}
                      rowData={gitHubUsers}
                      pagination={true}
                      tooltipShowDelay={0}
                      paginationPageSize={PageSize}
                      defaultColDef={defaultColDef}
                      suppressCellFocus={true}
                      onGridReady={OnGridReady}
                    //</div>suppressPaginationPanel={true}
                    //tooltipHideDelay={2000}
                    >
                    </AgGridReact>
                  </div>
                  <div className="pagenation_header">
                    <div className="d-inline p-2 ">
                      Page Size:
                      <select onChange={onPageSizeChanged} id="page-size">
                        <option value="5">5</option>
                        <option value="1" selected={true}>1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                      </select>
                    </div>
                    <div className="d-inline p-2 ">
                      Goto Page:
                      <select onChange={onPageChanged} id="gotopage">
                        {(() => {
                          const options = [];

                          for (let i = 1; i <= Totalpages; i++) {
                            options.push(<option value={i} key={i} >{i}</option>);
                          }

                          return options;
                        })()}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
export default Parameters;