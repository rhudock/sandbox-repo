/*
 *  Return a browser storage wrapper object based on environment and client system condition.
 *  
 *  
 *  Persistent Storage using Cookie, LocalStorage, or etc.
 */

/*
 * This is short way around of BOA launch requirement.
 * BOA wants to use only top domains in the list as cookie domain.
 *
 * Check cookie creation codes - useRootDomain is used.
 */
var useRootDomainList = [ "bankofamerica.com", "ml.com", "merrilledge.com", "bankcardservices.co.uk", "tcsandbox.com" ];
var useRootDomain;

for(var urdIndex = 0; urdIndex < useRootDomainList.length; urdIndex++ ) {
	if(window.location.href.indexOf(useRootDomainList[urdIndex]) !== -1) {
		useRootDomain = useRootDomainList[urdIndex];
		break;
	}
}
// End of BOA requirements

var PersistentStorage = (function() {

	var uniqueInstance;
	
	var STORAGE_EXPIRE_PREFIX = 'LSCACHE-';         /* Prefix of localStorage item name to store its pare item's expiration date.  */ 
	var EXPIRY_BASE = 10;							/* Expiration date base   */
	var COOKIE = 'cookie', LOCALSTORAGE = 'localStorage';
	var COOKIE_PC_NAME = "inqPc";
	var storageCondition = null;
    var cookieEnabled;

	/**
	 * A singleton constructor has condition checker to select correct storage instance. 
	 * Also uses lazy initialization and the object is created when it is first time used.  
	 */
	function constructor() {
		
		var instance;

		/* Make Test condition */
		if (isCookieEnabled()) {
			 storageCondition = COOKIE;
		} else {
			if (isLSSupported()) {
				storageCondition = LOCALSTORAGE;
			}
		}

		/* Create an instance according to condition test result */
		if (storageCondition === COOKIE) {
			instance = getCookieInstance();
		} else if (storageCondition === LOCALSTORAGE){
			instance = getLocalStorageInstance();
		} else {
			instance = null;
		}
		
		console.log("PersistentStorage returns " + storageCondition + " in " + location.href);
		return instance;
	}
	
	/*
	 *   return a singleton  
	 */
	return {
		getInstance: function() {
			if(!uniqueInstance) {
				uniqueInstance = constructor();
			}
			return uniqueInstance;
		},
		isLocalStorageUsed: isLocalStorageUsed,
		_testHook: {
			getCookieInstance: getCookieInstance,
			getLocalStorageInstance: getLocalStorageInstance
		}
	}
	
    /**
     * true if the uniqueInstance is localStorage instance.
     */
	function isLocalStorageUsed() {
		return (uniqueInstance && storageCondition === LOCALSTORAGE );
	}
		
	/**
     * true if cookie is enabled according to write and read test
     * 
     * http://sveinbjorn.org/cookiecheck
     */
    function isCookieEnabled()
    {
    	if (typeof cookieEnabled == 'undefined')
    	{
    	    var expiry = (new Date( (new Date()).getTime() + (366*24*3600*1000) )).toUTCString();
			document.cookie = COOKIE_PC_NAME + "=1; path=/; expires="+expiry+";" + (window.location.href.indexOf(useRootDomain) != -1 ? ( "domain=" + useRootDomain + ";") : "" );
            cookieEnabled = (document.cookie.indexOf(COOKIE_PC_NAME) != -1) ? true : false;
			document.cookie = COOKIE_PC_NAME + "=1; path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT";
    	}
    	return (cookieEnabled);
    }
    
	/**
	 * Return true on supported browsers with LocalStorage enabled/supported.
	 * 
	 * Supported Browsers: Safari, FireFox
	 *
	 * Safari version tested on iPad is 5.0 /7534.48.3 (Mobile Safari)
	 * Sarari tested on desktop is 5.0 /533.16
	 * FireFox tested on desktop is 19
	 */
	function isLSSupported() {

		var isSupported = false;
		var uaString = window.navigator.userAgent;

		if (/firefox/i.test(uaString)) {
			try {
				if (window["localStorage"] && !isIos7( navigator.userAgent ) ) {
					localStorage.setItem(COOKIE_PC_NAME, 2);
					isSupported = true;
				}
			} catch(e) {
				log("WARNING window.localStorage is not supported and chat may not be offered.", e);
			}				
		}
		return isSupported;

        function isIos7 ( uagent ) {
            return /(iPad|iPhone).*OS 7/i.test( uagent ) ;
        }
	}

	
	/**
	 * Internal log function.
	 */
	function log(message, exception) {
		if (message) {
			if(window["console"] && console["log"]) {
				if (exception) {
					console.log(message, exception);
				} else {
					console.log(message);
				}
			}
		}
	}	
	
	/**
	 *  Private Local functions to create storage instance.
	 * 
	 *  All instances need to have same interface, but in javascript it is not handy to enforce,
	 *  So, this version just make sure all instances have same interface.
	 *  
	 *  length: number of variable saved.
	 *  get(): get storage object.
	 *  getItem(key): get a single item with name
	 *  setItem(key, value, lifetime, path): set a single item with name, value, expiration in milliseconds or GTM, and path
	 *  removeItem (key): remove an item
	 *  clear(): clear storage.
	 *  
	 *  version: version of instance.
	 *  
	 *  Name convention get + storage name _ Instance 
	 *  
	 *  
	 *  *** Interface Definition 
	 *  
	 *  getAllCookies(): 	return as an string instance of cookie.
	 *  get(): 				return all items in an object.
	 *  getItem(): 			equivalent to localStorage.getItem(). 
	 *  setItem(key, value, lifetime, path):
	 *  					key   - item key
	 *  					value - item value
	 *  					lifetime  - optional, a number in milliseconds or a date string.
	 *  							A session cookie or sessionStorage item is created when it is empty string or undefined 
	 *  					path  - Cookie path, not used in localStorage instance.
	 *  removeItem(): 		equivalent to localStorage.removeItem(). 
	 *  clear(): 			equivalent to localStorage.clear(). 
	 *  onUnload():			handling session type variables and any clean up job.
	 */
	function getLocalStorageInstance() {
		var SESSION_INDICATOR = "session";

		var localStorageHelper = {
			setValue : function (key, value, expired) {
				localStorage.setItem(STORAGE_EXPIRE_PREFIX + key, expired);
				localStorage.setItem(key, value);
			}
		}

		return {
			getAllCookies: function() {
				var cookieValues = "";
				var value;
				var SESSION_INQCA_STR = "sinqCA", sessionCA;
				for (f in localStorage) {
					if (f.indexOf(STORAGE_EXPIRE_PREFIX) !== 0) {
						value = localStorage.getItem(f);
						
						/* 
						 * If the flag in sessionStorage is on, the ACTIVE chat belongs to the current session.
						 * Which means inqCA has to be 0 to ACTIVE on a new page in this session.
						 */
						if ( f.indexOf("inqCA") ===0 ) {
							sessionCA = sessionStorage.getItem(SESSION_INQCA_STR)	;
							if (!isNaN(sessionCA) && sessionCA > 0) {
								value = 0;
							}
						}
									
						cookieValues += "" + f + "=" + value + ";" ;
					}
				}

				return  cookieValues;
			},
			
			/*
			 * Only Safari allows for ( in localStorage) and this cannot be used for other browsers.
			 */
			get: function (){
				var obj = {};
				for (f in localStorage) {
					if (f.indexOf(STORAGE_EXPIRE_PREFIX) !== 0) {
						obj[f] = localStorage.getItem(f);
					}
				}

				return obj;
			},

			getItem:	function (key) {
				var today = new Date();
				var expired = localStorage.getItem(STORAGE_EXPIRE_PREFIX + key);
				if (expired !== null && expired !== SESSION_INDICATOR) {
					expired = parseInt(expired, EXPIRY_BASE);
					if (!isNaN(expired) && expired < today.getTime()) {
						this.removeItem(key);
						return null;
					}
				}
				return localStorage.getItem(key);
			},

			setItem : function setItem(key, value, lifetime, path ) {
				if (typeof lifetime !== 'undefined' && lifetime !== "" ) {
					var today = new Date();
					var lifetimeInMs = parseInt(lifetime, EXPIRY_BASE);

					if (!isNaN(lifetimeInMs)) {
						if (lifetime > 0) {
							localStorageHelper.setValue(key, value, today.getTime() + lifetime);
						} else {
							this.removeItem(key);
						}
					} else {
						var expired = Date.parse(lifetime);
						if (!isNaN(expired)) {
							if (expired > today.getTime()) {
								localStorageHelper.setValue(key, value, expired);
							} else {
								this.removeItem(key);
							}
						} else {
							log("ERROR: PersistentStorage.cookieInstance: lifetime has to be a number or a date string");
							return;
						}
					}
				} else {
					localStorageHelper.setValue(key, value, SESSION_INDICATOR);
				}
			},

			removeItem:	function (key) {
				localStorage.removeItem(STORAGE_EXPIRE_PREFIX + key);
				localStorage.removeItem(key);
			},

			clear: function() {
				localStorage.clear();
			} ,
			
			onUnload: function() {
				setSessionStorageTimeout();
			},

			version: 'localStorage.0.0.3'
		};
		
		/**
		 * When windows is unloaded, all localStorage with session indicator will have time out of SESSION_TIMEOUT.
		 * Which will allow pages on a new browser in the same site to pick up session variables.
		 */
		function setSessionStorageTimeout() {
			var today = new Date();
			var WAIT_PERIOD = 5 * 60 * 1000; // Wait for this period after a browser is closed.
			var SESSION_TIMEOUT = today.getTime() + WAIT_PERIOD; 
			
			for (f in localStorage) {
				if (f.indexOf(STORAGE_EXPIRE_PREFIX) === 0  && localStorage.getItem(f) === SESSION_INDICATOR) {
					localStorage.setItem(f, SESSION_TIMEOUT)
				}
			}
		}
	}
	
	function getCookieInstance() {
		return {
			getAllCookies: function() {
				return document.cookie;
			},
			get: function (){
				var a_all_cookies =  document.cookie.split( ';' );
				var a_temp_cookie = '';
				var cookie_name = '';
				var cookie_value = null;
				var retval = null;
		
				for ( var i = 0; i < a_all_cookies.length; i++ ) {
					// now we'll split apart each name=value pair
					a_temp_cookie = a_all_cookies[i].split( '=' );
		
					// and trim left/right whitespace while we're at it
					cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');
		
					// if the extracted name matches passed check_name
						// we need to handle case where cookie has no value but exists (no = sign, that is):
					if ( a_temp_cookie.length > 1 ){
							cookie_value = decodeURIComponent( a_temp_cookie[1].replace(/^\s+|\s+$/g, '') );
						}
					if(retval==null)
						retval = {};
						// note that in cases where cookie is initialized but no value, null is returned
					retval[cookie_name] = cookie_value;
					a_temp_cookie = null;
					cookie_name = '';
				} 
				return retval;
			},
			
			getItem: function (key) {
				var keyEQ = key + "=";
				var ca = document.cookie.split(';');
				for(var i=0;i < ca.length;i++) {
					var c = ca[i];
					while (c.charAt(0)==' ') c = c.substring(1,c.length);
					if (c.indexOf(keyEQ) == 0) return c.substring(keyEQ.length,c.length);
				}
				return null;
			},

			/**
			 * Save item into Cookie object.
			 * 
			 * @param key   - name
			 * @param value - value
			 * @param lifetime - optional number as days from now or string represent a date
			 * @param path  - optional string or path, used in cookie only.
			 */
			setItem: function (key, value, lifetime, path) {
				
				var daysAsNumber, expires = "";
				
				/* Test days argument 
				 * First, check session cookie condition. 
				 */
				if (typeof lifetime === 'undefined' || lifetime === "" ) {
					expires = "";
				} else {
					var lifetimeInMs = parseInt(lifetime, EXPIRY_BASE);

					/* If days is a number, then convert it to string */
					if (!isNaN(lifetimeInMs)) {
						if (lifetimeInMs > 0) {
							var date = new Date();
							date.setTime(date.getTime()+lifetimeInMs);
							expires = ";expires="+date.toUTCString();
						} else {
							expires = ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
						}
					} else {
						/* If days is a date string  */
						var d = Date.parse(lifetime);
						if ( !isNaN(d) ) {
							expires = ";expires=" + lifetime;
						} else {
							log("ERROR: PersistentStorage.cookieInstance: days has to be a number or a date string");
							return;
						}
					}
				}
				document.cookie = key+"="+value+expires+"; path=/" + (window.location.href.indexOf(useRootDomain) != -1 ? ( ";domain=" + useRootDomain) : "" );
			},

			removeItem:	function (key) {
				this.setItem(key,"",-1);
			},
			
			clear: function() {
				// interface - do nothing for cookie.
			} ,
			
			onUnload: function() {
				// interface - do nothing for cookie. 
			},
			
			version: 'cookie.0.0.3'
		};
	}
})();

