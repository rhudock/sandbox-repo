/*
  https://www.twilio.com/blog/2017/08/http-requests-in-node-js.html
*/

var request = require('request');

console.log("hello");


var options = {
    url: 'https://api.touchcommerce.com/chatrouter/chat/message?customerID=9095681961787344324',
    method: 'POST',
	headers: {
        "Origin": "https://api.touchcommerce.com",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9,ko;q=0.8",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.167 Safari/537.36",
        "Content-type": "application/x-www-form-urlencoded",
        "Accept": "*/*",
        "Referer": "https://api.touchcommerce.com/chatrouter/postToServer/postToServer.htm",
        "Cookie": "JSESSIONID=aaaTPNPniHdsa6Wl2u3gw",
        "Connection": "keep-alive"
	},
	body: '&version=0.05&windowId=57283049&messageType=chat.request&engagementID=9095681967322462013&config.site_id=10003715&config.language=en&config.script_id=10200147&businessUnitID=13000508&config.chat_title=BB-O-R-Marketing-C2C&businessRuleID=1018&config.inc_assignment_id=90956819617873443241&config.session_id=90956819617873443243&config.protectionId=1941732609&config.agent_alias=Chris&qt=2&config.fallback-agent-group-enabled=false&config.automaton_data_map=%7BtGuardToken%3A%22%22%7D&config.launch_page=BB-O-Homepage&config.launch_type=C2C&config.device_type=Standard&config.browser_type=CHROME&config.browser_version=64.0.3282.167&config.operating_system_type=Windows&external_customer_ids=phone&countryCode=BE&regionCode=BR&config.agent_attributes=&config.agent_group_id=10004026&config.visitor_attributes=browserType%2CCHROME&config.rule_attributes=tooltipDisplayed%2CNO&customerID=9095681961787344324&client.name=You&chat.persistent=false&config.page_id=21205228&time.delta=7'
};

function callback(error, response, body) {
	if (!error && response.statusCode == 200) {
		var info = JSON.parse(body);
		console.log(info);
	}
}

var i = 0;
for (i = 0; i < 1; i++) {
	var j = 0;
	var errorCnt = 0;

	request(options, function (error, response, body) {
		j++;
		console.log("return " + j);
		if (!error && response.statusCode == 200) {
			var info = JSON.parse(body);
			console.log(info);
		} else {
			errorCnt++;
			console.error("error cnt " + errorCnt + ", error: " + error);
			console.log("Return Status:" + response.statusCode);
		}
	});

}