package cwl.security;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import java.security.Key;

/**
 * Created by dlee on 10/19/2016.
 */
public class AnotherBlowfish {
    public static void main(String[] args) throws Exception {
        String text = "java2s";

        KeyGenerator keyGenerator = KeyGenerator.getInstance("Blowfish");
        keyGenerator.init(128);

        Key key = keyGenerator.generateKey();

        Cipher cipher = Cipher.getInstance("Blowfish/ECB/PKCS5Padding");
        cipher.init(Cipher.ENCRYPT_MODE, key);

        byte[] ciphertext = cipher.doFinal(text.getBytes("UTF8"));

        for (int i = 0; i < ciphertext.length; i++) {
            System.out.print(ciphertext[i] + " ");
        }
        cipher.init(Cipher.DECRYPT_MODE, key);
        byte[] decryptedText = cipher.doFinal(ciphertext);

        System.out.println(new String(decryptedText, "UTF8"));
    }
}
