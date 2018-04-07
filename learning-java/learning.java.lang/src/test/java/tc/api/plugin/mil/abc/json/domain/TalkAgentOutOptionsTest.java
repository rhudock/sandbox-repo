package tc.api.plugin.mil.abc.json.domain;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;

import static io.restassured.path.json.JsonPath.from;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertNotNull;

public class TalkAgentOutOptionsTest {

    @Test
    public void getOptions() throws Exception{
        String jsonStr= "{\n" +
                "            \"options\": [\n" +
                "                \"Yahoo\",\n" +
                "                \"Google\"\n" +
                "            ]\n" +
                "        }";

        TalkAgentOutOptions text = new ObjectMapper().readValue(jsonStr, TalkAgentOutOptions.class);

        assertThat(from(jsonStr).getList("options")
                .size()).isEqualTo(text.getOptions()
                .size());

        assertNotNull(text);
    }
}