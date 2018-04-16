package tableexample;

import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.scene.control.TableColumn;
import javafx.scene.control.cell.PropertyValueFactory;

public class TableViewHelper
{
	// Returns an observable list of persons
	public static ObservableList<Person> getPersonList()
	{
		Person p1 = new Person(1,"Mark","Pearson","First Avenue 2","1200","Los Angeles","USA");
		Person p2 = new Person(2,"Tom","Hoover","Kings Cross 3","2350","Denver","USA");
		Person p3 = new Person(3,"David","Mason","Bond Street 5","1100","Manchester","Great Britain");
		Person p4 = new Person(4,"Mary","Miller","Baker Street 86","1200","London","Great Britain");
		Person p5 = new Person(5,"Martha","Lancester","Main Street 375","9923","Sidney","Australia");
		Person p6 = new Person(6,"Henry","Forsyth","Main Street 3","37472","Toronto","Canada");

		return FXCollections.<Person>observableArrayList(p1, p2, p3, p4, p5, p6);
	}

	// Returns Person Id TableColumn
	public static TableColumn<Person, Integer> getIdColumn()
	{
		TableColumn<Person, Integer> idCol = new TableColumn<>("Id");
		PropertyValueFactory<Person, Integer> idCellValueFactory = new PropertyValueFactory<>("id");
		idCol.setCellValueFactory(idCellValueFactory);
		return idCol;
	}

	// Returns First Name TableColumn
	public static TableColumn<Person, String> getFirstNameColumn()
	{
		TableColumn<Person, String> firstNameCol = new TableColumn<>("First Name");
		PropertyValueFactory<Person, String> firstNameCellValueFactory = new PropertyValueFactory<>("firstName");
		firstNameCol.setCellValueFactory(firstNameCellValueFactory);
		return firstNameCol;
	}

	// Returns Last Name TableColumn
	public static TableColumn<Person, String> getLastNameColumn()
	{
		TableColumn<Person, String> lastNameCol = new TableColumn<>("Last Name");
		PropertyValueFactory<Person, String> lastNameCellValueFactory = new PropertyValueFactory<>("lastName");
		lastNameCol.setCellValueFactory(lastNameCellValueFactory);
		return lastNameCol;
	}

	// Returns Street TableColumn
	public static TableColumn<Person, String> getStreetColumn()
	{
		TableColumn<Person, String> streetCol = new TableColumn<>("Street");
		PropertyValueFactory<Person, String> streetCellValueFactory = new PropertyValueFactory<>("street");
		streetCol.setCellValueFactory(streetCellValueFactory);
		return streetCol;
	}

	// Returns ZipCode TableColumn
	public static TableColumn<Person, String> getZipCodeColumn()
	{
		TableColumn<Person, String> zipCodeCol = new TableColumn<>("Zip Code");
		PropertyValueFactory<Person, String> zipCodeCellValueFactory = new PropertyValueFactory<>("zipCode");
		zipCodeCol.setCellValueFactory(zipCodeCellValueFactory);
		return zipCodeCol;
	}

	// Returns City TableColumn
	public static TableColumn<Person, String> getCityColumn()
	{
		TableColumn<Person, String> cityCol = new TableColumn<>("City");
		PropertyValueFactory<Person, String> cityCellValueFactory = new PropertyValueFactory<>("city");
		cityCol.setCellValueFactory(cityCellValueFactory);
		return cityCol;
	}

	// Returns Country TableColumn
	public static TableColumn<Person, String> getCountryColumn()
	{
		TableColumn<Person, String> countryCol = new TableColumn<>("Country");
		PropertyValueFactory<Person, String> countryCellValueFactory = new PropertyValueFactory<>("country");
		countryCol.setCellValueFactory(countryCellValueFactory);
		return countryCol;
	}

}
