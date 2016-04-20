if (Meteor.isServer) {
  var fs = Npm.require("fs"),
    os = Npm.require("os"),
    path = Npm.require("path");

  Router.onBeforeAction(function (req, res, next) {
    req.start_time = new Date();

    var files = []; // Store a file and then pass it to the request.

    if (req.method === "POST" && parseInt(req.headers['content-length']) > 0) {
      var busboy = new Busboy({
        headers: req.headers,
      });
      busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
//        var name = token + "_" + fieldname;
//        var saveTo = path.join(process.env.PWD, "private", name);
        var fileSizeBytes = 0;
        var contents = '';

        file.on("data", function (data) {
          fileSizeBytes = fileSizeBytes + data.length;
          contents += data;
        });

        file.on('end', function () {
          files.push({
            fieldname: fieldname,
            filename: filename,
            contents: contents,
            size: fileSizeBytes,
          });
        });
      });
      busboy.on("finish", function () {
        // Pass the file on to the request
        req.files = files;
        next();
      });
      // Pass request to busboy
      req.pipe(busboy);
    } else {
      next();
    }
  });
}



Router.route('/api/v1/event-study/submit-files', function () {


  this.response.setHeader('Access-Control-Allow-Origin', '*');

  if (this.request.method === "OPTIONS") {
    this.response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    this.response.setHeader('Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS');
    this.response.end('Set OPTIONS.');
  } else {
    Uploader.handleRequest(this, this.request.method);
  }
}, {
  where: 'server'
});



Router.route('/api/v1/event-study/cumulative-returns', function () {

  this.response.setHeader('Access-Control-Allow-Origin', '*');

  if (this.request.method === "OPTIONS") {
    this.response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    this.response.setHeader('Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS');
    this.response.end('Set OPTIONS.');
  } else {
    API.handleRequest(this, this.request.method);
  }
}, {
  where: 'server'
});

Router.route('/api/testing', function() {
    this.response.setHeader('Access-Control-Allow-Origin', '*');

  if (this.request.method === "OPTIONS") {
    this.response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    this.response.setHeader('Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS');
    this.response.end('Set OPTIONS.');
  } else {
    APItesting.handleRequest(this, this.request.method);
  }
}, {
  where: 'server'
});

Router.route('/api/cr-csv', {
  where: 'server',
  action: function () {
    var filename = 'events_cumulative_returns.csv';
    var token = this.request.query['token'];
    
    var headers = {
      'Content-type': 'text/csv',
      'Content-Disposition': "attactment; filename="+filename,
    };
    
//    console.log("token: "+token);
//    console.log(Raw_CR_CSV.find().fetch());
    
    var csv_record = Raw_CR_CSV.findOne({token:token});
//    console.log(csv_record);
    return this.response.end(csv_record.csv);
  
  },
});


Router.route("/api/", function () {
  this.render('api_index');
}, { where: 'server' } );
