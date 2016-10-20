/**
 * $\Id$
 * User: chealwoo
 * Date: Apr 7, 2010
 * Time: 6:58:25 PM
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reservedrved.
 */
package cwl.learn.java.reflection;

import com.cwl.model.user.User;
import org.junit.Assert;
import org.junit.Test;

import java.lang.reflect.Field;
import java.lang.reflect.Method;

public class ReflectionTest extends Assert {


   @Test
   public void myTest() {

      double dExpected = 3.2;

      assertEquals(dExpected, Double.parseDouble("3.2"), dExpected);

   }

   @Test
   public void myTestObjectClassName() {

	   Object obj = new Integer(0);
	   Integer integer = new Integer(1);
	   
	   String expected = integer.getClass().getName();
	   
	   assertEquals(expected, obj.getClass().getName());
	   System.out.println(">>>>>>>> " + obj.getClass().getName());
	   	   
   }

   /*
   http://java.sun.com/docs/books/tutorial/java/javaOO/accesscontrol.html
    */
   @Test
   public void getFieldTest() {

      Double dExpected = 3.2;
      double actual = 3.2;


      Object o = new User();

/*      for (Method method : Calendar.class.getMethods()) {
         System.out.println(method);
      }*/

      for (Method method : User.class.getMethods()) {
         System.out.println(method);
      }

      System.out.println("Fields ===================== ");

      for (Field field : User.class.getDeclaredFields()) {
         System.out.println(field);
         Class type = field.getType();
         String typeName = field.getType().getName();
         System.out.println(field.getType());
         System.out.println(field.getName());
      }

      System.out.println("Mapper ===================== ");

      for (Field field : User.class.getDeclaredFields()) {

         String fName = field.getName();
         fName = fName.replaceFirst("m_", "");
         fName = fName.substring(0, 1).toUpperCase() + fName.substring(1);

         System.out.println("domain.set" + fName + "(entity.get" + fName + "())");
      }

      assertEquals(dExpected, Double.parseDouble("3.2"), dExpected);
      assertEquals(dExpected, actual, dExpected);
   }

}