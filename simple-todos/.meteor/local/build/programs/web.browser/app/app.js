var require = meteorInstall({"client":{"client_example.html":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// client/template.client_example.js                                                                    //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
                                                                                                        // 1
Template.__checkName("example");                                                                        // 2
Template["example"] = new Template("Template.example", (function() {                                    // 3
  var view = this;                                                                                      // 4
  return HTML.Raw('<input type="file">');                                                               // 5
}));                                                                                                    // 6
                                                                                                        // 7
//////////////////////////////////////////////////////////////////////////////////////////////////////////

},"main.html":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// client/template.main.js                                                                              //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
                                                                                                        // 1
Template.body.addContent((function() {                                                                  // 2
  var view = this;                                                                                      // 3
  return [ HTML.Raw("<h1>Welcome to Meteor!</h1>\n\n  "), Spacebars.include(view.lookupTemplate("hello")), "\n  ", Spacebars.include(view.lookupTemplate("info")), HTML.Raw('\n\n   <button type="button">main</button>') ];
}));                                                                                                    // 5
Meteor.startup(Template.body.renderToDocument);                                                         // 6
                                                                                                        // 7
//////////////////////////////////////////////////////////////////////////////////////////////////////////

},"api2.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// client/api2.js                                                                                       //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
Router.route('/ex/', function () {                                                                      // 1
  this.render('example');                                                                               // 2
});                                                                                                     //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

},"client_example.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// client/client_example.js                                                                             //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
Template.example.events({                                                                               // 1
  'change input': function () {                                                                         // 2
    function changeInput(ev) {                                                                          // 2
      _.each(ev.currentTarget.files, function (file) {                                                  // 3
        Meteor.saveFile(file, file.name);                                                               // 4
      });                                                                                               //
    }                                                                                                   //
                                                                                                        //
    return changeInput;                                                                                 //
  }()                                                                                                   //
});                                                                                                     //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

},"client_save_file.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// client/client_save_file.js                                                                           //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
/**                                                                                                     //
* @blob (https://developer.mozilla.org/en-US/docs/DOM/Blob)                                             //
* @name the file's name                                                                                 //
* @type the file's type: binary, text (https://developer.mozilla.org/en-US/docs/DOM/FileReader#Methods)
*                                                                                                       //
* TODO Support other encodings: https://developer.mozilla.org/en-US/docs/DOM/FileReader#Methods         //
* ArrayBuffer / DataURL (base64)                                                                        //
*/                                                                                                      //
Meteor.saveFile = function (blob, name, path, type, callback) {                                         // 9
   var fileReader = new FileReader(),                                                                   // 10
       method,                                                                                          //
       encoding = 'binary',                                                                             //
       type = type || 'binary';                                                                         //
   switch (type) {                                                                                      // 12
      case 'text':                                                                                      // 13
         // TODO Is this needed? If we're uploading content from file, yes, but if it's from an input/textarea I think not...
         method = 'readAsText';                                                                         // 15
         encoding = 'utf8';                                                                             // 16
         break;                                                                                         // 17
      case 'binary':                                                                                    // 12
         method = 'readAsBinaryString';                                                                 // 19
         encoding = 'binary';                                                                           // 20
         break;                                                                                         // 21
      default:                                                                                          // 12
         method = 'readAsBinaryString';                                                                 // 23
         encoding = 'binary';                                                                           // 24
         break;                                                                                         // 25
   }                                                                                                    // 12
   fileReader.onload = function (file) {                                                                // 27
      //Meteor.call('saveFile', file.srcElement.result, name, path, encoding, callback);                //
      Meteor.call('saveFile', file.target.result, name, path, encoding, callback);                      // 29
   };                                                                                                   //
   fileReader[method](blob);                                                                            // 31
};                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

},"main.js":["meteor/templating","meteor/reactive-var","./main.html",function(require){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// client/main.js                                                                                       //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
var _templating = require('meteor/templating');                                                         // 1
                                                                                                        //
var _reactiveVar = require('meteor/reactive-var');                                                      // 2
                                                                                                        //
require('./main.html');                                                                                 // 4
                                                                                                        //
_templating.Template.hello.onCreated(function () {                                                      // 6
  function helloOnCreated() {                                                                           // 6
    // counter starts at 0                                                                              //
    this.counter = new _reactiveVar.ReactiveVar(0);                                                     // 8
  }                                                                                                     //
                                                                                                        //
  return helloOnCreated;                                                                                //
}());                                                                                                   //
                                                                                                        //
_templating.Template.hello.helpers({                                                                    // 11
  counter: function () {                                                                                // 12
    function counter() {                                                                                //
      return _templating.Template.instance().counter.get();                                             // 13
    }                                                                                                   //
                                                                                                        //
    return counter;                                                                                     //
  }()                                                                                                   //
});                                                                                                     //
                                                                                                        //
_templating.Template.hello.events({                                                                     // 17
  'click button': function () {                                                                         // 18
    function clickButton(event, instance) {                                                             //
      // increment the counter when button is clicked                                                   //
      instance.counter.set(instance.counter.get() + 1);                                                 // 20
    }                                                                                                   //
                                                                                                        //
    return clickButton;                                                                                 //
  }()                                                                                                   //
});                                                                                                     //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}]}},{"extensions":[".js",".json",".html",".css"]});
require("./client/client_example.html");
require("./client/main.html");
require("./client/api2.js");
require("./client/client_example.js");
require("./client/client_save_file.js");
require("./client/main.js");