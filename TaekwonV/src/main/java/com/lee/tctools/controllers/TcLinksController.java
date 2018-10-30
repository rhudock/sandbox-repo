// SayHelloController.java
package com.lee.tctools.controllers;

import com.lee.tctools.domain.Person;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.control.TextField;
import javafx.scene.layout.VBox;

import javafx.scene.control.TableView;
import java.util.ResourceBundle;

/*
http://stackoverflow.com/questions/15004365/javafx-2-2-fxinclude-how-to-access-parent-controller-from-child-controller
https://docs.oracle.com/javafx/2/ui_controls/table-view.htm
 */
public class TcLinksController {

    @FXML
    private VBox childVBox;

    @FXML
    private TextField txtFirstName;

    @FXML
    private TextField txtLastName;

    @FXML
    private TextField txtEmail;

    @FXML
    private Button btnPeopleAdd;

    @FXML
    private TableView<Person> tblPeople;

    private ObservableList<Person> data;

    @FXML
    private ResourceBundle resources;

    // Add a public no-args construtcor explicitly just to
    // emphasize that it is needed for a controller
    public TcLinksController() {
    }

    @FXML
    private void initialize() {
        System.out.println("Initializing ChildController...");

        data =
        FXCollections.observableArrayList(
                new Person("Jacob", "Smith", "jacob.smith@example.com"),
                new Person("Isabella", "Johnson", "isabella.johnson@example.com"),
                new Person("Ethan", "Williams", "ethan.williams@example.com"),
                new Person("Emma", "Jones", "emma.jones@example.com"),
                new Person("Michael", "Brown", "michael.brown@example.com"),
                new Person("Michael2", "Brown", "michael.brown@example.com")
        );
        tblPeople.setItems(data);
    }

    @FXML
    private void addPeople() {
        data.add(new Person(
                txtFirstName.getText(),
                txtLastName.getText(),
                txtEmail.getText()
        ));
        txtFirstName.clear();
        txtLastName.clear();
        txtEmail.clear();
    }
}
