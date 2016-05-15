Template.chart.rendered = function() {
  var token = Router.current().params.token;
  var validToken = false;
  Meteor.call('checkToken',token, function(err, response) {
    validToken = response;
    console.log(response);
    if (validToken) {

      // render_candlestick_graph(curr_company);
    } else {
      alert("invalid token");
    }
  });
  // Meteor.subscribe('stockPrices_db',token);
  // Meteor.subscribe('stockEvents_db',token);

  var curr_company = "AAC.AX";
  var curr_topic;

  render_candlestick_graph(curr_company);
  render_company_chart();
  // render_events_chart('AAC.AX', 'Cash Rate', -5, 5);


  function render_stock_vs_topic_graph (company_name, topic_name) {
    Tracker.autorun(function() {
      var chartData = [];
      var stockPrices = StockPrices.find({company_name: company_name, token: token, 'open': {$ne : null}}, {fields: {'date':1, 'open':1, 'last':1, 'high':1, 'low':1, 'volume':1, 'flat_value':1}}).fetch();
      // stockPrices.forEach(function (c) {
        // console.log("open: " + c.open " close: " + c.close + " high: " + c.high + " low: " + c.low);
        // console.log(c.open + ' ' + c.last);
      //   chartData.push({
      //     "date": c.date,
      //     "open": c.open,
      //     "close": c.last,
      //     "high": c.high,
      //     "low": c.low,
      //     "volume": c.volume,
      //     "value": c.flat_value
      //   });
      //   // console.log(chartData.length);
      // });
      drawGraph(stockPrices);
    });

    function drawGraph (chartData) {
      
      var chart = AmCharts.makeChart("chartdiv", {
          "type": "serial",
          "theme": "light",
          "legend": {
              "useGraphSettings": true
          },
          "dataProvider": [{
              "year": 1930,
              "italy": 1,
              "germany": 5,
              "uk": 3
          }, {
              "year": 1934,
              "italy": 1,
              "germany": 2,
              "uk": 6
          }, {
              "year": 1938,
              "italy": 2,
              "germany": 3,
              "uk": 1
          }, {
              "year": 1950,
              "italy": 3,
              "germany": 4,
              "uk": 1
          }, {
              "year": 1954,
              "italy": 5,
              "germany": 1,
              "uk": 2
          }, {
              "year": 1958,
              "italy": 3,
              "germany": 2,
              "uk": 1
          }, {
              "year": 1962,
              "italy": 1,
              "germany": 2,
              "uk": 3
          }, {
              "year": 1966,
              "italy": 2,
              "germany": 1,
              "uk": 5
          }, {
              "year": 1970,
              "italy": 3,
              "germany": 5,
              "uk": 2
          }, {
              "year": 1974,
              "italy": 4,
              "germany": 3,
              "uk": 6
          }, {
              "year": 1978,
              "italy": 1,
              "germany": 2,
              "uk": 4
          }],
          "valueAxes": [{
              "integersOnly": true,
              "maximum": 6,
              "minimum": 1,
              "reversed": true,
              "axisAlpha": 0,
              "dashLength": 5,
              "gridCount": 10,
              "position": "left",
              "title": "Place taken"
          }],
          "startDuration": 0.5,
          "graphs": [{
              "balloonText": "place taken by Italy in [[category]]: [[value]]",
              "bullet": "round",
              "hidden": true,
              "title": "Italy",
              "valueField": "italy",
          "fillAlphas": 0
          }, {
              "balloonText": "place taken by Germany in [[category]]: [[value]]",
              "bullet": "round",
              "title": "Germany",
              "valueField": "germany",
          "fillAlphas": 0
          }, {
              "balloonText": "place taken by UK in [[category]]: [[value]]",
              "bullet": "round",
              "title": "United Kingdom",
              "valueField": "uk",
          "fillAlphas": 0
          }],
          "chartCursor": {
              "cursorAlpha": 0,
              "zoomable": false
          },
          "categoryField": "year",
          "categoryAxis": {
              "gridPosition": "start",
              "axisAlpha": 0,
              "fillAlpha": 0.05,
              "fillColor": "#000000",
              "gridAlpha": 0,
              "position": "top"
          },
          "export": {
            "enabled": true,
              "position": "bottom-right"
           }
      });
    }
  }


  function render_candlestick_graph (company_name) {
    var chartData = [];
    Tracker.autorun(function() {
      var stockPrices = StockPrices.find({company_name: company_name, token: token, 'open': {$ne : null}}, {fields: {'date':1, 'open':1, 'last':1, 'high':1, 'low':1, 'volume':1, 'flat_value':1}}).fetch();
      // stockPrices.forEach(function (c) {
        // console.log("open: " + c.open " close: " + c.close + " high: " + c.high + " low: " + c.low);
        // console.log(c.open + ' ' + c.last);
      //   chartData.push({
      //     "date": c.date,
      //     "open": c.open,
      //     "close": c.last,
      //     "high": c.high,
      //     "low": c.low,
      //     "volume": c.volume,
      //     "value": c.flat_value
      //   });
      //   // console.log(chartData.length);
      // });
      drawGraph(stockPrices);
    });

    function drawGraph(chartData) {


      var chart = AmCharts.makeChart( "chartdiv", {
        "type": "stock",
        "theme": "light",
        "pathToImages": "/amcharts/images/",
        "dataSets": [{
          "fieldMappings": [ {
            "fromField": "open",
            "toField": "open"
          }, {
            "fromField": "last",
            "toField": "close"
          }, {
            "fromField": "high",
            "toField": "high"
          }, {
            "fromField": "low",
            "toField": "low"
          }, {
            "fromField": "volume",
            "toField": "volume"
          }, {
            "fromField": "flat_value",
            "toField": "value"
          } ],
          "color": "#7f8da9",
          "dataProvider": chartData,
          "title": "Candlestick",
          "categoryField": "date"
        }, {
          "fieldMappings": [ {
            "fromField": "flat_value",
            "toField": "value"
          } ],
          "color": "#fac314",
          "dataProvider": chartData,
          "compared": true,
          "title": "Line",
          "categoryField": "date"
        } ],


        "panels": [ {
          "title": "Value",
          "showCategoryAxis": false,
          "percentHeight": 70,
          "valueAxes": [ {
            "id": "v1",
            "dashLength": 5
          } ],

          "categoryAxis": {
            "dashLength": 5
          },

          "stockGraphs": [ {
            "type": "candlestick",
            "id": "g1",
            "openField": "open",
            "closeField": "close",
            "highField": "high",
            "lowField": "low",
            "valueField": "close",
            "lineColor": "#7f8da9",
            "fillColors": "#7f8da9",
            "negativeLineColor": "#db4c3c",
            "negativeFillColors": "#db4c3c",
            "fillAlphas": 1,
            "useDataSetColors": false,
            "comparable": true,
            "compareField": "value",
            "showBalloon": false,
            "proCandlesticks": true
          } ],

          "stockLegend": {
            "valueTextRegular": undefined,
            "periodValueTextComparing": "[[value.close]]%"
          }
        },

        {
          "title": "Volume",
          "percentHeight": 30,
          "marginTop": 1,
          "showCategoryAxis": true,
          "valueAxes": [ {
            "dashLength": 5
          } ],

          "categoryAxis": {
            "dashLength": 5
          },

          "stockGraphs": [ {
            "valueField": "volume",
            "type": "column",
            "showBalloon": false,
            "fillAlphas": 1
          } ],

          "stockLegend": {
            "markerType": "none",
            "markerSize": 0,
            "labelText": "",
            "periodValueTextRegular": "[[value.close]]"
          }
        }
        ],

        "chartScrollbar": {
          // "dragIcon": 
        },

        "chartScrollbarSettings": {
          "graph": "g1",
          "graphType": "line",
          "usePeriod": "WW"

        },

        "chartCursorSettings": {
          "valueLineBalloonEnabled": true,
          "valueLineEnabled": true
        },

        "periodSelector": {
          "position": "bottom",
          "periods": [ {
            "period": "DD",
            "count": 10,
            "label": "10 days"
          }, {
            "period": "MM",
            selected: true,
            "count": 1,
            "label": "1 month"
          }, {
            "period": "YYYY",
            "count": 1,
            "label": "1 year"
          }, {
            "period": "YTD",
            "label": "YTD"
          }, {
            "period": "MAX",
            "label": "MAX"
          } ]
        },
        "export": {
          "enabled": true
        }
      });
    }
  }

  function render_company_chart() {
      // var company_name = "AAC.AX";
      // var topic = "Cash Rate";

    //   var token = params['token'];

    //   var requestOK = apiCalcCrAvg.utility.validateRequest(token);
    //   if (requestOK) {

    var c_cr = [];
    var all_company = _.uniq(StockPrices.find({}, {fields:{company_name:1, _id:0}},{sort:{company_name: 1}}).fetch().map(function(x){return x.company_name}),true);
    all_company.forEach(function(c){
      var ret = StockPrices.findOne(
        {
          company_name: c,
          token: token,
        },{
          fields: {
            company_name: 1,
            date: 1,
            cum_return: 1,
          },
          sort:{
            date:-1,
          }
        }
      );
      c_cr.push({
        company_name: c,
        last_cr: ret.cum_return,
      });
    });

    drawGraph(c_cr);

    function handleClick(event) {
      render_company_topics_chart(event.item.category);
    }

    function drawGraph(chartData) {
      // console.log('called');

      /**
       * AmCharts plugin: automatically color each individual column
       * -----------------------------------------------------------
       * Will apply to graphs that have autoColor: true set
       */
      AmCharts.addInitHandler(function (chart) {
        // check if there are graphs with autoColor: true set
        for (var i = 0; i < chart.graphs.length; i++) {
          var graph = chart.graphs[i];
          if (graph.autoColor !== true)
            continue;
          var colorKey = "autoColor-" + i;
          graph.lineColorField = colorKey;
          graph.fillColorsField = colorKey;
          for (var x = 0; x < chart.dataProvider.length; x++) {
            var color = ['#ff0000', '#ff8000', '#ffff00', '#40ff00', '#33cccc', '#339933', '#ff33cc', '#00bfff', '#ffcc66', '#00cc00', '#0066ff', '#ffcc00', '#ff6666'][x];
            
            chart.dataProvider[x][colorKey] = color;
          }
        }

      }, ["serial"]);

      var chart = new AmCharts.AmSerialChart();
      chart.dataProvider = chartData;
      chart.categoryField = "company_name";
      //      chart.startDuration = 1;
      chart.startEffect = "elastic ";
      chart.theme = 'light';

      chart.titles = [{
        "text": "Cumulative returns for each stock",
        "bold": true,
        }];

      // add click listener
      chart.addListener("clickGraphItem", handleClick);


      // AXES
      // category
      var categoryAxis = chart.categoryAxis;
      categoryAxis.labelRotation = 90;
      categoryAxis.gridPosition = "start";
      categoryAxis.title = "Companies";
      categoryAxis.titleColor = 'grey';

      // value
      // in case you don't want to change default settings of value axis,
      // you don't need to create it, as one value axis is created automatically.
      var valueAxis = new AmCharts.ValueAxis();
      valueAxis.title = "Cumulative Return (%)";
      valueAxis.titleColor = 'grey';
      chart.addValueAxis(valueAxis);
      
      
      // GRAPH
      var graph = new AmCharts.AmGraph();
      graph.valueField = "last_cr";
      graph.balloonText = "[[category]]: [[value]]";
      graph.type = "column";
      graph.lineAlpha = 0;
      graph.fillAlphas = 0.8;
      chart.rotate = true;
      chart.columnWidth = 1;
      graph.autoColor = true;

      chart.addGraph(graph);

      chart.write("chartdiv2");
    }
  }

  function render_events_chart(company_name, topic, upper_range, lower_range) {
    var chart ;
    var chartData = [];

    Tracker.autorun(function() {
      var stocks = StockPrices.find({company_name: company_name, token:token}, {fields: {'date':1, 'cum_return':1}}).fetch();
      chartData = [];
      var guides = [];

      // events
      var events = StockEvents.find({company_name: company_name, topic: topic}, {fields: {'date':1}}).fetch(); 
      console.log(events);

      events.forEach(function(c) {
        var dateLower = new Date(c.date);
        dateLower.setDate(dateLower.getDate() + lower_range);
        var dateUpper = new Date(c.date);
        dateUpper.setDate(dateUpper.getDate() + upper_range);

        console.log(c.date);
        console.log(dateLower);
        console.log(dateUpper);

        guides.push({
          "fillAlpha": 0.30,
          "fillColor": "#ff9900",
          "lineColor": "#000000",
          "lineAlpha": 1,
          "label": topic,
          "balloonText": "Click for more details",
          "labelRotation": 90,
          "above": true,
          "date": dateLower,
          "toDate": dateUpper,
          "above": true
        });
      });

      // every day
      stocks.forEach(function(c) {

        var entry = {
          date: c.date,
          cr: parseFloat(c.cum_return),
        };
        chartData.push(entry);
      });
      drawGraph(chartData, guides);
    });

    function drawGraph(chartData, guides) {
      console.log(guides);
      chart = AmCharts.makeChart("chartdiv", {
        "type": "serial",
        "theme": "light",
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
        },
        "guides": guides,
        titles: [
          {
            text: "Companys Stock Price",
            bold: false,
          },
          {
            text: "events labeled in grey",
            bold: false,
          }
        ]
      });
    }
  }
};
