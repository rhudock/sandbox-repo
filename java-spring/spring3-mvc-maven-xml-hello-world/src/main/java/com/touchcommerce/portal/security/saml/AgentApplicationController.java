package com.touchcommerce.portal.security.saml;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.joda.time.DateTime;
import org.opensaml.xml.security.credential.Credential;
import org.springframework.http.HttpRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class AgentApplicationController {

	@RequestMapping(value = "/AgentApplication/", method = RequestMethod.GET)
	public ModelAndView agentApplication() {

		ModelAndView model = new ModelAndView();
		model.setViewName("agentapplication");

		return model;
	}
	
	@RequestMapping(value = "/employee", method = RequestMethod.GET)
	public ModelAndView employee(HttpServletRequest request, HttpServletResponse response) throws IOException {

		ModelAndView model = new ModelAndView();
		model.setViewName("employee");

		List<Employee> empList = new ArrayList<Employee>();
        Employee emp1 = new Employee();
        emp1.setId(1); emp1.setName("Pankaj");emp1.setRole("Developer");
        Employee emp2 = new Employee();
        emp2.setId(2); emp2.setName("Meghna");emp2.setRole("Manager");
        empList.add(emp1);empList.add(emp2);
        
        model.addObject("empList", empList);
        model.addObject("htmlTagData", "<br/> creates a new line.");
        model.addObject("url", "http://www.journaldev.com");

        // This redirects to 
        // http://stackoverflow.com/questions/17955777/redirect-to-an-external-url-from-controller-action-in-spring-mvc
		return new ModelAndView("redirect:" + "http://www.google.com");

	}
	
	@RequestMapping(value = "/SSOEndpoint", method = RequestMethod.GET)
	public ModelAndView ssoEndPoint(HttpServletRequest request) throws IOException {

		ModelAndView model = new ModelAndView();
		model.setViewName("sso_endpoint");

		List<XMLKeyValue> xmlList = new ArrayList<XMLKeyValue>();
		XMLKeyValue xml1 = new XMLKeyValue();
		xml1.setKey("key1"); xml1.setValue("value1");
		XMLKeyValue xml2 = new XMLKeyValue();
		xml2.setKey("key2"); xml2.setValue("value2");
		xmlList.add(xml1);
		xmlList.add(xml2);
		
		String msgBody = "msgBody";
		String forwardingURL = "forwardingURL";
		
		model.addObject("msgBody", msgBody);
		model.addObject("forwardingURL", forwardingURL);

		model.addObject("issuer", "issuer");
		model.addObject("userId", "userId");
		model.addObject("surName", "surName");
		model.addObject("validated", "validated");
        model.addObject("xmlList", xmlList);

        return model;

	}	
	

	@RequestMapping(value = "/metadata/", method = RequestMethod.GET)
	public ModelAndView hello(HttpRequest request) throws IOException {

		ModelAndView model = new ModelAndView();
		model.setViewName("metadata");

		java.net.URL url;
		url = null;
		String protocol = "https";
		String requestURL = request.getURI().toString();
		url = new java.net.URL(requestURL);
		String domain = url.getHost();
		protocol = url.getProtocol() + "://";
		/*
		 * Because the loadbalancer messes up the protocol, changing HTTPS to
		 * HTTP, lets fix it
		 */
		protocol = "https://";
		String cert = "";

		try {
			cert = readCertBase64();
		} catch (java.io.IOException e) {
		}

		model.addObject("domain", domain);
		model.addObject("protocol", protocol);
		model.addObject("cert", cert);

		return model;

	}

	/**
	 * readCertBase64 Read the Cert from resin/keys directory as Base64
	 * 
	 * @return String of BASE64 encrypted Certificate
	 * @throws java.io.IOException
	 */
	private String readCertBase64() throws java.io.IOException {
		String resin_home = "";

		try {
			java.io.File pathBase = new java.io.File(".");
			resin_home = pathBase.getAbsolutePath();

		} catch (java.lang.Exception e) {
			// log.error(e.getMessage(), e);
		}

		String samlCertPath = resin_home + File.separator + "keys" + File.separator + "saml.crt";
		File samlCertFile = new File(samlCertPath);

		String descriptorFirst = "-----BEGIN CERTIFICATE-----";
		String descriptorLast = "-----END CERTIFICATE-----";
		String base64Text = "";

		FileReader fr = new FileReader(samlCertFile);
		BufferedReader br = new BufferedReader(fr);

		String lineIn = "";
		lineIn = br.readLine();
		if (lineIn.contentEquals(descriptorFirst)) {
			while ((lineIn = br.readLine()) != null) {
				if (!(lineIn.contentEquals(descriptorLast))) {
					base64Text += lineIn;
				} else {
					return base64Text;
				}
			}

		} else {
			// log.error("Format Error in 509 Certificate");
			return null;
		}
		return "";
	}

}
