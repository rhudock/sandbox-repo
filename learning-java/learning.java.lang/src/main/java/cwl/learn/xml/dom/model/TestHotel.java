package cwl.learn.xml.dom.model;

import cwl.learn.xml.dom.model.NamedObject;

import java.util.Map;
import java.util.HashMap;
import java.util.Collection;
import java.util.Collections;

/**
 * User: chealwoo
 * Date: Feb 12, 2010
 * Time: 8:23:58 AM
 * $Id$
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reservedrved.
 */
public class TestHotel extends NamedObject {
   private Map<String, TestDevice> m_deviceMap;

   public TestHotel(String name) {
      super(name);
      m_deviceMap = new HashMap<String, TestDevice>();
   }


   public Collection<TestDevice> getDevices() {
      return Collections.unmodifiableCollection(m_deviceMap.values());
   }

   public TestDevice getDevice(String deviceName) {
      if (deviceName == null) {
         return null;
      }
      return m_deviceMap.get(deviceName);
   }

   public void addDevice(TestDevice device) {
      m_deviceMap.put(device.getName(), device);
   }
}
