

/**
 * CookieMgr is responsible for saving and reading name-value pairs to/from a named cookie.
 *
 * @constructor
 * @param {string} id is the identifier for this object
 * @param {boolean} xd specifies whether this site uses cross-domain cookies
 * @author joconner
 * @borrows RemoteCaller#onRemoteCallback as #onRemoteCallback
 * @borrows RemoteCaller#callRemote as #callRemote
 * @borrows FrameworkModule#init as #init
 * @borrows FrameworkModule#start as #start
 * @borrows FrameworkModule#reset as #reset
 * @see RemoteCaller
 * @see FrameworkModule
 * @see #getInstance(xd)
 */
function CookieMgr(id, xd) {
	this._frameworkModule(id);
	this.xd = xd;
	this.cookies = {}; // used in cross-domain mode
	this.dsender = new DeltaSender(urls.cookieSetURL);
	this.JSON = MixIns.JSON;
	this.version = 3;
	this.initMessagingComplete = false; /*used to ensure initialization happens only once */
	this.iframeProxyArray = null;	/*array of available for use iframe-proxies */
	this.set3rdPartyCookieBusy = false;
	this.set3rdPartyCookieQueue = [];
	this.overflowLogged = false; // flag used to avoid TS log flood (log overflow once per landing)
	this.cleanupFailLogged = false; // flag used to avoid TS log flood (log cleanup failure once per landing)
	this.trdPartyCookieCnt = 0;     // 3rd party cookie counter (for vital).
}
MixIns.prepare(CookieMgr).mixIn(MixIns.FrameworkModule).mixIn(MixIns.RemoteCaller);
CookieMgr.CM = null;

/**
 * Retrieve the singleton instance of CookieMgr. The first call to this method
 * will determine whether cross-domain is supported. Subsequent calls will
 * ignore the xd param.
 * @param xd a boolean flag for cross-domain mode; true if cross-domain, false otherwise;
 * @return the CookieMgr instance
 */
CookieMgr.getInstance = function(xd) {
	if(CookieMgr.CM == null) {
		CookieMgr.CM = new CookieMgr("CM", xd);
	}
	return CookieMgr.CM;
};

CookieMgr.prototype.init = function(){
	if (this.initialized) return;
	this.initialized = true;
	log(this.getID()+" initialized.");
	this.initMessagingComplete = this.initMessaging();
};

CookieMgr.prototype.start = function() {
	if (this.started) return;
	this.started=true;
};

/**
 * Obtains a reference to the CookieMgr "peer" in the main window if in persistent window.
 * @returns null if not persistent win OR the broser's same origin policy prohibits communication.
 * Otherwise it returns a ref to the CM in the main window.
 */
CookieMgr.prototype.getPeer = function(){
	return (isSameOrigin() && isPersistentWindow())?window.parent.opener.inqFrame.Inq.CM : null;
};

/**
 * Method that updates the name-value pair in a given cookie cache. This will only be set in memory
 * and, when in persistent window, also updates the cookie cache of the main window (same origin permitting).
 * If value is undefined, name-value pair is deleted from cache.
 * @param {String} cName The cookie name for the n-v pair
 * @param {String} name Name of the value to be set in the cookie cache.
 * @param {Object} value the value to be set for the given name in the cookie cache.
 * 	If undefined, name-value pair is deleted from cookie.
 * @param {boolean} isJSON optional flag that tells the method how to treat the value.
 * If undefined, null or false, the value will be treated as a std pass-thru object. If true
 * then the value will be treated as a JSON string to be parsed before processing.
 */
CookieMgr.prototype.addValueToCookieCache = function(cName, name, value, isJSON, update){
	if (value != undefined) {
		value = !!isJSON?MixIns.JSON.parse(decodeURIComponent(value)):value;
	}
	if(!update) {
		if(isPersistentWindow()) {
			try{
				var cmPeer = this.getPeer();
				if(!!cmPeer) {
					if(!cmPeer.persistentWindow) {
						cmPeer.persistentWindow = win;
					}
					if (value != undefined) {
						cmPeer.addValueToCookieCache(cName, name, encodeURIComponent(MixIns.JSON.stringify(value)), true,true);
					} else {
						cmPeer.addValueToCookieCache(cName, name,null,null,true);
					}
				}
			}catch(err) {
				log("Error propagating value to main window from Cookie manager.");
			}
		}
		else {
			try {
				var persistentWindow = this.persistentWindow;

				if (!!persistentWindow) {
					var cmPersistent = persistentWindow.inqFrame.Inq.CM;
					if (!!cmPersistent) {
						if (value != undefined) {
							cmPersistent.addValueToCookieCache(cName, name, encodeURIComponent(MixIns.JSON.stringify(value)), true, true);
						} else {
							cmPersistent.addValueToCookieCache(cName, name, null, null, true);
						}
					}
				}
			} catch (err) {
				log("Error propagating value to persistent");
			}
		}

	}
	if (value == undefined) {
		if (this.cookies[cName]) {
			delete this.cookies[cName][name];
		}
	} else {
		if (!this.cookies[cName]) {
			this.cookies[cName] = {};
		}
		this.cookies[cName][name] = value;
	}
};

/**
 * Write a name-value pair to a cookie.
 * If value is undefined, name-value pair is deleted from cookie.
 * @param {CookieResource} cRes
 * @param {String} name of a key or variable
 * @param {Object} value of the key or variable. If undefined, name-value pair is deleted from cookie.
 */
