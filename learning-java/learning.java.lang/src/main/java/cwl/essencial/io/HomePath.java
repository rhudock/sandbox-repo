package cwl.essencial.io;

import org.apache.log4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;

public class HomePath {
    private static final org.slf4j.Logger logger = LoggerFactory.getLogger(HomePath.class);

    public static void main(String[] args) {
        java.io.File pathBase = new java.io.File(".");
        String resinHome = pathBase.getAbsolutePath();

        logger.info("home running path is {}", resinHome);

//        String samlCertPath = resin_home + File.separator + "keys" + File.separator + "saml.crt";
//        File samlCertFile = new File(samlCertPath);
    }
}
