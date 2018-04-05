package ex.fxml.builder;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

import java.util.Objects;

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
//		URL url  = this.getClass().getResource( "/Users/dlee/code/sandbox-repo/learning-java/fx/src/main/java/ex/fxml/builder/fxml_example.fxml" );
		Parent root = FXMLLoader.load(Objects.requireNonNull(getClass().getClassLoader().getResource("fxml/fxml_example.fxml")));

		Scene scene = new Scene(root, 600, 575);

		stage.setTitle("FXML Welcome");
		stage.setScene(scene);
		stage.show();
	}

	public static void main(String[] args) {
		launch(args);
	}
}
