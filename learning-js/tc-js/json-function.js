/*
UPS SalesForce test.
*/

let testStr = '[' +
    '[ { "funName": "fname1", "arguments": [] } ],' + 
    '[ { "funName": "fname1", "arguments": [] }, { "funName": "fname1", "arguments": [] } ]' +
    ']';

console.log(typeof testStr);

let testJson = JSON.parse(testStr);    

let liveChatMock = {
    fname1: function() {
        return this;
    },
    toString: function() {
        return "I am liveChatMock";
    }
}

console.log("-----------------------");
let i = 0;
testJson.forEach(element => {
    i++;
    var rootObj = liveChatMock;
    element.forEach(liveFunElement => {
        rootObj = liveChatMock[liveFunElement.funName].apply(rootObj, liveFunElement.arguments);
    });
});


process.exit(1)