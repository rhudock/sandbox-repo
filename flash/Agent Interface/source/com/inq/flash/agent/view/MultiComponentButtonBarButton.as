package com.inq.flash.agent.view
{
	import flash.display.DisplayObject;
	import flash.events.MouseEvent;
	import flash.text.TextFieldAutoSize;
	
	import mx.controls.Button;
	import mx.controls.Text;
	import mx.core.mx_internal;
	
	use namespace mx_internal;
	
	public class MultiComponentButtonBarButton extends Button
	{
		private var text:Text = new Text();
				
		public var answerTimeColor:String;
		public var durationColor:String;
		public var backgroundColor:String;
		public var durationFormatted:String;
		public var answerTime:String;
		public var initialPageMarker:String;
		public var pageColor:String;
		
		private var useNewLabel:Boolean = true;

		public function MultiComponentButtonBarButton()
		{
			super();
		}
		
		override protected function createChildren():void
		{
			text.x = 10;				
			text.y = 5;				
			text.explicitWidth = 150;	
			text.explicitHeight = 50;
			text.width = 150;	
			text.height = 50;
			addChild(text);
			super.createChildren();
		}
		
		
		protected override function rollOverHandler(event:MouseEvent):void
	    {
	    }	
	    protected override function rollOutHandler(event:MouseEvent):void
	    {
	    }
	    protected override function mouseDownHandler(event:MouseEvent):void
	    {
		}
	    protected override function mouseUpHandler(event:MouseEvent):void
	    {
	    }
	     
	    protected override function measure():void
	    {
	    	explicitMaxWidth = explicitMinWidth = 160;
	    	explicitMaxHeight = explicitMinHeight = 50;
	        measuredMinWidth = measuredWidth = 160;
	        measuredMinHeight = measuredHeight = 50;
	    }
	    
	    mx_internal override function layoutContents(unscaledWidth:Number,
                                        unscaledHeight:Number,
                                        offset:Boolean):void
	    {
	    	text.width = 150;	        
	        text.height = 50;
	        text.x = 5;
	        text.y = 5;
	        setChildIndex(DisplayObject(text), numChildren - 1);		
		}
		
		public function setTextFieldHeight(h:int):void {
			text.x = h;
			text.invalidateProperties();
			text.invalidateSize();
		}

		override public function set label(label:String ):void {
			text.htmlText = label;
			if (label != null && label.length > 0) {
				useNewLabel = false;
			}
		}
		
		override public function get label():String {
			return text.htmlText;
		}

		override public function get toolTip():String {
			return text.text;
		}

		public function renderChatTabButton():void {
			setStyle("fillColors", [backgroundColor, backgroundColor, backgroundColor, backgroundColor]);
			if (useNewLabel) {
				var htmlText:String = '<font color="' + answerTimeColor + '">' + answerTime + '</font> || ';
				htmlText += '<font color="' + durationColor + '">' + durationFormatted + '</font><br/>';
				htmlText += '<font color="' + pageColor + '">' + initialPageMarker + '</font>';
				text.htmlText = htmlText;
			} else {
				setStyle("color", answerTimeColor);
			}
			invalidateProperties();
			invalidateDisplayList();
		}
	}
}