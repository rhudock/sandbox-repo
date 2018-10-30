package com.lee;

import javafx.application.Application;
import javafx.beans.value.ChangeListener;
import javafx.collections.ObservableList;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import javafx.stage.Stage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.URL;

public class TaekwonVMainApp extends Application {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    public static void main(String[] args) {
        Application.launch(args);
    }

    private static TaekwonVMainApp instance;

    public TaekwonVMainApp() {
        instance = this;
    }

    // static method to get instance of view
    public static TaekwonVMainApp getInstance() {
        return instance;
    }

    private VBox root;

    @Override
    public void start(Stage stage) throws IOException {
        stage.setTitle("Taekwon V");

        Scene scene = new Scene(new VBox(), 650, 550);
        scene.setFill(Color.OLDLACE);

        // Construct a URL for the FXML document
        String stringUrl = "fxml/taekwonvmain.fxml";
        URL fxmlUrl = this.getClass()
                .getClassLoader()
                .getResource(stringUrl);

        root = FXMLLoader.<VBox>load(fxmlUrl);
        ((VBox) scene.getRoot()).getChildren().addAll(root);
        stage.setScene(scene);

        // Windows change event.
        // https://stackoverflow.com/questions/38216268/how-to-listen-resize-event-of-stage-in-javafx
        ChangeListener<Number> stageSizeListener = (observable, oldValue, newValue) -> {
            System.out.println("Height: " + stage.getHeight() + " Width: " + stage.getWidth());

            getRoot().setPrefWidth(stage.getWidth());
            getRoot().setMinWidth(stage.getWidth());

            // Menu button
            VBox topMain = (VBox) getRoot().getChildren().get(0);
            topMain.setMinWidth(stage.getWidth());

            // Main Window
            ((StackPane) getRoot().getChildren().get(1)).setMinWidth(stage.getWidth());
            ((StackPane) getRoot().getChildren().get(1)).setMinHeight(stage.getHeight() - topMain.getHeight() - 20);
        };

        stage.widthProperty().addListener(stageSizeListener);
        stage.heightProperty().addListener(stageSizeListener);

        // show default
        TaekwonVMainApp.selectFxml("helloTkv");

        stage.show();
    }

    public VBox getRoot() {
        return root;
    }

    private static Node currentNode;

    public static void selectFxml(String fxmlId) {
        ObservableList<Node> children = instance.getRoot().getChildren();

        for (Node no : children) {
            if (no instanceof StackPane) {
                ObservableList<Node> gChildren = ((StackPane) no).getChildren();
                for (Node node : gChildren) {
                    if (node.getId().equals(fxmlId)) {
                        node.setVisible(true);
                        currentNode = node;
                    } else {
                        node.setVisible(false);
                    }
                }
            }
        }
    }

}
