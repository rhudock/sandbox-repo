package com.lee.actionscript {
import flash.display.Sprite;

/**
 * http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/RegExp.html
 */
public class RegExTest extends Sprite {
    public function RegExTest() {

        example01();
        example02();

    }


    private function example01():void {
        var str:String = "<p>Hello\n"
                + "again</p>"
                + "<p>Hello</p>";

        var pattern:RegExp = /<p>.*?<\/p>/;
        trace(pattern.dotall) // false
        trace(pattern.exec(str)); // <p>Hello</p>

        pattern = /<p>.*?<\/p>/s;
        trace(pattern.dotall) // true
        trace(pattern.exec(str));
    }


    private function drawColoredRectIn():void {
        var pattern:RegExp = /foo\d/;
        var str:String = "foo1 foo2";
        trace(pattern.global); // false
        trace(pattern.exec(str)); // foo1
        trace(pattern.lastIndex); // 0
        trace(pattern.exec(str)); // foo1

        pattern = /foo\d/g;
        trace(pattern.global); // true
        trace(pattern.exec(str)); // foo1
        trace(pattern.lastIndex); // 4
        trace(pattern.exec(str)); // foo2
    }

    private function example02():void {
        // 9047830181111678382:test
        var pattern:RegExp = /^\d{19}/;
        var str:String = "9047830181111678382:test";
        trace(pattern.global); // false
        trace(pattern.exec(str)); // foo1
    }
}
}
