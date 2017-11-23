$estr = function() { return js.Boot.__string_rec(this,''); }
com = {}
com.inq = {}
com.inq.flash = {}
com.inq.flash.messagingframework = {}
com.inq.flash.messagingframework.Message = function(p) { if( p === $_ ) return; {
	this.data = new com.inq.utils.Dictionary();
	this.data["version"] = "0.05";
	this.data["msg.id"] = Date.now().getTime();
	this.postSend = false;
	this.initialDataIndex = 0;
}}
com.inq.flash.messagingframework.Message.__name__ = ["com","inq","flash","messagingframework","Message"];
com.inq.flash.messagingframework.Message.prototype.addProperty = function(name,value) {
	this.data[name] = value;
}
com.inq.flash.messagingframework.Message.prototype.data = null;
com.inq.flash.messagingframework.Message.prototype.encodeForMessage = function(text) {
	return text;
}
com.inq.flash.messagingframework.Message.prototype.getMessageType = function() {
	return this.data["msg.type"];
}
com.inq.flash.messagingframework.Message.prototype.getProperty = function(name) {
	return this.data[name];
}
com.inq.flash.messagingframework.Message.prototype.initialDataIndex = null;
com.inq.flash.messagingframework.Message.prototype.isPostSend = function() {
	return this.postSend;
}
com.inq.flash.messagingframework.Message.prototype.nextInitialDataIndex = function() {
	return this.initialDataIndex++;
}
com.inq.flash.messagingframework.Message.prototype.postSend = null;
com.inq.flash.messagingframework.Message.prototype.serialize = function() {
	var dataString = "";
	var keyz = Reflect.fields(this.data);
	{
		var _g1 = 0, _g = keyz.length;
		while(_g1 < _g) {
			var ix = _g1++;
			var key = keyz[ix];
			if(key != "") {
				var item = "";
				try {
					var valu = this.data[key];
					if(valu != null) {
						item = key + "=" + this.encodeForMessage(this.data[key]).toString() + "\n";
					}
				}
				catch( $e0 ) {
					if( js.Boot.__instanceof($e0,Error) ) {
						var e = $e0;
						{
							haxe.Log.trace("bad key: " + key + " error: " + e,{ fileName : "Message.hx", lineNumber : 72, className : "com.inq.flash.messagingframework.Message", methodName : "serialize"});
						}
					} else throw($e0);
				}
				dataString += item;
			}
		}
	}
	dataString += "\n";
	return dataString;
}
com.inq.flash.messagingframework.Message.prototype.setData = function(data) {
	var lines = data.split("\n");
	{
		var _g1 = 0, _g = lines.length;
		while(_g1 < _g) {
			var line = _g1++;
			var nameValuePair = lines[line].split("=");
			var name = nameValuePair[0];
			var value = nameValuePair[1];
			this.addProperty(name,value);
		}
	}
}
com.inq.flash.messagingframework.Message.prototype.setMessageType = function(messageType) {
	this.data["msg.type"] = messageType;
}
com.inq.flash.messagingframework.Message.prototype.setPostSend = function(isPost) {
	this.postSend = isPost;
}
com.inq.flash.messagingframework.Message.prototype.__class__ = com.inq.flash.messagingframework.Message;
com.inq.flash.client = {}
com.inq.flash.client.data = {}
com.inq.flash.client.data.ChatRequestMessage = function(chat,isPersistent,agentID,deltaTime) { if( chat === $_ ) return; {
	com.inq.flash.messagingframework.Message.apply(this,[]);
	this.setMessageType(com.inq.flash.client.data.MessageFields.TYPE_CHAT_REQUEST);
	this.addProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_ID,chat.getChatID());
	if(!chat.isBR20()) this.addProperty(com.inq.flash.client.data.MessageFields.KEY_CONFIG_ID,chat.getConfigID());
	else {
		this.addProperty(com.inq.flash.client.data.MessageFields.KEY_SITE_ID,chat.getSiteID());
		this.addProperty(com.inq.flash.client.data.MessageFields.KEY_LANGUAGE,chat.getLanguage());
		this.addProperty(com.inq.flash.client.data.MessageFields.KEY_SCRIPT_ID,chat.getScriptID());
		this.addProperty(com.inq.flash.client.data.MessageFields.KEY_CONFIG_ENTRY_BUSINESS_UNIT_ID,chat.getChannelID());
		this.addProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_TITLE,chat.getChatTitle());
		this.addProperty(com.inq.flash.client.data.MessageFields.KEY_CONFIG_ENTRY_BR_ID,chat.getBrID());
		this.addProperty(com.inq.flash.client.data.MessageFields.KEY_CONFIG_ENTRY_INC_ASSIGNMENT_ID,chat.getIncAssignmentId());
		this.addProperty(com.inq.flash.client.data.MessageFields.KEY_CONFIG_ENTRY_SESSION_ID,chat.getSessionId());
		this.addProperty(com.inq.flash.client.data.MessageFields.KEY_AGENT_ALIAS,chat.getAgentName());
		var useAgentAlias = (Application.application.skinConfig["useAgentAlias"]?Application.application.skinConfig["useAgentAlias"]:false);
		if(useAgentAlias) {
			this.addProperty(com.inq.flash.client.data.MessageFields.KEY_USE_AGENT_ALIAS,com.inq.flash.client.data.MessageFields.DATA_TRUE);
			var defaultAgentAlias = (Application.application.skinConfig["defaultAgentAlias"]?Application.application.skinConfig["defaultAgentAlias"]:"");
			this.addProperty(com.inq.flash.client.data.MessageFields.KEY_AGENT_ALIAS,(defaultAgentAlias == ""?" ":defaultAgentAlias));
		}
	}
	if(chat.getLaunchPage() != null && chat.getLaunchPage().length > 0) {
		this.addProperty(com.inq.flash.client.data.MessageFields.KEY_CONFIG_ENTRY_LAUNCH_PAGE,chat.getLaunchPage());
	}
	if(chat.getLaunchType() != null && chat.getLaunchType().length > 0) {
		this.addProperty(com.inq.flash.client.data.MessageFields.KEY_CONFIG_ENTRY_LAUNCH_TYPE,chat.getLaunchType());
	}
	if(chat.getDeviceType() != null && chat.getDeviceType().length > 0) {
		this.addProperty(com.inq.flash.client.data.MessageFields.KEY_CONFIG_ENTRY_DEVICE_TYPE,chat.getDeviceType());
	}
	this.addProperty(com.inq.flash.client.data.MessageFields.KEY_CONFIG_AGENT_ATTRIBUTE,chat.getAgentAttributes());
	var agentGroupID = com.inq.flash.client.control.FlashPeer.getBuRuleAgentGroupID(chat.getBrID());
	if(agentGroupID != null) {
		this.addProperty(com.inq.flash.client.data.MessageFields.KEY_CONFIG_AGENT_GROUP_ID,agentGroupID);
	}
	this.addProperty(com.inq.flash.client.data.MessageFields.KEY_CONFIG_VISITOR_ATTRIBUTES,chat.getVisitorAttributes());
	this.addProperty(com.inq.flash.client.data.MessageFields.KEY_CONFIG_RULE_ATTRIBUTES,chat.getRuleAttributes());
	this.addProperty(com.inq.flash.client.data.MessageFields.KEY_CUSTOMER_ID,chat.getCustomerID());
	this.addProperty(com.inq.flash.client.data.MessageFields.KEY_USERNAME,chat.getUsername());
	if(agentID != null && agentID.length > 0) this.addProperty(com.inq.flash.client.data.MessageFields.KEY_AGENT_ID,agentID);
	this.addProperty(com.inq.flash.client.data.MessageFields.KEY_PERSISTENT_FLAG,(isPersistent?"true":"false"));
	if((chat.getAutomatonId() != null) && !(com.inq.flash.client.chatskins.SkinControl.msgcntAtEntry > 0 && com.inq.flash.client.chatskins.SkinControl.getIsPersistentChat())) {
		this.addProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_AUTOMATON_ID,chat.getAutomatonId());
	}
	var pageID = com.inq.flash.client.control.FlashPeer.getPageID();
	this.addProperty(com.inq.flash.client.data.MessageFields.KEY_CONFIG_ENTRY_PAGE_ID,pageID);
	this.addProperty(com.inq.flash.client.data.MessageFields.KEY_TIME_DELTA,deltaTime);
	this.addProperty(com.inq.flash.client.data.MessageFields.KEY_CONFIG_V3_TIMEOUT,com.inq.flash.client.control.FlashPeer.getV3TimeOut());
}}
com.inq.flash.client.data.ChatRequestMessage.__name__ = ["com","inq","flash","client","data","ChatRequestMessage"];
com.inq.flash.client.data.ChatRequestMessage.__super__ = com.inq.flash.messagingframework.Message;
for(var k in com.inq.flash.messagingframework.Message.prototype ) com.inq.flash.client.data.ChatRequestMessage.prototype[k] = com.inq.flash.messagingframework.Message.prototype[k];
com.inq.flash.client.data.ChatRequestMessage.prototype.__class__ = com.inq.flash.client.data.ChatRequestMessage;
com.inq.flash.client.data.Chat = function(params) { if( params === $_ ) return; {
	this.transcript = new Array();
	this.chatID = params.chatID;
	this.configID = ((params.configID == null || params.configID == "")?null:params.configID);
	this.siteID = params.siteID;
	this.channelID = params.businessUnitID;
	this.agentName = ((params.agentName == null || params.agentName == "null" || StringTools.trim(params.agentName) == "")?"Jessica":params.agentName);
	this.scriptID = params.scriptID;
	this.chatTitle = params.chatTitle;
	this.br20 = (this.configID == null);
	this.brID = params.brID;
	this.language = params.language;
	this.launchPage = params.launchPage;
	this.launchType = params.launchType;
	this.deviceType = params.deviceType;
	this.incAssignmentID = params.incAssignmentID;
	this.sessionID = params.sessionID;
	this.thisCustomerID = params.customerID;
	this.thisParticipantName = params.userName;
	if(params.agentAttributes) {
		this.agentAttributes = params.agentAttributes;
	}
	if(params.visitorAttributes) {
		this.visitorAttributes = params.visitorAttributes;
	}
	if(params.ruleAttributes) {
		this.ruleAttributes = params.ruleAttributes;
	}
	if(params.automatonId) {
		this.automatonId = params.automatonId;
	}
}}
com.inq.flash.client.data.Chat.__name__ = ["com","inq","flash","client","data","Chat"];
com.inq.flash.client.data.Chat.prototype.addTextToTranscript = function(text,sender) {
	var entry = new com.inq.flash.messagingframework.TranscriptEntry();
	if(null != sender) sender = "";
	entry.setData(text);
	if(sender == "") {
		entry.setType("sent.message");
	}
	else {
		entry.setType("received.message");
		entry.setSender(sender);
	}
	this.transcript.push(entry);
}
com.inq.flash.client.data.Chat.prototype.agentAttributes = null;
com.inq.flash.client.data.Chat.prototype.agentName = null;
com.inq.flash.client.data.Chat.prototype.automatonId = null;
com.inq.flash.client.data.Chat.prototype.br20 = null;
com.inq.flash.client.data.Chat.prototype.brID = null;
com.inq.flash.client.data.Chat.prototype.channelID = null;
com.inq.flash.client.data.Chat.prototype.chatID = null;
com.inq.flash.client.data.Chat.prototype.chatTitle = null;
com.inq.flash.client.data.Chat.prototype.configID = null;
com.inq.flash.client.data.Chat.prototype.deviceType = null;
com.inq.flash.client.data.Chat.prototype.getAgentAttributes = function() {
	return this.agentAttributes;
}
com.inq.flash.client.data.Chat.prototype.getAgentName = function() {
	return this.agentName;
}
com.inq.flash.client.data.Chat.prototype.getAutomatonId = function() {
	return this.automatonId;
}
com.inq.flash.client.data.Chat.prototype.getBrID = function() {
	return this.brID;
}
com.inq.flash.client.data.Chat.prototype.getChannelID = function() {
	return this.channelID;
}
com.inq.flash.client.data.Chat.prototype.getChatID = function() {
	return this.chatID;
}
com.inq.flash.client.data.Chat.prototype.getChatTitle = function() {
	return this.chatTitle;
}
com.inq.flash.client.data.Chat.prototype.getConfigID = function() {
	return this.configID;
}
com.inq.flash.client.data.Chat.prototype.getCustomerID = function() {
	return this.thisCustomerID;
}
com.inq.flash.client.data.Chat.prototype.getDeviceType = function() {
	return this.deviceType;
}
com.inq.flash.client.data.Chat.prototype.getIncAssignmentId = function() {
	return this.incAssignmentID;
}
com.inq.flash.client.data.Chat.prototype.getLanguage = function() {
	return this.language;
}
com.inq.flash.client.data.Chat.prototype.getLaunchPage = function() {
	return this.launchPage;
}
com.inq.flash.client.data.Chat.prototype.getLaunchType = function() {
	return this.launchType;
}
com.inq.flash.client.data.Chat.prototype.getRuleAttributes = function() {
	return this.ruleAttributes;
}
com.inq.flash.client.data.Chat.prototype.getScriptID = function() {
	return this.scriptID;
}
com.inq.flash.client.data.Chat.prototype.getSessionId = function() {
	return this.sessionID;
}
com.inq.flash.client.data.Chat.prototype.getSiteID = function() {
	return this.siteID;
}
com.inq.flash.client.data.Chat.prototype.getUsername = function() {
	return this.thisParticipantName;
}
com.inq.flash.client.data.Chat.prototype.getVisitorAttributes = function() {
	return this.visitorAttributes;
}
com.inq.flash.client.data.Chat.prototype.incAssignmentID = null;
com.inq.flash.client.data.Chat.prototype.isBR20 = function() {
	return this.br20;
}
com.inq.flash.client.data.Chat.prototype.language = null;
com.inq.flash.client.data.Chat.prototype.launchPage = null;
com.inq.flash.client.data.Chat.prototype.launchType = null;
com.inq.flash.client.data.Chat.prototype.ruleAttributes = null;
com.inq.flash.client.data.Chat.prototype.scriptID = null;
com.inq.flash.client.data.Chat.prototype.sessionID = null;
com.inq.flash.client.data.Chat.prototype.setAgentAttributes = function(attributes) {
	this.agentAttributes = attributes;
}
com.inq.flash.client.data.Chat.prototype.setAutomatonId = function(id) {
	this.automatonId = id;
}
com.inq.flash.client.data.Chat.prototype.setChannelID = function(id) {
	this.channelID = id;
}
com.inq.flash.client.data.Chat.prototype.setRuleAttributes = function(attributes) {
	this.ruleAttributes = attributes;
}
com.inq.flash.client.data.Chat.prototype.setVisitorAttributes = function(attributes) {
	this.visitorAttributes = attributes;
}
com.inq.flash.client.data.Chat.prototype.siteID = null;
com.inq.flash.client.data.Chat.prototype.thisCustomerID = null;
com.inq.flash.client.data.Chat.prototype.thisParticipantName = null;
com.inq.flash.client.data.Chat.prototype.toString = function() {
	return "Chat[" + this.chatID + "]: config-" + ((this.configID != null?this.configID:"null")) + ", site-" + this.siteID + ", br20-" + this.br20 + ", chID-" + this.channelID + ", agentName-" + this.agentName + ", scriptID=" + this.scriptID + ", customerID-" + this.thisCustomerID + ", chatTitle-" + this.chatTitle + ", brID-" + this.brID;
}
com.inq.flash.client.data.Chat.prototype.transcript = null;
com.inq.flash.client.data.Chat.prototype.visitorAttributes = null;
com.inq.flash.client.data.Chat.prototype.__class__ = com.inq.flash.client.data.Chat;
com.inq.flash.messagingframework.Participant = function(type,id,username) { if( type === $_ ) return; {
	this.participantType = type;
	this.ID = id;
	this.username = username;
}}
com.inq.flash.messagingframework.Participant.__name__ = ["com","inq","flash","messagingframework","Participant"];
com.inq.flash.messagingframework.Participant.prototype.ID = null;
com.inq.flash.messagingframework.Participant.prototype.getID = function() {
	return this.ID;
}
com.inq.flash.messagingframework.Participant.prototype.getType = function() {
	return this.participantType;
}
com.inq.flash.messagingframework.Participant.prototype.getUsername = function() {
	return this.username;
}
com.inq.flash.messagingframework.Participant.prototype.participantType = null;
com.inq.flash.messagingframework.Participant.prototype.username = null;
com.inq.flash.messagingframework.Participant.prototype.__class__ = com.inq.flash.messagingframework.Participant;
com.inq.flash.client.data.MessageFields = function() { }
com.inq.flash.client.data.MessageFields.__name__ = ["com","inq","flash","client","data","MessageFields"];
com.inq.flash.client.data.MessageFields.prototype.__class__ = com.inq.flash.client.data.MessageFields;
com.inq.events = {}
com.inq.events.EventDispatcher = function(p) { if( p === $_ ) return; {
	this.eventListeners = { }
}}
com.inq.events.EventDispatcher.__name__ = ["com","inq","events","EventDispatcher"];
com.inq.events.EventDispatcher.prototype.addEventListener = function(type,listener,useCapture,priority,useWeakReference) {
	this.eventListeners[type] = listener;
}
com.inq.events.EventDispatcher.prototype.dispatchEvent = function(event) {
	var listener = this.eventListeners[event.type];
	if(listener != null) {
		try {
			listener(event);
		}
		catch( $e1 ) {
			if( js.Boot.__instanceof($e1,Error) ) {
				var e = $e1;
				null;
			} else throw($e1);
		}
	}
	return true;
}
com.inq.events.EventDispatcher.prototype.eventListeners = null;
com.inq.events.EventDispatcher.prototype.hasEventListener = function(type) {
	return (this.eventListeners[type] != null);
}
com.inq.events.EventDispatcher.prototype.removeEventListener = function(type,listener,useCapture) {
	if(this.eventListeners == listener) this.eventListeners[type] = null;
}
com.inq.events.EventDispatcher.prototype.toString = function() {
	return "EventDispacher";
}
com.inq.events.EventDispatcher.prototype.willTrigger = function(type) {
	return false;
}
com.inq.events.EventDispatcher.prototype.__class__ = com.inq.events.EventDispatcher;
com.inq.ui = {}
com.inq.ui.Container = function(_id,_parentNode,document) { if( _id === $_ ) return; {
	com.inq.events.EventDispatcher.apply(this,[]);
	this._bgi = null;
	this._visible = true;
	this._clientStage = (Std["is"](this,com.inq.ui.ClientBody));
	this._isSprite = null;
	this.styles = { }
	this.parent = null;
	this.document = ((document != null)?document:window.document);
	if(com.inq.ui.SkinLoader.skinInClient) this.document = window.parent.document;
	if(null != _id) {
		var element = null;
		element = com.inq.ui.Container.getElementById(_id);
		if(element != null) {
			this.styles.zindex = null;
			this.styles.visible = "true";
			this.styles.left = this.styles.top = this.styles.width = this.styles.height = this.styles.enabled = null;
			this._div = element;
			this._parent = ((_parentNode == null)?this._div.parentNode:_parentNode);
			this.styles.id = _id;
		}
	}
	if(this._div != null) {
		this._div.container = this;
	}
	else {
		this._style = "position: absolute; left: 0px; top: 0px; width: 100px; height: 60px; overflow: hidden;";
		this.styles.zindex = null;
		this.styles.visible = "true";
		this.styles.left = this.styles.top = this.styles.enabled = null;
		this.styles.width = null;
		this.styles.height = null;
		this._div = this.document.createElement("DIV");
		this._div.className = "tcChat";
		this._div.style.cssText = this._style;
		this.eventListeners = { }
	}
	this._div.className = "tcChat";
}}
com.inq.ui.Container.__name__ = ["com","inq","ui","Container"];
com.inq.ui.Container.__super__ = com.inq.events.EventDispatcher;
for(var k in com.inq.events.EventDispatcher.prototype ) com.inq.ui.Container.prototype[k] = com.inq.events.EventDispatcher.prototype[k];
com.inq.ui.Container.getElementById = function(_id) {
	var element = null;
	if(com.inq.ui.Container.isString(_id)) {
		if(com.inq.ui.SkinLoader.skinInClient || _id.indexOf("inq") == 0) {
			element = com.inq.ui.Container._getElementById(_id,window.parent.document);
		}
		if(element == null) {
			element = com.inq.ui.Container._getElementById("tcChat_" + _id,window.parent.document);
		}
		if(element == null) {
			element = com.inq.ui.Container._getElementById(_id);
		}
	}
	else {
		element = _id;
	}
	return element;
}
com.inq.ui.Container._getElementById = function(id,doc) {
	if(doc == null) doc = window.document;
	var el = doc.getElementById(id);
	if(el != null && el.id != id) {
		var i;
		var allElements = doc.getElementsByTagName("*");
		{
			var _g1 = 0, _g = allElements.length;
			while(_g1 < _g) {
				var i1 = _g1++;
				el = allElements[i1];
				if(el != null && el.id == id) {
					return el;
				}
			}
		}
		return null;
	}
	return el;
}
com.inq.ui.Container.find = function(label) {
	var element = window.document.getElementById(label);
	var found = ((element != null)?element.container:null);
	return found;
}
com.inq.ui.Container.encodeSize = function(size,defaultSuffix) {
	if(defaultSuffix == null) defaultSuffix = "px";
	var re = new EReg("[+-]?\\d*","");
	if(re.match(size)) return size + defaultSuffix;
	return size;
}
com.inq.ui.Container.isString = function(ob) {
	if(null == ob) return false;
	return Std["is"](ob,String);
}
com.inq.ui.Container.prototype._bgi = null;
com.inq.ui.Container.prototype._clientStage = null;
com.inq.ui.Container.prototype._div = null;
com.inq.ui.Container.prototype._height = null;
com.inq.ui.Container.prototype._isSprite = null;
com.inq.ui.Container.prototype._loadHeight = null;
com.inq.ui.Container.prototype._loadWidth = null;
com.inq.ui.Container.prototype._newim = null;
com.inq.ui.Container.prototype._parent = null;
com.inq.ui.Container.prototype._style = null;
com.inq.ui.Container.prototype._visible = null;
com.inq.ui.Container.prototype._width = null;
com.inq.ui.Container.prototype.applyStyle = function() {
	this.buildStyle();
	if(this._div != null) this._div.style.cssText = this._style;
	var adjustment;
	adjustment = Std.parseInt(this._div.style.borderLeftWidth) + Std.parseInt(this._div.style.borderRightWidth);
	if(adjustment > 0) {
		this._div.style.width = Math.max(Std.parseInt(this._div.style.width) - adjustment,0) + "px";
	}
	adjustment = Std.parseInt(this._div.style.borderTopWidth) + Std.parseInt(this._div.style.borderBottomWidth);
	if(adjustment > 0) {
		this._div.style.height = Math.max(Std.parseInt(this._div.style.height) - adjustment,0) + "px";
	}
}
com.inq.ui.Container.prototype.attachTo = function(parentContainer,after) {
	var ob = parentContainer._div;
	var obSibling = ((after != null)?after._div:null);
	if(!Std["is"](parentContainer,com.inq.ui.ClientBody)) {
		if(parentContainer.contains == null) parentContainer.contains = new Array();
		if(this._div.id != "inqTitleBar" && this._div.id != "inqDivResizeCorner" && this._div.id != "tcChat_Skin") {
			parentContainer.contains[parentContainer.contains.length] = this;
		}
	}
	this.attachToElement(ob,obSibling);
	this.parent = parentContainer;
	this._clientStage = parentContainer._clientStage;
}
com.inq.ui.Container.prototype.attachToElement = function(ob,after) {
	this._parent = ob;
	if(this._div.parentNode != null && this._div.parentNode.nodeName.indexOf("#") != 0) return;
	if(null != this.styles.id) this.setID(this.styles.id);
	try {
		if(after == null) ob.appendChild(this._div);
		else {
			if(after.nextSibling == null) ob.appendChild(this._div);
			else ob.insertBefore(this._div,after.nextSibling);
		}
	}
	catch( $e2 ) {
		if( js.Boot.__instanceof($e2,Error) ) {
			var e = $e2;
			{
				haxe.Log.trace("ERROR: " + e,{ fileName : "Container.hx", lineNumber : 1052, className : "com.inq.ui.Container", methodName : "attachToElement"});
			}
		} else throw($e2);
	}
}
com.inq.ui.Container.prototype.buildChatElementStyle = function() {
	this._style = "z-index: 100; position: absolute;";
	this._style = "position: absolute; overflow: hidden;";
	var w = this.styles.width;
	var l = this.styles.left;
	var t = this.styles.top;
	var h = this.styles.height;
	var pw = ((this._parent == null)?this.styles.width:this._parent.clientWidth);
	var ph = ((this._parent == null)?this.styles.height:this._parent.clientHeight);
	this._style += "z-index: " + (((this.styles.zindex == null)?"101":this.styles.zindex)) + ";";
	var stylesHeight = this.styles["height"];
	var stylesWidth = this.styles["width"];
	if(null != stylesWidth && com.inq.ui.Container.isString(stylesWidth) && "%" == this.styles.width.substr(stylesWidth.length - 1)) w = "" + (this.evaluatePosition(stylesWidth) * pw) / 100;
	if(null != stylesHeight && com.inq.ui.Container.isString(stylesHeight) && "%" == this.styles.height.substr(stylesHeight.length - 1)) h = "" + (this.evaluatePosition(stylesHeight) * ph) / 100;
	if(null == h && this._div != null) h = "" + (this._div.clientHeight);
	if(null == w && this._div != null) w = "" + (this._div.clientWidth);
	if(this.styles.left != null && this.styles.right != null) {
		l = "" + this.evaluatePosition(this.styles.left);
		w = "" + ((pw - this.evaluatePosition(this.styles.right)) - this.evaluatePosition(this.styles.left));
	}
	else if(this.styles.left != null && this.styles.right == null) {
		l = "" + this.evaluatePosition(this.styles.left);
	}
	else if(this.styles.left == null && this.styles.right != null) {
		l = "" + (pw - (this.evaluatePosition(this.styles.right) + this.evaluatePosition(w)));
	}
	if(this.styles.top != null && this.styles.bottom != null) {
		t = "" + this.evaluatePosition(this.styles.top);
		h = "" + ((ph - this.evaluatePosition(this.styles.bottom)) - this.evaluatePosition(this.styles.top));
	}
	else if(this.styles.top != null && this.styles.bottom == null) {
		t = "" + this.evaluatePosition(this.styles.top);
	}
	else if(this.styles.top == null && this.styles.bottom != null) {
		t = "" + (ph - (this.evaluatePosition(this.styles.bottom) + this.evaluatePosition(h)));
	}
	if(l != null) this._style += "left: " + l + "px;";
	if(t != null) this._style += "top: " + t + "px;";
	if(this.styles["alpha"] != null) this._style += "filter:alpha(opacity=" + this.styles["alpha"] + ");-moz-opacity:0." + this.styles["alpha"] + ";-khtml-opacity: 0." + this.styles["alpha"] + ";opacity: 0." + this.styles["alpha"] + ";";
	if(this.styles.cursor != null) this._style += "cursor: " + this.styles.cursor + ";";
	if(h != null && h != "0") this._style += "height: " + h + "px;";
	if(w != null && w != "0") this._style += "width: " + w + "px;";
	if(this.styles.borderStyle != null) this._style += "border-style: " + this.styles.borderStyle + ";";
	if(this.styles.borderThickness != null) this._style += "border-width: " + this.styles.borderThickness + "px;";
	if(this.styles.borderColor != null) this._style += "border-color: " + this.styles.borderColor + ";";
	if(this.styles["border-color"] != null) this._style += "border-color: " + this.styles["border-color"] + ";";
	if(this.styles["border-thickness"] != null) this._style += "border-width: " + this.styles["border-thickness"] + "px;";
	if(this.styles["border-thickness-left"] != null) this._style += "border-left-width: " + this.styles["border-thickness-left"] + "px;";
	if(this.styles["border-thickness-right"] != null) this._style += "border-right-width: " + this.styles["border-thickness-right"] + "px;";
	if(this.styles["border-thickness-top"] != null) this._style += "border-top-width: " + this.styles["border-thickness-top"] + "px;";
	if(this.styles["border-thickness-bottom"] != null) this._style += "border-bottom-width: " + this.styles["border-thickness-bottom"] + "px;";
	if(this.styles["border-style"] != null) this._style += "border-style: " + this.styles["border-style"] + ";";
	if(this.styles["z-index"] != null) this._style += "z-index: " + this.styles["z-index"] + ";";
	if(this.styles.color != null) this._style += "color: " + this.styles.color + ";";
	if(this.styles.fontFamily != null) this._style += " font-family: " + this.styles.fontFamily + ";";
	if(this.styles.fontSize != null) this._style += " font-size: " + this.styles.fontSize + "pt;";
	if(this.styles.textAlign != null) this._style += "text-align:" + this.styles.textAlign + ";";
	if(this.styles.verticalAlign != null) this._style += "vertical-align:" + this.styles.verticalAlign + ";";
	this._style += ((this.styles.visible == "true")?" display: block;":"display: none;");
	if(this.styles["visibility"] == "collapse") {
		this._style += "height:0px;width:0px;display:none;visibility:collapse";
		return;
	}
	if(this.styles.backgroundGradientColors != null) {
		var bc = this.styles.backgroundGradientColors.substr(1,this.styles.backgroundGradientColors.length - 2);
		var bca = bc.split(",");
		this._style += "background-color: " + bca[0] + ";";
	}
	else if(this.styles.backgroundColor != null) {
		this._style += "background-color: " + this.styles.backgroundColor + ";";
	}
	if(this.styles.backgroundImage != null) {
		if(this.styles.backgroundSize == "100%") {
			if(h != null && h.length > 0 && h.indexOf("%") == -1) h += "px";
			if(w != null && w.length > 0 && w.indexOf("%") == -1) w += "px";
			if(w != null) this._bgi.style.width = w;
			if(h != null) this._bgi.style.height = h;
		}
		else {
			if(this._bgi) this._bgi.style.width = this._bgi.style.height = "0px";
			this._style += " background-image:url('" + this.styles.backgroundImage + "')";
		}
	}
}
com.inq.ui.Container.prototype.buildClientElementStyle = function() {
	this._style = "";
	var w = this.styles.width;
	var l = this.styles.left;
	var t = this.styles.top;
	var h = this.styles.height;
	var pw = ((this._parent == null)?this.styles.width:this._parent.clientWidth);
	var ph = ((this._parent == null)?this.styles.height:this._parent.clientHeight);
	this._style += "z-index: " + (((this.styles.zindex == null)?"101":this.styles.zindex)) + ";";
	var stylesHeight = this.styles["height"];
	var stylesWidth = this.styles["width"];
	if(null != stylesWidth && com.inq.ui.Container.isString(stylesWidth) && "%" == this.styles.width.substr(stylesWidth.length - 1)) w = "" + (this.evaluatePosition(stylesWidth) * pw) / 100;
	if(null != stylesHeight && com.inq.ui.Container.isString(stylesHeight) && "%" == this.styles.height.substr(stylesHeight.length - 1)) h = "" + (this.evaluatePosition(stylesHeight) * ph) / 100;
	if(null == h && this._div != null) h = "" + (this._div.clientHeight);
	if(null == w && this._div != null) w = "" + (this._div.clientWidth);
	if(this.styles.left != null) this._style += "left:" + this.evaluatePosition(this.styles.left) + "px;";
	if(this.styles.right != null) this._style += "right:" + this.evaluatePosition(this.styles.right) + "px;";
	if(this.styles.top != null) this._style += "top:" + this.evaluatePosition(this.styles.top) + "px;";
	if(this.styles.bottom != null) this._style += "bottom:" + this.evaluatePosition(this.styles.bottom) + "px;";
	if(this.styles["alpha"] != null) this._style += "filter:alpha(opacity=" + this.styles["alpha"] + ");-moz-opacity:0." + this.styles["alpha"] + ";-khtml-opacity: 0." + this.styles["alpha"] + ";opacity: 0." + this.styles["alpha"] + ";";
	if(this.styles.cursor != null) this._style += "cursor: " + this.styles.cursor + ";";
	if(h != null && h != "0") this._style += "height: " + h + "px;";
	if(w != null && w != "0") this._style += "width: " + w + "px;";
	if(this.styles.borderStyle != null) this._style += "border-style: " + this.styles.borderStyle + ";";
	if(this.styles.borderThickness != null) this._style += "border-width: " + this.styles.borderThickness + "px;";
	if(this.styles.borderColor != null) this._style += "border-color: " + this.styles.borderColor + ";";
	if(this.styles["border-color"] != null) this._style += "border-color: " + this.styles["border-color"] + ";";
	if(this.styles["border-thickness"] != null) this._style += "border-width: " + this.styles["border-thickness"] + "px;";
	if(this.styles["border-thickness-left"] != null) this._style += "border-left-width: " + this.styles["border-thickness-left"] + "px;";
	if(this.styles["border-thickness-right"] != null) this._style += "border-right-width: " + this.styles["border-thickness-right"] + "px;";
	if(this.styles["border-thickness-top"] != null) this._style += "border-top-width: " + this.styles["border-thickness-top"] + "px;";
	if(this.styles["border-thickness-bottom"] != null) this._style += "border-bottom-width: " + this.styles["border-thickness-bottom"] + "px;";
	if(this.styles["border-style"] != null) this._style += "border-style: " + this.styles["border-style"] + ";";
	if(this.styles["border-radius"] != null) this._style += "border-radius: " + this.styles["border-radius"] + "px;" + "-webkit-border-radius: " + this.styles["border-radius"] + "px;" + "-moz-border-radius: " + this.styles["border-radius"] + "px;";
	if(this.styles["font-weight"] != null) this._style += "font-weight: " + this.styles["font-weight"] + ";";
	if(this.styles["font-family"] != null) this._style += "font-family: " + this.styles["font-family"] + ";";
	if(this.styles["font-size"] != null) this._style += "font-size: " + this.styles["font-size"] + ";";
	if(this.styles["background-color"] != null) this._style += "background-color: " + this.styles["background-color"] + ";";
	if(this.styles["position"] != null) this._style += "position: " + this.styles["position"] + ";";
	if(this.styles["z-index"] != null) this._style += "z-index: " + this.styles["z-index"] + ";";
	if(this.styles["overflow"] != null) this._style += "overflow: " + this.styles["overflow"] + ";";
	if(this.styles["text-align"] != null) this._style += "text-align: " + this.styles["text-align"] + ";";
	if(this.styles["min-width"] != null) this._style += "min-width: " + this.styles["min-width"] + ";";
	if(this.styles["padding"] != null) this._style += "padding: " + this.styles["padding"] + ";";
	if(this.styles.color != null) this._style += "color: " + this.styles.color + ";";
	if(this.styles.fontFamily != null) this._style += " font-family: " + this.styles.fontFamily + ";";
	if(this.styles.fontSize != null) this._style += " font-size: " + this.styles.fontSize + "pt;";
	if(this.styles.textAlign != null) this._style += "text-align:" + this.styles.textAlign + ";";
	if(this.styles.verticalAlign != null) this._style += "vertical-align:" + this.styles.verticalAlign + ";";
	this._style += ((this.styles.visible == "true")?" display: block;":"display: none;");
	if(this.styles["visibility"] == "collapse") {
		this._style += "height:0px;width:0px;display:none;visibility:collapse";
		return;
	}
	if(this.styles.backgroundGradientColors != null) {
		var bc = this.styles.backgroundGradientColors.substr(1,this.styles.backgroundGradientColors.length - 2);
		var bca = bc.split(",");
		this._style += "background-color: " + bca[0] + ";";
	}
	else if(this.styles.backgroundColor != null) {
		this._style += "background-color: " + this.styles.backgroundColor + ";";
	}
	if(this.styles.backgroundImage != null) {
		if(this.styles.backgroundSize == "100%") {
			if(h != null && h.length > 0 && h.indexOf("%") == -1) h += "px";
			if(w != null && w.length > 0 && w.indexOf("%") == -1) w += "px";
			if(w != null) this._bgi.style.width = w;
			if(h != null) this._bgi.style.height = h;
		}
		else {
			if(this._bgi) this._bgi.style.width = this._bgi.style.height = "0px";
			this._style += " background-image:url('" + this.styles.backgroundImage + "')";
		}
	}
}
com.inq.ui.Container.prototype.buildNewStyle = function() {
	this._style = "position: absolute; overflow: hidden;";
	var w = this.styles.width;
	var l = this.styles.left;
	var t = this.styles.top;
	var h = this.styles.height;
	var pw = ((this._parent == null)?this.styles.width:this._parent.clientWidth);
	var ph = ((this._parent == null)?this.styles.height:this._parent.clientHeight);
	this._style += "z-index: " + (((this.styles.zindex == null)?"101":this.styles.zindex)) + ";";
	var stylesHeight = this.styles["height"];
	var stylesWidth = this.styles["width"];
	if(null != stylesWidth && com.inq.ui.Container.isString(stylesWidth) && "%" == this.styles.width.substr(stylesWidth.length - 1)) w = "" + (this.evaluatePosition(stylesWidth) * pw) / 100;
	if(null != stylesHeight && com.inq.ui.Container.isString(stylesHeight) && "%" == this.styles.height.substr(stylesHeight.length - 1)) h = "" + (this.evaluatePosition(stylesHeight) * ph) / 100;
	if(null == h && this._div != null) h = "" + (this._div.clientHeight);
	if(null == w && this._div != null) w = "" + (this._div.clientWidth);
	if(this.styles.left != null && this.styles.right != null) {
		l = "" + this.evaluatePosition(this.styles.left);
		w = "" + ((pw - this.evaluatePosition(this.styles.right)) - this.evaluatePosition(this.styles.left));
	}
	else if(this.styles.left != null && this.styles.right == null) {
		l = "" + this.evaluatePosition(this.styles.left);
	}
	else if(this.styles.left == null && this.styles.right != null) {
		l = "" + (pw - (this.evaluatePosition(this.styles.right) + this.evaluatePosition(w)));
	}
	if(this.styles.top != null && this.styles.bottom != null) {
		t = "" + this.evaluatePosition(this.styles.top);
		h = "" + ((ph - this.evaluatePosition(this.styles.bottom)) - this.evaluatePosition(this.styles.top));
	}
	else if(this.styles.top != null && this.styles.bottom == null) {
		t = "" + this.evaluatePosition(this.styles.top);
	}
	else if(this.styles.top == null && this.styles.bottom != null) {
		t = "" + (ph - (this.evaluatePosition(this.styles.bottom) + this.evaluatePosition(h)));
	}
	if(l != null) this._style += "left: " + l + "px;";
	if(t != null) this._style += "top: " + t + "px;";
	var keyz = Reflect.fields(this.styles);
	{
		var _g1 = 0, _g = keyz.length;
		while(_g1 < _g) {
			var s = _g1++;
			var keyname = keyz[s];
			var datum = this.styles[keyname];
			switch(keyname) {
			case "height":case "width":case "top":case "bottom":case "left":case "right":{
				if(this._clientStage) {
					this._style += keyname + ": " + this.styles[keyname] + ";";
				}
			}break;
			case "alpha":{
				this._style += "filter:alpha(opacity=" + datum + ");-moz-opacity:0." + datum + ";-khtml-opacity: 0." + datum + ";opacity: 0." + datum + ";";
			}break;
			case "border-width":{
				this._style += keyname + ": " + com.inq.ui.Container.encodeSize(datum) + ";";
			}break;
			case "borderThickness":{
				this._style += "border-width" + ": " + com.inq.ui.Container.encodeSize(datum) + ";";
			}break;
			case "borderColor":{
				this._style += "borderColor" + ": " + datum + ";";
			}break;
			case "border-thickness":{
				this._style += "border-width: " + com.inq.ui.Container.encodeSize(datum) + ";";
			}break;
			case "border-thickness-left":{
				this._style += "border-left-width: " + com.inq.ui.Container.encodeSize(datum) + ";";
			}break;
			case "border-thickness-right":{
				this._style += "border-right-width: " + com.inq.ui.Container.encodeSize(datum) + ";";
			}break;
			case "border-thickness-top":{
				this._style += "border-top-width: " + com.inq.ui.Container.encodeSize(datum) + ";";
			}break;
			case "border-thickness-bottom":{
				this._style += "border-bottom-width: " + com.inq.ui.Container.encodeSize(datum) + ";";
			}break;
			case "fontFamily":{
				this._style += "font-family: " + datum + ";";
			}break;
			case "fontSize":{
				this._style += "font-size: " + com.inq.ui.Container.encodeSize(datum,"pt") + ";";
			}break;
			case "textAlign":{
				this._style += "text-align:" + datum + ";";
			}break;
			case "verticalAlign":{
				this._style += "vertical-align:" + datum + ";";
			}break;
			case "backgroundColor":{
				this._style += "background-color: " + datum + ";";
			}break;
			case "visibility":{
				if(datum == "collapse") {
					this._style += "height:0px;width:0px;display:none;visibility:collapse";
					return;
				}
			}break;
			case "backgroundGradientColors":{
				var bc = datum.substr(1,datum.length - 2);
				var bca = bc.split(",");
				this._style += "background-color: " + bca[0] + ";";
			}break;
			case "visible":{
				this._style += ((datum == "true")?" display: block;":"display: none;");
			}break;
			default:{
				this._style += keyname + ": " + datum + ";";
			}break;
			}
		}
	}
	if(!this._clientStage) {
		if(h != null && h != "0") this._style += "height: " + h + "px;";
		if(w != null && w != "0") this._style += "width: " + w + "px;";
		if(l != null) this._style += "left: " + l + "px;";
		if(t != null) this._style += "top: " + t + "px;";
	}
	if(this.styles.backgroundImage != null) {
		if(this.styles.backgroundSize == "100%") {
			if(h != null && h.length > 0 && h.indexOf("%") == -1) h += "px";
			if(w != null && w.length > 0 && w.indexOf("%") == -1) w += "px";
			if(w != null) this._bgi.style.width = w;
			if(h != null) this._bgi.style.height = h;
		}
		else {
			if(this._bgi) this._bgi.style.width = this._bgi.style.height = "0px";
			this._style += " background-image:url('" + this.styles.backgroundImage + "')";
		}
	}
}
com.inq.ui.Container.prototype.buildStyle = function() {
	if((!com.inq.utils.Capabilities._isSafari() || !com.inq.ui.SkinLoader.skinInClient) && !com.inq.ui.SkinLoader.hasClientBody) {
		this.buildStyleOriginal();
	}
	else {
		this.fixCssClasses();
		if(this._div.id == "inqTitleBar" || this._div.id == "inqDivResizeCorner") {
			this.buildStyleOriginal();
		}
		else if(Std["is"](this,com.inq.ui.Html)) {
			this.buildClientElementStyle();
		}
		else if(this.parent != null && Std["is"](this.parent,com.inq.ui.ClientBody)) {
			this.buildClientElementStyle();
		}
		else {
			this.buildNewStyle();
		}
	}
}
com.inq.ui.Container.prototype.buildStyleOriginal = function() {
	this._style = "z-index: 100; position: absolute;";
	this._style = "position: absolute; overflow: hidden;";
	var w = this.styles.width;
	var l = this.styles.left;
	var t = this.styles.top;
	var h = this.styles.height;
	var pw = ((this._parent == null)?this.styles.width:this._parent.clientWidth);
	var ph = ((this._parent == null)?this.styles.height:this._parent.clientHeight);
	this._style += "z-index: " + (((this.styles.zindex == null)?"101":this.styles.zindex)) + ";";
	var stylesHeight = this.styles["height"];
	var stylesWidth = this.styles["width"];
	if(null != stylesWidth && com.inq.ui.Container.isString(stylesWidth) && "%" == this.styles.width.substr(stylesWidth.length - 1)) w = "" + (this.evaluatePosition(stylesWidth) * pw) / 100;
	if(null != stylesHeight && com.inq.ui.Container.isString(stylesHeight) && "%" == this.styles.height.substr(stylesHeight.length - 1)) h = "" + (this.evaluatePosition(stylesHeight) * ph) / 100;
	if(null == h && this._div != null) h = "" + (this._div.clientHeight);
	if(null == w && this._div != null) w = "" + (this._div.clientWidth);
	if(this.styles.left != null && this.styles.right != null) {
		l = "" + this.evaluatePosition(this.styles.left);
		w = "" + ((pw - this.evaluatePosition(this.styles.right)) - this.evaluatePosition(this.styles.left));
	}
	else if(this.styles.left != null && this.styles.right == null) {
		l = "" + this.evaluatePosition(this.styles.left);
	}
	else if(this.styles.left == null && this.styles.right != null) {
		l = "" + (pw - (this.evaluatePosition(this.styles.right) + this.evaluatePosition(w)));
	}
	if(this.styles.top != null && this.styles.bottom != null) {
		t = "" + this.evaluatePosition(this.styles.top);
		h = "" + ((ph - this.evaluatePosition(this.styles.bottom)) - this.evaluatePosition(this.styles.top));
	}
	else if(this.styles.top != null && this.styles.bottom == null) {
		t = "" + this.evaluatePosition(this.styles.top);
	}
	else if(this.styles.top == null && this.styles.bottom != null) {
		t = "" + (ph - (this.evaluatePosition(this.styles.bottom) + this.evaluatePosition(h)));
	}
	if(l != null) this._style += "left: " + l + "px;";
	if(t != null) this._style += "top: " + t + "px;";
	if(this.styles["alpha"] != null) this._style += "filter:alpha(opacity=" + this.styles["alpha"] + ");-moz-opacity:0." + this.styles["alpha"] + ";-khtml-opacity: 0." + this.styles["alpha"] + ";opacity: 0." + this.styles["alpha"] + ";";
	if(this.styles.cursor != null) this._style += "cursor: " + this.styles.cursor + ";";
	if(h != null && h != "0") this._style += "height: " + h + "px;";
	if(w != null && w != "0") this._style += "width: " + w + "px;";
	if(this.styles.borderStyle != null) this._style += "border-style: " + this.styles.borderStyle + ";";
	if(this.styles.borderThickness != null) this._style += "border-width: " + this.styles.borderThickness + "px;";
	if(this.styles.borderColor != null) this._style += "border-color: " + this.styles.borderColor + ";";
	if(this.styles["border-color"] != null) this._style += "border-color: " + this.styles["border-color"] + ";";
	if(this.styles["border-thickness"] != null) this._style += "border-width: " + this.styles["border-thickness"] + "px;";
	if(this.styles["border-thickness-left"] != null) this._style += "border-left-width: " + this.styles["border-thickness-left"] + "px;";
	if(this.styles["border-thickness-right"] != null) this._style += "border-right-width: " + this.styles["border-thickness-right"] + "px;";
	if(this.styles["border-thickness-top"] != null) this._style += "border-top-width: " + this.styles["border-thickness-top"] + "px;";
	if(this.styles["border-thickness-bottom"] != null) this._style += "border-bottom-width: " + this.styles["border-thickness-bottom"] + "px;";
	if(this.styles["border-style"] != null) this._style += "border-style: " + this.styles["border-style"] + ";";
	if(this.styles.color != null) this._style += "color: " + this.styles.color + ";";
	if(this.styles.fontFamily != null) this._style += " font-family: " + this.styles.fontFamily + ";";
	if(this.styles.fontSize != null) this._style += " font-size: " + this.styles.fontSize + "pt;";
	if(this.styles.textAlign != null) this._style += "text-align:" + this.styles.textAlign + ";";
	if(this.styles.verticalAlign != null) this._style += "vertical-align:" + this.styles.verticalAlign + ";";
	this._style += ((this.styles.visible == "true")?" display: block;":"display: none;");
	if(this.styles["visibility"] == "collapse") {
		this._style += "height:0px;width:0px;display:none;visibility:collapse";
		return;
	}
	if(this.styles.backgroundGradientColors != null) {
		var bc = this.styles.backgroundGradientColors.substr(1,this.styles.backgroundGradientColors.length - 2);
		var bca = bc.split(",");
		this._style += "background-color: " + bca[0] + ";";
	}
	else if(this.styles.backgroundColor != null) {
		this._style += "background-color: " + this.styles.backgroundColor + ";";
	}
	if(this.styles.backgroundImage != null) {
		if(this.styles.backgroundSize == "100%") {
			if(h != null && h.length > 0 && h.indexOf("%") == -1) h += "px";
			if(w != null && w.length > 0 && w.indexOf("%") == -1) w += "px";
			if(w != null) this._bgi.style.width = w;
			if(h != null) this._bgi.style.height = h;
		}
		else {
			if(this._bgi) this._bgi.style.width = this._bgi.style.height = "0px";
			this._style += " background-image:url('" + this.styles.backgroundImage + "')";
		}
	}
}
com.inq.ui.Container.prototype.calculateHeight = function() {
	var top = this.evaluatePosition(this.getStyle("top"));
	var bottom = this.evaluatePosition(this.getStyle("bottom"));
	var height = this._div.clientHeight;
	height -= (bottom - top);
	return ((height > 0)?height:0);
}
com.inq.ui.Container.prototype.calculateWidth = function() {
	var left = this.evaluatePosition(this.getStyle("left"));
	var right = this.evaluatePosition(this.getStyle("right"));
	var width = this._div.clientWidth;
	width -= (right - left);
	return ((width > 0)?width:0);
}
com.inq.ui.Container.prototype.clear = function() {
	var ob = this._div;
	while(ob.lastChild != null) {
		ob.removeChild(ob.lastChild);
	}
}
com.inq.ui.Container.prototype.contains = null;
com.inq.ui.Container.prototype.document = null;
com.inq.ui.Container.prototype.evaluatePosition = function(value) {
	try {
		value = StringTools.trim(value);
		if(value.charAt(0) == "{") {
			var origValue = value;
			try {
				var ix = value.lastIndexOf("}");
				if(ix == -1) throw "Curly Braces not balanced";
				value = value.substr(1,ix - 1);
				var rSym = new EReg("([a-z][a-z.0-9]*)","im");
				var sym;
				while(rSym.match(value)) {
					try {
						sym = rSym.matched(1);
					}
					catch( $e3 ) {
						{
							var e = $e3;
							{
								break;
							}
						}
					}
					var val = this.evaluateSymbolicReference(sym);
					value = rSym.matchedLeft() + val + rSym.matchedRight();
				}
				var ret = window.eval(value);
				if("Infinity" == "" + ret) throw "Divide by zero error";
				return Std["int"](Math.round(ret));
			}
			catch( $e4 ) {
				{
					var e = $e4;
					null;
				}
			}
			return 0;
		}
		else return Std.parseInt(value);
	}
	catch( $e5 ) {
		{
			var e = $e5;
			{
				haxe.Log.trace("parse error: " + e,{ fileName : "Container.hx", lineNumber : 954, className : "com.inq.ui.Container", methodName : "evaluatePosition", customParams : [e]});
			}
		}
	}
	return 0;
}
com.inq.ui.Container.prototype.evaluateSymbolicReference = function(value) {
	var a = value.split(".");
	var nameContainer = a[0];
	var c = Application.application[nameContainer];
	var iVal = 0;
	if(c != null) {
		switch(a[1]) {
		case "top":{
			iVal = c.getY();
		}break;
		case "left":{
			iVal = c.getX();
		}break;
		case "right":{
			iVal = c.getX() + c.getWidth();
		}break;
		case "bottom":{
			iVal = c.getY() + c.getHeight();
		}break;
		case "width":{
			iVal = c.getWidth();
		}break;
		case "height":{
			iVal = c.getHeight();
		}break;
		default:{
			iVal = 0;
		}break;
		}
		return "" + iVal;
	}
	return "0";
}
com.inq.ui.Container.prototype.findChild = function(childId) {
	{
		var _g1 = 0, _g = this.contains.length;
		while(_g1 < _g) {
			var i = _g1++;
			var child = this.contains[i];
			if(child && child._div) {
				if(child._div.id == childId) {
					return child;
				}
			}
		}
	}
	return null;
}
com.inq.ui.Container.prototype.fixCssClasses = function() {
	var children = this._div.getElementsByTagName("*");
	var child, i;
	{
		var _g1 = 0, _g = children.length;
		while(_g1 < _g) {
			var i1 = _g1++;
			child = children[i1];
			if(child.className == null) {
				child.className = "tcChat";
			}
			else if(child.className == "") {
				child.className = "tcChat";
			}
			else if(child.className.indexOf("tcChat") == -1) {
				child.className += " " + "tcChat";
			}
		}
	}
}
com.inq.ui.Container.prototype.getHeight = function() {
	if(this.styles["visibility"] == "collapse") return 0;
	if(this.styles.height != null) return this.evaluatePosition("" + this.styles.height);
	return Std.parseInt("" + this._div.style.height);
}
com.inq.ui.Container.prototype.getID = function() {
	return this.styles["id"];
}
com.inq.ui.Container.prototype.getIsSprite = function() {
	if(this._isSprite == null) {
		this._isSprite = !(null == this.getStyle("sprite-width") && null == this.getStyle("sprite-height") && null == this.getStyle("sprite-left") && null == this.getStyle("sprite-top"));
	}
	return this._isSprite;
}
com.inq.ui.Container.prototype.getNewImage = function() {
	var newImage = new Image();
	var doc = newImage.ownerDocument;
	var containerDoc = this._div.ownerDocument;
	if(doc != this.document) {
		try {
			if(!!(containerDoc["importNode"])) return containerDoc.importNode(newImage,false);
		}
		catch( $e6 ) {
			{
				var e = $e6;
				{
					haxe.Log.trace("New image could not be imported: " + e,{ fileName : "Container.hx", lineNumber : 1292, className : "com.inq.ui.Container", methodName : "getNewImage"});
				}
			}
		}
	}
	return newImage;
}
com.inq.ui.Container.prototype.getStyle = function(styleName) {
	return this.styles[styleName];
}
com.inq.ui.Container.prototype.getVisible = function() {
	return this._visible;
}
com.inq.ui.Container.prototype.getWidth = function() {
	if(this.styles["visibility"] == "collapse") return 0;
	if(this.styles.width != null) return this.evaluatePosition("" + this.styles.width);
	var sWidth = this._div.style.width;
	if(sWidth != null) return Std.parseInt("" + sWidth);
	return this._div.clientWidth;
}
com.inq.ui.Container.prototype.getX = function() {
	var styleLeft = this._div.style["left"];
	if(styleLeft != null) return this.evaluatePosition("" + styleLeft);
	return this._div.clientLeft;
}
com.inq.ui.Container.prototype.getY = function() {
	var styleTop = this._div.style["top"];
	if(styleTop != null) return this.evaluatePosition("" + styleTop);
	return this._div.clientTop;
}
com.inq.ui.Container.prototype.height = null;
com.inq.ui.Container.prototype.initStyle = function(styleName,styleValue) {
	this.styles[styleName] = styleValue;
}
com.inq.ui.Container.prototype.isSprite = null;
com.inq.ui.Container.prototype.loadContent = function() {
	null;
}
com.inq.ui.Container.prototype.parent = null;
com.inq.ui.Container.prototype.removeFrom = function(parentContainer) {
	if(parentContainer == null) parentContainer = this.parent;
	if(parentContainer != null) {
		var p = parentContainer._div;
		p.removeChild(this._div);
		if(parentContainer.contains == null) return;
		{
			var _g1 = 0, _g = parentContainer.contains.length;
			while(_g1 < _g) {
				var indx = _g1++;
				if(parentContainer.contains[indx] == this) {
					parentContainer.contains[indx] = null;
				}
			}
		}
		while(parentContainer.contains.length > 0 && parentContainer.contains[parentContainer.contains.length - 1] == null) {
			parentContainer.contains.pop();
		}
	}
}
com.inq.ui.Container.prototype.renderCanvas = function(canvas) {
	if(!!canvas.sourceImage) {
		var context = null;
		canvas.height = canvas.spriteHeight;
		canvas.width = canvas.spriteWidth;
		canvas.style.position = "absolute";
		var imageElement = canvas.sourceImage;
		canvas.style.top = "0px";
		canvas.style.bottom = "";
		canvas.style.left = "0px";
		canvas.style.right = "";
		canvas.style.width = "" + canvas.spriteWidth + "px";
		canvas.style.height = "" + canvas.spriteHeight + "px";
		context = canvas.getContext("2d");
		context.drawImage(imageElement,canvas.spriteLeft,canvas.spriteTop,canvas.spriteWidth,canvas.spriteHeight,0,0,canvas.spriteWidth,canvas.spriteHeight);
		var dh = canvas.spriteHeight;
		var dw = canvas.spriteWidth;
		var styleHeight = this.getStyle("height");
		if(this.getStyle("height") == null) {
			if(this.getStyle("bottom") != null && this.getStyle("top") != null) {
				var bot = "" + this.evaluatePosition(this.getStyle("bottom"));
				var top = "" + this.evaluatePosition(this.getStyle("top"));
				canvas.style.bottom = canvas.style.top = "0px";
				canvas.style.height = "100%";
				dh = this._div.clientHeight;
			}
			else {
				dh = this.calculateHeight();
			}
		}
		if(dh == 0) dh = canvas.spriteHeight;
		var styleWidth = this.getStyle("width");
		if(this.getStyle("width") == null) {
			if(this.getStyle("right") != null && this.getStyle("left") != null) {
				var rgt = "" + this.evaluatePosition(this.getStyle("right"));
				var lft = "" + this.evaluatePosition(this.getStyle("left"));
				canvas.style.right = canvas.style.left = "0px";
				canvas.style.width = "100%";
				dw = this._div.clientWidth;
			}
			else {
				dw = this.calculateWidth();
			}
		}
		if(dw == 0) dw = canvas.spriteWidth;
		context = canvas.getContext("2d");
		context.drawImage(imageElement,canvas.spriteLeft,canvas.spriteTop,canvas.spriteWidth,canvas.spriteHeight,0,0,dw,dh);
		canvas.style.width = "100%";
		canvas.style.height = "100%";
	}
	else {
		haxe.Log.trace("Canvas source image is missing",{ fileName : "Container.hx", lineNumber : 1253, className : "com.inq.ui.Container", methodName : "renderCanvas"});
	}
}
com.inq.ui.Container.prototype.resize = function() {
	this.applyStyle();
}
com.inq.ui.Container.prototype.resizer = function(cntns) {
	if(cntns == null || cntns.length == 0) return;
	var c;
	{
		var _g1 = 0, _g = cntns.length;
		while(_g1 < _g) {
			var c1 = _g1++;
			try {
				var o = cntns[c1];
				if(o == null) continue;
				o.resize();
				if(o.contains != null && o.contains.length > 0) {
					this.resizer(o.contains);
				}
			}
			catch( $e7 ) {
				if( js.Boot.__instanceof($e7,Error) ) {
					var e = $e7;
					null;
				} else throw($e7);
			}
		}
	}
}
com.inq.ui.Container.prototype.scrolling = null;
com.inq.ui.Container.prototype.setBackgroundImage = function(val) {
	haxe.Log.trace("Container.setBackgroundImage: " + val,{ fileName : "Container.hx", lineNumber : 185, className : "com.inq.ui.Container", methodName : "setBackgroundImage"});
	this.setStyle("backgroundImage",val);
	if(this.styles.backgroundImage == null || this.styles.backgroundImage == "") return;
	this._bgi = this.getNewImage();
	var doc = this._bgi.ownerDocument;
	this._newim = this._bgi;
	this._newim.onload = $closure(this,"whenLoaded");
	this._newim.className = "tcChat";
	this._newim.src = this.styles.backgroundImage;
}
com.inq.ui.Container.prototype.setFocus = function() {
	try {
		this._div.focus();
	}
	catch( $e8 ) {
		if( js.Boot.__instanceof($e8,Error) ) {
			var e = $e8;
			null;
		} else throw($e8);
	}
}
com.inq.ui.Container.prototype.setHeight = function(val) {
	this.styles.height = val;
}
com.inq.ui.Container.prototype.setID = function(val) {
	this._div.id = (((this._div.ownerDocument != null && this._div.ownerDocument == window.document) || !com.inq.ui.SkinLoader.hasClientBody)?val:(((val.indexOf("tcChat_") == 0 || val.indexOf("inq") == 0)?val:"tcChat_" + val)));
	this.styles.id = val;
}
com.inq.ui.Container.prototype.setScrolling = function(val) {
	null;
}
com.inq.ui.Container.prototype.setSrc = function(val) {
	null;
}
com.inq.ui.Container.prototype.setStyle = function(styleName,styleValue) {
	this.styles[styleName] = styleValue;
	if(this.parent == null) return;
	this.resize();
	this.resizer(this.contains);
}
com.inq.ui.Container.prototype.setVisible = function(val) {
	try {
		this._visible = !("false" == val || null == val || false == val);
		var _isPersistent = (window.parent.name == "_inqPersistentChat");
		if((this._div.id == "inqDivResizeCorner" || this._div.id == "inqTitleBar") && _isPersistent) {
			this._visible = false;
			this._div.style.cssText = "display: none;";
			return;
		}
		this.styles.visible = ((this._visible)?"true":"false");
		if(this.parent == null && this._div != null) {
			this._div.style.display = ((this._visible)?"":"none");
			return;
		}
		this.resize();
		this.resizer(this.contains);
	}
	catch( $e9 ) {
		{
			var e = $e9;
			null;
		}
	}
}
com.inq.ui.Container.prototype.setWidth = function(val) {
	this.styles.width = "" + val;
}
com.inq.ui.Container.prototype.setX = function(val) {
	this.setStyle("left","" + val);
	if(this.parent == null) return;
	this.resize();
	this.resizer(this.contains);
}
com.inq.ui.Container.prototype.setY = function(val) {
	this.setStyle("top","" + val);
	this.resize();
	this.resizer(this.contains);
}
com.inq.ui.Container.prototype.src = null;
com.inq.ui.Container.prototype.styles = null;
com.inq.ui.Container.prototype.updateSrc = function(val) {
	null;
}
com.inq.ui.Container.prototype.visible = null;
com.inq.ui.Container.prototype.whenLoaded = function(ev) {
	var __w, __h;
	try {
		var win = js.Lib.window;
		var element = this._newim;
		var imageElement = this._newim;
		var picture = imageElement;
		var spriteWidth = 0, spriteHeight = 0, spriteLeft = 0, spriteTop = 0;
		var _spriteLoadHeight = 0, _spriteLoadWidth = 0;
		var div = this._div;
		var canvas = null;
		var myDoc = imageElement.ownerDocument;
		if(myDoc != this.document) {
			myDoc = this._div.ownerDocument;
			haxe.Log.trace("Document object error, correcting",{ fileName : "Container.hx", lineNumber : 220, className : "com.inq.ui.Container", methodName : "whenLoaded"});
		}
		if(this.getIsSprite()) {
			spriteWidth = this.evaluatePosition(this.getStyle("sprite-width"));
			spriteHeight = this.evaluatePosition(this.getStyle("sprite-height"));
			spriteLeft = this.evaluatePosition(this.getStyle("sprite-left"));
			spriteTop = this.evaluatePosition(this.getStyle("sprite-top"));
			canvas = myDoc.createElement("CANVAS");
			canvas.width = spriteWidth;
			canvas.height = spriteHeight;
			imageElement.width = spriteWidth;
			imageElement.height = spriteHeight;
			picture = canvas;
		}
		this._loadWidth = imageElement.width;
		this._loadHeight = imageElement.height;
		imageElement.style.height = this._loadHeight + "px";
		imageElement.style.width = this._loadWidth + "px";
		if((this.getStyle("height") == null) && ((this.getStyle("top") == null) || (this.getStyle("bottom") == null))) {
			this.initStyle("height","" + this._loadHeight);
			picture.style.height = this._loadHeight + "px";
		}
		else if(this.getStyle("height") != null) {
			picture.style.height = this.evaluatePosition(this.getStyle("height")) + "px";
		}
		if((this.getStyle("width") == null) && ((this.getStyle("left") == null) || (this.getStyle("right") == null))) {
			this.initStyle("width","" + this._loadWidth);
			picture.style.width = this._loadWidth + "px";
		}
		else if(this.getStyle("width") != null) {
			picture.style.width = this.evaluatePosition(this.getStyle("width")) + "px";
		}
		if(div.firstChild != null && div.firstChild.tagName == "IMAGE") div.removeChild(div.firstChild);
		try {
			div.insertBefore(element,div.firstChild);
		}
		catch( $e10 ) {
			if( js.Boot.__instanceof($e10,Error) ) {
				var e = $e10;
				{
					div.innerHTML = "<IMG style=\"width:100%;height:100%\"  src=\"" + imageElement.src + "\">";
				}
			} else throw($e10);
		}
		if(this.getIsSprite()) {
			canvas.style.cssText = imageElement.style.cssText;
			canvas.id = imageElement.parentNode.id + "_canvas";
			canvas["sourceImage"] = imageElement;
			canvas["spriteTop"] = spriteTop;
			canvas["spriteLeft"] = spriteLeft;
			canvas["spriteWidth"] = spriteWidth;
			canvas["spriteHeight"] = spriteHeight;
			imageElement.parentNode.insertBefore(canvas,imageElement.nextSibling);
			imageElement.style.display = "none";
			this.renderCanvas(canvas);
		}
		this.resize();
	}
	catch( $e11 ) {
		{
			var e = $e11;
			{
				haxe.Log.trace("ERROR: " + e,{ fileName : "Container.hx", lineNumber : 308, className : "com.inq.ui.Container", methodName : "whenLoaded"});
			}
		}
	}
}
com.inq.ui.Container.prototype.width = null;
com.inq.ui.Container.prototype.x = null;
com.inq.ui.Container.prototype.y = null;
com.inq.ui.Container.prototype.__class__ = com.inq.ui.Container;
com.inq.flash.client.control = {}
com.inq.flash.client.control.FlashPeer = function(p) { if( p === $_ ) return; {
	null;
}}
com.inq.flash.client.control.FlashPeer.__name__ = ["com","inq","flash","client","control","FlashPeer"];
com.inq.flash.client.control.FlashPeer.call = function(funcName,args,deflt) {
	if(com.inq.flash.client.control.FlashPeer.inqFlashPeer[funcName] == null) {
		haxe.Log.trace("window.Inq.FlashPeer." + funcName + " does not exist",{ fileName : "FlashPeer.hx", lineNumber : 25, className : "com.inq.flash.client.control.FlashPeer", methodName : "call"});
		return deflt;
	}
	try {
		return (com.inq.flash.client.control.FlashPeer.inqFlashPeer[funcName]).apply(com.inq.flash.client.control.FlashPeer.inqFlashPeer,args);
	}
	catch( $e12 ) {
		{
			var e = $e12;
			{
				var argz = "";
				{
					var _g1 = 0, _g = args.length;
					while(_g1 < _g) {
						var i = _g1++;
						argz += " arg[" + i + "] = " + args[i] + "\n";
					}
				}
				haxe.Log.trace("window.Inq.FlashPeer." + funcName + " failed: " + e + "\n" + argz,{ fileName : "FlashPeer.hx", lineNumber : 35, className : "com.inq.flash.client.control.FlashPeer", methodName : "call"});
				return deflt;
			}
		}
	}
}
com.inq.flash.client.control.FlashPeer.onAgentMsg = function(object) {
	com.inq.flash.client.control.FlashPeer.call("onAgentMsg",arguments);
}
com.inq.flash.client.control.FlashPeer.onCustomerMsg = function(object) {
	com.inq.flash.client.control.FlashPeer.call("onCustomerMsg",arguments);
}
com.inq.flash.client.control.FlashPeer.onAssisted = function(object) {
	com.inq.flash.client.control.FlashPeer.call("onAssisted",arguments);
}
com.inq.flash.client.control.FlashPeer.onInteracted = function(object) {
	com.inq.flash.client.control.FlashPeer.call("onInteracted",arguments);
}
com.inq.flash.client.control.FlashPeer.onEngaged = function(object) {
	com.inq.flash.client.control.FlashPeer.call("onEngaged",arguments);
}
com.inq.flash.client.control.FlashPeer.setDragable = function() {
	com.inq.flash.client.control.FlashPeer.call("setDragable",arguments);
}
com.inq.flash.client.control.FlashPeer.setResizable = function() {
	com.inq.flash.client.control.FlashPeer.call("setResizable",arguments);
}
com.inq.flash.client.control.FlashPeer.setV3Data = function(dictionary) {
	com.inq.flash.client.control.FlashPeer.call("setV3Data",arguments);
}
com.inq.flash.client.control.FlashPeer.getV3Data = function() {
	return com.inq.flash.client.control.FlashPeer.call("getV3Data",arguments);
}
com.inq.flash.client.control.FlashPeer.setSurveyAuxParams = function(dictionary) {
	com.inq.flash.client.control.FlashPeer.call("setSurveyAuxParams",arguments);
}
com.inq.flash.client.control.FlashPeer.getSurveyAuxParams = function() {
	return com.inq.flash.client.control.FlashPeer.call("getSurveyAuxParams",arguments);
}
com.inq.flash.client.control.FlashPeer.setClickStreamSent = function(isSent) {
	com.inq.flash.client.control.FlashPeer.call("setClickStreamSent",arguments);
}
com.inq.flash.client.control.FlashPeer.isClickStreamSent = function() {
	return com.inq.flash.client.control.FlashPeer.call("isClickStreamSent",arguments);
}
com.inq.flash.client.control.FlashPeer.requestTranscript = function(emailAddress) {
	com.inq.flash.client.control.FlashPeer.call("requestTranscript",arguments);
}
com.inq.flash.client.control.FlashPeer.popOutChat = function(b,bResizable) {
	return com.inq.flash.client.control.FlashPeer.call("popOutChat",arguments);
}
com.inq.flash.client.control.FlashPeer.getBaseURL = function() {
	return com.inq.flash.client.control.FlashPeer.call("getBaseURL",arguments);
}
com.inq.flash.client.control.FlashPeer.getMediaBaseURL = function() {
	return com.inq.flash.client.control.FlashPeer.call("getMediaBaseURL",arguments);
}
com.inq.flash.client.control.FlashPeer.getVanityUrl = function() {
	return com.inq.flash.client.control.FlashPeer.call("getVanityUrl",arguments);
}
com.inq.flash.client.control.FlashPeer.getChatRouterVanityUrl = function() {
	return com.inq.flash.client.control.FlashPeer.call("getChatRouterVanityUrl",arguments);
}
com.inq.flash.client.control.FlashPeer.getTitleBarHeight = function() {
	return com.inq.flash.client.control.FlashPeer.call("getTitleBarHeight",arguments);
}
com.inq.flash.client.control.FlashPeer.getPopupCloserWidth = function() {
	return com.inq.flash.client.control.FlashPeer.call("getPopupCloserWidth",arguments);
}
com.inq.flash.client.control.FlashPeer.getSkinLocation = function() {
	return com.inq.flash.client.control.FlashPeer.call("getSkinLocation",arguments);
}
com.inq.flash.client.control.FlashPeer.getSkinHeight = function() {
	return com.inq.flash.client.control.FlashPeer.call("getSkinHeight",arguments);
}
com.inq.flash.client.control.FlashPeer.getSkinWidth = function() {
	return com.inq.flash.client.control.FlashPeer.call("getSkinWidth",arguments);
}
com.inq.flash.client.control.FlashPeer.getSkinLeft = function() {
	return com.inq.flash.client.control.FlashPeer.call("getSkinLeft",arguments);
}
com.inq.flash.client.control.FlashPeer.getSkinTop = function() {
	return com.inq.flash.client.control.FlashPeer.call("getSkinTop",arguments);
}
com.inq.flash.client.control.FlashPeer.getFlashVars = function() {
	return com.inq.flash.client.control.FlashPeer.call("getFlashVars",arguments);
}
com.inq.flash.client.control.FlashPeer.getSkin = function() {
	return com.inq.flash.client.control.FlashPeer.call("getSkin",arguments);
}
com.inq.flash.client.control.FlashPeer.getV3TimeOut = function() {
	return com.inq.flash.client.control.FlashPeer.call("getV3TimeOut",arguments);
}
com.inq.flash.client.control.FlashPeer.setSessionParam = function(key,val) {
	return com.inq.flash.client.control.FlashPeer.call("setSessionParam",arguments);
}
com.inq.flash.client.control.FlashPeer.closePersistent = function() {
	return com.inq.flash.client.control.FlashPeer.call("closePersistent",arguments);
}
com.inq.flash.client.control.FlashPeer.isThankYouEnabled = function() {
	return com.inq.flash.client.control.FlashPeer.call("isThankYouEnabled",arguments);
}
com.inq.flash.client.control.FlashPeer.setAgentID = function(agentID) {
	com.inq.flash.client.control.FlashPeer.call("setAgentID",arguments);
}
com.inq.flash.client.control.FlashPeer.setPersistentWindowActive = function(b) {
	com.inq.flash.client.control.FlashPeer.call("setPersistentWindowActive",arguments);
}
com.inq.flash.client.control.FlashPeer.isV3C2CPersistent = function() {
	return com.inq.flash.client.control.FlashPeer.call("isV3C2CPersistent",arguments);
}
com.inq.flash.client.control.FlashPeer.blockService = function(blockDetails) {
	com.inq.flash.client.control.FlashPeer.call("blockTheService",arguments);
}
com.inq.flash.client.control.FlashPeer.executeCustomCommand = function(commandParam) {
	com.inq.flash.client.control.FlashPeer.call("executeCustomCommand",arguments);
}
com.inq.flash.client.control.FlashPeer.PushToFrameset = function(_sUrl,_sTarget,_fromClick) {
	if(_fromClick == null) _fromClick = false;
	com.inq.flash.client.control.FlashPeer.call("PushToFrameset",arguments);
}
com.inq.flash.client.control.FlashPeer.wasSaleAction = function() {
	return com.inq.flash.client.control.FlashPeer.call("wasSaleAction",arguments,false);
}
com.inq.flash.client.control.FlashPeer.registerPersistentWindow = function() {
	return com.inq.flash.client.control.FlashPeer.call("registerPersistentWindow",arguments,false);
}
com.inq.flash.client.control.FlashPeer.acceptCobInv = function() {
	com.inq.flash.client.control.FlashPeer.call("acceptCob",arguments);
}
com.inq.flash.client.control.FlashPeer.acceptCobAndShareInv = function() {
	com.inq.flash.client.control.FlashPeer.call("acceptCobAndShare",arguments);
}
com.inq.flash.client.control.FlashPeer.acceptCobShareInv = function() {
	com.inq.flash.client.control.FlashPeer.call("acceptCobShare",arguments);
}
com.inq.flash.client.control.FlashPeer.endCob = function() {
	com.inq.flash.client.control.FlashPeer.call("endCob",arguments);
}
com.inq.flash.client.control.FlashPeer.isCobrowseEnded = function() {
	return com.inq.flash.client.control.FlashPeer.call("isCobEnded",arguments,false);
}
com.inq.flash.client.control.FlashPeer.isCobrowseEnagaged = function() {
	return com.inq.flash.client.control.FlashPeer.call("isCobEngaged",arguments,false);
}
com.inq.flash.client.control.FlashPeer.isCobrowseSharedControl = function() {
	return com.inq.flash.client.control.FlashPeer.call("isCobShared",arguments,false);
}
com.inq.flash.client.control.FlashPeer.setCobrowseBannerText = function(text) {
	com.inq.flash.client.control.FlashPeer.call("setCobBan",arguments);
}
com.inq.flash.client.control.FlashPeer.isLoggingDisabled = function() {
	return com.inq.flash.client.control.FlashPeer.call("isLoggingDisabled",arguments,false);
}
com.inq.flash.client.control.FlashPeer.fireCustomEvent = function(eventName,evtDataSupplementFcn) {
	com.inq.flash.client.control.FlashPeer.call("fireCustomEvent",arguments);
}
com.inq.flash.client.control.FlashPeer.fireCustomEvt = function(eventName,jsonData,dataFcn) {
	com.inq.flash.client.control.FlashPeer.call("fireCustomEvt",arguments);
}
com.inq.flash.client.control.FlashPeer.createXFrame = function(divId,url,businessUnitID,scrolling,data) {
	return com.inq.flash.client.control.FlashPeer.call("createXFrame",arguments,null);
}
com.inq.flash.client.control.FlashPeer.getClientPageURL = function() {
	return com.inq.flash.client.control.FlashPeer.call("getClientPageURL",arguments);
}
com.inq.flash.client.control.FlashPeer.parseXFrameUrl = function(url) {
	return com.inq.flash.client.control.FlashPeer.call("parseXFrameUrl",arguments,null);
}
com.inq.flash.client.control.FlashPeer.isRefreshRequired = function() {
	return !!com.inq.flash.client.control.FlashPeer.call("isRefreshRequired",arguments,false);
}
com.inq.flash.client.control.FlashPeer.resetRefreshFlag = function() {
	com.inq.flash.client.control.FlashPeer.call("resetRefreshFlag",arguments);
}
com.inq.flash.client.control.FlashPeer.getPageID = function() {
	return com.inq.flash.client.control.FlashPeer.call("getPageID",arguments,null);
}
com.inq.flash.client.control.FlashPeer.isPortal = function() {
	return com.inq.flash.client.control.FlashPeer.call("isPortal",arguments,false);
}
com.inq.flash.client.control.FlashPeer.getCustID = function() {
	return com.inq.flash.client.control.FlashPeer.call("getCustID",arguments,null);
}
com.inq.flash.client.control.FlashPeer.getSessionID = function() {
	return com.inq.flash.client.control.FlashPeer.call("getSessionID",arguments,null);
}
com.inq.flash.client.control.FlashPeer.getIncAssignmentID = function() {
	return com.inq.flash.client.control.FlashPeer.call("getIncAssignmentID",arguments,null);
}
com.inq.flash.client.control.FlashPeer.getPageMarker = function() {
	return com.inq.flash.client.control.FlashPeer.call("getPageMarker",arguments,null);
}
com.inq.flash.client.control.FlashPeer.getAutomatonDataMap = function() {
	return com.inq.flash.client.control.FlashPeer.call("getAutomatonDataMap",arguments,null);
}
com.inq.flash.client.control.FlashPeer.getBrID = function() {
	return com.inq.flash.client.control.FlashPeer.call("getBrID",arguments,null);
}
com.inq.flash.client.control.FlashPeer.getBrName = function() {
	return com.inq.flash.client.control.FlashPeer.call("getBrName",arguments,null);
}
com.inq.flash.client.control.FlashPeer.getAgentID = function() {
	return com.inq.flash.client.control.FlashPeer.call("getAgentID",arguments,null);
}
com.inq.flash.client.control.FlashPeer.getBusinessUnitID = function() {
	return com.inq.flash.client.control.FlashPeer.call("getBusinessUnitID",arguments,null);
}
com.inq.flash.client.control.FlashPeer.onCookiesCommitted = function(handler) {
	com.inq.flash.client.control.FlashPeer.call("onCookiesCommitted",arguments);
}
com.inq.flash.client.control.FlashPeer.getXFormsDomain = function() {
	return com.inq.flash.client.control.FlashPeer.call("getXFormsDomain",arguments,null);
}
com.inq.flash.client.control.FlashPeer.getDeviceType = function() {
	return com.inq.flash.client.control.FlashPeer.call("getDeviceType",arguments,null);
}
com.inq.flash.client.control.FlashPeer.closePersistentWindowIfOpen = function() {
	return com.inq.flash.client.control.FlashPeer.call("closePersistentWindowIfOpen",arguments,null);
}
com.inq.flash.client.control.FlashPeer.getBuRuleAgentGroupID = function(brID) {
	if(window.Inq.FlashPeer["getBuRuleAgentGroupID"] != null) {
		return window.Inq.FlashPeer.getBuRuleAgentGroupID(brID);
	}
	else {
		haxe.Log.trace("getBuRuleAgentGroupID is not defined",{ fileName : "FlashPeer.hx", lineNumber : 442, className : "com.inq.flash.client.control.FlashPeer", methodName : "getBuRuleAgentGroupID", customParams : ["warning"]});
		return null;
	}
}
com.inq.flash.client.control.FlashPeer.prototype.__class__ = com.inq.flash.client.control.FlashPeer;
haxe = {}
haxe.Log = function() { }
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
}
haxe.Log.clear = function() {
	js.Boot.__clear_trace();
}
haxe.Log.prototype.__class__ = haxe.Log;
js = {}
js.Boot = function() { }
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = (i != null?i.fileName + ":" + i.lineNumber + ": ":"");
	msg += js.Boot.__unhtml(js.Boot.__string_rec(v,"")) + "<br/>";
	var d = document.getElementById("haxe:trace");
	if(d == null) alert("No haxe:trace element defined\n" + msg);
	else d.innerHTML += msg;
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
	else null;
}
js.Boot.__closure = function(o,f) {
	var m = o[f];
	if(m == null) return null;
	var f1 = function() {
		return m.apply(o,arguments);
	}
	f1.scope = o;
	f1.method = m;
	return f1;
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ != null || o.__ename__ != null)) t = "object";
	switch(t) {
	case "object":{
		if(o instanceof Array) {
			if(o.__enum__ != null) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				{
					var _g1 = 2, _g = o.length;
					while(_g1 < _g) {
						var i = _g1++;
						if(i != 2) str += "," + js.Boot.__string_rec(o[i],s);
						else str += js.Boot.__string_rec(o[i],s);
					}
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			{
				var _g = 0;
				while(_g < l) {
					var i1 = _g++;
					str += ((i1 > 0?",":"")) + js.Boot.__string_rec(o[i1],s);
				}
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		}
		catch( $e13 ) {
			{
				var e = $e13;
				{
					return "???";
				}
			}
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = (o.hasOwnProperty != null);
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) continue;
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__") continue;
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	}break;
	case "function":{
		return "<function>";
	}break;
	case "string":{
		return o;
	}break;
	default:{
		return String(o);
	}break;
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	try {
		if(o instanceof cl) {
			if(cl == Array) return (o.__enum__ == null);
			return true;
		}
		if(js.Boot.__interfLoop(o.__class__,cl)) return true;
	}
	catch( $e14 ) {
		{
			var e = $e14;
			{
				if(cl == null) return false;
			}
		}
	}
	switch(cl) {
	case Int:{
		return Math.ceil(o%2147483648.0) === o;
	}break;
	case Float:{
		return typeof(o) == "number";
	}break;
	case Bool:{
		return o === true || o === false;
	}break;
	case String:{
		return typeof(o) == "string";
	}break;
	case Dynamic:{
		return true;
	}break;
	default:{
		if(o == null) return false;
		return o.__enum__ == cl || (cl == Class && o.__name__ != null) || (cl == Enum && o.__ename__ != null);
	}break;
	}
}
js.Boot.__init = function() {
	js.Lib.isIE = (document.all != null && window.opera == null);
	js.Lib.isOpera = (window.opera != null);
	Array.prototype.copy = Array.prototype.slice;
	Array.prototype.insert = function(i,x) {
		this.splice(i,0,x);
	}
	Array.prototype.remove = (Array.prototype.indexOf?function(obj) {
		var idx = this.indexOf(obj);
		if(idx == -1) return false;
		this.splice(idx,1);
		return true;
	}:function(obj) {
		var i = 0;
		var l = this.length;
		while(i < l) {
			if(this[i] == obj) {
				this.splice(i,1);
				return true;
			}
			i++;
		}
		return false;
	});
	Array.prototype.iterator = function() {
		return { cur : 0, arr : this, hasNext : function() {
			return this.cur < this.arr.length;
		}, next : function() {
			return this.arr[this.cur++];
		}}
	}
	var cca = String.prototype.charCodeAt;
	String.prototype.cca = cca;
	String.prototype.charCodeAt = function(i) {
		var x = cca.call(this,i);
		if(isNaN(x)) return null;
		return x;
	}
	var oldsub = String.prototype.substr;
	String.prototype.substr = function(pos,len) {
		if(pos != null && pos != 0 && len != null && len < 0) return "";
		if(len == null) len = this.length;
		if(pos < 0) {
			pos = this.length + pos;
			if(pos < 0) pos = 0;
		}
		else if(len < 0) {
			len = this.length + len - pos;
		}
		return oldsub.apply(this,[pos,len]);
	}
	$closure = js.Boot.__closure;
}
js.Boot.prototype.__class__ = js.Boot;
com.inq.ui.SkinLoader = function(p) { if( p === $_ ) return; {
	com.inq.ui.Container.apply(this,[]);
}}
com.inq.ui.SkinLoader.__name__ = ["com","inq","ui","SkinLoader"];
com.inq.ui.SkinLoader.__super__ = com.inq.ui.Container;
for(var k in com.inq.ui.Container.prototype ) com.inq.ui.SkinLoader.prototype[k] = com.inq.ui.Container.prototype[k];
com.inq.ui.SkinLoader.hasClientBody = null;
com.inq.ui.SkinLoader.skinInClient = null;
com.inq.ui.SkinLoader._preloadImage = function(imageName) {
	var obj = com.inq.ui.SkinLoader.imageCollection[imageName];
	if(obj == null) {
		obj = { path : imageName, image : null, width : -1, height : -1}
		com.inq.ui.SkinLoader.imageCollection[imageName] = obj;
		haxe.Log.trace("preload image " + imageName,{ fileName : "SkinLoader.hx", lineNumber : 654, className : "com.inq.ui.SkinLoader", methodName : "_preloadImage"});
	}
}
com.inq.ui.SkinLoader._getSkinPath = function() {
	var skin = com.inq.flash.client.control.FlashPeer.getSkin();
	var baseURL = com.inq.flash.client.control.FlashPeer.getBaseURL();
	var mediaURL = com.inq.flash.client.control.FlashPeer.getMediaBaseURL();
	skin = skin.split(baseURL).join(mediaURL);
	var aPath = skin.split("\\").join("/").split("/");
	aPath.pop();
	return (com.inq.ui.SkinLoader._skinpath = aPath.join("/"));
}
com.inq.ui.SkinLoader.getSkinBase = function() {
	var skin = com.inq.flash.client.control.FlashPeer.getSkin();
	var aPath = skin.split("\\").join("/").split("/");
	aPath.pop();
	return (aPath.join("/"));
}
com.inq.ui.SkinLoader.GetSkinPath = function() {
	return com.inq.ui.SkinLoader._skinpath;
}
com.inq.ui.SkinLoader.PreloadNewSkin = function(nameNextSkin) {
	var sl = new com.inq.ui.SkinLoader();
	sl.loadSkin("./" + nameNextSkin);
}
com.inq.ui.SkinLoader.LoadNewSkin = function(nameNextSkin) {
	var sl = new com.inq.ui.SkinLoader();
	var ti = Application.application.txtInput;
	var cPB = Application.application.ClickPersistent;
	var bPO = Application.application["btnPopOut"];
	var bCa = Application.application["btnCall"];
	var bCC = Application.application["btnCloseChat"];
	com.inq.ui.SkinLoader.contextArray[0] = nameNextSkin;
	com.inq.ui.SkinLoader.contextArray[1] = com.inq.flash.client.chatskins.SkinControl.cw.exportData();
	com.inq.ui.SkinLoader.contextArray[2] = ti._getInput();
	com.inq.ui.SkinLoader.contextArray[3] = cPB.getVisible();
	com.inq.ui.SkinLoader.contextArray[4] = ((null != bPO)?bPO.getVisible():false);
	com.inq.ui.SkinLoader.contextArray[5] = ((null != bCa)?bCa.getVisible():false);
	com.inq.ui.SkinLoader.contextArray[6] = ((null != bCC)?bCC.getVisible():false);
	sl.addEventListener(com.inq.events.IOErrorEvent.IO_ERROR,$closure(com.inq.ui.SkinLoader,"failedNewSkinLoad"));
	sl.addEventListener(com.inq.events.Event.COMPLETE,$closure(com.inq.ui.SkinLoader,"successNewSkinLoad"));
	sl.drawSkin("./" + nameNextSkin);
}
com.inq.ui.SkinLoader.failedNewSkinLoad = function(event) {
	haxe.Log.trace("failed",{ fileName : "SkinLoader.hx", lineNumber : 859, className : "com.inq.ui.SkinLoader", methodName : "failedNewSkinLoad"});
}
com.inq.ui.SkinLoader.successNewSkinLoad = function(event) {
	haxe.Log.trace("success",{ fileName : "SkinLoader.hx", lineNumber : 863, className : "com.inq.ui.SkinLoader", methodName : "successNewSkinLoad"});
	com.inq.flash.client.chatskins.SkinControl.cw = new com.inq.flash.client.chatskins.ChatTextArea(Application.application.chatWindow);
	Application.application.resize();
	com.inq.flash.client.chatskins.SkinControl.setFocusOnInputField();
	com.inq.flash.client.chatskins.SkinControl.startMouseListener();
	com.inq.flash.client.chatskins.SkinControl.startFocusListener();
	com.inq.flash.client.chatskins.SkinControl.setupButtons();
	com.inq.flash.client.chatskins.SkinControl.startKeyListener();
	com.inq.flash.client.chatskins.SkinControl.setUpFocusAndSelection();
	var ti = Application.application.txtInput;
	var cPB = Application.application.ClickPersistent;
	var bPO = Application.application["btnPopOut"];
	var bCa = Application.application["btnCall"];
	var bCC = Application.application["btnCloseChat"];
	com.inq.flash.client.control.PersistenceManager.SetValue("skn",com.inq.ui.SkinLoader.contextArray[0]);
	com.inq.flash.client.chatskins.SkinControl.cw.importData(com.inq.ui.SkinLoader.contextArray[1]);
	ti._setInput(com.inq.ui.SkinLoader.contextArray[2]);
	com.inq.flash.client.chatskins.SkinControl.showPersistentChatButtons(com.inq.ui.SkinLoader.contextArray[3]);
	if(null != bPO) bPO.setVisible(com.inq.ui.SkinLoader.contextArray[4]);
	if(null != bCa) bCa.setVisible(com.inq.ui.SkinLoader.contextArray[5]);
	if(null != bCC) bCC.setVisible(com.inq.ui.SkinLoader.contextArray[6]);
	com.inq.flash.client.chatskins.SkinControl.ClassInits();
}
com.inq.ui.SkinLoader.prototype._draw = function(mxml) {
	var xml;
	var me = new com.inq.ui.Container("Skin");
	if(me._div == null) {
		me = new com.inq.ui.Container();
	}
	else {
		me.clear();
	}
	if(mxml == null) xml = Xml.parse(haxe.Resource.getString("mxml"));
	else xml = Xml.parse(mxml);
	haxe.Log.trace("Ask if skin is in client",{ fileName : "SkinLoader.hx", lineNumber : 321, className : "com.inq.ui.SkinLoader", methodName : "_draw"});
	com.inq.ui.SkinLoader.hasClientBody = this.testClientBody(xml);
	com.inq.ui.SkinLoader.skinInClient = this.testSkinInClient(xml);
	if(com.inq.ui.SkinLoader.skinInClient) {
		haxe.Log.trace("skin is in the client",{ fileName : "SkinLoader.hx", lineNumber : 325, className : "com.inq.ui.SkinLoader", methodName : "_draw"});
		Application.application.clear();
		var div = Application.application._div;
		var doc = window.parent.document;
		var loc = window.frameElement;
		haxe.Log.trace("remove element",{ fileName : "SkinLoader.hx", lineNumber : 332, className : "com.inq.ui.SkinLoader", methodName : "_draw"});
		if(null != div.parentElement) div.parentElement.removeElement(div);
		if(div.ownerDocument != doc) {
			try {
				if(doc.adoptNode) {
					haxe.Log.trace("Adopt the node into the new document",{ fileName : "SkinLoader.hx", lineNumber : 339, className : "com.inq.ui.SkinLoader", methodName : "_draw"});
					doc.adoptNode(div);
					haxe.Log.trace("Node has been adopted into new document",{ fileName : "SkinLoader.hx", lineNumber : 341, className : "com.inq.ui.SkinLoader", methodName : "_draw"});
				}
				else {
					haxe.Log.trace("adoptNode not implemented on this browser create new div",{ fileName : "SkinLoader.hx", lineNumber : 343, className : "com.inq.ui.SkinLoader", methodName : "_draw"});
					div = doc.createElement("DIV");
				}
			}
			catch( $e15 ) {
				{
					var e = $e15;
					{
						haxe.Log.trace("Document could not adopt element",{ fileName : "SkinLoader.hx", lineNumber : 347, className : "com.inq.ui.SkinLoader", methodName : "_draw", customParams : [e]});
					}
				}
			}
		}
		else {
			haxe.Log.trace("document has correct owner",{ fileName : "SkinLoader.hx", lineNumber : 350, className : "com.inq.ui.SkinLoader", methodName : "_draw"});
		}
		div.name = "Stage";
		div.style.zIndex = loc.style.zIndex;
		haxe.Log.trace("insert element as next sibling",{ fileName : "SkinLoader.hx", lineNumber : 355, className : "com.inq.ui.SkinLoader", methodName : "_draw"});
		loc.parentElement.insertBefore(div,loc.nextSibling);
		Application.application._div = div;
		haxe.Log.trace("skin has been moved to the client",{ fileName : "SkinLoader.hx", lineNumber : 358, className : "com.inq.ui.SkinLoader", methodName : "_draw"});
	}
	var c;
	Application.application.initStyle("id","Skin");
	Application.application.clear();
	Application.application.setID("Skin");
	this.applyAttributes(xml.firstElement(),Application.application);
	var allScripts = window.document.getElementsByTagName("script");
	var pDoc = window.frameElement.ownerDocument;
	if(window.frameElement) Application.application.attachToElement(window.document.body);
	var it = xml.elements();
	{ var $it16 = it;
	while( $it16.hasNext() ) { var x = $it16.next();
	{
		var name = x.getNodeName();
		this._renderMxml(x.elements(),Application.application);
	}
	}}
	this.applyStyle();
}
com.inq.ui.SkinLoader.prototype._failedSkinLoad = function(e) {
	haxe.Log.trace("skin load failed",{ fileName : "SkinLoader.hx", lineNumber : 87, className : "com.inq.ui.SkinLoader", methodName : "_failedSkinLoad"});
	this.dispatchEvent(e);
	return;
}
com.inq.ui.SkinLoader.prototype._loaderSkin = null;
com.inq.ui.SkinLoader.prototype._preloadAttributeImages = function(xmlNode) {
	{ var $it17 = xmlNode.attributes();
	while( $it17.hasNext() ) { var ats = $it17.next();
	{
		var attName = ats;
		var attValu = xmlNode.get(attName);
		switch(attName) {
		case "upSkin":case "overSkin":case "source":case "backgroundImage":{
			com.inq.ui.SkinLoader._preloadImage(this.unembed(attValu));
		}break;
		default:{
			null;
		}break;
		}
	}
	}}
}
com.inq.ui.SkinLoader.prototype._preloadImages = function(it) {
	var name;
	var xmlNode;
	haxe.Log.trace("_preloadImages",{ fileName : "SkinLoader.hx", lineNumber : 729, className : "com.inq.ui.SkinLoader", methodName : "_preloadImages"});
	{ var $it18 = it;
	while( $it18.hasNext() ) { var el = $it18.next();
	{
		xmlNode = el;
		name = el.getNodeName();
		haxe.Log.trace("node name is " + name,{ fileName : "SkinLoader.hx", lineNumber : 735, className : "com.inq.ui.SkinLoader", methodName : "_preloadImages"});
		switch(name) {
		case "mx:Style":{
			null;
		}break;
		case "mx:Canvas":case "mx:Application":{
			this._preloadAttributeImages(xmlNode);
			var newit = xmlNode.elements();
			this._preloadImages(newit);
		}break;
		case "mx:Button":{
			this._preloadAttributeImages(xmlNode);
			{ var $it19 = xmlNode.elementsNamed("mx:upSkin");
			while( $it19.hasNext() ) { var itm = $it19.next();
			{
				var xmlsrc = itm;
				var source = this.unembed("" + xmlsrc.firstChild());
				com.inq.ui.SkinLoader._preloadImage(source);
			}
			}}
		}break;
		case "mx:Image":{
			this._preloadAttributeImages(xmlNode);
			{ var $it20 = xmlNode.elementsNamed("mx:source");
			while( $it20.hasNext() ) { var itm = $it20.next();
			{
				var xmlsrc = itm;
				var source = this.unembed("" + xmlsrc.firstChild());
				com.inq.ui.SkinLoader._preloadImage(source);
			}
			}}
		}break;
		case "mx:Label":case "mx:TextInput":case "mx:LineInput":case "mx:TextArea":{
			this._preloadAttributeImages(xmlNode);
		}break;
		case "mx:Script":{
			null;
		}break;
		}
	}
	}}
}
com.inq.ui.SkinLoader.prototype._renderMxml = function(it,parentObject) {
	var name;
	var id;
	{ var $it21 = it;
	while( $it21.hasNext() ) { var el = $it21.next();
	{
		name = el.getNodeName();
		id = el.get("id");
		if(id == null) {
			id = "tcChat_" + Math.round(Math.random() * Math.PI * 7654321);
		}
		if(name.indexOf("html:") == 0) {
			var xmlNode = el;
			var canvas = new com.inq.ui.Html(name,id,parentObject);
			this.applyAttributes(xmlNode,canvas);
			canvas.attachTo(parentObject);
			if(id != "inqTitleBar" && id != "inqDivResizeCorner" && id != "tcChat_Skin") Application.application[canvas.styles.id] = canvas;
			else haxe.Log.trace("special case: " + id,{ fileName : "SkinLoader.hx", lineNumber : 417, className : "com.inq.ui.SkinLoader", methodName : "_renderMxml"});
			var newit = xmlNode.elements();
			if(!newit.hasNext() && xmlNode.firstChild() != null) {
				var innerHTML = xmlNode.firstChild().getNodeValue();
				if(innerHTML != null && innerHTML != "") {
					canvas._div.innerHTML = innerHTML;
				}
			}
			this._renderMxml(newit,canvas);
			if(id != "inqTitleBar" && id != "inqDivResizeCorner") canvas.applyStyles();
		}
		else switch(name) {
		case "mx:Style":{
			var xmlNode = el;
			var source = xmlNode.get("source");
			if(source != null) {
				source = com.inq.ui.SkinLoader._skinpath + "/" + source;
				var doc = window.document;
				try {
					doc = (("mx:ClientBody" == xmlNode.getParent().getNodeName())?window.parent.document:window.document);
				}
				catch( $e22 ) {
					{
						var e = $e22;
						{
							doc = window.document;
						}
					}
				}
				var heads = doc.getElementsByTagName("HEAD");
				if(heads == null || heads.length == 0) {
					var html = doc.getElementsByTagName("HTML");
				}
				var head = heads[0];
				var node = null;
				var nodes = head.getElementsByTagName("LINK");
				if(nodes != null && nodes.length > 0) {
					var nix;
					{
						var _g1 = 0, _g = nodes.length;
						while(_g1 < _g) {
							var nix1 = _g1++;
							if(nodes[nix1].id == "mxStyle") {
								node = nodes[nix1];
								break;
							}
						}
					}
				}
				if(node == null) {
					node = doc.createElement("LINK");
					node.name = "mxStyle";
					node.type = "text/css";
					node.rel = "stylesheet";
					node.media = "screen";
					node.href = source;
					head.appendChild(node);
				}
				else {
					node.href = source;
				}
			}
		}break;
		case "mx:ClientBody":{
			var xmlNode = el;
			var clientBody = new com.inq.ui.ClientBody();
			Application.application[clientBody.styles.id] = clientBody;
			var newit = xmlNode.elements();
			this._renderMxml(newit,clientBody);
		}break;
		case "mx:Canvas":{
			var xmlNode = el;
			var canvas = new com.inq.ui.Canvas(id);
			canvas.attachTo(parentObject);
			this.applyAttributes(xmlNode,canvas);
			Application.application[((!!id)?id:canvas.styles.id)] = canvas;
			var newit = xmlNode.elements();
			this._renderMxml(newit,canvas);
		}break;
		case "mx:Button":{
			var xmlNode = el;
			var btn = new com.inq.ui.Button(id);
			btn.attachTo(parentObject);
			this.applyAttributes(xmlNode,btn);
			{ var $it23 = xmlNode.elementsNamed("mx:upSkin");
			while( $it23.hasNext() ) { var itm = $it23.next();
			{
				var xmlsrc = itm;
				var source = this.unembed("" + xmlsrc.firstChild(),btn);
				btn.setUpSkin(source);
			}
			}}
			btn.addEventListener(com.inq.events.MouseEvent.CLICK,null);
			Application.application[id] = btn;
		}break;
		case "mx:Text":{
			var xmlNode = el;
			var txt = new com.inq.ui.Text();
			this.applyAttributes(xmlNode,txt);
			txt.attachTo(parentObject);
			Application.application[txt.styles.id] = txt;
		}break;
		case "mx:Image":{
			var xmlNode = el;
			var img = new com.inq.ui.Image(id);
			this.applyAttributes(xmlNode,img);
			{ var $it24 = xmlNode.elementsNamed("mx:source");
			while( $it24.hasNext() ) { var itm = $it24.next();
			{
				var xmlsrc = itm;
				var source = this.unembed("" + xmlsrc.firstChild(),img);
				img.setSrc(source);
			}
			}}
			img.attachTo(parentObject);
		}break;
		case "mx:TextArea":{
			var xmlNode = el;
			var ta = new com.inq.ui.TextArea(id);
			this.applyAttributes(xmlNode,ta);
			ta.attachTo(parentObject);
			Application.application[ta.styles.id] = ta;
		}break;
		case "mx:TextInput":{
			var xmlNode = el;
			var ti = new com.inq.ui.TextInput(id);
			this.applyAttributes(xmlNode,ti);
			ti.attachTo(parentObject);
			Application.application[ti.styles.id] = ti;
		}break;
		case "mx:LineInput":{
			var xmlNode = el;
			var ti = new com.inq.ui.LineInput(id);
			this.applyAttributes(xmlNode,ti);
			ti.attachTo(parentObject);
			Application.application[ti.styles.id] = ti;
		}break;
		case "mx:Label":{
			var xmlNode = el;
			var ti = new com.inq.ui.Label();
			this.applyAttributes(xmlNode,ti);
			ti.attachTo(parentObject);
			Application.application[ti.styles.id] = ti;
		}break;
		case "mx:XFrame":{
			var xmlNode = el;
			var ti = new com.inq.ui.XFrame(id);
			this.applyAttributes(xmlNode,ti);
			ti.attachTo(parentObject);
			Application.application[ti.styles.id] = ti;
		}break;
		case "mx:IFrame":{
			var xmlNode = el;
			var ti = new com.inq.ui.IFrame(id);
			this.applyAttributes(xmlNode,ti);
			ti.attachTo(parentObject);
			Application.application[ti.styles.id] = ti;
		}break;
		case "mx:Script":{
			var xmlsrc = el;
			var source = el.toString();
			var indx;
			if((indx = source.indexOf("skinConfig")) > 0) {
				indx = source.indexOf("{",indx);
				var indxEnd = source.lastIndexOf("}");
				var jsonString = source.substr(indx,indxEnd + 1 - indx);
				var func = new Function("var obj=" + jsonString + ";Application.application[\"skinConfig\"]=obj;");
				func();
			}
		}break;
		}
	}
	}}
}
com.inq.ui.SkinLoader.prototype._requestSkin = null;
com.inq.ui.SkinLoader.prototype._successSkinLoad = function(e) {
	var path = this._requestSkin.url;
	com.inq.ui.SkinLoader.skinCollection[path] = { mxml : this._loaderSkin.data, path : path}
	this.dispatchEvent(e);
	var xml = Xml.parse(this._loaderSkin.data);
	if(!com.inq.utils.Util.isIE) this._preloadImages(xml.elements());
	else this.preloadAllMxmlImages(xml.elements());
	return;
}
com.inq.ui.SkinLoader.prototype._successSkinLoadThenDraw = function(e) {
	haxe.Log.trace("successful skin load",{ fileName : "SkinLoader.hx", lineNumber : 120, className : "com.inq.ui.SkinLoader", methodName : "_successSkinLoadThenDraw"});
	var path = this._requestSkin.url;
	com.inq.ui.SkinLoader.skinCollection[path] = { mxml : this._loaderSkin.data, path : path}
	if(!com.inq.utils.Util.isIE) {
		this._draw(this._loaderSkin.data);
		this.executeCode();
		this.dispatchEvent(e);
		return;
	}
	else {
		var xml = Xml.parse(this._loaderSkin.data);
		this.preloadAllMxmlImages(xml.elements(),true);
		this.dispatchEvent(e);
	}
}
com.inq.ui.SkinLoader.prototype._thenDraw = function() {
	haxe.Log.trace("_thenDraw",{ fileName : "SkinLoader.hx", lineNumber : 148, className : "com.inq.ui.SkinLoader", methodName : "_thenDraw"});
	this._draw(this._loaderSkin.data);
	this.executeCode();
}
com.inq.ui.SkinLoader.prototype.applyAttributes = function(xmlNode,c) {
	var container = c;
	{ var $it25 = xmlNode.attributes();
	while( $it25.hasNext() ) { var ats = $it25.next();
	{
		var attName = ats;
		var attValu = xmlNode.get(attName);
		switch(attName) {
		case "id":{
			container.setID(attValu);
		}break;
		case "top":case "bottom":case "width":case "height":case "left":case "right":case "color":case "borderColor":case "borderStyle":case "borderThickness":case "alpha":case "text-align":case "padding":case "font-family":case "font-size":case "font-weight":case "z-index":case "overflow":case "border-radius":case "position":case "backgroundColor":case "background-color":case "backgroundSize":case "cursor":case "verticalAlign":case "textAlign":case "useHandCursor":case "label":case "toolTip":case "validate":case "maxChars":case "restrict":case "format":case "fontFamily":case "fontSize":{
			container.initStyle(attName,attValu);
		}break;
		case "min-width":{
			container.initStyle(attName,attValu + "px");
		}break;
		case "style":{
			if(Std["is"](container,com.inq.ui.Html)) {
				var html = function($this) {
					var $r;
					var tmp = container;
					$r = (Std["is"](tmp,com.inq.ui.Html)?tmp:function($this) {
						var $r;
						throw "Class cast error";
						return $r;
					}($this));
					return $r;
				}(this);
				html._setStyle(attValu);
			}
		}break;
		case "scrolling":{
			container.setScrolling(attValu);
		}break;
		case "source":{
			var source = this.unembed(attValu,container);
			container.setSrc(source);
		}break;
		case "sprite-height":case "sprite-width":case "sprite-left":case "sprite-top":{
			container.initStyle(attName,attValu);
		}break;
		case "backgroundImage":{
			container.initStyle("backgroundImage",this.unembed(attValu,container));
			container.setBackgroundImage(this.unembed(attValu,container));
		}break;
		case "visible":{
			if(attValu == "collapse") {
				container.initStyle("visibility","collapse");
				attValu = "false";
			}
			container.initStyle("visible",attValu);
			container.setVisible(((attValu == "false")?false:true));
		}break;
		case "upSkin":{
			container.initStyle("upSkin",this.unembed(attValu,container));
			var b = c;
			b.setUpSkin(this.unembed(attValu,b));
		}break;
		case "overSkin":{
			container.initStyle("overSkin",this.unembed(attValu,container));
		}break;
		case "text":{
			var lbl = container;
			lbl._setInput(attValu);
		}break;
		case "init":{
			var xFrame = container;
			xFrame.setInitOnLoad(attValu);
		}break;
		default:{
			container.initStyle(attName,attValu);
		}break;
		}
	}
	}}
}
com.inq.ui.SkinLoader.prototype.drawSkin = function(skinPath) {
	if(skinPath.substr(0,2) == "./") skinPath = skinPath.substr(2);
	if(skinPath.indexOf("\\") < 0 && skinPath.indexOf("/") < 0) skinPath = com.inq.ui.SkinLoader.getSkinBase() + "/" + skinPath;
	haxe.Log.trace("drawSkin: " + skinPath,{ fileName : "SkinLoader.hx", lineNumber : 68, className : "com.inq.ui.SkinLoader", methodName : "drawSkin"});
	if(null == com.inq.ui.SkinLoader.skinCollection[skinPath]) {
		this._loaderSkin = new com.inq.net.URLLoader();
		this._requestSkin = new com.inq.net.URLRequest(skinPath);
		this._loaderSkin.addEventListener(com.inq.events.IOErrorEvent.IO_ERROR,$closure(this,"_failedSkinLoad"));
		this._loaderSkin.addEventListener(com.inq.events.Event.COMPLETE,$closure(this,"_successSkinLoadThenDraw"));
		this._loaderSkin.load(this._requestSkin);
	}
	else {
		haxe.Log.trace("drawSkin: get path from store",{ fileName : "SkinLoader.hx", lineNumber : 77, className : "com.inq.ui.SkinLoader", methodName : "drawSkin"});
		var obj = com.inq.ui.SkinLoader.skinCollection[skinPath];
		this._draw(obj.mxml);
		this.executeCode();
		var e = new com.inq.events.Event(com.inq.events.Event.COMPLETE);
		this.dispatchEvent(e);
	}
}
com.inq.ui.SkinLoader.prototype.executeCode = function() {
	try {
		var onNewSkinLoad = Application.application.skinConfig["onNewSkinLoad"];
		if(onNewSkinLoad != null) onNewSkinLoad();
	}
	catch( $e26 ) {
		if( js.Boot.__instanceof($e26,Error) ) {
			var e = $e26;
			null;
		} else throw($e26);
	}
	try {
		var onInit = Application.application.skinConfig["onInit"];
		if(onInit != null) onInit();
	}
	catch( $e27 ) {
		if( js.Boot.__instanceof($e27,Error) ) {
			var e = $e27;
			null;
		} else throw($e27);
	}
}
com.inq.ui.SkinLoader.prototype.getImageMap = function() {
	if(com.inq.ui.SkinLoader.spriteMap != null) return com.inq.ui.SkinLoader.spriteMap;
	var tmpCanvas = window.document.createElement("CANVAS");
	var tmpMap = com.inq.utils.Util.getConfig("html5map",null);
	if(tmpCanvas != null) {
		if(tmpCanvas['getContext'] && null != tmpMap) {
			com.inq.ui.SkinLoader.spriteMap = tmpMap;
		}
		else {
			com.inq.ui.SkinLoader.spriteMap = null;
		}
	}
	return com.inq.ui.SkinLoader.spriteMap;
}
com.inq.ui.SkinLoader.prototype.getSkinPath = function() {
	return com.inq.ui.SkinLoader._skinpath;
}
com.inq.ui.SkinLoader.prototype.loadSkin = function(skinPath) {
	if(skinPath.substr(0,2) == "./") skinPath = skinPath.substr(2);
	if(skinPath.indexOf("\\") < 0 && skinPath.indexOf("/") < 0) skinPath = com.inq.ui.SkinLoader.getSkinBase() + "/" + skinPath;
	if(null == com.inq.ui.SkinLoader.skinCollection[skinPath]) {
		this._loaderSkin = new com.inq.net.URLLoader();
		this._requestSkin = new com.inq.net.URLRequest(skinPath);
		this._loaderSkin.addEventListener(com.inq.events.IOErrorEvent.IO_ERROR,$closure(this,"_failedSkinLoad"));
		this._loaderSkin.addEventListener(com.inq.events.Event.COMPLETE,$closure(this,"_successSkinLoad"));
		this._loaderSkin.load(this._requestSkin);
	}
	else {
		var e = new com.inq.events.Event(com.inq.events.Event.COMPLETE);
		this.dispatchEvent(e);
	}
}
com.inq.ui.SkinLoader.prototype.preloadAllMxmlImages = function(it,drawWhenFinished) {
	if(drawWhenFinished == null) drawWhenFinished = false;
	this._preloadImages(it);
	com.inq.ui.SkinLoader.imageCount = 0;
	var imageCollectionKeynameArray = Reflect.fields(com.inq.ui.SkinLoader.imageCollection);
	{
		var _g1 = 0, _g = imageCollectionKeynameArray.length;
		while(_g1 < _g) {
			var s = _g1++;
			var imagePath = imageCollectionKeynameArray[s];
			var img = new Image();
			img.context = this;
			var loadFunction = function(ev) {
				var imag = this;
				var callee = arguments.callee;
				var context = callee.context;
				var drawWhenFinished1 = callee.drawWhenFinished;
				context.whenPreloaded(imag,drawWhenFinished1);
			}
			loadFunction.context = this;
			loadFunction.drawWhenFinished = drawWhenFinished;
			img.onload = loadFunction;
			var imageItem = com.inq.ui.SkinLoader.imageCollection[imagePath];
			imageItem.image = img;
			com.inq.ui.SkinLoader.imageCount++;
		}
	}
	{
		var _g1 = 0, _g = imageCollectionKeynameArray.length;
		while(_g1 < _g) {
			var s = _g1++;
			var imagePath = imageCollectionKeynameArray[s];
			var imageItem = com.inq.ui.SkinLoader.imageCollection[imagePath];
			imageItem.image.src = imageItem.path;
		}
	}
}
com.inq.ui.SkinLoader.prototype.testClientBody = function(xmlNode) {
	var fast = new haxe.xml.Fast(xmlNode.firstElement());
	var clientNode;
	try {
		clientNode = fast.node.resolve("mx:ClientBody");
	}
	catch( $e28 ) {
		{
			var e = $e28;
			{
				clientNode = null;
			}
		}
	}
	return (clientNode != null);
}
com.inq.ui.SkinLoader.prototype.testSkinInClient = function(xmlNode) {
	var fast = new haxe.xml.Fast(xmlNode.firstElement());
	var childNode;
	var clientNode;
	var subNode;
	var _isPersistent = (window.parent.name == "_inqPersistentChat");
	if(com.inq.utils.Capabilities.isMobile() && !_isPersistent) {
		try {
			clientNode = fast.node.resolve("mx:ClientBody");
		}
		catch( $e29 ) {
			{
				var e = $e29;
				{
					clientNode = null;
				}
			}
		}
		if(clientNode != null) {
			{ var $it30 = clientNode.getElements();
			while( $it30.hasNext() ) { var childNode1 = $it30.next();
			{
				if(childNode1.has.resolve("id") && childNode1.att.resolve("id") == "Skin") return true;
				if(childNode1.has.resolve("id") && childNode1.att.resolve("id") == "inqTitleBar") {
					{ var $it31 = childNode1.getElements();
					while( $it31.hasNext() ) { var subNode1 = $it31.next();
					{
						if(subNode1.has.resolve("id") && subNode1.att.resolve("id") == "Skin") return true;
					}
					}}
				}
			}
			}}
		}
	}
	return false;
}
com.inq.ui.SkinLoader.prototype.unembed = function(source,con) {
	var bEmbeded = false;
	var s = source;
	var embedRegexp = new EReg("@Embed\\('([^']*)',([^,]*),([^,]*),([^,]*),([^,]*)\\)","i");
	try {
		haxe.Log.trace("source is: " + s,{ fileName : "SkinLoader.hx", lineNumber : 187, className : "com.inq.ui.SkinLoader", methodName : "unembed"});
		if(StringTools.startsWith(s,"@Embed(")) {
			if(this.getImageMap() != null) {
				try {
					var newEmbed = this.getImageMap()[s];
					if(newEmbed != null) s = newEmbed;
				}
				catch( $e32 ) {
					{
						var e = $e32;
						{
							haxe.Log.trace("map error " + s + ":" + e,{ fileName : "SkinLoader.hx", lineNumber : 196, className : "com.inq.ui.SkinLoader", methodName : "unembed"});
						}
					}
				}
			}
			if(embedRegexp.match(s)) {
				haxe.Log.trace("matched",{ fileName : "SkinLoader.hx", lineNumber : 200, className : "com.inq.ui.SkinLoader", methodName : "unembed"});
				if(con != null) {
					s = embedRegexp.matched(1);
					var l = embedRegexp.matched(2);
					var t = embedRegexp.matched(3);
					var w = embedRegexp.matched(4);
					var h = embedRegexp.matched(5);
					con.initStyle("sprite-height",h);
					con.initStyle("sprite-width",w);
					con.initStyle("sprite-left",l);
					con.initStyle("sprite-top",t);
					con.isSprite = true;
				}
				bEmbeded = true;
			}
			else {
				haxe.Log.trace("unmatched: " + s,{ fileName : "SkinLoader.hx", lineNumber : 216, className : "com.inq.ui.SkinLoader", methodName : "unembed"});
				s = s.substr(7,s.length - 8);
				bEmbeded = true;
			}
		}
		if(s.charAt(0) == "'") {
			haxe.Log.trace("remove quote",{ fileName : "SkinLoader.hx", lineNumber : 223, className : "com.inq.ui.SkinLoader", methodName : "unembed"});
			s = s.substr(1,s.length - 2);
		}
		s = (((bEmbeded)?(com.inq.ui.SkinLoader._skinpath + "/" + s):s)).split("/./").join("/");
		return s;
	}
	catch( $e33 ) {
		{
			var e = $e33;
			{
				throw new String("Could not parse embed: " + source);
			}
		}
	}
}
com.inq.ui.SkinLoader.prototype.whenPreloaded = function(img,drawWhenFinished) {
	try {
		var imagePath = img.src;
		var imageItem = com.inq.ui.SkinLoader.imageCollection[imagePath];
		if(imageItem != null) {
			imageItem.width = img.width;
			imageItem.height = img.height;
			imageItem.loaded = true;
			--com.inq.ui.SkinLoader.imageCount;
		}
		else {
			haxe.Log.trace("loaded " + img.src + " missing from image array",{ fileName : "SkinLoader.hx", lineNumber : 786, className : "com.inq.ui.SkinLoader", methodName : "whenPreloaded"});
		}
	}
	catch( $e34 ) {
		{
			var e = $e34;
			{
				haxe.Log.trace("ERROR on item: " + img.src + ": " + e,{ fileName : "SkinLoader.hx", lineNumber : 789, className : "com.inq.ui.SkinLoader", methodName : "whenPreloaded"});
				--com.inq.ui.SkinLoader.imageCount;
			}
		}
	}
	if(com.inq.ui.SkinLoader.imageCount < 1) {
		haxe.Log.trace("All images have been loaded",{ fileName : "SkinLoader.hx", lineNumber : 795, className : "com.inq.ui.SkinLoader", methodName : "whenPreloaded"});
		if(drawWhenFinished) {
			haxe.Log.trace("do _thenDraw() handler",{ fileName : "SkinLoader.hx", lineNumber : 797, className : "com.inq.ui.SkinLoader", methodName : "whenPreloaded"});
			this._thenDraw();
		}
	}
	return true;
}
com.inq.ui.SkinLoader.prototype.__class__ = com.inq.ui.SkinLoader;
com.inq.utils = {}
com.inq.utils.ConsoleLogger = function() { }
com.inq.utils.ConsoleLogger.__name__ = ["com","inq","utils","ConsoleLogger"];
com.inq.utils.ConsoleLogger.detect = function() {
	try {
		return (null != window["console"]);
	}
	catch( $e35 ) {
		{
			var e = $e35;
			{
				return false;
			}
		}
	}
}
com.inq.utils.ConsoleLogger.redirectTraces = function() {
	haxe.Log.trace = $closure(com.inq.utils.ConsoleLogger,"trace");
	js.Lib.setErrorHandler($closure(com.inq.utils.ConsoleLogger,"onError"));
}
com.inq.utils.ConsoleLogger.onError = function(err,stack) {
	var buf = err + "\n";
	{
		var _g = 0;
		while(_g < stack.length) {
			var s = stack[_g];
			++_g;
			buf += "Called from " + s + "\n";
		}
	}
	com.inq.utils.ConsoleLogger.trace(buf,null);
	return true;
}
com.inq.utils.ConsoleLogger.trace = function(v,inf) {
	if(!com.inq.utils.ConsoleLogger.detect() || com.inq.flash.client.control.FlashPeer.isLoggingDisabled()) return;
	var type = (inf != null && inf.customParams != null?inf.customParams[0]:null);
	if(type != "warn" && type != "info" && type != "debug" && type != "error") type = (inf == null?"error":"log");
	if(null != window.console[type]) {
		try {
			var place = ((inf == null)?"":inf.fileName + ":" + inf.lineNumber + " : ");
			(window.console[type])(place + Std.string(v));
		}
		catch( $e36 ) {
			{
				var e = $e36;
				null;
			}
		}
	}
}
com.inq.utils.ConsoleLogger.prototype.__class__ = com.inq.utils.ConsoleLogger;
js.Lib = function() { }
js.Lib.__name__ = ["js","Lib"];
js.Lib.isIE = null;
js.Lib.isOpera = null;
js.Lib.document = null;
js.Lib.window = null;
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
js.Lib.eval = function(code) {
	return eval(code);
}
js.Lib.setErrorHandler = function(f) {
	js.Lib.onerror = f;
}
js.Lib.prototype.__class__ = js.Lib;
EReg = function(r,opt) { if( r === $_ ) return; {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
}}
EReg.__name__ = ["EReg"];
EReg.prototype.customReplace = function(s,f) {
	var buf = new StringBuf();
	while(true) {
		if(!this.match(s)) break;
		buf.b[buf.b.length] = this.matchedLeft();
		buf.b[buf.b.length] = f(this);
		s = this.matchedRight();
	}
	buf.b[buf.b.length] = s;
	return buf.b.join("");
}
EReg.prototype.match = function(s) {
	this.r.m = this.r.exec(s);
	this.r.s = s;
	this.r.l = RegExp.leftContext;
	this.r.r = RegExp.rightContext;
	return (this.r.m != null);
}
EReg.prototype.matched = function(n) {
	return (this.r.m != null && n >= 0 && n < this.r.m.length?this.r.m[n]:function($this) {
		var $r;
		throw "EReg::matched";
		return $r;
	}(this));
}
EReg.prototype.matchedLeft = function() {
	if(this.r.m == null) throw "No string matched";
	if(this.r.l == null) return this.r.s.substr(0,this.r.m.index);
	return this.r.l;
}
EReg.prototype.matchedPos = function() {
	if(this.r.m == null) throw "No string matched";
	return { pos : this.r.m.index, len : this.r.m[0].length}
}
EReg.prototype.matchedRight = function() {
	if(this.r.m == null) throw "No string matched";
	if(this.r.r == null) {
		var sz = this.r.m.index + this.r.m[0].length;
		return this.r.s.substr(sz,this.r.s.length - sz);
	}
	return this.r.r;
}
EReg.prototype.r = null;
EReg.prototype.replace = function(s,by) {
	return s.replace(this.r,by);
}
EReg.prototype.split = function(s) {
	var d = "#__delim__#";
	return s.replace(this.r,d).split(d);
}
EReg.prototype.__class__ = EReg;
com.inq.utils.Capabilities = function(p) { if( p === $_ ) return; {
	null;
}}
com.inq.utils.Capabilities.__name__ = ["com","inq","utils","Capabilities"];
com.inq.utils.Capabilities.isSafari = null;
com.inq.utils.Capabilities.viewportDetector = null;
com.inq.utils.Capabilities.init = function() {
	var platform = null;
	var cpuClass = null;
	var userAgent = null;
	var replaceWith = null;
	var pattern = null;
	try {
		userAgent = js.Lib.window.navigator.userAgent;
		{
			var _g1 = 0, _g = com.inq.utils.Capabilities.patternTable.length;
			while(_g1 < _g) {
				var i = _g1++;
				pattern = new EReg(com.inq.utils.Capabilities.patternTable[i],"i");
				replaceWith = "$1";
				var b = pattern.match(userAgent);
				if(b) {
					com.inq.utils.Capabilities.os = pattern.matched(1);
					switch(com.inq.utils.Capabilities.os) {
					case " Windows NT 6.1":{
						com.inq.utils.Capabilities.os = "Windows 7/Windows Server 2008 R2";
					}break;
					case " Windows NT 6.0":{
						com.inq.utils.Capabilities.os = "Windows Vista/Windows Server 2008";
					}break;
					case " Windows NT 5.2":{
						com.inq.utils.Capabilities.os = "Windows XP/Windows Server 2003/Windows Home Server";
					}break;
					case " Windows NT 5.1":{
						com.inq.utils.Capabilities.os = "Windows XP";
					}break;
					default:{
						null;
					}break;
					}
					return true;
				}
			}
		}
	}
	catch( $e37 ) {
		if( js.Boot.__instanceof($e37,Error) ) {
			var e = $e37;
			null;
		} else throw($e37);
	}
	try {
		platform = js.Lib.window.navigator.platform;
		cpuClass = js.Lib.window.navigator.cpuClass;
	}
	catch( $e38 ) {
		if( js.Boot.__instanceof($e38,Error) ) {
			var e = $e38;
			null;
		} else throw($e38);
	}
	com.inq.utils.Capabilities.os = ((null == platform)?"unknown":platform);
	if(null != cpuClass) com.inq.utils.Capabilities.os += " " + cpuClass;
	return true;
}
com.inq.utils.Capabilities.isMobile = function() {
	if(com.inq.utils.Capabilities.mobile == null) {
		com.inq.utils.Capabilities.mobile = (com.inq.utils.Capabilities.isPhone() || com.inq.utils.Capabilities.isTablet());
	}
	return com.inq.utils.Capabilities.mobile;
}
com.inq.utils.Capabilities.isIpad = function() {
	return (com.inq.utils.Capabilities.os != null) && (com.inq.utils.Capabilities.os.indexOf("iPad") != -1);
}
com.inq.utils.Capabilities.isPhone = function() {
	return com.inq.utils.Capabilities.getDeviceType() == "Phone";
}
com.inq.utils.Capabilities.isTablet = function() {
	return com.inq.utils.Capabilities.getDeviceType() == "Tablet";
}
com.inq.utils.Capabilities.getDeviceType = function() {
	if(com.inq.utils.Capabilities.deviceType == null) {
		com.inq.utils.Capabilities.deviceType = com.inq.flash.client.control.FlashPeer.getDeviceType();
	}
	return com.inq.utils.Capabilities.deviceType;
}
com.inq.utils.Capabilities._isSafari = function() {
	if(com.inq.utils.Capabilities.safari != null) {
		return com.inq.utils.Capabilities.safari;
	}
	else {
		var userAgent = window.navigator.userAgent;
		var pattern = new EReg("(safari)","i");
		com.inq.utils.Capabilities.safari = pattern.match(userAgent);
		return com.inq.utils.Capabilities.safari;
	}
}
com.inq.utils.Capabilities.BindListener = function(node,event,handler) {
	if(null != window["addEventListener"]) {
		node.addEventListener(event,handler,false);
	}
	else if(null != window["attachEvent"]) {
		node.attachEvent("on" + event,handler);
	}
}
com.inq.utils.Capabilities.UnbindListener = function(node,event,handler) {
	if(null != window["removeEventListener"]) {
		node.removeEventListener(event,handler,false);
	}
	else if(null != window["detachEvent"]) {
		node.detachEvent("on" + event,handler);
	}
}
com.inq.utils.Capabilities.isAndroid = function() {
	var agent = js.Lib.window.navigator.userAgent;
	return (new EReg("android","i")).match(agent);
}
com.inq.utils.Capabilities.isCSSFixedPositionSupported = function(uAgent) {
	var majVer = "0", minVer = "0", incVer = "0";
	var r = new EReg("android ([0-9])\\.([0-9])\\.*([0-9]*)","i");
	r.match(uAgent);
	if(r.matched(3) != null) {
		majVer = r.matched(1);
		minVer = r.matched(2);
		incVer = r.matched(3);
	}
	return (Std.parseInt(majVer) > 3 || (Std.parseInt(majVer) == 3 && Std.parseInt(minVer) >= 1));
}
com.inq.utils.Capabilities.isAutoZoom = function() {
	var agent = js.Lib.window.navigator.userAgent;
	if(!com.inq.utils.Capabilities.isMobile()) {
		return false;
	}
	else if(((new EReg("android","i")).match(agent) && (new EReg("kindle fire","")).match(agent)) || (new EReg("silk-accelerated=true","i")).match(agent)) {
		return false;
	}
	else if((new EReg("android","i")).match(agent) && (new EReg("a100","i")).match(agent)) {
		return false;
	}
	else if((new EReg("android","i")).match(agent) && (new EReg("a200","i")).match(agent)) {
		return false;
	}
	else if((new EReg("android","i")).match(agent) && (new EReg("transformer tf101","i")).match(agent)) {
		return false;
	}
	else if((new EReg("android","i")).match(agent) && (new EReg("transformer tf300","i")).match(agent)) {
		return false;
	}
	else if((new EReg("android","i")).match(agent) && (new EReg("gt-p6210","i")).match(agent)) {
		return false;
	}
	else if((new EReg("android","i")).match(agent) && ((new EReg("gt-p7100","i")).match(agent) || (new EReg("gt-p7510","i")).match(agent))) {
		return false;
	}
	else if((new EReg("android","i")).match(agent) && (new EReg("sony tablet s","i")).match(agent)) {
		return false;
	}
	else {
		return true;
	}
}
com.inq.utils.Capabilities.getDefaultResizeArea = function() {
	if(com.inq.utils.Capabilities.isMobile()) {
		var a = new com.inq.utils.Area(0,0,32,32);
		return a;
	}
	else {
		var a = new com.inq.utils.Area(0,0,16,16);
		return a;
	}
}
com.inq.utils.Capabilities.getViewport = function() {
	var x = Std.parseInt(window.parent.scrollX);
	var y = Std.parseInt(window.parent.scrollY);
	var agent = js.Lib.window.navigator.userAgent;
	if((new EReg("(Android)","i")).match(agent)) {
		var bug = com.inq.utils.Capabilities.getLowerRightCorner();
		var vp = new com.inq.utils.Area(x,y,bug.x,bug.y);
		return vp;
	}
	else {
		var w = Std.parseInt(window.parent.innerWidth);
		var h = Std.parseInt(window.parent.innerHeight);
		var vp = new com.inq.utils.Area(x,y,w,h);
		return vp;
	}
}
com.inq.utils.Capabilities.getZoom = function() {
	var vp = com.inq.utils.Capabilities.getViewport();
	var rw = Std.parseInt(window.parent.parent.parent.screen.width);
	var z = Math.round(100 * (rw / vp.w)) / 100;
	return z;
}
com.inq.utils.Capabilities.getLowerRightCorner = function() {
	com.inq.utils.Capabilities.initZoomDetection();
	var x = com.inq.utils.Capabilities.viewportDetector.offsetLeft;
	var y = com.inq.utils.Capabilities.viewportDetector.offsetTop;
	return new com.inq.utils.Point(x,y);
}
com.inq.utils.Capabilities.initZoomDetection = function() {
	try {
		if(!com.inq.utils.Capabilities.viewportDetectorInitialized) {
			var pix = window.parent.document.createElement("DIV");
			pix.style.position = "fixed";
			pix.style.height = "1px";
			pix.style.width = "1px";
			pix.style.right = "0px";
			pix.style.bottom = "0px";
			com.inq.utils.Capabilities.viewportDetector = pix;
			window.parent.document.body.appendChild(com.inq.utils.Capabilities.viewportDetector);
			com.inq.utils.Capabilities.viewportDetectorInitialized = true;
		}
	}
	catch( $e39 ) {
		if( js.Boot.__instanceof($e39,Error) ) {
			var e = $e39;
			{
				haxe.Log.trace(e,{ fileName : "Capabilities.hx", lineNumber : 342, className : "com.inq.utils.Capabilities", methodName : "initZoomDetection"});
			}
		} else throw($e39);
	}
}
com.inq.utils.Capabilities.prototype.__class__ = com.inq.utils.Capabilities;
com.inq.utils.Point = function(x,y) { if( x === $_ ) return; {
	this.x = x;
	this.y = y;
}}
com.inq.utils.Point.__name__ = ["com","inq","utils","Point"];
com.inq.utils.Point.prototype.diff = function(p) {
	var x = p.x - this.x;
	var y = p.y - this.y;
	return new com.inq.utils.Point(x,y);
}
com.inq.utils.Point.prototype.move = function(dx,dy) {
	this.x += dx;
	this.y += dy;
	return this;
}
com.inq.utils.Point.prototype.moveTo = function(x,y) {
	this.x += x;
	this.y += y;
	return this;
}
com.inq.utils.Point.prototype.toString = function() {
	return "Point[x: " + this.x + ", y: " + this.y + "]";
}
com.inq.utils.Point.prototype.x = null;
com.inq.utils.Point.prototype.y = null;
com.inq.utils.Point.prototype.__class__ = com.inq.utils.Point;
com.inq.utils.Area = function(x,y,w,h) { if( x === $_ ) return; {
	com.inq.utils.Point.apply(this,[x,y]);
	this.w = w;
	this.h = h;
}}
com.inq.utils.Area.__name__ = ["com","inq","utils","Area"];
com.inq.utils.Area.__super__ = com.inq.utils.Point;
for(var k in com.inq.utils.Point.prototype ) com.inq.utils.Area.prototype[k] = com.inq.utils.Point.prototype[k];
com.inq.utils.Area.prototype.copy = function() {
	return new com.inq.utils.Area(this.x,this.y,this.w,this.h);
}
com.inq.utils.Area.prototype.equals = function(area) {
	return this.x == area.x && this.y == area.y && this.w == area.w && this.h == area.h;
}
com.inq.utils.Area.prototype.h = null;
com.inq.utils.Area.prototype.resize = function(dw,dh) {
	this.w += dw;
	this.h += dh;
	return this;
}
com.inq.utils.Area.prototype.scale = function(zoom) {
	this.w = Math.round(this.w * zoom);
	this.h = Math.round(this.h * zoom);
	return this;
}
com.inq.utils.Area.prototype.toString = function() {
	return "Area[x: " + this.x + ", y: " + this.y + ", w: " + this.w + ", h: " + this.h + "]";
}
com.inq.utils.Area.prototype.w = null;
com.inq.utils.Area.prototype.__class__ = com.inq.utils.Area;
Application = function(p) { if( p === $_ ) return; {
	com.inq.ui.SkinLoader.apply(this,[]);
	this.applicationController = null;
	this.area = new com.inq.utils.Area(0,0,0,0);
	this.initialized = false;
	this.url = (js.Lib.document.getElementById("inqChatJs")).src;
	var aPath = this.url.split("\\").join("/").split("/");
	aPath.pop();
	this.path = aPath.join("/");
	this.initializeParameters();
	this.screen = new com.inq.ui.Screen();
	this.stage = com.inq.ui.Stage.getInstance();
	this.getSkinPath();
	var inqDivResizeCorner = window.parent.document.getElementById("inqDivResizeCorner");
	var inqChatDiv = window.parent.document.getElementById("inqDivResizeCorner");
	this.titlebar = new com.inq.ui.Image("inqTitleBar");
	var inqTitleBar = window.parent.document.getElementById("inqTitleBar");
	if(inqTitleBar == null) {
		inqTitleBar = window.parent.document.createElement("DIV");
		inqTitleBar.id = "inqTitleBar";
		inqTitleBar.style = "position: absolute; z-index: 9999999; height: 1px; width: 1px; left: 0px; top: 0px;";
		window.parent.document.body.appendChild(inqTitleBar);
	}
	inqTitleBar.style.height = com.inq.flash.client.control.FlashPeer.getTitleBarHeight() + "px";
	var clearImage = this.getImagePath() + "/clear.gif";
	this["clearImage"] = clearImage;
	this.titlebar.setID("inqTitleBar");
	this.titlebar.initStyle("cursor","move");
	this.titlebar.initStyle("borderThickness","0");
	this.titlebar.initStyle("top","0");
	this.titlebar.initStyle("left","0");
	try {
		this.titlebar.initStyle("right","" + com.inq.flash.client.control.FlashPeer.getPopupCloserWidth());
	}
	catch( $e40 ) {
		if( js.Boot.__instanceof($e40,Error) ) {
			var e = $e40;
			{
				this.titlebar.initStyle("right","52");
			}
		} else throw($e40);
	}
	try {
		this.titlebar.initStyle("height","" + com.inq.flash.client.control.FlashPeer.getTitleBarHeight());
	}
	catch( $e41 ) {
		if( js.Boot.__instanceof($e41,Error) ) {
			var e = $e41;
			{
				haxe.Log.trace("ERROR: " + e,{ fileName : "Application.hx", lineNumber : 102, className : "Application", methodName : "new"});
			}
		} else throw($e41);
	}
	this.titlebar.setStyle("zindex",Application.zIndexResize);
	var inputList = this.titlebar._div.getElementsByTagName("INPUT");
	if(inputList == null || inputList.length == 0) {
		this.titlebar._div.innerHTML = "<input type=\"image\" src=\"" + clearImage + "\" style=\"height: 100%; width: 100%;\"/>";
	}
	var inqDivResizeCorner1 = window.parent.document.getElementById("inqDivResizeCorner");
	this.resizeCorner = new com.inq.ui.Image("inqDivResizeCorner");
	if(this.resizeCorner != null) {
		this.resizeCorner.setID("inqDivResizeCorner");
		this.resizeCorner.initStyle("cursor","se-resize");
		this.resizeCorner.initStyle("borderThickness","0");
		this.resizeCorner.initStyle("right","0");
		this.resizeCorner.initStyle("bottom","0");
		this.resizeCorner.initStyle("width",Application.dragArea.w);
		this.resizeCorner.initStyle("height",Application.dragArea.h);
		this.resizeCorner.setStyle("zindex",(Application.zIndexResize + 1));
		var inputList1 = this.resizeCorner._div.getElementsByTagName("INPUT");
		if(inputList1 == null || inputList1.length == 0) {
			this.resizeCorner._div.innerHTML = "<input type=\"image\" src=\"" + this.getImagePath() + "/ResizeCorner.gif\" " + "style=\"position: absolute; top:0px; left:0px; height: 100%; width: 100%; bottom: 0px; right: 0px; display: block;\"/>";
		}
	}
	if(window.parent.name == "_inqPersistentChat") {
		this.titlebar.setVisible(false);
		this.resizeCorner.setVisible(false);
	}
	Application.containsOutside = new Array();
	this.onApplicationControllerInitializedHandlers = new Array();
}}
Application.__name__ = ["Application"];
Application.__super__ = com.inq.ui.SkinLoader;
for(var k in com.inq.ui.SkinLoader.prototype ) Application.prototype[k] = com.inq.ui.SkinLoader.prototype[k];
Application.mxml = null;
Application.containsOutside = null;
Application.me = null;
Application.ScrollStage = function(relLeft,relTop) {
	var w, h, l, t;
	var iframe = ((Application.IsPersistent() && com.inq.utils.Capabilities.isIpad())?Application.application._div:js.Lib.window.frameElement);
	w = Std.parseInt(iframe.style.width);
	h = Std.parseInt(iframe.style.height);
	l = Std.parseInt(iframe.style.left) + relLeft;
	t = Std.parseInt(iframe.style.top) + relTop;
	l = Application.FixAbsoluteX(l,w);
	t = Application.FixAbsoluteY(t,h);
	iframe.style.left = l + "px";
	iframe.style.top = t + "px";
	Application.MoveSizeDiv2Stage(w,h,l,t);
}
Application.ScrollStageInPage = function(relLeft,relTop) {
	var iframe = js.Lib.window.frameElement;
	var w = Std.parseInt(iframe.style.width);
	var h = Std.parseInt(iframe.style.height);
	var l = Std.parseInt(iframe.style.left) + relLeft;
	var t = Std.parseInt(iframe.style.top) + relTop;
	var ow = Std.parseInt(window.parent.document.documentElement.offsetWidth);
	var oh = Std.parseInt(window.parent.document.documentElement.offsetHeight);
	var st = Std.parseInt(window.parent.document.documentElement.scrollTop);
	var sl = Std.parseInt(window.parent.document.documentElement.scrollLeft);
	var vp = com.inq.utils.Capabilities.getViewport();
	var docMaxLeft = ow - w;
	var winMaxLeft = ow - sl + vp.w;
	var docMaxTop = oh - h;
	var winMaxTop = oh - st + vp.h;
	var maxLeft = (docMaxLeft > winMaxLeft?docMaxLeft:winMaxLeft);
	var maxTop = (docMaxTop > winMaxTop?docMaxTop:winMaxTop);
	l = ((l < 0)?0:l);
	l = ((l > maxLeft)?maxLeft:l);
	t = ((t < 0)?0:t);
	t = ((t > maxTop)?maxTop:t);
	iframe.style.left = l + "px";
	iframe.style.top = t + "px";
	Application.MoveSizeDiv2Stage(w,h,l,t);
}
Application.MoveSizeDiv2Stage = function(w,h,left,top) {
	if(w == null) {
		w = com.inq.flash.client.control.PersistenceManager.GetValue("w",400);
	}
	if(h == null) {
		h = com.inq.flash.client.control.PersistenceManager.GetValue("h",300);
	}
	if(top == null) {
		top = Application.application.area.y;
	}
	if(left == null) {
		left = Application.application.area.x;
	}
	if(w == null) {
		w = Application.application.area.w;
	}
	if(h == null) {
		h = Application.application.area.h;
	}
	if(w < Application.minWidth) {
		w = Application.minWidth;
	}
	if(h < Application.minHeight) {
		h = Application.minHeight;
	}
	Application.application.area = new com.inq.utils.Area(left,top,w,h);
	Application.application.setWidth(Application.application.area.w);
	Application.application.setHeight(Application.application.area.h);
	if(Application.application._div.ownerDocument != null && Application.application._div.ownerDocument != window.document) {
		Application.application._div.style.left = left + "px";
		Application.application._div.style.top = top + "px";
		Application.application._div.style.zIndex = Application.zIndexResize;
		Application.application.initStyle("top","" + top);
		Application.application.initStyle("left","" + left);
		Application.application.initStyle("width","" + w);
		Application.application.initStyle("height","" + h);
		Application.application.initStyle("overflow","hidden");
		Application.application.initStyle("z-index","" + Application.zIndexResize);
	}
	var clientDoc = parent.document;
	var inqTitleBar = clientDoc.getElementById("inqTitleBar");
	if(inqTitleBar) {
		inqTitleBar.style.left = left + "px";
		inqTitleBar.style.top = top + "px";
		var rightOffset = Application.application.titlebar.getStyle("right");
		inqTitleBar.style.width = (w - rightOffset) + "px";
		inqTitleBar.style.zIndex = Application.zIndexResize;
		var inqTitleBarInput = inqTitleBar.getElementsByTagName("input")[0];
		inqTitleBarInput.style.width = (w - rightOffset) + "px";
	}
	var inqDivResizeCorner = clientDoc.getElementById("inqDivResizeCorner");
	if(inqDivResizeCorner) {
		inqDivResizeCorner.style.left = (left + w - Application.dragArea.w) + "px";
		inqDivResizeCorner.style.top = (top + h - Application.dragArea.h) + "px";
		inqDivResizeCorner.style.width = (Application.dragArea.w) + "px";
		inqDivResizeCorner.style.height = (Application.dragArea.h) + "px";
		inqDivResizeCorner.style.display = ((Application.resizable && Application.application.getVisible())?"block":"none");
		inqDivResizeCorner.style.zIndex = (Application.zIndexResize + 1);
	}
}
Application.FixAbsoluteX = function(x,w) {
	var l, scrollLeft;
	l = x - (scrollLeft = com.inq.flash.client.chatskins.ScrollMonitor.getScrollLeft());
	return Application.FixX(l,w) + scrollLeft;
}
Application.FixAbsoluteY = function(y,h) {
	var t, scrollTop;
	t = y - (scrollTop = com.inq.flash.client.chatskins.ScrollMonitor.getScrollTop());
	return Application.FixY(t,h) + scrollTop;
}
Application.FixX = function(x,w) {
	var left = ((x < 0)?0:x);
	var right = left + w;
	var xMax = com.inq.flash.client.chatskins.ScrollMonitor.getScrollWidth();
	if(right > xMax && left != 0) {
		left = xMax - w;
	}
	if(left < 0) {
		left = 0;
	}
	return left;
}
Application.FixY = function(y,h) {
	var top = ((y < 0)?0:y);
	var bottom = top + h;
	var scrollHeight = com.inq.flash.client.chatskins.ScrollMonitor.getScrollHeight();
	var yMax = scrollHeight - h;
	if(top > yMax && top != 0) {
		top = yMax;
	}
	if(top < 0) {
		top = 0;
	}
	return top;
}
Application.SetArea = function(area) {
	Application.ResizeStage(area.w,area.h);
	Application.MoveStage(area.x,area.y);
}
Application.IsPersistent = function() {
	return Application.isPersistent;
}
Application.GetArea = function() {
	return Application.application.area.copy();
}
Application.MoveStage = function(newLeft,newTop) {
	var iframe = js.Lib.window.frameElement;
	var w = Std.parseInt(iframe.style.width);
	var h = Std.parseInt(iframe.style.height);
	newLeft -= com.inq.flash.client.chatskins.ScrollMonitor.getScrollLeft();
	newTop -= com.inq.flash.client.chatskins.ScrollMonitor.getScrollTop();
	var adjustedLeft = Application.FixX(newLeft,w);
	var adjustedTop = Application.FixY(newTop,h);
	var relLeft = adjustedLeft - newLeft;
	var relTop = adjustedTop - newTop;
	com.inq.flash.client.control.PersistenceManager.SetValues({ l : adjustedLeft, t : adjustedTop});
	Application.MoveSizeDiv2Stage(w,h,adjustedLeft,adjustedTop);
	Application.ScrollStage(relLeft,relTop);
}
Application.getMinWidth = function() {
	return Application.minWidth;
}
Application.getMinHeight = function() {
	return Application.minHeight;
}
Application.ResizeStage = function(newWidth,newHeight) {
	if(newWidth < Application.minWidth) {
		newWidth = Application.minWidth;
	}
	if(newHeight < Application.minHeight) {
		newHeight = Application.minHeight;
	}
	var stgElement = com.inq.ui.Stage.getStageElement();
	if(stgElement && !Application.isPersistent) {
		stgElement.style.height = Application.application.stg.style.height = (newHeight) + "px";
		stgElement.style.width = Application.application.stg.style.width = (newWidth) + "px";
		com.inq.flash.client.control.PersistenceManager.SetValues({ h : newHeight, w : newWidth});
		Application.MoveSizeDiv2Stage(newWidth,newHeight);
	}
	else if(Application.isPersistent && null != window.parent.opener) {
		if(newWidth < Application.minWidth) newWidth = Application.minWidth;
		if(newHeight < Application.minHeight) newHeight = Application.minHeight;
		var deltaWidth = newWidth - com.inq.ui.Stage.getterStageWidth();
		var deltaHeight = newHeight - com.inq.ui.Stage.getterStageHeight();
		var win = window.parent;
		if(deltaWidth != 0 || deltaHeight != 0) {
			try {
				win.resizeBy(deltaWidth,deltaHeight);
			}
			catch( $e42 ) {
				{
					var e = $e42;
					null;
				}
			}
		}
		Application.application.setWidth(Application.application.area.w = newWidth);
		Application.application.setHeight(Application.application.area.h = newHeight);
	}
	Application.Resize();
}
Application.Resize = function() {
	if(null != Application.application) {
		Application.application.resize();
	}
}
Application.doClick = function(e) {
	return false;
}
Application._initTrace = function() {
	haxe.Log.trace = $closure(com.inq.utils.ConsoleLogger,"trace");
	return true;
}
Application.main = function() {
	if(Application.hasRun) {
		Application.hasRun = false;
		Application._initTrace();
		Application.application = null;
	}
	Application.application = new Application();
	Application.application._init();
	Application._initTrace();
	if(!com.inq.utils.Capabilities.isPhone()) {
		try {
			com.inq.stage.Move.setDragable();
		}
		catch( $e43 ) {
			if( js.Boot.__instanceof($e43,Error) ) {
				var e = $e43;
				null;
			} else throw($e43);
		}
		try {
			com.inq.stage.Resize.setResizable();
		}
		catch( $e44 ) {
			if( js.Boot.__instanceof($e44,Error) ) {
				var e = $e44;
				null;
			} else throw($e44);
		}
	}
}
Application.resizePersistentFrame = function() {
	var frm = window.frameElement;
	if(com.inq.utils.Capabilities.isMobile()) {
		var vp = com.inq.utils.Capabilities.getViewport();
		Application.SetArea(vp);
	}
	else if(Application.resizable) {
		if(Application.popoutStageWidth == -1 && Application.popoutStageHeight == -1) {
			Application.ResizeStage(Application.popoutStageWidth = frm.clientWidth,Application.popoutStageHeight = frm.clientHeight);
		}
		else {
			var curWidth = frm.clientWidth;
			var curHeight = frm.clientHeight;
			if(curHeight == Application.popoutStageHeight && curWidth == Application.popoutStageWidth) {
				return;
			}
			if(curWidth < Application.minWidth) {
				curWidth = Application.minWidth;
			}
			if(curHeight < Application.minHeight) {
				curHeight = Application.minHeight;
			}
			var xDelta = curWidth - frm.clientWidth;
			var yDelta = curHeight - frm.clientHeight;
			if(xDelta != 0 || yDelta != 0) {
				window.parent.resizeBy(xDelta,yDelta);
			}
			Application.ResizeStage(Application.popoutStageWidth = curWidth,Application.popoutStageHeight = curHeight);
		}
	}
	else {
		if(Application.popoutStageWidth == -1 && Application.popoutStageHeight == -1) {
			Application.ResizeStage(Application.popoutStageWidth = frm.clientWidth,Application.popoutStageHeight = frm.clientHeight);
		}
		else {
			var xDelta = Application.popoutStageWidth - frm.clientWidth;
			var yDelta = Application.popoutStageHeight - frm.clientHeight;
			window.parent.resizeBy(xDelta,yDelta);
		}
	}
}
Application.Run = function() {
	if(Application.hasRun) {
		return;
	}
	Application.hasRun = true;
	Application.application.run();
}
Application.prototype._draw = function(mxml) {
	com.inq.ui.SkinLoader.prototype._draw.apply(this,[mxml]);
	this.applyStyle();
	var launchWhenReady = false;
	try {
		launchWhenReady = js.Lib.window["launchWhenReady"];
	}
	catch( $e45 ) {
		if( js.Boot.__instanceof($e45,Error) ) {
			var e = $e45;
			{
				launchWhenReady = false;
			}
		} else throw($e45);
	}
	if(launchWhenReady) {
		Application.Run();
	}
}
Application.prototype._init = function() {
	var ix;
	var skin;
	var srptagsArray;
	var doc = js.Lib.document;
	var Inq = js.Lib.window.Inq;
	com.inq.ui.Stage.getInstance().setVisible(false);
	if(js.Lib.window.frameElement) {
		var pDoc = window.frameElement.ownerDocument;
		this.stg = pDoc.getElementById("inqChatStage");
	}
	skin = com.inq.flash.client.control.FlashPeer.getSkin();
	skin = com.inq.flash.client.control.PersistenceManager.GetValue("skn",skin);
	if(skin.indexOf("\\") < 0 && skin.indexOf("/") < 0) skin = com.inq.ui.SkinLoader.getSkinBase() + "/" + skin;
	this.drawSkin(skin);
	this.initialized = true;
}
Application.prototype.applicationController = null;
Application.prototype.area = null;
Application.prototype.chatData = null;
Application.prototype.close = function() {
	window.onunload = function(ev) {
		return true;
	}
	this.applicationController.disable();
	var div = this._div;
	var body = js.Lib.document.getElementsByTagName("BODY")[0];
	if(div != null) {
		if(body != null) {
			try {
				body.removeChild(div);
			}
			catch( $e46 ) {
				if( js.Boot.__instanceof($e46,Error) ) {
					var e = $e46;
					{
						haxe.Log.trace("ERROR REMOVING DIV:" + e,{ fileName : "Application.hx", lineNumber : 152, className : "Application", methodName : "close"});
					}
				} else throw($e46);
			}
			this._div = null;
		}
	}
	var inqDivResizeCorner = window.parent.document.getElementById("inqDivResizeCorner");
	var inqTitleBar = window.parent.document.getElementById("inqTitleBar");
	var inqFrame = window.parent.document.getElementById("inqChatStage");
	if(inqFrame != null) {
		inqFrame.style.display = "none";
	}
	if(inqDivResizeCorner != null) {
		inqDivResizeCorner.style.display = "none";
	}
	if(inqTitleBar != null) {
		inqTitleBar.style.display = "none";
	}
}
Application.prototype.currentState = null;
Application.prototype.customerEndsCobrowse = function() {
	com.inq.flash.client.chatskins.SkinControl.endCobrowse();
}
Application.prototype.executeCode = function() {
	try {
		var onInit = Application.application.skinConfig["onInit"];
		if(onInit != null) {
			onInit();
		}
	}
	catch( $e47 ) {
		if( js.Boot.__instanceof($e47,Error) ) {
			var e = $e47;
			null;
		} else throw($e47);
	}
}
Application.prototype.failedSkinLoad = function(event) {
	haxe.Log.trace("Could not open script",{ fileName : "Application.hx", lineNumber : 587, className : "Application", methodName : "failedSkinLoad"});
	return;
}
Application.prototype.getImagePath = function() {
	if(this.imgpath != null) {
		return this.imgpath;
	}
	var skin = com.inq.flash.client.control.FlashPeer.getSkin();
	var baseURL = com.inq.flash.client.control.FlashPeer.getBaseURL();
	var mediaURL = com.inq.flash.client.control.FlashPeer.getMediaBaseURL();
	skin = skin.split(baseURL).join(mediaURL);
	var aPath = skin.split("\\").join("/").split("/");
	var mxmlName = aPath.pop().split(".")[0];
	aPath.push(mxmlName);
	return (this.imgpath = aPath.join("/"));
}
Application.prototype.getInitialChatLocation = function() {
	var mbHeight = com.inq.flash.client.control.FlashPeer.getTitleBarHeight();
	var W = com.inq.flash.client.control.FlashPeer.getSkinWidth();
	var H = com.inq.flash.client.control.FlashPeer.getSkinHeight() + mbHeight;
	var X = com.inq.flash.client.control.FlashPeer.getSkinLeft();
	var Y = com.inq.flash.client.control.FlashPeer.getSkinTop();
	var scrollBarWidth = com.inq.flash.client.chatskins.ScrollMonitor.getScrollBarWidth();
	var left = 0, top = 0;
	var isRightScrollBar = (window.parent.document.documentElement.clientHeight < window.parent.document.documentElement.scrollHeight) && !com.inq.utils.Util.isIE;
	var isBottomScrollBar = (window.parent.document.documentElement.clientWidth < window.parent.document.documentElement.scrollWidth) && !com.inq.utils.Util.isIE;
	if((js.Lib.window["opener"]) != null) {
		return null;
	}
	var sLocation = com.inq.flash.client.control.FlashPeer.getSkinLocation();
	var inq_scroll_width, inq_scroll_height;
	if(com.inq.utils.Util.isIE) {
		inq_scroll_height = window.parent.document.documentElement.clientHeight;
		inq_scroll_width = window.parent.document.documentElement.clientWidth;
	}
	else {
		inq_scroll_height = window.parent.innerHeight;
		inq_scroll_width = window.parent.innerWidth;
	}
	switch(sLocation.toUpperCase()) {
	case "UPPER CENTER":case "UPPER_CENTER":case "TOP_CENTER":{
		top = com.inq.flash.client.chatskins.ScrollMonitor.getScrollTop();
		left = ((inq_scroll_width / 2) - (W / 2)) + com.inq.flash.client.chatskins.ScrollMonitor.getScrollLeft();
	}break;
	case "UPPER_RIGHT":case "TOP_RIGHT":{
		top = com.inq.flash.client.chatskins.ScrollMonitor.getScrollTop();
		left = (inq_scroll_width - W) + com.inq.flash.client.chatskins.ScrollMonitor.getScrollLeft() - ((isRightScrollBar?scrollBarWidth:0));
	}break;
	case "UPPER_LEFT":case "TOP_LEFT":{
		top = com.inq.flash.client.chatskins.ScrollMonitor.getScrollTop();
		left = com.inq.flash.client.chatskins.ScrollMonitor.getScrollLeft();
	}break;
	case "CENTER_LEFT":{
		top = ((inq_scroll_height / 2) - (H / 2)) + com.inq.flash.client.chatskins.ScrollMonitor.getScrollTop();
		left = com.inq.flash.client.chatskins.ScrollMonitor.getScrollLeft();
	}break;
	case "CENTER_RIGHT":{
		top = ((inq_scroll_height / 2) - (H / 2)) + com.inq.flash.client.chatskins.ScrollMonitor.getScrollTop();
		left = (inq_scroll_width - W) + com.inq.flash.client.chatskins.ScrollMonitor.getScrollLeft() - ((isRightScrollBar?scrollBarWidth:0));
	}break;
	case "LOWER_LEFT":case "BOTTOM_LEFT":{
		top = (inq_scroll_height - H) + com.inq.flash.client.chatskins.ScrollMonitor.getScrollTop() - ((isBottomScrollBar?scrollBarWidth:0));
		left = com.inq.flash.client.chatskins.ScrollMonitor.getScrollLeft();
	}break;
	case "LOWER_CENTER":case "BOTTOM_CENTER":{
		top = (inq_scroll_height - H) + com.inq.flash.client.chatskins.ScrollMonitor.getScrollTop() - ((isBottomScrollBar?scrollBarWidth:0));
		left = ((inq_scroll_width / 2) - (W / 2)) + com.inq.flash.client.chatskins.ScrollMonitor.getScrollLeft();
	}break;
	case "LOWER_RIGHT":case "BOTTOM_RIGHT":{
		left = (inq_scroll_width - W) + com.inq.flash.client.chatskins.ScrollMonitor.getScrollLeft() - ((isRightScrollBar?scrollBarWidth:0));
		top = (inq_scroll_height - H) + com.inq.flash.client.chatskins.ScrollMonitor.getScrollTop() - ((isBottomScrollBar?scrollBarWidth:0));
	}break;
	case "POP_UNDER_CENTER":{
		left = ((inq_scroll_width / 2) - (W / 2)) + com.inq.flash.client.chatskins.ScrollMonitor.getScrollLeft();
		top = (inq_scroll_height / 2 - H) + com.inq.flash.client.chatskins.ScrollMonitor.getScrollTop();
	}break;
	case "ABSOLUTE":{
		left = X;
		top = Y;
	}break;
	case "RELATIVE":{
		left = X + com.inq.flash.client.chatskins.ScrollMonitor.getScrollLeft();
		top = Y + com.inq.flash.client.chatskins.ScrollMonitor.getScrollTop();
	}break;
	case "CENTER":{
		left = ((inq_scroll_width / 2) - (W / 2)) + com.inq.flash.client.chatskins.ScrollMonitor.getScrollLeft();
		top = ((inq_scroll_height / 2) - (H / 2)) + com.inq.flash.client.chatskins.ScrollMonitor.getScrollTop();
	}break;
	}
	if(left == null || left < 0) {
		left = 100;
	}
	if(null == top || top < 0) {
		top = 100;
	}
	return new com.inq.utils.Point(Std["int"](left),Std["int"](top));
}
Application.prototype.getVisible = function() {
	if(this._visible) {
		if(com.inq.ui.SkinLoader.skinInClient) {
			if("none" == com.inq.ui.Container.getElementById("chatWindow").style.display) {
				this.setVisible(false);
			}
		}
		else {
			if("none" == window.frameElement.style.display.toLowerCase()) {
				this.setVisible(false);
			}
		}
	}
	return this._visible;
}
Application.prototype.imgpath = null;
Application.prototype.initializeParameters = function() {
	this.parameters = new com.inq.utils.Dictionary();
	var flashvarsString = "";
	try {
		flashvarsString = com.inq.flash.client.control.FlashPeer.getFlashVars();
		var winName = window.parent.name;
		if((winName == "_inqPersistentChat") && (flashvarsString.indexOf("PersistentFrame") == -1)) {
			flashvarsString = "PersistentFrame=1&" + flashvarsString;
		}
		flashvarsString = flashvarsString.split("socket,").join("");
	}
	catch( $e48 ) {
		if( js.Boot.__instanceof($e48,Error) ) {
			var e = $e48;
			{
				haxe.Log.trace("ERRORS:" + e,{ fileName : "Application.hx", lineNumber : 186, className : "Application", methodName : "initializeParameters"});
			}
		} else throw($e48);
	}
	var flashvars = flashvarsString.split("&");
	{
		var _g = 0;
		while(_g < flashvars.length) {
			var fv = flashvars[_g];
			++_g;
			var namekey = ("" + fv).split("=");
			this.parameters[namekey[0]] = ((namekey.length == 1)?null:decodeURIComponent(namekey[1]));
		}
	}
	com.inq.flash.client.control.FlashVars._init();
	com.inq.flash.client.chatskins.SndMgr._init();
}
Application.prototype.initialized = null;
Application.prototype.loaderSkin = null;
Application.prototype.onApplicationControllerInitializedHandlers = null;
Application.prototype.parameters = null;
Application.prototype.path = null;
Application.prototype.resize = function() {
	com.inq.ui.SkinLoader.prototype.resize.apply(this,[]);
	this.resizer(Application.containsOutside);
	this.resizer(this.contains);
	com.inq.flash.client.chatskins.BalloonNotifier.Resize();
}
Application.prototype.resizeCorner = null;
Application.prototype.run = function() {
	com.inq.flash.client.control.PersistenceManager.reopen();
	js.Lib.window["launchWhenReady"] = true;
	Application.minWidth = ((null == Application.application.skinConfig["minWidth"])?250:Application.application.skinConfig.minWidth);
	Application.minHeight = ((null == Application.application.skinConfig["minHeight"])?150:Application.application.skinConfig.minHeight);
	Application.resizable = ((null == Application.application.skinConfig["resizable"])?true:Application.application.skinConfig.resizable);
	var tooltipResize = ((null == Application.application.skinConfig["tooltipResize"])?"":Application.application.skinConfig["tooltipResize"]);
	var tooltipDrag = ((null == Application.application.skinConfig["tooltipDrag"])?"":Application.application.skinConfig["tooltipDrag"]);
	this.resizeCorner._div.getElementsByTagName("INPUT")[0].title = tooltipResize;
	this.titlebar._div.getElementsByTagName("INPUT")[0].title = tooltipDrag;
	if(!com.inq.utils.Capabilities.isPhone()) {
		try {
			com.inq.stage.Move.setDragable();
		}
		catch( $e49 ) {
			if( js.Boot.__instanceof($e49,Error) ) {
				var e = $e49;
				null;
			} else throw($e49);
		}
		try {
			com.inq.stage.Resize.setResizable();
		}
		catch( $e50 ) {
			if( js.Boot.__instanceof($e50,Error) ) {
				var e = $e50;
				null;
			} else throw($e50);
		}
	}
	Application.application.setInitialSize();
	var isNewApplicationControllerCreated = null == this.applicationController;
	if(isNewApplicationControllerCreated) {
		this.applicationController = new com.inq.flash.client.control.ApplicationController();
	}
	com.inq.flash.client.chatskins.SkinControl.setApplicationController(this.applicationController);
	com.inq.flash.client.chatskins.SkinControl.bInitialized = false;
	com.inq.flash.client.chatskins.SkinControl.InitializeGlue();
	this.applicationController.initializeAutomatonMode();
	if(isNewApplicationControllerCreated) {
		{
			var _g = 0, _g1 = this.onApplicationControllerInitializedHandlers;
			while(_g < _g1.length) {
				var handler = _g1[_g];
				++_g;
				handler();
			}
		}
	}
}
Application.prototype.screen = null;
Application.prototype.sendDTEvent = function(eventName,data) {
	if(this.applicationController != null) {
		this.applicationController.sendDTEvent(eventName,data);
	}
}
Application.prototype.setInitialSize = function() {
	var __height;
	var __width;
	var __win = js.Lib.window;
	var __winParent = window.parent;
	if(com.inq.utils.Capabilities.isPhone()) {
		var vp = com.inq.utils.Capabilities.getViewport();
		__width = vp.w;
		__height = vp.h;
	}
	else {
		__width = com.inq.flash.client.control.FlashPeer.getSkinWidth();
		__height = com.inq.flash.client.control.FlashPeer.getSkinHeight() + com.inq.flash.client.control.FlashPeer.getTitleBarHeight();
	}
	__width = com.inq.flash.client.control.PersistenceManager.GetValue("w",__width);
	__height = com.inq.flash.client.control.PersistenceManager.GetValue("h",__height);
	var iframe = js.Lib.window.frameElement;
	if(__winParent.name == "_inqPersistentChat") {
		Application.isPersistent = true;
		this.stg.style.height = "100%";
		this.stg.style.width = "100%";
		this.stg.style.left = "0px";
		this.stg.style.top = "0px";
		iframe.style.width = "100%";
		iframe.style.height = "100%";
		this.titlebar.setVisible(false);
		this.resizeCorner.setVisible(false);
		this.styles.width = this.stg.clientWidth;
		this.styles.height = this.stg.clientHeight;
		window.parent.document.body.style.cssText += ";overflow: hidden;overflow-Y:hidden;overflow-X:hidden;margin:0px;padding:0px";
		var el = ((window.document.all)?window.frameElement:window.parent);
		iframe._resizeTimer = -1;
		var resizeHandler = function(evnt) {
			var win = window.parent;
			var doc = window.parent.document;
			var frm = window.frameElement;
			var newWidth = frm["clientWidth"];
			var newHeight = frm["clientHeight"];
			if(newWidth != frm._oldWidth || newHeight != frm._oldHeight) {
				if(frm._resizeTimer != -1) window.clearTimeout(frm._resizeTimer);
				frm._resizeTimer = window.setTimeout(function() {
					Application.resizePersistentFrame();
				},50);
			}
		}
		com.inq.utils.Capabilities.BindListener(el,"resize",resizeHandler);
		iframe._oldWidth = iframe.offsetWidth;
		iframe._oldHeight = iframe.offsetHeight;
		iframe._resizeTimer = window.setTimeout(function() {
			Application.resizePersistentFrame();
		},50);
		Application.ResizeStage(window.top.clientHeight,window.top.clientHeight);
		this.resize();
		return;
	}
	else {
		this.stg.style.height = __height + "px";
		this.stg.style.width = __width + "px";
		var position = this.getInitialChatLocation();
		position.x = com.inq.flash.client.control.PersistenceManager.GetValue("l",position.x);
		position.y = com.inq.flash.client.control.PersistenceManager.GetValue("t",position.y);
		this.area.x = position.x = Application.FixAbsoluteX(position.x,__width);
		this.area.y = position.y = Application.FixAbsoluteY(position.y,__height);
		this.stg.style.left = position.x + "px";
		this.stg.style.top = position.y + "px";
		iframe.style.width = this.stg.style.width;
		iframe.style.height = this.stg.style.height;
		Application.MoveSizeDiv2Stage(__width,__height,position.x,position.y);
	}
	__height = Std.parseInt(this.stg.style.height);
	__width = Std.parseInt(this.stg.style.width);
	this.styles.height = "" + __height;
	this.styles.width = "" + __width;
	this.resize();
}
Application.prototype.setVisible = function(value) {
	com.inq.ui.SkinLoader.prototype.setVisible.apply(this,[value]);
	com.inq.ui.Stage.getInstance().setVisible(value);
	this.resizeCorner.setVisible(value);
	this.titlebar.setVisible(value);
}
Application.prototype.skinpath = null;
Application.prototype.stage = null;
Application.prototype.stg = null;
Application.prototype.successSkinLoad = function(event) {
	var sMxml = com.inq.utils.StringUtil.htmlDecode(this.loaderSkin.data);
	this._draw(sMxml);
	this.run();
}
Application.prototype.titlebar = null;
Application.prototype.updateXFrameFromBizRule = function(layerID,url,channelID) {
	var thisApplicationController = this.applicationController;
	this.whenApplicationControllerInitialized(function() {
		thisApplicationController.updateXFrameFromBizRule(layerID,url,channelID);
	});
}
Application.prototype.url = null;
Application.prototype.visible = null;
Application.prototype.whenApplicationControllerInitialized = function(handler) {
	if(this.applicationController == null) {
		this.onApplicationControllerInitializedHandlers.push(handler);
	}
	else {
		handler();
	}
}
Application.prototype.__class__ = Application;
com.inq.ui.AbstractTextInput = function(_id) { if( _id === $_ ) return; {
	com.inq.ui.Container.apply(this,[_id]);
	this.maxChars = 0;
	if("" == window.document.body.style.fontFamily) {
		window.document.body.style.fontFamily = ((Application.application.skinConfig["sFont"])?Application.application.skinConfig["sFont"]:"Verdana, Arial, Helvetica");
		window.document.body.style.fontSize = ((Application.application.skinConfig["pointSize"])?(Application.application.skinConfig["pointSize"] + "pt"):"10pt");
	}
}}
com.inq.ui.AbstractTextInput.__name__ = ["com","inq","ui","AbstractTextInput"];
com.inq.ui.AbstractTextInput.__super__ = com.inq.ui.Container;
for(var k in com.inq.ui.Container.prototype ) com.inq.ui.AbstractTextInput.prototype[k] = com.inq.ui.Container.prototype[k];
com.inq.ui.AbstractTextInput.isViewable = function(input) {
	var p = input;
	while(p != null) {
		try {
			if(p["style"] != null && (p.style.display == "none" || p.style.visible == "false")) {
				return false;
			}
		}
		catch( $e51 ) {
			{
				var e = $e51;
				null;
			}
		}
		p = p.parentNode;
	}
	return true;
}
com.inq.ui.AbstractTextInput.prototype._doClick = function(ev) {
	var win = window;
	var kev = com.inq.events.MouseEvent.CLICK;
	this.setFocus();
	if(this._introduction != "" && this._input.value == this._introduction) this._input.value = "";
	try {
		var el = this.eventListeners[kev];
		if(null != el) {
			var me = new com.inq.events.MouseEvent(kev);
			return el(me);
		}
		return true;
	}
	catch( $e52 ) {
		if( js.Boot.__instanceof($e52,Error) ) {
			var e = $e52;
			null;
		} else throw($e52);
	}
	return true;
}
com.inq.ui.AbstractTextInput.prototype._enable = function(val) {
	if(this._div.childNodes && this._div.childNodes.length > 0) {
		{
			var _g1 = 0, _g = this._div.childNodes.length;
			while(_g1 < _g) {
				var x = _g1++;
				try {
					this._div.childNodes[x].disabled = val;
				}
				catch( $e53 ) {
					{
						var error = $e53;
						null;
					}
				}
			}
		}
	}
}
com.inq.ui.AbstractTextInput.prototype._getInput = function() {
	return this._input.value;
}
com.inq.ui.AbstractTextInput.prototype._getSelectedText = function() {
	if(this._input["selectionStart"] != null && this._input["selectionEnd"] != null) {
		return (this._input.value).substring(this._input.selectionStart,this._input.selectionEnd);
	}
	else if(this._input["createTextRange"] != null && this.document["selection"] != null && this.document.selection["createRange"]) {
		var selectionRng = this.document.selection.createRange();
		var inputRng = this._input.createTextRange();
		if(inputRng != null && selectionRng != null && selectionRng.text.length > 0) {
			var isInRange = inputRng.text.indexOf(selectionRng.text) >= 0;
			if(isInRange) return (selectionRng.text);
		}
	}
	return "";
}
com.inq.ui.AbstractTextInput.prototype._input = null;
com.inq.ui.AbstractTextInput.prototype._introduction = null;
com.inq.ui.AbstractTextInput.prototype._isDisable = function() {
	var isDisabled = true;
	if(this._div.childNodes && this._div.childNodes.length > 0) {
		{
			var _g1 = 0, _g = this._div.childNodes.length;
			while(_g1 < _g) {
				var x = _g1++;
				try {
					isDisabled = isDisabled && !!this._div.childNodes[x].disabled;
				}
				catch( $e54 ) {
					{
						var error = $e54;
						null;
					}
				}
			}
		}
	}
	return isDisabled;
}
com.inq.ui.AbstractTextInput.prototype._isVisible = function() {
	var p = this._input;
	while(p) {
		if(p.style.display.toLowerCase() == "none") return false;
		p = p.parentNode;
		if(p.tagName.toUpperCase() == "BODY") break;
	}
	return true;
}
com.inq.ui.AbstractTextInput.prototype._onChange = function(ev) {
	return this.validateAndFormat();
}
com.inq.ui.AbstractTextInput.prototype._onFocus = function(ev,kev) {
	var el = this.eventListeners[kev];
	if(null != el) {
		var kbe = new com.inq.events.KeyboardEvent(kev);
		if(null != ev) kbe.keyCode = ev.which;
		else kbe.keyCode = js.Lib.window.event.keyCode;
		return el(kbe);
	}
	return true;
}
com.inq.ui.AbstractTextInput.prototype._onFocusIn = function(ev) {
	if(this._introduction != "" && this._input.value == this._introduction) this._input.select();
	try {
		var ret = this._onFocus(ev,com.inq.events.FocusEvent.FOCUS_IN);
		return ret;
	}
	catch( $e55 ) {
		if( js.Boot.__instanceof($e55,Error) ) {
			var e = $e55;
			null;
		} else throw($e55);
	}
	return true;
}
com.inq.ui.AbstractTextInput.prototype._onFocusOut = function(ev) {
	try {
		if(!this.validateAndFormat()) {
			return false;
		}
		return this._onFocus(ev,com.inq.events.FocusEvent.FOCUS_OUT);
	}
	catch( $e56 ) {
		if( js.Boot.__instanceof($e56,Error) ) {
			var e = $e56;
			null;
		} else throw($e56);
	}
	return true;
}
com.inq.ui.AbstractTextInput.prototype._onKey = function(ev,kev) {
	var el = this.eventListeners[kev];
	var kbe = new com.inq.events.KeyboardEvent(kev);
	if(null != ev) kbe.keyCode = ev.which;
	else kbe.keyCode = js.Lib.window.event.keyCode;
	if(null != el) return el(kbe);
	return true;
}
com.inq.ui.AbstractTextInput.prototype._onKeyDown = function(ev) {
	var ret = true;
	try {
		ret = this._onKey(ev,com.inq.events.KeyboardEvent.KEY_DOWN);
		return ret;
	}
	catch( $e57 ) {
		if( js.Boot.__instanceof($e57,Error) ) {
			var e = $e57;
			null;
		} else throw($e57);
	}
	return true;
}
com.inq.ui.AbstractTextInput.prototype._onKeyPress = function(ev) {
	var keyCode;
	var cntl = ((((null != ev)?ev.ctrlKey:window.event.ctrlKey))?true:false);
	var shift = ((((null != ev)?ev.shiftKey:window.event.shiftKey))?true:false);
	var alt = ((((null != ev)?ev.altKey:window.event.altKey))?true:false);
	keyCode = ((null != ev)?keyCode = ev.which:window.event.keyCode);
	var el = this.eventListeners[com.inq.events.KeyboardEvent.KEY_PRESS];
	var kbe = new com.inq.events.KeyboardEvent(com.inq.events.KeyboardEvent.KEY_PRESS);
	kbe.ctrlKey = cntl;
	kbe.charCode = (keyCode);
	kbe.altKey = alt;
	kbe.shiftKey = shift;
	if(this._introduction != "" && this._input.value == this._introduction) this._input.value = "";
	if(cntl || keyCode < 32) {
		if(null != el) return el(kbe);
		return true;
	}
	var sMaxChars = this.getStyle("maxChars");
	this.maxChars = ((sMaxChars != null)?Std.parseInt(sMaxChars):0);
	if(this.maxChars > 0) {
		var len = this._input.value.length - this._getSelectedText().length;
		if(len >= this.maxChars) {
			return false;
		}
	}
	var sRestrict = this.getStyle("restrict");
	if(sRestrict != null) {
		var character = String.fromCharCode(keyCode);
		if(sRestrict.indexOf(character) < 0) return false;
	}
	if(null != el) return el(kbe);
	return true;
}
com.inq.ui.AbstractTextInput.prototype._onKeyUp = function(ev) {
	try {
		return this._onKey(ev,com.inq.events.KeyboardEvent.KEY_UP);
	}
	catch( $e58 ) {
		if( js.Boot.__instanceof($e58,Error) ) {
			var e = $e58;
			null;
		} else throw($e58);
	}
	return true;
}
com.inq.ui.AbstractTextInput.prototype._setInput = function(val) {
	this._input.value = val;
}
com.inq.ui.AbstractTextInput.prototype.applyFilter = function(text) {
	var newText = "";
	var curChar;
	var sRestrict = this.getStyle("restrict");
	if(sRestrict != null) {
		var ix;
		{
			var _g1 = 0, _g = text.length;
			while(_g1 < _g) {
				var ix1 = _g1++;
				curChar = text.substr(ix1,1);
				if(sRestrict.indexOf(curChar) >= 0) newText += curChar;
			}
		}
	}
	else newText = text;
	var sMaxChars = this.getStyle("maxChars");
	this.maxChars = ((sMaxChars != null)?Std.parseInt(sMaxChars):0);
	if(this.maxChars > 0 && this.maxChars < newText.length) newText = newText.substr(0,this.maxChars);
	return newText;
}
com.inq.ui.AbstractTextInput.prototype.disabled = null;
com.inq.ui.AbstractTextInput.prototype.getCursorPosition = function() {
	if(this._input["createTextRange"] != null && this.document["selection"] != null && this.document.selection["createRange"]) {
		var selectionRng = this.document.selection.createRange().duplicate();
		selectionRng.moveEnd("character",StringTools.trim(this._getInput()).length);
		if(selectionRng.text == "") return StringTools.trim(this._getInput()).length;
		return StringTools.trim(this._getInput()).lastIndexOf(selectionRng.text);
	}
	else return this._input["selectionStart"];
}
com.inq.ui.AbstractTextInput.prototype.getInput = function() {
	return this._input;
}
com.inq.ui.AbstractTextInput.prototype.maxChars = null;
com.inq.ui.AbstractTextInput.prototype.select = function() {
	null;
}
com.inq.ui.AbstractTextInput.prototype.setFocus = function() {
	if(com.inq.ui.AbstractTextInput.isViewable(this._input) && !this._isDisable()) {
		try {
			this._input.focus();
			window.setTimeout("try{document.getElementById(\"" + this._input.id + "\").focus();}catch(e){}",1);
		}
		catch( $e59 ) {
			if( js.Boot.__instanceof($e59,Error) ) {
				var e = $e59;
				null;
			} else throw($e59);
		}
	}
}
com.inq.ui.AbstractTextInput.prototype.setID = function(val) {
	com.inq.ui.Container.prototype.setID.apply(this,[val]);
	if(this._input != null) {
		this._input.id = this._div.id + "_input";
	}
}
com.inq.ui.AbstractTextInput.prototype.setupInput = function(input) {
	this._input = input;
	this._input.container = this;
	this._input.value = "";
	this._input.onkeypress = $closure(this,"_onKeyPress");
	this._input.onkeyup = $closure(this,"_onKeyUp");
	this._input.onkeydown = $closure(this,"_onKeyDown");
	this._input.onblur = $closure(this,"_onFocusOut");
	this._input.onfocus = $closure(this,"_onFocusIn");
	this._input.onchange = $closure(this,"_onChange");
	this._div.onclick = $closure(this,"_doClick");
	this._introduction = ((null != Application.application.skinConfig["sIntroduction"])?Application.application.skinConfig["sIntroduction"]:"");
}
com.inq.ui.AbstractTextInput.prototype.text = null;
com.inq.ui.AbstractTextInput.prototype.validateAndFormat = function() {
	var text = this._input.value;
	var validate = this.getStyle("validate");
	if(validate == null) return true;
	var rex = new EReg(validate,"");
	if(text.length == 0) return true;
	text = this.applyFilter(text);
	if(text != this._input.value) this._input.value = text;
	if(!rex.match(text)) {
		this.setFocus();
		return false;
	}
	var format = this.getStyle("format");
	if(format == null) return true;
	text = rex.replace(text,format);
	this._input.value = text;
	return true;
}
com.inq.ui.AbstractTextInput.prototype.__class__ = com.inq.ui.AbstractTextInput;
com.inq.ui.TextInput = function(_id) { if( _id === $_ ) return; {
	com.inq.ui.AbstractTextInput.apply(this,[_id]);
	this._div.innerHTML = "<textarea style=\"height:100%;width:100%\"></textarea>";
	this.setupInput(this._div.getElementsByTagName("textarea")[0]);
	if(this._input) {
		this._input["container"] = this;
	}
}}
com.inq.ui.TextInput.__name__ = ["com","inq","ui","TextInput"];
com.inq.ui.TextInput.__super__ = com.inq.ui.AbstractTextInput;
for(var k in com.inq.ui.AbstractTextInput.prototype ) com.inq.ui.TextInput.prototype[k] = com.inq.ui.AbstractTextInput.prototype[k];
com.inq.ui.TextInput.getContainer = function(element) {
	return element["container"];
}
com.inq.ui.TextInput.prototype.__class__ = com.inq.ui.TextInput;
com.inq.ui.Text = function(text) { if( text === $_ ) return; {
	com.inq.ui.TextInput.apply(this,[]);
	if(text != null) this._div.innerHTML = text;
}}
com.inq.ui.Text.__name__ = ["com","inq","ui","Text"];
com.inq.ui.Text.__super__ = com.inq.ui.TextInput;
for(var k in com.inq.ui.TextInput.prototype ) com.inq.ui.Text.prototype[k] = com.inq.ui.TextInput.prototype[k];
com.inq.ui.Text.prototype.htmlText = null;
com.inq.ui.Text.prototype.setHtmlText = function(val) {
	this.htmlText = val;
	this._div.innerHTML = val;
}
com.inq.ui.Text.prototype.__class__ = com.inq.ui.Text;
com.inq.flash.messagingframework.connectionhandling = {}
com.inq.flash.messagingframework.connectionhandling.ApplicationConnectionEventHandler = function() { }
com.inq.flash.messagingframework.connectionhandling.ApplicationConnectionEventHandler.__name__ = ["com","inq","flash","messagingframework","connectionhandling","ApplicationConnectionEventHandler"];
com.inq.flash.messagingframework.connectionhandling.ApplicationConnectionEventHandler.prototype.allConnectionAttemptsFailed = null;
com.inq.flash.messagingframework.connectionhandling.ApplicationConnectionEventHandler.prototype.connectionFailedNeedRetryRequest = null;
com.inq.flash.messagingframework.connectionhandling.ApplicationConnectionEventHandler.prototype.connectionSuccessful = null;
com.inq.flash.messagingframework.connectionhandling.ApplicationConnectionEventHandler.prototype.__class__ = com.inq.flash.messagingframework.connectionhandling.ApplicationConnectionEventHandler;
com.inq.events.Event = function(type,bubbles,cancelable) { if( type === $_ ) return; {
	this.type = type;
}}
com.inq.events.Event.__name__ = ["com","inq","events","Event"];
com.inq.events.Event.ID3 = null;
com.inq.events.Event.ADDED_TO_STAGE = null;
com.inq.events.Event.REMOVED_FROM_STAGE = null;
com.inq.events.Event.prototype.bubbles = null;
com.inq.events.Event.prototype.cancelable = null;
com.inq.events.Event.prototype.currentTarget = null;
com.inq.events.Event.prototype.eventPhase = null;
com.inq.events.Event.prototype.target = null;
com.inq.events.Event.prototype.type = null;
com.inq.events.Event.prototype.__class__ = com.inq.events.Event;
com.inq.events.TextEvent = function(type,bubbles,cancelable,text) { if( type === $_ ) return; {
	com.inq.events.Event.apply(this,[type]);
}}
com.inq.events.TextEvent.__name__ = ["com","inq","events","TextEvent"];
com.inq.events.TextEvent.__super__ = com.inq.events.Event;
for(var k in com.inq.events.Event.prototype ) com.inq.events.TextEvent.prototype[k] = com.inq.events.Event.prototype[k];
com.inq.events.TextEvent.prototype.m_text = null;
com.inq.events.TextEvent.prototype.text = null;
com.inq.events.TextEvent.prototype.__class__ = com.inq.events.TextEvent;
com.inq.ui.Keyboard = function(p) { if( p === $_ ) return; {
	null;
}}
com.inq.ui.Keyboard.__name__ = ["com","inq","ui","Keyboard"];
com.inq.ui.Keyboard.capsLock = null;
com.inq.ui.Keyboard.isAccessible = function() {
	return true;
}
com.inq.ui.Keyboard.numLock = null;
com.inq.ui.Keyboard.prototype.__class__ = com.inq.ui.Keyboard;
List = function(p) { if( p === $_ ) return; {
	this.length = 0;
}}
List.__name__ = ["List"];
List.prototype.add = function(item) {
	var x = [item];
	if(this.h == null) this.h = x;
	else this.q[1] = x;
	this.q = x;
	this.length++;
}
List.prototype.clear = function() {
	this.h = null;
	this.q = null;
	this.length = 0;
}
List.prototype.filter = function(f) {
	var l2 = new List();
	var l = this.h;
	while(l != null) {
		var v = l[0];
		l = l[1];
		if(f(v)) l2.add(v);
	}
	return l2;
}
List.prototype.first = function() {
	return (this.h == null?null:this.h[0]);
}
List.prototype.h = null;
List.prototype.isEmpty = function() {
	return (this.h == null);
}
List.prototype.iterator = function() {
	return { h : this.h, hasNext : function() {
		return (this.h != null);
	}, next : function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		return x;
	}}
}
List.prototype.join = function(sep) {
	var s = new StringBuf();
	var first = true;
	var l = this.h;
	while(l != null) {
		if(first) first = false;
		else s.b[s.b.length] = sep;
		s.b[s.b.length] = l[0];
		l = l[1];
	}
	return s.b.join("");
}
List.prototype.last = function() {
	return (this.q == null?null:this.q[0]);
}
List.prototype.length = null;
List.prototype.map = function(f) {
	var b = new List();
	var l = this.h;
	while(l != null) {
		var v = l[0];
		l = l[1];
		b.add(f(v));
	}
	return b;
}
List.prototype.pop = function() {
	if(this.h == null) return null;
	var x = this.h[0];
	this.h = this.h[1];
	if(this.h == null) this.q = null;
	this.length--;
	return x;
}
List.prototype.push = function(item) {
	var x = [item,this.h];
	this.h = x;
	if(this.q == null) this.q = x;
	this.length++;
}
List.prototype.q = null;
List.prototype.remove = function(v) {
	var prev = null;
	var l = this.h;
	while(l != null) {
		if(l[0] == v) {
			if(prev == null) this.h = l[1];
			else prev[1] = l[1];
			if(this.q == l) this.q = prev;
			this.length--;
			return true;
		}
		prev = l;
		l = l[1];
	}
	return false;
}
List.prototype.toString = function() {
	var s = new StringBuf();
	var first = true;
	var l = this.h;
	s.b[s.b.length] = "{";
	while(l != null) {
		if(first) first = false;
		else s.b[s.b.length] = ", ";
		s.b[s.b.length] = l[0];
		l = l[1];
	}
	s.b[s.b.length] = "}";
	return s.b.join("");
}
List.prototype.__class__ = List;
com.inq.ui.TextArea = function(_id) { if( _id === $_ ) return; {
	com.inq.ui.Container.apply(this,[_id]);
	this._div.innerHTML = "<div id=\"cjr\"><span style=\"background-color:transparent;overflow: hidden; overflow-x: hidden; overflow-y: hidden;\"></span></div>";
	this._span = this._div.getElementsByTagName("SPAN")[0];
	this._ta = this._div.getElementsByTagName("DIV")[0];
	this._setHtmlText("");
	this.setStyle("backgroundColor","#FFFFFF");
	this._span.innerHTML = "";
	this._ta.style.cssText = "position:absolute; top:0px; left:0px; height:100%; width:100%; overflow:auto; overflow-x:hidden; overflow-y:auto; ";
	this.fixAndroidScrolling();
}}
com.inq.ui.TextArea.__name__ = ["com","inq","ui","TextArea"];
com.inq.ui.TextArea.__super__ = com.inq.ui.Container;
for(var k in com.inq.ui.Container.prototype ) com.inq.ui.TextArea.prototype[k] = com.inq.ui.Container.prototype[k];
com.inq.ui.TextArea.clone = function(source,id) {
	var ta = new com.inq.ui.TextArea();
	ta.setID(id);
	if(source._div != null) ta._div = source._div.cloneNode(true);
	ta._span = ta._div.getElementsByTagName("SPAN")[0];
	ta._ta = ta._div.getElementsByTagName("DIV")[0];
	var keyz = Reflect.fields(source.styles);
	{
		var _g1 = 0, _g = keyz.length;
		while(_g1 < _g) {
			var s = _g1++;
			var keyname = keyz[s];
			var datum = source.styles[keyname];
			ta.setStyle(keyname,datum);
		}
	}
	ta._ta.style.cssText = source._ta.style.cssText;
	var bi = ta.getStyle("backgroundImage");
	if(bi != null && bi != "") ta.setBackgroundImage(bi);
	ta._setHtmlText(source._getHtmlText());
	ta.fixAndroidScrolling();
	return ta;
}
com.inq.ui.TextArea.prototype._getHtmlText = function() {
	if(this._span == null) return "";
	return this._span.innerHTML;
}
com.inq.ui.TextArea.prototype._getStyleSheet = function() {
	return this._styleSheet;
}
com.inq.ui.TextArea.prototype._scrollPosition = null;
com.inq.ui.TextArea.prototype._setHtmlText = function(val) {
	this._span.innerHTML = val.split("\n").join("<br/>");
}
com.inq.ui.TextArea.prototype._setStyleSheet = function(val) {
	return;
}
com.inq.ui.TextArea.prototype._span = null;
com.inq.ui.TextArea.prototype._startPosition = null;
com.inq.ui.TextArea.prototype._styleSheet = null;
com.inq.ui.TextArea.prototype._ta = null;
com.inq.ui.TextArea.prototype._textarea = null;
com.inq.ui.TextArea.prototype.fixAndroidScrolling = function() {
	if(com.inq.utils.Capabilities.isAndroid()) {
		this._scrollPosition = new com.inq.utils.Point(0,0);
		this._startPosition = new com.inq.utils.Point(0,0);
		com.inq.utils.Capabilities.BindListener(this._ta,"touchstart",$closure(this,"onTouchStart"));
		com.inq.utils.Capabilities.BindListener(this._ta,"touchmove",$closure(this,"onTouchMove"));
		this._ta.style.height = "";
		this.setStyle("overflow","hidden");
		this.applyStyle();
	}
}
com.inq.ui.TextArea.prototype.forceRange = function(x,min,max) {
	var r = x;
	if(r > max) r = max;
	if(r < min) r = min;
	return r;
}
com.inq.ui.TextArea.prototype.getLocation = function(event) {
	var t = event.touches[0];
	var loc = new com.inq.utils.Point(t.screenX,t.screenY);
	return loc;
}
com.inq.ui.TextArea.prototype.getMaxScrollPosition = function() {
	var x = Std["int"](this._ta.offsetWidth - this._div.offsetWidth);
	var y = Std["int"](this._ta.offsetHeight - this._div.offsetHeight);
	if(x < 0) x = 0;
	if(y < 0) y = 0;
	var max = new com.inq.utils.Point(x,y);
	return max;
}
com.inq.ui.TextArea.prototype.htmlText = null;
com.inq.ui.TextArea.prototype.onTouchMove = function(event) {
	if(event.touches.length == 1) {
		var loc = this.getLocation(event);
		var diff = this._startPosition.diff(loc);
		this._scrollPosition.move(diff.x,(diff.y * -1));
		this.scrollToPosition(this._scrollPosition);
		this._startPosition = loc;
		event.preventDefault();
	}
}
com.inq.ui.TextArea.prototype.onTouchStart = function(event) {
	if(event.touches.length == 1) {
		this._startPosition = this.getLocation(event);
		event.preventDefault();
	}
}
com.inq.ui.TextArea.prototype.scrollToBottom = function() {
	if(com.inq.utils.Capabilities.isAndroid()) {
		this.scrollToPosition(this.getMaxScrollPosition());
	}
	else {
		var pos = Std.parseInt(this._ta.scrollHeight);
		this.scrollToPosition(new com.inq.utils.Point(0,pos));
	}
}
com.inq.ui.TextArea.prototype.scrollToPosition = function(p) {
	if(com.inq.utils.Capabilities.isAndroid()) {
		var max = this.getMaxScrollPosition();
		p.x = this.forceRange(p.x,0,max.x);
		p.y = this.forceRange(p.y,0,max.y);
		this._scrollPosition = p;
		var y = p.y * -1;
		this._ta.style["-webkit-transform"] = "translate(" + p.x + "px, " + y + "px)";
	}
	else {
		this._ta.scrollTop = p.y;
	}
}
com.inq.ui.TextArea.prototype.scrollToTop = function() {
	this.scrollToPosition(new com.inq.utils.Point(0,0));
}
com.inq.ui.TextArea.prototype.setID = function(val) {
	com.inq.ui.Container.prototype.setID.apply(this,[val]);
	if(this._span != null) this._span.id = this._div.id + "_span";
}
com.inq.ui.TextArea.prototype.styleSheet = null;
com.inq.ui.TextArea.prototype.__class__ = com.inq.ui.TextArea;
com.inq.flash.client.data.ChatCommunicationMessage = function(chat,text) { if( chat === $_ ) return; {
	com.inq.flash.messagingframework.Message.apply(this,[]);
	this.setMessageType(com.inq.flash.client.data.MessageFields.TYPE_CHAT_COMMUNICATION);
	this.addProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_ID,chat.getChatID());
	this.addProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_DATA,com.inq.flash.messagingframework.StringUtils.encodeStringForMessage(text));
	this.addProperty(com.inq.flash.client.data.MessageFields.KEY_RETURN_RECEIPT,"1");
}}
com.inq.flash.client.data.ChatCommunicationMessage.__name__ = ["com","inq","flash","client","data","ChatCommunicationMessage"];
com.inq.flash.client.data.ChatCommunicationMessage.__super__ = com.inq.flash.messagingframework.Message;
for(var k in com.inq.flash.messagingframework.Message.prototype ) com.inq.flash.client.data.ChatCommunicationMessage.prototype[k] = com.inq.flash.messagingframework.Message.prototype[k];
com.inq.flash.client.data.ChatCommunicationMessage.prototype.__class__ = com.inq.flash.client.data.ChatCommunicationMessage;
com.inq.flash.client.data.ChatCommunicationCobrowseMessage = function(chat,text) { if( chat === $_ ) return; {
	com.inq.flash.client.data.ChatCommunicationMessage.apply(this,[chat,text]);
	this.setMessageType(com.inq.flash.client.data.MessageFields.TYPE_CHAT_COBROWSE);
}}
com.inq.flash.client.data.ChatCommunicationCobrowseMessage.__name__ = ["com","inq","flash","client","data","ChatCommunicationCobrowseMessage"];
com.inq.flash.client.data.ChatCommunicationCobrowseMessage.__super__ = com.inq.flash.client.data.ChatCommunicationMessage;
for(var k in com.inq.flash.client.data.ChatCommunicationMessage.prototype ) com.inq.flash.client.data.ChatCommunicationCobrowseMessage.prototype[k] = com.inq.flash.client.data.ChatCommunicationMessage.prototype[k];
com.inq.flash.client.data.ChatCommunicationCobrowseMessage.prototype.__class__ = com.inq.flash.client.data.ChatCommunicationCobrowseMessage;
com.inq.flash.messagingframework.AbstractMessageHandler = function(messageType) { if( messageType === $_ ) return; {
	this.messageType = messageType;
}}
com.inq.flash.messagingframework.AbstractMessageHandler.__name__ = ["com","inq","flash","messagingframework","AbstractMessageHandler"];
com.inq.flash.messagingframework.AbstractMessageHandler.prototype.framework = null;
com.inq.flash.messagingframework.AbstractMessageHandler.prototype.getMessageType = function() {
	return this.messageType;
}
com.inq.flash.messagingframework.AbstractMessageHandler.prototype.getMessagingFramework = function() {
	return this.framework;
}
com.inq.flash.messagingframework.AbstractMessageHandler.prototype.messageType = null;
com.inq.flash.messagingframework.AbstractMessageHandler.prototype.processMessage = function(message) {
	null;
}
com.inq.flash.messagingframework.AbstractMessageHandler.prototype.setMessagingFramework = function(framework) {
	this.framework = framework;
}
com.inq.flash.messagingframework.AbstractMessageHandler.prototype.__class__ = com.inq.flash.messagingframework.AbstractMessageHandler;
com.inq.flash.client.control.messagehandlers = {}
com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler = function(messageType) { if( messageType === $_ ) return; {
	com.inq.flash.messagingframework.AbstractMessageHandler.apply(this,[messageType]);
}}
com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.__name__ = ["com","inq","flash","client","control","messagehandlers","ClientApplicationMessageHandler"];
com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.__super__ = com.inq.flash.messagingframework.AbstractMessageHandler;
for(var k in com.inq.flash.messagingframework.AbstractMessageHandler.prototype ) com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype[k] = com.inq.flash.messagingframework.AbstractMessageHandler.prototype[k];
com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype.controller = null;
com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype.getController = function() {
	return this.controller;
}
com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype.setController = function(controller) {
	this.controller = controller;
}
com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype.__class__ = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler;
com.inq.flash.client.control.messagehandlers.ChatroomOwnerTransferResponseMessageHandler = function(p) { if( p === $_ ) return; {
	com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.apply(this,[com.inq.flash.client.data.MessageFields.TYPE_OWNER_TRANSFER_RESPONSE]);
}}
com.inq.flash.client.control.messagehandlers.ChatroomOwnerTransferResponseMessageHandler.__name__ = ["com","inq","flash","client","control","messagehandlers","ChatroomOwnerTransferResponseMessageHandler"];
com.inq.flash.client.control.messagehandlers.ChatroomOwnerTransferResponseMessageHandler.__super__ = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler;
for(var k in com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype ) com.inq.flash.client.control.messagehandlers.ChatroomOwnerTransferResponseMessageHandler.prototype[k] = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype[k];
com.inq.flash.client.control.messagehandlers.ChatroomOwnerTransferResponseMessageHandler.prototype.processMessage = function(message) {
	var newOwner = StringTools.trim(message.getProperty("owner.id"));
	if(newOwner != null && newOwner != "undefined" && newOwner != "null") {
		var cobrowseEnabled = com.inq.flash.messagingframework.StringUtils.getBooleanValue(message.getProperty(com.inq.flash.client.data.MessageFields.KEY_COBROWSE_ENABLED));
		com.inq.flash.client.chatskins.SkinControl.setAgentID(newOwner,com.inq.utils.EventDataUtils.fromMessage(message),cobrowseEnabled,message.getProperty(com.inq.flash.client.data.MessageFields.KEY_BUSINESS_UNIT_ID));
	}
}
com.inq.flash.client.control.messagehandlers.ChatroomOwnerTransferResponseMessageHandler.prototype.__class__ = com.inq.flash.client.control.messagehandlers.ChatroomOwnerTransferResponseMessageHandler;
IntIter = function(min,max) { if( min === $_ ) return; {
	this.min = min;
	this.max = max;
}}
IntIter.__name__ = ["IntIter"];
IntIter.prototype.hasNext = function() {
	return this.min < this.max;
}
IntIter.prototype.max = null;
IntIter.prototype.min = null;
IntIter.prototype.next = function() {
	return this.min++;
}
IntIter.prototype.__class__ = IntIter;
com.inq.flash.client.chatskins = {}
com.inq.flash.client.chatskins.ChatTextFocusMonitor = function() { }
com.inq.flash.client.chatskins.ChatTextFocusMonitor.__name__ = ["com","inq","flash","client","chatskins","ChatTextFocusMonitor"];
com.inq.flash.client.chatskins.ChatTextFocusMonitor.iframe = null;
com.inq.flash.client.chatskins.ChatTextFocusMonitor.windowPosition = null;
com.inq.flash.client.chatskins.ChatTextFocusMonitor.chatArea = null;
com.inq.flash.client.chatskins.ChatTextFocusMonitor.hasFocus = null;
com.inq.flash.client.chatskins.ChatTextFocusMonitor.blurTimeout = null;
com.inq.flash.client.chatskins.ChatTextFocusMonitor.focusTimeout = null;
com.inq.flash.client.chatskins.ChatTextFocusMonitor.init = function() {
	if(!com.inq.utils.Capabilities.isMobile() || !com.inq.utils.Capabilities.isAutoZoom()) {
		return false;
	}
	com.inq.flash.client.chatskins.ChatTextFocusMonitor.iframe = window.parent.document.getElementById("inqChatStage");
	com.inq.flash.client.chatskins.ChatTextFocusMonitor.bindListeners();
	return true;
}
com.inq.flash.client.chatskins.ChatTextFocusMonitor.Close = function() {
	com.inq.flash.client.chatskins.ChatTextFocusMonitor.unbindListeners();
	if(com.inq.flash.client.chatskins.ChatTextFocusMonitor.blurTimeout != null) {
		window.clearTimeout(com.inq.flash.client.chatskins.ChatTextFocusMonitor.blurTimeout);
	}
	if(com.inq.flash.client.chatskins.ChatTextFocusMonitor.focusTimeout != null) {
		window.clearTimeout(com.inq.flash.client.chatskins.ChatTextFocusMonitor.focusTimeout);
	}
}
com.inq.flash.client.chatskins.ChatTextFocusMonitor.bindListeners = function() {
	var _g = 0, _g1 = ["txtInput","emailInput"];
	while(_g < _g1.length) {
		var n = _g1[_g];
		++_g;
		var container = Application.application[n];
		if(container == null) continue;
		var input = Application.application[n].getInput();
		if(input != null) {
			com.inq.utils.Capabilities.BindListener(input,"focus",$closure(com.inq.flash.client.chatskins.ChatTextFocusMonitor,"onFocus"));
			com.inq.utils.Capabilities.BindListener(input,"blur",$closure(com.inq.flash.client.chatskins.ChatTextFocusMonitor,"onBlur"));
		}
	}
}
com.inq.flash.client.chatskins.ChatTextFocusMonitor.unbindListeners = function() {
	var _g = 0, _g1 = ["txtInput","emailInput"];
	while(_g < _g1.length) {
		var n = _g1[_g];
		++_g;
		var container = Application.application[n];
		if(container == null) continue;
		var input = container.getInput();
		if(input != null) {
			com.inq.utils.Capabilities.UnbindListener(input,"focus",$closure(com.inq.flash.client.chatskins.ChatTextFocusMonitor,"onFocus"));
			com.inq.utils.Capabilities.UnbindListener(input,"blur",$closure(com.inq.flash.client.chatskins.ChatTextFocusMonitor,"onBlur"));
		}
	}
}
com.inq.flash.client.chatskins.ChatTextFocusMonitor.HasFocus = function() {
	return com.inq.flash.client.chatskins.ChatTextFocusMonitor.hasFocus;
}
com.inq.flash.client.chatskins.ChatTextFocusMonitor.onFocus = function() {
	com.inq.flash.client.chatskins.ChatTextFocusMonitor.hasFocus = true;
	com.inq.flash.client.chatskins.ChatTextFocusMonitor.windowPosition = com.inq.utils.Capabilities.getViewport();
	com.inq.flash.client.chatskins.ChatTextFocusMonitor.chatArea = Application.GetArea();
	if(com.inq.utils.Capabilities.isPhone() || (com.inq.utils.Capabilities.isIpad() && Application.IsPersistent())) {
		com.inq.flash.client.chatskins.ChatTextFocusMonitor.focusTimeout = window.setTimeout(function() {
			com.inq.flash.client.chatskins.ChatTextFocusMonitor.focusTimeout = null;
			if(com.inq.flash.client.chatskins.ChatTextFocusMonitor.hasFocus) {
				com.inq.flash.client.chatskins.ScrollMonitor.ScrollToBottom();
				Application.SetArea(com.inq.utils.Capabilities.getViewport());
			}
		},200);
	}
	return true;
}
com.inq.flash.client.chatskins.ChatTextFocusMonitor.onBlur = function(me) {
	com.inq.flash.client.chatskins.ChatTextFocusMonitor.hasFocus = false;
	com.inq.flash.client.chatskins.ChatTextFocusMonitor.blurTimeout = window.setTimeout(function() {
		com.inq.flash.client.chatskins.ChatTextFocusMonitor.blurTimeout = null;
		if(!com.inq.flash.client.control.MinimizeManager.minimized && !com.inq.flash.client.chatskins.ChatTextFocusMonitor.hasFocus) {
			if(Application.IsPersistent()) {
				com.inq.flash.client.chatskins.ScrollMonitor.ScrollToTop();
				Application.SetArea(com.inq.utils.Capabilities.getViewport());
			}
			else {
				com.inq.flash.client.chatskins.ScrollMonitor.ScrollTo(com.inq.flash.client.chatskins.ChatTextFocusMonitor.windowPosition.x,com.inq.flash.client.chatskins.ChatTextFocusMonitor.windowPosition.y);
				var vp = com.inq.utils.Capabilities.getViewport();
				vp.moveTo(com.inq.flash.client.chatskins.ChatTextFocusMonitor.chatArea.x,com.inq.flash.client.chatskins.ChatTextFocusMonitor.chatArea.y);
				var restoreArea = ((com.inq.utils.Capabilities.isPhone() || Application.IsPersistent())?vp:com.inq.flash.client.chatskins.ChatTextFocusMonitor.chatArea);
				Application.SetArea(restoreArea);
			}
		}
	},200);
	return true;
}
com.inq.flash.client.chatskins.ChatTextFocusMonitor.prototype.__class__ = com.inq.flash.client.chatskins.ChatTextFocusMonitor;
com.inq.flash.client.control.messagehandlers.ChatSystemMessageHandler = function(p) { if( p === $_ ) return; {
	com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.apply(this,[com.inq.flash.client.data.MessageFields.TYPE_CHAT_SYSTEM]);
}}
com.inq.flash.client.control.messagehandlers.ChatSystemMessageHandler.__name__ = ["com","inq","flash","client","control","messagehandlers","ChatSystemMessageHandler"];
com.inq.flash.client.control.messagehandlers.ChatSystemMessageHandler.__super__ = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler;
for(var k in com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype ) com.inq.flash.client.control.messagehandlers.ChatSystemMessageHandler.prototype[k] = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype[k];
com.inq.flash.client.control.messagehandlers.ChatSystemMessageHandler.prototype.processMessage = function(message) {
	var textToDisplay = message.getProperty("client.display.text");
	if(textToDisplay != null) {
		var displayText = StringTools.trim(textToDisplay);
		var messageParts = displayText.split("&nl;");
		{
			var _g1 = 0, _g = messageParts.length;
			while(_g1 < _g) {
				var i = _g1++;
				com.inq.flash.client.chatskins.SkinControl.AddTranscriptItemToChatWindow("",messageParts[i],com.inq.flash.client.chatskins.ChatTextArea.SYSTEM,-1);
			}
		}
	}
	else {
		var chatText = com.inq.flash.messagingframework.StringUtils.decodeStringFromMessage(message.getProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_DATA));
		com.inq.flash.client.chatskins.SkinControl.AddTranscriptItemToChatWindow("bob",chatText,com.inq.flash.client.chatskins.ChatTextArea.SYSTEM,-1);
	}
}
com.inq.flash.client.control.messagehandlers.ChatSystemMessageHandler.prototype.__class__ = com.inq.flash.client.control.messagehandlers.ChatSystemMessageHandler;
com.inq.flash.client.chatskins.FormMgr = function() { }
com.inq.flash.client.chatskins.FormMgr.__name__ = ["com","inq","flash","client","chatskins","FormMgr"];
com.inq.flash.client.chatskins.FormMgr.init = function() {
	return true;
}
com.inq.flash.client.chatskins.FormMgr.validateData = function(dataElement,regex) {
	var isValid = false;
	if(regex == null) {
		isValid = true;
	}
	else {
		var testReg = new EReg(regex,"");
		var dataType = "";
		try {
			dataType = StringTools.trim(dataElement.type.toLowerCase());
		}
		catch( $e60 ) {
			{
				var unknown = $e60;
				null;
			}
		}
		switch(dataType) {
		case "text":case "hidden":{
			try {
				isValid = testReg.match(StringTools.trim(dataElement.value));
			}
			catch( $e61 ) {
				{
					var unknown = $e61;
					{
						isValid = false;
					}
				}
			}
		}break;
		case "checkbox":case "radio":{
			null;
		}break;
		case "submit":case "reset":case "button":case "file":case "image":case "password":{
			null;
		}break;
		default:{
			null;
		}break;
		}
	}
	return isValid;
}
com.inq.flash.client.chatskins.FormMgr.enableDisableElements = function(formID,disable) {
	var el = window.document.getElementById(formID).getElementsByTagName("INPUT");
	{
		var _g1 = 0, _g = el.length;
		while(_g1 < _g) {
			var index = _g1++;
			el[index].disabled = disable;
		}
	}
}
com.inq.flash.client.chatskins.FormMgr.getNextFormElement = function(elmnt) {
	var el = com.inq.flash.client.chatskins.FormMgr.getFormFromElement(elmnt).getElementsByTagName("INPUT");
	var indx = 0;
	var strt = el.length;
	var nxtEl;
	{
		var _g1 = 0, _g = el.length;
		while(_g1 < _g) {
			var indx1 = _g1++;
			if(el[indx1] == elmnt) {
				strt = indx1;
				break;
			}
		}
	}
	while(++strt < el.length) {
		nxtEl = el[strt];
		if(nxtEl.type.toLowerCase() != "hidden") return nxtEl;
	}
	return null;
}
com.inq.flash.client.chatskins.FormMgr.getFormFromElement = function(elmnt) {
	var par = elmnt.parentNode;
	while(par != null) {
		if(par["tagName"] != null && par.tagName.toLowerCase() == "form") return par;
		par = par.parentNode;
	}
	return par;
}
com.inq.flash.client.chatskins.FormMgr.listen4ChangeElements = function(formID) {
	var el = com.inq.ui.Container.getElementById(formID).getElementsByTagName("INPUT");
	var index;
	try {
		{
			var _g1 = 0, _g = el.length;
			while(_g1 < _g) {
				var index1 = _g1++;
				var elmt = el[index1];
				if(elmt.type.toLowerCase() == "submit") {
					elmt.onchange = elmt.onkeypress = elmt.onclick = function(e) {
						var el1 = this;
						com.inq.flash.client.chatskins.SkinControl.cw.syncForms();
						com.inq.flash.client.chatskins.FormMgr.submit(com.inq.flash.client.chatskins.FormMgr.getFormFromElement(el1).id);
						return false;
					}
				}
				else {
					elmt.onkeydown = function(e) {
						var el1 = this;
						var enterKey = false;
						var evnt = ((e != null)?e:window.event);
						if(evnt != null) {
							enterKey = (evnt.altKey == false && evnt.shiftKey == false && evnt.ctrlKey == false && evnt.keyCode == 13);
						}
						if(enterKey) {
							var next = com.inq.flash.client.chatskins.FormMgr.getNextFormElement(el1);
							if(next == null || next.type.toLowerCase() == "submit") {
								com.inq.flash.client.chatskins.SkinControl.cw.syncForms();
								com.inq.flash.client.chatskins.FormMgr.submit(com.inq.flash.client.chatskins.FormMgr.getFormFromElement(el1).id);
							}
							else {
								com.inq.flash.client.chatskins.SkinControl.cw.syncForms();
								if(next.focus != null) next.focus();
							}
							return false;
						}
						return true;
					}
					elmt.onkeypress = elmt.onchange = elmt.onclick = function(e) {
						com.inq.flash.client.chatskins.SkinControl.cw.syncForms();
						return true;
					}
				}
			}
		}
	}
	catch( $e62 ) {
		if( js.Boot.__instanceof($e62,Error) ) {
			var e = $e62;
			{
				haxe.Log.trace("Error " + e,{ fileName : "FormMgr.hx", lineNumber : 152, className : "com.inq.flash.client.chatskins.FormMgr", methodName : "listen4ChangeElements"});
			}
		} else throw($e62);
	}
}
com.inq.flash.client.chatskins.FormMgr.disableAllElements = function(cw) {
	var el = com.inq.ui.Container.getElementById("chatWindow").getElementsByTagName("INPUT");
	{
		var _g1 = 0, _g = el.length;
		while(_g1 < _g) {
			var index = _g1++;
			el[index].disabled = true;
		}
	}
}
com.inq.flash.client.chatskins.FormMgr.submit = function(formID) {
	try {
		com.inq.flash.client.chatskins.BalloonNotifier.Clear();
		com.inq.flash.client.chatskins.FormMgr.enableDisableElements(formID,true);
		var formToSubmit = com.inq.ui.Container.getElementById(formID);
		var formElements = formToSubmit.elements;
		var formData = new StringBuf();
		var submitForm = true;
		{
			var _g1 = 0, _g = formElements.length;
			while(_g1 < _g) {
				var elmIndex = _g1++;
				var isValid = true;
				var elementName = StringTools.trim(formElements[elmIndex].name);
				if(elementName != null && elementName.length > 0 && elementName != "test" && elementName != "pass" && elementName != "fail") {
					if((elmIndex + 1) < formElements.length && formElements[elmIndex + 1].name == "test") {
						isValid = com.inq.flash.client.chatskins.FormMgr.validateData(formElements[elmIndex],formElements[elmIndex + 1].value);
					}
					if(isValid) {
						formData.b[formData.b.length] = formElements[elmIndex].name + "=" + StringTools.trim(formElements[elmIndex].value) + "&";
						if((elmIndex + 2) < formElements.length && formElements[elmIndex + 2].name == "pass") {
							com.inq.flash.client.chatskins.BalloonNotifier.Notify(formElements[elmIndex],formElements[elmIndex + 2].value);
						}
					}
					else {
						submitForm = false;
						if((elmIndex + 2) < formElements.length && formElements[elmIndex + 2].name == "fail") {
							com.inq.flash.client.chatskins.BalloonNotifier.Warn(formElements[elmIndex],formElements[elmIndex + 2].value);
						}
						else if((elmIndex + 3) < formElements.length && formElements[elmIndex + 3].name == "fail") {
							com.inq.flash.client.chatskins.BalloonNotifier.Warn(formElements[elmIndex],formElements[elmIndex + 3].value);
						}
					}
				}
			}
		}
		if(submitForm) {
			com.inq.flash.client.chatskins.FormMgr.enableDisableElements(formID,true);
			com.inq.flash.client.chatskins.SkinControl.cw.syncForms();
			var dataString = com.inq.flash.messagingframework.StringUtils.encodeStringForMessage(formData.b.join("").substr(0,formData.b.join("").length - 1));
			com.inq.flash.client.chatskins.SkinControl.getApplicationController().submitForm(formToSubmit.name,formToSubmit.id,dataString);
		}
		else {
			com.inq.flash.client.chatskins.FormMgr.enableDisableElements(formID,false);
		}
	}
	catch( $e63 ) {
		{
			var unknown = $e63;
			{
				haxe.Log.trace("Form submission FAILED" + unknown,{ fileName : "FormMgr.hx", lineNumber : 206, className : "com.inq.flash.client.chatskins.FormMgr", methodName : "submit"});
			}
		}
	}
	return false;
}
com.inq.flash.client.chatskins.FormMgr.updateFormFields = function(formData,formName,formId,cw) {
	var chatWindowDiv = com.inq.ui.Container.getElementById("chatWindow");
	var allForms = chatWindowDiv.getElementsByTagName("FORM");
	{
		var _g1 = 0, _g = allForms.length;
		while(_g1 < _g) {
			var aix = _g1++;
			var form = allForms[aix];
			if((form.id == formId && form.name == formName) || (form.id == null && form.name == formName)) {
				var rawFormValue = com.inq.flash.messagingframework.StringUtils.decodeStringFromMessage(formData);
				var formValues = rawFormValue.split("&");
				{
					var _g3 = 0, _g2 = formValues.length;
					while(_g3 < _g2) {
						var index = _g3++;
						var elementData = formValues[index].split("=");
						var formElements = form.elements;
						{
							var _g5 = 0, _g4 = formElements.length;
							while(_g5 < _g4) {
								var elmIndex = _g5++;
								if(formElements[elmIndex].name == elementData[0]) {
									formElements[elmIndex].setAttribute("value",elementData[1]);
									formElements[elmIndex].value = elementData[1];
									formElements[elmIndex].disabled = true;
								}
								else if(formElements[elmIndex].type.toLowerCase() == "submit") {
									formElements[elmIndex].disabled = true;
								}
							}
						}
					}
				}
			}
			cw.syncForms();
		}
	}
}
com.inq.flash.client.chatskins.FormMgr.updateForm = function(cw) {
	var chatWindowDiv = com.inq.ui.Container.getElementById("chatWindow");
	var allForms = chatWindowDiv.getElementsByTagName("FORM");
	if(allForms.length > 0) {
		var form = allForms[allForms.length - 1];
		if(form.id == null || form.id == "") {
			form.id = "form_" + com.inq.flash.client.chatskins.FormMgr.randomNumber++;
			form.setAttribute("id",form.id);
		}
		if(form.action == null || form.action == "") {
			form.action = "#";
			form.onsubmit = "return com.inq.flash.client.chatskins.FormMgr.submit('" + form.id + "');";
			form.setAttribute("action",form.action);
			form.setAttribute("onsubmit",form.onsubmit);
		}
		com.inq.flash.client.chatskins.FormMgr.listen4ChangeElements(form.id);
	}
	cw.syncForms();
}
com.inq.flash.client.chatskins.FormMgr.prototype.__class__ = com.inq.flash.client.chatskins.FormMgr;
Hash = function(p) { if( p === $_ ) return; {
	this.h = {}
	if(this.h.__proto__ != null) {
		this.h.__proto__ = null;
		delete(this.h.__proto__);
	}
	else null;
}}
Hash.__name__ = ["Hash"];
Hash.prototype.exists = function(key) {
	try {
		key = "$" + key;
		return this.hasOwnProperty.call(this.h,key);
	}
	catch( $e64 ) {
		{
			var e = $e64;
			{
				
				for(var i in this.h)
					if( i == key ) return true;
			;
				return false;
			}
		}
	}
}
Hash.prototype.get = function(key) {
	return this.h["$" + key];
}
Hash.prototype.h = null;
Hash.prototype.iterator = function() {
	return { ref : this.h, it : this.keys(), hasNext : function() {
		return this.it.hasNext();
	}, next : function() {
		var i = this.it.next();
		return this.ref["$" + i];
	}}
}
Hash.prototype.keys = function() {
	var a = new Array();
	
			for(var i in this.h)
				a.push(i.substr(1));
		;
	return a.iterator();
}
Hash.prototype.remove = function(key) {
	if(!this.exists(key)) return false;
	delete(this.h["$" + key]);
	return true;
}
Hash.prototype.set = function(key,value) {
	this.h["$" + key] = value;
}
Hash.prototype.toString = function() {
	var s = new StringBuf();
	s.b[s.b.length] = "{";
	var it = this.keys();
	{ var $it65 = it;
	while( $it65.hasNext() ) { var i = $it65.next();
	{
		s.b[s.b.length] = i;
		s.b[s.b.length] = " => ";
		s.b[s.b.length] = Std.string(this.get(i));
		if(it.hasNext()) s.b[s.b.length] = ", ";
	}
	}}
	s.b[s.b.length] = "}";
	return s.b.join("");
}
Hash.prototype.__class__ = Hash;
com.inq.events.FocusEvent = function(type,bubbles,cancelable,relatedObject,shiftKey,keyCode) { if( type === $_ ) return; {
	com.inq.events.Event.apply(this,[type]);
}}
com.inq.events.FocusEvent.__name__ = ["com","inq","events","FocusEvent"];
com.inq.events.FocusEvent.__super__ = com.inq.events.Event;
for(var k in com.inq.events.Event.prototype ) com.inq.events.FocusEvent.prototype[k] = com.inq.events.Event.prototype[k];
com.inq.events.FocusEvent.KEY_FOCUS_CHANGE = null;
com.inq.events.FocusEvent.MOUSE_FOCUS_CHANGE = null;
com.inq.events.FocusEvent.prototype.keyCode = null;
com.inq.events.FocusEvent.prototype.m_keyCode = null;
com.inq.events.FocusEvent.prototype.m_relatedObject = null;
com.inq.events.FocusEvent.prototype.m_shiftKey = null;
com.inq.events.FocusEvent.prototype.relatedObject = null;
com.inq.events.FocusEvent.prototype.shiftKey = null;
com.inq.events.FocusEvent.prototype.__class__ = com.inq.events.FocusEvent;
com.inq.flash.client.chatskins.OpenerScript = function(p) { if( p === $_ ) return; {
	this.reset();
}}
com.inq.flash.client.chatskins.OpenerScript.__name__ = ["com","inq","flash","client","chatskins","OpenerScript"];
com.inq.flash.client.chatskins.OpenerScript.resetOpenersStopped = function() {
	com.inq.flash.client.chatskins.OpenerScript.bOpenersStopped = false;
}
com.inq.flash.client.chatskins.OpenerScript.prototype._delay = null;
com.inq.flash.client.chatskins.OpenerScript.prototype.displayScript = function() {
	this.stopOpenersTimer();
	if(!com.inq.flash.client.chatskins.OpenerScript.bOpenersStopped) {
		this.displayScriptLine(false);
		this.startOpenersTimer();
	}
}
com.inq.flash.client.chatskins.OpenerScript.prototype.displayScriptLine = function(replay) {
	var agentName = com.inq.flash.client.control.FlashVars.getFlashVars().agentName;
	var useAgentAlias = (Application.application.skinConfig["useAgentAlias"]?Application.application.skinConfig["useAgentAlias"]:false);
	if(useAgentAlias == true) {
		var defaultAgentAlias = (Application.application.skinConfig["defaultAgentAlias"]?((Application.application.skinConfig["defaultAgentAlias"] == ""?"&nbsp;":Application.application.skinConfig["defaultAgentAlias"])):"&nbsp;");
		agentName = defaultAgentAlias;
	}
	var msg = this.scripts[this.scriptCur++];
	msg = com.inq.flash.client.chatskins.SkinControl.checkForGoToPersistentChatMsg(msg);
	com.inq.flash.client.chatskins.SkinControl.AddOpenerToChatWindow(agentName,msg,com.inq.flash.client.chatskins.ChatTextArea.AGENT,-1);
	com.inq.flash.client.control.PersistenceManager.SetValue("cntOS",this.scriptCur);
	var enqOpener = (!replay || com.inq.flash.client.control.PersistenceManager.GetValue("msgcnt",0) < 1);
	if(enqOpener && !com.inq.flash.client.chatskins.SkinControl.getApplicationController().isFirstMessageSent()) {
		com.inq.flash.client.chatskins.SkinControl.getApplicationController().enqueueOpenerText(msg,agentName);
	}
}
com.inq.flash.client.chatskins.OpenerScript.prototype.force = null;
com.inq.flash.client.chatskins.OpenerScript.prototype.getOpenerScripts = function() {
	if(com.inq.flash.client.control.FlashVars.getFlashVars().openerID == -1) return;
	var sTagServerURL = com.inq.flash.client.control.FlashVars.getFlashVars().tagServerBaseURL + "tagserver/scripts/getScript?js=yes&scriptID=" + com.inq.flash.client.control.FlashVars.getFlashVars().openerID;
	this.scriptLoader = new com.inq.net.URLLoader();
	var scriptRequest = new com.inq.net.URLRequest(sTagServerURL);
	this.scriptLoader.addEventListener(com.inq.events.IOErrorEvent.IO_ERROR,$closure(this,"openerScriptFailed"));
	this.scriptLoader.addEventListener(com.inq.events.Event.COMPLETE,$closure(this,"openerScriptsLoaded"));
	this.scriptLoader.load(scriptRequest);
}
com.inq.flash.client.chatskins.OpenerScript.prototype.intervalTimer = null;
com.inq.flash.client.chatskins.OpenerScript.prototype.openerScriptFailed = function(event) {
	return;
}
com.inq.flash.client.chatskins.OpenerScript.prototype.openerScriptsLoaded = function(event) {
	if(this.runOnce) return;
	this.runOnce = true;
	var sOpeners = this.scriptLoader.data;
	this.scriptLoader = null;
	if(sOpeners == null || sOpeners == "") {
		this.scripts = new Array();
		this.scripts[this.scriptCnt++] = "Hello";
		this.displayScript();
		return;
	}
	var scriptXML = Xml.parse(sOpeners);
	var it = scriptXML.firstElement().elements();
	var aOpeners = new Array();
	var i = 0;
	var x;
	{ var $it66 = it;
	while( $it66.hasNext() ) { var x1 = $it66.next();
	{
		var name = x1.getNodeName();
		if("script" == name) aOpeners[i++] = com.inq.utils.StringUtil.htmlDecode(x1.firstChild().toString());
	}
	}}
	{
		var _g1 = 0, _g = aOpeners.length;
		while(_g1 < _g) {
			var ix = _g1++;
			if(null == this.scripts) this.scripts = new Array();
			if(aOpeners[ix] != "") this.scripts[this.scriptCnt++] = aOpeners[ix];
		}
	}
	if(this.scriptCnt > 0) {
		var scriptShown = com.inq.flash.client.control.PersistenceManager.GetValue("cntOS",0);
		if(scriptShown <= 0 && this.force) {
			this.displayScript();
		}
		else {
			if(com.inq.flash.client.control.FlashVars.isContinued() && this.scriptCnt > 0) {
				while(scriptShown-- > 0) {
					this.displayScriptLine(true);
				}
				if(this.force || (com.inq.flash.client.control.PersistenceManager.GetValue("s",0) == 0)) {
					this.startOpenersTimer();
				}
			}
			else {
				this.displayScript();
			}
		}
	}
}
com.inq.flash.client.chatskins.OpenerScript.prototype.reset = function() {
	this.runOnce = false;
	this.force = false;
	this.scriptLoader = null;
	this.scripts = new Array();
	this.scriptCnt = 0;
	this.scriptCur = 0;
	this.intervalTimer = null;
	this._delay = 1000 * Std.parseInt("" + com.inq.flash.client.control.FlashVars.getFlashVars().openerDelay);
}
com.inq.flash.client.chatskins.OpenerScript.prototype.runOnce = null;
com.inq.flash.client.chatskins.OpenerScript.prototype.scriptCnt = null;
com.inq.flash.client.chatskins.OpenerScript.prototype.scriptCur = null;
com.inq.flash.client.chatskins.OpenerScript.prototype.scriptLoader = null;
com.inq.flash.client.chatskins.OpenerScript.prototype.scripts = null;
com.inq.flash.client.chatskins.OpenerScript.prototype.setDelay = function(dly) {
	this._delay = dly;
}
com.inq.flash.client.chatskins.OpenerScript.prototype.start = function(bForce) {
	if(bForce == null) bForce = false;
	if(bForce && -1 == com.inq.flash.client.control.PersistenceManager.GetValue("cntOS",-1)) {
		this.reset();
		this.force = bForce;
		this.getOpenerScripts();
		return;
	}
	if(com.inq.flash.client.chatskins.SkinControl.msgcntAtEntry > 0 && -1 == com.inq.flash.client.control.PersistenceManager.GetValue("cntOS",-1)) {
		return;
	}
	this.getOpenerScripts();
}
com.inq.flash.client.chatskins.OpenerScript.prototype.startOpenersTimer = function() {
	if(!com.inq.flash.client.chatskins.OpenerScript.bOpenersStopped && this.scriptCur < this.scriptCnt) {
		this.intervalTimer = new com.inq.utils.Timer(this._delay);
		this.intervalTimer.run = $closure(this,"displayScript");
	}
}
com.inq.flash.client.chatskins.OpenerScript.prototype.stop = function(bForce) {
	if(bForce == null) bForce = false;
	if(bForce) com.inq.flash.client.chatskins.OpenerScript.bOpenersStopped = true;
	if(this.intervalTimer == null) return;
	if(this.intervalTimer.stop != null) this.intervalTimer.stop();
	this.intervalTimer = null;
}
com.inq.flash.client.chatskins.OpenerScript.prototype.stopOpenersTimer = function() {
	if(this.intervalTimer != null) {
		this.intervalTimer.stop();
		this.intervalTimer = null;
	}
}
com.inq.flash.client.chatskins.OpenerScript.prototype.__class__ = com.inq.flash.client.chatskins.OpenerScript;
IntHash = function(p) { if( p === $_ ) return; {
	this.h = {}
	if(this.h.__proto__ != null) {
		this.h.__proto__ = null;
		delete(this.h.__proto__);
	}
	else null;
}}
IntHash.__name__ = ["IntHash"];
IntHash.prototype.exists = function(key) {
	return this.h[key] != null;
}
IntHash.prototype.get = function(key) {
	return this.h[key];
}
IntHash.prototype.h = null;
IntHash.prototype.iterator = function() {
	return { ref : this.h, it : this.keys(), hasNext : function() {
		return this.it.hasNext();
	}, next : function() {
		var i = this.it.next();
		return this.ref[i];
	}}
}
IntHash.prototype.keys = function() {
	var a = new Array();
	
			for( x in this.h )
				a.push(x);
		;
	return a.iterator();
}
IntHash.prototype.remove = function(key) {
	if(this.h[key] == null) return false;
	delete(this.h[key]);
	return true;
}
IntHash.prototype.set = function(key,value) {
	this.h[key] = value;
}
IntHash.prototype.toString = function() {
	var s = new StringBuf();
	s.b[s.b.length] = "{";
	var it = this.keys();
	{ var $it67 = it;
	while( $it67.hasNext() ) { var i = $it67.next();
	{
		s.b[s.b.length] = i;
		s.b[s.b.length] = " => ";
		s.b[s.b.length] = Std.string(this.get(i));
		if(it.hasNext()) s.b[s.b.length] = ", ";
	}
	}}
	s.b[s.b.length] = "}";
	return s.b.join("");
}
IntHash.prototype.__class__ = IntHash;
com.inq.ui.Screen = function(p) { if( p === $_ ) return; {
	com.inq.ui.Container.apply(this,[]);
}}
com.inq.ui.Screen.__name__ = ["com","inq","ui","Screen"];
com.inq.ui.Screen.__super__ = com.inq.ui.Container;
for(var k in com.inq.ui.Container.prototype ) com.inq.ui.Screen.prototype[k] = com.inq.ui.Container.prototype[k];
com.inq.ui.Screen.prototype.__class__ = com.inq.ui.Screen;
com.inq.stage = {}
com.inq.stage.IDragResize = function() { }
com.inq.stage.IDragResize.__name__ = ["com","inq","stage","IDragResize"];
com.inq.stage.IDragResize.prototype.getDefaultMax = null;
com.inq.stage.IDragResize.prototype.getDefaultMin = null;
com.inq.stage.IDragResize.prototype.setDragBorder = null;
com.inq.stage.IDragResize.prototype.setLeft = null;
com.inq.stage.IDragResize.prototype.setTop = null;
com.inq.stage.IDragResize.prototype.whenDone = null;
com.inq.stage.IDragResize.prototype.__class__ = com.inq.stage.IDragResize;
com.inq.flash.messagingframework.connectionhandling.ConnectionHandler = function() { }
com.inq.flash.messagingframework.connectionhandling.ConnectionHandler.__name__ = ["com","inq","flash","messagingframework","connectionhandling","ConnectionHandler"];
com.inq.flash.messagingframework.connectionhandling.ConnectionHandler.prototype.acknowledgeChatActive = null;
com.inq.flash.messagingframework.connectionhandling.ConnectionHandler.prototype.acknowledgePersistentActive = null;
com.inq.flash.messagingframework.connectionhandling.ConnectionHandler.prototype.connect = null;
com.inq.flash.messagingframework.connectionhandling.ConnectionHandler.prototype.disable = null;
com.inq.flash.messagingframework.connectionhandling.ConnectionHandler.prototype.disconnect = null;
com.inq.flash.messagingframework.connectionhandling.ConnectionHandler.prototype.enable = null;
com.inq.flash.messagingframework.connectionhandling.ConnectionHandler.prototype.getConnectionType = null;
com.inq.flash.messagingframework.connectionhandling.ConnectionHandler.prototype.isConnected = null;
com.inq.flash.messagingframework.connectionhandling.ConnectionHandler.prototype.sendBrowserMessage = null;
com.inq.flash.messagingframework.connectionhandling.ConnectionHandler.prototype.sendMessage = null;
com.inq.flash.messagingframework.connectionhandling.ConnectionHandler.prototype.setApplicationConnectionEventHandler = null;
com.inq.flash.messagingframework.connectionhandling.ConnectionHandler.prototype.setHost = null;
com.inq.flash.messagingframework.connectionhandling.ConnectionHandler.prototype.setMessageRouter = null;
com.inq.flash.messagingframework.connectionhandling.ConnectionHandler.prototype.setMessagingFramework = null;
com.inq.flash.messagingframework.connectionhandling.ConnectionHandler.prototype.setParam = null;
com.inq.flash.messagingframework.connectionhandling.ConnectionHandler.prototype.__class__ = com.inq.flash.messagingframework.connectionhandling.ConnectionHandler;
com.inq.ui.StyleSheet = function(p) { if( p === $_ ) return; {
	this.styleNames = { }
}}
com.inq.ui.StyleSheet.__name__ = ["com","inq","ui","StyleSheet"];
com.inq.ui.StyleSheet.prototype.clear = function() {
	this.styleNames = { }
}
com.inq.ui.StyleSheet.prototype.getStyle = function(styleName) {
	var style = this.styleNames[styleName];
	return style;
}
com.inq.ui.StyleSheet.prototype.parseCSS = function(CSSText) {
	null;
}
com.inq.ui.StyleSheet.prototype.setStyle = function(styleName,styleObject) {
	var s = "";
	if(!Std["is"](styleObject,String)) {
		var i;
		var keyz = Reflect.fields(styleObject);
		{
			var _g1 = 0, _g = keyz.length;
			while(_g1 < _g) {
				var i1 = _g1++;
				var name = keyz[i1];
				var fixedname = name;
				switch(name.toLowerCase()) {
				case "fontfamily":{
					fixedname = "font-family";
				}break;
				case "fontsize":{
					fixedname = "font-size";
				}break;
				case "fontweight":{
					fixedname = "font-weight";
				}break;
				case "fontstyle":{
					fixedname = "font-style";
				}break;
				case "fontsizeadjust":{
					fixedname = "font-size-adjust";
				}break;
				case "fontstretch":{
					fixedname = "font-stretch";
				}break;
				case "fontvariant":{
					fixedname = "font-variant";
				}break;
				case "lineheight":{
					fixedname = "line-height";
				}break;
				case "textalign":{
					fixedname = "text-align";
				}break;
				case "textdecoration":{
					fixedname = "text-decoration";
				}break;
				case "textindent":{
					fixedname = "text-indent";
				}break;
				case "textshadow":{
					fixedname = "text-shadow";
				}break;
				case "texttransform":{
					fixedname = "text-transform";
				}break;
				default:{
					fixedname = name;
				}break;
				}
				var valuz = styleObject[name];
				s += fixedname + ":" + valuz + ";";
			}
		}
	}
	else s = styleObject;
	this.styleNames[styleName] = s;
}
com.inq.ui.StyleSheet.prototype.styleNames = null;
com.inq.ui.StyleSheet.prototype.transform = function(formatObject) {
	return null;
}
com.inq.ui.StyleSheet.prototype.__class__ = com.inq.ui.StyleSheet;
com.inq.ui.Label = function(text) { if( text === $_ ) return; {
	com.inq.ui.TextInput.apply(this,[]);
	this._div.innerHTML = "<input type=\"text\" style=\"height:100%;width:100%\"></input>";
	this._input = this._div.getElementsByTagName("input")[0];
	this._input.disabled = true;
	if(text != null) this._input.value = text;
}}
com.inq.ui.Label.__name__ = ["com","inq","ui","Label"];
com.inq.ui.Label.__super__ = com.inq.ui.TextInput;
for(var k in com.inq.ui.TextInput.prototype ) com.inq.ui.Label.prototype[k] = com.inq.ui.TextInput.prototype[k];
com.inq.ui.Label.prototype.__class__ = com.inq.ui.Label;
StringTools = function() { }
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
}
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
}
StringTools.htmlEscape = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&amp;").join("&");
}
StringTools.startsWith = function(s,start) {
	return (s.length >= start.length && s.substr(0,start.length) == start);
}
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return (slen >= elen && s.substr(slen - elen,elen) == end);
}
StringTools.isSpace = function(s,pos) {
	var c = s.charCodeAt(pos);
	return (c >= 9 && c <= 13) || c == 32;
}
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) {
		r++;
	}
	if(r > 0) return s.substr(r,l - r);
	else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) {
		r++;
	}
	if(r > 0) {
		return s.substr(0,l - r);
	}
	else {
		return s;
	}
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
StringTools.rpad = function(s,c,l) {
	var sl = s.length;
	var cl = c.length;
	while(sl < l) {
		if(l - sl < cl) {
			s += c.substr(0,l - sl);
			sl = l;
		}
		else {
			s += c;
			sl += cl;
		}
	}
	return s;
}
StringTools.lpad = function(s,c,l) {
	var ns = "";
	var sl = s.length;
	if(sl >= l) return s;
	var cl = c.length;
	while(sl < l) {
		if(l - sl < cl) {
			ns += c.substr(0,l - sl);
			sl = l;
		}
		else {
			ns += c;
			sl += cl;
		}
	}
	return ns + s;
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
StringTools.hex = function(n,digits) {
	var neg = false;
	if(n < 0) {
		neg = true;
		n = -n;
	}
	var s = n.toString(16);
	s = s.toUpperCase();
	if(digits != null) while(s.length < digits) s = "0" + s;
	if(neg) s = "-" + s;
	return s;
}
StringTools.prototype.__class__ = StringTools;
haxe.io = {}
haxe.io.Bytes = function(length,b) { if( length === $_ ) return; {
	this.length = length;
	this.b = b;
}}
haxe.io.Bytes.__name__ = ["haxe","io","Bytes"];
haxe.io.Bytes.alloc = function(length) {
	var a = new Array();
	{
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			a.push(0);
		}
	}
	return new haxe.io.Bytes(length,a);
}
haxe.io.Bytes.ofString = function(s) {
	var a = new Array();
	{
		var _g1 = 0, _g = s.length;
		while(_g1 < _g) {
			var i = _g1++;
			var c = s["cca"](i);
			if(c <= 127) a.push(c);
			else if(c <= 2047) {
				a.push(192 | (c >> 6));
				a.push(128 | (c & 63));
			}
			else if(c <= 65535) {
				a.push(224 | (c >> 12));
				a.push(128 | ((c >> 6) & 63));
				a.push(128 | (c & 63));
			}
			else {
				a.push(240 | (c >> 18));
				a.push(128 | ((c >> 12) & 63));
				a.push(128 | ((c >> 6) & 63));
				a.push(128 | (c & 63));
			}
		}
	}
	return new haxe.io.Bytes(a.length,a);
}
haxe.io.Bytes.ofData = function(b) {
	return new haxe.io.Bytes(b.length,b);
}
haxe.io.Bytes.prototype.b = null;
haxe.io.Bytes.prototype.blit = function(pos,src,srcpos,len) {
	if(pos < 0 || srcpos < 0 || len < 0 || pos + len > this.length || srcpos + len > src.length) throw haxe.io.Error.OutsideBounds;
	var b1 = this.b;
	var b2 = src.b;
	if(b1 == b2 && pos > srcpos) {
		var i = len;
		while(i > 0) {
			i--;
			b1[i + pos] = b2[i + srcpos];
		}
		return;
	}
	{
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			b1[i + pos] = b2[i + srcpos];
		}
	}
}
haxe.io.Bytes.prototype.compare = function(other) {
	var b1 = this.b;
	var b2 = other.b;
	var len = ((this.length < other.length)?this.length:other.length);
	{
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			if(b1[i] != b2[i]) return b1[i] - b2[i];
		}
	}
	return this.length - other.length;
}
haxe.io.Bytes.prototype.get = function(pos) {
	return this.b[pos];
}
haxe.io.Bytes.prototype.getData = function() {
	return this.b;
}
haxe.io.Bytes.prototype.length = null;
haxe.io.Bytes.prototype.readString = function(pos,len) {
	if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
	var s = "";
	var b = this.b;
	var fcc = $closure(String,"fromCharCode");
	var i = pos;
	var max = pos + len;
	while(i < max) {
		var c = b[i++];
		if(c < 128) {
			if(c == 0) break;
			s += fcc(c);
		}
		else if(c < 224) s += fcc(((c & 63) << 6) | (b[i++] & 127));
		else if(c < 240) {
			var c2 = b[i++];
			s += fcc((((c & 31) << 12) | ((c2 & 127) << 6)) | (b[i++] & 127));
		}
		else {
			var c2 = b[i++];
			var c3 = b[i++];
			s += fcc(((((c & 15) << 18) | ((c2 & 127) << 12)) | ((c3 << 6) & 127)) | (b[i++] & 127));
		}
	}
	return s;
}
haxe.io.Bytes.prototype.set = function(pos,v) {
	this.b[pos] = v;
}
haxe.io.Bytes.prototype.sub = function(pos,len) {
	if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
	return new haxe.io.Bytes(len,this.b.slice(pos,pos + len));
}
haxe.io.Bytes.prototype.toString = function() {
	return this.readString(0,this.length);
}
haxe.io.Bytes.prototype.__class__ = haxe.io.Bytes;
com.inq.flash.client.data.ChatCommunicationQueueMessage = function(chat,text,alias) { if( chat === $_ ) return; {
	com.inq.flash.client.data.ChatCommunicationMessage.apply(this,[chat,text]);
	this.setMessageType(com.inq.flash.client.data.MessageFields.TYPE_CHAT_COMMUNICATION_QUEUE);
	this.addProperty(com.inq.flash.client.data.MessageFields.KEY_RETURN_RECEIPT,"1");
	if(alias != null) this.addProperty(com.inq.flash.client.data.MessageFields.KEY_AGENT_ALIAS,alias);
}}
com.inq.flash.client.data.ChatCommunicationQueueMessage.__name__ = ["com","inq","flash","client","data","ChatCommunicationQueueMessage"];
com.inq.flash.client.data.ChatCommunicationQueueMessage.__super__ = com.inq.flash.client.data.ChatCommunicationMessage;
for(var k in com.inq.flash.client.data.ChatCommunicationMessage.prototype ) com.inq.flash.client.data.ChatCommunicationQueueMessage.prototype[k] = com.inq.flash.client.data.ChatCommunicationMessage.prototype[k];
com.inq.flash.client.data.ChatCommunicationQueueMessage.prototype.__class__ = com.inq.flash.client.data.ChatCommunicationQueueMessage;
com.inq.utils.Dictionary = function(weakKeys) { if( weakKeys === $_ ) return; {
	null;
}}
com.inq.utils.Dictionary.__name__ = ["com","inq","utils","Dictionary"];
com.inq.utils.Dictionary.prototype.__class__ = com.inq.utils.Dictionary;
com.inq.flash.messagingframework.StringUtils = function() { }
com.inq.flash.messagingframework.StringUtils.__name__ = ["com","inq","flash","messagingframework","StringUtils"];
com.inq.flash.messagingframework.StringUtils.encodeStringForMessage = function(message) {
	var newStr = "";
	if(message == null) return message;
	if(message.length == 0) return message;
	var i = 0;
	while(i < message.length) {
		var chr = message.charAt(i);
		i++;
		if(chr == "=") newStr += "&eq;";
		else if(chr == "\n") newStr += "&nl;";
		else if(chr != "\r") newStr += chr;
	}
	return newStr;
}
com.inq.flash.messagingframework.StringUtils.decodeStringFromMessage = function(message) {
	if(message == null || message.length == 0) return message;
	return message.split("&eq;").join("=").split("&nl;").join("\n");
}
com.inq.flash.messagingframework.StringUtils.htmlDecode = function(text) {
	if(text == null || text.length == 0) return text;
	return text.split("&eq;").join("=").split("&lt;").join("<").split("&gt;").join(">").split("&amp;").join("&").split("&#034;").join("\"").split("&nl;").join("<br/>");
}
com.inq.flash.messagingframework.StringUtils.parseQueryString = function(str) {
	var _params = new com.inq.utils.Dictionary();
	try {
		if(str != null && str != "") {
			var params = str.split("&");
			var length = params.length;
			var i = 0;
			var index = -1;
			while(i < length) {
				var kvPair = params[i];
				i++;
				if((index = kvPair.indexOf("=")) > 0) {
					var key = kvPair.substr(0,index);
					var value = kvPair.substr(index + 1);
					_params[key] = value;
				}
			}
		}
	}
	catch( $e68 ) {
		if( js.Boot.__instanceof($e68,Error) ) {
			var e = $e68;
			null;
		} else throw($e68);
	}
	return _params;
}
com.inq.flash.messagingframework.StringUtils.getBooleanValue = function(value) {
	var returnValue = false;
	var tempValue = "";
	if(value != null) {
		try {
			tempValue = StringTools.trim(Std.string(value)).toLowerCase();
			if(tempValue == "true" || tempValue == "false") {
				if(tempValue == "true") {
					returnValue = true;
				}
			}
			else {
				var tempValueInt = Std.parseInt(tempValue);
				if(tempValueInt != 0) {
					returnValue = true;
				}
			}
		}
		catch( $e69 ) {
			{
				var e = $e69;
				{
					returnValue = false;
				}
			}
		}
	}
	return returnValue;
}
com.inq.flash.messagingframework.StringUtils.prototype.__class__ = com.inq.flash.messagingframework.StringUtils;
com.inq.flash.client.data.ChatActivityMessage = function(chat,activityType,text) { if( chat === $_ ) return; {
	com.inq.flash.messagingframework.Message.apply(this,[]);
	this.setMessageType(com.inq.flash.client.data.MessageFields.TYPE_CHAT_ACTIVITY);
	this.addProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_ID,chat.getChatID());
	this.addProperty(com.inq.flash.client.data.MessageFields.KEY_TYPE,activityType);
	if(text != null) this.addProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_DATA,com.inq.flash.messagingframework.StringUtils.encodeStringForMessage(text));
	this.addProperty(com.inq.flash.client.data.MessageFields.KEY_RETURN_RECEIPT,"1");
}}
com.inq.flash.client.data.ChatActivityMessage.__name__ = ["com","inq","flash","client","data","ChatActivityMessage"];
com.inq.flash.client.data.ChatActivityMessage.__super__ = com.inq.flash.messagingframework.Message;
for(var k in com.inq.flash.messagingframework.Message.prototype ) com.inq.flash.client.data.ChatActivityMessage.prototype[k] = com.inq.flash.messagingframework.Message.prototype[k];
com.inq.flash.client.data.ChatActivityMessage.prototype.__class__ = com.inq.flash.client.data.ChatActivityMessage;
haxe.io.BytesBuffer = function(p) { if( p === $_ ) return; {
	this.b = new Array();
}}
haxe.io.BytesBuffer.__name__ = ["haxe","io","BytesBuffer"];
haxe.io.BytesBuffer.prototype.add = function(src) {
	var b1 = this.b;
	var b2 = src.b;
	{
		var _g1 = 0, _g = src.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.b.push(b2[i]);
		}
	}
}
haxe.io.BytesBuffer.prototype.addByte = function($byte) {
	this.b.push($byte);
}
haxe.io.BytesBuffer.prototype.addBytes = function(src,pos,len) {
	if(pos < 0 || len < 0 || pos + len > src.length) throw haxe.io.Error.OutsideBounds;
	var b1 = this.b;
	var b2 = src.b;
	{
		var _g1 = pos, _g = pos + len;
		while(_g1 < _g) {
			var i = _g1++;
			this.b.push(b2[i]);
		}
	}
}
haxe.io.BytesBuffer.prototype.b = null;
haxe.io.BytesBuffer.prototype.getBytes = function() {
	var bytes = new haxe.io.Bytes(this.b.length,this.b);
	this.b = null;
	return bytes;
}
haxe.io.BytesBuffer.prototype.__class__ = haxe.io.BytesBuffer;
com.inq.events.ErrorEvent = function(type,bubbles,cancelable,text) { if( type === $_ ) return; {
	com.inq.events.TextEvent.apply(this,[type]);
}}
com.inq.events.ErrorEvent.__name__ = ["com","inq","events","ErrorEvent"];
com.inq.events.ErrorEvent.__super__ = com.inq.events.TextEvent;
for(var k in com.inq.events.TextEvent.prototype ) com.inq.events.ErrorEvent.prototype[k] = com.inq.events.TextEvent.prototype[k];
com.inq.events.ErrorEvent.prototype.__class__ = com.inq.events.ErrorEvent;
com.inq.flash.client.data.CallCommunicationMessage = function(chat,text) { if( chat === $_ ) return; {
	com.inq.flash.client.data.ChatCommunicationMessage.apply(this,[chat,text]);
	this.addProperty(com.inq.flash.client.data.MessageFields.KEY_CALL_ENABLED,com.inq.flash.messagingframework.StringUtils.encodeStringForMessage("true"));
}}
com.inq.flash.client.data.CallCommunicationMessage.__name__ = ["com","inq","flash","client","data","CallCommunicationMessage"];
com.inq.flash.client.data.CallCommunicationMessage.__super__ = com.inq.flash.client.data.ChatCommunicationMessage;
for(var k in com.inq.flash.client.data.ChatCommunicationMessage.prototype ) com.inq.flash.client.data.CallCommunicationMessage.prototype[k] = com.inq.flash.client.data.ChatCommunicationMessage.prototype[k];
com.inq.flash.client.data.CallCommunicationMessage.prototype.__class__ = com.inq.flash.client.data.CallCommunicationMessage;
com.inq.events.SecurityErrorEvent = function(type,bubbles,cancelable,text) { if( type === $_ ) return; {
	com.inq.events.ErrorEvent.apply(this,[type]);
}}
com.inq.events.SecurityErrorEvent.__name__ = ["com","inq","events","SecurityErrorEvent"];
com.inq.events.SecurityErrorEvent.__super__ = com.inq.events.ErrorEvent;
for(var k in com.inq.events.ErrorEvent.prototype ) com.inq.events.SecurityErrorEvent.prototype[k] = com.inq.events.ErrorEvent.prototype[k];
com.inq.events.SecurityErrorEvent.prototype.__class__ = com.inq.events.SecurityErrorEvent;
haxe.Resource = function() { }
haxe.Resource.__name__ = ["haxe","Resource"];
haxe.Resource.content = null;
haxe.Resource.listNames = function() {
	var names = new Array();
	{
		var _g = 0, _g1 = haxe.Resource.content;
		while(_g < _g1.length) {
			var x = _g1[_g];
			++_g;
			names.push(x.name);
		}
	}
	return names;
}
haxe.Resource.getString = function(name) {
	{
		var _g = 0, _g1 = haxe.Resource.content;
		while(_g < _g1.length) {
			var x = _g1[_g];
			++_g;
			if(x.name == name) {
				var b = haxe.Unserializer.run(x.data);
				return b.toString();
			}
		}
	}
	return null;
}
haxe.Resource.getBytes = function(name) {
	{
		var _g = 0, _g1 = haxe.Resource.content;
		while(_g < _g1.length) {
			var x = _g1[_g];
			++_g;
			if(x.name == name) {
				return haxe.Unserializer.run(x.data);
			}
		}
	}
	return null;
}
haxe.Resource.prototype.__class__ = haxe.Resource;
com.inq.flash.client.control.messagehandlers.ContinueTransitionHandler = function(p) { if( p === $_ ) return; {
	com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.apply(this,[com.inq.flash.client.data.MessageFields.TYPE_CONTINUE_TRANSITION]);
}}
com.inq.flash.client.control.messagehandlers.ContinueTransitionHandler.__name__ = ["com","inq","flash","client","control","messagehandlers","ContinueTransitionHandler"];
com.inq.flash.client.control.messagehandlers.ContinueTransitionHandler.__super__ = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler;
for(var k in com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype ) com.inq.flash.client.control.messagehandlers.ContinueTransitionHandler.prototype[k] = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype[k];
com.inq.flash.client.control.messagehandlers.ContinueTransitionHandler.prototype.processMessage = function(message) {
	this.getController().acknowledgeChatActive();
}
com.inq.flash.client.control.messagehandlers.ContinueTransitionHandler.prototype.__class__ = com.inq.flash.client.control.messagehandlers.ContinueTransitionHandler;
com.inq.flash.client.control.Incrementality = function() { }
com.inq.flash.client.control.Incrementality.__name__ = ["com","inq","flash","client","control","Incrementality"];
com.inq.flash.client.control.Incrementality.interacted = null;
com.inq.flash.client.control.Incrementality.init = function() {
	com.inq.flash.client.control.Incrementality.interacted = com.inq.flash.client.control.PersistenceManager.GetValue("ai",false);
	return true;
}
com.inq.flash.client.control.Incrementality.onEngaged = function() {
	if(com.inq.flash.client.control.FlashVars.getFlashVars().PersistentFrame) return;
	if(com.inq.flash.client.control.FlashVars.getFlashVars().brID == "") return;
	com.inq.flash.client.control.FlashPeer.onEngaged({ brID : com.inq.flash.client.control.FlashVars.getFlashVars().brID});
	com.inq.flash.client.chatskins.SkinControl.fireMxmlHandler("onEngaged");
	haxe.Log.trace("Incrementality.onEngaged",{ fileName : "Incrementality.hx", lineNumber : 29, className : "com.inq.flash.client.control.Incrementality", methodName : "onEngaged"});
}
com.inq.flash.client.control.Incrementality.onInteracted = function() {
	try {
		var bInteracted = false;
		try {
			bInteracted = com.inq.flash.client.control.Incrementality.interacted;
		}
		catch( $e70 ) {
			{
				var e = $e70;
				null;
			}
		}
		if(bInteracted) return;
		com.inq.flash.client.control.Incrementality.interacted = true;
		com.inq.flash.client.control.PersistenceManager.SetValue("ai",com.inq.flash.client.control.Incrementality.interacted);
		if(com.inq.flash.client.control.FlashVars.getFlashVars().PersistentFrame && !(com.inq.flash.client.chatskins.SkinControl.isClick2call() || com.inq.flash.client.control.FlashPeer.isV3C2CPersistent())) {
			return;
		}
		if(com.inq.flash.client.control.FlashVars.getFlashVars().brID == "") {
			return;
		}
		com.inq.flash.client.control.FlashPeer.onInteracted({ brID : com.inq.flash.client.control.FlashVars.getFlashVars().brID});
		com.inq.flash.client.chatskins.SkinControl.fireMxmlHandler("onInteracted");
		haxe.Log.trace("onInteracted",{ fileName : "Incrementality.hx", lineNumber : 51, className : "com.inq.flash.client.control.Incrementality", methodName : "onInteracted"});
	}
	catch( $e71 ) {
		{
			var e = $e71;
			{
				haxe.Log.trace("onInteracted failed: " + e,{ fileName : "Incrementality.hx", lineNumber : 53, className : "com.inq.flash.client.control.Incrementality", methodName : "onInteracted"});
			}
		}
	}
}
com.inq.flash.client.control.Incrementality.onAgentMsg = function() {
	if(com.inq.flash.client.control.FlashVars.getFlashVars().brID == "") return;
	com.inq.flash.client.control.FlashPeer.onAgentMsg({ brID : com.inq.flash.client.control.FlashVars.getFlashVars().brID});
	com.inq.flash.client.chatskins.SkinControl.fireMxmlHandler("onAgentMsg");
	haxe.Log.trace("onAgentMsg",{ fileName : "Incrementality.hx", lineNumber : 64, className : "com.inq.flash.client.control.Incrementality", methodName : "onAgentMsg"});
}
com.inq.flash.client.control.Incrementality.onCustomerMsg = function(chatData) {
	if(com.inq.flash.client.control.FlashVars.getFlashVars().brID == "") return;
	var eventData = { textLine : (chatData == null?null:chatData)}
	com.inq.flash.client.control.FlashPeer.onCustomerMsg(eventData);
	com.inq.flash.client.chatskins.SkinControl.fireMxmlHandler("onCustomerMsg");
	haxe.Log.trace("onCustomerMsg",{ fileName : "Incrementality.hx", lineNumber : 76, className : "com.inq.flash.client.control.Incrementality", methodName : "onCustomerMsg"});
}
com.inq.flash.client.control.Incrementality.onAssisted = function() {
	if(com.inq.flash.client.control.FlashVars.getFlashVars().brID == "") return;
	com.inq.flash.client.control.FlashPeer.onAssisted({ brID : com.inq.flash.client.control.FlashVars.getFlashVars().brID});
	com.inq.flash.client.chatskins.SkinControl.fireMxmlHandler("onAssisted");
	haxe.Log.trace("onAssisted",{ fileName : "Incrementality.hx", lineNumber : 86, className : "com.inq.flash.client.control.Incrementality", methodName : "onAssisted"});
}
com.inq.flash.client.control.Incrementality.prototype.__class__ = com.inq.flash.client.control.Incrementality;
js.JsXml__ = function(p) { if( p === $_ ) return; {
	null;
}}
js.JsXml__.__name__ = ["js","JsXml__"];
js.JsXml__.parse = function(str) {
	var rules = [js.JsXml__.enode,js.JsXml__.epcdata,js.JsXml__.eend,js.JsXml__.ecdata,js.JsXml__.edoctype,js.JsXml__.ecomment,js.JsXml__.eprolog];
	var nrules = rules.length;
	var current = Xml.createDocument();
	var stack = new List();
	while(str.length > 0) {
		var i = 0;
		try {
			while(i < nrules) {
				var r = rules[i];
				if(r.match(str)) {
					switch(i) {
					case 0:{
						var x = Xml.createElement(r.matched(1));
						current.addChild(x);
						str = r.matchedRight();
						while(js.JsXml__.eattribute.match(str)) {
							x.set(js.JsXml__.eattribute.matched(1),js.JsXml__.eattribute.matched(3));
							str = js.JsXml__.eattribute.matchedRight();
						}
						if(!js.JsXml__.eclose.match(str)) {
							i = nrules;
							throw "__break__";
						}
						if(js.JsXml__.eclose.matched(1) == ">") {
							stack.push(current);
							current = x;
						}
						str = js.JsXml__.eclose.matchedRight();
					}break;
					case 1:{
						var x = Xml.createPCData(r.matched(0));
						current.addChild(x);
						str = r.matchedRight();
					}break;
					case 2:{
						if(current._children != null && current._children.length == 0) {
							var e = Xml.createPCData("");
							current.addChild(e);
						}
						else null;
						if(r.matched(1) != current._nodeName || stack.isEmpty()) {
							i = nrules;
							throw "__break__";
						}
						else null;
						current = stack.pop();
						str = r.matchedRight();
					}break;
					case 3:{
						str = r.matchedRight();
						if(!js.JsXml__.ecdata_end.match(str)) throw "End of CDATA section not found";
						var x = Xml.createCData(js.JsXml__.ecdata_end.matchedLeft());
						current.addChild(x);
						str = js.JsXml__.ecdata_end.matchedRight();
					}break;
					case 4:{
						var pos = 0;
						var count = 0;
						var old = str;
						try {
							while(true) {
								if(!js.JsXml__.edoctype_elt.match(str)) throw "End of DOCTYPE section not found";
								var p = js.JsXml__.edoctype_elt.matchedPos();
								pos += p.pos + p.len;
								str = js.JsXml__.edoctype_elt.matchedRight();
								switch(js.JsXml__.edoctype_elt.matched(0)) {
								case "[":{
									count++;
								}break;
								case "]":{
									count--;
									if(count < 0) throw "Invalid ] found in DOCTYPE declaration";
								}break;
								default:{
									if(count == 0) throw "__break__";
								}break;
								}
							}
						} catch( e ) { if( e != "__break__" ) throw e; }
						var x = Xml.createDocType(old.substr(0,pos));
						current.addChild(x);
					}break;
					case 5:{
						if(!js.JsXml__.ecomment_end.match(str)) throw "Unclosed Comment";
						var p = js.JsXml__.ecomment_end.matchedPos();
						var x = Xml.createComment(str.substr(0,p.pos + p.len));
						current.addChild(x);
						str = js.JsXml__.ecomment_end.matchedRight();
					}break;
					case 6:{
						var x = Xml.createProlog(r.matched(0));
						current.addChild(x);
						str = r.matchedRight();
					}break;
					}
					throw "__break__";
				}
				i += 1;
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		if(i == nrules) {
			if(str.length > 10) throw ("Xml parse error : Unexpected " + str.substr(0,10) + "...");
			else throw ("Xml parse error : Unexpected " + str);
		}
	}
	return current;
}
js.JsXml__.createElement = function(name) {
	var r = new js.JsXml__();
	r.nodeType = Xml.Element;
	r._children = new Array();
	r._attributes = new Hash();
	r.setNodeName(name);
	return r;
}
js.JsXml__.createPCData = function(data) {
	var r = new js.JsXml__();
	r.nodeType = Xml.PCData;
	r.setNodeValue(data);
	return r;
}
js.JsXml__.createCData = function(data) {
	var r = new js.JsXml__();
	r.nodeType = Xml.CData;
	r.setNodeValue(data);
	return r;
}
js.JsXml__.createComment = function(data) {
	var r = new js.JsXml__();
	r.nodeType = Xml.Comment;
	r.setNodeValue(data);
	return r;
}
js.JsXml__.createDocType = function(data) {
	var r = new js.JsXml__();
	r.nodeType = Xml.DocType;
	r.setNodeValue(data);
	return r;
}
js.JsXml__.createProlog = function(data) {
	var r = new js.JsXml__();
	r.nodeType = Xml.Prolog;
	r.setNodeValue(data);
	return r;
}
js.JsXml__.createDocument = function() {
	var r = new js.JsXml__();
	r.nodeType = Xml.Document;
	r._children = new Array();
	return r;
}
js.JsXml__.prototype._attributes = null;
js.JsXml__.prototype._children = null;
js.JsXml__.prototype._nodeName = null;
js.JsXml__.prototype._nodeValue = null;
js.JsXml__.prototype._parent = null;
js.JsXml__.prototype.addChild = function(x) {
	if(this._children == null) throw "bad nodetype";
	if(x._parent != null) x._parent._children.remove(x);
	x._parent = this;
	this._children.push(x);
}
js.JsXml__.prototype.attributes = function() {
	if(this.nodeType != Xml.Element) throw "bad nodeType";
	return this._attributes.keys();
}
js.JsXml__.prototype.elements = function() {
	if(this._children == null) throw "bad nodetype";
	return { cur : 0, x : this._children, hasNext : function() {
		var k = this.cur;
		var l = this.x.length;
		while(k < l) {
			if(this.x[k].nodeType == Xml.Element) break;
			k += 1;
		}
		this.cur = k;
		return k < l;
	}, next : function() {
		var k = this.cur;
		var l = this.x.length;
		while(k < l) {
			var n = this.x[k];
			k += 1;
			if(n.nodeType == Xml.Element) {
				this.cur = k;
				return n;
			}
		}
		return null;
	}}
}
js.JsXml__.prototype.elementsNamed = function(name) {
	if(this._children == null) throw "bad nodetype";
	return { cur : 0, x : this._children, hasNext : function() {
		var k = this.cur;
		var l = this.x.length;
		while(k < l) {
			var n = this.x[k];
			if(n.nodeType == Xml.Element && n._nodeName == name) break;
			k++;
		}
		this.cur = k;
		return k < l;
	}, next : function() {
		var k = this.cur;
		var l = this.x.length;
		while(k < l) {
			var n = this.x[k];
			k++;
			if(n.nodeType == Xml.Element && n._nodeName == name) {
				this.cur = k;
				return n;
			}
		}
		return null;
	}}
}
js.JsXml__.prototype.exists = function(att) {
	if(this.nodeType != Xml.Element) throw "bad nodeType";
	return this._attributes.exists(att);
}
js.JsXml__.prototype.firstChild = function() {
	if(this._children == null) throw "bad nodetype";
	return this._children[0];
}
js.JsXml__.prototype.firstElement = function() {
	if(this._children == null) throw "bad nodetype";
	var cur = 0;
	var l = this._children.length;
	while(cur < l) {
		var n = this._children[cur];
		if(n.nodeType == Xml.Element) return n;
		cur++;
	}
	return null;
}
js.JsXml__.prototype.get = function(att) {
	if(this.nodeType != Xml.Element) throw "bad nodeType";
	return this._attributes.get(att);
}
js.JsXml__.prototype.getNodeName = function() {
	if(this.nodeType != Xml.Element) throw "bad nodeType";
	return this._nodeName;
}
js.JsXml__.prototype.getNodeValue = function() {
	if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
	return this._nodeValue;
}
js.JsXml__.prototype.getParent = function() {
	return this._parent;
}
js.JsXml__.prototype.insertChild = function(x,pos) {
	if(this._children == null) throw "bad nodetype";
	if(x._parent != null) x._parent._children.remove(x);
	x._parent = this;
	this._children.insert(pos,x);
}
js.JsXml__.prototype.iterator = function() {
	if(this._children == null) throw "bad nodetype";
	return { cur : 0, x : this._children, hasNext : function() {
		return this.cur < this.x.length;
	}, next : function() {
		return this.x[this.cur++];
	}}
}
js.JsXml__.prototype.nodeName = null;
js.JsXml__.prototype.nodeType = null;
js.JsXml__.prototype.nodeValue = null;
js.JsXml__.prototype.parent = null;
js.JsXml__.prototype.remove = function(att) {
	if(this.nodeType != Xml.Element) throw "bad nodeType";
	this._attributes.remove(att);
}
js.JsXml__.prototype.removeChild = function(x) {
	if(this._children == null) throw "bad nodetype";
	var b = this._children.remove(x);
	if(b) x._parent = null;
	return b;
}
js.JsXml__.prototype.set = function(att,value) {
	if(this.nodeType != Xml.Element) throw "bad nodeType";
	this._attributes.set(att,value);
}
js.JsXml__.prototype.setNodeName = function(n) {
	if(this.nodeType != Xml.Element) throw "bad nodeType";
	return this._nodeName = n;
}
js.JsXml__.prototype.setNodeValue = function(v) {
	if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
	return this._nodeValue = v;
}
js.JsXml__.prototype.toString = function() {
	if(this.nodeType == Xml.PCData) return this._nodeValue;
	if(this.nodeType == Xml.CData) return "<![CDATA[" + this._nodeValue + "]]>";
	if(this.nodeType == Xml.Comment || this.nodeType == Xml.DocType || this.nodeType == Xml.Prolog) return this._nodeValue;
	var s = new StringBuf();
	if(this.nodeType == Xml.Element) {
		s.b[s.b.length] = "<";
		s.b[s.b.length] = this._nodeName;
		{ var $it72 = this._attributes.keys();
		while( $it72.hasNext() ) { var k = $it72.next();
		{
			s.b[s.b.length] = " ";
			s.b[s.b.length] = k;
			s.b[s.b.length] = "=\"";
			s.b[s.b.length] = this._attributes.get(k);
			s.b[s.b.length] = "\"";
		}
		}}
		if(this._children.length == 0) {
			s.b[s.b.length] = "/>";
			return s.b.join("");
		}
		s.b[s.b.length] = ">";
	}
	{ var $it73 = this.iterator();
	while( $it73.hasNext() ) { var x = $it73.next();
	s.b[s.b.length] = x.toString();
	}}
	if(this.nodeType == Xml.Element) {
		s.b[s.b.length] = "</";
		s.b[s.b.length] = this._nodeName;
		s.b[s.b.length] = ">";
	}
	return s.b.join("");
}
js.JsXml__.prototype.__class__ = js.JsXml__;
com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestMessageHandler = function(p) { if( p === $_ ) return; {
	com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.apply(this,[com.inq.flash.client.data.MessageFields.TYPE_CHAT_AUTOMATON_REQUEST]);
	this.REPLACE_STRING = "_REPLACE_";
}}
com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestMessageHandler.__name__ = ["com","inq","flash","client","control","messagehandlers","ChatAutomatonRequestMessageHandler"];
com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestMessageHandler.__super__ = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler;
for(var k in com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype ) com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestMessageHandler.prototype[k] = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype[k];
com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestMessageHandler.onChange = function(name) {
	var elements = window.document.getElementsByName(name);
	if(elements.length > 0) {
		var el = elements[elements.length - 1];
		switch(el.type) {
		case "checkbox":{
			try {
				com.inq.flash.client.chatskins.SkinControl.getApplicationController().sendInputState(name,"CHECKED",((el.checked)?"CHECKED":"null"),true);
			}
			catch( $e74 ) {
				{
					var e = $e74;
					null;
				}
			}
		}break;
		}
	}
	return false;
}
com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestMessageHandler.prototype.REPLACE_STRING = null;
com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestMessageHandler.prototype.chat = null;
com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestMessageHandler.prototype.processMessage = function(message) {
	var agentName = message.getProperty(com.inq.flash.client.data.MessageFields.KEY_MSG_AGENT_ALIAS);
	com.inq.flash.client.control.Incrementality.onAgentMsg();
	var chatText = com.inq.flash.messagingframework.StringUtils.decodeStringFromMessage(message.getProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_AUTOMATON_DATA));
	var msgData = "";
	var divId = "automation_" + Date.now().getTime();
	msgData += "this, { divId: \"" + divId + "\"";
	if(message.getProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_AUTOMATON_TYPE) != null) {
		if(msgData.length > 0) {
			msgData += ", ";
		}
		msgData += "type : \"" + message.getProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_AUTOMATON_TYPE) + "\"";
	}
	var automatonId = message.getProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_AUTOMATON_ID);
	if(automatonId != null) {
		if(msgData.length > 0) {
			msgData += ", ";
		}
		msgData += "id : \"" + automatonId + "\"";
		var auxParams = com.inq.flash.client.control.FlashPeer.getSurveyAuxParams();
		if(auxParams == null) {
			auxParams = { }
		}
		auxParams["Auto"] = true;
		var automatonList = auxParams["automatonList"];
		var automatonArray;
		if(automatonList == null) {
			automatonArray = new Array();
		}
		else {
			automatonArray = automatonList.split(",");
		}
		var isIdPresent = false;
		{
			var _g = 0;
			while(_g < automatonArray.length) {
				var id = automatonArray[_g];
				++_g;
				if(id == automatonId) {
					isIdPresent = true;
					break;
				}
			}
		}
		if(!isIdPresent) {
			automatonArray[automatonArray.length] = automatonId;
		}
		auxParams["automatonList"] = automatonArray.join(",");
		com.inq.flash.client.control.FlashPeer.setSurveyAuxParams(auxParams);
	}
	if(message.getProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_AUTOMATON_STATE) != null) {
		if(msgData.length > 0) {
			msgData += ", ";
		}
		msgData += "state : \"" + message.getProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_AUTOMATON_STATE) + "\"";
	}
	if(message.getProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_AUTOMATON_DATA_MODEL) != null) {
		if(msgData.length > 0) {
			msgData += ", ";
		}
		msgData += "model : " + message.getProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_AUTOMATON_DATA_MODEL);
	}
	msgData += "}";
	chatText = chatText.split(this.REPLACE_STRING).join(msgData);
	var outText = "<span id='" + divId + "' >" + chatText + "</span>";
	var tmpDiv = document.createElement("DIV");
	tmpDiv.innerHTML = outText;
	var items = tmpDiv.getElementsByTagName("INPUT");
	{
		var _g1 = 0, _g = items.length;
		while(_g1 < _g) {
			var ix = _g1++;
			var name = items[ix].name;
			if(name == null || name == "") continue;
			var onchange = "inqFrame.com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestMessageHandler.onChange(\"" + name + "\");";
			var el = items[ix];
			items[ix].setAttribute(((el.type == "checkbox")?"onclick":"onchange"),onchange);
		}
	}
	outText = tmpDiv.innerHTML;
	var position = -1;
	var regexP = new EReg("<\\s*P\\b\\s*[^>]*>","ig");
	var regexPEnd = new EReg("<\\s*/P\\s*>","ig");
	outText = regexP.replace(outText,"<br/><br/>");
	outText = regexPEnd.replace(outText,"");
	this.getController().appendReceivedText(outText,((agentName != null?agentName:"")),position);
}
com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestMessageHandler.prototype.__class__ = com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestMessageHandler;
EventDispatcher = function(p) { if( p === $_ ) return; {
	com.inq.utils.Dictionary.apply(this,[]);
}}
EventDispatcher.__name__ = ["EventDispatcher"];
EventDispatcher.__super__ = com.inq.utils.Dictionary;
for(var k in com.inq.utils.Dictionary.prototype ) EventDispatcher.prototype[k] = com.inq.utils.Dictionary.prototype[k];
EventDispatcher.prototype.__class__ = EventDispatcher;
com.inq.flash.client.control.messagehandlers.ClientCommandMessageHandler = function(p) { if( p === $_ ) return; {
	com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.apply(this,[com.inq.flash.client.data.MessageFields.TYPE_CLIENT_COMMAND]);
}}
com.inq.flash.client.control.messagehandlers.ClientCommandMessageHandler.__name__ = ["com","inq","flash","client","control","messagehandlers","ClientCommandMessageHandler"];
com.inq.flash.client.control.messagehandlers.ClientCommandMessageHandler.__super__ = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler;
for(var k in com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype ) com.inq.flash.client.control.messagehandlers.ClientCommandMessageHandler.prototype[k] = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype[k];
com.inq.flash.client.control.messagehandlers.ClientCommandMessageHandler.prototype.chat = null;
com.inq.flash.client.control.messagehandlers.ClientCommandMessageHandler.prototype.processMessage = function(message) {
	var replay = ("1" == message.getProperty(com.inq.flash.client.data.MessageFields.KEY_REPLAY));
	var cmd = message.getProperty(com.inq.flash.client.data.MessageFields.KEY_CLIENT_CMD_PARAM);
	if(cmd == null || cmd == "") cmd = message.getProperty(com.inq.flash.client.data.MessageFields.KEY_CLIENT_COMMAND_PARAM);
	var pageURL = com.inq.flash.messagingframework.StringUtils.decodeStringFromMessage(cmd);
	var sTarget = "inqNewWindow";
	var indx;
	var newCmdPr = "client_command";
	var match;
	if(pageURL == "hide_input") {
		com.inq.flash.client.chatskins.SkinControl.hideInput();
		return;
	}
	(match = pageURL.match(/^show_input(\|(.*))?/));
	var isShowInput = ((match != null)?true:false);
	if(isShowInput) {
		com.inq.flash.client.chatskins.SkinControl.showInput(match[2] == "true");
		return;
	}
	if(replay) return;
	if(pageURL.indexOf(newCmdPr) == 0) {
		com.inq.flash.client.chatskins.SkinControl.executeCustomCommand(pageURL.substr(newCmdPr.length));
		return;
	}
	if((indx = pageURL.indexOf(" to ")) >= 0) {
		sTarget = pageURL.substr(indx + 4);
		pageURL = pageURL.substr(0,indx);
		haxe.Log.trace("doPushPage: extract target " + sTarget,{ fileName : "ClientCommandMessageHandler.hx", lineNumber : 66, className : "com.inq.flash.client.control.messagehandlers.ClientCommandMessageHandler", methodName : "processMessage"});
	}
	if(pageURL == "xform") {
		var paramPair = sTarget.split("|");
		var namePair = paramPair[0].split(".");
		com.inq.flash.client.control.MinimizeManager.lastAgentMessage(null);
		switch(namePair[0]) {
		case "shrink":{
			com.inq.flash.client.control.XFrameWorker.shrink(namePair[1]);
		}break;
		case "grow":{
			if(paramPair.length > 1) {
				com.inq.flash.client.control.XFrameWorker.grow(namePair[1],paramPair[1].split(com.inq.flash.client.control.messagehandlers.ClientCommandMessageHandler.XFORM_SERVER_PLACEHOLDER).join(com.inq.flash.client.control.FlashPeer.getXFormsDomain()));
			}
			else {
				com.inq.flash.client.control.XFrameWorker.grow(namePair[1],null);
			}
		}break;
		case "hide":{
			com.inq.flash.client.control.XFrameWorker.hideLayer(namePair[1]);
		}break;
		case "show":{
			com.inq.flash.client.control.XFrameWorker.showLayer(namePair[1],null,(paramPair.length > 1?paramPair[1]:null));
		}break;
		}
		return;
	}
	if(sTarget == "skin") {
		com.inq.ui.SkinLoader.LoadNewSkin(pageURL);
		return;
	}
	if(sTarget == "forward") {
		if(!com.inq.flash.client.chatskins.SkinControl.getIsPersistentChat()) return;
		var win = window.parent;
		if(win.focus) {
			win.focus();
		}
		return;
	}
	if(pageURL.indexOf("goToPersistentChat") >= 0) {
		haxe.Log.trace("CHAT: Frameset Push, closing socket",{ fileName : "ClientCommandMessageHandler.hx", lineNumber : 107, className : "com.inq.flash.client.control.messagehandlers.ClientCommandMessageHandler", methodName : "processMessage"});
		this.getController().shutdownQuietly();
	}
	if(com.inq.flash.client.control.FlashVars.getFlashVars().persistentFrame) {
		com.inq.flash.client.chatskins.SkinControl.PushToFrameset(pageURL,sTarget);
	}
	else {
		if("_inqPersistentChat" == sTarget) {
			com.inq.flash.client.chatskins.SkinControl.enablePersistentChatButtonAndEstablishUrl(pageURL);
		}
		else if("flashForm" == sTarget) {
			com.inq.flash.client.chatskins.SkinControl.PushEmbeddedForm();
		}
		else if("block-service" == sTarget) {
			com.inq.flash.client.chatskins.SkinControl.blockService(pageURL);
		}
		else {
			com.inq.flash.client.chatskins.SkinControl.PushToFrameset(pageURL,sTarget);
		}
	}
}
com.inq.flash.client.control.messagehandlers.ClientCommandMessageHandler.prototype.__class__ = com.inq.flash.client.control.messagehandlers.ClientCommandMessageHandler;
com.inq.external = {}
com.inq.external.ExternalInterface = function(p) { if( p === $_ ) return; {
	null;
}}
com.inq.external.ExternalInterface.__name__ = ["com","inq","external","ExternalInterface"];
com.inq.external.ExternalInterface.objectID = null;
com.inq.external.ExternalInterface.addCallback = function(functionName,closure) {
	null;
}
com.inq.external.ExternalInterface.formatParam = function(param) {
	if(null != param.toUpperCase) {
		return com.inq.utils.StringUtil.toJsString(param);
	}
	else {
		return param.toString();
	}
}
com.inq.external.ExternalInterface.call = function(functionName,p1,p2,p3,p4,p5) {
	var result = null;
	var sFun;
	var myParent = js.Lib.window;
	if(functionName.indexOf("function(){") == 0) {
		sFun = functionName.substr(11);
		sFun = StringTools.trim(sFun);
		sFun = sFun.substr(0,sFun.length - 1);
	}
	else {
		sFun = functionName + "(";
		if(null != p1) sFun += com.inq.external.ExternalInterface.formatParam(p1);
		if(null != p2) sFun += "," + com.inq.external.ExternalInterface.formatParam(p2);
		if(null != p3) sFun += "," + com.inq.external.ExternalInterface.formatParam(p3);
		if(null != p4) sFun += "," + com.inq.external.ExternalInterface.formatParam(p4);
		if(null != p5) sFun += "," + com.inq.external.ExternalInterface.formatParam(p5);
		sFun += ");";
	}
	try {
		result = js.Lib.eval(sFun);
	}
	catch( $e75 ) {
		if( js.Boot.__instanceof($e75,Error) ) {
			var e = $e75;
			{
				haxe.Log.trace("ERROR: ExternalInterface.call failed when executing [" + sFun + "]: " + e,{ fileName : "ExternalInterface.hx", lineNumber : 59, className : "com.inq.external.ExternalInterface", methodName : "call", customParams : ["error"]});
				return null;
			}
		} else throw($e75);
	}
	return null;
}
com.inq.external.ExternalInterface.marshallExceptions = null;
com.inq.external.ExternalInterface.prototype.__class__ = com.inq.external.ExternalInterface;
com.inq.events.MouseEvent = function(type,bubbles,cancelable,localX,localY,relatedObject,ctrlKey,altKey,shiftKey,buttonDown,delta) { if( type === $_ ) return; {
	com.inq.events.Event.apply(this,[type]);
}}
com.inq.events.MouseEvent.__name__ = ["com","inq","events","MouseEvent"];
com.inq.events.MouseEvent.__super__ = com.inq.events.Event;
for(var k in com.inq.events.Event.prototype ) com.inq.events.MouseEvent.prototype[k] = com.inq.events.Event.prototype[k];
com.inq.events.MouseEvent.DOUBLE_CLICK = null;
com.inq.events.MouseEvent.MOUSE_DOWN = null;
com.inq.events.MouseEvent.MOUSE_MOVE = null;
com.inq.events.MouseEvent.MOUSE_OUT = null;
com.inq.events.MouseEvent.MOUSE_OVER = null;
com.inq.events.MouseEvent.MOUSE_UP = null;
com.inq.events.MouseEvent.MOUSE_WHEEL = null;
com.inq.events.MouseEvent.ROLL_OUT = null;
com.inq.events.MouseEvent.ROLL_OVER = null;
com.inq.events.MouseEvent.prototype.altKey = null;
com.inq.events.MouseEvent.prototype.buttonDown = null;
com.inq.events.MouseEvent.prototype.ctrlKey = null;
com.inq.events.MouseEvent.prototype.delta = null;
com.inq.events.MouseEvent.prototype.localX = null;
com.inq.events.MouseEvent.prototype.localY = null;
com.inq.events.MouseEvent.prototype.m_altKey = null;
com.inq.events.MouseEvent.prototype.m_buttonDown = null;
com.inq.events.MouseEvent.prototype.m_ctrlKey = null;
com.inq.events.MouseEvent.prototype.m_delta = null;
com.inq.events.MouseEvent.prototype.m_localX = null;
com.inq.events.MouseEvent.prototype.m_localY = null;
com.inq.events.MouseEvent.prototype.m_relatedObject = null;
com.inq.events.MouseEvent.prototype.m_shiftKey = null;
com.inq.events.MouseEvent.prototype.relatedObject = null;
com.inq.events.MouseEvent.prototype.shiftKey = null;
com.inq.events.MouseEvent.prototype.stageX = null;
com.inq.events.MouseEvent.prototype.stageY = null;
com.inq.events.MouseEvent.prototype.__class__ = com.inq.events.MouseEvent;
com.inq.flash.client.control.messagehandlers.PersistentActiveHandler = function(p) { if( p === $_ ) return; {
	com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.apply(this,[com.inq.flash.client.data.MessageFields.TYPE_GET_PERSISTENT_DOMAIN]);
}}
com.inq.flash.client.control.messagehandlers.PersistentActiveHandler.__name__ = ["com","inq","flash","client","control","messagehandlers","PersistentActiveHandler"];
com.inq.flash.client.control.messagehandlers.PersistentActiveHandler.__super__ = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler;
for(var k in com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype ) com.inq.flash.client.control.messagehandlers.PersistentActiveHandler.prototype[k] = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype[k];
com.inq.flash.client.control.messagehandlers.PersistentActiveHandler.prototype.processMessage = function(message) {
	var replay = message.getProperty(com.inq.flash.client.data.MessageFields.KEY_REPLAY);
	if(!com.inq.flash.client.chatskins.SkinControl.getIsPersistentChat()) return;
	if(replay == null || replay != "1") {
		var xfr = message.getProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_DATA);
		if(xfr == null || xfr.length == 0) {
			var protoDomain = message.getProperty(com.inq.flash.client.data.MessageFields.KEY_PROTODOMAIN);
			var messageCnt = message.getProperty(com.inq.flash.client.data.MessageFields.KEY_CLIENT_MESSAGE_COUNT);
			this.getController().acknowledgeChatPersistent(protoDomain,messageCnt);
		}
		else {
			xfr = com.inq.flash.messagingframework.StringUtils.decodeStringFromMessage(xfr);
			var loc = window.parent.location.href;
			if(loc != xfr) {
				com.inq.flash.client.chatskins.SkinControl.noUnload();
				try {
					window.parent.opener = null;
				}
				catch( $e76 ) {
					if( js.Boot.__instanceof($e76,Error) ) {
						var e = $e76;
						{
							haxe.Log.trace("PersistentActiveHandler.processMessage: " + e,{ fileName : "PersistentActiveHandler.hx", lineNumber : 35, className : "com.inq.flash.client.control.messagehandlers.PersistentActiveHandler", methodName : "processMessage"});
						}
					} else throw($e76);
				}
				window.parent.location.href = xfr;
			}
		}
	}
	else haxe.Log.trace("replay",{ fileName : "PersistentActiveHandler.hx", lineNumber : 42, className : "com.inq.flash.client.control.messagehandlers.PersistentActiveHandler", methodName : "processMessage"});
}
com.inq.flash.client.control.messagehandlers.PersistentActiveHandler.prototype.__class__ = com.inq.flash.client.control.messagehandlers.PersistentActiveHandler;
com.inq.ui.BalloonOverlaying = function(id,styleName,element,text,parent) { if( id === $_ ) return; {
	com.inq.ui.Container.apply(this,[]);
	this._element = element;
	this._parent = parent;
	this._styleName = styleName;
	this._styleDef = null;
	this._text = text;
	this._parentContainer = parent;
	this.cornerRadius = 6;
	this._style = Application.application.skinConfig[styleName];
	if(this._style == null) this._style = (((styleName == "BalloonNotify")?";color:white;background-color:navy;":(((styleName == "BalloonWarn")?";color:yellow;background-color:red;":";color:black;background-color:white;"))));
	this.render(this._parentContainer);
}}
com.inq.ui.BalloonOverlaying.__name__ = ["com","inq","ui","BalloonOverlaying"];
com.inq.ui.BalloonOverlaying.__super__ = com.inq.ui.Container;
for(var k in com.inq.ui.Container.prototype ) com.inq.ui.BalloonOverlaying.prototype[k] = com.inq.ui.Container.prototype[k];
com.inq.ui.BalloonOverlaying._doClick = function(e) {
	var win = window;
	var ob = ((null != e)?e.target:win.event.srcElement);
	var c = ob.container;
	c.doClick();
}
com.inq.ui.BalloonOverlaying.prototype._color = null;
com.inq.ui.BalloonOverlaying.prototype._element = null;
com.inq.ui.BalloonOverlaying.prototype._fixSizesAndPositions = function() {
	var els = this._div.getElementsByTagName("*");
	var blnTable = this._div.getElementsByTagName("TABLE")[0];
	var blnSpanText = null;
	var blnCellText = null;
	var blnClearOverlay = null;
	var blnSpanCornerLT = null;
	var blnSpanCornerRT = null;
	var blnSpanCornerLB = null;
	var blnSpanCornerRB = null;
	var blnBackground = null;
	var blnBackgroundEW = null;
	var blnBackgroundNS = null;
	var blnLeftArrows = null;
	var blnRightArrows = null;
	var blnTopArrows = null;
	var blnBottomArrows = null;
	var blnUpArrowLeft = null;
	var blnUpArrowRight = null;
	var blnLeftArrowTop = null;
	var blnLeftArrowBottom = null;
	var c_leadleft = 178;
	var c_leadright = 178;
	var c_width = 1237;
	var blnTd1 = null;
	var i;
	{
		var _g1 = 0, _g = els.length;
		while(_g1 < _g) {
			var i1 = _g1++;
			var ob = els[i1];
			if(ob == null) continue;
			var nm = ob.getAttribute("name");
			if(nm != null && nm != "") {
				switch(nm) {
				case "blnSpanText":{
					blnSpanText = ob;
				}break;
				case "blnCellText":{
					blnCellText = ob;
				}break;
				case "blnTd1":{
					blnTd1 = els[i1];
				}break;
				case "blnSpanCornerLT":{
					blnSpanCornerLT = ob;
				}break;
				case "blnSpanCornerRT":{
					blnSpanCornerRT = ob;
				}break;
				case "blnSpanCornerLB":{
					blnSpanCornerLB = ob;
				}break;
				case "blnSpanCornerRB":{
					blnSpanCornerRB = ob;
				}break;
				case "blnBackground":{
					blnBackground = ob;
				}break;
				case "blnBackgroundEW":{
					blnBackgroundEW = ob;
				}break;
				case "blnBackgroundNS":{
					blnBackgroundNS = ob;
				}break;
				case "blnLeftArrows":{
					blnLeftArrows = ob;
				}break;
				case "blnRightArrows":{
					blnRightArrows = ob;
				}break;
				case "blnTopArrows":{
					blnTopArrows = ob;
				}break;
				case "blnBottomArrows":{
					blnBottomArrows = ob;
				}break;
				case "blnUpArrowLeft":{
					blnUpArrowLeft = ob;
				}break;
				case "blnUpArrowRight":{
					blnUpArrowRight = ob;
				}break;
				case "blnLeftArrowTop":{
					blnLeftArrowTop = ob;
				}break;
				case "blnClearOverlay":{
					blnClearOverlay = ob;
				}break;
				case "blnLeftArrowBottom":{
					blnLeftArrowBottom = ob;
				}break;
				default:{
					haxe.Log.trace("item named " + nm + " not used",{ fileName : "BalloonOverlaying.hx", lineNumber : 418, className : "com.inq.ui.BalloonOverlaying", methodName : "_fixSizesAndPositions"});
				}break;
				}
			}
		}
	}
	if(com.inq.ui.BalloonOverlaying.bIE6 && blnSpanCornerLT.offsetWidth > 18) {
		var p = 25;
		blnSpanCornerLT.style.fontSize = p + "pt";
		while(blnSpanCornerLT.offsetWidth > 18) {
			--p;
			blnSpanCornerLT.style.fontSize = p + "pt";
		}
		blnSpanCornerRB.style.fontSize = blnSpanCornerLB.style.fontSize = blnSpanCornerRT.style.fontSize = p + "pt";
		blnSpanCornerLT.style.left = "0px";
		blnSpanCornerLT.style.top = "0px";
		blnSpanCornerRT.style.left = "-8px";
		blnSpanCornerRT.style.top = "0px";
		blnSpanCornerLB.style.left = "0px";
		blnSpanCornerLB.style.top = "-8px";
		blnSpanCornerRB.style.left = "-8px";
		blnSpanCornerRB.style.top = "-8px";
		blnUpArrowLeft.style.top = "0px";
		blnUpArrowLeft.style.left = "-1px";
		blnUpArrowRight.style.top = "0px";
		blnUpArrowRight.style.left = "-1px";
	}
	blnLeftArrows.style.display = "";
	blnRightArrows.style.display = "none";
	blnTopArrows.style.display = "none";
	blnBottomArrows.style.display = "none";
	blnLeftArrowTop.style.display = "";
	blnLeftArrowBottom.style.display = "none";
	var padding = Math.round(this.cornerRadius / 2);
	var paddingOverhead = 0;
	blnSpanText.parentNode.style.padding = (padding) + "px";
	var allArrowWidth = blnTable.offsetWidth - blnTd1.offsetWidth;
	var w = blnSpanText.offsetWidth;
	blnSpanText.parentNode.style.width = (w) + "px";
	var h = blnSpanText.offsetHeight;
	blnSpanText.parentNode.style.height = (h) + "px";
	h += padding * 2;
	w += padding * 2;
	blnTable.style.height = (h) + "px";
	blnTable.style.width = (w + allArrowWidth) + "px";
	blnBackground.style.width = w + "px";
	blnBackground.style.height = h + "px";
	blnBackgroundEW.style.left = "0px";
	blnBackgroundEW.style.right = "0px";
	blnBackgroundEW.style.top = this.cornerRadius + "px";
	blnBackgroundEW.style.bottom = "";
	blnBackgroundEW.style.height = (h - 2 * this.cornerRadius) + "px";
	blnBackgroundEW.style.width = (w) + "px";
	blnBackgroundNS.style.top = "0px";
	blnBackgroundNS.style.bottom = "";
	blnBackgroundNS.style.left = this.cornerRadius + "px";
	blnBackgroundNS.style.right = "";
	blnBackgroundNS.style.width = (w - 2 * this.cornerRadius) + "px";
	blnBackgroundNS.style.height = (h) + "px";
	blnSpanCornerRT.parentNode.style.left = (w - this.cornerRadius) + "px";
	blnSpanCornerRT.parentNode.style.right = "";
	blnSpanCornerRB.parentNode.style.left = (w - this.cornerRadius) + "px";
	blnSpanCornerRB.parentNode.style.right = "";
	blnSpanCornerRB.parentNode.style.top = (h - this.cornerRadius) + "px";
	blnSpanCornerRB.parentNode.style.bottom = "";
	blnSpanCornerLB.parentNode.style.top = (h - this.cornerRadius) + "px";
	blnSpanCornerLB.parentNode.style.bottom = "";
	this._div.style.width = blnTable.style.width;
	this._div.style.height = blnTable.style.height;
	blnClearOverlay.style.width = blnTable.style.width;
	blnClearOverlay.style.height = blnTable.style.height;
	{
		var _g1 = 0, _g = els.length;
		try {
			while(_g1 < _g) {
				var i1 = _g1++;
				var nm = els[i1].getAttribute("name");
				if(nm != null && nm != "") {
					switch(nm) {
					case "blnArrowLeft":{
						els[i1].style.height = (((els[i1].tagName == "TABLE")?(h):(h / 2))) + "px";
					}break;
					default:{
						throw "__break__";
					}break;
					}
				}
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
	}
}
com.inq.ui.BalloonOverlaying.prototype._img = null;
com.inq.ui.BalloonOverlaying.prototype._parentContainer = null;
com.inq.ui.BalloonOverlaying.prototype._styleDef = null;
com.inq.ui.BalloonOverlaying.prototype._styleName = null;
com.inq.ui.BalloonOverlaying.prototype._text = null;
com.inq.ui.BalloonOverlaying.prototype._useHandCursor = null;
com.inq.ui.BalloonOverlaying.prototype.applyStyle = function() {
	this.buildStyle();
}
com.inq.ui.BalloonOverlaying.prototype.buildStyle = function() {
	this.render(this._parentContainer);
}
com.inq.ui.BalloonOverlaying.prototype.cornerRadius = null;
com.inq.ui.BalloonOverlaying.prototype.destroy = function() {
	if(this._div.parentNode != null) try {
		this._div.parentNode.removeChild(this._div);
	}
	catch( $e77 ) {
		if( js.Boot.__instanceof($e77,Error) ) {
			var e = $e77;
			null;
		} else throw($e77);
	}
	return this._element;
}
com.inq.ui.BalloonOverlaying.prototype.doClick = function() {
	var action = this.eventListeners[com.inq.events.MouseEvent.CLICK];
	var ev = new com.inq.events.MouseEvent(com.inq.events.MouseEvent.CLICK);
	ev.target = ev.currentTarget = this;
	if(action != null) action(ev);
}
com.inq.ui.BalloonOverlaying.prototype.fixIERendering = function(div,color) {
	var h = div.childNodes[1].clientHeight;
	var w = div.childNodes[1].clientWidth;
	div.style.height = (h + 13) + "px";
	var bg1 = div.getElementsByTagName("DIV");
	var ix;
	{
		var _g1 = 0, _g = bg1.length;
		while(_g1 < _g) {
			var ix1 = _g1++;
			if(bg1[ix1].name == "balloon_background1") {
				bg1[ix1].style.height = ((((h - 40) < 0)?0:(h - 40))) + "px";
				bg1[ix1].style.width = (w) + "px";
				if(color != null) bg1[ix1].style.backgroundColor = color;
				bg1[ix1].style.bottom = "";
				bg1[ix1].style.right = "";
			}
			else if(bg1[ix1].name == "balloon_background2") {
				bg1[ix1].style.height = (h) + "px";
				bg1[ix1].style.width = ((((w - 40) < 0)?0:(w - 40))) + "px";
				if(color != null) bg1[ix1].style.backgroundColor = color;
				bg1[ix1].style.bottom = "";
				bg1[ix1].style.right = "";
			}
		}
	}
}
com.inq.ui.BalloonOverlaying.prototype.render = function(_parent) {
	var parentWidth;
	var bLeft = true;
	var elementWidth = this._element.offsetWidth;
	var elementHeight = this._element.offsetHeight;
	var elementLeft = 0;
	var elementTop = 0;
	if(_parent == null) _parent = window.document.body;
	var o = this._element;
	while(o != _parent) {
		elementLeft += o.offsetLeft;
		elementTop += o.offsetTop;
		o = o.offsetParent;
		if(o == null) break;
	}
	elementTop += _parent.offsetTop;
	elementLeft += _parent.offsetLeft;
	parentWidth = _parent.clientWidth;
	var elementRight = parentWidth - (elementLeft + elementWidth);
	var bLeft1 = true;
	var y = elementTop;
	var x = elementLeft + 3;
	var bLeft2 = true;
	var maxWidth = _parent.clientWidth;
	var pClientWidth = _parent.clientWidth;
	var blnWidth = ((maxWidth > 400)?400:maxWidth);
	var toEdgeWidth = pClientWidth - (((bLeft2)?com.inq.ui.BalloonOverlaying.HOT_OFFSET_X + x:com.inq.ui.BalloonOverlaying.HOT_OFFSET_X + x));
	var trueLeft = x - com.inq.ui.BalloonOverlaying.HOT_OFFSET_X;
	var trueTop = y - com.inq.ui.BalloonOverlaying.HOT_OFFSET_Y;
	if(toEdgeWidth < blnWidth) blnWidth = toEdgeWidth;
	var defaultStyle = this._style;
	this._div.innerHTML = "<span style=\"" + defaultStyle + "\">foo</span>";
	this._color = this._div.firstChild.style.backgroundColor;
	this._div.innerHTML = "<div style=\"position:absolute; overflow:hidden; top:0px;" + (((bLeft2)?"left":"right")) + ":12px;height:16px;\">" + "<span style=\"position:relative; overflow:hidden; height:16px; font-family:arial;font-size:20px; top:" + (((com.inq.ui.BalloonOverlaying.bIE6)?"-1px":"-" + this.cornerRadius + "px")) + ";width:auto;\">&#9650;</span>" + "</div>" + "<div style=\"position:absolute;top:13px;left:0px;background-color:transparent;\">" + "<div style=\"background-color:" + (this._color) + "\">" + "<div name=\"balloon_background1\" style=\"background-color:inherit;border-width:0px;border-style:none;overflow:hidden;position:absolute;left:0px; right:0px; top:20px; bottom:20px;\"><div style=\"overflow:hidden;width:100%;height:100%;\"></div></div>" + "<div name=\"balloon_background2\" style=\"background-color:inherit;border-width:0px;border-style:none;overflow:hidden;position:absolute;left:20px; right:20px; top:0px; bottom:0px;\"><div style=\"overflow:hidden;width:100%;height:100%;\"></div></div>" + "</div>" + "<div style=\"position:absolute; width:20px; height:20px; background-color:transparent; overflow:hidden; top:0px; left:0px;\">" + "<div style=\"position:relative;font-size:150px;font-family:'arial';line-height:40px;;left:-8px;\">&#8226;</div>" + "</div>" + "<div style=\"position:absolute; width:20px; height:20px; background-color:transparent; overflow:hidden; top:0px; right:0px;\">" + "<div style=\"position:relative;font-size:150px;font-family:'arial';line-height:40px;left:-25px;\">&#8226;</div>" + "</div>" + "<div style=\"position:absolute; width:20px; height:20px; background-color:transparent; overflow:hidden; bottom:0px; left:0px;\">" + "<div style=\"position:relative;font-size:150px;font-family:'arial';line-height:40px;left:-8px; top:-17px;\">&#8226;</div>" + "</div>\n" + "<div style=\"position:absolute; width:20px; height:20px; background-color:transparent; overflow:hidden; bottom:0px; right:0px;\">" + "<div style=\"position:relative;font-size:150px;font-family:'arial';line-height:40px;;left:-25px; top:-17px;\">&#8226;</div>" + "</div>" + "<div style=\"position:relative;padding:8px\" style=\"background:transparent;\">" + "<span name=\"contents\" class=\"box-contents\" style=\";background-color:" + this._color + ";\">" + this._text + "</span>" + "</div>" + "</div>" + "<div style=\"position:absolute;top:0px;left:0px;width:100%;height:100%;cursor:pointer;\">" + "<input type=\"image\"  style=\"width:100%;height:100%;opacity:0.01;filter:alpha(opacity=1)\" />" + "</div>\n";
	this._div.innerHTML = "<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" align=\"left\" valign=\"top\" style=\"color:" + this._color + ";width:" + blnWidth + "px;border-style:none;border-width:0px;margin:0px;padding:0px;\">" + "<tbody>" + "<tr style=\"border-style:none;border-width:0px; margin:0px;padding:0px;\">" + "<td name=\"blnLeftArrows\" style=\"width:8px;border:0px; margin:0px; padding:0px\">" + "<table name=\"blnArrowLeft\" cellpadding=\"0\" width=\"8\" cellspacing=\"0\" border=\"0\" style=\"height:100%;width:8px;border:0px; margin:0px; padding:0px;\" height=\"100%\">" + "<tbody>" + "<TR name=\"blnArrowLeft\" width=\"8\" style=\"color:" + this._color + ";height:50%;border:0px;margin:0px;padding:0px;\">" + "<td width=\"8\" align=\"center\" valign=\"top\" style=\"border:0px; height:inherit; margin:0px; width:8px; \">" + "<div style=\"position:relative;top:" + this.cornerRadius + "px;left:0px;width:8px;height:9px;overflow:hidden;\">" + "<SPAN name=\"blnLeftArrowTop\" style=\"position:absolute;top:-3px;left:-2px;font-family:Arial;font-size:12px\">&#9668;<!-- left arrow --></span>" + "</div>" + "</TD>" + "</tr>" + "<TR name=\"blnArrowLeft\" width=\"8\" style=\"height:50%;border:0px; margin:0px; padding:0px;\">" + "<td width=\"8\" align=\"right\" valign=\"bottom\" style=\"border:0px; height:inherit; margin:0px; width:8px; \">" + "<div style=\"position:relative;height:100%;width:inherit;top:0px;left:0px;\">" + "<div style=\"position:absolute;bottom:" + this.cornerRadius + "px;left:0px;width:8px;height:9px;overflow:hidden;\">\n" + "<SPAN name=\"blnLeftArrowBottom\" style=\"position:absolute;top:-3px;left:-2px;color:" + this._color + ";font-family:Arial;font-size:12px\">&#9668;<!-- left arrow --></span>" + "</div>" + "</div>" + "</TD>" + "</tr>" + "</tbody>" + "</TABLE>" + "</td>" + "<td name=\"blnTd1\" align=\"left\" valign=\"top\" style=\"width:100%;margin-style:none;margin-width:0px;border:0px;padding:0px;\">" + "<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" align=\"left\" valign=\"top\" width=\"100%\" style=\"width:100%;margin:0px;border:0px;padding:0px\">" + "<tbody>" + "<tr align=\"left\" valign=\"top\" style=\"margin:0px;border:0px;padding:0px\">" + "<TD name=\"blnTopArrows\" style=\"margin:0px;border:0px;padding:0px\">" + "<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" height=\"8\" width=\"100%\" style=\"height:8px;border-style:none; border-width:0px;; margin:0px; padding:0px\">" + "<tbody style=\"border-style:none; border-width:0px;height:8px;margin:0px;padding:0px\">" + "<tr align=\"left\" valign=\"top\" style=\"border-style:none; border-width:0px;margin:0px;padding:0px\">\n" + "<td  width=\"50%\" align=\"left\" style=\"border-style:none; border-width:0px;margin:0px;padding:0px\">\n" + "<div style=\"position:relative;top:0px;left:" + this.cornerRadius + "px;width:8px;height:8px;overflow:hidden;\">" + "<span name=\"blnUpArrowLeft\" style=\"position:absolute;top:-3px;left:-2px;background-color:transparent; color:" + this._color + "; font-family:Arial; font-size:12px;font-style:normal;font-variant:normal;font-weight:normal;\">&#9650;<!-- up arrow --></span>" + "</div>" + "</td>" + "<td  width=\"50%\"  align=\"right\" style=\"margin:0px;border:0px;padding:0px\">" + "<div style=\"position:relative;top:0px;right:" + this.cornerRadius + "px;width:8px;height:8px;overflow:hidden;\">" + "<span name=\"blnUpArrowRight\" style=\"position:absolute;top:-3px;left:-2px;background-color:transparent; color:" + this._color + ";font-family:Arial; font-size:12px; font-style:normal; font-variant:normal; font-weight:normal; \">&#9650;<!-- up arrow --></span>" + "</div>" + "</td>" + "</TR>" + "</tbody>" + "</table>" + "</TD>" + "</TR>" + "<tr align=\"left\" valign=\"top\" style=\"width:100%;margin:0px;border:0px;padding:0px\">" + "<td width=\"100%\" height=\"100%\" align=\"left\" valign=\"top\" style=\"height:auto;margin:0px;border:0px;padding:0px\"  name=\"blnCellText\">" + "<div style=\"border-style:none; border-width:0px; height:100%; left:0px; position:relative; top:0px; width:100%;\">" + "<div style=\"background-color:transparent;width:100%;height:100%;position:absolute;left:0px;right:0px;\">" + "<div style=\"position:absolute;top:0px;left:0px;height:" + this.cornerRadius + "px;width:" + this.cornerRadius + "px;overflow:hidden;\">" + "<span name=\"blnSpanCornerLT\" style=\"color:" + this._color + "; ;position:absolute;margin:0px;left:-2px;top:-12px;font-family:Arial; font-size:28px;\">&#9679;<!-- UTF-25CF: Black Circle --></span>" + "</div>" + "<div  style=\"position:absolute;top:0px;right:0px;height:" + this.cornerRadius + "px;width:" + this.cornerRadius + "px;overflow:hidden;\">" + "<span name=\"blnSpanCornerRT\" style=\"color:" + this._color + "; position:absolute;margin:0px;left:-9px;top:-12px;font-family:Arial; font-size:28px;\">&#9679;<!-- UTF-25CF: Black Circle --></span>" + "</div>" + "<div style=\"position:absolute;bottom:0px;left:0px;height:" + this.cornerRadius + "px;width:" + this.cornerRadius + "px;overflow:hidden;\">" + "<span name=\"blnSpanCornerLB\" style=\"color:" + this._color + ";position:absolute;margin:0px;left:-2px;top:-18px;font-family:arial; font-size:28px;\">&#9679;<!-- UTF-25CF: Black Circle --></span>" + "</div>" + "<div style=\"position:absolute;bottom:0px;right:0px;height:" + this.cornerRadius + "px;width:" + this.cornerRadius + "px;overflow:hidden;\">" + "<span name=\"blnSpanCornerRB\" style=\"color:" + this._color + "; position:absolute;margin:0px;left:-9px;top:-18px;font-family:arial; font-size:28px;\">&#9679;<!-- UTF-25CF: Black Circle --></span>" + "</div>" + "<div name=\"blnBackground\" style=\"position:absolute;top:0px;bottom:0px;left:0px;right:0px;\">" + "<div style=\"background-color:" + this._color + ";\">" + "<div name=\"blnBackgroundEW\" style=\"position:absolute;top:" + this.cornerRadius + "px;bottom:" + this.cornerRadius + "px;left:0px;right:0px;background-color:" + this._color + ";\">" + "<div style=\"overflow: hidden; width:100%; height:100%;\"></div>" + "</div>" + "<div name=\"blnBackgroundNS\" style=\"position:absolute;top:0px;bottom:0px;left:" + this.cornerRadius + "px;right:" + this.cornerRadius + "px;background-color:" + this._color + ";\">" + "<div style=\"overflow: hidden; width:100%; height:100%;\"></div>" + "</div>" + "</div>" + "</div>" + "<div style=\"width:100%;position:absolute;top:0px;left:0px;border-style:none;border-width:0px;\">" + "<span name=\"blnSpanText\" class=\"box-contents\" style=\"background-color:transparent;font-family:Comic Sans MS; font-size:10pt; \">\n" + this._text + "</span>" + "</div>" + "</div>" + "</div>" + "</td>" + "</tr>" + "<tr style=\"margin:0px;border:0px;padding:0px\">" + "<td  name=\"blnBottomArrows\" style=\"margin:0px;border:0px;padding:0px\">" + "<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" align=\"left\" valign=\"top\" width=\"100%\" style=\"border-style:none;border-width:0px;padding:0px;margin:0px;\">" + "<tbody>" + "<tr align=\"left\" valign=\"top\" style=\"border-color:#3d24e4; border-style:solid; border-width:0px;margin:0px;padding:0px\">" + "<td width=\"50%\" align=\"left\" valign=\"top\" style=\"border-color:#3d24e4; border-style:solid; border-width:0px;margin:0px;padding:0px\">" + "<div style=\"position:relative;top:0px;left:7px;width:8px;height:8px;overflow:hidden;\">" + "<span style=\"position:absolute;top:-4px;left:-2px;background-color:transparent;color:" + this._color + ";font-family:Arial;font-size:12px;font-style:normal;font-variant:normal;font-weight:normal;\">" + "&#9660;<!-- UTF-25BC: Black Down-Pointing Triangle -->" + "</span>" + "</div>" + "</td>" + "<td  width=\"50%\" align=\"right\" style=\"margin:0px;border:0px;padding:0px\">" + "<div style=\"position:relative;top:0px;right:7px;width:8px;height:8px;overflow:hidden;\">" + "<span  class=\"box-contents\" style=\"position:absolute;top:-4px;left:-2px;background-color:transparent;color:" + this._color + ";font-family:Arial;font-size:12px;font-style:normal;font-variant:normal;font-weight:normal; \">" + "&#9660;" + "</span>" + "</div>" + "</td>" + "</TR>" + "</tbody>" + "</table>" + "</td>" + "</tr>" + "</tbody>" + "</table>" + "</td>" + "<td name=\"blnRightArrows\" width=\"8\" style=\"border:0px; margin:0px; padding:0px;\">" + "<table name=\"blnArrowLeft\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" align=\"left\" valign=\"top\" width=\"8\" style=\"width:8px;border:0px; margin:0px; padding:0px;\">" + "<tbody>" + "<TR name=\"blnArrowLeft\" style=\"height:50%;width:8px;border:0px; margin:0px; padding:0px;\">" + "<td width=\"8\" align=\"center\" valign=\"top\" style=\"border:0px; height:inherit; margin:0px; max-width:8px; width:8px;\">" + "<div style=\"position:relative;top:" + this.cornerRadius + "px;left:0px;width:8px;height:9px;overflow:hidden;\">" + "<SPAN style=\"position:relative;top:-3px;left:-2px;color:" + this._color + ";font-family:Arial;font-size:12px\">" + "&#9658;<!-- right pointer -->" + "</span>" + "</div>" + "</TD>" + "</TR>" + "<TR name=\"blnArrowLeft\" width=\"8\" style=\"height:50%;width:8px;border:0px; margin:0px; padding:0px;\">" + "<td width=\"8\" align=\"center\" valign=\"bottom\" style=\"border:0px; height:inherit; margin:0px; max-width:8px; width:8px; \">" + "<div style=\"position:relative;height:100%;width:inherit;top:0px;left:0px;\">" + "<div style=\"position:absolute;bottom:" + this.cornerRadius + "px;left:0px;width:8px;height:9px;overflow:hidden;\">" + "<SPAN style=\"position:relative;top:-3px;left:-2px;color:" + this._color + ";font-family:Arial;font-size:12px\">" + "&#9658;<!-- right pointer -->" + "</span>" + "</div>" + "</div>" + "</TD>" + "</TR>" + "</tbody>" + "</TABLE>" + "</td>" + "</tr>" + "</tbody>" + "</TABLE>" + "<div name=\"blnClearOverlay\" style=\"position:absolute;top:0px;left:0px;width:100%;height:100%;cursor:pointer;\">" + "<input type=\"image\"  style=\"width:100%;height:100%;opacity:0.01;filter:alpha(opacity=1)\" />" + "</div>\n";
	this._div.style.cssText = "z-index: 102;position:absolute;top: " + trueTop + "px;left: " + trueLeft + "px;color: " + this._color + ";background-color: transparent;width: " + blnWidth + "px;margin: 0px;";
	this._img = this._div.getElementsByTagName("input")[0];
	this._div.container = this;
	this._img.container = this;
	this._img.src = Application.application["clearImage"];
	this._img.onclick = $closure(com.inq.ui.BalloonOverlaying,"_doClick");
	if(this._div.parentNode == null) _parent.appendChild(this._div);
	else if(this._div.parentNode != _parent) {
		this._div.parentNode.removeChild(this._div);
		_parent.appendChild(this._div);
	}
	var contents = this._div.getElementsByTagName("SPAN");
	var ix;
	{
		var _g1 = 0, _g = contents.length;
		while(_g1 < _g) {
			var ix1 = _g1++;
			if(contents[ix1].className == "box-contents") {
				contents[ix1].className = this._styleName;
				contents[ix1].style.cssText = defaultStyle + ";background-color:tranparent";
			}
		}
	}
	this._fixSizesAndPositions();
	this._div.style.left = trueLeft + "px";
	this._div.style.top = trueTop + "px";
}
com.inq.ui.BalloonOverlaying.prototype.setHandCursor = function(val) {
	var value = val;
	switch(value.toLowerCase()) {
	case "true":{
		this._useHandCursor = true;
	}break;
	case "false":{
		this._useHandCursor = false;
	}break;
	default:{
		this._useHandCursor = false;
	}break;
	}
	this.useHandCursor = ((this._useHandCursor)?"true":"false");
}
com.inq.ui.BalloonOverlaying.prototype.setID = function(val) {
	com.inq.ui.Container.prototype.setID.apply(this,[val]);
	if(this._img != null) this._img.id = val + "_img";
}
com.inq.ui.BalloonOverlaying.prototype.useHandCursor = null;
com.inq.ui.BalloonOverlaying.prototype.__class__ = com.inq.ui.BalloonOverlaying;
com.inq.flash.client.data.ChatCommunicationOpenerMessage = function(chat,text,agentAlias) { if( chat === $_ ) return; {
	com.inq.flash.client.data.ChatCommunicationMessage.apply(this,[chat,text]);
	this.setMessageType(com.inq.flash.client.data.MessageFields.TYPE_CHAT_COMMUNICATION_OPENER);
	this.addProperty(com.inq.flash.client.data.MessageFields.KEY_RETURN_RECEIPT,"0");
	if(agentAlias != null) this.addProperty(com.inq.flash.client.data.MessageFields.KEY_AGENT_ALIAS,agentAlias);
}}
com.inq.flash.client.data.ChatCommunicationOpenerMessage.__name__ = ["com","inq","flash","client","data","ChatCommunicationOpenerMessage"];
com.inq.flash.client.data.ChatCommunicationOpenerMessage.__super__ = com.inq.flash.client.data.ChatCommunicationMessage;
for(var k in com.inq.flash.client.data.ChatCommunicationMessage.prototype ) com.inq.flash.client.data.ChatCommunicationOpenerMessage.prototype[k] = com.inq.flash.client.data.ChatCommunicationMessage.prototype[k];
com.inq.flash.client.data.ChatCommunicationOpenerMessage.prototype.__class__ = com.inq.flash.client.data.ChatCommunicationOpenerMessage;
com.inq.flash.client.control.PersistenceManager = function(p) { if( p === $_ ) return; {
	this.getCookieInfo();
}}
com.inq.flash.client.control.PersistenceManager.__name__ = ["com","inq","flash","client","control","PersistenceManager"];
com.inq.flash.client.control.PersistenceManager.Close = function() {
	com.inq.flash.client.control.PersistenceManager.__inst = null;
}
com.inq.flash.client.control.PersistenceManager.reopen = function() {
	com.inq.flash.client.control.PersistenceManager.__inst = new com.inq.flash.client.control.PersistenceManager();
}
com.inq.flash.client.control.PersistenceManager.ClearValues = function() {
	if(com.inq.flash.client.control.PersistenceManager.__inst != null) com.inq.flash.client.control.PersistenceManager.__inst.clearValues();
}
com.inq.flash.client.control.PersistenceManager.GetValue = function(label,defaultVal) {
	if(com.inq.flash.client.control.PersistenceManager.__inst != null) return com.inq.flash.client.control.PersistenceManager.__inst.getValue(label,defaultVal);
	return defaultVal;
}
com.inq.flash.client.control.PersistenceManager.SetValue = function(label,val,force,updateCookies) {
	if(updateCookies == null) updateCookies = true;
	if(force == null) force = false;
	if(com.inq.flash.client.control.PersistenceManager.__inst != null) com.inq.flash.client.control.PersistenceManager.__inst.setValue(label,val,force,updateCookies);
}
com.inq.flash.client.control.PersistenceManager.SetValues = function(map) {
	if(com.inq.flash.client.control.PersistenceManager.__inst != null) com.inq.flash.client.control.PersistenceManager.__inst.setValues(map);
}
com.inq.flash.client.control.PersistenceManager.createInstance = function() {
	haxe.Log.trace("create PersistenceManager",{ fileName : "PersistenceManager.hx", lineNumber : 105, className : "com.inq.flash.client.control.PersistenceManager", methodName : "createInstance"});
	return new com.inq.flash.client.control.PersistenceManager();
}
com.inq.flash.client.control.PersistenceManager.prototype.clearValues = function() {
	this.dict = { }
	this.setCookieInfo();
}
com.inq.flash.client.control.PersistenceManager.prototype.dict = null;
com.inq.flash.client.control.PersistenceManager.prototype.getCookieInfo = function() {
	this.dict = com.inq.flash.client.control.FlashPeer.getV3Data();
}
com.inq.flash.client.control.PersistenceManager.prototype.getValue = function(label,defaultVal) {
	var value = this.dict[label];
	if(null == value) value = defaultVal;
	haxe.Log.trace("value [" + label + "]:" + value,{ fileName : "PersistenceManager.hx", lineNumber : 56, className : "com.inq.flash.client.control.PersistenceManager", methodName : "getValue"});
	return value;
}
com.inq.flash.client.control.PersistenceManager.prototype.setCookieInfo = function() {
	com.inq.flash.client.control.FlashPeer.setV3Data(this.dict);
}
com.inq.flash.client.control.PersistenceManager.prototype.setValue = function(label,val,force,updateCookies) {
	if(updateCookies == null) updateCookies = true;
	if(force == null) force = false;
	if(force || this.dict[label] != val) {
		this.dict[label] = val;
		if(updateCookies) {
			this.setCookieInfo();
		}
	}
}
com.inq.flash.client.control.PersistenceManager.prototype.setValues = function(map) {
	var ix;
	var keyz = Reflect.fields(map);
	{
		var _g1 = 0, _g = keyz.length;
		while(_g1 < _g) {
			var ix1 = _g1++;
			var k = "" + keyz[ix1];
			var v = map[k];
			this.dict[k] = v;
		}
	}
	com.inq.flash.client.control.FlashPeer.setV3Data(this.dict);
}
com.inq.flash.client.control.PersistenceManager.prototype.__class__ = com.inq.flash.client.control.PersistenceManager;
com.inq.flash.client.chatskins.SkinControl = function() { }
com.inq.flash.client.chatskins.SkinControl.__name__ = ["com","inq","flash","client","chatskins","SkinControl"];
com.inq.flash.client.chatskins.SkinControl.inqPersistentUrl = null;
com.inq.flash.client.chatskins.SkinControl.sPopCID = null;
com.inq.flash.client.chatskins.SkinControl.sPerCID = null;
com.inq.flash.client.chatskins.SkinControl.flashVars = null;
com.inq.flash.client.chatskins.SkinControl.applicationController = null;
com.inq.flash.client.chatskins.SkinControl.connectionType = null;
com.inq.flash.client.chatskins.SkinControl.transcriptAgentColor = null;
com.inq.flash.client.chatskins.SkinControl.transcriptCustomerColor = null;
com.inq.flash.client.chatskins.SkinControl.transcriptFontSize = null;
com.inq.flash.client.chatskins.SkinControl.transcriptIndent = null;
com.inq.flash.client.chatskins.SkinControl.transcriptTabStops = null;
com.inq.flash.client.chatskins.SkinControl.transcriptFont = null;
com.inq.flash.client.chatskins.SkinControl.transcriptAgentSample = null;
com.inq.flash.client.chatskins.SkinControl.getOpener = function() {
	var opener = null;
	try {
		opener = window.parent.opener.inqFrame;
	}
	catch( $e78 ) {
		{
			var e = $e78;
			{
				haxe.Log.trace("SkinControl.getOpener Error " + e,{ fileName : "SkinControl.hx", lineNumber : 183, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "getOpener", customParams : ["error"]});
			}
		}
	}
	return opener;
}
com.inq.flash.client.chatskins.SkinControl.StopTimer = function() {
	if(com.inq.flash.client.chatskins.SkinControl.timerTimeout != null) {
		com.inq.flash.client.chatskins.SkinControl.timerTimeout.stop();
		com.inq.flash.client.chatskins.SkinControl.timerTimeout = null;
	}
}
com.inq.flash.client.chatskins.SkinControl.stopOpenerScript = function(bForce) {
	if(bForce == null) bForce = false;
	if(com.inq.flash.client.chatskins.SkinControl.openerScript != null) {
		haxe.Log.trace("stop OpenerScript",{ fileName : "SkinControl.hx", lineNumber : 200, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "stopOpenerScript"});
		com.inq.flash.client.chatskins.SkinControl.openerScript.stop(bForce);
	}
}
com.inq.flash.client.chatskins.SkinControl.extractBrowserNameAndVersion = function(userAgent) {
	var browser = null;
	var replaceWith = null;
	var pattern = null;
	var patternTable = [{ browser : "Chrome", pattern : "(.*)(Chrome)([/| ])([0-9a-zA-Z.]*)( .*)", replaceWith : "Chrome $4"},{ browser : "IE", pattern : "(.*)(MSIE)( )([0-9.]*)(;.*)", replaceWith : "IE $4"},{ browser : "IE", pattern : "(.*)(MSIE)(.*)", replaceWith : "IE"},{ browser : "Firefox", pattern : "(.*)(Gecko)([/ ])([0-9]*)(.*)(Firefox)([/ ])([0-9a-zA-Z.]*)(.*)", replaceWith : "$6 $8 $4"},{ browser : "Firefox", pattern : "(.*)(Firefox)([/| ])([0-9a-zA-Z.]*)(.*)", replaceWith : "$2 $4"},{ browser : "Firefox", pattern : "(.*)(Firefox)(.*)", replaceWith : "$2"},{ browser : "Safari", pattern : "(.*)(AppleWebKit)(.*)(Version)([/| ])([0-9a-zA-Z.]*)( .*)", replaceWith : "Safari $6"},{ browser : "Safari", pattern : "(.*)(AppleWebKit)(.*)", replaceWith : "Safari"},{ browser : "Opera", pattern : "(.*)(Opera)([/| ])([0-9a-zA-Z.]*)(.*)", replaceWith : "$2 $4"},{ browser : "Opera", pattern : "(.*)(Opera)(.*)", replaceWith : "$2"},{ browser : "Lobo", pattern : "(.*)(Lobo)([/| ])([0-9a-zA-Z.]*)(.*)", replaceWith : "$2 $4"},{ browser : "Beonex", pattern : "(.*)(Beonex)([/| ])([0-9a-zA-Z.]*)(.*)", replaceWith : "$2 $4"},{ browser : "BonEcho", pattern : "(.*)(BonEcho)([/| ])([0-9a-zA-Z.]*)(.*)", replaceWith : "$2 $4"},{ browser : "Camino", pattern : "(.*)(Camino)([/| ])([0-9a-zA-Z.]*)(.*)", replaceWith : "$2 $4"},{ browser : "Chimera", pattern : "(.*)(Chimera)([/| ])([0-9a-zA-Z.]*)(.*)", replaceWith : "$2 $4"},{ browser : "Dillo", pattern : "(.*)(Dillo)([/ ])([0-9a-zA-Z.]*)(.*)", replaceWith : "$2 $4"},{ browser : "Elinks", pattern : "(.*)(Elinks)([/ (])([0-9a-zA-Z.]*)(.*)", replaceWith : "$2 $4"},{ browser : "Epiphany", pattern : "(.*)(Epiphany)([/ ])([0-9a-zA-Z.]*)(.*)", replaceWith : "$2 $4"},{ browser : "Firebird", pattern : "(.*)(Firebird)([/ ])([0-9a-zA-Z.]*)(.*)", replaceWith : "$2 $4"},{ browser : "Flock", pattern : "(.*)(Flock)([/ ])([0-9a-zA-Z.]*)(.*)", replaceWith : "$2 $4"},{ browser : "Galeon", pattern : "(.*)(Galeon)([/ ])([0-9a-zA-Z.]*)(.*)", replaceWith : "$2 $4"},{ browser : "GranParadiso", pattern : "(.*)(GranParadiso)([/ ])([0-9a-zA-Z.]*)(.*)", replaceWith : "$2 $4"},{ browser : "IBrowse", pattern : "(.*)(IBrowse)([/ ])([0-9a-zA-Z.]*)(.*)", replaceWith : "$2 $4"},{ browser : "iCab", pattern : "(.*)(iCab)([/ ])([0-9a-zA-Z.]*)(.*)", replaceWith : "$2 $4"},{ browser : "Iceape", pattern : "(.*)(Iceape)([/ ])([0-9a-zA-Z.]*)(.*)", replaceWith : "$2 $4"},{ browser : "Iceweasel", pattern : "(.*)(Iceweasel)([/ ])([0-9a-zA-Z.]*)(.*)", replaceWith : "$2 $4"},{ browser : "K-Meleon", pattern : "(.*)(K-Meleon)([/ ])([0-9a-zA-Z.]*)(.*)", replaceWith : "$2 $4"},{ browser : "K-Ninja", pattern : "(.*)(K-Ninja)([/ ])([0-9a-zA-Z.]*)(.*)", replaceWith : "$2 $4"},{ browser : "Kazehakase", pattern : "(.*)(Kazehakase)([/ ])([0-9a-zA-Z.]*)(.*)", replaceWith : "$2 $4"},{ browser : "Links", pattern : "(.*)(Links)([/( ])([0-9a-zA-Z.]*)(.*)", replaceWith : "$2 $4"},{ browser : "Lynx", pattern : "(.*)(Lynx)([y/ ])([0-9a-zA-Z.]*)(.*)", replaceWith : "$2 $4"},{ browser : "Minefield", pattern : "(.*)(Minefield)([/ ])([0-9a-zA-Z.]*)(.*)", replaceWith : "$2 $4"},{ browser : "MultiZilla", pattern : "(.*)(MultiZilla)([/ ])([0-9a-zA-Z.]*)(.*)", replaceWith : "$2 $4"},{ browser : "Mosaic", pattern : "(.*)(Mosaic)([/ ])([0-9a-zA-Z.]*)(.*)", replaceWith : "$2 $4"},{ browser : "NetNewsWire", pattern : "(.*)(NetNewsWire)([/ ])([0-9a-zA-Z.]*)(.*)", replaceWith : "$2 $4"},{ browser : "Netscape", pattern : "(.*)(Netscape)([6]*)([/ ])([0-9a-zA-Z.]*)(.*)", replaceWith : "$2 $5"},{ browser : "OmniWeb", pattern : "(.*)(OmniWeb)([/ ])([0-9a-zA-Z.]*)(.*)", replaceWith : "$2 $4"},{ browser : "Oregano", pattern : "(.*)(Oregano)([/ ])([0-9a-zA-Z.]*)(.*)", replaceWith : "$2 $4"},{ browser : "Phoenix", pattern : "(.*)(Phoenix)([/ ])([0-9a-zA-Z.]*)(.*)", replaceWith : "$2 $4"},{ browser : "SeaMonkey", pattern : "(.*)(SeaMonkey)([/ ]*)([0-9a-zA-Z.]*)(.*)", replaceWith : "$2 $4"},{ browser : "Shiira", pattern : "(.*)(Shiira)([/ ]*)(([0-9][0-9a-zA-Z.]*)|([ ]))(.*)", replaceWith : "$2 $4"},{ browser : "Sunrise", pattern : "(.*)(Sunrise)([/ ]*)(([0-9][0-9a-zA-Z.]*)|([ ]))(.*)", replaceWith : "$2 $4"},{ browser : "Netscape", pattern : "(.*)(Mozilla)([/ ])([0-9a-zA-Z.]*)(.*)", replaceWith : "Netscape $4"}];
	var ix = 0;
	{
		var _g1 = 0, _g = patternTable.length;
		while(_g1 < _g) {
			var i = _g1++;
			pattern = new EReg(patternTable[i].pattern,"i");
			replaceWith = patternTable[i].replaceWith;
			var b = pattern.match(userAgent);
			if(b) return pattern.replace(userAgent,replaceWith);
		}
	}
	return "Unknown";
}
com.inq.flash.client.chatskins.SkinControl.setTestInqPersistentButton = function() {
	var bDebugger = false;
	var cmd;
	cmd = "Inq.FlashPeer.setPersistentButtonDebugActive(" + bDebugger + ");";
	com.inq.flash.client.chatskins.SkinControl.runJavaScript(cmd,true);
}
com.inq.flash.client.chatskins.SkinControl.showHtmlPersistentButton = function(bShow) {
	var iWidth = 402;
	var iHeight = 40;
	var iLeft = 10;
	var iTop = 110;
	var ClickPersistent = Application.application.ClickPersistent;
	var cmd = null;
	com.inq.flash.client.chatskins.SkinControl.setTestInqPersistentButton();
	iLeft = Math.round(ClickPersistent.getX());
	iTop = Math.round(ClickPersistent.getY());
	iHeight = Math.round(ClickPersistent.getHeight());
	iWidth = Math.round(ClickPersistent.getWidth());
	cmd = "InqFlashPeer.showPersistentButton (" + iTop + "," + iLeft + "," + iWidth + "," + iHeight + ");";
	try {
		com.inq.flash.client.chatskins.SkinControl.runJavaScript(cmd,true);
	}
	catch( $e79 ) {
		if( js.Boot.__instanceof($e79,Error) ) {
			var e = $e79;
			{
				haxe.Log.trace("HtmlPersistentButton: show button failed," + e,{ fileName : "SkinControl.hx", lineNumber : 321, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "showHtmlPersistentButton"});
			}
		} else throw($e79);
	}
	if(bShow) return;
	cmd = "InqFlashPeer.hidePersistentButton();";
	try {
		com.inq.flash.client.chatskins.SkinControl.runJavaScript(cmd,true);
	}
	catch( $e80 ) {
		if( js.Boot.__instanceof($e80,Error) ) {
			var e = $e80;
			{
				haxe.Log.trace("HtmlPersistentButton: hide button failed," + e,{ fileName : "SkinControl.hx", lineNumber : 328, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "showHtmlPersistentButton"});
			}
		} else throw($e80);
	}
}
com.inq.flash.client.chatskins.SkinControl.getApplicationController = function() {
	return com.inq.flash.client.chatskins.SkinControl.applicationController;
}
com.inq.flash.client.chatskins.SkinControl.forceFocus = function() {
	try {
		haxe.Log.trace("ExternalInterface.call(\"Inq.FlashPeer.ForceFocus\")",{ fileName : "SkinControl.hx", lineNumber : 341, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "forceFocus"});
		com.inq.external.ExternalInterface.call("Inq.FlashPeer.ForceFocus");
	}
	catch( $e81 ) {
		if( js.Boot.__instanceof($e81,Error) ) {
			var e = $e81;
			{
				haxe.Log.trace("ERROR: " + e,{ fileName : "SkinControl.hx", lineNumber : 346, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "forceFocus"});
			}
		} else throw($e81);
	}
	return;
}
com.inq.flash.client.chatskins.SkinControl.SkinResize = function(data) {
	try {
		Application.application.setWidth(Application.application.screen.getWidth());
		Application.application.setHeight(Application.application.screen.getHeight());
	}
	catch( $e82 ) {
		if( js.Boot.__instanceof($e82,Error) ) {
			var err = $e82;
			null;
		} else throw($e82);
	}
	return true;
}
com.inq.flash.client.chatskins.SkinControl.ResizeFramesFromSwf = function() {
	if(com.inq.external.ExternalInterface.available) try {
		com.inq.external.ExternalInterface.call("Inq.PersistentFrame.ResizeFramesFromSwf");
	}
	catch( $e83 ) {
		if( js.Boot.__instanceof($e83,Error) ) {
			var error = $e83;
			null;
		} else throw($e83);
	}
}
com.inq.flash.client.chatskins.SkinControl.Base62 = function(val) {
	var sChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890";
	var sResult = "";
	var iVal = val;
	var iRem;
	do {
		iRem = iVal % 62;
		iVal -= iRem;
		iVal = Math.floor(iVal / 62);
		sResult = sResult + sChars.charAt(iRem);
	} while(iVal > 0);
	return sResult;
}
com.inq.flash.client.chatskins.SkinControl.setupLocalConnections = function() {
	var chatid;
	try {
		chatid = com.inq.flash.client.control.FlashVars.getFlashVars().chatID;
	}
	catch( $e84 ) {
		if( js.Boot.__instanceof($e84,Error) ) {
			var e = $e84;
			{
				haxe.Log.trace("SkinControl.setupLocalConnections Error " + e,{ fileName : "SkinControl.hx", lineNumber : 398, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "setupLocalConnections", customParams : ["error"]});
			}
		} else throw($e84);
	}
	var id = Std.parseInt(com.inq.flash.client.control.FlashVars.getFlashVars()["chatID"]);
	if(id < 0) id = 0 - id;
	var suffix = com.inq.flash.client.chatskins.SkinControl.Base62(id);
	com.inq.flash.client.chatskins.SkinControl.sPopCID = "pop" + suffix;
	com.inq.flash.client.chatskins.SkinControl.sPerCID = "per" + suffix;
	var myClient = { doTranscript : null}
	if(com.inq.flash.client.control.FlashVars.getPersistentFrame()) {
		var domains = ["*"];
		myClient.doTranscript = $closure(com.inq.flash.client.chatskins.SkinControl,"applyTranscriptToPersistent");
		try {
			null;
		}
		catch( $e85 ) {
			if( js.Boot.__instanceof($e85,Error) ) {
				var e = $e85;
				{
					haxe.Log.trace("error: " + e,{ fileName : "SkinControl.hx", lineNumber : 435, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "setupLocalConnections"});
				}
			} else throw($e85);
		}
	}
	else {
		try {
			null;
		}
		catch( $e86 ) {
			if( js.Boot.__instanceof($e86,Error) ) {
				var e = $e86;
				{
					haxe.Log.trace("error: " + e,{ fileName : "SkinControl.hx", lineNumber : 455, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "setupLocalConnections"});
				}
			} else throw($e86);
		}
	}
}
com.inq.flash.client.chatskins.SkinControl.applyTranscriptToPersistent = function(sHtml) {
	com.inq.flash.client.chatskins.SkinControl.cw.setHtmlText(sHtml);
}
com.inq.flash.client.chatskins.SkinControl.setSocketIP = function(crAddress) {
	com.inq.flash.client.chatskins.SkinControl.sSocketIP = crAddress;
}
com.inq.flash.client.chatskins.SkinControl.IdentifyPlatform = function() {
	var sep;
	var sPlatformInfo;
	sep = "^^";
	sPlatformInfo = "";
	sPlatformInfo += com.inq.flash.client.chatskins.SkinControl.CSDL_OS + com.inq.utils.Capabilities.os + sep + com.inq.flash.client.chatskins.SkinControl.CSDL_PLAYER + com.inq.utils.Capabilities.playerType + sep + com.inq.flash.client.chatskins.SkinControl.CSDL_MANUFACTURER + com.inq.utils.Capabilities.manufacturer + sep;
	if(com.inq.flash.client.chatskins.SkinControl.connectionType != null) sPlatformInfo += com.inq.flash.client.chatskins.SkinControl.CSDL_CONNECTION + com.inq.flash.client.chatskins.SkinControl.connectionType + sep;
	try {
		if(com.inq.flash.client.control.FlashVars.getUserAgent() != "") {
			com.inq.flash.client.control.FlashVars.getFlashVars()["userAgent"] = js.Lib.window.navigator.userAgent;
			sPlatformInfo += com.inq.flash.client.chatskins.SkinControl.CSDL_USERAGENT + StringTools.htmlEscape(com.inq.flash.client.control.FlashVars.getUserAgent()) + sep + com.inq.flash.client.chatskins.SkinControl.CSDL_BROWSER + com.inq.flash.client.chatskins.SkinControl.extractBrowserNameAndVersion(com.inq.flash.client.control.FlashVars.getUserAgent()) + sep;
			if(!com.inq.flash.client.chatskins.SkinControl.isContinued() && com.inq.flash.client.chatskins.SkinControl.getIsPersistentChat()) sPlatformInfo += com.inq.flash.client.chatskins.SkinControl.CSDL_CLICK2PER + "YES" + sep;
		}
	}
	catch( $e87 ) {
		if( js.Boot.__instanceof($e87,Error) ) {
			var e = $e87;
			null;
		} else throw($e87);
	}
	var sVersionString = com.inq.utils.Capabilities.version;
	sPlatformInfo += com.inq.flash.client.chatskins.SkinControl.CSDL_VERSION + sVersionString + sep;
	haxe.Log.trace("IdentifyPlatform(): exit",{ fileName : "SkinControl.hx", lineNumber : 519, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "IdentifyPlatform"});
	return sPlatformInfo;
}
com.inq.flash.client.chatskins.SkinControl.setApplicationController = function(controller) {
	haxe.Log.trace("setApplicationController: entered",{ fileName : "SkinControl.hx", lineNumber : 525, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "setApplicationController"});
	com.inq.flash.client.chatskins.SkinControl.applicationController = controller;
}
com.inq.flash.client.chatskins.SkinControl.getFlashVars = function() {
	return com.inq.flash.client.control.FlashVars.getFlashVars();
}
com.inq.flash.client.chatskins.SkinControl.ChatWindowInitialized = function() {
	haxe.Log.trace("chat window initialized",{ fileName : "SkinControl.hx", lineNumber : 535, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "ChatWindowInitialized"});
	com.inq.flash.client.chatskins.SkinControl.Test();
}
com.inq.flash.client.chatskins.SkinControl.setTranscriptWindowSettings = function() {
	com.inq.flash.client.chatskins.SkinControl.transcriptAgentColor = "#0000CB";
	com.inq.flash.client.chatskins.SkinControl.transcriptCustomerColor = "#000000";
	com.inq.flash.client.chatskins.SkinControl.transcriptFontSize = "11pt";
	com.inq.flash.client.chatskins.SkinControl.transcriptIndent = "" + 80;
	com.inq.flash.client.chatskins.SkinControl.transcriptTabStops = "[" + com.inq.flash.client.chatskins.SkinControl.transcriptIndent + "]";
	com.inq.flash.client.chatskins.SkinControl.transcriptFont = "Veranda";
	com.inq.flash.client.chatskins.SkinControl.transcriptAgentSample = "Jessica:  ";
	try {
		com.inq.flash.client.chatskins.SkinControl.transcriptAgentColor = "#" + ("000000" + Application.application.skinConfig.lAgentColor.toString(16)).substr(-6);
	}
	catch( $e88 ) {
		if( js.Boot.__instanceof($e88,Error) ) {
			var e = $e88;
			null;
		} else throw($e88);
	}
	try {
		com.inq.flash.client.chatskins.SkinControl.transcriptCustomerColor = "#" + ("000000" + Application.application.skinConfig.lCustomerColor.toString(16)).substr(-6);
	}
	catch( $e89 ) {
		if( js.Boot.__instanceof($e89,Error) ) {
			var e = $e89;
			null;
		} else throw($e89);
	}
	try {
		com.inq.flash.client.chatskins.SkinControl.transcriptFontSize = ("000000" + Application.application.skinConfig["pointSize"] + "pt");
	}
	catch( $e90 ) {
		if( js.Boot.__instanceof($e90,Error) ) {
			var e = $e90;
			null;
		} else throw($e90);
	}
	try {
		com.inq.flash.client.chatskins.SkinControl.transcriptFont = Application.application.skinConfig["sFont"];
	}
	catch( $e91 ) {
		if( js.Boot.__instanceof($e91,Error) ) {
			var e = $e91;
			null;
		} else throw($e91);
	}
	try {
		com.inq.flash.client.chatskins.SkinControl.transcriptAgentSample = Application.application.skinConfig["sSampleAgentText"];
	}
	catch( $e92 ) {
		if( js.Boot.__instanceof($e92,Error) ) {
			var e = $e92;
			null;
		} else throw($e92);
	}
}
com.inq.flash.client.chatskins.SkinControl.AddCustomerTextToChatWindow = function(Msg,position) {
	var clientName = com.inq.flash.client.control.FlashVars.getFlashVars().userName;
	return com.inq.flash.client.chatskins.SkinControl.AddTranscriptItemToChatWindow(clientName,Msg,com.inq.flash.client.chatskins.ChatTextArea.CUSTOMER,position);
}
com.inq.flash.client.chatskins.SkinControl.ReAddCustomerTextToChatWindow = function(Msg,position) {
	var clientName = com.inq.flash.client.control.FlashVars.getFlashVars().userName;
	if(com.inq.flash.client.chatskins.SkinControl.hostIndx < com.inq.flash.client.chatskins.SkinControl.customerIndx) return -1;
	com.inq.flash.client.chatskins.SkinControl.hostIndx++;
	return com.inq.flash.client.chatskins.SkinControl.AddTranscriptItemToChatWindow(clientName,Msg,com.inq.flash.client.chatskins.ChatTextArea.CUSTOMER,position);
}
com.inq.flash.client.chatskins.SkinControl.isContinued = function() {
	var bContinued = com.inq.flash.client.control.FlashVars.isContinued();
	return ((bContinued)?true:false);
}
com.inq.flash.client.chatskins.SkinControl.ClearTranscript = function() {
	haxe.Log.trace("SkinControl.ClearTranscript: entered",{ fileName : "SkinControl.hx", lineNumber : 581, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "ClearTranscript"});
	try {
		if(null != com.inq.flash.client.chatskins.SkinControl.cw) {
			com.inq.flash.client.chatskins.SkinControl.cw.clearTranscript();
		}
	}
	catch( $e93 ) {
		if( js.Boot.__instanceof($e93,Error) ) {
			var e = $e93;
			{
				haxe.Log.trace("ClearTranscript error: " + e,{ fileName : "SkinControl.hx", lineNumber : 587, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "ClearTranscript", customParams : ["error"]});
			}
		} else throw($e93);
	}
}
com.inq.flash.client.chatskins.SkinControl.AddTranscriptItemToChatWindow = function(Id,Msg,ChatType,position) {
	var val = -1;
	haxe.Log.trace("SkinControl.AddTranscriptItemToChatWindow: entered",{ fileName : "SkinControl.hx", lineNumber : 594, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "AddTranscriptItemToChatWindow"});
	try {
		val = com.inq.flash.client.chatskins.SkinControl.cw.addTranscript(Id,Msg,ChatType,position);
		haxe.Timer.delay(function() {
			com.inq.flash.client.chatskins.FormMgr.updateForm(com.inq.flash.client.chatskins.SkinControl.cw);
		},com.inq.flash.client.chatskins.ChatTextArea.RENDER_DELAY);
	}
	catch( $e94 ) {
		if( js.Boot.__instanceof($e94,Error) ) {
			var e = $e94;
			{
				haxe.Log.trace("SkinControl.AddTranscriptItemToChatWindow: ERROR:" + e,{ fileName : "SkinControl.hx", lineNumber : 599, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "AddTranscriptItemToChatWindow", customParams : ["error"]});
			}
		} else throw($e94);
	}
	return val;
}
com.inq.flash.client.chatskins.SkinControl.modifyDTFields = function(dtId,selectedLinkName) {
	var div = window.document.getElementById(dtId);
	var elements = div.getElementsByTagName("INPUT");
	if(elements.length > 0) {
		{
			var _g1 = 0, _g = elements.length;
			while(_g1 < _g) {
				var indx = _g1++;
				var el = elements[indx];
				com.inq.flash.client.chatskins.SkinControl.getApplicationController().sendInputState(el.name,"disabled","true",true);
				elements = div.getElementsByTagName("INPUT");
			}
		}
	}
	var elements1 = div.getElementsByTagName("A");
	if(elements1.length > 0) {
		{
			var _g1 = 0, _g = elements1.length;
			while(_g1 < _g) {
				var indx = _g1++;
				var el = elements1[indx];
				com.inq.flash.client.chatskins.SkinControl.getApplicationController().sendInputState(el.name,"disabled",((selectedLinkName != el.name)?"true":"bold"),true);
				elements1 = div.getElementsByTagName("A");
			}
		}
	}
}
com.inq.flash.client.chatskins.SkinControl.modifyDTString = function(msg,selectedLinkName,selectedCheckboxNames) {
	if(msg == null) {
		return null;
	}
	msg = new EReg("<input","ig").split(msg).join("<input disabled ");
	msg = new EReg("(<a[^>]*)(href[\\s]*=[\\s]*['\\\"][^'\\\"]*['\\\"])([^>]*>)","ig").replace(msg,"$1 $3");
	msg = new EReg("(<[^>]*)(onclick[\\s]*=[\\s]*['\\\"][^'\\\"]*return)([^>]*>)","ig").replace(msg,"$1 $2 false; $3");
	msg = new EReg("<a","ig").replace(msg,"<a style='color:gray;' ");
	if(selectedLinkName != null && selectedLinkName.length > 0) {
		var rg = new EReg("name[\\s]*=[\\s]*['\\\"]" + selectedLinkName + "['\\\"]","ig");
		var out = "name ='" + selectedLinkName + "' style='font-weight: bold; color:#323232;' ";
		msg = rg.split(msg).join(out);
		var rgLink = new EReg("<a([^>]*)(name[\\s]*=[\\s]*['\\\"]" + selectedLinkName + "['\\\"])([^>]*)>","ig");
		var outLink = "<a style= 'font-weight: bold; color:#323232;' onclick = 'return false;' $1>";
		msg = rgLink.replace(msg,outLink);
	}
	if(selectedCheckboxNames != null) {
		{
			var _g1 = 0, _g = selectedCheckboxNames.length;
			while(_g1 < _g) {
				var i = _g1++;
				var name = selectedCheckboxNames[i];
				var rg = new EReg("name[\\s]*=[\\s]*['\"]" + name + "['\"]","ig");
				var out = "name ='" + name + "' checked ";
				msg = rg.split(msg).join(out);
			}
		}
	}
	return msg;
}
com.inq.flash.client.chatskins.SkinControl.AddOpenerToChatWindow = function(Id,Msg,ChatType,position) {
	haxe.Log.trace("SkinControl.AddOpenerToChatWindow: entered",{ fileName : "SkinControl.hx", lineNumber : 705, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "AddOpenerToChatWindow"});
	try {
		com.inq.flash.client.chatskins.SkinControl.cw.addOpenerScript(Id,Msg,ChatType,position);
	}
	catch( $e95 ) {
		if( js.Boot.__instanceof($e95,Error) ) {
			var e = $e95;
			null;
		} else throw($e95);
	}
}
com.inq.flash.client.chatskins.SkinControl.MoveChatHistory = function(chatWindow) {
	return;
}
com.inq.flash.client.chatskins.SkinControl.isInApplication = function(name) {
	var bExists = false;
	try {
		var obj = Application.application[name];
		if(null != obj) bExists = true;
	}
	catch( $e96 ) {
		if( js.Boot.__instanceof($e96,Error) ) {
			var e = $e96;
			{
				bExists = false;
			}
		} else throw($e96);
	}
	return bExists;
}
com.inq.flash.client.chatskins.SkinControl.Test = function() {
	if(com.inq.flash.client.control.FlashVars.getPersistentFrame()) return;
	if(null != com.inq.flash.client.control.FlashVars.getChatID()) return;
}
com.inq.flash.client.chatskins.SkinControl.doChatExit = function() {
	com.inq.flash.client.chatskins.SkinControl.stopOpenerScript();
	com.inq.flash.client.chatskins.SkinControl.StopTimer();
	com.inq.flash.client.chatskins.SkinControl.applicationController.shutdownQuietly();
	var tY = com.inq.flash.client.control.FlashPeer.isThankYouEnabled();
	if(tY) {
		com.inq.flash.client.chatskins.SkinControl.doThankYou();
		if(com.inq.flash.client.chatskins.SkinControl.isClick2call() && !com.inq.flash.client.chatskins.SkinControl.getIsPersistentChat()) {
			var thankyouNoSubmit = Application.application.skinConfig["thankyouNoSubmit"];
			if(null != thankyouNoSubmit) {
				var btnThankYou = Application.application.btnThankYou;
				btnThankYou.setLabel(thankyouNoSubmit);
			}
		}
	}
}
com.inq.flash.client.chatskins.SkinControl.doThankYou = function() {
	var btn = Application.application.btnCloseChat;
	btn.addEventListener(com.inq.events.MouseEvent.CLICK,$closure(com.inq.flash.client.chatskins.SkinControl,"actionCloseThankYouNotice"));
	com.inq.flash.client.chatskins.SkinControl.gotoThankyouScene();
}
com.inq.flash.client.chatskins.SkinControl.agentClosesChat = function() {
	com.inq.flash.client.chatskins.SkinControl.applicationController.disable();
	com.inq.flash.client.control.PersistenceManager.ClearValues();
	com.inq.flash.client.control.PersistenceManager.Close();
	com.inq.flash.client.chatskins.ChatTextFocusMonitor.Close();
	com.inq.flash.client.chatskins.CoBrowseMgr.agentEndsCob();
	com.inq.flash.client.control.MinimizeManager.Close();
	var tY = com.inq.flash.client.control.FlashPeer.isThankYouEnabled();
	if(tY) {
		com.inq.flash.client.chatskins.SkinControl.doThankYou();
	}
	else {
		var agentExitLine = com.inq.flash.client.control.FlashVars.getFlashVars()["agentExitLine"];
		if(agentExitLine.length > 0) com.inq.flash.client.chatskins.SkinControl.AddTranscriptItemToChatWindow("",com.inq.flash.client.control.FlashVars.getFlashVars().agentExitLine,com.inq.flash.client.chatskins.ChatTextArea.SYSTEM,-1);
		com.inq.flash.client.chatskins.SkinControl.disableInput();
	}
}
com.inq.flash.client.chatskins.SkinControl.cleanUpChatAndThankyou = function() {
	com.inq.flash.client.chatskins.SkinControl.applicationController.customerClosesPopup();
	com.inq.flash.client.control.PersistenceManager.ClearValues();
	com.inq.flash.client.control.PersistenceManager.Close();
	com.inq.flash.client.chatskins.SkinControl.StopTimer();
	var btn = Application.application.btnCloseChat;
	btn.addEventListener(com.inq.events.MouseEvent.CLICK,$closure(com.inq.flash.client.chatskins.SkinControl,"actionBtnCloseChat"));
	com.inq.flash.client.chatskins.SkinControl.ClearTranscript();
	com.inq.flash.client.chatskins.SkinControl.doThankYou();
}
com.inq.flash.client.chatskins.SkinControl.timeoutClosesChat = function() {
	var tY = com.inq.flash.client.control.FlashPeer.isThankYouEnabled();
	if(tY) com.inq.flash.client.chatskins.SkinControl.cleanUpChatAndThankyou();
	else com.inq.flash.client.chatskins.SkinControl.actionBtnCloseChat(null);
}
com.inq.flash.client.chatskins.SkinControl.getThankYou = function() {
	var cTY = null;
	if(com.inq.flash.client.chatskins.SkinControl.wasSaleAction()) {
		cTY = Application.application.thankYouSale;
	}
	if(cTY == null) {
		cTY = Application.application.thankYou;
	}
	return cTY;
}
com.inq.flash.client.chatskins.SkinControl.getThankYouButton = function() {
	var out = null;
	if(com.inq.flash.client.chatskins.SkinControl.wasSaleAction()) {
		out = Application.application.btnThankYouSale;
	}
	if(out == null) {
		out = Application.application.btnThankYou;
	}
	return out;
}
com.inq.flash.client.chatskins.SkinControl.fireMxmlHandler = function(HandlerName) {
	try {
		var func = Application.application.skinConfig[HandlerName];
		if(func != null) func();
	}
	catch( $e97 ) {
		if( js.Boot.__instanceof($e97,Error) ) {
			var e = $e97;
			null;
		} else throw($e97);
	}
}
com.inq.flash.client.chatskins.SkinControl.gotoThankyouScene = function() {
	var cTY = com.inq.flash.client.chatskins.SkinControl.getThankYou();
	if(cTY != null) {
		com.inq.flash.client.chatskins.SkinControl.ClearTranscript();
		cTY.setVisible(true);
		com.inq.flash.client.chatskins.SkinControl.fireMxmlHandler("onThankYouVisible");
		var btnThankYou = com.inq.flash.client.chatskins.SkinControl.getThankYouButton();
		if(com.inq.flash.client.chatskins.SkinControl.tYImageLabel != "") {
			com.inq.flash.client.chatskins.SkinControl.defaultTYImageLabel = Application.application.btnThankYou.label;
			btnThankYou.setLabel(com.inq.flash.client.chatskins.SkinControl.tYImageLabel);
		}
		else {
			if(com.inq.flash.client.chatskins.SkinControl.defaultTYImageLabel != "") {
				btnThankYou.setLabel(com.inq.flash.client.chatskins.SkinControl.defaultTYImageLabel);
			}
		}
		if(com.inq.flash.client.chatskins.SkinControl.wasSaleAction()) {
			var thankYouSaleText = Application.application.skinConfig["thankYouSaleText"];
			if(thankYouSaleText != null) {
				if(btnThankYou != null) {
					btnThankYou.setLabel(thankYouSaleText);
				}
			}
		}
		try {
			if(com.inq.flash.client.chatskins.SkinControl.isClick2call()) {
				var chatCanvas = Application.application.callForm;
				chatCanvas.setVisible(false);
				chatCanvas = Application.application.callFormPersistent;
				chatCanvas.setVisible(false);
			}
		}
		catch( $e98 ) {
			if( js.Boot.__instanceof($e98,Error) ) {
				var e = $e98;
				{
					haxe.Log.trace("error" + e,{ fileName : "SkinControl.hx", lineNumber : 895, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "gotoThankyouScene"});
				}
			} else throw($e98);
		}
	}
	com.inq.flash.client.chatskins.SkinControl.disableInput();
}
com.inq.flash.client.chatskins.SkinControl.HideClientDecorations = function() {
	com.inq.ui.ClientBody.closeAll();
}
com.inq.flash.client.chatskins.SkinControl.HideChat = function() {
	try {
		com.inq.flash.client.chatskins.SkinControl.HideClientDecorations();
		com.inq.flash.client.chatskins.SkinControl.stopOpenerScript();
		com.inq.flash.client.chatskins.SkinControl.StopTimer();
		com.inq.flash.client.chatskins.SkinControl.runJavaScript("Inq.FlashPeer.closeChat(false)",true);
	}
	catch( $e99 ) {
		if( js.Boot.__instanceof($e99,Error) ) {
			var e = $e99;
			{
				haxe.Log.trace("ERROR " + e,{ fileName : "SkinControl.hx", lineNumber : 919, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "HideChat"});
			}
		} else throw($e99);
	}
}
com.inq.flash.client.chatskins.SkinControl.ShowChat = function() {
	null;
}
com.inq.flash.client.chatskins.SkinControl.requestLcKillPopup = function() {
	null;
}
com.inq.flash.client.chatskins.SkinControl.ask4Transcript = function() {
	null;
}
com.inq.flash.client.chatskins.SkinControl.showPersistentChatButtons = function(bShow) {
	haxe.Log.trace("SkinControl:showPersistentChatButtons(" + bShow + ");",{ fileName : "SkinControl.hx", lineNumber : 972, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "showPersistentChatButtons"});
	if(!com.inq.flash.client.control.FlashVars.getPersistentFrame()) {
		var clickPersistent = Application.application.ClickPersistent;
		if(null != clickPersistent) {
			clickPersistent.setVisible(bShow);
		}
	}
}
com.inq.flash.client.chatskins.SkinControl.showChatIDText = function(bShow) {
	haxe.Log.trace("SkinControl:showChatIDText(" + bShow + ");",{ fileName : "SkinControl.hx", lineNumber : 985, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "showChatIDText"});
	var chatIDText = Application.application.ChatIDText;
	if(com.inq.flash.client.chatskins.SkinControl.isInApplication("ChatIDText")) {
		chatIDText.setVisible(bShow);
	}
}
com.inq.flash.client.chatskins.SkinControl.killPopup = function() {
	haxe.Log.trace("SkinControl.killPopup: Entered",{ fileName : "SkinControl.hx", lineNumber : 995, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "killPopup"});
	if(com.inq.flash.client.chatskins.SkinControl.applicationController.isConnected()) com.inq.flash.client.chatskins.SkinControl.applicationController.shutdownQuietly();
	com.inq.flash.client.chatskins.SkinControl.showPersistentChatButtons(false);
	try {
		com.inq.flash.client.chatskins.SkinControl.runJavaScript("Inq.FlashPeer.closeChat(false);",false);
	}
	catch( $e100 ) {
		if( js.Boot.__instanceof($e100,Error) ) {
			var e = $e100;
			{
				com.inq.flash.client.chatskins.XTrace.StackTrace(e);
			}
		} else throw($e100);
	}
}
com.inq.flash.client.chatskins.SkinControl.endChatQuietPopup = function() {
	haxe.Log.trace("SkinControl.endChatQuietPopup: Entered",{ fileName : "SkinControl.hx", lineNumber : 1007, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "endChatQuietPopup"});
	com.inq.flash.client.chatskins.SkinControl.applicationController.customerClosesPopup();
	com.inq.flash.client.chatskins.SkinControl.quietPopup();
}
com.inq.flash.client.chatskins.SkinControl.quietPopup = function() {
	haxe.Log.trace("SkinControl.killPopup: Entered",{ fileName : "SkinControl.hx", lineNumber : 1017, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "quietPopup"});
	try {
		com.inq.flash.client.chatskins.SkinControl.runJavaScript("Inq.FlashPeer.closeChat(false);",true);
	}
	catch( $e101 ) {
		if( js.Boot.__instanceof($e101,Error) ) {
			var e = $e101;
			{
				com.inq.flash.client.chatskins.XTrace.StackTrace(e);
			}
		} else throw($e101);
	}
}
com.inq.flash.client.chatskins.SkinControl.goToPersistentChat = function(obj) {
	var sJs;
	var ix;
	var urlstring = null;
	var success;
	if(com.inq.flash.client.chatskins.SkinControl.bPersistBtnPressed == false) {
		com.inq.flash.client.chatskins.SkinControl.bPersistBtnPressed = true;
		success = com.inq.flash.client.control.FlashPeer.popOutChat(true,com.inq.flash.client.chatskins.SkinControl.resizable);
		com.inq.flash.client.chatskins.SkinControl.bPersistBtnPressed = false;
	}
	else {
		return;
	}
	success = true;
	if(success) return;
	com.inq.flash.client.chatskins.SkinControl.applicationController.shutdownQuietly();
	Application.application.ClickPersistent.enabled = false;
	if(null == Application.application.skinConfig.sPersistentFrameTitle) Application.application.skinConfig.sPersistentFrameTitle = "";
	var sTitle = Application.application.skinConfig.sPersistentFrameTitle;
	try {
		haxe.Log.trace("ExternalInterface.call(\"Inq.PersistentFrame.SetPersistentChatTitle\",sTitle)",{ fileName : "SkinControl.hx", lineNumber : 1055, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "goToPersistentChat"});
		com.inq.external.ExternalInterface.call("Inq.PersistentFrame.SetPersistentChatTitle",sTitle);
	}
	catch( $e102 ) {
		if( js.Boot.__instanceof($e102,Error) ) {
			var e = $e102;
			{
				com.inq.flash.client.chatskins.XTrace.StackTrace(e);
			}
		} else throw($e102);
	}
	if(null == urlstring) {
		try {
			haxe.Log.trace("ExternalInterface.call(\"Inq.PersistentFrame.onRequest\",\"\") ",{ fileName : "SkinControl.hx", lineNumber : 1061, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "goToPersistentChat"});
			com.inq.external.ExternalInterface.call("Inq.PersistentFrame.onRequest","");
		}
		catch( $e103 ) {
			if( js.Boot.__instanceof($e103,Error) ) {
				var e = $e103;
				{
					com.inq.flash.client.chatskins.XTrace.StackTrace(e);
				}
			} else throw($e103);
		}
	}
	else {
		ix = urlstring.indexOf("?");
		var sQuery;
		var sPath;
		if(ix >= 0) {
			sQuery = urlstring.substr(ix + 1);
			sPath = urlstring.substr(0,ix);
		}
		else {
			sPath = urlstring;
			sQuery = "";
		}
		try {
			haxe.Log.trace("ExternalInterface.call(\"Inq.PersistentFrame.setPersistentChatUrl\",sPath,sQuery)",{ fileName : "SkinControl.hx", lineNumber : 1082, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "goToPersistentChat"});
			com.inq.external.ExternalInterface.call("Inq.PersistentFrame.setPersistentChatUrl",sPath,sQuery);
			com.inq.external.ExternalInterface.call("Inq.PersistentFrame.onRequest","");
		}
		catch( $e104 ) {
			if( js.Boot.__instanceof($e104,Error) ) {
				var e = $e104;
				{
					com.inq.flash.client.chatskins.XTrace.StackTrace(e);
				}
			} else throw($e104);
		}
	}
}
com.inq.flash.client.chatskins.SkinControl.PushToFrameset = function(_sUrl,_sTarget) {
	try {
		var myURL = window.parent.document.URL;
		var destURL = ((_sUrl.substr(_sUrl.length - 1) != "/")?_sUrl:_sUrl.substr(0,_sUrl.length - 1));
		myURL = ((myURL.substr(myURL.length - 1) != "/")?myURL:myURL.substr(0,myURL.length - 1));
		if(_sTarget.toLowerCase() == "_self" && myURL.toLowerCase() == destURL.toLowerCase()) {
			haxe.Log.trace("SkinControl.PushToFrameset: already at target URL",{ fileName : "SkinControl.hx", lineNumber : 1097, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "PushToFrameset"});
			return;
		}
		var disableApplicationController = _sTarget.toLowerCase() == "_self" && !com.inq.flash.client.chatskins.SkinControl.getIsPersistentChat() && com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler.hasNoOutstandingMessages();
		com.inq.flash.client.chatskins.SkinControl.executeAfter(function() {
			if(disableApplicationController) com.inq.flash.client.chatskins.SkinControl.applicationController.disable();
			return com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler.hasNoOutstandingMessages();
		},function() {
			com.inq.flash.client.control.FlashPeer.PushToFrameset(destURL,_sTarget);
		},"SkinControl.PushToFrameset",null,function() {
			if(disableApplicationController) com.inq.flash.client.chatskins.SkinControl.applicationController.enable();
		});
	}
	catch( $e105 ) {
		if( js.Boot.__instanceof($e105,Error) ) {
			var e = $e105;
			{
				com.inq.flash.client.chatskins.XTrace.StackTrace("SkinControl.PushToFrameset:" + e,"error");
			}
		} else throw($e105);
	}
}
com.inq.flash.client.chatskins.SkinControl.enablePersistentChatButtonAndEstablishUrl = function(_sUrl) {
	haxe.Log.trace("SkinControl.enablePersistentChatButtonAndEstablishUrl entered",{ fileName : "SkinControl.hx", lineNumber : 1129, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "enablePersistentChatButtonAndEstablishUrl"});
	if(com.inq.flash.client.control.FlashVars.getPersistentFrame()) return;
	var ClickPersistent = Application.application.ClickPersistent;
	if(ClickPersistent.getVisible()) return;
	com.inq.flash.client.chatskins.SkinControl.showPersistentChatButtons(true);
	var chatWindow = Application.application.chatWindow;
	var chatBottom = Std.parseInt(chatWindow.getStyle("bottom"));
	var persHeight = Std.parseInt(ClickPersistent.getStyle("height"));
	var newChatBtm = chatBottom + persHeight;
	var newPersBtm = chatBottom;
	chatWindow.setStyle("bottom","" + newChatBtm);
	ClickPersistent.setStyle("bottom","" + newPersBtm);
	ClickPersistent.setStyle("left",chatWindow.getStyle("left"));
	ClickPersistent.setStyle("right",chatWindow.getStyle("right"));
	com.inq.flash.client.chatskins.SkinControl.cw.scrollToBottom();
	com.inq.flash.client.chatskins.SkinControl.inqPersistentUrl = _sUrl;
}
com.inq.flash.client.chatskins.SkinControl.runJavaScript = function(jsCmd,bExternalInterface) {
	try {
		if(bExternalInterface) com.inq.external.ExternalInterface.call("function(){\n" + jsCmd + "}");
		else null;
	}
	catch( $e106 ) {
		if( js.Boot.__instanceof($e106,Error) ) {
			var e = $e106;
			{
				haxe.Log.trace(e,{ fileName : "SkinControl.hx", lineNumber : 1163, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "runJavaScript"});
			}
		} else throw($e106);
	}
}
com.inq.flash.client.chatskins.SkinControl.runSetThankYouShownJavascript = function() {
	var jsCmd = "Inq.FlashPeer.showThankyou();";
	com.inq.flash.client.chatskins.SkinControl.runJavaScript(jsCmd,false);
}
com.inq.flash.client.chatskins.SkinControl.isClick2call = function() {
	if(!com.inq.flash.client.chatskins.SkinControl.click2call) com.inq.flash.client.chatskins.SkinControl.click2call = com.inq.flash.client.chatskins.SkinControl.isInApplication("btnCall");
	return com.inq.flash.client.chatskins.SkinControl.click2call;
}
com.inq.flash.client.chatskins.SkinControl.getCallerNameString = function() {
	return (com.inq.flash.client.chatskins.SkinControl.callerNameString.length == 0?com.inq.flash.client.control.FlashVars.getFlashVars().userName:com.inq.flash.client.chatskins.SkinControl.callerNameString);
}
com.inq.flash.client.chatskins.SkinControl.actionBtnCall = function(me) {
	try {
		com.inq.flash.client.chatskins.SkinControl.click2call = true;
		com.inq.flash.client.chatskins.SkinControl.callStreamData = com.inq.flash.client.chatskins.SkinControl.getCallStreamData() + com.inq.flash.client.chatskins.SkinControl.getCallFormData();
		var txtInput = com.inq.flash.client.chatskins.SkinControl.getTextInputField();
		var text = txtInput._getInput();
		if(text != "") {
			com.inq.flash.client.chatskins.SkinControl.stopOpenerScript();
			com.inq.flash.client.chatskins.SkinControl.StopTimer();
		}
		var thankyouNoAgentOnSubmit = Application.application.skinConfig["thankyouNoAgentOnSubmit"];
		var thankyouAfterHoursOnSubmit = Application.application.skinConfig["thankyouAfterHoursOnSubmit"];
		if(thankyouNoAgentOnSubmit == null && thankyouAfterHoursOnSubmit != null) thankyouNoAgentOnSubmit = thankyouAfterHoursOnSubmit;
		if(thankyouAfterHoursOnSubmit == null && thankyouNoAgentOnSubmit != null) thankyouAfterHoursOnSubmit = thankyouNoAgentOnSubmit;
		com.inq.flash.client.chatskins.SkinControl.applicationController.callButtonClicked();
	}
	catch( $e107 ) {
		{
			var unknown = $e107;
			{
				haxe.Log.trace("Unknown exception : " + Std.string(unknown),{ fileName : "SkinControl.hx", lineNumber : 1203, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "actionBtnCall"});
				return;
			}
		}
	}
}
com.inq.flash.client.chatskins.SkinControl.actionBtnSend = function(me) {
	var ti = com.inq.flash.client.chatskins.SkinControl.getTextInputField();
	var txt = ti._getInput();
	if(txt != "") {
		com.inq.flash.client.chatskins.SkinControl.stopOpenerScript();
		com.inq.flash.client.chatskins.SkinControl.StopTimer();
	}
	try {
		var msgcnt = com.inq.flash.client.control.PersistenceManager.GetValue("msgcnt",0);
		if(txt == com.inq.flash.client.chatskins.SkinControl.getIntroduction() && com.inq.flash.client.chatskins.SkinControl.keyCount < 1) {
			ti._setInput("");
		}
		com.inq.flash.client.chatskins.SkinControl.applicationController.sendButtonClicked();
		ti.setFocus();
	}
	catch( $e108 ) {
		if( js.Boot.__instanceof($e108,Error) ) {
			var e = $e108;
			null;
		} else throw($e108);
	}
}
com.inq.flash.client.chatskins.SkinControl.actionBtnPopOut = function(me) {
	return com.inq.flash.client.control.FlashPeer.popOutChat(true,com.inq.flash.client.chatskins.SkinControl.resizable);
}
com.inq.flash.client.chatskins.SkinControl.popoutChat = function() {
	var minimized = com.inq.ui.ClientBody.getElement("Minimized");
	if(minimized != null) {
		minimized.setStyle("alpha","75");
		minimized.setVisible(true);
	}
	return com.inq.flash.client.control.FlashPeer.popOutChat(true,com.inq.flash.client.chatskins.SkinControl.resizable);
}
com.inq.flash.client.chatskins.SkinControl.customerClosingChat = function() {
	com.inq.flash.client.chatskins.SkinControl.stopOpenerScript();
	com.inq.flash.client.chatskins.SkinControl.ClearTranscript();
	com.inq.flash.client.chatskins.SkinControl.endCobrowse();
	com.inq.flash.client.chatskins.SkinControl.StopTimer();
	com.inq.flash.client.control.PersistenceManager.ClearValues();
	com.inq.flash.client.control.PersistenceManager.Close();
	com.inq.flash.client.control.MinimizeManager.Close();
	com.inq.flash.client.chatskins.ScrollMonitor.Close();
	com.inq.flash.client.chatskins.ChatTextFocusMonitor.Close();
	if(!com.inq.flash.client.chatskins.SkinControl.applicationController.customerClosesPopup()) {
		com.inq.flash.client.chatskins.SkinControl.customerClosedChat();
	}
}
com.inq.flash.client.chatskins.SkinControl.customerClosedChat = function() {
	com.inq.flash.client.chatskins.SkinControl.applicationController.disable();
}
com.inq.flash.client.chatskins.SkinControl.actionBtnCloseThankyou = function(me) {
	com.inq.flash.client.chatskins.SkinControl.customerClosingChat();
	com.inq.flash.client.chatskins.SkinControl.bInitialized = false;
	com.inq.flash.client.chatskins.OpenerScript.resetOpenersStopped();
	com.inq.flash.client.chatskins.SkinControl.msgcntAtEntry = 0;
	if(com.inq.flash.client.control.FlashVars.getPersistentFrame()) window.parent.close();
	else {
		var btn = Application.application.btnCloseChat;
		if(btn != null) btn.addEventListener(com.inq.events.MouseEvent.CLICK,$closure(com.inq.flash.client.chatskins.SkinControl,"actionCloseThankYouNotice"));
		var cTY = Application.application.thankYou;
		if(cTY == null) com.inq.flash.client.chatskins.SkinControl.HideChat();
		if(!com.inq.flash.client.control.Incrementality.interacted) com.inq.flash.client.chatskins.SkinControl.HideChat();
		else {
			com.inq.flash.client.chatskins.SkinControl.doThankYou();
			if(com.inq.flash.client.chatskins.SkinControl.isClick2call() && !com.inq.flash.client.chatskins.SkinControl.getIsPersistentChat()) {
				var thankyouNoSubmit = Application.application.skinConfig["thankyouNoSubmit"];
				if(null != thankyouNoSubmit) {
					var btnThankYou = Application.application.btnThankYou;
					btnThankYou.setLabel(thankyouNoSubmit);
				}
			}
		}
	}
	com.inq.flash.client.control.FlashPeer.closePersistentWindowIfOpen();
	return true;
}
com.inq.flash.client.chatskins.SkinControl.endCobrowse = function() {
	com.inq.flash.client.chatskins.CoBrowseMgr.endCob();
}
com.inq.flash.client.chatskins.SkinControl.actionCloseThankYouNotice = function(me) {
	if(com.inq.flash.client.control.FlashVars.getPersistentFrame()) window.parent.close();
	else {
		com.inq.flash.client.chatskins.SkinControl.HideChat();
	}
	return false;
}
com.inq.flash.client.chatskins.SkinControl.actionBtnCloseChat = function(me) {
	com.inq.flash.client.chatskins.SkinControl.customerClosingChat();
	com.inq.flash.client.chatskins.SkinControl.bInitialized = false;
	com.inq.flash.client.chatskins.OpenerScript.resetOpenersStopped();
	com.inq.flash.client.chatskins.SkinControl.msgcntAtEntry = 0;
	if(Application.application.close != null) Application.application.close();
	if(com.inq.flash.client.control.FlashVars.getPersistentFrame()) {
		window.parent.close();
		com.inq.flash.client.chatskins.SkinControl.HideChat();
	}
	else {
		com.inq.flash.client.chatskins.SkinControl.HideChat();
		com.inq.flash.client.chatskins.SkinControl.HideClientDecorations();
	}
	return true;
}
com.inq.flash.client.chatskins.SkinControl.actionBtnClickToChat = function(me) {
	null;
}
com.inq.flash.client.chatskins.SkinControl.actionBtnCloseChatWindow = function(me) {
	com.inq.flash.client.chatskins.SkinControl.showPersistentChatButtons(false);
	com.inq.flash.client.chatskins.SkinControl.applicationController.shutdown();
	com.inq.flash.client.chatskins.SkinControl.runJavaScript("Inq.FlashPeer.closeChat(false);",true);
}
com.inq.flash.client.chatskins.SkinControl.actionClickOnTxtInput = function(me) {
	if(com.inq.flash.client.chatskins.SkinControl.bHaveFocus == false) {
		com.inq.flash.client.chatskins.SkinControl.bHaveFocus = true;
		haxe.Log.trace("Flash gained focus",{ fileName : "SkinControl.hx", lineNumber : 1387, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "actionClickOnTxtInput"});
	}
}
com.inq.flash.client.chatskins.SkinControl.actionAutoTabToPhoneField2 = function(ke) {
	var callerPhoneField1 = Application.application[com.inq.flash.client.chatskins.SkinControl.CALL_SUBMIT_PRE + "phoneField1"], callerPhoneField2 = Application.application[com.inq.flash.client.chatskins.SkinControl.CALL_SUBMIT_PRE + "phoneField2"];
	if(callerPhoneField1 != null && StringTools.trim(callerPhoneField1._getInput()).length == 3 && ((ke.keyCode >= 48 && ke.keyCode <= 57) || ke.keyCode == 39) && callerPhoneField1.getCursorPosition() == 3) {
		callerPhoneField2.setFocus();
	}
	return true;
}
com.inq.flash.client.chatskins.SkinControl.actionAutoTabToPhoneField3 = function(ke) {
	var callerPhoneField2 = Application.application[com.inq.flash.client.chatskins.SkinControl.CALL_SUBMIT_PRE + "phoneField2"], callerPhoneField3 = Application.application[com.inq.flash.client.chatskins.SkinControl.CALL_SUBMIT_PRE + "phoneField3"];
	if(callerPhoneField2 != null && StringTools.trim(callerPhoneField2._getInput()).length == 3 && ((ke.keyCode >= 48 && ke.keyCode <= 57) || ke.keyCode == 39) && callerPhoneField2.getCursorPosition() == 3) {
		callerPhoneField3.setFocus();
	}
	return true;
}
com.inq.flash.client.chatskins.SkinControl.setupButtons = function() {
	try {
		var stg = Application.application.stage;
		if(stg != null) stg.addEventListener(com.inq.events.Event.RESIZE,$closure(com.inq.flash.client.chatskins.SkinControl,"SkinResize"));
	}
	catch( $e109 ) {
		if( js.Boot.__instanceof($e109,Error) ) {
			var e = $e109;
			null;
		} else throw($e109);
	}
	if(com.inq.flash.client.chatskins.SkinControl.isInApplication("btnPopOut")) Application.application.btnPopOut.addEventListener(com.inq.events.MouseEvent.CLICK,$closure(com.inq.flash.client.chatskins.SkinControl,"actionBtnPopOut"));
	if(com.inq.flash.client.chatskins.SkinControl.isInApplication("ClickPersistent")) Application.application.ClickPersistent.addEventListener(com.inq.events.MouseEvent.CLICK,$closure(com.inq.flash.client.chatskins.SkinControl,"goToPersistentChat"));
	if(com.inq.flash.client.chatskins.SkinControl.isInApplication("ChatIDText")) Application.application.ChatIDText.setHtmlText("ID: <" + com.inq.flash.client.control.FlashVars.getFlashVars().chatID + ">");
	if(com.inq.flash.client.chatskins.SkinControl.isInApplication("btnSend")) Application.application.btnSend.addEventListener(com.inq.events.MouseEvent.CLICK,$closure(com.inq.flash.client.chatskins.SkinControl,"actionBtnSend"));
	if(com.inq.flash.client.chatskins.SkinControl.isInApplication("btnCall")) Application.application.btnCall.addEventListener(com.inq.events.MouseEvent.CLICK,$closure(com.inq.flash.client.chatskins.SkinControl,"actionBtnCall"));
	if(com.inq.flash.client.chatskins.SkinControl.isInApplication("chat_submit_phoneField1")) Application.application.chat_submit_phoneField1.addEventListener(com.inq.events.KeyboardEvent.KEY_UP,$closure(com.inq.flash.client.chatskins.SkinControl,"actionAutoTabToPhoneField2"));
	if(com.inq.flash.client.chatskins.SkinControl.isInApplication("chat_submit_phoneField2")) Application.application.chat_submit_phoneField2.addEventListener(com.inq.events.KeyboardEvent.KEY_UP,$closure(com.inq.flash.client.chatskins.SkinControl,"actionAutoTabToPhoneField3"));
	var tY = com.inq.flash.client.control.FlashPeer.isThankYouEnabled();
	if(com.inq.flash.client.chatskins.SkinControl.isInApplication("btnCloseChat")) Application.application.btnCloseChat.addEventListener(com.inq.events.MouseEvent.CLICK,(((tY)?$closure(com.inq.flash.client.chatskins.SkinControl,"actionBtnCloseThankyou"):$closure(com.inq.flash.client.chatskins.SkinControl,"actionBtnCloseChat"))));
	if(com.inq.flash.client.chatskins.SkinControl.isInApplication("txtInput")) {
		com.inq.flash.client.chatskins.SkinControl.getTextInputField().addEventListener(com.inq.events.MouseEvent.CLICK,$closure(com.inq.flash.client.chatskins.SkinControl,"actionClickOnTxtInput"));
	}
	if(com.inq.flash.client.chatskins.SkinControl.isInApplication("btnThankYou")) Application.application["btnThankYou"].addEventListener(com.inq.events.MouseEvent.CLICK,$closure(com.inq.flash.client.chatskins.SkinControl,"actionCloseThankYouNotice"));
	if(com.inq.flash.client.chatskins.SkinControl.isInApplication("btnThankYouSale")) {
		Application.application["btnThankYouSale"].addEventListener(com.inq.events.MouseEvent.CLICK,actionCloseThankyouNotice);
	}
}
com.inq.flash.client.chatskins.SkinControl.InitThankYouGraphic = function() {
	haxe.Log.trace("InitThankYouGraphic()",{ fileName : "SkinControl.hx", lineNumber : 1469, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "InitThankYouGraphic"});
	var thankYou = com.inq.flash.client.chatskins.SkinControl.getThankYou();
	thankYou.setVisible(false);
	haxe.Log.trace("InitThankYouGraphic(): Application.application.btnThankYou.visible = " + (((thankYou.getVisible())?"true":"false")),{ fileName : "SkinControl.hx", lineNumber : 1472, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "InitThankYouGraphic"});
	thankYou.onRelease = function(evt) {
		com.inq.flash.client.chatskins.SkinControl.showPersistentChatButtons(false);
		com.inq.flash.client.chatskins.SkinControl.applicationController.shutdown();
		com.inq.flash.client.chatskins.SkinControl.runJavaScript("Inq.FlashPeer.closeChat(false);",false);
	}
}
com.inq.flash.client.chatskins.SkinControl.checkForGoToPersistentChatMsg = function(msg) {
	haxe.Log.trace("SkinControl.as: checkForGoToPersistentChatMsg: entered",{ fileName : "SkinControl.hx", lineNumber : 1483, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "checkForGoToPersistentChatMsg"});
	if(null == msg) {
		haxe.Log.trace("msg is null",{ fileName : "SkinControl.hx", lineNumber : 1487, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "checkForGoToPersistentChatMsg"});
		return "";
	}
	var sMsgRevised = msg;
	haxe.Log.trace("SkinControl.as: checkForGoToPersistentChatMsg: msg = " + sMsgRevised.split("<").join("[").split(">").join("]"),{ fileName : "SkinControl.hx", lineNumber : 1498, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "checkForGoToPersistentChatMsg"});
	var indx = msg.indexOf("asfunction:goToPersistentChat,");
	var sUrl = null;
	if(indx >= 0) {
		haxe.Log.trace("SkinControl.as: checkForGoToPersistentChatMsg: embeded anchor for asfunction:goToPersistentChat ",{ fileName : "SkinControl.hx", lineNumber : 1503, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "checkForGoToPersistentChatMsg"});
		var ixAnchorEnd = -1;
		var ixAnchorStart = -1;
		indx = msg.indexOf(",",indx) + 1;
		while(" " == msg.substr(indx,1)) indx++;
		var indxEnd = msg.indexOf("\"",indx);
		sUrl = msg.substr(indx,indxEnd - indx);
		sUrl = sUrl.split("&amp;").join("&");
		haxe.Log.trace("SkinControl.as: checkForGoToPersistentChatMsg: URL is '" + sUrl + "'",{ fileName : "SkinControl.hx", lineNumber : 1513, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "checkForGoToPersistentChatMsg"});
		ixAnchorEnd = msg.indexOf("</",indx);
		ixAnchorEnd = msg.indexOf(">",ixAnchorEnd);
		ixAnchorStart = msg.lastIndexOf("<",indx);
		haxe.Log.trace("ixAnchorStart=" + ixAnchorStart,{ fileName : "SkinControl.hx", lineNumber : 1523, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "checkForGoToPersistentChatMsg"});
		haxe.Log.trace("ixAnchorEnd=" + ixAnchorEnd,{ fileName : "SkinControl.hx", lineNumber : 1524, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "checkForGoToPersistentChatMsg"});
		if(ixAnchorStart < ixAnchorEnd) {
			sMsgRevised = msg.substr(0,ixAnchorStart) + msg.substr(ixAnchorEnd + 1);
			haxe.Log.trace("OLD MESSAGE: " + msg.split("<").join("&lt;").split(">").join("&gt;"),{ fileName : "SkinControl.hx", lineNumber : 1528, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "checkForGoToPersistentChatMsg"});
			haxe.Log.trace("NEW MESSAGE: " + sMsgRevised.split("<").join("&lt;").split(">").join("&gt;"),{ fileName : "SkinControl.hx", lineNumber : 1529, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "checkForGoToPersistentChatMsg"});
		}
	}
	if(com.inq.flash.client.control.FlashVars.getPersistentFrame()) return sMsgRevised;
	if(null != sUrl) {
		com.inq.flash.client.control.FlashPeer.setSessionParam("persistentChat","true");
		com.inq.flash.client.chatskins.SkinControl.enablePersistentChatButtonAndEstablishUrl(sUrl);
	}
	return sMsgRevised;
}
com.inq.flash.client.chatskins.SkinControl.reFormatMessage = function(msg) {
	var sMsg = msg.toString();
	sMsg = sMsg.split("<br/></font><br/>").join("</font><br/>");
	sMsg = sMsg.split("<br /></font><br />").join("</font><br/>");
	sMsg = sMsg.split("</font><br/><br/>").join("</font><br/>");
	sMsg = sMsg.split("<font face=\"Verdana\" size=\"10\" color=\"#000000\">").join("<font face='Verdana' size='10' color='#000000'>");
	sMsg = sMsg.split("<font face=\"Verdana\" size=\"10\" color=\"#0000cd\">").join("<font face='Verdana' size='10' color='#0000cd'>");
	sMsg = sMsg.split("<chatBox>").join("");
	sMsg = sMsg.split("</chatBox>").join("");
	sMsg = sMsg.split("<chatBox />").join("");
	sMsg = com.inq.flash.client.chatskins.SkinControl.checkForGoToPersistentChatMsg(msg);
	return sMsg;
}
com.inq.flash.client.chatskins.SkinControl.setFocusOnInputField = function() {
	if(com.inq.flash.client.chatskins.SkinControl.isClick2call()) {
		if(!com.inq.flash.client.chatskins.SkinControl.getIsPersistentChat()) {
			var elementArray = window.document.getElementsByTagName("textarea");
			var ti = com.inq.ui.TextInput.getContainer(elementArray[0]);
			ti.setFocus();
		}
	}
	else {
		var ti = com.inq.flash.client.chatskins.SkinControl.getTextInputField();
		if(ti != null) ti.setFocus();
	}
}
com.inq.flash.client.chatskins.SkinControl.getTextInputField = function() {
	return Application.application["txtInput"];
}
com.inq.flash.client.chatskins.SkinControl.startFocusListener = function() {
	var someListener = new com.inq.utils.Dictionary();
	someListener.onSetFocus = function(oldfocus,newfocus) {
		var sFrom, sTo;
		sFrom = oldfocus.toString();
		sTo = newfocus.toString();
		haxe.Log.trace("Flash changed focus: From " + sFrom + " To " + sTo,{ fileName : "SkinControl.hx", lineNumber : 1595, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "startFocusListener"});
		if(newfocus == null) {
			com.inq.flash.client.chatskins.SkinControl.objHasFocus = null;
			com.inq.flash.client.chatskins.SkinControl.bHaveFocus = false;
			haxe.Log.trace("Flash lost focus",{ fileName : "SkinControl.hx", lineNumber : 1601, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "startFocusListener"});
		}
		else if(oldfocus == null) {
			com.inq.flash.client.chatskins.SkinControl.objHasFocus = newfocus;
		}
		else com.inq.flash.client.chatskins.SkinControl.objHasFocus = newfocus;
		if(com.inq.flash.client.chatskins.SkinControl.objHasFocus == com.inq.flash.client.chatskins.SkinControl.getTextInputField()) {
			var stg = Application.application.stage;
			stg.setObjectFocus(Application.application.txtInput);
			Application.application.txtInput.caretIndex = Application.application.txtInput.indexCaret;
			Application.application.txtInput.selectionBeginIndex = Application.application.txtInput.indexBegin;
			Application.application.txtInput.selectionEndIndex = Application.application.txtInput.indexEnd;
			haxe.Log.trace("Flash: Set Begin index = " + Application.application.txtInput.indexBegin + " End Index = " + Application.application.txtInput.indexEnd,{ fileName : "SkinControl.hx", lineNumber : 1619, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "startFocusListener"});
		}
	}
}
com.inq.flash.client.chatskins.SkinControl.startMouseListener = function() {
	var someListenerSocket;
	someListenerSocket = new EventDispatcher();
	someListenerSocket.onMouseDown = function(ev) {
		if(com.inq.flash.client.chatskins.SkinControl.bHaveFocus == false) {
			com.inq.flash.client.chatskins.SkinControl.bHaveFocus = true;
			haxe.Log.trace("Flash gained focus",{ fileName : "SkinControl.hx", lineNumber : 1634, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "startMouseListener"});
		}
	}
	someListenerSocket.onMouseUp = function(ev) {
		var txtInput = com.inq.flash.client.chatskins.SkinControl.getTextInputField();
		if(com.inq.flash.client.chatskins.SkinControl.objHasFocus == txtInput) {
			txtInput.indexCaret = Application.application.txtInput.caretIndex;
			txtInput.indexBegin = Application.application.selectionBeginIndex;
			txtInput.indexEnd = Application.application.selectionEndIndex;
			haxe.Log.trace("Flash: Begin index = " + txtInput.indexBegin + " End Index = " + txtInput.indexEnd,{ fileName : "SkinControl.hx", lineNumber : 1644, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "startMouseListener"});
		}
	}
}
com.inq.flash.client.chatskins.SkinControl.uponEnterKey = function() {
	com.inq.flash.client.chatskins.SkinControl.actionBtnSend(null);
}
com.inq.flash.client.chatskins.SkinControl.monitorCustomerTyping = function() {
	if(com.inq.flash.client.chatskins.SkinControl.keyCount == 0 && com.inq.flash.client.chatskins.SkinControl.msgcntAtEntry < 1) {
		window.setTimeout($closure(com.inq.flash.client.control.Incrementality,"onEngaged"),0);
	}
	com.inq.flash.client.chatskins.SkinControl.keyCount++;
	com.inq.flash.client.chatskins.SkinControl.bHaveFocus = true;
	if(com.inq.flash.client.chatskins.SkinControl.timerForTyping == -1) window.setTimeout($closure(com.inq.flash.client.chatskins.SkinControl,"whenStartTyping"),0);
	else window.clearTimeout(com.inq.flash.client.chatskins.SkinControl.timerForTyping);
	com.inq.flash.client.chatskins.SkinControl.timerForTyping = window.setTimeout($closure(com.inq.flash.client.chatskins.SkinControl,"whenStoppedTyping"),com.inq.flash.client.chatskins.SkinControl.typingTimeout);
}
com.inq.flash.client.chatskins.SkinControl.onKeyDown = function(ke) {
	if(com.inq.flash.client.chatskins.SkinControl.isSkinActive()) {
		if(ke.keyCode == com.inq.ui.Keyboard.ENTER) {
			return false;
		}
		return (true);
	}
	else {
		return true;
	}
}
com.inq.flash.client.chatskins.SkinControl.onKeyPress = function(ke) {
	if(ke.charCode == com.inq.ui.Keyboard.ENTER && !ke.altKey && !ke.ctrlKey && !ke.shiftKey) {
		com.inq.flash.client.chatskins.SkinControl.uponEnterKey();
		return false;
	}
	window.setTimeout($closure(com.inq.flash.client.chatskins.SkinControl,"monitorCustomerTyping"),0);
	return true;
}
com.inq.flash.client.chatskins.SkinControl.onKeyUp = function(ke) {
	if(com.inq.flash.client.chatskins.SkinControl.isSkinActive()) {
		if(ke.keyCode == com.inq.ui.Keyboard.ENTER) {
			window.setTimeout($closure(com.inq.flash.client.chatskins.SkinControl,"uponEnterKey"),0);
			return false;
		}
		window.setTimeout($closure(com.inq.flash.client.chatskins.SkinControl,"monitorCustomerTyping"),0);
		return true;
	}
	else {
		return true;
	}
}
com.inq.flash.client.chatskins.SkinControl.isSkinActive = function() {
	var inqFrameElement = window.frameElement;
	if(inqFrameElement != null) {
		return ((inqFrameElement.style.display == "none")?false:true);
	}
	return false;
}
com.inq.flash.client.chatskins.SkinControl.onKeyDownCall = function(ke) {
	return true;
}
com.inq.flash.client.chatskins.SkinControl.onKeyUpCall = function(ke) {
	if(com.inq.flash.client.chatskins.SkinControl.keyCount == 0 && com.inq.flash.client.chatskins.SkinControl.msgcntAtEntry < 1) {
		window.setTimeout(function() {
			com.inq.flash.client.control.Incrementality.onEngaged();
		},50);
	}
	com.inq.flash.client.chatskins.SkinControl.keyCount++;
	return (true);
}
com.inq.flash.client.chatskins.SkinControl.onTextInputFocus = function(ke) {
	if(com.inq.flash.client.chatskins.SkinControl.keyCount == 0 && com.inq.flash.client.chatskins.SkinControl.msgcntAtEntry < 1) {
		try {
			var ti = com.inq.flash.client.chatskins.SkinControl.getTextInputField();
			if(null != $closure(ti,"select")) ti.select();
		}
		catch( $e110 ) {
			{
				var e = $e110;
				null;
			}
		}
	}
	return (true);
}
com.inq.flash.client.chatskins.SkinControl.whenStoppedTyping = function() {
	if(com.inq.flash.client.chatskins.SkinControl.timerForTyping != -1) {
		window.clearTimeout(com.inq.flash.client.chatskins.SkinControl.timerForTyping);
		com.inq.flash.client.chatskins.SkinControl.timerForTyping = -1;
		com.inq.flash.client.chatskins.SkinControl.applicationController.TypingActivity(false);
	}
}
com.inq.flash.client.chatskins.SkinControl.whenStartTyping = function() {
	com.inq.flash.client.chatskins.SkinControl.applicationController.TypingActivity(true);
}
com.inq.flash.client.chatskins.SkinControl.onTextInputFocusLoss = function(ke) {
	com.inq.flash.client.chatskins.SkinControl.whenStoppedTyping();
	return (true);
}
com.inq.flash.client.chatskins.SkinControl.setUpFocusAndSelection = function() {
	var txtInput = com.inq.flash.client.chatskins.SkinControl.getTextInputField();
	if(!com.inq.utils.Capabilities.isMobile()) {
		txtInput.setFocus();
	}
	if(!com.inq.flash.client.chatskins.SkinControl.isContinued() && com.inq.flash.client.chatskins.SkinControl.msgcntAtEntry == 0) txtInput.select();
	Application.application.setVisible(true);
}
com.inq.flash.client.chatskins.SkinControl.startKeyListener = function() {
	var txtInput = com.inq.flash.client.chatskins.SkinControl.getTextInputField();
	if(txtInput == null) return;
	try {
		com.inq.flash.client.chatskins.SkinControl.typingTimeout = Application.application.skinConfig["clientTypingTimout"];
	}
	catch( $e111 ) {
		if( js.Boot.__instanceof($e111,Error) ) {
			var e = $e111;
			null;
		} else throw($e111);
	}
	if(com.inq.flash.client.chatskins.SkinControl.typingTimeout == null) com.inq.flash.client.chatskins.SkinControl.typingTimeout = 4000;
	if(com.inq.flash.client.chatskins.SkinControl.isClick2call()) {
		txtInput.addEventListener(com.inq.events.KeyboardEvent.KEY_UP,$closure(com.inq.flash.client.chatskins.SkinControl,"onKeyUpCall"));
		txtInput.addEventListener(com.inq.events.KeyboardEvent.KEY_DOWN,$closure(com.inq.flash.client.chatskins.SkinControl,"onKeyDownCall"));
	}
	else {
		txtInput.addEventListener(com.inq.events.KeyboardEvent.KEY_PRESS,$closure(com.inq.flash.client.chatskins.SkinControl,"onKeyPress"));
	}
	if(!com.inq.flash.client.chatskins.SkinControl.isClick2call()) {
		txtInput.addEventListener(com.inq.events.FocusEvent.FOCUS_OUT,$closure(com.inq.flash.client.chatskins.SkinControl,"onTextInputFocusLoss"));
		txtInput.addEventListener(com.inq.events.FocusEvent.FOCUS_IN,$closure(com.inq.flash.client.chatskins.SkinControl,"onTextInputFocus"));
		txtInput.addEventListener(com.inq.events.MouseEvent.CLICK,$closure(com.inq.flash.client.chatskins.SkinControl,"onTextInputFocus"));
	}
}
com.inq.flash.client.chatskins.SkinControl.setupLocalCommunications = function() {
	null;
}
com.inq.flash.client.chatskins.SkinControl.PushEmbeddedForm = function() {
	null;
}
com.inq.flash.client.chatskins.SkinControl.thankYou = function() {
	null;
}
com.inq.flash.client.chatskins.SkinControl.setAgentID = function(agentId,eventData,coBrowseEnabled,buID) {
	if(coBrowseEnabled == null) coBrowseEnabled = false;
	var sJsCode = "Inq.FlashPeer.setAgentID(\"" + agentId + "\", " + coBrowseEnabled + ", " + com.inq.utils.StringUtil.toJsString(com.inq.utils.StringUtil.dictionaryToJson(eventData)) + ", " + buID + ");";
	com.inq.external.ExternalInterface.call("function(){\n" + sJsCode + "}");
}
com.inq.flash.client.chatskins.SkinControl.doJsViaUrl = function(jsCommand) {
	null;
}
com.inq.flash.client.chatskins.SkinControl.onLocalConnectStatus = function(genericError) {
	if(null != genericError["level"]) {
		var level = genericError["level"];
		switch(level) {
		case "status":{
			haxe.Log.trace("LocalConnection connected successfully." + genericError,{ fileName : "SkinControl.hx", lineNumber : 1883, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "onLocalConnectStatus"});
		}break;
		case "error":{
			haxe.Log.trace("onLocalConnectStatus: LocalConnection encountered an error.",{ fileName : "SkinControl.hx", lineNumber : 1885, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "onLocalConnectStatus"});
		}break;
		default:{
			haxe.Log.trace("onLocalConnectStatus: Level " + level + " reports " + genericError,{ fileName : "SkinControl.hx", lineNumber : 1887, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "onLocalConnectStatus"});
		}break;
		}
	}
	else haxe.Log.trace("onLocalConnectStatus: level does not exist",{ fileName : "SkinControl.hx", lineNumber : 1892, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "onLocalConnectStatus"});
}
com.inq.flash.client.chatskins.SkinControl.onTimeout = function() {
	com.inq.flash.client.chatskins.SkinControl.StopTimer();
	com.inq.stage.DragResize.WhenDone();
	if(com.inq.flash.client.chatskins.SkinControl.applicationController == null) return;
	try {
		com.inq.flash.client.chatskins.SkinControl.actionBtnCloseChat(null);
	}
	catch( $e112 ) {
		{
			var e = $e112;
			null;
		}
	}
}
com.inq.flash.client.chatskins.SkinControl.shutdownPopup = function() {
	null;
}
com.inq.flash.client.chatskins.SkinControl.ClassInits = function() {
	com.inq.flash.client.control.Incrementality.init();
	com.inq.flash.client.control.XFrameWorker.init();
	com.inq.flash.client.chatskins.FontMgr.init();
	com.inq.flash.client.chatskins.EmailMgr.init();
	com.inq.flash.client.chatskins.SndMgr.init();
	com.inq.flash.client.chatskins.PrintMgr.init();
	com.inq.flash.client.chatskins.FocusMonitor.init();
	com.inq.flash.client.chatskins.ChatTextFocusMonitor.init();
	com.inq.flash.client.chatskins.FormMgr.init();
	com.inq.flash.client.chatskins.CoBrowseMgr.init();
	com.inq.flash.client.control.MinimizeManager.init();
	com.inq.flash.client.chatskins.ScrollMonitor.init();
}
com.inq.flash.client.chatskins.SkinControl.InitializeAutomoton = function() {
	com.inq.flash.client.chatskins.SkinControl.timerTimeout = new com.inq.utils.Timer(com.inq.flash.client.chatskins.SkinControl.TIMEOUT_AVOIDANCE);
	com.inq.flash.client.chatskins.SkinControl.timerTimeout.run = function() {
		com.inq.flash.client.control.PersistenceManager.SetValue("lt",Date.now().getTime(),false);
	}
	var iframeURL = com.inq.flash.client.control.PersistenceManager.GetValue("ifrmurl",null);
	if(iframeURL == null) {
		iframeURL = StringTools.urlDecode(com.inq.flash.client.control.FlashVars.getFlashVars().iframeURL);
		haxe.Log.trace("Flashvar iframeURL:" + iframeURL,{ fileName : "SkinControl.hx", lineNumber : 1948, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "InitializeAutomoton"});
	}
	else {
		iframeURL = StringTools.urlDecode(iframeURL);
		haxe.Log.trace("Persisted iframeURL:" + iframeURL,{ fileName : "SkinControl.hx", lineNumber : 1952, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "InitializeAutomoton"});
	}
	var iframe = null;
	try {
		iframe = Application.application.autoAgentFrame;
	}
	catch( $e113 ) {
		if( js.Boot.__instanceof($e113,Error) ) {
			var e = $e113;
			null;
		} else throw($e113);
	}
	if(iframe != null) {
		iframe.setSrc(iframeURL);
		com.inq.flash.client.control.PersistenceManager.SetValue("ifrmurl",StringTools.urlEncode(iframeURL));
	}
	else {
		haxe.Log.trace("uriFrame is null. Did you proerly ID the iframe component in the mxml?",{ fileName : "SkinControl.hx", lineNumber : 1962, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "InitializeAutomoton"});
	}
}
com.inq.flash.client.chatskins.SkinControl.getIntroduction = function() {
	return Application.application.skinConfig["sIntroduction"];
}
com.inq.flash.client.chatskins.SkinControl.InitializeGlue = function() {
	if(com.inq.flash.client.chatskins.SkinControl.bInitialized) return;
	com.inq.flash.client.chatskins.SkinControl.bInitialized = true;
	com.inq.flash.client.chatskins.SkinControl.click2call = false;
	com.inq.flash.client.chatskins.SkinControl.callStreamData = "";
	com.inq.flash.client.chatskins.SkinControl.callerNameString = "";
	var chatContainer = Application.application["Chat"];
	com.inq.flash.client.control.FlashVars._init();
	com.inq.flash.client.chatskins.SkinControl.bChatIsVisible = (chatContainer == null || chatContainer.getVisible());
	com.inq.flash.client.chatskins.SkinControl.resizable = ((null == Application.application.skinConfig["resizable"])?true:Application.application.skinConfig.resizable);
	com.inq.flash.client.chatskins.SkinControl.autoAgent = ((com.inq.flash.client.chatskins.SkinControl.isInApplication("autoAgent"))?Application.application["autoAgent"]:null);
	com.inq.flash.client.chatskins.SkinControl.ClassInits();
	com.inq.flash.client.chatskins.SkinControl.textInput = com.inq.flash.client.chatskins.SkinControl.getTextInputField();
	haxe.Log.trace("SkinControl.InitializeGlue: check for preload",{ fileName : "SkinControl.hx", lineNumber : 1997, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "InitializeGlue"});
	try {
		com.inq.flash.client.control.FlashVars.getFlashVars();
	}
	catch( $e114 ) {
		if( js.Boot.__instanceof($e114,Error) ) {
			var e = $e114;
			{
				haxe.Log.trace("SkinControl.InitializeGlue: FlashVars threw: " + e,{ fileName : "SkinControl.hx", lineNumber : 2001, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "InitializeGlue", customParams : ["error"]});
			}
		} else throw($e114);
	}
	haxe.Log.trace("SkinControl.InitializeGlue: FlashVars.flashVars.clickStream=" + com.inq.flash.client.control.FlashVars.getFlashVars().clickStream,{ fileName : "SkinControl.hx", lineNumber : 2003, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "InitializeGlue"});
	var ti = com.inq.flash.client.chatskins.SkinControl.getTextInputField();
	com.inq.flash.client.chatskins.SkinControl.cw = new com.inq.flash.client.chatskins.ChatTextArea(Application.application.chatWindow);
	com.inq.flash.client.chatskins.SkinControl.setupLocalConnections();
	if(com.inq.flash.client.control.FlashVars.getFlashVars().shutdownPopup) {
		com.inq.flash.client.chatskins.SkinControl.shutdownPopup();
		return;
	}
	if(!com.inq.flash.client.control.FlashVars.getPersistentFrame()) {
		com.inq.flash.client.chatskins.SkinControl.popupChatInitialize();
		com.inq.flash.client.chatskins.SkinControl.showPersistentChatButtons(false);
		com.inq.flash.client.chatskins.SkinControl.openerScript = new com.inq.flash.client.chatskins.OpenerScript();
		if(com.inq.flash.client.chatskins.SkinControl.bChatIsVisible) com.inq.flash.client.chatskins.SkinControl.openerScript.start();
		var msgcnt = com.inq.flash.client.control.PersistenceManager.GetValue("msgcnt",0);
		if(com.inq.flash.client.chatskins.SkinControl.isContinued() && msgcnt > 0) {
			com.inq.flash.client.chatskins.SkinControl.applicationController.persistentFrameReconnect();
		}
		else if(com.inq.flash.client.chatskins.SkinControl.autoAgent == null || com.inq.flash.client.chatskins.SkinControl.autoAgent.getVisible() == false) {
			if(com.inq.flash.client.chatskins.SkinControl.bChatIsVisible) {
				com.inq.flash.client.chatskins.SkinControl.timerTimeout = new com.inq.utils.Timer(com.inq.flash.client.chatskins.SkinControl.TIMEOUT_INITIALPOPUP);
				com.inq.flash.client.chatskins.SkinControl.timerTimeout.run = function() {
					com.inq.flash.client.chatskins.SkinControl.timerTimeout.stop();
					com.inq.flash.client.chatskins.SkinControl.onTimeout();
					com.inq.flash.client.chatskins.SkinControl.timerTimeout = null;
				}
			}
			ti._setInput(((null != com.inq.flash.client.chatskins.SkinControl.getIntroduction())?com.inq.flash.client.chatskins.SkinControl.getIntroduction():""));
			ti.select();
		}
		else {
			com.inq.flash.client.chatskins.SkinControl.InitializeAutomoton();
		}
	}
	else {
		com.inq.flash.client.chatskins.SkinControl.persistentChatInitialize();
		com.inq.flash.client.chatskins.SkinControl.openerScript = new com.inq.flash.client.chatskins.OpenerScript();
		if(com.inq.flash.client.chatskins.SkinControl.bChatIsVisible) com.inq.flash.client.chatskins.SkinControl.openerScript.start();
		var msgcnt = -1;
		msgcnt = com.inq.flash.client.control.FlashVars.getFlashVars().msgCnt;
		if(msgcnt == -1) msgcnt = com.inq.flash.client.control.PersistenceManager.GetValue("msgcnt",0);
		com.inq.flash.client.chatskins.SkinControl.msgcntAtEntry = msgcnt;
		if(com.inq.flash.client.chatskins.SkinControl.isContinued() && (msgcnt > 0)) {
			com.inq.flash.client.chatskins.SkinControl.applicationController.persistentFrameReconnect();
		}
		else {
			ti._setInput(((null != com.inq.flash.client.chatskins.SkinControl.getIntroduction())?com.inq.flash.client.chatskins.SkinControl.getIntroduction():""));
			ti.select();
		}
		if(com.inq.flash.client.chatskins.SkinControl.isClick2call()) {
			com.inq.flash.client.chatskins.SkinControl.applicationController.processClickToCallQueueMessages();
		}
		var bPopupNotified = false;
		com.inq.flash.client.chatskins.SkinControl.ShowChat();
	}
	if(com.inq.flash.client.chatskins.SkinControl.isInApplication("emailLayer")) Application.application.emailLayer.visible = false;
	if(com.inq.flash.client.chatskins.SkinControl.isInApplication("thankYou")) Application.application.thankYou.visible = false;
	haxe.Log.trace("setup the buttons",{ fileName : "SkinControl.hx", lineNumber : 2073, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "InitializeGlue"});
	if(!com.inq.utils.Capabilities.isMobile()) {
		com.inq.flash.client.chatskins.SkinControl.setFocusOnInputField();
	}
	com.inq.flash.client.chatskins.SkinControl.startMouseListener();
	com.inq.flash.client.chatskins.SkinControl.startFocusListener();
	com.inq.flash.client.chatskins.SkinControl.setupButtons();
	if(com.inq.flash.client.chatskins.SkinControl.autoAgent == null || com.inq.flash.client.chatskins.SkinControl.autoAgent.getVisible() == false) {
		com.inq.flash.client.chatskins.SkinControl.startKeyListener();
		if(!com.inq.flash.client.control.MinimizeManager.minimized) {
			com.inq.flash.client.chatskins.SkinControl.setUpFocusAndSelection();
		}
	}
	if(Application.application.skinConfig["bHideInput"] && !com.inq.flash.client.chatskins.SkinControl.isContinued()) {
		com.inq.flash.client.chatskins.SkinControl.hideInput();
	}
	else {
		com.inq.flash.client.chatskins.SkinControl.showInput(false);
	}
	com.inq.flash.client.chatskins.SkinControl.fireMxmlHandler("onInitializationComplete");
}
com.inq.flash.client.chatskins.SkinControl.getIsPersistentChat = function() {
	return com.inq.flash.client.control.FlashVars.getFlashVars().PersistentFrame;
}
com.inq.flash.client.chatskins.SkinControl.testAgentAvailability = function(hop,noagent,func) {
	var inHOP = com.inq.flash.client.control.FlashVars.getInHOP();
	var agentsAvailable = com.inq.flash.client.control.FlashVars.getAgentsAvailable();
	if(inHOP && agentsAvailable) {
		if(func != null) {
			func();
		}
		return;
	}
	com.inq.flash.client.chatskins.SkinControl.doThankYou();
	var btnThankYou = Application.application.btnThankYou;
	btnThankYou.setLabel(((!inHOP)?hop:noagent));
}
com.inq.flash.client.chatskins.SkinControl.parseInitialClickstreamData = function() {
	haxe.Log.trace("SkinControl.parseInitialClickstreamData: entered",{ fileName : "SkinControl.hx", lineNumber : 2116, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "parseInitialClickstreamData"});
	var sep = "&";
	var csd = "";
	haxe.Log.trace("SkinControl.parseInitialClickstreamData: " + com.inq.flash.client.control.FlashVars.getFlashVars().clickStream,{ fileName : "SkinControl.hx", lineNumber : 2120, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "parseInitialClickstreamData"});
	var clickStream = StringTools.urlDecode(com.inq.flash.client.control.FlashVars.getFlashVars().clickStream);
	var csdArray = clickStream.split(sep);
	var ix;
	{
		var _g1 = 0, _g = csdArray.length;
		while(_g1 < _g) {
			var ix1 = _g1++;
			haxe.Log.trace("SkinControl.parseInitialClickstreamData: " + csdArray[ix1],{ fileName : "SkinControl.hx", lineNumber : 2128, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "parseInitialClickstreamData"});
			var nVP = csdArray[ix1].split("=");
			var name = nVP.shift();
			var data = nVP.join("=");
			haxe.Log.trace("SkinControl.parseInitialClickstreamData: " + name + " = " + data,{ fileName : "SkinControl.hx", lineNumber : 2132, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "parseInitialClickstreamData"});
			if(data == "") continue;
			if(name.substr(0,4) == "data") {
				var indx = name.substr(4);
				csd = (((csd != "")?csd + sep:"")) + "_" + name + "=" + "Data[" + indx + "]" + sep + name + "=" + data;
			}
			else if(name == "markerHistory") {
				csd = (((csd != "")?csd + sep:"")) + com.inq.flash.client.chatskins.SkinControl.CSDL_VISITED + data;
			}
		}
	}
	haxe.Log.trace("SkinControl.parseInitialClickstreamData: " + csd,{ fileName : "SkinControl.hx", lineNumber : 2145, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "parseInitialClickstreamData"});
	return csd;
}
com.inq.flash.client.chatskins.SkinControl.parseURLfromClickStreamData = function() {
	haxe.Log.trace("SkinControl.parseURLfromClickStreamData: entered",{ fileName : "SkinControl.hx", lineNumber : 2151, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "parseURLfromClickStreamData"});
	var sep = "&";
	var csdURL = "";
	haxe.Log.trace("SkinControl.parseURLfromClickStreamData: " + com.inq.flash.client.control.FlashVars.getFlashVars().clickStream,{ fileName : "SkinControl.hx", lineNumber : 2155, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "parseURLfromClickStreamData"});
	var clickStream = StringTools.urlDecode(com.inq.flash.client.control.FlashVars.getFlashVars().clickStream);
	var csdURLArray = clickStream.split(sep);
	var ix;
	{
		var _g1 = 0, _g = csdURLArray.length;
		while(_g1 < _g) {
			var ix1 = _g1++;
			haxe.Log.trace("SkinControl.parseURLfromClickStreamData: " + csdURLArray[ix1],{ fileName : "SkinControl.hx", lineNumber : 2163, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "parseURLfromClickStreamData"});
			var nVP = csdURLArray[ix1].split("=");
			var name = nVP.shift();
			var data = nVP.join("=");
			haxe.Log.trace("SkinControl.parseURLfromClickStreamData: " + name + " = " + data,{ fileName : "SkinControl.hx", lineNumber : 2167, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "parseURLfromClickStreamData"});
			if(data == "") continue;
			if(name == "pageURL") {
				csdURL = (((csdURL != "")?csdURL + sep:"")) + com.inq.flash.client.chatskins.SkinControl.CSDL_URL + data;
			}
		}
	}
	haxe.Log.trace("SkinControl.parseURLfromClickStreamData: " + csdURL,{ fileName : "SkinControl.hx", lineNumber : 2175, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "parseURLfromClickStreamData"});
	return "^^" + csdURL;
}
com.inq.flash.client.chatskins.SkinControl.parseDFVfromClickStreamData = function() {
	haxe.Log.trace("SkinControl.parseDFVfromClickStreamData: entered",{ fileName : "SkinControl.hx", lineNumber : 2182, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "parseDFVfromClickStreamData"});
	var sep = "&";
	var csdDFV = "";
	haxe.Log.trace("SkinControl.parseDFVfromClickStreamData: " + com.inq.flash.client.control.FlashVars.getFlashVars().clickStream,{ fileName : "SkinControl.hx", lineNumber : 2186, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "parseDFVfromClickStreamData"});
	var clickStream = StringTools.urlDecode(com.inq.flash.client.control.FlashVars.getFlashVars().clickStream);
	var csdDFVArray = clickStream.split(sep);
	var ix;
	{
		var _g1 = 0, _g = csdDFVArray.length;
		while(_g1 < _g) {
			var ix1 = _g1++;
			haxe.Log.trace("SkinControl.parseDFVfromClickStreamData: " + csdDFVArray[ix1],{ fileName : "SkinControl.hx", lineNumber : 2194, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "parseDFVfromClickStreamData"});
			var nVP = csdDFVArray[ix1].split("=");
			var name = nVP.shift();
			var data = nVP.join("=");
			haxe.Log.trace("SkinControl.parseDFVfromClickStreamData: " + name + " = " + data,{ fileName : "SkinControl.hx", lineNumber : 2198, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "parseDFVfromClickStreamData"});
			if(data == "") continue;
			if(name == "dfv") {
				csdDFV = (((csdDFV != "")?csdDFV + sep:"")) + com.inq.flash.client.chatskins.SkinControl.CSDL_DFV + data;
			}
		}
	}
	haxe.Log.trace("SkinControl.parseDFVfromClickStreamData: " + csdDFV,{ fileName : "SkinControl.hx", lineNumber : 2206, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "parseDFVfromClickStreamData"});
	return "^^" + csdDFV;
}
com.inq.flash.client.chatskins.SkinControl.getCallStreamData = function() {
	var skinVersion = (Application.application.skinConfig["skinVersion"]?Application.application.skinConfig["skinVersion"]:"0");
	var utfenable = (Application.application.skinConfig["utfenable"]?Application.application.skinConfig["utfenable"]:false);
	if(skinVersion == "0") {
		var phoneSeparator = (Application.application.skinConfig["phoneSeparator"]?Application.application.skinConfig["phoneSeparator"]:"-");
		var numberLength = (Application.application.skinConfig["numberLength"]?Application.application.skinConfig["numberLength"]:"10");
		var callStreamDataLocal = "^^", callerPhoneString = "", callErrorMessage = ((Application.application.skinConfig["phoneErrorMessage"] != null?Application.application.skinConfig["phoneErrorMessage"]:"Please enter a valid phone number consisting of " + numberLength + " digits (or more for numbers with extension)"));
		try {
			var callerPhone = Application.application[com.inq.flash.client.chatskins.SkinControl.CALL_SUBMIT_PRE + "callerPhone"];
			if(callerPhone == null || StringTools.trim(callerPhone._getInput()) == "") throw callErrorMessage;
			callerPhoneString = StringTools.trim(callerPhone._getInput());
		}
		catch( $e115 ) {
			{
				var msg = $e115;
				{
					try {
						var callerPhoneField1 = Application.application[com.inq.flash.client.chatskins.SkinControl.CALL_SUBMIT_PRE + "phoneField1"], callerPhoneField2 = Application.application[com.inq.flash.client.chatskins.SkinControl.CALL_SUBMIT_PRE + "phoneField2"], callerPhoneField3 = Application.application[com.inq.flash.client.chatskins.SkinControl.CALL_SUBMIT_PRE + "phoneField3"];
						if(callerPhoneField1 != null && callerPhoneField2 != null && callerPhoneField3 != null) callerPhoneString = StringTools.trim(callerPhoneField1._getInput() + callerPhoneField2._getInput() + callerPhoneField3._getInput());
						if(callerPhoneString == "") {
							throw msg;
						}
					}
					catch( $e116 ) {
						{
							var msg1 = $e116;
							{
								throw msg1;
							}
						}
					}
				}
			}
		}
		var myReg = new EReg("[^\\d]","g");
		if(utfenable == false) {
			callerPhoneString = myReg.replace(callerPhoneString,"");
			myReg = new EReg("^\\d{10,}$","");
			if(!myReg.match(callerPhoneString)) {
				throw callErrorMessage;
			}
		}
		if(callerPhoneString.length > 10) {
			callerPhoneString = callerPhoneString.substr(0,10) + "x" + callerPhoneString.substr(10);
		}
		var countryCode = (Application.application.skinConfig["countryISDCode"]?((Application.application.skinConfig["countryISDCode"] == "0")?"":Application.application.skinConfig["countryISDCode"] + "-"):"1-");
		if(countryCode != "1-") {
			callerPhoneString = countryCode + callerPhoneString;
		}
		else {
			callerPhoneString = countryCode + callerPhoneString.substr(0,3) + phoneSeparator + callerPhoneString.substr(3,3) + phoneSeparator + callerPhoneString.substr(6);
		}
		callStreamDataLocal += com.inq.flash.client.chatskins.SkinControl.CSDL_CALLERPHONE + callerPhoneString;
		try {
			var callerName = Application.application[com.inq.flash.client.chatskins.SkinControl.CALL_SUBMIT_PRE + "callerName"];
			com.inq.flash.client.chatskins.SkinControl.callerNameString = StringTools.trim(callerName._getInput());
			myReg = new EReg("[^a-zA-Z-\\s]","g");
			com.inq.flash.client.chatskins.SkinControl.callerNameString = myReg.replace(com.inq.flash.client.chatskins.SkinControl.callerNameString," ");
			myReg = new EReg("\\s+","g");
			com.inq.flash.client.chatskins.SkinControl.callerNameString = myReg.replace(com.inq.flash.client.chatskins.SkinControl.callerNameString," ");
			myReg = new EReg("\\s+-|-\\s+","g");
			com.inq.flash.client.chatskins.SkinControl.callerNameString = myReg.replace(com.inq.flash.client.chatskins.SkinControl.callerNameString,"-");
		}
		catch( $e117 ) {
			throw($e117);
		}
		return callStreamDataLocal;
	}
	else {
		var callStreamDataLocal = "^^", callerPhoneExt = "", numberLength = ((Application.application.skinConfig["numberLength"] != null?Application.application.skinConfig["numberLength"]:"10")), callerPhoneString = "", callErrorMessage = ((Application.application.skinConfig["phoneErrorMessage"] != null?Application.application.skinConfig["phoneErrorMessage"]:"Please enter a valid phone number consisting of " + numberLength + " digits (or more for numbers with extension)"));
		var callerPhone = new Array();
		var callerPhoneStrings = new Array();
		try {
			var i = 1;
			if(Application.application[com.inq.flash.client.chatskins.SkinControl.CALL_SUBMIT_PRE + "callerPhoneExt"] != null) {
				callerPhoneExt = StringTools.trim(Application.application[com.inq.flash.client.chatskins.SkinControl.CALL_SUBMIT_PRE + "callerPhoneExt"]._getInput());
			}
			else {
				callerPhoneExt = "";
			}
			while(true) {
				if(!Application.application[com.inq.flash.client.chatskins.SkinControl.CALL_SUBMIT_PRE + "callerPhone" + i]) {
					break;
				}
				else {
					callerPhone[i - 1] = Application.application[com.inq.flash.client.chatskins.SkinControl.CALL_SUBMIT_PRE + "callerPhone" + i];
				}
				i++;
			}
			if(callerPhone.length == 0) {
				throw callErrorMessage;
			}
			i = 0;
			var checkValidInput = false;
			while(i < callerPhone.length) {
				if(StringTools.trim(callerPhone[i]._getInput()) == "") {
					checkValidInput = true;
				}
				i++;
			}
			if(checkValidInput == true) {
				throw callErrorMessage;
			}
			i = 0;
			while(i < callerPhone.length) {
				callerPhoneStrings[i] = callerPhone[i]._getInput();
				if(utfenable == false) {
					var myReg = new EReg("[^\\d]","g");
					callerPhoneStrings[i] = myReg.replace(callerPhoneStrings[i],"");
					myReg = new EReg("^\\d{" + callerPhoneStrings[i].length + ",}$","");
					if(!myReg.match(callerPhoneStrings[i])) {
						throw callErrorMessage;
					}
				}
				i++;
			}
			i = 0;
			while(i < callerPhoneStrings.length) {
				callerPhoneString += StringTools.trim(callerPhoneStrings[i++]);
			}
			if(callerPhoneString.length < Std.parseInt(numberLength)) {
				throw callErrorMessage;
			}
		}
		catch( $e118 ) {
			{
				var msg = $e118;
				{
					throw msg;
				}
			}
		}
		var checkforhyphen = (Application.application.skinConfig["phoneSeparator"]?Application.application.skinConfig["phoneSeparator"]:false);
		if(checkforhyphen != false) {
			var tempStr = callerPhoneString;
			var i = 0;
			var val1, val2 = 0;
			while(i < callerPhoneStrings.length - 1) {
				val1 = 0;
				val2 += callerPhoneStrings[i].length + i;
				tempStr = tempStr.substr(val1,val2) + checkforhyphen + tempStr.substr(val2);
				i++;
			}
			callerPhoneString = tempStr;
		}
		var countryCode = (Application.application.skinConfig["countryISDCode"]?((Application.application.skinConfig["countryISDCode"] == "0")?"":Application.application.skinConfig["countryISDCode"] + "-"):"1-");
		callerPhoneString = countryCode + callerPhoneString;
		if(callerPhoneExt != "") callerPhoneString += "x" + callerPhoneExt;
		callStreamDataLocal += com.inq.flash.client.chatskins.SkinControl.CSDL_CALLERPHONE + callerPhoneString;
		try {
			var callerName = Application.application[com.inq.flash.client.chatskins.SkinControl.CALL_SUBMIT_PRE + "callerName"];
			com.inq.flash.client.chatskins.SkinControl.callerNameString = StringTools.trim(callerName._getInput());
			var myReg = new EReg("[^a-zA-Z-\\s]","g");
			com.inq.flash.client.chatskins.SkinControl.callerNameString = myReg.replace(com.inq.flash.client.chatskins.SkinControl.callerNameString," ");
			myReg = new EReg("\\s+","g");
			com.inq.flash.client.chatskins.SkinControl.callerNameString = myReg.replace(com.inq.flash.client.chatskins.SkinControl.callerNameString," ");
			myReg = new EReg("\\s+-|-\\s+","g");
			com.inq.flash.client.chatskins.SkinControl.callerNameString = myReg.replace(com.inq.flash.client.chatskins.SkinControl.callerNameString,"-");
		}
		catch( $e119 ) {
			throw($e119);
		}
		return callStreamDataLocal;
	}
}
com.inq.flash.client.chatskins.SkinControl.getCallFormData = function() {
	var skinVersion = (Application.application.skinConfig["skinVersion"]?Application.application.skinConfig["skinVersion"]:"0");
	if(skinVersion == "0") {
		var formString = "";
		try {
			var divElements = document.getElementById('btnCall').parentNode.getElementsByTagName('DIV');
			{
				var _g1 = 0, _g = divElements.length;
				while(_g1 < _g) {
					var divIndex = _g1++;
					try {
						var myReg = new EReg("^" + com.inq.flash.client.chatskins.SkinControl.CALL_SUBMIT_PRE,"");
						if(!myReg.match(divElements[divIndex].id) || StringTools.endsWith(divElements[divIndex].id,"callerPhone") || StringTools.endsWith(divElements[divIndex].id,"phoneField1") || StringTools.endsWith(divElements[divIndex].id,"phoneField2") || StringTools.endsWith(divElements[divIndex].id,"phoneField3") || StringTools.endsWith(divElements[divIndex].id,"callerName")) {
							continue;
						}
						var fieldToGet = Application.application[divElements[divIndex].id];
						formString += "^^_" + myReg.matchedRight() + "=" + myReg.matchedRight() + "^^" + myReg.matchedRight() + "=" + StringTools.trim(fieldToGet._getInput());
					}
					catch( $e120 ) {
						if( js.Boot.__instanceof($e120,Error) ) {
							var e = $e120;
							{
								haxe.Log.trace("Error type for ," + e,{ fileName : "SkinControl.hx", lineNumber : 2415, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "getCallFormData"});
							}
						} else throw($e120);
					}
				}
			}
		}
		catch( $e121 ) {
			if( js.Boot.__instanceof($e121,Error) ) {
				var e = $e121;
				{
					haxe.Log.trace("HtmlPersistentButton: show button failed," + e,{ fileName : "SkinControl.hx", lineNumber : 2419, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "getCallFormData"});
				}
			} else throw($e121);
		}
		return formString;
	}
	else {
		var formString = "";
		try {
			var i = 1;
			var divElements = document.getElementById('btnCall').parentNode.getElementsByTagName('DIV');
			{
				var _g1 = 0, _g = divElements.length;
				while(_g1 < _g) {
					var divIndex = _g1++;
					try {
						var myReg = new EReg("^" + com.inq.flash.client.chatskins.SkinControl.CALL_SUBMIT_PRE,"");
						if(!myReg.match(divElements[divIndex].id) || StringTools.endsWith(divElements[divIndex].id,"callerPhoneExt") || StringTools.endsWith(divElements[divIndex].id,"callerName")) {
							continue;
						}
						if(StringTools.endsWith(divElements[divIndex].id,"callerPhone" + i)) {
							i++;
							continue;
						}
						var fieldToGet = Application.application[divElements[divIndex].id];
						formString += "^^_" + myReg.matchedRight() + "=" + myReg.matchedRight() + "^^" + myReg.matchedRight() + "=" + StringTools.trim(fieldToGet._getInput());
					}
					catch( $e122 ) {
						if( js.Boot.__instanceof($e122,Error) ) {
							var e = $e122;
							{
								haxe.Log.trace("Error type for ," + e,{ fileName : "SkinControl.hx", lineNumber : 2451, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "getCallFormData"});
							}
						} else throw($e122);
					}
				}
			}
		}
		catch( $e123 ) {
			if( js.Boot.__instanceof($e123,Error) ) {
				var e = $e123;
				{
					haxe.Log.trace("HtmlPersistentButton: show button failed," + e,{ fileName : "SkinControl.hx", lineNumber : 2455, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "getCallFormData"});
				}
			} else throw($e123);
		}
		return formString;
	}
}
com.inq.flash.client.chatskins.SkinControl.getInitialClickstreamData = function() {
	var sInitialClickstreamData = com.inq.flash.client.chatskins.SkinControl.IdentifyPlatform() + com.inq.flash.client.chatskins.SkinControl.parseInitialClickstreamData() + com.inq.flash.client.chatskins.SkinControl.parseURLfromClickStreamData() + com.inq.flash.client.chatskins.SkinControl.parseDFVfromClickStreamData() + com.inq.flash.client.chatskins.SkinControl.callStreamData;
	return sInitialClickstreamData;
}
com.inq.flash.client.chatskins.SkinControl.getChatWindow = function() {
	return com.inq.flash.client.chatskins.SkinControl.cw;
}
com.inq.flash.client.chatskins.SkinControl.updateFormFields = function(formData,formName,formId) {
	com.inq.flash.client.chatskins.FormMgr.updateFormFields(formData,formName,formId,com.inq.flash.client.chatskins.SkinControl.cw);
}
com.inq.flash.client.chatskins.SkinControl.getInputArea = function() {
	return Application.application.txtInput;
}
com.inq.flash.client.chatskins.SkinControl.disableInput = function() {
	var ti = com.inq.flash.client.chatskins.SkinControl.getTextInputField();
	ti._setInput("");
	ti._enable(true);
	ti.setVisible(false);
}
com.inq.flash.client.chatskins.SkinControl.sendDisableInput = function() {
	com.inq.flash.client.chatskins.SkinControl.disableInput();
}
com.inq.flash.client.chatskins.SkinControl.popupChatInitialize = function() {
	var xdMode = Inq.xdMode || Inq.xd;
	if(!xdMode) {
		try {
			var bChrome = js.Lib.window.navigator.userAgent.toLowerCase().indexOf("chrome") >= 0;
			var unloadHandler = function(ev) {
				var map = { a : false, lt : Date.now().getTime()}
				com.inq.flash.client.control.PersistenceManager.SetValues(map);
			}
			if(bChrome) {
				js.Lib.window.addEventListener("beforeunload",unloadHandler,false);
			}
			else {
				js.Lib.window.onunload = unloadHandler;
			}
			com.inq.flash.client.control.PersistenceManager.SetValue("a",true);
		}
		catch( $e124 ) {
			if( js.Boot.__instanceof($e124,Error) ) {
				var e = $e124;
				{
					haxe.Log.trace("" + e,{ fileName : "SkinControl.hx", lineNumber : 2522, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "popupChatInitialize", customParams : ["error"]});
				}
			} else throw($e124);
		}
	}
	if(com.inq.flash.client.chatskins.SkinControl.isClick2call()) {
		var thankyouNoAgentOnEntry = Application.application.skinConfig["thankyouNoAgentOnEntry"];
		var thankyouAfterHoursOnEntry = Application.application.skinConfig["thankyouAfterHoursOnEntry"];
		if(thankyouNoAgentOnEntry == null && thankyouAfterHoursOnEntry != null) thankyouNoAgentOnEntry = thankyouAfterHoursOnEntry;
		if(thankyouAfterHoursOnEntry == null && thankyouNoAgentOnEntry != null) thankyouAfterHoursOnEntry = thankyouNoAgentOnEntry;
		if(null != thankyouAfterHoursOnEntry) com.inq.flash.client.chatskins.SkinControl.testAgentAvailability(thankyouAfterHoursOnEntry,thankyouNoAgentOnEntry);
	}
}
com.inq.flash.client.chatskins.SkinControl.noUnload = function() {
	window.onunload = function(ev) {
		return true;
	}
}
com.inq.flash.client.chatskins.SkinControl.kickOffChat = function(noOpeners) {
	if(noOpeners == null) noOpeners = false;
	if(com.inq.flash.client.chatskins.SkinControl.bChatIsVisible) return;
	com.inq.flash.client.chatskins.SkinControl.bChatIsVisible = true;
	if(com.inq.flash.client.chatskins.SkinControl.autoAgent == null || com.inq.flash.client.chatskins.SkinControl.autoAgent.getVisible() == false) {
		try {
			if(!noOpeners) com.inq.flash.client.chatskins.SkinControl.openerScript.start();
			var txtInput = Application.application.txtInput;
			if(txtInput != null) txtInput.setFocus();
		}
		catch( $e125 ) {
			{
				var e = $e125;
				null;
			}
		}
	}
	else {
		try {
			com.inq.flash.client.chatskins.SkinControl.InitializeAutomoton();
		}
		catch( $e126 ) {
			{
				var e = $e126;
				null;
			}
		}
	}
}
com.inq.flash.client.chatskins.SkinControl.onChatEngaged = function() {
	com.inq.flash.client.chatskins.SkinControl.stopOpenerScript(true);
	com.inq.flash.client.chatskins.SkinControl.StopTimer();
	com.inq.flash.client.chatskins.SkinControl.setFocusOnInputField();
}
com.inq.flash.client.chatskins.SkinControl.persistentChatInitialize = function() {
	try {
		var opener = null;
		try {
			opener = window.parent.opener.inqFrame;
		}
		catch( $e127 ) {
			if( js.Boot.__instanceof($e127,Error) ) {
				var e = $e127;
				null;
			} else throw($e127);
		}
		try {
			com.inq.flash.client.control.FlashPeer.setSessionParam("persistentChat","true");
		}
		catch( $e128 ) {
			if( js.Boot.__instanceof($e128,Error) ) {
				var e = $e128;
				null;
			} else throw($e128);
		}
		if(opener == null) {
			haxe.Log.trace("Oh no! no opener",{ fileName : "SkinControl.hx", lineNumber : 2587, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "persistentChatInitialize"});
		}
		window.onload = function(ev) {
			return true;
		}
		window.onunload = function(ev) {
			com.inq.flash.client.control.FlashPeer.closePersistent();
			Application.application.close();
			return true;
		}
		if(opener == null) {
			haxe.Log.trace("could not access the opener window",{ fileName : "SkinControl.hx", lineNumber : 2599, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "persistentChatInitialize"});
		}
		else {
			try {
				if(opener != null && opener["Inq"] != null && opener.Inq["FlashPeer"] != null && opener.Inq.FlashPeer["closePopupChat"] != null) opener.Inq.FlashPeer.closePopupChat();
			}
			catch( $e129 ) {
				{
					var e = $e129;
					null;
				}
			}
			try {
				com.inq.flash.client.control.FlashPeer.setPersistentWindowActive(true);
			}
			catch( $e130 ) {
				if( js.Boot.__instanceof($e130,Error) ) {
					var e = $e130;
					null;
				} else throw($e130);
			}
		}
		var btnCloseChat = (com.inq.flash.client.chatskins.SkinControl.isInApplication("btnCloseChat")?Application.application.btnCloseChat:null);
		var btnPopOut = (com.inq.flash.client.chatskins.SkinControl.isInApplication("btnPopOut")?Application.application.btnPopOut:null);
		var btnPopIn = (com.inq.flash.client.chatskins.SkinControl.isInApplication("btnPopIn")?Application.application.btnPopIn:null);
		if(com.inq.flash.client.chatskins.SkinControl.msgcntAtEntry == 0 && !com.inq.flash.client.chatskins.SkinControl.isClick2call()) {
			com.inq.flash.client.chatskins.SkinControl.timerTimeout = new com.inq.utils.Timer(com.inq.flash.client.chatskins.SkinControl.TIMEOUT_INITIALPOPUP);
			com.inq.flash.client.chatskins.SkinControl.timerTimeout.run = function() {
				com.inq.flash.client.chatskins.SkinControl.timerTimeout.stop();
				com.inq.flash.client.chatskins.SkinControl.onTimeout();
				com.inq.flash.client.chatskins.SkinControl.timerTimeout = null;
			}
		}
		if(btnCloseChat != null && btnPopIn == null) btnCloseChat.setVisible(false);
		if(btnPopOut != null) btnPopOut.setVisible(false);
		if(btnPopIn != null) btnPopIn.setVisible(true);
	}
	catch( $e131 ) {
		if( js.Boot.__instanceof($e131,Error) ) {
			var e = $e131;
			{
				haxe.Log.trace("error" + e,{ fileName : "SkinControl.hx", lineNumber : 2627, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "persistentChatInitialize"});
			}
		} else throw($e131);
	}
	try {
		if(com.inq.flash.client.chatskins.SkinControl.isClick2call()) {
			var chatCanvas = Application.application.callForm;
			chatCanvas.setVisible(false);
			chatCanvas = Application.application.callFormPersistent;
			chatCanvas.setVisible(true);
		}
	}
	catch( $e132 ) {
		if( js.Boot.__instanceof($e132,Error) ) {
			var e = $e132;
			{
				haxe.Log.trace("error" + e,{ fileName : "SkinControl.hx", lineNumber : 2638, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "persistentChatInitialize"});
			}
		} else throw($e132);
	}
}
com.inq.flash.client.chatskins.SkinControl.blockService = function(blockDetails) {
	com.inq.flash.client.control.FlashPeer.blockService(blockDetails);
}
com.inq.flash.client.chatskins.SkinControl.wasSaleAction = function() {
	return com.inq.flash.client.control.FlashPeer.wasSaleAction();
}
com.inq.flash.client.chatskins.SkinControl.executeCustomCommand = function(commandParam) {
	return com.inq.flash.client.control.FlashPeer.executeCustomCommand(commandParam);
}
com.inq.flash.client.chatskins.SkinControl.getScriptLine = function(index) {
	return com.inq.flash.client.chatskins.SkinControl.cw.getTranscriptMessage(index);
}
com.inq.flash.client.chatskins.SkinControl.getSendButton = function() {
	return Application.application.btnSend;
}
com.inq.flash.client.chatskins.SkinControl.hideInput = function() {
	com.inq.flash.client.chatskins.SkinControl.disableInput();
	var button = com.inq.flash.client.chatskins.SkinControl.getSendButton();
	if(button != null) {
		button.setVisible(false);
	}
	com.inq.flash.client.chatskins.SkinControl.showBottomImgWithoutInput(true);
}
com.inq.flash.client.chatskins.SkinControl.showInput = function(showIntroduction) {
	var button = com.inq.flash.client.chatskins.SkinControl.getSendButton();
	if(button != null) {
		button.setVisible(true);
	}
	var ti = com.inq.flash.client.chatskins.SkinControl.getTextInputField();
	if(ti != null) {
		ti._enable(false);
		if(showIntroduction && null != com.inq.flash.client.chatskins.SkinControl.getIntroduction()) {
			ti._setInput(com.inq.flash.client.chatskins.SkinControl.getIntroduction());
		}
		ti.setVisible(true);
	}
	com.inq.flash.client.chatskins.SkinControl.showBottomImgWithoutInput(false);
}
com.inq.flash.client.chatskins.SkinControl.showBottomImgWithoutInput = function(isShow) {
	var chatWin = Application.application["chat"];
	if(chatWin == null) {
		return;
	}
	var middleHidden = chatWin.findChild("bottomMiddleHiddenInput");
	if(middleHidden) {
		middleHidden.setVisible(isShow);
		var middle = chatWin.findChild("bottomMiddle");
		if(middle) {
			middle.setVisible(!isShow);
		}
	}
	var leftHidden = chatWin.findChild("bottomLeftHiddenInput");
	if(leftHidden) {
		leftHidden.setVisible(isShow);
		var left = chatWin.findChild("bottomLeft");
		if(left) {
			left.setVisible(!isShow);
		}
	}
	var rightHidden = chatWin.findChild("bottomRightHiddenInput");
	if(rightHidden) {
		rightHidden.setVisible(isShow);
		var right = chatWin.findChild("bottomRight");
		if(right) {
			right.setVisible(!isShow);
		}
	}
}
com.inq.flash.client.chatskins.SkinControl.executeAfter = function(condition,handler,contextLocation,timeout,cleanupHandler) {
	if(timeout == null) timeout = 2000;
	if(contextLocation == null) contextLocation = "executeAfter";
	if(condition()) {
		haxe.Log.trace(contextLocation + ": executing since condition is satisfied",{ fileName : "SkinControl.hx", lineNumber : 2750, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "executeAfter"});
		handler();
		if(cleanupHandler != null) cleanupHandler();
	}
	else if(timeout <= 0) {
		haxe.Log.trace(contextLocation + ": executing by timeout",{ fileName : "SkinControl.hx", lineNumber : 2754, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "executeAfter", customParams : ["error"]});
		handler();
		if(cleanupHandler != null) cleanupHandler();
	}
	else {
		haxe.Log.trace(contextLocation + ": waiting " + timeout + "ms for condition to be satisfied",{ fileName : "SkinControl.hx", lineNumber : 2758, className : "com.inq.flash.client.chatskins.SkinControl", methodName : "executeAfter"});
		com.inq.utils.Timer.delay(function() {
			com.inq.flash.client.chatskins.SkinControl.executeAfter(condition,handler,contextLocation,timeout - 100,cleanupHandler);
		},100);
	}
}
com.inq.flash.client.chatskins.SkinControl.prototype.__class__ = com.inq.flash.client.chatskins.SkinControl;
com.inq.flash.client.control.messagehandlers.ChatroomMemberConnectedMessageHandler = function(p) { if( p === $_ ) return; {
	com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.apply(this,[com.inq.flash.client.data.MessageFields.TYPE_CHATROOM_MEMBER_CONNECTED]);
}}
com.inq.flash.client.control.messagehandlers.ChatroomMemberConnectedMessageHandler.__name__ = ["com","inq","flash","client","control","messagehandlers","ChatroomMemberConnectedMessageHandler"];
com.inq.flash.client.control.messagehandlers.ChatroomMemberConnectedMessageHandler.__super__ = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler;
for(var k in com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype ) com.inq.flash.client.control.messagehandlers.ChatroomMemberConnectedMessageHandler.prototype[k] = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype[k];
com.inq.flash.client.control.messagehandlers.ChatroomMemberConnectedMessageHandler.prototype.processMessage = function(message) {
	if(message.getProperty(com.inq.flash.client.data.MessageFields.KEY_OWNER) == com.inq.flash.client.data.MessageFields.DATA_TRUE && "1" != message.getProperty(com.inq.flash.client.data.MessageFields.KEY_REPLAY)) {
		var cobrowseEnabled = com.inq.flash.messagingframework.StringUtils.getBooleanValue(message.getProperty(com.inq.flash.client.data.MessageFields.KEY_COBROWSE_ENABLED));
		com.inq.flash.client.chatskins.SkinControl.setAgentID(message.getProperty(com.inq.flash.client.data.MessageFields.KEY_CHATROOM_MEMBER_ID),com.inq.utils.EventDataUtils.fromMessage(message),cobrowseEnabled,message.getProperty(com.inq.flash.client.data.MessageFields.KEY_BUSINESS_UNIT_ID));
	}
	var isReassignMode = message.getProperty(com.inq.flash.client.data.MessageFields.KEY_IS_REASSIGNMENT_MODE);
	var tcMode = message.getProperty(com.inq.flash.client.data.MessageFields.KEY_TC_MODE);
	if(tcMode == com.inq.flash.client.data.MessageFields.DATA_TRANSFER || (tcMode == com.inq.flash.client.data.MessageFields.DATA_CONFERENCE && message.getProperty(com.inq.flash.client.data.MessageFields.KEY_SCREENING) == com.inq.flash.client.data.MessageFields.DATA_FALSE) || isReassignMode == com.inq.flash.client.data.MessageFields.DATA_TRUE) {
		com.inq.flash.client.chatskins.SkinControl.AddTranscriptItemToChatWindow("",message.getProperty(com.inq.flash.client.data.MessageFields.KEY_CLIENT_DISPLAY_TEXT),com.inq.flash.client.chatskins.ChatTextArea.SYSTEM,-1);
	}
}
com.inq.flash.client.control.messagehandlers.ChatroomMemberConnectedMessageHandler.prototype.__class__ = com.inq.flash.client.control.messagehandlers.ChatroomMemberConnectedMessageHandler;
com.inq.ui.ClientBody = function(p) { if( p === $_ ) return; {
	var doc = window.parent.document;
	var body = doc.body;
	com.inq.ui.Container.apply(this,[body,null,doc]);
}}
com.inq.ui.ClientBody.__name__ = ["com","inq","ui","ClientBody"];
com.inq.ui.ClientBody.__super__ = com.inq.ui.Container;
for(var k in com.inq.ui.Container.prototype ) com.inq.ui.ClientBody.prototype[k] = com.inq.ui.Container.prototype[k];
com.inq.ui.ClientBody.closeAll = function() {
	var keyz = Reflect.fields(com.inq.ui.ClientBody._collection);
	{
		var _g1 = 0, _g = keyz.length;
		while(_g1 < _g) {
			var ix = _g1++;
			var k = "" + keyz[ix];
			var element = com.inq.ui.ClientBody._collection[k];
			if(element._div.id != null && element._div.id.indexOf("tcChat_") == 0) {
				element.removeFromBody();
			}
		}
	}
}
com.inq.ui.ClientBody.registerElement = function(element) {
	var id = element.getID();
	if(id == null) {
		id = "inq_" + Math.round(Math.random() * 3141593);
		element.setID(id);
	}
	if(element != null) {
		com.inq.ui.ClientBody._collection[id] = element;
	}
}
com.inq.ui.ClientBody.getElement = function(id) {
	return com.inq.ui.ClientBody._collection[id];
}
com.inq.ui.ClientBody.prototype.resize = function() {
	null;
}
com.inq.ui.ClientBody.prototype.__class__ = com.inq.ui.ClientBody;
haxe.StackItem = { __ename__ : ["haxe","StackItem"], __constructs__ : ["CFunction","Module","FilePos","Method","Lambda"] }
haxe.StackItem.CFunction = ["CFunction",0];
haxe.StackItem.CFunction.toString = $estr;
haxe.StackItem.CFunction.__enum__ = haxe.StackItem;
haxe.StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Lambda = function(v) { var $x = ["Lambda",4,v]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.Stack = function() { }
haxe.Stack.__name__ = ["haxe","Stack"];
haxe.Stack.callStack = function() {
	return haxe.Stack.makeStack("$s");
}
haxe.Stack.exceptionStack = function() {
	return haxe.Stack.makeStack("$e");
}
haxe.Stack.toString = function(stack) {
	var b = new StringBuf();
	{
		var _g = 0;
		while(_g < stack.length) {
			var s = stack[_g];
			++_g;
			b.b[b.b.length] = "\nCalled from ";
			haxe.Stack.itemToString(b,s);
		}
	}
	return b.b.join("");
}
haxe.Stack.itemToString = function(b,s) {
	var $e = (s);
	switch( $e[1] ) {
	case 0:
	{
		b.b[b.b.length] = "a C function";
	}break;
	case 1:
	var m = $e[2];
	{
		b.b[b.b.length] = "module ";
		b.b[b.b.length] = m;
	}break;
	case 2:
	var line = $e[4], file = $e[3], s1 = $e[2];
	{
		if(s1 != null) {
			haxe.Stack.itemToString(b,s1);
			b.b[b.b.length] = " (";
		}
		b.b[b.b.length] = file;
		b.b[b.b.length] = " line ";
		b.b[b.b.length] = line;
		if(s1 != null) b.b[b.b.length] = ")";
	}break;
	case 3:
	var meth = $e[3], cname = $e[2];
	{
		b.b[b.b.length] = cname;
		b.b[b.b.length] = ".";
		b.b[b.b.length] = meth;
	}break;
	case 4:
	var n = $e[2];
	{
		b.b[b.b.length] = "local function #";
		b.b[b.b.length] = n;
	}break;
	}
}
haxe.Stack.makeStack = function(s) {
	var a = function($this) {
		var $r;
		try {
			$r = eval(s);
		}
		catch( $e133 ) {
			{
				var e = $e133;
				$r = [];
			}
		}
		return $r;
	}(this);
	var m = new Array();
	{
		var _g1 = 0, _g = a.length - (s == "$s"?2:0);
		while(_g1 < _g) {
			var i = _g1++;
			var d = a[i].split("::");
			m.unshift(haxe.StackItem.Method(d[0],d[1]));
		}
	}
	return m;
}
haxe.Stack.prototype.__class__ = haxe.Stack;
ValueType = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] }
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
Type = function() { }
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	if(o.__enum__ != null) return null;
	return o.__class__;
}
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
}
Type.getSuperClass = function(c) {
	return c.__super__;
}
Type.getClassName = function(c) {
	if(c == null) return null;
	var a = c.__name__;
	return a.join(".");
}
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
}
Type.resolveClass = function(name) {
	var cl;
	try {
		cl = eval(name);
	}
	catch( $e134 ) {
		{
			var e = $e134;
			{
				cl = null;
			}
		}
	}
	if(cl == null || cl.__name__ == null) return null;
	return cl;
}
Type.resolveEnum = function(name) {
	var e;
	try {
		e = eval(name);
	}
	catch( $e135 ) {
		{
			var err = $e135;
			{
				e = null;
			}
		}
	}
	if(e == null || e.__ename__ == null) return null;
	return e;
}
Type.createInstance = function(cl,args) {
	if(args.length <= 3) return new cl(args[0],args[1],args[2]);
	if(args.length > 8) throw "Too many arguments";
	return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
}
Type.createEmptyInstance = function(cl) {
	return new cl($_);
}
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
}
Type.getInstanceFields = function(c) {
	var a = Reflect.fields(c.prototype);
	a.remove("__class__");
	return a;
}
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	a.remove("__name__");
	a.remove("__interfaces__");
	a.remove("__super__");
	a.remove("prototype");
	return a;
}
Type.getEnumConstructs = function(e) {
	return e.__constructs__;
}
Type["typeof"] = function(v) {
	switch(typeof(v)) {
	case "boolean":{
		return ValueType.TBool;
	}break;
	case "string":{
		return ValueType.TClass(String);
	}break;
	case "number":{
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	}break;
	case "object":{
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	}break;
	case "function":{
		if(v.__name__ != null) return ValueType.TObject;
		return ValueType.TFunction;
	}break;
	case "undefined":{
		return ValueType.TNull;
	}break;
	default:{
		return ValueType.TUnknown;
	}break;
	}
}
Type.enumEq = function(a,b) {
	if(a == b) return true;
	if(a[0] != b[0]) return false;
	{
		var _g1 = 2, _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
	}
	var e = a.__enum__;
	if(e != b.__enum__ || e == null) return false;
	return true;
}
Type.enumConstructor = function(e) {
	return e[0];
}
Type.enumParameters = function(e) {
	return e.slice(2);
}
Type.enumIndex = function(e) {
	return e[1];
}
Type.prototype.__class__ = Type;
Reflect = function() { }
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	if(o.hasOwnProperty != null) return o.hasOwnProperty(field);
	var arr = Reflect.fields(o);
	{ var $it136 = arr.iterator();
	while( $it136.hasNext() ) { var t = $it136.next();
	if(t == field) return true;
	}}
	return false;
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	}
	catch( $e137 ) {
		{
			var e = $e137;
			null;
		}
	}
	return v;
}
Reflect.setField = function(o,field,value) {
	o[field] = value;
}
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
}
Reflect.fields = function(o) {
	if(o == null) return new Array();
	var a = new Array();
	if(o.hasOwnProperty) {
		
					for(var i in o)
						if( o.hasOwnProperty(i) )
							a.push(i);
				;
	}
	else {
		var t;
		try {
			t = o.__proto__;
		}
		catch( $e138 ) {
			{
				var e = $e138;
				{
					t = null;
				}
			}
		}
		if(t != null) o.__proto__ = null;
		
					for(var i in o)
						if( i != "__proto__" )
							a.push(i);
				;
		if(t != null) o.__proto__ = t;
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && f.__name__ == null;
}
Reflect.compare = function(a,b) {
	return ((a == b)?0:((((a) > (b))?1:-1)));
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return (t == "string" || (t == "object" && !v.__enum__) || (t == "function" && v.__name__ != null));
}
Reflect.deleteField = function(o,f) {
	if(!Reflect.hasField(o,f)) return false;
	delete(o[f]);
	return true;
}
Reflect.copy = function(o) {
	var o2 = { }
	{
		var _g = 0, _g1 = Reflect.fields(o);
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			o2[f] = Reflect.field(o,f);
		}
	}
	return o2;
}
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = new Array();
		{
			var _g1 = 0, _g = arguments.length;
			while(_g1 < _g) {
				var i = _g1++;
				a.push(arguments[i]);
			}
		}
		return f(a);
	}
}
Reflect.prototype.__class__ = Reflect;
com.inq.utils.Timer = function(time_ms) { if( time_ms === $_ ) return; {
	this.id = com.inq.utils.Timer.arr.length;
	com.inq.utils.Timer.arr[this.id] = this;
	this.timerId = window.setInterval("com.inq.utils.Timer.Run(" + this.id + ");",time_ms);
}}
com.inq.utils.Timer.__name__ = ["com","inq","utils","Timer"];
com.inq.utils.Timer.Run = function(indx) {
	if(com.inq.utils.Timer.arr[indx] != null) com.inq.utils.Timer.arr[indx].run();
	else haxe.Log.trace("timer #" + indx + " has been deleted",{ fileName : "Timer.hx", lineNumber : 53, className : "com.inq.utils.Timer", methodName : "Run"});
}
com.inq.utils.Timer.delay = function(f,time_ms) {
	var t = new com.inq.utils.Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	}
	return t;
}
com.inq.utils.Timer.stamp = function() {
	return Date.now().getTime() / 1000;
}
com.inq.utils.Timer.prototype.id = null;
com.inq.utils.Timer.prototype.run = function() {
	null;
}
com.inq.utils.Timer.prototype.stop = function() {
	if(this.id == null) return;
	window.clearInterval(this.timerId);
	com.inq.utils.Timer.arr[this.id].run = function() {
		haxe.Log.trace("fake function",{ fileName : "Timer.hx", lineNumber : 65, className : "com.inq.utils.Timer", methodName : "stop"});
		try {
			window.clearInterval(com.inq.utils.Timer.arr[id].timerId);
		}
		catch( $e139 ) {
			if( js.Boot.__instanceof($e139,Error) ) {
				var e = $e139;
				null;
			} else throw($e139);
		}
	}
	if(this.id > 100 && this.id == com.inq.utils.Timer.arr.length - 1) {
		var p = this.id - 1;
		while(p >= 0 && com.inq.utils.Timer.arr[p] == null) p--;
		com.inq.utils.Timer.arr = com.inq.utils.Timer.arr.slice(0,p + 1);
	}
	this.id = null;
}
com.inq.utils.Timer.prototype.timerId = null;
com.inq.utils.Timer.prototype.__class__ = com.inq.utils.Timer;
com.inq.stage.DragResize = function(p) { if( p === $_ ) return; {
	this.className = "DragResize";
	this.styleSaved = "";
	this.cursor = "default";
	this.pDraggerNow = null;
	this.touchIdentifier = com.inq.stage.DragResize.TOUCH_IDENTIFER_UNUSED;
}}
com.inq.stage.DragResize.__name__ = ["com","inq","stage","DragResize"];
com.inq.stage.DragResize.o = null;
com.inq.stage.DragResize["typeof"] = function(v) {
	return (typeof(v));
}
com.inq.stage.DragResize.WhenDone = function() {
	if(com.inq.stage.DragResize.instance != null) com.inq.stage.DragResize.instance.whenDone();
	com.inq.stage.DragResize.instance = null;
}
com.inq.stage.DragResize.prototype._attachEventListener = function(object,eventName,func) {
	if(null != (window["addEventListener"])) {
		object.addEventListener(eventName,func,false);
	}
	else if(null != window["attachEvent"]) {
		object.attachEvent("on" + eventName,func);
	}
	else {
		object["on" + eventName] = func;
	}
}
com.inq.stage.DragResize.prototype._removeEventListener = function(object,eventName,func) {
	if(null != window["removeEventListener"]) {
		object.removeEventListener(eventName,func,false);
	}
	else if(null != window["detachEvent"]) {
		object.detachEvent("on" + eventName,func);
	}
	else {
		object["on" + eventName] = null;
	}
}
com.inq.stage.DragResize.prototype.addMouseEvents = function() {
	this._removeEventListener(this.obj,"touchstart",this.uponTouchStartClosure);
	this._attachEventListener(com.inq.stage.DragResize.doc,"mouseout",this.uponMouseOutClosure);
	this._attachEventListener(com.inq.stage.DragResize.doc,"mousemove",this.uponMouseDragClosure);
	this._attachEventListener(com.inq.stage.DragResize.doc,"mouseup",this.uponMouseDropClosure);
}
com.inq.stage.DragResize.prototype.addTouchEvents = function() {
	this._removeEventListener(this.dragImage,"mousedown",this.uponMouseDragStartClosure);
	this._attachEventListener(com.inq.stage.DragResize.doc,"touchcancel",this.uponTouchCancelClosure);
	this._attachEventListener(com.inq.stage.DragResize.doc,"touchend",this.uponTouchEndClosure);
	this._attachEventListener(com.inq.stage.DragResize.doc,"touchmove",this.uponTouchDragClosure);
}
com.inq.stage.DragResize.prototype.bindClosures = function() {
	this.uponTouchStartClosure = $closure(this,"uponTouchStart");
	this.uponTouchCancelClosure = $closure(this,"uponTouchCancel");
	this.uponTouchEndClosure = $closure(this,"uponTouchEnd");
	this.uponTouchDragClosure = $closure(this,"uponTouchDrag");
	this.uponMouseDragStartClosure = $closure(this,"uponDragStart");
	this.uponMouseOutClosure = $closure(this,"uponMouseOut");
	this.uponMouseDragClosure = $closure(this,"uponDrag");
	this.uponMouseDropClosure = $closure(this,"uponDrop");
}
com.inq.stage.DragResize.prototype.className = null;
com.inq.stage.DragResize.prototype.clickOffsetX = null;
com.inq.stage.DragResize.prototype.clickOffsetY = null;
com.inq.stage.DragResize.prototype.cursor = null;
com.inq.stage.DragResize.prototype.deltaX = null;
com.inq.stage.DragResize.prototype.deltaY = null;
com.inq.stage.DragResize.prototype.done = function() {
	this.touchIdentifier = com.inq.stage.DragResize.TOUCH_IDENTIFER_UNUSED;
	this.restoreStyle();
	window.setTimeout($closure(this,"whenDone"),1);
}
com.inq.stage.DragResize.prototype.dragImage = null;
com.inq.stage.DragResize.prototype.draggerHeight = null;
com.inq.stage.DragResize.prototype.draggerWidth = null;
com.inq.stage.DragResize.prototype.fireDone = function() {
	this.whenDone();
}
com.inq.stage.DragResize.prototype.fireDoneState = function() {
	com.inq.stage.DragResize.instance = this;
	window.setTimeout($closure(com.inq.stage.DragResize,"WhenDone"),1);
}
com.inq.stage.DragResize.prototype.fixDragImage = function(element) {
	if(element.nodeName.toUpperCase() == "IMG") {
		var par = element.parentNode;
		var div = document.createElement("DIV");
		div.id = element.id;
		div.style.cssText = "background-color:#007700; opacity:0.4; " + element.style.cssText;
		div.title = element.title;
		par.insertBefore(div,element);
		element.style.height = (element.style.width = "100%");
		element.style.position = "absolute";
		element.style.top = (element.style.left = "0px");
		element.id = div.id + "_image";
		par.removeChild(element);
		return div;
	}
	else if(element.nodeName.toUpperCase() == "DIV") {
		var images = element.getElementsByTagName("IMG");
		if(images.length > 0) {
			var i, image = null;
			{
				var _g1 = 0, _g = images.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(images[i1].parentNode == element) {
						image = images[i1];
						break;
					}
				}
			}
			if(image != null) {
				var par = image.parentNode;
				if(par == element) {
					var dragSafe = document.createElement("INPUT");
					dragSafe.type = "image";
					if(image.src == null || image.src == "") dragSafe.src = Application.application["clearImage"];
					else dragSafe.src = image.src;
					dragSafe.style.cssText = element.style.cssText + "; top:0px; left:0px; height: 100%; width: 100%;display:block";
					dragSafe.className = "tcChat";
					dragSafe.name = "DragSafe";
					par.replaceChild(dragSafe,image);
					return dragSafe;
				}
			}
		}
		var inputEl = null;
		var inputs = element.getElementsByTagName("INPUT");
		if(inputs.length > 0) {
			{
				var _g1 = 0, _g = inputs.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(inputs[i].parentNode == element) {
						inputEl = inputs[i];
						break;
					}
				}
			}
			if(inputEl != null && inputEl.name != "DragSafe") {
				inputEl.name = "DragSafe";
				inputEl.style.cssText = element.style.cssText + "; top:0px; left:0px; height: 100%; width: 100%;display: block;";
			}
		}
		if(inputEl != null) return inputEl;
	}
	return element;
}
com.inq.stage.DragResize.prototype.getAbsolutePosition = function(e) {
	var loc = this.getPosition(e);
	var p = window.frameElement;
	while(p != null) {
		loc.X += p.offsetLeft;
		loc.Y += p.offsetTop;
		p = p.offsetParent;
		if(p.tagName == "BODY") break;
	}
	return loc;
}
com.inq.stage.DragResize.prototype.getDefaultMax = function() {
	return { X : 10000, Y : 10000}
}
com.inq.stage.DragResize.prototype.getDefaultMin = function() {
	return { X : 0, Y : 0}
}
com.inq.stage.DragResize.prototype.getPosition = function(e) {
	return { X : e.clientX, Y : e.clientY}
}
com.inq.stage.DragResize.prototype.getPositionGecko = function(e) {
	return { X : e.clientX, Y : e.clientY}
}
com.inq.stage.DragResize.prototype.getPositionIE = function(e) {
	return { X : window.parent.event.clientX, Y : window.parent.event.clientY}
}
com.inq.stage.DragResize.prototype.getScreenMax = function() {
	return { X : com.inq.flash.client.chatskins.ScrollMonitor.getScrollLeft() + com.inq.flash.client.chatskins.ScrollMonitor.getScrollWidth(), Y : com.inq.flash.client.chatskins.ScrollMonitor.getScrollTop() + com.inq.flash.client.chatskins.ScrollMonitor.getScrollHeight()}
}
com.inq.stage.DragResize.prototype.getTarget = function(e) {
	var t = null;
	if(!e) e = window.event;
	if(e.target) t = e.target;
	else if(e.srcElement) t = e.srcElement;
	if(t.nodeType == 3) t = t.parentNode;
	return t;
}
com.inq.stage.DragResize.prototype.getTouchByIdentifer = function(ev) {
	try {
		var touchList = ev.changedTouches;
		if(touchList == null) return null;
		if(this.touchIdentifier == com.inq.stage.DragResize.TOUCH_IDENTIFER_UNUSED) return null;
		if(touchList["identifiedTouch"] == null) {
			var i;
			{
				var _g1 = 0, _g = touchList.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(touchList[i1].identifier == this.touchIdentifier) {
						return touchList[i1];
					}
				}
			}
			return null;
		}
		else {
			return touchList.identifiedTouch(this.touchIdentifier);
		}
	}
	catch( $e140 ) {
		{
			var e = $e140;
			{
				window.alert("ERROR: getTouchByIdentifer: " + e);
			}
		}
	}
	return null;
}
com.inq.stage.DragResize.prototype.init = function(o,oRoot) {
	if(window.parent.name == "_inqPersistentChat") return;
	var fullPage = ((null == Application.application.skinConfig["fullPage"])?false:Application.application.skinConfig["fullPage"]);
	if(fullPage) {
		return;
	}
	if(o == null) {
		return;
	}
	this.dragImage = this.fixDragImage(o);
	this.obj = o;
	if(o[com.inq.stage.DragResize.INSTANCE_LABEL] != null) {
		haxe.Log.trace("o already has property for " + com.inq.stage.DragResize.INSTANCE_LABEL + ": " + o[com.inq.stage.DragResize.INSTANCE_LABEL],{ fileName : "DragResize.hx", lineNumber : 856, className : "com.inq.stage.DragResize", methodName : "init"});
	}
	else {
		o[com.inq.stage.DragResize.INSTANCE_LABEL] = this;
		oRoot[com.inq.stage.DragResize.INSTANCE_LABEL] = this;
		this.root = ((oRoot && oRoot != null)?oRoot:o);
		this.bindClosures();
		if(this.isSupported("touchstart")) {
			this.obj[com.inq.stage.DragResize.INSTANCE_LABEL] = this;
			this._attachEventListener(this.dragImage,"touchstart",this.uponTouchStartClosure);
		}
		if(this.isSupported("mousedown")) {
			this._attachEventListener(this.dragImage,"mousedown",this.uponMouseDragStartClosure);
		}
	}
}
com.inq.stage.DragResize.prototype.isLeftClick = function(e) {
	var ev = ((!!e)?e:window.event);
	var mouseButtonState = 1;
	if(window.navigator.appName == "Netscape") mouseButtonState = e.which;
	else mouseButtonState = window.parent.event.button;
	if(ev.type.indexOf("touch") == 0) return true;
	return ((mouseButtonState == 1)?true:false);
}
com.inq.stage.DragResize.prototype.isSupported = function(eventType) {
	var el = window.document.createElement("img");
	el.setAttribute("on" + eventType,"return true;");
	var fun = el["on" + eventType];
	var type = com.inq.stage.DragResize["typeof"](fun);
	if("function" == type) {
		return true;
	}
	else if("string" == type) {
		return true;
	}
	else {
		return false;
	}
}
com.inq.stage.DragResize.prototype.obj = null;
com.inq.stage.DragResize.prototype.pDraggerNow = null;
com.inq.stage.DragResize.prototype.pDraggerStart = null;
com.inq.stage.DragResize.prototype.pLast = null;
com.inq.stage.DragResize.prototype.pMax = null;
com.inq.stage.DragResize.prototype.pMin = null;
com.inq.stage.DragResize.prototype.pStart = null;
com.inq.stage.DragResize.prototype.removeEvents = function() {
	this.removeMouseEvents();
	this.fireDoneState();
}
com.inq.stage.DragResize.prototype.removeMouseEvents = function() {
	this._attachEventListener(this.dragImage,"touchstart",this.uponTouchStartClosure);
	this._removeEventListener(com.inq.stage.DragResize.doc,"mouseout",this.uponMouseOutClosure);
	this._removeEventListener(com.inq.stage.DragResize.doc,"mousemove",this.uponMouseDragClosure);
	this._removeEventListener(com.inq.stage.DragResize.doc,"mouseup",this.uponMouseDropClosure);
}
com.inq.stage.DragResize.prototype.removeTouchEvents = function() {
	this._attachEventListener(this.dragImage,"mousedown",this.uponMouseDragStartClosure);
	this._removeEventListener(com.inq.stage.DragResize.doc,"touchcancel",this.uponTouchCancelClosure);
	this._removeEventListener(com.inq.stage.DragResize.doc,"touchend",this.uponTouchEndClosure);
	this._removeEventListener(com.inq.stage.DragResize.doc,"touchmove",this.uponTouchDragClosure);
}
com.inq.stage.DragResize.prototype.reposition = function(pCur) {
	if(pCur.X == this.pLast.X && pCur.Y == this.pLast.Y) {
		return false;
	}
	else null;
	var top, left;
	var o = this.obj;
	left = pCur.X - this.deltaX;
	if(pCur.X != this.pLast.X && left >= this.pMin.X && left < this.pMax.X) {
		this.setLeft(this.pDraggerNow.X = left);
	}
	else if(left >= this.pMax.X) {
		this.setLeft(this.pDraggerNow.X = this.pMax.X);
	}
	else if(left < this.pMin.X) {
		this.setLeft(this.pDraggerNow.X = this.pMin.X);
	}
	top = pCur.Y - this.deltaY;
	if(pCur.Y != this.pLast.Y && top >= this.pMin.Y && top < this.pMax.Y) {
		this.pDraggerNow.Y = top;
		this.setTop(this.pDraggerNow.Y = top);
	}
	else if(top >= this.pMax.Y) {
		this.setTop(this.pDraggerNow.Y = this.pMax.Y);
	}
	else if(top < this.pMin.Y) {
		this.setTop(this.pDraggerNow.Y = this.pMin.Y);
	}
	this.pLast = pCur;
	return false;
}
com.inq.stage.DragResize.prototype.repositionTouch = function(pCur) {
	try {
		if(this.pLast != null && pCur.X == this.pLast.X && pCur.Y == this.pLast.Y) return false;
		var top, left;
		left = pCur.X;
		if(pCur.X != this.pLast.X && left >= this.pMin.X && left < this.pMax.X) {
			this.setLeft(left);
		}
		else if(left >= this.pMax.X) {
			this.setLeft(left = this.pMax.X);
		}
		else if(left < this.pMin.X) {
			this.setLeft(left = this.pMin.X);
		}
		top = pCur.Y;
		if(pCur.Y != this.pLast.Y && top >= this.pMin.Y && top < this.pMax.Y) {
			this.setTop(top);
		}
		else if(top >= this.pMax.Y) {
			this.setTop(top = this.pMax.Y);
		}
		else if(top < this.pMin.Y) {
			this.setTop(top = this.pMin.Y);
		}
		this.pDraggerNow = { X : left, Y : top}
		this.pLast = pCur;
	}
	catch( $e141 ) {
		{
			var e = $e141;
			{
				window.alert("ERROR: repositionTouch: " + e);
			}
		}
	}
	return false;
}
com.inq.stage.DragResize.prototype.restoreStyle = function() {
	this.obj.style.cssText = this.styleSaved;
}
com.inq.stage.DragResize.prototype.root = null;
com.inq.stage.DragResize.prototype.rootHeight = null;
com.inq.stage.DragResize.prototype.rootWidth = null;
com.inq.stage.DragResize.prototype.saveStyle = function() {
	this.styleSaved = this.obj.style.cssText;
}
com.inq.stage.DragResize.prototype.setDragBorder = function() {
	null;
}
com.inq.stage.DragResize.prototype.setLeft = function(top) {
	window.alert("setLeft override failed");
}
com.inq.stage.DragResize.prototype.setTop = function(top) {
	window.alert("setTop override failed");
}
com.inq.stage.DragResize.prototype.styleSaved = null;
com.inq.stage.DragResize.prototype.touch = null;
com.inq.stage.DragResize.prototype.touchIdentifier = null;
com.inq.stage.DragResize.prototype.touchOffsetX = null;
com.inq.stage.DragResize.prototype.touchOffsetY = null;
com.inq.stage.DragResize.prototype.uponDoNothing = function(e) {
	var ev = ((!!e)?e:window.event);
	if(ev["preventDefault"] != null) ev.preventDefault();
	return false;
}
com.inq.stage.DragResize.prototype.uponDrag = function(e) {
	var ev = ((!!e)?e:window.event);
	if(!!(this.obj.dragging)) {
		return false;
	}
	this.obj["dragging"] = true;
	if(ev["preventDefault"] != null) ev.preventDefault();
	var pCur = this.getPosition(ev);
	this.reposition(pCur);
	this.obj["dragging"] = false;
	return false;
}
com.inq.stage.DragResize.prototype.uponDragEndFromStage = function(e) {
	var ev = ((!!e)?e:window.event);
	if(ev["preventDefault"] != null) ev.preventDefault();
	var pCur = this.getAbsolutePosition(ev);
	this.removeEvents();
	this.restoreStyle();
	this.reposition(pCur);
	this.fireDoneState();
	return false;
}
com.inq.stage.DragResize.prototype.uponDragOverFromStage = function(e) {
	var ev = ((!!e)?e:window.event);
	if(ev["preventDefault"] != null) ev.preventDefault();
	var pCur = this.getAbsolutePosition(ev);
	this.reposition(pCur);
	return false;
}
com.inq.stage.DragResize.prototype.uponDragStart = function(e) {
	var ev = ((!!e)?e:window.event);
	var evType = ev.type;
	if(ev["preventDefault"] != null) ev.preventDefault();
	var o = this.obj;
	if(!this.isLeftClick(ev)) return false;
	this.pStart = { X : Std.parseInt(this.root.style["left"]), Y : Std.parseInt(this.root.style["top"])}
	this.rootHeight = Std.parseInt(this.root.style.height);
	this.rootWidth = Std.parseInt(this.root.style.width);
	this.pDraggerStart = { X : Std.parseInt(o.style["left"]), Y : Std.parseInt(o.style["top"])}
	this.draggerHeight = Std.parseInt(o.style.height);
	this.draggerWidth = Std.parseInt(o.style.width);
	this.pDraggerNow = { X : this.pDraggerStart.X, Y : this.pDraggerStart.Y}
	this.pLast = this.getPosition(ev);
	this.deltaX = this.pLast.X - this.pDraggerStart.X;
	this.deltaY = this.pLast.Y - this.pDraggerStart.Y;
	this.pMin = this.getDefaultMin();
	this.pMax = this.getDefaultMax();
	this.saveStyle();
	o.style["cursor"] = this.cursor;
	this.setDragBorder();
	com.inq.stage.DragResize.instance = this;
	this.addMouseEvents();
	return false;
}
com.inq.stage.DragResize.prototype.uponDrop = function(e) {
	var ev = ((!!e)?e:window.event);
	if(ev["preventDefault"] != null) ev.preventDefault();
	var pCur = this.getPosition(ev);
	this.removeEvents();
	this.done();
	return this.reposition(pCur);
}
com.inq.stage.DragResize.prototype.uponMouseDragClosure = null;
com.inq.stage.DragResize.prototype.uponMouseDragStartClosure = null;
com.inq.stage.DragResize.prototype.uponMouseDropClosure = null;
com.inq.stage.DragResize.prototype.uponMouseOut = function(e) {
	var ev = ((!!e)?e:window.event);
	if(ev["preventDefault"] != null) ev.preventDefault();
	var pCur = this.getPosition(ev);
	var outOfArea = false;
	var pMax = this.getScreenMax();
	if(pCur.Y < 0) {
		pCur.Y = 0;
		outOfArea = true;
	}
	if(pCur.X < 0) {
		pCur.X = 0;
		outOfArea = true;
	}
	if(pCur.Y >= pMax.Y) {
		pCur.Y = pMax.Y;
		outOfArea = true;
	}
	if(pCur.X >= pMax.X) {
		pCur.X = pMax.X;
		outOfArea = true;
	}
	if(outOfArea) {
		this.removeEvents();
		this.restoreStyle();
		this.reposition(pCur);
		this.fireDoneState();
		return false;
	}
	return this.uponDrag(ev);
}
com.inq.stage.DragResize.prototype.uponMouseOutClosure = null;
com.inq.stage.DragResize.prototype.uponTouchCancel = function(e) {
	var ev = ((!!e)?e:window.event);
	if(ev["preventDefault"] != null) ev.preventDefault();
	return false;
}
com.inq.stage.DragResize.prototype.uponTouchCancelClosure = null;
com.inq.stage.DragResize.prototype.uponTouchDrag = function(e) {
	var ev = ((!!e)?e:window.event);
	if(ev["preventDefault"] != null) ev.preventDefault();
	try {
		this.touch = this.getTouchByIdentifer(ev);
		if(this.touch == null) return false;
		var pCur = { X : (this.touch.pageX - this.touchOffsetX), Y : (this.touch.pageY - this.touchOffsetY)}
		this.repositionTouch(pCur);
	}
	catch( $e142 ) {
		{
			var e1 = $e142;
			{
				window.alert("uponTouchDrag ERROR: " + e1);
			}
		}
	}
	return false;
}
com.inq.stage.DragResize.prototype.uponTouchDragClosure = null;
com.inq.stage.DragResize.prototype.uponTouchEnd = function(e) {
	try {
		var ev = ((!!e)?e:window.event);
		if(ev["preventDefault"] != null) ev.preventDefault();
		this.touch = this.getTouchByIdentifer(ev);
		if(this.touch == null) return false;
		this.restoreStyle();
		var pCur = { X : (this.touch.pageX - this.touchOffsetX), Y : (this.touch.pageY - this.touchOffsetY)}
		this.repositionTouch(pCur);
		this.removeTouchEvents();
		this.done();
	}
	catch( $e143 ) {
		{
			var e1 = $e143;
			{
				window.alert("ERROR: uponTouchEnd: " + e1);
			}
		}
	}
	return false;
}
com.inq.stage.DragResize.prototype.uponTouchEndClosure = null;
com.inq.stage.DragResize.prototype.uponTouchStart = function(e) {
	var ev = ((!!e)?e:window.event);
	var evType = ev.type;
	if(ev["preventDefault"] != null) ev.preventDefault();
	var o = this.obj;
	this.pStart = { X : Std.parseInt(this.root.style["left"]), Y : Std.parseInt(this.root.style["top"])}
	var style = o.style;
	if(this.touchIdentifier != com.inq.stage.DragResize.TOUCH_IDENTIFER_UNUSED) return false;
	this.touch = ev.changedTouches[0];
	this.touchOffsetX = Math.round(this.touch.pageX) - Std.parseInt(style.left);
	this.touchOffsetY = Math.round(this.touch.pageY) - Std.parseInt(style.top);
	this.touchIdentifier = this.touch.identifier;
	this.pMin = this.getDefaultMin();
	this.pMax = this.getDefaultMax();
	this.saveStyle();
	o.style["cursor"] = this.cursor;
	this.addTouchEvents();
	this.setDragBorder();
	this.pLast = { X : (this.touch.pageX - this.clickOffsetX), Y : (this.touch.pageY - this.clickOffsetY)}
	return false;
}
com.inq.stage.DragResize.prototype.uponTouchStartClosure = null;
com.inq.stage.DragResize.prototype.whenDone = function() {
	null;
}
com.inq.stage.DragResize.prototype.__class__ = com.inq.stage.DragResize;
com.inq.stage.DragResize.__interfaces__ = [com.inq.stage.IDragResize];
com.inq.stage.Resize = function(p) { if( p === $_ ) return; {
	com.inq.stage.DragResize.apply(this,[]);
	this.className = "Resize";
	this.cursor = "se-resize";
}}
com.inq.stage.Resize.__name__ = ["com","inq","stage","Resize"];
com.inq.stage.Resize.__super__ = com.inq.stage.DragResize;
for(var k in com.inq.stage.DragResize.prototype ) com.inq.stage.Resize.prototype[k] = com.inq.stage.DragResize.prototype[k];
com.inq.stage.Resize.setResizable = function() {
	if(window.parent.name == "_inqPersistentChat") return;
	var instance = new com.inq.stage.Resize();
	var cntr = window.parent.document.getElementById("inqChatStage");
	var dragHandleElem = window.parent.document.getElementById("inqDivResizeCorner");
	instance.init(dragHandleElem,cntr);
}
com.inq.stage.Resize.prototype.getDefaultMax = function() {
	var width = Std.parseInt(this.obj.style.width);
	var height = Std.parseInt(this.obj.style.height);
	return { X : com.inq.flash.client.chatskins.ScrollMonitor.getScrollLeft() + com.inq.flash.client.chatskins.ScrollMonitor.getScrollWidth() - width, Y : com.inq.flash.client.chatskins.ScrollMonitor.getScrollTop() + com.inq.flash.client.chatskins.ScrollMonitor.getScrollHeight() - height}
}
com.inq.stage.Resize.prototype.getDefaultMin = function() {
	return { X : this.pStart.X + Application.getMinWidth(), Y : this.pStart.Y + Application.getMinHeight()}
}
com.inq.stage.Resize.prototype.newHeight = null;
com.inq.stage.Resize.prototype.newWidth = null;
com.inq.stage.Resize.prototype.setDragBorder = function() {
	this.stageLeft = this.root.style.left;
	this.stageTop = this.root.style.top;
	var height = Std.parseInt(this.root.style.height);
	var width = Std.parseInt(this.root.style.width);
	var borderWidth = 3;
	this.obj.style.cursor = "se-resize";
	this.titlebar = window.parent.document.getElementById("inqTitleBar");
	if(null == this.titlebarStyle) {
		this.titlebarStyle = this.titlebar.style.cssText;
	}
	this.titlebar.style.top = this.root.style.top;
	this.titlebar.style.left = this.root.style.left;
	this.titlebar.style.borderStyle = "dashed";
	this.titlebar.style.cursor = "se-resize";
	this.titlebar.style.borderWidth = borderWidth + "px";
	this.titlebar.style.borderColor = ((null == Application.application.skinConfig["dragBorderColor"])?com.inq.stage.DragResize.DEFAULT_BORDER_COLOR:Application.application.skinConfig.dragBorderColor);
	this.titlebar.style.height = (height - borderWidth) + "px";
	this.titlebar.style.width = (width - borderWidth) + "px";
}
com.inq.stage.Resize.prototype.setLeft = function(left) {
	this.newWidth = left - this.pStart.X + this.draggerWidth;
	this.titlebar.style.width = this.newWidth + "px";
	this.obj.style.left = left + "px";
}
com.inq.stage.Resize.prototype.setTop = function(top) {
	this.newHeight = top - this.pStart.Y + this.draggerHeight;
	this.titlebar.style.height = this.newHeight + "px";
	this.obj.style.top = top + "px";
}
com.inq.stage.Resize.prototype.stageLeft = null;
com.inq.stage.Resize.prototype.stageTop = null;
com.inq.stage.Resize.prototype.titlebar = null;
com.inq.stage.Resize.prototype.titlebarStyle = null;
com.inq.stage.Resize.prototype.uponDrop = function(e) {
	this.titlebar.style.cssText = this.titlebarStyle;
	return com.inq.stage.DragResize.prototype.uponDrop.apply(this,[e]);
}
com.inq.stage.Resize.prototype.whenDone = function() {
	this.titlebar.style.cssText = this.titlebarStyle;
	Application.ResizeStage(this.newWidth,this.newHeight);
}
com.inq.stage.Resize.prototype.__class__ = com.inq.stage.Resize;
com.inq.stage.Resize.__interfaces__ = [com.inq.stage.IDragResize];
com.inq.flash.client.control.ApplicationController = function(p) { if( p === $_ ) return; {
	if(null == com.inq.flash.client.control.ApplicationController.applicationController) com.inq.flash.client.control.ApplicationController.applicationController = this;
	this.chatRouterListen = false;
	this.firstMessageSent = this.persistentReconnect = false;
	this.openerMessageQueue = new Array();
	this.authorizedOnce = false;
	this.chatAccepted = false;
	this.bSendClickStreamData = false;
	this.messageQueue = new Array();
	this.msgCount = 0;
	haxe.Log.trace("create FlashMessagingFramework",{ fileName : "ApplicationController.hx", lineNumber : 107, className : "com.inq.flash.client.control.ApplicationController", methodName : "new"});
	this.framework = new com.inq.flash.messagingframework.FlashMessagingFramework(com.inq.flash.client.control.FlashVars.getFlashVars(),new com.inq.flash.client.control.ClientConnectionEventHandler(this));
	haxe.Log.trace("created FlashMessagingFramework",{ fileName : "ApplicationController.hx", lineNumber : 109, className : "com.inq.flash.client.control.ApplicationController", methodName : "new"});
	if(this.chat == null) {
		this.chat = new com.inq.flash.client.data.Chat(com.inq.flash.client.control.FlashVars.getFlashVars());
	}
	var handler = new com.inq.flash.client.control.messagehandlers.ChatCommunicationMessageHandler();
	this.registerHandler(handler);
	handler = new com.inq.flash.client.control.messagehandlers.ChatAcceptedMessageHandler();
	this.registerHandler(handler);
	handler = new com.inq.flash.client.control.messagehandlers.ChatNeedWaitMessageHandler();
	this.registerHandler(handler);
	handler = new com.inq.flash.client.control.messagehandlers.ChatroomMemberConnectedMessageHandler();
	this.registerHandler(handler);
	handler = new com.inq.flash.client.control.messagehandlers.ChatroomOwnerTransferResponseMessageHandler();
	this.registerHandler(handler);
	handler = new com.inq.flash.client.control.messagehandlers.ChatroomTransferResponse();
	this.registerHandler(handler);
	handler = new com.inq.flash.client.control.messagehandlers.ChatroomMemberLostMessageHandler();
	this.registerHandler(handler);
	handler = new com.inq.flash.client.control.messagehandlers.ChatExitMessageHandler();
	this.registerHandler(handler);
	handler = new com.inq.flash.client.control.messagehandlers.ChatDeniedMessageHandler();
	this.registerHandler(handler);
	handler = new com.inq.flash.client.control.messagehandlers.ChatAuthorizedMessageHandler();
	this.registerHandler(handler);
	handler = new com.inq.flash.client.control.messagehandlers.ClientCommandMessageHandler();
	this.registerHandler(handler);
	handler = new com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestMessageHandler();
	this.registerHandler(handler);
	handler = new com.inq.flash.client.control.messagehandlers.ErrorHandler();
	this.registerHandler(handler);
	handler = new com.inq.flash.client.control.messagehandlers.ChatSystemMessageHandler();
	this.registerHandler(handler);
	this.registerHandler(new com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler());
	this.registerHandler(new com.inq.flash.client.control.messagehandlers.NeedWaitHandler());
	this.registerHandler(new com.inq.flash.client.control.messagehandlers.ContinueTransitionHandler());
	this.registerHandler(new com.inq.flash.client.control.messagehandlers.TypingActivityHandler());
	this.registerHandler(new com.inq.flash.client.control.messagehandlers.PersistentActiveHandler());
	this.registerHandler(new com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler());
}}
com.inq.flash.client.control.ApplicationController.__name__ = ["com","inq","flash","client","control","ApplicationController"];
com.inq.flash.client.control.ApplicationController.prototype.TypingActivity = function(bTyping) {
	if(this.firstMessageSent) {
		var txtInput = Application.application.txtInput;
		var text = txtInput._getInput();
		var message = ((bTyping)?new com.inq.flash.client.data.ChatActivityMessage(this.chat,com.inq.flash.client.data.MessageFields.ACTIVITY_CUSTOMER_TYPING):new com.inq.flash.client.data.ChatActivityMessage(this.chat,com.inq.flash.client.data.MessageFields.ACTIVITY_CUSTOMER_STOPS_TYPING,text));
		this.sendMessageOrQueue(message);
	}
}
com.inq.flash.client.control.ApplicationController.prototype.acknowledgeChatActive = function() {
	this.framework.acknowledgeChatActive(this.chat.getChatID());
}
com.inq.flash.client.control.ApplicationController.prototype.acknowledgeChatPersistent = function(clientProtoDomain,messageCnt) {
	var b = com.inq.flash.client.control.FlashPeer.registerPersistentWindow();
	if(!b) {
		com.inq.flash.client.chatskins.SkinControl.noUnload();
	}
	var protoDomain = window.location.protocol + "//" + window.location.hostname;
	this.framework.acknowledgePersistentActive(this.chat.getChatID(),protoDomain,clientProtoDomain,!b,messageCnt);
}
com.inq.flash.client.control.ApplicationController.prototype.addClickStreamData = function(msg) {
	if(com.inq.flash.client.control.PersistenceManager.GetValue("s",0) == 0) this.bSendClickStreamData = true;
	if(!this.bSendClickStreamData) return;
	if(com.inq.flash.client.data.MessageFields.TYPE_CHAT_COMMUNICATION != msg.getMessageType() && com.inq.flash.client.data.MessageFields.TYPE_CHAT_COMMUNICATION_OPENER != msg.getMessageType() && com.inq.flash.client.data.MessageFields.TYPE_CHAT_COMMUNICATION_QUEUE != msg.getMessageType() && com.inq.flash.client.data.MessageFields.TYPE_CHAT_AUTOMATON_RESPONSE != msg.getMessageType() && com.inq.flash.client.data.MessageFields.TYPE_CHAT_COMMUNICATION_OUTCOME != msg.getMessageType()) {
		return;
	}
	var isPersistent = com.inq.flash.client.chatskins.SkinControl.getIsPersistentChat();
	var initialClickstreamData = com.inq.flash.client.chatskins.SkinControl.getInitialClickstreamData();
	if(isPersistent) {
		try {
			initialClickstreamData += com.inq.flash.client.chatskins.SkinControl.getOpener().Application.application.applicationController.callStreamData;
		}
		catch( $e144 ) {
			{
				var err = $e144;
				{
					haxe.Log.trace("ApplicationController.addClickstreamData Error" + err,{ fileName : "ApplicationController.hx", lineNumber : 443, className : "com.inq.flash.client.control.ApplicationController", methodName : "addClickStreamData"});
				}
			}
		}
	}
	haxe.Log.trace("ApplicationController.addClickstreamData: clickStreamData = " + initialClickstreamData,{ fileName : "ApplicationController.hx", lineNumber : 446, className : "com.inq.flash.client.control.ApplicationController", methodName : "addClickStreamData"});
	this.bSendClickStreamData = false;
	var fieldDictionary = new com.inq.utils.Dictionary();
	if(initialClickstreamData == null) {
		return;
	}
	var csFields = initialClickstreamData.split("^^");
	haxe.Log.trace("",{ fileName : "ApplicationController.hx", lineNumber : 457, className : "com.inq.flash.client.control.ApplicationController", methodName : "addClickStreamData"});
	{
		var _g1 = 0, _g = csFields.length;
		while(_g1 < _g) {
			var i = _g1++;
			var fieldItem = csFields[i];
			if(fieldItem == "") continue;
			var field = fieldItem.split("=");
			var fieldname = field.shift();
			var value = field.join("=");
			fieldDictionary[fieldname] = value;
		}
	}
	haxe.Log.trace("",{ fileName : "ApplicationController.hx", lineNumber : 472, className : "com.inq.flash.client.control.ApplicationController", methodName : "addClickStreamData"});
	var fieldID = 0;
	var ixx;
	{
		var _g1 = 0, _g = csFields.length;
		while(_g1 < _g) {
			var ixx1 = _g1++;
			var csField = csFields[ixx1];
			if("" == csField) continue;
			haxe.Log.trace("field is " + csField,{ fileName : "ApplicationController.hx", lineNumber : 481, className : "com.inq.flash.client.control.ApplicationController", methodName : "addClickStreamData"});
			var name = csField.split("=").shift();
			if(name == null) continue;
			if(name.charAt(0) != "_") {
				var data = fieldDictionary[name];
				var label = (fieldDictionary["_" + name]);
				var tmout = com.inq.flash.client.control.FlashPeer.getV3TimeOut();
				if(!com.inq.flash.client.chatskins.SkinControl.isClick2call()) {
					msg.addProperty(com.inq.flash.client.data.MessageFields.KEY_HTTP_TIMEOUT,"" + tmout);
				}
				this.addInitialData(msg,name,data,label);
				fieldID++;
			}
		}
	}
	com.inq.flash.client.control.PersistenceManager.SetValue("s",1);
}
com.inq.flash.client.control.ApplicationController.prototype.addInitialData = function(msg,name,data,label) {
	var prefix = com.inq.flash.client.data.MessageFields.KEY_INITIAL_CLICKSTREAM_PREFIX + msg.nextInitialDataIndex();
	msg.addProperty(prefix + ".id",name);
	msg.addProperty(prefix + ".data",com.inq.flash.messagingframework.StringUtils.encodeStringForMessage(data));
	if(label != null && label != "" && label != "undefined") {
		msg.addProperty(prefix + ".label",label);
	}
}
com.inq.flash.client.control.ApplicationController.prototype.agentID = null;
com.inq.flash.client.control.ApplicationController.prototype.appendReceivedText = function(text,sender,position) {
	var clientName = com.inq.flash.client.control.FlashVars.getFlashVars().userName;
	if(!com.inq.flash.client.control.XFrameWorker.isDisplayInCI(text)) {
		haxe.Log.trace("Text filtered... \"" + text + "\"",{ fileName : "ApplicationController.hx", lineNumber : 161, className : "com.inq.flash.client.control.ApplicationController", methodName : "appendReceivedText"});
		return;
	}
	if(clientName == sender) com.inq.flash.client.chatskins.SkinControl.AddTranscriptItemToChatWindow(sender,text,com.inq.flash.client.chatskins.ChatTextArea.CUSTOMER,position);
	else if(sender == "") {
		com.inq.flash.client.chatskins.SkinControl.AddTranscriptItemToChatWindow(sender,text,com.inq.flash.client.chatskins.ChatTextArea.SYSTEM_STATUS,position);
	}
	else {
		com.inq.flash.client.chatskins.SkinControl.AddTranscriptItemToChatWindow(sender,text,com.inq.flash.client.chatskins.ChatTextArea.AGENT,position);
	}
	++this.msgCount;
}
com.inq.flash.client.control.ApplicationController.prototype.appendSentText = function(text,position) {
	return com.inq.flash.client.chatskins.SkinControl.AddCustomerTextToChatWindow(text,position);
}
com.inq.flash.client.control.ApplicationController.prototype.attemptingConnection = null;
com.inq.flash.client.control.ApplicationController.prototype.authorizedOnce = null;
com.inq.flash.client.control.ApplicationController.prototype.bSendClickStreamData = null;
com.inq.flash.client.control.ApplicationController.prototype.builtApplicationParameters = null;
com.inq.flash.client.control.ApplicationController.prototype.callButtonClicked = function() {
	var txtInput = Application.application.txtInput;
	var text = txtInput._getInput();
	this.callStreamData = com.inq.flash.client.chatskins.SkinControl.getCallStreamData() + com.inq.flash.client.chatskins.SkinControl.getCallFormData();
	var message = new com.inq.flash.client.data.CallCommunicationMessage(this.chat,text);
	message.addProperty(com.inq.flash.client.data.MessageFields.KEY_USERNAME,com.inq.flash.client.chatskins.SkinControl.getCallerNameString());
	message.addProperty(com.inq.flash.client.data.MessageFields.KEY_LINE_NR,"-2");
	message.addProperty("fromV3",com.inq.flash.client.chatskins.SkinControl.getCallerNameString());
	com.inq.flash.client.control.PersistenceManager.SetValue("cn",com.inq.flash.client.chatskins.SkinControl.getCallerNameString());
	this.queueMessages = true;
	this.sendMessageOrQueue(message);
	this.chatRouterListen = false;
	var success = com.inq.flash.client.control.FlashPeer.popOutChat(true,false);
	if(success) {
		var chatCanvas = Application.application.callForm;
		chatCanvas.setVisible(false);
	}
}
com.inq.flash.client.control.ApplicationController.prototype.callStreamData = null;
com.inq.flash.client.control.ApplicationController.prototype.changeState = function(stateName) {
	haxe.Log.trace("enter",{ fileName : "ApplicationController.hx", lineNumber : 722, className : "com.inq.flash.client.control.ApplicationController", methodName : "changeState"});
	var oldStateName = Application.application["currentState"];
	haxe.Log.trace("oldStateName=" + oldStateName,{ fileName : "ApplicationController.hx", lineNumber : 724, className : "com.inq.flash.client.control.ApplicationController", methodName : "changeState"});
	Application.application["currentState"] = stateName;
	haxe.Log.trace("exit: stateName=" + stateName,{ fileName : "ApplicationController.hx", lineNumber : 726, className : "com.inq.flash.client.control.ApplicationController", methodName : "changeState"});
}
com.inq.flash.client.control.ApplicationController.prototype.chat = null;
com.inq.flash.client.control.ApplicationController.prototype.chatAccepted = null;
com.inq.flash.client.control.ApplicationController.prototype.chatRouterListen = null;
com.inq.flash.client.control.ApplicationController.prototype.checkForChatExit = function() {
	if(this.waitingToExitChat) this.customerClosesPopup();
}
com.inq.flash.client.control.ApplicationController.prototype.connectionEstablished = function() {
	try {
		var connectionType = this.framework.getConnectionType();
		com.inq.flash.client.chatskins.SkinControl.connectionType = connectionType;
		Application.application.txtInput.enabled = true;
		this.wasConnected = true;
		var isPersistent = com.inq.flash.client.chatskins.SkinControl.getIsPersistentChat();
		var initialClickstreamData = com.inq.flash.client.chatskins.SkinControl.getInitialClickstreamData();
		try {
			if(isPersistent && com.inq.flash.client.chatskins.SkinControl.isClick2call()) initialClickstreamData += com.inq.flash.client.chatskins.SkinControl.getOpener().Application.application.applicationController.callStreamData;
		}
		catch( $e145 ) {
			{
				var err = $e145;
				{
					haxe.Log.trace("Exception: " + err,{ fileName : "ApplicationController.hx", lineNumber : 368, className : "com.inq.flash.client.control.ApplicationController", methodName : "connectionEstablished"});
				}
			}
		}
		if(isPersistent) {
			if(this.notifiedAsPersistent) isPersistent = false;
			else this.notifiedAsPersistent = true;
		}
		haxe.Log.trace("ApplicationController.connectionEstablished, sending a chat request message",{ fileName : "ApplicationController.hx", lineNumber : 377, className : "com.inq.flash.client.control.ApplicationController", methodName : "connectionEstablished"});
		var message = null;
		try {
			haxe.Log.trace("ApplicationController: creating msg. chat=" + this.chat.toString(),{ fileName : "ApplicationController.hx", lineNumber : 380, className : "com.inq.flash.client.control.ApplicationController", methodName : "connectionEstablished"});
			haxe.Log.trace("ApplicationController: creating msg. isPersistent=" + isPersistent + ", agentID=" + this.agentID,{ fileName : "ApplicationController.hx", lineNumber : 381, className : "com.inq.flash.client.control.ApplicationController", methodName : "connectionEstablished"});
			var deltaTime = (this.sendButtonClickedTime != null?Math.round(Date.now().getTime()) - this.sendButtonClickedTime:0);
			message = new com.inq.flash.client.data.ChatRequestMessage(this.chat,isPersistent,this.agentID,deltaTime);
			if(com.inq.flash.client.chatskins.SkinControl.isClick2call()) {
				message.addProperty(com.inq.flash.client.data.MessageFields.KEY_CALL_ENABLED,"true");
				message.addProperty(com.inq.flash.client.data.MessageFields.KEY_USERNAME,com.inq.flash.client.control.PersistenceManager.GetValue("cn",com.inq.flash.client.chatskins.SkinControl.getCallerNameString()));
			}
			if(com.inq.flash.client.control.FlashPeer.isRefreshRequired() == true) {
				message.addProperty(com.inq.flash.client.data.MessageFields.KEY_PERSISTENT_WINDOW_REFRESHED,"true");
				com.inq.flash.client.control.FlashPeer.resetRefreshFlag();
			}
			haxe.Log.trace("ApplicationController: msg sent. msg=" + message.serialize(),{ fileName : "ApplicationController.hx", lineNumber : 394, className : "com.inq.flash.client.control.ApplicationController", methodName : "connectionEstablished"});
		}
		catch( $e146 ) {
			{
				var err = $e146;
				{
					haxe.Log.trace("Exception: " + err,{ fileName : "ApplicationController.hx", lineNumber : 396, className : "com.inq.flash.client.control.ApplicationController", methodName : "connectionEstablished", customParams : ["error"]});
				}
			}
		}
		haxe.Log.trace("framework.sendMessage(message):" + message.serialize(),{ fileName : "ApplicationController.hx", lineNumber : 399, className : "com.inq.flash.client.control.ApplicationController", methodName : "connectionEstablished"});
		if(!com.inq.flash.client.chatskins.SkinControl.isContinued() || isPersistent || com.inq.flash.client.control.PersistenceManager.GetValue("msgcnt",0) == 0) this.sendMessage(message);
		haxe.Log.trace("framework.sendMessage(chat.request) sent",{ fileName : "ApplicationController.hx", lineNumber : 402, className : "com.inq.flash.client.control.ApplicationController", methodName : "connectionEstablished"});
		if(this.persistentReconnect) {
			this.playQueueMessages();
			this.queueMessages = false;
		}
	}
	catch( $e147 ) {
		{
			var e = $e147;
			{
				haxe.Log.trace("Exception: " + e,{ fileName : "ApplicationController.hx", lineNumber : 408, className : "com.inq.flash.client.control.ApplicationController", methodName : "connectionEstablished"});
			}
		}
	}
	haxe.Log.trace("exit connectionEstablished",{ fileName : "ApplicationController.hx", lineNumber : 410, className : "com.inq.flash.client.control.ApplicationController", methodName : "connectionEstablished"});
}
com.inq.flash.client.control.ApplicationController.prototype.connectionLost = function() {
	haxe.Log.trace("connectionLost();",{ fileName : "ApplicationController.hx", lineNumber : 561, className : "com.inq.flash.client.control.ApplicationController", methodName : "connectionLost"});
	this.queueMessages = true;
}
com.inq.flash.client.control.ApplicationController.prototype.customerClosesPopup = function() {
	var msg;
	var cid;
	this.waitingToExitChat = true;
	try {
		if(!this.framework.isConnected() && !this.wasConnected && com.inq.flash.client.control.PersistenceManager.GetValue("msgcnt",0) == 0) return false;
		if(!this.authorizedOnce && com.inq.flash.client.chatskins.SkinControl.msgcntAtEntry == 0) {
			this.shutdownQuietly();
			return false;
		}
		if(this.framework.isConnected() == false) return false;
		if(null == this.chat) return false;
		cid = this.chat.getChatID();
		msg = new com.inq.flash.client.data.ChatExitMessage(cid);
		var cTY = Application.application.thankYou;
		if(cTY != null && cTY.getVisible() == true) {
			return false;
		}
		if(null != msg) {
			this.sendMessage(msg);
			return true;
		}
	}
	catch( $e148 ) {
		if( js.Boot.__instanceof($e148,Error) ) {
			var e = $e148;
			{
				haxe.Log.trace("customerClosesPopup: Warning:" + e,{ fileName : "ApplicationController.hx", lineNumber : 888, className : "com.inq.flash.client.control.ApplicationController", methodName : "customerClosesPopup"});
			}
		} else throw($e148);
	}
	return false;
}
com.inq.flash.client.control.ApplicationController.prototype.disable = function() {
	this.framework.disable();
	var msg = new com.inq.flash.client.data.NullMessage(this.chat.getChatID());
	this.sendBrowserMessage(msg);
}
com.inq.flash.client.control.ApplicationController.prototype.enable = function() {
	this.framework.enable();
	var msg = new com.inq.flash.client.data.NullMessage(this.chat.getChatID());
	this.sendBrowserMessage(msg);
}
com.inq.flash.client.control.ApplicationController.prototype.engageChat = function(agentOutcome,clientOutcome,agentAttrs,businessUnitID,phone) {
	if(!this.attemptingConnection && !this.intentionalDisconnect && (this.chatRouterListen || (!this.framework.isConnected() && !this.wasConnected))) {
		this.sendButtonClickedTime = Math.round(Date.now().getTime());
		com.inq.flash.client.chatskins.SkinControl.onChatEngaged();
		var message = new com.inq.flash.client.data.ChatEngageMessage(this.chat,agentOutcome,clientOutcome,this.getAgentAlias());
		if(agentAttrs != "") {
			this.chat.setAgentAttributes(agentAttrs);
		}
		if(businessUnitID != "") {
			this.chat.setChannelID(businessUnitID);
		}
		if(phone != "") {
			this.addInitialData(message,"CallerPhone",phone,"CallerPhone");
		}
		this.sendChatCommunicationMessage(message,-1);
	}
}
com.inq.flash.client.control.ApplicationController.prototype.enqueueOpenerText = function(text,alias) {
	var now = Date.now().getTime();
	this.openerMessageQueue.push({ clientTime : now, data : text, agentAlias : alias});
}
com.inq.flash.client.control.ApplicationController.prototype.firstMessageSent = null;
com.inq.flash.client.control.ApplicationController.prototype.framework = null;
com.inq.flash.client.control.ApplicationController.prototype.getAgentAlias = function() {
	var agentName = com.inq.flash.client.control.FlashVars.getFlashVars().agentName;
	var useAgentAlias = (Application.application.skinConfig["useAgentAlias"]?Application.application.skinConfig["useAgentAlias"]:false);
	if(useAgentAlias == true) {
		var defaultAgentAlias = (Application.application.skinConfig["defaultAgentAlias"]?((Application.application.skinConfig["defaultAgentAlias"] == ""?"&nbsp;":Application.application.skinConfig["defaultAgentAlias"])):"&nbsp;");
		agentName = defaultAgentAlias;
	}
	return agentName;
}
com.inq.flash.client.control.ApplicationController.prototype.initializeAutomatonMode = function() {
	if(this.isAutomatonMode() && !this.framework.isConnected() && !com.inq.flash.client.chatskins.SkinControl.isContinued()) {
		haxe.Log.trace("initializing Inline DT automaton",{ fileName : "ApplicationController.hx", lineNumber : 523, className : "com.inq.flash.client.control.ApplicationController", methodName : "initializeAutomatonMode"});
		this.sendButtonClickedTime = Math.round(Date.now().getTime());
		this.framework.connect();
		com.inq.flash.client.chatskins.SkinControl.StopTimer();
	}
}
com.inq.flash.client.control.ApplicationController.prototype.intentionalDisconnect = null;
com.inq.flash.client.control.ApplicationController.prototype.isAutomatonMode = function() {
	return this.chat.getAutomatonId() != null;
}
com.inq.flash.client.control.ApplicationController.prototype.isConnected = function() {
	if(this.framework == null) return false;
	return this.framework.isConnected();
}
com.inq.flash.client.control.ApplicationController.prototype.isConnectionAccepted = function() {
	return this.chatAccepted;
}
com.inq.flash.client.control.ApplicationController.prototype.isFirstMessageSent = function() {
	return this.firstMessageSent;
}
com.inq.flash.client.control.ApplicationController.prototype.localChatRouterListen = function() {
	try {
		if(this.framework.isConnected()) return;
		this.attemptingConnection = true;
		this.queueMessages = true;
		var count = com.inq.flash.client.control.PersistenceManager.GetValue("msgcnt",0);
		this.framework.setParam("count",count);
		this.framework.connect();
		this.chatRouterListen = true;
	}
	catch( $e149 ) {
		if( js.Boot.__instanceof($e149,Error) ) {
			var e = $e149;
			{
				haxe.Log.trace("Error: " + e,{ fileName : "ApplicationController.hx", lineNumber : 605, className : "com.inq.flash.client.control.ApplicationController", methodName : "localChatRouterListen", customParams : ["error"]});
			}
		} else throw($e149);
	}
}
com.inq.flash.client.control.ApplicationController.prototype.messageQueue = null;
com.inq.flash.client.control.ApplicationController.prototype.msgCount = null;
com.inq.flash.client.control.ApplicationController.prototype.notifiedAsPersistent = null;
com.inq.flash.client.control.ApplicationController.prototype.openerMessageQueue = null;
com.inq.flash.client.control.ApplicationController.prototype.outgoingMessageTracker = null;
com.inq.flash.client.control.ApplicationController.prototype.persistentFrameReconnect = function() {
	try {
		if(!this.attemptingConnection) {
			this.attemptingConnection = true;
			this.queueMessages = true;
			var count = com.inq.flash.client.control.PersistenceManager.GetValue("msgcnt",0);
			this.framework.setParam("count",count);
			this.persistentReconnect = true;
			this.chatRouterListen = false;
			this.framework.connect();
		}
	}
	catch( $e150 ) {
		if( js.Boot.__instanceof($e150,Error) ) {
			var e = $e150;
			{
				haxe.Log.trace("Error: " + e,{ fileName : "ApplicationController.hx", lineNumber : 584, className : "com.inq.flash.client.control.ApplicationController", methodName : "persistentFrameReconnect"});
			}
		} else throw($e150);
	}
}
com.inq.flash.client.control.ApplicationController.prototype.persistentReconnect = null;
com.inq.flash.client.control.ApplicationController.prototype.playQueueMessages = function() {
	var i;
	{
		var _g1 = 0, _g = this.messageQueue.length;
		while(_g1 < _g) {
			var i1 = _g1++;
			var msgItem = this.messageQueue[i1];
			var msgTime = msgItem.clientTime;
			var deltaTime = Math.round(Date.now().getTime() - msgTime);
			var msg = function($this) {
				var $r;
				var tmp = msgItem.msg;
				$r = (Std["is"](tmp,com.inq.flash.messagingframework.Message)?tmp:function($this) {
					var $r;
					throw "Class cast error";
					return $r;
				}($this));
				return $r;
			}(this);
			msg.addProperty(com.inq.flash.client.data.MessageFields.KEY_TIME_DELTA,"" + deltaTime);
			this.framework.sendMessage(msg);
		}
	}
}
com.inq.flash.client.control.ApplicationController.prototype.processClickToCallQueueMessages = function() {
	var opener = com.inq.flash.client.chatskins.SkinControl.getOpener();
	this.openerMessageQueue = opener.Application.application.applicationController.openerMessageQueue;
	var messageQueue = opener.Application.application.applicationController.messageQueue;
	var message = null;
	if(messageQueue.length > 0) {
		message = messageQueue[messageQueue.length - 1].msg;
	}
	if(!this.attemptingConnection && !this.intentionalDisconnect && !this.framework.isConnected() && !this.wasConnected) {
		try {
			this.attemptingConnection = true;
			this.queueMessages = true;
			this.sendText(message);
			this.framework.connect();
		}
		catch( $e151 ) {
			{
				var e = $e151;
				null;
			}
		}
	}
	else {
		this.sendText(message);
	}
	com.inq.flash.client.chatskins.SkinControl.AddTranscriptItemToChatWindow(message.getProperty(com.inq.flash.client.data.MessageFields.KEY_USERNAME),com.inq.flash.messagingframework.StringUtils.htmlDecode(message.getProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_DATA)),com.inq.flash.client.chatskins.ChatTextArea.CUSTOMER,-1);
}
com.inq.flash.client.control.ApplicationController.prototype.queueMessages = null;
com.inq.flash.client.control.ApplicationController.prototype.registerHandler = function(handler) {
	this.framework.registerMessageHandler(handler);
	handler.setController(this);
}
com.inq.flash.client.control.ApplicationController.prototype.requestTransitionToPersistent = function() {
	var msg = new com.inq.flash.messagingframework.Message();
	msg.setMessageType(com.inq.flash.client.data.MessageFields.TYPE_MEMBER_TRANSITIONING);
	msg.addProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_ID,this.chat.getChatID());
	msg.addProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_DATA,com.inq.flash.client.data.MessageFields.KEY_CHAT_DATA);
	msg.addProperty(com.inq.flash.client.data.MessageFields.KEY_CONFIG_ID,this.chat.getConfigID());
	msg.addProperty(com.inq.flash.client.data.MessageFields.KEY_REASON,com.inq.flash.client.data.MessageFields.REASON_PERSISTENT);
	this.sendMessage(msg);
	haxe.Log.trace("ApplicationController.requestTransitionToPersistent:\n" + msg.serialize(),{ fileName : "ApplicationController.hx", lineNumber : 837, className : "com.inq.flash.client.control.ApplicationController", methodName : "requestTransitionToPersistent"});
}
com.inq.flash.client.control.ApplicationController.prototype.sendBrowserMessage = function(msg) {
	this.framework.sendBrowserMessage(msg);
}
com.inq.flash.client.control.ApplicationController.prototype.sendButtonClicked = function() {
	haxe.Log.trace("enter",{ fileName : "ApplicationController.hx", lineNumber : 634, className : "com.inq.flash.client.control.ApplicationController", methodName : "sendButtonClicked"});
	var txtInput = Application.application.txtInput;
	var text = txtInput._getInput();
	if(text == null || text == "") {
		haxe.Log.trace("no text",{ fileName : "ApplicationController.hx", lineNumber : 640, className : "com.inq.flash.client.control.ApplicationController", methodName : "sendButtonClicked"});
		return;
	}
	haxe.Log.trace("Check connections",{ fileName : "ApplicationController.hx", lineNumber : 644, className : "com.inq.flash.client.control.ApplicationController", methodName : "sendButtonClicked"});
	haxe.Log.trace("attemptingConnection=" + this.attemptingConnection + "\n" + "intentionalDisconnect=" + this.intentionalDisconnect + "\n",{ fileName : "ApplicationController.hx", lineNumber : 645, className : "com.inq.flash.client.control.ApplicationController", methodName : "sendButtonClicked"});
	var loc = this.appendSentText(text,-1);
	txtInput._setInput("");
	var message = new com.inq.flash.client.data.ChatCommunicationMessage(this.chat,text);
	this.sendChatCommunicationMessage(message,loc);
}
com.inq.flash.client.control.ApplicationController.prototype.sendButtonClickedTime = null;
com.inq.flash.client.control.ApplicationController.prototype.sendChatCommunicationMessage = function(message,loc) {
	message.addProperty(com.inq.flash.client.data.MessageFields.KEY_USERNAME,com.inq.flash.client.control.FlashVars.getFlashVars().userName);
	message.addProperty(com.inq.flash.client.data.MessageFields.KEY_LINE_NR,"" + loc);
	message.addProperty("fromV3",com.inq.flash.client.control.FlashVars.getFlashVars().userName);
	if(!this.attemptingConnection && !this.intentionalDisconnect && !this.framework.isConnected() && !this.wasConnected) {
		this.sendButtonClickedTime = Math.round(Date.now().getTime());
		try {
			haxe.Log.trace("attemptingConnection",{ fileName : "ApplicationController.hx", lineNumber : 704, className : "com.inq.flash.client.control.ApplicationController", methodName : "sendChatCommunicationMessage"});
			this.attemptingConnection = true;
			haxe.Log.trace("queueMessages",{ fileName : "ApplicationController.hx", lineNumber : 706, className : "com.inq.flash.client.control.ApplicationController", methodName : "sendChatCommunicationMessage"});
			this.queueMessages = true;
			haxe.Log.trace("do a send text",{ fileName : "ApplicationController.hx", lineNumber : 708, className : "com.inq.flash.client.control.ApplicationController", methodName : "sendChatCommunicationMessage"});
			this.sendText(message);
			haxe.Log.trace("framework.connect()",{ fileName : "ApplicationController.hx", lineNumber : 710, className : "com.inq.flash.client.control.ApplicationController", methodName : "sendChatCommunicationMessage"});
			this.framework.connect();
		}
		catch( $e152 ) {
			if( js.Boot.__instanceof($e152,Error) ) {
				var e = $e152;
				{
					haxe.Log.trace("ERROR: " + e,{ fileName : "ApplicationController.hx", lineNumber : 713, className : "com.inq.flash.client.control.ApplicationController", methodName : "sendChatCommunicationMessage"});
				}
			} else throw($e152);
		}
	}
	else {
		this.sendText(message);
	}
}
com.inq.flash.client.control.ApplicationController.prototype.sendCoBrowseMessage = function(messageString,eventType) {
	var message = new com.inq.flash.client.data.ChatCommunicationCobrowseMessage(this.chat,messageString);
	message.addProperty(com.inq.flash.client.data.MessageFields.KEY_COBROWSE_EVENT,eventType);
	message.addProperty(com.inq.flash.client.data.MessageFields.KEY_LINE_NR,"-1");
	this.sendText(message);
}
com.inq.flash.client.control.ApplicationController.prototype.sendDTEvent = function(eventName,data) {
	var msg = new com.inq.flash.client.data.ChatAutomatonResponseMessage(this.chat,eventName,data);
	var selectedLinkName = null;
	if(data.selectedLinkName) {
		selectedLinkName = data.selectedLinkName;
	}
	var checkboxNames = null;
	if(data.selectedCheckboxNames) {
		checkboxNames = data.selectedCheckboxNames;
	}
	com.inq.flash.client.chatskins.SkinControl.modifyDTFields(data.divId,selectedLinkName);
	this.sendMessageOrQueue(msg);
	com.inq.flash.client.chatskins.SkinControl.stopOpenerScript();
	com.inq.flash.client.control.Incrementality.onInteracted();
	com.inq.flash.client.control.Incrementality.onCustomerMsg();
}
com.inq.flash.client.control.ApplicationController.prototype.sendFirstQueuedMessage = function() {
	if(!this.queueMessages || this.messageQueue.length < 1) return;
	var msgItem = this.messageQueue.shift();
	var msg = msgItem.msg;
	var msgTime = msgItem.clientTime;
	var deltaTime = Math.round(Date.now().getTime() - msgTime);
	msg.addProperty(com.inq.flash.client.data.MessageFields.KEY_TIME_DELTA,"" + deltaTime);
	this.sendMessage(msg);
	if(com.inq.flash.client.data.MessageFields.TYPE_CHAT_COMMUNICATION == msg.getMessageType() || com.inq.flash.client.data.MessageFields.TYPE_CHAT_COMMUNICATION_QUEUE == msg.getMessageType()) this.outgoingMessageTracker.bumpConversationCount();
}
com.inq.flash.client.control.ApplicationController.prototype.sendInputState = function(itemName,attributeName,state,changeNow) {
	if(changeNow) com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler.setAttribute(itemName,attributeName,state);
	var msg = null;
	msg = new com.inq.flash.client.data.ChatAutomatonElementSetMessage(this.chat,itemName,attributeName,state);
	this.sendMessageOrQueue(msg);
	com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler.incrementOutstandingCount();
}
com.inq.flash.client.control.ApplicationController.prototype.sendMessage = function(msg) {
	this.addClickStreamData(msg);
	this.framework.sendMessage(msg);
	if(com.inq.flash.client.data.MessageFields.TYPE_CHAT_COMMUNICATION == msg.getMessageType()) {
		com.inq.flash.client.control.Incrementality.onCustomerMsg(msg.getProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_DATA));
	}
}
com.inq.flash.client.control.ApplicationController.prototype.sendMessageOrQueue = function(message,clientTime) {
	if(!this.queueMessages) {
		this.sendMessage(message);
		if(com.inq.flash.client.data.MessageFields.TYPE_CHAT_COMMUNICATION == message.getMessageType() || com.inq.flash.client.data.MessageFields.TYPE_CHAT_COMMUNICATION_QUEUE == message.getMessageType()) {
			this.outgoingMessageTracker.bumpConversationCount();
		}
	}
	else {
		var now = ((clientTime == null)?Date.now().getTime():clientTime);
		this.messageQueue.push({ clientTime : now, msg : message});
	}
}
com.inq.flash.client.control.ApplicationController.prototype.sendMinimizedMessage = function() {
	if(com.inq.flash.client.control.PersistenceManager.GetValue("msgcnt",0) > 0) {
		var message = new com.inq.flash.client.data.ChatActivityMessage(this.chat,com.inq.flash.client.data.MessageFields.ACTIVITY_CUSTOMER_MINIMIZED);
		this.sendMessageOrQueue(message);
	}
}
com.inq.flash.client.control.ApplicationController.prototype.sendOpenerQueue = function() {
	while(this.openerMessageQueue.length > 0) {
		var openerItem = this.openerMessageQueue.shift();
		var openerText = openerItem.data;
		var message = new com.inq.flash.client.data.ChatCommunicationOpenerMessage(this.chat,openerText,openerItem.agentAlias);
		this.sendMessageOrQueue(message,openerItem.clientTime);
	}
}
com.inq.flash.client.control.ApplicationController.prototype.sendQueueingText = function(queueingText,position,agentAlias) {
	var message = new com.inq.flash.client.data.ChatCommunicationQueueMessage(this.chat,queueingText,agentAlias);
	message.addProperty(com.inq.flash.client.data.MessageFields.KEY_LINE_NR,"" + position);
	this.sendMessageOrQueue(message);
}
com.inq.flash.client.control.ApplicationController.prototype.sendRestoredMessage = function() {
	if(com.inq.flash.client.control.PersistenceManager.GetValue("msgcnt",0) > 0) {
		var message = new com.inq.flash.client.data.ChatActivityMessage(this.chat,com.inq.flash.client.data.MessageFields.ACTIVITY_CUSTOMER_RESTORED);
		this.sendMessageOrQueue(message);
	}
}
com.inq.flash.client.control.ApplicationController.prototype.sendText = function(message) {
	if(null == this.outgoingMessageTracker) this.outgoingMessageTracker = new com.inq.flash.client.chatskins.OutgoingMessageTracker(com.inq.flash.client.control.FlashVars.getFlashVars().getSaleQualMessageCountThreshold);
	if(!this.firstMessageSent) {
		this.sendOpenerQueue();
	}
	this.sendMessageOrQueue(message);
	this.chatRouterListen = false;
	this.firstMessageSent = true;
}
com.inq.flash.client.control.ApplicationController.prototype.setAgentID = function(agentID,eventData,coBrowseEnabled,buID) {
	if(coBrowseEnabled == null) coBrowseEnabled = false;
	haxe.Log.trace("ApplicationController.setAgentID('" + agentID + "')",{ fileName : "ApplicationController.hx", lineNumber : 555, className : "com.inq.flash.client.control.ApplicationController", methodName : "setAgentID"});
	this.agentID = agentID;
	com.inq.flash.client.chatskins.SkinControl.setAgentID(agentID,eventData,coBrowseEnabled,buID);
}
com.inq.flash.client.control.ApplicationController.prototype.setConnectionAccepted = function(b) {
	this.chatAccepted = b;
}
com.inq.flash.client.control.ApplicationController.prototype.setQueueMessages = function(doQ) {
	this.authorizedOnce = true;
	if(!doQ) this.attemptingConnection = false;
	if(this.queueMessages && !doQ) {
		this.queueMessages = false;
		{
			var _g1 = 0, _g = this.messageQueue.length;
			while(_g1 < _g) {
				var i = _g1++;
				var obj = this.messageQueue[i];
				if(obj != null) {
					var msgItem = this.messageQueue[i];
					var msg = msgItem.msg;
					var msgTime = msgItem.clientTime;
					var deltaTime = Math.round(Date.now().getTime() - msgTime);
					msg.addProperty(com.inq.flash.client.data.MessageFields.KEY_TIME_DELTA,"" + deltaTime);
					this.sendMessage(msg);
					if(com.inq.flash.client.data.MessageFields.TYPE_CHAT_COMMUNICATION == msg.getMessageType() || com.inq.flash.client.data.MessageFields.TYPE_CHAT_COMMUNICATION_QUEUE == msg.getMessageType()) this.outgoingMessageTracker.bumpConversationCount();
				}
			}
		}
		this.messageQueue = new Array();
	}
	this.queueMessages = doQ;
}
com.inq.flash.client.control.ApplicationController.prototype.setSocketIP = function(crAddress) {
	haxe.Log.trace("setSocketIP:207 crAddress=" + crAddress,{ fileName : "ApplicationController.hx", lineNumber : 816, className : "com.inq.flash.client.control.ApplicationController", methodName : "setSocketIP"});
	if(crAddress != null && crAddress != "") {
		haxe.Log.trace("setSocketIP:209 crAddress=" + crAddress,{ fileName : "ApplicationController.hx", lineNumber : 818, className : "com.inq.flash.client.control.ApplicationController", methodName : "setSocketIP"});
		haxe.Log.trace("setSocketIP:211 crAddress=" + crAddress,{ fileName : "ApplicationController.hx", lineNumber : 820, className : "com.inq.flash.client.control.ApplicationController", methodName : "setSocketIP"});
	}
	haxe.Log.trace("setSocketIP:213 crAddress=" + crAddress,{ fileName : "ApplicationController.hx", lineNumber : 822, className : "com.inq.flash.client.control.ApplicationController", methodName : "setSocketIP"});
	this.persistentFrameReconnect();
	haxe.Log.trace("setSocketIP:215 crAddress=" + crAddress,{ fileName : "ApplicationController.hx", lineNumber : 824, className : "com.inq.flash.client.control.ApplicationController", methodName : "setSocketIP"});
}
com.inq.flash.client.control.ApplicationController.prototype.shouldBeDisconnected = function() {
	return this.intentionalDisconnect;
}
com.inq.flash.client.control.ApplicationController.prototype.shutdown = function() {
	if(this.waitingToExitChat == true) {
		this.shutdownQuietly();
		return;
	}
	this.intentionalDisconnect = true;
	this.framework.disconnect();
	com.inq.flash.client.chatskins.SkinControl.agentClosesChat();
}
com.inq.flash.client.control.ApplicationController.prototype.shutdownQuietly = function() {
	this.intentionalDisconnect = true;
	this.framework.disconnect();
}
com.inq.flash.client.control.ApplicationController.prototype.submitForm = function(formName,formId,formString) {
	var displayMessage = ((Application.application.skinConfig["sFormSubmitted"] != null?Application.application.skinConfig["sFormSubmitted"]:"form submitted"));
	var message = new com.inq.flash.client.data.ChatCommunicationMessage(this.chat,displayMessage);
	message.addProperty(com.inq.flash.client.data.MessageFields.FORM_DATA,formString);
	message.addProperty(com.inq.flash.client.data.MessageFields.FORM_NAME,formName);
	message.addProperty(com.inq.flash.client.data.MessageFields.FORM_ID,formId);
	this.sendText(message);
}
com.inq.flash.client.control.ApplicationController.prototype.updateFormFields = function(formData,formName,formId) {
	com.inq.flash.client.chatskins.SkinControl.updateFormFields(formData,formName,formId);
}
com.inq.flash.client.control.ApplicationController.prototype.updateXFrameFromBizRule = function(layerID,url,channelID) {
	if(com.inq.flash.client.control.XFrameWorker.isLayerVisible(layerID)) {
		com.inq.flash.client.control.XFrameWorker.showLayer(layerID,null,url,channelID);
	}
}
com.inq.flash.client.control.ApplicationController.prototype.urlStringToObject = function(urlStr) {
	var retObj = new com.inq.utils.Dictionary();
	var strArr = StringTools.urlDecode(urlStr).split("&");
	{
		var _g1 = 0, _g = strArr.length;
		while(_g1 < _g) {
			var idx = _g1++;
			var item = strArr[idx];
			var nvPair = item.split("=");
			if(nvPair.length == 2) {
				var name = nvPair[0];
				var val = nvPair[1];
				retObj[name] = val;
			}
		}
	}
	return retObj;
}
com.inq.flash.client.control.ApplicationController.prototype.waitingToExitChat = null;
com.inq.flash.client.control.ApplicationController.prototype.wasConnected = null;
com.inq.flash.client.control.ApplicationController.prototype.__class__ = com.inq.flash.client.control.ApplicationController;
com.inq.flash.client.chatskins.PrintMgr = function(p) { if( p === $_ ) return; {
	null;
}}
com.inq.flash.client.chatskins.PrintMgr.__name__ = ["com","inq","flash","client","chatskins","PrintMgr"];
com.inq.flash.client.chatskins.PrintMgr.loaderSkin = null;
com.inq.flash.client.chatskins.PrintMgr._init = function() {
	var win = window;
	return true;
}
com.inq.flash.client.chatskins.PrintMgr.init = function() {
	if(com.inq.flash.client.chatskins.SkinControl.isInApplication("btnPrint")) {
		haxe.Log.trace("have the print button",{ fileName : "PrintMgr.hx", lineNumber : 41, className : "com.inq.flash.client.chatskins.PrintMgr", methodName : "init"});
		Application.application.btnPrint.addEventListener(com.inq.events.MouseEvent.CLICK,$closure(com.inq.flash.client.chatskins.PrintMgr,"actionBtnPrintTranscript"));
		Application.application.btnPrint.visible = true;
	}
	return true;
}
com.inq.flash.client.chatskins.PrintMgr.actionBtnPrintTranscript = function(me) {
	com.inq.flash.client.chatskins.PrintMgr.printWindow = window.open("","inqPrint","left=0,top=0,height=600,width=400,status=0,toolbar=0");
	var transcript = "<table>" + com.inq.flash.client.chatskins.SkinControl.cw.getHtmlText() + "</table>";
	var links = document.body.parentNode.getElementsByTagName("LINK");
	var linkUrl = links[0].href;
	if(null != com.inq.flash.client.chatskins.PrintMgr.printWindow) {
		com.inq.flash.client.chatskins.PrintMgr.printWindow.onload = function() {
			return true;
		}
		com.inq.flash.client.chatskins.PrintMgr.printWindow.document.open();
		com.inq.flash.client.chatskins.PrintMgr.printWindow.document.write("<html><head>" + "<link type=\"text/css\" rel=\"stylesheet\" media=\"print\" href=\"" + linkUrl + "\" />" + "<link type=\"text/css\" rel=\"stylesheet\" media=\"screen\" href=\"" + linkUrl + "\" />" + "</head></html>");
		com.inq.flash.client.chatskins.PrintMgr.printWindow.document.write("<body>" + transcript + "<script>\n setTimeout(\"window.print();window.close();\",1000);\n</script></body>");
		com.inq.flash.client.chatskins.PrintMgr.printWindow.document.close();
	}
}
com.inq.flash.client.chatskins.PrintMgr.prototype.__class__ = com.inq.flash.client.chatskins.PrintMgr;
com.inq.ui.Button = function(_id) { if( _id === $_ ) return; {
	com.inq.ui.Container.apply(this,[_id]);
	this._useHandCursor = false;
	if(this._div["initialInnerHTML"] == null) {
		this._div["initialInnerHTML"] = this._div.innerHTML;
	}
	this._div.innerHTML = "<img style=\"display:none;\"/>" + "<table style=\"position: absolute;left:0px;top:0px;height:100%;width:100%;margin-top: auto;margin-bottom: auto;margin-left: auto;margin-right: auto;\">" + "<tr><td>" + "<div></div>" + "</td/</tr>" + "</table>" + "<input type=\"image\" src=\"" + (Application.application["clearImage"]) + "\" style=\"position: absolute;left:0px;top:0px;width:100%;height:100%;background-color:transparent\" />" + "";
	this._skin = this._div.getElementsByTagName("img")[0];
	this._img = this._div.getElementsByTagName("input")[0];
	this._span = this._div.getElementsByTagName("td")[0];
	this._table = this._div.getElementsByTagName("table")[0];
	this._div.container = this;
	this._img.container = this;
	this._table.container = this;
	this._skin.container = this;
	this._span.container = this;
	this._img.onmouseover = $closure(this,"doMouseOver");
	this._img.onmouseout = $closure(this,"doMouseOut");
	this._img.onclick = $closure(this,"doClick");
	this._table.onclick = $closure(this,"doClick");
}}
com.inq.ui.Button.__name__ = ["com","inq","ui","Button"];
com.inq.ui.Button.__super__ = com.inq.ui.Container;
for(var k in com.inq.ui.Container.prototype ) com.inq.ui.Button.prototype[k] = com.inq.ui.Container.prototype[k];
com.inq.ui.Button.prototype._img = null;
com.inq.ui.Button.prototype._skin = null;
com.inq.ui.Button.prototype._span = null;
com.inq.ui.Button.prototype._table = null;
com.inq.ui.Button.prototype._useHandCursor = null;
com.inq.ui.Button.prototype.applyStyle = function() {
	com.inq.ui.Container.prototype.applyStyle.apply(this,[]);
	var fontstyles;
	if(this.styles.label != null) {
		this.setLabel(this.styles.label);
	}
	fontstyles = "background-color:transparent;width:100%;height:100%;";
	if(this.getStyle("color") != null) fontstyles += "color: " + this.getStyle("color") + ";";
	if(this.getStyle("fontFamily") != null) fontstyles += " font-family: " + this.getStyle("fontFamily") + ";";
	if(this.getStyle("fontSize") != null) fontstyles += " font-size: " + this.getStyle("fontSize") + "pt;";
	if(this.getStyle("textAlign") != null) fontstyles += "text-align:" + this.getStyle("textAlign") + ";";
	if(this.getStyle("verticalAlign") != null) fontstyles += "vertical-align:" + this.getStyle("verticalAlign") + ";";
	else fontstyles += "vertical-align:middle;";
	this._span.style.cssText = fontstyles;
}
com.inq.ui.Button.prototype.buildStyle = function() {
	com.inq.ui.Container.prototype.buildStyle.apply(this,[]);
	if(this.getStyle("useHandCursor") == "true") {
		this._style += "cursor: pointer;";
		this._span.style["cursor"] = "pointer";
		this._table.style["cursor"] = "pointer";
		this._img.style["cursor"] = "pointer";
	}
	var toolTip = this.styles["toolTip"];
	if(null != toolTip) {
		this._img.title = toolTip;
		this._table.title = toolTip;
	}
}
com.inq.ui.Button.prototype.doClick = function() {
	var action = this.eventListeners[com.inq.events.MouseEvent.CLICK];
	var ev = new com.inq.events.MouseEvent(com.inq.events.MouseEvent.CLICK);
	if(action != null) action(ev);
}
com.inq.ui.Button.prototype.doMouseOut = function() {
	var curskin = this._skin.src;
	if(this.upSkin != null && curskin != this.upSkin) {
		this._skin.src = this.upSkin;
		this._skin.style.height = this._div.style.height;
		this._skin.style.width = this._div.style.width;
	}
}
com.inq.ui.Button.prototype.doMouseOver = function() {
	var curskin = this._skin.src;
	if(this.overSkin != null && curskin != this.overSkin) {
		this._skin.src = this.overSkin;
		this._skin.style.height = this._div.style.height;
		this._skin.style.width = this._div.style.width;
	}
}
com.inq.ui.Button.prototype.label = null;
com.inq.ui.Button.prototype.loadImage = function(styleName,val,elementStyle) {
	haxe.Log.trace("Button.loadImage: src=" + val,{ fileName : "Button.hx", lineNumber : 196, className : "com.inq.ui.Button", methodName : "loadImage"});
	if(this._div != null) {
		if(val == null || val == "") return;
		this.setStyle(styleName,val);
		this._newim = this.getNewImage();
		this._newim["elementStyle"] = elementStyle;
		this._newim.onload = $closure(this,"whenLoaded");
		this._newim.src = val;
	}
}
com.inq.ui.Button.prototype.onLoadImage = function(element) {
	var __w, __h;
	try {
		var imageElement = element;
		var div = this._div;
		this._loadWidth = imageElement.width;
		this._loadHeight = imageElement.height;
		imageElement.style.height = this._loadHeight + "px";
		imageElement.style.width = this._loadWidth + "px";
		if((this.styles.height == null) && ((this.styles.top == null) || (this.styles.bottom == null))) this.styles.height = "" + this._loadHeight;
		if((this.styles.width == null) && ((this.styles.left == null) || (this.styles.right == null))) this.styles.width = "" + this._loadWidth;
		if((element.elementStyle) != null) element.style.cssText = element.elementStyle;
		if(div.firstChild != null && div.firstChild.tagName == "IMAGE") div.removeChild(div.firstChild);
		div.insertBefore(element,div.firstChild);
		this.resize();
	}
	catch( $e153 ) {
		if( js.Boot.__instanceof($e153,Error) ) {
			var e = $e153;
			{
				haxe.Log.trace("ERROR: " + e,{ fileName : "Button.hx", lineNumber : 190, className : "com.inq.ui.Button", methodName : "onLoadImage"});
			}
		} else throw($e153);
	}
}
com.inq.ui.Button.prototype.overSkin = null;
com.inq.ui.Button.prototype.setHandCursor = function(val) {
	var value = val;
	switch(value.toLowerCase()) {
	case "true":{
		this._useHandCursor = true;
	}break;
	case "false":{
		this._useHandCursor = false;
	}break;
	default:{
		this._useHandCursor = false;
	}break;
	}
	this.useHandCursor = ((this._useHandCursor)?"true":"false");
}
com.inq.ui.Button.prototype.setID = function(val) {
	com.inq.ui.Container.prototype.setID.apply(this,[val]);
	if(this._skin != null) this._skin.id = this._div.id + "_skin";
	if(this._img != null) this._img.id = this._div.id + "_img";
	if(this._span != null) this._span.id = this._div.id + "_span";
	if(this._table != null) this._table.id = this._div.id + "_table";
}
com.inq.ui.Button.prototype.setLabel = function(val) {
	this.label = val;
	this._span.innerHTML = val;
	var anchors = this._span.getElementsByTagName("A");
	var ix;
	if(anchors != null && anchors.length > 0) {
		if(this._div.parentNode != null) this._div.insertBefore(this._img,this._table);
		{
			var _g1 = 0, _g = anchors.length;
			while(_g1 < _g) {
				var ix1 = _g1++;
				var anchor = anchors[ix1];
				var href = [anchor["href"]];
				var target = [((anchor["target"] != null)?anchor.target:"_self")];
				anchor.href = "javascript:void(0);";
				anchor.target = "_top";
				anchor.container = this;
				anchor.onclick = function(target,href) {
					return function() {
						com.inq.flash.client.control.FlashPeer.PushToFrameset(href[0],target[0],true);
						return true;
					}
				}(target,href);
			}
		}
	}
}
com.inq.ui.Button.prototype.setUpSkin = function(val) {
	this.loadImage("upSkin",val,"width:100%;height:100%");
}
com.inq.ui.Button.prototype.upSkin = null;
com.inq.ui.Button.prototype.useHandCursor = null;
com.inq.ui.Button.prototype.__class__ = com.inq.ui.Button;
com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler = function(p) { if( p === $_ ) return; {
	com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.apply(this,[com.inq.flash.client.data.MessageFields.TYPE_CHAT_AUTOMATON_SETTING]);
	this.REPLACE_STRING = "_REPLACE_";
}}
com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler.__name__ = ["com","inq","flash","client","control","messagehandlers","ChatAutomatonRequestElementSettingHandler"];
com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler.__super__ = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler;
for(var k in com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype ) com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler.prototype[k] = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype[k];
com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler.setAttribute = function(elementID,attributeName,attributeValue) {
	var elements = window.document.getElementsByName(elementID);
	if(elements.length == 0) {
		haxe.Log.trace("element not found by name [" + elementID + "]",{ fileName : "ChatAutomatonRequestElementSettingHandler.hx", lineNumber : 72, className : "com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler", methodName : "setAttribute", customParams : ["error"]});
	}
	else {
		{
			var _g1 = 0, _g = elements.length;
			while(_g1 < _g) {
				var ix = _g1++;
				var el = elements[ix];
				if(el.name != elementID) continue;
				if(attributeName == "disabled" && el.tagName == "A") {
					el.setAttribute("STYLE",((attributeValue == "bold")?"color: #323232; font-weight: bold":"color: gray"));
					try {
						el.removeAttribute("onclick");
					}
					catch( $e154 ) {
						{
							var e = $e154;
							null;
						}
					}
					el.setAttribute("onclick","return false;");
					try {
						el.removeAttribute("HREF");
					}
					catch( $e155 ) {
						{
							var e = $e155;
							null;
						}
					}
					try {
						el.removeAttribute("href");
					}
					catch( $e156 ) {
						{
							var e = $e156;
							null;
						}
					}
				}
				else {
					if(attributeValue == "null") {
						try {
							el.removeAttribute(attributeName);
						}
						catch( $e157 ) {
							{
								var e = $e157;
								null;
							}
						}
					}
					else {
						el.setAttribute(attributeName,attributeValue);
					}
				}
				com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler.setAttributesInChatTextArea(el);
			}
		}
	}
}
com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler.incrementOutstandingCount = function() {
	com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler.outstanding++;
	haxe.Log.trace("incrementOutstandingCount: " + com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler.outstanding,{ fileName : "ChatAutomatonRequestElementSettingHandler.hx", lineNumber : 109, className : "com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler", methodName : "incrementOutstandingCount"});
}
com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler.decrementOutstandingCount = function() {
	--com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler.outstanding;
	haxe.Log.trace("decrementOutstandingCount: " + com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler.outstanding,{ fileName : "ChatAutomatonRequestElementSettingHandler.hx", lineNumber : 122, className : "com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler", methodName : "decrementOutstandingCount"});
	if(com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler.outstanding < 0) com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler.outstanding = 0;
}
com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler.getOutstandingCount = function() {
	return com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler.outstanding;
}
com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler.hasNoOutstandingMessages = function() {
	return com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler.getOutstandingCount() == 0;
}
com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler.setAttributesInChatTextArea = function(element) {
	com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler.setEngaged();
	var cw = com.inq.flash.client.chatskins.SkinControl.getChatWindow();
	var div = window.document.createElement("DIV");
	var lineno = 0;
	var dirty = false;
	var elementID = null;
	var spanID = null;
	var p = element.parentNode;
	while(p != null) {
		if(p.tagName == "SPAN") break;
		p = p.parentNode;
	}
	if(p != null) {
		elementID = p.id;
		try {
			while(true) {
				var html = null;
				try {
					html = cw.getTranscriptLine(lineno);
				}
				catch( $e158 ) {
					if( js.Boot.__instanceof($e158,Error) ) {
						var e = $e158;
						{
							html = null;
						}
					} else throw($e158);
				}
				if(html == null) break;
				div.innerHTML = html;
				var elements = div.getElementsByTagName("SPAN");
				if(elements.length > 0) {
					{
						var _g1 = 0, _g = elements.length;
						while(_g1 < _g) {
							var indx = _g1++;
							var el = elements[indx];
							if(el.id != elementID) continue;
							if(el.innerHTML == p.innerHTML) return;
							el.innerHTML = p.innerHTML;
							cw.replaceTranscriptLine(lineno,div.innerHTML);
							return;
						}
					}
				}
				++lineno;
			}
		}
		catch( $e159 ) {
			{
				var e = $e159;
				{
					haxe.Log.trace("Error: " + e + "\nLine number is " + lineno,{ fileName : "ChatAutomatonRequestElementSettingHandler.hx", lineNumber : 184, className : "com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler", methodName : "setAttributesInChatTextArea", customParams : ["error"]});
				}
			}
		}
	}
}
com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler.setEngaged = function() {
	if(com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler._engaged) return;
	com.inq.flash.client.control.Incrementality.onEngaged();
	com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler._engaged = true;
}
com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler.prototype.REPLACE_STRING = null;
com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler.prototype.chat = null;
com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler.prototype.processMessage = function(message) {
	com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler._engaged = true;
	if("1" != message.getProperty(com.inq.flash.client.data.MessageFields.KEY_REPLAY)) {
		com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler.decrementOutstandingCount();
		return;
	}
	var elementID = message.getProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_AUTOMATON_ID);
	var attributeName = message.getProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_AUTOMATON_TYPE);
	var attributeValue = message.getProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_AUTOMATON_STATE);
	com.inq.flash.client.chatskins.SkinControl.executeAfter(function() {
		return window.document.getElementsByName(elementID).length > 0;
	},function() {
		com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler.setAttribute(elementID,attributeName,attributeValue);
	},"ChatAutomatonRequestElementSettingHandler.setAttribute");
}
com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler.prototype.__class__ = com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler;
com.inq.flash.client.control.messagehandlers.TypingActivityHandler = function(p) { if( p === $_ ) return; {
	com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.apply(this,[com.inq.flash.client.data.MessageFields.TYPE_CHAT_ACTIVITY]);
	this.sAgentIsTyping = null;
	try {
		this.sAgentIsTyping = Application.application.skinConfig["sAgentIsTyping"];
	}
	catch( $e160 ) {
		if( js.Boot.__instanceof($e160,Error) ) {
			var e = $e160;
			{
				this.sAgentIsTyping = null;
			}
		} else throw($e160);
	}
	if(this.sAgentIsTyping == null || this.sAgentIsTyping == "") {
		this.sAgentIsTyping = "Agent is typing";
	}
}}
com.inq.flash.client.control.messagehandlers.TypingActivityHandler.__name__ = ["com","inq","flash","client","control","messagehandlers","TypingActivityHandler"];
com.inq.flash.client.control.messagehandlers.TypingActivityHandler.__super__ = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler;
for(var k in com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype ) com.inq.flash.client.control.messagehandlers.TypingActivityHandler.prototype[k] = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype[k];
com.inq.flash.client.control.messagehandlers.TypingActivityHandler.prototype.cntMessage = null;
com.inq.flash.client.control.messagehandlers.TypingActivityHandler.prototype.isEnabled = null;
com.inq.flash.client.control.messagehandlers.TypingActivityHandler.prototype.needwaitMessage = null;
com.inq.flash.client.control.messagehandlers.TypingActivityHandler.prototype.needwaitMessageFirst = null;
com.inq.flash.client.control.messagehandlers.TypingActivityHandler.prototype.needwaitPeriod = null;
com.inq.flash.client.control.messagehandlers.TypingActivityHandler.prototype.processMessage = function(message) {
	switch(message.getProperty(com.inq.flash.client.data.MessageFields.KEY_TYPE)) {
	case com.inq.flash.client.data.MessageFields.ACTIVITY_AGENT_TYPING:{
		var cw = com.inq.flash.client.chatskins.SkinControl.cw;
		if(null != cw) {
			cw.addTranscript("",this.sAgentIsTyping,com.inq.flash.client.chatskins.ChatTextArea.SYSTEM_STATUS,-1);
		}
	}break;
	case com.inq.flash.client.data.MessageFields.ACTIVITY_CUSTOMER_TYPING:{
		com.inq.flash.client.chatskins.SkinControl.userWasTyping = true;
	}break;
	case com.inq.flash.client.data.MessageFields.ACTIVITY_CUSTOMER_STOPS_TYPING:{
		com.inq.flash.client.chatskins.SkinControl.userWasTyping = false;
	}break;
	}
}
com.inq.flash.client.control.messagehandlers.TypingActivityHandler.prototype.sAgentIsTyping = null;
com.inq.flash.client.control.messagehandlers.TypingActivityHandler.prototype.__class__ = com.inq.flash.client.control.messagehandlers.TypingActivityHandler;
com.inq.flash.client.control.messagehandlers.ChatroomMemberLostMessageHandler = function(p) { if( p === $_ ) return; {
	com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.apply(this,[com.inq.flash.client.data.MessageFields.TYPE_CHATROOM_MEMBER_LOST]);
}}
com.inq.flash.client.control.messagehandlers.ChatroomMemberLostMessageHandler.__name__ = ["com","inq","flash","client","control","messagehandlers","ChatroomMemberLostMessageHandler"];
com.inq.flash.client.control.messagehandlers.ChatroomMemberLostMessageHandler.__super__ = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler;
for(var k in com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype ) com.inq.flash.client.control.messagehandlers.ChatroomMemberLostMessageHandler.prototype[k] = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype[k];
com.inq.flash.client.control.messagehandlers.ChatroomMemberLostMessageHandler.prototype.processMessage = function(message) {
	var textToDisplay = message.getProperty(com.inq.flash.client.data.MessageFields.KEY_CLIENT_DISPLAY_TEXT);
	if(textToDisplay != null) {
		var displayText = StringTools.trim(textToDisplay);
		var messageParts = displayText.split("&nl;");
		{
			var _g1 = 0, _g = messageParts.length;
			while(_g1 < _g) {
				var i = _g1++;
				com.inq.flash.client.chatskins.SkinControl.AddTranscriptItemToChatWindow("",messageParts[i],com.inq.flash.client.chatskins.ChatTextArea.SYSTEM,-1);
			}
		}
	}
}
com.inq.flash.client.control.messagehandlers.ChatroomMemberLostMessageHandler.prototype.__class__ = com.inq.flash.client.control.messagehandlers.ChatroomMemberLostMessageHandler;
com.inq.flash.client.control.messagehandlers.ChatAcceptedMessageHandler = function(p) { if( p === $_ ) return; {
	com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.apply(this,[com.inq.flash.client.data.MessageFields.TYPE_CHAT_ACCEPTED]);
}}
com.inq.flash.client.control.messagehandlers.ChatAcceptedMessageHandler.__name__ = ["com","inq","flash","client","control","messagehandlers","ChatAcceptedMessageHandler"];
com.inq.flash.client.control.messagehandlers.ChatAcceptedMessageHandler.__super__ = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler;
for(var k in com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype ) com.inq.flash.client.control.messagehandlers.ChatAcceptedMessageHandler.prototype[k] = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype[k];
com.inq.flash.client.control.messagehandlers.ChatAcceptedMessageHandler.prototype.processMessage = function(message) {
	var agentID = message.getProperty(com.inq.flash.client.data.MessageFields.KEY_AGENT_ID);
	if(agentID != null && agentID != "") {
		var cobrowseEnabled = com.inq.flash.messagingframework.StringUtils.getBooleanValue(message.getProperty(com.inq.flash.client.data.MessageFields.KEY_COBROWSE_ENABLED));
		this.getController().setAgentID(agentID,com.inq.utils.EventDataUtils.fromMessage(message),cobrowseEnabled,message.getProperty(com.inq.flash.client.data.MessageFields.KEY_BUSINESS_UNIT_ID));
	}
	this.getController().checkForChatExit();
	this.getController().setConnectionAccepted(true);
	com.inq.flash.client.chatskins.SkinControl.setSocketIP(message.getProperty(com.inq.flash.client.data.MessageFields.KEY_CHATROUTER_ADDRESS));
	var auxParams = { Agent : true}
	com.inq.flash.client.control.FlashPeer.setSurveyAuxParams(auxParams);
	com.inq.flash.client.chatskins.SkinControl.fireMxmlHandler("onChatAccepted");
}
com.inq.flash.client.control.messagehandlers.ChatAcceptedMessageHandler.prototype.__class__ = com.inq.flash.client.control.messagehandlers.ChatAcceptedMessageHandler;
com.inq.flash.client.data.ChatAutomatonElementSetMessage = function(chat,itemName,attributeName,state) { if( chat === $_ ) return; {
	com.inq.flash.messagingframework.Message.apply(this,[]);
	this.setMessageType(com.inq.flash.client.data.MessageFields.TYPE_CHAT_AUTOMATON_SETTING);
	this.addProperty(com.inq.flash.client.data.MessageFields.KEY_RETURN_RECEIPT,"1");
	this.addProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_ID,chat.getChatID());
	this.addProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_AUTOMATON_STATE,com.inq.flash.messagingframework.StringUtils.encodeStringForMessage(state));
	this.addProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_AUTOMATON_ID,com.inq.flash.messagingframework.StringUtils.encodeStringForMessage(itemName));
	this.addProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_AUTOMATON_TYPE,com.inq.flash.messagingframework.StringUtils.encodeStringForMessage(attributeName));
}}
com.inq.flash.client.data.ChatAutomatonElementSetMessage.__name__ = ["com","inq","flash","client","data","ChatAutomatonElementSetMessage"];
com.inq.flash.client.data.ChatAutomatonElementSetMessage.__super__ = com.inq.flash.messagingframework.Message;
for(var k in com.inq.flash.messagingframework.Message.prototype ) com.inq.flash.client.data.ChatAutomatonElementSetMessage.prototype[k] = com.inq.flash.messagingframework.Message.prototype[k];
com.inq.flash.client.data.ChatAutomatonElementSetMessage.prototype.__class__ = com.inq.flash.client.data.ChatAutomatonElementSetMessage;
com.inq.ui.IFrame = function(_id) { if( _id === $_ ) return; {
	com.inq.ui.Container.apply(this,[_id]);
	this.initStyle("id",_id);
	this._div.innerHTML = "<IFRAME width=\"100%\" height=\"100%\" scrolling=\"NO\" frameborder=\"0\"></IFRAME>";
	this._iframe = this._div.getElementsByTagName("IFRAME")[0];
	this.setScrolling("no");
}}
com.inq.ui.IFrame.__name__ = ["com","inq","ui","IFrame"];
com.inq.ui.IFrame.__super__ = com.inq.ui.Container;
for(var k in com.inq.ui.Container.prototype ) com.inq.ui.IFrame.prototype[k] = com.inq.ui.Container.prototype[k];
com.inq.ui.IFrame.prototype._anchor = null;
com.inq.ui.IFrame.prototype._iframe = null;
com.inq.ui.IFrame.prototype._img = null;
com.inq.ui.IFrame.prototype._useHandCursor = null;
com.inq.ui.IFrame.prototype.buildStyle = function() {
	com.inq.ui.Container.prototype.buildStyle.apply(this,[]);
	if(this._useHandCursor) this._style += "cursor: pointer;";
}
com.inq.ui.IFrame.prototype.label = null;
com.inq.ui.IFrame.prototype.resize = function() {
	this.applyStyle();
}
com.inq.ui.IFrame.prototype.setHandCursor = function(val) {
	var value = val;
	switch(value.toLowerCase()) {
	case "true":{
		this._useHandCursor = true;
	}break;
	case "false":{
		this._useHandCursor = false;
	}break;
	default:{
		this._useHandCursor = false;
	}break;
	}
	this.useHandCursor = ((this._useHandCursor)?"true":"false");
}
com.inq.ui.IFrame.prototype.setLabel = function(val) {
	this.label = val;
}
com.inq.ui.IFrame.prototype.setScrolling = function(val) {
	if(this._div != null) {
		this.scrolling = val;
		this._iframe.scrolling = val;
		this._iframe.setAttribute("scrolling",val);
	}
}
com.inq.ui.IFrame.prototype.setSrc = function(val) {
	if(this._div != null) {
		this.src = val;
		if(this.src == null || this.src == "") return;
		this._iframe.src = this.src;
	}
}
com.inq.ui.IFrame.prototype.src = null;
com.inq.ui.IFrame.prototype.useHandCursor = null;
com.inq.ui.IFrame.prototype.__class__ = com.inq.ui.IFrame;
com.inq.events.HTTPStatusEvent = function(type,bubbles,cancelable,status) { if( type === $_ ) return; {
	com.inq.events.Event.apply(this,[type]);
}}
com.inq.events.HTTPStatusEvent.__name__ = ["com","inq","events","HTTPStatusEvent"];
com.inq.events.HTTPStatusEvent.__super__ = com.inq.events.Event;
for(var k in com.inq.events.Event.prototype ) com.inq.events.HTTPStatusEvent.prototype[k] = com.inq.events.Event.prototype[k];
com.inq.events.HTTPStatusEvent.prototype.m_status = null;
com.inq.events.HTTPStatusEvent.prototype.status = null;
com.inq.events.HTTPStatusEvent.prototype.__class__ = com.inq.events.HTTPStatusEvent;
com.inq.events.IOErrorEvent = function(type,bubbles,cancelable,text) { if( type === $_ ) return; {
	com.inq.events.ErrorEvent.apply(this,[type]);
}}
com.inq.events.IOErrorEvent.__name__ = ["com","inq","events","IOErrorEvent"];
com.inq.events.IOErrorEvent.__super__ = com.inq.events.ErrorEvent;
for(var k in com.inq.events.ErrorEvent.prototype ) com.inq.events.IOErrorEvent.prototype[k] = com.inq.events.ErrorEvent.prototype[k];
com.inq.events.IOErrorEvent.prototype.__class__ = com.inq.events.IOErrorEvent;
com.inq.ui.ArrayCollection = function(p) { if( p === $_ ) return; {
	this._collection = new Array();
}}
com.inq.ui.ArrayCollection.__name__ = ["com","inq","ui","ArrayCollection"];
com.inq.ui.ArrayCollection.prototype._collection = null;
com.inq.ui.ArrayCollection.prototype.addItem = function(itm) {
	this._collection[this._collection.length] = itm;
}
com.inq.ui.ArrayCollection.prototype.getItemAt = function(indx) {
	if(indx < this._collection.length) return this._collection[indx];
	return null;
}
com.inq.ui.ArrayCollection.prototype.getLength = function() {
	return this._collection.length;
}
com.inq.ui.ArrayCollection.prototype.length = null;
com.inq.ui.ArrayCollection.prototype.__class__ = com.inq.ui.ArrayCollection;
com.inq.flash.client.control.messagehandlers.ChatroomTransferResponse = function(p) { if( p === $_ ) return; {
	com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.apply(this,[com.inq.flash.client.data.MessageFields.TYPE_CHAT_TRANSFER_RESPONSE]);
}}
com.inq.flash.client.control.messagehandlers.ChatroomTransferResponse.__name__ = ["com","inq","flash","client","control","messagehandlers","ChatroomTransferResponse"];
com.inq.flash.client.control.messagehandlers.ChatroomTransferResponse.__super__ = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler;
for(var k in com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype ) com.inq.flash.client.control.messagehandlers.ChatroomTransferResponse.prototype[k] = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype[k];
com.inq.flash.client.control.messagehandlers.ChatroomTransferResponse.prototype.processMessage = function(message) {
	var displayText = StringTools.trim(message.getProperty("client.display.text"));
	var messageParts = displayText.split("&nl;");
	{
		var _g1 = 0, _g = messageParts.length;
		while(_g1 < _g) {
			var i = _g1++;
			com.inq.flash.client.chatskins.SkinControl.AddTranscriptItemToChatWindow("",messageParts[i],com.inq.flash.client.chatskins.ChatTextArea.SYSTEM,-1);
		}
	}
}
com.inq.flash.client.control.messagehandlers.ChatroomTransferResponse.prototype.__class__ = com.inq.flash.client.control.messagehandlers.ChatroomTransferResponse;
com.inq.ui.Image = function(_id) { if( _id === $_ ) return; {
	com.inq.ui.Container.apply(this,[_id]);
}}
com.inq.ui.Image.__name__ = ["com","inq","ui","Image"];
com.inq.ui.Image.__super__ = com.inq.ui.Container;
for(var k in com.inq.ui.Container.prototype ) com.inq.ui.Image.prototype[k] = com.inq.ui.Container.prototype[k];
com.inq.ui.Image.prototype._img = null;
com.inq.ui.Image.prototype.setSrc = function(val) {
	haxe.Log.trace("Image.setSrc: " + val,{ fileName : "Image.hx", lineNumber : 20, className : "com.inq.ui.Image", methodName : "setSrc"});
	if(this._div != null) {
		this.src = val;
		if(this.src == null || this.src == "") return;
		this._newim = this.getNewImage();
		this._newim.onload = $closure(this,"whenLoaded");
		this._newim.src = this.src;
	}
}
com.inq.ui.Image.prototype.src = null;
com.inq.ui.Image.prototype.__class__ = com.inq.ui.Image;
com.inq.utils.StringUtil = function(p) { if( p === $_ ) return; {
	null;
}}
com.inq.utils.StringUtil.__name__ = ["com","inq","utils","StringUtil"];
com.inq.utils.StringUtil.__super__ = StringTools;
for(var k in StringTools.prototype ) com.inq.utils.StringUtil.prototype[k] = StringTools.prototype[k];
com.inq.utils.StringUtil.trim = function(s) {
	return StringTools.trim(s);
}
com.inq.utils.StringUtil.htmlDecode = function(s) {
	var res = StringTools.htmlUnescape(s);
	return res;
}
com.inq.utils.StringUtil.escapeForJs = function(val) {
	var value = val;
	value = value.split("\\").join("\\\\");
	value = value.split("\"").join("\\\"");
	value = value.split("'").join("\\'");
	value = value.split("\n").join("\\n");
	value = value.split("\r").join("\\r");
	value = value.split("\t").join("\\t");
	return value;
}
com.inq.utils.StringUtil.toJsString = function(value) {
	return "'" + com.inq.utils.StringUtil.escapeForJs(value) + "'";
}
com.inq.utils.StringUtil.toJsonString = function(value) {
	return "\"" + com.inq.utils.StringUtil.escapeForJs(value) + "\"";
}
com.inq.utils.StringUtil.urlDecode = function(s) {
	return StringTools.urlDecode(s);
}
com.inq.utils.StringUtil.dictionaryToJson = function(dict) {
	if(dict == null) {
		return "null";
	}
	var jsDict = "{";
	var propertiesSeparator = "";
	var keyz = Reflect.fields(dict);
	{
		var _g1 = 0, _g = keyz.length;
		while(_g1 < _g) {
			var i = _g1++;
			var key = keyz[i];
			var valueType = Type.getClassName(Type.getClass(dict[key]));
			jsDict += propertiesSeparator + com.inq.utils.StringUtil.toJsonString(key) + ":";
			jsDict += (valueType == "String"?com.inq.utils.StringUtil.toJsonString(dict[key]):com.inq.utils.StringUtil.dictionaryToJson(dict[key]));
			propertiesSeparator = ",";
		}
	}
	jsDict += "}";
	return jsDict;
}
com.inq.utils.StringUtil.prototype.__class__ = com.inq.utils.StringUtil;
com.inq.flash.client.chatskins.CoBrowseMgr = function() { }
com.inq.flash.client.chatskins.CoBrowseMgr.__name__ = ["com","inq","flash","client","chatskins","CoBrowseMgr"];
com.inq.flash.client.chatskins.CoBrowseMgr.init = function() {
	com.inq.flash.client.chatskins.CoBrowseMgr.customerAcceptsCobrowse = ((Application.application.skinConfig["customerAcceptsCobrowse"] != null?Application.application.skinConfig["customerAcceptsCobrowse"]:"Customer accepts cobrowse invitation."));
	com.inq.flash.client.chatskins.CoBrowseMgr.customerDeclinesCobrowse = ((Application.application.skinConfig["customerDeclinesCobrowse"] != null?Application.application.skinConfig["customerDeclinesCobrowse"]:"Customer declines cobrowse invitation."));
	com.inq.flash.client.chatskins.CoBrowseMgr.customerAcceptsSharedControl = ((Application.application.skinConfig["customerAcceptsSharedControl"] != null?Application.application.skinConfig["customerAcceptsSharedControl"]:"Customer accepts shared browser control."));
	com.inq.flash.client.chatskins.CoBrowseMgr.customerDeclinesSharedControl = ((Application.application.skinConfig["customerDeclinesSharedControl"] != null?Application.application.skinConfig["customerDeclinesSharedControl"]:"Customer declines shared browser control."));
	com.inq.flash.client.chatskins.CoBrowseMgr.customerEndCobrowseSession = ((Application.application.skinConfig["customerEndCobrowseSession"] != null?Application.application.skinConfig["customerEndCobrowseSession"]:"Customer end cobrowse session."));
	com.inq.flash.client.chatskins.CoBrowseMgr.agentEndCobrowseSession = ((Application.application.skinConfig["agentEndCobrowseSession"] != null?Application.application.skinConfig["agentEndCobrowseSession"]:"Agent end cobrowse session."));
}
com.inq.flash.client.chatskins.CoBrowseMgr.acceptCobInv = function() {
	if(com.inq.flash.client.control.FlashPeer.isCobrowseEnagaged()) return;
	com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.disableLastEngageMessage();
	com.inq.flash.client.chatskins.SkinControl.getApplicationController().sendCoBrowseMessage(com.inq.flash.client.chatskins.CoBrowseMgr.customerAcceptsCobrowse,com.inq.flash.client.data.MessageFields.KEY_COBROWSE_EVENT_TYPE_CLIENT_COBROWSE_ACCEPT);
	com.inq.flash.client.control.FlashPeer.acceptCobInv();
}
com.inq.flash.client.chatskins.CoBrowseMgr.declineCobInv = function() {
	if(com.inq.flash.client.control.FlashPeer.isCobrowseEnagaged()) return;
	com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.disableLastEngageMessage();
	com.inq.flash.client.chatskins.SkinControl.getApplicationController().sendCoBrowseMessage(com.inq.flash.client.chatskins.CoBrowseMgr.customerDeclinesCobrowse,com.inq.flash.client.data.MessageFields.KEY_COBROWSE_EVENT_TYPE_CLIENT_COBROWSE_DECLINE);
}
com.inq.flash.client.chatskins.CoBrowseMgr.acceptCobAndShareInv = function() {
	if(com.inq.flash.client.control.FlashPeer.isCobrowseEnagaged() || com.inq.flash.client.control.FlashPeer.isCobrowseSharedControl()) {
		return;
	}
	com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.disableLastEngageMessage();
	com.inq.flash.client.chatskins.SkinControl.getApplicationController().sendCoBrowseMessage(com.inq.flash.client.chatskins.CoBrowseMgr.customerAcceptsCobrowse,com.inq.flash.client.data.MessageFields.KEY_COBROWSE_EVENT_TYPE_CLIENT_COBROWSE_ACCEPT);
	com.inq.flash.client.control.FlashPeer.acceptCobAndShareInv();
}
com.inq.flash.client.chatskins.CoBrowseMgr.acceptCobShareInv = function() {
	if(com.inq.flash.client.control.FlashPeer.isCobrowseSharedControl()) {
		return;
	}
	com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.disableLastSharedMessage();
	com.inq.flash.client.chatskins.SkinControl.getApplicationController().sendCoBrowseMessage(com.inq.flash.client.chatskins.CoBrowseMgr.customerAcceptsSharedControl,com.inq.flash.client.data.MessageFields.KEY_COBROWSE_EVENT_TYPE_CLIENT_COBROWSE_ACCEPT_SHARE);
	com.inq.flash.client.control.FlashPeer.acceptCobShareInv();
}
com.inq.flash.client.chatskins.CoBrowseMgr.declineCobShareInv = function() {
	if(com.inq.flash.client.control.FlashPeer.isCobrowseSharedControl()) {
		return;
	}
	com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.disableLastSharedMessage();
	com.inq.flash.client.chatskins.SkinControl.getApplicationController().sendCoBrowseMessage(com.inq.flash.client.chatskins.CoBrowseMgr.customerDeclinesSharedControl,com.inq.flash.client.data.MessageFields.KEY_COBROWSE_EVENT_TYPE_CLIENT_COBROWSE_DECLINE_SHARE);
}
com.inq.flash.client.chatskins.CoBrowseMgr.endCob = function() {
	if(com.inq.flash.client.control.FlashPeer.isCobrowseEnded() || !com.inq.flash.client.control.FlashPeer.isCobrowseEnagaged()) return;
	com.inq.flash.client.chatskins.CoBrowseMgr.sendCobrowseEnded();
	com.inq.flash.client.control.FlashPeer.endCob();
}
com.inq.flash.client.chatskins.CoBrowseMgr.agentEndsCob = function() {
	if(com.inq.flash.client.control.FlashPeer.isCobrowseEnded() || !com.inq.flash.client.control.FlashPeer.isCobrowseEnagaged()) return;
	com.inq.flash.client.chatskins.SkinControl.getApplicationController().sendCoBrowseMessage(com.inq.flash.client.chatskins.CoBrowseMgr.agentEndCobrowseSession,com.inq.flash.client.data.MessageFields.KEY_COBROWSE_EVENT_TYPE_CLIENT_COBROWSE_END);
	com.inq.flash.client.control.FlashPeer.endCob();
}
com.inq.flash.client.chatskins.CoBrowseMgr.sendCobrowseEnded = function() {
	com.inq.flash.client.chatskins.SkinControl.getApplicationController().sendCoBrowseMessage(com.inq.flash.client.chatskins.CoBrowseMgr.customerEndCobrowseSession,com.inq.flash.client.data.MessageFields.KEY_COBROWSE_EVENT_TYPE_CLIENT_COBROWSE_END);
}
com.inq.flash.client.chatskins.CoBrowseMgr.prototype.__class__ = com.inq.flash.client.chatskins.CoBrowseMgr;
com.inq.flash.client.chatskins.BalloonNotifier = function(p) { if( p === $_ ) return; {
	null;
}}
com.inq.flash.client.chatskins.BalloonNotifier.__name__ = ["com","inq","flash","client","chatskins","BalloonNotifier"];
com.inq.flash.client.chatskins.BalloonNotifier.Clear = function() {
	var elements = null;
	try {
		elements = Application.application._div.getElementsByTagName("*");
		if(elements == null) return;
	}
	catch( $e161 ) {
		{
			var unknown = $e161;
			{
				return;
			}
		}
	}
	var ix;
	{
		var _g1 = 0, _g = elements.length;
		while(_g1 < _g) {
			var ix1 = _g1++;
			try {
				var el = elements[ix1];
				if(el == null) {
					continue;
				}
				if(el["balloon"] != null) {
					el.balloon.destroy();
					el.balloon = null;
				}
			}
			catch( $e162 ) {
				{
					var unknown = $e162;
					{
						haxe.Log.trace("Clear failed" + unknown,{ fileName : "BalloonNotifier.hx", lineNumber : 35, className : "com.inq.flash.client.chatskins.BalloonNotifier", methodName : "Clear"});
					}
				}
			}
		}
	}
}
com.inq.flash.client.chatskins.BalloonNotifier.Resize = function() {
	var elements = null;
	try {
		elements = Application.application._div.getElementsByTagName("*");
		if(elements == null) return;
	}
	catch( $e163 ) {
		{
			var unknown = $e163;
			{
				return;
			}
		}
	}
	var ix;
	{
		var _g1 = 0, _g = elements.length;
		while(_g1 < _g) {
			var ix1 = _g1++;
			try {
				var el = elements[ix1];
				if(el == null) {
					continue;
				}
				if(el["balloon"] != null) {
					el.balloon.resize();
				}
			}
			catch( $e164 ) {
				{
					var unknown = $e164;
					{
						haxe.Log.trace("Resize failed" + unknown,{ fileName : "BalloonNotifier.hx", lineNumber : 58, className : "com.inq.flash.client.chatskins.BalloonNotifier", methodName : "Resize"});
					}
				}
			}
		}
	}
}
com.inq.flash.client.chatskins.BalloonNotifier.Notify = function(element,text) {
	com.inq.flash.client.chatskins.BalloonNotifier.show(element,text,"BalloonNotify");
}
com.inq.flash.client.chatskins.BalloonNotifier.Warn = function(element,text) {
	com.inq.flash.client.chatskins.BalloonNotifier.show(element,text,"BalloonWarn");
	element.onfocus = function(ev) {
		element.balloon.destroy();
	}
}
com.inq.flash.client.chatskins.BalloonNotifier.show = function(element,text,styleName) {
	var c = window.document.getElementById("chatWindow_span").parentNode;
	if(c != null || c.length > 0) {
		element.balloon = new com.inq.ui.BalloonOverlaying(element.id + "_balloon",styleName,element,text,c);
		element.balloon.addEventListener(com.inq.events.MouseEvent.CLICK,$closure(com.inq.flash.client.chatskins.BalloonNotifier,"onBalloonClick"));
	}
}
com.inq.flash.client.chatskins.BalloonNotifier.onBalloonClick = function(me) {
	try {
		var target = me.currentTarget;
		var el = null;
		el = target.destroy();
		if(el != null) {
			if(el != null && el.focus != null) el.focus();
		}
	}
	catch( $e165 ) {
		{
			var unknown = $e165;
			{
				haxe.Log.trace("onBalloonClick" + unknown,{ fileName : "BalloonNotifier.hx", lineNumber : 90, className : "com.inq.flash.client.chatskins.BalloonNotifier", methodName : "onBalloonClick"});
			}
		}
	}
	return (true);
}
com.inq.flash.client.chatskins.BalloonNotifier.prototype.__class__ = com.inq.flash.client.chatskins.BalloonNotifier;
com.inq.flash.client.chatskins.FocusMonitor = function(p) { if( p === $_ ) return; {
	null;
}}
com.inq.flash.client.chatskins.FocusMonitor.__name__ = ["com","inq","flash","client","chatskins","FocusMonitor"];
com.inq.flash.client.chatskins.FocusMonitor.init = function() {
	com.inq.flash.client.chatskins.FocusMonitor.clientWin = window.parent;
	com.inq.flash.client.chatskins.FocusMonitor.clientDoc = window.parent.doc;
	if(com.inq.flash.client.chatskins.FocusMonitor.clientWin.name != "_inqPersistentChat") return false;
	try {
		var sChatNeedsFocusInterval;
		if(null == (com.inq.flash.client.chatskins.FocusMonitor._sTitleBarText = Application.application.skinConfig["sPersistentFrameTitle"])) com.inq.flash.client.chatskins.FocusMonitor._sTitleBarText = "Chat";
		if(null == (com.inq.flash.client.chatskins.FocusMonitor._sTitleBarFlashText = Application.application.skinConfig["sChatNeedsFocusTitle"])) com.inq.flash.client.chatskins.FocusMonitor._sTitleBarFlashText = "**********";
		if(null == (sChatNeedsFocusInterval = Application.application.skinConfig["iChatNeedsFocusInterval"])) sChatNeedsFocusInterval = "2000";
		try {
			com.inq.flash.client.chatskins.FocusMonitor._timerInterval = Std.parseInt(sChatNeedsFocusInterval);
		}
		catch( $e166 ) {
			if( js.Boot.__instanceof($e166,Error) ) {
				var e = $e166;
				{
					com.inq.flash.client.chatskins.FocusMonitor._timerInterval = 2000;
				}
			} else throw($e166);
		}
	}
	catch( $e167 ) {
		if( js.Boot.__instanceof($e167,Error) ) {
			var e = $e167;
			null;
		} else throw($e167);
	}
	if(null != window["attachEvent"]) {
		window.parent.document.onfocusin = $closure(com.inq.flash.client.chatskins.FocusMonitor,"whenFocus");
		window.parent.document.onfocusout = $closure(com.inq.flash.client.chatskins.FocusMonitor,"whenBlur");
	}
	else if(null != window["addEventListener"]) {
		window.addEventListener("focus",$closure(com.inq.flash.client.chatskins.FocusMonitor,"whenFocus"),false);
		window.addEventListener("blur",$closure(com.inq.flash.client.chatskins.FocusMonitor,"whenBlur"),false);
	}
	return true;
}
com.inq.flash.client.chatskins.FocusMonitor.isFocused = function() {
	return com.inq.flash.client.chatskins.FocusMonitor._bFocused;
}
com.inq.flash.client.chatskins.FocusMonitor.toggleTitlebar = function() {
	var ttl = window.parent.document.title;
	window.parent.document.title = ((ttl != com.inq.flash.client.chatskins.FocusMonitor._sTitleBarFlashText)?com.inq.flash.client.chatskins.FocusMonitor._sTitleBarFlashText:com.inq.flash.client.chatskins.FocusMonitor._sTitleBarText);
}
com.inq.flash.client.chatskins.FocusMonitor.startTitlebarFlash = function() {
	if(com.inq.flash.client.chatskins.FocusMonitor.clientWin.name != "_inqPersistentChat") return;
	if(com.inq.flash.client.chatskins.FocusMonitor._timer != -1) return;
	window.parent.document.title = com.inq.flash.client.chatskins.FocusMonitor._sTitleBarFlashText;
	com.inq.flash.client.chatskins.FocusMonitor._timer = window.setInterval($closure(com.inq.flash.client.chatskins.FocusMonitor,"toggleTitlebar"),com.inq.flash.client.chatskins.FocusMonitor._timerInterval);
}
com.inq.flash.client.chatskins.FocusMonitor.stopTitlebarFlash = function() {
	if(com.inq.flash.client.chatskins.FocusMonitor._timer != -1) window.clearInterval(com.inq.flash.client.chatskins.FocusMonitor._timer);
	com.inq.flash.client.chatskins.FocusMonitor._timer = -1;
	window.parent.document.title = com.inq.flash.client.chatskins.FocusMonitor._sTitleBarText;
}
com.inq.flash.client.chatskins.FocusMonitor.whenBlur = function(e) {
	if(com.inq.flash.client.chatskins.FocusMonitor._bFocused) {
		haxe.Log.trace("lost focus",{ fileName : "FocusMonitor.hx", lineNumber : 83, className : "com.inq.flash.client.chatskins.FocusMonitor", methodName : "whenBlur"});
	}
	com.inq.flash.client.chatskins.FocusMonitor._bFocused = false;
	return true;
}
com.inq.flash.client.chatskins.FocusMonitor.whenFocus = function(e) {
	if(!com.inq.flash.client.chatskins.FocusMonitor._bFocused) {
		haxe.Log.trace("gained focus",{ fileName : "FocusMonitor.hx", lineNumber : 91, className : "com.inq.flash.client.chatskins.FocusMonitor", methodName : "whenFocus"});
	}
	com.inq.flash.client.chatskins.FocusMonitor.stopTitlebarFlash();
	com.inq.flash.client.chatskins.FocusMonitor._bFocused = true;
	return true;
}
com.inq.flash.client.chatskins.FocusMonitor.prototype.__class__ = com.inq.flash.client.chatskins.FocusMonitor;
com.inq.ui.XFrame = function(_id) { if( _id === $_ ) return; {
	com.inq.ui.IFrame.apply(this,[_id]);
	this.initStyle("id",_id);
	this.__src = null;
	this.__oldSource = null;
	this.__initOnLoad = false;
}}
com.inq.ui.XFrame.__name__ = ["com","inq","ui","XFrame"];
com.inq.ui.XFrame.__super__ = com.inq.ui.IFrame;
for(var k in com.inq.ui.IFrame.prototype ) com.inq.ui.XFrame.prototype[k] = com.inq.ui.IFrame.prototype[k];
com.inq.ui.XFrame.prototype.__initOnLoad = null;
com.inq.ui.XFrame.prototype.__oldSource = null;
com.inq.ui.XFrame.prototype.__src = null;
com.inq.ui.XFrame.prototype.cloneXFrameData = function() {
	var target = { }
	var keyz = Reflect.fields(this.__src);
	{
		var _g1 = 0, _g = keyz.length;
		while(_g1 < _g) {
			var s = _g1++;
			var name = keyz[s];
			if(name != "cacheId") {
				target[name] = this.__src[name];
			}
		}
	}
	return target;
}
com.inq.ui.XFrame.prototype.equal = function(o1,o2) {
	if(o1 == null) {
		return o2 == null;
	}
	var fields = Reflect.fields(o1);
	if(!(fields.length == Reflect.fields(o2).length)) {
		return false;
	}
	{
		var _g1 = 0, _g = fields.length;
		while(_g1 < _g) {
			var s = _g1++;
			if(o1[fields[s]] == o2[fields[s]]) {
				return false;
			}
		}
	}
	return true;
}
com.inq.ui.XFrame.prototype.getIJSF = function() {
	var port = (("" == window.location.port)?"":(":" + window.location.port));
	var src = window.location.protocol + "//" + window.location.host + port + window.location.pathname;
	return src;
}
com.inq.ui.XFrame.prototype.getInitOnLoad = function() {
	return this.__initOnLoad;
}
com.inq.ui.XFrame.prototype.initOnLoad = null;
com.inq.ui.XFrame.prototype.loadContent = function() {
	this.setInnerHTML(this.__src);
}
com.inq.ui.XFrame.prototype.persistURL = function() {
	com.inq.flash.client.control.PersistenceManager.SetValue(com.inq.ui.XFrame.PERSISTENT_URL_COOKIE_PREFIX + this.getID(),this.cloneXFrameData());
}
com.inq.ui.XFrame.prototype.readPersistedURL = function(defaultVal) {
	return com.inq.flash.client.control.PersistenceManager.GetValue(com.inq.ui.XFrame.PERSISTENT_URL_COOKIE_PREFIX + this.getID(),defaultVal);
}
com.inq.ui.XFrame.prototype.setInitOnLoad = function(val) {
	if(this._div != null && val == "true") {
		if(this.__src == null) {
			this.__initOnLoad = true;
		}
		else {
			this.setInnerHTML(this.__src);
		}
	}
}
com.inq.ui.XFrame.prototype.setInnerHTML = function(source,channelID) {
	if(this.__oldSource == null || this.__oldSource.url != source.url || !this.equal(this.__oldSource.params,this.__oldSource.params)) {
		this.__oldSource = source;
		this._iframe = com.inq.flash.client.control.FlashPeer.createXFrame(this._div,source.url,channelID,this.scrolling,source.params);
	}
}
com.inq.ui.XFrame.prototype.setSrc = function(val) {
	var urldata = com.inq.flash.client.control.FlashPeer.parseXFrameUrl(val);
	if(this.__src == null) {
		urldata = this.readPersistedURL(urldata);
	}
	return this.setSrcWithChannelID(urldata);
}
com.inq.ui.XFrame.prototype.setSrcWithChannelID = function(urldata,channelID) {
	if(this._div != null) {
		this.__src = urldata;
		if(this.__initOnLoad) {
			this.__initOnLoad = false;
			this.setInnerHTML(this.__src,channelID);
		}
	}
}
com.inq.ui.XFrame.prototype.src = null;
com.inq.ui.XFrame.prototype.updateSrc = function(channelID) {
	if(this.__src != null && channelID) {
		this.__src.params.channelID = channelID;
	}
}
com.inq.ui.XFrame.prototype.__class__ = com.inq.ui.XFrame;
com.inq.flash.messagingframework.TranscriptEntry = function(p) { if( p === $_ ) return; {
	this.timestamp = Math.floor(Date.now().getTime() % 1000.0);
}}
com.inq.flash.messagingframework.TranscriptEntry.__name__ = ["com","inq","flash","messagingframework","TranscriptEntry"];
com.inq.flash.messagingframework.TranscriptEntry.prototype.data = null;
com.inq.flash.messagingframework.TranscriptEntry.prototype.getData = function() {
	return this.data;
}
com.inq.flash.messagingframework.TranscriptEntry.prototype.getSender = function() {
	return this.sender;
}
com.inq.flash.messagingframework.TranscriptEntry.prototype.getTimestamp = function() {
	return this.timestamp;
}
com.inq.flash.messagingframework.TranscriptEntry.prototype.getType = function() {
	return this.type;
}
com.inq.flash.messagingframework.TranscriptEntry.prototype.sender = null;
com.inq.flash.messagingframework.TranscriptEntry.prototype.setData = function(data) {
	this.data = data;
}
com.inq.flash.messagingframework.TranscriptEntry.prototype.setSender = function(sender) {
	this.sender = sender;
}
com.inq.flash.messagingframework.TranscriptEntry.prototype.setType = function(type) {
	this.type = type;
}
com.inq.flash.messagingframework.TranscriptEntry.prototype.timestamp = null;
com.inq.flash.messagingframework.TranscriptEntry.prototype.type = null;
com.inq.flash.messagingframework.TranscriptEntry.prototype.__class__ = com.inq.flash.messagingframework.TranscriptEntry;
com.inq.events.KeyboardEvent = function(type,bubbles,cancelable,charCode,keyCode,keyLocation,ctrlKey,altKey,shiftKey) { if( type === $_ ) return; {
	com.inq.events.Event.apply(this,[type]);
}}
com.inq.events.KeyboardEvent.__name__ = ["com","inq","events","KeyboardEvent"];
com.inq.events.KeyboardEvent.__super__ = com.inq.events.Event;
for(var k in com.inq.events.Event.prototype ) com.inq.events.KeyboardEvent.prototype[k] = com.inq.events.Event.prototype[k];
com.inq.events.KeyboardEvent.prototype.altKey = null;
com.inq.events.KeyboardEvent.prototype.charCode = null;
com.inq.events.KeyboardEvent.prototype.ctrlKey = null;
com.inq.events.KeyboardEvent.prototype.keyCode = null;
com.inq.events.KeyboardEvent.prototype.keyLocation = null;
com.inq.events.KeyboardEvent.prototype.m_altKey = null;
com.inq.events.KeyboardEvent.prototype.m_charCode = null;
com.inq.events.KeyboardEvent.prototype.m_ctrlKey = null;
com.inq.events.KeyboardEvent.prototype.m_keyCode = null;
com.inq.events.KeyboardEvent.prototype.m_keyLocation = null;
com.inq.events.KeyboardEvent.prototype.m_shiftKey = null;
com.inq.events.KeyboardEvent.prototype.shiftKey = null;
com.inq.events.KeyboardEvent.prototype.updateAfterEvent = function() {
	null;
}
com.inq.events.KeyboardEvent.prototype.__class__ = com.inq.events.KeyboardEvent;
com.inq.flash.client.control.FlashVars = function() { }
com.inq.flash.client.control.FlashVars.__name__ = ["com","inq","flash","client","control","FlashVars"];
com.inq.flash.client.control.FlashVars._flashVars = null;
com.inq.flash.client.control.FlashVars.flashVars = null;
com.inq.flash.client.control.FlashVars.getFlashVars = function() {
	if(null == com.inq.flash.client.control.FlashVars._flashVars) com.inq.flash.client.control.FlashVars.setApplicationParameters();
	return com.inq.flash.client.control.FlashVars._flashVars;
}
com.inq.flash.client.control.FlashVars.inHOP = null;
com.inq.flash.client.control.FlashVars.agentsAvailable = null;
com.inq.flash.client.control.FlashVars.persistentFrame = null;
com.inq.flash.client.control.FlashVars.chatID = null;
com.inq.flash.client.control.FlashVars.clickStream = null;
com.inq.flash.client.control.FlashVars.submitURL = null;
com.inq.flash.client.control.FlashVars.shutdownPopup = null;
com.inq.flash.client.control.FlashVars.continued = null;
com.inq.flash.client.control.FlashVars.tagServerBaseURL = null;
com.inq.flash.client.control.FlashVars.openerID = null;
com.inq.flash.client.control.FlashVars.agentName = null;
com.inq.flash.client.control.FlashVars.openerDelay = null;
com.inq.flash.client.control.FlashVars.newFramework = null;
com.inq.flash.client.control.FlashVars.theEngagementType = null;
com.inq.flash.client.control.FlashVars.userAgent = null;
com.inq.flash.client.control.FlashVars._init = function() {
	com.inq.flash.client.control.FlashVars._flashVars = null;
	return true;
}
com.inq.flash.client.control.FlashVars.xgetAgentName = function() {
	return com.inq.flash.client.control.FlashVars.getFlashVars()["agentName"];
}
com.inq.flash.client.control.FlashVars.setAgentName = function(valu) {
	if(valu == null || valu == "null" || StringTools.trim(valu) == "") valu = "Jessica";
	com.inq.flash.client.control.FlashVars.getFlashVars()["agentName"] = valu;
}
com.inq.flash.client.control.FlashVars.setPersistentFrame = function(val) {
	com.inq.flash.client.control.FlashVars.getFlashVars()["PersistentFrame"] = val;
}
com.inq.flash.client.control.FlashVars.getUserAgent = function() {
	return com.inq.flash.client.control.FlashVars.getFlashVars()["userAgent"];
}
com.inq.flash.client.control.FlashVars.getPersistentFrame = function() {
	return com.inq.flash.client.control.FlashVars.getFlashVars()["PersistentFrame"];
}
com.inq.flash.client.control.FlashVars.xsetPersistentFrame = function(valu) {
	com.inq.flash.client.control.FlashVars.getFlashVars()["PersistentFrame"] = valu;
}
com.inq.flash.client.control.FlashVars.getChatID = function() {
	try {
		return com.inq.flash.client.control.FlashVars.getFlashVars()["chatID"];
	}
	catch( $e168 ) {
		if( js.Boot.__instanceof($e168,Error) ) {
			var e = $e168;
			{
				haxe.Log.trace("FlashVars.getChatID ERROR: " + e,{ fileName : "FlashVars.hx", lineNumber : 69, className : "com.inq.flash.client.control.FlashVars", methodName : "getChatID"});
				return null;
			}
		} else throw($e168);
	}
}
com.inq.flash.client.control.FlashVars.getClickStream = function() {
	var datum = com.inq.flash.client.control.FlashVars.getFlashVars()["clickStream"];
	return datum;
}
com.inq.flash.client.control.FlashVars.getSubmitURL = function() {
	return com.inq.flash.client.control.FlashVars.getFlashVars()["submitURL"];
}
com.inq.flash.client.control.FlashVars.getShutdownPopup = function() {
	return com.inq.flash.client.control.FlashVars.getFlashVars()["shutdownPopup"];
}
com.inq.flash.client.control.FlashVars.isContinued = function() {
	return Std.parseInt("" + com.inq.flash.client.control.FlashVars.getFlashVars()["continued"]) == 1;
}
com.inq.flash.client.control.FlashVars.getTagServerBaseURL = function() {
	return com.inq.flash.client.control.FlashVars.getFlashVars()["tagServerBaseURL"];
}
com.inq.flash.client.control.FlashVars.getOpenerID = function() {
	return com.inq.flash.client.control.FlashVars.getFlashVars()["openerID"];
}
com.inq.flash.client.control.FlashVars.getAgentName = function() {
	return com.inq.flash.client.control.FlashVars.getFlashVars()["agentName"];
}
com.inq.flash.client.control.FlashVars.getOpenerDelay = function() {
	return com.inq.flash.client.control.FlashVars.getFlashVars()["openerDelay"];
}
com.inq.flash.client.control.FlashVars.getNewFramework = function() {
	return com.inq.flash.client.control.FlashVars.getFlashVars()["newFramework"];
}
com.inq.flash.client.control.FlashVars.getTheEngagementType = function() {
	return com.inq.flash.client.control.FlashVars.getFlashVars()["theEngagementType"];
}
com.inq.flash.client.control.FlashVars.setTheEngagementType = function(valu) {
	com.inq.flash.client.control.FlashVars.getFlashVars()["theEngagementType"] = valu;
}
com.inq.flash.client.control.FlashVars.getInHOP = function() {
	return Std.parseInt("" + com.inq.flash.client.control.FlashVars.getFlashVars()["inHOP"]) == 1;
}
com.inq.flash.client.control.FlashVars.getAgentsAvailable = function() {
	return Std.parseInt("" + com.inq.flash.client.control.FlashVars.getFlashVars()["agAvail"]) == 1;
}
com.inq.flash.client.control.FlashVars.setApplicationParameters = function() {
	com.inq.flash.client.control.FlashVars._flashVars = new com.inq.utils.Dictionary();
	var keyz = Reflect.fields(Application.application.parameters);
	haxe.Log.trace("MainApplication.parameters=" + Application.application.parameters,{ fileName : "FlashVars.hx", lineNumber : 96, className : "com.inq.flash.client.control.FlashVars", methodName : "setApplicationParameters"});
	if(null == Application.application.parameters) {
		haxe.Log.trace("ERROR: no parameters",{ fileName : "FlashVars.hx", lineNumber : 98, className : "com.inq.flash.client.control.FlashVars", methodName : "setApplicationParameters"});
	}
	{
		var _g1 = 0, _g = keyz.length;
		while(_g1 < _g) {
			var s = _g1++;
			var keyname = keyz[s];
			var datum = Application.application.parameters[keyname];
			try {
				com.inq.flash.client.control.FlashVars._flashVars[keyname] = datum;
				haxe.Log.trace("FlashVars.hx: setApplicationParameters: " + keyname + " = " + datum,{ fileName : "FlashVars.hx", lineNumber : 107, className : "com.inq.flash.client.control.FlashVars", methodName : "setApplicationParameters"});
			}
			catch( $e169 ) {
				if( js.Boot.__instanceof($e169,Error) ) {
					var e = $e169;
					{
						haxe.Log.trace("FlashVars.hx: setApplicationparameters: Error" + e,{ fileName : "FlashVars.hx", lineNumber : 109, className : "com.inq.flash.client.control.FlashVars", methodName : "setApplicationParameters"});
					}
				} else throw($e169);
			}
		}
	}
	com.inq.flash.client.control.FlashVars.setupFlashVar("theEngagementType","0");
	com.inq.flash.client.control.FlashVars.setupFlashVar("chatID","-1");
	com.inq.flash.client.control.FlashVars.setupFlashVar("continued","0");
	com.inq.flash.client.control.PersistenceManager.SetValue("c",1);
	com.inq.flash.client.control.FlashVars.setupFlashVar("iframeURL","http://sb3.conversive.com/gui_gamefly/chat.html");
	com.inq.flash.client.control.FlashVars.setupFlashVar("customerID","155454046669915704");
	com.inq.flash.client.control.FlashVars.setupFlashVar("agentName","Jessica");
	com.inq.flash.client.control.FlashVars.setupFlashVar("newFramework","1");
	com.inq.flash.client.control.FlashVars.setupFlashVar("shutdownPopup","false");
	com.inq.flash.client.control.FlashVars.setupFlashVar("PersistentFrame","0");
	com.inq.flash.client.control.FlashVars.setupFlashVar("userName","Visitor");
	com.inq.flash.client.control.FlashVars.setupFlashVar("crHost","chatrouterv3.inq.com");
	com.inq.flash.client.control.FlashVars.setupFlashVar("crPort","8080");
	com.inq.flash.client.control.FlashVars.setupFlashVar("openerID","6630");
	com.inq.flash.client.control.FlashVars.setupFlashVar("getSaleQualMessageCountThreshold","1");
	com.inq.flash.client.control.FlashVars.setupFlashVar("delay","0");
	com.inq.flash.client.control.FlashVars.setupFlashVar("submitURL","chatrouterv3.inq.com");
	com.inq.flash.client.control.FlashVars.setupFlashVar("commTypes",com.inq.flash.messagingframework.FlashMessagingFramework.CONNECTION_TYPE_HTTP);
	com.inq.flash.client.control.FlashVars.setupFlashVar("theEngagementType","0");
	com.inq.flash.client.control.FlashVars.setupFlashVar("clickStream","");
	com.inq.flash.client.control.FlashVars._flashVars["shutdownPopup"] = com.inq.flash.client.control.FlashVars._flashVars["shutdownPopup"] == "true";
	com.inq.flash.client.control.FlashVars._flashVars["PersistentFrame"] = com.inq.flash.client.control.FlashVars._flashVars["PersistentFrame"] != "0";
	com.inq.flash.client.control.FlashVars.setupFlashVar("openerDelay","6");
	com.inq.flash.client.control.FlashVars.setupFlashVar("msgCnt","-1");
	com.inq.flash.client.control.FlashVars.setupFlashVar("tagServerBaseURL","//tagserverv3.inq.com");
	com.inq.flash.client.control.FlashVars.setupFlashVar("inHOP","1");
	com.inq.flash.client.control.FlashVars.setupFlashVar("agAvail","1");
	var sTagServer = com.inq.flash.client.control.FlashVars._flashVars["tagServerBaseURL"];
	if(sTagServer.substr(0,4).toUpperCase() != "HTTP" && sTagServer.substr(0,2) != "//") {
		sTagServer = window.location.protocol + "//" + sTagServer;
		com.inq.flash.client.control.FlashVars._flashVars["tagServerBaseURL"] = sTagServer;
	}
	if(sTagServer.split("//")[0].toUpperCase() != ("" + window.location.protocol).toUpperCase()) {
		var parts = sTagServer.split("//");
		parts[0] = window.location.protocol;
		sTagServer = parts.join("//");
	}
	if(sTagServer.substr(sTagServer.length - 1) != "/") {
		sTagServer += "/";
		com.inq.flash.client.control.FlashVars._flashVars["tagServerBaseURL"] = sTagServer;
	}
	com.inq.flash.client.control.FlashVars._flashVars["msgCnt"] = Std.parseInt(com.inq.flash.client.control.FlashVars._flashVars["msgCnt"]);
	com.inq.flash.client.control.FlashVars._flashVars["crPort"] = Std.parseInt(com.inq.flash.client.control.FlashVars._flashVars["crPort"]);
	com.inq.flash.client.control.FlashVars._flashVars["theEngagementType"] = Std.parseInt(com.inq.flash.client.control.FlashVars._flashVars["theEngagementType"]);
	var sF = "\n";
	var keyz1 = Reflect.fields(com.inq.flash.client.control.FlashVars._flashVars);
	{
		var _g1 = 0, _g = keyz1.length;
		while(_g1 < _g) {
			var i = _g1++;
			var elmt = keyz1[i];
			var el = "" + elmt;
			var val = com.inq.flash.client.control.FlashVars._flashVars[elmt];
			var typ = " ";
			typ = typ.charAt(0).toUpperCase() + typ.substr(1);
			if("String" == typ) val = "\"" + val + "\"";
			sF += "FlashVars.flashVars." + elmt + ":" + typ + "=" + val + ";\n";
		}
	}
	haxe.Log.trace(sF,{ fileName : "FlashVars.hx", lineNumber : 184, className : "com.inq.flash.client.control.FlashVars", methodName : "setApplicationParameters"});
	com.inq.flash.client.chatskins.SkinControl.fireMxmlHandler("onParsedFlashVars");
	return com.inq.flash.client.control.FlashVars._flashVars;
}
com.inq.flash.client.control.FlashVars.setupFlashVar = function(name,defValue) {
	try {
		var _datum = null;
		try {
			_datum = com.inq.flash.client.control.FlashVars._flashVars[name];
		}
		catch( $e170 ) {
			if( js.Boot.__instanceof($e170,Error) ) {
				var e = $e170;
				{
					_datum = null;
				}
			} else throw($e170);
		}
		if(_datum == null) com.inq.flash.client.control.FlashVars._flashVars[name] = defValue;
	}
	catch( $e171 ) {
		if( js.Boot.__instanceof($e171,Error) ) {
			var e = $e171;
			{
				haxe.Log.trace("FlashVars.setupFlashVars: ERROR: " + e,{ fileName : "FlashVars.hx", lineNumber : 205, className : "com.inq.flash.client.control.FlashVars", methodName : "setupFlashVar"});
				com.inq.flash.client.control.FlashVars._flashVars[name] = defValue;
			}
		} else throw($e171);
	}
}
com.inq.flash.client.control.FlashVars.prototype.__class__ = com.inq.flash.client.control.FlashVars;
com.inq.flash.client.chatskins.FontMgr = function(p) { if( p === $_ ) return; {
	null;
}}
com.inq.flash.client.chatskins.FontMgr.__name__ = ["com","inq","flash","client","chatskins","FontMgr"];
com.inq.flash.client.chatskins.FontMgr.loaderSkin = null;
com.inq.flash.client.chatskins.FontMgr._init = function() {
	var win = window;
	return true;
}
com.inq.flash.client.chatskins.FontMgr.init = function() {
	var skin = Application.application.skinConfig["nextSkin"];
	if(skin == null) {
		if(com.inq.flash.client.chatskins.SkinControl.isInApplication("btnFontSize")) Application.application.btnFontSize.visible = false;
		return false;
	}
	if(com.inq.flash.client.chatskins.SkinControl.isInApplication("btnFontSize")) {
		Application.application.btnFontSize.addEventListener(com.inq.events.MouseEvent.CLICK,$closure(com.inq.flash.client.chatskins.FontMgr,"actionBtnNewFont"));
		Application.application.btnFontSize.visible = true;
		com.inq.flash.client.chatskins.FontMgr.nameNextSkin = skin;
		com.inq.ui.SkinLoader.PreloadNewSkin(com.inq.flash.client.chatskins.FontMgr.nameNextSkin);
		haxe.Log.trace("skin is " + com.inq.flash.client.chatskins.FontMgr.nameNextSkin,{ fileName : "FontMgr.hx", lineNumber : 50, className : "com.inq.flash.client.chatskins.FontMgr", methodName : "init"});
	}
	return true;
}
com.inq.flash.client.chatskins.FontMgr.actionBtnNewFont = function(me) {
	com.inq.ui.SkinLoader.LoadNewSkin(com.inq.flash.client.chatskins.FontMgr.nameNextSkin);
}
com.inq.flash.client.chatskins.FontMgr.prototype.__class__ = com.inq.flash.client.chatskins.FontMgr;
StringBuf = function(p) { if( p === $_ ) return; {
	this.b = new Array();
}}
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype.add = function(x) {
	this.b[this.b.length] = x;
}
StringBuf.prototype.addChar = function(c) {
	this.b[this.b.length] = String.fromCharCode(c);
}
StringBuf.prototype.addSub = function(s,pos,len) {
	this.b[this.b.length] = s.substr(pos,len);
}
StringBuf.prototype.b = null;
StringBuf.prototype.toString = function() {
	return this.b.join("");
}
StringBuf.prototype.__class__ = StringBuf;
com.inq.ui.Html = function(tagName,_id,parentNode) { if( tagName === $_ ) return; {
	var tag = tagName.toUpperCase();
	tag = tag.split(":")[1];
	var doc = parentNode.document;
	var element = null;
	element = window.parent.document.getElementById(_id);
	if(element == null) element = window.parent.document.getElementById("tcChat_" + _id);
	if(element == null) element = window.document.getElementById(_id);
	if(element == null) element = doc.createElement(tag);
	com.inq.ui.Container.apply(this,[element,null,doc]);
	com.inq.ui.ClientBody.registerElement(this);
}}
com.inq.ui.Html.__name__ = ["com","inq","ui","Html"];
com.inq.ui.Html.__super__ = com.inq.ui.Container;
for(var k in com.inq.ui.Container.prototype ) com.inq.ui.Html.prototype[k] = com.inq.ui.Container.prototype[k];
com.inq.ui.Html.prototype._buildStyle = function() {
	var w = this.styles.width;
	var l = this.styles.left;
	var t = this.styles.top;
	var h = this.styles.height;
	var pw = ((this._parent == null)?this.styles.width:this._parent.clientWidth);
	var ph = ((this._parent == null)?this.styles.height:this._parent.clientHeight);
	this._style += "z-index: " + (((this.styles.zindex == null)?"101":this.styles.zindex)) + ";";
	var stylesHeight = this.styles["height"];
	var stylesWidth = this.styles["width"];
	if(null != stylesWidth && com.inq.ui.Container.isString(stylesWidth) && "%" == this.styles.width.substr(stylesWidth.length - 1)) w = "" + (this.evaluatePosition(stylesWidth) * pw) / 100;
	if(null != stylesHeight && com.inq.ui.Container.isString(stylesHeight) && "%" == this.styles.height.substr(stylesHeight.length - 1)) h = "" + (this.evaluatePosition(stylesHeight) * ph) / 100;
	if(null == h && this._div != null) h = "" + (this._div.clientHeight);
	if(null == w && this._div != null) w = "" + (this._div.clientWidth);
	if(this.styles.left != null) {
		this._style += "left:" + this.evaluatePosition(this.styles.left) + "px;";
	}
	if(this.styles.right != null) {
		this._style += "right:" + this.evaluatePosition(this.styles.right) + "px;";
	}
	if(this.styles.top != null) {
		this._style += "top:" + this.evaluatePosition(this.styles.top) + "px;";
	}
	if(this.styles.bottom != null) {
		this._style += "bottom:" + this.evaluatePosition(this.styles.bottom) + "px;";
	}
	if(this.styles["alpha"] != null) this._style += "filter:alpha(opacity=" + this.styles["alpha"] + ");-moz-opacity:0." + this.styles["alpha"] + ";-khtml-opacity: 0." + this.styles["alpha"] + ";opacity: 0." + this.styles["alpha"] + ";";
	if(this.styles.cursor != null) this._style += "cursor: " + this.styles.cursor + ";";
	if(h != null && h != "0") this._style += "height: " + h + "px;";
	if(w != null && w != "0") this._style += "width: " + w + "px;";
	if(this.styles.borderStyle != null) this._style += "border-style: " + this.styles.borderStyle + ";";
	if(this.styles.borderThickness != null) this._style += "border-width: " + this.styles.borderThickness + "px;";
	if(this.styles.borderColor != null) this._style += "border-color: " + this.styles.borderColor + ";";
	if(this.styles["border-color"] != null) this._style += "border-color: " + this.styles["border-color"] + ";";
	if(this.styles["border-thickness"] != null) this._style += "border-width: " + this.styles["border-thickness"] + "px;";
	if(this.styles["border-thickness-left"] != null) this._style += "border-left-width: " + this.styles["border-thickness-left"] + "px;";
	if(this.styles["border-thickness-right"] != null) this._style += "border-right-width: " + this.styles["border-thickness-right"] + "px;";
	if(this.styles["border-thickness-top"] != null) this._style += "border-top-width: " + this.styles["border-thickness-top"] + "px;";
	if(this.styles["border-thickness-bottom"] != null) this._style += "border-bottom-width: " + this.styles["border-thickness-bottom"] + "px;";
	if(this.styles["border-style"] != null) this._style += "border-style: " + this.styles["border-style"] + ";";
	if(this.styles.color != null) this._style += "color: " + this.styles.color + ";";
	if(this.styles.fontFamily != null) this._style += " font-family: " + this.styles.fontFamily + ";";
	if(this.styles.fontSize != null) this._style += " font-size: " + this.styles.fontSize + "pt;";
	if(this.styles.textAlign != null) this._style += "text-align:" + this.styles.textAlign + ";";
	if(this.styles.verticalAlign != null) this._style += "vertical-align:" + this.styles.verticalAlign + ";";
	this._style += ((this.styles.visible == "true")?" display: block;":"display: none;");
	if(this.styles["visibility"] == "collapse") {
		this._style += "height:0px;width:0px;display:none;visibility:collapse";
		return;
	}
	if(this.styles.backgroundGradientColors != null) {
		var bc = this.styles.backgroundGradientColors.substr(1,this.styles.backgroundGradientColors.length - 2);
		var bca = bc.split(",");
		this._style += "background-color: " + bca[0] + ";";
	}
	else if(this.styles.backgroundColor != null) {
		this._style += "background-color: " + this.styles.backgroundColor + ";";
	}
	if(this.styles.backgroundImage != null) {
		if(this.styles.backgroundSize == "100%") {
			if(h != null && h.length > 0 && h.indexOf("%") == -1) h += "px";
			if(w != null && w.length > 0 && w.indexOf("%") == -1) w += "px";
			if(w != null) this._bgi.style.width = w;
			if(h != null) this._bgi.style.height = h;
		}
		else {
			if(this._bgi) this._bgi.style.width = this._bgi.style.height = "0px";
			this._style += " background-image:url('" + this.styles.backgroundImage + "')";
		}
	}
	if((this._div.id == "inqTitleBar" || this._div.id == "inqDivResizeCorner") && com.inq.flash.client.chatskins.SkinControl.getIsPersistentChat()) {
		this._style = " display: none;";
	}
}
com.inq.ui.Html.prototype._getText = function() {
	return this._div.innerHTML;
}
com.inq.ui.Html.prototype._setStyle = function(style) {
	this._style = style;
	return this._style;
}
com.inq.ui.Html.prototype._setText = function(text) {
	this._div.innerHTML = text;
	return text;
}
com.inq.ui.Html.prototype.applyStyles = function() {
	com.inq.ui.Container.prototype.applyStyle.apply(this,[]);
}
com.inq.ui.Html.prototype.removeFromBody = function() {
	var p = this._div.parentNode;
	if(p != null) {
		p.removeChild(this._div);
	}
}
com.inq.ui.Html.prototype.setID = function(val) {
	com.inq.ui.Container.prototype.setID.apply(this,[val]);
	com.inq.ui.ClientBody.registerElement(this);
}
com.inq.ui.Html.prototype.setVisible = function(val) {
	try {
		this._visible = !("false" == val || null == val || false == val);
		this.styles.visible = ((this._visible)?"true":"false");
		this._div.style.display = ((this._visible)?"":"none");
	}
	catch( $e172 ) {
		{
			var e = $e172;
			null;
		}
	}
}
com.inq.ui.Html.prototype.style = null;
com.inq.ui.Html.prototype.text = null;
com.inq.ui.Html.prototype.__class__ = com.inq.ui.Html;
com.inq.flash.client.control.messagehandlers.ErrorHandler = function(p) { if( p === $_ ) return; {
	com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.apply(this,[com.inq.flash.client.data.MessageFields.TYPE_ERROR]);
}}
com.inq.flash.client.control.messagehandlers.ErrorHandler.__name__ = ["com","inq","flash","client","control","messagehandlers","ErrorHandler"];
com.inq.flash.client.control.messagehandlers.ErrorHandler.__super__ = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler;
for(var k in com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype ) com.inq.flash.client.control.messagehandlers.ErrorHandler.prototype[k] = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype[k];
com.inq.flash.client.control.messagehandlers.ErrorHandler.prototype.processMessage = function(message) {
	haxe.Log.trace("MessageHandler: " + message.getProperty(com.inq.flash.client.data.MessageFields.KEY_ERROR_MESSAGE),{ fileName : "ErrorHandler.hx", lineNumber : 15, className : "com.inq.flash.client.control.messagehandlers.ErrorHandler", methodName : "processMessage"});
}
com.inq.flash.client.control.messagehandlers.ErrorHandler.prototype.__class__ = com.inq.flash.client.control.messagehandlers.ErrorHandler;
com.inq.flash.client.control.messagehandlers.ChatNeedWaitMessageHandler = function(p) { if( p === $_ ) return; {
	com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.apply(this,[com.inq.flash.client.data.MessageFields.TYPE_CHAT_WAIT]);
}}
com.inq.flash.client.control.messagehandlers.ChatNeedWaitMessageHandler.__name__ = ["com","inq","flash","client","control","messagehandlers","ChatNeedWaitMessageHandler"];
com.inq.flash.client.control.messagehandlers.ChatNeedWaitMessageHandler.__super__ = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler;
for(var k in com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype ) com.inq.flash.client.control.messagehandlers.ChatNeedWaitMessageHandler.prototype[k] = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype[k];
com.inq.flash.client.control.messagehandlers.ChatNeedWaitMessageHandler.prototype.processMessage = function(message) {
	this.getController().setQueueMessages(true);
}
com.inq.flash.client.control.messagehandlers.ChatNeedWaitMessageHandler.prototype.__class__ = com.inq.flash.client.control.messagehandlers.ChatNeedWaitMessageHandler;
com.inq.flash.client.control.messagehandlers.ChatAuthorizedMessageHandler = function(p) { if( p === $_ ) return; {
	com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.apply(this,[com.inq.flash.client.data.MessageFields.TYPE_CHAT_AUTHORIZED]);
}}
com.inq.flash.client.control.messagehandlers.ChatAuthorizedMessageHandler.__name__ = ["com","inq","flash","client","control","messagehandlers","ChatAuthorizedMessageHandler"];
com.inq.flash.client.control.messagehandlers.ChatAuthorizedMessageHandler.__super__ = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler;
for(var k in com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype ) com.inq.flash.client.control.messagehandlers.ChatAuthorizedMessageHandler.prototype[k] = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype[k];
com.inq.flash.client.control.messagehandlers.ChatAuthorizedMessageHandler.prototype.processMessage = function(message) {
	this.getController().sendFirstQueuedMessage();
	this.getController().setQueueMessages(false);
}
com.inq.flash.client.control.messagehandlers.ChatAuthorizedMessageHandler.prototype.__class__ = com.inq.flash.client.control.messagehandlers.ChatAuthorizedMessageHandler;
com.inq.flash.messagingframework.util = {}
com.inq.flash.messagingframework.util.XTrace = function() { }
com.inq.flash.messagingframework.util.XTrace.__name__ = ["com","inq","flash","messagingframework","util","XTrace"];
com.inq.flash.messagingframework.util.XTrace.redirection = function() {
	haxe.Log.trace = $closure(com.inq.flash.messagingframework.util.XTrace,"sysTrace");
	return true;
}
com.inq.flash.messagingframework.util.XTrace.setRedirection = function() {
	haxe.Log.trace = $closure(com.inq.flash.messagingframework.util.XTrace,"sysTrace");
	haxe.Log.trace("",{ fileName : "XTrace.hx", lineNumber : 34, className : "com.inq.flash.messagingframework.util.XTrace", methodName : "setRedirection"});
}
com.inq.flash.messagingframework.util.XTrace.sysTrace = function(v,inf) {
	var txt = ("[" + inf.fileName + ":" + inf.lineNumber + " " + inf.methodName + "] " + v);
}
com.inq.flash.messagingframework.util.XTrace.StackTrace = function(err,hdr) {
	if(hdr == null) hdr = "WARNING:";
	var st = err.getStackTrace();
	var erMsg = err.message;
	var errString = err.toString();
	haxe.Log.trace(hdr + " " + st,{ fileName : "XTrace.hx", lineNumber : 133, className : "com.inq.flash.messagingframework.util.XTrace", methodName : "StackTrace"});
}
com.inq.flash.messagingframework.util.XTrace.prototype.__class__ = com.inq.flash.messagingframework.util.XTrace;
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler = function(commaDelimitedHostStr,_chatID,_params) { if( commaDelimitedHostStr === $_ ) return; {
	this.msgCount = 0;
	this.params = _params;
	this.bFirstMsg = true;
	this.connected = false;
	this.chatRouterHosts = new Array();
	this.processMessageQueue = new Array();
	this.getMsgLoader = new com.inq.net.URLLoader();
	this.getMsgPreLoader = new com.inq.net.URLLoader();
	this.getMsgCntLoader = new com.inq.net.URLLoader();
	this.stopListening = this.forceDisconnected = false;
	this.listeningForMessages = 0;
	this.firstConnectVerified = false;
	this.automatonDefered = new Array();
	this.listeningForMessagesTimer = null;
	this.setChatID(_chatID);
	var hosts = commaDelimitedHostStr.split(",");
	var i = 0;
	while(i < hosts.length) {
		this.chatRouterHosts[this.chatRouterHosts.length] = hosts[i];
		i++;
	}
	this.getMsgLoader.addEventListener(com.inq.events.IOErrorEvent.IO_ERROR,$closure(this,"getMessageFailed"));
	this.getMsgLoader.addEventListener(com.inq.events.IOErrorEvent.NETWORK_ERROR,$closure(this,"getMessageFailed"));
	this.getMsgLoader.addEventListener(com.inq.events.SecurityErrorEvent.SECURITY_ERROR,$closure(this,"getRequestSecurityError"));
	this.getMsgLoader.addEventListener(com.inq.events.HTTPStatusEvent.HTTP_STATUS,$closure(this,"getMessageHTTPStatus"));
	this.useClientProtocol = ((null != Application.application.skinConfig["useClientProtocol"])?Application.application.skinConfig["useClientProtocol"]:false);
}}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.__name__ = ["com","inq","flash","messagingframework","connectionhandling","HTTPConnectionHandler"];
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.ackPersistentLoader = null;
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.acknowledgeChatActive = function(chatID) {
	var putMsgURL = this.getSelectedHost() + "/chatrouter/chat/ackChatActive" + "?chatId=" + this.chatIDForGetMsg + "&rand=" + Math.random();
	var putMsgRequest = new com.inq.net.URLRequest(putMsgURL);
	try {
		haxe.Log.trace("in HTTP sendMessage, about to request put: " + putMsgURL,{ fileName : "HTTPConnectionHandler.hx", lineNumber : 132, className : "com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler", methodName : "acknowledgeChatActive"});
		var putMsgLoader = new com.inq.net.URLLoader();
		putMsgLoader.load(putMsgRequest);
	}
	catch( $e173 ) {
		if( js.Boot.__instanceof($e173,Error) ) {
			var e = $e173;
			{
				haxe.Log.trace("" + e,{ fileName : "HTTPConnectionHandler.hx", lineNumber : 137, className : "com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler", methodName : "acknowledgeChatActive", customParams : ["error"]});
			}
		} else throw($e173);
	}
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.acknowledgePersistentActive = function(chatID,protoDomain,clientProtoDomain,needNewOpener,messageCount) {
	var newLoc = "";
	var putMsgURL = this.getSelectedHost() + "/chatrouter/chat/ackPersistentActive.js" + "?chatId=" + this.chatIDForGetMsg + "&op=" + needNewOpener + "&pd=" + protoDomain + "&r=" + Math.round(123456789.0 * Math.random());
	if(protoDomain != clientProtoDomain) {
		com.inq.flash.client.chatskins.SkinControl.noUnload();
		newLoc = (window.parent.location.href);
		newLoc = newLoc.split(protoDomain).join(clientProtoDomain);
		newLoc = newLoc.split("#")[0];
		newLoc += "#msgCnt=" + (Std.parseInt(messageCount));
		putMsgURL += "&xfr=" + StringTools.urlEncode(newLoc);
	}
	var ackPersistentRequest = new com.inq.net.URLRequest(putMsgURL);
	try {
		this.ackPersistentLoader = new com.inq.net.URLLoader();
		this.ackPersistentLoader.addEventListener(com.inq.events.Event.COMPLETE,function(event) {
			null;
		});
		this.ackPersistentLoader.load(ackPersistentRequest);
	}
	catch( $e174 ) {
		if( js.Boot.__instanceof($e174,Error) ) {
			var e = $e174;
			{
				haxe.Log.trace("" + e,{ fileName : "HTTPConnectionHandler.hx", lineNumber : 197, className : "com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler", methodName : "acknowledgePersistentActive", customParams : ["error"]});
			}
		} else throw($e174);
	}
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.applicationConnectionEventHandler = null;
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.automatonDefered = null;
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.bFirstMsg = null;
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.chatIDForGetMsg = null;
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.chatRouterHosts = null;
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.connect = function() {
	haxe.Log.trace("in HTTP connect()",{ fileName : "HTTPConnectionHandler.hx", lineNumber : 321, className : "com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler", methodName : "connect"});
	var randomNumber = Math.random();
	var randomInt = Math.floor(randomNumber * 10);
	var hostsAvailable = this.chatRouterHosts.length;
	var hostToConnectTo = randomInt % (hostsAvailable);
	this.selectedHost = this.getSelectedHost();
	this.iMsgRereadLmt = com.inq.flash.client.control.PersistenceManager.GetValue("msgcnt",0);
	if(com.inq.flash.client.chatskins.SkinControl.getIsPersistentChat()) {
		if(this.iMsgRereadLmt < com.inq.flash.client.chatskins.SkinControl.msgcntAtEntry) this.iMsgRereadLmt = com.inq.flash.client.chatskins.SkinControl.msgcntAtEntry;
	}
	this.iMsgRereadCnt = 0;
	if(this.iMsgRereadLmt > 0) {
		this.getMessages();
	}
	else this.establishConnectionRequest();
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.connectWaitTimer = null;
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.connected = null;
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.connectionComplete = function(event) {
	if(event == null) {
		if(!this.connected && !this.forceDisconnected) {
			this.connected = true;
			this.framework.connectionSuccesful(this);
			this.applicationConnectionEventHandler.connectionSuccessful();
		}
		return;
	}
	var msgData = event.target.data;
	if(!this.connected && msgData == "OK") {
		msgData = "CHAT_REQUEST_NEEDED";
	}
	if(msgData == "CHAT_REQUEST_NEEDED") {
		if(!this.connected && !this.forceDisconnected) {
			this.connected = true;
			this.framework.connectionSuccesful(this);
			this.applicationConnectionEventHandler.connectionSuccessful();
		}
	}
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.disable = function() {
	haxe.Log.trace("disable(): forceDisconnected=true",{ fileName : "HTTPConnectionHandler.hx", lineNumber : 98, className : "com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler", methodName : "disable"});
	this.forceDisconnected = true;
	this.stopListening = true;
	var scripts = window.document.body.getElementsByTagName("SCR" + "IPT");
	if(scripts != null && scripts.length > 0) {
		var six = scripts.length - 1;
		while(six >= 0) {
			var scrpt = scripts[six--];
			try {
				if(scrpt.src.indexOf("/getMessages.js?") >= 0 || scrpt.src.indexOf("/chatrouter/chat/sendMsg?") >= 0) {
					window.document.body.removeChild(scrpt);
					haxe.Log.trace("Script removed: " + scrpt.src,{ fileName : "HTTPConnectionHandler.hx", lineNumber : 110, className : "com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler", methodName : "disable"});
				}
			}
			catch( $e175 ) {
				{
					var e = $e175;
					{
						haxe.Log.trace("could not remove script: " + scrpt.src,{ fileName : "HTTPConnectionHandler.hx", lineNumber : 113, className : "com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler", methodName : "disable", customParams : ["error"]});
					}
				}
			}
		}
	}
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.disconnect = function() {
	if(this.forceDisconnected) return;
	this.connected = false;
	haxe.Log.trace("forceDisconnected = true: ",{ fileName : "HTTPConnectionHandler.hx", lineNumber : 283, className : "com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler", methodName : "disconnect"});
	this.forceDisconnected = true;
	if(this.connectWaitTimer != null) {
		this.connectWaitTimer.stop();
		this.connectWaitTimer = null;
	}
	var endChatURL = this.getSelectedHost() + "/chatrouter/chat/closeChat?rand=" + Math.random();
	if(this.chatIDForGetMsg != null && this.chatIDForGetMsg != "") endChatURL += com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.CHAT_ID_PARAM + this.chatIDForGetMsg;
	var endChatRequest = new com.inq.net.URLRequest(endChatURL);
	this.getMsgLoader.load(endChatRequest);
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.enable = function() {
	this.forceDisconnected = false;
	this.stopListening = false;
	this.listenForMessages();
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.establishConnectionRequest = function() {
	haxe.Log.trace("establishConnectionRequest(): indata ",{ fileName : "HTTPConnectionHandler.hx", lineNumber : 344, className : "com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler", methodName : "establishConnectionRequest"});
	this.listenForMessages();
	if(!this.connected && !this.forceDisconnected) {
		var tmout = 300;
		var Inq = js.Lib.window.Inq;
		if(null != Inq["v3TO"]) tmout = Inq["v3TO"];
		this.getMsgPreLoader.removeEventListener(com.inq.events.Event.COMPLETE,$closure(this,"getMsgCompletePreload"));
		this.connected = true;
		this.framework.connectionSuccesful(this);
		this.applicationConnectionEventHandler.connectionSuccessful();
	}
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.evalMsgDataJavaScript = function(msgData) {
	var func = new Function("var obj=(" + msgData + ");return obj;");
	return func();
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.failCount = null;
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.firstConnectVerified = null;
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.forceDisconnected = null;
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.framework = null;
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.getConnectionType = function() {
	return com.inq.flash.messagingframework.FlashMessagingFramework.CONNECTION_TYPE_HTTP;
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.getMessageFailed = function(event) {
	this.listeningForMessages = 0;
	this.msgCount++;
	this.listenForMessages();
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.getMessageHTTPStatus = function(event) {
	null;
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.getMessages = function() {
	var cnt = this.iMsgRereadCnt;
	var urlGetMsg;
	var limit = this.params["count"];
	limit = com.inq.flash.client.control.PersistenceManager.GetValue("msgcnt",0);
	if(com.inq.flash.client.chatskins.SkinControl.getIsPersistentChat()) {
		if(limit < com.inq.flash.client.chatskins.SkinControl.msgcntAtEntry) limit = com.inq.flash.client.chatskins.SkinControl.msgcntAtEntry;
	}
	this.iMsgRereadLmt = limit;
	var doc = js.Lib.document;
	var cacheBuster = ((cnt >= com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.MIN_CACHE_BUST || this.iMsgRereadLmt >= com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.MIN_CACHE_BUST)?"&im=gm&cb=" + Math.random():"");
	urlGetMsg = this.getSelectedHost() + "/chatrouter/chat/getMessages.js?chatId=" + this.chatIDForGetMsg + "&cnt=" + cnt + cacheBuster;
	if(cnt == 0 && this.isAutomaton()) urlGetMsg += "&tl=10";
	this.getMsgPreLoader.addEventListener(com.inq.events.Event.COMPLETE,$closure(this,"getMsgCompletePreload"));
	if(!this.stopListening) this.getMsgPreLoader.load(new com.inq.net.URLRequest(urlGetMsg));
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.getMessagingFramework = function() {
	return this.framework;
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.getMsgCntLoader = null;
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.getMsgComplete = function(event) {
	this.listeningForMessages = 0;
	if(this.listeningForMessagesTimer != null) this.listeningForMessagesTimer.stop();
	var newCount = 0;
	try {
		newCount = this.getMsgCompleteProcessing(this.getMsgLoader,false);
		if(newCount > this.msgCount) {
			var map = { msgcnt : this.msgCount = newCount, lt : Date.now().getTime()}
			com.inq.flash.client.control.PersistenceManager.SetValues(map);
		}
		else {
			this.failCount += 1;
			if(this.failCount > 4) {
				this.failCount = 0;
				var map = { msgcnt : this.msgCount += 1, lt : Date.now().getTime()}
				com.inq.flash.client.control.PersistenceManager.SetValues(map);
			}
		}
		this.routeQueuedRequests(false);
	}
	catch( $e176 ) {
		{
			var e = $e176;
			{
				haxe.Log.trace("ERROR: " + e,{ fileName : "HTTPConnectionHandler.hx", lineNumber : 756, className : "com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler", methodName : "getMsgComplete", customParams : ["error"]});
			}
		}
	}
	if(!this.forceDisconnected) {
		if(newCount > this.msgCount || newCount >= com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.MIN_CACHE_BUST) this.msgCount = newCount;
		haxe.Log.trace("msgCount = " + this.msgCount,{ fileName : "HTTPConnectionHandler.hx", lineNumber : 763, className : "com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler", methodName : "getMsgComplete"});
		if(this.isAutomaton() && this.automatonDefered.length > 0) {
			haxe.Log.trace("send defered",{ fileName : "HTTPConnectionHandler.hx", lineNumber : 765, className : "com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler", methodName : "getMsgComplete"});
			this.sendDeferedMessages();
		}
		if(com.inq.flash.client.chatskins.SkinControl.msgcntAtEntry == 0) {
			this.listenForMessages();
		}
		else {
			this.listenerDelayTimer = new com.inq.utils.Timer(100);
			this.listenerDelayTimer.run = $closure(this,"listenForMessagesAfterDelay");
		}
	}
	else haxe.Log.trace("forceDisconnect",{ fileName : "HTTPConnectionHandler.hx", lineNumber : 789, className : "com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler", methodName : "getMsgComplete"});
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.getMsgCompletePreload = function(event) {
	try {
		this.iMsgRereadCnt = this.getMsgCompleteProcessing(this.getMsgPreLoader,true);
		this.routeQueuedRequests(true);
	}
	catch( $e177 ) {
		if( js.Boot.__instanceof($e177,Error) ) {
			var e = $e177;
			{
				haxe.Log.trace("ERROR: " + e,{ fileName : "HTTPConnectionHandler.hx", lineNumber : 805, className : "com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler", methodName : "getMsgCompletePreload", customParams : ["error"]});
			}
		} else throw($e177);
	}
	if(!this.forceDisconnected) {
		if(this.iMsgRereadLmt > 0 && this.iMsgRereadCnt < this.iMsgRereadLmt && this.iMsgRereadCnt < com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.MIN_CACHE_BUST) {
			this.msgCount = this.iMsgRereadCnt;
			this.getMessages();
			return;
		}
	}
	if(this.iMsgRereadCnt > 0) this.msgCount = this.iMsgRereadCnt;
	this.establishConnectionRequest();
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.getMsgCompleteProcessing = function(loader,replay) {
	var newCount = 0;
	try {
		var msgData = loader.data;
		haxe.Log.trace("in getMsgCompleteProcessing: " + msgData,{ fileName : "HTTPConnectionHandler.hx", lineNumber : 673, className : "com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler", methodName : "getMsgCompleteProcessing"});
		var requestedChat = false;
		if(!this.connected && msgData == "OK") msgData = "CHAT_REQUEST_NEEDED";
		if(msgData == "CHAT_REQUEST_NEEDED") {
			this.firstConnectVerified = true;
			if(!this.connected && !this.forceDisconnected) {
				this.connected = true;
				this.framework.connectionSuccesful(this);
				this.applicationConnectionEventHandler.connectionSuccessful();
			}
			requestedChat = true;
		}
		var success = !requestedChat && msgData != null && msgData != "" && msgData.toLowerCase().indexOf("error:") < 0;
		if(success) {
			var json = { messages : [], count : -1}
			try {
				json = this.evalMsgDataJavaScript(msgData);
			}
			catch( $e178 ) {
				if( js.Boot.__instanceof($e178,Error) ) {
					var e = $e178;
					{
						haxe.Log.trace("Error: " + e,{ fileName : "HTTPConnectionHandler.hx", lineNumber : 695, className : "com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler", methodName : "getMsgCompleteProcessing", customParams : ["error"]});
					}
				} else throw($e178);
			}
			var messages = json.messages;
			var mix;
			newCount = json.count;
			if(replay) {
				haxe.Log.trace("Replaying " + messages.length + " message(s)",{ fileName : "HTTPConnectionHandler.hx", lineNumber : 702, className : "com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler", methodName : "getMsgCompleteProcessing"});
			}
			{
				var _g1 = 0, _g = messages.length;
				while(_g1 < _g) {
					var mix1 = _g1++;
					if(messages[mix1] == null) continue;
					var message = new com.inq.flash.messagingframework.Message();
					message.setData(messages[mix1]);
					message.addProperty(com.inq.flash.client.data.MessageFields.KEY_CLIENT_MESSAGE_COUNT,"" + newCount);
					try {
						if(!replay || this.isMsgReplayable(message)) {
							this.processMessageQueue.push(message);
						}
					}
					catch( $e179 ) {
						if( js.Boot.__instanceof($e179,Error) ) {
							var e = $e179;
							{
								haxe.Log.trace("FAILED messageRouter.processMessage: " + message.serialize(),{ fileName : "HTTPConnectionHandler.hx", lineNumber : 716, className : "com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler", methodName : "getMsgCompleteProcessing", customParams : ["error"]});
							}
						} else throw($e179);
					}
				}
			}
		}
	}
	catch( $e180 ) {
		if( js.Boot.__instanceof($e180,Error) ) {
			var e = $e180;
			{
				haxe.Log.trace("Error: " + e,{ fileName : "HTTPConnectionHandler.hx", lineNumber : 725, className : "com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler", methodName : "getMsgCompleteProcessing", customParams : ["error"]});
			}
		} else throw($e180);
	}
	return newCount;
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.getMsgLoader = null;
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.getMsgPreLoader = null;
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.getMsgReady = function(event) {
	if(null != this.connectWaitTimer) this.connectWaitTimer.stop();
	var getMsgURL;
	var cnt = Std.parseInt(this.getMsgCntLoader.data);
	var oldcnt = this.msgCount;
	if(cnt > this.msgCount) this.msgCount = cnt;
	while(oldcnt < this.msgCount) {
		var cacheBuster = ((oldcnt >= com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.MIN_CACHE_BUST || this.iMsgRereadLmt >= com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.MIN_CACHE_BUST)?"&im=gmr&cb=" + Math.random():"");
		getMsgURL = this.getSelectedHost() + "/chatrouter/chat/getMessages.js" + "?chatId=" + this.chatIDForGetMsg + "&cnt=" + oldcnt + cacheBuster;
		if(oldcnt == 0 && this.isAutomaton()) getMsgURL += "&tl=10";
		this.getMsgLoader.load(new com.inq.net.URLRequest(getMsgURL));
		++oldcnt;
	}
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.getRequestSecurityError = function(event) {
	this.getMessageFailed(null);
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.getSelectedHost = function() {
	return this.getSelectedHostSub(((this.useClientProtocol)?window.location.protocol:"https:"));
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.getSelectedHostSub = function(protocol) {
	var sUrlPieces = com.inq.flash.client.control.FlashPeer.getBaseURL().split("/");
	var sHostPieces = this.chatRouterHosts[0].split("/");
	if(this.chatRouterHosts[0].toLowerCase().indexOf("http") != 0) this.selectedHost = protocol + "//" + this.chatRouterHosts[0];
	else {
		sHostPieces[0] = protocol;
		this.selectedHost = sHostPieces.join("/");
	}
	return this.selectedHost;
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.iMsgRereadCnt = null;
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.iMsgRereadLmt = null;
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.isAutomaton = function() {
	var b = com.inq.flash.client.control.FlashVars.getFlashVars()["automatonId"];
	return (b != null);
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.isConnected = function() {
	return this.connected;
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.isMsgReplayable = function(message) {
	var msgType = message.getMessageType();
	var cid = message.getProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_ID);
	var isThisChatSession = (msgType == com.inq.flash.client.data.MessageFields.TYPE_CHAT_COMMUNICATION || msgType == com.inq.flash.client.data.MessageFields.TYPE_CHAT_COMMUNICATION_QUEUE || msgType == com.inq.flash.client.data.MessageFields.TYPE_CHAT_COMMUNICATION_OUTCOME) && cid == this.chatIDForGetMsg;
	return isThisChatSession || msgType == com.inq.flash.client.data.MessageFields.TYPE_CHATROOM_MEMBER_CONNECTED || msgType == com.inq.flash.client.data.MessageFields.TYPE_OWNER_TRANSFER_RESPONSE || msgType == com.inq.flash.client.data.MessageFields.TYPE_CHAT_COBROWSE || msgType == com.inq.flash.client.data.MessageFields.TYPE_CHAT_TRANSFER_RESPONSE || msgType == com.inq.flash.client.data.MessageFields.TYPE_CHAT_AUTOMATON_SETTING || msgType == com.inq.flash.client.data.MessageFields.TYPE_CLIENT_COMMAND || msgType == com.inq.flash.client.data.MessageFields.TYPE_CHAT_AUTOMATON_REQUEST;
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.listenForMessages = function() {
	if(this.listeningForMessages != 0) {
		var timeElapsed = (Date.now().getTime() - this.listeningForMessages);
		if(timeElapsed < com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.LISTEN_FOR_MESSAGES_TIMEOUT) {
			haxe.Log.trace("already listening: " + timeElapsed / 1000,{ fileName : "HTTPConnectionHandler.hx", lineNumber : 423, className : "com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler", methodName : "listenForMessages"});
			return;
		}
		this.listeningForMessages = 0;
		this.getMsgLoader.close();
	}
	if(this.connectWaitTimer != null) {
		this.connectWaitTimer.stop();
		this.connectWaitTimer = null;
	}
	if(!this.forceDisconnected && !this.stopListening) {
		var rand = Math.floor(Math.random() * 600851475143);
		var doc = js.Lib.document;
		var cacheBuster = ((this.msgCount >= com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.MIN_CACHE_BUST || this.iMsgRereadLmt >= com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.MIN_CACHE_BUST)?"&im=lm&cb=" + Math.random():"");
		var urlGetMsg = this.getSelectedHost() + "/chatrouter/chat/getMessages.js" + "?chatId=" + this.chatIDForGetMsg + "&cnt=" + this.msgCount + cacheBuster;
		if(this.failCount > 0) {
			urlGetMsg += "&retry=" + this.failCount;
		}
		if(this.msgCount == 0 && this.isAutomaton()) urlGetMsg += "&tl=10";
		if(this.chatIDForGetMsg == null || this.chatIDForGetMsg == "") {
			this.chatIDForGetMsg = this["chatID"];
		}
		if((this.chatIDForGetMsg != null && this.chatIDForGetMsg != "") || !this.firstConnectVerified) {
			haxe.Log.trace("loading URL " + urlGetMsg,{ fileName : "HTTPConnectionHandler.hx", lineNumber : 451, className : "com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler", methodName : "listenForMessages"});
			this.getMsgLoader.addEventListener(com.inq.events.Event.COMPLETE,$closure(this,"getMsgComplete"));
			this.getMsgLoader.load(new com.inq.net.URLRequest(urlGetMsg));
			if(this.isAutomaton()) {
				this.listeningForMessages = Date.now().getTime();
				this.listeningForMessagesTimer = new com.inq.utils.Timer(com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.LISTEN_FOR_MESSAGES_TIMEOUT);
				this.listeningForMessagesTimer.run = $closure(this,"listenForMessagesTimeout");
			}
		}
	}
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.listenForMessagesAfterDelay = function() {
	this.listenerDelayTimer.stop();
	this.listenerDelayTimer = null;
	this.listenForMessages();
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.listenForMessagesTimeout = function() {
	this.listeningForMessagesTimer.stop();
	this.listeningForMessagesTimer = null;
	if(this.getMsgLoader.bytesLoaded == 0) {
		this.getMsgLoader.close();
		this.listeningForMessages = 0;
		this.listenForMessages();
	}
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.listenerDelayTimer = null;
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.listeningForMessages = null;
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.listeningForMessagesTimer = null;
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.messageRouter = null;
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.msgCount = null;
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.params = null;
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.processMessageQueue = null;
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.putChatExitMsgComplete = function(event) {
	haxe.Log.trace("putChatExitMsgComplete",{ fileName : "HTTPConnectionHandler.hx", lineNumber : 484, className : "com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler", methodName : "putChatExitMsgComplete"});
	this.disable();
	var message = new com.inq.flash.client.data.ChatExitMessage("");
	this.messageRouter.processMessage(message);
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.putMessageFailed = function(event) {
	null;
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.putMessageHTTPStatus = function(event) {
	null;
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.putMsgComplete = function(event) {
	var msgData = event.target.data;
	if(!this.connected && msgData == "OK") {
		msgData = "CHAT_REQUEST_NEEDED";
	}
	if(msgData == "CHAT_REQUEST_NEEDED") {
		haxe.Log.trace("in putMsgComplete, got a CHAT_REQUEST_NEEDED response",{ fileName : "HTTPConnectionHandler.hx", lineNumber : 831, className : "com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler", methodName : "putMsgComplete"});
		if(!this.connected && !this.forceDisconnected) {
			this.connected = true;
			this.framework.connectionSuccesful(this);
			this.applicationConnectionEventHandler.connectionSuccessful();
		}
	}
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.putMsgLoader = null;
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.putMsgLoader2 = null;
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.putRequestSecurityError = function(event) {
	this.putMessageFailed(null);
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.rand = function() {
	return Math.round(123456789.0 * Math.random());
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.routeQueuedRequests = function(replay) {
	var msg;
	while(this.processMessageQueue.length > 0) {
		msg = this.processMessageQueue.shift();
		if(replay) {
			msg.addProperty(com.inq.flash.client.data.MessageFields.KEY_REPLAY,"1");
		}
		this.messageRouter.processMessage(msg);
	}
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.selectedHost = null;
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.sendBrowserMessage = function(message) {
	haxe.Log.trace("in HTTP sendMessage, connected? " + this.connected,{ fileName : "HTTPConnectionHandler.hx", lineNumber : 202, className : "com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler", methodName : "sendBrowserMessage"});
	var chatIDParam = com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.CHAT_ID_PARAM + this.chatIDForGetMsg;
	var chatID = this.chatIDForGetMsg;
	if(chatID != null && chatID != "") {
		chatIDParam += chatID;
		this.chatIDForGetMsg = chatID;
	}
	var putMsgURL = this.getSelectedHost() + "/chatrouter/chat/sendBrowserMsg" + "?chatId=" + this.chatIDForGetMsg + "&msg=" + StringTools.urlEncode(message.serialize());
	var putMsgRequest = new com.inq.net.URLRequest(putMsgURL);
	try {
		var putMsgLoader = new com.inq.net.URLLoader();
		putMsgLoader.addEventListener(com.inq.events.Event.COMPLETE,$closure(this,"putMsgComplete"));
		putMsgLoader.load(putMsgRequest);
	}
	catch( $e181 ) {
		if( js.Boot.__instanceof($e181,Error) ) {
			var e = $e181;
			{
				haxe.Log.trace("" + e,{ fileName : "HTTPConnectionHandler.hx", lineNumber : 220, className : "com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler", methodName : "sendBrowserMessage", customParams : ["error"]});
			}
		} else throw($e181);
	}
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.sendChatHTML = function() {
	var chatHTML = StringTools.urlEncode(document.getElementById("me").innerHTML);
	var sendHtmlURL = this.getSelectedHost() + "/chatrouter/chat/sendHTML.js" + "?chatId=" + this.chatIDForGetMsg + "&r=" + this.rand() + "&h=";
	var limit = 2000 - sendHtmlURL.length;
	if(limit > chatHTML.length) limit = chatHTML.length;
	while(chatHTML.length > 0) {
		var url = sendHtmlURL + chatHTML.substr(0,limit);
		var sendHtmlLoader;
		var sendHtmlRequest = new com.inq.net.URLRequest(url);
		sendHtmlLoader = new com.inq.net.URLLoader();
		sendHtmlLoader.addEventListener(com.inq.events.Event.COMPLETE,function(event) {
			null;
		});
		sendHtmlLoader.load(sendHtmlRequest);
		chatHTML = chatHTML.substr(limit + 1);
	}
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.sendDeferedMessages = function() {
	haxe.Log.trace("send defered messages",{ fileName : "HTTPConnectionHandler.hx", lineNumber : 495, className : "com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler", methodName : "sendDeferedMessages"});
	while(this.automatonDefered.length > 0) {
		var msg = this.automatonDefered.shift();
		if(msg != null) {
			haxe.Log.trace("send message: " + msg.getMessageType(),{ fileName : "HTTPConnectionHandler.hx", lineNumber : 499, className : "com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler", methodName : "sendDeferedMessages"});
			this.sendMessage(msg);
		}
	}
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.sendMessage = function(message) {
	haxe.Log.trace("in HTTP sendMessage '" + message.getMessageType() + "', connected? " + this.connected,{ fileName : "HTTPConnectionHandler.hx", lineNumber : 507, className : "com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler", methodName : "sendMessage"});
	if(this.isAutomaton() && this.msgCount == 0) {
		this.automatonDefered.push(message);
		return;
	}
	var chatIDParam = com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.CHAT_ID_PARAM + this.chatIDForGetMsg;
	var chatID = this.chatIDForGetMsg;
	if(chatID != null && chatID != "") {
		chatIDParam += chatID;
		this.chatIDForGetMsg = chatID;
	}
	var host = this.getSelectedHost();
	var putMsgURL = host + "/chatrouter/chat/sendMsg" + "?chatId=" + this.chatIDForGetMsg + "&msg=" + StringTools.urlEncode(message.serialize());
	var putMsgRequest = new com.inq.net.URLRequest(putMsgURL);
	try {
		var isPost = false;
		isPost = message.isPostSend();
		var putMsgLoader = new com.inq.net.URLLoader();
		putMsgLoader.addEventListener(com.inq.events.HTTPStatusEvent.HTTP_STATUS,$closure(this,"putMessageHTTPStatus"));
		putMsgLoader.addEventListener(com.inq.events.SecurityErrorEvent.SECURITY_ERROR,$closure(this,"putRequestSecurityError"));
		putMsgLoader.addEventListener(com.inq.events.IOErrorEvent.IO_ERROR,$closure(this,"putMessageFailed"));
		putMsgLoader.addEventListener(com.inq.events.IOErrorEvent.NETWORK_ERROR,$closure(this,"putMessageFailed"));
		putMsgLoader.addEventListener(com.inq.events.Event.COMPLETE,$closure(this,"putMsgComplete"));
		if(isPost) {
			putMsgLoader.post(putMsgRequest,host);
		}
		else {
			if(putMsgURL.indexOf(com.inq.flash.client.data.MessageFields.TYPE_CHAT_EXIT) != -1) {
				putMsgLoader.addEventListener(com.inq.events.Event.COMPLETE,$closure(this,"putChatExitMsgComplete"));
				this.stopListening = true;
			}
			putMsgLoader.load(putMsgRequest);
		}
	}
	catch( $e182 ) {
		if( js.Boot.__instanceof($e182,Error) ) {
			var e = $e182;
			{
				haxe.Log.trace("" + e,{ fileName : "HTTPConnectionHandler.hx", lineNumber : 565, className : "com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler", methodName : "sendMessage", customParams : ["error"]});
			}
		} else throw($e182);
	}
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.setApplicationConnectionEventHandler = function(applicationConnectionEventHandler) {
	this.applicationConnectionEventHandler = applicationConnectionEventHandler;
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.setChatID = function(chatID) {
	this.chatIDForGetMsg = chatID;
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.setHost = function(host) {
	null;
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.setMessageRouter = function(messageRouter) {
	this.messageRouter = messageRouter;
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.setMessagingFramework = function(framework) {
	this.framework = framework;
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.setParam = function(name,valu) {
	this[name] = valu;
}
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.stopListening = null;
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.useClientProtocol = null;
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.prototype.__class__ = com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler;
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.__interfaces__ = [com.inq.flash.messagingframework.connectionhandling.ConnectionHandler];
com.inq.events.ProgressEvent = function(type,bubbles,cancelable,bytesLoaded,bytesTotal) { if( type === $_ ) return; {
	com.inq.events.Event.apply(this,[type]);
}}
com.inq.events.ProgressEvent.__name__ = ["com","inq","events","ProgressEvent"];
com.inq.events.ProgressEvent.__super__ = com.inq.events.Event;
for(var k in com.inq.events.Event.prototype ) com.inq.events.ProgressEvent.prototype[k] = com.inq.events.Event.prototype[k];
com.inq.events.ProgressEvent.prototype.bytesLoaded = null;
com.inq.events.ProgressEvent.prototype.bytesTotal = null;
com.inq.events.ProgressEvent.prototype.m_bytesLoaded = null;
com.inq.events.ProgressEvent.prototype.m_bytesTotal = null;
com.inq.events.ProgressEvent.prototype.__class__ = com.inq.events.ProgressEvent;
com.inq.flash.client.data.NullMessage = function(chatID) { if( chatID === $_ ) return; {
	com.inq.flash.messagingframework.Message.apply(this,[]);
	this.setMessageType(com.inq.flash.client.data.MessageFields.TYPE_NULL);
	this.addProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_ID,chatID);
}}
com.inq.flash.client.data.NullMessage.__name__ = ["com","inq","flash","client","data","NullMessage"];
com.inq.flash.client.data.NullMessage.__super__ = com.inq.flash.messagingframework.Message;
for(var k in com.inq.flash.messagingframework.Message.prototype ) com.inq.flash.client.data.NullMessage.prototype[k] = com.inq.flash.messagingframework.Message.prototype[k];
com.inq.flash.client.data.NullMessage.prototype.__class__ = com.inq.flash.client.data.NullMessage;
com.inq.flash.messagingframework.FlashMessagingFramework = function(flashVars,applicationConnectionEventHandler) { if( flashVars === $_ ) return; {
	haxe.Log.trace("entered",{ fileName : "FlashMessagingFramework.hx", lineNumber : 60, className : "com.inq.flash.messagingframework.FlashMessagingFramework", methodName : "new"});
	this.params = [];
	this.maxConnectionRetries = 100;
	this.connectionHandlerAttemptIndex = -1;
	haxe.Log.trace("request for new MessageRouter()",{ fileName : "FlashMessagingFramework.hx", lineNumber : 64, className : "com.inq.flash.messagingframework.FlashMessagingFramework", methodName : "new"});
	this.messageRouter = new com.inq.flash.messagingframework.MessageRouter();
	haxe.Log.trace("requested  new MessageRouter()",{ fileName : "FlashMessagingFramework.hx", lineNumber : 66, className : "com.inq.flash.messagingframework.FlashMessagingFramework", methodName : "new"});
	if(flashVars["commTypes"] == null || flashVars["commTypes"] == "") {
		haxe.Log.trace("default commTypes",{ fileName : "FlashMessagingFramework.hx", lineNumber : 69, className : "com.inq.flash.messagingframework.FlashMessagingFramework", methodName : "new"});
		this.preferredConnectionTypes = com.inq.flash.messagingframework.FlashMessagingFramework.CONNECTION_TYPE_SOCKET + ", " + com.inq.flash.messagingframework.FlashMessagingFramework.CONNECTION_TYPE_HTTP;
	}
	else this.preferredConnectionTypes = flashVars["commTypes"];
	haxe.Log.trace("preferredConnectionTypes=" + this.preferredConnectionTypes,{ fileName : "FlashMessagingFramework.hx", lineNumber : 73, className : "com.inq.flash.messagingframework.FlashMessagingFramework", methodName : "new"});
	this.applicationConnectionEventHandler = applicationConnectionEventHandler;
	this.connectionHandlers = new Array();
	var connectionsAllowed = this.preferredConnectionTypes.split(",");
	haxe.Log.trace("connectionsAllowed=" + connectionsAllowed.join("\n"),{ fileName : "FlashMessagingFramework.hx", lineNumber : 79, className : "com.inq.flash.messagingframework.FlashMessagingFramework", methodName : "new"});
	{
		var _g1 = 0, _g = connectionsAllowed.length;
		while(_g1 < _g) {
			var i = _g1++;
			var maxRetries = flashVars["maxRetries"];
			if(maxRetries != null && maxRetries != "") {
				try {
					this.maxConnectionRetries = Std.parseInt(maxRetries);
				}
				catch( $e183 ) {
					if( js.Boot.__instanceof($e183,Error) ) {
						var e = $e183;
						null;
					} else throw($e183);
				}
			}
			var httpHosts = flashVars["submitURL"];
			var socketHosts = flashVars["crHost"];
			var socketPort = (((flashVars["crPort"] == null) || (flashVars["crPort"] == ""))?8080:Std.parseInt(flashVars["crPort"]));
			var connectionType = connectionsAllowed[i];
			haxe.Log.trace("connectionType=" + connectionType,{ fileName : "FlashMessagingFramework.hx", lineNumber : 97, className : "com.inq.flash.messagingframework.FlashMessagingFramework", methodName : "new"});
			connectionType = connectionType.toLowerCase();
			connectionType = com.inq.utils.StringUtil.trim(connectionType);
			var connectionHandler = null;
			var keyz = Reflect.fields(this.params);
			var ix;
			{
				var _g3 = 0, _g2 = keyz.length;
				while(_g3 < _g2) {
					var ix1 = _g3++;
					var elmt = "" + keyz[ix1];
					var val = this.params[elmt];
				}
			}
			connectionHandler = new com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler(httpHosts,flashVars["chatID"],this.params);
			this.setupConnection(connectionHandler,i);
		}
	}
	haxe.Log.trace("exit",{ fileName : "FlashMessagingFramework.hx", lineNumber : 112, className : "com.inq.flash.messagingframework.FlashMessagingFramework", methodName : "new"});
}}
com.inq.flash.messagingframework.FlashMessagingFramework.__name__ = ["com","inq","flash","messagingframework","FlashMessagingFramework"];
com.inq.flash.messagingframework.FlashMessagingFramework.prototype.abortingConnectionAttempt = function() {
	this.applicationConnectionEventHandler.allConnectionAttemptsFailed();
}
com.inq.flash.messagingframework.FlashMessagingFramework.prototype.acknowledgeChatActive = function(chatID) {
	if(this.selectedConnectionHandler != null) this.selectedConnectionHandler.acknowledgeChatActive(chatID);
}
com.inq.flash.messagingframework.FlashMessagingFramework.prototype.acknowledgePersistentActive = function(chatID,protoDomain,clientProtoDomain,needNewOpener,messageCnt) {
	if(this.selectedConnectionHandler != null) this.selectedConnectionHandler.acknowledgePersistentActive(chatID,protoDomain,clientProtoDomain,needNewOpener,messageCnt);
}
com.inq.flash.messagingframework.FlashMessagingFramework.prototype.applicationConnectionEventHandler = null;
com.inq.flash.messagingframework.FlashMessagingFramework.prototype.connect = function() {
	haxe.Log.trace("enter connect",{ fileName : "FlashMessagingFramework.hx", lineNumber : 146, className : "com.inq.flash.messagingframework.FlashMessagingFramework", methodName : "connect"});
	this.connectionHandlerAttemptIndex = -1;
	haxe.Log.trace("in FMF connect()",{ fileName : "FlashMessagingFramework.hx", lineNumber : 148, className : "com.inq.flash.messagingframework.FlashMessagingFramework", methodName : "connect"});
	if(this.selectedConnectionHandler == null) this.selectedConnectionHandler = this.connectionHandlers[0];
	if(this.selectedConnectionHandler != null) {
		haxe.Log.trace("selectedConnectionHandler.connect()",{ fileName : "FlashMessagingFramework.hx", lineNumber : 153, className : "com.inq.flash.messagingframework.FlashMessagingFramework", methodName : "connect"});
		this.selectedConnectionHandler.connect();
	}
	else {
		haxe.Log.trace("selectNextConnectionHandler()",{ fileName : "FlashMessagingFramework.hx", lineNumber : 158, className : "com.inq.flash.messagingframework.FlashMessagingFramework", methodName : "connect"});
		this.selectNextConnectionHandler();
	}
	haxe.Log.trace("exit",{ fileName : "FlashMessagingFramework.hx", lineNumber : 161, className : "com.inq.flash.messagingframework.FlashMessagingFramework", methodName : "connect"});
}
com.inq.flash.messagingframework.FlashMessagingFramework.prototype.connectionFailed = function() {
	if(this.selectedConnectionHandler != null) {
		this.connectionRetryAttempts++;
		if(this.connectionRetryAttempts < this.maxConnectionRetries) return this.applicationConnectionEventHandler.connectionFailedNeedRetryRequest(this.connectionRetryAttempts,this.maxConnectionRetries);
		else {
			this.abortingConnectionAttempt();
			return false;
		}
	}
	else if(this.applicationConnectionEventHandler.connectionFailedNeedRetryRequest(this.connectionRetryAttempts,this.maxConnectionRetries)) {
		this.selectNextConnectionHandler();
		return false;
	}
	return false;
}
com.inq.flash.messagingframework.FlashMessagingFramework.prototype.connectionHandlerAttemptIndex = null;
com.inq.flash.messagingframework.FlashMessagingFramework.prototype.connectionHandlers = null;
com.inq.flash.messagingframework.FlashMessagingFramework.prototype.connectionRetryAttempts = null;
com.inq.flash.messagingframework.FlashMessagingFramework.prototype.connectionSuccesful = function(connectionHandler) {
	this.selectedConnectionHandler = connectionHandler;
	this.connectionRetryAttempts = 0;
}
com.inq.flash.messagingframework.FlashMessagingFramework.prototype.disable = function() {
	if(this.selectedConnectionHandler != null) this.selectedConnectionHandler.disable();
}
com.inq.flash.messagingframework.FlashMessagingFramework.prototype.disconnect = function() {
	if(this.selectedConnectionHandler != null) this.selectedConnectionHandler.disconnect();
}
com.inq.flash.messagingframework.FlashMessagingFramework.prototype.enable = function() {
	if(this.selectedConnectionHandler != null) this.selectedConnectionHandler.enable();
}
com.inq.flash.messagingframework.FlashMessagingFramework.prototype.getConnectionType = function() {
	if(this.selectedConnectionHandler == null) return null;
	return this.selectedConnectionHandler.getConnectionType();
}
com.inq.flash.messagingframework.FlashMessagingFramework.prototype.httpConnectionHandler = null;
com.inq.flash.messagingframework.FlashMessagingFramework.prototype.isConnected = function() {
	if(this.selectedConnectionHandler == null) return false;
	return this.selectedConnectionHandler.isConnected();
}
com.inq.flash.messagingframework.FlashMessagingFramework.prototype.maxConnectionRetries = null;
com.inq.flash.messagingframework.FlashMessagingFramework.prototype.messageRouter = null;
com.inq.flash.messagingframework.FlashMessagingFramework.prototype.newHost = null;
com.inq.flash.messagingframework.FlashMessagingFramework.prototype.params = null;
com.inq.flash.messagingframework.FlashMessagingFramework.prototype.preferredConnectionTypes = null;
com.inq.flash.messagingframework.FlashMessagingFramework.prototype.registerMessageHandler = function(messageHandler) {
	this.messageRouter.registerMessageHandler(messageHandler);
	messageHandler.setMessagingFramework(this);
}
com.inq.flash.messagingframework.FlashMessagingFramework.prototype.selectNextConnectionHandler = function() {
	this.connectionHandlerAttemptIndex++;
	if(this.connectionHandlerAttemptIndex >= this.connectionHandlers.length) {
		this.connectionHandlerAttemptIndex = 0;
	}
	this.connectionRetryAttempts++;
	if(this.connectionRetryAttempts < this.maxConnectionRetries) {
		var connectionHandler = function($this) {
			var $r;
			var tmp = $this.connectionHandlers[$this.connectionHandlerAttemptIndex];
			$r = (Std["is"](tmp,com.inq.flash.messagingframework.connectionhandling.ConnectionHandler)?tmp:function($this) {
				var $r;
				throw "Class cast error";
				return $r;
			}($this));
			return $r;
		}(this);
		if(this.newHost != null && this.newHost != "") connectionHandler.setHost(this.newHost);
		connectionHandler.connect();
	}
	else this.abortingConnectionAttempt();
}
com.inq.flash.messagingframework.FlashMessagingFramework.prototype.selectedConnectionHandler = null;
com.inq.flash.messagingframework.FlashMessagingFramework.prototype.sendBrowserMessage = function(msg) {
	if(this.selectedConnectionHandler != null) this.selectedConnectionHandler.sendBrowserMessage(msg);
}
com.inq.flash.messagingframework.FlashMessagingFramework.prototype.sendMessage = function(message) {
	haxe.Log.trace("in FMF.sendMessage: " + message.serialize(),{ fileName : "FlashMessagingFramework.hx", lineNumber : 244, className : "com.inq.flash.messagingframework.FlashMessagingFramework", methodName : "sendMessage"});
	if(this.selectedConnectionHandler != null) this.selectedConnectionHandler.sendMessage(message);
	haxe.Log.trace("sent message",{ fileName : "FlashMessagingFramework.hx", lineNumber : 247, className : "com.inq.flash.messagingframework.FlashMessagingFramework", methodName : "sendMessage"});
}
com.inq.flash.messagingframework.FlashMessagingFramework.prototype.setChatRouterIP = function(host) {
	this.newHost = host;
}
com.inq.flash.messagingframework.FlashMessagingFramework.prototype.setParam = function(field,value) {
	if(null != this.selectedConnectionHandler) this.selectedConnectionHandler.setParam(field,value);
	else {
		this.params[field] = value;
	}
}
com.inq.flash.messagingframework.FlashMessagingFramework.prototype.setupConnection = function(connectionHandler,index) {
	haxe.Log.trace("enter",{ fileName : "FlashMessagingFramework.hx", lineNumber : 130, className : "com.inq.flash.messagingframework.FlashMessagingFramework", methodName : "setupConnection"});
	connectionHandler.setApplicationConnectionEventHandler(this.applicationConnectionEventHandler);
	connectionHandler.setMessageRouter(this.messageRouter);
	connectionHandler.setMessagingFramework(this);
	this.connectionHandlers[index] = connectionHandler;
	haxe.Log.trace("exit: " + this.connectionHandlers.length,{ fileName : "FlashMessagingFramework.hx", lineNumber : 136, className : "com.inq.flash.messagingframework.FlashMessagingFramework", methodName : "setupConnection"});
}
com.inq.flash.messagingframework.FlashMessagingFramework.prototype.__class__ = com.inq.flash.messagingframework.FlashMessagingFramework;
com.inq.flash.client.control.messagehandlers.NeedWaitHandler = function(p) { if( p === $_ ) return; {
	com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.apply(this,[com.inq.flash.client.data.MessageFields.TYPE_CHAT_NEED_WAIT]);
	haxe.Log.trace("NeedWaitHandler.Constructor",{ fileName : "NeedWaitHandler.hx", lineNumber : 102, className : "com.inq.flash.client.control.messagehandlers.NeedWaitHandler", methodName : "new"});
	com.inq.flash.client.control.messagehandlers.NeedWaitHandler.cntMessage = -1;
	this.needwaitMessageFirstDefault = ((null == Application.application.skinConfig["needwaitMessageFirstDefault"])?com.inq.flash.client.control.messagehandlers.NeedWaitHandler.NEED_WAIT_MESSAGE_FIRST_DEFAULT:Application.application.skinConfig["needwaitMessageFirstDefault"]);
	this.needwaitMessageDefault = ((null == Application.application.skinConfig["needwaitMessageDefault"])?com.inq.flash.client.control.messagehandlers.NeedWaitHandler.NEED_WAIT_MESSAGE_DEFAULT:Application.application.skinConfig["needwaitMessageDefault"]);
	this.needwaitMessageNoAgentAvailable = ((null == Application.application.skinConfig["needwaitMessageNoAgentAvailable"])?com.inq.flash.client.control.messagehandlers.NeedWaitHandler.NEED_WAIT_MESSAGE_DEFAULT:Application.application.skinConfig["needwaitMessageNoAgentAvailable"]);
	this.needwaitMessageFirstNoAgentAvailable = ((null == Application.application.skinConfig["needwaitMessageFirstNoAgentAvailable"])?com.inq.flash.client.control.messagehandlers.NeedWaitHandler.NEED_WAIT_MESSAGE_DEFAULT:Application.application.skinConfig["needwaitMessageFirstNoAgentAvailable"]);
	this.needwaitMessageFirst = ((null == Application.application.skinConfig["needwaitMessageFirst"])?null:Application.application.skinConfig["needwaitMessageFirst"]);
	this.needwaitMessageFirstSoon = ((null == Application.application.skinConfig["needwaitMessageFirstSoon"])?null:Application.application.skinConfig["needwaitMessageFirstSoon"]);
	this.needwaitMessageFirstMinutes = ((null == Application.application.skinConfig["needwaitMessageFirstMinutes"])?null:Application.application.skinConfig["needwaitMessageFirstMinutes"]);
	this.needwaitMessageFirstSeconds = ((null == Application.application.skinConfig["needwaitMessageFirstSeconds"])?null:Application.application.skinConfig["needwaitMessageFirstSeconds"]);
	this.needwaitMessage = ((null == Application.application.skinConfig["needwaitMessage"])?null:Application.application.skinConfig["needwaitMessage"]);
	this.needwaitMessageMinutes = ((null == Application.application.skinConfig["needwaitMessageMinutes"])?null:Application.application.skinConfig["needwaitMessageMinutes"]);
	this.needwaitMessageSeconds = ((null == Application.application.skinConfig["needwaitMessageSeconds"])?null:Application.application.skinConfig["needwaitMessageSeconds"]);
	this.needwaitMessageSoon = ((null == Application.application.skinConfig["needwaitMessageSoon"])?null:Application.application.skinConfig["needwaitMessageSoon"]);
	this.needwaitSoon = ((null == Application.application.skinConfig["needwaitSoon"])?10:Application.application.skinConfig["needwaitSoon"]);
	this.needwaitPeriod = ((null == Application.application.skinConfig["needwaitPeriod"])?null:Application.application.skinConfig["needwaitPeriod"]);
	this.needWaitSequenceMessages = ((null == Application.application.skinConfig["needWaitSequenceMessages"])?null:Application.application.skinConfig["needWaitSequenceMessages"]);
	this.processingBehavior = ((null == Application.application.skinConfig["processingBehavior"])?com.inq.flash.client.control.messagehandlers.NeedWaitHandler.LEGACY_MESSAGE_PROCESSING:Application.application.skinConfig["processingBehavior"]);
	this.isEnabled = !(this.needwaitMessageFirst == null || this.needwaitMessage == null || this.needwaitPeriod == null);
	this.needwaitThreshold = ((this.needwaitPeriod != null)?((this.needwaitPeriod * 10) - 1):10);
	if(this.processingBehavior == com.inq.flash.client.control.messagehandlers.NeedWaitHandler.SEQUENCE_MESSAGE_PROCESSING) {
		this.isEnabled = true;
		com.inq.flash.client.control.messagehandlers.NeedWaitHandler.initNeedWaitSequenceList(this.needWaitSequenceMessages);
		this.lastProcessedWaitMsg = Date.now().getTime();
	}
	haxe.Log.trace("NeedWaitHandler isEnabled = " + this.isEnabled,{ fileName : "NeedWaitHandler.hx", lineNumber : 135, className : "com.inq.flash.client.control.messagehandlers.NeedWaitHandler", methodName : "new"});
}}
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.__name__ = ["com","inq","flash","client","control","messagehandlers","NeedWaitHandler"];
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.__super__ = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler;
for(var k in com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype ) com.inq.flash.client.control.messagehandlers.NeedWaitHandler.prototype[k] = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype[k];
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.cntMessage = null;
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.needWaitSequenceList = null;
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.incrementCounter = function() {
	com.inq.flash.client.control.messagehandlers.NeedWaitHandler.cntMessage++;
}
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.initNeedWaitSequenceList = function(messages) {
	haxe.Log.trace("start initNeedWaitSequenceList function",{ fileName : "NeedWaitHandler.hx", lineNumber : 368, className : "com.inq.flash.client.control.messagehandlers.NeedWaitHandler", methodName : "initNeedWaitSequenceList"});
	var arrayMessages = messages.split("//");
	com.inq.flash.client.control.messagehandlers.NeedWaitHandler.needWaitSequenceList = new Array();
	{
		var _g = 0;
		while(_g < arrayMessages.length) {
			var message = arrayMessages[_g];
			++_g;
			var parts = message.split("|");
			haxe.Log.trace("Part s of message" + messages,{ fileName : "NeedWaitHandler.hx", lineNumber : 375, className : "com.inq.flash.client.control.messagehandlers.NeedWaitHandler", methodName : "initNeedWaitSequenceList"});
			var sequenceMessage = new com.inq.flash.client.control.messagehandlers.NeedWaitSequenceMessage();
			sequenceMessage.setNeedWaitMessage(parts[0]);
			sequenceMessage.setCountHit(Std.parseInt(parts[1]));
			sequenceMessage.setTimeShift(Std.parseFloat(parts[2]));
			com.inq.flash.client.control.messagehandlers.NeedWaitHandler.needWaitSequenceList.push(sequenceMessage);
		}
	}
}
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.prototype.isEnabled = null;
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.prototype.lastProcessedWaitMsg = null;
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.prototype.legacyMessageProcessing = function(message,agentName) {
	var queueingMsgString;
	if((++com.inq.flash.client.control.messagehandlers.NeedWaitHandler.cntMessage) == 0) {
		queueingMsgString = this.substituteWaitTime(message,this.needwaitMessageFirst,this.needwaitMessageFirstSoon,this.needwaitMessageFirstSeconds,this.needwaitMessageFirstMinutes,this.needwaitMessageFirstNoAgentAvailable,this.needwaitMessageFirstDefault);
		queueingMsgString = this.substituteTextFromMessage(queueingMsgString,this.needwaitMessageFirstDefault,com.inq.flash.client.control.messagehandlers.NeedWaitHandler.QUEUE_POSITION,message,com.inq.flash.client.data.MessageFields.KEY_CHAT_WAIT_POS);
		this.sendQueueingMsgString(agentName,queueingMsgString);
		this.lastProcessedWaitMsg = Date.now().getTime();
		return;
	}
	var now = Date.now().getTime();
	var period = (now - this.lastProcessedWaitMsg) / 1000.0;
	if(period < 3) {
		haxe.Log.trace("NeedWaitHandler: period is to short " + period,{ fileName : "NeedWaitHandler.hx", lineNumber : 296, className : "com.inq.flash.client.control.messagehandlers.NeedWaitHandler", methodName : "legacyMessageProcessing"});
	}
	else if(period >= this.needwaitThreshold) {
		haxe.Log.trace("NeedWaitHandler: message period is: " + period + " secs",{ fileName : "NeedWaitHandler.hx", lineNumber : 300, className : "com.inq.flash.client.control.messagehandlers.NeedWaitHandler", methodName : "legacyMessageProcessing"});
		queueingMsgString = this.substituteWaitTime(message,this.needwaitMessage,this.needwaitMessageSoon,this.needwaitMessageSeconds,this.needwaitMessageMinutes,this.needwaitMessageNoAgentAvailable,this.needwaitMessageDefault);
		queueingMsgString = this.substituteTextFromMessage(queueingMsgString,this.needwaitMessageDefault,com.inq.flash.client.control.messagehandlers.NeedWaitHandler.QUEUE_POSITION,message,com.inq.flash.client.data.MessageFields.KEY_CHAT_WAIT_POS);
		this.sendQueueingMsgString(agentName,queueingMsgString);
		this.lastProcessedWaitMsg = now;
		++com.inq.flash.client.control.messagehandlers.NeedWaitHandler.cntMessage;
	}
}
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.prototype.needWaitSequenceMessages = null;
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.prototype.needwaitMessage = null;
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.prototype.needwaitMessageDefault = null;
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.prototype.needwaitMessageFirst = null;
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.prototype.needwaitMessageFirstDefault = null;
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.prototype.needwaitMessageFirstMinutes = null;
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.prototype.needwaitMessageFirstNoAgentAvailable = null;
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.prototype.needwaitMessageFirstSeconds = null;
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.prototype.needwaitMessageFirstSoon = null;
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.prototype.needwaitMessageMinutes = null;
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.prototype.needwaitMessageNoAgentAvailable = null;
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.prototype.needwaitMessageSeconds = null;
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.prototype.needwaitMessageSoon = null;
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.prototype.needwaitPeriod = null;
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.prototype.needwaitSoon = null;
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.prototype.needwaitThreshold = null;
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.prototype.processMessage = function(message) {
	haxe.Log.trace("Processing message behavior: " + this.processingBehavior,{ fileName : "NeedWaitHandler.hx", lineNumber : 145, className : "com.inq.flash.client.control.messagehandlers.NeedWaitHandler", methodName : "processMessage"});
	if(!this.isEnabled) return;
	if(com.inq.flash.client.chatskins.SkinControl.getApplicationController().isConnectionAccepted()) {
		haxe.Log.trace("NeedWaitHandler: already connected",{ fileName : "NeedWaitHandler.hx", lineNumber : 148, className : "com.inq.flash.client.control.messagehandlers.NeedWaitHandler", methodName : "processMessage"});
	}
	var agentName = com.inq.flash.client.control.FlashVars.getFlashVars().agentName;
	var useAgentAlias = (Application.application.skinConfig["useAgentAlias"]?Application.application.skinConfig["useAgentAlias"]:false);
	if(useAgentAlias == true) {
		var defaultAgentAlias = (Application.application.skinConfig["defaultAgentAlias"]?((Application.application.skinConfig["defaultAgentAlias"] == ""?"&nbsp;":Application.application.skinConfig["defaultAgentAlias"])):"&nbsp;");
		agentName = defaultAgentAlias;
	}
	if(this.processingBehavior == com.inq.flash.client.control.messagehandlers.NeedWaitHandler.LEGACY_MESSAGE_PROCESSING) {
		this.legacyMessageProcessing(message,agentName);
	}
	else if(this.processingBehavior == com.inq.flash.client.control.messagehandlers.NeedWaitHandler.SEQUENCE_MESSAGE_PROCESSING) {
		this.sequenceMessageProcessing(agentName);
	}
}
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.prototype.processingBehavior = null;
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.prototype.sendQueueingMsgString = function(agentName,queueingMsgString) {
	var position = com.inq.flash.client.chatskins.SkinControl.AddTranscriptItemToChatWindow(agentName,queueingMsgString,com.inq.flash.client.chatskins.ChatTextArea.AGENT,-1);
	com.inq.flash.client.chatskins.SkinControl.getApplicationController().sendQueueingText(queueingMsgString,position,agentName);
}
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.prototype.sequenceMessageProcessing = function(agentName) {
	var queueingMsgString;
	var now = Date.now().getTime();
	var period = (now - this.lastProcessedWaitMsg) / 1000.0;
	if(period < com.inq.flash.client.control.messagehandlers.NeedWaitHandler.needWaitSequenceList[0].getTimeShift()) {
		haxe.Log.trace("NeedWaitHandler (sequenceMessageProcessing): period is to short " + period,{ fileName : "NeedWaitHandler.hx", lineNumber : 322, className : "com.inq.flash.client.control.messagehandlers.NeedWaitHandler", methodName : "sequenceMessageProcessing"});
	}
	else if(period >= com.inq.flash.client.control.messagehandlers.NeedWaitHandler.needWaitSequenceList[0].getTimeShift()) {
		haxe.Log.trace("NeedWaitHandler (sequenceMessageProcessing): message period is: " + period + " secs",{ fileName : "NeedWaitHandler.hx", lineNumber : 326, className : "com.inq.flash.client.control.messagehandlers.NeedWaitHandler", methodName : "sequenceMessageProcessing"});
		if(com.inq.flash.client.control.messagehandlers.NeedWaitHandler.needWaitSequenceList.length > 0) {
			if(com.inq.flash.client.control.messagehandlers.NeedWaitHandler.needWaitSequenceList[0].getCountHit() > 1) {
				com.inq.flash.client.control.messagehandlers.NeedWaitHandler.needWaitSequenceList[0].decrCount();
				queueingMsgString = com.inq.flash.client.control.messagehandlers.NeedWaitHandler.needWaitSequenceList[0].getNeedWaitMessage();
			}
			else if(com.inq.flash.client.control.messagehandlers.NeedWaitHandler.needWaitSequenceList[0].getCountHit() == 1) {
				queueingMsgString = com.inq.flash.client.control.messagehandlers.NeedWaitHandler.needWaitSequenceList.shift().getNeedWaitMessage();
			}
			else if(com.inq.flash.client.control.messagehandlers.NeedWaitHandler.needWaitSequenceList[0].getCountHit() == -1) {
				queueingMsgString = com.inq.flash.client.control.messagehandlers.NeedWaitHandler.needWaitSequenceList[0].getNeedWaitMessage();
			}
			else {
				queueingMsgString = com.inq.flash.client.control.messagehandlers.NeedWaitHandler.NEED_WAIT_MESSAGE_DEFAULT;
			}
			this.sendQueueingMsgString(agentName,queueingMsgString);
			this.lastProcessedWaitMsg = now;
		}
	}
}
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.prototype.substituteText = function(text,defaultText,pattern,substitute) {
	if(text.indexOf(pattern) != -1) {
		if(substitute == null) text = defaultText;
		else text = text.split(pattern).join(substitute);
	}
	return text;
}
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.prototype.substituteTextFromMessage = function(text,defaultText,pattern,message,property) {
	var substitute = message.getProperty(property);
	return this.substituteText(text,defaultText,pattern,substitute);
}
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.prototype.substituteWaitTime = function(message,waitText,waitTextSoon,waitTextSeconds,waitTextMinutes,waitTextNoAgentsAvailable,waitTextDefault) {
	var queueingMsgString = waitText;
	var waitTime = message.getProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_WAIT_EST_ASSIGN_TIME);
	if(waitTime != null) {
		var secondWaitTime;
		var milliSecondWaitTime;
		try {
			secondWaitTime = Math.floor((milliSecondWaitTime = Std.parseInt(waitTime)) / 1000);
		}
		catch( $e184 ) {
			{
				var e = $e184;
				{
					return waitTextDefault;
				}
			}
		}
		var minutes = Math.floor(secondWaitTime / 60);
		var seconds = Math.floor((secondWaitTime) % 60);
		var minutesOnly = Math.round(secondWaitTime / 60);
		var secondsOnly = Math.floor(secondWaitTime);
		if(minutes > 0 && waitTextMinutes != null) {
			queueingMsgString = this.substituteText(waitTextMinutes,waitTextDefault,com.inq.flash.client.control.messagehandlers.NeedWaitHandler.MINUTE_WAIT_TIME,"" + minutes);
			queueingMsgString = this.substituteText(queueingMsgString,waitTextDefault,com.inq.flash.client.control.messagehandlers.NeedWaitHandler.MINUTES_ONLY_WAIT_TIME,"" + minutesOnly);
			queueingMsgString = this.substituteText(queueingMsgString,waitTextDefault,com.inq.flash.client.control.messagehandlers.NeedWaitHandler.SECOND_WAIT_TIME,"" + seconds);
		}
		else if(milliSecondWaitTime == -1 && waitTextNoAgentsAvailable != null) queueingMsgString = waitTextNoAgentsAvailable;
		else if((secondWaitTime < this.needwaitSoon || milliSecondWaitTime == 0) && waitTextSoon != null) queueingMsgString = this.substituteText(waitTextSoon,waitTextDefault,com.inq.flash.client.control.messagehandlers.NeedWaitHandler.SECOND_WAIT_TIME,"" + seconds);
		else if(waitTextSeconds != null) {
			queueingMsgString = this.substituteText(waitTextSeconds,waitTextDefault,com.inq.flash.client.control.messagehandlers.NeedWaitHandler.SECOND_WAIT_TIME,"" + seconds);
			queueingMsgString = this.substituteText(queueingMsgString,waitTextDefault,com.inq.flash.client.control.messagehandlers.NeedWaitHandler.SECONDS_ONLY_WAIT_TIME,"" + secondsOnly);
		}
		else {
			queueingMsgString = this.substituteText(waitText,waitTextDefault,com.inq.flash.client.control.messagehandlers.NeedWaitHandler.SECOND_WAIT_TIME,"" + seconds);
			queueingMsgString = this.substituteText(queueingMsgString,waitTextDefault,com.inq.flash.client.control.messagehandlers.NeedWaitHandler.SECONDS_ONLY_WAIT_TIME,"" + secondsOnly);
			queueingMsgString = this.substituteText(queueingMsgString,waitTextDefault,com.inq.flash.client.control.messagehandlers.NeedWaitHandler.MINUTE_WAIT_TIME,"" + minutes);
			queueingMsgString = this.substituteText(queueingMsgString,waitTextDefault,com.inq.flash.client.control.messagehandlers.NeedWaitHandler.MINUTES_ONLY_WAIT_TIME,"" + minutesOnly);
		}
	}
	return queueingMsgString;
}
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.prototype.__class__ = com.inq.flash.client.control.messagehandlers.NeedWaitHandler;
com.inq.flash.client.control.messagehandlers.NeedWaitSequenceMessage = function(p) { if( p === $_ ) return; {
	null;
}}
com.inq.flash.client.control.messagehandlers.NeedWaitSequenceMessage.__name__ = ["com","inq","flash","client","control","messagehandlers","NeedWaitSequenceMessage"];
com.inq.flash.client.control.messagehandlers.NeedWaitSequenceMessage.prototype.countHit = null;
com.inq.flash.client.control.messagehandlers.NeedWaitSequenceMessage.prototype.decrCount = function() {
	var _g = this, _g1 = _g.getCountHit();
	_g.setCountHit(_g1 - 1);
	_g1;
}
com.inq.flash.client.control.messagehandlers.NeedWaitSequenceMessage.prototype.getCountHit = function() {
	return this.countHit;
}
com.inq.flash.client.control.messagehandlers.NeedWaitSequenceMessage.prototype.getNeedWaitMessage = function() {
	return this.needWaitMessage;
}
com.inq.flash.client.control.messagehandlers.NeedWaitSequenceMessage.prototype.getTimeShift = function() {
	return this.timeShift;
}
com.inq.flash.client.control.messagehandlers.NeedWaitSequenceMessage.prototype.incrCount = function() {
	var _g = this, _g1 = _g.getCountHit();
	_g.setCountHit(_g1 + 1);
	_g1;
}
com.inq.flash.client.control.messagehandlers.NeedWaitSequenceMessage.prototype.needWaitMessage = null;
com.inq.flash.client.control.messagehandlers.NeedWaitSequenceMessage.prototype.setCountHit = function(count) {
	return this.countHit = count;
}
com.inq.flash.client.control.messagehandlers.NeedWaitSequenceMessage.prototype.setNeedWaitMessage = function(message) {
	return this.needWaitMessage = message;
}
com.inq.flash.client.control.messagehandlers.NeedWaitSequenceMessage.prototype.setTimeShift = function(time) {
	return this.timeShift = time;
}
com.inq.flash.client.control.messagehandlers.NeedWaitSequenceMessage.prototype.timeShift = null;
com.inq.flash.client.control.messagehandlers.NeedWaitSequenceMessage.prototype.__class__ = com.inq.flash.client.control.messagehandlers.NeedWaitSequenceMessage;
com.inq.utils.Util = function() { }
com.inq.utils.Util.__name__ = ["com","inq","utils","Util"];
com.inq.utils.Util.publish = function(path,object) {
	var parts = path.split(".");
	var point = window;
	{
		var _g1 = 0, _g = parts.length;
		while(_g1 < _g) {
			var i = _g1++;
			var partName = parts[i];
			if(null == point[partName]) {
				if(i == parts.length - 1) point[partName] = object;
				else point[partName] = { }
			}
			point = point[partName];
		}
	}
}
com.inq.utils.Util.getConfig = function(attrib,def) {
	try {
		return ((Application.application[com.inq.utils.Util.configArea][attrib])?Application.application[com.inq.utils.Util.configArea][attrib]:def);
	}
	catch( $e185 ) {
		{
			var e = $e185;
			{
				return def;
			}
		}
	}
}
com.inq.utils.Util.prototype.__class__ = com.inq.utils.Util;
com.inq.flash.client.data.ChatExitMessage = function(chatID) { if( chatID === $_ ) return; {
	com.inq.flash.messagingframework.Message.apply(this,[]);
	this.setMessageType(com.inq.flash.client.data.MessageFields.TYPE_CHAT_EXIT);
	this.addProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_ID,chatID);
}}
com.inq.flash.client.data.ChatExitMessage.__name__ = ["com","inq","flash","client","data","ChatExitMessage"];
com.inq.flash.client.data.ChatExitMessage.__super__ = com.inq.flash.messagingframework.Message;
for(var k in com.inq.flash.messagingframework.Message.prototype ) com.inq.flash.client.data.ChatExitMessage.prototype[k] = com.inq.flash.messagingframework.Message.prototype[k];
com.inq.flash.client.data.ChatExitMessage.prototype.__class__ = com.inq.flash.client.data.ChatExitMessage;
Std = function() { }
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
}
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std["int"] = function(x) {
	if(x < 0) return Math.ceil(x);
	return Math.floor(x);
}
Std.parseInt = function(x) {
	var v = parseInt(x);
	if(Math.isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
Std.random = function(x) {
	return Math.floor(Math.random() * x);
}
Std.prototype.__class__ = Std;
haxe.Timer = function(time_ms) { if( time_ms === $_ ) return; {
	this.id = haxe.Timer.arr.length;
	haxe.Timer.arr[this.id] = this;
	this.timerId = window.setInterval("haxe.Timer.arr[" + this.id + "].run();",time_ms);
}}
haxe.Timer.__name__ = ["haxe","Timer"];
haxe.Timer.delay = function(f,time_ms) {
	var t = new haxe.Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	}
}
haxe.Timer.stamp = function() {
	return Date.now().getTime() / 1000;
}
haxe.Timer.prototype.id = null;
haxe.Timer.prototype.run = function() {
	null;
}
haxe.Timer.prototype.stop = function() {
	if(this.id == null) return;
	window.clearInterval(this.timerId);
	haxe.Timer.arr[this.id] = null;
	if(this.id > 100 && this.id == haxe.Timer.arr.length - 1) {
		var p = this.id - 1;
		while(p >= 0 && haxe.Timer.arr[p] == null) p--;
		haxe.Timer.arr = haxe.Timer.arr.slice(0,p + 1);
	}
	this.id = null;
}
haxe.Timer.prototype.timerId = null;
haxe.Timer.prototype.__class__ = haxe.Timer;
com.inq.flash.client.chatskins.OutgoingMessageTracker = function(msgCountThreshold,dbg) { if( msgCountThreshold === $_ ) return; {
	this.debug = ((null == dbg)?true:dbg);
	this.dbgTrace("constructor(" + msgCountThreshold + ")");
	this.interactionCount = 0;
	this._interactionThreashold = null;
}}
com.inq.flash.client.chatskins.OutgoingMessageTracker.__name__ = ["com","inq","flash","client","chatskins","OutgoingMessageTracker"];
com.inq.flash.client.chatskins.OutgoingMessageTracker.prototype._interactionThreashold = null;
com.inq.flash.client.chatskins.OutgoingMessageTracker.prototype.bumpConversationCount = function() {
	this.interactionCount++;
	this.dbgTrace("bumpConversationCount=" + this.interactionCount);
	if(this.interactionCount == this.getInteractionThreshold()) {
		this.setSaleQualification();
	}
}
com.inq.flash.client.chatskins.OutgoingMessageTracker.prototype.dbgTrace = function(msg) {
	if(this.debug) {
		haxe.Log.trace("OutgoingMessageTracker:" + msg,{ fileName : "OutgoingMessageTracker.hx", lineNumber : 35, className : "com.inq.flash.client.chatskins.OutgoingMessageTracker", methodName : "dbgTrace"});
	}
}
com.inq.flash.client.chatskins.OutgoingMessageTracker.prototype.debug = null;
com.inq.flash.client.chatskins.OutgoingMessageTracker.prototype.getInteractionThreshold = function() {
	if(null == this._interactionThreashold) this.init();
	return this._interactionThreashold;
}
com.inq.flash.client.chatskins.OutgoingMessageTracker.prototype.init = function() {
	this._interactionThreashold = com.inq.flash.client.control.FlashVars.getFlashVars().getSaleQualMessageCountThreshold;
}
com.inq.flash.client.chatskins.OutgoingMessageTracker.prototype.interactionCount = null;
com.inq.flash.client.chatskins.OutgoingMessageTracker.prototype.setSaleQualification = function() {
	this.dbgTrace("Sale Qualified at count=" + this.interactionCount);
	this.dbgTrace("Sale qualified complete.");
}
com.inq.flash.client.chatskins.OutgoingMessageTracker.prototype.__class__ = com.inq.flash.client.chatskins.OutgoingMessageTracker;
com.inq.flash.client.control.messagehandlers.ChatExitMessageHandler = function(p) { if( p === $_ ) return; {
	com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.apply(this,[com.inq.flash.client.data.MessageFields.TYPE_CHAT_EXIT]);
}}
com.inq.flash.client.control.messagehandlers.ChatExitMessageHandler.__name__ = ["com","inq","flash","client","control","messagehandlers","ChatExitMessageHandler"];
com.inq.flash.client.control.messagehandlers.ChatExitMessageHandler.__super__ = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler;
for(var k in com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype ) com.inq.flash.client.control.messagehandlers.ChatExitMessageHandler.prototype[k] = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype[k];
com.inq.flash.client.control.messagehandlers.ChatExitMessageHandler.prototype.processMessage = function(message) {
	var cid = message.getProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_ID);
	var tYLabel = message.getProperty(com.inq.flash.client.data.MessageFields.KEY_TY_LABEL);
	if(tYLabel != null && tYLabel != "undefined" && tYLabel != "null") {
		com.inq.flash.client.chatskins.SkinControl.tYImageLabel = tYLabel;
	}
	else {
		com.inq.flash.client.chatskins.SkinControl.tYImageLabel = "";
	}
	if(cid.length == 0) {
		com.inq.flash.client.chatskins.SkinControl.customerClosedChat();
	}
	else {
		com.inq.flash.client.chatskins.SkinControl.msgcntAtEntry = 0;
		this.getController().shutdown();
		this.getController().disable();
		com.inq.flash.client.control.MinimizeManager.onClose();
	}
}
com.inq.flash.client.control.messagehandlers.ChatExitMessageHandler.prototype.__class__ = com.inq.flash.client.control.messagehandlers.ChatExitMessageHandler;
com.inq.flash.client.control.messagehandlers.ChatCommunicationMessageHandler = function(p) { if( p === $_ ) return; {
	com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.apply(this,[com.inq.flash.client.data.MessageFields.TYPE_CHAT_COMMUNICATION]);
}}
com.inq.flash.client.control.messagehandlers.ChatCommunicationMessageHandler.__name__ = ["com","inq","flash","client","control","messagehandlers","ChatCommunicationMessageHandler"];
com.inq.flash.client.control.messagehandlers.ChatCommunicationMessageHandler.__super__ = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler;
for(var k in com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype ) com.inq.flash.client.control.messagehandlers.ChatCommunicationMessageHandler.prototype[k] = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype[k];
com.inq.flash.client.control.messagehandlers.ChatCommunicationMessageHandler.prototype.chat = null;
com.inq.flash.client.control.messagehandlers.ChatCommunicationMessageHandler.prototype.processMessage = function(message) {
	var agentName = message.getProperty(com.inq.flash.client.data.MessageFields.KEY_MESSAGE_AGENT_ALIAS);
	var clientName = com.inq.flash.client.control.FlashVars.getFlashVars().userName;
	var chatTextKey = (message.getMessageType() == com.inq.flash.client.data.MessageFields.TYPE_CHAT_COMMUNICATION_OUTCOME?com.inq.flash.client.data.MessageFields.KEY_CLIENT_OUTCOME_DATA:com.inq.flash.client.data.MessageFields.KEY_CHAT_DATA);
	var chatText = com.inq.flash.messagingframework.StringUtils.decodeStringFromMessage(message.getProperty(chatTextKey));
	chatText = com.inq.flash.client.chatskins.SkinControl.checkForGoToPersistentChatMsg(chatText);
	var agentId = "" + message.getProperty(com.inq.flash.client.data.MessageFields.KEY_AGENT_ID);
	if(agentName == null) agentName = com.inq.flash.client.control.FlashVars.getFlashVars().agentName;
	if(message.getMessageType() == com.inq.flash.client.data.MessageFields.TYPE_CHAT_COMMUNICATION_QUEUE) {
		agentId = message.getProperty(com.inq.flash.client.data.MessageFields.KEY_AGENT_ALIAS);
		var useAgentAlias = (Application.application.skinConfig["useAgentAlias"]?Application.application.skinConfig["useAgentAlias"]:false);
		if(useAgentAlias == true) {
			var defaultAgentAlias = (Application.application.skinConfig["defaultAgentAlias"]?((Application.application.skinConfig["defaultAgentAlias"] == ""?"&nbsp;":Application.application.skinConfig["defaultAgentAlias"])):"&nbsp;");
			agentName = defaultAgentAlias;
		}
	}
	else if((agentId == "undefined") || (agentId == "null")) agentId = null;
	var replay = null;
	replay = "" + message.getProperty(com.inq.flash.client.data.MessageFields.KEY_REPLAY);
	replay = (((replay == "undefined") || (replay == "null"))?null:replay);
	if(replay == "1" && message.getMessageType() != com.inq.flash.client.data.MessageFields.TYPE_CHAT_COMMUNICATION_QUEUE) {
		com.inq.flash.client.control.messagehandlers.NeedWaitHandler.incrementCounter();
	}
	var position = -1;
	var sPosition = message.getProperty(com.inq.flash.client.data.MessageFields.KEY_LINE_NR);
	if(null != sPosition) position = Std.parseInt(sPosition);
	if(message.getMessageType() != com.inq.flash.client.data.MessageFields.TYPE_CHAT_COMMUNICATION_OPENER && agentId != null && replay == null) {
		if(message.getMessageType() == com.inq.flash.client.data.MessageFields.TYPE_CHAT_COMMUNICATION) {
			com.inq.flash.client.control.Incrementality.onInteracted();
			com.inq.flash.client.control.Incrementality.onAgentMsg();
		}
		com.inq.flash.client.chatskins.FocusMonitor.startTitlebarFlash();
		com.inq.flash.client.control.MinimizeManager.lastAgentMessage(chatText);
		com.inq.flash.client.chatskins.SndMgr.PlaySound();
	}
	if(replay != null && agentId != null) {
		com.inq.flash.client.control.MinimizeManager.displayAgentMessageAndCount(chatText);
	}
	var senderName;
	if(message.getProperty(com.inq.flash.client.data.MessageFields.FORM_DATA) == null) {
		senderName = ((agentId != null || message.getMessageType() == com.inq.flash.client.data.MessageFields.TYPE_CHAT_COMMUNICATION_OUTCOME)?agentName:clientName);
	}
	else {
		senderName = "";
	}
	this.getController().appendReceivedText(chatText,senderName,position);
	if(message.getProperty(com.inq.flash.client.data.MessageFields.FORM_DATA) != null) {
		this.getController().updateFormFields(message.getProperty(com.inq.flash.client.data.MessageFields.FORM_DATA),message.getProperty(com.inq.flash.client.data.MessageFields.FORM_NAME),message.getProperty(com.inq.flash.client.data.MessageFields.FORM_ID));
	}
}
com.inq.flash.client.control.messagehandlers.ChatCommunicationMessageHandler.prototype.__class__ = com.inq.flash.client.control.messagehandlers.ChatCommunicationMessageHandler;
com.inq.utils.EventDataUtils = function() { }
com.inq.utils.EventDataUtils.__name__ = ["com","inq","utils","EventDataUtils"];
com.inq.utils.EventDataUtils.fromMessage = function(message) {
	var eventData = new com.inq.utils.Dictionary();
	eventData["agtFirstName"] = message.getProperty(com.inq.flash.client.data.MessageFields.KEY_EVENT_AGENT_FIRST_NAME);
	eventData["agtLastName"] = message.getProperty(com.inq.flash.client.data.MessageFields.KEY_EVENT_AGENT_LAST_NAME);
	var agentAlias = message.getProperty(com.inq.flash.client.data.MessageFields.KEY_MESSAGE_AGENT_ALIAS);
	if(agentAlias != null) {
		eventData["agentAlias"] = agentAlias;
	}
	var firstRequestedAttr = message.getProperty(com.inq.flash.client.data.MessageFields.KEY_EVENT_INITIAL_REQUEST_ATTRIBUTES);
	if(firstRequestedAttr != null) {
		eventData["firstRequestedAttr"] = com.inq.flash.messagingframework.StringUtils.decodeStringFromMessage(firstRequestedAttr).split(",").join("=");
	}
	var newRequestedAttr = message.getProperty(com.inq.flash.client.data.MessageFields.KEY_EVENT_TRANSFER_REQUEST_ATTRIBUTES);
	if(newRequestedAttr != null) {
		eventData["newRequestedAttr"] = com.inq.flash.messagingframework.StringUtils.decodeStringFromMessage(newRequestedAttr);
	}
	return eventData;
}
com.inq.utils.EventDataUtils.prototype.__class__ = com.inq.utils.EventDataUtils;
haxe.xml = {}
haxe.xml._Fast = {}
haxe.xml._Fast.NodeAccess = function(x) { if( x === $_ ) return; {
	this.__x = x;
}}
haxe.xml._Fast.NodeAccess.__name__ = ["haxe","xml","_Fast","NodeAccess"];
haxe.xml._Fast.NodeAccess.prototype.__x = null;
haxe.xml._Fast.NodeAccess.prototype.resolve = function(name) {
	var x = this.__x.elementsNamed(name).next();
	if(x == null) {
		var xname = (this.__x.nodeType == Xml.Document?"Document":this.__x.getNodeName());
		throw xname + " is missing element " + name;
	}
	return new haxe.xml.Fast(x);
}
haxe.xml._Fast.NodeAccess.prototype.__class__ = haxe.xml._Fast.NodeAccess;
haxe.xml._Fast.AttribAccess = function(x) { if( x === $_ ) return; {
	this.__x = x;
}}
haxe.xml._Fast.AttribAccess.__name__ = ["haxe","xml","_Fast","AttribAccess"];
haxe.xml._Fast.AttribAccess.prototype.__x = null;
haxe.xml._Fast.AttribAccess.prototype.resolve = function(name) {
	if(this.__x.nodeType == Xml.Document) throw "Cannot access document attribute " + name;
	var v = this.__x.get(name);
	if(v == null) throw this.__x.getNodeName() + " is missing attribute " + name;
	return v;
}
haxe.xml._Fast.AttribAccess.prototype.__class__ = haxe.xml._Fast.AttribAccess;
haxe.xml._Fast.HasAttribAccess = function(x) { if( x === $_ ) return; {
	this.__x = x;
}}
haxe.xml._Fast.HasAttribAccess.__name__ = ["haxe","xml","_Fast","HasAttribAccess"];
haxe.xml._Fast.HasAttribAccess.prototype.__x = null;
haxe.xml._Fast.HasAttribAccess.prototype.resolve = function(name) {
	if(this.__x.nodeType == Xml.Document) throw "Cannot access document attribute " + name;
	return this.__x.exists(name);
}
haxe.xml._Fast.HasAttribAccess.prototype.__class__ = haxe.xml._Fast.HasAttribAccess;
haxe.xml._Fast.HasNodeAccess = function(x) { if( x === $_ ) return; {
	this.__x = x;
}}
haxe.xml._Fast.HasNodeAccess.__name__ = ["haxe","xml","_Fast","HasNodeAccess"];
haxe.xml._Fast.HasNodeAccess.prototype.__x = null;
haxe.xml._Fast.HasNodeAccess.prototype.resolve = function(name) {
	return this.__x.elementsNamed(name).hasNext();
}
haxe.xml._Fast.HasNodeAccess.prototype.__class__ = haxe.xml._Fast.HasNodeAccess;
haxe.xml._Fast.NodeListAccess = function(x) { if( x === $_ ) return; {
	this.__x = x;
}}
haxe.xml._Fast.NodeListAccess.__name__ = ["haxe","xml","_Fast","NodeListAccess"];
haxe.xml._Fast.NodeListAccess.prototype.__x = null;
haxe.xml._Fast.NodeListAccess.prototype.resolve = function(name) {
	var l = new List();
	{ var $it186 = this.__x.elementsNamed(name);
	while( $it186.hasNext() ) { var x = $it186.next();
	l.add(new haxe.xml.Fast(x));
	}}
	return l;
}
haxe.xml._Fast.NodeListAccess.prototype.__class__ = haxe.xml._Fast.NodeListAccess;
haxe.xml.Fast = function(x) { if( x === $_ ) return; {
	if(x.nodeType != Xml.Document && x.nodeType != Xml.Element) throw "Invalid nodeType " + x.nodeType;
	this.x = x;
	this.node = new haxe.xml._Fast.NodeAccess(x);
	this.nodes = new haxe.xml._Fast.NodeListAccess(x);
	this.att = new haxe.xml._Fast.AttribAccess(x);
	this.has = new haxe.xml._Fast.HasAttribAccess(x);
	this.hasNode = new haxe.xml._Fast.HasNodeAccess(x);
}}
haxe.xml.Fast.__name__ = ["haxe","xml","Fast"];
haxe.xml.Fast.prototype.att = null;
haxe.xml.Fast.prototype.elements = null;
haxe.xml.Fast.prototype.getElements = function() {
	var it = this.x.elements();
	return { hasNext : $closure(it,"hasNext"), next : function() {
		var x = it.next();
		if(x == null) return null;
		return new haxe.xml.Fast(x);
	}}
}
haxe.xml.Fast.prototype.getInnerData = function() {
	var it = this.x.iterator();
	if(!it.hasNext()) throw this.getName() + " does not have data";
	var v = it.next();
	if(it.hasNext()) throw this.getName() + " does not only have data";
	if(v.nodeType != Xml.PCData && v.nodeType != Xml.CData) throw this.getName() + " does not have data";
	return v.getNodeValue();
}
haxe.xml.Fast.prototype.getInnerHTML = function() {
	var s = new StringBuf();
	{ var $it187 = this.x.iterator();
	while( $it187.hasNext() ) { var x = $it187.next();
	s.b[s.b.length] = x.toString();
	}}
	return s.b.join("");
}
haxe.xml.Fast.prototype.getName = function() {
	return (this.x.nodeType == Xml.Document?"Document":this.x.getNodeName());
}
haxe.xml.Fast.prototype.has = null;
haxe.xml.Fast.prototype.hasNode = null;
haxe.xml.Fast.prototype.innerData = null;
haxe.xml.Fast.prototype.innerHTML = null;
haxe.xml.Fast.prototype.name = null;
haxe.xml.Fast.prototype.node = null;
haxe.xml.Fast.prototype.nodes = null;
haxe.xml.Fast.prototype.x = null;
haxe.xml.Fast.prototype.__class__ = haxe.xml.Fast;
com.inq.net = {}
com.inq.net.URLRequest = function(url) { if( url === $_ ) return; {
	this.url = url;
}}
com.inq.net.URLRequest.__name__ = ["com","inq","net","URLRequest"];
com.inq.net.URLRequest.prototype.contentType = null;
com.inq.net.URLRequest.prototype.data = null;
com.inq.net.URLRequest.prototype.method = null;
com.inq.net.URLRequest.prototype.url = null;
com.inq.net.URLRequest.prototype.__class__ = com.inq.net.URLRequest;
com.inq.flash.client.control.XFrameWorker = function() { }
com.inq.flash.client.control.XFrameWorker.__name__ = ["com","inq","flash","client","control","XFrameWorker"];
com.inq.flash.client.control.XFrameWorker.init = function() {
	window.inqFrame.Inq["showLayer"] = $closure(com.inq.flash.client.control.XFrameWorker,"showLayer");
	window.inqFrame.Inq["hideLayer"] = $closure(com.inq.flash.client.control.XFrameWorker,"hideLayer");
	window.inqFrame.Inq["grow"] = $closure(com.inq.flash.client.control.XFrameWorker,"grow");
	window.inqFrame.Inq["shrink"] = $closure(com.inq.flash.client.control.XFrameWorker,"shrink");
	window.inqFrame.Inq["engageChat"] = $closure(com.inq.flash.client.control.XFrameWorker,"engageChat");
	var xf = com.inq.flash.client.control.PersistenceManager.GetValue("xf",{ });
	var keyz = Reflect.fields(xf);
	var layerID;
	var show;
	haxe.Log.trace("XFrameWorker.init(): restoring saved state for " + keyz.length + " layer(s).",{ fileName : "XFrameWorker.hx", lineNumber : 45, className : "com.inq.flash.client.control.XFrameWorker", methodName : "init"});
	{
		var _g1 = 0, _g = keyz.length;
		while(_g1 < _g) {
			var i = _g1++;
			layerID = keyz[i];
			show = "1" == xf[layerID];
			if(show) com.inq.flash.client.control.XFrameWorker.showLayer(layerID);
			else com.inq.flash.client.control.XFrameWorker.hideLayer(layerID);
		}
	}
	return true;
}
com.inq.flash.client.control.XFrameWorker.isLayerVisible = function(layerID) {
	var visible = false;
	if(com.inq.flash.client.chatskins.SkinControl.isInApplication(layerID)) {
		var cntr = Application.application[layerID];
		if(cntr.getStyle("visible") == "true") {
			visible = true;
		}
	}
	else {
		haxe.Log.trace("XFrameWorker.isLayerVisible('" + layerID + "', ...): layer is not in the application",{ fileName : "XFrameWorker.hx", lineNumber : 67, className : "com.inq.flash.client.control.XFrameWorker", methodName : "isLayerVisible", customParams : ["warn"]});
	}
	return visible;
}
com.inq.flash.client.control.XFrameWorker.showLayer = function(layerID,noOpeners,url,channelID,updateCookies) {
	if(updateCookies == null) updateCookies = true;
	if(noOpeners == null) noOpeners = false;
	haxe.Log.trace("XFrameWorker.showLayer(" + layerID + ", " + noOpeners + ", " + url + ", " + channelID + ", " + updateCookies + ") entered",{ fileName : "XFrameWorker.hx", lineNumber : 83, className : "com.inq.flash.client.control.XFrameWorker", methodName : "showLayer"});
	var cntr;
	var deltaHeight = 0;
	var deltaWidth = 0;
	if(com.inq.flash.client.chatskins.SkinControl.isInApplication(layerID)) {
		cntr = Application.application[layerID];
		if(null != cntr) {
			if(url != null) {
				if(Std["is"](cntr,com.inq.ui.XFrame)) {
					(cntr).setSrcWithChannelID(com.inq.flash.client.control.FlashPeer.parseXFrameUrl(url),channelID);
					(cntr).persistURL();
				}
				else {
					cntr.setSrc(url);
				}
			}
			else {
				cntr.updateSrc(channelID);
			}
			cntr.loadContent();
			if(cntr.getStyle("visibility") == "collapse") {
				var stageHeight = Std.parseInt(window.frameElement.style.height);
				var stageWidth = Std.parseInt(window.frameElement.style.width);
				try {
					deltaWidth = Std.parseInt(cntr.getStyle("ucW"));
				}
				catch( $e188 ) {
					{
						var e = $e188;
						{
							deltaWidth = 0;
						}
					}
				}
				try {
					deltaHeight = Std.parseInt(cntr.getStyle("ucH"));
				}
				catch( $e189 ) {
					{
						var e = $e189;
						{
							deltaHeight = 0;
						}
					}
				}
				if(deltaWidth == null) try {
					deltaWidth = Std.parseInt(cntr.getStyle("width"));
				}
				catch( $e190 ) {
					{
						var e = $e190;
						{
							deltaWidth = 0;
						}
					}
				}
				if(deltaHeight == null) try {
					deltaHeight = Std.parseInt(cntr.getStyle("height"));
				}
				catch( $e191 ) {
					{
						var e = $e191;
						{
							deltaWidth = 0;
						}
					}
				}
				if(deltaWidth == null) deltaWidth = 0;
				if(deltaHeight == null) deltaHeight = 0;
				cntr.setStyle("visibility","visible");
				cntr.setStyle("visible","true");
				cntr.setVisible(true);
				com.inq.flash.client.control.XFrameWorker.setPersistentState(layerID,true,updateCookies);
				Application.application.resize();
			}
			else if(cntr.getStyle("visible") == "false") {
				cntr.setStyle("visible","true");
				cntr.setVisible(true);
				com.inq.flash.client.control.XFrameWorker.setPersistentState(layerID,true,updateCookies);
			}
		}
	}
	else {
		haxe.Log.trace("XFrameWorker.showLayer('" + layerID + "', ...): layer is not in the application",{ fileName : "XFrameWorker.hx", lineNumber : 127, className : "com.inq.flash.client.control.XFrameWorker", methodName : "showLayer", customParams : ["warn"]});
	}
	if(layerID == "Chat") {
		haxe.Log.trace("XFrameWorker.showLayer: SkinControl.kickOffChat",{ fileName : "XFrameWorker.hx", lineNumber : 130, className : "com.inq.flash.client.control.XFrameWorker", methodName : "showLayer"});
		com.inq.flash.client.chatskins.SkinControl.kickOffChat(noOpeners);
		haxe.Log.trace("XFrameWorker.showLayer: SkinControl.fireMxmlHandler(onShowChat)",{ fileName : "XFrameWorker.hx", lineNumber : 132, className : "com.inq.flash.client.control.XFrameWorker", methodName : "showLayer"});
		com.inq.flash.client.chatskins.SkinControl.fireMxmlHandler("onShowChat");
	}
}
com.inq.flash.client.control.XFrameWorker.showLayerXcd = function(layerID,updateCookies) {
	com.inq.flash.client.control.XFrameWorker.showLayer(layerID,false,null,null,updateCookies);
}
com.inq.flash.client.control.XFrameWorker.fireCustomEvt = function(eventName,jsonData,dataFcn) {
	if(dataFcn != null && dataFcn == "") dataFcn = null;
	com.inq.flash.client.control.FlashPeer.fireCustomEvt(eventName,jsonData,dataFcn);
}
com.inq.flash.client.control.XFrameWorker.hideLayer = function(layerID,updateCookies) {
	if(updateCookies == null) updateCookies = true;
	haxe.Log.trace("XFrameWorker.hideLayer(" + layerID + ", " + updateCookies + ") entered",{ fileName : "XFrameWorker.hx", lineNumber : 155, className : "com.inq.flash.client.control.XFrameWorker", methodName : "hideLayer"});
	var cntr;
	if(com.inq.flash.client.chatskins.SkinControl.isInApplication(layerID)) {
		cntr = Application.application[layerID];
		var stageHeight = Std.parseInt(window.frameElement.style.height);
		var stageWidth = Std.parseInt(window.frameElement.style.width);
		cntr.initStyle("visibility","collapse");
		Application.application.resize();
		var deltaWidth = stageWidth - Std.parseInt(window.frameElement.style.width);
		var deltaHeight = stageHeight - Std.parseInt(window.frameElement.style.height);
		cntr.initStyle("ucH","" + deltaHeight);
		cntr.initStyle("ucW","" + deltaWidth);
		com.inq.flash.client.control.XFrameWorker.setPersistentState(layerID,false,updateCookies);
	}
	else {
		haxe.Log.trace("XFrameWorker.hideLayer('" + layerID + "', ...): layer is not in the application",{ fileName : "XFrameWorker.hx", lineNumber : 169, className : "com.inq.flash.client.control.XFrameWorker", methodName : "hideLayer", customParams : ["warn"]});
	}
}
com.inq.flash.client.control.XFrameWorker.hideLayerAndEndChat = function(layerID,updateCookies) {
	if(updateCookies == null) updateCookies = true;
	haxe.Log.trace("hideLayerAndEndChat entered",{ fileName : "XFrameWorker.hx", lineNumber : 175, className : "com.inq.flash.client.control.XFrameWorker", methodName : "hideLayerAndEndChat"});
	com.inq.flash.client.chatskins.SkinControl.getApplicationController().shutdown();
	if(layerID.toUpperCase() == "ROOT") null;
	else {
		com.inq.flash.client.control.XFrameWorker.hideLayer(layerID,updateCookies);
	}
}
com.inq.flash.client.control.XFrameWorker.grow = function(layerID,url,updateCookies) {
	if(updateCookies == null) updateCookies = true;
	haxe.Log.trace("XFrameWorker.grow(" + layerID + ", " + url + ", " + updateCookies + ") entered",{ fileName : "XFrameWorker.hx", lineNumber : 185, className : "com.inq.flash.client.control.XFrameWorker", methodName : "grow"});
	var cntr;
	if(com.inq.flash.client.chatskins.SkinControl.isInApplication(layerID)) {
		cntr = Application.application[layerID];
		if(url != null) {
			cntr.setSrc(url);
			if(Std["is"](cntr,com.inq.ui.XFrame)) {
				(cntr).persistURL();
			}
		}
		cntr.loadContent();
		var growDeltaX = 0;
		var growDeltaY = 0;
		if(cntr.getStyle("visibility") == "collapse") {
			cntr.setStyle("visibility","visible");
			cntr.setStyle("visible","true");
			cntr.setVisible(true);
			var st = cntr.getStyle("height");
			if(st != null && st != "") growDeltaY = cntr.getHeight();
			st = cntr.getStyle("width");
			if(st != null && st != "") growDeltaX = cntr.getWidth();
		}
		var stageHeight = com.inq.ui.Stage.getterStageHeight() + growDeltaY;
		var stageWidth = com.inq.ui.Stage.getterStageWidth() + growDeltaX;
		com.inq.flash.client.control.XFrameWorker.setPersistentState(layerID,true,updateCookies);
		com.inq.flash.client.control.XFrameWorker.ResizeStage(stageWidth,stageHeight);
		cntr.setVisible(true);
		if(layerID == "Chat") com.inq.flash.client.chatskins.SkinControl.kickOffChat();
	}
}
com.inq.flash.client.control.XFrameWorker.growXcd = function(layerID,updateCookies) {
	com.inq.flash.client.control.XFrameWorker.showLayer(layerID,null,null,null,updateCookies);
}
com.inq.flash.client.control.XFrameWorker.shrink = function(layerID,updateCookies) {
	if(updateCookies == null) updateCookies = true;
	haxe.Log.trace("XFrameWorker.shrink(" + layerID + ", " + updateCookies + ") entered",{ fileName : "XFrameWorker.hx", lineNumber : 225, className : "com.inq.flash.client.control.XFrameWorker", methodName : "shrink"});
	var cntr;
	if(com.inq.flash.client.chatskins.SkinControl.isInApplication(layerID)) {
		cntr = Application.application[layerID];
		var growDeltaX = 0;
		var growDeltaY = 0;
		if(cntr.getStyle("visibility") != "collapse") {
			var st = cntr.getStyle("height");
			if(st != null && st != "") growDeltaY = cntr.getHeight();
			st = cntr.getStyle("width");
			if(st != null && st != "") growDeltaX = cntr.getWidth();
		}
		cntr.initStyle("visible","false");
		cntr.initStyle("visibility","collapse");
		Application.application.resize();
		var stageHeight = com.inq.ui.Stage.getterStageHeight() - growDeltaY;
		var stageWidth = com.inq.ui.Stage.getterStageWidth() - growDeltaX;
		com.inq.flash.client.control.XFrameWorker.setPersistentState(layerID,false,updateCookies);
		com.inq.flash.client.control.XFrameWorker.ResizeStage(stageWidth,stageHeight);
	}
}
com.inq.flash.client.control.XFrameWorker.engageChat = function(text,clientText,agentAttrs,businessUnitID,phone) {
	com.inq.flash.client.chatskins.SkinControl.getApplicationController().engageChat(com.inq.flash.client.control.XFrameWorker.DO_NOT_DISPLAY_IN_CI + text,clientText,agentAttrs,businessUnitID,phone);
}
com.inq.flash.client.control.XFrameWorker.isDisplayInCI = function(text) {
	return (text.indexOf(com.inq.flash.client.control.XFrameWorker.DO_NOT_DISPLAY_IN_CI) < 0);
}
com.inq.flash.client.control.XFrameWorker.setPersistentState = function(id,show,updateCookies) {
	haxe.Log.trace("XFrameWorker.setPersistentState entered: layer '" + id + "' = " + show + ", updateCookies=" + updateCookies,{ fileName : "XFrameWorker.hx", lineNumber : 262, className : "com.inq.flash.client.control.XFrameWorker", methodName : "setPersistentState"});
	var xf = com.inq.flash.client.control.PersistenceManager.GetValue("xf",{ });
	xf[id] = ((show)?"1":"0");
	com.inq.flash.client.control.PersistenceManager.SetValue("xf",xf,true,updateCookies);
}
com.inq.flash.client.control.XFrameWorker.ResizeStage = function(stageWidth,stageHeight) {
	Application.ResizeStage(stageWidth,stageHeight);
	Application.application.resize();
}
com.inq.flash.client.control.XFrameWorker.syncLayer = function(layerID,cacheId,dtid) {
	var cntr;
	var deltaHeight = 0;
	var deltaWidth = 0;
	var indx;
	var map = { }
	if(com.inq.flash.client.chatskins.SkinControl.isInApplication(layerID)) {
		var name, valu, i;
		cntr = Application.application[layerID];
		if(cntr == null || cntr.src == null) return;
		indx = cntr.src.indexOf("?");
		if(indx == -1) return;
		var params = cntr.src.substr(indx + 1);
		var url = cntr.src.substr(0,indx + 1);
		var nameValuePairs = params.split("&");
		var namepair;
		{
			var _g1 = 0, _g = nameValuePairs.length;
			while(_g1 < _g) {
				var i1 = _g1++;
				var namevalue = nameValuePairs[i1];
				indx = namevalue.indexOf("=");
				if(indx != -1) {
					name = namevalue.substr(0,indx);
					valu = namevalue.substr(indx + 1);
				}
				else {
					name = namevalue;
					valu = null;
				}
				map[name] = valu;
			}
		}
		if(dtid != null) map["dtid"] = dtid;
		if(cacheId != null) map["cacheid"] = cacheId;
		var query = "";
		var keyz = Reflect.fields(map);
		{
			var _g1 = 0, _g = keyz.length;
			while(_g1 < _g) {
				var i1 = _g1++;
				name = keyz[i1];
				valu = map[name];
				if(i1 != 0) query += "&";
				if(valu != null) query += name + "=" + valu;
				else query += name;
			}
		}
		url += query;
		com.inq.flash.client.control.PersistenceManager.SetValue("xfq",query);
		cntr.setSrc(url);
		if(cntr.getVisible()) cntr.loadContent();
		else com.inq.flash.client.control.XFrameWorker.showLayer(layerID);
	}
}
com.inq.flash.client.control.XFrameWorker.onCookiesCommitted = function(handler) {
	com.inq.flash.client.control.FlashPeer.onCookiesCommitted(handler);
}
com.inq.flash.client.control.XFrameWorker.prototype.__class__ = com.inq.flash.client.control.XFrameWorker;
com.inq.flash.client.chatskins.EmailMgr = function(p) { if( p === $_ ) return; {
	null;
}}
com.inq.flash.client.chatskins.EmailMgr.__name__ = ["com","inq","flash","client","chatskins","EmailMgr"];
com.inq.flash.client.chatskins.EmailMgr._init = function() {
	var win = window;
	return true;
}
com.inq.flash.client.chatskins.EmailMgr.init = function() {
	com.inq.flash.client.chatskins.EmailMgr.emailButtonCap = Application.application["btnEmailCapture"];
	com.inq.flash.client.chatskins.EmailMgr.emailCanvasCap = Application.application["emailCapture"];
	com.inq.flash.client.chatskins.EmailMgr.emailButton = Application.application["btnEmail"];
	com.inq.flash.client.chatskins.EmailMgr.emailCanvas = Application.application["email"];
	com.inq.flash.client.chatskins.EmailMgr.chatCanvas = Application.application["chat"];
	com.inq.flash.client.chatskins.EmailMgr.tyCanvas = Application.application["thankYou"];
	if(com.inq.flash.client.chatskins.EmailMgr.emailButtonCap != null && com.inq.flash.client.chatskins.EmailMgr.emailCanvasCap != null) {
		com.inq.flash.client.chatskins.EmailMgr.setCaptureState(com.inq.flash.client.control.PersistenceManager.GetValue("emlc",0));
		if(com.inq.flash.client.chatskins.SkinControl.isInApplication("btnEmailCapture")) {
			Application.application.btnEmailCapture.addEventListener(com.inq.events.MouseEvent.CLICK,$closure(com.inq.flash.client.chatskins.EmailMgr,"showEmailCaptureCanvas"));
		}
		if(com.inq.flash.client.chatskins.SkinControl.isInApplication("btnSendEmailCapture")) {
			Application.application.btnSendEmailCapture.addEventListener(com.inq.events.MouseEvent.CLICK,$closure(com.inq.flash.client.chatskins.EmailMgr,"actionBtnCaptureSendEmail"));
		}
	}
	if(com.inq.flash.client.chatskins.EmailMgr.emailButton != null && com.inq.flash.client.chatskins.EmailMgr.emailCanvas != null) {
		com.inq.flash.client.chatskins.EmailMgr.setState(com.inq.flash.client.control.PersistenceManager.GetValue("eml",0));
		if(com.inq.flash.client.chatskins.SkinControl.isInApplication("btnEmail")) {
			Application.application.btnEmail.addEventListener(com.inq.events.MouseEvent.CLICK,$closure(com.inq.flash.client.chatskins.EmailMgr,"showEmailCanvas"));
		}
		if(com.inq.flash.client.chatskins.SkinControl.isInApplication("btnSendEmail")) {
			Application.application.btnSendEmail.addEventListener(com.inq.events.MouseEvent.CLICK,$closure(com.inq.flash.client.chatskins.EmailMgr,"actionBtnSendEmail"));
		}
	}
	return true;
}
com.inq.flash.client.chatskins.EmailMgr.showEmailCaptureCanvas = function() {
	com.inq.flash.client.chatskins.EmailMgr.setCaptureState(com.inq.flash.client.chatskins.EmailMgr.SHOW_ALL_STATE);
}
com.inq.flash.client.chatskins.EmailMgr.showEmailCanvas = function() {
	com.inq.flash.client.chatskins.EmailMgr.setState(com.inq.flash.client.chatskins.EmailMgr.SHOW_ALL_STATE);
}
com.inq.flash.client.chatskins.EmailMgr.setCaptureState = function(state) {
	if(com.inq.flash.client.chatskins.EmailMgr.emailCanvasCap != null && com.inq.flash.client.chatskins.EmailMgr.emailButtonCap != null) {
		switch(state) {
		case com.inq.flash.client.chatskins.EmailMgr.SHOW_BUTTON_STATE:{
			com.inq.flash.client.chatskins.EmailMgr.emailButtonCap.setVisible(true);
			com.inq.flash.client.chatskins.EmailMgr.emailCanvasCap.setVisible(false);
		}break;
		case com.inq.flash.client.chatskins.EmailMgr.SHOW_ALL_STATE:{
			if(!com.inq.flash.client.chatskins.EmailMgr.emailCanvasCap.getVisible()) {
				var chatHeight = 0;
				if(com.inq.flash.client.chatskins.EmailMgr.emailCanvas != null && com.inq.flash.client.chatskins.EmailMgr.emailCanvas.getVisible()) {
					chatHeight += Std.parseInt(com.inq.flash.client.chatskins.EmailMgr.emailCanvas.getStyle("top")) + com.inq.flash.client.chatskins.EmailMgr.emailCanvas.getHeight() + com.inq.flash.client.chatskins.EmailMgr.emailCanvasCap.getHeight();
					com.inq.flash.client.chatskins.EmailMgr.emailCanvasCap.setStyle("top","" + (Std.parseInt(com.inq.flash.client.chatskins.EmailMgr.emailCanvas.getStyle("top")) + com.inq.flash.client.chatskins.EmailMgr.emailCanvas.getHeight()));
				}
				else {
					chatHeight += Std.parseInt(com.inq.flash.client.chatskins.EmailMgr.emailCanvasCap.getStyle("top")) + com.inq.flash.client.chatskins.EmailMgr.emailCanvasCap.getHeight();
				}
				com.inq.flash.client.chatskins.EmailMgr.chatCanvas.setStyle("top","" + chatHeight);
				if(com.inq.flash.client.chatskins.EmailMgr.tyCanvas != null) com.inq.flash.client.chatskins.EmailMgr.tyCanvas.setStyle("top","" + chatHeight);
				com.inq.flash.client.chatskins.EmailMgr.emailButtonCap.setVisible(true);
				com.inq.flash.client.chatskins.EmailMgr.emailCanvasCap.setVisible(true);
			}
		}break;
		case com.inq.flash.client.chatskins.EmailMgr.SHOW_NONE_STATE:{
			var chatHeight = 0;
			var emailCanvasCapTop = Std.parseInt(com.inq.flash.client.chatskins.EmailMgr.emailCanvasCap.getStyle("top"));
			if(com.inq.flash.client.chatskins.EmailMgr.emailCanvas != null && com.inq.flash.client.chatskins.EmailMgr.emailCanvas.getVisible()) {
				var emailCanvasTop = Std.parseInt(com.inq.flash.client.chatskins.EmailMgr.emailCanvas.getStyle("top"));
				if(emailCanvasCapTop < emailCanvasTop) {
					com.inq.flash.client.chatskins.EmailMgr.emailCanvas.setStyle("top",emailCanvasCapTop);
					chatHeight += emailCanvasCapTop + com.inq.flash.client.chatskins.EmailMgr.emailCanvas.getHeight();
				}
				else {
					chatHeight += emailCanvasCapTop;
				}
			}
			else {
				chatHeight += emailCanvasCapTop;
			}
			com.inq.flash.client.chatskins.EmailMgr.chatCanvas.setStyle("top","" + chatHeight);
			if(com.inq.flash.client.chatskins.EmailMgr.tyCanvas != null) com.inq.flash.client.chatskins.EmailMgr.tyCanvas.setStyle("top","" + chatHeight);
			com.inq.flash.client.chatskins.EmailMgr.emailButtonCap.setVisible(false);
			com.inq.flash.client.chatskins.EmailMgr.emailCanvasCap.setVisible(false);
		}break;
		default:{
			com.inq.flash.client.chatskins.EmailMgr.emailButtonCap.setVisible(true);
			com.inq.flash.client.chatskins.EmailMgr.emailCanvasCap.setVisible(false);
		}break;
		}
		com.inq.flash.client.control.PersistenceManager.SetValue("emlc",state);
	}
}
com.inq.flash.client.chatskins.EmailMgr.setState = function(state) {
	if(com.inq.flash.client.chatskins.EmailMgr.emailCanvas != null && com.inq.flash.client.chatskins.EmailMgr.emailButton != null) {
		switch(state) {
		case com.inq.flash.client.chatskins.EmailMgr.SHOW_BUTTON_STATE:{
			com.inq.flash.client.chatskins.EmailMgr.emailButton.setVisible(true);
			com.inq.flash.client.chatskins.EmailMgr.emailCanvas.setVisible(false);
		}break;
		case com.inq.flash.client.chatskins.EmailMgr.SHOW_ALL_STATE:{
			if(!com.inq.flash.client.chatskins.EmailMgr.emailCanvas.getVisible()) {
				var chatHeight = 0;
				if(com.inq.flash.client.chatskins.EmailMgr.emailCanvasCap != null && com.inq.flash.client.chatskins.EmailMgr.emailCanvasCap.getVisible()) {
					chatHeight += Std.parseInt(com.inq.flash.client.chatskins.EmailMgr.emailCanvasCap.getStyle("top")) + com.inq.flash.client.chatskins.EmailMgr.emailCanvas.getHeight() + com.inq.flash.client.chatskins.EmailMgr.emailCanvasCap.getHeight();
					com.inq.flash.client.chatskins.EmailMgr.emailCanvas.setStyle("top","" + (Std.parseInt(com.inq.flash.client.chatskins.EmailMgr.emailCanvasCap.getStyle("top")) + com.inq.flash.client.chatskins.EmailMgr.emailCanvasCap.getHeight()));
				}
				else {
					chatHeight += Std.parseInt(com.inq.flash.client.chatskins.EmailMgr.emailCanvas.getStyle("top")) + com.inq.flash.client.chatskins.EmailMgr.emailCanvas.getHeight();
				}
				com.inq.flash.client.chatskins.EmailMgr.chatCanvas.setStyle("top","" + chatHeight);
				if(com.inq.flash.client.chatskins.EmailMgr.tyCanvas != null) com.inq.flash.client.chatskins.EmailMgr.tyCanvas.setStyle("top","" + chatHeight);
				com.inq.flash.client.chatskins.EmailMgr.emailButton.setVisible(true);
				com.inq.flash.client.chatskins.EmailMgr.emailCanvas.setVisible(true);
			}
		}break;
		case com.inq.flash.client.chatskins.EmailMgr.SHOW_NONE_STATE:{
			var chatHeight = 0;
			var emailCanvasTop = Std.parseInt(com.inq.flash.client.chatskins.EmailMgr.emailCanvas.getStyle("top"));
			if(com.inq.flash.client.chatskins.EmailMgr.emailCanvasCap != null && com.inq.flash.client.chatskins.EmailMgr.emailCanvasCap.getVisible()) {
				var emailCanvasCapTop = Std.parseInt(com.inq.flash.client.chatskins.EmailMgr.emailCanvasCap.getStyle("top"));
				if(emailCanvasTop < emailCanvasCapTop) {
					com.inq.flash.client.chatskins.EmailMgr.emailCanvasCap.setStyle("top",emailCanvasTop);
					chatHeight += emailCanvasTop + com.inq.flash.client.chatskins.EmailMgr.emailCanvasCap.getHeight();
				}
				else {
					chatHeight += emailCanvasTop;
				}
			}
			else {
				chatHeight += emailCanvasTop;
			}
			com.inq.flash.client.chatskins.EmailMgr.chatCanvas.setStyle("top","" + chatHeight);
			if(com.inq.flash.client.chatskins.EmailMgr.tyCanvas != null) com.inq.flash.client.chatskins.EmailMgr.tyCanvas.setStyle("top","" + chatHeight);
			com.inq.flash.client.chatskins.EmailMgr.emailButton.setVisible(false);
			com.inq.flash.client.chatskins.EmailMgr.emailCanvas.setVisible(false);
		}break;
		default:{
			com.inq.flash.client.chatskins.EmailMgr.emailButton.setVisible(true);
			com.inq.flash.client.chatskins.EmailMgr.emailCanvas.setVisible(false);
		}break;
		}
		com.inq.flash.client.control.PersistenceManager.SetValue("eml",state);
	}
}
com.inq.flash.client.chatskins.EmailMgr.actionBtnCaptureSendEmail = function() {
	if(com.inq.flash.client.chatskins.SkinControl.isInApplication("emailInputCapture")) {
		var emailInputCapture = Application.application.emailInputCapture;
		var emailAddressCapture = emailInputCapture._getInput();
		try {
			emailAddressCapture = StringTools.trim(emailAddressCapture);
			if(emailAddressCapture.length != 0) {
				com.inq.flash.client.chatskins.SkinControl.runJavaScript("Inq.FlashPeer.captureEmailAddress(\"" + emailAddressCapture + "\");",true);
				com.inq.flash.client.chatskins.EmailMgr.setCaptureState(com.inq.flash.client.chatskins.EmailMgr.SHOW_NONE_STATE);
			}
		}
		catch( $e192 ) {
			{
				var e = $e192;
				null;
			}
		}
	}
}
com.inq.flash.client.chatskins.EmailMgr.actionBtnSendEmail = function() {
	if(com.inq.flash.client.chatskins.SkinControl.isInApplication("emailInput")) {
		var emailInput = Application.application.emailInput;
		var emailAddress = emailInput._getInput();
		try {
			emailAddress = StringTools.trim(emailAddress);
			if(emailAddress.length != 0) {
				com.inq.flash.client.control.FlashPeer.requestTranscript(emailAddress);
				com.inq.flash.client.chatskins.EmailMgr.setState(com.inq.flash.client.chatskins.EmailMgr.SHOW_NONE_STATE);
			}
		}
		catch( $e193 ) {
			{
				var e = $e193;
				null;
			}
		}
	}
}
com.inq.flash.client.chatskins.EmailMgr.prototype.__class__ = com.inq.flash.client.chatskins.EmailMgr;
com.inq.flash.client.chatskins.XTrace = function() { }
com.inq.flash.client.chatskins.XTrace.__name__ = ["com","inq","flash","client","chatskins","XTrace"];
com.inq.flash.client.chatskins.XTrace.redirection = function() {
	haxe.Log.trace = $closure(com.inq.flash.client.chatskins.XTrace,"sysTrace");
	return true;
}
com.inq.flash.client.chatskins.XTrace.setRedirection = function() {
	haxe.Log.trace = $closure(com.inq.flash.client.chatskins.XTrace,"sysTrace");
	haxe.Log.trace("",{ fileName : "XTrace.hx", lineNumber : 34, className : "com.inq.flash.client.chatskins.XTrace", methodName : "setRedirection"});
}
com.inq.flash.client.chatskins.XTrace.sysTrace = function(v,inf) {
	var txt = ("[" + inf.fileName + ":" + inf.lineNumber + " " + inf.methodName + "] " + v);
}
com.inq.flash.client.chatskins.XTrace.StackTrace = function(err,hdr) {
	if(hdr == null) hdr = "WARNING:";
	var st = "";
	var erMsg = err.message;
	var errString = err.toString();
	haxe.Log.trace(hdr + " " + st,{ fileName : "XTrace.hx", lineNumber : 137, className : "com.inq.flash.client.chatskins.XTrace", methodName : "StackTrace"});
}
com.inq.flash.client.chatskins.XTrace.prototype.__class__ = com.inq.flash.client.chatskins.XTrace;
com.inq.ui.Canvas = function(_id) { if( _id === $_ ) return; {
	com.inq.ui.Container.apply(this,[_id]);
}}
com.inq.ui.Canvas.__name__ = ["com","inq","ui","Canvas"];
com.inq.ui.Canvas.__super__ = com.inq.ui.Container;
for(var k in com.inq.ui.Container.prototype ) com.inq.ui.Canvas.prototype[k] = com.inq.ui.Container.prototype[k];
com.inq.ui.Canvas.prototype.resize = function() {
	com.inq.ui.Container.prototype.resize.apply(this,[]);
}
com.inq.ui.Canvas.prototype.__class__ = com.inq.ui.Canvas;
com.inq.flash.client.chatskins.ChatTextArea = function(__textArea) { if( __textArea === $_ ) return; {
	this._ta = null;
	this.__htmlText = "";
	this._tabStops = null;
	this._textField = null;
	this._initialized = false;
	this._onInitialized = null;
	this.arrayOpeners = new Array();
	this.arrayTranscripts = new Array();
	if(null != __textArea) this._textArea = __textArea;
	this._ta2 = null;
	this._ta = __textArea;
	this._indent = 80;
	this._renderTimer = null;
	this.setTabStops();
	this.applyStyles();
	this.reverseChat = (Application.application.skinConfig["reverseChat"]);
}}
com.inq.flash.client.chatskins.ChatTextArea.__name__ = ["com","inq","flash","client","chatskins","ChatTextArea"];
com.inq.flash.client.chatskins.ChatTextArea.prototype.__htmlText = null;
com.inq.flash.client.chatskins.ChatTextArea.prototype._indent = null;
com.inq.flash.client.chatskins.ChatTextArea.prototype._initialized = null;
com.inq.flash.client.chatskins.ChatTextArea.prototype._onInitialized = null;
com.inq.flash.client.chatskins.ChatTextArea.prototype._render = function() {
	this._renderTimer = null;
	this.__htmlText = this.renderToHtml();
	this._ta2 = com.inq.ui.TextArea.clone(this._ta,this._ta.getID() + "2");
	var p = this._ta.parent;
	this._ta2.attachTo(p,this._ta);
	this._ta2.setVisible(false);
	this._ta2._setHtmlText("<table>" + this.__htmlText + "</table>");
	this._ta2.setVisible(true);
	this._ta.setVisible(false);
	if(!this.reverseChat) {
		this._ta2.scrollToBottom();
	}
	else {
		this._ta2.scrollToTop();
	}
	var ta2ID = this._ta2.getID();
	var taID = this._ta.getID();
	var taTemp = this._ta;
	this._ta = this._textArea = this._ta2;
	this._ta2 = taTemp;
	Application.application[taID] = this._ta;
	this._ta.setID(taID);
	this._ta2.setID(ta2ID);
	this._ta2.removeFrom();
	this._ta2 = null;
}
com.inq.flash.client.chatskins.ChatTextArea.prototype._renderTimer = null;
com.inq.flash.client.chatskins.ChatTextArea.prototype._ta = null;
com.inq.flash.client.chatskins.ChatTextArea.prototype._ta2 = null;
com.inq.flash.client.chatskins.ChatTextArea.prototype._tabStops = null;
com.inq.flash.client.chatskins.ChatTextArea.prototype._textArea = null;
com.inq.flash.client.chatskins.ChatTextArea.prototype._textField = null;
com.inq.flash.client.chatskins.ChatTextArea.prototype.addOpenerScript = function(Id,Msg,MsgType,position) {
	var object = { Id : Id, Msg : Msg, MsgType : MsgType}
	if(position == -1) this.arrayOpeners.push(object);
	else this.arrayOpeners[position] = object;
	this.render();
}
com.inq.flash.client.chatskins.ChatTextArea.prototype.addToChatWindow = function(Id,Msg,MsgType) {
	var sText = Msg;
	switch(MsgType) {
	case com.inq.flash.client.chatskins.ChatTextArea.AGENT:{
		Msg = Msg.split("&apos;").join("'");
		Id = com.inq.flash.client.chatskins.ChatTextArea.AGENT_ID_PFX + Id + com.inq.flash.client.chatskins.ChatTextArea.AGENT_ID_SFX;
		Msg = com.inq.flash.client.chatskins.ChatTextArea.AGENT_MSG_PFX + Msg + com.inq.flash.client.chatskins.ChatTextArea.AGENT_MSG_SFX;
		sText = Id + Msg;
	}break;
	case com.inq.flash.client.chatskins.ChatTextArea.CUSTOMER:{
		Id = com.inq.flash.client.chatskins.ChatTextArea.CUST_ID_PFX + Id + com.inq.flash.client.chatskins.ChatTextArea.CUST_ID_SFX;
		Msg = com.inq.flash.client.chatskins.ChatTextArea.CUST_MSG_PFX + Msg + com.inq.flash.client.chatskins.ChatTextArea.CUST_MSG_SFX;
		sText = Id + Msg;
	}break;
	case com.inq.flash.client.chatskins.ChatTextArea.SYSTEM:{
		Msg = com.inq.flash.client.chatskins.ChatTextArea.SYS_PFX + Msg + com.inq.flash.client.chatskins.ChatTextArea.SYS_SFX;
		sText = Msg;
	}break;
	case com.inq.flash.client.chatskins.ChatTextArea.SYSTEM_STATUS:{
		Msg = com.inq.flash.client.chatskins.ChatTextArea.SYSSTAT_PFX + Msg + com.inq.flash.client.chatskins.ChatTextArea.SYSSTAT_SFX;
		sText = Msg;
	}break;
	}
	this.__htmlText += sText;
	this._ta._setHtmlText("<table>" + this.__htmlText + "</table>");
	this._ta.scrollToBottom();
}
com.inq.flash.client.chatskins.ChatTextArea.prototype.addTranscript = function(Id,Msg,MsgType,position) {
	var object;
	var res;
	try {
		if(this.arrayTranscripts.length > 0) {
			object = this.arrayTranscripts[this.arrayTranscripts.length - 1];
			if(object.MsgType == com.inq.flash.client.chatskins.ChatTextArea.SYSTEM_STATUS) this.arrayTranscripts.pop();
		}
		object = { Id : Id, Msg : Msg, MsgType : MsgType}
		if(this.arrayTranscripts.length <= position) position = -1;
		if(position == -1) {
			this.arrayTranscripts.push(object);
			res = this.arrayTranscripts.length - 1;
		}
		else this.arrayTranscripts[res = position] = object;
		this.render();
		return res;
	}
	catch( $e194 ) {
		if( js.Boot.__instanceof($e194,Error) ) {
			var e = $e194;
			{
				haxe.Log.trace("ChatTextArea.addTranscript:451 Error:" + e,{ fileName : "ChatTextArea.hx", lineNumber : 495, className : "com.inq.flash.client.chatskins.ChatTextArea", methodName : "addTranscript"});
			}
		} else throw($e194);
	}
	return -1;
}
com.inq.flash.client.chatskins.ChatTextArea.prototype.addTranscriptLine = function(Id,Msg,MsgType,_html) {
	var defaultAgentAlias = (Application.application.skinConfig["defaultAgentAlias"]?Application.application.skinConfig["defaultAgentAlias"]:"");
	var usecolon = (((defaultAgentAlias == "" && Id == "&nbsp;")?"":":"));
	var sText = Msg;
	switch(MsgType) {
	case com.inq.flash.client.chatskins.ChatTextArea.AGENT:{
		Msg = Msg.split("&apos;").join("'");
		if(usecolon == ":") {
			Id = com.inq.flash.client.chatskins.ChatTextArea.AGENT_ID_PFX + Id + usecolon + com.inq.flash.client.chatskins.ChatTextArea.AGENT_ID_SFX;
		}
		else {
			Id = com.inq.flash.client.chatskins.ChatTextArea.AGENT_ID_PFX + com.inq.flash.client.chatskins.ChatTextArea.AGENT_ID_SFX.split("&nbsp;").join("");
		}
		Msg = com.inq.flash.client.chatskins.ChatTextArea.AGENT_MSG_PFX + Msg + com.inq.flash.client.chatskins.ChatTextArea.AGENT_MSG_SFX;
		sText = Id + Msg;
	}break;
	case com.inq.flash.client.chatskins.ChatTextArea.CUSTOMER:{
		Id = com.inq.flash.client.chatskins.ChatTextArea.CUST_ID_PFX + Id + com.inq.flash.client.chatskins.ChatTextArea.CUST_ID_SFX;
		Msg = com.inq.flash.client.chatskins.ChatTextArea.CUST_MSG_PFX + Msg + com.inq.flash.client.chatskins.ChatTextArea.CUST_MSG_SFX;
		sText = Id + Msg;
	}break;
	case com.inq.flash.client.chatskins.ChatTextArea.SYSTEM:{
		Msg = Msg.split("&nl;").join("<br/>");
		Msg = com.inq.flash.client.chatskins.ChatTextArea.SYS_PFX + Msg + com.inq.flash.client.chatskins.ChatTextArea.SYS_SFX;
		sText = Msg;
	}break;
	case com.inq.flash.client.chatskins.ChatTextArea.SYSTEM_STATUS:{
		Msg = com.inq.flash.client.chatskins.ChatTextArea.SYSSTAT_PFX + Msg + com.inq.flash.client.chatskins.ChatTextArea.SYSSTAT_SFX;
		sText = Msg;
	}break;
	}
	_html = (this.reverseChat?sText + _html:_html + sText);
	return _html;
}
com.inq.flash.client.chatskins.ChatTextArea.prototype.applyStyles = function() {
	var sAgentColor;
	var sCustomerColor;
	var sFontSize;
	var sIndent;
	var sTabStops;
	var agentSample;
	var sFont;
	sAgentColor = com.inq.flash.client.chatskins.SkinControl.transcriptAgentColor;
	sCustomerColor = com.inq.flash.client.chatskins.SkinControl.transcriptCustomerColor;
	sFontSize = com.inq.flash.client.chatskins.SkinControl.transcriptFontSize;
	sIndent = com.inq.flash.client.chatskins.SkinControl.transcriptIndent;
	sTabStops = "[" + sIndent + "]";
	var sFont1 = com.inq.flash.client.chatskins.SkinControl.transcriptFont;
	var agentSample1 = com.inq.flash.client.chatskins.SkinControl.transcriptAgentSample;
	var css = new com.inq.ui.StyleSheet();
	var cw = Application.application["chatWindow"];
	css.setStyle("html",{ });
	css.setStyle("body",{ fontFamily : (sFont1), fontSize : (sFontSize), fontWeight : "normal"});
	var styleObj;
	var styleId;
	var styleData;
	styleId = "systemMsg";
	if(Application.application.skinConfig != null) {
		styleData = Application.application.skinConfig[styleId];
	}
	else {
		styleData = null;
	}
	if(styleData != null) {
		css.setStyle("." + styleId,styleData);
		styleId = "customerId";
		styleObj = Application.application.skinConfig[styleId];
		if(styleObj != null) {
			styleObj["verticalAlign"] = "top";
			styleObj["vertical-align"] = "top";
		}
		css.setStyle("." + styleId,styleObj);
		styleId = "agentId";
		css.setStyle("." + styleId,Application.application.skinConfig[styleId]);
		styleId = "agentMsg";
		try {
			cw._setStyleSheet(css);
		}
		catch( $e195 ) {
			if( js.Boot.__instanceof($e195,Error) ) {
				var e = $e195;
				null;
			} else throw($e195);
		}
		styleObj = Application.application.skinConfig[styleId];
		if(styleObj != null) {
			styleObj["tabStops"] = com.inq.flash.client.chatskins.SkinControl.transcriptTabStops;
			styleObj["marginLeft"] = sIndent;
		}
		css.setStyle("." + styleId,styleObj);
		styleId = "customerMsg";
		styleObj = Application.application.skinConfig[styleId];
		if(styleObj != null) {
			styleObj["tabStops"] = sTabStops;
			styleObj["marginLeft"] = sIndent;
		}
		css.setStyle("." + styleId,styleObj);
		try {
			this._ta._setStyleSheet(css);
		}
		catch( $e196 ) {
			{
				var e = $e196;
				null;
			}
		}
	}
}
com.inq.flash.client.chatskins.ChatTextArea.prototype.arrayOpeners = null;
com.inq.flash.client.chatskins.ChatTextArea.prototype.arrayTranscripts = null;
com.inq.flash.client.chatskins.ChatTextArea.prototype.clearTranscript = function() {
	this.__htmlText = "";
	this._ta._setHtmlText("<table>" + this.__htmlText + "</table>");
}
com.inq.flash.client.chatskins.ChatTextArea.prototype.exportData = function() {
	var ix;
	var o;
	var txt = "{ " + "__htmlText: " + com.inq.utils.StringUtil.toJsString(this.__htmlText) + ",\n" + "_initialized: " + this._initialized + ",\n" + "arrayOpeners: [";
	{
		var _g1 = 0, _g = this.arrayOpeners.length;
		while(_g1 < _g) {
			var ix1 = _g1++;
			if(null != (o = this.arrayOpeners[ix1])) {
				try {
					if(ix1 != 0) txt += ",";
					txt += "{Id:" + com.inq.utils.StringUtil.toJsString(o.Id) + ",Msg:" + com.inq.utils.StringUtil.toJsString(o.Msg) + ",MsgType:" + o.MsgType + "}\n";
				}
				catch( $e197 ) {
					if( js.Boot.__instanceof($e197,Error) ) {
						var e = $e197;
						null;
					} else throw($e197);
				}
			}
		}
	}
	txt += "],\n";
	txt += "arrayTranscripts: [";
	{
		var _g1 = 0, _g = this.arrayTranscripts.length;
		while(_g1 < _g) {
			var ix1 = _g1++;
			if(null != (o = this.arrayTranscripts[ix1])) {
				try {
					if(ix1 != 0) txt += ",";
					txt += "{Id:" + com.inq.utils.StringUtil.toJsString(o.Id) + ",Msg:" + com.inq.utils.StringUtil.toJsString(o.Msg) + ",MsgType:" + o.MsgType + "}\n";
				}
				catch( $e198 ) {
					if( js.Boot.__instanceof($e198,Error) ) {
						var e = $e198;
						null;
					} else throw($e198);
				}
			}
		}
	}
	txt += "]\n";
	txt += "}";
	return txt;
}
com.inq.flash.client.chatskins.ChatTextArea.prototype.findTranscriptLineIndex = function(subString) {
	var o;
	{
		var _g1 = 0, _g = this.arrayTranscripts.length;
		while(_g1 < _g) {
			var i = _g1++;
			o = this.arrayTranscripts[i];
			if(null != o) {
				try {
					if(o.Msg.length > 0) {
						if(o.Msg.indexOf(subString) != -1) {
							return i;
						}
					}
				}
				catch( $e199 ) {
					if( js.Boot.__instanceof($e199,Error) ) {
						var e = $e199;
						null;
					} else throw($e199);
				}
			}
		}
	}
	return -1;
}
com.inq.flash.client.chatskins.ChatTextArea.prototype.getHeight = function() {
	return this._textArea.getHeight();
}
com.inq.flash.client.chatskins.ChatTextArea.prototype.getHtmlText = function() {
	return this.__htmlText;
}
com.inq.flash.client.chatskins.ChatTextArea.prototype.getLength = function() {
	return this._ta._getHtmlText().length;
}
com.inq.flash.client.chatskins.ChatTextArea.prototype.getTranscriptLine = function(index) {
	if(index < 0 || index > this.arrayTranscripts.length) {
		return null;
	}
	return this.arrayTranscripts[index].Msg;
}
com.inq.flash.client.chatskins.ChatTextArea.prototype.getTranscriptMessage = function(index) {
	return this.arrayTranscripts[index];
}
com.inq.flash.client.chatskins.ChatTextArea.prototype.getWidth = function() {
	return this._textArea.getWidth();
}
com.inq.flash.client.chatskins.ChatTextArea.prototype.getX = function() {
	return this._textArea.getX();
}
com.inq.flash.client.chatskins.ChatTextArea.prototype.getY = function() {
	return this._textArea.getY();
}
com.inq.flash.client.chatskins.ChatTextArea.prototype.height = null;
com.inq.flash.client.chatskins.ChatTextArea.prototype.htmlText = null;
com.inq.flash.client.chatskins.ChatTextArea.prototype.importData = function(data) {
	var obj = this.stringToObject(data);
	this.__htmlText = obj.__htmlText;
	this._initialized = obj._initialized;
	this.arrayOpeners = obj.arrayOpeners;
	this.arrayTranscripts = obj.arrayTranscripts;
	this._ta._setHtmlText("<table>" + this.__htmlText + "</table>");
	this.scrollToBottom();
}
com.inq.flash.client.chatskins.ChatTextArea.prototype.indent = null;
com.inq.flash.client.chatskins.ChatTextArea.prototype.onInitialized = null;
com.inq.flash.client.chatskins.ChatTextArea.prototype.render = function() {
	if(this._renderTimer != null) {
		this._renderTimer.stop();
	}
	this._renderTimer = com.inq.utils.Timer.delay($closure(this,"_render"),com.inq.flash.client.chatskins.ChatTextArea.RENDER_DELAY);
}
com.inq.flash.client.chatskins.ChatTextArea.prototype.renderToHtml = function() {
	var i;
	var o;
	var htmlText = "";
	{
		var _g1 = 0, _g = this.arrayOpeners.length;
		while(_g1 < _g) {
			var i1 = _g1++;
			o = this.arrayOpeners[i1];
			if(null != o) {
				try {
					htmlText = this.addTranscriptLine(o.Id,o.Msg,o.MsgType,htmlText);
				}
				catch( $e200 ) {
					if( js.Boot.__instanceof($e200,Error) ) {
						var e = $e200;
						null;
					} else throw($e200);
				}
			}
		}
	}
	{
		var _g1 = 0, _g = this.arrayTranscripts.length;
		while(_g1 < _g) {
			var i1 = _g1++;
			o = this.arrayTranscripts[i1];
			if(null != o) {
				try {
					var id = null;
					id = o.Id;
					if(id != null && o.Msg.length > 0) htmlText = this.addTranscriptLine(o.Id,o.Msg,o.MsgType,htmlText);
				}
				catch( $e201 ) {
					if( js.Boot.__instanceof($e201,Error) ) {
						var e = $e201;
						null;
					} else throw($e201);
				}
			}
		}
	}
	return htmlText;
}
com.inq.flash.client.chatskins.ChatTextArea.prototype.replaceTranscriptLine = function(index,newLine) {
	if(this.replaceTranscriptLineNoRender(index,newLine)) this.render();
}
com.inq.flash.client.chatskins.ChatTextArea.prototype.replaceTranscriptLineNoRender = function(index,newLine) {
	if(index < 0 || index > this.arrayTranscripts.length) {
		return false;
	}
	this.arrayTranscripts[index].Msg = newLine;
	return true;
}
com.inq.flash.client.chatskins.ChatTextArea.prototype.reverseChat = null;
com.inq.flash.client.chatskins.ChatTextArea.prototype.scrollToBottom = function() {
	this._textArea.scrollToBottom();
}
com.inq.flash.client.chatskins.ChatTextArea.prototype.scrollToTop = function() {
	this._textArea.scrollToTop();
}
com.inq.flash.client.chatskins.ChatTextArea.prototype.setActualSize = function(w,h) {
	null;
}
com.inq.flash.client.chatskins.ChatTextArea.prototype.setGraphicId = function(graphicID) {
	null;
}
com.inq.flash.client.chatskins.ChatTextArea.prototype.setHtmlText = function(str) {
	this.__htmlText = str;
	var sTabStops = "[" + this._tabStops.join(",") + "]";
	var sTextFormatStart = "<table>";
	var sTextFormatEnd = "</table>";
	this._textArea._setHtmlText(sTextFormatStart + this.__htmlText + sTextFormatEnd);
}
com.inq.flash.client.chatskins.ChatTextArea.prototype.setIndent = function(indent) {
	this._indent = indent;
	this.setTabStops();
}
com.inq.flash.client.chatskins.ChatTextArea.prototype.setStyle = function(styleName,styleValue) {
	if(this._ta != null) this._ta.setStyle(styleName,styleValue);
	if(this._ta2 != null) this._ta2.setStyle(styleName,styleValue);
}
com.inq.flash.client.chatskins.ChatTextArea.prototype.setStyleSheet = function(ss) {
	return;
}
com.inq.flash.client.chatskins.ChatTextArea.prototype.setTabStops = function() {
	try {
		var width = this._textArea.getWidth();
		var lmt = Math.floor(this._textArea.getWidth());
		if(lmt <= 0) lmt = this._indent + 500;
		this._tabStops = new Array();
		var ix = 0;
		var tab = this._indent;
		while(tab < lmt) {
			if(tab != 0) this._tabStops[ix++] = tab;
			tab += 10;
		}
	}
	catch( $e202 ) {
		if( js.Boot.__instanceof($e202,Error) ) {
			var e = $e202;
			{
				haxe.Log.trace("ChatTextArea.setTabStops ERROR: " + e,{ fileName : "ChatTextArea.hx", lineNumber : 368, className : "com.inq.flash.client.chatskins.ChatTextArea", methodName : "setTabStops"});
			}
		} else throw($e202);
	}
}
com.inq.flash.client.chatskins.ChatTextArea.prototype.stringToObject = function(s) {
	var func;
	var obj = null;
	try {
		var func1 = new Function("return " + s + ";");
		obj = func1();
	}
	catch( $e203 ) {
		if( js.Boot.__instanceof($e203,Error) ) {
			var e = $e203;
			{
				haxe.Log.trace("ERROR: \n" + s,{ fileName : "ChatTextArea.hx", lineNumber : 167, className : "com.inq.flash.client.chatskins.ChatTextArea", methodName : "stringToObject"});
			}
		} else throw($e203);
	}
	return obj;
}
com.inq.flash.client.chatskins.ChatTextArea.prototype.styleSheet = null;
com.inq.flash.client.chatskins.ChatTextArea.prototype.syncForms = function() {
	var divScratch = js.Lib.document.createElement("DIV");
	var allForms = this._ta._div.getElementsByTagName("FORM");
	var tix, fix;
	var findex = 0;
	var inputs;
	{
		var _g1 = 0, _g = allForms.length;
		while(_g1 < _g) {
			var fix1 = _g1++;
			inputs = allForms[fix1].getElementsByTagName("INPUT");
			{
				var _g3 = 0, _g2 = inputs.length;
				while(_g3 < _g2) {
					var iix = _g3++;
					inputs[iix].setAttribute("value",inputs[iix].value);
				}
			}
		}
	}
	{
		var _g1 = 0, _g = this.arrayTranscripts.length;
		while(_g1 < _g) {
			var tix1 = _g1++;
			divScratch.innerHTML = this.arrayTranscripts[tix1].Msg;
			var frms = divScratch.getElementsByTagName("FORM");
			if(frms != null && frms.length > 0) {
				this.arrayTranscripts[tix1].Msg = allForms[findex].parentNode.innerHTML;
				findex += frms.length;
			}
		}
	}
	this.__htmlText = this.renderToHtml();
}
com.inq.flash.client.chatskins.ChatTextArea.prototype.width = null;
com.inq.flash.client.chatskins.ChatTextArea.prototype.x = null;
com.inq.flash.client.chatskins.ChatTextArea.prototype.y = null;
com.inq.flash.client.chatskins.ChatTextArea.prototype.__class__ = com.inq.flash.client.chatskins.ChatTextArea;
com.inq.flash.client.chatskins.SndMgr = function(p) { if( p === $_ ) return; {
	null;
}}
com.inq.flash.client.chatskins.SndMgr.__name__ = ["com","inq","flash","client","chatskins","SndMgr"];
com.inq.flash.client.chatskins.SndMgr.btnMuteOn = null;
com.inq.flash.client.chatskins.SndMgr.btnMuteOff = null;
com.inq.flash.client.chatskins.SndMgr.soundURL = null;
com.inq.flash.client.chatskins.SndMgr._init = function() {
	var win = window;
	var div = document.getElementById("divSound");
	if(div != null) {
		div.innerHTML = "";
		div.parentNode.removeChild(div);
	}
	haxe.Log.trace("Sound manager _init()::soundEnabled:" + com.inq.flash.client.chatskins.SndMgr.soundEnabled,{ fileName : "SndMgr.hx", lineNumber : 46, className : "com.inq.flash.client.chatskins.SndMgr", methodName : "_init"});
	haxe.Log.trace("Sound manager _init()::mute:" + com.inq.flash.client.chatskins.SndMgr._mute,{ fileName : "SndMgr.hx", lineNumber : 47, className : "com.inq.flash.client.chatskins.SndMgr", methodName : "_init"});
	return true;
}
com.inq.flash.client.chatskins.SndMgr.buildSoundDiv = function() {
	var div = null;
	if(null == (div = document.getElementById("divSound"))) {
		var bodys = document.getElementsByTagName("BODY");
		div = document.createElement("DIV");
		div.id = "divSound";
		div.style.cssText = "position:absolute;top:0px;left:0px;display:block;width:1px;height:1px;overflow:hidden;opacity:0.01;filter:alpha(opacity=1)";
		var all = window.document.body.getElementsByTagName("DIV");
		document.body.insertBefore(div,all[0]);
	}
	com.inq.flash.client.chatskins.SndMgr.divSound = div;
}
com.inq.flash.client.chatskins.SndMgr.init = function() {
	com.inq.flash.client.chatskins.SndMgr._mute = ((null != Application.application.skinConfig["mute"])?Application.application.skinConfig["mute"]:com.inq.flash.client.chatskins.SndMgr._mute);
	com.inq.flash.client.chatskins.SndMgr.buildSoundDiv();
	com.inq.flash.client.chatskins.SndMgr.soundURL = Application.application.skinConfig["soundURL"];
	com.inq.flash.client.chatskins.SndMgr.soundEnabled = ((null != Application.application.skinConfig["soundEnabled"])?Application.application.skinConfig["soundEnabled"]:false);
	com.inq.flash.client.chatskins.SndMgr.swfSoundSuppress = ((null == Application.application.skinConfig["swfSoundSuppress"])?false:Application.application.skinConfig["swfSuppress"]);
	if(com.inq.flash.client.chatskins.SndMgr.soundURL != null && com.inq.flash.client.chatskins.SndMgr.soundURL.indexOf(":/") < 0) {
		com.inq.flash.client.chatskins.SndMgr.soundURL = com.inq.ui.SkinLoader.GetSkinPath() + "/" + com.inq.flash.client.chatskins.SndMgr.soundURL;
	}
	if(com.inq.flash.client.chatskins.SkinControl.isInApplication("btnMuteOff") && com.inq.flash.client.chatskins.SkinControl.isInApplication("btnMuteOn")) {
		com.inq.flash.client.chatskins.SndMgr._mute = ((0 == com.inq.flash.client.control.PersistenceManager.GetValue("m",((com.inq.flash.client.chatskins.SndMgr.soundEnabled)?1:0)))?true:com.inq.flash.client.chatskins.SndMgr._mute);
		if(com.inq.utils.Capabilities.isMobile()) {
			com.inq.flash.client.chatskins.SndMgr._mute = true;
			com.inq.flash.client.control.PersistenceManager.SetValue("m",0);
		}
		haxe.Log.trace("Sound manager init()::PersistenceManager:" + com.inq.flash.client.control.PersistenceManager.GetValue("m",((false)?1:0)),{ fileName : "SndMgr.hx", lineNumber : 99, className : "com.inq.flash.client.chatskins.SndMgr", methodName : "init"});
		com.inq.flash.client.chatskins.SndMgr.btnMuteOn = Application.application["btnMuteOn"];
		com.inq.flash.client.chatskins.SndMgr.btnMuteOff = Application.application["btnMuteOff"];
		com.inq.flash.client.chatskins.SndMgr.fixButtons();
		if(com.inq.flash.client.chatskins.SndMgr.btnMuteOn != null) com.inq.flash.client.chatskins.SndMgr.btnMuteOn.addEventListener(com.inq.events.MouseEvent.CLICK,$closure(com.inq.flash.client.chatskins.SndMgr,"actionBtnMuteOff"));
		if(com.inq.flash.client.chatskins.SndMgr.btnMuteOff != null) com.inq.flash.client.chatskins.SndMgr.btnMuteOff.addEventListener(com.inq.events.MouseEvent.CLICK,$closure(com.inq.flash.client.chatskins.SndMgr,"actionBtnMuteOn"));
	}
	haxe.Log.trace("Sound manager init()::soundEnabled:" + com.inq.flash.client.chatskins.SndMgr.soundEnabled,{ fileName : "SndMgr.hx", lineNumber : 106, className : "com.inq.flash.client.chatskins.SndMgr", methodName : "init"});
	haxe.Log.trace("Sound manager init()::mute:" + com.inq.flash.client.chatskins.SndMgr._mute,{ fileName : "SndMgr.hx", lineNumber : 107, className : "com.inq.flash.client.chatskins.SndMgr", methodName : "init"});
	haxe.Log.trace("Sound manager init()::soundURL:" + com.inq.flash.client.chatskins.SndMgr.soundURL,{ fileName : "SndMgr.hx", lineNumber : 108, className : "com.inq.flash.client.chatskins.SndMgr", methodName : "init"});
	return true;
}
com.inq.flash.client.chatskins.SndMgr.actionBtnMuteOn = function(me) {
	try {
		if(!com.inq.utils.Capabilities.isMobile()) {
			com.inq.flash.client.chatskins.SndMgr._mute = true;
			com.inq.flash.client.control.PersistenceManager.SetValue("m",((com.inq.flash.client.chatskins.SndMgr._mute)?1:0));
			com.inq.flash.client.chatskins.SndMgr.fixButtons();
		}
	}
	catch( $e204 ) {
		if( js.Boot.__instanceof($e204,Error) ) {
			var e = $e204;
			null;
		} else throw($e204);
	}
	return true;
}
com.inq.flash.client.chatskins.SndMgr.actionBtnMuteOff = function(me) {
	try {
		if(!com.inq.utils.Capabilities.isMobile()) {
			com.inq.flash.client.chatskins.SndMgr._mute = false;
			com.inq.flash.client.control.PersistenceManager.SetValue("m",((com.inq.flash.client.chatskins.SndMgr._mute)?1:0));
			com.inq.flash.client.chatskins.SndMgr.fixButtons();
		}
	}
	catch( $e205 ) {
		if( js.Boot.__instanceof($e205,Error) ) {
			var e = $e205;
			null;
		} else throw($e205);
	}
	return true;
}
com.inq.flash.client.chatskins.SndMgr.fixButtons = function() {
	com.inq.flash.client.chatskins.SndMgr.btnMuteOn.setVisible(com.inq.flash.client.chatskins.SndMgr._mute);
	com.inq.flash.client.chatskins.SndMgr.btnMuteOff.setVisible(!com.inq.flash.client.chatskins.SndMgr._mute);
}
com.inq.flash.client.chatskins.SndMgr.PlaySound = function(soundURL) {
	if(com.inq.utils.Capabilities.isMobile()) return;
	try {
		if(window.navigator.appVersion.indexOf("Chrome/17.0") > -1) return;
	}
	catch( $e206 ) {
		if( js.Boot.__instanceof($e206,Error) ) {
			var e = $e206;
			null;
		} else throw($e206);
	}
	if(com.inq.flash.client.chatskins.SndMgr._mute) return;
	if(com.inq.flash.client.chatskins.SndMgr.btnMuteOn == null || com.inq.flash.client.chatskins.SndMgr.btnMuteOff == null) return;
	if(soundURL == null) soundURL = com.inq.flash.client.chatskins.SndMgr.soundURL;
	if(soundURL == null) return;
	if(!com.inq.flash.client.chatskins.SndMgr.soundEnabled) return;
	try {
		if(null != com.inq.flash.client.chatskins.SndMgr.divSound) {
			var cidSwf = "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000";
			var cidQT = "clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B";
			var cidMP = "clsid:6BF52A52-394A-11D3-B153-00C04F79FAA6";
			var swfPath = Application.application.skinConfig["soundSwf"];
			var soundExt = null;
			try {
				soundExt = soundURL.split(".").pop();
			}
			catch( $e207 ) {
				if( js.Boot.__instanceof($e207,Error) ) {
					var e = $e207;
					{
						soundExt = "mp3";
					}
				} else throw($e207);
			}
			soundExt = ((soundExt != null)?soundExt.toLowerCase():"mp3");
			if(soundURL != null && (soundExt == "mp3" || soundExt == "wav")) {
				var sounder = window.document.getElementById("inqSounder");
				if(sounder == null) {
					var bgsound = null;
					bgsound = document.createElement("BGSOUND");
					if(bgsound != null) {
						bgsound.id = "inqSounder";
						bgsound.loop = "1";
						document.body.insertBefore(bgsound,null);
					}
				}
				sounder = window.document.all["inqSounder"];
				if(sounder != null && sounder.src != null) {
					try {
						sounder.src = soundURL;
						return;
					}
					catch( $e208 ) {
						if( js.Boot.__instanceof($e208,Error) ) {
							var e = $e208;
							null;
						} else throw($e208);
					}
				}
			}
			if(null == swfPath) {
				swfPath = "PlaySoundFile.swf";
			}
			swfPath = com.inq.ui.SkinLoader.GetSkinPath() + "/" + swfPath;
			var flashvars = ((soundURL == null)?null:"soundURL=" + soundURL + " ");
			var randomNumber = Math.floor(Math.random() * 1000);
			var swfEmbed = ((document.all)?"":"<embed src=\"" + swfPath + "\" quality=\"high\" play=\"true\" loop=\"false\" scale=\"showall\" " + (((flashvars != null)?"flashvars=\"" + flashvars + "\" ":"")) + "wmode=\"transparent\" devicefont=\"false\" bgcolor=\"#ffffff\" name=\"PlaySoundFile\" menu=\"false\" allowfullscreen=\"false\" allowscriptaccess=\"sameDomain\" salign=\"\" type=\"application/x-shockwave-flash\" width=\"10\" align=\"middle\" height=\"10\"> \n");
			var haveMime = com.inq.flash.client.chatskins.SndMgr.searchForMimeType(soundExt);
			if(!haveMime && soundExt == "mp3") haveMime = com.inq.flash.client.chatskins.SndMgr.searchForMimeType("mp4");
			if(haveMime) swfEmbed = "<embed src=\"" + soundURL + "\" wmode=\"transparent\" autostart=\"true\" loop=\"false\" width=\"1\" height=\"1\" controller=\"false\">" + "</embed>";
			else if(com.inq.flash.client.chatskins.SndMgr.swfSoundSuppress) swfEmbed = "";
			var swfHtml = "<object classid=\"" + cidSwf + "\" name=\"sound" + randomNumber + "\"" + " data=\"" + swfPath + "\"" + " width=\"550\" " + " height=\"400\" " + " id=\"PlaySoundFile\"" + " align=\"middle\">" + " <param name=\"allowScriptAccess\" value=\"sameDomain\" />" + " <param name=\"allowFullScreen\" value=\"false\" />" + " <param name=\"movie\" value=\"" + swfPath + "\" />" + " <param name=\"loop\" value=\"false\" />" + " <param name=\"menu\" value=\"false\" />" + " <param name=\"quality\" value=\"high\" />" + " <param name=\"wmode\" value=\"transparent\" />" + " <param name=\"bgcolor\" value=\"#FF000\" />" + (((soundURL != null)?" <param name=\"flashvars\" value=\"soundURL=" + soundURL + "\" />":"")) + (((flashvars != null)?" <param name=\"flashvars\" value=\"" + flashvars + "\" />":"")) + swfEmbed + "</object>";
			if(soundURL != null) swfHtml = "<object classid=\"" + cidMP + "\" name=\"sound" + randomNumber + "\"" + " data=\"" + soundURL + "\"" + " width=\"1\" " + " height=\"1\" " + " id=\"PlaySoundFileMediaPlayer\"" + " align=\"middle\">" + " <param name=\"wmode\" value=\"transparent\" />" + " <PARAM name=\"SRC\" VALUE=\"" + soundURL + "\">" + " <PARAM name=\"AUTOPLAY\" VALUE=\"1\">" + " <PARAM name=\"Filename\" VALUE=\"" + soundURL + "\">" + " <PARAM name=\"AutoSize\" VALUE=\"0\">" + " <PARAM name=\"AutoStart\" VALUE=\"0\">" + " <PARAM name=\"ClickToPlay\" VALUE=\"1\">" + " <PARAM name=\"PlayCount\" VALUE=\"1\">" + " <PARAM name=\"ShowControls\" VALUE=\"0\">" + " <PARAM name=\"ShowAudioControls\" VALUE=\"0\">" + " <PARAM name=\"ShowDisplay\" VALUE=\"0\">" + " <PARAM name=\"ShowPositionControls\" VALUE=\"-1\">" + " <PARAM name=\"ShowStatusBar\" VALUE=\"0\">" + " <PARAM name=\"ShowTracker\" VALUE=\"0\">" + "\n" + swfHtml + "\n" + "</object>";
			if(soundURL != null) swfHtml = "<object classid=\"" + cidQT + "\" name=\"sound" + randomNumber + "\"" + " data=\"" + soundURL + "\"" + " width=\"550\" " + " height=\"400\" " + " id=\"PlaySoundFileQT\"" + " align=\"middle\">" + " <param name=\"wmode\" value=\"transparent\" />" + " <PARAM name=\"SRC\" VALUE=\"" + soundURL + "\">" + " <PARAM name=\"AUTOPLAY\" VALUE=\"true\">" + "<param name=\"controller\" value=\"false\">" + "\n" + swfHtml + "\n" + "</object>";
			com.inq.flash.client.chatskins.SndMgr.divSound.innerHTML = swfHtml;
		}
	}
	catch( $e209 ) {
		if( js.Boot.__instanceof($e209,Error) ) {
			var e = $e209;
			{
				haxe.Log.trace("Error: " + e,{ fileName : "SndMgr.hx", lineNumber : 315, className : "com.inq.flash.client.chatskins.SndMgr", methodName : "PlaySound"});
			}
		} else throw($e209);
	}
}
com.inq.flash.client.chatskins.SndMgr.searchForMimeType = function(mimeType) {
	var mimes = window.navigator["mimeTypes"];
	if(mimes == null || mimes.length < 1) return false;
	var mix, six;
	{
		var _g1 = 0, _g = mimes.length;
		while(_g1 < _g) {
			var mix1 = _g1++;
			var suffixes = mimes[mix1].suffixes.split(",");
			if(suffixes == null || suffixes.length < 1) continue;
			{
				var _g3 = 0, _g2 = suffixes.length;
				while(_g3 < _g2) {
					var six1 = _g3++;
					if(mimeType == suffixes[six1]) {
						return true;
					}
				}
			}
		}
	}
	return false;
}
com.inq.flash.client.chatskins.SndMgr.prototype.__class__ = com.inq.flash.client.chatskins.SndMgr;
com.inq.flash.client.control.ClientConnectionEventHandler = function(controller) { if( controller === $_ ) return; {
	this.controller = controller;
}}
com.inq.flash.client.control.ClientConnectionEventHandler.__name__ = ["com","inq","flash","client","control","ClientConnectionEventHandler"];
com.inq.flash.client.control.ClientConnectionEventHandler.prototype.allConnectionAttemptsFailed = function() {
	null;
}
com.inq.flash.client.control.ClientConnectionEventHandler.prototype.connectionClosedNeedRetryRequest = function() {
	return this.connectionFailedNeedRetryRequest(3,3);
}
com.inq.flash.client.control.ClientConnectionEventHandler.prototype.connectionFailedNeedRetryRequest = function(connectionRetryAttempts,maxConnectionRetries) {
	this.controller.connectionLost();
	if(this.controller.shouldBeDisconnected()) return false;
	return true;
}
com.inq.flash.client.control.ClientConnectionEventHandler.prototype.connectionSuccessful = function() {
	haxe.Log.trace("enter",{ fileName : "ClientConnectionEventHandler.hx", lineNumber : 25, className : "com.inq.flash.client.control.ClientConnectionEventHandler", methodName : "connectionSuccessful"});
	this.controller.connectionEstablished();
	haxe.Log.trace("exit",{ fileName : "ClientConnectionEventHandler.hx", lineNumber : 27, className : "com.inq.flash.client.control.ClientConnectionEventHandler", methodName : "connectionSuccessful"});
}
com.inq.flash.client.control.ClientConnectionEventHandler.prototype.controller = null;
com.inq.flash.client.control.ClientConnectionEventHandler.prototype.__class__ = com.inq.flash.client.control.ClientConnectionEventHandler;
com.inq.flash.client.control.ClientConnectionEventHandler.__interfaces__ = [com.inq.flash.messagingframework.connectionhandling.ApplicationConnectionEventHandler];
com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler = function(p) { if( p === $_ ) return; {
	com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.apply(this,[com.inq.flash.client.data.MessageFields.TYPE_CHAT_COBROWSE]);
}}
com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.__name__ = ["com","inq","flash","client","control","messagehandlers","ChatCobrowseMessageHandler"];
com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.__super__ = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler;
for(var k in com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype ) com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.prototype[k] = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype[k];
com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.disableLastSharedMessage = function(index) {
	if(index == null) index = -1;
	if(index == -1) index = com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.cobrowsSharedPositionQueue[com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.cobrowsSharedPositionQueue.length - 1];
	var msgObj = com.inq.flash.client.chatskins.SkinControl.getScriptLine(index);
	com.inq.flash.client.chatskins.SkinControl.AddTranscriptItemToChatWindow(msgObj.Id,com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.onclickReg.replace(msgObj.Msg,com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.replaceString),msgObj.MsgType,index);
}
com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.disableLastEngageMessage = function(index) {
	if(index == null) index = -1;
	if(index == -1) index = com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.cobrowsEngagedPositionQueue[com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.cobrowsEngagedPositionQueue.length - 1];
	var msgObj = com.inq.flash.client.chatskins.SkinControl.getScriptLine(index);
	com.inq.flash.client.chatskins.SkinControl.AddTranscriptItemToChatWindow(msgObj.Id,com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.onclickReg.replace(msgObj.Msg,com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.replaceString),msgObj.MsgType,index);
}
com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.prototype.processMessage = function(message) {
	var chatText = com.inq.flash.messagingframework.StringUtils.decodeStringFromMessage(message.getProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_DATA));
	var agentName = message.getProperty(com.inq.flash.client.data.MessageFields.KEY_MESSAGE_AGENT_ALIAS);
	if(agentName != null) {
		if(message.getProperty(com.inq.flash.client.data.MessageFields.KEY_COBROWSE_EVENT) != com.inq.flash.client.data.MessageFields.KEY_COBROWSE_EVENT_TYPE_AGENT_COBROWSE_END) {
			var position = com.inq.flash.client.chatskins.SkinControl.AddTranscriptItemToChatWindow(agentName,com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.onclickReg.replace(chatText,com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.replaceString),com.inq.flash.client.chatskins.ChatTextArea.AGENT,-1);
			if(message.getProperty(com.inq.flash.client.data.MessageFields.KEY_COBROWSE_EVENT) == com.inq.flash.client.data.MessageFields.KEY_COBROWSE_EVENT_TYPE_AGENT_COBROWSE_SENT_INVITE) {
				com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.cobrowsEngagedPositionQueue.push(position);
				if(com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.cobrowsEngagedPositionQueue.length != 0) {
					{
						var _g1 = 0, _g = com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.cobrowsEngagedPositionQueue.length;
						while(_g1 < _g) {
							var engageIndex = _g1++;
							com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.disableLastEngageMessage(com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.cobrowsEngagedPositionQueue[engageIndex]);
						}
					}
					if(!com.inq.flash.client.control.FlashPeer.isCobrowseEnagaged()) {
						com.inq.flash.client.chatskins.SkinControl.AddTranscriptItemToChatWindow(agentName,chatText,com.inq.flash.client.chatskins.ChatTextArea.AGENT,com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.cobrowsEngagedPositionQueue[com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.cobrowsEngagedPositionQueue.length - 1]);
						var replay = null;
						replay = "" + message.getProperty(com.inq.flash.client.data.MessageFields.KEY_REPLAY);
						if(replay != "1") {
							com.inq.flash.client.control.MinimizeManager.lastAgentMessage(chatText);
						}
					}
				}
			}
			if(message.getProperty(com.inq.flash.client.data.MessageFields.KEY_COBROWSE_EVENT) == com.inq.flash.client.data.MessageFields.KEY_COBROWSE_EVENT_TYPE_AGENT_COBROWSE_SENT_SHARED_INVITE) {
				com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.cobrowsSharedPositionQueue.push(position);
				if(com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.cobrowsSharedPositionQueue.length != 0) {
					{
						var _g1 = 0, _g = com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.cobrowsSharedPositionQueue.length;
						while(_g1 < _g) {
							var shareIndex = _g1++;
							com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.disableLastSharedMessage(com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.cobrowsSharedPositionQueue[shareIndex]);
						}
					}
					if(!com.inq.flash.client.control.FlashPeer.isCobrowseSharedControl()) {
						com.inq.flash.client.chatskins.SkinControl.AddTranscriptItemToChatWindow(agentName,chatText,com.inq.flash.client.chatskins.ChatTextArea.AGENT,com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.cobrowsSharedPositionQueue[com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.cobrowsSharedPositionQueue.length - 1]);
						var replay = null;
						replay = "" + message.getProperty(com.inq.flash.client.data.MessageFields.KEY_REPLAY);
						if(replay != "1") {
							com.inq.flash.client.control.MinimizeManager.lastAgentMessage(chatText);
						}
					}
				}
			}
		}
	}
	else {
		com.inq.flash.client.chatskins.SkinControl.AddTranscriptItemToChatWindow("",chatText,com.inq.flash.client.chatskins.ChatTextArea.SYSTEM,-1);
	}
}
com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.prototype.__class__ = com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler;
haxe.io.Error = { __ename__ : ["haxe","io","Error"], __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] }
haxe.io.Error.Blocked = ["Blocked",0];
haxe.io.Error.Blocked.toString = $estr;
haxe.io.Error.Blocked.__enum__ = haxe.io.Error;
haxe.io.Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe.io.Error; $x.toString = $estr; return $x; }
haxe.io.Error.OutsideBounds = ["OutsideBounds",2];
haxe.io.Error.OutsideBounds.toString = $estr;
haxe.io.Error.OutsideBounds.__enum__ = haxe.io.Error;
haxe.io.Error.Overflow = ["Overflow",1];
haxe.io.Error.Overflow.toString = $estr;
haxe.io.Error.Overflow.__enum__ = haxe.io.Error;
haxe.Unserializer = function(buf) { if( buf === $_ ) return; {
	this.buf = buf;
	this.length = buf.length;
	this.pos = 0;
	this.scache = new Array();
	this.cache = new Array();
	this.setResolver(haxe.Unserializer.DEFAULT_RESOLVER);
}}
haxe.Unserializer.__name__ = ["haxe","Unserializer"];
haxe.Unserializer.initCodes = function() {
	var codes = new Array();
	{
		var _g1 = 0, _g = haxe.Unserializer.BASE64.length;
		while(_g1 < _g) {
			var i = _g1++;
			codes[haxe.Unserializer.BASE64.cca(i)] = i;
		}
	}
	return codes;
}
haxe.Unserializer.run = function(v) {
	return new haxe.Unserializer(v).unserialize();
}
haxe.Unserializer.prototype.buf = null;
haxe.Unserializer.prototype.cache = null;
haxe.Unserializer.prototype.get = function(p) {
	return this.buf.cca(p);
}
haxe.Unserializer.prototype.length = null;
haxe.Unserializer.prototype.pos = null;
haxe.Unserializer.prototype.readDigits = function() {
	var k = 0;
	var s = false;
	var fpos = this.pos;
	while(true) {
		var c = this.buf.cca(this.pos);
		if(Math.isNaN(c)) break;
		if(c == 45) {
			if(this.pos != fpos) break;
			s = true;
			this.pos++;
			continue;
		}
		c -= 48;
		if(c < 0 || c > 9) break;
		k = k * 10 + c;
		this.pos++;
	}
	if(s) k *= -1;
	return k;
}
haxe.Unserializer.prototype.resolver = null;
haxe.Unserializer.prototype.scache = null;
haxe.Unserializer.prototype.setResolver = function(r) {
	if(r == null) this.resolver = { resolveClass : function(_) {
		return null;
	}, resolveEnum : function(_) {
		return null;
	}}
	else this.resolver = r;
}
haxe.Unserializer.prototype.unserialize = function() {
	switch(this.buf.cca(this.pos++)) {
	case 110:{
		return null;
	}break;
	case 116:{
		return true;
	}break;
	case 102:{
		return false;
	}break;
	case 122:{
		return 0;
	}break;
	case 105:{
		return this.readDigits();
	}break;
	case 100:{
		var p1 = this.pos;
		while(true) {
			var c = this.buf.cca(this.pos);
			if((c >= 43 && c < 58) || c == 101 || c == 69) this.pos++;
			else break;
		}
		return Std.parseFloat(this.buf.substr(p1,this.pos - p1));
	}break;
	case 121:{
		var len = this.readDigits();
		if(this.buf.charAt(this.pos++) != ":" || this.length - this.pos < len) throw "Invalid string length";
		var s = this.buf.substr(this.pos,len);
		this.pos += len;
		s = StringTools.urlDecode(s);
		this.scache.push(s);
		return s;
	}break;
	case 107:{
		return Math.NaN;
	}break;
	case 109:{
		return Math.NEGATIVE_INFINITY;
	}break;
	case 112:{
		return Math.POSITIVE_INFINITY;
	}break;
	case 97:{
		var buf = this.buf;
		var a = new Array();
		this.cache.push(a);
		while(true) {
			var c = this.buf.cca(this.pos);
			if(c == 104) {
				this.pos++;
				break;
			}
			if(c == 117) {
				this.pos++;
				var n = this.readDigits();
				a[a.length + n - 1] = null;
			}
			else a.push(this.unserialize());
		}
		return a;
	}break;
	case 111:{
		var o = { }
		this.cache.push(o);
		this.unserializeObject(o);
		return o;
	}break;
	case 114:{
		var n = this.readDigits();
		if(n < 0 || n >= this.cache.length) throw "Invalid reference";
		return this.cache[n];
	}break;
	case 82:{
		var n = this.readDigits();
		if(n < 0 || n >= this.scache.length) throw "Invalid string reference";
		return this.scache[n];
	}break;
	case 120:{
		throw this.unserialize();
	}break;
	case 99:{
		var name = this.unserialize();
		var cl = this.resolver.resolveClass(name);
		if(cl == null) throw "Class not found " + name;
		var o = Type.createEmptyInstance(cl);
		this.cache.push(o);
		this.unserializeObject(o);
		return o;
	}break;
	case 119:{
		var name = this.unserialize();
		var edecl = this.resolver.resolveEnum(name);
		if(edecl == null) throw "Enum not found " + name;
		return this.unserializeEnum(edecl,this.unserialize());
	}break;
	case 106:{
		var name = this.unserialize();
		var edecl = this.resolver.resolveEnum(name);
		if(edecl == null) throw "Enum not found " + name;
		this.pos++;
		var index = this.readDigits();
		var tag = Type.getEnumConstructs(edecl)[index];
		if(tag == null) throw "Unknown enum index " + name + "@" + index;
		return this.unserializeEnum(edecl,tag);
	}break;
	case 108:{
		var l = new List();
		this.cache.push(l);
		var buf = this.buf;
		while(this.buf.cca(this.pos) != 104) l.add(this.unserialize());
		this.pos++;
		return l;
	}break;
	case 98:{
		var h = new Hash();
		this.cache.push(h);
		var buf = this.buf;
		while(this.buf.cca(this.pos) != 104) {
			var s = this.unserialize();
			h.set(s,this.unserialize());
		}
		this.pos++;
		return h;
	}break;
	case 113:{
		var h = new IntHash();
		this.cache.push(h);
		var buf = this.buf;
		var c = this.buf.cca(this.pos++);
		while(c == 58) {
			var i = this.readDigits();
			h.set(i,this.unserialize());
			c = this.buf.cca(this.pos++);
		}
		if(c != 104) throw "Invalid IntHash format";
		return h;
	}break;
	case 118:{
		var d = Date.fromString(this.buf.substr(this.pos,19));
		this.cache.push(d);
		this.pos += 19;
		return d;
	}break;
	case 115:{
		var len = this.readDigits();
		var buf = this.buf;
		if(buf.charAt(this.pos++) != ":" || this.length - this.pos < len) throw "Invalid bytes length";
		var codes = haxe.Unserializer.CODES;
		if(codes == null) {
			codes = haxe.Unserializer.initCodes();
			haxe.Unserializer.CODES = codes;
		}
		var b = new haxe.io.BytesBuffer();
		var i = this.pos;
		var rest = len & 3;
		var max = i + (len - rest);
		while(i < max) {
			var c1 = codes[buf.cca(i++)];
			var c2 = codes[buf.cca(i++)];
			b.b.push((c1 << 2) | (c2 >> 4));
			var c3 = codes[buf.cca(i++)];
			b.b.push(((c2 << 4) | (c3 >> 2)) & 255);
			var c4 = codes[buf.cca(i++)];
			b.b.push(((c3 << 6) | c4) & 255);
		}
		if(rest >= 2) {
			var c1 = codes[buf.cca(i++)];
			var c2 = codes[buf.cca(i++)];
			b.b.push((c1 << 2) | (c2 >> 4));
			if(rest == 3) {
				var c3 = codes[buf.cca(i++)];
				b.b.push(((c2 << 4) | (c3 >> 2)) & 255);
			}
		}
		var bytes = b.getBytes();
		this.pos += len;
		this.cache.push(bytes);
		return bytes;
	}break;
	default:{
		null;
	}break;
	}
	this.pos--;
	throw ("Invalid char " + this.buf.charAt(this.pos) + " at position " + this.pos);
}
haxe.Unserializer.prototype.unserializeEnum = function(edecl,tag) {
	var constr = Reflect.field(edecl,tag);
	if(constr == null) throw "Unknown enum tag " + Type.getEnumName(edecl) + "." + tag;
	if(this.buf.cca(this.pos++) != 58) throw "Invalid enum format";
	var nargs = this.readDigits();
	if(nargs == 0) {
		this.cache.push(constr);
		return constr;
	}
	var args = new Array();
	while(nargs > 0) {
		args.push(this.unserialize());
		nargs -= 1;
	}
	var e = constr.apply(edecl,args);
	this.cache.push(e);
	return e;
}
haxe.Unserializer.prototype.unserializeObject = function(o) {
	while(true) {
		if(this.pos >= this.length) throw "Invalid object";
		if(this.buf.cca(this.pos) == 103) break;
		var k = this.unserialize();
		if(!Std["is"](k,String)) throw "Invalid object key";
		var v = this.unserialize();
		o[k] = v;
	}
	this.pos++;
}
haxe.Unserializer.prototype.__class__ = haxe.Unserializer;
com.inq.flash.client.data.ChatAutomatonResponseMessage = function(chat,eventName,data) { if( chat === $_ ) return; {
	com.inq.flash.messagingframework.Message.apply(this,[]);
	this.setPostSend(true);
	this.setMessageType(com.inq.flash.client.data.MessageFields.TYPE_CHAT_AUTOMATON_RESPONSE);
	this.addProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_ID,chat.getChatID());
	this.addProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_AUTOMATON_EVENT,com.inq.flash.messagingframework.StringUtils.encodeStringForMessage(eventName));
	if(data) {
		if(data.type) {
			this.addProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_AUTOMATON_TYPE,data.type);
		}
		if(data.id) {
			this.addProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_AUTOMATON_ID,data.id);
		}
		if(data.state) {
			this.addProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_AUTOMATON_STATE,data.state);
		}
		if(data.model) {
			this.addProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_AUTOMATON_DATA_MODEL,data.model);
		}
		if(data.answerText) {
			this.addProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_AUTOMATON_DATA,data.answerText);
		}
	}
}}
com.inq.flash.client.data.ChatAutomatonResponseMessage.__name__ = ["com","inq","flash","client","data","ChatAutomatonResponseMessage"];
com.inq.flash.client.data.ChatAutomatonResponseMessage.__super__ = com.inq.flash.messagingframework.Message;
for(var k in com.inq.flash.messagingframework.Message.prototype ) com.inq.flash.client.data.ChatAutomatonResponseMessage.prototype[k] = com.inq.flash.messagingframework.Message.prototype[k];
com.inq.flash.client.data.ChatAutomatonResponseMessage.prototype.__class__ = com.inq.flash.client.data.ChatAutomatonResponseMessage;
com.inq.stage.Move = function(p) { if( p === $_ ) return; {
	com.inq.stage.DragResize.apply(this,[]);
	this.className = "Move";
	this.cursor = "move";
}}
com.inq.stage.Move.__name__ = ["com","inq","stage","Move"];
com.inq.stage.Move.__super__ = com.inq.stage.DragResize;
for(var k in com.inq.stage.DragResize.prototype ) com.inq.stage.Move.prototype[k] = com.inq.stage.DragResize.prototype[k];
com.inq.stage.Move.setDragable = function() {
	if(window.parent.name == "_inqPersistentChat") return;
	var instance = new com.inq.stage.Move();
	var cntr = window.parent.document.getElementById("inqChatStage");
	var dragHandleElem = window.parent.document.getElementById("inqTitleBar");
	instance.init(dragHandleElem,cntr);
}
com.inq.stage.Move.prototype.getDefaultMax = function() {
	var width = Std.parseInt(this.root.style.width);
	var height = Std.parseInt(this.root.style.height);
	return { X : com.inq.flash.client.chatskins.ScrollMonitor.getScrollLeft() + com.inq.flash.client.chatskins.ScrollMonitor.getScrollWidth() - width, Y : com.inq.flash.client.chatskins.ScrollMonitor.getScrollTop() + com.inq.flash.client.chatskins.ScrollMonitor.getScrollHeight() - height}
}
com.inq.stage.Move.prototype.getDefaultMin = function() {
	return { X : com.inq.flash.client.chatskins.ScrollMonitor.getScrollLeft(), Y : com.inq.flash.client.chatskins.ScrollMonitor.getScrollTop()}
}
com.inq.stage.Move.prototype.setDragBorder = function() {
	var rootHeight = Std.parseInt(this.root.style.height);
	var rootWidth = Std.parseInt(this.root.style.width);
	var borderWidth = 7;
	this.obj.style.cursor = this.cursor;
	this.obj.style.borderStyle = "solid";
	this.obj.style.borderWidth = borderWidth + "px";
	this.obj.style.borderColor = ((null == Application.application.skinConfig["dragBorderColor"])?com.inq.stage.DragResize.DEFAULT_BORDER_COLOR:Application.application.skinConfig.dragBorderColor);
	this.obj.style.height = (rootHeight - borderWidth) + "px";
	this.obj.style.width = (rootWidth - borderWidth) + "px";
}
com.inq.stage.Move.prototype.setLeft = function(left) {
	this.obj.style.left = left + "px";
}
com.inq.stage.Move.prototype.setTop = function(top) {
	var o = this.obj;
	o.style.top = top + "px";
}
com.inq.stage.Move.prototype.whenDone = function() {
	this.root.style.left = this.pDraggerNow.X + "px";
	this.root.style.top = this.pDraggerNow.Y + "px";
	var position = { X : this.pDraggerNow.X, Y : this.pDraggerNow.Y}
	Application.MoveStage(position.X,position.Y);
}
com.inq.stage.Move.prototype.__class__ = com.inq.stage.Move;
com.inq.stage.Move.__interfaces__ = [com.inq.stage.IDragResize];
com.inq.flash.messagingframework.MessageRouter = function(p) { if( p === $_ ) return; {
	this.handlers = new com.inq.utils.Dictionary();
}}
com.inq.flash.messagingframework.MessageRouter.__name__ = ["com","inq","flash","messagingframework","MessageRouter"];
com.inq.flash.messagingframework.MessageRouter.prototype.handlers = null;
com.inq.flash.messagingframework.MessageRouter.prototype.processMessage = function(message) {
	try {
		var keyz = Reflect.fields(this.handlers);
		{
			var _g1 = 0, _g = keyz.length;
			while(_g1 < _g) {
				var i = _g1++;
				var handlerName = keyz[i];
				var handler = this.handlers[handlerName];
				var handlerMsgType = handler.getMessageType();
				if(message.getMessageType().indexOf(handlerMsgType) == 0) {
					try {
						handler.processMessage(message);
						haxe.Log.trace("handler processed " + handlerName,{ fileName : "MessageRouter.hx", lineNumber : 34, className : "com.inq.flash.messagingframework.MessageRouter", methodName : "processMessage"});
					}
					catch( $e210 ) {
						if( js.Boot.__instanceof($e210,Error) ) {
							var e = $e210;
							{
								haxe.Log.trace("handler.processMessage(message) throws " + e,{ fileName : "MessageRouter.hx", lineNumber : 37, className : "com.inq.flash.messagingframework.MessageRouter", methodName : "processMessage", customParams : ["error"]});
							}
						} else throw($e210);
					}
					return;
				}
			}
		}
		haxe.Log.trace("message has no handler;\n" + "messageType: " + message.getMessageType(),{ fileName : "MessageRouter.hx", lineNumber : 42, className : "com.inq.flash.messagingframework.MessageRouter", methodName : "processMessage", customParams : ["warn"]});
	}
	catch( $e211 ) {
		if( js.Boot.__instanceof($e211,Error) ) {
			var e = $e211;
			{
				haxe.Log.trace("Error: " + e,{ fileName : "MessageRouter.hx", lineNumber : 44, className : "com.inq.flash.messagingframework.MessageRouter", methodName : "processMessage", customParams : ["error"]});
			}
		} else throw($e211);
	}
	haxe.Log.trace("exit",{ fileName : "MessageRouter.hx", lineNumber : 46, className : "com.inq.flash.messagingframework.MessageRouter", methodName : "processMessage"});
}
com.inq.flash.messagingframework.MessageRouter.prototype.registerMessageHandler = function(messageHandler) {
	this.handlers[messageHandler.getMessageType()] = messageHandler;
}
com.inq.flash.messagingframework.MessageRouter.prototype.__class__ = com.inq.flash.messagingframework.MessageRouter;
com.inq.flash.client.control.messagehandlers.ChatDeniedMessageHandler = function(p) { if( p === $_ ) return; {
	com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.apply(this,[com.inq.flash.client.data.MessageFields.TYPE_CHAT_DENIED]);
}}
com.inq.flash.client.control.messagehandlers.ChatDeniedMessageHandler.__name__ = ["com","inq","flash","client","control","messagehandlers","ChatDeniedMessageHandler"];
com.inq.flash.client.control.messagehandlers.ChatDeniedMessageHandler.__super__ = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler;
for(var k in com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype ) com.inq.flash.client.control.messagehandlers.ChatDeniedMessageHandler.prototype[k] = com.inq.flash.client.control.messagehandlers.ClientApplicationMessageHandler.prototype[k];
com.inq.flash.client.control.messagehandlers.ChatDeniedMessageHandler.prototype.processMessage = function(message) {
	var deniedMessageLabel = message.getProperty(com.inq.flash.client.data.MessageFields.KEY_TY_LABEL);
	if(deniedMessageLabel != null && deniedMessageLabel != "undefined" && deniedMessageLabel != "null") {
		com.inq.flash.client.chatskins.SkinControl.tYImageLabel = deniedMessageLabel;
	}
	this.getController().shutdown();
	com.inq.flash.client.chatskins.SkinControl.doThankYou();
	this.getController().disable();
}
com.inq.flash.client.control.messagehandlers.ChatDeniedMessageHandler.prototype.__class__ = com.inq.flash.client.control.messagehandlers.ChatDeniedMessageHandler;
haxe.Http = function(url) { if( url === $_ ) return; {
	this.url = url;
	this.headers = new Hash();
	this.params = new Hash();
	this.async = true;
}}
haxe.Http.__name__ = ["haxe","Http"];
haxe.Http.request = function(url) {
	var h = new haxe.Http(url);
	h.async = false;
	var r = null;
	h.onData = function(d) {
		r = d;
	}
	h.onError = function(e) {
		throw e;
	}
	h.request(false);
	return r;
}
haxe.Http.prototype.async = null;
haxe.Http.prototype.headers = null;
haxe.Http.prototype.onData = function(data) {
	null;
}
haxe.Http.prototype.onError = function(msg) {
	null;
}
haxe.Http.prototype.onStatus = function(status) {
	null;
}
haxe.Http.prototype.params = null;
haxe.Http.prototype.postData = null;
haxe.Http.prototype.request = function(post) {
	var me = this;
	var r = new js.XMLHttpRequest();
	var onreadystatechange = function() {
		if(r.readyState != 4) return;
		var s = function($this) {
			var $r;
			try {
				$r = r.status;
			}
			catch( $e212 ) {
				{
					var e = $e212;
					$r = null;
				}
			}
			return $r;
		}(this);
		if(s == undefined) s = null;
		if(s != null) me.onStatus(s);
		if(s != null && s >= 200 && s < 400) me.onData(r.responseText);
		else switch(s) {
		case null:{
			me.onError("Failed to connect or resolve host");
		}break;
		case 12029:{
			me.onError("Failed to connect to host");
		}break;
		case 12007:{
			me.onError("Unknown host");
		}break;
		default:{
			me.onError("Http Error #" + r.status);
		}break;
		}
	}
	r.onreadystatechange = onreadystatechange;
	var uri = this.postData;
	if(uri != null) post = true;
	else { var $it213 = this.params.keys();
	while( $it213.hasNext() ) { var p = $it213.next();
	{
		if(uri == null) uri = "";
		else uri += "&";
		uri += StringTools.urlDecode(p) + "=" + StringTools.urlEncode(this.params.get(p));
	}
	}}
	try {
		if(post) r.open("POST",this.url,this.async);
		else if(uri != null) {
			var question = this.url.split("?").length <= 1;
			r.open("GET",this.url + ((question?"?":"&")) + uri,this.async);
			uri = null;
		}
		else r.open("GET",this.url,this.async);
	}
	catch( $e214 ) {
		{
			var e = $e214;
			{
				this.onError(e.toString());
				return;
			}
		}
	}
	if(this.headers.get("Content-Type") == null && post && this.postData == null) r.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	{ var $it215 = this.headers.keys();
	while( $it215.hasNext() ) { var h = $it215.next();
	r.setRequestHeader(h,this.headers.get(h));
	}}
	r.send(uri);
	if(!this.async) onreadystatechange();
}
haxe.Http.prototype.setHeader = function(header,value) {
	this.headers.set(header,value);
}
haxe.Http.prototype.setParameter = function(param,value) {
	this.params.set(param,value);
}
haxe.Http.prototype.setPostData = function(data) {
	this.postData = data;
}
haxe.Http.prototype.url = null;
haxe.Http.prototype.__class__ = haxe.Http;
com.inq.flash.client.chatskins.ScrollMonitor = function(p) { if( p === $_ ) return; {
	null;
}}
com.inq.flash.client.chatskins.ScrollMonitor.__name__ = ["com","inq","flash","client","chatskins","ScrollMonitor"];
com.inq.flash.client.chatskins.ScrollMonitor.init = function() {
	com.inq.flash.client.chatskins.ScrollMonitor.clientWin = window.parent;
	com.inq.flash.client.chatskins.ScrollMonitor.clientDoc = parent.document;
	com.inq.flash.client.chatskins.ScrollMonitor._zoomPrev = (com.inq.utils.Capabilities.isMobile()?com.inq.utils.Capabilities.getZoom():0);
	com.inq.flash.client.chatskins.ScrollMonitor.whenScrollClosure = $closure(com.inq.flash.client.chatskins.ScrollMonitor,"whenScroll");
	if(com.inq.flash.client.chatskins.ScrollMonitor.clientWin.name == "_inqPersistentChat") return false;
	com.inq.utils.Capabilities.BindListener(com.inq.flash.client.chatskins.ScrollMonitor.clientWin,"scroll",com.inq.flash.client.chatskins.ScrollMonitor.whenScrollClosure);
	com.inq.utils.Capabilities.BindListener(com.inq.flash.client.chatskins.ScrollMonitor.clientWin,"resize",com.inq.flash.client.chatskins.ScrollMonitor.whenScrollClosure);
	return true;
}
com.inq.flash.client.chatskins.ScrollMonitor.Close = function() {
	com.inq.flash.client.chatskins.ScrollMonitor.clientWin = window.parent;
	com.inq.utils.Capabilities.UnbindListener(com.inq.flash.client.chatskins.ScrollMonitor.clientWin,"scroll",com.inq.flash.client.chatskins.ScrollMonitor.whenScrollClosure);
	com.inq.utils.Capabilities.UnbindListener(com.inq.flash.client.chatskins.ScrollMonitor.clientWin,"resize",com.inq.flash.client.chatskins.ScrollMonitor.whenScrollClosure);
}
com.inq.flash.client.chatskins.ScrollMonitor.suspend = function() {
	com.inq.flash.client.chatskins.ScrollMonitor.suspendedLevel++;
}
com.inq.flash.client.chatskins.ScrollMonitor.resume = function() {
	com.inq.flash.client.chatskins.ScrollMonitor.suspendedLevel--;
}
com.inq.flash.client.chatskins.ScrollMonitor.isSuspended = function() {
	return com.inq.flash.client.chatskins.ScrollMonitor.suspendedLevel > 0;
}
com.inq.flash.client.chatskins.ScrollMonitor.ScrollToPoint = function(p) {
	com.inq.flash.client.chatskins.ScrollMonitor.ScrollTo(p.x,p.y);
}
com.inq.flash.client.chatskins.ScrollMonitor.ScrollTo = function(x,y) {
	com.inq.flash.client.chatskins.ScrollMonitor.suspend();
	window.parent.scrollTo(x,y);
	window.setTimeout($closure(com.inq.flash.client.chatskins.ScrollMonitor,"resume"),100);
}
com.inq.flash.client.chatskins.ScrollMonitor.ScrollToTop = function() {
	com.inq.flash.client.chatskins.ScrollMonitor.ScrollTo(0,0);
}
com.inq.flash.client.chatskins.ScrollMonitor.ScrollToBottom = function() {
	var windowPosition = com.inq.utils.Capabilities.getViewport();
	var x = windowPosition.x;
	var y = window.parent.document.documentElement.offsetHeight;
	com.inq.flash.client.chatskins.ScrollMonitor.ScrollTo(x,y);
}
com.inq.flash.client.chatskins.ScrollMonitor.whenScroll = function(e) {
	if(com.inq.flash.client.chatskins.ScrollMonitor.isSuspended() || com.inq.flash.client.control.MinimizeManager.isMinimized()) {
		return true;
	}
	if(!(com.inq.ui.Stage.getInstance().getVisible())) {
		com.inq.flash.client.chatskins.ScrollMonitor.Close();
		return true;
	}
	com.inq.flash.client.chatskins.ScrollMonitor.numWaiting++;
	window.setTimeout($closure(com.inq.flash.client.chatskins.ScrollMonitor,"moveChat"),500);
	return true;
}
com.inq.flash.client.chatskins.ScrollMonitor.moveChat = function() {
	if(com.inq.flash.client.chatskins.ScrollMonitor.isSuspended()) {
		return;
	}
	else if(--com.inq.flash.client.chatskins.ScrollMonitor.numWaiting > 0) {
		return;
	}
	else if(com.inq.flash.client.control.MinimizeManager.isMinimized()) {
		return;
	}
	else if(!com.inq.utils.Capabilities.isMobile()) {
		var relLeft = com.inq.flash.client.chatskins.ScrollMonitor.getScrollLeft() - com.inq.flash.client.chatskins.ScrollMonitor._scrollLeftPrev;
		var relTop = com.inq.flash.client.chatskins.ScrollMonitor.getScrollTop() - com.inq.flash.client.chatskins.ScrollMonitor._scrollTopPrev;
		Application.ScrollStage(relLeft,relTop);
		com.inq.flash.client.chatskins.ScrollMonitor._scrollLeftPrev = com.inq.flash.client.chatskins.ScrollMonitor.getScrollLeft();
		com.inq.flash.client.chatskins.ScrollMonitor._scrollTopPrev = com.inq.flash.client.chatskins.ScrollMonitor.getScrollTop();
	}
	else if(com.inq.utils.Capabilities.isPhone()) {
		com.inq.flash.client.chatskins.ScrollMonitor.ScrollToBottom();
		var vp = com.inq.utils.Capabilities.getViewport();
		Application.SetArea(vp);
		com.inq.flash.client.chatskins.ScrollMonitor._scrollLeftPrev = vp.x;
		com.inq.flash.client.chatskins.ScrollMonitor._scrollTopPrev = vp.y;
		com.inq.flash.client.chatskins.ScrollMonitor._zoomPrev = com.inq.utils.Capabilities.getZoom();
	}
	else {
		var vp = com.inq.utils.Capabilities.getViewport();
		var z = com.inq.utils.Capabilities.getZoom();
		if(z == com.inq.flash.client.chatskins.ScrollMonitor._zoomPrev && com.inq.flash.client.chatskins.ChatTextFocusMonitor.HasFocus() != true) {
			var relLeft = vp.x - com.inq.flash.client.chatskins.ScrollMonitor._scrollLeftPrev;
			var relTop = vp.y - com.inq.flash.client.chatskins.ScrollMonitor._scrollTopPrev;
			Application.ScrollStageInPage(relLeft,relTop);
		}
		com.inq.flash.client.chatskins.ScrollMonitor._scrollLeftPrev = vp.x;
		com.inq.flash.client.chatskins.ScrollMonitor._scrollTopPrev = vp.y;
		com.inq.flash.client.chatskins.ScrollMonitor._zoomPrev = z;
	}
}
com.inq.flash.client.chatskins.ScrollMonitor.getScrollWidth = function() {
	var iScrollWidth = 0;
	if(com.inq.flash.client.chatskins.ScrollMonitor.clientWin == null) com.inq.flash.client.chatskins.ScrollMonitor.clientWin = window.parent;
	if(com.inq.flash.client.chatskins.ScrollMonitor.clientDoc == null) com.inq.flash.client.chatskins.ScrollMonitor.clientDoc = com.inq.flash.client.chatskins.ScrollMonitor.clientWin.document;
	if(null == com.inq.flash.client.chatskins.ScrollMonitor.clientWin["innerWidth"]) {
		iScrollWidth = ((com.inq.flash.client.chatskins.ScrollMonitor.clientDoc["documentElement"] != null)?(((0 != com.inq.flash.client.chatskins.ScrollMonitor.clientDoc.documentElement.clientWidth)?com.inq.flash.client.chatskins.ScrollMonitor.clientDoc.documentElement.clientWidth:com.inq.flash.client.chatskins.ScrollMonitor.clientDoc.body.clientWidth)):com.inq.flash.client.chatskins.ScrollMonitor.clientDoc.body.clientWidth);
	}
	else {
		iScrollWidth = com.inq.flash.client.chatskins.ScrollMonitor.clientWin.innerWidth;
		if(0 == iScrollWidth) iScrollWidth = com.inq.flash.client.chatskins.ScrollMonitor.clientDoc.body.clientWidth;
	}
	return iScrollWidth;
}
com.inq.flash.client.chatskins.ScrollMonitor.getScrollHeight = function() {
	var iScrollHeight = 0;
	if(com.inq.flash.client.chatskins.ScrollMonitor.clientWin == null) com.inq.flash.client.chatskins.ScrollMonitor.clientWin = window.parent;
	if(com.inq.flash.client.chatskins.ScrollMonitor.clientDoc == null) com.inq.flash.client.chatskins.ScrollMonitor.clientDoc = com.inq.flash.client.chatskins.ScrollMonitor.clientWin.document;
	if(null == com.inq.flash.client.chatskins.ScrollMonitor.clientWin["innerHeight"]) {
		iScrollHeight = ((com.inq.flash.client.chatskins.ScrollMonitor.clientDoc["documentElement"] != null)?(((0 != com.inq.flash.client.chatskins.ScrollMonitor.clientDoc.documentElement.clientHeight)?com.inq.flash.client.chatskins.ScrollMonitor.clientDoc.documentElement.clientHeight:com.inq.flash.client.chatskins.ScrollMonitor.clientDoc.body.clientHeight)):com.inq.flash.client.chatskins.ScrollMonitor.clientDoc.body.clientHeight);
	}
	else {
		iScrollHeight = com.inq.flash.client.chatskins.ScrollMonitor.clientWin.innerHeight;
		if(0 == iScrollHeight) iScrollHeight = com.inq.flash.client.chatskins.ScrollMonitor.clientDoc.body.clientHeight;
	}
	return iScrollHeight;
}
com.inq.flash.client.chatskins.ScrollMonitor.getScrollTop = function() {
	try {
		var clientWin = window.parent;
		var clientDoc = clientWin.document;
		if(null != clientWin["pageYOffset"]) {
			com.inq.flash.client.chatskins.ScrollMonitor._scrollTop = clientWin.pageYOffset;
			return com.inq.flash.client.chatskins.ScrollMonitor._scrollTop;
		}
		if(clientDoc["documentElement"] != null && clientDoc.documentElement["scrollTop"] != null && clientDoc.documentElement.scrollTop != 0) com.inq.flash.client.chatskins.ScrollMonitor._scrollTop = clientDoc.documentElement.scrollTop;
		else com.inq.flash.client.chatskins.ScrollMonitor._scrollTop = clientDoc.body.scrollTop;
		return com.inq.flash.client.chatskins.ScrollMonitor._scrollTop;
	}
	catch( $e216 ) {
		if( js.Boot.__instanceof($e216,String) ) {
			var msg = $e216;
			{
				haxe.Log.trace("error in ScrollMonitor getScrollTop: " + msg,{ fileName : "ScrollMonitor.hx", lineNumber : 234, className : "com.inq.flash.client.chatskins.ScrollMonitor", methodName : "getScrollTop"});
				return 0;
			}
		} else throw($e216);
	}
}
com.inq.flash.client.chatskins.ScrollMonitor.getScrollLeft = function() {
	try {
		var clientWin = window.parent;
		var clientDoc = clientWin.document;
		if(null != clientWin["pageXOffset"]) {
			com.inq.flash.client.chatskins.ScrollMonitor._scrollLeft = clientWin.pageXOffset;
			return com.inq.flash.client.chatskins.ScrollMonitor._scrollLeft;
		}
		if(clientDoc["documentElement"] != null && clientDoc.documentElement["scrollLeft"] != null && clientDoc.documentElement.scrollLeft != 0) com.inq.flash.client.chatskins.ScrollMonitor._scrollLeft = clientDoc.documentElement.scrollLeft;
		else com.inq.flash.client.chatskins.ScrollMonitor._scrollLeft = clientDoc.body.scrollLeft;
		return com.inq.flash.client.chatskins.ScrollMonitor._scrollLeft;
	}
	catch( $e217 ) {
		if( js.Boot.__instanceof($e217,String) ) {
			var msg = $e217;
			{
				haxe.Log.trace("error in ScrollMonitor getScrollLeft: " + msg,{ fileName : "ScrollMonitor.hx", lineNumber : 258, className : "com.inq.flash.client.chatskins.ScrollMonitor", methodName : "getScrollLeft"});
				return 0;
			}
		} else throw($e217);
	}
}
com.inq.flash.client.chatskins.ScrollMonitor.getScrollBarWidth = function() {
	var scr = null;
	var inn = null;
	var wNoScroll = 0;
	var wScroll = 0;
	scr = window.parent.document.createElement("div");
	scr.style.position = "absolute";
	scr.style.top = "-1000px";
	scr.style.left = "-1000px";
	scr.style.width = "100px";
	scr.style.height = "50px";
	scr.style.overflow = "hidden";
	inn = window.parent.document.createElement("div");
	inn.style.width = "100%";
	inn.style.height = "200px";
	scr.appendChild(inn);
	window.parent.document.body.appendChild(scr);
	wNoScroll = inn.offsetWidth;
	scr.style.overflow = "auto";
	wScroll = inn.offsetWidth;
	window.parent.document.body.removeChild(window.parent.document.body.lastChild);
	return (wNoScroll - wScroll);
}
com.inq.flash.client.chatskins.ScrollMonitor.prototype.__class__ = com.inq.flash.client.chatskins.ScrollMonitor;
com.inq.ui.Stage = function(p) { if( p === $_ ) return; {
	com.inq.ui.Container.apply(this,[window.frameElement]);
}}
com.inq.ui.Stage.__name__ = ["com","inq","ui","Stage"];
com.inq.ui.Stage.__super__ = com.inq.ui.Container;
for(var k in com.inq.ui.Container.prototype ) com.inq.ui.Stage.prototype[k] = com.inq.ui.Container.prototype[k];
com.inq.ui.Stage.height = null;
com.inq.ui.Stage.width = null;
com.inq.ui.Stage.stageLeft = null;
com.inq.ui.Stage.stageTop = null;
com.inq.ui.Stage.getInstance = function() {
	if(com.inq.ui.Stage.stage == null) com.inq.ui.Stage.stage = new com.inq.ui.Stage();
	return com.inq.ui.Stage.stage;
}
com.inq.ui.Stage.getterStageHeight = function() {
	var stageHeight;
	var style = window.frameElement.style;
	stageHeight = ((style.height.indexOf("%") != 0)?((window["innerHeight"] != null)?window.innerHeight:com.inq.ui.Stage.getOffsetHeight()):Std.parseInt(style.height));
	return stageHeight;
}
com.inq.ui.Stage.getterStageWidth = function() {
	var stageWidth;
	var style = window.frameElement.style;
	stageWidth = ((style.width.indexOf("%") != 0)?((window["innerWidth"] != null)?window.innerWidth:com.inq.ui.Stage.getOffsetWidth()):Std.parseInt(style.width));
	return stageWidth;
}
com.inq.ui.Stage.getOffsetHeight = function() {
	var iOffsetHeight = 0;
	var iframeWin = window;
	var iframeDoc = iframeWin.document;
	if(null == iframeWin["innerHeight"]) {
		iOffsetHeight = ((iframeDoc["documentElement"] != null)?((0 != iframeDoc.documentElement.offsetHeight)?iframeDoc.documentElement.offsetHeight:iframeDoc.body.offsetHeight):iframeDoc.body.offsetHeight);
		if(0 == iOffsetHeight) iOffsetHeight = iframeDoc.body.offsetHeight;
	}
	else {
		iOffsetHeight = iframeWin.innerHeight;
	}
	return iOffsetHeight;
}
com.inq.ui.Stage.getStageLeft = function() {
	return Std.parseInt(com.inq.ui.Stage.getStageElement().style.left);
}
com.inq.ui.Stage.getStageTop = function() {
	return Std.parseInt(com.inq.ui.Stage.getStageElement().style.top);
}
com.inq.ui.Stage.getOffsetWidth = function() {
	var iOffsetWidth = 0;
	var iframeWin = window;
	var iframeDoc = iframeWin.document;
	if(null == iframeWin["innerWidth"]) {
		iOffsetWidth = ((iframeDoc["documentElement"] != null)?((0 != iframeDoc.documentElement.offsetWidth)?iframeDoc.documentElement.offsetWidth:iframeDoc.body.offsetWidth):iframeDoc.body.offsetWidth);
		if(0 == iOffsetWidth) iOffsetWidth = iframeDoc.body.offsetWidth;
	}
	else {
		iOffsetWidth = iframeWin.innerWidth;
	}
	return iOffsetWidth;
}
com.inq.ui.Stage.getStageElement = function() {
	try {
		var skinDiv = window.parent.document.getElementById("tcChat_Skin");
		if(skinDiv != null) {
			if(com.inq.ui.Stage.stage._div != skinDiv) {
				skinDiv.style.cssText = com.inq.ui.Stage.stage._div.style.cssText;
				var width = Std.parseInt(com.inq.ui.Stage.stage._div.style.width);
				var height = Std.parseInt(com.inq.ui.Stage.stage._div.style.height);
				var iframe = window.frameElement;
				if(iframe != null) iframe.style.display = "none";
				com.inq.ui.Stage.stage._div = skinDiv;
				Application.MoveSizeDiv2Stage(width,height);
			}
		}
	}
	catch( $e218 ) {
		{
			var e = $e218;
			null;
		}
	}
	return com.inq.ui.Stage.stage._div;
}
com.inq.ui.Stage.prototype.focus = null;
com.inq.ui.Stage.prototype.setObjectFocus = function(object) {
	this.focus = object;
	object.setFocus();
}
com.inq.ui.Stage.prototype.setVisible = function(_visible) {
	try {
		com.inq.ui.Stage.getStageElement();
		this.styles.visible = ((_visible)?"true":"false");
		this._div.style.display = ((_visible)?"":"none");
		if(window.parent.name != "_inqPersistentChat") {
			com.inq.ui.Stage._dragBar.style.display = ((_visible)?"":"none");
			com.inq.ui.Stage._resizeCorner.style.display = ((_visible)?"":"none");
		}
	}
	catch( $e219 ) {
		{
			var e = $e219;
			null;
		}
	}
}
com.inq.ui.Stage.prototype.__class__ = com.inq.ui.Stage;
com.inq.flash.client.data.ChatEngageMessage = function(chat,agentOutcome,clientOutcome,agentAlias) { if( chat === $_ ) return; {
	com.inq.flash.client.data.ChatCommunicationMessage.apply(this,[chat,agentOutcome]);
	this.setMessageType(com.inq.flash.client.data.MessageFields.TYPE_CHAT_COMMUNICATION_OUTCOME);
	this.addProperty(com.inq.flash.client.data.MessageFields.KEY_CHAT_ID,chat.getChatID());
	this.addProperty(com.inq.flash.client.data.MessageFields.KEY_AGENT_ALIAS,agentAlias);
	if(clientOutcome != "") {
		this.addProperty(com.inq.flash.client.data.MessageFields.KEY_CLIENT_OUTCOME_DATA,com.inq.flash.messagingframework.StringUtils.encodeStringForMessage(clientOutcome));
	}
}}
com.inq.flash.client.data.ChatEngageMessage.__name__ = ["com","inq","flash","client","data","ChatEngageMessage"];
com.inq.flash.client.data.ChatEngageMessage.__super__ = com.inq.flash.client.data.ChatCommunicationMessage;
for(var k in com.inq.flash.client.data.ChatCommunicationMessage.prototype ) com.inq.flash.client.data.ChatEngageMessage.prototype[k] = com.inq.flash.client.data.ChatCommunicationMessage.prototype[k];
com.inq.flash.client.data.ChatEngageMessage.prototype.__class__ = com.inq.flash.client.data.ChatEngageMessage;
com.inq.ui.LineInput = function(_id) { if( _id === $_ ) return; {
	com.inq.ui.AbstractTextInput.apply(this,[_id]);
	this._div.innerHTML = "<input type=\"text\" style=\"height:100%;width:100%\"></input>";
	this.setupInput(this._div.getElementsByTagName("input")[0]);
}}
com.inq.ui.LineInput.__name__ = ["com","inq","ui","LineInput"];
com.inq.ui.LineInput.__super__ = com.inq.ui.AbstractTextInput;
for(var k in com.inq.ui.AbstractTextInput.prototype ) com.inq.ui.LineInput.prototype[k] = com.inq.ui.AbstractTextInput.prototype[k];
com.inq.ui.LineInput.prototype.__class__ = com.inq.ui.LineInput;
com.inq.ui.TextField = function(p) { if( p === $_ ) return; {
	null;
}}
com.inq.ui.TextField.__name__ = ["com","inq","ui","TextField"];
com.inq.ui.TextField.prototype.__class__ = com.inq.ui.TextField;
com.inq.flash.client.control.MinimizeManager = function() { }
com.inq.flash.client.control.MinimizeManager.__name__ = ["com","inq","flash","client","control","MinimizeManager"];
com.inq.flash.client.control.MinimizeManager.count = null;
com.inq.flash.client.control.MinimizeManager.minimized = null;
com.inq.flash.client.control.MinimizeManager.onClose = function() {
	if(((com.inq.flash.client.control.PersistenceManager.GetValue("rm",com.inq.flash.client.control.MinimizeManager.count) == com.inq.flash.client.control.MinimizeManager.IS_MINIMIZED) || (com.inq.flash.client.control.MinimizeManager.btnRestore == null)) && (com.inq.flash.client.control.MinimizeManager.minimized)) {
		var tY = com.inq.flash.client.control.FlashPeer.isThankYouEnabled();
		if(!tY) {
			com.inq.flash.client.chatskins.SkinControl.actionBtnCloseChat(null);
			return;
		}
		com.inq.flash.client.control.MinimizeManager.Restore();
	}
	com.inq.flash.client.control.MinimizeManager.Restore();
}
com.inq.flash.client.control.MinimizeManager.lastAgentMessage = function(agentMsg) {
	if(agentMsg != null && agentMsg.length > 0 && com.inq.flash.client.control.MinimizeManager.isMinimized()) {
		com.inq.flash.client.control.MinimizeManager.count++;
		com.inq.flash.client.control.PersistenceManager.SetValue("mc",com.inq.flash.client.control.MinimizeManager.count);
		com.inq.flash.client.control.MinimizeManager.displayAgentMessageAndCount(agentMsg);
	}
	if((com.inq.flash.client.control.PersistenceManager.GetValue("rm",com.inq.flash.client.control.MinimizeManager.count) == com.inq.flash.client.control.MinimizeManager.IS_MINIMIZED) || (com.inq.flash.client.control.MinimizeManager.btnRestore == null)) {
		if(com.inq.flash.client.control.MinimizeManager.minimized) {
			com.inq.flash.client.chatskins.SkinControl.getApplicationController().sendRestoredMessage();
		}
		com.inq.flash.client.control.MinimizeManager.Restore();
	}
}
com.inq.flash.client.control.MinimizeManager.showCloseButton = function() {
	var btnClose = Application.application.btnCloseChat;
	if(btnClose != null) {
		btnClose.setVisible(true);
		if(null != com.inq.flash.client.control.MinimizeManager.btnReallyMinimized) {
			com.inq.flash.client.control.MinimizeManager.btnReallyMinimized.setVisible(false);
		}
		if(null != com.inq.flash.client.control.MinimizeManager.btnMinimize) {
			com.inq.flash.client.control.MinimizeManager.btnMinimize.setVisible(false);
			com.inq.flash.client.control.MinimizeManager.btnMinimize = null;
		}
	}
}
com.inq.flash.client.control.MinimizeManager.displayAgentMessageAndCount = function(agentMsg) {
	if(agentMsg != null && agentMsg.length > 0 && com.inq.flash.client.control.MinimizeManager.isMinimized() && com.inq.flash.client.control.MinimizeManager.count > 0) {
		if(com.inq.flash.client.control.MinimizeManager.agentMsgCounter != null) com.inq.flash.client.control.MinimizeManager.agentMsgCounter._setText("" + com.inq.flash.client.control.MinimizeManager.count);
		if(com.inq.flash.client.control.MinimizeManager.agentText != null) com.inq.flash.client.control.MinimizeManager.agentText._setText(agentMsg);
		com.inq.flash.client.control.MinimizeManager.agentMsgCounter.setVisible(true);
		com.inq.flash.client.control.MinimizeManager.agentText.setVisible(true);
	}
}
com.inq.flash.client.control.MinimizeManager.init = function() {
	com.inq.flash.client.control.MinimizeManager.count = 0;
	com.inq.flash.client.control.MinimizeManager.minimized = false;
	if(com.inq.flash.client.control.MinimizeManager.btnReallyMinimized == null) com.inq.flash.client.control.MinimizeManager.btnReallyMinimized = Application.application["btnReallyMinimized"];
	if(com.inq.flash.client.control.MinimizeManager.btnRestore == null) com.inq.flash.client.control.MinimizeManager.btnRestore = Application.application["btnRestore"];
	if(com.inq.flash.client.control.MinimizeManager.btnMinimize == null) com.inq.flash.client.control.MinimizeManager.btnMinimize = Application.application["btnMinimize"];
	if(com.inq.flash.client.control.MinimizeManager.btnReallyMinimized != null && com.inq.flash.client.control.MinimizeManager.btnReallyMinimized.getStyle("floatRight") != null && com.inq.flash.client.control.MinimizeManager.btnReallyMinimized.getStyle("right") != null) {
		com.inq.flash.client.control.MinimizeManager.movedMinimize = Std.parseInt(com.inq.flash.client.control.MinimizeManager.btnReallyMinimized.getStyle("floatRight")) + Std.parseInt(com.inq.flash.client.control.MinimizeManager.btnReallyMinimized.getStyle("right"));
	}
	com.inq.flash.client.control.MinimizeManager.elMinimized = Application.application["Minimized"];
	if(!com.inq.flash.client.chatskins.SkinControl.getIsPersistentChat()) {
		com.inq.flash.client.control.MinimizeManager.inqChatStage = Application.application["inqChatStage"];
		com.inq.flash.client.control.MinimizeManager.agentMsgCounter = Application.application["agentMsgCounter"];
		com.inq.flash.client.control.MinimizeManager.agentText = Application.application["agentText"];
		com.inq.flash.client.control.MinimizeManager.turnOffScaling(true);
		if(com.inq.flash.client.control.MinimizeManager.btnMinimize != null) {
			com.inq.flash.client.control.MinimizeManager.btnMinimize.addEventListener(com.inq.events.MouseEvent.CLICK,$closure(com.inq.flash.client.control.MinimizeManager,"actionMinimize"));
		}
		if(com.inq.flash.client.control.MinimizeManager.btnRestore != null) {
			com.inq.flash.client.control.MinimizeManager.btnRestore.addEventListener(com.inq.events.MouseEvent.CLICK,$closure(com.inq.flash.client.control.MinimizeManager,"actionRestore"));
		}
		if(com.inq.flash.client.control.MinimizeManager.btnReallyMinimized != null) {
			com.inq.flash.client.control.MinimizeManager.btnReallyMinimized.addEventListener(com.inq.events.MouseEvent.CLICK,$closure(com.inq.flash.client.control.MinimizeManager,"actionReallyMinimize"));
		}
		var clientWin = window.parent;
		if(!com.inq.utils.Capabilities.isCSSFixedPositionSupported()) {
			com.inq.utils.Capabilities.BindListener(clientWin,"scroll",$closure(com.inq.flash.client.control.MinimizeManager,"floatMinimized"));
			com.inq.utils.Capabilities.BindListener(clientWin,"resize",$closure(com.inq.flash.client.control.MinimizeManager,"floatMinimized"));
			com.inq.utils.Capabilities.BindListener(clientWin,"orientationchange",$closure(com.inq.flash.client.control.MinimizeManager,"floatMinimized"));
		}
		if(com.inq.flash.client.control.MinimizeManager.btnReallyMinimized != null && com.inq.flash.client.control.MinimizeManager.btnReallyMinimized.getStyle("neverShow") != null && com.inq.flash.client.control.MinimizeManager.btnReallyMinimized.getStyle("neverShow") == "true" && com.inq.flash.client.control.PersistenceManager.GetValue("rm",com.inq.flash.client.control.MinimizeManager.count) == com.inq.flash.client.control.MinimizeManager.SHOW_FAKE_MINIMIZE) {
			if(com.inq.flash.client.chatskins.SkinControl.isInApplication("btnCloseChat")) {
				var btnClose = Application.application.btnCloseChat;
				btnClose.setVisible(true);
			}
			com.inq.flash.client.control.MinimizeManager.btnReallyMinimized.setVisible(false);
		}
		else if(com.inq.flash.client.control.MinimizeManager.btnReallyMinimized != null && com.inq.flash.client.control.MinimizeManager.btnReallyMinimized.getStyle("neverShow") != null && com.inq.flash.client.control.MinimizeManager.btnReallyMinimized.getStyle("neverShow") == "false" && com.inq.flash.client.control.PersistenceManager.GetValue("rm",com.inq.flash.client.control.MinimizeManager.count) == com.inq.flash.client.control.MinimizeManager.SHOW_FAKE_MINIMIZE) {
			com.inq.flash.client.control.MinimizeManager.btnReallyMinimized.setVisible(true);
		}
		var _minimizedState = com.inq.flash.client.control.PersistenceManager.GetValue("mc",com.inq.flash.client.control.MinimizeManager.NOT_MINIMIZED);
		if(com.inq.flash.client.control.MinimizeManager.NOT_MINIMIZED != _minimizedState) {
			com.inq.flash.client.control.MinimizeManager.count = _minimizedState;
			com.inq.flash.client.control.MinimizeManager.actionMinimize();
		}
		else if(com.inq.flash.client.control.PersistenceManager.GetValue("rm",com.inq.flash.client.control.MinimizeManager.count) == com.inq.flash.client.control.MinimizeManager.IS_MINIMIZED) {
			com.inq.flash.client.control.MinimizeManager.actionReallyMinimize();
		}
		else {
			com.inq.flash.client.control.MinimizeManager.actionRestore();
		}
		if(com.inq.flash.client.control.PersistenceManager.GetValue("rm",com.inq.flash.client.control.MinimizeManager.count) != com.inq.flash.client.control.MinimizeManager.SHOW_FAKE_MINIMIZE && com.inq.flash.client.control.MinimizeManager.btnReallyMinimized != null) {
			if(com.inq.flash.client.chatskins.SkinControl.isInApplication("btnCloseChat")) {
				var btnClose = Application.application.btnCloseChat;
				btnClose.setVisible(false);
			}
		}
		else {
			var btnClose = Application.application.btnCloseChat;
			btnClose.setVisible(true);
		}
	}
	else {
		if(null != com.inq.flash.client.control.MinimizeManager.btnReallyMinimized) {
			com.inq.flash.client.control.MinimizeManager.btnReallyMinimized.setVisible(false);
		}
	}
}
com.inq.flash.client.control.MinimizeManager.turnOffScaling = function(state) {
	if(state == null) state = true;
	if(com.inq.utils.Capabilities.isMobile()) {
		try {
			var head = window.parent.document.getElementsByTagName("HEAD")[0];
			com.inq.flash.client.control.MinimizeManager.removeScalingMeta();
			var tmpDiv = window.parent.document.createElement("DIV");
			tmpDiv.innerHTML = ((state)?"<meta name=\"" + "tcChat_viewport" + "\" content=\"width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=0\" />":"<meta name=\"" + "tcChat_viewport" + "\" content=\"width=device-width, initial-scale=1, maximum-scale=10.0, minimum-scale=1, user-scalable=1\" />");
			head.appendChild(tmpDiv.firstChild);
		}
		catch( $e220 ) {
			{
				var e = $e220;
				{
					haxe.Log.trace("Error: " + e,{ fileName : "MinimizeManager.hx", lineNumber : 220, className : "com.inq.flash.client.control.MinimizeManager", methodName : "turnOffScaling", customParams : [e]});
				}
			}
		}
	}
}
com.inq.flash.client.control.MinimizeManager.removeScalingMeta = function() {
	var meta = window.parent.document.getElementById("tcChat_viewport");
	if(meta) {
		meta.parentNode.removeChild(meta);
	}
}
com.inq.flash.client.control.MinimizeManager.Close = function() {
	if(!com.inq.flash.client.chatskins.SkinControl.getIsPersistentChat()) {
		com.inq.flash.client.control.MinimizeManager.removeScalingMeta();
		com.inq.flash.client.control.MinimizeManager.btnReallyMinimized = null;
		com.inq.flash.client.control.MinimizeManager.btnRestore = null;
		com.inq.flash.client.control.MinimizeManager.btnMinimize = null;
	}
}
com.inq.flash.client.control.MinimizeManager.Restore = function() {
	try {
		if(com.inq.flash.client.control.MinimizeManager.minimized) {
			com.inq.flash.client.control.MinimizeManager.actionRestore();
		}
	}
	catch( $e221 ) {
		{
			var e = $e221;
			{
				haxe.Log.trace("Error: " + e,{ fileName : "MinimizeManager.hx", lineNumber : 261, className : "com.inq.flash.client.control.MinimizeManager", methodName : "Restore"});
			}
		}
	}
}
com.inq.flash.client.control.MinimizeManager.actionReallyMinimize = function(me) {
	if(com.inq.flash.client.control.PersistenceManager.GetValue("msgcnt",0) == 0) {
		var tY = com.inq.flash.client.control.FlashPeer.isThankYouEnabled();
		((((tY)?$closure(com.inq.flash.client.chatskins.SkinControl,"actionBtnCloseThankyou"):$closure(com.inq.flash.client.chatskins.SkinControl,"actionBtnCloseChat"))))(null);
	}
	else if(!com.inq.flash.client.chatskins.SkinControl.getIsPersistentChat()) {
		com.inq.flash.client.control.MinimizeManager.minimized = true;
		com.inq.flash.client.chatskins.SkinControl.getApplicationController().sendMinimizedMessage();
		com.inq.flash.client.control.PersistenceManager.SetValue("rm",com.inq.flash.client.control.MinimizeManager.IS_MINIMIZED);
		if(com.inq.ui.Stage.getInstance() != null) {
			com.inq.ui.Stage.getInstance().setVisible(false);
		}
	}
	return false;
}
com.inq.flash.client.control.MinimizeManager.actionMinimize = function(me) {
	if(!com.inq.flash.client.chatskins.SkinControl.getIsPersistentChat()) {
		com.inq.flash.client.control.MinimizeManager.minimized = true;
		com.inq.flash.client.control.PersistenceManager.SetValue("mc",com.inq.flash.client.control.MinimizeManager.count);
		if(com.inq.flash.client.control.MinimizeManager.elMinimized != null) com.inq.flash.client.control.MinimizeManager.elMinimized.setVisible(true);
		if(com.inq.ui.Stage.getInstance() != null) {
			com.inq.ui.Stage.getInstance().setVisible(false);
		}
		if(!com.inq.utils.Capabilities.isCSSFixedPositionSupported()) {
			com.inq.flash.client.control.MinimizeManager.floatMinimized(me);
		}
	}
	return false;
}
com.inq.flash.client.control.MinimizeManager.actionRestore = function(me) {
	if(!com.inq.flash.client.chatskins.SkinControl.getIsPersistentChat()) {
		com.inq.flash.client.control.MinimizeManager.count = 0;
		com.inq.flash.client.control.MinimizeManager.minimized = false;
		if(com.inq.flash.client.control.MinimizeManager.agentMsgCounter != null) com.inq.flash.client.control.MinimizeManager.agentMsgCounter.setVisible(false);
		if(com.inq.flash.client.control.MinimizeManager.agentText != null) com.inq.flash.client.control.MinimizeManager.agentText.setVisible(false);
		com.inq.flash.client.control.PersistenceManager.SetValue("mc",com.inq.flash.client.control.MinimizeManager.NOT_MINIMIZED);
		if(com.inq.flash.client.control.MinimizeManager.elMinimized != null) com.inq.flash.client.control.MinimizeManager.elMinimized.setVisible(false);
		if(com.inq.flash.client.control.MinimizeManager.btnReallyMinimized != null && com.inq.flash.client.control.PersistenceManager.GetValue("rm",com.inq.flash.client.control.MinimizeManager.count) == com.inq.flash.client.control.MinimizeManager.IS_MINIMIZED) {
			com.inq.flash.client.control.PersistenceManager.SetValue("rm",com.inq.flash.client.control.MinimizeManager.SHOW_FAKE_MINIMIZE);
		}
		if(com.inq.flash.client.chatskins.SkinControl.isInApplication("btnCloseChat")) {
			var btnClose = Application.application.btnCloseChat;
			btnClose.setVisible(true);
		}
		if(com.inq.flash.client.control.MinimizeManager.btnReallyMinimized != null && com.inq.flash.client.control.MinimizeManager.btnReallyMinimized.getStyle("neverShow") == "false" && com.inq.flash.client.control.PersistenceManager.GetValue("rm",com.inq.flash.client.control.MinimizeManager.count) == com.inq.flash.client.control.MinimizeManager.SHOW_FAKE_MINIMIZE) {
			com.inq.flash.client.control.MinimizeManager.btnReallyMinimized.setStyle("right",com.inq.flash.client.control.MinimizeManager.movedMinimize + "px");
		}
		else if(com.inq.flash.client.control.MinimizeManager.btnReallyMinimized != null && com.inq.flash.client.control.MinimizeManager.btnReallyMinimized.getStyle("neverShow") == "true" && com.inq.flash.client.control.PersistenceManager.GetValue("rm",com.inq.flash.client.control.MinimizeManager.count) == com.inq.flash.client.control.MinimizeManager.SHOW_FAKE_MINIMIZE) {
			com.inq.flash.client.control.MinimizeManager.btnReallyMinimized.setVisible(false);
		}
		if(com.inq.ui.Stage.getInstance() != null) {
			com.inq.ui.Stage.getInstance().setVisible(true);
			com.inq.flash.client.chatskins.SkinControl.setUpFocusAndSelection();
		}
		if(com.inq.utils.Capabilities.isPhone()) {
			Application.SetArea(com.inq.utils.Capabilities.getViewport());
		}
		else {
			Application.Resize();
		}
	}
	return false;
}
com.inq.flash.client.control.MinimizeManager.isMinimized = function() {
	return com.inq.flash.client.control.MinimizeManager.minimized;
}
com.inq.flash.client.control.MinimizeManager.floatMinimized = function(e) {
	if(com.inq.flash.client.control.MinimizeManager.isMinimized() && com.inq.utils.Capabilities.isMobile() && com.inq.flash.client.control.MinimizeManager.elMinimized != null) {
		if(com.inq.flash.client.control.MinimizeManager.elMinimized._div != null) {
			var left = null, right = null, top = null, bottom = null;
			var height = null, width = null;
			var l = 0, t = 0, h, w;
			left = com.inq.flash.client.control.MinimizeManager.elMinimized.getStyle("left");
			right = com.inq.flash.client.control.MinimizeManager.elMinimized.getStyle("right");
			top = com.inq.flash.client.control.MinimizeManager.elMinimized.getStyle("top");
			bottom = com.inq.flash.client.control.MinimizeManager.elMinimized.getStyle("bottom");
			height = com.inq.flash.client.control.MinimizeManager.elMinimized.getStyle("height");
			width = com.inq.flash.client.control.MinimizeManager.elMinimized.getStyle("width");
			var vp = com.inq.utils.Capabilities.getViewport();
			w = ((width == null)?com.inq.flash.client.control.MinimizeManager.elMinimized.getWidth():com.inq.flash.client.control.MinimizeManager.elMinimized.evaluatePosition(width));
			h = ((height == null)?com.inq.flash.client.control.MinimizeManager.elMinimized.getHeight():com.inq.flash.client.control.MinimizeManager.elMinimized.evaluatePosition(height));
			if(left == null && right != null) {
				l = (vp.x + vp.w - w) - com.inq.flash.client.control.MinimizeManager.elMinimized.evaluatePosition(right);
			}
			else if(left != null && right == null) {
				l = vp.x + com.inq.flash.client.control.MinimizeManager.elMinimized.evaluatePosition(left);
			}
			if(top == null && bottom != null) {
				t = (vp.y + vp.h - h) - com.inq.flash.client.control.MinimizeManager.elMinimized.evaluatePosition(bottom);
			}
			else if(left != null && right == null) {
				t = vp.y + com.inq.flash.client.control.MinimizeManager.elMinimized.evaluatePosition(top);
			}
			var divRestore = com.inq.flash.client.control.MinimizeManager.elMinimized._div;
			divRestore.style.position = "absolute";
			divRestore.style.left = l + "px";
			divRestore.style.top = t + "px";
			return true;
		}
		else {
			haxe.Log.trace("ERROR: elMinimized._div is null",{ fileName : "MinimizeManager.hx", lineNumber : 406, className : "com.inq.flash.client.control.MinimizeManager", methodName : "floatMinimized"});
		}
	}
	return false;
}
com.inq.flash.client.control.MinimizeManager.prototype.__class__ = com.inq.flash.client.control.MinimizeManager;
com.inq.net.URLLoader = function(request) { if( request === $_ ) return; {
	com.inq.events.EventDispatcher.apply(this,[]);
	this.script = null;
	this.index = 0;
	this.data = "";
	this.bytesLoaded = 0;
	this.bytesTotal = 0;
	this.retryLimit = com.inq.net.URLLoader.DEFAULT_RETRY_LIMIT;
	this.atLoadTimer = null;
	this.isExecuting = false;
}}
com.inq.net.URLLoader.__name__ = ["com","inq","net","URLLoader"];
com.inq.net.URLLoader.__super__ = com.inq.events.EventDispatcher;
for(var k in com.inq.events.EventDispatcher.prototype ) com.inq.net.URLLoader.prototype[k] = com.inq.events.EventDispatcher.prototype[k];
com.inq.net.URLLoader.getContext = function(UrlIndex) {
	var i;
	try {
		{
			var _g1 = 0, _g = com.inq.net.URLLoader.loadingArray.length;
			while(_g1 < _g) {
				var i1 = _g1++;
				if(com.inq.net.URLLoader.loadingArray[i1].UrlIndex == UrlIndex) {
					var context = com.inq.net.URLLoader.loadingArray[i1].Context;
					com.inq.net.URLLoader.loadingArray.splice(i1,1);
					return context;
				}
			}
		}
	}
	catch( $e222 ) {
		{
			var e = $e222;
			{
				haxe.Log.trace("getContext throws for " + UrlIndex + "\nreason: " + e,{ fileName : "URLLoader.hx", lineNumber : 140, className : "com.inq.net.URLLoader", methodName : "getContext", customParams : ["error"]});
			}
		}
	}
	return null;
}
com.inq.net.URLLoader._init = function() {
	window["httpRequestHandler"] = $closure(com.inq.net.URLLoader,"_httpRequestHandler");
	if(null != window["attachEvent"]) {
		window.attachEvent("onmessage",$closure(com.inq.net.URLLoader,"WhenMessage"));
	}
	else if(null != window["addEventListener"]) {
		window.addEventListener("message",$closure(com.inq.net.URLLoader,"WhenMessage"),false);
	}
}
com.inq.net.URLLoader.WhenMessage = function(ev) {
	if(ev == null) ev = event;
	if(ev.origin.toLowerCase().indexOf("chatrouter") != -1) {
		var cmd = ev.data.split("||")[1];
		cmd = decodeURIComponent(cmd);
		window.eval(cmd);
		return false;
	}
	return true;
}
com.inq.net.URLLoader._httpRequestHandler = function(id,data) {
	var instance = null;
	if(Std["is"](id,String)) {
		instance = com.inq.net.URLLoader.getContext(id);
	}
	else if(Std["is"](id,Float)) {
		instance = com.inq.net.URLLoader.getContext("" + id);
	}
	if(null == instance) {
		return;
	}
	instance.resetLoadTimer();
	var intId = null;
	try {
		intId = Std.parseInt("" + id);
	}
	catch( $e223 ) {
		{
			var er = $e223;
			{
				intId = null;
			}
		}
	}
	if(intId != null) instance.removeDivForPosting(intId);
	data = StringTools.urlDecode(data);
	if(data.length > 0) {
		instance.bytesLoaded = data.length;
		var script = js.Lib.document.getElementById("htmlRequestor_" + instance.index);
		var body = js.Lib.document.getElementsByTagName("body")[0];
		if(null != script) {
			body.removeChild(script);
		}
		instance.data = data;
		instance.bytesTotal = instance.data.length;
		instance.fireEvent(com.inq.events.Event.COMPLETE);
	}
}
com.inq.net.URLLoader.prototype.addOnLoadListener = function(scrpt) {
	scrpt.onreadystatechange = function() {
		var loader = (this)["URLLoader"];
		loader.uponReadyStateChange();
	}
	scrpt["URLLoader"] = this;
	scrpt["hadError"] = false;
	this.script = scrpt;
}
com.inq.net.URLLoader.prototype.atLoadTimer = null;
com.inq.net.URLLoader.prototype.bytesLoaded = null;
com.inq.net.URLLoader.prototype.bytesTotal = null;
com.inq.net.URLLoader.prototype.close = function() {
	this.removeScript();
	com.inq.net.URLLoader.getContext(this.key);
}
com.inq.net.URLLoader.prototype.createFloatingDiv = function(id) {
	try {
		var obj = js.Lib.document.createElement("div");
		obj.style.position = "absolute";
		obj.style.width = 0;
		obj.style.height = 0;
		obj.style.left = 0;
		obj.style.top = 0;
		obj.style.zIndex = 99;
		obj.style.display = "none";
		obj.style.padding = 0;
		obj.style.margin = 0;
		obj.id = id;
		js.Lib.document.getElementsByTagName("body")[0].appendChild(obj);
	}
	catch( $e224 ) {
		if( js.Boot.__instanceof($e224,Error) ) {
			var e = $e224;
			{
				haxe.Log.trace("Could not create div element. " + e,{ fileName : "URLLoader.hx", lineNumber : 415, className : "com.inq.net.URLLoader", methodName : "createFloatingDiv"});
			}
		} else throw($e224);
	}
	return js.Lib.document.getElementById(id);
}
com.inq.net.URLLoader.prototype.data = null;
com.inq.net.URLLoader.prototype.dataFormat = null;
com.inq.net.URLLoader.prototype.fireEvent = function(eventName) {
	var fun = this.eventListeners[eventName];
	var ev = new com.inq.events.Event(eventName);
	if(null == fun) {
		haxe.Log.trace("function is not defined for Event.COMPLETE",{ fileName : "URLLoader.hx", lineNumber : 296, className : "com.inq.net.URLLoader", methodName : "fireEvent"});
	}
	else {
		try {
			ev.currentTarget = this;
			ev.target = this;
			fun(ev);
		}
		catch( $e225 ) {
			{
				var e = $e225;
				{
					var keyz = Reflect.fields(e);
					var errMsg = "";
					if(Std["is"](e,String)) {
						errMsg = e;
					}
					else {
						var s;
						if(keyz.length == 0) {
							errMsg = e;
						}
						else {
							{
								var _g1 = 0, _g = keyz.length;
								while(_g1 < _g) {
									var s1 = _g1++;
									if(errMsg != "") errMsg += "\n";
									var key = keyz[s1];
									var type = e[key];
									errMsg += key + ": " + type;
								}
							}
						}
					}
					var modName = "" + this.constructor.name;
					var stack = haxe.Stack.callStack();
					var excpt = haxe.Stack.exceptionStack();
					var stackTrace, exceptionTrace;
					try {
						stackTrace = haxe.Stack.toString(stack);
					}
					catch( $e226 ) {
						{
							var x = $e226;
							{
								stackTrace = "unavailable";
							}
						}
					}
					try {
						exceptionTrace = haxe.Stack.toString(excpt);
					}
					catch( $e227 ) {
						{
							var x = $e227;
							{
								exceptionTrace = "unavailable";
							}
						}
					}
					haxe.Log.trace("Could not fire event in " + modName + ", reason: " + errMsg + "\nStackTrace:" + stackTrace + "\nExceptionTrace:" + exceptionTrace,{ fileName : "URLLoader.hx", lineNumber : 332, className : "com.inq.net.URLLoader", methodName : "fireEvent", customParams : [e]});
				}
			}
		}
	}
	return false;
}
com.inq.net.URLLoader.prototype.index = null;
com.inq.net.URLLoader.prototype.isExecuting = null;
com.inq.net.URLLoader.prototype.key = null;
com.inq.net.URLLoader.prototype.load = function(request) {
	var body = window.document.getElementsByTagName("body")[0];
	this.data = "";
	this.index = ++com.inq.net.URLLoader.seq;
	var indx;
	var id = "htmlRequestor_" + this.index;
	var scrpt = null;
	var reqUrl = request.url;
	this.isExecuting = false;
	{
		if(null == scrpt) {
			scrpt = window.document.createElement(com.inq.net.URLLoader.SCRIPT);
			scrpt.id = id;
			scrpt.language = "javascript";
			scrpt.type = "text/javascript";
			scrpt.onerror = $closure(this,"uponError");
			this.addOnLoadListener(scrpt);
		}
	}
	scrpt.name = "URLLoader";
	if((request.url.indexOf("/chatrouter/chat/") < 0) && (false) && (request.url.indexOf(".skin") < 0)) {
		indx = "" + com.inq.net.URLLoader.seq;
		reqUrl = request.url + "&js=" + indx;
		this.registerContext(indx);
	}
	else if(reqUrl.length > com.inq.net.URLLoader.MAXIMUM_IE_URL_LENGTH) {
		var parts = reqUrl.split("?");
		var postDest = parts[0];
		var postContent = parts[1];
		var jsid = "js=" + com.inq.net.URLLoader.seq + "&";
		postContent = jsid + postContent;
		this.registerContext("" + com.inq.net.URLLoader.seq);
		this.loadByPosting(postDest,postContent,com.inq.net.URLLoader.seq);
		return;
	}
	else {
		var arrayQuery = request.url.split("/");
		arrayQuery.shift();
		arrayQuery.shift();
		arrayQuery.shift();
		indx = "/" + arrayQuery.join("/");
		this.registerContext(indx);
	}
	scrpt.src = reqUrl;
	this.retryCnt = 0;
	body.appendChild(scrpt);
}
com.inq.net.URLLoader.prototype.loadByPosting = function(dest,data,id) {
	var div = this.prepareFrame();
	var divId = "post_div_" + id;
	var divsub = js.Lib.document.createElement("DIV");
	var boxID = "post_box_" + id;
	com.inq.net.URLLoader._hostedFile = window.location.protocol + "//" + window.location.host + window.location.pathname;
	var postToServerRequest = "POSTCHAT" + "||" + boxID + "||" + "" + "||" + com.inq.net.URLLoader._hostedFile + "||" + dest + "||" + encodeURIComponent(data);
	var baseURLparts = dest.split("/");
	var baseURL = baseURLparts[0] + "//" + baseURLparts[2];
	var iframe = "<IFRAME " + "ID=" + boxID + " " + "STYLE=\"overflow: hidden; display: block; border: none; top:0px;left:0px;width: 1px; height: 1px;\" " + "NAME=\"" + postToServerRequest + "\" " + "SRC=" + baseURL + "/chatrouter/postToServer/postToServer.htm?CHAT" + ">\n</IFRAME>";
	divsub.style.cssText = div.style.cssText;
	divsub.innerHTML = iframe;
	div.appendChild(divsub);
}
com.inq.net.URLLoader.prototype.post = function(request,baseURL) {
	var div = this.prepareFrame();
	var divId = "post_div_1";
	var divsub = js.Lib.document.createElement("DIV");
	var boxID = "post_box1";
	if(div.firstChild) {
		div.removeChild(div.firstChild);
	}
	var iframe = "<IFRAME " + "ID=" + boxID + " " + "STYLE=\"overflow: hidden; display: block; border: none; top:0px;left:0px;width: 1px; height: 1px;\" " + "NAME=\"" + request.url + "\" " + "SRC=" + baseURL + "/chatrouter/postToServer/postToServer.htm" + ">\n</IFRAME>";
	divsub.style.cssText = div.style.cssText;
	divsub.innerHTML = iframe;
	div.appendChild(divsub);
}
com.inq.net.URLLoader.prototype.prepareFrame = function() {
	var id = "htmlPostRequestor_0";
	var div = js.Lib.document.getElementById(id);
	if(!div) {
		div = this.createFloatingDiv(id);
		div.style.display = "";
		div.style.opacity = "0";
	}
	return div;
}
com.inq.net.URLLoader.prototype.reIssueScript = function() {
	var script = this.removeScript();
	if(script != null) {
		var body = document.body;
		var newScript = window.document.createElement(com.inq.net.URLLoader.SCRIPT);
		newScript.id = script.id;
		newScript.name = script.name;
		newScript.language = "javascript";
		newScript.type = "text/javascript";
		newScript.onerror = $closure(this,"uponError");
		newScript.src = script.src;
		this.addOnLoadListener(newScript);
		body.appendChild(newScript);
		return newScript;
	}
	return script;
}
com.inq.net.URLLoader.prototype.registerContext = function(Url) {
	com.inq.net.URLLoader.loadingArray[com.inq.net.URLLoader.loadingArray.length] = { UrlIndex : (this.key = "" + Url), Context : this}
}
com.inq.net.URLLoader.prototype.removeDivForPosting = function(id) {
	var div = this.prepareFrame();
	var divId = "post_div_" + id;
	var divById = window.document.getElementById(divId);
	if(divById) {
		div.removeChild(divById);
	}
}
com.inq.net.URLLoader.prototype.removeScript = function() {
	var body = document.body;
	if(null != this.script) {
		this.script.onreadystatechange = this.script.onerror = null;
		body.removeChild(this.script);
	}
	return this.script;
}
com.inq.net.URLLoader.prototype.resetLoadTimer = function() {
	this.isExecuting = true;
	if(this.atLoadTimer != null) {
		this.atLoadTimer.stop();
		this.atLoadTimer = null;
	}
}
com.inq.net.URLLoader.prototype.retry = function() {
	if(this.retryCnt < this.retryLimit) {
		this.retryCnt++;
		this.reIssueScript();
	}
	else {
		this.fireEvent(com.inq.events.IOErrorEvent.NETWORK_ERROR);
	}
}
com.inq.net.URLLoader.prototype.retryCnt = null;
com.inq.net.URLLoader.prototype.retryLimit = null;
com.inq.net.URLLoader.prototype.script = null;
com.inq.net.URLLoader.prototype.uponError = function() {
	this.uponRetry();
	return false;
}
com.inq.net.URLLoader.prototype.uponLoad = function() {
	if(this.atLoadTimer != null) {
		this.atLoadTimer.stop();
		this.atLoadTimer = null;
	}
	if(!this.isExecuting) {
		this.atLoadTimer = new com.inq.utils.Timer(com.inq.net.URLLoader.AT_LOAD_TIMEOUT);
		this.atLoadTimer.run = $closure(this,"uponLoadTimeout");
	}
	return false;
}
com.inq.net.URLLoader.prototype.uponLoadTimeout = function() {
	this.atLoadTimer.stop();
	this.atLoadTimer = null;
	if(!this.isExecuting && this.script.parentNode != null) {
		this.uponRetry();
	}
}
com.inq.net.URLLoader.prototype.uponReadyStateChange = function() {
	if(this.script.readyState == "complete" || this.script.readyState == "loaded") {
		this.script.onreadystatechange = null;
		this.uponLoad();
	}
}
com.inq.net.URLLoader.prototype.uponRetry = function() {
	if(this.script.parentNode == null) return;
	if(this.script["hadError"]) return;
	this.script["hadError"] = true;
	this.retry();
}
com.inq.net.URLLoader.prototype.__class__ = com.inq.net.URLLoader;
$Main = function() { }
$Main.__name__ = ["@Main"];
$Main.prototype.__class__ = $Main;
$_ = {}
js.Boot.__res = {}
js.Boot.__init();
{
	js.Lib.document = document;
	js.Lib.window = window;
	onerror = function(msg,url,line) {
		var f = js.Lib.onerror;
		if( f == null )
			return false;
		return f(msg,[url+":"+line]);
	}
}
{
	haxe.Resource.content = [];
}
{
	Date.now = function() {
		return new Date();
	}
	Date.fromTime = function(t) {
		var d = new Date();
		d["setTime"](t);
		return d;
	}
	Date.fromString = function(s) {
		switch(s.length) {
		case 8:{
			var k = s.split(":");
			var d = new Date();
			d["setTime"](0);
			d["setUTCHours"](k[0]);
			d["setUTCMinutes"](k[1]);
			d["setUTCSeconds"](k[2]);
			return d;
		}break;
		case 10:{
			var k = s.split("-");
			return new Date(k[0],k[1] - 1,k[2],0,0,0);
		}break;
		case 19:{
			var k = s.split(" ");
			var y = k[0].split("-");
			var t = k[1].split(":");
			return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
		}break;
		default:{
			throw "Invalid date format : " + s;
		}break;
		}
	}
	Date.prototype["toString"] = function() {
		var date = this;
		var m = date.getMonth() + 1;
		var d = date.getDate();
		var h = date.getHours();
		var mi = date.getMinutes();
		var s = date.getSeconds();
		return date.getFullYear() + "-" + ((m < 10?"0" + m:"" + m)) + "-" + ((d < 10?"0" + d:"" + d)) + " " + ((h < 10?"0" + h:"" + h)) + ":" + ((mi < 10?"0" + mi:"" + mi)) + ":" + ((s < 10?"0" + s:"" + s));
	}
	Date.prototype.__class__ = Date;
	Date.__name__ = ["Date"];
}
{
	Math.NaN = Number["NaN"];
	Math.NEGATIVE_INFINITY = Number["NEGATIVE_INFINITY"];
	Math.POSITIVE_INFINITY = Number["POSITIVE_INFINITY"];
	Math.isFinite = function(i) {
		return isFinite(i);
	}
	Math.isNaN = function(i) {
		return isNaN(i);
	}
	Math.__name__ = ["Math"];
}
{
	js["XMLHttpRequest"] = (window.XMLHttpRequest?XMLHttpRequest:(window.ActiveXObject?function() {
		try {
			return new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch( $e228 ) {
			{
				var e = $e228;
				{
					try {
						return new ActiveXObject("Microsoft.XMLHTTP");
					}
					catch( $e229 ) {
						{
							var e1 = $e229;
							{
								throw "Unable to create XMLHttpRequest object.";
							}
						}
					}
				}
			}
		}
	}:function($this) {
		var $r;
		throw "Unable to create XMLHttpRequest object.";
		return $r;
	}(this)));
}
{
	String.prototype.__class__ = String;
	String.__name__ = ["String"];
	Array.prototype.__class__ = Array;
	Array.__name__ = ["Array"];
	Int = { __name__ : ["Int"]}
	Dynamic = { __name__ : ["Dynamic"]}
	Float = Number;
	Float.__name__ = ["Float"];
	Bool = { __ename__ : ["Bool"]}
	Class = { __name__ : ["Class"]}
	Enum = { }
	Void = { __ename__ : ["Void"]}
}
{
	Xml = js.JsXml__;
	Xml.__name__ = ["Xml"];
	Xml.Element = "element";
	Xml.PCData = "pcdata";
	Xml.CData = "cdata";
	Xml.Comment = "comment";
	Xml.DocType = "doctype";
	Xml.Prolog = "prolog";
	Xml.Document = "document";
}
com.inq.flash.client.data.MessageFields.TYPE_CHAT_ACTIVITY = "chat.activity";
com.inq.flash.client.data.MessageFields.TYPE_CHAT_COMMUNICATION = "chat.communication";
com.inq.flash.client.data.MessageFields.TYPE_CHAT_COMMUNICATION_OPENER = "chat.communication.opener";
com.inq.flash.client.data.MessageFields.TYPE_CHAT_COMMUNICATION_QUEUE = "chat.communication.queue";
com.inq.flash.client.data.MessageFields.TYPE_CHAT_COMMUNICATION_OUTCOME = "chat.communication_outcome";
com.inq.flash.client.data.MessageFields.TYPE_CHAT_REQUEST = "chat.request";
com.inq.flash.client.data.MessageFields.TYPE_CHAT_AUTHORIZED = "chat.authorized";
com.inq.flash.client.data.MessageFields.TYPE_CHAT_ACCEPTED = "chat.accepted";
com.inq.flash.client.data.MessageFields.TYPE_CHATROOM_MEMBER_CONNECTED = "chatroom.member_connected";
com.inq.flash.client.data.MessageFields.TYPE_CHATROOM_MEMBER_LOST = "chatroom.member_lost";
com.inq.flash.client.data.MessageFields.TYPE_CHAT_TRANSFER_RESPONSE = "chat.transfer_response";
com.inq.flash.client.data.MessageFields.TYPE_CHAT_SYSTEM = "chat.system";
com.inq.flash.client.data.MessageFields.TYPE_OWNER_TRANSFER_RESPONSE = "owner.transfer_response";
com.inq.flash.client.data.MessageFields.TYPE_CHAT_EXIT = "chat.exit";
com.inq.flash.client.data.MessageFields.TYPE_CHAT_WAIT = "chat.wait";
com.inq.flash.client.data.MessageFields.TYPE_CHAT_DENIED = "chat.denied";
com.inq.flash.client.data.MessageFields.TYPE_CLIENT_COMMAND = "client.command";
com.inq.flash.client.data.MessageFields.TYPE_SYSTEM_DISCONNECT = "system.disconnect";
com.inq.flash.client.data.MessageFields.TYPE_SYSTEM = "system.";
com.inq.flash.client.data.MessageFields.TYPE_ERROR = "error";
com.inq.flash.client.data.MessageFields.TYPE_MEMBER_TRANSITIONING = "chat.member_transitioning";
com.inq.flash.client.data.MessageFields.TYPE_MEMBER_TRANSITIONING_ACK = "chat.member_transitioning_acknowledged";
com.inq.flash.client.data.MessageFields.TYPE_CHAT_NEED_WAIT = "chat.need_wait";
com.inq.flash.client.data.MessageFields.TYPE_PERSISTENT_TRANSITION = "chat.per_xtion";
com.inq.flash.client.data.MessageFields.TYPE_CONTINUE_TRANSITION = "chat.con_xtion";
com.inq.flash.client.data.MessageFields.TYPE_GET_PERSISTENT_DOMAIN = "chat.get_pers";
com.inq.flash.client.data.MessageFields.TYPE_SYNC = "sync";
com.inq.flash.client.data.MessageFields.TYPE_CHAT_ACTIVE = "chat.active";
com.inq.flash.client.data.MessageFields.TYPE_CHAT_AUTOMATON_RESPONSE = "chat.automaton_response";
com.inq.flash.client.data.MessageFields.TYPE_CHAT_AUTOMATON_REQUEST = "chat.automaton_request";
com.inq.flash.client.data.MessageFields.TYPE_CHAT_AUTOMATON_SETTING = "chat.setting";
com.inq.flash.client.data.MessageFields.TYPE_NULL = "null";
com.inq.flash.client.data.MessageFields.TYPE_CHAT_COBROWSE = "chat.cobrowse";
com.inq.flash.client.data.MessageFields.KEY_COBROWSE_ENABLED = "cobrowse.enabled";
com.inq.flash.client.data.MessageFields.KEY_COBROWSE_EVENT = "cobrowse.event";
com.inq.flash.client.data.MessageFields.KEY_COBROWSE_EVENT_TYPE_CLIENT_COBROWSE_ACCEPT = "45";
com.inq.flash.client.data.MessageFields.KEY_COBROWSE_EVENT_TYPE_CLIENT_COBROWSE_DECLINE = "46";
com.inq.flash.client.data.MessageFields.KEY_COBROWSE_EVENT_TYPE_CLIENT_COBROWSE_ACCEPT_SHARE = "47";
com.inq.flash.client.data.MessageFields.KEY_COBROWSE_EVENT_TYPE_CLIENT_COBROWSE_DECLINE_SHARE = "48";
com.inq.flash.client.data.MessageFields.KEY_COBROWSE_EVENT_TYPE_CLIENT_COBROWSE_END = "49";
com.inq.flash.client.data.MessageFields.KEY_COBROWSE_EVENT_TYPE_AGENT_COBROWSE_SENT_INVITE = "50";
com.inq.flash.client.data.MessageFields.KEY_COBROWSE_EVENT_TYPE_AGENT_COBROWSE_SENT_SHARED_INVITE = "51";
com.inq.flash.client.data.MessageFields.KEY_COBROWSE_EVENT_TYPE_AGENT_COBROWSE_END = "52";
com.inq.flash.client.data.MessageFields.KEY_TY_LABEL = "thank_you_image_label";
com.inq.flash.client.data.MessageFields.KEY_CHAT_WAIT_EST_ASSIGN_TIME = "chat.est_asgn_time";
com.inq.flash.client.data.MessageFields.KEY_CHAT_WAIT_POS = "chat.pos";
com.inq.flash.client.data.MessageFields.KEY_MESSAGE_TYPE = "msg.type";
com.inq.flash.client.data.MessageFields.KEY_VERSION = "version";
com.inq.flash.client.data.MessageFields.KEY_MSG_ID = "msg.id";
com.inq.flash.client.data.MessageFields.KEY_ORIGINAL_MSG_ID = "msg.originalrequest.id";
com.inq.flash.client.data.MessageFields.KEY_ERROR_MESSAGE = "error.msg";
com.inq.flash.client.data.MessageFields.KEY_CLIENT_COMMAND_PARAM = "chat.data";
com.inq.flash.client.data.MessageFields.KEY_CLIENT_CMD_PARAM = "chat.cmd";
com.inq.flash.client.data.MessageFields.KEY_CHATROUTER_ADDRESS = "chatrouter.address";
com.inq.flash.client.data.MessageFields.KEY_REASON = "reason";
com.inq.flash.client.data.MessageFields.KEY_CLIENT_MESSAGE_COUNT = "clientMsgCnt";
com.inq.flash.client.data.MessageFields.KEY_CHAT_AUTOMATON_ID = "automaton.id";
com.inq.flash.client.data.MessageFields.KEY_CHAT_AUTOMATON_TYPE = "automaton.type";
com.inq.flash.client.data.MessageFields.KEY_CHAT_AUTOMATON_STATE = "dt.state";
com.inq.flash.client.data.MessageFields.KEY_CHAT_AUTOMATON_DATA_MODEL = "dt.datamodel";
com.inq.flash.client.data.MessageFields.KEY_CHAT_AUTOMATON_EVENT = "dt.event";
com.inq.flash.client.data.MessageFields.KEY_CHAT_AUTOMATON_DATA = "automaton.data";
com.inq.flash.client.data.MessageFields.KEY_CHAT_ID = "chat.id";
com.inq.flash.client.data.MessageFields.KEY_CLIENT_ID = "client.id";
com.inq.flash.client.data.MessageFields.KEY_CUSTOMER_ID = "client.id";
com.inq.flash.client.data.MessageFields.KEY_AGENT_ID = "agent.id";
com.inq.flash.client.data.MessageFields.KEY_CONFIG_ID = "config.id";
com.inq.flash.client.data.MessageFields.KEY_SITE_ID = "config.site_id";
com.inq.flash.client.data.MessageFields.KEY_LANGUAGE = "config.language";
com.inq.flash.client.data.MessageFields.KEY_SCRIPT_ID = "config.script_id";
com.inq.flash.client.data.MessageFields.KEY_PROTODOMAIN = "pd";
com.inq.flash.client.data.MessageFields.KEY_CHANNEL_ID = "config.bunit_id";
com.inq.flash.client.data.MessageFields.KEY_CONFIG_ENTRY_BUSINESS_UNIT_ID = "config.bunit_id";
com.inq.flash.client.data.MessageFields.KEY_CHAT_TITLE = "config.chat_title";
com.inq.flash.client.data.MessageFields.KEY_BR_ID = "config.br_id";
com.inq.flash.client.data.MessageFields.KEY_AGENT_ALIAS = "config.agent_alias";
com.inq.flash.client.data.MessageFields.KEY_USE_AGENT_ALIAS = "config.use_agent_alias";
com.inq.flash.client.data.MessageFields.KEY_TIME_DELTA = "time.delta";
com.inq.flash.client.data.MessageFields.KEY_CONFIG_V3_TIMEOUT = "config.v3_timeout";
com.inq.flash.client.data.MessageFields.KEY_CONFIG_AGENT_ATTRIBUTE = "config.agent_attributes";
com.inq.flash.client.data.MessageFields.KEY_CONFIG_AGENT_GROUP_ID = "config.agent_group_id";
com.inq.flash.client.data.MessageFields.KEY_MESSAGE_AGENT_ALIAS = "agent.alias";
com.inq.flash.client.data.MessageFields.KEY_CONFIG_VISITOR_ATTRIBUTES = "config.visitor_attributes";
com.inq.flash.client.data.MessageFields.KEY_CONFIG_RULE_ATTRIBUTES = "config.rule_attributes";
com.inq.flash.client.data.MessageFields.KEY_PERSISTENT_WINDOW_REFRESHED = "persistent.window.refreshed";
com.inq.flash.client.data.MessageFields.KEY_CONFIG_ENTRY_BR_ID = "config.br_id";
com.inq.flash.client.data.MessageFields.KEY_CONFIG_ENTRY_DEVICE_TYPE = "config.device_type";
com.inq.flash.client.data.MessageFields.KEY_CONFIG_ENTRY_LAUNCH_PAGE = "config.launch_page";
com.inq.flash.client.data.MessageFields.KEY_CONFIG_ENTRY_LAUNCH_TYPE = "config.launch_type";
com.inq.flash.client.data.MessageFields.KEY_CONFIG_ENTRY_INC_ASSIGNMENT_ID = "config.inc_assignment_id";
com.inq.flash.client.data.MessageFields.KEY_CONFIG_ENTRY_SESSION_ID = "config.session_id";
com.inq.flash.client.data.MessageFields.KEY_CONFIG_ENTRY_PAGE_ID = "config.page_id";
com.inq.flash.client.data.MessageFields.KEY_CHAT_DATA = "chat.data";
com.inq.flash.client.data.MessageFields.KEY_CLIENT_OUTCOME_DATA = "client.outcome.data";
com.inq.flash.client.data.MessageFields.KEY_USERNAME = "client.name";
com.inq.flash.client.data.MessageFields.KEY_RETURN_RECEIPT = "return.receipt";
com.inq.flash.client.data.MessageFields.KEY_CLIENT_ECHO = "client.echo";
com.inq.flash.client.data.MessageFields.KEY_REPLAY = "chat.replay";
com.inq.flash.client.data.MessageFields.KEY_MSG_AGENT_ALIAS = "agent.alias";
com.inq.flash.client.data.MessageFields.KEY_EVENT_AGENT_FIRST_NAME = "event.agent_first_name";
com.inq.flash.client.data.MessageFields.KEY_EVENT_AGENT_LAST_NAME = "event.agent_last_name";
com.inq.flash.client.data.MessageFields.KEY_EVENT_INITIAL_REQUEST_ATTRIBUTES = "event.initial_request_attributes";
com.inq.flash.client.data.MessageFields.KEY_EVENT_TRANSFER_REQUEST_ATTRIBUTES = "event.transfer_request_attributes";
com.inq.flash.client.data.MessageFields.KEY_HTTP_TIMEOUT = "hTO";
com.inq.flash.client.data.MessageFields.KEY_BUSINESS_UNIT_ID = "business_unit.id";
com.inq.flash.client.data.MessageFields.KEY_OPENING_SCRIPT = "chat.open_script";
com.inq.flash.client.data.MessageFields.KEY_PERSISTENT_FLAG = "chat.persistent";
com.inq.flash.client.data.MessageFields.KEY_INITIAL_CLICKSTREAM_PREFIX = "initial_data.";
com.inq.flash.client.data.MessageFields.KEY_LINE_NR = "line.nr";
com.inq.flash.client.data.MessageFields.REASON_PERSISTENT = "persistent";
com.inq.flash.client.data.MessageFields.KEY_CALL_ENABLED = "call.enabled";
com.inq.flash.client.data.MessageFields.TYPE_CLICK_2_CALL = "call.event";
com.inq.flash.client.data.MessageFields.KEY_CALL_STATUS = "call.status";
com.inq.flash.client.data.MessageFields.KEY_CALL_RESULT = "call.result";
com.inq.flash.client.data.MessageFields.KEY_CALL_TERMINATED = "call.terminated_by_customer";
com.inq.flash.client.data.MessageFields.KEY_TYPE = "type";
com.inq.flash.client.data.MessageFields.ACTIVITY_AGENT_TYPING = "2";
com.inq.flash.client.data.MessageFields.ACTIVITY_CUSTOMER_TYPING = "3";
com.inq.flash.client.data.MessageFields.ACTIVITY_CUSTOMER_STOPS_TYPING = "4";
com.inq.flash.client.data.MessageFields.ACTIVITY_CUSTOMER_MINIMIZED = "11";
com.inq.flash.client.data.MessageFields.ACTIVITY_CUSTOMER_RESTORED = "12";
com.inq.flash.client.data.MessageFields.KEY_TC_MODE = "tc.mode";
com.inq.flash.client.data.MessageFields.KEY_OWNER = "owner";
com.inq.flash.client.data.MessageFields.KEY_SCREENING = "screening";
com.inq.flash.client.data.MessageFields.KEY_CHATROOM_MEMBER_ID = "chatroom.member.id";
com.inq.flash.client.data.MessageFields.KEY_CLIENT_DISPLAY_TEXT = "client.display.text";
com.inq.flash.client.data.MessageFields.KEY_IS_REASSIGNMENT_MODE = "is_reassignment_mode";
com.inq.flash.client.data.MessageFields.DATA_TRANSFER = "transfer";
com.inq.flash.client.data.MessageFields.DATA_CONFERENCE = "conference";
com.inq.flash.client.data.MessageFields.DATA_TRUE = "true";
com.inq.flash.client.data.MessageFields.DATA_FALSE = "false";
com.inq.flash.client.data.MessageFields.FORM_DATA = "form.data";
com.inq.flash.client.data.MessageFields.FORM_NAME = "form.name";
com.inq.flash.client.data.MessageFields.FORM_ID = "form.id";
com.inq.flash.client.data.MessageFields.DATA_DTID = "dtid";
com.inq.flash.client.data.MessageFields.DATA_CACHE_ID = "cacheId";
com.inq.flash.client.data.MessageFields.DATA_LAYER_ID = "layerId";
com.inq.ui.Container.CLIENT_SPACE_PREFIX = "tcChat_";
com.inq.ui.Container.LEGACY_PREFIX = "inq";
com.inq.ui.Container.CHAT_CLASS = "tcChat";
com.inq.ui.Container.SC_TITLEBAR = "inqTitleBar";
com.inq.ui.Container.SC_RESIZE = "inqDivResizeCorner";
com.inq.ui.Container.SC_SKIN = "tcChat_Skin";
com.inq.ui.Container.count = 0;
com.inq.flash.client.control.FlashPeer.inqFlashPeer = window['Inq']['FlashPeer'];
com.inq.ui.SkinLoader.OVERALL_CONTAINER_ID = "Skin";
com.inq.ui.SkinLoader._skinpath = com.inq.ui.SkinLoader._getSkinPath();
com.inq.ui.SkinLoader.skinCollection = { }
com.inq.ui.SkinLoader.contextArray = new Array();
com.inq.ui.SkinLoader.imageCollection = { }
com.inq.ui.SkinLoader.imageCount = 0;
com.inq.ui.SkinLoader.spriteMap = null;
js.Lib.onerror = null;
com.inq.utils.Capabilities.patternTable = ["[\\s]*Mozilla[/ ][0-9a-zA-Z.]*\\s[(][^;]*;[^;]*;\\s*America Online[^;]*;[^;]*;([^;\\)]*).*","[\\s]*Mozilla[/ ][0-9a-zA-Z.]*\\s[(][^;]*;[^;]*;\\s*AOL[^;]*;([^;\\)]*).*","[\\s]*Opera[/ ][0-9a-zA-Z.]*\\s[(]Macintosh;([^;\\)]*).*","[\\s]*Opera[/ ][0-9a-zA-Z.]*\\s[(]X11;([^;\\)]*).*","[\\s]*Opera[/ ][0-9a-zA-Z.]*\\s[(]([^;\\)]*).*","[\\s]*Mozilla[/ ][0-9a-zA-Z.]*\\s[(][^;]*;[^;]*;([^;\\)]*).*"];
com.inq.utils.Capabilities.os = "?";
com.inq.utils.Capabilities._init = com.inq.utils.Capabilities.init();
com.inq.utils.Capabilities.playerType = "Native Javascript";
com.inq.utils.Capabilities.manufacturer = "Inq";
com.inq.utils.Capabilities.version = "JS 1.0.0.0";
com.inq.utils.Capabilities.deviceType = null;
com.inq.utils.Capabilities.mobile = null;
com.inq.utils.Capabilities.safari = null;
com.inq.utils.Capabilities.viewportDetectorInitialized = false;
Application.__initTrace = Application._initTrace();
Application.hasRun = false;
Application.isPersistent = false;
Application.application = null;
Application.resizable = true;
Application.minWidth = 250;
Application.minHeight = 150;
Application.dragArea = com.inq.utils.Capabilities.getDefaultResizeArea();
Application.zIndexResize = 9999999;
Application.popoutStageWidth = -1;
Application.popoutStageHeight = -1;
com.inq.events.Event.ACTIVATE = "activate";
com.inq.events.Event.ADDED = "added";
com.inq.events.Event.CANCEL = "cancel";
com.inq.events.Event.CHANGE = "change";
com.inq.events.Event.CLOSE = "close";
com.inq.events.Event.COMPLETE = "complete";
com.inq.events.Event.CONNECT = "connect";
com.inq.events.Event.DEACTIVATE = "deactivate";
com.inq.events.Event.ENTER_FRAME = "enterFrame";
com.inq.events.Event.INIT = "init";
com.inq.events.Event.MOUSE_LEAVE = "mouseLeave";
com.inq.events.Event.OPEN = "open";
com.inq.events.Event.REMOVED = "removed";
com.inq.events.Event.RENDER = "render";
com.inq.events.Event.RESIZE = "resize";
com.inq.events.Event.SCROLL = "scroll";
com.inq.events.Event.SELECT = "select";
com.inq.events.Event.SOUND_COMPLETE = "soundComplete";
com.inq.events.Event.TAB_CHILDREN_CHANGE = "tabChildrenChange";
com.inq.events.Event.TAB_ENABLED_CHANGE = "tabEnabledChange";
com.inq.events.Event.TAB_INDEX_CHANGE = "tabIndexChange";
com.inq.events.Event.UNLOAD = "unload";
com.inq.events.TextEvent.LINK = "link";
com.inq.events.TextEvent.TEXT_INPUT = "textInput";
com.inq.ui.Keyboard.BACKSPACE = 8;
com.inq.ui.Keyboard.CAPS_LOCK = 20;
com.inq.ui.Keyboard.CONTROL = 17;
com.inq.ui.Keyboard.DELETE = 46;
com.inq.ui.Keyboard.DOWN = 40;
com.inq.ui.Keyboard.END = 35;
com.inq.ui.Keyboard.ENTER = 13;
com.inq.ui.Keyboard.ESCAPE = 27;
com.inq.ui.Keyboard.F1 = 112;
com.inq.ui.Keyboard.F2 = 113;
com.inq.ui.Keyboard.F3 = 114;
com.inq.ui.Keyboard.F4 = 115;
com.inq.ui.Keyboard.F5 = 116;
com.inq.ui.Keyboard.F6 = 117;
com.inq.ui.Keyboard.F7 = 118;
com.inq.ui.Keyboard.F8 = 119;
com.inq.ui.Keyboard.F9 = 120;
com.inq.ui.Keyboard.F10 = 121;
com.inq.ui.Keyboard.F11 = 122;
com.inq.ui.Keyboard.F12 = 123;
com.inq.ui.Keyboard.F13 = 124;
com.inq.ui.Keyboard.F14 = 125;
com.inq.ui.Keyboard.F15 = 126;
com.inq.ui.Keyboard.HOME = 36;
com.inq.ui.Keyboard.PAUSE = 19;
com.inq.ui.Keyboard.INSERT = 45;
com.inq.ui.Keyboard.LEFT = 37;
com.inq.ui.Keyboard.NUMPAD_0 = 96;
com.inq.ui.Keyboard.NUMPAD_1 = 97;
com.inq.ui.Keyboard.NUMPAD_2 = 98;
com.inq.ui.Keyboard.NUMPAD_3 = 99;
com.inq.ui.Keyboard.NUMPAD_4 = 100;
com.inq.ui.Keyboard.NUMPAD_5 = 101;
com.inq.ui.Keyboard.NUMPAD_6 = 102;
com.inq.ui.Keyboard.NUMPAD_7 = 103;
com.inq.ui.Keyboard.NUMPAD_8 = 104;
com.inq.ui.Keyboard.NUMPAD_9 = 105;
com.inq.ui.Keyboard.NUMPAD_ADD = 107;
com.inq.ui.Keyboard.NUMPAD_DECIMAL = 110;
com.inq.ui.Keyboard.NUMPAD_DIVIDE = 111;
com.inq.ui.Keyboard.NUMPAD_ENTER = 108;
com.inq.ui.Keyboard.NUMPAD_MULTIPLY = 106;
com.inq.ui.Keyboard.NUMPAD_SUBTRACT = 109;
com.inq.ui.Keyboard.PAGE_DOWN = 34;
com.inq.ui.Keyboard.PAGE_UP = 33;
com.inq.ui.Keyboard.RIGHT = 39;
com.inq.ui.Keyboard.SHIFT = 16;
com.inq.ui.Keyboard.SPACE = 32;
com.inq.ui.Keyboard.TAB = 9;
com.inq.ui.Keyboard.UP = 38;
com.inq.flash.client.chatskins.FormMgr.chatCanvas = null;
com.inq.flash.client.chatskins.FormMgr.randomNumber = 0;
com.inq.events.FocusEvent.FOCUS_IN = "FocusIn";
com.inq.events.FocusEvent.FOCUS_OUT = "FocusOut";
com.inq.flash.client.chatskins.OpenerScript.bOpenersStopped = false;
com.inq.events.ErrorEvent.ERROR = "error";
com.inq.events.SecurityErrorEvent.SECURITY_ERROR = "securityError";
js.JsXml__.enode = new EReg("^<([a-zA-Z0-9:_-]+)","");
js.JsXml__.ecdata = new EReg("^<!\\[CDATA\\[","i");
js.JsXml__.edoctype = new EReg("^<!DOCTYPE","i");
js.JsXml__.eend = new EReg("^</([a-zA-Z0-9:_-]+)>","");
js.JsXml__.epcdata = new EReg("^[^<]+","");
js.JsXml__.ecomment = new EReg("^<!--","");
js.JsXml__.eprolog = new EReg("^<\\?[^\\?]+\\?>","");
js.JsXml__.eattribute = new EReg("^\\s*([a-zA-Z0-9:_-]+)\\s*=\\s*([\"'])([^\\2]*?)\\2","");
js.JsXml__.eclose = new EReg("^[ \\r\\n\\t]*(>|(/>))","");
js.JsXml__.ecdata_end = new EReg("\\]\\]>","");
js.JsXml__.edoctype_elt = new EReg("[\\[|\\]>]","");
js.JsXml__.ecomment_end = new EReg("-->","");
com.inq.flash.client.control.messagehandlers.ClientCommandMessageHandler.XFORM_SERVER_PLACEHOLDER = "${xformsServerUrl}";
com.inq.external.ExternalInterface.available = true;
com.inq.events.MouseEvent.CLICK = "click";
com.inq.ui.BalloonOverlaying.HOT_OFFSET_X = 0;
com.inq.ui.BalloonOverlaying.HOT_OFFSET_Y = 0;
com.inq.ui.BalloonOverlaying.CLASS_STYLE = "z-index:102;font-family:\"Comic Sans MS\";font-size:10pt;background-color:red; color:yellow;";
com.inq.ui.BalloonOverlaying.bIE6 = ((window.navigator.appName == "Microsoft Internet Explorer") && ((window.navigator.appVersion.indexOf("MSIE 6.0") >= 0) || (window.navigator.appVersion.indexOf("MSIE 5.") >= 0)));
com.inq.flash.client.control.PersistenceManager.CLICK_STREAM_DATA_SENT_KEY = "s";
com.inq.flash.client.control.PersistenceManager.MUTE_SOUND = "m";
com.inq.flash.client.control.PersistenceManager.MINIMIZED_COUNT = "mc";
com.inq.flash.client.control.PersistenceManager.JSESSIONID = "ji";
com.inq.flash.client.control.PersistenceManager.REALLY_MINIMIZED = "rm";
com.inq.flash.client.control.PersistenceManager.HEIGHT = "h";
com.inq.flash.client.control.PersistenceManager.WIDTH = "w";
com.inq.flash.client.control.PersistenceManager.CLIENT_NAME_PERSIST = "cn";
com.inq.flash.client.control.PersistenceManager.__inst = com.inq.flash.client.control.PersistenceManager.createInstance();
com.inq.flash.client.chatskins.SkinControl.CSDL_CLICK2PER = "_ClickToPersistent=ClickToPersistent^^ClickToPersistent=";
com.inq.flash.client.chatskins.SkinControl.CSDL_BROWSER = "_Browser=Browser^^Browser=";
com.inq.flash.client.chatskins.SkinControl.CSDL_CONNECTION = "_ConnectionType=Connection Type^^ConnectionType=";
com.inq.flash.client.chatskins.SkinControl.CSDL_VERSION = "_version=Flash Version^^version=";
com.inq.flash.client.chatskins.SkinControl.CSDL_VISITED = "_visited=Page Markers^^visited=";
com.inq.flash.client.chatskins.SkinControl.CSDL_DFV = "_dfv=Data^^dfv=";
com.inq.flash.client.chatskins.SkinControl.CSDL_URL = "_URL=Page URL^^URL=";
com.inq.flash.client.chatskins.SkinControl.CSDL_OS = "_OperatingSystem=OS^^OperatingSystem=";
com.inq.flash.client.chatskins.SkinControl.CSDL_USERAGENT = "UserAgent=";
com.inq.flash.client.chatskins.SkinControl.CSDL_PLAYER = "PlayerType=";
com.inq.flash.client.chatskins.SkinControl.CSDL_MANUFACTURER = "Manufacturer=";
com.inq.flash.client.chatskins.SkinControl.CSDL_CALLERPHONE = "_CallerPhone=CallerPhone^^CallerPhone=";
com.inq.flash.client.chatskins.SkinControl.CALL_SUBMIT_PRE = "chat_submit_";
com.inq.flash.client.chatskins.SkinControl.callStreamData = "";
com.inq.flash.client.chatskins.SkinControl.callerNameString = "";
com.inq.flash.client.chatskins.SkinControl.customerIndx = 0;
com.inq.flash.client.chatskins.SkinControl.hostIndx = 0;
com.inq.flash.client.chatskins.SkinControl.click2call = false;
com.inq.flash.client.chatskins.SkinControl.SEC = 1000;
com.inq.flash.client.chatskins.SkinControl.MIN = (60 * com.inq.flash.client.chatskins.SkinControl.SEC);
com.inq.flash.client.chatskins.SkinControl.HOUR = (60 * com.inq.flash.client.chatskins.SkinControl.MIN);
com.inq.flash.client.chatskins.SkinControl.DAY = (24 * com.inq.flash.client.chatskins.SkinControl.HOUR);
com.inq.flash.client.chatskins.SkinControl.TIMEOUT_INITIALPOPUP = (2 * com.inq.flash.client.chatskins.SkinControl.MIN);
com.inq.flash.client.chatskins.SkinControl.TIMEOUT_AVOIDANCE = (30 * com.inq.flash.client.chatskins.SkinControl.SEC);
com.inq.flash.client.chatskins.SkinControl.timerTimeout = null;
com.inq.flash.client.chatskins.SkinControl.keyCount = 0;
com.inq.flash.client.chatskins.SkinControl.msgcntAtEntry = com.inq.flash.client.control.PersistenceManager.GetValue("msgcnt",0);
com.inq.flash.client.chatskins.SkinControl.resizable = true;
com.inq.flash.client.chatskins.SkinControl.autoAgent = null;
com.inq.flash.client.chatskins.SkinControl.bInternationalization = true;
com.inq.flash.client.chatskins.SkinControl._htmlText = "";
com.inq.flash.client.chatskins.SkinControl.bHaveFocus = false;
com.inq.flash.client.chatskins.SkinControl.objHasFocus = null;
com.inq.flash.client.chatskins.SkinControl.openerScript = null;
com.inq.flash.client.chatskins.SkinControl.bInitialized = false;
com.inq.flash.client.chatskins.SkinControl.bChatIsVisible = false;
com.inq.flash.client.chatskins.SkinControl.sSocketIP = null;
com.inq.flash.client.chatskins.SkinControl.cw = null;
com.inq.flash.client.chatskins.SkinControl.textInput = null;
com.inq.flash.client.chatskins.SkinControl.timerForTyping = -1;
com.inq.flash.client.chatskins.SkinControl.typingTimeout = 4000;
com.inq.flash.client.chatskins.SkinControl.userWasTyping = false;
com.inq.flash.client.chatskins.SkinControl.tYImageLabel = "";
com.inq.flash.client.chatskins.SkinControl.defaultTYImageLabel = "";
com.inq.flash.client.chatskins.SkinControl.bPersistBtnPressed = false;
com.inq.ui.ClientBody._collection = new com.inq.utils.Dictionary();
com.inq.utils.Timer.arr = new Array();
com.inq.stage.DragResize.TOUCH_IDENTIFER_UNUSED = -1;
com.inq.stage.DragResize.INSTANCE_LABEL = "instDragResize";
com.inq.stage.DragResize.doc = window.parent.document;
com.inq.stage.DragResize.instance = null;
com.inq.stage.DragResize.DEFAULT_BORDER_COLOR = "SlateGray";
com.inq.flash.client.control.ApplicationController.applicationController = null;
com.inq.flash.client.chatskins.PrintMgr.nameNextSkin = null;
com.inq.flash.client.chatskins.PrintMgr._initialized = com.inq.flash.client.chatskins.PrintMgr._init();
com.inq.flash.client.chatskins.PrintMgr.contextArray = new Array();
com.inq.flash.client.chatskins.PrintMgr.printWindow = null;
com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler.outstanding = 0;
com.inq.flash.client.control.messagehandlers.ChatAutomatonRequestElementSettingHandler._engaged = false;
com.inq.events.HTTPStatusEvent.HTTP_STATUS = "http_status";
com.inq.events.IOErrorEvent.DISK_ERROR = "diskError";
com.inq.events.IOErrorEvent.IO_ERROR = "ioError";
com.inq.events.IOErrorEvent.NETWORK_ERROR = "networkError";
com.inq.events.IOErrorEvent.VERIFY_ERROR = "verifyError";
com.inq.flash.client.chatskins.CoBrowseMgr.customerAcceptsCobrowse = null;
com.inq.flash.client.chatskins.CoBrowseMgr.customerDeclinesCobrowse = null;
com.inq.flash.client.chatskins.CoBrowseMgr.customerAcceptsSharedControl = null;
com.inq.flash.client.chatskins.CoBrowseMgr.customerDeclinesSharedControl = null;
com.inq.flash.client.chatskins.CoBrowseMgr.customerEndCobrowseSession = null;
com.inq.flash.client.chatskins.CoBrowseMgr.agentEndCobrowseSession = null;
com.inq.flash.client.chatskins.CoBrowseMgr.cobrowseBannerText = null;
com.inq.flash.client.chatskins.FocusMonitor.clientWin = null;
com.inq.flash.client.chatskins.FocusMonitor.clientDoc = null;
com.inq.flash.client.chatskins.FocusMonitor._timerIdScroll = -1;
com.inq.flash.client.chatskins.FocusMonitor._bFocused = true;
com.inq.flash.client.chatskins.FocusMonitor._sTitleBarText = "Let's Chat";
com.inq.flash.client.chatskins.FocusMonitor._sTitleBarFlashText = "<<<<<>>>>>";
com.inq.flash.client.chatskins.FocusMonitor._timerInterval = 2000;
com.inq.flash.client.chatskins.FocusMonitor._timer = -1;
com.inq.ui.XFrame.PERSISTENT_URL_COOKIE_PREFIX = "CX_";
com.inq.events.KeyboardEvent.KEY_DOWN = "KeyDown";
com.inq.events.KeyboardEvent.KEY_UP = "KeyUp";
com.inq.events.KeyboardEvent.KEY_PRESS = "KeyPress";
com.inq.flash.client.control.FlashVars.__init = com.inq.flash.client.control.FlashVars._init();
com.inq.flash.client.chatskins.FontMgr.nameNextSkin = null;
com.inq.flash.client.chatskins.FontMgr._initialized = com.inq.flash.client.chatskins.FontMgr._init();
com.inq.flash.client.chatskins.FontMgr.contextArray = new Array();
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.MIN_CACHE_BUST = 12345;
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.LISTEN_FOR_MESSAGES_TIMEOUT = 60000;
com.inq.flash.messagingframework.connectionhandling.HTTPConnectionHandler.CHAT_ID_PARAM = "&chatId=";
com.inq.events.ProgressEvent.PROGRESS = "progress";
com.inq.events.ProgressEvent.SOCKET_DATA = "socketData";
com.inq.flash.messagingframework.FlashMessagingFramework.CONNECTION_TYPE_SOCKET = "socket";
com.inq.flash.messagingframework.FlashMessagingFramework.CONNECTION_TYPE_HTTP = "http";
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.NEED_WAIT_MESSAGE_FIRST_DEFAULT = "Sorry for the delay, please wait";
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.NEED_WAIT_MESSAGE_DEFAULT = "Still busy, please wait";
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.APPX_WAIT_TIME = "<<APPX-WAIT-TIME>>";
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.MINUTE_WAIT_TIME = "<<MINUTE-WAIT-TIME>>";
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.MINUTES_ONLY_WAIT_TIME = "<<MINUTES-ONLY-WAIT-TIME>>";
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.SECOND_WAIT_TIME = "<<SECOND-WAIT-TIME>>";
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.SECONDS_ONLY_WAIT_TIME = "<<SECONDS-ONLY-WAIT-TIME>>";
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.QUEUE_POSITION = "<<QUEUE-POSITION>>";
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.NEED_WAIT_SEQUENCE_MESSAGE = "Still busy, please wait | 1 |30";
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.LEGACY_MESSAGE_PROCESSING = "LEGACY_MESSAGE_PROCESSING";
com.inq.flash.client.control.messagehandlers.NeedWaitHandler.SEQUENCE_MESSAGE_PROCESSING = "SEQUENCE_MESSAGE_PROCESSING";
com.inq.utils.Util.isIE = (!!(window.document["all"]) && !window["opera"]);
com.inq.utils.Util.configArea = "skinConfig";
haxe.Timer.arr = new Array();
com.inq.flash.client.control.XFrameWorker.DO_NOT_DISPLAY_IN_CI = "<!-- Data Pass -->";
com.inq.flash.client.chatskins.EmailMgr.SHOW_BUTTON_STATE = 0;
com.inq.flash.client.chatskins.EmailMgr.SHOW_ALL_STATE = 1;
com.inq.flash.client.chatskins.EmailMgr.SHOW_NONE_STATE = 2;
com.inq.flash.client.chatskins.EmailMgr._initialized = com.inq.flash.client.chatskins.EmailMgr._init();
com.inq.flash.client.chatskins.EmailMgr.emailButton = null;
com.inq.flash.client.chatskins.EmailMgr.emailButtonCap = null;
com.inq.flash.client.chatskins.EmailMgr.emailCanvas = null;
com.inq.flash.client.chatskins.EmailMgr.emailCanvasCap = null;
com.inq.flash.client.chatskins.EmailMgr.chatCanvas = null;
com.inq.flash.client.chatskins.EmailMgr.tyCanvas = null;
com.inq.flash.client.chatskins.ChatTextArea.RENDER_DELAY = 10;
com.inq.flash.client.chatskins.ChatTextArea.AGENT = 1;
com.inq.flash.client.chatskins.ChatTextArea.CUSTOMER = 2;
com.inq.flash.client.chatskins.ChatTextArea.SYSTEM = 3;
com.inq.flash.client.chatskins.ChatTextArea.SYSTEM_STATUS = 4;
com.inq.flash.client.chatskins.ChatTextArea.AGENT_ID_PFX = "<tr><td style='vertical-align: top'><span class='agentId'>";
com.inq.flash.client.chatskins.ChatTextArea.AGENT_ID_SFX = "&nbsp;</span>";
com.inq.flash.client.chatskins.ChatTextArea.AGENT_MSG_PFX = "<span class='agentMsg'>";
com.inq.flash.client.chatskins.ChatTextArea.AGENT_MSG_SFX = "</span></td></tr>";
com.inq.flash.client.chatskins.ChatTextArea.CUST_ID_PFX = "<tr><td style='vertical-align: top'><span class='customerId'>";
com.inq.flash.client.chatskins.ChatTextArea.CUST_ID_SFX = ":&nbsp;</span>";
com.inq.flash.client.chatskins.ChatTextArea.CUST_MSG_PFX = "<span class='customerMsg'>";
com.inq.flash.client.chatskins.ChatTextArea.CUST_MSG_SFX = "</span></td></tr>";
com.inq.flash.client.chatskins.ChatTextArea.SYS_PFX = "<tr><td><span class='systemMsg'>";
com.inq.flash.client.chatskins.ChatTextArea.SYS_SFX = "</span></td></tr>";
com.inq.flash.client.chatskins.ChatTextArea.SYSSTAT_PFX = "<tr><td><span class='systemStatMsg'>";
com.inq.flash.client.chatskins.ChatTextArea.SYSSTAT_SFX = "</span></td></tr>";
com.inq.flash.client.chatskins.SndMgr.divSound = null;
com.inq.flash.client.chatskins.SndMgr._initialized = com.inq.flash.client.chatskins.SndMgr._init();
com.inq.flash.client.chatskins.SndMgr._mute = false;
com.inq.flash.client.chatskins.SndMgr.soundEnabled = true;
com.inq.flash.client.chatskins.SndMgr.swfSoundSuppress = false;
com.inq.flash.client.chatskins.SndMgr.MUTE = 0;
com.inq.flash.client.chatskins.SndMgr.UNMUTE = 1;
com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.cobrowsEngagedPositionQueue = new Array();
com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.cobrowsSharedPositionQueue = new Array();
com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.onclickReg = new EReg("onclick=\".+?\"","ig");
com.inq.flash.client.control.messagehandlers.ChatCobrowseMessageHandler.replaceString = "onclick=\"return false;\"";
haxe.Unserializer.DEFAULT_RESOLVER = Type;
haxe.Unserializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe.Unserializer.CODES = null;
com.inq.flash.client.chatskins.ScrollMonitor.numWaiting = 0;
com.inq.flash.client.chatskins.ScrollMonitor.suspendedLevel = 0;
com.inq.flash.client.chatskins.ScrollMonitor._scrollTop = 0;
com.inq.flash.client.chatskins.ScrollMonitor._scrollLeft = 0;
com.inq.flash.client.chatskins.ScrollMonitor._scrollTopPrev = com.inq.flash.client.chatskins.ScrollMonitor.getScrollTop();
com.inq.flash.client.chatskins.ScrollMonitor._scrollLeftPrev = com.inq.flash.client.chatskins.ScrollMonitor.getScrollLeft();
com.inq.flash.client.chatskins.ScrollMonitor._zoomPrev = null;
com.inq.flash.client.chatskins.ScrollMonitor.Inq = null;
com.inq.flash.client.chatskins.ScrollMonitor.clientWin = null;
com.inq.flash.client.chatskins.ScrollMonitor.clientDoc = null;
com.inq.flash.client.chatskins.ScrollMonitor._timerIdScroll = -1;
com.inq.flash.client.chatskins.ScrollMonitor.whenScrollClosure = null;
com.inq.ui.Stage._dragBar = window.parent.document.getElementById("inqTitleBar");
com.inq.ui.Stage._resizeCorner = window.parent.document.getElementById("inqDivResizeCorner");
com.inq.ui.Stage.stage = null;
com.inq.flash.client.control.MinimizeManager.agentMsgCounter = null;
com.inq.flash.client.control.MinimizeManager.agentText = null;
com.inq.flash.client.control.MinimizeManager.btnRestore = null;
com.inq.flash.client.control.MinimizeManager.btnMinimize = null;
com.inq.flash.client.control.MinimizeManager.btnReallyMinimized = null;
com.inq.flash.client.control.MinimizeManager.IS_MINIMIZED = -1;
com.inq.flash.client.control.MinimizeManager.SHOW_FAKE_MINIMIZE = -2;
com.inq.flash.client.control.MinimizeManager.elMinimized = null;
com.inq.flash.client.control.MinimizeManager._minimizedOffset = null;
com.inq.flash.client.control.MinimizeManager.inqChatStage = null;
com.inq.flash.client.control.MinimizeManager.originalScalingMeta = null;
com.inq.flash.client.control.MinimizeManager.NOT_MINIMIZED = -1;
com.inq.flash.client.control.MinimizeManager.META_ID = "tcChat_viewport";
com.inq.flash.client.control.MinimizeManager.SCALING_META = "<meta name=\"" + "tcChat_viewport" + "\" content=\"width=device-width, initial-scale=1, maximum-scale=10.0, minimum-scale=1, user-scalable=1\" />";
com.inq.flash.client.control.MinimizeManager.NO_SCALING_META = "<meta name=\"" + "tcChat_viewport" + "\" content=\"width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=0\" />";
com.inq.flash.client.control.MinimizeManager.movedMinimize = 0;
com.inq.net.URLLoader.MAXIMUM_IE_URL_LENGTH = 2083;
com.inq.net.URLLoader.SCRIPT = "S" + "C" + "R" + "I" + "P" + "T";
com.inq.net.URLLoader.DEFAULT_RETRY_LIMIT = 6;
com.inq.net.URLLoader.IDLE_TIMEOUT = -1;
com.inq.net.URLLoader.AT_LOAD_TIMEOUT = 5000;
com.inq.net.URLLoader.loadingArray = new Array();
com.inq.net.URLLoader.seq = 0;
com.inq.net.URLLoader.init = com.inq.net.URLLoader._init();
com.inq.net.URLLoader._hostedFile = "";
$Main.init = Application.main();