/**
 * Create XMLHttpRequest object for Ajax calls.
 * @returns {Object} XMLHttpRequest object
 */
function getXMLHttpRequest() {
	if (window.XMLHttpRequest) {
		return new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		return new ActiveXObject("Microsoft.XMLHTTP");
	} else {
		throw new Error("Impossible to create XMLHttpRequest object.");
	}
}

/**
 * Set the timeout for XMLHttpRequest which created via ActiveXObject("Microsoft.XMLHTTP"),
 * because it has no the native timeout implementation.
 *
 * Is used the setTimeout to abort the active request after timeout.
 *
 * @param timeout {(string|number)}
 * @param xhrId {string} - request id
 * @param xhrController {Object} - the map of active requests
 */
function setTimeoutXHR(timeout, xhrId, xhrController) {
	if (timeout > 0 && xhrController) {
		return setTimeout(function() {
				if (xhrController[xhrId]) {
					xhrController[xhrId].abort();
				}
			}, timeout);
	}
}

/**
 *  toJsString - Stringifies the given string value.
 *     1) All special escape characters are escaped with back slash
 *     2) If the optional quote is given, then it is put at beginning and end of string
 *   called as:  toJsString(foo, "'");
 *   or: toJsString(foo, '"');
 *   or: toJsString(foo);
 * 		Where foo is a string to be stringified (escaped and made into a JS String).
 * @param val {String} value to be escaped
 * @param quote {String} optional character (or string) to be used as a quote
 */
