Uploader = {
  connection: function( request ) {
    var getRequestContents = API.utility.getRequestContents( request );
    return { data: getRequestContents };
  },

  handleRequest: function( context, method ) {
    var connection = API.connection( context.request );
    if ( !connection.error ) {
      var params = connection.data;
      var files  = context.request.files;
      var token = context.request.token;
      Uploader.methods[ method ]( context, params, files, token);
    } else {
      API.utility.response( context, 401, connection );
    }
  },

  methods: {
    POST: function( context, params, files, token) {
      // files parsing
      for (var id in files) {
        var parseObject = Papa.parse(files[id]['contents'])
        files[id]['json'] = parseObject.data;
        files[id]['errors'] = parseObject.errors;
        if (files[id]['errors'].length > 0) {
          API.utility.response( context, 422, {
            log : API.utility.api_log(params, files, context.request.start_time, "CSV file isn't formatted correctly."),
          });
        }
      }
      
      // Make sure that our request has data and that the data is valid.
      var requestOK = Uploader.utility.validateRequest(files);

      if ( requestOK ) {
        API.utility.response( context, 200, {
          log : API.utility.api_log(params, files, context.request.start_time, "successful"),
          token: token,
        });
      } else {
        API.utility.response( context, 404, {
          log : API.utility.api_log(params, files, context.request.start_time, "Invalid Request."),
        });
      }
      
      
    },
  },

  utility: {
    getRequestContents: function( request ) {
      return request.query;
    },
    hasData: function( data ) {
      return Object.keys( data ).length > 0 ? true : false;
    },
    response: function( context, statusCode, data ) {
      context.response.setHeader( 'Content-Type', 'application/json' );
      context.response.statusCode = statusCode;
      context.response.end( JSON.stringify( data) );
    },
    validate: function( data, pattern ) {
      return Match.test( data, pattern );
    },
    validateRequest: function (files ) {
      var stock_price_file_OK = false;
      var stock_characteristic_file_OK = false
      for (var id in files) {
        if (files[id]['fieldname'] == "stock_price_file" && !stock_price_file_OK){
          stock_price_file_OK = true;
        } else if (files[id]['fieldname'] == "stock_characteristic_file" && !stock_characteristic_file_OK) {
          stock_characteristic_file_OK = true;
        }
      }
      return files.length == 2 &&
        stock_price_file_OK &&
        stock_characteristic_file_OK;
    },
  },
};