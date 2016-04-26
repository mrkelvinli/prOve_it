Template.example2.rendered = function() {
  var chart = AmCharts.makeChart("chartdiv", {
        "type": "serial",
        "addClassNames":true,
    "theme": "none",
        "pathToImages": "/lib/3/images/",
    "autoMargins": false,
    "marginLeft":30,
    "marginRight":8,
    "marginTop":10,
    "marginBottom":26,
         "balloon":{
         "adjustBorderColor":false,
          "horizontalPadding":15,
          "verticalPadding":10,
          "color":"#ffffff"
            },

        "dataProvider": [{
            "year": 2009,
            "income": 23.5,
            "expenses": 21.1
        }, {
            "year": 2010,
            "income": 26.2,
            "expenses": 30.5
        }, {
            "year": 2011,
            "income": 30.1,
            "expenses": 34.9
        }, {
            "year": 2012,
            "income": 29.5,
            "expenses": 31.1
        }, {
            "year": 2013,
            "income": 30.6,
            "expenses": 28.2,
        }, {
            "year": 2014,
            "income": 34.1,
            "expenses": 32.9,
            "dashLengthColumn": 5,
            "alpha": 0.2,
            "additional": "(projection)"
        }],
        "valueAxes": [{
            "axisAlpha": 0,
            "position": "left"
        }],
        "startDuration": 1,
        "graphs": [{
            "alphaField": "alpha",
            "balloonText": "<span style='font-size:14px;'>[[title]] in [[category]]:<br><b><span style='font-size:25px;'>[[value]]</span></b> [[additional]]</span>",
            "fillAlphas": 1,
            "title": "Income",
            "type": "column",
            "valueField": "income"
        }, {
            "id":"graph2",
            "balloonText": "<span style='font-size:14px;'>[[title]] in [[category]]:<br><b><span style='font-size:25px;'>[[value]]</span></b> [[additional]]</span>",
            "bullet": "round",
            "lineThickness": 3,
      "bulletSize": 7,
      "bulletBorderAlpha": 1,
      "bulletColor": "#FFFFFF",
      "useLineColorForBulletBorder": true,
      "bulletBorderThickness": 3,
      "fillAlphas": 0,
      "lineAlpha": 1,
            "title": "Expenses",
            "valueField": "expenses"
        }],
        "categoryField": "year",
        "categoryAxis": {
            "gridPosition": "start",
      "axisAlpha":0,
      "tickLength":0
        },
        "export": {
          "enabled": true,
          "libs": {
              "path": "http://www.amcharts.com/lib/3/plugins/export/libs/"
          }
       }

    });
  

  // store the chart in the data context in case you need it later
  this.data.chart = chart;
};

