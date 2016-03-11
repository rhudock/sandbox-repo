<%--
  Created by IntelliJ IDEA.
  User: Eric
  Date: Aug 13, 2009
  Time: 2:26:32 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<table style="width:100%" cellpadding="5" cellspacing="0" border="0" id="billingplans">
   <tbody>
   <c:forEach items="${plans}" var="plan">
      <tr>
         <td style="align:top; width:15%"><a href="#">${plan.name}</a></td>
         <td>${plan.desc}</td>
      </tr>
   </c:forEach>
   </tbody>
</table>