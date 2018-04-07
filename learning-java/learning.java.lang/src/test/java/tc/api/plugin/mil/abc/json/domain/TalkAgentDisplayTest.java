package tc.api.plugin.mil.abc.json.domain;

import com.fasterxml.jackson.core.Version;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.json.JSONObject;
import org.junit.Test;
import tc.api.plugin.mil.abc.json.serializer.TalkAgentTextDeserializer;

import static io.restassured.path.json.JsonPath.from;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertNotNull;

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
    public void jsonStrTest() throws Exception {
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

        assertThat(from(json).getObject("OutText", TalkAgentText.class).getText().contains("Please"));


        TalkAgentDisplay author = new ObjectMapper().readerFor(TalkAgentDisplay.class).readValue(json);


        assertNotNull(author);


        assertThat(author.getOutText().getText().contains("Please"));
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
        TalkAgentText talkAgentText = TalkAgentText.buildTalkAgentTextWithDeserializer(jsonNodeAlternateOutTextStr);

        talkAgentDisplay.setAlternateOutText(talkAgentText);

        talkAgentDisplay.setOutText(TalkAgentText.buildTalkAgentTextWithDeserializer(objectMapper.writeValueAsString(jsonNode.get("OutText"))));

        talkAgentDisplay.setAlternateOutText2(TalkAgentText.buildTalkAgentTextWithDeserializer(objectMapper.writeValueAsString(jsonNode.get("AlternateOutText2"))));

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