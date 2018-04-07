package cwl.lang.numst.string.util;

import org.apache.commons.lang3.ArrayUtils;
import org.junit.Assert;
import org.junit.Test;
import tc.util.StringUtils;

import java.io.CharArrayWriter;
import java.io.UnsupportedEncodingException;
import java.nio.CharBuffer;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedList;

import static tc.util.StringUtils.abbreviateAround;
import static tc.util.StringUtils.appendQuoted;
import static tc.util.StringUtils.byteArrayToString;
import static tc.util.StringUtils.completeEncodeStringForMap;
import static tc.util.StringUtils.logstr;
import static tc.util.StringUtils.stringToByteArray;
import static java.util.Arrays.asList;
import static org.junit.Assert.*;

public class StringUtilsTest {

    private static final byte[] FIRST_BYTES = "first".getBytes();
    private static final byte[] SECOND_BYTES = "second".getBytes();
    private static final byte[] FIRST_AND_SECOND_BYTES = "firstsecond".getBytes();

    public static final byte[] SEPARATOR = ".$".getBytes();

    @Test
    public void testJoinEmpty() throws Exception {
        assertNull(StringUtils.join(new LinkedList<byte[]>(), (byte) ','));
    }

    @Test
    public void testLogstr_stringArray() throws Exception {
        assertEquals("[[111],[222]]", logstr("111", "222"));
        assertEquals("NULL", logstr((String[]) null));
        assertEquals("[NULL]", logstr(new String[]{null}));
        assertEquals("[]", logstr(new String[0]));

        assertEquals("NULL", logstr((Iterable) null));
        assertEquals("[]", logstr(new ArrayList()));
        assertEquals("[[foo],[NULL],[],NULL]",
                logstr(asList("foo".getBytes(), "NULL".getBytes(), "".getBytes(), null)));
    }

    @Test
    public void testLogstr_stringCollection() throws Exception {
        assertEquals("[[111],[222]]", logstr(asList("111", "222")));
        assertEquals("NULL", logstr((Iterable<String>) null));
        assertEquals("[NULL]", logstr(Collections.<String>singletonList(null)));
        assertEquals("[]", logstr(new ArrayList<String>()));
    }

    @Test
    public void testAbbreviate() throws Exception {
        assertEquals("...12345678...", abbreviateAround("0123456789", 5, 4));
        assertEquals("0123456789", abbreviateAround("0123456789", 5, 5));

        assertEquals("0123...", abbreviateAround("0123456789", 0, 4));
        assertEquals("01234...", abbreviateAround("0123456789", 1, 4));
        assertEquals("012345...", abbreviateAround("0123456789", 1, 5));
        assertEquals("01234567...", abbreviateAround("0123456789", 4, 4));

        assertEquals("...23456789", abbreviateAround("0123456789", 6, 4));
        assertEquals("...123456789", abbreviateAround("0123456789", 6, 5));
        assertEquals("...23456789", abbreviateAround("0123456789", 7, 5));

        assertEquals("0123456789", abbreviateAround("0123456789", 0, 10));
        assertEquals("0123456789", abbreviateAround("0123456789", 0, 11));
        assertEquals("0123456789", abbreviateAround("0123456789", 10, 10));
        assertEquals("0123456789", abbreviateAround("0123456789", 10, 11));
        assertEquals("0123456789", abbreviateAround("0123456789", 6, 6));
    }

    @Test
    public void testAbbreviate_outOfRange() throws Exception {
        assertEquals("0123456789", abbreviateAround("0123456789", 11, 11));
        assertEquals("...3456789", abbreviateAround("0123456789", 11, 7));
    }

    @Test
    public void testAbbreviate_negativeIndex() throws Exception {
        try {
            abbreviateAround("0123456789", -1, 4);
        } catch (IndexOutOfBoundsException e) {
            assertEquals("Negative offset [-1] for <<0123456789>>", e.getMessage());
            return;
        }
        fail("IndexOutOfBoundsException expected, but not thrown");
    }

