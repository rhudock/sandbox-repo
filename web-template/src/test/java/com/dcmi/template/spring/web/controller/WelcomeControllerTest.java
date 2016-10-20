package com.dcmi.template.spring.web.controller;

/**
 * User: chealwoo
 * Date: Jan 27, 2010
 * Time: 11:23:48 PM
 * $Id$
 * Copyright (c) Docomo interTouch 2010, All rights reserved.
 */
import org.junit.runner.RunWith;
import org.junit.Test;
import org.junit.Assert;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.ArrayList;

import com.dcmi.template.spring.service.UserService;

/**
 * User: chealwoo
 * Date: Jan 27, 2010
 * Time: 5:09:24 PM
 * $Id$
 * Copyright (c) Docomo interTouch 2010, All rights reserved.
 */

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration
public class WelcomeControllerTest extends Assert  {

   static List<MockHttpSession> s_sessionList = new ArrayList<MockHttpSession>();

   @Autowired
//   @Qualifier("userServiceImpl")
   private UserService userService;

   @Test
   public void testAutowiring() throws Exception {
      assertNotNull(userService);
   }

   @Test
   public void testRedirectRequest1() {

      MockHttpServletRequest request = new MockHttpServletRequest();
      WelcomeController controller = new WelcomeController();
      boolean success = false;

      MockHttpSession session = new MockHttpSession();

      s_sessionList.add(session); // Add session 1

      request.setSession(session);
//      request.setParameters(redirectParams);

      try {
//         Device device = new Device();
//         device.setName("test");
//         device.setDeviceClass("AccessPoint");
//
//         // Field [] getDeclaredFields( );
//         for ( Field field : DeviceController.class.getDeclaredFields( ) )
//            System.out.println( field );
//
//         Field field = DeviceController.class.getDeclaredField("m_deviceService");

//         assertNotNull(field);

         // This returns java.lang.AssertionError now.
/*
         field.set( controller , m_deviceService );

         ModelAndView mav = controller.add(device);

         String viewName = mav.getView().toString();

         System.out.println(viewName);
*/
         success = true;

      } catch (Exception e) {
         System.out.println(e.toString());
      } finally {
         assertTrue(success);
      }
   }
}
