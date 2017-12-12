    // sign with default (HMAC SHA256)
var jwt = require('jsonwebtoken');
var fs = require('fs');



var request = {
    ProductCode: "BB",
    ProductName: "Baked Beans"
}

    // sign with RSA SHA256
var cert = fs.readFileSync('private_key.pem');  // get private key
var token = jwt.sign(request, cert, { algorithm: 'RS256', expiresIn: '1h' });
console.log(token);


    // Verify
    
var cert = fs.readFileSync('public.crt');
var ver = jwt.verify(token, cert);


try {
    var ver = jwt.verify(token, "BAD");
}
catch(err){
    console.log(err);
}


//var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
    //backdate a jwt 30 seconds
//var older_token = jwt.sign({ foo: 'bar', iat: Math.floor(Date.now() / 1000) - 30 }, 'shhhhh');
    // sign asynchronously
// jwt.sign(request, cert, { algorithm: 'RS256' }, function(err, token1) {
//   if (err){
//     console.log(err);
//     return;
//   }
//   console.log(token1);
// });

