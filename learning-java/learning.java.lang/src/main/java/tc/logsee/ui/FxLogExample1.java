package tc.logsee.ui;
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.control.TableView;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;
import tc.logsee.model.LogLine;

public class FxLogExample1 extends Application
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
        TableView<LogLine> table = new TableView<>();
        // Add rows to the TableView
        table.getItems().addAll(TableViewHelper.getLogLineList());
        // Add columns to the TableView
        table.getColumns().addAll(TableViewHelper.getTimeColumn(), TableViewHelper.getLogLevelColumn(),
                TableViewHelper.getClazzColumn(),TableViewHelper.getLogColumn(),
                TableViewHelper.getLogLineColumn());

        // Set the column resize policy to constrained resize policy
        table.setColumnResizePolicy(TableView.CONSTRAINED_RESIZE_POLICY);
        // Set the Placeholder for an empty table
        table.setPlaceholder(new Label("No visible columns and/or data exist."));

        // Create the VBox
        VBox root = new VBox();
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