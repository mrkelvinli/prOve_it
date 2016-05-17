APItesting = {
  handleRequest: function (context, method) {
    var params = context.request.query;
    APItesting.methods[method](context, params);
  },

  methods: {
    GET: function (context, params) {


      var token = params['token'];
      var company = "AAC.AX";
      var topic = "Cash Rate";

      var lower_range = -5;
      var upper_range = 5;


      var chartData = [];
      var graphs = [];
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

      API.utility.response(context, 200, chartData);











      // var company_name = "AAC.AX";
      // var topic = "Cash Rate";

    //   var token = params['token'];

    //   var requestOK = apiCalcCrAvg.utility.validateRequest(token);
    //   if (requestOK) {

    //     var file = Files.findOne({
    //       token: token
    //     });
    //     var stock_price_file = file.stock_price_file;
    //     var stock_characteristic_file = file.stock_characteristic_file;


    //     var c_cr = [];
    //     var all_company = ES.get_all_query_company(stock_price_file);
    //     all_company.forEach(function(c){

    //       var ret = StockPrice.findOne(
    //         {
    //           company_name: c,
    //           token: token,
    //         },{
    //           fields: {
    //             company_name: 1,
    //             date: 1,
    //             cum_return: 1,
    //           },
    //           sort:{
    //             date:-1,
    //           }
    //         }
    //       );
    //       // console.log(ret.cum_return);
    //       c_cr.push({
    //         company_name: c,
    //         last_cr: ret.cum_return,
    //       });
    //     });




    //     var topics = Topics.find({},{fields: {company_name:1, topic:1, avg_cr_topic:1}}).fetch();


    //     var topic_types = ES.get_all_event_type(stock_characteristic_file);


    //     API.utility.response(context, 200, {
    //       status: "Successful.",
    //       c_cr: c_cr,
    //       topics: topics,
    //       types: topic_types,
    //       all_company: all_company,
    //     });
    //   } else {
    //     API.utility.response(context, 404, {
    //       status: "failure"
    //       // log: API.utility.api_log(params, context.request.start_time, "Invalid Request."),
    //     });
    //   }
    }
  },
};





