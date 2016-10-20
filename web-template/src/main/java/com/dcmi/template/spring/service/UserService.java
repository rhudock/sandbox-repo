package com.dcmi.template.spring.service;

import com.dcmi.template.spring.model.User;
import com.dcmi.template.spring.dao.UserDao;

/**
 * User: chealwoo
 * Date: Jan 26, 2010
 * Time: 1:08:13 PM
 * $Id$
 * Copyright (c) Docomo interTouch 2010, All rights reserved.
 */
public interface UserService {

   public User lookupUser(String webUserId);

   public void setUserDao(UserDao userDao);

}
