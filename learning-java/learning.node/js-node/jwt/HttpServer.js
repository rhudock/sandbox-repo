var http = require('http')
var url = require('url')
var fs = require('fs')
var path = require('path')

var decrypt = require('./decrypt.js');

var port = 80;

http.createServer(function (request, response) {
   
   var requestUrl = url.parse(request.url)

   if (request.method == 'POST') {
      var jsonString = '';

      request.on('data', function (data) {
         jsonString += data;
      });

      request.on('end', function () {
         var post = JSON.parse(jsonString);
         TestValidation(post);
         console.log(post);
      });
   }
   
}).listen(port)

console.log("listening on port " + port)

function TestValidation(ninaRequest){

   if (ninaRequest.TalkAgentRequest.NinaVars.secret != undefined) {
      var secret = ninaRequest.TalkAgentRequest.NinaVars.secret
      decrypt.checkcert(ninaRequest, secret);
   }
   
}