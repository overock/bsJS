var bs = require( './bs/bsnode' )( __dirname );
bs.$route( this, require('./noderoot/lab/route').route );
/*
var http = require("http");
http.createServer(function(request, response) {
response.writeHead(200, {"Content-Type": "text/html"});
response.write("Hello, World~!!");
response.end();
}).listen(8001);
*/