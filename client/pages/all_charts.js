Template.chart.rendered = function() {
  var token = Router.current().params.token;
  // Meteor.subscribe('stockPrices_db',token);
  // Meteor.subscribe('stockEvents_db',token);

  var curr_company = "AAC.AX";
  var curr_topic;



  Meteor.call('checkToken',token, function(err, response) {
    console.log(response);
  });

  render_volatility_chart();
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

  //render_candlestick_graph(curr_company);

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

Template.homePage.rendered = function() {
  var debug = false;
  var upload_response = $("#upload_response");
  var cumulative_response = $('#cumulative_response');
  $(".json-response").hide();

  $('#chart_display').hide();


  var gui_input = $('.form-input-name-row');
  gui_input.on('change paste keyup', function () {
    var input = $(this).find('input');
    var input_name = input.attr('name');
    var input_val = input.val();

    console.log(input_name);
    if (input_name == null) {
      input_name = 'var_name';
      var e = $('select#topic-name').val();
      console.log(e);
      input_val = e;
    }
    
    if (input_val != '') {
      if ((input_name == 'token' && input_val != '') ||
        (input_name == 'stock_characteristic_file' && input_val != '') ||
        (input_name == 'stock_price_file' && input_val != '')) {
        $(this).removeClass('form-invalid-data');
        $(this).addClass('form-valid-data');
      } else {
        $(this).removeClass('form-valid-data');
        $(this).addClass('form-invalid-data');
      }
    } else {
      $(this).removeClass('form-valid-data');
      $(this).removeClass('form-invalid-data');
    }
  });
  var base_url = window.location.href;
  var token = $("input[name=token]");
  $("#upload_form").submit(function (event) {
    event.preventDefault();

    upload_response.empty();
    upload_response.show();
    upload_response.html("Processing ...");

    $.ajax({
      url: base_url + "api/v1/event-study/submit-files",
      type: 'POST',
      data: new FormData(this),
      processData: false,
      contentType: false,
      success: function (data) {
        console.log(data.token);
        $(location).attr('href', base_url + "chart/" + data.token);
      },
      error: function (data) {
        upload_response.show();
        upload_response.empty();
        upload_response.html(data.responseJSON.log.exec_status);
        //        upload_response.text(JSON.stringify(data.responseJSON, undefined, 2));
      },
    });
    return false;
  });
  $("#cumulative-return-form").submit(function (event) {
    event.preventDefault();
    $(location).attr('href', base_url + "chart/" + $(token).val());
    return false;
  });


}
