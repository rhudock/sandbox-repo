package com.inq.monitor.system;

/**
 * @author Crunchify.com
 *
 */

import javax.net.ssl.*;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.SecureRandom;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;

import static javax.imageio.ImageIO.read;

public class CrunchifyRESTJerseyApacheHTTPClient {

    public static void main(String [] args) throws Exception {
        // configure the SSLContext with a TrustManager
        SSLContext ctx = SSLContext.getInstance("TLS");
        ctx.init(new KeyManager[0], new TrustManager[] {new DefaultTrustManager()}, new SecureRandom());
        SSLContext.setDefault(ctx);

        URL url = new URL("https://localhost:8443/getAllRoomCnt");
        HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();
        conn.setHostnameVerifier(new HostnameVerifier() {
            @Override
            public boolean verify(String arg0, SSLSession arg1) {
                return true;
            }
        });

        int responseCode = conn.getResponseCode();
        if (responseCode != HttpURLConnection.HTTP_OK) {
            final InputStream err = conn.getErrorStream();
            try {
                throw new IOException(String.valueOf(read(err)));
            } finally {
                err.close();
            }
        }
        final InputStream in = conn.getInputStream();
        try {
            System.out.println( read(in));
        } finally {
            in.close();
        }

        System.out.println(conn.getResponseCode());
        System.out.println(conn.getDate());
        System.out.println(conn.getResponseMessage());
        Object cont = conn.getContent();

        System.out.println(conn.getResponseMessage());
        conn.disconnect();
    }

    private static class DefaultTrustManager implements X509TrustManager {

        @Override
        public void checkClientTrusted(X509Certificate[] arg0, String arg1) throws CertificateException {}

        @Override
        public void checkServerTrusted(X509Certificate[] arg0, String arg1) throws CertificateException {}

        @Override
        public X509Certificate[] getAcceptedIssuers() {
            return null;
        }
    }
}