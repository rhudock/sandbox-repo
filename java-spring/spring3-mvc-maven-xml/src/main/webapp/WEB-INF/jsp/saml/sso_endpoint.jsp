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
  <tr><td class="gwt-InlineLabel">validated:&nbsp;</td><td style="color: <c:out value="${validated != null ? 'green': 'red'}"/>">${validated}</td></tr>
</table>

</body></html>
