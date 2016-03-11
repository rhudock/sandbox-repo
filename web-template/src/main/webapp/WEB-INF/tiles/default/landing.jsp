<%--
  Created by IntelliJ IDEA.
  User: Eric
  Date: Aug 16, 2009
  Time: 7:33:51 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles" %>

<div id="landing-content">

	<h1><tiles:getAsString name="landing-title"/></h1>
	<tiles:insertAttribute name="landing-intro"/>

	<div id="landing-content-body">
		<tiles:insertAttribute name="landing-content"/>
   </div>
</div>