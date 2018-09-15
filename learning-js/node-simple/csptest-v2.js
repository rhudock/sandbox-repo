// content of index.js

var http = require('http');
var fs = require('fs');
http.createServer(function (req, res) {

    switch (req.url) {
        case '/':
        case '/index.html':
            fs.readFile('index.html', function (err, data) {
                res.writeHead(200, {
                    'Content-Type': 'text/html',
                    'Content-Security-Policy': "frame-ancestors 'self' http://dleetest:3000",
                    'X-Frame-Options': "DENY",
                    'location': 'myTest'
                });
                res.write(data);
                res.end();
            });
            break;
        case '/iframe-index.html':
            fs.readFile('iframe-index.html', function (err, data) {
                res.writeHead(200, {
                    'Content-Type': 'text/html',
                    // 'X-Frame-Options': "SAMEORIGIN",
                    // 'Content-Security-Policy': "frame-ancestors http://localhost:3000 'self'",
                    'Content-Security-Policy': "frame-ancestors 'self' http://dleetest:3000",
                    'location': 'myTest'
                });
                res.write(data);
                res.end();
            });
            break;
    }
}).listen(3000);