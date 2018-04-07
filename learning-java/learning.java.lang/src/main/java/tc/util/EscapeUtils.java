package tc.util;

import org.apache.commons.lang3.text.translate.AggregateTranslator;
import org.apache.commons.lang3.text.translate.CharSequenceTranslator;
import org.apache.commons.lang3.text.translate.EntityArrays;
import org.apache.commons.lang3.text.translate.LookupTranslator;
import org.apache.commons.lang3.text.translate.UnicodeEscaper;
import org.apache.commons.lang3.text.translate.UnicodeUnescaper;

/**
 * Utilities to escape-unescape/encode-decode/quote-unquote string values in different formats.
 */
public class EscapeUtils {

    private static final CharSequenceTranslator ESCAPE_JSON = new AggregateTranslator(
            new LookupTranslator(
                    new String[][]{
                            {"\"", "\\\""},
                            {"\\", "\\\\"}
                    }),
            new LookupTranslator(EntityArrays.JAVA_CTRL_CHARS_ESCAPE()),
            UnicodeEscaper.below(0x20)
    );

    private static final CharSequenceTranslator UNESCAPE_JSON = new AggregateTranslator(
            new UnicodeUnescaper(),
            new LookupTranslator(EntityArrays.JAVA_CTRL_CHARS_UNESCAPE()),
            new LookupTranslator(
                    new String[][]{
                            {"\\\\", "\\"},
                            {"\\\"", "\""},
                            {"\\", ""}
                    })
    );

    /**
     * Returns {@code true} if the character is a quote (single or double).
     */
    public static boolean isQuotationMark(char c) {
        return c == '\'' || c == '"';
    }

    /**
     * If {@code stringValue} is surrounded with quotes then returns the quote, otherwise - {@code defaultResult}.
     * <p>Doesn't check escaping with backslash (i.e. works with any escaping technique), it's responsibility of the callee to validate escaping.</p>
     *
     * @return the detected quotation mark or {@code \x00} if they are missing
     * @throws IllegalArgumentException if quotation marks don't match
     */
    public static char getQuotationMark(CharSequence stringValue) {
        final char defaultResult = 0;
        switch (stringValue.length()) {
            case 0:
                return defaultResult;

            case 1:
                if (isQuotationMark(stringValue.charAt(0))) {
                    throw new IllegalArgumentException("No matching quotation mark at the end of [" + stringValue + "]");
                } else {
                    return defaultResult;
                }

            default:
                final char first = stringValue.charAt(0);
                final char last = stringValue.charAt(stringValue.length() - 1);
                if (isQuotationMark(first)) {
                    if (first == last) {
                        return first;
                    } else {
                        if (isQuotationMark(last)) {
                            throw new IllegalArgumentException("Quotation marks don't match: [" + stringValue + "]");
                        } else {
                            throw new IllegalArgumentException("No matching quotation mark at the end of [" + stringValue + "]");
                        }
                    }
                } else {
                    if (isQuotationMark(last)) {
                        throw new IllegalArgumentException("No matching quotation mark at the beginning of [" + stringValue + "]");
                    } else {
                        return defaultResult;
                    }
                }
        }
    }


    /**
     * This method escapes following symbols: ", \ and the control characters (U+0000 through U+001F).
     * <p>
     * Example:
     * {@code "} to {@code \"}<br/>
     * {@code \n} to {@code \\n}<br/>
     * </p>
     * <p>Based on Apache Commons lang3 {@link org.apache.commons.lang3.StringEscapeUtils#escapeEcmaScript}</p>
     *
     * @param input The String to escape.
     */
    public static String escapeJson(String input) {
        return ESCAPE_JSON.translate(input);
    }

    /**
     * This method un-escapes following symbols: ", \, \b, \f, \n, \r, \t, unicode symbols
     * <p>
     * Example:
     * {@code \"} to {@code "}<br/>
     * {@code \\n} to {@code \n}<br/>
     * </p>
     * <p>Based on Apache Commons lang3 {@link org.apache.commons.lang3.StringEscapeUtils#unescapeEcmaScript}</p>
     *
     * @param input The String to un-escape.
     */
    public static String unescapeJson(String input) {
        return UNESCAPE_JSON.translate(input);
    }

    public static int indexOfUnescapedChar(CharSequence str, char findChar) {
        return indexOfUnescapedChar(str, findChar, 0);
    }

    public static int indexOfUnescapedChar(CharSequence str, char findChar, int fromIndex) {
        for (int i = fromIndex; i < str.length(); ++i) {
            char ch = str.charAt(i);
            if (ch == '\\') {
                i++;
            } else if (ch == findChar) {
                return i;
            }
        }
        return -1;
    }

    public static String stringUnescape(String str) throws InvalidEscapeSequenceException {
        if (!str.contains("\\")) {
            return str;
        }
        final int length = str.length();
        StringBuilder sb = new StringBuilder(length - 1);
        for (int i = 0; i < length; ++i) {
            char ch = str.charAt(i);
            char nextCh;
            if (ch == '\\') {
                if (i >= length - 1) {
                    throw InvalidEscapeSequenceException.unterminated(str);
                } else {
                    nextCh = str.charAt(i + 1);
                    if (isQuotationMark(nextCh) || nextCh == '\\') {
                        sb.append(nextCh);
                    } else {
                        throw InvalidEscapeSequenceException.malformed(str, i);
                    }
                }
                i++;
            } else {
                sb.append(ch);
            }
        }
        return sb.toString();
    }

