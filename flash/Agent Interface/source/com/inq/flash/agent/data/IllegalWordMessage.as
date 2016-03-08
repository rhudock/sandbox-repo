package com.inq.flash.agent.data
{
	import com.inq.flash.common.data.MessageFields;
	import com.inq.flash.messagingframework.Message;
	import com.inq.flash.messagingframework.StringUtils;

	public class IllegalWordMessage extends Message
	{
		public function IllegalWordMessage (illegalWord:String, text:String, chatID:String)
		{
			super();
			setMessageType(MessageFields.TYPE_AGENT_ILLEGAL_WORD);
			addProperty(MessageFields.KEY_ILLEGAL_WORD, illegalWord);
			addProperty(MessageFields.KEY_CHAT_ID, chatID);
			addProperty(MessageFields.KEY_CHAT_DATA, StringUtils.encodeStringForMessage(text));
		}		
	}
}
