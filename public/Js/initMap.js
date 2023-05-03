require([
    "MainWidgets/LiveCharts/Widget",
    "dijit/layout/BorderContainer",
    /*"dijit/layout/TabContainer",*/
    "dijit/layout/ContentPane",
    "dijit/layout/AccordionContainer",
     "dojo/domReady!"],
    function (
        LiveChart) {


        $(document).ready(function () {

            var LiveChartwidget = new LiveChart({
            }, "divCharCtrl");
            LiveChartwidget.startup();

        });

        //$("#divChartsLogo").click(function () {
        //    var LiveChartwidget = new LiveChart({
        //    }, "divCharCtrl");
        //    LiveChartwidget.startup();
        //});
       
     



    });



