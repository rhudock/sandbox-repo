<%--
  User: DLee
  Date: Sep 13, 2009
  Time: 2:26:32 PM
--%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<table style="width:100%; border-left:1px solid #ccc; border-right: 1px solid #ccc;" cellpadding="5" cellspacing="0"
       border="0" id="tblPort">
   <thead>
   <tr class="ui-widget-header">
      <th>ID</th>
      <!-- id -->
      <th>Port Number</th>
      <th>Description</th>
      <th>Locked</th>
      <th>Port Type</th>
      <th>Device</th>
      <th>&nbsp;</th>
      <!-- buttons placeholder -->
   </tr>
   </thead>
   <tbody>
   <c:forEach items="${ports}" var="port">
      <tr>
         <td>${port.id}</td>
         <td>${port.portNumber}</td>
         <td>${port.description}</td>
         <td>${port.locked}</td>
         <td>${port.portType.name}</td>
         <td>${port.deviceName}</td>
         <td></td>
         <!-- buttons placeholder -->
      </tr>
   </c:forEach>
   </tbody>
</table>

<div id="portDetailDialog" style="display:none">
   <p>
      <label for="portNumber">Port Number</label>
      <input name="portNumber" class="port-number ibisj-form-required" id="portNumber" type="text" value=""/>
      <input id="portId" name="portId" type="hidden" value=""/>
   </p>

   <p>
      <label for="portDescription">Description</label>
      <input class="portDescription" name="portDescription" id="portDescription" type="text" value=""/>
   </p>

   <p>
      <label for="portLocked">Locked</label>
      <input class="portLocked" name="portLocked" id="portLocked" type="checkbox" value="true"/>
   </p>

   <p>
      <label for="portType">Port Type</label>
      <select class="portType" name="portType" id="portType"></select>
      <input class="portTypeId" name="portTypeId" id="portTypeId" type="hidden" value="true"/>
   </p>

   <p>
      <label for="portDevice">Device</label>
      <input class="portDevice" name="portDevice" id="portDevice" type="text" disabled="disabled"/>
      <input class="portDeviceId" name="portDeviceId" id="portDeviceId" type="hidden" value=""/>
   </p>
</div>