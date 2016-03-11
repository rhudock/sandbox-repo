package cwl.learn.xml.dom;

import org.xml.sax.ErrorHandler;
import org.xml.sax.SAXParseException;
import org.xml.sax.SAXException;

/**
 * User: chealwoo
 * Date: Feb 12, 2010
 * Time: 8:40:43 AM
 * $Id$
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reservedrved.
 */
public class SampleDataErrorHandler implements ErrorHandler {

   @Override
   public void warning(SAXParseException exception) throws SAXException {
      throw exception;
   }

   @Override
   public void error(SAXParseException exception) throws SAXException {
      throw exception;
   }

   @Override
   public void fatalError(SAXParseException exception) throws SAXException {
      throw exception;
   }
}

