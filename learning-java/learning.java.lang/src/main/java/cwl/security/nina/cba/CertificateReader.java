package cwl.security.nina.cba;

import org.bouncycastle.util.encoders.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;

class CertificateReader {
    private static final Logger logger = LoggerFactory.getLogger(CertificateReader.class);

    private static final String CERTIFICATE_HEADER = "-----BEGIN CERTIFICATE-----";
    private static final String CERTIFICATE_FOOTER = "-----END CERTIFICATE-----";
    private static final String CERTIFICATE_PRIVATE_HEADER = "-----BEGIN PRIVATE KEY-----";
    private static final String CERTIFICATE_PRIVATE_FOOTER = "-----END PRIVATE KEY-----";

    /**
     * Reading private key from given file name
     *
     * @param filePath a file path string
     * @return PrivateKey built from a key file.
     */
    static PrivateKey getPrivateKey(String filePath) {

        byte[] certificateBytes = readKeyFile(filePath, CERTIFICATE_PRIVATE_HEADER, CERTIFICATE_PRIVATE_FOOTER);
        if (certificateBytes != null) {
            try {
                // PKCS8 decode the encoded RSA private key
                PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(certificateBytes);

                KeyFactory kf = KeyFactory.getInstance("RSA");
                return kf.generatePrivate(keySpec);
            } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
                logger.error("not able to generate a private key from {} with error {}", filePath, e.getMessage(), e);
            }
        }
        return null;
    }

    /**
     * Return a Public key with a file path.
     * This function reads key file and builds a public key from a certificate.
     *
     * @param filePath file path to public key file.
     * @return PublicKey built from a certificate.
     */
    static PublicKey getPublicKey(String filePath) {

        byte[] certificateBytes = readKeyFile(filePath, CERTIFICATE_HEADER, CERTIFICATE_FOOTER);
        if (certificateBytes != null) {
            try {
                CertificateFactory cf = CertificateFactory.getInstance("X.509");
                X509Certificate cert = (X509Certificate) cf.generateCertificate(new ByteArrayInputStream(certificateBytes));
                return cert.getPublicKey();
            } catch (CertificateException e) {
                logger.error("not able to generate a public key from {} with error {}", filePath, e.getMessage(), e);
            }
        }
        return null;
    }

    /**
     * Read key Certificate file and decode it to byte array and return the result
     *
     * @param filePath file path of certificate file
     * @param header   header attached to a certificate file
     * @param footer   footer attached to a certificate file
     * @return byte array of decoded certificate
     */
    private static byte[] readKeyFile(String filePath, String header, String footer) {
        String content;
        try {
            File file = new File(filePath);
            content = new String(Files.readAllBytes(Paths.get(file.toURI())));
        } catch (IOException e) {
            logger.error("Not able to read key file {}", filePath, e);
            return null;
        }
        content = content.replace("\r", "");
        content = content.replace("\n", "");
        content = content.replace(header, "");
        content = content.replace(footer, "");

        return Base64.decode(content);
    }
}
