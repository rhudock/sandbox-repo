package cwl.security.rsa;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

import javax.crypto.Cipher;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.interfaces.RSAPrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;

/**
 * Encrypt Decrypt example
 * https://gist.github.com/dmydlarz/32c58f537bb7e0ab9ebf
 * https://docs.oracle.com/javase/7/docs/api/java/security/KeyPairGenerator.html
 */
public class RsaUtil {

    public static KeyPair buildKeyPair() throws NoSuchAlgorithmException {
        final int keySize = 2048;
//        final int keySize = 1024;
        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
        keyPairGenerator.initialize(keySize);
        return keyPairGenerator.genKeyPair();
    }

    public static PublicKey getPublicKey(KeyPair keyPair) {
        return keyPair.getPublic();
    }

    public static PrivateKey getPrivateKey(KeyPair keyPair) {
        return keyPair.getPrivate();
    }

    public static String publicKeyToString(PublicKey p) {
        byte[] publicKeyBytes = p.getEncoded();
        BASE64Encoder encoder = new BASE64Encoder();
        return encoder.encode(publicKeyBytes);
    }

    public static String privateKeyToString(PrivateKey p) {
        byte[] privateKeyBytes = p.getEncoded();
        BASE64Encoder encoder = new BASE64Encoder();
        return encoder.encode(privateKeyBytes);
    }

    /**
     * stringToPublicKey
     * Example
     * https://stackoverflow.com/questions/9755057/converting-strings-to-encryption-keys-and-vice-versa-java
     *
     * @param s
     * @return
     */
    public static PublicKey stringToPublicKey(String s) {
        BASE64Decoder decoder = new BASE64Decoder();

        byte[] c = null;
        KeyFactory keyFact = null;
        PublicKey returnKey = null;

        try {
            c = decoder.decodeBuffer(s);
            keyFact = KeyFactory.getInstance("RSA");
        } catch (Exception e) {
            System.out.println("Error in Keygen");
            e.printStackTrace();
        }

        X509EncodedKeySpec x509KeySpec = new X509EncodedKeySpec(c);
        try {
            returnKey = keyFact.generatePublic(x509KeySpec);
        } catch (Exception e) {
            System.out.println("Error in Keygen2");
            e.printStackTrace();
        }

        return returnKey;
    }

    /**
     * stringToPrivateKey
     * DSA example
     * https://stackoverflow.com/questions/9755057/converting-strings-to-encryption-keys-and-vice-versa-java
     * RSA example
     * https://stackoverflow.com/questions/39311157/only-rsaprivate-crt-keyspec-and-pkcs8encodedkeyspec-supported-for-rsa-private
     *
     * @param s
     * @return
     */
    public static PrivateKey stringToPrivateKey(String s) {
        BASE64Decoder decoder = new BASE64Decoder();
        byte[] c = null;
        KeyFactory keyFact = null;
        PrivateKey returnKey = null;

        try {
            c = decoder.decodeBuffer(s);
            keyFact = KeyFactory.getInstance("RSA");
        } catch (Exception e) {
            System.out.println("Error in first try catch of stringToPrivateKey");
            e.printStackTrace();
        }

//        X509EncodedKeySpec x509KeySpec = new X509EncodedKeySpec(c);
        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(c);
        try {   //the next line causes the crash
//            returnKey = keyFact.generatePrivate(x509KeySpec);
            returnKey = (RSAPrivateKey) keyFact.generatePrivate(spec);
        } catch (Exception e) {
            System.out.println("Error in stringToPrivateKey");
            e.printStackTrace();
        }

        return returnKey;
    }

    public static byte[] encrypt(PrivateKey privateKey, String message) throws Exception {
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.ENCRYPT_MODE, privateKey);

        return cipher.doFinal(message.getBytes());
    }

    public static byte[] decrypt(PublicKey publicKey, byte[] encrypted) throws Exception {
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.DECRYPT_MODE, publicKey);

        return cipher.doFinal(encrypted, 0, 256);
//        return cipher.doFinal(encrypted, 0, 128);
    }


    public static byte[] encrypt(PublicKey publicKey, String message) throws Exception {
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.ENCRYPT_MODE, publicKey);

        return cipher.doFinal(message.getBytes());
    }

    public static byte[] decrypt(PrivateKey privateKey, byte[] encrypted) throws Exception {
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.DECRYPT_MODE, privateKey);

        return cipher.doFinal(encrypted, 0, 256);
//        return cipher.doFinal(encrypted, 0, 128);
    }
}
