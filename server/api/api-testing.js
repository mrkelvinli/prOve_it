APItesting = {
  handleRequest: function (context, method) {
    var params = context.request.query;
    APItesting.methods[method](context, params);
  },

  methods: {
    GET: function (context, params) {


      var token = params['token'];
      var company = "AAC.AX";


      var prices = StockPrices.find({token:token, company_name: company},{fields:{date:true, flat_value:true}}).fetch();

      var stock_prices = [];

      prices.forEach(function(p){
        stock_prices.push({
          time: p.date.toDateString(),
          price: p.flat_value,
        });
      });
      



      API.utility.response(context, 200,stock_prices);











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





