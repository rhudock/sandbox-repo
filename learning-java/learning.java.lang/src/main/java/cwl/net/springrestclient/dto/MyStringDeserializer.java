package cwl.net.springrestclient.dto;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;

import java.io.IOException;

public class MyStringDeserializer extends JsonDeserializer {
    @Override
    public Object deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException {
        JsonNode node = jsonParser.getCodec().readTree(jsonParser);
        String responseStr = node.asText();

        return new MyString((String) responseStr);

//        String name = node.get("name").textValue();
//        int birth = node.get("category").intValue();
//        String aliveStr = node.get("alive").textValue();
//        return new Person(name, birth, Objects.equals(aliveStr, "T"));
    }
}
