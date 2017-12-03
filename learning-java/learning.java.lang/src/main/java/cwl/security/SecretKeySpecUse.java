package cwl.security;

import javax.crypto.Cipher;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

/**
 * Created by dlee on 10/19/2016.
 */
public class SecretKeySpecUse {

    public static String encrypt(String strClearText, String strKey) {
        String strData = "";

        try {
            SecretKeySpec skeyspec = new SecretKeySpec(strKey.getBytes(), "Blowfish");
            Cipher cipher = Cipher.getInstance("Blowfish");
            cipher.init(Cipher.ENCRYPT_MODE, skeyspec);
            byte[] encrypted = cipher.doFinal(strClearText.getBytes());
            strData = new sun.misc.BASE64Encoder().encode(encrypted);
        } catch (Exception e) {
            e.printStackTrace();
            return strClearText;
        }
        return strData;
    }

    /*
    http://www.adeveloperdiary.com/java/how-to-easily-encrypt-and-decrypt-text-in-java/
     */
    public static String decrypt(String strEncrypted, String strKey) {
        String strData = "";

        try {
            SecretKeySpec skeyspec = new SecretKeySpec(strKey.getBytes(), "Blowfish");
            Cipher cipher = Cipher.getInstance("Blowfish");
            cipher.init(Cipher.DECRYPT_MODE, skeyspec);
            byte[] decrypted = cipher.doFinal(new sun.misc.BASE64Decoder().decodeBuffer(strEncrypted));
            strData = new String(decrypted);

        } catch (Exception e) {
            e.printStackTrace();
            return strEncrypted;
        }
        return strData;
    }


}
