package com.inq.flash.agent.control.messagehandlers {
    import com.inq.flash.agent.control.AgentApplicationController;
    import com.inq.flash.agent.data.JoinConferenceMessage;
    import com.inq.flash.common.control.CommonApplicationController;
    import com.inq.flash.common.control.handlers.CommonApplicationMessageHandler;
    import com.inq.flash.common.data.MessageFields;
    import com.inq.flash.messagingframework.Message;
    import com.inq.flash.messagingframework.StringUtils;

    public class ConferenceMessageHandler extends CommonApplicationMessageHandler {

        public function ConferenceMessageHandler(controller:CommonApplicationController) {
            super(MessageFields.TYPE_CHAT_CONFERENCE_RESPONSE, controller);
        }

        override public function processMessage(message:Message):void {
            var chatID:String = message.getProperty(MessageFields.KEY_CHAT_ID);
            var chatPanel:ChatPanel = ChatHandler.getChatPanel(AgentApplicationController(controller), chatID);
            if (chatPanel != null) {
                chatPanel.getController().displayTransferStatus(StringUtils.decodeStringFromMessage(message.getProperty(MessageFields.KEY_REASON)));
                chatPanel.canTransferConference = true;
            }
        }

        public function sendRequest(chatID:String, isReassignMode:Boolean = false):void {
            var message:Message = new JoinConferenceMessage(chatID, isReassignMode);
            getMessagingFramework().sendMessage(message);
        }
    }
}