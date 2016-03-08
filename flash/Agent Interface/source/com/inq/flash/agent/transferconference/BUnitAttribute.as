package com.inq.flash.agent.transferconference {

import flash.utils.Dictionary;

public class BUnitAttribute {

    private var _name:String;
    private var _attrValue2Agent:Dictionary;

    public function BUnitAttribute(name:String) {
        _name = name;
    }

    public function get name():String {
        return _name;
    }

    public function set name(name:String):void {
        _name = name;
    }

    public function get attrValue2Agent():Dictionary {
        return _attrValue2Agent;
    }

    public function set attrValue2Agent(attrValue2Agent:Dictionary):void {
        _attrValue2Agent = attrValue2Agent;
    }
	
	public function toString():String { 
		var result:String = _name + "=";
		if (_attrValue2Agent != null) {
			for (var key:Object in _attrValue2Agent) {
				result += key + ":[";
				for (var key2:Object in _attrValue2Agent[key]) {
					result += Agent(_attrValue2Agent[key][key2]).agentID + ",";
				}
				result += "]";
			}
		} else {
			result += "null";
		}

		return result;
	}
}
}