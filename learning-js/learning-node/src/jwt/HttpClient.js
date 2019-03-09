var http = require('http');
var fs = require('fs');

module.exports.sendPostRequest = function (postData, callBack) {
   // Build the post string from an object
   var post_data = JSON.stringify(postData);

   // An object of options to indicate where to post to
   var post_options = {
      host: 'localhost',
      port: '8888',
      path: '',
      method: 'POST',
      headers: {
         'Content-Type': 'application/x-www-form-urlencoded',
         'Content-Length': Buffer.byteLength(post_data)
      }
   };

   // Set up the request
   var request = http.request(post_options, function (result, callBack) {
      result.setEncoding('utf8');
      result.on('data', function (chunk) {
         console.log('Response: ' + chunk);
         callBack(chunk);
      });

      callBack({ "error": "bugger" });
   });

   // post the data
   request.write(post_data);
   request.end();
}