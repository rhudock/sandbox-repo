package cwl.security.nina;

import com.google.common.io.Resources;
import cwl.data.CustomerDataReader;
import cwl.security.rsa.RsaUtil;
import org.bouncycastle.util.encoders.Base64;
import org.json.JSONObject;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import tc.util.StringUtils;

import javax.crypto.Cipher;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.math.BigInteger;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.PublicKey;
import java.security.Signature;
import java.util.Arrays;

import static cwl.security.nina.CBASignature2Helper.getPublicKey;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

public class CBASignature2HelperTest {
    private static final Logger logger = LoggerFactory.getLogger(CBASignature2HelperTest.class);
    private static final String plainText = "{\"TalkAgentRequest\":{\"@SCI\":\"\",\"@IID\":\"userIdentifier\",\"@TimeStamp\":\"2017-11-01T14:48:26.942763+10:00\",\"UserText\":\"userText\",\"NleResults\":true,\"NinaVars\":{\"assetType\":\"assetType\",\"invocationpoint\":\"invocationPoint\"}}}";
    private static final String plainTextMod = "{\"TalkAgentRequest\":{\"@SCI\":\" \",\"@IID\":\"userIdentifier\",\"@TimeStamp\":\"2017-11-01T14:48:26.942763+10:00\",\"UserText\":\"userText\",\"NleResults\":true,\"NinaVars\":{\"assetType\":\"assetType\",\"invocationpoint\":\"invocationPoint\"}}}";


    @Test
    public void testWFSAMLResponse() throws Exception {

        String filePath = "Certificates/Nuance_WF/SAMLreturn.txt";
        String publicKeyPath = "Certificates/Nuance_WF/Public/public.crt";
        PublicKey publicKey = getPublicKey(publicKeyPath);
        assertNotNull(publicKey);

        URL url = Resources.getResource(filePath);

//        byte[] bFile = Files.readAllBytes(new File(filePath).toPath());
        //or this
        byte[] bFile = Files.readAllBytes(Paths.get("D:\\code\\sandbox\\learning-java\\learning.java.lang\\src\\main\\resources\\Certificates\\Nuance_WF\\SAMLreturn.txt"));
        String encrypteStr = CustomerDataReader.readResourceAsString(filePath);
        System.out.println(encrypteStr);

        assertNotNull(bFile);

//        byte[] secret = RsaUtil.decrypt(publicKey, bFile);
//        byte[] secretHex = DatatypeConverter.parseHexBinary(encrypteStr);
        // -- 2. Decrypt it go get
        byte[] bytes = Base64.decode(encrypteStr);
        System.out.println(new String(bytes));

        byte[] secret = RsaUtil.decrypt(publicKey, bytes);

        System.out.println("secret: " + Arrays.toString(secret));
    }

    @Test
    public void testWFSAMLResponse2() throws Exception {

        String filePath = "Certificates/Nuance_WF/SAMLreturn.txt";
        String publicKeyPath = "Certificates/Nuance_WF/Public/public.crt";
        PublicKey publicKey = getPublicKey(publicKeyPath);
        assertNotNull(publicKey);

        URL url = Resources.getResource(filePath);

//        byte[] bFile = Files.readAllBytes(new File(filePath).toPath());
        //or this
        byte[] bFile = Files.readAllBytes(Paths.get("D:\\code\\sandbox\\learning-java\\learning.java.lang\\src\\main\\resources\\Certificates\\Nuance_WF\\SAMLreturn.txt"));
        String encrypteStr = CustomerDataReader.readResourceAsString(filePath);

        File cipherTextFile = new File("D:\\code\\sandbox\\learning-java\\learning.java.lang\\src\\main\\resources\\Certificates\\Nuance_WF\\SAMLreturn.txt");
        BufferedReader ctReader = new BufferedReader( new FileReader( cipherTextFile ) );
        String cText = ctReader.readLine();
        BigInteger cipherBI = new BigInteger( cText, 16 );
        cText = cipherBI.toString();
        System.out.println( "cText(Dec): " + cText );

        byte[] cTextBytes = cipherBI.toByteArray();

        Cipher cipher = Cipher.getInstance( "RSA" );
        cipher.init( Cipher.DECRYPT_MODE, publicKey );
        byte[] cipherData = cipher.doFinal( cTextBytes, 0, 256 );
    }

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