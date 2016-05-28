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


      var prices = StockPrices.find({token:token, company_name: company, flat_value: {$ne: null}},{fields:{date:true, flat_value: true}}).fetch();
      var stock_prices = [];
      prices.forEach(function(p){
        stock_prices.push({
          time: p.date,
          price: p.flat_value,
        });
      });

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


      API.utility.response(context, 200, stocks);
    
    }
  },
};





