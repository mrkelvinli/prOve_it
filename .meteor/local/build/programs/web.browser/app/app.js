var require = meteorInstall({"client":{"main.html":function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// client/template.main.js                                           //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
                                                                     // 1
Template.body.addContent((function() {                               // 2
  var view = this;                                                   // 3
  return [ HTML.Raw("<h1>Welcome to Meteor!</h1>\n\n  "), Spacebars.include(view.lookupTemplate("hello")), "\n  ", Spacebars.include(view.lookupTemplate("info")) ];
}));                                                                 // 5
Meteor.startup(Template.body.renderToDocument);                      // 6
                                                                     // 7
Template.__checkName("hello");                                       // 8
Template["hello"] = new Template("Template.hello", (function() {     // 9
  var view = this;                                                   // 10
  return [ HTML.Raw("<button>Click Me</button>\n  "), HTML.P("You've pressed the button ", Blaze.View("lookup:counter", function() {
    return Spacebars.mustache(view.lookup("counter"));               // 12
  }), " times.") ];                                                  // 13
}));                                                                 // 14
                                                                     // 15
Template.__checkName("info");                                        // 16
Template["info"] = new Template("Template.info", (function() {       // 17
  var view = this;                                                   // 18
  return HTML.Raw('<h2>Learn Meteor!</h2>\n  <ul>\n    <li><a href="https://www.meteor.com/try">Do the Tutorial</a></li>\n    <li><a href="http://guide.meteor.com">Follow the Guide</a></li>\n    <li><a href="https://docs.meteor.com">Read the Docs</a></li>\n    <li><a href="https://forums.meteor.com">Discussions</a></li>\n  </ul>');
}));                                                                 // 20
                                                                     // 21
///////////////////////////////////////////////////////////////////////

},"main.js":["meteor/templating","meteor/reactive-var","./main.html",function(require){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// client/main.js                                                    //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
var _templating = require('meteor/templating');                      // 1
                                                                     //
var _reactiveVar = require('meteor/reactive-var');                   // 2
                                                                     //
require('./main.html');                                              // 4
                                                                     //
_templating.Template.hello.onCreated(function () {                   // 6
  function helloOnCreated() {                                        // 6
    // counter starts at 0                                           //
    this.counter = new _reactiveVar.ReactiveVar(0);                  // 8
  }                                                                  //
                                                                     //
  return helloOnCreated;                                             //
}());                                                                //
                                                                     //
_templating.Template.hello.helpers({                                 // 11
  counter: function () {                                             // 12
    function counter() {                                             //
      return _templating.Template.instance().counter.get();          // 13
    }                                                                //
                                                                     //
    return counter;                                                  //
  }()                                                                //
});                                                                  //
                                                                     //
_templating.Template.hello.events({                                  // 17
  'click button': function () {                                      // 18
    function clickButton(event, instance) {                          //
      // increment the counter when button is clicked                //
      instance.counter.set(instance.counter.get() + 1);              // 20
    }                                                                //
                                                                     //
    return clickButton;                                              //
  }()                                                                //
});                                                                  //
///////////////////////////////////////////////////////////////////////

}]}},{"extensions":[".js",".json",".html",".css"]});
require("./client/main.html");
require("./client/main.js");