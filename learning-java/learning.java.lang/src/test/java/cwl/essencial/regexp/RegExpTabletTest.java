package cwl.essencial.regexp;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.junit.BeforeClass;
import org.junit.Test;

public class RegExpTabletTest {

	private static String regEx = "^(tablet(?!.*MSIE [89]\\.0))|(tablet(?=.*(MSIE 8\\.0)|IEMobile)(?=.*(IEMobile)|MSIE 8\\.0))|(MSIE 8\\.0(?=.*(tablet)|IEMobile)(?=.*(IEMobile)|tablet))|(IEMobile(?=.*(MSIE 8\\.0)|tablet)(?=.*(MSIE 8\\.0)|tablet))";
	Pattern pattern = Pattern.compile(regEx.toLowerCase());
	
	/*
	 * Expected Result.
	 Input   --  Result
	"tablet", // tablet
	"tablet MSIE 8.0", // Null
	"MSIE 8.0 tablet", // Null
    "tablet MSIE 9.0", // Null
    "MSIE 9.0 tablet", // Null
    "MSIE 8.0 tablet IEMobile",  // tablet
    "MSIE 8.0 IEMobile tablet",  // tablet
    "tablet MSIE 8.0 IEMobile",  // tablet
    "tablet IEMobile MSIE 8.0",  // tablet 
    "IEMobile tablet MSIE 8.0",  // tablet
    "IEMobile MSIE 8.0 tablet",  // tablet
    "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0; .NET CLR 2.0.50727; SLCC2; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; Zune 4.0; Tablet PC 2.0; InfoPath.3; .NET4.0C; .NET4.0E)"    // Null
*/
	
	//"^(tablet(?!.*MSIE [89]\\.0))|(tablet(?=.*(MSIE 8\\.0)|IEMobile)(?=.*(IEMobile)|MSIE 8\\.0))|(MSIE 8\\.0(?=.*(tablet)|IEMobile)(?=.*(IEMobile)|tablet))|(IEMobile(?=.*(MSIE 8\\.0)|tablet)(?=.*(MSIE 8\\.0)|tablet))"
	// run only once to run each time before all tests use @Before
	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
	}

	/*
	 *   Test ^(tablet(?!.*MSIE [89]\\.0))
	 */
	@Test
	public void testTablet01() throws Exception {
		String userAgentStr = "tablet";

		assertTrue("String matches works",
				userAgentStr.toLowerCase().matches(regEx));
	}

	@Test
	public void testTablet02() throws Exception {
		String userAgentStr = "tablet MSIE 8.0";
		
		assertFalse("String matches works",
				userAgentStr.toLowerCase().matches(regEx));
	}
	
	@Test
	public void testTablet03() throws Exception {
		String userAgentStr = "MSIE 8.0 tablet";
		
		assertFalse("String matches works",
				userAgentStr.toLowerCase().matches(regEx));

		userAgentStr = "tablet MSIE 9.0";
		assertFalse("String matches works",
				userAgentStr.toLowerCase().matches(regEx));
	}
	

	@Test
	public void testTablet04() throws Exception {
		String userAgentStr = "MSIE 9.0 tablet";
		
		assertFalse("String matches works",
				userAgentStr.toLowerCase().matches(regEx));
	}
		
	@Test
	public void testTablet11() throws Exception {
		String userAgentStr = "MSIE 8.0 tablet IEMobile";
		Matcher matcher = pattern.matcher(userAgentStr.toLowerCase());
		assertTrue(matcher.find());
	}
	
	@Test
	public void testTablet12() throws Exception {
		String userAgentStr = "MSIE 8.0 IEMobile tablet";
		Matcher matcher = pattern.matcher(userAgentStr.toLowerCase());
		assertTrue(matcher.find());
	}
	
	@Test
	public void testTablet13() throws Exception {
		String userAgentStr = "tablet MSIE 8.0 IEMobile";
		Matcher matcher = pattern.matcher(userAgentStr.toLowerCase());
		assertTrue(matcher.find());
	}
	
	@Test
	public void testTablet14() throws Exception {
		String userAgentStr = "tablet IEMobile MSIE 8.0";
		Matcher matcher = pattern.matcher(userAgentStr.toLowerCase());
		assertTrue(matcher.find());
	}
	
	@Test
	public void testTablet15() throws Exception {
		String userAgentStr = "IEMobile MSIE 8.0";
		Matcher matcher = pattern.matcher(userAgentStr.toLowerCase());
		assertTrue(matcher.find());
	}
	
	@Test
	public void testTablet15_1() throws Exception {
		String userAgentStr = "IEMobile MSIE 8";
		Matcher matcher = pattern.matcher(userAgentStr.toLowerCase());
		assertFalse(matcher.find());
	}
	
	@Test
	public void testTablet16() throws Exception {
		String userAgentStr = "IEMobile MSIE 8.0 tablet";
		Matcher matcher = pattern.matcher(userAgentStr.toLowerCase());
		assertTrue(matcher.find());
	}
}
