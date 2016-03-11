/**
 * 
 * 
 * 
 */

package cwl.lang.clazz.enums;

import static org.junit.Assert.assertEquals;

import java.util.EnumSet;

import org.junit.Test;

import cwl.lang.clazz.enums.EDay;

public class EnumDayTest {

	@Test
	public void testStringReturn() throws Exception {
		EDay firstDay = EDay.MONDAY;

		assertEquals("Pattern did not validate zip code", "Mondays are bad.",
				EDay.tellItLikeItIs(firstDay));
	}

	@Test
	public void testEnumSet() throws Exception {
		int expected = 2;
		EnumSet<EDay> weekdays = EnumSet.of(EDay.MONDAY, EDay.TUESDAY);

		assertEquals("Pattern did not validate zip code", expected,
				weekdays.size());
	}

	@Test
	public void testEnumMethods() throws Exception {
		EDay firstDay = EDay.MONDAY;

		assertEquals("name() method doesn't print it suppose to", "MONDAY",
				firstDay.name());
		assertEquals("toString() method doesn't print it suppose to", "MONDAY",
				firstDay.toString());
		assertEquals("ordinal() method doesn't print it suppose to", 1,
				firstDay.ordinal());
	}
}
