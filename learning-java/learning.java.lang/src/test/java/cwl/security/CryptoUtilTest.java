package cwl.security;

import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Created by dlee on 10/19/2016.
 */
public class CryptoUtilTest {
    @Test
    public void encrypt() throws Exception {
        String message = "This my message";
        String key = null;
        String encryptedMsg = null;
        String decryptedMsg = null;

        CryptoUtil cryptoUtil = new CryptoUtil();
        key = cryptoUtil.generateKey();

        // Encryption
        encryptedMsg = cryptoUtil.encrypt(message, key);

        // Decryption
        decryptedMsg = cryptoUtil.decrypt(encryptedMsg, key);

        assertEquals(message, decryptedMsg);
        // Compare to ensure the decrypted message is the same as original message
        if ( decryptedMsg != null )
        {
            System.out.println ("==================");
            System.out.println ("main(): decrypted message same as original message? " +
                    decryptedMsg.equals(message)
            );
        }
    }

}