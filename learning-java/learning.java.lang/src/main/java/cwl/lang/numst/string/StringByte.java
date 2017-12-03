/*
 * \$Id$
 * 
 * StringByte.java - created on Jun 22, 2011 6:20:37 PM
 * Copyright (c)2011, Chealwoo Lee (Daniel). All rights reserved. Use is subject to license terms.
 */
package cwl.lang.numst.string;

import java.io.UnsupportedEncodingException;

/**
 * @author dlee
 */
public class StringByte {

    public static String byte2String(byte[] byteString, String lngCode) {
        String result = null;
        try {
            result = new String(byteString, lngCode);
        } catch (UnsupportedEncodingException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return result;
    }

    public static byte[] string2Byte(String str, String charset) throws UnsupportedEncodingException {
        return str.getBytes(charset);
    }

    public static String byteArr2Print(byte[] byteStr) {
        StringBuffer stringBuffer = new StringBuffer();
        for (int i = 0; i < byteStr.length; i++) {
            stringBuffer.append(byteStr[i]).append(",");
        }
        return stringBuffer.toString();
    }
}
