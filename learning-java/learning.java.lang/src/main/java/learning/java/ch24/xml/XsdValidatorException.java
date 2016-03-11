/**
 * \$Id: XsdValidatorException.java 43 2009-04-01 05:09:02Z daniel.lee $
 * XsdValidatorException
 * Version: DLee
 * Date: Mar 27, 2009  Time: 1:21:43 PM
 * Copyright (c) Nomadix 2009, All rights reserved.
 * To change this template use File | Settings | File Templates.
 */
package learning.java.ch24.xml;


public class XsdValidatorException extends Exception {

   public XsdValidatorException(Exception e) {
      super(e);
   }

   public XsdValidatorException(String message) {
      super(message);
   }
}