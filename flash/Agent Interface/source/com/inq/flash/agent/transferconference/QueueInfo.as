package com.inq.flash.agent.transferconference {

import com.inq.flash.common.settings.SiteParams;
import mx.collections.ArrayCollection;

public class QueueInfo {

    private var _queueKey:String;
    private var _bUnitID:String;
    private var _agID:String;
    private var _bUnitName:String;
    private var _transferQueueSlotsAvailable:Number = new Number(0);
    private var _conferenceQueueSlotsAvailable:Number = new Number(0);
    private var _transferQueueThreshold:Number;
    private var _conferenceQueueThreshold:Number;
    private var _chatsInQueue:Number;
    private var _transferBUnitAttributes:ArrayCollection;

    public function QueueInfo(queueKey:String = "", transferQueueThreshold:int = 100, conferenceQueueThreshold:int = 100, chatsInQueue:int = 0) {
        _queueKey = queueKey;
        var bu_ag:Array = queueKey.split(SiteParams.QUEUE_KEY_DELIMITER);
        _bUnitID = bu_ag[0];
        _agID = bu_ag.length == 1 ? null : bu_ag[1];
        _bUnitName = SiteParams.getBUnitName(_bUnitID);
        _transferQueueThreshold = transferQueueThreshold;
        _conferenceQueueThreshold = conferenceQueueThreshold;
        _chatsInQueue = chatsInQueue;
    }

    public function get queueKey():String {
        return _queueKey;
    }

    public function get bUnitID():String {
        return _bUnitID;
    }

    public function set bUnitID(bUnitID:String):void {
        _bUnitID = bUnitID;
    }

    public function get agID():String {
        return _agID;
    }

    public function set agID(value:String):void {
        _agID = value;
    }

    public function get bUnitName():String {
        return _bUnitName;
    }

    public function set bUnitName(bUnitName:String):void {
        _bUnitName = bUnitName;
    }

    public function get transferBUnitAttributes():ArrayCollection {
        return _transferBUnitAttributes;
    }

    public function set transferBUnitAttributes(transferBUnitAttributes:ArrayCollection):void {
        _transferBUnitAttributes = transferBUnitAttributes;
    }

    public function set transferQueueSlotsAvailable(slots:Number):void {
        this._transferQueueSlotsAvailable = slots;
    }
		
    public function get transferQueueSlotsAvailable():Number {
        return _transferQueueSlotsAvailable;
    }
		
    public function set conferenceQueueSlotsAvailable(slots:Number):void {
        this._conferenceQueueSlotsAvailable = slots;
    }
		
    public function get conferenceQueueSlotsAvailable():Number {
        return this._conferenceQueueSlotsAvailable;
    }

    public function get transferQueueThreshold():Number {
        return _transferQueueThreshold;
    }

    public function set transferQueueThreshold(val:Number):void {
        _transferQueueThreshold = val;
    }

    public function get conferenceQueueThreshold():Number {
        return _conferenceQueueThreshold;
    }

    public function set conferenceQueueThreshold(val:Number):void {
        _conferenceQueueThreshold = val;
    }

    public function get chatsInQueue():Number {
        return _chatsInQueue;
    }

    public function set chatsInQueue(chatsInQueue:Number):void {
        _chatsInQueue = chatsInQueue;
    }
	
	public function toString():String {
		var attributes:String = "";
		if (_transferBUnitAttributes != null) {
			for (var bUnitAttribute:Object in _transferBUnitAttributes) {
				attributes = attributes + BUnitAttribute(_transferBUnitAttributes[bUnitAttribute]) + ",";
			}
		}
		return "[" + _bUnitID + "," + _bUnitName + "," + _transferQueueThreshold + "," + _conferenceQueueThreshold + "," + _chatsInQueue + "[" + attributes + "]]";
	}
}
}