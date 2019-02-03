/**
 * $Id$
 * 
 * Try to test for in in IE.

"number"	Operand is a number
"string"	Operand is a string
"boolean"	Operand is a Boolean
"object"	Operand is an object
null	Operand is null.
"undefined"	Operand is not defined.

 */

$(function() {

	module("typeof operator");

	test("typeof boolean", function() {
		
		var aBoolean = true;
		
		equal(typeof aBoolean, 'boolean', "typeof aBoolean is " + typeof aBoolean);
		
//		equals(undefined, noValue, "");
		
//		ok(!noValue);              //		 "message": "Can't find variable: noValue"
	});

	test("typeof object", function() {
		
		var aObj = {};
		
		equal(typeof aObj, 'object', "typeof aObj is " + typeof aObj);
		
	});

	test("typeof undefined", function() {
		
		equal(typeof noValue, "undefined", "typeof noValue is " + typeof noValue);
	});

	test("typeof number", function() {
		
		var aNum = 1234;
		
		equal(typeof aNum, 'number', "typeof aNum is " + typeof aNum);
	});

	test("typeof null", function() {
		
		var aNull = null;
		
		equal(aNull, null, aNull + ' is null BUT');
		equal(typeof aNull, "object", "typeof aNull is " + typeof aNull);
	});

	test("typeof string", function() {
		
		var aStr = "1234";
		
		equal(typeof aStr, 'string', "typeof aStr is " + typeof aStr);

	});

	/**
	 * Module of Array Qunit tests
	 */
	module("parseInt function");

	test("parseInt check.", function() {

		var i = "1234", j = "te1234a";
		var ri = parseInt(i, 10), rj = parseInt(j, 10);
		
		console.log("parseInt(i) = " + ri);
		console.log("parseInt(j) = " + rj);
		ok(ri);
		ok(!rj, "te1234a is not a number");

	});

	test("parseInt check.", function() {

		var i;
		var ri = parseInt(i, 10);
		
		console.log("parseInt(i) = " + ri);
		ok(findTrueFalse(ri));

	});

		test("parseInt check.", function() {

		ok(1234 === NaN);
		ok(NaN === NaN);

	});


	function findTrueFalse(a) {
	   return a ? true : false ;
    }
});