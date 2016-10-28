package cwl.lang.schedule;

import java.util.Date;
import java.util.TimerTask;

/**
 * Created by dlee on 10/27/2016.
 */
public class ScheduledTask extends TimerTask {
    private Date now; // to display current time
    private SchedulerMain schedulerMain = null;

    public ScheduledTask(SchedulerMain schedulerMain) {
        this.schedulerMain = schedulerMain;
    }

    // Add your task here
    public void run() {
        now = schedulerMain.getNow(); // initialize date
        System.out.println("Time is :" + now); // Display current time
    }
}
