/**
 *
 *
 *
 * email validation http://java.sun.com/developer/technicalArticles/releases/1.4regex/
 * http://www.vogella.de/articles/JavaRegularExpressions/article.html
 */

package cwl.essencial.regexp;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.junit.BeforeClass;
import org.junit.Ignore;
import org.junit.Test;

public class RegularExpressionTest {
	private static String zipRegEx = "^\\d{5}([\\-]\\d{4})?$";
	private static Pattern pattern;

	// run only once to run each time before all tests use @Before
	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
		pattern = Pattern.compile(zipRegEx);
	}

	@Test
	public void verifyGoodZipCode() throws Exception {
		Matcher mtcher = this.pattern.matcher("22101");
		boolean isValid = mtcher.matches();
		assertTrue("Pattern did not validate zip code", isValid);
	}

	@Test
	public void verifyZipCodeNoMatch() throws Exception {
		Matcher mtcher = this.pattern.matcher("2211");
		boolean notValid = mtcher.matches();
		assertFalse("Pattern did validate zip code", notValid);
	}

	@Test(expected = IndexOutOfBoundsException.class)
	public void verifyZipCodeGroupException() throws Exception {
		Matcher mtcher = this.pattern.matcher("22101-5051");
		boolean isValid = mtcher.matches();
		mtcher.group(2);
	}

	@Test(timeout = 1)
	public void verifyFastZipCodeMatch() throws Exception {
		Pattern pattern = Pattern.compile("^\\d{5}([\\-]\\d{4})?$");
		Matcher mtcher = pattern.matcher("22011");
		boolean isValid = mtcher.matches();
		assertTrue("Pattern did not validate zip code", isValid);
	}

	@Ignore("this regular expression isn't working yet")
	@Test
	public void verifyZipCodeMatch() throws Exception {
		Pattern pattern = Pattern.compile("^\\d{5}([\\-]\\d{4})");
		Matcher mtcher = pattern.matcher("22011");
		boolean isValid = mtcher.matches();
		assertTrue("Pattern did not validate zip code", isValid);
	}

	/**
	 * To test how to match []
	 * 
	 * @throws Exception
	 */
	@Test
	public void testCuryBlanket() throws Exception {
		String regEx = "[{][0][}]";
		Pattern l_pattern;
		l_pattern = Pattern.compile(regEx);
		Matcher mtcher = l_pattern.matcher("{0}");
		boolean isValid = mtcher.matches();
		assertTrue("Pattern did not validate the test", isValid);
	}

	/**
	 * To test how to match []
	 * 
	 * @throws Exception
	 */
	@Test
	public void testStartWithNum() throws Exception {
		String regEx = "^\\d+_.*";
		Pattern l_pattern = Pattern.compile(regEx);
		Matcher mtcher = l_pattern.matcher("22222_aster");
		boolean isValid = mtcher.matches();
		assertTrue("Pattern did not validate the test", isValid);
	}

	/**
	 * To test how to match []
	 * 
	 * @throws Exception
	 */
	@Test
	public void testStartWithNum02() throws Exception {
		String str = "22222_aster";
		String regEx = "^\\d+";
		Pattern l_pattern = Pattern.compile(regEx);
		Matcher mtcher = l_pattern.matcher(str);
		if (mtcher.find()) {
			String sub = str.substring(mtcher.start(), mtcher.end());
			assertEquals(sub, "22222");

			String isValid = mtcher.replaceFirst("test");
			assertEquals(isValid, "test_aster");
		}
	}

}