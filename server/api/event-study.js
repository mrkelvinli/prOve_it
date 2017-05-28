
ES = {
  


  // return the cumulative returns with upper window and lower window 
  get_cum_return: function (stock_price_file, event, upper_window, lower_window) {
    lower_window = Math.abs(lower_window);
    upper_window = Math.abs(upper_window);

    var company_name = ES.get_event_company(event);
    var date = ES.get_event_date(event).toUpperCase();
    
    var fields = stock_price_file[0];
    var RIC_id = fields.indexOf('#RIC');
    var date_id = fields.indexOf('Date[L]');
    var cum_return_id = fields.length + 1;

    var cum_return = [];

    for (var i = 1; i < stock_price_file.length; i++) {
      var curr_company_name = stock_price_file[i][RIC_id].toString();
      var curr_date = stock_price_file[i][date_id].toString().toUpperCase();

      if (curr_company_name == company_name && curr_date == date) {
        for (var j = 1; j <= lower_window; j++) {

          if (i - j < 1) {
            var ret = {};
            ret[-j] = null;
            cum_return.unshift(ret);
          } else {
            var c = stock_price_file[i - j][RIC_id].toString();
            if (c == company_name) {
              var ret = {};
              ret[-j] = parseFloat(stock_price_file[i - j][cum_return_id].toString());
              cum_return.unshift(ret);
            } else {
              var ret = {};
              ret[-j] = null;
              cum_return.unshift(ret);
            }
          }
        }
        var ret = {};
        ret[0] = parseFloat(stock_price_file[i][cum_return_id].toString());
        cum_return.push(ret);
        for (var j = 1; j <= upper_window; j++) {
          if (i + j >= stock_price_file.length) {
            var ret = {};
            ret[j] = null;
            cum_return.push(ret);
          } else {
            var c = stock_price_file[i + j][RIC_id].toString();
            if (c == company_name) {
              var ret = {};
              ret[j] = parseFloat(stock_price_file[i + j][cum_return_id].toString());
              cum_return.push(ret);
            } else {
              var ret = {};
              ret[j] = null;
              cum_return.push(ret);
            }
          }
        }
        break;
      }
    }
    return {
      company_name: company_name,
      event_date: date,
      cumulative_returns: cum_return,
    }
  },



  get_all_events: function(stock_characteristic_file) {
    var title_line = stock_characteristic_file[0];
    var line_length = title_line.length();
    var results = [];
    for (var i=0; i<stock_characteristic_file.length(); i++) {
      var current_line = stock_characteristic_file[i];
      for (var j=2; j<line_length; j++) {
        if (current_line[j] == 1) {
          var company_name = title_line[0].toString();
          var date = title_line[1].toString();
          var event_type = title_line[j].toString();
          var value = current_line[j];
          result.push({
            company_name: company_name,
            date: date,
            event_type: event_type,
            value: value,
          });
        }
      }
    }
    return results;
  },

  // calculate the cumulative return for each day in the stock price file
  get_all_events: function(stock_characteristic_file) {
    var title_line = stock_characteristic_file[0];
    var line_length = title_line.length();
    var results = [];
    for (var i=0; i<stock_characteristic_file.length(); i++) {
      var current_line = stock_characteristic_file[i];
      for (var j=2; j<line_length; j++) {
        if (current_line[j] == 1) {
          var company_name = title_line[0].toString();
          var date = title_line[1].toString();
          var event_type = title_line[j].toString();
          var value = current_line[j];
          result.push({
            company_name: company_name,
            date: date,
            event_type: event_type,
            value: value,
          });
        }
      }
    }
    return results;
  },

  calc_cumulative_returns: function (stock_price_file) {
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

    var prev_company = "";
    var prev_last = 0;

    // for debug
    //  var nLine = 0;


    for (var i = 1; i < stock_price_file.length; i++) {
      //    var isC = false;
      //    if (stock_price_file[i][RIC_id].toString() == "ELD.AX"){
      //      isC = true;
      //    }
      //
      //    if (nLine == 10) {
      //      break;
      //    }
      //    if (isC) {
      //      nLine++;
      //    }

      //    console.log("newline");
      var current_last = stock_price_file[i][last_id];
      if (current_last == '') {
        //      console.log("no last");
        if (prev_company != stock_price_file[i][RIC_id].toString()) {
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
          //        current_company = same_c;
          current_last = open;
        } else {
          current_last = prev_last;
        }
      } else if (prev_company != stock_price_file[i][RIC_id].toString()) {
        prev_last = 0;
      }

      //    if (isC) {
      //      console.log("prev_last" + prev_last);
      //      console.log("current_last" + current_last);
      //    }
      // calculate the cumulative return percentage and cum return here
      if (prev_last == 0) {
        stock_price_file[i][return_percent_id] = 0;
      } else {
        stock_price_file[i][return_percent_id] = (current_last - prev_last) / prev_last;
      }


      var cum_return = 0;
      var prev_c = stock_price_file[i - 1][RIC_id].toString();
      //    if (isC) {
      //
      //      console.log("prev_c: " + prev_c);
      //      console.log("curr_c: " + stock_price_file[i][RIC_id].toString());
      //    }
      if (stock_price_file[i][RIC_id].toString() != prev_c) {
        cum_return = stock_price_file[i][return_percent_id];
        //      if (isC) {
        //        console.log("different company");
        //      }
      } else {
        //      if (isC) {
        //        console.log("same company");
        //      }
        cum_return = stock_price_file[i][return_percent_id] + stock_price_file[i - 1][cum_return_id];

      }
      stock_price_file[i][cum_return_id] = cum_return;
      //    if (isC) {
      //      console.log("cum%: " + stock_price_file[i][return_percent_id]);
      //      console.log("cum return: " + stock_price_file[i][cum_return_id]);
      //    }
      prev_last = current_last;
      prev_company = stock_price_file[i][RIC_id].toString();
    }

    return stock_price_file;
  },








// ------------------------------------------------------------







  // calculate the average cumulative return for each event
  calc_avg_cr_for_event_and_get_upper_lower_date: function (stock_price_file, company_name, date, upper_window, lower_window) {
    lower_window = Math.abs(lower_window);
    upper_window = Math.abs(upper_window);

    date = date.toUpperCase();
    
    var fields = stock_price_file[0];
    var RIC_id = fields.indexOf('#RIC');
    var date_id = fields.indexOf('Date[L]');
    var cum_return_id = fields.length + 1;

    var total_cr = 0;
    // var num_cr = upper_window + lower_window + 1;
    var num_cr = 0;

    var upper_date;
    var lower_date;

    var OK = false;

    for (var i = 1; i < stock_price_file.length; i++) {
      var curr_company_name = stock_price_file[i][RIC_id].toString();
      var curr_date = stock_price_file[i][date_id].toString().toUpperCase();

      if (curr_company_name == company_name && curr_date == date) {
        for (var j = 1; j <= lower_window; j++) {
          if (i - j >= 1) {
            var c = stock_price_file[i - j][RIC_id].toString();
            if (c == company_name) {
              num_cr++;
              lower_date = stock_price_file[i-j][date_id].toUpperCase();
              total_cr += parseFloat(stock_price_file[i - j][cum_return_id].toString());
            }
          }
        }
        num_cr++;
        total_cr += parseFloat(stock_price_file[i][cum_return_id].toString());
        for (var j = 1; j <= upper_window; j++) {
          if (i + j < stock_price_file.length) {
            var c = stock_price_file[i + j][RIC_id].toString();
            if (c == company_name) {
              num_cr++;
              upper_date = stock_price_file[i+j][date_id].toUpperCase();
              total_cr += parseFloat(stock_price_file[i + j][cum_return_id].toString());
            }
          }
        }
        break;
        OK = true;
      }
    }

    if (!OK) {
      // return null;
      console.log("cannot match");
    }
    // console.log("return : "+total_cr/num_cr+" "+lower_date+" "+upper_date)
    return [total_cr/num_cr,lower_date,upper_date];
  },

  // store the average cumulative return for each event to the Events Database
  avg_cr_for_events: function (stock_price_file,all_events,file_token) {
    var upper_window = 5;
    var lower_window = -5;

    for (var i = 0; i < all_events.length; i++) {
      var company_name = all_events[i]['company_name'];
      var event_date   = all_events[i]['date'];
      event_date = event_date.toUpperCase();
      var topic = all_events[i]['event_type'];
      var topic_val = all_events[i]['value'];
      var event_data = ES.calc_avg_cr_for_event_and_get_upper_lower_date(stock_price_file, company_name, event_date, upper_window, lower_window);

      // if (event_data == null) {
      //   continue;
      // }

      var lower_date = event_data[1];
      var upper_date = event_data[2];
      var avg_cr = event_data[0];

      console.log("avg_cr: " +avg_cr);
      console.log("lower_date: " +lower_date);
      console.log("upper_date: " +upper_date);

      if (isNaN(avg_cr)) {
        continue;
      }

      Events.insert({
        company_name : company_name,
        event_date   : event_date,
        avg_cr       : avg_cr,
        topic        : topic,
        topic_val    : topic_val,
        lower_date   : lower_date,
        upper_date   : upper_date,
        file_token   : file_token,
      });
    }
  },

  company_and_avg_cr_for_topic: function (all_company, token) {
    for (var c in all_company) {
      var company_name = all_company[c];
      var all_events = Events.find({company_name: company_name, file_token: token}).fetch();
      // var distinct_topics = Events.distinct('topic').find({company_name: company_name, file_token: token});
      var distinct_topics = getDistinctTopic(company_name,token);
      // console.log("distinct");
      // console.log(distinct_topics);
      for (var t in distinct_topics) {
        var all_topic_events = Events.find({company_name: company_name, topic: distinct_topics[t],file_token:token}).fetch();
        var sum_cr = 0;
        for (var e in all_topic_events) {
          // console.log(all_topic_events[e]);
          if (!isNaN(all_topic_events[e]['avg_cr'])) {
            sum_cr += all_topic_events[e]['avg_cr'];
          }
        }
        var avg_avg_cr = sum_cr/(all_topic_events).length;
        // console.log(avg_avg_cr);
        Topics.insert({
          company_name : company_name,
          topic        : distinct_topics[t],
          avg_cr_topic : avg_avg_cr,
          file_token   : token,
        });
      }
    }

  },

  company_avg_cr: function (all_company, token) {
    for (var c in all_company) {
      var company_name = all_company[c];
      var topics = Topics.find({company_name: company_name, file_token: token}).fetch();
      var sum_avg_cr = 0;
      if (topics.length == 0) {
        continue;
      }
      for (var t in topics) {
        sum_avg_cr += topics[t]['avg_cr_topic'];
      }
      var avg_avg_topic_cr = sum_avg_cr / (topics.length);


      Companys.insert({
        company_name : company_name,
        avg_cr       : avg_avg_topic_cr,
        file_token   : token,
      });
    }
  },

  populate_stocks_db: function (stock_price_file) {
    var fields = stock_price_file[0];
    var RIC_id = fields.indexOf('#RIC');
    var date_id = fields.indexOf('Date[L]');
    var open_id = fields.indexOf('Open');
    var last_id = fields.indexOf('Last');
    var return_percent_id = fields.length;
    var high = fields.indexOf('High');
    var low = fields.indexOf('Low');

    var cum_return_id = fields.length + 1;

    for (var i = 1; i < stock_price_file.length; i++) {
      Stocks.insert({
        company_name : stock_price_file[i][RIC_id].toString(),
        date         : stock_price_file[i][date_id].toUpperCase(),
        open_price   : parseFloat(stock_price_file[i][open_id]),
        last_price   : parseFloat(stock_price_file[i][last_id]),
        cr           : parseFloat(stock_price_file[i][cum_return_id]),
        // close        : parseFloat(stock_price_file[i][close]),
        high         : parseFloat(stock_price_file[i][high]),
        low          : parseFloat(stock_price_file[i][low]),
      });
    }
  },

  //--------------- new function --------------

  process_stock_price_file: function (stock_price_file, token) {
    // if (stock_price_file == null) {
    //   return stock_price_file;
    // }
    var fields = stock_price_file[0];
    var RIC_id = fields.indexOf('#RIC');
    var date_id = fields.indexOf('Date[L]');
    var open_id = fields.indexOf('Open');
    var last_id = fields.indexOf('Last');
    var high_id =  fields.indexOf('High');
    var low_id  = fields.indexOf('Low');
    var volume_id = fields.indexOf('Volume');
    var return_percent_id = fields.length;
    var cum_return_id = fields.length + 1;


    var prev_company = "";
    var prev_last = 0;
    // for (var i = 1; i < 2; i++) {
    for (var i = 1; i < stock_price_file.length; i++) {
      // start to calcualte CR
      var current_last = stock_price_file[i][last_id];
      if (current_last == '') {
        if (prev_company != stock_price_file[i][RIC_id].toString()) {
          prev_last = 0;
          var same_c = stock_price_file[i][RIC_id].toString();
          var open = stock_price_file[i][open_id];
          for (var j = i; j < stock_price_file.length; j++) {
            if (stock_price_file[j][RIC_id].toString() == same_c && stock_price_file[j][open_id] != '') {
              open = stock_price_file[j][open_id];
              break;
            }
          }
          current_last = open;
        } else {
          current_last = prev_last;
        }
      } else if (prev_company != stock_price_file[i][RIC_id].toString()) {
        prev_last = 0;
      }
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
        cum_return = stock_price_file[i][return_percent_id] + stock_price_file[i - 1][cum_return_id];

      }
      stock_price_file[i][cum_return_id] = cum_return;
      prev_last = current_last;
      prev_company = stock_price_file[i][RIC_id].toString();

      // end calculating CR

      var company_name = stock_price_file[i][RIC_id].toString();
      var date = parseDate(stock_price_file[i][date_id])
      var open = stock_price_file[i][open_id];
      open = open == '' ? null : parseFloat(open);
      var last = stock_price_file[i][last_id];
      last = last == '' ? null : parseFloat(last);
      var high = stock_price_file[i][high_id];
      high = high == '' ? null : parseFloat(high);
      var low = stock_price_file[i][low_id];
      low = low == '' ? null : parseFloat(low);
      var volume = stock_price_file[i][volume_id];
      volume = volume == '' ? null : parseFloat(volume);
      var flat_value = null;
      if (open != null && last != null) {
        flat_value = (open + last) / 2;
      }

      StockPrices.insert({
        company_name:   company_name,
        date:           date,
        open:           open,
        last:           last,
        high:           high,
        low:            low,
        volume:         volume,
        return_percent: parseFloat(stock_price_file[i][return_percent_id]),
        cum_return:     parseFloat(stock_price_file[i][cum_return_id]),
        flat_value:     flat_value,
        token:          token,
      });

    }
    // return stock_price_file;
  },


  process_stock_characteristic_file: function (stock_characteristic_file, token){
    var fields = stock_characteristic_file[0];
    var RIC_id = fields.indexOf('#RIC');
    var date_id = fields.indexOf('Event Date');
    var topics = get_all_topics(stock_characteristic_file);
    var n_topics = topics.length;
    for (var i = 1; i < stock_characteristic_file.length; i++){
      var line = stock_characteristic_file[i];
      var company_name = line[RIC_id].toString();
      var date = parseDate(line[date_id]);
      for (var j = 0; j < n_topics; j++){
        var topic_idx = j + 2;
        var topic_name = topics[j].toString();
        // console.log(topic_name);
        var value = parseFloat(line[topic_idx]);
        StockEvents.insert({
          company_name: company_name,
          date:         date,
          topic:        topic_name,
          value:        value,
          token:        token,
        });
      }
    }
  },

  // at the moment, only one market index file of 2016-2016, not dynamic
  process_market_file: function(market_file) {
    // var Fiber = Npm.require('fibers');
    // Fiber(function() {
    var fields = market_file[0];
    var date_id = fields.indexOf('date');
    var value_id = fields.indexOf('value');
    // var momentum_id = fields.indexOf('momentum');
    console.log(fields);

    for (var i = 1; i < market_file.length; i++) {
      var line = market_file[i];
      var dateString = line[date_id];
      var value = line[value_id];
      // var momentum = line[momentum_id];

      // create new utc date, DD/MM/YYYY
      var regex = /^([0-9]{1}[0-9]?)\/([0-9]{1}[0-9]?)\/([0-9]{4})/;
      var matches = regex.exec(dateString);
      var year;
      var month;
      var date;
      if (matches == null) {
        console.warn('cant make utc date: `' + dateString + '`');
        var onlyForParsing = new Date(dateString);
        year = onlyForParsing.getUTCFullYear();
        month = onlyForParsing.getUTCMonth();
        date = onlyForParsing.getUTCDate();
      } else {
        date = parseInt(matches[1]);
        month = parseInt(matches[2]);
        year = parseInt(matches[3]);
      }
      var wantedDate = new Date(Date.UTC(year, month, date, 6));
      Market.insert({
        date: wantedDate,
        value: value,
        // momentum: momentum,
      });
    }
    // });
  },
  process_regressions: function(token) {
    var all_company = _.uniq(StockPrices.find({token:token}, {fields:{company_name:1}},{sort:{company_name: 1}}).fetch().map(function(x){return x.company_name}),true);
    console.log('    > regressions: IN FUNCTION ' + all_company);
      all_company.forEach(function(company) {
        // console.log('    > regressions: ENTERS LOOP');
      var company_prices = StockPrices.find({token: token, company_name: company, cum_return: {$ne: null}},{fields:{cum_return:true, date:true, _id:false}}).fetch();

      var data = [];
      var prev_price = null;
      var prev_market = null;
      company_prices.forEach(function(entry) {
        var date = entry.date;
        var price = entry.cum_return;
        var db_query = Market.findOne({date: date}, {fields: {value: true, _id: false}});
        if ((db_query != null) && (price != null)) {
          var market_price = parseFloat(db_query.value);
          //console.log('cr: ' + price + ', market: ' + market_price + ', date: ' + date);
          data.push([market_price, price]);
        }
      });
      // console.log("    > regressions: PUSHING!!");
      // put 'data' into db
      Regressions.insert({
        company: company,
        data: data,
        token: token,
      });
    });
  },

  // -------- old getter function
    get_cum_return_by_date: function (stock_price_file, c_name, date) {
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
    for (var i = 1; i < stock_price_file.length; i++) {
      if (stock_price_file[i][RIC_id].toString() == c_name && stock_price_file[i][date_id].toString() == date) {
        return stock_price_file[i];
      }
    }
    return null;
  },

  // get all the line that have the type of event with in the upper range and lower range
  get_events: function (stock_characteristic_file, topic_name, upper_range, lower_range) {
    //  
    //  console.log("topic_name: "+topic_name);
    //  console.log("upper_range: "+upper_range);
    //  console.log("lower_range: "+lower_range);
    //  
    var fields = stock_characteristic_file[0];
    var topic_id = fields.indexOf(topic_name);
    var rel_events = [];

    //  console.log("topic id: "+topic_id);

    if (topic_id == -1) return [];

    for (var i = 0; i < stock_characteristic_file.length; i++) {
      var curr_val = stock_characteristic_file[i][topic_id];
      //    console.log(curr_val);
      if (curr_val <= upper_range && curr_val >= lower_range) {
        rel_events.push(stock_characteristic_file[i]);
      }
    }
    return rel_events;
  },

  // return the correct date format of the event line
  get_event_date: function (event) {

    // needs to be in format: dd-mmm-yyyy
    var uncheckedDate = event[1].toString();
    var checkedDayDate = uncheckedDate;
    var checkedDate = uncheckedDate;
    if (!uncheckedDate.match(/^[0-9]{2}-[a-zA-Z]{3}-[0-9]{4}$/)) {
      // doesn't match format, probably missing digit(s) from day or year
      if (uncheckedDate.match(/^[0-9]{1}-[a-zA-Z]{3}/)) {
        // weird day
        checkedDayDate = "0" + uncheckedDate;
      }
      if (checkedDayDate.match(/^[0-9]{2}-[a-zA-Z]{3}-[0-9]{2}$/)) {
        // weird year, assume all years are 2000 or after
        checkedDate = checkedDayDate.replace(/([0-9]{2}-[a-zA-Z]{3}-)([0-9]{2})/, "$120$2");
      }
    }
    // HELP!! why does it not work if it's '02-Mar-2016'?
    //    if (checkedDate === '02-Mar-2016') {
    //      console.log("found");
    //      checkedDate = '02-Mar-16';
    //    }
    //    console.log(checkedDate);
    return checkedDate;
  },

  // return the company name of the event line
  get_event_company: function (event) {
    return event[0].toString();
  },


  // return a JSON of each individual in the stock characteristic file
  get_all_events: function(stock_characteristic_file) {
    var title_line = stock_characteristic_file[0];
    var line_length = title_line.length;
    var results = [];
    for (var i=1; i < stock_characteristic_file.length; i++) {

      var current_line = stock_characteristic_file[i];
      // console.log(current_line);
      for (var j=2; j<line_length; j++) {
        if (current_line[j] > 0) {
          var company_name = current_line[0].toString();
          var date = current_line[1].toString();
          var event_type = title_line[j].toString();
          var value = current_line[j];
          results.push({
            company_name: company_name,
            date: date,
            event_type: event_type,
            value: value,
          });
        }
      }
    }
    return results;
  },

  get_all_event_type: function(stock_characteristic_file){
    var fields = stock_characteristic_file[0];
    var topics = fields.slice(2, fields.length);
    return topics;
  },


  // return all campany names in files
  get_all_query_company: function (file) {
    if (file == null) {
      return file;
    }

    var fields = file[0];
    var RIC_id = fields.indexOf('#RIC');

    var all_company = [];

    for (var i = 1; i < file.length; i++) {
      var c = file[i][RIC_id].toString();
      if (all_company.indexOf(c) == -1) {
        all_company.push(c);
      }
    }
    return all_company;
  },




};

