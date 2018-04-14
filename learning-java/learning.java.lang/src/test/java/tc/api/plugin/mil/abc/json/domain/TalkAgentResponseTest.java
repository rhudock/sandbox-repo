package tc.api.plugin.mil.abc.json.domain;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;

import static io.restassured.path.json.JsonPath.from;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertNotNull;

public class TalkAgentResponseTest {

    @Test
    public void getOptions() throws Exception{
        String jsonStr= "{\n" +
                "        \"@SCI\": \"@9eb0560a-026a-48d6-7cb7-78245b00a37b@7b34dddb-dbc9-42b7-9e62-96c8d48d8206\",\n" +
                "        \"@IID\": \"72945d46-0492-4b1b-b4af-64a3838ac618\",\n" +
                "        \"@TimeStamp\": \"2018-01-12T19:54:10.6958223Z\",\n" +
                "        \"@ResponseCode\": \"Found\",\n" +
                "        \"@Version\": \"6\",\n" +
                "        \"Display\": {\n" +
                "            \"OutText\": {\n" +
                "                \"#text\": \"Please tell me the type of latte you'd like: <ul><li><a href=\\\"#\\\" data-vtz-link-type=\\\"Dialog\\\" data-vtz-jump=\\\"877ac916-73fb-4d08-bca0-2b634493639f\\\">Targaryen Realness</a></li><li><a href=\\\"#\\\" data-vtz-link-type=\\\"Dialog\\\" data-vtz-jump=\\\"67cae494-c337-4c3b-83af-ecff42d6031b\\\">Three Eyed Raven</a></li><li><a href=\\\"#\\\" data-vtz-link-type=\\\"Dialog\\\" data-vtz-jump=\\\"428a288a-47bc-461a-90e1-c360fb331a32\\\">Lannister Gold</a></li></ul>\"\n" +
                "            },\n" +
                "            \"AlternateOutText\": {\n" +
                "                \"#text\": \"Select the search engine you'd like to use:\"\n" +
                "            },\n" +
                "            \"AlternateOutText2\": {\n" +
                "                \"#text\": \"Please tell me the type of latte you'd like: \"\n" +
                "            }\n" +
                "        },\n" +
                "        \"OutOptions\": {\n" +
                "            \"options\": [\n" +
                "                \"Yahoo\",\n" +
                "                \"Google\"\n" +
                "            ]\n" +
                "        }," +
                "        \"MyOtherInfo\": \"Found\"\n" +
                "}";

        assertNotNull(jsonStr);

//        TalkAgentResponse talkAgentResponse = new ObjectMapper().readValue(jsonStr, TalkAgentResponse.class);
        TalkAgentResponse talkAgentResponse = new ObjectMapper().readerFor(TalkAgentResponse.class)
                .readValue(jsonStr);

        assertThat(from(jsonStr).getString("@SCI").compareTo(talkAgentResponse.getSci()));

    }
}