
/**
 * $Id$
 * 
 * 
 */
$(function() {
	
	/**
	 * Module of Array Qunit tests
	 */
	module("Array function Test");

	test("Array.removeElement() Test", function() {
		var mixable = {
			name : 'test',
			id : 1,
			etc : 'etc'
		}, caller = {};
		
		caller.mixIn = mixIn;
		caller.mixIn(mixable);

		// Actual, expected
		equals(typeof caller.prototype, "undefined", "typeof caller.prototype, undefined");
		
	});

});