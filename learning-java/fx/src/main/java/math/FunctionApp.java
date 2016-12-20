package math;

import javafx.application.Application;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.scene.Group;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.paint.Color;
import javafx.scene.text.Text;
import javafx.stage.Stage;

public class FunctionApp extends Application {
    @Override
    public void start(Stage primaryStage) {

        primaryStage.setTitle("Function app");

        Group root = new Group();
        Scene scene = new Scene(root, 600, 300, Color.BISQUE);

        double y;

        //drawing axes
        for (int i = 0; i < 601; i++) {
            Text osx = new Text(i, 150, "-");
            root.getChildren().add(osx);
            Text osy = new Text(300, i, "|");
            root.getChildren().add(osy);
        }

        //drawing function
        double i = -10;
        while (i < 10) {

            //function to draw
            y = Math.sin(i);

            // *40 is making graph larger, increase or decrease
            Text txt = new Text(300 + i * 40, 150 - y * 40, "O");

            root.getChildren().add(txt);

            //precision. how dense is graph, smaller is denser
            i += 0.1;
        }

        Button btn = new Button();
        btn.setLayoutX((scene.getWidth() / 2) - 20);
        btn.setLayoutY((scene.getHeight() / 2) - 20);
        btn.setText("Invert");

        btn.setOnAction(new EventHandler<ActionEvent>() {

            @Override
            public void handle(ActionEvent event) {

            }
        });

        primaryStage.setScene(scene);
        primaryStage.show();

    }

    public static void main(String[] args) {
        launch(args);
    }
}