/**
 * \$Id: XsdErrorHandler.java 117 2009-04-17 20:57:39Z daniel.lee $
 * XsdErrorHandler
 * Version: DLee
 * Date: Mar 27, 2009  Time: 1:19:25 PM
 * Copyright (c) Nomadix 2009, All rights reserved.
 * To change this template use File | Settings | File Templates.
 */
package learning.java.ch24.xml;

import org.xml.sax.ErrorHandler;
import org.xml.sax.SAXException;
import org.xml.sax.SAXParseException;

public class XsdErrorHandler implements ErrorHandler {

   public void warning(SAXParseException exception) throws SAXException {
      //To change body of implemented methods use File | Settings | File Templates.
      System.err.print(exception.getMessage());
   }

   public void error(SAXParseException exception) throws SAXException {
      //To change body of implemented methods use File | Settings | File Templates.
      System.err.print(exception.getMessage());
   }

   public void fatalError(SAXParseException exception) throws SAXException {
      //To change body of implemented methods use File | Settings | File Templates.
      System.err.print(exception.getMessage());
   }
}
