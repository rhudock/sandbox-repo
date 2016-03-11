/**
 * $\Id$
 * User: chealwoo
 * Date: Mar 24, 2010
 * Time: 12:42:55 PM
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reserved.
 */
package com.cwl.model;

public class BaseModel {

   private Long m_id;
   private String m_name;


   public Long getId() {
      return m_id;
   }

   public void setId(Long id) {
      m_id = id;
   }

   public String getName() {
      return m_name;
   }

   public void setName(String name) {
      m_name = name;
   }
}
