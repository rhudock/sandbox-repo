// SayHelloController.java
package com.lee.taekownv;

import com.lee.TaekwonVMainApp;
import javafx.fxml.FXML;
import javafx.scene.control.MenuItem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ResourceBundle;

/*
http://stackoverflow.com/questions/15004365/javafx-2-2-fxinclude-how-to-access-parent-controller-from-child-controller
 */
public class TakwonVMainController {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private static final String TC_LINK_VIEW = "tcLinkView";

    @FXML
    private MenuItem mMSimple;

    @FXML
    private MenuItem mMBrowser;

    @FXML
    private ResourceBundle resources;

    // Add a public no-args construtcor explicitly just to
    // emphasize that it is needed for a controller
    public TakwonVMainController() {
    }

    @FXML
    private void initialize() {
        System.out.println("Initializing TakwonVMainController...");
    }

    @FXML
    private void onMmCloseAction() {
        System.out.println("Close Menu is clicked");
    }

    @FXML
    private void onHelloTkvAction() {
        TaekwonVMainApp.selectFxml("helloTkv");
        System.out.println("Simple Menu is clicked");
    }

    @FXML
    private void onMenuTcTest() {
        TaekwonVMainApp.selectFxml("childSayHello");
        System.out.println("Simple Menu is clicked");
    }

    @FXML
    private void onMmBrowserAction() {
        TaekwonVMainApp.selectFxml("browser");
        System.out.println("browser Menu is clicked");
    }

    @FXML
    private void onMenuTcLinksClick() {
        TaekwonVMainApp.selectFxml(TC_LINK_VIEW);
        logger.info("Open {}", TC_LINK_VIEW);
    }

    @FXML
    private void onMenuGMapFXClick() {
        TaekwonVMainApp.selectFxml("gMapFXPane");
        logger.info("Open {}", "gMapFXPane");
    }
}
