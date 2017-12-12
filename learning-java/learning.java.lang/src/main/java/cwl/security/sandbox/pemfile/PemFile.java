package cwl.security.sandbox.pemfile;

import org.bouncycastle.util.io.pem.PemObject;
import org.bouncycastle.util.io.pem.PemWriter;
import org.bouncycastle.util.io.pem.PemReader;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.security.Key;

public class PemFile {

    private PemObject pemObject;

    public PemFile(Key key, String description) {
        this.pemObject = new PemObject(description, key.getEncoded());
    }

    public void write(String filename) throws FileNotFoundException, IOException {
        PemWriter pemWriter = new PemWriter(new OutputStreamWriter(new FileOutputStream(filename)));
        try {
            pemWriter.writeObject(this.pemObject);
        } finally {
            pemWriter.close();
        }
    }

    /**
     * Return PemObject
     * @param filename
     * @return
     * @throws FileNotFoundException
     * @throws IOException
     */
    public PemObject read(String filename) throws FileNotFoundException, IOException {
        try (PemReader pemReader = new PemReader(new InputStreamReader(new FileInputStream(filename))) ) {
            return pemReader.readPemObject();
        }
    }
}
