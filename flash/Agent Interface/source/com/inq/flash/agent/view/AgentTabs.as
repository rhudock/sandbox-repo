package com.inq.flash.agent.view
{
	import mx.containers.TabNavigator;

	public class AgentTabs extends TabNavigator
	{
		public function AgentTabs()
		{
			super();
		}
		
		/**
	     *  @private
	     */
	    override protected function createChildren():void
	    {
	        if (!tabBar)
	        {
	            tabBar = new ChatTabBar();
	            tabBar.name = "tabBar";
	            tabBar.focusEnabled = false;
	            tabBar.styleName = this;
	
	            tabBar.setStyle("borderStyle", "none");
	            tabBar.setStyle("paddingTop", 0);
	            tabBar.setStyle("paddingBottom", 0);
	
	            rawChildren.addChild(tabBar);
	        }
	        super.createChildren();
	    }
		
	}
}