package com.inq.flash.agent.view
{
	import mx.controls.MenuBar;
	import mx.events.MenuEvent;
	import mx.controls.Menu;
	import mx.controls.menuClasses.MenuBarItem;
	import mx.core.UIComponentGlobals;
	import flash.geom.Rectangle;
	import mx.managers.ISystemManager;
	import mx.controls.menuClasses.IMenuBarItemRenderer;
	import flash.geom.Point;
	import flash.display.DisplayObject;
	import mx.core.mx_internal;
	import mx.core.ClassFactory;
	import flash.events.KeyboardEvent;
	import flash.ui.Keyboard;
	
	use namespace mx_internal;
	
	public class ProgrammaticMenuBar extends MenuBar {
		
		public function ProgrammaticMenuBar() {
			super();
			menuBarItemRenderer = new ClassFactory(BreadCrumbMenuBarItem);
		}		
		
		public function openMenu():void {
			showAMenu(length - 1);
			MenuBarItem(menuBarItems[length - 1]).menuBarItemState = "itemDownSkin";
			getMenuAt(length - 1).selectedIndex = 0;
			getMenuAt(length - 1).setFocus();
		}

		public function hideMenu():void {
			if (selectedIndex != -1)
                getMenuAt(selectedIndex).hide();            
		}
		
		private function showAMenu(index:Number):void
	    {
	        selectedIndex = index;
	        var item:IMenuBarItemRenderer = menuBarItems[index];
	
	        // The getMenuAt function will create the Menu if it doesn't
	        // already exist.
	        var menu:Menu = getMenuAt(index);
	        var sm:ISystemManager = systemManager;
	        var screen:Rectangle = sm.screen;
	
	        UIComponentGlobals.layoutManager.validateClient(menu, true);
	
	        // popups go on the root of the swf which if loaded, is not
	        // necessarily at 0,0 in global coordinates
	        var pt:Point = new Point(0, 0);
	        pt = DisplayObject(item).localToGlobal(pt);
	        // check to see if we'll go offscreen
	        if (pt.y + item.height + 1 + menu.getExplicitOrMeasuredHeight() > screen.height + screen.y)
	            pt.y -= menu.getExplicitOrMeasuredHeight();
	        else
	            pt.y += item.height + 1;
	        if (pt.x + menu.getExplicitOrMeasuredWidth() > screen.width + screen.x)
	            pt.x = screen.x + screen.width - menu.getExplicitOrMeasuredWidth();
	        pt = DisplayObject(sm.topLevelSystemManager).globalToLocal(pt);

	        menu.show(pt.x, pt.y);
	    }
	}
}