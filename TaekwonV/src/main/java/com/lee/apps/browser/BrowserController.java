// SayHelloController.java
package com.lee.apps.browser;

import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
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
import javafx.concurrent.Worker.State;
/*
http://stackoverflow.com/questions/15004365/javafx-2-2-fxinclude-how-to-access-parent-controller-from-child-controller

Oracle WebView - https://blogs.oracle.com/java/javafx-webview-overview
WebEngine - https://docs.oracle.com/javase/8/javafx/api/javafx/scene/web/WebEngine.html
 */
public class BrowserController {
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
    private Button btnHistoryBack;

    @FXML
    private TextField txtANewUrl;

    @FXML
    private Button btnNewUrlGo;

    @FXML
    private ResourceBundle resources;

    @FXML
    private WebView webView;

    private ObservableList<String> cmbUrlsList;

    // Add a public no-args construtcor explicitly just to
    // emphasize that it is needed for a controller
    public BrowserController() {
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
        cmbUrlsList.add("https://www.google.com");

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

        webEngine.getLoadWorker().stateProperty().addListener(
                new ChangeListener<State>() {
                    public void changed(ObservableValue ov, State oldState, State newState) {
                        if (newState == State.SUCCEEDED) {
                            txtANewUrl.setText(webEngine.getLocation());
                        }
                    }
                });
        webEngine.load("http://javafx.com");

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
        String url = txtANewUrl.getText();
        webEngine.load(url);
    }

    @FXML
    private void goHistoryBack() {
        webEngine.executeScript("history.back()");
    }


}
