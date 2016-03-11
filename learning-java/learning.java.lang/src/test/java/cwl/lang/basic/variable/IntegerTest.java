package cwl.lang.basic.variable;

import static org.junit.Assert.*;

import org.junit.Test;

/**
 * @author dlee
 *
 */
public class IntegerTest {

	/**
	 * compare int objects
	 */
	@Test
	public void valueOfTestCast() {

		Integer i1 = 10;
		Integer i2 = 10;

		if (i1 == i2) {
			assertTrue(true);
		} else {
			assertTrue(false);
		}
	}

	/**
	 * when objects are created with new key word
	 */
	@Test
	public void valueOfTestObject() {

		Integer i1 = new Integer(10);
		Integer i2 = new Integer(10);

		if (!(i1 == i2)) {
			assertTrue(true);
		} else {
			assertTrue(false);
		}
	}
	
	/**
	 * one int and
	 * another object is created with new key word
	 */
	@Test
	public void valueOfTestObjectCast() {

		Integer i1 = 10;
		Integer i2 = new Integer(10);

		if (!(i1 == i2)) {
			assertTrue(true);
		} else {
			assertTrue(false);
		}
	}	
	
	/**
	 * one object is created with new key word
	 * and == compared with int
	 */
	@Test
	public void valueOfTestObjectIntCast() {

		Integer i1 = new Integer(10);
		Integer i2 = 10;

		if (!(i1 == i2)) {
			assertTrue(true);
		} else {
			assertTrue(false);
		}
	}	
}
