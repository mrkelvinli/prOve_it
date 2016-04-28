  Template.chart.rendered = function() {

    var curr_company;
    var curr_topic;

    render_company_chart();

    // render_company_events_chart('TGR.AX','Cash Rate');


    function render_company_chart (){

      $('#chart_breadcrumb').empty();
      var li;
      var a;
      li = document.createElement("li");
      a = document.createElement("a");
      a.appendChild(document.createTextNode("Company"));
      li.setAttribute("id","breadcrumb_companys");
      li.appendChild(a);
      $('#chart_breadcrumb').append(li);



      Tracker.autorun(function() {
        // var companys = Meteor.call('get_companies_db', query_token);
      
        // console.log(companys);
        var companys = Companys.find({},{fields: {'company_name':1, avg_cr:1}, sort:{avg_cr:1},reactive:true}).fetch();
        if (companys.length == 0) {
          // Router.go('noFound');
          // $('#chartdiv').addClass("jawn");
        } else {
          // $('#chartdiv').removeClass("jawn");

        }

        console.log("continued");
        var chartData = [];

        // console.log(companys);

        companys.forEach(function(c) {
          var entry = {
            company_name: c.company_name,
            avg_cr: c.avg_cr,
          };
          chartData.push(entry);
        });

        drawGraph(chartData);
      });


      function handleClick(event) {
        // alert(event.item.category + ": " + event.item.values.value);
        // window.location.href = "/company_topics_chart/"+event.item.category;


        $('#chart_breadcrumb').empty();

        var li;
        var a;

        li = document.createElement("li");
        a = document.createElement("a");
        a.appendChild(document.createTextNode("Companys"));
        li.setAttribute("id","breadcrumb_companys");
        li.appendChild(a);
        // li.addClass("active");
        $('#chart_breadcrumb').append(li);

        li = document.createElement("li");
        li.setAttribute("id","breadcrumb_types");
        li.appendChild(document.createTextNode("Types of Events"));
        // li.className += " active";
        $('#chart_breadcrumb').append(li);

        curr_company = event.item.category;
        render_company_topics_chart(event.item.category);
      }

      function drawGraph (chartData) {
        // console.log('called');

        var chart = new AmCharts.AmSerialChart();



        chart.dataProvider = chartData;
        chart.categoryField = "company_name";
        chart.startDuration = 1;

        chart.titles = [{
          "text": "Average Cumulative Returns On Each Events by Companys",
          "bold": false,
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
        graph.valueField = "avg_cr";
        graph.balloonText = "[[category]]: [[value]]";
        graph.type = "column";
        graph.lineAlpha = 0;
        graph.fillAlphas = 0.8;
        chart.addGraph(graph);

        chart.write("chartdiv");
      }
    }

    function render_company_topics_chart (company_name) {

      Tracker.autorun(function() {
        var topics = Topics.find({company_name: company_name},{fields: {'topic':1, avg_cr_topic:1}, sort:{avg_cr_topic:1}}).fetch();
        var chartData = [];

        topics.forEach(function(c) {
          var entry = {
            topic: c.topic,
            avg_cr: c.avg_cr_topic,
          };
          chartData.push(entry);
        });

        console.log(chartData);


        drawGraph(chartData);
      });


      function handleClick(event)
      {
        // alert(event.item.category + ": " + event.item.values.value);
        // window.location.href = "/company_events_highlight/"+query_token+"/"+event.item.category;

        $('#chart_breadcrumb').empty();

        var li;
        var a;

        li = document.createElement("li");
        a = document.createElement("a");
        a.appendChild(document.createTextNode("Company"));
        li.setAttribute("id","breadcrumb_companys");
        li.appendChild(a);
        // li.addClass("active");
        $('#chart_breadcrumb').append(li);

        li = document.createElement("li");
        a = document.createElement("a");
        a.appendChild(document.createTextNode("Types of Events"));
        li.appendChild(a);
        li.setAttribute("id","breadcrumb_types");
        // li.addClass("active");
        $('#chart_breadcrumb').append(li);

        li = document.createElement("li");
        li.appendChild(document.createTextNode("Overall"));
        // li.className += " active";
        $('#chart_breadcrumb').append(li);

        curr_topic = event.item.category;
        curr_company = company_name;

        render_company_events_chart(company_name,event.item.category);

      }

      function drawGraph (chartData) {
        var chart = new AmCharts.AmSerialChart();
        chart.dataProvider = chartData;
        chart.categoryField = "topic";
        chart.startDuration = 1;
        
        
        // add click listener
        chart.addListener("clickGraphItem", handleClick);
        
        chart.titles = [{
          "text": "Average Cumulative Returns For Each Event Types",
          "bold": false,
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

        chart.write("chartdiv");
      }
    }

  function render_company_events_chart(company_name,topic) {

    console.log(company_name);
    console.log(topic);

    var chart ;
    var chartData = [];

    Tracker.autorun(function() {
      var stocks = Stocks.find({company_name: company_name},{fields: {'date':1, cr:1}}).fetch();
      chartData = [];
      var guides = [];

      stocks.forEach(function(c) {
        // console.log(c.date);
        var dateRange = Events.findOne({company_name: company_name, topic: topic, event_date: c.date}, {fields: {'lower_date': 1, 'upper_date': 1}});  
        // console.log(dateRange);
        if (dateRange != null){
          // console.log(dateRange);
          guides.push({
            "fillAlpha": 0.10,
            "date": dateRange.lower_date,
            "toDate": dateRange.upper_date
          });
        }
        var entry = {
          date: c.date,
          cr: parseFloat(c.cr),
        };
        chartData.push(entry);
      });

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
    });



    // chart.addListener("rendered", zoomChart);
    // zoomChart();

    // this method is called when chart is first inited as we listen for "rendered" event
    function zoomChart() {
        // different zoom methods can be used - zoomToIndexes, zoomToDates, zoomToCategoryValues
      chart.zoomToIndexes(chartData.length - 40, chartData.length - 1);
    }
  }


  // ------- page controller ---------
  $('#chart_breadcrumb').on('click','#breadcrumb_types',function (){
    console.log('types click');
    render_company_topics_chart(curr_company);
  });

  $('#chart_breadcrumb').on('click','#breadcrumb_companys',function (){
    console.log('companys click');
    render_company_chart();
  });


};




