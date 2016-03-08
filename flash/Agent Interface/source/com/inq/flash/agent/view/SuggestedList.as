package com.inq.flash.agent.view {
import mx.controls.List;

public class SuggestedList extends List {
    public function SuggestedList() {
        super();
    }

    public function getRowInfo():Array {
        measure();
        return rowInfo;
    }
}
}