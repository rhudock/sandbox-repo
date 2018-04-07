package tc.api.plugin.mil.abc.json.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class TalkAgentResponse {
    private String sci;
    private String iid;
    private String timeStamp;
    private String responseCode;
    private String Version;
    private TalkAgentDisplay display;
    private TalkAgentOutOptions outOptions;

    @JsonCreator
    public TalkAgentResponse(@JsonProperty("@SCI") String sci,
                             @JsonProperty("@IID") String iid,
                             @JsonProperty("@TimeStamp") String timeStamp,
                             @JsonProperty("@ResponseCode") String responseCode,
                             @JsonProperty("@Version") String version,
                             @JsonProperty("Display") TalkAgentDisplay display,
                             @JsonProperty("OutOptions") TalkAgentOutOptions outOptions) {
        this.sci = sci;
        this.iid = iid;
        this.timeStamp = timeStamp;
        this.responseCode = responseCode;
        Version = version;
        this.display = display;
        this.outOptions = outOptions;
    }

    public String getSci() {
        return sci;
    }

    public String getIid() {
        return iid;
    }

    public String getTimeStamp() {
        return timeStamp;
    }

    public String getResponseCode() {
        return responseCode;
    }

    public String getVersion() {
        return Version;
    }

    public TalkAgentDisplay getDisplay() {
        return display;
    }

    public TalkAgentOutOptions getOutOptions() {
        return outOptions;
    }
}
