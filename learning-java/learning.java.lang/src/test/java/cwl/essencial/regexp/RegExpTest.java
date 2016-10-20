package cwl.essencial.regexp;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.junit.BeforeClass;
import org.junit.Test;

public class RegExpTest {

	private static String RegEx = ".*(kindle|nook).*";
	private static Pattern pattern;
	private static String userAgentStr = "Mozilla/5.0 (Linux; U; en-US) AppleWebKit/528.5+ (KHTML, like Gecko, Safari/528.5+) Version/4.0 Kindle/3.0 (screen 600×800; rotate)";

	// run only once to run each time before all tests use @Before
	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
		pattern = Pattern.compile(RegEx);
		userAgentStr = userAgentStr.toLowerCase();
	}

	@Test
	public void testKindel() throws Exception {
		assertTrue("String matches works",
				userAgentStr.toLowerCase().matches(RegEx));
	}

	@Test
	public void testMatches01() throws Exception {
		Matcher mtcher = pattern.matcher(userAgentStr);
		boolean isValid = mtcher.find();
		assertTrue("Pattern did not validate zip code", isValid);
	}

	@Test
	public void testMatches02() throws Exception {
		String uaStr = "Mozilla";
		assertFalse("String matches works", uaStr.toLowerCase().matches(RegEx));

	}

	@Test
	public void testSimpleTrue() {
		String s = "humbapumpa jim";
		assertTrue(s.matches(".*(jim|joe).*"));
		s = "humbapumpa jom";
		assertFalse(s.matches(".*(jim|joe).*"));
		s = "humbaPumpa joe";
		assertTrue(s.matches(".*(jim|joe).*"));
		s = "humbapumpa joe jim";
		assertTrue(s.matches(".*(jim|joe).*"));
	}

	@Test
	public void testTablet01() throws Exception {
		String uaStr = "Mozilla/5.0 (compatible; tablet MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0)";
		String regSt = "^(tablet(?!.*MSIE [89]\\.0))|(tablet(?=.*(MSIE 8\\.0)|IEMobile)(?=.*(IEMobile)|MSIE 8\\.0))|(MSIE 8\\.0(?=.*(tablet)|IEMobile)(?=.*(IEMobile)|tablet))|(IEMobile(?=.*(MSIE 8\\.0)|tablet)(?=.*(MSIE 8\\.0)|tablet))";
		assertTrue(uaStr + " is not matching with " + regSt, uaStr.toLowerCase().matches(regSt));
	}
	
	@Test
	public void testTablet02() throws Exception {
		String uaStr = "Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; Mobile/9.0)";
		String regSt = "^(tablet(?!.*MSIE [89]\\.0))|(tablet(?=.*(MSIE 8\\.0)|IEMobile)(?=.*(IEMobile)|MSIE 8\\.0))|(MSIE 8\\.0(?=.*(tablet)|IEMobile)(?=.*(IEMobile)|tablet))|(IEMobile(?=.*(MSIE 8\\.0)|tablet)(?=.*(MSIE 8\\.0)|tablet))";
		assertFalse(uaStr + " is not matching with " + regSt, uaStr.toLowerCase().matches(regSt));
	}	
	
	
	/**
	 * 
	 * http://docs.oracle.com/javase/tutorial/essential/regex/index.html
	 * 
	 * @throws Exception
	 */
	@Test
	public void testReg01() throws Exception {
        Pattern pattern = Pattern.compile("foo");
        Matcher matcher = pattern.matcher("this is foo .");
        assertTrue(matcher.find());
	}	

	@Test
	public void testReg02() throws Exception {
		Pattern pattern = Pattern.compile("kindle|nook");
		String uaString = "Mozilla/5.0 (Linux; U; en-US) AppleWebKit/528.5+ (KHTML, like Gecko, Safari/528.5+) Version/4.0 Kindle/3.0 (screen 600×800; rotate)";
		Matcher matcher = pattern.matcher(uaString.toLowerCase());
		assertTrue(matcher.find());
	}	
	
	@Test
	public void testRegTablet01() throws Exception {
		String patStr = "^(tablet(?!.*MSIE [89]\\.0))|(tablet(?=.*(MSIE 8\\.0)|IEMobile)(?=.*(IEMobile)|MSIE 8\\.0))|(MSIE 8\\.0(?=.*(tablet)|IEMobile)(?=.*(IEMobile)|tablet))|(IEMobile(?=.*(MSIE 8\\.0)|tablet)(?=.*(MSIE 8\\.0)|tablet))";
		Pattern pattern = Pattern.compile(patStr);
		String uaString = "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)";
		Matcher matcher = pattern.matcher(uaString.toLowerCase());
		assertFalse(matcher.find());
	}	
	
	@Test
	public void testRegTablet02() throws Exception {
		String patStr = "^(tablet(?!.*MSIE [89]\\.0))|(tablet(?=.*(MSIE 8\\.0)|IEMobile)(?=.*(IEMobile)|MSIE 8\\.0))|(MSIE 8\\.0(?=.*(tablet)|IEMobile)(?=.*(IEMobile)|tablet))|(IEMobile(?=.*(MSIE 8\\.0)|tablet)(?=.*(MSIE 8\\.0)|tablet))";
		Pattern pattern = Pattern.compile(patStr);
		String uaString = "Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0; .NET CLR 2.7.58687; SLCC2; Media Center PC 5.0; Zune 3.4; Tablet PC 3.6; InfoPath.3)";
		Matcher matcher = pattern.matcher(uaString.toLowerCase());
		assertFalse(matcher.find());
	}	
	
	@Test
	public void testRegTablet03() throws Exception {
		String patStr = "^(tablet(?!.*msie [89]\\.0))|iemobile";
		Pattern pattern = Pattern.compile(patStr.toLowerCase());
		String uaString = "Mozilla/4.0 (compatible; MSIE 7.0; Windows Phone OS 7.0; Trident/3.1; IEMobile/7.0; Nokia;N70)";
		Matcher matcher = pattern.matcher(uaString.toLowerCase());
		assertTrue(matcher.find());
	}	
	
	/*
	 * False - although the userAgent has 'tablet', it also has MSIE 8.0
	 * 
	 * @throws Exception
	 */
	@Test
	public void testRegTablet03_1() throws Exception {
		String patStr = "^(tablet(?!.*msie [89]\\.0))";
		Pattern pattern = Pattern.compile(patStr.toLowerCase());
		String uaString = "Mozilla/4.0 (compatible; MSIE 8.0; Windows Phone OS 7.0; Trident/3.1; tablet; Nokia;N70)";
		Matcher matcher = pattern.matcher(uaString.toLowerCase());
		assertFalse(matcher.find());
	}	

	/*
	 * True - the userAgent has 'tablet' and no MSIE 8.0
	 * 
	 * @throws Exception
	 */
	@Test
	public void testRegTabletNoMSIE() throws Exception {
		String patStr = "^(tablet(?!.*msie [89]\\.0))";
		Pattern pattern = Pattern.compile(patStr.toLowerCase());
		String uaString = "tablet Mozilla/4.0 (compatible; MS 3.0; Windows Phone OS 7.0; Trident/3.1; tablet; Nokia;N70)";
		Matcher matcher = pattern.matcher(uaString.toLowerCase());
		assertTrue(matcher.find());
	}	
	
	/*
	 * True because it has iemobile
	 */
	@Test
	public void testRegTablet04() throws Exception {
		String patStr = "^(tablet(?!.*msie [89]\\.0))|iemobile";
		Pattern pattern = Pattern.compile(patStr.toLowerCase());
		String uaString = "Mozilla/4.0 (compatible; MSIE 7.0; Windows Phone OS 7.0; Trident/3.1; IEMobile/7.0; Nokia;N70)";
		Matcher matcher = pattern.matcher(uaString.toLowerCase());
		assertTrue(matcher.find());
	}	
	/*
	 * True because it has iemobile
	 */
	@Test
	public void testRegTablet05() throws Exception {
		String patStr = "SM-N900";
		Pattern pattern = Pattern.compile(patStr.toLowerCase());
		String uaString = "Mozilla/5.0 (Linux; Android 4.4.2; SM-N9005 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.114 Mobile Safari/537.36";
		Matcher matcher = pattern.matcher(uaString.toLowerCase());
		assertTrue(matcher.find());
	}	
	/*
	 * True because it has iemobile
	 */
	@Test
	public void testRegTablet06() throws Exception {
		String patStr = "^(tablet(?!.*MSIE [89]\\.0))|(tablet(?=.*(MSIE 8\\.0)|IEMobile)(?=.*(IEMobile)|MSIE 8\\.0))|(MSIE 8\\.0(?=.*(tablet)|IEMobile)(?=.*(IEMobile)|tablet))|(IEMobile(?=.*(MSIE 8\\.0)|tablet)(?=.*(MSIE 8\\.0)|tablet))";
		Pattern pattern = Pattern.compile(patStr.toLowerCase());
		String uaString = "Mozilla/5.0 (Linux; Android 4.4.2; SM-N9005 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.114 Mobile Safari/537.36";
		Matcher matcher = pattern.matcher(uaString.toLowerCase());
		assertTrue(matcher.find());
	}	

	/*
	 * True because it has iemobile
	 */
	@Test
	public void testRegTablet_sm_t530nu_01() throws Exception {
		String patStr = "^(tablet(?!.*MSIE [89]\\.0))|(tablet(?=.*(MSIE 8\\.0)|IEMobile)(?=.*(IEMobile)|MSIE 8\\.0))|(MSIE 8\\.0(?=.*(tablet)|IEMobile)(?=.*(IEMobile)|tablet))|(IEMobile(?=.*(MSIE 8\\.0)|tablet)(?=.*(MSIE 8\\.0)|tablet))";
		Pattern pattern = Pattern.compile(patStr.toLowerCase());
		String uaString = "Mozilla/5.0 (Linux; Android 4.4.2; en-us; SAMSUNG SM-T530NU Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/1.5 Chrome/28.0.1500.94 Safari/537.36";
		Matcher matcher = pattern.matcher(uaString.toLowerCase());
		assertTrue(!matcher.find());
	}	
	
	/*
	 * True because it has iemobile
	 */
	@Test
	public void testReg_sm_t530nu_01_Phone() throws Exception {
		String patStr = "android";
		Pattern pattern = Pattern.compile(patStr.toLowerCase());
		String uaString = "Mozilla/5.0 (Linux; Android 4.4.2; en-us; SAMSUNG SM-T530NU Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/1.5 Chrome/28.0.1500.94 Safari/537.36";
		Matcher matcher = pattern.matcher(uaString.toLowerCase());
		assertTrue(matcher.find());
	}	
	
	/*
	 * True because it has iemobile
	 */
	@Test
	public void testReg_SM_T217_Tablet() throws Exception {
		String patStr = "sm-t217";
		Pattern pattern = Pattern.compile(patStr.toLowerCase());
		String uaString = "Mozilla/5.0 (Linux; U; Android 4.2.2; en-us; SM-T217S Build/JDQ3) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30";
		Matcher matcher = pattern.matcher(uaString.toLowerCase());
		assertTrue(matcher.find());
	}	
}


