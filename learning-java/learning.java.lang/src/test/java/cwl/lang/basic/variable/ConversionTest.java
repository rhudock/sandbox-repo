/**
 * $\Id$
 * User: chealwoo
 * Date: Apr 7, 2010
 * Time: 6:58:25 PM
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reservedrved.
 */
package cwl.lang.basic.variable;

import org.junit.Assert;
import org.junit.Test;

public class ConversionTest extends Assert {


   @Test
   public void myTest() {

      double dExpected = 3.2;

      assertEquals( dExpected, Double.parseDouble("3.2"), dExpected);

   }

   @Test
   public void aDoubleTest() {

      Double dExpected = 3.2;
      double actual = 3.2;
      
      assertEquals( dExpected, Double.parseDouble("3.2"), dExpected);
      assertEquals( dExpected, actual, dExpected);
   }

/*
   public void convert()
   {
//Converting input to values
   double input = Double.parseDouble(inputField.getText());

   double milesKilo = input * 1.6903;

   if (arg == "Miles-Kilometer")
   {
   outputField.setText("" + (input*1.6093));
   }

   if (arg == "Kilometer-Miles")
   {
   outputField.setText("" + (input*0.6213882));
   }

   if (arg == "Kilometer-Meter")
   {
   outputField.setText("" + (input*1000));
   }

   if (arg == "Meter-Kilometer")
   {
   outputField.setText("" + (input*0.001));
   }

   if (arg == "Meter-Feet")
   {
   outputField.setText("" + (input*3.2808399));
   }

   if (arg == "Feet-Meter")
   {
   outputField.setText("" + (input*0.3048));
   }

   if (arg == "Feet-Inches")
   {
   outputField.setText("" + (input*12));
   }

   if (arg == "Inches-Feet")
   {
   outputField.setText("" + (input*0.0833333));
   }

   if (arg == "Inches-Centimeter")
   {
   outputField.setText("" + (input*2.54));
   }

   if (arg == "Centimeter-Inches")
   {
   outputField.setText("" + (input*0.3937008));
   }

   } // end actionPerformed
   */
}