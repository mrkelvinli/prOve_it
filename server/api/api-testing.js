APItesting = {
  handleRequest: function (context, method) {
    var params = context.request.query;
    APItesting.methods[method](context, params);
  },

  methods: {
    GET: function (context, params) {


      var token = params['token'];
      var company = "AAC.AX";
      var topic = "Cash Rate";
      var lower_range = -5;
      var upper_range = 5;


      var chartData = [];

      var all_topics = _.uniq(StockEvents.find({token:token},{sort:{topic:1},fields:{topic:true}}).fetch().map(function(x){return x.topic}),true);

      all_topics.forEach(function(t) {
        var events = StockEvents.find({token:token, company_name: company, topic: t, value: {$gt: 0}},{sort:{date:1},fields: {date: true}}).fetch();

        var events_avg = 0;

        events.forEach(function(e){
          var dateLower = new Date(e.date);
          dateLower.setDate(dateLower.getDate() + lower_range);
          var dateUpper = new Date(e.date);
          dateUpper.setDate(dateUpper.getDate() + upper_range);
          
          var days = StockPrices.find({company_name: company, token:token, date: {$gte : dateLower, $lte : dateUpper}}, {fields: {'cum_return':1}, sort: {cum_return:1}}).fetch().map(function(x){return x.cum_return});          
          var sum = 0;
          days.forEach(function(d){
            sum += d;
          });
          var avg = sum/days.length;

          events_avg += avg;
        });

        events_avg = events_avg/events.length;

        chartData.push({
          topic: t,
          avg_cr : events_avg,
        });

      });


      API.utility.response(context, 200, chartData);
    }
  },
};





