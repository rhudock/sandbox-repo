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
   <tr>
   <td><a href="#" onclick="window.open('<c:url value="/ui/config/guestportal/layout/editor"/>','mywin', 'location=0,left=20,top=20,width=900,height=700,toolbar=0,menubar=0,resizable=1,scrollbars=1');">Create a New Layout</a></td>
   </tr>
   <c:forEach items="${layouts}" var="layout">
      <tr>
         <td style="align:top; width:15%"><a href="#" onclick="window.open('<c:url value="/ui/config/guestportal/layout/editor"/>?id=${layout.id}','mywin', 'location=0,left=20,top=20,width=900,height=700,toolbar=0,menubar=0,resizable=1,scrollbars=1');">${layout.name}</a></td>
         <td>${layout.desc}</td>
         <td>
            <div class="ui-state-default ui-corner-all"><span class="ui-icon ui-icon-pencil"></span></div>
         </td>
         <td>
            <div class="ui-state-default ui-corner-all"><span class="ui-icon ui-icon-minus"></span></div>
         </td>

      </tr>
   </c:forEach>
   </tbody>
</table>