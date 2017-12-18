package cwl.security.jwt;

import cwl.security.CertificateIOUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.apache.log4j.Logger;

import java.security.cert.X509Certificate;
import java.util.Date;

public class JwtTokenService {
    private static final Logger LOG = Logger.getLogger(JwtTokenService.class);

    public static String certificate = "-----BEGIN CERTIFICATE-----\n" +
            "MIIDxjCCAq6gAwIBAgIICc8x9l7oDzgwDQYJKoZIhvcNAQELBQAwgYAxCzAJBgNV\n" +
            "BAYTAlVTMRAwDgYDVQQIEwdBbGFiYW1hMRMwEQYDVQQHEwpCaXJtaW5naGFtMRow\n" +
            "GAYDVQQKExFBVFQgU2VydmljZXMsSU5DLjEMMAoGA1UECxMDaWFtMSAwHgYDVQQD\n" +
            "ExdvaWRjLmlkcC5mbG9naW4uYXR0LmNvbTAeFw0xNzAzMTkyMTAyMjNaFw0yNzAz\n" +
            "MTgyMTAyMjNaMIGAMQswCQYDVQQGEwJVUzEQMA4GA1UECBMHQWxhYmFtYTETMBEG\n" +
            "A1UEBxMKQmlybWluZ2hhbTEaMBgGA1UEChMRQVRUIFNlcnZpY2VzLElOQy4xDDAK\n" +
            "BgNVBAsTA2lhbTEgMB4GA1UEAxMXb2lkYy5pZHAuZmxvZ2luLmF0dC5jb20wggEi\n" +
            "MA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDX8FAedEbqiD6lM+VPZGPlRQWF\n" +
            "Z7ha/jupTy5EgmhRzI21Yke1rmv5RRER0BenVdIGxoacUgoZLJiMFegD0wuJl1AA\n" +
            "Hbg7o2n6QMGAwgvjeFJbgmE1hcCXF1csm+Z1p9qGu8zodSjZH2xR9VAQhjsEFp0g\n" +
            "KCF6rdtnYOc/2UOnVumpzi9M6UJGkTCZXM17449qP6fOg0rm1PZPGFfSm7pBbc3m\n" +
            "fy6S+hkqGus5ZeuGwxjFX0VliDg9qSKp7zuHuT2Cpqn8fhg+CGHNVRpHb/ildRfW\n" +
            "yhFMWetbpU+kI9w9tDDdfS3YCywObeERzFv+tHeix9ruUPkgTaj+/DYhq3BzAgMB\n" +
            "AAGjQjBAMB0GA1UdDgQWBBS5n2AZ8OcrogaK6eIeCPt4me6CrDAfBgNVHSMEGDAW\n" +
            "gBS5n2AZ8OcrogaK6eIeCPt4me6CrDANBgkqhkiG9w0BAQsFAAOCAQEA1I8HBM/y\n" +
            "kdl6XUFfIp5o+FA6pb9uCU7P/RYMFiee8F7Ph3WG1Ok8MeQmBhxYHQ0ZzViO0tkI\n" +
            "hDZ1xQfojQ1MP5wA8dhqzyj9CaW85VzAkmCVfc6IPHoj4gVZYnfp/T1pbDDHTz/C\n" +
            "Rqo6ON0jDrhS4gtDGB9H12yTnTSOIjduFRcQvwhuIOTxN14O6NPihbewYXKNsSov\n" +
            "yBX33mVJoiQxvlSZdpiGQrlnQn8fgQohdgVw9cVVnKDX+UuW+mKM6DAc9tW4TN5X\n" +
            "XgHXAXtikCfnnOJACdfZdCgc6KTWAQ8p5yQ7AY4Q36Y+2JvHs3KQXWxhZ6OYxp7R\n" +
            "WyHEAQPoI5psCQ==\n" +
            "-----END CERTIFICATE-----";

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


    public static Claims verifySigniture(String jwt) {
        X509Certificate cert = CertificateIOUtil.extractCertificate(JwtTokenService.certificate);
        Claims claims = Jwts.parser()
                .setSigningKey(cert.getPublicKey())
                .parseClaimsJws(jwt).getBody();
        return claims;
    }


    public static String createJwtToken(String cspId, byte[] passPhraseByte) {
        Date now = new Date();

        String jws = Jwts.builder()
                .setIssuer(cspId)
                .setIssuedAt(now)
                .signWith(
                        SignatureAlgorithm.HS256,
                        passPhraseByte
                )
                .compact();

        return jws;
    }

}
