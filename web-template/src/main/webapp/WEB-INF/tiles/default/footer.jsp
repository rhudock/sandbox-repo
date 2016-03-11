<%--
  Created by IntelliJ IDEA.
  User: Eric
  Date: Aug 16, 2009
  Time: 7:33:00 PM
  To change this template use File | Settings | File Templates.
--%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<div class="bg"></div>
<div class="inner">
   <h1>
		<fmt:message key="welcome.title"/>
	</h1>
	<p>
		Locale = ${pageContext.response.locale}
	</p>
	<hr>
	<ul>
		<li> <a href="?locale=en_us">us</a> |  <a href="?locale=en_gb">gb</a> | <a href="?locale=es_es">es</a> | <a href="?locale=de_de">de</a> </li>
	</ul>
   <p><span style="float:right; padding-right:12px;">© 2009 DOCOMO interTouch</span></p>
</div>
