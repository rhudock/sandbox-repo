package cwl.security.xml;

import com.sun.org.apache.xml.internal.security.encryption.XMLCipher;
import com.sun.org.apache.xml.internal.security.utils.EncryptionConstants;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.security.NoSuchAlgorithmException;

public class KeyUtil {

    public static SecretKey getSecretKey(String algorithm) {
        KeyGenerator keyGenerator = null;
        try {
            keyGenerator = KeyGenerator.getInstance(algorithm);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return keyGenerator.generateKey();
    }

    public static Document getDocument(String xmlFile) throws Exception {
        /* Get the instance of BuilderFactory class. */
        DocumentBuilderFactory builder = DocumentBuilderFactory.newInstance();

        /* Instantiate DocumentBuilder object. */
        DocumentBuilder docBuilder = builder.newDocumentBuilder();

        /* Get the Document object */
        Document document = docBuilder.parse(xmlFile);
        return document;
    }

    public static Document encryptDocument(Document document, SecretKey secretKey, String algorithm) throws Exception {
        /* Get Document root element */
        Element rootElement = document.getDocumentElement();
        String algorithmURI = algorithm;
        XMLCipher xmlCipher = XMLCipher.getInstance(algorithmURI);

        /* Initialize cipher with given secret key and operational mode */
        xmlCipher.init(XMLCipher.ENCRYPT_MODE, secretKey);

        /* Process the contents of document */
        xmlCipher.doFinal(document, rootElement, true);
        return document;
    }

    public static Document decryptDocument(Document document, SecretKey secretKey, String algorithm) throws Exception {
        Element encryptedDataElement = (Element) document.getElementsByTagNameNS(EncryptionConstants.EncryptionSpecNS, EncryptionConstants._TAG_ENCRYPTEDDATA).item(0);

        XMLCipher xmlCipher = XMLCipher.getInstance();

        xmlCipher.init(XMLCipher.DECRYPT_MODE, secretKey);
        xmlCipher.doFinal(document, encryptedDataElement);
        return document;
    }
}
