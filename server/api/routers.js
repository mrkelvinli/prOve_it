if (Meteor.isServer) {
  var fs = Npm.require("fs"),
      os = Npm.require("os"),
      path = Npm.require("path");

  Router.onBeforeAction(function(req, res, next) {
    req.start_time = new Date();
//    console.log(req);
    var files = []; // Store a file and then pass it to the request.
    var token = Random.id( 10 );
    var fs = require('fs');
    var dir = path.join(process.env.PWD, "private",token);
    fs.mkdirSync(dir);

    if (req.method === "POST" && parseInt(req.headers['content-length']) > 0) {
      var busboy = new Busboy({
          headers: req.headers
      });
      busboy.on("file", function(fieldname, file, filename, encoding, mimetype) {
        var saveTo = path.join(process.env.PWD, "private",token,fieldname)
        var fileSizeBytes = 0;
        var contents = '';

        file.pipe(fs.createWriteStream(saveTo));
//        console.log(saveTo);
//         var string = Assets.getText(filename);

        file.on("data", function(data) {
          fileSizeBytes = fileSizeBytes + data.length;
          contents += data;
        });

        file.on('end', function() {
          // console.log(datas);
          files.push({
            fieldname: fieldname,
            filename: filename,
            contents : contents,
            size: fileSizeBytes,
          });
        });
      });
      busboy.on("finish", function() {
        // Pass the file on to the request
        // console.log(files);
        req.token = token;
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

Router.route( '/api/v1/event-study/submit-files', function() {
  this.response.setHeader( 'Access-Control-Allow-Origin', '*' );

  if ( this.request.method === "OPTIONS" ) {
    this.response.setHeader( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );
    this.response.setHeader( 'Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS' );
    this.response.end( 'Set OPTIONS.' );
  } else {
    Uploader.handleRequest( this, this.request.method);
  }
}, { where: 'server' } );



Router.route( '/api/v1/event-study/cumulative-returns', function() {

  this.response.setHeader( 'Access-Control-Allow-Origin', '*' );

  if ( this.request.method === "OPTIONS" ) {
    this.response.setHeader( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );
    this.response.setHeader( 'Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS' );
    this.response.end( 'Set OPTIONS.' );
  } else {
    API.handleRequest( this, this.request.method);
  }
}, { where: 'server' } );


Router.route("/api/", function() {
  this.render('api_index');
}, { where: 'server' } );

