Template.vs_company_chart.rendered = function() {

  var default_token = "ZA6nnTLZ5HMsrqEbhwsd";

  Tracker.autorun(function() {
    var companys = Companys.find({file_token: default_token},{fields: {'company_name':1, avg_cr:1}, sort:{avg_cr:1}}).fetch();
    var chartData = [];

    companys.forEach(function(c) {
      var entry = {
        company_name: c.company_name,
        avg_cr: c.avg_cr,
      };
      chartData.push(entry);
    });
    
    // console.log(companys);
    drawGraph(chartData);
  });





  // var chartData = [{
  //     country: "USA",
  //     visits: 4025},
  // {
  //     country: "China",
  //     visits: 1882},
  // {
  //     country: "Japan",
  //     visits: 1809},
  // {
  //     country: "Germany",
  //     visits: 1322},
  // {
  //     country: "UK",
  //     visits: 1122},
  // {
  //     country: "France",
  //     visits: 1114},
  // {
  //     country: "India",
  //     visits: 984},
  // {
  //     country: "Spain",
  //     visits: 711},
  // {
  //     country: "Netherlands",
  //     visits: 665},
  // {
  //     country: "Russia",
  //     visits: 580},
  // {
  //     country: "South Korea",
  //     visits: 443},
  // {
  //     country: "Canada",
  //     visits: 441},
  // {
  //     country: "Brazil",
  //     visits: 395},
  // {
  //     country: "Italy",
  //     visits: 386},
  // {
  //     country: "Australia",
  //     visits: 384},
  // {
  //     country: "Taiwan",
  //     visits: 338},
  // {
  //     country: "Poland",
  //     visits: 328}];


  function handleClick(event)
  {
    alert(event.item.category + ": " + event.item.values.value);
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

  // chart = new AmCharts.AmSerialChart();
  // chart.dataProvider = chartData;
  // chart.categoryField = "country";
  // chart.startDuration = 1;
  
  
  // // add click listener
  // chart.addListener("clickGraphItem", handleClick);
  

  // // AXES
  // // category
  // var categoryAxis = chart.categoryAxis;
  // categoryAxis.labelRotation = 90;
  // categoryAxis.gridPosition = "start";

  // // value
  // // in case you don't want to change default settings of value axis,
  // // you don't need to create it, as one value axis is created automatically.
  // // GRAPH
  // var graph = new AmCharts.AmGraph();
  // graph.valueField = "visits";
  // graph.balloonText = "[[category]]: [[value]]";
  // graph.type = "column";
  // graph.lineAlpha = 0;
  // graph.fillAlphas = 0.8;
  // chart.addGraph(graph);

  // chart.write("chartdiv");

};


