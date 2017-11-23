
	/**
	 * Logs provided string to browser console.
	 * Regards JSLoggingDisabled switch set in Admin.
	 * @param s string to log
	 */
	function log(s, severity) {
		if (!JSLoggingDisabled) {
			if (typeof console != "undefined") {
                if (typeof severity != "string")  severity = "log";
                if (console[severity]) { // if not defined, fallback to console.log()
                    // Note, the Chrome browser requires "this" to be the "window.console" object.
                    // This requirement is fulfilled since this function is global.
                    console[severity](s);
                } else if (console.log) {
                    console.log(severity.toUpperCase() + ": " + s);
                }
            }
		}
	}


	function fireCustomEvent(eventName, data, rule){
		try{
			EVM.fireCustomEvent(eventName, rule, data);
		}catch(err){
			logErrorToTagServer("External custom event("+eventName+") fire failure (siteID="+siteID+"): "+err);
		}
	}

	/**
	 * Sends error message to TS. Regards JSLoggingDisabled switch set in Admin.
	 * @param errMsg message to be logged in TS log as an error.
	 */
	function logErrorToTagServer(errMsg) {
		log(errMsg);
		if (!JSLoggingDisabled) {
			ROM.post(urls.loggingURL, {level:"ERROR", line: errMsg});
		}
	}

	/**
	 * Logs a rule action error. Error may occure at evaluation of rule condition or execution of rule actions.
	 * Sends error details to TS.
	 * Regards JSLoggingDisabled switch set in Admin.
	 * @param e error to report
	 * @param rule error to report
	 */
	function logActionErr(e, rule) {
		if (!JSLoggingDisabled) {
			var errMsg = catchFormatter(e);
			var errStr = "Error in " + rule + ".";
			log(errStr + " ChatID = " + CHM.getChatID() + ". CustomerID = " + getCustID());
			logErrorToTagServer(errStr + " \n" + errMsg);
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
	 * @param val, value to be escaped
	 * @param quote, optional character (or string) to be used as a quote
	 */
	function toJsString(val, quote)	{
		var value = val ;
		value = value.split("\\").join("\\\\") ;
		value = value.split("\"").join("\\\"") ;
		value = value.split("\'").join("\\\'") ;
		value = value.split("\n").join("\\n") ;
		value = value.split("\r").join("\\r") ;
		value = value.split("\t").join("\\t") ;
		if (quote)
			value = quote + value + quote ;
		return value ;
	}

	function isPersistentWindow(){
		try{
			return window.parent.name=="_inqPersistentChat";
		}catch(err){
			return false;
		}
	}

	function rand(low, high, roundToNearestIntegerFlag) {
		if (high < low) {
			throw ("Incorrect bounds for random generator: low = " + low + ", high = " + high);
		}
		var delta = high - low;
		var res = (!!roundToNearestIntegerFlag)?(Math.floor(Math.random()*(delta+1))+low):(Math.random() * delta + low);
		return res;
	}

	function typeOf(value) {
		var s = typeof value;
		if (s === 'object') {
			if (value) {
				if (typeof value.length === 'number' &&
					!(value.propertyIsEnumerable('length')) &&
					typeof value.splice === 'function') {
					s = 'array';
				}
			} else {
				s = 'null';
			}
		}
		return s;
	}

	/**
	 * Obtains a list of dom elements by class name they sport. Given a node, it will iterate
	 * through all children of that node and collecting those sporting the given class name.
	 * @param classname {String} The name of the class to seek.
	 * @param node The node on which to start the search. If undefined or null, the document
	 * body is chosen for the resolved window context is chosen by default.
	 * @param winCtxt The document window in which to search.
	 * If undefined or null, the globally defined "win" context is chosen by default.
	 * @return {Array} array of dom elements found. May be empty, never null.
	 */
	function getElementsByClassName(classname, node, winCtxt)  {
		if(!node){
			winCtxt = !!winCtxt?winCtxt:win;
			node = winCtxt.document.getElementsByTagName("body")[0];
		}
		var a = [];
		var re = new RegExp('\\b' + classname + '\\b');
		var els = node.getElementsByTagName("*");
		for(var i=0,j=els.length; i<j; i++){
			if(re.test(els[i].className)){
				a.push(els[i]);
			}
		}
		return a;
	}

	function exists(o) {
		return ((typeof o != "undefined") && (o != null));
	}

	/**
	 * Returns true if passed parameter is null or undefined.
	 * @param any object or variable
	 * @return true if passed parameter is null or undefined
	 */
	function isNullOrUndefined(val) {
		return(val == null || typeof(val) == "undefined");
	}

	/**
	 * Check if current browser is IE
	 * @return true if IE
	 */
	function isIE() {
		return window.navigator.appName == "Microsoft Internet Explorer";
	}

	/**
	 * Check if current browser is FF
	 * @return true if FF
	 */
	function isFF() {
		return window.navigator.userAgent.indexOf("Firefox") >= 0;
	}

	/**
	 * Check if current browser is Opera
	 * @return true if Opera
	 */
	function isOpera() {
		return window.navigator.userAgent.indexOf("Opera") >= 0;
	}

	/**
	 * Check if current browser is Chrome
	 * @return true if Chrome
	 */
	function isChrome() {
		return window.navigator.userAgent.indexOf("Chrome") >= 0;
	}

	/**
	 * Check if current browser is Safari.
	 * @return true if Safari.
	 */
	function isSafari() {
		var safariMatch = window.navigator.userAgent.match(/Safari/);
		return (safariMatch != null && safariMatch.length > 0);
	}

	/**
	 * Returns abbreviated browser type IJSF is currently running in: one of CHROME, OPERA, SAFARI, IE, FF.
	 * @return browser type. If browser is not supported no value is returned.
	 */
	function getClientBrowserType() {
		if (isIE()) {
			return "IE";
		} else if(isFF()) {
			return "FF";
		} else if(isChrome()) {
			return "CHROME";
		} else if(isOpera()) {
			return "OPERA";
		} else if(isSafari()) {
			return "SAFARI";
		}
	}

	/**
	 * Returns browser major version.
	 * Note: Now used only to determine cookie limits and thus supports only IE browsers as only IE has different
	 * limits in different versions IJSF supports.
	 * @return browser major version or 0 if unable to detect.
	 */
	function getBrowserMajorVer() {
		var ver = 0;
		if (isIE()) {
			var ind = window.navigator.userAgent.indexOf("MSIE ");
			ver = parseInt(window.navigator.userAgent.substring(ind + 5));
		}

		return ver;
	}

	/* As documented on Confluence: http://dev.inq.com/confluence/display/dev/Cookie+size+limits */
	var COOKIE_SIZE_LIMITS = {
		"IE6": 4095,
		"IE7": 4095,
		"IE8": 5118,
		"IE9": 5118,
		"FF": 4097,
		"SAFARI": 4093,
		"CHROME": 4095
	}

	/* As documented on Confluence: http://dev.inq.com/confluence/display/dev/Cookie+size+limits */
	var COOKIE_TOTAL_SIZE_LIMITS = {
		"IE6": 4095,
		"IE7": 4095,
		"IE8": 10236,
		"IE9": 10236,
		"FF": 614550,
		"SAFARI": 4093,
		"CHROME": 732280
	}

	/**
	 * Returns cookie size limit for current browser.
	 * @return cookie size limit for current browser or 0 if limit is not defined for current browser.
	 */
	function getCookieSizeLimit() {
		var browserType = getClientBrowserType();
		var limit = COOKIE_SIZE_LIMITS[browserType];
		if (isNullOrUndefined(limit)) {
			limit = COOKIE_SIZE_LIMITS[browserType + getBrowserMajorVer()];
		}
		return limit;
	}

	/**
	 * Returns total cookie size limit (per domain) for current browser.
	 * @return total cookie size limit (per domain) for current browser.
	 */
	function getCookieTotalSizeLimit() {
		var browserType = getClientBrowserType();
		var limit = COOKIE_TOTAL_SIZE_LIMITS[browserType];
		if (isNullOrUndefined(limit)) {
			limit = COOKIE_TOTAL_SIZE_LIMITS[browserType + getBrowserMajorVer()];
		}
		return limit;
	}

	function getStackTrace(err) {
		try {
			var callstack = [];
			if (arguments && arguments.callee && arguments.callee.caller) {
				var fnctn = arguments.callee.caller.caller;
				while (fnctn) {
					if (callstack.length > 32)
						break;
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

	/**
	 * Logging is ambiguous on the TS without chatID, custID, siteID etc.
	 * This function makes log message meaningful by adding context variables to the message.
	 * @param msg message string to be supplemented with context data
	 * @return message string supplemented with context data such as customer id etc
	 */
	function prepareLoggingContext(msg){
		var result = msg;
		if (!result) result = "";
		var o = {};
		try {o["chatID"] = "" + CHM.getChatID();}catch(e){}
		try {o["custID"] = Inq.custID;}catch(e){}
		try {o["custIP"] = Inq.custIP;}catch(e){}
		try {o["siteID"] = Inq.siteID;}catch(e){}
		try {o["pageID"] = LDM.getPageID();}catch(e){}
		for (var itm in o) {
			try{
				result += itm + ": " + ("" + o[itm]) + "; ";
			}
			catch(e){
				result += itm + ": " + formatArgument(o[itm]) + "; ";
			}
		}
		return result;
	}

	function catchFormatter(err){
		try {
			var desc = "\t";
			if (err && err.message) {
				desc += err.message + ". ";
			} else {
				desc += "Throw while processing. ";
			}
			desc += prepareLoggingContext();
			desc += "\n\t" + getStackTrace(err);
			return encodeURIComponent(desc) ;
		}
		catch (e) {
			return "";
		}
	}


	function safe(id, dflt, sendErrorToTagServer){
		if(id){
			try{
				var o = win.eval(id);
				if(isNullOrUndefined(o)){
					return o;
				}
				else if(typeOf(o)=="array"){
					return Array.clone(o);
				} else if (o.getTime) { // Date marker check
					if (!o.equals) { // a check to make sure that not yet mixed in
						MixIns.prepare(o).mixIn(DateMixIn);
					}
				} else if (o.toExponential) { // Number marker check
					if (!o.inRange) { // a check to make sure that not yet mixed in
						MixIns.prepare(o).mixIn(NumberMixIn);
					}
				}

				return o;
			}catch(err){
                if(sendErrorToTagServer) {
                    logErrorToTagServer(err);
                }
			}
		}
		return dflt;
	}

    function processReceivedExternalDataThrows(id, dflt) {
        return safe(id, dflt, true);
    }

    /* Returns true if supplied object is an empty object i.e. {}.
      * @return true if supplied object is an empty object i.e. {}.
      */
	function isEmptyObject(obj){
		for(var i in obj) { return false;}
		return true;
	}

    function normalizeProtocol(url) {
        var URL_REGEXP_IS_CONTAINS_PROTOCOL = new RegExp("^[0-9A-z\\.\\+\\-]*:|^//");
        if (url == null || url.length == 0) {
            return url;
        } else if (url.match(URL_REGEXP_IS_CONTAINS_PROTOCOL)) {
            return url.replace(/^HTTPS?:/i, win.location.protocol);
        } else {
            return win.location.protocol + "//" + url;
        }
    }


	/* Moves the current date objects time forward or backward by number of provided MS. Function returns the rolled Date object. */
	Date.prototype.roll = function(rollTimeInMS) {
		/* RU */
		this.setTime(this.getTime() + rollTimeInMS);
		return this;
	};

	/* Returns time diff between instance and given Date object in MS. Returns negative value if future date is passed in. */
	Date.prototype.diff = function(otherDate) {
		/* RU */
		return this.getTime() - otherDate.getTime();
	};

	/* Returns true if this object represents point in time earlier than specified Date object. */
	Date.prototype.before = function(otherDate) {
		/* RU */
		return this.getTime() < otherDate.getTime();
	};

	/* Returns true if this object represents point in time later than specified Date object. */
	Date.prototype.after = function(otherDate) {
		/* RU */
		return this.getTime() > otherDate.getTime();
	};

	/* Returns true if this object and specified Date object represent the same point in time. */
	Date.prototype.equals = function(otherDate) {
		/* RU */
		if(otherDate)
			return this.getTime() == otherDate.getTime();
		return false;
	};

	/* MixIn for mixing in additional Date functionality. See usage in LandingFramework.jsp, function safe().  */
	var DateMixIn = (function() {
		return {
			equals: Date.prototype.equals,
			roll: Date.prototype.roll,
			diff: Date.prototype.diff,
			before: Date.prototype.before,
			after: Date.prototype.after
		};
	})();


	Array.prototype.contains = function(item, equalsFcn){
		/* RU */
		for(var idx=0; idx<this.length; idx++){
			if((equalsFcn && equalsFcn(this[idx], item)) || (!isNullOrUndefined(item) && item.equals && item.equals(this[idx])) || this[idx]==item){
				return true;
			}
		}
		return false;
	};

	/**
	 * Returns true if this array contains all elements of array supplied in parameter, otherwise return false.
	 * @param _arr array containing elements to check for presence in this array.
	 * @return true if this array contains all elements of array supplied in parameter, otherwise false.
	 */
	Array.prototype.containsAll = function(_arr){
		for(var idx=0; idx<_arr.length; idx++){
			if(!this.contains(_arr[idx])){
				return false;
			}
		}
		return true;
	};

	/**
	 * Returns true if this array is empty, otherwise return false.
	 * @return true if this array is empty, otherwise false.
	 */
	Array.prototype.isEmpty = function(){
		if(this.length){
			return false;
		}
		return true;
	};

	/**
	 * Appends (to back of array) items in a second array in the same order.
	 * @return altered instance of the modified array
	 */
	Array.prototype.append = function(a) {
		if(!!a && !!a.length){
			for(var i=0; i<a.length; i++) {
				this.push(a[i]);
			}
		}
		return this;
	};

	/**
	 * Prepends (to front of array) items in a second array in the same order.
	 * @return altered instance of the modified array
	 */
	Array.prototype.prepend = function(a) {
		for(var i=0; i<a.length; i++) {
			this.unshift(a[a.length-1-i]);
		}
		return this;
	};

	/**
	 * Returns the index of the first occurrence of the specified element
	 * in this list, or -1 if this list does not contain the element.
	 * @param el element to find in this array
	 * @return index of supplied element in this array
	 */
	Array.prototype.indexOf = function(el) {
		var ind = -1;
		for(var i = 0; i < this.length; i++) {
			if (this[i] == el) {
				ind = i;
				break;
			}
		}
		return ind;
	};

	/**
	 * Truncates an array (lopping off last array.length - len from end of array) to size specified
	 * @return {Array} altered instance of the modified array
	 */
	Array.prototype.constrain = function(len){
		if(len && len>0 && this.length>len){
			this.length = len;
		}
		return this;
	};
	/**
	 * Static that clones a given array to a new instance of an array with the same elements in the same order.
	 * @return {Array} new (copied) instance of the given array. NOT A DEEP CLONE.
	 */
	Array.clone = function(_arr){
		if(_arr){
			var rv = [];
			if(typeOf(_arr)=='array'){
				for(var idx=0; idx<_arr.length; idx++){
					rv[idx]=_arr[idx];
				}
				return rv;
			}
		}
		return _arr;
	};

	Array.prototype._assertNumType = function(){
		if (this.length>0 && typeof this[0] != 'number')
			throw "OperationNotSupported: can't sum on a non-numerical list";
	};

	/* Calculates and returns sum of numeric elements of array. Nonnumeric elements are skipped.
	 * @return sum of numeric elements of array.
	 * @throws error "OperationNotSupported" if array contains nonnumeric elements.
	 */
	Array.prototype.sum = function() {
		this._assertNumType();
		if (!this.length) {
			return 0;
		} else {
			return this[0] + this.slice(1).sum();
		}
	};

	/* Returns standard deviation of array elements.
	 * @return standard deviation of array elements.
	 */
	Array.prototype.std_dev = function() {
		this._assertNumType();
		var sum = this.sum();
		var mean = sum / this.length;
		for(var i = 0, variance = 0; i < this.length; i++) {
			variance += Math.pow(this[i] - mean, 2);
		}
		variance = variance / this.length;
	    return Math.sqrt(variance);
	};

	/* Returns average of array elements.
	 * @return average of array elements.
	 * @throws error "OperationNotSupported" if array contains nonnumeric elements.
	 */
	Array.prototype.average = function(){
		this._assertNumType();
		var sum = 0;
		for(var i=0; i<this.length; i++){
			sum += this[i];
		}
		return sum/this.length;
	};

	/* Returns array size.
	 * @return array size.
	 */
	Array.prototype.size = function() {
		return this.length;
	};

	/**
	 * boolean visitor iterator that takes an object and an objects comparator fcn to test against a given result
	 * @return true if all comparisons equal the desired result. False if any one fails.
	 */
	Array.prototype._visit = function(o, bFcn, bool){
		for(var i=0; i<this.length; i++){
			if(bFcn(this[i], o)!=bool)
				return false;
		}
		return true;
	};

	// VISITOR function definitions FOR DATE-TYPED ARRAYS...
	Array.prototype.after = function(d){
		return this._visit(
				d,
				function(d1,d2){
					return d1.after(d2);
				},
				true
				);
	};
	Array.prototype.before = function(d){
		return this._visit(
				d,
				function(d1,d2){
					return d1.before(d2);
				},
				true);
	};

    Array.prototype.remove = function(index) {
        if (index < 0 || index > this.length) {
            return;
        }
        for (var i = index ; i +1 < this.length; i++) {
            this[i] = this[i+1];
        }
        this.length = this.length -1;
    };

    /**
     * Returns Array of keys (Map`).
     * @return Array of keys.
     */
    Array.prototype.keys = function () {
        var out = new Array();
        for(var index = 0; index < this.length; index ++) {
            var entry = this[index];
            out.push(entry.key);
        }
        return out;
    };

    /**
     * Returns Array of values (from map).
     * @return Array of values.
     */
    Array.prototype.values = function () {
        var out = new Array();
        for(var index = 0; index < this.length; index ++) {
            var entry = this[index];
            out.push(entry.value);
        }
        return out;
    };

    /**
     * Returns Map.Entry
     * @param key key of entry
     * @return Map.Entry if there is key in map, otherwise null.
     */
    Array.prototype.findEntry = function (key) {
        for(var index = 0; index < this.length; index ++) {
            if (this[index].key == key) {
                return this[index];
            }
        }
        return null;
    };

    /**
     * Returns value for key (Map)
     * @param key key of entry
     * @return value if there is key in map, otherwise null.
     */
    Array.prototype.get = function (key) {
        var entry = this.findEntry(key);
        if (entry) {
            return entry.value;
        }
        return null;
    };

    /**
     * Create(if there is no entry)/Rewrite (if there is entry) Map.Entry
     * @param key key of map entry
     * @param value value of map entry
     * @param findEntry if true, then try to find entry in map
     */
    Array.prototype.set = function (key, value, findEntry) {
        var entry = null;
        if (typeof(findEntry) == 'undefined'  || findEntry == true) {
            entry = this.findEntry(key);
        }
        if (entry) {
            entry.value = value;
        }
        else {
            entry = {key: key, value : value};
            this.push(entry);
        }
    };

    /**
     * Remove Map.Entry for key
     * @param key key of map entry
     */
    Array.prototype.unset = function (key) {
        for(var index = 0; index < this.length; index ++) {
            if (this[index].key == key) {
                this.remove(index);
                break;
            }
        }
    };

    /**
     * Clear Array
     */
    Array.prototype.clear = function () {
        this.length = 0;
    };

    /**
     * Execute function for each Map.Entry
     * @param fnc function to which will executed for each map entry
     * function's parameters: key, value
     * @return Array with 'fnc returns' if there is function, otherwise null
     */
    Array.prototype.collect = function (fnc) {
        if (typeof fnc != "function") {
            return null;
        }
        var out = new Array();
        for(var index = 0; index < this.length; index ++) {
            var entry = this[index];
            out.push(fnc(entry.key, entry.value));
        }
        return out;
    };

    /**
     * Execute function for each Map.Entry
     * @param fnc function which will executed for each map entry
     * (function's parameters : key, value, map)
     */
    Array.prototype.each = function (fnc) {
        if (typeof fnc != "function") {
            return;
        }
        for(var index = 0; index < this.length; index ++) {
            var entry = this[index];
            fnc(entry.key, entry.value, this);
        }
    };
    Array.prepareMapToSerialize = function(map) {
        var out = {};
        for(var i = 0; i < map.length; i++){
            var element = map[i];
            out[element.key]  = element.value;
        }
        return out;
    };

	/* Performs range check for this Number object value. Range bounds are inclusive.
	 * @return true if this Number object value is within bounds.
	 * @throws If upper range bound is less than lower range bound.
	 */
	Number.prototype.inRange = function(low, high) {
		if (high < low) throw ("Incorrect range bounds: low = " + low + ", high = " + high);
		if ((this >= low) && (this <= high)) return true;
		else return false;

	};

	/* MixIn for mixing in additional Number functionality. See usage in LandingFramework.jsp, function safe().  */
	var NumberMixIn = (function() {
		return {inRange: Number.prototype.inRange};
	})();


	/* Returns true if current String object contains searchString as a substring.
	 * @param searchString a substring to search for.
	 * @param bIgnoreCase ignore case flag; if set to true, search is done ignoring character case.
	 * @param isRegexp true if searchString must be treated as RegExp pattern
	 * @return true if substring was found.
	 */
	String.prototype.contains = function(searchString, bIgnoreCase, isRegexp) {
		if (!isRegexp) {
			var str1;
			var str2;
			if (bIgnoreCase) {
				str1 = this.toLowerCase();
				str2 = searchString.toLowerCase();
			} else {
				str1 = this;
				str2 = searchString;
			}
			var ind = str1.indexOf(str2);
			return (ind != -1);
		} else {
			var reFlags = "";
			if (bIgnoreCase) reFlags = "i";
			var re = new RegExp(searchString, reFlags);
			return re.test(this);
		}
	};

	/* Returns true if current String object starts with value specified in searchString parameter.
	 * @param searchString a string to search for.
	 * @param bIgnoreCase ignore case flag; if set to true, search is done ignoring character case.
	 * @param isRegexp true if searchString must be treated as RegExp pattern
	 * @return true if current string starts with @searchString.
	 */
	String.prototype.startsWith = function(searchString, bIgnoreCase, isRegexp) {
		if (!isRegexp) {
			var str1;
			var str2;
			if (bIgnoreCase) {
				str1 = this.toLowerCase();
				str2 = searchString.toLowerCase();
			} else {
				str1 = this;
				str2 = searchString;
			}
			var ind = str1.indexOf(str2);
			return (ind == 0);
		} else {
			var reFlags = "";
			if (bIgnoreCase) reFlags = "i";
			if (searchString.charAt(0) != "^") searchString = "^" + searchString;
			var re = new RegExp(searchString, reFlags);
			return re.test(this);
		}
	};

	/* Returns true if current String object ends with value specified in searchString parameter.
	 * @param searchString a string to search for.
	 * @param bIgnoreCase ignore case flag; if set to true, search is done ignoring character case.
	 * @param isRegexp true if searchString must be treated as RegExp pattern
	 * @return true if current string ends with @searchString.
	 */
	String.prototype.endsWith = function(searchString, bIgnoreCase, isRegexp) {
		if (!isRegexp) {
			var str1;
			var str2;
			if (bIgnoreCase) {
				str1 = this.toLowerCase();
				str2 = searchString.toLowerCase();
			} else {
				str1 = this;
				str2 = searchString;
			}
			var ind = str1.lastIndexOf(str2);
			return ((ind != -1) && (ind == (str1.length - str2.length)));
		} else {
			var reFlags = "";
			if (bIgnoreCase) reFlags = "i";
			if (searchString.charAt(searchString.length - 1) != "$") searchString = searchString + "$";
			var re = new RegExp(searchString, reFlags);
			return re.test(this);
		}
	};

	/* Returns true if current String object is equal to the specified searchString parameter.
	 * @param searchString a string to compare with.
	 * @param bIgnoreCase ignore case flag; if set to true, comparison is done ignoring character case.
	 * @param isRegexp true if searchString must be treated as RegExp pattern
	 * @return true if current string is equal to @searchString.
	 */
	String.prototype.equals = function(searchString, bIgnoreCase, isRegexp) {
		if (!isRegexp) {
			var str1;
			var str2;
			if (bIgnoreCase) {
				str1 = this.toLowerCase();
				str2 = searchString.toLowerCase();
			} else {
				str1 = this;
				str2 = searchString;
			}
			return (str1 == str2);
		} else {
			var reFlags = "";
			if (bIgnoreCase) reFlags = "i";
			if (searchString.charAt(0) != "^") searchString = "^" + searchString;
			if (searchString.charAt(searchString.length - 1) != "$") searchString = searchString + "$";
			var re = new RegExp(searchString, reFlags);
			return re.test(this);
		}
	};
