Template.chart.rendered = function() {
  var token = Router.current().params.token;
  Meteor.subscribe('stockPrices_db',token);
  Meteor.subscribe('stockEvents_db',token);

  var curr_company = "AAC.AX";
  var curr_topic;

























// render_company_chart();
// render_company_topics_chart("AAC.AX");



//   function render_company_chart (){

//     $('#chart_breadcrumb').empty();
//     var li;
//     var a;
//     li = document.createElement("li");
//     a = document.createElement("a");
//     a.appendChild(document.createTextNode("Company"));
//     li.setAttribute("id","breadcrumb_companys");
//     li.appendChild(a);
//     $('#chart_breadcrumb').append(li);



//     Tracker.autorun(function() {
//       // var companys = Meteor.call('get_companies_db', query_token);
  
//       // console.log(companys);
//       var companys = Companys.find({},{fields: {'company_name':1, avg_cr:1}, sort:{avg_cr:1},reactive:true}).fetch();
//       if (companys.length == 0) {
//         // Router.go('noFound');
//         // $('#chartdiv').addClass("jawn");
//       } else {
//         // $('#chartdiv').removeClass("jawn");

//       }

//       console.log("continued");
//       var chartData = [];

//       // console.log(companys);

//       companys.forEach(function(c) {
//         var entry = {
//           company_name: c.company_name,
//           avg_cr: c.avg_cr,
//         };
//         chartData.push(entry);
//       });

//       $('#chartdiv').css({'background-color':'white'});
//       drawGraph(chartData);
//     });


//     function handleClick(event) {
//       // alert(event.item.category + ": " + event.item.values.value);
//       // window.location.href = "/company_topics_chart/"+event.item.category;


//       $('#chart_breadcrumb').empty();

//       var li;
//       var a;

//       li = document.createElement("li");
//       a = document.createElement("a");
//       a.appendChild(document.createTextNode("Companys"));
//       li.setAttribute("id","breadcrumb_companys");
//       li.appendChild(a);
//       // li.addClass("active");
//       $('#chart_breadcrumb').append(li);

//       li = document.createElement("li");
//       li.setAttribute("id","breadcrumb_types");
//       li.appendChild(document.createTextNode("Types of Events"));
//       // li.className += " active";
//       $('#chart_breadcrumb').append(li);

//       curr_company = event.item.category;
//       render_company_topics_chart(event.item.category);
//     }

//     function drawGraph (chartData) {
//       // console.log('called');

//       /**
//        * AmCharts plugin: automatically color each individual column
//        * -----------------------------------------------------------
//        * Will apply to graphs that have autoColor: true set
//        */
//       AmCharts.addInitHandler(function(chart) {
//         // check if there are graphs with autoColor: true set
//         for(var i = 0; i < chart.graphs.length; i++) {
//           var graph = chart.graphs[i];
//           if (graph.autoColor !== true)
//             continue;
//           var colorKey = "autoColor-"+i;
//           graph.lineColorField = colorKey;
//           graph.fillColorsField = colorKey;
//           for(var x = 0; x < chart.dataProvider.length; x++) {
//             var color = chart.colors[x]
//             chart.dataProvider[x][colorKey] = color;
//           }
//         }
      
//       }, ["serial"]);

//       var chart = new AmCharts.AmSerialChart();



//       chart.dataProvider = chartData;
//       chart.categoryField = "company_name";
//       chart.startDuration = 1;

//       chart.titles = [{
//         "text": "Average cumulative returns for each company",
//         "bold": true,
//       }];
    
//       // add click listener
//       chart.addListener("clickGraphItem", handleClick);
    

//       // AXES
//       // category
//       var categoryAxis = chart.categoryAxis;
//       categoryAxis.labelRotation = 90;
//       categoryAxis.gridPosition = "start";

//       // value
//       // in case you don't want to change default settings of value axis,
//       // you don't need to create it, as one value axis is created automatically.
//       // GRAPH
//       var graph = new AmCharts.AmGraph();
//       graph.valueField = "avg_cr";
//       graph.balloonText = "[[category]]: [[value]]";
//       graph.type = "column";
//       graph.lineAlpha = 0;
//       graph.fillAlphas = 0.8;
//       chart.rotate = true;
//       chart.columnWidth = 1;
//       graph.autoColor = true;
    




//       chart.addGraph(graph);

    
    



//       chart.write("chartdiv2");
//     }
//   }

//   function render_company_topics_chart (company_name) {

//     Tracker.autorun(function() {
//       var topics = Topics.find({company_name: company_name},{fields: {'topic':1, avg_cr_topic:1}, sort:{avg_cr_topic:1}}).fetch();
//       var chartData = [];

//       topics.forEach(function(c) {
//         var entry = {
//           topic: c.topic,
//           avg_cr: c.avg_cr_topic,
//         };
//         chartData.push(entry);
//       });

//       console.log(chartData);

//       $('#chartdiv').css({'background-color':'white'});
//       drawGraph(chartData);
//     });


//     function handleClick(event)
//     {
//       // alert(event.item.category + ": " + event.item.values.value);
//       // window.location.href = "/company_events_highlight/"+query_token+"/"+event.item.category;

//       $('#chart_breadcrumb').empty();

//       var li;
//       var a;

//       li = document.createElement("li");
//       a = document.createElement("a");
//       a.appendChild(document.createTextNode("Company"));
//       li.setAttribute("id","breadcrumb_companys");
//       li.appendChild(a);
//       // li.addClass("active");
//       $('#chart_breadcrumb').append(li);

//       li = document.createElement("li");
//       a = document.createElement("a");
//       a.appendChild(document.createTextNode("Types of Events"));
//       li.appendChild(a);
//       li.setAttribute("id","breadcrumb_types");
//       // li.addClass("active");
//       $('#chart_breadcrumb').append(li);

//       li = document.createElement("li");
//       li.appendChild(document.createTextNode("Overall"));
//       // li.className += " active";
//       $('#chart_breadcrumb').append(li);

//       curr_topic = event.item.category;
//       curr_company = company_name;

//       render_company_events_chart(company_name,event.item.category);

//     }

//     function drawGraph (chartData) {
//       var chart = new AmCharts.AmSerialChart();
//       chart.dataProvider = chartData;
//       chart.categoryField = "topic";
//       chart.startDuration = 1;
    
    
//       // add click listener
//       chart.addListener("clickGraphItem", handleClick);
//       var company_name = "Average cumulative return for each event-type for: " + curr_company;
//       chart.titles = [{
//         "text": company_name,
//         "bold": true,
//       }];
//       // AXES
//       // category
//       var categoryAxis = chart.categoryAxis;
//       categoryAxis.labelRotation = 90;
//       categoryAxis.gridPosition = "start";

//       // value
//       // in case you don't want to change default settings of value axis,
//       // you don't need to create it, as one value axis is created automatically.
//       // GRAPH
//       var graph = new AmCharts.AmGraph();
//       graph.valueField = "avg_cr";
//       graph.balloonText = "[[category]]: [[value]]";
//       graph.type = "column";
//       graph.lineAlpha = 0;
//       graph.fillAlphas = 0.8;
//       chart.addGraph(graph);

//       chart.write("chartdiv");
//     }
//   }

// function render_company_events_chart(company_name,topic) {

//   console.log(company_name);
//   console.log(topic);

//   var chart ;
//   var chartData = [];

//   Tracker.autorun(function() {
//     var stocks = Stocks.find({company_name: company_name},{fields: {'date': 1, 'open_price':1, 'last_price':1, 'high':1, 'low':1, 'cr':1}}).fetch();
//     chartData = [];
//     var guides = [];


//     var lastKnownOpen = null;
//     var lastKnownHigh = null;
//     var lastKnownClose = null;
//     var lastKnownLow = null;
//     stocks.forEach(function(c) {
//       // console.log(c.date);
//       var dateRange = Events.findOne({company_name: company_name, topic: topic, event_date: c.date}, {fields: {'lower_date': 1, 'upper_date': 1, 'topic': 1}});  
//       // console.log(dateRange);
//       if (dateRange != null){
//         // console.log(dateRange);
//         guides.push({
//           "fillAlpha": 0.30,
//           "fillColor": "#ff9900",
//           "lineColor": "#000000",
//           "lineAlpha": 1,
//           "label": dateRange.topic,
//           "balloonText": "Click for more details",
//           "labelRotation": 90,
//           "above": true,
//           "date": dateRange.lower_date,
//           "toDate": dateRange.upper_date,
//           "above": true
//         });
//       }
//       // var entry = {
//       //   date: c.date,
//       //   // cr: parseFloat(c.cr),
//       //   open: c.open,
//       //   close: c.close,
//       //   high: c.high,
//       //   low: c.low,
//       //   value: parseFloat(c.cr),
//       //   volume: parseFloat(c.cr)
//       // };
//       var entry = {};

//       entry.date = c.date;
//       if (!isNaN(c.open_price)) {
//         lastKnownOpen = c.open_price;
//       }

//       if (!isNaN(c.high)) {
//         lastKnownHigh = c.high;
//       }

//       if (!isNaN(c.last_price)) {
//         lastKnownClose = c.last_price;
//       }

//       if (!isNaN(c.low)) {
//         lastKnownLow = c.low;
//       }

//       entry.open = lastKnownOpen;
//       entry.close = lastKnownClose;
//       entry.high = lastKnownHigh;
//       entry.low = lastKnownLow;


//       entry.value = parseFloat(c.cr);
//       entry.volume = parseFloat(c.cr);

//       chartData.push(entry);
//     });

//     drawGraph(chartData);

//     function drawGraph() {

//       var chart = new AmCharts.AmStockChart();
//       // DATASET //////////////////////////////////////////
//       var dataSet = new AmCharts.DataSet();
//       dataSet.fieldMappings = [{
//           fromField: "open",
//           toField: "open"
//       }, {
//           fromField: "close",
//           toField: "close"
//       }, {
//           fromField: "high",
//           toField: "high"
//       }, {
//           fromField: "low",
//           toField: "low"
//       }, {
//           fromField: "volume",
//           toField: "volume"
//       }, {
//           fromField: "value",
//           toField: "value"
//       }];
//       dataSet.color = "#7f8da9";
//       dataSet.dataProvider = chartData;
//       dataSet.title = "Candlestick";
//       dataSet.categoryField = "date";

//       var dataSet2 = new AmCharts.DataSet();
//       dataSet2.fieldMappings = [{
//           fromField: "value",
//           toField: "value"
//       }];
//       dataSet2.color = "#fac314";
//       dataSet2.dataProvider = chartData;
//       dataSet2.compared = true;
//       dataSet2.title = "Line";
//       dataSet2.categoryField = "date";

//       chart.dataSets = [dataSet, dataSet2];

//       // PANELS ///////////////////////////////////////////
//       var stockPanel = new AmCharts.StockPanel();
//       stockPanel.title = "Value";
//       stockPanel.showCategoryAxis = false;
//       stockPanel.percentHeight = 70;

//       var valueAxis = new AmCharts.ValueAxis();
//       valueAxis.dashLength = 5;
//       stockPanel.addValueAxis(valueAxis);

//       stockPanel.categoryAxis.dashLength = 5;

//       // graph of first stock panel
//       var graph = new AmCharts.StockGraph();
//       graph.type = "candlestick";
//       graph.openField = "open";
//       graph.closeField = "close";
//       graph.highField = "high";
//       graph.lowField = "low";
//       graph.valueField = "value";
//       graph.lineColor = "#7f8da9";
//       graph.fillColors = "#7f8da9";
//       graph.negativeLineColor = "#db4c3c";
//       graph.negativeFillColors = "#db4c3c";
//       graph.proCandlesticks = true;
//       graph.fillAlphas = 1;
//       graph.useDataSetColors = false;
//       graph.comparable = true;
//       graph.compareField = "value";
//       graph.showBalloon = false;
//       stockPanel.addStockGraph(graph);

//       var stockLegend = new AmCharts.StockLegend();
//       stockLegend.valueTextRegular = undefined;
//       stockLegend.periodValueTextComparing = "[[percents.value.close]]%";
//       stockPanel.stockLegend = stockLegend;

//       var chartCursor = new AmCharts.ChartCursor();
//       chartCursor.valueLineEnabled = true;
//       chartCursor.valueLineAxis = valueAxis;
//       stockPanel.chartCursor = chartCursor;

//       var stockPanel2 = new AmCharts.StockPanel();
//       stockPanel2.title = "Volume";
//       stockPanel2.percentHeight = 30;
//       stockPanel2.marginTop = 1;
//       stockPanel2.showCategoryAxis = true;

//       var valueAxis2 = new AmCharts.ValueAxis();
//       valueAxis2.dashLength = 5;
//       stockPanel2.addValueAxis(valueAxis2);

//       stockPanel2.categoryAxis.dashLength = 5;

//       var graph2 = new AmCharts.StockGraph();
//       graph2.valueField = "volume";
//       graph2.type = "column";
//       graph2.showBalloon = false;
//       graph2.fillAlphas = 1;
//       stockPanel2.addStockGraph(graph2);

//       var legend2 = new AmCharts.StockLegend();
//       legend2.markerType = "none";
//       legend2.markerSize = 0;
//       legend2.labelText = "";
//       legend2.periodValueTextRegular = "[[value.close]]";
//       stockPanel2.stockLegend = legend2;

//       var chartCursor2 = new AmCharts.ChartCursor();
//       chartCursor2.valueLineEnabled = true;
//       chartCursor2.valueLineAxis = valueAxis2;
//       stockPanel2.chartCursor = chartCursor2;

//       chart.panels = [stockPanel, stockPanel2];


//       // OTHER SETTINGS ////////////////////////////////////
//       var sbsettings = new AmCharts.ChartScrollbarSettings();
//       sbsettings.graph = graph;
//       sbsettings.graphType = "line";
//       sbsettings.usePeriod = "WW";
//       sbsettings.updateOnReleaseOnly = false;
//       chart.chartScrollbarSettings = sbsettings;


//       // PERIOD SELECTOR ///////////////////////////////////
//       var periodSelector = new AmCharts.PeriodSelector();
//       periodSelector.position = "bottom";
//       periodSelector.periods = [{
//           period: "DD",
//           count: 10,
//           label: "10 days"
//       }, {
//           period: "MM",
//           selected: true,
//           count: 1,
//           label: "1 month"
//       }, {
//           period: "YYYY",
//           count: 1,
//           label: "1 year"
//       }, {
//           period: "YTD",
//           label: "YTD"
//       }, {
//           period: "MAX",
//           label: "MAX"
//       }];
//       chart.periodSelector = periodSelector;

//       chart.write('chartdiv');
//     }
//   });

//   // chart.addListener("rendered", zoomChart);
//   // zoomChart();

//   // this method is called when chart is first inited as we listen for "rendered" event
//   function zoomChart() {
//       // different zoom methods can be used - zoomToIndexes, zoomToDates, zoomToCategoryValues
//     chart.zoomToIndexes(chartData.length - 40, chartData.length - 1);
//   }
// }


// // ------- page controller ---------
// $('#chart_breadcrumb').on('click','#breadcrumb_types',function (){
//   console.log('types click');
//   render_company_topics_chart(curr_company);
// });

// $('#chart_breadcrumb').on('click','#breadcrumb_companys',function (){
//   console.log('companys click');
//   render_company_chart();
// });


};




