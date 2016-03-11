<%--
  Created by IntelliJ IDEA.
  User: Eric
  Date: Aug 16, 2009
  Time: 7:33:51 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles" %>
<table cellspacing="0" cellpadding="0" class="layout-grid">
   <tbody>
   <tr>
      <td>
         <table class="layout-grid" cellspacing="0" cellpadding="0">
            <tbody>
            <tr>
               <td class="left-nav">
                  <dl class="config-nav">
                     <dt>Facilities</dt>
                     <dd><a href="<c:url value="/ui/config/facilities/device"/>">Devices</a></dd>
                     <dd><a href="<c:url value="/ui/config/facilities/ports"/>">Ports</a></dd>
                     <dd><a href="<c:url value="/ui/config/facilities/room"/>">Rooms</a></dd>
                     <dd><a href="<c:url value="/ui/config/facilities/vroom"/>">Virtual Rooms</a></dd>
                     <dt>Service Configuration</dt>
                     <dd><a href="#">HSIA</a></dd>
                     <dd><a href="#">Video On Demand</a></dd>
                     <dd><a href="#">Telephony</a></dd>
                     <dd><a href="#">Environment</a></dd>
                     <dt>Billing</dt>
                     <dd><a href="<c:url value="/ui/config/billing/plans"/>">Billing Plans</a></dd>
                     <dd><a href="<c:url value="/ui/config/billing/zone"/>">Zones</a></dd>
                     <dd><a href="#">Settlement</a></dd>
                     <dt>Guest Portal</dt>
                     <dd><a href="<c:url value="/ui/config/guestportal/layout"/>">Layouts</a></dd>
                     <dd><a href="#">Content Management</a></dd>
                     <dd><a href="#">Widgets</a></dd>
                     <dt>Access Control</dt>
                     <dd><a href="#">Users</a></dd>
                     <dd><a href="#">Groups</a></dd>
                     <dd><a href="#">External Authentication</a></dd>
                  </dl>
               </td>
               <td class="normal">
                  <div id="config-header">
                     <h4><tiles:getAsString name="config-section"/></h4>

                     <h3><tiles:getAsString name="config-title"/></h3>
                  </div>
                  <div id="config-content">
                     <!-- Configuration Page Content -->
                     <tiles:insertAttribute name="config-content"/>
                  </div>
               </td>
            </tr>
            </tbody>
         </table>
      </td>
   </tr>
   </tbody>
</table>