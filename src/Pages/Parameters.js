import React, { useCallback, useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";
function Parameters1() {
  const gridRef = useRef();
  const gridRefjsgrid = useRef();
  const $ = window.jQuery;
  const [ListEpaParameter, setlistEpaParameter] = useState([]);
  const [ListEpaUnits, setlistEpaUnits] = useState([]);
  const [ListMathEquation, setlistMathEquation] = useState([]);
  const [ListParameterTemplate, setlistParameterTemplate] = useState([]);
  const [ListReportedUnits, setlistReportedUnits] = useState([]);
  const [ListParameters, setlistParameters] = useState([]);

  const [ListDataType, setlistDataType] = useState([]);
  const [reporteddigits1, setreporteddigits] = useState(null)
  const [gridlist, setgridlist] = useState(true);
  const [Id, setId] = useState(0);
  const [Addbtn, setAddbtn] = useState(true);
  const parametersite = useRef();
  const parametername = useRef();
  const parentparameter = useRef();
  const parametergroup = useRef();
  const websitename = useRef();
  const parametertemplate = useRef();
  const parameterenabled = useRef();
  const enableairnowreporting = useRef();
  const filterfromwebsite = useRef();
  const epapoc = useRef();
  const epamethod = useRef();
  const description = useRef();
  const epaparameter = useRef();
  const epaunits = useRef();
  const mathequation = useRef();
  const reporteddigits = useRef();
  const precision = useRef();
  const calibrationprecision = useRef();
  const reportedunits = useRef();
  const analyzerunits = useRef();
  const graphminimum = useRef();
  const graphmaximum = useRef();
  const calibrationspan = useRef();
  const instrumentdetectionlimit = useRef();
  const limitofquantization = useRef();
  const miniumdetectablelimit = useRef();
  const practicalquantitationlimit = useRef();
  const parameterreportorder = useRef();
  const totalizeinreports = useRef();
  const miniuminreports = useRef();
  const [parameterDatatype, setparameterDatatype] = useState(1);
  const [TruncateRoundedvalue, setTruncateRoundedvalue] = useState(1);

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
  const parameterformdata = () => {
    let formData = new FormData();
    formData.append('ID', Id);
    formData.append('ParameterName', parametername.current.value);
    formData.append('SiteID', parametersite.current.value);
    formData.append('ParentParameterID', parentparameter.current == undefined ? null : parentparameter.current.value);
    formData.append('ParameterGroupID', parametergroup.current == undefined ? null : parametergroup.current.value);
    formData.append('WebsiteDisplayName', websitename.current.value);
    formData.append('Enabled', parameterenabled.current.checked);
    formData.append('EnableAirNowReporting', enableairnowreporting.current.checked);
    formData.append('FilterFromWebsite', filterfromwebsite.current.checked);
    formData.append('parameterDataTypeID', parameterDatatype);
    formData.append('Description', description.current.value);
    formData.append('MathEquationID', mathequation.current.value);
    formData.append('EPApoc', epapoc.current.value);
    formData.append('EPAmethod', epamethod.current.value);
    formData.append('EPAunitsID', epaunits.current.value);
    formData.append('EPAParameterID', epaparameter.current.value);
    formData.append('ReportedDigits', reporteddigits1);
    formData.append('Precision', precision.current.value);
    formData.append('CalibrationPrecision', calibrationprecision.current.value);
    formData.append('ParameterTemplateID', parametertemplate.current.value);
    formData.append('TruncateRoundRule', TruncateRoundedvalue);
    formData.append('ReportedUnitsID', reportedunits.current.value);
    formData.append('AnalyzerUnitsID', analyzerunits.current.value);
    formData.append('GraphMinimum', graphminimum.current.value);
    formData.append('GraphMaximum', graphmaximum.current.value);
    formData.append('CalibrationSpan', calibrationspan.current.value);
    formData.append('InstrumentDetectionLimit', instrumentdetectionlimit.current.value);
    formData.append('LimitOfQuantization', limitofquantization.current.value);
    formData.append('MinimumDetectableLimit', miniumdetectablelimit.current.value);
    formData.append('PracticalQuantitation', practicalquantitationlimit.current.value);
    formData.append('ParameterReportOrder', parameterreportorder.current.value);
    formData.append('TotalizeInReports', totalizeinreports.current.checked);
    formData.append('MiniuminReports', miniuminreports.current.checked);
    formData.append('Status', 1);
    return formData;
  }
  const AddParameter = (event) => {
    let form = document.querySelectorAll('#Parameterform')[0];
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
    } else {
      fetch(process.env.REACT_APP_WSurl + 'api/Parameters', {
        method: 'POST',
        body: parameterformdata(),
      }).then((response) => response.json())
        .then((responseJson) => {
          if (responseJson == 1) {
            toast.success('Parameter added successfully', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            GetParametersData();
          } else {
            toast.error('Unable to add parameter', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          }
        })
    }
  }

  const UpdateParameter = (event) => {
    let form = document.querySelectorAll('#Parameterform')[0];
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
    } else {
      let formdata = parameterformdata();
      fetch(process.env.REACT_APP_WSurl + 'api/Parameters/' + Id, {
        method: 'PUT',
        body: formdata,
      }).then((response) => response.json())
        .then((responseJson) => {
          if (responseJson == 1) {
            toast.success('Parameter updated successfully', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            GetParametersData();
          } else {
            toast.error('Unable to update parameter', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          };
        })
    }
  }

  const EditParameters = (item) => {
    setId(item.id)
    setAddbtn(false)
    setgridlist(false);
    setTimeout(function () {
      initializemulticolumn();
      InitializeParameters(item);
      // parametername.current.value = item.parameterName;
      parametersite.current.value = item.siteID;
      //$('#parentparameter').val(item.parentParameterID).trigger('change');
      // parametergroup.current.value = item.parameterGroupID;
        websitename.current.value = item.websiteDisplayName;
      $('#Parametertemplate').val(item.parameterTemplateID).trigger('change');
      parameterenabled.current.checked = item.enabled;
      //enableairnowreporting.current.checked = item.enableAirNowReporting;
      filterfromwebsite.current.checked = item.filterFromWebsite;
      //setparameterDatatype(item.ParameterDataTypeID);
      //description.current.value = item.description;
      //$('#Mathequation').val(item.mathEquationID).trigger('change');
      //epapoc.current.value = item.epApoc;
      //  epamethod.current.value = item.epAmethod;
      // epaunits.current.value = item.epAunitsID;
      //  $('#EpaParameter').val(item.epaParameterID).trigger('change');
      //  reporteddigits.current.value = item.reportedDigits;
      //  precision.current.value = item.precision;
      calibrationprecision.current.value = item.calibrationPrecision;
      //  setTruncateRoundedvalue(item.truncateRoundRule);
      //  $('#Reportedunits').val(item.reportedUnitsID).trigger('change');
      $('#Analyzerunits').val(item.analyzerUnitsID).trigger('change');
      //   graphminimum.current.value = item.graphMinimum;
      //   graphmaximum.current.value = item.graphMaximum;
      //   calibrationspan.current.value = item.calibrationSpan;
      //   instrumentdetectionlimit.current.value = item.instrumentDetectionLimit;
      //  limitofquantization.current.value = item.limitOfQuantization;
      //  miniumdetectablelimit.current.value = item.minimumDetectableLimit;
      //  practicalquantitationlimit.current.value = item.practicalQuantitation;
      //  parameterreportorder.current.value = item.parameterReportOrder;
      //  totalizeinreports.current.checked = item.totalizeInReports;
      //  miniuminreports.current.checked = item.miniuminReports;
    }, 100);
  }

  const ParameterApply = () => {
    let parametertemplateid = parametertemplate.current.value;
    let item = ListParameterTemplate.find(o => o.id === parseInt(parametertemplateid));
    InitializeParameters(item);
  }

  const InitializeParameters = (item) => {
    parametername.current.value = item.parameterName;
    $('#parentparameter').val(item.parentParameterID).trigger('change');
    parametergroup.current.value = item.parameterGroupID;
    parameterenabled.current.checked = true;
    enableairnowreporting.current.checked = item.enableAirNowReporting;
    setparameterDatatype(item.parameterDataTypeID);
    description.current.value = item.description;
    $('#Mathequation').val(item.mathEquationID).trigger('change');
    epapoc.current.value = item.epApoc;
    epamethod.current.value = item.epAmethod;
    epaunits.current.value = item.epAunitsID;
    $('#EpaParameter').val(item.epaParameterID).trigger('change');
    setreporteddigits(item.reportedDigits);
    precision.current.value = item.precision;
    setTruncateRoundedvalue(item.truncateRoundRule);
    $('#Reportedunits').val(item.reportedUnitsID).trigger('change');
    graphminimum.current.value = item.graphMinimum;
    graphmaximum.current.value = item.graphMaximum;
    calibrationspan.current.value = item.calibrationSpan;
    instrumentdetectionlimit.current.value = item.instrumentDetectionLimit;
    limitofquantization.current.value = item.limitOfQuantization;
    miniumdetectablelimit.current.value = item.minimumDetectableLimit;
    practicalquantitationlimit.current.value = item.practicalQuantitation;
    parameterreportorder.current.value = item.parameterReportOrder;
    totalizeinreports.current.checked = item.totalizeInReports;
    miniuminreports.current.checked = item.miniuminReports;
  }

  const DeleteParameters = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: ("You want to delete this Subscription !"),
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5cb85c",
      confirmButtonText: "Yes",
      closeOnConfirm: false
    })
      .then(function (isConfirm) {
        if (isConfirm.isConfirmed) {
          let id = item.id;
          fetch(process.env.REACT_APP_WSurl + 'api/Parameters/' + id, {
            method: 'DELETE'
          }).then((response) => response.json())
            .then((responseJson) => {
              if (responseJson == 1) {
                toast.success('Parameter Deleted successfully', {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                });
                GetParametersData();
              } else {
                toast.success('Parameter Deleted successfully', {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                });
              }
            }).catch((error) => console.log(error));
        }
      });
  }
  useEffect(() => {
    fetch(process.env.REACT_APP_WSurl + "api/Parameters/GetAllLookupData")
      .then((response) => response.json())
      .then((data) => {
        const data1 = data;
        let data2 = data;
        setlistEpaParameter(data1.listEpaParameter);
        setlistEpaUnits(data1.listEpaUnits);
        setlistMathEquation(data1.listMathEquation);
        setlistParameterTemplate(data1.listParameterTemplate);
        setlistReportedUnits(data1.listReportedUnits);
        setlistParameters(data1.listParameters);
        setlistDataType(data1.listDataType);
      })
      .catch((error) => console.log(error));
    // initializeJsGrid();
  }, []);

  useEffect(() => {
    initializeJsGrid();
  });



  const initializeJsGrid = function () {
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
        data: ListParameters,
        loadData: function (filter) {
          $(".jsgrid-filter-row input:text").addClass("form-control").addClass("form-control-sm");
          $(".jsgrid-filter-row select").addClass("custom-select").addClass("custom-select-sm");
          return $.grep(this.data, function (item) {
            if (item.description == null) { item.description = ""; }
            return ((!filter.siteID || item.siteID.toUpperCase().indexOf(filter.siteID.toUpperCase()) >= 0)
              && (!filter.parameterName || item.parameterName.toUpperCase().indexOf(filter.parameterName.toUpperCase()) >= 0)
              && (!filter.parentParameterID || item.parentParameterID === filter.parentParameterID)
              && (!filter.parameterTemplateID || item.parameterTemplateID === filter.parameterTemplateID)
              && (!filter.epaParameterID || item.epaParameterID === filter.epaParameterID)
              && (!filter.epAunitsID || item.epAunitsID === filter.epAunitsID)
              && (!filter.parameterDataTypeID || item.parameterDataTypeID === filter.parameterDataTypeID)
              && (!filter.reportedUnitsID || item.reportedUnitsID === filter.reportedUnitsID)
              && (!filter.analyzerUnitsID || item.analyzerUnitsID === filter.analyzerUnitsID)
              && (!filter.parameterGroupID || item.parameterGroupID.toUpperCase().indexOf(filter.parameterGroupID.toUpperCase()) >= 0)
              && (!filter.websiteDisplayName || item.websiteDisplayName.toUpperCase().indexOf(filter.websiteDisplayName.toUpperCase()) >= 0)
              /*  && (!filter.Country || item.Country === filter.Country) */
            );
          });
        }
      },
      fields: [
        { name: "siteID", title: "Site", type: "text", width: 150 },
        { name: "parameterName", title: "Parameter Name", type: "text" },
        { name: "enabled", title: "Enabled", type: "checkbox", title: "Enabled", sorting: false, filtering: false },
        { name: "parentParameterID", title: "Parent Parameter", type: "select", items: ListParameters, valueField: "id", textField: "parameterName", width: 200 },
        { name: "parameterTemplateID", title: "Parameter Template", type: "select", items: ListParameterTemplate, valueField: "id", textField: "parameterName", width: 200 },
        { name: "parameterGroupID", title: "Parameter Group", type: "text" },
        { name: "websiteDisplayName", title: "WebSite Display Name", type: "text" },
        { name: "parameterDataTypeID", title: "Data Type", type: "select", items: ListDataType, valueField: "id", textField: "dataType", width: 200},
        { name: "epApoc", title: "EPA POC", type: "text" },
        { name: "epaParameterID", title: "EPA Parameter", type: "select", items: ListEpaParameter, valueField: "id", textField: "description", width: 200 },
        { name: "epAunitsID", title: "EPA Units", type: "select", items: ListEpaUnits, valueField: "id", textField: "unitDescription", width: 200 },
        { name: "reportedUnitsID", title: "Reported Units", type: "select", items: ListReportedUnits, valueField: "id", textField: "unitName", width: 200 },
        { name: "analyzerUnitsID", title: "Acquired Units", type: "select", items: ListReportedUnits, valueField: "id", textField: "unitName", width: 200 },
        { name: "description", title: "Description", type: "text" },
        {
          type: "control", width: 100, editButton: false, deleteButton: false,
          itemTemplate: function (value, item) {
            // var $result = gridRefjsgrid.current.fields.control.prototype.itemTemplate.apply(this, arguments);

            var $customEditButton = $("<button>").attr({ class: "customGridEditbutton jsgrid-button jsgrid-edit-button" })
              .click(function (e) {
                EditParameters(item);
                /* alert("ID: " + item.id); */
                e.stopPropagation();
              });

            var $customDeleteButton = $("<button>").attr({ class: "customGridDeletebutton jsgrid-button jsgrid-delete-button" })
              .click(function (e) {
                DeleteParameters(item);
                e.stopPropagation();
              });

            return $("<div>").append($customEditButton).append($customDeleteButton);
            //return $result.add($customButton);
          }
        }
      ]
    });
  }


  const initializemulticolumn = () => {
    $('#parentparameter').inputpicker({
      data: ListParameters,
      fields: [
        { name: 'parameterName', text: 'Parameter' },
        { name: 'description', text: 'Description' }
      ],
      //  multiple: true,
      headShow: true,
      fieldText: 'parameterName',
      fieldValue: 'id',
      filterOpen: true,

    });
    $('#Parametertemplate').inputpicker({
      data: ListParameterTemplate,
      fields: [
        { name: 'parameterName', text: 'Parameter' },
        { name: 'description', text: 'Description' }
      ],
      //  multiple: true,
      headShow: true,
      fieldText: 'parameterName',
      fieldValue: 'id',
      filterOpen: true
    });
    $('#Mathequation').inputpicker({
      data: ListMathEquation,
      fields: [
        { name: 'equationName', text: 'Equation Name' },
        { name: 'equation', text: 'Equation' },
        { name: 'description', text: 'Description' }
      ],
      //  multiple: true,
      headShow: true,
      fieldText: 'equationName',
      fieldValue: 'id',
      filterOpen: true,

    });

    $('#EpaParameter').inputpicker({
      data: ListEpaParameter,
      fields: [
        { name: 'description', text: 'Description' },
        { name: 'code', text: 'Code' },
        { name: 'abbreviation', text: 'Abbreviation' },
        { name: 'casNumber', text: 'CAS Number' },
        { name: 'category', text: 'Category' }
      ],
      //  multiple: true,
      headShow: true,
      fieldText: 'description',
      fieldValue: 'id',
      filterOpen: true,
    });
    $('#Reportedunits').inputpicker({
      data: ListReportedUnits,
      fields: [
        { name: 'unitName', text: 'Unit' },
        { name: 'description', text: 'Description' },
      ],
      //  multiple: true,
      headShow: true,
      fieldText: 'unitName',
      fieldValue: 'id',
      filterOpen: true,
    });
    $('#Analyzerunits').inputpicker({
      data: ListReportedUnits,
      fields: [
        { name: 'unitName', text: 'Unit' },
        { name: 'description', text: 'Description' },
      ],
      //  multiple: true,
      headShow: true,
      fieldText: 'unitName',
      fieldValue: 'id',
      filterOpen: true,
    });
  }

  const AddSite = (param) => {
    if (param == 'gridlist') {
      setgridlist(true);
    } else {
      setgridlist(false);
      setAddbtn(true)
      setTimeout(function () {
        initializemulticolumn();
      }, 500);

    }
  }
  const AddParameterchange = (param) => {
    if (param == 'gridlist') {
      setgridlist(true);
    } else {
      setgridlist(false);
      setAddbtn(true)
      setTimeout(function () {
        initializemulticolumn();
      }, 500);

    }
  }

  const GetParametersData = () => {
    fetch(process.env.REACT_APP_WSurl + "api/Parameters",{
      method: 'GET',
    }).then((response) => response.json())
      .then((data) => {
        setlistParameters(data);
        setAddbtn(true);
        setgridlist(true);
      }).catch((error) => console.log(error));
  }

  const parameterdatatypechange = function (event) {
    setparameterDatatype(event.target.value != "" ? parseInt(event.target.value) : null);
  }
  const Truncateroundedchange = function (event) {
    setTruncateRoundedvalue(event.target.value != "" ? parseInt(event.target.value) : null);
  }

  const AllowNumbersonly=function(e){
   let re=/^[0-9\b]+$/;
   let typed = +e.key;
    if ((e.keyCode !=8 && e.keyCode !=9 && !re.test(e.key))) {
      e.preventDefault(); 
      e.stopPropagation();
        return false;
    }else if(+(e.target.value + typed) > e.target.max){
      e.preventDefault(); 
      e.stopPropagation();
        return false;
    }
  }

  const AllowNumbersanddotonly=function(e){
    let re=/^[0-9.]*$/;
    const typed = +e.key;
    if ((e.keyCode !=8 && e.keyCode !=9 && !re.test(e.key))) {
      e.preventDefault(); 
      e.stopPropagation();
        return false;
    }
  }

  return (
    <main id="main" className="main" >
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
                            <input type="text" className="form-control" placeholder="Enter system name" />
                          </div>
                        </div>
                        <div className="row">
                          <label htmlFor="inputAddress" className="form-label col-sm-2">Country Code:</label>
                          <div className="col-sm-10">
                            <input type="text" className="form-control" placeholder="Enter country code" />
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
                            <input type="text" className="form-control" placeholder="Enter agency code" />
                          </div>
                        </div>
                        <div className="row">
                          <label htmlFor="inputAddress" className="form-label col-sm-2">Zip Code:</label>
                          <div className="col-sm-10">
                            <input type="text" className="form-control" placeholder="Enter zip code" />
                          </div>
                        </div>
                        <div className="row">
                          <label htmlFor="inputAddress" className="form-label col-sm-2">System Database Identifier:</label>
                          <div className="col-sm-10">
                            <input type="text" className="form-control" placeholder="Enter database identifier" />
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
                                  <input type="text" className="form-control" placeholder="Enter name" id="inputEmail4" />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="row">
                                <label htmlFor="inputPassword4" className="form-label col-sm-3">Description:</label>
                                <div className="col-sm-9">
                                  <input type="text" className="form-control" placeholder="Enter description" id="inputPassword4" />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="row">
                                <label htmlFor="inputAddress" className="form-label col-sm-3">Abbreviation:</label>
                                <div className="col-sm-9">
                                  <input type="text" className="form-control" placeholder="Enter abbreviation" />
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
                                <input type="text" className="form-control" placeholder="Enter latitude" />
                              </div>

                              <label htmlFor="inputAddress" className="form-label col-sm-2">EPA Site:</label>
                              <div className="col-sm-4">
                                <input type="text" className="form-control" placeholder="Enter EPA site" />
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-2">Longitude:</label>
                              <div className="col-sm-4">
                                <input type="text" className="form-control" placeholder="Enter longitude" />
                              </div>

                              <label htmlFor="inputAddress" className="form-label col-sm-2">AIRNow Mnemonic:</label>
                              <div className="col-sm-4">
                                <input type="text" className="form-control" placeholder="Enter AIRNow Mnemonic" />
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-2">File Import Code:</label>
                              <div className="col-sm-4">
                                <input type="text" className="form-control" placeholder="Enter file code" />
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
                                <input type="text" className="form-control" placeholder="Enter website name" />
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
                                <input type="text" className="form-control" placeholder="Enter address1" />
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-2">Street Address2:</label>
                              <div className="col-sm-10">
                                <input type="text" className="form-control" placeholder="Enter address2" />
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-2">City:</label>
                              <div className="col-sm-10">
                                <input type="text" className="form-control" placeholder="Enter city" />
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-2">Country:</label>
                              <div className="col-sm-10">
                                <input type="text" className="form-control" placeholder="Enter country" />
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-2">State Region:</label>
                              <div className="col-sm-10">
                                <input type="text" className="form-control" placeholder="Enter region" />
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-2">Zip Code:</label>
                              <div className="col-sm-10">
                                <input type="text" className="form-control" placeholder="Enter zip code" />
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
                  <span className="operation_class mx-2" onClick={() => AddParameterchange()}><i className="bi bi-plus-circle-fill"></i> <span>Add</span></span>
                )}
                {!gridlist && (
                  <span className="operation_class mx-2" onClick={() => AddParameterchange('gridlist')}><i className="bi bi-card-list"></i> <span>List</span></span>
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
                                <input type="text" ref={parametersite} className="form-control" placeholder="Enter site" required />
                                <div class="invalid-feedback">Please enter site</div>
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputEmail4" className="form-label col-sm-2">Parameter:</label>
                              <div className="col-sm-10">
                                <input type="text" ref={parametername} className="form-control" placeholder="Enter parameter" required />
                                <div class="invalid-feedback">Please enter parameter</div>
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputEmail4" className="form-label col-sm-2">Parent Parameter:</label>
                              <div className="col-sm-10">
                                {/* <select  ref={parentparameter} className="form-select">
                                  <option selected ></option>
                                  <option>...</option>
                                </select> */}
                                <input id="parentparameter" ref={parentparameter} className="form-control" placeholder="Enter parent parameter" />
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputEmail4" className="form-label col-sm-2">Parameter Group:</label>
                              <div className="col-sm-10">
                                <select ref={parametergroup} className="form-select">
                                  <option selected>Choose...</option>
                                  <option>...</option>
                                </select>
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputEmail4" className="form-label col-sm-2">WebSite Display Name:</label>
                              <div className="col-sm-10">
                                <input type="text" ref={websitename} className="form-control" placeholder="Enter display name" />
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
                                {/* <select id="inputState" className="form-select">
                                  <option selected>Choose...</option>
                                  <option>...</option>
                                </select> */}
                                <input id="Parametertemplate" ref={parametertemplate} className="form-control" placeholder="Enter parameter template" />
                              </div>
                              <div className="text-center">
                                <button type="button" className="btn btn-primary px-4" onClick={ParameterApply}>Apply</button>
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
                                  <input className="form-check-input" defaultChecked={true} ref={parameterenabled} type="checkbox" />
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="form-check">
                                  <label className="form-check-label" htmlFor="gridCheck">
                                    Enable AIRNow Reporting
                                  </label>
                                  <input className="form-check-input" ref={enableairnowreporting} type="checkbox" />
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="form-check">
                                  <label className="form-check-label" htmlFor="gridCheck">
                                    Filter From WebSite
                                  </label>
                                  <input className="form-check-input" ref={filterfromwebsite} type="checkbox" />
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-sm-4">
                                <div className="row">
                                  <label htmlFor="inputAddress" className="form-label col-sm-6">Parameter Data Type:</label>
                                  <div className="col-sm-6">
                                    {ListDataType.map((x, y) =>
                                      <div className="form-check">
                                        <input className="form-check-input" type="radio" name="pdtradio" id="inlineRadio11" value={x.id} defaultChecked={x.id == 1} checked={x.id == parameterDatatype} onChange={parameterdatatypechange} />
                                        <label className="form-check-label" htmlFor={"inlineRadio" + x.id}>{x.dataType}</label>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="row">
                                  <label htmlFor="inputAddress" className="form-label col-sm-4">EPA POC:</label>
                                  <div className="col-sm-8">
                                    <input type="text" className="form-control" ref={epapoc} placeholder="Enter EPA POC" />
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="row">
                                  <label htmlFor="inputAddress" className="form-label col-sm-4">EPA Method:</label>
                                  <div className="col-sm-8">
                                    <input type="text" className="form-control" ref={epamethod} placeholder="Enter EPA method" />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-2">Description:</label>
                              <div className="col-sm-10">
                                <input type="text" className="form-control" ref={description} placeholder="Enter description" />
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-2">Math Equation(If Calculated):</label>
                              <div className="col-sm-10">
                                {/*  <select className="form-select">
                                  <option selected>Choose...</option>
                                  <option>...</option>
                                </select> */}
                                <input id="Mathequation" ref={mathequation} className="form-control" placeholder="Enter equation" />
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-2">EPA Units:</label>
                              <div className="col-sm-10">
                                <select className="form-select" ref={epaunits}>
                                  <option selected>Choose...</option>
                                  {ListEpaUnits.map((x, y) =>
                                    <option value={x.id} key={y} >{x.unitCode + "-" + x.unitDescription}</option>
                                  )}
                                </select>
                                {/* <input id="demo-2"  className="form-control" placeholder="" /> */}
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-2">EPA Parameters:</label>
                              <div className="col-sm-10">
                                {/* <select className="form-select">
                                  <option selected>Choose...</option>
                                  <option>...</option>
                                </select> */}
                                <input id="EpaParameter" ref={epaparameter} className="form-control" placeholder="Enter EPA parameters" />
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-sm-4">
                                <div className="row">
                                  <label htmlFor="inputAddress" className="form-label col-sm-4">Reported Digits:</label>
                                  <div className="col-sm-4">
                                    <input type="number" min="0" max="6" ref={reporteddigits} value={reporteddigits1}   onKeyDown={AllowNumbersonly}
                                    onChange={e => setreporteddigits(e.target.value)} className="form-control" placeholder="Enter reported digits" />
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="row">
                                  <label htmlFor="inputAddress" className="form-label col-sm-4">Precision:</label>
                                  <div className="col-sm-4">
                                    <input type="number" min="0" max={reporteddigits1} onFocus={e=>{if(!reporteddigits1)setreporteddigits(1)}} onKeyDown={AllowNumbersonly} ref={precision} className="form-control" placeholder="Enter precision" />
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="row">
                                  <label htmlFor="inputAddress" className="form-label col-sm-4">Calibration Precision:</label>
                                  <div className="col-sm-4">
                                    <input type="number" min="0" max="5" ref={calibrationprecision} className="form-control" placeholder="Enter calibration precision" />
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
                                      <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="1" checked={TruncateRoundedvalue == 1} onChange={Truncateroundedchange} />
                                      <label className="form-check-label" htmlFor="inlineRadio1">Round</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                      <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="2" checked={TruncateRoundedvalue == 2} onChange={Truncateroundedchange} />
                                      <label className="form-check-label" htmlFor="inlineRadio2">Truncate</label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="row">
                                  <label htmlFor="inputAddress" className="form-label col-sm-6">Graph Minimum:</label>
                                  <div className="col-sm-6">
                                    <input type="text" ref={graphminimum} className="form-control" placeholder="Enter graph minimum" />
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="row">
                                  <label htmlFor="inputAddress" className="form-label col-sm-6">Graph Maximum:</label>
                                  <div className="col-sm-6">
                                    <input type="text" ref={graphmaximum} className="form-control" placeholder="Enter graph maximum" />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-2">Reported Units:</label>
                              <div className="col-sm-10">
                                {/* <select className="form-select">
                                  <option selected>Choose...</option>
                                  <option>...</option>
                                </select> */}
                                <input id="Reportedunits" ref={reportedunits} className="form-control" placeholder="Enter reported units" required/>
                                <div class="invalid-feedback">Please select reported units</div>
                              </div>
                            </div>
                            <div className="row">
                              <label htmlFor="inputAddress" className="form-label col-sm-2">Analyzer Units (if diffrent):</label>
                              <div className="col-sm-10">
                                {/* <select className="form-select">
                                  <option selected>Choose...</option>
                                  <option>...</option>
                                </select> */}
                                <input id="Analyzerunits" ref={analyzerunits} className="form-control" placeholder="Enter analyzer units" />
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-sm-4">
                                <div className="row">
                                  <label htmlFor="inputAddress" className="form-label col-sm-6">Calibration Span:</label>
                                  <div className="col-sm-6">
                                    <input type="number" ref={calibrationspan} onBlur={e=>e.target.value=parseFloat(e.target.value).toFixed(2)} onKeyDown={AllowNumbersanddotonly}  className="form-control" placeholder="Enter calibration" />
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="row">
                                  <label htmlFor="inputAddress" className="form-label col-sm-6">Instrument Detection Limit:</label>
                                  <div className="col-sm-6">
                                    <input type="number" ref={instrumentdetectionlimit} onBlur={e=>e.target.value=parseFloat(e.target.value).toFixed(2)} onKeyDown={AllowNumbersanddotonly}  className="form-control" placeholder="Enter instrument detection limit" />
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="row">
                                  <label htmlFor="inputAddress" className="form-label col-sm-6">Limot of Quantization:</label>
                                  <div className="col-sm-6">
                                    <input type="number" ref={limitofquantization} onBlur={e=>e.target.value=parseFloat(e.target.value).toFixed(2)} onKeyDown={AllowNumbersanddotonly}  className="form-control" placeholder="Enter limot of quantization" />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-sm-4">
                                <div className="row">
                                  <label htmlFor="inputAddress" className="form-label col-sm-6">Minimum Detectable Limit:</label>
                                  <div className="col-sm-6">
                                    <input type="number" ref={miniumdetectablelimit} onBlur={e=>e.target.value=parseFloat(e.target.value).toFixed(2)} onKeyDown={AllowNumbersanddotonly}  className="form-control" placeholder="Enter minimum limit" />
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="row">
                                  <label htmlFor="inputAddress" className="form-label col-sm-6">Practical Quantitation Limit:</label>
                                  <div className="col-sm-6">
                                    <input type="number" ref={practicalquantitationlimit} onBlur={e=>e.target.value=parseFloat(e.target.value).toFixed(2)} onKeyDown={AllowNumbersanddotonly} className="form-control" placeholder="Enter quantitation limit" />
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="row">
                                  <label htmlFor="inputAddress" className="form-label col-sm-6">Parameter Report Order:</label>
                                  <div className="col-sm-4">
                                    <input type="number" ref={parameterreportorder} min="0" max="999" onKeyDown={AllowNumbersonly} className="form-control" placeholder="Enter report order" />
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
                                  <input className="form-check-input" ref={totalizeinreports} type="checkbox" />
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="form-check">
                                  <label className="form-check-label" htmlFor="gridCheck">
                                    Minimum in Reports
                                  </label>
                                  <input className="form-check-input" ref={miniuminreports} type="checkbox" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-12 text-center mt-2">
                    {Addbtn && (
                      <button class="btn btn-primary" onClick={AddParameter} type="button">Add Parameter</button>
                    )}
                    {!Addbtn && (
                      <button class="btn btn-primary" onClick={UpdateParameter} type="button">Update Parameter</button>
                    )}
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