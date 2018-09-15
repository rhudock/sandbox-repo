var http = require('http');
var dt = require('./myFirstModule');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html', 'location': 'myTest'});
    res.write("The date and time are currently: " + dt.myDateTime());
    res.end();
}).listen(8080);