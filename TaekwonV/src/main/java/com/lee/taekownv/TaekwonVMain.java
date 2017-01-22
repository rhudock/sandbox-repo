// SayHelloFXMLMain.java
package com.lee.taekownv;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.control.Menu;
import javafx.scene.control.MenuBar;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import javafx.stage.Stage;

import java.io.IOException;
import java.net.URL;

public class TaekwonVMain extends Application {
	public static void main(String[] args) {
		Application.launch(args);
	}

	@Override
	public void start(Stage stage) throws IOException {
		stage.setTitle("Menu Sample");
		Scene scene = new Scene(new VBox(), 400, 350);
		scene.setFill(Color.OLDLACE);

// http://docs.oracle.com/javafx/2/ui_controls/menu_controls.htm
		MenuBar menuBar = new MenuBar();
		Menu menuFile = new Menu("File");
		Menu menuEdit = new Menu("Edit");
		Menu menuView = new Menu("View");
		menuBar.getMenus().addAll(menuFile, menuEdit, menuView);


		// Construct a URL for the FXML document
		String stringUrl = "fxml/sayhellowithcontroller.fxml";
		URL fxmlUrl = this.getClass()
		                  .getClassLoader()
		                  .getResource(stringUrl);

		VBox root = FXMLLoader.<VBox>load(fxmlUrl);
		((VBox) scene.getRoot()).getChildren().addAll(menuBar, root);
		stage.setScene(scene);
		stage.setTitle("Hello FXML");
		stage.show();
	}
}
