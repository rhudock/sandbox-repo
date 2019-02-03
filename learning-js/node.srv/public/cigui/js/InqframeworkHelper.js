


pilot = (function () {

    function init() {
        readMXMLFile(readyMXMLCallback);
    }

    function readMXMLFile(onReadyCallback) {
        var skinUrl = mockDBService.getDBValue("skinPath") + "/" + mockDBService.getDBValue("skinName") + ".mxml" + "?rand=" + Math.random();

        var xmlReq = (window.XMLHttpRequest)
            ? new XMLHttpRequest
            : (window.ActiveXObject)
                ? new ActiveXObject("Microsoft.XMLHTTP") : null;
        if (xmlReq) {
            //if (xmlReq.overrideMimeType)
            //  xmlReq.overrideMimeType('text/plain')
            xmlReq.open("GET", skinUrl);
            xmlReq.onreadystatechange = function (e) {
                if (xmlReq.readyState === 4 && xmlReq.status === 200) {
                    var mxmlData = xmlReq.responseText;
                    // this should be persistence manager, but we arent mocking everything yet- and for testing and builder we dont want to cache we are editing it
                    mockDBService.setDBProperty("skinMXML", mxmlData);
                    onReadyCallback();
                }

            };
            xmlReq.send(null);
        }

    }


    function mockPersistedState() {

        var inqIframe = window.document.getElementById("inqChatStage");
        inqIframe.contentWindow.com.inq.flash.client.control.ApplicationController.prototype.skinControl = inqIframe.contentWindow.com.inq.flash.client.chatskins.SkinControl;

        var showMinimized = false;
        if (window.top.showMinimized)
            showMinimized = window.top.showMinimized;
        if (showMinimized)
            inqIframe.contentWindow.com.inq.flash.client.control.PersistenceManager.SetValue("mc", 3);
        else
            inqIframe.contentWindow.com.inq.flash.client.control.PersistenceManager.SetValue("mc", inqIframe.contentWindow.com.inq.flash.client.control.MinimizeManager.NOT_MINIMIZED);

    }


    function initializeShowThankYou() {
        var inqIframe = window.document.getElementById("inqChatStage");

        if (window.top.showThankYou)
            inqIframe.contentWindow.com.inq.flash.client.chatskins.SkinControl.gotoThankyouScene();
        else {
            var thankYouDiv = inqIframe.contentWindow.document.getElementById("thankYou");
            if (thankYouDiv !== null)
                thankYouDiv.style.display = "none";
        }

    }


    function render() {
        var inqIframe = window.document.getElementById("inqChatStage");
        if (inqIframe.contentWindow.Application !== undefined) {
            inqIframe.contentWindow.Application.prototype.isConnected = function () {
                return true;
            };
            inqIframe.contentWindow.Application.prototype.isAgentAssigned = function () {
                return true;
            };
        }
        inqIframe.contentWindow.Application.main();
    }


    function readyMXMLCallback() {
        mockPersistedState();
        render();
        initializeShowThankYou();
    }

    return {
        init: init
    }

})();


/**
 *
 * Mock Event Manager
 * @type {{calculateButtonContainer}}
 */


