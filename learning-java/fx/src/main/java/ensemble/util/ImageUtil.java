package ensemble.util;

import javafx.scene.image.Image;

import java.io.IOException;
import java.net.URL;

public class ImageUtil {

    public static Image getImage(String imagePath) {
        URL url = com.google.common.io.Resources.getResource(imagePath);

        Image image = null;
        try {
            image = new javafx.scene.image.Image(url.openStream());
        } catch (IOException e) {
            e.printStackTrace();
        }

        return image;
    }
}
