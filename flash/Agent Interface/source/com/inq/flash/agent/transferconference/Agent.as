package com.inq.flash.agent.transferconference {
import mx.collections.ArrayCollection;

public class Agent {

    private var _agentID:String;
    private var _availableSlots:int;
    private var _isMember:Boolean;
    private var _isScreening:Boolean;

    private var _maxChatSlots:int;
    private var _queuedChatSlots:int;
    private var _transferedChatSlots:int;

    private var _bUnitAttributes:ArrayCollection;

    public function Agent(agentID:String, availableSlots:int, maxChatSlots:int = 10, isMember:Boolean = false, isScreening:Boolean = false) {
        _agentID = agentID;
        _availableSlots = availableSlots;
        _maxChatSlots = maxChatSlots;
        _isMember = isMember;
        _isScreening = isScreening;
    }

    public function get availableSlots():int {
        return _availableSlots;
    }

    public function set availableSlots(availableSlots:int):void {
        _availableSlots = availableSlots;
    }

    public function get agentID():String {
        return _agentID;
    }

    public function set agentID(agentID:String):void {
        _agentID = agentID;
    }

    public function get maxChatSlots():int {
        return _maxChatSlots;
    }

    public function set maxChatSlots(maxChatSlots:int):void {
        _maxChatSlots = maxChatSlots;
    }

    public function get queuedChatSlots():int {
        return _queuedChatSlots;
    }

    public function set queuedChatSlots(queuedChatSlots:int):void {
        _queuedChatSlots = queuedChatSlots;
    }

    public function get transferedChatSlots():int {
        return _transferedChatSlots;
    }

    public function set transferedChatSlots(transferedChatSlots:int):void {
        _transferedChatSlots = transferedChatSlots;
    }

    public function get bUnitAttributes():ArrayCollection {
        return _bUnitAttributes;
    }

    public function set bUnitAttributes(bUnitAttributes:ArrayCollection):void {
        _bUnitAttributes = bUnitAttributes;
    }

    public function get isMember():Boolean {
        return _isMember;
    }

    public function set isMember(isMember:Boolean):void {
        _isMember = isMember;
    }

    public function get isScreening():Boolean {
        return _isScreening;
    }

    public function set isScreening(isScreening:Boolean):void {
        _isScreening = isScreening;
    }
}
}