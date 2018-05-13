package cwl.property;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import static com.google.common.io.Resources.getResource;

/**
 * https://stackoverflow.com/questions/12747946/how-to-write-and-read-a-file-with-a-hashmap
 */
public class ReadWriteParams {

    public static void main(String[] args) throws IOException {
        Map<String, String> ldapContent = readParamExample("property/test.properties");
        writeParamExample(ldapContent, "property/engagement.save.params");
    }

    public static Map<String, String> readParamExample(String filePathString) throws IOException {
        Map<String, String> ldapContent = new HashMap<String, String>();
        Properties properties = new Properties();
        URL url = getResource(filePathString);
        properties.load(new FileInputStream(url.getFile()));

        for (String key : properties.stringPropertyNames()) {
            ldapContent.put(key, properties.get(key).toString());
        }

        return ldapContent;
    }

    public static void writeParamExample(Map<String, String> ldapContent, String filePathString) throws IOException {
        Properties properties = new Properties();

        for (Map.Entry<String,String> entry : ldapContent.entrySet()) {
            properties.put(entry.getKey(), entry.getValue());
        }

        File file = new File(filePathString);

        properties.store(new FileOutputStream(file), null);
    }
}
