//   // var default_token = "2s4XeTBzRLdbMFDdMrdJ";

//   // var default_company = "AAC.AX";

// Template.vs_company_chart.rendered = function() {

//   var query_token = Router.current().params.token;

//   Tracker.autorun(function() {
//     // var companys = Meteor.call('get_companies_db', query_token);

//     // console.log(companys);
//     var companys = Companys.find({file_token: query_token},{fields: {'company_name':1, avg_cr:1}, sort:{avg_cr:1},reactive:true}).fetch();
//     if (companys == null) {
//       console.log("asdf");
//       Router.go('notFound');
//       return;
//     } else if (companys.length == 0) {
//       console.log("aoeu");
//     }
//     console.log("continued");
//     var chartData = [];

//     companys.forEach(function(c) {
//       var entry = {
//         company_name: c.company_name,
//         avg_cr: c.avg_cr,
//       };
//       chartData.push(entry);
//     });

//     drawGraph(chartData);
//   });


//   function handleClick(event)
//   {
//     // alert(event.item.category + ": " + event.item.values.value);
//     window.location.href = "/company_topics_chart/"+event.item.category;
//   }

//   function drawGraph (chartData) {
//     var chart = new AmCharts.AmSerialChart();


//     chart.dataProvider = chartData;
//     chart.categoryField = "company_name";
//     chart.startDuration = 1;


//     // add click listener
//     chart.addListener("clickGraphItem", handleClick);


//     // AXES
//     // category
//     var categoryAxis = chart.categoryAxis;
//     categoryAxis.labelRotation = 90;
//     categoryAxis.gridPosition = "start";

//     // value
//     // in case you don't want to change default settings of value axis,
//     // you don't need to create it, as one value axis is created automatically.
//     // GRAPH
//     var graph = new AmCharts.AmGraph();
//     graph.valueField = "avg_cr";
//     graph.balloonText = "[[category]]: [[value]]";
//     graph.type = "column";
//     graph.lineAlpha = 0;
//     graph.fillAlphas = 0.8;
//     chart.addGraph(graph);

//     chart.write("chartdiv");
//   }
// };

// Template.company_topics_chart.rendered = function() {

//   console.log(Router.current().params.company_name);
//   console.log(Router.current().params.token);

//   var query_company = Router.current().params.company_name;
//   var query_token = Router.current().params.token;

//   Tracker.autorun(function() {
//     var topics = Topics.find({file_token: query_token,company_name: query_company},{fields: {'topic':1, avg_cr_topic:1}, sort:{avg_cr_topic:1}}).fetch();
//     var chartData = [];

//     topics.forEach(function(c) {
//       var entry = {
//         topic: c.topic,
//         avg_cr: c.avg_cr_topic,
//       };
//       chartData.push(entry);
//     });
//     drawGraph(chartData);
//   });


//   function handleClick(event)
//   {
//     // alert(event.item.category + ": " + event.item.values.value);
//     window.location.href = "/company_events_highlight/"+query_token+"/"+event.item.category;
//   }

//   function drawGraph (chartData) {
//     var chart = new AmCharts.AmSerialChart();
//     chart.dataProvider = chartData;
//     chart.categoryField = "topic";
//     chart.startDuration = 1;


//     // add click listener
//     chart.addListener("clickGraphItem", handleClick);


//     // AXES
//     // category
//     var categoryAxis = chart.categoryAxis;
//     categoryAxis.labelRotation = 90;
//     categoryAxis.gridPosition = "start";

//     // value
//     // in case you don't want to change default settings of value axis,
//     // you don't need to create it, as one value axis is created automatically.
//     // GRAPH
//     var graph = new AmCharts.AmGraph();
//     graph.valueField = "avg_cr";
//     graph.balloonText = "[[category]]: [[value]]";
//     graph.type = "column";
//     graph.lineAlpha = 0;
//     graph.fillAlphas = 0.8;
//     chart.addGraph(graph);

//     chart.write("chartdiv");
//   }
// };

// Template.company_events_highlight.rendered = function() {

//   console.log(Router.current().params.company_name);
//   console.log(Router.current().params.token);


