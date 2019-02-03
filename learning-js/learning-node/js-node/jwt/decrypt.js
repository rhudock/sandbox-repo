var crypto = require('crypto');
var fs = require('fs');

var secret;

module.exports.checkcert = function (request, secret) {
   secret = request.TalkAgentRequest.NinaVars.secret;
   request.TalkAgentRequest.NinaVars.secret = undefined;
   
   var json = JSON.stringify(request);
   var jsonBytes = Buffer.from(json, 'utf8');
   console.log("Json String Validate");
   console.log(json);

   var str = '';
   for (var i = 0; i < jsonBytes.length; i++) {
      str += jsonBytes[i].toString() + ',';
   };
   console.log("Json Bytes Validate");
   console.log(str);

   var secretBytes = Buffer.from(secret, 'base64');
   str = '';
   for (var i = 0; i < secretBytes.length; i++) {
      str += secretBytes[i].toString() + ',';
   };
   console.log("Signed Data Validate");
   console.log(str);

   testCert(jsonBytes, secretBytes);
};

function testCert(jsonBytes, secretBytes) {
   var publicKey = fs.readFileSync('JAMES.cer', "utf8");  // get private key

   var verifier = crypto.createVerify('sha256');
   verifier.update(jsonBytes);
   var ver = verifier.verify(publicKey, secretBytes, 'base64');
}
