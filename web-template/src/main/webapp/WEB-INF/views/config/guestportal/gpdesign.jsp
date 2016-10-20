<%--
 - $Id$
 - gpdesign.jsp
 - Version: 1.0.0
 - Developer: DLee
 - Date: Oct 2, 2009  Time: 9:47:04 AM
 - Copyright (c) Nomadix 2009, All rights reserved.
 - To change this template use File | Settings | File Templates.
 --%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles" %>
<!doctype html>
<html lang="en">
<head>
<title>GuestPortal Editor</title>
<script type="text/javascript">
    var ibisjContextRoot = "<c:url value="/"/>";  // root always ends with /
    function ibisjGetContextUrl(url) {
      if ( url.charAt(0) === '/' ) {
        url = url.substr(1);
      } 
      return ibisjContextRoot + url;
    }
 </script>
<link type="text/css" href="<c:url value="/css/ui/ui.all.css"/>" rel="stylesheet" />
<link href="<c:url value="/js/config/guestportal/css/demos.css"/>" rel="stylesheet" type="text/css" />
<link href="<c:url value="/js/config/guestportal/css/style.css"/>" rel="stylesheet" type="text/css" />
<link href="<c:url value="/js/config/guestportal/widget/css/login.css"/>" rel="stylesheet" type="text/css">
<link href="<c:url value="/js/config/guestportal/widget/css/billplan.css"/>" rel="stylesheet" type="text/css">
<script type="text/javascript" src="<c:url value="/js/jquery-1.3.2.min.js"/>"></script>
<script type="text/javascript" src="<c:url value="/js/ui/jquery-ui.js"/>"></script>
<script type="text/javascript" src="<c:url value="/js/tinymce/jquery.tinymce.js"/>"></script>
<link rel="Stylesheet" type="text/css" href="<c:url value="/js/plugins/jpicker-1.0.10/css/jPicker-1.0.10.css"/>">
<script type="text/javascript" src="<c:url value="/js/plugins/jpicker-1.0.10/jpicker-1.0.10.min.js"/>"></script>
<style type="text/css">
#resizable0 {
  width: 150px;
  height: 150px;
}
.ui-resizable h3 {
  text-align: center;
  margin: 0;
}
.ui-resizable {
  padding: 0.5em;
  margin: 0;
}
</style>
</head><body>
<div id="divControl">
  <p>
    <input id="btnCreate" name="btnCreate" type="button" value="Create New Layout" style="display:none">
    <input id="btnSave" name="btnSave" type="button" value="Save">
    <input id="btnPreview" name="btnPreview" type="button" value="Preview">
    <input id="btnOpen" name="btnOpen" type="button" value="Open Saved" style="display:none">
    |
    <input id="btnSaveClose" name="btnSaveClose" type="button" value="Save and Close">
  </p>
  <div id="propertySetWrap" style="width:900px;">
    <!-- ======================================== -->
    <div id="propertySetTabs">
      <ul class="tabs-nav" style="display:none">
        <li><a href="#fragment-1"><span>Layout Properties</span></a></li>
        <li><a href="#fragment-2"><span>Window Properties</span></a></li>
        <li><a href="#fragment-3"><span>Panel Properties</span></a></li>
      </ul>
      <div id="fragment-1" style="width:850px">
        <p> <strong>Layout Information - </strong><br>
          <input id="hidLayoutId" name="hidLayoutId" type="hidden" value="${layoutId}" style="width:25px" disabled="disabled">
          <label>Name: </label>
          <input id="txtLayoutName" name="txtLayoutName" type="text" value="">
          <label>Zone: </label>
          <select name="sltZone" id="sltZone">
          </select>
          <br><label>Description: </label>
          <input id="txtLayoutDesc" name="txtLayoutDesc" type="text" value="" style="width:400px;">
          <br>
         <!-- Layout's Background Color: <span id="layoutBgSelector"></span> --> </p>
      </div>
      <!-- <div id="fragment-1"> -->
      <div id="fragment-2" style="width:850px">
        <p> <strong>Window Information - </strong>
          <label>Window Width:</label>
          <input id="hidWindowId" name="hidWindowId" type="hidden" value="0">
          <input id="txtWindowWidth" name="txtWindowWidth" type="text" value="900">
          <input id="btnWindowWidth" name="btnWindowWidth" type="button" value="Apply new window width">
          <br />
          <label>Window Aline: </label>
      <select name="sltWindowAline" id="sltWindowAline">
            <option value="0 auto 0 0">Left</option>
            <option value="0 auto">Center</option>
            <option value="0 0 0 auto">Right</option>
          </select>
          |
          Window's Background Color:
          <!--<input id="bgSelector" class='simple-color' value='#cc3333'/> -->
          <span id="windowBgSelector"></span> </p>
      </div>
      <!-- <div id="fragment-2"> -->
      <div id="fragment-3"  style="width:850px">
        <p>
        <div id="msgMain" class="msgMain">Selected message </div>
        <input id="btnDel" name="btnDel" type="button" value="Delete" disabled="disabled">
        |
        <input id="btn2TinyMce" name="btn2TinyMce" type="button" value="Edit" disabled="disabled">
        |
        Background Color Selector :
        <!--<input id="bgSelector" class='simple-color' value='#cc3333'/> -->
        <span id="bgSelector"></span> |  
        Background Image Selector :
        <select id="bgImgSelector" name="bgImgSelector" disabled="disabled">
          <option value="none">Select image</option>
          <option value="<c:url value="/images/gportal/room01.png"/>">room1</option>
          <option value="<c:url value="/images/gportal/room02.png"/>">room2</option>
          <option value="<c:url value="/images/gportal/room03.png"/>">room3</option>
          <option value="<c:url value="/images/gportal/room04.png"/>">room4</option>
        </select>
        <br><input id="btnCalSize" name="btnCalSize" type="button" value="Resize Panel" disabled="disabled">
        </p>
      </div>
      <!-- <div id="fragment-3"> -->
    </div>
    <!-- <div id="propertySetTabs"> -->
  </div>
  <!-- <div id="propertySetWrap"> -->
  <script type="text/javascript">

