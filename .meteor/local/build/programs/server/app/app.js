var require = meteorInstall({"server":{"api":{"api.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// server/api/api.js                                                                                              //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
API = {                                                                                                           // 1
                                                                                                                  //
  connection: function () {                                                                                       // 3
    function connection(request) {                                                                                // 3
      var getRequestContents = API.utility.getRequestContents(request);                                           // 4
      return { data: getRequestContents };                                                                        // 5
    }                                                                                                             //
                                                                                                                  //
    return connection;                                                                                            //
  }(),                                                                                                            //
                                                                                                                  //
  handleRequest: function () {                                                                                    // 8
    function handleRequest(context, method) {                                                                     // 8
      // var csv = context.request.files[0]['contents'];                                                          //
      // var rows = Papa.parse(csv).data;                                                                         //
      // console.log(rows);                                                                                       //
                                                                                                                  //
      var connection = API.connection(context.request);                                                           // 13
      if (!connection.error) {                                                                                    // 14
        var params = connection.data;                                                                             // 15
        var files = context.request.files;                                                                        // 16
                                                                                                                  //
        API.methods[method](context, params, files);                                                              // 19
      } else {                                                                                                    //
        API.utility.response(context, 401, connection);                                                           // 21
      }                                                                                                           //
    }                                                                                                             //
                                                                                                                  //
    return handleRequest;                                                                                         //
  }(),                                                                                                            //
                                                                                                                  //
  methods: {                                                                                                      // 25
    POST: function () {                                                                                           // 26
      function POST(context, params, files) {                                                                     // 26
        var upper_window = "";                                                                                    // 27
        var lower_window = "";                                                                                    // 28
        var upper_range = "";                                                                                     // 29
        var lower_range = "";                                                                                     // 30
        var range_name = "";                                                                                      // 31
                                                                                                                  //
        var status_code = 200;                                                                                    // 33
        var other_vars = {};                                                                                      // 34
                                                                                                                  //
        for (var key in meteorBabelHelpers.sanitizeForInObject(params)) {                                         // 36
          if (key == "upper_window") {                                                                            // 37
            upper_window = params['upper_window'];                                                                // 38
            continue;                                                                                             // 39
          }                                                                                                       //
          if (key == "lower_window") {                                                                            // 41
            lower_window = params['lower_window'];                                                                // 42
            continue;                                                                                             // 43
          }                                                                                                       //
          var upperRegex = /upper_([a-zA-Z\-]+)/g;                                                                // 45
          var lowerRegex = /lower_([a-zA-Z\-]+)/g;                                                                // 46
          var match = upperRegex.exec(key);                                                                       // 47
          if (match != null) {                                                                                    // 48
            upper_range = params[key];                                                                            // 49
            var match_value = match[1];                                                                           // 50
            console.log(match_value);                                                                             // 51
            if (API.utility.match_range_name(range_name, match_value)) {                                          // 52
              range_name = match_value;                                                                           // 53
            }                                                                                                     //
            continue;                                                                                             // 55
          }                                                                                                       //
          match = lowerRegex.exec(key);                                                                           // 57
          if (match != null) {                                                                                    // 58
            lower_range = params[key];                                                                            // 59
            //            lower_range = parseFloat.(params[key]);                                                 //
            var match_value = match[1];                                                                           // 58
            if (API.utility.match_range_name(range_name, match_value)) {                                          // 62
              range_name = match_value;                                                                           // 63
            }                                                                                                     //
            continue;                                                                                             // 65
          }                                                                                                       //
          other_vars[key] = params[key];                                                                          // 67
        }                                                                                                         //
                                                                                                                  //
        // Make sure that our request has data and that the data is valid.                                        //
        var requestOK = API.utility.validateRequest(upper_window, lower_window, upper_range, lower_range, range_name, files);
                                                                                                                  //
        if (requestOK) {                                                                                          // 73
          upper_window = parseFloat(upper_window);                                                                // 74
          lower_window = parseFloat(lower_window);                                                                // 75
          upper_range = parseFloat(upper_range);                                                                  // 76
          lower_range = parseFloat(lower_range);                                                                  // 77
                                                                                                                  //
          for (var id in meteorBabelHelpers.sanitizeForInObject(files)) {                                         // 79
            var parseObject = Papa.parse(files[id]['contents']);                                                  // 80
            files[id]['json'] = parseObject.data;                                                                 // 81
            files[id]['errors'] = parseObject.errors;                                                             // 82
                                                                                                                  //
            if (files[id]['errors']) {                                                                            // 84
              API.utility.response(context, 422, { error: 422, message: "CSV file isn't formatted correctly." });
            }                                                                                                     //
          }                                                                                                       //
                                                                                                                  //
          // the validation does nothing at the moment                                                            //
          // validData = API.utility.validate( connection.data, { "a": String, "b": String });                    //
                                                                                                                  //
          API.utility.response(context, status_code, {                                                            // 73
            upper_window: upper_window,                                                                           // 93
            lower_window: lower_window,                                                                           // 94
            upper_range: upper_range,                                                                             // 95
            lower_range: lower_range,                                                                             // 96
            range_name: range_name,                                                                               // 97
            other_var: other_vars,                                                                                // 98
            csv1_name: files[0]['fieldname'],                                                                     // 99
            csv1: files[0]['json']                                                                                // 100
          });                                                                                                     //
        } else {                                                                                                  //
          API.utility.response(context, 404, { error: 404, message: "Invalid Request, dude." });                  // 103
        }                                                                                                         //
      }                                                                                                           //
                                                                                                                  //
      return POST;                                                                                                //
    }()                                                                                                           //
  },                                                                                                              //
                                                                                                                  //
  utility: {                                                                                                      // 108
    getRequestContents: function () {                                                                             // 109
      function getRequestContents(request) {                                                                      // 109
        return request.query;                                                                                     // 110
      }                                                                                                           //
                                                                                                                  //
      return getRequestContents;                                                                                  //
    }(),                                                                                                          //
    hasData: function () {                                                                                        // 112
      function hasData(data) {                                                                                    // 112
        return Object.keys(data).length > 0 ? true : false;                                                       // 113
      }                                                                                                           //
                                                                                                                  //
      return hasData;                                                                                             //
    }(),                                                                                                          //
    response: function () {                                                                                       // 115
      function response(context, statusCode, data) {                                                              // 115
        context.response.setHeader('Content-Type', 'application/json');                                           // 116
        context.response.statusCode = statusCode;                                                                 // 117
        context.response.end(JSON.stringify(data));                                                               // 118
      }                                                                                                           //
                                                                                                                  //
      return response;                                                                                            //
    }(),                                                                                                          //
    validate: function () {                                                                                       // 120
      function validate(data, pattern) {                                                                          // 120
        return Match.test(data, pattern);                                                                         // 121
      }                                                                                                           //
                                                                                                                  //
      return validate;                                                                                            //
    }(),                                                                                                          //
    validateRequest: function () {                                                                                // 123
      function validateRequest(upper_window, lower_window, upper_range, lower_range, range_name, files) {         // 123
        return files.length == 2 && isNumeric(upper_window) && isNumeric(lower_window) && isNumeric(upper_range) && isNumeric(lower_range) && range_name != "" && parseFloat(upper_window) <= parseFloat(lower_window);
      }                                                                                                           //
                                                                                                                  //
      return validateRequest;                                                                                     //
    }(),                                                                                                          //
    match_range_name: function () {                                                                               // 132
      function match_range_name(range_name, matching_range_name) {                                                // 132
        if (range_name == "") {                                                                                   // 133
          return true;                                                                                            // 134
        } else if (range_name == matching_range_name) {                                                           //
          return true;                                                                                            // 136
        } else {                                                                                                  //
          return false;                                                                                           // 138
        }                                                                                                         //
      }                                                                                                           //
                                                                                                                  //
      return match_range_name;                                                                                    //
    }()                                                                                                           //
  }                                                                                                               //
};                                                                                                                //
                                                                                                                  //
function isNumeric(num) {                                                                                         // 145
  return !isNaN(num);                                                                                             // 146
}                                                                                                                 //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"routers.js":function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// server/api/routers.js                                                                                          //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
if (Meteor.isServer) {                                                                                            // 1
  var fs = Npm.require("fs"),                                                                                     // 2
      os = Npm.require("os"),                                                                                     //
      path = Npm.require("path");                                                                                 //
                                                                                                                  //
  Router.onBeforeAction(function (req, res, next) {                                                               // 6
    //    console.log(req.headers);                                                                               //
    var files = []; // Store a file and then pass it to the request.                                              // 8
                                                                                                                  //
    if (req.method === "POST" && parseInt(req.headers['content-length']) > 0) {                                   // 6
      var busboy = new Busboy({                                                                                   // 11
        headers: req.headers                                                                                      // 12
      });                                                                                                         //
      busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {                                // 14
        // var saveTo = path.join(os.tmpDir(), filename);                                                         //
        // var saveTo = path.join(process.cwd()+ "/tmp/", filename);                                              //
        // var token = Random.id( 10 );                                                                           //
        // req.token = token;                                                                                     //
        // var saveTo = path.join(process.env.PWD, "private", filename);                                          //
        var fileSizeBytes = 0;                                                                                    // 20
        var contents = '';                                                                                        // 21
                                                                                                                  //
        // file.pipe(fs.createWriteStream(saveTo));                                                               //
        // var string = Assets.getText(filename);                                                                 //
                                                                                                                  //
        file.on("data", function (data) {                                                                         // 14
          fileSizeBytes = fileSizeBytes + data.length;                                                            // 27
          contents += data;                                                                                       // 28
        });                                                                                                       //
                                                                                                                  //
        file.on('end', function () {                                                                              // 31
          // console.log(datas);                                                                                  //
          files.push({                                                                                            // 33
            fieldname: fieldname,                                                                                 // 34
            originalFilename: filename,                                                                           // 35
            contents: contents,                                                                                   // 36
            size: fileSizeBytes                                                                                   // 37
          });                                                                                                     //
        });                                                                                                       //
      });                                                                                                         //
      busboy.on("finish", function () {                                                                           // 41
        // Pass the file on to the request                                                                        //
        // console.log(files);                                                                                    //
        req.files = files;                                                                                        // 44
        next();                                                                                                   // 45
      });                                                                                                         //
      // Pass request to busboy                                                                                   //
      req.pipe(busboy);                                                                                           // 10
    } else {                                                                                                      //
      next();                                                                                                     // 50
    }                                                                                                             //
  });                                                                                                             //
}                                                                                                                 //
                                                                                                                  //
Router.route('/api/v1/event-study', function () {                                                                 // 55
                                                                                                                  //
  this.response.setHeader('Access-Control-Allow-Origin', '*');                                                    // 57
                                                                                                                  //
  if (this.request.method === "OPTIONS") {                                                                        // 59
    this.response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');    // 60
    this.response.setHeader('Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS');                   // 61
    this.response.end('Set OPTIONS.');                                                                            // 62
  } else {                                                                                                        //
    API.handleRequest(this, this.request.method);                                                                 // 64
  }                                                                                                               //
}, { where: 'server' });                                                                                          //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"main.js":["meteor/meteor",function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// server/main.js                                                                                                 //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _meteor = require('meteor/meteor');                                                                           // 1
                                                                                                                  //
_meteor.Meteor.startup(function () {                                                                              // 3
  // code to run on server at startup                                                                             //
});                                                                                                               //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]}},{"extensions":[".js",".json"]});
require("./server/api/api.js");
require("./server/api/routers.js");
require("./server/main.js");
//# sourceMappingURL=app.js.map
