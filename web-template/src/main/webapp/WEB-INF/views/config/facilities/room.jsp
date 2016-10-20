<%--
  User: DLee
  Date: Sep 13, 2009
  Time: 2:26:32 PM
--%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<table style="width:100%" cellpadding="5" cellspacing="0" border="0" id="tblRoom">
   <thead>
   <tr class="ui-widget-header">
      <th>ID</th>
      <!-- id -->
      <th>Room Name</th>
      <th>Description</th>
      <th>Occupied</th>
      <th>&nbsp;</th>
      <!-- buttons placeholder -->
   </tr>
   </thead> 
   <tbody>
   <c:forEach items="${rooms}" var="room">
      <tr>
         <td>${room.id}</td>
         <td>${room.name}</td>
         <td>${room.description}</td>
         <td>${room.occupied}</td>
         <td></td>
         <!-- buttons placeholder -->
      </tr>
   </c:forEach>
   </tbody>   
</table>
<div id="roomDetailDialog" style="display:none" class="ibis-form">
      <p>
        <label for="roomName">Room name</label>
        <input class="room-id" id="roomId" name="roomId" type="hidden" value="" />
        <input class="ibisj-form-required room-name" name="roomName" id="roomName" type="text" value="" />
      </p>
      <p>
        <label for="roomDescription">Room Description</label>
        <input class="room-description" name="roomDescription" id="roomDescription" type="text" value="" />
      </p>
      <p>
        <label for="roomOccupied">Room Occupied</label>
        <input class="room-occupied" name="roomOccupied" id="roomOccupied" type="text" value="" />
      </p>
      <p>
        <label for="roomPorts">Room Ports</label>
      <table style="margin-left: 150px;">
        <tr>
          <td><select multiple name="roomPorts" id="roomPorts" class="port-selector">
            </select>
            <a href="#" id="removePorts" style="text-align:center">Remove &gt;&gt;</a> </td>
          <td><select multiple id="allPorts"  class="port-selector">
            </select>
            <a href="#" id="addPorts" style="text-align:center">&lt;&lt; Add </a></td>
        </tr>
      </table>
      </p>
</div>
<!-- End of .detail-box -->
