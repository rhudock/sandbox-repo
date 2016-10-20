/*
 *  $Id: BitManipulationTest.java 705 2011-05-10 20:42:48Z daniel $
 *
 *  Date: 2010-1-10
 *  Author: $Author: daniel $
 *  Revision: $Rev: 705 $
 *  Last Changed Date: $Date: 2011-05-10 20:42:48 +0000 (Tue, 10 May 2011) $
 *  URL : $URL: http://localhost:7080/svn/javastudy/java/trunk/learning.java.lang/src/test/java/tij/operators/BitManipulationTest.java $
 */

package tij.operators;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class BitManipulationTest {
	
	private int i = 1;

	private static Logger s_logger = LoggerFactory
			.getLogger(BitManipulationTest.class);

	@Before
	public void setUpBefore() throws Exception {

	}

	@Test
	public void studyBinarySystemTest() throws Exception {

		int j = -1, i2 = 2;
		s_logger.debug("   01234567890123456789012345678901");
		s_logger.debug("a  {} = {}", Integer.toBinaryString(i), i);
		s_logger.debug("b  {} = {}", Integer.toBinaryString(i2), i2);
		s_logger.debug("c  {} = {}", Integer.toBinaryString(j), j);
		s_logger.debug("d  {} = {}", Integer.toBinaryString(Integer.MAX_VALUE),
				Integer.MAX_VALUE);
		s_logger.debug("e  {} = {}", Integer.toBinaryString(Integer.MIN_VALUE),
				Integer.MIN_VALUE);

		assertEquals("1", Integer.toBinaryString(i));
	}
	
	@Test
	public void binaryNotTest() throws Exception {
		
		logBinaryInt ("~i", ~i);
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
		
		s_logger.debug("   {} = {}(" + i + ")" , Integer.toBinaryString(i), s);
	}

}