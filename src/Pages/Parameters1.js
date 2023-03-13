import React, { useCallback, useEffect, useState, useRef } from "react";
function Parameters1() {
  const gridRef = useRef();
  const gridRefsite = useRef();
  const gridRefjsgrid = useRef();
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

  const [gridlist, setgridlist] = useState(true);
  /* const [currentPage, setCurrentPage] = useState(1);
  const [tableRowsPerPage, setTableRowsPerPage] = useState(5);
  const [showlist, setshowlist] = useState(true);
  const [Btntype, setBtntype] = useState("add");
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setlocation] = useState(window.location.pathname); */

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

  }
  const handleLogin=(event)=>{
    let form=document.querySelectorAll('#Parameterform')[0];
   if (!form.checkValidity()) {
       form.classList.add('was-validated');
     }else{
       window.location.href="/Dashboard";
     }
}
  useEffect(() => {
    let $ = window.jQuery;
    window.jQuery(gridRefjsgrid.current).jsGrid({
      width: "100%",
      height: "auto",
      filtering: true,
      editing: false,
      inserting: false,
      sorting: true,
      paging: true,
      autoload: true,
      pageSize: 10,
      pageButtonCount: 5,
      controller: {
        data: gitHubUsers,
        loadData: function (filter) {
          $(".jsgrid-filter-row input:text").addClass("form-control").addClass("form-control-sm");
          $(".jsgrid-filter-row select").addClass("custom-select").addClass("custom-select-sm");
          return $.grep(this.data, function (item) {
            if (item.Description == null) { item.Description = ""; }
            return ((!filter.site || item.site.toUpperCase().indexOf(filter.site.toUpperCase()) >= 0)
              &&(!filter.parametername || item.parametername.toUpperCase().indexOf(filter.parametername.toUpperCase()) >= 0)
              &&(!filter.parentparameter || item.parentparameter.toUpperCase().indexOf(filter.parentparameter.toUpperCase()) >= 0)
              &&(!filter.parametertemplate || item.parametertemplate.toUpperCase().indexOf(filter.parametertemplate.toUpperCase()) >= 0)
              &&(!filter.parametergroup || item.parametergroup.toUpperCase().indexOf(filter.parametergroup.toUpperCase()) >= 0)
              &&(!filter.websitedisplayname || item.websitedisplayname.toUpperCase().indexOf(filter.websitedisplayname.toUpperCase()) >= 0)
             /*  && (!filter.Country || item.Country === filter.Country) */
            );
          });
        }
      },
      fields: [
        { name: "site", title: "Site", type: "text", width: 150 },
        { name: "parametername", title: "Parameter Name", type: "text"},
        { name: "enable", title: "Enabled", type: "checkbox", title: "Enabled", sorting: false,filtering:false },
        { name: "parentparameter", title: "Parent Parameter", type: "text", width: 200 },
        { name: "parametertemplate", title: "Parameter Template", type: "text" },
        { name: "parametergroup", title: "Parameter Group", type: "text" },
        { name: "websitedisplayname", title: "WebSite Display Name", type: "text" },
        { name: "datatype", title: "Data Type", type: "text" },
        { name: "epapoc", title: "EPA POC", type: "text" },
        { name: "epaparameter", title: "EPA Parameter", type: "text" },
        { name: "epaunits", title: "EPA Units", type: "text" },
        { name: "reportedunits", title: "Reported Units", type: "text" },
        { name: "acquiredunits", title: "Acquired Units", type: "text" },
        { name: "description", title: "Description", type: "text" },
        {
          type: "control", width: 100, editButton: false, deleteButton: false,
          itemTemplate: function (value, item) {
            // var $result = gridRefjsgrid.current.fields.control.prototype.itemTemplate.apply(this, arguments);

            var $customEditButton = $("<button>").attr({ class: "customGridEditbutton jsgrid-button jsgrid-edit-button" })
              .click(function (e) {
                fetchUsers();
                alert("ID: " + item.id);
                e.stopPropagation();
              });

            var $customDeleteButton = $("<button>").attr({ class: "customGridDeletebutton jsgrid-button jsgrid-delete-button" })
              .click(function (e) {
                alert("Title: " + item.title);
                e.stopPropagation();
              });

            return $("<div>").append($customEditButton).append($customDeleteButton);
            //return $result.add($customButton);
          }
        }
      ]
    });

    $('#demo-2').inputpicker({
      data:[
          {value:"1",text:"jQuery", description: "text 1.",main:"12345"},
          {value:"2",text:"Script", description: "This is the description of the text 2."},
          {value:"3",text:"Net", description: "This is the description of the text 3."},
      ],
      fields:[
          {name:'value',text:'Id'},
          {name:'text',text:'Title'},
          {name:'description',text:'Description'}
      ],
   //  multiple: true,
      headShow: true,
      fieldText : 'text',
      fieldValue: 'value',
    filterOpen: true,
    
      });
  });

  const fetchUsers = () => {
    fetch("https://api.github.com/users")
      .then((response) => response.json())
      .then((data) => setGitHubUsers(data))
      .catch((error) => console.log(error));
  };


  const AddSite = (param) => {

    if (param == 'gridlist') {
      setgridlist(true);
    } else {
      setgridlist(false);
    }
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
                                <select className="form-select" >
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
                <form id="Parameterform" className="row w100 px-0 mx-0" noValidate>
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
                                <input type="text" className="form-control required" required/>
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
                                      <input className="form-check-input" type="radio" name="pdtradio" id="inlineRadio11" value="1" defaultChecked={true} />
                                      <label className="form-check-label" htmlFor="inlineRadio1">Average / Continuous</label>
                                    </div>
                                    <div className="form-check">
                                      <input className="form-check-input" type="radio" name="pdtradio" id="inlineRadio21" value="2" />
                                      <label className="form-check-label" htmlFor="inlineRadio2"> Continuous Sample</label>
                                    </div>
                                    <div className="form-check">
                                      <input className="form-check-input" type="radio" name="pdtradio" id="inlineRadio31" value="3" />
                                      <label className="form-check-label" htmlFor="inlineRadio3">Sample / Non-Continuous</label>
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
                                {/* <select className="form-select" id="demo-2">
                                  <option selected>Choose...</option>
                                  <option>...</option>
                                </select> */}
                                 <input id="demo-2" value="" className="form-control" placeholder="" />
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
                  <div class="col-12 text-center mt-2">
                      <button class="btn btn-primary" onClick={handleLogin}  type="button">Add Parameter</button>
                    </div>
                </form>
              )}
              {gridlist && (
                <div>
                  <div className="jsGrid" ref={gridRefjsgrid} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
export default Parameters1;