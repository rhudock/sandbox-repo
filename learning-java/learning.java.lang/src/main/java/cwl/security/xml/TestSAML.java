package cwl.security.xml;

import org.apache.xml.security.encryption.XMLCipher;
import org.w3c.dom.Document;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.xml.bind.DatatypeConverter;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PrivateKey;
import java.security.PublicKey;

public class TestSAML {
    public static void main(String args[]) throws Exception {
        testSamlEncryptiong()
                ;


        String xmlFile = "/Users/dlee/code/sandbox-repo/learning-java/learning.java.lang/src/test/resources/cwl/security/xml/SamlResponseWF.xml";
//        Resources.getResource("cwl/security/xml/employee.xml");
        String decryptedFile = "/Users/dlee/code/sandbox-repo/learning-java/learning.java.lang/src/test/resources/cwl/security/xml/decrypted.xml";

        SecretKey secretKey = SecretKeyUtil.getSecretKey("AES");
        Document document = XMLUtil.getDocument(xmlFile);


        Document decryptedDoc = XMLUtil.decryptDocument(document,
                secretKey, XMLCipher.AES_128);
        XMLUtil.saveDocumentTo(decryptedDoc, decryptedFile);

        System.out.println("Done");


        // --
    }

    static KeyPair keyPair;

    // https://github.com/randombit/botan/issues/1225
    private static void buildKeyPair() throws  Exception{

        // KeyPair
        KeyPairGenerator keyPairGenerator = null;
        keyPairGenerator = KeyPairGenerator.getInstance("RSA");
        keyPairGenerator.initialize(2048);

        keyPair = keyPairGenerator.generateKeyPair();
    }

    private static void testSamlEncryptiong() throws Exception {
        // Init RSA encrypt cipher
        Cipher rsaEncryptCipher;

        buildKeyPair();

//        File pubFile = new File("pubkey.der");
//        FileInputStream pubFin = new FileInputStream(pubFile);
//        byte[] publicKeyByteArray = new byte[(int)pubFile.length()];
//        pubFin.read(publicKeyByteArray);
//        final PublicKey publicKey = KeyFactory.getInstance("RSA").generatePublic(new X509EncodedKeySpec(publicKeyByteArray));
        final PublicKey publicKey = keyPair.getPublic();

        rsaEncryptCipher = Cipher.getInstance("RSA/ECB/OAEPWithSHA-256AndMGF1Padding");
        rsaEncryptCipher.init(Cipher.ENCRYPT_MODE, publicKey);

        // Init RSA decrypt cipher
        Cipher rsaDecryptCipher;

//        File priFile = new File("prikey.der");
//        FileInputStream priFin = new FileInputStream(priFile);
//        byte[] privateKeyByteArray = new byte[(int)priFile.length()];
//        priFin.read(privateKeyByteArray);
//        final PrivateKey privateKey = KeyFactory.getInstance("RSA").generatePrivate(new PKCS8EncodedKeySpec(privateKeyByteArray));
        final PrivateKey privateKey = keyPair.getPrivate();

        rsaDecryptCipher = Cipher.getInstance("RSA/ECB/OAEPWithSHA-256AndMGF1Padding");
        rsaDecryptCipher.init(Cipher.DECRYPT_MODE, privateKey);

        // Run test
        final byte[] originalText = DatatypeConverter.parseHexBinary("DEADBEEFDEADBEEFDEADBEEFDEADBEEF");
        System.out.println("Original: " + DatatypeConverter.printHexBinary(originalText));
        final byte[] cipherText = rsaEncryptCipher.doFinal(originalText);
        System.out.println("Cipher  : " + DatatypeConverter.printHexBinary(cipherText));
        final byte[] plainText = rsaDecryptCipher.doFinal(cipherText);
        System.out.println("Plain   : " + DatatypeConverter.printHexBinary(plainText));
    }
}
