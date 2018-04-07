package tc.api.plugin.mil.abc.json.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSetter;

public class TalkAgentDisplay {
    private TalkAgentText outText;
    private TalkAgentText alternateOutText;
    private TalkAgentText alternateOutText2;

    public TalkAgentDisplay() {
    }

    @JsonCreator
    public TalkAgentDisplay(@JsonProperty("OutText") TalkAgentText outText,
                            @JsonProperty("AlternateOutText") TalkAgentText alternateOutText,
                            @JsonProperty("AlternateOutText2") TalkAgentText alternateOutText2) {
        this.outText = outText;
        this.alternateOutText = alternateOutText;
        this.alternateOutText2 = alternateOutText2;
    }

    public TalkAgentText getOutText() {
        return outText;
    }

    @JsonSetter("OutText")
    public void setOutText(TalkAgentText outText) {
        outText = outText;
    }

    public TalkAgentText getAlternateOutText() {
        return alternateOutText;
    }

    @JsonSetter("AlternateOutText")
    public void setAlternateOutText(TalkAgentText alternateOutText) {
        alternateOutText = alternateOutText;
    }

    public TalkAgentText getAlternateOutText2() {
        return alternateOutText2;
    }

    @JsonSetter("AlternateOutText2")
    public void setAlternateOutText2(TalkAgentText alternateOutText2) {
        alternateOutText2 = alternateOutText2;
    }
}