CookieMgr.prototype.write = function(cRes, name, value) {
	var cObj = null;
	var cVal = null;
	var cName = cRes.getName();

	// "pc" resource is used to test if persistent cookie are allowed, it is excluded here to avoid recursion.
	// undefined value means cookie size won't be increased, thus no need to do overflow prediction
	if (cName != "pc" && value != undefined) {
		var predictedResult = this.predictOverflow(cRes, name, value);
		if (predictedResult != 0) {
			var pruneSuccessful = this.pruneCookieOnOverflow(predictedResult);
			if (!pruneSuccessful) {

				var msg = "Cookie overflow! Aborted write of cookie " + cName + ". ";
				log("ERROR: " + msg);
				if (!this.cleanupFailLogged) { // log cleanup failure to TS once per landing
					msg = prepareLoggingContext(msg);
					this.send(urls.loggingURL, {level:'ERROR', line: msg});
					this.cleanupFailLogged = true;
				}

				return;
			}
		}
	}

	/* Only update the xd (cross domain) cookie if it has changed,
	 * The cookies are saved one request after another,
	 * Writing unchanged values just causes over queueing of the requests
	 * We check to see if the object has been modified by comparing the "stringify'ed" objects
	 * If the json string has any "out of order" values, we get a false difference and the cookie goes out, no problem.
	 */
	if(this.xd) {
		var oldValue = this.JSON.stringify(this.cookies[cName]);				/* get the cookie value before adding new stuff */
		this.addValueToCookieCache(cName, name, value);	/* add the new stuff to the cookie object */
		if( cRes.getResourceID() == "vital" ) { 		/* If this is vital, then update the version */
			this.cookies[cName]["v"] = this.version;
			this.cookies[cName]["vcnt"] = this.trdPartyCookieCnt++ ;
		}
		var newValue = this.JSON.stringify(this.cookies[cName]);
		/* We are overriding the test for unchanged cookie because of
		 *  Jira Ticket: http://jira.touchcommerce.com/browse/MAINT27-563
		 *  Which will be addressed in the following release cycle.
		 */
		if (true || oldValue != newValue){			/* only request the cookie to be set if it has been changed */
			this.set3rdPartyCookie("SCBR3", siteID, cName, this.cookies[cName], !cRes.getPath() ? null : cRes.getPath(), cRes.getLifetime());
		}
	} else {
		var c = this._getCookie(cName);
		if(c == null) {
			cObj = {};
		} else {
			try {
				cObj = this.JSON.parse(c);
			} catch(e) {
				cObj = {};
			}
		}
		/* If (c) above is a nill string and it as json parsed, we are left with cObj being null
		   So we will check to make sure cObj is at least a {} */
		if (cObj == null) cObj = {} ;
		if (value == undefined) {
			delete cObj[name];
		} else {
			cObj[name] = value;
		}
		if( cRes.getResourceID() == "vital" ) {
			cObj["v"] = this.version;
		}
		cVal = this.JSON.stringify(cObj);
		this._setCookie(cRes, cVal);
	}
};


CookieMgr.prototype.postToServer = function(action, data) {
	if(Inq.isNull(data) || Inq.isNull(action)) return;
	boxID = "box" + Math.floor(Math.random()*1000011);
	var port = (inqFrame.location.port!="")?":"+inqFrame.location.port:"";
	var parentURL = inqFrame.location.protocol + "//"  +  inqFrame.location.hostname + port + inqFrame.location.pathname ;
	var postForm = "POST||" + boxID + "||" + parentURL +  "||" + action + "?" ;
	for(var name in data){
		if(typeof data[name] == "function") continue;
		postForm += (name+"=" + encodeURIComponent(data[name])+"&") ;
	}
	postForm = postForm.substring(0, postForm.length - 1);
	this.postRequestToIframeProxy(postForm, boxID);
};

/**
 * Read a value from a cookie
 * @param {CookieResource} cRes defines the cookie name and its properties
 * @param {String} name is the name/key associated with the value
 * @return the value associated with the name, which will need to be cast inside
 * a variable to determine true type
 * @type Object
 */
CookieMgr.prototype.read = function(cRes, name) {
	var cVal = null;
	var cName = cRes.getName();
	if (this.xd) {
		try {
			if (!isNullOrUndefined(this.cookies[cName])) {
//                                        if (!(typeof(this.cookies[cName])=="undefined" || this.cookies[cName]==null)) {

				cVal = this.cookies[cName][name];
			}
		} catch(e) {
			// return default null value because
			// either the cookie or the name/value
			// have not yet been written
			log(e);
		}
	} else {
		var c=this._getCookie(cName);
		var cObj = null;
		try {
			if (c) {
				cObj = this.JSON.parse(c);
				if(cObj != null) {
					// retrieve name-value
					cVal = cObj[name];
				}
			}
		} catch(e) {
			log(e);
		}
	}
	return cVal;


};

/**
 * Clear a cookie from the document. If in xd mode, this
 * method clears the 3rd party cookie. Clearing a cookie
 * means that its name-value pairs are removed.
 * @param {String} cResId id of the cookie resource to clear.
 */
CookieMgr.prototype.clear = function(cResId) {
	var cRes = resources[cResId];
	if (this.xd) {
		var cName = cRes.getName();
		delete this.cookies[cName];
		// clear cookie in browser
		this.set3rdPartyCookie("SCBR3", siteID, cName, "", null, -1*86400000);//set date in past to expire the cookie
		// Log the clearing of the cookie in server log
		this.send(urls.loggingURL, {level:"info", line: ("clear cookie "+cName+", siteID="+siteID+", pageID="+LDM.getPageID()+", custID="+Inq.getCustID())});
	} else {
		this.expireCookie(cResId); // make browser delete this cookie
	}
};

