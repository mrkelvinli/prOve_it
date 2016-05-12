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
}