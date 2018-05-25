package cwl.security.nina.cba;

import com.google.common.io.Resources;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.util.LinkedList;
import java.util.List;

public class DigitalSignatureMgr {
    private static final Logger logger = LoggerFactory.getLogger(DigitalSignatureHelper.class);

    public static final String SIGNATURE_LABEL = "signature";

    private List<PublicKey> publicKeyList = new LinkedList<>();
    private PublicKey lastSuccessfulPublicKey;
    private PrivateKey privateKey;

    /**
     * Reading all publicKeys and privateKey
     *
     * @param publicKeyFileList - List of public key file path
     * @param privateKeyFile    - Private key file path
     */
    @SuppressWarnings("WeakerAccess")
    public DigitalSignatureMgr(List<String> publicKeyFileList, String privateKeyFile) {
        if (publicKeyFileList != null) {
            for (String filePath : publicKeyFileList) {
                publicKeyList.add(CertificateReader.getPublicKey(Resources.getResource(filePath).getFile()));
            }
            if (!publicKeyList.isEmpty()) {
                lastSuccessfulPublicKey = publicKeyList.get(0);
            } else {
                logger.error("No PublicKey available to validate CBA request");
            }
        }
        if (privateKeyFile != null) {
            privateKey = CertificateReader.getPrivateKey(Resources.getResource(privateKeyFile).getFile());
        }
        if (privateKey == null) {
            logger.error("No PrivateKey available to generate CBA response");
        }
    }

    public DigitalSignatureMgr() {
        readKeys();
    }

    /**
     * Load all keys from static location /server root/keys/cbakeys/
     */
    private void readKeys() {
        try {
            String fileLocation = "keys" + File.separator + "cbakeys" + File.separator + "CBA";
            File keyFolder = new File(fileLocation);
            if(keyFolder.isDirectory()) {
                File[] listOfFiles = keyFolder.listFiles();
                if (listOfFiles != null) {
                    for (File pubFile : listOfFiles) {
                        if (pubFile.isFile() && pubFile.getName().endsWith("crt")) {
                            publicKeyList.add(CertificateReader.getPublicKey(pubFile.getAbsolutePath()));
                            logger.info("CBA PublicKey is added {}", pubFile.getName());
                        } else {
                            logger.debug("{} is not loaded as PublicKey", pubFile.getName());
                        }
                    }
                } else {
                    logger.error("No CBA PublicKey available to validate CBA request at {}", keyFolder.getAbsolutePath());
                }
            }

            fileLocation = "keys" + File.separator +"cbakeys" + File.separator + "Nuance" + File.separator + "Private" + File.separator + "private_key.pem";
            File privateKeyFile = new File(fileLocation);

            if(privateKeyFile.isFile()) {
                privateKey = CertificateReader.getPrivateKey(privateKeyFile.getAbsolutePath());
            }
            if (privateKey == null) {
                logger.error("No PrivateKey available to generate CBA response {}", privateKeyFile.getAbsolutePath());
            }
        } catch (Exception e) {
            logger.error("ERROR while loading Private Key file: ", e);
        }
    }

    /**
     * Validate Payload
     *
     * @param payLoadStr - Request payload String
     * @param signature  - Signature String
     * @return boolean true if Request payload and its signature is valid.
     */
    public boolean validatePayload(String payLoadStr, String signature) {
        // Input can be null and this function return false.
        if(null == payLoadStr || null == signature) {
            return false;
        }

        boolean isSigValid = false;

        if (lastSuccessfulPublicKey != null) {
            isSigValid = DigitalSignatureHelper.isValidSignature(signature, payLoadStr, lastSuccessfulPublicKey);
        }

        if (!isSigValid) {
            for (PublicKey pk : this.publicKeyList) {
                if (pk != lastSuccessfulPublicKey) {
                    isSigValid = DigitalSignatureHelper.isValidSignature(signature, payLoadStr, pk);
                    if (isSigValid) {
                        lastSuccessfulPublicKey = pk;
                        break;
                    }
                }
            }
        }

        return isSigValid;
    }

    /**
     * Return Signature String
     *
     * @param payLoad - Response Body which will be used to generate Signature
     * @return Signature string
     */
    public String createSignature(String payLoad) {
        return DigitalSignatureHelper.buildSignature(payLoad, this.privateKey);
    }
}