/**
 * Dump all cookie values. For xd mode only
 * Ask the IFrame-Proxy to dump the cookie value to the TagServer's log
 * Please see: in postToServer.htm function doCommands command "DUMP"
 * @return none
 */
CookieMgr.prototype.dump = function() {
	if (this.xd) {
		var boxID = "box" + Math.floor(Math.random()*1000011);
		var port = (inqFrame.location.port!="")?":"+inqFrame.location.port:"";
		var parentURL = inqFrame.location.protocol + "//"  +  inqFrame.location.hostname + port + inqFrame.location.pathname ;
		var postCookieRequest = "DUMP" + "||" + boxID + "||" + "" + "||" + parentURL +  "||" + encodeURIComponent(urls.loggingURL) ;
		this.postRequestToIframeProxy(postCookieRequest, boxID);
	}
};

/**
 * This function has the same parameters as write() and is used by write() to check if limits will be exceeded
 * prior to actually updating cookies.
 * @param {CookieResource} cRes defines the cookie name and its properties
 * @param {String} name of a key or variable
 * @param {Object} value of the key or variable
 * @return 0 if limits are not expected to be exceeded, overflow byte count otherwise
 */
CookieMgr.prototype.predictOverflow = function(cRes, name, value) {

	// calculate size of new name-value pair
	var newObj = {};
	newObj[name] = value;
	var newObjSize = encodeURIComponent(this.JSON.stringify(newObj)).length;

	// calculate size of current name-value pair
	var oldObjSize = 0;
	var cName = cRes.getName();
	var cObj = {};
	if (this.xd) {
		if (this.cookies[cName]) {
			cObj = this.cookies[cName];
		}
	} else {
		var c = this._getCookie(cName);
		if(c) {
			try {
				cObj = this.JSON.parse(c);
			} catch(e) {
				// in this unlikely case we will rely on write() function to handle the error
			}
		}
	}
	if (!isNullOrUndefined(cObj[name])) {
		oldObjSize = encodeURIComponent(this.JSON.stringify(cObj[name])).length;
	}

	// negative delta means cookie size will be decreased as result of write
	var predictedDelta = newObjSize - oldObjSize;
	var result = 0;
	if (predictedDelta > 0) {
		var cResSize = this.getCookieSize(cRes); // get current cookie size
		var cookieLimit = getCookieSizeLimit();
		if (cookieLimit && (cResSize + predictedDelta > cookieLimit)) {
			result = cResSize + predictedDelta - cookieLimit;
		} else {
			var totalSize = this.getCookieSize(); // get total cookies size for domain
			var cookieTotalLimit = getCookieTotalSizeLimit();
			if (cookieTotalLimit && (totalSize + predictedDelta > cookieTotalLimit)) {
				result = totalSize + predictedDelta - cookieTotalLimit;
			}
		}
	}
	return result;
}

/**
 * Returns size the cookie corresponding to the specified CookieResource occupies.
 * If CookieResource is not specified, total size of cookies in current domain is returned (used for browsers
 * that set limits for total size of cookies for a domain).
 * It is a helper method used in cookie overflow detection and cleanup.
 * @param {CookieResource} cRes defines the cookie name and its properties
 * @return size of the specified cookie
 */
CookieMgr.prototype.getCookieSize = function(cRes) {
	var size = 0;
	if (!cRes) {
		if (this.xd) {
			// Calculation of total cookie size for XD mode makes assumption that only cookies created by
			// IJSF cookie resources reside in vanity domain. W/o this assumption cookie size would
			// have to be requested from IFrame proxy
			for (var res in resources) {
				if (resources[res] && resources[res].getName && resources[res].getPath) {
					size += this.getCookieSize(resources[res]);
				}
			}
		} else {
			size = document.cookie.length;
		}
	} else {
		var cName = cRes.getName();
		var cVal;
		if (this.xd) {
			cVal = this.JSON.stringify(this.cookies[cName]);
		} else {
			cVal = this._getCookie(cName);
		}
		if (cVal) size = cName.length + 1 + encodeURIComponent(cVal).length;
	}
	return size;
}

/**
 * Performs cleanup of cookies according to MAINT27-95 guidelines:
 * <p>Cookies need to be limited for XD and nonXD modes. The inqVital cookie should be protected at all times.
 * The other cookies should be cleared in the following order and context.
 * 1. InqState cookie should be cleared first if data exceeds 4k limit on IE6/7 or safari
 * 2. inqSession cookie should be cleared 2nd if data exceeds 4k limit on IE6/7 or safari
 * 3. inqVital cookie should never be cleared...if we cannot write to the cookie without exceeding the 4k limit,
 * 	then we should abort the write and log the issue once to the tagserver.
 * 	For #2, if a chat is in progress...then we should abort the write rather then purge the session cookie and
 * 	thus the chat</p>
 * @param byteCountToFree parameter specifying how many bytes must be freed
 * @return true if required space was freed, false otherwise. If false is returned, write to cookie must be
 * aborted.
 */
