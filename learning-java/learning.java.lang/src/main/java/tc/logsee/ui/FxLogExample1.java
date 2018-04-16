package tc.logsee.ui;

import javafx.application.Application;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TableCell;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import javafx.scene.text.Text;
import javafx.stage.FileChooser;
import javafx.stage.Stage;
import org.controlsfx.control.table.TableFilter;
import tc.logsee.model.LogLine;

import javax.swing.filechooser.FileSystemView;
import java.io.File;

public class FxLogExample1 extends Application {
    public static void main(String[] args) {
        Application.launch(args);
    }

    private static String lastVisitedDirectory = System.getProperty("user.home");
    private TableFilter filter;
    // Define the Text Fields
    private final TextField firstNameField = new TextField();
    private final TextField lastNameField = new TextField();
    private final TextField streetField = new TextField();
    private final TextArea zipCodeField = new TextArea();
    private final TextField cityField = new TextField();

    private TableView<LogLine> table = new TableView<>();

    private GridPane pane = new GridPane();

    @SuppressWarnings("unchecked")
    @Override
    public void start(Stage stage) {
        BorderPane border = new BorderPane();

        // Create a TableView with a list of persons
        // Add rows to the TableView
        ObservableList<LogLine> myData = FXCollections.observableArrayList();
        ObservableList<LogLine> tableDataList = TableViewHelper.getLogLineList();
        myData.addAll(tableDataList);
        table.setItems(myData);

        TableColumn<LogLine, String> nameColumn = TableViewHelper.getLogLevelColumn();

        nameColumn.setCellFactory(column -> {
            return new TableCell<LogLine, String>() {
                @Override
                protected void updateItem(String item, boolean empty) {
                    super.updateItem(item, empty); //This is mandatory

                    if (item == null || empty) { //If the cell is empty
                        setText(null);
                        setStyle("");
                    } else { //If the cell is not empty

                        setText(item); //Put the String data in the cell

                        //We get here all the info of the Person of this row
                        LogLine auxPerson = getTableView().getItems().get(getIndex());

                        // Style all persons wich name is "Edgard"
                        if (auxPerson.getLogLevel().equals("INFO")) {
                            setTextFill(Color.RED); //The text in red
                            setStyle("-fx-background-color: yellow"); //The background of the cell in yellow
                        } else {
                            //Here I see if the row of this cell is selected or not
                            if (getTableView().getSelectionModel().getSelectedItems().contains(auxPerson))
                                setTextFill(Color.WHITE);
                            else
                                setTextFill(Color.BLACK);
                        }
                    }
                }
            };
        });

        // Add columns to the TableView
        table.getColumns().addAll(TableViewHelper.getTimeColumn(), nameColumn,
                TableViewHelper.getClazzColumn(), TableViewHelper.getLogColumn());


        // Set the column resize policy to constrained resize policy
//        table.setColumnResizePolicy(TableView.CONSTRAINED_RESIZE_POLICY);

        autoResizeColumns(table);
        // Set the Placeholder for an empty table
        table.setPlaceholder(new Label("No visible columns and/or data exist."));

        table.prefHeightProperty().bind(stage.heightProperty());

        table.getSelectionModel().selectedItemProperty().addListener((obs, oldSelection, newSelection) -> {
            if (newSelection != null) {
                detailPerson(newSelection);
            }
        });

        // Create the VBox
        VBox tableVBox = new VBox();
        // Add the Table to the VBox
        tableVBox.getChildren().add(table);
        // Set the Padding and Border for the VBox
        tableVBox.setStyle("-fx-padding: 10;" +
                "-fx-border-style: solid inside;" +
                "-fx-border-width: 2;" +
                "-fx-border-insets: 5;" +
                "-fx-border-radius: 5;" +
                "-fx-border-color: blue;");

        HBox hpane = new HBox();

        Button b = new Button("Read log file");
        // File selectedFile;
        // b.addEventHandler(MouseEvent.MOUSE_CLICKED, eventHandler);

        b.addEventHandler(MouseEvent.MOUSE_CLICKED, (e) -> {
            File initialDir = FileSystemView.getFileSystemView().getDefaultDirectory();
            ///System.out.println("initialDir = " + initialDir);
            FileChooser fileChooser = new FileChooser();
            fileChooser.setTitle("Select Log file");
            fileChooser.setInitialDirectory(new File(lastVisitedDirectory));
            // fileChooser.setInitialDirectory(initialDir);
            fileChooser.getExtensionFilters().addAll(
                    new FileChooser.ExtensionFilter("Log Files", "*.log"),
                    new FileChooser.ExtensionFilter("Text Files", "*.txt"),
                    new FileChooser.ExtensionFilter("All Files", "*.*"));

            File selectedFile = fileChooser.showOpenDialog(stage);
            if (selectedFile != null) {
                // Keep the last selected folder  {@link https://stackoverflow.com/questions/36920131/can-a-javafx-filechooser-remember-the-last-directory-it-opened }
                // lastVisitedDir=(files!=null && files.size()>=1)?files.get(0).getParent():System.getProperty("user.home");
                FxLogExample1.lastVisitedDirectory = selectedFile.getParent();
                // tableDataList.addAll(TableViewHelper.getLogLineList(selectedFile));
                table.setItems(TableViewHelper.getLogLineList(selectedFile));
                table.refresh();
                filter = new TableFilter(table);
            }
        });


        Button bHideDetail = new Button("HideDetail");
        bHideDetail.addEventHandler(MouseEvent.MOUSE_CLICKED, (e) -> {
            double newHeight = tableVBox.getHeight() + pane.getHeight();
            pane.setVisible(false);
            tableVBox.prefHeight(newHeight);
        });


        Button bClose = new Button("Close");

        bClose.addEventHandler(MouseEvent.MOUSE_CLICKED, (e) -> {
            stage.close();
        });
        hpane.getChildren().addAll(b, bHideDetail, bClose);

        hpane.setStyle("-fx-padding: 10;" +
                "-fx-border-style: solid inside;" +
                "-fx-border-width: 2;" +
                "-fx-border-insets: 5;" +
                "-fx-border-radius: 5;" +
                "-fx-border-color: yellow;");

        border.setTop(hpane);


        border.setCenter(tableVBox);

        border.setBottom(getNewPersonDataPane());

        border.minHeight(300);
        border.minWidth(400);

        // Create the Scene
        Scene scene = new Scene(border, 1500, 500);
        // Add the Scene to the Stage
        stage.setScene(scene);
        // Set the Title of the Stage
        stage.setTitle("A simple TableView Example");

        // https://stackoverflow.com/questions/38216268/how-to-listen-resize-event-of-stage-in-javafx
        stage.widthProperty().addListener((obs, oldVal, newVal) -> {
            // Do whatever you want
        });

        stage.heightProperty().addListener((obs, oldVal, newVal) -> {
            table.prefHeightProperty().bind(stage.heightProperty());
            double stageWidth = stage.getWidth();
            zipCodeField.setPrefWidth(stageWidth - 100);

        });
        // Display the Stage
        stage.show();
    }


