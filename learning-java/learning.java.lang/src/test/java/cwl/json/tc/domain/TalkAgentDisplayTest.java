package cwl.json.tc.domain;

import com.fasterxml.jackson.core.Version;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import cwl.json.tc.serializer.TalkAgentTextDeserializer;
import org.json.JSONObject;
import org.junit.Test;

import static io.restassured.path.json.JsonPath.from;
import static org.junit.Assert.assertNotNull;
import static org.assertj.core.api.Assertions.assertThat;

public class TalkAgentDisplayTest {

    @Test
    public void jsonObjTest() throws Exception {
        String json = "{\n" +
                "            \"OutText\": {\n" +
                "                \"text\": \"Please tell me the type of latte you'd like: <ul><li><a href=\\\"#\\\" data-vtz-link-type=\\\"Dialog\\\" data-vtz-jump=\\\"877ac916-73fb-4d08-bca0-2b634493639f\\\">Targaryen Realness</a></li><li><a href=\\\"#\\\" data-vtz-link-type=\\\"Dialog\\\" data-vtz-jump=\\\"67cae494-c337-4c3b-83af-ecff42d6031b\\\">Three Eyed Raven</a></li><li><a href=\\\"#\\\" data-vtz-link-type=\\\"Dialog\\\" data-vtz-jump=\\\"428a288a-47bc-461a-90e1-c360fb331a32\\\">Lannister Gold</a></li></ul>\"\n" +
                "            },\n" +
                "            \"AlternateOutText\": {\n" +
                "                \"text\": \"Select the search engine you'd like to use:\"\n" +
                "            },\n" +
                "            \"AlternateOutText2\": {\n" +
                "                \"text\": \"Please tell me the type of latte you'd like: \"\n" +
                "            }\n" +
                "        }";

        JSONObject jsonObject = new JSONObject(json);

        assertNotNull(jsonObject);
    }

    @Test
    public void jsonTest() throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();

        String json = "{\n" +
                "            \"OutText\": {\n" +
                "                \"#text\": \"Please tell me the type of latte you'd like: <ul><li><a href=\\\"#\\\" data-vtz-link-type=\\\"Dialog\\\" data-vtz-jump=\\\"877ac916-73fb-4d08-bca0-2b634493639f\\\">Targaryen Realness</a></li><li><a href=\\\"#\\\" data-vtz-link-type=\\\"Dialog\\\" data-vtz-jump=\\\"67cae494-c337-4c3b-83af-ecff42d6031b\\\">Three Eyed Raven</a></li><li><a href=\\\"#\\\" data-vtz-link-type=\\\"Dialog\\\" data-vtz-jump=\\\"428a288a-47bc-461a-90e1-c360fb331a32\\\">Lannister Gold</a></li></ul>\"\n" +
                "            },\n" +
                "            \"AlternateOutText\": {\n" +
                "                \"#text\": \"Select the search engine you'd like to use:\"\n" +
                "            },\n" +
                "            \"AlternateOutText2\": {\n" +
                "                \"#text\": \"Please tell me the type of latte you'd like: \"\n" +
                "            }\n" +
                "        }";

        JsonNode jsonNode = objectMapper.readTree(json);
        assertNotNull(jsonNode);

        TalkAgentDisplay talkAgentDisplay = new TalkAgentDisplay();
        JsonNode jsonNodeAlternateOutText = jsonNode.get("AlternateOutText");
        String jsonNodeAlternateOutTextStr = objectMapper.writeValueAsString(jsonNodeAlternateOutText);
        TalkAgentText talkAgentText = TalkAgentText.buildTalkAgentText(jsonNodeAlternateOutTextStr);

        talkAgentDisplay.setAlternateOutText( talkAgentText );

        talkAgentDisplay.setOutText( TalkAgentText.buildTalkAgentText(objectMapper.writeValueAsString(jsonNode.get("OutText"))) );

        talkAgentDisplay.setAlternateOutText2( TalkAgentText.buildTalkAgentText(objectMapper.writeValueAsString(jsonNode.get("AlternateOutText2"))) );

        // act
        String result = new ObjectMapper().writeValueAsString(talkAgentDisplay);

        // assert
        assertThat(from(result).getObject("OutText", TalkAgentText.class)).isNotNull();

    }

    @Test
    public void textTest() throws Exception {
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
}