package learning.java.xml;

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.input.SAXBuilder;
import org.jdom.output.XMLOutputter;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

/**
 * User: DLee
 * Date: Oct 16, 2009
 * Time: 3:49:04 PM
 * $Id$
 * Copyright (c) Docomo interTouch 2009, All rights reserved.
 * <p/>
 * http://www.roseindia.net/xml/reading-an-xml-document-using-jd.shtml
 */
public class ReadingxmlusingJdom {

   public static void main(String[] args) throws Exception {
      String data = "<root>" + "<Companyname>" + "<Employee name=\"Girish\" Age=\"25\">Developer</Employee>" +
                    "</Companyname>" + "<Companyname>" +
                    "<Employee name=\"Komal\" Age=\"25\">Administrator</Employee>" + "</Companyname>" + "</root>";
      SAXBuilder builder = new SAXBuilder();
      Document document = builder.build(new ByteArrayInputStream(data.getBytes()));
      Element root = document.getRootElement();


      List row = root.getChildren("Companyname");
      for (int i = 0; i < row.size(); i++) {
         Element Companyname = (Element) row.get(i);


         List column = Companyname.getChildren("Employee");
         for (int j = 0; j < column.size(); j++) {
            Element Employee = (Element) column.get(j);
            String name = Employee.getAttribute("name").getValue();
            String value = Employee.getText();
            int length = Employee.getAttribute("Age").getIntValue();

            System.out.println("Name = " + name);
            System.out.println("Profile = " + value);
            System.out.println("Age = " + length);
         }
      }

      // Try to print xml from the dom.
      System.out.println(document.toString());

      // Samples from
      // http://www.cafeconleche.org/books/xmljava/chapters/ch14s04.html
      XMLOutputter outputter = new XMLOutputter();
      try {
         outputter.output(document, System.out);
      } catch (IOException e) {
         System.err.println(e);
      }

      System.out.println("Ohter example");      
      try {
         Element element = new Element("Greeting");
         outputter.output(element, System.out);
      } catch (IOException e) {
         System.err.println(e);
      }

   }
}

/*
"<div><div id="divBillPlan">  <h3>Bill Plans  </h3>  <p>    <label>      <input name="radiosBillPlan" value="1" id="radiosBillPlan_0" type="radio">      7Mbytes 7 dollars per an hour Maximum 25 dollars per day</label>    <br>    <label>      <input name="radiosBillPlan" value="2" id="radiosBillPlan_1" type="radio">      5Mbytes 5 dollars per an hour Maximum 25 dollars per day</label>    <br>    <label>      <input name="radiosBillPlan" value="3" id="radiosBillPlan_2" type="radio">      1Mbytes 3 dollars per an hour Maximum 20 dollars per day</label>    <br>  </p></div></div>"
 */
