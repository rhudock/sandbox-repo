// TabSelection.java
package tc.logsee.ui;

import javafx.application.Application;
import javafx.beans.value.ObservableValue;
import javafx.event.Event;
import javafx.scene.Scene;
import javafx.scene.control.Tab;
import javafx.scene.control.TabPane;
import javafx.scene.layout.HBox;
import javafx.stage.Stage;

public class LogAnaysisApp extends Application {
	public static void main(String[] args) {
		Application.launch(args);
	}

	@Override
	public void start(Stage stage) {
		LogViewTab logViewTab = new LogViewTab("Log View", null, stage);
		GrepCmdTab grepBuildTab = new GrepCmdTab("grep build", null);

		// Add selection a change listener to Tabs
		logViewTab.setOnSelectionChanged(e -> tabSelectedChanged(e));
		grepBuildTab.setOnSelectionChanged(e -> tabSelectedChanged(e));

		TabPane tabPane = new TabPane();

		// Add a ChangeListsner to the selection model
		tabPane.getSelectionModel().selectedItemProperty()
		       .addListener(this::selectionChanged);

		tabPane.getTabs().addAll(logViewTab, grepBuildTab);

		HBox root = new HBox(tabPane);	
		root.setStyle("-fx-padding: 10;" + 
		              "-fx-border-style: solid inside;" + 
		              "-fx-border-width: 2;" +
		              "-fx-border-insets: 5;" + 
		              "-fx-border-radius: 5;" + 
		              "-fx-border-color: blue;");

		Scene scene = new Scene(root);
		stage.setScene(scene);
//		stage.setTitle("TabPane Selection Model");
		stage.setTitle("A simple TableView Example");
		stage.show();
	}

	public void selectionChanged(ObservableValue<? extends Tab> prop, 
	                             Tab oldTab,
	                             Tab newTab) {
		String oldTabText = oldTab == null? "None": oldTab.getText();
		String newTabText = newTab == null? "None": newTab.getText();	
		System.out.println("Selection changed in TabPane: old = " + 
		                   oldTabText + ", new = " + newTabText);
	}

	public void tabSelectedChanged(Event e) {
		Tab tab = (Tab)e.getSource();
		System.out.println("Selection changed event for " + tab.getText() + 
		                   " tab, selected = " + tab.isSelected());
	}
}