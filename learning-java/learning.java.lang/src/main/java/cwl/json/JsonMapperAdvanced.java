package cwl.json;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.Version;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import cwl.json.custom.CustomCarDeserializer;
import cwl.json.custom.CustomCarSerializer;
import cwl.json.model.Car;
import cwl.json.model.Request;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * http://www.baeldung.com/jackson-object-mapper-tutorial
 */
public class JsonMapperAdvanced {

    private static final String FILE_PATH = "/Users/dlee/code/sandbox-repo/learning-java/learning.java.lang/src/main/java/cwl/json/files/car.json";
    private static final String JSON_STRING = "{ \"color\" : \"Black\", \"type\" : \"Fiat\", \"year\" : \"1970\" }";


    public static void main(String[] args) {
        JsonMapperAdvanced jsonMapperjsonMapperAdvanced = new JsonMapperAdvanced();
        jsonMapperjsonMapperAdvanced.failOnUnknownProperties();
        jsonMapperjsonMapperAdvanced.customSerializer();
        jsonMapperjsonMapperAdvanced.customDeserializer();
        jsonMapperjsonMapperAdvanced.handlingDataformat();
        jsonMapperjsonMapperAdvanced.handlingArrays();
        jsonMapperjsonMapperAdvanced.handlingList();
//        jsonMapperjsonMapperAdvanced.createPojoListFromJSONArrayString();
//        jsonMapperjsonMapperAdvanced.createPojoMapFromJSONString();
    }

    /**
     * The JSON string in the above example in the default parsing process to the Java object for the Class Car will result in the UnrecognizedPropertyException exception.

     Through the configure method we can extend the default process to ignore the new fields:
     */
    public void failOnUnknownProperties() {
        ObjectMapper objectMapper = new ObjectMapper();

        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        try {
            Car car = objectMapper.readValue(JSON_STRING, Car.class);
            System.out.printf("car: %s\n", car.toString());
        } catch (IOException e) {
            e.printStackTrace();
        }

        JsonNode jsonNodeRoot = null;
        try {
            jsonNodeRoot = objectMapper.readTree(JSON_STRING);
            System.out.printf("jsonNodeRoot: %s\n", jsonNodeRoot.toString());
        } catch (IOException e) {
            e.printStackTrace();
        }
        JsonNode jsonNodeYear = jsonNodeRoot.get("year");
        String year = jsonNodeYear.asText();


        // Yet another option is based on the FAIL_ON_NULL_FOR_PRIMITIVES which defines if the null values for primitive values are allowed:
        objectMapper.configure(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES, false);

        // Similarly, FAIL_ON_NUMBERS_FOR_ENUM controls if enum values are allowed to be serialized/deserialized as numbers
        objectMapper.configure(DeserializationFeature.FAIL_ON_NUMBERS_FOR_ENUMS, false);

    }


    public void customSerializer() {
        ObjectMapper mapper = new ObjectMapper();
        SimpleModule module =
                new SimpleModule("CustomCarSerializer", new Version(1, 0, 0, null, null, null));
        module.addSerializer(Car.class, new CustomCarSerializer());
        mapper.registerModule(module);

        Car car = new Car("yellow", "renault");
        try {
            String carJson = mapper.writeValueAsString(car);
            System.out.printf("carJson: %s\n", carJson);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }


    public void customDeserializer() {
        String json = "{ \"color\" : \"Black\", \"type\" : \"BMW\" }";
        ObjectMapper mapper = new ObjectMapper();
        SimpleModule module =
                new SimpleModule("CustomCarDeserializer", new Version(1, 0, 0, null, null, null));
        module.addDeserializer(Car.class, new CustomCarDeserializer());
        mapper.registerModule(module);

        try {
            Car car = mapper.readValue(json, Car.class);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 3.4. Creating Java List from JSON Array String
     */
    public void handlingDataformat() {
        Car car = new Car("Yello", "Honda");
        Request request = new Request(car, new Date());
        ObjectMapper objectMapper = new ObjectMapper();
        DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm a z");
        objectMapper.setDateFormat(df);
        try {
            String carAsString = objectMapper.writeValueAsString(request);
            System.out.printf("carJson: %s\n", carAsString);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
// output: {"car":{"color":"yellow","type":"renault"},"datePurchased":"2016-07-03 11:43 AM CEST"}

    }

    /**
     * 3.5. Creating Java Map from JSON String

     */
    public void handlingArrays() {
        String jsonCarArray =
                "[{ \"color\" : \"Black\", \"type\" : \"BMW\" }, { \"color\" : \"Red\", \"type\" : \"FIAT\" }]";
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.USE_JAVA_ARRAY_FOR_JSON_ARRAY, true);
        try {
            Car[] cars = objectMapper.readValue(jsonCarArray, Car[].class);
        } catch (IOException e) {
            e.printStackTrace();
        }
// print cars

    }
    public void handlingList() {
        String jsonCarArray =
                "[{ \"color\" : \"Black\", \"type\" : \"BMW\" }, { \"color\" : \"Red\", \"type\" : \"FIAT\" }]";
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            List<Car> listCar = objectMapper.readValue(jsonCarArray, new TypeReference<List<Car>>(){});
        } catch (IOException e) {
            e.printStackTrace();
        }
// print cars

    }


}
