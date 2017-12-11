package cwl.security.nina;

import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.security.Signature;

import static org.junit.Assert.*;

public class CBASignatureValidaterTest {
    private static final Logger logger = LoggerFactory.getLogger(CBASignatureValidaterTest.class);
    private static final String plainText = "{\"TalkAgentRequest\":{\"@SCI\":\"\",\"@IID\":\"userIdentifier\",\"@TimeStamp\":\"2017-11-01T14:48:26.942763+10:00\",\"UserText\":\"userText\",\"NleResults\":true,\"NinaVars\":{\"assetType\":\"assetType\",\"invocationpoint\":\"invocationPoint\"}}}";
    private static final String plainTextMod = "{\"TalkAgentRequest\":{\"@SCI\":\"test\",\"@IID\":\"userIdentifier\",\"@TimeStamp\":\"2017-11-01T14:48:26.942763+10:00\",\"UserText\":\"userText\",\"NleResults\":true,\"NinaVars\":{\"assetType\":\"assetType\",\"invocationpoint\":\"invocationPoint\"}}}";

    @Test
    public void getSignatureStrAndgetEncryptedTest() throws Exception {

        assertEquals(new String(CBASignatureValidater.getEncrypted(plainText, null)), new String(CBASignatureValidater.getSignature(plainText, null)));
    }

    @Test
    public void verifySigTestSuccess() throws Exception {
        byte[] signitureStr = CBASignatureValidater.getSignature(plainText, null);
        logger.debug("signatureStr : {}", signitureStr);

        Signature sig = Signature.getInstance("SHA256withRSA");
        sig.initVerify(CBASignatureValidater.getPublicKey(null));
        sig.update(plainText.getBytes());

        assertTrue(sig.verify(signitureStr));
    }
    @Test
    public void verifySigTestFail() throws Exception {
        byte[] signitureStr = CBASignatureValidater.getSignature(plainText, null);
        logger.debug("signatureStr : {}", signitureStr);

        Signature sig = Signature.getInstance("SHA256withRSA");
        sig.initVerify(CBASignatureValidater.getPublicKey(null));
        sig.update(plainTextMod.getBytes());

        assertTrue(!sig.verify(signitureStr));
    }
}