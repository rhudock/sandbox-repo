package cwl.security;

import tc.util.StringUtils;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.security.PrivateKey;
import java.security.cert.X509Certificate;

import static org.junit.Assert.*;

public class CertificateIOUtilTest {
    private static final Logger logger = LoggerFactory.getLogger(CertificateIOUtilTest.class);

    @Test
    public void readCertBase64() throws Exception {
        assertNotNull(CertificateIOUtil.readCertBase64("D:\\code\\sandbox\\learning-java\\learning.java.lang\\src\\main\\resources\\Certificates\\CBA\\Public\\public1.crt"));
    }

    @Test
    public void extractCertificate() throws Exception {
        String certStr = CertificateIOUtil.readCertBase64("D:\\code\\sandbox\\learning-java\\learning.java.lang\\src\\main\\resources\\Certificates\\CBA\\Public\\public1.crt");

        X509Certificate certificate = CertificateIOUtil.extractCertificate(certStr);

        assertNotNull(certificate);

        logger.debug("signature {} byte {}", StringUtils.byteArrayToString(certificate.getSignature()), certificate.getSignature());
    }
    @Test
    public void extractCertificateTest() throws Exception {
        PrivateKey privateKey = CertificateIOUtil.readPrivateKey(new File("D:\\code\\sandbox\\learning-java\\learning.java.lang\\src\\main\\resources\\Certificates\\Nuance\\Private\\private_key.pem"));

        assertNotNull(privateKey);

        logger.debug("signature {}", privateKey.getAlgorithm());
    }
}