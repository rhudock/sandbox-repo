package ex.fx.component;

import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.VBox;
import javafx.stage.Modality;
import javafx.stage.Stage;

public class FxAlertBox {

	public static void displayMsg(String title, String msg) {
		Stage window = new Stage();
		window.initModality(Modality.APPLICATION_MODAL);
		window.setTitle(title);

		Label label = new Label(msg);
		Button btn = new Button("Close");
		btn.setOnAction(e -> window.close());

		VBox vLayout = new VBox(10);
		vLayout.getChildren().addAll(label, btn);
		vLayout.setAlignment(Pos.BASELINE_CENTER);

		Scene scene1 = new Scene(vLayout, 200, 200);
		window.setScene(scene1);
		window.showAndWait();
	}
}
