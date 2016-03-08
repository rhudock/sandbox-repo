package com.inq.flash.agent.data.events {

public class SIPEvent {
    private var consumedPanel:ChatPanel;
    private var status:String;
    private var canDial:Boolean;
    private var canHangUp:Boolean;

    public function SIPEvent(status:String, consumedPanel:ChatPanel = null, canDial:Boolean = true, canHangUp:Boolean = true) {
        this.consumedPanel = consumedPanel;
        this.status = status;
        this.canDial = canDial;
        this.canHangUp = canHangUp;
    }

    public function getConsumedPanel():ChatPanel {
        return consumedPanel;
    }

    public function getStatus():String {
        return status;
    }

    public function getCanDial():Boolean {
        return canDial;
    }

    public function getCanHangUp():Boolean {
        return canHangUp;
    }
}
}