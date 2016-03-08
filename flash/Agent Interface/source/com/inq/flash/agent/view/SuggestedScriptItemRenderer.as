package com.inq.flash.agent.view
{
import com.inq.flash.agent.control.ChatPanelController;

import flash.events.Event;
import flash.events.MouseEvent;

import mx.controls.Text;

public class SuggestedScriptItemRenderer extends Text
{
    public function SuggestedScriptItemRenderer() {
        super();
        selectable = false;
        addEventListener(MouseEvent.MOUSE_OVER, mouseOver);
        addEventListener(MouseEvent.MOUSE_OUT, mouseOut);
    }

    public function mouseOver(event:Event):void {
        if (data == null) return;
        setStyle("color", "#669966");
    }

    public function mouseOut(event:Event):void {
        if (data == null) return;
        setStyle("color", "#000000");
    }

    override public function invalidateProperties():void {
        setStyle("fontSize", "13");
        super.invalidateProperties();
    }
}
}
