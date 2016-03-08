package com.inq.flash.agent.control {
    import com.gskinner.spelling.SpellingDictionary;
    import com.inq.flash.agent.control.messagehandlers.AgentStatsResponseMessageHandler;
    import com.inq.flash.agent.control.messagehandlers.AgentStatusHandler;
    import com.inq.flash.agent.control.messagehandlers.ChatAcknowledgeMessageHandler;
    import com.inq.flash.agent.control.messagehandlers.ChatHandler;
    import com.inq.flash.agent.control.messagehandlers.ChatroomManager;
    import com.inq.flash.agent.control.messagehandlers.ChatroomMembershipHandler;
    import com.inq.flash.agent.control.messagehandlers.ClickstreamMessageHandler;
    import com.inq.flash.agent.control.messagehandlers.CobrowseHandler;
    import com.inq.flash.agent.control.messagehandlers.ConferenceMessageHandler;
    import com.inq.flash.agent.control.messagehandlers.OwnershipMessageHandler;
    import com.inq.flash.agent.control.messagehandlers.ScriptHandler;
    import com.inq.flash.agent.control.messagehandlers.TransferInfoHandler;
    import com.inq.flash.agent.control.messagehandlers.XFormCommunicationHandler;
    import com.inq.flash.agent.data.AgentStatsRequestMessage;
    import com.inq.flash.agent.data.Chat;
    import com.inq.flash.agent.data.HistoricTranscriptSettings;
    import com.inq.flash.common.control.CommonApplicationController;
    import com.inq.flash.common.control.handlers.CommonApplicationMessageHandler;
    import com.inq.flash.common.control.handlers.ErrorMessageHandler;
    import com.inq.flash.common.control.handlers.LoginResponseMessageHandler;
    import com.inq.flash.common.control.handlers.SystemMessageHandler;
    import com.inq.flash.common.data.MessageFields;
    import com.inq.flash.common.data.messages.AgentStatusMessage;
    import com.inq.flash.common.data.messages.ChatRequestMessage;
    import com.inq.flash.common.data.messages.ClickToCallStatusMessage;
    import com.inq.flash.common.data.messages.CobrowseStatusMessage;
    import com.inq.flash.common.settings.AgentSetting;
    import com.inq.flash.common.settings.AutoTransfer;
    import com.inq.flash.common.settings.CallSetting;
import com.inq.flash.common.settings.ConferenceSetting;
import com.inq.flash.common.settings.LanguageSetting;
    import com.inq.flash.common.settings.SettingManager;
    import com.inq.flash.common.settings.SiteParams;
    import com.inq.flash.common.settings.SupervisorSetting;
import com.inq.flash.common.settings.TransferSetting;
import com.inq.flash.common.settings.TransitionMessages;
import com.inq.flash.common.utils.DateUtils;
import com.inq.flash.common.views.utils.ButtonlessAlert;
    import com.inq.flash.messagingframework.FlashMessagingFramework;
    import com.inq.flash.messagingframework.Message;
    import com.inq.flash.messagingframework.Participant;
    import com.inq.flash.messagingframework.StringUtils;
    import flash.desktop.NativeProcess;
    import flash.display.Sprite;
    import flash.events.Event;
    import flash.events.KeyboardEvent;
    import flash.events.TimerEvent;
    import flash.net.URLLoader;
    import flash.net.URLRequest;
    import flash.utils.ByteArray;
    import flash.utils.Dictionary;
    import flash.utils.Timer;
    import mx.collections.ArrayCollection;
    import mx.controls.Alert;
    import mx.core.FlexGlobals;
    import mx.events.CloseEvent;
    import mx.logging.ILogger;
    import mx.managers.PopUpManager;
    import mx.utils.URLUtil;

    public class AgentApplicationController extends CommonApplicationController {
        
        [Embed(source="script_access.xml",mimeType="application/octet-stream")]
		private static const script_access_bytes:Class;
		private static var scriptAccessXml:XML;

		private static const LOG:ILogger = LogUtils.getLogger(AgentApplicationController);
		public static const APP_PARAM_USE_ATTR_MOCK_DATA:String = "useAttributeMockData";
		public static const APP_PARAM_CONFIDENCE_FACTOR_TRESHOLD:String = "confidenceFactorTreshold";
		public static const APP_PARAM_AID_ENABLED:String = "aidEnabled";
		public static const CHANGEBLE_BY_USER_STATUSES:Array = [BUSY_STATUS, AVAILABLE_STATUS];
        public static const BUSY_AUTO:String = "busy-auto";
        public static const XFORM_SERVER_PLACEHOLDER:String = "${xformsServerUrl}";

		private static const SIP_KEY_PARAM_LICENSE:String = "license";
		private static const SIP_KEY_PARAM_REGISTER:String = "register";
		public static const MAXIMUM_NUMBER_OF_CHATS:int = 11;

		private static var globalDictionary:Array;
		private static var dictionaryLoaded:Boolean;
		private static var customDictionaryLoaded:Boolean;
        private static var lastLoadedLanguage:String;
        private static var firstLoadedLanguage:String;
		[Bindable]
		public var spellCheckingEnabled:Boolean;
		
		private var chatNavigator:ChatNavigator;
		private var chatroomManager:ChatroomManager;
		private var verifyAlert:ButtonlessAlert;
		private var chatroomsToVerify:int;
		private var canRequestStats:Boolean;
		private var mockCalling:Boolean;
		private var agentStatsTimer:Timer;
		private var busyButtonTimer:Timer;

		private var maxAgentChats:int;
        private var maxForcedAgentChats:int;
		private var holdChatsCount:int;

		private var siteID:int;

		public var sipController:AgentSIPController;
		private var currentAgent:Participant;
        private var scriptHandler:ScriptHandler;
    
        private var mustExitAlert:Alert;
        private static var agentActive:Boolean;

        private var dictionaryMap:Dictionary = new Dictionary();
        private var dictionaryLanguages:Array = new Array();
        private var loadingStarted:Boolean = false;

        private static function checkScriptAccess(siteId:String):Boolean {
            if (scriptAccessXml == null) {
                var bytes:ByteArray = new script_access_bytes() as ByteArray;
                scriptAccessXml = new XML(bytes.readUTFBytes(bytes.length));
            }
            //if site wasn't mentioned in XML file than Agent has access
            var result:Boolean = (scriptAccessXml.sites.site.(@id == siteId)).length() == 0;
            return result;
        }

		public function AgentApplicationController() {
			super();
			loggingOut = false;
			XML.prettyPrinting = false;
			XML.ignoreWhitespace = false;
			XML.ignoreComments = false;
			//create the ChatroomManager
			chatroomManager = new ChatroomManager();

			//register all handlers - order matters
			var loginHandler:CommonApplicationMessageHandler = new LoginResponseMessageHandler(this);
			framework.registerMessageHandler(loginHandler);

            var conferenceHandler:ConferenceMessageHandler = new ConferenceMessageHandler(this);
            framework.registerMessageHandler(conferenceHandler);

            var chatAcknowledgeMessageHandler:ChatAcknowledgeMessageHandler = new ChatAcknowledgeMessageHandler(chatroomManager, this);
            framework.registerMessageHandler(chatAcknowledgeMessageHandler);

			var chatHandler:CommonApplicationMessageHandler = new ChatHandler(chatroomManager, this);
			framework.registerMessageHandler(chatHandler);

			var chatroomMembershipHandler:CommonApplicationMessageHandler = new ChatroomMembershipHandler(chatroomManager, this);
			framework.registerMessageHandler(chatroomMembershipHandler);

			var errorHandler:CommonApplicationMessageHandler = new ErrorMessageHandler(this);
			framework.registerMessageHandler(errorHandler);

			var systemMessageHandler:CommonApplicationMessageHandler = new SystemMessageHandler(this);
			framework.registerMessageHandler(systemMessageHandler);

			scriptHandler = new ScriptHandler(this);
			framework.registerMessageHandler(scriptHandler);

			//register all handlers
			var clickstreamHandler:CommonApplicationMessageHandler = new ClickstreamMessageHandler(chatroomManager, this);
			framework.registerMessageHandler(clickstreamHandler);

			var transferInfoHandler:TransferInfoHandler = new TransferInfoHandler(this);
			framework.registerMessageHandler(transferInfoHandler);

			var ownershipHandler:OwnershipMessageHandler = new OwnershipMessageHandler(this);
			framework.registerMessageHandler(ownershipHandler);

			var xformsHandler:CommonApplicationMessageHandler = new XFormCommunicationHandler(chatroomManager, this);
			framework.registerMessageHandler(xformsHandler);

			ChatPanelController.setChatHandler(ChatHandler(chatHandler));
			ChatPanelController.setChatroomManager(chatroomManager);
			ChatPanelController.setTransferInfoHandler(transferInfoHandler);
			ChatPanelController.setConferenceHandler(conferenceHandler);
			ChatPanelController.setOwnershipHandler(ownershipHandler);

            BreadcrumbMenu.setScriptHandler(scriptHandler);

			var agentStatsResponseMessageHandler:CommonApplicationMessageHandler = new AgentStatsResponseMessageHandler(this);
			framework.registerMessageHandler(agentStatsResponseMessageHandler);

			var agentStatusHandler:AgentStatusHandler = new AgentStatusHandler(this);
			framework.registerMessageHandler(agentStatusHandler);

			agentStatsTimer = new Timer(10000);
			agentStatsTimer.addEventListener(TimerEvent.TIMER, agentStatsTimerTimer);

			busyButtonTimer = new Timer(5000);
			busyButtonTimer.stop();
			busyButtonTimer.addEventListener(TimerEvent.TIMER, busyButtonTimerTimer);
		}

		public override function connect():void {
			super.connect();
		}

		public function getCurrentAgent():Participant {
			return currentAgent;
		}

		public function setChatNavigator(navigator:ChatNavigator):void {
			this.chatNavigator = navigator;
			if (sipController != null) {
				sipController.setChatNavigator(navigator);
			}
		}

		public function getChatNavigator():ChatNavigator {
			return chatNavigator;
		}

		private function reset(): void {
			SettingManager.reset();
			HistoricTranscriptSettings.reset();
		}

		public override function loginSuccessful(pendingChats:String, loginResponseMessage:Message):void {
			reset();
			spellCheckingEnabled = false;
			var customScriptsEnabled:Boolean = false;
			var serverVoipProperties:String;
            var i:int = 0;
			var busyStatusesCopy:XML = busyStatusesXml.copy();
			var busyStatuses:ArrayCollection = new ArrayCollection();
            var audibleAlert:Boolean = false;
			var cobrowseEnabled:Boolean = false;
			var cobrowseURL:String = null;
			var item:XML;
			for each(item in busyStatusesCopy.status.(!hasOwnProperty("@site") || @site == "")){
				busyStatuses.addItem(item.@name);
			}

			var htSettingsIDs:String = loginResponseMessage.getProperty(MessageFields.KEY_HT_SETTINGS_IDS);
			if (htSettingsIDs != null) {
				var htKey:String = MessageFields.KEY_HT_SETTINGS + MessageFields.DOT;
				var htIDs:Array = htSettingsIDs.split(MessageFields.DATA_SITE_SEPARATOR);
				for (var ind:int = 0; ind < htIDs.length; ind++) {
					var htSettings:String = loginResponseMessage.getProperty(htKey + htIDs[ind]);
					HistoricTranscriptSettings.setHTranscriptSettings(htIDs[ind], htSettings);
				}
			}

            SettingManager.parseSetting(MessageFields.KEY_TRANSFER_SETTING, loginResponseMessage, function(prefix:String, settingID:String):void {
                var transferSetting:TransferSetting = new TransferSetting();
                transferSetting.setTransference(StringUtils.isPositiveStringValue(loginResponseMessage.getProperty(prefix + MessageFields.KEY_TRANSFER)));
                transferSetting.setAgentSelection(StringUtils.isPositiveStringValue(loginResponseMessage.getProperty(prefix + MessageFields.KEY_AGENT_SELECTION)));
                transferSetting.setPrioritize(StringUtils.isPositiveStringValue(loginResponseMessage.getProperty(prefix + MessageFields.KEY_PRIORITIZE)));
                transferSetting.setTransferQueueThreshold(Number(loginResponseMessage.getProperty(prefix + MessageFields.KEY_TRANSFER_QUEUE_THRESHOLD)));
                SettingManager.addTransferSetting(settingID, transferSetting);
            });

            SettingManager.parseSetting(MessageFields.KEY_CONFERENCE_SETTING, loginResponseMessage, function(prefix:String, settingID:String):void {
                var conferenceSetting:ConferenceSetting = new ConferenceSetting();
                conferenceSetting.setConference(StringUtils.isPositiveStringValue(loginResponseMessage.getProperty(prefix + MessageFields.KEY_CONFERENCE)));
                conferenceSetting.setScreening(StringUtils.isPositiveStringValue(loginResponseMessage.getProperty(prefix + MessageFields.KEY_SCREENING)));
                conferenceSetting.setJoinTransfer(StringUtils.isPositiveStringValue(loginResponseMessage.getProperty(prefix + MessageFields.KEY_JOIN_TRANSFER)));
                conferenceSetting.setAutoTransfer(StringUtils.isPositiveStringValue(loginResponseMessage.getProperty(prefix + MessageFields.KEY_AUTO_TRANSFER_CHAT_OWNERSHIP)));
                conferenceSetting.setConferenceQueueThreshold(Number(loginResponseMessage.getProperty(prefix + MessageFields.KEY_CONFERENCE_QUEUE_THRESHOLD)));
                SettingManager.addConferenceSetting(settingID, conferenceSetting);
            });

            SettingManager.parseSetting(MessageFields.KEY_CALL_SETTING, loginResponseMessage, function(prefix:String, settingID:String):void {
                var callSetting:CallSetting = new CallSetting();
                callSetting.setMaxCallRedials(Number(loginResponseMessage.getProperty(prefix + MessageFields.KEY_CALL_MAX_AGENT_REDIALS)));
                callSetting.setAutoDial(StringUtils.isPositiveStringValue(loginResponseMessage.getProperty(prefix + MessageFields.KEY_CALL_AUTO_DIALING)));
                callSetting.setCallEnabled(StringUtils.isPositiveStringValue(loginResponseMessage.getProperty(prefix + MessageFields.KEY_CALL_ENABLED)));
                callSetting.setShowCustomerPhone(StringUtils.isPositiveStringValue(loginResponseMessage.getProperty(prefix + MessageFields.KEY_CALL_CUSTOMER_PHONE)));
                callSetting.setVoipProperties(loginResponseMessage.getProperty(prefix + MessageFields.KEY_CALL_SERVER_CONFIG));
                callSetting.setHoldDelays(loginResponseMessage.getProperty(prefix + MessageFields.KEY_CALL_TIMERS));
                callSetting.setEnableMockCalling(StringUtils.isPositiveStringValue(loginResponseMessage.getProperty(prefix + MessageFields.KEY_CALL_MOCK)));
                SettingManager.addCallSetting(settingID, callSetting);

                if (callSetting.getEnableMockCalling()) {
                    mockCalling = true;
                }
                //TODO: Support multiple SIP setting
                var candidateProperties:String = callSetting.getVoipProperties();
                if (candidateProperties != null && candidateProperties.length > 0 ) {
                    serverVoipProperties = StringUtils.decodeStringFromMessage(candidateProperties);
                }
            });

            SettingManager.parseSetting(MessageFields.KEY_AGENT_SETTING, loginResponseMessage, function(prefix:String, settingID:String):void {
                    var agentSetting:AgentSetting = new AgentSetting();
                    agentSetting.setDisabledDelay(StringUtils.isPositiveStringValue(loginResponseMessage.getProperty(prefix + MessageFields.KEY_DISABLE_SCRIPT_DELAY)));
                    agentSetting.setMultipleDispositions(StringUtils.isPositiveStringValue(loginResponseMessage.getProperty(prefix + MessageFields.KEY_ENABLE_MULTIPLE_DISPOSITIONS)));
                    agentSetting.setEnableCustomScripts(StringUtils.isPositiveStringValue(loginResponseMessage.getProperty(prefix + MessageFields.KEY_ENABLE_CUSTOM_SCRIPTS)));
                    agentSetting.setSpellCheckingDisabled(StringUtils.isPositiveStringValue(loginResponseMessage.getProperty(prefix + MessageFields.KEY_DISABLE_SPELL_CHECK)));
                    agentSetting.setAudibleAlert(StringUtils.isPositiveStringValue(loginResponseMessage.getProperty(prefix + MessageFields.KEY_ENABLE_AUDIBLE_ALERT)));
                    agentSetting.setEnableVideo(StringUtils.isPositiveStringValue(loginResponseMessage.getProperty(prefix + MessageFields.KEY_ENABLE_VIDEO)));
                    SettingManager.addAgentSetting(settingID, agentSetting);
                    
                    if (!customScriptsEnabled) {
                        customScriptsEnabled = agentSetting.isEnableCustomScripts();
                    }
                    if (!spellCheckingEnabled) {
                        spellCheckingEnabled = !agentSetting.isSpellCheckingDisabled();
                    }
                    if (!audibleAlert) {
                        audibleAlert = agentSetting.isAudibleAlert();
                    }
            });

            var lastLanguage:String; 
            SettingManager.parseSetting(MessageFields.KEY_LANGUAGE_SETTING, loginResponseMessage, function (prefix:String, settingID:String):void {
                var languageSetting:LanguageSetting = new LanguageSetting();
                var spellCheckDictionary:String = loginResponseMessage.getProperty(prefix + MessageFields.KEY_SPELL_CHECK_DICTIONARY);
                if (spellCheckDictionary) {
                    languageSetting.setLanguage(spellCheckDictionary);
                }
                lastLanguage = languageSetting.getLanguage();
                SettingManager.addLanguageSetting(settingID, languageSetting);
                if (spellCheckingEnabled) {
                    if (dictionaryLanguages.indexOf(languageSetting.getLanguage()) == -1) {
                        // Start loading dictionary only for the first language. If it's not the single language, we are saving other
                        // languages into array, and we'll start to load next dictionary only when the previously load is finished.
                        if (!loadingStarted) {
                            loadWordList(languageSetting.getLanguage());
                            loadingStarted = true;
                        }
                        dictionaryLanguages.push(languageSetting.getLanguage());
                    }
                }
            });

            SettingManager.parseSetting(MessageFields.KEY_TRANSITION, loginResponseMessage, function(prefix:String, settingID:String):void {
                    var transitionMessages:TransitionMessages = new TransitionMessages();
                    transitionMessages.setEnableAutoSendAgentActivity(StringUtils.isPositiveStringValue(loginResponseMessage.getProperty(prefix + MessageFields.KEY_ENABLE_AUTO_SEND_AGENT_TYPING_MSG)));
                    transitionMessages.setAutoSendAgentActivityTimeout(Number(loginResponseMessage.getProperty(prefix + MessageFields.KEY_AUTO_SEND_AGENT_TYPING_MSG_TIMEOUT)) * 1000);
                    SettingManager.addTransitionMessages(settingID, transitionMessages);
            });

            SettingManager.parseSetting(MessageFields.KEY_SUPERVISOR_SETTING, loginResponseMessage, function(prefix:String, settingID:String):void {
                var supervisorSetting:SupervisorSetting = new SupervisorSetting();
                supervisorSetting.setDurationMax(Number(loginResponseMessage.getProperty(prefix + MessageFields.KEY_CHAT_DURATION_MAX_THRESHOLD)));
                supervisorSetting.setDurationMid(Number(loginResponseMessage.getProperty(prefix + MessageFields.KEY_CHAT_DURATION_MID_THRESHOLD)));
                SettingManager.addSupervisorSetting(settingID, supervisorSetting);
            });

            do {
                var siteKey:String = MessageFields.KEY_SITE + MessageFields.DOT + i + MessageFields.DOT;
                var siteId:String = loginResponseMessage.getProperty(siteKey + MessageFields.KEY_ID);
                if (siteId) {
                    var siteParams:SiteParams = new SiteParams();
                    siteParams.setCobrowseEnabled(StringUtils.isPositiveStringValue(loginResponseMessage.getProperty(siteKey + MessageFields.KEY_COBROWSE_ENABLED)));
                    siteParams.setCobrowseURL(loginResponseMessage.getProperty(siteKey + MessageFields.KEY_COBROWSE_URL));
                    siteParams.setBUnitIDs(loginResponseMessage.getProperty(siteKey + MessageFields.KEY_BUSINESS_UNIT_IDS));
                    siteParams.setBUnitNames(loginResponseMessage.getProperty(siteKey + MessageFields.KEY_SITE_BU_NAMES));
                    siteParams.setAgentGroupsIDs(loginResponseMessage.getProperty(siteKey + MessageFields.KEY_AGENT_GROUP_IDS));
                    siteParams.setAgentGroupNames(loginResponseMessage.getProperty(siteKey + MessageFields.KEY_SITE_AG_NAMES));
                    //SiteParams ???
                    siteParams.setScriptTreeXML(loginResponseMessage.getProperty(siteKey + MessageFields.KEY_SCRIPT_TREE));
                    //TODO: this settings should be read from DB, not from file
                    //siteParams.setScriptTreeXML(StringUtils.isPositiveStringValue((loginResponseMessage.getProperty(siteKey + MessageFields.KEY_SCRIPT_ACCESS_DISABLED)));
                    siteParams.setAgentScriptAccess(checkScriptAccess(siteId));
                    siteParams.setAgentAttributes(loginResponseMessage.getProperty(siteKey + MessageFields.KEY_AGENT_SITE_ATTRS));
                    var isAgentGroupSettingsLevel:Boolean = siteParams.getAgentGroupsIDs() != null && siteParams.getAgentGroupsIDs().length > 0;
                    var buID: String;
                    var buKey:String;
                    for each(buID in siteParams.getBUnitIDs()) {
						buKey = siteKey + MessageFields.KEY_BUSINESS_UNIT + MessageFields.DOT + buID + MessageFields.DOT;
                        var timeout:String = loginResponseMessage.getProperty(buKey + MessageFields.KEY_AUTO_TRANSFER_TIMEOUT);
                        var warnDelay:String = loginResponseMessage.getProperty(buKey + MessageFields.KEY_AUTO_TRANSFER_WARN);
                        if (timeout != null && warnDelay != null) {
                            var autoTransfer:AutoTransfer = new AutoTransfer(Number(timeout), Number(warnDelay));
                            siteParams.getBUAutoTransfer()[buID] = autoTransfer;
                        }
						siteParams.setHTranscriptId(buID, loginResponseMessage.getProperty(buKey + MessageFields.KEY_HT_SETTINGS_ID));
                    }
                    SettingManager.addSiteParams(siteId, siteParams);
                    i++;
                    if(!cobrowseEnabled && siteParams.getCobrowseEnabled() && !StringUtils.isEmptyString(siteParams.getCobrowseURL())) {
                        cobrowseEnabled = true;
                        cobrowseURL = siteParams.getCobrowseURL();
                    }


                    for each(item in busyStatusesCopy.status.(hasOwnProperty("@site") && @site == siteId)) {
                        if (!item.hasOwnProperty("@bUnit") || siteParams.getBUnitIDs().indexOf(item.@bUnit.toString()) >= 0) {
                            busyStatuses.addItem(item.@name);
                        }
                    }
                } else {
                    break;
                }
            } while (true);
			FlexGlobals.topLevelApplication.busyStatuses = busyStatuses;
			FlexGlobals.topLevelApplication.parameters[APP_PARAM_CONFIDENCE_FACTOR_TRESHOLD] = Number(loginResponseMessage.getProperty(MessageFields.KEY_CONFIDENCE_FACTOR_TRESHOLD));
			FlexGlobals.topLevelApplication.parameters[APP_PARAM_AID_ENABLED] = StringUtils.isPositiveStringValue(loginResponseMessage.getProperty(MessageFields.KEY_AID_ENABLED));
            ChatHandler.audibleAlert = audibleAlert;

			//TODO: PORTAL-337 Support chats with different SIP client and mock calls for the same Agent.
			// for now it support SIP with only one setting
			if (sipController == null) {
				if (mockCalling || (serverVoipProperties != null && serverVoipProperties.length > 0 && NativeProcess.isSupported)) {
                    var voipUsername:String = loginResponseMessage.getProperty(MessageFields.AGENT_VOIP_USERNAME);
                    var voipPassword:String = loginResponseMessage.getProperty(MessageFields.AGENT_VOIP_PASSWORD);
                    sipController = new AgentSIPController(mockCalling, serverVoipProperties, voipUsername, voipPassword);
                    sipController.setChatNavigator(chatNavigator);
				}
			}
			currentAgent = new Participant(Participant.TYPE_AGENT, loginResponseMessage.getProperty(MessageFields.KEY_AGENT_ID), null, null);
			canRequestStats = true;
            super.loginSuccessful(pendingChats, loginResponseMessage);
			renderStatus();
			var maxChats:String = loginResponseMessage.getProperty(MessageFields.AGENT_MAX_CHATS);
            var maxForced:String = loginResponseMessage.getProperty(MessageFields.AGENT_MAX_FORCED);
			setMaxAgentChats(parseInt(maxChats));
            setMaxForcedAgentChats(parseInt(maxForced));
			FlexGlobals.topLevelApplication.callLater(renderMain, [pendingChats]);
			if (customScriptsEnabled) {
				parseCustomScript(loginResponseMessage);
			}
			BaseApplication.customScriptsEnabled = customScriptsEnabled;
			globalDictionary = new Array();
			if (cobrowseEnabled) {
                cobrowseFramework = new FlashMessagingFramework({"commTypes": "ssl", "crPort": 6566, "crHost": URLUtil.getServerName(cobrowseURL)}, new CobrowseConnectionEventHandler(this));

                var cobrowseHandler:CobrowseHandler = new CobrowseHandler(this);
                cobrowseFramework.registerMessageHandler(cobrowseHandler);

				cobrowseFramework.connect();
			}
		}

		private function loadWordList(language:String):void {
            if (language == null){
                language = LanguageSetting.DEFAULT_LANGUAGE;
            }

			if (language != lastLoadedLanguage) {
				lastLoadedLanguage = language;
				customDictionaryLoaded = false;
				dictionaryLoaded = false;
			var url:String = "https://" + FlexGlobals.topLevelApplication.parameters.crHost + "/chatrouter/agents/wordlists/" + language + "/" + language + ".zlib";
			var customUrl:String = "https://" + FlexGlobals.topLevelApplication.parameters.crHost + "/chatrouter/agents/wordlists/" + language + "/" + language + ".txt";
				var loader:URLLoader = new URLLoader();
				loader.dataFormat = flash.net.URLLoaderDataFormat.BINARY;
				loader.addEventListener(Event.COMPLETE, onWordListLoadedComplete);
				loader.load(new URLRequest(url));
				var loader2:URLLoader = new URLLoader();
				loader2.addEventListener(Event.COMPLETE,onCustomWordListLoadedComplete);
				loader2.load(new URLRequest(customUrl));
		}
		}

		  private function onWordListLoadedComplete(event:Event):void {
	            var loader:URLLoader = URLLoader(event.target);
			 	var bb:* = loader.data as flash.utils.ByteArray;
			 	try{
			 	bb.uncompress();
			} catch (e:Error){
			}
			 	bb.position = 0;
			 	var dwords:String = bb.toString();
    			var array:Array = dwords.split("\n");
				dictionaryLoaded = true;
				dictionariesLoaded(array);
			  }
			
			private function onCustomWordListLoadedComplete(event:Event):void {
			 	var dwords:String = event.target.data.toString();
				//\r\n - for Windows
			 	var array:Array = dwords.split(/\r\n|\n/);
				customDictionaryLoaded = true;
			 	dictionariesLoaded(array);
	        }

			private function dictionariesLoaded(array:Array):void {
				if (array != null && array.length > 0) {
					globalDictionary = globalDictionary.concat(parseAffixes(array));
				}
				if (dictionaryLoaded && customDictionaryLoaded) {
                    SpellingDictionary.allowInstantiation = true;
                    var spellingDictionary:SpellingDictionary = new SpellingDictionary();
                    spellingDictionary.setWordListByIntervals(globalDictionary);
                    dictionaryMap[lastLoadedLanguage] = spellingDictionary;
                    if (!firstLoadedLanguage) {
                        firstLoadedLanguage = lastLoadedLanguage;
                    }
                    globalDictionary = new Array();
                    dictionaryLoaded = false;
                    customDictionaryLoaded = false;
                    dictionaryLanguages.splice(dictionaryLanguages.indexOf(lastLoadedLanguage), 1);
                    // Start loading dictionary for next language
                    var language:String = dictionaryLanguages.pop();
                    if (language != null) {
                        loadWordList(language);
                    }
				}
			}
			
			private function parseAffixes(array:Array):Array {
				var result:Array;
				var affixes:Array = new Array();
				var affixesType:Array = new Array();
				var i:int = 0;
				var lng:int = array.length
				for (; i < lng; i++ ) {
					var affix:String = array[i].substr(0, 4);
					if (affix == "SFX ") {
						affixes[i] = array[i].substr(4);
						affixesType[i] = false;
					} else if (affix == "PFX ") {
						affixes[i] = array[i].substr(4);
						affixesType[i] = true;
					} else {
						break;
					}
				}
				if (i != 0) {
					result = new Array();
					for (; i < lng; i++ ) {
						var word:String = array[i];
						var pos:int = word.lastIndexOf("/");
						if (pos > 0 ) {
							var flags: int = parseInt(word.substr(pos + 1), 32);
							word = word.substr(0, pos);
							var bit: int = 1;
							for (var j:int = 0; j < affixes.length; j++) {
								if (flags & bit) {
									var newWord:String = affixesType[j] ? affixes[j] + word : word + affixes[j];
									result.push(newWord);
								}
								bit = bit << 1;
							}
		}
						result.push(word);
					}
				} else {
					result = array;
				}
				return result;
	        }


		public function isSipComponentAvailable():Boolean {
			return sipController != null;
		}

        private function requestAllScriptPages():void {
            var allScripts:XML = SettingManager.getAllScriptTree();
            var pages:XMLList = allScripts..category.@scriptPageID;
            for each (var scriptPageID:XML in pages) {
                scriptHandler.retrieveScriptPage(null, scriptPageID.toString());
            }
        }

		private function renderMain(pendingChats:String):void {
			chatNavigator.getChatSummary().resetSummary(FlexGlobals.topLevelApplication.controller.userID);
			chatNavigator.resetTrainingPanel(SettingManager.getAllScriptTree());
			if (getStatus() == "logged_out")
				FlexGlobals.topLevelApplication.callLater(setStatus, ["available"]);
            FlexGlobals.topLevelApplication.callLater(requestAllScriptPages);
			if (pendingChats != null && pendingChats.length > 0) {
				verifyAlert = new ButtonlessAlert();
				verifyAlert.text = "verifying chatrooms, please wait...";
				PopUpManager.addPopUp(verifyAlert, Sprite(FlexGlobals.topLevelApplication), true);
				PopUpManager.centerPopUp(verifyAlert);
				chatNavigator.enabled = false;
				var chatroomsToCheck:Array = pendingChats.split(',');
				chatroomsToVerify = chatroomsToCheck.length;
				for (var chatroomIndex:String in chatroomsToCheck){
					var chatroomID:String = chatroomsToCheck[chatroomIndex];
                    var chatroom:Chat = chatroomManager.getChatroom(chatroomID);
                    if (chatroom != null){
                        var tcMode:String = null;
                        if (chatroom.isConference()) {
                            tcMode = MessageFields.DATA_CONFERENCE;
                        } else if (chatroom.isTransfered()) {
                            tcMode = MessageFields.DATA_TRANSFER;
                        }
						var message:Message = new ChatRequestMessage(chatroomID, chatroom.getBUnitID(), chatroom.getSiteID(),
                                chatroom.getClientID(), chatroom.getSessionID(), chatroom.getIncAssignmentID(),  chatroom.getBrID(),
                                chatroom.getOwnerID(), tcMode);
						framework.sendMessage(message);
					} else
						chatroomsToVerify--;
				}
				if (chatroomsToVerify <= 0) {
					verifyAlert.visible = false;
					PopUpManager.removePopUp(verifyAlert);
					chatNavigator.enabled = true;
					verifyAlert = null;
				}
			}
			agentStatsTimerTimer(null);
			//createInitializingProgress();
		}

		public function subscribeSuccessful():void {
			setState("main");
		}

		public function chatroomVerified():void {
			chatroomsToVerify--;
			if (chatroomsToVerify <= 0) {
				verifyAlert.visible = false;
				PopUpManager.removePopUp(verifyAlert);
				chatNavigator.enabled = true;
				verifyAlert = null;
				holdChatsCount = 0;
				var chats:Object = chatroomManager.getChatrooms();
				for (var chatName:String in chats) {
					var chat:Chat = Chat(chats[chatName]);
					if (chat != null && chat.isOnHold()) {
						holdChatsCount++;
					}
				}
                if (holdChatsCount <= 0 && mustExitAlert != null) {
                    PopUpManager.removePopUp(mustExitAlert);
                    mustExitAlert = null;
                }
				sendHoldStatus();
			}
		}

		public override function logout():Boolean {
            if (framework.isConnected() && chatNavigator.activeChatsExist(0)) {
                if (mustExitAlert == null) {
                    mustExitAlert = Alert.show(L10.n.getString('must.exit'), "", Alert.OK, null, function (event:CloseEvent):void {
                        mustExitAlert = null;
                    });
                }
                return false;
            }
			canRequestStats = false;
			if(cobrowseFramework != null) {
			cobrowseFramework.disconnect();
			}
            if (sipController != null) {
                sipController.killSipProcess();
                sipController = null;
            }

            return super.logout();
		}

		public override function isApiServiceUsed():Boolean {
			return true;
		}

		public override function shutdown():void {
			setSubStatus(null);
			chatNavigator.getChatSummary().resetSummary();
            if(cobrowseFramework != null) {
                cobrowseFramework.disconnect();
            }
			super.shutdown();
		}

		protected override function disconnect():void {
            if(cobrowseFramework != null) {
			cobrowseFramework.disconnect();
            }
			canRequestStats = false;
			super.disconnect();
		}

		public override function pauseSendingMessagesDueToDisconnect():void {
			if (!intentionalDisconnect) {
				if (chatNavigator != null)
					chatNavigator.disconnected();
			}
			canRequestStats = false;
		}

		public override function setStatus(newStatus:String):void {
			status = newStatus;
			renderStatus();
		}

		/**
		 * This function is called only on Agent action by clicking button or selecting comboBox
		 */
		public override function changeStatus():void {
			onStatusChange(false)
		}

    /**
     * Invoked on status change event. It inverts status, changes substatus
     * and sends AgentStatusMessage to Supervisor Interface.
     * @param substatusIsAutoBusy "true" if method was invoked on autoBusy event.
     */
        private function onStatusChange(substatusIsAutoBusy:Boolean):void {
            var index:int;
            if (!substatusIsAutoBusy) {
                index = CHANGEBLE_BY_USER_STATUSES.indexOf(status);
            } else {
                index = 1;
            }
            if (index >= 0) {
				setStatus(CHANGEBLE_BY_USER_STATUSES[1 - index]);
				// if we have substatuses selected
				if (FlexGlobals.topLevelApplication.comboBox.selectedIndex >= 0 && !substatusIsAutoBusy) {
					setSubStatus(FlexGlobals.topLevelApplication.comboBox.selectedLabel);
				}
				busyButtonTimer.start();
			}
            // Don't allow to change status for some time
            FlexGlobals.topLevelApplication.comboBox.enabled = false;
			FlexGlobals.topLevelApplication.goBusyButton.enabled = false;
			FlexGlobals.topLevelApplication.goAvailableButton.enabled = false;
            var messageSubStatus:String = substatusIsAutoBusy ? BUSY_AUTO : getSubStatus();
			var statusMessage:Message = new AgentStatusMessage(getStatus(), messageSubStatus);
			framework.sendMessage(statusMessage);
			// reseting substatuses comboBox
			FlexGlobals.topLevelApplication.comboBox.selectedIndex = -1;
        }

        public function autoBusyStatus():void {
            onStatusChange(true);
        }


		/**
		 * This function make component visible according to current status
		 */
		public function renderStatus():void {
			FlexGlobals.topLevelApplication.showGoAvailable = false;
			FlexGlobals.topLevelApplication.showDropDown = false;
			FlexGlobals.topLevelApplication.showGoBusy= false;
			if (status == BUSY_STATUS) {
				FlexGlobals.topLevelApplication.showGoAvailable = true;
			} else if (status == AVAILABLE_STATUS) {
				if (FlexGlobals.topLevelApplication.busyStatuses.length == 0) {
					FlexGlobals.topLevelApplication.showGoBusy = true;
				} else {
					FlexGlobals.topLevelApplication.showDropDown = true;
				}
			}
		}
		
		// This function sends message to AR with number of total chat holded.
		public function holdChat(isHold:Boolean):void {
			if (isHold) {
				holdChatsCount++;
			} else {
				holdChatsCount--;
			}
			sendHoldStatus();
		}

		public function sendHoldStatus():void {
			var statusMessage:Message;
			statusMessage = new AgentStatusMessage(MessageFields.DATA_CALL_HOLD);
			if (maxAgentChats + holdChatsCount <= 10) {
				statusMessage.addPropertyInt(MessageFields.KEY_CALL_HOLD_COUNT, holdChatsCount);
				framework.sendMessage(statusMessage);
			}
		}

		public function getHoldChatsCount():int {
			return holdChatsCount;
		}

		public function busyButtonTimerTimer(event:TimerEvent):void {
			busyButtonTimer.stop();
			FlexGlobals.topLevelApplication.comboBox.enabled = true;
			FlexGlobals.topLevelApplication.goBusyButton.enabled = true;
			FlexGlobals.topLevelApplication.goAvailableButton.enabled = true;
		}

		public function viewNextChat():void {
			chatNavigator.viewNextChat();
		}

		public function viewPreviousChat():void {
			chatNavigator.viewPreviousChat();
		}

		public function enterPressed():void {
			var chatPanel:ChatPanel = chatNavigator.getActiveChatPanel();
			if (chatPanel == null)
				return;
			chatPanel.getController().enterPressed();
		}

		public function typing(event:KeyboardEvent):void {
			var activeChatPanel:ChatPanel = chatNavigator.getActiveChatPanel();
			if (activeChatPanel != null) {
				activeChatPanel.getController().typing(event);
			}
		}

		public function agentStatsTimerTimer(event:TimerEvent):void {
			agentStatsTimer.stop();
			if (canRequestStats) {
				var agentStatsMessage:Message = new AgentStatsRequestMessage();
				framework.sendMessage(agentStatsMessage);
			}
		}

		//@todo refactor me
		public function isAgentLoggedIn():Boolean {
			return canRequestStats;
		}

		public function displayAgentStats(statuses:ArrayCollection):void {
			chatNavigator.getChatSummary().displayAgentStats(statuses);
			agentStatsTimer.start();
		}

		//public override function canRequestSites():Boolean {
		//return true;
		//}

		public override function isAgent():Boolean {
			return true;
		}

		public function getMaxAgentChats():int {
			return maxAgentChats;
		}

		public function setMaxAgentChats(no:int):void {
			maxAgentChats = no;
		}

        public function getMaxForcedAgentChats():int {
            if (maxForcedAgentChats > maxAgentChats) {
			    return maxForcedAgentChats;
            }
            else {
                return maxAgentChats;
            }
		}

		public function setMaxForcedAgentChats(no:int):void {
			maxForcedAgentChats = no;
		}

		//for logging click 2 call events click 2 call status message

		public function sendClick2CallStatus(chatID:String, bUnitID:String, agentID:String, status:String, custTerminated:String = "0"):void {
			var clickToCallStatusMessage:ClickToCallStatusMessage = new ClickToCallStatusMessage(chatID, bUnitID, FlexGlobals.topLevelApplication.userField.text, status, custTerminated);
			LOG.debug(clickToCallStatusMessage.serialize());
			framework.sendMessage(clickToCallStatusMessage);
		}

		public function sendCobrowseStatus(chatID:String, siteID:String, agentID:String, status:String, chatData:String):void {
			var cobrowseStatusMessage:CobrowseStatusMessage = new CobrowseStatusMessage(chatID, chatData, agentID, status);
			LOG.debug(cobrowseStatusMessage.serialize());
			framework.sendMessage(cobrowseStatusMessage);
		}

        public function sendSyncMessage(dtID:String, cacheID:String, label:String, div:String, path:String):void {
            var chatPanel:ChatPanel = chatNavigator.getActiveChatPanel();
            if (chatPanel != null) {
                var realCommand:String = "xform to grow." + div + "|" + XFORM_SERVER_PLACEHOLDER + path + dtID + "&cacheId=" + cacheID;
                chatPanel.getController().sendScript("PR for dtID=" + dtID + " " + label, false, true, false, null, null, null, null, null, realCommand);
            }
        }

    public static function isAgentActive(): Boolean {
            return agentActive;
        }

        public static function setAgentActive(active: Boolean):void {
            agentActive = active;
        }

        public function getDictionary(language: String = null):SpellingDictionary {
            var spellingDictionary:SpellingDictionary = dictionaryMap[language];
            if (spellingDictionary != null) {
                return spellingDictionary;
            } else {
                return dictionaryMap[firstLoadedLanguage];
            }
        }
	}
}
