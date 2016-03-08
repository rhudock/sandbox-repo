package com.inq.flash.agent.control.messagehandlers {
    import com.inq.flash.agent.control.AgentApplicationController;
    import com.inq.flash.agent.control.ChatPanelController;
    import com.inq.flash.agent.data.Chat;
    import com.inq.flash.agent.data.ClientCommandMessage;
    import com.inq.flash.agent.data.ServerCommandMessage;
    import com.inq.flash.agent.transferconference.SelectedAttribute;
    import com.inq.flash.agent.view.TimeoutAlert;
    import com.inq.flash.common.control.CommonApplicationController;
    import com.inq.flash.common.control.handlers.CommonApplicationMessageHandler;
    import com.inq.flash.common.data.MessageFields;
    import com.inq.flash.common.data.messages.ChatCommunicationMessage;
    import com.inq.flash.common.data.messages.CobrowseStatusMessage;
    import com.inq.flash.common.settings.AutoTransfer;
    import com.inq.flash.common.settings.SettingManager;
    import com.inq.flash.common.settings.SiteParams;
    import com.inq.flash.messagingframework.Message;
    import com.inq.flash.messagingframework.StringUtils;
    import flash.display.NativeWindowDisplayState;
    import flash.display.Sprite;
    import flash.events.TimerEvent;
    import flash.media.Sound;
    import flash.utils.Timer;
    import mx.collections.ArrayCollection;
    import mx.core.FlexGlobals;
    import mx.events.ListEvent;
    import mx.logging.ILogger;
    import mx.managers.PopUpManager;



	public class ChatHandler extends CommonApplicationMessageHandler {
        private static const LOG:ILogger = LogUtils.getLogger(ChatHandler);
        private static const ACTIVITY_TYPE_AGENT_TYPING:String = "2";
        public static const ACTIVITY_TYPE_CUSTOMER_TYPING:String = "3";
        public static const ACTIVITY_TYPE_CUSTOMER_STOPS_TYPING:String = "4";
        public static const ACTIVITY_TYPE_CUSTOMER_SENDING:String = "5";
        public static const ACTIVITY_CUSTOMER_MINIMIZED:String = "11";
        public static const ACTIVITY_CUSTOMER_RESTORED:String = "12";
        private static const KEY_TRANSFER_AGENT_ID:String = "transfer.agent_id";

        //private static const INFO_TRANSFER_FAILED:String = "Transfer Request Failed";
        //private static const INFO_TRANSFER_ACCEPTED:String = "Transfer Request Accepted";
        private static const INFO_TRANSFER_PRIORITIZE:String = "TRANSFER IS PRIORITIZED";
        private static const INFO_CONFERENCE_PRIORITIZE:String = "CONFERENCE IS PRIORITIZED";

        private static const EQ:String = "&eq;";
        private static const STRING_EMPTY:String = "";
        public static const EMPTY_TRANSFER_NOTES:String = "(none)";

		[Embed('../../../../../../../media/message.mp3')]
        private static var messageClass:Class;
		private static var messageSound:Sound = new messageClass() as Sound;
        private static var lastTimePlayed:Number = 0;
		private var chatroomManager:ChatroomManager;
		private var timer:Timer;
        private static const TIMER_TIME:int = 1000;
        private static const MESSAGE_SOUND_INTERVAL:int = 10000;

        public static var audibleAlert:Boolean = false;
        private var timeoutAlert:TimeoutAlert;

		public function ChatHandler(chatroomManager:ChatroomManager, controller:CommonApplicationController){
			super(MessageFields.TYPE_CHAT, controller);
			this.chatroomManager = chatroomManager;
			timer = new Timer(TIMER_TIME);
			timer.addEventListener(TimerEvent.TIMER, timeCounter);
			timer.start();
		}

		override public function processMessage(message:Message):void {
			var chatPanel:ChatPanel;
			var status:String;
                        var automatonName:String;
			var chatID:String = message.getProperty(MessageFields.KEY_CHAT_ID);
			var chat:Chat = chatroomManager.getChatroom(chatID);
			var msgType:String = message.getMessageType();
            if (chat != null) {
            chatPanel = getChatPanel(AgentApplicationController(this.controller), chatID);
            if (msgType == MessageFields.TYPE_CHAT_COMMUNICATION
                    || msgType == MessageFields.TYPE_CHAT_COMMUNICATION_OPENER
                    || msgType == MessageFields.TYPE_CHAT_COMMUNICATION_QUEUE
                    || msgType == MessageFields.TYPE_CHAT_COMMUNICATION_AUTOMATON
                    || msgType == MessageFields.TYPE_CHAT_AUTOMATON_REQUEST
                    || msgType == MessageFields.TYPE_CHAT_AUTOMATON_RESPONSE
                    || msgType == MessageFields.TYPE_CHAT_COMMUNICATION_OUTCOME){

                if (chat.isTransfered())
					return;
				var chatPanelController:ChatPanelController = chat.getController();
                var clientID:String = message.getProperty(MessageFields.KEY_CLIENT_ID);
                if (clientID != null) {
					AgentApplicationController(controller).getChatNavigator().indicateActionRequired(chat);
                    if (!FlexGlobals.topLevelApplication.parameters[BaseApplication.APPLICATION_PARAM_ACTIVATED]
                                || FlexGlobals.topLevelApplication.stage.nativeWindow.displayState == NativeWindowDisplayState.MINIMIZED) {
                        playMessageSound(messageSound.length);
                        BaseApplication.notify();
                    }
                }
				chatPanelController.clickstreamDataReceived(message);
                chatPanelController.messageReceived(message);
                if (msgType == MessageFields.TYPE_CHAT_COMMUNICATION_OUTCOME) {
                    var chatData:String = message.getProperty(MessageFields.KEY_CHAT_DATA);
                    chatPanelController.requestHistoricTranscript(chatData);

                    // Show client outcome from custom:engageChat HTTP DT action to an agent,
                    // agent outcome is already shown by previous call to messageReceived().

                    var clientOutcome:String = message.getProperty(MessageFields.KEY_CLIENT_OUTCOME_DATA);
                    if (clientOutcome != null) {
                        message.setMessageType(MessageFields.TYPE_CHAT_COMMUNICATION_OPENER);
                        message.addProperty(MessageFields.KEY_CHAT_DATA, clientOutcome);
                        chatPanelController.messageReceived(message);
                    }
                }
                var formName:String = message.getProperty(MessageFields.KEY_FORM_NAME);
                if (formName == MessageFields.KEY_FORM_NAME_SIMPLE_PHONE) {
					chatPanelController.firstDial = true;
                }
				chatPanelController.parseFormData(formName, message.getProperty(MessageFields.KEY_FORM_DATA), true);
			} else if (msgType == MessageFields.TYPE_CHAT_COBROWSE){
				if (chat.isTransfered())
					return;
				chat.getController().messageReceived(message);
				chat.getController().parseCobrowseStatus(message.getProperty(MessageFields.KEY_COBROWSE_EVENT));
			} else if (msgType == MessageFields.TYPE_CHAT_EXIT){
				if (chat.isCallEnabled()){
					//voice customers are allowed to close their client window without affecting the agent's screen, since they are on the phone.
					return;
				}
				var textToDisplay:String = message.getProperty(MessageFields.KEY_DISPLAY_TEXT);
				chat.getController().participantLeftChat(message.getProperty(MessageFields.KEY_CLIENT_ID), textToDisplay);
				AgentApplicationController(controller).getChatNavigator().indicateMemberLost(chat, true);
			} else if (msgType == MessageFields.TYPE_CHAT_ACCEPTED){
				AgentApplicationController(controller).chatroomVerified();
                if (chat.getChatID() != null) {
                    // if owner is null then this current agent is owner
                    if (message.getProperty(MessageFields.KEY_CHAT_TRANSCRIPT) != null) {
                        chat.getController().cleanTranscriptText();
                        initDisplayedText(chat.getController(), chat, message.getProperty(MessageFields.KEY_CHAT_TRANSCRIPT), message);
                    }

                    if (message.getProperty(MessageFields.KEY_OWNER_ID) != null) {
                        chat.setOwnerID(message.getProperty(MessageFields.KEY_OWNER_ID));
                    }
                }
				chat.getController().continueSendingMessagesDueToReconnect();
			} else if (msgType == MessageFields.TYPE_CHAT_DENIED){
				if (chat != null){
					chat.getController().invalidateChat();
				}
				AgentApplicationController(controller).chatroomVerified();
			} else if (msgType == MessageFields.TYPE_CHAT_ACTIVITY){
                var decodedMessage:String = StringUtils.decodeStringFromMessage(message.getProperty(MessageFields.KEY_DISPLAY_TEXT));
                chat.getController().indicateCustomerActivity(decodedMessage, message.getProperty(MessageFields.KEY_TYPE));
			} else if (msgType == MessageFields.TYPE_CHAT_TRANSFER_RESPONSE) {
                status = message.getProperty(MessageFields.KEY_STATUS);
                //Transfer accepted, placed into queue
                if (status == MessageFields.DATA_STATUS_ACCEPTED) {
                    AgentApplicationController(controller).getChatNavigator().indicateMemberLost(chat, true);
                    chatPanel.getController().chat.setTransfered();
                    if (message.getProperty(MessageFields.KEY_AUTO_TRANSFER_IGNORED_CHATROOM) == MessageFields.TRUE) {
                        // Suppress disposition window if enabled
                        chatPanel.getController().sendChatExitMessage(null);
                    } else {
                        chatPanel.closeButtonDown(null);
                    }
                } else if (status == MessageFields.DATA_STATUS_FAILED) {
                    if (message.getProperty(MessageFields.KEY_AUTO_TRANSFER_IGNORED_CHATROOM) == MessageFields.TRUE) {
                        chat.getController().addTextToTranscript("no agents available at this time");
                        chat.revertTransefered();
                        chatPanel.getController().endChat(false, true);
                    }
                    chatPanel.canTransferConference = true;
                }
                chatPanel.getController().displayTransferStatus(message.getProperty(MessageFields.KEY_REASON));
            } else if (msgType == MessageFields.TYPE_CHAT_AUTOMATON_COMMAND && message.getProperty(MessageFields.KEY_AUTOMATON_TYPE) == MessageFields.TYPE_CONVERSIVE_AUTOMATON){
                var low:Number = Number(message.getProperty(MessageFields.KEY_CONFIDENCE_THRESHOLD_LOW));
				FlexGlobals.topLevelApplication.parameters[AgentApplicationController.APP_PARAM_CONFIDENCE_FACTOR_TRESHOLD] = Number(message.getProperty(MessageFields.KEY_CONFIDENCE_THRESHOLD_HI));
                if (chatPanel == null) {
                    return;
                }
                chatPanel.showSuggestion(true);
                automatonName = message.getProperty(MessageFields.KEY_AUTOMATON_NAME);
                if (automatonName) {
                    chatPanel.suggestionBoxName.text = automatonName;
                }
                if (chat.ownerID != null || low > Number(message.getProperty(MessageFields.KEY_CONFIDENCE_FACTOR))) {
                    return;
		        }
                var item:Object = new Object();
                item.confidenceFactor = message.getProperty(MessageFields.KEY_CONFIDENCE_FACTOR);
                item.chatData = StringUtils.decodeStringFromMessage(message.getProperty(MessageFields.KEY_AUTOMATON_DATA));
                item.originalText = message.getProperty(MessageFields.KEY_ORIGINAL_TEXT);
                item.suggestionID = message.getProperty(MessageFields.KEY_SUGGESTION_ID);
                item.automatonID = message.getProperty(MessageFields.KEY_AUTOMATON_ID);
                chatPanel.getController().addSuggestedScript(item);
                chatPanel.suggestedScriptListSizeChanged(null);
                //chatPanel.getController().attentionNeeded was removed
				if (FlexGlobals.topLevelApplication.parameters[AgentApplicationController.APP_PARAM_CONFIDENCE_FACTOR_TRESHOLD] < Number(item.confidenceFactor)){
                    chatPanel.getController().agentHasAcknowledgedChatVisually();
                    chatPanel.suggestedScriptList.dispatchEvent(new ListEvent(ListEvent.ITEM_CLICK));
                } else {
                    chatPanel.isSuggestedScriptWaiting = true;
                    AgentApplicationController(controller).getChatNavigator().chatTabs.indicateSuggestedMessageNotSent(chat.getIndex());
                }
			} else if (msgType == MessageFields.TYPE_CHAT_AUTOMATON_INFO){
                if (chatPanel != null) {
                    if(message.getProperty(MessageFields.KEY_INFO_TYPE) == MessageFields.DATA_SUGGESTION_BOX_VISIBLE) {
                    	chatPanel.showSuggestion(message.getProperty(MessageFields.KEY_INFO_DATA) == MessageFields.TRUE);
                    }
                    automatonName = message.getProperty(MessageFields.KEY_AUTOMATON_NAME);
                    if (automatonName) {
                    	chatPanel.suggestionBoxName.text = automatonName;
                    }
			    }
		    } else if (msgType == MessageFields.TYPE_CHAT_MASK_LINE) {
                //this message comes from another Agent
                if (chatPanel != null) {
                    var originalText:String = StringUtils.decodeStringFromMessage(message.getProperty(MessageFields.KEY_ORIGINAL));
                    var maskedText:String = StringUtils.decodeStringFromMessage(message.getProperty(MessageFields.KEY_MASKED));
                    chatPanel.findTranscriptByTextAndMask(originalText, maskedText);
                }
            }
            }
		}

        /**
         * 
         * @param interval in ms during which sound will not be started again
         */
        private function playMessageSound(interval:int = MESSAGE_SOUND_INTERVAL):void {
            if (audibleAlert && controller.playSounds()) {
                var currentTime:Number = new Date().time;
                if ((lastTimePlayed + interval) < currentTime) {
                    lastTimePlayed = currentTime;
                    messageSound.play();
                }
            }
        }

        public static function initDisplayedText(controller:ChatPanelController, chat:Chat, chatTranscript:String, message:Message):void {
            controller.displayChatInfo("Rule:", chat.getRuleName());
            controller.displayChatInfo("Chat ID:", chat.getChatID());
            if (!StringUtils.isEmptyString(chatTranscript)) {
                controller.displayAcknowledgeText(StringUtils.formatTranscriptInformation(message.getProperty(MessageFields.KEY_CONFIG_AGENT_ALIAS), chatTranscript, (message.getProperty(MessageFields.KEY_TRANSCRIPT_HIDDEN) == MessageFields.TRUE), false, SettingManager.getCallSetting(chat.getSettingIDs()).getShowCustomerPhone(), chat.resetTranscript()));
            }
        }

        public static function getChatPanel(controller:AgentApplicationController, chatID:String):ChatPanel {
            var chatPanel:ChatPanel;
            var chatPanelIndex:int = 1;
            do {
                chatPanel = AgentApplicationController(controller).getChatNavigator().getChatPanel(chatPanelIndex);
                if (chatPanel == null) {
                    continue;
                } else if (chatPanel.getController().getChatID() == chatID) {
                    return chatPanel;
                }
                chatPanelIndex++;
			} while (chatPanelIndex < AgentApplicationController.MAXIMUM_NUMBER_OF_CHATS);
            return null;
			}


		public function sendTCRequest(chatID:String, agentID:String, attrs:ArrayCollection, transferNotes:String,
                                      prioritize:Boolean, isTransfer:Boolean, bunitID:String, agId:String, isCallNeeded:Boolean = false,
                                      isCallEnabled:Boolean = false, callInformation:String = null, isAutoTransfer: Boolean = false):void {
            var message:Message = new Message();
            message.setMessageType(isTransfer ? MessageFields.TYPE_CHAT_TRANSFER_REQUEST : MessageFields.TYPE_CHAT_CONFERENCE_REQUEST);
            message.addProperty(MessageFields.KEY_CHAT_ID, chatID);
			message.addProperty(MessageFields.KEY_TRANSFER_BUSINESS_UNIT, bunitID);
            message.addPropertyIfNotNull(MessageFields.KEY_TRANSFER_AGENT_GROUP, agId);
            var chatPanel:ChatPanel = getChatPanel(AgentApplicationController(this.controller), chatID);
            if (prioritize) {
                chatPanel.getController().displayTransferStatus(isTransfer ? INFO_TRANSFER_PRIORITIZE : INFO_CONFERENCE_PRIORITIZE);
		    }
            if (!isAutoTransfer) {
                message.addProperty(MessageFields.KEY_PRIORITIZE, String(prioritize));
            }
			message.addProperty(MessageFields.KEY_TRANSFER_NOTES, StringUtils.isEmptyString(transferNotes) ? EMPTY_TRANSFER_NOTES : StringUtils.encodeStringForMessage(transferNotes));
            if (!StringUtils.isEmptyString(agentID)) {
                message.addProperty(KEY_TRANSFER_AGENT_ID, agentID);
            } else if (attrs != null) {
                var attrString:String = STRING_EMPTY;
                var attr:SelectedAttribute;
                for (var i:int = 0; i < attrs.length; i++) {
                    attr = SelectedAttribute(attrs[i]);
                    if (!StringUtils.isEmptyString(attr.attrValue)) {
                        if (!StringUtils.isEmptyString(attrString)) {
                            attrString += MessageFields.COMMA;
                        }
                        attrString += attr.attrName + EQ + attr.attrValue;
                    }
                }
                message.addProperty(MessageFields.KEY_TRANSFER_ATTRS, attrString);
            }
            if (isTransfer && isCallEnabled) {
                message.addProperty(MessageFields.KEY_CALL_NEEDED, new String(isCallNeeded));
                if (isCallNeeded) {
                    message.addProperty(MessageFields.KEY_CALL_INFORMATION, callInformation);
                }
            }
            if (isAutoTransfer) {
                message.addProperty(MessageFields.KEY_AUTO_TRANSFER_IGNORED_CHATROOM, MessageFields.TRUE);
            }
            getMessagingFramework().sendMessage(message);
        }

        public function sendMessageForChat(messageInfo:Object, chat:Chat):void {
			var message:Message = null;
            if (!messageInfo.cobrowseEvent || messageInfo.cobrowseEvent.length == 0) {
                message = new ChatCommunicationMessage(chat.getChatID(), messageInfo.text, messageInfo.receiverID, messageInfo.scriptTreeId, messageInfo.suggested, messageInfo.confidenceFactor, messageInfo.suggestionID, messageInfo.automatonID, messageInfo.agentEdited);
            }
			else {
                message = new CobrowseStatusMessage(chat.getChatID(), messageInfo.text, messageInfo.receiverID, messageInfo.cobrowseEvent);
            }
			getMessagingFramework().sendMessage(message);
		}

		public function sendCommandForChat(friendlyCommand:String, realCommand:String, scriptTreeId:String, chat:Chat):void {
			var message:Message = new ClientCommandMessage(chat, friendlyCommand, realCommand, scriptTreeId);
			getMessagingFramework().sendMessage(message);
		}

        public function sendServerCommandForChat(chat:Chat, automatonType:String, automatonId:String):void {
			var message:Message = new ServerCommandMessage(chat, automatonType, automatonId);
			getMessagingFramework().sendMessage(message);
		}

        public function sendAgentTyping(chatID:String):void {
			var message:Message = new Message();
            message.setMessageType(MessageFields.TYPE_CHAT_ACTIVITY);
            message.addProperty(MessageFields.TYPE_CHAT + MessageFields.KEY_ID, chatID);
            message.addProperty(MessageFields.KEY_TYPE, ACTIVITY_TYPE_AGENT_TYPING);
			getMessagingFramework().sendMessage(message);
		}

		public function timeCounter(event:TimerEvent):void {
			var chats:Object = chatroomManager.getChatrooms();
			for (var chatName:String in chats) {
				var chat:Chat = Chat(chats[chatName]);
				if (chat == null)
					continue;
				AgentApplicationController(controller).getChatNavigator().updateChatLabel(chat);
                checkAutoTransfer(chat);
                if (BaseApplication.notifyCounter > 0) {
                    playMessageSound();
                }
			}
		}

        public function getController():CommonApplicationController {
            return controller;
        }

        public function checkAutoTransfer(chat: Chat): void {
            // Extract site's params
            var siteParams:SiteParams = SettingManager.getSiteParams(chat.getSiteID());
            // Check if auto transfer enabled, this is auto transfer chat ...
            if (siteParams != null && chat.isAutoTranserPossible()) {
                var bUAutoTransfer: AutoTransfer = siteParams.getBUAutoTransfer()[chat.getBUnitID()];
                if(bUAutoTransfer != null &&
                    // ... auto transfer if client still connected (c2call is an exception),
                    chat.getController().isChattingEnabled() && !chat.getHandled()) {
                    if (chat.isCheckAgentAcivity()) {
                        if(!AgentApplicationController.isAgentActive()) {
                            var currentDate:Number = new Date().time;
							var chatDuration:int = (currentDate - chat.getTimeCreated()) / 1000;
                            var chatPanelControler: ChatPanelController = chat.getController();

                            if(!chat.isAutoTransferWarn() && (chatDuration >= bUAutoTransfer.getWarnDelay())) {
                                chat.setAutoTransferWarn(true);
                                if (timeoutAlert) {
                                    timeoutAlert.visible = true;
                                } else {
                                    timeoutAlert = new TimeoutAlert();
                                    timeoutAlert.chatNavigator = AgentApplicationController(getController()).getChatNavigator();
                                    PopUpManager.addPopUp(timeoutAlert, Sprite(FlexGlobals.topLevelApplication), true);
                                    PopUpManager.centerPopUp(timeoutAlert);
                                }
                                timeoutAlert.chat = chat;
                                timeoutAlert.counter++;
                            }

                            if ((chatDuration > bUAutoTransfer.getTimeout()) &&
                                // ... we don't want send transfer request each 1 seconds (in case no free slots or agents),
                                // ... therefore we try auto transfer once per 20 seconds
                                    ((currentDate - chat.getLastAutoTransferTimestamp()) > 20000)) {
                                // Reset autotransfer timer to send once per 20 seconds
                                chat.resetLastAutoTransferTimestamp();
                                timeoutAlert.counter--;
                                if (timeoutAlert.counter == 0) {
                                    timeoutAlert.setVisible(false);
                                }

                                AgentApplicationController(controller).autoBusyStatus();

                                chat.setTransfered();
                                // Send chat.transfer_request to ChatRouter with flag auto.transfer_ignored_chatroom=true
                                sendTCRequest(chat.getChatID(), null, null, "auto transferred because agent did not respond within SLA",
                                        true, true, chat.getBUnitID(), chat.getAgentGroupID(), false, false, null, true);
                            }
                        } else {
                            chat.setCheckAgentAcivity(false);
                        }
                    }
                }
            }
        }

    }
}
