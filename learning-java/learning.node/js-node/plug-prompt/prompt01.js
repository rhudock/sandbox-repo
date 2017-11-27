// https://github.com/flatiron/prompt

var prompt = require('prompt');


var schema = {
    properties: {
        name: {
            pattern: /^[a-zA-Z\s\-]+$/,
            message: 'Name must be only letters, spaces, or dashes',
            required: true
        },
        password: {
            hidden: true
        }
    }
};


//
// Start the prompt
//
var i=0;
while (i < 10) {
    i++;
prompt.start();

//
// Get two properties from the user: username and email
//
    prompt.get(['username', 'email'], function (err, result) {
        //
        // Log the results.
        //
        console.log('Command-line input received:');
        console.log('  username: ' + result.username);
        console.log('  email: ' + result.email);
    });
}