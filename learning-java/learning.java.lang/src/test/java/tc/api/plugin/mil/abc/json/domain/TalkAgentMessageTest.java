package tc.api.plugin.mil.abc.json.domain;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;

import static io.restassured.path.json.JsonPath.from;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

public class TalkAgentMessageTest {

    @Test
    public void getOptions() throws Exception{
        String jsonStr= "{\n" +
                "  \"TalkAgentResponse\": {\n" +
                "    \"@ResponseCode\": \"Found\",\n" +
                "    \"@Version\": \"6\",\n" +
                "    \"@TimeStamp\": \"2018-03-03T22:54:19.1086528Z\",\n" +
                "    \"TimeOut\": 300,\n" +
                "    \"@SCI\": \"@b244413d-424a-503b-b1d4-c78611066ac8@61fc4484-760e-4b10-a12a-1af789dd402a\",\n" +
                "    \"contact\": false,\n" +
                "    \"@IID\": \"e792134a-9e9a-4e72-90b0-14c551cbca72\",\n" +
                "    \"isLeafNode\": true,\n" +
                "    \"Display\": {\n" +
                "      \"OutText\": {\n" +
                "        \"#text\": \"Good afternoon!  Please ask me your questions about Fidelity Investments.\"\n" +
                "      },\n" +
                "      \"AlternateOutText\": {\n" +
                "        \"#text\": \"Good afternoon!  Please ask me your questions about Fidelity Investments.\"\n" +
                "      },\n" +
                "      \"AlternateOutText2\": {\n" +
                "        \"#text\": \"Good afternoon!  Please ask me your questions about Fidelity Investments.\"\n" +
                "      }\n" +
                "    },\n" +
                "    \"business_answer\": false\n" +
                "  }\n" +
                "}";

        assertNotNull(jsonStr);

//        TalkAgentResponse talkAgentResponse = new ObjectMapper().readValue(jsonStr, TalkAgentResponse.class);
        TalkAgentMessage talkAgentMessage = new ObjectMapper().readerFor(TalkAgentMessage.class)
                .readValue(jsonStr);

        assertNull(talkAgentMessage.getTalkAgentResponse().getOutOptions());
        assertNotNull(talkAgentMessage.getTalkAgentResponse().getDisplay());

        assertThat(from(jsonStr).getObject("TalkAgentResponse", TalkAgentResponse.class).getDisplay().getOutText().getText()
                .equals(talkAgentMessage.getTalkAgentResponse().getDisplay().getOutText().getText()));

    }

    @Test
    public void getOptionsTest() throws Exception{
        String jsonStr= "{\n" +
                "  \"TalkAgentResponse\": {\n" +
                "    \"@SCI\": \"@9eb0560a-026a-48d6-7cb7-78245b00a37b@7b34dddb-dbc9-42b7-9e62-96c8d48d8206\",\n" +
                "    \"@IID\": \"72945d46-0492-4b1b-b4af-64a3838ac618\",\n" +
                "    \"@TimeStamp\": \"2018-01-12T19:54:10.6958223Z\",\n" +
                "    \"@ResponseCode\": \"Found\",\n" +
                "    \"@Version\": \"6\",\n" +
                "    \"Display\": {\n" +
                "      \"OutText\": {\n" +
                "        \"#text\": \"Please tell me the type of latte you'd like: <ul><li><a href=\\\"#\\\" data-vtz-link-type=\\\"Dialog\\\" data-vtz-jump=\\\"877ac916-73fb-4d08-bca0-2b634493639f\\\">Targaryen Realness</a></li><li><a href=\\\"#\\\" data-vtz-link-type=\\\"Dialog\\\" data-vtz-jump=\\\"67cae494-c337-4c3b-83af-ecff42d6031b\\\">Three Eyed Raven</a></li><li><a href=\\\"#\\\" data-vtz-link-type=\\\"Dialog\\\" data-vtz-jump=\\\"428a288a-47bc-461a-90e1-c360fb331a32\\\">Lannister Gold</a></li></ul>\"\n" +
                "      },\n" +
                "      \"AlternateOutText\": {\n" +
                "        \"#text\": \"Select the search engine you'd like to use:\"\n" +
                "      },\n" +
                "      \"AlternateOutText2\": {\n" +
                "        \"#text\": \"Please tell me the type of latte you'd like: \"\n" +
                "      }\n" +
                "    },\n" +
                "    \"OutOptions\": {\n" +
                "      \"options\": [\n" +
                "        \"Yahoo\",\n" +
                "        \"Google\"\n" +
                "      ]\n" +
                "    }\n" +
                "  }\n" +
                "}";

        assertNotNull(jsonStr);

        TalkAgentMessage talkAgentMessage = new ObjectMapper().readerFor(TalkAgentMessage.class)
                .readValue(jsonStr);

        assertNotNull(talkAgentMessage.getTalkAgentResponse().getOutOptions());

        assertNotNull(talkAgentMessage.getTalkAgentResponse().getDisplay());

        assertThat(from(jsonStr).getObject("TalkAgentResponse", TalkAgentResponse.class).getDisplay().getOutText().getText())
                .isEqualTo(talkAgentMessage.getTalkAgentResponse().getDisplay().getOutText().getText());

        assertThat(from(jsonStr).getObject("TalkAgentResponse", TalkAgentResponse.class).getOutOptions().getOptions().size())
                .isEqualTo(talkAgentMessage.getTalkAgentResponse().getOutOptions().getOptions().size());
    }

}