// var chartData = generateChartData();
// var chart = AmCharts.makeChart("chartdiv", {
//     "type": "serial",
//     "theme": "dark",
//     "marginRight": 80,
//     "autoMarginOffset": 20,
//     "marginTop": 7,
//     "dataProvider": chartData,
//     "valueAxes": [{
//         "axisAlpha": 0.2,
//         "dashLength": 1,
//         "position": "left"
//     }],
//     "mouseWheelZoomEnabled": true,
//     "graphs": [{
//         "id": "g1",
//         "balloonText": "[[value]]",
//         "bullet": "round",
//         "bulletBorderAlpha": 1,
//         "bulletColor": "#FFFFFF",
//         "hideBulletsCount": 50,
//         "title": "red line",
//         "valueField": "visits",
//         "useLineColorForBulletBorder": true,
//         "balloon":{
//             "drop":true
//         }
//     }],
//     "chartScrollbar": {
//         "autoGridCount": true,
//         "graph": "g1",
//         "scrollbarHeight": 40
//     },
//     "chartCursor": {
//        "limitToGraph":"g1"
//     },
//     "categoryField": "date",
//     "categoryAxis": {
//         "parseDates": true,
//         "axisColor": "#DADADA",
//         "dashLength": 1,
//         "minorGridEnabled": true
//     },
//     "export": {
//         "enabled": true
//     }
// });

// chart.addListener("rendered", zoomChart);
// zoomChart();

// // this method is called when chart is first inited as we listen for "rendered" event
// function zoomChart() {
//     // different zoom methods can be used - zoomToIndexes, zoomToDates, zoomToCategoryValues
//     chart.zoomToIndexes(chartData.length - 40, chartData.length - 1);
// }


// // generate some random data, quite different range
// function generateChartData() {
//     var chartData = [];
//     var firstDate = new Date();
//     firstDate.setDate(firstDate.getDate() - 5);

//     for (var i = 0; i < 1000; i++) {
//         // we create date objects here. In your data, you can have date strings
//         // and then set format of your dates using chart.dataDateFormat property,
//         // however when possible, use date objects, as this will speed up chart rendering.
//         var newDate = new Date(firstDate);
//         newDate.setDate(newDate.getDate() + i);

//         var visits = Math.round(Math.random() * (40 + i / 5)) + 20 + i;

//         chartData.push({
//             date: newDate,
//             visits: visits
//         });
//     }
//     return chartData;
// }

