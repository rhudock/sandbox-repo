package cwl.learn.xml.dom;

import org.xml.sax.SAXException;

import java.io.IOException;

import cwl.learn.xml.dom.model.TestHotel;

/**
 * User: chealwoo
 * Date: Feb 12, 2010
 * Time: 8:22:04 AM
 * $Id$
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reservedrved.
 */
public class LoadSampleDataUtil {
      public static TestHotel loadData(String fileName) throws IOException, SAXException {
      return loadData(fileName, true);
   }

   public static TestHotel loadData(String fileName, boolean saveToDb)
         throws IOException, SAXException {
      // Cretae a new parser and parse the file
      SampleDataParser parser = new SampleDataParser();
      parser.parseXmlFile(fileName, true);
      TestHotel hotel = parser.getHotelData();
      if (saveToDb) {

      }
      return hotel;
   }
}
