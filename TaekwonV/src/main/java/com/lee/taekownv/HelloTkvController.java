// SayHelloController.java
package com.lee.taekownv;

import com.lee.date.CurrentTime;
import javafx.beans.property.IntegerProperty;
import javafx.beans.property.SimpleIntegerProperty;
import javafx.concurrent.ScheduledService;
import javafx.concurrent.Task;
import javafx.concurrent.WorkerStateEvent;
import javafx.event.EventHandler;
import javafx.fxml.FXML;
import javafx.scene.Scene;
import javafx.scene.control.ChoiceBox;
import javafx.scene.control.Label;
import javafx.scene.control.ProgressBar;
import javafx.scene.control.Slider;
import javafx.scene.web.WebView;
import javafx.stage.Stage;
import javafx.util.Duration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;
import java.util.concurrent.atomic.AtomicInteger;

public class HelloTkvController {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private Task copyWorker;

    // The refernce of msgLbl will be injected by the FXML loader
    @FXML
    private Label msgLbl;

    @FXML
    private Slider timeSlider;

    // http://stackoverflow.com/questions/29854627/progressbar-doesnt-work-with-a-fxml-file-and-a-controller
    @FXML
    private ProgressBar timeProgressbar;

    @FXML
    private ChoiceBox url2open;

    // location and resources wil be automatically injected by the FXML laoder
    @FXML
    private URL location;

    @FXML
    private ResourceBundle resources;


    private AtomicInteger count;

    // Add a public no-args construtcor explicitly just to
    // emphasize that it is needed for a controller
    public HelloTkvController() {
    }

    @FXML
    private void initialize() {
        System.out.println("Initializing SayHelloController...");
        System.out.println("Location = " + location);
        System.out.println("Resources = " + resources);

        //
        timeProgressbar.setProgress(0);
//        copyWorker = createWorker();
//
//        timeProgressbar.progressProperty().unbind();
//        timeProgressbar.progressProperty().bind(copyWorker.progressProperty());

//        new Thread(copyWorker).start();

        //
        TimerService service = new TimerService();
//        final AtomicInteger count = new AtomicInteger(0);
        count = new AtomicInteger(0);
        service.setCount(count.get());
        service.setPeriod(Duration.seconds(1));
        service.setOnSucceeded(new EventHandler<WorkerStateEvent>() {
            public void handle(WorkerStateEvent t) {
                System.out.println(t.getSource().getValue());
//                count.set((Integer) t.getSource().getValue());
                count.set(count.intValue() + 1);
                msgLbl.setText(CurrentTime.currentTime());
                timeProgressbar.setProgress(count.floatValue() / 1000);
            }
        });
        service.start();
    }

    @FXML
    private void sayHello() {
        msgLbl.setText(CurrentTime.currentTime());
        count.set(0);
        timeProgressbar.setProgress(0);
    }

    @FXML
    private void startChrome() {
        startProcess("C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe", (String) url2open.getValue());
    }

    @FXML
    private void startEditPlus() {
        // childVBox.setVisible( true );
        startProcess("C:\\Program Files\\EditPlus 3\\editplus.exe", "E:\\code\\tc\\jira\\jiraNote\\EditPlusShortCut");
    }

    /**
     * Open a new stage with youtube.
     * Open new window: http://stackoverflow.com/questions/15041760/javafx-open-new-window
     */
    @FXML
    private void startYoutube() {
        WebView webview = new WebView();
        webview.getEngine().load(
                "https://www.youtube.com/watch?v=URXglqz7LMo?autoplay=1"
        );
        webview.setPrefSize(640, 390);

        Stage stage = new Stage();
        stage.setScene(new Scene(webview));
        stage.show();
    }

    /*
        http://stackoverflow.com/questions/5604698/java-programming-call-an-exe-from-java-and-passing-parameters
     */
    private void startProcess(String... args) {
        Process process = null;
        try {
            ProcessBuilder p = new ProcessBuilder();
            System.out.println("Started EXE");
            p.command(args);

            p.start();
            System.out.println("Started EXE");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     *
     * http://stackoverflow.com/questions/27853735/simple-example-for-scheduledservice-in-javafx
     */
    private static class TimerService extends ScheduledService<Integer> {
        private IntegerProperty count = new SimpleIntegerProperty();

        public final void setCount(Integer value) {
            count.set(value);
        }

        public final Integer getCount() {
            return count.get();
        }

        public final IntegerProperty countProperty() {
            return count;
        }

        protected Task<Integer> createTask() {
            return new Task<Integer>() {
                protected Integer call() {
                    //Adds 1 to the count
                    count.set(getCount() + 1);
                    return getCount();
                }
            };
        }
    }

    /*
     * http://stackoverflow.com/questions/29854627/progressbar-doesnt-work-with-a-fxml-file-and-a-controller
     */
    public Task createWorker() {
        return new Task() {
            @Override
            protected Object call() throws Exception {
                for (int i = 0; i < 10; i++) {
                    Thread.sleep(2000);
                    updateMessage("2000 milliseconds");
                    updateProgress(i + 1, 10);

                    System.out.println(timeProgressbar.getProgress());
                }
                return true;
            }
        };
    }
}
