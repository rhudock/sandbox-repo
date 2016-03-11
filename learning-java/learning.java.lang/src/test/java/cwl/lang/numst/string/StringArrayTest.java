/*
 * \$Id$
 * 
 * StringArrayTest.java - created on Aug 29, 2011 9:25:17 AM
 * Copyright (c)2011, Chealwoo Lee (Daniel). All rights reserved. Use is subject to license terms.
 */
package cwl.lang.numst.string;

import static org.junit.Assert.*;

import org.junit.Test;

/**
 * @author dlee
 *
 */
public class StringArrayTest {

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
