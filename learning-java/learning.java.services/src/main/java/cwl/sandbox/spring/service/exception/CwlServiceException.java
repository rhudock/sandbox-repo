/**
 * $\Id$
 * User: chealwoo
 * Date: Apr 7, 2010
 * Time: 9:45:49 AM
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reserved.
 */
package cwl.sandbox.spring.service.exception;

public class CwlServiceException extends Exception  {

   public CwlServiceException() {
   }

   public CwlServiceException(String message) {
      super(message);
   }

   public CwlServiceException(String message, Throwable cause) {
      super(message, cause);
   }

   public CwlServiceException(Throwable cause) {
      super(cause);
   }
   
}
