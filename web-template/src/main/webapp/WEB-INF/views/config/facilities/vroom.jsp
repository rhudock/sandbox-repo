<%--
  User: DLee
  Date: Sep 13, 2009
  Time: 2:26:32 PM
--%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!-- "name", "mapped", "billableRoom", "vroomType" -->
<table style="width:100%" cellpadding="5" cellspacing="0" border="0" id="tblVroom">
   <thead>
   <tr class="ui-widget-header">
      <th>ID</th>
      <!-- id -->
      <th>VRoom Name</th>
      <th>Mapped</th>
      <th>Billable Room</th>
      <th>&nbsp;</th>
      <!-- buttons placeholder -->
   </tr>
   </thead> 
   <tbody>
   <c:forEach items="${vrooms}" var="vroom">
      <tr>
         <td>${vroom.id}</td>
         <td>${vroom.name}</td>
         <td>${vroom.mapped}</td>
         <td>${vroom.billableRoom}</td>
        <td></td>
      </tr>
   </c:forEach>
   </tbody>
</table>

<div id="vroomDetailDialog" style="display:none" class="ibis-form">
      <p>
        <label for="vroomName">Virtual Room name</label>
        <input id="vroomId" name="vroomId" type="hidden" value="" />
        <input name="vroomName" id="vroomName" type="text" value="" />
      </p>
      <p>
        <label for="vroomMapped">Virtual Room Mapped</label>
        <input name="vroomMapped" id="vroomMapped" type="text" value="" />
      </p>
      <p>
        <label for="vroomBillableRoom">Billable Room</label>
        <input name="vroomBillableRoom" id="vroomBillableRoom" type="text" value="" />
      </p>
</div>
<!-- End of .detail-box -->