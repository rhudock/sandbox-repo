package com.inq.flash.agent.data
{
	import com.inq.flash.messagingframework.Participant;
	
	public class Client extends Participant
	{
		public function Client(id:String, username:String, utilityType:String) {
			super(Participant.TYPE_CLIENT, id, username, utilityType);
		}
	}
}