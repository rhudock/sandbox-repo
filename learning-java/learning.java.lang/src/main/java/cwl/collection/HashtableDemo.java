/**
 *
 */
package cwl.collection;

/*
 * http://www.java2s.com/Code/Java/Collections-Data-Structure/DemonstratetheHashtableclassandanEnumeration.htm
 *
 * Copyright (c) Ian F. Darwin, http://www.darwinsys.com/, 1996-2002.
 * All rights reserved. Software written by Ian F. Darwin and others.
 * $Id: LICENSE,v 1.8 2004/02/09 03:33:38 ian Exp $
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE AUTHOR AND CONTRIBUTORS ``AS IS''
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
 * TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS
 * BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 * Java, the Duke mascot, and all variants of Sun's Java "steaming coffee
 * cup" logo are trademarks of Sun Microsystems. Sun's, and James Gosling's,
 * pioneering role in inventing and promulgating (and standardizing) the Java
 * language and environment is gratefully acknowledged.
 *
 * The pioneering role of Dennis Ritchie and Bjarne Stroustrup, of AT&T, for
 * inventing predecessor languages C and C++ is also gratefully acknowledged.
 */

import java.util.Enumeration;
import java.util.Hashtable;

/**
 * Demonstrate the Hashtable class, and an Enumeration.
 *
 * @see HashMapDemo, for the newer HashMap class.
 */
public class HashtableDemo {

    public static void main(String[] argv) {

        // Construct and load the hash. This simulates loading a
        // database or reading from a file, or wherever the data is.

        Hashtable<String, String> h = new Hashtable<String, String>();

        // The hash maps from company name to address.
        // In real life this might map to an Address object...
        h.put("Adobe", "Mountain View, CA");
        h.put("IBM", "White Plains, NY");
        h.put("Learning Tree", "Los Angeles, CA");
        h.put("Microsoft", "Redmond, WA");
        h.put("Netscape", "Mountain View, CA");
        h.put("O'Reilly", "Sebastopol, CA");
        h.put("Sun", "Mountain View, CA");

        // Two versions of the "retrieval" phase.
        // Version 1: get one pair's value given its key
        // (presumably the key would really come from user input):
        String queryString = "O'Reilly";
        System.out.println("You asked about " + queryString + ".");
        String resultString = (String) h.get(queryString);
        System.out.println("They are located in: " + resultString);
        System.out.println();

        // Version 2: get ALL the keys and pairs
        // (maybe to print a report, or to save to disk)
        Enumeration<String> k = h.keys();
        while (k.hasMoreElements()) {
            String key = (String) k.nextElement();
            System.out.println("Key " + key + "; Value " + (String) h.get(key));
        }
    }
}
