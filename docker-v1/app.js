const http = require('http');
const os   = require('os');

const VERSION = "1.0.0";

console.log(`Kubia server v.${VERSION} starting...`);

var handler = function(request, response) {
  console.log("Received request from " + request.connection.remoteAddress);
  response.writeHead(200);
  response.end("Kubia v." + VERSION + ": You've hit pod " + os.hostname() + "\n");
};

http.createServer(handler).listen(8080);
