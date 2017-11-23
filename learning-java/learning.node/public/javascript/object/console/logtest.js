// JavaScript Document
/**
 * $Id$
 * 
 * 
 * http://qunitjs.com/
 */
$(function() {

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
	function log(message, exception) {
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
