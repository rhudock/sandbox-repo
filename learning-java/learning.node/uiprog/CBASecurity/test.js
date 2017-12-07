
var fs = require('fs');
var crypto = require('crypto');

var request = {
    "@SCI": "",
    "@IID": "userIdentifier",
    "@TimeStamp": "2017-10-24T15:16:50.698407+11:00",
    "UserText": "userText",
    "NleResults": true,
    "NinaVars": {
        "assetType": "assetType",
        "invocationpoint": "invocationPoint"
    }
};

// Wrap with TalkAgentRequest (Root object CBA Use)
var talkRequest = {
    "TalkAgentRequest": request
}

var signedString = encrypt(talkRequest);

verifyRequest(talkRequest, signedString);



// Verify the Request signature using public key.
function verifyRequest(state, signedString) {
    // Wrap with TalkAgentRequest (Root object CBA Use)
    // var request = { "TalkAgentRequest": state.context.input };
    // var json = JSON.stringify(request);
    // var jsonBytes = Buffer.from(json, 'utf8');
    var secretBytes = signedString;

    var publicKey = fs.readFileSync('public.crt', "utf8");  // get private key
    var verifier = crypto.createVerify('sha256');
    verifier.update(state);
    var result = verifier.verify(publicKey, secretBytes, 'base64');

    return result;
}



function encrypt(request) {
    // This is basically the request on a single line with no spaces (serialized json)
    var json = JSON.stringify(request);
    var jsonBytes = Buffer.from(json, 'utf8');

    var privateKey = fs.readFileSync('private_key.pem', "utf8");  // get private key

    var sign = crypto.createSign('RSA-SHA256');
    sign.update(jsonBytes);
    var signed = sign.sign(privateKey, 'base64')

    // Signed String to Add to HTTP Header ‘signedString’.
    var signedString = signed.toString('base64');

    console.log(signedString);

    return signedString;
}



// Verify the Request signature using public key.
function verifyRequestSave(state) {
    // Wrap with TalkAgentRequest (Root object CBA Use)
    var request = { "TalkAgentRequest": state.context.input };
    var json = JSON.stringify(request);
    var jsonBytes = Buffer.from(json, 'utf8');
    var secretBytes = Buffer.from(httpHeaders.signedString, 'base64');

    var publicKey = fs.readFileSync('public_key.pem', "utf8");  // get private key
    var verifier = crypto.createVerify('sha256');
    verifier.update(jsonBytes);
    var result = verifier.verify(publicKey, secretBytes, 'base64');

    return result;
}