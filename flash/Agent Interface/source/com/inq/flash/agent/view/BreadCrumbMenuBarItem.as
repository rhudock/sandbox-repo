package com.inq.flash.agent.view
{
	import mx.controls.menuClasses.MenuBarItem;
	import flash.display.DisplayObject;
	
	public class BreadCrumbMenuBarItem extends MenuBarItem
	{	
		public static var downIcon:Class;
        public static var rightIcon:Class;
		
		private var iconClass:Class;
		private var updating:Boolean;
		
		public override function set menuBarItemState(value:String):void
	    {
	    	if (updating && iconClass != null) return;
	    	super.menuBarItemState = value;
			if (value == "itemDownSkin") {
				if (iconClass != downIcon) {
					iconClass = downIcon;	
					invalidateProperties();
				}		
			}
			else {
				if (iconClass != rightIcon) {
					iconClass = rightIcon;		
					invalidateProperties();
				}	
			}
		}
	    
	    override protected function commitProperties():void {
	        super.commitProperties();
	        
            if (iconClass)
            {
                icon = new iconClass();
                addChild(DisplayObject(icon));
            }
        
	        // Invalidate layout here to ensure icons are positioned correctly.
	        invalidateDisplayList();
	    }
	    
	    override protected function updateDisplayList(unscaledWidth:Number, unscaledHeight:Number):void {
			updating = true;
	        super.updateDisplayList(unscaledWidth, unscaledHeight);
	        
	        if (icon)
	        {
	            icon.x = width - icon.measuredWidth;
	            label.x = 10;
	        }
	        updating = false;     
	    }
	    
	}
}