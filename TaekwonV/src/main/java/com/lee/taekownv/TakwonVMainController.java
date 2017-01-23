// SayHelloController.java
package com.lee.taekownv;

import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.scene.Node;
import javafx.scene.control.MenuItem;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;

import java.util.Collections;
import java.util.ResourceBundle;

/*
http://stackoverflow.com/questions/15004365/javafx-2-2-fxinclude-how-to-access-parent-controller-from-child-controller
 */
public class TakwonVMainController {

    @FXML
    private MenuItem mMSimple;

    @FXML
    private MenuItem mMClild;

    @FXML
    private ResourceBundle resources;

    // Add a public no-args construtcor explicitly just to
    // emphasize that it is needed for a controller
    public TakwonVMainController() {
    }

    @FXML
    private void initialize() {
        System.out.println("Initializing TakwonVMainController...");
    }

    @FXML
    private void onMmCloseAction() {
        System.out.println("Close Menu is clicked");
    }

    @FXML
    private void onMmSimpleAction() {
        TaekwonVMainApp.selectFxml("childSayHello");
        System.out.println("Simple Menu is clicked");
    }

    @FXML
    private void onMmChildAction() {
        TaekwonVMainApp.selectFxml("childChild");
        System.out.println("Child Menu is clicked");
    }
}
