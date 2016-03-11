package learning.java.ch09thread.threads.conpro;

import org.apache.log4j.Logger;

import java.util.*;

public class Producer implements Runnable
{
	/**
	 * Logger for this class
	 */
	private static final Logger logger = Logger.getLogger(Producer.class);

    static final int MAXQUEUE = 5;
    private List<String> messages = new ArrayList<String>();

    public void run() {
		while ( true ) {
			putMessage();
            try { 
				Thread.sleep( 1000 ); 
			} catch ( InterruptedException e ) { }
		}
    }

    private synchronized void putMessage() 
	{
		if (logger.isDebugEnabled()) {
			logger.debug("putMessage() - start");
		}

        while ( messages.size() >= MAXQUEUE )
			try {
				wait();
			} catch( InterruptedException e ) {
				logger.error("putMessage()", e);
		}

        messages.add( new java.util.Date().toString() );
        notify();

		if (logger.isDebugEnabled()) {
			logger.debug("putMessage() - end");
		}
    }

    // called by Consumer
    public synchronized String getMessage(String callerName)
	{
		if (logger.isDebugEnabled()) {
			logger.debug("getMessage(" + callerName + ") - start");
		}

        while ( messages.size() == 0 )
			try {
				notify();
				wait();
			} catch( InterruptedException e ) {
				logger.error("getMessage()", e);
		}
        String message = (String)messages.remove(0);
		notify();

		if (logger.isDebugEnabled()) {
			logger.debug("getMessage(" + callerName + ") - end");
		}
        return message;
    }
} 

