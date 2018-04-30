package cwl.collection;

import com.google.common.collect.ImmutableMap;
import org.apache.commons.lang3.ArrayUtils;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CollectionSnippets {

    private void snippets() {

        List<String> keywords = Arrays.asList("Apple", "Ananas", "Mango", "Banana", "Beer");

//        Set<String> FILTERED_REQ_ATTRS_SET =  Collections.unmodifiableSet(new HashSet<String>(Arrays.asList(ISAMLHandler.AGENT_ID)));
//
//        Sets.intersection(FILTERED_REQ_ATTRS_SET, Collections.list(request.getAttributeNames()).stream().collect(Collectors.toSet())).stream()
//                .forEach(requestAttributeName ->  request.setAttribute(requestAttributeName, convertPublicUserIdToRealId((String)request.getAttribute(requestAttributeName))));


        // Map sample from https://stackoverflow.com/questions/6802483/how-to-directly-initialize-a-hashmap-in-a-literal-way

        // Creates a new class - http://www.c2.com/cgi/wiki?DoubleBraceInitialization
        HashMap<String, String> h = new HashMap<String, String>() {{
            put("a", "b");
        }};

        Map<String, Integer> leftMap = ImmutableMap.of("a", 1, "b", 2, "c", 3);

        // https://commons.apache.org/proper/commons-lang/apidocs/org/apache/commons/lang3/ArrayUtils.html#toMap-java.lang.Object:A-
        // Create a Map mapping colors.
        Map colorMap = ArrayUtils.toMap(new String[][]{
                {"RED", "#FF0000"},
                {"GREEN", "#00FF00"},
                {"BLUE", "#0000FF"}});
    }
}
