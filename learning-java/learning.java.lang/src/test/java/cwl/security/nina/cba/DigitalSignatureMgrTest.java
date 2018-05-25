package cwl.security.nina.cba;

import org.json.JSONObject;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class DigitalSignatureMgrTest {

    private DigitalSignatureMgr digitalSignatureMgr;

    @Before
    public void setup() throws Exception {
        List<String> publicKeyList = Arrays.asList("Certificates/CBA/Public/public1.crt",
                "Certificates/CBA/Public/public2.crt");
        String privateKeyStr = "Certificates/Nuance/Private/private_key.pem";

        digitalSignatureMgr = new DigitalSignatureMgr(publicKeyList, privateKeyStr);
    }

    @After
    public void cleanup() throws Exception {
        digitalSignatureMgr = null;
    }

    @Test
    public void createSignatureAndValidatePayloadTest00() throws Exception {
        String requestPayloadStr = "{\"TalkAgentRequest\":{\"@SCI\":\"\",\"@IID\":\"\",\"@TimeStamp\":\"2017-12-13T14:55:27.799+11:00\",\"UserText\":\"Hello\",\"origin\":\"\",\"NinaVars\":{\"assetType\":\"netbank\",\"secret\":\"7b3cefbb35611294e417769cd7a49508c8ca5f885f3c608b3bbed3a013256550\"}}}";

        // Create signature.
        String signature = digitalSignatureMgr.createSignature(requestPayloadStr);

        // Validate Payload with created signature.
        assertTrue(digitalSignatureMgr.validatePayload(requestPayloadStr, signature));

        // Modify payload and do Failure test.
        requestPayloadStr += " ";
        assertFalse(digitalSignatureMgr.validatePayload(requestPayloadStr, signature));
    }
    @Test
    public void jsonStringConvertTest() throws Exception {
        String responseStr = "{\n" +
                "    \"TalkAgentResponse\": {\n" +
                "        \"@SCI\": \"@7835dd7d-8f49-a1b9-f34a-fb37b116ad11@b82d8624-cf81-4b2b-a202-478241eafc26\",\n" +
                "        \"@IID\": \"cf1206e2-5046-4f12-a46f-bcb83ed77935\",\n" +
                "        \"@TimeStamp\": \"2018-02-08T02:09:23.5354045Z\",\n" +
                "        \"@ResponseCode\": \"Found\",\n" +
                "        \"@Version\": \"6\",\n" +
                "        \"Display\": {\n" +
                "            \"OutText\": {\n" +
                "                \"#text\": \"<div>\\n  OK. Would you like to accept a contract, check on your application or finish\\n  an application?\\n</div>\\n <ul><li><a href=\\\"#\\\" data-vtz-link-type=\\\"Dialog\\\" data-vtz-jump=\\\"d24e0b62-f62b-42b0-9941-c82d8796eca5\\\">Accept contract</a></li><li><a href=\\\"#\\\" data-vtz-link-type=\\\"Dialog\\\" data-vtz-jump=\\\"1371f457-51fc-42a4-ba8b-beda1c5364bb\\\">Check application</a></li><li><a href=\\\"#\\\" data-vtz-link-type=\\\"Dialog\\\" data-vtz-jump=\\\"f92deb2d-8099-4c5c-bfa8-a2a148065906\\\">Finish application</a></li></ul>\"\n" +
                "            },\n" +
                "            \"AlternateOutText\": {\n" +
                "                \"#text\": \"<div>\\n  OK. Would you like to accept a contract, check on your application or finish\\n  an application?\\n</div>\\n \"\n" +
                "            }\n" +
                "        },\n" +
                "        \"OutOptions\": {\n" +
                "            \"options\": [\n" +
                "                \"Accept contract\",\n" +
                "                \"Check application\",\n" +
                "                \"Finish application\"\n" +
                "            ]\n" +
                "        },\n" +
                "        \"TimeOut\": 300,\n" +
                "        \"token\": \"\",\n" +
                "        \"backendDipLatency\": [],\n" +
                "        \"output\": {},\n" +
                "        \"activeIntent\": \"4862044829937454970\",\n" +
                "        \"activeIntentName\": \"APPLICATION_ENQUIRY\",\n" +
                "        \"nleResults\": [\n" +
                "            {\n" +
                "                \"confidence\": 100,\n" +
                "                \"concepts\": [\n" +
                "                    {\n" +
                "                        \"name\": \"Intent\",\n" +
                "                        \"value\": \"4862044829937454970\",\n" +
                "                        \"friendlyName\": \"APPLICATION_ENQUIRY\",\n" +
                "                        \"literal\": \"application enquiry\"\n" +
                "                    }\n" +
                "                ]\n" +
                "            },\n" +
                "            {\n" +
                "                \"confidence\": 100,\n" +
                "                \"concepts\": [\n" +
                "                    {\n" +
                "                        \"name\": \"Intent\",\n" +
                "                        \"value\": \"4862044829937454970\",\n" +
                "                        \"friendlyName\": \"APPLICATION_ENQUIRY\",\n" +
                "                        \"literal\": \"application enquiry\"\n" +
                "                    }\n" +
                "                ]\n" +
                "            },\n" +
                "            {\n" +
                "                \"confidence\": 0,\n" +
                "                \"concepts\": [\n" +
                "                    {\n" +
                "                        \"name\": \"Intent\",\n" +
                "                        \"value\": \"4862044404735692666\",\n" +
                "                        \"friendlyName\": \"BANK_CURRENT_EVENTS\",\n" +
                "                        \"literal\": \"application enquiry\"\n" +
                "                    }\n" +
                "                ]\n" +
                "            }\n" +
                "        ]\n" +
                "    }\n" +
                "} ";

        JSONObject jsonObject = new JSONObject(responseStr);
        String actual = jsonObject.getJSONObject("TalkAgentResponse").getJSONObject("Display").getJSONObject("OutText").getString("#text");

        assertTrue(actual.startsWith("<div>"));
    }

    @Test
    public void createSignatureAndValidatePayloadTest01() throws Exception {
        String requestPayloadStr = "{\n" +
                "\"TalkAgentRequest\": {\n" +
                "\"@xmlns\": \"http://www.virtuoz.com\",\n" +
                "\"@SCI\": \"\",\n" +
                "\"@IID\": \"\",\n" +
                "\"@TimeStamp\": \"2014-10-23T22:46:42.996-04:00\",\n" +
                "\"UserText\": \"hi\",\n" +
                "\"Debug\": {},\n" +
                "\"uiID\": 1929446423053.0916,\n" +
                "\"ClientMetaData\": {\n" +
                "\"chatReferrer\": \"\",\n" +
                "\"userAgent\": \"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_0) AppleWebKit/537.36(KHTML, like Gecko) Chrome/38.0.2125.104 Safari/537.36\"},\n" +
                "\"VisitorIsTyping\": true,\n" +
                "\"NinaVars\": {\"preprod\": true,\"ninachat\": true}\n" +
                "}\n" +
                "}";

        String signature = digitalSignatureMgr.createSignature(requestPayloadStr);

        assertTrue(digitalSignatureMgr.validatePayload(requestPayloadStr, signature));
    }

    /*
     * Response Payload test
     */
    @Test
    public void createSignatureAndValidateResponsePayloadTest() throws Exception {
        String requestPayloadStr = "{\"TalkAgentRequest\":{\"@SCI\":\"\",\"@IID\":\"\",\"@TimeStamp\":\"2018-01-31T14:55:27.799+11:00\",\"UserText\":\"Hi & bye\",\"origin\":\"\",\"NinaVars\":{\"secret\":\"7b3cefbb35611294e417769cd7a49508c8ca5f885f3c608b3bbed3a013256550\",\"assetType\":\"netbank\"}}}";

        String signature = digitalSignatureMgr.createSignature(requestPayloadStr);

        assertTrue(digitalSignatureMgr.validatePayload(requestPayloadStr, signature));

        // Modify payload and do Failure test.
        requestPayloadStr += " ";
        assertFalse(digitalSignatureMgr.validatePayload(requestPayloadStr, signature));
    }
}