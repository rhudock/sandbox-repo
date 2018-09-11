package cwl.security.saml;

import org.apache.log4j.Logger;
import org.opensaml.Configuration;
import org.opensaml.saml2.core.Assertion;
import org.opensaml.saml2.core.EncryptedAssertion;
import org.opensaml.saml2.core.Response;
import org.opensaml.saml2.encryption.Decrypter;
import org.opensaml.saml2.encryption.EncryptedElementTypeEncryptedKeyResolver;
import org.opensaml.security.SAMLSignatureProfileValidator;
import org.opensaml.xml.XMLObject;
import org.opensaml.xml.encryption.DecryptionException;
import org.opensaml.xml.io.Unmarshaller;
import org.opensaml.xml.io.UnmarshallerFactory;
import org.opensaml.xml.io.UnmarshallingException;
import org.opensaml.xml.security.SecurityHelper;
import org.opensaml.xml.security.credential.Credential;
import org.opensaml.xml.security.keyinfo.KeyInfoHelper;
import org.opensaml.xml.security.keyinfo.StaticKeyInfoCredentialResolver;
import org.opensaml.xml.signature.KeyInfo;
import org.opensaml.xml.signature.Signature;
import org.opensaml.xml.signature.SignatureValidator;
import org.opensaml.xml.signature.X509Data;
import org.opensaml.xml.validation.ValidationException;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.List;


public class SAML2Helper {
    private static final Logger LOG = Logger.getLogger(SAML2Helper.class);

    /**
     * Convert saml response to an XML object
     * Note: that this function can return null and caller should check null value.
     *
     * @param samlResponse64String - String value of SAML response
     * @return - xml object or null.
     */
    public static Response getSAMLResponseFrom64String(String samlResponse64String) {
        byte[] samlResponseByteArray = samlResponse64String.getBytes();
        ByteArrayInputStream bais = new ByteArrayInputStream(samlResponseByteArray);

        /* Get SAML bytearray and parse it as XML */
        DocumentBuilderFactory documentBuilderFactory = DocumentBuilderFactory.newInstance();
        documentBuilderFactory.setNamespaceAware(true);
        DocumentBuilder docBuilder;
        Document document;
        try {
            docBuilder = documentBuilderFactory.newDocumentBuilder();
            document = docBuilder.parse(bais);
        } catch (ParserConfigurationException | SAXException | IOException e) {
            LOG.error("Exception while building a Document:" + e.getMessage(), e);
            return null;
        }

        Element element = document.getDocumentElement();
        if (null == element) {
            LOG.error("ERROR element cannot be null");
            return null;
        }

        UnmarshallerFactory unmarshallerFactory = Configuration.getUnmarshallerFactory();
        if (null == unmarshallerFactory) {
            LOG.error("ERROR Configuration.getUnmarshallerFactory() returns null");
            return null;
        }

        Unmarshaller unmarshaller = unmarshallerFactory.getUnmarshaller(element);
        if (null == unmarshaller) {
            LOG.error("ERROR unmarshallerFactory.getUnmarshaller(element) returns null");
            return null;
        }

        XMLObject responseXmlObj;
        try {
            responseXmlObj = unmarshaller.unmarshall(element);
        } catch (UnmarshallingException e) {
            LOG.error("UnmarshallingException while calling unmarshaller.unmarshall()" + e.getMessage(), e);
            return null;
        }
        return (Response) responseXmlObj;
    }

    public static X509Certificate extractCertificate(Signature signature) throws CertificateException {
        KeyInfo keyinfo = signature.getKeyInfo();
        if (keyinfo != null) {
            List<X509Data> x509datas = keyinfo.getX509Datas();
            if (x509datas != null && x509datas.size() > 0) {
                List<org.opensaml.xml.signature.X509Certificate> certs = x509datas.get(0).getX509Certificates();
                if (certs != null && certs.size() > 0) {
                    return KeyInfoHelper.getCertificate(certs.get(0));
                }
            }
        }
        return null;
    }

   /* public static List<Assertion> getAssertionFromResponse(Response response, XSLTTemplate xsltTemplate) {
        List<Assertion> assertions = response.getAssertions();

        if (assertions.size() == 0
                && !StringUtils.isEmptyOrNull(xsltTemplate.getPublicKey())
                && !StringUtils.isEmptyOrNull(xsltTemplate.getPrivateKey())) {

            List<EncryptedAssertion> encryptedAssertions;
            encryptedAssertions = response.getEncryptedAssertions();

            PublicKey publicKey = null;
            PrivateKey privateKey = null;
            try {
                publicKey = CertificationUtil.getPublicKey(xsltTemplate.getPublicKey());
                privateKey = CertificationUtil.getPrivateKey(xsltTemplate.getPrivateKey());
            } catch (CertificateException | NoSuchAlgorithmException | InvalidKeySpecException e) {
                LOG.warn(String.format("Fail to load key with response ID %s", response.getID()), e);
                e.printStackTrace();
            }

            for (EncryptedAssertion encryptedAssertion : encryptedAssertions) {
                assertions.add(decryptEncryptedAssertion(encryptedAssertion, publicKey, privateKey));
            }
        }

        return assertions;
    }*/

    /**
     * Decrypt a EncryptedAssertion and return Assertion.
     * @param encryptedAssertion - encrypted assertion contains data-pass
     * @return decrypted assertion.
     */
    public static Assertion decryptEncryptedAssertion(EncryptedAssertion encryptedAssertion, PublicKey publicKey, PrivateKey privateKey) {
        // This credential - obtained by some unspecified mechanism -
        // contains the recipient's PrivateKey to be used for key decryption
        Credential decryptionCredential = SecurityHelper.getSimpleCredential(publicKey, privateKey);;

        StaticKeyInfoCredentialResolver skicr = new StaticKeyInfoCredentialResolver(decryptionCredential);

        // The EncryptedKey is assumed to be contained within the
        // EncryptedAssertion/EncryptedData/KeyInfo.
        Decrypter samlDecrypter = new Decrypter(null, skicr, new EncryptedElementTypeEncryptedKeyResolver());

        Assertion assertion = null;
        try {
            assertion = samlDecrypter.decrypt(encryptedAssertion);
        } catch (DecryptionException e) {
            e.printStackTrace();
        }

        return assertion;
    }

    public static boolean validateSignature(Signature signature, X509Certificate cert, PrivateKey privateKey) {
        boolean profileValidated = false;
        boolean signatureValidated = false;

        SAMLSignatureProfileValidator samlSigValidator = new SAMLSignatureProfileValidator();
        try {
            samlSigValidator.validate(signature);
            profileValidated = true;
        } catch (ValidationException e) {
            e.printStackTrace();
        }

        signatureValidated = validateSignatureWithCredential(signature, cert, privateKey);

        return profileValidated && signatureValidated;
    }


    public static boolean validateSignatureWithCredential(Signature signature, X509Certificate cert, PrivateKey privateKey) {
        try {
            if (cert != null) {
                Credential cred = SecurityHelper.getSimpleCredential(cert, privateKey);
                SignatureValidator sigValidator = new SignatureValidator(cred);
                sigValidator.validate(signature);
                return true;
            }
        } catch (ValidationException e) {
            LOG.error("signatureValidated fail" + e.getMessage(), e);
            e.printStackTrace();
        }
        return false;
    }

}
