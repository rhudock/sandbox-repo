/**
 * $Id$
 * 
 * Try to test for in in IE.
 */

$(function() {

/*
 *  Return a browser storage wrapper object based on environment and client system condition.
 *  
 *  
 *  Persistent Storage using Cookie, LocalStorage, or etc.
 */
var PersistentStorage = (function() {

	var uniqueInstance;
	
	var STORAGE_EXPIRE_PREFIX = 'LSCACHE-';         /* Prefix of localStorage item name to store its pare item's expiration date.  */ 
	var DAY_IN_MILLISEC = 24*3600*1000;				/* milliseconds of a day  */
	var EXPIRY_BASE = 10;							/* Expiration date base   */

	/**
	 * A singleton constructor has condition checker to select correct storage instance. 
	 * Also uses lazy initialization and the object is created when it is first time used.  
	 */
	function constructor() {
		
		/*
		 * Create (constants and ) variables; cookie is default storage condition.
		 */
		var COOKIE = 'cookie', LOCALSTORAGE = 'localStorage';
		var instance, storageCondition = null;
		
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
		}
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
			istablet = (/ipad|android 3|sch-i800|playbook|tablet|kindle|gt-p1000|gt-p5113|sgh-t849|shw-m180s|a510|a511|a100|dell streak|silk/i.test(navigator.userAgent.toLowerCase()));
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
	 * Internal log function.
	 */
	function log(message, exception) {
		if (message) {
			if(console && console.log) {
				if (exception) {
					console.log(message, e);
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
	 *  setItem(key, value, days, path): set a single item with name, value, expiration in days or GTM, and path
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
	 *  setItem(key, value, days, path):  
	 *  					key   - item key
	 *  					value - item value
	 *  					days  - optional, a number or a date string.
	 *  							A session cookie or sessionStorage item is created when it is empty string or undefined 
	 *  					path  - Cookie path, not used in localStorage instance.
	 *  removeItem(): 		equivalent to localStorage.removeItem(). 
	 *  clear(): 			equivalent to localStorage.clear(). 
	 *  onUnload():			handling session type variables and any clean up job.
	 *  version(): 			to track changes. 
	 * 
	 */
	function getLocalStorageInstance() {
		var SESSION_INDICATOR = "session";		
		
		return {
			getAllCookies: function() {
				var cookieValues = "";
				for (f in localStorage) {
					if (f.indexOf(STORAGE_EXPIRE_PREFIX) !== 0) {
						cookieValues += "" + f + "=" + localStorage.getItem(f) + ";" ;
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
				var today = new Date(), expired;
				expired = localStorage.getItem(STORAGE_EXPIRE_PREFIX+key);
				if (expired !== null && expired !== SESSION_INDICATOR) {
					expired = parseInt(expired, EXPIRY_BASE);
					if (expired && today.getTime() < expired) {
						return localStorage.getItem(key);
					} else {
						removeItem(key);
						removeItem(STORAGE_EXPIRE_PREFIX+key);
					}
				} else {
					return localStorage.getItem(key);
				}
				return null;
			},

			setItem : function setItem(key, value, days, path ) {
				
				if (typeof days === 'undefined') {
					days = "";
				}
				
				if (days !== "") {
					var today = new Date();
					var isDaysNumber = parseInt(days, EXPIRY_BASE);
					
					if (!isNaN(isDaysNumber)) {
						if (days > 0) {
							localStorage.setItem(STORAGE_EXPIRE_PREFIX+key, today.getTime() + (days * DAY_IN_MILLISEC));
							localStorage.setItem(key, value);
						} else {
							this.removeItem(key);
						}
					} else {
						var d = Date.parse(days);
						if ( !isNaN(d) ) {
							if ( d < today.getTime() ) {
								this.removeItem(key);
							} else {
								localStorage.setItem(STORAGE_EXPIRE_PREFIX+key, d);
								localStorage.setItem(key, value);
							}
						} else {
							log("ERROR: PersistentStorage.cookieInstance: days has to be a number or a date string");
							return;
						}
					}
				} else {
					localStorage.setItem(STORAGE_EXPIRE_PREFIX+key, SESSION_INDICATOR);
					localStorage.setItem(key, value);
				}
			},

			removeItem:	function (key) {
				var expired = localStorage.getItem(STORAGE_EXPIRE_PREFIX+key);
				if (expired !== null) {
					localStorage.removeItem(STORAGE_EXPIRE_PREFIX + key);
					localStorage.removeItem(key);
				} else {
					localStorage.removeItem(key);
				}
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
			
			log("***************** Start cleanup session type items");
			
			/* cleanup only known session variables */
			
			for (f in localStorage) {
				if (f.indexOf(STORAGE_EXPIRE_PREFIX) === 0  && localStorage.getItem(f) === SESSION_INDICATOR) {
					localStorage.setItem(f, SESSION_TIMEOUT)
					log("***************** " + f + " has been cleaned up");
				}
			}
			
			

			log("***************** End cleanup session type items");

			
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
			 * @param days  - optional number as days from now or string represent a date
			 * @param path  - optional string or path, used in cookie only.
			 */
			setItem: function (key, value, days, path) {
				
				var daysAsNumber, expires = "";
				
				/* Test days argument 
				 * First, check session cookie condition. 
				 */
				if (typeof days === 'undefined' || days === "" ) {
					expires = "";
				} else {
					daysAsNumber = parseInt(days, EXPIRY_BASE);

					/* If days is a number, then convert it to string */
					if (!isNaN(daysAsNumber)) {
						if (daysAsNumber > 0) {
							var date = new Date();
							date.setTime(date.getTime()+(daysAsNumber*DAY_IN_MILLISEC));
							expires = ";expires="+date.toGMTString();
						} else {
							expires = ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
						}
					} else {
						/* If days is a date string  */
						var d = Date.parse(days);
						if ( !isNaN(d) ) {
							expires = ";expires=" + days;
						} else {
							log("ERROR: PersistentStorage.cookieInstance: days has to be a number or a date string");
							return;
						}
					}
				}
				
				document.cookie = key+"="+value+expires+"; path=/";
			},

			removeItem:	function (key) {
				this.setItem(key,"",-1);
			},
			
			clear: function() {
				document.cookie 
			} ,
			
			onUnload: function() {
				// interface - do nothing for cookie. 
			},
			
			version: 'cookie.0.0.3'
		};
	}
})();
	
	var LocalStorage = PersistentStorage.getInstance();
	
	/**
	 * Module of Array Qunit tests
	 */
	module("HTML5 localstorage test");

	test("Test if local storage is supported", function() {

		ok( typeof(localStorage) != 'undefined'  );

	});

	test("Test local storage", function() {

		var testItem = "Hello World";
		LocalStorage.clear;
		LocalStorage.setItem('testItem', testItem, 2);

		equal(testItem, LocalStorage.getItem('testItem'));

	});

	test("Test local storage without expires", function() {
		
		var testItem = "Hello World";
		LocalStorage.clear;
		LocalStorage.setItem('testItem', testItem);
		
		equal(testItem, LocalStorage.getItem('testItem'));
		
	});
	
	test("Test local storage expires now", function() {
		
		var testItem = "Hello World";
		LocalStorage.clear;
		LocalStorage.setItem('testItem', testItem, 0);
		
		equal(null, LocalStorage.getItem('testItem'));
		
	});
	
	test("Test query local storage which doesn't exist", function() {

		var testItem = "Hello World";
		LocalStorage.clear;
		LocalStorage.removeItem('testItem');
		equal(null, LocalStorage.getItem('testItem'));
	});

});
