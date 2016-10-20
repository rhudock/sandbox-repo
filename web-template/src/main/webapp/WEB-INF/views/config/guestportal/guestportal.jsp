<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles" %>
<html>
<head><title>Guest Portal</title>
<link href="<c:url value="/js/config/guestportal/css/demos.css"/>" rel="stylesheet" type="text/css" />
<link href="<c:url value="/js/config/guestportal/css/style.css"/>" rel="stylesheet" type="text/css" />
<link href="<c:url value="/js/config/guestportal/widget/css/login.css"/>" rel="stylesheet" type="text/css">
<link href="<c:url value="/js/config/guestportal/widget/css/billplan.css"/>" rel="stylesheet" type="text/css">  
   <%--<link href="/css/${container.cssName}" rel="stylesheet" type="text/css"/>--%>
<script type="text/javascript" src="<c:url value="/js/jquery-1.3.2.min.js"/>"></script>
<script type="text/javascript" src="<c:url value="/js/ui/jquery-ui.js"/>"></script>  
<script type="text/javascript" src="<c:url value="/js/config/jquery.dcmi.js"/>"></script>  
</head>
<body>

<div id="container" style="">
<c:forEach var="aDiv" items="${divs}">
   <div style="${aDiv.style}" class="gp-sub-box">${aDiv.content}</div>
</c:forEach>
</div>

<script type="text/javascript">

  var ibisjContextRoot = "<c:url value="/"/>";  // root always ends with /


  function ibisjGetContextUrl(url) {
    if (url.charAt(0) === '/') {
      url = url.substr(1);
    }
    return ibisjContextRoot + url;
  }

  (function($) {

    $(function() {

      var cssObj = {
        'border-width' : 0
      };

      // Change background image path.
      $('.gp-sub-box').each(function() {
          $(this).css({ float : 'left' });
      });
      var testTxt = '${container.style}';
//      eval('var cssObj2 = ${container.style}');
      var testObj = $.dcmi.lib.styleStrToObj('${container.style}');
      
      $('#container').css(testObj);

    });

  })(jQuery);

  function loginCheck() {
    document.frmGuestPortal.submit();
  }

</SCRIPT>
</body>
</html>