var http = require('http');
var fs = require('fs');
var browserify = require('browserify');
var db = require('level')('db');

var server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html', 'location': 'myTest'});

    switch (req.url) {
        case '/':
        case '/index.html':
            browserify('index.html').bundle().pipe(res);
            break;
        case '/index.js':
            browserify('index.js').bundle().pipe(res);
            break;
        case '/addcomment':
            var comment = [];
            req.on('data', function (data) {
                comment.push(data);
            });
            req.on('end', function () {
                commnet = commnet.join('');
                db.put(Data.now(), comment, function () {
                    res.end();
                });
            });
            browserify('index.js').bundle().pipe(res);
            break;
        default:
            res.write("Hello World");
            res.end();
            break;
    }

});

server.listen(8080, function() {

})