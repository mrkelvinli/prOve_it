import {
  Meteor
}
from 'meteor/meteor';
import Highcharts from 'highcharts';


Template.chart.rendered = function () {
  $('.selectpicker').selectpicker();
  $('#chart-options').hide();

  // $("a[href$='http://www.amcharts.com/javascript-charts/']").hide();

  $('#share-link').attr('value', window.location.href);
  new Clipboard('.btn');

  var token = Router.current().params.token;
  $('#token-input').attr('value', token);
  $('#token-input').on('input', function () {
    var t = $(this).val();
    Router.go('/chart/' + t);
  });
  var validToken = false;

  // var curr_graph = 'candlesticks';  // default
  var curr_graph = 'overview';
  var curr_company = "TGR.AX";
  var second_company = '';
  var curr_topic = "Cash Rate";
  var curr_upper = 5;
  var curr_lower = 0;
  RelatedNews = new Mongo.Collection(null);
  DividendHistory = new Mongo.Collection(null);


  // selector to switch between the stocks and topics
  var choose_main_stock = $('#choose-main-stock');
  var choose_second_stock = $('#choose-second-stock');
  var choose_topic = $('#choose-topic');
  Meteor.call('checkToken', token, function (err, response) {
    validToken = response;
    if (validToken) {
      $('ul#tabs li a#' + curr_graph).parent().addClass('active');
      // initialise the correct first company
      // var company = StockPrices.findOne({token: token}, {fields:{company_name:1}, sort:{company_name: 1}});
      // curr_company = company.company_name;
      // console.log(curr_company);
    } else {
      alert("invalid token");
      Router.go('/');
    }
  });

  // control the tabs
  $('ul#tabs li a').on('click', function () {
    var currentTab = $(this);
    var tabId = currentTab.attr('id');
    console.log(tabId);
    $('ul#tabs li').removeClass('active');
    if (tabId == 'overview') {
      curr_graph = 'overview';
    } else if (tabId == 'candlesticks') {
      curr_graph = 'candlesticks';
    } else if (tabId == 'volatility') {
      curr_graph = 'volatility';
    } else if (tabId == 'event-study') {
      curr_graph = 'event-study';
    } else if (tabId == 'stock-topic') {
      curr_graph = 'stock-topic';
    } else if (tabId == 'rrg') {
      curr_graph = 'rrg';
    }
    currentTab.parent().addClass('active');
    renderMainGraph();
  });


  // populate the two stock selector
  var all_company = _.uniq(StockPrices.find({}, {
    fields: {
      company_name: 1
    }
  }, {
    sort: {
      company_name: 1
    }
  }).fetch().map(function (x) {
    return x.company_name
  }), true);
  choose_main_stock.empty();
  choose_second_stock.empty();
  choose_second_stock.append("<option value=''>None</option>");
  all_company.forEach(function (c) {
    choose_main_stock.append("<option value=\'" + c + "\'>" + c + "</option>");
    choose_second_stock.append("<option value=\'" + c + "\'>" + c + "</option>");
  });
  choose_main_stock.selectpicker('refresh');
  choose_second_stock.selectpicker('refresh');
  choose_main_stock.selectpicker('val', all_company[0]);
  choose_second_stock.selectpicker('val', '');
  curr_company = all_company[0];

  // populate the topic selector
  var all_topics = _.uniq(StockEvents.find({
    token: token
  }, {
    sort: {
      topic: 1
    },
    fields: {
      topic: true
    }
  }).fetch().map(function (x) {
    return x.topic
  }), true);
  choose_topic.empty();
  all_topics.forEach(function (c) {
    choose_topic.append("<option>" + c + "</option>");
  });
  choose_topic.selectpicker('refresh');
  if (all_topics.length > 0) {
    choose_topic.selectpicker('val', all_topics[0]);
    curr_topic = all_topics[0];
  } else
    choose_topic.selectpicker('val', '');
  // choose_topic.selectpicker('val', all_topics[0]);


  // render the whole page with the current setting
  function renderMainGraph() {
    $('#chartdiv2').attr('style', '');
    $('#chartdiv3').attr('style', '');
    $('#chartdiv').attr('style', '');
    $('#chartdiv-second_company').attr('style', '');
    $('#chart-options').hide();
    $('#chartdiv2').hide();
    $('#chartdiv3').hide();
    $('#chartdiv4').parent().hide();
    $('#chartdiv4').hide();
    $('#chartdiv-second_company').hide();
    $('#details').hide();
    $('#chartdiv2').html('');
    $('#chartdiv3').html('');
    // console.log($('#chartdiv2').html());
    $('#details').html('');


    $('#chartdiv2').parent().removeClass();
    $('#chartdiv2').parent().addClass('col-md-7');

    $('#chartdiv3').parent().removeClass();
    $('#chartdiv3').parent().addClass('col-md-5');

    $('#chartdiv2').removeClass('related_news');
    $('#chartdiv3').removeClass('related_news');

    choose_main_stock.selectpicker('val', curr_company);

    render_main_chart_title(curr_company, curr_topic, curr_graph);
    render_mini_company_chart(curr_company);
    if (curr_graph == 'overview') {
      render_overview(curr_company, second_company, curr_upper, curr_lower);
    } else if (curr_graph == "candlesticks") {
      $('#chartdiv2').show();
      $('#details').show();
      render_candlestick_graph(curr_company);
      render_company_details();
      render_company_chart();
    } else if (curr_graph == 'volatility') {
      render_volatility_chart(curr_company, second_company);
    } else if (curr_graph == 'event-study') {
      $('#chartdiv2').show();
      $('#chartdiv3').show();
      render_dividends(curr_company);
      render_events_chart(curr_company, curr_topic, curr_upper, curr_lower);
    } else if (curr_graph == 'stock-topic') {
      $('#chartdiv2').show();
      $('#chartdiv3').show();
      render_stock_vs_topic_graph(curr_company, curr_topic, curr_upper, curr_lower);
      render_stock_topics_average_graph(curr_company, curr_upper, curr_lower);
      render_stock_topics_graph_significance_table(curr_company, curr_topic, curr_upper, curr_lower);
      render_regression_raw(curr_company);
    } else if (curr_graph == 'rrg') {
      $('#chartdiv').html('');
      var company1 = '';
      var company2 = '';
      var company3 = '';
      render_rrg(curr_company);
    }
  }

  // listen to the upper window input
  $('#choose-upper-window').on('change', function () {
    curr_upper = parseInt($(this).val());
    // console.log("upper: "+curr_upper);
    renderMainGraph();
  });

  // listen to the lower window input
  $('#choose-lower-window').on('change', function () {
    curr_lower = parseInt($(this).val());
    // console.log("lower: "+curr_lower);
    renderMainGraph();
  });

  // listen to the main stock selector input
  choose_main_stock.on('change', function () {
    var c = $(this).val();
    curr_company = c;
    console.log(c);
    render_company_details();
    renderMainGraph();
  });

  // listen to the second stock selector input
  choose_second_stock.on('change', function () {
    var c = $(this).val();
    second_company = c;
    console.log("second_company: " + second_company);
    renderMainGraph();
  });

  // listen to the topic selector input
  choose_topic.on('change', function () {
    curr_topic = $(this).val();
    renderMainGraph();
  });

  renderMainGraph();

  function render_overview(company, second_company, upper_range, lower_range) {
    $('#chart-options').show();
    if (second_company != '') {
      $('#chartdiv-second_company').show();
      $('#chartdiv').css("height", "400");
      $('#chartdiv-second_company').css("height", "400");
    }

    $('#topic-selection').hide();
    $('#upper-window-selection').hide();
    $('#lower-window-selection').hide();
    $('#second-stock-selection').show();

    var mainChart = null;
    var compareToChart = null;
    var charts = [];


    mainChart = drawGraph(generateChartData(company), generateGuides(company), company, "chartdiv", true);
    if (second_company != '' && mainChart != null){
      compareToChart = drawGraph(generateChartData(second_company), generateGuides(second_company), second_company, "chartdiv-second_company", false);
      mainChart.chartScrollbarSettings.enabled = false;
      mainChart.validateNow();
    }


    charts.push(mainChart);
    if (compareToChart != null)
      charts.push(compareToChart);



    function syncCursors(e) {
      for (var i = 0; i < charts.length; i++) {
        if (charts[i] !== e.chart) {
          charts[i].panels[0].chartCursor.syncWithCursor(e.chart.chartCursor);
        }
      }
    }

    function hideCursors(e) {
      for (var i = 0; i < charts.length; i++) {
        if (charts[i] !== e.chart) {
          charts[i].panels[0].chartCursor.hideCursor();
          charts[i].panels[0].chartCursor.clearSelection();
        }
      }
    }

    function syncZoom(e) {
//      if (e.chart.ignoreZoom) {
//        e.chart.ignoreZoom = false;
//        return;
//      }
      console.log("zooming");
      for (var i = 0; i < charts.length; i++) {
        if (charts[i] !== e.chart) {
//          charts[i].ignoreZoom = true;
          charts[i].panels[0].zoomToDates(e.startDate, e.endDate);
        }
      }
    }


    function generateChartData(company) {

      var stock_prices = StockPrices.find({
        company_name: company,
        token: token,
        'open': {
          $ne: null
        }
      }, {
        fields: {
          'date': 1,
          'open': 1,
          'last': 1,
          'high': 1,
          'low': 1,
          'volume': 1,
          'flat_value': 1
        }
      }).fetch();
      //calculate MACD
      var ppo = [];
      var currPrice = prevPrice = 0;
      var avg = 0;
      var currPrice = 0;
      var prevPrice = 0;
      //calculate standard deviation
      currPrice = prevPrice = 0;
      var range = 30;
      for (var i = 0; i < (stock_prices.length); i++) {
        var bigArray = [];
        var smallArray = [];

        if (i < 29) {
          //currArray.push(stock_prices[i].price);
        }
        for (var x = 0; x < 30; x++) {
          if (i >= 29) {
            if (x < 15) {
              smallArray.push(stock_prices[i - x].last);
            }
            bigArray.push(stock_prices[i - x].last);
          }
        }
        var entry = {};
        if (i > 29) {
          var result = average(bigArray);
          var result2 = average(smallArray);
          entry = {
            "bigAvg": result,
            "smallAvg": result2,
            "date": stock_prices[i - 30].date,
            "open": stock_prices[i].open,
            "last": stock_prices[i].last,
            "high": stock_prices[i].high,
            "low": stock_prices[i].low,
            "volume": stock_prices[i].volume,
            "flat_value": stock_prices[i].flat_value
          };
          entry['price'] = stock_prices[i - 30].flat_value;
          var currArray = [];
          for (var j = 0; j < range; j++) {
            if ((i - 30) - j >= 0) {
              currArray.push(stock_prices[i - j].flat_value);
            }
          }
          var result = standardDeviation(currArray);
          var zScore = (stock_prices[i].flat_value - result[1]) / result[0];
          zScore = Math.abs(zScore);
          entry['mAvg'] = result[1];
          entry['sdUpper'] = (result[0] * 2) + result[1];
          entry['sdLower'] = result[1] - (result[0] * 2);
          entry['sd'] = result[0];
          entry['zScore'] = zScore;
          if (zScore >= 2)
            entry["lineColor"] = "#ff0000";
          else
            entry['lineColor'] = "#0077aa";
          ppo.push(entry);
        }
      }
      return ppo;
    }

    function generateGuides(company) {

      var guides = [];
      var events = StockEvents.find({
        token: token,
        company_name: company,
        value: {
          $gt: 0
        }
      }, {
        fields: {
          'date': 1,
          'topic': 1
        }
      }).fetch();
      // console.log(events);

      events.forEach(function (c) {
        var date = new Date(c.date);
        guides.push({
          "lineColor": "#00aa77",
          "lineAlpha": 1,
          //"label": c.topic+" event",
          "balloonText": c.topic + " event",
          "dashLength": 1,
          "lineThickness": 2,
          "date": date,
          "above": false,
          //"toDate": date.setDate(date.getDate() + 1)


        });
      });
      return guides;
    }

    function standardDeviation(values) {
      var avg = average(values);

      var squareDiffs = values.map(function (value) {
        var diff = value - avg;
        var sqrDiff = diff * diff;
        return sqrDiff;
      });

      var avgSquareDiff = average(squareDiffs);

      var stdDev = Math.sqrt(avgSquareDiff);
      var result = [stdDev, avg];
      return result;
    }

    function labelFunction(item, label) {
      if (item.index === item.graph.chart.dataProvider.length - 1)
        return label;
      else
        return "";
    }

    function average(data) {
      var sum = 0;
      for (var i = 0; i < data.length; i++) {
        sum = sum + data[i];
      }

      var avg = sum / data.length;
      return avg;
    }

    function drawGraph(chartData, guides, company, chartdiv, isMain) {
      var chart = AmCharts.makeChart(chartdiv, {
        "type": "stock",
        "theme": "dark",
        "pathToImages": "/amcharts/images/",
        "autoMarginOffset": 20,
        "marginRight": 80,
        "mouseWheelScrollEnabled": false,
        "dataSets": [{
            "fieldMappings": [{
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
          }, {
              "fromField": "smallAvg",
              "toField": "smallAvg"
          }, {
              "fromField": "bigAvg",
              "toField": "bigAvg"
          }, {
              "fromField": "mAvg",
              "toField": "mAvg"
          }, {
              "fromField": "sdUpper",
              "toField": "sdUpper"
          }, {
              "fromField": "sdLower",
              "toField": "sdLower"
          }, {
              "fromField": "zScore",
              "toField": "zScore"
          }],
            "dataProvider": chartData,
            // "title": "West Stock",
            "categoryField": "date"
        },
        ],

        "panels": [{
            "title": company,
            "showCategoryAxis": true,
            // "percentHeight": 70,
            autoMargins: true,
            guides: guides,
            "valueAxes": [{
              "id": "v1",
              "dashLength": 5,
              "title": "Stock Price ($)",
              "unit": "$",
              'unitPosition': "left",
          }],

            "categoryAxis": {
              "dashLength": 5,
              "title": "Day"
            },

            "stockGraphs": [
              {
                "id": "sdUpperGraph",
                //"balloonText": "Upper Band: <b>[[value]]</b>",
                "showBalloon": false,
                "fillAlphas": 0.3,
                "fillColors": ["#ffa31a"],
                "lineAlpha": 0,
                "type": "line",
                "fillToGraph": "sdLowerGraph",
                "valueField": "sdUpper",
                "title": "Bollinger Bands",
                "visibleInLegend": true,
                "labelPosition": "right",
                "labelFunction": labelFunction,
                "useDataSetColors": false,
                "labelText": "Upper Band",
                "labelOffset": -60,
                //"labelText": "Upper Band"
          }, {
                "id": "sdLowerGraph",
                //"balloonText": "Lower Band: <b>[[value]]</b>",
                "showBalloon": false,
                "fillAlphas": 0,
                "lineAlpha": 0,
                "type": "line",
                "valueField": "sdLower",
                "title": "LowerBand",
                "labelPosition": "right",
                "visibleInLegend": false,
                "labelFunction": labelFunction,
                "useDataSetColors": false,
                "labelOffset": -60,
                "labelText": "Lower Band",
                //"labelText": "Lower Band"
          }, {
                "type": "candlestick",
                "id": "g1",
                "openField": "open",
                "closeField": "close",
                "highField": "high",
                "lowField": "low",
                "valueField": "close",
                // "lineColor": "#7f8da9",
                // "fillColors": "#7f8da9",
                "lineColor": "#ff6600",
                "fillColors": "#ff6600",
                "negativeLineColor": "#ff6600",
                "negativeFillColors": "#ff6600",
                "fillAlphas": 1,
                "useDataSetColors": false,
                // "comparable": true,
                // "compareField": "value",
                "showBalloon": true,
                "proCandlesticks": true,
                "title": "Candlestick",
                "balloonText": "Open:<b>[[open]]</b><br>Low:<b>[[low]]</b><br>High:<b>[[high]]</b><br>Close:<b>[[close]]</b><br>Value:<b>[[value]]</b>",
          },
              {
                "type": "line",
                "id": "stock-price",
                "valueField": "value",
                "lineColor": "#0077aa",
                "fillAlphas": 0,
                "lineThickness": 1.5,
                "dashLength": 4,
                "useDataSetColors": false,
                "title": "Daily Average",
          },
              {
                "type": "line",
                "id": "sAvg",
                "valueField": "smallAvg",
                "lineColor": " #29a329",
                "fillAlphas": 0,
                "lineThickness": 2,
                "useDataSetColors": false,
                "title": "Oscillator (MACD)",
          },
              {
                "type": "line",
                "id": "bAvg",
                "valueField": "bigAvg",
                "lineColor": " #ffcc00",
                "visibleInLegend": false,
                "fillAlphas": 0,
                "lineThickness": 2,
                "useDataSetColors": false,
                "title": "SMA(30)",
          },
          ],

            "stockLegend": {
              "clickMarker": handleCandleLegend,
              "clickLabel": handleCandleLegend,
              "valueFunction": function (item, text) {
                var value = parseFloat(text);
                return value.toFixed(6);
              },
              'spaceing': 20,
            },
            "drawingIconsEnabled": true,
            "listeners": [{
              "event": "zoomed",
              "method": syncZoom
            }, {
              "event": "changed",
              "method": syncCursors
            }, {
              "event": "onHideCursor",
              "method": hideCursors
            }],
        },
//           {
//             "drawingIconsEnabled": true,
//             "title": "Volume",
//             "percentHeight": 30,
//             "marginTop": 1,
//             "showCategoryAxis": true,
//             "valueAxes": [{
//               "dashLength": 5
//           }],

//             "categoryAxis": {
//               "dashLength": 5
//             },

//             "stockGraphs": [{
//                 "valueField": "volume",
//                 "type": "column",
//                 "showBalloon": false,
//                 "fillAlphas": 1,
//                 "fillColors": "#ff6600",
//                 "lineColor": "#ff6600",
//                 "useDataSetColors": false,
//           },
// //            {
// //              "valueField": "zScore",
// //              "type": "line",
// //              "lineColorField": "lineColor",
// //              "lineThickness": 2,
// //              "showBalloon": true,
// //              "bullet": "round",
// //              "bulletSize": 1.5,
// //              "balloonText": "[[value]]",
// //              //"fillAlpha": 0.8,
// //              //"lineColor": "#ff6600",
// //              "comparable": true,
// //              "useDataSetColors": false,
// //          }
//           ],

//             "stockLegend": {
//               "markerType": "none",
//               "markerSize": 0,
//               "labelText": "",
//               "periodValueTextRegular": "[[value.close]]",

//             },

//         },
        ],
        "chartScrollbarSettings": {
          "enabled": true,
          "graph": "stock-price",
          "graphType": "line",
          "usePeriod": "WW"
        },
        "chartCursorSettings": {
          //        valueBalloonsEnabled: true,
          "valueLineBalloonEnabled": true,
          "valueLineEnabled": true
        },
        "chartCursor": {

        },
        "periodSelector": {
          "position": "bottom",
          "periods": [{
            "period": "DD",
            "count": 10,
            "label": "10 days"
          }, {
            "period": "MM",
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
            "label": "MAX",
            selected: true,
          }]
        },
      });
      // chart.titles = [];
      // chart.validateNow();

      function labelFunction(item, label) {
        if (item.index === item.graph.chart.dataProvider.length - 1)
          return label;
        else
          return "";
      }

      function handleCandleLegend(graph) {
        var chart = graph.chart;
        var hidden = graph.hidden;
        if (graph.id == 'sdUpperGraph') {
          if (hidden) {
            chart.showGraph(chart.graphs[0]);
            chart.showGraph(chart.graphs[1]);
          } else {
            chart.hideGraph(chart.graphs[0]);
            chart.hideGraph(chart.graphs[1]);
          }
        } else if (graph.id == 'candlestick') {
          if (hidden) {
            chart.showGraph(chart.graphs[2]);
          } else {
            chart.hideGraph(chart.graphs[2]);
          }
        } else if (graph.id == 'stock-price') {
          if (hidden)
            chart.showGraph(chart.graphs[3]);
          else
            chart.hideGraph(chart.graphs[3]);
        } else if (graph.id == 'sAvg') {
          if (hidden) {
            chart.showGraph(chart.graphs[4]);
            chart.showGraph(chart.graphs[5]);
          } else {

            chart.hideGraph(chart.graphs[4]);
            chart.hideGraph(chart.graphs[5]);
          }
        }
        return false;
      }

      return chart;
    }
  }

  function render_volatility_chart(company, second_company) {
    $('#chart-options').show();
    $('#chartdiv').css("height", "800");

    $('#topic-selection').hide();
    $('#upper-window-selection').hide();
    $('#lower-window-selection').hide();
    $('#second-stock-selection').show();

    // var stock_prices = [
    //   {time: 0, price: 5},
    //   {time: 1, price: 5.1},
    //   {time: 2, price: 5.3},
    //   {time: 3, price: 5.2},
    //   {time: 4, price: 4.9},
    //   {time: 5, price: 5.5},
    //   {time: 6, price: 5.6},
    //   {time: 7, price: 5.8},
    //   {time: 8, price: 5.5},
    //   {time: 9, price: 5.7},
    //   {time: 10, price: 6.1}
    // ];

    function generateData(company) {

      var stock_prices = StockPrices.find({
        token: token,
        company_name: company,
        flat_value: {
          $ne: null
        }
      }, {
        fields: {
          date: true,
          flat_value: true
        }
      }).fetch();
      // var stock_prices = [];
      // prices.forEach(function(p){
      //   stock_prices.push({
      //     time: p.date,
      //     price: p.flat_value,
      //   });
      // });

      var sma = [];
      var distinctAvgToDo = [];
      var avg = 0;
      var currPrice = 0;
      var prevPrice = 0;
      var currAvg = 0;

      //calculate standard deviation
      // var toDoList = []; //array of arrays of values [[1,2],[2,3],[9,10]]
      currPrice = prevPrice = 0;
      var range = 30;
      for (var i = 0; i < stock_prices.length; i++) {
        var entry = {
          'time': stock_prices[i].date,
          'price': stock_prices[i].flat_value,
        };
        // if (i >= range-1) {
        var currArray = [];
        for (var j = 0; j < range; j++) {
          if (i - j >= 0) {
            currArray.push(stock_prices[i - j].flat_value);
          }
        }

        var result = standardDeviation(currArray);


        if (i > 19 && i % 20 == 0) {
          currAvg = average(distinctAvgToDo);
          distinctAvgToDo = [];
        }
        if (i < 20) {
          currAvg = 1; //stock_prices[0].flat_value;
        }
        distinctAvgToDo.push(stock_prices[i].flat_value);
        console.log(currAvg);
        var md = meanDeviation(currArray, currAvg);
        //console.log("md: "+md);
        var cci = stock_prices[i].flat_value - result[1];
        //console.log("bCCI: "+cci);

        md = md * 0.015;
        cci = cci / md;
        //console.log("CCI: "+cci);

        var zScore = (stock_prices[i].flat_value - result[1]) / result[0];
        zScore = Math.abs(zScore);
        entry['mAvg'] = result[1];
        entry['sdUpper'] = (result[0] * 2) + result[1];
        entry['sdLower'] = result[1] - (result[0] * 2);
        entry['sd'] = result[0];
        entry['cci'] = cci;
        entry['zScore'] = zScore;
        if (zScore >= 1.75)
          entry["lineColor"] = "#ff0000";
        else
          entry['lineColor'] = "#0077aa";
        // }
        sma.push(entry);
      }
      console.log(sma);
      return sma;
    }

    var chartData1 = generateData(company);
    var chartData2 = [];
    if (second_company != null) {
      chartData2 = generateData(second_company);
    }


    drawGraph(chartData1, chartData2, company, second_company);



    function standardDeviation(values) {
      var avg = average(values);

      var squareDiffs = values.map(function (value) {
        var diff = value - avg;
        var sqrDiff = diff * diff;
        return sqrDiff;
      });

      var avgSquareDiff = average(squareDiffs);

      var stdDev = Math.sqrt(avgSquareDiff);
      var result = [stdDev, avg];
      return result;
    }

    function average(data) {
      var sum = 0;
      for (var i = 0; i < data.length; i++) {
        sum = sum + data[i];
      }

      var avg = sum / data.length;
      return avg;
    }

    function meanDeviation(data, average) {
      // There are four steps to calculating the Mean Deviation. First, subtract 
      // the most recent 20-period average of the typical price from each period's 
      // typical price. Second, take the absolute values of these numbers. Third, 
      // sum the absolute values. Fourth, divide by the total number of periods (20). 
      var cci;
      var values = [];
      //console.log(data);
      for (var i = 0; i < data.length; i++) {
        cci = data[i] - average;
        cci = Math.abs(cci);
        values.push(cci);
      }
      var sum = 0;
      for (var i = 0; i < values.length; i++) {
        sum = sum + values[i];
      }
      sum = sum / values.length;
      return sum;
    }

    function drawGraph(sma, sma2, company, second_company) {

      // console.log("sma2");
      // console.log(sma2);
      // console.log(second_company);


      // events
      var company_name = company;
      var guides = [];
      var events = StockEvents.find({
        token: token,
        company_name: company_name,
        value: {
          $gt: 0
        }
      }, {
        fields: {
          'date': 1,
          'topic': 1
        }
      }).fetch();
      // console.log(events);

      events.forEach(function (c) {
        var date = new Date(c.date);
        guides.push({
          "lineColor": "#00aa77",
          "lineAlpha": 1,
          //"label": c.topic+" event",
          "balloonText": c.topic + " event",
          "dashLength": 1,
          "lineThickness": 2,
          "date": date,
          //"toDate": date.setDate(date.getDate() + 1)


        });
      });

      var sdScoreTitle = "Standard Scores for " + company;
      if (second_company != '') {
        sdScoreTitle = "Standard Scores for " + company + " compared to " + second_company;
      }

      var chart = AmCharts.makeChart("chartdiv", {
        "type": "stock",
        "theme": "dark",
        "pathToImages": "/amcharts/images/",
        "autoMarginOffset": 20,

        //        categoryAxesSettings: {
        //          alwaysGroup: false,
        //          groupToPeriods: ["DD"],
        //        },
        "marginRight": 80,
        "titles": [{
            "text": "Bollinger Bands for " + company,
            "bold": true
          },
          {
            "text": "This tool allows you to determine the dispersion that a stock price has around its average.",
            "bold": false
          },

          ],

        "dataSets": [{
            "fieldMappings": [{
              "fromField": "price",
              "toField": "price"
            }, {
              "fromField": "mAvg",
              "toField": "mAvg"
            }, {
              "fromField": "sdUpper",
              "toField": "sdUpper"
            }, {
              "fromField": "sdLower",
              "toField": "sdLower"
            }, {
              "fromField": "zScore",
              "toField": "zScore"
            }, {
              "fromField": "cci",
              "toField": "cci"
            }],
            "color": "orange",
            "dataProvider": sma,
            // "title": "West Stock",
            "categoryField": "time"
          },
          {
            "fieldMappings": [{
              "fromField": "zScore",
              "toField": "zScore2"
            }],
            // "color": "blue",
            "dataProvider": sma2,
            // "title": "East Stock",
            "categoryField": "time",
            "compared": true,
          }
          ],


        "panels": [{
            "title": "Lambert's Commodity Channel Index",
            "percentHeight": 25,
            autoMargins: true,
            "marginTop": 1,
            // "showCategoryAxis": true,
            "valueAxes": [{
              "dashLength": 5,
              "guides": [{
                "value": 100,
                "lineAlpha": 0.6,
                "lineColor": "#ff6600",
                "dashLength": 0
              }, {
                "value": -100,
                "lineAlpha": 0.6,
                "lineColor": "#00bfff",
                "dashLength": 0
              }]
              }],

          "categoryAxis": {
            "dashLength": 5,
            "labelsEnabled": false,

            //   "guides":  [{
            //     "value": 100,
            //     "toValue": 120,
            //     "lineColor": "#ff0000",
            //     "inside": true,
            //     "fillAlpha": 0.9,
            //     "fillColor": "#CC0000",
            //     "lineAlpha": 1,
            //     "label": "Lambert Correction",
            // }],
          },
            "recalculateToPercents": "never",
            "stockGraphs": [{
              "valueField": "cci",
              "type": "line",
              //"lineColorField": "lineColor",
              "lineColor": "#cc6600",
              "negativeLineColor": "#2eb82e",
              "negativeLineAlpha": 1,
              "fillColor": "#cc6600",
              "negativeFillColor": "#2eb82e",
              "negativeBase": 100,
              "fillAlphas": 0.8,
              "negativeFillAlphas": 0,
              "lineThickness": 2,
              "showBalloon": true,
              "balloonText": "[[value]]",
              //"fillAlpha": 0.8,
              //"lineColor": "#ff6600",
              "comparable": true,
              "useDataSetColors": false,
              "visibleInLegend": false,
              }, {
              "valueField": "cci",
              "type": "line",
              //"lineColorField": "lineColor",
              "lineColor": "#e6b800",
              "lineAlpha": 0,
              "negativeLineAlpha": 0,
              "negativeLineColor": "#00bfff",
              //"fillColor": "#2eb82e",
              //"negativeFillColor": "#00bfff",
              "fillAlphas": 0,
              "negativeFillAlphas": 1,
              "lineThickness": 2,
              "showBalloon": false,
              "negativeBase": -100,
              "comparable": true,
              "useDataSetColors": false,
              }, ],

          "stockLegend": {
            "markerType": "none",
            "markerSize": 0,
            "labelText": "",
            "valueFunction": function (item, text) {
              var value = parseFloat(text);
              return value.toFixed(2);
            },
            //"periodValueTextRegular": "[[zScore]]"
          }
          }, {
            "title": "Volatility Analysis for " + company,
            //"percentHeight": 40,
            "marginTop": 1,
            "showCategoryAxis": true,
            "percentHeight": 50,
            autoMargins: true,
            "valueAxes": [{
              "id": "v1",
              "gridColor": "#000000",
              "gridCount": 500,
              "autoGridCount": false,
              "gridAlpha": 0.2,
              "dashLength": 10,
              //"title": "Stock Price ($)",
              "unit": "$",
              "unitPosition": "left",
              "axisTitleOffset": -50,
            }],
          "categoryField": "time",
          "categoryAxis": {
            "parseDates": true,
            "guides": guides,
            "position": "bottom",
            "gridPosition": "middle",
            "gridAlpha": 0.2,
            "dashLength": 10,
            "title": "Time (Days)"
          },
            "stockGraphs": [{
              "id": "sdUpperGraph",
              //"balloonText": "Upper Band: <b>[[value]]</b>",
              "showBalloon": false,
              "fillAlphas": 0.15,
              "fillColors": ["#ffa31a"],
              "lineAlpha": 0,
              "type": "line",
              "fillToGraph": "sdLowerGraph",
              "valueField": "sdUpper",
              "title": "UpperBand",
              "visibleInLegend": false,
              "labelPosition": "right",
              "labelFunction": labelFunction,
              "useDataSetColors": false,
              "labelText": "Upper Band",
              "labelOffset": -70,
              //"labelText": "Upper Band"
              }, {
            "id": "sdLowerGraph",
            //"balloonText": "Lower Band: <b>[[value]]</b>",
            "showBalloon": false,
            "fillAlphas": 0,
            "lineAlpha": 0,
            "type": "line",
            "valueField": "sdLower",
            "title": "LowerBand",
            "labelPosition": "right",
            "visibleInLegend": false,
            "labelFunction": labelFunction,
            "useDataSetColors": false,
            "labelOffset": -70,
            "labelText": "Lower Band",
            //"labelText": "Lower Band"
              }, {
              "id": "smaGraph",
              //"balloonText": "SMA(30): <b>[[value]]</b>",
              "showBalloon": false,
              "fillAlphas": 0,
              "lineAlpha": 0.8,
              "lineThickness": 2,
              "type": "line",
              "dashLength": 4,
              "lineColor": "#00bfff",
              "valueField": "mAvg",
              "title": "Bollinger Bands",
              "labelPosition": "right",
              "labelFunction": labelFunction,
              "labelText": "SMA(30)",
              "useDataSetColors": false,
              "labelOffset": -45,
              },{
              "id": "priceGraph",
              "balloonText": "Price: <b>[[price]]</b><br>Upper Band: <b>[[sdUpper]]</b><br>SMA(30): <b>[[mAvg]]</b><br>Lower Band: <b>[[sdLower]]</b>",
              "balloonFunction": function (item, graph) {
                var result = graph.balloonText;
                for (var key in item.dataContext) {
                  if (item.dataContext.hasOwnProperty(key) && !isNaN(item.dataContext[key])) {
                    var formatted = AmCharts.formatNumber(item.dataContext[key], {
                      precision: 3,
                      decimalSeparator: chart.decimalSeparator,
                      thousandsSeparator: chart.thousandsSeparator
                    }, 2);
                    result = result.replace("[[" + key + "]]", formatted);
                  }
                }
                return result;
              },
              "bullet": "round",
              "bulletSize": 4,
              "fillAlphas": 0,
              "lineAlpha": 1,
              "type": "line",
              "lineColor": "#ff6600",
              "lineThickness": 2,
              "valueField": "price",
              "title": "Stock Price",
              "labelPosition": "right",
              //"visibleInLegend": false,
              "labelFunction": labelFunction,
              //"labelText": "Stock Price ($)",
              "useDataSetColors": false,
              "labelOffset": -75,
              },],

          "stockLegend": {
            // "valueTextRegular": undefined,
            "periodValueTextComparing": "[[percents.value.close]]%",
            "equalWidths": false,
            //"periodValueText": "total: [[value.sum]]",
            "position": "top",
            "valueAlign": "left",
            "valueWidth": 100,
            "clickMarker": handleLegendClick,
            "clickLabel": handleLegendClick,
            "valueFunction": function (item, text) {
              var value = parseFloat(text);
              return value.toFixed(5);
            },
          },
          }, {
            "title": sdScoreTitle,
            "percentHeight": 25,
            autoMargins: true,
            "marginTop": 1,
            "showCategoryAxis": false,
            "valueAxes": [{
              "dashLength": 5
              }],

            "categoryAxis": {
              "labelsEnabled": true,
              "dashLength": 5
            },

          "recalculateToPercents": "never",
          "stockGraphs": [{
              "valueField": "zScore",
              "type": "line",
              "lineColorField": "lineColor",
              "lineThickness": 2,
              "showBalloon": true,
              "bullet": "round",
              "bulletSize": 1.5,
              "balloonText": "[[value]]",
              //"fillAlpha": 0.8,
              //"lineColor": "#ff6600",
              "comparable": true,
              "useDataSetColors": false,
              },
            { //add to compare
              "valueField": "zScore2",
              "type": "line",
              //"lineColorField": "lineColor",
              "lineColor": "#0066aa",
              "lineThickness": 5,
              //"lineAlpha": 0.4,
              //"showBalloon": true,
              "bullet": "round",
              //"bulletSize": 1.5,
              //"balloonText": "[[value]]",
              //"fillAlpha": 0.8,
              //"lineColor": "#ff6600",
              //"useDataSetColors":false,
              "compareGraphVisibleInLegend": false,
              "comparable": true,
              "compareGraphLineColor": "#00aa77",
              "compareGraphLineAlpha": 0.7,
              }],

          "stockLegend": {
            "markerType": "none",
            "markerSize": 0,
            "labelText": "",
            //"periodValueTextRegular": "[[zScore]]"
            "valueFunction": function (item, text) {
              var value = parseFloat(text);
              return value.toFixed(5);
            },
          },
          }],

        "ChartScrollbar": {
          enabled: true,
        },

        "chartScrollbarSettings": {
          "graph": "priceGraph",
          "graphType": "line",
          "usePeriod": "WW",
          "position": "bottom",
          "enabled": true,
        },



        "chartCursorSettings": {
          "valueLineBalloonEnabled": true,
          //"valueLineEnabled": true
        },

        "categoryAxis": {
          "parseDates": true,
          "dashLength": 1,
          "minorGridEnabled": true,
          // let's start with the monthly data
          "minPeriod": "DD",
          "position": "bottom",
        },

        categoryAxesSettings: {
          alwaysGroup: false,
          // groupToPeriods: ["DD"],
          maxSeries: Number.MAX_SAFE_INTEGER,
        },

        "periodSelector": {
          "position": "bottom",
          "periods": [{
            "period": "DD",
            "count": 10,
            "label": "10 days"
            }, {
            "period": "MM",
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
            "label": "MAX",
            selected: true,
            }]
        },
        //   "dataSetSelector": {
        //     "position": "left"
        // },
        "export": {
          "enabled": true
        },
        "listeners": [{
          "event": "init",
          "method": function (event) {
            // var chart = event.chart;
            // var stockGraph = event.stockChart;

            // console.log(chart.dataProvider.length);
            // console.log(stockGraph.dataProvider.length);

            // var end = new Date(); // today
            // var start = new Date(end);
            // start.setDate(end.getDate() - 10);
            // console.log('test');
            // var chart = event.chart;
            // //var graph = chart.graph;
            // event.chart.zoomToIndexes(0, 100);
            // var graph = event.chart.getGraphById("priceGraph");
            // graph.bullet = "round";
          }
          }, {
          "event": "zoomed",
          "method": function (event) {
            // console.log(event.chart.panels[0].stockGraphs.getGraphById("priceGraph"));
            // var zoomPercent = (event.endIndex - event.startIndex) / event.endIndex;
            // console.log("zoom: "+zoomPercent);
            // var graph = event.chart.getGraphById("priceGraph");
            // var chart = event.chart;
            // if (zoomPercent > 0.4){
            //   graph.bullet = "none";
            // } else {
            //   graph.bullet = "round";
            // }
          }
          }],
      });
    }

    function handleLegendClick(graph) {
      var chart = graph.chart;
      var hidden = graph.hidden;
      if (graph.id == 'priceGraph') {
        if (hidden) {
          chart.showGraph(chart.graphs[3]);
        } else {
          chart.hideGraph(chart.graphs[3]);
        }
      } else {
        if (hidden) {
          chart.showGraph(chart.graphs[0]);
          chart.showGraph(chart.graphs[2]);
          chart.showGraph(chart.graphs[1]);
        } else {
          chart.hideGraph(chart.graphs[0]);
          chart.hideGraph(chart.graphs[1]);
          chart.hideGraph(chart.graphs[2]);
        }
      }

      // return false so that default action is canceled
      return false;
    }

    function labelFunction(item, label) {
      if (item.index === item.graph.chart.dataProvider.length - 1)
        return label;
      else
        return "";
    }
  }


  function render_stock_vs_topic_graph(company, topic, upper_range, lower_range) {
    $('#chart-options').show();
    $('#second-stock-selection').hide();

    $('#chartdiv2').parent().removeClass();
    $('#chartdiv2').parent().addClass('col-md-4');
    $('#chartdiv3').parent().removeClass();
    $('#chartdiv3').parent().addClass('col-md-3');
    $('#chartdiv4').parent().removeClass();
    $('#chartdiv4').parent().addClass('col-md-5');



    var chartData = [];

    // var all_topics = _.uniq(StockEvents.find({token:token},{sort:{topic:1},fields:{topic:true}}).fetch().map(function(x){return x.topic}),true);

    // var dates = _.uniq(StockEvents.find({token:token,company_name: company, topic: topic, value: {$gt: 0}},{sort:{date:1},fields: {date: true}}).fetch().map(function(x){return x.date}),true);

    var events = StockEvents.find({
      token: token,
      company_name: company,
      topic: topic,
      value: {
        $gt: 0
      }
    }, {
      sort: {
        date: 1
      },
      fields: {
        date: true
      }
    }).fetch();


    var graphs = [];
    var graphsReady = false;

    if (events.length > 0) {

      for (var date = lower_range; date <= upper_range; date++) {
        var entry = {
          date: date
        };
        events.forEach(function (e) {
          var currDate = new Date(e.date.getTime());
          // console.log("currDate :"+currDate); 
          currDate.setUTCDate(e.date.getUTCDate() + date);
          // console.log("window: "+ date + " " + currDate+ " event date: "+ e.date );
          var cr = StockPrices.findOne({
            token: token,
            company_name: company,
            date: currDate
          }, {
            fields: {
              cum_return: true
            }
          });
          var offset_cr = StockPrices.findOne({
            token: token,
            company_name: company,
            date: e.date
          }, {
            fields: {
              cum_return: true
            }
          });
          if (cr === undefined)
            cr = null;
          else
            cr = cr.cum_return;

          if (offset_cr === undefined)
            offset_cr = null;
          else
            offset_cr = offset_cr.cum_return;

          entry[e.date.toDateString()] = cr - offset_cr;

          if (!graphsReady) {
            graphs.push({
              "balloonText": "[[value]]%",
              "bullet": "round",
              "hidden": false,
              "title": e.date.toDateString(),
              "valueField": e.date.toDateString(),
              "fillAlphas": 0,
            });
          }

        });
        graphsReady = true;
        chartData.push(entry);
      }
    }

    // console.log(chartData);

    drawGraph(chartData, graphs, company, topic);



    function drawGraph(chartData, graphs, company, topic) {



      var chartOptions = {
        "type": "serial",
        "theme": "dark",
        "legend": {
          "useGraphSettings": true,
          "valueText": '',
        },
        // "titles":[{
        //   "text": "Individual "+topic+" events for "+company,
        //   "size": 15
        // },
        // {
        //   "text": "By comparing individual event-windows we can determine how companies can expect to react to certain event types",
        //   "bold": false
        // }],
        "dataProvider": chartData,

        "valueAxes": [{
          // "integersOnly": true,
          // "maximum": 6,
          // "minimum": 1,
          "reversed": false,
          "axisAlpha": 0,
          "dashLength": 5,
          "gridCount": 10,
          "position": "left",
          "title": "Relative Cumulative Return (%)",
          // 'recalculateToPercents' : true,
          "unit": "%",
          "unitPosition": "right",
      }],
        "startDuration": 0,
        "chartCursor": {
          "cursorAlpha": 0,
          "zoomable": false
        },
        "categoryField": "date",
        "categoryAxis": {
          "gridPosition": "start",
          "axisAlpha": 0,
          "fillAlpha": 0.05,
          "fillColor": "#000000",
          "gridAlpha": 0,
          "position": "bottom",
          "title": "Relative Event Day",
        },
        "export": {
          "enabled": true,
          "position": "bottom-right"
        },

      };

      chartOptions['graphs'] = graphs;

      // console.log(chartOptions);
      var chart = AmCharts.makeChart("chartdiv", chartOptions);

      AmCharts.checkEmptyData = function (chart) {
        if (chart.dataProvider.length == 0) {
          // set min/max on the value axis
          chart.valueAxes[0].minimum = 0;
          chart.valueAxes[0].maximum = 100;

          // add dummy data point
          var dataPoint = {
            dummyValue: 0
          };
          dataPoint[chart.categoryField] = '';
          chart.dataProvider = [dataPoint];

          // add label
          chart.addLabel(0, '50%', 'The chart contains no data', 'center');

          // set opacity of the chart div
          chart.chartDiv.style.opacity = 0.5;

          // redraw it
          chart.validateNow();
        }
      }

      AmCharts.checkEmptyData(chart);

    }
  }




  function render_candlestick_graph(company_name) {
    var stockPrices = StockPrices.find({
      company_name: company_name,
      token: token,
      'open': {
        $ne: null
      }
    }, {
      fields: {
        'date': 1,
        'open': 1,
        'last': 1,
        'high': 1,
        'low': 1,
        'volume': 1,
        'flat_value': 1
      }
    }).fetch();

    //calculate MACD
    var toDoList = []; //array of arrays of values [[1,2],[2,3],[9,10]]
    var ppo = [];
    var currPrice = prevPrice = 0;

    for (var i = 0; i < (stockPrices.length); i++) {
      var bigArray = [];
      var smallArray = [];

      if (i < 29) {
        //currArray.push(stock_prices[i].price);
      }
      for (var x = 0; x < 30; x++) {
        if (i >= 29) {
          if (x < 15) {
            smallArray.push(stockPrices[i - x].last);
          }
          bigArray.push(stockPrices[i - x].last);
        }
      }

      if (i > 29) {
        toDoList.push({
          "bigArray": bigArray,
          "smallArray": smallArray,
          "date": stockPrices[i - 30].date,
          "open": stockPrices[i].open,
          "last": stockPrices[i].last,
          "high": stockPrices[i].high,
          "low": stockPrices[i].low,
          "volume": stockPrices[i].volume,
          "flat_value": stockPrices[i].flat_value
        });
      }
      // console.log(toDoList);
    }

    toDoList.forEach(function (c) {
      var result = movAvg(c.bigArray);
      var result2 = movAvg(c.smallArray);
      console.log(result2);
      // console.log(entry);
      var entry = {
        "date": c.date,
        "open": c.open,
        "last": c.last,
        "high": c.high,
        "low": c.low,
        "volume": c.volume,
        "flat_value": c.flat_value,
        "bigAvg": result,
        "smallAvg": result2,
        "lineColor": "#ff0000"
      };
      // console.log(entry);
      ppo.push(entry);
    });

    function movAvg(data) {
      var sum = 0;
      for (var i = 0; i < data.length; i++) {
        sum = sum + data[i];
      }

      var avg = sum / data.length;
      return avg;
    }

    //return ppo;
    //}




    drawGraph(ppo, company_name);

    function drawGraph(chartData, company) {


      var chart = AmCharts.makeChart("chartdiv", {
        "type": "stock",
        "theme": "dark",
        "marginRight": 80,

        "pathToImages": "/amcharts/images/",
        "titles": [{
          "text": "Candlestick graph for " + company,
          "size": 15
      }],
        "dataSets": [{
            "fieldMappings": [{
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
        }, {
              "fromField": "smallAvg",
              "toField": "smallAvg"
        }, {
              "fromField": "bigAvg",
              "toField": "bigAvg"
        }],
            "color": "#ff6600",
            "dataProvider": chartData,
            "title": "Candlestick",
            "categoryField": "date"
      }
        // , {
        //   "fieldMappings": [ {
        //     "fromField": "flat_value",
        //     "toField": "value"
        //   } ],
        //   "color": "#0077aa",
        //   "lineColor": "#0077aa",
        //   "dataProvider": chartData,
        //   "compared": true,
        //   "title": "Line",
        //   "categoryField": "date"
        // } 
        ],


        "panels": [{

            "title": "Stock Price",
            "showCategoryAxis": false,
            "percentHeight": 70,
            "valueAxes": [{
              "id": "v1",
              "dashLength": 5,
              "title": "Stock Price ($)",
              "unit": "$",
              'unitPosition': "left",
          }],

            "categoryAxis": {
              "dashLength": 5,
              "title": "Day"
            },

            "stockGraphs": [{
                "type": "candlestick",
                "id": "g1",
                "openField": "open",
                "closeField": "close",
                "highField": "high",
                "lowField": "low",
                "valueField": "close",
                // "lineColor": "#7f8da9",
                // "fillColors": "#7f8da9",
                "lineColor": "#ff6600",
                "fillColors": "#ff6600",
                "negativeLineColor": "#ff6600",
                "negativeFillColors": "#ff6600",
                "fillAlphas": 1,
                "useDataSetColors": false,
                // "comparable": true,
                // "compareField": "value",
                "showBalloon": true,
                "proCandlesticks": true,
                "title": "Candlestick",
                "balloonText": "Open:<b>[[open]]</b><br>Low:<b>[[low]]</b><br>High:<b>[[high]]</b><br>Close:<b>[[close]]</b><br>Value:<b>[[value]]</b>",
          },
              {
                "type": "line",
                "id": "g2",
                // "openField": "open",
                // "closeField": "close",
                // "highField": "high",
                // "lowField": "low",
                "valueField": "value",
                "lineColor": "#0077aa",
                "fillAlphas": 0,
                "lineThickness": 1.5,
                "dashLength": 4,
                "useDataSetColors": false,
                // "comparable": true,
                // "compareField": "value",
                // "showBalloon": false,
                // "proCandlesticks": true,
                "title": "Daily Average",
          },
              {
                "type": "line",
                "id": "sAvg",
                // "openField": "open",
                // "closeField": "close",
                // "highField": "high",
                // "lowField": "low",
                "valueField": "smallAvg",
                "lineColor": " #29a329",
                "fillAlphas": 0,
                "lineThickness": 2,
                //"dashLength": 4,
                "useDataSetColors": false,
                "labelPosition": "right",
                "labelText": "MA(15)",
                "labelOffset": -60,
                "labelFunction": labelFunction,
                // "comparable": true,
                // "compareField": "value",
                // "showBalloon": false,
                // "proCandlesticks": true,
                "title": "Oscillator (MACD)",
          },
              {
                "type": "line",
                "id": "bAvg",
                // "openField": "open",
                // "closeField": "close",
                // "highField": "high",
                // "lowField": "low",
                "valueField": "bigAvg",
                "lineColor": " #ffcc00",
                "visibleInLegend": false,
                "fillAlphas": 0,
                "lineThickness": 2,
                //"dashLength": 4,
                "useDataSetColors": false,
                "labelText": "MA(30)",
                "labelPosition": "right",
                "labelOffset": -60,

                "labelFunction": labelFunction,
                // "comparable": true,
                // "compareField": "value",
                // "showBalloon": false,
                // "proCandlesticks": true,
                "title": "SMA(30)",
          }],

            "stockLegend": {
              "clickMarker": handleCandleLegend,
              "clickLabel": handleCandleLegend,
              // "valueTextRegular": undefined,
              // "periodValueTextComparing": "[[value.close]]%"

              "valueFunction": function (item, text) {
                var value = parseFloat(text);
                return value.toFixed(5);
              },
            },
            "drawingIconsEnabled": true,
        },

          {
            // "drawingIconsEnabled": true,
            "title": "Volume",
            "percentHeight": 30,
            "marginTop": 1,
            "showCategoryAxis": true,
            "valueAxes": [{
              "dashLength": 5
          }],

            "categoryAxis": {
              "dashLength": 5
            },

            "stockGraphs": [{
              "valueField": "volume",
              "type": "column",
              "showBalloon": false,
              "fillAlphas": 1
          }],

            "stockLegend": {
              "markerType": "none",
              "markerSize": 0,
              "labelText": "",
              "periodValueTextRegular": "[[value.close]]",
            },

        }
        ],

        "chartScrollbar": {
          // "dragIcon": 
        },

        "chartScrollbarSettings": {
          "graph": "g2",
          "graphType": "line",
          "usePeriod": "WW"

        },

        "chartCursorSettings": {
          "valueLineBalloonEnabled": true,
          "valueLineEnabled": true
        },

        "periodSelector": {
          "position": "bottom",
          "periods": [{
            "period": "DD",
            "count": 10,
            "label": "10 days"
          }, {
            "period": "MM",
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
            "label": "MAX",
            selected: true,
          }]
        },
        // "export": {
        //   "enabled": true
        // }
      });
    }


    function labelFunction(item, label) {
      if (item.index === item.graph.chart.dataProvider.length - 1)
        return label;
      else
        return "";
    }

    function handleCandleLegend(graph) {
      var chart = graph.chart;
      var hidden = graph.hidden;
      if (graph.id == 'g1') {
        if (hidden) {
          chart.showGraph(chart.graphs[0]);
        } else {
          chart.hideGraph(chart.graphs[0]);
        }
      } else if (graph.id == 'g2') {
        if (hidden) {
          chart.showGraph(chart.graphs[1]);
        } else {
          chart.hideGraph(chart.graphs[1]);
        }
      } else if (graph.id == 'sAvg') {
        if (hidden) {
          chart.showGraph(chart.graphs[2]);
          chart.showGraph(chart.graphs[3]);
        } else {

          chart.hideGraph(chart.graphs[2]);
          chart.hideGraph(chart.graphs[3]);
        }
      }
      return false;
    }


  }

  function render_company_chart() {
    var c_cr = [];
    var all_company = _.uniq(StockPrices.find({
      token: token
    }, {
      fields: {
        company_name: 1,
        _id: 0
      },
      sort: {
        company_name: 1
      }
    }).fetch().map(function (x) {
      return x.company_name
    }), true);

    all_company.forEach(function (c) {
      var ret = StockPrices.findOne({
        company_name: c,
        token: token,
      }, {
        fields: {
          company_name: 1,
          date: 1,
          cum_return: 1,
        },
        sort: {
          date: -1,
        }
      });
      c_cr.push({
        company_name: c,
        last_cr: ret.cum_return,
      });
    });

    c_cr = _.sortBy(c_cr, 'last_cr');
    c_cr.reverse();

    drawGraph(c_cr);

    function handleClick(event) {
      curr_company = event.item.category;

      renderMainGraph();
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
            //var color = ['#d64608', '#1d7865', '#ff9e1c', '#ff831e', '#ff6400', '#d64608', '#1d7865', '#ff9e1c', '#ff831e', '#ff6400'][x];
            var color = ["#334D5C", "#45B29D", "#EFC94C", "#E27A3F", "#DF5A49",
            "#334D5C", "#45B29D", "#EFC94C", "#E27A3F", "#DF5A49",
            "#334D5C", "#45B29D", "#EFC94C", "#E27A3F", "#DF5A49",
            "#334D5C", "#45B29D", "#EFC94C", "#E27A3F", "#DF5A49",
            "#334D5C", "#45B29D", "#EFC94C", "#E27A3F", "#DF5A49",
            "#334D5C", "#45B29D", "#EFC94C", "#E27A3F", "#DF5A49",
            "#334D5C", "#45B29D", "#EFC94C", "#E27A3F", "#DF5A49",
            "#334D5C", "#45B29D", "#EFC94C", "#E27A3F", "#DF5A49",
            "#334D5C", "#45B29D", "#EFC94C", "#E27A3F", "#DF5A49", ][x];

            chart.dataProvider[x][colorKey] = color;
          }
        }

      }, ["serial"]);

      var chart = AmCharts.makeChart("chartdiv2", {
        "type": "serial",
        "theme": "dark",
        "dataProvider": chartData,
        "valueAxes": [{
          "minorGridAlpha": 0.08,
          "minorGridEnabled": true,
          "position": "top",
          "axisAlpha": 1,
          "title": "Cumulative Return (%)",
          "titleBold": true,
          "titleFontSize": 12,
        }],
        //         "startDuration": 1,
        "graphs": [{
          "type": "column",
          "balloonText": "[[category]]: [[value]]",
          "valueField": "last_cr",
          "lineAlpha": 1,
          "fillAlphas": 1,
          "autoColor": true,
        }],
        "rotate": true,
        "categoryField": "company_name",
        "categoryAxis": {
          gridPosition: "start",
          labelRotation: 90,
          title: "Companies",
          lineAlpha: 0,
          fillAlphas: 0.8,
          rotate: true,
          columnWidth: 1,
          "titleBold": true,
          "titleFontSize": 12,
        },
        titles: [{
          "text": "Stock Comparison",
          "bold": true,
        }, {
          "text": "Cumulative returns for the last 30 days",
          "bold": false,
        }],
        "export": {
          "enabled": true
        }

      });


    }
  }

  function render_events_chart(company_name, topic, upper_range, lower_range) {



    $('#chart-options').show();
    $('#topic-selection').show();
    $('#upper-window-selection').show();
    $('#lower-window-selection').show();
    $('#second-stock-selection').hide();
    var relatedNews = [];

    // console.log(relatedNews);
    // console.log("render_events_chart: topic: "+topic+" upper: "+upper_range+" lower: "+lower_range);

    // events
    var events = StockEvents.find({
      token: token,
      company_name: company_name,
      topic: topic,
      value: {
        $gt: 0
      }
    }, {
      fields: {
        'date': 1
      },
      sort: {
        date: -1
      }
    }).fetch();

    var stocks = StockPrices.find({
      company_name: company_name,
      token: token
    }, {
      fields: {
        'date': 1,
        'cum_return': 1,
        'flat_value': 1
      }
    }).fetch();
    stocks.forEach(function (s) {
      if (s.flat_value == null)
        delete s.flat_value;
      if (s.cum_return == null)
        delete s.cum_return;
    });
    // console.log(events);

    // var company_name = 'AAC.AX';
    // var date = new Date(Date.UTC(2016,2,2));

    if (events.length <= 0) {
      $('#chartdiv3').html('No related events for ' + company_name + " on " + topic + ".");
    } else {
      render_related_news(company_name, topic, events[0].date);
    }
    // render_related_news(company_name, topic, date);

    var guides = [];

    events.forEach(function (c) {
      var dateLower = new Date(c.date);
      dateLower.setDate(dateLower.getDate() + lower_range);
      var dateUpper = new Date(c.date);
      dateUpper.setDate(dateUpper.getDate() + upper_range);

      // console.log(c.date);
      // console.log(dateLower);
      // console.log(dateUpper);
      var significantDays = StockPrices.find({
        company_name: company_name,
        token: token,
        date: {
          $gte: dateLower,
          $lte: dateUpper
        }
      }, {
        fields: {
          'cum_return': 1
        },
        sort: {
          cum_return: 1
        }
      }).fetch();
      // console.log(significantDays);
      if (significantDays !== undefined) {
        var hi = significantDays[Object.keys(significantDays)[Object.keys(significantDays).length - 1]].cum_return;
        var lo = significantDays[Object.keys(significantDays)[0]].cum_return;
        // console.log(hi);
        // console.log(lo);
        //fruitObject[Object.keys(fruitObject)[Object.keys(fruitObject).length - 1]] 
        var p = (hi - lo);
        // console.log(p);

        var significance = "Non-significant event";
        if (p > 0.02) {
          significance = "Significant event";
          guides.push({
            "fillAlpha": 0.30,
            "fillColor": "#ff6600",
            "lineColor": "#ff6600",
            "lineAlpha": 0.9,
            "label": topic,
            "balloonText": significance,
            "labelRotation": 90,
            "above": false,
            "date": dateLower,
            "toDate": dateUpper,
          });
        } else {
          guides.push({
            "fillAlpha": 0.30,
            "fillColor": "#666",
            "lineColor": "#666",
            "lineAlpha": 0.9,
            "label": topic,
            "balloonText": significance,
            "labelRotation": 90,
            "above": false,
            "date": dateLower,
            "toDate": dateUpper,
          });
        }
      }
    });



    var titleBig = "Stock Price of " + company_name;
    var titleSmall = topic + " events highlighted";

    var chart = AmCharts.makeChart("chartdiv", {
      type: "stock",
      "theme": "dark",
      "pathToImages": "/amcharts/images/",
      dataSets: [{
        // color: "#b0de09",
        fieldMappings: [{
          fromField: "flat_value",
          toField: "flat_value"
        }, {
          fromField: "cum_return",
          toField: "cum_return"
        }, {
          fromField: "customBullet",
          toField: "customBullet"
        }, {
          fromField: "customDescription",
          toField: "customDescription"
        }],
        dataProvider: stocks,
        "categoryField": "date",
        // "categoryAxis": {
        //   "parseDates": true,
        //   "axisColor": "#DADADA",
        //   "dashLength": 1,
        //   "minorGridEnabled": true
        // },
      }],


      panels: [{
        guides: guides,
        autoMargins: true,
        title: "Value",
        percentHeight: 70,
        "valueAxes": [{
          'id': "crAxis",
          "axisAlpha": 0.2,
          "dashLength": 1,
          "position": "left",
          'unit': "%",
          'unitPosition': 'right',
          "title": "Cumulative Return (%)",
        }, {
          "id": "priceAxis",
          "axisAlpha": 0.2,
          "dashLength": 1,
          // "labelsEnabled": true,
          "position": "right",
          'unit': "$",
          'unitPosition': 'left',
          "title": "Daily Stock Price Average ($)",
        }],

        stockGraphs: [{
          "id": "g1",
          "balloonText": "[[customDescription]]",
          // "balloonFunction": function(item, graph) {
          //   var result = graph.balloonText;
          //   for (var key in item.dataContext) {
          //     if (item.dataContext.hasOwnProperty(key) && !isNaN(item.dataContext[key])) {
          //       var formatted = AmCharts.formatNumber(item.dataContext[key], {
          //         precision: 5,
          //         decimalSeparator: chart.decimalSeparator,
          //         thousandsSeparator: chart.thousandsSeparator
          //       }, 2);
          //       result = result.replace("[[" + key + "]]", formatted);
          //     }
          //   }
          //   return result;
          // },
          //"bullet": "round",
          "customBulletField": "customBullet",
          "bulletSize": 30,
          //"bulletBorderAlpha": 1,
          //"bulletColor": "#FFFFFF",
          "lineColor": "#ff6600",
          // "hideBulletsCount": 50,
          "title": "Cumulative Return",
          "valueField": "cum_return",
          "lineThickness": 2,
          "valueAxis": "crAxis",
          "useLineColorForBulletBorder": true,
          "connect": true,
          "useDataSetColors": false,
        }, {
          "id": "g2",
          //"balloonText": "Daily Stock Price Average: $[[flat_value]]",
          "balloonText": "",
          // "balloonFunction": function(item, graph) {
          //   var result = graph.balloonText;
          //   for (var key in item.dataContext) {
          //     if (item.dataContext.hasOwnProperty(key) && !isNaN(item.dataContext[key])) {
          //       var formatted = AmCharts.formatNumber(item.dataContext[key], {
          //         precision: 5,
          //         decimalSeparator: chart.decimalSeparator,
          //         thousandsSeparator: chart.thousandsSeparator
          //       }, 2);
          //       result = result.replace("[[" + key + "]]", formatted);
          //     }
          //   }
          //   return result;
          // },
          "connect": true,
          "bullet": "none",
          "bulletBorderAlpha": 1,
          "bulletColor": "#FFFFFF",
          "hideBulletsCount": 50,
          "lineColor": "#45B29D",
          "title": "Daily Stock Price Average",
          "valueField": "flat_value",
          "valueAxis": "priceAxis",
          "useLineColorForBulletBorder": true,
          "useDataSetColors": false,
      }],

        stockLegend: {
          "equalWidths": false,
          "useGraphSettings": true,
          "valueAlign": "left",
          "valueWidth": 120,
          "valueFunction": function (item, text) {
            var value = parseFloat(text);
            return value.toFixed(5);
          },
        },
        "listeners": [{
          "event": "changed",
          "method": function (event) {
            $('#chartdiv3.related_news').find('ul li a').each(function () {
              $(this).css('background-color', '');
            });
            $('#chartdiv2').find('table.dividends-table tbody tr').each(function () {
              $(this).removeClass("info");
            });


            var idx = event.index;

            if (idx === undefined)
              return;



            var thisDate = event.chart.dataProvider[idx].date;

            console.log(thisDate);


            var news = RelatedNews.findOne({
              'date': thisDate,
              'company': company_name,
              'topic': topic
            });
            if (news != null) {
              var highlightHeadline = news.headline;
              $('#chartdiv3.related_news').find('ul li a').each(function () {
                var headline = $(this).html();
                if (headline == highlightHeadline) {
                  $(this).css({
                    'background-color': 'rgba(255,255,0,0.35',
                    'padding': '3px 5px'
                  });
                }
              });
            }

            var dividend = DividendHistory.findOne({
              date: thisDate,
              company: company_name
            });

            if (dividend != null) {
              $('#chartdiv2').find('table.dividends-table tbody tr td:first-child').each(function () {
                var dateString = $(this).html();
                var regex = /([0-9]{2})\-([0-9]{2})\-([0-9]{4})/;
                var matches = regex.exec(dateString);
                var newDate = new Date(Date.UTC(parseInt(matches[3]), parseInt(matches[2]) - 1, parseInt(matches[1]), 6));
                var dividendYear = dividend.date.getUTCFullYear();
                var dividendMonth = dividend.date.getUTCMonth();
                var dividendDate = dividend.date.getUTCDate();
                if (dividendYear == parseInt(matches[3]) && dividendMonth == parseInt(matches[2]) - 1 && dividendDate == parseInt(matches[1])) {
                  console.log("date found for dividend");
                  $(this).parent().addClass("info");
                }
              });
            }
          }
      }, {
          "event": "clickGraphItem",
          "method": function (event) {
            var idx = event.index;
            var itemDate = event.chart.dataProvider[idx].date;
            console.log('clicking on ' + itemDate);
            var news = RelatedNews.findOne({
              'date': itemDate,
              'company': company_name,
              'topic': topic
            });
            console.log(RelatedNews.find({}).fetch());
            if (news != null) {
              console.log('have news');
              var highlightHeadline = news.headline;
              $('#chartdiv3.related_news').find('ul li a').each(function () {
                var headline = $(this).html();
                if (headline == highlightHeadline) {
                  console.log('headline matched');
                  var url = $(this).attr('href');
                  window.open(url, '_blank');
                }
              });
            }
          }
      }],

    }],

      "chartScrollbar": {
        "autoGridCount": true,
        "graph": "g1",
        "scrollbarHeight": 40
      },
      "chartCursor": {
        "limitToGraph": "g1"
      },
      chartScrollbarSettings: {
        graph: "g1"
      },

      chartCursorSettings: {
        valueBalloonsEnabled: true,
        graphBulletSize: 1,
        valueLineBalloonEnabled: true,
        valueLineEnabled: true,
        valueLineAlpha: 0.5
      },

      categoryAxesSettings: {
        alwaysGroup: false,
        groupToPeriods: ["DD"],
      },

      valueAxesSettings: {
        inside: false,
      },

      periodSelector: {
        periods: [{
          period: "DD",
          count: 10,
          label: "10 days"
    }, {
          period: "MM",
          count: 1,
          label: "1 month"
    }, {
          period: "YYYY",
          count: 1,
          label: "1 year"
    }, {
          period: "YTD",
          label: "YTD"
    }, {
          period: "MAX",
          label: "MAX"
    }]
      },

      panelsSettings: {
        usePrefixes: true
      },
      "export": {
        "enabled": true
      },


    });

    //   var chart = AmCharts.makeChart("chartdiv2", {
    //       "type": "serial",
    //       "theme": "light",
    //       "pathToImages": "/amcharts/images/",
    //       "marginRight": 80,
    //       "autoMarginOffset": 20,
    //       "marginTop": 7,
    //       "legend": {
    //         "equalWidths": false,
    //         "useGraphSettings": true,
    //         "valueAlign": "left",
    //         "valueWidth": 120
    //       },
    //       // "stockEvents":[{
    //       //   "date": new Date(Date.UTC(2015, 3, 8)),
    //       //   "showOnAxis": true,
    //       //   "backgroundColor": "#85CDE6",
    //       //   "type": "pin",
    //       //   "text": "X",
    //       //   "graph": "g1",
    //       //   "description": "This is description of an event",
    //       // }],
    //       "dataProvider": stocksCustomBullet,
    //       "valueAxes": [{
    //         'id': "crAxis",
    //         "axisAlpha": 0.2,
    //         "dashLength": 1,
    //         "position": "left",
    //         'unit' : "%",
    //         'unitPosition': 'right',
    //         "title": "Cumulative Return (%)",

    //       },{
    //         "id": "priceAxis",
    //         "axisAlpha": 0.2,
    //         "dashLength": 1,
    //         // "labelsEnabled": true,
    //         "position": "right",
    //         'unit' : "$",
    //         'unitPosition': 'left',
    //         "title": "Daily Stock Price Average ($)",
    //       }],
    //       "mouseWheelZoomEnabled": false,
    //       "graphs": [{
    //         "id": "g1",
    //         "balloonText": "Cumulative Return: [[cum_return]]%",
    //         "balloonFunction": function(item, graph) {
    //           var result = graph.balloonText;
    //           for (var key in item.dataContext) {
    //             if (item.dataContext.hasOwnProperty(key) && !isNaN(item.dataContext[key])) {
    //               var formatted = AmCharts.formatNumber(item.dataContext[key], {
    //                 precision: 5,
    //                 decimalSeparator: chart.decimalSeparator,
    //                 thousandsSeparator: chart.thousandsSeparator
    //               }, 2);
    //               result = result.replace("[[" + key + "]]", formatted);
    //             }
    //           }
    //           return result;
    //         },
    //         //"bullet": "round",
    //         "customBulletField": "customBullet",
    //         "bulletSize": 30,
    //         //"bulletBorderAlpha": 1,
    //         //"bulletColor": "#FFFFFF",
    //         "lineColor": "#ff6600",
    //         // "hideBulletsCount": 50,
    //         "title": "Cumulative Return",
    //         "valueField": "cum_return",
    //         "lineThickness": 2,
    //         "valueAxis": "crAxis",
    //         "useLineColorForBulletBorder": true,


    //       },{
    //         "id": "g2",
    //         "balloonText": "Daily Stock Price Average: $[[flat_value]]",
    //         "balloonFunction": function(item, graph) {
    //           var result = graph.balloonText;
    //           for (var key in item.dataContext) {
    //             if (item.dataContext.hasOwnProperty(key) && !isNaN(item.dataContext[key])) {
    //               var formatted = AmCharts.formatNumber(item.dataContext[key], {
    //                 precision: 5,
    //                 decimalSeparator: chart.decimalSeparator,
    //                 thousandsSeparator: chart.thousandsSeparator
    //               }, 2);
    //               result = result.replace("[[" + key + "]]", formatted);
    //             }
    //           }
    //           return result;
    //         },
    //         "bullet": "none",
    //         "bulletBorderAlpha": 1,
    //         "bulletColor": "#FFFFFF",
    //         "hideBulletsCount": 50,
    //         "lineColor": "#45B29D",
    //         "title": "Daily Stock Price Average",
    //         "valueField": "flat_value",
    //         "valueAxis": "priceAxis",
    //         "useLineColorForBulletBorder": true,

    //       }],
    //       "chartScrollbar": {
    //           "autoGridCount": true,
    //           "graph": "g1",
    //           "scrollbarHeight": 40
    //       },
    //       // "ChartScrollbarSettings":{
    //       //   'position': 'bottom',
    //       // }
    //       "chartCursor": {
    //          "limitToGraph":"g1"
    //       },
    //       "categoryField": "date",
    //       "categoryAxis": {
    //           "parseDates": true,
    //           "axisColor": "#DADADA",
    //           "dashLength": 1,
    //           "minorGridEnabled": true
    //       },
    //       "export": {
    //           "enabled": true
    //       },
    //       "guides": guides,
    //       'titles': [
    //         {
    //           text: titleBig,
    //           bold: true,
    //         },
    //         {
    //           text: "This Event Study tool allows you to analyse the effect that each event has on the cumulative returns of a company.",
    //           bold: false,
    //         },
    //       ],
    //       "listeners": [{
    //         "event": "rollOverGraph",
    //         "method": function(event) {
    //           // if ( undefined === event.index)
    //           //   return;
    //           // console.log(event);

    //           // console.log(relatedNews);

    //           $('#chartdiv3.related_news').find('ul li a').each(function() {
    //             $(this).css('background-color','');
    //           });

    //           var idx = event.chart.chartCursor.index;
    //           var thisDate = event.chart.dataProvider[idx].date;

    //           var thisString = thisDate.getDate()+"-"+thisDate.getMonth()+"-"+thisDate.getFullYear();
    //           relatedNews.forEach(function(n){
    //             // console.log("thisDate: "+thisDate + " n.date: "+n.date);
    //             var dateString = n.date.getDate()+"-"+n.date.getMonth()+"-"+n.date.getFullYear();

    //             // if (thisDate.getDate() == n.date.getDate() && thisDate.getMonth() == n.date.getMonth() &&  thisDate.getFullYear() == n.date.getYear()){
    //             if (thisString == dateString){
    //               // console.log(n.headline);
    //               var highlightHeadline = n.headline;
    //               $('#chartdiv3.related_news').find('ul li a').each(function() {
    //                 var headline = $(this).html();
    //                 // console.log("Checking: "+headline);
    //                 // console.log("wanted headline: "+n.headline);
    //                 if (headline == highlightHeadline){
    //                   // console.log($(this));
    //                   $(this).css('background-color','yellow');
    //                 }
    //               });
    //             }
    //           });

    //         }
    //       }
    //       ],
    //     });

    Tracker.autorun(function () {

      chart.dataSets[0].dataProvider = [];
      // relatedNews = RelatedNews.find({company:company_name}).fetch();
      // dividendHistoryDates = DividendHistory.find({company: company_name}).fetch();
      stocks.forEach(function (c) {
        var newEntry = {
          'date': c.date,
          'cum_return': c.cum_return,
          'flat_value': c.flat_value
        };
        if (RelatedNews.find({
            'date': c.date,
            'company': company_name,
            'topic': topic
          }).count() > 0) {
          var matchingHeadline = RelatedNews.findOne({
            'date': c.date,
            'company': company_name,
            'topic': topic
          }).headline;
          //console.log(matchingHeadline);
          newEntry['customBullet'] = "/assets/img/news-icon.png";
          newEntry['customDescription'] = matchingHeadline;
          console.log('have news');
        }
        if (DividendHistory.find({
            'date': c.date,
            'company': company_name
          }).count() > 0) {
          var matchingDividend = DividendHistory.find({
            'date': c.date,
            'company': company_name
          }).price;
          newEntry['customBullet'] = "/assets/img/money-icon.png";
          newEntry['customDescription'] = "Ex-Dividend";
        }
        if (newEntry.flat_value == null)
          delete newEntry.flat_value;
        if (newEntry.cum_return == null)
          delete newEntry.cum_return;
        chart.dataSets[0].dataProvider.push(newEntry);
      });
      chart.validateData();
      console.log("validateData");
    });
  }

  function render_stock_topics_average_graph(company, upper_range, lower_range) {
    $('#chart-options').show();
    $('#topic-selection').show();
    $('#upper-window-selection').show();
    $('#lower-window-selection').show();
    $('#second-stock-selection').hide();


    var chartData = [];

    var all_topics = _.uniq(StockEvents.find({
      token: token
    }, {
      sort: {
        topic: 1
      },
      fields: {
        topic: true
      }
    }).fetch().map(function (x) {
      return x.topic
    }), true);

    all_topics.forEach(function (t) {
      var events = StockEvents.find({
        token: token,
        company_name: company,
        topic: t,
        value: {
          $gt: 0
        }
      }, {
        sort: {
          date: 1
        },
        fields: {
          date: true
        }
      }).fetch();

      var events_avg = 0;

      events.forEach(function (e) {
        var dateLower = new Date(e.date);
        dateLower.setDate(dateLower.getUTCDate() + lower_range);
        var dateUpper = new Date(e.date);
        dateUpper.setDate(dateUpper.getUTCDate() + upper_range);

        var days = StockPrices.find({
          company_name: company,
          token: token,
          date: {
            $gte: dateLower,
            $lte: dateUpper
          }
        }, {
          fields: {
            'cum_return': 1
          },
          sort: {
            date: 1
          }
        }).fetch();

        if (days.length > 0) {
          var cr_lower = days[0].cum_return;
          var cr_upper = days[days.length - 1].cum_return;
          events_avg += (cr_upper - cr_lower);
        }



      });

      events_avg = events_avg / events.length;

      chartData.push({
        topic: t,
        avg_cr: events_avg,
      });

    });

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
          //var color = ['#d64608', '#1d7865', '#ff9e1c', '#ff831e', '#ff6400', '#d64608', '#1d7865', '#ff9e1c', '#ff831e', '#ff6400'][x];
          var color = ["#334D5C", "#45B29D", "#EFC94C", "#E27A3F", "#DF5A49",
          "#334D5C", "#45B29D", "#EFC94C", "#E27A3F", "#DF5A49",
          "#334D5C", "#45B29D", "#EFC94C", "#E27A3F", "#DF5A49",
          "#334D5C", "#45B29D", "#EFC94C", "#E27A3F", "#DF5A49",
          "#334D5C", "#45B29D", "#EFC94C", "#E27A3F", "#DF5A49",
          "#334D5C", "#45B29D", "#EFC94C", "#E27A3F", "#DF5A49",
          "#334D5C", "#45B29D", "#EFC94C", "#E27A3F", "#DF5A49",
          "#334D5C", "#45B29D", "#EFC94C", "#E27A3F", "#DF5A49",
          "#334D5C", "#45B29D", "#EFC94C", "#E27A3F", "#DF5A49", ][x];

          chart.dataProvider[x][colorKey] = color;
        }
      }

    }, ["serial"]);


    var chart = AmCharts.makeChart("chartdiv2", {
      "type": "serial",
      "theme": "dark",
      "dataProvider": chartData,
      "valueAxes": [{
        "gridColor": "#000000",
        "gridAlpha": 0.3,
        "dashLength": 4,
        "title": "Cumulative Return (%)",
        "unit": "%",
        "unitPosition": "right",
    }],
      "gridAboveGraphs": true,
      "startDuration": 1,
      "graphs": [{
        "balloonText": "[[category]]: <b>[[value]]</b>",
        "fillAlphas": 0.8,
        "lineAlpha": 0.2,
        "type": "column",
        "valueField": "avg_cr",
        "autoColor": true,
    }],
      "chartCursor": {
        "categoryBalloonEnabled": false,
        "cursorAlpha": 0,
        "zoomable": false
      },
      "categoryField": "topic",
      "categoryAxis": {
        "gridPosition": "start",
        "gridAlpha": 0,
        'labelRotation': 40,
        'equalSpacing': true,
        "title": "Event Topics",
        // "tickPosition": "start",
        // "tickLength": 20
      },
      "titles": [{
        "text": "Average impact of each event-type on CR(%)",
        "bold": true,
      }],
      "export": {
        "enabled": true
      }

    });


  }

  function render_stock_topics_graph_significance_table(company, topic, upper_range, lower_range) {
    var dom = document.getElementById('chartdiv3');

    // console.log("render_stock_topics_graph_significance_table:"+upper_range+" "+lower_range);

    Blaze.render(Template.topics_sig_table, dom);

    var data = [];

    var dates = StockEvents.find({
      token: token,
      company_name: company,
      topic: topic,
      value: {
        $gt: 0
      }
    }, {
      sort: {
        date: 1
      },
      fields: {
        date: true
      }
    }).fetch();
    dates.forEach(function (d) {
      var dateLower = new Date(d.date);
      dateLower.setUTCDate(dateLower.getUTCDate() + lower_range);
      var dateUpper = new Date(d.date);
      dateUpper.setUTCDate(dateUpper.getUTCDate() + upper_range);

      var significantDays = StockPrices.find({
        company_name: company,
        token: token,
        date: {
          $gte: dateLower,
          $lte: dateUpper
        }
      }, {
        fields: {
          'cum_return': 1
        },
        sort: {
          cum_return: 1
        }
      }).fetch();
      if (significantDays !== undefined) {
        var hi = significantDays[Object.keys(significantDays)[Object.keys(significantDays).length - 1]].cum_return;
        var lo = significantDays[Object.keys(significantDays)[0]].cum_return;
        var p = (hi - lo);
        // console.log(p);
        data.push({
          date: d.date.toDateString(),
          p: p,
        });
      }
    });

    // populate table
    $('#sig_table tr:not(:first):not(:last)').remove();
    var html = '';
    var significance_threshold = 0.02;
    for (var i = 0; i < data.length; i++) {
      // console.log(data[i].p);
      if (data[i].p < significance_threshold)
        html += '<tr class=\"success\">';
      else if (data[i].p < significance_threshold * 2)
        html += '<tr class=\"warning\">';
      else
        html += '<tr class=\"danger\">';

      html += '<td>' + data[i].date + '</td><td>' + parseFloat(data[i].p).toFixed(8) + '&#37;</td></tr>';
    }
    $('#sig_table tr').first().after(html);
  }

  // predefined list of companies
  function render_company_details() {
    $('#chartdiv3').hide();
    $('#details').html('Loading details of ' + curr_company + '...');
    var all_company = _.uniq(StockPrices.find({}, {
      fields: {
        company_name: 1
      }
    }, {
      sort: {
        company_name: 1
      }
    }).fetch().map(function (x) {
      return x.company_name
    }), true);
    var num_companies = all_company.length;
    if (num_companies > 10) {
      $('#chartdiv2').css('height', '520');
    }
    var dom = document.getElementById('details');

    Meteor.call('scrapeSearch', curr_company, function (err, response) {
      // console.log(response);
      // console.log(err);
      if (response != null) {
        // market.theaustralian.com.au
        // key stats
        var regexKeyStats = /KEY STATS.*DETAILS\<\/h2\>/;
        var keyStats = response.match(regexKeyStats);
        // console.log("keyStats: " + keyStats);

        // details
        var regexDetails = /DETAILS\<\/h2\>.*OWNERS\<\/h2\>/;
        var details = response.match(regexDetails);
        // console.log("details: " + details);

        // grab what we want
        // description & company website
        var regexDescription = /\<div id="company\-description"\>.*\<div id="company\-website/;
        var descriptionRaw = String(details).match(regexDescription);
        var description = String(descriptionRaw).replace(/\<div id="company\-description"\>/, "").replace(/\<\/div\>\<div id="company\-website/, "");
        // console.log("description: " + description);

        var regexWebsite = /\<div id="company\-website.*\<\/section/;
        var websiteRaw = String(details).match(regexWebsite);
        var website = String(websiteRaw).replace(/\<div id="company\-website.*"\>/, "").replace(/\<\/a>.*/, "");
        // console.log("website: " + website);

        // tbody
        var regexTbody = /\<tbody\>.*\<\/tbody\>/;
        var tbodyRaw = String(keyStats).match(regexTbody);
        var tbody = String(tbodyRaw).replace(/\\n/g, "");
        // console.log(tbody);

        var descriptionFlag = false;
        var websiteFlag = false;
        var tableFlag = false;
        $('#details').html('');
        Blaze.render(Template.companyDetails, dom);

        if (website != '') {
          websiteFlag = true;
          $('#website').html("<a href=\'http://" + website + "\'>" + website + "<\a>");
          var bareWebsite = String(website).replace(/www\./, "");
          $('#logo').html('<img src="//logo.clearbit.com/' + bareWebsite + '">');
          var image = $('#logo img');
          image.onerror = function () {
            image.hide();
          };
        }
        if (description != '') {
          descriptionFlag = true;
          $('#description').html(description);
        }
        if (table != '') {
          tableFlag = true;
          $('#table').html('<table class=\"table table-striped\">' + tbody + '</table>');
        }
        if (!websiteFlag && !descriptionFlag && !tableFlag) {
          $('#details').html('We have no additional information about ' + curr_company + '.');
        }
        // console.log(website);
        // console.log(description);
        // console.log(tbody);
      } else {
        $('#details').html('We have no additional information about ' + curr_company + '.');
      }
    });
  }

  function render_dividends(company) {
    DividendHistory.remove({});
    $('#chartdiv2').html('<h4 style="padding: 5px 0 5px 5px;">Dividend history of ' + curr_company + '</h4><p style="padding-left: 5px">Loading...</p>');
    $('#chartdiv2').parent().removeClass();
    $('#chartdiv2').parent().addClass('col-md-8');

    $('#chartdiv3').parent().removeClass();
    $('#chartdiv3').parent().addClass('col-md-4');

    $('#chartdiv2').css({
      'height': '100%',
      'padding': '10px'
    });
    // $('#chartdiv2').html('<h4 style="padding: 5px 0 5px 5px;">Dividend history of ' + curr_company + '</h4>');

    Meteor.call('scrapeDividends', company, function (err, response) {
      // console.log(response);
      // console.log(err);
      if (response != null) {
        var regexTable = /<th>Ex-Dividend.*?<\/tbody><\/table>/;
        var table = response.match(regexTable);
        table = '<table class="table table-striped dividends-table"><thead>' + table;
        var tableNoBackslash = table.replace(/\\[a-zA-Z]/g, '');
        // console.log('      >> table is: ');
        // console.log(table);

        if ((curr_graph == 'event-study') && (curr_company == company)) {
          console.log("RENDERING");
          console.log(tableNoBackslash);
          console.log(tableNoBackslash == null);
          console.log(tableNoBackslash === '<table class="table table-striped dividends-table"><thead>null');
          if ((tableNoBackslash !== '<table class="table table-striped table-hover dividends-table"><thead>null') && (tableNoBackslash.length != 0)) {
            $('#chartdiv2').html('<h4 style="padding: 5px 0 5px 5px;">Dividend history of ' + curr_company + '. Courtesy of <div style="display: inline-block; background-color:grey; margin-left:10px;"><img src="/assets/img/dividend-icon.png" style="height:50px"></div></h4>' + tableNoBackslash);
          } else {
            $('#chartdiv2').html('<h4 style="padding: 5px 0 5px 5px;">Dividend history of ' + curr_company + '. Courtesy of <div style="display: inline-block; background-color:grey; margin-left:10px;"><img src="/assets/img/dividend-icon.png" style="height:50px"></div></h4><p style="padding-left:5px">No dividend data found.</p>');
          }
        } else {
          return;
        }
        $("td:empty").remove();
        // console.log($('#chartdiv2'));

        // populate the dividend history date collection, grab the date from the table
        // console.log("populating");
        $('#chartdiv2').find('table.dividends-table tbody tr td:first-child').each(function () {
          var dateString = $(this).html();
          var regex = /([0-9]{2})\-([0-9]{2})\-([0-9]{4})/;
          var matches = regex.exec(dateString);
          var newDate = new Date(Date.UTC(parseInt(matches[3]), parseInt(matches[2]) - 1, parseInt(matches[1]), 6));
          DividendHistory.insert({
            date: newDate,
            company: company,
          });
        });
      }
    });
  }

  function render_related_news(company, topic, d) {
    $('#chartdiv3').css('height', '500px');

    $('#chartdiv3').addClass('related_news');
    $('#chartdiv3').html('<h4 style="padding: 0 0 5px 5px;">News related to ' + curr_company + '. Courtesy of <div style="display: inline-block; background-color:grey; margin-left:10px;"><img style="height:20px" src="/assets/img/yahoo-icon.png"</div></h4>');
    RelatedNews.remove({});
    // date wanted
    var dom = document.getElementById('details');
    var year = d.getUTCFullYear();
    var month = padZero(d.getUTCMonth() + 1, 2);
    var date = d.getUTCDate();

    var dateFormated = year + "-" + month + "-" + date;
    // date format: YYYY-MM-DD
    Meteor.call('scrapeRelatedNews', company, dateFormated, function (err, response) {
      // console.log(response);
      // console.log(err);
      if (response != null) {
        var regexRaw = /<div class="mod yfi_quote_headline withsky.*<table width="100%"/
        var rawHeadlines = String(response).match(regexRaw);
        var headlines = String(rawHeadlines).replace(/<div class="mod yfi_quote_headline withsky"><ul class="yfncnhl newsheadlines"><\/ul>/, "").replace(/<\/cite><\/li><\/ul><table width="100%"/, "");
        // TODO: use .test() to see if headlines regex succeeds
        if (headlines) {
          // console.log(headlines);
          var headlinesNoBackslash = headlines.replace(/\\/g, '');

          // check if we haven't changed anything already in the span of scraping
          if ((curr_graph == 'event-study') && (curr_company == company)) {
            if (headlinesNoBackslash !== 'null') {
              $('#chartdiv3').append(headlinesNoBackslash);
            } else {
              $('#chartdiv3').html('<h4 style="padding: 0 0 5px 5px;">News related to ' + curr_company + '</h4><p style="padding-left:5px">No related news found for the current events.</p>');
              // $('#chartdiv3').append(headlines);
            }
          } else {
            return;
          }
          // TODO styling, change cite span's text to h3's text (to have year as well)


          $('#chartdiv3.related_news').find('h3').each(function () {
            var dateString = $(this).find('span').html();
            // console.log(dateString);
            var headlineObj = $(this).next().find('li a');
            // console.log(headlineObj);
            var headline = headlineObj.html();
            // console.log(headline);
            headlineObj.attr('target', '_blank'); // to open new tab instead of iframe

            var string2num = {
              'JAN': 1,
              'FEB': 2,
              'MAR': 3,
              'APR': 4,
              'MAY': 5,
              'JUN': 6,
              'JUL': 7,
              'AUG': 8,
              'SEP': 9,
              'OCT': 10,
              'NOV': 11,
              'DEC': 12,
              'JANUARY': 1,
              'FEBRUARY': 2,
              'MARCH': 3,
              'APRIL': 4,
              'JUNE': 6,
              'JULY': 7,
              'AUGUST': 8,
              'SEPTEMBER': 9,
              'OCTOBER': 10,
              'NOVEMBER': 11,
              'DECEMBER': 12
            }
            var regex = /([a-zA-Z]+),\ ([0-9][0-9]?)\ ([a-zA-Z]+)\ ([0-9]{4})/;
            var matches = regex.exec(dateString);
            if (matches == null) {
              var onlyForParsing = new Date(dateString);
              var year = onlyForParsing.getFullYear();
              var month = onlyForParsing.getMonth();
              var date = onlyForParsing.getDate();
            } else {
              var date = matches[2];
              var month = string2num[matches[3].toUpperCase()] - 1;
              var year = matches[4];
            }
            var newDate = new Date(Date.UTC(year, month, date, 6));
            // console.log(newDate);
            // console.log("parsing: "+headline);
            RelatedNews.insert({
              date: newDate,
              headline: headline,
              company: company,
              topic: topic,
            });
          });
          // console.log(relatedNews);
          $('#chartdiv3.related_news').find('h3').hide();

          // console.log("pushed");
          // console.log("related new returning: "+relatedNews);
          // return relatedNews;

          // aylien API, is article good or bad?
          var regex = /\<a href\=\"[^\<\>]*\"\>/g;
          var allLinks = headlinesNoBackslash.match(regex);
          allLinks.forEach(function (linkRaw) {
            // console.log('in loop');
            var linkMid = linkRaw.replace(/<a href="/, "").replace(/">/, "");
            var link = linkMid.replace(/.*\/\*/, "").replace(/\?.*/, "");

            // ====== [[[ TOGGLE AYLIEN HERE ]]] ======

            // Meteor.call('aylienApi', link, function(err, response) {
            //   console.log(response);
            //   // console.log(err);
            //   if (response != null) {
            //     var sentiment = JSON.parse(response.content).polarity;
            //     console.log(sentiment);
            //     if (sentiment == 'positive') {
            //       $('a[href="'+linkMid+'"]').css({'color': 'green', 'font-weight': '700', 'background-color': 'rgba(0, 255, 0, 0.1)'});
            //     } else if (sentiment == 'negative') {
            //       $('a[href="'+linkMid+'"]').css({'color': 'red', 'font-weight': '700', 'background-color' : 'rgba(255, 0, 0, 0.1)'});
            //     } else {
            //       console.log(link + ' is neutral or null');
            //     }
            //   }
            // });
          });
        } else {
          $('#chartdiv3').html('<h4 style="padding: 0 0 5px 5px;">News related to ' + curr_company + '</h4><p style="padding-left:5px">No related news found for the current events.</p>');
        }
      } else {
        $('#chartdiv3').html('<h4 style="padding: 0 0 5px 5px;">News related to ' + curr_company + '</h4><p style="padding-left:5px">No related news found for the current events.</p>');
      }
    });
  }


  function padZero(str, max) {
    str = str.toString();
    return str.length < max ? padZero("0" + str, max) : str;
  }

  function render_rrg(company) {
    var dom = document.getElementById('chartdiv');
    Session.set('company', company);
    Session.set('token', token);
    Blaze.render(Template.rrgMain, dom);

    $('#chartdiv2').show();
    $('#chartdiv2').parent().removeClass('col-md-7');
    $('#chartdiv2').parent().addClass('col-md-8');
    $('#chartdiv2').css('height', '100%');
    // $('#chartdiv2').css('margin', '0');
    var dom2 = document.getElementById('chartdiv2');
    Blaze.render(Template.rrgSymbols, dom2);
    console.log($('table.symbolgrid'));

    // $('#chartdiv3').show();
    // $('#chartdiv3').html('');
    // $('#chartdiv3').html('<h4 style="padding: 0 0 5px 5px;">Relative Rotation Graph - Courtesy of <img style="height:50px" src="/assets/img/stockchart-icon.png"</img></h4>');
    // $('#chartdiv3').parent().removeClass('col-md-5');
    // $('#chartdiv3').parent().addClass('col-md-4');
    // $('#chartdiv3').css('height', 370);

    $('#chartdiv2').css('padding', '50px 40px 20px 40px');
    // var dom3 = document.getElementById('chartdiv3');
    // Blaze.render(Template.rrgControls, dom3);
  }

  // [ this graph doesn't work, we're using render_regression_raw() ]
  // market change vs company change
  // can reference http://asxiq.com/statistical-rankings/end-of-day/top-stocks-ranked-by-beta/
  function render_regression_change(company) {
    $('#chartdiv2').parent().removeClass();
    $('#chartdiv2').parent().addClass('col-md-12');

    var company_prices = StockPrices.find({
      token: token,
      company_name: company,
      last: {
        $ne: null
      }
    }, {
      fields: {
        last: true,
        date: true,
        _id: false
      }
    }).fetch();

    var data = [];
    var prev_price = null;
    var prev_market = null;
    company_prices.forEach(function (entry) {
      var date = entry.date;
      var price = entry.last;
      var db_query = Market.findOne({
        date: date
      }, {
        fields: {
          value: true,
          _id: false
        }
      });
      if ((db_query != null) && (price != null)) {
        var market_price = parseFloat(db_query.value);
        if ((prev_price != null) && (prev_market != null)) {
          var company_momentum = ((price - prev_price) / prev_price) * 100;
          var market_momentum = ((market_price - prev_market) / prev_market) * 100;

          console.log('prev: ' + prev_price + ' price: ' + price + ' prevm: ' + prev_market + ' mark: ' + market_price + ' date: ' + date);
          console.log('markmom: ' + market_momentum + ' compmom: ' + company_momentum);
          data.push([market_momentum, company_momentum]);
        }
        prev_price = price;
        prev_market = market_price;
      }
    });
    // console.log("DONE");
    if (curr_graph == 'volatility') {
      drawGraph(data);
    }

    function drawGraph(data) {
      $('#chartdiv2').highcharts({
        chart: {
          type: 'scatter',
          zoomType: 'xy'
        },
        title: {
          text: 'Regression of ' + company,
        },
        subtitle: {
          text: 'Compared to ASX 300'
        },
        xAxis: {
          title: {
            enabled: true,
            text: 'ASX 300 Daily Price Return Change (%)'
          },
          startOnTick: true,
          endOnTick: true,
          showLastLabel: true
        },
        yAxis: {
          title: {
            text: 'Company Daily Price Change (%)'
          }
        },
        legend: {
          layout: 'vertical',
          align: 'left',
          verticalAlign: 'top',
          x: 100,
          y: 70,
          floating: true,
          backgroundColor: '#FFFFFF',
          borderWidth: 1
        },
        plotOptions: {
          scatter: {
            marker: {
              radius: 5,
              states: {
                hover: {
                  enabled: true,
                  lineColor: 'rgb(100,100,100)'
                }
              }
            },
            states: {
              hover: {
                marker: {
                  enabled: false
                }
              }
            },
            tooltip: {
              headerFormat: '<b>{series.name}</b><br>',
              pointFormat: 'Market: {point.x}%, Company: {point.y}%'
            }
          }
        },
        series: [{
          regression: true,
          regressionSettings: {
            type: 'linear',
            color: 'rgba(223, 83, 83, .9)'
          },
          name: 'Daily',
          color: 'rgba(223, 83, 83, .5)',
          data: data
        }]
      });
    }
  }

  // market index vs company cr
  function render_regression_raw(company) {
    $('#chartdiv4').parent().show();
    $('#chartdiv4').show();

    var data_query = Regressions.findOne({
      token: token,
      company: company
    }, {
      fields: {
        data: true,
        _id: false
      }
    });
    console.log(data_query);
    var data = [];
    if ((data_query != null) && (data_query.length != 0)) {
      console.log('Cached data loaded');
      data = data_query.data;
      // console.log("DATA:");
      // console.log(data);
    } else {
      console.warn("Regression cache for " + company + " has no data! Slow manual pulling starting.");
      var company_prices = StockPrices.find({
        token: token,
        company_name: company,
        cum_return: {
          $ne: null
        }
      }, {
        fields: {
          cum_return: true,
          date: true,
          _id: false
        }
      }).fetch();

      var prev_price = null;
      var prev_market = null;
      company_prices.forEach(function (entry) {
        var date = entry.date;
        var price = entry.cum_return;
        var db_query = Market.findOne({
          date: date
        }, {
          fields: {
            value: true,
            _id: false
          }
        });
        if ((db_query != null) && (price != null)) {
          var market_price = parseFloat(db_query.value);
          //console.log('cr: ' + price + ', market: ' + market_price + ', date: ' + date);
          data.push([market_price, price]);
        }
      });
    }

    drawGraph(data);

    function drawGraph(data) {
      $('#chartdiv4').highcharts({
        chart: {
          type: 'scatter',
          zoomType: 'xy'
        },
        title: {
          text: 'Regression of ' + company
        },
        subtitle: {
          text: 'Compared to ASX 300'
        },
        xAxis: {
          title: {
            enabled: true,
            text: 'ASX 300 Price Return'
          },
          startOnTick: true,
          endOnTick: true,
          showLastLabel: true
        },
        yAxis: {
          title: {
            text: 'Company Cumulative Return (%)'
          }
        },
        // legend: {
        //   layout: 'vertical',
        //   align: 'left',
        //   verticalAlign: 'top',
        //   x: 100,
        //   y: 70,
        //   floating: true,
        //   backgroundColor: '#FFFFFF',
        //   borderWidth: 1
        // },
        options: {
          legend: {
            enabled: false
          },
        },
        plotOptions: {
          scatter: {
            marker: {
              radius: 5,
              states: {
                hover: {
                  enabled: true,
                  lineColor: 'rgb(100,100,100)'
                }
              }
            },
            states: {
              hover: {
                marker: {
                  enabled: false
                }
              }
            },
            tooltip: {
              headerFormat: '<b>{series.name}</b><br>',
              pointFormat: 'Market: {point.x}, Company: ${point.y}'
            }
          }
        },
        series: [{
          regression: true,
          regressionSettings: {
            type: 'linear',
            color: 'rgba(223, 83, 83, .9)'
          },
          name: 'Daily',
          color: 'rgba(223, 83, 83, .5)',
          data: data
        }]
      });
    }
  }

  function render_mini_company_chart(company) {
    var stocksPrice = StockPrices.find({
      company_name: company,
      token: token
    }, {
      fields: {
        cum_return: true,
        date: true
      },
      sort: {
        date: -1
      },
      limit: 20
    }).fetch();
    console.log(stocksPrice);
    var last_cr = parseFloat(stocksPrice[0].cum_return);
    var first_cr = parseFloat(stocksPrice[stocksPrice.length - 1].cum_return);
    var percent = (last_cr - first_cr) / Math.abs(first_cr);
    console.log(last_cr);
    console.log(first_cr);
    $('#miniGraph-init-value').html(first_cr.toFixed(2) + "%");
    percent = percent.toFixed(2);
    $('#miniGraph-final-percent-changed').removeClass('text-success');
    $('#miniGraph-final-percent-changed').removeClass('text-danger');
    if (percent > 0) {
      $('#miniGraph-final-percent-changed').html('+' + percent + "%");
      $('#miniGraph-final-percent-changed').addClass('text-success');
    } else if (percent == 0) {
      $('#miniGraph-final-percent-changed').html(percent + "%");
      $('#miniGraph-final-percent-changed').addClass('text-success');
    } else {
      $('#miniGraph-final-percent-changed').html(percent + "%");
      $('#miniGraph-final-percent-changed').addClass('text-danger');

    }
    $('#miniGraph-title').html('CR of last 20 days on ' + company);

    var chartData = [];
    stocksPrice.forEach(function (e) {
      chartData.push({
        date: e.date,
        value: e.cum_return,
      });
    });
    chartData.reverse();
    console.log(chartData);

    var chart = AmCharts.makeChart("miniGraph", {
      "type": "serial",
      "theme": "dark",
      "dataProvider": chartData,
      "valueAxes": [{
        "axisAlpha": 0,
        "gridAlpha": 0,
        labelsEnabled: false,
      }],
      "graphs": [{
        "id": "g1",
        "lineColor": "#637bb6",
        "lineThickness": 2,
        "negativeLineColor": "#F47C3C",
        "type": "line",
        "valueField": "value"
      }],
      "categoryField": "date",
      "categoryAxis": {
        // parseDates: true,
        gridAlpha: 0,
        axisAlpha: 0,
        startOnAxis: true,
        labelsEnabled: false,
      },
    });
  }

  function render_main_chart_title(company, topic, chart_name) {
    // NOTE: styling is in styling.css
    var main_title = $('#main-chart-main-title');
    var sub_title = $('#main-chart-sub-title');
    switch (chart_name) {
    case 'overview':
      main_title.html("Overview");
      sub_title.html("Abstract view of one or two companies to help consolidate basic information from other analysis tools.");
      break;
    case 'candlesticks':
      main_title.html("Breakdown of " + company);
      sub_title.html("This tool uses a candlestick chart to show the price movements in your selected stock. A company profile is also available alongside the 30-Day Rankings chart.");
      break;
    case 'volatility':
      main_title.html("Volatility Analysis for " + company);
      sub_title.html("This tool is designed to help you understand the risks and rewards ascociated with investing in certain stocks.");
      break;
    case 'event-study':
      main_title.html("Event Study for " + company);
      sub_title.html("Individual events are highlighted vertically, change event-type with the dropdown menu. Relevant news articles and dividends paid are also placed along the cumulative-returns line as icons.");
      break;
    case 'stock-topic':
      main_title.html("Reaction Profile for " + company);
      sub_title.html("This tool gives you an idea on how companies react to certain events and what time-window they react in. A linear regression model also shows you the relationship(beta) between the company's CR and market movements.");
      break;
    case 'rrg':
      main_title.html("Performance Benchmark relative to " + company);
      sub_title.html("Compare relative strength in combination with momentum indicators to show whether other companies are leading, improving, weakening or lagging.");
      break;
    default:
      main_title.html('');
      sub_title.html('');
      break;
    }
  }
};