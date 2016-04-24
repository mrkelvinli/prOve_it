ES = {

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
  get_event_company: function (event) {
    return event[0].toString();
  },


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

  calc_avg_cr_for_event: function (stock_price_file, company_name, date, upper_window, lower_window) {
    lower_window = Math.abs(lower_window);
    upper_window = Math.abs(upper_window);

    date = date.toUpperCase();
    
    var fields = stock_price_file[0];
    var RIC_id = fields.indexOf('#RIC');
    var date_id = fields.indexOf('Date[L]');
    var cum_return_id = fields.length + 1;

    var total_cr = 0;
    var num_cr = upper_window + lower_window + 1;

    for (var i = 1; i < stock_price_file.length; i++) {
      var curr_company_name = stock_price_file[i][RIC_id].toString();
      var curr_date = stock_price_file[i][date_id].toString().toUpperCase();

      if (curr_company_name == company_name && curr_date == date) {
        for (var j = 1; j <= lower_window; j++) {
          if (i - j >= 1) {
            var c = stock_price_file[i - j][RIC_id].toString();
            if (c == company_name) {
              total_cr += parseFloat(stock_price_file[i - j][cum_return_id].toString());
            }
          }
        }
        total_cr += parseFloat(stock_price_file[i][cum_return_id].toString());
        for (var j = 1; j <= upper_window; j++) {
          if (i + j < stock_price_file.length) {
            var c = stock_price_file[i + j][RIC_id].toString();
            if (c == company_name) {
              total_cr += parseFloat(stock_price_file[i + j][cum_return_id].toString());
            }
          }
        }
        break;
      }
    }
    return total_cr/num_cr;
  },

  store_avg_cr_for_events: function (all_events,file_token) {
    var upper_window = 5;
    var lower_window = -5;

    var stock_price_file = null;
    var company_name = all_events[i]['company_name'];
    var event_date   = all_events[i]['event_date'];


    for (var i = 0; i < all_events.length; i++) {
      var avg_cr = calc_avg_cr_for_event(stock_price_file, company_name, event_date, upper_window, lower_window);

      Events.insert({
        company_name : company_name,
        event_date   : event_date,
        avg_cr       : avg_cr,
        file_token   : file_token,
      });
    }
  }

};