function toJsString(val, quote) {
	if (typeof(val) == 'string') {
		var value = val;
		value = value.split("\\").join("\\\\");
		value = value.split("\"").join("\\\"");
		value = value.split("\'").join("\\\'");
		value = value.split("\n").join("\\n");
		value = value.split("\r").join("\\r");
		value = value.split("\t").join("\\t");
		if (quote)
			value = quote + value + quote;
		return value;
	}
	return val;
}

/**
 * Log with your best effort.
 */
function log(message, exception) {
	if (message) {
		if(window["console"] && console["log"]) {
			if (exception) {
				console.log(message, exception);
			} else {
				console.log(message);
			}
		}
	}
}

function formatArgument(arg) {
	try {
		var type = "[unknown]";
		try {type = (typeof(arg) == "object")?((arg["constructor"]!=null)?arg.constructor.toString():""+arg):("("+typeof(arg)+")");}
		catch (e){type=""+arg;}
		if (type.indexOf("function")!=-1){
			type = type.split("\n").join(" ").replace(/^\s*function (\w+)\s*\(\)[^\n]*/g , "[object $1]" );
		}
		if (type=="(boolean)" || type=="[object Boolean]") type = (arg)?"true":"false";
		if (type=="(string)" || type=="[object String]") type = toJsString(arg,"\"");
		if (type=="(array)" || type=="[object Array]") {
			type = "";
			for (var ix=0; ix<arg.length;ix++) {
				type += ((type.length!=0)?",":"")+formatArgument(arg[ix]);
				if (type.length > 128) break;
			}
			if (type.length > 128)
				type = type.substr(0,128-3)+"...";
			return "["+type+"]";
		}
		return type;
	} catch(e){
		return "[argument]";
	}
}

function getStackTrace(err) {
	try {
		var callstack = [];
		try {
			i.dont.exist+=0; //doesn't exist- that's the point
		} catch(e) {
			if (e.stack) { /*Firefox and Chrome*/  }
			else if (window.opera && e.message) { //Opera
				var lines = e.message.split('\n');
				for (var i=0, len=lines.length; i<len; i++) {
					if (lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
						var entry = lines[i];
						//Append next line also since it has the file info
						if (lines[i+1]) {
							entry += ' at ' + lines[i+1];
							i++;
						}
						callstack.push(entry);
					}
				}
				//Remove call to printStackTrace()
				callstack.shift(); callstack.shift();
				return callstack.join("\n\t\t") ;
			}
		}
		//IE and Safari
		// Need test to see if caller is defined
		if (arguments && arguments.callee && arguments.callee.caller) {
			var fnctn = arguments.callee.caller.caller;
			while (fnctn) {
				var fn = ""+fnctn.toString();
				var fnameIx = fn.indexOf("function ")+9;
				var fnameEnd = fn.indexOf('(', fnameIx);
				var fname = fn.substring(fnameIx, fnameEnd) || 'anonymous function';
				var args = "";
				if (fnctn.arguments.length) {
					for (var ix=0; ix < fnctn.arguments.length; ix++) {
						var arg = fnctn.arguments[ix];
						args += ((args.length!=0)?",":"")+formatArgument(arg);
					}

				}
				callstack.push(fname+"("+args+")");
				fnctn = fnctn.caller;
			}
			return "stack trace:\n\t\t" + callstack.join("\n\t\t");
		}
		return "";
	} catch (e) {
		return "" ;
	}
}

function catchJsFormatter(err, command) {
	try {
		var desc = "\tERROR while processing " + command + ": ";
		for (var itm in err) {
			desc += "\n\t" + itm + ": " + (""+err[itm]).split("\n").join("\n\t\t");
		}
		desc += "\n\t" + getStackTrace(err);
		return toJsString(desc);
	} catch (e) {
		return "";
	}
}

