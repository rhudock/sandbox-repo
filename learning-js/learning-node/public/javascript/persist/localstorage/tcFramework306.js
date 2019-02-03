/* Timestamp in ISO 8601 format (YYYY-MM-DD): Tue Jun 25 22:07:19 PDT 2013 */

var Inq = (function() {
	var JSLoggingDisabled = ('false'=='true');

/**
 * XMLHttpRequest Facade -
 *		Creates a consistent XMLHttpRequest that works cross-domain across all supported browsers.
 * @see http://www.w3.org/TR/cors/
 * @see http://www.w3.org/TR/XMLHttpRequest/
 * @see http://blogs.msdn.com/b/ie/archive/2012/02/09/cors-for-xhr-in-ie10.aspx
 * @see http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
 * @author fpinn@touchcommerce.com
 */
(function() {
	// Note: resetGlobalVars() relies that we check type of global variables,
	// DO NOT USE ["XMLHttpRequestFacade" in window] to check for custom window properties.
	if (typeof window.XMLHttpRequestFacade != "undefined")
		return ;

	if (typeof window.XMLHttpRequestOriginal != "undefined")
		return;

	if (!!window["XMLHttpRequest"]) {
        if ("FACADE" in window.XMLHttpRequest) {
            // We are heavily broken if we got here as this means that window.XMLHttpRequestFacade
            // and window.XMLHttpRequestOriginal are not present but XMLHttpRequest is overwritten
            if ("console" in window) console.error("XF: ERROR: Inconsistent xform window state detected");
        } else {
            window.XMLHttpRequestOriginal = XMLHttpRequest;
        }
    }
	/** XMLHttpRequestLegacy implementation
	 *	Uses an IFRAME to be a proxy for requesting AJAX calls to our servers
	 *	Each server can have it's own IFRAME source.  The IFRAME source is mapped as follows:
	 *		XMLHttpRequestLegacy.serverMap["server.domain.name]="//server.inq.com/path/xhrProxy.html";
	 *	For the ORBEON server it is:
	 *	 	window.XMLHttpRequestLegacy.serverMap["forms.inq.com"]="//forms.inq.com/xhr/xhrProxy.html";
	 */
	window.XMLHttpRequestLegacy = function(){
		/* Public Properties */
		this.onabort = null;
		this.onerror = null;
		this.onload = null;
		this.onloadend = null;
		this.onloadstart = null;
		this.onprogress = null;
		this.onreadystatechange = null;
		this.readyState = 0;
		this.response = "";
		this.responseText = "";
		this.responseType = "";
		this.responseXML = null;
		this.status = 0;
		this.timeout = 0;
		this.withCredentials = false;
		this.statusText = 0;
		/* Private properties */
		this._impl=null;
		this._requestHeaders=[];
		this._responseHeaders=[];
		this._methodString="GET";
		this._methodUrl="";
		this._asyncFlag=true;
		this._userString="";
		this._userPassword="";
		this._id="";
		
		/** _toJsString - Private function that makes a string into javascript string, insert escape characters
         * @param val the string to make into a javascript string
		 * @return - string representation of the input string with special characters escaped with a reverse slash and contained in quotes
         */
        this._toJsString=function(val) {
			if (val==null) return null;
        	var value = val;
        	value = value.split("\\").join("\\\\");
        	value = value.split("\"").join("\\\"");
        	value = value.split("'").join("\\'");
        	value = value.split("\n").join("\\n");
        	value = value.split("\r").join("\\r");
        	value = value.split("\t").join("\\t");
        	value = "\"" + value + "\"";
        	return value;
        };
		
		/** _jsonString - private function to make the XMLHttpRequest into a JSON.
		 * This function is used to transfer the request to the Iframe/proxy.  The Iframe/proxy then
		 *   reconstitutes the request for it's use.
		 * @return - string representation of the XMLHttpRequest to be analysed by the IFRAME/proxy.
		 */
		this._jsonString=function(){
			var ix;
			var json = "{";
			/* Add the request headers */
			json += "requestHeaders:[";
			for (ix=0; ix<this._requestHeaders.length; ix++){
				if (ix>0) json += ",";
				json += "[" + this._requestHeaders[ix][0] + ","
				       + this._requestHeaders[ix][1] + "]";
			}
			json += "]";
			json += ",methodString:"+this._toJsString(this._methodString);
			json += ",methodUrl:"+this._toJsString(this._methodUrl);
			json += ",asyncFlag:"+this._asyncFlag;
			json += ",userString:"+this._toJsString(this._userString);
			json += ",userPassword:"+this._toJsString(this._userPassword);
			json += ",timeout:"+this.timeout;
			json += ",withCredentials:"+this.withCredentials;
			json += ",data:"+this._toJsString(this._data);
			json += ",_id:"+this._toJsString(this._id);
			json += ",_callBack:"+this._toJsString(self.location.href.split("?")[0]);
			json += ",onabort:"+(this.onabort!=null);
			json += ",onerror:"+(this.onerror!=null);
			json += ",onload:"+(this.onload!=null);
			json += ",onloadend:"+(this.onloadend!=null);
			json += ",onloadstart:"+(this.onloadstart!=null);
			json += ",onprogress:"+(this.onprogress!=null);
			json += ",onreadystatechange:"+(this.onreadystatechange!=null);
			json += "}";
			return json;
		};
		
		this.getAllResponseHeaders = function(){
			var ix, headers = "";
			for (ix=0; ix < this._responseHeaders.length;ix++){
				if (ix!=0) headers += '\r';
				headers += this._responseHeaders[ix][0] + ": " + this._responseHeaders[ix][1];
			}
		};
		
		this.getResponseHeader = function(key){
			var ix;
			for (ix=0; ix < this._responseHeaders.length;ix++){
				if (key == this._responseHeaders[ix][0]) {
					return this._responseHeaders[ix][1];
				}
			}
			return null;
		};
		
		/** abort - aborts the current AJAX call
		 *
		 */
		 this.abort = function(){
			 XMLHttpRequestLegacy._RemoveIframe(this._id);
		 };
		
		/** setRequestHeader delegate - sets the request header for ajax call,
		 *		put's request into the private _requestHeader array to be processed by the Iframe/proxy
		 * @param headerString - the name of the Header to be set (the key)
		 * @param valueString - the value of the header.
		 * @return nothing
		 */
		this.setRequestHeader = function(headerString, valueString){
			this._requestHeaders.push([this._toJsString(headerString), this._toJsString(""+valueString)]);
		};
		
		/** setOnLoad delegate - sets the handler for the onload function
		 *  @param handler - function to handle the "load" event
		 */
		this.setOnLoad=function(handler){
			this.onload = handler;
		};
		
		/** setOnError - sets the handler for the onload function
		 *  @param handler - function to handle the "error" event
		 */
		this.setOnError=function(handler){
			this.onerror = handler;
		};
		
		/** open delegate -
		 * @param methodString - the method to perform, ie GET, POST, HEAD
		 * @param methodUrl - the URL to be accessed
		 * @param asyncFlag - (optional) true signifies asynchronous.  Default true
		 * @param userString - (optional) user name for authentication
		 * @param userPassword - (optional) user password for authentication
		 */
		this.open = function(methodString, methodUrl, asyncFlag, userString, userPassword){
			if (asyncFlag==null) asyncFlag = true;
			this._methodString = methodString;
			this._methodUrl = methodUrl;
			this._asyncFlag = asyncFlag;
			this._userString = userString;
			this._userPassword = userPassword;
		};
		
		this.overrideMimeType = function(mimeString){
			this.debug("override: " + mimeString);
			if ("overrideMimeType" in this._impl)
				return this._impl.overrideMimeType(mimeString);
		};
		
		/** send - send data to the server
		 * If data is to be sent cross domain, then use the iframe/proxy
		 * If not, then use the _sendInDomain method to create a "vanilla" xmlHttpRequest instance and perform the send
		 * @param  data to be sent, or null
		 */
		this.send = function(data){
			this._data = (data)?data:null;
			/* Test for cross domain request */
			if (this._isCrossDomain()) {
				var id = "XHR"+Math.floor(Math.random()*1000001);
				/* Ensure that the request is unique by checking the ID in the document
				 * If it is unique, null will be returned
				 */
				while (null != document.getElementById(id)){
					id = "XHR"+Math.floor(Math.random()*1000001);
				}
				this._id = id;
				var jsonString = this._jsonString();
				var frameSrc = '"' + this._getProto() + window.XMLHttpRequestLegacy.getFrameSource(this._getDomain()) + '"' ;
				var divTemp = document.createElement("DIV");
				divTemp.innerHTML  = "<IFRAME "
							+ "ID=" + id + " "
							+ "STYLE=\"overflow: hidden; position: absolute; display: block; border: none; top:0px;left:0px;width: 1px; height: 1px;\" "
							+ "NAME=\"" + encodeURIComponent(jsonString) + "\" "
							+ "SRC=" + frameSrc + ">\n</IFRAME>";
				var iframe = divTemp.firstChild;
				iframe["_xmlRequest"] = this;
				document.body.appendChild(iframe);
			}
			else {
				this._sendInDomain();
			}
		};
		
		/** _sendInDomain private function - creates
		 *
		 */
		this._sendInDomain=function(){
			/* Establish the xhr item to perform the "vanilla" XHR */
			if (this._impl) this._impl = null;
			if (typeof window.XMLHttpRequestOriginal != "undefined")
				this._impl = new XMLHttpRequestOriginal();
			if (this._impl==null && "ActiveXObject" in window)
				try { this._impl = new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch(e){ /* Not an error, no need to report */ }
			if (this._impl==null && "ActiveXObject" in window)
 				try { this._impl = new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch(e){ /* Not an error, no need to report */ }
			if (this._impl==null && "ActiveXObject" in window)
 				try { this._impl = new ActiveXObject("Msxml2.XMLHTTP"); } catch(e){ /* Not an error, no need to report */ }
			if (this._impl == null) return;
			
			try {
				this._impl.open(this._methodString, this._methodUrl, this._asyncFlag, this._userString, this._userPassword);
				/* Apply event handlers */
				this._impl.onabort		= (this.onabort!=null)? XMLHttpRequestLegacy._MethodClosure(this,function(){return this._fireEvent("onabort");}):null;
				this._impl.onerror		= (this.onerror!=null)? XMLHttpRequestLegacy._MethodClosure(this,function(){return this._fireEvent("onerror");}):null;
				this._impl.onload 		= (this.onload!=null)? XMLHttpRequestLegacy._MethodClosure(this,function(){return this._fireEvent("onload");}):null;
				this._impl.onloadend 	= (this.onloadend!=null)? XMLHttpRequestLegacy._MethodClosure(this,function(){return this._fireEvent("onloadend");}):null;
				this._impl.onloadstart 	= (this.onloadstart!=null)? XMLHttpRequestLegacy._MethodClosure(this,function(){return this._fireEvent("onloadstart");}):null;
				this._impl.onprogress 	= (this.onprogress!=null)? XMLHttpRequestLegacy._MethodClosure(this,function(){return this._fireEvent("onprogress");}):null;
				this._impl.onreadystatechange 	= (this.onreadystatechange!=null)? XMLHttpRequestLegacy._MethodClosure(this,function(){return this._fireEvent("onreadystatechange");}):null;
				/* Apply properties to the _xdr instance */
				this._impl.timeout = this.timeout;
				/* Apply the headers */
				for (var ix=0; ix<this._requestHeaders.length; ix++){
					this._impl.setRequestHeader(this._requestHeaders[ix][0],this._requestHeaders[ix][1]);
				}
				if (null==this._data)
					this._impl.send();
				else
					this._impl.send(this._data);
			} catch (e){
				this.error("XHR send error",e);
			}
		};
		
		
		this._onRemoteEvent=function(remoteObject) {
			/* Apply remote data back to this implementation */
			var b = false;
			var eventName = remoteObject._eventName;
			/* There is a posibility that the ready-states come out of order */
			try {
				if (eventName == "onreadystatechange" && this.readyState > remoteObject.readyState) {
			//		alert("onreadystatechange out of order");
					return;
				}
			} catch(e){this.error("Event error in onRemoteEvent",e);}
			this.readyState = remoteObject.readyState;
			this.response = remoteObject.responseText;
			this.responseText = remoteObject.responseText;
			this.responseType = remoteObject.responseType;
			try {this.status = remoteObject.status;} catch(X){ /* no error report, status may not be available */ }
			try {this.statusText = remoteObject.statusText;} catch(X){/* no error report, status may not be available */}
			try {
				var func = this[eventName];
				if (func!=null) {
					b = this[eventName]();
				}
			}catch(e){this.error("Event error, could not fire " + eventName, e);}
			
			/* If we are finished with the IFRAME, then we get the onerror or onload event
			 * so, remove the iframe when complete (give it a second to be safe).
			 */
			switch(eventName){
				case "onload": case "onerror": case "onabort": {
					setTimeout("XMLHttpRequestLegacy._RemoveIframe(" + this._toJsString(this._id) +  ");", 1000);
				}
			}
			
			return true;
		};
		
		this._fireEvent=function(eventHandlerName,event) {
			var b = false;
			var func=null;
			this.readyState = this._impl.readyState;
			this.response = this._impl.response;
			try {this.responseText = this._impl.responseText;} catch(X){ /* Not an error, no need to report */ }
			try {this.responseBody = this._impl.responseBody;} catch(X){ /* Not an error, no need to report */ }
			this.responseType = this._impl.responseType;
			try {this.responseXML = this._impl.responseXML;} catch(X){ /* Not an error, no need to report */ }
			try {this.status = this._impl.status;} catch(X){ /* Not an error, no need to report */ }
			try {this.statusText = this._impl.statusText;} catch(X){ /* Not an error, no need to report */ }
			try {
				func = this[eventHandlerName];
				if (func!=null)
					b = this[eventHandlerName]();
			} catch(e) {
                this.error("Event error, could not fire " + eventHandlerName, e);
            }
			return b;
		};
		
		/** _isCrossDomain - private function that returns a boolean that states whether-or-not we are going cross domain
		 * @return - boolean, true - we are cross domain, false - we are NOT cross domain
		 */
		this._isCrossDomain=function(){
			return window.location.host != this._getDomain();
		};
		
		this._getDomain=function(){
			var rx = new RegExp('((http://|https://|//|/|#){0,1}[^"]*)', 'i');
			var parts = rx.exec(this._methodUrl);
			var url = "";
			switch(parts[2]) {
				case "http://":case "https://":case "//":{
					url = parts[1];
					} break;
				case "#":
				case "/":
				default: {
					return window.location.host;
					}break;
			}
			parts = url.split("/"); /* proto://domain/path */
			return  parts[2];
		};
		this._getProto=function(){
			var rx = new RegExp('((http://|https://|//|/|#){0,1}[^"]*)', 'i');
			var parts = rx.exec(this._methodUrl);
			var proto = window.location.protocol;
			switch(parts[2]) {
				case "http://":case "https://":{
					proto = parts[2].slice( 0, -2 );
					} break;
				default: {
					proto = window.location.protocol;
					}break;
			}
			return  proto;
		};
	};
	
	/** static private - method closure
	 *
	 */
	XMLHttpRequestLegacy._MethodClosure=function(obj, method) {
		var _method = method;
		var _obj = obj;
		var _func = function() {
			return _method.apply(_obj, arguments);
		};
		_func.scope = _obj;
		_func.method = _method;
		return _func;
	};
	
	/** static public - removes the IFRAME/Proxy from the document when XHL is complete
	 *  @param iframeId string containing the ID of the iframe to be removed
	 */
	XMLHttpRequestLegacy._RemoveIframe=function(iframeId){
		try {
			var iframe = document.getElementById(iframeId) ;
			if (iframe){
				var par = iframe.parentNode;
				if (par) {
					par.removeChild(iframe);
				}
			}
		} catch (e){this.error("Garbage Collection error in XMLHttpRequestLegacy._RemoveIframe", e);}
	};

	/** static public, accepts the return data from the IFRAME xhr
	 * @param jsonString of type string - the JSON string of the data for the XHR
	 */
	XMLHttpRequestLegacy.Return=function(jsonString){
		var xfrObj = eval("(" + jsonString + ")");
		var id = xfrObj._id;
		var iframe = document.getElementById(id);
		if (iframe) {
			var xhr = iframe["_xmlRequest"];
			if (xhr)
				(xhr._subclass._impl)._onRemoteEvent(xfrObj);
		}
	};
	
	/** XMLHttpRequestFacade constructor - replaces the XHLHttpRequest to perform cross domain on all supported browsers
	 *
	 */
	window.XMLHttpRequestFacade = function() {
		/* establish the correct implementation for ajax transport */
		this._impl = XMLHttpRequestFacade._factory();	/* This is the implementation factory that gets the correct impl */
		this._impl._subclass = this;					/* Have the implementation have reference to this */
		this.log = function(s){ if ("console" in window) console.log("XHRF: " + s); };
		this.error = function(s,ex){ if ("console" in window) console.log("XHRF: " + s, ex); };
		this.debug = function(s,ex){ if ("console" in window && this._debug) console.log("XHRF: " + s, ex); };
		this.onabort = null;
		this.onerror = null;
		this.onload = null;
		this.onloadend = null;
		this.onloadstart = null;
		this.onprogress = null;
		this.onreadystatechange = null;
		this._debug = false;
		this.readyState = 0;
		this.response = "";
		this.responseText = "";
		this.responseBody = "";
		this.responseType = "";
		this.responseXML = null;
		this.status = 0;
		this.statusText = 0;
		
		/** onabort
		 *
		 */
		this._impl.onabort = function(event){
		//	this._subclass.log("onabort");
			(this._subclass)._syncupFromImpl();
			if (null != this._subclass.onabort){
				this._subclass.onabort(event);
			}
		};
		
		this._impl.setOnError(function(event){
		//	this._subclass.log("onerror");
			(this._subclass)._syncupFromImpl();
			if (null != this._subclass.onerror){
				this._subclass.onerror(event);
			}
		});
		
		this._impl.setOnLoad(function(event){
		//	this._subclass.log("onload");
			(this._subclass)._syncupFromImpl();
			if (null != this._subclass.onload){
				this._subclass.onload(event);
			}
		});
		
		this._impl.onloadend = function(event){
			
		//	this._subclass.log("onloadend");
			(this._subclass)._syncupFromImpl();
			if (null != this._subclass.onloadend){
				this._subclass.onloadend(event);
			}
		};
		
		this._impl.onloadstart = function(event){
		//	this._subclass.log("onloadstart");
			(this._subclass)._syncupFromImpl();
			if (null != this._subclass.onloadstart){
				this._subclass.onloadstart(event);
			}
		};
		
		this._impl.onprogress = function(event){
		//	this._subclass.log("onprogress");
			(this._subclass)._syncupFromImpl();
			if (null != this._subclass.onprogress){
				this._subclass.onprogress(event);
			}
		};
		
		this._impl.onreadystatechange = function(event){
		//	this._subclass.log("onreadystatechange");
			(this._subclass)._syncupFromImpl();
			if (null != this._subclass.onreadystatechange){
			//	this._subclass.log("onreadystatechange: " + this.readyState);
				this._subclass.onreadystatechange(event);
			}
		};

		this.addEventListener = function(type, listener, useCapture){
			this.debug("addEventListener: " + type);
			if (!useCapture)useCapture=false;
			if ("addEventListener" in this._impl)
				this._impl.addEventListener(type, listener, useCapture);
		};
		
		this.removeEventListener = function(type, listener){
			if ("removeEventListener" in this._impl)
				this._impl.removeEventListener(type, listener, useCapture);
		};
		
		/** abort delegate - ask impl to abort the xhr
		 * @return nothing
		 */
		this.abort = function() {
			if ("abort" in this._impl){
				this._impl.abort();
			} else {
				this.error("abort: Not implemented");
			}
		};
		
		this.getAllResponseHeaders = function () {
			if ("getAllResponseHeaders" in this._impl)
				return this._impl.getAllResponseHeaders();
		};
		
		this.getResponseHeader = function(headerString) {
			if ("getResponseHeader" in this._impl)
				return this._impl.getResponseHeader(headerString);
		};
		
		/**
		 * open delegate - assigns destination URL and method to send request
		 *	This open is subclassed to:
		 *		1) allow default server and protocol, if not supplied in URL
		 *		2) allow the JSESSION-ID to be injected into the URL for correct session tracking
		 *			This is needed to preserve java sessions when 3rd party cookies are not enabled
		 *			Cookieless sessions are achieved by appending a string of the format ";jsessionid=sessionIdentifier" to the end of a URL and before the query.
		 * @see http://stackoverflow.com/questions/436752/supporting-sessions-without-cookies-in-tomcat
		 * @see https://developers.google.com/search-appliance/documentation/50/admin/URL_patterns
		 * @param methodString - the method to perform, ie GET, POST, HEAD
		 * @param methodUrl - the URL to be accessed
		 * @param asyncFlag - (optional) true signifies asynchronous.  Default true
		 * @param userString - (optional) user name for authentication
		 * @param userPassword - (optional) user password for authentication
		 */
		this.open = function(methodString, methodUrl, asyncFlag, userString, userPassword){
			if (asyncFlag==null) asyncFlag = true;
		
			/* fix up the URL */
			var domain = this.constructor.defaultServerDomain;		/* From the constructor function get the default domain */
			var proto  = this.constructor.defaultServerProtocol;	/* From the constructor function get the default protocol */
			if (domain==null) domain = "";
			if (proto==null) proto = "";

			if (proto.length > 0){									/* Add the colon if exists */
				if (proto.indexOf(":")==-1) proto += ":";
			}
			
			var rx = new RegExp('((http://|https://|//|/|#){0,1}[^"]*)', 'i');
			var parts = rx.exec(methodUrl);
			var url = "";
			
			/* Fix the URL, put in default protocol and domain if not specified */
			switch(parts[2]) {
				case "http://":case "https://":case "#":{
					url = parts[1];
					} break;
				case "//":{
					url = proto + parts[1];
					}break;
				case "/":{
					url = proto + "//" + domain + parts[1];
					}break;
				default:{
					url = path + "/" + parts[1];
					}break;
			}
			methodUrl = url ;
			
			/* Now put the session id in the URL for Resin to pick up */
			var jsessionid  = this.constructor.jsessionid;
			if (jsessionid!=null && jsessionid.length > 0) {
				parts = methodUrl.split("?");
				parts[0] += ";jsessionid=" + jsessionid;
				methodUrl = parts.join("?");
			}
			
			if (arguments.length < 4){
				this._impl.open(methodString, methodUrl, asyncFlag);
			} else if (arguments.length < 5) {
				this._impl.open(methodString, methodUrl, asyncFlag, userString);
			} else {
				this._impl.open(methodString, methodUrl, asyncFlag, userString, userPassword);
			}
		};
		
		/**
		 * overrideMimeType delegate - ask impl to perform the overrideMimeType
		 * @param mimeString - string containing new mime type
		 */
		this.overrideMimeType = function(mimeString){
			this.debug("override: " + mimeString);
			if ("overrideMimeType" in this._impl)
				return this._impl.overrideMimeType(mimeString);
		};
		
		/** send delegate - ask implementation to send data
		 * @param data to be sent or null
		 */
		this.send = function(data){
			this.debug("send");
			if ("send" in this._impl){
				if (!!data) {
					return this._impl.send(data);
				} else {
					return this._impl.send();
				}
			}
		};
		
		/** setRequestHeader delegate - ask (if implemented) the implementation (impl) to set the request header
		 * @param headerString - string that specifies the header name
		 * @param valueString - string that specifies the value to which the headerName is to be set
		 * @return nothing
		 */
		this.setRequestHeader = function(headerString, valueString){
			this.debug("setRequestHeader: " + headerString + ": " + valueString);
			try {
				if ("setRequestHeader" in this._impl)
					return this._impl.setRequestHeader(headerString, valueString);
			} catch (e){ this.error("setRequestHeader: Error", e); }
		};
		
		/**
		 * private function that makes sure that the impl data is set to the facade
		 */
		this._syncupFromImpl=function() {
			this.debug("sync readyState");
			this.readyState = this._impl.readyState;
			this.response = this._impl.response;
			this.responseText = this._impl.responseText;
			try {this.responseBody = this._impl.responseBody;} catch(X){ /* No error here, no need to report */ }
			this.responseType = this._impl.responseType;
			try {this.responseXML = this._impl.responseXML;} catch(X){ /* No error here, there may not be a responseXML */ }
			try {this.status = this._impl.status;} catch(X){ /* No error here, there may not be a status */ }
			try {this.statusText = this._impl.statusText;} catch(X){ /* No error here, there may not be a statusText */ }
		};
		return this;
	};
		/**
		 * private static function _factory
		 * produces implementations for
		 * CORS (Cross Origin Resource Sharing) for HTML5 and IE10 (not IE8-9)
		 * XDomainRequest for (IE8-9)
		 * and legacy support for non-HTML5 browsers.
		 */
		XMLHttpRequestFacade._factory = function() {
			if (typeof window.XMLHttpRequestOriginal != "undefined") {
				var impl = new XMLHttpRequestOriginal();
				if ("withCredentials" in impl){
					impl.setOnLoad=function(handler){
						this.onload = handler;
					};
					impl.setOnError=function(handler){
						this.onerror = handler;
					};
				}
				/**
				 * XDomainRequest - is an IE8 and IE9 implementation of cross origin resource sharing
				 * It allows for AJAX calls across domains
				 * ALERT: the XDomainRequest does not work in the following situations:
				 *		*	When the client page is HTTP and the request is HTTPS
				 *		*	When the browser is IE8 and the customer is in private browsing mode.
				 *		For this reason it is being commented out for this release and the code will
				 *	 	fall through and use the legacy "iframe-proxy" approach.
				 * @see http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
				 */
				/* Obviate the use of XDomainRequest due to error in IE8, see above alert
				else if ("XDomainRequest" in window) {
					impl = new XDomainRequest();
					impl.onreadystatechange = null;
					impl.status = 0;
					impl.readyState = XMLHttpRequestFacade.UNSENT;
					impl.statusText = "";
					impl.response = "";
					impl.setOnLoad=function(handler){
						this._onload = handler;
					};
					impl.setOnError=function(handler){
						this._onerror = handler;
					};
					impl.onload = function() {
						var imp = this;
						if (imp.onreadystatechange != null) {
							imp.status = 200;
							imp.readyState = XMLHttpRequestFacade.DONE;
							imp.statusText = "success";
							imp.response = imp.responseText ;
							imp.onreadystatechange(event);
						}
					};
					impl.onerror = impl.ontimeout = function() {
						var imp = this;
						if (imp.onreadystatechange != null) {
							imp.status = 400;
							imp.readyState = XMLHttpRequestFacade.DONE;
							imp.statusText = "failed";
							imp.response = imp.responseText ;
							imp.onreadystatechange(event);
						}
					};
					impl.setRequestHeader=function(headerName, headerValue){};
				}
					// Obviate the use of XDomainRequest due to error in IE8, see above alert (END)
				*/
				else {
					impl = new XMLHttpRequestLegacy();
				}
			} else {
				impl = new XMLHttpRequestLegacy();
			}
			return impl;
		};
	/* Constructor name */
	try {
		window.XMLHttpRequestFacade.name = "XMLHttpRequest";
	} catch(e) {
		/* This is not an error but a quirk in FF */
	}
	window.XMLHttpRequestFacade.DONE = 4;
	window.XMLHttpRequestFacade.LOADING = 3;
	window.XMLHttpRequestFacade.HEADERS_RECEIVED = 2;
	window.XMLHttpRequestFacade.OPENED = 1;
	window.XMLHttpRequestFacade.UNSENT = 0;
	window.XMLHttpRequestFacade.defaultServerDomain = null;
	window.XMLHttpRequestFacade.defaultServerProtocol = "";
	window.XMLHttpRequestFacade.jsessionid = "";
	window.XMLHttpRequestFacade.FACADE = true;  // Flag used to detect whether XMLHttpRequest is our facade or original request
	window.XMLHttpRequestLegacy.serverMap = {};
	window.XMLHttpRequestLegacy.serverMap["forms.inq.com"]="//forms.inq.com/xhr/xhrProxy.html";
	window.XMLHttpRequestLegacy.serverMap["formsv3.inq.com"]="//formsv3.inq.com/xhr/xhrProxy.html";
	window.XMLHttpRequestLegacy.DEFAULT_SERVER = "/xhr/xhrProxy.html";
	/**  getFrameSource - look up the correct iframe proxy given the domain
	  *    if the domain is not in the table use the default domain path concatinated to the domain
	  *  @param domain the domain of the destination server
	  *  @returns the proxy-iframe source for the server
	  */
	window.XMLHttpRequestLegacy.getFrameSource = function(domain){
		var frameSrc = window.XMLHttpRequestLegacy.serverMap[domain];
		if (frameSrc == null) {
			frameSrc = "//" + domain + window.XMLHttpRequestLegacy.DEFAULT_SERVER;
		}
		return frameSrc;
	};
	
	/* Override XMLHttpRequest with facade */
	window.XMLHttpRequest = window.XMLHttpRequestFacade;
})();
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
		return window.navigator.userAgent.indexOf("Safari") >= 0
		       && (!isChrome()); // navigator.userAgent for Chrome has "Safari" inside the value
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
		} else {
            return "OTHER";
        }
	}


    /**
     * Returns array includes browser name and version
     * original solution found http://stackoverflow.com/questions/5916900/detect-version-of-browser
     * @return Browser name and version in array, for example ["Firefox","16.0"]
     */
    function getBrowserTypeAndVersion() {
        var nvg= window.navigator.appName, userAgt= window.navigator.userAgent, temp;
        var matches= userAgt.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
        if(matches && (temp= userAgt.match(/version\/([\.\d]+)/i))!= null) {
            matches[2]= temp[1];
        }
        matches= matches? [matches[1], matches[2]]: [nvg, window.navigator.appVersion, '-?'];

        return matches;
    }

    /**
     * Returns client browser version
     * @return Returns browser version as string. for example "16.0"
     */
    function getClientBrowserVersion(){
        var browserTypeAndVersion = getBrowserTypeAndVersion();
        if(browserTypeAndVersion[0] == "MSIE") { //in compatibility view mode in IE9.0 and IE8.0 it returns IE7.0 in userAgent string
            var ua = window.navigator.userAgent;
            if(ua.indexOf("Trident/5.0") >= 0) {
                return "9.0";
            } else if(ua.indexOf("Trident/4.0") >= 0) {
                return "8.0";
            }
        }

        return browserTypeAndVersion[1];
    }

    // Takes 2 strings "2.3.4.5" and "2.5" and returns less, equal and greater than 0
    // depending which one is bigger.
    // Taken from http://stackoverflow.com/questions/2802993/compare-browser-versions-via-javascript/9116381
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
     * @return Returns OS type as string.
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

	if (!String.prototype.trim) {
		/**
		 * Delete start and end spaces in the string (IE8 support).
		 * @return {String} resulted string
		 */
		String.prototype.trim = function() {
			return this.replace(/^\s+|\s+$/g, "");
		}
	}
	/**
	 * Provides access to internal data without reference linkage.
	 * @interface
	 */
	function DataExporter(){}
	/**
	 * Provides data snapshot of the implementing instance.
	 * @return {Object} a data object that contains no linkage to the internals of the instance
	 * (shallow copy only if needed). To protect internal references from exposure, it is highly recommended
	 * that clones of internal data be returned instead of actual references.
	 * @see MixIns.clonize
	 */
	DataExporter.prototype.getData = function(){};
    	/**
	 * MixIns defines reusable interfaces with default implementations that
	 * can be added to a target object at runtime.
	 * @namespace Holds functionality related to Mix-ins.
	 */
	var MixIns = (function(){
		/** @inner */
		function _throwNoImpl(){
			throw (""+this.getID()+": "+arguments.callee.name+" requires override.");
		}

        function wrapWithTryCatch(code) {
            // window.console is used because Inq.log() is not available in XFormExternsions
            return "try{" + code + "}catch(e){if(window.console)window.console.error('ERROR:' + e.message);};\n";
        }

		/**
		 * Document Absorber class here
		 * @name Absorber
		 * @class
		 */
		var Absorber =
		/**
		 * This is an API that can be mixed into other objects
		 * @lends Absorber#
		 */
		{
			/**
			 * Absorbs the contents of the argument object into self
			 * @param {Object} absorbee object to absorb fields from
			 * @param {boolean} [agregateFlag] Optional flag, if true, then nested 1st level objects are augmented, not overwritten.
			 * @returns this for chaining convenience
			 */
			absorb: function(absorbee, agregateFlag) {
				if(absorbee){
					for(var name in absorbee) {
						if ((typeOf(this[name]) == 'object') && (typeOf(absorbee[name]) == 'object') && agregateFlag) {
							MixIns.mixAbsorber(this[name]);
							this[name].absorb(absorbee[name]);
						} else {
							this[name]=absorbee[name];
						}
					}
				}
				return this;
			}
		};

		/**
		 * Add the RemoteCaller interface to a target object.
		 * The target object will gain the following methods:
		 * onRemoteCallback, callRemote, getRID
		 * @class
		 * @name RemoteCaller
		 */
		var RemoteCaller =
			/**
			 * This is an API that can be mixed into other objects
			 * @lends RemoteCaller#
			 */
		{
				/**
				 * callback on a remote call
				 */
				onRemoteCallback: _throwNoImpl,
				/**
				 * calls out a round trip message to a remote server via a url
				 * @param {string} url properly formatted base url to communicate
				 * @param {object} data name-value pairs to be sent to the server
				 */
				callRemote: function(url, data){
					ROM.doRemoteCall(url, data, this);
				},
				send: function(url, data) {
					ROM.send(url, data);
				}
		};

		/**
		 * Support for resource interface
		 * @class
		 * @name Resource
		 */
		var Resource =
			/**
			 * This is an API that can be mixed into other objects
			 * @lends Resource#
			 */
		{
				/**
				 * "super" type constructor. REQUIRED on construction.
				 * @param {string} id The resource id
				 */
				_resource: function(id){
					this._rsrcID = id;
				},
				/**
				 * Writes name-value pairs to resource. If value is undefined, name-value pair is deleted from resource.
				 * @param {string} name name part to be saved
				 * @param {object} value value to be saved with the name.
				 * 	If undefined, name-value pair is deleted from resource.
				 */
				write: _throwNoImpl,
				/**
				 * Reads an object from the resource.
				 * @param {string} name name of the object to be retrieved from resource
				 */
				read: _throwNoImpl,
				/**
				 * helper method to serialize values.
				 * @param {object} o object to be serialized
				 * @return {string} string value of the object
				 * @public
				 */
				_serialize: _throwNoImpl,
				/**
				 * helper method to de-serialize strings to objects.
				 * @param {string} o string to be deserialized
				 * @return {object} object or null if either not deserialzable or not found
				 * @public
				 * @throws {string} error on de-serialization
				 */
				_deserialize: _throwNoImpl,
				/**
				 * obtains the resource id for the resource
				 */
				getResourceID: function(){
					return this._rsrcID;
				}
		};

		/**
		 * Support for DataReadyListener interface
		 * @class
		 * @name DataReadyListener
		 * @see PersistenceMgr
		 */
		var DataReadyListener =
			/**
			 * This is an API that can be mixed into other objects
			 * @lends DataReadyListener#
			 */
		{
			/**
			 * Invoked when a data ready evt is fired
			 */
				onDataReady: _throwNoImpl
		};


		/**
		 * Support for Persistable interface
		 * @class
		 * @name Persistable
		 * @see PersistenceMgr
		 */
		var Persistable =
			/**
			 * This is an API that can be mixed into other objects
			 * @lends Persistable#
			 */
		{
				/**
				 * obtains the persistable's id
				 * @return {string} string id
				 */
				getPersistentID: _throwNoImpl,
				/**
				 * loads the persistable's data from serialzed repository to memory
				 */
				load: _throwNoImpl,
				/**
				 * saves the persistables memory data to data repository
				 */
				save: _throwNoImpl,
				/**
				 * invoked as data ready listener
				 * @borrows DataReadyListener#onDataReady ad #onDataReady
				 */
				onDataReady: _throwNoImpl
		};

		/**
		 * Document FrameworkModule class here
		 * @name FrameworkModule
		 * @class
		 */
		var FrameworkModule =
			/**
			 * This is an API that can be mixed into other objects
			 * @lends FrameworkModule#
			 */
		{
				_frameworkModule: function(id){
					this._id = id;
				},
				getID: function(){ return this._id;},
				/**
				 * initialized a module. Contract: internal init only. No linkage.
				 */
				init: _throwNoImpl,
				/**
				 * starts a module.
				 */
				start: _throwNoImpl,
				/**
				 * resets a module completely.
				 */
				reset: _throwNoImpl
		};

		/**
		 * Document Observable class here
		 * @name Observable
		 * @class
		 */
		var Observable = (function(){
			var retval =
			/**
			 * This is an API that can be mixed into other objects
			 * @lends Observable#
			 */
			{
				/**
					* adds an array of listeners to the class
					*/
				addListeners: function(_arr){
					for(var idx=0; idx < _arr.length; idx++){
						this.addListener(_arr[idx]);
					}
				},

				/**
				 * Must be invoked with constructor
					* @public
					*/
				_observable: function(){
					this._listeners = [];
					this.observable=true;
				},

				/**
					* clears all listeners in the class
					*/
				clearListeners: function(){
					this._listeners=[];
				},
				/**
					* generic event firing method for use by any Observable mixin
					* @public
					*/
				_fireEvt: function(vfcn, evt){
					for(var idx=0; idx < this._listeners.length; idx++){
						var listener = this._listeners[idx];
						vfcn(listener, evt);
						if (typeof listener.onAnyEvent == "function") {
							listener.onAnyEvent(evt);
						}
					}
				},
				/**
					* adds a listener
					*/
				addListener: function(l){
					if(l && (this.isListener(l) || l.onAnyEvent)){
						this._listeners.push(l);
					}
				},
				/**
					* Determines if a given object is an acceptable listener for this class.
					* Overriding this method is required.
					* @throws {String} if the method is invoked without override
					*/
			isListener: _throwNoImpl
			};
			return retval;
		})();


		/**
		 * Document JSON MixIn here
		 * @constructor
		 * @class JSON
		 * @name JSON
		 * @field
		 */
		var JSON = (function(){
			function f(n){
				return n<10?'0'+n:n;
			}
			if(typeof Date.prototype.toJSON!=='function'){
				/** @ignore */
				Date.prototype.toJSON=function(key){
					return this.getTime();
				};
				/** @ignore */
				String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON =
					function(key){
						return this.valueOf();
					};
			}
			var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapeable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},rep;
			function quote(string){
				escapeable.lastIndex=0;
				return escapeable.test(string)?'"'+string.replace(escapeable,function(a){var c=meta[a];if(typeof c==='string'){return c;}return'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+string+'"';
			}
			function str(key,holder){
				var i,k,v,length,mind=gap,partial,value=holder[key];
				if(value&&typeof value==='object'&&typeof value.toJSON==='function'){
					value=value.toJSON(key);
				}
				if(typeof rep==='function'){
					value=rep.call(holder,key,value);
				}
				switch(typeof value){
				case'string':return quote(value);
				case'number':return isFinite(value)?String(value):'null';
                case'boolean':case'null':return String(value);
				case'object':
					if(!value){
						return'null';
					}
					gap+=indent;
					partial=[];
					if(typeof value.length==='number'&&!value.propertyIsEnumerable('length')){
						length=value.length;
						for(i=0;i < length;i+=1){
							partial[i]=str(i,value)||'null';
						}
						v=partial.length===0?'[]':gap?'[\n'+gap+partial.join(',\n'+gap)+'\n'+mind+']':'['+partial.join(',')+']';
						gap=mind;return v;
					}
					if(rep&&typeof rep==='object'){
						length=rep.length;
						for(i=0;i < length;i+=1){
							k=rep[i];
							if(typeof k==='string'){
								v=str(k,value);
								if(v){
									partial.push(k+(gap?': ':':')+v);
								}
							}
						}
					}else{
						for(k in value){
							if (k != "") {
								try {
									if(Object.hasOwnProperty.call(value,k)){
										v=str(k,value);
										if(v){
											partial.push(k+(gap?': ':':')+v);
										}
									}
								} catch (e) {
									var eMsg = 'Exception at Object.hasOwnProperty.call(' + value + ', ' + k + ') ';
									eMsg += catchFormatter(e) + ' in JSON.str(' + key + ', ' + holder + ')';
									ROM.post(urls.loggingURL, {level:'WARN', line: (eMsg)});
								}
							}
						}
					}
					v=partial.length===0?'{}':gap?'{\n'+gap+partial.join(',\n'+gap)+'\n'+mind+'}':'{'+partial.join(',')+'}';
					gap=mind;
					return v;
				}
			}

			function clone(object){			
				return parse(stringify(object));
			}
			
			function stringify(value,replacer,space){
				if(typeof value=="undefined" || value==null) {
					return null;
				}
				var i;
				gap='';
				indent='';
				if(typeof space==='number'){
					for(i=0;i < space;i+=1){
						indent+=' ';
					}
				}else if(typeof space==='string'){
					indent=space;
				}
				rep=replacer;
				if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){
					throw new Error('JSON.stringify');
				}
				return str('',{'':value});
			}

			function parse(text,reviver){
				if(!text) return null;
				var j;
				function walk(holder,key){
					var k,v,value=holder[key];
					if(value&&typeof value==='object'){
						for(k in value){
							if(Object.hasOwnProperty.call(value,k)){
								v=walk(value,k);
								if(v!==undefined){
									value[k]=v;
								}else{
									delete value[k];
								}
							}
						}
					}
					return reviver.call(holder,key,value);
				}
				cx.lastIndex=0;
				if(cx.test(text)){
					text=text.replace(cx,function(a){return'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);});
				}
				//if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/(?:[\w-])+|"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){
					j=eval('('+text+')');
					return typeof reviver==='function'?walk({'':j},''):j;
				//}
				//throw new SyntaxError('JSON.parse');
			}

			var retval =
			/**
			 * This is an API that can be mixed into other objects
			 * @lends JSON#
			 */
			{
				
				/**
				 * converts a given Object into a new object instance
				 * @function
				 * @param object, object to be cloned
				 * @return new object
				 * @throws {Error} When JS object is not "stringifiable"
				 */
				clone: clone,
									
				/**
				 *  converts a given object to JSON string
				 *  @function
				 *  @param value val
				 *  @param replacer replacer
				 *  @param space space
				 *  @throws {SyntaxError} When invalid JSON string is parsed
				 */
				stringify: stringify,
				/**
				 * converts a given JSON string to an object
				 * @function
				 * @param text text to be parsed into an object. Must be valid JSON string to succeed
				 * @param reviver
				 * @throws {Error} When JS object is not "stringifiable"
				 */
				parse: parse
			};
			return retval;
		})();

		/**
		 * This mixin is for objects that need to be able to clone themself.
		 * @name Cloneable
		 * @class Cloneable
		 */
		var Cloneable = (function(){
			var retval =
			/**
			* This is an API that can be mixed into other objects
			* @lends Cloneable#
			*/
			{

				/**
				* Returns clone of the object.
				* Overriding this method is required.
				* @throws {String} if the method is invoked without override
				*/
				clone: function(){
					return JSON.parse(JSON.stringify(this));
				}
			};

			return retval;
		})();

		var mixIn = function(mixable){
			if(mixable){
				for(var name in mixable){
					if(!this[name]) {
						if(this.prototype) {
							this.prototype[name]=mixable[name];
						} else {
							this[name] = mixable[name];
						}
					}
				}
			}
			return this;
		};

		function prepare(_class){
			if(_class){
				_class.mixIn = mixIn;
			}
			return _class;
		}

		function mixAbsorber(o){
			if(!o){
				o= {};
			}
			o.absorb = Absorber.absorb;
			return o;
		}

		function clonize(o){
			if(!!o && typeOf(o)=="object"){
				o.clone = function(){
					return JSON.parse(JSON.stringify(this));
				}
			}
			return o;
		}

		/**
		 * Settable allows set chaining.
		 * @param {Object} the object instance to be made into a "settable".
		 * If null or undefined, a new object settable will be created and returned. If
		 * non-object is passed it will not be mixed (ignored).
		 * Ex. var o = MixIns.mixSettable().set("a",123).set(2, "foo");
		 */
		function mixSettable(o){
			if(isNullOrUndefined(o)){
				o = {};
			}
			if(!!o && typeOf(o)=="object"){
				/**
				 * sets a name value to this object.
				 * @param n {any} assigns the given value to the name.
				 * Will not assign if null or undefined.
				 * @param v {any} Value for the given name to be assigned to the object
				 * @returns this object always.
				 */
				o.set = function(n,v){
					if(!!n || n===0 || n === ""){
						this[n]=v;
					}else{
						log("Settable: Unable to set n,v=("+n+","+v+") on "+this.toString()+". \n"+getStackTrace(new Error()));
					}
					return this;
				};
			}
			return o;
		}
		/**
		 * Removable allows remove chaining.
		 * @param {Object} the object instance to be made into a "settable".
		 * If null or undefined, a new object settable will be created and returned. If
		 * non-object is passed it will not be mixed (ignored).
		 * Ex. var o = MixIns.mixSettable().set("a",123).set(2, "foo");
		 */
		function mixRemovable(o){
			if(isNullOrUndefined(o)){
				o = {};
			}
			if(!!o && typeOf(o)=="object"){
				/**
				 * Removes a named value from this object.
				 * @param n {any} assigns the given value to the name.
				 * Will not assign if null or undefined.
				 * @returns this object always.
				 */
				o.remove = function(n){
					if(!!n || n===0 || n === ""){
						delete this[n];
					}
					return this;
				};
			}
			return o;
		}
		/**
		 * Renamable allows remove chaining.
		 * @param {Object} the object instance to be made into a "settable".
		 * If null or undefined, a new object settable will be created and returned. If
		 * non-object is passed it will not be mixed (ignored).
		 * Ex. var o = MixIns.mixSettable().set("a",123).set(2, "foo");
		 */
		function mixRenamable(o){
			if(isNullOrUndefined(o)){
				o = {};
			}
			if(!!o && typeOf(o)=="object"){
				/**
				 * Renames a named value in this object.
				 * @param n {any} assigns the given value to the name.
				 * Will not assign if null or undefined.
				 * @returns this object always.
				 */
				o.rename = function(on,nn){
					if((!!on || on===0 || on === "") && (!!nn || nn===0 || nn === "")){
						var v = this[on];
						if(!!v || v===0){
							delete this[on];
						}
						this[nn]=v;
					}
					return this;
				};
			}
			return o;
		}
		function unmixMutatable(o){
			delete o.rename;
			delete o.remove;
			delete o.set;
			return o;
		}
		
		function mixMutatable(o){
			o = mixRemovable(o);
			o = mixSettable(o);
			o = mixRenamable(o);
			return o;
		}

		return {
			prepare: prepare,
			Observable: Observable,
			JSON: JSON,
			mixMutatable: mixMutatable,
			unmixMutatable:unmixMutatable,
			mixAbsorber: mixAbsorber,
			Absorber: Absorber,
			Resource: Resource,
			Persistable: Persistable,
			FrameworkModule:FrameworkModule,
			RemoteCaller:RemoteCaller,
			clonize: clonize,
			Cloneable:Cloneable,
            wrapWithTryCatch:wrapWithTryCatch
		};
	})();
	


    var programConstants = {
		    "CUST_IP_HOST_RESOLUTION_ACTIVE":false,
    "ASSISTED_AGENT_CHAT_COUNT":2.0,
    "ASSISTED_CUSTOMER_CHAT_COUNT":2.0,
    "DEBUG":true,
    "SALE_EXPIRATION":2592000000,
    "SALE_STATE_CONVERTED":"converted",
    "SALE_STATE_ASSISTED":"assisted",
    "SALE_STATE_UNSOLD":"unsold",
    "SESSION_EXPIRE_TIME":1800000,
    "INC_GROUP_CONTROL":"CONTROL",
    "INC_GROUP_CHAT":"CHAT",
    "INC_STATE_ELIGIBLE":"ELIGIBLE",
    "INC_STATE_TARGETED":"TARGETED",
    "INC_STATE_EXPOSURE_QUALIFIED":"EXPOSURE_QUALIFIED",
    "INC_STATE_EXPOSED":"EXPOSED",
    "INC_STATE_ENGAGED":"ENGAGED",
    "INC_STATE_INTERACTED":"INTERACTED",
    "INC_STATE_ASSISTED":"ASSISTED",
    "INC_STATE_CONVERTED":"CONVERTED",
    "INC_GROUP_DURATION":2592000000,
    "INC_CONTROL_PERCENT":1.0,
    "MESSAGE_COUNT_ASSISTED":1.0,
    "PERSISTENT_ASSISTED":6.0,
    "UNDEFINED_ASSISTED":3.0,
    "MAX_LONG":9.223372036854776E18,
    "BAYNOTE_EVENT_API_URL":"http://customerid-code.baynote.net/baynote/eventrest",
    "BAYNOTE_CUSTOMER_ID":"",
    "BAYNOTE_CODE":"",
    "BAYNOTE_LINGER_DU":40000,
    "SITE_SEARCH_QUERY_PARAM_NAME":"",
    "REMOVE_QUERY_STRING_FROM_TRACKING_URL":false,
    "RECHAT_INTERVAL":86400000

	};
	var businessConstants = {
		
	};

	var constants = MixIns.mixAbsorber();
	constants.absorb(programConstants);

	// If any constant in business part has the same name as a constant from program part,
	// the constant from program part will be overridden by this absorb.
	// Validity of such override is checked by corresponding constraints in br30.xsd
	constants.absorb(businessConstants);

	/**
	 * Media Manager
	 * @class MediaMgr
	 * @constructor
	 * @name MediaMgr
	 * @param {Object} data containing the database chat themes and spec and c2c themes and specs.
	 * @borrows Absorber#absorb as #absorb
	 * @borrows FrameworkModule#init as #init
	 * @borrows FrameworkModule#start as #start
	 * @borrows FrameworkModule#reset as #reset
	 * @see Absorber
	 * @see FrameworkModule
	 */
	function MediaMgr(data) {
		this._frameworkModule("mm");
		this.absorb(data);
		// make all data clonable
		for(var n1 in data){
			for(var n2 in data[n1]){
				MixIns.clonize(data[n1][n2]);				
			}
		}
	}
	MixIns.prepare(MediaMgr).mixIn(MixIns.Absorber).mixIn(MixIns.FrameworkModule);
	MediaMgr.prototype.start = MediaMgr.prototype.reset = MediaMgr.prototype.init = function(){};
	/**
	 * Retrieves the C2C spec for a given id.
	 * @param id Number The id of the c2c spec to be retrieved. null safe.
	 * @param subtree Boolean will return the whole C2CSpec/Theme with the Chat spec/theme as subtree if true. Only the c2cSpec if false or undefined.
	 * @return Object The c2cSpec for the given id. Never null.
	 * @throws Error if no spec is found for the given id.
	 */
	MediaMgr.prototype.getC2CSpec = function(id, subtree) {
		var val = this["c2cSpecs"][id];
		if(isNullOrUndefined(val)){
			throw ("MediaMgr-> no c2c spec for id="+id);
		}
		val = MixIns.mixAbsorber(val.clone());
		if(!!subtree)
			val.absorb({c2cTheme:this.getC2CTheme(val['thId']), chatSpec:this.getChatSpec(val['chSpId'], subtree)});
		return val;
	};
	/**
	 * Retrieves the C2C theme for a given id.
	 * @param id Number The id of the c2c theme to be retrieved. null safe.
	 * @return Object A clone of the c2c theme for the given id. Never null.
	 * @throws Error if no theme is found for the given id.
	 */
	MediaMgr.prototype.getC2CTheme = function(id) {
		var val = this['c2cThemes'][id];
		if(isNullOrUndefined(val)){
			throw ("MediaMgr-> no c2c theme for id="+id);
		}
		return MixIns.mixAbsorber(val.clone());
	};
	
	/**
	 * Retrieves the chat spec for a given id.
	 * @param id Number The id of the chat spec to be retrieved. null safe.
	 * @return Object A clone of the chat spec for the given id. Never null.
	 * @throws Error if no spec is found for the given id.
	 */
	MediaMgr.prototype.getChatSpec = function(id, subtree) {
		var val = this["chatSpecs"][id];
		if(isNullOrUndefined(val)){
			throw ("MediaMgr-> no chat spec for id="+id);
		}
		val = MixIns.mixAbsorber(val.clone());
		if(!!subtree)
			val.absorb({chatTheme:this.getChatTheme(val['ctId'])});
		return val;
	};
	/**
	 * Retrieves the chat theme for a given id.
	 * @param id Number The id of the chat theme to be retrieved. null safe.
	 * @return Object A clone of the chat theme for the given id. Never null.
	 * @throws Error if no theme is found for the given id.
	 */
	MediaMgr.prototype.getChatTheme = function(id) {
		var val = this['chatThemes'][id];
		if(isNullOrUndefined(val)){
			throw ("MediaMgr-> no chat theme for id="+id);
		}
		return MixIns.mixAbsorber(val.clone());
	};
	
	/**
	 * Merges an xml c2c theme into a DB version of the c2c theme.
	 * @param the xml c2c theme to merge into the db version. Uses the c2c theme id to get the db data
	 * @returns a complete c2c theme instance with data from the c2cTheme param mixed into it
	 */
	MediaMgr.prototype.mergeC2CTheme = function(c2cTheme) {
		var val = this.getC2CTheme(c2cTheme.id);
		if(!!val){
			return val.absorb(c2cTheme);
		}
		log("MediaMgr Error: c2cTheme not found for xml theme id="+c2cTheme.id);
		return null;
	};

	/**
	 * Merges an xml chat theme into a DB version of the chat theme.
	 * @param the xml chat theme to merge into the db version. Uses the chat theme id to get the db data
	 * @returns a complete chat theme instance with data from the chatTheme param mix into it
	 */
	MediaMgr.prototype.mergeChatTheme = function(chatTheme) {
		var val = this.getChatTheme(chatTheme.id); // db value
		if(!!val){
			for(var n in chatTheme){
				val[n] = chatTheme[n];
			}
			return val;
		}
		log("MediaMgr Error: chatTheme not found for xml theme id="+c2cTheme.id);
		return null;
	};

	/**
	 * Merges an xml chat spec into a DB version of the chat spec.
	 * @param the xml chat spec to merge into the db version. Uses the chat spec id to get the db data
	 * @returns a complete chat spec instance with data from the chatSpec param mixed into it. Includes
	 * merged child chat theme in return value
	 */
	MediaMgr.prototype.mergeChatSpec = function(chatSpec) {
		var val = this.getChatSpec(chatSpec.id, true); // gets whole subtree
		if(!!val){
			if(!!chatSpec.chatTheme){
				val['chatTheme'] = this.mergeChatTheme(chatSpec.chatTheme);
			}
			for(var n in chatSpec){
				if(n=='chatTheme')
					continue; // skip chat theme... we already have them
				val[n] = chatSpec[n];
			}
			return val;
		}
		log("MediaMgr Error: chatTheme not found for xml theme id="+c2cTheme.id);
		return null;
	};
	
	/**
	 * Merges the DB c2c spec with an xml override model. Designed to safely grab DB
	 * data and selectively override with an xml data model.
	 * @param c2cSpec Object The c2c spec from xml. Guaranteed to have an ID defined. null safe.
	 * @param excludeChatData Boolean If true, return a model with no chat data models defined. If false
	 * or undefined, return the whole subtree.
	 * @return Object A clone of the chat theme for the given id. Never null.
	 * @throws Error if no spec is found for the given xml spec id.
	 */
	MediaMgr.prototype.mergeC2CSpec = function(c2cSpec, excludeChatData) {
		if(!isNullOrUndefined(c2cSpec)){
			// grab the xml version and mix it in with the database version...
			var val = this.getC2CSpec(c2cSpec.id, true); // pure DB version with subtree.
			if(!!excludeChatData){
				delete val.chatSpec;
			}
			if(!!c2cSpec.c2cTheme){
				val['c2cTheme'] = this.mergeC2CTheme(c2cSpec.c2cTheme);
			}
			if(!!c2cSpec.chatSpec && !excludeChatData){
				val['chatSpec'] = this.mergeChatSpec(c2cSpec.chatSpec);
			}
			for(var n in c2cSpec){
				if(n=='c2cTheme' || n=='chatSpec')
					continue; // skip c2c theme and chat spec... we already have them
				val[n] = c2cSpec[n];
			}
			return val;
		}
		else{
			log("MediaMgr Error: bad c2cSpec passed. Check XML rule actions. ref="+c2cSpec)
		}
		return null;				
	};

	/**
	 * Construct a URI instance
	 * @constructor
	 * @class
	 * @param {String} uri
	 * @requires MixIns.Absorber 
	 */
	function URI(uri){
		/* RU */
		this._uri=uri;
		this.parseURI();
	}
	MixIns.prepare(URI).mixIn(MixIns.Absorber);
	
	URI.partNames = ["source","protocol","authority","domain","port","path","dirPath","fileName","query","anchor"];
	/**
	 * parses a URI into component parts
	 * @static
	 * @param {string} _uri uri to be decomposed
	 * @return {Object} object that represents the "decomposed" URI. parts include: 
	 * source, protocol, authority, domain, port, path, dirPath, fileName, query, anchor
	 */
	URI.parseURI=function(_uri){
		/* RU */
		var obj = {qMap:{}};
	    var uriParts = new RegExp("^(?:([^:/?#.]+):)?(?://)?(([^:/?#]*)(?::(\\d*))?)?((/(?:[^?#](?![^?#/]*\\.[^?#/.]+(?:[\\?#]|$)))*/?)?([^?#/]*))?(?:\\?([^#]*))?(?:#(.*))?").exec(_uri);
	    for(var i = 0; i < URI.partNames.length; i++){obj[URI.partNames[i]] = (uriParts[i] ? uriParts[i] : "");}
	    if(obj.dirPath.length > 0){obj.dirPath = obj.dirPath.replace(/\/?$/, "/");}
	    if(obj.query){
			var p = obj.query.split("&");
			for (var i = 0; i < p.length; ++i){
				var kvp = p[i].split("=");
				obj.qMap[kvp[0]] = (kvp.length>1)?unescape(kvp[1]):"";
			}
	    }
	    if(obj.domain){
	    	obj.rootDomain=obj.domain;
	    	var arr = obj.domain.split('.');
	    	if(arr.length>2){
	    		for(var idx = 0;idx < arr.length-2;idx++) arr.shift();
	    		obj.rootDomain=arr.join('.');
	    	}
	    }
	    return obj;
	};
	/**
	 * parses the URI of the instance and saves the data internally
	 */
	URI.prototype.parseURI=function(){
		this.absorb(URI.parseURI(this._uri));
	};
	
	/**
	 * gets the query value of the query name string given.
	 * @param {string} q the name of the query param to be retrieved
	 * @return {string} the value of the query param. null if not existent.
	 */
	URI.prototype.getQ=function(q){
		/* RU */
		var v = this.qMap[q];
		return (typeof v=="undefined"||v==null)?null:v;
	};
	/**
	 * Manages all named functions and provides a framework to invoke
	 * functions in the customer window context
	 * @param {Object} namedFcns
	 * @returns {FcnMgr}
	 */
	function FcnMgr(namedFcns){
		this.fcns = namedFcns;
	}
	FcnMgr.idx = 0;

	/**
	 * gets a named frunction from the registered function lib.
	 * @param {String|Function} fcnOrFcnName The name of the function to retrieve. If a function is passed, then that function is returned.
	 * @throws if fcnOrFcnName param is null or undefined, if the fcn is not found, or the fcnOrFcnName
	 * is of a type other than string or function
	 */
	FcnMgr.prototype.getFcn = function(fcnOrFcnName){
		if(!fcnOrFcnName)
			throw "function name is null or undefined";
		switch(typeof fcnOrFcnName){
		case "string":
		case "function":
			break; // the above are the only types allowed
		default:
			throw "illegal parameter type: "+(typeof fcnOrFcnName);
		}
		var fcn = (typeof fcnOrFcnName=="string")?this.fcns[fcnOrFcnName]:fcnOrFcnName;
		if(!fcn)
			throw "function is null or undefined";
		return fcn;
	}

	/**
	 * Publishes the given function (or named function from the registered lib)
	 * to the parent window and then invokes the function with the given arguments
	 * in the parent window returning the result when complete. May throw certain exceptions.
     * if v3Lander is undefined then return with null from the method
	 * @param fcnOrFcnName {String|Function} Either the name of the function to be invoked or the function itself.
	 * @see FcnMgr#getFcn() for errors thrown
	 * @throws if the function invocation throws an error
	 */
	FcnMgr.prototype.callExternal = function(fcnOrFcnName){
        //RTDEV-867. Issue 'win.v3Lander is undefined' is suitable for Firefox 11 and higher.
        if(!window.self.parent.v3Lander){
            logErrorToTagServer("window.self.parent.v3Lander is undefined, callExternal returns null");
            return null;
        }
		var fcn = this.getFcn(fcnOrFcnName);
		var name = this.publish(fcn);
		var args = this._normArgs(arguments);
		var retval = null;
		try{
            retval = window.self.parent.v3Lander.FMProxy.getFcn(name).apply(window.self.parent, args);
		}catch(err){
			throw "function eval failed. err="+err.toString();
		}
		this.unpublish(name);
		return retval;
	};

	/**
	 * Removes the first argument from the list of arguments provided. We
	 * do this because the remaining args are presumably for the target function
	 * The first arg (0 arg) is the name of the function to be invoked and should not
	 * be passed to that function as an argument.
	 */
	FcnMgr.prototype._normArgs = function(argumnts){
		var args = [];
		if(argumnts.length>1){
			for(var idx=1; idx<argumnts.length; idx++){
				args[idx-1] = argumnts[idx];
			}
		}
		return args;
	};

	/**
	 * @param fcnOrFcnName {String|Function}
	 * @see FcnMgr#getFcn() for errors thrown
	 * @throws if the function invocation throws an error
	 */
	FcnMgr.prototype.exec = function(fcnOrFcnName){
		var fcn = this.getFcn(fcnOrFcnName);
		try{
			return fcn.apply(self,  this._normArgs(arguments));
		}catch(err){
			throw "function eval failed. err="+err.toString();
		}
	};
	/**
	 * publishes a given function
	 */
	FcnMgr.prototype.publish = function(fcn, name){
		var name = !!name?name:'fcn_'+FcnMgr.idx++;
        window.self.parent.v3Lander.FMProxy.addFcn(name, fcn.toString());
		return name;
	};

	/**
	 * Deletes a named function from the parent peer.
	 */
	FcnMgr.prototype.unpublish = function(name){
        window.self.parent.v3Lander.FMProxy.removeFcn(name);
	};
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
			this.isLSused = false;          // True if localStorage is used.
			this.cntHandlerTried = 0;       // how many times checked 3rd party cookie commited handler function.
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
			if ( cookieData && cookieData.pc && cookieData.pc == 2 ) {
				this.isLSused = true;
			}
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
			  *
			  * @param handler - handler to be called when committed
			  */
			CookieMgr.prototype.when3rdPartyCookieCommitted=function( vcnt ){

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

		/**
		 * DeltaSender is responsible sending objects serially to a URI
		 *
		 * @constructor
		 * @param {String} uri The uri to which this "sender" will forward specifies whether this site uses cross-domain cookies
		 * @author mkorich
		 * @borrows RemoteCaller#onRemoteCallback as #onRemoteCallback
		 * @borrows RemoteCaller#callRemote as #callRemote
		 * @see RemoteCaller
		 */
		function DeltaSender(uri){
			this.waiting = false;
			this.uri = uri;
			this._pid = 0;
			this.dObj = MixIns.mixAbsorber();
            this.isIE = isIE();
		}
		MixIns.prepare(DeltaSender).mixIn(MixIns.RemoteCaller).mixIn(MixIns.FrameworkModule).mixIn(MixIns.JSON);
		DeltaSender.prototype.onRemoteCallback = function(){
			this.waiting = false;
			this.send();
			if(this._pid!=0){
				clearInterval(this._pid);
				this._pid = 0;
			}
		};
		DeltaSender.prototype.send = function(o){
			if(o){
				this.dObj.absorb(o, true);
				this.hasData = true;
			}
			if(!this.waiting && this.hasData){
				this.waiting = true;
                var data =  this.prepareDataToSend(this.dObj);
                if (this.isIE && ROM.isOversizeRemoteCall(this.uri, data)) {
                    this.sendIEPartData(this.dObj);
                } else {
				    this.callRemote(this.uri, data);
				    this.dObj = MixIns.mixAbsorber();
				    this.hasData=false;
                }

				this._pid = setInterval("Inq.CM.dsender.send();", 500);
			}
		};
        /**
         * prepare data to send, add some required field (e.g. siteId) ..
         * @param data data to send
         * @return fixed data
         */
        DeltaSender.prototype.prepareDataToSend = function (data) {
            return {siteID:siteID, c: this.stringify(data)};
        };
         /**
         * Send part of data (check IE limits)
         * @param data data to send
         */
        DeltaSender.prototype.sendIEPartData = function(data) {
            var partData = {};
            for (var prop in data) {
                var part = data[prop];
                if (typeOf(part) == "function") {
                    continue;
                }

                if (this.preparePartData(partData, part, prop)) {
                    /* obj[prop] is in part - delete from obj */
                    delete data[prop];
                }
                else {
                    /* partData is ready to sending */
                    break;
                }
            }
            this.callRemote(this.uri, this.prepareDataToSend(partData));
        };
        /**
         * Prepare part of data to send
         * @param partData part of data to send
         * @param data data to send
         * @param name name of parameter
         * @return true if allow to add more data (all data from obj was added),
         * false - if not all data from obj was added
         */
        DeltaSender.prototype.preparePartData = function (partData, data, name) {
            if (!data) {
                return true;
            }
            var dataToSend = {};
            partData[name] = dataToSend;
            var anyDataAdded = false;
            for (var prop in data) {
                if (typeOf(data[prop]) == "function") {
                    continue;
                }
                /* add property to send data */
                dataToSend[prop] = data[prop];
                if (ROM.isOversizeRemoteCall(this.uri, this.prepareDataToSend(partData))) {
                    if (anyDataAdded) {
                        /* remove property from send data*/
                        delete dataToSend[prop];
                    } else {
                        /* Can't add any data, delete dataToSend from part*/
                        delete partData[name];
                    }
                    return false;
                }
               anyDataAdded = true;
               delete data[prop];
            }
            return true;
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
				var pcVar = new Variable("pc", {}, resources["pc"]);
				pcVar.setValue({});
				var enabled = !!this.read(resources["pc"], "pc");

				if (enabled)
					CM.expireCookie("pc");

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


	/**
	 * Instantiates a cookie resource for a single named cookie.
	 * @class CookieResource represents a single, named cookie for a specific domain.
	 * @param {String} id the unique identifier for the resource
	 * @param {String} name the cookie name
	 * @param {String} path the path is typically '/' but can be a more specific resource location in the domain if needed
	 * @param {Number} lifetime the number of ms which this cookie resource should remain available.
	 * 			A null/undefined lifetime creates a cookie that lives only during the browser session
	 * @param {String} domain the host domain is interested in these cookies
	 * @param {boolean} secure a boolean true or false
	 * @constructor
	 * @class CookieResource
	 */
	function CookieResource(id, name, path, lifetime, domain, secure, cm ) {
		this._resource(id);
		this._observable();
		/*
		 * Provides the name of this particular cookie, not
		 * any specific variable or name/value pair value.
		 */
		this.getName 	 = function(){ return name; 	};
		this.getPath 	 = function(){ return path; 	};
		this.getLifetime = function(){ return lifetime; };
		this.getDomain	 = function(){ return domain;	};
		this.isSecure	 = function(){ return secure;   };
		this.getSecure   = function(){ return this.isSecure(); };
		this.cm = cm;
	}
	MixIns.prepare(CookieResource).mixIn(MixIns.Resource).mixIn(MixIns.JSON).mixIn(MixIns.Observable);
	
	CookieResource.prototype.setCookieMgr = function(cm) {
		this.cm = cm;
	};
	
	CookieResource.prototype.isListener = function(l) {
		 return !!(l && (l.onResourceReset && typeof l.onResourceReset == "function")); 
    };

    CookieResource.prototype.fireResourceResetEvent = function() {
        function f(l, evt) {
            try {
                if (!!l.onResourceReset) {
                    l.onResourceReset(evt);
                }
            } catch(e) {
                log("Error firing event ResourceReset on " + l.toString() + ":" + e);
            }
        }
		var event = {customerID: Inq.getCustID()};

        this._fireEvt(f, event);
    };
    
    /*
	 * Add a name-value pair to the cookie if the pair's
	 * name doesn't exist, otherwise update the name with 
	 * the new value.
	 * 
	 * Being a Resource, this object must implement this 
	 * method.
	 */
	CookieResource.prototype.write = function(name, value) {
		if (this.cm) {
			this.cm.write(this, name, value);
		}
	};
	
	/*
	 * 
	 * Being a Resource, this object must implement this 
	 * method.
	 */
	CookieResource.prototype.read = function(name) {
		var value = this.cm.read(this, name); // expecting an obj
		return value;
	};
	
	
	/*
	 * 
	 * Being a Resource, this object must implement this 
	 * method.
	 */
	
	CookieResource.prototype._serialize = function(value) {
		return this.stringify(value);
	};
	
	CookieResource.prototype._unserialize = function(value) {
		return this.parse(value);
	};
	
	/**
	 * Being a Resource, this object must implement this 
	 * method. 
	 * @see Resource
	 */
	CookieResource.prototype.getResourceID = function() {
		// this property has been added to the object by the Resource mixin during construction
		return this._rsrcID; 
	};


	/**
	 * Instantiates a web resource for a single url.
	 * @class WebResource Allows access to data as RPC (Remote Procedure Call) paradigm
	 * @param {String} id the unique identifier for the resource
	 * @param {String} url destination url for resource
	 * @constructor
	 */
	function WebResource(id, url, permissions, method ) {
		this._resource(id);
        this.url = url;
		this.permissions = permissions;
		this.method = method;
	}
	MixIns.prepare(WebResource).mixIn(MixIns.Resource).mixIn(MixIns.JSON).mixIn(MixIns.RemoteCaller);
	
	/**
	 * Being a Resource, this object must implement this 
	 * method. Stubbed.
	 */
	WebResource.prototype.write = function(name, value) {};
	
	/**
	 * Being a Resource, this object must implement this 
	 * method. Stubbed.
	 */
	WebResource.prototype.read = function(name) {};
	
	/**
	 * 
	 * Being a Resource, this object must implement this 
	 * method.
	 */
	WebResource.prototype._serialize = function(value) {
		return value;
	};
	
	WebResource.prototype._unserialize = function(value) {
		return value;
	};

	/**
	 * store js variables
	 * @class JSResource Allows to store js variables
	 * @param {String} id the unique identifier for the resource
	 * @constructor
	 */
	function JSResource(id, permissions) {
		this._resource(id);
        this.data = [];
	}
	MixIns.prepare(JSResource).mixIn(MixIns.Resource);

	/*
	 * Add a name-value pair to the cookie if the pair's
	 * name doesn't exist, otherwise update the name with
	 * the new value.
	 *
	 * Being a Resource, this object must implement this
	 * method.
	 */
	JSResource.prototype.write = function(name, value) {
        this.data[name] = value;
	};

	/*
	 *
	 * Being a Resource, this object must implement this
	 * method.
	 */
	JSResource.prototype.read = function(name) {
        try {
            return this.data[name];
        }
        catch(e) {
            
        }
        return null;
	};

	/*
	 *
	 * Being a Resource, this object must implement this
	 * method.
	 */
	JSResource.prototype._serialize = function(value) {
		return value;
	};

	JSResource.prototype._unserialize = function(value) {
		return value;
	};
	/**
	 * Create an instance of Variable
	 *
	 * @constructor
	 * @param {string} name the name of this variable
	 * @param {object} value the initial value of this variable
	 * @param {Resource} resource the Resource that will be the repository for this variable
	 * @param {string} optional short name of a variable instance, used for persistence.
	 * @param {function} fnCast a function to cast this variable to a specific type
	 * @requires Resource
	 *
	 */
	function Variable(name, dfltValue, resource, shortName, fnCast, fnSer) {
		this.name = name;
		this.resource = resource;
		this.dfltValue = dfltValue;
		this.shortName = shortName;

		if (typeof fnCast == "function") {
			this._cast = fnCast;
		}

		if (typeof fnSer == "function"){
			this._serialize = fnSer;
		}
       
		if (!isNullOrUndefined(resource) && resource.observable)	{
			resource.addListener(this);
		}
				
	}

	MixIns.prepare(Variable).mixIn(MixIns.Absorber);	
	
	/**
	 * Reset the variable instance.
	 * @param evt
	 */
	Variable.prototype.onResourceReset = function(evt){
	    this.init();
	};

	/**
	 * Retrieve the name of a variable instance
	 * @return the name of the variable
	 * @type string
	 */
	Variable.prototype.getName = function(){
		return this.name;
	};

	/**
	 * Retrieve the optional short name of a variable instance, used for persistence.
	 * @return the short name of the variable
	 * @type string
	 */
	Variable.prototype.getShortName = function(){
		return this.shortName;
	};

	/**
	 * Returns name of variable instance used to persist variable - short name if available, otherwise usual (long) name.
	 * @return the short name of the variable
	 * @type string
	 */
	Variable.prototype.getPersistentName = function(){
		if (isNullOrUndefined(this.getShortName())) {
			return this.getName();
		} else {
			return this.getShortName();
		}
	};

	/**
	 * Retrieve the resource of a variable instance
	 * @return the resource of the variable
	 * @type Resource
	 */
	Variable.prototype.getResource = function(){
		return this.resource;
	};


	/**
	 * Resets the var value to default value provided at construction.
	 */
	Variable.prototype.reset = function(){
		this.setValue(this.dfltValue);
	};
	/**
	 * initializes the value of the variable from the resource when resource is ready.
	 */
	Variable.prototype.init = function(){
		if(this.getValue()==null) {
			this.setValue(this.dfltValue);
		}
	};
	/**
	 * Default cast for this variable instance
	 * @param {Object} v the variable to cast
	 * @return the casted value
	 */
	Variable.prototype._cast = function(v) {
		return v;
	};

	/**
	 * Default serialize method for this variable instance
	 * @param {Object} v the variable to cast
	 * @return the casted value
	 */
	Variable.prototype._serialize = function(v) {
		return v;
	};

	/**
	 * Retrieve the value of this variable
	 * @return the variable's value using the casting function if available, null if name doesn't exist
	 * @type Object
	 */
	Variable.prototype.getValue = function() {
		var r = this.getResource();
		var val = null;

		// if a "short name" exists and a value is stored under the long (original) name, replace long name with short
		if(!!this.getShortName() && (this.getShortName()!=this.getName())){ // if short and long names are same, don't bother
			var valByName = r.read(this.getName());
			var valByPerName = r.read(this.getShortName());				
			if(!isNullOrUndefined(valByName)) {
				// we shouldn't store under long name if short name is available
				// deleting long name by supplying undefined value parameter to write invocation
				r.write(this.getName());

				// if some value stored under short name then it is newer than value under long name
				// otherwise store removed value under short name
				if(!valByPerName && !(valByPerName===0)) {
					r.write(this.getShortName(), valByName);
					valByPerName = valByName;
				}
			}
			val = valByPerName;
		}
		else {
			val = this.getResource().read(this.getPersistentName());
		}

		return (isNullOrUndefined(val))?null:this._cast(val);
	};


	/**
	 * Set the variable to a new value
	 * @param {Object} newValue the new value of this variable
	 * @return the new value of this variable
	 * @type Object
	 */
	Variable.prototype.setValue = function(newValue) {
		this.getResource().write(this.getPersistentName(), this._serialize(newValue));
		return newValue;
	};

	function ListVariable(name, dfltValue, resource, shortName, maxEntries) {
		this.name = name;
		this.dfltValue = dfltValue;
		this.resource = resource;
		this.shortName = shortName;
		if(!!maxEntries) {
			this.maxEntries = maxEntries;
		}
	}
	ListVariable.prototype = new Variable();
	ListVariable.prototype.constructor = ListVariable;
    
	ListVariable.prototype.append = function(arrayParam){
		var arr = this.getValue();
		arr.append(arrayParam);
		arr.constrain(this.maxEntries);
		this.setValue(arr);
	};

	ListVariable.prototype.prepend = function(arrayParam){
		var arr = this.getValue();
		arr.prepend(arrayParam);
		arr.constrain(this.maxEntries);
		this.setValue(arr);
	};

	/**
	 * Date Variable class extending generic Variable with specific and predefined serialize and cast(deserialize) methods.
	 */
	function DateVar(name, dfltValue, resource, shortName) {
		this.name=name;
		this.dfltValue = dfltValue;
		this.resource = resource;
		this.shortName = shortName;
	}

	DateVar.prototype = new Variable();
	DateVar.prototype.constructor = DateVar;
	DateVar.prototype._serialize = function(o){
		return (o && o.constructor===Date)?Math.floor(o.getTime()):o;
	};
	DateVar.prototype._cast = function(o){   
		return (typeOf(o)=="number")?new Date(o):o;
	};

	/**
	 * Date List Variable class extending generic ListVariable with date specific serialize and cast(deserialize) methods.
	 */
	function DateListVar(name, dfltValue, resource, shortName, maxEntries) {
		this.name = name;
		this.dfltValue = dfltValue;
		this.resource = resource;
		this.shortName = shortName;
		if(!!maxEntries) {
			this.maxEntries = maxEntries;
		}
	}
	DateListVar.prototype = new ListVariable();
	DateListVar.prototype._serializeElement = DateVar.prototype._serialize;
	DateListVar.prototype._castElement = DateVar.prototype._cast;

    /**
     * Map variable class extending generic ListVariable with map specific methods.
     * @param name
     * @param dfltValue
     * @param resource
     * @param optional short name of a variable instance, used for persistence.
     */
    function MapVariable(name, dfltValue, resource, shortName) {
        this.name = name;
        this.dfltValue  = dfltValue;
        this.resource = resource;
		this.shortName = shortName;
	}

    MapVariable.prototype = new Variable();
    MapVariable.prototype.constructor = MapVariable;

    MapVariable.prototype.set = function(key, value) {
        var map = this.getValue();
        map.set(key, value);
        this.setValue(map);
    };

    MapVariable.prototype.unset = function(key) {
        var map = this.getValue();
        map.unset(key);
        this.setValue(map);
    };
    MapVariable.prototype.clear = function() {
        var map = this.getValue();
        map.clear();
        this.setValue(map);
    };
    MapVariable.prototype.each = function(fnc) {
        var map = this.getValue();
        map.each(fnc);
        this.setValue(map);
    };

	/**
	 * PersistenceMgr in charge of all variables and manages resources as well.
	 * @class Persistence Manager. Charged with maintaining persistence access for all 
	 * framework managers including cookie based persistence.
	 * @constructor
	 * @param {String} id Unique framework id
	 * @param {Object} xd true if cross-domain active, else false
	 * @borrows Observable#addListeners as #addListeners
	 * @borrows Observable#clearListeners as #clearListeners
	 * @borrows Observable#_fireEvt as #_fireEvt
	 * @borrows Observable#addListener as #addListener
	 * @borrows Observable#isListener as #isListener
	 * @borrows FrameworkModule#init as #init
	 * @borrows FrameworkModule#start as #start
	 * @borrows FrameworkModule#reset as #reset
	 * @borrows JSON#stringify as #stringify
	 * @borrows JSON#parse as #parse
	 */
	function PersistenceMgr(id, xd){
		this._frameworkModule(id);
		this.xd = xd;
		this._observable();
		this._vartable = {};
		this.CM = CookieMgr.getInstance(this.xd);
		
		/**
		 * Obtains a ref to a variable (for an optional given rule)
		 * @param {String} varName Name of the variable to seek.
		 * @param {String} [ruleName] Optional rule name to which the variable sought belongs.
		 */
		this.getVar = function(varName, rule){
			var rv = this._vartable[varName+(rule?("_"+rule.getID()):"")];
			if(!rv) {
				rv = this._vartable[varName];
			}
			return !!rv?rv:null;
		};
		
		/**
		 * Adds an array of variables for a given rule name
		 * @param {Array} varArr array of variables to manage
		 * @param {String} [ruleName] the optional rule name to which the variables belong.
		 */
		this.addVars = function(varArr){
			for(var i=0; i<varArr.length; i++){
				this.addVar(varArr[i]);
			}
		};
		/**
		 * Adds a variables for a given rule name
		 * @param {Variable} varArr object of type {@link Variable} to manage
		 * @param {String} [ruleName] the optional rule name to which the variable belongs.
		 * If undefined or null, only the rule name will be used to index the var.
		 */
		this.addVar = function(v){
			this._vartable[v.getName()] = v;
		};
		
		/**
		 * fires data calls for PersistenceMgr
		 * @memberOf PersistenceMgr.prototype
		 * @override
		 */
		this.fireDataReady= function(){
			for(var idx=0; idx<this._listeners.length; idx++){
				try {
					this._listeners[idx].onDataReady({});
				} catch(e) {
					log(e);
					// continue alerting listeners
				}
			}
		};
		
		/**
		 * 
		 */
		this.isListener = function(l){
			return (l && l.onDataReady)?true:false;
		};
		
		/** 
		 * initializes PersistenceMgr
		 */
		this.init = function(){
			if (this.initialized) return;
			this.initialized=true;
			for(var aVar in this._vartable) {
				this._vartable[aVar].init();
			}
			log(this.getID()+" initialized.");
		};
						
		/** 
		 * resets resource
		 * @param {String} resourceID  
		 */
		this.reset = function(resourceID){
			if (!isNullOrUndefined(resourceID))	{
				this.CM.clear(resourceID);
				var resource = resources[resourceID];
				if (!isNullOrUndefined(resource))	{
					resource.fireResourceResetEvent();
					log("resource reset for resourceID : "+resourceID);
				}	
			}
		};	
		
		/** 
		 * startup call for PersistenceMgr
		 */
		this.start = function() {
			if (this.started) return;
			this.started=true;
		};

		this.getCookieMgr = function() {
			return this.CM;
		};

		/**
		 * Return the cross-domain status of this object
		 * @return {boolean} true if this object has been configured for cross-domain support,
		 * false otherwise
		 */
		this.isCrossDomain = function() {
			return this.xd;
		};
	}
	
	/**
	 * Static field instance of the singleton PersistenceMgr
	 */
	PersistenceMgr.PM = null;
	
	/**
	 * Create an instance of the PersistenceMgr. This singleton creation
	 * pattern should ALWAYS be used by other objects instead of creating
	 * a PM with its constructor.
	 * @param {boolean} xd true if site is configured for cross-domain, false otherwise
	 * @return a singleton instance of PersistenceMgr
	 */
	PersistenceMgr.getInstance = function(xd) {
		if (PersistenceMgr.PM == null) {
			PersistenceMgr.PM = new PersistenceMgr("PM", xd);
		}
		return PersistenceMgr.PM;
	};
		

	MixIns.prepare(PersistenceMgr).mixIn(MixIns.Observable).mixIn(MixIns.FrameworkModule);
	PersistenceMgr.mixIn(MixIns.JSON).mixIn(MixIns.Absorber);

	/**
	 * Conducts all remote operations. Singleton class.
	 * @class RemoteOpsMgr (ROM). All remote operations (chat launch requests etc) are called through
	 * this class.
	 * @constructor
	 * @param data initial data for the ROM
	 * @borrows Absorber#absorb as #absorb
	 * @borrows FrameworkModule#init as #init
	 * @borrows FrameworkModule#start as #start
	 * @borrows FrameworkModule#reset as #reset
	 * @see RemoteCaller
	 */
	
	function RemoteOpsMgr(id, data) {
		this._frameworkModule(id);
		/** queue for all waiting remote ops */
		this.waitingQ = {};
		this.ch = [];
        for (var index = 0; index < 50; index ++) {
            this.ch[index] = new Image();
        }
		this.i = 0;
        this.pIdx = 0;
		this.ridx = 0;
        this.isIE = isIE();
		this.absorb(data);
        this.lastSendTime = new Date();
        this.postTime = [];
        this.sendCount = 0;
		/** 
		 * creates a random number as a base 36 string
		 */
		this.rand = function(n){
			return (Math.round(Math.random()*1000000000000)).toString(36);
		};
		/** 
		 * takes a js object of n-v pairs and serializes them to a URL type params string.
		 * @param {Object} d Data in n-v pair format. For example: {dat1:"value1",num:3424}
		 * @param {boolean} avoidRand  flag if it true than we don't add "_rand" param
		 */
		this.toParamString= function(d, avoidRand){
			var rv = "";
			if(!d) return rv;
			var separator  = "";
			if (avoidRand != true) {
				rv = "_rand=" + encodeURIComponent(this.rand()); 
				separator = "&";
			}
			for(var idx in d){
				if(typeof d[idx]!="function" && d[idx]!=null){
					rv += (separator + idx + "=" + encodeURIComponent(d[idx]));
					separator = "&";
				}
			}
			return rv;
		};
        this.sleep = function(mlSec) {
            var date = new Date();
            var curDate = null;
            do {
                curDate = new Date();
            } while(curDate-date < mlSec);
        };
        this.checkSendTime = function () {
            var curTime = new Date();
            // check time of last n send
            if (curTime - this.lastSendTime > 1000) {
                // more than 1sec - lets work
                this.sendCount = 0;
                this.lastSendTime = curTime;
                return;
            }
            // check: is there 'free' img
            if (this.sendCount < this.ch.length - 1) {
                this.sendCount ++;
                this.lastSendTime = curTime;
                return;
            }
            // wait 55 mlsec for each img
            this.sleep(this.ch.length * 55);
            this.sendCount = 0;
            this.lastSendTime = new Date();
        };
        /**
         * Detects overflow of the IE url GET request length limit.
         * add all needed data, and check size of all data
         * @param {String} url The base protocol/server/port combo to be used to construct the URL
         * @param {Object} data the name-value pairs to be placed on the URL as parameters.
         * @return true if request length > limit.
         */
        this.isOversizeRemoteCall = function (url, data) {
            this.prepareDataToSend(data, null);
            return this.isOversizeCall(url, data);
        };
        /**
         * Detects overflow of the IE url GET request length limit.
         * @param {String} url The base protocol/server/port combo to be used to construct the URL
         * @param {Object} data the name-value pairs to be placed on the URL as parameters.
		 * @link http://support.microsoft.com/kb/208427
         */
		this.isOversizeCall = function(url, data){
			var pstr = this.toParamString(data);
			pstr = ((pstr && pstr.length>0)?"?":"") + pstr;
			var reqURL = url+pstr;
			return (this.isIE && reqURL.length>2048);
		};
		/** 
		 * Sends data to a server (no callback)
		 * If this is going to the vanity domain and it is an "oversized call" we will "POST" the data via the IFrame/Proxy
		 *    this avoids the problem of length restrictions in "GET" methodology		 
         * @param {String} url target URL without parameters
         * @param {Object} data the name-value pairs to be placed on the URL as parameters
         */
		this.send = function(url, data){
            var baseVanity = urls.vanityURL;
            var isVanity = url.indexOf(baseVanity) == 0;
            var hasLogdata = url.indexOf("/logdata") != -1;
            // RTDEV-1238: "codeVersion" parameter is used for investigation only and contains a time of inqChatLaunch***.js and tcFramework***.js generation as number.
            //             The parameter is defined in inqChatLaunch***.js in v3Lander object (see code of inqChatLaunch.jsp) and is added as URL parameter for tcFramework***.js and InqFramework.js.
            if (isVanity && hasLogdata && (data) && (v3Lander)) {
                data["codeVersion"] = v3Lander.codeVersion;
            }
            if (isVanity && this.isOversizeCall(url, data)) return this.post(url, data);

			try {
                this.checkSendTime();
                if (this.isOversizeCall(url, data)) {
                    this.postToServer(url, data);
                    return;
                }
				var idx = this.i++ % this.ch.length;
				var pstr = (typeof data=="string")?data:this.toParamString(data);
				this.ch[idx].src = url+"?"+pstr;
			} catch (e){
				log("SvrCom.sendToServer ERROR:" + e);
			}
		};
		/** 
		 * posts data to a server (no callback)
		 */
		this.post = function(url, data){
			try {				 
				var pstr = (typeof data=="string")?data:this.toParamString(data);
				
	            var boxID = "box" + Math.floor(Math.random()*1000011);
	            var port = (inqFrame.location.port!="")?":"+inqFrame.location.port:"";
	            var parentURL = inqFrame.location.protocol + "//"  +  inqFrame.location.hostname + port + inqFrame.location.pathname ;
	            var postCookieRequest = "POSTBR30" + "||" + boxID + "||" + "" + "||" + parentURL +  "||" + encodeURIComponent(url+"?"+pstr) ; 
                (CM).postRequestToIframeProxy(postCookieRequest, boxID);				 
			} catch (e){
				log("SvrCom.sendToServer ERROR:" + e);
			}
		};
        
        this.postToServer = function(action, data) {
            if (isNullOrUndefined(data) || isNullOrUndefined(action)) {
                return;
            }
            var doc_ = document;
            var div = doc_.getElementById("inqPostBox");
            if (!div) {
                div = Inq.createFloatingDiv("inqPostBox", 0, 0, 1, 1);
                div.style.display = "";
                div.style.opacity = "0";
            }

            var idx = this.pIdx % 10;
            this.pIdx ++;
            var iframe = doc_.getElementById("box" + idx);
            if (iframe) {
                if (!isNullOrUndefined(this.postTime[idx])) {
                    var curTime = new Date().getTime();
                    var waitTime = 40;
                    if (curTime - this.postTime[idx] < waitTime) {
                        this.sleep(waitTime);
                    }
                }
                div.removeChild(iframe);
            }
            else {
                iframe = Inq.createHiddenIFrame("box" + idx, 0, 0, 1, 1);
            }
            iframe.style.overflow = "hidden";
            iframe.style.display = "";
	        iframe.width=1;
			iframe.height=1;
            iframe.src = "javascript://";
            iframe.style.border = "none";
            div.appendChild(iframe);
            var doc = null;
            if (iframe.contentDocument) {
                doc = iframe.contentDocument;
            } else if (iframe.contentWindow) {
                doc = iframe.contentWindow.document;
            } else if (iframe.document) {
                    doc = iframe.document;
            }
            if (doc != null) {
                doc.open();
                doc.write('<form name="aform' + idx + '" id="aform' + idx + '" action="' + action + '" method="POST">');
                for (var name in data) {
                    if (typeof data[name] == "function") continue;
                    doc.write('<textarea name="' + name + '">' + data[name] + '</textarea><br>');
                }
                doc.write('</form><br>');
                doc.close();
                doc.getElementById("aform" + idx).submit();
                this.postTime[idx] = new Date().getTime();
            }
        };

        /**
		 * composes a url from data
		 * @param {String} url Url part of the URL to be assembled.
		 * @param {Object} data Map of name-value pairs to be "ampersand" appended to the given url
		 * @param {boolean} avoidRand shows wether we should do not add "_rand"
		 * @TODO RhinoUnit Tests
		 */
		this.composeURL = function (url, data, avoidRand){
			var p = this.toParamString(data, avoidRand);
			var idx = url.indexOf('?');
			if(p.length>0){
				if(idx < 0){
					p = "?" + p;
				}
				else if(idx < (url.length-1)){
					p = '&' + p;
				}
				return url + p;
			}
			return url;
		};
        /**
         * Add needed data
         * @param data data to send
         * @param caller - caller, if caller = null, then check mode
         */
		this.prepareDataToSend = function(data, caller) {
            if (isNullOrUndefined(caller)) {
                data.rid = "r1234567890";
            }
            else {
                data.rid = this._queueCaller(caller);
            }

        };
		/**
		 * Sends data to remote destination url with callback.
		 * data payload
		 * If this is going to the vanity domain we will "POST" the data via the IFrame/Proxy
		 *    this avoids the problem of length restrictions in "GET" methodology
		 */
		this.doRemoteCall= function(url, data, caller){
			var _win=inqFrame;
            this.prepareDataToSend(data, caller);
			var pstr = this.toParamString(data);
			var pstrFixed = ((pstr && pstr.length>0)?"?":"") + pstr;
			var baseVanity = urls.vanityURL;
			if (this.isOversizeCall(url, data)) {
				if (url.indexOf(baseVanity)== 0) {
					this.post(url, pstr);				
				}
				else {
					/* We should never get here, unless we are doing a remote call to a url that is NOT our vanity domain
					 * This is always an error and should never happen
					 */
					 var fault = new Error("remote call to non-vanity domain");
					 ROM.post(urls.loggingURL, {level:'ERROR', line: ('VANITY DOMAIN ERROR: '+catchFormatter(fault))});  
				}
			}
 			else {
				var s = _win.document.createElement("script");
				s.setAttribute("type", "text/javascript");
				s.setAttribute("language", "JavaScript");
				s.setAttribute("src", url+pstrFixed); 		 	
				_win.document.getElementsByTagName("head")[0].appendChild(s);
			}			
		};
		/**
		 * Generates a new remote id string (sequentially) so unique callbacks may be made
		 * to the calling RemoteCaller.
		 */
		this.newRID= function(){
			return "r"+(this.ridx++);
		};
		this._queueCaller= function(caller){
			var rid = this.newRID();
			if(caller && caller.onRemoteCallback){
				this.waitingQ[rid]=caller;
			} else {
				throw "caller null or not an instance of RemoteCaller";
			}
			return rid;
		};
		this._dequeueCaller= function(rid){
			var c = this.waitingQ[rid];
			if(c){
				delete this.waitingQ[rid];
				return c;
			}
			return null;
		};
		/** 
		 * Universal callback for all remote ops. Used by the remote server to "call back" the
		 * calling RemoteCaller object.
		 */
		this.onRemoteCallback= function(rid, data){
			if(rid){
				var caller = this._dequeueCaller(rid);
				if(caller!=null){
					try{
						caller.onRemoteCallback(data);
					}
					catch(err){
						log(err);
					}
				}
			}
		};
		this.init = function() {
			if (this.initialized) {return;}
			this.initialized = true;
		};
		
		this.start = function() {
			if (this.started) {return;}
			this.started = true;
		};
			
	}
	MixIns.prepare(RemoteOpsMgr).mixIn(MixIns.Absorber).mixIn(MixIns.FrameworkModule);

	/**
	 * CustomEvent class
	 * @class Represents a custom event definition
	 * @constructor
	 * @borrows Absorber#absorb as #absorb
	 * @borrows Cloneable#clone as #clone
	 * @see Absorber
	 * @param {Object} cEvtData custom event data definition
	 * Incoming data defined as follows:
	 * {name:"Converted", getEvtData: function(){ return {products:PM.getCookie("productsCookie")};}, aliases:[{name:"onSoldEvent", getEvtData: function(){return {"products":Inq.safe("inqSalesProducts")};}}]}
	 */
	function CustomEvent(cEvtData){
		this.absorb(cEvtData);
	}

	/**
	 * Checks any given object to see if any of it's methods 
	 * are supported listeners of this custom event.
	 * @returns {boolean} True if the given object sports listener 
	 * methods of the custom event or any of its aliases. False otherwise.
	 */
	CustomEvent.prototype.supportsListener = function(l){
		if(l){
			var lFcn = l["on"+this.name];
			if(lFcn && typeof lFcn=="function"){
				return true;
			}
			if (this.aliases && this.aliases.length) {
				for(var idx=0; idx<this.aliases.length; idx++){
					lFcn = l[this.aliases[idx].name];
					if(lFcn && typeof lFcn=="function"){
						return true;
					}
				}
			}
		}
		return false;
	};

	/**
	 * Invokes all methods supported by the CustomEvent on a given object with proper data.
	 * @param {object} rule the rule that fired the custom event
	 * @param {object} evt event object that triggered the rule firing this custom event.
	 * It is a source of contextual data that may be used to compose custom event data.
	 */
	CustomEvent.prototype.getData = function(rule, evt){

		// getEvtData method is expected in every CustomEvent object instance
		// The method itself is not available from object prototype, it is generated when business rules are rendered
		var data = this.getEvtData(rule, evt);

		// evtDataSupplement object is optional and is added if rule firing this custom event decides
		// to provide additional data
		if (this.evtDataSupplement) {
			MixIns.mixAbsorber(data);
			data.absorb(this.evtDataSupplement);
		}
		return data;
	}

	/**
	 * Invokes all methods supported by the CustomEvent on a given object with proper data.
	 * @param {object} l Observer object on which to invoke the methods for the customer event
	 * @param {object} rule the rule that fired the custom event
	 */
	CustomEvent.prototype.invoke = function(l, rule, evt){
		if(this.supportsListener(l)){
			var lFcn = l["on"+this.name];
			if(lFcn && typeof lFcn=="function"){
				l["on"+this.name](this.getData(rule, evt));
			}
			if(this.aliases){
				for(var idx=0; idx<this.aliases.length; idx++){
					var aliasEvt = this.aliases[idx];
					lFcn = l[aliasEvt.name];
					if(lFcn && typeof lFcn=="function"){
						try {
							var s =MixIns.JSON.stringify(aliasEvt.getEvtData(rule, evt)); 
							var sName = MixIns.JSON.stringify(aliasEvt.name);
							/* l is a local variable and not known to the eval function [on all browsers]
							 * So we must define a label for it temporarily in the client page and
							 * ... run it as belonging to the parent
							 * This then will run in the client window                              							 
							 */
							var label4l = "_inq_el_" +  (Math.round(Math.random()*982451653)).toString(36) ;
							win[label4l] = l ;	/* Publish (l) in the client window so it can be accessed in web-kit browsers and IE */							
							var code = "(parent)."+label4l+"[" + sName + "]("+s+")"; /* Note: parent is in parenthesis so "this" will point to it ! */
							eval(code); // invoke the alias methods too on the listener with alias data definitions.
							try {win[label4l] = null ; delete win[label4l];} catch(e){}	/* Unpublish (l) in the client window*/						
						}catch(err){
							err["within"] = "CustomEvent.invoke";		/* Specify where the problem is for the trace information */
							var sErr = catchFormatter(err) ;			/* Have catchFormater format the stack trace for log and for sending to the tagserver host */
							log("Error while calling the client side listeners"+decodeURIComponent(sErr));
							ROM.post(urls.loggingURL, {level:"info", line: ("Failure in CustomEvent invoke "+sErr)});  
						}	
					}
				}
			}
		}		
	};

	/**
	 * Returns string representation of this object.
	 */
	CustomEvent.prototype.toString = function(){
		return "CustomEvent " + this.name;
	};

	MixIns.prepare(CustomEvent).mixIn(MixIns.Absorber).mixIn(MixIns.Cloneable);

	/**
	 * Returns copy of this object.
	 */
	CustomEvent.prototype.clone = function(){
		return new CustomEvent(this);
	};

	
	/**
	 * Singleton class that routes all observers to their respective observables. 
	 * Mitigates linkage amongst framework managers through delegation.
	 * @class Event Manager is a singleton class that routes all observers to their respective observables
	 * @constructor
	 * @borrows Absorber#absorb as #absorb
	 * @borrows FrameworkModule#init as #init
	 * @borrows FrameworkModule#start as #start
	 * @borrows FrameworkModule#reset as #reset
	 * @see Absorber
	 * @see FrameworkModule
	 */
	function EvtMgr(id){
		this._frameworkModule(id);
		this._observable(); // contract with MixIn.Observable
		this.initialized = false;
		this.observables = [];
		this.cEvts={};

		this.init = function(){
			if(!this.initialized){
				this.initialized=true;
			}
		};
		
		/**
		 * Appends an array of observables to the internal array of managed observables.
		 * @param {Object} ol Object whose children MAY be {@link Observable} instances to be appended.
		 * This method will test for observables and manage them when found.
		 * @see Observable
		 */
		this.addObservables = function(o){
			if(o){
				for(var idx in o){
					// avoid a recursive addListeners call later by not placing EVM into its own observables list
					if(o[idx].observable && o[idx] != this){
						this.observables.push(o[idx]);
					}
				}
			}
		};
		
		this.start = function() { 
			if(this.started) { return;}
			this.started = true;
		};
		
		
		/**
		 * Routes an array of observers to their correct respective {@link Observable}
		 * @param {Array} list An array of observers to be routed.
		 */
		this.addListeners = function(list){
			if(list && list.length){
				for(var i=0; i < list.length; i++){
					this.addListener(list[i]);
				}
			}
		};
		
		/** 
		 * Determines if a given object is an acceptable listener for this class.
		 * Overrides MixIn.Observable.isListener method.
		 * @see MixIn.Observable.isListener
		 */
		this.isListener = function (l){
			// Iterate over all custom events and look for
			for(var cEvtName in this.cEvts){
				var cEvt = this.cEvts[cEvtName];
				if(cEvt.supportsListener(l)) {
					return true;
				}
			}
			return false;
		};
	}

	/**
	 * Adds definition of custom event to the registry of custom events.
	 * @param {Object} customEvt object of CustomEvent class
	 */
	EvtMgr.prototype.addCustomEvent = function (customEvt) {
		if(customEvt && !this.cEvts[customEvt.name]){
			this.cEvts[customEvt.name] = customEvt;
		}
	};

	/**
	 * Adds all custom events from provided array.
	 * @param {Array} array of CustomEvent objects
	 */
	EvtMgr.prototype.addCustomEvents = function (customEvtsArr) {
		if(customEvtsArr) {
			for(var idx=0; idx < customEvtsArr.length; idx++){
				this.addCustomEvent(customEvtsArr[idx]);
			}
		}
	};

    EvtMgr.prototype.getCustomEvent = function (name) {
        return this.cEvts[name];
    };
	/**
	 * Removes definition of custom event from the registry of custom events.
	 * @param {Object} customEvt object of CustomEvent class
	 */
	EvtMgr.prototype.removeCustomEvent = function (customEvt) {
		if(customEvt)
			delete this.cEvts[customEvt.name];
	};

	/**
	 * Custom event fire action.
	 * @param eventName name of the custom event to fire
	 * @param rule the rule object that fires this event
	 * @param evt Event object that triggered the rule firing this custom event.
	 * It is a source of contextual data that may be used to compose custom event data.
	 * Optional but used a lot for service lifecycle events.
	 * @param evtDataSupplementFcn optional function generating additional data supplied at the time of custom event firing.
	 * These data are used to supplement/override data defined in the custom event definition.
	 * Does not apply to data in aliases.
	 * Function may be specified as a function object or as string representation of function.
	 * @param context {boolean} optional. Only in force when in persistent window. If defined and the event is fired in the persistent window 
	 * context, then the evtmgr will attempt to delegate the call to the main window's framework so that externally registered listeners
	 * may be notified.  If null, false or undefined, then the call is made normally (in current javascript context).
	 * @throws UnsupportedEventError when the event mgr is told to throw a CEvt it can't find.
	 */
	EvtMgr.prototype.fireCustomEvent = function (eventName, rule, evt, evtDataSupplementFcn, context) {
		if(!!context && CHM.isPersistentWindow()){
			try{
				parent.opener.Inq.fireCustomEvent(eventName, evt, rule);
			}catch(err){
				log("failed to fire custom event \""+eventName+"\" from persistent window: "+err);
			}
		}else{
			var cEvt = this.cEvts[eventName];
			if(cEvt){
				if (evtDataSupplementFcn) {
					cEvt = cEvt.clone(); // cloning the object not to modify event definition
					if (typeof evtDataSupplementFcn === 'function') {
						cEvt["evtDataSupplement"] = evtDataSupplementFcn(rule, evt);
					} else {
						cEvt["evtDataSupplement"] = eval("(" + evtDataSupplementFcn + ")()");
					}
				}
				this._fireEvt(
					function(l, evt) {
						if (l){
							cEvt.invoke(l, rule, evt); // using closures to invoke here
						}
					},
					evt
				);
				return;
			}
			throw ("UnsupportedEventError: " + eventName);
		}
	};
	
	EvtMgr.prototype.fireManualInvocationEvent = function(rule) {
		BRM.fireManualInvocationEvent(rule);
	};
	
	MixIns.prepare(EvtMgr).mixIn(MixIns.FrameworkModule).mixIn(MixIns.Observable);	

	/**
	 * Links a given observer to its correct observable.
	 * @param {Object} l Observer (listener) to be connected. If no {@link Observable} supports
	 * the listener, then no connection is made.
	 */
	EvtMgr.prototype.addListener = function(l){
		if(l){
			for(var i=0; i<this.observables.length; i++){
				this.observables[i].addListener(l);
			}
			if(this.isListener(l)){
				this._listeners.push(l);
			}
		}
	};

	/**
	 * Returns string representation of this object.
	 */
	EvtMgr.prototype.toString = function(){
		return "EvtMgr(\"" + this._id + "\")";
	};


	/**
	 * Landing Manager handles all page landing history and
	 * history questions including landing zones or content groups.
	 * @class Landing Manager class that handles all page landing history and
	 * history questions including landing zones or content groups.
	 * @implements {DataExporter}
	 * @param {String} id Manager unique id
	 * @param {Object} data Static data defined by TC BR30 xml.
	 */
	function LandingMgr(id, data){
		this._frameworkModule(id);
		this._observable();
		this.initialized = false;
		this.page = null;
        this.quickCGIndex = {};
        var cgIndex = 0;
        this.reinitialized = false;
		this.absorb(data);
        for (var cgId in this.contentGroups) {
            this.quickCGIndex[cgId] = cgIndex++;
        }
	}
	MixIns.prepare(LandingMgr).mixIn(MixIns.FrameworkModule).mixIn(MixIns.Absorber).mixIn(MixIns.Observable).mixIn(MixIns.Persistable);

	/**
	 * @inheritDoc
	 */
	LandingMgr.prototype.getData = function(){
		return MixIns.clonize({
			pageMarker: this.getPageMarker(),
			pageID: this.getPageID(),
			pageURL: this.getCurrentPageURL(),
			landingHistory: this.getLandingHistory()
		}).clone();
	};

	/**
	 * initializes the landing manager once instantiated. Resolves the url to a mapped page from the pages provided in
	 * data (seeded by constructor). Initializes persistence variables when invoked.
	 * @param {Boolean} [doReinit] set to true if it is desired to reinitialize the state of the landing manager to simulate a
	 * new page landing.
	 * @see MixIns.FrameworkModule
	 * @see reinitChat()
	 */
	LandingMgr.prototype.init = function(doReinit) {
		if(!!doReinit) {
			this.page=null;
			this.reinitialized = true;
		}
		if(!this.initialized){
			this.stateVar = new Variable(this.getID(),{lh:[]}, resources["state"]);
			this.stateVar.init();
			this.load();
		}
		this.initialized = true;
		if(this.page==null){
			var pages = this.pages;
			var orID = Inq.overridePageID;
			if(orID>0){
				this.page = (pages[orID]?pages[orID]:null);
			}
			else {
				var pageURL = win.document.URL.toString();
				for(var i in pages){
					var r = new RegExp(pages[i].re);
					var mat = r.exec(pageURL); // we need a precise match... the RegExp.test() method won't cut it.
					if(!!mat && mat[0]==pageURL){ // the regexp "consumed" the WHOLE URL... this is an exact match.
						this.page = pages[i];
						break;
					}
				}
			}
		}
		this.pageFound = (this.page != null);
	};
	/**
	 * Obtains the page url for the current page. If in persistent window, will return the url of the main context parent URL.
	 * @return {String} site main page url. Null if any error occurs. Should never throw error.
	 */
	LandingMgr.prototype.getCurrentPageURL = function(){
		try{
			return CHM.isPersistentWindow()?top.opener.document.URL:win.document.URL;
		}catch(e){
			return win.document.URL;
		}
	};

	/**
	 * Obtains a page marker for a given page history idx.
	 * @param {number} idx Index of the page history queue. 0 is current page.
	 * May be null or undefined. Will return current page marker if undefined. If it is a persistent window then
     * return value from origin
	 * @return {String} page marker for the given page idx."unmarked page" if page not found.Should never throw error.
	 */
	LandingMgr.prototype.getPageMarker = function(idx) {
		var p = CHM.isPersistentWindow() ? window.parent.opener.inqFrame.Inq.LDM.getPage(idx) : this.getPage(idx);
		return p?p.mID:"unmarked page";
	};
	/**
	 * Obtains a page id for a given page history idx.
	 * @param {number} idx Index of the page history queue. 0 is current page.
	 * May be null or undefined. Will return current page id if undefined. If it is a persistent window then
     * return value from origin
	 * @return {Number} page id for the given page history idx. -1 if page not found. Should never throw error.
	 */
	LandingMgr.prototype.getPageID = function(idx) {
        var p = CHM.isPersistentWindow() ? window.parent.opener.inqFrame.Inq.LDM.getPage(idx) : this.getPage(idx);
        return p?p.id:-1;
	};
	/**
	 * Obtains a page marker for a given landing history queue index.
	 * @param {Number} idx Index of the page history queue. 0 is current page.
	 * May be null or undefined. Will return current page (idx = 0) if undefined or null.
	 * @return {Object} Page object consisting of id, mID and regex. Null if not found or queue is empty.
	 * Should not throw errors on any input.
	 */
	LandingMgr.prototype.getPage = function(idx) {
		try{
			var page = this.lh[idx?idx:0];
			if(page){
				var tempPage = this.pages[page.id];
				if(!isNullOrUndefined(tempPage)){
					return tempPage;
				}else{
					return {id:0, mID:"unmarked page", re:"(.*)"};
				}
			}
		}catch(err){}
		return null;
	};
	/**
	 * Manages the landing history queue on every page landing.
	 * Prepends the current page id to the front of the queue and truncates
	 * old values to max queue size.
	 */
	LandingMgr.prototype.onPageLanding = function() {
		var pageid;

		/* array indexes of corresponded CG */
		var cgIdsArray;
		if (this.pageFound) {
			pageid = this.page.id;
        	cgIdsArray = this.findCorrespondedCG(pageid);
		} else {
			// MAINT23-225 Click to chat will not launch if page ID is not defined, or if URL doesn't match a URL defined in Right Touch.
			pageid = -1;
			cgIdsArray = [];
		}
        this.lh.unshift({id: pageid, cg: cgIdsArray});
		if(this.lh.length > this.qsize){
			this.lh.length = this.qsize;
		}
		this.save();
	};
	LandingMgr.prototype.load = function() {
		this.absorb(this.stateVar.getValue());
	};
	LandingMgr.prototype.save = function() {
		this.stateVar.setValue({lh: this.lh});
	};

	/**
	 * Obtains an array of marker id strings in the landing order.
	 * @return {Array} array of marker strings for the landing history.
	 * Never null. May be empty.
	 */
	LandingMgr.prototype.getLandingHistory = function(){
		var retval = [];
		for(var idx=0;idx<this.lh.length;idx++){
			retval[idx] = this.getPageMarker(idx);
		}
		return retval;
	};

	LandingMgr.prototype.start = function() {
		this.fireOnPageLandingEvent(this.page);
	};
	LandingMgr.prototype.pageCheck = function(pageID) {
		if (isNullOrUndefined(this.page)) {
			return false;
		} else {
			return this.page.id==pageID;
		}	
	};
	LandingMgr.prototype.reset = function() {};

	LandingMgr.prototype.fireOnPageLandingEvent = function(dat) {
		function onPageLanding(l, evt) {
			try {
				if (l.onPageLanding) {
					l.onPageLanding(evt);
				}	
			} catch(e) {
				log(e);
			}
		}

		this._fireEvt(onPageLanding, {page:this.page, data:dat, reinitialized:this.reinitialized});
	};

	LandingMgr.prototype.isListener = function(l) {
		return (l && l.onPageLanding);
	};

	LandingMgr.prototype.getPersistentID = function() {
		return this.getID();
	};

	LandingMgr.prototype.onDataReady = function() {
		log("LandingMgr#onDataReady");
	};
    /**
     * find CG which contains pgId
     * @param pgId
     */
    LandingMgr.prototype.findCorrespondedCG = function (pgId) {
        var out = [];
        var url = this.getCurrentPageURL();
        var index = 0;
        for (var cgId in this.contentGroups) {
            var cg = this.contentGroups[cgId];
            if (cg.contains(pgId, url, this.contentGroups)) {
                /* save index of passed CG */
                out[out.length] = index;
            }
            index ++;
        }
        return out;
    };
	LandingMgr.prototype.checkCG = function(cgID, optPgIdx) {
		var page = this.lh[optPgIdx&&optPgIdx<this.lh.length ? optPgIdx : 0];        
		var cgIndex = this.quickCGIndex[cgID];
        if (isNullOrUndefined(cgIndex)) {
            return false;
        }
        var passedCG = page.cg;
        for (var index = 0; index < passedCG.length; index ++) {
            if (passedCG[index] == cgIndex) {
                return true;
            }
        }
        return false;
	};




	/**
	 * Business Rules Manager
	 * @class BRMgr
	 * @constructor
	 * @name BRMgr
	 * @param {Object} data containing field "rules" with rules and business rules and field globalRAtts with
	 *  global rule attributes.
	 * @implements {DataExporter}
	 * @borrows Absorber#absorb as #absorb
	 * @borrows Observable#addListeners as #addListeners
	 * @borrows Observable#clearListeners as #clearListeners
	 * @borrows Observable#_fireEvt as #_fireEvt
	 * @borrows Observable#addListener as #addListener
	 * @borrows Observable#isListener as #isListener
	 * @borrows FrameworkModule#init as #init
	 * @borrows FrameworkModule#start as #start
	 * @borrows FrameworkModule#reset as #reset
	 * @see Observable
	 * @see Absorber
	 * @see FrameworkModule
	 */
	function BRMgr(id, data) {
		this._frameworkModule(id);
		this._observable();

        // MAINT24-159: rule overriding support: <override-rule> defined in business section overrides
        // <overridable-rule> with the same id defined in program section.
        // Note that validation of section where appropriate rules were declared and
        // matching of their ids is performed by XSD constaints, see br30.xsd for documentation.
        var rulesIndexes = {};
        if(data && data.rules){
            for(var i = 0; i < data.rules.length; i++) {
                var r = data.rules[i];
                var id = r.getID();
                var overridableRuleInd = rulesIndexes[id];
                if (overridableRuleInd == undefined) {
                	rulesIndexes[id] = i;	
                } else {
                    // The overridden rule is totally eclipsed by the overriding rule
                	data.rules[overridableRuleInd] = r;
                    data.rules.splice(i, 1);
                    i--;
                }
            }
        }
        // End of rule overriding support

		this.absorb(data); /* Absorbing data including data.rules and qDefaults map*/
		this._varTable = {};
		this._rulesById = {};
        this._ruleIds = [];
		this._bActionable = true; // used for incrementality control
		if(data && data.rules){
			for(var i = 0; i < data.rules.length; i++) {
				var r = data.rules[i];
				this._varTable[r.getID()] = r.getVars();
				this._rulesById[r.getID()] = r;
				this._ruleIds[i] = r.getID();
			}
		}

		/**
		 * globalRAtts object comes with constructor parameter "data" and has following format:
		 * globalRAtts: {
		 *	 atts: [{name: 'name', value: 'value'}, ...],
		 *	 brIds: [1, 2, ...] or exclude: [1, 2, ...]
		 * }
		 * If neither brIds nor exclude are specified, that means all rules receive specified attributes.
		 */
		this.addGlobalRuleAttributes = function() {
			var ruleIdsToProcess = [];
			if (this.globalRAtts.brIds) {
				ruleIdsToProcess.append(this.globalRAtts.brIds);
			} else {
				if (this.globalRAtts.exclude) {
					for (var i = 0; i < this._ruleIds.length; i++) {
						var rId = this._ruleIds[i];
						if (!this.globalRAtts.exclude.contains(rId)) {
							ruleIdsToProcess.push(rId);
						}
					}
				} else {
					ruleIdsToProcess.append(this._ruleIds);
				}
			}


			for (var i = 0; i < ruleIdsToProcess.length; i++) {
				var rId = ruleIdsToProcess[i];
				var r = this.getRuleById(rId);
				if (r && r.addRuleAttributes) { // business rule objects must have this method
					r.addRuleAttributes(this.globalRAtts.atts);
				}
			}
		};

		if (this.globalRAtts) { // using absorbed object
			this.addGlobalRuleAttributes();
		}

		/**
		 * Obtains the complete set of rules in execution order.
		 */
		this.getRules = function() {
			return this.rules;
		};

		/**
		 * @TODO compete these methods
		 */
		this.start = function(){
			if (this.started) { return;}
			this.started = true;
		};
		this.init = function(){
            if (this.initialized) { return;}
            for(var i=0; i<this.getRules().length; i++){
                this.getRules()[i].init();
            }
            this.initialized = true;
            log(this.getID() + " initialized.");
		};
		this.load = function(){};
		this.save = function(){};
		this.onDataReady = function(){};

		/**
		 * Resets the rules in the manager for the PAGE ONLY.
		 * @TODO RHINOUNIT
		 */
		this.reset = function(){
			for(var i=0; i<this.rules.length; i++){
				this.rules[i].reset();
			}
		};
	}
	MixIns.prepare(BRMgr).mixIn(MixIns.Persistable).mixIn(MixIns.Absorber).mixIn(MixIns.FrameworkModule);
	BRMgr.mixIn(MixIns.Observable);

	/**
	 * @inheritDocs
	 * @returns {Object} data object containing the following:
	 *  qBRs {BusinessRule[]},
	 *  rules {Rule|BusinessRule}[]
	 *  @see BRMgr#getQualifiedBusinessRules
	 *  @see BRMgr#getRules
	 */
	BRMgr.prototype.getData = function(){
		return MixIns.clonize({
			qBRs: this.getQualifiedBusinessRules(),
			rules: this.getRules()
		}).clone();
	};
	/**
	 * obtains the persistable's id
	 * @return {string} string id
	 * @see FrameworkModule#getID
	 */
	BRMgr.prototype.getPersistentID = function() {
		return this.getID();
	};

	/**
	 * Obtains a list of rules for the page that may be targeted.
	 * @param {Boolean} [noShallowCopy] Set to true if a list of actual rule objects (not clones) are desired. Undefined
	 * or false will return a pure data clone of each rule that matches.
	 * @return {Array} array of rules that may target the page. Funnel levels ignored.
	 * @externalAPI Used by Implementation call and exposed through CustomerAPI.js
	 */
	BRMgr.prototype.getQualifiedBusinessRules = function(noShallowCopy){
		var sc = !noShallowCopy;
		return this._collect(function(rule){
			if(rule.isBR() && rule.areConditionalsMet()){
				return sc?MixIns.clonize(rule).clone():rule;
			}
		});
	};

	/**
	 * Iterates on every rule the mgr instance maintains and passes it to the parameter function.
	 * @param fcn {Function} Function whose contract must take 2 params:
	 *      1. rule
	 *      2. index of the rule in the rule array (like a priority)
	 * and returns the rule if "accepted" by the param passed function or null/undefined if not.
	 * @return {Array} array of rules that were vetted by the passed function.
	 * @throws {Error} When fcn param is null, undefined or not a function
	 * @private
	 */
	BRMgr.prototype._collect = function(fcn){
		var retcol = [];
		if(isNullOrUndefined(fcn) || typeOf(fcn)!="function"){
			throw new Error("Illegal Argument: expected a function, got "+(typeof fcn));
		}
		for(var i=0; i<this.rules.length; i++){
			var rule = this.rules[i];
			var val = fcn(rule, i);
			if(!isNullOrUndefined(val)){
				retcol[retcol.length]=val;
			}
		}
		return retcol;
	};
		/**
	 * obtains queue defaults for a given buID.
	 * @param {Number} buID for the 
	 * @return {Object} object with named member variables "priority" and "qt", {priority:0,qt:100.0} 
	 * if no defaults are found for the given buID. never null or undefined
	 */
	BRMgr.prototype.getQDefaults = function(buID) {
		var qd = this.queueDefaults[buID];
		return !!qd?qd:{priority:0,qt:1.0};
	};

	/**
	 * Gets all variables categorized by rule id.
	 * @return {Object} series of arrays of vars mapped to rule ids.
	 * Each id maps to one array of vars.
	 * @TODO RHINOUNIT
	 */
	BRMgr.prototype.getRuleVarTable = function() {
		return this._varTable;
	};

	BRMgr.prototype.getRuleByName = function(ruleName) {
		var rule = null;
		// TODO: find way to find using a faster algorithm, consider sorting upon insertion of
		// rule?
		for (var i = 0; i < this.rules.length; i++) {
			if (this.rules[i].getName() === ruleName) {
				rule = this.rules[i];
				break;
			}
		}
		return rule;
	};

	BRMgr.prototype.getRuleById = function(ruleId) {
		return this._rulesById[ruleId];
	};

	BRMgr.prototype.setActionable = function(bActionable) {
		this._bActionable = bActionable;
	};

	BRMgr.prototype.isControlGroup = function() {
		return !this._bActionable;
	};

	BRMgr.prototype.fireManualInvocationEvent = function(rule) {
		var evt = {};
		if (!isNullOrUndefined(rule) && rule.onManualInvocation) {
			rule.onManualInvocation(evt);
		}
	};

	BRMgr.prototype.fireRuleSatisfiedEvent = function(rule) {
		var event = {rule: rule};

		function f(l, evt) {
			try {
				if (l.onRuleSatisfied) {
					l.onRuleSatisfied(evt);
				}
			} catch(e) {
				log("Error firing event onRuleSatisfied on " + l.toString() + ": \n" + e);
			}
		}

		this._fireEvt(f, event);
	};

	BRMgr.prototype.fireServiceInvitationEvent = function(rule, serviceType) {
		var event = {rule: rule, serviceType: serviceType };

		function f(l, evt) {
			try {
				if (l.onServiceInvitation) {
					l.onServiceInvitation(evt);
				}
			} catch(e) {
				log("Error firing event onServiceInvitation on " + l.toString() + ": \n" + e);
			}
		}

		this._fireEvt(f, event);
	};

	BRMgr.prototype.fireServiceEngagedEvent = function(eventData) {
		var outRule = null;
		try {
			outRule = this.getRuleById(eventData.brID)
		}
		catch (e) {
			log("error " + e)
		}
		if (isNullOrUndefined(outRule)) {
			outRule = {id: eventData.brID};
		}

		var event = {rule: outRule};

		function f(l, evt) {
			try {
				if (l.onServiceEngaged) {
					l.onServiceEngaged(evt);
				}
			} catch(e) {
				log("Error firing event onServiceEngaged on " + l.toString() + ": \n" + e);
			}
		}

		this._fireEvt(f, event);
	};

	BRMgr.prototype.fireServiceInteractedEvent = function(eventData) {
		var event = {rule: {id: eventData.brID}};

		function f(l, evt) {
			try {
				if (l.onServiceInteracted) {
					l.onServiceInteracted(evt);
				}
			} catch(e) {
				log("Error firing event onServiceInteracted on " + l.toString() + ": \n" + e);
			}
		}

		this._fireEvt(f, event);
	};

	BRMgr.prototype.fireServiceMissedEvent = function(rule, serviceType) {
		var event = {rule: rule, serviceType: serviceType};

		function f(l, evt) {
			try {
				if (l.onServiceMissed) {
					l.onServiceMissed(evt);
				}
			} catch(e) {
				log("Error firing event onServiceMissed on " + l.toString() + ": \n" + e);
			}
		}

		this._fireEvt(f, event);
	};

	BRMgr.prototype.fireExposureQualifiedEvent = function(eventData) {
		var event = eventData;
		function f(l, evt) {
			try {
				if (l.onExposureQualified) {
					l.onExposureQualified(evt);
				}
			} catch(e) {
				log("Error firing event onExposureQualified on " + l.toString() + ": \n" + e);
			}
		}

		this._fireEvt(f, event);
	};

	BRMgr.prototype.isListener = function(l) {
		var bListener = false;
		// add other "native" event handler methods here as needed
		if (l && (l.onRuleSatisfied || l.onServiceInvitation ||
				  l.onServiceEngaged || l.onServiceInteracted ||
				  l.onServiceMissed || l.onExposureQualified)) {
			bListener = true;
		}
		return bListener;
	};

	BRMgr.prototype.EXPOSURE_QUALIFIED_RESULT = {
		OUT_HOP: "out_hop,",
		NO_AVAILABILITY: "no_availability",
		EXISTING_OFFER: "existing_offer",
		WILL_OFFER: "will_offer"
	};



	/**
	 * Trigger representing a listener function name id.
	 * @constructor
	 * @param {String} id The id of the event trigger function.
	 * @param {Number} [delayInMS] The optional delayInMS of the event trigger.
	 */
	function Trigger(id, delayInMS){
		this.id = id;
		this.delayInMS = delayInMS?delayInMS:null;
	}

	/**
	 * Rule class representing all rule types
	 * @class Represents a rule.
	 * @constructor
	 * @borrows Absorber#absorb as #absorb
	 * @see Absorber
	 * @param {String} name The rule's name
	 * @param {Array} vars array of the rules {@link Variable} objects @see Variable
	 * @param {Array} triggers an array of {@link Trigger} objects
	 * @param {Function} conditionalFcn function that returns true or false based on a series of internal tests.
	 * @param {Function} actionFcn function that, when invoked, will execute the rules actions.
	 */
	function Rule(data){
		this.constants = {};
		this.absorbFields(data);
	}

	/**
	 * This function sets fields of the Rule object according to parameters passed to constructor.
	 * This code is placed to a separate function to be reused from both Rule and BusinessRule constructors.
	 */
	Rule.prototype.absorbFields = function(data) {
		this.triggerMet=false;
		this.absorb(data);
		this.vtable = {};
		if(data && data.vars){
			for(var i=0; i<data.vars.length; i++){
				var v = data.vars[i];
				this.vtable[v.getName()]=v;
			}
		}

		/* invokes the rules actions directly. */
		this.doActions = this.actionFcn;
	};

	MixIns.prepare(Rule).mixIn(MixIns.JSON).mixIn(MixIns.Absorber);

	Rule.create = function(data){
		return new Rule(data);
	};

	Rule.prototype.getID = function(){
		return this.id;
	};
	Rule._delayedRules = {};
	Rule._timers = [];
	Rule._TIDX = 0;

	/**
	 * Sets the timeout in the current window to delay Rule execution.
	 */
	Rule._setTimeout = function(rule, delayInMS){
		var tidx = Rule._TIDX++;
		Rule._delayedRules[tidx] = rule;
		this.tidx = tidx;
		return window.setTimeout("Inq.Rule._timerCallback("+tidx+")", delayInMS);
	};

	/**
	 * static callback for all rules to invoke with their unique timer index.
	 * @param {number} tidx index of the rule whose timer callback is to be invoked.
	 * @see Rule#sleep
	 */
	Rule._timerCallback = function(tidx){
		Rule._popDelayedRule(tidx).timerCallback();
	};
	/**
	 * Pops a delayed rule off the waiting queue
	 * @param {number} tidx index of the rule to be popped of the queue.
	 * @returns {Rule} delayed rule with that idx. null if none found.
	 * @see Rule#sleep
	 */
	Rule._popDelayedRule = function(tidx){
		var rule = Rule._delayedRules[tidx];
		delete Rule._delayedRules[tidx];
		return (rule?rule:null);
	};

	/**
	 * Delays execution of the rule for a specified period of time.
	 * @param {Number} delayInMS amount of time to delay the execution of the rule.
	 */
	Rule.prototype.sleep = function(delayInMS){
		this.tid = Rule._setTimeout(this, delayInMS);
	};
	/**
	 * Resets the rule completely.
	 */
	Rule.prototype.reset = function(){
		Rule._popDelayedRule(this.tidx);
	};

	Rule.prototype.fireRule = function(evt, delayInMS){
		this.evt = evt;
		this.triggerMet = true;
		if(delayInMS>0) {
			this.sleep(delayInMS);
		} else{
			this.execute(evt);
		}
	};
	/**
	 * Getter method for the rule name.
	 * @returns {string} The rule's name.
	 */
	Rule.prototype.getName = function(){ return this.name; };
	/**
	 * method that connects the rules triggers to the framework.
	 * @see EvtMgr#addListener
	 */
	Rule.prototype.init = function(data){
		if(!this.triggers) {
			return;
		} else if (typeOf(this.triggers) == 'function') {
			// Since V4CHAT-99 triggers are rendered as functions to allow their initialization after Rule creation
			// thus enabling usage of constants and variables defined in the rule to initialize trigger delay.
			this.triggers = this.triggers(this);
		}

		for(var idx=0; idx<this.triggers.length; idx++){
			var trig = this.triggers[idx];
			if(trig.domElementID || trig.domElements){
				this._processDomTrigger(trig);
			}
			else if (trig.serviceType) {
				this._processSvcTrigger(trig);
			}
			else {
				this._processStdTrigger(trig);
			}
		}
	};

	/**
	 * Attaches a standard trigger listener to the rule.
	 * @param {Trigger} trig Trigger instance containing listener spec.
	 * {@link Trigger}
	 */
	Rule.prototype._processStdTrigger = function(trig){
		var atrig = trig;  // do not remove... this is a subtle "closure" issue (js can't "close" on function parameters)
		this[trig.id] = function(evt) {
			this.fireRule(evt, atrig.delayInMS);  // closure on atrig var above
		};
	};

	/**
	 * Attaches a DOM trigger listener to the rule.
	 * @param {Object} trig Trigger instance containing the DOM listener spec instance.
	 */
	Rule.prototype._processDomTrigger = function(trig){
		var elArray = [];
		if (trig.domElementID) {
			var el = doc.getElementById(trig.domElementID);
			if (!!el) elArray[0] = el;
		} else if (trig.domElements) {
			for(var idx=0; idx < trig.domElements.length; idx++){
				elArray.append(trig.domElements[idx]);
			}
		}

		if(elArray.length > 0) {
			var r = this;
			for (var i=0; i < elArray.length; i++) {
				var el = elArray[i];
				if(!el) continue;
				attachListener(
					el,
					trig.id,
					function(evt){r.fireRule(evt, trig.delayInMS);}
				);
			}
		}
	};
	Rule.prototype.log = function(msg,e){
		log("Rule #"+this.id+"("+this.name+"): "+msg+(e?"-> error="+e:""));
	};

	/**
	 * Attaches a Service trigger listener to the rule.
	 * @param {Object} trig Trigger instance containing the service listener spec instance.
	 */
	Rule.prototype._processSvcTrigger = function(trig){
		var svcTypes = this[trig.id + "_ServiceTypes"];
		var trigServiceType = trig.serviceType;
		if (isNullOrUndefined(svcTypes)) {
			svcTypes = this[trig.id + "_ServiceTypes"] = [trigServiceType];
			this[trig.id] = function(evt) {
				var evtServiceType = evt.chatType;
				if (svcTypes.contains(evtServiceType) || svcTypes.contains("ALL")) {
					this.fireRule(evt, trig.delayInMS);
				}
			};

		} else {
			if (!svcTypes.contains(trigServiceType) && !svcTypes.contains("ALL")) {
				svcTypes.push(trigServiceType);
			}
		}

	};

	/**
	 * Determine whether this rule will execute within its valid date range.
	 * @return true if current time is within the rule's dates of operation, false otherwise
	 */
	Rule.prototype.isWithinDateRange = function() {
		var inRange = true;
		if(!!this.dates) {
			var now = new Date();
			var start = !!this.dates.start ? this.dates.start : new Date(0);
			var end = !!this.dates.end ? this.dates.end : new Date(now.getTime() + 1);
			inRange = now.after(start) && now.before(end);
		}
		return inRange;
	};

	/**
	 * @returns {boolean} true if event criteria and conditions for the rule are fulfilled, false otherwise.
	 */
	Rule.prototype.areConditionalsMet = function(){
			return (this.conditionalFcn(this,this.evt) && this.triggerMet && this.isWithinDateRange());
	};

	Rule.prototype.timerCallback = function(){
		this.execute();
	};

	Rule.prototype.getConstant = function(cID){
		if(isNullOrUndefined(this.constants[cID])){
			return constants[cID];
		}
		return this.constants[cID];
	};

	/**
	 * executes the actions if conditions are met.
	 */
	Rule.prototype.execute = function(){
		try {
		if(this.areConditionalsMet()){
			this.doActions(this, this.evt);
		}
		} catch(e) {
			logActionErr(e, this);
		}
	};

	Rule.prototype.assertTrue = function(bfcn, testName, failmsg){
		var msg = "ASSERT: "+this.getName()+" - "+ testName + ": ";
		try{
			var b = bfcn();
			msg += b?"PASSED":("FAILED. "+failmsg);
			if(!b){
				msg = "*** "+msg;
			}
		}catch(err){
			msg += ("FAULT: "+err);
		}
		ROM.send(urls.loggingURL, {level:"info", line: msg});
		log(msg);
	};

	/**
	 * executes the actions if conditions are met.
	 */
	Rule.prototype.getVars = function(){
		return this.vars;
	};

	/**
	 * Returns string representation of this object.
	 */
	Rule.prototype.toString = function(){
		return "Rule " + this.getID() + " \"" + this.name + "\"";
	};

	/**
	 * Determines if a rule is a BusinessRule type or not.
	 * @return {Boolean} always false for Rule type.
	 */
	Rule.prototype.isBR = function(){
		return false;
	};

		/**
	 * Business Rule subclass of rule. Launches chats in addition to
	 * the other business Rule class allows.
	 * @class Represents a business rule.
	 * @extends {Rule}
	 * @borrows {Absorber} as #absorb
	 * @constructor
	 * @param {number} id Business rule id.
	 * @param {String} name name of the rule
	 * @param {number} qt queuing threshold
	 * @param {Array} vars array of {@link Variable} for this rule.
	 * @param {Array} triggers array of {@link Trigger} objects
	 * @param {Function} conditionalFcn function for the rule conditional
	 * @param {Function} actionFcn Function that contains all a rules actions ready for invocation.
	 * @param {number} businessUnitID optional business unit id value overriding default value
	 * @param {Array} [agtAtts] optional array of name-value pairs for the rule's agent attributes
	 * @param {Array} [ruleAtts] optional array of name-value pairs for the rule's attributes
	 * @param {Date} [startDate] staring date-time for which this rule is valid
	 * @param {Date} [endDate]  ending date-time for which this rule is valid.
	 * @requires Rule
	 */
	function BusinessRule(data){
		this.constants = {};
		this.absorbFields(data);
		if(!!this.ignoreFunnelLevel){
			this.constants["ifl"] = true;
			/* If the "cfl" conditions are present in the rule, this nullifies them. */
			this.constants["fl"] = Number.NEGATIVE_INFINITY;
		}
		// Per MAINT24-151 specifying funnel-level attribute in business rule is equivalent to
		// declaring rule constant "fl". One caveat is that if the fl is already delcared as a
		// constant in the rule, it will override the funnel-level attribute in the xml
		else if (!isNullOrUndefined(this.funnelLevel)) {
			if(isNullOrUndefined(this.constants["fl"]))
				this.constants["fl"] = this.funnelLevel;
		}
	}

	BusinessRule.prototype = new Rule();
	BusinessRule.prototype.constructor = BusinessRule;
	BusinessRule.create =function(data){
		return new BusinessRule(data);
	};
	/**
	 * Determines if a rule is a BR.
	 * @override
	 * @return {Boolean} always true for BRs
	 */
	BusinessRule.prototype.isBR = function(){ return true; };
	BusinessRule.prototype.execute = function(){
		try {
			if(this.areConditionalsMet()){
				BRM.fireRuleSatisfiedEvent(this);
				if(!BRM.isControlGroup()) {
					this.doActions(this, this.evt);
				}
			}
		} catch(e) {
			logActionErr(e, this);
		}
	};

	/**
	 * Returns string representation of this object.
	 */
	BusinessRule.prototype.toString = function(){
		return "BusinessRule " + this.getID() + " \"" + this.name + "\"";
	};

	/**
	 * Returns business unit id of this business rule if it was defined in the rule xml.
	 * If not defined, return default value.
	 */
	Rule.prototype.getBusinessUnitID = function(){
		var buID;
		if(!isNullOrUndefined(this._getDynamicBusinessUnitId)){ // dynamically bound method _getDynamicBusinessUnitId()... need to pass in the rule
			try{
				buID = this._getDynamicBusinessUnitId(this);
			}catch(err){
				buID = getDefaultBusinessUnitID();
			}
		}
		else if(!isNullOrUndefined(this.businessUnitID)) {
			buID = this.businessUnitID; // use the rule's bu id
		}
		else
			buID = getDefaultBusinessUnitID(); // last resort
		log("Rule#getBusinessUnitId(ruleid="+this.getID()+"): business-unit-id="+buID);
		return buID;
	};

	/**
	 * Compares 2 supplied attributes for equality of names. Returns true if names equal, values are NOT compared.
	 * 	Attributes have following format: {name: 'attribute name', value: 'attribute value'}.
	 * @param attr1 1st attribute to compare
	 * @param attr2 2nd attribute to compare
	 */
	BusinessRule.prototype.attrNamesEqual = function(attr1, attr2) {
		return (attr1 && attr2 && attr1.name && attr2.name && (attr1.name == attr2.name));
	};

	BusinessRule.prototype.getAgentAttributes = function() {
		return this.getAAtts();
	};

	BusinessRule.prototype.setAgentAttributes = function(attribs) {
		this.aAtts = attribs;
	};

	/**
	 * Returns true if array of agent attributes already contain attribute with the same name as of provided attribute.
	 * @param attribute in format {name: 'attribute name', value: 'attribute value'}
	 */
	BusinessRule.prototype.containsAgentAttribute = function(attribute) {
		return this.getAAtts().contains(attribute, BusinessRule.prototype.attrNamesEqual);
	};

	/**
	 * Adds rule attribute to the array of agent attributes. If attribute already exists, its value is updated.
	 * @param attribute in format {name: 'attribute name', value: 'attribute value'}
	 */
	BusinessRule.prototype.addAgentAttribute = function(attribute) {
		var attsArray = this.getAAtts();
		var isRemove = attribute.value == '';
		if (isRemove) {
			this.removeAgentAttribute(attribute);
			return;
		}
		if (!this.containsAgentAttribute(attribute)) {
			attsArray.append([attribute]);
		} else {
			for(var idx=0; idx < attsArray.length; idx++) {
				if(this.attrNamesEqual(attsArray[idx], attribute)) {
					attsArray[idx].value = attribute.value;
				}
			}
		}
	};

	BusinessRule.prototype.removeAgentAttribute = function(attribute) {
		var attsArray = this.getAAtts();
		if (this.containsAgentAttribute(attribute)) {
			for(var idx=0; idx < attsArray.length; idx++) {
				if(this.attrNamesEqual(attsArray[idx], attribute)) {
					attsArray.remove(idx);
					break;
				}
			}
		}
	};

	/**
	 * Adds provided attributes to the array of agent attributes. If an attribute already exists, its value is updated.
	 * @param array of attribute objects having format {name: 'attribute name', value: 'attribute value'}
	 */
	BusinessRule.prototype.addAgentAttributes = function(attributes) {
		for(var idx=0; idx < attributes.length; idx++) {
			this.addAgentAttribute(attributes[idx]);
		}
	};

	/**
	 * Get agent's attributes as string for log like: attrName,attrValue;attrName,attrValue
	 */
	BusinessRule.prototype.getAgentAttributesAsString = function() {
		if (!this.getAgentAttributes) {
			log("Only BusinessRule can have agent attributes.");
			return null;
		}
		var data = this.getAgentAttributes();
		if (isNullOrUndefined(data)) {
			return null;
		}

		var out = "";
		for (var index = 0; index < data.length; index++)  {
			if (index > 0) {
				out += ";";
			}
			out += data[index].name  + "," + data[index].value;
		}
		return out;
	};

	/**
	 * Get rule attributes as string for log like: attrName,attrValue;attrName,attrValue
	 */
	BusinessRule.prototype.getRuleAttributesAsString = function() {
		if (!this.getRuleAttributes) {
			log("Only BusinessRule can have rule attributes.");
			return null;
		}
		var data = this.getRuleAttributes();
		if (isNullOrUndefined(data)) {
			return null;
		}

		var out = "";
		for (var index = 0; index < data.length; index++)  {
			if (index > 0) {
				out += ";";
			}
			out += data[index].name  + "," + data[index].value;
		}
		return out;
	};

	BusinessRule.prototype.getRuleAttributes = function() {
		return this.getRAtts();
	};

	BusinessRule.prototype.setRuleAttributes = function(attribs) {
		this.rAtts = attribs;
	};

    /**
	 * Returns array of rule attributes in format: [{name: attr1, value: val1},{name: attr2, value: val2s}]
	 * to support global rule attributes functionality
	 */
    BusinessRule.prototype.getRuleAttributesAsArray = function() {
        return this.rAtts;
    };

	/**
	 * Returns true if array of rule attributes already contain attribute with the same name as of provided attribute.
	 * @param attribute in format {name: 'attribute name', value: 'attribute value'}
	 */
	BusinessRule.prototype.containsRuleAttribute = function(attribute) {
		return this.getRuleAttributesAsArray().contains(attribute, BusinessRule.prototype.attrNamesEqual);
	};

	/**
	 * Adds rule attribute to the array of rule attributes. If attribute already exists, its value is updated.
	 * @param attribute in format {name: 'attribute name', value: 'attribute value'}
	 */
	BusinessRule.prototype.addRuleAttribute = function(attribute) {
        if(!this.rAtts) this.rAtts = [];
        var attsArray = this.getRuleAttributesAsArray();
		if (!this.containsRuleAttribute(attribute)) {
			attsArray.append([attribute]);
		} else {
			for(var idx=0; idx < attsArray.length; idx++) {
				if(this.attrNamesEqual(attsArray[idx], attribute)) {
					attsArray[idx].value = attribute.value;
				}
			}
		}
	};

	/**
	 * Adds provided attributes to the array of rule attributes. If an attribute already exists, its value is updated.
	 * @param array of attribute objects having format {name: 'attribute name', value: 'attribute value'}
	 */
	BusinessRule.prototype.addRuleAttributes = function(attributes) {
		for(var idx=0; idx < attributes.length; idx++) {
			this.addRuleAttribute(attributes[idx]);
		}
	};

	BusinessRule.prototype.getPriority = function() {
		return isNullOrUndefined(this.priority) ? BRM.getQDefaults(this.getBusinessUnitID()).priority : this.priority;
	};

	BusinessRule.prototype.getQueueThreshold = function() {
		return isNullOrUndefined(this.qt) ? BRM.getQDefaults(this.getBusinessUnitID()).qt : this.qt;
	};

	BusinessRule.prototype.getStartDate = function() {
		var start = null;
		if (this.dates && this.dates.start) {
			start = this.dates.start;
		}
		return start;
	};

	BusinessRule.prototype.getEndDate = function() {
		var end = null;
		if (this.dates && this.dates.end) {
			end = this.dates.end;
		}
		return end;
	};

	/**
	 * Returns language of this business rule if it was defined in the rule xml.
	 * If not defined, returns site default language.
	 */
	BusinessRule.prototype.getLanguage = function(){
		var language;
		if(!isNullOrUndefined(this._getLanguage)){ 
			try{
				language = this._getLanguage(this);
			}catch(e){
				language = getDefaultLanguage( );
				log("Error while getting language from the given Rule: \n" + e + "\n");
			}
		} else {
			language = getDefaultLanguage( );
		}
		return language;
	};

	/**
	 * returns current business rule agent group ID (default or override)
     * returns null if agent group settings lvl is not used for this site.
	 */
	BusinessRule.prototype.getAgentGroupID = function() {
		return this.agID;
	};
	


	/**
	 * Create an instance of Schedule object.
	 *
	 * @constructor
	 * @param {String} id identifier of this schedule
	 * @param {Date} periodStart optional date-time value to start this schedule.
	 *	If not specified schedule considered to be started.
	 * @param {Date} periodEnd optional date-time value to end this schedule.
	 *	If not specified schedule will continue forever.
	 * @param {Date} startTime optional value denoting time of the day when this schedule becomes active.
	 * @param {Date} endTime optional value denoting time of the day when this schedule becomes inactive.
	 * @param {Array} days weekly schedule as array of integers from 0 to 6 where 0 denotes Sunday, 6 - Saturday.
	 * 	If not specified or empty then all week days are allowed.
	 */
	function Schedule(id, periodStart, periodEnd, startTime, endTime, days) {
		this.id = id;
		this.periodStart = periodStart;
		this.periodEnd = periodEnd;
		this.startTime = startTime;
		this.endTime = endTime;
		this.days = days;
	}

	/**
     * Checks if this schedule is met at the specified point in time.
     * @param {Date} dt point in time to check against this schedule.
     * 	This parameter must be client side time and will be normalized to server time by adding client time lag.
	 * @param {String} clientTimeLag optional parameter - the lag in ms between browser and server time.
     *  Negative value e.g. -1000ms means browser clock is fast e.g. 10:00:01 compared to server clock 10:00:00.
	 * @param siteTzOfstMillis site timezone offset in miillis, e.g. -480 * 60 * 1000 for PST (GMT-0800).
	 * This value is used to determine current day of week for weekly schedules.
     * @returns true is this schedule is met at the specified point in time.
     * 
     * Note that this function is called by isSchMet() function only which always sends siteTzOfstMillis value.
     * The siteTzOfstMillis value is server's timezone offset which is ajax queried and saved at client.
	 */
	Schedule.prototype.isScheduleMet = function(dt, clientTimeLag, siteTzOfstMillis) {
		var result = true;

        // removing client time lag - comparing all dates as if they were synchronized using server clock
        if (clientTimeLag) dt.roll(clientTimeLag);

		if (this.periodStart) result = dt.after(this.periodStart) || dt.equals(this.periodStart);
		if (result && this.periodEnd) result = dt.before(this.periodEnd) || dt.equals(this.periodEnd);
		if (result && this.days && !this.days.isEmpty()) {
			// Note that Date.prototype.getTimezoneOffset() returns negative value for positive offset TZ,
			// e.g. -120 for GMT+02:00
			if (!siteTzOfstMillis) siteTzOfstMillis = 0;
			var dtToGetSiteDay = new Date(dt.getTime() + dt.getTimezoneOffset() * 60000 - siteTzOfstMillis);
			var currentDayAtSite = dtToGetSiteDay.getDay();
			result = this.days.contains(currentDayAtSite);
		}

		if (result && (this.startTime || this.endTime)) {
			
			var DAY_MILLISEC = 24 * 60 * 60 * 1000;
			var msSinceBOD, dtSrvTime = dt.getTime();

			/* Define missing arguments */
			if ( !siteTzOfstMillis ) {
				siteTzOfstMillis = 0;
			}

			if ( !this.startTime ) {   
				this.startTime = new Date (siteTzOfstMillis); 
			}
			
			if ( !this.endTime ) {    
				this.endTime = new Date (this.startTime.getTime() + DAY_MILLISEC - siteTzOfstMillis); 
			}

			/* Remove days from 1970/1/1 and Get hours only. */
			msSinceBOD = dtSrvTime % DAY_MILLISEC;
			
			/* In UTC time, if endTime is on the following day  */ 
			if ( this.endTime.getTime() > DAY_MILLISEC ) {
				/* And the time is between 00:00 to endTime in the next day.  */ 
				if (msSinceBOD <= (this.endTime.getTime() - DAY_MILLISEC)) {
					msSinceBOD += DAY_MILLISEC;
				}
			}
			
			if (this.startTime) result = msSinceBOD >= this.startTime.getTime();
			if (result && this.endTime) result = msSinceBOD <= this.endTime.getTime();
		}
		return result;
	};

		/**
		 * Represents a C2C image in the DOM
		 * @name C2C
		 * @class
		 * @constructor
		 * @borrows Absorber#absorb as #absorb
		 * @borrows RemoteCaller#onRemoteCallback as #onRemoteCallback
		 * @borrows RemoteCaller#callRemote as #callRemote
		 */
		function C2C(mgr, rule, chatType, specDataFcn, c2p){
			this._mgr = mgr;
			this._rule = rule;
			this.chatType = chatType;
			this.c2cSpec = MM.mergeC2CSpec(specDataFcn(rule)); // get the c2cSpec WITHOUT chat data
			this.specDataFcn = specDataFcn;
			EVM.addListener(this);
			this.idx = C2C.IDX++;
			this.clicked = false;
			this.c2p = c2p;
		}
		MixIns.prepare(C2C).mixIn(MixIns.Absorber).mixIn(MixIns.RemoteCaller);
		C2C.IDX=0;
		C2C.c2CPageElementIDs =[];
		C2C.prototype.getIdx = function(){
			return this.idx;
		};

		/**
		 * obtains an instance of the base xml chat spec for the c2c.
		 * @throws if rule is undefined for the c2c
		 */
		C2C.prototype.getXmlChatSpec=function(){
			if(isNullOrUndefined(this._rule)){
				throw "C2C not ready: rule is undefined";
			}
			var xmlC2cSpec = this.specDataFcn(this._rule);
			if(!!xmlC2cSpec.chatSpec){
				return xmlC2cSpec.chatSpec; // return only the chat spec override portion if it exists.
			}
			// no overrides at the chatSpec level and below... create an xml chatSpec from scratch
			var c2cSpec = MM.mergeC2CSpec(xmlC2cSpec);
			return {id: c2cSpec.chatSpec.id}; //only the chatSpec
		};

		/**
		 * Remote callback from c2c display request. Expects JSONized string as callback data for display.
		 */
		C2C.prototype.onRemoteCallback = function(ser){
			var dat = MixIns.JSON.parse(ser);

			var exposureData = {
				siteID: Inq.getSiteID(),
				pageID: isNullOrUndefined(LDM.getPageID()) ? -1 : LDM.getPageID(),   
				customerID: Inq.getCustID(),
				incrementalityID: getIncAssignmentID(),
				sessionID: getSessionID(),
				brID: this._rule.getID(),
				group: PM.getVar("incGroup").getValue(),
				buID: this._rule.getBusinessUnitID(),
				channelID: this._rule.getBusinessUnitID(),
				result: dat.result,
				rule: this._rule
			};
			BRM.fireExposureQualifiedEvent(exposureData);
			this.absorb(dat);
			this.show();
			if(this.optDataPass && !this.optDataPassListening){
				EVM.addListener({source:this, onAgentAssigned: this.optDataPass});
				this.optDataPassListening = true;
			}
			if(this.serviceMissedEvent) {
				BRM.fireServiceMissedEvent(this._rule, CHM.CHAT_TYPES.C2C);
			}
			this._mgr.nextRequest(this);
		};
		/**
		 * Forces a busy agent icon display.
		 * TODO: unit testing
		 */
		C2C.prototype.showAgentsBusyIcon = function(){
			this.showImg(this.busyURL);
		};
		/**
		 * Shows a given image and displays it as optionally "clickable".
		 */
		C2C.prototype.showImg = function(img, clickable){
			var div = this.getDiv(), func = null;
				/* If we are using inner iframes, then the div layer will be "decorated" with a function called "setSource" */
				try {func = div["setSource"];}catch(e){func=null};	/* Obtain possible function from inner IFRAME */

				var eventName = (isIE() && getBrowserMajorVer() <= 7) ? 'onmouseup' : 'onclick'; // INVEST-545: under specific condition, the 'onclick' event is not fired in IE6 and IE7.
				/* If we are using an inner iframe, then func has the function, otherwise it is null
				So ... if func is defined (not null or undefined) we want to reference the click event via "top." window */
				var onclicktxt = clickable ? (eventName + '=\"'+'inqFrame.Inq.C2CM.requestChat(' + this.idx + '); return false;\" onmouseover=\"this.style.cursor=\'pointer\'\"'): '';

				//In Firefox, By default if we don't mention the alt text information for input type image,  it displays 'Submit Query' text.
				//In MAINT25-111 to overcome this issue, i have added the alt attribute to type image tag.
				if (!!func) {										/* If the inner IFRAME has established the function, then use it to set image src */
					var domain = div["iframeDomain"];

					onclicktxt = 'top.top.inqFrame.Inq.C2CM.requestChat(' + this.idx + '); return false;';
					var mapAttributes = {};
					mapAttributes["style"] = "border-style: none; border-width: 0px;" ;
					if (clickable){
						mapAttributes["style"] = "border-style: none; border-width: 0px; cursor: pointer;" ;
						mapAttributes["onclick"] = onclicktxt ;
					}

					mapAttributes["src"] = urls.mediaSiteURL + '/images/' + this.c2cSpec.c2cTheme[img];
					func(mapAttributes, domain);
				}
				else if(this.c2p){
					div.innerHTML='<input type="image" alt="" src=\"'+ urls.mediaSiteURL + '/images/' + this.c2cSpec.c2cTheme[img] + '\"' + onclicktxt + '/>';
				}else{
					div.innerHTML='<img src=\"'+ urls.mediaSiteURL + '/images/' + this.c2cSpec.c2cTheme[img] + '\"' + onclicktxt + '/>';
				}
		};

		/** showClickToCallHtml - displays the click to call page in the c2c spot
		 *  This called by a rule and only by a rule
		 *
		 *  It's purpose is to replace the C2C image with a web url, mostly for a C2C that can:
		 *  1) show area to put in phone number
		 *  2) have button to push for placing the call request
		 *  JIRA: MAINT24-170
		 *
		 * @param urlHtml is the url path to the html
		 * @return - nothing
		 * TODO: unit testing
		 */
		C2C.prototype.showClickToCallHtml = function(urlHtml){
			var div = this.getDiv();
			var target =  urls.mediaSiteURL + '/images/' + this.c2cSpec.c2cTheme["r"] ;
			if (div!=null && target == div.firstChild["src"]){
				var frameSource = window.location.protocol + "//" +
								window.location.host +  ((window.location.port=="")?"":":"+window.location.port) +
								inqFrame.Inq.v3framesrc ;

				/** Publish showCallButton, this is analogous to GWT publishing (that's where I got the idea
				 *  We need to make the showCallButton accessible after obfuscation, so we publish it in the FlashPeer area
				 */
				if (inqFrame.Inq.FlashPeer["showCallButton"]==null) {
				inqFrame.Inq.FlashPeer.showCallButton = function(indx, source, left, top, number, show, giveFocus, title){
						(inqFrame.Inq.C2CM).showCallButton(indx, source, left, top, number, show, giveFocus, title);
				};
				}

				/** Pass data to the IFRAME as if this were XFORM */
				var iframeName = encodeURIComponent('{id: "'+ this.idx + '", clientHtml: "'+ frameSource + '"}');
				div.innerHTML=
						'<iframe width="100%" height="100%" ' +
						'name="'+iframeName+'" ' +
						'border="0" ' +
						'allowTransparency="true" ' +						
						'frameborder="0" scrolling="no" ' +
						'src="'+urlHtml+'" ' +
						'></iframe><input type="image" style="display: none;"></input>';
			}
		};

		/** Display the call button, from the IFRAME
		 *  The artwork is placed in exactly the same place as in the iframe
		 *  just placed over it in the client page.
		 *
		 * @param source - the url to the button image
		 * @param left - the left offset of the button
		 * @param top - the top offset for the button
		 * @param phone - The supplied phone number
		 * @param showButton - boolean, true: show button, false: hide button
		 * @param giveFocus - force focus to the button
		 * @param title - (optional) title (tooltip) for the mouse over
		 * @return nothing
		 * TODO: unit testing
		 */
		C2C.prototype.showCallButton = function(source, left, top, number, showButton, giveFocus, title) {
			var callBtnId = "tcCallButton";

			/* Set default values */
			if (giveFocus==null) giveFocus = true ;
			if (title==null) title = "Call "+number ;
			if (giveFocus==null) giveFocus = false ;
			if (showButton==null) showButton = true ;

			var div = this.getDiv();
			div.style.position = "relative";
			var form = document.createElement("form");

			/**
			 * Test for existance of the input immage, it is there, put in by showClickToCallHtml above
			 */
			var inputImage = null;
			var haveBtn = true ;
			if (inputImage==null&showButton==false) return ;
			var inputImages = div.getElementsByTagName("INPUT");
			if (inputImages!=null && inputImages.length > 0)
				inputImage = inputImages[0];
			var whenClicked = '(inqFrame.Inq.C2CM).requestChat(' + this.idx + ','+number+'); return false;';

			/* set up the call btn and place it in the same place it was in the iframe */
			inputImage.id = callBtnId;
			inputImage.src = source ;
			inputImage.idx = this.idx ;
			inputImage.fone = number ;
			inputImage.title = title ;
			inputImage.style.cssText = "display: "+((showButton)?"":"none")+";position: absolute; left: "+left+"px; top: "+top+"px;";
			inputImage.onClick = inputImage.onclick = function(){
				var indx = this.idx ;
				var fon  = this.fone;
				(inqFrame.Inq.C2CM).requestChat(indx,fon);
				return false;
				};
			if (giveFocus && showButton)  {
				if (inputImage["focus"]!=null) {
					try { inputImage.focus(); } catch (e){}
				}
			}

		};

		C2C.prototype.setClicked = function(isClicked) {
			this.clicked = isClicked;
		};

		C2C.prototype.isClicked = function() {
			return this.clicked;
		};

		/**
		 * gets a ref to the DOM instance that acts as a "view" for the this c2c instance model.
		 */
		C2C.prototype.forceGetDiv = function () {
			// if the rule contains the c2c page element ID details, we will give it the first preference
			// otherwise grab it from the c2c specs.
			if(!isNullOrUndefined(this.c2cSpec.div)){
				return this.c2cSpec.div;
			}
			this.pageElementID =  !!this.c2cSpec.peId ?  this.c2cSpec.peId : C2C.c2CPageElementIDs[this.id];
			var divId = this.pageElementID;
			return win.document.getElementById(divId);
		};

		/**
		 * Determines if a div is occupied or not.
		 * @return {Boolean} true if the div exists and is occupied, false if the div is either null or not occupied.
		 */
		C2C.prototype.isDivOccupied = function(){
			var adiv = this.forceGetDiv();
			if(!adiv){
				return false; // div is not occupied if it does not exist
			}
			return (!!adiv.occupied);
		};

		/**
		 * @return - div if it not occupied or rule the same.
		 */
		C2C.prototype.getDiv = function(){
			var div = this.forceGetDiv();
			return (!!div && (!div.occupied || div.ruleID==this._rule.getID()))?div:null;
		};

		/**
		 * Clears the DOM DIV's contents completely via innerHTML
		 */
		C2C.prototype.clear = function(){
			var div = this.getDiv();
			if (div) {
				div.occupied = false;
				div.innerHTML="";
			}
		};
		/**
		 * Clears and resets the invoked C2C object completely; allowing it to be occupied by another target.
		 * TODO: unit testing
		 */
		C2C.prototype.reset = function(){
			this.clear();
		};
		/**
		 * Displays a given image and optionally sets it's absolute style.
		 * Fires an event that a C2C was displayed.
		 */
		C2C.prototype.show = function(){
			var div = this.getDiv();
			if(!!this.c2cSpec.abs){
				div.style.position="absolute";
				div.style.top=this.c2cSpec.abs.y;
				div.style.left=this.c2cSpec.abs.x;
			}
			var image = this.image;
			if (CHM.isChatInProgress()) {
				this.launchable = false;
				image = this._mgr.IMAGETYPES.disabled;
			}

			if(!!div){
				div.occupied = true;
				div.ruleID = this._rule.getID();
				div.idx=this.idx;
				this.showImg(image, this.launchable);
				// fire the c2c displayed and service invitation events only when the c2c is displayed on the client page
				if (this.launchable) {
					C2CM.fireC2CDisplayed({c2c:this, rule:this._rule, data:this.data});
					BRM.fireServiceInvitationEvent(this._rule, CHM.CHAT_TYPES.C2C);
				}
			}
			// start timer to do periodic checks of agent availability
			this.runC2CAgentCheckTimer();
		};
		/**
		 * Listener for chat launch event. The C2C is supposed to become unclickable when
		 * in a chat state so the C2C nullifies its link when chat is launched.
		 * TODO: unit testing
		 */
		C2C.prototype.onChatLaunched = function(evt){
			this.stopC2CAgentCheckTimer();
			this.showImg(this._mgr.IMAGETYPES.disabled, false);
		};

		/**
		 * Listener for chat closed event. The C2C is supposed to become "available" again when
		 * not in a chat state so the C2C reinstates its link when chat is closed.
		 * TODO: unit testing
		 */
		C2C.prototype.onChatClosed = function(evt){
			this.absorb(this.specDataFcn());
			this.clear();
			if(evt.evtType===Inq.CHM.EVTS.CLOSED){
				this.request();
			}
			this.setClicked(false);
		};

		C2C.prototype.request = function() {
			if(C2CM.isBlocked(this.getChatType())) {
				this.reset();
				return;
			}
			var rule = this.getRule();
			var data = {
				siteID: siteID,
				brID: rule.getID(),
				brn: rule.getName(),
				pageID: LDM.getPageID(),
				chatType: this.chatType,
				priority: rule.getPriority(),
				qt: rule.getQueueThreshold(),
				buID: rule.getBusinessUnitID(),
                custID: Inq.getCustID()
			};
			if (isNullOrUndefined(data.pageID)) {
				data.pageID = -1;
			}
			if (!isNullOrUndefined(this.c2cSpec.igaa)) {
				data.igaa = this.c2cSpec.igaa; // agent availability override
			}
			if (!isNullOrUndefined(this._rule.getRuleAttributes())) {
				data.rAtts = this._rule.getRuleAttributes();
			}
			if (!isNullOrUndefined(this._rule.getAgentAttributes())) {
				data.aAtts =this._rule.getAgentAttributes();
			}
			if (!!this.c2cSpec.chatSpec && !isNullOrUndefined(this.c2cSpec.chatSpec.ignHOP)) {
				data.ignHOP = this.c2cSpec.chatSpec.ignHOP;
			}
			// MAINT24-208 BR30: do not present further C2Call invitations until the agent closes the call
			if (CHM.isCallServiceType(this.chatType) && CHM.getLastCallID()) {
				data.lastCallId = CHM.getLastCallID();
			}

			var sData = MixIns.JSON.stringify(data);
			this.callRemote(urls.requestC2CImageURL, {d: sData, xd:Inq.xd});
		};

		C2C.prototype.getID = function() {
			return this.id;
		};

		C2C.prototype.getC2cTheme = function() {
			return this.c2cSpec.c2cTheme;
		};

		C2C.prototype.getChatSpec = function() {
			return this.c2cSpec.chatSpec;
		};

		C2C.prototype.hasAbsolutePosition = function() {
			return !!this.c2cSpec.abs;
		};

		C2C.prototype.getPosition = function() {
			return this.c2cSpec.position;
		};

		C2C.prototype.getRule = function() {
			return this._rule;
		};

		C2C.prototype.getChatType = function() {
			return this.chatType;
		};

		/**
		 * Starts a timer that would check agent availability and update C2C image accordingly.
		 * In fact when time intervall passes timer invokes usual C2C request sequence:
		 * request()->onRemoteCallback()->show()->runC2CAgentCheckTimer()
		 */
		C2C.prototype.runC2CAgentCheckTimer = function() {
			if (!this.c2cSpec.igaa && this.c2cSpec.aaci &&
				(this.c2cSpec.aaci > 0)) {

				this.timeout_id = window.setTimeout("Inq.C2CM.getC2C(" + this.getIdx() + ").request()",
					this.c2cSpec.aaci);
			}
		};

		/**
		 * Stops check agent availability timer.
		 * TODO: unit testing
		 */
		C2C.prototype.stopC2CAgentCheckTimer = function() {
				if (this.timeout_id) window.clearTimeout(this.timeout_id);
		};


		/**
		 * sets page element container IDs of all c2c specs available for the site.
		 */
		C2C.setC2CPageElementIDs = function(pageElementIDs){
			C2C.c2CPageElementIDs =  pageElementIDs;
		};

	/**
	 * Chat manager for framework.
	 * @class Singleton chat manager for framework
	 * @constructor
	 * @implements {DataExporter}
	 * @param {String} id The unique framework id for the ChatMgr.
	 * @param data hard data required for construction configuration.
	 * 		currently, this includes the following:
	 * 		* thankYouShown -- image
			* thankYouEnabled -- image
			* displayTYImage -- image
			* c2CToPersistent -- c2c persistent flag
	 *
	 * @borrows Absorber#absorb as #absorb
	 * @borrows Observable#addListeners as #addListeners
	 * @borrows Observable#clearListeners as #clearListeners
	 * @borrows Observable#_fireEvt as #_fireEvt
	 * @borrows Observable#addListener as #addListener
	 * @borrows Observable#isListener as #isListener
	 * @borrows RemoteCaller#onRemoteCallback as #onRemoteCallback
	 * @borrows RemoteCaller#callRemote as #callRemote
	 * @borrows FrameworkModule#init as #init
	 * @borrows FrameworkModule#start as #start
	 * @borrows FrameworkModule#reset as #reset
	 * @borrows Persistable#load as #load
	 * @borrows Persistable#save as #save
	 * @borrows Persistable#getPersistentID as #getPersistentID
	 * @borrows Persistable#onDataReady as #onDataReady
	 * @see RemoteCaller
	 * @see Observable
	 * @see Absorber
	 * @see FrameworkModule
	 * @see Persistable
	 */
	function ChatMgr(id, data) {
		this._className="ChatMgr";
		this._frameworkModule(id);
		this._observable();
		this.pmor = false;
		this.absorb(data);
		this.popoutWindow = null;
		this.persisentWindow = null;		/* The actual window for the persistent chat instance */
		this.chat = null;
		this._init = false ;
		this.chatRequestQ = [];
		this.requestInProgress = false;
		this.hasEngaged = false;
		this.dataLoaded = false;
		this.evtIdx = 0;
		this.lpt = 0;
		this.earlyPopout = null; // Window of the soon-to-be pop-out chat
		this.lastChat = {}; // last chat data (chat of any type including call types)
		this.lastCallId = 0; // MAINT24-208: id of last call
		this._flashvarFcns = [];
		this._closeRetries = 0;								// Used in
		this.retryTimeout = null;
	}

	ChatMgr.CHM = null;
	ChatMgr.persistentTarget = "_inqPersistentChat";

	ChatMgr.prototype.getInstance = ChatMgr.getInstance = function(data) {
		if (isNullOrUndefined(ChatMgr.CHM)) {
			ChatMgr.CHM = new ChatMgr("CHM", data);
		}
		return ChatMgr.CHM;
	};

	/**
	 * @inheritDoc
	 */
	ChatMgr.prototype.getData = function(){
		if(this.isChatInProgress()){
			return MixIns.clonize(this.getChat().getChatData()).clone();
		}
		return null;
	};
	/**
	 *  RegisterChatFromPersistent: Static
	 *   This is fired from the persistent windows use of a timer and
	 *   "this" may not be pointing to the chat manager instance.
	 *   get the instance and fire the non static "registerChatFromPersistent"
	 *
	 *   @param - none
	 */
	ChatMgr.prototype.RegisterChatFromPersistent = ChatMgr.RegisterChatFromPersistent = function(chatID) {
		(ChatMgr.getInstance()).registerChatFromPersistent();
	};

	MixIns.prepare(ChatMgr).mixIn(MixIns.FrameworkModule).mixIn(MixIns.Observable).mixIn(MixIns.Absorber).mixIn(MixIns.Persistable).mixIn(MixIns.RemoteCaller);
	ChatMgr.prototype.log = function(msg){
		log("CHM: "+msg);
	};
	/**
	 * Logs exposure qualified for all remaining chat requests in queue.
	 */
	ChatMgr.prototype.drainRequestQ = function(){
		for(var i = 0; i< this.chatRequestQ.length; i++){
			var reqDat = this.chatRequestQ[i];
			var exposureData = {
				siteID: Inq.getSiteID(),
				customerID: Inq.getCustID(),
				incrementalityID: getIncAssignmentID(),
				sessionID: getSessionID(),
				brID: reqDat.rule.id,
				group: PM.getVar("incGroup").getValue(),
				businessUnitID: reqDat.rule.getBusinessUnitID(),
				result: "existing_offer",
				rule: reqDat.rule
			};
			BRM.fireExposureQualifiedEvent(exposureData);
		}
		this.chatRequestQ = []; // clear the chat queue
	};

	/**
	 * Request a new chat from the chat mgr
	 * @param rule a rule object containing a rule id and name
	 * @param chatType see ChatMgr.CHAT_TYPES for valid types
	 * @param xmlSpec {Object} this spec may be partially formed, at minimum containing only a specification id.
	 * 		the amount of information contained in a xmlSpec at this point is determined
	 * 		by the business rule that requested this chat. Missing spec data will be filled in
	 * 		by the media mgr if it is not specified in the business rule.
	 * 	item "p" was added to the data object to stop unintended caching of persistent chat
	 * 	... into a latter pop-up chat.
	 * 	@param phoneNumber (optional) is the phone number for which to automatically perform a click the call.
	 */
	ChatMgr.prototype.request = function(rule, chatType, xmlSpec, phoneNumber, c2cPersistent){
		var dat;
		if(!rule && this.chatRequestQ.length>0){
			dat = this.chatRequestQ.shift();
			rule = dat.rule;
			chatType = dat.chatType;
			xmlSpec = dat.xmlSpec;
			phoneNumber = dat.phoneNumber;
			this.log("De-queued data for "+rule);
		}
		if(this.isChatInProgress()){
			this.log("Chat already in progress... rule chat request ignored. rule="+rule.toString());
			dat = !!dat?dat:{rule:rule,chatType:chatType, xmlSpec:xmlSpec, phoneNumber:phoneNumber};
			this.chatRequestQ.push(dat); // put it back on the queue for log flush and then reset queue
			this.drainRequestQ();
			this.requestInProgress = false;
			return; // chat is already in progress
		}
		if(this.requestInProgress){ // a chat has already been requested... queue up
			this.chatRequestQ.push({rule:rule,chatType:chatType, xmlSpec:xmlSpec, phoneNumber:phoneNumber});
			this.log("CHAT REQUEST ALREADY IN PROGRESS... waiting "+rule.toString());
			return; // request is already in progress... queue up and wait for reply
		}
		this.requestInProgress = true;
		this.log("Requesting chat for rule: "+rule.toString());
		/* Please note: it is important for ChatMgr.prototype.onPageLanding to clear the chat upon detection of off-site timeout
		 * Otherwise the code will fail below:
		 */
        var c2cToPersistent = c2cPersistent ? c2cPersistent : isC2cPersistent();
		// create a new data structure for the chat, we will persist the chat
		// data to cookies once we have a chatID from the tagserver (after the request).
		this.chatData = {
			ruleID: rule.getID(),
			chatType: chatType,
			xmlSpec: xmlSpec,
			pn: phoneNumber,
			pC: false,
			ci: {},
			aMsgCnt:0,
			cMsgCnt:0,
            c2cToPersistent: c2cToPersistent,
                        buID: -1
        };

		if(this.isBlocked(chatType)) { return; }
		this.rule = rule;
		if(!!phoneNumber)
			this.rule["phoneNumber"]=phoneNumber;
		this.xmlSpec = xmlSpec;
		var incGroup = PM.getVar("incGroup").getValue();
		this.chatType = chatType;
		var data = {
			p: (ChatMgr.persistentTarget == window.parent.name),	/* p (for persistent) was added to avoid caching problem */
			xd: PM.isCrossDomain(),
			siteID: siteID,
			pageID: LDM.getPageID(),
			custID: Inq.getCustID(),
			chatSpec:MM.mergeChatSpec(xmlSpec),
			chatType: chatType,
			pmor: this.pmor,
			rule: {
				id: rule.getID(),
				name: rule.getName(),
				priority: rule.getPriority(),
				aAtts: rule.getAgentAttributes(),
				ruleAttributes: rule.getRuleAttributes(),
				qt: rule.getQueueThreshold(),
				phoneNumber: phoneNumber,
				buID: rule.getBusinessUnitID()
			},
			incAssignmentID: getIncAssignmentID(),
			sessionID: getSessionID(),
			incGroup: incGroup
		};

		// MAINT24-208 BR30: do not present further C2Call invitations until the agent closes the call
		if (this.isCallServiceType(chatType) && this.getLastCallID()) {
			data.lastCallId = this.getLastCallID();
		}

		this.fireChatRequested(this, data);
		var sData = MixIns.JSON.stringify(data);
		try{
			this.callRemote(urls.requestChatLaunchURL, {d: sData});
		}catch(e){}
	};

	ChatMgr.prototype.init = function(){
		if (this._init) { return;}
		this.vitalVar = new Variable(this.getID(), {}, resources["vital"]);
		this.stateVar = new Variable(this.getID(), {}, resources["state"]);
		this.sessionVar = new Variable(this.getID(), {}, resources["session"]);
		this._init = true ;
		return this;
	};

	/**
	 * @returns - url for the chat router 
	 */
	ChatMgr.prototype.getChatRouterURL=function(){
		return urls.chatRouterVanityDomain ;	
	};

/**
   *  Ask the Chat Router for information via Code injection
   *  @param url - relative URL for the receiving java application
   *  @param dataJSON - the data in JSON format
   *  @param bust - flag signifying that cache busting is wanted
   */
	ChatMgr.prototype.ask=function(url, dataJSON, bust) {
		var rand =  (Math.round(Math.random()*1000000000123)).toString(36);
		var	crHost = this.getChatRouterURL() + url + "?";
		for (name in dataJSON) {
			crHost += ((crHost.indexOf("?")==-1) ? "?" : "&") + name + "=" + dataJSON[name] ;
	}
	if (bust) crHost += "&z="+rand ;
		var s = window.document.createElement("sc"+"ript");
		s.setAttribute("type", "text/javascript");
		s.setAttribute("language", "JavaScript");
		s.setAttribute("src", crHost);
		window.document.getElementsByTagName("body")[0].appendChild(s);
	};

/**
   *  Ask the Chat Router if there is an active chat with the given chat-id
	 *  @param chatID - Chat id identifying the current chat
   *  @see ChatMgr.prototype.ask
   */
ChatMgr.prototype.askForActive=function(chatID) {
	this.ask("/chatrouter/chat/isChatActive",{chatId: chatID}, true) ;
	};

	ChatMgr.prototype.getPersistentID = function(){};
	/**
	 * The onDataReady method is invoked by the PersistenceMgr when all cookie state is available.
	 * The ChatMgr may load its state at this point.
	 * ...Moved the "dataLoaded" setting to follow the test.
	 * TODO: unit test
	 */
	ChatMgr.prototype.onDataReady = function(){
        if(this.dataLoaded) {
            return;
        }
        this.dataLoaded = true;
        this.init();
        this.load();
        if(this.isPersistentWindow()){
            this.setPersistentChatSetting(true);
        }

        this.resetStateAfterPersistentChat();
        if (this.isPersistentWindow()) {
            var o = getOpener();
            try {o.setTimeout(o.inqFrame.Inq.ChatMgr.RegisterChatFromPersistent, 1);
            }
            catch(e){
                log(e + " RegisterChatFromPersistent");
            };
        }

    };

/** ChatMgr.prototype.whenPersistent - fired when the chat-manager detects whether-or-not there is
   *    a persistent chat.
   *
   *  This code allows the persistent chat to "follow" the same protocol and domain as the hosted client page
   *  When the client page changes, and the protocol/host is different for the persistent chat, then we 
   *  	reissue the "open" request to change the persistent page.
   *	This does not work in Chrome, and we are OK with that :)
   *
   *  @param isPersistent - boolean true/false
   *  @param protoDomain - String containing the protocol and domain of the persistent chat
   *  @param transferURL - new URL for the persistent frame
   *  @param needNewOpener - opener needs to be reestablished
   */
ChatMgr.prototype.whenPersistent = function (isPersistent,protoDomain, transferURL, needNewOpener) {
	var instance = inqFrame.Inq.ChatMgr.getInstance();
	if (isPersistent) {
		var myProtoDomain = window.location.protocol + "//" + window.location.hostname ;
		if (myProtoDomain != protoDomain) {  
			if(Inq.multiHost){
				/* If we have multiple hosts, then fix the pathname to be correct for this new domain */
				var myHash = transferURL.split("#"); 	// make an array of all elements separated by hash 
				myHash.shift(); 						// remove protocol://domain/path
				/* Please note: window.location.pathname is the URL of the hosted file for this domain 
				 * so just add the hash information on the end and we are good-to-go
				 */
				transferURL = myProtoDomain + "/" + window.location.pathname + "#" + myHash.join("#");
			}		
			this.againPopoutChat(transferURL,true,false) ;
		}
		if (needNewOpener && (myProtoDomain == protoDomain)){
			this.againPopoutChat(transferURL,false,false) ;
		}
		return;
	}
	else {
		instance.setPersistentChatSetting(false)
	}
	instance.testForContinueChatting();
};

ChatMgr.prototype.isPersistentChatMaybeActive=function(){
			return this.getPersistentChatSetting();
	};

	/**
	 * The onRemoteCallback method is called after the ChatMgr has made a successful
	 * "requestChatLaunch" call to the remote launch controller. This callback
	 * method will contain all necessary data to actually display/launch a chat.
	 * @param data contains a JSON string that can be parse to create the following:
	 * 	chatID
	 * 	siteID
	 * 	pmor
	 * 	chatType
	 * 	chatSpec
	 *  custID
	 *  rule
	 *  persistentChat
	 *  relaunch
	 *  err
	 *  dbg
	 */
	ChatMgr.prototype.onRemoteCallback = function(data ){
		this.requestInProgress = false;
		try {
			this.log("Request callback for rule: "+this.rule.toString());
			var chatData = MixIns.JSON.parse(data);

			/* Sanity Check */
			if (this.isPersistentWindow()){
				if (!this.chat.pC){
					var fault = new Error("chatData incorrect");
					fault.name = "Launch Error";
					fault.funcName = "onRemoteCallback";
					ROM.post(urls.loggingURL, {level:"info", line: ("Failure to Launch: "+catchFormatter(fault))});
				}
			}

			var incGroup = PM.getVar("incGroup").getValue();
			this.pmor = chatData.pmor;
			if(this.chatType == this.CHAT_TYPES.POPUP || this.chatType == this.CHAT_TYPES.POPUP_CALL){
				var exposureData = {
					siteID: Inq.getSiteID(),
					customerID: Inq.getCustID(),
					incrementalityID: getIncAssignmentID(),
					sessionID: getSessionID(),
					brID: this.rule.id,
					group: incGroup,
					businessUnitID: this.rule.getBusinessUnitID(),
					result: chatData.result,
					rule: this.rule
				};
				BRM.fireExposureQualifiedEvent(exposureData);
			}
			// if we have no chat id, then no chat should be launched
			// return immediately without creating a chat.
			if(isNullOrUndefined(chatData.chatID)) {
				if(chatData.serviceMissedEvent) {
					BRM.fireServiceMissedEvent(this.rule, this.chatData.chatType);
				}
				this.save();
				return;
			}
			this.chatData['id'] = chatData.chatID;
			this.chat = Chat.unmarshal(this.chatData).load();
			var launchTime = new Date();
			if (this.isImagePosition) {
                this.getChatData().getChatSpec().chatTheme.pos = "CENTER";
                this.getChatData().getChatSpec().chatTheme.lx = 0;
                this.getChatData().getChatSpec().chatTheme.ly = 0;
            }

			var chatParams = {
				id: chatData.chatID,
				rule: this.rule,
				chatType: this.chatType,
				timestamp: launchTime,
				persistentChat: !!chatData.persistentChat
			};

			this.lastChat = {
				id: this.getChatID(),  // chat id
				chatType: this.chat.getChatType(), // chat type
				timestamp : launchTime,
				businessUnitID: this.rule.getBusinessUnitID(),
				brID: this.rule.id
			};

			// MAINT24-208 BR30: do not present further C2Call invitations until the agent closes the call
			if (this.isCallServiceType(this.getChatType())) {
				this.lastCallId = this.getChatID();
			}

			if(this.getChatType() == this.CHAT_TYPES.POPUP){
				this.lpt = new Date().getTime();
			}

			// MAINT27-278 (Create 'engagement.windowDisplayed' event): inHOP value here is used only
			// for windowDisplayed event and don't have to be persisted as part of chat data this.chat.cd
			this.chat.inHOP = chatData.inHOP;

			this.launchChat(this.chat);
			if(this.getChatType() == this.CHAT_TYPES.MONITOR) {
				this.closeChat();
			}
			this.save();

			// MAINT25-129: chatID=0 in 'conversionFunnel.engaged'
			// Moved firing this event from C2CMgr here to be sure chatid is already available
			if (this.getChatType() == this.CHAT_TYPES.C2C || this.getChatType() == this.CHAT_TYPES.C2CALL) {
				BRM.fireServiceEngagedEvent({brID: this.rule.id});
			}
		} catch(e) {
			ROM.post(urls.loggingURL, {level:"info", line: ("Failure to Launch: "+catchFormatter(e))});
			log("Error parsing Chat Data: \n" + e + "\n" + data);
			if (this.earlyPopout) {
				try {
					this.earlyPopout.close();
				}catch(e){}
			}
		}
		finally{
			if(this.chatRequestQ.length>0){ // send next request
				this.request();
			}
		}
	};
	ChatMgr.prototype.resetStateAfterPersistentChat = function() {
		if (!this.isPersistentChat()) {
			return;
		}
		if (!this.isPersistentChatInProgress()) {
			this.chat.close();
			delete this.chat;
			this.save();
		}
	};
	/**
	 * The onPageLanding event is generated by the LandingMgr. It signifies that the browser
	 * document has changed because a new page has loaded. The chat manager must re-animate
	 * any existing chat at this point.
	 */
	ChatMgr.prototype.onPageLanding = function(evt) {
		try {
		if(!!evt.reinitialized && this.isChatInProgress())
			return;
		if(this.getPersistentChatSetting()){
			this.setPersistentWindowActive(true);
		var o = getOpener();        /* Have the client window register the persistent window as active */
				try {
					o.setTimeout("inqFrame.Inq.FlashPeer.setPersistentWindowActive(true);", 1);
				}
		catch(e){}
		}

		if (!this.isPersistentChat()){
			if (this.isV3Continue()){
				var now  = (new Date()).getTime();
				var then = this.getChatInterfaceData().lt;
				/* For XD mode we can store time of unload only in inqLT
				for the same reason we keep inqCA */
				if (CM.xd) {
					var unloadTime = CM.cookies["inqLT"];
					if (unloadTime && then && unloadTime > then) {
						then = unloadTime;
					}
				}
				then = (then) ? (then+(1000*Inq.v3TO)) : null;
				if (then != null && then < now){
					this.setChatInterfaceData({});
					/**
					 * If we have timed-out, we must clear the Chat Interface data and the chat
					 * this.chat MUST be reset to null or  ChatMgr.prototype.request will fail
					 * ChatMgr.prototype.request tests for chat being null, if it is not, it returns
					 * ... and the request will not continue.
					 */
					this.chat = null ;
					this.save();
				}
			}
			/** OK if:
			 *      we are NOT persistent
			 *      we are NOT a continuation
			 *      we have a chat object
			 * Then: we need to delete it because:
			 *      if we are not a continuation and we just landed here, how can we have a chat!
			 * So it is left over from a chat on a previous page like from a chat that has a thank-you image
			 * ... and we transitioned to this page WITHOUT closing the thank-you!
			 *
			 *  JIRA Ticket https://dev.inq.com/jira/browse/MAINT24-254
			 *  Description:  C2C available image becomes unclickable when the customer refreshes or goes to another page without closing TY image
			 */
			else if (this.chat!=null){
					this.chat.close();
					delete this.chat;
				this.save();
			}
		}
		this.testForPersistentChat();		/* Test for persistent chat first, if persistent then we are active */
		} catch (e){
			ROM.post(urls.loggingURL, {level:"ERROR", line: ("CHM failure on onPageLanding: "+catchFormatter(e))});
		}
	};

	ChatMgr.prototype.start = function(){
		if(this.started) {return;}
		this.started = true;
	};

ChatMgr.prototype.getOpenerChatFrame=function(){
	try {
		if(this.isPersistentWindow() && Inq.isSameOrigin()){
			return Inq.parent.opener.inqFrame;
		}
	} catch (err){
		ROM.post(urls.loggingURL, {level:"info", line: ("Failure to Launch: "+catchFormatter(err))});
	}
	return null;
};

ChatMgr.prototype.persistentRefresh =  null;  //cookie data for refreshing persistent chat

	/**
   *   Sets data needed to refresh the persistent chat
   */
ChatMgr.prototype.setPersistentRefresh=function(refreshData) {
	var ptrn="tcRefresh=";
	document.cookie = ptrn+refreshData+";";
	this.persistentRefresh = refreshData	;
};

/**
   *  getPersistentRefresh
   *  checks cookie to see if persistent is being refreshed
   */
ChatMgr.prototype.getPersistentRefresh=function() {
			var refresh = null ;
			if (!Inq.CHM.isPersistentWindow()) return null;
			if (Inq.CHM.persistentRefresh!=null) return Inq.CHM.persistentRefresh ;
			var _opener = null ;
			try {_opener = Inq.CHM.getOpenerChatFrame() ;} catch (e){ _opener = null;}
			/* Add guard condition for a closed opener, this can cause a throw if client window has been closed */
			if (_opener && !_opener.closed &&  opener.Inq.CHM["persistentRefresh"]!=null){
				return _opener.Inq.CHM.persistentRefresh;
				}
			if (document.cookie.length < 1) return refresh ;

			var ptrn="tcRefresh=";
			var cookies = document.cookie.split(";");
			/* look for the cookie for tcRefresh */
			for (var ix=0; ix < cookies.length; ix++){
				var ck = cookies[ix] ;
				while (ck.substr(0,1)==" ") ck = ck.substr(1);
				if (ck.indexOf(ptrn)==0) {
					ck = unescape(ck.substr(ptrn.length)) ;
					refresh = Inq.CHM.persistentRefresh = (ck.length>0)?ck:null ;
					return (refresh) ;
				}
			}
			return refresh ;
		};


	/**
	 * The load method is used internally by the ChatMgr to load its persistent state. This method
	 * should not typically be called by external objects and should be private to the
	 * ChatMgr.
	 */
	ChatMgr.prototype.load = function(){
		function fixBlockedServicesData() {
			var blocked = {};
			var sessionServices = sessionData["blocked"];
			if(!!sessionServices) {
				for(var service in sessionServices) {
					blocked[service] = sessionServices[service];
				}
			}
			var stateServices = stateData["blocked"];
			if(!!stateServices) {
				for(var service in stateServices) {
					blocked[service] = stateServices[service];
				}
			}
			return blocked;
		}

		this.absorb(this.vitalVar.getValue());
		this.absorb(this.stateVar.getValue());
		this.absorb(this.sessionVar.getValue()); // reconstitute a chat if it exists
		this.chat = Chat.unmarshal().load();
		if(!!this.chat){
			// this saves us a LOT of space on the cookie...
			// we only save the xml "override" objects in the cookie.
			this.rule = this.chat.getRule();
		}
		// fix blocked services
		if (!!this.blocked) {
			this.blocked = fixBlockedServicesData();
		}
		if (this.getLastChat() && this.getLastChat().svyPrms) {
			MixIns.mixAbsorber(this.getLastChat().svyPrms);
		}
		return this;
	};

	/**
	 * The save method is used internally by the ChatMgr to save its persistent state. This method
	 * should not typically be called by external objects and should be private to the
	 * ChatMgr.
	 */
	ChatMgr.prototype.save = function(){
		function prepareBlockedServicesData(services) {
			for(var service in services) {
				if(services[service] == 0) {
					if(!sessionData.blocked) {
						sessionData.blocked = {};
					}
					sessionData.blocked[service]=services[service];
				} else if(services[service] == -2){
					// no persistence... page level blocking
				} else {
					if(!stateData.blocked) {
						stateData.blocked={};
					}
					stateData.blocked[service] = services[service];
				}
			}
		}
		var sessionData = {pmor: this.pmor, cb: this.cb};
		if(this.chat != null) {
			this.chat.save();
			/* Lets get the ruleID and ruleName from their getters in the chat router
			Getting them from the rule can be risky in IE because if the client has been closed,
			then the rules object can cause a fault.
			@see http://dev.inq.com/jira/browse/MAINT22-213
			*/
			sessionData.chat =  {
				id: this.chat.getChatID(),
				ruleID: this.rule ? this.rule.getID() : this.chat.getRuleId(),
				aid: this.chat.getAgentID(), // agentID is necessary "dynamic" data. Not part of any spec or theme
				pC: this.chat.isPersistent()
			};
		}
		var vitalData = {
			lpt: this.lpt,
			lastChat: this.lastChat,
			lastCallId: this.lastCallId
		};
		var stateData = {};
		if(!!this.blocked) {
			prepareBlockedServicesData(this.blocked);
		}
		try {this.vitalVar.setValue(vitalData);} catch(e){log("ChatMgr.save sessionData: "+e,e);}
		try {this.stateVar.setValue(stateData);} catch(e){log("ChatMgr.save sessionData: "+e,e);}
		try {this.sessionVar.setValue(sessionData);} catch(e){log("ChatMgr.save sessionData: "+e,e);}
	};

	/**
	 * Determine whether a potential listener should be added to this object's list of
	 * event listeners. To be a ChatMgr listener, a listener should implement at least one of the following
	 * methods:
	 * 		onChatRequested
	 * 		onChatLaunched
	 * 		onChatClosed
	 *      onChatEngagedEvent
	 * 		onPersistentPush
	 * 		onAgentMsg
	 * 		onCustomerMsg
	 */
	ChatMgr.prototype.isListener = function(l){
		if(l && (l.onChatRequested || l.onChatLaunched || l.onChatClosed || l.onPersistentPush || l.onAgentMsg || l.onCustomerMsg || l.onAgentAssigned || l.onChatEngagedEvent || l.onChatEvent))
			return true;
		return false;
	};

	ChatMgr.prototype.cloneChatInterfaceData = function(srcobj){
		if(srcobj == null || typeof(srcobj) != 'object')
			return srcobj;
		var newobj = new srcobj.constructor();
		for(var key in srcobj)
			newobj[key] = this.cloneChatInterfaceData(srcobj[key]);
		return newobj;
	};

	ChatMgr.prototype.getChatInterfaceData = function(){
		return !!this.chat?this.chat.getCiData():{};
	};

	ChatMgr.prototype.setChatInterfaceData = function(data){
		if (!this.chat)
			return;
		this.chat.setCiData(data);
	};
	/**
	 * API: Opens an empty persistent chat to be propagated at chat launch.
	 *   	When a customer clicks .
	 * 		Fires a chat close event on invocation if thank you has not yet been shown.
	 * 		If thankyou has been shown,
	 * 			then the invocation will hide the chat and reset the state of the chat manager for re-chat.
	 * @param cT - contains the chat theme that has the window metrics as follows:
	 * 	cT.px		- offset in the x axis (across) in pixels to put the persistent chat.
	 * 	cT.py		- offset in the y axis (down) in pixels to put the persistent chat..
	 * 	cT.pw		- width in pixels of the persistent chat.
	 * 	cT.ph		- height in pixels of the persistent chat
	 * @return void
	 * @see launch in InqC2CMgr
	 */
	ChatMgr.prototype.earlyPopoutChat = function(cT){
		var winTest = null ;
		var url="", target = ChatMgr.persistentTarget;
		var tools = "toolbar=no,location=no,menubar=no,status=no,scrollbars=no" +
					",top=" + cT.py +
					",left=" + cT.px +
					",width=" + cT.pw +
					",height=" + cT.ph +
					",resizable=1" ;
		try {
			winTest = top.open(url, target, tools);		
		} catch (e1) {
			winTest = null;
		}

		/* On iPad open() opens a new tab and move focus to the new tab
		 * As the result the opener can not execute callback.
		 */
		try	{
			if ( null != winTest && getOSType() === "iOS" && window.focus )	{
				top.focus();
			}
		} catch (e2) { }

		this.earlyPopout = winTest ; // Window of the soon-to-be pop-out chat
	};
	/**
	 *  engagePersistentChat
	 *  ask persistent chat (via the chat router) whether-or-not it is active
	 *  supply the following information to the chat-router (CR)
	 *  chatID, so CR knows which persistent chat to query
	 *  pd,     protocol and domain of the current client instance
	 *  xfr,    URL where the persistent chat should transfer
	 *
	 *  @param xfr - URL where the persistent chat should transfer
	 *
	 *  called from Inq.CHM.
	 */
ChatMgr.prototype.engagePersistentChat = function (xfr) {
	var chatID = this.getChatID();
	var myProtoDomain = window.location.protocol + "//" + window.location.hostname ;
	try {
	this.ask("/chatrouter/chat/isPersistentActive",{chatId: chatID, pd: myProtoDomain, xfr: (xfr)?xfr:false}, true) ;
	} catch (e) {
	log("ChatMgr.proto.engagePersistentChat: 524: ERROR"+e,e);
	}
	return ;
};

	/**
	 *  CloseChatFromPersistent
	 *   This is fired from the persistent windows use of a timer and
	 *   "this" may not be pointing to the chat manager instance.
	 *   get the instance and fire the non static "closeChatFromPersistent"
	 *
	 *   @param - chatID
	 */
	ChatMgr.prototype.CloseChatFromPersistent = function() {
		ChatMgr.getInstance().closeChatFromPersistent();
	};

	ChatMgr.prototype.againPopupChatUrl="";
	ChatMgr.prototype.againPopoutChatRetry= function () {
			var inst = Inq.CHM ;
			inst.againPopoutChat(inst.againPopupChatUrl, true, true);
	};

	/**
	 *   __againGetPersistentWindow - private function to get the current persistent window
	 *
	 *
	 *   @param none
	 *   @return persistent window or null
	 *   @see  ChatMgr.prototype.againPopoutChat
	 *	 @author fpinn@TouchCommerce.com
	 *		Notes: *Different Origin is when the pop-out window's protocol or domain do not match the client window (this window)
	 *				this causes a fault to be thrown when one accesses from client to persistent window.
	 */
	ChatMgr.prototype.__againGetPersistentWindow=function (){

		var winTest = null ;
		/* Special tools string to test if window is available
			The top and left are not in the visible area, so this should fail for non-existent target
			The width and height are zero, so this should fail for non-existent targets
		 */
		var tools = "toolbar=no,location=no,menubar=no,status=no,scrollbars=no" +
					",top="+ "-500" +
					",left=" + "-500" +
					",width="+"0" +
					",height="+"0" +
					"";
		/* Open the window with a blank url to get the window object for the persistent chat
		 * This should return the window by the target specification (argument #2)
		 * Then test for valid window.
		 */
		try {
			winTest = win.open("", ChatMgr.persistentTarget, tools);
			if (winTest != null){
				var loc = "err";	/* Default value of err for case of different origins (see note above)*/
				try {loc=winTest.location.href;}catch(e){loc="err";} /* If this window is different origin then use default value */
				/* If the location is "about:blank" then:
				 *   we have a blank document and not the persistent chat
				 *   we must close the blank document
				 */
				if ("about:blank" ==  loc){
					winTest.close() ; winTest = null ;
				}else if (loc!="err"&&loc!=undefined){
					/* We do not do this if there are different origins (see note above)
					 * It will fail, so if loc=="err" or undefined then we know we have different origins
					 */

					/* If we have no document or body, then we close the window, it is not a valid persistent chat
					 * If the document body is empty, we again are not a valid persistent chat
					 */
					if (!!winTest.document && !!winTest.document.body){
						if ("" == winTest.document.body.innerHTML) {
							winTest.close() ;	/* Empty body, not persistent chat */
							winTest = null ;
						}
					}
					else {
						winTest.close() ; winTest = null ; /* No body or document, not valid persistent chat */
					}
				}
				if (winTest == top || winTest == self) /* if winTest is the same as this window(self) then not a valid persistent chat */
					return null ; /* IMPORTANT: do not close in this case, because we may close the client (self) */
			}
		} catch(e){};
		return winTest ;
	};
	/**
	 *   againPopoutChat - popout the chat into an existing popup window
	 *   This is used to:
	 *   1) Move the chat to a new domain
	 *   2) or to reestablish the opener link
	 *
	 *   @param transferURL - new URL to transfer to
	 *   @param differentDomains - boolean, the domains do not match
	 *   @param retry
	 *
	 *   dependent on Inq.v3framesrc - from LandingFramework.jsp
	 *   references: 	  setPersistentRefresh
	 */
ChatMgr.prototype.againPopoutChat=function (transferURL, differentDomains, retry) {
			var persistentFocus = true ;
			var winTest = null ;
			if (isChrome()) return;

			var url, target ;
			var port = (window.parent.document.location.port=="")?"":(":"+window.parent.document.location.port);
			url = (Inq.v3framesrc.indexOf("/")==0)
				? window.parent.document.location.protocol + "//" + window.parent.document.location.hostname + port + Inq.v3framesrc
				: Inq.v3framesrc ;
			var ix = transferURL.indexOf("#");
			var extra = "" ;
			if (ix>=0) {
				url = transferURL.substr(0,ix) ;
				extra = transferURL.substr(ix+1);
				this.setPersistentRefresh(extra) ;
			} else {url = transferURL;}

			target = ChatMgr.persistentTarget;
			var tools = "toolbar=no,location=no,menubar=no,status=no,scrollbars=no" +
					",top="+ "-500" +
					",left=" + "-500" +
					",width="+"0" +
					",height="+"0" +
					"";
			/* Get the current persistent chat window
			 * We know we have the persistent chat window because we would not be here if it didn't exist
			 * If we fail to get the persistent chat window, then do not relocate it because it will result
			 * 	in an additional persistent window to pop up :(
			 * This is due to an error in FireFox 3.6.12
			 */
			winTest = this.__againGetPersistentWindow();
			if (winTest != null) try {
				/* Set temporary variable to indicate that persistent chat window is refreshed 
				 * for domain change. */ 
				if(!retry && differentDomains ) {
					window.Inq.isChatRefresh = true;
				}				
				try { winTest = window.parent.open(url, target, tools); }
				catch (e) {	winTest = Inq.win.open(url, target, tools); }

				if( ! winTest ){
					log("pop up blocker");
				}
				else if (false || isChrome()) {
					if (!retry && differentDomains )	{
						this.engagePersistentChat(url);
						this.againPopupChatUrl = transferURL ;
						try {window.setTimeout(
							this.againPopoutChatRetry , 2000);
						}catch(erz){}
						return ;
					}
					else if("about:blank" == winTest.location.href){
						return ;
					}
					else if (retry) {
							winTest.opener = window.parent ;
					}
					else
						log("InqChatMgr.againPopoutChat: how did I get here?: "+winTest.location.href);
				}

				if ("" != url){
					if (winTest == top)
						winTest = null;
				}
				else {
					var newdoc = null ;
					if (winTest) {
						try {newdoc = winTest["document"];} catch(e) {}
						if (newdoc==null)
							try {newdoc = winTest.document;} catch(e){}
					}
					if (newdoc) {
						var scriptz = document.getElementsByTagName("SC"+"RIPT");
						var scrp = null ;
						for (ix=0;ix < scriptz.length;ix++){
							if (scriptz[ix].src.indexOf("/inqChatLaunch")>=0) {
								scr =
								'<script type="text/javascript" src="'+scriptz[ix].src+'"/></script>';
								break ;
							}
						}
						if (scrp)
							newdoc.write(scrp);
						else
							newdoc.close();
					}
				}
			} catch (e) {
				log("throw: "+e);
				winTest = null;
			}

			this.persisentWindow = winTest ;
			if (winTest){
				if (winTest.focus)
					try {winTest.focus();}catch(e){}
				return true ;
			}
			else
				return false;
	};

	/**
	 * getPersisgtentChatSetting
	 * get persistent variable value for "pc" (peristent chat)
	 * @default - true if in persistent chat window, false if not in persistent chat window
	 * @return - boolean true if pc is set to true, false if set to not true
	 */
ChatMgr.prototype.getPersistentChatSetting=function() {
	var pc ;
	var pcVar = Inq.PM.getVar("pc");
	if  (pcVar == null) {
		pcVar = (new Variable("pc", (pc=""+(ChatMgr.persistentTarget == window.parent.name)), resources["session"]));	//Inq.SaveMgr.setSessionParam("pc", "true");
		pcVar.init();
		pcVar.getValue();
		Inq.PM.addVar(pcVar);
	}
	try {pc = pcVar.getValue();}
	catch(e){
	log("ChatMgr.getPersistentChatSetting ERROR:"+e,e) ;
	}
	return (pc=="true");
};

	/**
	 * setPersistentChatSetting
	 * set persistent variable value for "pc" (peristent chat)
	 * @param  - boolean or string value for persistent chat active
	 */
ChatMgr.prototype.setPersistentChatSetting=function(pc) {
	pc = ""+pc; /* Stringafy the boolean */
	var pcVar = Inq.PM.getVar("pc");
	if  (pcVar == null) {
		pcVar = (new Variable("pc", pc, resources["session"]));	//Inq.SaveMgr.setSessionParam("pc", "true");
		pcVar.init();
		pcVar.setValue(pc);
		Inq.PM.addVar(pcVar);
		return ;
	}
	pcVar.setValue(pc);
};

	ChatMgr.prototype.setPersistentWindowActive = function(status){
		try {
			if (status==null)
				return;
		if (ChatMgr.persistentTarget == win.name && Inq.isSameOrigin()) {
			if( !!this.chat )
					this.chat.pC = status ;
			this.save();
			var o = (win.opener && win.opener.inqFrame)
					? win.opener.inqFrame
					: ((window.opener) ? window.opener : null) ;
			o.setTimeout('Inq.CHM.setPersistentWindowActive('+status+')', 0);
		}
			else if(!isNullOrUndefined(this.chat) && this.chat.pC != status) {
				this.chat.pC = status ;
		}
		} catch(e){
			ROM.post(urls.loggingURL, {level:"info", line: ("Failure on setPersistentWindowActive: "+catchFormatter(e))});
		}
	};

	ChatMgr.prototype.isPersistentWindowActive = function(){
		return (null!=this.getPersistentWindow()) ;
	};

	/**
	 *   If the cookie says it is active, beleive it, because the cookie has been corrected at page landing
	 */
	ChatMgr.prototype.isPersistentChatActive = function(){
		return this.isPersistentChatMaybeActive();
	};

	ChatMgr.prototype.isPersistentChatInProgress = function(){
		return this.isPersistentChatActive();
	};

	ChatMgr.prototype.isPersistentChat = function() {
		if (this.chat && this.chat.pC) {
			return true;
		}
		else {
			return false;
		}
	};


	ChatMgr.prototype.getPersistentWindow = function(){
		var winTest = null ;
		var strWidth ;
		var strHeight = 300 ;
		var sLeft = 0 ;
		var sTop  = 0 ;
		strWidth  = 0 ;
		if (ChatMgr.persistentTarget == win.name) return true ;
		var toolsForTest = "toolbar=no,location=no,menubar=no,status=no,scrollbars=no" +
				",top="+ "-500" +
				",left=" + "-500" +
				",width="+"0" +
				",height="+"0" +
				"";
		try {
			if (this.popoutWindow != null &&
				this.popoutWindow != false &&
				this.popoutWindow != true &&
				typeof(this.popoutWindow) == "object") {
				if (this.popoutWindow.closed) {
						this.popoutWindow = null ;
						return null ;
				}
			}
			if (this.chat.popoutWindow == false)
				return null ;

			/* If we have the window of the soon-to-be pop-out chat (earlyPopout) ...
			 * Then we don't have an active popout chat, yet
			 */
			if (this.earlyPopout)
				return null ;

			winTest = win.open("", ChatMgr.persistentTarget, toolsForTest) ;
			if (winTest != null){
				if ("about:blank" ==  winTest.location.href){
					winTest.close() ; winTest = null ;
				}else{
					if (winTest.document && winTest.document.body){
						if ("" == winTest.document.body.innerHTML) {
							winTest.close() ;
							winTest = null ;
						}
					}
					else {
						winTest.close() ; winTest = null ;
					}
				}
				if (winTest == top || winTest == self)
					winTest = null ;
			}
			this.popoutWindow = winTest ;
		}
		catch (e) {
			winTest = null; // there used to be a string called "something" here.
			//winTest should be returning null or else the non popup chat will show in the check for a persistent window.
		}
		return (winTest) ;
	};

	/**
	 * testForPersistentChat - establish whether-or-not persistent chat is active
	 * if not in persistent window (in client window) and the PM says that we are in persistent
	 * then ask the chat-router to determine whether persistent is active.
	 * otherwise see if any other chat is active
	 */
	ChatMgr.prototype.testForPersistentChat = function() {
	if( !this.isPersistentWindow() && this.isPersistentChatMaybeActive()) {
		if (!isChrome()) /* If we are chrome, use the persistent value of pc */
		this.engagePersistentChat(false);
		return ;
	}
	this.testForContinueChatting();
	};

	ChatMgr.prototype.testForContinueChatting = function(){
		var isV3Continue = this.isV3Continue();
		var isPersistentWindow = this.isPersistentWindow();

        // We need to continue, we should do it if we are in persistant window, or if there is no other active chat already around
        if (isV3Continue && (isPersistentWindow || (!this.isV3Active() && !this.isPersistentChatActive()))) {
            this.continueChatting() ;
        } else if (isPersistentWindow) {
			/* If we are here, then we have a click to persistent chat
			 * We must make sure that we have a chat constructed so we can
			 * continue chatting */
			var o = getOpener();
			var c = (o.Inq.CHM.chat == null) ? Inq.CHM.chat : o.Inq.CHM.chat ;
			if (c==null) {
				var fault = new Error("Missing Chat Object");
				fault.name = "Persistent Fault:";
				fault.func = "testForContinueChatting";
				ROM.post(urls.loggingURL, {level:"info", line: ("Failure to Launch: "+catchFormatter(fault))});
				window.parent.close();
			}
			/* NOTICE:
			 * We know that cd of the Chat object is clonable
			 *   but we CANNOT use cd.clone() !!!
			 *   Why? Because the cd is in the client space and therefor the clone is in client space
			 *   This results in a new cd that is in client space, we MUST have it in persistent window space,
			 *     So we will call JSON.clone to perform this in OUR pesistent window space to avoid memory problems.
			 */
			var cd=MixIns.JSON.clone(c.cd);	/* Use new function, clone instead of the clonized function in cd, this is because if the clonized function is used, the memory is still in client window */
			this.chat = Chat.unmarshal(cd).load();
			this.chat.show();
		}
	};

	ChatMgr.prototype.continueChatting = function () {
		this.chat.chatMgr=this;
		this.chat.show();
	};
	ChatMgr.prototype.sendExitChat = function(chatID){
		try {
			var	crHost = this.getChatRouterURL();
			var exitChat = crHost + "/chatrouter/chat/exitChat" ;
			//Inq.SvrCom.sendToServer(exitChat, {chatId: chatID});
			ROM.send( exitChat, {chatId: chatID});
		} catch (e){}
	};

	/*<%-----------
	 * API: Closes the persistent chat in progress on behalf of the persistent chat.
	 *   	Throws an error if a chat is not in progress.
	 * 		Fires a chat close event on invocation if thank you has not yet been shown.
	 * 		If thankyou has been shown,
	 * 			then the invocation will hide the chat and reset the state of the chat manager for re-chat.
	 * @param _src Object invoking the close event. May be null or undefined.
	 * @param _data Object containing any data to pass on to any listeners. May be null or undefined.
	 * @param _reason (String) reason for the request
	 * @param _closeConnection (Boolean) Ask the popup to close the connection
	 * @return void
	 * @throws Error if chat is not in progress.
	 * @see this.closeChat below
	 *--%>		*/
	ChatMgr.prototype.closeChatFromPersistent = function() {
		try {
			// Mobile devices are problematic here.  For some reason
			// inqFrame never gets properly "closed."  So for those
			// devices we're going to put a limit on how long we're
			// willing to wait before moving on.
			if (!this.isMobile() || this._closeRetries++ < 20) { // 20tries * 50ms-timeout = 1000 == 1 second
				//Sometimes STT team get exception only in IE while accessing "pw.closed" after closing Persistent window.
				//Error is: "An outgoing call cannot be made since the application is dispatching an input-synchronous call"
				var pw = inqFrame["persistentChatWindow"]; // Set in ChatMgr.closePersistent()
				if (pw!=null && !pw.closed){
					this.retryTimeout = window.setTimeout('inqFrame.Inq.FlashPeer.CloseChatFromPersistent()', 50);
					return;
				}
				else {
					this.retryTimeout = null;
				}
			}
			else {
				this._closeRetries = 0;
			}
		}
		catch(e) {
			log("Error in ChatMgr.closeChatFromPersistent: " + e);
		}

		if (this.chat) {
			this.chat.persistentChat = false;
		}

        if (CM.persistentWindow) {
            CM.persistentWindow = null;
        }

		this.setPersistentChatSetting(false);
		try { this._postSurveyListener(); }
		catch(e){}

		this.setChatInterfaceData({});	/*<%-- clear the v3 data in main window --%>*/

		/*<%-- try closing the chat --%>*/
		try {
			var	crHost = this.getChatRouterURL();
			var exitChat = crHost + "/chatrouter/chat/exitChat" ;
			ROM.send( exitChat, {chatId: this.getChatID()});
		}
		catch (e) {}

		this.fireChatClosed();
		if (this.chat) {
			this.chat.close();
		}
		this.setPersistentWindowActive(false);
		delete this.chat;
		this.save();
	};

    ChatMgr.prototype.registerChatFromPersistent=function(){
		if (this.retryTimeout != null) {
			window.clearTimeout(this.retryTimeout);
			this.retryTimeout = null;
		}
		this.setPersistentChatSetting(true);
		this.save() ;
	};

	ChatMgr.prototype.getSurveyData = function(){
		return this.getChatData()!=null?this.getChatData().survey:null;
	};

	ChatMgr.prototype.setSurveyData = function(sdat){
		this.getChatData().survey=sdat;
	};

	/**
	 * Set parameters (auxiliary to survey spec) that will be passed to survey manager on survey launch.
	 * This method does not erase previously set parameters rather adds them.
	 * Parameters are stored in lastChat object in Chat manager and persisted to inqVital thus available
	 * even after chat is closed.
	 * Note: Chat manager recreates lastChat object when new chat starts.
	 * @param params object with parameters for survey.
	 */
	ChatMgr.prototype.setSurveyAuxParams = function(params){
		if (this.getLastChat()) {
			var svyPrms = this.getLastChat().svyPrms;
			if (!svyPrms) {
				svyPrms = this.getLastChat().svyPrms = MixIns.mixAbsorber({});
			}
			svyPrms.absorb(params);
			this.save();
		} else {
			log("Warning: setting survey params failed - last chat data object doesn't exist.");
		}
	};

	/**
	 * Returns survey parameters (auxiliary to survey spec).
	 */
	ChatMgr.prototype.getSurveyAuxParams = function(){
		if (this.getLastChat()) {
			return this.getLastChat().svyPrms;
		} else {
			return null;
		}
	};

	/**
	 * Sets clickstream sent flag.
	 * Flag is stored in lastChat object in Chat manager and persisted to inqVital thus available
	 * even after chat is closed.
	 */
	ChatMgr.prototype.setClickStreamSent = function(isSent){
		if (this.getLastChat()) {
			this.getLastChat().clkstr = isSent;
			this.save();
		} else {
			log("Warning: setting ClickStreamSent flag failed - last chat data object doesn't exist.");
		}
	};

	/**
	 * Returns clickstream sent flag.
	 */
	ChatMgr.prototype.isClickStreamSent = function (){
		if (this.getLastChat()) {
			return this.getLastChat().clkstr;
		} else {
			return null;
		}
	};

	ChatMgr.prototype._postSurveyListener = function(){
		var sdat = this.getSurveyData();
		if(sdat){
			if(this.surveyRegistered) return;
			this.surveyRegistered=true;
			/* ToDo We have to wait for incrementality Mangager and SurveyMgr to be implemented
			Inq.EVM.addListener({

				onChatClosed: function(evt){
					if(Inq.IM.isAssisted()){
						Inq.SurveyMgr.launchSurvey(sdat);
					}
				}
			});
			*/
		}
	};

	ChatMgr.prototype.closePersistent = function(){
		var chatID = this.getChatID() ;
		if (!Inq.isSameOrigin()) {
			this.sendExitChat(chatID);
			this._postSurveyListener();
		}
		else {
			try{
				var o = getOpener();
				o.inqFrame["persistentChatWindow"]=window.parent;
				inqFrame.Inq.MSG.closePersistent(o);
			}
			catch(err){
				this.sendExitChat(chatID);
			}
		}
	};


	/*<%-----------
	 * API: Quiesses the popup chat on behalf of the persistent chat
	 *--%>*/
	ChatMgr.prototype.inactivateChat = function(){
		if (this.chat==null) return ;
		this.chat.setVisible(false);
		var app = window["Application"] ;
		if (app&&app.application&&app.application.close)
			try {app.application.close();} catch (e){}
	};

	/*<%-----------
	 * API: Closes the current chat in progress. Throws an error if a chat is not in progress.
	 * Fires a chat close event on invocation if thank you has not yet been shown. If thankyou
	 * has been shown, then the invocation will hide the chat and reset the state of the chat manager
	 * for re-chat.
	 * @param _src Object invoking the close event. May be null or undefined.
	 * @param _data Object containing any data to pass on to any listeners. May be null or undefined.
	 * @param _reason (String) reason for the request
	 * @param _closeConnection (Boolean) Ask the popup to close the connection
	 * @return void
	 * @throws Error if chat is not in progress.
	 * @see this.closeChat
	 *--%>*/
	ChatMgr.prototype.closeChat = function(_src, _data, _reason, _closeConnection){
		/** TRICK CODE ALERT
		 * When we are closing as a persistent chat, we do NOT have much time.
		 * The window is rapidly being destroyed.
		 * For this reason we must attach a timer event to the opener window
		 *    and have it perform the close on behalf of this window.
		 */
		if(this.isPersistentWindow()){
			this.closePersistent() ;
		}
		else
		{
			this._postSurveyListener();
			if (!this.persistentChat){
				this.fireChatClosed();
			}
			this.chat.close();
			this.chat=null;
			this.save();
		}
	};

	/*<%--
	 * PRIVATE: Assertion to assure that a chat is in or not in progress. Used to protect against
	 * invocation of chat methods against inconsistent chat states.
	 * @param _inProgress true to ensure that a chat is in progress (throws if isn't), false to
	 *   ensure chat is not in progress (throws if chat is in progress)
	 * @return void
	 * @throws Error Depending on param.
	 *--%>*/
	ChatMgr.prototype._assertChatInProgress = function(_inProgress){
		if(this.chat==null){
			if(_inProgress)
				throw Error("Chat "+(_inProgress?"not ":"")+"in progress");
		}
		else if(this.chat.isVisible()||this.isPersistentChatInProgress()){
			if(!_inProgress)
				throw Error("Chat "+(_inProgress?"not ":"")+"in progress");
		}
	};
	ChatMgr.prototype.setOpacity = function(opac){
		if(this.chat) this.chat.setOpacity(opac);
	};
	ChatMgr.prototype.showPersistentButton = function(x,y,w,h){
		this.chat.pb.setPosition(x,y,w,h);
		this.chat.pb.setVisible(true);
	};
	ChatMgr.prototype.showTextInput = function(bShow,y,x,w,h){
		var o, offsetY ;
		offsetY = this.chat.chatSpec.chatTheme.tbh;
		o = win.document.getElementById("inqInput4Chat") ;
		if (o) {
			o.style.display = (bShow) ? "" : "none" ;
			o.style.top     = (y+offsetY) + "px";
			o.style.left    = x + "px";
			o.style.width   = w + "px";
			o.style.height  = h + "px";
		}
	};
	ChatMgr.prototype.hidePersistentButton = function(){
		this.chat.pb.setVisible(false);
	};
	ChatMgr.prototype.setPersistentButtonDebugActive = function(active){
		this.chat.pb.setDebugActive(active);
	};

	/*
	 * PRIVATE: Resets the internal state of the chat and clears chat detritus from DOM.
	 * @return void
	 * @throws Error if chat is not in progress.
	 * @see InqChatMgr.closeChat
	 */
	ChatMgr.prototype._resetChat = function(){
		this._assertChatInProgress(true);
		win.document.body.removeChild(this.chat.container);
		this.chat.close();
		this.chat = null;
		this.thankYouShown = !this.displayTYImage;
		this.setChatInterfaceData({});
		this.save();
	};

	/**
	 * API: Sets the currently initialized chat visible/hidden.
	 * @param {boolean} _vis true to set the chat visible in the DOM, false to hide. Uses style.display.
	 * @throws Error if chat is not initialized.
	 */
	ChatMgr.prototype.setChatVisible = function(_vis){
		this.chat.setVisible(_vis);
	};

	/**
	 * Launches an initialized chat and fires a launch event for subscribed listeners.
	 * @param chat The source Chat instance. A Chat instance contains rule,chatSpec, and
	 * 	flashvar data.
	 * @param _evtData Object containing custom data to include in the inq launch event.
	 * @return void
	 * @throws Error if chat is already in progress.
	 *
	 **/
	ChatMgr.prototype.launchChat = function(chat){
		try {
			var refresh = this.getPersistentRefresh();
			this._assertChatInProgress(false);
			if (this.chat != chat) {
				this.chat = chat;
			}
			if (!(this.getChatType() == this.CHAT_TYPES.MONITOR)) {
				this._postSurveyListener();
				this.chat.show();
			}
			this.fireChatLaunched(this.chat.getChatData());

				// chat launch must result in conversionFunnel.exposed event only for proactive chat
				if(this.getChatType() == ChatMgr.CHM.CHAT_TYPES.POPUP || this.getChatType() == ChatMgr.CHM.CHAT_TYPES.POPUP_CALL) {
					BRM.fireServiceInvitationEvent(this.chat.getRule(), this.getChatType());
			}
		}catch (e){
			ROM.post(urls.loggingURL, {level:"info", line: ("Failure to Launch: "+catchFormatter(e))});
		}
	};

	ChatMgr.prototype.getAgentID = function(){
		return (this.chat) ? this.chat.getAgentID() : null;
	};
	ChatMgr.prototype.getAgentName = function() {
		return (this.chat) ? this.chat.getAgentName() : null;
	};

	ChatMgr.prototype.getCustomerName = function() {
		return (this.chat) ? this.chat.getCustomerName() : null;
	};

	ChatMgr.prototype.isPersistentWindow = function(){
		return isPersistentWindow();
	};

	ChatMgr.prototype.getChat = function() {
		return this.chat ? this.chat : null;
	};

	ChatMgr.prototype.getLastChat = function() {
		return this.lastChat ? this.lastChat: null;
	};

	/**
	 * Provide the current email spec id of an active chat
	 * @return a non-negative id if a chat is in progress, otherwise 0
	 */
	ChatMgr.prototype.getEmailSpecId = function() {
		var emailSpecId = 0;
		var chat = this.getChat();
		if (!!chat) {
			emailSpecId = chat.chatSpec.emSpId;
		}
		return emailSpecId;
	};

	ChatMgr.prototype.getChatID = function(){
		var id = 0;
		if(!!this.chat) {
			try {
				id = this.chat.getChatID();
			} catch(e) {}
		}
		return id;
	};

	ChatMgr.prototype.getLastChatID = function() {
		var id = 0;
		if (!!this.lastChat && !!this.lastChat.id) {
			id = this.lastChat.id;
		}
		return id;
	};

	/**
	 * MAINT24-207: Chat manager remembers id of last call to check agent availability for the next call and
	 * suppress call invitation if agent hasn't closed previous call window in AI.
	 * @return id of last call; if there was no call, 0 will be returned.
	 */
	ChatMgr.prototype.getLastCallID = function() {
		return this.lastCallId;
	};

	ChatMgr.prototype.getChatType = function(){
		return this.chat ? this.chat.getChatType() : null;
	};

	ChatMgr.prototype.getLastChatType = function(){
		return this.lastChat ? this.lastChat.chatType : null;
	};

	/**
	 * Block a specific service/chat type for a period of time
	 * @param serviceType only valid type at this time is "POPUP" and "POPUP_CALL"
	 * @param period duration of blocked service in milliseconds
	 */
	ChatMgr.prototype.blockService = function(serviceType, period) {
		if(serviceType != ChatMgr.CHM.CHAT_TYPES.POPUP &&
				serviceType != ChatMgr.CHM.CHAT_TYPES.POPUP_CALL) {return;}
		if (isNullOrUndefined(this.blocked)) {
			this.blocked = {};
		}
		// block the service if it hasn't already been blocked or block duration has been expired
		if (isNullOrUndefined(this.blocked[serviceType]) || (!isNullOrUndefined(this.blocked[serviceType]) && this.blocked[serviceType] < (new Date).getTime())) {
			if (period > 0)  {
				var now = new Date();
				period += now.getTime();
			}
			this.blocked[serviceType] = period;
			this.save();
		}
	};

	ChatMgr.prototype.unblockService = function(serviceType) {
		if(serviceType != ChatMgr.CHM.CHAT_TYPES.POPUP &&
				serviceType != ChatMgr.CHM.CHAT_TYPES.POPUP_CALL) { return;}
		if (!isNullOrUndefined(this.blocked) && !isNullOrUndefined(this.blocked[serviceType])) {
			delete this.blocked[serviceType];
		}
		this.save();
	};

	ChatMgr.prototype.setCobrowseFlag = function(flag) {
		var val = (flag)?1:0;
		if (this.cb != val) {
			this.cb = val;
			this.save();
		}
	};
	
	ChatMgr.prototype.getCobrowseFlag = function(){
		return (!!this.cb)?true:false;
	};

	ChatMgr.prototype.isBlocked = function(serviceType) {
		var blockedValue = false;
		if (!isNullOrUndefined(this.blocked) && !isNullOrUndefined(this.blocked[serviceType])) {
			var now = new Date();
			var toDate = this.blocked[serviceType];
			if (toDate <= 0) { // 0 - session, -1 forever
				blockedValue = true;
			}
			else {
				blockedValue = toDate >= now.getTime();
			}
		}
		return blockedValue;
	};

	ChatMgr.prototype.isAnyBlocked = function() {
		if (isNullOrUndefined(this.blocked)) {
			return false;
		}
		for (var prop in this.blocked) {
			return true;
		}
		return false;
	};

	/*
	 * API: Provides the date/time of the latest proactive chat launched.
	 * @return Date object representing last proactive launch datetime. Null if now proactive ever launched.
	 * @throws Error if chat is not initialized.
	 */
	ChatMgr.prototype.isProactiveExpired = function(){
		if(!this.lpt) return false;
		var expireTime = new Date(this.lpt).getTime()+Inq.rechatInterval * 24 * 60 * 60 * 1000;
		var now = new Date().getTime();
		return now > expireTime;
	};

    ChatMgr.prototype.isMobile = function() {
        var deviceType = getDeviceType();
        return (deviceType === 'Phone' || deviceType === 'Tablet');
    }

	ChatMgr.prototype.popOutChat = function(transition){
		if( !this.isPersistentChatActive())
			this._firePersistentPushEvt({});
		/**
		 * For cross domain mode (CM.xd==true) we want to make sure
		 *   that cookies are set before we pop out the chat.
		 * To do this we must:
		 *  1) Pop out an empty chat window (no persistent chat, just empty) we must do this because of pop-out blockers
		 *  2) We must send out the transition message
		 *  3) We must, upon commiting the cookies
		 *     a) set the popout window to the early popout window
		 *     b) transfer the href of the early popout window to the frame source making the early popout a persistent window.
		 *     c) set persistent chat flag to true
		 *     d) set early popout to null, because it is the pop out window now.
		 *
		 */
		if (CM.xd) {
			if (transition) {
				this.chat.transitionMessage();
			}
			CM.dump();					/* dump the cookie contents */
			if (null==this.earlyPopout || this.earlyPopout.closed) {
				this.earlyPopoutChat(this.chat.chatSpec.chatTheme);
			}
			CM.setWhen3rdPartyCookieCommittedHandler(function(){
					(inqFrame.Inq.CHM).relocateToHostedPage(5);	/* relocate to hosted page with a retry of 5 times */
			});
			return true;
		} else {
			if (this.isMobile()) {
				inqFrame.Inq.FlashPeer.closePopupChat();
			}
			return this.chat.popOutChat(transition);
		}
	};
	/** relocateToHostedPage - relocates the empty early-popout window to the hosted file to become a persistent chat
	 * if this failes, it will retry until the retry count is zero
	 * @param retryCnt - the number of retries allowed
	 * @return nothing
	 * @see ChatMgr.prototype.popOutChat
	 */
	ChatMgr.prototype.relocateToHostedPage = function(retryCnt){
		try {
			this.popoutWindow = this.earlyPopout;				/* set the popout window to the early popout window */
			this.popoutWindow.location.href = Inq.v3framesrc;	/* make the early popout window a popout window by setting its location to the hosted file */
			this.chat.persistentChat = true ;					/* set persistent to true */
			if ( getOSType() === "iOS" && this.popoutWindow.focus )	{
				try	{
					this.popoutWindow.focus();
				} catch ( errFocus ) { }
			} 
			this.earlyPopout = null;							/* earlyPopout, your work is done here, thank-you for your service */
		} catch (err) {
			/* Add extra information to the Error object (err) to give more detailed information */
			err["this"] = this ;														/* Display "this" */
			err["popoutWindow"] = (this.popoutWindow)?this.popoutWindow:"undefined";	/* Display the popoutWindow object */
			err["earlyPopout"] = (this.earlyPopout)?this.earlyPopout:"undefined";		/* Display the earlyPopout window object */
			err["popoutWindow_location"] = (this.popoutWindow.location)?this.popoutWindow.location:"undefined"; /* Display the window location */
			if (retryCnt==0) 																/* If count is zero, then all retries are exhausted */
				err["PersistentFailure"] = "Persistent Popout failed, all retries exhausted"; /* Add that info to error object as well */
			/* Post the error information with trace to the tag server */
			ROM.post(urls.loggingURL, {level:"info", line: ("Failure to relocateToHostedPage("+retryCnt+"): "+catchFormatter(err))});

			if (retryCnt > 0) {
				inqFrame.Inq.FlashPeer["__relocateToHostedPage"] = function(retryCnt){(inqFrame.Inq.CHM).relocateToHostedPage(retryCnt);};
				inqFrame.setTimeout('inqFrame.Inq.FlashPeer.__relocateToHostedPage('+(--retryCnt)+');',50);
			}
			else { /* We have exhausted all retries, so we must close the popout window */
				/* Depending where the failure was, the popout window may be (earlyPopout) or (popoutWindow), try closing both */
				var wins=[this.earlyPopout, this.popoutWindow]; /* possible pointers to the popout window */
				while (wins.length) {
					w = wins.shift()							/* get window */
					if (w) {									/* if window is not null, then close it */
						try {
							if (!w.closed)						/* if not closed then close it */
								w.close();						/* close */
						} catch(e){}
					}
				}
				this.earlyPopout = this.popoutWindow = null;	/* clean up the pointers */
			}
		}
	};

	ChatMgr.prototype.reset = function(){
	};
	ChatMgr.prototype.sendMsg = function(_msgData,_src){
		ROM.send(Inq.urls.sendToAgentURL, {chatID:_msgData.chatID,msg:escape(_msgData.msg)});
	};
	/*<%--
	 * API: Asks the flash movie to close the connection and request a soft kill.
	 *      This results with the agent interface being notified of the close and
	 *      the thank-you page being shown.
	 * @return void
	 * @see closeChat
	 *--%>*/
	ChatMgr.prototype.closeConnection = function(){
		// TODO:
	};
	ChatMgr.prototype.toString = function(){
		return "ChatMgr: "+MixIns.JSON.stringify(this);
	};
	ChatMgr.prototype._addListener = function(_l,_lArr){
		if(!_l.id)
			_l.id = Math.random();
		_lArr.push(_l);
	};
	ChatMgr.prototype.hasAlreadyChatted = function(chatData){
		if(!this.lastChat) return false;
		var lastChatTimeMS = new Date(this.lastChat.time).getTime();

		var nowMS = (new Date()).getTime();
		var reChatTimeMS = lastChatTimeMS + Inq.rechatInterval*(24*60*60*1000);
		return (reChatTimeMS>=nowMS);
	};
	ChatMgr.prototype.clearAllChatListeners = function(){ this._listeners=[]; };

	/**
	 * TODO: unit test
	 */
	ChatMgr.prototype.assignAgent = function(aid, noSave, cobrowseEnabled, eventData, buID){
		log("Agent Assigned: ChatMgr.assignAgent("+aid+")");
		try{
			this.chat.setAgentID(aid, buID);
			if(!noSave){
				this.save();
			}
                /* We fire AgentAssigned in both windows but behaviour in opener and persistent windows is different
                * See rules 621 and 624 in ProgramRules, for c2call and c2c to persistent chat we handle onAgentAssigned
                * event to fire "assisted" event in rule 624. And in opener window these chat types are excluded for
                * "assisted" firing  in rule 621.
 	            */
			this.fireAgentAssigned(aid, cobrowseEnabled, eventData);
			if(this.isPersistentWindow() && Inq.isSameOrigin()) {
                var delayedCommand = 'inqFrame.Inq.CHM.assignAgent("' + aid + '", true,' + cobrowseEnabled + ','
                    + eventData + ',' + buID + ')';
				win.opener.inqFrame.setTimeout(delayedCommand, 50);
			}
		}catch(er){
			log("FAILED ATTEMPT TO SET AGENT ID FROM FLASH: "+er);
		}
	};

	ChatMgr.prototype.isV3Continue = function(){
		var ciData = this.getChatInterfaceData();
        return ciData ? ciData.c == 1 : false;
	};

	/** isV3Active - returns whether-or-not V3 chat is active on another page
	  *		so, if we go from page to page, we want it to be "inactive" when the page closes
	  *		we only want to know if there is a "visible" chat somewhere else,
	  *		NOT if we have an active chat session.
	  * 
	  * @return true if active, false if not
	  * @see  this.testForContinueChatting
	  */
	ChatMgr.prototype.isV3Active = function(){
		if (CM.xd){
			try {
				var activeFlag = CM.cookies["inqCA"];		/* Get the active flag (called "inqCA") */
				var activeCount = 0, e = null ;		
				if (activeFlag==null)						/* if it does not exist, then return false */
					return false ;							/* It does NOT exist */
				if (isNaN(activeCount = parseInt(activeFlag))){	/* Get the numeric value of the flag */
					return false;
				}
			
				if (activeCount <= 0) return false;			/* If the value is less than 1, return false */
					return true;							/* If the count is greater than 1, return true */
			} catch (e) {
				log("Error detecting isV3Active:" + e);				
				return false ;
			}
		} else {
			var ciData = this.getChatInterfaceData();
			if( !!ciData )
				try{ return (ciData.a==true);}catch(err){}
			return false;
		}
	};

	ChatMgr.prototype.isChatInProgress = function() {
        if (this.isV3Active())
            return true;
		if (this.isPersistentChat()) {
			if (this.isPersistentChatInProgress()) {
				return true;
			}
			else {
				this.resetStateAfterPersistentChat();
				return false;
			}
		}
		else {
			return this.isV3Continue() || this.isInlineChatInProgress();
		}
	};
	ChatMgr.prototype.isInlineChatInProgress = function(){
		return (!!this.chat && this.chat.isVisible());
	};

	ChatMgr.prototype.isThankYouEnabled = function(){
		return this.thankYouEnabled;
	};

	ChatMgr.prototype.getChatData = function(){
		return !!this.chat ? this.chat : null;
	};

	ChatMgr.prototype.onChatLaunched = function(evt){
		//If only Session Cookies are allowed for IE browser, writing the information to the TagServer Logs.
		// Both in XD and Non-XD mode.
		if (!CM.isPersistentCookiesAllowed() && isIE()) {
			var sesOnlyCookieMsg = "Only Session Cookies are allowed for this chatID. "+this.getChatID();
			if (!JSLoggingDisabled) {
				log(""+sesOnlyCookieMsg);
				ROM.post(urls.loggingURL, {level:"info", line: sesOnlyCookieMsg});
			}
		}
	};

	ChatMgr.prototype._fireChatEvt = function(evt){
		this._fireEvt(
			function(l,evt){if(l.onChatEvent) l.onChatEvent(evt);},
			evt
		);
	};

	ChatMgr.prototype.fireAgentMsgEvent = function() {
		if (isNullOrUndefined(this.chat)) { return; }
		this.chat.bumpAgtMsgCount();
		var event = {
			customerID: Inq.getCustID(),
			chatID: this.chat.getChatID(),
			custMsgCnt:this.chat.getCustMsgCnt(),
			agtMsgCnt:this.chat.getAgentMsgCnt()
		};
		this._fireEvt(
				function(l, event){
					try {
						if(typeof l.onAgentMsg=="function") l.onAgentMsg(event);
						if(typeof l.onChatEvent=="function") l.onChatEvent(event);
					} catch(e) {
						log("Error firing event onAgentMsg on " + l.toString() + ": \n" + e);
					}
				},
				event
			);
		if(!this.isPersistentWindow() || !isIE()) // This is to fix IE8 quirk in XD Mode
			this.chat.save();
	};

	ChatMgr.prototype.fireCustomerMsgEvent = function(evt) {
		if (isNullOrUndefined(this.chat)) { return; }
		this.chat.bumpCustMsgCount();
		var event = MixIns.mixAbsorber({
			customerID: Inq.getCustID(),
			chatID: this.chat.id,
			custMsgCnt:this.chat.getCustMsgCnt(),
			agtMsgCnt:this.chat.getAgentMsgCnt(),
			textLine: evt.textLine.substring(0, 50)
		});
		this._fireEvt(
				function(l, event){
					try {
						if(typeof l.onCustomerMsg=="function") l.onCustomerMsg(event);
						if(typeof l.onChatEvent=="function") l.onChatEvent(event);
					} catch(e) {
						log("Error firing event onCustomerMsg on " + l.toString() + ": \n" + e);
					}
				},
				event
			);
		if(!this.isPersistentWindow() || !isIE()) // This is to fix IE8 quirk in XD Mode
			this.chat.save();
	};

	/**
	 * ChatMgr fires this event when a chat has been requested. Chat requests
	 * typically originate from business rule actions.
	 * @param evtData contains the following data:
	 * 		siteID,
			pageID,
			chatSpec,
			chatType,
			rule
	 */
	ChatMgr.prototype.fireChatRequested = function(src, evtData) {
		var evt = MixIns.mixAbsorber({});
		evt.absorb(evtData);
		evt.id = this.evtIdx++;
		evt.evtType = this.EVTS.REQUESTED;
		evt.timestamp = new Date();
		evt.src = src;
		this._fireEvt(
			function(l, evt) {
				if (typeof l.onChatRequested == "function") l.onChatRequested(evt);
			},
			evt
		);
	};

	/**
	 * Invoked when chat is launched...
	 *
	 */
	ChatMgr.prototype.fireChatLaunched = function(chatData){
		if (chatData==null) chatData = this.chat.getChatData() ;
		var evt = MixIns.mixAbsorber({id:this.evtIdx++, evtType:this.EVTS.LAUNCHED, src:this, chatID:chatData.id});
		evt.absorb(chatData).absorb({"customerID": Inq.getCustID(), rule:this.rule});
		if (this.chat) evt.inHOP = this.chat.inHOP;
		var custEvt = {customerID: Inq.getCustID(), chatID: chatData.id, evtType:this.EVTS.LAUNCHED, chatType: this.getChatType()};
		this._fireEvt(
			function(l, evt){
				var event = isNullOrUndefined(l.custApi) ? evt : custEvt;
				try {
					if(typeof l.onChatLaunched=="function") l.onChatLaunched(event);
					if(typeof l.onChatEvent=="function") l.onChatEvent(event);
				} catch(e) {
					log("Error firing event onChatLaunched on " + l.toString() + ": \n" + e);
				}
			},
			evt
		);

		if (window.parent.name==ChatMgr.persistentTarget) {
			var o = getOpener();
			if (o || Inq.isSameOrigin()) {
				o.setTimeout('Inq.CHM.fireChatLaunched(null)',0);
			}
		}
	};
	ChatMgr.prototype.fireChatClosed = function(chatData){
	try {
		if (chatData==null) chatData = this.chat.getChatData();
		this.hasEngaged=false;
        if (chatData.buID != -1) {
            this.lastChat.businessUnitID = chatData.buID;
        }
		var evt = MixIns.mixAbsorber({id:this.evtIdx++, chatID: chatData.id, evtType:this.EVTS.CLOSED, timestamp:new Date(), rule:this.rule, src: this});
		evt.absorb(chatData).absorb({"customerID": Inq.getCustID(), "agentID":this.getAgentID()});
		var custEvt = {customerID: Inq.getCustID(), chatID: chatData.id, agentID: this.getAgentID()};
			this._fireEvt(                        /* NOTICE: This cauased a fault due to id not being defined */
			function(l, evt){
				var event = isNullOrUndefined(l.custApi) ? evt : custEvt;
				try {
					if(typeof l.onChatClosed=="function") l.onChatClosed(event);
					if(typeof l.onChatEvent=="function") l.onChatEvent(event);
				} catch(e) {
					log("Error firing event onChatClosed on " + l.toString() + ": \n" + e);
				}
			},
				evt);
		} catch(e){
		ROM.post(urls.loggingURL, {level:"info", line: ("Failure to fireChatClosed: "+catchFormatter(e))});
		}
	};
	ChatMgr.prototype.fireChatEngaged = function(_src){
		if(this.hasEngaged){return;}
		this.hasEngaged=true;
		var evt = MixIns.mixAbsorber({
				evtType:this.EVTS.ENGAGED,
				timestamp:new Date(),
				src:_src,
				chat: this.getChatData()
		});
		var chatData = this.getChatData();
		evt.absorb(chatData).absorb({"chatID":chatData.id, "chatType":this.getChatType(), "customerID": Inq.getCustID(), "agentID":this.getAgentID(), chatID:this.getChatID()});
		this._fireEvt(
			function(l, evt){
				if(typeof l.onChatEngagedEvent=="function") l.onChatEngagedEvent(evt);
				if(typeof l.onChatEvent=="function") l.onChatEvent(evt);
			},
			evt
		);
	};

	ChatMgr.prototype.firePersistentChatClosed = function(_src){
		this.fireChatClosed(undefined,_src);
	};

	ChatMgr.prototype.firePersistentChatLanding = function(){
		this._firePersistentLandingEvt(this.getChatData());
	};

	ChatMgr.prototype.firePersistentPush = function(){
		this._fireChatEvt({id:++this.evtIdx, chatType:this.chat.getChatType(), evtType:this.EVTS.PERSISTENT_PUSH, chat:this.getChatData(), timestamp:new Date()});
	};

	ChatMgr.prototype.firePendingEvents = function(){
		if(this.isPersistentChat() || this.isV3Continue()){
			this.firePersistentChatLanding();
		}
	};
	ChatMgr.prototype._firePersistentPushEvt = function(evt){
        var chatData = null;
        var inh = null;
        if (this.chat){
            inh = this.chat.inHOP;
            chatData = this.chat.getChatData() ;
        }
		evt = MixIns.mixAbsorber({id:this.evtIdx++, evtType:this.EVTS.PERSISTENT_PUSH, src:this, chatID:(chatData ? chatData.id : null), inHOP: inh});
        evt.absorb(chatData).absorb({"customerID": Inq.getCustID(), rule:this.rule});

		this._fireEvt(function(l, _evt){if(l.onPersistentPush) l.onPersistentPush(_evt);}, evt);
	};
	ChatMgr.prototype._firePersistentLandingEvt = function(evt){
		this._fireEvt(function(l, _evt){if(l.onPersistentChatLanding) l.onPersistentChatLanding(_evt);}, evt);
	};

	/**
	 * @param _agtID text agentID
	 * @param _cobrowseEnabled boolean cobrowseEnabled.
	 * @param eventData JSON (string or object) with agent's first, last name, agent alias, requested attribute.
	 */
	ChatMgr.prototype.fireAgentAssigned = function(_agtID, _cobrowseEnabled, eventData){
		this.evtIdx++;
		var evt = MixIns.mixAbsorber({id:this.evtIdx, agentID:_agtID, cobrowseEnabled:!!_cobrowseEnabled, ruleID:this.chat.getRule().getID(), chatID:this.getChatID(), timestamp:new Date()});
		if (typeof(eventData) == "object") {
			evt.absorb(eventData);
		} else if (typeof(eventData) == "string") {
			evt.absorb(MixIns.JSON.parse(eventData));
		}
		this._fireEvt(
				function(l,evt){
					if(l && typeof l.onAgentAssigned=="function"){
						l.onAgentAssigned(evt);
					}
				},
				evt
		);
	};

	/**
	 * Returns true if specified chat type is supported, false otherwise.
	 * @param chatType service type to check support for. See valid values in CHAT_TYPES.
	 * @return true if specified chat type is supported, false otherwise.
	 */
	ChatMgr.prototype.isServiceSupported = function(chatType) {
		return !!this.CHAT_TYPES[chatType];
	};

	/**
	 * Returns true if specified chat type represents a call service.
	 * @param chatType service type to check.
	 * @return true for call types.
	 */
	ChatMgr.prototype.isCallServiceType = function(chatType) {
		return (this.CHAT_TYPES.C2CALL == chatType || this.CHAT_TYPES.POPUP_CALL == chatType);
	};

	/**
	 * Returns true if specified chat type represents a call service.
	 * @param chatType service type to check.
	 * @return "call" for call chat (click2call and proactive call), "chat" for normal chats. If there is no chat returns "null"
	 */
	ChatMgr.prototype.getConversionType = function() {
        if (!!this.chat) {
            return this.isCallServiceType(this.getChatType()) ? "call" : "chat";
        } else {
            return null;
        }
	};

	/**
	 * Method checks and returns "in progress" status for specified service type.
	 * @param chatType see CHAT_TYPES
	 * @return true if service of specified type is in progress
	 * @throws error "ServiceTypeNotRecognized" if provided service type is not recognized.
	 */
	ChatMgr.prototype.isServiceInProgress = function(chatType) {
		var inProgress = false;
		if(!!this.chat){
			var thisChatType = this.chat.getChatType();
		if (chatType == "ANY") {
			return !isNullOrUndefined(thisChatType);
		}
		if (!this.isServiceSupported(chatType)) {
			throw "ServiceTypeNotRecognized - not supported chat type provided: '" + chatType + "'";
		}

		if(!isNullOrUndefined(chatType)) {
			if(this.isPersistentWindow() && chatType==this.CHAT_TYPES.PERSISTENT){
				inProgress = true;
			}
			else{
				inProgress = (chatType == thisChatType);
			}
		}
		}
		return inProgress;
	};

	/**
	 * Registers flash var functions in this manager.
	 * Flash vars are not sent to controller among other parameters when chat launch is requested.
	 * On callback from server flash vars are appended to other parameters and passed on to Haxe code through
	 * FlashPeer.js
	 * @param fcn function that returns flash vars
	 */
	ChatMgr.prototype.registerFlashvarFcn = function(fcn) {
		this._flashvarFcns.push(fcn);
	};

	ChatMgr.prototype.getCobrowseBannerText = function(){
		return !!this.chat ? this.chat.getCobrowseBannerText() : "";
	};

	ChatMgr.prototype.endCobrowseSessionFromBanner = function(){
		try{
			var parentRef = window.parent;

			if( ! this.isChatInProgress() ){
				parentRef = this.getPersistentWindow();
			}
			parentRef.inqFrame.Application.application.customerEndsCobrowse();
		}catch( e ){
			log("We have a cobrowse error"+e);
		}
	};

	/**
	 * Builds and returns flash vars object from all flash vars functions registered in this manager.
	 * @return flash vars object
	 */
	ChatMgr.prototype.getFlashVarData = function() {
		var retval = null;
		if(this._flashvarFcns.length > 0){
			retval = MixIns.mixAbsorber({});
			for(var idx = 0; idx < this._flashvarFcns.length; idx++){
				retval.absorb(this._flashvarFcns[idx]());
			}
		}
		return retval;
	}

	ChatMgr.prototype.EVTS = {LAUNCHED:"LAUNCHED",PERSISTENT_PUSH:"PERSISTENT_PUSH",CLOSED:"CLOSED",REQUESTED:"REQUESTED",SHOWN:"SHOWN", ENGAGED:"ENGAGED"};

	/**
	 * Manager for C2C and C2Call
	 * @class Manager for C2C and C2Call
	 * @constructor
	 * @param data
	 * @borrows Absorber#absorb as #absorb
	 * @borrows FrameworkModule#init as #init
	 * @borrows FrameworkModule#start as #start
	 * @borrows FrameworkModule#reset as #reset
	 * @borrows Persistable#load as #load
	 * @borrows Persistable#save as #save
	 * @borrows Persistable#getPersistentID as #getPersistentID
	 * @borrows Persistable#onDataReady as #onDataReady
	 * @see Absorber
	 * @see Persistable
	 * @see FrameworkModule
	 */
	function C2CMgr(id, data){
		this._observable();
		this._frameworkModule(id);
		this.absorb(data);
		this._c2cList = [];
		this.stateVar = null;
		this.sessionVar = null;
		this.requestInProgress = false;
	}
	
	MixIns.prepare(C2CMgr).mixIn(MixIns.Absorber).mixIn(MixIns.FrameworkModule).mixIn(MixIns.Persistable).mixIn(MixIns.Observable);
	
	/**
	 * obtains a unique id amongst all Persistable types. This instance returns the FrameworkModule id.
	 */
	C2CMgr.prototype.getPersistentID = function(){ return this.getID(); };
	/**
	 * initializes the mgr and readies it's internal state for start. Module
	 * should be ready to start once initialized.
	 */
	C2CMgr.prototype.init = C2CMgr.prototype.start = function(){
	};

	/**
	 * Reset all C2C each managed by C2CMgr).
	 */
	C2CMgr.prototype.reset = function () {
		for (var i = 0; i < this._c2cList.length; i++) {
			if (typeof this._c2cList[i] !== "undefined") {
				this._c2cList[i].reset();
			}
		}
	};

	C2CMgr.prototype.load = function(){
		function fixBlockedServicesData() {
			var blocked = {};
			var sessionServices = sessionData["blocked"];
			if(!!sessionServices) {
				for(var service in sessionServices) {
					blocked[service] = sessionServices[service];
				}
			}
			var stateServices = stateData["blocked"];
			if(!!stateServices) {
				for(var service in stateServices) {
					blocked[service] = stateServices[service];
				}
			}
			return blocked;
		}
		
		this.stateVar = new Variable(this.getID(), {}, resources["state"]);
		this.sessionVar = new Variable(this.getID(), {}, resources["session"]);
		var stateData = this.stateVar.getValue();
		this.absorb(stateData);
		var sessionData = this.sessionVar.getValue();
		this.absorb(sessionData);
        // fix blocked services
        if (!!this.blocked) {
        	this.blocked = fixBlockedServicesData();
        }
	};
	
	C2CMgr.prototype.save = function(){
		function prepareBlockedServicesData(services) {
			for(var service in services) {
				if(services[service] == 0) {
					if(!sessionData.blocked) {
						sessionData.blocked = {};
					}
					sessionData.blocked[service]=services[service];
				} else if(services[service] == -2){
					// no persistence... page level blocking
				} else {
					if(!stateData.blocked) {
						stateData.blocked={};
					}
					stateData.blocked[service] = services[service];
				}
			}
		}
		
		var stateData = {};
		var sessionData = {};
		
		if(!!this.blocked) {
			prepareBlockedServicesData(this.blocked);
		}
		this.stateVar.setValue(stateData);
		this.sessionVar.setValue(sessionData);
	};
	
	C2CMgr.prototype.onDataReady = function(){ 
		this.load();
	};
	
	C2CMgr.prototype.blockService = function(serviceType, period) {
		if(serviceType != ChatMgr.CHM.CHAT_TYPES.C2C && 
				serviceType != ChatMgr.CHM.CHAT_TYPES.C2CALL) {return;}
		if (isNullOrUndefined(this.blocked)) {
			this.blocked = {};
		}
		// block the service if it hasn't already been blocked or block duration has been expired
		if (isNullOrUndefined(this.blocked[serviceType]) || (!isNullOrUndefined(this.blocked[serviceType]) && this.blocked[serviceType] < (new Date).getTime())) {
			if (period > 0) {
				var now = new Date();
				period += now.getTime();
			}
			this.blocked[serviceType] = period;
			this.save();
		}
	};
	
	C2CMgr.prototype.unblockService = function(serviceType) {
		if(serviceType != ChatMgr.CHM.CHAT_TYPES.C2C && 
				serviceType != ChatMgr.CHM.CHAT_TYPES.C2CALL) {return;}
		if (!isNullOrUndefined(this.blocked) && !isNullOrUndefined(this.blocked[serviceType])) {
			delete this.blocked[serviceType];
		}
		this.save();
	};
	
	C2CMgr.prototype.isBlocked = function(serviceType) {
		var blockedValue = false;
		if (!isNullOrUndefined(this.blocked) && !isNullOrUndefined(this.blocked[serviceType])) {
			var now = new Date();
            var toDate = this.blocked[serviceType];
            if (toDate <= 0) { // 0 - session, -1 forever
                blockedValue = true;
            }
            else {
                blockedValue = toDate >= now.getTime();
            }
		}
		return blockedValue;
	};

    C2CMgr.prototype.isAnyBlocked = function() {
        if (isNullOrUndefined(this.blocked)) {
            return false;
        }
        for (var prop in this.blocked) {
            return true;
        }
        return false;
    };


	C2CMgr.prototype.requestChat = function(idx, callThisNumber){
		var c2c = this.getC2C(idx);
        if (!c2c) {
            log("can't find c2c " +  idx);
            return;
        }

		if (c2c.c2p || (callThisNumber!=null&&(!c2c.isClicked()))) {
			CHM.earlyPopoutChat(c2c.c2cSpec.chatSpec.chatTheme) ;
		}
		if(!c2c.isClicked()){	
			this.fireC2CClicked(c2c);
            CHM.request(c2c.getRule(), c2c.getChatType(), c2c.getXmlChatSpec(), ((!!callThisNumber)?callThisNumber:null), c2c.c2p);
			c2c.setClicked(true);
		}
		else{
			log("Ignored C2C double click");
		}
	};

	C2CMgr.prototype.getC2C = function(idx) {
		return this._c2cList[idx];
	};

	C2CMgr.prototype.request = function(rule, chatType, dataFcn, clickToPersistent) {
		if(this.isBlocked(chatType)) { return; }
		var c2c = new C2C(this, rule, chatType, dataFcn, clickToPersistent ? clickToPersistent : isC2cPersistent());
		if (c2c.getDiv()) {
			this._c2cList[c2c.getIdx()] = c2c;
			if (!this.requestInProgress) { // if we are not in progress, start request
				this.requestInProgress = true;
				c2c.request();
			}
			log('C2CMgr request: {ruleName: \"' + rule.getName() + '\"}');
		} else {
			C2C.IDX--;
			if (c2c.isDivOccupied()) {
				var exposureData = {
					siteID: Inq.getSiteID(),
					customerID: Inq.getCustID(),
					incrementalityID: getIncAssignmentID(),
					sessionID: getSessionID(),
					brID: rule.id,
					group: PM.getVar("incGroup").getValue(),
					businessUnitID: rule.getBusinessUnitID(),
					result: "existing_offer",
					rule: rule
				};
				BRM.fireExposureQualifiedEvent(exposureData);
				log("C2C div already occupied: " + rule.getName());
			} else {
				log("C2C div not found for " + rule.getName());
			}
		}
	};

	C2CMgr.prototype.nextRequest = function(completedC2C){
		log("C2C request complete for "+completedC2C.getRule().getName());
		this.requestInProgress = false;
		var nextIdx = completedC2C.getIdx()+1; // get the next one
		var nextC2C = this._c2cList[nextIdx];
		if(!!nextC2C){ // if there is a next one, then request it
			log("Issuing next C2C request for "+nextC2C.getRule().getName());
			this.requestInProgress = true; // request back in progress
			nextC2C.request();
		}
	};
	
    C2CMgr.prototype.showCallButton = function(indx, source, left, top, number, show, giveFocus, title){
        var c2c = this.getC2C(indx) ;
        if (c2c!=null)
            c2c.showCallButton(source, left, top, number, show, giveFocus, title) ;
    };
	
	/**
	 * Determine whether a potential listener should be added to this object's list of
	 * event listeners. To be a C2CMgr listener, a listener should implement at least
	 * one of the following methods:
	 * 	onC2CDisplayed
	 * 	onC2CClicked
	 *
	 * @param l listener object to check
	 */
	C2CMgr.prototype.isListener = function(l){
		return !!(l && (l.onC2CDisplayed || l.onC2CClicked));
	};

	C2CMgr.prototype.onChatClosed = function() {
		this.clicked = false;
	};
	
	C2CMgr.prototype.fireC2CDisplayed = function(data) {
	   	var evt = {c2c:data.c2c, rule: data.rule, serviceType: CHM.CHAT_TYPES.C2C, customerID: Inq.getCustID(), data: data.data};
    	function f(l, evt) {
    		try {
    			if (!!l.onC2CDisplayed) {
    				l.onC2CDisplayed(evt);
    			}
    		} catch(e) {
    			log("Error firing event C2CDisplayed on "+ l.toString()+":"+e);
    		}
    	}
    	this._fireEvt(f, evt);
	};
	
	C2CMgr.prototype.fireC2CClicked = function(c2c) {
	   	var evt = {c2c:c2c, rule: c2c.getRule(), serviceType: CHM.CHAT_TYPES.C2C, customerID: Inq.getCustID()};
    	function f(l, evt) {
    		try {
    			if (!!l.onC2CClicked) {
    				l.onC2CClicked(evt);
    			}
    		} catch(e) {
    			log("Error firing event C2CClicked on "+ l.toString()+":"+e);
    		}
    	}
    	this._fireEvt(f, evt);
	};

	C2CMgr.prototype.IMAGETYPES = {disabled: "d", busy: "b", afterHours: "ah", ready: "r"};

	/**
	 * A Chat object represents an active, ongoing chat. It contains a fully formed chatspec with
	 * its appropriate theme.
	 * @param chatData -- contains the following items
	 * 	id
	 * 	rule
	 * 	chatType
	 * 	chatSpec
	 * 	chatMgr
	 *  persistentChat
	 * @borrows Absorber#absorb as #absorb
	 */
	function Chat(chatData){
		this.sesVar = new Variable("chat", {}, resources["session"]);
		this._className="Chat";
		this._stage = window.parent.document.getElementById("inqChatStage") ;
		this.intervalId = 0;
		this._isVisible = false;
		this.dragHandleID = "inqTitleBar";
		this.cd = MixIns.clonize(chatData);
		this.rule = null;
		this.BOXID_CHATACTIVE = "CHATACTIVE"; /* We want the IFRAME to have the id "CHATACTIVE" */
	}
	MixIns.prepare(Chat).mixIn(MixIns.Absorber);

	/**
	 * sets survey data into the chat data persistence.
	 * @param sdat Object the data for the survey.
         */
	Chat.prototype.setSurvey = function(sdat){
		if(!!sdat && sdat.id>0){
			this.cd.sid = sdat.id;
			this.save();
		}else{
			log("chat.setSurvey(): Survey data set failed. sdat undefined or invalid sid"+sdat);
		}
	};

	/**
	 * Method that validates instantiation data and initializes internal objects using the that data.
	 * If not data was provided, an attempt to grab data from persistence is made. If no data is found
	 * in persistence, then null value is returned.
	 * @returns fully initialized chat instance if chat data is found and validates. null if neither chat data
	 * nor persistence data is obtained.
	 * @throws Error if validation of data fails.
	 * mpk: Unit tested
	 */
	Chat.prototype.load = function(){
		var cd = this.cd;
		if(isNullOrUndefined(cd)){
			cd = MixIns.clonize(this.sesVar.getValue());
			if(isNullOrUndefined(cd)){
				return null;
        }
	}
		if(!isNullOrUndefined(cd)){
			cd.aMsgCnt = (isNullOrUndefined(cd.aMsgCnt))?0:cd.aMsgCnt;
			cd.cMsgCnt = (isNullOrUndefined(cd.cMsgCnt))?0:cd.cMsgCnt;
		}
		Chat.validate(cd); // throws here if invalid
		this.cd = cd;
		this.chatSpec = MM.mergeChatSpec(cd.xmlSpec); // reconstitute the chatSpec object
		this.rule = BRM.getRuleById(cd.ruleID); //look up rule object
		return this;
	};

	Chat.prototype.getCiData = function(){
		return !!this.cd?this.cd.ci:{};
	};

	Chat.prototype.setCiData = function(dat, doNotSave){
		if(this.cd){
			this.cd.ci = dat;
			if(!doNotSave)
				this.save();
		}
	};
	
	/**
	 * Unified factory method for Chat class. Creates and initializes a new chat instance.
	 * @param chatData Object Optional param that contains all the initializing data for the chat.
	 * If null or undefined, an "unprimed" chat instance will be returned that can be loaded from persistence via the load method.
	 * @return Chat A primed but uninitialized chat instance representing an ongoing or new chat.
	 * @see load instance method
	 */
	Chat.unmarshal = function(chatData){
		return new Chat(chatData);
	};
	Chat.prototype.bumpAgtMsgCount=function(){
		if(!!this.cd)
			this.cd.aMsgCnt += 1;
	};
	Chat.prototype.bumpCustMsgCount=function(){
		if(!!this.cd)
			this.cd.cMsgCnt += 1;
	};
	Chat.prototype.getCustMsgCnt=function(){
		if(!!this.cd)
			return this.cd.cMsgCnt;
		return 0;
	};
	/**
	 * Gets the chat data as a clone. Clone used because external manipulation of the
	 * chat's actual internal data can kill the chat.
	 */
	Chat.prototype.getChatData=function(){
		try{
			// this has the potential to throw "Error: attempt to run compile-and-go script on a cleared scope"
			// See MAINT27-250 for details.
			// TODO: find out why this throws when closing persistent window
			return !!this.cd?this.cd.clone():null;
		}catch(err){
			MixIns.clonize(this.cd); // reattach the clone() method with local scope.
			return this.cd.clone(); // try again
		}
	};
	Chat.prototype.getAgentMsgCnt=function(){
		if(!!this.cd)
			return this.cd.aMsgCnt;
		return 0;
	};
	Chat.prototype.save=function(){
		this.sesVar.setValue(this.cd);
	};
	Chat.prototype.getCustID = function(){
		return Inq.custID;
	};
	
	Chat.prototype.getChatID = function(){
		if(!!this.cd)
			return this.cd.id;
		return null;
	};
	
	Chat.prototype.getChatType = function() { return this.cd.chatType ;};

    /**
     *  Returns c2c to persitent flag, it can be overridden in <show-c2c*> tags
     */
    Chat.prototype.isC2cToPersistent = function() {return this.cd.c2cToPersistent;};
	
	/**
	 *  Return language specified in the rule or default language
	 */
	Chat.prototype.getLanguage = function() {
		var language;
		try {
			language = this.getRule().getLanguage();
		} catch (e) {
			log("Error while getting language from Rule: \n" + e + "\n");
		}

		/* Double checking since Business rule can have language as an empty string */
		if (!language) {
			language = getDefaultLanguage();
		}
		
		return language;
	};
	
	/**
     *  Returns c2c to persitent flag, it can be overridden in <show-c2c*> tags
     */
    Chat.prototype.isC2cToPersistent = function() {return this.cd.c2cToPersistent;};
	
	/**
	 *  Return language specified in the rule or default language
	 */
	Chat.prototype.getLanguage = function() {
		var language;
		try {
			language = this.getRule().getLanguage();
		} catch (e) {
			log("Error while getting language from Rule: \n" + e + "\n");
		}

		/* Double checking since Business rule can have language as an empty string */
		if (!language) {
			language = getDefaultLanguage();
		}
		
		return language;
	};
	
	/**
	 * @param data contains a JSON string that can be parse to create the following:
	 * 	chatID
	 * 	siteID
	 * 	pmor
	 * 	chatType
	 * 	chatSpec
	 *  custID
	 *  rule
	 */
	Chat.prototype.onLocalCallback = function(){
		try {
			this.show();
		} catch(e) {
			log("Error in above code: \n" + e + "\n" + data);
		}
	};

	Chat.prototype.getRule = function() {
		return this.rule;
	};
	
	/**
	 * getRuleId getter for rule id,
	 * saved in the chat context,
	 * if not there, then get it from the rule
	 * The rule can get stale.
	 * On IE in pop-out mode (persistent) the rule can become unusable when:
	 * 1) the client window (parent.opener) is closed
	 * At creation of the persistent window we know that we have a client window
	 * So we get the ruleId and ruleName at that time
	 * @param none
	 * @return the textual rule id
	 * @see constructor for chat (function Chat)
	 * @see getRuleName
	 * @see http://dev.inq.com/jira/browse/MAINT22-213
	 */
	Chat.prototype.getRuleId = function() {
		var ruleID = this.rule.getID();
		return !!ruleID?ruleID:"";
	};

	/**
	 * getRuleName getter for rule id,
	 * saved in the chat context,
	 * if not there, then get it from the rule
	 * The rule can get stale.
	 * On IE in pop-out mode (persistent) the rule can become unusable when:
	 * 1) the client window (parent.opener) is closed
	 * At creation of the persistent window we know that we have a client window
	 * So we get the ruleId and ruleName at that time
	 * @param none
	 * @return the textual rule name
	 * @see constructor for chat (function Chat)
	 * @see getRuleId
	 * @see http://dev.inq.com/jira/browse/MAINT22-213
	 */
	Chat.prototype.getRuleName = function() {
		return this.rule.getName();
	};

	/** monitorChatActive - creates an IFRAME that sets the active flag on, when window is destroyed, the active flag is turned off
	  *		The non XD chat keeps a flag in the cookie for active chat
	  *		The XD chat can set the cookie flag but cannot unset it fast enough before a window closes.
	  *		So ... we have a new way of doing this in XD mode :)
	  *			we have an IFRAME set the cookie on, when we launch a chat
	  *			when the client frame closes, we set the cookie off via the "unload" event
	  *			when a chat closes, we destroy the IFRAME, an the "unload" event unsets the cookie value off
	  *		The cookie manager is used to perform "postRequestByName" to create the IFRAME
	  *			the id of the IFRAME is CHATACTIVE
	  *			the IFRAME's source is postToServer.htm and it performs the function "CHATACTIVE"
	  *				the CHATACTIVE:
	  *				1) increments a count in the cookie inqCA (for inq Chat Active)
	  *				2) Sets up to catch the event "unload"
	  *				3) Upon unload the cookie inqCA is decremented
	  * @param  none
	  * @return nothing
	  */
	Chat.prototype.monitorChatActive = function(){
		if (!(CM.xd)) return;									/* If we are not XD mode, then we don't have to monitor */
		this.closeChatMonitor();								/* Close chat monitor if already running */
							
		var request = "CHATACTIVE||CHATACTIVE||" + Inq.siteID;	/* The command is "CHATACTIVE", we give the site id, so it can be suffixed to the cookie name */
		CM.postRequestToIframeByName(request, this.BOXID_CHATACTIVE);			/* We tell the CookieManager to post the request to the IFRAME, get'r done */
	};
		
	/** closeChatMonitor - destroys the IFRAME that sets the active flag on,
	  *			when window is destroyed, the active flag is decremented via the "unload" event.
	  *			when the active flag is zero, it is considered "off"
	  *
	  * @param  none
	  * @return nothing
	  * @see  this.monitorChatActive
	  * @see  this.close
	  * @see  postToServer.htm command "CHATACTIVE"
	  */
	Chat.prototype.closeChatMonitor = function(){
		if (!(CM.xd)) return;									/* If we are not XD mode, then we don't have to monitor */
		var cmon = document.getElementById("CHATACTIVE");		/* get the IFRAME object by it's ID */
		if (cmon) {												/* If we have a chat active monitor, then destroy it */
			cmon.parentNode.removeChild(cmon); 					/* Remove the chat active monitor from the document */
		}
		var request = "CHATACTIVE||CHATDEACTIVATE||" + Inq.siteID;	/* The action is "CHATDEACTIVATE", clean up some flags */
		CM.postRequestToIframeByName(request, this.BOXID_CHATACTIVE);
	};

	Chat.prototype.show = function() {
		var type = this.getChatType();
		if (this.chatSpec!=null &&
			((type==CHM.CHAT_TYPES.C2C) || (type==CHM.CHAT_TYPES.PERSISTENT)) && this.isC2cToPersistent()) {

			/*
			 * By checking for getPersistentWindow only when we already have v3C2cPersistent
			 * set to true we save a pop up appearing and disappearing. Better user
			 */
			if( ! CHM.getPersistentWindow() ){
				CHM.popOutChat(true) ;
				return ;
			}
		}
		this.preloadChat();
		/* If we are XD mode, establish the ActiveChat monitor */
		this.monitorChatActive();							/* We test for XD mode in the method */
		this.setVisible(true);
		if( window["Application"] == null ||
			typeof window.Application.application == "undefined" ||
			window.Application.application.initialized == false ){
			window.launchWhenReady=true;
		}else{
			Application.main() ;
		}
	};
	
	Chat.prototype.close = function() {
		this.setVisible(false);
		this.closeChatMonitor();						/* If we are XD mode, have the Chat Active monitor decrement the active cookie */
		var app = window["Application"] ;
		if (app&&app.application&&app.application.close) {
			try {app.application.close();} catch (e){}
		}
		this.closed=true;
		this.sesVar.setValue(null);
		this.endCobrowseSession();
	};
	
	Chat.prototype.isClosed = function() {
		return !!(this.closed);
	};

	Chat.prototype.isVisible = function() {
		return this._isVisible;
	};
	
	Chat.prototype.setVisible = function(vis) {
		this._isVisible = vis ;
		// FIXME: This code is bad and should be removed.  The call to
		// FlashPeer.setVisible below does all the same stuff, but
		// does it nicely through the correct interfaces.  HOWEVER,
		// we're under the gun to get this revision out, and the unit
		// tests are complaining.  So I'm leaving this here to make
		// the unit tests happy, and I'll refactor the TESTS later and
		// remove this.
		var _corner = window.parent.document.getElementById("inqDivResizeCorner");
		var _title = window.parent.document.getElementById("inqTitleBar");
		var _stage = window.parent.document.getElementById("inqChatStage") ;
		_stage.style.display = (vis)?"":"none" ;
		if(_corner)_corner.style.display = (vis)?"":"none" ;
		if(_title)_title.style.display = (vis)?"":"none" ;

		// Here's all that's really necessary.  Leave this here after
		// refactoring.
		try {
			FP.setVisible(vis);
		}
		catch (e) {
            log("Error attempting to hide chat div: " + e);
		}
	};
	
	Chat.prototype.getDragHandle = function(){
		return this.dragHandleID;
	};

	Chat.prototype.setDragHandle = function(handleElementID){
		this.dragHandleID=handleElementID;
	};

	Chat.prototype.setResizable = function(){
		if(this._stage==null)
			this._stage = window.parent.document.getElementById("inqChatStage") ;
		var resizeHandleElem = window.parent.document.getElementById("inqDivResizeCorner");
		if(typeof Inq.Resize != "undefined" && resizeHandleElem) {
			Inq.Resize.__init(resizeHandleElem, this._stage);
		}
	};
	
	Chat.prototype.setDragable = function(){
		if(this._stage==null)
			this._stage = window.parent.document.getElementById("inqChatStage") ;
		var dragHandleElem = window.parent.document.getElementById("inqTitleBar");

		try {
			if(typeof Inq.Drag != "undefined" && dragHandleElem)
				Inq.Drag.__init(dragHandleElem, this._stage);
		} catch (e){}
	};

	Chat.prototype.transitionMessage = function(){
		var params = {agentID:CHM.getAgentID(), chatID:CHM.getChatID(), transitioning:"persistent"};
		Inq.ROM.send(Inq.urls.baseURL+"/tracking/persistentMsg.js", params);
	};

	Chat.prototype.popOutChat = function(transition, top, left, bottom, right){
		if (transition)
			this.transitionMessage();
		
		CHM.setPersistentChatSetting("true");
		
		var persistentFocus = true ;
		var winTest = null ;
		var sHeight = 300 ;
		var sWidth  = 400 ;
		var sLeft   = 40 ;
		var sTop  	= 20 ;
		var cdata	= this.chatSpec ;
		if (cdata && cdata.chatTheme){
			sHeight = cdata.chatTheme.ph;
			sWidth  = cdata.chatTheme.pw;
			sLeft   = cdata.chatTheme.px;
			sTop	= cdata.chatTheme.py;
		}

		var url, target ;

		url = Inq.v3framesrc ;
		target = "_inqPersistentChat";
		winTest = CHM.earlyPopout;
		/* Window of the soon-to-be pop-out chat*/
		if (winTest != null && winTest.closed==false) {
			CHM.earlyPopout = null ;
			winTest.location = url ;
		}
		else {
			CHM.earlyPopout = null ;
			var tools = "toolbar=no,location=no,menubar=no,status=no,scrollbars=no" +
						",top=" + sTop +
						",left=" + sLeft +
						",width=" + sWidth +
						",height=" + sHeight +
						",resizable=1" ;
			try {
				winTest = window.parent.top.open(url, target, tools);
				if( ! winTest ){
					CHM.sendMsg( { chatID:this.getChatID(), msg:MixIns.JSON.stringify( {PopupBlocker : "<b>Persistent Chat Push: FAILED</b>" } ) } );
				}
				if ("" != url){
					if (winTest == top)
						winTest = null;
				}
				else{
					var newdoc = null ;
					if (winTest) {
						try {newdoc = winTest["document"];} catch(e) {}
						if (newdoc==null)
							try {newdoc = winTest.document;} catch(e){}
				}
				if (newdoc) {
					var scriptz = document.getElementsByTagName("SC"+"RIPT");
					var scrp = null ;
					for (ix=0;ix < scriptz.length;ix++){
						if (scriptz[ix].src.indexOf("/inqChatLaunch")>=0) {
							scr = '<script type="text/javascript" src="'+scriptz[ix].src+'"/></script>';
							break ;
						}
					}
					if (scrp)
						newdoc.write(scrp);
		 			else
		 				newdoc.close();
					}
				}
				cdata.pC = null!=winTest ;
			} catch (e) {
				winTest = null;
			}
		}
		CHM.popoutWindow = winTest;
		if (winTest){
			if (winTest.focus && !CHM.isMobile()) {
			    try {
					 winTest.focus();
				}
				catch(e) {}
			}
			cdata.pC = true ;
			return true ;
		}
		else
			return false;
	};

	Chat.prototype.toString = function(){
		var val = 'Chat: ';
		for(var n in this){
			val += ""+n+"="+this[n]+",";
		}
		return val;
	}

	Chat.prototype.getFlashVars = function(){
		var sesVar = PM.getVar("sesID");
		var incVar = PM.getVar("incID");

        // Introduced by AUTOMATION-122 "Update the engagement.requested event to include the visitorAttributes field":
        // A sample value with two VAs where 1st one is multivalued would be:
        // 'Noteworthy+Content+Groups=Solutions,Advantage,Sales;Readiness+Indicator=Almost+ready'
        var visitorAttributes = VAM.getCopyAsArray().join(';');

		var flashvars = 'continued='+ (CHM.isV3Continue()?'1':'0')+
						'&sessionID=' + (sesVar?sesVar.getValue():123456) +
						'&incAssignmentID='+ (incVar?incVar.getValue():123456) +
						'&businessUnitID='+ this.getBusinessUnitID() +
						'&chatID=' + this.getChatID() +
						'&customerID=' + this.getCustID() +
						'&agentName=' + encodeURIComponent(this.getAgentName()) +
						'&scriptID=' + this.getScriptID() +
						'&agentExitLine=' + this.getAgentExitLine() +
						'&siteID=' + Inq.siteID +
						'&openerID=' + this.getOpenerID() +
						'&userName=' + this.getCustomerName() +
						'&agent'+
						'&newFramework=1'+
						'&title=foo'+
						'&chatTitle=' +  this.rule.name +
						'&crHost='+CHM.getChatRouterURL()+
						'&submitURL='+CHM.getChatRouterURL()+
						'&tagServerBaseURL='+ Inq.urls.vanityURL +
						'&commTypes=http'+
						'&brID=' + this.rule.id +
                        '&agentAttributes='+ this.getAgentAttributesAsString() +
                        '&ruleAttributes='+ this.getRuleAttributesAsString() +
						'&deviceType=' + getDeviceType() +
                        '&browserType=' + getClientBrowserType() +
                        '&browserVersion=' + getClientBrowserVersion() +
                        '&operatingSystemType=' + getOSType() +
                        '&visitorAttributes=' + visitorAttributes +
                        '&launchType=' + this.getChatType() +
                        '&language=' + this.getLanguage() +
						'&launchPage=' + LDM.getPageMarker();

        if (this.rule["phoneNumber"]!=null)
            flashvars += '&clickToPhone=' + this.rule.phoneNumber ;

		if (this.pC || CHM.isPersistentWindow() ) flashvars += "&PersistentFrame=1";

        var automatonId = this.getAutomatonId();
        if (!isNullOrUndefined(automatonId)) {
            flashvars += '&automatonId=' + automatonId;
        }

        var agentAutoOpenerId = this.getAgentAutoOpenerId();
        if (!isNullOrUndefined(agentAutoOpenerId)) {
            flashvars += '&agentAutoOpenerId=' + agentAutoOpenerId;
        }

		var flashvarFcnsData = decodeURIComponent(Inq.ROM.toParamString(CHM.getFlashVarData()));
		if (flashvarFcnsData && flashvarFcnsData.length > 0) {
			flashvars += "&" + flashvarFcnsData;
        }
		flashvars = this._fixFlashVars(flashvars);

		return flashvars ;
	};

	/**
	 * Proxy call to BusinessRule.prototype.getAgentAttributesAsString().
	 */
    Chat.prototype.getAgentAttributesAsString = function () {
        try {
            return this.getRule().getAgentAttributesAsString();
        }
        catch(e) {
            log("Error getAgentAttributes " + e);
        }
            return null;
    };

	/**
	 * Proxy call to BusinessRule.prototype.getRuleAttributesAsString().
	 */
	Chat.prototype.getRuleAttributesAsString = function () {
		try {
			return this.getRule().getRuleAttributesAsString();
		}
		catch(e) {
			log("Error getting rule attributes " + e);
		}
		return null;
	};

	Chat.prototype.getSkin = function(){
		/** change "swf" to "skin" and change 'zip' to skin
		 *  change media url/path to tag server url/path
		 */
        return Inq.urls.mediaSiteURL.split(Inq.urls.mediaBaseURL).join(Inq.urls.baseURL) + "/flash/"
            + this.chatSpec.chatTheme.fn.replace(/\.(mxml|zip)$/, "") + ".skin";
	};


	/**
	 * Preloads the chat haxe framework
	 */
	Chat.prototype.preloadChat = function(){
		var ix;
		if (window["Application"]!=null) return ;
		var scrpt =  document.createElement("SC"+"RIPT") ;
		scrpt.type = "text/javascript" ;
		scrpt.language = "javascript" ;
		scrpt.setAttribute("language", "javascript");
		scrpt.setAttribute("type", "text/javascript");
		scrpt.charset="utf-8";
		
		scrpt.src =  Inq.urls.mediaRootURL+"/flash/InqFramework";
	    scrpt.src += ".js";

		scrpt.src += "?codeVersion=" + ((v3Lander)?encodeURIComponent(v3Lander.codeVersion):"undefined");
		scrpt.id = "inqChatJs";

		window.document.getElementsByTagName("body")[0].appendChild(scrpt);
	};
	/**
	 * private _fixFlashVars,
	 * if clickstream data is missing in the flashvars, insert it
	 * if the useragent data is missing in the flashvars, insert it
	 */
	Chat.prototype._fixFlashVars = function(fv){
		if( undefined == fv )
			return "" ;
		if( fv.indexOf("&clickStream=")>=0 )
			return fv ;
		var extraFlashVars = "" ;
		var clickStreamData = null ;
		try{
			/*If this is a persistent window, get the click stream data from the opener*/
			var obj = (CHM.isPersistentWindow())?window.parent.opener.inqFrame.Inq.FlashPeer.getAgentData():FP.getAgentData();
		
			clickStreamData = unescape(Inq.ROM.toParamString(obj,true));
		} catch (e) {
			log(e);
		}
		if (clickStreamData!=null && clickStreamData!="")
			extraFlashVars += "&clickStream="+escape(clickStreamData) ;
		if (navigator.userAgent)
			extraFlashVars += "&userAgent="+escape(navigator.userAgent) ;
		return (fv+extraFlashVars) ;

	};
	
	Chat.prototype.isPersistent = function() {
		return this.pC;
	};
	
	Chat.prototype.getBusinessUnitID = function() {
		var businessUnitID;
		try {
			businessUnitID = this.getRule().getBusinessUnitID();
		} catch (e) {
			log("Error getting chat business unit id: \n" + e + "\n");
		}
        if (isNullOrUndefined(businessUnitID)) {
            businessUnitID = getDefaultBusinessUnitID();
        }
		return businessUnitID;
	};
	
	Chat.prototype.getAgentName = function() {
		var agentName = "";
		try {
			agentName = this.chatSpec.chatTheme.an;
		} catch (e) {}
		return agentName;
	};
	
	Chat.prototype.getAgentID = function() {
		return isNullOrUndefined(this.cd.aid)?"":this.cd.aid;
	};

	Chat.prototype.setAgentID = function(aid, buID){
		this.cd.aid = isNullOrUndefined(aid)?"":aid;
        this.cd.buID = buID;
	};

    Chat.prototype.getChatBusinessUnitID = function() {
        return isNullOrUndefined(this.cd.buID) ? -1 : this.cd.buID;
    };

	
    Chat.prototype.getChatBusinessUnitID = function() {
        return isNullOrUndefined(this.cd.buID) ? -1 : this.cd.buID;
    };

	
	Chat.prototype.getScriptID = function() {
		var id = 0;
		try {
			id = this.chatSpec.stId;
		} catch (e) { }
		return id;
	};
	
	Chat.prototype.getAgentExitLine = function() {
		var line = "";
		try {
			line = this.chatSpec.ael;
		} catch(e) {}
		return line;
	};
	
	Chat.prototype.getOpenerID = function() {
		var opener = 0;
		try {
			opener = this.chatSpec.oId;
		} catch(e) {}
		return opener;
	};

    Chat.prototype.getAgentAutoOpenerId = function() {
        return !!this.chatSpec && !!this.chatSpec.aaoId ? this.chatSpec.aaoId : null;
    };
	
	Chat.prototype.getCustomerName = function() {
		var name = "";
		try {
			name = this.chatSpec.chatTheme.cn;
		} catch(e) {}
		return name;
	};
	
	Chat.prototype.getChatSpec = function() {
		var spec = null;
		try {
			spec = this.chatSpec;
		} catch (e) {}
		return spec;
	};
	
    Chat.prototype.getAutomatonId = function() {
        try {
			if (!isNullOrUndefined(this.chatSpec.aId)) {
				return this.chatSpec.aId;
            }
        } catch(e) {}
        return null;
    };
	
	Chat.prototype.endCobrowseSession = function(){
		if (Inq["CBC"])	Inq.CBC.stop();
	};

	Chat.prototype.getCobrowseBannerText = function(){
		if (Inq["CBC"])
			return Inq.CBC.getCobrowseBannerText();
		return "";
	};

	Chat.validate = function(data){
		var inou = isNullOrUndefined;
		var cerr = "Chat.constructor Err: ";
		if(inou(data))
			throw (cerr+"chatData empty");
		if(!data.chatType)
			throw (cerr+"chat type missing");
		if(!data.xmlSpec)
			throw (cerr+"chat xml data missing");
		if(!data.ruleID)
			throw (cerr+"ruleID missing");
		if(!data.id)
			throw (cerr+"chatID missing");
		if(inou(data.pC))
			throw (cerr+"persistent chat boolean missing");
		if(inou(data.aMsgCnt) || data.aMsgCnt<0 || inou(data.cMsgCnt) || data.cMsgCnt<0){
			throw (cerr+"agt/cust msg cnt not properly initialized");
		}
		if(inou(data.ci)){
			throw (cerr+"ci data missing");
		}
//		TODO: see what the life cycle is like on the cI data structure.
//		if(isNullOrUndefined(data.cI))
//			throw cerr+"persistent v3 chat data missing";
	};


function FlashPeer(id, data){
	/*
	 * API: Closes the popup chat on behalf of the persistent chat
	 */
	function isV3C2CPersistent(){
		return !!v3C2cPersistent;
	}

	function closePopupChat(){
		CHM.inactivateChat() ;
	}

    function setData( data ){
		FlashPeer.data = data;
	}

	/**
	 * Proxy call to EVM.fireCustomEvent.
	 * Introduced for MAINT23-155 Implement Support to Fire Custom Events from the Client Interface in BR3.0.
	 * Also used by PR-16 Send Baynote Event when recommendation link clicked.
	 * @see EVM.fireCustomEvent
	 */
    function fireCustomEvent(eventName, rule, evt, evtDataSupplementFcn) {
		if (typeof evtDataSupplementFcn === 'string' && evtDataSupplementFcn.indexOf('function(') == -1) {
			evtDataSupplementFcn = "function() { return " + evtDataSupplementFcn + "}";
		}
		EVM.fireCustomEvent(eventName, rule, evt, evtDataSupplementFcn);
    }

    /**
	 * Fires custom events with data instance and data object support. This is a more complete execution of the above method.
	 * @param eventName {String} The name of the custom event to be invoked.
	 * @param jsonData {String} Optional jsonized data string. Will be parsed into an object and passed to the EVM.
	 * @param dataFcn {String} Optional stringified function to be JSON parsed and executed by the event manager to produce event data.
	 */
	function fireCustomEvt(eventName, jsonData, dataFcn){
		var evt = null;
		if(typeof jsonData == "string"){
			evt = MixIns.JSON.parse(jsonData);
		}
		if (typeof dataFcn === 'string' && dataFcn.indexOf('function(') == -1) {
			dataFcn = "function() { return " + dataFcn + ";}";
		}
		EVM.fireCustomEvent(eventName, null, evt, dataFcn);
	}

	/**
	*API: Sets the memory based cookie (for XD)
	*used by Haxe code
	*HTML file postToServer.htm calls back to this routine.
	*/
	function set3rdPartyCookieFromQueue(){
	  var obj = CM ;
	  obj.set3rdPartyCookieFromQueue();
	}
	/**
	 * Method: closeChat()- Closes the chat and resets chat state in the chat manager.
	 * @param _doSoftKill true if we want to hide the chat from view of chat is desired.
	 * @see InqChatMgr.closeChat
	 * @see InqChatMgr.softKill
	 */
	function closeChat(_doSoftKill){
		Inq.log("closeChat("+_doSoftKill+")");
		if(_doSoftKill){
			CHM.softKill(this,null,"Flash closed");
		} else{
			CHM.closeChat(this,null,"Flash closed");
		}
	}

	/**
     * Set parameters (auxiliary to survey spec) that will be passed to survey manager on survey launch.
     * This method does not erase previously set parameters rather adds them.
     * Parameters are stored in lastChat object in Chat manager and persisted to inqVital thus available
     * even after chat is closed.
     * Note: Chat manager recreates lastChat object when new chat starts.
     * @param surveyParams object with parameters for survey.
     * @see ChatMgr.setSurveyParams
     */
	function setSurveyAuxParams(surveyParams){
		  CHM.setSurveyAuxParams(surveyParams);
	}

    /**
     * Returns survey parameters (auxiliary to survey spec).
     * @see ChatMgr.getSurveyParams
     */
	function getSurveyAuxParams(){
		  return CHM.getSurveyAuxParams();
	}

    /**
     * Sets clickstream sent flag.
     * Flag is stored in lastChat object in Chat manager and persisted to inqVital thus available
     * even after chat is closed.
     * @see ChatMgr.isClickStreamSent
     */
	function setClickStreamSent(isSent){
		  CHM.setClickStreamSent(isSent);
	}

    /**
     * Returns clickstream sent flag.
     * @see ChatMgr.isClickStreamSent
     */
	function isClickStreamSent(){
		  return CHM.isClickStreamSent();
	}

	function agentSurveyCall(specID){
		  SVYM.showSurvey(specID, "", CHM.getSurveyAuxParams());
	}



	/**
	 *	Position and size the text input SWF instance
	 *	This is for internationalization
	 *		This instance of the flash gets the text and sends it to the main popup
	 *		This instance MUST be wmode=window
	 */
	function showTextInput(bShow,y,x,w,h){
		CHM.showTextInput(bShow,y,x,w,h);
	}

	/**
	 *	Position and size the the persistent button
	 *	@param x left position in pixels
	 *	@param y top position in pixels
	 *	@param w width in pixels
	 *	@param h width in pixels
	 *	@deprecated
	 */
	function showPersistentButton(x,y,w,h){
	/*
		log("showPersistentButton()");
		CHM.showPersistentButton(x,y,w,h);
	*/
	}

	/** setPersistentButtonDebugActive
	 *	@param active Show the persistent window overlay with a green halo
	 */
	function setPersistentButtonDebugActive(active){
		log("setPersistentButtonDebugActive()");
		CHM.setPersistentButtonDebugActive(active);
	}

	/** hidePersistentButton
	 *	@param active Show the persistent window overlay with a green halo
	 */
	function hidePersistentButton(){
		log("hidePersistentButton()");
		CHM.hidePersistentButton();
	}

	/** showThankyou
	 *	Show the thankyou layer
	 */
	function showThankyou(){
		log("showThankyou()");
		try {
			CHM.closeChat(this,null,"Flash thankyou.");
			return true;
		}
		catch (e) {
			log(e);
		}
		return false ;
	}
	/*
	 * @TODO Ready the chat client to pass chat ID to close operation
	 */
	/**
	 *	hideFramesetChat
	 *	hide the chat
	 */
	function hideFramesetChat(){
		CHM.closeChat();
	}

	/** setChatBanished
	 *	@param none
	 */
	function setChatBanished(){
		/* TODO: setChatBanished is incomplete
		PM.addVar( new NVPair("banished", true) );*/
	}

	/**
	 *	setAgentID
	 *	@param _agentID text agentID (supplied by chat client)
	 *	@param cobrowseEnabled boolean cobrowseEnabled
	 *	@param (opional) eventDataStr text JSON with agent's first & last name
     *  @param buID Agent business Unit ID
	 */
	function setAgentID(_agentID, cobrowseEnabled, eventDataStr, buID){
		CHM.assignAgent(_agentID, false, cobrowseEnabled, eventDataStr, buID);
	}

	/**
	 * Description: Provides data to the flash for passing on to the agent
	 * on chat launch.
	 */
	function getAgentData(){
		var params = MixIns.mixAbsorber({});
		try {
			if (typeof self.inqAgentData != "undefined"){
				params.absorb(self.inqAgentData);
			}
			if(!isNullOrUndefined(self.inqData)){
				if(self.inqData instanceof Array){
					//handle arrays through numerical iterator and convert to data
					for(var i = 0; i < self.inqData.length; i++){
						params["data"+i] = self.inqData[i];
					}
				}
				else if (self.inqData instanceof Object){
					params.absorb(self.inqData);
				}
			}
			params["markerHistory"]=LDM.getLandingHistory().join("<br>");
		} catch (e){}
		return params;
	}

	/**
	 *	onEngaged
	 *	@param event
	 */
	function onEngaged(event) {
		Inq.CHM.fireChatEngaged(event);
		BRM.fireServiceEngagedEvent(event);
	}

	/**
	 *	onInteracted
	 *	@param event
	 */
	function onInteracted(event) {
		BRM.fireServiceInteractedEvent(event);
	}

	/**
	 *	onCustomerMsg
	 *	@param event
	 */
	function onCustomerMsg(eventData) {
		CHM.fireCustomerMsgEvent(eventData);
	}

	/**
	 *	onAgentMsg
	 *	@param event
	 */
	function onAgentMsg() {
		CHM.fireAgentMsgEvent();
	}

	function onAssisted() {
		// exists only for backward compatibility with previous chat client
	}

	/** This calls  doPushToFrameset once the cookies have been committed.
	  * If non xd mode or no cookies on queue, perform doPushToFrameset
	  * If xd mode and cookies on the queue, perform doPushToFrameset upon cookie completion
	  *
	  * Jira Ticket: https://dev.inq.com/jira/browse/PR-101
	  * On IE8 the _sUrl and _sTarget becomes out of scope in the handler,
	  * So since we are dependent on these values, we embed them in the handler code:
	  * We:
	  *  1) Build a function calling the "doPushToFrameset function and embed the parameters in the function
	  *  2) Pass the dynamically created function to the cookie method "whenCookiesCommitted"
	  *  3) We make doPushToFrameset function visible
	  *
	  * @param _sUrl - the url to go to.
	  * @param _sTarget - the target window
	  * @param _fromClick - means that this request is coming from a mouse click and can avoid popup blockers
	  */
	function PushToFrameset(_sUrl, _sTarget, _fromClick) {
		/* If we expect to open a window, and the "fromClick" specifier is true
		 * Then check the target to see if it goes to a different window (_parent, _self, _top go to this window)
		 * Then check to see if the cookie setting queue is empty, if not pre-popout the window as blank
		 *   When the cookies are committed, they will propagate this window with correct url
		 */
		if (_fromClick && (_sTarget != "_self") && (_sTarget != "_top") && (_sTarget != "_parent")){	/* is this a different window or tab? */
			if (!(CM).isThirdPartyCookieQueueEmpty()) { /* Are we waiting for cookies */
				var winTarget = null ;
				var tools = "left=0,top=0,toolbar=1,location=1,menubar=1,status=1,scrollbars=1";
				winTarget = window.parent.top.open("about:blank", _sTarget, tools);
				if (null == winTarget) {
					winTarget = window.parent.top.open("about:blank", _sTarget);
				}
			}
		}


		CM.whenCookiesCommitted (new Function("inqFrame.Inq.FlashPeer.doPushToFrameset(" + toJsString(_sUrl,'"') + "," + toJsString(_sTarget,'"') + ");"));
	}

	/** This is the original PushToFrameset
	  * It does not wait for cookies to be set.
	  * Please see new PushToFrameset above.
	  *
	  * @param _sUrl - the url to go to.
	  & @param _sTarget - the target window
	  */
	function doPushToFrameset(_sUrl, _sTarget){
		try {
			if ("_inqPersistentChat" == top.name){
				if ("_self" == _sTarget){
					 getOpener().top.document.location.href = _sUrl;
				}else{
					var winTarget = null ;
					var tools = "left=0,top=0,toolbar=1,location=1,menubar=1,status=1,scrollbars=1";
					winTarget = window.parent.top.open(_sUrl, _sTarget, tools);
					if (null == winTarget) {
						winTarget = window.parent.top.open(_sUrl, _sTarget);
					}
				}
			}else{
				if ("_self" == _sTarget){
					window.parent.top.document.location.href = _sUrl;
				}else{
					var winTarget = null ;
					winTarget = window.parent.top.open(_sUrl, _sTarget, "top=0;left=0");
					if (null == winTarget) {
						winTarget = window.parent.top.open(_sUrl, _sTarget);
					}
				}
			}
		}catch (e) {}
	}

	/*
	 * Description: Determines if the loading browser has flash installed
	 *   or not.
	 */
	function browserHasFlash(){
		var flash_version;
		if(navigator.plugins && typeof navigator.plugins["Shockwave Flash"] == "object"){
			var desc = navigator.plugins["Shockwave Flash"].description;
			if(desc){
				var versionStr = desc.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
				var major = parseInt(versionStr.replace(/^(.*)\..*$/, "$1"));
				var build = parseInt(versionStr.replace(/^.*r(.*)$/, "$1"));
				flash_version = parseFloat(major + "." + build);
			}
		}else if(window.ActiveXObject){
			try{
				var flashObj = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
				var desc = flashObj.GetVariable("$version");
				if(desc){
					var versionArr = desc.replace(/^\S+\s+(.*)$/, "$1").split(",");
					var major = parseInt(versionArr[0]);
					var build = parseInt(versionArr[2]);
					flash_version = parseFloat(major + "." + build);
				}
			}catch(e){}
		}

		if(typeof flash_version != "undefined"){
			return (flash_version >= Inq.requiredFlashVersion);
		}

		return false;
	}

	function ForceFocus(){
		try {
			/* following code is to create an object of type flash in order to allow activation of flash */
			try{
				document.createElement("object").setAttribute("type", "application/x-shockwave-flash");
			}catch(er){}
			var clnt = self.document.getElementById("client");
			var nclnt = self.document.getElementById("notclient");
			if (clnt){
				self.focus();
				clnt.focus();
				if (nclnt) {
					nclnt.focus();
				}
			}
		}catch(e){}
	}

	function requestTranscript( _emailAddress ) {
		var url = urls.vanityURL + "/tagserver/transcriptrequest/logTranscriptRequest";
        var _chatID = CHM.getChatID();
        var _emailSpecID = CHM.getEmailSpecId();
        var _agentName = CHM.getAgentName();
        var _customerName = CHM.getCustomerName();
		var map = {chatID:_chatID, emailAddress:_emailAddress, emailSpecID:_emailSpecID, agentName:_agentName, customerName:_customerName};
		ROM.send( url, map );
	}

	function captureEmailAddress( _emailAddress ) {
        var map = {custID:Inq.getCustID(), chatID: CHM.getChatID(), emailAddress:_emailAddress};
		ROM.send(urls.vanityURL + "/tagserver/emailrequest/logEmailAddressCapture", map);
	}

	function startLaunches(isActive){
		if (!isActive) {
			Inq.CHM.continueChatting() ;
		}
	}

	/*
	 * setDragable
	 *  Description: Enables the dragging of the popup chat
	 */
	function setDragable(){
		if (Inq.CHM.chat != null)
			Inq.CHM.chat.setDragable() ;
	}

	/*
	 * setResizable
	 *  Description: Enables the resizability of the popup chat
	 */
	function setResizable(){
		if (Inq.CHM.chat != null)
			Inq.CHM.chat.setResizable() ;
	}

	/*
	 * setV3Data
	 *  Description: sets persistent (session) client data for V3 chat
	 *  @param dictionary object containing data to be set.
	 */
	function setV3Data(dictionary) {
		Inq.CHM.setChatInterfaceData(dictionary) ;
	}

	/*
	 * getV3Data
	 *  Description: retrieves persistent (session) client data for V3 chat client
	 *  @returns  object containing data to be set.
	 */
	function getV3Data() {
		return CHM.getChatInterfaceData() ;
	}

	/*
	 * popOutChat
	 *  Description: starts the pop-out (persistent) chat client
	 *  @returns  true/false on success
	 */
	function popOutChat(b, resizable) {
		return  Inq.CHM.popOutChat(b, resizable) ;
	}

	/*
	 * getBaseURL
	 *  Retrieves the base URL for the tagserver using the vanity name
	 *  Example: "clientsname.inq.com/tagserver",
	 *  @param none
	 *  @returns  String containing the base URL for the tagserver using the vanity name
	 */
	function getBaseURL() {
		return  window.Inq.urls.baseURL ;
	}

	/*
	 * getMediaBaseURL
	 *  Retrieves the base URL for the media server
	 *  Example: "media.inq.com/media",
	 *  @param none
	 *  @returns  String containing the base URL for the media server
	 */
	function getMediaBaseURL() {
		return  window.Inq.urls.mediaBaseURL ;
	}

	/**
	 *  Retrieves the xforms vanity domain
	 *  Example: "xformsv3.inq.com",
	 *  @returns  String containing the xforms vanity domain.
	 */
	function getXFormsDomain() {
		return  window.Inq.urls.xFormsDomain;
	}

    /**
     * getVanityUrl
     *  Retrieves the vanity URL
     *  Example: "http://tagserverv3.inq.com",
     *  @param none
     *  @returns  String containing the vanity URL
     */
    function getVanityUrl() {
        return window.Inq.urls.vanityURL;
    }

    /**
     * getChatRouterVanityUrl
     *  Retrieves the chat router vanity domain
     *  Example: "http://chatrouterv3.inq.com",
     *  @param none
     *  @returns  String containing the chat router vanity domain
     */
    function getChatRouterVanityUrl() {
        return window.Inq.urls.chatRouterVanityDomain;
    }

    /*
      * getTitleBarHeight
      *  Retrieves the height of the dragable area for V3 chat
      *  @returns  number specifiing the height of the draggable area
      */
	function getTitleBarHeight() {
		try {
			return Inq.CHM.chat.chatSpec.chatTheme.tbh;
		} catch(e){}
		return 50 ;
	}


	/*
	 * getPopupCloserWidth
	 *  Retrieves the distance from right-hand portion of the draggable area
	 *  		 and the right-hand portion of the client area.
	 *  This is used to make room for the closer button and other buttons as well.
	 *  @returns  a number specifiing the distance between the right edge of the client skin and the right edge of the dragging area.
	 */
	function getPopupCloserWidth() {
	//	Inq.CHM.chat.chatSpec.chatTheme
		try {
			return Inq.CHM.chat.chatSpec.chatTheme.ciw;
		} catch(e){}
		return 50 ;
	}

	/**
	 *
	 * getSkinLocation
	 *  Retrieves the position specifier for where to position the client skin
	 *	@returns string specifiing the initial position of the skin
	 *	Posible values are:
	 *   "UPPER CENTER"  "UPPER_CENTER"  "TOP_CENTER"
	 *   "UPPER_RIGHT", "TOP_RIGHT"
	 *   "UPPER_LEFT", "TOP_LEFT"
	 *   "CENTER_LEFT"
	 *   "CENTER_RIGHT"
	 *   "LOWER_LEFT", "BOTTOM_LEFT"
	 *   "LOWER_CENTER", "BOTTOM_CENTER"
	 *   "LOWER_RIGHT", "BOTTOM_RIGHT"
	 *   "POP_UNDER_CENTER"
	 *   "ABSOLUTE"
	 *   "RELATIVE"
	 *   "CENTER"
	 *
	 */
	function getSkinLocation() { //chatData.chat.flash.location
		try {
			return Inq.CHM.chat.chatSpec.chatTheme.pos;
		} catch(e){}
		return "UPPER_LEFT";
	}

	/*
	 * getSkinHeight
	 *  Retrieves the height of the skin below the dragable area
	 *  @returns  number specifiing the height of the skin below the dragable area
	 */
	function getSkinHeight() {
		try {
			return Inq.CHM.chat.chatSpec.chatTheme.dh;
		} catch(e){}
		return 300 ;
	}

	/*
	 * getSkinHeight
	 *  Retrieves the width of the skin
	 *  @returns  number specifiing the width of the skin
	 */
	function getSkinWidth() {
		try {
			return Inq.CHM.chat.chatSpec.chatTheme.dw;
		} catch(e){}
		return 400 ;
	}

	/*
	 * getSkinLeft
	 *  Retrieves the distance from the left edge of for chat skin
	 *  @returns  number specifiing the distance from the left edge of for chat skin
	 */
	function getSkinLeft() {
		try {
			return Inq.CHM.chat.chatSpec.chatTheme.lx;
		} catch(e){}
		return 0 ;
	}

	/*
	 * getSkinTop
	 *  Retrieves the distance from the top edge of for chat skin
	 *  @returns  number specifiing the distance from the top edge of for chat skin
	 */
	function getSkinTop() {
		try {
			return Inq.CHM.chat.chatSpec.chatTheme.ly;
		} catch(e){}
		return 0 ;
	}

	/*
	 * getFlashVars
	 *  Retrieves the flash variables (as we used in v2)
	 *  @returns  the flash variables
	 */
	function getFlashVars() {
		try {
			return Inq.CHM.chat.getFlashVars();
		} catch(e) {
            log("Error obtaining flashvars from Chat object: " + e);
        }
		return "" ;
	}

	/*
	 * getSkin
	 *  Retrieves the URL for the skin mxml file
	 *  @returns  URL for the skin mxml file
	 */
	function getSkin() {
		try {
			return Inq.CHM.chat.getSkin() ;
		} catch(e){}
		return "TouchCommerce.skin" ;
	}

	function getV3TimeOut() { // tmout  = untyped Inq["v3TO"] ;
		return Inq.v3TO
	}

	function setSessionParam(key, val) { // try { Inq.SaveMgr.setSessionParam("persistentChat", "true"); } catch (e:Error) { }
	//	untyped window.Inq.FlashPeer.setSessionParam(key,val) ;
	}

	function closePersistent() { // Inq.ChatMgr.closePersistent();
		window.Inq.CHM.closePersistent() ;
	}

	function isThankYouEnabled(){ // var tY:Bool = untyped Inq.ChatMgr.isThankYouEnabled() ;
		return window.Inq.CHM.thankYouEnabled ;
	}

	function isThankYouEnabled(){ // var tY:Bool = untyped Inq.ChatMgr.isThankYouEnabled() ;
		return window.Inq.CHM.thankYouEnabled ;
	}

	function blockService(blockDetails) {
		var serviceType = "ALL"; // by default block all types of service
		var period = -1; // by default block forever; ToDo: declare constants for block periods
		if(!isNullOrUndefined(blockDetails)) {

			// ToDo: subject for review: for some reason URL part of chat.pushpage command comes
			// wrapped in parenthesis. Unwrapping here if parenthesis present.
			if ((blockDetails.charAt(0) == '(') && (blockDetails.charAt(blockDetails.length-1) == ')')) {
				blockDetails = blockDetails.substr(1, blockDetails.length - 2);
			}

			var blockParams = MixIns.JSON.parse(blockDetails);
			serviceType = blockParams.serviceType;
			period = blockParams.period;
		}
		window.Inq.blockService(serviceType, period);
	}

    function wasSaleAction() {
        return window.Inq.wasSaleAction();
    }

	/**
	 * Set the visibility of Application.
	 * @param visible Boolean indicating whether the Application should be visible.
	 */
	function setVisible(visible) {
		try {
			var app = window["Application"];
			if (app && app.application && app.application.setVisible) {
				app.application.setVisible(visible);
			}
		}
		catch (e) {
			log(e);
		}
	}


    /**
     * Send chat.automaton_response msg
     * @param eventName event name
     * @param data parameters from chat.automaton_request msg
     */
    function sendDTEvent(eventName, data) {
        try {
            var app = window["Application"] ;
            if (app && app.application && app.application.sendDTEvent) {
                // call HAX to send msg
                app.application.sendDTEvent(eventName, data);
            }
        }
        catch (e) {
            log(e);
        }
    }

	function _executeCustomCommand(params) {
		executeCustomCommand(params);
	}

	function whenPersistent (isPersistent,protoDomain, transferURL, needNewOpener) {
		var inst = ChatMgr.getInstance();
		inst.whenPersistent(isPersistent,protoDomain, transferURL, needNewOpener);
	}

	function registerPersistentWindow(){
		try {
			var opener = window.parent.opener.inqFrame;
			opener.Inq.CHM.persisentWindow = window.parent;
			return true;
		} catch(e){}
		return false;
	}

	function setPersistentWindowActive(state){
		var inst = ChatMgr.getInstance();
		inst.setPersistentWindowActive(state);
	}

	function CloseChatFromPersistent() {
		log("@@@CloseChatFromPersistent");
		window.inqFrame.Inq.CHM.CloseChatFromPersistent();
	}
	
	/**
	 * bind - safe binding of the method and object.
	 *		This saves the the object and the handler in a anonymous object (json)
	 *		The json has a function that recombinds the object and method by the
	 *		use of the browsers "apply" method.
	 * @param handler - the method that is to be made safe via a closure
	 */
	function bind(handler) {
		var handlerContext = {obj: this, method: handler, safeFunc: function(){
			var closure = arguments.callee.closure;
			return closure.method.apply(closure.obj, arguments);
			}};
		handlerContext.safeFunc.closure = handlerContext
		return handlerContext.safeFunc;
	}
	
    function getCBC() {
        if (CHM.isPersistentWindow() && (window.parent.opener) && (window.parent.opener.inqFrame)
            && (window.parent.opener.inqFrame.Inq) && (window.parent.opener.inqFrame.Inq["CBC"])) {
            return window.parent.opener.inqFrame.Inq["CBC"];
        }
        return window.Inq["CBC"];
    }
	
	/**
	 * 	acceptCobrowseInvitation - performs the following:
	 * 	 -  gets the CBC and performs the accept
	 */
	function acceptCobrowseInvitation(){
		try {
			var cbc = getCBC();
			if (!!cbc) {
				cbc.accept();
			}
		} catch (e) {
			log("CBC ERROR:" + e.message);
		}
	}

	
	/**
	 * 	acceptCobrowseInvitation - performs the following:
	 * 	 -  gets the CBC and performs the acceptShare
	 */
	function acceptCobrowseShareControl(){
		try {
			var cbc = getCBC();
			if (!!cbc) {
				cbc.acceptShare();
			}
		} catch (e) {
			log("CBC ERROR:" + e.message);
		}
	}

	function endCobrowseSession(){
		try {
			var cbc = getCBC();
			if (!!cbc) {
				cbc.stopQuiet();
			}
		} catch (e) {
			log("CBC ERROR:" + e.message);
		}
	}

    // reserverved for future
	function acceptCobAndShare(){
		try {
			var cbc = getCBC();
			if (!!cbc) {
				cbc.accept();
			}
		} catch (e) {
			log("CBC ERROR:" + e.message);
		}
	}
	
	function isCobrowseEngaged(){
		try {
			var cbc = getCBC();
			if (!!cbc) {
				return cbc.isCobrowseEngaged();
			}
		} catch (e) {
			log("CBC ERROR:" + e.message);
		}
		return false;
	}

	function isSharedControl(){
		try {
			var cbc = getCBC();
			if (!!cbc) {
				return cbc.isSharedControl();
			}
		} catch (e) {
			log("CBC ERROR:" + e.message);
		}
		return false;
	}

	function isCobrowseEnded(){
		try {
			var cbc = getCBC();
			if (!!cbc) {
				return cbc.isCobrowseEnded();
			}
		} catch (e) {
			log("CBC ERROR:" + e.message);
		}
		return true;
	}

    function ciAcceptCobInv(){
        throw("ciAcceptCobInv is not defined");
    }

    function ciDeclineCobInv(){
        throw("ciDeclineCobInv is not defined");
    }

    function ciAcceptCobShareInv(){
        throw("ciAcceptCobShareInv is not defined");
    }

    function ciDeclineCobShareInv(){
        throw("ciDeclineCobShareInv is not defined");
    }

    function ciAcceptCobAndShareInv(){
        throw("ciAcceptCobAndShareInv is not defined");
    }

    function setCiFunction(fName, fBody) {
		if ( /^ci/.test(fName) ) {
			this[fName] = fBody;
		} else {
			throw("Error: CI framework function name must start with ci");
		}    
	}

	function isLoggingDisabled(){
		return JSLoggingDisabled;
	}


    function setCobrowseBannerText(bannerText){
		try {
			var cbc = getCBC();
			if (!!cbc) {
				return cbc.setCobrowseBannerText(bannerText);
			}
		} catch (e) {
			log("CBC ERROR:" + e.message);
		}
		return true;
    }

	/**
	 * Creates new IFrame for XForm
	 * @param div container div where iframe is created
	 * @param url URL where div will be submitted later
	 * @param channelID channel Id if update is required
	 * @param scrolling optional, controlling scrolbars for IFrame, default value is "no"
	 * @return newly created iframe
	 */
	function createXFrame(div, url, businessUnitID, scrolling, data){
		var ldr = new XFormsLoader();
		return ldr.createXFrame(div, url, businessUnitID, scrolling, data);
        }

        function getClientPageURL() {
            return win.location.href;
        }

	/**
	 * Sets source of XFrame in CI if CI and XFrame are active, otherwise does nothing.
	 * @param layerID id of div to update
	 * @param url new source for layer
	 * @param businessUnitID optional business unit id parameter
	 */
	function updateXFrameFromBizRule(layerID, url, businessUnitID) {
		try {
			var app = window["Application"] ;
			if (app && app.application && app.application.updateXFrameFromBizRule) {
				app.application.updateXFrameFromBizRule(layerID, url, businessUnitID);
            } else {
                log("ERROR: update-xframe failed for layer [" + layerID + "]: app.application is not initialized");
			}
		}
		catch (e) {
			log(e);
		}
	}


	/**
	 * Returns opener's persistent chat window refresh flag.
	 * Flashpeer is used since the flag is set by Chat manager (javascript) and it is used in Hx code.
	 * @return true is a persistent window is refreshed by it's opener.
	 */
	function isRefreshRequired() {
		var o = getOpener();
		/* isChatRefresh is true when the chat window is refreshed for domain (protocol) change. */
		if(o && o.Inq.isChatRefresh) {
			return o.Inq.isChatRefresh;
		}
		return false;
    }

    /**
     * Once persistent chat window refresh is taken care, the flag should be set to false.
     */
    function resetRefreshFlag() {
		var o = getOpener();
		/* isChatRefresh is true when the chat window is refreshed for domain (protocol) change. */
		if(o && o.Inq.isChatRefresh) {
			o.Inq.isChatRefresh = false;
		}
    }
	/**
	 * Parse XFrame url into js object {url:...;, params:{...}}
	 * XFrame should contain relative url, without protocol and domain f.e. source="/orbeon/inq/view?dtid=14"
	 * @param url url to parse
	 */
	function parseXFrameUrl(url) {
		var pattern = new RegExp(/(^.*)(forms(v3)?\.inq\.com)/);
		// Replace if exists hardcoded xforms domain in mxml (mx:XFrame) with
		// xform vanity domain from DB, else concat relative url with vanity domain.
		url = url.search(pattern) != -1 ? url.replace(pattern, getXFormsDomain()) : getXFormsDomain() + url;

		var res = url.split('?');
		var params = {};
		if (res[1] != null) {
			var oldParams = res[1].split('&');
			for (var i=0; i< oldParams.length; i++) {
				var nameValue = oldParams[i].split('=');
				params[nameValue[0]] = nameValue[1];
			}
		}
		return {url: res[0], params: params};
	}

    function getPageID() {
        return Inq.LDM.getPageID();
    }

	/**
	 * Identifies this as a portal implementation of Client Interface
	 * @param none
	 * @return true/false if portal implementation
	 */
	function isPortal() {
		return true;
	}

    /**
	 * delegate that gets the Business Unit ID that replaces the channel id
	 * @param none
	 * @return string containing the BusinessUnitID
	 */
	function getBusinessUnitID() {
		return (CHM.getChat()) ? CHM.getChat().getBusinessUnitID() : getDefaultBusinessUnitID() ;
	}

	/**
	 * delegate that gets the customer id
	 * @param none
	 * @return string containing the customer id
	 */
	function getCustID(){
		return Inq.getCustID();
	}

	/**
	 * delegate that gets the session id
	 * @param none
	 * @return string containing the session id
	 */
	function getSesID(){
		return getSessionID();
	}

	/**
	 * delegate that gets the assignment id
	 * @param none
	 * @return string containing the assignment id
	 */
	function getIncAsID(){
		return getIncAssignmentID();
	}

	/**
	 * delegate that gets the page marker id
	 * @param none
	 * @return string containing the page marker id
	 */
	function getPageMarker(){
		return LDM.getPageMarker();
	}

	/**
	 * delegate that gets the automaton data map
	 * @param none
	 * @return automaton data map
	 */
	function getAutomatonDataMap(){
		var automatonDataMap = PM.getVar("automatonDataMap");
		return ((automatonDataMap) ? automatonDataMap.getValue() : "");
	}

	/**
	 * delegate that gets the business rule id
	 * @param none
	 * @return business rule id
	 */
	function getBrID(){
		return CHM.getChat().getRule().getID();
	}

	/**
	 * delegate that gets the business rule name
	 * @param none
	 * @return business rule name
	 */
	function getBrName(){
		return CHM.getChat().getRule().getName();
	}

	/**
	 * delegate that gets the agent id
	 * @param none
	 * @return agent id
	 */
	function getAgentID(){
		return CHM.getAgentID();
	}

    /**
     * This calls supplied function once the cookies have been committed.
     * @param handler {String|Function} function to be executed
     */
    function onCookiesCommitted(handler) {
        var closure = (typeof handler == "string") ? new Function(handler) : handler;
        CM.whenCookiesCommitted(closure);
    }

    /**
     * This calls supplied function once the cookies have been committed.
     * @param handler {String|Function} function to be executed
     */
    function when3rdPartyCookieCommitted( vcnt ) {
        CM.when3rdPartyCookieCommitted( vcnt );
    }

    /**
     * Returns deviceType based on the Inq.getDeviceType() private function.
     *
     */
    function _getDeviceType() {
        var deviceType = "Other";
        try {
            deviceType = getDeviceType();
        } catch (e) {
            log("Error in getDeviceType: " + e);
        }
        return deviceType;
    }

    /**
     * Close persistent window if it open. This function calls when user click to close button
     * before persisnt chat load.
     */
    function closePersistentWindowIfOpen() {
        if(!isNullOrUndefined(CHM.earlyPopout)) {
    		CHM.earlyPopout.close();
    	}
    	if(!isNullOrUndefined(CHM.popoutWindow)) {
    		CHM.popoutWindow.close();
    	}
    }

    function getBuRuleAgentGroupID(brID) {
        return BRM.getRuleById(brID).getAgentGroupID();
    }

	return {
		getBrID: getBrID,
		getBrName: getBrName,
		getAutomatonDataMap: getAutomatonDataMap,
		getPageMarker: getPageMarker,
		getIncAssignmentID: getIncAsID,
		getSessionID: getSesID,
		getCustID: getCustID,
		getAgentID: getAgentID,
		isPortal:isPortal,
        setCobBan: setCobrowseBannerText,
		acceptCobAndShare : acceptCobAndShare,
		isCobEnded : isCobrowseEnded,
		isCobEngaged : isCobrowseEngaged,
		isCobShared : isSharedControl,
		acceptCob : acceptCobrowseInvitation,
		acceptCobShare : acceptCobrowseShareControl,
		endCob : endCobrowseSession,
		isV3C2CPersistent: isV3C2CPersistent,
		closePopupChat : closePopupChat,
		setData : setData,
		closeChat : closeChat,
		showTextInput : showTextInput,
		showPersistentButton : showPersistentButton,
		setPersistentButtonDebugActive : setPersistentButtonDebugActive,
		hidePersistentButton : hidePersistentButton,
		showThankyou : showThankyou,
		hideFramesetChat : hideFramesetChat,
		setChatBanished : setChatBanished,
		setAgentID : setAgentID,
		getAgentData : getAgentData,
		onEngaged : onEngaged,
		onInteracted : onInteracted,
		onCustomerMsg : onCustomerMsg,
		onAgentMsg : onAgentMsg,
		onAssisted : onAssisted,
		PushToFrameset : PushToFrameset,
		doPushToFrameset: doPushToFrameset,
		browserHasFlash : browserHasFlash,
		ForceFocus : ForceFocus,
		requestTranscript : requestTranscript,
		captureEmailAddress: captureEmailAddress,
		startLaunches : startLaunches,
		setDragable: setDragable,
		setResizable: setResizable,
		setV3Data: setV3Data,
		set3rdPartyCookieFromQueue: set3rdPartyCookieFromQueue,
		getV3Data: getV3Data,
		popOutChat: popOutChat,
		getBaseURL: getBaseURL,
		getMediaBaseURL: getMediaBaseURL,
		getTitleBarHeight: getTitleBarHeight,
		getPopupCloserWidth: getPopupCloserWidth,
		getSkinLocation: getSkinLocation,
		getSkinHeight: getSkinHeight,
		getSkinWidth: getSkinWidth,
		getSkinLeft: getSkinLeft,
		getSkinTop: getSkinTop,
		getFlashVars: getFlashVars,
		getSkin: getSkin,
		getV3TimeOut: getV3TimeOut,
		setSessionParam: setSessionParam,
		closePersistent: closePersistent,
		isThankYouEnabled: isThankYouEnabled,
		blockTheService: blockService,
		whenIsPersistent: whenPersistent,
		registerPersistentWindow: registerPersistentWindow,
		setPersistentWindowActive: setPersistentWindowActive,
		setVisible: setVisible,
		CloseChatFromPersistent: CloseChatFromPersistent,
		executeCustomCommand: _executeCustomCommand,
		wasSaleAction: wasSaleAction,
		sendDTEvent: sendDTEvent,
		agentSurveyCall: agentSurveyCall,
		setSurveyAuxParams: setSurveyAuxParams,
		getSurveyAuxParams: getSurveyAuxParams,
		isClickStreamSent: isClickStreamSent,
		setClickStreamSent: setClickStreamSent,
		fireCustomEvent: fireCustomEvent,
		isLoggingDisabled: isLoggingDisabled,
		createXFrame: createXFrame,
        formsLoader: XFormsLoader,
		getClientPageURL: getClientPageURL,
		updateXFrameFromBizRule: updateXFrameFromBizRule,
		parseXFrameUrl: parseXFrameUrl,
		fireCustomEvt:fireCustomEvt,
        onCookiesCommitted: onCookiesCommitted,
		when3rdPartyCookieCommitted: when3rdPartyCookieCommitted,
		isRefreshRequired: isRefreshRequired,
		resetRefreshFlag: resetRefreshFlag,
		getBusinessUnitID: getBusinessUnitID,
		getPageID: getPageID,
        getVanityUrl: getVanityUrl,
        getChatRouterVanityUrl: getChatRouterVanityUrl,
        getXFormsDomain: getXFormsDomain,
        getDeviceType: _getDeviceType,
        closePersistentWindowIfOpen: closePersistentWindowIfOpen,
        getBuRuleAgentGroupID: getBuRuleAgentGroupID,
        ciAcceptCobInv: ciAcceptCobInv,
        ciDeclineCobInv: ciDeclineCobInv,
        ciAcceptCobShareInv: ciAcceptCobShareInv,
        ciDeclineCobShareInv: ciDeclineCobShareInv,
        ciAcceptCobAndShareInv: ciAcceptCobAndShareInv,
        setCiFunction: setCiFunction
    }
}

	/**
	 * Drag/Resize Manager
	 * @class
	 */

function Resize() {
	this.obj = null,
	this.win = window.parent,
	this.doc = window.parent.document;
	this.width = 0,
	this.height = 0,
	this.__init = function(o, oRoot, minX, maxX, minY, maxY, bSwapHorzRef, bSwapVertRef, fXMapper, fYMapper, _win){
		if(typeof o == "undefined" || o==null){
			return;
		}
		Inq.Resize.win = (null == _win) ? this.win : _win ;	/*<% // Allow dragging on any window, however default to client window %>*/
		Inq.Resize.doc = Inq.Resize.win.document ;

		o.box = this.doc.getElementById("inqResizeBox");		
		doc =  window.parent.document ;
		o.onmousedown	= Inq.Resize.__start;

		o.hmode			= bSwapHorzRef ? false : true ;
		o.vmode			= bSwapVertRef ? false : true ;

		o.root = ((oRoot) && (oRoot != null)) ? oRoot : o ;
		
		/*<% // get the width and height from the root %>*/
		Inq.Resize.width = o.root.clientWidth ;
		Inq.Resize.height= o.root.clientHeight ;

		if (o.hmode  && isNaN(parseInt(o.root.style.left  ))) o.root.style.left   = "0px";
		if (o.vmode  && isNaN(parseInt(o.root.style.top   ))) o.root.style.top    = "0px";
		if (!o.hmode && isNaN(parseInt(o.root.style.right ))) o.root.style.right  = "0px";
		if (!o.vmode && isNaN(parseInt(o.root.style.bottom))) o.root.style.bottom = "0px";

		o.minX	= typeof minX != 'undefined' ? minX : null;
		o.minY	= typeof minY != 'undefined' ? minY : null;
		o.maxX	= typeof maxX != 'undefined' ? maxX : null;
		o.maxY	= typeof maxY != 'undefined' ? maxY : null;
		o.xMapper = fXMapper ? fXMapper : null;
		o.yMapper = fYMapper ? fYMapper : null;

		o.root.onDragStart	= new Function();
		o.root.onDragEnd	= new Function();
		o.root.onDrag		= new Function();
	};

	this.__start = function(e){
		var o = Inq.Resize.obj = this;
		e = Inq.Resize.fixE(e);
		var y = parseInt(o.vmode ? o.root.style.top  : o.root.style.bottom);
		var x = parseInt(o.hmode ? o.root.style.left : o.root.style.right );
		
		o.root.onDragStart(x, y);
		if (o.box != null)
		{
			o.box.style.top   = o.root.style.top ;
			o.box.style.left  = o.root.style.left;
			o.box.style.width = o.root.style.width ;
			o.box.style.height = o.root.style.height ;
			o.box.style.border = "thin dotted rgb(32,32,32)" ;
			o.box.style.display = "" ;
			o.style.top = (parseInt(o.root.style.top)+parseInt(o.root.style.height)-16)+"px";
			o.style.left= (parseInt(o.root.style.left)+parseInt(o.root.style.width)-16)+"px";
		}

		o.lastMouseX	= e.clientX;
		o.lastMouseY	= e.clientY;

		if (o.hmode) {
			if (o.minX != null)	o.minMouseX	= e.clientX - x + o.minX;
			if (o.maxX != null)	o.maxMouseX	= o.minMouseX + o.maxX - o.minX;
		} else {
			if (o.minX != null) o.maxMouseX = -o.minX + e.clientX + x;
			if (o.maxX != null) o.minMouseX = -o.maxX + e.clientX + x;
		}

		if (o.vmode) {
			if (o.minY != null)	o.minMouseY	= e.clientY - y + o.minY;
			if (o.maxY != null)	o.maxMouseY	= o.minMouseY + o.maxY - o.minY;
		} else {
			if (o.minY != null) o.maxMouseY = -o.minY + e.clientY + y;
			if (o.maxY != null) o.minMouseY = -o.maxY + e.clientY + y;
		}

		Inq.Resize.doc.onmousemove	= Inq.Resize.resize;
		Inq.Resize.doc.onmouseup	= Inq.Resize.end;

		var newWidth = parseInt(Inq.Resize.obj.style.left) + 16 ;
		var newHeight = parseInt(Inq.Resize.obj.style.top) + 16 ;
		var oDiv = Inq.Resize.doc.getElementById("inqTitleBar") ;
		newWidth = newWidth - 24 ;
		oDiv.style.width = newWidth + "px" ;
		


		return false;
	};

	this.resize = function(e){
		e = Inq.Resize.fixE(e);
		var o = Inq.Resize.obj;

		var ey	= e.clientY;
		var ex	= e.clientX;
		var y = parseInt(o.vmode ? o.root.style.top  : o.root.style.bottom);
		var x = parseInt(o.hmode ? o.root.style.left : o.root.style.right );
		var nx, ny;

		if (o.minX != null) ex = o.hmode ? Math.max(ex, o.minMouseX) : Math.min(ex, o.maxMouseX);
		if (o.maxX != null) ex = o.hmode ? Math.min(ex, o.maxMouseX) : Math.max(ex, o.minMouseX);
		if (o.minY != null) ey = o.vmode ? Math.max(ey, o.minMouseY) : Math.min(ey, o.maxMouseY);
		if (o.maxY != null) ey = o.vmode ? Math.min(ey, o.maxMouseY) : Math.max(ey, o.minMouseY);

		nx = x + ((ex - o.lastMouseX) * (o.hmode ? 1 : -1));
		ny = y + ((ey - o.lastMouseY) * (o.vmode ? 1 : -1));

		if (o.xMapper)		nx = o.xMapper(y);
		else if (o.yMapper)	ny = o.yMapper(x);

		nx = ex - o.lastMouseX ;
		ny = ey - o.lastMouseY ;
		var _top = parseInt(Inq.Resize.obj.style["top"]) ;
		var _left = parseInt(Inq.Resize.obj.style["left"]) ;
		Inq.Resize.obj.style["left"] = (_left+nx) + "px";
		Inq.Resize.obj.style["top"] = (_top+ny) + "px";
		
		Inq.Resize.obj.style[o.hmode ? "left" : "right"] = (nx + _left) + "px";
		Inq.Resize.obj.style[o.vmode ? "top" : "bottom"] = ny + _top + "px";

		Inq.Resize.obj.lastMouseX	= ex;
		Inq.Resize.obj.lastMouseY	= ey;

		Inq.Resize.obj.root.onDrag(nx, ny);
	
		/*<%-- If we have a resizing box resize it --%>*/
		if (Inq.Resize.obj.box)
		{
			var height = ny + _top - parseInt(Inq.Resize.obj.box.style.top)+16;
			var width  = nx + _left - parseInt(Inq.Resize.obj.box.style.left)+16;
			if (width >= 16 && height >= 16){			
				Inq.Resize.obj.box.style.width = width + "px";
				Inq.Resize.obj.box.style.height = height + "px";
			}		
 		}		
		return false;
	};

	this.end = function(){
		Inq.Resize.doc.onmousemove = null;
		Inq.Resize.doc.onmouseup   = null;
		
		var newWidth = parseInt(Inq.Resize.obj.style.left) - parseInt(Inq.Resize.obj.root.style.left) + 16 ;
		var newHeight = parseInt(Inq.Resize.obj.style.top) - parseInt(Inq.Resize.obj.root.style.top) + 16 ;
		  		
		if (Inq.Resize.obj.box)	{
			Inq.Resize.obj.box.style.display = "none" ;
		}
		

		Inq.Resize.obj.root.onDragEnd(	parseInt(Inq.Resize.obj.root.style[Inq.Resize.obj.hmode ? "left" : "right"]),
										parseInt(Inq.Resize.obj.root.style[Inq.Resize.obj.vmode ? "top" : "bottom"]));
		if (newWidth < 16 || newHeight < 16){
			newWidth = parseInt(Inq.Resize.obj.root.style.width);
			newHeight = parseInt(Inq.Resize.obj.root.style.height);			
		}
		Application.ResizeStage(newWidth,newHeight);
		Inq.Resize.obj = null;
	};

	this.fixE = function(e){
		if (typeof e == 'undefined') 
		{
			e = Inq.Resize.win.event;
		}
		if (typeof e.layerX == 'undefined') e.layerX = e.offsetX;
		if (typeof e.layerY == 'undefined') e.layerY = e.offsetY;
		return e;
	}
}

function Drag() {
	this.obj = null,
	this.win = window.parent,
	this.doc = window.parent.document;
	

	this.__init = function(o, oRoot, minX, maxX, minY, maxY, bSwapHorzRef, bSwapVertRef, fXMapper, fYMapper, _win){
		Inq.Drag.win = (null == _win) ? this.win : _win ;	/*<% // Allow dragging on any window, however default to client window %>*/
		Inq.Drag.doc = Inq.Drag.win.document ;
		if(typeof o == "undefined" || o==null){
            return;
        }
        o.onmousedown	= Inq.Drag.__start;

		o.hmode			= bSwapHorzRef ? false : true ;
		o.vmode			= bSwapVertRef ? false : true ;

		o.root = oRoot && oRoot != null ? oRoot : o ;

		if (o.hmode  && isNaN(parseInt(o.root.style.left  ))) o.root.style.left   = "0px";
		if (o.vmode  && isNaN(parseInt(o.root.style.top   ))) o.root.style.top    = "0px";
		if (!o.hmode && isNaN(parseInt(o.root.style.right ))) o.root.style.right  = "0px";
		if (!o.vmode && isNaN(parseInt(o.root.style.bottom))) o.root.style.bottom = "0px";

		o.minX	= typeof minX != 'undefined' ? minX : null;
		o.minY	= typeof minY != 'undefined' ? minY : null;
		o.maxX	= typeof maxX != 'undefined' ? maxX : null;
		o.maxY	= typeof maxY != 'undefined' ? maxY : null;

		o.xMapper = fXMapper ? fXMapper : null;
		o.yMapper = fYMapper ? fYMapper : null;
		o.corner = this.doc.getElementById("inqDivResizeCorner");

		o.root.onDragStart	= new Function();
		o.root.onDragEnd	= new Function();
		o.root.onDrag		= new Function();
	};
	
	this.__start = function(e){
		var o = Inq.Drag.obj = this;
		e = Inq.Drag.fixE(e);
		var y = parseInt(o.vmode ? o.root.style.top  : o.root.style.bottom);
		var x = parseInt(o.hmode ? o.root.style.left : o.root.style.right );
		o.root.onDragStart(x, y);
		if (o.corner) o.corner.style.display="none";

		o.lastMouseX	= e.clientX;
		o.lastMouseY	= e.clientY;

		if (o.hmode) {
			if (o.minX != null)	o.minMouseX	= e.clientX - x + o.minX;
			if (o.maxX != null)	o.maxMouseX	= o.minMouseX + o.maxX - o.minX;
		} else {
			if (o.minX != null) o.maxMouseX = -o.minX + e.clientX + x;
			if (o.maxX != null) o.minMouseX = -o.maxX + e.clientX + x;
		}

		if (o.vmode) {
			if (o.minY != null)	o.minMouseY	= e.clientY - y + o.minY;
			if (o.maxY != null)	o.maxMouseY	= o.minMouseY + o.maxY - o.minY;
		} else {
			if (o.minY != null) o.maxMouseY = -o.minY + e.clientY + y;
			if (o.maxY != null) o.minMouseY = -o.maxY + e.clientY + y;
		}

		Inq.Drag.doc.onmousemove	= Inq.Drag.drag;
		Inq.Drag.doc.onmouseup		= Inq.Drag.end;

		return false;
	};
	
	this.drag = function(e) {
		e = Inq.Drag.fixE(e);
		var o = Inq.Drag.obj;

		var ey	= e.clientY;
		var ex	= e.clientX;
		var y = parseInt(o.vmode ? o.root.style.top  : o.root.style.bottom);
		var x = parseInt(o.hmode ? o.root.style.left : o.root.style.right );
		var nx, ny;

		if (o.minX != null) ex = o.hmode ? Math.max(ex, o.minMouseX) : Math.min(ex, o.maxMouseX);
		if (o.maxX != null) ex = o.hmode ? Math.min(ex, o.maxMouseX) : Math.max(ex, o.minMouseX);
		if (o.minY != null) ey = o.vmode ? Math.max(ey, o.minMouseY) : Math.min(ey, o.maxMouseY);
		if (o.maxY != null) ey = o.vmode ? Math.min(ey, o.maxMouseY) : Math.max(ey, o.minMouseY);

		nx = x + ((ex - o.lastMouseX) * (o.hmode ? 1 : -1));
		ny = y + ((ey - o.lastMouseY) * (o.vmode ? 1 : -1));

		if (o.xMapper)
			nx = o.xMapper(y);
		else if (o.yMapper)
			ny = o.yMapper(x);

		Inq.Drag.obj.style[o.hmode ? "left" : "right"] = nx + "px";
		Inq.Drag.obj.style[o.vmode ? "top" : "bottom"] = ny + "px";
		Inq.Drag.obj.root.style[o.hmode ? "left" : "right"] = nx + "px";
		Inq.Drag.obj.root.style[o.vmode ? "top" : "bottom"] = ny + "px";
		Inq.Drag.obj.lastMouseX	= ex;
		Inq.Drag.obj.lastMouseY	= ey;

		Inq.Drag.obj.root.onDrag(nx, ny);
		return false;
	};
	
	this.end = function() {
		Inq.Drag.doc.onmousemove = null;
		Inq.Drag.doc.onmouseup   = null;
		var newLeft = parseInt(Inq.Drag.obj.root.style["left"]);
		var newTop  = parseInt(Inq.Drag.obj.root.style["top"]);						
		Inq.Drag.obj.root.onDragEnd(parseInt(Inq.Drag.obj.root.style[Inq.Drag.obj.hmode ? "left" : "right"]),
									parseInt(Inq.Drag.obj.root.style[Inq.Drag.obj.vmode ? "top" : "bottom"]));
		Inq.Drag.obj = null;
		if (Application)
			Application.MoveStage(newLeft,newTop);			
	};
	
	this.fixE = function(e)	{
		if (typeof e == 'undefined') e = Inq.Drag.win.event;
		if (typeof e.layerX == 'undefined') e.layerX = e.offsetX;
		if (typeof e.layerY == 'undefined') e.layerY = e.offsetY;
		return e;
	};
}

	function SurveyMgr(surveyDataMap){
		var surveyURL = urls.baseURL + "/survey/genericSurvey.do";
		this._observable();
		this.defaultWindowSpec = "statusbar=0, scrollbars=1, resizable=1, toolbar=0, menubar=0, copyhistory=0";
		this.poppedWindows = {};
		function getAltSurveyURL(data, rule){
			try{
				var brName = BRM.getRuleById(CHM.getLastChat().brID).getName();
			}catch(err){brName = "NO BR Name Available";}
			return ROM.composeURL(data.altURL, {
					chatID: CHM.getChatID(), 
					agentID: CHM.getAgentID(), 
					clientID: siteID, 
					BRName: brName, 
					custID: Inq.custID,
					businessUnitID: data.businessUnitID,
					sessionID: data.sessionID,
					stage: data.stage,
					incAssignmentID: data.incAssignmentID,
					siteID: data.siteID,
					surveyContent: data.surveyContent					
					});
		}
		function composeURL(url, data){
			return ROM.composeURL(url, data);
		}

		/**
		 * Pops out a window with given window specs, window name, URI resource info and url param data.
		 * @param webResourceID {String} The ID of the web resource to use as content for the window to display. Required.
		 * If null or undefined, will return with no action. (log error)
		 * @param winName {String} the name of the window to use in creating or referring. Required. If null or undefined,
		 * no action will be taken and an error will be logged to console.
		 * @param data {Object} Optional param for the placement of data onto the URL as parameters.
		 * @param winSpecData {String} Optional string param that may contain name-value pairs that specify the
		 * size/location etc of the window. @see http://www.w3schools.com/jsref/met_win_open.asp under "specs" for complete
		 * of supported specs here.
		 */
		this.popwindow = function(webResourceID, winName, data, winSpecDataStr){
			var webResource = resources[webResourceID];

			if(!!webResource){
				if(!!winName){
					if(webResource.method=="POST"){
						try {
							var lwin = this.poppedWindows[winName] = win.open("", winName, winSpecDataStr);
							var div = lwin.document.createElement("div");
							var formName = "TCSurveyWin"+(SurveyMgr.IDX++);
							var formStr = "<form id='"+formName+"' name='"+formName+"' action='"+webResource.url+"' method='POST' target='"+winName+"'>\n";
							for(var name in data){
								if(typeof data[name]=="function") continue;
								formStr += ("\t<input type='hidden' id='"+name+"' name='"+name+"' value='"+data[name]+"'>\n");
							}
							formStr += "</form>";
							div.style.cssText="position:absolute;top:0px;left:0px;width:1px;height:1px;";
							div.innerHTML = formStr;
							lwin.document.body.appendChild(div);
							div.firstChild.submit();
						} catch (e) {
							log(e);
						}
						lwin.document.removeChild(div);
					}else{
						this.poppedWindows[winName] = win.open(
							ROM.composeURL(webResource.url, data),
							winName,
							!!winSpecDataStr?winSpecDataStr:this.defaultWindowSpec
						);
					}
				}
				else{
					log("Popout Window Error: winName is required but not provided.");
				}
			}else{
				log("Popout Window Error: Web resource not found for popout window for resource ID = "+webResourceID);
			}
		};

		this.showSurvey = function(surveySpecID, rule, surveyData){
			var data = surveyDataMap[surveySpecID];
			if(data){
				try {
					var lastChat = CHM.getLastChat();
					var logData = null;
					if (!!lastChat) {
						logData = {
								_domain: "chat",
								evt: "surveyPresented",
								siteID: Inq.getSiteID(),
								businessUnitID: rule.getBusinessUnitID(),
								chatID: lastChat.id,
								customerID: Inq.getCustID(),
								sessionID: getSessionID(),
								incAssignmentID: getIncAssignmentID(),
								stage: "post-chat",
								surveyID: surveySpecID
						};
                        if (lastChat.svyPrms) {
                            MixIns.mixAbsorber(logData);
                            logData.absorb(lastChat.svyPrms);
                        }
						ROM.send(urls.logDataURL, logData);
						data["customerID"] = logData.customerID;
						data["businessUnitID"] = logData.businessUnitID;
						data["sessionID"] = logData.sessionID;
						data["stage"] = logData.stage;
						data["incAssignmentID"] = logData.incAssignmentID;
						data["siteID"] = logData.siteID;
						data["surveyContent"] = "";
                        data["ClientID"] = logData.siteID;
                        data["chatID"] = logData.chatID;
                        data["override"] = 1;
                        data["custID"] = data.customerID;

                        if (lastChat.svyPrms) {
                            MixIns.mixAbsorber(data);
                            data.absorb(lastChat.svyPrms);
                        }
					}
					var surveyWin = win.open(
							(data.altURL.length>0)?getAltSurveyURL(data, rule):ROM.composeURL(surveyURL, data),
							'SurveyWindow',
							('top=' + (data.y?data.y:0) + ', left=' + (data.x?data.x:0) + ', statusbar=0, menubar=0, scrollbars=1, resizable=1, toolbar=0, copyhistory=0, width='+(data.w?data.w:0)+', height='+(data.h?data.h:0))
						);	
					// Removed for now... this conflicts with program rules survey launches and custom events.
					// TODO: decide on an implementation for survey events: custom event or native implementation in survey mgr.
//					if(!!surveyWin){
//						this.fireSurveyLaunched(lastChat);
//					}
				} catch (e) {
					log(e);
				}
			}
			else{
				log("Survey Error: no survey spec found. surveySpecID="+surveySpecID);
			}
		};		
	}
	MixIns.prepare(SurveyMgr).mixIn(MixIns.Observable).mixIn(MixIns.Absorber);
	SurveyMgr.IDX = 0;
	SurveyMgr.prototype.isListener = function(l){
		return (!!l && (l.onSurveyLaunchEvent || l.fireSurveySubmitted));
	};

	SurveyMgr.prototype.fireSurveyLaunched = function(chatdata, _src){
		var evt = MixIns.mixAbsorber({id:++this.evtIdx, evtType:this.TYPES.SLAUNCHED, timestamp:new Date(), src:_src});
		evt.absorb({chatID:chatdata.chatID, ruleID:chatdata.ruleID, customerID:mockCustID});
		this._fireEvt(
			function(l, evt){
				if(typeof l.onSurveyLaunchEvent=="function") l.onSurveyLaunchEvent(evt);
			},
			evt
		);
	};
	SurveyMgr.prototype.fireSurveySubmitted = function(chatdata, _src){
		// Not used right now
//		var evt = MixIns.mixAbsorber({evtType:SurveyMgr.TYPES.SSUBMIT, timestamp:new Date(), src:_src});
//		evt.absorb(chatdata);
//		this._fireEvt(
//			function(l, evt){
//				if(typeof l.onSurveySubmitEvent=="function")
//					l.onSurveySubmitEvent(evt);
//			},
//			evt
//		);
	};
	SurveyMgr.prototype.TYPES = SurveyMgr.TYPES = {SLAUNCHED:"SLAUNCHED", SSUBMIT:"SSUBMIT"};

	/**
	 * The API object will consolidate our customers external use of our framework into a unified API
	 * All customer access should eventually be through this access object.
	 * @param pageID
	 * @param dat
	 * @see LandingMgr#init
	 */
	function reinitChat(pageID, dat){
		var data = ((dat && dat.constructor == String)?MixIns.JSON.parse(dat):dat);
		if(pageID && pageID > 0){
			if(!CHM.isPersistentWindow()){
				/* If we are passing in data, we want to set it globally so data pass rules may pick it up */
				if(data){
					if(data['pass']){
						win.inqData = data['pass']; //BR30 uses "pass" as data pass reference...
					}
					else if(data['data']){
						win.inqData = data['data']; //BR20 uses "data" as data pass reference.
					}
				}
				if(data && data.sale){
					var s = data.sale;
					var w = win;
					w.inqSalesProducts = s.products;
					w.inqSalesPrices = s.prices;
					w.inqSalesQuantities = s.quantities;
					w.inqTestOrder = s.test;
					w.inqClientOrderNum = s.ordernum;
					w.inqClientTimeStamp = s.timestamp;
					w.inqCustomerName = s.customerName;
					w.inqOtherInfo = s.otherInfo;
				}
				if(CHM.isChatInProgress()){
					/* if a chat is in progress, reinitializing is very touchy as chats are stateful.
						The best thing to do is to replay page landing events after resetting the page
						to the "new" pageID */
					Inq.overridePageID=pageID;
					LDM.init(true);
					LDM.start();
				}else{
					win.inqSiteID = pageID;
					C2CM.reset();
					CHM.reset();
					win.v3Lander.reload();
				}
			}
		}
	}

	function launchChatNowByPageID(ruleID){
		// find chat rule in BR object
		var rule = BRM.getRuleById(ruleID);
		if(rule != null) {
			EVM.fireManualInvocationEvent(rule);
		}
	}

	function launchChatNow(ruleName){
		// find chat rule in BR object
		var rule = BRM.getRuleByName(ruleName);
		if(rule != null) {
			EVM.fireManualInvocationEvent(rule);
		}
	}

	function setChatSuppressedForSession() {
		Inq.blockService("ALL", 0); // -1 forever, 0 session, >0 other duration
	}

	function blockChat( scope ){
		switch( scope ){
			case "page":
				break;
			case "session":
				Inq.blockService("ALL", 0); // -1 forever, 0 session, >0 other duration
				break;
			default:
				break;
		}
	}

	function getSaleID(){
		var chatID = -1;
		try{
			if( !!CHM.getChatID() )
				chatID = CHM.getChatID();
		}catch(err){
			chatID = -1;
		}
		return chatID;
	}

	function showClickToCallHtml(index, html){
		C2CM.getC2C(index).showClickToCallHtml(html);
	}

	/**
	 * Returns data from the data managers for the IJSF.
	 * @public
	 * @return {dict} map of data objects keyed by object ID
	 * @see exposeCustomerApi
	 */
	function getData(){
		return getMgrData(mgrList);
	}

	/**
	 * provides API data to external caller. Helper
	 * @private
	 * @param list {Array} Array of objects that possibly support the DataExporter interface.
	 * @see getData
	 * @return {dict} map of data objects keyed by object ID
	 */
	function getMgrData(list){
		var retval = {};
		for(var idx=0; idx<list.length; idx++){
			var mgr = list[idx];
			if( !!mgr.getData && typeof mgr.getData == "function"){
				retval[mgr.getID()] = mgr.getData(); // get standard data
			}
		}
		return retval;
	}

	/**
	 * Publishes public API calls for Inq. Ideally this would be the only place to publish such functions but
	 * LandingFramework.jsp breaks encapsulation many times over.
	 */
	function exposeCustomerApi() {
		var win = window.parent;
		if(isNullOrUndefined(win.Inq)) {
			win.Inq = {};
			win.Inq.SaleMgr= {};
		}
		win.Inq.launchChatNowByPageID = launchChatNowByPageID;
		win.Inq.launchChatNow         = launchChatNow;
		win.Inq.setChatSupressedForSession  = setChatSuppressedForSession;
		win.Inq.setChatSuppressedForSession = setChatSuppressedForSession;
		win.Inq.blockChat  = blockChat;
		win.Inq.reinitChat = reinitChat;
		win.Inq.reinit     = reinitChat;
		win.Inq.SaleMgr = {getSaleID: getSaleID, getChatID: getSaleID};
		win.Inq.showClickToCallHtml = showClickToCallHtml;
		win.Inq.fireCustomEvent = fireCustomEvent;
		win.Inq.getData = getData;
	}


function CG(includeIds, includeCGIds, includeURLFunction, excludeIds, excludeCGIds, excludeURLFunction) {
    /* lookup table... fast lookup */
    var _lut = {};
    var _includeIds = includeIds ? includeIds : [];
    var _includeCGIds = includeCGIds ? includeCGIds : [];
    var _includeURLFunction = includeURLFunction;


    var _excludeIds =  excludeIds ? excludeIds : [];
    var _excludeIdQuick = {};
    var _excludeURLFunction = excludeURLFunction;
    var _excludeCGIds =  excludeCGIds ? excludeCGIds : [];
    this.length = _includeIds.length;

    for (var idx = 0; idx < _includeIds.length; idx++) {
        _lut[_includeIds[idx]] = _includeIds[idx]; /* populate lookup table */
    }

    for (var i = 0; i < _excludeIds.length; i++) {
        _excludeIdQuick[_excludeIds[i]] = _excludeIds[i]; /* populate lookup table */
    }

    /**
     * check: is current CG contain (pgId + url)
     * @param pgID page id
     * @param url page url
     * @param contentGroups array of cg (to check include/ exclude CG ids)
     * @return true if current CG contains (pgId + url)
     */
   this.contains = function(pgID, url, contentGroups) {
        /* check excluded ids */
        if (typeof _excludeIdQuick[pgID]=='number') {
            return false;
        }

        /* check excluded groups */
        if (this.isInCGList(_excludeCGIds, pgID, url, contentGroups)) {
            return false;
        }

        /* check excluded URLs */
        if (url && _excludeURLFunction && _excludeURLFunction(url)) {
            return false;
        }

        /* check included ids */
        if (typeof _lut[pgID]=='number') { /* fast lookup O(log n) for JS hashes (instead of iterating through list) */
            return true;
        }
        /* check included group ids */
        if (this.isInCGList(_includeCGIds, pgID, url, contentGroups)) {
            return true;
        }
        /* check included url; */
        return url && _includeURLFunction && _includeURLFunction(url);
    };

    /**
     * check is cgList contain  (pgID, url)
     * @param cgList list of CG
     * @param pgID page id
     * @param url page url
     * @param contentGroups all CG
     * @return true if (pgId + url) are in cgList 
     */
    this.isInCGList = function(cgList, pgID, url, contentGroups) {
        for (var i = 0; i < cgList.length; i ++) {
            var cg = contentGroups[cgList[i]];
            if (!cg) {
                continue;
            }
            if (cg.contains(pgID, url, contentGroups)) {
                return true;
            }
        }
        return false;

    }
}

	function CallRemote(callback){
		this.absorb(callback);
	}
	MixIns.prepare(CallRemote).mixIn(MixIns.Absorber).mixIn(MixIns.RemoteCaller).mixIn(MixIns.JSON);
	CallRemote.create = function(callback){
		return new CallRemote(callback);
	};
	CallRemote.prototype.onRemoteCallback = function(dstr){
		var data = this.parse(dstr);
		this.doCallbackActions(data);
	}
	/**
	 * Class is a wrapper for the launching of services and data pass as an encapsulation.
	 * @class 
	 * @param d data consisting of {
	 * @param {Object} rule rule for the launch context.
	 * @param {String} serviceType service string identifier
	 * @param {function} onAgentAssigned optional agent
	 */
	function ServiceLauncher(d){
		this.absorb(d);
		this.data = d; // we keep this around to use as an anonymous listener if needed
	}
	MixIns.prepare(ServiceLauncher).mixIn(MixIns.Absorber);
	/**
	 * Factory method.
	 */
	ServiceLauncher.c = function(data){
		return new ServiceLauncher(data);
	};
	/**
	 * Method that kick starts the service launch via chat manager.
	 */
	ServiceLauncher.prototype.request = function(){
		if(this.data.onAgentAssigned)
			EVM.addListener(this.data); // use as anonymous listener to send data as necessary

        if(this.flashvarFcn) {
            CHM.registerFlashvarFcn(this.flashvarFcn);
        }

		// INVEST-346 "All Clients are recieining Agent 0 again on Agent Conversion report for sales"
		// show-conversive may specify agent that should be attributed for sale
		if (this.data.agtid) this.chatSpec.aid = this.data.agtid;

		CHM.request(this.rule, this.chatType, this.chatSpec);
	};
	

	function DFV(i, f, v){
		this.id = i;
		this.f = f;
		this.v = v;
	}
	DFV.c = function(i,f,v){
		return new DFV(i,f,v);
	};
	
	DFV.prototype.toString = function(dflt){
		var o = dflt;
		try{
			var o = safe("("+this.f.toString()+")()",{});
		}catch(err){
			log("DFV ["+this.id+"] execution failed:" + err);
		}
		var template = this.v;
		for(var name in o){
			var s = o[name];
			template = template.replace("${"+name+"}", s);
		}
		return template;
	};
/**
 * ...
 * @author fpinn@touchcommerce.com
 */

window.XFormsLoader = function(){

	/**
	 * Logs to console. If Inq.log is available, use it to honor our javascript logging settings.
	 * Otherwise, log directly to console.
	 * @param text text to log
	 */
	function log(text){
		if (Inq && Inq.log) {
			Inq.log("XF: " + text);
		} else if (window.console) {
			window.console.log("XF: " + text);
		}
	}

	/**
	 * Convenience method to log errors.
	 * @param e error to log
	 * @returns fn function for convenient logging of extra values
	 */
	function logError(e){
		log("Error: " + e.message);
		if (e.origin) {
			log("   at " + e.origin);
		} else if (logError.caller != null) {
			log("   at " + logError.caller.toString().split("{")[0]);
		}
		return function(value) {
			log("   trace:[" + value + "]")
		};
	}

	var XFormsLoader = function(){
		var headerData = {};
		this._xhr;
		this._dtid;
		this._jsid;
		this._source;
		this._xframe;
		this.index = XFormsLoader.instances.length ;
		XFormsLoader.instances.push(this);		/* Save this instance in array to ensure scoping and to ensure that instance is not removed by Garbage Collector before we are finished */

		/**
		 * Build query string for request from the headerData structure
		 *
		 * @param data headerData sctucture
		 * @returns query string
		 */
		function getQuery(data) {
			var query = "";
			try {
				for (var key in data) {
					query += ((query.length == 0) ? "?" : "&") + key + "=" + encodeURIComponent(data[key]);
				}
			} catch (e) {
				logError(e);
			}
			return query;
		}

		/**
		 * Creates new IFrame for XForm
		 * @param div container div where iframe is created
		 * @param url URL where div will be submitted later
		 * @param businessUnitID channel Id if update is required
		 * @param scrolling optional, controlling scrolbars for IFrame, default value is "no"
		 * @return newly created iframe
		 */
		this.createXFrame = function(div, url, businessUnitID, scrolling, data, overrideRule) {
			var automatonDataMap = PM.getVar("automatonDataMap");

            var chat = CHM.getChat();
            var rule = overrideRule ? overrideRule : (chat ? chat.getRule() : null);

            headerData = {
				// url is required for post to know where to go
				url: url,

				// data required for xFormExtensions to operate properly
				workerPath: "window.com.inq.flash.client.control.XFrameWorker",
				clientHtml: getHostedFileUrl(),

				// data for xforms
				_chatID: CHM.getChatID() ? CHM.getChatID() : "",
				_agentID: (CHM.getAgentID()) ? CHM.getAgentID() : "",
				_businessUnitID: (businessUnitID) ? businessUnitID : ((CHM.getChat()) ? CHM.getChat().getBusinessUnitID() : FP.getBusinessUnitID()),
				_siteID: Inq.getSiteID(),
				_customerID: Inq.getCustID(),
				_sessionID: FP.getSessionID(),
				_incAssignmentID: FP.getIncAssignmentID(),
				_clientPageURL: FP.getClientPageURL(),
				_pageMarker: LDM.getPageMarker(),
				_automatonDataMap: automatonDataMap ? automatonDataMap.getValue() : "",
				_pageID: LDM.getPageID(),
                _language: rule ? rule.getLanguage() : Inq.getDefaultLanguage(),
                _visitorAttributes: VAM.getCopyAsArray().join(";"),
                _brAttributes: rule ? rule.getRuleAttributesAsString() : "",
                _browserType: getClientBrowserType(),
                _browserVersion : getClientBrowserVersion(),
                _operatingSystemType : getOSType(),
                _deviceType : getDeviceType()
			};

            if (rule) {
                headerData._brName = rule.getName();
                headerData._brId = rule.getID();
            }

            for (var field in data) {
				if (!headerData[field]) { // do not populate if we have never value
					headerData[field] = data[field];
				}
			}

			var nameIFrame = encodeURIComponent(MixIns.JSON.stringify(headerData));
			if (!scrolling) scrolling = "no";
			div.innerHTML = '<IFRAME width="100%" height="100%" class="inqChatFoo" frameborder="0" scrolling="' + scrolling + '" ' +
				'name="' + nameIFrame + '" ></IFRAME>';

			this._xframe = div.getElementsByTagName("IFRAME")[0];
			this._xframe.headerData = headerData;

			if (url) {
				this._source = url;
				this._dtid = data.dtid;

				this.getJavaSessionId();
			}
			return this._xframe;
		};

		/**
		 * Asks server for JSESSIONID, if we have one, it validates the id
		 *		Upon completion the JSESSIONID is persisted if in IJSF
		 *		Then the xform is loaded.
		 * @return nothing
		 * @see obtainedSessionId
		 */
		this.getJavaSessionId = function(){
			try {
				if (window.top == window.parent && window == window.top.inqFrame) {		/* Ensure that we are in the IJSF */
					if (!XFormsLoader.jsidVar){
						XFormsLoader.staticInit();
					}
					var sessionId = XFormsLoader.jsid;
					XMLHttpRequestFacade.jsessionid = (!!sessionId) ? sessionId : null;
					this._xhr = new XMLHttpRequestFacade();
					this.registerInstance(this._xhr);

					var parts = this._source.split("/");				/* break the URL into parts, so we can extract the protocol and domain */
					var protocol = parts[0];							/* Index for the protocol is 0, format is protocol://domain/... */
					var domain = parts[2];								/* Index for the domain is 2, format is protocol://domain/... */
					var urlGetSessionId = protocol + "//" + domain + "/" + parts[3] + "/jsid/getSessionId";		/* the /jsid/getSession controller returns the java session id */
					this._xhr.open("GET", urlGetSessionId, true);		/* register the URL for retrieving the java session id */
					this._xhr.onreadystatechange  = function() {		/* register handler for retrieving the response from the server */
						var x = this;									/* Get the AJAX structure (x) */
						if (x.readyState == XMLHttpRequestFacade.DONE) {		/* Check to see if we are completed */
							var inst =  XFormsLoader.getInstance(x);	/* We hare complete, now retrieve this instance ... */
							inst.obtainedSessionId();					/* ... and process the java session id */
						}
					};
					this._xhr.send();
				} else {
					/* We are not in the IJSF, we are in the XFORMS frame, so we already have the JSID in the XMLHttpRequest.jsessionid */
					this.jsid = XMLHttpRequestFacade.jsessionid;
					this.loadForm();
				}
			} catch (e) {
				logError(e)("getJavaSessionId");
			}
		};

		/**
		 * Handles server response with session id. Persists JSESSIONID in IJSF and loads xform.
		 * This method is published because of the way loader calls it.
		 * @see getJavaSessionId - the caller
		 * @see loadForm - loads the form after we have the java session id
		 */
		this.obtainedSessionId = function() {
			this._xhr.onreadystatechange = null;			/* Turn off the checking of ready state change, we have what we want */
			var jSessionId = this._xhr.response;
			if (jSessionId.length > 0){						/* If we have a session id, then we must register it and persist it */
				XMLHttpRequestFacade.jsessionid = jSessionId;		/* Register the jsid, Tell the extended XHR that we have a session id for it to use */
				XFormsLoader.jsid = jSessionId;
				XFormsLoader.persistJsid();					/* Persist the id */
			}
			this.removeInstance(this._xhr);					/* Remove this instance from the XHR-Instance map */
			this.loadForm();								/* Load the form */
		};

		/**
		 * registerInstance: private
		 * we map instaces to XHRs (ajax request structure)
		 * we DO NOT overload the XHR because this is not allowed in IE
		 *		Note: in IE the XHR is an activeX object and cannot be prototyped or overloaded
		 * The map is static
		 * @param xhr - the XMLHttpRequest structure
		 * @return this
		 */
		this.registerInstance = function(xhr) {
			return XFormsLoader.mapXhr[xhr] = this ;
		};

		/**
		 * removeInstance: private
		 * Unmap instaces to XHRs (ajax request structure)
		 * we DO NOT overload the XHR because this is not allowed in IE
		 *		Note: in IE the XHR is an activeX object and cannot be prototyped or overloaded
		 * The map is static
		 * @param xhr - the XMLHttpRequest structure
		 * @return nothing
		 */
		this.removeInstance = function (xhr){
			try {
				XFormsLoader.mapXhr[xhr] = null;
				delete XFormsLoader.mapXhr[xhr];
			} catch (e) {
				logError(e)("removeInstance");
			}
		};

		/**
		 * loadForm: private
		 * load form via AJAX request
		 *		The form is read via AJAX and written into the document
		 *		Once the page is read, it is applied to the document via obtainedSourceHtml
		 * @return url with query string
		 * @see obtainedSourceHtml
		 */
		this.loadForm = function() {
			this._xhr = new XMLHttpRequestFacade();
			this.registerInstance(this._xhr);

			this._xhr.onreadystatechange = function() {		/* When the AJAX call changes state, analyse it */
				var xhr = this;								/* Get the AJAX structure (xhr) */
				if (xhr.readyState == XMLHttpRequestFacade.DONE) {	/* Check to see if we are completed */
					var inst =  XFormsLoader.getInstance(xhr);
					inst.obtainedSourceHtml();
				}
			};
			var url = this._source + getQuery(headerData);
			this._xframe["href"] = url;			/* Add the full url with query string so that the Xform Iframe can retrieve it */
			this._xhr.open("GET", url, true);	/* Tell xhr the name of the url to retreive */
			this._xhr.send();					/* And send it to the server */
			return false ;
		};

		/** fixDocumentRewriteBug - Fixes WebKit's peculiarity - it does not reset global variables when re-writing document.
		 *  Also fixes problem in IE, where when the document is rewritten, the domain is restored.
		 *    with subdomains this becomes a problem because the xfrorm cannot communicate with the IJSF or the CI (same origin policy)
		 *    To fix this we inject a document.domain setting in a script tag into the new document and this fixes the domain.
		 * @param html - string containing HTML to be modified and counterIncrement
		 * @param win - the xform iframe's content window
		 * @return corrected html string
		 */
		function fixDocumentRewriteBug(html, win) {
			/* The DOCUMENT_REWRITE_BUG global variable is necessary for detection of the WebKit's peculiarity. */
			try {
				win.DOCUMENT_REWRITE_BUG = true;
			} catch(e){
				logActionErr(e, this);
			}
			html = html.replace('</head>', '<script type="text/javascript">if (typeof DOCUMENT_REWRITE_BUG != "undefined") {top.inqFrame.Inq.FlashPeer.formsLoader.resetGlobalVars(window);}</script></head>');
			if(window.location.host != document.domain)
				html = html.replace(/(<\s*body\b[^>]*>)/gi, '\n$1\n<script type="text/javascript">try{document.domain=\"'+document.domain+'";}catch(er){};</script>\n');
			return html;
		}
		/** The above function fixDocumentRewriteBug is a function in scope to this object only and is not accessable to the unit tests
		 * We add the following to make this function accessible from the instance.
		 * BTW: this function was made as a function in the scope, so when onsubmit is caught in an anonymous function, we can access it, it would be in scope.
		 */
		this.fixDocumentRewriteBug = fixDocumentRewriteBug;	/* Make fixDocumentRewriteBug accessible via the object (needed for unit testing only */

		/** obtainedSourceHtml - We arrive here when we have the HTML received from the ORBEON forms server
		 *  The data is received via a XHR (XML Http Request) as a forms request and we put it into our blank document
		 *  The blank document is actually the client hosted file.
		 *		This is necessary in IE if we want to have an HTTPS request,
		 *		If we try using "://" or "about:blank" we get an awful message about mixing http/https
		 *
		 *  Once the file is loaded, it is safe to write the HTML.
		 */
		this.obtainedSourceHtml = function() {
			this._html = normalizeHtml(this._xhr.response, this._source);
			this._xframe["XFormsLoader"] = this;
			if (!this._xframe.src) {
				this._xframe.onload = function() {
					var ifrm = this;					/* Get the IFRAME */
					var inst =  ifrm["XFormsLoader"];	/* Get this instance of XFrame.hx */
					inst.writeObtainedHtml();
				};
				/* As we know by now, onload does not work in IE6 and IE7, we must check the status change*/
				this._xframe.onreadystatechange = function() {
					var ifrm = this;			/* Get the IFRAME */
					if (ifrm.readyState == "complete" || ifrm.readyState == "loaded") {
						var inst =  ifrm["XFormsLoader"];	/* Get this instance of XFrame.hx */
						inst.writeObtainedHtml();
					}
				};

				this._xframe.src = (window.location.href).split("?")[0]+"?BLNK";
			} else {
				this.writeObtainedHtml();
			}
		};

		/** writeObtainedHtml -
		 *	1)	Stop listeners,
		 *	2)	Get document
		 *	3)	Write the form
		 * @return nothing
		 * @see obtainedSourceHtml - caller
		 */
		this.writeObtainedHtml = function() {
			/* Reset the handlers */
			this._xframe.onreadystatechange = null;
			/* Stop listening to state change, we have what we want */
			this._xframe.onload = null;
			/* Don't need onload either */
			this._html = fixDocumentRewriteBug(this._html, this._xframe.contentWindow);
			if (this._xframe.contentDocument) {
				writeForm(this._xframe.contentDocument, this._html);
			} else if (this._xframe.contentWindow) {
				writeForm(this._xframe.contentWindow.document, this._html);
			} else {
				logError({origin: "writeObtainedHtml", message: "Target document not found"});
			}
		};

		/**
		 * Writes the form into the document
		 * @param doc to write
		 * @see writeObtainedHtml
		 */
		function writeForm(doc, html){
			doc.open();
			doc.write(html);
			doc.close();

			/* Now all our work is complete, we may destroy this instance */
			XFormsLoader.instances[this.index] = null;			/* Remove reference to this instance, Garbage Collector will remove */
			// TODO this is likely to cause problems as index of the following items is not updated
			XFormsLoader.instances.splice(this.index, 1);		/* remove item from array via splice */
		}

		/**
		 * Converts all urls into absolute form. This is necessary because we are NOT in the same domain as the document
		 * We are actually in the domain of the host client
		 * TODO in cbc.js we already have a similar convertToAbsoluteUrl and that one is covered with tests!
		 *
		 * @param html - string containing html
		 * @param source url for the html
		 * @return fixed html string
		 */
		function normalizeHtml(html, source) {
			var srcParts = source.split("/");
			var proto = srcParts[0];
			var domain = srcParts[2];
			srcParts.pop();
			var path = srcParts.join("/");

			var x  = new RegExp('(href|src|action)=\"((http://|https://|//|/|#){0,1}[^\"]*)\"', 'gi');
			var matches = html.match(x);
			/* The array elements for the above regular expression is as follows
			 * match item 0 -  the string in it's entirety
			 * match item 1 -  the ATTRIBUTE name, obtained from the pattern above (href|src|action)
			 * match item 2 -  this is the URL, obtained from the pattern ((javascript:|http://|https://|//|/){0,1}[^\"]*)
			 * match item 3 -  the PROTOCOL from the url, obtained from the pattern (javascript:|http://|https://|//|/)
			 * So the regexp has three match points as follows:
			 * (ATTRIBUTE)=((PROTOCOL)URL)
			 * Item 1 is the ATTRIBUTE
			 * Item 2 is the entire URL including the PROTOCOL
			 * Item 3 is the PROTOCOL only
			 */
			if (matches != null) {
				for (var ix=0; ix<matches.length;ix++) {
					var fix = matches[ix];
					x  = new RegExp('(href|src|action)=\"((javascript:|http://|https://|//|/|#){0,1}[^\"]*)\"', 'gi');
					var parts = x.exec(fix);
					if (parts != null) {
						var url;
						switch((parts[3]).toLowerCase()) {								// check match item #3, the PROTOCOL
							case "http://":
							case "https://":
							case "javascript:":
							case "#": url = parts[2]; break;							// The protocol is defined, set url to the entire URL (match item #2)
							case "//": url = proto + parts[2]; break;					// There is no protocol, add the protocol to the URL (match item #2)
							case "/": url = proto + "//" + domain + parts[2];break;		// There is no protocol or domain, add it to the URL (match item #2)
							default: url = path + "/" + parts[2]; break;
						}
						url = parts[1]+'=\"' + url + '\"';
						if (url != fix){
							html = html.replace(fix, url);
						}
					}
				}
			}
			return html;
		}

		this.fixFormSubmit = function(xwin, headerData) {

			function collectFormData(form) {
				var data = [];
				for (var i = 0; i < form.length; i++) {
					var child = form[i];
					if (child.nodeName == "INPUT" || child.nodeName == "BUTTON") {
						if (child.name) {
							data.push(encodeURIComponent(child.name) + "=" + encodeURIComponent(child.value));
						}
					}
				}
				return data.join("&");
			}

			/**
			 * This function is bound to a form and this = form
			 */
			function overrideSubmit() {
				var method = this.method.toUpperCase();
				var url = (headerData.srcurl) ? headerData.srcurl + "&cbust=" + Math.floor(Math.random() * 1000011) : this.action;
				var data = collectFormData(this);
				var callback = function() { // Call a function when the state changes.
					if (this.readyState == XMLHttpRequestFacade.DONE && this.status == 200) {
						this.onreadystatechange = null;
						var html = normalizeHtml(this.responseText, url);
						html = fixDocumentRewriteBug(html, xwin);
						writeForm(xwin.document, html);
					}
				};

				var xdr = new XMLHttpRequestFacade();

				if (method == "POST") {
					xdr.open(method, url, true);
					// Send the proper header information along with the request
					xdr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
					// TODO fix error messages for unsafe headers in chrome
					xdr.setRequestHeader("Content-Length", data.length);
					xdr.setRequestHeader("Connection", "keep-alive");
					xdr.onreadystatechange = callback;
					xdr.send(data);
				} else {
					xdr.open(method, url += "?" + data, true);
					xdr.onreadystatechange = callback;
					xdr.send();
				}
				return true;
			}

			var forms = xwin.document.getElementsByTagName("FORM");
			for (var i = 0; i < forms.length; i++) {
				forms[i].submit = overrideSubmit;
			}
		};

	};

	/**
	 * Static stuff
	 */
	XFormsLoader.instances = [];
	XFormsLoader.JSESSIONID = "ji";
	XFormsLoader.jsidVar=null;
	XFormsLoader.jsid=null;
	XFormsLoader.mapXhr = {};
	XFormsLoader.getInstance = function(xhr) {
		return XFormsLoader.mapXhr[xhr];
	};
	XFormsLoader.PMvar = null;
	XFormsLoader.persistJsid = function(){
		XFormsLoader.jsidVar.setValue(XFormsLoader.jsid);
	};

	/**
	 * Deletes global variables from a window scope.
	 * Necessary to overcome WebKit's peculiarity - it does not reset global variables when re-writing document. Other browsers do it.
	 */
	XFormsLoader.resetGlobalVars = function (win) {
		"use strict"; // in case we use "delete" operator here, it works differently in strict mode (throws an exception instead of returning "false")

		/** Returns window without custom properties. */
		function getCleanWindow(ijsfWin) {
			var cleanIFrame = ijsfWin.document.getElementById("cleanIFrame");
			if (!cleanIFrame) {
				cleanIFrame = ijsfWin.Inq.createHiddenIFrame("cleanIFrame");
				ijsfWin.document.body.appendChild(cleanIFrame);
			}
			var win = cleanIFrame.contentWindow;
			if (typeof win == "undefined" || win == null) {
				logError({message: "Failed to get clean window object"});
			}
			return win;
		}

		log("Resetting global variables to overcome WebKit's peculiarity");
		var cleanWindow = getCleanWindow(window);

        // Restore original XMLHttpRequest instance to avoid clobbering when reinitializing facade after cleanup
        if (win.XMLHttpRequestOriginal) {
            win.XMLHttpRequest = win.XMLHttpRequestOriginal;
            win.XMLHttpRequestOriginal = undefined;
        }

		for (var property in win) {
			if (win.hasOwnProperty(property) && typeof cleanWindow[property] == "undefined") { // is it a custom window property?
				try {
					// We set custom window's properties to undefined and
					// ensure that our code use [typeof window.foo != "undefined"] instead of  ["foo" in window] syntax,
					// because "delete window[property]" works only for specific window's properties.
					// For example, it cannot delete YAHOO variable, which prevents xformsPageLoadedServer() from running in Chrome 20 & 21.
					// Here is the article describing how "delete" operator works: http://perfectionkills.com/understanding-delete/
					win[property] = undefined;
				} catch (ex) {
					log("WARN: cannot delete global variable '" + property + "'");
				}
			}
		}
		if (typeof YAHOO != 'undefined') {
			logError({message: "Failed to delete the YAHOO global variable."});
		}
	};

	XFormsLoader.staticInit = function(){
		XFormsLoader.jsidVar = PM.getVar(XFormsLoader.JSESSIONID);
		if (!XFormsLoader.jsidVar){
			XFormsLoader.jsidVar = (new Variable(XFormsLoader.JSESSIONID, "", resources["session"]));
			XFormsLoader.jsidVar.init();
			XFormsLoader.jsidVar.getValue();
			PM.addVar(XFormsLoader.jsidVar);
		}
		XFormsLoader.jsid=XFormsLoader.jsidVar.getValue();
	};

	return XFormsLoader;

}();


	/**
	 * Cobrowse manager for framework.
	 * @class
	 * @constructor
	 * @borrows FrameworkModule#init as #init
	 * @see FrameworkModule
	 */
	function CobrowseMgr(id, config, cobrowseBannerText){
		this.cobrowseBannerText = cobrowseBannerText;
		this._frameworkModule(id);
        this._config = config;
	}
	
	MixIns.prepare(CobrowseMgr).mixIn(MixIns.FrameworkModule);
	
	/**
	 *  load - private function that loads the jQuery and the CBC (Co-Browse Client) javascript files
	 *		At completion of both loads then:
	 *		1) we initialize the cobrowse client
	 *		2) we set the cobrowse flag, stating that we are now using cobrowse
	 *		3) we then fire the optional handler (that was passed as an argument
	 * @param handler - function to be called after loading and initialization
	 */
	CobrowseMgr.prototype.load = function(handler) {
		if (CobrowseMgr.isSupported()) {
			var maskingConfig = this._config.cobrowseMaskingConfig;
			var isEmbeddedResource = this._config.isEmbeddedResource;
			var cobrowseBannerText = this.cobrowseBannerText;

			loadScript(urls.mediaRootURL, "/flash/jquery-1.7.2.js",  "/flash/jquery-1.7.2.min.js", function(greeting) {
				loadScript(urls.vanityURL, "/tagserver/cbc.js",  "/tagserver/cbc-min.js", function(greeting) {
					//we should not send updates from IE because it makes diff longer than generating new
					try {
						if (window["cobrowse"]) {
							window.cobrowse.initialize(maskingConfig, isEmbeddedResource, isIE(), cobrowseBannerText, CHM.isPersistentWindow());
						}
					} catch (e) {
						log("Cobrowse Initialization failed: " + e);
					}
					CHM.setCobrowseFlag(true);
					try {
						if (handler) {handler();}
					} catch (e) {
						log("Cobrowse load on demand failed: " + e);
					}
				}, handler);
			}, handler);
		}
	};
	
	/**
	 *  init - public function that that loads the cobrowse client system, if and only if:
	 *		1) we have enabled cobrowse on prior page visit
	 *		2) we have cobrowse enabled for this site
	 */
	CobrowseMgr.prototype.init = function() {
	/* In the near future, we will load the cobrowse code base on demand,
	 * At that time we will check to see if we have cobrowsed at init time as such
		if (CHM.getCobrowseFlag()){
			this.load();
		}
	 */
		this.load();
	};

	/**
	 *  runOnDemand - public function that that loads the cobrowse client system, if and only if it has not been loaded before
	 *		Its purpose is to load on demain.
	 *		When we accept any cobrowse invitation, we call this function
	 *	@see FlashPeer
	 *	@param handler - the method to be called on sucessful load and initialization of the cobrowse code base
	 */
	CobrowseMgr.prototype.runOnDemand = function(handler) {
		if (typeof (window.cobrowse) != "undefined"){
			handler();
		}
		else {
			this.load(handler);
		}
	};
		
    /**
        CobrowseMgr.isSupported
        return true if cobrowse is supported.
     */
    CobrowseMgr.isSupported = function() {
        var _isSupported = false;

        if ("Standard" === getDeviceType()) {
            _isSupported = true;
        }

        return _isSupported;
    };

	CobrowseMgr.prototype.start = function(){
		//place holder not used (defined by FrameworkModule).
	};
	
	CobrowseMgr.prototype.reset = function(){
		//place holder not used (defined by FrameworkModule).
    };
	



function AutomatonDT() {
}

    /**
     * add automaton's fields to data model
     * @param div automaton's div
     * @param dataToSend data model
     * @return names of selected checkboxes;
     */
    AutomatonDT.prototype.addDTEventFields = function (div, dataToSend) {
        var children = div.getElementsByTagName('input');
        var selectedCheckboxNames = [];
        for (var i = 0; i < children.length; i++) {
            var elem = children[i];
            if (elem.type == "checkbox") {
                dataToSend[elem.name] = "" + elem.checked;
                if (elem.checked) {
                    // save name of selected checkbox
                    selectedCheckboxNames[selectedCheckboxNames.length] = elem.name;
                }
            }
            else {
                dataToSend[elem.name] = "" + elem.value;
            }
        }
        return selectedCheckboxNames;
    };

    /**
    * Get answer text of clicked element (<a> or button)
    * @param button clicked element
    * @param div automaton's div
    */
    AutomatonDT.prototype.getAnswerText = function(button, div) {
        if (isNullOrUndefined(button)) {
            return null;
        }
        /* If we have an anchore, then get the innerHTML as the answer text
         * button.text does not exist for the link <A> on IE
         * innerHTML does on all targetted browsers.
         */                   
        if (button.nodeName == "A") {     
            return button.innerHTML;
        }
        if (!isNullOrUndefined(button.text)) {        
            return button.text;
        }

        if (!isNullOrUndefined(button.type)) {
            // button <input type='button'/>
            if (button.type == 'button') {
                // build answer like:
                // Submit ('Qwerty keyboard' 'email client' selected)
                // where:
                // Submit - button's name
                // 'Qwerty keyboard' 'email client' names of checked checkboxes
                var out = '';
                var children = div.getElementsByTagName('input');
                for (var i = 0; i < children.length; i++) {
                    var elem = children[i];
                    if (elem.type == "checkbox") {
                        if (elem.checked) {
                            if (out.length > 0) {
                                out +=" ";
                            }
                            out += "'" + elem.value + "'";
                        }
                    }
                }
                if (out.length == 0) {
                    out = "Nothing";
                }
                return  button.name + ' (' + out + ' selected)';
            }
        }
        return null;
    };
    /**
     * Send chat.automaton_response msg
     * @param eventName event name
     * @param button component with called this fuction
     * @param data parameters from chat.automaton_request msg
     */
    AutomatonDT.prototype.sendDTEvent = function (eventName, button, data) {
        try {
            /* define automaton's div */
            var div = document.getElementById(data.divId);

            var dataToSend = null;
            /* define automaton's data model */
            try {
                dataToSend = data.model;
            }
            catch (e) {
                log("sendDTEvent can't read data model " + e);
            }
            if (isNullOrUndefined(dataToSend)) {
                dataToSend = {};
            }
            /* read data only from parent component */
            var dataNode = button.parentNode;
            var selectedCheckboxNames = this.addDTEventFields(dataNode, dataToSend);

            // save element's name, it will be bold
            if (button) {
                data.selectedLinkName = button.name;
            }
            data.selectedCheckboxNames = selectedCheckboxNames;

            data.model = MixIns.JSON.stringify(dataToSend);

            var answerText = this.getAnswerText(button, div);
            if (answerText) {   
                data.answerText = answerText;
            }

            FP.sendDTEvent(eventName, data);
        }
        catch(e) {
            log("sendDTEvent error " + e);
        }
        return false;
    };

        /**
         * Singleton class that allows our exit chat to challenge customers before leaving a web page.
         * @class ExitConfirm is a singleton class that allows our exit chat to challenge customers before leaving a web page.
         */
        function ExitConfirm() {
            this._observable(); // contract with MixIn.Observable
            this.secondAttempt = false;
            this.enabled = false;
            this.masterEnabled = true;
            this.resetPromptTimer = '';
            this.USIdone = false;
            this.initialized = false;
            this._rule = null;
        }

        MixIns.prepare(ExitConfirm).mixIn(MixIns.Observable).mixIn(MixIns.RemoteCaller);

        ExitConfirm.prototype.isListener = function(l){
            return !!(l && ((l.onCancelExit && typeof l.onCancelExit == "function") ||
                (l.onBeforeExitConfirmation && typeof l.onBeforeExitConfirmation == "function")));
        };

        ExitConfirm.prototype.fireCancelExitEvent = function() {
            function f(l, evt) {
                try {
                    if (!!l.onCancelExit) {
                        l.onCancelExit(evt);
                    }
                } catch(e) {
                    log("Error firing event CancelExit on " + l.toString() + ":" + e);
                }
            }
			var event = {rule: this._rule};
            this._fireEvt(f, event);
        };

        ExitConfirm.prototype.onChatLaunched = function(evt) {
            this.setEnabled(false);
        };

        ExitConfirm.prototype.onChatClosed = function(evt) {
            this.setEnabled(true);
        };

        ExitConfirm.prototype.fireBeforeExitConfirmationEvent = function() {
            function f(l, evt) {
                try {
                    if (!!l.onBeforeExitConfirmation) {
                        l.onBeforeExitConfirmation(evt);
                    }
                } catch(e) {
                    log("Error firing event BeforeExitConfirmation on " + l.toString() + ":" + e);
                }
            }
			var event = {rule: this._rule};
            this._fireEvt(f, event);
        };

        ExitConfirm.prototype.tempDisable = function() {
            if (Inq.EC.isEnabled()) {
                Inq.EC.setEnabled(false);
                log('Exit Chat temporarily disabled');

                /* disable any existing timer */
                if(Inq.EC.resetPromptTimer != ''){
                    win.clearTimeout(Inq.EC.resetPromptTimer);
                }

                /* insert a timer to re-enable our exit chat after half a second if we are still on this page */
                Inq.EC.resetPromptTimer = win.setTimeout(Inq.EC.reEnable, 3000);
            }
        };

        ExitConfirm.prototype.disableExitChat = function() {
            Inq.EC.masterEnabled = false;
            return true;
        };

        ExitConfirm.prototype.reEnable = function() {
            if(!Inq.EC.USIdone) {
                Inq.EC.setEnabled(true);
            }
            Inq.EC.resetPromptTimer = '';
            log("re-enabled alert");
        };

        ExitConfirm.prototype.doActions = function(evt){
            /* IE only calls this when the user hits "cancel" in the onbeforeunload handler confirm dialog.
                FF will invoke this function regardless of user choice so we defer our ultimate actions
                for another second. The loaded race condition is that "if user proceeds to leave, the second wait
                is more than enough time to unload the document thus denying our timed invocation". If user cancels
                then our 1 sec wait is short enough to invoke our code (cancel was chosen). Either way... we wait 1 more second to
                weigh the race condition almost exclusively in favor of the "unload" when "ok" is confirmed to leave the page. */
            setTimeout(
                function(){
                    inqFrame.Inq.EC.fireCancelExitEvent();
                }
                , 1000
            );
        };

        ExitConfirm.prototype.doInit = function(rule, aTxt, image, cTxt, automatedAgent, businessUnitID,
                                                checkAgentAvailabilityInterval) {

            if (isServiceBlocked("POPUP")) {return;}
			this._rule = rule;

            var showImage = (image != null) && (isSafari() || isChrome());
            var imageWidth = 0;
            var imageHeight = 0;
            var imageElement;
            if (showImage) {
                imageElement = document.createElement("img");
                imageElement.src = urls.mediaSiteURL + '/images/' + image;
                imageElement.id = "ExitConfirmImage";
                imageElement.style.cssText = "position:absolute;top:0px;left:0px;"
                document.body.appendChild(imageElement); 
            }                

            /*
                automatedAgent should be true of false but when omitted it NOT be null or undef.
                if null or undef then it should be true so that an automated script acts as an agent
            */
            this._businessUnitID = businessUnitID;
            this._automatedAgent = ( !!automatedAgent === automatedAgent ? automatedAgent : !automatedAgent ) ;
            if(this._automatedAgent) {
                this.reEnable();
            } else {
                this.dataMap = {
                	buID: this._businessUnitID,
                    siteID: Inq.siteID,
                    brID: rule.id,
                    agentAttributes: rule.getAgentAttributes(),
                    ruleAttributes: rule.getRuleAttributes()
                };

                if (checkAgentAvailabilityInterval) {
                    this.runAgentCheckTimer(checkAgentAvailabilityInterval);
                } else {
                    this.callRemote(Inq.urls.agentsAvailabilityCheckURL, this.dataMap);
                }
            }
            win.document.documentElement.onmousedown = this.tempDisable;
            win.document.documentElement.onclick = this.tempDisable;
            win.document.documentElement.onkeypress = this.tempDisable;
            win.document.documentElement.onsubmit = this.disableExitChat;
            win.v3Lander.prepareBeforeUnload(aTxt, cTxt, this.doActions, showImage, imageElement);

            if(this.initialized)
                throw "Single Use Exception. Exit Confirmation may only be used once per page for rules. Check for redundant rules of this type.";
            this.rule = rule;
            this.initialized = true;
        };

        /**
         * Callback for agent availability check.
         * @param data JSON formatted string with boolean field "AA" (shorthand for Agents Available).
         * 	"AA" is true if agents are available (HOP are checked as well) or availability check is off, false otherwise.
         */
        ExitConfirm.prototype.onRemoteCallback = function(data){
            var jsonData = MixIns.JSON.parse(data);
            if (!isNullOrUndefined(jsonData) && !isNullOrUndefined(jsonData.AA) && !isNullOrUndefined(jsonData.inHOP)) {
                Inq.EC.setEnabled(jsonData.AA && jsonData.inHOP);
            }
        };

        ExitConfirm.prototype.update = function(evt) {
            this.USIdone = true;
            /* disable any existing timer */
            if(this.resetPromptTimer != '') {
                clearTimeout(this.resetPromptTimer);
            }

            /* Suppress exit dialogs if a chat is in progress or we have already chatted with lower or
            	the same funnel level. */
            var ruleFL = this._rule.getConstant("fl", rule);
            if(Inq.ChatMgr.isChatInProgress() || (ruleFL && ruleFL >= PM.getVar("cfl").getValue())) {
                this.setEnabled(false);
            }

            return((this.masterEnabled == true) && (this.enabled == true));
        };

        ExitConfirm.prototype.isEnabled = function() {
            return this.enabled;
        };

        ExitConfirm.prototype.setEnabled = function(b) {
            this.enabled = b;
        };

        /** Starts a timer that would check agent availability and enable or disable EC. */
        ExitConfirm.prototype.runAgentCheckTimer = function(interval) {
            Inq.EC.callRemote(Inq.urls.agentsAvailabilityCheckURL, Inq.EC.dataMap);
            var launchString = "Inq.EC.runAgentCheckTimer(" + interval + ")";
            setTimeout(launchString, interval);
        };

		/**
		 * Returns true if ExitConfirm was initialized.
		 */
		ExitConfirm.prototype.isInitialized = function() {
			return this.initialized;
		};
	/**
	 * @class ExitHook allows setting general purpose page exit hook firing onBeforeUnload event when user
	 * inteds to leave the page. Any rule may subscribe to this event to perform its actions on page exit.
	 */
	function ExitHook() {
		this._observable(); // contract with MixIn.Observable
		this.initialized = false;
		this._rule = null;
	}

	MixIns.prepare(ExitHook).mixIn(MixIns.Observable);

	ExitHook.prototype.isListener = function(l) {
		return !!(l && (l.onBeforeUnload && typeof l.onBeforeUnload == "function"));
	};

	ExitHook.prototype.fireBeforeUnloadEvent = function() {
		function f(l, evt) {
			try {
				if (!!l.onBeforeUnload) {
					l.onBeforeUnload(evt);
				}
			} catch(e) {
				log("Error firing event BeforeUnload on " + l.toString() + ":" + e);
			}
		}

		var event = {rule: this._rule};
		this._fireEvt(f, event);
	};

	ExitHook.prototype.doInit = function(rule) {
		this._rule = rule;
		win.v3Lander.prepareBeforeUnloadForEH();
		this.initialized = true;
	};

	/**
	 * Returns true if ExitHook was initialized.
	 */
	ExitHook.prototype.isInitialized = function() {
		return this.initialized;
	};
/**
	 * Visitor Attributes Manager
	 * @class
	 * @constructor
	 * @name VAMgr
	 * @param {Object} id.
	 * @param {Object} data containing the programm and business visitor attributes.
	 * @borrows Absorber#absorb as #absorb
	 * @borrows FrameworkModule#init as #init
	 * @borrows FrameworkModule#start as #start
	 * @borrows FrameworkModule#reset as #reset
	 * @see Absorber
	 * @see FrameworkModule
	 */
function VAMgr(id, data){
	this._frameworkModule(id);
	this.absorb(data); /* Includes all instantiated visitor attributes */
	this._varTable = {};
	this._bActionable = true; // used for incrementality control
	this.currentVisitorAttributes = {};
	this.banned = {};
	this.hashed = {};
	this.storedValues = new MapVariable("VA",new Array(),resources.state);
	this.allowDynamic = true;
	this.crc32map = {};

	/*
     * We need this function to store in cookies only hash codes of banned Visitor Attributes.
     * Reasons of this minimization are limitation on cookie size 4K and fact that
     * we send cookies in each request.
     * F.E.: VA.crc32("Noteworthy Content Groups") is y85vk4
     * P.S.: Since with a 32 bit hash value there are only about 4 billion possible hashes,
     * then if you throw enough strings in, then you will eventually find two that have the same hash value.
     * The probability that any two strings will have the same hash value is 1:4,294,967,296 (about 1 in four billion).
     * With a larger number of strings, the probability rises. Checking collisions on 300,000 unique string called from some random dump
     * of a dictionary gives about seven collisions.
     * @param {String} str String for which we calculate CRC32
     * @return string with CRC32 hash code
     * @type String
     */
	this.crc32 = function( str ) {
		if (!this.crc32map[str]) {
			var table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D";
			var crc = -1;
			var x = 0;
			var y = 0;
			for (var i = 0, iTop = str.length; i < iTop; i++) {
				y = ( crc ^ str.charCodeAt( i ) ) & 0xFF;
				x = "0x" + table.substr( y * 9, 8 );
				crc = ( crc >>> 8 ) ^ x;
			}
			crc = crc ^ (-1);
			if (crc < 0)
			{
				crc = 0xFFFFFFFF + crc + 1;
			}
			this.crc32map[str] = "a" + ((crc).toString(36));
		}
		return this.crc32map[str];
	};

	this.test = function(visitorAttributes) {
		var result = false;
		for (var a in visitorAttributes) {
			if (this.currentVisitorAttributes[a]) {
				result = true;
				if (visitorAttributes[a].values) {
					if (this.currentVisitorAttributes[a].values) {
						for (var valueChecking in visitorAttributes[a].values) {
							if (!this.currentVisitorAttributes[a].values[valueChecking]) {
								return false;
							}
						}
					} else {
						result = false;
					}
				}
			}
		}
		return result;
	};

	this.checkBanDuration = function(attributeName) {
		var attr;
		var expiry;
		if ((attr = this.businessVisitorAttributes[attributeName]) || (attr = this.programVisitorAttributes[attributeName])) {
			var b = this.banned[this.crc32(attributeName)];
			if (b) {
				var currentTime = new Date().getTime();
				expiry = parseInt(b.d,36)*1000;
				if (!isNullOrUndefined(b.d) && (expiry > 0) && (expiry < currentTime)) {
					delete this.banned[this.crc32(attributeName)];
					attr.banAll = false;
				} else {
					for (var bannedValue in b) {
						if (bannedValue != 'd') {
							expiry = parseInt(b[bannedValue].d,36)*1000;
							if ((expiry > 0) && (expiry < currentTime)) {
								delete b[bannedValue];
							}
						}
					}
				}
			}
		}
	};

	/*
     * We add visitorAttributes to currentVisitorAttributes if attribute name and value exist in PVA or BVA
     * and are not banned. For attributes with mutuallyExclusive = true we should have only one value.
     * For allowDynamic mode we can have values not mentioned in PVA or BVA.
     * So the way we store visitor attributes depends on allowDynamic flag, e.g.
     * {"j1rid2":["1kwdjcl"],"y85vk4":[]} for allowDynamic = false and
     * {"j1rid2":["ANY VALUE"],"y85vk4":[]} for allowDynamic = true.
     * We cannot minimize dynamic values by hash because we don't have them in PVA or BVA.
     * @see #save
     * @param {Object} visitorAttributes associative array
     * @return void
     */
	this.add = function(visitorAttributes) {
		for (var a in visitorAttributes) {
			if(typeof visitorAttributes[a]=="function") continue;
			var attr;
			var val = null;
			if ((attr = this.businessVisitorAttributes[a]) || (attr = this.programVisitorAttributes[a])) {
				this.checkBanDuration(a);
				if (!attr.banAll) {

					for (var valueAdding in visitorAttributes[a].values) {
						if(typeof visitorAttributes[a].values[valueAdding]=="function") 
							continue;
						if (((attr.values[valueAdding] && !this.allowDynamic) || this.allowDynamic) &&
								!(this.banned[this.crc32(a)] &&  this.banned[this.crc32(a)][this.crc32(valueAdding)])) {

							if (!this.currentVisitorAttributes[a] || attr.mutuallyExclusive) {
								this.currentVisitorAttributes[a] = {};
								this.hashed[this.crc32(a)] = [];
								this.currentVisitorAttributes[a].values = {};
							}
							this.currentVisitorAttributes[a].values[valueAdding] = true;

							if (this.allowDynamic) {
								val = valueAdding;
							} else {
								val = this.crc32(valueAdding);

							}

							// repeated addition protection
							if (!this.hashed[this.crc32(a)].contains(val)) {
								this.hashed[this.crc32(a)].append([val]);
							}
						}
					}
				}
			}
			if(!!val)
				this.logData("visitorAttributeAdded",a,this.getAttributeValues(a,visitorAttributes));
		}
		this.save();
	};

	this.remove = function(visitorAttributes, fromRemoveAll) {
		for (var a in visitorAttributes) {
			if(typeof visitorAttributes[a]=="function" || this.isMutuallyExclusiveAttribute(a)) continue;
			if (this.currentVisitorAttributes[a]) {
				var hasNoValues = true;
				for (var valueRemoving in visitorAttributes[a].values) {
					if(typeof visitorAttributes[a].values[valueRemoving]=="function") 
						continue;
					hasNoValues = false;
					if(this.currentVisitorAttributes[a].values[valueRemoving]) {
						delete this.currentVisitorAttributes[a].values[valueRemoving];

						var ind;
						if (this.allowDynamic) {
							ind = this.hashed[this.crc32(a)].indexOf(valueRemoving);
						} else {
							ind = this.hashed[this.crc32(a)].indexOf(this.crc32(valueRemoving));
						}
						this.hashed[this.crc32(a)].remove(ind);
					}
				}
				if (hasNoValues || fromRemoveAll) {
					delete this.currentVisitorAttributes[a];
					delete this.hashed[this.crc32(a)];
				}
			}
			this.logData("visitorAttributeRemoved",a,this.getAttributeValues(a,visitorAttributes));
		}
		this.save();
	};

	this.removeAll = function() {
		this.remove(this.currentVisitorAttributes, true);
	};

	/*
     * We store banned attributes as associative arrays of names and values hashes.
     * For each name and value we also store banning duration.
     * -1 means forever, others digits means time in seconds since midnight 1 January 1970 in 36 base number.
     * F.E.: {"j1rid2":{"d":-1,"1kwdjcl":{"d":-1}},"y85vk4":{"d":n6yt}}
     * @see #crc32
     * @param {Object} visitorAttributes associative array
     * @param {long} duration of banning action
     * @return void
     */
	this.ban = function(visitorAttributes, duration) {
		var sendlog = false;
		if (duration > 0) {
			duration = Math.ceil((new Date().getTime() + duration)/1000).toString(36);
		}
		for (var a in visitorAttributes) {
			if(typeof visitorAttributes[a]=="function" || this.isMutuallyExclusiveAttribute(a)) continue;
			var attr;
			var crc = this.crc32(a);
			if ((attr = this.businessVisitorAttributes[a]) || (attr = this.programVisitorAttributes[a])) {
				var banAll = true;
				if (visitorAttributes[a].values) {
					for (var valueBanning in visitorAttributes[a].values) {
						if(typeof visitorAttributes[a].values[valueBanning]=="function") 
							continue;
						banAll = false;
						if (this.allowDynamic || attr.values[valueBanning]) {
							if (this.currentVisitorAttributes[a] && this.currentVisitorAttributes[a].values && this.currentVisitorAttributes[a].values[valueBanning]) {
								delete this.currentVisitorAttributes[a].values[valueBanning];
								if (this.allowDynamic) {
									delete this.hashed[this.crc32(a)][valueBanning];
								} else {
									delete this.hashed[this.crc32(a)][this.crc32(valueBanning)];
								}
							}
							
							if(!this.banned[crc]) {
								this.banned[crc] = {};
							}
							// if any one attribute is not already banned then log it
							sendlog = true; 
							this.banned[crc][this.crc32(valueBanning)] = {
								"d":duration
							};
						}
					}
				}
				if (banAll) {
					sendlog = true;
					attr.banAll = true;
					delete this.currentVisitorAttributes[a];
					delete this.hashed[this.crc32(a)];
					this.banned[this.crc32(a)] = {
						"d":duration
					};
				}
			}
			if(sendlog)
				this.logData("visitorAttributeBanned",a,this.getAttributeValues(a,visitorAttributes));
		}
		this.save();
	};

	/*
     * We delete unbanned attributes from associative arrays of names and values hashes.
     * @see #ban
     * @param {Object} visitorAttributes associative array
     * @return void
     */
	this.unban = function(visitorAttributes) {
		for (var a in visitorAttributes) {
			if(typeof visitorAttributes[a]=="function" || this.isMutuallyExclusiveAttribute(a)) continue;
			var attr;
			if ((attr = this.businessVisitorAttributes[a]) || (attr = this.programVisitorAttributes[a])) {
				var unbanAll = true;
				if (visitorAttributes[a].values && this.banned[this.crc32(a)]) {
					for (var valueBanning in visitorAttributes[a].values) {
						if(typeof visitorAttributes[a].values[valueBanning]=="function") 
							continue;
						delete this.banned[this.crc32(a)][this.crc32(valueBanning)];
						unbanAll = false;
					}
				}
                if (!unbanAll) {
                    unbanAll = true; 
                    for (var bannedValue in this.banned[this.crc32(a)]) {
                        if (bannedValue != "d") {
                            unbanAll = false; 
                            break;
                        }
                    }
                }
				if (unbanAll) {
					attr.banAll = false;
					delete this.banned[this.crc32(a)];
				}
			}
			this.logData("visitorAttributeUnbanned",a,this.getAttributeValues(a,visitorAttributes));
		}
		this.save();
	};

	this.initBanned = function(visitorAttributes) {
		for(var a in visitorAttributes) {
			var attr = visitorAttributes[a];
			var crc = this.crc32(a);
			if(this.banned[crc]) {
				var banAll = true;
				for(var tmp in this.banned[crc]) {
					if (tmp != "d") {
						banAll = false;
						break;
					}
				}
				if (banAll) {
					attr.banAll = true;
				}
			}
		}
	};

	this.initHashed = function(visitorAttributes) {
		for(var a in visitorAttributes) {
			var attr = visitorAttributes[a];
			var crc = this.crc32(a);
			if(this.hashed[crc]) {
				this.currentVisitorAttributes[a] = {};
				this.currentVisitorAttributes[a].values = {};
				if (this.hashed[crc].length) {
					if (this.allowDynamic) {
						for(var i = 0; i < this.hashed[crc].length; i++) {
							valueAdding = this.hashed[crc][i];
							this.currentVisitorAttributes[a].values[valueAdding] = true;
						}
					} else {
						for (var valueAdding in attr.values) {
							if (this.hashed[crc][this.crc32(valueAdding)]) {
								this.currentVisitorAttributes[a].values[valueAdding] = true;
							}
						}
					}
				}
			}
		}
	};

	this.init = function() {
	};

	/*
     * We using this function to get attribute values from some source.
     * It is needed for logging and in 'each' function.
     * @param {String} a Visitor Attribute name
     * @param {Object} source Visitor Attributes
     * @return Array
     * @return Array with Visitor Attribute  values from source
     * @type Array
     */
	this.getAttributeValues = function(a , source) {
		var values = [];
		if (source == null) {
			source = this.currentVisitorAttributes;
		}
		if (source[a]) {
			for(var value in source[a].values)  {
				values[values.length] = value;
			}
		}
		return values;
	};

	/*
     * We need this function to render current-visitor-attributes as ancecstor of abstract-map tag.
     * @return Object with functions 'keys','values','each','clear,'set','get'
     * @type Object
     */
	this.getCopyAsMap = function(){
		var copy ={
			currentVisitorAttributes : this.currentVisitorAttributes,
			/*
     * We need this function to render current-visitor-attributes as ancecstor of abstract-map tag.
     * So, we implementing keys method.
     */
			keys : function() {
				var keys = [];
				for(var a in this.currentVisitorAttributes) {
					keys[keys.length] = a;
				}
				return keys;
			},
			/*
     * We need this function to render current-visitor-attributes as ancecstor of abstract-map tag.
     * So, we implementing values method.
     */
			values : function() {
				var values = [];
				for(var a in this.currentVisitorAttributes) {
					values[values.length] = this.get(a);
				}
				return values;
			},
			/*
     * We need this function to render current-visitor-attributes as ancecstor of abstract-map tag.
     * So, we implementing each method.
     */
			each : function(func) {
				if (typeof func == "function") {
					for(var a in this.currentVisitorAttributes) {
						func(a,this.get(a),this);
					}
				}
			},
			/*
     * We need this function to render current-visitor-attributes as ancecstor of abstract-map tag.
     * So, we implementing clear method.
     */
			clear : function() {
			},
			/*
     * We need this function to render current-visitor-attributes as ancecstor of abstract-map tag.
     * So, we implementing set method.
     */
			set : function() {
			},
			/*
     * We need this function to render current-visitor-attributes as ancecstor of abstract-map tag.
     * So, we implementing get method.
     */
			get : function(key) {
				var values = [];
				var cVatt = this.currentVisitorAttributes[key];
				if(!!cVatt && !!cVatt.values){
					for(var value in cVatt.values)  {
						values[values.length] = value;
					}
				}
				return values;
			},
			/*
     * We need this function to render current-visitor-attributes as ancecstor of abstract-map tag.
     * So, we implementing unset method.
     */
			unset : function() {
			}
		};
		return copy;
	};

	this.start = function() {
	};

	this.reset = function() {
	};

	this.load = function() {
		if(this.storedValues.getValue() == null) {
			this.storedValues.init();
		} else {
			this.banned = this.storedValues.getValue().get("ban");
			if(this.banned) {
					this.initBanned(this.businessVisitorAttributes);
					this.initBanned(this.programVisitorAttributes);
			} else {
				this.banned = {};
			}
			this.hashed = this.storedValues.getValue().get("hash");
			if(this.hashed) {
				this.initHashed(this.businessVisitorAttributes);
				this.initHashed(this.programVisitorAttributes);
			} else {
				this.hashed = {};
			}
		}
	};

	this.save = function() {
		this.storedValues.set("hash",this.hashed);
		this.storedValues.set("ban",this.banned);
	};

	this.onDataReady = function() {
		this.load();
	};

	this.getPersistentId = function() {
		return this.getID();
	};

	/**
     * Returns copy of VAs as array "name=value(s)" pairs.
     * For multivalued VAs values are separated by commas.
     * Every name and value(s) of returned array may optionally be URL encoded, this may be usefull if returned value
     * will further be passed as part of URL.
     * @param urlEncodingRequired if true, return value will be URL encoded.
     */
	this.getCopyAsArray = function(urlEncodingRequired) {
		var tmp = new Array();
		for(var a in this.currentVisitorAttributes) {
			var va;
			if (urlEncodingRequired) {
				var values = this.getAttributeValues(a);
				var encodedValues = new Array(values.length);
				for(var i = 0; i < values.length; i++) {
					encodedValues[i] = encodeURIComponent(values[i]);
				}
				va = encodeURIComponent(encodeURIComponent(a) + ',' + encodedValues.join(','));
			} else {
				va = a + ',' + this.getAttributeValues(a).join(',');
			}
			tmp[tmp.length] = va;
		}
		return tmp;
	};

	this.logData = function(event,attribute,values) {
		ROM.send(urls.logDataURL,{
			_domain:"customer",
			evt:event,
			siteID: Inq.siteID,
			incAssignmentID: getIncAssignmentID(),
			sessionID: getSessionID(),
			customerID:Inq.getCustID(),
			atts:attribute?(attribute+","+values.join(",")):"",
			currentAtts:(this.getCopyAsArray().join(";"))
		});
	};

	this.testBanned = function(visitorAttribute) {
		var result = false;
		for (var a in visitorAttribute) {
			this.checkBanDuration(a);
			var attr = visitorAttribute[a];
			var crc = this.crc32(a);
			if(this.banned[crc]) {
				var banAll = true;
				for(var tmp in this.banned[crc]) {
					if (tmp != "d") {
						banAll = false;
						break;
					}
				}
				if (banAll) {
					result = true;
				} else {
					for (var valueBanning in attr.values) {
						if (this.banned[crc][this.crc32(valueBanning)]) {
							result = true;
							break;
						}
					}
				}
			}
		}
		return result;
	};

	this.toString=function(){
		return !!this.getCopyAsArray()?this.getCopyAsArray().toString():"";
	};

    this.isMutuallyExclusiveAttribute = function(attr){
        return attr == "mutuallyExclusive";
    };
};

MixIns.prepare(VAMgr).mixIn(MixIns.Persistable).mixIn(MixIns.FrameworkModule).mixIn(MixIns.Absorber);

	/**
	 * MessageMgr handles passing instructions between windows.  It
	 * abstracts us away from browser quirks and lets us set timeouts
	 * and have code evaluated in the desired window.
	 * 
	 * Create a new MessageMgr, and registers it as a listener for window
	 * messages.  Prevents bugs resulting from inconsistent state.
	 * HOWEVER, please note that
	 */
	function MessageMgr(w) {
		var self = this;
		this.window = (w) ? w : window;
		this.messageEnabled = this.enablePostMessage();
		if (this.messageEnabled) {
			try {
				this.window.addEventListener("message", function(message) {
					self.onMessage(message);
				});
			} catch (e) {
				log(e);
			}
		}
	}

    MessageMgr.prototype.enablePostMessage = function() {
		var deviceType = getDeviceType();
		return (deviceType === 'Phone' || deviceType === 'Tablet');
	}

    /**
	 * Eventually, this will be a list of available 'commands'
	 * that can be used with the MessageManager.
	 */
    MessageMgr.CMD_CLOSE_PERSISTENT = "CLOSE_PERSISTENT";

	/**
	 * Receives incoming messages and dispatches to setTimeout.  This
	 * method is registered as a callback in MessageMgr's constructor.
	 *
	 * @param message - Incoming window-level message
	 */
	MessageMgr.prototype.onMessage = function(message) {
		if (this.isSecure(message)) {
			// We're tunneling Message objects through the window's messages.
			// So, we need to pull out the json-ized messsage and turn it back
			// into a proper JS object.95
			switch (message.data) {	// the command is in the 'data' property of the incoming message.
			case MessageMgr.CMD_CLOSE_PERSISTENT:
				this.window.setTimeout("inqFrame.Inq.FlashPeer.CloseChatFromPersistent()", 0); // Spawn a new thread and exit.
				break;
			}
		}
		return true;
	}


    /**
	 * Security check to make sure that the messages we receive are 
	 * not malicious.
	 *
	 * @param message - message object from window
	 * @return - a Boolean indicating whether the message is secure.
	 */
    MessageMgr.prototype.isSecure = function(message) {
		var locs = this.getAuthorizedOrigins();
		var origin = this.parseUrl(message.origin);
		for (var i = 0; i < locs.length; i++) {
			var loc = this.parseUrl(locs[i]);
			if (loc.port == origin.port && loc.domain == origin.domain) {
				return true;
			}
		}

		return false;
	}

    /**
	 * Utility function to parse the protocol, domain, and port
	 * from a String URL.
	 */
    MessageMgr.prototype.parseUrl = function(string) {
		var m = string.match(/^(https?):\/\/([^\/:]+)(:?(\d*))/);
		var host = m[2];
		var domain = (host.indexOf('.') >= 0)	 // Sanity check.
			? host.split('.').slice(1).join('.') // Strip the host name.
			: host;								 // Default.
		return {
			protocol: m[1],
			domain: domain,
			port: (m[4] ? m[4] : 80)
		};
	}

    /**
	 * @return an array of Locaation objects with protocols, hosts,
	 * and ports of safe message origins.
	 */
    MessageMgr.prototype.getAuthorizedOrigins = function() {
		var locs = [];
		locs.push(this.window.location.href);
		locs.push(this.window.document.location.href);

		if (this.window.parent && (this.window.parent !== this.window)) {
			locs.push(this.window.parent.location.href);
			locs.push(this.window.parent.document.location.href);
		}

		if (this.window.opener) {
			locs.push(this.window.opener.location.href);
			locs.push(this.window.opener.document.location.href);
		}

		return locs;
	}
		
	/**
	 * Tell the target window that the persistent chat has closed.
	 *
	 * @param win - the window that should be told to close the persistent chat.
	 * @param targetHost (optional) - the expected host of the target window.
	 */
	MessageMgr.prototype.closePersistent = function(win, targetHost) {
		this.send(win, MessageMgr.CMD_CLOSE_PERSISTENT, targetHost);
	}
	

	/**
	 * Handles the actual packing and sending of the message, as well
	 * as outgoing security and data integrity checks. Abstracts other
	 * functions away from browser-specific considerations.
	 *
	 * @param win - the window to send the message to.
	 * @param command - the command to send.
	 * @param targetHost - the expected host of the target window.
	 */
    MessageMgr.prototype.send = function(win, command, targetHost) {
		if (!win) throw "Illegal argument: null 'win'";
		if (!command) throw "Illegal argument: null 'command'";
		var t = targetHost || "*"; // FIXME: Should this be required?
		if (this.messageEnabled) {		   
			win.postMessage(command, t);
		}
		else {
			win.Inq.MSG.onMessage({data: command, origin: this.window.location.href}) ;
		}
	}
	

	/**
	 * Public function
	 * API: Private function that returns the client window's IFRAME that launched the pop-out chat
	 * @param none
	 * @return window - the client window's IFRAME that launched the pop-out chat
	 */
	function getOpener(){ /* private function */
		var opener = null;
		if (isPersistentWindow()) {
			try {
				opener = (window.parent.opener && window.parent.opener.inqFrame)
						? window.parent.opener.inqFrame
						: ((window.opener) ? window.opener : null);
			} catch (e) {
				log("Error getting opener: " + e.message);
			}
		}
		return opener;
	};

	/**
	 * Public function
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

	/**
	 * Public function
	 *  formatArgument - Formats the argument into a somewhat readable format
	 * @param arg, is the object to be rendered readable
	 * @return string with the argument or argument description
	 */
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
			if (type=="(number)") type = ""+arg;
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

	
	function attachListener(elem,evtStr,fcn,d){
		if(elem.addEventListener){
			elem.addEventListener(evtStr,fcn,false);
		}else if(elem.attachEvent){
			elem.attachEvent(((d==1)?"":"on")+evtStr, fcn);
		}
	}

	function isSameOrigin() {
		try {
	        if(isPersistentWindow()){
	            if(window.parent.opener.Inq){ /**/
                    return true; /*note: in Chrome there is no exception is thrown and it always returns true, added additional check*/
                }else{
                    return false;
                }
            }
		}catch(err){
			return false;
		}
	}

	function getID() {
		return this._id;
	}

	function getCustID() {
		if (isNullOrUndefined(this.custID)) {
			// <customer-id/> is abstract-string thus returning string value here
			return "";
		} else {
			return this.custID;
		}
	}

	function getCustIP() {
		return this.custIP;
	}

	var siteID = 306;

	function getSiteID() {
		return siteID;
	}
		
	
	function getDefaultLanguage() {
		return "en";
	}

	function getSessionID() {
		var sesVar = PM.getVar("sesID");
		return sesVar ? sesVar.getValue() : "";
	}

	function getIncAssignmentID() {
		var incAssignmentID = PM.getVar("incID");
		return incAssignmentID ? incAssignmentID.getValue() : "";
	}

    
    function getDefaultBusinessUnitID() {
    	return 22;
	}
	
	function getDeviceType() {
			
		var deviceType = null;
		
		if( deviceType == null ) {
							deviceType = (/kindle|nook|android 2|ubuntu/i.test(navigator.userAgent.toLowerCase())) ? "Unsupported" : null;
		} 
		if( deviceType == null ) {
							deviceType = (/ipad|android 3|sch-i800|playbook|tablet|kindle|gt-p1000|gt-p5113|sgh-t849|shw-m180s|a510|a511|a100|dell streak|silk/i.test(navigator.userAgent.toLowerCase())) ? "Tablet" : null;
		} 
		if( deviceType == null ) {
							deviceType = (/iphone|ipod|android|blackberry|opera mini|opera mobi|skyfire|maemo|windows phone|palm|iemobile|symbian|symbianos|fennec|mobile/i.test(navigator.userAgent.toLowerCase())) ? "Phone" : null;
		} 
				
		if( deviceType == null ) {
			deviceType = "Standard";
		} 
				
		return deviceType;
	}
	
	
	function isDeviceType(type) {
		return type == getDeviceType();
	}

	
	var clntLag;

	
	function getClientTimeLag(){
		return clntLag;
	}

	
	var siteTzID = 'America/Los_Angeles';

	
	var siteTzOffset;

	
	function getSiteTZOffset() {
		return siteTzOffset;
	}

	
	function isTZRequestRequired() {
		if ((!isEmptyObject(businessSchedules) || !isEmptyObject(programSchedules)) && isNullOrUndefined(siteTzOffset))
			return true;
		else return false;
	}

	
	function isSchMet(scheduleId) {
		return (schedules[scheduleId] && schedules[scheduleId].isScheduleMet(
				new Date(), getClientTimeLag(), getSiteTZOffset()));
	}

	function processCustomerApiRegistry() {
		Inq.overridePageID = (!!win.inqSiteID) ? win.inqSiteID : -1;
		var registry = isNullOrUndefined(window.parent.InqRegistry) ? {} : window.parent.InqRegistry;

		// add all customer listeners
		var listeners = [];
		if(!isNullOrUndefined(registry.chatListeners)) {
			listeners.append(registry.chatListeners);
		}
		if(!isNullOrUndefined(registry.saleListeners)) {
			listeners.append(registry.saleListeners);
		}
		if(!isNullOrUndefined(registry.incrementalityListeners)) {
			listeners.append(registry.incrementalityListeners);
		}
		if(!isNullOrUndefined(registry.listeners)) {
			listeners.append(registry.listeners);
		}

		// add a flag to each listener so that Observables can limit what they send
		for(var x=0; x< listeners.length; x++) {
			listeners[x].custApi = true;
		}
		EVM.addListeners(listeners);

		// block services at customer request
		if(!isNullOrUndefined(registry.disableChat) && registry.disableChat == true) {
			blockService(CHM.CHAT_TYPES.POPUP, 0);
		}
		if(!isNullOrUndefined(registry.disableC2C) && registry.disableC2C == true) {
			blockService(CHM.CHAT_TYPES.C2C, 0);
		}
	}


	function initMgrs(mgrList) {
		PM.addVars(programVars);
		PM.addVars(businessVars);
		var table = BRM.getRuleVarTable();
		for(var ruleID in table){
			if( !!table[ruleID] ){
				PM.addVars(table[ruleID]);
			}
		}

		// call init on all mgrs
		for (var m in mgrList) {
			try {
				if(mgrList[m].init){
					mgrList[m].init();
				}
			} catch(e) {
				log(e);
				// just continue looping through all objects that have init methods
			}
		}
	}

	function startMgrs(mgrList) {
		// now start them all up
		for (var m in mgrList) {
			try {
				if (mgrList[m].start) {
					mgrList[m].start();
				}
			} catch(e) {
				log(e);
			}
		}
	}

	/**
	 * Iterate through the list of Mgr components within the Inq object,
	 * calling their start() methods. The start() method gives every component
	 * an opportunity to generate any events that are necessary
	 */
	function start() {
		if (!this.isFrameworkReady()) { return; } // start will be called later by a callback
		if(this.started) { return;};
		this.started = true;

		EVM.addObservables(mgrList);
		EVM.addObservables([EC]);
		EVM.addObservables([EH]);
		EVM.addListeners(mgrList);
		EVM.addListeners([EC]);
		EVM.addCustomEvents(programCustomEvents);
		EVM.addCustomEvents(businessCustomEvents);
		PM.fireDataReady(); // this must happen before the init/start calls on mgrs
		processCustomerApiRegistry();
		initMgrs(mgrList);

		// This call must be done after initialization of BRMgr to make sure rules triggers are already initialized.
		EVM.addListeners(BRM.getRules());

		startMgrs(mgrList);
	}

	function onDataReady(data) {
		if (this.dataReady) {return;}
		this.dataReady = true;
		this.load();
	}

	function load() {
		var vitalVar = new Variable(this.getID(), {}, resources["vital"]);
		var vitalData = vitalVar.getValue();
		if(vitalData) {
			if (vitalData.clntLag) {
				clntLag = vitalData.clntLag;
				delete vitalData.clntLag;
			}

			this.absorb(vitalData);
		}

		var siteTzOffsetVar = new Variable("siteTzOffset", null, resources["session"], "tzOf");
		siteTzOffset = siteTzOffsetVar.getValue();
	}

	function save() {
		var vitalVar = new Variable(this.getID(), {}, resources["vital"]);
		var vitalData = {
			custID: this.getCustID(),
			custIP: this.getCustIP()
		};
		if (getClientTimeLag()) vitalData.clntLag = getClientTimeLag();
		vitalVar.setValue(vitalData);

		if (!isNullOrUndefined(siteTzOffset)) {
			var siteTzOffsetVar = new Variable("siteTzOffset", 0, resources["session"], "tzOf");
			siteTzOffsetVar.setValue(siteTzOffset);
		}
	}

	function isDataReady() {
		return this.dataReady;
	}

	function setFrameworkData(data) {
		if (!isNullOrUndefined(data["siteTzOffset"])) {
			siteTzOffset = data["siteTzOffset"];
			delete data["siteTzOffset"];
		}

		this.absorb(data);

		
		if (data.serverTime) {
			clntLag = data.serverTime - (new Date()).getTime();

			
			if (Math.abs(clntLag) < 1000) clntLag = undefined;
		}

		this.save();
	}

	function getDFV(dfvID){
		return dfvs[dfvID];
	}

	function isThirdPartyCookiesEnabled(){
		return this.thirdPartyCookiesEnabled;
	}


	function isFrameworkReady() {
		var isReady = true;

		// do we have a valid customerID?
		var id = this.getCustID();
		if (isNullOrUndefined(id) || id == "" || id == "0") { isReady = false; }
		// check other criteria here
		// set isReady to false if a criteria isn't met
		return isReady;
	}

	/**
	 * Block a chat/call service for a specific duration
	 * @param serviceType one of ChatMgr.CHAT_TYPES
	 *  POPUP, POPUP_CALL, C2C, C2CALL
	 * @param duration period in ms or -1 for "forever", 0 for "visit" or "session"
	 */
	function blockService(serviceType, duration) {
		switch(serviceType) {
		case CHM.CHAT_TYPES.POPUP:
		case CHM.CHAT_TYPES.POPUP_CALL:
			CHM.blockService(serviceType, duration);
			break;
		case CHM.CHAT_TYPES.C2C:
		case CHM.CHAT_TYPES.C2CALL:
			C2CM.blockService(serviceType, duration);
			break;
		case "ALL":
			CHM.blockService(CHM.CHAT_TYPES.POPUP, duration);
			CHM.blockService(CHM.CHAT_TYPES.POPUP_CALL, duration);
			C2CM.blockService(CHM.CHAT_TYPES.C2C, duration);
			C2CM.blockService(CHM.CHAT_TYPES.C2CALL, duration);
			break;
		default:
			break;
		}
	}

	function blockServices(services, duration) {
		for(var service in services){
			blockService(services[service], duration);
		}
	}

	var rule = null;
	function getConstant(constantID, rule){
		if(rule){
			return rule.getConstant(constantID);
		}
		return constants[constantID];
	}

	function unblockServices(services) {
		for(var service in services){
			unblockService(services[service]);
		}
	}

	function unblockService(serviceType) {
		switch(serviceType) {
		case CHM.CHAT_TYPES.POPUP:
		case CHM.CHAT_TYPES.POPUP_CALL:
			CHM.unblockService(serviceType);
			break;
		case CHM.CHAT_TYPES.C2C:
		case CHM.CHAT_TYPES.C2CALL:
			C2CM.unblockService(serviceType);
			break;
		case "ALL":
			CHM.unblockService(CHM.CHAT_TYPES.POPUP);
			CHM.unblockService(CHM.CHAT_TYPES.POPUP_CALL);
			C2CM.unblockService(CHM.CHAT_TYPES.C2C);
			C2CM.unblockService(CHM.CHAT_TYPES.C2CALL);
			break;
		default:
			break;
		}
	}
	function doBusinessRuleActionList(actionId, rule, evt) {
		var action = BusinessRuleActionLists[actionId];
		if (!isNullOrUndefined(action)) {
			action(rule, evt);
		}
		else {
			log("Can't find BusinessRule Action List " + actionId);
		}
	}
	function doRuleActionList(actionId, rule, evt) {
		var action = RuleActionLists[actionId];
		if (!isNullOrUndefined(action)) {
			action(rule, evt);
		}
		else {
			log("Can't find Rule Action List " + actionId);
		}
	}
	function isServiceBlocked(serviceType) {
		switch(serviceType) {
			case CHM.CHAT_TYPES.POPUP:
			case CHM.CHAT_TYPES.POPUP_CALL:
				return CHM.isBlocked(serviceType);
			case CHM.CHAT_TYPES.C2C:
			case CHM.CHAT_TYPES.C2CALL:
				return C2CM.isBlocked(serviceType);
			case "ANY":
				return CHM.isAnyBlocked() || C2CM.isAnyBlocked();
			default:
				return false;
		}
	}

	function createFloatingDiv (_id, _x, _y, _w, _h){
		try{
			var obj=document.createElement('div');
			obj.style.position = "absolute";
			obj.style.width = _w?_w:0;
			obj.style.height = _h?_h:0;
			obj.style.left = _x?_x+"px":0;
			obj.style.top = _y?_y+"px":0;
			obj.style.zIndex = 99;
			obj.style.display = "none";
			obj.style.padding = 0;
			obj.style.margin = 0;
			obj.id = _id;
			document.getElementsByTagName("body")[0].appendChild(obj);
		} catch (E){
			this.debug("Could not create div element.");
		}
		return document.getElementById(_id);
	}

	function createHiddenIFrame(_id, _x, _y, _w, _h) {
		try {
			var obj = document.createElement('iframe');
			obj.style.position = "absolute";
			obj.style.width = _w ? _w : 0;
			obj.style.height = _h ? _h : 0;
			obj.style.left = _x ? _x + "px" : 0;
			obj.style.top = _y ? _y + "px" : 0;
			obj.style.zIndex = 99;
			obj.style.display = "none";
			obj.style.padding = 0;
			obj.style.margin = 0;
			obj.id = _id;
			obj.name = _id;
			return obj;
		} catch (E) {
			this.debug("Could not create div element.");
		}
		return null;
	}

	function wasSaleAction() {
		try {
			var par = PM.getVar("saleState", null).getValue();
			var con = getConstant("SALE_STATE_CONVERTED",null);
			return par == con;
		}
		catch (e) {

		}
	return false;
	}
	function  executeCustomCommand(params) {
		if(!isNullOrUndefined(params)) {
			try {
				// replace '({' to '{' , '})' to '}'
				params = params.replace(/\({/g, "{").replace(/}\)/g, "}");

				var inParams = MixIns.JSON.parse(params);
				var cmdType = inParams.cmdType;
				var cmdParam = inParams.cmdParam;
				switch (cmdType) {
					case 'block-service':
						blockService(cmdParam.serviceType, cmdParam.period);
						break;
					default:
						log("Unknown command " + cmdType + ", parameters : " + cmdParam);
				}
			}
			catch(ex) {
				log("Error execute command " + params + ", " + ex);
			}
		}
	}


	function initXD(){
		CM.init();
		CM.requestCookie("GCBR3", this.siteID);

	}

	/**
	 * This method parses XD mode cookie data <name-string> map to <name-object> map
	 * while stripping off the trailing _<siteid> from the names of each cookie object.
	 */
	function parseCookieData(data){
		var retval = {};
		for(var name in data){
			var cval = data[name];
			if(!!cval){
				var cname = name.replace(/_\d+$/, "");
				try{
					if (cname == "JSESSIONID") {
						retval[cname] = cval;
					} else {
						retval[cname] = MixIns.JSON.parse(cval);
					}
				} catch(e) {
					// log error and continue looping to parse all other cookies
					var errMsg = "Error parsing cookie: " + e.message + ". Cookie " + name + "=" + cval;
					log(errMsg);
					logErrorToTagServer(errMsg);
				}
			}
		}
		return retval;
	}

	/**
	 * A callback from our initialization controller.
	 * This is invoked twice in XD mode as we need to:
	 *   1) call once to check if 3P Cookies are supported on the browser AND if so
	 *   2) get the customerID and ip address
	 * In NonXD mode we make only one call to our controller: to get the custID and browserIP.
	 * @param {String} JSON data string
	 */
	function onRemoteCallback(data) {
		var initData = MixIns.JSON.parse(data);
		var _xd = (this.xd && (CM).cookies["pc"]!="2");
		
		if(!!initData["retry"]){
			var inqData = {};
			inqData[this.getID()] = {
				xd: _xd,
				siteID: this.getSiteID(),
				custID: this.getCustID(),
				retried:true
			};

			// When "from scratch" IJSF init is performed, site timezone offset is requested as part of init request
			if (isTZRequestRequired()) inqData[this.getID()].tzID = siteTzID;

			var strData = MixIns.JSON.stringify(inqData);
			this.callRemote(urls.initFrameworkURL, {rid:this.getID(), d: strData });
			return;
		}
		else if(_xd && !!initData["3pcNotSupported"]){
			log("Third party cookies not supported.");
			return;
		}

		var inqID = this.getID();
		if (initData[inqID]) {
			this.setFrameworkData(initData[inqID]);
		} else if (!isNullOrUndefined(initData["siteTzOffset"])) {
			log("Received site timezone offset from server: " + initData["siteTzOffset"] + "ms");
			this.setFrameworkData(initData);
		}
		PM.fireDataReady();
		this.start();
	}


	/**
	 * A callback from our 3PC IFrame proxy "get cookie" routine.
	 * In XD mode only, this is called (back) on every page landing before framework modules
	 * are initialized (to get cookies before without getting them from the server).
	 * @param {String} Aggregate cookie string (like "document.cookie" from the 3P domain)
	 */
	function IFrameProxyCallback(data){
		data = decodeURIComponent(data);

		//In XD mode in IE, if the peristent cookies are allowed, we will get the 'pc' cookie data to
		//IFrameProxyCallback function. If the data is empty that means only session cookies are allowed.
		if (data != ""){
			CM.isPersistentCookiesEnabled = true;
		} else {
			CM.isPersistentCookiesEnabled = false;
		}

		data = parseCookieData(CM._getCookies(data));
		CM.setXDCookies(data);
		this.onDataReady();
        if (resources['vital']) { log("Sync Sale Status: " + resources['vital'].read('_ss')); }

		var inqID = this.getID();
		var inqData = {};
		inqData[inqID] = {
			xd: this.xd,
			siteID: this.getSiteID(),
			custID: this.getCustID()
		};

		// When "from scratch" IJSF init is performed, site timezone offset is requested as part of init request
		if (isTZRequestRequired()) inqData[inqID].tzID = siteTzID;

		var strData = MixIns.JSON.stringify(inqData);
		this.callRemote(urls.initFrameworkURL, {rid:this.getID(), d: strData });
	}

	function init() {
		if(this.initialized) { return;};
		var inqData = {};
		var inqID = this.getID();
		PM.addListener(this);
		if(this.xd) {
			CM.init();
			CM.requestCookie("GCBR3", this.siteID); /* see callback at IFrameProxyCallback() */
		} else {
			if ( CookieMgr.isSessionCookiesAllowed() ) {
				CM.convertCookies();
				this.load();
				if(!this.isFrameworkReady()) {
					inqData[inqID] = {
						xd: this.xd,
						siteID: this.getSiteID(),
						custID: this.getCustID()
					};
	
					// When "from scratch" IJSF init is performed, site timezone offset is requested as part of init request
					if (isTZRequestRequired()) inqData[inqID].tzID = siteTzID;
	
					var strData = MixIns.JSON.stringify(inqData);
	
					this.callRemote(urls.initFrameworkURL, {rid:this.getID(), d: strData });
				} else if (isTZRequestRequired()) {
					log("Requesting site timezone offset");
					this.callRemote(urls.getSiteTzOffsetURL, {tzID: siteTzID});
				} else {
					PM.fireDataReady();
					this.start();
				}
			}
		}
		exposeCustomerApi();
	}

	function prepareDataToSend(data) {
		if (!data) {
			return data;
		}
		if (typeOf(data) =="array") {
			try {
				if (data.length > 0) {
					var elem = data[0];
					if (elem.key) {
						// map
						var out = Array.prepareMapToSerialize(data);
						return MixIns.JSON.stringify(out)
					}

				}
				return MixIns.JSON.stringify(data)
			}
			catch(e) {
				log(e);
			}
		}
		return data;
	}
	
	function main() {
		
		if(true){
			try {
				
				var elm = top.document.getElementById("doesNotExist");
			} catch(e) {
				return;
			}
		}
		MixIns.prepare(this).mixIn(MixIns.Observable).mixIn(MixIns.FrameworkModule);
		this.mixIn(MixIns.Persistable).mixIn(MixIns.Absorber).mixIn(MixIns.RemoteCaller);
		this._frameworkModule("INQ");
		this._observable();
		this.init();
		// this.start is called by the onDataReady method
	}

	var dataReady = false;
	var custID = null;
	var custIP = null;
	var win = self.parent;
	var doc = win.document;
	/* RTDEV-128. CL 20119. ChatRouter domain is stored in database but we should store full URL. Because of discrepancies between configuration and
	*  inq_new databases we can't update DB values. To get full CR url it decided to add HTTPS protocol to vanity domain value.
	*/
	var urls = {
		baseURL: normalizeProtocol("http://homev3.inq.com/tagserver"),
		vanityURL: normalizeProtocol("http://homev3.inq.com"),
		chatRouterVanityDomain: normalizeProtocol("https://chatrouterv3.inq.com"),
        initFrameworkURL: normalizeProtocol("http://homev3.inq.com/tagserver/init/initFramework.js"),
        getSiteTzOffsetURL: normalizeProtocol("http://homev3.inq.com/tagserver/init/getSiteTzOffset.js"),
        cookieGetURL:  normalizeProtocol("http://homev3.inq.com/tagserver/cookie/getServerCookie.js"),
        cookieSetURL:  normalizeProtocol("http://homev3.inq.com/tagserver/cookie/setDelta.js"),
        cookieClearAllURL:  normalizeProtocol("http://homev3.inq.com/tagserver/cookie/clearAllServerCookies"),
        cookieClearOneURL:  normalizeProtocol("http://homev3.inq.com/tagserver/cookie/clearOneServerCookie"),
        requestC2CImageURL:  normalizeProtocol("http://homev3.inq.com/tagserver/launch/requestC2CImage.js"),
        requestChatLaunchURL:  normalizeProtocol("http://homev3.inq.com/tagserver/launch/requestChatLaunch.js"),
        agentsAvailabilityCheckURL:  normalizeProtocol("http://homev3.inq.com/tagserver/launch/agentsAvailable.js"),
		loggingURL:  normalizeProtocol("http://homev3.inq.com/tagserver/logging/logline"),
		logDataURL: normalizeProtocol("http://homev3.inq.com/tagserver/logging/logdata"),
		mediaRootURL:  normalizeProtocol("http://mediav3.inq.com"),
		mediaBaseURL:  normalizeProtocol("http://mediav3.inq.com/media"),
		mediaSiteURL:  normalizeProtocol("http://mediav3.inq.com/media/sites/306"),
		cobrowseURL:  normalizeProtocol("https://cobrowse.inq.com"),
        xFormsDomain: normalizeProtocol("formsv3.inq.com")
	};
	var c2cPageElementIDs = {
		"2":"inqC2CImgContainer"
		, 
		"84":"inqC2CImgContainer"
		
		
	};
	C2C.setC2CPageElementIDs(c2cPageElementIDs);
	

    var PM = PersistenceMgr.getInstance(true);
	//PM creates a cookie mgr so retrieve from the PM
	var CM = PM.getCookieMgr();
	var C2CM = new C2CMgr("C2CM");

	var EVM = new EvtMgr("EVM");

	var ROM = new RemoteOpsMgr("ROM", {
		
	});

	var LDM = new LandingMgr("LDM",{
    	pages: {
			
				200167: {id:200167, mID:"TC_Home", re:"(.*)\/inQdevsite\/index\.php(.*)|(.*)http:\/\/www\.touchcommerce\.com\/"},
				200170: {id:200170, mID:"TC_SOL_Solutions", re:"(.*)\/Solutions\/"},
				200171: {id:200171, mID:"TC_SOL_Sales", re:"(.*)\/Sales\.php"},
				200172: {id:200172, mID:"TC_SOL_Care", re:"(.*)\/Care\.php"},
				200173: {id:200173, mID:"TC_SOL_Marketing", re:"(.*)\/Marketing\.php"},
				200174: {id:200174, mID:"TC_ADV_Advantage", re:"(.*)\/Advantage\/"},
				200175: {id:200175, mID:"TC_ADV_Point_Comparison", re:"(.*)\/COMP\.php"},
				200176: {id:200176, mID:"TC_ADV_Pay_for_Performance", re:"(.*)\/PFP\.php"},
				200178: {id:200178, mID:"TC_ADV_Profiting_and_Targeting", re:"(.*)\/RTPT\.php"},
				200179: {id:200179, mID:"TC_ADV_Program_Information", re:"(.*)\/OGO\.php"},
				200180: {id:200180, mID:"TC_ADV_Expert_Agents", re:"(.*)\/Advantage\/EA\.php"},
				200181: {id:200181, mID:"TC_IND_Industries", re:"(.*)\/Industries\/"},
				200182: {id:200182, mID:"TC_IND_Telecommunications", re:"(.*)\/TELECOMMUNICATIONS\.php"},
				200183: {id:200183, mID:"TC_IND_Financial_Services", re:"(.*)\/FS\.php"},
				200184: {id:200184, mID:"TC_IND_Retail", re:"(.*)\/Retail\.php"},
				200185: {id:200185, mID:"TC_IND_Careers", re:"(.*)\/Careers\/"},
				200187: {id:200187, mID:"TC_CS_Customer_Success", re:"(.*)\/Customer(.*)Success\/"},
				200188: {id:200188, mID:"TC_CS_Video_ATT", re:"(.*)\/att\.php"},
				200190: {id:200190, mID:"TC_CS_Video_Vonage_Canada", re:"(.*)\/vonage\.php"},
				200191: {id:200191, mID:"TC_CS_Video_Forrester", re:"(.*)\/forrester\.php"},
				200192: {id:200192, mID:"TC_NEWS_News", re:"(.*)\/News\/"},
				200200: {id:200200, mID:"TC_NEWS_News_1", re:"(.*)\/1\.php"},
				200201: {id:200201, mID:"TC_NEWS_News_2", re:"(.*)\/2\.php"},
				200202: {id:200202, mID:"TC_NEWS_News_3", re:"(.*)\/3\.php"},
				200204: {id:200204, mID:"TC_NEWS_News_4", re:"(.*)\/4\.php"},
				200205: {id:200205, mID:"TC_NEWS_News_5", re:"(.*)\/5\.php"},
				200206: {id:200206, mID:"TC_NEWS_News_6", re:"(.*)\/6\.php"},
				200208: {id:200208, mID:"TC_NEWS_News_7", re:"(.*)\/7\.php"},
				200209: {id:200209, mID:"TC_NEWS_News_8", re:"(.*)\/8\.php"},
				200210: {id:200210, mID:"TC_NEWS_News_9", re:"(.*)\/9\.php"},
				200211: {id:200211, mID:"TC_About", re:"(.*)\/About\/index\.php(.*)|(.*)\/About\/"},
				200213: {id:200213, mID:"TC_Mission", re:"(.*)\/Mission\.php"},
				200214: {id:200214, mID:"TC_Management", re:"(.*)\/Management\.php"},
				200215: {id:200215, mID:"TC_Board", re:"(.*)\/About\/BOD\.php"},
				200216: {id:200216, mID:"TC_Contact", re:"(.*)\/Contact(.*)"},
				200230: {id:200230, mID:"TC_NEWS_News_10", re:"(.*)\/10\.php"},
				200231: {id:200231, mID:"TC_NEWS_News_11", re:"(.*)\/11\.php"},
				200236: {id:200236, mID:"TC-Persistent", re:"(.*)\/TouchCommercetop\.html"},
				35206159: {id:35206159, mID:"TC-ContactUs_Confirmation", re:""}
},
		qsize: 10,
        contentGroups: {
		}
	});
	var BusinessRuleActionLists = {
        
	};

	var RuleActionLists = {
        setAssistedStateActionList: function(rule, evt) {
					if (!(CHM.getChatID().equals(PM.getVar("assistChatID",rule).getValue(), false))) {
	Inq.doRuleActionList("saveAssistedVariablesActionList", rule, evt);
                   
					PM.getVar("assistChatID", rule).setValue(CHM.getChatID());
						PM.getVar("assistDT", rule).setValue(new Date());
					if (exists(evt.assistAgtOverride)) {
	
					PM.getVar("assistAgt", rule).setValue((exists(evt.assistAgtOverride) ? evt.assistAgtOverride.toString() : ""));
					}   else {
	
					PM.getVar("assistAgt", rule).setValue(CHM.getAgentID());
					}
					PM.getVar("asstRuleID", rule).setValue((exists(CHM.getChat().getRuleId()) ? CHM.getChat().getRuleId().toString() : ""));
					PM.getVar("asstRuleName", rule).setValue((exists(CHM.getChat().getRuleName()) ? CHM.getChat().getRuleName().toString() : ""));
					if (!(PM.getVar("saleState",rule).getValue().equals(getConstant("SALE_STATE_CONVERTED", rule), false))) {
	
					PM.getVar("saleState", rule).setValue(getConstant("SALE_STATE_ASSISTED", rule));
					}  
					EVM.fireCustomEvent('Assisted', rule, evt,
						function() {
							return { businessUnitID: CHM.getChat().getBusinessUnitID() };
						},
						true
					);
						ROM.send(
							resources["SET_ASSISTED_CONTROLLER"].url,
							{"criteria": prepareDataToSend(PM.getVar("assistedType",rule).getValue()),"chatID": prepareDataToSend(CHM.getChatID())}
						);

					PM.getVar("assistedType", rule).setValue(getConstant("UNDEFINED_ASSISTED", rule));
					PM.getVar("incState", rule).setValue(getConstant("INC_STATE_ASSISTED", rule));
						ROM.send(
							resources["INC_EVENT_URL"].url,
							{"evt": prepareDataToSend(getConstant("INC_STATE_ASSISTED", rule)),"siteID": prepareDataToSend(getSiteID()),"pageID": prepareDataToSend(LDM.getPageID(0)),"customerID": prepareDataToSend(Inq.getCustID()),"incrementalityID": prepareDataToSend(getIncAssignmentID()),"sessionID": prepareDataToSend(getSessionID()),"brID": prepareDataToSend(CHM.getChat().getRuleId()),"chatID": prepareDataToSend(CHM.getChatID()),"businessUnitID": prepareDataToSend(CHM.getChat().getBusinessUnitID()),"targetAgentAttributes": prepareDataToSend(CHM.getChat().getAgentAttributesAsString()),"brAttributes": prepareDataToSend(CHM.getChat().getRuleAttributesAsString()),"type": prepareDataToSend(CHM.getConversionType())}
						);

					EVM.fireCustomEvent('SaleStateTransition', rule, evt,
						function() {
							return {};
						},
						true
					);
					}  
        } ,
        saveAssistedVariablesActionList: function(rule, evt) {
					PM.getVar("oldAssistChatID", rule).setValue(PM.getVar("assistChatID",rule).getValue());
					PM.getVar("oldAssistDT", rule).setValue(PM.getVar("assistDT",rule).getValue());
					PM.getVar("oldAssistAgt", rule).setValue(PM.getVar("assistAgt",rule).getValue());
					PM.getVar("oldAsstRuleID", rule).setValue(PM.getVar("asstRuleID",rule).getValue());
					PM.getVar("oldAsstRuleName", rule).setValue(PM.getVar("asstRuleName",rule).getValue());
					PM.getVar("oldSaleState", rule).setValue(PM.getVar("saleState",rule).getValue());
					PM.getVar("oldIncState", rule).setValue(PM.getVar("incState",rule).getValue());
					PM.getVar("oldSaleID", rule).setValue(PM.getVar("saleID",rule).getValue());
					PM.getVar("oldSoldDT", rule).setValue(PM.getVar("soldDT",rule).getValue());
        } 
	};

	var FM = new FcnMgr({
		"saleValue": 
				function(){
					try{
					var ps = inqSalesPrices;
					var qs = inqSalesQuantities;
					if(ps.length == qs.length){
						if(qs.length>0){
							var sum = 0;
							for(var i=0; i < qs.length; i++){
								sum += (parseFloat(qs[i]) * parseFloat(ps[i]));
							}
							return sum;
						}
					}
					}catch(er){}
					return null;
				}
			,
		"baynoteSaleValue": 
				function(){

					var i, p, q; 
					var pi = [], ps = [], qs = [];
					var purchaseId=0, purchaseDetails = "", totalPurchases=0;
					try{
						if (inqClientOrderNum) {
							purchaseId = inqClientOrderNum;
						}
						if (inqSalesProducts) {
							pi = inqSalesProducts;
						}
						if (inqSalesPrices) {
							ps = inqSalesPrices;
						}
						if (inqSalesQuantities) {
							qs = inqSalesQuantities;
						}
						
						purchaseDetails = "[";
						for(i = 0; i < pi.length; i++) {
							purchaseDetails += '"' + pi[i] + ":";
							p = 0.0;
							q = 0;
							if (qs.length > i) {
								q = parseFloat(qs[i]);
							}
							purchaseDetails += q + ":";
							if (ps.length > i) {
								p = parseFloat(ps[i]);
								totalPurchases += p;
							}
							purchaseDetails += p + '"';
							if (i !== pi.length -1) {
								purchaseDetails += ',';
							}
						}
						purchaseDetails += "]";
						
					}catch(er){}

					return '{"purchaseId":"' + purchaseId + '","totalPurchases":'+ totalPurchases +',"purchaseDetails":'+purchaseDetails+'}';
				}
			
	});

    var dfvs = {};

	var resources = {
		"RESOLVE_IP_CONTROLLER": new WebResource("RESOLVE_IP_CONTROLLER", normalizeProtocol("http://homev3.inq.com"+"/tagserver/address/resolveIpToHostName"), "rw", "GET"), 
		"SET_SALE_CONTROLLER": new WebResource("SET_SALE_CONTROLLER", normalizeProtocol("http://homev3.inq.com"+"/tagserver/sale/setSale.js"), "rw", "GET"), 
		"SALE_LANDING_CONTROLLER": new WebResource("SALE_LANDING_CONTROLLER", normalizeProtocol("http://homev3.inq.com"+"/tagserver/sale/saleLanding"), "rw", "GET"), 
		"INC_EVENT_URL": new WebResource("INC_EVENT_URL", normalizeProtocol("http://homev3.inq.com"+"/tagserver/incrementality/onEvent"), "w", "GET"), 
		"JASPER_ETL": new WebResource("JASPER_ETL", normalizeProtocol("http://homev3.inq.com"+"/tagserver/logging/logdata"), "w", "GET"), 
		"SET_ASSISTED_CONTROLLER": new WebResource("SET_ASSISTED_CONTROLLER", normalizeProtocol("http://homev3.inq.com"+"/tagserver/assisted/setAssisted.gif"), "rw", "GET"), 
		"IS_AGENT_IN_CHAT": new WebResource("IS_AGENT_IN_CHAT", normalizeProtocol("http://homev3.inq.com"+"/tagserver/tracking/isAgentInChat.jsp"), "rw", "GET"), 
				"rVar": new JSResource("rVar",  "rw"), 
				"tmpVars": new JSResource("tmpVars",  "rw")

	};
	resources["pc"] = new CookieResource("pc", "pc", "/",  1 * 24 * 3600 * 1000, "touchcommerce.com", false, CM);
	resources["state"] = new CookieResource("state", "inqState", "/",  365 * 24 * 3600 * 1000, "touchcommerce.com", false, CM);
	resources["vital"] = new CookieResource("vital", "inqVital", "/",  365 * 24 * 3600 * 1000, "touchcommerce.com", false, CM);
	resources["session"] = new CookieResource("session", "inqSession", "/",  365 * 24 * 3600 * 1000, "touchcommerce.com", false, CM);

	var schedules = MixIns.mixAbsorber();
    var programSchedules = {};
    var businessSchedules = {};

	schedules.absorb(programSchedules);
	schedules.absorb(businessSchedules);

	var MM = new MediaMgr(
		{
			chatThemes:{
				2: {
					id:2,
					an:"TouchCommerce",
					fn:"TouchCommerce.zip",
					name:"Chat Theme-A",
					tbh:Number("55"),
					ciw:Number("30"),
					cih:Number("30"),
					d:true,
					cn:"You",
					dw:Number("440"),
					dh:Number("245"),
					pos:"CENTER",
					lx:Number("0"),
					ly:Number("0"),
					wm:"TRANSPARENT",
					px:Number("0"),
					py:Number("0"),
					ph:Number("350"),
					pw:Number("420")
				},
				42: {
					id:42,
					an:"Jessica",
					fn:"",
					name:"Call Theme",
					tbh:Number("55"),
					ciw:Number("30"),
					cih:Number("30"),
					d:true,
					cn:"You",
					dw:Number("500"),
					dh:Number("245"),
					pos:"CENTER",
					lx:Number("0"),
					ly:Number("0"),
					wm:"TRANSPARENT",
					px:Number("0"),
					py:Number("0"),
					ph:Number("300"),
					pw:Number("500")
				}
			},
			chatSpecs:{
				2: {
					id:2,
					name:"Chat Spec-A",
					oId:200146, // opener id
					stId:200023, // script tree id
					ctId:2,  // chat theme id
					ael:"", // agent exit line
					svySpId:2
                },
				170: {
					id:170,
					name:"TC_click2call",
					oId:200467, // opener id
					stId:200023, // script tree id
					ctId:42,  // chat theme id
					ael:""
                },
				25000885: {
					id:25000885,
					name:"TestChatSpec-1",
					oId:202862, // opener id
					stId:200023, // script tree id
					ctId:42,  // chat theme id
					ael:null, // agent exit line
					svySpId:2,
					emSpId:2000006
                }
			},
			c2cSpecs:{
				2: {
					id:2,
					name:"C2C Spec-A",
					igaa:false, 
					
					thId:2,
					chSpId:2,
					peId:"inqC2CImgContainer"
				},
				84: {
					id:84,
					name:"TC_click2call",
					igaa:false, 
					
					thId:2,
					chSpId:170,
					peId:"inqC2CImgContainer"
				}
			},
			c2cThemes:{
				2: {
					id:2,
					name:"C2C Theme-A",
					r:"TC_C2C_Available.gif",
					b:"TC_C2C_Available_disabled.gif",
					ah:"TC_C2C_Available_disabled.gif",
					d:"TC_C2C_Available_disabled.gif"
				}
			}
		}
	);
	var qDefaults = {
		22:{qt:100.0/100,priority:1}

	};
	
	var BRM = new BRMgr("BRM", {
        rules:[
			Rule.create({
				id:5,
				name:"Sale Setter Rule", 
				vars:[],
				triggers:function(rule) {return [{id:"onManualInvocation"} ]},
				conditionalFcn: function(rule,evt){
					return (false);
				},
				actionFcn: function(rule, evt){
					
					log("Won't happen");

				}
			}), 
			Rule.create({
				id:10,
				name:"Incrementality Attribute Setter Stub Rule", 
				vars:[],
				triggers:function(rule) {return [{id:"onPageLanding"} ]},
				conditionalFcn: function(rule,evt){
					return (!(VAM.test({"vis_attr_incr_val":{"values":{},"mutuallyExclusive":false}
})));
				},
				actionFcn: function(rule, evt){
					
					VAM.add({"vis_attr_incr_val":{"values":MixIns.unmixMutatable(MixIns.mixMutatable().set("",true))},"mutuallyExclusive":false});
				}
			}), 
			Rule.create({
				id:400,
				name:"MobileSuppression", 
				vars:[],
				triggers:function(rule) {return [{id:"onPageLanding"} ]},
				conditionalFcn: function(rule,evt){
					return ((isDeviceType("Unsupported")) || (isDeviceType("Phone")) || (isDeviceType("Tablet")));
				},
				actionFcn: function(rule, evt){
					
					Inq.blockServices(["ALL"], -1);
				}
			}), 
			Rule.create({
				id:500,
				name:"Session Manager- Reset Session Rule", 
				vars:[],
				triggers:function(rule) {return [{id:"onPageLanding"}, {id:"onCustomerMsg"}, {id:"onAgentMsg"} ]},
				conditionalFcn: function(rule,evt){
					return (true);
				},
				actionFcn: function(rule, evt){
					
					if (PM.getVar("loyalty",rule).getValue() == 0.0) {
	
					PM.getVar("loyalty", rule).setValue(1.0);
					PM.getVar("sesID", rule).setValue(Inq.getCustID()+(exists(PM.getVar("loyalty",rule).getValue()) ? PM.getVar("loyalty",rule).getValue().toString() : ""));
						PM.getVar("fst", rule).setValue(new Date());
						PM.getVar("lst", rule).setValue(PM.getVar("fst",rule).getValue());
					EVM.fireCustomEvent('NewSession', rule, evt,
						function() {
							return {};
						},
						true
					);
					}  else  if (((!(exists(PM.getVar("ltt",rule).getValue()))) && (!(PM.getVar("loyalty",rule).getValue() == 0.0))) || (new Date().after(PM.getVar("ltt",rule).getValue().roll(getConstant("SESSION_EXPIRE_TIME", rule))))) {
	
					PM.getVar("loyalty", rule).setValue((PM.getVar("loyalty",rule).getValue()  + 1.0));


PM.reset("session");


				
				
					PM.getVar("sesID", rule).setValue(Inq.getCustID()+(exists(PM.getVar("loyalty",rule).getValue()) ? PM.getVar("loyalty",rule).getValue().toString() : ""));
						PM.getVar("lst", rule).setValue(new Date());
					EVM.fireCustomEvent('NewSession', rule, evt,
						function() {
							return {};
						},
						true
					);
					}    
						PM.getVar("ltt", rule).setValue(new Date());
				}
			}), 
			Rule.create({
				id:550,
				name:"Chat Count Rule", 
				vars:[],
				triggers:function(rule) {return [{id:"onChatLaunched", serviceType:"C2C"}, {id:"onChatLaunched", serviceType:"C2CALL"}, {id:"onChatLaunched", serviceType:"POPUP"}, {id:"onChatLaunched", serviceType:"POPUP_CALL"}, {id:"onChatLaunched", serviceType:"PERSISTENT"} ]},
				conditionalFcn: function(rule,evt){
					return (true);
				},
				actionFcn: function(rule, evt){
					
					PM.getVar("chatCnt", rule).setValue((PM.getVar("chatCnt",rule).getValue()  + 1.0));
				}
			}), 
			Rule.create({
				id:551,
				name:"Sale Qualification Count Rule", 
				vars:[],
				triggers:function(rule) {return [{id:"on"+"Assisted"} ]},
				conditionalFcn: function(rule,evt){
					return (true);
				},
				actionFcn: function(rule, evt){
					
					PM.getVar("salesQualificationCount", rule).setValue((PM.getVar("salesQualificationCount",rule).getValue()  + 1.0));
				}
			}), 
			Rule.create({
				id:553,
				name:"DEPRECATED Clientside listeners backward compatibility Rule", 
				vars:[],
				triggers:function(rule) {return [{id:"onPageLanding"} ]},
				conditionalFcn: function(rule,evt){
					return (true);
				},
				actionFcn: function(rule, evt){
					
					publishAPI("InqSaleMgr.getSaleID", "assistChatID");

				}
			}), 
			Rule.create({
				id:555,
				name:"Referring Search Rule", 
				vars:[],
				triggers:function(rule) {return [{id:"on"+"NewSession"} ]},
				conditionalFcn: function(rule,evt){
					return (true);
				},
				actionFcn: function(rule, evt){
					
					PM.getVar("rd", rule).setValue(URI.parseURI(doc.referrer).domain);
					if ((URI.parseURI(doc.referrer).domain.endsWith("google.com", true)) || (URI.parseURI(doc.referrer).domain.endsWith("ask.com", true)) || (URI.parseURI(doc.referrer).domain.endsWith("aol.com", true)) || (URI.parseURI(doc.referrer).domain.endsWith("bing.com", true)) || (URI.parseURI(doc.referrer).domain.endsWith("google.fr", true)) || (URI.parseURI(doc.referrer).domain.endsWith("google.de", true)) || (URI.parseURI(doc.referrer).domain.endsWith("google.co.uk", true)) || (URI.parseURI(doc.referrer).domain.endsWith("aol.fr", true)) || (URI.parseURI(doc.referrer).domain.endsWith("aol.de", true)) || (URI.parseURI(doc.referrer).domain.endsWith("aol.co.uk", true))) {
	
					PM.getVar("sest", rule).setValue(URI.parseURI(doc.referrer).qMap["q"]);
					}  else  if (URI.parseURI(doc.referrer).domain.endsWith("yahoo.com", true)) {
	
					PM.getVar("sest", rule).setValue(URI.parseURI(doc.referrer).qMap["p"]);
					}     else {
	
					PM.getVar("sest", rule).setValue("");
					}
				}
			}), 
			Rule.create({
				id:600,
				name:"Sale Page Counting Rule", 
				vars:[],
				triggers:function(rule) {return [{id:"onPageLanding"} ]},
				conditionalFcn: function(rule,evt){
					return ((exists(safe("inqSalesProducts"))) && (exists(safe("inqSalesQuantities"))));
				},
				actionFcn: function(rule, evt){
					
					PM.getVar("saleLC", rule).setValue((PM.getVar("saleLC",rule).getValue()  + 1.0));
					EVM.fireCustomEvent('SaleLanding', rule, evt,
						function() {
							return {};
						},
						true
					);
				}
			}), 
			Rule.create({
				id:605,
				name:"Sale Reset Rule", 
				vars:[],
				triggers:function(rule) {return [{id:"onPageLanding"}, {id:"on"+"SaleLanding"} ]},
				conditionalFcn: function(rule,evt){
					return ((!(CHM.isPersistentWindow())) && (!(PM.getVar("saleState",rule).getValue().equals(getConstant("SALE_STATE_UNSOLD", rule), false))) && ((new Date().after(PM.getVar("assistDT",rule).getValue().roll(getConstant("SALE_EXPIRATION", rule)))) || ((exists(PM.getVar("soldDT",rule).getValue())) && (new Date(86400000).before(PM.getVar("soldDT",rule).getValue())) && (new Date().after(PM.getVar("soldDT",rule).getValue().roll(getConstant("SALE_EXPIRATION", rule)))))));
				},
				actionFcn: function(rule, evt){
					Inq.doRuleActionList("saveAssistedVariablesActionList", rule, evt);
                   
					PM.getVar("saleState", rule).setValue(getConstant("SALE_STATE_UNSOLD", rule));
						PM.getVar("assistDT", rule).setValue(new Date(0.0));
						PM.getVar("soldDT", rule).setValue(new Date(0.0));
					PM.getVar("assistAgt", rule).setValue("");
					PM.getVar("assistChatID", rule).setValue("-1");
					EVM.fireCustomEvent('SaleStateTransition', rule, evt,
						function() {
							return {};
						},
						true
					);
				}
			}), 
			Rule.create({
				id:610,
				name:"Sale Page Landing Data Pass", 
				vars:[],
				triggers:function(rule) {return [{id:"on"+"SaleLanding"} ]},
				conditionalFcn: function(rule,evt){
					return (PM.getVar("saleState",rule).getValue().equals(getConstant("SALE_STATE_UNSOLD", rule), false));
				},
				actionFcn: function(rule, evt){
					
						ROM.send(
							resources["SALE_LANDING_CONTROLLER"].url,
							{"agentID": prepareDataToSend(CHM.getAgentID()),"chatID": prepareDataToSend(PM.getVar("assistChatID",rule).getValue()),"customerID": prepareDataToSend(Inq.getCustID()),"products": prepareDataToSend((exists(safe("inqSalesProducts"))  ? safe("inqSalesProducts") : null)),"quantities": prepareDataToSend((exists(safe("inqSalesQuantities"))  ? safe("inqSalesQuantities") : null)),"prices": prepareDataToSend((exists(safe("inqSalesPrices"))  ? safe("inqSalesPrices") : null)),"productTypes": prepareDataToSend((exists(safe("inqSalesProductTypes"))  ? safe("inqSalesProductTypes") : null)),"orderType": prepareDataToSend((exists(safe("inqOrderType"))  ? safe("inqOrderType") : null)),"customerName": prepareDataToSend((exists(safe("inqCustomerName"))  ? safe("inqCustomerName") : null)),"clientOrderNum": prepareDataToSend((exists(safe("inqClientOrderNum"))  ? safe("inqClientOrderNum") : null)),"testOrder": prepareDataToSend((exists(safe("inqTestOrder"))  ? safe("inqTestOrder") : null)),"otherInfo": prepareDataToSend((exists(safe("inqOtherInfo"))  ? safe("inqOtherInfo") : null)),"clientTimestamp": prepareDataToSend((exists(safe("inqClientTimeStamp"))  ? safe("inqClientTimeStamp") : null))}
						);

					PM.getVar("saleValue", rule).setValue(parseFloat(FM.callExternal("saleValue")));					log("***************** SALE LANDING *****************"); 

				}
			}), 
			Rule.create({
				id:620,
				name:"Fire AssistedEvent Rule - by Message Count", 
				vars:[],
				triggers:function(rule) {return [{id:"onAgentMsg"}, {id:"onCustomerMsg"} ]},
				conditionalFcn: function(rule,evt){
					return ((exists(evt.agtMsgCnt)) && (exists(evt.custMsgCnt)) && (parseFloat(evt.agtMsgCnt) >= getConstant("ASSISTED_AGENT_CHAT_COUNT", rule)) && (parseFloat(evt.custMsgCnt) >= getConstant("ASSISTED_CUSTOMER_CHAT_COUNT", rule)));
				},
				actionFcn: function(rule, evt){
					
					log("******** ASSISTED by message exchange **********");

					PM.getVar("assistedType", rule).setValue(getConstant("MESSAGE_COUNT_ASSISTED", rule));
					EVM.fireCustomEvent('AssistedEvent', rule, evt,
						function() {
							return { businessUnitID: CHM.getChat().getBusinessUnitID() };
						},
						true
					);
				}
			}), 
			Rule.create({
				id:621,
				name:"Fire AssistedEvent Rule - by Persistent Push", 
				vars:[],
				triggers:function(rule) {return [{id:"onPersistentPush"} ]},
				conditionalFcn: function(rule,evt){
					return (!((CHM.isServiceInProgress("C2CALL")) || (CHM.isServiceInProgress("POPUP_CALL")) || ((CHM.isServiceInProgress("C2C")) && (isC2PActive(false)))));
				},
				actionFcn: function(rule, evt){
					
					log("******** ASSISTED by Persistent Push **********");

					PM.getVar("assistedType", rule).setValue(getConstant("PERSISTENT_ASSISTED", rule));
					EVM.fireCustomEvent('AssistedEvent', rule, evt,
						function() {
							return { businessUnitID: CHM.getChat().getBusinessUnitID() };
						},
						true
					);
				}
			}), 
			Rule.create({
				id:622,
				name:"Assisted Rule", 
				vars:[],
				triggers:function(rule) {return [{id:"on"+"AssistedEvent"} ]},
				conditionalFcn: function(rule,evt){
					return (true);
				},
				actionFcn: function(rule, evt){
					Inq.doRuleActionList("setAssistedStateActionList", rule, evt);
                   
				}
			}), 
			Rule.create({
				id:624,
				name:"Send Assisted Event on Agent Assigned", 
				vars:[],
				triggers:function(rule) {return [{id:"onAgentAssigned"} ]},
				conditionalFcn: function(rule,evt){
					return ((CHM.isPersistentWindow()) && ((CHM.isServiceInProgress("C2CALL")) || (CHM.isServiceInProgress("POPUP_CALL")) || ((CHM.isServiceInProgress("C2C")) && (isC2PActive(false)))));
				},
				actionFcn: function(rule, evt){
					
					EVM.fireCustomEvent('AssistedEvent', rule, evt,
						function() {
							return { businessUnitID: CHM.getChat().getBusinessUnitID() };
						},
						true
					);
				}
			}), 
			Rule.create({
				id:625,
				name:"Sale Conversion Rule", 
				vars:[],
				triggers:function(rule) {return [{id:"on"+"SaleLanding"} ]},
				conditionalFcn: function(rule,evt){
					return (!(PM.getVar("saleState",rule).getValue().equals(getConstant("SALE_STATE_UNSOLD", rule), false)));
				},
				actionFcn: function(rule, evt){
					
						CallRemote.create({
							doCallbackActions: function(data){
								
					if ((new Boolean(data.success)).valueOf()) {
	Inq.doRuleActionList("saveAssistedVariablesActionList", rule, evt);
                   
					PM.getVar("saleState", rule).setValue(getConstant("SALE_STATE_CONVERTED", rule));
					PM.getVar("saleID", rule).setValue((exists(data.saleID) ? data.saleID.toString() : ""));
						PM.getVar("soldDT", rule).setValue(new Date());
					EVM.fireCustomEvent('SaleStateTransition', rule, evt,
						function() {
							return {};
						},
						true
					);
					EVM.fireCustomEvent('Converted', rule, evt,
						function() {
							return {};
						},
						true
					);
					}  
							}
						}).callRemote(
							resources["SET_SALE_CONTROLLER"].url,
							{"agentID": prepareDataToSend(PM.getVar("assistAgt",rule).getValue()),"chatID": prepareDataToSend(PM.getVar("assistChatID",rule).getValue()),"customerID": prepareDataToSend(Inq.getCustID()),"products": prepareDataToSend((exists(safe("inqSalesProducts"))  ? safe("inqSalesProducts") : null)),"quantities": prepareDataToSend((exists(safe("inqSalesQuantities"))  ? safe("inqSalesQuantities") : null)),"prices": prepareDataToSend((exists(safe("inqSalesPrices"))  ? safe("inqSalesPrices") : null)),"productTypes": prepareDataToSend((exists(safe("inqSalesProductTypes"))  ? safe("inqSalesProductTypes") : null)),"products2": prepareDataToSend((exists(safe("inqSalesProducts2"))  ? safe("inqSalesProducts2") : null)),"quantities2": prepareDataToSend((exists(safe("inqSalesQuantities2"))  ? safe("inqSalesQuantities2") : null)),"prices2": prepareDataToSend((exists(safe("inqSalesPrices2"))  ? safe("inqSalesPrices2") : null)),"productTypes2": prepareDataToSend((exists(safe("inqSalesProductTypes2"))  ? safe("inqSalesProductTypes2") : null)),"orderType": prepareDataToSend((exists(safe("inqOrderType"))  ? safe("inqOrderType") : null)),"customerName": prepareDataToSend((exists(safe("inqCustomerName"))  ? safe("inqCustomerName") : null)),"clientOrderNum": prepareDataToSend((exists(safe("inqClientOrderNum"))  ? safe("inqClientOrderNum") : null)),"testOrder": prepareDataToSend((exists(safe("inqTestOrder"))  ? safe("inqTestOrder") : null)),"otherInfo": prepareDataToSend((exists(safe("inqOtherInfo"))  ? safe("inqOtherInfo") : null)),"clientTimestamp": prepareDataToSend((exists(safe("inqClientTimeStamp"))  ? safe("inqClientTimeStamp") : null)),"siteID": prepareDataToSend(getSiteID())}
						);
				}
			}), 
			Rule.create({
				id:635,
				name:"Save Last n Sales", 
				vars:[],
				triggers:function(rule) {return [{id:"on"+"Converted"} ]},
				conditionalFcn: function(rule,evt){
					return (true);
				},
				actionFcn: function(rule, evt){
					
						PM.getVar("nSalesID", rule).prepend([PM.getVar("saleID",rule).getValue()]);
						
				}
			}), 
			Rule.create({
				id:700,
				name:"Page Landing Data Pass", 
				vars:[
		new Variable("url_700",null, resources["tmpVars"], "url", function(o){ return o?o.toString():o;})],
				triggers:function(rule) {return [{id:"onPageLanding"} ]},
				conditionalFcn: function(rule,evt){
					return ((CHM.isServiceInProgress("ANY")) && (!(safe("top.name").equals("_inqPersistentChat", false))));
				},
				actionFcn: function(rule, evt){
					
					if (getConstant("REMOVE_QUERY_STRING_FROM_TRACKING_URL", rule)) {
	
					PM.getVar("url", rule).setValue(LDM.getCurrentPageURL().replace(/\?.*/g, ""));
					}   else {
	
					PM.getVar("url", rule).setValue(LDM.getCurrentPageURL());
					}
					ROM.send(
						urls.baseURL+"/tracking/agent",
						MixIns.mixMutatable(MixIns.mixAbsorber(MixIns.mixMutatable().set("URL", PM.getVar("url",rule).getValue()).set("markerID", LDM.getPageMarker())).absorb(safe('inqData'))).set("agentID",CHM.getAgentID()).set("chatID",CHM.getChatID())
					);

				}
			}), 
			Rule.create({
				id:710,
				name:"Agent Assigned Tracking", 
				vars:[
		new Variable("url_710",null, resources["tmpVars"], "url", function(o){ return o?o.toString():o;})],
				triggers:function(rule) {return [{id:"onAgentAssigned"} ]},
				conditionalFcn: function(rule,evt){
					return ((CHM.isServiceInProgress("ANY")) && (!(safe("top.name").equals("_inqPersistentChat", false))));
				},
				actionFcn: function(rule, evt){
					
					if (getConstant("REMOVE_QUERY_STRING_FROM_TRACKING_URL", rule)) {
	
					PM.getVar("url", rule).setValue(LDM.getCurrentPageURL().replace(/\?.*/g, ""));
					}   else {
	
					PM.getVar("url", rule).setValue(LDM.getCurrentPageURL());
					}
					ROM.send(
						urls.baseURL+"/tracking/agent",
						{
							"URL": prepareDataToSend(PM.getVar("url",rule).getValue()),"markerID": prepareDataToSend(LDM.getPageMarker()),
							agentID:CHM.getAgentID(),
							chatID:CHM.getChatID()
						}
					);

				}
			}), 
			Rule.create({
				id:799,
				name:"Reset incGroup", 
				vars:[],
				triggers:function(rule) {return [{id:"on"+"NewSession"} ]},
				conditionalFcn: function(rule,evt){
					return ((!(exists(PM.getVar("incStart",rule).getValue()))) || (new Date().after(PM.getVar("incStart",rule).getValue().roll(getConstant("INC_GROUP_DURATION", rule)))));
				},
				actionFcn: function(rule, evt){
					
						PM.getVar("incStart", rule).setValue(new Date());
					PM.getVar("incID", rule).setValue(getSessionID());
					if ((!(PM.getVar("incExempt",rule).getValue())) && (rand(1, 100, true)  <= getConstant("INC_CONTROL_PERCENT", rule))) {
	
					PM.getVar("incGroup", rule).setValue(getConstant("INC_GROUP_CONTROL", rule));
					}   else {
	
					PM.getVar("incGroup", rule).setValue(getConstant("INC_GROUP_CHAT", rule));
					}
					PM.getVar("incState", rule).setValue(getConstant("INC_STATE_ELIGIBLE", rule));
				}
			}), 
			Rule.create({
				id:800,
				name:"Eligible Rule", 
				vars:[],
				triggers:function(rule) {return [{id:"on"+"NewSession"} ]},
				conditionalFcn: function(rule,evt){
					return (true);
				},
				actionFcn: function(rule, evt){
					
					EVM.fireCustomEvent('EligibleEvent', rule, evt,
						function() {
							return {};
						},
						true
					);
						ROM.send(
							resources["INC_EVENT_URL"].url,
							{"evt": prepareDataToSend(getConstant("INC_STATE_ELIGIBLE", rule)),"siteID": prepareDataToSend(getSiteID()),"pageID": prepareDataToSend(LDM.getPageID(0)),"customerID": prepareDataToSend(Inq.getCustID()),"incrementalityID": prepareDataToSend(getIncAssignmentID()),"sessionID": prepareDataToSend(getSessionID()),"group": prepareDataToSend(PM.getVar("incGroup",rule).getValue()),"exempt": prepareDataToSend(PM.getVar("incExempt",rule).getValue()),"igdStart": prepareDataToSend(PM.getVar("incStart",rule).getValue()),"businessUnitID": prepareDataToSend( evt.rule && evt.rule.businessUnitID ? evt.rule.getBusinessUnitID() : rule.getBusinessUnitID()),"browserType": prepareDataToSend(getClientBrowserType()),"browserVersion": prepareDataToSend(getClientBrowserVersion()),"operatingSystemType": prepareDataToSend(getOSType()),"deviceType": prepareDataToSend(getDeviceType()),"visitorAttributes": prepareDataToSend((exists(VAM.getCopyAsArray().join(";")) ? VAM.getCopyAsArray().join(";").toString() : ""))}
						);

				}
			}), 
			Rule.create({
				id:802,
				name:"Set BRMgr Actionable Flag", 
				vars:[],
				triggers:function(rule) {return [{id:"onPageLanding"} ]},
				conditionalFcn: function(rule,evt){
					return (PM.getVar("incGroup",rule).getValue().equals(getConstant("INC_GROUP_CONTROL", rule), true));
				},
				actionFcn: function(rule, evt){
					BRM.setActionable(false);
				}
			}), 
			Rule.create({
				id:805,
				name:"Targeted Rule", 
				vars:[],
				triggers:function(rule) {return [{id:"onRuleSatisfied"} ]},
				conditionalFcn: function(rule,evt){
					return (!(CHM.isServiceInProgress("ANY")));
				},
				actionFcn: function(rule, evt){
					
					EVM.fireCustomEvent('TargetedEvent', rule, evt,
						function() {
							return { brID: evt.rule.id ,  businessUnitID: evt.rule.getBusinessUnitID() };
						},
						true
					);
						ROM.send(
							resources["INC_EVENT_URL"].url,
							{"evt": prepareDataToSend(getConstant("INC_STATE_TARGETED", rule)),"siteID": prepareDataToSend(getSiteID()),"pageID": prepareDataToSend(LDM.getPageID(0)),"customerID": prepareDataToSend(Inq.getCustID()),"incrementalityID": prepareDataToSend(getIncAssignmentID()),"sessionID": prepareDataToSend(getSessionID()),"group": prepareDataToSend(PM.getVar("incGroup",rule).getValue()),"brID": prepareDataToSend(evt.rule.id),"businessUnitID": prepareDataToSend(evt.rule.getBusinessUnitID()),"targetAgentAttributes": prepareDataToSend(evt.rule.getAgentAttributesAsString()),"brAttributes": prepareDataToSend(evt.rule.getRuleAttributesAsString()),"visitorAttributes": prepareDataToSend((exists(VAM.getCopyAsArray().join(";")) ? VAM.getCopyAsArray().join(";").toString() : ""))}
						);

				}
			}), 
			Rule.create({
				id:807,
				name:"Exposure Qualified Rule", 
				vars:[],
				triggers:function(rule) {return [{id:"onExposureQualified"} ]},
				conditionalFcn: function(rule,evt){
					return (true);
				},
				actionFcn: function(rule, evt){
					
						ROM.send(
							resources["INC_EVENT_URL"].url,
							{"evt": prepareDataToSend(getConstant("INC_STATE_EXPOSURE_QUALIFIED", rule)),"siteID": prepareDataToSend(getSiteID()),"pageID": prepareDataToSend(LDM.getPageID()),"customerID": prepareDataToSend(Inq.getCustID()),"incrementalityID": prepareDataToSend(getIncAssignmentID()),"sessionID": prepareDataToSend(getSessionID()),"businessUnitID": prepareDataToSend(evt.rule.getBusinessUnitID()),"group": prepareDataToSend(PM.getVar("incGroup",rule).getValue()),"brID": prepareDataToSend(evt.rule.id),"result": prepareDataToSend(evt.result),"targetAgentAttributes": prepareDataToSend(evt.rule.getAgentAttributesAsString()),"brAttributes": prepareDataToSend(evt.rule.getRuleAttributesAsString()),"visitorAttributes": prepareDataToSend((exists(VAM.getCopyAsArray().join(";")) ? VAM.getCopyAsArray().join(";").toString() : ""))}
						);

				}
			}), 
			Rule.create({
				id:810,
				name:"Exposed Rule", 
				vars:[],
				triggers:function(rule) {return [{id:"onServiceInvitation"} ]},
				conditionalFcn: function(rule,evt){
					return (true);
				},
				actionFcn: function(rule, evt){
					
					EVM.fireCustomEvent('ExposedEvent', rule, evt,
						function() {
							return { businessUnitID: evt.rule.getBusinessUnitID() };
						},
						true
					);
						ROM.send(
							resources["INC_EVENT_URL"].url,
							{"evt": prepareDataToSend(getConstant("INC_STATE_EXPOSED", rule)),"siteID": prepareDataToSend(getSiteID()),"pageID": prepareDataToSend(LDM.getPageID(0)),"customerID": prepareDataToSend(Inq.getCustID()),"incrementalityID": prepareDataToSend(getIncAssignmentID()),"sessionID": prepareDataToSend(getSessionID()),"brID": prepareDataToSend(evt.rule.id),"chatID": prepareDataToSend(CHM.getChatID()),"businessUnitID": prepareDataToSend(evt.rule.getBusinessUnitID()),"targetAgentAttributes": prepareDataToSend(evt.rule.getAgentAttributesAsString()),"brAttributes": prepareDataToSend(evt.rule.getRuleAttributesAsString()),"visitorAttributes": prepareDataToSend((exists(VAM.getCopyAsArray().join(";")) ? VAM.getCopyAsArray().join(";").toString() : ""))}
						);

				}
			}), 
			Rule.create({
				id:811,
				name:"engagement.windowDisplayed rule", 
				vars:[],
				triggers:function(rule) {return [{id:"onChatLaunched", serviceType:"C2C"}, {id:"onChatLaunched", serviceType:"C2CALL"}, {id:"onChatLaunched", serviceType:"POPUP"}, {id:"onChatLaunched", serviceType:"POPUP_CALL"}, {id:"onChatLaunched", serviceType:"PERSISTENT"}, {id:"onChatLaunched", serviceType:"CONVERSIVE"} ]},
				conditionalFcn: function(rule,evt){
					return (true);
				},
				actionFcn: function(rule, evt){
					
						ROM.send(
							resources["JASPER_ETL"].url,
							{"_domain": prepareDataToSend("engagement"),"evt": prepareDataToSend("windowDisplayed"),"customerID": prepareDataToSend(Inq.getCustID()),"siteID": prepareDataToSend(getSiteID()),"pageID": prepareDataToSend(LDM.getPageID(0)),"sessionID": prepareDataToSend(getSessionID()),"incAssignmentID": prepareDataToSend(getIncAssignmentID()),"businessRuleID": prepareDataToSend(evt.rule.id),"chatID": prepareDataToSend(CHM.getChatID()),"businessUnitID": prepareDataToSend( evt.rule && evt.rule.businessUnitID ? evt.rule.getBusinessUnitID() : rule.getBusinessUnitID()),"inHOP": prepareDataToSend(evt.inHOP),"targetAgentAttributes": prepareDataToSend(evt.rule.getAgentAttributesAsString()),"brAttributes": prepareDataToSend(evt.rule.getRuleAttributesAsString()),"visitorAttributes": prepareDataToSend((exists(VAM.getCopyAsArray().join(";")) ? VAM.getCopyAsArray().join(";").toString() : ""))}
						);

				}
			}), 
			Rule.create({
				id:812,
				name:"engagement.persistentWindowDisplayed rule", 
				vars:[],
				triggers:function(rule) {return [{id:"onChatLaunched", serviceType:"PERSISTENT"}, {id:"onPersistentPush"} ]},
				conditionalFcn: function(rule,evt){
					return (true);
				},
				actionFcn: function(rule, evt){
					
						ROM.send(
							resources["JASPER_ETL"].url,
							{"_domain": prepareDataToSend("engagement"),"evt": prepareDataToSend("persistentWindowDisplayed"),"customerID": prepareDataToSend(Inq.getCustID()),"siteID": prepareDataToSend(getSiteID()),"pageID": prepareDataToSend(LDM.getPageID(0)),"sessionID": prepareDataToSend(getSessionID()),"incAssignmentID": prepareDataToSend(getIncAssignmentID()),"businessRuleID": prepareDataToSend(evt.rule.id),"chatID": prepareDataToSend(CHM.getChatID()),"businessUnitID": prepareDataToSend( evt.rule && evt.rule.businessUnitID ? evt.rule.getBusinessUnitID() : rule.getBusinessUnitID()),"inHOP": prepareDataToSend(evt.inHOP),"targetAgentAttributes": prepareDataToSend(evt.rule.getAgentAttributesAsString()),"brAttributes": prepareDataToSend(evt.rule.getRuleAttributesAsString())}
						);

				}
			}), 
			Rule.create({
				id:814,
				name:"ServiceEngaged Rule", 
				vars:[],
				triggers:function(rule) {return [{id:"onServiceEngaged"} ]},
				conditionalFcn: function(rule,evt){
					return (true);
				},
				actionFcn: function(rule, evt){
					
					EVM.fireCustomEvent('EngagedEvent', rule, evt,
						function() {
							return { businessUnitID: evt.rule.getBusinessUnitID() ,  rule: evt.rule };
						},
						true
					);
				}
			}), 
			Rule.create({
				id:813,
				name:"Move Inc State Through Funnel Rule", 
				vars:[],
				triggers:function(rule) {return [{id:"on"+"IncStateFunnelTransition"} ]},
				conditionalFcn: function(rule,evt){
					return (true);
				},
				actionFcn: function(rule, evt){
					
					if (parseFloat(PM.getVar("incStatesMap",rule).getValue().get(PM.getVar("incState",rule).getValue())) < parseFloat(PM.getVar("incStatesMap",rule).getValue().get(evt.newState))) {
	
					PM.getVar("incState", rule).setValue((exists(evt.newState) ? evt.newState.toString() : ""));
					}  
				}
			}), 
			Rule.create({
				id:815,
				name:"Engaged Rule", 
				vars:[],
				triggers:function(rule) {return [{id:"on"+"EngagedEvent"} ]},
				conditionalFcn: function(rule,evt){
					return (true);
				},
				actionFcn: function(rule, evt){
					
					if (!(CHM.getChatID().equals(PM.getVar("engagedChatID",rule).getValue(), false))) {
	
					PM.getVar("engagedChatID", rule).setValue(CHM.getChatID());
					EVM.fireCustomEvent('IncStateFunnelTransition', rule, evt,
						function() {
							return { newState: getConstant("INC_STATE_ENGAGED", rule) };
						},
						true
					);
						ROM.send(
							resources["INC_EVENT_URL"].url,
							{"evt": prepareDataToSend(getConstant("INC_STATE_ENGAGED", rule)),"siteID": prepareDataToSend(getSiteID()),"pageID": prepareDataToSend(LDM.getPageID(0)),"customerID": prepareDataToSend(Inq.getCustID()),"incrementalityID": prepareDataToSend(getIncAssignmentID()),"sessionID": prepareDataToSend(getSessionID()),"brID": prepareDataToSend(CHM.getChat().getRuleId()),"chatID": prepareDataToSend(CHM.getChatID()),"businessUnitID": prepareDataToSend(evt.rule.getBusinessUnitID()),"targetAgentAttributes": prepareDataToSend(CHM.getChat().getAgentAttributesAsString()),"brAttributes": prepareDataToSend(CHM.getChat().getRuleAttributesAsString()),"visitorAttributes": prepareDataToSend((exists(VAM.getCopyAsArray().join(";")) ? VAM.getCopyAsArray().join(";").toString() : ""))}
						);

					}  
				}
			}), 
			Rule.create({
				id:820,
				name:"Fire Interacted Event Rule", 
				vars:[],
				triggers:function(rule) {return [{id:"onServiceInteracted"} ]},
				conditionalFcn: function(rule,evt){
					return (true);
				},
				actionFcn: function(rule, evt){
					
					EVM.fireCustomEvent('InteractedEvent', rule, evt,
						function() {
							return { businessUnitID: CHM.getChat().getBusinessUnitID() };
						},
						true
					);
				}
			}), 
			Rule.create({
				id:821,
				name:"Interacted Rule", 
				vars:[],
				triggers:function(rule) {return [{id:"on"+"InteractedEvent"} ]},
				conditionalFcn: function(rule,evt){
					return (true);
				},
				actionFcn: function(rule, evt){
					
					if (!(CHM.getChatID().equals(PM.getVar("interactedChatID",rule).getValue(), false))) {
	
					PM.getVar("interactedChatID", rule).setValue(CHM.getChatID());
					EVM.fireCustomEvent('IncStateFunnelTransition', rule, evt,
						function() {
							return { newState: getConstant("INC_STATE_INTERACTED", rule) };
						},
						true
					);
					PM.getVar("incExempt", rule).setValue(true);
						ROM.send(
							resources["INC_EVENT_URL"].url,
							{"evt": prepareDataToSend(getConstant("INC_STATE_INTERACTED", rule)),"siteID": prepareDataToSend(getSiteID()),"pageID": prepareDataToSend(LDM.getPageID(0)),"customerID": prepareDataToSend(Inq.getCustID()),"incrementalityID": prepareDataToSend(getIncAssignmentID()),"sessionID": prepareDataToSend(getSessionID()),"brID": prepareDataToSend(CHM.getChat().getRuleId()),"chatID": prepareDataToSend(CHM.getChatID()),"businessUnitID": prepareDataToSend(CHM.getChat().getBusinessUnitID()),"targetAgentAttributes": prepareDataToSend(CHM.getChat().getAgentAttributesAsString()),"brAttributes": prepareDataToSend(CHM.getChat().getRuleAttributesAsString()),"type": prepareDataToSend(CHM.getConversionType())}
						);

					}  
				}
			}), 
			Rule.create({
				id:830,
				name:"Converted Rule", 
				vars:[],
				triggers:function(rule) {return [{id:"on"+"SaleLanding"} ]},
				conditionalFcn: function(rule,evt){
					return (true);
				},
				actionFcn: function(rule, evt){
					
					PM.getVar("incState", rule).setValue(getConstant("INC_STATE_CONVERTED", rule));
					EVM.fireCustomEvent('ConvertedEvent', rule, evt,
						function() {
							return { businessUnitID: CHM.getLastChat().businessUnitID };
						},
						true
					);
						ROM.send(
							resources["INC_EVENT_URL"].url,
							{"evt": prepareDataToSend(getConstant("INC_STATE_CONVERTED", rule)),"siteID": prepareDataToSend(getSiteID()),"pageID": prepareDataToSend(LDM.getPageID(0)),"customerID": prepareDataToSend(Inq.getCustID()),"incrementalityID": prepareDataToSend(getIncAssignmentID()),"sessionID": prepareDataToSend(getSessionID()),"group": prepareDataToSend(PM.getVar("incGroup",rule).getValue()),"products": prepareDataToSend((exists(safe("inqSalesProducts"))  ? safe("inqSalesProducts") : null)),"quantities": prepareDataToSend((exists(safe("inqSalesQuantities"))  ? safe("inqSalesQuantities") : null)),"prices": prepareDataToSend((exists(safe("inqSalesPrices"))  ? safe("inqSalesPrices") : null)),"productTypes": prepareDataToSend((exists(safe("inqSalesProductTypes"))  ? safe("inqSalesProductTypes") : null)),"products2": prepareDataToSend((exists(safe("inqSalesProducts2"))  ? safe("inqSalesProducts2") : null)),"quantities2": prepareDataToSend((exists(safe("inqSalesQuantities2"))  ? safe("inqSalesQuantities2") : null)),"prices2": prepareDataToSend((exists(safe("inqSalesPrices2"))  ? safe("inqSalesPrices2") : null)),"productTypes2": prepareDataToSend((exists(safe("inqSalesProductTypes2"))  ? safe("inqSalesProductTypes2") : null)),"orderType": prepareDataToSend((exists(safe("inqOrderType"))  ? safe("inqOrderType") : null)),"customerName": prepareDataToSend((exists(safe("inqCustomerName"))  ? safe("inqCustomerName") : null)),"orderID": prepareDataToSend((exists(safe("inqClientOrderNum"))  ? safe("inqClientOrderNum") : null)),"testOrder": prepareDataToSend((exists(safe("inqTestOrder"))  ? safe("inqTestOrder") : null)),"otherInfo": prepareDataToSend((exists(safe("inqOtherInfo"))  ? safe("inqOtherInfo") : null)),"clientTimestamp": prepareDataToSend((exists(safe("inqClientTimeStamp"))  ? safe("inqClientTimeStamp") : null)),"businessUnitID": prepareDataToSend(CHM.getLastChat().businessUnitID),"visitorAttributes": prepareDataToSend((exists(VAM.getCopyAsArray().join(";")) ? VAM.getCopyAsArray().join(";").toString() : ""))}
						);

				}
			}), 
			Rule.create({
				id:850,
				name:"Set Service Missed Rule", 
				vars:[],
				triggers:function(rule) {return [{id:"onServiceMissed"} ]},
				conditionalFcn: function(rule,evt){
					return ((exists(evt.serviceType) ? evt.serviceType.toString() : "").equals("POPUP", false));
				},
				actionFcn: function(rule, evt){
					
					PM.getVar("svcMissed", rule).setValue(parseFloat(evt.rule.id));
				}
			}), 
			Rule.create({
				id:855,
				name:"Clear Service Missed Rule and update lco", 
				vars:[],
				triggers:function(rule) {return [{id:"onServiceInvitation"} ]},
				conditionalFcn: function(rule,evt){
					return ("POPUP".equals((exists(evt.serviceType) ? evt.serviceType.toString() : ""), false));
				},
				actionFcn: function(rule, evt){
					
					PM.getVar("svcMissed", rule).setValue(-1.0);
						PM.getVar("lco", rule).setValue(new Date());
				}
			}), 
			Rule.create({
				id:900,
				name:"Frequency Metric Rule", 
				vars:[],
				triggers:function(rule) {return [{id:"on"+"NewSession"} ]},
				conditionalFcn: function(rule,evt){
					return (true);
				},
				actionFcn: function(rule, evt){
					
					if (PM.getVar("loyalty",rule).getValue() > 1.0) {
	
					PM.getVar("freq", rule).setValue((Math.round(PM.getVar("lst",rule).getValue().diff(PM.getVar("fst",rule).getValue())/(1000))  / (PM.getVar("loyalty",rule).getValue()  - 1.0)));
					}   else {
	
					PM.getVar("freq", rule).setValue(0.0);
					}
				}
			}), 
			Rule.create({
				id:910,
				name:"Last n Session Time Rule", 
				vars:[],
				triggers:function(rule) {return [{id:"on"+"NewSession"} ]},
				conditionalFcn: function(rule,evt){
					return (true);
				},
				actionFcn: function(rule, evt){
					
					if (exists(PM.getVar("lst",rule).getValue())) {
	
						PM.getVar("nSesT", rule).prepend([PM.getVar("lst",rule).getValue()]);
						
					}  
				}
			}), 
			Rule.create({
				id:920,
				name:"Session Time Reset", 
				vars:[],
				triggers:function(rule) {return [{id:"on"+"NewSession"} ]},
				conditionalFcn: function(rule,evt){
					return (true);
				},
				actionFcn: function(rule, evt){
					
					PM.getVar("sesT", rule).setValue(0.0);
				}
			}), 
			Rule.create({
				id:930,
				name:"Session and Site Time Update", 
				vars:[],
				triggers:function(rule) {return [{id:"onAgentMsg"}, {id:"onCustomerMsg"}, {id:"onPageLanding"} ]},
				conditionalFcn: function(rule,evt){
					return (true);
				},
				actionFcn: function(rule, evt){
					
					PM.getVar("siteT", rule).setValue((PM.getVar("siteT",rule).getValue()  + (parseFloat(Math.round(PM.getVar("ltt",rule).getValue().diff(PM.getVar("lst",rule).getValue())/(1000)))  - PM.getVar("sesT",rule).getValue())));
					PM.getVar("sesT", rule).setValue(parseFloat(Math.round(PM.getVar("ltt",rule).getValue().diff(PM.getVar("lst",rule).getValue())/(1000))));
				}
			}), 
			Rule.create({
				id:940,
				name:"Customer IP Resolution", 
				vars:[],
				triggers:function(rule) {return [{id:"onPageLanding"} ]},
				conditionalFcn: function(rule,evt){
					return (!(exists(PM.getVar("custHost",rule).getValue())));
				},
				actionFcn: function(rule, evt){
					
						CallRemote.create({
							doCallbackActions: function(data){
								
					PM.getVar("custHost", rule).setValue((exists(data.hostName) ? data.hostName.toString() : ""));
							}
						}).callRemote(
							resources["RESOLVE_IP_CONTROLLER"].url,
							{"ip": prepareDataToSend(Inq.getCustIP())}
						);
				}
			}), 
			Rule.create({
				id:945,
				name:"resetFunnelLevel", 
				vars:[],
				triggers:function(rule) {return [{id:"onPageLanding"} ]},
				conditionalFcn: function(rule,evt){
					return ((exists(PM.getVar("lco",rule).getValue())) && (new Date().after(PM.getVar("lco",rule).getValue().roll(getConstant("RECHAT_INTERVAL", rule)))));
				},
				actionFcn: function(rule, evt){
					
					PM.getVar("cfl", rule).setValue(getConstant("MAX_LONG", rule));
				}
			}), 
			Rule.create({
				id:950,
				name:"CurrentFunnelLevelUpdater Rule", 
				vars:[],
				triggers:function(rule) {return [{id:"onChatLaunched", serviceType:"ALL"} ]},
				conditionalFcn: function(rule,evt){
					return ((!(exists(evt.rule.getConstant('ifl')))) && (exists(evt.rule.getConstant('fl'))) && (PM.getVar("cfl",rule).getValue() > parseFloat(evt.rule.getConstant('fl'))));
				},
				actionFcn: function(rule, evt){
					
					PM.getVar("cfl", rule).setValue(parseFloat(evt.rule.getConstant('fl')));
				}
			}), 
			Rule.create({
				id:960,
				name:"Call Closed Rule", 
				vars:[],
				triggers:function(rule) {return [{id:"onChatClosed", serviceType:"POPUP_CALL"}, {id:"onChatClosed", serviceType:"C2CALL"} ]},
				conditionalFcn: function(rule,evt){
					return (true);
				},
				actionFcn: function(rule, evt){
					
					PM.getVar("continueTrackingAfterCallClose", rule).setValue(true);
					PM.getVar("lastCallId", rule).setValue(CHM.getChatID());
					PM.getVar("lastCallAgentId", rule).setValue(CHM.getAgentID());
				}
			}), 
			Rule.create({
				id:970,
				name:"Continue Tracking After Call Close Rule", 
				vars:[],
				triggers:function(rule) {return [{id:"onPageLanding"} ]},
				conditionalFcn: function(rule,evt){
					return (PM.getVar("continueTrackingAfterCallClose",rule).getValue());
				},
				actionFcn: function(rule, evt){
					
						CallRemote.create({
							doCallbackActions: function(data){
								
					if ((new Boolean(data.agentInChat)).valueOf()) {
	
					ROM.send(
						urls.baseURL+"/tracking/agent",
						{
							"URL": prepareDataToSend(LDM.getCurrentPageURL()),"markerID": prepareDataToSend(LDM.getPageMarker()),
							agentID:PM.getVar("lastCallAgentId",rule).getValue(),
							chatID:PM.getVar("lastCallId",rule).getValue()
						}
					);

					}   else {
	
					PM.getVar("continueTrackingAfterCallClose", rule).setValue(false);
					}
							}
						}).callRemote(
							resources["IS_AGENT_IN_CHAT"].url,
							{"chatID": prepareDataToSend(PM.getVar("lastCallId",rule).getValue())}
						);
				}
			}), 
			Rule.create({
				id:980,
				name:"Baynote Event API Rule", 
				vars:[],
				triggers:function(rule) {return [{id:"on"+"BaynoteVisitEvent"}, {id:"on"+"BaynoteLingerEvent"}, {id:"on"+"BaynoteExitEvent"} ]},
				conditionalFcn: function(rule,evt){
					return (!("".equals(getConstant("BAYNOTE_CUSTOMER_ID", rule), false)));
				},
				actionFcn: function(rule, evt){
					
						ROM.send(
							getConstant("BAYNOTE_EVENT_API_URL", rule).replace(/customerid/g, getConstant("BAYNOTE_CUSTOMER_ID", rule)).replace(/code/g, getConstant("BAYNOTE_CODE", rule)),
							MixIns.mixMutatable(evt).set("v", 1.0)
						);

				}
			}), 
			Rule.create({
				id:981,
				name:"Baynote Visit Event Rule", 
				vars:[],
				triggers:function(rule) {return [{id:"onPageLanding"} ]},
				conditionalFcn: function(rule,evt){
					return (!("".equals(getConstant("BAYNOTE_CUSTOMER_ID", rule), false)));
				},
				actionFcn: function(rule, evt){
					
					if ((exists(safe("inqSalesProducts"))) && (exists(safe("inqSalesQuantities")))) {
	
					PM.getVar("baynoteATParams",rule).set("at", FM.callExternal(FM.getFcn("baynoteSaleValue")));
					}  
					PM.getVar("baynoteATParams",rule).set("at.query", PM.getVar("siteSearchTerms",rule).getValue());
					EVM.fireCustomEvent('BaynoteVisitEvent', rule, evt,
						function() {
							return Array.prepareMapToSerialize(PM.getVar("baynoteATParams",rule).getValue());
						},
						true
					);
				}
			}), 
			Rule.create({
				id:982,
				name:"Baynote Linger Event Rule", 
				vars:[],
				triggers:function(rule) {return [{id:"onPageLanding", delayInMS:getConstant("BAYNOTE_LINGER_DU", rule)} ]},
				conditionalFcn: function(rule,evt){
					return (!("".equals(getConstant("BAYNOTE_CUSTOMER_ID", rule), false)));
				},
				actionFcn: function(rule, evt){
					
					EVM.fireCustomEvent('BaynoteLingerEvent', rule, evt,
						function() {
							return Array.prepareMapToSerialize(PM.getVar("baynoteATParams",rule).getValue());
						},
						true
					);
				}
			}), 
			Rule.create({
				id:983,
				name:"Baynote Page Exit Hook Rule", 
				vars:[],
				triggers:function(rule) {return [{id:"onPageLanding"} ]},
				conditionalFcn: function(rule,evt){
					return ((!("".equals(getConstant("BAYNOTE_CUSTOMER_ID", rule), false))) && ((("IE" == getClientBrowserType())
) || (("FF" == getClientBrowserType())
)));
				},
				actionFcn: function(rule, evt){
										Inq.EH.doInit(this);
				}
			}), 
			Rule.create({
				id:984,
				name:"Baynote Exit Event BeforeUnload Rule", 
				vars:[],
				triggers:function(rule) {return [{id:"onBeforeUnload"} ]},
				conditionalFcn: function(rule,evt){
					return ((!("".equals(getConstant("BAYNOTE_CUSTOMER_ID", rule), false))) && ((("IE" == getClientBrowserType())
) || (("FF" == getClientBrowserType())
)));
				},
				actionFcn: function(rule, evt){
					
					EVM.fireCustomEvent('BaynoteExitEvent', rule, evt,
						function() {
							return Array.prepareMapToSerialize(PM.getVar("baynoteATParams",rule).getValue());
						},
						true
					);
				}
			}), 
			Rule.create({
				id:985,
				name:"Baynote Exit Event MouseDown Rule", 
				vars:[],
				triggers:function(rule) {return [{id:"mousedown", domElements:[doc.getElementsByTagName("a")]} ]},
				conditionalFcn: function(rule,evt){
					return ((!("".equals(getConstant("BAYNOTE_CUSTOMER_ID", rule), false))) && ((("CHROME" == getClientBrowserType())
) || (("SAFARI" == getClientBrowserType())
)) && ((new Boolean(FM.exec(
									 function(){
										var a = ["", "_self", "_parent", "_top"];
										var willMainWinExit = a.contains(evt.target.target); // target is either _blank or an IFrame name
										return willMainWinExit;
									}
								))).valueOf()));
				},
				actionFcn: function(rule, evt){
					
					EVM.fireCustomEvent('BaynoteExitEvent', rule, evt,
						function() {
							return Array.prepareMapToSerialize(PM.getVar("baynoteATParams",rule).getValue());
						},
						true
					);
				}
			}), 
			Rule.create({
				id:986,
				name:"Update Assigned Agent On Transfer", 
				vars:[],
				triggers:function(rule) {return [{id:"onAgentAssigned"} ]},
				conditionalFcn: function(rule,evt){
					return (PM.getVar("incState",rule).getValue().equals(getConstant("INC_STATE_ASSISTED", rule), false));
				},
				actionFcn: function(rule, evt){
					
					PM.getVar("assistAgt", rule).setValue(CHM.getAgentID());
				}
			}), 
			Rule.create({
				id:990,
				name:"sale state transition listener rule", 
				vars:[],
				triggers:function(rule) {return [{id:"on"+"SaleStateTransition"} ]},
				conditionalFcn: function(rule,evt){
					return (true);
				},
				actionFcn: function(rule, evt){
					
						ROM.send(
							resources["JASPER_ETL"].url,
							MixIns.mixMutatable().set("_domain", "sale").set("evt", "state-change").set("customerID", Inq.getCustID()).set("siteID", getSiteID()).set("pageID", LDM.getPageID()).set("oldSaleState", evt.oldSaleState).set("saleState", PM.getVar("saleState",rule).getValue()).set("sessionID", getSessionID()).set("assistChatID", PM.getVar("assistChatID",rule).getValue()).set("chatID", CHM.getChatID()).set("oldAssistAgt", evt.oldAssistAgt).set("assistAgt", evt.assistAgt)
						);

				}
			})
]
		.append(
         	[]
		).append(
                [
			Rule.create({
				id:400,
				name:"MobileSuppression", 
				vars:[],
				triggers:function(rule) {return [{id:"onPageLanding"} ]},
				conditionalFcn: function(rule,evt){
					return (isDeviceType("Unsupported"));
				},
				actionFcn: function(rule, evt){
					
					Inq.blockServices(["ALL"], -1);
				}
			}), 
			BusinessRule.create({
				id: 1,
				name:"Click2Chat Rule 1",
				funnelLevel:5,
				vars:[],
				triggers:function(rule) {return [{id:"onPageLanding"} ]},
                getAAtts: function(){return [];},
                
                
				getRAtts: function (){return []},
				
				conditionalFcn: function(rule,evt){
					return (true);
				},
				actionFcn: function(rule,evt){
					
					C2CM.request(rule, CHM.CHAT_TYPES.C2C, function(rule){ return {	id:2.0
}; } , false);
				}
			})
, 
			BusinessRule.create({
				id: 2,
				name:"TC Solutions 5 Second Proactive Rule",
				funnelLevel:5,
				vars:[],
				triggers:function(rule) {return [{id:"onPageLanding", delayInMS:5000} ]},
                getAAtts: function(){return [];},
                
                
				getRAtts: function (){return []},
				
				conditionalFcn: function(rule,evt){
					return ((LDM.getPageMarker() ? LDM.getPageMarker().startsWith("TC_SOL_", true) : false));
				},
				actionFcn: function(rule,evt){
					
					ServiceLauncher.c({rule:rule, chatType:CHM.CHAT_TYPES.POPUP , chatSpec:{id:2.0}
}).request();
				}
			})

]
        ),
		queueDefaults: qDefaults
	});

	var MSG = new MessageMgr();

	var CHM = ChatMgr.getInstance({
		thankYouShown: true,
		thankYouEnabled:true,
		displayTYImage: true,
		CHAT_TYPES: {C2C:"C2C", C2CALL: "C2CALL", POPUP:"POPUP", POPUP_CALL: "POPUP_CALL", PERSISTENT:"PERSISTENT", MONITOR:"MONITOR", CONVERSIVE:"CONVERSIVE"}
	});

	var SVYM = new SurveyMgr(
    	{
			
				2: {id:2, x:0, y:0, w:30, h:30, altURL:"http://www.keysurvey.com/survey/267053/e7f8/?LQID=1&&surveyID=267053"}
}
	);

	var FP = new FlashPeer("FP", {}) ;


    var CBM = new CobrowseMgr("CBM", {
        cobrowseMaskingConfig: ([   
       
]),
        isEmbeddedResource: function(url, markerID){
var isMarkerMatch = true;

    return false;
}
    }, '');


	/* ExitConfirm is not a manager, but acts the same way as managers when it concerns event handling. */
	var EC = new ExitConfirm();

	var EH = new ExitHook();

	
	var DT = new AutomatonDT();

    var programVars = [
		new Variable("loyalty", 0.0, resources["state"], "_loy", function(o){ return parseFloat(o);}), 
		new Variable("sesID",null, resources["session"], "_ssID", function(o){ return o?o.toString():o;}), 
		new DateVar("ltt", null, resources["session"], "ltt"), 
		new DateVar("lco", null, resources["state"], "lco"), 
		new DateVar("fst", null, resources["state"], "fst"), 
		new DateVar("lst", null, resources["state"], "lst"), 
		new Variable("freq", null, resources["state"], "_f", function(o){ return parseFloat(o);}), 
		new Variable("sesT", null, resources["session"], "_sT", function(o){ return parseFloat(o);}), 
		new DateListVar("nSesT", [], resources["state"], "_ssQ", 5), 
		new Variable("siteT", null, resources["state"], "_sesT", function(o){ return parseFloat(o);}), 
		new Variable("saleValue", null, resources["state"], "_slV", function(o){ return parseFloat(o);}), 
		new ListVariable("nSalesID", [], resources["state"], "_slq"), 
		new Variable("chatCnt", 0.0, resources["state"], "_cct", function(o){ return parseFloat(o);}), 
		new Variable("salesQualificationCount", 0.0, resources["state"], "_sqc", function(o){ return parseFloat(o);}), 
		new DateVar("soldDT", null, resources["vital"], "_sdt"), 
		new DateVar("oldSoldDT", null, resources["tmpVars"], "_osQ"), 
		new Variable("assistAgt",null, resources["vital"], "_aa", function(o){ return o?o.toString():o;}), 
		new Variable("oldAssistAgt",null, resources["tmpVars"], "_oaa", function(o){ return o?o.toString():o;}), 
		new DateVar("assistDT", null, resources["vital"], "_adt"), 
		new DateVar("oldAssistDT", null, resources["tmpVars"], "_oadt"), 
		new Variable("assistChatID","-1", resources["vital"], "_acid", function(o){ return o?o.toString():o;}), 
		new Variable("engagedChatID",null, resources["session"], "_ecID", function(o){ return o?o.toString():o;}), 
		new Variable("interactedChatID",null, resources["session"], "_icID", function(o){ return o?o.toString():o;}), 
		new Variable("oldAssistChatID",null, resources["tmpVars"], "_oaci", function(o){ return o?o.toString():o;}), 
		new Variable("asstRuleID",null, resources["vital"], "_arid", function(o){ return o?o.toString():o;}), 
		new Variable("oldAsstRuleID",null, resources["tmpVars"], "_oari", function(o){ return o?o.toString():o;}), 
		new Variable("asstRuleName",null, resources["vital"], "_arn", function(o){ return o?o.toString():o;}), 
		new Variable("oldAsstRuleName",null, resources["tmpVars"], "_oarn", function(o){ return o?o.toString():o;}), 
		new Variable("saleLC", 0.0, resources["state"], "_slc", function(o){ return parseFloat(o);}), 
		new Variable("saleState",getConstant("SALE_STATE_UNSOLD", rule), resources["vital"], "_ss", function(o){ return o?o.toString():o;}), 
		new Variable("oldSaleState",null, resources["tmpVars"], "_oss", function(o){ return o?o.toString():o;}), 
		new Variable("saleID",null, resources["vital"], "_sID", function(o){ return o?o.toString():o;}), 
		new Variable("oldSaleID",null, resources["tmpVars"], "_osID", function(o){ return o?o.toString():o;}), 
		new DateVar("incStart", null, resources["state"], "_is"), 
		new Variable("incGroup",null, resources["state"], "_ig", function(o){ return o?o.toString():o;}), 
		new Variable("incID",null, resources["state"], "_iID", function(o){ return o?o.toString():o;}), 
		new Variable("incState",null, resources["state"], "_ist", function(o){ return o?o.toString():o;}), 
		new Variable("oldIncState",null, resources["tmpVars"], "_ois", function(o){ return o?o.toString():o;}), 
		new Variable("incExempt", null, resources["state"], "_iex", function(o){ return Boolean(o);}), 
		new Variable("svcMissed", -1.0, resources["session"], "_svMs", function(o){ return parseFloat(o);}), 
		new Variable("custHost",null, resources["state"], "_ch", function(o){ return o?o.toString():o;}), 
		new Variable("rd",null, resources["session"], "rd", function(o){ return o?o.toString():o;}), 
		new Variable("sest",null, resources["session"], "sest", function(o){ return o?o.toString():o;}), 
		new Variable("assistedType", getConstant("UNDEFINED_ASSISTED", rule), resources["session"], "_aTyp", function(o){ return parseFloat(o);}), 
		new Variable("cfl", getConstant("MAX_LONG", rule), resources["state"], "cfl", function(o){ return parseFloat(o);}), 
		new Variable("continueTrackingAfterCallClose", false, resources["session"], "cTACC", function(o){ return Boolean(o);}), 
		new Variable("lastCallId","0", resources["session"], "lcId", function(o){ return o?o.toString():o;}), 
		new Variable("lastCallAgentId",null, resources["session"], "lcaId", function(o){ return o?o.toString():o;}), 
		new Variable("r",safe("var a=window.name.split('_clientPageURL_'); window.name=(a[2]?a[0]+a[2]:a[0]); a[1]"), resources["rVar"], "r", function(o){ return o?o.toString():o;}), 
		new Variable("siteSearchTerms",URI.parseURI(win.document.URL).qMap[getConstant("SITE_SEARCH_QUERY_PARAM_NAME", rule)], resources["tmpVars"], "_sst", function(o){ return o?o.toString():o;}), 
		new MapVariable("baynoteATParams", [], resources["tmpVars"], "_batp"), 
		new MapVariable("incStatesMap", [{key:getConstant("INC_STATE_ELIGIBLE", rule), value:10.0} ,{key:getConstant("INC_STATE_TARGETED", rule), value:20.0} ,{key:getConstant("INC_STATE_EXPOSURE_QUALIFIED", rule), value:30.0} ,{key:getConstant("INC_STATE_EXPOSED", rule), value:40.0} ,{key:getConstant("INC_STATE_ENGAGED", rule), value:50.0} ,{key:getConstant("INC_STATE_INTERACTED", rule), value:60.0} ,{key:getConstant("INC_STATE_ASSISTED", rule), value:70.0} ,{key:getConstant("INC_STATE_CONVERTED", rule), value:80.0} ], resources["tmpVars"], "_ismp")
	];
    var businessVars = [
	];

    var programCustomEvents = [
		new CustomEvent({
			name: "NewSession",
			getEvtData: function(rule, evt) {
				return MixIns.mixAbsorber({ sessionID: getSessionID() ,  loyalty: PM.getVar("loyalty",rule).getValue() ,  timestamp: new Date() }).absorb(evt);
			}
		}),
		
		new CustomEvent({
			name: "SaleLanding",
			getEvtData: function(rule, evt) {
				return MixIns.mixAbsorber({ products: (exists(safe("inqSalesProducts"))  ? safe("inqSalesProducts") : null) ,  quantities: (exists(safe("inqSalesQuantities"))  ? safe("inqSalesQuantities") : null) ,  prices: (exists(safe("inqSalesPrices"))  ? safe("inqSalesPrices") : null) ,  productTypes: (exists(safe("inqSalesProductTypes"))  ? safe("inqSalesProductTypes") : null) ,  products2: (exists(safe("inqSalesProducts2"))  ? safe("inqSalesProducts2") : null) ,  quantities2: (exists(safe("inqSalesQuantities2"))  ? safe("inqSalesQuantities2") : null) ,  prices2: (exists(safe("inqSalesPrices2"))  ? safe("inqSalesPrices2") : null) ,  productTypes2: (exists(safe("inqSalesProductTypes2"))  ? safe("inqSalesProductTypes2") : null) ,  orderType: (exists(safe("inqOrderType"))  ? safe("inqOrderType") : null) ,  lc: PM.getVar("saleLC",rule).getValue() ,  customerID: Inq.getCustID() }).absorb(evt);
			},
			aliases:[
				{
					name: "onSaleEvent",
					getEvtData: function(rule) {
						return { products: (exists(safe("inqSalesProducts"))  ? safe("inqSalesProducts") : null) ,  quantities: (exists(safe("inqSalesQuantities"))  ? safe("inqSalesQuantities") : null) ,  prices: (exists(safe("inqSalesPrices"))  ? safe("inqSalesPrices") : null) ,  productTypes: (exists(safe("inqSalesProductTypes"))  ? safe("inqSalesProductTypes") : null) ,  total: FM.callExternal("saleValue") ,  products2: (exists(safe("inqSalesProducts2"))  ? safe("inqSalesProducts2") : null) ,  quantities2: (exists(safe("inqSalesQuantities2"))  ? safe("inqSalesQuantities2") : null) ,  prices2: (exists(safe("inqSalesPrices2"))  ? safe("inqSalesPrices2") : null) ,  productTypes2: (exists(safe("inqSalesProductTypes2"))  ? safe("inqSalesProductTypes2") : null) ,  orderType: (exists(safe("inqOrderType"))  ? safe("inqOrderType") : null) ,  lc: PM.getVar("saleLC",rule).getValue() ,  customerID: Inq.getCustID() };
					}
				}
			]
		}),
		
		new CustomEvent({
			name: "Assisted",
			getEvtData: function(rule, evt) {
				return MixIns.mixAbsorber({ agentID: CHM.getAgentID() ,  chatID: CHM.getChatID() ,  customerID: Inq.getCustID() }).absorb(evt);
			},
			aliases:[
				{
					name: "onSaleQualifiedEvent",
					getEvtData: function(rule) {
						return { agentID: PM.getVar("assistAgt",rule).getValue() ,  chatID: PM.getVar("assistChatID",rule).getValue() ,  customerID: Inq.getCustID() ,  bizRuleName: PM.getVar("asstRuleName",rule).getValue() };
					}
				}
			]
		}),
		
		new CustomEvent({
			name: "Converted",
			getEvtData: function(rule, evt) {
				return MixIns.mixAbsorber({ saleID: PM.getVar("saleID",rule).getValue() ,  agentID: PM.getVar("assistAgt",rule).getValue() ,  chatID: PM.getVar("assistChatID",rule).getValue() ,  customerID: Inq.getCustID() ,  products: (exists(safe("inqSalesProducts"))  ? safe("inqSalesProducts") : null) ,  quantities: (exists(safe("inqSalesQuantities"))  ? safe("inqSalesQuantities") : null) ,  prices: (exists(safe("inqSalesPrices"))  ? safe("inqSalesPrices") : null) ,  productTypes: (exists(safe("inqSalesProductTypes"))  ? safe("inqSalesProductTypes") : null) ,  products2: (exists(safe("inqSalesProducts2"))  ? safe("inqSalesProducts2") : null) ,  quantities2: (exists(safe("inqSalesQuantities2"))  ? safe("inqSalesQuantities2") : null) ,  prices2: (exists(safe("inqSalesPrices2"))  ? safe("inqSalesPrices2") : null) ,  productTypes2: (exists(safe("inqSalesProductTypes2"))  ? safe("inqSalesProductTypes2") : null) ,  orderType: (exists(safe("inqOrderType"))  ? safe("inqOrderType") : null) ,  lc: PM.getVar("saleLC",rule).getValue() }).absorb(evt);
			},
			aliases:[
				{
					name: "onSoldEvent",
					getEvtData: function(rule) {
						return { saleID: PM.getVar("saleID",rule).getValue() ,  agentID: PM.getVar("assistAgt",rule).getValue() ,  chatID: PM.getVar("assistChatID",rule).getValue() ,  customerID: Inq.getCustID() ,  products: (exists(safe("inqSalesProducts"))  ? safe("inqSalesProducts") : null) ,  quantities: (exists(safe("inqSalesQuantities"))  ? safe("inqSalesQuantities") : null) ,  prices: (exists(safe("inqSalesPrices"))  ? safe("inqSalesPrices") : null) ,  productTypes: (exists(safe("inqSalesProductTypes"))  ? safe("inqSalesProductTypes") : null) ,  products2: (exists(safe("inqSalesProducts2"))  ? safe("inqSalesProducts2") : null) ,  quantities2: (exists(safe("inqSalesQuantities2"))  ? safe("inqSalesQuantities2") : null) ,  prices2: (exists(safe("inqSalesPrices2"))  ? safe("inqSalesPrices2") : null) ,  productTypes2: (exists(safe("inqSalesProductTypes2"))  ? safe("inqSalesProductTypes2") : null) ,  orderType: (exists(safe("inqOrderType"))  ? safe("inqOrderType") : null) ,  lc: PM.getVar("saleLC",rule).getValue() };
					}
				}
			]
		}),
		
		new CustomEvent({
			name: "CustomerHostDomainResolved",
			getEvtData: function(rule, evt) {
				return MixIns.mixAbsorber({ hostName: PM.getVar("custHost",rule).getValue() ,  ip: Inq.getCustIP() }).absorb(evt);
			}
		}),
		
		new CustomEvent({
			name: "SaleStateTransition",
			getEvtData: function(rule, evt) {
				return MixIns.mixAbsorber({ chatID: CHM.getChatID() ,  customerID: Inq.getCustID() ,  oldAssistChatID: PM.getVar("oldAssistChatID",rule).getValue() ,  oldAssistDT: PM.getVar("oldAssistDT",rule).getValue() ,  oldAssistAgt: PM.getVar("oldAssistAgt",rule).getValue() ,  oldAsstRuleID: PM.getVar("oldAsstRuleID",rule).getValue() ,  oldAsstRuleName: PM.getVar("oldAsstRuleName",rule).getValue() ,  oldSaleState: PM.getVar("oldSaleState",rule).getValue() ,  oldIncState: PM.getVar("oldIncState",rule).getValue() ,  oldSaleID: PM.getVar("oldSaleID",rule).getValue() ,  oldSoldDT: PM.getVar("oldSoldDT",rule).getValue() ,  assistChatID: PM.getVar("assistChatID",rule).getValue() ,  assistDT: PM.getVar("assistDT",rule).getValue() ,  assistAgt: PM.getVar("assistAgt",rule).getValue() ,  asstRuleID: PM.getVar("asstRuleID",rule).getValue() ,  asstRuleName: PM.getVar("asstRuleName",rule).getValue() ,  saleState: PM.getVar("saleState",rule).getValue() ,  incState: PM.getVar("incState",rule).getValue() ,  saleID: PM.getVar("saleID",rule).getValue() ,  soldDT: PM.getVar("soldDT",rule).getValue() }).absorb(evt);
			}
		}),
		
		new CustomEvent({
			name: "EligibleEvent",
			getEvtData: function(rule, evt) {
				return MixIns.mixAbsorber({ siteID: getSiteID() ,  pageID: LDM.getPageID(0) ,  customerID: Inq.getCustID() ,  incrementalityID: getIncAssignmentID() ,  sessionID: getSessionID() ,  group: PM.getVar("incGroup",rule).getValue() ,  exempt: PM.getVar("incExempt",rule).getValue() ,  igdStart: PM.getVar("incStart",rule).getValue() ,  businessUnitID:  evt.rule && evt.rule.businessUnitID ? evt.rule.getBusinessUnitID() : rule.getBusinessUnitID() }).absorb(evt);
			},
			aliases:[
				{
					name: "onGroupAssignment",
					getEvtData: function(rule) {
						return { customerID: Inq.getCustID() ,  group: PM.getVar("incGroup",rule).getValue() };
					}
				}
			]
		}),
		
		new CustomEvent({
			name: "TargetedEvent",
			getEvtData: function(rule, evt) {
				return MixIns.mixAbsorber({ siteID: getSiteID() ,  pageID: LDM.getPageID(0) ,  customerID: Inq.getCustID() ,  incrementalityID: getIncAssignmentID() ,  sessionID: getSessionID() ,  group: PM.getVar("incGroup",rule).getValue() ,  brID: rule.getID() ,  businessUnitID:  evt.rule && evt.rule.businessUnitID ? evt.rule.getBusinessUnitID() : rule.getBusinessUnitID() }).absorb(evt);
			},
			aliases:[
				{
					name: "onTargeted",
					getEvtData: function(rule) {
						return { customerID: Inq.getCustID() ,  group: PM.getVar("incGroup",rule).getValue() ,  bizRuleName: rule.evt.rule.name };
					}
				}
			]
		}),
		
		new CustomEvent({
			name: "ExposedEvent",
			getEvtData: function(rule, evt) {
				return MixIns.mixAbsorber({ siteID: getSiteID() ,  pageID: LDM.getPageID(0) ,  customerID: Inq.getCustID() ,  incrementalityID: getIncAssignmentID() ,  sessionID: getSessionID() ,  brID: evt.rule.id ,  chatID: CHM.getChatID() ,  businessUnitID:  evt.rule && evt.rule.businessUnitID ? evt.rule.getBusinessUnitID() : rule.getBusinessUnitID() }).absorb(evt);
			}
		}),
		
		new CustomEvent({
			name: "EngagedEvent",
			getEvtData: function(rule, evt) {
				return MixIns.mixAbsorber({ siteID: getSiteID() ,  pageID: LDM.getPageID(0) ,  customerID: Inq.getCustID() ,  incrementalityID: getIncAssignmentID() ,  sessionID: getSessionID() ,  brID: evt.rule.id ,  chatID: CHM.getChatID() ,  businessUnitID:  evt.rule && evt.rule.businessUnitID ? evt.rule.getBusinessUnitID() : rule.getBusinessUnitID() }).absorb(evt);
			}
		}),
		
		new CustomEvent({
			name: "InteractedEvent",
			getEvtData: function(rule, evt) {
				return MixIns.mixAbsorber({ siteID: getSiteID() ,  pageID: LDM.getPageID(0) ,  customerID: Inq.getCustID() ,  incrementalityID: getIncAssignmentID() ,  sessionID: getSessionID() ,  brID: CHM.getChat().getRuleId() ,  chatID: CHM.getChatID() ,  businessUnitID:  evt.rule && evt.rule.businessUnitID ? evt.rule.getBusinessUnitID() : rule.getBusinessUnitID() ,  type: CHM.getConversionType() }).absorb(evt);
			}
		}),
		
		new CustomEvent({
			name: "AssistedEvent",
			getEvtData: function(rule, evt) {
				return MixIns.mixAbsorber({ siteID: getSiteID() ,  pageID: LDM.getPageID(0) ,  customerID: Inq.getCustID() ,  incrementalityID: getIncAssignmentID() ,  sessionID: getSessionID() ,  brID: CHM.getChat().getRuleId() ,  chatID: CHM.getChatID() ,  businessUnitID:  evt.rule && evt.rule.businessUnitID ? evt.rule.getBusinessUnitID() : rule.getBusinessUnitID() ,  type: CHM.getConversionType() }).absorb(evt);
			}
		}),
		
		new CustomEvent({
			name: "ConvertedEvent",
			getEvtData: function(rule, evt) {
				return MixIns.mixAbsorber({ siteID: getSiteID() ,  pageID: LDM.getPageID(0) ,  customerID: Inq.getCustID() ,  incrementalityID: getIncAssignmentID() ,  sessionID: getSessionID() ,  group: PM.getVar("incGroup",rule).getValue() ,  products: (exists(safe("inqSalesProducts"))  ? safe("inqSalesProducts") : null) ,  quantities: (exists(safe("inqSalesQuantities"))  ? safe("inqSalesQuantities") : null) ,  prices: (exists(safe("inqSalesPrices"))  ? safe("inqSalesPrices") : null) ,  productTypes: (exists(safe("inqSalesProductTypes"))  ? safe("inqSalesProductTypes") : null) ,  products2: (exists(safe("inqSalesProducts2"))  ? safe("inqSalesProducts2") : null) ,  quantities2: (exists(safe("inqSalesQuantities2"))  ? safe("inqSalesQuantities2") : null) ,  prices2: (exists(safe("inqSalesPrices2"))  ? safe("inqSalesPrices2") : null) ,  productTypes2: (exists(safe("inqSalesProductTypes2"))  ? safe("inqSalesProductTypes2") : null) ,  orderType: (exists(safe("inqOrderType"))  ? safe("inqOrderType") : null) ,  orderID: (exists(safe("inqClientOrderNum"))  ? safe("inqClientOrderNum") : null) ,  clientTimestamp: (exists(safe("inqClientTimeStamp"))  ? safe("inqClientTimeStamp") : null) ,  testOrder: (exists(safe("inqTestOrder"))  ? safe("inqTestOrder") : null) ,  businessUnitID:  evt.rule && evt.rule.businessUnitID ? evt.rule.getBusinessUnitID() : rule.getBusinessUnitID() ,  total: FM.callExternal("saleValue") }).absorb(evt);
			},
			aliases:[
				{
					name: "onConversion",
					getEvtData: function(rule) {
						return { customerID: Inq.getCustID() ,  group: PM.getVar("incGroup",rule).getValue() ,  bizRuleName: PM.getVar("asstRuleName",rule).getValue() };
					}
				}
			]
		}),
		
		new CustomEvent({
			name: "SurveyLaunched",
			getEvtData: function(rule, evt) {
				return MixIns.mixAbsorber({ siteID: getSiteID() }).absorb(evt);
			}
		}),
		
		new CustomEvent({
			name: "PreChatSurveyComplete",
			getEvtData: function(rule, evt) {
				return MixIns.mixAbsorber({}).absorb(evt);
			}
		}),
		
		new CustomEvent({
			name: "BaynoteVisitEvent",
			getEvtData: function(rule, evt) {
				return MixIns.mixAbsorber({ customerId: getConstant("BAYNOTE_CUSTOMER_ID", rule) ,  code: getConstant("BAYNOTE_CODE", rule) ,  a: "v" ,  c: "d&g&s" ,  d: LDM.getCurrentPageURL() ,  t: Math.round(new Date().diff(new Date(28800000))/(1)) ,  r: PM.getVar('r').getValue()?PM.getVar('r').getValue():(URI.parseURI(doc.referrer).qMap._clientPageURL?URI.parseURI(doc.referrer).qMap._clientPageURL:doc.referrer).toString() ,  u: Inq.getCustID() }).absorb(evt);
			}
		}),
		
		new CustomEvent({
			name: "BaynoteLingerEvent",
			getEvtData: function(rule, evt) {
				return MixIns.mixAbsorber({ customerId: getConstant("BAYNOTE_CUSTOMER_ID", rule) ,  code: getConstant("BAYNOTE_CODE", rule) ,  a: "l" ,  c: "d&g&s" ,  d: LDM.getCurrentPageURL() ,  t: Math.round(new Date().diff(new Date(28800000))/(1)) ,  r: PM.getVar('r').getValue()?PM.getVar('r').getValue():(URI.parseURI(doc.referrer).qMap._clientPageURL?URI.parseURI(doc.referrer).qMap._clientPageURL:doc.referrer).toString() ,  u: Inq.getCustID() ,  de_ti: safe("document.title") ,  du: (getConstant("BAYNOTE_LINGER_DU", rule)  / 1000.0) ,  de_ti: safe("document.title") }).absorb(evt);
			}
		}),
		
		new CustomEvent({
			name: "BaynoteExitEvent",
			getEvtData: function(rule, evt) {
				return MixIns.mixAbsorber({ customerId: getConstant("BAYNOTE_CUSTOMER_ID", rule) ,  code: getConstant("BAYNOTE_CODE", rule) ,  a: "c" ,  c: "d&g&s" ,  d: LDM.getCurrentPageURL() ,  t: Math.round(new Date().diff(new Date(28800000))/(1)) ,  r: PM.getVar('r').getValue()?PM.getVar('r').getValue():(URI.parseURI(doc.referrer).qMap._clientPageURL?URI.parseURI(doc.referrer).qMap._clientPageURL:doc.referrer).toString() ,  u: Inq.getCustID() ,  de_ti: safe("document.title") }).absorb(evt);
			}
		}),
		
		new CustomEvent({
			name: "IncStateFunnelTransition",
			getEvtData: function(rule, evt) {
				return MixIns.mixAbsorber({ newState: "to be set by firing rule" }).absorb(evt);
			}
		}),
		
		new CustomEvent({
			name: "IframeC2C",
			getEvtData: function(rule, evt) {
				return MixIns.mixAbsorber({ c2cIFrameDomainName: getConstant("C2C_IFRAME_DOMAIN_NAME", rule) ,  queryData: "{}" }).absorb(evt);
			}
		})];
    var businessCustomEvents = [];
    var VAM = new VAMgr("VAM",{programVisitorAttributes: {"vis_attr_incr_val":{"values":{},"mutuallyExclusive":true}
},
                               businessVisitorAttributes: {} });
	var mgrList = [PM, CM, ROM, BRM, LDM, C2CM, CHM,
        
        CBM,
        
        VAM, MM, SVYM];

	var rechatInterval = parseInt('1');/* */
	var v3framesrc = "/TouchCommercetop.html";
    var v3TO = 45;
    var v3C2cPersistent = false;
    var xd = true;
	var initialized = false;
	var started = false;
	var multiHost=false;

	function getVar(varname, ruleID, optDflt){
		return PM.getVar(varname, BRM.getRuleById(ruleID)).getValue();
	}

	/**
	 * For publishing API with the publish-js-api-function action tag
	 * @param apiString an identifier to be added as a function to customner page.
	 * An example of such an identifier is "InqSaleMgr.getSaleID". This API would have to be invoked as
	 * InqSaleMgr.getSaleID() in a customer page.
	 * If apiString is not a composite identifier (no point separators) and customer page already possesses such object,
	 * it will be overwritten. If apiString is a composite identifier and customer page already possesses such object,
	 * this object will be supplemented. This is done to enable publishing several objects w/o overwriting previously published ones.
	 */
	function publishAPI(apiString, varid, ruleID, _win){
		if(!apiString) return false;
		var osa = apiString.split(".");
		var fcn = function(){ return getVar(varid, ruleID);};
		if(!_win) {
			_win = win;
	}
		var obj = _win;
		for(var idx=0; idx < osa.length; idx++){
		if (idx == osa.length - 1) {
			// a leaf object with the same name will be ovewritten
			obj[osa[idx]] = fcn;
		} else if (isNullOrUndefined(obj[osa[idx]])) {
			// if non-leaf object already exists, we will add to it
				obj[osa[idx]] = {};
		}
			obj = obj[osa[idx]];
		}
		return true;
	}

	/**
	 * Returns address of hosted file e.g. http://touchcommerce.com/TouchCommercetop.html
	 * Used as a location for proxy IFrames and other purposes.
	 * Please note: window.location.hostname is the host's name without the port number,
	 *              not window.location.host.  Please see the correct methodology of building the path from
	 *              cookie manager ChatMgr.prototype.againPopoutChat
	 */
	function getHostedFileUrl() {
		return window.location.protocol + "//" + window.location.hostname +
			((window.location.port=="")?"":":"+window.location.port) + v3framesrc;
	}

    /**
    * Returns "click to persistent" flag value
    */
    function isC2cPersistent(){
        return v3C2cPersistent;
    }

	/**
	 * Loads javascript from server.
	 * @param server server to use
	 * @param urlClean url to use when obfuscation is disabled
	 * @param urlObfuscated url to use when obfuscation is enabled
	 * @param initFunction function to call once script is loaded
	 */
	function loadScript(server, urlClean, urlObfuscated, initFunction, parameters) {
		var srctag = document.createElement("SC"+"RIPT");
		srctag.src = normalizeProtocol(server) + (true ? urlClean : urlObfuscated);
		srctag.type = "text/javascript";
		srctag.charset = "utf-8";
		srctag.language = "javascript";
		srctag._parameters = parameters;
		srctag._function = initFunction;
		srctag.onload = function () {
			this.onreadystatechange = null;	/* We can have a ready state change for both complete and loaded, and we only want one call to the initFunction */
			this.onload = null;
			this._function(this._parameters);
		};
		srctag.onreadystatechange = function() {// workaround for IE only
			if (this.readyState == 'complete' || this.readyState == 'loaded') {
				this.onreadystatechange = null;	/* We can have a ready state change for both complete and loaded, and we only want one call to the initFunction */
				this.onload = null;
				this._function(this._parameters);
			}
		};
		document.body.appendChild(srctag);
	}

	return {
		jdb: true,
		xd: xd,
		siteID: siteID,
		custID: custID,
		custIP: custIP,
		main: main,
		onDataReady: onDataReady,
		onRemoteCallback: onRemoteCallback,
		isFrameworkReady: isFrameworkReady,
		isDataReady: isDataReady,
		init: init,
		initXD: initXD,
		IFrameProxyCallback: IFrameProxyCallback,
		isThirdPartyCookiesEnabled: isThirdPartyCookiesEnabled,
		start: start,
		setFrameworkData: setFrameworkData,
		save: save,
		load: load,
		getID: getID,
		getCustID: getCustID,
		getCustIP: getCustIP,
		getSiteID: getSiteID,
		blockService: blockService,
		unblockService: unblockService,
		blockServices: blockServices,
		unblockServices: unblockServices,
		isServiceBlocked: isServiceBlocked,
		Drag: new Drag(),
		Resize: new Resize(),
		Rule:Rule,
		log: log,
		v3C2cPersistent: v3C2cPersistent,
		v3framesrc: v3framesrc,
		multiHost: multiHost,
		v3TO :  v3TO,
		rechatInterval: rechatInterval,
		isSameOrigin: isSameOrigin,
		doBusinessRuleActionList: doBusinessRuleActionList,
		doRuleActionList: doRuleActionList,
		createHiddenIFrame: createHiddenIFrame,
		createFloatingDiv: createFloatingDiv,
		wasSaleAction: wasSaleAction,

		urls: (urls),
		EVM: EVM,		 				// Event Mgr
		CM: CM,          				// Cookie mgr
		PM: PM,			 				// Persistence Mgr
		ROM: ROM,       				// Remote Operation Mgr
		BRM: BRM,						// Business Rules Mgr
		LDM: LDM,						// Landing Mgr
		C2CM: C2CM,						// Click2Chat Mgr
		CHM: CHM, ChatMgr: CHM,			// Chat Mgr

		CBM: CobrowseMgr,				// Co-Browse Manager

		reinitChat: reinitChat,  		// CUSTOMER API
		launchChatNow: launchChatNow,	// CUSTOMER API
		launchChatNowByPageID: launchChatNowByPageID,	// CUSTOMER API
		setChatSuppressedForSession: setChatSuppressedForSession, // CUSTOMER API
		FlashPeer: FP,   				// Flash Peer
		MSG: MSG,						// Message Manager
		DT: DT,							// AutomatonDT
		EC: EC,							// ExitConfirm object
		EH: EH   			            // ExitHook object
	};
})();

/* Tue Jun 25 22:07:20 PDT 2013 */
