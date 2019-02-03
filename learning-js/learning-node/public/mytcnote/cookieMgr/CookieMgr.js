// When debugging CookieMgr for IE6 and IE7, there is a way to make modern browsers behave like like IE7:
// setup window object as if window.postMessage HTML5 API is unavailable:
// Append "window.postMessage=null;" to JS files (but NOT "delete window.postMessage" - it restores native implementation).

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
			this.JSON = MixIns.JSON;
			this.version = 3;
			this.initMessagingComplete = false; /*used to ensure initialization happens only once */
			this.set3rdPartyCookieBusy = false;
	        this.set3rdPartyCookieQueue = [];
	        this.overflowLogged = false; // flag used to avoid TS log flood (log overflow once per landing)
			this.trdPartyCookieCnt = 0;     // 3rd party cookie counter (for vital).
			this.isLSused = false;          // True if localStorage is used.
			this.cntHandlerTried = 0;       // how many times checked 3rd party cookie commited handler function.
			/* cookie cleaning detection flag to block the duplication of logging error
			 * during the one chat session in the page instance, updated when the page is refreshed */
			this.cleaningDetected = false;

			/* will try to detect the cleaning of local data
			 * (local storage, session storage and indirectly the cookie)
			 * through the setting up the listener of storage event */
			this.configureStorageListener();
		}
		MixIns.prepare(CookieMgr).mixIn(MixIns.FrameworkModule).mixIn(MixIns.RemoteCaller);
		CookieMgr.CM = null;
        var PERSISTENT_COOKIE_ALLOWED = "pc";

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
		 * @param {boolean} update if true then tries to update cache data in another(opener/persistent) window
		 * If undefined, null or false, the value will be treated as a std pass-thru object. If true
		 * then the value will be treated as a JSON string to be parsed before processing.
		 */
        CookieMgr.prototype.addValueToCookieCache = function(cName, name, value, isJSON, update){
            if (!isNullOrUndefined(value)) {
                value = !!isJSON?MixIns.JSON.parse(decodeURIComponent(value)):value;
            }
            if(!update) {
                if(isPersistentWindow()) {
                    try{
                        var cmPeer = this.getPeer();
                        if(!!cmPeer) {
                            if(cmPeer.persistentWindow != win) {
                                cmPeer.persistentWindow = win;
                            }
                            if (!isNullOrUndefined(value)) {
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
                        if (!!this.persistentWindow && !this.persistentWindow.closed) {
                            var cmPersistent = this.persistentWindow.inqFrame.Inq.CM;
                            if (!!cmPersistent) {
                                if (!isNullOrUndefined(value)) {
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
            if (isNullOrUndefined(value)) {
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
			if (this.cleaningDetected) {
				return;
			}
			var cObj = null;
			var cVal = null;
			var cName = cRes.getName();
			var cookieError = null;

			// PERSISTENT_COOKIE_ALLOWED resource is used to test if persistent cookie are allowed, it is excluded here to avoid recursion.
			// undefined value means cookie size won't be increased, thus no need to do overflow prediction
			// there is no need to compare Cookie size if localStorage is used
            if (cName != COOKIE_PC_NAME && value != undefined && !this.isLSused) {

				var predictedResult;
	            try{
		            predictedResult = this.predictOverflow(cRes, name, value);
	            }catch(err) {
		            if (err.constructor === CookieDomainSizeError || err.constructor === CookieSizeError) {
			            cookieError = err;
			            log(cookieError.toString()); // log the result to console
			            predictedResult = cookieError.getData().result; // record the overage
		            }
	            }
	            // if we are overflowing the cookie domain space, we need to cull cookies
	            // (and not the one we are writing to if we can help it)
				if (!!cookieError && predictedResult != 0) {
					var overflowObject = {_domain: "error", evt: "cookieoverflow", params: {custID: Inq.getCustID(), siteID: getSiteID(), resource: cName, varId: name, size: JSON.stringify(value).length, sessionId: getSessionID(), incAssignmentID: getIncAssignmentID(), incGroup: getIncGroupID()}};
					var msg = "Cookie overflow!";
					if(cookieError.constructor == CookieDomainSizeError) {
						var pruneSuccessful = this.pruneCookieOnOverflow(predictedResult, cRes.getPurgePriority());
						msg += " New cookie overflows domain limit";
						if (pruneSuccessful) {
							log("ERROR: variable named '" + name + "' (size=" + value.length + ") write aborted and cookie (name=" + cName + ") overflowed and dropped. Variable: {" + name + ":\"" + value + "\"");
						}
						overflowObject["pruneSuccess"] = pruneSuccessful;
					}
					else if(cookieError.constructor === CookieSizeError){
						// at this point we are overflowing a single cookie and can't write any more data to it
						// The only thing we CAN do is to ignore the write and log the problem. Cookie is abused.
						msg += " cookie is packed to limit. Data dropped.";
						log("WARNING: Cookie overflowed when writing variable. varId="+name+", cookieName="+cName+", varSize="+value.length+", attemptedValue="+value);
					}
					if(!this.overflowLogged) {
						overflowObject["Log2ETL"] = true;
						overflowObject["params"]["msg"] = msg;
						this.send(urls.loggingURL, {line: JSON.stringify(overflowObject)});
						this.overflowLogged = true;
					}
					if(cookieError.constructor===CookieSizeError){
						return; // Prevent write when exceeding cookie size
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
				this.checkCookieValidity();
				if (this.cleaningDetected) {
					//DO NOT DELETE THIS CHECK
					//We have do it due to IE11 runs cookieValidationCallback synchronously.
					return;
				}
				var oldValue = this.JSON.stringify(this.cookies[cName]);				/* get the cookie value before adding new stuff */
				this.addValueToCookieCache(cName, name, value);	/* add the new stuff to the cookie object */
				if( cRes.getResourceID() == "vital" ) { 		/* If this is vital, then update the version */
					this.cookies[cName]["v"] = this.version;
					this.cookies[cName]["vcnt"] = this.trdPartyCookieCnt++ ;
                    this.cookies[cName]["vtime"] = (new Date).getTime() ;
				}
				var newValue = this.JSON.stringify(this.cookies[cName]);
                /*
                 * In case we are overriding the incrementalityID value, write that error to server logs.
                 */
                try {
                    if (cRes.getResourceID() == "vital" && !isNullOrUndefined(oldValue) && oldValue.indexOf("_iID") != -1 ) {
                        if (isNullOrUndefined(newValue) || newValue.indexOf("_iID") == -1) {
                            ROM.send(urls.loggingURL, {level:'ERROR', line: ("overriding the incrAssignmentID for siteID="+Inq.getSiteID()+" customerID="+Inq.getCustID()+"oldValue="+oldValue+"newValue ="+newValue)});
                        }
                    }
                } catch(e){
                    log("Error:overriding the valid incrAssignmentID for siteID"+Inq.getSiteID()+" customerID="+Inq.getCustID());
                }

                /* We are overriding the test for unchanged cookie because of
                     *  Jira Ticket: http://jira.touchcommerce.com/browse/MAINT27-563
                     *  Which will be addressed in the following release cycle.
                     */
                if (true || oldValue != newValue){			/* only request the cookie to be set if it has been changed */
					this.set3rdPartyCookie("SCBR3_PM", siteID, cName, this.cookies[cName], !cRes.getPath() ? null : cRes.getPath(), cRes.getLifetime());
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
				/* If (c) above is a null string and it as json parsed, we are left with cObj being null
				   So we will check to make sure cObj is at least a {} */
				if (cObj == null) cObj = {} ;
				if (isNullOrUndefined(value)) {
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
				this.set3rdPartyCookie("SCBR3_PM", siteID, cName, "", null, -1*86400000);//set date in past to expire the cookie
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
                var postCookieRequest = ["DUMP", boxID, "", parentURL, encodeURIComponent(secureHTTP(urls.loggingURL))];
                this.postRequestToIframeProxy(postCookieRequest, boxID);
			}
		};

		/**
		 * CookieSizeError
		 * @param cName {string} cookie name
		 * @param size {number} current size of the target 0cookie
		 * @param delta {number} size of the value to be added to the target cookie
		 * @param limit {number} cookie domain limit for the browser
		 * @param result {number} amount over limit
		 * @constructor
		 */
		function CookieSizeError(cName, size, delta, limit, result){
			this.getData = function(){return {cookieName: cName, oldSize:size, delta:delta, limit:limit, result:result};};
			this.toString = function(){return "CookieSizeError: Cookie size violated, proposed size="+(size + delta)+", limit="+limit+", result="+result;};
		}
		/**
		 * CookieDomainSizeError
		 * @param cName {string} cookie name
		 * @param size {number} current size of the target 0cookie
		 * @param delta {number} size of the value to be added to the target cookie
		 * @param limit {number} cookie domain limit for the browser
		 * @param result {number} amount over limit
 		 * @constructor
		 */
		function CookieDomainSizeError(cName, size, delta, limit, result){
			this.getData = function(){return {cookieName: cName, oldSize:size, delta:delta, limit:limit, result:result};};
			this.toString = function(){return "CookieDomainSizeError: Cookie domain size violated, proposed size="+(size + delta)+", limit="+limit+", result="+result;};
		}

		/**
		 * This function has the same parameters as write() and is used by write() to check if limits will be exceeded
		 * prior to actually updating cookies.
		 * @param {CookieResource} cRes defines the cookie name and its properties
		 * @param {String} name of a key or variable
		 * @param {Object} value of the key or variable
		 * @return {Number} 0 if limits are not expected to be exceeded, overflow byte count otherwise
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
			if (predictedDelta > 0) {
				var cResSize = this.getCookieSize(cRes); // get current cookie size
				var cookieLimit = getCookieSizeLimit();
				if (cookieLimit && (cResSize + predictedDelta > cookieLimit)) {
					throw new CookieSizeError(cName,cResSize, predictedDelta, cookieLimit, cResSize + predictedDelta - cookieLimit);
				} else {
					var totalSize = this.getCookieSize(); // get total cookies size for domain
					var cookieTotalLimit = getCookieTotalSizeLimit();
					if (cookieTotalLimit && (totalSize + predictedDelta > cookieTotalLimit)) {
						throw new CookieDomainSizeError(cName, totalSize, predictedDelta, cookieTotalLimit, totalSize + predictedDelta - cookieTotalLimit);
					}
				}
			}
			return 0;
		};

		/**
		 * Returns size the cookie corresponding to the specified CookieResource occupies.
		 * If CookieResource is not specified, total size of cookies in current domain is returned (used for browsers
		 * that set limits for total size of cookies for a domain).
		 * It is a helper method used in cookie overflow detection and cleanup.
		 * @param {CookieResource} cRes defines the cookie name and its properties
		 * @return {number} size of the specified cookie
		 */
		CookieMgr.prototype.getCookieSize = function(cRes) {
			var size = 0;
			if (!cRes) {
				if (this.xd) {
					// Calculation of total cookie size for XD mode makes assumption that only cookies created by
					// IJSF cookie resources reside in vanity domain. W/o this assumption cookie size would
					// have to be requested from IFrame proxy
					for (var res in resources) {
						if (resources[res].constructor === CookieResource) {
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
		};

		/**
		 * Performs cleanup of cookies according to RTDEV-6927 guidelines:
		 * Cookies need to be limited for XD and nonXD modes. Core cookies, especially the inqVital cookie, should be
		 * protected at all times. The other cookies should be cleared in the following order and context.
		 * Two categories of cookie space violations apply here:
		 * 1. Cookie domain limit is exceeded
		 * For Domain limit violations, we need to drop cookies in presiding order until enough space is freed to allow
		 * the current cookie write. If enough space is not harvested to allow the write, we log the situation and drop
		 * the write. The following rules apply...
		 *      1a. Non-core cookies should be dropped in order of priority.
		 *      1b. inqState cookie should be cleared first if data exceeds 4k limit on IE6/7 or safari
		 *      1c. inqSession cookie should be cleared 2nd if data exceeds 4k limit on IE6/7 or safari
		 *      1d. inqVital cookie should never be cleared...if we cannot write to the cookie without exceeding the 4k limit,
		 * 	then we should abort the write and log the issue once to the tagserver.
		 * 	For #1c, if a chat is in progress...then we should abort the write rather then purge the session cookie and
		 * 	thus the chat
		 * 2. "per cookie" limit is exceeded.
		 * For "Per Cookie" violations, we drop the write and report the condition to our servers. Core cookies should
		 * not be dropped.
		 * @param {number} byteCountToFree parameter specifying how many bytes must be freed
		 * @param {number} currentCookiePriority parameter specifying the priority of the cookie that is overflowing
		 * @return {boolean} true if required space was freed, false otherwise. If false is returned, write to cookie must be
		 * aborted.
		 */
		CookieMgr.prototype.pruneCookieOnOverflow = function(byteCountToFree, currentCookiePriority) {
			var cookiesToPrune = [];
			var bytesFreed = 0;

			currentCookiePriority = (isNullOrUndefined(currentCookiePriority)?0:currentCookiePriority);
			var _resources = Object.keys(resources).map(function(k){return resources[k];}).filter(function(a){return !isNullOrUndefined(a) && a.constructor===CookieResource && (a.getPurgePriority() > currentCookiePriority); });
			_resources.sort(CookieResource.COOKIE_RESOURCE_PURGE_PRIORITY_SORT_FCN);

			for(var idx=0; idx<_resources.length; idx++){
				var resource = _resources[idx];
				// found an expendable resource
				log("************* "+resource.getResourceID()+" will be cleared.");
				// tally up the cookie bytes to be freed... continue if we don't have enough.
				bytesFreed += this.getCookieSize(resource);
				cookiesToPrune.push(resource); // axe the cookie
				if (bytesFreed >= byteCountToFree) {
					break; // stop chopping resources if we've freed enough space
				}
			}
			if(bytesFreed < byteCountToFree && currentCookiePriority==0) { // only scavenge our core cookies if/when we have freed others first.
				var stateRes = resources["state"]; // chop the state cookie
				bytesFreed +=  this.getCookieSize(stateRes);
				if (bytesFreed >= byteCountToFree) {
					cookiesToPrune.push(stateRes); // we have enough... stop chopping
				} else if (!CHM.isChatInProgress()) {
					// apparently we still need to cut, kill the
					// session cookie only if we are not in a chat
					var sesRes = resources["session"];
					bytesFreed += this.getCookieSize(sesRes);
					if (bytesFreed >= byteCountToFree) {
						cookiesToPrune.push(stateRes);
						cookiesToPrune.push(sesRes);
					}
				}
			}

			// prune what we can
			if (cookiesToPrune.length > 0) {
				// Log clearing of cookies in browser console and TS log
				var cookieNames = cookiesToPrune.collect(function(cres){ return cres.getName();});
				var msg = "Cookie overflow! Trying to clear following cookie(s): " + cookieNames.join(',') + ". ";
				log("ERROR: " + msg);
				if (!this.overflowLogged) { // log overflow to TS once per landing
					msg = prepareLoggingContext(msg);
					this.send(urls.loggingURL, {level:'ERROR', line: msg});
					this.overflowLogged = true;
				}

				for (var i = 0; i < cookiesToPrune.length; i++) {
					this.clear(cookiesToPrune[i].getResourceID());
				}
			}
			return bytesFreed >= byteCountToFree; // we report if we were successful in pruning everything requested
		};

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
			if ((name == COOKIE_PC_NAME || this.isPersistentCookiesAllowed()) && lifetime>0){
				update = name + "=" + encodeURIComponent(cVal) +
				";expires=" + expires_date.toGMTString() +
				( ( path ) ? ";path=" + path : "" ) +
				( ( domain ) ? ";domain=" + domain : "" ) +
				( ( secure ) ? ";secure" : "" );
			} else {
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
		 * @param {String} data
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
			var a_all_cookies =  (isNullOrUndefined(data)) ? document.cookie.split( COOKIE_DELIMITER ) : data.split( COOKIE_DELIMITER );
			var retval = null;

			a_all_cookies.forEach( function(cookie) {
				// now we'll split apart each name=value pair
                var delim_index = cookie.indexOf('=');

				// and trim left/right whitespace while we're at it
				var cookie_name = (delim_index > 0 ? cookie.substring(0, delim_index) : cookie).replace(/^\s+|\s+$/g, '');

                var cookie_value = '';

				// if the extracted name matches passed check_name
			    // we need to handle case where cookie has no value but exists (no = sign, that is):
				if (delim_index > 0 && delim_index < cookie.length - 1) {
                    cookie_value = decodeURIComponent( cookie.substring(delim_index + 1).replace(/^\s+|\s+$/g, '') );
                }
				if(retval==null)
					retval = {};
					// note that in cases where cookie is initialized but no value, null is returned
				retval[cookie_name] = cookie_value;
			});
			return retval;
		};

		/**
		 * @param {Object} cookieData contains a JSON object contain whole cookie values
		 * {"inqState": {...}, "inqVital": {"INQ": {...}, ...}, "inqSession": {...}}
		 */
		CookieMgr.prototype.setXDCookies = function(cookieData) {
			this.cookies = cookieData;
			if ( cookieData && cookieData.pc && cookieData.pc == 2 ) {
				this.isLSused = true;
			}
		};

		/**
		  *	Establish the listener for 3rd party cookie queue becoming empty
		  */
		CookieMgr.prototype.onThirdPartyCookieQueueEmpty = null;

		/**
		  *	Establish a collection of handlers for 3rd party cookie queue becoming empty
		  */
		CookieMgr.prototype.onThirdPartyCookieQueueEmptyHandlers = [];

		/**
		  *	Handlers can added into 3rd party cookie queue. - only one handler to keep system simple.
		  */
		CookieMgr.prototype.on3rdPartyCookieCommittedHandler = null;

		/**
		  *	Test for third party cookie queue empty and idle (no cookie saving is in progress)
		  */
		CookieMgr.prototype.isThirdPartyCookieQueueEmpty = function() {
			return (0==this.set3rdPartyCookieQueue.length) && !this.set3rdPartyCookieBusy;
		};

		 /**
	        * set3rdPartyCookie - sets third-party cookie via an iframe-proxy
	        * details:
	        *    An IFRAME with source from domain of the vanity domain performs the cookie setting on behalf of this domain.
	        *    Inq.CM.set3rdPartyCookie asks the IFRAME to set the cookie on our behalf.
		    *
		    *    Use call of Inq.FlashPeer.set3rdPartyCookieFromQueue() instead of direct call of Inq.CM.set3rdPartyCookie(...)
	        *
		    * @param   {String} cmd - command
	        * @param   {Number} site - site id
		    * @param   {String} name - cookie name
		    * @param   {Object} delta - cookie value
		    * @param   {String} path - cookie path
		    * @param   {Number} expiry - lifetime in milliseconds
            *
	        * @author  fpinn@TouchCommerce.com
	        * @see set3rdPartyCookieFromQueue
	        * @see HTML file postToServer.js which performs the cookie setting via command "SCBR3_PM" (Set Cookie BR3)
	        */

		CookieMgr.prototype.set3rdPartyCookie = function(cmd, site, name, delta, path, expiry) {
		        // Current origin:            http://www.touchcommerce.com
                // Target origin for cookies: http://home.inq.com (for example)

	            //this.initMessagingComplete = this.initMessaging();
	            if (!path) path="/";
	            if (!expiry) expiry="";
	            if(isNullOrUndefined(cmd) || isNullOrUndefined(site) || isNullOrUndefined(name)) return;

	            var boxID = "box" + Math.floor(Math.random()*1000011);
	            var port = (inqFrame.location.port != "") ? ":" + inqFrame.location.port : "";
	            var parentURL = inqFrame.location.protocol + "//"  +  inqFrame.location.hostname + port + inqFrame.location.pathname ;
				var sDelta = "";
				if (!isNullOrUndefined(delta)) {
					if (typeof delta === "object") {
						sDelta = encodeURIComponent(this.JSON.stringify(delta));
					} else {
						sDelta = "" + delta;
					}
				}

	            var postCookie = [cmd, boxID, site, parentURL, name, sDelta, path, expiry];

	            /* Put the cookie message on the queue if queue is empty
	               If queue is not empty find if the cookie (by name) is in the queue and replace it
	               The new cookie trumps the old cookie, it is it's replacement
	               If the cookie name is not in the queue then put cookie at tail of queue
	               BTW: The count for the queue will never exceed the number of cookie names
                  */
				if (0 == this.set3rdPartyCookieQueue.length)
					this.set3rdPartyCookieQueue.push({name: name, postCookie: postCookie});
				else {
					/* Look for a match, check the cookie name against the name in the queue object */
					for (var i = 0; i < this.set3rdPartyCookieQueue.length; i++) {
						if (this.set3rdPartyCookieQueue[i].name == name) {
							this.set3rdPartyCookieQueue[i].postCookie = postCookie;
							break ;
						}
					}
					/* If the queue length is equal to the index from the for-loop, then we did not find a match */
					if (i==this.set3rdPartyCookieQueue.length) {
						this.set3rdPartyCookieQueue.push({name: name, postCookie: postCookie});
					}
				}

	            /* If we are busy, leave the message queued and return */
	            if (this.set3rdPartyCookieBusy) return;

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
			  *    An IFRAME with source from domain of the vanity domain performs the cookie setting on behalf of this domain.
			  *    Inq.CM.set3rdPartyCookie asks the IFRAME to set the cookie on our behalf.
			  *
			  *    Use call of Inq.FlashPeer.set3rdPartyCookieFromQueue() instead of direct call of Inq.CM.set3rdPartyCookie(...)
              *
	          *  1) get cookie request from queue
	          *  2) if cookie request is NOT avalable THEN set busy flag to false
	          *  3) ELSE create boxID and put it in the cookie request then post the request to the IFrame-Proxy
	          *
	          * @see set3rdPartyCookie
	          * @see HTML file postToServer.js which performs the cookie setting via command "SCBR3_PM" (Set Cookie BR3)
	          */
			CookieMgr.prototype.set3rdPartyCookieFromQueue = function() {
				/** @type {Object} */
				var cookieQItem = this.set3rdPartyCookieQueue.shift();
				if (!isNullOrUndefined(cookieQItem)) {
					this.postRequestToIframeProxy(cookieQItem.postCookie, cookieQItem.postCookie[1]); /* issue request */
				} else {												/* We only get here if we have an empty cookie queue */
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
			CookieMgr.prototype.whenCookiesCommitted = function(handler) {
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

			 /**
			  * This function will add a handler into set3rdPartyCookieQueue to obey sequence.
			  * @param {Function} handler - handler to be called when committed
			  */
			CookieMgr.prototype.setWhen3rdPartyCookieCommittedHandler = function(handler) {
				if ( this.xd ) {
					try {
						var boxID = "box" + Math.floor(Math.random()*1000011);
						var port = (inqFrame.location.port!="")?":"+inqFrame.location.port:"";
						var parentURL = inqFrame.location.protocol + "//"  +  inqFrame.location.hostname + port + inqFrame.location.pathname ;
						var postCookieRequest = ["COMMITPOINT", boxID, siteID, parentURL, encodeURIComponent(urls.loggingURL)];

						if ( handler ) {
							this.on3rdPartyCookieCommittedHandler = { "vcnt": this.cookies["inqVital"]['vcnt'] , "callback" : handler } ;
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
			  * @param {Number} vcnt
			  */
			CookieMgr.prototype.when3rdPartyCookieCommitted = function(vcnt) {

				if ( null != this.on3rdPartyCookieCommittedHandler ) {
					try {
						if ( !this.isLSused || this.cntHandlerTried >= 120 || (typeof vcnt !== "undefined" && this.on3rdPartyCookieCommittedHandler["vcnt"] <= vcnt) )
						{
							this.on3rdPartyCookieCommittedHandler["callback"]();
							this.on3rdPartyCookieCommittedHandler = null;
							this.cntHandlerTried = 0;
							this.set3rdPartyCookieFromQueue();
						} else {
							this.cntHandlerTried += 1;
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
	         * postRequestToIframe - create new iframe-proxy to do some work
	         * Put the request (the command and data) in the NAME field of the new iframe
	         * details:
	         *    An IFRAME with source from domain of the vanity domain performs work specified by the request parameter.
	         *
			 * @param url - alternative path (XD mode)
	         * @param request - the command and data for the proxy-iframe to run as array
			 * @param id - iframe id (box id)
			 * @param context - callback function
	         * @author  fpinn@TouchCommerce.com
	         * @see HTML file postToServer.htm which performs the cookie setting via command in request
			 * @see authorize (cbc.js)
	         * @see checkAuthorized (cbc.js)
	         */

            CookieMgr.prototype.postRequestToIframe = function (url, request, id, context) {
                // On 1pc persistent solution, hosted file of the domain should be continuously used.
                //postRequestToIframeProxy is getting to an infinite loop .If first party cookie is solution is enabled and hostFileURLUse is null
                if (xdAutoSelect && CookieMgr.xdPsHelper.enabled && CookieMgr.xdPsHelper.hostFileURLUse) { // it's a first party cookie
                    LoadM.postRequestToIframeProxy(CookieMgr.xdPsHelper.hostFileURLUse + "?POST2SERVER", request, id, context);
				} else if (xdAutoSelect && CookieMgr.chatSessionHelper.isEnabled && CookieMgr.xdPsHelper.hostFileURLUse) {
					LoadM.postRequestToIframeProxy(CookieMgr.xdPsHelper.hostFileURLUse + "?POST2SERVER", request, id, context);
				} else {
                    LoadM.postRequestToIframeProxy(url, request, id, context);
                }
            };

			/**
			 * Defines callback function for postRequestToIframe.
			 *
			 * @param request - the command and data for the proxy-iframe to run as array
			 * @param id - iframe id (box id)
			 * @param callback - callback function
			 */
			CookieMgr.prototype.postRequestToIframeProxy = function (request, id, callback) {
                var context = {};
                context["callbackFun"] = callback || CookieMgr.processMessage;
				this.postRequestToIframe(this.getIFrameBaseURL(), request, id, context);
            };

			/**
			 *  Return iFrame base URL
			 *  Store it in this._iFrameBaseURL, change protocol to HTTPS if browser thpe is Safari and not Chrome.
			 *
			 */
			CookieMgr.prototype.getIFrameBaseURL = function() {

                if (typeof this._iFrameBaseURL == 'undefined') {
					this._iFrameBaseURL = Inq.urls.baseURL.split("/",3).join("/") ;
                    this._iFrameBaseURL = secureHTTP( this._iFrameBaseURL );
                }

                return  this._iFrameBaseURL;
			};

          CookieMgr.processMessage = function(context) {
                try {
                    if (context.eval) {
                        // for backward compatibility with old commands
                        window.eval(context.data);
                    } else {
                        ROM.onRemoteCallback(context.id, context.data);
                    }
                } catch(fault){
                    ROM.post(urls.loggingURL, {level:'ERROR', line: ('CookieMgr.processMessage>> '+catchFormatter(fault))});
                }
            };

            /**
             *
             *  1pc ps sloution: 1st party cookie - persistent solution
             *
             *  Background: Safari on iOS 7 does not provide appropriate localStorage implementation
             *  and changes are lost once you move page to page.
             *  To overcome, CookieMgr.xdPsHelper object uses 1pc ps solution
             *
             *  Requirements
             *  inqVital.vtime cookie value in number type.
             *  site.hostedfileURL must be List of fully qualified URL
             *  site.cookie policy.
             *
             */
            CookieMgr.xdPsHelper = {};
            CookieMgr.xdPsHelper.hostFileURLUse = "";
            CookieMgr.xdPsHelper.enabled = false;
            CookieMgr.xdPsHelper.isInFirstCookieProcess = false;
            CookieMgr.xdPsHelper.cntDomainsWithData = 0;
			/**
			 CookieMgr.xdPsHelper.errorCode
			 used to save error code.

			 Detail
			 ------------------------------------
			 0 = "No Error";
			 1 = "CookieMgr.xdPsHelper.requestSavedXdCookies() is called with wrong arguments";
			 2 = "Not able to find host file for the current domain, CookieMgr.xdPsHelper.hostFileURLUse is not defined";
			 */
			CookieMgr.xdPsHelper.errorCode = 0;


			/**
             *  isIos7
             *  Return True if the device is iphone or ipad and browser is Safari.
             *
             */
            CookieMgr.xdPsHelper.isIos7 = function( uagent ) {
                return /(iPad|iPhone).*OS 7/i.test( uagent ) ;
            };

            /**
             *  Return true if 1pc is enabled.
             *  Writes simple random number to cookie to check and delete it on success.
             *
             * @return {*}
             */
            CookieMgr.xdPsHelper.is1pcEnabled = function( ) {
				var COOKIE_PCTEST_NAME = "inqPctest";
                if (typeof CookieMgr.xdPsHelper.isUse1pcXdSolution.pc1Enabled == 'undefined') {
                    var value = Math.floor(Math.random()*101);
                    var expiry = (new Date( (new Date()).getTime() + (366*24*3600*1000) )).toGMTString();
                    document.cookie = COOKIE_PCTEST_NAME + "=" + value + "; path=/; expires="+expiry+";" ;
                    CookieMgr.xdPsHelper.isUse1pcXdSolution.pc1Enabled = (document.cookie.indexOf(COOKIE_PCTEST_NAME + "=" + value) !== -1);
					document.cookie = COOKIE_PCTEST_NAME + "=" + value + "; path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT";
                }
                return (CookieMgr.xdPsHelper.isUse1pcXdSolution.pc1Enabled);
            };

            /**
             *  isUse1pcXdSolution ()
             *  Return true if 1pc ps solution can be used on
             *	We also test for uiWebview so we can support Vodafone App
             */
            CookieMgr.xdPsHelper.isUse1pcXdSolution = function( ) {
                // To test iOS 7       > CookieMgr.xdPsHelper.isIos7( navigator.userAgent )
                // To test safari      > isSafari()
                // To test 1pc enabled > CookieMgr.xdPsHelper.is1pcEnabled()
				var uiWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent);
				var androidWebview = /Android.*?(wv|Version\/[.0-9]+).*?Mobile/i.test(navigator.userAgent);

				if(androidWebview) {
					// Default Internet browser on Android 4.4.2
					// doesn't support 1pc solution and this code will make it use 3pc solution.
					if( /Android 4\.4\.2/i.test(navigator.userAgent) ) return false;
				}
				/* We want to use this solution for uiWebview instances as well.
				 * The uiWebView is the safari PROCESSING_INSTRUCTION_NODE
				 */
                return (uiWebView || androidWebview || isSafari())
                    && CookieMgr.xdPsHelper.is1pcEnabled()
                    ;
            };

			/**
			 *  isUse1pcXdSolutionOnIE ()
			 *  Return true if 1pc ps solution can be used on IE
			 */
			CookieMgr.xdPsHelper.isUse1pcXdSolutionOnIE = function( ) {
				return isIE() && CookieMgr.xdPsHelper.is1pcEnabled();
			};

            /**
             *   An Array to hold domains and data.
             *   It also has functions to check if URL is valid and no duplication is found.
             */
            CookieMgr.xdPsHelper.domains2Check = [];
            CookieMgr.xdPsHelper.domains2Check.pushHostedFileUrl = function( hostedUrl ) {
                var ob = locParseUrl( hostedUrl );
                if ( ob != null && !this.contains ( ob, function ( a, b ) { return a.host == b.host; } ) ) {
                    this.push( ob );
                    CookieMgr.xdPsHelper.hostDomainCnt += 1;
                    return ob;
                }
                return false;

				/*
				 *  RTDEV-15147	Multi-level subdomain support
				 */
				function locParseUrl( hostedUrl ) {
					var subDomainSupport = false;
					var result;
					if (hostedUrl.indexOf('*') > -1) {
						subDomainSupport = true;
						hostedUrl = hostedUrl.replace('*','');
					}
					result = parseUrl(hostedUrl);
					result.subDomainSupport = subDomainSupport;
					return result;
				}
            };

            CookieMgr.xdPsHelper.domains2Check.assignDataByOrigin = function(origin, context) {
                for (var i = 0; i < this.length; i++ ) {
                    if ( this[i].origin === origin ) {
                        this[i].context = context;
                        CookieMgr.xdPsHelper.cntDomainsWithData += 1;
                    }
                }
                return null;
            };

			/**
			 *  findLastCookieData()
			 *  returns the latest data among all sub-domain cookies.
			 *
			 */
			CookieMgr.xdPsHelper.domains2Check.findEntryWithLatestCookie = function() {
				var date = null;
				var latestDate = null;
				var theobj = null;

				for (var i = 0; i < this.length; i++) {
					date = this[i] && this[i].context && this[i].context.data && getDateFromData(this[i].context.data);
					if (!isNullOrUndefined(date) && date > latestDate) {
						theobj = this[i];
						latestDate = date;
					}
				}

				if (isNullOrUndefined(theobj)) {
					for (var j = 0; j < this.length; j++) {
						if (this[j].domain == (inqFrame.location.domain ? inqFrame.location.domain : parseUrl(inqFrame.location.href).domain )) {
							theobj = this[j];
						}
					}
				}

				return theobj;

				/**
                 *  getDateFromData(data)
                 *  Return time from inqVital.vtime which should be last updated time of inqVital.
                 */
                function getDateFromData(data) {
                    var date = null;
                    var dateStr = decodeURIComponent(data);
                    var dateReg = /vtime:([0-9]*)/i;
                    if ( dateReg.test(dateStr) ){
                        date = dateReg.exec(dateStr)[1];
                    }
                    return date;
                }
            };

            /**
             *  requestSavedXdCookie:
             *  Examines all domains to the given site and find the latest cookie created.
             *
             *  Back ground info:
             *  Safari on iOS 7 does not provide access to 3pc localStorage correctly.
             *  3pc localStorage created on one main domain(parent) will lost on another main domain.
             *
             *  To work around this issue:
             *  Safari considers a sub-domain as 1pc cookie and a cookie from other doamin is always readable.
             *  Sub-domain 1pc cookie is used to persist variables and chat continues on a site page in a different domain
             *
             *  Note FF does not support sub-domain 1pc cooke.
             */
            CookieMgr.xdPsHelper.requestSavedXdCookies = function() {
                // enter finding first cookie process to get the latest cookie.
                CookieMgr.referer = window.parent.document.referrer;

                // Right now all domains are checked regardless document.referrer value
                //	if ( isNullOrUndefined( CookieMgr.referer ) || CookieMgr.referer == "" ) {

	            if ( true ) {
		            // checking all domains for the site including same domain
                    // then compare timestamp to get latest cookie entries.
                    // then call main function.
	                if ( !CookieMgr.xdPsHelper.populateDomains2Check() ) return;
                } else {
                    CookieMgr.xdPsHelper.domains2Check.pushHostedFileUrl( CookieMgr.referer );
                }

                CookieMgr.xdPsHelper.isInFirstCookieProcess = true;
                for (var i = 0; i < CookieMgr.xdPsHelper.domains2Check.length; i++ ) {
                    CookieMgr.xdPsHelper.callFirstPostRequestToIframeProxy(CookieMgr.xdPsHelper.domains2Check[i].href);
                }
            };

            // Create box id and submit xd cookie process request.
			CookieMgr.xdPsHelper.callFirstPostRequestToIframeProxy = function (hostedURL) {
                var boxID = "box" + Math.floor(Math.random()*1000011);
                var port = (inqFrame.location.port!="")?":"+inqFrame.location.port:"";
                var parentURL = inqFrame.location.protocol + "//"  +  inqFrame.location.hostname + port + inqFrame.location.pathname ;
                var postCookieRequest = ["GCBR3", boxID, null, parentURL, "no action"];
                submitPsProcessRequest(postCookieRequest, boxID, hostedURL);

                /**
                 *  submitPsProcessRequest - create new iframe-proxy to get sub-domain Cookies
                 *  local version of postRequestToIframeProxy
                 */
                function submitPsProcessRequest(request, frameId, baseUrl) {
                    /*
                     *  This will call the hosted file which will load postToServer.js file.
                     */
                    var frameSrc = baseUrl + "?POST2SERVER";
                    var context = {};
                    context["callbackFun"] = CookieMgr.xdPsHelper.processSavedXdCookie;
                    LoadM.postRequestToIframeProxy(frameSrc, request, request[1], context);
                }
			};

            /**
             *  Populates hostedUrls and CookieMgr.xdPsHelper.domains2Check
             *  hosted file URLs are used as is without Protocol change since
             *  some clients do not provide https protocol or vise versa.
             */
            CookieMgr.xdPsHelper.populateDomains2Check = function () {
                var result = false;
				var currentDomain;
                // sample: var hostedUrls = [ "http://www.touchcommerce.com/TouchCommercetop.html", "https://tc.inq.com/TouchCommercetop.html" ];
                var hostedUrls = (typeof urls.siteHostedFileURL === "string") ? urls.siteHostedFileURL.split(",") : [];
                if(hostedUrls.length > 1 || hostedUrls[0].trim() != "")  {
                    for (var j = 0; j < hostedUrls.length; j++ ) {
                        if ( CookieMgr.xdPsHelper.domains2Check.pushHostedFileUrl( hostedUrls[j].trim() ) ) {
                            // log - hostedUrls[j] has been added into CookieMgr.xdPsHelper.domains2Check[]
                        } else {
                            // log - hostedUrls[j] is NOT added into CookieMgr.xdPsHelper.domains2Check[]
                            // because hostedUrls[j] may be a duplicated hosted file in a same domain
                        }
                    }

                    // Once populated find hosted file url for the current page.
					for (var i = 0; i < CookieMgr.xdPsHelper.domains2Check.length; i++ ) {
						currentDomain = inqFrame.location.domain ? inqFrame.location.domain : parseUrl(inqFrame.location.href).domain;
						if (( CookieMgr.xdPsHelper.domains2Check[i].subDomainSupport === true && currentDomain.indexOf(CookieMgr.xdPsHelper.domains2Check[i].domain) > -1 )
							|| (CookieMgr.xdPsHelper.domains2Check[i].domain == currentDomain )
						) {
							CookieMgr.xdPsHelper.hostFileURLUse = CookieMgr.xdPsHelper.domains2Check[i].href;
							result = true;
							break;
						}
					}
                }

                if (isNullOrUndefined(CookieMgr.xdPsHelper.hostFileURLUse) || CookieMgr.xdPsHelper.hostFileURLUse == "") {
                    CookieMgr.xdPsHelper.errorCode = 2;
                    result = false;
                }
                return result;
            };



            CookieMgr.xdPsHelper.processSavedXdCookie = function(context) {
                CookieMgr.xdPsHelper.domains2Check.assignDataByOrigin(context.origin, context);
                var theob;

                // When we have cookies from all domains of a site, select latest data and start chat process.
                if ( CookieMgr.xdPsHelper.cntDomainsWithData >= CookieMgr.xdPsHelper.domains2Check.length )	{
                    theob = CookieMgr.xdPsHelper.domains2Check.findEntryWithLatestCookie();
	                var data = theob ? theob.context.data : context.data;
                    CookieMgr.xdPsHelper.isInFirstCookieProcess = false;
	                Inq.IFrameProxyCallback(data);
                }
            };

            /**
             *  firstRequestCookie: Check if 1pc ps solution can be used (mush for iOS 7)
             *  then initiate the process,
             *  or try to use conventional localStorage ps solution.
             */
            CookieMgr.firstRequestCookie = function(){
                if ( CookieMgr.xdPsHelper.isUse1pcXdSolution() ) {
                    // Use 1pc persistent XD solution.
                    CookieMgr.xdPsHelper.enabled = true;
                    CookieMgr.xdPsHelper.requestSavedXdCookies();
                } else if(window.forceFPCookie && CookieMgr.xdPsHelper.is1pcEnabled()) {
					CookieMgr.xdPsHelper.enabled = true;
					CookieMgr.xdPsHelper.requestSavedXdCookies();
                } else {
                    CM.requestCookie(function(context) {
	                    /* Forwards the context to IFrameProxyCallback handler with the correct "this" context.
	                     * When this handler is invoked, "this" is pointing to the window, not the Inq context.
	                     * @see LoadMgr.handleSuccess
	                     * We correct that by calling the IFrameProxyCallback via the anonymous function.
	                     */
	                    Inq.IFrameProxyCallback(context.data);
                    });
                }
            };

	      /**
	        * requestCookie: get the cookie datas from the third party cookies
	        * Ask an iframe-proxy to get the cookie settings
	        * An IFRAME with source from domain of the vanity domain performs the cookie retrieval on behalf of this domain.
	        *
			* @param callback - callback function
	        * @param param - param used as a prefix for the cookie names
	        * @see HTML file postToServer.htm which performs the cookie retrieval via command "GCBR3" (Get Cookie BR3)
	        *
	        */
	        CookieMgr.prototype.requestCookie = function(callback, param) {
				param = param || "";
	            var boxID = "box" + Math.floor(Math.random()*1000011);
	            var port = (inqFrame.location.port!="")?":"+inqFrame.location.port:"";
	            var parentURL = inqFrame.location.protocol + "//"  +  inqFrame.location.hostname + port + inqFrame.location.pathname ;
	            var postCookieRequest = ["GCBR3", boxID, param, parentURL, "no action"];
	            this.postRequestToIframeProxy(postCookieRequest, boxID, callback);
	        };

			/**
			 * updateCACookie
			 * Updates chatActive value of ChatMgr instance from cookie.
			 * Note: chatActive cookie is used only in "XD" mode.
			 * @param callbackFunc {function} (Required)
			 */
			CookieMgr.prototype.updateCACookie = function(callbackFunc){
				if (this.xd) {
					var param = "inqCA_"+ Inq.siteID;
					var callback = function(context) {
                        var cObj = this._getCookies(context.data);
                        this.setV3ActiveValue(cObj[param]);
						callbackFunc();
					};
                    this.requestCookie(callback.bind(this), param);
				} else {
					callbackFunc();
				}
			};

	       /**
	        * initMessaging: creates the re-usable iframe-proxies.
	        * a) Check to ensure that this initialization happens only once.
	        * b) Ensure that postMessage is available for our use
	        * c) Establish message handler for receiving posted messages
	        * d) Create a bunch of iframe-proxies for our use.
	        * @return {boolean}
	        */

	        CookieMgr.prototype.initMessaging = function(){
	            if (this.initMessagingComplete) return true;
				/* Publish the proxy error routine
				 * BTW: This is how GWT does it,
				 * this way we do not have to put it in FlashPeer,
				 */
	            Inq["proxyError"] = this.proxyError;
				return true;
	        };

		/**
		 * Function proxyError - Logs the stack trace into the tag server log
		 * The stack trace is sent to the tagserver via POST not GET
		 *  this is necessary do to the size of the trace.
		 * Please see new ROM.send command
		 * @param {String} errorText - the text describing the error
		 */
		CookieMgr.prototype.proxyError = function(errorText) {
            ROM.postToServer(urls.loggingURL, {level:"ERROR", line: encodeURIComponent(errorText)});
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
		 * isPersistentCookiesAllowed is to know weather the browser accepts persistent cookies or not
		 *
		 * In some browsers users can select the option of not accepting persistent cookies.
		 * This function helps to cross check if the browser accepts persistent cookies or not.
		 *
		 */
		CookieMgr.prototype.isPersistentCookiesAllowed = function() {
			if (isNullOrUndefined(this.isPersistentCookiesEnabled)) {
				var pcVar = new Variable(PERSISTENT_COOKIE_ALLOWED, {}, resources[PERSISTENT_COOKIE_ALLOWED]);
				pcVar.setValue({});
				var enabled = !!this.read(resources[PERSISTENT_COOKIE_ALLOWED], PERSISTENT_COOKIE_ALLOWED);

				if (enabled) {
					CM.expireCookie(PERSISTENT_COOKIE_ALLOWED);
				}
				this.isPersistentCookiesEnabled = enabled;
			}
			return this.isPersistentCookiesEnabled;
		};

		CookieMgr.isSessionCookiesEnabled = null;
		/**
		 * Return true if session cookie is enabled in browser.
		 * Note This test does not tell persistent cookie status.
		 *
		 */
		CookieMgr.isSessionCookiesAllowed = function() {
			if (CookieMgr.isSessionCookiesEnabled == null) {

				var c_value = Math.floor(Math.random()*1001), c_name = 'sPc';

				CookieMgr.isSessionCookiesEnabled = false;
				document.cookie=c_name + "=" + c_value;

			    if ((document.cookie.indexOf(c_name) != -1) && (document.cookie.indexOf(c_value) != -1)) {
		    		CookieMgr.isSessionCookiesEnabled = true;
		    		document.cookie=c_name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
			    }
			}
			return CookieMgr.isSessionCookiesEnabled;
		};

		CookieMgr.prototype.getV3ActiveValue = function() {
			return this.cookies["inqCA"];
		};

		CookieMgr.prototype.setV3ActiveValue = function(value) {
			if (!this.cleaningDetected) {
				this.cookies["inqCA"] = value;
			}
		};

		/**
		 * Add the handler on "storage" event to track the changes of local storage,
		 *    and track the case when clearing of storage leads to removing data of chat session.
		 *    For example, when user clears the all cookies and data in browser.
		 *
		 * @see CookieMgr.prototype.onStorageChange
		 */
		CookieMgr.prototype.configureStorageListener = function() {
			if (storageAvailable("localStorage")) {
				this.setStorageTracker();
				attachListener(window, "storage", this.onStorageChange.bind(this), false);
			}
		};

		/**
		 * Set the beacon to track the "storage" event.
		 * It is needed only if the local storage is empty,
		 * because if local storage is empty then event "storage" will be not fired.
		 * Will use the "sessionStorage" because we don't need to have a persistent value for tracking.
		 */
		CookieMgr.prototype.setStorageTracker = function() {
			if (localStorage.length == 0) {
				localStorage.setItem("inqTracking", 0);
			}
		};

		/**
		 * Fired on storage event and calls the function to validate the current cookie state.
		 *
		 * @see CookieMgr.prototype.configureStorageListener
		 * @see CookieMgr.prototype.checkCookieValidity
		 * @this CookieMgr
		 * @param {Object} e - The storage event (StorageEvent) is fired when a storage area
		 *                     (localStorage or sessionStorage) has been modified.
		 * @returns {void}
		 */
		CookieMgr.prototype.onStorageChange = function(e) {
			this.checkCookieValidity();
			this.setStorageTracker();
		};

		/**
		 *   Checks the state of chat on the page and if chat is active
		 * and when earlier on this chat session cookie cleaning was not detected,
		 * then requests the cookie value from iframe and validates it by the callback.
		 *
		 *   The cookie saved mainly in the 3rd party domain,
		 * but anyway we working with them by proxy iframe,
		 * thus we can validate it only asynchronously.
		 * Therefore the validation will be done in the callback.
		 *
		 * @see CookieMgr.prototype.requestCookie
		 * @see CookieMgr.prototype.cookieValidationCallback - this is a callback function
		 * @returns {void}
		 */
		CookieMgr.prototype.checkCookieValidity = function() {
			if (!this.cleaningDetected && CHM.isChatInProgress()) {
				this.requestCookie(this.cookieValidationCallback.bind(this));
			}
		};

		/**
		 * Checks that the previous value of the cookie matches the current state of CookieMgr.
		 * If not - then sends the log-error to TagServer about invalid cookie state.
		 *
		 * @this CookieMgr
		 * @param {Object} context - see LoadMgr.getContext
		 */
		CookieMgr.prototype.cookieValidationCallback = function(context) {
			/* Check the state of chat (the chat activity)
			 * and the detection of cookie cleaning during the chat session,
			 * to avoid the duplication of logging error,
			 * because this function is invoked asynchronously,
			 * and thus can be invoked multiple times till the processing.
			 */
			if (!this.cleaningDetected && CHM.isChatInProgress()) {
				/** @type {object} */
				var cookies = {};
				/** @type {object} */
				var cookieSource = this._getCookies(context.data);
				for (var name in cookieSource){
					var value = cookieSource[name];
					if (value){
						var cookieName = name.replace(/_\d+$/, "");
						if (cookieName == "JSESSIONID" || cookieName === "inqCA" || cookieName === "inqLT") {
							cookies[cookieName] = value;
						} else {
							try {
								cookies[cookieName] = MixIns.JSON.parse(value);
							} catch(e) {
								// This error is not matter because
								// some foreign cookies can contain the unexpected value,
								// e.g., in case of 1pc solution.
								// Continue looping to parse all other cookies.
							}
						}
					}
				}

				if (getCustIDfromCookieObject(this.cookies) != getCustIDfromCookieObject(cookies)
					|| getChatIDfromCookieObject(cookies)
					&& getChatIDfromCookieObject(this.cookies) != getChatIDfromCookieObject(cookies)
				) {
					this.cleaningDetected = true;
					// need to close chat monitor to avoid the updating of cookie in postToServer.js
					CHM.closeChatMonitor();
					var expiry = 24 * 3600 * 1000;

					for (var cName in this.cookies) {
						if (cName == "inqCA" || cName == "inqLT") {
							// ignore cookies value because they are updated only in the postToServer IFrame
							continue;
						}
						this.set3rdPartyCookie("SCBR3_PM", getSiteID(), cName, null, null, -1 * expiry);
					}
					for (var keyName in cookies) {
						if (keyName === COOKIE_PC_NAME || keyName === COOKIE_COBROWSE) {
							// ignore COOKIE_PC_NAME cookie value, because it's not really existing,
							// "inqPc"
							// see 'doGCBR3Command' in postToServer
							// and COOKIE_COBROWSE ("cobrowse"), because it is updated from cbc.js without encoding
							continue;
						}
						this.set3rdPartyCookie("SCBR3_PM", getSiteID(), keyName, cookies[keyName], null, expiry);
					}
  					logErrorToTagServer("Detected clearing of cookies in the active chat [" + prepareLoggingContext() + "]");
				}
			}

			/**
			 * Returns the value of customer ID from cookie object "inqVital".
			 * @returns {string|undefined} customer ID
			 */
			function getCustIDfromCookieObject(cookies) {
				return cookies["inqVital"]
					&& cookies["inqVital"].INQ
					&& cookies["inqVital"].INQ.custID;
			}

			/**
			 * Returns the value of engagement ID from cookie object "inqSession".
			 * @returns {string|undefined} chat ID (engagement ID)
			 */
			function getChatIDfromCookieObject(cookies) {
				return cookies["inqSession"]
					&& cookies["inqSession"].CHM
					&& cookies["inqSession"].CHM.chat
					&& cookies["inqSession"].CHM.chat.id;
			}
		};

        var COOKIE_DELIMITER = ';';

		CookieMgr.chatSessionHelperIsChatInProgress = function() {
			return CookieMgr.chatSessionHelper.isChatInProgress();
		};

		CookieMgr.isCachePersistentEnabled = function () {
			return CookieMgr.chatSessionHelper.isEnabled;
		};

/**
 * Cached Persistent Solution Helper
 *
 * @type {{initCustomerCachedId: CookieMgr.chatSessionHelper.initCustomerCachedId, initCustomerCachedIdCallBack: CookieMgr.chatSessionHelper.initCustomerCachedIdCallBack, readServerSavedChatInfo: CookieMgr.chatSessionHelper.readServerSavedChatInfo, cookieOnTS: null, cookieOnTSFixed: null, hasCookieOnTS: boolean, cookieOnTSDate: null, isV3Continue: boolean, readServerSavedChatInfoCallBack: CookieMgr.chatSessionHelper.readServerSavedChatInfoCallBack, cookie1pcXd: null, hasCookie1pcXd: boolean, cookie1pcXdDate: null, readingXdCookieTSSaved: boolean, is1pcCookieReadTried: boolean, read1SPCCallBack: CookieMgr.chatSessionHelper.read1SPCCallBack, read1SPC: CookieMgr.chatSessionHelper.read1SPC, isEnabled: boolean, customerId: null, buildCookieFromAPI: CookieMgr.chatSessionHelper.buildCookieFromAPI, getJobjFromXmlData: CookieMgr.chatSessionHelper.getJobjFromXmlData}}
 */
CookieMgr.chatSessionHelper = {
	/**
	 * This function makes request customer id to Tagserver and response (customer id) is cached used as key
	 * cached customer id is returned when a user navigate to different domain.
	 */
    initCustomerCachedId: function () {
        LoadM.postRequestToIframeProxy(Inq.urls.vanityURL, ["POSTCHAT", 'initCustomerCachedId', "", CookieMgr.xdPsHelper.hostFileURLUse, Inq.urls.vanityURL + "/tagserver/launch/initCustCachedId", "", 45000], 'initCustomerCachedId', {"callbackFun": CookieMgr.chatSessionHelper.initCustomerCachedIdCallBack});
    },

	/**
	 * Received Customer Id, next read 1pc (may be a sibling domian)
	 * @param data
     */
    initCustomerCachedIdCallBack: function (data) {
		CookieMgr.chatSessionHelper.customerId = data.data.custId;
		CookieMgr.chatSessionHelper.read1SPC(CookieMgr.xdPsHelper.hostFileURLUse);
    },
	/**
	 * send chat info request to Tagserver with customer id
	 */
    readServerSavedChatInfo: function () {
        if (null != CookieMgr.chatSessionHelper.customerId) {
            LoadM.postRequestToIframeProxy(Inq.urls.vanityURL, ["POSTCHAT", 'readChatSession', "", CookieMgr.xdPsHelper.hostFileURLUse, Inq.urls.vanityURL + "/tagserver/launch/readChatOnCustomerCachedId", "custId=" + CookieMgr.chatSessionHelper.customerId + "&siteId=" + getSiteID(), 45000], 'readChatSession', {"callbackFun": CookieMgr.chatSessionHelper.readServerSavedChatInfoCallBack});
        }
    },

    cookieOnTS: null,
    cookieOnTSFixed: null,
    hasCookieOnTS: false,
    cookieOnTSDate: null,
    isV3Continue: false,
	/**
	 * handel chat information from Tagserver
	 * @param data
     */
    readServerSavedChatInfoCallBack: function (data) {
        CookieMgr.chatSessionHelper.hasCookieOnTS = true;
        CookieMgr.chatSessionHelper.cookieOnTS = data;
        CookieMgr.chatSessionHelper.cookieOnTSDate = getDateFromData(data.data);
        CookieMgr.chatSessionHelper.cookieOnTSFixed = {
            eval: true,
            data: data.data,
            origin: data.origin,
            id: data.id,
            callbackFun: data.callbackFun
        };

        CookieMgr.chatSessionHelper.isEnabled = true;
        CookieMgr.chatSessionHelper.isV3Continue = true;

        Inq.IFrameTSCallback(CookieMgr.chatSessionHelper.cookieOnTSFixed);

        function getDateFromData(data) {
            var date = null;
            var dateStr = data.data; // unescape(decodeURIComponent(data));
            var dateReg = /vtime:([0-9]*)/i;
            if (dateReg.test(dateStr)) {
                date = dateReg.exec(dateStr)[1];
            }
            return date;
        }
    },

    cookie1pcXd: null,
    hasCookie1pcXd: false,
    cookie1pcXdDate: null,
    readingXdCookieTSSaved: false,
    is1pcCookieReadTried: false,
    /*
     Callback function of read 1st Sibling Party Cookies
     */
    read1SPCCallBack: function (ev) {
        CookieMgr.chatSessionHelper.is1pcCookieReadTried = true;
        CookieMgr.chatSessionHelper.hasCookie1pcXd = true;
        CookieMgr.chatSessionHelper.cookie1pcXd = ev;
        var date = getDateFromData(ev.data);

        if( date != null && top.document.referrer && parseUrl(top.document.referrer).domain == parseUrl(inqFrame.location.href).domain ) {
	        Inq.IFrameProxyCallback(ev.data);
        } else {
            CookieMgr.chatSessionHelper.referrer = top.document.referrer;
            // Get
            CookieMgr.chatSessionHelper.readServerSavedChatInfo();
        }

        function getDateFromData(data) {
            var date = null;
            var dateStr = decodeURIComponent(data);
            var dateReg = /vtime:([0-9]*)/i;
            if (dateReg.test(dateStr)) {
                date = dateReg.exec(dateStr)[1];
            }
            return date;
        }
    },

    /*
     Test 2, test if 2spc is enabled and have saved data.
     @see IFrameProxyCallback - caller.
     @see IFrameProxyCallback - callBack.
     */
    read1SPC: function (hostedURL) {
        var boxID = "box" + Math.floor(Math.random() * 1000011);
        var port = (inqFrame.location.port != "") ? ":" + inqFrame.location.port : "";
        var parentURL = inqFrame.location.protocol + "//" + inqFrame.location.hostname + port + inqFrame.location.pathname;
        var postCookieRequest = ["GCBR3", boxID, null, parentURL, "no action"];
        submitPsProcessRequest(postCookieRequest, boxID, hostedURL);

        /**
         *  submitPsProcessRequest - create new iframe-proxy to get sub-domain Cookies
         *  local version of postRequestToIframeProxy
         */
        function submitPsProcessRequest(request, frameId, baseUrl) {
            /*
             *  This will call the hosted file which will load postToServer.js file.
             */
            var frameSrc = baseUrl + "?POST2SERVER";
            var context = {};
            context["callbackFun"] = CookieMgr.chatSessionHelper.read1SPCCallBack;
            LoadM.postRequestToIframeProxy(frameSrc, request, request[1], context);
        }
    },

    isEnabled: false,
	isPersistentChat: false,
    customerId: null,
	/**
	 * This has minimum cookie value and replaces with chat info received from Tagserver
	 * @param {Object} currentCookiesObject
	 * @param data
	 * @returns {*}
     */
    buildCookieFromAPI: function (currentCookiesObject, data) {
        var engagement = {};
        if( !data ) {
            return currentCookiesObject;
        } else {
            if ( data.engagements && data.engagements.length > 0 ) {
				engagement = data.engagements[0];
			} else {
				engagement = CookieMgr.chatSessionHelper.getJobjFromXmlData(data);
				if( !engagement.engagementID ) {
					return currentCookiesObject;
				}
			}
		}
		// Get Engaged Chat Id, Start build chat.
		CookieMgr.chatSessionHelper.isContinueChat = true;

        if (engagement.persistent === "true") {
            CookieMgr.chatSessionHelper.isPersistentChat = true;
        }

        setParam(currentCookiesObject, "inqVital.INQ.custID", CookieMgr.chatSessionHelper.customerId);

        var sessionID = CookieMgr.chatSessionHelper.customerId + "1";
        setParam(currentCookiesObject, "inqVital._iID", sessionID);
        setParam(currentCookiesObject, "inqSession._ssID", sessionID);

        setParam(currentCookiesObject, "inqSession.CHM.chat.id", engagement.engagementID);
        setParam(currentCookiesObject, "inqSession.chat.id", engagement.engagementID);
        setParam(currentCookiesObject, "inqSession._ecID", engagement.engagementID);
        setParam(currentCookiesObject, "inqSession._icID", engagement.engagementID);

        setParam(currentCookiesObject, "inqSession.chat.buID", engagement.businessUnits[0].businessUnitID);
        setParam(currentCookiesObject, "inqVital.CHM.lastChat.businessUnitID", engagement.businessUnits[0].businessUnitID);

        var brID = parseInt(engagement.businessRuleID);
        setParam(currentCookiesObject, "inqSession.CHM.chat.ruleID", brID);
        setParam(currentCookiesObject, "inqSession.chat.ruleID", brID);
        setParam(currentCookiesObject, "inqVital.CHM.lastChat.brID", brID);

        var rule = BRM.getRuleById(brID);
        setParam(currentCookiesObject, "inqSession.chat.chatType", rule ? rule.ruleType : "C2C");

        setParam(currentCookiesObject, "inqSession.chat.agID", engagement.agentGroups[0].agentGroupID);
        setParam(currentCookiesObject, "inqVital.CHM.lastChat.agentGroupID", engagement.agentGroups[0].agentGroupID);

        setParam(currentCookiesObject, "inqSession.chat.agName", engagement.agentGroups[0].agentGroupName);
        setParam(currentCookiesObject, "inqVital.CHM.lastChat.agentGroupName", engagement.agentGroups[0].agentGroupName);

        setParam(currentCookiesObject, "inqSession.CHM.chat.aid", engagement.owningAgent);
        setParam(currentCookiesObject, "inqSession.chat.aid", engagement.owningAgent);
        setParam(currentCookiesObject, "inqSession.agID", engagement.owningAgent);
        setParam(currentCookiesObject, "inqVital.CHM.agentID", engagement.owningAgent);

        setParam(currentCookiesObject, "inqSession.pc", CookieMgr.chatSessionHelper.isPersistentChat);
        setParam(currentCookiesObject, "inqSession.chat.pC", CookieMgr.chatSessionHelper.isPersistentChat);

        var lfltDate = (new Date).getTime();
        setParam(currentCookiesObject, "inqSession.chat.ci.lf", lfltDate);
        setParam(currentCookiesObject, "inqSession.chat.ci.lt", lfltDate);

        if (engagement.saleQualified === "true") {
            setParam(currentCookiesObject, "inqVital._ss", "assisted");
        }

        //create new field if it is not exist in the object
        setParam(currentCookiesObject, "inqSession.chat.ci.msgcnt", 1, true);
        setParam(currentCookiesObject, "inqSession.chat.aMsgCnt", 0, true);
        setParam(currentCookiesObject, "inqSession.chat.cMsgCnt", 0, true);

        setParam(currentCookiesObject, "inqSession.chat.ci.c", 1, true);
        setParam(currentCookiesObject, "inqSession.chat.ci.eng", true, true);

        // Set opener script count value to 1 if there are no cntOS cookie.
        // Without this cookie the opener scripts won't be loaded on a new domain page
        setParam(currentCookiesObject, "inqSession.chat.ci.cntOS", 1, true);

        //Set xmlSpec parameters, if they are undefined
        if (!paramExists(currentCookiesObject, "inqSession.chat.xmlSpec.chatTheme.id")) {
			var actionFcn = "";
			var chatSpec;
			var chatThemeSpec;
			var c2cId;

			for (var j = 0; j < reDat.rules.length; j++) {
				if (reDat.rules[j].id == engagement.businessRuleID) {
					actionFcn = reDat.rules[j].actionFcn.toString();
					break;
				}
			}

			/*
			 * RTDEV-16133
			 * If could not find chat spec in the rule, find the c2cId and get the chat spec and theme from
			 * MediaMgr (MM) using the c2cId.
			 */
			if (!/chatSpec:\{id:(\d*),/.test(actionFcn)) {
				if (/\{id:(\d*)/.test(actionFcn)) {
					c2cId = /\{id:(\d*)/.exec(actionFcn)[1];
					if (c2cId) {
						chatSpec = MM.getC2CSpec(c2cId).chSpId;
						if (chatSpec) {
							chatThemeSpec = MM.getChatSpec(chatSpec).ctId
						}
					}
				}
			} else {
				chatSpec = /chatSpec:\{id:(\d*),/.exec(actionFcn)[1];
				if (chatSpec != null) {
					chatThemeSpec = site.mediaMgrData().chatSpecs[chatSpec].ctId;
				}
			}

            setParam(currentCookiesObject, "inqSession.chat.xmlSpec.id", parseInt(chatSpec), true);
            setParam(currentCookiesObject, "inqSession.chat.xmlSpec.chatTheme.id", parseInt(chatThemeSpec), true);
        }

        return currentCookiesObject;

        /**
         * Creates or sets parameter paramName in the obj variable.
         * @param {object} obj - target object.
         * @param {string} paramName - path to parameter, where the symbol "." is delimiter.
         * @param {*} value - value of the parameter.
         * @param {boolean} createOnly - the existing parameter in the obj won't be overridden if it set to true.
         */
        function setParam(obj, paramName, value, createOnly) {
            // @type {string}
            var params = paramName.split(".");
            var currObj = obj;
            for (var i = 0; i < params.length -1; i++) {
                if (isNullOrUndefined(currObj[params[i]])) {
                    currObj[params[i]] = {};
                }
                currObj = currObj[params[i]];
            }

            if (currObj[params[params.length - 1]] === undefined || !createOnly) {
                currObj[params[params.length - 1]] = value;
            }
        }

        /**
         * Checks if variable obj contains parameter described in the paramName variable.
         * @param {object} obj - object which can contain variable described in the second parameter.
         * @param {string} paramName - path to parameter, where the symbol "." is delimiter.
         * @returns {boolean} - true if parameter exists, false in other case.
         */
        function paramExists(obj, paramName) {
            // @type {string}
            var params = paramName.split(".");
            var currObj = obj;
            for (var i = 0; i < params.length - 1; i++) {
                if (isNullOrUndefined(currObj[params[i]])) {
                    return false;
                }
                currObj = currObj[params[i]];
            }
            return currObj[params[params.length - 1]] !== undefined;
        }
    },
	isContinueChat: false,
	/**
	 * Build engagement object from xml chat data.
	 * @param xmlData
	 * @returns {{}}
     */
	getJobjFromXmlData: function (xmlData) {
		var engagement = {};

		try {
			engagement.engagementID = /\<engagement id="(\S+)"\>/.exec(xmlData)[1];
			engagement.businessUnits = [{businessUnitID: /\<businessUnit name=".*" id="(\d+)"\>/.exec(xmlData)[1]}];
			engagement.businessRuleID = /\<businessRuleID\>(\d+)\<\/businessRuleID\>/.exec(xmlData)[1];

			engagement.agentGroups = [{
				agentGroupID: /\<agentGroupID\>(\d*)\<\/agentGroupID\>/.exec(xmlData)[1],
				agentGroupName: /\<agentGroupName\>(.*)\<\/agentGroupName>/.exec(xmlData)[1]
			}];
			engagement.owningAgent = /\<agentRef id="(\S*)" alias/.exec(xmlData)[1];
			engagement.siteID = /\<extracolumn name="siteID"\>(\d*)\<\/extracolumn\>/.exec(xmlData)[1];
			engagement.persistent = /\<persistent\>(\S*)\<\/persistent\>/.exec(xmlData)[1];
			engagement.saleQualified = /\<saleQualified\>(\S*)\<\/saleQualified\>/.exec(xmlData)[1];
		} catch (err) {
			log("ERROR: Not able to parse Chat info in XML from RealTime");
		}
		return engagement;
	},
	isChatInProgress : function() {
		return ( CookieMgr.chatSessionHelper.isEnabled === true && CookieMgr.chatSessionHelper.isPersistentChat );
	}
};