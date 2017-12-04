package cwl.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.apache.commons.codec.binary.Base64;
import org.apache.log4j.Logger;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.StringReader;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;

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


    public static Claims verifySigniture(String jwt) {
        X509Certificate cert = JwtTokenService.extractCertificate(JwtTokenService.certificate);
        Claims claims = Jwts.parser()
                .setSigningKey(cert.getPublicKey())
                .parseClaimsJws(jwt).getBody();
        return claims;
    }

    public static X509Certificate extractCertificate(String certString) {
        if (certString == null) return null;
        String certBase64 = obtainCertBase64(certString);
        byte[] decodedCert = Base64.decodeBase64(certBase64.getBytes());

        try {
            CertificateFactory cf = CertificateFactory.getInstance("X.509");
            return (X509Certificate) cf.generateCertificate(new ByteArrayInputStream(decodedCert));
        } catch (CertificateException e) {
            LOG.error("Fail to extract Certificate", e);
        }

        return null;
    }

    public static String obtainCertBase64(String certAsString) {
        BufferedReader br = null;
        try {

            StringReader fr = new StringReader(certAsString);

            String descriptorFirst = "-----BEGIN CERTIFICATE-----";
            String descriptorLast = "-----END CERTIFICATE-----";
            String base64Text = "";
            br = new BufferedReader(fr);

            String lineIn = "";
            lineIn = br.readLine();
            if (lineIn.contentEquals(descriptorFirst)) {
                while ((lineIn = br.readLine()) != null) {
                    if (!(lineIn.contentEquals(descriptorLast))) {
                        base64Text += lineIn;
                    } else {
                        return base64Text;
                    }
                }
            } else {
                LOG.error("Format Error in 509 Certificate");
                return "";
            }
        } catch (java.io.IOException e) {
            LOG.error("ERROR while working with cert string " + certAsString, e);

        } finally {
            try {
                if (br != null)
                    br.close();
            } catch (IOException ex) {
                LOG.error("ERROR while closing cert string buffer reader " + certAsString, ex);
            }
        }
        return "";
    }
}
