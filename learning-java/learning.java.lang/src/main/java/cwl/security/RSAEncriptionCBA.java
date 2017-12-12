package cwl.security;

import cwl.security.jwt.JwtTokenService;

import javax.crypto.Cipher;
import java.security.*;
import java.security.cert.X509Certificate;

/**
 * https://gist.github.com/dmydlarz/32c58f537bb7e0ab9ebf
 */
public class RSAEncriptionCBA {

    public static void main(String [] args) throws Exception {
        // generate public and private keys
        KeyPair keyPair = buildKeyPair();
        PublicKey pubKey = keyPair.getPublic();
        PrivateKey privateKey = keyPair.getPrivate();

        X509Certificate cert = CertificateIOUtil.extractCertificate(JwtTokenService.certificate);
        pubKey = cert.getPublicKey();
        // privateKey = cert.getpri

      //  String signedString = "???'Z\n?s?5!?&??K???????p?4?hb???`?????K\"?:7e??=8??2??he?\n1njZ?s­??x$3B ?(c??&???BmZ<??????r +??vk     b4???Qs?????l?_???!????????????????.)??????L??‑@p???2?,???X-y????????????>????:???d??t?V?1?????E?zvu?c???0j????2i.dS90o?)M?]???l]??6?”;

        // encrypt the message
        byte [] encrypted = encrypt(privateKey, "This is a secret message");
        System.out.println(new String(encrypted));  // <<encrypted message>>

        // decrypt the message
        byte[] secret = decrypt(pubKey, encrypted);
        System.out.println(new String(secret));     // This is a secret message
    }

    public static KeyPair buildKeyPair() throws NoSuchAlgorithmException {
        final int keySize = 2048;
        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
        keyPairGenerator.initialize(keySize);
        return keyPairGenerator.genKeyPair();
    }

    public static byte[] encrypt(PrivateKey privateKey, String message) throws Exception {
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.ENCRYPT_MODE, privateKey);

        return cipher.doFinal(message.getBytes());
    }

    public static byte[] decrypt(PublicKey publicKey, byte [] encrypted) throws Exception {
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.DECRYPT_MODE, publicKey);

        return cipher.doFinal(encrypted);
    }
}
