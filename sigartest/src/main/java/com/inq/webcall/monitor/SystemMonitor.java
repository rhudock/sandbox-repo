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

import java.net.InetAddress;
import java.net.UnknownHostException;
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

    public static final String CHECK_EVERY_SEC = PropertiesManager.getProperty("checkEverySec",
            "10");

    private static Sigar sigar = new Sigar();

    public SystemMonitor() {
    }

    public static void getSystemStatistics(Document document) {
        Mem mem = null;
        CpuTimer cputimer = null;
        FileSystemUsage filesystemusage = null;
        CpuPerc cpu = null;
        try {
            mem = sigar.getMem();
            cputimer = new CpuTimer(sigar);
            filesystemusage = sigar.getFileSystemUsage("/");
            cpu = sigar.getCpuPerc();
        } catch (SigarException se) {
            se.printStackTrace();
        }

        document.put("hostName", getHostName());
        document.put("cpuUserUsage", cpu.getUser());
        document.put("cpuUsage", cputimer.getCpuUsage());
        document.put("memUsage", mem.getUsedPercent());
        document.put("filesystemUsage", filesystemusage.getUsePercent());
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

        log.debug("hostName: {}, cpuUserUsage: {}, memUsage: {}, filesystemUsage: {}, timestamp: {}",
                document.get("hostName"), document.get("cpuUserUsage"), document.get("memUsage"), document.get("filesystemUsage"), document.get("timestamp"));

        SystemStatDao.getInstance().saveSystemStat(document);
    }

    public static void startWebRtcEndPointChecker() {
        Timer time = new Timer(); // Instantiate Timer Object
        SystemMonitorChecker systemMonitorChecker = new SystemMonitorChecker(new SystemMonitor());
        time.schedule(systemMonitorChecker, 0, Integer.valueOf(CHECK_EVERY_SEC) * 1000); // Create Repetitively task
    }

    private static String getHostName() {
        try {
            return InetAddress.getLocalHost().getHostName();
        } catch (UnknownHostException e) {
            return "unknown";
        }
    }

    public static void main(String[] args) throws Exception {
        startWebRtcEndPointChecker();
    }
}

