package com.inq.flash.agent.control {
import com.inq.flash.agent.view.IFrame;
import mx.containers.TabNavigator;

import flash.utils.Dictionary;

import mx.collections.ArrayCollection;
import mx.core.UIComponent;
import mx.containers.VBox;

public class FrameManager {
    private static var chatID2Frame:Dictionary = new Dictionary();

    public static function createFrame(componentID:String, index:int, componentStack:TabNavigator):IFrame {
        var id:String = "iFrameID_" + index + "_" + componentID;
        var chatFrames:ArrayCollection = chatID2Frame[index];
        if (chatFrames != null) {
            for each (var chatFrame:IFrame in chatFrames) {
        		if (chatFrame.iFrameID == id) {
        			return chatFrame;
        		}
        	}
        }
		var vbox:VBox = new VBox();
		vbox.label = componentID;
		vbox.percentWidth = 100;
		vbox.percentHeight = 100;
        var iFrame:IFrame = new IFrame();
        iFrame.iFrameID = id;
        if (chatFrames == null) {
            chatFrames = new ArrayCollection();
            chatID2Frame[index] = chatFrames;
        }
        chatFrames.addItem(iFrame);
		vbox.addChild(iFrame);
		componentStack.addChild(vbox);
		componentStack.invalidateDisplayList();
		componentStack.validateDisplayList();
        return iFrame;
    }
	
	/**
	 * This function removes previously created tabs for custom Agent pages like AIUI.
	 * 
	 * @param	index of Chat Panel (1 - 10)
	 * @param	componentStack horizontal Tabs container (Scripts, Cobrowse, AIUI, ...)
	 */
	public static function removeTabs(index:int, componentStack:TabNavigator):void {
		var chatFrames:ArrayCollection = chatID2Frame[index];
		if (chatFrames != null) {
			for each (var chatFrame:IFrame in chatFrames) {
				componentStack.removeChild(chatFrame.parent);
			}
			chatID2Frame[index] = null;
			componentStack.invalidateDisplayList();
			componentStack.validateDisplayList();
		}
	}

    public static function setFramesVisible(index:int, framesVisible:Boolean):void {
        var chatFrames:ArrayCollection = chatID2Frame[index];
		if (chatFrames != null) {
			for each (var chatFrame:IFrame in chatFrames) {
				chatFrame.setFrameVisible(framesVisible);
			}
		}
    }
}
}