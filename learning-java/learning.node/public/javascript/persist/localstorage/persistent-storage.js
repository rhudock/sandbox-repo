/*
 *  Return a browser storage wrapper object based on environment and client system condition.
 *  
 *  
 *  Persistent Storage using Cookie, LocalStorage, or etc.
 */
var PersistentStorage = (function() {

	var uniqueInstance;
	
	var STORAGE_EXPIRE_PREFIX = 'LSCACHE-';         /* Prefix of localStorage item name to store its pare item's expiration date.  */ 
	var EXPIRY_BASE = 10;							/* Expiration date base   */
	var COOKIE = 'cookie', LOCALSTORAGE = 'localStorage';
	var storageCondition = null;

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
		isLocalStorageUsed: isLocalStorageUsed
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
    	if (typeof this.cookieEnabled == 'undefined')
    	{ 
    	    var expiry = (new Date( (new Date()).getTime() + (366*24*3600*1000) )).toGMTString();
            document.cookie = "pc=1; path=/; expires="+expiry+";" ;
    		this.cookieEnabled = (document.cookie.indexOf("pc") != -1) ? true : false;
    	}
    	return (this.cookieEnabled);
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

		if (/safari|firefox/i.test(uaString) && !/chrome/i.test(uaString)) {
			try {
				if (window["localStorage"]) {
					localStorage.setItem("pc", 2);
					isSupported = true;
				}
			} catch(e) {
				log("WARNING window.localStorage is not supported and chat may not be offered.", e);
			}				
		}
		return isSupported;
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
	 *  version(): 			to track changes. 
	 * 
	 */
	function getLocalStorageInstance() {
		var SESSION_INDICATOR = "session";		
		
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

			setItem : function setItem(key, value, lifetime, path ) {
				if (lifetime) {
					var today = new Date();
					var lifetimeInMs = parseInt(lifetime, EXPIRY_BASE);
					
					if (!isNaN(lifetimeInMs)) {
						if (lifetime > 0) {
							localStorage.setItem(STORAGE_EXPIRE_PREFIX+key, today.getTime() + lifetime);
							localStorage.setItem(key, value);
						} else {
							this.removeItem(key);
						}
					} else {
						var d = Date.parse(lifetime);
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
			 * @param days  - optional number as days from now or string represent a date
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
							expires = ";expires="+date.toGMTString();
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
