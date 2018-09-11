package cwl.security.rsa;

import org.junit.Before;
import org.junit.Test;
import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

import java.net.URLEncoder;
import java.security.KeyPair;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.util.Arrays;
import java.util.Base64;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertNotNull;

public class RsaUtilTest {

    KeyPair keyPair;
    PublicKey pubKey;
    PrivateKey privateKey;

    @Before
    public void setup() throws Exception {
        // generate public and private keys
        keyPair = RsaUtil.buildKeyPair();
        pubKey = keyPair.getPublic();
        privateKey = keyPair.getPrivate();
    }

    @Test
    public void test_getStringFromPublicKey() throws Exception {
        assertNotNull(pubKey);
        assertNotNull(privateKey);

        String stringPubKey = RsaUtil.publicKeyToString(pubKey);
        System.out.println("string pubkey: " + stringPubKey);

        PublicKey myPubKey = RsaUtil.stringToPublicKey(stringPubKey);

        String secretString = "This is a secret message";

        // encrypt the message
        byte[] encrypted = RsaUtil.encrypt(privateKey, secretString);
        assertNotEquals(secretString.getBytes(), encrypted);

        // decrypt the message
        byte[] secret = RsaUtil.decrypt(myPubKey, encrypted);
        assertEquals(secretString, new String(secret));
        // assertEquals(secretString.getBytes(), secret);
    }

    @Test
    public void test_getStringFromPrivateKey() throws Exception {
        assertNotNull(pubKey);
        assertNotNull(privateKey);

        String stringPrivateKey = RsaUtil.privateKeyToString(privateKey);
        System.out.println("string private: " + stringPrivateKey);

        PrivateKey myPrivateKey = RsaUtil.stringToPrivateKey(stringPrivateKey);

        String secretString = "This is a secret message";

        // encrypt the message
        byte[] encrypted = RsaUtil.encrypt(myPrivateKey, secretString);
        assertNotEquals(secretString.getBytes(), encrypted);

        // decrypt the message
        byte[] secret = RsaUtil.decrypt(pubKey, encrypted);
        assertEquals(secretString, new String(secret));
        // assertEquals(secretString.getBytes(), secret);
    }

    /**
     * How to encrypt/decrypt long input messages with RSA? [Openssl, C]

     * @throws Exception
     */
    @Test
    public void testMain() throws Exception {
        assertNotNull(pubKey);
        assertNotNull(privateKey);

        // IllegalBlockSizeException: Data must not be longer than 245 bytes
        String secretString = "Enable encryption for agent id.";

        // encrypt the message
        byte[] encrypted = RsaUtil.encrypt(privateKey, secretString);
        String encryptedStr = new String(encrypted);
        assertNotEquals(secretString.getBytes(), encrypted);
        System.out.println("Secret String             : " + secretString);
        System.out.println("Encrypted byte            : " + Arrays.toString(encrypted));
        System.out.println("Encrypted byte String     : " + encryptedStr);
        String aEncoded = Base64.getEncoder().encodeToString(encrypted);
        System.out.println("Encrypted-byte Encoded    : " + aEncoded);
        System.out.println("Encrypted-byte URL Encoded    : " + URLEncoder.encode(encryptedStr,"UTF-8"));

        BASE64Encoder encoder = new BASE64Encoder();
//        System.out.println("Encrypted-Encoded     : " + encoder.encode(encrypted));  is in multi line format.


        BASE64Decoder decoder = new BASE64Decoder();
        byte[] aDecoded = Base64.getDecoder().decode(aEncoded);
        System.out.println("Encrypted-encoded-decoded  : " + Arrays.toString(aDecoded));


        System.out.println("Encrypted-URL Encoded : " + URLEncoder.encode(new String(encrypted), "UTF-8"));

        // decrypt the message
        byte[] secret = RsaUtil.decrypt(pubKey, encrypted);
        assertEquals(secretString, new String(secret));
        // assertEquals(secretString.getBytes(), secret);
    }

    /**
     * How to encrypt/decrypt long input messages with RSA? [Openssl, C]

     * @throws Exception
     */
    @Test
    public void testGetStringKeyValue() throws Exception {
        assertNotNull(pubKey);
        assertNotNull(privateKey);

        String publicKeyStr = RsaUtil.publicKeyToString(pubKey);
        String privateKeyStr = RsaUtil.privateKeyToString(privateKey);

        System.out.println("public  key  : " + publicKeyStr);
        System.out.println("private key  : " + privateKeyStr);

        assertNotNull(publicKeyStr);
        // assertEquals(secretString.getBytes(), secret);
    }


}