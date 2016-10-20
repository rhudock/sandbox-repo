package cwl.learn.xml.dom.model;

import cwl.learn.xml.dom.model.AttrObject;

import java.util.Map;
import java.util.HashMap;
import java.util.Collection;
import java.util.Collections;

/**
 * User: chealwoo
 * Date: Feb 12, 2010
 * Time: 8:31:12 AM
 * $Id$
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reservedrved.
 */
public class TestDevice extends AttrObject {
   private String m_managementURI;
   private String m_deviceClass;
   private Map<Integer, TestPort> m_ports;

   public TestDevice(String name, String managementURI, String deviceClass) {
      super(name);
      m_managementURI = managementURI;
      m_deviceClass = deviceClass;
      m_ports = new HashMap<Integer, TestPort>();
   }

   public String getManagementURI() {
      return m_managementURI;
   }

   public String getDeviceClass() {
      return m_deviceClass;
   }

   public Collection<TestPort> getPorts() {
      return Collections.unmodifiableCollection(m_ports.values());
   }

   public TestPort getPort(int portNumber) {
      return m_ports.get(portNumber);
   }

   public void addPort(TestPort port) {
      m_ports.put(port.getNumber(), port);
   }

   @Override
   public String toString() {
      return super.toString() + " : uri=" + m_managementURI;
   }
}

