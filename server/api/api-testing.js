APItesting = {
  handleRequest: function (context, method) {
    var params = context.request.query;
    APItesting.methods[method](context, params);
  },

  methods: {
    GET: function (context, params) {
      if (!API.utility.hasData(params)) {
        API.utility.response(context, 404, {
          error: 404,
          message: "Invalid Request (no parameters found), dude."
        });
      }

      var token = params['token'];
      var company_name = params['company_name'];
      var date = params['date'];


      // Make sure that our request has data and that the data is valid.
      var tokenOK = API.utility.tokenOK(token);

      if (tokenOK) {

        // retrieve the file from the token
        var file = Files.findOne({
          token: token
        });
        var stock_price_file = file.stock_price_file;
        var stock_characteristic_file = file.stock_characteristic_file;
        
        
//        var cum_return = get_cum_return(stock_price_file, company_name, date);

        var price_file_company = ES.get_all_query_company(stock_price_file);
        var char_file_company = ES.get_all_query_company(stock_characteristic_file);
        
        
        // the validation does nothing at the moment
        // validData = API.utility.validate( connection.data, { "a": String, "b": String });

        API.utility.response(context, 200, {
          message: "OK",
          param: params,
          price_file_company: price_file_company,
          char_file_comapny: char_file_company,
          
          //          stock_price_file: stock_price_file,
          //          stock_characteristic_file: stock_characteristic_file,
//          cumulative_return: cum_return,
        });
      } else {
        API.utility.response(context, 404, {
          message: "Invalid token.",
          param: params,
        });
      }
    },
  },
};





