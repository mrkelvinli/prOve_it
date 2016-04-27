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
  }

Meteor.methods = {
    get_companies_db: function(query_token) {
        var companies = Companys.find({file_token: query_token},{fields: {'company_name':1, avg_cr:1}, sort:{avg_cr:1},reactive:true}).fetch();
        console.log(companies);
        return companies;
    }
};