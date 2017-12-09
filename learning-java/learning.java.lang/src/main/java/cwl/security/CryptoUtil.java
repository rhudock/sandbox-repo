package cwl.security;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.security.NoSuchAlgorithmException;
import java.security.Provider;
import java.security.SecureRandom;
import java.security.Security;

public class CryptoUtil {
    private static final Provider sunJCE = new com.sun.crypto.provider.SunJCE();
    private static final String algorithm = "Blowfish";
    private static byte[] encodedAlgoParams;

    public CryptoUtil() {
        Security.addProvider(sunJCE);
    }

    public static String generateKey() throws NoSuchAlgorithmException {
        KeyGenerator kgen = KeyGenerator.getInstance(algorithm);

        // Setup the random class and associate with key generator.
        SecureRandom random = SecureRandom.getInstance("SHA1PRNG");
        kgen.init(random);

        SecretKey skey = kgen.generateKey();
        byte[] raw = skey.getEncoded();

        return new String(raw);
    }

    public String encrypt(String data, String key) {
        String retVal = null;

        try {
            SecretKeySpec skeySpec = getSecretKeySpec(key);

            // Instantiate the cipher.
            Cipher cipher = Cipher.getInstance(algorithm);
            cipher.init(Cipher.ENCRYPT_MODE, skeySpec);

            //byte[] encrypted = cipher.doFinal( URLEncoder.encode(data).getBytes() );
            byte[] encrypted = cipher.doFinal(data.getBytes());
            retVal = new String(encrypted);
        } catch (Exception ex) {
            System.out.println("Exception in CryptoUtil.encrypt():");
            ex.printStackTrace();
            retVal = null;
        } finally {
            return retVal;
        }
    }

    public String decrypt(String data, String key) {
        String retVal = null;

        try {
            SecretKeySpec skeySpec = getSecretKeySpec(key);

            // Instantiate the cipher.
            Cipher cipher = Cipher.getInstance(algorithm);
            cipher.init(Cipher.DECRYPT_MODE, skeySpec);

            //byte[] decrypted = cipher.doFinal( URLDecoder.decode(data).getBytes() );
            byte[] decrypted = cipher.doFinal(data.getBytes());
            retVal = new String(decrypted);
        } catch (Exception ex) {
            System.out.println("Exception in CryptoUtil.decrypt():");
            ex.printStackTrace();
            retVal = null;
        } finally {
            return retVal;
        }
    }

    private SecretKeySpec getSecretKeySpec(String key) throws Exception {
        SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes(), algorithm);

        return skeySpec;
    }
}
