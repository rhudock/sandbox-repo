package cwl.learn.xml.dom.model;

/**
 * User: chealwoo
 * Date: Feb 12, 2010
 * Time: 8:33:11 AM
 * $Id$
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reservedrved.
 */
public class TestPort {
   private int m_number;
   private String m_descr;
   private TestDevice m_device;

   public TestPort(int number, TestDevice device,  String descr) {
      m_number = number;
      m_device = device;
      m_descr = descr;
   }

   public int getNumber() {
      return m_number;
   }

   public String getDescr() {
      return m_descr;
   }

   public TestDevice getDevice() {
      return m_device;
   }

   @Override
   public String toString() {
      return getClass().getSimpleName() + ": " + m_number;
   }
}
