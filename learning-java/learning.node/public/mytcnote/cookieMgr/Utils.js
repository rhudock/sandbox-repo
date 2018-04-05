	/**
	 * Logs provided string to browser console.
	 * Regards JSLoggingDisabled switch set in Admin.
	 * @param {string} s string to log
	 * @param {string?} severity Logging level, one of "log", "error", "warn", "info", "debug", "trace"
	 */
	function log(s, severity) {
		if (!JSLoggingDisabled) {
			if (typeof console != "undefined") {
				if (typeof severity != "string") severity = "log";
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

	/**
	 * Check is c2c to persistent is set for site
	 * @param {Boolean} siteC2P site option from Portal settings
	 * @return {Boolean}
	 */
	function isC2PActive(siteC2P){
		if(isNullOrUndefined(siteC2P)){
			throw new Error("siteC2P parameter missing");
		}
		var chatData = CHM.getChatData().getChatData();
		if (!!chatData && !isNullOrUndefined(chatData['c2cToPersistent'])) {
			return chatData['c2cToPersistent'];
		}
		return siteC2P;
	}

	/**
	 * Fires custom event. Custom events are declared in business/program rules
	 * @param {String} eventName
	 * @param {Object} data event data
	 * @param {Rule=} rule
	 */
	function fireCustomEvent(eventName, data, rule) {
		try {
			EVM.fireCustomEvent(eventName, rule, data);
		} catch (err) {
			logErrorToTagServer("External custom event(" + eventName + ") fire failure (siteID=" + siteID + "): " + err);
		}
	}

	/**
	 * Sends error message to TS. Regards JSLoggingDisabled switch set in Admin.
	 * @param errMsg message to be logged in TS log as an error.
	 */
	function logErrorToTagServer(errMsg) {
		logMessageToTagServer(errMsg, LOG_LEVELS.ERROR);
	}

    /**
     * Sends error which occurs on execution ROM.post function to TS.
     */
    function logErrorInPostToTagServer(errMsg) {
        log(errMsg, LOG_LEVELS.ERROR);
        ROM.postToServer(urls.logJsPostURL, {level: LOG_LEVELS.ERROR, line: trimMsg(errMsg)});
    }

	/**
	 * Sends message to TS. Regards JSLoggingDisabled switch set in Admin.
	 * @param {string} msg message to be logged in TS log as an error.
	 * @param {string} logLevel log level type
	 * @param {function} callback - callback function
	 */
	function logMessageToTagServer(msg, logLevel, callback) {
		log(msg, logLevel);
		ROM.post(urls.logJsPostURL, {level: logLevel, line: trimMsg(msg)}, null, false, callback);
	}

	/**
	 * Log level string constants
	 * @type {{FATAL: "FATAL", ERROR: "ERROR", WARN: "WARN", INFO: "INFO", DEBUG: "DEBUG"}}
	 */
	var LOG_LEVELS = {
		FATAL : "FATAL",
		ERROR : "ERROR",
		WARN : "WARN",
		INFO : "INFO",
		DEBUG : "DEBUG"
	};

	/**
	 * Log level number constants
	 * @type {{FATAL: number, ERROR: number, WARN: number, INFO: number, DEBUG: number}}
	 */
	var JS_LOG_LEVELS = {
		FATAL : 5,
		ERROR : 4,
		WARN : 3,
		INFO : 2,
		DEBUG : 1
	};

	/**
	 * This method is to check weather or not the value passed is valid log level
	 *
	 * @param {string} value - Log level value.
	 * @return {Boolean}
	 */
	function isValidLogLevel(value) {
		for (var logLevel in LOG_LEVELS)
			if (LOG_LEVELS[logLevel] == value) return true;
		return false;
	}

	/**
	 * This function is to send log data to server based on the Log Level defined in the Rules.
	 *
	 * At Program Rules level by default the JS_LOG_LEVEL is set to "ERROR".
	 * We can override it at Business Rules level if we want to change the log level for a site
	 * to debug an issue specific to that site. For anything JSLogging should be enabled in portal.
	 *
	 * JS_LOG_LEVEL defined in the rules is specific to weather or not we need to post the message to the server.
	 *
	 * @param {string} msg
	 * @param {string} [msgLogLevel= LOG_LEVELS.INFO] msgLogLevel requested for the message, if not defined default to LOG_LEVELS.INFO
	 * @param {string} [svrLogLevel=msgLogLevel] if defined, will write msg to server at a different log level than locally written
	 */
	function sendMessageToTagServer(msg,msgLogLevel,svrLogLevel) {
		log(msg);

		if (!JSLoggingDisabled) {

			// if message log level is not passed or is not a valid log level, default to INFO.
			if (isNullOrUndefined(msgLogLevel) || !isValidLogLevel(msgLogLevel)) {
				msgLogLevel = LOG_LEVELS.INFO;
			}

			// if server log level is not passed, or is not valid log level, apply the message log level defined.
			if (isNullOrUndefined(svrLogLevel) || !isValidLogLevel(svrLogLevel)) {
				svrLogLevel=msgLogLevel;
			}

			//if the log level defined in the message is >= log level defined in the Rules, Post the message.
			if (JS_LOG_LEVELS[msgLogLevel] >= JS_LOG_LEVELS[getConstant("JS_LOG_LEVEL")]) {
				ROM.post(urls.loggingURL, {level: svrLogLevel, line: trimMsg(msg)});
			}
		}
	}

	/**
	 * Logs a rule action error. An error may occur at evaluation of rule condition or execution of rule actions.
	 * Sends error details to TS.
	 * Regards JSLoggingDisabled switch set in Admin.
	 * @param e error to report
	 * @param rule error to report
	 * @param {string} [msg] message to send and display. Prepended to message
	 */
	function logActionErr(e, rule, msg) {
		var errMsg = catchFormatter(e);
		var errStr = "Error in " + rule + (isNullOrUndefined(msg) ? "." : (" msg=" + msg));
		log(errStr + " ChatID = " + CHM.getChatID() + ". CustomerID = " + getCustID());
		logErrorToTagServer(errStr + " \n" + errMsg);
	}

	/**
	 *  toJsString - Stringifies the given string value.
	 *     1) All special escape characters are escaped with back slash
	 *     2) If the optional quote is given, then it is put at beginning and end of string
	 *   called as: toJsString(foo, "'");
	 *   or: toJsString(foo, '"');
	 *   or: toJsString(foo);
	 *   where foo is a string to be stringified (escaped and made into a JS String).
	 * @param val value to be escaped
	 * @param quote optional character (or string) to be used as a quote
	 */
	function toJsString(val, quote) {
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

	/**
	 * Checks if current window if persistent chat window
	 * @return {boolean}
	 */
	function isPersistentWindow() {
		try {
			return window.parent.name == "_inqPersistentChat";
		} catch (err) {
			return false;
		}
	}

	/**
	 * Generates random number from interval
	 * @param low lowest value
	 * @param high highest value
	 * @param roundToNearestIntegerFlag
	 * @return {number}
	 */
	function rand(low, high, roundToNearestIntegerFlag) {
		if (high < low) {
			throw ("Incorrect bounds for random generator: low = " + low + ", high = " + high);
		}
		var delta = high - low;
		var res = (!!roundToNearestIntegerFlag)?(Math.floor(Math.random()*(delta+1))+low):(Math.random() * delta + low);
		return res;
	}

	/**
	 * Returns type of passed value. Supports "array" and "null" as types
	 * @param value
	 * @return {string}
	 */
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
	 * @param classname {string} The name of the class to seek.
	 * @param node The node on which to start the search. If undefined or null, the document
	 * body is chosen for the resolved window context is chosen by default.
	 * @param winCtxt The document window in which to search.
	 * If undefined or null, the globally defined "win" context is chosen by default.
	 * @return {Array} array of dom elements found. May be empty, never null.
	 */
	function getElementsByClassName(classname, node, winCtxt) {
		if(!node){
			winCtxt = !!winCtxt?winCtxt:win;
			node = winCtxt.document.getElementsByTagName("body")[0];
		}
		var a;
		if (node.getElementsByClassName) {
			a = node.getElementsByClassName(classname);
		} else {
			// Fallback for old browsers like IE8
			a = [];
			var re = new RegExp('\\b' + classname + '\\b');
			var els = node.getElementsByTagName("*");
			for (var i = 0, j = els.length; i < j; i++) {
				if (re.test(els[i].className)) {
					a.push(els[i]);
				}
			}
		}
		return a;
	}

	/**
	 * Determines if an expression or an expression wrapped in a function evaluates safely
	 * to null or undefined.
	 * @param o the function or expression to be evaluated. Function must wrap
	 * and return the expression to be evaluated.
	 * @param dfltOnError {boolean} value to be returned if the expression evaluation results
	 * in an error.
	 * @param logOnError {boolean} if true, will log on evaluation error
	 * @return {boolean} true if function expression evaluates to anything other
	 * than null or undefined. Returns false if safely evaluates to null or undefined. If error
	 * in evaluation, returns dfltOnError.
	 */
	function exists(o, dfltOnError, logOnError) {
		try {
			var val = o;
			if (typeof o == "function") {
				val = o();
			}
			return ((typeof val != "undefined") && (val != null));
		} catch (err) {
			if (!!logOnError) {
				logActionErr(err, rule, "JS eval error on expression " + o.toString());
			}
			return dfltOnError;
		}
	}

	/**
	 * Returns true if passed parameter is null or undefined.
	 * @param {*} val any object or variable
	 * @return {boolean} true if passed parameter is null or undefined
	 */
	function isNullOrUndefined(val) {
		return val == null || typeof(val) == "undefined";
	}

	/**
	 * Check if current browser is IE
	 * @return {boolean} true if IE
	 */
	function isIE() {
		return window.navigator.appName == "Microsoft Internet Explorer" || window.navigator.userAgent.indexOf("Trident") >= 0;
	}

	/**
	 * Check if current browser is FF
	 * @return {boolean} true if FF
	 */
	function isFF() {
		return window.navigator.userAgent.indexOf("Firefox") >= 0;
	}

	/**
	 * Check if current OS is iOS
	 * @return {boolean} true if OS is iOS
	 */
	function isIOS() {
		return /(iPad|iPhone|iPod)/g.test( window.navigator.userAgent );
	}

	/**
	 * Check if current OS is iOS 9
	 * @return {boolean} true if OS is iOS
	 */
	function isIOS9() {
		return /(iPad|iPhone|iPod).*OS 9/i.test( window.navigator.userAgent );
	}

	/**
	 * Check if current browser is Opera
	 * @return {boolean} true if Opera
	 */
	function isOpera() {
		return window.navigator.userAgent.indexOf("Opera") >= 0;
	}

	/**
	 * Check if current browser is Chrome
	 * @return {boolean} true if Chrome
	 */
	function isChrome() {
		return (window.navigator.userAgent.indexOf("Chrome") >= 0 || window.navigator.userAgent.indexOf("CriOS") >= 0)
				&& !isAndroidWebView()
				&& (!isEdge()); // navigator.userAgent for Edge have "Chrome" inside the value
	}

	/**
	 * isAndroid WebView
	 * below link tell how to detect webView useragent
	 * @see https://developer.chrome.com/multidevice/user-agent
	 * @see com.inq.utils.Capabilities.isAndroidWebView
	 * @return {boolean}
	 */
	function isAndroidWebView() {
		var pattern = new RegExp("Android.*?(wv|Version\\/[.0-9]+).*?Chrome\\/[0-9]{2}", "i");
		return pattern.test(window.navigator.userAgent);
	}

	/**
	 * returns the inteface object added by ios native code to webview window instance
	 * @returns {null | Object}
	 */
	function getIOSNativeSDKInstance() {
		var wk = window.parent.webkit;
		return wk && wk.messageHandlers && wk.messageHandlers.NuanIJSFBridge;
	}

	function getFormInIOSSDKInstance() {
		var wk = window.parent.webkit;
		return  wk && wk.messageHandlers && wk.messageHandlers.NuanSurvey;
	}

	function getPostSurveyInIOSSDKInstance() {
		var wk = window.parent.webkit;
		return  wk && wk.messageHandlers && wk.messageHandlers.NuanPCSurvey;
	}
	/**
	 * Check if current browser is Safari.
	 * @return {boolean} true if Safari.
	 */
	function isSafari() {
		return (window.navigator.userAgent.indexOf("Safari") >= 0 || isIOSWebView())
				&& (!isChrome()) && (!isEdge()); // navigator.userAgent for Chrome and Edge have "Safari" inside the value
	}

	/**
	 * Checks if it is iOsWebView
	 * On mobile devices it should work as Safari and browser type should be also as Safari
	 * @return {Boolean}
	 */
	function isIOSWebView () {
		var pattern = new RegExp("(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)", "i");
		return pattern.test(window.navigator.userAgent);
	}

	/**
	 * Check if current browser is Edge.
	 * @return {boolean} true if Edge.
	 */
	function isEdge() {
		return window.navigator.userAgent.indexOf("Edge") >= 0;
	}

	/**
	 * Checks that device type returning from the Tag Server is match to one of the following:
	 *  - Phone
	 *  - Tablet
	 *
	 * @see LandingFramework.js function isDeviceType
	 * @return {boolean}
	 */
	function isMobileDevice() {
		return isDeviceType("Phone") || isDeviceType("Tablet");
	}

	/**
	 * Returns abbreviated browser type IJSF is currently running in: one of CHROME, OPERA, SAFARI, IE, FF, EDGE.
	 * @return {string} browser type. If browser is not supported no value is returned.
	 */
	function getClientBrowserType() {
		if (isIE()) {
			return "IE";
		} else if(isEdge()) {
			return "EDGE";
		} else if(isFF()) {
			return "FF";
		} else if(isChrome()) {
			return "CHROME";
		} else if(isOpera()) {
			return "OPERA";
		} else if(isSafari()) {
			return "SAFARI";
		} else {
			return "OTHER";
		}
	}


	/**
	 * Returns array includes browser name and version
	 * original solution found http://stackoverflow.com/questions/5916900/detect-version-of-browser
	 * @return {string[]} Browser name and version in array, for example ["Firefox","16.0"]
	 */
	function getBrowserTypeAndVersion() {
		var nvg = window.navigator.appName;
		var userAgt = window.navigator.userAgent;
		var temp;
		var matches = userAgt.match(/android(?!.*chrome)/i);
		if (matches && (temp = userAgt.match(/version\/([\.\d]+)/i)) != null) {
			matches = ["Android Browser", temp[1]];
		} else {
			matches = userAgt.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
			if (matches && (temp = userAgt.match(/version\/([\.\d]+)/i)) != null) {
				matches[2] = temp[1];
			}
			//check for Edge
			if(userAgt.indexOf("Chrome") >= 0 && (temp = userAgt.match(/(edge)\/?\s*(\.?\d+(\.\d+)*)/i))) {
				matches[1] = temp[1];
				matches[2] = temp[2];
			}
			matches = matches ? [matches[1], matches[2]] : [nvg, window.navigator.appVersion, '-?'];
		}
		return matches;
	}

	/**
	 * Returns client browser version
	 * @return {string} Returns browser version as string. for example "16.0"
	 */
	function getClientBrowserVersion(){
		var browserTypeAndVersion = getBrowserTypeAndVersion();
		var ua = window.navigator.userAgent;
		if(ua.indexOf("Trident") >= 0) {
			var matches= ua.match(/(trident)\/?\s*(\.?\d+(\.\d+)*)/i);
			var tridentVersion = new Number(matches[2]);
			if (tridentVersion >= 4) {
				return (tridentVersion + 4) + ".0";
			}
		}
		return browserTypeAndVersion[1];
	}

	/**
	 * 	Takes 2 strings "2.3.4.5" and "2.5" and returns less, equal and greater than 0
	 * depending which one is bigger.
	 * Taken from http://stackoverflow.com/questions/2802993/compare-browser-versions-via-javascript/9116381
	 */
	function compareVersions(a, b) {
		var v1 = a.split('.');
		var v2 = b.split('.');
		for(var i = 0; i < Math.min(v1.length, v2.length); i++) {
			var res = v1[i] - v2[i];
			if (res != 0)
				return res;
		}
		return 0;
	}

	/**
	 * Returns client operating system type
	 * @return {string} Returns OS type as string.
	 */
	function getOSType() {
		var os = "Unknown";
		var platform = window.navigator.platform;
		var ua = window.navigator.userAgent;

		if (/Android/.test(ua)) {
			os = "Android";
		} else if (/iPhone/.test(ua) || /iPad/.test(ua) || /iPod/.test(ua)) {
			os = "iOS";
		} else if (/Win/.test(platform)) {
			os = "Windows";
		} else if (/Linux/.test(platform)) {
			os = "Linux";
		} else if (/Mac/.test(platform)) {
			os = "Mac OS";
		}

		return os;
	}

	/**
	 * Returns the string with os type, name of client browser and its version.
	 * @return {string} os type, name of client browser and its version
	 */
	function getFullBrowserInfo() {
		return getOSType() + " " + getClientBrowserType() + " " + getClientBrowserVersion();
	}

	/**
	 * Returns browser major version.
	 * Note: Now used only to determine cookie limits and thus supports only IE browsers as only IE has different
	 * limits in different versions IJSF supports.
	 * @return {number} browser major version or 0 if unable to detect.
	 */
	function getBrowserMajorVer(compatibilityOnly) {
		var ver = 0;
		if (isIE()) {
			var ua = window.navigator.userAgent;
			var tridentInd = ua.indexOf("Trident");
			//IE8 and older
			if (tridentInd >= 0) {
				ver = parseInt(ua.substring(tridentInd + 8)) + 4;
			} else {
				//old IE
				var ind = ua.indexOf("MSIE ");
				ver = parseInt(ua.substring(ind + 5));
			}
			if (compatibilityOnly) {
				if (document.documentMode && document.documentMode < ver) {
					ver = document.documentMode;
				}
			}
		}
		return ver;
	}

	/**
	 * As documented on Confluence: {@link https://confluence.touchcommerce.com/display/dev/Cookie+size+limits}
	 */
	var COOKIE_SIZE_LIMITS = {
		"IE8": 5118,
		"IE9": 5118,
		"IE10" : 5118,
		"IE11" : 5118,
		"FF": 4097,
		"SAFARI": 4093,
		"CHROME": 4095,
		"OTHER" : 4093
	};

	/**
	 *  As documented on Confluence: {@link https://confluence.touchcommerce.com/display/dev/Cookie+size+limits}
	 */
	var COOKIE_TOTAL_SIZE_LIMITS = {
		"IE8": 10236,
		"IE9": 10236,
		"IE10" : 10236,
		"IE11" : 10236,
		"FF": 614550,
		"SAFARI": 8186,
		"CHROME": 732280,
		"OTHER" : 8186
	};

	/**
	 * Returns cookie size limit for current browser.
	 * @return {number} cookie size limit for current browser or 0 if limit is not defined for current browser.
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
	 * @return {number} total cookie size limit (per domain) for current browser.
	 */
	function getCookieTotalSizeLimit() {
		var browserType = getClientBrowserType();
		var limit = COOKIE_TOTAL_SIZE_LIMITS[browserType];
		if (isNullOrUndefined(limit)) {
			limit = COOKIE_TOTAL_SIZE_LIMITS[browserType + getBrowserMajorVer()];
		}
		return limit;
	}

	/**
	 * Returns stack trace from error object
	 * @param err
	 * @return {string}
	 */
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
			return "";
		}
	}

	/**
	 * Logging is ambiguous on the TS without chatID, custID, siteID etc.
	 * This function makes log message meaningful by adding context variables to the message.
	 * Pass in the chatID, custID, custIP, siteID, pageID only when needed, i.e. when
	 * Inq, CHM LDM are not initialized.
	 * @param {string} msg message string to be supplemented with context data
	 * @param {string=} chatID engagementID or null
	 * @param {string=} custID customerID or null
	 * @param {string=} custIP customer IP or null
	 * @param {string=} siteID siteID or null
	 * @param {string=} pageID pageID or null
	 * @return {string} message string supplemented with context data such as customer id etc
	 */
	function prepareLoggingContext(msg, chatID, custID, custIP, siteID, pageID) {
		var result = msg;
		if (!result) result = "";
		var o = {};
		try {o["chatID"] = isNullOrUndefined(chatID) ? ("" + CHM.getChatID()) : chatID} catch(e){}
		try {o["custID"] = isNullOrUndefined(custID) ? Inq.custID : custID} catch(e){}
		try {o["custIP"] = isNullOrUndefined(custIP) ? Inq.custIP : custIP} catch(e){}
		try {o["siteID"] = isNullOrUndefined(siteID) ? Inq.siteID : siteID} catch(e){}
		try {o["pageID"] = isNullOrUndefined(pageID) ? LDM.getPageID() : pageID} catch(e){}
		for (var itm in o) {
			try {
				result += itm + ": " + o[itm] + "; ";
			} catch (e) {
				// formatArgument - Formats the argument into a somewhat readable format
				// see: LandingFrameworks.jsp
				result += itm + ": " + formatArgument(o[itm]) + "; ";
			}
		}
		return result;
	}

	/**
	 * Formats error for logging. Adds parameters and stack trace
	 * @param err
	 * @return {String}
	 */
	function catchFormatter(err) {
		try {
			var desc = "\t";
			if (err && err.message) {
				desc += err.message + ". ";
			} else {
				desc += "Throw while processing. ";
			}
			desc += prepareLoggingContext();
			desc += "\n\t" + getStackTrace(err);
			return encodeURIComponent(desc);
		} catch (e) {
			return "";
		}
	}

	/**
	 * Maps url to object with extracted parts (origin, href, protocol, domain, host, port)
	 * @param str
	 * @return {{origin: string, href: *, protocol: *, domain: String, host: *, port: *}}
	 */
	function parseUrl (str) {
		var m = str.match(/^(https?):\/\/([^\/:]+)(:?(\d*))/);
		var host = m[2];
		var domain = (host.indexOf('.') >= 0		// Sanity check.
			&& host.split('.').length >= 3)			// One dot domain name (e.g. tc.com) will be used as is
			? host.split('.').slice(1).join('.')	// Strip the host name.
			: host;									// Default.
		return {
			origin: m[1] + "://" + m[2],
			href: str,
			protocol: m[1],
			domain: domain,
			host: host,
			port: (m[4] ? m[4] : 80)
		};
	}

	/**
	 * Evaluates the code and don't throw errors on higher level
	 * @param id code to eval
	 * @param dflt default data to return on error
	 * @param sendErrorToTagServer log error message on Tag Server if true
	 * @return {*}
	 */
	function safe(id, dflt, sendErrorToTagServer) {
		if (id) {
			try {
				var o = win.eval(id);
				if (isNullOrUndefined(o)) {
					return o;
				} else if (typeOf(o) == "array") {
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
			} catch (err) {
				if (sendErrorToTagServer) {
					logErrorToTagServer(catchFormatter(err));
				}
			}
		}
		return dflt;
	}

	function processReceivedExternalDataThrows(id, dflt) {
		return safe(id, dflt, true);
	}

	/**
	 * Returns true if supplied object is an empty object i.e. {}.
	 */
	function isEmptyObject(obj){
		for(var i in obj) { return false;}
		return true;
	}

	/**
	 * Replaces protocol to HTTPS
	 * @param url
	 * @return {String}
	 */
	function secureProtocol(url) {
		var URL_REGEXP_IS_CONTAINS_PROTOCOL = new RegExp("^[0-9A-z\\.\\+\\-]*:|^//");
		if (url == null || url.length == 0) {
			return url;
		} else if (url.match(URL_REGEXP_IS_CONTAINS_PROTOCOL)) {
			return url.replace(/^HTTPS?:/i, "https:");
		} else {
			return "https://" + url;
		}
	}

	/**
	 * Modifies protocol of url from HTTP to HTTPS
	 * @param {string} httpURL which has to be processed
	 * @return {string} url will be returned with HTTPS protocol
	 */
	function secureHTTP(httpURL) {
		return httpURL ? httpURL.replace(/^http:/i, "https:") : httpURL;
	}

	/**
	 * Returns object as key,value;key,value sequence
	 * @param {Object} obj JSON object to process
	 * @param {boolean=} encodingRequired flag to use URL encoding for data
	 * @return {string} string of appropriate format
	 */
	function objectAsLogString(obj, encodingRequired) {
		if (!obj) {
			return null;
		}
		var string = "";
		for (var a in obj) {
			if (!isNullOrUndefined(obj[a]) && obj[a] !== "") {
				var encodedPair = encodingRequired ? encodeURIComponent(a) + "," + encodeURIComponent(obj[a]) : a + "," + obj[a];
				string += !!string ? ";" + encodedPair : encodedPair;
			}
		}
		return string;

	}

	/** productionFilter
	 * Filters the hosted file list for production and non production.
	 *
	 * RTDEV-8345
	 *	First Party Cookie Solution Does Not Work on Non-Public Domains
	 *	Make the filter a list of filters that can test independent internal sites called "silos"
	 * TODO: split these regular expressions into separate database entries, do not like comma deliminated
	 *
	 * @param {string} hostedFileList
	 * @param {string} _productionFilter
	 * @return {string}
	 */
	function productionFilter(hostedFileList, _productionFilter){
		if (_productionFilter) {
			var filters = _productionFilter.split(","); /* The filter is now a list of filters delimited by commas */

			var listItems = hostedFileList.split(",");
			var filteredListItems = [];
			var regexProduction = new RegExp(filters[0], "i");	/* The first filter is for production URLs */
			var production = regexProduction.test(inqFrame.parent.location.href);//inqFrame.parent.location.href.match(regexProduction);

			if (production) {
				for (var i = 0; i < listItems.length; i++) {
					var item = listItems[i];
					if (regexProduction.test(item)) {
						filteredListItems.push(item);
					}
				}
				return filteredListItems.join(",");
			} else if (filters.length > 1) { /* The production filter failed so we will check for each group (silo) */
				/* The filter code below is the similar as the filter code above, for production
				 * The difference is that we filter production and silo urls into the list
				 */

				/* Added "Walled Garden" support where the sites in the garden can coexist but the production references would be filtered out
				 * So ... if prefixed with a minus sign we realise that this is a walled garden and we leave out production list
				 */
				var /** @type {boolean} */ walledGarden;
				var /** @type {string} */ filter;
				for (i = 1; i < filters.length; i++) {
					filter = filters[i];
					walledGarden = filter.indexOf("-") == 0;
					var regexSilo = new RegExp((walledGarden)?filter.substr(1):filter, "i");
					var silo = regexSilo.test(inqFrame.parent.location.href);
					if (silo) {
						for (i = 0; i < listItems.length; i++) {
							var item = listItems[i];
							if (regexSilo.test(item) || (!walledGarden && regexProduction.test(item))) {
								filteredListItems.push(item);
							}
						}
						return filteredListItems.join(",");
					}
				}
			}
		}
		return hostedFileList;
	}

	/**
	 * Public function
	 * Attaches the listener of event on the target element.
	 *
	 * Usage: attachListener(window, "load", Inq.start);
	 *
	 * @param {DOMElement|Window} target
	 * @param {string} type
	 * @param {function} listener
	 * @param {boolean} useCapture
	 */
	function attachListener(target, type, listener, useCapture) {
		if (!useCapture) {
			// Prior to Firefox 6, the browser would throw an error
			// if the useCapture parameter was not explicitly false.
			useCapture = false;
		}
		if (target.addEventListener) {
			target.addEventListener(type, listener, useCapture);
		} else if (target.attachEvent) {
			target.attachEvent("on" + type, listener);
		}
	}

	/**
	 * Public function
	 * Removes the event listener previously registered with attachListener()
	 *
	 * Usage: detachListener(window, "load", Inq.start);
	 *
	 * @param {DOMElement|Window} target
	 * @param {string} type
	 * @param {function} listener
	 * @param {boolean} useCapture
	 */
	function detachListener(target, type, listener, useCapture) {
		if (!useCapture) {
			// Prior to Firefox 6, the browser would throw an error
			// if the useCapture parameter was not explicitly false.
			useCapture = false;
		}
		if (target.removeEventListener) {
			target.removeEventListener(type, listener, useCapture);
		} else if (target.attachEvent) {
			target.detachEvent("on" + type, listener);
		}
	}

	/**
	 * Returns result of the specified method on the first non-null object in the sequence, which has this method
	 * @param {String} method name of method to be called
	 * @return {*} result of method call
	 */
	function firstExisting(method) {
		for (var i = 1; i < arguments.length; i++) {
			var obj = arguments[i];
			if (obj && obj[method]) {
				return obj[method].call(obj);
			}
		}
		return null;
	}

    /**
     * Return the default value if the given value is null, otherwise return the given value.
     * @param val
     * @param def
     * @returns {*}
     */
    function getDefaultValueIfNull(val, def) {
        return isNullOrUndefined(val)?def:val;
    }

	/**
	 * Function detects whether localStorage is both supported and available.
	 * @param {string} type - "localStorage" or "sessionStorage"
	 * @returns {boolean}
	 */
	function storageAvailable(type) {
		try {
			var storage = window[type];
			var x = '__storage_test__';
			storage.setItem(x, x);
			var result = storage.getItem(x) == x;
			storage.removeItem(x);
			return !!storage && result;
		} catch(e) {
			return false;
		}
	}

	/**
	 * Find if element is in viewport
	 *     http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
	 *
	 * @param el
	 * @returns {boolean}
	 */
	function isElementInViewport (el) {
		if(!el) return false;

		var rect = el.getBoundingClientRect();
		/*
		 * RTDEV-16596
		 * While testing C2C.prototype.show function for this ticket, I found out the window.innerWidth/Height
		 * and document.documentElement.clientWidth/Height do not work for desktop browsers like IE, FF and chrorme
		 * and only window.top.innerHeight/Width will work.
		 */
		var vpHeight = (isFF() || isIE() || isChrome()) ? (window.top.innerHeight) : (window.innerHeight || document.documentElement.clientHeight);
		var vpWidth = (isFF() || isIE() || isChrome()) ? (window.top.innerWidth) : (window.innerWidth || document.documentElement.clientWidth);
	    return rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= vpHeight &&
			rect.right <= vpWidth;
	}

	/**
	 * Convert mapArray object like {attr1:[value1,value2], attr2:[value1,value2]
	     * to String attr1=value1,attr2=value2,attr2=value1,attr2=value2
	 * @param mapArray
	 */
	function attributeMapToString (mapArray) {
		var nameEqualValueFormatter = function(val) {
			return (name + "=" + val);
		};
		var result = "";
		if (!isNullOrUndefined(mapArray)) {
			var name;
			Object.keys(mapArray).forEach(function (key) {
				name = key;
				var arr = mapArray[name];
				var nvArr = arr.map(nameEqualValueFormatter);
				if (result.length > 0) {
					result += ",";
				}
				result += nvArr.join(",");
			});
		}
		return result;
	}

	/**
	 * Converts agent attributes row string to an object
	 * @param attrs is string of attributes (attr1=va1,attr2=val2)
	 * @return object like {attr1:[value1,value2], attr2:[value1,value2]}
	 */
	function attributesStringToMap (attrs) {
		function split2(str, sep) {
			var index = str.indexOf(sep);
			if (index < 0) {
				return [str, ""];
			} else {
				return [str.substring(0, index), str.substring(index + sep.length)];
			}
		}
		var map = {};
		var delimiter = '=';
		if(!!attrs) {
			var attrsArray = attrs.split(',');
			for(var i = 0; i < attrsArray.length; i++) {
				var nameValue = split2(attrsArray[i], delimiter);
				if(!map[nameValue[0]]) {
					map[nameValue[0]] = [];
				}
				map[nameValue[0]].push(nameValue[1]);
			}
		}
		return map;
	}

	/**
	 * Trims original message to MAX_LOG_LINE_LENGTH symbols. Adds information about original message size in case of trimming.
	 * @param sourceMsg source message
	 * @returns {string}
	 */
	function trimMsg(sourceMsg) {
	    var maxLogLineLength = getConstant("MAX_LOG_LINE_LENGTH");
	    if (sourceMsg && sourceMsg.length && sourceMsg.length > maxLogLineLength) {
		    return sourceMsg.substring(0, maxLogLineLength) +
			    "... Message was trimmed to " + maxLogLineLength + " symbols, original size is:" + sourceMsg.length;
	    } else {
		    return sourceMsg;
	    }
    }

	/**
	 * Prefetch the resource.
	 * @param path {string} - URL of the prefetching resource
	 */
	function prefetchResource(path) {
		var resource = document.createElement("link"); // prefetching resource
		resource.rel = "prefetch";
		resource.href = path;
		document.head.appendChild(resource);
	}

	/**
	 * We are faced with slow loading of persistent chat in IE and Edge browsers on some particular pages.
	 * Therefore was implemented the limitation of some functionality for that use case.
	 * See tickets RTDEV-19357 and RTDEV-20640 for more details.
	 * @return {boolean}
	 */
	function isPersistentChatLaunchingLimited() {
		return isPersistentWindow() && (isIE() || isEdge());
	}