function getDistinctTopic(company_name,token) {
  // console.log(company_name+" "+token);
  var data = Events.find({company_name: company_name, file_token: token}).fetch();
  var distinctData = _.uniq(data, false, function(d) {return d.topic});
  return _.pluck(distinctData, "topic");
}

// return the correct date format of the event line
function parseDate (d) {

  // needs to be in format: dd-mmm-yyyy
  var uncheckedDate = d;
  var checkedDayDate = uncheckedDate;
  var checkedDate = uncheckedDate;
  if (!uncheckedDate.match(/^[0-9]{2}-[a-zA-Z]{3}-[0-9]{4}$/)) {
    // doesn't match format, probably missing digit(s) from day or year
    if (uncheckedDate.match(/^[0-9]{1}-[a-zA-Z]{3}/)) {
      // weird day
      checkedDayDate = "0" + uncheckedDate;
    }
    if (checkedDayDate.match(/^[0-9]{2}-[a-zA-Z]{3}-[0-9]{2}$/)) {
      // weird year, assume all years are 2000 or after
      checkedDate = checkedDayDate.replace(/([0-9]{2}-[a-zA-Z]{3}-)([0-9]{2})/, "$120$2");
    }
  }
  // var onlyForParsing = new Date(checkedDate);
  // var year = onlyForParsing.getFullYear();
  // var month = onlyForParsing.getMonth();
  // var date = onlyForParsing.getDate();
  var string2num = {
    'JAN' : 1,
    'FEB' : 2,
    'MAR' : 3,
    'APR' : 4,
    'MAY' : 5,
    'JUN' : 6,
    'JUL' : 7,
    'AUG' : 8,
    'SEP' : 9,
    'OCT' : 10,
    'NOV' : 11,
    'DEC' : 12,
    'JANUARY' : 1,
    'FEBRUARY' : 2,
    'MARCH' : 3,
    'APRIL' : 4,
    'JUNE' : 6,
    'JULY' : 7,
    'AUGUST' : 8,
    'SEPTEMBER' : 9,
    'OCTOBER' : 10,
    'NOVEMBER' : 11,
    'DECEMBER' : 12
  }
  var regex = /^([0-9]{2})-([a-zA-Z]+)-([0-9]{4})/;
  var matches = regex.exec(checkedDate);
  if (matches == null) {
    console.log(checkedDate);
    var onlyForParsing = new Date(checkedDate);
    var year = onlyForParsing.getFullYear();
    var month = onlyForParsing.getMonth();
    var date = onlyForParsing.getDate();
  } else {
    var date = matches[1];

    var month = string2num[matches[2].toUpperCase()] - 1;
    var year = matches[3];
    var wantedDate = new Date(Date.UTC(year, month, date, 6));
    
    
  }
  return wantedDate;
}

function get_all_topics (stock_characteristic_file){
  var fields = stock_characteristic_file[0];
  var topics = fields.slice(2, fields.length);
  return topics;
}













