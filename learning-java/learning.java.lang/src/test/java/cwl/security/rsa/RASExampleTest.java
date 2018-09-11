package cwl.security.rsa;

import org.bouncycastle.asn1.x509.AlgorithmIdentifier;
import org.bouncycastle.asn1.x509.DigestInfo;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.operator.DefaultDigestAlgorithmIdentifierFinder;
import org.bouncycastle.operator.DigestAlgorithmIdentifierFinder;
import org.bouncycastle.util.encoders.Base64;
import org.junit.Test;

import javax.crypto.Cipher;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.MessageDigest;
import java.security.Provider;
import java.security.Security;
import java.security.Signature;

public class RASExampleTest {

    @Test
    public void testMain() throws Exception {
        boolean useBouncyCastleProvider = false;

        Provider provider = null;
        if (useBouncyCastleProvider) {
            provider = new BouncyCastleProvider();
            Security.addProvider(provider);
        }


        String plainText = "This is a plain text!!";
        System.out.println("plainText: " + plainText);



        //-- KeyPair
        KeyPairGenerator keyPairGenerator = null;
        if (null != provider)
            keyPairGenerator = KeyPairGenerator.getInstance("RSA", provider);
        else
            keyPairGenerator = KeyPairGenerator.getInstance("RSA");
        keyPairGenerator.initialize(2048);

        KeyPair keyPair = keyPairGenerator.generateKeyPair();



        //-- Signature
        Signature signatureProvider = null;
        if (null != provider)
            signatureProvider = Signature.getInstance("SHA256WithRSA", provider);
        else
            signatureProvider = Signature.getInstance("SHA256WithRSA");
        signatureProvider.initSign(keyPair.getPrivate());

        signatureProvider.update(plainText.getBytes());
        byte[] signature = signatureProvider.sign();

        System.out.println("Signature Output : ");
        System.out.println("\t" + new String(Base64.encode(signature)));



        // Message Digest
        String hashingAlgorithm = "SHA-256";
        MessageDigest messageDigestProvider = null;
        if (null != provider)
            messageDigestProvider = MessageDigest.getInstance(hashingAlgorithm, provider);
        else
            messageDigestProvider = MessageDigest.getInstance(hashingAlgorithm);
        messageDigestProvider.update(plainText.getBytes());

        byte[] hash = messageDigestProvider.digest();

        DigestAlgorithmIdentifierFinder hashAlgorithmFinder = new DefaultDigestAlgorithmIdentifierFinder();
        AlgorithmIdentifier hashingAlgorithmIdentifier = hashAlgorithmFinder.find(hashingAlgorithm);

        DigestInfo digestInfo = new DigestInfo(hashingAlgorithmIdentifier, hash);
        byte[] hashToEncrypt = digestInfo.getEncoded();



        // Crypto
        // You could also use "RSA/ECB/PKCS1Padding" for both the BC and SUN Providers.
        Cipher encCipher = null;
        if (null != provider)
            encCipher = Cipher.getInstance("RSA/NONE/PKCS1Padding", provider);
        else
            encCipher = Cipher.getInstance("RSA");
        encCipher.init(Cipher.ENCRYPT_MODE, keyPair.getPrivate());

//            byte[] encrypted = encCipher.doFinal(hashToEncrypt);
        byte[] encrypted = encCipher.doFinal(plainText.getBytes());
        System.out.println("Hash and Encryption Output : ");
        System.out.println("\t" + new String(Base64.encode(encrypted)));

// Display results
    }

    private static final char[] hex = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'};

    private static String byteArray2Hex(byte[] bytes) {
        StringBuilder sb = new StringBuilder(bytes.length * 2);
        for (final byte b : bytes) {
            sb.append(hex[(b & 0xF0) >> 4]);
            sb.append(hex[b & 0x0F]);
        }
        return sb.toString();
    }
}