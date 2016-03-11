package cwl.learn.xml.dom;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;
import org.xml.sax.SAXParseException;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.XMLConstants;
import java.text.SimpleDateFormat;
import java.text.ParseException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Date;

import cwl.learn.xml.dom.model.AttrObject;
import cwl.learn.xml.dom.model.TestDevice;
import cwl.learn.xml.dom.model.TestHotel;
import cwl.learn.xml.dom.model.TestPort;

/**
 * User: chealwoo
 * Date: Feb 12, 2010
 * Time: 8:26:05 AM
 * $Id$
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reservedrved.
 */
public class SampleDataParser {
   private static final String DEVICE = "Device";
   private static final String DEVICE_ATTR = "DeviceAttr";
   private static final String DEVICE_CLASS = "deviceClass";
   private static final String DESCRIPTION = "description";
   private static final String MANAGEMENT_URI = "managementURI";
   private static final String NAME = "name";
   private static final String PORT = "Port";
   private static final String PORT_NUMBER = "portNumber";
   private static final String PORT_TYPE = "PortType";
   private static final String PORT_TYPE_REF = "portTypeRef";
   private static final String VALUE = "value";
   private static final String XML_FILE = "xmlFile";


   private static final String XSDFILE = "/cwl/learn/xml/sampledata.xsd";

   private SimpleDateFormat m_dateFormat = new SimpleDateFormat("MM/dd/yyyy");
   private Document m_dom;
   private TestHotel m_hotelData;
   private String m_xmlFilename;

   public void parseXmlFile(String xmlFileName, boolean validate) throws SAXException, IOException {

      m_xmlFilename = xmlFileName;
      InputStream xmlStream = getClass().getResourceAsStream(xmlFileName);
      if (xmlStream == null) {
         throw new IOException("Can not open XML file " + xmlFileName);
      }
      InputStream xsdStream = null;
      if (validate) {
         xsdStream = getClass().getResourceAsStream(XSDFILE);
         if (xsdStream == null) {
            throw new IOException("Can not open XSD file " + XSDFILE);
         }
      }

      try {
         // Get the factory
         DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
         dbf.setValidating(validate);
         dbf.setNamespaceAware(true);
         dbf.setAttribute("http://java.sun.com/xml/jaxp/properties/schemaLanguage", XMLConstants.W3C_XML_SCHEMA_NS_URI);
         if (validate && xsdStream != null) {
            dbf.setAttribute("http://java.sun.com/xml/jaxp/properties/schemaSource", xsdStream);
         }

         // Using factory get an instance of document builder
         DocumentBuilder db = dbf.newDocumentBuilder();
         db.setErrorHandler(new SampleDataErrorHandler());
         // Parse using builder to get DOM representation of the XML file
         m_dom = db.parse(xmlStream);
         loadData();
      } catch (ParserConfigurationException pce) {
         pce.printStackTrace();
      } finally {
         xmlStream.close();
         xsdStream.close();
         m_dom = null;
      }
   }

   public TestHotel getHotelData() {
      return m_hotelData;
   }

   private void loadData() throws SAXParseException {
      Element hotelElem = m_dom.getDocumentElement();
      String name = hotelElem.getAttribute(NAME);

      m_hotelData = new TestHotel(name);
      loadDevices(hotelElem);
   }


   private void loadDevices(Element rootElem) throws SAXParseException {
      NodeList nodeList = rootElem.getElementsByTagName(DEVICE);
      for (int i = 0; i < nodeList.getLength(); i++) {
         Element deviceElem = (Element) nodeList.item(i);
         String name = deviceElem.getAttribute(NAME);
         String uri = deviceElem.getAttribute(MANAGEMENT_URI);
         String deviceClass = deviceElem.getAttribute(DEVICE_CLASS);

         TestDevice device = new TestDevice(name, uri, deviceClass);
         m_hotelData.addDevice(device);

         loadPorts(deviceElem, device);
         loadAttrs(deviceElem.getElementsByTagName(DEVICE_ATTR), device);
      }
   }

   private void loadPorts(Element deviceElem, TestDevice device) throws SAXParseException {
      NodeList nodeList = deviceElem.getElementsByTagName(PORT);
      for (int i = 0; i < nodeList.getLength(); i++) {
         Element portElem = (Element) nodeList.item(i);
         String portNumber = portElem.getAttribute(PORT_NUMBER);
         String portTypeName = portElem.getAttribute(PORT_TYPE_REF);
         String descr = portElem.getAttribute(DESCRIPTION);
         if (descr == null) {
            descr = "";
         }
         TestPort port = new TestPort(Integer.parseInt(portNumber), device, descr);

         device.addPort(port);
      }
   }

   private void loadAttrs(NodeList nodeList, AttrObject attrObj) {
      for (int i = 0; i < nodeList.getLength(); i++) {
         Element portElem = (Element) nodeList.item(i);
         String name = portElem.getAttribute(NAME);
         String value = portElem.getAttribute(VALUE);

         attrObj.addAttr(name, value);
      }
   }

   private Date parseDate(String dateStr) {
      if (dateStr == null || "".endsWith(dateStr)) {
         return null;
      }
      Date date = null;
      try {
         date = m_dateFormat.parse(dateStr);
      } catch (ParseException ignored) {
      }
      return date;
   }
}
