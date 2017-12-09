package cwl.security.nina;


import cwl.lang.numst.string.util.StringUtils;
import org.bouncycastle.asn1.x509.AlgorithmIdentifier;
import org.bouncycastle.asn1.x509.DigestInfo;
import org.bouncycastle.operator.DefaultDigestAlgorithmIdentifierFinder;
import org.bouncycastle.operator.DigestAlgorithmIdentifierFinder;
import org.bouncycastle.util.encoders.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.Cipher;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileReader;
import java.security.KeyFactory;
import java.security.MessageDigest;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Signature;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.security.spec.PKCS8EncodedKeySpec;

/**
 * https://community.oracle.com/thread/1528259
 */
public class KeyReader {
    private static final Logger logger = LoggerFactory.getLogger(KeyReader.class);

    public static PrivateKey getPrivateKey() {

        File privKeyFile = new File("/Users/dlee/code/sandbox/sandbox-repo/learning-java/learning.java.lang/src/main/resources/Certificates/Nuance/Private/private_key.pem");

        try (BufferedReader br = new BufferedReader(new FileReader(privKeyFile))) {

            StringBuilder buff = new StringBuilder();
            String lineIn;

            while ((lineIn = br.readLine()) != null) {
                buff.append(lineIn);
            }
            String buffStr = buff.toString().replace("-----BEGIN PRIVATE KEY-----", "");
            buffStr = buffStr.replace("-----END PRIVATE KEY-----", "");
            ;

            // Base64 decode the data

            byte[] encoded = Base64.decode(buffStr);

            // PKCS8 decode the encoded RSA private key

            PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(encoded);

            KeyFactory kf = KeyFactory.getInstance("RSA");
            PrivateKey privKey = kf.generatePrivate(keySpec);

            // Display the results
            System.out.println(privKey);

            return privKey;
        } catch (Throwable e) {
            logger.error(e.getMessage(), e);
        }
        return null;
    }


    public static PublicKey getPublicKey() {

        File pubKeyFile = new File("/Users/dlee/code/sandbox/sandbox-repo/learning-java/learning.java.lang/src/main/resources/Certificates/Nuance/Public/public.crt");

        String buffStr = null;
        try (BufferedReader br = new BufferedReader(new FileReader(pubKeyFile))) {

            StringBuilder buff = new StringBuilder();
            String lineIn;

            while ((lineIn = br.readLine()) != null) {
                buff.append(lineIn);
            }
            buffStr = buff.toString().replace("-----BEGIN CERTIFICATE-----", "");
            buffStr = buffStr.replace("-----END CERTIFICATE-----", "");
            ;
        } catch (Throwable e) {
        }

        byte[] decodedCert = org.apache.commons.codec.binary.Base64.decodeBase64(buffStr.getBytes());

        try {
            CertificateFactory cf = CertificateFactory.getInstance("X.509");
            X509Certificate cert = (X509Certificate) cf.generateCertificate(new ByteArrayInputStream(decodedCert));
            return cert.getPublicKey();
        } catch (CertificateException e) {
            logger.error("Fail to extract Certificate", e);
        }

        return null;
    }

    public static byte[] getSignatureStr(String text) {
        try {
            // Signature
            Signature signatureProvider = Signature.getInstance("SHA256WithRSA");
            signatureProvider.initSign(getPrivateKey());

            signatureProvider.update(text.getBytes());
            return signatureProvider.sign();
        } catch (Throwable e) {
            e.printStackTrace();
        }
        return null;
    }


    public static byte[] getEncrypted(String text) {
        try{
            // Message Digest
            String hashingAlgorithm = "SHA-256";
            MessageDigest messageDigestProvider = MessageDigest.getInstance(hashingAlgorithm);
            messageDigestProvider.update(text.getBytes());

            byte[] hash = messageDigestProvider.digest();

            DigestAlgorithmIdentifierFinder hashAlgorithmFinder = new DefaultDigestAlgorithmIdentifierFinder();
            AlgorithmIdentifier hashingAlgorithmIdentifier = hashAlgorithmFinder.find(hashingAlgorithm);

            DigestInfo digestInfo = new DigestInfo(hashingAlgorithmIdentifier, hash);
            byte[] hashToEncrypt = digestInfo.getEncoded();

            // Crypto
            // You could also use "RSA/ECB/PKCS1Padding" for both the BC and SUN Providers.
            Cipher encCipher = Cipher.getInstance("RSA");
            encCipher.init(Cipher.ENCRYPT_MODE, getPrivateKey());

            return encCipher.doFinal(hashToEncrypt);

        } catch (Throwable e) {
            e.printStackTrace();
        }
        return null;
    }

    public static void main(String args[]) {

        String plainText = "{\"TalkAgentRequest\":{\"@SCI\":\"\",\"@IID\":\"userIdentifier\",\"@TimeStamp\":\"2017-11-01T14:48:26.942763+10:00\",\"UserText\":\"userText\",\"NleResults\":true,\"NinaVars\":{\"assetType\":\"assetType\",\"invocationpoint\":\"invocationPoint\"}}}";
        try {
            // Signature
            Signature signatureProvider = Signature.getInstance("SHA256WithRSA");
            signatureProvider.initSign(getPrivateKey());

            signatureProvider.update(plainText.getBytes());
            byte[] signature = signatureProvider.sign();

            String signatureStr = new String(Base64.encode(signature));
            System.out.println("Signature Output : ");
            System.out.println("\t" + new String(Base64.encode(signature)));

            String test = "Mbt1I3PK1voz++CkRg+N8KEBuTF7+Ea46HhBoKnRJgwLN7AqhOYqbmkWI1h9Y7k3GtvghX4CKolZHtokyhAjSB/omD7pbn9tvuWzNmNEbeZi5BAYVPf325kMnAPmrkNBloEIWzIpJHU7lY39gdKpGii901U/afytJe0d6ncP4T5I6D2tOygcWr+N0ypTbm4EyZnF5ILAiOYFRUJDEPwLbZ0v74FNpgSxP3dfUh5JUcd38yAvyOy6xg6KfYIjF3h7f1Qm3lymxC4SnUNJJuBWwXpcYRWW7v0/l1tDnLxddW4TQKCvanNN24AIOR9t0fXcXLFtFqBZOnAiHDg4lFp2ZQ==";
            if (test.equals(signatureStr)) {
                System.out.println("both signature is same");
            } else {
                System.out.println("\t" + test);
                System.out.println("both signature is DIFFERENT");
            }

            System.out.println("hash : \n\t" + StringUtils.byteArrayToString(signature));
        } catch (Throwable e) {
            e.printStackTrace();
        }

        try{
            // Message Digest
            String hashingAlgorithm = "SHA-256";
            MessageDigest messageDigestProvider = MessageDigest.getInstance(hashingAlgorithm);
            messageDigestProvider.update(plainText.getBytes());

            byte[] hash = messageDigestProvider.digest();

            DigestAlgorithmIdentifierFinder hashAlgorithmFinder = new DefaultDigestAlgorithmIdentifierFinder();
            AlgorithmIdentifier hashingAlgorithmIdentifier = hashAlgorithmFinder.find(hashingAlgorithm);

            DigestInfo digestInfo = new DigestInfo(hashingAlgorithmIdentifier, hash);
            byte[] hashToEncrypt = digestInfo.getEncoded();

            // Crypto
            // You could also use "RSA/ECB/PKCS1Padding" for both the BC and SUN Providers.
            Cipher encCipher = Cipher.getInstance("RSA");
            encCipher.init(Cipher.ENCRYPT_MODE, getPrivateKey());

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
