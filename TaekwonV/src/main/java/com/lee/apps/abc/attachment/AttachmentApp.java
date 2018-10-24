package com.lee.apps.abc.attachment;

import com.google.common.io.Resources;
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

import java.net.URL;

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
public class AttachmentApp extends Application {

	public void start(Stage stage) throws Exception {

		String stringUrl = "fxml/apps/abc/attachment/attachment.fxml";
		URL fxmlUrl = this.getClass()
				.getClassLoader()
				.getResource(stringUrl);

        FXMLLoader loader = new FXMLLoader(Resources.getResource(stringUrl));
        Parent root = (Parent)loader.load();
        AttachmentController controller = (AttachmentController)loader.getController();
        controller.setStage(stage);

		root.setVisible(true);

		Scene scene = new Scene(root, 670, 275);

		stage.setTitle("ABC Attachments");
		stage.setScene(scene);
		stage.show();
	}

    public static void main(String[] args) {
		launch(args);
	}
}
