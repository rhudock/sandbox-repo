/**
 * $Id$
 * 
 * 
 * Ref: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String
 */
$(function() {

	/**
	 * Module of String Qunit tests
	 */

	module("String use case test");

	/**
	 * Returns the index within the calling String object of the first occurrence of the specified value, 
     * or -1 if not found.
	 *
	 * Ref: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/indexOf
	 */
	
	test("01 Change https to http if https is used in URL", function() {

        var expected = "Http://totalgym.inq.com", actual = "";
		var strURL = "Https://totalgym.inq.com";
        
        if ( strURL.toLowerCase().indexOf("https") == 0 ) {
			actual = strURL.substring( 0, 4 ) + strURL.substring ( 5 ) ;
        } else {
			actual = strURL;
		}
	   
		equal ( actual, expected, "actual= " + actual + "\nexpected= " + expected );
	});	
	
	test("replace test", function() {

        var expected = "TEST-com.inq.InqFramework.SimpleTest.oktest", actual = "";
		var strURL = "TEST-com.inq.InqFramework.Simple Test.ok test";
        
		actual = expected.replace(" ", "", "g");
	   	equal ( actual, expected, "actual= " + actual + "\nexpected= " + expected );
		
		actual = expected.replace( / /g, "");
	   	equal ( actual, expected, "actual= " + actual + "\nexpected= " + expected );
	});	


	module("Test Browser Types");

	/**
	 * Returns the index within the calling String object of the first occurrence of the specified value, 
     * or -1 if not found.
	 *
	 * Ref: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/indexOf
	 */
	
	test("01 Find Safari Browser", function() {

		// True on Safari userAgent.
        var uaString = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/534.57.2 (KHTML, like Gecko) Version/5.1.7 Safari/534.57.2";
		var expected = true;
		var actual = ( /safari/i ).test(uaString) && !( /chrome/i ).test(uaString);
	   
		equal ( actual, expected, "actual= " + actual + "\texpected= " + expected );

		// Fail on Chrome,
		uaString = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.57 Safari/537.17";
		expected = false;
		actual = ( /safari/i ).test(uaString) && !( /chrome/i ).test(uaString);

		equal ( actual, expected, "actual= " + actual + "\texpected= " + expected );


		// Fail on IE,
		uaString = "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; WOW64; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; CMDTDF; .NET4.0C; .NET4.0E)"
		expected = false;
		actual = ( /safari/i ).test(uaString) && !( /chrome/i ).test(uaString);

		equal ( actual, expected, "actual= " + actual + "\texpected= " + expected );

	});	



});
