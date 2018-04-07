package tc.util;


import com.google.common.base.Joiner;
import com.google.common.base.Splitter;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.log4j.Logger;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.CharArrayWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import java.io.Writer;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashSet;
import java.util.List;
import java.util.SortedSet;
import java.util.TreeSet;

import static tc.util.EscapeUtils.escapeControlCharsAndNonAscii;
import static tc.util.EscapeUtils.isQuotationMark;

public final class StringUtils {

    public static final String CHARSET_UTF8_NAME = "UTF-8";
    public static final Charset CHARSET_UTF8 = StandardCharsets.UTF_8;
    public static final byte[] AMP_SIGN_BYTES = "&".getBytes();
    public static final String AMP_SIGN_ENCODED_STRING = "&amp;";
    public static final byte[] AMP_SIGN_ENCODED_BYTES = AMP_SIGN_ENCODED_STRING.getBytes();
    public static final byte[] EQUAL_SIGN_BYTES = "=".getBytes();
    public static final String EQUAL_SIGN_ENCODED_STRING = "&eq;";
    public static final byte[] EQUAL_SIGN_ENCODED_BYTES = EQUAL_SIGN_ENCODED_STRING.getBytes();
    public static final byte[] RETURN_BYTES = "\r".getBytes();
    public static final String RETURN_ENCODED_STRING = "&rt;";
    public static final byte[] RETURN_ENCODED_BYTES = RETURN_ENCODED_STRING.getBytes();
    public static final byte[] NEWLINE_BYTES = "\n".getBytes();
    public static final String NEWLINE_ENCODED_STRING = "&nl;";
    public static final byte[] NEWLINE_ENCODED_BYTES = NEWLINE_ENCODED_STRING.getBytes();
    public static final byte[] NULL_BYTES = "\0".getBytes();
    public static final String NULL_ENCODED_STRING = "&nil;";
    public static final byte[] NULL_ENCODED_BYTES = NULL_ENCODED_STRING.getBytes();
    public static final byte DEFAULT_DELIMETER = (byte) ',';
    public static final Splitter COMMA_SPLITTER = Splitter.on(',');
    public static final Joiner COMMA_JOINER = Joiner.on(',');
    private static final byte[] NULL_PROPERTY_BYTES = "null".getBytes();
    private static final byte[] ZERO_PROPERTY_BYTES = "0".getBytes();
    private static final Logger LOG = Logger.getLogger(StringUtils.class);

    /**
     * Concatenate byte arrays.
     */
    public static byte[] append(byte[]... arrays) {
        if (arrays == null) {
            return null;
        }
        int byteCount = 0;
        for (byte[] data : arrays) {
            if (data != null) {
                byteCount += data.length;
            }
        }

        byte[] retData = new byte[byteCount];
        int position = 0;
        for (byte[] data : arrays) {
            if (data != null) {
                System.arraycopy(data, 0, retData, position, data.length);
                position += data.length;
            }
        }
        return retData;
    }

    public static byte[] getFirstSection(byte[] source, byte[] separator) {
        if (source != null) {
            int index = StringUtils.indexOf(source, separator, 0);
            if (index > -1) {
                source = Arrays.copyOfRange(source, 0, index);
            }
        }
        return source;
    }

    public static boolean contains(byte[] source, byte[] target, int fromIndex) {
        return indexOf(source, target, fromIndex) >= 0;
    }

    public static int indexOf(byte[] source, byte[] target, int fromIndex) {
        int sourceCount = source == null ? 0 : source.length;
        int targetCount = target == null ? 0 : target.length;
        if (fromIndex >= sourceCount) return (targetCount == 0 ? sourceCount : -1);
        if (fromIndex < 0) fromIndex = 0;
        if (targetCount == 0) return fromIndex;
        byte first = target[0];
        int i = fromIndex;
        int max = (sourceCount - targetCount);
        startSearchForFirstChar:
        while (true) {
          /* Look for first character. */

            while (i <= max && source[i] != first) i++;
            if (i > max) return -1;

          /* Found first character, now look at the rest of v2 */

            int j = i + 1;
            int end = j + targetCount - 1;
            int k = 1;
            while (j < end) {
                if (source[j++] != target[k++]) {
                    i++;

            /* Look for str's first char again. */

                    continue startSearchForFirstChar;
                }
            }
            return i;

          /* Found whole string. */
        }
    }

    public static int indexOf(byte[] source, byte target) {
        return indexOf(source, target, 0);
    }

    public static int indexOf(byte[] source, byte target, int fromIndex) {
        for (int i = fromIndex; i < source.length; i++) {
            if (target == source[i]) {
                return i;
            }
        }
        return -1;
    }

    public static int indexOf(byte[][] list, byte[] target) {
        int result = -1;
        for (int i = 0; i < list.length; i++) {
            if (Arrays.equals(list[i], target)) {
                result = i;
                break;
            }
        }
        return result;
    }

