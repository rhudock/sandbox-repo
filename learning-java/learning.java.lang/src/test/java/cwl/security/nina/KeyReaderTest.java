package cwl.security.nina;

import org.bouncycastle.util.encoders.Base64;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.security.Signature;

import static org.junit.Assert.*;

public class KeyReaderTest {
    private static final Logger logger = LoggerFactory.getLogger(KeyReaderTest.class);

    @Test
    public void getSignatureStrAndgetEncryptedTest() throws Exception {
        String plainText = "{\"TalkAgentRequest\":{\"@SCI\":\"\",\"@IID\":\"userIdentifier\",\"@TimeStamp\":\"2017-11-01T14:48:26.942763+10:00\",\"UserText\":\"userText\",\"NleResults\":true,\"NinaVars\":{\"assetType\":\"assetType\",\"invocationpoint\":\"invocationPoint\"}}}";

        assertEquals(new String(KeyReader.getEncrypted(plainText)), new String(KeyReader.getSignatureStr(plainText)));
    }

    @Test
    public void verifySigTest() throws Exception {
        String plainText = "{\"TalkAgentRequest\":{\"@SCI\":\"\",\"@IID\":\"userIdentifier\",\"@TimeStamp\":\"2017-11-01T14:48:26.942763+10:00\",\"UserText\":\"userText\",\"NleResults\":true,\"NinaVars\":{\"assetType\":\"assetType\",\"invocationpoint\":\"invocationPoint\"}}}";

        byte[] signitureStr = KeyReader.getEncrypted(plainText);
        logger.debug("signatureStr : {}", signitureStr);

        Signature sig = Signature.getInstance("SHA256withRSA");
        sig.initVerify(KeyReader.getPublicKey());
        sig.update(plainText.getBytes());

        assertTrue(sig.verify(signitureStr));
    }
}