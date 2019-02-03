/**
 * $Id$
 * 
 * 
 * Ref: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array
 */
$(function() {

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
			istablet = (/ipad|android 3|sch-i800|playbook|tablet|kindle|gt-p1000|sgh-t849|shw-m180s|a510|a511|a100|dell streak|silk/i.test(navigator.userAgent.toLowerCase()));
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
	 * Module of Array Qunit tests
	 */
	module("LocalStorage");

	test("Local Storage Test", function() {
		
		ok ( isLSSupported(), "LocalStorage is supported on your browser" );
	});
	
	test("Local Storage Test", function() {
		
		equal ( localStorage.getItem("pc"), 2, "LocalStorage is supported on your browser" + localStorage.getItem("pc"));
	});

});
