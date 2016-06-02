Uploader = {
  connection: function (request) {
    var getRequestContents = Uploader.utility.getRequestContents(request);
    return {
      data: getRequestContents
    };
  },

  handleRequest: function (context, method) {
    var connection = Uploader.connection(context.request);
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
      
      if (!files) {
        API.utility.response(context, 404, {
            log: API.utility.api_log(params, files, context.request.start_time, "No CSV file."),
        });
        return;
      }

      // console.log(context);
      // console.log(context.response);


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

        // var stock_price_file_with_cr = ES.calc_cumulative_returns(stock_price_file_json);
        // var all_query_company = ES.get_all_query_company(stock_characteristic_file_json);

        // current: /prOve_it/.meteor/local/build/programs/server/
        if (Market.find({}).count() === 0) {
          console.log("EMPTY");
          var contents = fs.readFileSync(process.cwd() + '/../../../../../public/marketPrices10.csv', 'utf8');
          // console.log(contents);
          // console.log('second: ' + file == null);
          var marketObject = null;
          if (contents != null) {
            marketObject = Papa.parse(contents);
          } else {
            console.warn('contents from fs is null');
          }
          if (marketObject != null) {
            console.log("market csv parsed ok");
            ES.process_market_file(marketObject.data);
          } else {
            console.warn('market object is null');
          }
        } else {
          console.log("NOT EMPTY: " + Market.find({}).count());
        }



        // StockPrices.remove({});
        // StockEvents.remove({});
        ES.process_stock_price_file(stock_price_file_json, token);
        ES.process_stock_characteristic_file(stock_characteristic_file_json, token);


        API.utility.response(context, 200, {
          log: API.utility.api_log(params, files, context.request.start_time, "Successful."),
          token: token,
        });

        
        ES.process_regressions(token);
        
        if (Regressions.find({}).count() !== 0) {
          console.log('Regressions processed');
        } else {
          console.log('Regressions not processed');
        }

        console.log("process ok");

        // Add the two files with the token to the database
        // Files.insert({
        //   token: token,
        //   stock_price_file: stock_price_file_with_cr,
        //   stock_characteristic_file: stock_characteristic_file_json,
        //   all_query_company: all_query_company,
        // });


        // pre calculate the average cumulative return and store it to the database
        // if the request param avg is true
        // var avg = params['avg'];
        // if (avg) {
        //   Events.remove({});
        //   var all_events = ES.get_all_events(stock_characteristic_file_json);
        //   ES.store_avg_cr_for_events(stock_price_file_with_cr,all_events,token);
        //   console.log(Events.find().fetch());
        // }

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
          if (fields.indexOf('Open') != -1 && fields.indexOf('Date[L]') != -1 && fields.indexOf('Time[L]') != -1 &&
            fields.indexOf('Type') != -1 && fields.indexOf('Qualifiers') != -1 && fields.indexOf('High') != -1 &&
            fields.indexOf('Low') != -1 && fields.indexOf('Last') != -1 && fields.indexOf('Volume') != -1 &&
            fields.indexOf('Open Interest') != -1 && fields.indexOf('Settle') != -1 &&
            fields.indexOf('Data Source') != -1) {
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
//      console.log("stock_price_OK: " + stock_price_file_OK);
//      console.log("stock_characteristic_file_OK: " + stock_characteristic_file_OK);
      return files.length == 2 &&
        stock_price_file_OK &&
        stock_characteristic_file_OK;
    },
  },
};