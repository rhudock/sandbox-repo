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
    }
}
}
