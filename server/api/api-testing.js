APItesting = {
  handleRequest: function (context, method) {
    var params = context.request.query;
    APItesting.methods[method](context, params);
  },

  methods: {
    GET: function (context, params) {

      var default_token = "2s4XeTBzRLdbMFDdMrdJ";

      var companys = Meteor.methods.get_companys(default_token);



      var returns = companys;


      API.utility.response(context, 200, returns);
    }
  },
};