    public static byte[] substring(byte[] data, int startIndex, int endIndex) {
        if (startIndex < 0 || endIndex > data.length) {
            throw new IndexOutOfBoundsException("(" + startIndex + ", " + endIndex + ")");
        }
//          if (endIndex > 0 && data[endIndex - 1] < 0x00){
//              /*
//               unicode symbol at the end of the string
//
//               Code Points           1st Byte       2nd Byte       3rd Byte       4th Byte
//               U+0000..U+007F         00..7F
//               U+0080..U+07FF         C2..DF         80..BF
//               U+0800..U+0FFF         E0             A0..BF         80..BF
//               U+1000..U+FFFF         E1..EF         80..BF         80..BF
//               U+10000..U+3FFFF         F0             90..BF         80..BF         80..BF
//               U+40000..U+FFFFF     F1..F3         80..BF         80..BF         80..BF
//               U+100000..U+10FFFF     F4             80..8F         80..BF      80..BF
//               */
//              int unicodeIndex = endIndex - 1;
//              while (unicodeIndex > startIndex && (data[unicodeIndex] < (byte)0xC2 || data[unicodeIndex] > (byte)0xEF)){
//                  unicodeIndex--;
//              }
//              if (data[unicodeIndex] >= (byte)0xC2 && data[unicodeIndex] <= (byte)0xDF){
//                  if (endIndex - unicodeIndex < 2) {
//                      endIndex = unicodeIndex;
//                  }
//              } else if (data[unicodeIndex] >= (byte)0xE0 && data[unicodeIndex] <= (byte)0xEF){
//                  if (endIndex - unicodeIndex < 3) {
//                      endIndex = unicodeIndex;
//                  }
//              }

//          }
        byte[] newData = new byte[endIndex - startIndex];
        System.arraycopy(data, startIndex, newData, 0, endIndex - startIndex);

        return newData;
    }

    /**
     * Returns subarray that located after the separator in the source array.
     *
     * @param source    the array from which the new subarray will be copied, can be {@code null}
     * @param separator array after which located output subarray
     * @return subarray which copied from source array, excluding bytes before separator and separator
     */
    public static byte[] subarrayAfter(final byte[] source, final byte[] separator) {
        if (ArrayUtils.isEmpty(source)) {
            return source;
        }

        if (separator == null) {
            throw new IllegalArgumentException("The separator cannot be null!");
        }

        final int pos = indexOf(source, separator, 0);
        if (pos == ArrayUtils.INDEX_NOT_FOUND) {
            return ArrayUtils.EMPTY_BYTE_ARRAY;
        }
        return Arrays.copyOfRange(source, pos + separator.length, source.length);
    }

    /**
     * Returns subarray that located before the separator in the source array.
     *
     * @param source    the array from which the new subarray will be copied, can be {@code null}
     * @param separator array before which located output subarray
     * @return subarray which copied from source array, excluding separator and bytes after separator
     */
    public static byte[] subarrayBefore(final byte[] source, final byte[] separator) {
        if (ArrayUtils.isEmpty(source)) {
            return source;
        }

        if (separator == null) {
            return ArrayUtils.EMPTY_BYTE_ARRAY;
        }

        final int pos = indexOf(source, separator, 0);
        if (pos == ArrayUtils.INDEX_NOT_FOUND) {
            return source;
        }
        return Arrays.copyOfRange(source, 0, pos);
    }

    /**
     * Gets {@code maxCount} (at most) characters from the middle of a {@link CharSequence}.
     *
     * @see java.lang.CharSequence#subSequence(int, int)
     * @see java.lang.String#substring(int, int)
     * @see org.apache.commons.lang3.StringUtils#mid
     */
    public static CharSequence mid(CharSequence source, int start, int maxCount) {
        return source.subSequence(start, Math.min(start + maxCount, source.length()));
    }

    /**
     * Abbreviates a String using ellipses. This will turn "Now is the time for all good men" into "...is the time for...".
     * <p>Differs from {@link org.apache.commons.lang3.StringUtils#abbreviate(java.lang.String, int, int)} by:<br/>
     * adding surrounding chars (instead of following ones only)<br/>
     * and ensuring that {@code maxSize} chars are returned from both directions (instead of {@code maxWidth - 3}) if available.</p>
     *
     * @param offset  position for abbreviation center
     * @param maxSize maximum count of characters to return around {@code offset} position
     * @see org.apache.commons.lang3.StringUtils#abbreviate(java.lang.String, int, int)
     */
    public static String abbreviateAround(String str, final int offset, final int maxSize) {
        if (str == null) {
            return null;
        }
        if (maxSize < 4) {
            throw new IllegalArgumentException("Minimum context size is 4");
        }
        if (offset < 0) {
            throw new IndexOutOfBoundsException("Negative offset [" + offset + "] for <<" + escapeControlCharsAndNonAscii(str) + ">>");
        }
        final int start;
        final int end;
        if (offset >= str.length()) {
            start = Math.max(0, str.length() - maxSize);
            end = str.length();
        } else {
            start = Math.max(0, offset - maxSize);
            end = Math.min(str.length(), offset + maxSize);
        }
        if (start == 0 && end == str.length()) {
            return str;
        }
        final String abrevMarker = "...";
        StringBuilder sb = new StringBuilder(end - start + (start > 0 ? abrevMarker.length() : 0) + (end < str.length() ? abrevMarker.length() : 0));
        if (start > 0) {
            sb.append(abrevMarker);
        }
        sb.append(str.substring(start, end));
        if (end < str.length()) {
            sb.append(abrevMarker);
        }
        return sb.toString();
    }

    public static byte[] replace(byte[] main, byte source, byte destination) {
        if (main != null) {
            for (int i = 0; i < main.length; i++) {
                if (main[i] == source)
                    main[i] = destination;
            }
        }
        return main;
    }

