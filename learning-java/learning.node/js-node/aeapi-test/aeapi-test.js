/**
 * Created by dlee on 10/28/17.
 *
 * This test is built Based on
 * https://jira.touchcommerce.com/browse/TESTCASE-6203
 *
 * Login page
 * https://api.touchcommerce.com/j_spring_security_check  j_username  j_password
 *
 *

 https://api.touchcommerce.com/engagementAPI/v1/agent/doc/swagger-ui.html

 https://api.touchcommerce.com/

 curl -u agt@tc.com:Inq!12345 -X POST --header "Content-Type: application/json"
 --cookie "JSESSIONID=aaaoCnXYIGy4m5k32UB9v"
 --header "Accept: application/json"
 -d "{  \"password\": \"123\",  \"username\": \"a1\"}"
 "https://api.touchcommerce.com/engagementAPI/v1/agent/login?output=json"

 curl -X GET --cookie "JSESSIONID=aaaoCnXYIGy4m5k32UB9v" --header "Accept: application/json"
 "https://api.touchcommerce.com/engagementAPI/v1/agent/messages?registeredId=9074007722963566601&output=json&agentId=a1"

 curl -X POST --cookie "JSESSIONID=aaaoCnXYIGy4m5k32UB9v" --header "Content-Type: application/json" --header "Accept: application/json"
 -d "{  \"agentId\": \"a1\",  \"engagementId\": \"9095681296375707477\"}"
 "https://api.touchcommerce.com/engagementAPI/v1/agent/acceptEngagement?registeredId=9074007722963566601&output=json"

 curl -X POST --cookie "JSESSIONID=aaaoCnXYIGy4m5k32UB9v" --header "Content-Type: application/json" --header "Accept: application/json"
 -d "{  \"agentId\": \"a1\",  \"chatLineReceiverType\": \"internal\",  \"command\": \"string\",  \"engagementId\": \"9095681296190043987\",  \"messageText\": \"message1\",  \"messageType\": \"chatLine\",  \"scriptTreeId\": \"string\",  \"scriptType\": \"text\",  \"state\": \"agentIsTyping\"}"
 "https://api.touchcommerce.com/engagementAPI/v1/agent/messages?registeredId=9074007722963566601&output=json"
 */

var request = require('request');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Set the headers
var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
}

// https://api.touchcommerce.com/j_spring_security_check  j_username  j_password
// Configure the request
var options = {
    url: 'https://api.touchcommerce.com/j_spring_security_check',
    method: 'POST',
    headers: headers,
    form: {'j_username': 'agt@tc.com', 'j_password': '123'}
}

// Start Session Login
request(options, function (error, response, body) {
    if(error){
        console.log(error)
    }

    if (!error && response.statusCode == 200) {
        // Print out the response body
        console.log(body);
    } else if (response.statusCode == 302) {
        var regex = /JSESSIONID=([^;]+).*/
        var str = "" + response.headers['set-cookie'];
        var result = str.match(regex);
        var jsession = result[1];

        console.log(response.statusCode);
        console.log(response.headers);
        console.log(response.headers['set-cookie']);
        console.log("JSession: " + jsession);


        var cookieString = "JSESSIONID=" + jsession + '; expires=' + new Date(new Date().getTime() + 86409000);
        var cookie = request.cookie(cookieString);

        var headersLogin = {
            'User-Agent':       'Super Agent/0.0.1',
            'Content-Type':     'application/json',
            "Accept": "application/json",
            'Cookie': cookie
        }

        var optionsLogin = {
            url: 'https://api.touchcommerce.com/engagementAPI/v1/agent/login?output=json',
            method: 'POST',
            headers: headersLogin,
            body: "{  \"password\": \"123\",  \"username\": \"a1\"}"
        }

        console.log('start log in .....');
        request(optionsLogin, function (error, response, body) {
            if(error){
                console.log(error)
            }

            if (!error && response.statusCode == 200) {
                // Print out the response body
                console.log(body);
                var registrationId = JSON.parse(body).registeredId;

                rl.question('Please, engage a chat and back to here', (answer) => {
                    console.log(`Get a new chat: ${answer}`);

                    var optionsGet = {
                        url: `https://api.touchcommerce.com/engagementAPI/v1/agent/messages?registeredId=${registrationId}&output=json&agentId=a1`,
                        method: 'GET',
                        headers: headersLogin
                    }

                    console.log('start GET message .....');
                    request(optionsGet, function (error, response, body) {
                        if(error){
                            console.log(error)
                        }

                        if (!error && response.statusCode == 200) {
                            // Print out the response body
                            console.log(body);
                            var engagementId = JSON.parse(body).engagements[0].id;


                            var optionsEngage = {
                                url: `https://api.touchcommerce.com/engagementAPI/v1/agent/acceptEngagement?registeredId=${registrationId}&output=json`,
                                method: 'POST',
                                headers: headersLogin,
                                body: `{  \"agentId\": \"a1\",  \"engagementId\": \"${engagementId}\"}`
                            }

                            // -- Call engage chat
                            console.log(`Engage Chat: ${engagementId}`);
                            request(optionsEngage, function (error, response, body) {
                                console.log(`Engage Chat: ${engagementId} call done`);
                                if(error){
                                    console.log(error)
                                }

                                if (response.statusCode == 200) {
                                    // Print out the response body
                                    console.log(response.statusCode);
                                    console.log(body);
                                    // console.log(response.headers);

                                    var optionsPost = {
                                        url: `https://api.touchcommerce.com/engagementAPI/v1/agent/messages?registeredId=${registrationId}&output=json`,
                                        method: 'POST',
                                        headers: headersLogin,
                                        // body: `{  \"agentId\": \"a1\",  \"chatLineReceiverType\": \"external\",  \"engagementId\": \"${engagementId}\",  \"messageText\": \"message1\",  \"messageType\": \"chatLine\"}`
                                        body: `{  \"agentId\": \"a1\",  \"chatLineReceiverType\": \"external\",  \"engagementId\": \"${engagementId}\",  \"messageText\": \"message1\",  \"messageType\": \"dynamicForm\"}`
                                    }

                                    // -- call POST a message to CI
                                    console.log(`Post a message to Chat: ${engagementId}`);
                                    request(optionsPost, function (error, response, body) {
                                        console.log(`Post a message to Chat: ${engagementId} done`);
                                        if(error){
                                            console.log(error)
                                        }

                                        if (response.statusCode == 200) {
                                            // Print out the response body
                                            console.log(response.statusCode);
                                            console.log(body);
                                            // console.log(response.headers);

                                            process.exit(0);

                                        } else {
                                            console.log(response.statusCode);
                                            console.log(response.headers);
                                            console.log(body);
                                        }
                                    });
                                    console.log(`End`);
                                } else {
                                    console.log(response.statusCode);
                                    console.log(response.headers);
                                    console.log(body);
                                }
                            });
                        } else {
                            console.log(response.statusCode);
                            console.log(response.headers);
                            console.log(body);
                        }
                    });

                    rl.close();
                });
            } else {
                console.log(response.statusCode);
                console.log(response.headers);
                console.log(body);
            }
        });
    }

})