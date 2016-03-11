package learning.java.xml;

import org.jdom.input.SAXBuilder;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.DataConversionException;

import java.util.Set;
import java.util.List;
import java.util.LinkedList;
import java.io.ByteArrayInputStream;

/**
 * User: DLee
 * Date: Oct 21, 2009
 * Time: 1:51:49 PM
 * $Id$
 * Copyright (c) Docomo interTouch 2009, All rights reserved.
 */
public class GuestPortalLayoutService {

   public GuestPortalLayoutService() {

      sBillPlan.add("Static BillPlan 1");
      sBillPlan.add("Static BillPlan 2");
      sBillPlan.add("Static BillPlan 3");
   }


   private static final String BILLPLAN_START = "<div id=\"divBillPlan\">";
   private static final String BILLPLAN_END = "</div><!--divBillPlan-->";

   @SuppressWarnings({"RedundantStringConstructorCall"})
   private static String populateBillPlan(String panelContent, List<String> newBillPlan) {
      String newContent = new String(panelContent);
      StringBuffer newDivBillPlan = new StringBuffer();
      int startIndexBillPlan = panelContent.indexOf(BILLPLAN_START);
      int endIndexBillPlan = panelContent.indexOf(BILLPLAN_END);


      String newBillPlanStartWith = "<h3>Bill Plans</h3><p>";
      String newBillPlanEndWith = "</p>";

      newDivBillPlan.append(panelContent.substring(0, startIndexBillPlan));
      newDivBillPlan.append(BILLPLAN_START).append(newBillPlanStartWith);
      for (String s : newBillPlan) {
         StringBuffer sBuffer = new StringBuffer(
               "<label><input type=\"radio\" name=\"radiosBillPlan\" value=\"1\" id=\"radiosBillPlan_0\" />");
         sBuffer.append(s);
         sBuffer.append("</label><br />");
         newDivBillPlan.append(sBuffer);
      }
      newDivBillPlan.append(newBillPlanEndWith).append(BILLPLAN_END);
      newDivBillPlan.append(panelContent.substring(endIndexBillPlan + BILLPLAN_END.length()));

      return newContent;
   }

   private static String populateBillPlanJdom(String panelContent, List<String> newBillPlan) {

      SAXBuilder builder = new SAXBuilder();
      Document document = null;
      try {
         document = builder.build(new ByteArrayInputStream(panelContent.getBytes()));
      } catch (Exception e) {
      }

      Element root = document.getRootElement();
      List row = root.getChildren("p");
      for (int i = 0; i < row.size(); i++) {
         Element Companyname = (Element) row.get(i);


         List column = Companyname.getChildren("Employee");
         for (int j = 0; j < column.size(); j++) {
            Element Employee = (Element) column.get(j);
            String name = Employee.getAttribute("name").getValue();
            String value = Employee.getText();
            int length = 0;
            try {
               length = Employee.getAttribute("Age").getIntValue();
            } catch (DataConversionException e) {
               e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            }

            System.out.println("Name = " + name);
            System.out.println("Profile = " + value);
            System.out.println("Age = " + length);
         }
      }

      return null;
   }

   private static final List<String> sBillPlan = new LinkedList<String>();

   {
      sBillPlan.add("Static BillPlan 1");
      sBillPlan.add("Static BillPlan 2");
      sBillPlan.add("Static BillPlan 3");
   }
}
