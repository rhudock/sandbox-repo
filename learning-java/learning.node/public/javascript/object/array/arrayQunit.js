/**
 * $Id$
 * 
 * 
 * Ref: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array
 */

 
Array.prototype.contains = function(item, equalsFcn){
	/* RU */
	for(var idx=0; idx<this.length; idx++){
		if((equalsFcn && equalsFcn(this[idx], item)) || (item && item.equals && item.equals(this[idx])) || this[idx]==item){
			return true;
		}
	}
	return false;
};

$(function() {

	/**
	 * Module of Array Qunit tests
	 */
	module("Array object Life Cycle");

	test("Array test - create array objects", function() {
		var arrayLength = 3;
		var arr1 = new Array(arrayLength);
		var arr2 = new Array('element0', 'element1', 'elementN');
		
	    var lit = ['element0', 'element1', 'elementN'];  
		
		equal ( arrayLength, arr2.length );
	});
	
	test("Array test - create array objects like map", function() {
	   var anArray = [];
	   
	   var me = "Nice", you = "Good";
	   anArray["me"] = me;
	   anArray["you"] = you;
	   
		equal ( anArray["me"], me, "anArray[\"me\"] is " + anArray["me"]);
		equal ( anArray["you"], you, "anArray[\"you\"] is " + anArray["you"]);
		
		anArray["10"] = "en";

		equal ( anArray["" + 10], "en", "anArray[\"10\"] is " + anArray["" + 10]);
	});	
	
	test("Array test 01.1 - Relationship between length and numerical properties", function() {
		
		var a = [];

		a[0] = 'a';
		equal (a[0], 'a' ); // 'a'
		equal (a.length, 1); // 1

		a[1] = 32;
		equal(a[1], 32); // 32
		equal(a.length, 2); // 2

		a[13] = 12345;
		equal(a[13], 12345); // 12345
		equal(a.length, 14); // 14

		a.length = 10;
		equal (a[13], undefined); // undefined, when reducing the length elements after length+1 are removed
		equal(a.length, 10); // 10
	});
	
	
	test("Array test 01.2 - Creating an array using the result of a match", function() {
		
		// Match one d followed by one or more b's followed by one d
		// Remember matched b's and the following d
		// Ignore case

		var myRe = /d(b+)(d)/i;
		var myArray = myRe.exec("cdbBdbsbz");
		
		ok ( myArray, myArray );  // dbBd,bB,d  -- ** I do not understand this. Why
		
	});
	
	/**
	 * 
	 */
	module("Array ; function test");	

	/**
	 * The splice method returns the element removed, if only one element is
	 * removed (howMany parameter is 1); otherwise, the method returns an
	 * array containing the removed elements. Note that the last browser to
	 * use JavaScript 1.2 was Netscape Navigator 4, so you can depend on
	 * splice always returning an array.
	 *
	 * Ref: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/splice
	 */
	test("Array - Function Test - splice()", function() {
		
		// 1. assumes a print function is defined
		var myFish = ["angel", "clown", "mandarin", "surgeon"];
		ok(myFish, "1. Testing an array myFish - after initiate: " + myFish);

		// 2. add 'drum' into the array
		var removed = myFish.splice(2, 0, "drum");  // angel,clown,drum,mandarin,surgeon
		ok(myFish,"2. Adding 'drum' at 2, 0 " + myFish);

		removed = myFish.splice(3, 1);  // angel,clown,drum,surgeon
		ok(myFish,"3. Remove items start at 3 for one item : " + myFish);
		
		ok(myFish,"3-1. Removed item is: " + removed);

		removed = myFish.splice(2, 1, "trumpet"); // angel,clown,trumpet,surgeon
		ok(myFish,"After replacing 1: " + myFish);
		ok(myFish,"removed is: " + removed);

		removed = myFish.splice(0, 2, "parrot", "anemone", "blue"); // parrot,anemone,blue,trumpet,surgeon
		ok(myFish,"After replacing 2: " + myFish);
		ok(myFish,"removed is: " + removed);
		
	});

	test("Array - Function Test - More - splice()", function() {
		
		// 1. assumes a print function is defined
		var myFish = ["angel"];
		var removed = myFish.splice(0, 1);  // angel,clown,drum,mandarin,surgeon
		ok(myFish,"2. Adding 'drum' at 2, 0 " + myFish);
	});

	/**
	 * The sort() method can be conveniently used with closures: 
	 */
	test("Array - Function Test - sort", function() {
		
		var numbers = [4, 2, 5, 1, 3];
		numbers.sort(function(a, b) {
		    return a - b;
		});
		ok(numbers, numbers);
		
	});



	/**
	 * The sort() method can be conveniently used with closures: 
	 */
	test("Array - Function Test - sort", function() {
	
		var myarray = ["test", "pc", "apple", "orange", "tomato"];

		ok( myarray.contains("pc", function(objA, objB) { return objA === objB; } ) );
		ok( !myarray.contains("NO Entreey", function(objA, objB) { return objA === objB; } ) );
		
	});
	
});
