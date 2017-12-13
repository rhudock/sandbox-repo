package cwl.security.jwt.example;

import cwl.security.CertificateIOUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.cert.X509Certificate;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.Date;

public class JwtTokenRSEx {
    private static final Logger logger = LoggerFactory.getLogger(JwtTokenRSEx.class);


    public static String RSA_PRV_KEY = "-----BEGIN RSA PRIVATE KEY-----\n" +
            "MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAL2otKdHt0I/3VXG\n" +
            "bjzNcJhetxOPiFGzdtN8vGcU19wC0h7sht8pFcc6ApiAuFRPuPDhrX2v261YOw6j\n" +
            "8iSmuBhfVpoFqBgHgbQ2NWTeehFBhMG9FEYtCy8+dbFusrtX4uUuO6KujNA2Tcqb\n" +
            "wwvDobJYmZZ0sUwN2E1jlforXlOPAgMBAAECgYAZHwV+ushn+rRDLkYKa7PO8Ddp\n" +
            "BzP+jmTeMmwfbeqsS6YFTpMMGrxgZ9X8Los72lYcIehW+OTXcGkHfBO7YxHd00dl\n" +
            "aTrCohJ5p4wNUzAK+6yXnlWqN06zNVPE6o2njqpexFC9E1o3mrGe0wgLy27fjLhh\n" +
            "R05z14yg+werq73RgQJBAPH3wWB+XxHGsmhtfPaln9zpgZV2fbZz2zH/Z0cmpHIg\n" +
            "+rtrKjcAjDgtX+w3/nqor5Y059IY9AaTOhXE6U67tWECQQDIqGBDzIQRcFgm/UxB\n" +
            "ex66jiNiOdUOgDZDG/ZA33JobHLQQX9Tabuty/0oQL/+wQwrSM21QslfFGFYxJ6m\n" +
            "wr7vAkBqPkcCf3pu67facni0M/UFouHrJqP8QNK2GVbXvvflxOVS9bMLg4oOAJ5l\n" +
            "shBi+z5dzc0cSyia2npepJ9smq8BAkARtMHh2a8hts8giaNr98hLX/WBWmcRg4DG\n" +
            "RTZinRUEX+V1uQHaQ287M8/f+G64tSI0w5TbVMxeJnc8lQUG5BJjAkEAiPm80hJq\n" +
            "sJNe9nps/4m3G03WfmomsgzQHC9PsDVha8tDXy763PnREyezovGpMEAsMXoVgWL9\n" +
            "F43qvt8HFu7hGg==\n" +
            "-----END RSA PRIVATE KEY-----";

    public static String RSA_PUB_KEY = "-----BEGIN RSA PUBLIC KEY-----\n" +
            "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC9qLSnR7dCP91Vxm48zXCYXrcT\n" +
            "j4hRs3bTfLxnFNfcAtIe7IbfKRXHOgKYgLhUT7jw4a19r9utWDsOo/IkprgYX1aa\n" +
            "BagYB4G0NjVk3noRQYTBvRRGLQsvPnWxbrK7V+LlLjuirozQNk3Km8MLw6GyWJmW\n" +
            "dLFMDdhNY5X6K15TjwIDAQAB\n" +
            "-----END RSA PUBLIC KEY-----";


    public static void main(String[] args) throws NoSuchAlgorithmException {
        KeyPairGenerator keyGenerator = KeyPairGenerator.getInstance("RSA");
        keyGenerator.initialize(1024);

        KeyPair kp = keyGenerator.genKeyPair();
        RSAPublicKey publicKey = (RSAPublicKey)kp.getPublic();
        RSAPrivateKey privateKey = (RSAPrivateKey)kp.getPrivate();

        Date now = new Date();

        String jws = Jwts.builder()
                .setIssuer("issuer")
                .setIssuedAt(now)
                .signWith(
                        SignatureAlgorithm.RS256,
                        privateKey
                )
                .compact();

        Claims claims = Jwts.parser()
                .setSigningKey(publicKey)
                .parseClaimsJws(jws).getBody();


        logger.info("claims issuer is {}", claims.getIssuer());
        logger.info("claims issuered at {}", claims.getIssuedAt());
    }

}
