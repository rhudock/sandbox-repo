package com.dcmi.template.spring.dao;

import com.dcmi.template.spring.model.User;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

/**
 * User: chealwoo
 * Date: Jan 26, 2010
 * Time: 1:12:22 PM
 * $Id$
 * Copyright (c) Docomo interTouch 2010, All rights reserved.
 */
public class UserDao  extends HibernateDaoSupport {

      public void saveUser(User user) {
      getHibernateTemplate().saveOrUpdate(user);
   }

   public User lookupUser(String WebUserId) {
      User user = getHibernateTemplate().get(User.class, WebUserId);
      return user;
   }

}