// };





  Template.chart.rendered = function() {
    render_company_chart();

    // render_company_events_chart('AAC.AX','Cash Rate');


    function render_company_chart (){


      Tracker.autorun(function() {
        // var companys = Meteor.call('get_companies_db', query_token);
      
        // console.log(companys);
        var companys = Companys.find({},{fields: {'company_name':1, avg_cr:1}, sort:{avg_cr:1},reactive:true}).fetch();
        if (companys.length == 0) {
          // Router.go('noFound');
          // $('#chartdiv').addClass("jawn");
        } else {
          // $('#chartdiv').removeClass("jawn");

        }

        console.log("continued");
        var chartData = [];

        // console.log(companys);

        companys.forEach(function(c) {
          var entry = {
            company_name: c.company_name,
            avg_cr: c.avg_cr,
          };
          chartData.push(entry);
        });

        drawGraph(chartData);
      });


      function handleClick(event) {
        // alert(event.item.category + ": " + event.item.values.value);
        // window.location.href = "/company_topics_chart/"+event.item.category;
        render_company_topics_chart(event.item.category);
      }

      function drawGraph (chartData) {
        // console.log('called');

        var chart = new AmCharts.AmSerialChart();


        chart.dataProvider = chartData;
        chart.categoryField = "company_name";
        chart.startDuration = 1;
        
        
        // add click listener
        chart.addListener("clickGraphItem", handleClick);
        

        // AXES
        // category
        var categoryAxis = chart.categoryAxis;
        categoryAxis.labelRotation = 90;
        categoryAxis.gridPosition = "start";

        // value
        // in case you don't want to change default settings of value axis,
        // you don't need to create it, as one value axis is created automatically.
        // GRAPH
        var graph = new AmCharts.AmGraph();
        graph.valueField = "avg_cr";
        graph.balloonText = "[[category]]: [[value]]";
        graph.type = "column";
        graph.lineAlpha = 0;
        graph.fillAlphas = 0.8;
        chart.addGraph(graph);

        chart.write("chartdiv");
      }
    }

    function render_company_topics_chart (company_name) {

      Tracker.autorun(function() {
        var topics = Topics.find({company_name: company_name},{fields: {'topic':1, avg_cr_topic:1}, sort:{avg_cr_topic:1}}).fetch();
        var chartData = [];

        topics.forEach(function(c) {
          var entry = {
            topic: c.topic,
            avg_cr: c.avg_cr_topic,
          };
          chartData.push(entry);
        });

        // console.log(chartData);


        drawGraph(chartData);
      });


      function handleClick(event)
      {
        // alert(event.item.category + ": " + event.item.values.value);
        // window.location.href = "/company_events_highlight/"+query_token+"/"+event.item.category;
        render_company_events_chart(company_name,event.item.category);

      }

      function drawGraph (chartData) {
        var chart = new AmCharts.AmSerialChart();
        chart.dataProvider = chartData;
        chart.categoryField = "topic";
        chart.startDuration = 1;
        
        
        // add click listener
        chart.addListener("clickGraphItem", handleClick);
        

        // AXES
        // category
        var categoryAxis = chart.categoryAxis;
        categoryAxis.labelRotation = 90;
        categoryAxis.gridPosition = "start";

        // value
        // in case you don't want to change default settings of value axis,
        // you don't need to create it, as one value axis is created automatically.
        // GRAPH
        var graph = new AmCharts.AmGraph();
        graph.valueField = "avg_cr";
        graph.balloonText = "[[category]]: [[value]]";
        graph.type = "column";
        graph.lineAlpha = 0;
        graph.fillAlphas = 0.8;
        chart.addGraph(graph);

        chart.write("chartdiv");
      }
    }

  function render_company_events_chart(company_name,topic) {

    console.log(company_name);
    console.log(topic);


    var chart ;
    var chartData = [];

    Tracker.autorun(function() {
      var stocks = Stocks.find({company_name: company_name},{fields: {'date':1, cr:1}}).fetch();

      chartData = [];
      stocks.forEach(function(c) {
        var entry = {
          date: c.date,
          cr: c.cr,
        };
        chartData.push(entry);
      });

      // console.log(chartData);
      chart = AmCharts.makeChart("chartdiv", {
          "type": "serial",
          "theme": "none",
          "marginRight": 80,
          "autoMarginOffset": 20,
          "marginTop": 7,
          "dataProvider": chartData,
          "valueAxes": [{
              "axisAlpha": 0.2,
              "dashLength": 1,
              "position": "left"
          }],
          "mouseWheelZoomEnabled": true,
          "graphs": [{
              "id": "g1",
              "balloonText": "[[value]]",
              "bullet": "round",
              "bulletBorderAlpha": 1,
              "bulletColor": "#FFFFFF",
              "hideBulletsCount": 50,
              "title": "red line",
              "valueField": "cr",
              "useLineColorForBulletBorder": true,
              "balloon":{
                  "drop":true
              }
          }],
          "chartScrollbar": {
              "autoGridCount": true,
              "graph": "g1",
              "scrollbarHeight": 40
          },
          "chartCursor": {
             "limitToGraph":"g1"
          },
          "categoryField": "date",
          "categoryAxis": {
              "parseDates": true,
              "axisColor": "#DADADA",
              "dashLength": 1,
              "minorGridEnabled": true
          },
          "export": {
              "enabled": true
          }
      });
    });

    // var chartData = generateChartData();

chart.addListener("rendered", zoomChart);
zoomChart();

// this method is called when chart is first inited as we listen for "rendered" event
function zoomChart() {
    // different zoom methods can be used - zoomToIndexes, zoomToDates, zoomToCategoryValues
    chart.zoomToIndexes(chartData.length - 40, chartData.length - 1);
}


// generate some random data, quite different range
function generateChartData() {
    var chartData = [];
    var firstDate = new Date();
    firstDate.setDate(firstDate.getDate() - 5);

    for (var i = 0; i < 1000; i++) {
        // we create date objects here. In your data, you can have date strings
        // and then set format of your dates using chart.dataDateFormat property,
        // however when possible, use date objects, as this will speed up chart rendering.
        var newDate = new Date(firstDate);
        newDate.setDate(newDate.getDate() + i);

        var visits = Math.round(Math.random() * (40 + i / 5)) + 20 + i;

        chartData.push({
            date: newDate,
            visits: visits
        });
    }
    return chartData;
}



  }
};




