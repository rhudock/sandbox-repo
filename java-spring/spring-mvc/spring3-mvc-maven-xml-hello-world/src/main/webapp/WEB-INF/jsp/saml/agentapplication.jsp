<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
    <link rel="shortcut icon" type="image/x-icon"  href="logo.png"  />
    <title>AIR AgentApplication Application/Launcher Page</title>

</head>
<body bgcolor="#ffffff">
<style type="text/css">
    <!--
    .AIRDownloadMessageTable {
        width: 217px;
        border: 1px solid #999;
        font-family: Verdana, Arial, Helvetica, sans-serif;
        font-size: 14px;
    }
    #AIRDownloadMessageRuntime {
        font-size: 12px;
        color: #333;
    }
    .sipdiv {
        background-color:#008000;
        padding:5px;
        border:0;
        text-decoration:none;
    }
    .siptext {
        color:#FFFFFF;
    }
    body {
        margin: 0px;
        overflow:hidden
    }
    #siptable {
        z-index:10;
        left:0;
        bottom:0;
        position:absolute;
        width: 217px;
        font-size: 14px;
        border: 1px solid #999;
    }
    -->
</style>
<script src="https://chatrouterv3.inq.com/chatrouter/agents/AC_RunActiveContent.js" type="text/javascript"></script>
<script language="JavaScript" type="text/javascript">
    <!--
    var authToken=null;
    var tokenData=null;
    function getCookieItem(id) {
        var crumbs = document.cookie.split("; ");
        var i;
        for (i=0; i<crumbs.length; i++) {
            var namevalue = crumbs[i].split("=");
            if (namevalue[0] == id) {
                return namevalue[1];
            }
        }
        return null;
    }

    function getAuthToken() {
        if (authToken === null) {
            authToken = getCookieItem("authToken");
            if (authToken !== null) {
                authToken = authToken.split("%3D").join("=");
            }
        }
        return authToken;
    }

    function getTokenData() {
        if (tokenData === null) {
            var dataBase64 = decodeURI(getAuthToken());
            var data= atob(dataBase64);
            tokenData = JSON.parse(data);
        }
        return tokenData;
    }


    function getUserID() {
        var json=getTokenData();
        return json.userID;
    }

    function getExpiry() {
        var json=getTokenData();
        var _expires = new Date(json.exp);
        return _expires;
    }

    //alert("userID is: " + getUserID());
    var expiryDate = getExpiry();


    // Version check for the Flash Player that has the ability to start Player Product Install (6.0r65)
    var hasProductInstall = DetectFlashVer(6, 0, 65);

    // Version check based upon the values defined in globals
    var hasRequestedVersion = DetectFlashVer(11, 0, 0);


    var userID =  decodeURI( getUserID()).split("%40").join("@");
    var authCode = (getAuthToken()).split("=").join("%3D");
    //alert("authCode = " + authCode);

    //var authCode = "foo";


    //alert("Authentication code: " + authCode);

    // Check to see if the version meets the requirements for playback
    if ( hasProductInstall && !hasRequestedVersion ) {
        // DO NOT MODIFY THE FOLLOWING FOUR LINES
        // Location visited after installation is complete if installation is required
        var MMPlayerType = (isIE == true) ? "ActiveX" : "PlugIn";
        var MMredirectURL = window.location;
        document.title = document.title.slice(0, 47) + " - Flash Player Installation";
        var MMdoctitle = document.title;

        AC_FL_RunContent(
                "src", "playerProductInstall",
                "FlashVars", "MMredirectURL="+MMredirectURL+'&MMplayerType='+MMPlayerType+'&MMdoctitle='+MMdoctitle+"",
                "width", "100%",
                "height", "100%",
                "align", "middle",
                "id", "AgentApplication",
                "quality", "high",
                "bgcolor", "#FFFFFF",
                "name", "AgentApplication",
                "allowScriptAccess","sameDomain",
                "type", "application/x-shockwave-flash",
                "pluginspage", "http://www.adobe.com/go/getflashplayer"
        );
    } else if (hasRequestedVersion) {
        // if we've detected an acceptable version
        // embed the Flash Content SWF when all tests are passed
        var swfLocation = "file:///C:/workspaces/git/mob11/flex/badge/target/badge-4.0-SNAPSHOT.swf";
//	10:00:31.792 "
//PHPSESSID=e94d00848b0a3c5aca3ed4c09608b6c1; _userID=sbulusu%40touchcommerce.com; SimpleSAMLAuthToken=_64c4956cf09fc78f067faf6f0f7213d1f12ee8b82b"
        var crDomain2 = "${site.chatRouterVanityDomain}";
        var crDomain = "chatrouterv3.inq.com";
        try {
            AC_FL_RunContent(
                    'codebase','http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab',
                    'width','100%',
                    'height','100%',
                    'id','badge',
                    'align','middle',
                    'src','https://'+crDomain+'/chatrouter/agents/badge.swf',
                    'quality','high',
                    'bgcolor','#FFFFFF',
                    'name','badge',
                    'allowscriptaccess','always',
                    'wmode','opaque',
                    'pluginspage','http://www.macromedia.com/go/getflashplayer',
                    // "window.location.search.substring(1)" returns query(a part of request after "?")
                    'flashvars','authDoc='+encodeURI(document.URL)+'&user='+userID+'&authcode='+authCode+'',
                    'movie','https://'+crDomain+'/chatrouter/agents/badge' ); //end AC code
        } catch (er) {
            alert("FATAL ERROR: " + er);
        }

    } else {  // Flash Player is too old or we can't detect the plugin
        document.write('<table id="AIRDownloadMessageTable"><tr><td>Download <a href="AgentApplication.exe">AgentApplication</a> now.<br /><br /><span id="AIRDownloadMessageRuntime">This application requires the <a href="');

        var platform = 'unknown';
        if (typeof(window.navigator.platform) != undefined)
        {
            platform = window.navigator.platform.toLowerCase();
            if (platform.indexOf('win') != -1)
                platform = 'win';
            else if (platform.indexOf('mac') != -1)
                platform = 'mac';
        }

        if (platform == 'win')
            document.write('http://airdownload.adobe.com/air/win/download/latest/AdobeAIRInstaller.exe');
        else if (platform == 'mac')
            document.write('http://airdownload.adobe.com/air/mac/download/latest/AdobeAIR.dmg');
        else
            document.write('http://www.adobe.com/go/getair/');


        document.write('">Adobe&#174;&nbsp;AIR&#8482; runtime</a>.</span></td></tr></table>');
    }
    // -->
</script>
<noscript>
    <table id="AIRDownloadMessageTable">
        <tr>
            <td>
                Download <a href="https://chatrouterv3.inq.com/chatrouter/agents/AgentApplication.exe">AgentApplication</a> now.<br /><br /><span id="AIRDownloadMessageRuntime">This application requires Adobe&#174;&nbsp;AIR&#8482; to be installed for <a href="http://airdownload.adobe.com/air/mac/download/latest/AdobeAIR.dmg">Mac OS</a> or <a href="http://airdownload.adobe.com/air/win/download/latest/AdobeAIRInstaller.exe">Windows</a>.</span>
            </td>
        </tr>
    </table>
</noscript>
</body>
</html>