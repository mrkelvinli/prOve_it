APItesting = {
  handleRequest: function (context, method) {
    var params = context.request.query;
    APItesting.methods[method](context, params);
  },

  methods: {
    GET: function (context, params) {

      var token = "ZMThqeZuRXPewD3xfe4g"; // remember to change
      var company_name = "AAC.AX";
      var topic = "Cash Rate";
      var lower_range = -5;
      var upper_range = 5;

      var stock_prices = StockPrices.find({company_name: company_name, token: token, 'open': {$ne : null}}, {fields: {'date':1, 'open':1, 'last':1, 'high':1, 'low':1, 'volume':1, 'flat_value':1}}).fetch();
      //calculate MACD
      var toDoList = []; //array of arrays of values [[1,2],[2,3],[9,10]]
      var ppo = [];
      var currPrice = prevPrice = 0;
      var avg = 0;
      var currPrice = 0;
      var prevPrice = 0;
      //calculate standard deviation
      currPrice = prevPrice = 0;
      var range = 30;
      for(var i = 0; i<(stock_prices.length); i++) {
        var bigArray = [];
        var smallArray = [];

        if (i < 29) {
          //currArray.push(stock_prices[i].price);
        } 
        for(var x = 0; x<30; x++) {
          if (i>=29) {
            if (x < 15) {
              smallArray.push(stock_prices[i-x].last);
            }
            bigArray.push(stock_prices[i-x].last);
          }
        }
        var entry = {};
        if (i > 29) {
          var result = average(bigArray);
          var result2 = average(smallArray);
          entry = {"bigAvg": result, "smallAvg": result2, "date": stock_prices[i-30].date, "open": stock_prices[i].open, "last": stock_prices[i].last, "high": stock_prices[i].high, "low": stock_prices[i].low, "volume": stock_prices[i].volume, "flat_value": stock_prices[i].flat_value};
          entry['price'] = stock_prices[i-30].flat_value;
          var currArray = [];
          for(var j = 0; j < range; j++) {
            if ((i-30)-j >= 0) {
              currArray.push(stock_prices[i-j].flat_value);
            }
          }
          var result = standardDeviation(currArray);
          var zScore = (stock_prices[i].flat_value - result[1]) / result[0];
          zScore = Math.abs(zScore);
          entry['mAvg'] = result[1];
          entry['sdUpper'] = (result[0]*2)+result[1];
          entry['sdLower'] = result[1]-(result[0]*2);
          entry['sd'] = result[0];
          entry['zScore'] = zScore;
          if (zScore >= 1)
            entry["lineColor"] = "#ff0000";
          else
            entry['lineColor'] = "#0077aa";
          ppo.push(entry);
        }
      }

      function standardDeviation(values){
        var avg = average(values);

        var squareDiffs = values.map(function(value){
          var diff = value - avg;
          var sqrDiff = diff * diff;
          return sqrDiff;
        });

        var avgSquareDiff = average(squareDiffs);

        var stdDev = Math.sqrt(avgSquareDiff);
        var result = [stdDev, avg];
        return result;
      }

      function average(data){
        var sum = 0;
        for(var i = 0; i<data.length; i++) {
          sum = sum + data[i];
        }

        var avg = sum / data.length;
        return avg;
      }

      API.utility.response(context, 200, ppo);
    }
  },
};





