package cwl.security.xml;

import org.apache.xml.security.encryption.XMLCipher;
import org.w3c.dom.Document;

import javax.crypto.SecretKey;

public class Test {
    public static void main(String args[]) throws Exception {
        String xmlFile = "/Users/dlee/code/sandbox-repo/learning-java/learning.java.lang/src/test/resources/cwl/security/xml/employee.xml";
//        Resources.getResource("cwl/security/xml/employee.xml");
        String encryptedFile = "/Users/dlee/code/sandbox-repo/learning-java/learning.java.lang/src/test/resources/cwl/security/xml/encrypted.xml";
        String decryptedFile = "/Users/dlee/code/sandbox-repo/learning-java/learning.java.lang/src/test/resources/cwl/security/xml/decrypted.xml";

        SecretKey secretKey = SecretKeyUtil.getSecretKey("AES");
        Document document = XMLUtil.getDocument(xmlFile);

        Document encryptedDoc = XMLUtil.encryptDocument(document, secretKey,
                XMLCipher.AES_128);
        XMLUtil.saveDocumentTo(encryptedDoc, encryptedFile);

        Document decryptedDoc = XMLUtil.decryptDocument(encryptedDoc,
                secretKey, XMLCipher.AES_128);
        XMLUtil.saveDocumentTo(decryptedDoc, decryptedFile);

        System.out.println("Done");
    }
}