    public static int replace(byte[] source, ObjectWrapper<byte[]> destinationWrapper, byte[][] search, byte[][] replace, int destinationIndex) {
        byte[] destination = destinationWrapper.get();
        int sourceIndex = 0;
        boolean foundFlag;
        int i = 0;
        while (i < source.length) {
            for (int j = 0; j < search.length; j++) {
                if (source[i] == search[j][0]) {
                    foundFlag = true;
                    for (int k = i + 1; k < i + search[j].length; k++) {
                        if (source[k] != search[j][k]) {
                            foundFlag = false;
                            break;
                        }
                    }
                    if (foundFlag) {
                        int sourceLength = i - sourceIndex;
                        if (destination.length < destinationIndex + sourceLength + replace[j].length) {
                            byte[] extension = new byte[(int) (Math.max(source.length * 1.1, destination.length * 1.5))];
                            System.arraycopy(destination, 0, extension, 0, destination.length);
                            destination = extension;
                        }
                        System.arraycopy(source, sourceIndex, destination, destinationIndex, sourceLength);
                        destinationIndex += sourceLength;
                        System.arraycopy(replace[j], 0, destination, destinationIndex, replace[j].length);
                        destinationIndex += replace[j].length;
                        i += search[j].length - 1;
                        sourceIndex = i + 1;
                        break;
                    }
                }
            }
            i++;
        }

        int sourceLength = source.length - sourceIndex;
        System.arraycopy(source, sourceIndex, destination, destinationIndex, sourceLength);
        destinationIndex += sourceLength;
        destinationWrapper.set(destination);

        return destinationIndex;
    }

    public static byte[] replace(byte[] main, byte[] source, byte[] destination) {
        byte[] newStr = null;
        try {
            int startIndex = 0;
            int cutIndex = 0;
            boolean foundMatch = false;
            while (true) {
                cutIndex = indexOf(main, source, startIndex);
                if (cutIndex == -1) break;
                foundMatch = true;
                newStr = append(newStr, substring(main, startIndex, cutIndex));
                newStr = append(newStr, destination);
                startIndex = cutIndex + source.length;
            }
            if (!foundMatch) return main;
            newStr = append(newStr, substring(main, startIndex, main.length));
            return newStr;
        } catch (RuntimeException e) {
            LOG.error("Failed to replace " + logstr(source) + " with " + logstr(destination) + " in " + logstr(main), e);
        }
        return null;
    }

    public static byte[] remove(byte[] main, byte[] source) {
        byte[] newStr = null;
        try {
            int startIndex = 0;
            int cutIndex = 0;
            boolean foundMatch = false;
            while (true) {
                cutIndex = indexOf(main, source, startIndex);
                if (cutIndex == -1) break;
                foundMatch = true;
                newStr = append(newStr, substring(main, startIndex, cutIndex));
                startIndex = cutIndex + source.length;
            }
            if (!foundMatch) return main;
            newStr = append(newStr, substring(main, startIndex, main.length));
            return newStr;
        } catch (RuntimeException e) {
            LOG.error("Failed to remove " + logstr(source) + " from " + logstr(main), e);
        }
        return null;
    }

    public static byte[] completeEncodeStringForMap(final byte[] message) {
        byte[] retBytes = replace(message, AMP_SIGN_BYTES, AMP_SIGN_ENCODED_BYTES);
        retBytes = replace(retBytes, EQUAL_SIGN_BYTES, EQUAL_SIGN_ENCODED_BYTES);
        retBytes = replace(retBytes, RETURN_BYTES, RETURN_ENCODED_BYTES);
        retBytes = replace(retBytes, NEWLINE_BYTES, NEWLINE_ENCODED_BYTES);
        return replace(retBytes, NULL_BYTES, NULL_ENCODED_BYTES);
    }

    public static byte[] completeDecodeStringFromMap(final byte[] message) {
        byte[] retBytes = replace(message, NULL_ENCODED_BYTES, NULL_BYTES);
        retBytes = replace(retBytes, NEWLINE_ENCODED_BYTES, NEWLINE_BYTES);
        retBytes = replace(retBytes, RETURN_ENCODED_BYTES, RETURN_BYTES);
        retBytes = replace(retBytes, EQUAL_SIGN_ENCODED_BYTES, EQUAL_SIGN_BYTES);
        return replace(retBytes, AMP_SIGN_ENCODED_BYTES, AMP_SIGN_BYTES);
    }

    /**
     * This method will replace all equal symbols with &eq; and it will
     * replace all newline characters (\n only) with &nl;
     *
     * @deprecated use {@link #completeEncodeStringForMap} instead
     */
    @Deprecated
    public static byte[] encodeStringForMap(final byte[] message) {
        byte[] retBytes = replace(message, EQUAL_SIGN_BYTES, EQUAL_SIGN_ENCODED_BYTES);
        retBytes = remove(retBytes, RETURN_BYTES);
        retBytes = replace(retBytes, NEWLINE_BYTES, NEWLINE_ENCODED_BYTES);
        retBytes = replace(retBytes, NULL_BYTES, NULL_ENCODED_BYTES);
        return retBytes;
    }

    /**
     * Encode message according to protocol of transmission messages between server and AI sides:
     * <p>
     * {@code '='} replaces by "&eq;", {@code '\n'} replaces by "&nl;", {@code '\0'} replaces by "&nil;",
     * removes {@code '\r'}
     *
     * @param message source to encode
     * @return new encoded string
     */
    public static String encodeString(final String message) {
        if (isEmptyOrNull(message)) {
            return message;
        }
        CharArrayWriter charArrayWriter = new CharArrayWriter(message.length());
        for (int i = 0; i < message.length(); i++) {
            try {
                switch (message.charAt(i)) {
                    case '=':
                        charArrayWriter.write(EQUAL_SIGN_ENCODED_STRING);
                        break;
                    case '\r':
                        break;
                    case '\n':
                        charArrayWriter.write(NEWLINE_ENCODED_STRING);
                        break;
                    case '\0':
                        charArrayWriter.write(NULL_ENCODED_STRING);
                        break;
                    default:
                        charArrayWriter.write(message.charAt(i));
                }
            } catch (IOException e) {
                LOG.error(e);
            }
        }
        return charArrayWriter.toString();
    }

