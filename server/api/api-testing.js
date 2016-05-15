APItesting = {
  handleRequest: function (context, method) {
    var params = context.request.query;
    APItesting.methods[method](context, params);
  },

  methods: {
    GET: function (context, params) {


      var token = params['token'];

      // var stock_price = StockPrices.find({token: token}).fetch();
      // var stock_event = StockEvents.find({token: token}).fetch();

      // return all the topics in event files
      var all_topics = _.uniq(StockEvents.find({token:token},{sort:{topic:1},fields:{topic:true, _id:false}}).fetch().map(function(x){return x.topic}),true);

      var topic = "Cash Rate";
      var company = "AAC.AX";
      var window_range = 5;

      var date = _.uniq(StockEvents.find({token:token,company_name: company, topic: topic, value: {$gt: 0}},{sort:{date:1},fields: {date: true, _id:false}}).fetch().map(function(x){return x.date}),true);

      var d = date[0];

      // date.forEach(function(d) {
        var dateLower = new Date(d.getTime());
        dateLower.setDate(d.getDate() - window_range);
        var dateUpper = new Date(d.getTime());
        dateUpper.setDate(d.getDate() + window_range);


        console.log(dateLower);
        console.log(d);
        console.log(dateUpper);

        var ret = StockPrices.find({token: token, company_name: company, date: {$gte: dateLower, $lte: dateUpper}},{sort:{date:1},fields:{cum_return:true, _id:false}}).fetch();


      // });


      API.utility.response(context, 200, {
        status: "Successful.",
        // all_topics: all_topics,
        // date: date,
        ret : ret,
        // stock_price: stock_price,
        // stock_event: stock_event,
      });











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