function parseStringToBoolean(val) {
	if (typeof val == "string") {
		return val == "true";
	} else {
		return val;
	}
}

function _addEventListener(object, eventName, handler, useCapture){
	if(!useCapture) { // default to false
		useCapture = false;
	}
	if (window["addEventListener"]) {
		object.addEventListener(eventName, handler, useCapture);
	} else if (window["attachEvent"]) {
		object.attachEvent("on" + eventName, handler);
	}
}

/**
 * This function attempts to send data to a web server prior to the unloading of the document.
 *
 * Format of request:
 * - Method: POST
 * - Content-Type: "text/plain;charset=UTF-8"
 *
 * @see [MDN Navigator.sendBeacon()]{@link https://developer.mozilla.org/ru/docs/Web/API/Navigator/sendBeacon}
 * navigator.sendBeacon - is experimental API (as of Oct 2015, is supported in Firefox and Google Chrome)
 *
 * @param {string} url - The url parameter indicates the resolved URL where the data is to be transmitted.
 * @param {string} data - Object, serialized to JSON string, which is to be transmitted.
 */

function sendBeacon(url, data) {
	if (navigator.sendBeacon) {
		navigator.sendBeacon(url, data);
	} else {
		sendBeaconByXHR(url, data);
	}
}

/**
 * This function attempts to submit data to a server by using a synchronous XMLHttpRequest in an unload
 * (or beforeunload, or hidepage etc.) handler. This results in the unload of the page to be delayed.
 * The synchronous XMLHttpRequest forces the User Agent to delay unloading the document,
 * and makes the next navigation appear to be slower.
 * There is nothing the next page can do to avoid this perception of poor page load performance.
 * But this is the only way to make the sending of beacon, if there is no method "navigator.sendBeacon()".
 *
 * Request parameters matches the API navigator.sendBeacon()
 * @see [MDN Navigator.sendBeacon()]{@link https://developer.mozilla.org/ru/docs/Web/API/Navigator/sendBeacon}
 *
 * @param {string} url - The url parameter indicates the resolved URL where the data is to be transmitted.
 * @param {string} data - Object, serialized to JSON string, which is to be transmitted.
 */
function sendBeaconByXHR(url, data) {
	var xHR = getXMLHttpRequest();
	xHR.open("POST", url, false);
	xHR.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
	xHR.send(data);
}
;/**
 * UnloadController used to create and manage by multiple handlers
 * for different event which appears before page will be unloaded, e.g.:
 * beforeunload, pagehide, unload
 */
function UnloadController(handler, params, initValue) {
	this.active = false;
	this.handler = handler;
	this._value = initValue || null;
	if (params) {
		for (var k in params) {
			this[k] = params[k];
		}
	}
}
UnloadController.prototype.activate = function() {
	if (!this.onunload) {
		this.onunload = function(e) {
			if (this.isActive()) {
				this.handler(e);
				// We need to handle unload event only one time
				// therefore deactivate it immediately after the first call.
				this.deactivate();
			}
		};
		var self = this;
		this._addUnloadHandler(function(e) {
			e = e || window.event; //need for IE8
			self.onunload(e);
		});
	}
	this.active = true;
};
UnloadController.prototype.deactivate = function() {
	this.active = false;
};
UnloadController.prototype.isActive = function() {
	return this.active;
};
UnloadController.prototype.set = function(value) {
	this._value = value;
};
UnloadController.prototype.get = function() {
	return this._value;
};

/**
 * Adds unload handlers.
 *
 * We should use handler of UNLOAD event
 * because BEFOREUNLOAD event not firing when iframe removed from the DOM.
 *
 * We also use BEFOREUNLOAD event because in modern WebKit browsers
 * don't necessarily fire UNLOAD event at the moment where the page is hidden.
 * @see: For more detail see tickets RTDEV-8126 and RTDEV-8293 and followings discussion:
 * @see: https://www.webkit.org/blog/516/webkit-page-cache-ii-the-unload-event/
 *
 * And we should use handler of PAGEHIDE event
 * because UNLOAD and BEFOREUNLOAD event is not firing anymore in IOS9.
 * @see: http://jira.touchcommerce.com/browse/RTDEV-10626
 *
 * @param {function} handler - event handler
 * @param {boolean} useCapture - optional, @see window.addEventListener
 */
UnloadController.prototype._addUnloadHandler = function(handler, useCapture) {
	_addEventListener(window, "unload", handler, useCapture);
	_addEventListener(window, "beforeunload", handler, useCapture);
	_addEventListener(window, "pagehide", handler, useCapture);
};
var ptStorage = PersistentStorage.getInstance();

var bPostMessage = (window["postMessage"]!=null);
var hasStringSupport = false;
var previousCommand = "";
var xHRsInProgress = {};
var xhrTimeoutConroller = {};
var caUnloadController;
var beaconUnloadController;
var KEY_ENGAGEMENT_ID_STRING = "engagementID";

function simpleChatPost(xfrdata) {
    var qIx = xfrdata.indexOf("?");
    if (qIx == -1) {
        return;
    }
    var url = xfrdata.substring(0, qIx);
    var data = xfrdata.substring(qIx + 1);
    var xHR = getXMLHttpRequest();
	xHR.open("POST", url, true) ;
	xHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	// The "Connection" and "Content-Length" should be deleted by security reasons
	// See http://stackoverflow.com/questions/2623963/webkit-refused-to-set-unsafe-header-content-length or http://stackoverflow.com/questions/7210507/ajax-post-error-refused-to-set-unsafe-header-connection
	xHR.send(data);
}

