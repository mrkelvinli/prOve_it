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

      var stocks = Stocks.find({company_name: "TGR.AX"},{fields: {'date':1, cr:1,_id:0}}).fetch();



      API.utility.response(context, 200, stocks);
    }
  },
};





