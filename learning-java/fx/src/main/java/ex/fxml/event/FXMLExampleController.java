package ex.fxml.event;


import javafx.scene.control.TextField;
import javafx.scene.image.ImageView;
import javafx.event.ActionEvent;
import javafx.scene.input.MouseEvent;
import javafx.fxml.FXML;
import javafx.scene.text.Text;
 
public class FXMLExampleController {
    @FXML private Text actiontarget;
    @FXML private Text welcometext;
    @FXML private ImageView myImageB;
    @FXML private TextField userName;
    
	/**
	 * Initializes the controller class. This method is automatically called
	 * after the fxml file has been loaded.
	 */
	@FXML
	private void initialize() {
	userName.textProperty().addListener((observable, oldValue, newValue) -> {
	    System.out.println("textfield changed from " + oldValue + " to " + newValue);
	});
	}
    
    @FXML protected void handleSubmitButtonAction(ActionEvent event) {
        actiontarget.setText("Sign in button pressed");
    }
    
    @FXML protected void handleUserLabelAction(MouseEvent event) {
    	welcometext.setText("Sign in label pressed");
    }

    @FXML protected void onMouseEnteredHandler(MouseEvent event) {
    	myImageB.setVisible(false);
    }
    
    @FXML protected void onMouseExitedHandler(MouseEvent event) {
    	myImageB.setVisible(true);
    }
}
