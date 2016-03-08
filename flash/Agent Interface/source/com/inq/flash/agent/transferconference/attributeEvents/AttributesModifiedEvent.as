package com.inq.flash.agent.transferconference.attributeEvents
{
	import flash.events.Event;
	
	import mx.collections.ArrayCollection;

	public class AttributesModifiedEvent extends Event
	{
		public static var ATTRIBUTES_MODIFIED_EVENT:String = "attributesmodified";
		public var transferBUnits:ArrayCollection;
        public var bUnitAttributes:ArrayCollection = new ArrayCollection();
		/*public function AttributesModifiedEvent(type:String, bUnitAttributes:ArrayCollection,bubbles:Boolean=false, cancelable:Boolean=false)
		{
			super(type, bubbles, cancelable);
			this.bUnitAttributes = bUnitAttributes; 
		}*/

        public function AttributesModifiedEvent(type:String, transferBUnits:ArrayCollection, bubbles:Boolean = false, cancelable:Boolean = false) {
            super(type, bubbles, cancelable);
            this.transferBUnits = transferBUnits;
        }
		
		override public function clone():Event {
			return (new AttributesModifiedEvent(type,bUnitAttributes));			
		}
	}
}