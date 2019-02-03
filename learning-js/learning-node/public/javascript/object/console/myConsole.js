// JavaScript Document
/**
 * $Id$
 * 
 * 
 * http://qunitjs.com/
 
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error

 */
$(function() {

	// http://udidu.blogspot.co.il/2012/12/override-console-functions.html
	(function(){
		//saving the original console.log function
		var preservedConsoleLog = console.log;

		//overriding console.log function
		console.log = function() {

			//we can't just call to `preservedConsoleLog` function,
			//that will throw an error (TypeError: Illegal invocation)
			//because we need the function to be inside the
			//scope of the `console` object so we going to use the
			//`apply` function
			preservedConsoleLog.apply(console, arguments);

			//and lastly, my addition to the `console.log` function
			if(application.socket){
				application.socket.emit('console.log', arguments);
			}
		}
	})();

	/**
	 * Module of Array Qunit tests
	 */
	module("console test");

	test("Error type test", function() {
	
    	log("Error type test starts");
    	
		var myErr = new Error("this is a new error message");

		ok(typeof myErr !== "string", "Error object is not a string");
		ok(typeof myErr === "object", "Error object is an object");

    });

	test("Cookie test", function() {
	
    	log("this is a test");
    	
    	try{
    	   unknownvariable.noattributte = "what?";
    	} catch (e) {
			log(e.stack);
    	 //  log("this is a test with exception", e);
    	}
    	
    	ok(true);
    });
    
	/**
	 * Log with your best effort.
	 */
	function setMyConsole() {
		var 
		if (message) {
			if(window["console"] && console["log"]) {
				if (exception) {
					console.log(message, exception);
				} else {
					console.log(message);
				}
			}
		}
	}	
	
});
