package cwl.essencial.regexp;

import static org.junit.Assert.*;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.junit.Test;

public class TimeFormatTest {

    private static String s_regEx = "^([0-9][0-9]):([0-9][0-9]):([0-9][0-9])$";
    private static Pattern pattern = Pattern.compile(s_regEx);
    
	@Test
	public void testMatch() {
		
		String time = "05:00:00 ";
		boolean isValid;
		
        Matcher m = pattern.matcher(time.trim());
        isValid = m.matches();
        assertTrue("Pattern did not validate zip code", isValid);
        
        time = "05:00:00.00 ";
        m = pattern.matcher(time.trim());
        isValid = m.matches();
        assertFalse("Pattern did not validate zip code", isValid);
	
	}

	@Test
	public void testGroup() {
		
		String time = "05:00:00 ";
		boolean isValid;
		
		Matcher m = pattern.matcher(time.trim());
		isValid = m.matches();
		assertTrue("Pattern did not validate zip code", isValid);
		
		m.reset();
		assertTrue ("", m.find() );
		
	}

}
