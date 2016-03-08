package com.inq.flash.agent.transferconference
{
public class SelectedAttribute
{
    private var _attrValue:String;
    private var _attrName:String;
    private var _valid:Boolean;

    public function SelectedAttribute(attrValue:String, attrName:String, valid:Boolean = true) {
        _attrValue = attrValue;
        _attrName = attrName;
        _valid = valid;
    }

    public function get attrValue():String {
        return _attrValue;
    }

    public function set attrValue(attrValue:String):void {
        _attrValue = attrValue;
    }

    public function get attrName():String {
        return _attrName;
    }

    public function set attrName(attrName:String):void {
        _attrName = attrName;
    }

    public function get isValid():Boolean {
        return _valid;
    }

    public function set valid(valid:Boolean):void {
        _valid = valid;
    }
}
}