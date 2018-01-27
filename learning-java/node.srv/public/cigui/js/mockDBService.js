
mockDBService = (function (configargs) {

    var mockDB = {
        agentName: configargs.agentName,
        userName: configargs.userName,
        closerWidth: configargs.closerWidth,
        skinHeight: configargs.skinHeight,
        skinWidth: configargs.skinWidth,
        titlebarHeight: configargs.titlebarHeight,
        skinLocation: configargs.skinLocation,
        skinLeft: configargs.skinLeft,
        skinTop: configargs.skinTop,
        skinFileName: configargs.skinFileName,// "../skins/SprintCSSTest.mxml", backwards compatability
        deviceType: configargs.deviceType,
        skinPath: configargs.skinPath,
        skinName: configargs.skinName,
        skinMXML: "<?xml version=\"1.0\" encoding=\"utf-8\"?> <mx:Application \txmlns:mx=\"http://www.adobe.com/2006/mxml\"\tinitialize=\"InqApplication.initCompleted(this);\"\tlayout=\"absolute\" \theight=\"100%\" \twidth=\"100%\" \thorizontalScrollPolicy=\"off\" \tverticalScrollPolicy=\"off\"\tusePreloader=\"false\"\tcurrentState=\"INPUT\">\t<mx:Style source=\"./BestBrands.css\"/>\t<mx:Script>\t\t<![CDATA[ \t\t\tpublic var skinConfig:Object = {\t\t\t\t\t\tdivSkin: true,\t\t\t\tminHeight:\t\t\t\t200,\t\t\t\tminWidth:\t\t\t\t300,\t\t\t\tnextSkin:\t\t\t\t\"BestBrands-XL.skin\",                soundEnabled:           true,\t\t\t\tsoundURL:               \"./BestBrands/Harp.mp3\",\t\t\t\tsIntroduction: \t\t\t\"Type your question here\",\t\t\t\tsAgentIsTyping:\t\t\t\"Agent is typing...\",                soundEnabled:           true,                disconnectionNotification: true,\t\t\t\t\t\t\t\tneedwaitPeriod:\t\t\t\t\t\t\t2,\t\t\t\tneedwaitSoon:           \t\t\t\t10,\t\t\t\tneedwaitMessageFirst:\t              \t\"Thank you for waiting. You're in our chat queue in position <<QUEUE-POSITION>>.\",\t\t\t\tneedwaitMessage:\t\t              \t\"Thank you for waiting. You're in our chat queue in position <<QUEUE-POSITION>>.\",\t\t\t\tneedwaitMessageFirstSoon:             \t\"Thank you for waiting. You're in our chat queue in position <<QUEUE-POSITION>>. You will be connected soon.\",\t\t\t\tneedwaitMessageSoon:                  \t\"Thank you for waiting. You're in our chat queue in position <<QUEUE-POSITION>>. You will be connected soon.\",\t\t\t\tneedwaitMessageFirstNoAgentAvailable: \t\"We're sorry. There are no agents available. Please try again later.\",\t\t\t\tneedwaitMessageNoAgentAvailable:      \t\"We're sorry. There are no agents available. Please try again later.\"\t\t\t};\t\t]]>\t</mx:Script>\t <mx:Canvas id=\"customerNameInput\"    position=\"relative\"    margin=\"5px 0 0 0\"    visible=\"true\">    <mx:LineInput id=\"customerNameInputField\"      editable=\"true\"      position=\"relative\"      width=\"200\"      height=\"32\"      display=\"inline-block\"      placeholder=\"Enter your name\"      border=\"1px solid #000\"      autofocus=\"true\" />    <mx:Button id=\"customerNameSendButton\"      position=\"relative\"      width=\"80\"      height=\"32\"      margin=\"0 0 0 10px\"      display=\"inline-block\"      background=\"#ef6f00\"      border=\"1px solid #000\"      borderRadius=\"6px\"      fontSize=\"200%\"      text=\"Submit\"      color=\"white\"      useHandCursor=\"true\" />  </mx:Canvas>\t\t<mx:ClientBody>\t\t<html:Div id=\"Minimized\"\t\t\tvisible=\"false\" \t\t\tbottom=\"-5\"\t\t\tleft=\"10\"\t\t\twidth=\"300\"\t\t\theight=\"55\"\t\t\tposition=\"fixed\"\t\t\tz-index=\"1000\">\t\t\t\t\t\t<html:Div id=\"btnRestore\"/>\t\t\t<html:Span id=\"agentMsgCounter\" visible=\"false\"/>\t\t\t<html:Marquee id=\"agentText\" visible=\"false\"/>\t\t</html:Div>\t\t\t\t<html:Div id=\"Skin\" visible=\"true\" position=\"absolute\" z-index=\"9999998\"></html:Div>\t\t<mx:Style source=\"BestBrands/normalize.css\"/>\t\t<mx:Style source=\"BestBrands/Host.css\"/>\t\t\t\t<mx:Button id=\"btnRestore\"            toolTip=\"Restore chat session\"            disabledSkin=\"@Embed('./BestBrands/btnRestore.png')\"            overSkin=\"@Embed('./BestBrands/btnRestore.png')\"            upSkin=\"@Embed('./BestBrands/btnRestore.png')\"            downSkin=\"@Embed('./BestBrands/btnRestore.png')\"            selectedDownSkin=\"@Embed('./BestBrands/btnRestore.png')\"/>\t</mx:ClientBody>\t<mx:Canvas id=\"dragBar\" visible=\"false\"\t\theight=\"75\" top=\"0\"\t\tleft=\"0\" right=\"62\"/>\t<mx:Canvas id=\"background\" backgroundColor=\"#FFFFFF\"\t\tborderColor=\"#FFFFFF\" \t\tbottom=\"0\" top=\"0\"\t\tleft=\"0\" right=\"0\"/>\t<mx:Canvas id=\"chat\" backgroundColor=\"transparent\"\t\tvisible=\"true\"\t\ttop=\"101\"\t\tbottom=\"{targetedOffer.height}\" \t\tleft=\"0\" right=\"{videoFrame.width}\">\t\t<mx:Canvas id=\"rightMiddle\"\t\t\tbackgroundImage=\"@Embed('./BestBrands/POP_RM.gif')\"\t\t\tbackgroundSize=\"100%\" \t\t\tright=\"0\" top=\"0\"\t\t\tbottom=\"15\"/>\t\t<mx:Canvas id=\"leftMiddle\" \t\t\tbackgroundImage=\"@Embed('./BestBrands/POP_LM.gif')\"\t\t\tbackgroundSize=\"100%\" \t\t\tleft=\"0\" top=\"0\"\t\t\tbottom=\"15\"/>\t\t<mx:Canvas id=\"bottomMiddle\"\t\t\tstyleName=\"PopBottomMiddle\" \t\t\tbackgroundImage=\"@Embed('./BestBrands/POP_BM.gif')\"\t\t\tbackgroundSize=\"100%\" \t\t\twidth=\"214\" height=\"94\"\t\t\tleft=\"174\" right=\"120\" \t\t\tbottom=\"0\"/>\t\t<mx:Image id=\"bottomRight\" bottom=\"0\" right=\"0\">\t\t\t<mx:source>@Embed('./BestBrands/POP_BR.gif')</mx:source>\t\t</mx:Image>\t\t<mx:Image id=\"bottomLeft\" bottom=\"0\" left=\"0\">\t\t\t<mx:source>@Embed('./BestBrands/POP_BL.gif')</mx:source>\t\t</mx:Image>\t\t<mx:Button id=\"btnSend\"\t\t\tright=\"23\" bottom=\"23\"\t\t\twidth=\"83\" height=\"50\"\t\t\tenabled=\"true\" \t\t\tlabelPlacement=\"left\"\t\t\tdownSkin=\"@Embed('./BestBrands/POP_btnSend-Down.gif')\"\t\t\toverSkin=\"@Embed('./BestBrands/POP_btnSend-Over.gif')\"\t\t\tupSkin=\"@Embed('./BestBrands/POP_btnSend.gif')\"\t\t\tuseHandCursor=\"true\" styleName=\"PopBtnSend\"/>\t\t<mx:TextArea id=\"chatWindow\" \t\t\ttop=\"0\" bottom=\"94\" \t\t\tleft=\"23\" right=\"24\" \t\t\tbackgroundColor=\"white\"\t\t\tbackgroundImage=\"@Embed('./BestBrands/POP_TEXTAREA.gif')\"\t\t\tbackgroundSize=\"100%\"/>\t\t<mx:TextInput id=\"txtInput\" backgroundColor=\"transparent\"\t\t\teditable=\"true\" borderStyle=\"none\"\t\t\theight=\"45\" bottom=\"30\"\t\t\tleft=\"23\" right=\"120\"/>\t\t<mx:Button id=\"ClickPersistent\"\t\t\tvisible=\"false\"\t\t\tbackgroundColor=\"#6E6E6E\"\t\t\tuseHandCursor=\"true\" \t\t\tlabel=\"<img src='https://mediav3.inq.com/media/sites/10003715/flash/BestBrands/PleaseClickToChat-Icon.png'>\"\t\t\tdisabledSkin=\"@Embed('./BestBrands/PleaseClickToChat-BarDisabled.gif')\"\t\t\toverSkin=\"@Embed('./BestBrands/PleaseClickToChat-Bar.gif')\"\t\t\tupSkin=\"@Embed('./BestBrands/PleaseClickToChat-Bar.gif')\"\t\t\tdownSkin=\"@Embed('./BestBrands/PleaseClickToChat-BarOver.gif')\"/>\t</mx:Canvas>\t<!-- RTDEV-14330 ---- VERSION 4 --><mx:Canvas id=\"connectionIssuesMessage\"\tvisible=\"false\"\tfontFamily=\"Arial\"\ttextAlign=\"center\"\tfontSize=\"18px\"\tfontStyle=\"italic\"\tbackgroundColor=\"#FFD495\"\tleft=\"18\"\tright=\"17\"\tbottom=\"13\"\theight=\"80\"\twidth=\"100%\">\t<!--<mx:Text\t\ttext=\"Attempting to restore lost connection. Chat session will end if unable to restore.\"\t\tvisible=\"true\"\t\tcolor=\"#FF0037\"\t\ttop=\"15\"\t\tlineHeight=\"24px\"\t\t/>-->\t<mx:Text\t\ttext=\"Attempting to restore lost connection. Chat session will end if unable to restore in {{COUNTDOWN-TIMER}} minutes.\"\t\tvisible=\"true\"\t\tpadding=\"0 5px\"\t\tlineHeight=\"24px\"\t\t/></mx:Canvas><mx:Canvas id=\"connectionRestoredMessage\"\tvisible=\"false\"\tfontFamily=\"Arial\"\ttextAlign=\"center\"\tfontSize=\"18px\"\tfontStyle=\"italic\"\tbackgroundColor=\"#FFD495\"\tleft=\"19\"\tright=\"18\"\tbottom=\"73\"\theight=\"34\"\twidth=\"100%\">\t<mx:Text\t\ttext=\"Connection has been successfully reestablished!\"\t\tvisible=\"true\"\t\tcolor=\"#2CA73D\"\t\ttop=\"5\"\t\twidth=\"100%\"\t\tlineHeight=\"24px\"\t\t/></mx:Canvas><mx:Canvas id=\"connectionFailedMessage\"\tvisible=\"false\"\tfontFamily=\"Arial\"\ttextAlign=\"center\"\tfontSize=\"14px\"\tfontStyle=\"italic\"\tbackgroundColor=\"#FFD495\"\tleft=\"18\"\tright=\"17\"\tbottom=\"13\"\theight=\"130\"\twidth=\"100%\">\t<mx:Text\t\ttext=\"Session ended due to network issues. Please try again later.\"\t\tvisible=\"true\"\t\ttop=\"5\"\t\twidth=\"100%\"\t\tlineHeight=\"20px\"\t\t/>\t<mx:Text\t\ttext=\"You can close the chat window or it will close automatically on the next page refresh. WARNING! Information will be lost once the chat window is closed. To chat again, please troubleshoot and start a new chat.\"\t\tvisible=\"true\"\t\ttop=\"40\"\t\twidth=\"100%\"\t\tlineHeight=\"20px\"\t\t/></mx:Canvas>\t\t<mx:Canvas id=\"topMiddle\"\t\tstyleName=\"PopTopMiddle\" \t\tbackgroundImage=\"@Embed('./BestBrands/POP_TM.gif')\"\t\tbackgroundSize=\"100%\" \t\ttop=\"0\" \t\tleft=\"174\" right=\"120\"/>\t<mx:Image id=\"topRight\" right=\"0\" top=\"0\">\t\t<mx:source>@Embed('./BestBrands/POP_TR.gif')</mx:source>\t</mx:Image>\t<mx:Image id=\"topLeft\" left=\"0\" top=\"0\">\t\t<mx:source>@Embed('./BestBrands/POP_TL.gif')</mx:source>\t</mx:Image>\t<mx:Canvas id=\"email\"\t\ttop=\"100\" height=\"46\"\t\tleft=\"0\" right=\"0\"\t\tbackgroundColor=\"white\"\t\tvisible=\"false\">\t\t<mx:Canvas id=\"emTopMiddle\"\t\t\tbackgroundImage=\"@Embed('./BestBrands/EM_TM.gif')\"\t\t\tbackgroundSize=\"100%\" \t\t\tleft=\"0\" right=\"0\"\t\t\ttop=\"0\"/>\t\t<mx:Image id=\"emTopLeft\" left=\"0\" top=\"0\">\t\t\t<mx:source>@Embed('./BestBrands/EM_TL.gif')</mx:source>\t\t</mx:Image>\t\t<mx:Image id=\"emTopRight\" right=\"0\" top=\"0\">\t\t\t<mx:source>@Embed('./BestBrands/EM_TR.gif')</mx:source>\t\t</mx:Image>\t\t<mx:Button id=\"btnSendEmail\" \t\t\tright=\"23\" \t\t\tbottom=\"8\"\t\t\tlabelPlacement=\"left\"\t\t\tdownSkin=\"@Embed('./BestBrands/EM_btnEmail.gif')\"\t\t\toverSkin=\"@Embed('./BestBrands/EM_btnEmail.gif')\"\t\t\tupSkin=\"@Embed('./BestBrands/EM_btnEmail.gif')\"\t\t\tuseHandCursor=\"true\"/>\t\t<mx:Image id=\"emDescription\" left=\"20\" top=\"0\">\t\t\t<mx:source>@Embed('./BestBrands/EM_sign-up_text.gif')</mx:source>\t\t</mx:Image>\t\t\t\t<mx:TextInput id=\"emailInput\" backgroundColor=\"transparent\"\t\t\t   editable=\"true\" \t\t\t   borderStyle=\"none\" \t\t\t   height=\"18\" \t\t\t   top=\"16\" \t\t\t   left=\"24\" right=\"120\" >\t\t</mx:TextInput>\t</mx:Canvas>\t<mx:Canvas id=\"titleBar\"\t\theight=\"75\"\t\ttop=\"0\"\t\tleft=\"0\" right=\"0\">\t\t\t\t<mx:Button id=\"btnCloseChat\" enabled=\"true\"\t\t\tright=\"15\" top=\"15\"\t\t\ttoolTip=\"Close\" \t\t\tuseHandCursor=\"true\" \t\t\tdisabledSkin=\"@Embed('./BestBrands/btnClose.gif')\"\t\t\toverSkin=\"@Embed('./BestBrands/btnClose.gif')\"\t\t\tupSkin=\"@Embed('./BestBrands/btnClose.gif')\"\t\t\tdownSkin=\"@Embed('./BestBrands/btnClose.gif')\"\t\t\tselectedDownSkin=\"@Embed('./BestBrands/btnClose.gif')\"/>\t\t\t\t\t<mx:Button id=\"btnMinimize\" enabled=\"true\"            right=\"44\" top=\"16\"            toolTip=\"Minimize Chat\"            useHandCursor=\"true\"            disabledSkin=\"@Embed('./BestBrands/btnMinimize.gif')\"            overSkin=\"@Embed('./BestBrands/btnMinimize.gif')\"            upSkin=\"@Embed('./BestBrands/btnMinimize.gif')\"            downSkin=\"@Embed('./BestBrands/btnMinimize.gif')\"            selectedDownSkin=\"@Embed('./BestBrands/btnMinimize.gif')\"/>\t\t\t\t\t<mx:Button id=\"btnEmail\" enabled=\"true\"\t\t\tright=\"67\" top=\"16\"\t\t\tuseHandCursor=\"true\"\t\t\ttoolTip=\"Email Transcript\"\t\t\tdisabledSkin=\"@Embed('./BestBrands/btnEmail.gif')\"\t\t\toverSkin=\"@Embed('./BestBrands/btnEmail.gif')\"\t\t\tupSkin=\"@Embed('./BestBrands/btnEmail.gif')\"\t\t\tdownSkin=\"@Embed('./BestBrands/btnEmail.gif')\"\t\t\tselectedDownSkin=\"@Embed('./BestBrands/btnMuteOn.gif')\"/>\t\t\t\t<mx:Button id=\"btnMuteOn\" enabled=\"true\"\t\t\tright=\"99\" top=\"16\"\t\t\tuseHandCursor=\"true\"\t\t\ttoolTip=\"Sound on/off\"\t\t\tdisabledSkin=\"@Embed('./BestBrands/btnMuteOff.gif')\"\t\t\toverSkin=\"@Embed('./BestBrands/btnMuteOff.gif')\"\t\t\tupSkin=\"@Embed('./BestBrands/btnMuteOff.gif')\"\t\t\tdownSkin=\"@Embed('./BestBrands/btnMuteOff.gif')\"\t\t\tselectedDownSkin=\"@Embed('./BestBrands/btnMuteOff.gif')\"/> \t\t<mx:Button id=\"btnMuteOff\" enabled=\"true\"\t\t\tright=\"99\" top=\"16\"\t\t\tuseHandCursor=\"true\"\t\t\ttoolTip=\"Sound On/Off\"\t\t\tdisabledSkin=\"@Embed('./BestBrands/btnMuteOn.gif')\"\t\t\toverSkin=\"@Embed('./BestBrands/btnMuteOn.gif')\"\t\t\tupSkin=\"@Embed('./BestBrands/btnMuteOn.gif')\"\t\t\tdownSkin=\"@Embed('./BestBrands/btnMuteOn.gif')\"\t\t\tselectedDownSkin=\"@Embed('./BestBrands/btnMuteOn.gif')\"/>\t\t<mx:Button id=\"btnPrint\" enabled=\"true\"\t\t\tright=\"127\" top=\"16\"\t\t\tuseHandCursor=\"true\"\t\t\ttoolTip=\"Print Transcript\"\t\t\tdisabledSkin=\"@Embed('./BestBrands/btnPrint.gif')\"\t\t\toverSkin=\"@Embed('./BestBrands/btnPrint.gif')\"\t\t\tupSkin=\"@Embed('./BestBrands/btnPrint.gif')\"\t\t\tdownSkin=\"@Embed('./BestBrands/btnPrint.gif')\"\t\t\tselectedDownSkin=\"@Embed('./BestBrands/btnPrint.gif')\"/>\t\t\t<mx:Button id=\"btnFontSize\" enabled=\"true\"\t\t\tright=\"157\" top=\"16\"\t\t\tuseHandCursor=\"true\"\t\t\ttoolTip=\"Font Size\"\t\t\tdisabledSkin=\"@Embed('./BestBrands/btnFontSizeUp.gif')\"\t\t\toverSkin=\"@Embed('./BestBrands/btnFontSizeUp.gif')\"\t\t\tupSkin=\"@Embed('./BestBrands/btnFontSizeUp.gif')\"\t\t\tdownSkin=\"@Embed('./BestBrands/btnFontSizeUp.gif')\"\t\t\tselectedDownSkin=\"@Embed('./BestBrands/btnFontSizeUp.gif')\"/>\t</mx:Canvas>\t<mx:Canvas id=\"thankYou\" visible=\"false\"\t\tonVisible=\"hide(btnMuteOn) hide(btnMuteOff) hide(btnFontSize) hide(btnPrint) hide(btnEmail)\"\t\tbackgroundColor=\"white\"\t\ttop=\"101\" bottom=\"{targetedOffer.height}\"\t\tleft=\"0\" right=\"{videoFrame.width}\">\t\t<mx:Canvas id=\"tyTopMiddle\"\t\t\tbackgroundImage=\"@Embed('./BestBrands/TY_TM.gif')\"\t\t\tbackgroundSize=\"100%\" \t\t\tleft=\"0\" right=\"0\"\t\t\ttop=\"0\"\t\t\twidth=\"1\" height=\"1\"/> \t\t\t<mx:Canvas id=\"tyBottomMiddle\"\t\t\tbackgroundImage=\"@Embed('./BestBrands/TY_BM.gif')\"\t\t\tbackgroundSize=\"100%\" \t\t\tbottom=\"0\"\t\t\tleft=\"4\" right=\"4\"/>\t\t\t\t\t<mx:Canvas id=\"tyRightMiddle\"\t\t\tbackgroundImage=\"@Embed('./BestBrands/TY_RM.gif')\"\t\t\tbackgroundSize=\"100%\" \t\t\tright=\"0\"\t\t\ttop=\"0\" bottom=\"0\"/>\t\t<mx:Canvas id=\"tyLeftMiddle\" \t\t\tstyleName=\"PopLeftMiddle\"\t\t\tbackgroundImage=\"@Embed('./BestBrands/TY_LM.gif')\"\t\t\tbackgroundSize=\"100%\" \t\t\tleft=\"0\"\t\t\ttop=\"0\" bottom=\"0\"/>\t\t<mx:Image id=\"tyTopRight\" right=\"0\" top=\"0\" width=\"1\" height=\"1\">\t\t\t<mx:source>@Embed('./BestBrands/TY_TR.gif')</mx:source>\t\t</mx:Image>\t\t<mx:Image id=\"tyBottomRight\" bottom=\"0\" right=\"0\">\t\t\t<mx:source>@Embed('./BestBrands/TY_BR.gif')</mx:source>\t\t</mx:Image>\t\t<mx:Image id=\"tyTopLeft\" left=\"0\" top=\"0\" width=\"1\" height=\"1\">\t\t\t<mx:source>@Embed('./BestBrands/TY_TL.gif')</mx:source>\t\t</mx:Image>\t\t<mx:Image id=\"tyBottomLeft\" bottom=\"0\" left=\"0\">\t\t\t<mx:source>@Embed('./BestBrands/TY_BL.gif')</mx:source>\t\t</mx:Image>\t\t<mx:Button id=\"btnThankYou\" \t\t\tdisabledSkin=\"@Embed('./BestBrands/POP_TEXTAREA.gif')\"\t\t\toverSkin=\"@Embed('./BestBrands/POP_TEXTAREA.gif')\"\t\t\tupSkin=\"@Embed('./BestBrands/POP_TEXTAREA.gif')\"\t\t\tdownSkin=\"@Embed('./BestBrands/POP_TEXTAREA.gif')\"\t\t\tlabel=\"Thank you for chatting with us today!\"\t\t\tfontFamily=\"Arial\" \t\t\tcolor=\"#333333\" \t\t\ttextAlign=\"center\" \t\t\tverticalAlign=\"middle\"\t\t\tfontSize=\"16\" \t\t\ttop=\"0\" bottom=\"24\"\t\t\tleft=\"22\" right=\"23\"/>\t</mx:Canvas>\t\t<mx:XFrame id=\"targetedOffer\" \t\tbackgroundColor=\"#F7F7F7\"\t\tborder-color=\"black\" \t\tborder-style=\"solid\"\t\tborder-thickness-left=\"5\"\t\tborder-thickness-right=\"5\"\t\tborder-thickness-top=\"0\"\t\tborder-thickness-bottom=\"5\"\t\tsource=\"/orbeon/inq/view?dtid=17000125\" \t\theight=\"125\"\t\tbottom=\"0\" \t\tleft=\"0\" \t\tright=\"0\"\t\tvisible=\"collapse\"\t\tinit=\"true\"/>\t\t\t<mx:Canvas id=\"videoFrame\"\t\ttop=\"101\"\t\tbottom=\"0\"\t\tleft=\"{chat.right}\"\t\tright=\"0\"\t\twidth=\"350\"\t\tbackgroundColor=\"black\"\t\t\t\t\tvisible=\"collapse\">\t\t<mx:Canvas id=\"vidTopMiddle\"\t\t\tbackgroundImage=\"@Embed('./BestBrands/TY_TM.gif')\"\t\t\tbackgroundSize=\"100%\" \t\t\tleft=\"0\" right=\"0\"\t\t\ttop=\"0\"\t\t\twidth=\"1\" height=\"1\"/> \t\t\t<mx:Canvas id=\"vidBottomMiddle\"\t\t\tbackgroundImage=\"@Embed('./BestBrands/TY_BM.gif')\"\t\t\tbackgroundSize=\"100%\" \t\t\tbottom=\"0\"\t\t\tleft=\"4\" right=\"4\"/>\t\t\t\t\t<mx:Canvas id=\"vidRightMiddle\"\t\t\tbackgroundImage=\"@Embed('./BestBrands/TY_RM.gif')\"\t\t\tbackgroundSize=\"100%\" \t\t\tright=\"0\"\t\t\ttop=\"0\" bottom=\"0\"/>\t\t<mx:Canvas id=\"vidLeftMiddle\" \t\t\tstyleName=\"PopLeftMiddle\"\t\t\tbackgroundImage=\"@Embed('./BestBrands/TY_LM.gif')\"\t\t\tbackgroundSize=\"100%\" \t\t\tleft=\"0\"\t\t\ttop=\"0\" bottom=\"0\"/>\t\t<mx:Image id=\"vidTopRight\" right=\"0\" top=\"0\" width=\"1\" height=\"1\">\t\t\t<mx:source>@Embed('./BestBrands/TY_TR.gif')</mx:source>\t\t</mx:Image>\t\t<mx:Image id=\"vidBottomRight\" bottom=\"0\" right=\"0\">\t\t\t<mx:source>@Embed('./BestBrands/TY_BR.gif')</mx:source>\t\t</mx:Image>\t\t<mx:Image id=\"vidTopLeft\" left=\"0\" top=\"0\" width=\"1\" height=\"1\">\t\t\t<mx:source>@Embed('./BestBrands/TY_TL.gif')</mx:source>\t\t</mx:Image>\t\t<mx:Image id=\"vidBottomLeft\" bottom=\"0\" left=\"0\">\t\t\t<mx:source>@Embed('./BestBrands/TY_BL.gif')</mx:source>\t\t</mx:Image>\t\t<mx:IFrame\t\t\tid=\"video\"\t\t\tsource=\"http://mediav3.inq.com/media/sites/10003715/flash/BestBrands/video.html\"\t\t\ttop=\"0\" bottom=\"24\"\t\t\tleft=\"22\" right=\"23\" \t\t\tbackgroundColor=\"black\"/>\t\t\t\t\t<mx:Button id=\"btnCloseVideo\" enabled=\"true\"\t\t\tonClick=\"shrink(videoFrame) fire(videoClose)\"\t\t\tright=\"28\" top=\"7\"\t\t\ttoolTip=\"Close Video\" \t\t\tuseHandCursor=\"true\" \t\t\tdisabledSkin=\"@Embed('./BestBrands/btnCloseVideo.png')\"\t\t\toverSkin=\"@Embed('./BestBrands/btnCloseVideo.png')\"\t\t\tupSkin=\"@Embed('./BestBrands/btnCloseVideo.png')\"\t\t\tdownSkin=\"@Embed('./BestBrands/btnCloseVideo.png')\"\t\t\tselectedDownSkin=\"@Embed('./BestBrands/btnCloseVideo.png')\"/>\t</mx:Canvas></mx:Application>",
        skinIsLocal: configargs.skinIsLocal
    };

    function getDBValue(propertyName) {
        return mockDB[propertyName];
    }

    function setDBProperty(propertyName, propertyValue) {
        mockDB[propertyName] = propertyValue;
    }

    return {
        getDBValue: getDBValue,
        setDBProperty: setDBProperty
    }

})(
    // values read from DB and set  on parent window by GWT
    {
        agentName : "Jessica",
        closerWidth : 30,
        deviceType : "Desktop",
        skinFileName : "http://tagserver.inq.com/tagserver/sites/306/flash/SprintCSSTest.mxml",
        skinHeight : 245,
        skinIsLocal : true,
        skinLeft : 0,
        skinLocation : "CENTER",
        skinMXML : "<?xml version=\"1.0\" encoding=\"utf-8\"?> \r\n<mx:Application \r\n\txmlns:mx=\"http://www.adobe.com/2006/mxml\" \r\n\tinitialize=\"InqApplication.initCompleted(this);\"\r\n\tlayout=\"absolute\" \r\n\theight=\"100%\" \r\n\twidth=\"100%\" \r\n\thorizontalScrollPolicy=\"off\" \r\n\tverticalScrollPolicy=\"off\"\r\n\tusePreloader=\"false\" \r\n\t>\r\n\t<mx:Style source=\"./TouchCommerceCall.css\"/>\r\n \t<mx:Script>\r\n\t\t<![CDATA[ \r\n\t\t\tpublic var skinConfig:Object = {\t\r\n\t\t\tsIntroduction: \"Type your question here\",\t \t\r\n\t\t\tsPersistentFrameTitle: \" \",\r\n\t\t\tpointSize: \t\t\t\t12 ,\r\n\t\t\tsFont:\t\t \t\t\t\"Arial\" ,\r\n\t\t\tindentInches: \t\t\t0.0,\r\n\t\t\tlCustomerColor:\t\t\t0x202020 ,\r\n\t\t\tlAgentColor:\t\t\t0x0000CB ,\r\n\t\t\tsSampleAgentText:\t\t\"Matthew: \",\r\n\t\t\tsWrapPhrase:\t\t\t\"Absolutely! First, let me move this chat so you can look at the web page while we’re chatting, ok? Just\" ,\r\n\t\t\tlineBreak:\t\t\t\t0.0 , \r\n\t\t\tsAgentConnectors:\t\t\"Chat2AgentConnector\",\r\n\t\t\tlLegacySocket:\t\t\t5777,\r\n\t\t\tlAgentRouterSocket:\t\t81,\r\n\t\t\tiPersistentWidth:\t\t800,\r\n\t\t\t\r\n\t\t\tcustomerId:\t\t\t\t {color: \t \"#727272\", \r\n\t\t\t\t\t\t\t\t\t fontFamily: \"Verdana, Arial, Helvetica\",\r\n\t\t\t\t\t\t\t\t\t textIndent: \"0pt\",\r\n\t\t\t\t\t\t\t\t\t marginLeft: \"0px\" ,\r\n\t\t\t\t\t\t\t\t\t fontSize: \"10pt\",\t\t\t\t\t\t\t\t\t \r\n\t\t\t\t\t\t\t\t\t fontWeight: \"bold\"},\r\n\t\t\t\t\t\t\t\t\t \r\n\t\t\tagentId:\t\t\t\t {color: \t \"#000000\", \r\n\t\t\t\t\t\t\t\t\t fontFamily: \"Verdana, Arial, Helvetica\",\r\n\t\t\t\t\t\t\t\t\t textIndent: \"0pt\",\r\n\t\t\t\t\t\t\t\t\t marginLeft: \"0px\" ,\r\n\t\t\t\t\t\t\t\t\t fontSize: \"10pt\",\r\n\t\t\t\t\t\t\t\t\t fontWeight: \"bold\"},\r\n\t\t\t\t\t\t\t\t\t \r\n\t\t\tagentMsg:\t\t\t\t {color: \t \"#000000\", \r\n\t\t\t\t\t\t\t\t\t fontFamily: \"Verdana, Arial, Helvetica\",\r\n\t\t\t\t\t\t\t\t\t fontSize: \"10pt\",\r\n\t\t\t\t\t\t\t\t\t fontWeight: \"normal\"},\r\n\t\t\t\t\t\t\t\t\t \r\n\t\t\tcustomerMsg:\t\t\t {color: \"#727272\", \r\n\t\t\t\t\t\t\t\t\t fontFamily: \"Verdana, Arial, Helvetica\",\r\n\t\t\t\t\t\t\t\t\t fontSize: \"10pt\",\r\n\t\t\t\t\t\t\t\t\t fontWeight: \"normal\"},\r\n\t\t\t\r\n\t\t\tsystemMsg:\t\t\t\t {color: \"#606060\", \r\n\t\t\t\t\t\t\t\t\t fontFamily: \"Verdana, Arial, Helvetica\",\r\n\t\t\t\t\t\t\t\t\t fontSize: \"10pt\",\r\n\t\t\t\t\t\t\t\t\t fontStyle: \"italic\",\r\n\t\t\t\t\t\t\t\t\t fontWeight: \"normal\"},\r\n\t\t\t\r\n\t\t\tsBuild:\t\t\t\t\t\"20090107.0001\"\t\t\t\t\t\t \r\n\t\t\t} ;\r\n\t\t]]>\r\n\t</mx:Script>\r\n\t<mx:ArrayCollection>\t\t\r\n\t</mx:ArrayCollection>\r\n\t\t<mx:Canvas id=\"background\" borderColor=\"#FFFFFF\" bottom=\"0\" top=\"0\" left=\"0\" right=\"0\"\r\n backgroundColor=\"transparent\"/> \r\n\r\n\t\t<mx:Canvas id=\"callFormPersistent\" borderColor=\"#FFFFFF\" bottom=\"0\" top=\"0\" left=\"0\" right=\"0\" \r\n backgroundColor=\"white\" backgroundImage=\"@Embed('./TouchCommerceCall/click_call_persistent.png')\" > \r\n <mx:TextArea id=\"chatWindow\" top=\"85\" bottom=\"25\" left=\"25\" width=\"300\" \r\n backgroundColor=\"transparent\" backgroundSize=\"100%\" />\r\n </mx:Canvas>\r\n\r\n\t\t<mx:Canvas id=\"callForm\" borderColor=\"#FFFFFF\" bottom=\"0\" top=\"0\" left=\"0\" right=\"0\" \r\n backgroundColor=\"white\" backgroundImage=\"@Embed('./TouchCommerceCall/click_call.png')\" > \r\n <mx:Button id=\"btnCloseChat\" height=\"16\" width=\"16\" enabled=\"true\"\r\n\t\t\tleft=\"470\" top=\"12\"\t \r\n\t\t\tuseHandCursor=\"true\" \r\n\t\t\tdisabledSkin=\"@Embed('./TouchCommerce/btnClose.gif')\"\t\t\t\r\n\t\t\toverSkin=\"@Embed('./TouchCommerce/btnClose.gif')\"\t\t\t\r\n\t\t\tupSkin=\"@Embed('./TouchCommerce/btnClose.gif')\"\t\t\t\r\n\t\t\tdownSkin=\"@Embed('./TouchCommerce/btnClose.gif')\"\r\n\t\t\tselectedDownSkin=\"@Embed('./TouchCommerce/btnClose.gif')\"\r\n\t\t\t>\r\n </mx:Button>\r\n\r\n <mx:Button id=\"btnCall\" left=\"312\" top=\"259\" enabled=\"true\" labelPlacement=\"left\"\t\t \r\n height=\"23\" width=\"68\" useHandCursor=\"true\" styleName=\"PopBtnSend\" />\r\n\r\n <mx:TextInput id=\"chat_submit_callerName\" height=\"18\" borderStyle=\"none\" top=\"112\" left=\"100\" width=\"200\"/>\t\r\n\r\n <mx:TextInput id=\"chat_submit_callerPhone\" height=\"18\" borderStyle=\"none\" top=\"145\" left=\"100\" width=\"200\"/>\t\r\n \r\n <mx:TextInput id=\"txtInput\" height=\"100\" borderStyle=\"none\" top=\"178\" left=\"100\" width=\"200\"/>\t\r\n </mx:Canvas>\r\n\r\n</mx:Application>\r\n"
 ,       skinName : "TouchCommerceCall",
        skinPath : "http://localhost:3000/cigui/flash",
        skinTop : 0,
        skinWidth : 500,
        titlebarHeight : 55,
        userName : "You"
    }
    /*
    {
        agentName: window.top.agentName,
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
    }*/
);



