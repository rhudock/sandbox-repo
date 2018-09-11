package cwl.security.nina.cba;

import org.bouncycastle.util.encoders.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.Nullable;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Signature;
import java.security.SignatureException;


class DigitalSignatureHelper {
    private static final Logger logger = LoggerFactory.getLogger(DigitalSignatureHelper.class);

    /**
     * Return signature in byte array
     *
     * @param text       - message to generate signature.
     * @param privateKey - privateKey
     * @return byte[] signature in byte
     */
    static String buildSignature(String text, PrivateKey privateKey) {
        try {
            Signature signatureProvider = Signature.getInstance("SHA256WithRSA");
            signatureProvider.initSign(privateKey);
            signatureProvider.update(text.getBytes());

            byte[] signatureByte = signatureProvider.sign();
            return byteArrayToString(Base64.encode(signatureByte));
        } catch (InvalidKeyException | NoSuchAlgorithmException | SignatureException e) {
            logger.error("fail to build signature with error {}", e.getMessage(), e);
        }

        return null;
    }

    public static String byteArrayToString(@Nullable byte[] value) {
        return value == null ? "" : new String(value, StandardCharsets.UTF_8);
    }

    /**
     * Return true if validation is successful with given signature, payload, and publicKey
     *
     * @param signatureStr   - Signature string
     * @param textToValidate - payload string
     * @param publicKey      - public key
     * @return true if successful, false if validation fails.
     */
    static boolean isValidSignature(String signatureStr, String textToValidate, PublicKey publicKey) {
        return isValidSignature(signatureStr.getBytes(), textToValidate.getBytes(), publicKey);
    }

    private static boolean isValidSignature(byte[] signatureByte, byte[] byteToValidate, PublicKey publicKey) {
        signatureByte = Base64.decode(signatureByte);

        try {
            Signature sig = Signature.getInstance("SHA256withRSA");
            sig.initVerify(publicKey);
            sig.update(byteToValidate);

            return sig.verify(signatureByte);
        } catch (NoSuchAlgorithmException | SignatureException | InvalidKeyException e) {
            logger.warn("Payload validation failed; signature:{}, payload:{}", byteArrayToString(signatureByte), byteArrayToString(byteToValidate), e);
        }
        return false;
    }
}
