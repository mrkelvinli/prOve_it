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

  Meteor.publish('market_db', function(){
    return Market.find();
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
      // e.g. https://au.finance.yahoo.com/q/h?s=AAC.AX&t=2016-03-01
      var url = 'https://au.finance.yahoo.com/q/h?s=' + company + "\\&t=" + date;

      console.log(date);
      console.log(url);

      var command = 'python3 ../../../../../.name/scrape.py ' + url
        var convertAsyncToSync  = Meteor.wrapAsync(exec),
          resultOfAsyncToSync = convertAsyncToSync(command);
        // console.log(resultOfAsyncToSync);
        return resultOfAsyncToSync;
    },
    aylienApi: function(url) {
      // e.g.
      // curl https://api.aylien.com/api/v1/sentiment \
      //    -H "X-AYLIEN-TextAPI-Application-Key: 0c9e08decd35c5e7172f336d3cb43aa8" \
      //    -H "X-AYLIEN-TextAPI-Application-ID: fe435f7a" \
      //    -d mode="document" \
      //    -d url="http://www.capitalcube.com/blog/index.php/australian-agricultural-co-ltd-overvalued-relative-to-peers-but-may-deserve-another-look/"
      
      var apiUrl = "https://api.aylien.com/api/v1/sentiment";
      var convertAsyncToSync  = Meteor.wrapAsync(HTTP.get),
        resultOfAsyncToSync = convertAsyncToSync(apiUrl, {
          headers: {
            "X-AYLIEN-TextAPI-Application-Key": "5a038b2601fab2542c90fdb7957bd3d4",
            "X-AYLIEN-TextAPI-Application-ID": "91a48464"
          },
          params: {
            "mode": "document",
            "url": url
          }
        });
      // console.log(resultOfAsyncToSync);
      return resultOfAsyncToSync;
    },
    scrapeDividends: function(company) {
      // e.g. http://dividends.com.au/dividend-history/?enter_code=tgr
      var withoutAX = company.substring(0,3);
      var url = 'http://dividends.com.au/dividend-history/?enter_code=' + withoutAX;

      console.log(url);

      var command = 'python3 ../../../../../.name/scrape.py ' + url;
      var convertAsyncToSync  = Meteor.wrapAsync(exec),
        resultOfAsyncToSync = convertAsyncToSync(command);
      // console.log(resultOfAsyncToSync);
      return resultOfAsyncToSync;
    }
  });
}