    public static String stringEscape(CharSequence input) {
        final char quotationMark = '"';
        return containsAnyStringMetaChar(input, quotationMark)
                ? stringEscape0(new StringBuilder(input.length()), input, quotationMark).toString()
                : input.toString();
    }

    public static StringBuilder stringEscape(StringBuilder output, CharSequence input, char quotationMark) {
        return containsAnyStringMetaChar(input, quotationMark)
                ? stringEscape0(output, input, quotationMark)
                : output.append(input);
    }


    /**
     * Escapes control and non-ASCII characters, useful for logging input data in case of parsing error.
     */
    @SuppressWarnings({"IfStatementWithTooManyBranches", "OverlyComplexMethod"})
    public static String escapeControlCharsAndNonAscii(String s) {
        if (StringUtils.isEmptyOrNull(s)) {
            return s;
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < s.length(); ++i) {
            char ch = s.charAt(i);
            switch (ch) {
                // backslash must be escaped for strict reversibility
                case '\\':
                    sb.append("\\\\");
                    break;
                case '\b':
                    sb.append("\\b");
                    break;
                case '\n':
                    sb.append("\\n");
                    break;
                case '\t':
                    sb.append("\\t");
                    break;
                case '\f':
                    sb.append("\\f");
                    break;
                case '\r':
                    sb.append("\\r");
                    break;
                default:
                    if (ch >= 0x20 && ch <= 0x7f) {
                        // normal character, no escaping
                        sb.append(ch);
                    } else {
                        // write Unicode escape
                        if (ch > 0xfff) {
                            sb.append("\\u").append(CharSequenceTranslator.hex(ch));
                        } else if (ch > 0xff) {
                            sb.append("\\u0").append(CharSequenceTranslator.hex(ch));
                        } else if (ch > 0xf) {
                            sb.append("\\u00").append(CharSequenceTranslator.hex(ch));
                        } else {
                            sb.append("\\u000").append(CharSequenceTranslator.hex(ch));
                        }
                    }
            }
        }
        return sb.toString();
    }


    /**
     * @see org.apache.commons.lang3.CharSetUtils#containsAny
     */
    private static boolean containsAnyStringMetaChar(CharSequence input, char quotationMark) {
        for (int i = 0; i < input.length(); i++) {
            final char ch = input.charAt(i);
            if (ch == '\\' || ch == quotationMark) {
                return true;
            }
        }
        return false;
    }

    private static StringBuilder stringEscape0(StringBuilder output, CharSequence input, char quotationMark) {
        for (int i = 0; i < input.length(); ++i) {
            char ch = input.charAt(i);
            if (ch == '\\' || ch == quotationMark) {
                output.append('\\').append(ch);
            } else {
                output.append(ch);
            }
        }
        return output;
    }

    /**
     * Find index of last {@code .} character in <i>{@code source}</i>
     * which is not escaped by {@code \} and not bounded by single or double quotes
     *
     * @param source string for searching
     * @param to     position in <i>{@code source}</i> where search should be stopped
     * @return index of last found unescaped {@code .}, or <i>-1</i> if nothing was found
     */
    public static int indexOfLastUnescapedDot(String source, int to) {
        int index = -1;

        if (StringUtils.isEmptyOrNull(source)) {
            return index;
        }
        to = Math.min(source.length(), to);
        Character quote = null;
        for (int i = 0; i < to; i++) {
            char ch = source.charAt(i);
            if (ch == '\\') {
                i++;
                continue;
            }
            if (isQuotationMark(ch)) {
                if (quote == null) {
                    quote = ch;
                } else if (ch == quote) {
                    quote = null;
                }
            } else if (ch == '.' && quote == null) {
                index = i;
            }
        }
        return index;
    }


    /**
     * Thrown to indicate that a method has been passed a string with malformed/unterminated escape sequence
     */
    public static class InvalidEscapeSequenceException extends Exception {
        public InvalidEscapeSequenceException(String message) {
            super(message);
        }

        public InvalidEscapeSequenceException(String message, Throwable cause) {
            super(message, cause);
        }


        public static InvalidEscapeSequenceException malformed(CharSequence malformed, int errorIndex) {
            return new InvalidEscapeSequenceException(getMalformedSequenceMessage(malformed, errorIndex));
        }

        public static InvalidEscapeSequenceException unterminated(CharSequence malformed) {
            return new InvalidEscapeSequenceException(getUnterminatedSequenceMessage(malformed));
        }


        public static String getMalformedSequenceMessage(CharSequence malformedInput, int errorIndex) {
            return String.format("Invalid sequence [%s] at position %s: [%s]",
                    StringUtils.mid(malformedInput, errorIndex, 2),
                    errorIndex,
                    malformedInput
            );
        }

        public static String getUnterminatedSequenceMessage(CharSequence malformed) {
            return "Unexpected end of escape sequence: [" + malformed + ']';
        }
    }
}
