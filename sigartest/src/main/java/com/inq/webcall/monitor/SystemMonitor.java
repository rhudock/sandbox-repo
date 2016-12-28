package com.inq.webcall.monitor;

import com.inq.webcall.dao.SystemStatDao;
import com.inq.webcall.monitor.systemmonitor.NetworkData;
import com.inq.webcall.monitor.util.SystemMonitorChecker;
import org.bson.Document;
import org.hyperic.sigar.*;
import org.kurento.commons.ConfigFileManager;
import org.kurento.commons.PropertiesManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Timer;

/**
 * http://stackoverflow.com/questions/12214114/how-to-include-sigar-api-in-java-project
 */

public class SystemMonitor {

    private static final Logger log = LoggerFactory.getLogger(SystemMonitor.class);

    public final static String KROOMDEMO_CFG_FILENAME = "system-monitor.conf.json";
    static {
        ConfigFileManager.loadConfigFile(KROOMDEMO_CFG_FILENAME);
    }

    // Mongodb configuration
    public static final String MONGOD_SERVER_URIS_PROPERTY = "mongodb.uris";
    public static final String DEFAULT_MONGOD_SERVER_URIS = "[ \"mongod.inq.com\" ]";
    public static final String MONGOD_DB_NAME = PropertiesManager.getProperty("mongodb.dbname",
            "kmslog");
    public static final String SYSTEM_SERVER_NAME = PropertiesManager.getProperty("system.name",
            "changeme");;
    public static final String SYSTEM_SERVER_IP = PropertiesManager.getProperty("system.ip",
            "0.0.0.0");
    public static final String SYSTEM_SERVER_ROLE = PropertiesManager.getProperty("system.role",
            "KMS");


    private static Sigar sigar = new Sigar();

    public SystemMonitor() {
    }

    public static void getInformationsAboutMemory() {
        System.out.println("**************************************");
        System.out.println("*** Informations about the Memory: ***");
        System.out.println("**************************************\n");

        Mem mem = null;
        try {
            mem = sigar.getMem();
        } catch (SigarException se) {
            se.printStackTrace();
        }

        String memTotal = "" + mem.getFree() / 1024 / 1024;
        String memUsed = "" + mem.getUsed() / 1024 / 1024;

        System.out.print(String.format("%s\t%s", memTotal, memUsed));

/*        System.out.println("Actual total free system memory: "
                + mem.getActualFree() / 1024 / 1024 + " MB");
        System.out.println("Actual total used system memory: "
                + mem.getActualUsed() / 1024 / 1024 + " MB");
        System.out.println("Total free system memory ......: " + mem.getFree()
                / 1024 / 1024 + " MB");
        System.out.println("System Random Access Memory....: " + mem.getRam()
                + " MB");
        System.out.println("Total system memory............: " + mem.getTotal()
                / 1024 / 1024 + " MB");
        System.out.println("Total used system memory.......: " + mem.getUsed()
                / 1024 / 1024 + " MB");

        System.out.println("\n**************************************\n");*/
    }

    /*
    http://stackoverflow.com/questions/28039533/how-to-find-total-cpu-utilisation-in-java-using-sigar
     */

    public static void getSystemStatistics(Document document) {
        Mem mem = null;
        CpuTimer cputimer = null;
        FileSystemUsage filesystemusage = null;
        try {
            mem = sigar.getMem();
            cputimer = new CpuTimer(sigar);
            filesystemusage = sigar.getFileSystemUsage("C:");
        } catch (SigarException se) {
            se.printStackTrace();
        }

        String memTotal = "" + mem.getFree() / 1024 / 1024;
        String memUsed = "" + mem.getUsed() / 1024 / 1024;

//        System.out.print(String.format( "%s\t%s", memTotal, memUsed));
        document.put("cpuUsage", cputimer.getCpuUsage());
        document.put("memUsage", mem.getUsedPercent());
        System.out.print(cputimer.getCpuUsage() + "\t");
        System.out.print(mem.getUsedPercent() + "\t");
        System.out.print(filesystemusage.getUsePercent() + "\n");
    }

    public void saveSystem() {
        Document document = new Document();

        document.put("timestamp", System.currentTimeMillis());
        getSystemStatistics(document);
        try {
            NetworkData.getMetricThread(sigar, document);
        } catch (SigarException e) {
            log.error("Error", e);
        } catch (InterruptedException e) {
            log.error("Error", e);
        }

        SystemStatDao.getInstance().saveSystemStat(document);
    }

    public static void startWebRtcEndPointChecker() {
        Timer time = new Timer(); // Instantiate Timer Object
        SystemMonitorChecker systemMonitorChecker = new SystemMonitorChecker(new SystemMonitor());
        time.schedule(systemMonitorChecker, 0, 200000); // Create Repetitively task for every 1 secs
    }

    public static void main(String[] args) throws Exception {
        startWebRtcEndPointChecker();
    }
}

