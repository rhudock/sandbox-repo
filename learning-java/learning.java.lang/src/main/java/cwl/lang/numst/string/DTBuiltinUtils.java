package cwl.lang.numst.string;

import tc.util.RegexUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.regex.Pattern;

import static tc.util.StringUtils.byteArrayToString;
import static tc.util.StringUtils.stringToByteArray;

public class DTBuiltinUtils {

    static final String DB_MASKED_TEXT_START_MARKER = "((masked{[";
    static final String DB_MASKED_TEXT_END_MARKER = "]}masked))";
    private static final Pattern DB_MASKED_TEXT_START_MARKER_REGEX = Pattern.compile(Pattern.quote(DB_MASKED_TEXT_START_MARKER));
    private static final Pattern DB_MASKED_TEXT_END_MARKER_REGEX = Pattern.compile(Pattern.quote(DB_MASKED_TEXT_END_MARKER));
    private static final Pattern DB_MASKED_TEXT_REGEXP = Pattern.compile(Pattern.quote(DB_MASKED_TEXT_START_MARKER)
            + "(.*?)" + Pattern.quote(DB_MASKED_TEXT_END_MARKER));
    private static final String MASK_SYMBOL = "x";
    private static Logger LOG = LoggerFactory.getLogger(DTBuiltinUtils.class);

    /**
     * Masks content (with 'X') which was marked for masking by {@link #mask(String)}.
     */
    public static String maskMarkedText(String markedText) {
        try {
            return unmask(RegexUtils.maskGroups(markedText, DB_MASKED_TEXT_REGEXP, MASK_SYMBOL));
        } catch (RuntimeException ex) {
            LOG.error(ex.getMessage(), ex);
            return markedText;
        }
    }

    /**
     * Masks content (with 'X') which was marked for masking by {@link #mask(String)}.
     */
    public static byte[] maskMarkedText(byte[] text) {
        return stringToByteArray(maskMarkedText(byteArrayToString(text)));
    }

    /**
     * Removes mask markers added by {@link #mask(String)}.
     */
    public static String unmask(CharSequence text) {
        String result;
        result = DB_MASKED_TEXT_START_MARKER_REGEX.matcher(text).replaceAll("");
        result = DB_MASKED_TEXT_END_MARKER_REGEX.matcher(result).replaceAll("");
        return result;
    }

    /**
     * Removes mask markers added by {@link #mask(String)}.
     */
    public static byte[] unmask(byte[] text) {
        return stringToByteArray(unmask(byteArrayToString(text)));
    }

    /**
     * Surrounds text with masked markers.
     */
    public static String mask(String textToMask) {
        if (textToMask.contains(DB_MASKED_TEXT_START_MARKER) || textToMask.contains(DB_MASKED_TEXT_END_MARKER)) {
            LOG.error("textToMask contains mask markers");
        }
        return DB_MASKED_TEXT_START_MARKER + textToMask + DB_MASKED_TEXT_END_MARKER;
    }
}