function doCommandsInClientDomain(data, clientHtml, id) {
    var cmd = new Array();
    if (typeof(data) == "string") {
        cmd[0] = id;
        cmd[1] = data;
    } else {
        cmd = data;
    }

  if (!bPostMessage) {
	// initial origin: http://home.inq.com
	// active origin:  http://inq.com (set via document.domain)
	// needed origin:  http://www.touchcommerce.com
	var divsub = window.document.createElement("DIV");
	var frameSrc = clientHtml + "?PRXY" ;
    var frame_id = "iframe_proxy_" + id;
    divsub.innerHTML = "<IFRAME ID=\"" + frame_id + "\" "
			 + "STYLE=\"overflow: hidden; display: block; border: none; top:0px;left:0px;width: 1px; height: 1px;\" "
			 + "NAME=\"" + id + "||" + "LoadMgr.handleIESuccess('" + convertArrToString(cmd) + "');\" "
			 + "SRC=\"" + frameSrc + "\">\n</IFRAME>";
	document.body.appendChild(divsub);

        var iframe = document.getElementById(frame_id);
        var iframCallback = function () {
            setTimeout('removeIframeProxyNode("iframe_proxy_' + id + '")', 5000);
        };

        if (iframe.addEventListener) {
            iframe.addEventListener("load", iframCallback, false);
        } else if (iframe.attachEvent) {
            iframe.attachEvent('onload', iframCallback);
        }
        else {
            iframe.onload = iframCallback;
        }

  } else {
      if (hasStringSupport) {
          // ie8-9
          parent.postMessage(convertArrToString(cmd), "*");
      } else {
          // normal browsers
          parent.postMessage(cmd, "*");
      }
  }
}

function convertArrToString(arr) {
    for (var i = 0; i < arr.length; i++) {
        arr[i] = encodeURIComponent(arr[i]);
    }
    return arr.join("||");
}

/**
 * removes already unnecessary iframe-proxy by id (actual only for IE7!)
 * @private
 * @param {string} id
 */
function removeIframeProxyNode(id) {
    try {
        var node = document.getElementById(id);
        if (!!node) {
            var p = node.parentNode;
            p.removeChild(node);

            node = p;
            if (!!node) {
                p = node.parentNode;
                p.removeChild(node);
            }
        }

    } catch (e) {
        if (window.console) window.console.error(e.message);
    }
}

/**
 * Sets document.domain to predefined value to allow cooperation of different HTML documents.
 * "One document is allowed to access another if they have both set document.domain to the same value, indicating their intent to cooperate".
 * @see https://developer.mozilla.org/en/DOM/document.domain
 */
function setupSameOriginDomain() {
    if (!isSelfDetectionMode()) {
        document.domain = "inq.com";
    }
}

/**
 * Do command for input data
 * @param {Object} data
 * @private
 */
function _executeCommandFromItems(data) {
    if (data && data.length > 0) {
        try {
            if (checkDataForSimplePost(data)) {
				/* If we start with HTTPS: or HTTP:
				 * then we are being requested by the simple chat post in the Chat Interface (HAXE)
				 */
				simpleChatPost(data[0]);
			} else {
                try {
                    doCommands(data);
                } catch (e) {
                    var clientHtml = data[3];
                    var id = data[1];
					var code = "if (inqFrame.Inq[\"proxyError\"]!=null)inqFrame.Inq.proxyError(\"" + catchJsFormatter(e, data[0]) + "\");";
                    doCommandsInClientDomain(code, clientHtml, id);
                }
            }
        } catch (e) {
            if (window.console) window.console.error(e.message);
        }
	}
}

/**
 * First, look for the special simple chat router request.
 * It starts with a protocol and NOT a command.
 * The protocol will be HTTP: or HTTPS: in any case
 *
 * @param data
 * @return {Boolean}
 */
function checkDataForSimplePost(data) {
	var regexProtocol = /(^HTTP[s]?:).*/ig ; /* This regex has been tested on http://www.pagecolumn.com/tool/regtest.htm */
	return regexProtocol.test(data);
}

function whenLoaded() {
	setupSameOriginDomain();
    if (bPostMessage){
	console.log("whenLoaded bpostMessage is true"); 
		try {
			if (window["addEventListener"]) {
				console.log("addEventListener"); 
				window.addEventListener ("message", whenPosted, false);

			} else if (window["attachEvent"]) {
				console.log("attachEvent"); 
				window.attachEvent("onmessage", whenPosted);
			} else {
				console.log("else"); 
				window.onmessage = whenPosted ;
			}
		} catch (e) {
			if (window.console) window.console.log(e.message);
		}
		parseCommand();
		/*
        if(window.name) {
            parseCommand();
        } else {
            window.setTimeout(function(){
                parseCommand();
            }, 500);
        }*/
    } else {
	console.log("whenLoaded bpostMessage is false"); 
		// Workaround for IE7, the data is sent by name attribute of iframe
		// Adding of listener for iframe name change
		window.pIntervalCnt = 0;
        window.pIntervalId = setInterval(function () {
            parseCommand();
        }, 50);
	}
}

/**
 * Handles messages sent by window.postMessage API.
 * @see https://developer.mozilla.org/en/DOM/window.postMessage
 * @param {MessageEvent} e event
 */
function whenPosted(e){
	bPostMessage = true;
	var ev = (e)?e:event;
	var data = ev.data;
	console.log("--- whenPosted: " + data);
    if (data && data.length > 0) {
        if (typeof data === 'string') {
            hasStringSupport = true;
            // ie8-9 case, the data is sent as string where arguments are separated by "||"
            _executeCommandFromItems(data.split("||"));
        } else {
            hasStringSupport = false;
            // other normal browsers
            _executeCommandFromItems(data);
        }
    }
	return false;
}

/**
 * For non-HTML5 browsers we have to communicate via iframe name, so we listen to it each time and doing job once it's changed
 */
function parseCommand() {
    var data = window.name;
	console.log("data='" + data + "'");
	// Stop Interval after 10 times try or if data is available.
	if( (window.pIntervalId > 0 && typeof window.pIntervalCnt !="undefined" && window.pIntervalCnt++ > 10 )
		|| (window.pIntervalId > 0 && data && data.length > 0) ) {
		clearInterval(window.pIntervalId);
	}
    if (data && data.length > 0 && data != "_none") {
        data = data.replace(previousCommand, "");
        if (data.length > 0) {
            previousCommand = data;
            var cmnds = data.split("&&");
            for (var i = 0; i < cmnds.length; i++) {
                if (cmnds[i] && cmnds[i].length > 0) {
                    _executeCommandFromItems(cmnds[i].split("||"));
                }
            }
        }
    }
}

