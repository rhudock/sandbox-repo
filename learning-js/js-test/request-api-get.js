/*
  https://www.twilio.com/blog/2017/08/http-requests-in-node-js.html
*/

var request = require('request');

console.log("hello");

// curl 'https://api.inq.com/chatrouter/chat/message/0?customerID=9095681961787344324&engagementID=9095681974480566096&config.protectionId=1939635457&windowId=68624129' 
// -H 'Accept-Encoding: gzip, deflate, br' 
// -H 'Accept-Language: en-US,en;q=0.9,ko;q=0.8' -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.167 Safari/537.36' -H 'Accept: */*' -H 'Referer: https://api.inq.com/chatrouter/postToServer/postToServer.htm' -H 'Cookie: JSESSIONID=aaadJNePmHTGHaZkfNehw' -H 'Connection: keep-alive' --compressed --insecure


var options = {
    url: 'https://api.inq.com/chatrouter/chat/message/0?customerID=9095681961787344324&engagementID=9095681974480566096&config.protectionId=1939635457&windowId=68624129',
    method: 'GET',
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
	}
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