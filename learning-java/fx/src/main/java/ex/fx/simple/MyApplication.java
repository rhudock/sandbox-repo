package ex.fx.simple;

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
		BorderPane p = new BorderPane();
		Text t = new Text("Hello FX");
		t.setFont(Font.font("Arial", 60));
		t.setEffect(new DropShadow(2, 3, 3, Color.RED));
		p.setCenter(t);

		Button b = new Button("Push Me");
		// b.addEventHandler(MouseEvent.MOUSE_CLICKED, eventHandler);
		p.setBottom(b);

		primaryStage.setTitle("Simple Application");
		primaryStage.setScene(new Scene(p));
		primaryStage.show();
	}

	public static void main(String[] args) {
		Application.launch(args);
	}
}
