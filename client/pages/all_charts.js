  // var default_token = "2s4XeTBzRLdbMFDdMrdJ";

  // var default_company = "AAC.AX";

Template.vs_company_chart.rendered = function() {

  var query_token = Router.current().params.token;

  Tracker.autorun(function() {
    // var companys = Meteor.call('get_companies_db', query_token);
    
    // console.log(companys);
    var companys = Companys.find({file_token: query_token},{fields: {'company_name':1, avg_cr:1}, sort:{avg_cr:1},reactive:true}).fetch();
    if (companys == null) {
      console.log("asdf");
      Router.go('notFound');
      return;
    } else if (companys.length == 0) {
      console.log("aoeu");
    }
    console.log("continued");
    var chartData = [];

    companys.forEach(function(c) {
      var entry = {
        company_name: c.company_name,
        avg_cr: c.avg_cr,
      };
      chartData.push(entry);
    });

    drawGraph(chartData);
  });


  function handleClick(event)
  {
    // alert(event.item.category + ": " + event.item.values.value);
    window.location.href = "/company_topics_chart/"+query_token+"/"+event.item.category;
  }

  function drawGraph (chartData) {
    var chart = new AmCharts.AmSerialChart();


    chart.dataProvider = chartData;
    chart.categoryField = "company_name";
    chart.startDuration = 1;
    
    
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
    graph.valueField = "avg_cr";
    graph.balloonText = "[[category]]: [[value]]";
    graph.type = "column";
    graph.lineAlpha = 0;
    graph.fillAlphas = 0.8;
    chart.addGraph(graph);

    chart.write("chartdiv");
  }
};

Template.company_topics_chart.rendered = function() {

  console.log(Router.current().params.company_name);

  var query_company = Router.current().params.company_name;
  var query_token = Router.current().params.token;

  Tracker.autorun(function() {
    var topics = Topics.find({file_token: query_token,company_name: query_company},{fields: {'topic':1, avg_cr_topic:1}, sort:{avg_cr_topic:1}}).fetch();
    var chartData = [];

    topics.forEach(function(c) {
      var entry = {
        topic: c.topic,
        avg_cr: c.avg_cr_topic,
      };
      chartData.push(entry);
    });
    drawGraph(chartData);
  });


  function handleClick(event)
  {
    // alert(event.item.category + ": " + event.item.values.value);
    window.location.href = "/company_events_highlight/"+query_token+"/"+event.item.category;
  }

  function drawGraph (chartData) {
    var chart = new AmCharts.AmSerialChart();
    chart.dataProvider = chartData;
    chart.categoryField = "topic";
    chart.startDuration = 1;
    
    
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
    graph.valueField = "avg_cr";
    graph.balloonText = "[[category]]: [[value]]";
    graph.type = "column";
    graph.lineAlpha = 0;
    graph.fillAlphas = 0.8;
    chart.addGraph(graph);

    chart.write("chartdiv");
  }
};






