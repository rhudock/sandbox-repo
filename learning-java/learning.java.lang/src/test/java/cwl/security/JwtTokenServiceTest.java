package cwl.security;

import cwl.security.jwt.JwtTokenService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.impl.TextCodec;
import org.junit.Test;

import java.io.UnsupportedEncodingException;
import java.security.cert.X509Certificate;

import static org.junit.Assert.*;

public class JwtTokenServiceTest {
    //    @Test(expected = io.jsonwebtoken.ExpiredJwtException.class)
    @Test(expected = io.jsonwebtoken.SignatureException.class)
    public void verifySigniture() throws Exception {
        String id_token = "eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwczovL29pZGMuc3RhZ2UuZmxvZ2luLmF0dC5jb20iLCJhdF9oYXNoIjoiTngxNk9XQ0c3UWwzU1JQUEZmTlhOUSIsImxhc3ROYW1lIjoic241MDI3NDQyNDU0Iiwic3ViIjoiNTAyNzQ0MjQ1NCIsInVzZXJHVUlEIjoiNTAyNzQ0MjQ1NCIsImNvbnRhY3RFbWFpbCI6InRlc3RtYWlsMjQ1NEBhdHQuY29tIiwicmVhbG1OYW1lIjoibWdhIiwidW5pcXVlU2VjdXJpdHlOYW1lIjoiNTAyNzQ0MjQ1NCIsImNvbnRhY3RDVE4iOiI1Mjc0NDI0NTQwIiwibm9uY2UiOiIxMDAwMDEiLCJ1c2VySUQiOiJsb2NhbGdvdkBhdHQuY29tIiwiYXVkIjoibTEyMTE3IiwidXNlckdyb3VwcyI6WyJHX0ZOIiwiR19GTl9BRE0iXSwiZmlyc3ROYW1lIjoiY241MDI3NDQyNDU0IiwibGFzdExvZ2luVGltZVN0YW1wIjoiMjAxNzA2MTIyMjEzMjYiLCJleHAiOjE0OTczMjI5MTcsImlhdCI6MTQ5NzMxNTcxN30.o_xcCZf75RpQfv3x9zDtYOgTEM42iGVpsGIwI4yLCVHzxsTtwIZ258tUYiJWsxARyYGDCWHlbHaMKk1zLsUQJtjAr2o9Bf7Hal0SY1ZT3dI6sWwecTAkuGlTQHBBfsMpTiAthqAOkI6lgIc9N0lRUctQYzB5LbSZ4DfvaMiqXz_UoRPwJKQhP21zICWjwZOlsgyK8FJJBPxNvZlBRxJFwZBsDxy_yqU01_SE0qSPNAXg3HdhSMOPff3VYzan3NaDx33K5aisj2M-qhyBQcMHbEkk8ujz_lhpMzYauXZCxvHqAy-nwjzZAljX3kyyX7Bp370Uo6WamKOr7Yv1VLu5nw";

        String[] parts = id_token.split("\\.");
        String header = new String(TextCodec.BASE64.decode(parts[0]));
        String payload = new String(TextCodec.BASE64.decode(parts[1]));
        byte[] sig = TextCodec.BASE64.decode(parts[2]);

        Claims claims = JwtTokenService.verifySigniture(id_token);

        assertNotNull(claims);
    }

    @Test
    public void testObtainCertBase64() throws UnsupportedEncodingException {

        String certificate = "-----BEGIN CERTIFICATE-----\n" +
                "MIID/DCCAuSgAwIBAgICBDkwDQYJKoZIhvcNAQELBQAweTELMAkGA1UEBhMCQVUx\n" +
                "DDAKBgNVBAgTA05TVzEPMA0GA1UEBxMGU3lkbmV5MQwwCgYDVQQKEwNDQkExKDAm\n" +
                "BgNVBAsTH0VudGVycHJpc2UgU2VydmljZXMgRGV2ZWxvcG1lbnQxEzARBgNVBAMT\n" +
                "CkVTRFJPT1RDQTMwHhcNMTcwOTE0MDQxNDIzWhcNMjcwOTEyMDQxNDIzWjCBkjEL\n" +
                "MAkGA1UEBhMCQVUxDDAKBgNVBAgTA05TVzEPMA0GA1UEBxMGU3lkbmV5MScwJQYD\n" +
                "VQQKEx5Db21tb253ZWFsdGggQmFuayBvZiBBdXN0cmFsaWExKDAmBgNVBAsTH0Vu\n" +
                "dGVycHJpc2UgU2VydmljZXMgRGV2ZWxvcG1lbnQxETAPBgNVBAMTCE5pbmFUZXN0\n" +
                "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtqVPwHlkreyhUzU/XUF1\n" +
                "uIUSf1s3Uj4IRYcK9uqBZermoKB5hD0WC0a32ggtwlLe+1oXTRJLUzmHJpHQXSYw\n" +
                "CKgmDfv2PGwyctMh9HWOguxJl1ihmzMikEfFIOYH8vsj4BXHYHg0Ve0oMuOzsvcf\n" +
                "zlnrQ92a8Vjm8/77HJKmCwpwOmErGNlZlqFtqnHidVbYurnFUuRPQD2nwCwnlmSD\n" +
                "/qsw6WFT3TT/al6529EXH3qNbSN1RKC44/gj85IA939iSr1O1GKgixKIgedtZWy1\n" +
                "i+93/1SxapyxHlE0vXY+sD1A9baF7mjhpNCzU/dBNe4gD4I8zlxfsU2aTUtxQiLn\n" +
                "oQIDAQABo3QwcjAfBgNVHSMEGDAWgBQwZRRos8E/dFZHKE5/5xGWdh8KWjALBgNV\n" +
                "HQ8EBAMCBPAwNAYDVR0lBC0wKwYIKwYBBQUHAwEGCCsGAQUFBwMCBgorBgEEAYI3\n" +
                "CgMDBglghkgBhvhCBAEwDAYDVR0TAQH/BAIwADANBgkqhkiG9w0BAQsFAAOCAQEA\n" +
                "Q9QasTzCpPVBfTb1dnjeihh7xBzuw1EWZeW46lhY4xVQGe98TmAXtQS5FIfIJfk0\n" +
                "+f+0QtjDq2pAqHI1WBeg0JDMNyTzHUm6ldbAM+8P5rkuFcielQZfsus7QdS/coge\n" +
                "mvPYIhkeIsvf29yRTRVrsuaKnEp7t312rVxUIUD5D7Go04QI2/6Iy7WktWAQvg3z\n" +
                "+LXAcAa701N4vdGewMsHzwV1PCg5cESQbwx/7xPFKrA4QPwJmZXXLB5pJIICMRd3\n" +
                "9uqeopDAzV+rYCWVYAFqm8k44WGMEko2VBQkEDe7nWftuCW/tBLkPp+GnwIq7Qds\n" +
                "HaxE33H4Hhsx5tARVG91ag==\n" +
                "-----END CERTIFICATE-----";

        X509Certificate cert = CertificateIOUtil.extractCertificate(certificate);

        assertNotNull(cert);
    }
}