CookieMgr.prototype.pruneCookieOnOverflow = function(byteCountToFree) {
	var cookiesToPrune = [];
	var stateRes = resources["state"];
	var inqStateSize = this.getCookieSize(stateRes);
	if (inqStateSize >= byteCountToFree) {
		cookiesToPrune[0] = stateRes;
	} else if (!CHM.isChatInProgress()) {
		var sesRes = resources["session"];
		var inqSessionSize = this.getCookieSize(sesRes);
		if (inqStateSize + inqSessionSize >= byteCountToFree) {
			cookiesToPrune[0] = stateRes;
			cookiesToPrune[1] = sesRes;
		}
	}

	if (cookiesToPrune.length > 0) {

		// Log clearing of cookies in browser console and TS log
		var cookieNames = [];
		for (var i = 0; i < cookiesToPrune.length; i++) {
			cookieNames[i] = cookiesToPrune[i].getName();
		}
		var msg = "Cookie overflow! Trying to clear following cookie(s): " + cookieNames.join() + ". ";
		log("ERROR: " + msg);
		if (!this.overflowLogged) { // log overflow to TS once per landing
			msg = prepareLoggingContext(msg);
			this.send(urls.loggingURL, {level:'ERROR', line: msg});
			this.overflowLogged = true;
		}

		for (var i = 0; i < cookiesToPrune.length; i++) {
			this.clear(cookiesToPrune[i].getResourceID());
		}
		return true;
	} else {
		// nothing to prune means there was no chance to free requested count of bytes
		return false;
	}
}

/**
 * Set a cookie value. This is a very low-level API that sets an entire cookie in the document. This
 * is a <b>private</b> method.
 * @param {CookieResource} cRes
 * @param {String} cVal
 * @param {String} cLifetime optional parameter, specifies cookie lifetime in ms; valid values integer >= 0.
 *
 */
CookieMgr.prototype._setCookie = function(cRes, cVal, cLifetime) {

	var name = cRes.getName();
	var lifetime = cRes.getLifetime();
	if (!!cLifetime) lifetime = cLifetime;
	var path = cRes.getPath();
	var domain = cRes.getDomain();
	var secure = cRes.getSecure();

	//set time, it's in milliseconds
	var now = new Date();
	var expires_date = new Date( now.getTime() + lifetime );

	var update = null;
	// pc cookie is used to test weather the browser accepts persistent cookies or not.
	//To make the check the pc cookie has to be a persistent cookie.
	if ((name == "pc" || this.isPersistentCookiesAllowed()) && lifetime>0){
		update = name + "=" + encodeURIComponent(cVal) +
		";expires=" + expires_date.toGMTString() +
		( ( path ) ? ";path=" + path : "" ) +
		( ( domain ) ? ";domain=" + domain : "" ) +
		( ( secure ) ? ";secure" : "" );
	}
	else {
		// If the browser does not accepts persistent cookies - make all cookies as session cookies
		update = name + "=" + encodeURIComponent(cVal) +
		( ( path ) ? ";path=" + path : "" ) +
		( ( domain ) ? ";domain=" + domain : "" ) +
		( ( secure ) ? ";secure" : "" );
	}

	document.cookie = update ;

};

/**
 * Retrieve an entire cookie.
 * This is a <b>private</b> method. Access available for easy testing.
 * @param {String} cName CookieName
 * @param {String} cName
 * @return the value of a cookie, null if the cookie does not exist
 * @type String
 */
CookieMgr.prototype._getCookie = function(cName, data) {
	var cookies = this._getCookies(data);
	if(!!cookies && !!cookies[cName]){
		return cookies[cName];
	}
	return null;
};

/**
 * Gets all cookies as name-value pairs in an object map (<String,String>).
 * This is a <b>private</b> method. Access available for easy testing.
 * @param {String} data optional data parameter that represents a
 * cookie string to be parsed
 * @return the value of a cookie, null if the cookie does not exist
 * @type String
 */
CookieMgr.prototype._getCookies = function(data) {
	// first split this cookie up into sub-cookie pairs
	// note: document.cookie only returns name=value, not the other components
	var a_all_cookies =  (isNullOrUndefined(data)) ? document.cookie.split( ';' ) : data.split( ';' );
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
};


CookieMgr.prototype._clearCookie = function(cRes) {
	var clearVal = this.JSON.stringify({});
	this._setCookie(cRes, clearVal);
};

/**
 * @param data contains a JSON object contain whole cookie values
 * {"inqState": {...}, "inqVital": {"INQ": {...}, ...}, "inqSession": {...}}
 */
CookieMgr.prototype.setXDCookies = function(cookieData) {
	this.cookies = cookieData;

};

/**
  *	Establish the listener for 3rd party cookie queue becoming empty
  */
CookieMgr.prototype.onThirdPartyCookieQueueEmpty = null ;

/**
  *	Establish a collection of handlers for 3rd party cookie queue becoming empty
  */
CookieMgr.prototype.onThirdPartyCookieQueueEmptyHandlers = [] ;

/**
  *	Handlers can added into 3rd party cookie queue. - only one handler to keep system simple.
  */
CookieMgr.prototype.on3rdPartyCookieCommittedHandler = null;

/**
  *	Test for third party cookie queue empty and idle (no cookie saving is in progress)
  */
CookieMgr.prototype.isThirdPartyCookieQueueEmpty = function(){
	return (0==this.set3rdPartyCookieQueue.length) && !this.set3rdPartyCookieBusy;
};

 /**
	* set3rdPartyCookie - sets third-party cookie via an iframe-proxy
	* details:
	*    An IFRAME with source from domain of the vanity domain performs the cookie setting on behalf of this
	*    domain.
	*    Inq.SvrCom.set3rdPartyCookie asks the IFRAME to set the cookie on our behalf.
	*    Please note: this requires special P3P headers for the IFRAME source
	*
	* @param   {Number} expiry - lifetime in milliseconds
	* @author  fpinn@TouchCommerce.com
	* @see SaveMgr.setCookie3p
	* @see HTML file postToServer.htm which performs the cookie setting via command "SCBR3" (Set Cookie BR2)
	*
	*/

