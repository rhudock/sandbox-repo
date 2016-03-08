package com.inq.flash.agent.view
{
	import mx.core.UITextField;

	public class WrappingUITextField extends UITextField
	{
		
		override public function truncateToFit(truncationIndicator:String=null):Boolean {
			return false;//super.truncateToFit("...");

		}
	}
	
    
}