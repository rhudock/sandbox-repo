package com.dcmi.template.spring.model;

import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Entity;
import javax.persistence.Column;
import java.io.Serializable;

/**
 * User: chealwoo
 * Date: Jan 26, 2010
 * Time: 1:09:00 PM
 * $Id$
 * Copyright (c) Docomo interTouch 2010, All rights reserved.
 */

@Entity
@Table(name = "User")
public class User implements Serializable {

    private static final long serialVersionUID = -6123654414341191669L;

    @Id
    @Column(name = "WebUserId")
    private String WebUserId;

    @Column(name = "Name")
    private String Name;
    /**
     * @return the webUserId
     */
    public synchronized String getWebUserId() {
        return WebUserId;
    }
    /**
     * @param webUserId the webUserId to set
     */
    public synchronized void setWebUserId(String webUserId) {
        WebUserId = webUserId;
    }
    /**
     * @return the name
     */
    public synchronized String getName() {
        return Name;
    }
    /**
     * @param name the name to set
     */
    public synchronized void setName(String name) {
        Name = name;
    }
}