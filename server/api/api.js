API = {

  connection: function (request) {
    var getRequestContents = API.utility.getRequestContents(request);
    return {
      data: getRequestContents
    };
  },

  handleRequest: function (context, method) {
    // var csv = context.request.files[0]['contents'];
    // var rows = Papa.parse(csv).data;
    // console.log(rows);

    var connection = API.connection(context.request);
    if (!connection.error) {
      var params = connection.data;
      var files = context.request.files;
      API.methods[method](context, params, files);
    } else {
      API.utility.response(context, 401, connection);
    }
  },

  methods: {
    GET: function (context, params, files) {
      if (!API.utility.hasData(params)) {
        API.utility.response(context, 404, {
          error: 404,
          message: "Invalid Request (no parameters found), dude."
        });
      }

      var upper_window = "";
      var lower_window = "";
      var upper_range = "";
      var lower_range = "";
      var range_name = "";
      var token = params['token'];

      var status_code = 200;
      var other_vars = {};

      for (var key in params) {
        if (key == "upper_window") {
          upper_window = params['upper_window'];
          continue;
        }
        if (key == "lower_window") {
          lower_window = params['lower_window'];
          continue;
        }
        var upperRegex = /upper_([a-zA-Z\-]+)/g;
        var lowerRegex = /lower_([a-zA-Z\-]+)/g;
        var match = upperRegex.exec(key);
        if (match != null) {
          upper_range = params[key];
          var match_value = match[1];
          //          console.log(match_value);
          if (API.utility.match_range_name(range_name, match_value)) {
            range_name = match_value;
          }
          continue;
        }
        match = lowerRegex.exec(key);
        if (match != null) {
          lower_range = params[key];
          //            lower_range = parseFloat.(params[key]);
          var match_value = match[1];
          if (API.utility.match_range_name(range_name, match_value)) {
            range_name = match_value;
          }
          continue;
        }
        other_vars[key] = params[key];
      }

      // Make sure that our request has data and that the data is valid.
      var requestOK = API.utility.validateRequest(upper_window, lower_window, upper_range, lower_range, range_name);
      var tokenOK = API.utility.tokenOK(token);

      if (requestOK && tokenOK) {
        upper_window = parseFloat(upper_window);
        lower_window = parseFloat(lower_window);
        upper_range = parseFloat(upper_range);
        lower_range = parseFloat(lower_range);
        
        var file = Files.findOne({token:token});
        var stock_price_file = file.stock_price_file;
        var stock_characteristic_file = file.stock_characteristic_file;

        // the validation does nothing at the moment
        // validData = API.utility.validate( connection.data, { "a": String, "b": String });

        API.utility.response(context, status_code, {
          log: API.utility.api_log(params, files, context.request.start_time, "successful"),
          stock_price_file: stock_price_file,
          stock_characteristic_file: stock_characteristic_file,
        });
      } else if (!tokenOK) {
        API.utility.response(context, 404, {
          log: API.utility.api_log(params, files, context.request.start_time, "Invalid token."),
        });
      } else {
        API.utility.response(context, 404, {
          log: API.utility.api_log(params, files, context.request.start_time, "Invalid Request."),
        });
      }
    },
  },

  utility: {
    getRequestContents: function (request) {
      return request.query;
    },
    hasData: function (data) {
      return Object.keys(data).length > 0 ? true : false;
    },
    response: function (context, statusCode, data) {
      context.response.setHeader('Content-Type', 'application/json');
      context.response.statusCode = statusCode;
      context.response.end(JSON.stringify(data));
    },
    validate: function (data, pattern) {
      return Match.test(data, pattern);
    },
    validateRequest: function (upper_window, lower_window, upper_range, lower_range, range_name) {
      return isNumeric(upper_window) &&
        isNumeric(lower_window) &&
        isNumeric(upper_range) &&
        isNumeric(lower_range) &&
        range_name != "" &&
        parseFloat(upper_window) >= parseFloat(lower_window) &&
        parseFloat(upper_range) >= parseFloat(lower_range);
    },
    tokenOK: function (token) {
      // is there a folder called <token>?
      // if there is, do the files match?
      return Files.find({token: token}).count() === 1;
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
    api_log: function (params, files, start_time, exec_status) {
      var end_time = new Date();
      var elapsed_time = end_time.getMilliseconds() - start_time.getMilliseconds();
      var filenames = [];
      for (var id in files) {
        filenames.push(files[id]['filename']);
      }

      var log = {};
      log['team_name'] = "prOve it";
      log['version'] = 'v1';
      log['input_filename'] = filenames;
      log['parameters_passed'] = params;
      log['exec_status'] = exec_status;
      log['start_time'] = Meteor.methods.displayTime(start_time);
      log['end_time'] = Meteor.methods.displayTime(end_time);
      log['elapsed_time'] = elapsed_time.toString() + "ms";
      return log;
    },
  },
};


function isNumeric(num) {
  return !isNaN(num)
}

Meteor.methods = {
  displayTime: function (d) {
    var str = "";
    var currentTime = d;
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();
    var years = currentTime.getFullYear();
    var month = currentTime.getMonth() + 1;
    var date = currentTime.getDate();

    str = years + "-" + month + "-" + date + " "

    if (minutes < 10) {
      minutes = "0" + minutes
    }
    if (seconds < 10) {
      seconds = "0" + seconds
    }
    str += hours + ":" + minutes + ":" + seconds + " ";
    if (hours > 11) {
      str += "PM"
    } else {
      str += "AM"
    }
    return str;
  }
};