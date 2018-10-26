package com.lee.apps.browser;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

import java.net.URL;

import com.google.common.io.Resources;

/**
 *   simple login example from Oracle
 *   To run this in eclipse,
 *   # Open properties from right click on file, 
 *   # Select Run/Debug Settings
 *   # Select FXMLExample, Click 'Edit' button. 
 *   # Select 'User Entries', then Click on 'Advanced...' button.
 *   # On Advanced Options window, select 'Add Folders' and okay,
 *   
 *    Run as java application.
 */
public class BrowserSingleApp extends Application {
	public void start(Stage stage) throws Exception {

		String stringUrl = "fxml/apps/browser/browser.fxml";
		URL fxmlUrl = this.getClass()
				.getClassLoader()
				.getResource(stringUrl);

		Parent root = FXMLLoader.load(Resources.getResource(stringUrl));
		root.setVisible(true);

		Scene scene = new Scene(root, 670, 275);

		stage.setTitle("FXML Welcome");
		stage.setScene(scene);
		stage.show();
	}

	public static void main(String[] args) {
		launch(args);
	}
}
