package cwl.security.rsa;

import org.junit.Test;

import java.security.KeyPair;
import java.security.PrivateKey;
import java.security.PublicKey;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertNotNull;

public class RsaUtilTest {

    @Test
    public void testMain() throws Exception {
        // generate public and private keys
        KeyPair keyPair = RsaUtil.buildKeyPair();
        PublicKey pubKey = keyPair.getPublic();
        PrivateKey privateKey = keyPair.getPrivate();

        assertNotNull(pubKey);
        assertNotNull(privateKey);

        String secretString = "This is a secret message";

        // encrypt the message
        byte[] encrypted = RsaUtil.encrypt(privateKey, secretString);
        assertNotEquals(secretString.getBytes(), encrypted);

        // decrypt the message
        byte[] secret = RsaUtil.decrypt(pubKey, encrypted);
        assertEquals(secretString, new String(secret));
        // assertEquals(secretString.getBytes(), secret);
    }

}