/*
 *  $Id: BitShiftOpTest.java 593 2011-01-14 18:36:17Z daniel $
 *
 *  Date: 2010-1-10
 *  Author: $Author: daniel $
 *  Revision: $Rev: 593 $
 *  Last Changed Date: $Date: 2011-01-14 10:36:17 -0800 (Fri, 14 Jan 2011) $
 *  URL : $URL: http://localhost:7080/svn/javastudy/java/trunk/learning.java.lang/src/test/java/tij/operators/BitShiftOpTest.java $
 */

package tij.operators;

import static org.junit.Assert.assertEquals;

import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class BitShiftOpTest {
	
	private int i = 1;

	private static Logger s_logger = LoggerFactory
			.getLogger(BitShiftOpTest.class);

	@Before
	public void setUpBefore() throws Exception {

	}

	@Test
	public void studyBinarySystemTest() throws Exception {

		int j = -1, i2 = 2;
		s_logger.debug("01234567890123456789012345678901");
		s_logger.debug("{} = {}", Integer.toBinaryString(0), 0);
		s_logger.debug("{} = {}", Integer.toBinaryString(i), i);
		s_logger.debug("{} = {}", Integer.toBinaryString(i2), i2);
		s_logger.debug("{} = {}", Integer.toBinaryString(j), j);
		s_logger.debug("{} = {}", Integer.toBinaryString(-2), -2);
		s_logger.debug("{} = {}", Integer.toBinaryString(Integer.MAX_VALUE),
				Integer.MAX_VALUE);
		s_logger.debug("{} = {}", Integer.toBinaryString(Integer.MIN_VALUE),
				Integer.MIN_VALUE);

		assertEquals("1", Integer.toBinaryString(i));
	}
	
	@Test
	public void bitShiftTest() throws Exception {
		
		s_logger.debug("Start {} test", "Bit Shift << ");
		logBinaryInt ("i << 1", i << 1);
		assertEquals(~i, -2);
	}

	@Test
	public void bitAndTest() throws Exception {
		
		logBinaryInt ("Integer.MAX_VALUE & 1", Integer.MAX_VALUE & 1);
		assertEquals(Integer.MAX_VALUE & 1, 1);
	}

	@Test
	public void bitOrTest() throws Exception {
		
		logBinaryInt ("Integer.MAX_VALUE & 1", Integer.MAX_VALUE | 1);
		assertEquals(Integer.MAX_VALUE | 1, Integer.MAX_VALUE);
	}
	
	@Test
	public void bitXorTest() throws Exception {
		
		logBinaryInt ("Integer.MAX_VALUE ^ 1", Integer.MAX_VALUE ^ 1);
		assertEquals(Integer.MAX_VALUE | 1, Integer.MAX_VALUE);
	}

	static void logBinaryInt(String s, int i) {
		
		assert s != null;
		
		s_logger.debug("{} = {} (" + i + ")" , Integer.toBinaryString(i), s);
	}

}