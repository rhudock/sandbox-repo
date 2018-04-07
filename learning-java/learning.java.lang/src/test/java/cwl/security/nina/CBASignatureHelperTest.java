package cwl.security.nina;

import tc.util.StringUtils;
import org.bouncycastle.util.encoders.Base64;
import org.json.JSONObject;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.security.Signature;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class CBASignatureHelperTest {
    private static final Logger logger = LoggerFactory.getLogger(CBASignatureHelperTest.class);
    private static final String plainText = "{\"TalkAgentRequest\":{\"@SCI\":\"\",\"@IID\":\"userIdentifier\",\"@TimeStamp\":\"2017-11-01T14:48:26.942763+10:00\",\"UserText\":\"userText\",\"NleResults\":true,\"NinaVars\":{\"assetType\":\"assetType\",\"invocationpoint\":\"invocationPoint\"}}}";
    private static final String plainTextMod = "{\"TalkAgentRequest\":{\"@SCI\":\" \",\"@IID\":\"userIdentifier\",\"@TimeStamp\":\"2017-11-01T14:48:26.942763+10:00\",\"UserText\":\"userText\",\"NleResults\":true,\"NinaVars\":{\"assetType\":\"assetType\",\"invocationpoint\":\"invocationPoint\"}}}";

    @Test
    public void getSignatureStrAndgetEncryptedTest() throws Exception {

        assertEquals(new String(CBASignatureHelper.getEncrypted(plainText, null)), new String(CBASignatureHelper.getSignature(plainText, null)));
    }

    @Test
    public void verifySigTestSuccess() throws Exception {
        byte[] signitureStr = CBASignatureHelper.getSignature(plainText, null);
        logger.debug("signatureStr : {}", StringUtils.byteArrayToString(signitureStr));
        logger.debug("signatureStr : {}", StringUtils.byteArrayToString(Base64.encode(signitureStr)));

        Signature sig = Signature.getInstance("SHA256withRSA");
        sig.initVerify(CBASignatureHelper.getPublicKey(null));
        sig.update(plainText.getBytes());

        assertTrue(sig.verify(Base64.decode(signitureStr)));
    }

    @Test
    public void verifyString() throws Exception {

        String plainText2 = "{ \"TalkAgentRequest\": {\n" +
                "        \"@SCI\": \"\",\n" +
                "        \"@IID\": \"\",\n" +
                "        \"@TimeStamp\": \"2017-09-07T14:55:27.799+11:00\",\n" +
                "        \"UserText\": \"hello\",\n" +
                "        \"origin\": \"\",\n" +
                "        \"NinaVars\": {\n" +
                "               \"assetType\": \"netbank\"\n" +
                "        }\n" +
                "    }\n" +
                "}";

        byte[] signitureStr = CBASignatureHelper.getSignature(plainText2, null);
        logger.debug("signatureStr : {}", StringUtils.byteArrayToString(signitureStr));
        logger.debug("signatureStr : {}", StringUtils.byteArrayToString(Base64.encode(signitureStr)));

        Signature sig = Signature.getInstance("SHA256withRSA");
        sig.initVerify(CBASignatureHelper.getPublicKey(null));
        sig.update(plainText2.getBytes());

        assertTrue(sig.verify(Base64.decode(signitureStr)));
    }

    @Test
    public void jsonObjectValidationTest() throws Exception {

        String jsonStr = "{\n" +
                "    \"TalkAgentRequest\": {\n" +
                "        \"@SCI\": \"\",\n" +
                "        \"@IID\": \"\",\n" +
                "        \"@TimeStamp\": \"2017-09-07T14:55:27.799+11:00\",\n" +
                "        \"UserText\": \"hello\",\n" +
                "        \"origin\": \"\",\n" +
                "        \"NinaVars\": {\n" +
                "               \"assetType\": \"netbank\",\n" +
                "            \"secret\": \"7b3cefbb35611294e417769cd7a49508c8ca5f885f3c608b3bbed3a013256550\"\n" +
                "        }\n" +
                "    }\n" +
                "}";

        JSONObject jsonTalkAgentRequest = new JSONObject(jsonStr);
        String secretStr = jsonTalkAgentRequest.getJSONObject("TalkAgentRequest").getJSONObject("NinaVars").getString("secret");
        jsonTalkAgentRequest.getJSONObject("TalkAgentRequest").getJSONObject("NinaVars").remove("secret");

        String talkAgentRequestStr = jsonTalkAgentRequest.toString();
        logger.debug("talkAgentRequestStr : {}", talkAgentRequestStr);

        byte[] signitureStr = CBASignatureHelper.getSignature(talkAgentRequestStr, null);
        logger.debug("secretStr : {}", secretStr);
        logger.debug("signatureStr : {}", StringUtils.byteArrayToString(signitureStr));
        logger.debug("signatureStr : {}", StringUtils.byteArrayToString(Base64.encode(signitureStr)));

        Signature sig = Signature.getInstance("SHA256withRSA");
        sig.initVerify(CBASignatureHelper.getPublicKey(null));
        sig.update(talkAgentRequestStr.getBytes());

        assertTrue(sig.verify(Base64.decode(signitureStr)));
    }

    @Test
    public void jsonStringValidationTest() throws Exception {

        String jsonStr = "{\n" +
                "    \"TalkAgentRequest\": {\n" +
                "        \"@SCI\": \"\",\n" +
                "        \"@IID\": \"\",\n" +
                "        \"@TimeStamp\": \"2017-09-07T14:55:27.799+11:00\",\n" +
                "        \"UserText\": \"hello\",\n" +
                "        \"origin\": \"\",\n" +
                "        \"NinaVars\": {\n" +
                "               \"assetType\": \"netbank\",\n" +
                "            \"secret\": \"7b3cefbb35611294e417769cd7a49508c8ca5f885f3c608b3bbed3a013256550\"\n" +
                "        }\n" +
                "    }\n" +
                "}";

        JSONObject jsonTalkAgentRequest = new JSONObject(jsonStr);
        String secretStr = jsonTalkAgentRequest.getJSONObject("TalkAgentRequest").getJSONObject("NinaVars").getString("secret");
        jsonTalkAgentRequest.getJSONObject("TalkAgentRequest").getJSONObject("NinaVars").remove("secret");

        String talkAgentRequestStr = jsonTalkAgentRequest.toString();
        logger.debug("talkAgentRequestStr : {}", talkAgentRequestStr);

        byte[] signitureStr = CBASignatureHelper.getSignature(talkAgentRequestStr, null);
        logger.debug("secretStr : {}", secretStr);
        logger.debug("signatureStr : {}", StringUtils.byteArrayToString(signitureStr));
        logger.debug("signatureStr : {}", StringUtils.byteArrayToString(Base64.encode(signitureStr)));

        Signature sig = Signature.getInstance("SHA256withRSA");
        sig.initVerify(CBASignatureHelper.getPublicKey(null));
        sig.update(talkAgentRequestStr.getBytes());

        assertTrue(sig.verify(Base64.decode(signitureStr)));
    }

    @Test
    public void verifySigTestFail() throws Exception {
        byte[] signitureStr = CBASignatureHelper.getSignature(plainText, null);
        logger.debug("signatureStr : {}", signitureStr);

        Signature sig = Signature.getInstance("SHA256withRSA");
        sig.initVerify(CBASignatureHelper.getPublicKey(null));
        sig.update(plainTextMod.getBytes());

        assertTrue(!sig.verify(Base64.decode(signitureStr)));
    }
}