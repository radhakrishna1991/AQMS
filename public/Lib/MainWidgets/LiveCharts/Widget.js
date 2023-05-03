define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/lang',
    "./PredefinedCharts",
    "./InteractiveCharts",
    "./DetailedAnalysis",
    "dojo/text!MainWidgets/LiveCharts/Widget.html",

    "dojo/i18n!MainWidgets/LiveCharts/nls/strings",
    'xstyle/css!../LiveCharts/css/style1.css',
    //"emap/Login/Login",
    //"dojo/text!emap/Login/templates/Login.html",

], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, lang, PredefinedCharts, InteractiveCharts, DetailedAnalysis, dijitTemplate, i18n) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: dijitTemplate,

        widgetsInTemplate: true,
        nls: i18n,
       
        title: i18n.title,
        predefinedCharts: null,
        interactiveCharts: null,
        detailedAnalysis: null,
        domNode: null,
       
        constructor: function (options, srcRefNode) {
            // mix in settings and defaults           
            options = options || {};
            lang.mixin(this, options); //update the properties
            // widget node
            this.domNode = srcRefNode;
            // store localized strings
            this.nls = i18n;

        },


        postCreate: function () {
            this.inherited(arguments);
            var currentWidget = this;

            $(this.divCharCtrl).css("display", "block");
            var node = dojo.byId(this.divCharCtrl);
            $("#divpopup1").append(node);
            $("#divpopup1").addClass('active');
            // for closing overlay panel -analitycs 
            $(this.btncollapse).click(function () {
                $("#divpopup1").removeClass('active');
            });

            this.interactiveCharts = new InteractiveCharts({
                this: this,
                nls: this.nls,
            }, this.divInteractiveCharts);
            this.interactiveCharts.startup();

            this.detailedAnalysis = new DetailedAnalysis({
                this: this,
                nls: this.nls
            }, this.divDetailedAnalysis);
            this.detailedAnalysis.startup();

            this.predefinedCharts = new PredefinedCharts({
                this: this,
                nls: this.nls
            }, this.divPredefinedCharts);
            this.predefinedCharts.startup();


            $('.interactive_btn').click(function () {
                $(".pollutent_tab_main .nav-item .nav-link").removeClass('active');
                $(".pollutent_tab_main .tab-content .tab-pane").removeClass('active show');
                $("#criteria-tab").addClass('active');
                $("#criteria-tab-pane").addClass('active show');
                $('.tab_charts li').removeClass('current_item');
                $(this).addClass('current_item');
                $('.tab-content').removeClass('current_item');
                $('.interactive_charts').addClass('current_item');
            });
            $('.analysis_btn').click(function () {
                $('.tab_charts li').removeClass('current_item');
                $(this).addClass('current_item');
                $('.tab-content').removeClass('current_item');
                $('.analysis_charts').addClass('current_item');
            });
            $(".interactive_btn").css("display", "block");
            $(".analysis_btn").css("display", "block");



            $(".Livecharts_Loader").css("display", "none");



            $('.tabs_btn').click(function () {
                $(".Livecharts_Loader").css("display", "none");
                $('.analytics_container').css({ 'display': 'none' });
            });

            $('.pre_defined_btn').click(function () {
                $('.tab_charts li').removeClass('current_item');
                $(this).addClass('current_item');
                $('.tab-content').removeClass('current_item');
                $('.pre_defined_chart').addClass('current_item');
            });



            //$(".scrolling").mCustomScrollbar({
            //    theme: "minimal-dark"
            //});



            $('.cb-value').click(function () {
                var mainParent = $(this).parent('.toggle-btn');
                if ($(mainParent).find('input.cb-value').is(':checked')) {
                    $(mainParent).addClass('active');
                } else {
                    $(mainParent).removeClass('active');
                }
            });

        },
        startup: function () {
            var currentWidget = this;

        },
       
    });
});



