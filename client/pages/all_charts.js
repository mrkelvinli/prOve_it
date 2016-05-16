Template.chart.rendered = function() {
  var token = Router.current().params.token;
  var validToken = false;

  var curr_company = "AAC.AX";
  var curr_topic = "Cash Rate";

  Meteor.call('checkToken',token, function(err, response) {
    validToken = response;
    // console.log(response);
    if (validToken) {

      // render_candlestick_graph(curr_company);
      // render_stock_vs_topic_graph(curr_company, curr_topic, 5, -5);
    } else {
      alert("invalid token");
    }
  });


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

