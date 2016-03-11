/**
 * $Id$
 *
 * User: chealwoo
 * Date: Apr 12, 2010
 * Time: 2:31:47 PM
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reserved.
 */
package cwl.sandbox.spring.service.implementation.memory;

import com.cwl.model.user.Account;

import java.util.HashMap;
import java.util.Map;

/**
 * Account Manager Class
 */
public class AccountBox {
   private Map<Long, Account> m_accountList;

   public AccountBox() {
//      InjectorHolder.getInjector().inject(this);
      m_accountList = new HashMap<Long, Account>();
   }

   public void addAccount(Account account) {
      if ( !m_accountList.containsKey(account.getId()) ) {
         m_accountList.put(account.getId(), account);
      }
   }

   public void removeAccount(Long id) {
      if (m_accountList.containsKey(id)) {
         m_accountList.remove(id);
      }
   }
}

