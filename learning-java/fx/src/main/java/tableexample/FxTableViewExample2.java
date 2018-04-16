package tableexample;

import javafx.application.Application;
import javafx.event.EventHandler;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableColumn.CellEditEvent;
import javafx.scene.control.TableView;
import javafx.scene.control.cell.TextFieldTableCell;
import javafx.scene.layout.HBox;
import javafx.stage.Stage;

public class FxTableViewExample2 extends Application
{
	public static void main(String[] args)
	{
		Application.launch(args);
	}

	@Override
	public void start(Stage stage)
	{
		// Create a TableView with a list of persons
		TableView<Person> table = new TableView<>(TableViewHelper.getPersonList());
		// Set the column resize policy to constrained resize policy
		table.setColumnResizePolicy(TableView.CONSTRAINED_RESIZE_POLICY);
		// Set the Placeholder for an empty table
		table.setPlaceholder(new Label("No visible columns and/or data exist."));
		// Make the TableView editable
		table.setEditable(true);

		// Add columns with appropriate editing features
		addIdColumn(table);
		addFirstNameColumn(table);
		addLastNameColumn(table);
		addStreetColumn(table);
		addZipCodeColumn(table);
		addCityColumn(table);
		addCountryColumn(table);
		addJobColumn(table);

		// Create the HBox
		HBox root = new HBox();
		// Add the Table to the BBox
		root.getChildren().add(table);
		// Set the Padding and Border for the HBox
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
		stage.setTitle("An editable TableView Example");
		// Display the Stage
		stage.show();
	}

	public void addIdColumn(TableView<Person> table)
	{
		// Id column is non-editable
		table.getColumns().add(TableViewHelper.getIdColumn());
	}

	public void addFirstNameColumn(TableView<Person> table)
	{
		// First Name is a String, editable column
		TableColumn<Person, String> firstNameCol = TableViewHelper.getFirstNameColumn();
		// Use a TextFieldTableCell, so it can be edited
		firstNameCol.setCellFactory(TextFieldTableCell.<Person>forTableColumn());

		// Set editing related event handlers (OnEditCommit)
		firstNameCol.setOnEditCommit(new EventHandler<CellEditEvent<Person, String>>()
	    {
            @Override
            public void handle(CellEditEvent<Person, String> t)
            {
                ((Person) t.getTableView().getItems().get(
                        t.getTablePosition().getRow())
                        ).setFirstName(t.getNewValue());
            }
	    });

		table.getColumns().add(firstNameCol);
	}

	public void addLastNameColumn(TableView<Person> table)
	{
		// Last Name is a String, editable column
		TableColumn<Person, String> lastNameCol = TableViewHelper.getLastNameColumn();
		// Use a TextFieldTableCell, so it can be edited
		lastNameCol.setCellFactory(TextFieldTableCell.<Person>forTableColumn());

		// Set editing related event handlers (OnEditCommit)
		lastNameCol.setOnEditCommit(new EventHandler<CellEditEvent<Person, String>>()
	    {
            @Override
            public void handle(CellEditEvent<Person, String> t)
            {
                ((Person) t.getTableView().getItems().get(
                        t.getTablePosition().getRow())
                        ).setLastName(t.getNewValue());
            }
	    });

		table.getColumns().add(lastNameCol);
	}

	public void addStreetColumn(TableView<Person> table)
	{
		// Street is a String, editable column
		TableColumn<Person, String> streetCol = TableViewHelper.getStreetColumn();
		// Use a TextFieldTableCell, so it can be edited
		streetCol.setCellFactory(TextFieldTableCell.<Person>forTableColumn());

		// Set editing related event handlers (OnEditCommit)
		streetCol.setOnEditCommit(new EventHandler<CellEditEvent<Person, String>>()
	    {
            @Override
            public void handle(CellEditEvent<Person, String> t)
            {
                ((Person) t.getTableView().getItems().get(
                        t.getTablePosition().getRow())
                        ).setStreet(t.getNewValue());
            }
	    });

		table.getColumns().add(streetCol);
	}

	public void addZipCodeColumn(TableView<Person> table)
	{
		// Zip Code is a String, editable column
		TableColumn<Person, String> zipCodeCol = TableViewHelper.getZipCodeColumn();
		// Use a TextFieldTableCell, so it can be edited
		zipCodeCol.setCellFactory(TextFieldTableCell.<Person>forTableColumn());

		// Set editing related event handlers (OnEditCommit)
		zipCodeCol.setOnEditCommit(new EventHandler<CellEditEvent<Person, String>>()
	    {
            @Override
            public void handle(CellEditEvent<Person, String> t)
            {
                ((Person) t.getTableView().getItems().get(
                        t.getTablePosition().getRow())
                        ).setZipCode(t.getNewValue());
            }
	    });

		table.getColumns().add(zipCodeCol);
	}

	public void addCityColumn(TableView<Person> table)
	{
		// City is a String, editable column
		TableColumn<Person, String> cityCol = TableViewHelper.getCityColumn();
		// Use a TextFieldTableCell, so it can be edited
		cityCol.setCellFactory(TextFieldTableCell.<Person>forTableColumn());

		// Set editing related event handlers (OnEditCommit)
		cityCol.setOnEditCommit(new EventHandler<CellEditEvent<Person, String>>()
	    {
            @Override
            public void handle(CellEditEvent<Person, String> t)
            {
                ((Person) t.getTableView().getItems().get(
                        t.getTablePosition().getRow())
                        ).setCity(t.getNewValue());
            }
	    });

		table.getColumns().add(cityCol);
	}

	public void addCountryColumn(TableView<Person> table)
	{
		// Country is a String, editable column
		TableColumn<Person, String> countryCol = TableViewHelper.getCountryColumn();
		// Use a TextFieldTableCell, so it can be edited
		countryCol.setCellFactory(TextFieldTableCell.<Person>forTableColumn());

		// Set editing related event handlers (OnEditCommit)
		countryCol.setOnEditCommit(new EventHandler<CellEditEvent<Person, String>>()
	    {
            @Override
            public void handle(CellEditEvent<Person, String> t)
            {
                ((Person) t.getTableView().getItems().get(
                        t.getTablePosition().getRow())
                        ).setCountry(t.getNewValue());
            }
	    });

		table.getColumns().add(countryCol);
	}

	public void addJobColumn(TableView<Person> table)
	{
		// Job is a String, editable column
		TableColumn<Person, String> jobCol = new TableColumn<>("Job");
		// Use a TextFieldTableCell, so it can be edited
		jobCol.setCellFactory(TextFieldTableCell.<Person>forTableColumn());

		// Set editing related event handlers (OnEditCommit)
		jobCol.setOnEditCommit(new EventHandler<CellEditEvent<Person, String>>()
	    {
            @Override
            public void handle(CellEditEvent<Person, String> t)
            {
                ((Person) t.getTableView().getItems().get(
                        t.getTablePosition().getRow())
                        ).setJob(t.getNewValue());
            }
	    });

		table.getColumns().add(jobCol);
	}
}
