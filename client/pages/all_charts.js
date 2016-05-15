Template.chart.rendered = function() {
  var token = Router.current().params.token;
  // Meteor.subscribe('stockPrices_db',token);
  // Meteor.subscribe('stockEvents_db',token);

  var curr_company = "AAC.AX";
  var curr_topic;

  Meteor.call('checkToken',token, function(err, response) {
    console.log(response);
  });

  render_candlestick_graph(curr_company);
  render_company_chart();

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

    var file = Files.findOne({
      token: token
    });
    console.log(file);
    var stock_price_file = file.stock_price_file;
    var stock_characteristic_file = file.stock_characteristic_file;


    var c_cr = [];
    var all_company = ES.get_all_query_company(stock_price_file);
    all_company.forEach(function(c){

      var ret = StockPrice.findOne(
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
      console.log(ret.cum_return);
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
};
