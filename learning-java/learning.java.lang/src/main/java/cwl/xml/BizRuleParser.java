package cwl.xml;

import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.*;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


public class BizRuleParser {

    public static void main(String[] args) {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setNamespaceAware(true);
        DocumentBuilder builder;
        Document doc = null;
        try {
            builder = factory.newDocumentBuilder();
            doc = builder.parse("/Users/dlee/code/sandbox/sandbox-repo/learning-java/learning.java.lang/src/main/resources/cwl/learn/xml/BR.xml");

            // Create XPathFactory object
            XPathFactory xpathFactory = XPathFactory.newInstance();

            // Create XPath object
            XPath xpath = xpathFactory.newXPath();

            List<String> femaleEmps = getJsScript(doc, xpath);
            System.out.println("Female Employees names are:" +
                    Arrays.toString(femaleEmps.toArray()));

        } catch (ParserConfigurationException | SAXException | IOException e) {
            e.printStackTrace();
        }

    }


    private static List<String> getJsScript(Document doc, XPath xpath) {
        List<String> list = new ArrayList<>();
        String nodes;
        try {
            //create XPathExpression object
            XPathExpression expr =
                    xpath.compile("/business/js-functions/js-function/text()");
            //evaluate expression result on XML document
            nodes = (String) expr.evaluate(doc, XPathConstants.STRING);
//            for (int i = 0; i < nodes.getLength(); i++)
//                list.add(nodes.item(i).getNodeValue());
        } catch (XPathExpressionException e) {
            e.printStackTrace();
        }
        return list;
    }

}
