package com.lee.apps.map;

import com.google.common.io.Resources;
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;


public class DirectionsApiMainApp extends Application {

    @Override
    public void start(Stage stage) throws Exception {
        Parent root = FXMLLoader.load(getClass().getResource("/fxml/apps/map/Scene.fxml"));
       // or // Parent root = FXMLLoader.load(Resources.getResource("fxml/apps/map/Scene.fxml"));

        Scene scene = new Scene(root);
        scene.getStylesheets().add("/fxml/apps/map/Styles.css");
        
        stage.setTitle("Directions API Example");
        stage.setScene(scene);
        stage.show();
    }

    /**
     * The main() method is ignored in correctly deployed JavaFX application.
     * main() serves only as fallback in case the application can not be
     * launched through deployment artifacts, e.g., in IDEs with limited FX
     * support. NetBeans ignores main().
     *
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        launch(args);
    }

}