    public GridPane getNewPersonDataPane() {
        // Create the GridPane


        // Set the hgap and vgap properties
        pane.setHgap(10);
        pane.setVgap(5);

        // Add the TextFields to the Pane
        pane.addRow(0, new Label("Time:"), firstNameField);
        pane.addRow(1, new Label("Level:"), lastNameField);
        pane.addRow(2, new Label("Class:"), streetField);
        pane.addRow(3, new Label("Log:"), zipCodeField);
        pane.addRow(4, new Label("Log line as is:"), cityField);

        zipCodeField.setPrefHeight(150);
        zipCodeField.setWrapText(true);

        pane.setStyle("-fx-padding: 10;" +
                "-fx-border-style: solid inside;" +
                "-fx-border-width: 2;" +
                "-fx-border-insets: 5;" +
                "-fx-border-radius: 5;" +
                "-fx-border-color: green;");

        return pane;
    }

    public void detailPerson(LogLine selectedLog) {
        // Clear the Input Fields
        firstNameField.setText(selectedLog.getTime().toString());
        lastNameField.setText(selectedLog.getLogLevel());
        streetField.setText(selectedLog.getClazz());
        zipCodeField.setText(selectedLog.getLog());
        cityField.setText(selectedLog.getLogLineStr());
        pane.setVisible(true);
    }

    public static void autoResizeColumns(TableView<?> table) {
        //Set the right policy
        table.setColumnResizePolicy(TableView.UNCONSTRAINED_RESIZE_POLICY);
        table.getColumns().stream().forEach((column) ->
        {
            //Minimal width = columnheader
            Text t = new Text(column.getText());
            double max = t.getLayoutBounds().getWidth();
            for (int i = 0; i < table.getItems().size(); i++) {
                //cell must not be empty
                if (column.getCellData(i) != null) {
                    t = new Text(column.getCellData(i).toString());
                    double calcwidth = t.getLayoutBounds().getWidth();
                    //remember new max-width
                    if (calcwidth > max) {
                        max = calcwidth;
                    }
                }
            }
            //set the new max-widht with some extra space
            column.setPrefWidth(max + 10.0d);
        });
    }
}