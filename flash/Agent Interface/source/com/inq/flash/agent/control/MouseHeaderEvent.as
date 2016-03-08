package com.inq.flash.agent.control
{
	import flash.events.MouseEvent;
	import flash.events.Event;

	public class MouseHeaderEvent extends MouseEvent
	{
        public static const HEADER_MOUSE_OVER:String = "headerMouseOver";
		public static const HEADER_MOUSE_OUT:String = "headerMouseOut";
		
		private var originalMouseEvent:MouseEvent;
		private var headerIndex:int;
		
        // Public constructor.
        public function MouseHeaderEvent(type:String, event:MouseEvent, headerIndex:int) {
        	super(type);
    		originalMouseEvent = event;    	
    		this.headerIndex = headerIndex;
        }

        // Override the inherited clone() method.
        override public function clone():Event {
            return new MouseHeaderEvent(type, originalMouseEvent, headerIndex);
        }
        
        public function get index():int {
        	return headerIndex;
        }
    }
}

