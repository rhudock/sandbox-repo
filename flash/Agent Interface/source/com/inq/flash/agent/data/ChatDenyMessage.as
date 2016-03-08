package com.inq.flash.agent.data
{
	import com.inq.flash.common.data.MessageFields;
	import com.inq.flash.messagingframework.Message;

	public class ChatDenyMessage extends Message
	{
		public function ChatDenyMessage(chatRequestMessage:Message, reason:String) {
			super();
			setMessageType(MessageFields.TYPE_CHAT_DENIED);
			addProperty(MessageFields.KEY_CHAT_ID, chatRequestMessage.getProperty(MessageFields.KEY_CHAT_ID));			
			addProperty(MessageFields.KEY_ORIGINAL_MSG_ID, chatRequestMessage.getProperty(MessageFields.KEY_MSG_ID));
			addProperty(MessageFields.KEY_CHAT_DENY_REASON, reason);
		}
		
	}
}