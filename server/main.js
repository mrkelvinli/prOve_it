import { Meteor } from 'meteor/meteor';


if(Meteor.isServer) {
  fs = Npm.require('fs');

    // Meteor.startup(function () {
    //   Companys.allow({
    //     insert: function () {
    //       return true;
    //     },
    //     update: function () {
    //       return true;
    //     },
    //     remove: function () {
    //       return true;
    //     }
    //   });

    //   Meteor.publish("companys", function() {
    //     return Companys.find();
    //   });
    // });

  Meteor.publish('companys_db', function(){
    return Companys.find();
  });
  Meteor.publish('stocks_db', function(){
    return Stocks.find();
  });
  Meteor.publish('events_db', function(){
    return Events.find();
  });
  Meteor.publish('topics_db', function(){
    return Topics.find();
  });

  Meteor.publish('stockPrices_db', function(token){
    return StockPrices.find({token:token});
  });

  Meteor.publish('stockEvents_db', function(token){
    return StockEvents.find({token: token});
  });

  var connectHandler = WebApp.connectHandlers;

  Meteor.startup(function () {
    connectHandler.use(function (req, res, next) {
      res.setHeader('Strict-Transport-Security', 'max-age=2592000; includeSubDomains'); // 2592000s / 30 days
      return next();
    });
  });

  Meteor.methods({
    checkToken: function (token) {
      // console.log('checking: '+token);
      return StockPrices.find({token:token}).count() > 0;
    },
    scrapeSearch: function(company) {
      // from https://themeteorchef.com/snippets/synchronous-methods/
      var withoutAX = company.replace(/\.[Aa][Xx]/, '');
      var url = "http://www.investogain.com.au/company/company_search_by_code?keywords_code=" + withoutAX;
      console.log(url);

      if (withoutAX.length != 3) {
        throw new Error('company invalid');
      } else {
        var convertAsyncToSync  = Meteor.wrapAsync(HTTP.get),
          resultOfAsyncToSync = convertAsyncToSync(url, {});
          console.log(resultOfAsyncToSync);
        return resultOfAsyncToSync;
      }
    }
  });
}