/**
 * Sets the flag of inqCA value in several instances:
 * 1) instance of UnloadController - saves the flag for current page, because cookie may be changed on the other page;
 * 2) cookie - saves the flag for read in other pages;
 * 3) sessionStorage - saves the flag for special use-case in some of old versions of Firefox (see: setSessionChatActiveFlagPS)
 *
 * The flag can contain the following values:
 *     0 - chat is not active;
 *     1 - DIV chat is active;
 *     2 - PERSISTENT chat is active.
 *
 * @param {string} name - it is name of cookie according to template: inqCA_{siteID}
 * @param {number} value - it is a value of flag
 */
function setChatActiveFlag(name, value) {
	caUnloadController.set(value);
	ptStorage.setItem(name, value);
	setSessionChatActiveFlagPS(value);
}

/**
 *  Get chat active flag.
 *
 *  @param {string} name - it is name of cookie according to template: inqCA_{siteID}
 *  @return {number}
 */
function getChatActiveFlag(name) {
	try {
		var cookieValue = parseInt(ptStorage.getItem(name));
		if (isNaN(cookieValue)) {
			return 0;
		} else {
			return cookieValue;
		}
	} catch (e) {
		return 0;
	}
}

/**
 *  New numeric flag in sessesionStorage to indicate the current session has the active chat.
 *  This flag, currently supported only on XD mode on Firefox, is saved in HTML5 sessionStorage object.
 *  While inqCA_ is flag for all open windows and tabs of same browser,
 *  this flag is only for one tab in a window.
 *
 *  The flag can contain the following values:
 *     0 - chat is not active;
 *     1 - DIV chat is active;
 *     2 - PERSISTENT chat is active.
 *
 *  @param {number} chatActive - it is a value of flag
 */
function setSessionChatActiveFlagPS(chatActive){
	var SESSION_INQCA_STR = "sinqCA";

	if (typeof chatActive === "undefined" || isNaN(chatActive)) {
		 log("In setSessionChatActiveFlagPS(); requires one argument as a number");
		 return;
	}

	try {
		if (PersistentStorage.isLocalStorageUsed()) {
			sessionStorage.setItem(SESSION_INQCA_STR, chatActive);
		}
	} catch (e) {
		log("Error while set " + SESSION_INQCA_STR, e);
	}
}

/**
 * This match will prevent same origin violation exception.
 * @param url
 * @return {*}
 */
function checkSameProtocolOrigin( url ){

	if( url.indexOf( window.location.protocol ) === -1 ) {
		return url.replace( /^http:/i, window.location.protocol );
	} else {
		return url;
	}
}

function pepareResponseData(id, response) {
	var responseData = new Array();
	//When the IE browser is in compatibility mode v7,v8 and loses connection, the status will be unknown.
	if (typeof response.status != "unknown") {
		responseData[0] = id;
		responseData[1] = response.responseText;
		responseData[2] = response.status;
		responseData[3] = response.getResponseHeader("Cache-Control") || "";
		responseData[4] = response.getResponseHeader("Content-Type") || "";
	} else {
		responseData = [id, "", "", "", ""];
	}
    return responseData;
}

