package tableexample;

import javafx.application.Application;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.SelectionMode;
import javafx.scene.control.TableView;
import javafx.scene.control.TableView.TableViewSelectionModel;
import javafx.scene.control.TextField;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;
import java.util.Arrays;

public class FxTableViewExample3 extends Application
{
	// Define the Text Fields
	private final TextField firstNameField = new TextField();
	private final TextField lastNameField = new TextField();
	private final TextField streetField = new TextField();
	private final TextField zipCodeField = new TextField();
	private final TextField cityField = new TextField();
	private final TextField countryField = new TextField();

	// Create the TableView
	TableView<Person> table = new TableView<>(TableViewHelper.getPersonList());

	public static void main(String[] args)
	{
		Application.launch(args);
	}

	@SuppressWarnings("unchecked")
	@Override
	public void start(Stage stage)
	{
		// Turn on multi-row selection for the TableView
		TableViewSelectionModel<Person> tsm = table.getSelectionModel();
		tsm.setSelectionMode(SelectionMode.MULTIPLE);

		// Add columns to the TableView
		table.getColumns().addAll(TableViewHelper.getIdColumn(), TableViewHelper.getFirstNameColumn(),
				TableViewHelper.getLastNameColumn(),TableViewHelper.getStreetColumn(),
				TableViewHelper.getZipCodeColumn(), TableViewHelper.getCityColumn(), TableViewHelper.getCountryColumn());

		// Set the column resize policy to constrained resize policy
		table.setColumnResizePolicy(TableView.CONSTRAINED_RESIZE_POLICY);
		// Set the Placeholder for an empty table
		table.setPlaceholder(new Label("No visible columns and/or data exist."));

		// Create the GridPane
		GridPane newDataPane = this.getNewPersonDataPane();

		// Create the Delete Button and add Event-Handler
		Button deleteButton = new Button("Delete Selected Rows");
		deleteButton.setOnAction(new EventHandler<ActionEvent>()
		{
            @Override public void handle(ActionEvent e)
            {
                deletePerson();
            }
        });

		// Create the VBox
		VBox root = new VBox();
		// Add the GridPane and the Delete Button to the VBox
		root.getChildren().addAll(newDataPane, deleteButton, table);

		// Set the Padding and Border for the VBox
		root.setSpacing(5);
		// Set the Spacing and Border for the VBox
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
		stage.setTitle("Adding/Deleting Rows in a TableViews");
		// Display the Stage
		stage.show();
	}

	public GridPane getNewPersonDataPane()
	{
		// Create the GridPane
		GridPane pane = new GridPane();

		// Set the hgap and vgap properties
		pane.setHgap(10);
		pane.setVgap(5);

		// Add the TextFields to the Pane
		pane.addRow(0, new Label("First Name:"), firstNameField);
		pane.addRow(1, new Label("Last Name:"), lastNameField);
		pane.addRow(2, new Label("Street:"), streetField);
		pane.addRow(3, new Label("Zip Code:"), zipCodeField);
		pane.addRow(4, new Label("City:"), cityField);
		pane.addRow(5, new Label("Country:"), countryField);

		// Create the Add Button and add Event-Handler
		Button addButton = new Button("Add");
		addButton.setOnAction(new EventHandler<ActionEvent>()
		{
            @Override public void handle(ActionEvent e)
            {
                addPerson();
            }
        });

		// Add the Add Button to the GridPane
		pane.add(addButton, 2, 0);

		return pane;
	}

	public void addPerson()
	{
		Integer currentId = 0;

		// Get the next ID
		for(Person p : table.getItems())
		{
			if(p.getId()>currentId)
			{
				currentId = p.getId();
			}
		}

		// Create a new Person Object
		Person person = new Person(currentId+1,firstNameField.getText(),lastNameField.getText(),streetField.getText(),
			zipCodeField.getText(),cityField.getText(),countryField.getText());

		// Add the new Person to the table
		table.getItems().add(person);

		// Clear the Input Fields
		firstNameField.setText(null);
		lastNameField.setText(null);
		streetField.setText(null);
		zipCodeField.setText(null);
		cityField.setText(null);
		countryField.setText(null);
	}

	public void deletePerson()
	{
		TableViewSelectionModel<Person> tsm = table.getSelectionModel();

		// Check, if any rows are selected
		if (tsm.isEmpty())
		{
			System.out.println("Please select a row to delete.");
			return;
		}

		// Get all selected row indices in an array
		ObservableList<Integer> list = tsm.getSelectedIndices();

		Integer[] selectedIndices = new Integer[list.size()];
		selectedIndices = list.toArray(selectedIndices);

		// Sort the array
		Arrays.sort(selectedIndices);

		// Delete rows (last to first)
		for(int i = selectedIndices.length - 1; i >= 0; i--)
		{
			tsm.clearSelection(selectedIndices[i].intValue());
			table.getItems().remove(selectedIndices[i].intValue());
		}
	}
}
