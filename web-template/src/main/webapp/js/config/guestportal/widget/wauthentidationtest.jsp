<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%@ page contentType="text/html; charset=iso-8859-1" language="java" import="java.sql.*" errorPage="" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<title>widget ajax test</title>
<script type="text/javascript" src="<c:url value="/js/jquery-1.3.2.min.js"/>"></script>
</head>

<body>
<script type="text/javascript">

(function($) {

	$(function() {
		$.get("wauthentidation.jsp", 
		function(data){
			$('#myText').html(data);
		}
		);
		
$.get("wauthentidation.jsp", function(data){
  alert("Data Loaded: " + data);
});
		
		
	});
	
})(jQuery);	
</script>


<div id="myText" style="border:#FF0000 thin solid"> </div>

<a href="wauthentidation.jsp">Link</a> 
</body>
</html>
