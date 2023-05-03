define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!./PredefinedCharts.html',
    'dojo/Evented'
],
    function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
        template, Evented
    ) {

        return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
            templateString: template,
            baseClass: 'PredefinedCharts',
            declaredClass: 'widget-PredefinedCharts',
            globalCurrentWidget: null,
            appConfig: null,
            constructor: function (args) {
                this.appConfig = args.config;
            },

            postCreate: function () {
                this.inherited(arguments);
                $(this.NO2_Label).html("NO<sub>2</sub>");
                $(this.SO2_Label).html("SO<sub>2</sub>");
                $(this.O3_Label).html("O<sub>3</sub>");
                $(this.PM10_Label).html("PM<sub>10</sub>");
                this.generateChart();
            },
            startup: function () {
                globalCurrentWidget = this;

            },
            
            /*This method is used to download the predefined charts in PDF format */
            DownloadToPDFPredefined: function () {
                $(this.imgLoading).css("display", "block");
                var element = $(this.divChartArea);
                var imgData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARUAAAA3CAYAAAAi/d5rAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw / eHBhY2tldCBiZWdpbj0i77u / IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8 + IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFRjdBMzRBRUIyMTExMUU1QjIxQUE5MzA1QTFGNDNCNSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFRjdBMzRBRkIyMTExMUU1QjIxQUE5MzA1QTFGNDNCNSI + IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkVGN0EzNEFDQjIxMTExRTVCMjFBQTkzMDVBMUY0M0I1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkVGN0EzNEFEQjIxMTExRTVCMjFBQTkzMDVBMUY0M0I1Ii8 + IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY + IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8 + ynFSEQAAJllJREFUeNrsXQecFFXSr + 7JYdlEWrJkEBFQxIiKioCKOd3pmTHeJ4fZM2fvPPX09A7DmVERMOeEEgQkI0FcYYGFBTbO7OTQ / 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';
                var opt = {
                    margin: [50, 20, 20, 20],
                    enableLinks: true,
                    filename: 'chart.pdf',
                    image: { type: 'jpeg', quality: 1 },
                    html2canvas: { scale: 1 },
                    jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' }
                };

                html2pdf().from(element[0]).set(opt).toPdf().get('pdf').then(function (pdf) {
                    var totalPages = pdf.internal.getNumberOfPages();
                    for (i = 1; i <= totalPages; i++) {
                        pdf.setPage(i);
                        pdf.addImage(imgData, "PNG", 20, 20, 100, 20);
                    }
                }).save();


                //html2pdf(ele[0],opt);
                $(this.imgLoading).css("display", "none");
            },
            generateAnnualTendencyChart: function (chartData) {
                dojo.empty(this.divChartArea);
                $(this.divChartArea).css("display", "block");
                var strPollutant = $("input[name=pollutants]:checked").attr('customValue');

                var jsonObj = JSON.parse(chartData);
                var yearValues = [];
                var SeriesArray = [];
                var regionNames = [];
                for (i = 0; i < jsonObj.length; i++) {
                    if (yearValues.indexOf(jsonObj[i].YearValue) === -1) {
                        yearValues.push(jsonObj[i].YearValue);
                    }
                    if (regionNames.indexOf(jsonObj[i].Region) === -1) {
                        regionNames.push(jsonObj[i].Region);
                    }
                }
                var regionValues = [];
                for (j = 0; j < regionNames.length; j++) {
                    regionValues = [];
                    for (i = 0; i < jsonObj.length; i++) {
                        if (jsonObj[i].Region === regionNames[j]) {

                            regionValues.push(jsonObj[i].Average);
                        }
                    }
                    SeriesArray.push({ name: regionNames[j], data: regionValues, selected: true });
                }

                Highcharts.setOptions({
                    colors: ['#058DC7', '#50B432', '#f7901e', '#9f0044', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4', '#ED561B', '#DDDF00', '#FFF263', '#6AF9C4']
                });
                Highcharts.chart(this.divChartArea, {
                    chart: {
                        height: 420,
                        foreColor: '#373d3f',
                        type: 'line',
                        events: {
                            load: function () {
                                var chart = this;
                                $.each(chart.legend.allItems, function (i, item) {
                                    var $check = $(item.checkbox),
                                    top = parseFloat($check.css('top')),
                                    label = item.legendItem,
                                    static = 30;

                                    $check.css({
                                        top: (top - 4) + 'px'
                                    });

                                })
                            }
                        }

                    },
                    credits: {
                        enabled: true
                    },
                    title: {
                        text: strPollutant + " ANNUAL TENDENCY DIAGRAM ",
                        useHTML: true,
                        align: 'center',
                        style: {
                            fontSize: '14px',
                            fontFamily: 'roboto'
                        }
                    },
                    tooltip: {
                        headerFormat: '<table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y:1f} </b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true,
                        style:
                        {
                            fontSize: '10px',
                            fontFamily: 'roboto'
                        }
                    },
                    yAxis: [{
                        min: 0,
                        id: 'mm',
                        lineWidth: 1,
                        tickWidth: 1,
                        text: "",
                        labels: {
                            style: {
                                color: '#008FFB',
                                fontSize: '9px',
                                fontFamily: 'roboto'
                            }
                        }
                        , title: {
                            text: ($("input[name=pollutants]:checked").attr('customValue') == "CO") ? "VALUES(mg/m<sup>3</sup>)" : "VALUES (µg/m<sup>3</sup>)",
                            useHTML: true
                        }
                    }
                    ],

                    xAxis: {
                        title: { text: "YEARS" },
                        categories: yearValues,
                        type: 'datetime',
                        tickWidth: 1,
                        tickmarkPlacement: 'on',
                        labels: {

                            style: {
                                color: '#008FFB',
                                fontSize: '9px',
                                fontFamily: 'roboto'
                            }
                        }
                    },

                    legend: {
                        "borderWidth": 1,
                        "itemStyle": {
                            "fontWeight": "normal",
                            "fontSize": "10px",
                            "fontFamily": "roboto"
                        },
                        "borderColor": "#e4e4e4",
                        // "reversed": true,
                        "backgroundColor": "#f1f1f1",
                        align: 'center',
                        verticalAlign: 'top'


                    },
                    plotOptions: {
                        series: {
                            showCheckbox: true
                        },
                        line: {
                            events: {
                                checkboxClick: function (event) {

                                    if (event.checked) {
                                        event.item.show();
                                    }
                                    else {
                                        event.item.hide();
                                    }
                                },
                                legendItemClick: function (event) {
                                    this.chart.series[this.index].checkbox.checked = this.selected = !this.visible;
                                }

                            }
                        }

                    },
                    series: SeriesArray,
                    exporting: {
                        enabled: false
                    }
                   

                });
                $(".chart_Loader").css("display", "none");
            },


            generateChart: function () {
                $(".chart_Loader").css("display", "block");
                var currentWidget = this;
                var strPollutant = $("input[name=pollutants]:checked").attr('value');
                try {
                    $.ajax({
                        type: "POST",
                        //url: this.appConfig.WebApiUrl + "api/Chart/getAnnualTendencyData",
                        //url:  "https://localhost/eadService/api/Chart/getAnnualTendencyData",
                        url: "https://localhost:44300/api/Chart/getAnnualTendencyData",
                        
                        
                        "dataType": "JSON",
                        data: { '': strPollutant },
                        cache: false,
                        async: false,
                        success: function (data) {
                            //console.log(data);
                            currentWidget.generateAnnualTendencyChart(data);
                        },
                        error: function (err) {
                            //console.log(err);
                            notifyError("Unable to generate annual tendency diagram for " + strPollutant);
                        }
                    });
                }
                catch (e) {
                    //console.log(e);
                    notifyError("Unable to generate annual tendency diagram for " + strPollutant);
                }

            }

        });
    });