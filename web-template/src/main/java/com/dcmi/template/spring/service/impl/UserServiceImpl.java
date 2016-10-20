package com.dcmi.template.spring.service.impl;

import com.dcmi.template.spring.service.UserService;
import com.dcmi.template.spring.model.User;
import com.dcmi.template.spring.dao.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

/**
 * User: chealwoo
 * Date: Jan 26, 2010
 * Time: 1:18:31 PM
 * $Id$
 * Copyright (c) Docomo interTouch 2010, All rights reserved.
 */

public class UserServiceImpl implements UserService{
                                       @Autowired
    private UserDao userDao;

    @Transactional(readOnly = false)
    public void setUserDao(UserDao userDao) {
        this.userDao = userDao;
    }

    @Transactional(readOnly = true)
    public User lookupUser(String webUserId) {

        return userDao.lookupUser(webUserId);
    }
}
