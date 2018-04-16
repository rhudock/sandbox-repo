package tableexample;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.control.TableView;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;
import org.controlsfx.control.table.TableFilter;

public class FxTableViewExample1 extends Application
{
	public static void main(String[] args)
	{
		Application.launch(args);
	}

	@SuppressWarnings("unchecked")
	@Override
	public void start(Stage stage)
	{
		// Create a TableView with a list of persons
		TableView<Person> table = new TableView<>();
		// Add rows to the TableView

		table.getItems().addAll(TableViewHelper.getPersonList());
		// Add columns to the TableView
		table.getColumns().addAll(TableViewHelper.getIdColumn(), TableViewHelper.getFirstNameColumn(),
			TableViewHelper.getLastNameColumn(),TableViewHelper.getStreetColumn(),
			TableViewHelper.getZipCodeColumn(), TableViewHelper.getCityColumn(), TableViewHelper.getCountryColumn());

		// Set the column resize policy to constrained resize policy
		table.setColumnResizePolicy(TableView.CONSTRAINED_RESIZE_POLICY);
		// Set the Placeholder for an empty table
		table.setPlaceholder(new Label("No visible columns and/or data exist."));

        TableFilter filter = new TableFilter(table);

		// Create the VBox
		VBox root = new VBox();
		root.setPrefHeight(stage.getHeight());

		// Add the Table to the VBox
		root.getChildren().add(table);
		// Set the Padding and Border for the VBox
		root.setStyle("-fx-padding: 10;" +
				"-fx-border-style: solid inside;" +
				"-fx-border-width: 2;" +
				"-fx-border-insets: 5;" +
				"-fx-border-radius: 5;" +
				"-fx-border-color: blue;");

		// Create the Scene
		Scene scene = new Scene(root);
		// Add the Scene to the Stage
		stage.setScene(scene);
		// Set the Title of the Stage
		stage.setTitle("A simple TableView Example");
		// Display the Stage
		stage.show();
	}
}
