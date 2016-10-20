/*
 * \$Id$
 * 
 * MySon.java - created on May 12, 2011 11:04:57 PM
 * Copyright (c)2011, Chealwoo Lee (Daniel). All rights reserved. Use is subject to license terms.
 */
package cwl.lang.inherit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author dlee
 *
 */
public class MySon extends Me {

	private static Logger logger = LoggerFactory.getLogger(Me.class);
	private int age = 9;
	private int height = 109;
	
	@Override
	protected void sayProtected() {
		logger.debug("My name is Jeff");
	}
	
	protected int getHeight() {
		return height;
	}


}
