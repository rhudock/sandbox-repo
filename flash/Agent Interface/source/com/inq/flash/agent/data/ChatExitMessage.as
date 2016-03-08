package com.inq.flash.agent.data
{
	import com.inq.flash.common.data.MessageFields;
	import com.inq.flash.messagingframework.Message;
	import com.inq.flash.messagingframework.StringUtils;

	public class ChatExitMessage extends Message
	{
		public function ChatExitMessage(chat:Chat, disposition:String, isAutoTransferFailed: Boolean = false) {
			super();
			setMessageType(MessageFields.TYPE_CHAT_EXIT);
			addProperty(MessageFields.KEY_CHAT_ID, chat.getChatID());
			if (chat.isTransfered()) {
                addProperty(MessageFields.KEY_TC_MODE, MessageFields.DATA_TRANSFER);
            }
            if (isAutoTransferFailed) {
                addProperty(MessageFields.KEY_AUTO_TRANSFER_IGNORED_CHATROOM, MessageFields.TRUE);
            }
            if (chat.isConference()) {
                addProperty(MessageFields.KEY_TC_MODE, MessageFields.DATA_CONFERENCE);
            }
            addProperty(MessageFields.KEY_ESCALATE_FLAG, chat.isEscalated() ? "true" : "false");
            if (chat.isEscalated() && chat.getEscalateReason() != null && chat.getEscalateReason() != "")
                addProperty(MessageFields.KEY_ESCALATE_REASON, StringUtils.encodeStringForMessage(chat.getEscalateReason()));
            if (disposition != null)
                addProperty(MessageFields.KEY_DISPOSITION_ANSWER, StringUtils.encodeStringForMessage(disposition));
		}
	}
}