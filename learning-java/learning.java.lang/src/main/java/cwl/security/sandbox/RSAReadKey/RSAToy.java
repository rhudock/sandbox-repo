package cwl.security.sandbox.RSAReadKey;

import org.bouncycastle.util.encoders.Base64;

import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;

/**
 * https://stackoverflow.com/questions/7216969/getting-rsa-private-key-from-pem-base64-encoded-private-key-file
 */
public class RSAToy {

    private static final String BEGIN_RSA_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----" +
            "MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC5NeJJKvRlEZBe" +
            "vOuoGjTrvbPE3m7vtNqcqDWj+FMXtmVB/nxaIVTUnp6QyDPyYAuRe/LsNZfpvGPm" +
            "zAiE7liC9InCvypYQ+6deSEBAmHQGpiqY4FRH90emgsyLsiPbm11419m2xeR1SLv" +
            "zSXGiS+ApPFPayL2aE4FLeXrNmricvkX4I2E4VP7P2LtRjrJFenLOMivZwYmh5za" +
            "UK7etKlKV6LYmb/R26Ngb93/3t+MkzcpcCTcp9Ewz/6kATWO8H+jCXtf/gKzEw/k" +
            "hjD5IkuKIl8LQQumQe0+ocJyMcUwqNo6bvLl3WtWKOH2vhh0VoAp5W7oqEhPFLPw" +
            "PjNetFVzAgMBAAECggEBAKkcSkIEtqKSJwBZ/9K+GxQlYr+fWiwFNpdT/6Z4V2aP" +
            "ZGWduG2TgaGiM6Z/Ju9oQyfTxTtotAz3t0BFjIHUH31zS1ZGtqNhY77lmv0Q777U" +
            "ihEKSkmIjp4iiZaIoRhV/BxoP/PqmNrPgdbzukpNeNI9yRh6+rGDC7ou7oCWb4HT" +
            "alzHHk6gvMuhWpeD3Mt6tqaHjGCPPqF7tdf9RGlMIrl7Aq9L9XQGMTIq3LXUtoD1" +
            "ztyIsu+xHkaSTlEI6+wguu2S0cHVU3h0YTri8sLWrIyr2xrQ5RRawGamxu2JHrsN" +
            "TdxfQAxO3EMfB3fP4E9Sy0VKt/6XwvHdt/8WweRUSAECgYEA6qWOnZdQ0hiNFp9b" +
            "xHQU8Sh8SIWI/UH4jHhZEjEDzYyltlbgWuULGMKhMuDs7SCq2GmPq46L3XknWhna" +
            "kit+dlXegTPPS2hFTtPaWEWtZFF+DkymkLB+Wfj5ABUiPXf6YxfgUBuLTzOWVAPg" +
            "PXmonMUuIJWwdC7hxGmDrhFCn6MCgYEAyhCjAIlb47cIp4JaxNiZd4kB08YWTa5f" +
            "DL0yW1mQf7ijs+xxOnyTmW8kTZ3Gf1WKY9+JVxzyAFj9tETH6uVx3ocna7W8LYNy" +
            "Mjb8JcACzQ8xsrw5joOXZ7t/fqYYg1KkBeDtP31R77P6jU2q03QGwik1Q5su2u30" +
            "VLU1/7Xwj/ECgYEAmxoEQzcaPUXtPN7pkdoJXb8dJ/LcsktBN9j1R4kOsngdsYGL" +
            "m4l65EsCstbqxXOqepKMXSJEYYkL8grU53nIhgAMq+rLQ1UROyHeWir0ijMz18/i" +
            "6hE/88kXDm7pyyfbYlUN+OW8GAZJgA9v0jLwuW+9JdzMXn/+zA3S9OSD3XECgYBG" +
            "JkBwjz83bvOyM68PZ6LfvNDFlJ9pmH+nDIfO7ukbbh5m+E7W3yjeu5b+2yduTWQe" +
            "CBzGAWaCeGKbksVU5xMBDirBWfZaVqfuhuhCssZGKmA2jOHueAC4In/AmCkqbiZD" +
            "ZDL5N6iabwEszSng/wbZoTS8o8NAfhu0zLRScfdyAQKBgQDhjhtu1byvYooSBw+T" +
            "t2Qdf93RPPDjzvXzv3VWsALXtOnwVICKhGRlEh/sB3FFCIBglaox4p0pjhrbd+Vk" +
            "LTh7NayXjAPU4GNfuClS1slJTAsxQutG9PtknaoDUDJ0nbr/qPYp5D0A6LeNp4xC" +
            "qAtXwZ9MCT2UefAgAYnkpVPPUw==" +
            "-----END PRIVATE KEY-----";

    public static PrivateKey getPrivateKey() throws Exception {

        // Remove the first and last lines

        String privKeyPEM = BEGIN_RSA_PRIVATE_KEY.replace("-----BEGIN PRIVATE KEY-----", "");
        privKeyPEM = privKeyPEM.replace("-----END PRIVATE KEY-----", "");
        System.out.println(privKeyPEM);

        // Base64 decode the data

        byte [] encoded = Base64.decode(privKeyPEM);

        // PKCS8 decode the encoded RSA private key

        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(encoded);

        KeyFactory kf = KeyFactory.getInstance("RSA");
        PrivateKey privKey = kf.generatePrivate(keySpec);

        // Display the results

        System.out.println(privKey);

        return privKey;
    }
}