    @Test
    public void testAppend() throws Exception {
        assertNull(StringUtils.append(null));

        assertArrayEquals(FIRST_BYTES, StringUtils.append(FIRST_BYTES));
        assertArrayEquals(FIRST_BYTES, StringUtils.append(null, FIRST_BYTES, null));

        assertArrayEquals(FIRST_AND_SECOND_BYTES, StringUtils.append(FIRST_BYTES, SECOND_BYTES));
        assertArrayEquals(FIRST_AND_SECOND_BYTES, StringUtils.append(null, FIRST_BYTES, null, SECOND_BYTES, null));
    }

    @Test
    public void testNormalizeWhitespace() throws Exception {
        assertEquals("Hello world", StringUtils.normalizeWhitespace("  Hello  \t world \r\n "));
        assertEquals("", StringUtils.normalizeWhitespace(" \r\n   \t    "));
        assertEquals("", StringUtils.normalizeWhitespace(""));
        assertEquals(null, StringUtils.normalizeWhitespace(null));
    }

    @Test
    public void testSplitToSortedSet_null() {
        assertNull(StringUtils.splitToSortedSet(null, (byte) ','));
    }

    @Test
    public void testSplitToSortedSet_oneElement() {
        assertArrayEquals(
                new byte[][]{"12".getBytes()},
                StringUtils.splitToSortedSet("12".getBytes(), (byte) ',').toArray(new byte[0][])
        );
    }

    @Test
    public void testSplitToSortedSet_multipleElements() {
        assertArrayEquals(
                new byte[][]{"12".getBytes(), "34".getBytes(), "56".getBytes()},
                StringUtils.splitToSortedSet("56,12,34".getBytes(), (byte) ',').toArray(new byte[0][])
        );
    }

    @Test
    public void testSplitToSortedSet_duplicates() {
        assertArrayEquals(
                new byte[][]{"12".getBytes()},
                StringUtils.splitToSortedSet("12,12,12".getBytes(), (byte) ',').toArray(new byte[0][])
        );
    }


    @Test
    public void testStringArrayFromBinaryStrings_collection() {
        assertArrayEquals(
                new String[]{"foo", "bar", "bar"},
                StringUtils.stringArrayFromBinaryStrings(asList("foo".getBytes(), "bar".getBytes(), "bar".getBytes()))
        );
    }

    @Test
    public void testStringArrayFromBinaryStrings_array() {
        assertArrayEquals(
                new String[]{"foo", "bar", "bar"},
                StringUtils.stringArrayFromBinaryStrings("foo".getBytes(), "bar".getBytes(), "bar".getBytes())
        );
    }

    @Test
    public void testSubarrayAfter() throws Exception {
        byte[] testData = ArrayUtils.EMPTY_BYTE_ARRAY;
        Assert.assertTrue((StringUtils.subarrayAfter(testData, SEPARATOR) == testData));

        testData = "123".getBytes();
        Assert.assertTrue(Arrays.equals(StringUtils.subarrayAfter(testData, SEPARATOR), ArrayUtils.EMPTY_BYTE_ARRAY));

        testData = "123.$456.".getBytes();
        byte[] expactedData = "456.".getBytes();
        Assert.assertTrue(Arrays.equals(StringUtils.subarrayAfter(testData, SEPARATOR), expactedData));
    }

    @Test(expected = IllegalArgumentException.class)
    public void testSubarrayAfterNullSeparator() {
        StringUtils.subarrayAfter("123".getBytes(), null);
    }

    @Test
    public void testSubarrayBefore() throws Exception {
        byte[] testData = ArrayUtils.EMPTY_BYTE_ARRAY;
        Assert.assertTrue(StringUtils.subarrayBefore(testData, SEPARATOR) == testData);

        testData = "123".getBytes();
        Assert.assertTrue(Arrays.equals(StringUtils.subarrayBefore(testData, null), ArrayUtils.EMPTY_BYTE_ARRAY));
        Assert.assertTrue(StringUtils.subarrayBefore(testData, SEPARATOR) == testData);

        testData = "123.$456.".getBytes();
        byte[] expactedData = "123".getBytes();
        Assert.assertTrue(Arrays.equals(StringUtils.subarrayBefore(testData, SEPARATOR), expactedData));
    }

