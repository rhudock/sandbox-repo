package cwl.security.sandbox.RSAReadKey;


import tc.util.StringUtils;
import org.bouncycastle.asn1.x509.AlgorithmIdentifier;
import org.bouncycastle.asn1.x509.DigestInfo;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.operator.DefaultDigestAlgorithmIdentifierFinder;
import org.bouncycastle.operator.DigestAlgorithmIdentifierFinder;
import org.bouncycastle.util.encoders.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.Cipher;
import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.security.KeyFactory;
import java.security.MessageDigest;
import java.security.Provider;
import java.security.Security;
import java.security.Signature;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;

/**
 * https://community.oracle.com/thread/1528259
 */
public class KeyReader {
    private static final Logger logger = LoggerFactory.getLogger(KeyReader.class);

    public static RSAPrivateKey getPrivateKey() {
        try {
            File privKeyFile = new File("D:\\code\\sandbox\\learning-java\\learning.java.lang\\src\\main\\java\\cwl\\security\\sandbox\\RSAReadKey\\private_key.pem");

            // read private key DER file
            DataInputStream dis = new DataInputStream(new FileInputStream(privKeyFile));
            byte[] privKeyBytes = new byte[(int) privKeyFile.length()];
            dis.read(privKeyBytes);
            dis.close();

            KeyFactory keyFactory = KeyFactory.getInstance("RSA");

            // decode private key
            PKCS8EncodedKeySpec privSpec = new PKCS8EncodedKeySpec(privKeyBytes);
            RSAPrivateKey privKey = (RSAPrivateKey) keyFactory.generatePrivate(privSpec);

            return privKey;
        } catch (Throwable e) {
            logger.error(e.getMessage(), e);
        }
        return null;
    }



    public static RSAPublicKey getPublicKey() {
        try {
            File pubKeyFile = new File("D:\\code\\sandbox\\learning-java\\learning.java.lang\\src\\main\\resources\\Certificates\\Nuance\\Public\\public.crt");

            // read public key DER file
            DataInputStream dis = new DataInputStream(new FileInputStream(pubKeyFile));
            byte[] pubKeyBytes = new byte[(int) pubKeyFile.length()];
            dis.readFully(pubKeyBytes);
            dis.close();

            KeyFactory keyFactory = KeyFactory.getInstance("RSA");

            // decode public key
            X509EncodedKeySpec pubSpec = new X509EncodedKeySpec(pubKeyBytes);
            RSAPublicKey pubKey = (RSAPublicKey) keyFactory.generatePublic(pubSpec);

            return pubKey;
        } catch (Throwable e) {
        }
        return null;
    }

    public static void main(String args[]) {

        try {
            boolean useBouncyCastleProvider = false;

            Provider provider = null;
            if (useBouncyCastleProvider) {
                provider = new BouncyCastleProvider();
                Security.addProvider(provider);
            }

            String plainText = "{\"TalkAgentRequest\":{\"@SCI\":\"\",\"@IID\":\"userIdentifier\",\"@TimeStamp\":\"2017-11-01T14:48:26.942763+10:00\",\"UserText\":\"userText\",\"NleResults\":true,\"NinaVars\":{\"assetType\":\"assetType\",\"invocationpoint\":\"invocationPoint\"}}}";


            // Signature
            Signature signatureProvider = null;
            if (null != provider)
                signatureProvider = Signature.getInstance("SHA256WithRSA", provider);
            else
                signatureProvider = Signature.getInstance("SHA256WithRSA");
            signatureProvider.initSign(RSAToy.getPrivateKey());

            signatureProvider.update(plainText.getBytes());
            byte[] signature = signatureProvider.sign();

            String signatureStr = new String(Base64.encode(signature)) ;
            System.out.println("Signature Output : ");
            System.out.println("\t" + new String(Base64.encode(signature)));

            String test = "Mbt1I3PK1voz++CkRg+N8KEBuTF7+Ea46HhBoKnRJgwLN7AqhOYqbmkWI1h9Y7k3GtvghX4CKolZHtokyhAjSB/omD7pbn9tvuWzNmNEbeZi5BAYVPf325kMnAPmrkNBloEIWzIpJHU7lY39gdKpGii901U/afytJe0d6ncP4T5I6D2tOygcWr+N0ypTbm4EyZnF5ILAiOYFRUJDEPwLbZ0v74FNpgSxP3dfUh5JUcd38yAvyOy6xg6KfYIjF3h7f1Qm3lymxC4SnUNJJuBWwXpcYRWW7v0/l1tDnLxddW4TQKCvanNN24AIOR9t0fXcXLFtFqBZOnAiHDg4lFp2ZQ==";
            if(test.equals(signatureStr)) {
                System.out.println("both signature is same");
            } else {
                System.out.println("\t" + test);
                System.out.println("both signature is DIFFERENT");

            }

            System.out.println("hash : \n\t" + StringUtils.byteArrayToString(signature));

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
            encCipher.init(Cipher.ENCRYPT_MODE, RSAToy.getPrivateKey());

            byte[] encrypted = encCipher.doFinal(hashToEncrypt);

            System.out.println("Hash and Encryption Output : ");
            System.out.println("\t" + new String(Base64.encode(encrypted)));
        } catch (Throwable e) {
            e.printStackTrace();
        }

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
