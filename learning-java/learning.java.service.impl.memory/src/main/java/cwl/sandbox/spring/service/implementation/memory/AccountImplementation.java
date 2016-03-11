/**
 * $\Id$
 * User: chealwoo
 * Date: Apr 7, 2010
 * Time: 9:55:50 AM
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reserved.
 */
package cwl.sandbox.spring.service.implementation.memory;

import com.cwl.model.user.Account;
import cwl.sandbox.spring.service.AccountService;
import cwl.sandbox.spring.service.exception.CwlServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.concurrent.ConcurrentHashMap;

@Service("accountService")
public class AccountImplementation implements AccountService {

   @Autowired
   @Qualifier("accountBox")
   AccountBox m_accountBox;

   private static Map<Long, Account> s_accounts = new ConcurrentHashMap<Long, Account>();

   private class SortById implements Comparator<Account> {
      public int compare(Account a, Account b) {
         return a.getId().compareTo(b.getId());
      }
   }

   // populate static test value.
   static {
      for (int i = 1; i <= 10; i++) {
         Account account = new Account();
         account.setId(account.assignId());
         account.setName("Name-" + i);
         account.setBalance(new BigDecimal(1000.00));
         account.setEquityAllocation(new BigDecimal(0.6));
         account.setRenewalDate(new Date());

         s_accounts.put(account.getId(), account);
      }
   }

   public List<Account> getAllAccounts() throws CwlServiceException {
      List<Account> accounts = new LinkedList<Account>();
      accounts.addAll(s_accounts.values());
      return accounts;
   }

   /**
    * To save how to use TreeSet with Comparator.
    *
    * @param sort - Comparator
    *
    * @return - Sorted Set
    *
    * @throws CwlServiceException -
    */
   private Set<Account> getAllAccounts(SortById sort) throws CwlServiceException {
      Set<Account> accounts = new TreeSet<Account>(sort);
      accounts.addAll(s_accounts.values());
      return accounts;
   }

   public Account getAccountById(Long id) throws CwlServiceException {
      return s_accounts.get(id);
   }

   public Account saveAccount(Account account) throws CwlServiceException {

      if (!s_accounts.containsKey(account.getId())) {
         account = createAccount(account);
      }
      s_accounts.remove(account.getId());
      s_accounts.put(account.getId(), account);

      m_accountBox.addAccount(account);

      return account;
   }

   public Account createAccount(Account account) throws CwlServiceException {

      if (account.getId() == null) {
         Long maxId = s_accounts.get((long) s_accounts.size()).getId();
         maxId++;
         account.setId(maxId);
         s_accounts.put(account.getId(), account);
         m_accountBox.addAccount(account);
      }

      return account;
   }

   public void deleteAccount(Long id) throws CwlServiceException {
      if (s_accounts.containsKey(id)) {
         s_accounts.remove(id);
         m_accountBox.removeAccount(id);
      }
   }

   public AccountBox getAccountBox() {
      return m_accountBox;
   }

   public void setAccountBox(AccountBox accountBox) {
      m_accountBox = accountBox;

      for (Account account : s_accounts.values()) {
         m_accountBox.addAccount(account);
      }
   }
}
