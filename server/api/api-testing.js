APItesting = {
  handleRequest: function (context, method) {
    var params = context.request.query;
    APItesting.methods[method](context, params);
  },

  methods: {
    GET: function (context, params) {

      var token = "jayzevYadgwDqDKRvaXe";
      var company_name = "AAC.AX";
      var topic = "Cash Rate";
      var lower_range = -5;
      var upper_range = 5;

      // -----------------------
      // !! START CANDLESTICK !!
      var stockPrices = StockPrices.find({company_name: company_name, token: token, 'open': {$ne : null}}, {fields: {'date':1, 'open':1, 'last':1, 'high':1, 'low':1, 'volume':1, 'flat_value':1}}).fetch();

      //calculate MACD
      var toDoList = []; //array of arrays of values [[1,2],[2,3],[9,10]]
      var ppo = [];
      var currPrice = prevPrice = 0;

      for(var i = 0; i<(stockPrices.length); i++) {
        var bigArray = [];
        var smallArray = [];

        if (i < 29) {
          //currArray.push(stock_prices[i].price);
        } 
        for(var x = 0; x<30; x++) {
          if (i>=29) {
            if (x < 15) {
              smallArray.push(stockPrices[i-x].last);
            }
            bigArray.push(stockPrices[i-x].last);
          }
        }

        if (i > 29) {
          toDoList.push({"bigArray": bigArray, "smallArray": smallArray, "date": stockPrices[i-30].date, "open": stockPrices[i].open, "last": stockPrices[i].last, "high": stockPrices[i].high, "low": stockPrices[i].low, "volume": stockPrices[i].volume, "flat_value": stockPrices[i].flat_value});
        }
      }
      // !! END CANDLESTICK !!
      // ----------------------
      // !! START VOLATILITY !!
      var sma = [];
      var avg = 0;
      var currPrice = 0;
      var prevPrice = 0;

      //calculate standard deviation
      var toDoList = []; //array of arrays of values [[1,2],[2,3],[9,10]]
      currPrice = prevPrice = 0;

      for(var i = 0; i<(stock_prices.length); i++) {
        var currArray = [];
        if (i < 29) {
          //currArray.push(stock_prices[i].price);
        } 
        for(var x = 0; x<30; x++) {
          if (i>=29) {
            currArray.push(stock_prices[i-x].price);
          }
        }
        if (i > 29) {
          toDoList.push({"currArray": currArray, "time": stock_prices[i-30].time, "price": stock_prices[i].price});
        }
      // console.log(toDoList);
      }
      toDoList.forEach(function (c){
        var result = standardDeviation(c.currArray);
        var zScore = (c.price - result[1]) / result[0];
        zScore = Math.abs(zScore);
        var entry = {};
        if (zScore >= 1) {
          entry = {"time": c.time, "price": c.price, "mAvg": result[1], "sdUpper": ((result[0]*2)+result[1]), "sdLower": (result[1]-(result[0]*2)), "sd": result[0], "zScore": zScore, "lineColor": "#ff0000"};
        } else {
          entry = {"time": c.time, "price": c.price, "mAvg": result[1], "sdUpper": ((result[0]*2)+result[1]), "sdLower": (result[1]-(result[0]*2)), "sd": result[0], "zScore": zScore, "lineColor": "#0077aa"};
        }
        // console.log(entry);
        sma.push(entry);
      });

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
      // !! END VOLATILITY !!
      // ---------------------



    API.utility.response(context, 200, sma);
    
    }
  },
};





