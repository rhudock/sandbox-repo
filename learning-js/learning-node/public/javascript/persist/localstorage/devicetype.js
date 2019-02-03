
/**
 * getDeviceType function used in a business rule.
 * 
 * @returns
 */
function getDeviceType(){
	var PHONE = 'Phone', TABLET = 'Tablet';
	var isPhone = (/iphone|ipod|android|blackberry|opera mini|opera mobi|skyfire|maemo|windows phone|palm|iemobile|symbian|symbianos|fennec/i.test(navigator.userAgent.toLowerCase()));
	var isTablet = (/ipad|android 3|sch-i800|playbook|tablet|kindle|gt-p1000|sgh-t849|shw-m180s|a510|a511|a100|dell streak|silk/i.test(navigator.userAgent.toLowerCase()));

	var deviceType = "Other";

    if ( isPhone === true ) {
    	deviceType = PHONE; 
    } else if ( isTablet === true ) {
    	deviceType = TABLET;
    } else if ( /mobile safari/i.test(navigator.userAgent.toLowerCase()) ) {
    	deviceType = PHONE;
    } 
    
    return deviceType;
}