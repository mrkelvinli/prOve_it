if (Meteor.isServer) {
  var fs = Npm.require("fs"),
      os = Npm.require("os"),
      path = Npm.require("path");

  Router.onBeforeAction(function(req, res, next) {
    var files = []; // Store a file and then pass it to the request.

    if (req.method === "POST") {
      var busboy = new Busboy({
          headers: req.headers
      });
      busboy.on("file", function(fieldname, file, filename, encoding, mimetype) {
        // var saveTo = path.join(os.tmpDir(), filename);
        // var saveTo = path.join(process.cwd()+ "/tmp/", filename);
        // var token = Random.id( 10 );
        // req.token = token;
        // var saveTo = path.join(process.env.PWD, "private", filename);
        var fileSizeBytes = 0;
        var contents = '';


        // file.pipe(fs.createWriteStream(saveTo));
        // var string = Assets.getText(filename);

        file.on("data", function(data) {
          fileSizeBytes = fileSizeBytes + data.length;
          contents += data;
        });

        file.on('end', function() {
          // console.log(datas);
          files.push({
            originalFilename: filename,
            contents : contents,
            size: fileSizeBytes,
          });
        });
      });
      busboy.on("finish", function() {
        // Pass the file on to the request
        // console.log(files);
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

Router.route( '/api/v1/event-study', function() {

  this.response.setHeader( 'Access-Control-Allow-Origin', '*' );

  if ( this.request.method === "OPTIONS" ) {
    this.response.setHeader( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );
    this.response.setHeader( 'Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS' );
    this.response.end( 'Set OPTIONS.' );
  } else {
    API.handleRequest( this, this.request.method);
  }
}, { where: 'server' } );
