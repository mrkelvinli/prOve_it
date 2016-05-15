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
};