var EventManager = (function closureEventManager() {

    var isOld = null;
    var inqIframe = null;
    var isDivChat = null;
    var activeWindow = null;
    var btnSend = null;

    var btnNameDictionary = {
        btnCloseChat: -1,
        btnMinimize: -1,
        btnEmail: -1,
        btnChime: -1,
        btnPrint: -1,
        btnFontSize: -1,
        buttonsAssigned: 0,
        buttonCount: 6
    };

    // called by whenLoaded handler for images
    function calculateButtonContainer(id) {
        // yes ists too bad this initializing code is called repeatedly, but its too early if we do it when this file loads
        resetContentWindow();
        var isCatoSkin = (window.document.getElementById("tcChat_btnCloseChat") !== null);
        var btnEmail = (isCatoSkin === true) ? window.document.getElementById("tcChat_btnEmail") : inqIframe.contentWindow.document.getElementById("btnEmail");
        if (isCatoSkin && btnNameDictionary.btnPopOut === null) {
            btnNameDictionary.btnPopOut = -1;//add the popOut button to dictionary
            btnNameDictionary.buttonCount = 7;// to use name index, its not an array, => no length
        }
        // special handler because email button is not set to display none - rather commented out
        if (btnEmail === null && btnNameDictionary.btnEmail !== 0) {
            btnNameDictionary.buttonCount = btnNameDictionary.buttonCount - 1;
            btnNameDictionary.btnEmail = 0;
        }


        if (btnNameDictionary[id] && btnNameDictionary[id] === -1) {
            btnNameDictionary[id] = getButtonWidth(id, isCatoSkin);
            btnNameDictionary.buttonsAssigned = btnNameDictionary.buttonsAssigned + 1;
        }
        // this is how we know all the titlebar buttons have loaded
        if (btnNameDictionary.buttonsAssigned === btnNameDictionary.buttonCount)
            totalTitleBarButtonsWidth();

    }

    function getButtonWidth(id, isCatoSkin) {
        var loadedBtnWidth = 0;
        resetContentWindow();
        var activeWindow = (isCatoSkin === true) ? window : inqIframe.contentWindow;
        if (isCatoSkin)
            id = "tcChat_" + id;
        var button = activeWindow.document.getElementById(id);
        var btnWidth = 0;
        var paddingLeft = 0;
        var paddingRight = 0;
        if (button && button.style.display !== "none") {
            if (window.getComputedStyle !== null) {
                btnWidth = activeWindow.getComputedStyle(button, null).width
                paddingLeft = activeWindow.getComputedStyle(button, null).paddingLeft;
                paddingRight = activeWindow.getComputedStyle(button, null).paddingRight;
            }
            else if (button.currentStyle.width !== null) {
                btnWidth = button.currentStyle.width;
                paddingLeft = button.currentStyle.paddingLeft;
                paddingRight = button.currentStyle.paddingRight;
            }

            btnWidth = btnWidth.replace("px", "");
            btnWidth = parseInt(btnWidth);
            paddingLeft = paddingLeft.replace("px", "");
            paddingLeft = parseInt(paddingLeft);
            paddingRight = paddingRight.replace("px", "");
            paddingRight = parseInt(paddingRight);

            if (!isNaN(btnWidth))
                loadedBtnWidth = btnWidth;
            if (!isNaN(paddingLeft))
                loadedBtnWidth = loadedBtnWidth + paddingLeft;
            if (!isNaN(paddingRight))
                loadedBtnWidth = loadedBtnWidth + paddingRight;
        }

        return loadedBtnWidth;
    }

    function resetContentWindow() {
        if (inqIframe === null || inqIframe.contentWindow === null) {
            renderFinishedCallback();
        }
    }

    function totalTitleBarButtonsWidth() {
        resetContentWindow();
        var currentCloserWidth = (parseInt(window.top.closeIconWidth));
        var offset = 20;
        var calculatedCloserWidth = btnNameDictionary.btnCloseChat + btnNameDictionary.btnEmail + btnNameDictionary.btnFontSize +
            btnNameDictionary.btnMinimize + btnNameDictionary.btnChime + btnNameDictionary.btnPrint;
        if (isDivChat)
            calculatedCloserWidth += btnNameDictionary.btnPopOut;

        calculatedCloserWidth += offset;

        // this is how we size the stage only once since the loading of the buttons happens 3X
        if (currentCloserWidth !== calculatedCloserWidth) {
            window.top.closeIconWidth = calculatedCloserWidth;// to be read by the DB
            window.mockDBService.setDBProperty("closerWidth", calculatedCloserWidth);// to be read by CI
            inqIframe.contentWindow.Application.application.titlebar.initStyle("right", "" + calculatedCloserWidth);
            inqIframe.contentWindow.Application.MoveSizeDiv2Stage(null, null, null, null);

            // unfortuneatly this is the end of render, there are no other hooks at this time
            renderFinishedCallback();
        }
    }

    function renderFinishedCallback() {
        initializeGlobals();
        assignAllHandlers();
    }

    function initializeGlobals() {
        if (inqIframe === null || inqIframe.contentWindow === null) {
            inqIframe = window.document.getElementById("inqChatStage");
        }
        isDivChat = inqIframe.contentWindow.com.inq.utils.Util.getConfig("divSkin", false);
        activeWindow = (isDivChat === true) ? window : inqIframe.contentWindow;
        isOld = !!activeWindow.attachEvent;
        btnSend = (isDivChat === true) ? activeWindow.document.getElementById("tcChat_btnSend") : activeWindow.document.getElementById("btnSend");
    }

    function assignAllHandlers() {
        preventCloseEvent(isOld);
        preventThankYouDisappear(isOld);
        assignMinimizeMgrMopUp(isOld);
        publishThankYouHandlers();
        publishMinimizeHandlers();
        publishPersistentChatButtonHandlers();
        //assignThankYouButtonHandlers(); debug only
    }

    function preventCloseEvent(isOld) {
        if (isOld)
            activeWindow.attachEvent("click", closeClickHandler, true);
        else
            activeWindow.addEventListener("click", closeClickHandler, true);
    }

    // called by prevent CloseEvent
    function closeClickHandler(event) {
        var target = event.target || event.srcElement;
        if (target.id.indexOf("btnCloseChat") !== -1)
            event.stopPropagation();
    }

    // ci code sets visibility of send Button separately from visibility of the chat window ( MinimizeMgr.actionRestore is complex )
    function assignMinimizeMgrMopUp(isOld) {
        if (isOld)
            activeWindow.attachEvent("click", restoreClickHandler, false);
        else
            activeWindow.addEventListener("click", restoreClickHandler, false);
    }

    //called by assignMinimizeMgrMopUp
    function restoreClickHandler(event) {
        var target = event.target || event.srcElement;
        if (target.id.indexOf("btnRestore") !== -1) {
            btnSend.style.display = "block";
        }
    }

    function preventThankYouDisappear(isOld) {
        if (isOld)
            activeWindow.attachEvent("click", thankYouClickHandler, true);// use capture true so we get the event BEFORE the button does
        else
            activeWindow.addEventListener("click", thankYouClickHandler, true);
    }

    // called by preventThankYouDisappear
    function thankYouClickHandler(event) {
        var thankYouDiv = (isDivChat === true) ? activeWindow.document.getElementById("tcChat_thankYou") : activeWindow.document.getElementById("thankYou");
        if (thankYouDiv.style.display === "block")
            event.stopPropagation();
    }

    function hideThankYou() {
        resetContentWindow();
        var cTY = inqIframe.contentWindow.com.inq.flash.client.chatskins.SkinControl.getThankYou();
        cTY.setVisible(false);
        inqIframe.contentWindow.com.inq.flash.client.chatskins.SkinControl.getSendButton().setVisible(true);
    }

    function displayThankYou() {
        resetContentWindow();
        inqIframe.contentWindow.com.inq.flash.client.chatskins.SkinControl.gotoThankyouScene();
    }

    function publishThankYouHandlers() {
        window.top.displayThankYou = displayThankYou;//inqIframe.contentWindow.com.inq.flash.client.chatskins.SkinControl.gotoThankyouScene;
        window.top.hideThankYou = hideThankYou;
    }

    function publishPersistentChatButtonHandlers() {
        window.top.showPersistentChatButton = showPersistentChatButton;
        window.top.hidePersistentChatButton = hidePersistentChatButton;
    }

    function showPersistentChatButton() {
        resetContentWindow();
        inqIframe.contentWindow.com.inq.flash.client.chatskins.SkinControl.enablePersistentChatButtonAndEstablishUrl(null);
    }

    function hidePersistentChatButton() {
        resetContentWindow();
        var ClickPersistent = inqIframe.contentWindow.Application.application.getMxmlItem("ClickPersistent");
        if (ClickPersistent !== null && ClickPersistent.getVisible()) {
            inqIframe.contentWindow.com.inq.flash.client.chatskins.SkinControl.showPersistentChatButtons(false);
            var chatWindow = inqIframe.contentWindow.Application.application.getMxmlItem("chatWindow");
            if (chatWindow) {
                // Reset the bottom of the chatWindow to the value prior to showing the PersistentChat button.
                var chatBottom = chatWindow.getStyle("bottom");
                var persHeight = ClickPersistent.getStyle("height");
                var newChatBtm = chatBottom - persHeight;
                chatWindow.setStyle("bottom", "" + newChatBtm);
            }
        }
    }

    function publishMinimizeHandlers() {
        resetContentWindow();
        window.top.showMinimized = inqIframe.contentWindow.com.inq.flash.client.control.MinimizeManager.actionMinimize;
        window.top.hideMinimized = inqIframe.contentWindow.com.inq.flash.client.control.MinimizeManager.actionRestore;
    }

    function assignThankYouButtonHandlers() {
        var tyVisible = false;
        var btnTY = document.getElementById("btnTriggerTY");
        btnTY.addEventListener("click", function () {
            if (tyVisible === false) {
                displayThankYou();
                tyVisible = true;
            }
            else {
                hideThankYou();
                tyVisible = false;
            }
        }, true);
    }

    return {
        calculateButtonContainer: calculateButtonContainer
    }
})();




