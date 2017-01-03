package com.inq.webcall.monitor.systemmonitor;

import org.hyperic.sigar.CpuTimer;
import org.hyperic.sigar.Mem;
import org.hyperic.sigar.Sigar;
import org.hyperic.sigar.SigarException;

/*
http://stackoverflow.com/questions/28039533/how-to-find-total-cpu-utilisation-in-java-using-sigar
 */
public class CPUStatWrap {
    private static Sigar sigar = new Sigar();
    private static CpuTimer cputimer = null;
    static {
        cputimer = new CpuTimer(sigar);
    }

}
