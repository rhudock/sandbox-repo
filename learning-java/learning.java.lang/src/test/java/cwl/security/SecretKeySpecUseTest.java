package cwl.security;

import org.junit.Test;
import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

/**
 * Created by dlee on 10/19/2016.
 */
public class SecretKeySpecUseTest {
    private final String myKey = "thisisakey";

    @Test
    public void encrypt() throws Exception {

        assertNotNull(SecretKeySpecUse.encrypt("hello", myKey));
    }

    @Test
    public void decrypt() throws Exception {
        String hello = SecretKeySpecUse.encrypt("hello", myKey);
        assertEquals("hello", SecretKeySpecUse.decrypt(hello, myKey));

        encrypt("edwin", "password");
        decrypt("6VsVtA/nhHKUZuWWmod/BQ==");

//    String en = encrypt1("edwin");
//    decrypt1(en, "edwin" + "MY KEY");
    }

    private static void encrypt(String username, String password) throws Exception {
        byte[] keyData = (username + password).getBytes();
        SecretKeySpec secretKeySpec = new SecretKeySpec(keyData, "Blowfish");
        Cipher cipher = Cipher.getInstance("Blowfish");
        cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec);
        byte[] hasil = cipher.doFinal(password.getBytes());
        System.out.println(new BASE64Encoder().encode(hasil));
    }

    private static void decrypt(String string) throws Exception {
        byte[] keyData = ("edwin" + "password").getBytes();
        SecretKeySpec secretKeySpec = new SecretKeySpec(keyData, "Blowfish");
        Cipher cipher = Cipher.getInstance("Blowfish");
        cipher.init(Cipher.DECRYPT_MODE, secretKeySpec);
        byte[] hasil = cipher.doFinal(new BASE64Decoder().decodeBuffer(string));
        System.out.println(new String(hasil));
    }

    private static String encrypt1(String to_encrypt) throws Exception {
        String strkey = "MY KEY";
        SecretKeySpec key = new SecretKeySpec(strkey.getBytes("UTF-8"), "Blowfish");
        Cipher cipher = Cipher.getInstance("Blowfish");
        if (cipher == null || key == null) {
            throw new Exception("Invalid key or cypher");
        }
        cipher.init(Cipher.ENCRYPT_MODE, key);
        String encryptedData = new String(cipher.doFinal(to_encrypt.getBytes("UTF-8")));
        return encryptedData;
    }

    private static String decrypt1(String encryptedData, String strkey) throws Exception {
        SecretKeySpec key = new SecretKeySpec(strkey.getBytes("UTF-8"), "Blowfish");
        Cipher cipher = Cipher.getInstance("Blowfish");
        cipher.init(Cipher.DECRYPT_MODE, key);
        byte[] decrypted = cipher.doFinal(encryptedData.getBytes());
        return new String(decrypted);
    }
}