package com.inq.flash.agent.transferconference
{
	import mx.collections.ArrayCollection;
	
	public class TransferProperties {

		private var _bUnitName:String;
		private var _bUnitID:String;
		private var _agID:String;
		private var _agent:Agent;
		private var _selectedAttributes:ArrayCollection;

        public function set bUnitName(name:String):void {
        	_bUnitName = name;
        }
        
        public function get bUnitName():String {
        	return _bUnitName;
        }
        
        public function set agent(agent:Agent):void {
        	_agent = agent;
        }
        
        public function get agent():Agent {
        	return _agent;
        }

        public function set selectedAttributes(attributesSelected:ArrayCollection):void {
        	_selectedAttributes = attributesSelected;
        }
        
        public function get selectedAttributes():ArrayCollection {
        	return _selectedAttributes;
        }
        
        public function set bUnitID(i:String):void {
        	_bUnitID = i;
        }
        
        public function get bUnitID():String {
        	return _bUnitID;
        }

        public function get agID():String {
            return _agID;
        }

        public function set agID(value:String):void {
            _agID = value;
        }

        public function get agentID():String {
            return agent == null ? null : agent.agentID;
        }
	}
}