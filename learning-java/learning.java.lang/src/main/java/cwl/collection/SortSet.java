/**
 * $\Id$
 * User: chealwoo
 * Date: Mar 24, 2010
 * Time: 12:49:11 PM
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reservedrved.
 * <p>
 * Ref: http://lkamal.blogspot.com/2008/07/java-sorting-comparator-vs-comparable.html
 * <p>
 * has unit test
 */
package cwl.collection;

import com.cwl.model.user.User;

import java.util.Comparator;
import java.util.Set;
import java.util.TreeSet;

public class SortSet {

    private Set<User> m_users;

    // *1 Declare Comparator
    private class SortById implements Comparator<User> {
        @Override
        public int compare(User a, User b) {
            return a.getId().compareTo(b.getId());
        }
    }

    public SortSet() {

        // *2 Pass a Comparator obj as an argument of TreeSet.
        // TreeSet is implimentation of SortedSet
        m_users = new TreeSet<User>(new SortById());
    }

    public Set<User> addUser(User user) {

        m_users.add(user);
        return m_users;
    }

    // Getter and Setters.

    public Set<User> getUsers() {
        return m_users;
    }

    public void setUsers(Set<User> users) {
        m_users = users;
    }
}
