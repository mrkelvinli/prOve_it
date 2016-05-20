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

  var exec = Npm.require('child_process').exec;
  var Fiber = Npm.require('fibers');
  var Future = Npm.require('fibers/future');

  Meteor.methods({
    checkToken: function (token) {
      // console.log('checking: '+token);
      return StockPrices.find({token:token}).count() > 0;
    },
    scrapeSearch: function(company) {
      // (from https://themeteorchef.com/snippets/synchronous-methods/)
      // var withoutAX = company.replace(/\.[Aa][Xx]/, '');
      var withoutAX = company.substring(0,3);
      var url = "http://theaustralian.com.au/shares/" + withoutAX;
      console.log(url);

      if (withoutAX.length != 3) {
        throw new Error('company invalid');
      } else {
        // HTTP.get never seems to return the page I want (always either 'not permitted', or the site's homepage):
        // var convertAsyncToSync  = Meteor.wrapAsync(HTTP.get),
        //   resultOfAsyncToSync = convertAsyncToSync(url, {});
        // console.log(resultOfAsyncToSync);
        // return resultOfAsyncToSync;

        // so going to use a python scraper
        // (from https://stackoverflow.com/questions/23011443/best-way-to-get-python-and-meteor-talking)
        var command = 'python3 ../../../../../.name/scrape.py ' + url; // current directory: prOve_it/.meteor/local/build/programs/server
        var convertAsyncToSync  = Meteor.wrapAsync(exec),
          resultOfAsyncToSync = convertAsyncToSync(command);
        // console.log(resultOfAsyncToSync);
        return resultOfAsyncToSync;
      }
    },
    scrapeRelatedNews: function(company, date) {
      var withoutAX = company.substring(0,3);
      // e.g. https://au.finance.yahoo.com/q/h\?s\=AAC\&t\=2004-01-01
      var url = 'https://au.finance.yahoo.com/q/\h\?s\=' + withoutAX + "\\&t\=" + date;
      console.log(date);
      console.log(url);

      var command = 'python3 ../../../../../.name/scrape.py ' + url
        var convertAsyncToSync  = Meteor.wrapAsync(exec),
          resultOfAsyncToSync = convertAsyncToSync(command);
        // console.log(resultOfAsyncToSync);
        return resultOfAsyncToSync;
    }
  });
}