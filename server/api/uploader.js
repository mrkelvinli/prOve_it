Uploader = {
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
      var files = context.request.files;
      Uploader.methods[method](context, params, files);
    } else {
      API.utility.response(context, 401, connection);
    }
  },

  methods: {
    POST: function (context, params, files) {


      // files parsing
      for (var id in files) {

        var parseObject = Papa.parse(files[id]['contents'], {
          skipEmptyLines: true
        });
        files[id]['json'] = parseObject.data;
        files[id]['errors'] = parseObject.errors;
        if (files[id]['errors'].length > 0) {
          API.utility.response(context, 422, {
            log: API.utility.api_log(params, files, context.request.start_time, "CSV file isn't formatted correctly."),
          });
        }


      }

      // Make sure that our request has data and that the data is valid.
      var requestOK = Uploader.utility.validateRequest(files);

      if (requestOK) {
        var stock_price_file_json = null;
        var stock_characteristic_file_json = null;
        var token = Random.id(20);
        while (Files.find({
            token: token
          }).count() !== 0) {
          token = Random.id(20);
        }

        // 
        for (var id in files) {
          if (files[id]['fieldname'] == "stock_price_file") {
            stock_price_file_json = files[id]['json'];
            //            console.log("saving price file");
          } else if (files[id]['fieldname'] == "stock_characteristic_file") {
            stock_characteristic_file_json = files[id]['json'];
          }
        }

        var stock_price_file_with_cr = calc_cumulative_returns(stock_price_file_json);
        var all_query_company = get_all_query_company(stock_characteristic_file_json);


        // Add the two files with the token to the database
        Files.insert({
          token: token,
          stock_price_file: stock_price_file_with_cr,
          stock_characteristic_file: stock_characteristic_file_json,
          all_query_company: all_query_company,
        });


        API.utility.response(context, 200, {
          log: API.utility.api_log(params, files, context.request.start_time, "successful"),
          token: token,
          all_query_company : all_query_company,
          //          stock_price_file: stock_price_file_with_cr,
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
    validateRequest: function (files) {
      var stock_price_file_OK = false;
      var stock_characteristic_file_OK = false
      for (var id in files) {
        if (files[id]['fieldname'] == "stock_price_file" && !stock_price_file_OK) {
          var fields = files[id]['json'][0];
          if (fields.indexOf('Open') && fields.indexOf('Date[L]') && fields.indexOf('Time[L]') &&
            fields.indexOf('Type') && fields.indexOf('Qualifiers') && fields.indexOf('High') &&
            fields.indexOf('Low') && fields.indexOf('Last') && fields.indexOf('Volume') &&
            fields.indexOf('Open Interest') && fields.indexOf('Settle') &&
            fields.indexOf('Data Source')) {
            stock_price_file_OK = true;
          }
        } else if (files[id]['fieldname'] == "stock_characteristic_file" &&
          !stock_characteristic_file_OK) {
          var fields = files[id]['json'][0];
          if (fields.indexOf('Event Date')) {
            stock_characteristic_file_OK = true;
          }
        }
      }
      return files.length == 2 &&
        stock_price_file_OK &&
        stock_characteristic_file_OK;
    },
  },
};

function get_all_query_company(stock_characteristic_file) {
  if (stock_characteristic_file == null) {
    return stock_characteristic_file;
  }

  var fields = stock_characteristic_file[0];
  var RIC_id = fields.indexOf('#RIC');

  var all_company = [];
  
  for (var i = 1; i < stock_characteristic_file.length; i++) {
    var c = stock_characteristic_file[i][RIC_id].toString();
    if (all_company.indexOf(c) == -1){
      all_company.push(c);
    }
  }
  
  return all_company;

}

function calc_cumulative_returns(stock_price_file) {
  if (stock_price_file == null) {
    return stock_price_file;
  }
  var fields = stock_price_file[0];
  var RIC_id = fields.indexOf('#RIC');
  var date_id = fields.indexOf('Date[L]');
  var open_id = fields.indexOf('Open');
  var last_id = fields.indexOf('Last');

  var return_percent_id = fields.length;
  var cum_return_id = fields.length + 1;

  var current_company = "";
  var current_company_open = "";
  var prev_last = 0;

  for (var i = 1; i < stock_price_file.length; i++) {
    //    console.log("newline");
    var current_last = stock_price_file[i][last_id];
    if (current_last == '') {
      //      console.log("no last");
      if (current_company != stock_price_file[i][RIC_id].toString()) {
        prev_last = 0;
        //        console.log("different company");
        var same_c = stock_price_file[i][RIC_id].toString();
        var open = stock_price_file[i][open_id];
        for (var j = i; j < stock_price_file.length; j++) {
          //          console.log("checking" + stock_price_file[j].toString());
          if (stock_price_file[j][RIC_id].toString() == same_c && stock_price_file[j][open_id] != '') {
            open = stock_price_file[j][open_id];
            //            console.log("found a better open: " + open);
            break;
          }
        }
        current_company = same_c;
        current_company_open = open;
        current_last = open;
      } else {
        current_last = prev_last;
      }
    }

    //    console.log("prev_last" + prev_last);
    //    console.log("current_last" + current_last);

    // calculate the cumulative return percentage and cum return here
    if (prev_last == 0) {
      stock_price_file[i][return_percent_id] = 0;
    } else {
      stock_price_file[i][return_percent_id] = (current_last - prev_last) / prev_last;
    }

    var cum_return = 0;
    var prev_c = stock_price_file[i - 1][RIC_id].toString();
    if (stock_price_file[i][RIC_id].toString() != prev_c) {
      cum_return = stock_price_file[i][return_percent_id];
    } else {
      cum_return = stock_price_file[i][return_percent_id] + stock_price_file[i - 1][return_percent_id];

    }
    stock_price_file[i][cum_return_id] = cum_return;

    //    console.log("cum%: " + stock_price_file[i][return_percent_id]);
    //    console.log("cum return: " + stock_price_file[i][cum_return_id]);

    prev_last = current_last;
  }

  return stock_price_file;
}