<%--
  Created by IntelliJ IDEA.
  User: Eric
  Date: Aug 16, 2009
  Time: 5:28:52 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles" %>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-type" content="text/html; charset=utf-8" />
   <title><tiles:getAsString name="title"/></title>

   <link rel="shortcut icon" href="/images/favicon.ico">
   <link rel="icon" href="/images/favicon.ico" type="image/x-icon">

   <style type="text/css" media="all">
         @import "<c:url value="/css/main.css"/>";
         @import "<c:url value="/themes/base/ui.base.css"/>";
         @import "<c:url value="/themes/smoothness/jquery-ui.css"/>";      
      <tiles:useAttribute id="cssFiles" name="cssList" classname="java.util.List" />
      <c:forEach var="cssFile" items="${cssFiles}">
         @import "<c:url value="${cssFile}"/>";
      </c:forEach>
   </style>

   <script type="text/javascript" src="<c:url value="/js/jquery-1.3.2.min.js"/>"></script>
   <script type="text/javascript" src="<c:url value="/js/ui/jquery-ui.js"/>"></script>
   <tiles:useAttribute id="jsFiles" name="jsList" classname="java.util.List" />

   <script type="text/javascript">
			function ibisjGetContextUrl(url) {
				var ibisjContextRoot = "<c:url value="/"/>";  // root always ends with /
				if ( url.charAt(0) === '/' ) {
					url = url.substr(1);
				} 
				return ibisjContextRoot + url;
			}
   </script>
      
   <c:forEach var="jsFile" items="${jsFiles}">
      <script type="text/javascript" src="<c:url value="${jsFile}"/>"></script>
   </c:forEach>
   


   <tiles:insertAttribute name="meta"/>
</head>




<body id="<tiles:insertAttribute name="bodyId"/>" style="word-wrap:break-word; -webkit-nbsp-mode:space; -webkit-line-break:after-white-space; ">
<div id="wrapper">
   <div id="banner">
      <tiles:insertAttribute name="header"/>
      <div id="navigation">
         <tiles:insertAttribute name="navigation"/>
      </div>
   </div>
   <div id="content-wrapper">
      <div id="content">
         <div class="content-top"></div>
         <div class="content">
            <tiles:insertAttribute name="content"/>
         </div>
      </div>
   </div>
   <div id="footer">
      <tiles:insertAttribute name="footer"/>
   </div>
</div>
<script type="text/javascript">
   $(document).ready(function() {
      $('a').click(function() {
         this.blur();
      });
   });
</script>
</body>
</html>
