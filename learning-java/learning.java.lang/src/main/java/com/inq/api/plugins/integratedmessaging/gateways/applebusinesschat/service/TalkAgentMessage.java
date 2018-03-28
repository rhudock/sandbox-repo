package com.inq.api.plugins.integratedmessaging.gateways.applebusinesschat.service;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class TalkAgentMessage {
    private TalkAgentResponse talkAgentResponse;

    @JsonCreator
    public TalkAgentMessage(@JsonProperty("TalkAgentResponse") TalkAgentResponse talkAgentResponse) {
        this.talkAgentResponse = talkAgentResponse;
    }

    public TalkAgentResponse getTalkAgentResponse() {
        return talkAgentResponse;
    }
}
