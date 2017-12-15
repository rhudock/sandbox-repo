package cwl.security.nina;

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
 * Studied for CBA NINA Web Proxy security.
 * Check its UnitTest for its usage.
 * <p>
 *
 *
 * https://community.oracle.com/thread/1528259
 * https://www.mkyong.com/java/java-digital-signatures-example/
 * https://docs.oracle.com/javase/tutorial/security/
 */
public class CBASignatureHelper {
    private static final Logger logger = LoggerFactory.getLogger(CBASignatureHelper.class);

    public static PrivateKey getPrivateKey(String filePath) {

        if (null == filePath)
            filePath = "/Users/dlee/code/sandbox-repo/learning-java/learning.java.lang/src/main/resources/Certificates/Nuance/Private/private_key.pem";

        File privateKeyFile = new File(filePath);

        try (BufferedReader br = new BufferedReader(new FileReader(privateKeyFile))) {

            StringBuilder buff = new StringBuilder();
            String lineIn;

            while ((lineIn = br.readLine()) != null) {
                buff.append(lineIn);
            }
            String buffStr = buff.toString().replace("-----BEGIN PRIVATE KEY-----", "");
            buffStr = buffStr.replace("-----END PRIVATE KEY-----", "");

            // Base64 decode the data
            byte[] encoded = Base64.decode(buffStr);

            // PKCS8 decode the encoded RSA private key
            PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(encoded);

            KeyFactory kf = KeyFactory.getInstance("RSA");
            return kf.generatePrivate(keySpec);

        } catch (Throwable e) {
            logger.error(e.getMessage(), e);
        }
        return null;
    }


    public static PublicKey getPublicKey(String filePath) {

        if (null == filePath)
            filePath = "/Users/dlee/code/sandbox-repo/learning-java/learning.java.lang/src/main/resources/Certificates/Nuance/Public/public.crt";

        File pubKeyFile = new File(filePath);

        String buffStr = null;
        try (BufferedReader br = new BufferedReader(new FileReader(pubKeyFile))) {

            StringBuilder buff = new StringBuilder();
            String lineIn;

            while ((lineIn = br.readLine()) != null) {
                buff.append(lineIn);
            }
            buffStr = buff.toString().replace("-----BEGIN CERTIFICATE-----", "");
            buffStr = buffStr.replace("-----END CERTIFICATE-----", "");
        } catch (Throwable e) {
            logger.error(e.getMessage(), e);
        }

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
            return signatureProvider.sign();
        } catch (Throwable e) {
            e.printStackTrace();
        }
        return null;
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

            return encCipher.doFinal(hashToEncrypt);

        } catch (Throwable e) {
            e.printStackTrace();
        }
        return null;
    }

}
