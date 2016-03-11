/*
 * \$Id$
 * 
 * MyXMLGregorianCalendar.java - created on Sep 13, 2011 10:32:41 AM
 * Copyright (c)2011, Chealwoo Lee (Daniel). All rights reserved. Use is subject to license terms.
 */
package cwl.learn.xml.date;

import javax.xml.datatype.XMLGregorianCalendar;

/**
 * @author Dlee
 *
 */
public class MyXMLGregorianCalendar {

    private XMLGregorianCalendar timeStart = null;

	/**
	 * @return the timeStart
	 */
	public XMLGregorianCalendar getTimeStart() {
		return timeStart;
	}

	/**
	 * @param timeStart the timeStart to set
	 */
	public void setTimeStart(XMLGregorianCalendar timeStart) {
		this.timeStart = timeStart;
	}
    
}
