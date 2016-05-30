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

      Regressions.remove({});

      



      API.utility.response(context, 200, {});
    }
  },
};





