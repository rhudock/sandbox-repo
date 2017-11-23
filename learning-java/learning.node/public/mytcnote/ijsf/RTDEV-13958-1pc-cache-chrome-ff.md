RTDEV-13958
Implement Support Chrome & Firefox w/3rd Party Cookies Disabled


Work Flow:

> CookieMgr.firstRequestCookie
> CM.requestCookie()
> IFrameproxyCallBack()
> read1SPCCallBack (tcFramework.dev…763001514:5218)

        if( date != null && top.document.referrer && parseUrl(top.document.referrer).domain == parseUrl(inqFrame.location.href).domain ) {
> Case A: working with 1pc Cookie
            CookieMgr.processMessage(ev);
        } else {
> Case B: working with RealTime Data.
            CookieMgr.chatSessionHelper.referrer = top.document.referrer;
            // Get
            CookieMgr.chatSessionHelper.readServerSavedChatInfo();
        }


com.inq.ui.XFrame.prototype.focusHandler = function() {
  var lt = com.inq.flash.client.control.PersistenceManager.GetValue("lf");
  var now = (new Date).getTime();
  var timeout = com.inq.flash.client.chatskins.SkinControl.getInitialTimeout() * com.inq.flash.client.chatskins.SkinControl.SEC;
  if (lt && lt + timeout < now && !com.inq.flash.client.control.PersistenceManager.GetValue("eng")) {
    haxe.Log.trace("Closing outdated chat because timeout has expired, last focused: " + new Date(lt), {fileName:"XFrame.js", lineNumber:302, className:"XFrame", methodName:"focusHandler"});
    com.inq.flash.client.chatskins.SkinControl.closeChat();
  } else {
    com.inq.flash.client.control.PersistenceManager.SetValue("lf", now, true, true);
  }
};



> CM.requestCookie()

read1SPCCallBack (tcFramework.dev…763001514:5218)
LoadMgr.handleSuccess (tcFramework.dev…763001514:3133)
postMessage (async)
doCommandsInClientDomain ()
doCommands ()
_executeCommandFromItems ()
whenPosted ()
postMessage (async)
LoadMgr.sendRequest ()
iframCallback ()



window.forceFPCookie is added on BOA,

```
            /**
             *  firstRequestCookie: Check if 1pc ps solution can be used (mush for iOS 7)
             *  then initiate the process,
             *  or try to use conventional localStorage ps solution.
             */
            CookieMgr.firstRequestCookie = function(){
                if ( CookieMgr.xdPsHelper.isUse1pcXdSolution() ) {
                    // Use 1pc persistent XD solution.
                    CookieMgr.xdPsHelper.enabled = true;
                    CookieMgr.xdPsHelper.requestSavedXdCookies();
                } else if(window.forceFPCookie && CookieMgr.xdPsHelper.is1pcEnabled()) {
					CookieMgr.xdPsHelper.enabled = true;
					CookieMgr.xdPsHelper.requestSavedXdCookies();
				} else {
                    CM.requestCookie();
                }
            };
```