    /**
     * Encodes charSequence according to protocol of transmission messages between server and AI sides:
     * <p>
     * <p>{@code &} is replaced by {@code amp;}</p>
     * <p>{@code =} is replaced by {@code &eq;}</p>
     * <p>{@code \r} is replaced by {@code &rt;}</p>
     * <p>{@code \n} is replaced by {@code &nl;}</p>
     * <p>{@code \0} is replaced by {@code &nil;}</p>
     *
     * @param source source to encode
     * @param out    result will be placed here
     */
    public static void completeEncodeStringForMap(final CharSequence source, final Writer out) throws IOException {
        for (int i = 0; i < source.length(); i++) {
            switch (source.charAt(i)) {
                case '&':
                    out.write(AMP_SIGN_ENCODED_STRING);
                    break;
                case '=':
                    out.write(EQUAL_SIGN_ENCODED_STRING);
                    break;
                case '\r':
                    out.write(RETURN_ENCODED_STRING);
                    break;
                case '\n':
                    out.write(NEWLINE_ENCODED_STRING);
                    break;
                case '\0':
                    out.write(NULL_ENCODED_STRING);
                    break;
                default:
                    out.write(source.charAt(i));
            }
        }
    }

    /**
     * This method will replace all &eq; with equal symbols and it will
     * replace all &nl; with newline characters (\n only)
     *
     * @deprecated use {@link #completeDecodeStringFromMap} instead
     */
    @Deprecated
    public static byte[] decodeStringFromMap(final byte[] message) {
        byte[] retBytes = replace(message, EQUAL_SIGN_ENCODED_BYTES, EQUAL_SIGN_BYTES);
        retBytes = replace(retBytes, NEWLINE_ENCODED_BYTES, NEWLINE_BYTES);
        retBytes = replace(retBytes, NULL_ENCODED_BYTES, NULL_BYTES);
        return retBytes;
    }

    //this method will replace all equal symbols with &eq; and it will
    //replace all newline characters (\n only) with &nl;
    public static String encodeStringForMap(final String message) {
        String retString = replace(message, "=", "&eq;");
        retString = replace(retString, "\n", "&nl;");
        retString = replace(retString, "\0", "&nil;");
        return retString;
    }

    //this method will replace all &eq; with equal symbols and it will
    //replace all &nl; with newline characters (\n only)
    public static String decodeStringFromMap(final String message) {
        String retString = replace(message, "&eq;", "=");
        retString = replace(retString, "&nl;", "\n");
        retString = replace(retString, "&nil;", "\0");
        return retString;
    }

    public static String completeEncodeStringForMap(final String message) {
        String retString = replace(message, "&", "&amp;");
        retString = replace(retString, "\0", "&nil;");
        retString = replace(retString, "\r", "");
        retString = replace(retString, "\n", "&nl;");
        retString = replace(retString, "=", "&eq;");
        return retString;
    }

    public static String completeDecodeStringFromMap(final String message) {
        String retString = replace(message, "&eq;", "=");
        retString = replace(retString, "&nl;", "\n");
        retString = replace(retString, "&rt;", "\r");
        retString = replace(retString, "&nil;", "\0");
        return replace(retString, "&amp;", "&");
    }

    public static byte[] completeEncodeFromString(final String message) {
        return stringToByteArray(completeEncodeStringForMap(message));
    }

    public static String completeDecodeToString(final byte[] message) {
        return byteArrayToStringOrNull(completeDecodeStringFromMap(message));
    }

    public static boolean isSameStr(final byte[] bytes1, final byte[] bytes2) {
        return Arrays.equals(bytes1, bytes2);
    }

    public static String replace(final String str, final String from, final String to) {
        if (str == null) return null;
        int c = 0;
        int i = str.indexOf(from, c);
        if (i == -1)
            return str;

        final StringBuilder buf = new StringBuilder(str.length() + to.length());
        do {
            buf.append(str.substring(c, i));
            buf.append(to);
            c = i + from.length();
        } while ((i = str.indexOf(from, c)) != -1);

        if (c < str.length())
            buf.append(str.substring(c, str.length()));

        return buf.toString();
    }

    // TODO: rename original join method
    public static byte[] join(List<ByteArrayWrapper> list, byte delimiter) {
        if (list == null) return null;

        //first determine the size needed
        int byteCount = 0;
        for (ByteArrayWrapper dataWrapper : list) {
            byteCount += dataWrapper.getData().length;
            byteCount++; //need to account for the comma we'll be adding
        }
        byteCount--; //we won't add a trailing comma, so don't create a space for it
        //now actually construct the byte array
        byte[] listBytes = new byte[byteCount];
        int position = 0;
        for (ByteArrayWrapper dataWrapper : list) {
            byte[] dataBytes = dataWrapper.getData();
            System.arraycopy(dataBytes, 0, listBytes, position, dataBytes.length);
            position += dataBytes.length;
            //we won't add a comma for the last one
            if (position < listBytes.length) {
                listBytes[position] = delimiter;
                position++;
            }
        }
        return listBytes;
    }

    public static byte[] join(Iterable<byte[]> list) {
        return join(list, DEFAULT_DELIMETER);
    }

