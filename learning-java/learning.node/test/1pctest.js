


var parsedUrl = parseUrl("https://sensis.com.au");
var pcDomainUrl = parseUrl("https://chat.senis.com.au");

if ((
    ( pcDomainUrl.subDomainSupport === true || parsedUrl.subDomainSupport === true)
    && (parsedUrl.domain.indexOf(pcDomainUrl.domain) > -1  || pcDomainUrl.domain.indexOf(parsedUrl.domain) > -1 )
    )
    || (pcDomainUrl.domain == parsedUrl.domain )
) {
    CookieMgr.xdPsHelper.hostFileURLUse = pcDomainUrl.href;
    result = true;
}


function parseUrl (str) {
    var m = str.match(/^(https?):\/\/([^\/:]+)(:?(\d*))/);
    var protocol = m[1];
    var host = m[2];
    var dotCount = 0;
    var domain = (host.indexOf('.') >= 0		// Sanity check.
        && (dotCount = host.split('.').length) >= 3)			// One dot domain name (e.g. tc.com) will be used as is
        ? host.split('.').slice(1).join('.')	// Strip the host name.
        : host;									// Default.
    if(domain.indexOf("co.uk") == 0){
        domain = host;
    }
    var port = m[4] ?
        m[4] :
        protocol === "http" ?
            "80" :
            protocol === "https" ? "443" : null;
    var origin = protocol + "://" + host;
    if (port !== null && port !== "80" && port !== "443") {
        origin += ":" + port;
    }
    return {
        origin: origin,
        href: str,
        protocol: protocol,
        domain: domain,
        host: host,
        port: port,
        subDomainSupport:dotCount>3?true:false
    };
}