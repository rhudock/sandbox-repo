package com.inq.flash.agent.data
{
	import com.inq.flash.common.data.MessageFields;
	import com.inq.flash.messagingframework.Message;

	public class ScriptRequestMessage extends Message
	{
		public function ScriptRequestMessage(uniqueID:String)
		{
			super();
			setMessageType(MessageFields.TYPE_SCRIPT_REQUEST);
				addProperty(MessageFields.KEY_SCRIPT_ID, uniqueID);
		}		
	}
}
