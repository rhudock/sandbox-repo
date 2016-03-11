/**
 * \$Id: XsdValidator.java 117 2009-04-17 20:57:39Z daniel.lee $
 * XsdValidator
 * Version: DLee
 * Date: Mar 27, 2009  Time: 1:18:05 PM
 * Copyright (c) Nomadix 2009, All rights reserved.
 * To change this template use File | Settings | File Templates.
 */
package learning.java.ch24.xml;

import org.w3c.dom.Document;
import org.xml.sax.ErrorHandler;
import org.xml.sax.SAXException;

import javax.xml.XMLConstants;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.dom.DOMSource;
import javax.xml.validation.Schema;
import javax.xml.validation.SchemaFactory;
import javax.xml.validation.Validator;
import java.io.File;
import java.io.IOException;

public class XsdValidator {

   public void validat() {
      ErrorHandler errorHandler = new XsdErrorHandler();
      // build an XSD-aware SchemaFactory
      SchemaFactory schemaFactory = SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);
      // hook up org.xml.sax.ErrorHandler implementation.
      schemaFactory.setErrorHandler(errorHandler);
      Schema schemaXSD = null;
      DocumentBuilder parser = null;
      Document document = null;

      try {
         // get the custom xsd schema describing the required format for my XML files.
         schemaXSD = schemaFactory.newSchema(new File("test/note.xsd"));
         // Create a Validator capable of validating XML files according to my custom schema.
         Validator validator = schemaXSD.newValidator();
         // Get a parser capable of parsing vanilla XML into a DOM tree
         parser = DocumentBuilderFactory.newInstance().newDocumentBuilder();
         // parse the XML purely as XML and get a DOM tree represenation.
         document = parser.parse(new File("C:/Dev/NAP/Sandbox/DLee/lkswebclient/test/note.xml"));
         // parse the XML DOM tree againts the stricter XSD schema
         validator.validate(new DOMSource(document));
      } catch (SAXException e) {
         e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
      } catch (ParserConfigurationException e) {
         e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
      } catch (IOException e) {
         e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
      }
   }
}