/**

 */

tcMockDBService = parent.mockDBService;
try {
    launchWhenReady = true;
    Inq = {

        SaveMgr: {
            setSessionParam: function(f) {
            }
        },
        FlashPeer: {
            getDeviceType: function() {
                var deviceType = window.parent.deviceType;
                return deviceType;
            },
            getSkinPath: function() {
                var skinPath = tcMockDBService.getDBValue("skinPath");
                return skinPath;
            },
            getSkinName: function() {
                var skinName = tcMockDBService.getDBValue("skinName");
                return skinName;
            },
            getSkinMXML: function() {
                return tcMockDBService.getDBValue("skinMXML");
            },

            getIsSkinLocal: function() {
                return tcMockDBService.getDBValue("skinIsLocal");
            },
            getIsBuilder: function() {
                return true;
            },
            getSkinLocation: function() {
                return tcMockDBService.getDBValue("skinLocation");
            },
            getMediaPath: function() {
                var skinPath = tcMockDBService.getDBValue("skinPath");
                var skinName = tcMockDBService.getDBValue("skinName");
                var mediaBaseUrl = skinPath + "/" + skinName + "/";
                return mediaBaseUrl;
            },
            getFlashVars: function() {
                return "agentName=" + tcMockDBService.getDBValue("agentName") + "&userName=" + tcMockDBService.getDBValue("userName") + "&PersistentFrame=" +"0"+"";
            },
            getUserName: function() {
                return tcMockDBService.getDBValue("userName");
            },
            getAgentName: function() {
                return tcMockDBService.getDBValue("agentName");
            },
            getTitleBarHeight: function() {
                var titleHeight = tcMockDBService.getDBValue("titlebarHeight");
                return parseInt(titleHeight);
            },
            getPopupCloserWidth: function() {
                var closerWidth = tcMockDBService.getDBValue("closerWidth");
                return parseInt(closerWidth);
            },
            getSkinHeight: function() {
                var skinHeight = tcMockDBService.getDBValue("skinHeight");
                return parseInt(skinHeight);
            },
            getSkinWidth: function() {
                var skinWidth = tcMockDBService.getDBValue("skinWidth");
                return parseInt(skinWidth);
            },
            getV3Data: function() {
                if (!window["V3Data"]) {
                    window["V3Data"] = {
                        c: 1,
                        cntOS: 2,
                        cwa: 1429029305112,
                        eml: 0,
                        it: 120,
                        mc: -1,
                    };
                }
                return window["V3Data"];
            },
            popOutChat:function(){
                var x = 1;
            },
            setV3Data: function(data) {
            },
            // only read for persistent chat
            getInitialChatLocation: function() {
                return "UPPER_LEFT";
            },
            getSkinLeft: function() {
                var skinLeft = tcMockDBService.getDBValue("skinLeft");
                return parseInt(skinLeft);
            },
            getSkinTop: function() {
                var skinTop = tcMockDBService.getDBValue("skinTop");
                return parseInt(skinTop);
            },
            isThankYouEnabled: function() {
                return false;
            },
            isLoggingDisabled: function() {
                return false;
            },
            isV3C2CPersistent: function() {
                return false;
            },
            requestTranscript: function(_emailAddress) {
            },
            setSessionParam: function(key, val) {
            },
            closePersistent: function() {
            },
            getMediaBaseURL: function() {
                var skinName = tcMockDBService.getDBValue("skinFileName");
                var parts = skinName.split("/");
                parts.pop();
                parts[2] = "mediav3.inq.com";
                parts[3] = "media";
                var mediaBaseUrl = parts.join("/").split(" ").join("%20");
                return mediaBaseUrl;
            },
            getBaseURL: function() {
                var skinName = tcMockDBService.getDBValue("skinFileName");
                var parts = skinName.split("/");
                parts.pop();
                return parts.join("/").split(" ").join("%20");
            },
            parseXFrameUrl: function(url) {
                return url;
            },
            getSkin: function() {
                // yes this replaces .mxml with .skin... if we know this already????? # of times this routine appears in inqFramework :
                var fullyQualifiedSkinUrl = tcMockDBService.getDBValue("skinFileName");
                var parts = fullyQualifiedSkinUrl.split(".");
                parts.pop();
                parts.push("skin");
                return parts.join(".").split(" ").join("%20");
            },
            addParamsToXFrameUrl: function() {
            }
        },
        ChatMgr: {
            chat: {
                chatData: {}
            },
            chatData: {
                chat: {
                    titlebar: {
                        popupCloserWidth: tcMockDBService.getDBValue("closerWidth"),
                        h: tcMockDBService.getDBValue("titlebarHeight")
                    },
                    flash: {
                        location: "TOP_LEFT",
                        w: tcMockDBService.getDBValue("skinWidth"),
                        h: tcMockDBService.getDBValue("skinHeight"),
                        x: 0,
                        y: 0
                    }
                }
            },
            _fakeV3Data: {},
            _thankyouEnabled: false,
            isThankYouEnabled: function() {
                return window.Inq.ChatMgr._thankyouEnabled;
            },
            getV3Data: function() {
                return Inq.ChatMgr._fakeV3Data;
            },
            setV3Data: function(data) {
                Inq.ChatMgr._fakeV3Data = data;
            }
        }
    };

    if (navigator.userAgent.indexOf("MSIE 8.0") != -1) {
        window.Inq = Inq;
    }
} catch (err) {
    alert("ERROR" + err);
}