Determines if reading cookie is okay.

    read1SPCCallBack: function (ev) {


CustomerID is saved in cache.




CookieMgr.chatSessionHelper

function IFrameTSCallback(data){

ChatMgr.prototype.onPageLanding

--
How to test
--
Precondition
How to disable 3rd party cookies for each browser use this link(http://www.howtogeek.com/241006/how-to-block-third-party-cookies-in-every-web-browser/
Create agent for Sprint site Agent1: SprintCare BU, Care AG, skills=General Inquiry, max chat =10
Add to hosts 208.109.205.194 sprintrelaystore.com
Check on Portal for Sprint site(ID=154) Use self-detection persistent, Cache Persistent Solution =true
Updated in BR rule-id=50000, set <show-c2chat click-to-persistent="false">

Steps:
Log in as agent1
Open https://www.sprint.com/landings/chat/ fill all neccessary field in Survey and start chat#1
Open Developer tools> Network tab and check Response(Preview) for https://sprint.inq.com/chatskins/launch/site_154_default.js?codeVersion=xxxxxxxxxxxxx and check 'cacheSolutionEnabled'
Observed/Expeceted: cacheSolutionEnabled logged with 'true' value (cacheSolutionEnabled:true)
Customer moves to sub-domain, set in URL https://sprintrelaystore.com and press Enter button
Observed: Page https://sprintrelaystore.com/ is downloaded, chat window is absent
Expected: Page https://sprintrelaystore.com/ should displayed with chat window.
Customer moved back to https://www.sprint.com/landings/chat/
Observed: Page https://www.sprint.com/landings/chat/ is downloaded, chat window is absent
Expected: Page https://www.sprint.com/landings/chat/ should displayed with chat window.
--





https://tc.sprint.com/inqChat.html,https://tc.sprintrelaystore.com/inqChat.html,https://business.bstg-sprint.com/global/snippets/inq/inqChat.html


-- Example from Tagserver
"<?xml version="1.0" encoding="UTF-8"?>↵<transcript-response xmlns="http://www.touchcommerce.com/2012/real_time_metrics"><engagements><engagement id="9095679375465281415"><saleQualified>true</saleQualified><initialResponse>29000</initialResponse><businessRuleID>50000</businessRuleID><agentGroupName>Care</agentGroupName><participantCount>2</participantCount><maxResponseTime>29000</maxResponseTime><launchPageMarker>SPR-CR-1P_AC_Landing_Page</launchPageMarker><currentPageUrl>https://www.sprint.com/landings/chat/</currentPageUrl><duration>1134750</duration><persistent>false</persistent><currentPageMarker>SPR-CR-1P_AC_Landing_Page</currentPageMarker><transferred>false</transferred><owner>agt@tc.com</owner><agentGroupID>10004730</agentGroupID><businessRuleName>SPR-CR-I-R-P1T0N-AAG-1P_AC_Landing_Page-C2CB</businessRuleName><avgResponseTime>20000</avgResponseTime><agentRefs><agentRef id="agt@tc.com" alias="agt@tc.com"><fullName>Agent User</fullName><agentGroupID>10004730</agentGroupID><skills><attribute name="Skill"><value>Care</value><value>Device</value><value>Billing</value><value>GeneralInquiry</value></attribute></skills></agentRef></agentRefs><businessUnitList><businessUnit name="SprintCare" id="444"></businessUnit></businessUnitList><transcript><transcriptLine sendTime="1479764333000" senderId="" senderName="" senderType="MARKER_PAGE">SPR-CR-1P_AC_Landing_Page</transcriptLine><transcriptLine sendTime="1479764333000" senderId="" senderName="" senderType="MARKER_URL">https://www.sprint.com/landings/chat/</transcriptLine><transcriptLine sendTime="1479764333000" senderId="" senderName="" senderType="CLICKSTREAM">IPAddress: 10.22.111.87</transcriptLine><transcriptLine sendTime="1479764333000" senderId="" senderName="" senderType="CLICKSTREAM">TeaLeafID: 9C03161CB02C10B00165C55063329F49</transcriptLine><transcriptLine sendTime="1479764333000" senderId="" senderName="" senderType="CLICKSTREAM">SessionProperties: ↵PageName: 1P AC Landing Page↵</transcriptLine><transcriptLine sendTime="1479764333000" senderId="9095679375462581794" senderName="" senderType="MARKER_PAGE">SPR-CR-1P_AC_Landing_Page</transcriptLine><transcriptLine sendTime="1479764333000" senderId="9095679375462581794" senderName="" senderType="CLICKSTREAM">Inq</transcriptLine><transcriptLine sendTime="1479764333000" senderId="9095679375462581794" senderName="" senderType="CLICKSTREAM">OS: Windows 10</transcriptLine><transcriptLine sendTime="1479764333000" senderId="9095679375462581794" senderName="" senderType="CLICKSTREAM">Native Javascript</transcriptLine><transcriptLine sendTime="1479764333000" senderId="9095679375462581794" senderName="" senderType="CLICKSTREAM">WebRTCCapable: true</transcriptLine><transcriptLine sendTime="1479764333000" senderId="9095679375462581794" senderName="" senderType="CLICKSTREAM">Browser: Chrome 54.0.2840.99</transcriptLine><transcriptLine sendTime="1479764333000" senderId="9095679375462581794" senderName="" senderType="CLICKSTREAM">Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36</transcriptLine><transcriptLine sendTime="1479764333000" senderId="9095679375462581794" senderName="You" senderType="AGENT_OUTCOME" originalText="&lt;!-- Data Pass --&gt;↵Customer Name: Chealwoo Lee↵EMAIL: chealwoo@gmail.com↵Phone Number: 8185752132↵Chat Type: Device / Network↵Chat Reason: test↵Passcode: test">&lt;!-- Data Pass --&gt;↵Customer Name: Chealwoo Lee↵EMAIL: chealwoo@gmail.com↵Phone Number: 8185752132↵Chat Type: Device / Network↵Chat Reason: test↵Passcode: xxxx</transcriptLine><transcriptLine sendTime="1479764333000" senderId="" senderName="Sprint" senderType="CLIENT_OUTCOME">We received your information and will connect you with a Chat Specialist soon.</transcriptLine><transcriptLine sendTime="1479764333000" senderId="agt@tc.com" senderName="agt@tc.com" senderType="AGENT_JOINS_CHAT">Agent 'agt@tc.com' enters chat (as agt@tc.com)</transcriptLine><transcriptLine sendTime="1479764333000" senderId="agt@tc.com" senderName="agt@tc.com" senderType="AUTO_OPENER">Thank you for contacting Sprint. My name is agt@tc.com. I am happy to help you today.</transcriptLine><transcriptLine sendTime="1479764339000" senderId="9095679375462581794" senderName="You" senderType="CLIENT_MESSAGE">hi</transcriptLine><transcriptLine sendTime="1479764362000" senderId="agt@tc.com" senderName="agt@tc.com" senderType="AGENT_MESSAGE">hi</transcriptLine><transcriptLine sendTime="1479764364000" senderId="agt@tc.com" senderName="agt@tc.com" senderType="AGENT_MESSAGE">TESt</transcriptLine><transcriptLine sendTime="1479765288000" senderId="9095679375462581794" senderName="You" senderType="CLIENT_MESSAGE">dsf</transcriptLine><transcriptLine sendTime="1479765299000" senderId="agt@tc.com" senderName="agt@tc.com" senderType="AGENT_MESSAGE">asd</transcriptLine></transcript><extracolumn name="timeInStatus">168968</extracolumn><extracolumn name="siteID">154</extracolumn><extracolumn name="deviceType">Standard</extracolumn><extracolumn name="hasConference">false</extracolumn><extracolumn name="chatID">9095679375465281415</extracolumn><extracolumn name="completed">false</extracolumn><extracolumn name="status">agentWaiting</extracolumn><extracolumn name="launchPage.pageID">203816</extracolumn></engagement></engagements></transcript-response>"

Default value 
'cobrowse_{{siteid}}={auth:0}; inqCA_{{siteid}}=0; inqPc=1; inqSession_{{siteid}}={_svMs:-1,_aTyp:3,cTACC:0,lcId:"0",erCnt:0,apch:0,usvc:0,eqsc:1,srvyr:1,srvyl:0,rsmc:0,dMap:[],LE:0,ttip:"NO",pc:"{{isPersistent}}",_ssID:"{{custid}}",rd:"",sest:"",_sT:312,ltt:1469240231194,CHM:{pmor:false,cb:1,chat:{id:"{{chatid}}",ruleID:{{brid}},aid:"{{agid}}"}},chat:{ruleID:{{brid}},chatType:"C2C",xmlSpec:{id:{{chatspecid}},aspecData:{tGuardToken:""},stId:10200147,chatTheme:{id:{{chatThemeid}}}},pn:null,pC:false,ci:{c:1,h:376,w:499,eml:0,mc:-1,it:120,cwa:1469240132289,cntOS:2,lf:1469240224711,l:1020,t:303,isEngaged:true,msgcnt:{{msgcnt}},lt:1469240231178,s:1,ai:true},aMsgCnt:{{aMsgCnt}},cMsgCnt:{{cMsgCnt}},c2cToPersistent:false,buID:"{{buid}}",id:"{{chatid}}",v3TO:300,qt:2,launchPageId:21205228,aid:"{{agid}}",agID:"{{aggid}}",agName:"{{aggname}}",agtAttrs:{}},_ecID:"{{chatid}}",ji:"aaa4SD5sRWW9qhfKP5lyv",buID:"{{buid}}",agID:"{{aggid}}",_icID:"{{chatid}}"}; inqState_{{siteid}}={VA:[{key:"hash",value:{a13vy22a:[""],a1h7yfg7:["CHROME"],a1bcrmgw:["false"]}},{key:"ban",value:{}}],_loy:1,_ssQ:["2016-07-23T02:11:59.466Z"],_slq:[],_cct:1,_sqc:0,_slc:0,_iex:1,cfl:5,stid:10200147,ctido:{{chatThemeid}},RC:1,vRint:19,fbAG:{{aggid}},vatid:24001806,csidd:29001414,ctidd:24001749,stidd:12200580,soidd:3202670,LDM:{lh:[{id:21205228,cg:[]}]},fst:1469239919466,lst:1469239919466,_ist:"INTERACTED",_f:0,_sesT:312,CHM:{},_dcnt:0}; inqVital_{{siteid}}={INQ:{custID:"9047827939697116318",custIP:"172.27.9.132"},v:3,vcnt:42,vtime:1469240231195,_acid:"-1",_ss:"unsold",_is:1469240231195,_iID:"{{custid}}",_ig:"CHAT",CHM:{lpt:0,lastChat:{id:"{{chatid}}",chatType:"C2C",timestamp:"2016-07-23T02:15:26.724Z",businessUnitID:"{{buid}}",brID:{{brid}},agentGroupID:"{{aggid}}",agentGroupName:"{{aggname}}",agentID:"{{agid}}",svyPrms:{Agent:true}},lastCallId:0}}';

-- Result After populate
"cobrowse_154={auth:0}; inqCA_154=0; inqPc=1; inqSession_154={_svMs:-1,_aTyp:3,cTACC:0,lcId:"0",erCnt:0,apch:0,usvc:0,eqsc:1,srvyr:1,srvyl:0,rsmc:0,dMap:[],LE:0,ttip:"NO",pc:"false",_ssID:"9095679375462581794",rd:"",sest:"",_sT:312,ltt:1469240231194,CHM:{pmor:false,cb:1,chat:{id:"9095679375465281415",ruleID:50000,aid:"agt@tc.com"}},chat:{ruleID:50000,chatType:"C2C",xmlSpec:{id:2000755,aspecData:{tGuardToken:""},stId:10200147,chatTheme:{id:1000278}},pn:null,pC:false,ci:{c:1,h:376,w:499,eml:0,mc:-1,it:120,cwa:1469240132289,cntOS:2,lf:1469240224711,l:1020,t:303,isEngaged:true,msgcnt:1,lt:1469240231178,s:1,ai:true},aMsgCnt:0,cMsgCnt:0,c2cToPersistent:false,buID:"444",id:"9095679375465281415",v3TO:300,qt:2,launchPageId:21205228,aid:"agt@tc.com",agID:"10004730",agName:"Care",agtAttrs:{}},_ecID:"9095679375465281415",ji:"aaa4SD5sRWW9qhfKP5lyv",buID:"444",agID:"10004730",_icID:"9095679375465281415"}; inqState_154={VA:[{key:"hash",value:{a13vy22a:[""],a1h7yfg7:["CHROME"],a1bcrmgw:["false"]}},{key:"ban",value:{}}],_loy:1,_ssQ:["2016-07-23T02:11:59.466Z"],_slq:[],_cct:1,_sqc:0,_slc:0,_iex:1,cfl:5,stid:10200147,ctido:1000278,RC:1,vRint:19,fbAG:10004730,vatid:24001806,csidd:29001414,ctidd:24001749,stidd:12200580,soidd:3202670,LDM:{lh:[{id:21205228,cg:[]}]},fst:1469239919466,lst:1469239919466,_ist:"INTERACTED",_f:0,_sesT:312,CHM:{},_dcnt:0}; inqVital_154={INQ:{custID:"9047827939697116318",custIP:"172.27.9.132"},v:3,vcnt:42,vtime:1469240231195,_acid:"-1",_ss:"unsold",_is:1469240231195,_iID:"9095679375462581794",_ig:"CHAT",CHM:{lpt:0,lastChat:{id:"9095679375465281415",chatType:"C2C",timestamp:"2016-07-23T02:15:26.724Z",businessUnitID:"444",brID:50000,agentGroupID:"10004730",agentGroupName:"Care",agentID:"agt@tc.com",svyPrms:{Agent:true}},lastCallId:0}}"
