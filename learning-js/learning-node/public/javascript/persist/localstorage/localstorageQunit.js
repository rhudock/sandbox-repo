/**
 * $Id$
 * 
 * 
 * Ref: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array
 */
$(function() {

	/**
	 * Return true if Safari is used on a supported device (tablet at the time of writing this code).
	 * 
	 * This generation support only Safari version xxx (not decided yet) or higher.
	 * 
	 * Tested Safari Versions.
	 * The Safari version tested on iPad is 5.0 /7534.48.3 (Mobile Safari)
	 * The Sarari tested on deskeop is 5.0 /533.16
	 */
	function isLSSupported() {

		var isSupported = false, version, istablet;
		var uaString = navigator.userAgent;
		var isSafari = (uaString.toLowerCase().indexOf('safari') !== -1 && uaString.toLowerCase().indexOf('chrome') === -1);
		
		if (isSafari === true) {
			/* Get device and Safari information */
			istablet = (/ipad|android 3|sch-i800|playbook|tablet|kindle|gt-p1000|sgh-t849|shw-m180s|a510|a511|a100|dell streak|silk/i.test(navigator.userAgent.toLowerCase()));
			version = uaString.substr(uaString.lastIndexOf('Safari/') + 7, 7);
			try {
				/* make decision to support chat. */
				if (window["localStorage"]) {
					localStorage.setItem("pc", 2);
					isSupported = true;
				}
			} catch(e) {
				log("ERROR while checking window.localStorage", e);
			}				
		}
		return isSupported; 
	}
	
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

});


/**
 * $Id$
 * 
 * Try to test for in in IE.
 */


$(function() {

	/**
	 * Module of Array Qunit tests
	 */
	module("HTML5 localstorage test");

	test("Simple Qunit Test you want to use.", function() {
		
		var expected, result;
		
		ok(!NaN, "NaN is " + NaN);
		ok(!false, "false is " + false);
		ok(!null, "null is " + null);
		equals(1, 1);
		equals(result, expected);
		
	});

	test("Browser's local storage is supported test", function() {

		ok(window.localStorage);
		equals(1, 1);

	});

	test("set() get() test", function() {

		var testItem = "Hello World";
		localStorage.clear;
		localStorage.setItem('testItem', testItem);

		equals(testItem, localStorage.getItem('testItem'));

	});
	
	test("What would getItem() return if a key doesn't exist?", function() {

		var testItem = "Hello World";
		localStorage.clear;
		localStorage.removeItem('testItem');
		
		equals(null, localStorage.getItem('testItem'), "localStorage.getItem with a key value does not exist returns null!");

	});

	test("Test current time", function() {

		var key = 'mytest', testItem = "Hello World";
		localStorage.clear;
		localStorage.setItem(key, testItem);

		equals(undefined, localStorage.removeItem(key), "localStorage.removeItem(key) returns " + localStorage.removeItem(key));
		
	});
  
	test("localStorage test get all itema", function() {

		var key1 = 'mytest1', testItem1 = "Hello World 1";
		var key2 = 'mytest2', testItem2 = "Hello World 2";
		var key3 = 'mytest3', testItem3 = "Hello World 3";
		var key4 = 'mytest4', testItem4 = "Hello World 4";

		localStorage.clear();
		localStorage.setItem(key1, testItem1);
		localStorage.setItem(key2, testItem2);
		localStorage.setItem(key3, testItem3);
		localStorage.setItem(key4, testItem4);

		var keys = "", i=0, key;
		
		for (i=0; i< localStorage.length; i++) {
			keys = keys + localStorage.key(i);
		}
		
		ok ( keys.indexOf("mytest4") > 0, "Keys " + keys);
		
	});  

	test("localStorage test get all itema with for in.", function() {

		var key1 = 'mytest1', testItem1 = "Hello World 1";
		var key2 = 'mytest2', testItem2 = "Hello World 2";
		var key3 = 'mytest3', testItem3 = "Hello World 3";
		var key4 = 'mytest4', testItem4 = "Hello World 4";
		var f;

		localStorage.clear();
		localStorage.setItem(key1, testItem1);
		localStorage.setItem(key2, testItem2);
		localStorage.setItem(key3, testItem3);
		localStorage.setItem(key4, testItem4);

		var keys = "", i=0, newObj={};
		
		for (f in localStorage) {
			newObj[f] = localStorage.getItem(f);
		}
		
		ok ( newObj[key1] );
		
	});  
		
});
