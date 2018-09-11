package cwl.security;

import org.apache.commons.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import sun.misc.BASE64Decoder;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.StringReader;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;

/**
 * Utility class to read certificate from resin_home keys directory
 */
public class CertificateIOUtil {
    private static final Logger logger = LoggerFactory.getLogger(CertificateIOUtil.class);

    private static final String CERTIFICATE_HEADER = "-----BEGIN CERTIFICATE-----";
    private static final String CERTIFICATE_FOOTER = "-----END CERTIFICATE-----";
    private static final String CERTIFICATE_PRIVATE_HEADER = "-----BEGIN PRIVATE KEY-----";
    private static final String CERTIFICATE_PRIVATE_FOOTER = "-----END PRIVATE KEY-----";

    public static String readCertBase64(String fileName) throws IOException {

        String base64Text;
        File samlCertFile = new File(fileName);

        try (BufferedReader br = new BufferedReader(new FileReader(samlCertFile))) {
            StringBuilder buff = new StringBuilder();
            String lineIn = br.readLine();
            if (null != lineIn && (lineIn.contentEquals(CERTIFICATE_HEADER) || lineIn.contentEquals(CERTIFICATE_PRIVATE_HEADER))) {
                while ((lineIn = br.readLine()) != null && (!(lineIn.contentEquals(CERTIFICATE_FOOTER)) && !(lineIn.contentEquals(CERTIFICATE_PRIVATE_FOOTER)))) {
                    buff.append(lineIn);
                }
            }
            base64Text = buff.toString();
            logger.debug("fileName {}, certification ({})", fileName, base64Text);
        }

        return base64Text;
    }

    public static X509Certificate extractCertificate(String certString) {
        if (certString == null) return null;

        String certBase64;
        if (certString.startsWith(CERTIFICATE_HEADER)) {
            certBase64 = obtainCertBase64(certString);
        } else {
            certBase64 = certString;
        }

        byte[] decodedCert = Base64.decodeBase64(certBase64.getBytes());

        try {
            CertificateFactory cf = CertificateFactory.getInstance("X.509");
            return (X509Certificate) cf.generateCertificate(new ByteArrayInputStream(decodedCert));
        } catch (CertificateException e) {
            logger.error("Fail to extract Certificate", e);
        }

        return null;
    }


    public static PrivateKey readPrivateKey(File keyFile) throws Exception {
        // read key bytes
        FileInputStream in = new FileInputStream(keyFile);
        byte[] keyBytes = new byte[in.available()];
        in.read(keyBytes);
        in.close();

        String privateKey = new String(keyBytes, "UTF-8");
        privateKey = privateKey.replaceAll("(-+BEGIN RSA PRIVATE KEY-+\\r?\\n|-+END RSA PRIVATE KEY-+\\r?\\n?)", "");
        privateKey = privateKey.replaceAll("(-+BEGIN PRIVATE KEY-+\\r?\\n|-+END PRIVATE KEY-+\\r?\\n?)", "");

        // don't use this for real projects!
        BASE64Decoder decoder = new BASE64Decoder();
        keyBytes = decoder.decodeBuffer(privateKey);

        // generate private key
        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA-SHA256");
        return keyFactory.generatePrivate(spec);
    }

    public static String obtainCertBase64(String certAsString) {
        BufferedReader br = null;

        try {
            StringReader fr = new StringReader(certAsString);

            String base64Text = "";
            br = new BufferedReader(fr);

            String lineIn = "";
            lineIn = br.readLine();
            if (lineIn.contentEquals(CERTIFICATE_HEADER)) {
                while ((lineIn = br.readLine()) != null) {
                    if (!(lineIn.contentEquals(CERTIFICATE_FOOTER))) {
                        base64Text += lineIn;
                    } else {
                        return base64Text;
                    }
                }
            } else {
                logger.error("Format Error in 509 Certificate");
                return "";
            }
        } catch (java.io.IOException e) {
            logger.error("ERROR while working with cert string " + certAsString, e);

        } finally {
            try {
                if (br != null)
                    br.close();
            } catch (IOException ex) {
                logger.error("ERROR while closing cert string buffer reader " + certAsString, ex);
            }
        }
        return "";
    }

    /**
     */
    static PublicKey getPublicKey(String keyStr) throws CertificateException {
        X509Certificate cert = getCertificate(keyStr);
        if (null != cert) {
            return cert.getPublicKey();
        }
        return null;
    }

    /**
     */
    static X509Certificate getCertificate(String keyStr) throws CertificateException {
        if (null == keyStr) {
            return null;
        }

        keyStr = keyStr.replace("\r", "");
        keyStr = keyStr.replace("\n", "");
        keyStr = keyStr.replace(CERTIFICATE_HEADER, "");
        keyStr = keyStr.replace(CERTIFICATE_FOOTER, "");

        byte[] certificateBytes = org.bouncycastle.util.encoders.Base64.decode(keyStr);

        if (certificateBytes != null) {
            CertificateFactory cf = CertificateFactory.getInstance("X.509");
            return (X509Certificate) cf.generateCertificate(new ByteArrayInputStream(certificateBytes));
        }
        return null;
    }

    static PrivateKey getPrivateKey(String keyStr) throws NoSuchAlgorithmException, InvalidKeySpecException {
        if (null == keyStr) {
            return null;
        }

        keyStr = keyStr.replace("\r", "");
        keyStr = keyStr.replace("\n", "");
        keyStr = keyStr.replace(CERTIFICATE_PRIVATE_HEADER, "");
        keyStr = keyStr.replace(CERTIFICATE_PRIVATE_FOOTER, "");

        byte[] certificateBytes = org.bouncycastle.util.encoders.Base64.decode(keyStr);
        if (certificateBytes != null) {
            // PKCS8 decode the encoded RSA private key
            PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(certificateBytes);

            KeyFactory kf = KeyFactory.getInstance("RSA");
            return kf.generatePrivate(keySpec);
        }
        return null;
    }
}
