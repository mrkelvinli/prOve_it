$(document).ready(function () {

  var chartDataCompany = [
    {
      "company_name": "AAC.AX",
      "last_cr": 0.021840230944098486
    },
    {
      "company_name": "ELD.AX",
      "last_cr": 10.04455174174549
    },
    {
      "company_name": "ELDDA.AX",
      "last_cr": 0.5263604899666249
    },
    {
      "company_name": "GNC.AX",
      "last_cr": 0.4221910802101115
    },
    {
      "company_name": "RIC.AX",
      "last_cr": 0.4831955359576602
    },
    {
      "company_name": "TGR.AX",
      "last_cr": 1.0889181951749327
    },
    {
      "company_name": "WBA.AX",
      "last_cr": 1.347701002822227
    }
  ];


  var topics = [
  {
      "_id": "yBZzwXApY2hzMGpDG",
      "company_name": "AAC.AX",
      "topic": "Cash Rate",
      "avg_cr_topic": 0.07055896504909921,
      "file_token": "kRM3mx5HdG8TcQkXGJHb"
    },
    {
      "_id": "QJfPaX5ngnv73nf73",
      "company_name": "CCL.AX",
      "topic": "Cash Rate",
      "avg_cr_topic": 0.08989156236282843,
      "file_token": "kRM3mx5HdG8TcQkXGJHb"
    },
    {
      "_id": "epfWh9CauhKJwDzSz",
      "company_name": "ELD.AX",
      "topic": "Cash Rate",
      "avg_cr_topic": 2.129734979561288,
      "file_token": "kRM3mx5HdG8TcQkXGJHb"
    },
    {
      "_id": "R5nN54PZnTYqyJAah",
      "company_name": "FGL.AX",
      "topic": "Cash Rate",
      "avg_cr_topic": 0.024430827631048237,
      "file_token": "kRM3mx5HdG8TcQkXGJHb"
    },
    {
      "_id": "X527LNk6rpcwjjmCD",
      "company_name": "GFF.AX",
      "topic": "Cash Rate",
      "avg_cr_topic": -0.7041217898316381,
      "file_token": "kRM3mx5HdG8TcQkXGJHb"
    },
    {
      "_id": "EtgavyJpJEmXTpAft",
      "company_name": "GNC.AX",
      "topic": "Cash Rate",
      "avg_cr_topic": 0.5862959183861354,
      "file_token": "kRM3mx5HdG8TcQkXGJHb"
    },
    {
      "_id": "ZGbB8Sg5gYmcTFsxr",
      "company_name": "TWE.AX",
      "topic": "Cash Rate",
      "avg_cr_topic": 0.4085601596733481,
      "file_token": "kRM3mx5HdG8TcQkXGJHb"
    },
    {
      "_id": "GkTGzvsxvmrtKHY9A",
      "company_name": "BGA.AX",
      "topic": "Cash Rate",
      "avg_cr_topic": 0.3820141666571291,
      "file_token": "kRM3mx5HdG8TcQkXGJHb"
    },
    {
      "_id": "wahLhXgi5Bsx3MBy9",
      "company_name": "TGR.AX",
      "topic": "Cash Rate",
      "avg_cr_topic": 0.28516447408870105,
      "file_token": "kRM3mx5HdG8TcQkXGJHb"
    },
    {
      "_id": "ahbKaTdkQuJjPo2BK",
      "company_name": "SHV.AX",
      "topic": "Cash Rate",
      "avg_cr_topic": -0.1982155939012659,
      "file_token": "kRM3mx5HdG8TcQkXGJHb"
    }
  ];








  render_company_chart();

  function render_company_chart() {

    drawGraph(chartDataCompany);


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
            var color = chart.colors[x]
            chart.dataProvider[x][colorKey] = color;
          }
        }

      }, ["serial"]);

      var chart = new AmCharts.AmSerialChart();
      chart.dataProvider = chartData;
      chart.categoryField = "company_name";
//      chart.startDuration = 1;
      chart. startEffect = "elastic ";

      chart.titles = [{
        "text": "Average cumulative returns for each company",
        "bold": true,
        }];

      // add click listener
      chart.addListener("clickGraphItem", handleClick);


      // AXES
      // category
      var categoryAxis = chart.categoryAxis;
      categoryAxis.labelRotation = 90;
      categoryAxis.gridPosition = "start";

      // value
      // in case you don't want to change default settings of value axis,
      // you don't need to create it, as one value axis is created automatically.
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

      chart.write("chartdivcompany");
    }
  }


  function render_company_topics_chart(company_name) {

    var chartDataTopics = [];
    topics.forEach(function (c) {
      if (company_name == c.company_name) {
        var entry = {
          topic: c.topic,
          avg_cr: c.avg_cr_topic,
        };
        chartDataTopics.push(entry);
      }
    });


    drawGraph(chartDataTopics,company_name);


    function handleClick(event) {
      // alert(event.item.category + ": " + event.item.values.value);
      // window.location.href = "/company_events_highlight/"+query_token+"/"+event.item.category;

    }

    function drawGraph(chartData,company_name) {
      var chart = new AmCharts.AmSerialChart();
      chart.dataProvider = chartData;
      chart.categoryField = "topic";
      chart.startDuration = 0;


      // add click listener
      chart.addListener("clickGraphItem", handleClick);
      var company_name = "Average cumulative return by event-type for " + company_name;
      chart.titles = [{
        "text": company_name,
        "bold": true,
        }];
      // AXES
      // category
      var categoryAxis = chart.categoryAxis;
      categoryAxis.labelRotation = 90;
      categoryAxis.gridPosition = "start";

      // value
      // in case you don't want to change default settings of value axis,
      // you don't need to create it, as one value axis is created automatically.
      // GRAPH
      var graph = new AmCharts.AmGraph();
      graph.valueField = "avg_cr";
      graph.balloonText = "[[category]]: [[value]]";
      graph.type = "column";
      graph.lineAlpha = 0;
      graph.fillAlphas = 0.8;
      chart.addGraph(graph);

      chart.write("chartdivtopics");
    }
  }
});