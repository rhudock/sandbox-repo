/**
 * $\Id$
 * User: chealwoo
 * Date: Mar 24, 2010
 * Time: 12:43:55 PM
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reserved.
 */
package com.cwl.model.user;

import com.cwl.model.BaseModel;

import java.util.Date;

public class User extends BaseModel {

   private String m_firstName;
   private String m_lastName;
   private String m_email;
   private Date m_birthday;
   private String m_gender;
   private int m_iid;


   
   /**
    * Getter and Setters
    *
    */

   public String getFirstName() {
      return m_firstName;
   }

   public void setFirstName(String firstName) {
      m_firstName = firstName;
   }

   public String getLastName() {
      return m_lastName;
   }

   public void setLastName(String lastName) {
      m_lastName = lastName;
   }

   public String getEmail() {
      return m_email;
   }

   public void setEmail(String email) {
      m_email = email;
   }

   public Date getBirthday() {
      return m_birthday;
   }

   public void setBirthday(Date birthday) {
      m_birthday = birthday;
   }

   public String getGender() {
      return m_gender;
   }

   public void setGender(String gender) {
      m_gender = gender;
   }
}
