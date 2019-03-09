var fs = require('fs');
var http = require('./HttpClient.js');
var crypto = require('crypto');

var requestString = fs.readFileSync("request.json", "utf8");
var request = JSON.parse(requestString);

encrypt(request);

http.sendPostRequest(request, response);

function response(response) {
   var a = response;
}

function encrypt(request) {
   var json = JSON.stringify(request);
   var jsonBytes = Buffer.from(json, 'utf8');

   var privateKey = fs.readFileSync('JAMES.pem', "utf8");  // get private key

   var sign = crypto.createSign('RSA-SHA256');
   sign.update(jsonBytes);
   var signed = sign.sign(privateKey, 'base64')

	  // Signed String to Add to Header.
   var signedString = signed.toString('base64');
}


