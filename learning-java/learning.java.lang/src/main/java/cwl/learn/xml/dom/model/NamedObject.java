package cwl.learn.xml.dom.model;

/**
 * User: chealwoo
 * Date: Feb 12, 2010
 * Time: 8:29:25 AM
 * $Id$
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reservedrved.
 */
public abstract class NamedObject {
   private String m_name;

   public NamedObject(String name) {
      m_name = name;
   }

   public String getName() {
      return m_name;
   }

   @Override
   public String toString() {
      return getClass().getSimpleName() + ": " + m_name;
   }
}
