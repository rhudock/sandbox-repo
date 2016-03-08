/**
 * Author: avasileuski
 */
package com.inq.flash.agent.view{
import com.inq.flash.agent.control.ChatPanelController;

import flash.display.DisplayObject;

import mx.controls.Button;
import mx.core.IFlexDisplayObject;

public interface DispositionPanel extends IFlexDisplayObject {
    function init(dispositionInfo:XMLList, controller:ChatPanelController, index:int):void;
    function getCancelButton():Button;
    function asDisplayObject():DisplayObject;
}
}
