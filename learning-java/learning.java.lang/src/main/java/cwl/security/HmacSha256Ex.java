package cwl.security;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

/**
 * http://docs.aws.amazon.com/general/latest/gr/signature-v4-examples.html#signature-v4-examples-java
 */
public class HmacSha256Ex {

    /*
    https://github.com/danharper/hmac-examples
     */
    public static void main(String[] args) {
        try {
            String key = "the shared secret key here";
            String message = "the message to hash here";

            Mac hasher = Mac.getInstance("HmacSHA256");
            hasher.init(new SecretKeySpec(key.getBytes(), "HmacSHA256"));

            byte[] hash = hasher.doFinal(message.getBytes());

            System.out.println("Converted=" + new String(hash));

            // to lowercase hexits
            String myhash = DatatypeConverter.printHexBinary(hash);

            System.out.println("DatatypeConverter.printHexBinary(hash)=" + myhash);

            // to base64
            myhash = DatatypeConverter.printBase64Binary(hash);

            System.out.println("DatatypeConverter.printBase64Binary(hash)=" + myhash);

        } catch (NoSuchAlgorithmException e) {
        } catch (InvalidKeyException e) {
        }
    }


    /*
    http://docs.aws.amazon.com/general/latest/gr/signature-v4-examples.html#signature-v4-examples-java
     */
    static byte[] HmacSHA256(String data, byte[] key) throws Exception {
        String algorithm = "HmacSHA256";
        Mac mac = Mac.getInstance(algorithm);
        mac.init(new SecretKeySpec(key, algorithm));
        return mac.doFinal(data.getBytes("UTF8"));
    }

    /*
    http://docs.aws.amazon.com/general/latest/gr/signature-v4-examples.html#signature-v4-examples-java
    */
    static byte[] getSignatureKey(String key, String dateStamp, String regionName, String serviceName) throws Exception {
        byte[] kSecret = ("AWS4" + key).getBytes("UTF8");
        byte[] kDate = HmacSHA256(dateStamp, kSecret);
        byte[] kRegion = HmacSHA256(regionName, kDate);
        byte[] kService = HmacSHA256(serviceName, kRegion);
        byte[] kSigning = HmacSHA256("aws4_request", kService);
        return kSigning;
    }
}
