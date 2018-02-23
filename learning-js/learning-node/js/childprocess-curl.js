const { exec } = require('child_process');

var args = process.argv.slice(2);

switch (args[0]) {
    case 'closeChat':
        {
            let curlCloseChatStr = 'curl "https://api.inq.com/chatrouter/chat/closeChat?customerID=9095681961787344324^&rand=0.41753243586430666^&engagementID=9095681961804396332" -H "Accept-Encoding: gzip, deflate, br" -H "Accept-Language: en-US,en;q=0.9,ko;q=0.8" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.167 Safari/537.36" -H "Accept: */*" -H "Referer: https://api.inq.com/chatrouter/postToServer/postToServer.htm" -H "Cookie: JSESSIONID=aaaTPNPniHdsa6Wl2u3gw" -H "Connection: keep-alive" --compressed --insecure';

            exec(curlCloseChatStr, (err, stdout, stderr) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(stdout);
            });
        }
        break;
    case 'engageChat':  // node .\childprocess-curl.js engageChat
        {
            // let curlEngageRequest = 'curl "https://api.inq.com/chatrouter/chat/message?customerID=9095681961787344324" -H "Origin: https://api.inq.com" -H "Accept-Encoding: gzip, deflate, br" -H "Accept-Language: en-US,en;q=0.9,ko;q=0.8" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.167 Safari/537.36" -H "Content-type: application/x-www-form-urlencoded" -H "Accept: */*" -H "Referer: https://api.inq.com/chatrouter/postToServer/postToServer.htm" -H "Cookie: JSESSIONID=aaaTPNPniHdsa6Wl2u3gw" -H "Connection: keep-alive" --data "^&version=0.05^&windowId=31977229^&messageType=chat.request^&engagementID=9095681961897522994^&config.site_id=10003715^&config.language=en^&config.script_id=10200147^&businessUnitID=13000508^&config.chat_title=BB-O-R-Marketing-C2C^&businessRuleID=1018^&config.inc_assignment_id=90956819617873443241^&config.session_id=90956819617873443241^&config.protectionId=1503427841^&config.agent_alias=Chris^&qt=2^&config.fallback-agent-group-enabled=false^&config.automaton_data_map=^%^7BtGuardToken^%^3A^%^22^%^22^%^7D^&config.launch_page=BB-O-Homepage^&config.launch_type=C2C^&config.device_type=Standard^&config.browser_type=CHROME^&config.browser_version=64.0.3282.167^&config.operating_system_type=Windows^&external_customer_ids=phone^&countryCode=BE^&regionCode=BR^&config.agent_attributes=^&config.agent_group_id=10004026^&config.visitor_attributes=browserType^%^2CCHROME^&config.rule_attributes=tooltipDisplayed^%^2CNO^&customerID=9095681961787344324^&client.name=You^&chat.persistent=false^&config.page_id=21205228^&time.delta=5" --compressed --insecure';
            let curlEngageRequest = "curl 'https://api.inq.com/chatrouter/chat/message?customerID=9095681961787344324' -H 'Origin: https://api.inq.com' -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: en-US,en;q=0.9,ko;q=0.8' -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.167 Safari/537.36' -H 'Content-type: application/x-www-form-urlencoded' -H 'Accept: */*' -H 'Referer: https://api.inq.com/chatrouter/postToServer/postToServer.htm' -H 'Cookie: JSESSIONID=aaaTPNPniHdsa6Wl2u3gw' -H 'Connection: keep-alive' --data '&version=0.05&windowId=31977229&messageType=chat.request&engagementID=9095681961897522994&config.site_id=10003715&config.language=en&config.script_id=10200147&businessUnitID=13000508&config.chat_title=BB-O-R-Marketing-C2C&businessRuleID=1018&config.inc_assignment_id=90956819617873443241&config.session_id=90956819617873443241&config.protectionId=1503427841&config.agent_alias=Chris&qt=2&config.fallback-agent-group-enabled=false&config.automaton_data_map=%7BtGuardToken%3A%22%22%7D&config.launch_page=BB-O-Homepage&config.launch_type=C2C&config.device_type=Standard&config.browser_type=CHROME&config.browser_version=64.0.3282.167&config.operating_system_type=Windows&external_customer_ids=phone&countryCode=BE&regionCode=BR&config.agent_attributes=&config.agent_group_id=10004026&config.visitor_attributes=browserType%2CCHROME&config.rule_attributes=tooltipDisplayed%2CNO&customerID=9095681961787344324&client.name=You&chat.persistent=false&config.page_id=21205228&time.delta=5' --compressed --insecure";
            console.log("Running " + curlEngageRequest);
            exec(curlEngageRequest, (err, stdout, stderr) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(stdout);
            });
        }
        break;
    default:
        console.log("usage is ");
        break;
}

