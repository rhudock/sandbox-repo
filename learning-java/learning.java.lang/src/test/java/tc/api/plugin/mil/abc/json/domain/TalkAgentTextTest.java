package tc.api.plugin.mil.abc.json.domain;

import com.fasterxml.jackson.core.Version;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.junit.Test;
import tc.api.plugin.mil.abc.json.serializer.TalkAgentTextDeserializer;

import static org.junit.Assert.assertNotNull;

public class TalkAgentTextTest {

    @Test
    public void jsonTest() throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();

        String json = "{\n" +
                "                \"#text\": \"Please tell me the type of latte you'd like: <ul><li><a href=\\\"#\\\" data-vtz-link-type=\\\"Dialog\\\" data-vtz-jump=\\\"877ac916-73fb-4d08-bca0-2b634493639f\\\">Targaryen Realness</a></li><li><a href=\\\"#\\\" data-vtz-link-type=\\\"Dialog\\\" data-vtz-jump=\\\"67cae494-c337-4c3b-83af-ecff42d6031b\\\">Three Eyed Raven</a></li><li><a href=\\\"#\\\" data-vtz-link-type=\\\"Dialog\\\" data-vtz-jump=\\\"428a288a-47bc-461a-90e1-c360fb331a32\\\">Lannister Gold</a></li></ul>\"\n" +
                "            }";

        TalkAgentText text = objectMapper.readValue(json, TalkAgentText.class);

        assertNotNull(text);
    }

    @Test
    public void deserializerTest() throws Exception {
        String json = "{\n" +
                "                \"#text\": \"Please tell me the type of latte you'd like: <ul><li><a href=\\\"#\\\" data-vtz-link-type=\\\"Dialog\\\" data-vtz-jump=\\\"877ac916-73fb-4d08-bca0-2b634493639f\\\">Targaryen Realness</a></li><li><a href=\\\"#\\\" data-vtz-link-type=\\\"Dialog\\\" data-vtz-jump=\\\"67cae494-c337-4c3b-83af-ecff42d6031b\\\">Three Eyed Raven</a></li><li><a href=\\\"#\\\" data-vtz-link-type=\\\"Dialog\\\" data-vtz-jump=\\\"428a288a-47bc-461a-90e1-c360fb331a32\\\">Lannister Gold</a></li></ul>\"\n" +
                "            }";

        ObjectMapper mapper = new ObjectMapper();
        SimpleModule module =
                new SimpleModule("TalkAgentTextDeserializer", new Version(1, 0, 0, null, null, null));
        module.addDeserializer(TalkAgentText.class, new TalkAgentTextDeserializer());
        mapper.registerModule(module);

        TalkAgentText text = mapper.readValue(json, TalkAgentText.class);

        assertNotNull(text);
    }

    @Test
    public void textTest() throws Exception {
        String json = "{\n" +
                "                \"#text\": \"Please tell me the type of latte you'd like: <ul><li><a href=\\\"#\\\" data-vtz-link-type=\\\"Dialog\\\" data-vtz-jump=\\\"877ac916-73fb-4d08-bca0-2b634493639f\\\">Targaryen Realness</a></li><li><a href=\\\"#\\\" data-vtz-link-type=\\\"Dialog\\\" data-vtz-jump=\\\"67cae494-c337-4c3b-83af-ecff42d6031b\\\">Three Eyed Raven</a></li><li><a href=\\\"#\\\" data-vtz-link-type=\\\"Dialog\\\" data-vtz-jump=\\\"428a288a-47bc-461a-90e1-c360fb331a32\\\">Lannister Gold</a></li></ul>\"\n" +
                "            }";

        TalkAgentText text = TalkAgentText.buildTalkAgentText(json);

        assertNotNull(text);
    }
}