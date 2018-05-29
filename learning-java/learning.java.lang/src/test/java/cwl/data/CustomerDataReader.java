package cwl.data;

import com.google.common.base.Charsets;
import com.google.common.io.Resources;

import java.io.FileInputStream;
import java.io.IOException;
import java.net.URL;
import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import static com.google.common.io.Resources.getResource;


/**
 * Resources.toString(Resources.getResource(resourceName), Charsets.UTF_8);
 */
public class CustomerDataReader {

    public static Map<String, String> readRequestParamData(String filePathString) throws IOException {
        Map<String, String> requestParamMap = new HashMap<String, String>();
        Properties properties = new Properties();
        URL url = getResource(filePathString);
        properties.load(new FileInputStream(url.getFile()));

        for (String key : properties.stringPropertyNames()) {
            requestParamMap.put(key, properties.get(key).toString());
        }

        return requestParamMap;
    }

    public static String readResourceAsString(String resourceName, Charset charset) throws IOException {
        return Resources.toString(Resources.getResource(resourceName), charset);
    }

    public static String readResourceAsString(String resourceName) throws IOException {
        return readResourceAsString(resourceName, Charsets.UTF_8);
    }
}
