Tutorial From
https://www.w3schools.com/nodejs/nodejs_modules.asp

Open
http://localhost:8080/

## Demo
http://www.dleetest.com:3000/

### Security Test
Client parent page
https://uat.service.vic.gov.au/nuance/servicevic-nuanceChat.html?IFRAME

iFrame page
https://uatvirtualassistant.service.vic.gov.au/nuance/servicevic-nuancechat.html

Content-Security-Policy: frame-ancestors 'self' https://uatvirtualassistant.service.vic.gov.au
X-Frame-Options: SAMEORIGIN


```javascript
var http = require('http');
var dt = require('./myFirstModule');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html', 'location': 'myTest'});
    res.write("The date and time are currently: " + dt.myDateTime());
    res.end();
}).listen(8080);
```



### More examples at https://blog.logrocket.com/forget-express-js-opt-for-these-alternatives-instead/