CookieMgr.prototype.set3rdPartyCookie = function(cmd, site, name, delta, path, expiry){
		// Current origin:            http://www.touchcommerce.com
		// Target origin for cookies: http://home.inq.com (for example)

		//this.initMessagingComplete = this.initMessaging();
		if (!path) path="/";
		if (!expiry) expiry="";
		if(isNullOrUndefined(cmd) || isNullOrUndefined(site) || isNullOrUndefined(name)) return;

		var boxID = "box" + Math.floor(Math.random()*1000011);
		var port = (inqFrame.location.port!="")?":"+inqFrame.location.port:"";
		var parentURL = inqFrame.location.protocol + "//"  +  inqFrame.location.hostname + port + inqFrame.location.pathname ;
		var sDelta = encodeURIComponent(""+this.JSON.stringify(delta));

		var postCookie = cmd  + "||" + boxID + "||" + site + "||" + parentURL +  "||" +
		name + "||" + sDelta + "||" + path + "||" + expiry ;

		/* Put the cookie message on the queue if queue is empty
		   If queue is not empty find if the cookie (by name) is in the queue and replace it
		   The new cookie trumps the old cookie, it is it's replacement
		   If the cookie name is not in the queue then put cookie at tail of queue
		   BTW: The count for the queue will never exceed the number of cookie names
		  */
		if (0==this.set3rdPartyCookieQueue.length)
			this.set3rdPartyCookieQueue.push({name: name, postCookie: postCookie});
		else {
			/* Look for a match, check the cookie name against the name in the queue object */
			var i = 0;
			for (i = 0; i < this.set3rdPartyCookieQueue.length; i++) {
				if (this.set3rdPartyCookieQueue[i].name==name) {
					this.set3rdPartyCookieQueue[i].postCookie = postCookie ;
					break ;
				}
			}
			/* If the queue length is equal to the index from the for-loop, then we did not find a match */
			if (i==this.set3rdPartyCookieQueue.length) {
				this.set3rdPartyCookieQueue.push({name: name, postCookie: postCookie});
			}
		}

		/* If we are busy, leave the message queued and return */
		if (this.set3rdPartyCookieBusy) return ;

		 /* Set busy flag */
		this.set3rdPartyCookieBusy=true;

		/* Call the function to write 3rdPartyCookie in queue */
		this.set3rdPartyCookieFromQueue();
};

	/**
	  * set3rdPartyCookieQueue - sets queued third-party cookie via an iframe-proxy
	  *                          if no queued third-party cookie, then set set3rdPartyCookieBusy to false
	  * called by the Iframe-Proxy postToServer.htm after cookie has been set.
	  *
	  * details:
	  *    An IFRAME with source from domain of the vanity domain performs the cookie setting on behalf of this
	  *    domain.
	  *    Inq.SvrCom.set3rdPartyCookie asks the IFRAME to set the cookie on our behalf.
	  *    Please note: this requires special P3P headers for the IFRAME source
	  *
	  *  1) get cookie request from queue
	  *  2) if cookie request is NOT avalable THEN set busy flag to false
	  *  3) ELSE create boxID and put it in the cookie request then post the request to the IFrame-Proxy
	  *
	  * @param	none
	  * @author  fpinn@TouchCommerce.com
	  * @see set3rdPartyCookie
	  * @see SaveMgr.setCookie3p
	  * @see HTML file postToServer.htm which performs the cookie setting via command "SCBR3" (Set Cookie BR3)
	  *
	  */

	  CookieMgr.prototype.set3rdPartyCookieFromQueue = function(){
		  var cookieQItem = null ;
		  cookieQItem = this.set3rdPartyCookieQueue.shift();
		  if (!isNullOrUndefined(cookieQItem)) {
			  var items = cookieQItem.postCookie.split("||");
			  this.postRequestToIframeProxy(cookieQItem.postCookie, items[1]); /* issue request */
		  }
		  else {												/* We only get here if we have an empty cookie queue */
			  this.set3rdPartyCookieBusy=false;
			  if (this.onThirdPartyCookieQueueEmpty != null){	/* Check to see that we have a listener for an empty queue */
				this.onThirdPartyCookieQueueEmpty ();			/* fire the listener */
			  }
		  }
	  };


	/** This calls supplied function once the cookies have been committed.
	  *
	  * @param handler - handler to be called when committed
	  */
	CookieMgr.prototype.whenCookiesCommitted=function(handler){
		if (this.xd) {
			if (this.isThirdPartyCookieQueueEmpty())
				handler(); /* Queue is empty, do the handler */
			else {
				/* We have a queue, so setup listener for cookie queue empty */
				/* Register the handler  */
				this.onThirdPartyCookieQueueEmptyHandlers.push(handler);
				this.onThirdPartyCookieQueueEmpty = function() { 	/* This is the listener for cookie queue empty */					/* get cookie manager */
					(CM).whenCookiesFireHandlers();
				};
				/* Check queue again, just in case the cookie came in before the handler was established */
				if (this.isThirdPartyCookieQueueEmpty()) {
					this.whenCookiesFireHandlers();
				}
			}
		}
		else { /* Not xd mode, do the handler */
			 handler();
		}
	};

	 /*
	  * This function will add a handler into set3rdPartyCookieQueue to obey sequence.
	  *
	  * 
	  * @param handler - handler to be called when committed
	  */
	CookieMgr.prototype.setWhen3rdPartyCookieCommittedHandler=function( handler ){
		if ( this.xd ) {
			try {
				var boxID = "box" + Math.floor(Math.random()*1000011);
				var port = (inqFrame.location.port!="")?":"+inqFrame.location.port:"";
				var parentURL = inqFrame.location.protocol + "//"  +  inqFrame.location.hostname + port + inqFrame.location.pathname ;
				var postCookieRequest = "COMMITPOINT" + "||" + boxID + "||" + siteID + "||" + parentURL +  "||" + encodeURIComponent(urls.loggingURL) ;

				if ( handler ) {
					this.on3rdPartyCookieCommittedHandler = { "vcnt": this.trdPartyCookieCnt - 1, "callback" : handler } ;
				}

				this.set3rdPartyCookieQueue.push({name: "inqCallBack" + Math.floor(Math.random()*1000011), postCookie: postCookieRequest});

				if ( !this.set3rdPartyCookieBusy ) {
					this.set3rdPartyCookieBusy=true;
					this.set3rdPartyCookieFromQueue();
				}
			} catch (e) {
				log("exception in setWhen3rdPartyCookieCommittedHandler(): " + e.message, "error");
			}
		} else {
			return false;
		}

	};

	/** 
	  * Executes handler from queue in sequence and continue the queue.
	  *
	  * @param handler - handler to be called when committed
	  */
	CookieMgr.prototype.when3rdPartyCookieCommitted=function( vcnt ){

		if ( null != this.on3rdPartyCookieCommittedHandler ) {
			try {
				if ( typeof vcnt !== "undefined" && this.on3rdPartyCookieCommittedHandler["vcnt"] <= vcnt )
				{
					this.on3rdPartyCookieCommittedHandler["callback"]();
					this.on3rdPartyCookieCommittedHandler = null;
					this.set3rdPartyCookieFromQueue();
				} else {
					this.set3rdPartyCookieBusy = false;
					this.setWhen3rdPartyCookieCommittedHandler( );
				}
			} catch (e) {
				log("exception in CookieMgr.prototype.when3rdPartyCookieCommitted: " + e.message, "error");
			}
		} else {
			this.set3rdPartyCookieFromQueue();
		}

	};

	/**
	 * This calls all supplied functions once the cookies have been committed.
	 */
	CookieMgr.prototype.whenCookiesFireHandlers=function(){
		log("CookieMgr.whenCookiesFireHandlers() entered: got " + this.onThirdPartyCookieQueueEmptyHandlers.length + " handler(s).");
		this.onThirdPartyCookieQueueEmpty = null;		/* remove the listener */
		while (this.onThirdPartyCookieQueueEmptyHandlers.length>0){
			var handlerRoutine = this.onThirdPartyCookieQueueEmptyHandlers.shift(); /* remove handler from top of list */
			if (handlerRoutine){
				try {
					handlerRoutine(); /* perform the handler */
				} catch (e) {
					log("exception in whenCookiesFireHandlers(): " + e.message, "error");
				}
			}
		}
	};

	/**
		* createIframeProxy: Creates an IFRAME that listens for commands to perform
		* The commands are obtained by sending "postMessage" to the IFRAME.  This is an iframe-proxy.
		*
		* @param	none
		* @author  fpinn@TouchCommerce.com
		*
		*/

	CookieMgr.prototype.createIframeProxy = function(){
			var _win=inqFrame;
			var boxID = "iframeProxy" + Math.floor(Math.random()*1000011);
			var port = (inqFrame.location.port!="")?":"+inqFrame.location.port:"";
			var parentURL = inqFrame.location.protocol + "//"  +  inqFrame.location.hostname + port + inqFrame.location.pathname ;
			var postListener = "LISTEN" + "||" + boxID + "||" + parentURL +  "||" ;
			this.postRequestToIframeByName(postListener, boxID);
	};

	/**
	 * postRequestToIframeByName - create new iframe-proxy to do some work
	 * Put the request (the command and data) in the NAME field of the new iframe
	 * details:
	 *    An IFRAME with source from domain of the vanity domain performs work specified by the request parameter.
	 *
	 * @param	request - the command and data for the proxy-iframe to run
	 *           the format is command||data1||data2...||datan
	 * @param    frameId - the unique ID of the iframe-proxy
	 * @author  fpinn@TouchCommerce.com
	 * @see HTML file postToServer.htm which performs the cookie setting via command in request
	 *
	 */

	CookieMgr.prototype.postRequestToIframeByName = function(request, frameId) {
		// current origin: http://www.touchcommerce.com
		// target origin:  http://home.inq.com
		var div = window.document.getElementById("inqPostBox");
		if(!div){
			div = Inq.createFloatingDiv("inqPostBox", 0, 0, 1, 1,window.inqFrame);
			div.style.display="";
			div.style.cssText += "opacity:0.0;filter:alpha(opacity=0);";
			div.style.cssText += "overflow: hidden;overflow-x: hidden; overflow-y: hidden";
		}

		var divsub = window.document.createElement("DIV");
		var base = this.getIFrameBaseURL();

		/* frameSrc: the reference to the postToServer is: http://home.inq.com/tagserver/postToServer.htm
		 * It must be that way, because the P3P filter has it that way.
		 * If no P3P Filter, no cookie set for IE.
		 * https://dev.inq.com/jira/browse/MAINT24-271
		 */
		var frameSrc = base+"/tagserver/postToServer.htm" ;
		var iframe  = "<IFRAME "
					+ "ID=" + frameId + " "
					+ "STYLE=\"overflow: hidden; display: block; border: none; top:0px;left:0px;width: 1px; height: 1px;\" "
					+ "NAME=\"" + encodeURIComponent(request) + "\" "
					+ "SRC=" + frameSrc + ">\n</IFRAME>";
		divsub.style.cssText = div.style.cssText ;
		divsub.innerHTML = iframe ;
		div.appendChild(divsub);

	};

	/*
	 *  Return iFrame base URL
	 *  Store it in this._iFrameBaseURL, change protocol to HTTPS if browser thpe is Safari and not Chrome.
	 *  
	 */
	CookieMgr.prototype.getIFrameBaseURL = function() {

		if (typeof this._iFrameBaseURL == 'undefined') {
			this._iFrameBaseURL = Inq.urls.baseURL.split("/",3).join("/") ;
			if ( ( /safari|firefox/i ).test(window.navigator.userAgent) && !( /chrome/i ).test(window.navigator.userAgent) )	{
				this._iFrameBaseURL = CookieMgr.secureHTTP( this._iFrameBaseURL );
			}
		}

		return  this._iFrameBaseURL;
	};

	CookieMgr.secureHTTP = function( httpURL ) {
		return httpURL.replace( /^http:/i, 'https:' );
	};

   /**
	 * postRequestToIframeByMessage - reuse an iframe-proxy to do some work
	 * postMessage the request (the command and data)
	 * details:
	 *    An IFRAME with source from domain of the vanity domain performs work specified by the request parameter.
	 *
	 * Please Note: this is performed only if postMessage is implemented.
	 *              otherwise we use the above function "postRequestToIframeByName"
	 *
	 * @param	request - the command and data for the proxy-iframe to run
	 *           the format is command||data1||data2...||datan
	 * @param    frameId - the unique ID of the iframe-proxy
	 * @author  fpinn@TouchCommerce.com
	 * @see postRequestToIframeByName
	 * @see HTML file postToServer.htm which performs the cookie setting via command in request
	 *
	 */

	 CookieMgr.prototype.postRequestToIframeByMessage = function(request, frameId, frm) {
		 /* fix id for the re-used iframe */
		 var pattern =  "||" + frameId + "||" ;
		 var replacement =  "||" + frm.id + "||" ;
		 request = request.split(pattern).join(replacement);
		 var win = frm.contentWindow;
		 if (win!=null && win["postMessage"]!=null)
			 win.postMessage(encodeURIComponent(request),"*");
	 };


   /**
	 * postRequestToIframeProxy - use an iframe-proxy to do some work
	 * details:
	 *    An IFRAME with source from domain of the vanity domain performs work specified by the request parameter.
	 *
	 *
	 * @param	request - the command and data for the proxy-iframe to run
	 *           the format is command||data1||data2...||datan
	 * @param    frameId - the unique ID of the iframe-proxy
	 * @author  fpinn@TouchCommerce.com
	 * @see postRequestToIframeByMessage
	 * @see postRequestToIframeByName
	 * @see HTML file postToServer.htm which performs the cookie setting via command in request
	 *
	 */

	CookieMgr.prototype.postRequestToIframeProxy = function(request,frameid) {
		/*
		 * If there is an available idle iframe-proxy, then use it.
		 * Else create a new one.
		 */
		/* Make sure that the post routine's messaging is initialized */
		if ((this.iframeProxyArray==null)) initMessagingComplete = this.initMessaging();
		if (window["postMessage"]==null || this.iframeProxyArray.length < 1){
			this.postRequestToIframeByName(request,frameid);
		}
		else {
			var frm = this.iframeProxyArray.shift() ;
			if (frm) {
				try {
					this.postRequestToIframeByMessage(request,frameid,frm);
				} catch (e) {
					this.postRequestToIframeByName(request,frameid);
				}
			}
			else
				this.postRequestToIframeByName(request,frameid);
		}
	};


  /**
	* OnMessage: onMessage handler.
	* OnMessage forwards the onMessage message to onMessage handler with the correct this context.
	* When this handler is invoked, "this" is pointing to the window, not the SvrCom context
	* We correct that by calling the non-static onMessage via the SvrCom object.
	*
	*  @param	event - The event thingy
	*  @author Fred A. Pinn <fpinn@TouchCommerce.com>
	*/

  CookieMgr.prototype.OnMessage = function(event){
		return CM.onMessage(event);
	};


  /**
	* onMessage: onMessage handler.
	* Receives the response from the iframe-proxy window
	*
	* The data is seperated by "||"
	*  item 0: unique id of the iframe-proxy
	*  item 1: commands to be executed
	*
	*  The command is executed (via eval)
	*  Then the IFRAME is put on the iframeProxyArray for reuse.
	*
	*  As an extra precaution,
	*  we make sure that we only process commands from our iframe-proxies by checking the origin
	*
	*  @param	e - The event object
	*  @author Fred A. Pinn <fpinn@TouchCommerce.com>
	*  @return	false ;
	*/

	CookieMgr.prototype.onMessage = function(e){
		var ev=(e)?e:event; /* Get the event */
		var message = ev.data;  /*retrieve data */
		/* We need to check that we are getting the request form the origin that we expect
		 * We do not want to check the protocol, just the domain
		 */
		var origin = ev.origin.split("/",3)[2] ; 		/*get origin domain so we can see who sent message */
		var base = Inq.urls.baseURL.split("/",3)[2];	/*get the domain from our vanity domain*/
		/* remove the first order domain */
		origin = origin.split(".");
		base = base.split(".");
		var server=origin.shift();
		base.shift();
		origin = origin.join(".");
		base = base.join(".");

		if (origin!=base)
			return false; /*(if our iframe-proxy did not send it, ignore it */

		var items = message.split("||");
		var data = decodeURIComponent(items[1]);
		try {
			window.eval(data);
		} catch(fault){
			 ROM.post(urls.loggingURL, {level:'ERROR', line: ('IFRAME/PROXY: '+catchFormatter(fault))});
		}
		try {
			var tag = self.document.getElementById(items[0]);
			if (tag && server!="cobrowse") {
			this.iframeProxyArray.push(tag);
			}
		} catch(e){}
		return false;
	};

  /**
	* requestCookie: get the cookie datas from the third party cookiea
	* Ask an iframe-proxy to get the cookie settinga
	*    An IFRAME with source from domain of the vanity domain performs the cookie retrieval on behalf of this domain.
	*
	* @param	cmd - the command for
	* @param site - site id used as a prefix for the cookie names
	* @author  fpinn@TouchCommerce.com
	* @see HTML file postToServer.htm which performs the cookie retrieval via command "GCBR3" (Get Cookie BR3)
	* @see SaveMgr.updateCookiesFromServer
	*
	*/

	CookieMgr.prototype.requestCookie = function(cmd, site){
		var _win=inqFrame;
		if(isNullOrUndefined(cmd) || isNullOrUndefined(site)) return;

		var boxID = "box" + Math.floor(Math.random()*1000011);
		var port = (inqFrame.location.port!="")?":"+inqFrame.location.port:"";
		var parentURL = inqFrame.location.protocol + "//"  +  inqFrame.location.hostname + port + inqFrame.location.pathname ;
		var postCookieRequest = cmd + "||" + boxID + "||" + site + "||" + parentURL +  "||" + "no action" ;
		this.postRequestToIframeProxy(postCookieRequest, boxID);
	};


   /**
	* initMessaging: creates the re-usable iframe-proxies.
	* initMessaging: creates the re-usable iframe-proxies.
	* initMessaging: creates the re-usable iframe-proxies.
	* initMessaging: creates the re-usable iframe-proxies.
	* initMessaging: creates the re-usable iframe-proxies.
	* a) Check to ensure that this initialization happens only once.
	* b) Ensure that postMessage is available for our use
	* c) Establish message handler for receiving posted messages
	* d) Create a bunch of iframe-proxies for our use.
	*
	*  @param	action - The target path for the application receiving the post data
	*  @param  data   - the object containing the data to be passed to the application
	*  @param  _win   - The window to perform the post.
	*  @author Fred A. Pinn <fpinn@TouchCommerce.com>
	*  @return	nothing ;
	*/

	CookieMgr.prototype.initMessaging = function(){
		if (this.initMessagingComplete) return true;
		/* Publish the proxy error routine
		 * BTW: This is how GWT does it,
		 * this way we do not have to put it in FlashPeer,
		 */
		Inq["proxyError"] = this.proxyError;
		if (window["postMessage"]==null) return true ;

		if (window.addEventListener)
			window.addEventListener ("message", this.OnMessage, false);
		else if (window["attachEvent"])
			window.attachEvent("onmessage", this.OnMessage);
		else
			window.onmessage = this.OnMessage ;

		if (this.iframeProxyArray==null){
			this.iframeProxyArray=[];

		}
		return true;
	};

