const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

testFn();


/**
 * This function can be used as recursively accept user input.
 */
function testFn() {

    rl.question('What do you think of Node.js? (type end to end)', (answer) => {
        // TODO: Log the answer in a database
        if(answer != 'end') {
            console.log(`Thank you for your valuable feedback: ${answer}`);
            testFn();
        } else {
            rl.close();
            process.exit(0);
        }
    });

}

console.log('this is a test');