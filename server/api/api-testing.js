APItesting = {
  handleRequest: function (context, method) {
    var params = context.request.query;
    APItesting.methods[method](context, params);
  },

  methods: {
    GET: function (context, params) {


      var token = params['token'];
      var company_name = "AAC.AX";
      var topic = "Cash Rate";
      var lower_range = -5;
      var upper_range = 5;


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
      // console.log(toDoList);
      }

      toDoList.forEach(function (c){
        var result = movAvg(c.bigArray);
        var result2 = movAvg(c.smallArray);
        console.log(result2);
        entry = {"date": c.date, "open": c.open, "last": c.last, "high": c.high, "low": c.low, "volume": c.volume, "flat_value": c.flat_value, "bigAvg": result, "smallAvg": result2, "lineColor": "#ff0000"};
        // console.log(entry);
        ppo.push(entry);
      });

      function movAvg(data){
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





