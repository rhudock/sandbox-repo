

/**
 * Maps url to object with extracted parts (origin, href, protocol, domain, host, port)
 * @param str
 * @return {{origin: string, href: *, protocol: *, domain: String, host: *, port: *}}
 */
function parseUrl (str) {
    var m = str.match(/^(https?):\/\/([^\/:]+)(:?(\d*))/);
    var host = m[2];
    var domain = (host.indexOf('.') >= 0		// Sanity check.
        && host.split('.').length >= 3)			// One dot domain name (e.g. tc.com) will be used as is
        ? host.split('.').slice(1).join('.')	// Strip the host name.
        : host;									// Default.
    return {
        origin: m[1] + "://" + m[2],
        href: str,
        protocol: m[1],
        domain: domain,
        host: host,
        port: (m[4] ? m[4] : 80)
    };
}

// var currentDomain = parseUrl("http://auspost.com.au/nuance/nuanceChat.html").domain;
var currentDomain = parseUrl("https://auspost.com.au/?&ecid=p13702683655").domain;
var domainToCheck = parseUrl("https://nuance.auspost.com.au/nuance/nuanceChat.html").domain;

if (( currentDomain.indexOf(domainToCheck) > -1 )
    || (domainToCheck == currentDomain )
) {
console.log("Test is done successfully");
}


/**
 *  Populates hostedUrls and CookieMgr.xdPsHelper.domains2Check
 *  hosted file URLs are used as is without Protocol change since
 *  some clients do not provide https protocol or vise versa.
 */
populateDomains2Check = function () {
    var result = false;
    var currentDomain;
    // sample: var hostedUrls = [ "http://www.touchcommerce.com/TouchCommercetop.html", "https://tc.inq.com/TouchCommercetop.html" ];
    var hostedUrls = (typeof urls.siteHostedFileURL === "string") ? urls.siteHostedFileURL.split(",") : [];
    if(hostedUrls.length > 1 || hostedUrls[0].trim() != "")  {
        for (var j = 0; j < hostedUrls.length; j++ ) {
            if ( CookieMgr.xdPsHelper.domains2Check.pushHostedFileUrl( hostedUrls[j].trim() ) ) {
                // log - hostedUrls[j] has been added into CookieMgr.xdPsHelper.domains2Check[]
            } else {
                // log - hostedUrls[j] is NOT added into CookieMgr.xdPsHelper.domains2Check[]
                // because hostedUrls[j] may be a duplicated hosted file in a same domain
            }
        }

        // Once populated find hosted file url for the current page.
        for (var i = 0; i < CookieMgr.xdPsHelper.domains2Check.length; i++ ) {
            currentDomain = inqFrame.location.domain ? inqFrame.location.domain : parseUrl(inqFrame.location.href).domain;
            if (( CookieMgr.xdPsHelper.domains2Check[i].subDomainSupport === true && currentDomain.indexOf(CookieMgr.xdPsHelper.domains2Check[i].domain) > -1 )
                || (CookieMgr.xdPsHelper.domains2Check[i].domain == currentDomain )
            ) {
                CookieMgr.xdPsHelper.hostFileURLUse = CookieMgr.xdPsHelper.domains2Check[i].href;
                result = true;
                break;
            }
        }
    }

    if (isNullOrUndefined(CookieMgr.xdPsHelper.hostFileURLUse) || CookieMgr.xdPsHelper.hostFileURLUse == "") {
        CookieMgr.xdPsHelper.errorCode = 2;
        result = false;
    }
    return result;
};
