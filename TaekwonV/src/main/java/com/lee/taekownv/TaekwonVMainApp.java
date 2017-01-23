// SayHelloFXMLMain.java
package com.lee.taekownv;

import javafx.application.Application;
import javafx.collections.ObservableList;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.scene.control.Menu;
import javafx.scene.control.MenuBar;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import javafx.stage.Stage;

import java.io.IOException;
import java.net.URL;

public class TaekwonVMainApp extends Application {
	public static void main(String[] args) {
		Application.launch(args);
	}

	private static TaekwonVMainApp instance;
	public TaekwonVMainApp() {
		instance = this;
	}
	// static method to get instance of view
	public static TaekwonVMainApp getInstance() {
		return instance;
	}

	private VBox root;

	@Override
	public void start(Stage stage) throws IOException {
		stage.setTitle("Menu Sample");
		Scene scene = new Scene(new VBox(), 650, 350);
		scene.setFill(Color.OLDLACE);

// http://docs.oracle.com/javafx/2/ui_controls/menu_controls.htm
		MenuBar menuBar = new MenuBar();
		Menu menuFile = new Menu("File");
		Menu menuEdit = new Menu("Edit");
		Menu menuView = new Menu("View");
		menuBar.getMenus().addAll(menuFile, menuEdit, menuView);


		// Construct a URL for the FXML document
		String stringUrl = "fxml/taekwonvmain.fxml";
		URL fxmlUrl = this.getClass()
		                  .getClassLoader()
		                  .getResource(stringUrl);

		root = FXMLLoader.<VBox>load(fxmlUrl);
		((VBox) scene.getRoot()).getChildren().addAll(root);
		stage.setScene(scene);
		stage.setTitle("Hello FXML");
		stage.show();
	}

	public VBox getRoot() {
		return root;
	}

	public static void selectFxml(String fxmlId){
		ObservableList<Node> children = instance.getRoot().getChildren();

		for(Node no: children){
			if(no instanceof StackPane) {
				ObservableList<Node> gChildren = ((StackPane) no).getChildren();
				for(Node node : gChildren) {
					if(node.getId().equals(fxmlId)) {
						node.setVisible(true);
					} else {
						node.setVisible(false);
					}
				}
			}
		}
	}
}
