/**
 * User: chealwoo
 * Date: Jan 26, 2010
 * Time: 2:35:08 PM
 * $Id$
 * Copyright (c) Docomo interTouch 2010, All rights reserved.
 */

package com.dcmi.template.spring.aop;

import org.aspectj.lang.ProceedingJoinPoint;

public class MyLoggingAspect {

   public Object log(ProceedingJoinPoint call) throws Throwable {
      System.out.println(
            "from logging aspect: entering method [" + call.toShortString() + "] with param:" + call.getArgs()[0]);

      Object point = call.proceed();

      System.out.println("from logging aspect: exiting method [" + call.toShortString() + "with return as:" + point);

      return point;
   }
}
