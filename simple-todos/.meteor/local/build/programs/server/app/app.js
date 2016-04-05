var require = meteorInstall({"server":{"api.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// server/api.js                                                                                            //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
Router.route('/', function () {                                                                             // 1
  this.render('Home', {                                                                                     // 2
    data: function () {                                                                                     // 3
      function data() {                                                                                     // 3
        return Items.findOne({ _id: this.params._id });                                                     // 3
      }                                                                                                     //
                                                                                                            //
      return data;                                                                                          //
    }()                                                                                                     //
  });                                                                                                       //
});                                                                                                         //
                                                                                                            //
Router.route('/example', function () {                                                                      // 7
  var req = this.request;                                                                                   // 8
  var res = this.response;                                                                                  // 9
  res.end('hello from the server\n');                                                                       // 10
}, { where: 'server' });                                                                                    //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"server_save_file.js":function(require){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// server/server_save_file.js                                                                               //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
/**                                                                                                         //
* TODO support other encodings:                                                                             //
* http://stackoverflow.com/questions/7329128/how-to-write-binary-data-to-a-file-using-node-js               //
*/                                                                                                          //
Meteor.methods({                                                                                            // 5
   saveFile: function () {                                                                                  // 6
      function saveFile(blob, name, path, encoding) {                                                       // 6
         var path = cleanPath(path),                                                                        // 7
             fs = Npm.require('fs'),                                                                        //
                                                                                                            //
         //var path = cleanPath(path), fs = __meteor_bootstrap__.require('fs'),                             //
         name = cleanName(name || 'file'),                                                                  // 9
             encoding = encoding || 'binary',                                                               //
                                                                                                            //
         //chroot = Meteor.chroot || 'public';                                                              //
         //chroot = Meteor.chroot || (process.env['PWD'] +'/public/') ;                                     //
         chroot = Meteor.chroot || '../../../../../public/';                                                // 12
                                                                                                            //
         // Clean up the path. Remove any initial and final '/' -we prefix them-,                           //
         // any sort of attempt to go to the parent directory '..' and any empty directories in             //
         // between '/////' - which may happen after removing '..'                                          //
         path = chroot + (path ? '/' + path + '/' : '/');                                                   // 6
                                                                                                            //
         // TODO Add file existance checks, etc...                                                          //
         fs.writeFile(path + name, blob, encoding, function (err) {                                         // 6
            if (err) {                                                                                      // 21
               throw new Meteor.Error(500, 'Failed to save file.', err);                                    // 22
            } else {                                                                                        //
               console.log('The file ' + name + ' (' + encoding + ') was saved to ' + path);                // 24
            }                                                                                               //
         });                                                                                                //
                                                                                                            //
         function cleanPath(str) {                                                                          // 28
            if (str) {                                                                                      // 29
               return str.replace(/\.\./g, '').replace(/\/+/g, '').replace(/^\/+/, '').replace(/\/+$/, '');
            }                                                                                               //
         }                                                                                                  //
                                                                                                            //
         function cleanName(str) {                                                                          // 35
            return str.replace(/\.\./g, '').replace(/\//g, '');                                             // 36
         }                                                                                                  //
      }                                                                                                     //
                                                                                                            //
      return saveFile;                                                                                      //
   }()                                                                                                      //
});                                                                                                         //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"main.js":["meteor/meteor",function(require){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// server/main.js                                                                                           //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
var _meteor = require('meteor/meteor');                                                                     // 1
                                                                                                            //
_meteor.Meteor.startup(function () {                                                                        // 3
  // code to run on server at startup                                                                       //
});                                                                                                         //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]}},{"extensions":[".js",".json"]});
require("./server/api.js");
require("./server/server_save_file.js");
require("./server/main.js");
//# sourceMappingURL=app.js.map
