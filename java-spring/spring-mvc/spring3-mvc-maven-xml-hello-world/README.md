Maven - Spring 3 MVC Hello World
===============================
Template for Spring 3 MVC + JSP view + XML configuration, using Maven build tool.

###1. Technologies used
* Maven 3
* Spring 3.2.13.RELEASE
* JSTL 1.2
* Logback 1.1.3
* Boostrap 3

###2. To Run this project locally
```shell
$ git clone https://github.com/mkyong/spring3-mvc-maven-xml-hello-world
$ mvn jetty:run
```
Access ```http://localhost:8080/spring3```

###3. To import this project into Eclipse IDE
1. ```$ mvn eclipse:eclipse```
2. Import into Eclipse via **existing projects into workspace** option.
3. Done.

###4. Project Demo
Please refer to this article [Maven - Spring 3 MVC Hello World ](http://www.mkyong.com/spring3/spring-3-mvc-hello-world-example/)


**Log by DLEE,
-----------------
Adding JSTL Example: employee.jsp


REF: 
[Spring Framework reference ](http://docs.spring.io/spring/docs/current/spring-framework-reference/htmlsingle/#mvc)






Buffer: =======================================================

<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>

<html><head>
  <%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
  <link rel="shortcut icon" href="https://portal.touchcommerce.com/portal/images/favicon.ico">
  <link rel="stylesheet" href="https://portal.touchcommerce.com/portal/portal.css">
  <link rel="stylesheet" href="https://portal.touchcommerce.com/portal/newLookUi/screen.css">
</head><body>
<div><img src="https://portal.touchcommerce.com/portal/newLookUi/apple-touch-icon.png"/><span style="font-size: 64px;vertical-align: top;">SSO&nbsp;Failure</span></div><br/>
<a href="mailto:support@touchcommerce.com?subject=SSO:%20Signon%20Failure&body=${msgBody}" class="i18n-button-orange">Report SSO Failure</a><br/>

<br/>
<table>
  <tr><td class="gwt-InlineLabel">destination:&nbsp;</td><td>${forwardingURL}</td></tr>
  <tr><td class="gwt-InlineLabel">issuer:&nbsp;</td><td>${issuer}</td></tr>
  <tr><td class="gwt-InlineLabel">userID:&nbsp;</td><td>${userId}</td></tr>
  <tr><td class="gwt-InlineLabel">surname:&nbsp;</td><td>${surName}</td></tr>
	<c:forEach items="${requestScope.xmlList}" var="xml">
	<tr><td class="gwt-InlineLabel"><c:out value="${xml.key}"></c:out>:&nbsp;</td><td><c:out value="${xml.value}"></c:out></td></tr>
	</c:forEach>
  <tr><td class="gwt-InlineLabel">validated:&nbsp;</td><td style="color: <c:out value="${validated ? 'green': 'red'}"/>">${validated}</td></tr>
</table>

</body></html>



