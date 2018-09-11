package cwl.security.nina;

import com.google.common.base.Charsets;
import com.google.common.io.Resources;
import org.bouncycastle.asn1.x509.AlgorithmIdentifier;
import org.bouncycastle.asn1.x509.DigestInfo;
import org.bouncycastle.operator.DefaultDigestAlgorithmIdentifierFinder;
import org.bouncycastle.operator.DigestAlgorithmIdentifierFinder;
import org.bouncycastle.util.encoders.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.Cipher;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.security.KeyFactory;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Signature;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;

import static tc.util.StringUtils.byteArrayToString;

/**
 * Studied for CBA NINA Web Proxy security.
 * Check its UnitTest for its usage.
 * <p>
 *
 *
 * https://community.oracle.com/thread/1528259
 * https://www.mkyong.com/java/java-digital-signatures-example/
 * https://docs.oracle.com/javase/tutorial/security/
 */
public class CBASignature2Helper {
    private static final Logger logger = LoggerFactory.getLogger(CBASignature2Helper.class);

    public static PrivateKey getPrivateKey(String filePath) {

        if(null == filePath) {
            filePath = "Certificates/Nuance/Private/private_key.pem";
        }

        String buffStr = null;
        try {
            buffStr = Resources.toString(Resources.getResource(filePath),  Charsets.UTF_8);
        } catch (IOException e) {
            e.printStackTrace();
        }

        buffStr = buffStr.replace("-----BEGIN PRIVATE KEY-----", "");
        buffStr = buffStr.replace("-----END PRIVATE KEY-----", "");

        // Base64 decode the data
        byte[] encoded = Base64.decode(buffStr);

        // PKCS8 decode the encoded RSA private key
        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(encoded);

        KeyFactory kf = null;
        try {
            kf = KeyFactory.getInstance("RSA");
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }

        try {
            return kf.generatePrivate(keySpec);
        } catch (InvalidKeySpecException e) {
            e.printStackTrace();
        }

        return null;
    }


    public static PublicKey getPublicKey(String filePath) {
        if(null == filePath) {
            filePath = "Certificates/Nuance/Public/public.crt";
        }
        String buffStr = null;
        try {
            buffStr = Resources.toString(Resources.getResource(filePath),  Charsets.UTF_8);
        } catch (IOException e) {
            e.printStackTrace();
        }

        buffStr = buffStr.replace("-----BEGIN CERTIFICATE-----", "");
        buffStr = buffStr.replace("-----END CERTIFICATE-----", "");


        if (null == filePath)
            filePath = "D:\\code\\sandbox\\learning-java\\learning.java.lang\\src\\main\\resources\\Certificates\\Nuance\\Public\\public.crt";

        byte[] decodedCert = org.apache.commons.codec.binary.Base64.decodeBase64(buffStr != null ? buffStr.getBytes() : new byte[0]);

        try {
            CertificateFactory cf = CertificateFactory.getInstance("X.509");
            X509Certificate cert = (X509Certificate) cf.generateCertificate(new ByteArrayInputStream(decodedCert));
            return cert.getPublicKey();
        } catch (CertificateException e) {
            logger.error("Fail to extract Certificate", e);
        }

        return null;
    }

    /**
     *  Return signature in byte array
     *
     *  getSignature and getEncrypted are returning same result.
     *
     * @param text            - message to generate signature.
     * @param privateFilePath - private file
     * @return signature in byte
     */
    public static byte[] getSignature(String text, String privateFilePath) {
        try {
            // Signature
            Signature signatureProvider = Signature.getInstance("SHA256WithRSA");
            signatureProvider.initSign(getPrivateKey(privateFilePath));

            signatureProvider.update(text.getBytes());
            return Base64.encode(signatureProvider.sign());
        } catch (Throwable e) {
            e.printStackTrace();
        }
        return null;
    }

    public static void main(String[] args) {
      /*  Preconditions.checkArgument(args != null);

        String resourceName = "Certificates/Nuance/Private/private_key.pem";
        ClassLoader loader =
                MoreObjects.firstNonNull(
                        Thread.currentThread().getContextClassLoader(), Resources.class.getClassLoader());
        URL url = loader.getResource(resourceName);

        String privateKeyFilePath = url.getFile();
        */
        String payload = "{\n" +
                "\"TalkAgentRequest\": {\n" +
                "\"@xmlns\": \"http://www.virtuoz.com\",\n" +
                "\"@SCI\": \"\",\n" +
                "\"@IID\": \"\",\n" +
                "\"@TimeStamp\": \"2014-10-23T22:46:42.996-04:00\",\n" +
                "\"UserText\": \"hi\",\n" +
                "\"Debug\": {},\n" +
                "\"uiID\": 1929446423053.0916,\n" +
                "\"ClientMetaData\": {\n" +
                "\"chatReferrer\": \"\",\n" +
                "\"userAgent\": \"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_0) AppleWebKit/537.36(KHTML, like Gecko) Chrome/38.0.2125.104 Safari/537.36\"},\n" +
                "\"VisitorIsTyping\": true,\n" +
                "\"NinaVars\": {\"preprod\": true,\"ninachat\": true}\n" +
                "}\n" +
                "}";

        byte[] enclipted = getEncrypted(payload, null);
        logger.info("Enclipted: " + byteArrayToString(enclipted));

        logger.info("Signature: " + byteArrayToString(getSignature(payload, null)));


    }

    /**
     * Same as getSignatureStr function
     *
     * @param text            - message to generate signature.
     * @param privateFilePath - private file
     * @return signature in byte
     */
    public static byte[] getEncrypted(String text, String privateFilePath) {
        try {
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

            encCipher.init(Cipher.ENCRYPT_MODE, getPrivateKey(privateFilePath));

            return Base64.encode(encCipher.doFinal(hashToEncrypt));

        } catch (Throwable e) {
            e.printStackTrace();
        }
        return null;
    }

}
