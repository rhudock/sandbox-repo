package com.inq.flash.agent.data {
import com.inq.flash.common.data.MessageFields;
import com.inq.flash.messagingframework.Message;

public class JoinConferenceMessage extends Message {
    public function JoinConferenceMessage(chatID:String, isReassignMode:Boolean = false) {
        super();
        setMessageType(MessageFields.TYPE_AGENT_JOINS_CONFERENCE);
        addProperty(MessageFields.KEY_CHAT_ID, chatID);
        if (isReassignMode) {
            addProperty(MessageFields.KEY_IS_REASSIGNMENT_MODE, MessageFields.TRUE);
        }
    }
}
}