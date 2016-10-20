<%--
  User: DLee
  Date: Sep 13, 2009
  Time: 2:26:32 PM
--%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<table style="width:100%" cellpadding="5" cellspacing="0" border="0" id="tblZone">
   <thead>
   <tr class="ui-widget-header">
      <th>ID</th>
      <!-- id -->
      <th>Zone Name</th>
      <th>Description</th>
      <th>Class Of Service</th>
      <th>&nbsp;</th>
      <!-- buttons placeholder -->
   </tr>
   </thead> 
   <tbody>
   <c:forEach items="${zones}" var="zone">
      <tr>
         <td>${zone.id}</td>
         <td>${zone.name}</td>
         <td>${zone.description}</td>
         <td>${zone.classOfService}</td>
         <td></td>
      </tr>
   </c:forEach>
   </tbody>
</table>

<div id="zoneDetailDialog" style="display:none" class="ibis-form">
      <p>
        <label for="zoneName">Zone name</label>
        <input class="zone-id" id="zoneId" name="zoneId" type="hidden" value="" />
        <input class="ibisj-form-required zone-name" name="zoneName" id="zoneName" type="text" value="" />
      </p>
      <p>
        <label for="zoneDescription">Zone Description</label>
        <input class="zone-description" name="zoneDescription" id="zoneDescription" type="text" value="" />
      </p>
      <p>
        <label for="zoneClassOfService">Zone Class Of Service</label>
        <input class="zone-classofservice" name="zoneClassOfService" id="zoneClassOfService" type="text" value="" />
      </p>
      <p>
        <label for="zonePorts">Zone Ports</label>
      <table style="margin-left: 150px;">
        <tr>
          <td><select multiple name="select" id="zonePorts" class="port-selector zone-ports">
            </select>
            <a href="#" id="removePorts" style="text-align:center">Remove &gt;&gt;</a> </td>
          <td><select multiple id="allPorts" class="port-selector">
            </select>
            <a href="#" id="addPorts" style="text-align:center">&lt;&lt; Add </a></td>
        </tr>
      </table>
      </p>
      
</div>
<!-- End of .detail-box -->
