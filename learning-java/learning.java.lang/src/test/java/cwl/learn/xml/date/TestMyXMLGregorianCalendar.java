/*
 * \$Id$
 * 
 * TestMyXMLGregorianCalendar.java - created on Sep 13, 2011 10:35:09 AM
 * Copyright (c)2011, Chealwoo Lee (Daniel). All rights reserved. Use is subject to license terms.
 */
package cwl.learn.xml.date;

import static org.junit.Assert.*;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.Locale;
import java.util.TimeZone;

import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.Duration;
import javax.xml.datatype.XMLGregorianCalendar;
import javax.xml.namespace.QName;

import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import cwl.lang.inherit.MeInheritTest;

/**
 * @author Dlee
 *
 */
public class TestMyXMLGregorianCalendar {
	
	private static Logger logger = LoggerFactory.getLogger(TestMyXMLGregorianCalendar.class);

	@Test
	public void test() throws Exception {
		
	    GregorianCalendar cal = new GregorianCalendar( 1976, Calendar.DECEMBER, 22 );  
	    XMLGregorianCalendar xmlCal = DatatypeFactory.newInstance().newXMLGregorianCalendar( cal );  
	    
		MyXMLGregorianCalendar calendar = new MyXMLGregorianCalendar();
		
		calendar.setTimeStart(xmlCal);
		
		logger.debug("xmlCal {}", calendar.getTimeStart());
		
		
		
		fail("Not yet implemented");
	}

}
