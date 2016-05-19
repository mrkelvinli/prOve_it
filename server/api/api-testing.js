APItesting = {
  handleRequest: function (context, method) {
    var params = context.request.query;
    APItesting.methods[method](context, params);
  },

  methods: {
    GET: function (context, params) {


      var token = params['token'];
      var company_name = "AAC.AX";
      var topic = "Cash Rate";
      var lower_range = -5;
      var upper_range = 5;

      var stocks = StockPrices.find({company_name: company_name, token:token}, {fields: {'date':1, 'cum_return':1}}).fetch();
      var chartData = [];
      var guides = [];

      // events
      var events = StockEvents.find({token: token, company_name: company_name, topic: topic, value: {$gt : 0}}, {fields: {'date':1}}).fetch(); 
      // console.log(events);

      events.forEach(function(c) {
        var dateLower = new Date(c.date);
        dateLower.setDate(dateLower.getDate() + lower_range);
        var dateUpper = new Date(c.date);
        dateUpper.setDate(dateUpper.getDate() + upper_range);

        // console.log(c.date);
        // console.log(dateLower);
        // console.log(dateUpper);
        var significantDays = StockPrices.find({company_name: company_name, token:token, date: {$gte : dateLower, $lte : dateUpper}}, {fields: {'cum_return':1}, sort: {'cum_return':1}}).fetch();
        console.log(significantDays);
        if (significantDays != undefined) {
          var hi = significantDays[Object.keys(significantDays)[Object.keys(significantDays).length - 1]].cum_return;
          var lo = significantDays[Object.keys(significantDays)[0]].cum_return;
          // console.log(hi);
          // console.log(lo);
          //fruitObject[Object.keys(fruitObject)[Object.keys(fruitObject).length - 1]] 
          var p = (hi - lo);
          console.log(p);

          var significance = "Non-significant event";
        }
      });


      API.utility.response(context, 200, {});











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