    @Test
    public void testUrlEncodeJsStyle() {
        String textToEncode = "Skill=General Inquiry";
        textToEncode = StringUtils.urlEncodeJsStyle(textToEncode);
        Assert.assertTrue(textToEncode.equals("Skill%3DGeneral%20Inquiry"));
    }

    @Test
    public void testUrlDecodeJsStyle() {
        String textToEncode = "Skill%3DGeneral%20Inquiry";
        textToEncode = StringUtils.urlDecode(textToEncode);
        Assert.assertTrue(textToEncode.equals("Skill=General Inquiry"));
    }

    @Test
    public void testEncodeLetters() throws UnsupportedEncodingException {
        String textToEncode = "(.*)cricketwireless.com/(contactus|pm/contáctanos)(.*)";
        textToEncode = StringUtils.encodeLetters(textToEncode);
        Assert.assertTrue(textToEncode.equals("(.*)cricketwireless.com/(contactus|pm/cont%C3%A1ctanos)(.*)"));
    }

    @Test
    public void testScreening() throws UnsupportedEncodingException {
        String textToEncode = ".*red-by-sfr.fr(/\\?.*|/)?";
        textToEncode = StringUtils.screening(textToEncode);
        Assert.assertTrue(textToEncode.equals(".*red-by-sfr.fr(/\\\\?.*|/)?"));
    }

    @Test
    public void testEncodeString() {
        String beforeEncoding = "<text>\"value\"=123\0</text>\r\n";
        assertEquals("<text>\"value\"&eq;123&nil;</text>&nl;", StringUtils.encodeString(beforeEncoding));
    }

    @Test
    public void testCompleteEncodeStringForMap() throws Exception {
        String beforeEncoding = "<text>\"&value\"=123\0</text>\r\n";
        CharArrayWriter out = new CharArrayWriter();
        completeEncodeStringForMap(beforeEncoding, out);
        assertEquals("<text>\"&amp;value\"&eq;123&nil;</text>&rt;&nl;", out.toString());
    }

    @Test
    public void testStringToByteArray() {
        assertEquals(
                "hello, how do you do?",
                byteArrayToString(stringToByteArray(CharBuffer.wrap("hello, how do you do?"))));

        String longText = "hello, how do you do?\n" +
                "hello, how do you do?\n" +
                "hello, how do you do?\n" +
                "hello, how do you do?\n" +
                "hello, how do you do?\n" +
                "hello, how do you do?\n" +
                "hello, how do you do?\n" +
                "hello, how do you do?\n" +
                "hello, how do you do?\n" +
                "hello, how do you do?\n" +
                "hello, how do you do?\n";
        assertEquals(
                longText,
                byteArrayToString(stringToByteArray(CharBuffer.wrap(longText))));

        // 10 characters but 11 bytes.
        //
        // This test covers the case when the current implementation of
        // Charset.encode() allocates byte buffer of exactly the needed size
        // (because StandardCharsets.UTF_8.averageBytesPerChar() == 1.1).
        //
        // In this case our implementation of stringToByteArray avoids
        // unnecessary allocation of new array and copying the bytes into it.
        // We just return the array produced by Charset.encode().
        assertEquals(
                "123456789\u0410",
                byteArrayToString(stringToByteArray(CharBuffer.wrap("123456789\u0410"))));

    }

    @Test
    public void testAppendQuoted() {
        appendQuotedAndAssert("\"\"", "");
        appendQuotedAndAssert("\"a\"", "a");
        appendQuotedAndAssert("\"a1\"", "a1");
        appendQuotedAndAssert("\"a1'\"", "a1'");
        appendQuotedAndAssert("\"a1'2\"", "a1\\'2");
        appendQuotedAndAssert("\"a1 2\"", "a1\\ 2");
        appendQuotedAndAssert("\"a1\\\"2\"", "a1\\\"2");
    }

    private static void appendQuotedAndAssert(String expected, String source) {
        StringBuilder out = new StringBuilder();
        appendQuoted(out, source, 0, source.length() - 1);
        assertEquals(expected, out.toString());
    }
}