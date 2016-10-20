<%--
  User: DLee
  Date: Oct 13, 2009
  Time: 2:26:32 PM
--%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<style type="text/css">
<!--
.style1 { color: #FF0000 }
-->
</style>
<table style="width:100%" cellpadding="5" cellspacing="0" border="0" id="tblDevice">
  <thead>
    <tr class="ui-widget-header">
      <th>ID</th>
      <!-- id -->
      <th>Device Name</th>
      <th>Management URI</th>
      <th>Device Class</th>
      <th>&nbsp;</th>
      <!-- buttons placeholder -->
    </tr>
  </thead>
  <tbody>
    <c:forEach items="${devices}" var="device">
      <tr>
        <td>${device.id}</td>
        <td>${device.name}</td>
        <td>${device.managementURI}</td>
        <td>${device.deviceClass}</td>
        <td></td>
      </tr>
    </c:forEach>
  </tbody>
</table>
<div id="deviceDetailDialog" style="display:none" class="ibis-form">
  <p>
    <label for="deviceName">Name</label>
    <input class="ibisj-form-required" name="deviceName" id="deviceName" type="text" value="" />
    <input name="deviceId" id="deviceId" type="hidden" value="" />
  </p>
  <p>
    <label for="managementURI">Management URI</label>
    <input name="managementURI" id="managementURI" type="text" value="" />
  </p>
  <p>
  <!-- The list must be maintained when device list enum type is updated -->
    <label for="deviceClass">Device Class</label>
    <select name="deviceClass" id="deviceClass">
      <option value="0" selected="selected">Router</option>
      <option value="1">AccessPoint</option>
      <option value="2">Switch</option>
      <option value="3">Gateway</option>
    </select>
  </p>
  <p>
    <label for="deviceClass">Ports</label>
  <div class="port-detail-box" style="margin-left:150px;">

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

</div>

  </div>
  <!-- End of .port-detail-box -->
  </p>
</div>
<br />
<br />
<!-- End of .detail-box -->
<div id="boxAddPort" style="display:none">
  <h3>Port Detail </h3>
  <div class="">
    <form id="frmDevicePort" class="ibis-form" action="">
      <p>
        <label for="portNumber">Port Number</label>
        <input class="ibisj-form-required" name="portNumber" id="portNumber" type="text" value="" />
        <input name="portId" id="portId" type="hidden" value="0" />
      </p>
      <p>
        <label for="portDescription">Description</label>
        <input name="portDescription" id="portDescription" type="text" value="" />
      </p>
      <p>
        <label for="portLocked">Locked</label>
        <input name="portLocked" id="portLocked" type="checkbox" value="true" />
      </p>
      <p>
        <label for="portType">Port Type</label>
        <select name="portType" id="portType" >
        </select>
      </p>
    </form>
  </div>
  <!-- End of .ibis-form-container -->
</div>
<!-- End of .detail-box -->
