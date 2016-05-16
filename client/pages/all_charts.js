Template.chart.rendered = function() {
  var token = Router.current().params.token;
  var validToken = false;

  var curr_company = "AAC.AX";
  var curr_topic = "Cash Rate";

  Meteor.call('checkToken',token, function(err, response) {
    validToken = response;
    // console.log(response);
    if (validToken) {
      render_company_chart();
  render_volatility_chart();
      // render_candlestick_graph(curr_company);
      // render_stock_vs_topic_graph(curr_company, curr_topic, 5, -5);
      // render_events_chart(curr_company,curr_topic,5,-5);
    } else {
      alert("invalid token");
    }
  });



  function render_volatility_chart () {
    var stock_prices = [
      {time: 0, price: 5},
      {time: 1, price: 5.1},
      {time: 2, price: 5.3},
      {time: 3, price: 5.2},
      {time: 4, price: 4.9},
      {time: 5, price: 5.5},
      {time: 6, price: 5.6},
      {time: 7, price: 5.8},
      {time: 8, price: 5.5},
      {time: 9, price: 5.7},
      {time: 10, price: 6.1}
    ];

    var sma = [];
    var avg = 0;
    var currPrice = 0;
    var prevPrice = 0;
    // stock_prices.forEach(function (day) {
    //   prevPrice = currPrice;
    //   currPrice = day.price;

    // //   //calculate moving average for 2 days
    // //   avg = (prevPrice + currPrice)/2;
    // //   var entry = {
    // //     time: day.time,
    // //     price: day.price,
    // //     mAvg: avg
    // //   }
    // //   sma.push(entry);
    // // });

    //calculate standard deviation
    var toDoList = []; //array of arrays of values [[1,2],[2,3],[9,10]]
    currPrice = prevPrice = 0;

    for(var i = 0; i<(stock_prices.length); i++) {
      var currArray = [];
      if (i == 0) {
        currArray.push(stock_prices[i].price);
      } 
      for(var x = 0; x<2; x++) {
          if (i>0) {
                    currArray.push(stock_prices[i-x].price);
          }
      }
      toDoList.push({"currArray": currArray, "time": stock_prices[i].time, "price": stock_prices[i].price});
    }
    console.log(toDoList);

    toDoList.forEach(function (c){
      var result = standardDeviation(c.currArray);
      var entry = {"time": c.time, "price": c.price, "mAvg": result[1], "sdUpper": ((result[0]*2)+result[1]), "sdLower": (result[1]-(result[0]*2))};
      console.log(entry);
      sma.push(entry);
    });

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

    var chart = AmCharts.makeChart("chartdiv", {
      "type": "serial",
      "theme": "light",
      "dataProvider": sma,
      "valueAxes": [ {
        "gridColor": "#000000",
        "gridAlpha": 0.2,
        "dashLength": 10,
        "title": "Stock Price ($)"
      } ],
      "gridAboveGraphs": true,
      "startDuration": 0,
      "graphs": [ {
        "id": "priceGraph",
        "balloonText": "Price: <b>[[price]]</b><br>Upper Band: <b>[[sdUpper]]</b><br>SMA(30): <b>[[mAvg]]</b><br>Lower Band: <b>[[sdLower]]</b>",
        "fillAlphas": 0,
        "lineAlpha": 1,
        "type": "line",
        "lineColor": "#ff6600",
        "lineThickness": 2,
        "valueField": "price",
        "labelPosition": "right",
        "labelFunction": labelFunction,
        "labelText": "Stock Price"
      },
      {
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
        "labelPosition": "right",
        "labelFunction": labelFunction,
        "labelText": "SMA(30)"
      },
      {
        "id": "sdUpperGraph",
        //"balloonText": "Upper Band: <b>[[value]]</b>",
        "showBalloon": false,
        "fillAlphas": 0.3,
        "fillColors": ["#ffff00"],
        "lineAlpha": 0,
        "type": "line",
        "fillToGraph": "sdLowerGraph",
        "valueField": "sdUpper",
        "labelPosition": "right",
        "labelFunction": labelFunction,
        "labelText": "Upper Band"
      },
      {
        "id": "sdLowerGraph",
        //"balloonText": "Lower Band: <b>[[value]]</b>",
        "showBalloon": false,
        "fillAlphas": 0,
        "lineAlpha": 0,
        "type": "line",
        "valueField": "sdLower",
        "labelPosition": "right",
        "labelFunction": labelFunction,
        "labelText": "Lower Band"
      }],
      "chartCursor": {
        "categoryBalloonEnabled": false,
        "cursorAlpha": 0,
        "zoomable": false
      },
      "categoryField": "time",
      "categoryAxis": {
        "gridPosition": "start",
        "gridAlpha": 0,
        "title": "Time (Days)"
        //"tickPosition": "start",
        //"tickLength": 20
      },
      "export": {
        "enabled": true
      }
    });

  function labelFunction(item, label) {
    if (item.index === item.graph.chart.dataProvider.length - 1)
      return label;
    else
      return "";
  }

}


  function render_stock_vs_topic_graph (company, topic, upper_range, lower_range) {
    Tracker.autorun(function() {
      var chartData = [];

      // var all_topics = _.uniq(StockEvents.find({token:token},{sort:{topic:1},fields:{topic:true}}).fetch().map(function(x){return x.topic}),true);
      var upper_range = 5;
      var lower_range = -5;

      var dates = _.uniq(StockEvents.find({token:token,company_name: company, topic: topic, value: {$gt: 0}},{sort:{date:1},fields: {date: true}}).fetch().map(function(x){return x.date}),true);

      for (var date = lower_range; date <= upper_range; date++) {
        var entry = {
          year: date,
        }
        dates.forEach(function (d) {
          var currDate = new Date(d.getTime());
          currDate.setDate(d.getDate()+date);
          var cr = StockPrices.findOne({token: token, company_name: company, date: currDate},{fields:{cum_return:true}});
          if (cr === undefined)
            cr = null;
          else
            cr = cr.cum_return;
          entry[d.toDateString()] = cr;
        });

        chartData.push(entry);
      }

      drawGraph(chartData,dates);
    });





    function drawGraph (chartData,dates) {


      var chartOptions = {
          "type": "serial",
          "theme": "light",
          "legend": {
              "useGraphSettings": true,
              "valueText": '',
          },
          "dataProvider": chartData,
          
          "valueAxes": [{
              // "integersOnly": true,
              // "maximum": 6,
              // "minimum": 1,
              "reversed": true,
              "axisAlpha": 0,
              "dashLength": 5,
              "gridCount": 10,
              "position": "left",
              // "title": "Place taken"
          }],
          "startDuration": 0.5,

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
              "position": "bottom"
          },
          "export": {
            "enabled": true,
              "position": "bottom-right"
          },

      };

      var graphs = [];
      dates.forEach(function(d){
        graphs.push({
          "balloonText": "cumulative return  is [[value]] at [[category]] day relative to "+d.toDateString(),
          "bullet": "round",
          "hidden": false,
          "title": d.toDateString(),
          "valueField": d.toDateString(),
          "fillAlphas": 0,
        });  
      });
      chartOptions['graphs'] = graphs;

      console.log(chartOptions);
      var chart = AmCharts.makeChart("chartdiv", chartOptions);
    }
  }


  function render_candlestick_graph (company_name) {
    var chartData = [];
    Tracker.autorun(function() {
      var stockPrices = StockPrices.find({company_name: company_name, token: token, 'open': {$ne : null}}, {fields: {'date':1, 'open':1, 'last':1, 'high':1, 'low':1, 'volume':1, 'flat_value':1}}).fetch();

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
        "pathToImages": "/amcharts/images/",
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
