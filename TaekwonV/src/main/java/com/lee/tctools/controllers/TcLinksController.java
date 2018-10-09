// SayHelloController.java
package com.lee.tctools.controllers;

import javafx.fxml.FXML;
import javafx.scene.layout.VBox;

import java.util.ResourceBundle;

/*
http://stackoverflow.com/questions/15004365/javafx-2-2-fxinclude-how-to-access-parent-controller-from-child-controller
 */
public class TcLinksController {

    @FXML
    private VBox childVBox;

    @FXML
    private ResourceBundle resources;

    // Add a public no-args construtcor explicitly just to
    // emphasize that it is needed for a controller
    public TcLinksController() {
    }

    @FXML
    private void initialize() {
        System.out.println("Initializing ChildController...");
    }
}
