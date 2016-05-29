APItesting = {
  handleRequest: function (context, method) {
    var params = context.request.query;
    APItesting.methods[method](context, params);
  },

  methods: {
    GET: function (context, params) {

      var token = "fSSw3XJfHhuLgY4uqzp9"; // remember to change
      var company = "AAC.AX";
      var topic = "Cash Rate";
      var lower_range = -5;
      var upper_range = 5;

      var chartData = [];
var c_cr = [];
    var all_company = _.uniq(StockPrices.find({
      token: token
    }, {
      fields: {
        company_name: 1,
        _id: 0
      },
      sort: {
        company_name: 1
      }
    }).fetch().map(function (x) {
      return x.company_name
    }), true);

    all_company.forEach(function (c) {
      var ret = StockPrices.findOne({
        company_name: c,
        token: token,
      }, {
        fields: {
          company_name: 1,
          date: 1,
          cum_return: 1,
        },
        sort: {
          date: -1,
        }
      });
      c_cr.push({
        company_name: c,
        last_cr: ret.cum_return,
      });
    });

    c_cr = _.sortBy(c_cr, 'last_cr');
    c_cr.reverse();


      API.utility.response(context, 200, c_cr);
    }
  },
};





