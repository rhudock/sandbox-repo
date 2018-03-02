package cwl.json;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import cwl.json.model.Car;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.List;
import java.util.Map;

/**
 * http://www.baeldung.com/jackson-object-mapper-tutorial
 */
public class JsonMapperBasic {

    private static final String FILE_PATH = "/Users/dlee/code/sandbox-repo/learning-java/learning.java.lang/src/main/java/cwl/json/files/car.json";

    public static void main(String[] args) {
        JsonMapperBasic jsonMapperBasic = new JsonMapperBasic();
        jsonMapperBasic.pojoToJson();
        jsonMapperBasic.jsonToPojo();
        jsonMapperBasic.jsonToJacksonJsonNode();
        jsonMapperBasic.createPojoListFromJSONArrayString();
        jsonMapperBasic.createPojoMapFromJSONString();
    }


    /**
     * 3.1. Java Object to JSON
     */
    public void pojoToJson() {
        ObjectMapper objectMapper = new ObjectMapper();
        Car car = new Car("yellow", "renault");

        // objectMapper.writeValue()
        try {
            objectMapper.writeValue(new File(FILE_PATH), car);
        } catch (IOException e) {
            e.printStackTrace();
        }

        // objectMapper.writeValueAsString()
        try {
            String carAsString = objectMapper.writeValueAsString(car);
            System.out.println(carAsString);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    /**
     * JSON to Java Object
     */
    public void jsonToPojo() {
        ObjectMapper objectMapper = new ObjectMapper();

        String json = "{ \"color\" : \"Black\", \"type\" : \"BMW\" }";
        Car car = null;
        try {
            car = objectMapper.readValue(json, Car.class);
        } catch (IOException e) {
            e.printStackTrace();
        }

        // objectMapper.writeValue()
        try {
            car = objectMapper.readValue(new File(FILE_PATH), Car.class);
        } catch (IOException e) {
            e.printStackTrace();
        }

        try {
            car = objectMapper.readValue(new URL(FILE_PATH), Car.class);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * JSON to Jackson JsonNode
     */
    public void jsonToJacksonJsonNode() {
        ObjectMapper objectMapper = new ObjectMapper();

        String json = "{ \"color\" : \"Black\", \"type\" : \"FIAT\" }";
        JsonNode jsonNode = null;
        try {
            jsonNode = objectMapper.readTree(json);
        } catch (IOException e) {
            e.printStackTrace();
        }
        String color = jsonNode.get("color").asText();
        // Output: color -> Black
    }

    /**
     * 3.4. Creating Java List from JSON Array String
     */
    public void createPojoListFromJSONArrayString() {
        ObjectMapper objectMapper = new ObjectMapper();

        String jsonCarArray =
                "[{ \"color\" : \"Black\", \"type\" : \"BMW\" }, { \"color\" : \"Red\", \"type\" : \"FIAT\" }]";
        try {
            List<Car> listCar = objectMapper.readValue(jsonCarArray, new TypeReference<List<Car>>(){});
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 3.5. Creating Java Map from JSON String

     */
    public void createPojoMapFromJSONString() {
        ObjectMapper objectMapper = new ObjectMapper();

        String json = "{ \"color\" : \"Black\", \"type\" : \"BMW\" }";
        try {
            Map<String, Object> map = objectMapper.readValue(json, new TypeReference<Map<String,Object>>(){});
            for(String key: map.keySet()) {
                System.out.printf("key %s, value %s\n", key, map.get(key).toString());
                /*
key color, value Black
key type, value BMW
                 */
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

    }


}
