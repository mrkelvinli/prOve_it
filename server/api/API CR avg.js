apiCalcCrAvg = {
  connection: function (request) {
    var getRequestContents = API.utility.getRequestContents(request);
    return {
      data: getRequestContents
    };
  },

  handleRequest: function (context, method) {
    var connection = API.connection(context.request);
    if (!connection.error) {
      var params = connection.data;
      apiCalcCrAvg.methods[method](context, params);
    } else {
      API.utility.response(context, 401, connection);
    }
  },

  methods: {
    GET: function (context, params) {

      var token = params['token'];

      var requestOK = apiCalcCrAvg.utility.validateRequest(token);
      if (requestOK) {

        var file = Files.findOne({
          token: token
        });
        var stock_price_file = file.stock_price_file;
        var stock_characteristic_file = file.stock_characteristic_file;

        // Events.remove({file_token: token});
        // Topics.remove({file_token: token});
        // Companys.remove({file_token: token});

        Events.remove({});
        Topics.remove({});
        Companys.remove({});
        Stocks.remove({});


        // pre calculate the average cumulative return and store it to the database
        var all_events = ES.get_all_events(stock_characteristic_file);
        console.log(all_events);
        ES.avg_cr_for_events(stock_price_file,all_events,token);
        // console.log(Events.find().fetch());

        var all_company = ES.get_all_query_company(stock_price_file);
        ES.company_and_avg_cr_for_topic(all_company,token);

        ES.company_avg_cr(all_company,token);
        console.log(Companys.find().fetch());

        ES.populate_stocks_db(stock_price_file);


        API.utility.response(context, 200, {
          status: "Successful."
        });
      } else {
        API.utility.response(context, 404, {
          status: "failure"
          // log: API.utility.api_log(params, context.request.start_time, "Invalid Request."),
        });
      }


    },
  },

  utility: {
    getRequestContents: function (request) {
      return request.query;
    },
    response: function (context, statusCode, data) {
      context.response.setHeader('Content-Type', 'application/json');
      context.response.statusCode = statusCode;
      context.response.end(JSON.stringify(data));
    },
    validateRequest: function (token) {
      return Files.find({token:token}).count() !== 0;
    },
  },
};