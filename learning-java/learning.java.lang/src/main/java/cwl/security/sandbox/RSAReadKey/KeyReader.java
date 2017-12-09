package cwl.security.sandbox.RSAReadKey;

import org.apache.commons.ssl.asn1.DERInteger;
import org.bouncycastle.asn1.ASN1Sequence;
import org.bouncycastle.asn1.x509.AlgorithmIdentifier;
import org.bouncycastle.asn1.x509.DigestInfo;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.operator.DefaultDigestAlgorithmIdentifierFinder;
import org.bouncycastle.operator.DigestAlgorithmIdentifierFinder;
import org.bouncycastle.util.encoders.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import sun.misc.BASE64Decoder;

import javax.crypto.Cipher;
import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.math.BigInteger;
import java.security.KeyFactory;
import java.security.MessageDigest;
import java.security.PrivateKey;
import java.security.Provider;
import java.security.Security;
import java.security.Signature;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.RSAPrivateKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Enumeration;

/**
 * https://community.oracle.com/thread/1528259
 */
public class KeyReader {
    private static final Logger logger = LoggerFactory.getLogger(KeyReader.class);

    public static RSAPrivateKey getPrivateKey() {
        try {
            File privKeyFile = new File("D:\\code\\sandbox\\learning-java\\learning.java.lang\\src\\main\\java\\cwl\\security\\sandbox\\RSAReadKey\\private_key.pem");

            // read private key DER file
            DataInputStream dis = new DataInputStream(new FileInputStream(privKeyFile));
            byte[] privKeyBytes = new byte[(int) privKeyFile.length()];
            dis.read(privKeyBytes);
            dis.close();

            KeyFactory keyFactory = KeyFactory.getInstance("RSA");

            // decode private key
            PKCS8EncodedKeySpec privSpec = new PKCS8EncodedKeySpec(privKeyBytes);
            RSAPrivateKey privKey = (RSAPrivateKey) keyFactory.generatePrivate(privSpec);

            return privKey;
        } catch (Throwable e) {
            logger.error(e.getMessage(), e);
        }
        return null;
    }

    public static PrivateKey getPrivateKeyTry2() {
        try {
            File privKeyFile = new File("D:\\code\\sandbox\\learning-java\\learning.java.lang\\src\\main\\java\\cwl\\security\\sandbox\\RSAReadKey\\private_key.pem");

            FileInputStream in = new FileInputStream(privKeyFile);
            byte[] keyBytes = new byte[in.available()];
            in.read(keyBytes);
            in.close();

            String privateKey = new String(keyBytes, "UTF-8");
            privateKey = privateKey.replaceAll("(-+BEGIN RSA PRIVATE KEY-+\\r?\\n|-+END RSA PRIVATE KEY-+\\r?\\n?)", "");
            privateKey = privateKey.replaceAll("(-+BEGIN PRIVATE KEY-+\\r?\\n|-+END PRIVATE KEY-+\\r?\\n?)", "");

            String privKeyPEM = privateKey;

// Base64 decode the data
            BASE64Decoder decoder = new BASE64Decoder();
            byte[] encodedPrivateKey = decoder.decodeBuffer(privateKey);
//            byte[] encodedPrivateKey = Base64.decode(privKeyPEM, Base64.DEFAULT);

            ASN1Sequence primitive = (ASN1Sequence) ASN1Sequence
                    .fromByteArray(encodedPrivateKey);
            Enumeration<?> e = primitive.getObjects();
            BigInteger v = ((DERInteger) e.nextElement()).getValue();

            int version = v.intValue();
            if (version != 0 && version != 1) {
                throw new IllegalArgumentException("wrong version for RSA private key");
            }
            /**
             * In fact only modulus and private exponent are in use.
             */
            BigInteger modulus = ((DERInteger) e.nextElement()).getValue();
            BigInteger publicExponent = ((DERInteger) e.nextElement()).getValue();
            BigInteger privateExponent = ((DERInteger) e.nextElement()).getValue();
            BigInteger prime1 = ((DERInteger) e.nextElement()).getValue();
            BigInteger prime2 = ((DERInteger) e.nextElement()).getValue();
            BigInteger exponent1 = ((DERInteger) e.nextElement()).getValue();
            BigInteger exponent2 = ((DERInteger) e.nextElement()).getValue();
            BigInteger coefficient = ((DERInteger) e.nextElement()).getValue();

            RSAPrivateKeySpec spec = new RSAPrivateKeySpec(modulus, privateExponent);
            KeyFactory kf = KeyFactory.getInstance("RSA");
            PrivateKey pk = kf.generatePrivate(spec);

            return pk;
        } catch (Throwable e) {
            logger.error(e.getMessage(), e);
        }
        return null;
    }

