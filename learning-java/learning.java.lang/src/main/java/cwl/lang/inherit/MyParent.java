/*
 * \$Id$
 * 
 * MyParent.java - created on May 12, 2011 11:02:38 PM
 * Copyright (c)2011, Chealwoo Lee (Daniel). All rights reserved. Use is subject to license terms.
 */
package cwl.lang.inherit;


/**
 * @author dlee
 *
 */
public abstract class MyParent {
	
	private int age = 70;

	protected abstract void sayProtected();
	
	protected int getAge() {
		return age;
	}
	
	protected int getHeight() {
		return 0;
	}
	
}
