package lee.jinni;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.effect.DropShadow;
import javafx.scene.layout.BorderPane;
import javafx.scene.paint.Color;
import javafx.scene.text.Font;
import javafx.scene.text.Text;
import javafx.stage.Stage;

public class MyApplication extends Application {

	@Override
	public void start(Stage primaryStage) {
		DigitalClock p = new DigitalClock();

		p.play();
		primaryStage.setTitle("Digital Clock");
		primaryStage.setScene(new Scene(p));
		primaryStage.show();
	}

	public static void main(String[] args) {
		Application.launch(args);
	}
}