function doCommands(items) {
  var code = "";
  var cmd = items[0];
  switch(cmd) { //TODO extract "case" handlers as separate functions
      case "ABORT":
          var id = items[1];
          if (xHRsInProgress && xHRsInProgress[id]) {
              xHRsInProgress[id].abort();
          }
          break;
	case "POSTCHAT":
		var id = items[1];
		var clientHtml = items[3];
		var xfrdest = items[4];
		var data = items[5];
		var timeout = parseInt(items[6]) || 0;
		try {
			var xHR = getXMLHttpRequest();
			xHRsInProgress[id] = xHR;

			xHR.open(data ? "POST" : "GET", xfrdest, true);

			if (xHR.timeout != undefined) {
				xHR.timeout = timeout;
			} else {
				xhrTimeoutConroller[id] = setTimeoutXHR(timeout, id, xHRsInProgress);
			}

			xHR.onreadystatechange = function() {
				if (xHR.readyState != 4) return;

				if (xhrTimeoutConroller[id]) {
					clearTimeout(xhrTimeoutConroller[id]);
					delete xhrTimeoutConroller[id];
				}

				delete xHRsInProgress[id];
				//When the IE browser is in compatibility mode v7,v8 and loses connection, the status will be unknown.
				if (typeof xHR.status != "unknown" && xHR.status == 0 && beaconUnloadController && beaconUnloadController.complete) {
					return;
				}
				doCommandsInClientDomain(pepareResponseData(id, xHR), clientHtml, id);
			};

			if (data) {
				xHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				// The "Connection" and "Content-Length" should be deleted by security reasons
				// See http://stackoverflow.com/questions/2623963/webkit-refused-to-set-unsafe-header-content-length or http://stackoverflow.com/questions/7210507/ajax-post-error-refused-to-set-unsafe-header-connection
				xHR.send(decodeURIComponent(data));
			} else {
				xHR.send();
			}
		} catch (e) {
			code = "if (inqFrame.Inq[\"proxyError\"]!=null)inqFrame.Inq.proxyError(\"" + catchJsFormatter(e, cmd) + "\");" + code;
			doCommandsInClientDomain(code, clientHtml, id);
		}
	break;

	case "SCBR3_PM": // set cookie, BR3.0, using HTML5 window.postMessage API
		bPostMessage = (window["postMessage"]!=null);
		var id = items[1];
		var siteID = items[2];
		var clientHtml = items[3];
		try {
			var cookieName = items[4];
			var cookieValue = items[5];
			var path = items[6];        // TODO: not used
			var expiry = items[7];

			setupSameOriginDomain();

			ptStorage.setItem(cookieName + "_" + siteID, cookieValue, expiry) ;

			code = "inqFrame.Inq.FlashPeer.set3rdPartyCookieFromQueue();\n" ;
			// initial origin: http://home.inq.com
			// active origin:  http://inq.com (set via document.domain)
			// needed origin:  http://www.touchcommerce.com
			doCommandsInClientDomain(code,clientHtml,id);
		} catch(e) {
			code = "if (inqFrame.Inq[\"proxyError\"]!=null)inqFrame.Inq.proxyError(\"" + catchJsFormatter(e, cmd) + "\");"
				 + "inqFrame.Inq.FlashPeer.set3rdPartyCookieFromQueue();\n";
			doCommandsInClientDomain(code,clientHtml,id);
		}
		break;
	case "GCBR3": // get cookie, BR3.0
		console.log("--- GCBR3 in " + location.href);
		bPostMessage = (window["postMessage"]!=null);
		var id = items[1];
		var param = items[2];
		var clientHtml = items[3];
        //in case if there multiple hostedFiles and 3rd party cookies are banned ptStorage can't be initialized for some URLs, need to filter them
        if(!ptStorage) {
			console.log("-- !ptStorage is null ***********************************");
			doCommandsInClientDomain('inqFrame.Inq.IFrameProxyCallback("no-cookie");',clientHtml,id);
			break;
        }
		try {
			if (param) {
				var cookieValue = ptStorage.getItem(param) || 0;
				code = "{\"" + param + "\": " + cookieValue + "}";
			} else {
				var cookieValues = ptStorage.getAllCookies();
				if(cookieValues === "") cookieValues = "inqPc=1";
				cookieValues = cookieValues.replace(/["]/g, '');
				code = ('inqFrame.Inq.IFrameProxyCallback("' + encodeURIComponent(cookieValues) + '");');
			}
			console.log("GCBR3 code=" + code);
			doCommandsInClientDomain(code,clientHtml,id);
		} catch (e) {
			code = "if (inqFrame.Inq[\"proxyError\"]!=null)inqFrame.Inq.proxyError(\"" + catchJsFormatter(e, cmd) + "\");"+code;
			console.error("ERROR in GCBR3 code=" + code, e); 
			doCommandsInClientDomain(code,clientHtml,id);
		}
		break ;
	case "COMMITPOINT":             // Call listener to execute callback.
		var id = items[1];
		var siteID = items[2];
		var clientHtml = items[3];
		try {
			cookieValues = unescape(ptStorage.getItem("inqVital_" + siteID));

			var vcntarr = /\bvcnt:([0-9]+)/.exec(cookieValues);
			var vcnt = ( vcntarr.length == 2 ) ? vcntarr[1] : 0;

			code =  ('inqFrame.Inq.FlashPeer.when3rdPartyCookieCommitted(' + vcnt + ');');

			doCommandsInClientDomain(code,clientHtml,id);
		} catch (e) {
			code = "if (inqFrame.Inq[\"proxyError\"]!=null)inqFrame.Inq.proxyError(\"" + catchJsFormatter(e, cmd) + "\");"+code;
			doCommandsInClientDomain(code,clientHtml,id);
		}
		break ;
	case "DUMP":
		var id = items[1];
		var clientHtml = items[3];
		try {
			var url = decodeURIComponent(items[4]);
			var data = "_rand="+(Math.round(Math.random()*1000000000001)).toString(36)+"&level=info&line=document.cookie: "+encodeURIComponent(""+document.cookie);
			var xHR = getXMLHttpRequest();
                xHRsInProgress[id] = xHR;
				xHR.open("POST", url, true) ;
				xHR.onreadystatechange = function() {
					if (xHR.readyState != 4) return;
                    delete xHRsInProgress[id];
					doCommandsInClientDomain("",clientHtml,id);
				};
				xHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                // The "Connection" and "Content-Length" should be deleted by security reasons
                // See http://stackoverflow.com/questions/2623963/webkit-refused-to-set-unsafe-header-content-length or http://stackoverflow.com/questions/7210507/ajax-post-error-refused-to-set-unsafe-header-connection
				xHR.send(data);
		} catch(e) {
			code = "if (inqFrame.Inq[\"proxyError\"]!=null)inqFrame.Inq.proxyError(\"" + catchJsFormatter(e, cmd) + "\");"+code;
			doCommandsInClientDomain(code,clientHtml,id);
		}
		break;
	case "POSTBR30":
		var id = items[1];
		var clientHtml = items[3];
		try {
			var xfrdata = decodeURIComponent(items[4]);
			var qIx = xfrdata.indexOf("?");
			var url = xfrdata.substring(0, qIx);

			url = checkSameProtocolOrigin( url );

			var data = xfrdata.substring(qIx+1);
			var xHR = getXMLHttpRequest();
                xHRsInProgress[id] = xHR;
				xHR.open("POST", url, true) ;
				xHR.onreadystatechange = function() {
                    if (xHR.readyState != 4) return;
                    delete xHRsInProgress[id];
                    doCommandsInClientDomain(pepareResponseData(id, xHR),clientHtml,id);
				};
				xHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                // The "Connection" and "Content-Length" should be deleted by security reasons
                // See http://stackoverflow.com/questions/2623963/webkit-refused-to-set-unsafe-header-content-length or http://stackoverflow.com/questions/7210507/ajax-post-error-refused-to-set-unsafe-header-connection
				xHR.send(data);
		} catch(e) {
			code = "if (inqFrame.Inq[\"proxyError\"]!=null)inqFrame.Inq.proxyError(\"" + catchJsFormatter(e, cmd) + "\");"+code;
			console.error(code, e);
			doCommandsInClientDomain(code,clientHtml,id);
		}
		break;
	case "COBROWSE":
		bPostMessage = (window["postMessage"]!=null);
		var id = items[1];
		var siteID = items[2];
		var clientHtml = items[3];
		var fullUrl = items[4];
		var data;
		if (items.length > 6) {
            items.splice(0, 5);
			data = items.join("||")
		} else {
		    data = items[5];
		}

		try {
			var xHR = getXMLHttpRequest();
                xHRsInProgress[id] = xHR;
                xHR.open("POST", fullUrl, true) ;
				xHR.onreadystatechange = function() {
					if (xHR.readyState != 4) return;
                    delete xHRsInProgress[id];
					var data = "(window.Inq.CBC).ackReceived('" + encodeURIComponent(toJsString(xHR.responseText)) + "',\""+id+"\");\n" ;
					doCommandsInClientDomain(data,clientHtml,id);
				};
                // "text/plain" (https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data) - it's not binary type.
                // "multipart/form-data" (http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4.2) - it's used for sending of several data parts
                // "application/octet-stream" (http://mimeapplication.net/octet-stream) - it's binary not specified data type (more appropriate, e.g. for embedded image source sending)
                xHR.setRequestHeader("Content-type", "application/octet-stream");
                // The "Connection" and "Content-Length" should be deleted by security reasons
                // See http://stackoverflow.com/questions/2623963/webkit-refused-to-set-unsafe-header-content-length or http://stackoverflow.com/questions/7210507/ajax-post-error-refused-to-set-unsafe-header-connection
				xHR.send(data);
		  } catch(e) {
			code = '(window.Inq.CBC).callBackProxyError("' + cmd + '","' + id + '","' + catchJsFormatter(e, cmd) + '");' ;
			doCommandsInClientDomain(code,clientHtml,id);
		}
		break;
	case "CBAUTH":
		bPostMessage = (window["postMessage"]!=null);
		var id = items[1];
		var siteID = items[2];
		var clientHtml = items[3];
		try {
			var cookieName = items[4];
			var cookieValue = items[5];
			var path = items[6];        // TODO: not used
			var expiry = items[7];

			setupSameOriginDomain();

            ptStorage.setItem(cookieName + "_" + siteID, cookieValue, expiry) ;
            cookieValue = ptStorage.getItem(cookieName + "_" + siteID);

            code = "(window.Inq.CBC).callBackAuthorized(" + toJsString(cookieValue, '"') + ",\"" + id + "\");\n" ;
			doCommandsInClientDomain(code,clientHtml,id);
		} catch(e) {
			code = '(window.Inq.CBC).callBackProxyError("' + cmd + '","' + id + '","' + catchJsFormatter(e, cmd) + '");' ;
			doCommandsInClientDomain(code,clientHtml,id);
		}
		break;
	case "CBCHECK":
		bPostMessage = (window["postMessage"]!=null);
		var id = items[1];
		var siteID = items[2];
		var clientHtml = items[3];
		try {
            var	cookieCrumb = ptStorage.getItem("cobrowse_"+siteID);

            code = "(window.Inq.CBC).callBackAuthorized(" + toJsString(cookieCrumb, '"') + ",\"" + id + "\");\n" ;
			doCommandsInClientDomain(code,clientHtml,id);
		} catch (e) {
			code = '(window.Inq.CBC).callBackProxyError("' + cmd + '","' + id + '","' + catchJsFormatter(e, cmd) + '");' ;
			doCommandsInClientDomain(code,clientHtml,id);
		}
		break ;
	case "CHATACTIVE":
		/* Add watch for close of window */

		try {
			var action = items[1];
			var siteID = items[2];
			var isPersistWin = parseStringToBoolean(items[3]);
			var v3TO = parseInt(items[4]) * 1000;

			var cookieName = "inqCA_" + siteID;
			var cookieValue = 0;

			if (!caUnloadController) {
				caUnloadController = new UnloadController(function(e) {
					/* Get value of inqCA from local instance and from cookie.
					 * If these values are different e.g. 2 and 1 then it's mean
					 * that chat had been moved to the persistent mode
					 * and this handler is not actual and should be deactivated
					 * without change of cookie.
					 */
					var inqCA = caUnloadController.get();
					var curCA = getChatActiveFlag(cookieName);
					if (inqCA != 0 && curCA == inqCA) {
						/* Regardless of inqCA value, there can be only one ACTIVE CHAT and
						 * when the active chat is closed the flag should become 0.
						 */
						setChatActiveFlag(cookieName, 0);

						/* For XD mode we can't save "lt" value quickly, so we should use this*/
						ptStorage.setItem("inqLT_" + siteID, "" + (new Date()).getTime(), v3TO);
						ptStorage.onUnload();
					}
				});
			}

			if (action === "CHATDEACTIVATE"){
				caUnloadController.deactivate();
			} else {
				cookieValue = isPersistWin ? 2 : 1;
				caUnloadController.activate();
			}
			setChatActiveFlag(cookieName, cookieValue);
		} catch (e) {
			// For this command, exceptions are not bubbled up.
		}
		break;

	case "BEACON":
		var action = items[1];
		if (!beaconUnloadController) {
			beaconUnloadController = new UnloadController(function(e) {
				parseCommand(); // latest update data before unload iframe
				if (!beaconUnloadController.complete) {
					var url = beaconUnloadController.url;
					url += "?" + KEY_ENGAGEMENT_ID_STRING + "=" + beaconUnloadController[KEY_ENGAGEMENT_ID_STRING]; // This parameter only for identification request in access log
					url += "&timestamp=" + (new Date()).getTime();

					sendBeacon(url, beaconUnloadController.get());

					beaconUnloadController.complete = true;
				}
			});
		}
		if (action == "ACTIVATE") {
			beaconUnloadController.activate();
			beaconUnloadController.set(items[2]);
			beaconUnloadController.url = items[3];
			beaconUnloadController[KEY_ENGAGEMENT_ID_STRING] = items[4];
			beaconUnloadController.complete = false;
		} else if (action == "DEACTIVATE") {
			beaconUnloadController.deactivate();
		} else if (action == "DATA") {
			// Update data for beacon
			beaconUnloadController.set(items[2]);
		}
		break;

	default:
		var id = items[1];
		var clientHtml = items[3];
		var err = new Error("Undefined Request for [" + cmd + "] command");
		try {
			err.name = "Syntax Error";

			throw(err);
		} catch(e) {
			code = "if (inqFrame.Inq[\"proxyError\"]!=null)inqFrame.Inq.proxyError(\"" + catchJsFormatter(e, cmd) + "\");";
			doCommandsInClientDomain(code,clientHtml,id);
		}
		break ;
	}
}

function isSelfDetectionMode() {
    return (window.location.href.toLowerCase().indexOf("posttoserver.htm") == -1); // TODO: improve the logic of the test
}

whenLoaded();
