API = {

  connection: function( request ) {
    var getRequestContents = API.utility.getRequestContents( request );
    return { data: getRequestContents };
  },

  handleRequest: function( context, method ) {
    // var csv = context.request.files[0]['contents'];
    // var rows = Papa.parse(csv).data;
    // console.log(rows);

    var connection = API.connection( context.request );
    if ( !connection.error ) {
      var params = connection.data;
      var files  = context.request.files;


      API.methods[ method ]( context, params, files );
    } else {
      API.utility.response( context, 401, connection );
    }
  },

  methods: {
    POST: function( context, params, files ) {
      if (!API.utility.hasData(params)){
        API.utility.response( context, 404, { error: 404, message: "Invalid Request (no parameters found), dude." } );
      }
      
      var upper_window = "";
      var lower_window = "";
      var upper_range = "";
      var lower_range = "";
      var range_name = "";

      var status_code = 200;
      var other_vars = {};

      for (var key in params) {
        if (key == "upper_window"){
          upper_window = params['upper_window'];
          continue;
        }
        if (key == "lower_window"){
          lower_window = params['lower_window'];
          continue;
        }
        var upperRegex = /upper_([a-zA-Z\-]+)/g;
        var lowerRegex = /lower_([a-zA-Z\-]+)/g;
        var match = upperRegex.exec(key);
        if (match != null) {
          upper_range = params[key];
          var match_value = match[1];
          console.log(match_value);
          if (API.utility.match_range_name(range_name, match_value)){
            range_name = match_value;
          }
          continue;
        }
        match = lowerRegex.exec(key);
        if (match != null) {
          lower_range = params[key];
//            lower_range = parseFloat.(params[key]);
          var match_value = match[1];
          if (API.utility.match_range_name(range_name, match_value)){
            range_name = match_value;
          }
          continue;
        }
        other_vars[key] = params[key];
      }
      
      // Make sure that our request has data and that the data is valid.
      var requestOK   = API.utility.validateRequest( upper_window , lower_window, upper_range, lower_range, range_name, files);

      if ( requestOK ) {
        upper_window = parseFloat(upper_window);
        lower_window = parseFloat(lower_window);
        upper_range = parseFloat(upper_range);
        lower_range = parseFloat(lower_range);
        
        for (var id in files) {
          var parseObject = Papa.parse(files[id]['contents'])
          files[id]['json'] = parseObject.data;
          files[id]['errors'] = parseObject.errors;
          
          if (files[id]['errors']) {
            API.utility.response( context, 422, { error: 422, message: "CSV file isn't formatted correctly." } );
          }
        }

          // the validation does nothing at the moment
          // validData = API.utility.validate( connection.data, { "a": String, "b": String });

        API.utility.response( context, status_code, {
          upper_window : upper_window,
          lower_window : lower_window,
          upper_range  : upper_range,
          lower_range  : lower_range,
          range_name   : range_name,
          other_var    : other_vars,
          csv1_name    : files[0]['fieldname'],
          csv1         : files[0]['json'],
        });
      } else {
        API.utility.response( context, 404, { error: 404, message: "Invalid Request, dude." } );
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
    validateRequest: function ( upper_window , lower_window, upper_range, lower_range, range_name, files ) {
      return files.length == 2 &&
        isNumeric(upper_window) &&
        isNumeric(lower_window) &&
        isNumeric(upper_range) &&
        isNumeric(lower_range) &&
        range_name != "" &&
        parseFloat(upper_window) >= parseFloat(lower_window) &&
        parseFloat(upper_range) >= parseFloat(lower_range);
    },
    match_range_name: function (range_name, matching_range_name) {
      if (range_name == "") {
        return true;
      } else if (range_name == matching_range_name) {
        return true;
      } else {
        return false;
      }
    },
  }
};


function isNumeric(num) {
    return !isNaN(num)
}

