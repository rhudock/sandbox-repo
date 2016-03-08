package com.inq.flash.agent.data
{
	import com.inq.flash.common.data.MessageFields;
	import com.inq.flash.messagingframework.Message;
	import com.inq.flash.messagingframework.StringUtils;

	public class ClientCommandMessage extends Message
	{
		public function ClientCommandMessage(chat:Chat, friendlyCommand:String, realCommand:String, scriptTreeId:String)
		{
			super();
			setMessageType(MessageFields.TYPE_CLIENT_COMMAND);
			addProperty(MessageFields.KEY_CHAT_ID, chat.getChatID());
			addProperty(MessageFields.KEY_CHAT_DATA, StringUtils.encodeStringForMessage(friendlyCommand));
            addProperty(MessageFields.KEY_SCRIPT_ID, scriptTreeId);
			addPropertyIfNotNull(MessageFields.KEY_CHAT_COMMAND, StringUtils.encodeStringForMessage(realCommand));
		}
		
	}
}