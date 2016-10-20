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
public class Me extends MyParent {

	private static Logger logger = LoggerFactory.getLogger(Me.class);
	private int age = 45;
	private int height = 179;

	@Override
	protected void sayProtected() {
		logger.debug("My name is Chealwoo");
	}
	
	protected int getHeight() {
		return height;
	}
}
