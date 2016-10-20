package com.dcmi.template.spring.web.controller;

/**
 * User: chealwoo
 * Date: Jan 26, 2010
 * Time: 1:00:19 PM
 * $Id$
 * Copyright (c) Docomo interTouch 2010, All rights reserved.
 */

import com.dcmi.template.spring.model.User;
import com.dcmi.template.spring.model.Account;
import com.dcmi.template.spring.service.UserService;
import com.dcmi.template.spring.exception.ResourceNotFoundException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

@Controller
@RequestMapping(value = "/welcome")
public class WelcomeController {

   protected final Log logger = LogFactory.getLog(getClass());

   @Autowired
   private UserService userService = null;

   @RequestMapping(method = RequestMethod.GET)
   public ModelAndView handleRequestInternal(HttpServletRequest request, HttpServletResponse response)
         throws Exception {

      logger.info("Get bean");
      User user = userService.lookupUser("helloUser");
      logger.info("Found out that this user was last changed " + user.getName());
      logger.info("Return View");
      ModelAndView mv = new ModelAndView("welcome", "user", user);
      return mv;
   }

   public void setUserService(UserService userService) {
      this.userService = userService;
   }


}
