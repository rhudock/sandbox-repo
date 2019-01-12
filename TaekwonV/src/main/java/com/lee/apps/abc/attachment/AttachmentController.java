// SayHelloController.java
package com.lee.apps.abc.attachment;

import com.google.common.io.Resources;
import com.inq.attachment.service.AbcAttachmentBuilder;
import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.control.Hyperlink;
import javafx.scene.control.Label;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.VBox;
import javafx.scene.web.WebEngine;
import javafx.stage.FileChooser;
import javafx.stage.Stage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URL;
import java.util.Properties;
import java.util.ResourceBundle;

/*
http://stackoverflow.com/questions/15004365/javafx-2-2-fxinclude-how-to-access-parent-controller-from-child-controller
 */
public class AttachmentController {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @FXML
    private VBox childVBox;

    @FXML
    private Label labelCmbUrl;

    @FXML
    private ImageView imgAttachment;

    @FXML
    private Button btnOpenImg;

    @FXML
    private Button btnUploadImage;

    @FXML
    private TextArea txtAreaAttachmentJson;

    @FXML
    private ResourceBundle resources;

    @FXML
    private TextField sourceId;
    @FXML
    TextField siteId;
    @FXML
    TextField cspId;
    @FXML
    TextField passPhrase;


    // Add a public no-args construtcor explicitly just to
    // emphasize that it is needed for a controller
    public AttachmentController() {
    }

    Stage stage;

    public void setStage(Stage stage) {
        this.stage = stage;
    }

    @FXML
    private void initialize() {
        System.out.println("Initializing ChildController...");

        URL url = Resources.getResource("apps/abc/attachment/application.properties");
        // set up new properties object
        // from file "myProperties.txt"
        FileInputStream propFile = null;
        try {
            propFile = new FileInputStream(url.getPath());
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        Properties p =
                new Properties(System.getProperties());
        try {
            p.load(propFile);
        } catch (IOException e) {
            e.printStackTrace();
        }

        sourceId.setText(p.getProperty("sourceId"));
        cspId.setText(p.getProperty("cspId"));
        passPhrase.setText(p.getProperty("secret"));

        // set the system properties
        System.setProperties(p);
        // display new properties
        System.getProperties().list(System.out);
    }

    private WebEngine webEngine;
    private Hyperlink hpl;

    @FXML
    private void openNewUrl() {

    }

    final FileChooser fileChooser = new FileChooser();
    File file;

    @FXML
    private void openImageFile() {

        file = fileChooser.showOpenDialog(stage);

        if (file != null) {
            Image image1 = new Image(file.toURI().toString());
            imgAttachment.setImage(image1);
        }
    }

    private AbcAttachmentBuilder abcAttachmentBuilder = new AbcAttachmentBuilder(null);

    @FXML
    private void upLoadAttachment() {
        String json = abcAttachmentBuilder.buildAttachmentString(file.getPath());
        if (json != null) {
            txtAreaAttachmentJson.setText(json);
        }

        /*
        buildAttachmentString(String fileName,
                                        String sourceId,
                                        MessageSrvAPI messageSrvAPI,
                                        Integer siteId,
                                        String cspId,
                                        String passPhrase)
         */
    }

}
