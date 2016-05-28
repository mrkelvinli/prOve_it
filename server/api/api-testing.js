APItesting = {
  handleRequest: function (context, method) {
    var params = context.request.query;
    APItesting.methods[method](context, params);
  },

  methods: {
    GET: function (context, params) {

      var token = "jayzevYadgwDqDKRvaXe"; // remember to change
      var company = "AAC.AX";
      var topic = "Cash Rate";
      var lower_range = -5;
      var upper_range = 5;

      var chartData = [];

    // var all_topics = _.uniq(StockEvents.find({token:token},{sort:{topic:1},fields:{topic:true}}).fetch().map(function(x){return x.topic}),true);

    // var dates = _.uniq(StockEvents.find({token:token,company_name: company, topic: topic, value: {$gt: 0}},{sort:{date:1},fields: {date: true}}).fetch().map(function(x){return x.date}),true);

    var events = StockEvents.find({token:token,company_name: company, topic: topic, value: {$gt: 0}},{sort:{date:1},fields: {date: true}}).fetch();


    var graphs = [];
    var graphsReady = false;

    if (events.length > 0) {

      for (var date = lower_range; date <= upper_range; date++) {
        var entry = {date: date};
        events.forEach(function (e) {
          var currDate = new Date(e.date.getTime());
          // console.log("currDate :"+currDate); 
          currDate.setUTCDate(e.date.getUTCDate()+date);
          // console.log("window: "+ date + " " + currDate+ " event date: "+ e.date );
          var cr = StockPrices.findOne({token: token, company_name: company, date: currDate},{fields:{cum_return:true}});
          var offset_cr = StockPrices.findOne({token: token, company_name: company, date: e.date},{fields:{cum_return:true}});
          if (cr === undefined)
            cr = null;
          else
            cr = cr.cum_return;

          if (offset_cr === undefined)
            offset_cr = null;
          else
            offset_cr = offset_cr.cum_return;

          var offseted_cr = cr-offset_cr;
          console.log(cr);
          console.log(offset_cr);
          entry[e.date.toDateString()] = Math.abs(offseted_cr);

          if(!graphsReady){
            graphs.push({
              "balloonText": "[[value]]%",
              "bullet": "round",
              "hidden": false,
              "title": e.date.toDateString(),
              "valueField": e.date.toDateString(),
              "fillAlphas": 0,
            });  
          }

        });
        graphsReady = true;
        chartData.push(entry);
      }
    }

      API.utility.response(context, 200, chartData);
    }
  },
};





