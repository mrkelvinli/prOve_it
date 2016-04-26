Template.example3.rendered = function() {
  var chart = AmCharts.makeChart( "chartdiv", {
    "type": "pie",
    "theme": "none",
    "dataProvider": [ {
      "country": "Lithuania",
      "litres": 501.9
    }, {
      "country": "Czech Republic",
      "litres": 301.9
    }, {
      "country": "Ireland",
      "litres": 201.1
    }, {
      "country": "Germany",
      "litres": 165.8
    }, {
      "country": "Australia",
      "litres": 139.9
    }, {
      "country": "Austria",
      "litres": 128.3
    }, {
      "country": "UK",
      "litres": 99
    }, {
      "country": "Belgium",
      "litres": 60
    }, {
      "country": "The Netherlands",
      "litres": 50
    } ],
    "valueField": "litres",
    "titleField": "country",
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