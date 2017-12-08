package cwl.security;



import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

/**
    Utility class to read certificate from resin_home keys directory
 */
public class CertificatReader {
    private static final Logger logger = LoggerFactory.getLogger(CertificatReader.class);

    private static String base64Text = null;
    private static final String descriptorFirst = "-----BEGIN CERTIFICATE-----";
    private static final String descriptorLast = "-----END CERTIFICATE-----";

    public static String readCertBase64() throws IOException {

        /* initiate base64Text */
        if (null == base64Text) {
            File pathBase = new File(".");
            String resin_home = pathBase.getAbsolutePath();

            String samlCertPath = resin_home + File.separator + "keys" + File.separator + "saml.crt";
            File samlCertFile = new File(samlCertPath);


            String lineIn;


            try(BufferedReader br = new BufferedReader(new FileReader(samlCertFile))) {
                StringBuilder buff = new StringBuilder();
                lineIn = br.readLine();
                if (null != lineIn && lineIn.contentEquals(descriptorFirst)) {
                    while ((lineIn = br.readLine()) != null && !(lineIn.contentEquals(descriptorLast))) {
                        buff.append(lineIn);
                    }
                }
                base64Text = buff.toString();
            }
        }
        return base64Text;
    }
}
