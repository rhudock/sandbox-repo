package com.inq.api.plugins.integratedmessaging.gateways.applebusinesschat.service;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class TalkAgentOutOptions {

    private List<String> options;

    @JsonCreator
    public TalkAgentOutOptions(@JsonProperty("options") List<String> options) {
        this.options = options;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }
}
