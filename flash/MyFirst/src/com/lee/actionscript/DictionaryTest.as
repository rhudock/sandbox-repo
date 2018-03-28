package com.lee.actionscript {
import flash.display.Sprite;
import flash.text.TextField;
import flash.utils.Dictionary;

public class DictionaryTest extends Sprite {

    public function DictionaryTest() {
        var map:Dictionary = new Dictionary();
        map.name1 = "Alan";
        map["name2"] = "Lee";
        delete map.name2;
        map["name2"] = "Lee";

        for(var key:String in map) {
            trace(key + " is " + map[key]);
        }

        formatUploadURL("https://api-east.touchcommerce.com/chatfiles/10004119/4e97e18d-d98e-4fd0-9aa0-256d21ee17af_chat%20connects.png?site=10004119&agentGroup=10004307");
    }

    private static function formatUploadURL(text:String):String {

        if (text == null) return text;
        var newString:String = "<a "+"href=\"event:"+text+"\"><font color=\"#000080\"><u>"+text+"</u></font></a>";
        trace(newString);
        return newString;
    }
}
}
