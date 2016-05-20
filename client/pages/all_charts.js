import { Meteor } from 'meteor/meteor';

Template.chart.rendered = function() {
  $('.selectpicker').selectpicker();
  $('#chart-options').hide();

  $('a[href="http://www.amcharts.com/javascript-charts/"').hide();

  var token = Router.current().params.token;
  $('#token-input').attr('placeholder',token);
  $('#token-input').on('input',function(){
    var t = $(this).val();
    Router.go('/chart/'+t);
  });
  var validToken = false;
  
  var curr_graph = 'volatility';
  var curr_company = "TGR.AX";
  var second_company = "AAC.AX";
  var curr_topic = "Cash Rate";
  var curr_upper = 5;
  var curr_lower = -5;

  Meteor.call('checkToken',token, function(err, response) {
    validToken = response;
    if (validToken) {
      $('ul.nav-tabs li a#'+curr_graph).parent().addClass('active');

      // initialise the correct first company

      var company = StockPrices.findOne({token: token}, {fields:{company_name:1}, sort:{company_name: 1}});
      curr_company = company.company_name;
      // console.log(curr_company);
      renderMainGraph();
    } else {
      alert("invalid token");
      Router.go('/');
    }
  });

  // control the tabs
  $('ul.nav-tabs li a').on('click', function() {
    var currentTab = $(this);
    var tabId = currentTab.attr('id');
    $('ul.nav-tabs li').removeClass('active');
    if (tabId == 'candlesticks') {
      curr_graph = 'candlesticks';
    } else if (tabId == 'volatility') {
      curr_graph = 'volatility';
    } else if (tabId == 'event-study') {
      curr_graph = 'event-study';
    } else if (tabId == 'stock-topic') {
      curr_graph = 'stock-topic';
    }
    renderMainGraph();
    currentTab.parent().addClass('active');
  });

  // selector to switch between the stocks and topics
  var choose_main_stock = $('#choose-main-stock');
  var choose_second_stock = $('#choose-second-stock');
  var choose_topic = $('#choose-topic');

  // populate the two stock selector
  var all_company = _.uniq(StockPrices.find({}, {fields:{company_name:1}},{sort:{company_name: 1}}).fetch().map(function(x){return x.company_name}),true);
  choose_main_stock.empty();
  choose_second_stock.empty();
  all_company.forEach(function(c){
    choose_main_stock.append("<option>"+c+"</option>");
    choose_second_stock.append("<option>"+c+"</option>");
  });
  choose_main_stock.selectpicker('refresh');
  choose_second_stock.selectpicker('refresh');

  // populate the topic selector
  var all_topics = _.uniq(StockEvents.find({token:token},{sort:{topic:1},fields:{topic:true}}).fetch().map(function(x){return x.topic}),true);
  choose_topic.empty();
  all_topics.forEach(function(c){
    choose_topic.append("<option>"+c+"</option>");
  });
  choose_topic.selectpicker('refresh');


  // render the whole page with the current setting
  function renderMainGraph() {
    $('#chart-options').hide();
    $('#chartdiv2').hide();
    $('#chartdiv3').hide();
    $('#details').hide();
    $('#chartdiv2').html('');
    $('#chartdiv3').html('');
    $('#details').html('');
    if (curr_graph == "candlesticks"){
      $('#chartdiv2').show();
      $('#details').show();
      render_candlestick_graph(curr_company);
      render_company_details();
      render_company_chart();
    } else if (curr_graph == 'volatility'){
      render_volatility_chart(curr_company);
    } else if (curr_graph == 'event-study'){
      $('#chartdiv2').show();
      $('#chartdiv3').show();
      render_related_news();
      render_events_chart(curr_company, curr_topic, curr_upper, curr_lower);
    } else if (curr_graph == 'stock-topic'){
      $('#chartdiv2').show();
      $('#chartdiv3').show();
      render_stock_vs_topic_graph(curr_company, curr_topic, curr_upper, curr_lower);
      render_stock_topics_average_graph(curr_company,curr_upper,curr_lower);
      render_stock_topics_graph_significance_table(curr_company, curr_topic, curr_upper, curr_lower);
    }
  }


  // listen to the upper window input
  $('#choose-upper-window').on('change',function(){
    curr_upper = $(this).val();
    // console.log("upper: "+curr_upper);
    renderMainGraph();
  });

  // listen to the lower window input
  $('#choose-lower-window').on('change',function(){
    curr_lower = $(this).val();
    // console.log("lower: "+curr_lower);
    renderMainGraph();
  });

  // listen to the main stock selector input
  choose_main_stock.on('change',function(){
    var c = $(this).val();
    curr_company = c;
    console.log(c);
    render_company_details();
    renderMainGraph();
  });

  // listen to the second stock selector input
  choose_second_stock.on('change',function(){
    var c = $(this).val();
    second_company = c;
    console.log("second_company: "+second_company);
  });

  // listen to the topic selector input
  choose_topic.on('change', function(){
    var t = $(this).val();
    curr_topic = t;
    renderMainGraph();
  });


  function render_volatility_chart (company) {
    $('#chart-options').show();
    $('#topic-selection').hide();
    $('#upper-window-selection').hide();
    $('#lower-window-selection').hide();
    // $('#second-stock-selection').show();

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


    var prices = StockPrices.find({token:token, company_name: company, flat_value: {$ne: null}},{fields:{date:true, flat_value: true}}).fetch();

    var stock_prices = [];
    prices.forEach(function(p){
      stock_prices.push({
        time: p.date,
        price: p.flat_value,
      });
    });

    var sma = [];
    var avg = 0;
    var currPrice = 0;
    var prevPrice = 0;

    //calculate standard deviation
    var toDoList = []; //array of arrays of values [[1,2],[2,3],[9,10]]
    currPrice = prevPrice = 0;

    for(var i = 0; i<(stock_prices.length); i++) {
      var currArray = [];
      if (i < 29) {
        //currArray.push(stock_prices[i].price);
      } 
      for(var x = 0; x<30; x++) {
          if (i>=29) {
            currArray.push(stock_prices[i-x].price);
          }
      }
      if (i > 29) {
        toDoList.push({"currArray": currArray, "time": stock_prices[i-30].time, "price": stock_prices[i].price});
      }
    // console.log(toDoList);
    }
    toDoList.forEach(function (c){
      var result = standardDeviation(c.currArray);
      var entry = {"time": c.time, "price": c.price, "mAvg": result[1], "sdUpper": ((result[0]*2)+result[1]), "sdLower": (result[1]-(result[0]*2)), "sd": result[0]};
      // console.log(entry);
      sma.push(entry);
    });

    drawGraph(sma,company);



    function standardDeviation(values){
      var avg = average(values);
      
      var squareDiffs = values.map(function(value){
        var diff = value - avg;
        var sqrDiff = diff * diff;
        return sqrDiff;
      });
      
      var avgSquareDiff = average(squareDiffs);

      var stdDev = Math.sqrt(avgSquareDiff);
      var result = [stdDev, avg];
      return result;
    }

    function average(data){
      var sum = 0;
      for(var i = 0; i<data.length; i++) {
        sum = sum + data[i];
      }

      var avg = sum / data.length;
      return avg;
    }

    function drawGraph(sma,company) {

      var chart = AmCharts.makeChart( "chartdiv", {
        "type": "stock",
        "theme": "light",
        "pathToImages": "/amcharts/images/",
        "autoMarginOffset": 20,
        "marginRight": 80,
        "titles": [{
          "text": "Volatility for "+ company,
          "bold": true
        },
        {
          "text": "This Volatility-Analysis tool allows you to determine the dispersion a stock price has around its average.",
          "bold": false
        }, 
        {
          "text": "This gives you an idea on the risk and reward of investing, as well as help vistually understand how unstable a stock is.",
          "bold": false
        }],
        

        "dataSets": [ {
          "fieldMappings": [ {
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
          },{
            "fromField": "sd",
            "toField": "sd"
          }],
          "color": "orange",
          "dataProvider": sma,
          // "title": "West Stock",
          "categoryField": "time"
        }, 
        // {
        //   "fieldMappings": [ {
        //     "fromField": "sd",
        //     "toField": "sd"
        //   } ],
        //   // "color": "blue",
        //   "dataProvider": sma,
        //   "compared": true,
        //   // "title": "East Stock",
        //   "categoryField": "time"
        // } 
        ],


        "panels": [ {
          "title": "Volatility",
          "percentHeight": 30,
          "marginTop": 1,
          "showCategoryAxis": true,
          "percentHeight": 70,
          "valueAxes": [ {
            "id": "v1",
            "gridColor": "#000000",
            "gridAlpha": 0.2,
            "dashLength": 10,
            "title": "Stock Price ($)",
          } ],
          "categoryField": "time",
            "categoryAxis": {
              "parseDates": true,
              "position":"top",
              "gridPosition": "middle",

              "gridAlpha": 0.2,
              "dashLength": 10,
              "title": "Time (Days)"
            },

            "stockGraphs": [{
              "id": "priceGraph",
              "balloonText": "Price: <b>[[price]]</b><br>Upper Band: <b>[[sdUpper]]</b><br>SMA(30): <b>[[mAvg]]</b><br>Lower Band: <b>[[sdLower]]</b>",
              "balloonFunction": function(item, graph) {
                var result = graph.balloonText;
                for (var key in item.dataContext) {
                  if (item.dataContext.hasOwnProperty(key) && !isNaN(item.dataContext[key])) {
                    var formatted = AmCharts.formatNumber(item.dataContext[key], {
                      precision: chart.precision,
                      decimalSeparator: chart.decimalSeparator,
                      thousandsSeparator: chart.thousandsSeparator
                    }, 2);
                    result = result.replace("[[" + key + "]]", formatted);
                  }
                }
                return result;
              },
              // "bullet": "round",
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
              //"labelText": "Stock Price"
              "useDataSetColors":false,
            }, {
              "id": "smaGraph",
              //"balloonText": "SMA(30): <b>[[value]]</b>",
              "showBalloon": false,
              "fillAlphas": 0,
              "lineAlpha": 0.8,
              "lineThickness": 2,
              "type": "line",
              "dashLength": 4,
              "lineColor": "#0077aa",
              "valueField": "mAvg",
              "title": "Bollinger Bands",
              "labelPosition": "right",
              "labelFunction": labelFunction,
              "labelText": "SMA(30)",
              "useDataSetColors":false,
            }, {
              "id": "sdUpperGraph",
              //"balloonText": "Upper Band: <b>[[value]]</b>",
              "showBalloon": false,
              "fillAlphas": 0.3,
              "fillColors": ["#ffa31a"],
              "lineAlpha": 0,
              "type": "line",
              "fillToGraph": "sdLowerGraph",
              "valueField": "sdUpper",
              "title": "UpperBand",
              "visibleInLegend": false,
              "labelPosition": "right",
              "labelFunction": labelFunction,
              "useDataSetColors":false,
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
              "useDataSetColors":false,
              //"labelText": "Lower Band"
            }, {

            }],

            "stockLegend": {
              // "valueTextRegular": undefined,
              // "periodValueTextComparing": "[[percents.value.close]]%"
              "equalWidths": false,
              //"periodValueText": "total: [[value.sum]]",
              "position": "top",
              "valueAlign": "left",
              "valueWidth": 100,
              "clickMarker": handleLegendClick,
              "clickLabel": handleLegendClick

            }
          },

          {
            "title": "Standard Deviation",
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
              "valueField": "sd",
              "type": "line",
              "showBalloon": false,
              "fillAlphas": 0,
              "lineColor": "#ff6600",
              "useDataSetColors":false,
            } ],

            "stockLegend": {
              "markerType": "none",
              "markerSize": 0,
              "labelText": "",
              "periodValueTextRegular": "[[sd]]"
            }
          }
        ],

        "chartScrollbarSettings": {
          "graph": "priceGraph",
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
        },
        "listeners": [{
          "event": "init",
          "method": function(event) {
            //var end = new Date(); // today
            //var start = new Date(end);
            //start.setDate(end.getDate() - 10);
            // event.chart.zoomToIndexes(event.chart.dataProvider.length - 80, event.chart.dataProvider.length - 1);
            // var graph = event.chart.getGraphById("priceGraph");
            // graph.bullet = "round";
          }
        },{
          "event": "zoomed",
          "method": function(event) {
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

    function handleLegendClick( graph ) {
      var chart = graph.chart;
      var hidden = graph.hidden;
      if (graph.id == 'priceGraph') {
        if (hidden) {
          chart.showGraph(chart.graphs[0]);
        } else {
          chart.hideGraph(chart.graphs[0]);
        }
      } else {
        if (hidden) {
          chart.showGraph(chart.graphs[1]);
          chart.showGraph(chart.graphs[2]);
          chart.showGraph(chart.graphs[3]);
        } else {
          chart.hideGraph(chart.graphs[1]);
          chart.hideGraph(chart.graphs[2]);
          chart.hideGraph(chart.graphs[3]);
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


  function render_stock_vs_topic_graph (company, topic, upper_range, lower_range) {
    $('#chart-options').show();
    $('#second-stock-selection').hide();

    var chartData = [];

    // var all_topics = _.uniq(StockEvents.find({token:token},{sort:{topic:1},fields:{topic:true}}).fetch().map(function(x){return x.topic}),true);

    // var dates = _.uniq(StockEvents.find({token:token,company_name: company, topic: topic, value: {$gt: 0}},{sort:{date:1},fields: {date: true}}).fetch().map(function(x){return x.date}),true);

    var events = StockEvents.find({token:token,company_name: company, topic: topic, value: {$gt: 0}},{sort:{date:1},fields: {date: true}}).fetch();


    var graphs = [];
    var graphsReady = false;


    for (var date = lower_range; date <= upper_range; date++) {
      var entry = {date: date};
      events.forEach(function (e) {
        var currDate = new Date(e.date.getTime());
        currDate.setDate(e.date.getDate()+date);
        var cr = StockPrices.findOne({token: token, company_name: company, date: currDate},{fields:{cum_return:true}});
        if (cr === undefined)
          cr = null;
        else
          cr = cr.cum_return;
        entry[e.date.toDateString()] = cr;

        if(!graphsReady){
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

    drawGraph(chartData,graphs,company,topic);



    function drawGraph (chartData,graphs,company, topic) {



      var chartOptions = {
          "type": "serial",
          "theme": "light",
          "legend": {
              "useGraphSettings": true,
              "valueText": '',
          },
          "titles":[{
            "text": "Individual "+topic+" events for "+company,
            "size": 15
          },
          {
            "text": "By comparing individual event-windows we can determine how companies can expect to react to certain event types",
            "bold": false
          }],
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
              "title": "Cumulative Return (%)"
              // 'recalculateToPercents' : true,
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
    }
  }




  function render_candlestick_graph (company_name) {
    var chartData = [];
    var stockPrices = StockPrices.find({company_name: company_name, token: token, 'open': {$ne : null}}, {fields: {'date':1, 'open':1, 'last':1, 'high':1, 'low':1, 'volume':1, 'flat_value':1}}).fetch();
    drawGraph(stockPrices,company_name);

    function drawGraph(chartData,company) {


      var chart = AmCharts.makeChart( "chartdiv", {
        "type": "stock",
        "theme": "light",
        "pathToImages": "/amcharts/images/",
        "titles":[{
          "text": "Candlestick graph for "+company,
          "size": 15
        }],
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
          "color": "#ff6600",
          "dataProvider": chartData,
          "title": "Candlestick",
          "categoryField": "date"
        }, {
          "fieldMappings": [ {
            "fromField": "flat_value",
            "toField": "value"
          } ],
          "color": "#0077aa",
          "lineColor": "#0077aa",
          "dataProvider": chartData,
          "compared": true,
          "title": "Line",
          "categoryField": "date"
        } ],


        "panels": [ {
          "title": "Stock Price",
          "showCategoryAxis": false,
          "percentHeight": 70,
          "valueAxes": [ {
            "id": "v1",
            "dashLength": 5,
            "title": "Stock Price ($)",
            "unit": "$",
            'unitPosition' : "left",
          } ],

          "categoryAxis": {
            "dashLength": 5,
            "title": "Day"
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
            "negativeLineColor": "#ff6600",
            "negativeFillColors": "#ff6600",
            "fillAlphas": 1,
            "useDataSetColors": false,
            // "comparable": true,
            // "compareField": "value",
            "showBalloon": true,
            "proCandlesticks": true,
            "title": "Candle Stick",
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
            "title": "Average Price",
          }],

          "stockLegend": {
            // "valueTextRegular": undefined,
            // "periodValueTextComparing": "[[value.close]]%"
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
          "periods": [ {
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
          } ]
        },
        "export": {
          "enabled": true
        }
      });
    }
  }

  function render_company_chart() {
    var c_cr = [];
    var all_company = _.uniq(StockPrices.find({token:token}, {fields:{company_name:1, _id:0},sort:{company_name: 1}}).fetch().map(function(x){return x.company_name}),true);

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
             "#334D5C", "#45B29D", "#EFC94C", "#E27A3F", "#DF5A49",][x];

            chart.dataProvider[x][colorKey] = color;
          }
        }

      }, ["serial"]);

      var chart = new AmCharts.AmSerialChart();
      chart.dataProvider = chartData;
      chart.categoryField = "company_name";
      //      chart.startDuration = 1;
      chart.startEffect = "elastic";
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
    $('#chart-options').show();
    $('#second-stock-selection').show();


    var stocks = StockPrices.find({company_name: company_name, token:token}, {fields: {'date':1, 'cum_return':1, 'flat_value':1}}).fetch();
    var chartData = [];
    var guides = [];

    // events
    var events = StockEvents.find({token: token, company_name: company_name, topic: topic, value: {$gt : 0}}, {fields: {'date':1}}).fetch(); 
    // console.log(events);

    events.forEach(function(c) {
      var dateLower = new Date(c.date);
      dateLower.setDate(dateLower.getDate() + lower_range);
      var dateUpper = new Date(c.date);
      dateUpper.setDate(dateUpper.getDate() + upper_range);

      // console.log(c.date);
      // console.log(dateLower);
      // console.log(dateUpper);
      var significantDays = StockPrices.find({company_name: company_name, token:token, date: {$gte : dateLower, $lte : dateUpper}}, {fields: {'cum_return':1}, sort: {cum_return:1}}).fetch();
      console.log(significantDays);
      if (significantDays !== undefined) {
        var hi = significantDays[Object.keys(significantDays)[Object.keys(significantDays).length - 1]].cum_return;
        var lo = significantDays[Object.keys(significantDays)[0]].cum_return;
        // console.log(hi);
        // console.log(lo);
        //fruitObject[Object.keys(fruitObject)[Object.keys(fruitObject).length - 1]] 
        var p = (hi - lo);
        console.log(p);

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
            "above": true,
            "date": dateLower,
            "toDate": dateUpper,
          });
        } else {
          guides.push({
            "fillAlpha": 0.30,
            "fillColor": "#ff0000",
            "lineColor": "#ff0000",
            "lineAlpha": 0.9,
            "label": topic,
            "balloonText": significance,
            "labelRotation": 90,
            "above": true,
            "date": dateLower,
            "toDate": dateUpper,
          });
        }
      }
    });

    drawGraph(stocks, guides);

    function drawGraph(chartData, guides) {
      // console.log(guides);
      var titleBig = "Stock Price of " + company_name;
      var titleSmall = topic + " events highlighted";
      var chart = AmCharts.makeChart("chartdiv", {
        "type": "serial",
        "theme": "light",
        "pathToImages": "/amcharts/images/",
        "marginRight": 80,
        "autoMarginOffset": 20,
        "marginTop": 7,
        "legend": {
          "equalWidths": false,
          "useGraphSettings": true,
          "valueAlign": "left",
          "valueWidth": 120
        },
        "dataProvider": chartData,
        "valueAxes": [{
          'id': "crAxis",
          "axisAlpha": 0.2,
          "dashLength": 1,
          "position": "left",
          'unit' : "%",
          'unitPosition': 'right',
          "title": "Cumulative Return (%)",

        },{
          "id": "priceAxis",
          "axisAlpha": 0.2,
          "dashLength": 1,
          // "labelsEnabled": true,
          "position": "right",
          'unit' : "$",
          'unitPosition': 'left',
          "title": "Daily Stock Price Average ($)",
        }],
        "mouseWheelZoomEnabled": false,
        "graphs": [{
          "id": "g1",
          "balloonText": "Cumulative Return: [[cum_return]]%",
          "balloonFunction": function(item, graph) {
            var result = graph.balloonText;
            for (var key in item.dataContext) {
              if (item.dataContext.hasOwnProperty(key) && !isNaN(item.dataContext[key])) {
                var formatted = AmCharts.formatNumber(item.dataContext[key], {
                  precision: 5,
                  decimalSeparator: chart.decimalSeparator,
                  thousandsSeparator: chart.thousandsSeparator
                }, 2);
                result = result.replace("[[" + key + "]]", formatted);
              }
            }
            return result;
          },
          "bullet": "round",
          "bulletBorderAlpha": 1,
          "bulletColor": "#FFFFFF",
          "hideBulletsCount": 50,
          "title": "Daily Stock Price Average",
          "valueField": "cum_return",
          "valueAxis": "crAxis",
          "useLineColorForBulletBorder": true,


        },{
          "id": "g2",
          "balloonText": "Daily Stock Price Average: $[[flat_value]]",
          "balloonFunction": function(item, graph) {
            var result = graph.balloonText;
            for (var key in item.dataContext) {
              if (item.dataContext.hasOwnProperty(key) && !isNaN(item.dataContext[key])) {
                var formatted = AmCharts.formatNumber(item.dataContext[key], {
                  precision: 5,
                  decimalSeparator: chart.decimalSeparator,
                  thousandsSeparator: chart.thousandsSeparator
                }, 2);
                result = result.replace("[[" + key + "]]", formatted);
              }
            }
            return result;
          },
          "bullet": "round",
          "bulletBorderAlpha": 1,
          "bulletColor": "#FFFFFF",
          "hideBulletsCount": 50,
          "title": "Cumulative Return",
          "valueField": "flat_value",
          "valueAxis": "priceAxis",
          "useLineColorForBulletBorder": true,

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
        'titles': [
          {
            text: titleBig,
            bold: true,
          },
          {
            text: "This Event Study tool allows you to analyse the effect that each event has on the cumulative returns of a company.",
            bold: false,
          },
        ]
      });
    }
  }

  function render_stock_topics_average_graph (company,upper_range,lower_range) {
    var chartData = [];

    var all_topics = _.uniq(StockEvents.find({token:token},{sort:{topic:1},fields:{topic:true}}).fetch().map(function(x){return x.topic}),true);

    all_topics.forEach(function(t) {
      var events = StockEvents.find({token:token, company_name: company, topic: t, value: {$gt: 0}},{sort:{date:1},fields: {date: true}}).fetch();

      var events_avg = 0;

      events.forEach(function(e){
        var dateLower = new Date(e.date);
        dateLower.setDate(dateLower.getDate() + lower_range);
        var dateUpper = new Date(e.date);
        dateUpper.setDate(dateUpper.getDate() + upper_range);
        
        var days = StockPrices.find({company_name: company, token:token, date: {$gte : dateLower, $lte : dateUpper}}, {fields: {'cum_return':1}, sort: {cum_return:1}}).fetch().map(function(x){return x.cum_return});          
        var sum = 0;
        days.forEach(function(d){
          sum += d;
        });
        var avg = sum/days.length;

        events_avg += avg;
      });

      events_avg = events_avg/events.length;

      chartData.push({
        topic: t,
        avg_cr : events_avg,
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
                       "#334D5C", "#45B29D", "#EFC94C", "#E27A3F", "#DF5A49",][x];

          chart.dataProvider[x][colorKey] = color;
        }
      }

    }, ["serial"]);


    var chart = AmCharts.makeChart( "chartdiv2", {
      "type": "serial",
      "theme": "light",
      "dataProvider": chartData,
      "valueAxes": [ {
        "gridColor": "#FFFFFF",
        "gridAlpha": 0.2,
        "dashLength": 0
      } ],
      "gridAboveGraphs": true,
      "startDuration": 1,
      "graphs": [ {
        "balloonText": "[[category]]: <b>[[value]]</b>",
        "fillAlphas": 0.8,
        "lineAlpha": 0.2,
        "type": "column",
        "valueField": "avg_cr",
        'autoColor': true,
      } ],
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
        'equalSpacing' : true,
        // "tickPosition": "start",
        // "tickLength": 20
      },
      "export": {
        "enabled": true
      }

    } );
  }

  function render_stock_topics_graph_significance_table (company, topic, upper_range, lower_range){
    var dom = document.getElementById('chartdiv3');

    Blaze.render(Template.topics_sig_table, dom);

    var data = [];

    var dates = StockEvents.find({token:token,company_name: company, topic: topic, value: {$gt: 0}},{sort:{date:1},fields: {date: true}}).fetch();
    dates.forEach(function(d) {
      var dateLower = new Date(d.date);
      dateLower.setDate(dateLower.getDate() + lower_range);
      var dateUpper = new Date(d.date);
      dateUpper.setDate(dateUpper.getDate() + upper_range);

      var significantDays = StockPrices.find({company_name: company, token:token, date: {$gte : dateLower, $lte : dateUpper}}, {fields: {'cum_return':1}, sort: {cum_return:1}}).fetch();
      if (significantDays !== undefined) {
        var hi = significantDays[Object.keys(significantDays)[Object.keys(significantDays).length - 1]].cum_return;
        var lo = significantDays[Object.keys(significantDays)[0]].cum_return;
        var p = (hi - lo);
        // console.log(p);
        data.push({
          date: d.date.toDateString(),
          p   : p,
        });
      }
    });

    // populate table
    $('#sig_table tr:not(:first):not(:last)').remove();
    var html = '';
    var significance_threshold = 0.02;
    for (var i = 0; i < data.length; i++){
      // console.log(data[i].p);
      if (data[i].p < significance_threshold)
        html += '<tr class=\"success\">';
      else if (data[i].p < significance_threshold*2)
        html += '<tr class=\"warning\">';
      else
        html += '<tr class=\"danger\">';
        
      html += '<td>' + data[i].date + '</td><td>' + data[i].p + '&#37;</td></tr>';
    }
    $('#sig_table tr').first().after(html);
  }

  // predefined list of companies
  function render_company_details() {
    $('#details').html('Loading details...');
    var all_company = _.uniq(StockPrices.find({}, {fields:{company_name:1}},{sort:{company_name: 1}}).fetch().map(function(x){return x.company_name}),true);
    var num_companies = all_company.length;
    if (num_companies > 10) {
      $('#chartdiv2').css('height', '520');
    }
    var dom = document.getElementById('details');

    Meteor.call('scrapeSearch', curr_company, function(err, response) {
      // console.log(response);
      console.log(err);
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
          $('#website').html("<a href=\'"+website+"\'>"+website+"<\a>");
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
          $('#table').html('<table class=\"table table-striped table-hover \">' + tbody + '</table>');
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

  function render_related_news() {
    // date wanted


    var dom = document.getElementById('details');
    // date format: YYYY-MM-DD
    var date = 'herp';
    Meteor.call('scrapeRelatedNews', curr_company, date, function(err, response) {
      console.log(response);
      console.log(err);

      // if (response != null) {

      // }
    });
  }
};