    public static byte[] join(Iterable<byte[]> list, byte delimiter) {
        if (list == null) return null;

        //first determine the size needed
        int byteCount = 0;
        for (byte[] data : list) {
            if (data != null)
                byteCount += data.length;
            byteCount++; //need to account for the comma we'll be adding
        }
        byteCount--; //we won't add a trailing comma, so don't create a space for it
        if (byteCount < 0) return null;
        //now actually construct the byte array
        byte[] listBytes = new byte[byteCount];
        int position = 0;
        for (byte[] data : list) {
            if (data != null) {
                System.arraycopy(data, 0, listBytes, position, data.length);
                position += data.length;
            }
            //we won't add a comma for the last one
            if (position < listBytes.length) {
                listBytes[position] = delimiter;
                position++;
            }
        }
        return listBytes;
    }

    public static byte[] join(byte delimiter, byte[]... list) {
        if (list == null) return null;

        //first determine the size needed
        int byteCount = 0;
        for (byte[] data : list) {
            if (data != null) {
                byteCount += data.length;
                byteCount++; //need to account for the comma we'll be adding
            }
        }
        byteCount--; //we won't add a trailing comma, so don't create a space for it
        //now actually construct the byte array
        byte[] listBytes = new byte[byteCount];
        int position = 0;
        for (byte[] data : list) {
            if (data != null) {
                System.arraycopy(data, 0, listBytes, position, data.length);
                position += data.length;
                //we won't add a comma for the last one
                if (position < listBytes.length) {
                    listBytes[position] = delimiter;
                    position++;
                }
            }
        }
        return listBytes;
    }

    // TODO: rename original split method
    public static List<byte[]> split2(byte[] delimitedString, byte delimiter) {
        if (delimitedString == null) return null;
        List<byte[]> tokens = new ArrayList<byte[]>();
        if (delimitedString.length == 0) return tokens;
        int startPos = 0;
        for (int i = 0; i < delimitedString.length; i++) {
            if (delimitedString[i] == delimiter) {
                if (i - startPos > 0) {
                    byte[] token = new byte[i - startPos];
                    System.arraycopy(delimitedString, startPos, token, 0, token.length);
                    tokens.add(token);
                }
                startPos = i + 1;
            } else if (i == delimitedString.length - 1) //this means the last byte is reached, so tokenize the rest
            {
                byte[] token = new byte[i - startPos + 1];
                System.arraycopy(delimitedString, startPos, token, 0, token.length);
                tokens.add(token);
            }
        }
        if (delimitedString.length == startPos) {
            tokens.add(ArrayUtils.EMPTY_BYTE_ARRAY);
        }
        return tokens;
    }

    public static SortedSet<byte[]> splitToSortedSet(byte[] delimitedString, byte delimiter) {
        if (delimitedString == null) {
            return null;
        }
        if (delimitedString.length == 0) {
            return CollectionsUtil.EMPTY_SORTED_BYTE_ARRAY_SET;
        }

        SortedSet<byte[]> tokens = new TreeSet<>(BytesComparator.INSTANCE);
        int startPos = 0;
        for (int i = 0; i < delimitedString.length; i++) {
            if (delimitedString[i] == delimiter) {
                if (i - startPos > 0) {
                    byte[] token = new byte[i - startPos];
                    System.arraycopy(delimitedString, startPos, token, 0, token.length);
                    tokens.add(token);
                }
                startPos = i + 1;
            } else if (i == delimitedString.length - 1) //this means the last byte is reached, so tokenize the rest
            {
                byte[] token = new byte[i - startPos + 1];
                System.arraycopy(delimitedString, startPos, token, 0, token.length);
                tokens.add(token);
            }
        }
        if (delimitedString.length == startPos) {
            tokens.add(ArrayUtils.EMPTY_BYTE_ARRAY);
        }
        return tokens;
    }

    public static HashSet<String> splitToHashSet(String value) {
        if (StringUtils.isEmptyOrNull(value)) {
            return null;
        }
        return new HashSet<>(COMMA_SPLITTER.splitToList(value));
    }

    public static List<String> splitToList(String value) {
        if (StringUtils.isEmptyOrNull(value)) {
            return null;
        }
        return COMMA_SPLITTER.splitToList(value);
    }

    public static String join(Collection<String> values) {
        if (values == null) {
            return null;
        }
        return COMMA_JOINER.join(values);
    }

    public static List<ByteArrayWrapper> split(byte[] delimitedString, byte delimiter) {
        if (delimitedString == null) return null;
        List<ByteArrayWrapper> tokens = new ArrayList<ByteArrayWrapper>();
        int startPos = 0;
        for (int i = 0; i < delimitedString.length; i++) {
            if (delimitedString[i] == delimiter) {
                if (i - startPos > 0) {
                    byte[] token = new byte[i - startPos];
                    System.arraycopy(delimitedString, startPos, token, 0, token.length);
                    tokens.add(new ByteArrayWrapper(token));
                }
                startPos = i + 1;
            } else if (i == delimitedString.length - 1) //this means the last byte is reached, so tokenize the rest
            {
                byte[] token = new byte[i - startPos + 1];
                System.arraycopy(delimitedString, startPos, token, 0, token.length);
                tokens.add(new ByteArrayWrapper(token));
            }
        }
        return tokens;
    }

    public static List<byte[]> split(byte[] delimitedString, byte delimiter, ByteArrayWrapper rest) {
        if (delimitedString == null) return null;
        List<byte[]> tokens = new ArrayList<byte[]>();
        rest.setData(null);
        int startPos = 0;
        for (int i = 0; i < delimitedString.length; i++) {
            if (delimitedString[i] == delimiter) {
                if (i - startPos > 0) {
                    if (startPos == 0 && i == delimitedString.length - 1) {
                        tokens.add(delimitedString);
                    } else {
                        byte[] token = new byte[i - startPos];
                        System.arraycopy(delimitedString, startPos, token, 0, token.length);
                        tokens.add(token);
                    }
                }
                startPos = i + 1;
            } else if (i == delimitedString.length - 1) //this means the last byte is reached, so tokenize the rest
            {
                byte[] token = new byte[i - startPos + 1];
                System.arraycopy(delimitedString, startPos, token, 0, token.length);
                rest.setData(token);
            }
        }
        return tokens;
    }

