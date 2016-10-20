<%--
  Created by IntelliJ IDEA.
  User: Eric
  Date: Aug 16, 2009
  Time: 7:34:16 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="x" uri="http://java.sun.com/jsp/jstl/xml" %>
<%@ taglib prefix="security" uri="http://www.springframework.org/security/tags" %>

<div class="left"></div>
<ul>
   <li>
      <a href="#">Service Management</a>
   </li>
   <li>
      <a href="#">Reporting</a>
   </li>
   <li>
      <a href="<c:url value="/ui/config/billing/plans"/>">Configuration</a>
   </li>
   <li class="last">
      <a href="#">Maintenance</a>
   </li>
   <li>
				<security:authorize ifAllGranted="ROLE_USER">
					<c:if test="${pageContext.request.userPrincipal != null}">
						Welcome, ${pageContext.request.userPrincipal.name} |
					</c:if>
					<a href="<c:url value="/app/logout" />">Logout</a>
				</security:authorize>
				<security:authorize ifAllGranted="ROLE_ANONYMOUS">
					<a href="<c:url value="/app/login" />">Login</a>
				</security:authorize>
   </li>
</ul>
<div class="right"></div>