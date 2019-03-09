// https://developer.mozilla.org/en-US/docs/DOM/document.cookie 
 /**
* allCookies.setItem(sKey, sValue, vEnd, sPath, sDomain, bSecure)
*
* @argument sKey (String): the name of the cookie;
* @argument sValue (String): the value of the cookie;
* @optional argument vEnd (Number - finite or Infinity, String, Date object or null): the max-age in seconds (e.g.
* 31536e3 for a year) or the expires date in GMTString format or in Date Object format; if not specified it will
* expire at the end of session;
* @optional argument sPath (String or null): e.g., "/", "/mydir"; if not specified, defaults to the current path
* of the current document location;
* @optional argument sDomain (String or null): e.g., "example.com", ".example.com" (includes all subdomains) or
* "subdomain.example.com"; if not specified, defaults to the host portion of the current document location;
* @optional argument bSecure (Boolean or null): cookie will be transmitted only over secure protocol as https;
* @return undefined;
**/
 
var allCookies = {
  getItem: function (sKey) {
    if (!sKey || !this.hasItem(sKey)) { return null; }
    return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? "; expires=Tue, 19 Jan 2038 03:14:07 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toGMTString();
          break;
      }
    }
    document.cookie = escape(sKey) + "=" + escape(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
  },
  removeItem: function (sKey, sPath) {
    if (!sKey || !this.hasItem(sKey)) { return; }
    document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sPath ? "; path=" + sPath : "");
  },
  hasItem: function (sKey) {
    return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },
  keys: /* optional method: you can safely remove it! */ function () {
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = unescape(aKeys[nIdx]); }
    return aKeys;
  }
};

/*
allCookies.setItem("test0", "Hello world!");
allCookies.setItem("test1", "Unicode test: \u00E0\u00E8\u00EC\u00F2\u00F9", Infinity);
allCookies.setItem("test2", "Hello world!", new Date(2020, 5, 12));
allCookies.setItem("test3", "Hello world!", new Date(2027, 2, 3), "/blog");
allCookies.setItem("test4", "Hello world!", "Sun, 06 Nov 2022 21:43:15 GMT");
allCookies.setItem("test5", "Hello world!", "Tue, 06 Dec 2022 13:11:07 GMT", "/home");
allCookies.setItem("test6", "Hello world!", 150);
allCookies.setItem("test7", "Hello world!", 245, "/content");
allCookies.setItem("test8", "Hello world!", null, null, "example.com");
allCookies.setItem("test9", "Hello world!", null, null, null, true);
 
alert(allCookies.keys().join("\n"));
alert(allCookies.getItem("test1"));
alert(allCookies.getItem("test5"));
allCookies.removeItem("test1");
allCookies.removeItem("test5", "/home");
alert(allCookies.getItem("test1"));
alert(allCookies.getItem("test5"));
*/
