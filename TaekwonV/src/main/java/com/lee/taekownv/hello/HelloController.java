package com.lee.taekownv.hello;

import javafx.fxml.FXML;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class HelloController
{
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @FXML private TextField firstNameField;
    @FXML private TextField lastNameField;
    @FXML private Label messageLabel;

    public void sayHello() {

        String firstName = firstNameField.getText();
        String lastName = lastNameField.getText();

        StringBuilder builder = new StringBuilder();

        if (!StringUtils.isEmpty(firstName)) {
            builder.append(firstName);
        }

        if (!StringUtils.isEmpty(lastName)) {
            if (builder.length() > 0) {
                builder.append(" ");
            }
            builder.append(lastName);
        }

        if (builder.length() > 0) {
            String name = builder.toString();
            logger.debug("Saying hello to " + name);
            messageLabel.setText("Hello " + name);
        } else {
            logger.debug("Neither first name nor last name was set, saying hello to anonymous person");
            messageLabel.setText("Hello mysterious person");
        }
    }

}
