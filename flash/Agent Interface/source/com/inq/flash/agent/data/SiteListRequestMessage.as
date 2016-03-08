package com.inq.flash.agent.data
{
	import com.inq.flash.common.data.MessageFields;
	import com.inq.flash.messagingframework.Message;

	public class SiteListRequestMessage extends Message
	{
		public function SiteListRequestMessage() {
			super(); 
			setMessageType(MessageFields.TYPE_SITE_LIST_REQUEST);						
		}
		
	}
}