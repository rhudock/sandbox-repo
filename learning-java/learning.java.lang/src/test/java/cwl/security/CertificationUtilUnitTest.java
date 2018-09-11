package cwl.security;

import com.google.common.base.Charsets;
import com.google.common.io.Resources;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.cert.X509Certificate;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class CertificationUtilUnitTest {

    private String publicStr;
    private String privateStr;
    @Before
    public void setUp() throws Exception {
        publicStr = Resources.toString(Resources.getResource("cwl/security/certification/public.crt"), Charsets.UTF_8);
        privateStr = Resources.toString(Resources.getResource("cwl/security/certification/private_key.pem"), Charsets.UTF_8);
    }

    @After
    public void tearDown() throws Exception {
    }

    @Test
    public void getPublicKey() throws Exception {
        PublicKey publicKey = CertificateIOUtil.getPublicKey(publicStr);

        assertNotNull(publicKey);
        assertEquals(publicKey.getAlgorithm(), "RSA");
    }

    @Test
    public void getCertificate() throws Exception {
        X509Certificate certificate = CertificateIOUtil.getCertificate(publicStr);

        assertNotNull(certificate);
        assertEquals(certificate.getIssuerDN().getName(), "CN=nuance.com, O=Nuance, ST=CA, C=us");
        assertEquals(certificate.getSigAlgName(), "SHA512withRSA");
    }

    @Test
    public void getPrivateKey() throws Exception {
        PrivateKey privateKey = CertificateIOUtil.getPrivateKey(privateStr);

        assertNotNull(privateKey);
        assertEquals(privateKey.getAlgorithm(), "RSA");
    }

}