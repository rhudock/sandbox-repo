package com.inq.flash.agent.control.messagehandlers
{
    import com.inq.flash.agent.control.AgentApplicationController;
    import com.inq.flash.agent.data.Chat;
    import com.inq.flash.common.control.CommonApplicationController;
    import com.inq.flash.common.control.handlers.CommonApplicationMessageHandler;
    import com.inq.flash.common.data.MessageFields;
    import com.inq.flash.common.settings.SettingManager;
    import com.inq.flash.messagingframework.Message;
    import com.inq.flash.messagingframework.Participant;
    import com.inq.flash.messagingframework.StringUtils;
    import flash.events.Event;
    import mx.events.ListEvent;

public class ChatroomMembershipHandler extends CommonApplicationMessageHandler
	{
		private var chatroomManager:ChatroomManager;

		public function ChatroomMembershipHandler(chatroomManager:ChatroomManager, controller:CommonApplicationController) {
			super(MessageFields.TYPE_CHATROOM, controller);
			this.chatroomManager = chatroomManager;
		}

		override public function processMessage(message:Message):void {
			var chat:Chat = chatroomManager.getChatroom(message.getProperty(MessageFields.KEY_CHATROOM_ID));
			if (chat == null)
				return;
			if (message.getMessageType() == MessageFields.TYPE_CHATROOM_MEMBER_CONNECTED) {
				var textToDisplay:String = message.getProperty(MessageFields.KEY_DISPLAY_TEXT);
				var userType:String = message.getProperty(MessageFields.KEY_CHATROOM_MEMBER_TYPE);
				chat.getController().addTextToTranscript(textToDisplay);
				if (userType == Participant.TYPE_UTILITY) {
					chat.addParticipant(new Participant(userType,
										message.getProperty(MessageFields.KEY_CHATROOM_MEMBER_ID),
										message.getProperty(MessageFields.KEY_CHATROOM_MEMBER_NAME),
                                        message.getProperty(MessageFields.KEY_CHATROOM_UTILITY_SUBTYPE)
                            ));
				} else if (userType == Participant.TYPE_AGENT) {
                    var agentID:String = message.getProperty(MessageFields.KEY_CHATROOM_MEMBER_ID);
                    var tcMode:String = message.getProperty(MessageFields.KEY_TC_MODE);
                    var participant:Participant = chat.getParticipant(agentID);
                    if (tcMode == "conference") {
                        var screening:String = message.getProperty(MessageFields.KEY_SCREENING);
                        if (participant == null) {
                            participant = new Participant(userType,
                                    message.getProperty(MessageFields.KEY_CHATROOM_MEMBER_ID),
                                    message.getProperty(MessageFields.KEY_CHATROOM_MEMBER_NAME),
                                    null, screening == "false", screening == "true");
                            chat.addParticipant(participant);
                        } else {
                            participant.setIsMember(true);
                            participant.setIsScreening(screening == "true");
                        }
                        if (chat.getOwnerID() == null && screening != "true" && SettingManager.getConferenceSetting(chat.getSettingIDs()).getAutoTransfer()) {
                            participant.setIsScreening(screening == "true");
                            chat.getController().sendOwnershipTransferRequest(agentID, true);
                        }
                        chat.getController().refreshAttributePanel();
                    } else {
                        chat.addParticipant(new Participant(userType,
                                    message.getProperty(MessageFields.KEY_CHATROOM_MEMBER_ID),
                                    message.getProperty(MessageFields.KEY_CHATROOM_MEMBER_NAME), null));
                    }
				} else if (userType == Participant.TYPE_CALL) {
					//do nothing
				} else {
					if (StringUtils.isPositiveStringValue(message.getProperty(MessageFields.KEY_PERSISTENT_FLAG))) {
						chat.persistent = true;
						chat.getController().attentionNeeded = true;
						chat.resetTimer();
					}
					AgentApplicationController(controller).getChatNavigator().indicateClientRejoined(chat);
				}
			}
			else if (message.getMessageType() == MessageFields.TYPE_CHATROOM_MEMBER_LOST) {
				var textToDisplay2:String = message.getProperty(MessageFields.KEY_DISPLAY_TEXT);
				var userType2:String = message.getProperty(MessageFields.KEY_CHATROOM_MEMBER_TYPE);
				if (userType2 == Participant.TYPE_UTILITY || userType2 == Participant.TYPE_AGENT) {
                    chat.removeParticipant(message.getProperty(MessageFields.KEY_CHATROOM_MEMBER_ID));
					chat.getController().indicateMemberLost(textToDisplay2);
				} else if (userType2 == Participant.TYPE_CLIENT) {
					AgentApplicationController(controller).getChatNavigator().indicateMemberLost(chat, true, textToDisplay2);
				} else if (userType2 == Participant.TYPE_CALL) {
                    chat.removeParticipant(message.getProperty(MessageFields.KEY_CHATROOM_MEMBER_ID));
				}
                //REQ-2821
                if (!chat.internalChat) {
                    var chatPanel:ChatPanel = ChatHandler.getChatPanel(AgentApplicationController(controller), message.getProperty(MessageFields.KEY_CHATROOM_ID));
                    chatPanel.participantSelectionComboBox.selectedIndex = 0;
                    chatPanel.participantSelectionComboBox.dispatchEvent(new ListEvent(Event.CHANGE));
                }
			}
		}
	}
}
