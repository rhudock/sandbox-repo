/*
 * \$Id$
 * 
 * StringArrayTest.java - created on Aug 29, 2011 9:25:17 AM
 * Copyright (c)2011, Chealwoo Lee (Daniel). All rights reserved. Use is subject to license terms.
 */
package cwl.lang.numst.string;

import static org.junit.Assert.*;

import org.junit.Test;

import java.net.URLDecoder;
import java.net.URLEncoder;

/**
 * @author dlee
 *
 */
public class StringArrayTest {

	@Test
	public void simpleSubStrTest() {
		String userStr = "user=_S_23/G5XFuSMSLtbYk2iKvjw==";
		int idx = userStr.indexOf("=");

		String name = userStr.substring(0, idx);
		String value = userStr.substring(idx +1, userStr.length());

		assertEquals(name, "user");
		assertEquals(value, "_S_23/G5XFuSMSLtbYk2iKvjw==");
	}

	static final String MASK_START = "((masked%257B%255B";
	static final String MASK_END = "%255D%257Dmasked))";

	@Test
	public void simpleSubStrTest2() {
		String userStr = "asdfasd%2C((masked%257B%255B4111111111111111%255D%257Dmasked))%2C((masked%257B%255B123%255D%257Dmasked))%2C((masked%257B%255B11%252F2018%255D%257Dmasked))%2C91320%2C%25241.00";
		// userStr = URLDecoder.decode(URLDecoder.decode("asdfasd%2C((masked%257B%255B4111111111111111%255D%257Dmasked))%2C((masked%257B%255B123%255D%257Dmasked))%2C((masked%257B%255B11%252F2018%255D%257Dmasked))%2C91320%2C%25241.00"));

		//String maskeedStr = userStr.replaceAll("((masked%257B%255B[^%]*%255D%257Dmasked))", "x");
		StringBuilder newUserStr = new StringBuilder();
		String maskedStr = "";
		int start, end;
		while(userStr.indexOf(MASK_START) >= 0 ) {
			start = userStr.indexOf(MASK_START);
			newUserStr.append(userStr.substring(0, start));
			userStr = userStr.substring(start + MASK_START.length());
			end = userStr.indexOf(MASK_END);
			maskedStr = URLDecoder.decode(URLDecoder.decode(userStr.substring(0, end))).replaceAll(".", "x");
			newUserStr.append(maskedStr);
			if(userStr.contains(MASK_END)) {
				userStr = userStr.substring(end + MASK_END.length());
			}
		}
		newUserStr.append(userStr);
		userStr = newUserStr.toString();

		assertTrue(userStr.contains("((masked%257B%255B"));
		assertTrue(!userStr.contains("((masked%257B%255B*%255D%257Dmasked))"));

	}

	@Test
	public void simpleArrayTest() {
        
		String[] productIDs = {"NAM:WalkFit 1st pair~ID:5198~CAT:Walkfit~TYP:Core Product~TERM:N/A~IPP:19.95~TPP:19.95%2CNAM:Large size Slippers~ID:5360~CAT:Walkfit~TYP:Up Sell~TERM:N/A~IPP:0~TPP:0%2CNAM:Foot Care System~ID:5405~CAT:Walkfit~TYP:Up Sell~TERM:N/A~IPP:0~TPP:0%2CNAM:Shipping~ID:0~CAT:Walkfit~TYP:S&P~TERM:N/A~IPP:27.85~TPP:27.85","missing","missing","missing"};
        if (productIDs.length > 1 && productIDs[1].equalsIgnoreCase("missing")) {
        	boolean missing = true;
        	for (int i=1; i<productIDs.length; i++) {
        		if (!productIDs[i].equalsIgnoreCase("missing")){
        			missing = false;
        			break;
        		}
        	}
        	
        	if (missing) {
        		productIDs = productIDs[0].split("%2C");
        	}
        }
        
        assertEquals(productIDs.length, 4);
        assertEquals("NAM:WalkFit 1st pair~ID:5198~CAT:Walkfit~TYP:Core Product~TERM:N/A~IPP:19.95~TPP:19.95", productIDs[0]);
        assertEquals("NAM:Large size Slippers~ID:5360~CAT:Walkfit~TYP:Up Sell~TERM:N/A~IPP:0~TPP:0", productIDs[1]);
	}

}
