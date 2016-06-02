APItesting = {
  handleRequest: function (context, method) {
    var params = context.request.query;
    APItesting.methods[method](context, params);
  },

  methods: {
    GET: function (context, params) {

      var token = "fSSw3XJfHhuLgY4uqzp9"; // remember to change
      var company = "TGR.AX";
      var topic = "Cash Rate";
      var lower_range = -5;
      var upper_range = 5;

 

        function generateData(company) {

      var stock_prices = StockPrices.find({
        token: token,
        company_name: company,
        flat_value: {
          $ne: null
        }
      }, {
        fields: {
          date: true,
          flat_value: true
        }
      }).fetch();
      // var stock_prices = [];
      // prices.forEach(function(p){
      //   stock_prices.push({
      //     time: p.date,
      //     price: p.flat_value,
      //   });
      // });

      var sma = [];
      var distinctAvgToDo = [];
      var avg = 0;
      var currPrice = 0;
      var prevPrice = 0;
      var currAvg = 0;

      //calculate standard deviation
      // var toDoList = []; //array of arrays of values [[1,2],[2,3],[9,10]]
      currPrice = prevPrice = 0;
      var range = 30;
      for (var i = 0; i < stock_prices.length; i++) {
        var entry = {
          'time': stock_prices[i].date,
          'price': stock_prices[i].flat_value,
        };
        // if (i >= range-1) {
        var currArray = [];
        for (var j = 0; j < range; j++) {
          if (i - j >= 0) {
            currArray.push(stock_prices[i - j].flat_value);
          }
        }

        var result = standardDeviation(currArray);


        if (i > 19 && i % 20 == 0) {
          currAvg = average(distinctAvgToDo);
          distinctAvgToDo = [];
        }
        if (i < 20) {
          currAvg = 1; //stock_prices[0].flat_value;
        }
        distinctAvgToDo.push(stock_prices[i].flat_value);
        console.log(currAvg);
        var md = meanDeviation(currArray, currAvg);
        //console.log("md: "+md);
        var cci = stock_prices[i].flat_value - result[1];
        //console.log("bCCI: "+cci);

        md = md * 0.015;
        cci = cci / md;
        //console.log("CCI: "+cci);

        var zScore = (stock_prices[i].flat_value - result[1]) / result[0];
        zScore = Math.abs(zScore);
        entry['mAvg'] = result[1];
        entry['sdUpper'] = (result[0] * 2) + result[1];
        entry['sdLower'] = result[1] - (result[0] * 2);
        entry['sd'] = result[0];
        entry['cci'] = cci;
        entry['zScore'] = zScore;
        if (zScore >= 1.75)
          entry["lineColor"] = "#ff0000";
        else
          entry['lineColor'] = "#0077aa";
        // }
        sma.push(entry);
      }
      console.log(sma);
      return sma;
    }



    function standardDeviation(values) {
      var avg = average(values);

      var squareDiffs = values.map(function (value) {
        var diff = value - avg;
        var sqrDiff = diff * diff;
        return sqrDiff;
      });

      var avgSquareDiff = average(squareDiffs);

      var stdDev = Math.sqrt(avgSquareDiff);
      var result = [stdDev, avg];
      return result;
    }

    function average(data) {
      var sum = 0;
      for (var i = 0; i < data.length; i++) {
        sum = sum + data[i];
      }

      var avg = sum / data.length;
      return avg;
    }

    function meanDeviation(data, average) {
      // There are four steps to calculating the Mean Deviation. First, subtract 
      // the most recent 20-period average of the typical price from each period's 
      // typical price. Second, take the absolute values of these numbers. Third, 
      // sum the absolute values. Fourth, divide by the total number of periods (20). 
      var cci;
      var values = [];
      //console.log(data);
      for (var i = 0; i < data.length; i++) {
        cci = data[i] - average;
        cci = Math.abs(cci);
        values.push(cci);
      }
      var sum = 0;
      for (var i = 0; i < values.length; i++) {
        sum = sum + values[i];
      }
      sum = sum / values.length;
      return sum;
    }





      API.utility.response(context, 200, generateData(company));
    }
  },
};





