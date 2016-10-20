package ex.fxml.simple;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

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
public class FXMLExample extends Application {
	public void start(Stage stage) throws Exception {
		Parent root = FXMLLoader.load(getClass().getResource("fxml_example.fxml"));

		Scene scene = new Scene(root, 300, 275);

		stage.setTitle("FXML Welcome");
		stage.setScene(scene);
		stage.show();
	}

	public static void main(String[] args) {
		launch(args);
	}
}
