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
	module("cookie test");

	test("Cookie test - cookies_enabled 1", function() {
		ok (are_cookies_enabled(), "Your browser cookie is disabled");
	});
	
	test("Cookie test - isCookieEnabled 2", function() {
		ok (isCookieEnabled(), "Your browser cookie is disabled");
	});

	test("Cookie test equal ( are_cookies_enabled(), isCookieEnabled()", function() {
		equal ( are_cookies_enabled(), isCookieEnabled(), "Your browser cookie is disabled");
	});

	test("Cookie test - Session Cookie Test 2", function() {
		ok (isSessionCookieEnabled2(), "Your browser cookie is disabled");
	});	

	test("Cookie test isSessionCookieEnabled ", function() {
		ok (isSessionCookieEnabled(), "Your browser cookie is disabled");
	});	
		
	test("Cookie test local", function() {
		var c_value = Math.floor(Math.random()*1001), c_name = 'sPc';
		
		createCookie(c_name, c_value, 20);
		
		equal ( readCookie(c_name), "" + c_value, "How come the values are different" );
	});	


     /**
     * http://sveinbjorn.org/cookiecheck
     */
    function are_cookies_enabled()
    {
    	var cookieEnabled = (navigator.cookieEnabled) ? true : false;
    
    	// if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled)
    	// {
    		document.cookie="testcookie";
    		cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false;
    	// }
    	return (cookieEnabled);
    }
    
    /**
     * true if cookie is enabled according to write and read test
     * 
     * http://sveinbjorn.org/cookiecheck
     */
    function isCookieEnabled()
    {
    	var cookieEnabled = (navigator.cookieEnabled) ? true : false;
    
    	// if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled)
    	// {
    	    var expiry = (new Date( (new Date()).getTime() + (366*24*3600*1000) )).toGMTString();
            document.cookie = "pc=1; path=/; expires="+expiry+";" ;
    		cookieEnabled = (document.cookie.indexOf("pc") != -1) ? true : false;
    	// }
    	return (cookieEnabled);
    }    
	
	/**
     * true if cookie is enabled according to write and read test
     * 
     * http://sveinbjorn.org/cookiecheck
     */
    function isSessionCookieEnabled2()
    {
		var c_value = Math.floor(Math.random()*1001), c_name = 'sPc';
		
		var isSessionCookiesEnabled = false;
		var expiry = (new Date( (new Date()).getTime() + (366*24*3600*1000) )).toGMTString();
		document.cookie=c_name + "=" + c_value;
		
	    if ((document.cookie.indexOf(c_name) != -1) && (document.cookie.indexOf(c_value) != -1)) { 
    		isSessionCookiesEnabled = true;
    		document.cookie=c_name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
	    }
		
		return isSessionCookiesEnabled;
    }    
	
    function isSessionCookieEnabled()
    {
		var c_value = Math.floor(Math.random()*1001), c_name = 'sPc';
		var isSessionCookiesEnabled = false;

		document.cookie=c_name + "=" + c_value;
		
	    if ((document.cookie.indexOf(c_name) != -1) && (document.cookie.indexOf(c_value) != -1)) { 
    		isSessionCookiesEnabled = true;
    		document.cookie=c_name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
	    }
		
		return isSessionCookiesEnabled;
    }    

		
function createCookie(name, value, days) {
    var expires = '',
        date = new Date();
    if (days) {
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toGMTString();
    }
    document.cookie = name + '=' + value + expires + '; path=/';
}
 
function readCookie(name) {
    var cookies = document.cookie.split(';'),
        length = cookies.length,
        i,
        cookie,
        nameEQ = name + '=';
    for (i = 0; i < length; i += 1) {
        cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}
 
function eraseCookie(name) {
    createCookie(name, '', -1);
}		
});



/* 
 * http://qunitjs.com/
 */
$(function() {

    /**
     * http://sveinbjorn.org/cookiecheck
     */
    function are_cookies_enabled()
    {
    	var cookieEnabled = (navigator.cookieEnabled) ? true : false;
    
    	if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled)
    	{ 
    		document.cookie="testcookie";
    		cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false;
    	}
    	return (cookieEnabled);
    }
    
    /**
     * true if cookie is enabled according to write and read test
     * 
     * http://sveinbjorn.org/cookiecheck
     */
    function isCookieEnabled()
    {
    	var cookieEnabled = (navigator.cookieEnabled) ? true : false;
    
    	if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled)
    	{ 
    	    var expiry = (new Date( (new Date()).getTime() + (366*24*3600*1000) )).toGMTString();
            document.cookie = "pc=1; path=/; expires="+expiry+";" ;
    		cookieEnabled = (document.cookie.indexOf("pc") != -1) ? true : false;
    	}
    	return (cookieEnabled);
    }    

	/**
	 * Module of Array Qunit tests
	 */
	// module("cookie test 2");
	//
	// test("Cookie test", function() {
	// 	ok (are_cookies_enabled(), "Your browser cookie is disabled");
	// });
	//
	// test("Cookie test", function() {
	// 	ok (isCookieEnabled(), "Your browser cookie is disabled");
	// });
	//
	// test("Cookie test", function() {
	// 	equal ( are_cookies_enabled(), isCookieEnabled(), "Your browser cookie is disabled");
	// });
	//
});
