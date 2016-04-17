import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './guiPage.html';

Router.route('/', function(){
  this.render('api_gui');
});

Router.configure({
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
});



//Template.hello.onCreated(function helloOnCreated() {
//  // counter starts at 0
//  this.counter = new ReactiveVar(0);
//});
//
//Template.hello.helpers({
//  counter() {
//    return Template.instance().counter.get();
//  },
//});
//
//Template.hello.events({
//  'click button'(event, instance) {
//    // increment the counter when button is clicked
//    instance.counter.set(instance.counter.get() + 1);
//  },
//});
