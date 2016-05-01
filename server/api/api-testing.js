APItesting = {
  handleRequest: function (context, method) {
    var params = context.request.query;
    APItesting.methods[method](context, params);
  },

  methods: {
    GET: function (context, params) {

      var returns = [];

      var company_name = "AAC.AX";
      var topic = "Cash Rate";

      var stocks = Stocks.find({company_name: company_name},{fields: {'date': 1, 'open_price':1, 'last_price':1, 'high':1, 'low':1, 'cr':1}}).fetch();



      API.utility.response(context, 200, stocks);
    }
  },
};





