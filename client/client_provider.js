/* Powder Engine Client Provider */
process.chdir(__dirname);

var config = require('../config.json');
var NetworkBootstrap = require('../common/networkbootstrap.js');

var url = require("url"),
    path = require("path"),
    fs = require("fs")
    ;

var requestHandler = function(request, response) {
    var uri = url.parse(request.url).pathname;
    var filename = path.join(process.cwd(), uri);
    
    if (uri.indexOf("config.json") > -1) {
        response.writeHead(200);
        response.write(JSON.stringify(config));
        response.end();
    } else {
        if (uri.indexOf("/node_modules") == 0) {
            filename = ".." + uri;
        }

        fs.exists(filename, function(exists) {
            if(!exists) {
                response.writeHead(404, {"Content-Type": "text/plain"});
                response.write("404 Not Found\n");
                response.end();
                return;
            }
            
            if (fs.statSync(filename).isDirectory()) {
                filename += '/index.html';
            }
    
            fs.readFile(filename, "binary", function(err, file) {
                if(err) {        
                    response.writeHead(500, {"Content-Type": "text/plain"});
                    response.write(err + "\n");
                    response.end();
                    return;
                }
                
                response.writeHead(200);
                response.write(file, "binary");
                response.end();
            });
        });
    }
};

var parsedPort = parseInt(process.argv[2] || config.client.port || 8888, 10);
var networkBootstrap = new NetworkBootstrap(config);

var server = networkBootstrap.createServerInstance(requestHandler);

server.listen(parsedPort);

console.log("Client server running on port " + parsedPort + " in " + networkBootstrap.getTransferProtocolName() + " mode.\nCTRL + C to shutdown");