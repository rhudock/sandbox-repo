/*
 * \$Id$
 * 
 * PassWordMaker.java - created on May 20, 2011 11:25:03 PM
 * Copyright (c)2011, Chealwoo Lee (Daniel). All rights reserved. Use is subject to license terms.
 */
package cwl.learn.security;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import sun.misc.BASE64Encoder;

/**
 * @author dlee
 *
 */
public class PassWordMaker {

    private static Logger logger = LoggerFactory.getLogger(PassWordMaker.class);
    public static String PswdEncrypt(String password)
    {
      MessageDigest md = null;
      try
      {
        md = MessageDigest.getInstance("SHA");
      }
      catch(NoSuchAlgorithmException e)
      {
        logger.error("NoSuchAlgorithmException in PasswordEncryption.java " , e );
      }
      try
      {
        md.update(password.getBytes("UTF-8"));
      }
      catch(UnsupportedEncodingException e)
      {
        logger.error("UnsupportedEncodingException in PasswordEncryption.java " , e );
      }

      byte raw[] = md.digest();
      String hash = (new BASE64Encoder()).encode(raw);
      return hash;
    }
    
    public static void main(String[] args) {
    	String passwd = PassWordMaker.PswdEncrypt("PSW332206");
    	logger.debug(passwd);
    }
}
