package com.inq.webcall.monitor.systemmonitor;

import org.hyperic.sigar.CpuTimer;
import org.hyperic.sigar.Mem;
import org.hyperic.sigar.Sigar;
import org.hyperic.sigar.SigarException;


public class MemoryStatWrap {
    private static Sigar sigar = new Sigar();
    private static Mem mem = null;
    static {
        try {
            mem = sigar.getMem();
        } catch (SigarException se) {
            se.printStackTrace();
        }
    }

    public static long getFree() {
        return mem.getFree();
    }

    public static long getUsed() {
        return mem.getUsed();
    }

    // Total system memory
    public static long getTotal() {
        return mem.getTotal();
    }

    // System Random Access Memory
    public static long getRam() {
        return mem.getRam();
    }

    // Actual total free system memory
    public static long getActualFree() {
        return mem.getActualFree();
    }

    // Actual total used system memory
    public static long getActualUsed() {
        return mem.getActualUsed();
    }
}
