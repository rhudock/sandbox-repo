package tableexample;

import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.scene.control.TableColumn;
import javafx.scene.control.cell.PropertyValueFactory;

import java.util.Arrays;
import java.util.List;
import java.util.Random;

public class TableViewHelper
{
	// Returns an observable list of persons
	public static ObservableList<Person> getPersonList()
	{
		List<String> nameList = Arrays.asList("Mark", "Tom", "David", "Mary", "Martha", "Henry");
		List<String> lastNameList = Arrays.asList("Pearson", "Hoover", "Mason", "Miller", "Lancester", "Forsyth");
		List<String> streetList = Arrays.asList("First Avenue 2", "Kings Cross 3", "Bond Street 5", "Baker Street 86", "Main Street 375", "Main Street 3");
		List<String> zipList = Arrays.asList("1200", "2350", "1100", "1200", "9923", "37472");
		List<String> cityList = Arrays.asList("Los Angeles", "Denver", "Manchester", "London", "Sidney", "Toronto");
		List<String> countryList = Arrays.asList("USA", "USA", "Great Britain", "Great Britain", "Australia", "Canada");

		ObservableList<Person> persons = FXCollections.<Person>observableArrayList();

		for(int i = 0; i < 1000; i ++) {
			persons.add(new Person(i, nameList.get(getRandomNumberInRange(0, nameList.size() -1)),
					lastNameList.get(getRandomNumberInRange(0, nameList.size() -1)),
					streetList.get(getRandomNumberInRange(0, nameList.size() -1)),
					zipList.get(getRandomNumberInRange(0, nameList.size() -1)),
					cityList.get(getRandomNumberInRange(0, nameList.size() -1)),
					countryList.get(getRandomNumberInRange(0, nameList.size() -1))
					)
			);
		}

return persons;

//		return FXCollections.<Person>observableArrayList(p1, p2, p3, p4, p5, p6);
	}

	/**
	 * https://www.mkyong.com/java/java-generate-random-integers-in-a-range/
	 */
	public static int getRandomNumberInRange(int min, int max) {

		if (min >= max) {
			throw new IllegalArgumentException("max must be greater than min");
		}

		Random r = new Random();
		return r.nextInt((max - min) + 1) + min;
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
