package ex.fx.component;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

public class ExMain extends Application {
	private Scene scene1, scene2;

	public static void main(String[] args) {
		launch(args);
	}

	@Override
	public void start(Stage primaryStage) throws Exception {
	
		primaryStage.setTitle("CobMonitor Home");

		Button btnSmall = new Button();
		btnSmall.setText("click me");
		btnSmall.setOnAction(e -> { System.out.println("hello"); });
		
		Button btnBig = new Button();
		btnBig.setText("I am big");
		btnBig.setOnAction(e -> primaryStage.setScene(scene2));

		StackPane layout = new StackPane();
		layout.getChildren().add(btnSmall);
		layout.getChildren().add(btnBig);

		scene1 = new Scene(layout, 100, 100);
		
		// scene 2
		Label label1 = new Label("Hello there");
		Button btn2 = new Button("Goto second");
		btn2.setOnAction(e -> primaryStage.setScene(scene1));
		Button btn3 = new Button("Open Alert");
		btn3.setOnAction(e -> FxAlertBox.displayMsg("alert test", "this is a message"));
		VBox vbox = new VBox(20);
		vbox.getChildren().addAll(label1, btn2, btn3);
		
		scene2 = new Scene(vbox, 400, 400);

		
		
		primaryStage.setScene(scene2);
		primaryStage.show();
	}

}