    public static RSAPublicKey getPublicKey() {
        try {
            File pubKeyFile = new File("D:\\code\\sandbox\\learning-java\\learning.java.lang\\src\\main\\resources\\Certificates\\Nuance\\Public\\public.crt");

            // read public key DER file
            DataInputStream dis = new DataInputStream(new FileInputStream(pubKeyFile));
            byte[] pubKeyBytes = new byte[(int) pubKeyFile.length()];
            dis.readFully(pubKeyBytes);
            dis.close();

            KeyFactory keyFactory = KeyFactory.getInstance("RSA");

            // decode public key
            X509EncodedKeySpec pubSpec = new X509EncodedKeySpec(pubKeyBytes);
            RSAPublicKey pubKey = (RSAPublicKey) keyFactory.generatePublic(pubSpec);

            return pubKey;
        } catch (Throwable e) {
        }
        return null;
    }

    public static void main(String args[]) {

        try {
            boolean useBouncyCastleProvider = false;

            Provider provider = null;
            if (useBouncyCastleProvider) {
                provider = new BouncyCastleProvider();
                Security.addProvider(provider);
            }

            String plainText = "This is a plain text!!";

            // Signature
            Signature signatureProvider = null;
            if (null != provider)
                signatureProvider = Signature.getInstance("SHA256WithRSA", provider);
            else
                signatureProvider = Signature.getInstance("SHA256WithRSA");
            signatureProvider.initSign(RSAToy.getPrivateKey());

            signatureProvider.update(plainText.getBytes());
            byte[] signature = signatureProvider.sign();

            System.out.println("Signature Output : ");
            System.out.println("\t" + new String(Base64.encode(signature)));

            // Message Digest
            String hashingAlgorithm = "SHA-256";
            MessageDigest messageDigestProvider = null;
            if (null != provider)
                messageDigestProvider = MessageDigest.getInstance(hashingAlgorithm, provider);
            else
                messageDigestProvider = MessageDigest.getInstance(hashingAlgorithm);
            messageDigestProvider.update(plainText.getBytes());

            byte[] hash = messageDigestProvider.digest();

            DigestAlgorithmIdentifierFinder hashAlgorithmFinder = new DefaultDigestAlgorithmIdentifierFinder();
            AlgorithmIdentifier hashingAlgorithmIdentifier = hashAlgorithmFinder.find(hashingAlgorithm);

            DigestInfo digestInfo = new DigestInfo(hashingAlgorithmIdentifier, hash);
            byte[] hashToEncrypt = digestInfo.getEncoded();

            // Crypto
            // You could also use "RSA/ECB/PKCS1Padding" for both the BC and SUN Providers.
            Cipher encCipher = null;
            if (null != provider)
                encCipher = Cipher.getInstance("RSA/NONE/PKCS1Padding", provider);
            else
                encCipher = Cipher.getInstance("RSA");
            encCipher.init(Cipher.ENCRYPT_MODE, RSAToy.getPrivateKey());

            byte[] encrypted = encCipher.doFinal(hashToEncrypt);

            System.out.println("Hash and Encryption Output : ");
            System.out.println("\t" + new String(Base64.encode(encrypted)));
        } catch (Throwable e) {
            e.printStackTrace();
        }

// Display results

    }

    private static final char[] hex = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'};

    private static String byteArray2Hex(byte[] bytes) {
        StringBuilder sb = new StringBuilder(bytes.length * 2);
        for (final byte b : bytes) {
            sb.append(hex[(b & 0xF0) >> 4]);
            sb.append(hex[b & 0x0F]);
        }
        return sb.toString();
    }
}
