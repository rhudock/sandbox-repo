/**
 * $Id$
 * 
 * 
 * Ref: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array
 */
$(function() {
	/**
	 * Module of Array Qunit tests
	 */
	module("LocalStorage");

	test("Local Storage Test", function() {
		ok ( isLSSupported(), "LocalStorage is supported on your browser" );
	});
	
	test("Local Storage Test", function() {
		equal ( localStorage.getItem("pc"), 2, "LocalStorage is supported on your browser" + localStorage.getItem("pc"));
	});

	test("Local Storage Test", function() {
		equal ( localStorage.getItem("pc"), 2, "LocalStorage is supported on your browser" + localStorage.getItem("pc"));
	});


	/**
	 *   Lets conflict
	 */

});
