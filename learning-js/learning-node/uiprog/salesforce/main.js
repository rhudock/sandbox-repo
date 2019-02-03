/************************************************************************************************
 * This file contains JavaScript code authored by Interactive Intelligence, Inc.                 *
 *                                                                                               *
 * The contents of this file are warranted to function as intended, provided they are not        *
 * modified in any way by customers, users, or other parties.                                    *
 *                                                                                               *
 * During the course of this product's support life cycle, Interactive Intelligence, Inc. may    *
 * publish updates to this file at any time, by means of an SU or similar process.  If other     *
 * modifications are made to this file, these modifications may therefore be overwritten.        *
 *                                                                                               *
 * Customers are encouraged to extend the functionality provided in this file, by creating       *
 * additional file(s) which use this file as an API.                                             *
 ************************************************************************************************/

/* 4.0.3.4 RELEASE */
var ININ_Web_Chat_WebServices_Fileversion = "4.0.3.4 RELEASE";

requirejs.config(
    {
        map:
            {
                '*':
                    {
                        'jquery': 'jquery-noconflict'
                    },
                'jquery-noconflict':
                    {
                        'jquery':'jquery'
                    }
            },
        paths:
            {
                'jquery': 'external/jquery.min',
                'jquery-noconflict': 'external/jquery-noconflict',
                'prototype': 'external/prototype.1.6.1',
                'i18n': 'external/i18n',
                'bootstrap.min': 'external/bootstrap.min',
                'modernizr': 'external/modernizr.custom'
            },
        shim:
            {
                'prototype':
                    {
                        exports: 'Prototype'
                    },
                'config':
                    {
                        deps: ['common'],
                        exports: 'ININ.Web.Chat.Config'
                    },
                'i18n':
                    {
                        deps: ['LanguageOverride']
                    },
                'bootstrap.min':
                    {
                        deps: ['jquery']
                    },
                'modernizr':
                    {
                        exports: 'Modernizr'
                    }
            }
    });

// Customizations aren't used by this file, but do need to be loaded before the app starts running.
define(['ui', 'config', 'customizations', 'WebServices'], function(ui, config, customizations, webServices)
{
    var intervalID = null;
    function checkVisible() {
        if (window.innerWidth !== 0) {
            // Either visible from the start, or was initially invisible and then the interval fired
            if (null != intervalID) {
                // If it was that the interval fired, clear the interval
                window.clearInterval(intervalID);
                intervalID = null;
            }
            loadUI();
        } else if (null == intervalID) {
            // Initially invisible
            intervalID = window.setInterval(checkVisible, 500);
        }
    }

    var loadUI = function()
    {
        ui.Page.load(setInteractionWebToolsParams(config, ui, webServices));
    };

    // Try to hide address bar on mobile browsers
    // (Removed because this throws an exception in Internet Explorer)
    //window.addEventListener('load', function(e) { setTimeout(function() { window.scrollTo(0, 1); }, 1); }, false);

    checkVisible();
});

/**
 * Displays a message to the web user indicating that a certain module is taking too long to load.
 *
 * Since this may be called before localization has been loaded, this method contains hard-coded English string(s).
 *
 * @param err Contains information about the error that has occurred
 */
requirejs.onError = function (err)
{
    console.log("Load failure. requireType=" + err.requireType + ", requireModules=" + err.requireModules);

    // We only try to load one thing at a time, so any previous error is no longer relevant.  It should have
    // been removed already, but this is just to be safe.
    removeLoadError();

    var parent = document.getElementById('iwt-container');
    if (!parent)
    {
        parent = document.getElementsByTagName('body')[0];
    }
    var errorDiv = document.createElement('div'); // Can't use new Element, because if we're in onError() then maybe Prototype failed to load.
    errorDiv.setAttribute('class', 'iwt-load-error');
    errorDiv.id = 'iwt-load-error';
    var errorImg = document.createElement('img');
    errorImg.setAttribute('src', 'img/error.png');
    var errorMsg = document.createElement('span');
    //errorMsg.innerHTML = "The attempt to load " + err.requireModules + " is taking a long time.  Attempting to load it will continue, but may not ever succeed.";
    errorMsg.innerHTML = "If your live chat window does not open within 15 seconds, refresh your web browser.  Please contact us if you continue to experience technical difficulties.";
    errorDiv.appendChild(errorImg);
    errorDiv.appendChild(errorMsg);
    parent.appendChild(errorDiv);
};

/**
 * Removes the error message created by addLoadError()
 */
removeLoadError = function()
{
    var errorDiv = document.getElementById('iwt-load-error');
    if (null != errorDiv)
    {
        var parent = errorDiv.parentNode;
        if (null != parent)
        {
            parent.removeChild(errorDiv);
        }
    }
};

// Bootloader is no longer necessary, but its onLoadedConfig()
// method is still called from the config file.  Stub that out.
Bootloader = new Object();
Bootloader.onLoadedConfig = function() { };
