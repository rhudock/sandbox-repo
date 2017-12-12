package cwl.security.sandbox.pemfile;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.security.Key;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.Security;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;


import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.util.io.pem.PemObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * https://www.txedo.com/blog/java-generate-rsa-keys-write-pem-file/
 */
public class RSAGenerateCert {

    protected final static Logger logger = LoggerFactory.getLogger(RSAGenerateCert.class);

    public static final int KEY_SIZE = 1024;

    public static void main(String[] args) throws FileNotFoundException, IOException, NoSuchAlgorithmException, NoSuchProviderException {
        Security.addProvider(new BouncyCastleProvider());
        logger.info("BouncyCastle provider added.");

        KeyPair keyPair = generateRSAKeyPair();
        RSAPrivateKey priv = (RSAPrivateKey) keyPair.getPrivate();
        RSAPublicKey pub = (RSAPublicKey) keyPair.getPublic();

        writePemFile(priv, "RSA PRIVATE KEY", "id_rsa");
        readPemFile(priv, "RSA PRIVATE KEY", "id_rsa");

        writePemFile(pub, "RSA PUBLIC KEY", "id_rsa.pub");
        readPemFile(pub, "RSA PUBLIC KEY", "id_rsa.pub");
    }

    private static KeyPair generateRSAKeyPair() throws NoSuchAlgorithmException, NoSuchProviderException {
        KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA", "BC");
        generator.initialize(KEY_SIZE);

        KeyPair keyPair = generator.generateKeyPair();
        logger.info("RSA key pair generated.");
        return keyPair;
    }

    private static void writePemFile(Key key, String description, String filename)
            throws FileNotFoundException, IOException {
        PemFile pemFile = new PemFile(key, description);
        pemFile.write(filename);

        logger.info(String.format("%s successfully writen in file %s.", description, filename));
    }


    private static void readPemFile(Key key, String description, String filename)
            throws FileNotFoundException, IOException {
        PemFile pemFile = new PemFile(key, description);
        PemObject pemObject = pemFile.read(filename);

        logger.info("readPemFile type:{}, byte:{}", pemObject.getType(), pemObject.getContent());


        logger.info(String.format("%s successfully read in file %s.", description, filename));
    }
}