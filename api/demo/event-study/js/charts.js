$(document).ready(function () {

  $('#chartdivtopics').hide();
  
  var chartDataCompany = [
    {
      "company_name": "AAC.AX",
      "last_cr": 0.021840230944098486
    },
    {
      "company_name": "CCL.AX",
      "last_cr": -0.11292033167157076
    },
    {
      "company_name": "ELDDA.AX",
      "last_cr": 0.5263604899666249
    },
    {
      "company_name": "ELD.AX",
      "last_cr": 1.4455174174549
    },
    {
      "company_name": "FGL.AX",
      "last_cr": 0.03346100353809641
    },
    {
      "company_name": "GFF.AX",
      "last_cr": -0.4838346107644088
    },
    {
      "company_name": "GNC.AX",
      "last_cr": 0.4221910802101115
    },
    {
      "company_name": "VTA.AX",
      "last_cr": 0.5655315938769755
    },
    {
      "company_name": "TWE.AX",
      "last_cr": 1.293122159730927
    },
    {
      "company_name": "BGA.AX",
      "last_cr": 1.411309309297288
    },
    {
      "company_name": "TGR.AX",
      "last_cr": 1.0889181951749327
    },
    {
      "company_name": "SHV.AX",
      "last_cr": 0.5971410621045565
    },
    {
      "company_name": "CGC.AX",
      "last_cr": 0.296375538386656
    }
  ];


  var topics = [
    {
      "_id": "Ksuar4DeX9f254bs5",
      "company_name": "AAC.AX",
      "topic": "Cash Rate",
      "avg_cr_topic": 0.05450459469284749
    },
    {
      "_id": "MNhJ85RRxYfhFxRj9",
      "company_name": "AAC.AX",
      "topic": "China Growth Rate Change",
      "avg_cr_topic": 0.006341483624092334
    },
    {
      "_id": "R3ZDzfSKcXf4GpH3i",
      "company_name": "AAC.AX",
      "topic": "CEO Health issue",
      "avg_cr_topic": -0.06558246662221824
    },
    {
      "_id": "oH9jNTQzS5B6MAisr",
      "company_name": "AAC.AX",
      "topic": "Earning announcements",
      "avg_cr_topic": -0.044359141885683746
    },
    {
      "_id": "MZhuib7EL5Jd3Z7ED",
      "company_name": "AAC.AX",
      "topic": "Macroevent",
      "avg_cr_topic": 0.1045209840917354
    },
    {
      "_id": "L6EjyF2KJE8tv8KuE",
      "company_name": "AAC.AX",
      "topic": "Government Policy changes",
      "avg_cr_topic": 0.01685723171455052
    },
    {
      "_id": "NCDkT73B2QF4YmAej",
      "company_name": "CCL.AX",
      "topic": "Cash Rate",
      "avg_cr_topic": 0.08989156236282843
    },
    {
      "_id": "urKdwgMkXEjdcCa9L",
      "company_name": "ELD.AX",
      "topic": "Cash Rate",
      "avg_cr_topic": 2.129734979561288
    },
    {
      "_id": "7odMX3mJWXxQbgTPL",
      "company_name": "FGL.AX",
      "topic": "Cash Rate",
      "avg_cr_topic": 0.024430827631048237
    },
    {
      "_id": "C9bpjhsQzE9KWRq43",
      "company_name": "GFF.AX",
      "topic": "Cash Rate",
      "avg_cr_topic": -0.7041217898316381
    },
    {
      "_id": "q7PqWeq3AbNTWJ8ct",
      "company_name": "GNC.AX",
      "topic": "Cash Rate",
      "avg_cr_topic": 0.5862959183861354
    },
    {
      "_id": "KDoLeS35oXwgdfbxo",
      "company_name": "TWE.AX",
      "topic": "Cash Rate",
      "avg_cr_topic": 0.4085601596733481
    },
    {
      "_id": "z5ozX8SAgrYFc49qF",
      "company_name": "BGA.AX",
      "topic": "Cash Rate",
      "avg_cr_topic": 0.3820141666571291
    },
    {
      "_id": "p8SdY5LFwYTBX625o",
      "company_name": "TGR.AX",
      "topic": "Cash Rate",
      "avg_cr_topic": 0.28516447408870105
    },
    {
      "_id": "8DhF6f7AeywwiFgAZ",
      "company_name": "SHV.AX",
      "topic": "Cash Rate",
      "avg_cr_topic": -0.1982155939012659
    }
  ];

  var types = [
    "Cash Rate",
    "China Growth Rate Change",
    "CEO Health issue",
    "Earning announcements",
    "Macroevent",
    "Government Policy changes"
  ];

  var all_company = [
    "AAC.AX",
    "CCL.AX",
    "ELDDA.AX",
    "ELD.AX",
    "FGL.AX",
    "GFF.AX",
    "GNC.AX",
    "VTA.AX",
    "TWE.AX",
    "BGA.AX",
    "TGR.AX",
    "SHV.AX",
    "CGC.AX"
  ];



  function populate_companys(all_company) {
    var dropdown = document.getElementById("chart-dropdown-menu");
    $('.dropdown-menu').html('');

    for (var i = 0; i < all_company.length; i++) {
      var company_name = all_company[i];

      var li = document.createElement("li");
      var a = document.createElement('a');
      a.appendChild(document.createTextNode(company_name));
      li.appendChild(a);
      dropdown.appendChild(li);
      $(li).data('company_name', company_name);
    }
  }

  $('#chart-dropdown-menu').on('click', 'li', function () {
    //    console.log($(this).data());
    var company_name = $(this).data('company_name');
    render_company_topics_chart(company_name);

  });



  populate_companys(all_company);

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
      chart.startEffect = "elastic ";

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

      chart.write("chartdivcompany");
    }
  }


  function render_company_topics_chart(company_name) {
    $('#chartdivtopics').show();
    console.log("SHOWING");

    var chartDataTopics = [];
    types.forEach(function (t) {
      var found = false;
      topics.forEach(function (c) {
        if (company_name == c.company_name && c.topic == t) {
          found = true;
          var entry = {
            topic: c.topic,
            avg_cr: c.avg_cr_topic,
          };
          chartDataTopics.push(entry);
        }
      });
      if (!found) {
        chartDataTopics.push({
          topic: t,
          avg_cr: 0,
        });
      }
    });


    drawGraph(chartDataTopics, company_name);


    function handleClick(event) {
      // alert(event.item.category + ": " + event.item.values.value);
      // window.location.href = "/company_events_highlight/"+query_token+"/"+event.item.category;

    }

    function drawGraph(chartData, company_name) {
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
      categoryAxis.title = "Event Type";
      categoryAxis.titleColor = 'grey';
      
      

      // value
      // in case you don't want to change default settings of value axis,
      // you don't need to create it, as one value axis is created automatically.
      var valueAxis = new AmCharts.ValueAxis();
      valueAxis.title = "Average C.R. of Event Type";
      valueAxis.titleColor = 'grey';
      chart.addValueAxis(valueAxis);
      
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