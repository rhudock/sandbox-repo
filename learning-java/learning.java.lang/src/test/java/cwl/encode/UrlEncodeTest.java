/*
 *  $Id: DateClassesTest.java 700 2011-05-10 02:03:24Z daniel $
 *
 *  Date: $Date: 2011-10-07 11:14:53 -0700 (Fri, 07 Oct 2011) $
 *  Author: $Author$
 *  Revision: $Rev: 728 $
 *  Last Changed Date: $Date: 2011-10-07 11:14:53 -0700 (Fri, 07 Oct 2011) $
 *  URL : $URL$
 */

package cwl.encode;

import cwl.essencial.calendar.DateUtil;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URLEncoder;
import java.util.Date;

import static org.apache.commons.lang.CharEncoding.UTF_8;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class UrlEncodeTest {
	private static Logger logger = LoggerFactory.getLogger(UrlEncodeTest.class);
	DateUtil dateUtil;

    @Before
    public void setUpBefore() throws Exception {
    	Date date = new Date(1308097804206L);
    	dateUtil = new DateUtil(date);
    }

    @After
    public void teardown() throws Exception {
    	dateUtil = null;
    }
    
    @Test
    public void createDateFromLong() throws Exception {
    	String text = "{\"TalkAgentRequest\": {\"@xmlns\": \"http://www.virtuoz.com\",\"@SCI\": \"\",\"@IID\": \"\",\"@TimeStamp\": \"2014-10-23T22:46:42.996+04:00\",\"UserText\": \"Hi\",\"Debug\": {},\"uiID\": 1929446423053.0916,\"ClientMetaData\": {\"chatReferrer\": \"\",\"userAgent\": \"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_0) AppleWebKit/537.36(KHTML, like Gecko) Chrome/38.0.2125.104 Safari/537.36\"},\"VisitorIsTyping\": true,\"NinaVars\": {\"preprod\": true,\"ninachat\": true}}}";
		String encodedText = URLEncoder.encode(text, UTF_8);
		logger.info("encodedText={}", text);
		assertTrue(true);
		assertEquals(text, encodedText);
    }

    @Test
    public void urlEncodeTest() throws Exception {
    	String text = "{\"TalkAgentRequest\":{\"@SCI\":\"\",\"@IID\":\"\",\"@TimeStamp\":\"2017-12-13T14:55:27.799+11:00\",\"UserText\":\"Hello\",\"origin\":\"\",\"NinaVars\":{\"assetType\":\"netbank\",\"secret\":\"7b3cefbb35611294e417769cd7a49508c8ca5f885f3c608b3bbed3a013256550\"}}}";
		String encodedText = URLEncoder.encode(text, UTF_8);
		logger.info("encodedText={}", encodedText);
		assertTrue(true);
		assertEquals(text, encodedText);
    }
}