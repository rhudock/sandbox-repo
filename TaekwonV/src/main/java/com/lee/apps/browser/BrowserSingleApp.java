package com.lee.apps.browser;

import com.google.common.io.Resources;
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

import java.net.URL;

/**
 * simple login example from Oracle
 * To run this in eclipse,
 * # Open properties from right click on file,
 * # Select Run/Debug Settings
 * # Select FXMLExample, Click 'Edit' button.
 * # Select 'User Entries', then Click on 'Advanced...' button.
 * # On Advanced Options window, select 'Add Folders' and okay,
 * <p>
 * Run as java application.
 */
public class BrowserSingleApp extends Application {
    private static final String FXML_BROWSER = "fxml/apps/browser/browser.fxml";

    public void start(Stage stage) throws Exception {

        URL fxmlUrl = this.getClass()
                .getClassLoader()
                .getResource(FXML_BROWSER);

        Parent root = FXMLLoader.load(Resources.getResource(FXML_BROWSER));
        root.setVisible(true);

        Scene scene = new Scene(root, 800, 450);

        stage.setTitle("FXML Welcome");
        stage.setScene(scene);
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
