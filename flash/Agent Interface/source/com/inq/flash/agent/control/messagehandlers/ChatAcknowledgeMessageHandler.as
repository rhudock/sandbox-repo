package com.inq.flash.agent.control.messagehandlers {
    import com.gskinner.spelling.SpellingDictionary;
    import com.inq.flash.agent.control.AgentApplicationController;
    import com.inq.flash.agent.control.ChatPanelController;
    import com.inq.flash.agent.data.Chat;
    import com.inq.flash.agent.data.ChatAcceptMessage;
    import com.inq.flash.agent.data.ChatDenyMessage;
    import com.inq.flash.common.control.CommonApplicationController;
    import com.inq.flash.common.control.handlers.CommonApplicationMessageHandler;
    import com.inq.flash.common.data.MessageFields;
    import com.inq.flash.common.settings.SettingManager;
    import com.inq.flash.common.settings.SiteParams;
    import com.inq.flash.messagingframework.Message;
    import com.inq.flash.messagingframework.Participant;
    import com.inq.flash.messagingframework.StringUtils;
    import flash.display.NativeWindowDisplayState;
    import flash.media.Sound;
    import mx.core.FlexGlobals;
    import mx.logging.ILogger;


    public class ChatAcknowledgeMessageHandler extends CommonApplicationMessageHandler {
        private static const LOG:ILogger = LogUtils.getLogger(ChatAcknowledgeMessageHandler);
        private static const TC_MODE_TRANSFER:String = "transfer";
        private static const TC_MODE_CONFERENCE:String = "conference";

        [Embed('../../../../../../../media/ring.mp3')]
        private static var ringClass:Class;
        private static var ring:Sound = new ringClass() as Sound;
        private var chatroomManager:ChatroomManager;
        public static var audibleAlert:Boolean = false;

        public function ChatAcknowledgeMessageHandler(chatroomManager:ChatroomManager, controller:CommonApplicationController) {
            super(MessageFields.TYPE_CHAT_ACKNOWLEDGE, controller);
            this.chatroomManager = chatroomManager;
        }

        override public function processMessage(message:Message):void {
            var maxChats:int = AgentApplicationController(controller).getMaxAgentChats() + AgentApplicationController(controller).getHoldChatsCount();
            var maxForcedChats:int = AgentApplicationController(controller).getMaxForcedAgentChats();
            var chatPanel:ChatPanel;
            var chatID:String = message.getProperty(MessageFields.KEY_CHAT_ID);
            var chat:Chat = chatroomManager.getChatroom(chatID);
            var msgType:String = message.getMessageType();
            var responseMessage:Message;
            if (controller.isLoggingOut() || controller.isLoggingIn()) {
                responseMessage = new ChatDenyMessage(message, "Logging out in progress");
            } else if (controller.getStatus() != "available") {
                responseMessage = new ChatDenyMessage(message, "This agent is in status '" + controller.getStatus() + "', not 'available'");
            } else {
                if (chat == null) {
                    var siteID:String = message.getProperty(MessageFields.KEY_CONFIG_SITE_ID);
                    var bUnitID:String = message.getProperty(MessageFields.KEY_CONFIG_BUNIT_ID);
                    var siteParams:SiteParams = SettingManager.getSiteParams(siteID);
                    if ((chatroomManager.countChats() >= maxChats && message.getProperty(MessageFields.KEY_FORCED) != "true") || chatroomManager.countChats() >= 10 || (message.getProperty(MessageFields.KEY_FORCED) == "true" && chatroomManager.countChats() >= maxForcedChats)) {
                        responseMessage = new ChatDenyMessage(message, "Max chat count is reached");
                    } else if (siteParams == null) {
                        responseMessage = new ChatDenyMessage(message, "Agent has no access to chat siteID");
                    } else if (siteParams.getBUnitIDs().indexOf(bUnitID) < 0) {
                        responseMessage = new ChatDenyMessage(message, "Agent has no access to chat bUnitID");
                    } else {
                        AgentApplicationController.setAgentActive(false);
                        chat = new Chat(message);
                        chatroomManager.addChatroom(chat.getChatID(), chat);
                        var index:int = AgentApplicationController(controller).getChatNavigator().findAvailableChatPanel();
                        chat.setIndex(index);
                        var tcMode:String = message.getProperty(MessageFields.KEY_TC_MODE);
                        // Add this behavior to try fix problem with issue RTDEV-5797
                        // If we try to send message before sending request to API for HistoricTranscript and before parsing Transcript and subscribing to Cobrowse,
                        // then probably we can fix RTDEV-5797 error
                        getMessagingFramework().sendMessage(new ChatAcceptMessage(message, controller.userID, tcMode, chat));
                        try {
                            chatPanel = AgentApplicationController(controller).getChatNavigator().getChatPanel(index);
                            var chatPanelController:ChatPanelController = chatPanel.getController();
                            AgentApplicationController(controller).getChatNavigator().startNewChat(chat);
                            var spellingDictionary:SpellingDictionary = chatPanelController.getApplicationController().getDictionary(SettingManager.getLanguageSetting(chat.getSettingIDs()).getLanguage());
                            // We need to set SpellingDictionary for each ChatPanel because by default all instances of SpellingDictionary are empty
                            chatPanel.setSpellingDictionaryLanguage(spellingDictionary);
                            var chatTranscript:String = message.getProperty(MessageFields.KEY_CHAT_TRANSCRIPT);
                            chatPanel.clearActionRequired();
                            AgentApplicationController(controller).getChatNavigator().indicateActionRequired(chat);
                            chatPanel.setScreeningMode(false);
                            ChatHandler.initDisplayedText(chatPanelController, chat, chatTranscript, message);
                            if (chatTranscript) {
                                chat.getController().requestHistoricTranscript(StringUtils.completeDecodeStringForMap(chatTranscript));
                            }
                            chatPanel.canTransferConference = tcMode != "conference";
                            chatPanel.setDeviceType(message.getProperty(MessageFields.KEY_DEVICE_TYPE));

                            if (tcMode == TC_MODE_CONFERENCE) {
                                //screening = false means autojoin
                                //screening = true means that agent starts in screening mode, adn we should check join flag to enable/disable JOIN button
                                //join = true means can join (the button is enabled)
                                //join = false means can't join (the button is disabled)
                                if (SettingManager.getConferenceSetting(chat.getSettingIDs()).getScreening()) {
                                    chatPanel.setScreeningMode(true);
                                } else {
                                    //screening = false means autojoin
                                }
                                chat.setOwnerID(message.getProperty(MessageFields.KEY_CHATROOM_OWNER_ID));
                            } else if (tcMode == TC_MODE_TRANSFER || message.getProperty(MessageFields.KEY_IS_REASSIGNMENT_MODE) == MessageFields.TRUE) {
                                if (message.getProperty(MessageFields.KEY_AUTO_TRANSFER_IGNORED_CHATROOM) == MessageFields.TRUE) {
                                    chat.setAutoTransferPossible(true);
                                }
                                var callNeeded:String = message.getProperty(MessageFields.KEY_CALL_NEEDED);
                                chatPanelController.firstDial = callNeeded != null ? callNeeded == MessageFields.TRUE : false;
                                chatPanelController.parseFormData(MessageFields.KEY_FORM_NAME_SIMPLE_PHONE, message.getProperty(MessageFields.KEY_CALL_INFORMATION));
                            } else if (tcMode == null) {
                                chat.setAutoTransferPossible(true);
                            }
                            //initialize chat participants list
                            var participantIndex:int = 0;
                            var participantType:String;
                            var isClientMember:Boolean;
                            do {
                                var memberID:String = message.getProperty(MessageFields.KEY_CHATROOM_MEMBER_ID + MessageFields.DOT + participantIndex);
                                if (memberID == null) {
                                    break;
                                }
                                participantType = message.getProperty(MessageFields.KEY_CHATROOM_MEMBER_TYPE + MessageFields.DOT + participantIndex);
                                if (participantType == Participant.TYPE_CLIENT) {
                                    isClientMember = true;
                                }
                                var newParticipant:Participant = new Participant(participantType, memberID, message.getProperty(MessageFields.KEY_CHATROOM_MEMBER_ID + MessageFields.DOT + participantIndex), message.getProperty(MessageFields.KEY_CHATROOM_UTILITY_SUBTYPE + MessageFields.DOT + participantIndex));
                                newParticipant.setIsMember(true);
                                chat.addParticipant(newParticipant);
                                participantIndex++;
                            } while (true);
                            if ((tcMode == TC_MODE_CONFERENCE || tcMode == TC_MODE_TRANSFER) && !isClientMember) {
                                AgentApplicationController(controller).getChatNavigator().indicateMemberLost(chat, false);
                            }

                            if (!FlexGlobals.topLevelApplication.parameters[BaseApplication.APPLICATION_PARAM_ACTIVATED] || FlexGlobals.topLevelApplication.stage.nativeWindow.displayState == NativeWindowDisplayState.MINIMIZED) {
                                FlexGlobals.topLevelApplication.activate();
                                //orderToFront() brings AIR window on top of other AIR applications, not on top of all windows applications.
                                FlexGlobals.topLevelApplication.stage.nativeWindow.alwaysInFront = true;
                                FlexGlobals.topLevelApplication.stage.nativeWindow.alwaysInFront = false;
                            }
                            if (controller.playSounds()) {
                                ring.play();
                            }
                        } catch (e:Error) {
                            LOG.error("Error: " + e.message + ", details: " + e.getStackTrace());
                        }
                    }
                } else if (message.getProperty(MessageFields.KEY_IS_REASSIGNMENT_MODE) == MessageFields.TRUE) {
                    // this is a case when origin owner gets his chat back after reconnection
                    responseMessage = new ChatAcceptMessage(message, controller.userID, null, chat);
                } else {
                    //another member of the chat is joining
                }
            }

            if (responseMessage) {
                getMessagingFramework().sendMessage(responseMessage);
            }
        }

        public function getController():CommonApplicationController {
            return controller;
        }
    }
}
