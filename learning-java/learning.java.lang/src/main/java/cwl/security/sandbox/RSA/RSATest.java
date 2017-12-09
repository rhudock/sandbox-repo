package cwl.security.sandbox.RSA;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.Signature;
import java.security.SignatureException;
import java.security.interfaces.RSAPrivateKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;

/**
 * https://stackoverflow.com/questions/13419201/why-are-the-rsa-sha256-signatures-i-generate-with-openssl-and-java-different
 */
public class RSATest {

    public static void main(String[] args) throws IOException,
            NoSuchAlgorithmException, InvalidKeySpecException,
            InvalidKeyException, SignatureException {

        byte[] encodedPrivateKey = readFile("private.der");
        byte[] content = readFile("data.txt");

        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(encodedPrivateKey);
        RSAPrivateKey privateKey = (RSAPrivateKey) keyFactory
                .generatePrivate(keySpec);

        Signature signature = Signature.getInstance("SHA256withRSA");
        signature.initSign(privateKey);
        signature.update(content);
        byte[] signatureBytes = signature.sign();

        FileOutputStream fos = new FileOutputStream("signature-java");
        fos.write(signatureBytes);
        fos.close();
    }

    private static byte[] readFile(String filename) throws IOException {
        File file = new File(filename);
        BufferedInputStream bis = new BufferedInputStream(new FileInputStream(
                file));
        byte[] bytes = new byte[(int) file.length()];
        bis.read(bytes);
        bis.close();
        return bytes;
    }

}