    public static boolean startsWith(@Nonnull byte[] valueToCheck, @Nonnull byte[] subValue) {
        if (valueToCheck.length < subValue.length) return false;
        for (int i = 0; i < subValue.length; i++) {
            if (valueToCheck[i] != subValue[i])
                return false;
        }
        return true;
    }

    public static boolean isEmptyPropertyValue(@Nullable byte[] valueToCheck) {
        return valueToCheck == null || valueToCheck.length == 0 ||
                Arrays.equals(NULL_PROPERTY_BYTES, valueToCheck) ||
                Arrays.equals(ZERO_PROPERTY_BYTES, valueToCheck);
    }

    @Nonnull
    public static String logstr(@Nullable byte[] value) {
        return value == null ? "NULL" : "[" + new String(value, CHARSET_UTF8) + "]";
    }

    @Nonnull
    public static String logstr(@Nullable String value) {
        return value == null ? "NULL" : "[" + value + "]";
    }

    @Nonnull
    @SuppressWarnings("ForLoopReplaceableByForEach")
    public static String logstr(@Nullable String... values) {
        if (values == null) {
            return "NULL";
        } else {
            boolean first = true;
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0, valuesLength = values.length; i < valuesLength; i++) { // optimized "for" loop
                if (first) {
                    first = false;
                } else {
                    sb.append(",");
                }
                logstr(sb, values[i]);
            }
            return sb.append("]").toString();
        }
    }

    /**
     * Formats string list for logging.
     *
     * @return {@code "[[111],[222],...]"}.
     * Special cases: {@code "NULL"} for {@code null}, {@code "[]"} for empty list, {@code "[NULL]"} for list with single {@code null} item.
     */
    @Nonnull
    public static <T> String logstr(@Nullable Iterable<T> values) {
        if (values == null) {
            return "NULL";
        } else {
            boolean first = true;
            StringBuilder sb = new StringBuilder("[");
            for (T value : values) {
                if (first) {
                    first = false;
                } else {
                    sb.append(",");
                }
                logstr(sb, value);
            }
            return sb.append("]").toString();
        }
    }

    @Nonnull
    public static String logstr(@Nullable Enumeration<String> values) {
        if (values == null) {
            return "NULL";
        } else {
            return logstr(Collections.list(values));
        }
    }

    @Nonnull
    public static String logstr(@Nullable Object value) {
        return value == null ? "NULL" : "[" + value.toString() + "]";
    }

    @Nonnull
    public static void logstr(@Nonnull StringBuilder sb, @Nullable Object value) {
        if (value == null) {
            sb.append("NULL");
        } else {
            if (value instanceof byte[]) {
                sb.append(logstr((byte[]) value));
            } else {
                sb.append('[').append(value.toString()).append(']');
            }
        }
    }

    @Nonnull
    public static String byteArrayToString(@Nullable byte[] value) {
        return value == null ? "" : new String(value, CHARSET_UTF8);
    }

    public static String byteArrayToStringOrNull(@Nullable byte[] value) {
        return value == null ? null : new String(value, CHARSET_UTF8);
    }

    @Nonnull
    public static String byteToString(byte value) {
        return new String(new byte[]{value}, CHARSET_UTF8);
    }

    public static byte[] stringToByteArray(@Nullable String value) {
        return value == null ? null : value.getBytes(CHARSET_UTF8);
    }

    public static byte[] stringToByteArray(@Nullable CharBuffer str) {
        if (str == null) {
            return null;
        }

        ByteBuffer byteBuf = CHARSET_UTF8.encode(str);

        // Extract bytes from the byteBuf.

        // We are allowed to call byteBuf.array() because:
        // - Charset.encode javadoc says it's equivalent to calling CharsetEncoder.encode;
        // - CharsetEncoder.encode says it returns a newly-allocated byte buffer;
        // - ByteBuffer.allocate guarantees the buffer has a backing array.
        byte[] bytes = byteBuf.array();

        if (bytes.length == byteBuf.remaining()) {
            return bytes;
        } else {
            return Arrays.copyOf(bytes, byteBuf.remaining());
        }
    }

    public static String[] stringArrayFromBinaryStrings(Collection<byte[]> binaryStrings) {
        if (binaryStrings == null) {
            return null;
        }
        if (binaryStrings.isEmpty()) {
            return ArrayUtils.EMPTY_STRING_ARRAY;
        }
        String[] result = new String[binaryStrings.size()];
        int i = 0;
        for (byte[] binaryString : binaryStrings) {
            result[i++] = byteArrayToStringOrNull(binaryString);
        }
        return result;
    }

    public static String[] stringArrayFromBinaryStrings(byte[]... binaryStrings) {
        if (binaryStrings == null) {
            return null;
        }
        if (binaryStrings.length == 0) {
            return ArrayUtils.EMPTY_STRING_ARRAY;
        }
        String[] result = new String[binaryStrings.length];
        for (int i = 0; i < binaryStrings.length; i++) {
            result[i] = byteArrayToStringOrNull(binaryStrings[i]);
        }
        return result;
    }

    public static InputStream newUtf8InputStream(String input) {
        return new ByteArrayInputStream(input.getBytes(CHARSET_UTF8));
    }

    /**
     * Escapes text into URL encoding.
     * <p>
     * <b>Note: result differs from JavaScript's {@code decodeURIComponent()} function</b>,
     * e.g. a space is encoded as {@code +}, not as {@code %20}.
     * </p>
     */
    @Nonnull
    public static String urlEncode(@Nullable String text) {
        if (isEmptyOrNull(text)) {
            return "";
        } else {
            try {
                return URLEncoder.encode(text, CHARSET_UTF8_NAME);
            } catch (UnsupportedEncodingException e) {
                // cannot happen, UTF-8 is always supported by JLS.
                LOG.error("urlEncode: UTF-8 not supported by JVM?!", e);
            }
            return "Error occurred during URL encoding";
        }
    }

    @Nonnull
    public static String urlDecode(@Nullable String text) {
        if (isEmptyOrNull(text)) {
            return "";
        } else {
            try {
                return URLDecoder.decode(text, CHARSET_UTF8_NAME);
            } catch (UnsupportedEncodingException e) {
                // cannot happen, UTF-8 is always supported by JLS.
                LOG.error("urlDecode: UTF-8 not supported by JVM?!", e);
            }
            return "Error occurred during URL decoding";
        }
    }

    /**
     * Spaces are encoded to "+" instead of "%20" so need replacing to be equal to JavaScript encoded values.
     * Use {@link #urlDecode(String)} for decoding.
     *
     * @param text text to encode
     * @return URL encoded text in JS style
     */
    public static String urlEncodeJsStyle(String text) {
        return urlEncode(text).replaceAll("\\+", "%20");
    }

    public static boolean isNull(Object inObj) {
        return inObj == null;
    }

    public static boolean isEmptyOrNull(String inString) {
        return inString == null || inString.isEmpty();
    }

    /**
     * Replaces multiple spaces (including tabs, new line characters) by a single space character.
     * Removes spaces from the start and end of the string.
     *
     * @param input String to normalize spaces in, may be null
     * @return String with normalized spaces, <code>null</code> if input string is null
     */
    public static String normalizeWhitespace(String input) {
        return input == null ? input : input.replaceAll("\\s+", " ").trim();
    }

    /**
     * <p>Escapes the characters in a <code>String</code> using JavaScript String rules.</p>
     * <p>Escapes any values it finds into their JavaScript String form.
     * Deals correctly with quotes and control-chars (tab, backslash, cr, ff, etc.) </p>
     * <p>
     * <p>So a tab becomes the characters <code>'\\'</code> and
     * <code>'t'</code>.</p>
     * <p>
     * <p>The only difference between Java strings and JavaScript strings
     * is that in JavaScript, a single quote must be escaped.</p>
     * <p>
     * <p>Example:
     * <pre>
     * input string: He didn't say, "Stop!"
     * output string: He didn\'t say, \"Stop!\"
     * </pre>
     * </p>
     * <p>
     * Copied from Apache Commons Lang (org.apache.commons.lang3.StringEscapeUtils class).
     *
     * @param str String to escape values in, may be null
     * @return String with escaped values, <code>null</code> if null string input
     */
    public static String escapeJavaScript(String str) {
        return escapeJavaStyleString(str, true);
    }

    /**
     * <p>Worker method for the {@link #escapeJavaScript(String)} method.</p>
     * <p>
     * Copied from Apache Commons Lang (org.apache.commons.lang3.StringEscapeUtils class).
     *
     * @param str                String to escape values in, may be null
     * @param escapeSingleQuotes escapes single quotes if <code>true</code>
     * @return the escaped string
     */
    private static String escapeJavaStyleString(String str, boolean escapeSingleQuotes) {
        if (str == null) {
            return null;
        }
        try {
            StringWriter writer = new StringWriter(str.length() * 2);
            escapeJavaStyleString(writer, str, escapeSingleQuotes);
            return writer.toString();
        } catch (IOException ioe) {
            // this should never ever happen while writing to a StringWriter
            LOG.error("Failed to escape " + logstr(str) + " for syntax of JavaScript string literal", ioe);
            return null;
        }
    }

    /**
     * <p>Worker method for the {@link #escapeJavaScript(String)} method.</p>
     * <p>
     * Copied from Apache Commons Lang (org.apache.commons.lang3.StringEscapeUtils class).
     *
     * @param out               write to receieve the escaped string
     * @param str               String to escape values in, may be null
     * @param escapeSingleQuote escapes single quotes if <code>true</code>
     * @throws IOException if an IOException occurs
     */
    private static void escapeJavaStyleString(Writer out, String str, boolean escapeSingleQuote) throws IOException {
        if (out == null) {
            throw new IllegalArgumentException("The Writer must not be null");
        }
        if (str == null) {
            return;
        }
        int sz;
        sz = str.length();
        for (int i = 0; i < sz; i++) {
            char ch = str.charAt(i);

            // handle unicode
            if (ch > 0xfff) {
                out.write("\\u" + hex(ch));
            } else if (ch > 0xff) {
                out.write("\\u0" + hex(ch));
            } else if (ch > 0x7f) {
                out.write("\\u00" + hex(ch));
            } else if (ch < 32) {
                switch (ch) {
                    case '\b':
                        out.write('\\');
                        out.write('b');
                        break;
                    case '\n':
                        out.write('\\');
                        out.write('n');
                        break;
                    case '\t':
                        out.write('\\');
                        out.write('t');
                        break;
                    case '\f':
                        out.write('\\');
                        out.write('f');
                        break;
                    case '\r':
                        out.write('\\');
                        out.write('r');
                        break;
                    default:
                        if (ch > 0xf) {
                            out.write("\\u00" + hex(ch));
                        } else {
                            out.write("\\u000" + hex(ch));
                        }
                        break;
                }
            } else {
                switch (ch) {
                    case '\'':
                        if (escapeSingleQuote) {
                            out.write('\\');
                        }
                        out.write('\'');
                        break;
                    case '"':
                        out.write('\\');
                        out.write('"');
                        break;
                    case '\\':
                        out.write('\\');
                        out.write('\\');
                        break;
                    default:
                        out.write(ch);
                        break;
                }
            }
        }
    }

    /**
     * <p>Returns an upper case hexadecimal <code>String</code> for the given
     * character.</p>
     * <p>
     * Copied from Apache Commons Lang (org.apache.commons.lang3.StringEscapeUtils class).
     *
     * @param ch The character to convert.
     * @return An upper case hexadecimal <code>String</code>
     */
    private static String hex(char ch) {
        return Integer.toHexString(ch).toUpperCase();
    }

    /**
     * Writes <code>content.length</code> bytes from the specified byte array to this output stream.
     * This is similar to {@link java.io.ByteArrayOutputStream#write(byte[])}, but doesn't throw {@link java.io.IOException}.
     *
     * @param byteArrayOutputStream output stream in which the data will be written
     * @param content               bytes for writing
     */
    public static void writeBytesToStream(ByteArrayOutputStream byteArrayOutputStream, byte[] content) {
        byteArrayOutputStream.write(content, 0, content.length);
    }

    public static String encodeLetters(String source) throws UnsupportedEncodingException {
        char[] characters = source.toCharArray();
        String result = new String();
        for (char character : characters) {
            if (!Character.isLetter(character)) {
                result += character;
            } else {
                result += URLEncoder.encode(String.valueOf(character), "UTF-8");
            }
        }
        return result;
    }

    public static String screening(String source) {
        String regexp = "\\\\";
        return source.replaceAll(regexp, "\\\\\\\\");
    }

    /**
     * If <i>{@code source}</i> is quoted then it will be added into <i>{@code out}</i> as is,
     * otherwise in <i>{@code out}</i> will be added unescaped and quoted value of <i>{@code source}</i>
     *
     * @param out    output in which will be put data from <i>{@code source}</i>
     * @param from   position from which data <i>{@code source}</i> will be read, inclusive
     * @param to     position before which data <i>{@code source}</i> will be read, inclusive
     * @param source data source for processing
     */
    public static void appendQuoted(StringBuilder out, String source, int from, int to) {
        if (isQuotedSequence(source, from, to)) {
            append(out, source, from, to);
        } else {
            out.append("\"");
            unescapeAndAppend(out, source, from, to);
            out.append("\"");
        }
    }

    private static void unescapeAndAppend(StringBuilder out, String source, int from, int to) {
        if (isInRangeOf(source, from, to)) {
            for (; from <= to; from++) {
                char ch = source.charAt(from);
                if (ch == '\\') {
                    int indexOfNext = from + 1;
                    if (indexOfNext <= to) {
                        char nextCh = source.charAt(indexOfNext);
                        if (nextCh == '\"') {
                            out.append(ch);
                            out.append(nextCh);
                        } else {
                            out.append(nextCh);
                        }
                    }
                    from++;
                } else {
                    out.append(ch);
                }
            }
        }
    }

    public static void append(StringBuilder out, String source, int from, int to) {
        if (isInRangeOf(source, from, to)) {
            for (; from <= to; from++) {
                out.append(source.charAt(from));
            }
        }
    }

    /**
     * Verify does substring from <i>{@code startIndex}</i> to <i>{@code endIndex}</i> in <i>{@code source}</i> is a quoted string
     *
     * @param source string for searching
     * @param from   index of begin of substring, inclusive
     * @param to     index of end of substring, inclusive
     * @return <i>{@code true}</i> if substring from <i>{@code startIndex}</i> to <i>{@code endIndex}</i> in <i>{@code source}</i> is a quoted string
     */
    public static boolean isQuotedSequence(String source, int from, int to) {
        if (isInRangeOf(source, from, to) && from != to) {
            char firstCharacter = source.charAt(from);
            char lastCharacter = source.charAt(to);
            return firstCharacter == lastCharacter
                    && isQuotationMark(firstCharacter);
        }
        return false;
    }

    /**
     * Converts array of strings to two-dimensional bytes array.
     */
    public static byte[][] toBytesArrays(String[] strings) {
        if (strings == null) return null;

        byte[][] data = new byte[strings.length][];
        for (int i = 0; i < strings.length; i++) {
            String string = strings[i];
            data[i] = stringToByteArray(string);
        }
        return data;
    }

    /**
     * Verify does <i>{@code startIndex}</i> and <i>{@code endIndex}</i> are in bound of <i>{@code source}</i>
     *
     * @param source     string for searching
     * @param startIndex index of begin of range, inclusive
     * @param endIndex   index of end of range, inclusive
     * @return <i>{@code true}</i> if <i>{@code startIndex}</i> and <i>{@code endIndex}</i> are in bound of <i>{@code source}</i>
     */
    private static boolean isInRangeOf(String source, int startIndex, int endIndex) {
        return !isEmptyOrNull(source)
                && startIndex > -1
                && startIndex <= endIndex
                && endIndex < source.length();
    }

    public static class ObjectWrapper<T> {
        private T object;

        public ObjectWrapper(T value) {
            object = value;
        }

        public T get() {
            return object;
        }

        public void set(T value) {
            object = value;
        }
    }
}