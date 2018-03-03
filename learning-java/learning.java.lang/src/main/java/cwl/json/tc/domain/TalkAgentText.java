package cwl.json.tc.domain;

import com.fasterxml.jackson.core.Version;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import cwl.json.tc.serializer.TalkAgentTextDeserializer;

import java.io.IOException;

public class TalkAgentText {
    private String text;

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public static TalkAgentText buildTalkAgentText(String jsonStr) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        SimpleModule module =
                new SimpleModule("TalkAgentTextDeserializer", new Version(1, 0, 0, null, null, null));
        module.addDeserializer(TalkAgentText.class, new TalkAgentTextDeserializer());
        mapper.registerModule(module);

        return mapper.readValue(jsonStr, TalkAgentText.class);
    }
}
