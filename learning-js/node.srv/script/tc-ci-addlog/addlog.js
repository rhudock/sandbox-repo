/*
  This script is developed to add debug information into InqFramework.
*/

var fs = require("fs");
var kDiff3 = "\"C:\\Program Files (x86)\\KDiff3\\kdiff3.exe\"";

var sourceFile = 'source/InqFramework.js';
var targetFile = 'target/InqFramework.js';

fs.readFile(sourceFile, function (err, data) {
    if (err) {
        return console.error(err);
    }
    console.log("Reading: " + sourceFile);
    var re = /var Inq/;
    var dataStr = data.toString();
    dataStr = addDebugSolution(dataStr, './reformattextinput.js');

    fs.writeFile(targetFile, dataStr, function (err) {
        if (err) return console.log(err);
        else {
            console.log('New script with debugging info has been saved at: ' + targetFile);
            // startDiff(sourceFile, targetFile);
        }
    });
});

function addDebugSolution(dataStr, debugInfo ) {
    console.log("Adding Debugging " + debugInfo);

    var debugObj = require(debugInfo);
    debugInfo = debugObj.debugInfo;

    for(var i=0; i < debugInfo.length; i++) {
        if(debugInfo[i].enabled) {
            dataStr = dataStr.replace(debugInfo[i].keyToSearch, debugInfo[i].replaceWith);
        }
    }

    return dataStr;
}