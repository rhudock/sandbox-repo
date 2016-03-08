package com.inq.flash.agent.control.messagehandlers
{
import com.inq.flash.agent.control.AgentApplicationController;
import com.inq.flash.agent.data.Chat;
import com.inq.flash.common.control.CommonApplicationController;
import com.inq.flash.common.control.handlers.CommonApplicationMessageHandler;
import com.inq.flash.common.data.MessageFields;
import com.inq.flash.messagingframework.Message;

/**
 * The class processes xform.communication messages
 */
public class XFormCommunicationHandler extends CommonApplicationMessageHandler {
    private var chatroomManager:ChatroomManager;

    public function XFormCommunicationHandler(chatroomManager:ChatroomManager, controller:CommonApplicationController) {
        super(MessageFields.TYPE_XFORM_COMMUNICATION, controller);
        this.chatroomManager = chatroomManager;
    }

    public override function processMessage(message:Message):void {
        // Do the same that ChatHandler does for chat.communication message
        // TODO: It makes sense to extract common code into helper ,method
        var chatID:String = message.getProperty(MessageFields.KEY_CHAT_ID);
        var chat:Chat = chatroomManager.getChatroom(chatID);
        if (chat == null || chat.isTransfered()) return;
        chat.getController().clickstreamDataReceived(message);
        chat.getController().messageReceived(message);
    }
}
}
