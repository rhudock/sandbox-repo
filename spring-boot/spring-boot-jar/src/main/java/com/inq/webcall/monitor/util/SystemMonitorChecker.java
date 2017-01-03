package com.inq.webcall.monitor.util;

import com.inq.webcall.monitor.SystemMonitor;

import java.util.TimerTask;

/**
 * Created by dlee on 12/16/2016.
 */
public class SystemMonitorChecker extends TimerTask {
    private SystemMonitor systemMonitor = null;

    public SystemMonitorChecker(SystemMonitor systemMonitor) {
        this.systemMonitor = systemMonitor;
    }

    public void run() {
        try {
            Thread.sleep(5000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        systemMonitor.saveSystem();
    }
}