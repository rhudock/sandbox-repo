package tc.api.plugin.mil.abc.json.serializer;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.ObjectCodec;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import tc.api.plugin.mil.abc.json.domain.TalkAgentText;

import java.io.IOException;

public class TalkAgentTextDeserializer extends StdDeserializer<TalkAgentText> {

    public TalkAgentTextDeserializer() {
        this(null);
    }

    public TalkAgentTextDeserializer(Class<?> vc) {
        super(vc);
    }

    @Override
    public TalkAgentText deserialize(JsonParser parser, DeserializationContext deserializer) {
        TalkAgentText talkAgentText = new TalkAgentText();
        ObjectCodec codec = parser.getCodec();
        JsonNode node = null;
        try {
            node = codec.readTree(parser);
        } catch (IOException e) {
            e.printStackTrace();
        }

        // try catch block
        JsonNode textNode = node.get("#text");
        String color = textNode.asText();
        talkAgentText.setText(color);
        return talkAgentText;
    }
}
