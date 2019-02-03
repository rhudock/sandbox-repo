/**
 * Created by dlee on 10/28/17.
 *
 * This test is built Based on
 * https://jira.touchcommerce.com/browse/TESTCASE-6203
 *
 * Login page
 * https://api.touchcommerce.com/j_spring_security_check  j_username  j_password
 *
 * swagger API page
 * https://api.touchcommerce.com/engagementAPI/v1/agent/doc/swagger-ui.html
 * https://api.touchcommerce.com/engagementAPI/v2/agent/swagger-ui.html


 // -- Agent login
 curl -u agt@tc.com:Inq!12345 -X POST --header "Content-Type: application/json"
 --cookie "JSESSIONID=aaaoCnXYIGy4m5k32UB9v"
 --header "Accept: application/json"
 -d "{  \"password\": \"123\",  \"username\": \"a1\"}"
 "https://api.touchcommerce.com/engagementAPI/v1/agent/login?output=json"
 ' 'https://api.touchcommerce.com/engagementAPI/v2/agent/login?output=json'

 // -- Get message
 curl -X GET --cookie "JSESSIONID=aaaoCnXYIGy4m5k32UB9v" --header "Accept: application/json"
 "https://api.touchcommerce.com/engagementAPI/v1/agent/messages?registeredId=9074007722963566601&output=json&agentId=a1"
 https://api.touchcommerce.com/engagementAPI/v2/agent/messages?registeredId=123&instantResponse=false&output=xml&agentId=a1'

 // -- Engage a Chat
 curl -X POST --cookie "JSESSIONID=aaaoCnXYIGy4m5k32UB9v" --header "Content-Type: application/json" --header "Accept: application/json"
 -d "{  \"agentId\": \"a1\",  \"engagementId\": \"9095681296375707477\"}"
 "https://api.touchcommerce.com/engagementAPI/v1/agent/acceptEngagement?registeredId=9074007722963566601&output=json"
 https://api.touchcommerce.com/engagementAPI/v2/agent/acceptEngagement?registeredId=sdf&output=json'

 // -- Post a message
 curl -X POST --cookie "JSESSIONID=aaaoCnXYIGy4m5k32UB9v" --header "Content-Type: application/json" --header "Accept: application/json"
 -d "{  \"agentId\": \"a1\",  \"chatLineReceiverType\": \"internal\",  \"command\": \"string\",  \"engagementId\": \"9095681296190043987\",  \"messageText\": \"message1\",  \"messageType\": \"chatLine\",  \"scriptTreeId\": \"string\",  \"scriptType\": \"text\",  \"state\": \"agentIsTyping\"}"
 "https://api.touchcommerce.com/engagementAPI/v1/agent/messages?registeredId=9074007722963566601&output=json"
 'https://api.touchcommerce.com/engagementAPI/v2/agent/messages?registeredId=ds&output=xml'




 https://auth.touchcommerce.com/oauth-server/oauth/authorize?response_type=token&redirect_uri=https%3A%2F%2Fapi.touchcommerce.com%2FengagementAPI%2Fv2%2Fagent%2Fwebjars%2Fspringfox-swagger-ui%2Fo2c.html&realm=realm&client_id=swaggerClientId&scope=read%20write%20vendorExtensions&state=oauth2
 https://auth.touchcommerce.com/oauth-server/login

 */

var request = require('request');

// Set the headers
var headers = {
    'User-Agent': 'Super Agent/0.0.1',
    'Content-Type': 'application/x-www-form-urlencoded'
}

// https://api.touchcommerce.com/j_spring_security_check  j_username  j_password
// Configure the request
var options = {
    url: 'https://auth.touchcommerce.com/oauth-server/login',
    method: 'POST',
    headers: headers,
    form: {'username': 'agt@tc.com', 'password': '123'}
}

request(options, function (error, response, body) {
    if (error) {
        console.log(error)
    }

    console.log(response.statusCode);
    console.log(response.headers);
    console.log(body);

    if (!error && response.statusCode == 200) {
        // Print out the response body
        console.log(body);
    } else if (response.statusCode == 302) {
        var regex = /JSESSIONID=([^;]+).*/
    } else {

    }

    process.exit(0);
});

