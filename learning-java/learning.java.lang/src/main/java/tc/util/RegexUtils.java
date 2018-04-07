package tc.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RegexUtils {

    @SuppressWarnings("ReplaceAllDot")
    private static String buildSameLengthMask(String source, String replacement) {
        return source.replaceAll(".", replacement);
    }

    public static String maskGroups(String source, Pattern pattern, String replaceChar) {
        Matcher m = pattern.matcher(source);
        StringBuffer sb = new StringBuffer();
        while (m.find()) {
            m.appendReplacement(sb, "");
            int prevGroupEnd = m.start();
            for (int i = 1; i <= m.groupCount(); i++) {
                sb.append(source.substring(prevGroupEnd, m.start(i)));
                sb.append(buildSameLengthMask(m.group(i), replaceChar));
                prevGroupEnd = m.end(i);
            }
            sb.append(source.substring(prevGroupEnd, m.end()));
        }
        m.appendTail(sb);
        return sb.toString();
    }

}
