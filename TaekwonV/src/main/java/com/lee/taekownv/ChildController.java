// SayHelloController.java
package com.lee.taekownv;

import javafx.fxml.FXML;
import javafx.scene.Scene;
import javafx.scene.control.ChoiceBox;
import javafx.scene.control.Label;
import javafx.scene.layout.VBox;
import javafx.scene.web.WebView;
import javafx.stage.Stage;

import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;

/*
http://stackoverflow.com/questions/15004365/javafx-2-2-fxinclude-how-to-access-parent-controller-from-child-controller
 */
public class ChildController {

    @FXML
    private VBox childVBox;

    @FXML
    private ResourceBundle resources;

    // Add a public no-args construtcor explicitly just to
    // emphasize that it is needed for a controller
    public ChildController() {
    }

    @FXML
    private void initialize() {
        System.out.println("Initializing ChildController...");
         childVBox.setVisible( true );
    }
}
