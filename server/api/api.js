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
      var topic_upper_range = "";
      var topic_lower_range = "";
      var topic_name = "";
      var token = params['token'];
      var csv_require = false;

      var other_vars = {};

      for (var key in params) {
        if (key == "upper_window") {
          upper_window = params['upper_window'];
        } else if (key == "lower_window") {
          lower_window = params['lower_window'];
        } else if (key == 'topic_upper_range') {
          topic_upper_range = params['topic_upper_range'];
        } else if (key == "topic_lower_range") {
          topic_lower_range = params['topic_lower_range'];
        } else if (key == "topic_name") {
          topic_name = params['topic_name'];
        } else if (key == "raw" && params['raw'] == 'true') {
          csv_require = true;
        } else {
          other_vars[key] = params[key];
        }
      }

      // Make sure that our request has data and that the data is valid.
      var rangeOK = API.utility.rangeOK(upper_window, lower_window, topic_upper_range, topic_lower_range);
      var tokenOK = API.utility.tokenOK(token);

      if (rangeOK && tokenOK) {
        // convert all param from string to float
        upper_window = parseInt(upper_window);
        lower_window = parseInt(lower_window);
        topic_upper_range = parseFloat(topic_upper_range);
        topic_lower_range = parseFloat(topic_lower_range);

        // get the file assiciated to the token
        var file = Files.findOne({
          token: token
        });
        var stock_price_file = file.stock_price_file;
        var stock_characteristic_file = file.stock_characteristic_file;

        // check if the topic name is in the stock characteristic file
        var topicNameOK = API.utility.topicNameOK(topic_name, stock_characteristic_file);
        if (!topicNameOK) {
          API.utility.response(context, 404, {
            log: API.utility.api_log(params, files, context.request.start_time, "Invalid topic name."),
          });
          return;
        }

        var events = ES.get_events(stock_characteristic_file, topic_name, topic_upper_range, topic_lower_range);
        var events_and_cum_returns = [];
        for (var i = 0; i < events.length; i++) {
          events_and_cum_returns.push(ES.get_cum_return(stock_price_file, events[i], upper_window, lower_window));
        }

        var csv_raw_token = '';
        if (csv_require) {
          var csv_raw = Papa.unparse(events_and_cum_returns);
          csv_raw_token = Random.id(30);
          while (Raw_CR_CSV.find({
              token: csv_raw_token
            }).count() !== 0) {
            csv_raw_token = Random.id(20);
          }
          Raw_CR_CSV.insert({
            token: csv_raw_token,
            csv: csv_raw,
          });
        }


        API.utility.response(context, 200, {
          log: API.utility.api_log(params, files, context.request.start_time, "successful"),
//          cr_csv_token: csv_raw_token,
          Event_Cumulative_Return: events_and_cum_returns,
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
    rangeOK: function (upper_window, lower_window, topic_upper_range, topic_lower_range) {
      return isNumeric(upper_window) &&
        isNumeric(lower_window) &&
        isNumeric(topic_upper_range) &&
        isNumeric(topic_lower_range) &&
        parseInt(upper_window) >= parseInt(lower_window) &&
        parseFloat(topic_upper_range) >= parseFloat(topic_lower_range) &&
        parseInt(lower_window) <= 0 &&
        parseInt(upper_window) >= 0;
    },
    topicNameOK: function (topic_name, stock_characteristic_file) {
      var fields = stock_characteristic_file[0];
      return fields.indexOf(topic_name) != -1 && fields.indexOf(topic_name) != 0;
    },
    tokenOK: function (token) {
      // is there a folder called <token>?
      // if there is, do the files match?
      return Files.find({
        token: token
      }).count() === 1;
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