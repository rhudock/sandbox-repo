// SayHelloController.java
package com.lee.taekownv;

import javafx.fxml.FXML;
import javafx.scene.Scene;
import javafx.scene.control.ChoiceBox;
import javafx.scene.control.Label;
import javafx.scene.web.WebView;
import javafx.stage.Stage;

import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;

public class SayHelloController {
    // The refernce of msgLbl will be injected by the FXML loader
    @FXML
    private Label msgLbl;

    @FXML
    private ChoiceBox url2open;

    // location and resources wil be automatically injected by the FXML laoder
    @FXML
    private URL location;

    @FXML
    private ResourceBundle resources;

    // Add a public no-args construtcor explicitly just to
    // emphasize that it is needed for a controller
    public SayHelloController() {
    }

    @FXML
    private void initialize() {
        System.out.println("Initializing SayHelloController...");
        System.out.println("Location = " + location);
        System.out.println("Resources = " + resources);
    }

    @FXML
    private void sayHello() {
        msgLbl.setText("Hello from FXML!");
    }

    @FXML
    private void startChrome() {
        startProcess("C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe", (String) url2open.getValue());
    }

    @FXML
    private void startEditPlus() {
        startProcess("C:\\Program Files\\EditPlus 3\\editplus.exe", "E:\\code\\tc\\jira\\jiraNote\\EditPlusShortCut");
    }

    /**
     * Open a new stage with youtube.
     * Open new window: http://stackoverflow.com/questions/15041760/javafx-open-new-window
     */
    @FXML
    private void startYoutube() {
        WebView webview = new WebView();
        webview.getEngine().load(
                "https://www.youtube.com/watch?v=URXglqz7LMo?autoplay=1"
        );
        webview.setPrefSize(640, 390);

        Stage stage = new Stage();
        stage.setScene(new Scene(webview));
        stage.show();
    }

    /*
http://stackoverflow.com/questions/5604698/java-programming-call-an-exe-from-java-and-passing-parameters
 */
    private void startProcess(String... args) {
        Process process = null;
        try {
            ProcessBuilder p = new ProcessBuilder();
            System.out.println("Started EXE");
            p.command(args);

            p.start();
            System.out.println("Started EXE");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
