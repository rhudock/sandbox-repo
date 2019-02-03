
Component: IJSF, RulesGen

RTDEV-15619 
ATT HSC - GM OTT - Memory Leak in Chat - AT&T Issue # 1420 - Sev 1

Additional
RTDEV-15957
Additional Memory leak is detected after fixing RTDEV-15619


RTDEV-15972
In m.att.com C2C is missing after visiting a suppressed page	


RTDEV-16036
AT&T Proactive Rule Defect for Multiple BU's ***Internal***
--
Order 201950353383
zip 20785
Press continu
--


Requirements:

URL: https://gmott-prod.ucilab.com/watch/shows

https://www.att.com/contactus/index/internet.html


They just provided me with these:
User Name: tb4888@att.com
Password: ChatR0cks! 
https://directvnow.com/watch/shows



this.getVar(akey).setValue( (loc_tmpVars && loc_tmpVars.hasOwnProperty(akey) ) ? loc_tmpVars[akey] : this._vartable[akey].dfltValue);



--
<business default-business-unit-id="19000680" ada-compliant="true" disable-dom-mutation-observation="true">

disable-dom-mutation-observation

		if(!!window.MutationObserver && !disableMutationObservation){
			domObserver = new MutationObserver(onDomMutation);
			domObserver.observe(doc.body, {childList: true, subtree: true, attributes: true});
			doc.body.setAttribute('data-inq-observer', '1');
		}


--
var initRulesData


	initSiteDefaultData:function(siteData, rulesEngineData, landingData) {
		v3Lander.landingData = landingData;

		// RTDEV-15619 to prevent big string object saved in memory many times.
		if( !window.top.inqSiteDataFun ) {
			window.top.inqSiteDataFun = "var initSiteData = " + siteData.toString();
			window.top.inqRulesEngineFun = "var initRulesData = " + rulesEngineData.toString();
		}

		v3Lander.inqSiteDataFun = window.top.inqSiteDataFun;
		v3Lander.inqRulesEngineFun = window.top.inqRulesEngineFun;
		if (!v3Lander.isBupMode || parent.v3Lander.mbusToLoad.length == 0) {
			v3Lander.loadTcFramework();
		} else {
			v3Lander.loadMbuData();
		}
	},


--
org


    initSiteDefaultData:function(siteData, rulesEngineData, landingData) {
        v3Lander.landingData = landingData;
        v3Lander.inqSiteDataFun = "var initSiteData = " + siteData.toString();
        v3Lander.inqRulesEngineFun = "var initRulesData = " + rulesEngineData.toString();
        if (!v3Lander.isBupMode || parent.v3Lander.mbusToLoad.length == 0) {
            v3Lander.loadTcFramework();
        } else {
            v3Lander.loadMbuData();
        }
    },


--

Run the following commands in the browser console window:
1. inqFrame.Inq.PM.getVar("target_agent_name").getValue()
Observed/Expected: ""
2. inqFrame.Inq.PM.getVar("target_agent_name").setValue("TestTest")
Observed/Expected: "TestTest"
3. inqFrame.Inq.PM.getVar("target_agent_name").getValue()
Observed/Expected: "TestTest"
4. Inq.reinitChat()


--

Inq.unblockService("ALL");

inqFrame.Inq.isServiceBlocked(Type) 




-- Code Dump

alert(
"condition: " + ((!(isDeviceType("Phone"))) && ((LDM.getPageMarker() ? LDM.getPageMarker().equals("ATT-OrderHub-OS-O-OrderDetails", true) : false)) && ((new Boolean(PM.getVar("agentGroupMap",rule).getValue().get(getConstant("MOB_OS-ORDER_STATUS", rule))).valueOf())) && (getConstant("fl", rule) < PM.getVar("cfl",rule).getValue()) && (new Date().after(PM.getVar("SuppressProactiveRules-Timer",rule).getValue().roll(300000))) && (PM.getVar("160607a",rule).getValue() == 1)) +
"\n, LDM.getPageMarker():" + LDM.getPageMarker() + 
'\n, ((new Boolean(PM.getVar("agentGroupMap",rule).getValue().get(getConstant("MOB_OS-ORDER_STATUS", rule))).valueOf())): ' + ((new Boolean(PM.getVar("agentGroupMap",rule).getValue().get(getConstant("MOB_OS-ORDER_STATUS", rule))).valueOf())) +
'\n,  -- PM.getVar("agentGroupMap",rule).getValue(): ' + PM.getVar("agentGroupMap",rule).getValue() +
'\n,  -- getConstant("MOB_OS-ORDER_STATUS", rule): ' + getConstant("MOB_OS-ORDER_STATUS", rule) +
'\n,  -- new Boolean(PM.getVar("agentGroupMap",rule).getValue().get(getConstant("MOB_OS-ORDER_STATUS", rule))).valueOf(): ' + new Boolean(PM.getVar("agentGroupMap",rule).getValue().get(getConstant("MOB_OS-ORDER_STATUS", rule))).valueOf() +
	""
);
alert('Continue (getConstant("fl", rule) < PM.getVar("cfl",rule).getValue()): ' + (getConstant("fl", rule) < PM.getVar("cfl",rule).getValue()) +
// '\n, (new Date().after(PM.getVar("SuppressProactiveRules-Timer",rule).getValue().roll(300000))): ' + new Date().after(PM.getVar("SuppressProactiveRules-Timer",rule).getValue().roll(300000)) +
'\n, (PM.getVar("160607a",rule).getValue() == 1 ): ' + (PM.getVar("160607a",rule).getValue()  == 1) +
'\n,  -- PM.getVar("160607a",rule).getValue(): ' + PM.getVar("160607a",rule).getValue() 
);