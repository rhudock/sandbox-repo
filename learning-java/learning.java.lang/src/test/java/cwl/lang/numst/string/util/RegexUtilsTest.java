package cwl.lang.numst.string.util;

import org.junit.Test;
import tc.util.RegexUtils;

import java.util.regex.Pattern;

import static org.junit.Assert.*;

public class RegexUtilsTest {

    private static String maskGroups(String s, Pattern p) {
        return RegexUtils.maskGroups(s, p, "x");
    }

    @Test
    public void testMaskGroups() throws Exception {
        assertEquals("ax", maskGroups("ab", Pattern.compile("a(b)")));
    }

    @Test
    public void testMaskGroups_specialCase() throws Exception {
        assertEquals("ax", maskGroups("aa", Pattern.compile("a(a)")));
    }

    @Test
    public void testMaskGroups_specialCase2() throws Exception {
        assertEquals("axz", maskGroups("aaz", Pattern.compile("a(a)z")));
    }

    @Test
    public void testMaskGroups_specialCase3() throws Exception {
        assertEquals("axzbaxz", maskGroups("aazbaaz", Pattern.compile("a(a)z")));
    }

    @Test
    public void testMaskGroups_specialCase4() throws Exception {
        assertEquals("xxx-xx-xxxx", maskGroups("123-45-6777", Pattern.compile("(\\d+)-(\\d+)-(\\d+)")));
    }

    @Test
    public void testMaskGroups_specialCase5() throws Exception {
        assertEquals("xxx-xx-xxxx-", maskGroups("123-45-6777-", Pattern.compile("(\\d+)-(\\d+)-(\\d+)")));
    }

}