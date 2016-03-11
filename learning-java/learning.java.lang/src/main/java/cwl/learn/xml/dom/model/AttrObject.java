package cwl.learn.xml.dom.model;

import cwl.learn.xml.dom.model.NamedObject;

import java.util.Map;
import java.util.HashMap;
import java.util.Collections;

/**
 * User: chealwoo
 * Date: Feb 12, 2010
 * Time: 8:32:34 AM
 * $Id$
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reservedrved.
 */
public abstract class AttrObject extends NamedObject {
   private Map<String, String> m_attrMap;

   public AttrObject(String name) {
      super(name);
      m_attrMap = new HashMap<String, String>();
   }

   public void addAttr(String name, String value) {
      m_attrMap.put(name, value);
   }

   public String getAttr(String name) {
      return m_attrMap.get(name);
   }

   public Map<String, String> getAttrs() {
      return Collections.unmodifiableMap(m_attrMap);
   }
}

