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
        System.out.println(new String(ciphertext, "UTF8"));

/*
        String save1 = new String(ciphertext, "UTF8");
        System.out.println(save1);

        byte[] save2 = save1.getBytes();
        for (int i = 0; i < save2.length; i++) {
            System.out.print(save2[i] + " ");
        }
        System.out.println(new String(save2, "UTF8"));
*/

        String test21 = new sun.misc.BASE64Encoder().encode(ciphertext);
        System.out.println(test21);

        byte[] test22 = new sun.misc.BASE64Decoder().decodeBuffer(test21);
        for (int i = 0; i < test22.length; i++) {
            System.out.print(test22[i] + " ");
        }
        System.out.println(new sun.misc.BASE64Encoder().encode(test22));


        cipher.init(Cipher.DECRYPT_MODE, key);
        byte[] decryptedText = cipher.doFinal(ciphertext);

        System.out.println(new String(decryptedText, "UTF8"));
    }
}