/**
 * Function proxyError - Logs the stack trace into the tag server log
 * The stack trace is sent to the tagserver via POST not GET
 *  this is necessary do to the size of the trace.
 * Please see new ROM.send command
 * @param errorText - the text describing the error
 * @return nothing
 */
CookieMgr.prototype.proxyError = function(errorText) {
	this.send(urls.loggingURL, {level:"INFO", line: encodeURIComponent(errorText)});
};

CookieMgr.prototype.onRemoteCallback = function(data) {
	this.setXDCookies(data);
};

/**
 * Expires cookie stored by a resource with specified id which makes browser delete this cookie.
 * @param cookieResourceId id of cookie resource to expire
 */
CookieMgr.prototype.expireCookie = function(cookieResourceId) {
	log("EXPIRING COOKIE \"" + cookieResourceId + "\"");
	var cRes = resources[cookieResourceId];
	this._setCookie(cRes, "", -1);
};

/**
 * Clears out existing InQ cookies saving sold state and cust ID of vital cookie.
 */
CookieMgr.prototype.convertCookies = function( ){
	var cookiePieces = this._getCookie( resources["vital"].getName() );

	/* If BR30 cookie then exit */
	if( cookiePieces == null || cookiePieces.match(/\"v\":\d/)|| cookiePieces.match(/,v:\d/) ) {
		return;
	}
	cookiePieces = cookiePieces.split("^");
	/* Clear old cookies */
	this._clearCookie(resources["vital"]);
	this._clearCookie(resources["state"]);
	this._clearCookie(resources["session"]);

	for( var innerIndex = 0 ; innerIndex < cookiePieces .length ; innerIndex ++ ){
		if( cookiePieces[ innerIndex ].match(/^inq\|/) ){
			var custObj= this.JSON.parse( cookiePieces[ innerIndex ].split("|")[1]  );
			this.write(resources["vital"], "INQ", { "custID" :  custObj.customerID } );
		}else if( cookiePieces[ innerIndex ].match(/^saleMgr\|/) ){
			var saleObj= this.JSON.parse( cookiePieces[ innerIndex ].split("|")[1] );
			if (saleObj.state && saleObj.state === "QUALIFIED") {
				this.write( resources["vital"] , "assistAgt" , saleObj.qDat.agtID );
				this.write( resources["vital"] , "assistChatID" , saleObj.qDat.chatID ? saleObj.qDat.chatID : "-1" );
				this.write( resources["vital"] , "saleState" , getConstant("SALE_STATE_ASSISTED") );
				this.write( resources["vital"] , "assistDT" , saleObj.qDat.date );
			} else {
				this.write(resources["vital"], "CVM", { "state" : saleObj.state } );
			}
	   }
   }
};
