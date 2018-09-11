package cwl.security.saml;

import com.google.common.base.Charsets;
import com.google.common.io.Resources;
import org.junit.Test;
import org.opensaml.DefaultBootstrap;
import org.opensaml.xml.Configuration;
import org.opensaml.xml.ConfigurationException;
import org.opensaml.xml.XMLObject;
import org.opensaml.xml.io.Unmarshaller;
import org.opensaml.xml.io.UnmarshallerFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.ByteArrayInputStream;

import static org.junit.Assert.assertNotNull;

public class SamlTest {

    @Test
    public void test() throws Exception {
        try {
            DefaultBootstrap.bootstrap();
        } catch (ConfigurationException e) {
            e.printStackTrace();
        }
        String talkAgentRequestStr = Resources.toString(Resources.getResource("cwl/security/xml/saml/saml_response.xml"), Charsets.UTF_8);
//        byte[] base64DecodedResponse = Base64.getEncoder().encode(talkAgentRequestStr.getBytes());
        byte[] base64DecodedResponse = talkAgentRequestStr.getBytes();

//        byte[] base64DecodedResponse = Base64.decode(responseMessage)

        ByteArrayInputStream is = new ByteArrayInputStream(base64DecodedResponse);

        DocumentBuilderFactory documentBuilderFactory = DocumentBuilderFactory.newInstance();
        documentBuilderFactory.setNamespaceAware(true);
        DocumentBuilder docBuilder = documentBuilderFactory.newDocumentBuilder();

        Document document = docBuilder.parse(is);
        Element element = document.getDocumentElement();

        assertNotNull(element);

        UnmarshallerFactory unmarshallerFactory = Configuration.getUnmarshallerFactory();
        Unmarshaller unmarshaller = unmarshallerFactory.getUnmarshaller(element);
        XMLObject responseXmlObj = unmarshaller.unmarshall(element);

        assertNotNull(responseXmlObj);
    }
}