$(function() {

//   $('#propertySetTabs').tabs();
//   $('#propertySetWrap').css( { 'display': 'block' } );
	 
});
</script>
<p><input id="btnAdd" name="btnAdd" type="button" value="Add Panel"></p>
  <div id="widgetContainer" class="widget-container">
    <div id="widgetWeatherRss" class="widget-box"><img src="<c:url value="/images/Wizard.png"/>"></div>
    <div id="widgetInfo" class="widget-box"><img src="<c:url value="/images/Info.png"/>"></div>
    <div id="widgetBillPlan" class="widget-box"><img src="<c:url value="/images/widget/billplanselect.png"/>"></div>
    <div id="widgetBillPlanRadio" class="widget-box"><img src="<c:url value="/images/widget/billplanradio.png"/>"></div>
  </div>
</div>
<div id="gpWindowWrap" class="demo" style="width:900px; height:600px; border:#666666 thin solid; padding:0px; overflow:visible">
  <div id="gpWindow" style="width:900px; height:600px; padding:0px; overflow:visible"> </div>
  <!-- gpWindow -->
</div>
<!-- End demo -->
<div class="demo-description">
  <div id="divMessage">Content for  id "divMessage" Goes Here</div>
</div>
<!-- End demo-description -->
<script type="text/javascript" src="<c:url value="/js/config/jquery.dcmi.js"/>"></script>
<script type="text/javascript" src="<c:url value="/js/config/guestportal/dcmi.gp.js"/>"></script>
<script type="text/javascript">

(function($) {

   $(function() {
      $.gp.editor.SCLayout.init();
   });

})(jQuery);

</script>
</body>
</html>
