package com.inq.flash.agent.data {
import com.inq.flash.common.data.MessageFields;
import com.inq.flash.messagingframework.Message;

public class ServerCommandMessage extends Message {
    public function ServerCommandMessage(chat:Chat, automatonType:String, automatonId:String) {
        super();
        setMessageType(MessageFields.TYPE_SERVER_COMMAND);
        addProperty(MessageFields.KEY_CHAT_ID, chat.getChatID());
        addProperty(MessageFields.KEY_AUTOMATON_TYPE, automatonType);
        addProperty(MessageFields.KEY_AUTOMATON_ID, automatonId);
    }
}
}