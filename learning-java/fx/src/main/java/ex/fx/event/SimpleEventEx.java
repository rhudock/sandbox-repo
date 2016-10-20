package ex.fx.event;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.effect.DropShadow;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.HBox;
import javafx.scene.paint.Color;
import javafx.scene.text.Font;
import javafx.scene.text.Text;
import javafx.stage.Stage;

public class SimpleEventEx extends Application {

	@Override
	public void start(Stage primaryStage) {
		BorderPane p = new BorderPane();
		Text t = new Text("Cobrowse Monitor");
		t.setFont(Font.font("Arial", 60));
		t.setEffect(new DropShadow(2, 3, 3, Color.RED));
		p.setTop(t);

		HBox hpane = new HBox();
		Button b = new Button("Start SumoLogic Log process");
		// b.addEventHandler(MouseEvent.MOUSE_CLICKED, eventHandler);
		b.setOnAction((e) -> {
			if (e.getEventType().equals(MouseEvent.MOUSE_CLICKED)) {
				// Do Something
			}
		});

		Button bClose = new Button("Close");
		
		bClose.addEventHandler(MouseEvent.MOUSE_CLICKED, (e) -> {
			primaryStage.close();
		});
		hpane.getChildren().addAll(b, bClose);

		p.setBottom(hpane);
		
		primaryStage.setTitle("Cobrowse Monitor");
		primaryStage.setScene(new Scene(p));
		primaryStage.show();
	}

	public static void main(String[] args) {
		Application.launch(args);
	}
}
