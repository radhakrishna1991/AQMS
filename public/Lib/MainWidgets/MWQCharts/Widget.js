
define(['dojo/_base/declare',
   
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    "dojo/query", "dojo/on",
    "dojo/_base/window", 'dojo/_base/lang',
    "dojo/text!MainWidgets/MWQCharts/Widget.html",

    "dojo/i18n!MainWidgets/MWQCharts/nls/strings",
    'xstyle/css!../MWQCharts/css/style.css',
     "dojo/domReady!"],
    function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, query, on, win, lang, dijitTemplate, i18n
    ) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
            templateString: dijitTemplate,

            widgetsInTemplate: true,
            nls: i18n,

         
          ajxTrendCal: "",
          ajxIndicesCal: "",

          postCreate: function () {
              this.inherited(arguments);
              var node = dojo.byId(this.MWQChart);
              $("#divpopup").append(node);
              $("#divpopup").addClass('active');
          },

          startup: function () {
              
              this.inherited(arguments);
			  
		      
              $('#chartContainer').hide();
              dojo.query("#ddlSites").style("display", "none");
              dojo.query("#ddlGroup").style("display", "none");
              dojo.query("#ddlParameters").style("display", "none");
              
              $("#siteid").prop('disabled', true);
              $("#groupid").prop('disabled', true);             

             
              this.populateCategories();
			  this.populateSites();
              this.populateGroup();              
              
          },

          onOpen: function () {
              console.log('onOpen_Charts');
              this.InitializeControl();
			  
			if (window.location.href.indexOf("locale=ar") > -1) {
                  $("#MWQCharts_P_panel").css("right", "auto");
                  $("#MWQCharts_P_panel").css("left", "10px !important;");
                  document.getElementById("chartTypID").setAttribute("align", "left");
                  document.getElementById("categoryID").setAttribute("align", "left");
                  document.getElementById("sitesId").setAttribute("align", "left");
                  document.getElementById("typelabelID").setAttribute("align", "left");
                  document.getElementById("tdGroup").setAttribute("align", "left");
                  document.getElementById("paramLabelId").setAttribute("align", "left");
                  document.getElementById("tdValues").setAttribute("align", "left");
                  document.getElementById("tdMethod").setAttribute("align", "left");
                  document.getElementById("tdVMetValue").setAttribute("align", "left");
                  document.getElementById("threshId").setAttribute("align", "left");
                  document.getElementById("mwqFrmDate").setAttribute("align", "left");
                  document.getElementById("mwqFrmDateDD").setAttribute("align", "right");
                  document.getElementById("mwqToDate").setAttribute("align", "left");
                  document.getElementById("mwqToDateDD").setAttribute("align", "right");
                  $("#onClearId").css("float", "left");
                  $("#onClearId").css("margin-left", "45px");
                  $("#onClearId").css("margin-right", "unset");
                  $("#onsubmitID").css("float", "left");
                  $("#onsubmitID").css("margin-left", "10px");

              } else {
                  $("#MWQCharts_P_panel").css("right", "0px !important;");
              }  
				
			
			  // Hide MWQ Indices slider
			  if ($("#tabPane_w").hasClass("TabPaneClass_w") == false) {                                  
                $("#tabPane_w").addClass("TabPaneClass_w");
                $('.tabs_container_w').removeClass('active');
                $('.tabs_container_w').removeClass('open');
                $('.tabs_btn_w').removeClass('toggle');
                $('.map_container').removeClass('minimize');                                 
                $("#MWQIndicesDiv").removeClass("selected");  
				WidgetManager.getInstance().getWidgetById("WaterQualityIndex_P").showDefaultSite();							  	
               }
			   
			 
            
          },


          _ChartTypeSelectionChanged: function () {              
              $('#chartContainer').hide();
              dojo.query(".mainbox").style("display", "none");
              dojo.query("#chartContainerId").style("display", "none");
		  },

          _sitesSelectionChanged: function () {

              var selectedSites = $("#ddlSites option:selected").map(function (i, el) {
                  return $(el).val();
              }).get().toString();
              if (selectedSites.includes('All,')) {
                  $('#ddlSites option')[0].selected = false;
                 
              }


              var value;
           
          },

          _categoriesSelectionChanged: function () {

              var selectedCategories = $("#ddlCategory option:selected").map(function (i, el) {
                  return $(el).val();
              }).get().toString();
              if (selectedCategories.includes('All,')) {
                  $('#ddlCategory option')[0].selected = false;
                  selectedCategories = selectedCategories.replace('All,', '');
              }

              $.ajax({
                  /*url: 'https://enviroportal.ead.ae/MWQWebservice/MWQSitesRestServices.svc/GetSites',*/
                  url:"http://localhost:63422/MWQSitesRestServices.svc/GetSites",
                  dataType: 'json',
                  type: 'post',
                  contentType: 'application/json',
                  data: JSON.stringify({ 'categoryid': selectedCategories }),
                  success: function (data, textStatus, jQxhr) {
                      $("#ddlSites").empty();
                      $("#ddlSites").append("<option value='All'>All</option>");
                      for (var x = 0; x < data.GetSitesResult.ParamatersList.length; x++) {
                          $("#ddlSites").append("<option value='" + data.GetSitesResult.ParamatersList[x].SiteId + "'>" + data.GetSitesResult.ParamatersList[x].SiteName + "</option>");
                      }
                  },
                  error: function (msg) {
                      console.log("Error: " + msg.Status)
                  }

              });
          },

          _methodSelectionChanged: function () {

              if ($("#ddlMethod option:selected").html() === "Summary") {
				  $('#medthodValueAstrik').show();
                  $('.methodValueClass').removeAttr("disabled");
              } else {
				  $('#medthodValueAstrik').hide();
                  $(".methodValueClass").attr("disabled", "disabled");
                  $('.methodValueClass').val(0);
              }
          },

          _showExpandClick: function(){              
              //dojo.query("#searchTable").style("display", "block");
              //dojo.query("#expandColl").style("display", "none");
          },

          _groupSelectionChanged: function () {
              var selectedGroup = $("#ddlGroup option:selected").map(function (i, el) {
                  return $(el).val();
              }).get().toString();
              if (selectedGroup.includes('All,')) {
                  $('#ddlGroup option')[0].selected = false;
                  selectedGroup = selectedGroup.replace('All,', '');
              }
              console.log(selectedGroup)
              $.ajax({
                  //url: 'https://enviroportal.ead.ae/MWQWebservice/MWQSitesRestServices.svc/GetParameters', 
                  url:"http://localhost:63422/MWQSitesRestServices.svc/GetParameters",
                  dataType: 'json',
                  type: 'post',
                  contentType: 'application/json',
                  data: JSON.stringify({ 'groupid': selectedGroup }),
                  success: function (data, textStatus, jQxhr) {
                      $("#ddlParameters").empty();
                      $("#ddlParameters").append("<option value='All'>All</option>");
                      for (var x = 0; x < data.GetParametersResult.ParamatersList.length; x++) {
                          $("#ddlParameters").append("<option value='" + data.GetParametersResult.ParamatersList[x].ParamId + "'>" + data.GetParametersResult.ParamatersList[x].ParamName + " - ( " + data.GetParametersResult.ParamatersList[x].Units + " )" + "</option>");
                      }
                  },
                  error: function (msg) {
                      console.log("Error: " + msg.Status)
                  }

              });
          },

          _parameterSelectionChanged: function () {

              var selectedParameters = $("#ddlParameters option:selected").map(function (i, el) {
                  return $(el).val();
              }).get().toString();
              if (selectedParameters.includes('All,')) {
                  $('#ddlParameters option')[0].selected = false;
                  //selectedSites = selectedSites.replace('All,', '');
              }
          },

          _typeSelectionChanged: function () {
              if ($("#ddlType option:selected").html() != "Select Value") {
				   $('#chartContainer').hide();	
                  if ($("#ddlType option:selected").html() == "Indices") {

                      $(".methodClass").attr("disabled", "disabled");
					  $('.methodClass').css({ 'cursor': 'not-allowed' });								  
                      $("#thresholdID").attr("disabled", "disabled");
                      //$(".methodValueClass").attr("disabled", "disabled");
					  $('.methodValueClass').removeAttr("disabled");
					  $("select[id=ddlMethodValue] option:last").show();					  
                      $('#thresholdID').prop('checked', false);
                      $('.methodClass').val(0);
                      $('.methodValueClass').val(0);                     
					  $("#groupid").prop('disabled', true);									   
                      $("#ddlValues").prop("disabled", true);                      
					  $('#ddlValues').css({ 'cursor': 'not-allowed' });											   
                      $('#ValueAstrik').hide();
					   $('#methodAstrik').hide();
					    $('#medthodValueAstrik').show();
					  if ($('#ddlGroup')[0].selectize) {
                          $('#ddlGroup')[0].selectize.clear();
                          $('#ddlGroup')[0].selectize.disable();
                      }
                      $("#ddlGroup").empty();
                      dojo.query(".paramClass").style("display", "none");                      
                      $("#ddlParameters").empty();
                      dojo.query(".mainbox").style("display", "none");
                      dojo.query("#chartContainerId").style("display", "none");
					  if ($('#ddlParameters')[0].selectize != undefined) {
						$('#ddlParameters').selectize({                                          
						plugins: ['remove_button'],
						delimiter: ',',
						 labelField: 'ParamName',
					     valueField: 'ParamId',
						 persist: false
						});
						$('#ddlParameters')[0].selectize.clear()
						$('#ddlParameters')[0].selectize.clearOptions();						
						var data = [{'ParamId':'Microbial_Index','ParamName':'Microbial' },
						{'ParamId':'Eutrophication_Index','ParamName':'Eutrophication' },
						{'ParamId':'Sediment_Index','ParamName':'Sediment' }
						];
						for(var i=0;i < data.length;i++){
							$('#ddlParameters')[0].selectize.addOption(data[i]);
						}										 
						$('#ddlParameters')[0].selectize.refreshOptions();

					 }else{		
						$('#ddlParameters').selectize({                                          
						plugins: ['remove_button'],
						delimiter: ',',
						 labelField: 'ParamName',
						 valueField: 'ParamId',
						 persist: false
						});
						$('#ddlParameters')[0].selectize.clear()
						$('#ddlParameters')[0].selectize.clearOptions();						
						var data = [{'ParamId':'Microbial_Index','ParamName':'Microbial' },
						{'ParamId':'Eutrophication_Index','ParamName':'Eutrophication' },
						{'ParamId':'Sediment_Index','ParamName':'Sediment' }
						];
						for(var i=0;i < data.length;i++){
							$('#ddlParameters')[0].selectize.addOption(data[i]);
						}										 
						$('#ddlParameters')[0].selectize.refreshOptions();				 
                    
					 }
                  }
                  else {
                      $("#ddlParameters").empty();
                      $('.methodClass').removeAttr("disabled");
					  $('.methodClass').css({ 'cursor': 'auto' });							   
                      $('#thresholdID').removeAttr("disabled");                   
                      $('#ValueAstrik').show();
					  $('#methodAstrik').show();
					  $('#medthodValueAstrik').show();
					  $("select[id=ddlMethodValue] option:last").hide();						
                      
                      if ($('#ddlGroup')[0].selectize) {
                          $('#ddlGroup')[0].selectize.clear();
                          $('#ddlGroup')[0].selectize.enable();
                      }
					  if ($('#ddlParameters')[0].selectize) {
                          $('#ddlParameters')[0].selectize.clear();                          
                      }
                     
					  this.populateParameters();
                      $("#ddlGroup").prop("disabled", false);
					  $("#groupid").prop('disabled', false);									
                      $("#ddlValues").prop("disabled", false);
					  $('#ddlValues').css({ 'cursor': 'auto' });							 
                  }
              }
              else
              {
                  $("#ddlGroup").empty();
                  $("#ddlParameters").empty();
              }
          },

          _valueSelectionChanged: function () { },
          //Reset
          _onResetClick: function () {
              this.resetValues();
          },
          //Submit
          _onSubmitClick: function () {
			  
              if ($("#ddlChartType option:selected").html() === 'Select Value') {
                  notifyError('Please select all the mandatory fields');
                  return;
              }	
             
              var selectthreshold = $("#thresholdID").is(':checked');
              $('#chartContainer').empty();
			  dojo.query('#chartContainer').style({ height: "480px" });
              Highcharts.theme = {
                  colors: ['#f45b5b', '#8085e9', '#8d4654', '#7798BF', '#aaeeee',
                      '#ff0066', '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
                  chart: {
                      backgroundColor: null,
                      style: {
                          fontFamily: 'Signika, serif'
                      }
                  },
                  title: {
                      style: {
                          color: 'black',
                          fontSize: '16px',
                          fontWeight: 'bold'
                      }
                  },
                  subtitle: {
                      style: {
                          color: 'black'
                      }
                  },
                  tooltip: {
                      borderWidth: 0
                  },
                  legend: {
                      itemStyle: {
                          fontWeight: 'bold',
                          fontSize: '13px'
                      }
                  },
                  xAxis: {
                      labels: {
                          style: {
                              color: '#6e6e70'
                          }
                      }
                  },
                  yAxis: {
                      labels: {
                          style: {
                              color: '#6e6e70'
                          }
                      }
                  },
                  plotOptions: {
                      series: {
                          shadow: true
                      },
                      candlestick: {
                          lineColor: '#404048'
                      },
                      map: {
                          shadow: false
                      }
                  },

                  // Highstock specific
                  navigator: {
                      xAxis: {
                          gridLineColor: '#D0D0D8'
                      }
                  },
                  rangeSelector: {
                      buttonTheme: {
                          fill: 'white',
                          stroke: '#C0C0C8',
                          'stroke-width': 1,
                          states: {
                              select: {
                                  fill: '#D0D0D8'
                              }
                          }
                      }
                  },
                  scrollbar: {
                      trackBorderColor: '#C0C0C8'
                  },

                  // General
                  background2: '#E0E0E8'

              };
              
				 var selectedSites = $('#ddlSites')[0].selectize.items;	
				 var siteOptions = $('#ddlSites')[0].selectize.options;				 
				if(selectedSites.toString() == 'All'){
					var optKeys = Object.keys($('#ddlSites')[0].selectize.options);
					selectedSites = optKeys.filter(function (elem) {
                    return elem != "All";
                  });
				}				 
             
				if ($('#ddlGroup')[0].selectize) {
					var selectedGroup = $('#ddlGroup')[0].selectize.items;	
				}else{
					var selectedGroup = $("#ddlGroup option:selected").map(function (i, el) {
						return $(el).val();
					}).get();
				}			  													
              
              if (selectedGroup.toString() == 'All') {                  				
			      var optKeys = Object.keys($('#ddlGroup')[0].selectize.options);
                  selectedGroup = optKeys.filter(function (elem) {
                      return elem != "All";
                  });
              }

			  var selectedParams = $('#ddlParameters')[0].selectize.items;	
              if (selectedParams.toString() == 'All') {
                  
				  var optKeys = Object.keys($('#ddlParameters')[0].selectize.options);
                  selectedParams = optKeys.filter(function (elem) {
                      return elem != "All";
                  }); 
              }

              var selectType = $("#ddlType option:selected").html();
              var selectmethodValue = $("#ddlMethodValue option:selected").val();
              if (selectmethodValue == undefined) {
                  selectmethodValue = "";
              }

              var xcatcolor = {};
              var xcatcolorarray = [];
              var xcatcolorarrayunique = [];

              if ($("#ddlType option:selected").html() == "Indices") {
                  if (selectedSites.toString() == '')
                  {
                      notifyError('Please select all the mandatory fields');
                      return;
                  }
                  if (selectedParams == '') {
                      notifyError('Please select all the mandatory fields');
                      return;
                  }
                  if ($('#fromDate_MWQindices').prop('value') == '') {
                      notifyError('Please select all the mandatory fields');
                      return;
                  }
                  if ($('#toDate_MWQindices').prop('value') == '') {
                      notifyError('Please select all the mandatory fields');
                      return;
                  }
				  if ($("#ddlMethodValue option:selected").html() === 'Select Value') {
                      notifyError('Please select Method value');
                      return;
                  }

                  if (selectmethodValue === '') {
                      xtitle = 'monthly';
                  }
                  else {
                      xtitle = $(".methodValueClass option:selected").html();
                  }
				  
				  var fromDate = $('#fromDate_MWQindices').prop('value');
				  var toDate = $('#toDate_MWQindices').prop('value');

				  var a = moment(fromDate, 'YYYY-MM-DD');
				  var b = moment(toDate, 'YYYY-MM-DD');
				  var diffDays = b.diff(a, 'days');
				  
				  if (selectmethodValue === 'yearly') {
					  if (diffDays > 365) {
						  notifyError("Please select 12 months’ time period or choose 'Multiple Years’ option")
						  $("#IUCNProgressBar").css({ display: "none" });
						  $('#chartContainer').hide();
						  return;
					  }
                   }
				  $('#chartContainer').show();						  
                  this.showProgressBar();
                  var xtitleDiv = '<div style="margin-left: 130px; font-weight: bold;">'+ xtitle +'</div>' +
                                    '<div style="margin-left: -65px;font-weight: bold; font-size: 14px; float: right;">' +
                                    '<div style="display:inline-block;"><p style="width: 12px;height: 12px;margin:4px ;float: left; background-color: #ff9999;"></p><span style="color: #484545;"> Poor</span></div>' +
                                    '<div style="display:inline-block;"><p style="width: 12px;height: 12px;margin:4px ;float: left; background-color: #ffff99;"></p><span style="color: #484545;"> Moderate</span></div>' +
                                    '<div style="display:inline-block;"><p style="width: 12px;height: 12px;margin:4px ;float: left; background-color: #99ff99;"></p><span style="color: #484545;"> Good</span></div>' +
                                    '<div style="display:inline-block;"><p style="margin:20px ;float: left;"></p><span style="color: #2688bf;">E-Eutrophication</span></div>' +
                                    '<div style="display:inline-block;"><p style="margin:10px ;float: left;"></p><span style="color: #2688bf;">M-Microbial</span></div>' +
                                    '<div style="display:inline-block;"><p style="margin:10px ;float: left;"></p><span style="color: #2688bf;">S-Sediment</span></div>' +
                                   '</div>';
                  this.ajxIndicesCal = $.ajax({
                      url: 'http://localhost:63422/MWQSitesRestServices.svc/GetIndiesChat',
                      //url: 'https://enviroportal.ead.ae/MWQWebservice/MWQSitesRestServices.svc/GetIndiesChat', 
                      dataType: 'json',
                      type: 'post',
                      contentType: "application/json; charset=utf-8",
                      data: JSON.stringify({
                          selectSite: selectedSites,
                          selectValue: selectedParams,
                          fromDate: $('#fromDate_MWQindices').prop('value'),
                          toDate: $('#toDate_MWQindices').prop('value'),
						  methodvalue: selectmethodValue			  
                      }),

                      success: lang.hitch(this, function (data, textStatus, jQxhr) {                          
                          var chartdatadisplay = [];
                          var title = "";
                          dojo.query("#chartContainerId").style("display", "block");
                          var uniqueDates = [];
                          var uniqueSiteNames;
						if (data.GetIndiesChatResult != null) {
						    var chartDataDtaes = [];
						    var xval, xcolor;						   
						        for (var x = 0; x < data.GetIndiesChatResult.length; x++) {
						            var plist = data.GetIndiesChatResult[x]['ParamatersList'];
						            var siteNames = [];
						            var DateArray = [];
						            for (var j = 0; j < plist.length; j++) {
						                siteNames.push(plist[j].SiteName);
						                if (selectmethodValue === 'yearly' || selectmethodValue === 'multipleYears') {
						                    DateArray.push(plist[j].year);
						                }
						                else if (selectmethodValue === 'quarterly') {						                    
						                    DateArray.push(plist[j].year + '-Q' + plist[j].quarter);
						                }
						                else if (selectmethodValue === 'monthly') {
						                    var date = moment(plist[j].ReportedDate, 'MM/DD/YYYY').format('MMM-YYYY');
						                    DateArray.push(date);						                    
						                }
						            }
						            uniqueSiteNames = siteNames.filter((v, x, a) => a.indexOf(v) === x);						            
						            var parastieaName;
						            for (var k = 0; k < uniqueSiteNames.length; k++) {
						                var sitedata = [];
						                for (var j = 0; j < plist.length; j++) {
						                    if (plist[j].SiteName === uniqueSiteNames[k]) {						                       
						                        sitedata.push({ y: parseFloat(plist[j].Value), parameter: plist[0].ParamName });
						                        if (plist[0].ParamName === 'Microbial_Index') {
						                            parastieaName = uniqueSiteNames[k] + ' - Microbial';
						                        }
						                        else if (plist[0].ParamName === 'Eutrophication_Index') {
						                            parastieaName = uniqueSiteNames[k] + ' - Eutrophication';
						                        }else
						                            parastieaName = uniqueSiteNames[k] + ' - Sediment';
						                        
						                    }
						                }
						                if ($("#ddlChartType option:selected").html() == "Line Chart") {
						                    chartdatadisplay.push({ name: parastieaName, type: 'line', data: sitedata })
						                    title = "Line Chart";
						                }
						                else if ($("#ddlChartType option:selected").html() == "X Y Scatter") {
						                    chartdatadisplay.push({ name: parastieaName, type: 'scatter', data: sitedata })
						                    title = "X Y Scatter Chart";
						                }else
						                chartdatadisplay.push({ name: parastieaName, type: 'column', data: sitedata })
						            }
						        }
						        chartDataDtaes = DateArray.filter((v, x, a) => a.indexOf(v) === x);

                          xcatcolorarrayunique = xcatcolorarray.filter((obj, pos, arr) => {
                              return arr.map(mapObj =>
                                  mapObj['color']).indexOf(obj['color']) === pos;
                          });
                          var xstring = '';
                          for (var f = 0; f < xcatcolorarrayunique.length; f++) {
                              xstring = xstring + '<div style="display:inline-block;margin-right:10px;margin-bottom: 10px;"><p style="width: 12px;height: 12px;margin:4px ;float: left;background-color: ' + xcatcolorarrayunique[f].color + '"></p> <span style="color:' + xcatcolorarrayunique[f].color + '">' + xcatcolorarrayunique[f].name + '</span></div>';
                          }

                          Highcharts.chart('chartContainer', {
                              chart: {
                                  zoomType: 'xy'
                              },
                              title: {
                                  text: 'Water Quality Index Chart',
                                  x: -20
                              },
                              subtitle: { text: xstring, useHTML: true },
                              xAxis: {
                                  categories: chartDataDtaes,
                                  title: {
                                      useHTML: true,
                                      text: xtitleDiv,
                                      style: {
                                          fontSize: '12px',
                                          fontWeight: 'bold',
                                      }
                                  },
                                  labels: {
                                      formatter: function () {
                                          var ret = this.value,
                                              len = ret.length;
                                          if (len > 12) {
                                              ret = `<span style="color: ${xcatcolor[this.value]}">` + ret.slice(0, 12) + `</span>` + '<br/>' + `<span style="color: ${xcatcolor[this.value]}">` + ret.slice(12, len) + `</span>`;
                                          }

                                          if (len > 45) {
                                              ret = ret.slice(0, 45) + '...';
                                          }
                                          return ret;
                                      }
                                  }
                              },
                              yAxis: {
                                  min: 0,
                                  max: 100,
                                  gridLineWidth: 0,
                                  title: {
                                      text: 'MWQ Index',
                                      style: {                                          
                                          fontSize: '13px',
                                         // fontWeight: 'bold'
                                      }
                                  },
                                  plotBands: [
                                      { from: 0, to: 49, color: 'rgba(255, 0, 0, 0.2)' },
                                      { from: 50, to: 74, color: 'rgba(255, 255, 0, 0.2)' },
                                      { from: 75, to: 100, color: 'rgba(0, 255, 0, 0.2)' }
                                  ],
                              },
                              tooltip: {
                                  formatter: function () {
                                      var point = this;
                                      var siteName = point.series.name.split("-");
                                          return '<b>Parameter : </b>' + point.point.parameter +
                                               '<br><b>Site : </b>' + siteName[0] +
                                          "<br><b>Value :</b>" + point.y +
                                          "<br><b>Date :</b>" + point.x;
                                      
                                  },
                                  shadow: true,
                              },

                              legend: {
                                  enabled: true
								  
                              },
                              plotOptions: {
                                  series: {
                                      dataLabels: {
                                          enabled: true,
                                          formatter: function () {
                                              var name;
                                              if (this.point.parameter === 'Microbial_Index') {
                                                  name = 'M';
                                              }
                                              else if (this.point.parameter === 'Eutrophication_Index') {
                                                  name = 'E';
                                              }
                                              else {
                                                  name = 'S';
                                              }
                                              return name;
                                          }
                                      }
                                  },
                                  column: {
                                      grouping: true,
                                      shadow: false
                                  }
                              },
                              series: chartdatadisplay,
                              credits: {
                                  enabled: false
                              }
                              ,
                              exporting: {
								buttons: {
								  contextButton: {
									menuItems: [									  
									  'downloadPNG',
									  'downloadJPEG',
									  'downloadPDF',
									  'downloadSVG'									 
									  //'downloadCSV'
									]
								  }
								}
							  }
                          });
						} else {
                            notifyError('Data not available for selected criteria.');
							$("#IUCNProgressBar").css({ display: "none" });
							$('#chartContainer').hide();							  
                            return;
                        }
                          $("#IUCNProgressBar").css({ display: "none" });
                      }),
                      error: function () {
                          $("#IUCNProgressBar").css({ display: "none" });
                      }

                  });
              }

              else if ($("#ddlType option:selected").html() == "Parameters") {
                  if (selectedSites.toString() == '') {
                      notifyError('Please select all the mandatory fields');
                      return;
                  }
				  
				  if ($("#ddlMethod option:selected").html() === 'Select Value') {
						notifyError('Please select all the mandatory fields');
						return;
					}
				  if ($("#ddlMethod option:selected").html() === "Summary") {
					  if ($("#ddlMethodValue option:selected").html() === 'Select Value') {
						notifyError('Please select all the mandatory fields');
						return;
					}
				 
				  } 						
                 
                  if (selectedParams == '') {
                      notifyError('Please select all the mandatory fields');
                      return;
                  }
                  if ($('#ddlValues').val() == 'Select Value') {
                      notifyError('Please select all the mandatory fields');
                      return;
                  }
                  if ($('#fromDate_MWQindices').prop('value') == '') {
                      notifyError('Please select all the mandatory fields');
                      return;
                  }
                  if ($('#toDate_MWQindices').prop('value') == '') {
                      notifyError('Please select all the mandatory fields');
                      return;
                  }
                  $('#chartContainer').show();

                  var xtitle = '';                  
                  if (selectType === 'Parameters') {
                      if (selectmethodValue === '') {
                          xtitle = 'Daily';
                      }
                      else {
                          xtitle = $(".methodValueClass option:selected").html();                         
                      }                      
                  }
                  var xtitleDiv = '<div>' + xtitle + '</div><div style="float: right;"><div style="display:inline-block;"><p style="width: 12px;height: 12px;margin:4px ;float: left;background-color: red;"></p><span style="color: red;">Exceeded</span></div><div  style="display:inline-block;"><p style="width: 12px;height: 12px;margin:4px ;float: left;background-color: green;"></p><span style="color: green;">Non-Exceeded</span></div></div>';

                  this.showProgressBar();

                  if ((selectedSites.length > 5 || selectedParams.length > 2) || (selectthreshold === true && selectedParams.length > 2)) {                      
                      notifyError('Please select Maximum 2 Parameters Or Upto 5 sites.');
                      $("#IUCNProgressBar").css({ display: "none" });
                      $('#chartContainer').hide();
                      return;
                  }

                  this.ajxTrendCal = $.ajax({
                      url: 'http://localhost:63422/MWQSitesRestServices.svc/GetTrendChat',
                      //url: 'https://enviroportal.ead.ae/MWQWebservice/MWQSitesRestServices.svc/GetTrendChat',
                      //url: 'https://azurestgenviroportal.ead.ae/MWQWebservice/MWQSitesRestServices.svc/GetTrendChat',
                      dataType: 'json',
                      type: 'Post',
                      contentType: 'application/json',
                      data: JSON.stringify({
                          selectSite: selectedSites,
                          selectValue: selectedParams,
                          fromDate: $('#fromDate_MWQindices').val(),
                          toDate: $('#toDate_MWQindices').val(),
                          group: selectedGroup,
                          mode: $('#ddlValues').val(),
                          methodvalue: selectmethodValue

                      }),

                      success: lang.hitch(this, function (data, textStatus, jQxhr) {
                          var chartdatadisplay = [];
                          var units = [];
                          var uniqueunits = [];
                          var tdata = [];
						  if (data.GetTrendChatResult != null) {
						      var chartDataDtaes = [];
						      var thresholdArray = [];
						      var xval, xcolor;						      						      
						      var ylist = [];
							  
								for (var k = 0; k < selectedSites.length; k++) {
									var chatdata = data.GetTrendChatResult;
									for (var i = 0; i < chatdata.length; i++) {
									  var plist = chatdata[i]['ParamatersList'];
									  var ndata = [];
									  var ymax = [];
									  var pname = '';
									  var xval = '';
									 // var xcolor = '';
									  if (plist.length > 0) {
									  for (var j = 0; j < plist.length; j++) {
										ymax.push(parseFloat(plist[j].Parameter))
										if (selectmethodValue  === '' && selectedSites[k] === plist[j].SiteId) {
										  ndata.push({y: parseFloat(plist[j].Parameter), site: plist[j].ParamName, Threshold: plist[j].Threshold });
										  xval = plist[j].SampleDate;
										 // xcolor = this.getcolor(parseInt(plist[j].SiteId));
										    // xcatcolor[xval] = xcolor;
										  var date = moment(plist[j].SampleDate, 'DD/MM/YYYY').format('DD-MMM-YYYY')
										  chartDataDtaes.push(date);
										}
										else if (selectmethodValue === 'yearly' && selectedSites[k] === plist[j].SiteId) {
										  ndata.push({y: parseFloat(plist[j].Parameter), site: plist[j].ParamName, Threshold: plist[j].Threshold, year: plist[j].year
										  });
										  xval = plist[j].year; //+ '(' + plist[j].ParamName + ')';
										 // xcolor = this.getcolor(parseInt(plist[j].SiteId));
										 // xcatcolor[xval] = xcolor;
										  chartDataDtaes.push(xval);
										}
										else if (selectmethodValue === 'quarterly' && selectedSites[k] === plist[j].SiteId) {
										  ndata.push({y: parseFloat(plist[j].Parameter), site: plist[j].ParamName,
											Threshold: plist[j].Threshold, year: plist[j].year, quarter: plist[j].quarter
										  });
										  xval = plist[j].year + '-Q' + plist[j].quarter;
										//  xcolor = this.getcolor(parseInt(plist[j].SiteId));
										//  xcatcolor[xval] = xcolor;
										  chartDataDtaes.push(xval);
										}
										else if (selectmethodValue === 'monthly' && selectedSites[k] === plist[j].SiteId) {
										  ndata.push({y: parseFloat(plist[j].Parameter), site: plist[j].ParamName,
											 Threshold: plist[j].Threshold, year: plist[j].year, month: plist[j].month
											});
										  xval = plist[j].year + '-' + plist[j].month + '(Month)';//+ '(' + plist[j].ParamName + ')';
										 // xcolor = this.getcolor(parseInt(plist[j].SiteId));
										    // xcatcolor[xval] = xcolor;
										  var date = moment(plist[j].year + '-' + plist[j].month).format('MMM-YYYY');
										  chartDataDtaes.push(date);
										}
										//xcatcolorarray.push({name: plist[j].ParamName, color: xcolor})
										if (selectedSites[k] === plist[j].SiteId) {
										    pname = plist[j].ParamName + ' - [' + plist[j].Param +']';
										}
									  }
									}
									  if ($("#ddlChartType option:selected").html() == "Line Chart") {
										newtitle = 'Line Chart';
										chartdatadisplay.push({ name: pname, type: 'line', data: ndata , yAxis: i });
									  }
									  if ($("#ddlChartType option:selected").html() == "X Y Scatter") {
									      newtitle = 'X Y Scatter Chart';
									      chartdatadisplay.push({ name: pname, type: 'scatter', data: ndata, yAxis: i })
									  }
									  if ($("#ddlChartType option:selected").html() == "Bar Chart") {
									      newtitle = 'Bar Chart';
									      chartdatadisplay.push({ name: pname, type: 'column', data: ndata, yAxis: i })
									  }
							  var opp = false;
							  var yplotlines = [];
							  if ( i === 1) {
								opp = true;
							  }
							  if (selectthreshold ) {
								var aligntext = '';
								if (i === 0 ){
								  aligntext = 'left';
								}
								else
								{
								  aligntext = 'right';
								}
								ymax.push(plist[i].Threshold)
								if (parseFloat(plist[i].Threshold) >= 0) {
								  yplotlines.push({
									  value: plist[i].Threshold,
									  dashStyle: 'shortdash',
									  color:  'red',
									  width: 2,
									  label: {
                                              text: '('+plist[0].Param +' - ' + plist[i].Threshold + ')',
                                              style: {
                                                  color: 'red',
                                                  wordBreak: 'break-all',
                                                  textOverflow: 'allow'
                                              },
                                               x: 5,
                                              align: aligntext
                                          },
										zIndex: 5
									})
								  }
							  }
							ylist.push({
								title: {
									text: plist[0].Param,
									style: {
										color: Highcharts.getOptions().colors[i]
									}
								},
								labels: {
									format: '{value}',
									style: {
										color: Highcharts.getOptions().colors[i]
									}
								},
								min: 0,
								max: Math.max(...ymax),
								plotLines: yplotlines,
								opposite : opp
							    })
						    }
						 } 					 
						chartDataDtaes = chartDataDtaes.filter((v, x, a) => a.indexOf(v) === x);
                          xcatcolorarrayunique = xcatcolorarray.filter((obj, pos, arr) => {
                              return arr.map(mapObj =>
                                  mapObj['color']).indexOf(obj['color']) === pos;
                          });
                          var xstring = '';                         
						  
							if ($("#ddlChartType option:selected").html() === "Bar Chart") {
								for (let f = 0; f < xcatcolorarrayunique.length; f++) {
								xstring = xstring +
								'<div style="display:inline-block;margin-right:10px;margin-bottom: 10px;">' +
								'<p style="width: 12px;height: 12px;margin:4px ;float: left;background-color: '
								+ xcatcolorarrayunique[f].color + '"></p> <span style="color:' + xcatcolorarrayunique[f].color + '">'
								+ xcatcolorarrayunique[f].name + '</span></div>';
								}
							}
							  ylist =  ylist.filter((obj, index, self) =>
							  index === self.findIndex((el) => (
								  el.title.text   === obj.title.text
							  ))
							)
						

						  chartdatadisplay = chartdatadisplay.filter((obj, index, self) =>
						      index === self.findIndex((el) => (
                                  el.name === obj.name && el.name !== '')));

                         // uniqueunits = units.filter((v, x, a) => a.indexOf(v) === x);
                          dojo.query(".mainbox").style("display", "block");
                          dojo.query("#chartContainerId").style("display", "block");
                         
                          // Apply the theme
                          //Highcharts.setOptions(Highcharts.theme);
                          Highcharts.chart('chartContainer', {
                              chart: {
                                  zoomType: 'xy'
                              },
                              title: {
                                  text: 'Marine Water Quality Parameter Chart',
                                  x: -20                                  
                              },
                              //subtitle: { text: xstring, useHTML: true },
                              xAxis: {
                                  categories: chartDataDtaes,
                                  title: {
                                      useHTML: true,
                                      text: xtitleDiv,
                                  },
                                  //labels: {
                                  //    formatter () {
                                  //        return `<span style="color: ${xcatcolor[this.value]}">${this.value}</span>`
                                  //    }
                                  //}
                                  labels: {
                                      formatter: function () {
                                          var ret = this.value,
                                              len = ret.length;
                                          if (selectmethodValue === '') {
                                              if (len > 11) {
                                                  ret = `<span style="color: ${xcatcolor[this.value]}">` + ret.slice(0, 11) + `</span>` + '<br/>' + `<span style="color: ${xcatcolor[this.value]}">` + ret.slice(11, len) + `</span>`;
                                              }

                                              if (len > 45) {
                                                  ret = ret.slice(0, 45) + '...';
                                              }
                                          }
                                          else if (selectmethodValue === 'quarterly') {
                                              if (len > 15) {
                                                  ret = `<span style="color: ${xcatcolor[this.value]}">` + ret.slice(0, 15) + `</span>` + '<br/>' + `<span style="color: ${xcatcolor[this.value]}">` + ret.slice(15, len) + `</span>`;
                                              }

                                              if (len > 45) {
                                                  ret = ret.slice(0, 45) + '...';
                                              }
                                          }
                                          else {
                                              if (len > 10) {
                                                  ret = `<span style="color: ${xcatcolor[this.value]}">` + ret.slice(0, 10) + `</span>` + '<br/>' + `<span style="color: ${xcatcolor[this.value]}">` + ret.slice(10, len) + `</span>`;
                                              }

                                              if (len > 45) {
                                                  ret = ret.slice(0, 45) + '...';
                                              }
                                          }
                                                                                   
                                          return ret;
                                      }
                                  }
                              },
                              
                              yAxis : ylist,
                              plotOptions: {
                                  series: {
                                      dataLabels: {
                                          enabled: true,
                                          formatter: function () {
                                              return this.point.Threshold !== '' ?
                                              (Number(this.point.y) > Number(this.point.Threshold) ? '<b style="color:red">' + this.point.y + '</b>' :
                                              '<b style="color:green">' + this.point.y + '</b>') : '';
                                          }
                                      }
                                  },
                                  column: {
                                      grouping: true,
                                      shadow: false
                                  }
                              },
                              tooltip: {
                                  formatter: function () {
                                      var point = this;
                                      if (selectType === 'Parameters') {
                                          var tooltip = '';
                                          var tooltipyear = '';
										  var parameterdisplay = '';
										  var yeardisplay = "";
                                          if (selectmethodValue === '') {
                                              tooltipyear = '<br><b>SampleDate : </b>';
                                          }
                                          else
                                          {
                                              tooltipyear = '<br><b>Year : </b>';
                                          }
										  
                                          var paramArr = point.series.name.split('- [');
                                          var parameter = paramArr[1].slice(0, paramArr[1].indexOf(']'));
                                          parameterdisplay = parameter;//point.series.name.slice(0, point.series.name.lastIndexOf('-'));
											yeardisplay = point.x;
											
                                          if ( point.point.Threshold !== '') {
                                              tooltip = '<b>Parameter : </b>' + parameterdisplay +
                                              '<br><b>Site : </b>' + point.point.site +
                                              tooltipyear + yeardisplay +
                                              '<br><b>Threshold : </b>' + point.point.Threshold +
                                              '<br><b>Value : </b>' + point.y;
                                          }
                                          else
                                          {
                                              tooltip = '<b>Parameter : </b>' + parameterdisplay +
                                              '<br><b>Site : </b>' + point.point.site +
                                              tooltipyear + yeardisplay +
                                              '<br><b>Value : </b>' + point.y;
                                          }
                                          return tooltip;
                                      } else {
                                          return (
                                            '<b>Parameter : </b>' +
                                            point.series.name +
                                            '<br><b>Site :</b>' +
                                            point.point.site +
                                            '<br><b>Value :</b>' +
                                            point.y +
                                            '<br><b>Date :</b>' +
                                            point.x
                                          );
                                      }                                      

                                  }
                                 
                              },

                              legend: {
                                  enabled: true
                              },
                              series: chartdatadisplay,
                              credits: {
                                  enabled: false
                              },
							  exporting: {
								buttons: {
								  contextButton: {
									menuItems: [									  
									  'downloadPNG',
									  'downloadJPEG',
									  'downloadPDF',
									  'downloadSVG'									 
									  //'downloadCSV'
									]
								  }
								}
							  }
                          });
                          $(".highcharts-axis-title").css("width", "510px");
						 } else {
                              notifyError('Data not available for selected criteria.');
                              $("#IUCNProgressBar").css({ display: "none" });
							  $('#chartContainer').hide();							  
                              return;
                        }
                        $("#IUCNProgressBar").css({ display: "none" });
                        }),
                      error: function (msg) {
                          $("#IUCNProgressBar").css({ display: "none" });
                          console.log("Error: " + msg.Status)
                      }

                  });
              }
              else {
                  notifyError('Please select all the mandatory fields');
                  return;
              }
          },
		  
		  getFormattedDate: function (date) {
			var today = new Date(date);
				  var dd = today.getDate();
				  var mm = today.getMonth() + 1; 

				  var yyyy = today.getFullYear();
				  if (dd < 10) {
					  dd = '0' + dd;
				  }
				  if (mm < 10) {
					  mm = '0' + mm;
				  }
				  return dd + '-' + mm + '-' + yyyy;	
		  },
          

          populateCategories: function () {

              $.ajax({
                  //url: 'https://enviroportal.ead.ae/MWQWebservice/MWQSitesRestServices.svc/GetCategoryList',
                  url:"http://localhost:63422/MWQSitesRestServices.svc/GetCategoryList",
                  dataType: 'json',
                  type: 'post',
                  contentType: 'application/json',
                  data: {},

                  success: lang.hitch(this, function (data, textStatus, jQxhr) {
                      
                      $("#ddlCategory").append("<option value='All'>All</option>");
                      for (var x = 0; x < data.GetCategoryListResult.CategoryLists.length; x++) {
                          $("#ddlCategory").append("<option value='" + data.GetCategoryListResult.CategoryLists[x].categoryId + "'>" + data.GetCategoryListResult.CategoryLists[x].categoryName + "</option>");
                      }
						$('#ddlCategory').selectize({                          
                          plugins: ['remove_button'],
                          delimiter: ',',
                          persist: false,                          
                          onChange: lang.hitch(this, function (event) {
                              var selectedCategories = $("#ddlCategory option:selected").map(function (i, el) {
                                  return $(el).val();
                              }).get().toString();

                              if (selectedCategories.includes("All")) {
                                      var splitem = selectedCategories.split(",");                                      
                                      if (splitem[0] == "All" && splitem.length > 1) {
                                          for (var i = 0; i < splitem.length; i++) {
                                              if (splitem[i] == "All") {
                                                  $('#ddlCategory')[0].selectize.removeItem(splitem[i]);
                                                  $('#ddlCategory')[0].selectize.refreshOptions();
                                              }
                                          }                                          
                                      }else
                                      {
                                          for (var x = 0; x < splitem.length; x++) {
                                              if (splitem[x] != "All") {
                                                  $('#ddlCategory')[0].selectize.removeItem(splitem[x]);
                                                  $('#ddlCategory')[0].selectize.refreshOptions();
                                              }
                                          }
                                      }
                              }
							  if(selectedCategories != ""){
								  this.populateSites(selectedCategories);	
							  }
							
                          })
                      });
					  
                  }),
                  error: function (msg) {
                      console.log("Error: " + msg.Status)
                  }

              });
          },
		  
		  populateSites: function(Categories){
			  var selectedCategories;
			  if(Categories != undefined){
				  selectedCategories = Categories;
			  }else{
				  selectedCategories = "All";
			  }			  
			  $.ajax({																  
                  //url: 'https://enviroportal.ead.ae/MWQWebservice/MWQSitesRestServices.svc/GetSites',
                                  url:"http://localhost:63422/MWQSitesRestServices.svc/GetSites",
                                  dataType: 'json',
                                  type: 'post',
                                  contentType: 'application/json',
                                  data: JSON.stringify({ 'categoryid': selectedCategories }),
                                  success: function (data, textStatus, jQxhr) {  
									dojo.query(".siteClass").style("display", "none");								  
									$("#ddlSites").empty();
									if (data.GetSitesResult.ParamatersList.length > 0) {

									    if ($('#ddlSites')[0].selectize != undefined) {
									        $('#ddlSites')[0].selectize.clear()
									        $('#ddlSites')[0].selectize.clearOptions();
									        var AllOpt = { SiteName: "All", SiteId: "All", disabled: false, $order: 1 };
									        $('#ddlSites')[0].selectize.addOption(AllOpt);
									        var options = data.GetSitesResult.ParamatersList;
									        $('#ddlSites')[0].selectize.addOption("All");
									        for (var i = 0; i < options.length; i++) {
									            var optionValue = {
									                SiteId: options[i].SiteId,
									                SiteName: '(' + options[i].SiteCode + ') - ' + options[i].SiteName
									            };
									            $('#ddlSites')[0].selectize.addOption(optionValue);
									        }
									        $('#ddlSites')[0].selectize.refreshOptions();

									    } else {
									        
									        $("#ddlSites").append("<option value='All'>All</option>");
									        for (var x = 0; x < data.GetSitesResult.ParamatersList.length; x++) {
									            $("#ddlSites").append("<option value='" + data.GetSitesResult.ParamatersList[x].SiteId + "'> (" + data.GetSitesResult.ParamatersList[x].SiteCode + ") - " + data.GetSitesResult.ParamatersList[x].SiteName + "</option>");
									        }
									        $('#ddlSites').selectize({
									            plugins: ['remove_button'],
									            delimiter: ',',
									            labelField: 'SiteName',
									            valueField: 'SiteId',
									            persist: false,
									            createFilter: $('#regex').val(),
									            onChange: function (event) {
									                var selectedSites = $("#ddlSites option:selected").map(function (i, el) {
									                    return $(el).val();
									                }).get().toString();


									                if (selectedSites.includes("All")) {
									                    var splitem = selectedSites.split(",");
									                    if (splitem[0] == "All" && splitem.length > 1) {
									                        for (var i = 0; i < splitem.length; i++) {
									                            if (splitem[i] == "All") {
									                                $('#ddlSites')[0].selectize.removeItem(splitem[i]);									                                
									                            }
									                        }
									                        var AllOpt = { SiteName: "All", SiteId: "All", disabled: false, $order: 1 };
									                        $('#ddlSites')[0].selectize.addOption(AllOpt);
									                    } else {
									                        for (var x = 0; x < splitem.length; x++) {
									                            if (splitem[x] != "All") {
									                                $('#ddlSites')[0].selectize.removeItem(splitem[x]);
									                              
									                            }
									                        }
									                    }
									                    $('#ddlSites')[0].selectize.refreshOptions();
									                }
									            }
									        });
									    }
									}									
									
                                  },
                                  error: function (msg) {
                                      console.log("Error: " + msg.Status)
                                  }

                              });
			  
		  },

          populateGroup: function () {

              $.ajax({
                  //url: 'https://enviroportal.ead.ae/MWQWebservice/MWQSitesRestServices.svc/getGroup',
                  url:"http://localhost:63422/MWQSitesRestServices.svc/getGroup",
                  dataType: 'json',
                  type: 'post',
                  contentType: 'application/json',
                  data: {},

                  success: lang.hitch(this, function (data, textStatus, jQxhr) {
                      
                      $("#ddlGroup").append("<option value='All'>All</option>");
                      for (var x = 0; x < data.GetGroupInfoResult.ParamatersList.length; x++) {
                          $("#ddlGroup").append("<option value='" + data.GetGroupInfoResult.ParamatersList[x].GroupId + "'>" + data.GetGroupInfoResult.ParamatersList[x].GroupName + "</option>");
                      }
						$('#ddlGroup').selectize({
                          plugins: ['remove_button'],
                          delimiter: ',',
                          persist: false,                          
                          onChange: lang.hitch(this, function (event) {                              
                              var selectedGroup = $("#ddlGroup option:selected").map(function (i, el) {
                                  return $(el).val();
                              }).get().toString();
                              
                              if (selectedGroup.includes("All")) {
                                  var splitem = selectedGroup.split(",");
                                  if (splitem[0] == "All" && splitem.length > 1) {
                                      for (var i = 0; i < splitem.length; i++) {
                                          if (splitem[i] == "All") {
                                              $('#ddlGroup')[0].selectize.removeItem(splitem[i]);
                                              $('#ddlGroup')[0].selectize.refreshOptions();
                                          }
                                      }
                                  } else {
                                      for (var x = 0; x < splitem.length; x++) {
                                          if (splitem[x] != "All") {
                                              $('#ddlGroup')[0].selectize.removeItem(splitem[x]);
                                              $('#ddlGroup')[0].selectize.refreshOptions();
                                          }
                                      }
                                  }
                              }
							  if(selectedGroup != ""){
								  this.populateParameters(selectedGroup);	
							  }
                          })
                      });
					  
                  }),
                  error: function (msg) {
                      console.log("Error: " + msg.Status)
                  }

              });
          },

          populateParameters: function (groups) {			   
			   var selectedGroup;
			  if(groups != undefined){
				  selectedGroup = groups;
			  }else{
				  selectedGroup = "All";
			  }	
			   
			  $.ajax({
                  //url: 'https://enviroportal.ead.ae/MWQWebservice/MWQSitesRestServices.svc/GetParameters',
                                  url:"http://localhost:63422/MWQSitesRestServices.svc/GetParameters",
                                  dataType: 'json',
                                  type: 'post',
                                  contentType: 'application/json',
                                  data: JSON.stringify({ 'groupid': selectedGroup }),
                                  success: function (data, textStatus, jQxhr) {
									  dojo.query(".paramClass").style("display", "none");									
									  $("#ddlParameters").empty();
									  if (data.GetParametersResult.ParamatersList.length > 0) {
									      if ($('#ddlParameters')[0].selectize != undefined) {
									          $('#ddlParameters').selectize({
									              plugins: ['remove_button'],
									              delimiter: ',',
									              labelField: 'ParamName',
									              valueField: 'ParamId',
									              persist: false
									          });
									          $('#ddlParameters')[0].selectize.clear()
									          $('#ddlParameters')[0].selectize.clearOptions();
									          var options = data.GetParametersResult.ParamatersList;
									          if (options.length > 0) {
									              for (var i = 0; i < options.length; i++) {
									                  var valueVthUnit = {
									                      ParamId: options[i].ParamId,
									                      ParamName: options[i].ParamName + '- (' + options[i].Units + ')'
									                  };
									                  $('#ddlParameters')[0].selectize.addOption(valueVthUnit);
									              }
									              $('#ddlParameters')[0].selectize.refreshOptions();
									          }

									      } else {
									          if (dojo.query("#ddlParameters")[0].options.length == 0) {									              
									              for (var x = 0; x < data.GetParametersResult.ParamatersList.length; x++) {
									                  $("#ddlParameters").append("<option value='" + data.GetParametersResult.ParamatersList[x].ParamId + "'>" + data.GetParametersResult.ParamatersList[x].ParamName + " - ( " + data.GetParametersResult.ParamatersList[x].Units + " )" + "</option>");
									              }
									          }
									          $('#ddlParameters').selectize({
									              plugins: ['remove_button'],
									              delimiter: ',',
									              persist: false,
									              labelField: 'ParamName',
									              valueField: 'ParamId',
									              onChange: function (event) {
									                  var selectedParameters = $("#ddlParameters option:selected").map(function (i, el) {
									                      return $(el).val();
									                  }).get().toString();

									                  if ($("#ddlType option:selected").html() == "Indices") {									                     
									                      $('#ddlParameters')[0].selectize.clearOptions();
									                      
									                      var data = [{ 'ParamId': 'Microbial_Index', 'ParamName': 'Microbial' },
                                                          { 'ParamId': 'Eutrophication_Index', 'ParamName': 'Eutrophication' },
                                                          { 'ParamId': 'Sediment_Index', 'ParamName': 'Sediment' }
									                      ];
									                      for (var i = 0; i < data.length; i++) {
									                          $('#ddlParameters')[0].selectize.addOption(data[i]);
									                      }
									                      $('#ddlParameters')[0].selectize.refreshOptions();
									                  }
									                  
									              }
									          });
									          
									      }
									  }
                                  },
                                  error: function (msg) {
                                      console.log("Error: " + msg.Status)
                                  }

                              });
          },

          onClose: function () {
              console.log('onClose');			                          
              this.resetValues();
			  
          },

          resetValues: function () {
              $("#ddlChartType").prop("selectedIndex", 0);
			  $("#IUCNProgressBar").css({ display: "none" }); 
              $("#ddlCategory option:selected").prop("selected", false);
              $("#ddlSites").empty();
              $("#ddlType").prop("selectedIndex", 0);
              $("#ddlGroup").empty();
              $("#ddlParameters").empty();
              $("#ddlValues").prop("selectedIndex", 0);
              $('#fromDate_MWQindices').prop('value', '');
              $('#toDate_MWQindices').prop('value', '');
              $('#chartContainer').empty();
			  $('#chartContainer').hide();
              if ($('#ddlCategory')[0].selectize != undefined) {
                  $('#ddlCategory')[0].selectize.clear();                                  
              }
              if ($('#ddlSites')[0].selectize != undefined) {
                  $('#ddlSites')[0].selectize.clear();
              }
              if ($('#ddlGroup')[0].selectize != undefined) {
                  $('#ddlGroup')[0].selectize.clear();
              }
              if ($('#ddlParameters')[0].selectize != undefined) {
                  $('#ddlParameters')[0].selectize.clear();
              } 
              if (this.ajxTrendCal) {
                  this.ajxTrendCal.abort();
              }
              if (this.ajxIndicesCal) {
                  this.ajxIndicesCal.abort();
              }
          },

         
          
          onMinimize: function () {
              console.log('onMinimize');
          },

          showProgressBar: function () {
              $("#IUCNProgressBar").css({ display: "block" });
          },

          hideProgressBar: function () {
              $("#IUCNProgressBar").css({ display: "none" });
          },

          getcolor: function (i){
              var colorarray = ['#63b598', '#ce7d78', '#ea9e70',
                  '#4ca2f9', '#a4e43f', '#d298e2', '#6119d0', '#1c0365', '#14a9ad',
          '#d2737d' , '#c0a43c' , '#f2510e' , '#651be6' , '#79806e' , '#61da5e' , '#cd2f00' ,
          '#9348af' , '#01ac53' , '#c5a4fb' , '#996635', '#b11573' , '#4bb473' , '#75d89e' ,
          '#2f3f94' , '#2f7b99' , '#da967d' , '#34891f' , '#b0d87b' , '#ca4751' , '#7e50a8' ,
          '#c4d647', '#e0eeb8', '#11dec1', '#289812', '#566ca0', '#ffdbe1', '#2f1179',
          '#a48a9e', '#c6e1e8', '#648177', '#0d5ac1', '#f205e6',
          '#935b6d' , '#916988' , '#513d98' , '#aead3a', '#9e6d71', '#4b5bdc', '#0cd36d',
          '#250662', '#cb5bea', '#228916', '#ac3e1b', '#df514a', '#539397', '#880977',
          '#f697c1', '#ba96ce', '#679c9d', '#c6c42c', '#5d2c52', '#48b41b', '#e1cf3b',
          '#5be4f0', '#57c4d8', '#a4d17a', '#225b8', '#be608b', '#96b00c', '#088baf',
          '#f158bf', '#e145ba', '#ee91e3', '#05d371', '#5426e0', '#4834d0', '#802234',
          '#6749e8', '#0971f0', '#8fb413', '#b2b4f0', '#c3c89d', '#c9a941', '#41d158',
          '#fb21a3', '#51aed9', '#5bb32d', '#807fb', '#21538e', '#89d534', '#d36647',
          '#7fb411', '#0023b8', '#3b8c2a', '#986b53', '#f50422', '#983f7a', '#ea24a3',
          '#79352c', '#521250', '#c79ed2', '#d6dd92', '#e33e52', '#b2be57', '#fa06ec',
          '#1bb699', '#6b2e5f', '#64820f', '#1c271', '#21538e', '#89d534', '#d36647',
          '#7fb411', '#0023b8', '#3b8c2a', '#986b53', '#f50422', '#983f7a', '#ea24a3',
          '#79352c', '#521250', '#c79ed2', '#d6dd92', '#e33e52', '#b2be57', '#fa06ec',
          '#1bb699', '#6b2e5f', '#64820f', '#1c271', '#9cb64a', '#996c48', '#9ab9b7',
          '#06e052', '#e3a481', '#0eb621', '#fc458e', '#b2db15', '#aa226d', '#792ed8'];
          return colorarray[i];
        }

      });
  });