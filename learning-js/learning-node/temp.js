var c2cDivClone;
var c2cDiv = document.getElementById('inqC2CMobDiv');
c2cDiv.style.position = 'fixed';
c2cDiv.style.bottom = '0px';
c2cDiv.style.width = '100%';
c2cDiv.style.zIndex = '1000';
c2cDiv.style.backgroundColor = '#FFF';
c2cDiv.style.opacity = '0.95';
c2cDiv.style.textAlign = 'center';
c2cDiv.style.borderTop = '1px solid #b3b3b3';
c2cDiv.style.boxShadow = '0px -6px 15px 0px rgba(141,141,141,0.4)';
c2cDiv.style.mozBoxShadow = '0px -6px 15px 0px rgba(141,141,141,0.4)';
c2cDiv.style.webkitBoxShadow = '0px -6px 15px 0px rgba(141,141,141,0.4)';

if (typeof(document.getElementById('inqC2CMobDiv').firstChild) != 'undefined' && document.getElementById('inqC2CMobDiv').firstChild != null) {
    var c2cImg = document.getElementById('inqC2CMobDiv').firstChild;
    c2cImg.onload = function() {
        c2cImg.style.height = '50px';
        c2cImg.style.maxWidth = '100%';
        c2cImg.style.width = 'initial';
        c2cImg.style.border = '0';
        c2cImg.style.padding = '0';
        c2cImg.style.borderRadius = '0px';
    };

    if ( /(iPhone).*OS 9/i.test( window.navigator.userAgent ) ) {
        var myct = 0;
        var intervalId = window.setInterval( function () {
            var active = window.parent.document.activeElement;
            myct += 1;
            if (active.nodeName !== 'BODY' || myct > 6) {
                c2cImg.focus();
                if (window.parent.document.activeElement === c2cImg || myct > 5) {
                    clearInterval(intervalId);
                }
                active.focus();
            }
        }, 500);
    }
}

if( /^(?!.*windows)(?=.*android)/i.test( window.navigator.userAgent ) ) {
    c2cDivClone = c2cDiv.cloneNode(true);
    c2cDivClone.id = 'inqC2CMobDivClone';
    c2cDivClone.style.position = 'absolute';
    c2cDiv.setAttribute('aria-hidden','true');
    document.body.appendChild(c2cDivClone)
}
