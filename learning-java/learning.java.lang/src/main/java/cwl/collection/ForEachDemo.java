/**
 * \$Id$
 * <p>
 * Copyright (c)2011, Daniel Chealwoo Lee. All rights reserved. Use is subject to license terms.
 */

package cwl.collection;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

public class ForEachDemo {

    private static Logger m_logger = LoggerFactory.getLogger(ForEachDemo.class);

    public List<Integer> buildList(String[] intValueList) {
        if (intValueList == null) {
            m_logger.error("intValueList should not be a null");
            throw new NullPointerException("Need String array not null");
        }

        List<Integer> valueList = new ArrayList<Integer>();

        // This should return NullPointerException if intValueList is null
        // So null check is required.
        for (String tempString : intValueList) {
            Integer tempInt = new Integer(tempString);
            valueList.add(tempInt);
        }

        return valueList;
    }

    @SuppressWarnings("unused")
    public static void main(String args[]) {
        String[] intValueList = {"111",
                "222"};
        ForEachDemo forEachDemo = new ForEachDemo();
        List<Integer> testList = forEachDemo.buildList(intValueList);
        testList = forEachDemo.buildList(null);

        for (int i = 0; i < intValueList.length; i++) {
            String string = intValueList[i];

        }
    }

}
