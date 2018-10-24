// SayHelloController.java
package com.lee.taekownv;

import javafx.collections.FXCollections;
import javafx.collections.ListChangeListener;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.control.ComboBox;
import javafx.scene.control.Hyperlink;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.layout.VBox;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.ResourceBundle;

/*
http://stackoverflow.com/questions/15004365/javafx-2-2-fxinclude-how-to-access-parent-controller-from-child-controller
 */
public class ChildController {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @FXML
    private VBox childVBox;

    @FXML
    private Label labelCmbUrl;

    @FXML
    private ComboBox cmbUrls;

    @FXML
    private Button btnSelectedUrlGo;

    @FXML
    private Button btnNewUrlGo;

    @FXML
    private ResourceBundle resources;

    @FXML
    private TextField txtNewUrl;

    @FXML
    private WebView webView;

    private ObservableList<String> cmbUrlsList;

    // Add a public no-args construtcor explicitly just to
    // emphasize that it is needed for a controller
    public ChildController() {
    }

    @FXML
    private void initialize() {
        System.out.println("Initializing ChildController...");
        labelCmbUrl.setLabelFor(cmbUrls);

// Use Java Collections to create the List.
        List<String> list = new ArrayList<String>();

        // initiate cmb
        cmbUrlsList = FXCollections.observableList(list);
        cmbUrlsList.addListener(new ListChangeListener() {
            @Override
            public void onChanged(ListChangeListener.Change change) {
                System.out.println("Detected a change! ");
            }
        });

        // Changes to the observableList WILL be reported.
        // This line will print out "Detected a change!"
        cmbUrlsList.add("item one");

        // Changes to the underlying list will NOT be reported
        // Nothing will be printed as a result of the next line.
        cmbUrlsList.add("item two");

        cmbUrls.setItems(cmbUrlsList);

        // Changes to the underlying list will NOT be reported
        // Nothing will be printed as a result of the next line.
        cmbUrlsList.add("item three");

        webEngine = webView.getEngine();
        Hyperlink hpl = new Hyperlink("java2s.com");
        hpl.setOnAction(new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent e) {
                String url = (String) cmbUrls.getItems().get(cmbUrls.getVisibleRowCount());

            }
        });
    }

    private WebEngine webEngine;
    private Hyperlink hpl;

    @FXML
    private void openSelectedUrl() {
        String url = (String) cmbUrls.getValue();
        webEngine.load(url);
    }

    @FXML
    private void openNewUrl() {

    }


}
