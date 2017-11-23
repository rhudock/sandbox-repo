/**
 * $Id$
 * 
 * 
 * Ref: http://www.i-programmer.info/programming/javascript/2550-javascript-bit-manipulation.html
 */
$(function() {

	/**
	 * Module of Array Qunit tests
	 */
	module("Bitwise Operator Test");

	test("And & operator test", function() {
        var a = 0xF0;   // 240
        var b = 0xFF;   // 255
        var c = ~a & b;
		
		equal ( c, 15 );
	});
	
	test("And & operator test", function() {
        var a = 0xFFFFFFF;
        var b = 0xFFFFFFF;
        var c = a & b;
		
		equal ( c, 0xFFFFFFF );
	});
	
	test("Check the first bit", function() {
        var a = 1;
        var mask=parseInt("1",2);
        var c = a & mask;
		
		equal ( c, 0 );
		
		ok (c);
	});
	
	test("Check the second bit", function() {
        var a = 3;
        var mask=parseInt("10",2);
        var c = a & mask;
		
		equal ( c, 1 );
		
		ok(c);
	});
	


});
