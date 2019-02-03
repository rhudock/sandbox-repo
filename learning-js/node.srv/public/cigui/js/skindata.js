an : "Chris"   // agent name
cih : 35
ciw : 185
cn : "You"
d : true
dh : 315      // skin height
dw : 499      // skin width
fn : "BestBrands.zip"
id : 15000384
lx : 0         // skin left
ly : 0          // skin top
name : "BB"
ph : 315
pos : "CENTER"
pw : 499
px : 100
py : 100
tbh : 61        // toolbar height
wm : "TRANSPARENT"


agentName: window.top.agentName =
    userName: window.top.userName,
    closerWidth: window.top.closeIconWidth,
    skinHeight: window.top.skinHeight,
    skinWidth: window.top.skinWidth,
    titlebarHeight: window.top.titlebarHeight,
    skinLocation: window.top.flashPos,
    skinLeft: window.top.flashPosX,
    skinTop: window.top.flashPosY,
    deviceType: "Desktop",
    skinMXML: "",
    skinPath: window.top.skinPath,
    skinName: window.top.skinName,
    skinFileName: "http://tagserver.inq.com/tagserver/sites/306/flash/SprintCSSTest.mxml",// backwards compatability
    skinIsLocal: true

agentName : "Chris"   // agent name
cih : 35
closeIconWidth : 185
userName : "You"
d : true
skinHeight : 315      // skin height
skinWidth : 499      // skin width
skinName : "BestBrands.zip"
id : 15000384
lx : 0         // skin left
ly : 0          // skin top
name : "BB"
ph : 315
pos : "CENTER"
pw : 499
px : 100
py : 100
titlebarHeight : 61        // toolbar height
wm : "TRANSPARENT"

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
 * getPersistentXPos
 * Retrieves the x position of the popoutChat window from chattheme.
 * @returns number specifying the x position if available or 0 otherwise.
 */
function getPersistentXPos() {
    try {
        return Inq.CHM.chat.chatSpec.chatTheme.px;
    } catch(e){}
    return 0 ;
}

/*
 * getPersistentYPos
 * Retrieves the y position of the popoutChat window from chattheme.
 * @returns number specifying the y position if available or 0 otherwise.
 */
function getPersistentYPos() {
    try {
        return Inq.CHM.chat.chatSpec.chatTheme.py;
    } catch(e){}
    return 0 ;
}

/*
 * getPersistentWidth
 * Retrieves the width of the popoutChat window from chattheme.
 * @returns number specifying the width if available or 0 otherwise.
 */
function getPersistentWidth() {
    try {
        return Inq.CHM.chat.chatSpec.chatTheme.pw;
    } catch(e){}
    return 0 ;
}

/*
 * getPersistentHeight
 * Retrieves the height of the popoutChat window from chattheme.
 * @returns number specifying the height if available or 0 otherwise.
 */
function getPersistentHeight() {
    try {
        return Inq.CHM.chat.chatSpec.chatTheme.ph;
    } catch(e){}
    return 0 ;
}

/**
 * _getCustGeoData
 * @returns {JSONObject} current value of customer's geo data.
 * Format: {"country_code":"BY", "zip_code":"220007", "region_code":"MN"}
 */
function _getCustGeoData() {
    return getCustGeoData();
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
    return "TouchCommerce.mxml" ;
}