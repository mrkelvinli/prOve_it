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
      // Make sure that our request has data and that the data is valid.
      var hasData   = API.utility.hasData( params );
          // the validation does nothing at the moment
          // validData = API.utility.validate( connection.data, { "a": String, "b": String });

      if ( hasData) {

        var csv = files[0]['contents'];
        var rows = Papa.parse(csv).data;

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

            range_name = match[1];
            continue;
          }
          match = lowerRegex.exec(key);
          if (match != null) {
            lower_range = params[key];
            range_name = match[1];
            continue;
          }
          other_vars[key] = params[key];
        }

        API.utility.response( context, 200, {
          upper_window : upper_window,
          lower_window : lower_window,
          upper_range  : upper_range,
          lower_range  : lower_range,
          range_name   : range_name,
          other_var    : other_vars,
          csv          : rows,
        });
      } else {
        API.utility.response( context, 404, { error: 404, message: "No parameters found, dude." } );
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
      return true;
      return Match.test( data, pattern );
    }
  }
};
