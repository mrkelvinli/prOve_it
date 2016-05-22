APItesting = {
  handleRequest: function (context, method) {
    var params = context.request.query;
    APItesting.methods[method](context, params);
  },

  methods: {
    GET: function (context, params) {


      var token = params['token'];
      // var company = "AAC.AX";
      // var topic = "Cash Rate";
      // var lower_range = -5;
      // var upper_range = 5;

      var string2num = {
        'JAN' : 1,
        'FEB' : 2,
        'MAR' : 3,
        'APR' : 4,
        'MAY' : 5,
        'JUN' : 6,
        'JUL' : 7,
        'AUG' : 8,
        'SEP' : 9,
        'OCT' : 10,
        'NOV' : 11,
        'DEC' : 12
      }


      var checkedDate = "01-JAN-2015";

      var regex = /^([0-9]{2})-([a-zA-Z]{3})-([0-9]{4})/;
      var matches = regex.exec(checkedDate);
      var date = matches[1];

      var month = string2num[matches[2]] - 1;
      var year = matches[3];
      var wantedDate = new Date(Date.UTC(year, month, date, 1));


      API.utility.response(context, 200, wantedDate);
    }
  },
};





