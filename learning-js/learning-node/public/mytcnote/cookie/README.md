## Cookie Test
To test 1pc, 3pc cookie behavior in different browsers.

### To Run
Check Pre condition
> npm start

then open http://[www.]dleedesk.com/public/mytcnote/cookie/cookie-parent.html in a browser to test.

#### Pre Condition
- local ip mapping
```jshelllanguage
10.22.111.87	dleedesk.com	www.dleedesk.com	tc.dleedesk.com
10.22.111.87	www.tc.com	tc.com
```

#### Description
cookie-parent.html holds two iframes holding a test page in different domains.

- cookieQunit.js
```js
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

```