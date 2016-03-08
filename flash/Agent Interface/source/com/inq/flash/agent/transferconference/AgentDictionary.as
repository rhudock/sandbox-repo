package com.inq.flash.agent.transferconference
{
	import flash.utils.Dictionary;
	
	import mx.collections.ArrayCollection;
	
	public class AgentDictionary
	{
		private var _agentName:String;
		private var _chatSlots:int;
		private var _queuedChatSlots:int;
		
		private var _bUnitAttributes:ArrayCollection;
		
		public function AgentDictionary() {
			_agentName = "";
			_bUnitAttributes = new ArrayCollection;
			_chatSlots = 0;
			_queuedChatSlots = 0;
		}
		
		public function set chatSlots(i:int):void {
			_chatSlots = i;
		}
		
		public function get chatSlots():int {
			return _chatSlots;
		}
		
		public function set queuedChatSlots(i:int):void {
			_queuedChatSlots = i;
		}
		
		public function get queuedChatSlots():int {
			return _queuedChatSlots;
	    }
	    
		public function set agentName(name:String):void {
			_agentName = name;
		}
		
		public function get agentName():String {
			return _agentName;
		}
		
		public function set bUnitAttributes(collection:ArrayCollection):void {
			 _bUnitAttributes = collection;
		}
		
		public function get bUnitAttributes():ArrayCollection {
			return _bUnitAttributes;
		}
		
		public function addBUnitAttribute(dictionary:Dictionary):void {
			_bUnitAttributes.addItem(dictionary);
		}
	}
}