package cwl.json.tc.domain;

public class TalkAgentDisplay {
    private TalkAgentText OutText;
    private TalkAgentText AlternateOutText;
    private TalkAgentText AlternateOutText2;

    public TalkAgentText getOutText() {
        return OutText;
    }

    public void setOutText(TalkAgentText outText) {
        OutText = outText;
    }

    public TalkAgentText getAlternateOutText() {
        return AlternateOutText;
    }

    public void setAlternateOutText(TalkAgentText alternateOutText) {
        AlternateOutText = alternateOutText;
    }

    public TalkAgentText getAlternateOutText2() {
        return AlternateOutText2;
    }

    public void setAlternateOutText2(TalkAgentText alternateOutText2) {
        AlternateOutText2 = alternateOutText2;
    }
}
