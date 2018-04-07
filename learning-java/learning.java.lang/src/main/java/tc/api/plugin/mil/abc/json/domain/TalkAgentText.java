package tc.api.plugin.mil.abc.json.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.core.Version;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import tc.api.plugin.mil.abc.json.serializer.TalkAgentTextDeserializer;

import java.io.IOException;

public class TalkAgentText {
    private String text;

    public TalkAgentText() {
    }

    @JsonCreator
    public TalkAgentText(@JsonProperty("#text") String text) {
        this.text = text;
    }

    @JsonSetter("#text")
    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public static TalkAgentText buildTalkAgentTextWithDeserializer(String jsonStr) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        SimpleModule module =
                new SimpleModule("TalkAgentTextDeserializer", new Version(1, 0, 0, null, null, null));
        module.addDeserializer(TalkAgentText.class, new TalkAgentTextDeserializer());
        mapper.registerModule(module);

        return mapper.readValue(jsonStr, TalkAgentText.class);
    }

    public static TalkAgentText buildTalkAgentText(String jsonStr) throws IOException {
        // act
        return new ObjectMapper().readerFor(TalkAgentText.class).readValue(jsonStr);
    }
}
