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

define(['i18n!nls/localization', 'jquery', 'WebServices', 'common', 'modernizr', 'bootstrap.min'], function (localization, $j, webservices, common, Modernizr, bootstrap) {
    var ui = common.Type.registerLocalNamespace("ui");


    // Register namespaces
    ui.registerChildNamespace("Interfaces");

    /**
     * IStatusManager interface
     * Provides methods: clearStatus(), setErrorStatus(), setStatus(), setBusy(), clearBusy().
     */
    ui.Interfaces.IStatusManager = new common.Interface('ui.Interfaces.IStatusManager', ['clearStatus', 'setErrorStatus', 'setStatus', 'setBusy', 'clearBusy']);
    // Register namespaces
    ui.registerChildNamespace("ConfigConversions");

    /**
     * ConfigConversions class
     * This class provides methods to convert the values found in config.js into the values
     * desired by ui.Page.load().
     */
    ui.ConfigConversions.ChatInteractionType = "Chat";
    ui.ConfigConversions.CallbackInteractionType = "Callback";

    // The following method is here for expansion purposes only, and is not supported at this time.
    /*
     * This method converts the value of "TextType" in config.js to a value that is acceptable for use as the
     * useHtmlEditor parameter to Page.load().
     *
     * Config.js contains either:
     * TextType: Plain
     * or:
     * TextType: Html
     *
     * This method simply returns true if "Html" was specified, and false otherwise.
     * It is case-insensitive.
     *
     * @param textType Either "Plain" or "Html"
     *
    ui.ConfigConversions.convertTextTypeToUseHtmlEditor = function(textType)
    {
        if (null == textType)
        {
            return false;
        }
        if("plain" == textType.toLowerCase())
        {
            return false;
        }
        if("html" == textType.toLowerCase())
        {
            return true;
        }

        return false;
    };
    */

    /**
     * This method converts the value of "InteractionTypes" in config.js to a value that is acceptable for use as the
     * pageMode parameter to Page.load().
     *
     * @param interactionTypes A specification of which interaction type(s) to allow in this session, in the format used by config.js, i.e. ["chat","callback"]
     * @return A bitmap representing the specified interaction types
     */
    ui.ConfigConversions.convertInteractionTypesToPageMode = function (interactionTypes) {
        if (!interactionTypes) {
            return ui.PageModes.CHAT_AND_CALLBACK;
        }

        if (common.Utilities.isType(interactionTypes, Array)) {
            return ui.ConfigConversions.convertInteractionTypeArrayToPageMode(interactionTypes);
        }

        return ui.ConfigConversions.convertInteractionTypeScalarToPageMode(interactionTypes);
    };

    /**
     * This method converts a scalar value of "InteractionTypes" in config.js to a value that is acceptable for use as the
     * pageMode parameter to Page.load().
     * @see convertInteractionTypesToPageMode
     *
     * @param interactionType A specification of which interaction type to allow in this session, in the format used by config.js, i.e. "callback"
     * @return A bitmap representing the specified interaction type
     */
    ui.ConfigConversions.convertInteractionTypeScalarToPageMode = function (interactionType) {
        if (interactionType == ui.ConfigConversions.ChatInteractionType) {
            return ui.PageModes.CHAT;
        }

        if (interactionType == ui.ConfigConversions.CallbackInteractionType) {
            return ui.PageModes.CALLBACK;
        }

        return ui.PageModes.CHAT_AND_CALLBACK;
    };

    /**
     * This method converts an array value of "InteractionTypes" in config.js to a value that is acceptable for use as the
     * pageMode parameter to Page.load().
     * @see convertInteractionTypesToPageMode
     *
     * @param interactionTypes A specification of which interaction types to allow in this session, in the format used by config.js, i.e. ["chat","callback"]
     * @return A bitmap representing the specified interaction types
     */
    ui.ConfigConversions.convertInteractionTypeArrayToPageMode = function (interactionTypes) {
        var isChatEnabled = webservices.Utilities.doesArrayHaveElement(interactionTypes, ui.ConfigConversions.ChatInteractionType);
        var isCallbackEnabled = webservices.Utilities.doesArrayHaveElement(interactionTypes, ui.ConfigConversions.CallbackInteractionType);
        if (isChatEnabled && isCallbackEnabled) {
            return ui.PageModes.CHAT_AND_CALLBACK;
        }
        if (isChatEnabled) {
            return ui.PageModes.CHAT;
        }
        if (isCallbackEnabled) {
            return ui.PageModes.CALLBACK;
        }

        return ui.PageModes.CHAT_AND_CALLBACK;
    };

    /**
     * Returns the URI fragment which the webserver has been configured to treat as a reverse proxy to
     * the primary IC server.
     * Since AJAX requests can only be made to the originating server, it is necessary to configure a
     * reverse proxy in order for the requests to get to the IC server(s).  If this Javascript was accessed from
     * http://this-server/somePage.html, then it cannot make AJAX requests to
     * http://IC-server-1:8114/..., even if there weren't a firewall in the way.  So, perhaps
     * this-server was configured in a way such that:
     * http://this-server/I3Root/Server1/websvcs/serverConfiguration reverse proxies to
     * http://IC-server-1:8114/websvcs/serverConfiguration.
     * In that case, "I3Root/Server1" is the "URI Fragment".
     *
     * @param icServerCount How many IC servers exist in this configuration
     * @return The URI fragment that will result in a reverse proxy to the primary IC server.
     */
    ui.ConfigConversions.convertICServerCountToCurrentUriFragment = function (icServerCount) {
        return "I3Root/Server1";
    };

    /**
     * Returns the set of URI fragments which map to all of the IC servers.  Currently only 1 or 2 IC servers
     * are supported.
     *
     * @param icServerCount How many IC servers exist in this configuration
     * @return The URI fragments that will result in reverse proxies to the IC servers.
     */
    ui.ConfigConversions.convertICServerCountToUriFragments = function (icServerCount) {
        if (icServerCount == 2) {
            return ["I3Root/Server1", "I3Root/Server2"];
        }

        return ["I3Root/Server1"];
    };
    // Register namespaces
    ui.registerChildNamespace("FormFieldTypes");

    /**
     * ui.FormFieldTypes enum
     * Represents the various types of form fields that may be present in a Form.
     */
    ui.FormFieldTypes.MIN = 1;

    ui.FormFieldTypes.Username = 1;
    ui.FormFieldTypes.Password = 2;
    ui.FormFieldTypes.ConfirmPassword = 3;
    ui.FormFieldTypes.FirstName = 4;
    ui.FormFieldTypes.MiddleName = 5;
    ui.FormFieldTypes.LastName = 6;
    ui.FormFieldTypes.HomeStreetAddress = 7;
    ui.FormFieldTypes.HomeCity = 8;
    ui.FormFieldTypes.HomeState = 9;
    ui.FormFieldTypes.HomePostalCode = 10;
    ui.FormFieldTypes.HomeCountry = 11;
    ui.FormFieldTypes.HomeEmail = 12;
    ui.FormFieldTypes.HomePhone = 13;
    ui.FormFieldTypes.HomePhone2 = 14;
    ui.FormFieldTypes.HomeFax = 15;
    ui.FormFieldTypes.HomePager = 16;
    ui.FormFieldTypes.HomeMobile = 17;
    ui.FormFieldTypes.HomeUrl = 18;
    ui.FormFieldTypes.Department = 19;
    ui.FormFieldTypes.Company = 20;
    ui.FormFieldTypes.JobTitle = 21;
    ui.FormFieldTypes.AssistantName = 22;
    ui.FormFieldTypes.AssistantPhone = 23;
    ui.FormFieldTypes.BusinessStreetAddress = 24;
    ui.FormFieldTypes.BusinessCity = 25;
    ui.FormFieldTypes.BusinessState = 26;
    ui.FormFieldTypes.BusinessPostalCode = 27;
    ui.FormFieldTypes.BusinessCountry = 28;
    ui.FormFieldTypes.BusinessEmail = 29;
    ui.FormFieldTypes.BusinessPhone = 30;
    ui.FormFieldTypes.BusinessPhone2 = 31;
    ui.FormFieldTypes.BusinessFax = 32;
    ui.FormFieldTypes.BusinessPager = 33;
    ui.FormFieldTypes.BusinessMobile = 34;
    ui.FormFieldTypes.BusinessUrl = 35;
    ui.FormFieldTypes.Remarks = 36;
    ui.FormFieldTypes.Name = 37;
    ui.FormFieldTypes.Subject = 38;
    ui.FormFieldTypes.Telephone = 39;
    ui.FormFieldTypes.TranscriptEmail = 40;

    ui.FormFieldTypes.MAX = 40;
    // Register namespaces
    ui.registerChildNamespace("Interfaces");

    /**
     * IFormField interface
     * Represents a field within an ui.IFormSection within an ui.Form.
     * The various types of fields are enumerated in ui.FormFieldTypes.
     * A field simply represents its FormFieldType.
     */
    ui.Interfaces.IFormField = new common.Interface('ui.Interfaces.IFormField', ['get_type']);

    /**
     * FormField class
     * Implementation of IFormField interface.
     */
    ui.FormField = Class.create(common.InterfaceImplementation,
        {
            /**
             * constructor
             * @param type - The FormFieldType of this FormField.
             */
            initialize: function ($super, type) {
                this._validateType(type);

                $super();

                this.addImplementedInterface(ui.Interfaces.IFormField, ui);

                this._type = type;
            },

            // methods

            /**
             * Throws an exception if the supplied param is not one of the values enumerated in ui.FormFieldTypes.
             * (Private method)
             *
             * @param type - A value which the caller wishes to determine is or is not a valid form field type.
             */
            _validateType: function (type) {
                common.ParameterValidation.validate([type], [{ "type": Number, "required": true }]);

                if ((type < ui.FormFieldTypes.MIN) ||
                    (type > ui.FormFieldTypes.MAX)) {
                    throw common.ExceptionFactory.createException("Not a valid type: " + type);
                }
            },

            /**
             * Returns the type of this FormField.
             */
            get_type: function () {
                return this._type;
            }
        });
    // Register namespaces
    ui.registerChildNamespace("Interfaces");

    /**
     * IFormSection interface
     * A Form is composed of zero or more IFormSections.
     * An IFormSection is composed of a name, and zero or more IFormFields.
     */
    ui.Interfaces.IFormSection = new common.Interface('ui.Interfaces.IFormSection', ['get_name', 'get_fields', 'addFieldByFieldType', 'addField']);

    /**
     * FormSection class
     * Implementation of IFormSection interface.
     */
    ui.FormSection = Class.create(common.InterfaceImplementation,
        {
            /**
             * constructor
             * @param name - Optional. The name of this section of the form.
             * @param fields - Optional. The fields within this section of the form.
             */
            initialize: function ($super, name, fields) {
                common.ParameterValidation.validate([name, fields], [{ "type": String, "required": false, "allowEmpty": true }, { "type": Array, "required": false }]);

                this._validateArrayElements(fields);

                $super();

                this.addImplementedInterface(ui.Interfaces.IFormSection, ui);

                this._name = name;
                this._fields = [];

                if (fields && fields.length > 0) {
                    this._fields = fields;
                }
            },

            // methods

            /**
             * Ensures that each object in the supplied array is a valid IFormField.
             * (Private method)
             */
            _validateArrayElements: function (fields) {
                if (fields) {
                    for (var i = 0; i < fields.length; ++i) {
                        common.Interface.ensureImplements(fields[i], ui.Interfaces.IFormField);
                    }
                }
            },

            /**
             * Returns the name of this FormSection
             */
            get_name: function () {
                return this._name;
            },

            /**
             * Returns an array containing the IFormFields in this FormSection
             */
            get_fields: function () {
                return this._fields;
            },

            /**
             * Adds a new FormField of the specified type to this FormSection
             *
             * @param fieldType - The type of FormField to add.  Must be a member of ui.FormFieldTypes.
             * @returns The modified FormSection, to allow for chaining, such as:
             *          myFormSection.addFieldByFieldType(aFieldType).addFieldByFieldType(anotherFieldType)
             */
            addFieldByFieldType: function (fieldType) {
                return this.addField(new ui.FormField(fieldType));
            },

            /**
             * Adds a new IFormField to this FormSection.
             *
             * @param field - An instance of any class which implements the IFormField interface.
             * @returns The modified FormSection, to allow for chaining, such as:
             *          myFormSection.addField(aField).addField(anotherField)
             */
            addField: function (field) {
                common.Interface.ensureImplements(field, ui.Interfaces.IFormField);

                this._fields.push(field);
                return this;
            }
        });
    /**
     * Form class
     * A Form simply represents a collection of IFormSections.
     */
    ui.Form = Class.create(
        {
            /**
             * constructor
             * @param sections - Optional.  An array of instances of IFormSection.
             */
            initialize: function (sections) {
                common.ParameterValidation.validate([sections], [{ "type": Array, "required": false }]);

                this._sections = [];

                if (sections && sections.length > 0) {
                    this._sections = sections;
                }
            },

            // methods

            /**
             * Returns the IFormSections in this form.
             */
            get_sections: function () {
                return this._sections;
            },

            /**
             * Adds an IFormSections to this Form.
             *
             * @param section The IFormSection to add to this Form.
             */
            addSection: function (section) {
                common.Interface.ensureImplements(section, ui.Interfaces.IFormSection);

                this._sections.push(section);
                return this;
            }
        });
    // Register namespaces
    ui.registerChildNamespace("_Internal");

    /**
     * _ErrorDisplayTextBuilder class
     * This is a singleton, which may be referenced as ui.ErrorDisplayTextBuilder.
     * This class handles converting error codes into human-readable messages.
     */
    ui._Internal._ErrorDisplayTextBuilder = Class.create(
        {
            /**
             * Builds an error message from an error code (from webservices.ErrorCodes) and/or a string.
             * If only the string is present, it will be returned.
             * If only the error code is present, a human-readable translation of it will be returned.
             * If both are present, the return value will be the string, followed by " - ", followed by the human-readable translation
             * of the error code.
             * If neither is present, '' will be returned.
             *
             * @param error An webservices.ErrorCode
             * @param mainErrorText A string
             */
            build: function (error, mainErrorText) {
                var builtText = '';
                if (mainErrorText) {
                    builtText = mainErrorText;
                }

                if (error) {
                    if (builtText.length > 0) {
                        builtText += ' - ';
                    }

                    builtText += this.buildError(error);
                }

                return builtText;
            },

            /**
             * Takes an error code (from webservices.ErrorCodes) and returns its meaning in a human-readable format.
             *
             * @param error An webservices.ErrorCode
             */
            buildError: function (error) {
                common.Interface.ensureImplements(error, webservices.Interfaces.IError);

                switch (error.get_errorSource()) {
                    case webservices.ErrorCodes.WEBSVC:
                        return this.buildWebSvcError(error);
                    case webservices.ErrorCodes.HTTP:
                        return this.buildHttpError(error);
                    default:
                        return this.buildGeneralError(error);
                }
            },

            /**
             * Takes an error code whose source is webservices.ErrorCodes.WEBSVC and returns its meaning in
             * a human-readable format.  Unless you are sure that it's a WEBSVC error code, it would be safer to call build().
             *
             * @param error An webservices.ErrorCode
             */
            buildWebSvcError: function (error) {
                common.Interface.ensureImplements(error, webservices.Interfaces.IError);

                switch (error.get_errorType()) {
                    case webservices.ErrorCodes.GENERAL:
                        return this.buildGeneralError(error);
                    case webservices.ErrorCodes.CONTENTTYPE:
                        return this.buildContentTypeError(error);
                    case webservices.ErrorCodes.CONTENT:
                        return this.buildContentError(error);
                    case webservices.ErrorCodes.UNKNOWNENTITY:
                        return this.buildUnknownEntityError(error);
                    case webservices.ErrorCodes.USERDB:
                        return this.buildUserDbError(error);
                    default:
                        return this.buildGeneralError(error);
                }
            },

            /**
             * Takes an error code whose source is not webservices.HTTP, and whose source is not
             * webservices.WEBSVC unless its error type is webservices.ErrorCodes.GENERAL.
             * Returns its meaning in a human-readable format.
             * Unless you are sure of the error code (and error type, if error code is WEBSVC), it would be safer to call build().
             *
             * @param error An webservices.ErrorCode
             */
            buildGeneralError: function (error) {
                common.Interface.ensureImplements(error, webservices.Interfaces.IError);

                return localization.GeneralError;
            },

            /**
             * Takes an error code whose source is webservices.ErrorCodes.WEBSVC and whose error type is
             * webservices.ErrorCodes.CONTENTTYPE.
             * Returns its meaning in a human-readable format.
             * Unless you are sure that it's a WEBSVC error code, or if its error type, it would be safer to call build().
             *
             * @param error An webservices.ErrorCode
             */
            buildContentTypeError: function (error) {
                common.Interface.ensureImplements(error, webservices.Interfaces.IError);

                switch (error.get_subErrorType()) {
                    case webservices.ErrorCodes.INVALIDCHARSET:
                        return localization.InvalidCharSetError;
                    case webservices.ErrorCodes.INVALIDCONTENTTYPE:
                        return localization.InvalidContentTypeError;
                    default:
                        return localization.InvalidContentTypeError;
                }
            },

            /**
             * Takes an error code whose source is webservices.ErrorCodes.WEBSVC and whose error type is
             * webservices.ErrorCodes.CONTENT.
             * Returns its meaning in a human-readable format.
             * Unless you are sure that it's a WEBSVC error code, or if its error type, it would be safer to call build().
             *
             * @param error An webservices.ErrorCode
             */
            buildContentError: function (error) {
                common.Interface.ensureImplements(error, webservices.Interfaces.IError);

                switch (error.get_subErrorType()) {
                    case webservices.ErrorCodes.INVALID:
                        return this.buildContentInvalidError(error);
                    default:
                        return localization.ContentError;
                }
            },

            /**
             * Takes an error code whose source is webservices.ErrorCodes.WEBSVC and whose error type is
             * webservices.ErrorCodes.CONTENT and whose sub error type is INVALID.
             * Returns its meaning in a human-readable format.
             * Unless you are sure that it's a WEBSVC error code, with error type of CONTENT and sub error type of INVALID,
             * it would be safer to call build().
             *
             * @param error An webservices.ErrorCode
             */
            buildContentInvalidError: function (error) {
                common.Interface.ensureImplements(error, webservices.Interfaces.IError);

                switch (error.get_token(4)) {
                    case webservices.ErrorCodes.MISSINGDATA:
                        return localization.MissingDataError;
                    default:
                        return localization.ContentError;
                }
            },

            /**
             * Takes an error code whose source is webservices.ErrorCodes.WEBSVC and whose error type is
             * webservices.ErrorCodes.UNKNOWNENTITY.
             * Returns its meaning in a human-readable format.
             * Unless you are sure that it's a WEBSVC error code, or if its error type, it would be safer to call build().
             *
             * @param error An webservices.ErrorCode
             */
            buildUnknownEntityError: function (error) {
                common.Interface.ensureImplements(error, webservices.Interfaces.IError);

                switch (error.get_subErrorType()) {
                    case webservices.ErrorCodes.SESSION:
                        return localization.UnknownSessionError;
                    case webservices.ErrorCodes.PARTICIPANT:
                        return localization.UnknownParticipantError;
                    case webservices.ErrorCodes.BADTARGET:
                        return localization.BadTargetError;
                    default:
                        return localization.UnknownEntityError;
                }
            },

            /**
             * Takes an error code whose source is webservices.ErrorCodes.WEBSVC and whose error type is
             * webservices.ErrorCodes.USERDB.
             * Returns its meaning in a human-readable format.
             * Unless you are sure that it's a WEBSVC error code, or if its error type, it would be safer to call build().
             *
             * @param error An webservices.ErrorCode
             */
            buildUserDbError: function (error) {
                common.Interface.ensureImplements(error, webservices.Interfaces.IError);

                switch (error.get_subErrorType()) {
                    case webservices.ErrorCodes.NOTONLINE:
                        return localization.UserNotOnline;
                    case webservices.ErrorCodes.BADCREDENTIALS:
                        return localization.BadCredentialsError;
                    case webservices.ErrorCodes.ACCOUNTEXISTS:
                        return localization.AccountExistsError;
                    default:
                        return localization.UserDbError;
                }
            },

            /**
             * Takes an error code whose source is webservices.ErrorCodes.HTTP and returns its meaning in
             * a human-readable format.  Unless you are sure that it's an HTTP error code, it would be safer to call build().
             *
             * @param error An webservices.ErrorCode
             */
            buildHttpError: function (error) {
                common.Interface.ensureImplements(error, webservices.Interfaces.IError);

                return localization.ErrorConnectingToServer;
            }
        });

    /**
     * Singleton instance of the _ErrorDisplayTextBuilder class.
     */
    ui.ErrorDisplayTextBuilder = new ui._Internal._ErrorDisplayTextBuilder();
    /**
     * Control class
     * Parent class for various GUI classes in this web application.  Each instance of this class wraps a DOM object.
     * Also provides convenience methods for working with DOM objects.
     */
    ui.Control = Class.create(common.InterfaceImplementation,
        {
            /**
             * Constructor
             *
             * @param domObject the DOM object which the browser will use to display this Control.  In the default
             * implementation, this is treated as an abstract class, and its subclasses each have a method called
             * _buildDomObject().  These subclasses then simply include the following in their constructors:
             * $super(_buildDomObject());
             * In turn, _buildDomObject() makes use of createElement(), createChildElement(), and/or createHiddenChildElement().
             */
            initialize: function ($super, domObject) {
                var numArgs = 2;
                if (arguments.length != numArgs) {
                    throw common.ExceptionFactory.createException("Control constructor called with " + arguments.length + " arguments, but expected " + numArgs + ".");
                }

                if (!domObject) {
                    throw common.ExceptionFactory.createException("Control constructor called with a null/undefined dom object paramter.");
                }

                $super();

                this._domObject = domObject;
            },

            /**
             * destructor
             */
            destroy: function () {
                if (this._domObject) {
                    if (this._domObject.destroy) {
                        this._domObject.destroy();
                    }

                    delete this._domObject;
                    this._domObject = null;
                }

                common.InterfaceImplementation.prototype.destroy.call(this);
            },

            // public methods

            /**
             * Returns the DOM object which the browser will use to display this Control.
             */
            get_domObject: function () {
                return this._domObject;
            },

            /**
             * Enables (by passing true) or disables (by passing false) this Control.
             *
             * @param enabled If true, this Control will be enabled.  If false, this Control will be disabled.
             */
            enable: function (enabled) {
                this._domObject.disabled = !enabled;
            },

            /**
             * Returns a boolean indicating whether this Control is visible or not.
             *
             * @return Boolean
             */
            isVisible: function () {
                return this._domObject.visible();
            },

            /**
             * Causes this Control to become visible in the browser.
             */
            show: function () {
                Element.show(this._domObject);
            },

            /**
             * Causes this control to become hidden in the browser.
             */
            hide: function () {
                Element.hide(this._domObject);
            },

            /**
             * Creates a DOM element.
             *
             * @param tag Which type of HTML tag the new element should have:  a, br, table, etc.
             * @param id The ID of the new element (optional)
             * @param attributes The attributes of the new element
             * @param styles The CSS to apply to the new element (optional)
             * @param innerHTML The inner HTML of the element (optional, and for compatible tags only)
             * Example:
             * var a = createElement('a', 'myanchor', { 'class': 'foo', href: '/foo.html' },
             *                       { backgroundColor: '#900', fontSize: '12px' }, 'my link to foo');
             */
            createElement: function (tag, id, attributes, styles, innerHTML) {
                var element = new Element(tag, attributes);

                if (id) {
                    element.id = id;
                }

                if (styles) {
                    Element.setStyle(element, styles);
                }

                if (innerHTML) {
                    element.innerHTML = innerHTML;
                }

                if (attributes) {
                    this._addExtraCssClassesFor(element, id, attributes['class']);
                } else {
                    this._addExtraCssClassesFor(element, id, null);
                }

                return element;
            },

            /**
             * Creates a DOM element, as a child of the supplied DOM element
             *
             * @param parent An existing DOM element which will become the parent of the new DOM element
             * @param tag Which type of HTML tag the new element should have:  a, br, table, etc.
             * @param id The ID of the new element (optional)
             * @param attributes The attributes of the new element
             * @param styles The CSS to apply to the new element (optional)
             * @param innerHTML The inner HTML of the element (optional, and for compatible tags only)
             * Example:
             * var a = createChildElement(parentOfA, 'a', 'myanchor', { 'class': 'foo', href: '/foo.html' },
             *                            { backgroundColor: '#900', fontSize: '12px' }, 'my link to foo');
             */
            createChildElement: function (parent, tag, id, attributes, styles, innerHTML) {
                if (!parent) {
                    throw common.ExceptionFactory.createException("createChildElement: parent parameter is not defined");
                }

                var element = this.createElement(tag, id, attributes, styles, innerHTML);
                parent.appendChild(element);
                return element;
            },

            /**
             * Creates a DOM element, as a child of the supplied DOM element.  The new DOM element will initially be hidden.
             *
             * @param parent An existing DOM element which will become the parent of the new DOM element
             * @param tag Which type of HTML tag the new element should have:  a, br, table, etc.
             * @param id The ID of the new element (optional)
             * @param attributes The attributes of the new element
             * @param styles The CSS to apply to the new element (optional)
             * @param innerHTML The inner HTML of the element (optional, and for compatible tags only)
             */
            createHiddenChildElement: function (parent, tag, id, attributes, styles, innerHTML) {
                var element = this.createElement(tag, id, attributes, styles, innerHTML);
                $j(element).hide();
                parent.appendChild(element);
                return element;
            },

            getExtraCssClassesFactory: function () {
                if (!this._extraCssClassesFactory) {
                    this._extraCssClassesFactory = webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.ExtraCssClasses);
                }
                return this._extraCssClassesFactory;
            },

            // private/protected methods

            _addExtraCssClassesFor: function (element, id, currentCssClasses) {
                var factory = this.getExtraCssClassesFactory();
                if (id) {
                    var extraCssClasses = factory.getExtraCssClassesFor('#' + id);
                    if (extraCssClasses) {
                        for (var i = 0; i < extraCssClasses.length; ++i) {
                            element.addClassName(extraCssClasses[i]);
                        }
                    }
                }
                if (currentCssClasses) {
                    var currentCssClassesArray = currentCssClasses.split(' ');
                    for (var j = 0; j < currentCssClassesArray.length; ++j) {
                        var extraCssClasses = factory.getExtraCssClassesFor('.' + currentCssClassesArray[j]);
                        if (extraCssClasses) {
                            for (var k = 0; k < extraCssClasses.length; ++k) {
                                element.addClassName(extraCssClasses[k]);
                            }
                        }
                    }
                }
            }
        });
    /**
     * FormPanelBase class
     * Base class for UI representation of forms.
     */
    ui.FormPanelBase = Class.create(ui.Control,
        {
            /**
             * constructor
             *
             * @param registerFormContainer - The Panel that contains the registration form.  Must have
             *                                a showRegisterForm() method.
             * @param submitButtonText - The text that should be displayed on the form's submit button
             * @param formPanelClass - The CSS selector of the form.  The leading dot should not be included. This should only be a single class - if the form must have multiple classes, use addClassName()
             * @param requiredFields - An array of FormFieldTypes, indicating which fields are required on this form. Optional.
             */
            initialize: function ($super, registerFormContainer, submitButtonText, formPanelClass, requiredFields) {
                if ((arguments.length != 4) && (arguments.length != 5)) {
                    throw common.ExceptionFactory.createException("FormPanelBase constructor called with " + arguments.length + " arguments, but expected 4 or 5.");
                }

                if (requiredFields) {
                    this._requiredFields = requiredFields;
                }
                else {
                    this._requiredFields = [];
                }

                this._submitButtonText = submitButtonText;
                this._formPanelClass = formPanelClass;
                this._registerFormContainer = registerFormContainer;

                var domObject = this._buildDomObject();
                this._validateDomObject();

                $super(domObject);

                this.addImplementedInterface(ui.Interfaces.IStatusManager, ui);
            },

            /**
             * destructor
             */
            destroy: function () {
                ui.Control.prototype.destroy.call(this);
            },

            // methods

            /**
             * Resets the form to its original state.
             */
            reset: function () {
                this.clearBusy();
                this.enableSubmitButton(true);
                this.clearStatus();
            },

            /**
             * Abstract method, should be overridden by subclass.
             * Gets a list of fields which the user is required to fill in.
             *
             * @return An array of ui.FormFieldTypes indicating the required fields of this form.
             */
            getRequiredFields: function () {
                return this._requiredFields;
            },

            /**
             * Adds a FormFieldType to the list of required fields.  This can be used to
             * implement rules such as "if this checkbox is checked, that textfield must not be blank".
             * If the DOM implementation is also supplied, the HTML5 "required" attribute will be added to it.
             *
             * @param requiredField A FormFieldType that is now required
             * @param impl Optional. A DOM element, most likely an input[type=text], which represents that FormFieldType
             */
            addRequiredField: function (requiredField, impl) {
                if (this._requiredFields.indexOf(requiredField) == -1) {
                    this._requiredFields.push(requiredField);
                }
                if (impl) {
                    impl.required = true;
                }
            },

            /**
             * Removes a FormFieldType from the list of required fields.  This can be used to
             * implement rules such as "if this checkbox is checked, that textfield must not be blank".
             * If the DOM implementation is also supplied, the HTML5 "required" attribute will be removed from it.
             *
             * @param nonRequiredField A FormFieldType that is no longer required
             * @param impl Optional. A DOM element, most likely an input[type=text], which represents that FormFieldType
             */
            removeRequiredField: function (nonRequiredField, impl) {
                this._requiredFields = this._requiredFields.without(nonRequiredField);
                if (impl) {
                    impl.required = false;
                }
            },

            /**
             * Enables or disables the submit button
             *
             * @param enabled If true, the submit button will be enabled.  If false, the submit button will be disabled.
             */
            enableSubmitButton: function (enabled) {
                this._submitButton.disabled = !enabled;
            },

            /**
             * Shows the busy indicator
             */
            setBusy: function () {
                Element.show(this._busyImage);
            },

            /**
             * Hides the busy indicator
             */
            clearBusy: function () {
                Element.hide(this._busyImage);
            },

            /**
             * Removes any status messages (e.g. "There were 2 errors with the chat information"), if present.
             * Note that status messages apply to an entire form.  Messages which apply to only a particular form field
             * are known as form field errors.
             */
            clearStatus: function (status) {
                this.setStatus("");
                Element.removeClassName(this._statusDiv, 'iwt-status-success');
                Element.removeClassName(this._statusDiv, 'iwt-status-error');
            },

            /**
             * Sets a status message, and displays it using the iwt-status-error CSS class
             *
             * @param status The text to display in the status area
             */
            setErrorStatus: function (status) {
                Element.removeClassName(this._statusDiv, 'iwt-status-success');

                this.setStatus(status);
                Element.addClassName(this._statusDiv, 'iwt-status-error');
            },

            /**
             * Sets a status message.  Optionally shows an icon indicating success.
             *
             * @param status The text to display in the status area
             * @param showCheckImage If true, an icon indicating success will be displayed.
             */
            setStatus: function (status, showCheckImage) {
                Element.removeClassName(this._statusDiv, 'iwt-status-error');

                if (showCheckImage) {
                    Element.addClassName(this._statusDiv, 'iwt-status-success');
                }
                else {
                    Element.removeClassName(this._statusDiv, 'iwt-status-success');
                }

                if (!status) {
                    $j(this._statusSpan).text("");
                    Element.hide(this._statusDiv);
                }
                else {
                    $j(this._statusSpan).text(status);
                    Element.show(this._statusDiv);
                }
            },

            /**
             * Returns the text that is currently in the supplied textbox, if any.  Returns null otherwise.
             */
            _getValueIfAvailable: function (textbox) {
                if (textbox) {
                    return textbox.value;
                }

                return null;
            },

            /**
             * Erases the text in a textbox
             */
            _clearTextboxIfAvailable: function (textbox) {
                if (textbox) {
                    textbox.value = '';
                    this._hideFieldError(textbox);
                }

                return null;
            },

            /**
             * Enable a DOM element. Null-safe.
             */
            _enableElement: function (element) {
                if (element) {
                    element.disabled = false;
                }
            },

            /**
             * Disable a DOM element. Null-safe.
             */
            _disableElement: function (element) {
                if (element) {
                    element.disabled = true;
                }
            },

            /**
             * Ensures that this is a valid form panel.  Subclasses may override - this implementation simply
             * checks if the form has a submit button.
             */
            _validateDomObject: function () {
                if (!this._submitButton) {
                    throw common.ExceptionFactory.createException("Submit button not found");
                }
            },

            /**
             * Builds the DOM representation of the form, so the browser can display it.
             * @see _buildInnerPanel() in subclasses
             */
            _buildDomObject: function () {
                var div = this.createElement('div', this._formPanelClass, { 'class': 'iwt-form-panel ' + this._formPanelClass });
                var form = this.createChildElement(div, 'form', null, { 'action': '#', 'class': 'iwt-form', 'role': 'form' });
                form.onsubmit = function () { return false; }
                form.appendChild(this._buildInnerPanel(this._formPanelClass));
                div.appendChild(this._buildStatusDiv());
                return div;
            },

            /**
             * Builds the DOM representation of the div that contains status messages.
             */
            _buildStatusDiv: function () {
                this._statusDiv = this.createElement('div', null, { 'class': 'iwt-status' });
                // A table is used so that if the window is small enough that the span's text wraps to a second line, it won't flow around the image.
                var table = this.createChildElement(this._statusDiv, 'table');
                var row = this.createChildElement(table, 'tr');
                var leftTd = this.createChildElement(row, 'td', null, { 'class': 'iwt-status-panel-left' });
                var rightTd = this.createChildElement(row, 'td', null, { 'class': 'iwt-status-panel-right' });
                this.createChildElement(leftTd, 'img', null, { 'src': 'img/error.png', 'status-type': 'error' });
                this.createChildElement(leftTd, 'img', null, { 'src': 'img/check.png', 'status-type': 'success' });
                this._statusSpan = this.createChildElement(rightTd, 'span');
                return this._statusDiv;
            },

            /**
             * Builds the DOM representation of the div that contains this form's submit button.
             */
            _buildButtonPanel: function () {
                var div = this.createElement('div', null, { 'class': 'iwt-form-field-div' });
                var childDiv = this.createChildElement(div, 'div', null, { 'class': 'iwt-form-button-div' });
                this._submitButton = this.createChildElement(childDiv, 'input', null, { 'type': 'submit', 'value': this._submitButtonText, 'class': 'iwt-form-submit-button', 'name': 'iwt-form-submit-button' });
                Element.observe(this._submitButton, 'click', this._onClickSubmitButton.bindAsEventListener(this));
                this._busyImage = this.createChildElement(childDiv, 'img', null, { 'class': 'iwt-busy-image', 'src': 'img/spinner.gif' }, { 'display': 'none' });
                return div;
            },

            /**
             * Handler for the submit button being clicked.
             */
            _onClickSubmitButton: function (evt) {
                this.enableSubmitButton(false);
                this.clearStatus();

                var valid;
                if (this._canUseHtml5FormValidation()) {
                    try {
                        valid = this._doHtml5FormValidation();
                    } catch (e) {
                        common.Debug.traceWarning('Caught exception doing HTML5 form validation: ' + e);
                        webservices.ProblemReporter.sendProblemReport(ex, "FormPanelBase._onClickSubmitButton()");
                        valid = this._doNonHtml5FormValidation();
                    }
                } else {
                    valid = this._doNonHtml5FormValidation();
                    if (evt) {
                        evt.preventDefault();
                    }
                }

                if (!valid) {
                    this.enableSubmitButton(true);
                    return;
                }
                this._onValidatedSubmit();
            },

            /**
             * Returns true if the browser will prevent the user from submitting a
             * form when an input with the "required" attribute has been left blank.
             */
            _canUseHtml5FormValidation: function () {
                return (Modernizr.input.required && Modernizr.formvalidation && Modernizr.formvalidationmessage && Modernizr.formvalidationapi);
            },

            /**
             * Abstract method.
             * Called after the submit button has been clicked and the form inputs have been validated.
             */
            _onValidatedSubmit: function () {
                // override this in derived class
            },

            /**
             * Abstract method.
             * Validates the form values, for HTML5-compliant browsers
             */
            _doHtml5FormValidation: function () {
                // override this in derived class
            },

            // Methods below here are only used if HTML5 form validation is not supported

            /**
             * Abstract method.
             * Validates the form values, for non-HTML5-compliant browsers
             */
            _doNonHtml5FormValidation: function () {
                // override this in derived class
            },

            /**
             * Returns 1 and displays an error if the field is required but blank.
             * Returns 0 otherwise.
             */
            _validateField: function (textbox, fieldType) {
                if (textbox) {
                    if (webservices.Utilities.doesArrayHaveElement(this._requiredFields, fieldType)) {
                        var value = this._getValueIfAvailable(textbox);
                        if (!value) {
                            this._showFieldError(textbox, localization.FieldIsRequired);
                            return 1;
                        }
                    }

                    this._hideFieldError(textbox);
                }

                return 0;
            },

            /**
             * Puts a message into the div in which error messages go, and ensures that the div is visible.
             *
             * @param input - The form input to which the error pertains (so that an indicator may be shown next to it)
             * @param errorText - the error message to display
             */
            _showFieldError: function (input, errorText) {
                this._setFieldError(input, errorText);
                var errorDiv = this._getErrorDivFromFormInput(input);
                if (errorDiv) {
                    Element.show(errorDiv);
                }
            },

            /**
             * Hides the div in which error messages go.
             */
            _hideFieldError: function (input) {
                var errorDiv = this._getErrorDivFromFormInput(input);
                if (errorDiv) {
                    Element.hide(errorDiv);
                }
            },

            /**
             * Adds a div to the form into which error messages can be placed.
             * This is only used as a fallback if HTML5 form validation is not supported.
             *
             * @param formFieldDiv A div with class iwt-form-field-div which is the grandparent of an input element.
             */
            _addErrorDiv: function (formFieldDiv) {
                var divError = this.createChildElement(formFieldDiv, 'div', null, { 'class': 'iwt-form-field-error' }, { 'display': 'none' });
                this.createChildElement(divError, 'img', null, { 'src': 'img/error.png' });
                this.createChildElement(divError, 'span');
            },

            /**
             * Given a form input, returns the corresponding error div, or null if not found.
             */
            _getErrorDivFromFormInput: function (input) {
                var grandparentDiv = Element.up(input, 'div', 1);
                var divs = Element.select(grandparentDiv, 'div.iwt-form-field-error');
                if (divs && divs.length > 0) {
                    return divs[0];
                }

                return null;
            },

            /**
             * Sets the value of the form input's error field to the supplied text, but does not change the visibility of that error field.
             * @param input - the form input to which the error pertains
             * @param errorText - the error message
             */
            _setFieldError: function (input, errorText) {
                var errorDiv = this._getErrorDivFromFormInput(input);
                if (errorDiv) {
                    var spans = Element.select(errorDiv, 'span');
                    if (spans && spans.length > 0) {
                        var span = spans[0];
                        if (span) {
                            $j(span).text(errorText);
                        }
                    }
                }
            }
        });
    /**
     * LoginFormPanelBase class
     *
     * UI representation of a login form.  May be subclassed for specific purposes.
     */
    ui.LoginFormPanelBase = Class.create(ui.FormPanelBase,
        {
            AUTHENTICATION_NONE: 0, // Should not actually be used, but is useful for variable initialization before ORing the other values.
            AUTHENTICATION_ANONYMOUS: 1,
            AUTHENTICATION_TRACKER: 2,
            //AUTHENTICATION_STS : 4,
            //...

            /**
             * constructor
             *
             * @param registerFormContainer - The Panel that contains the registration form.  Must have
             *                                a showRegisterForm() method.
             * @param submitButtonText - The text that should be displayed on the form's submit button
             * @param formPanelClass - The CSS selector of the form.  The leading dot should not be included.
             * @param allowedAccessTypes - A logical OR of one or more of the AUTHENTICATION_* constants above.
             * @param requiredFields - An array of FormFieldTypes, indicating which fields are required on this form. Optional.
             * @param strings - An object may be used to override some or all of the strings used in this control. Optional.
             */
            initialize: function ($super, registerFormContainer, submitButtonText, formPanelClass, allowedAccessTypes, requiredFields, strings) {
                var minArgs = 5;
                var maxArgs = 7;
                if ((arguments.length < minArgs) || (arguments.length > maxArgs)) {
                    throw common.ExceptionFactory.createException("LoginFormPanel constructor called with " + arguments.length + " arguments, but expected between " + minArgs + " and " + maxArgs);
                }

                this._initializeStrings(strings);
                this._allowedAccessTypes = allowedAccessTypes;

                $super(registerFormContainer, submitButtonText, formPanelClass, requiredFields);
            },

            /**
             * destructor
             */
            destroy: function () {
                ui.FormPanelBase.prototype.destroy.call(this);
            },

            // methods

            /**
             * Determines which form field should get focus when the overall form does.
             */
            focus: function () {
                try {
                    if (this._authenticatedRadio && this._anonymousRadio) {
                        if (this._isAuthenticatedRadioClicked()) {
                            this._authenticatedIdentifierTextBox.focus();
                        }
                        else {
                            this._anonymousIdentifierTextBox.focus();
                        }
                    }
                    else if (this._authenticatedIdentifierTextBox) {
                        this._authenticatedIdentifierTextBox.focus();
                    }
                    else if (this._anonymousIdentifierTextBox) {
                        this._anonymousIdentifierTextBox.focus();
                    }
                } catch (e) {
                    common.Debug.traceWarning('Could not focus the correct textbox.');
                }
            },

            /**
             * Clears the fields of the form
             */
            reset: function () {
                ui.FormPanelBase.prototype.reset.call(this);
                if (this._authenticatedRadio) {
                    this._onClickAuthenticatedRadio();
                } else {
                    this._onClickAnonymousRadio();
                }
                this._clearTextboxIfAvailable(this._anonymousIdentifierTextBox);
                this._clearTextboxIfAvailable(this._authenticatedIdentifierTextBox);
                this._clearTextboxIfAvailable(this._authenticatedCredentialsTextBox);
            },

            /**
             * Overrides the UI control to which the submit button should dynamically align.
             * In LTR languages, the right edge of the button will align with the right edge of this control.
             * If this method is never called, the target will default to the name/username
             * textbox (see getSubmitButtonAlignmentTarget()).
             *
             * @param element Any DOM element on the screen.
             *
             setSubmitButtonAlignmentTarget : function(element)
             {
            this._submitButtonAlignmentTarget = element;
        },

             /**
             * Gets the UI control to which the submit button should dynamically align.
             * In LTR languages, the right edge of the button will align with the right edge of this control.
             * If setSubmitButtonAlignmentTarget() was ever called, the return value will be the parameter
             * that was passed to that method.  Otherwise, the return value will be the name/username
             * textbox.
             *
             * @return A DOM element on the screen.
             *
             getSubmitButtonAlignmentTarget : function()
             {
            if (this._submitButtonAlignmentTarget)
            {
                return this._submitButtonAlignmentTarget;
            }

            if(this._authenticatedRadio && this._anonymousRadio)
            {
                if(this._isAuthenticatedRadioClicked())
                {
                    return this._authenticatedIdentifierTextBox;
                }
                else
                {
                    return this._anonymousIdentifierTextBox;
                }
            }
            else if(this._authenticatedIdentifierTextBox)
            {
                return this._authenticatedIdentifierTextBox;
            }
            else if(this._anonymousIdentifierTextBox)
            {
                return this._anonymousIdentifierTextBox;
            }
        },

             /**
             * Sets up the strings which will be used in this UI.
             *
             * @param defaultOverrides Optional. May be used to override the strings that would be used by default.
             */
            _initializeStrings: function (defaultOverrides) {
                this._strings = defaultOverrides;
                if (!this._strings) {
                    this._strings = new Object();
                }

                if (!this._strings.authenticatedRadioLabel) {
                    this._strings.authenticatedRadioLabel = localization.IHaveAnAccount;
                }

                if (!this._strings.anonymousRadioLabel) {
                    this._strings.anonymousRadioLabel = localization.IDontHaveAnAccount;
                }

                if (!this._strings.createAccountLinkLabel) {
                    this._strings.createAccountLinkLabel = localization.CreateAnAccount;
                }

                if (!this._strings.authenticatedIdentifierLabel) {
                    this._strings.authenticatedIdentifierLabel = localization.UserNameLabel;
                }

                if (!this._strings.authenticatedCredentialsLabel) {
                    this._strings.authenticatedCredentialsLabel = localization.PasswordLabel;
                }

                if (!this._strings.anonymousIdentifierLabel) {
                    this._strings.anonymousIdentifierLabel = localization.NameLabel;
                }

                // Comparison is different here: if caller passes in nothing, the default value is used. If caller passes
                // in some other string, that string is used. If caller passes in false, the label is not displayed at all.
                if (!this._strings.anonymousIdentifierQualifierLabel && false !== this._strings.anonymousIdentifierQualifierLabel) {
                    this._strings.anonymousIdentifierQualifierLabel = localization.OptionalTag;
                }
            },

            _buildInnerPanel: function (prefix) {
                var div = this.createElement('div');

                if (this._multipleAccessTypesAllowed()) {
                    div.appendChild(this._buildRadioButtonPanel(prefix));
                }

                if (this._allowedAccessTypes & this.AUTHENTICATION_TRACKER) {
                    this._authenticatedCredentialsDiv = this._buildAuthenticatedCredentialsPanel(prefix);
                    div.appendChild(this._authenticatedCredentialsDiv);
                }

                if (this._allowedAccessTypes & this.AUTHENTICATION_ANONYMOUS) {
                    this._anonymousCredentialsDiv = this._buildAnonymousCredentialsPanel(prefix);
                    div.appendChild(this._anonymousCredentialsDiv);
                }

                div.appendChild(this._buildExtraFormFields(prefix));
                this._buttonPanel = this._buildButtonPanel()
                div.appendChild(this._buttonPanel);

                if (this._authenticatedRadio) {
                    this._onClickAuthenticatedRadio();
                } else {
                    this._onClickAnonymousRadio();
                }

                return div;
            },

            /**
             * Returns true if the number of access types (anonymous,
             * tracker, etc.) is >= 2.  Returns false otherwise.
             */
            _multipleAccessTypesAllowed: function () {
                var alreadyFoundAOne = false;
                var bits = this._allowedAccessTypes;
                while (0 != bits) {
                    if (bits & 1) {
                        if (alreadyFoundAOne) {
                            return true;
                        }
                        alreadyFoundAOne = true;
                    }
                    bits >>= 1;
                }
                return false;
            },

            _buildRadioButtonPanel: function (prefix) {
                var div = this.createElement('div');
                var formGroupDiv = null;

                if (this._allowedAccessTypes & this.AUTHENTICATION_TRACKER) {
                    formGroupDiv = this.createChildElement(div, 'div', null, { 'class': 'iwt-form-field-div' });
                    var columnDiv = this.createChildElement(formGroupDiv, 'div', null, { 'class': 'iwt-form-field-no-label' });
                    var radioDiv = this.createChildElement(columnDiv, 'div', null, { 'class': 'iwt-radio' });
                    var label = this.createChildElement(radioDiv, 'label');
                    this._authenticatedRadio = this.createChildElement(radioDiv, 'input', null, { 'type': 'radio', 'defaultChecked': true, 'checked': true, 'name': prefix + 'Radio' });
                    var span = this.createChildElement(radioDiv, 'span', null, { 'class': 'iwt-radio-button-checkbox-label' }, null, this._strings.authenticatedRadioLabel);
                    Element.observe(this._authenticatedRadio, 'click', this._onClickAuthenticatedRadio.bindAsEventListener(this));
                    Element.observe(span, 'click', this._onClickAuthenticatedRadio.bindAsEventListener(this));
                }

                if (this._allowedAccessTypes & this.AUTHENTICATION_ANONYMOUS) {
                    formGroupDiv = this.createChildElement(div, 'div', null, { 'class': 'iwt-form-field-div ' });
                    var columnDiv = this.createChildElement(formGroupDiv, 'div', null, { 'class': 'iwt-form-field-no-label' });
                    var radioDiv = this.createChildElement(columnDiv, 'div', null, { 'class': 'iwt-radio' });
                    var label = this.createChildElement(radioDiv, 'label');
                    this._anonymousRadio = this.createChildElement(radioDiv, 'input', null, { 'type': 'radio', 'name': prefix + 'Radio' });
                    var span = this.createChildElement(radioDiv, 'span', null, { 'class': 'iwt-radio-button-checkbox-label' }, null, this._strings.anonymousRadioLabel);
                    Element.observe(this._anonymousRadio, 'click', this._onClickAnonymousRadio.bindAsEventListener(this));
                    Element.observe(span, 'click', this._onClickAnonymousRadio.bindAsEventListener(this));
                }

                return div;
            },

            _onClickAuthenticatedRadio: function () {
                // if this form doesn't support both authentication types, these radio buttons won't be here
                if (this._authenticatedRadio && this._anonymousRadio) {
                    this._authenticatedRadio.checked = true;
                    this._anonymousRadio.checked = false;

                    Element.show(this._authenticatedCredentialsDiv);
                    Element.hide(this._anonymousCredentialsDiv);
                }

                // These two fields are now required
                this.addRequiredField(ui.FormFieldTypes.Username, this._authenticatedIdentifierTextBox);
                this.addRequiredField(ui.FormFieldTypes.Password, this._authenticatedCredentialsTextBox);

                this.focus();
            },

            _onClickAnonymousRadio: function () {
                // if this form doesn't support both authentication types, these radio buttons won't be here
                if (this._authenticatedRadio && this._anonymousRadio) {
                    this._authenticatedRadio.checked = false;
                    this._anonymousRadio.checked = true;

                    Element.hide(this._authenticatedCredentialsDiv);
                    Element.show(this._anonymousCredentialsDiv);
                }

                // These two fields are now not required, since they are hidden
                this.removeRequiredField(ui.FormFieldTypes.Username, this._authenticatedIdentifierTextBox);
                this.removeRequiredField(ui.FormFieldTypes.Password, this._authenticatedCredentialsTextBox);

                this.focus();
            },

            _onClickCreateAccount: function () {
                this._registerFormContainer.showRegisterForm();
            },

            _shouldAddCreateAccountLink: function () {
                var tabVisibility = webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.TabVisibility);
                if (tabVisibility.hideRegisterNewAccountTab()) {
                    return false;
                }

                return webservices.CapabilityRepository.isTrackerRegistrationCapabilityEnabled();

            },

            _onClickCreateAccount: function () {
                this._registerFormContainer.showRegisterForm();
            },

            _shouldAddCreateAccountLink: function () {
                var tabVisibility = webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.TabVisibility);
                if (tabVisibility.hideRegisterNewAccountTab()) {
                    return false;
                }

                return webservices.CapabilityRepository.isTrackerRegistrationCapabilityEnabled();
            },

            _buildAuthenticatedCredentialsPanel: function (prefix) {
                var maximumFieldLengths = webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths);
                var div = this.createElement('div', null, { 'class': 'iwt-account-indented-panel' });

                // authenticatedIdentifier (e.g. username) div
                var authenticatedIdentifierDiv = this.createChildElement(div, 'div', null, { 'class': 'iwt-form-field-div' });
                this.createChildElement(authenticatedIdentifierDiv, 'label', null, { 'class': 'iwt-form-label', 'for': prefix + '-authenticated-identifier' }, null, this._strings.authenticatedIdentifierLabel);
                var inputContainerDiv = this.createChildElement(authenticatedIdentifierDiv, 'div', null, { 'class': 'iwt-textbox-container' })
                this._authenticatedIdentifierTextBox = this.createChildElement(inputContainerDiv, 'input', prefix + '-authenticated-identifier', { 'type': 'text', 'class': 'iwt-textbox', 'maxlength': maximumFieldLengths.get_nameMaximumLength(), 'name': prefix + '-authenticated-identifier' });
                this._addErrorDiv(authenticatedIdentifierDiv);

                // authenticated credentials (e.g. password) div
                var authenticatedCredentialsDiv = this.createChildElement(div, 'div', null, { 'class': 'iwt-form-field-div' });
                this.createChildElement(authenticatedCredentialsDiv, 'label', null, { 'class': 'iwt-form-label', 'for': prefix + '-authenticated-credentials' }, null, this._strings.authenticatedCredentialsLabel);
                inputContainerDiv = this.createChildElement(authenticatedCredentialsDiv, 'div', null, { 'class': 'iwt-textbox-container' })
                this._authenticatedCredentialsTextBox = this.createChildElement(inputContainerDiv, 'input', prefix + '-authenticated-credentials', { 'type': 'password', 'class': 'iwt-textbox', 'maxlength': maximumFieldLengths.get_passwordMaximumLength(), 'name': prefix + '-authenticated-credentials' });
                this._addErrorDiv(authenticatedCredentialsDiv);

                return div;
            },

            _buildAnonymousCredentialsPanel: function (prefix) {
                var maximumFieldLengths = webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths);
                var div = this.createElement('div', null, { 'class': 'iwt-account-indented-panel' });

                // anonymous identifier (e.g. name) div
                var anonymousIdentifierDiv = this.createChildElement(div, 'div', null, { 'class': 'iwt-form-field-div' });
                this.createChildElement(anonymousIdentifierDiv, 'label', null, { 'class': 'iwt-form-label', 'for': prefix + '-anonymous-identifier' }, null, this._strings.anonymousIdentifierLabel);
                var inputClass = 'iwt-textbox-container-optional';
                if (this._strings.anonymousIdentifierQualifierLabel) {
                    this.createChildElement(anonymousIdentifierDiv, 'span', null, { 'class': 'iwt-optional-label' }, null, this._strings.anonymousIdentifierQualifierLabel);
                } else {
                    inputClass = 'iwt-textbox-container';
                }
                var inputContainerDiv = this.createChildElement(anonymousIdentifierDiv, 'div', null, { 'class': inputClass })
                this._anonymousIdentifierTextBox = this.createChildElement(inputContainerDiv, 'input', prefix + '-anonymous-identifier', { 'type': 'text', 'class': 'iwt-textbox', 'maxlength': maximumFieldLengths.get_nameMaximumLength(), 'name': prefix + '-anonymous-identifier' });

                this._addErrorDiv(anonymousIdentifierDiv);

                return div;
            },

            _buildExtraFormFields: function (prefix) {
                // overload this in a derived class if you need to add extra form fields
                return this.createElement('div');
            },

            _isAuthenticatedRadioClicked: function () {
                return this._authenticatedRadio && this._authenticatedRadio.checked;
            }
        });
    /**
     * CallbackLoginFormPanel class
     * Implements the panel in which the user types their name, phone number, subject of their callback request, etc.
     */
    ui.CallbackLoginFormPanel = Class.create(ui.LoginFormPanelBase,
        {
            /**
             * constructor
             *
             * @param callbackManager An instance of a subclass of webservices.CallbackManagerBase
             * @param registerFormContainer The Panel that contains the registration form.  Must have
             *                              a showRegisterForm() method.
             * @param callbackParameters An instance of CallbackParameters
             * @param requiredFields Optional parameter.  An array of FormFieldTypes, indicating which fields are required on this form.
             */
            initialize: function ($super, callbackManager, registerFormContainer, callbackParameters, requiredFields) {
                this._callbackManager = callbackManager;
                this._callbackParameters = callbackParameters;

                this._maxSubjectLen = webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths).get_subjectMaximumLength();

                var allowedAccessTypes = this.AUTHENTICATION_NONE;
                if (webservices.CapabilityRepository.isCallbackTrackerAuthenticationCapabilityEnabled()) {
                    allowedAccessTypes |= this.AUTHENTICATION_TRACKER;
                }
                if (webservices.CapabilityRepository.isCallbackAnonymousAuthenticationCapabilityEnabled()) {
                    allowedAccessTypes |= this.AUTHENTICATION_ANONYMOUS;
                }

                $super(registerFormContainer, localization.StartCallbackButton, 'iwt-callback-form-panel', allowedAccessTypes, requiredFields);

                this.addImplementedInterface(webservices.Interfaces.ICallbackCreationFailureNotificationObserver, webservices);
                webservices.NotificationRegistry.registerObserver(this, webservices.Interfaces.ICallbackCreationFailureNotification);
            },

            /**
             * destructor
             */
            destroy: function () {
                this._callbackManager = null;

                ui.LoginFormPanelBase.prototype.destroy.call(this);
            },

            // methods

            /**
             * Clears the fields of the login form.
             */
            reset: function () {
                ui.LoginFormPanelBase.prototype.reset.call(this);
                this._clearTextboxIfAvailable(this._subjectTextArea);
                this._clearTextboxIfAvailable(this._telephoneTextBox)
            },

            /**
             * Respond to notification that an attempt to create a Callback has failed.
             *
             * @param notification Contains an error indicating the reason for the failure.
             */
            processCallbackCreationFailureNotification: function (notification) {
                common.Interface.ensureImplements(notification, webservices.Interfaces.ICallbackCreationFailureNotification);

                var error = notification.get_error();
                var text = ui.ErrorDisplayTextBuilder.build(error, localization.CallbackFailed);
                this.setErrorStatus(text);
                this.clearBusy();
                this.enableSubmitButton(true);
            },

            // private methods

            _buildInnerPanel: function (prefix) {
                var div = this.createElement('div');

                // container div
                this._containerDiv = this.createChildElement(div, 'div');
                this._containerDiv.appendChild(ui.LoginFormPanelBase.prototype._buildInnerPanel.call(this, prefix));

                return div;
            },

            _buildExtraFormFields: function (prefix) {
                // overload this in a derived class if you need to add extra form fields
                return this._buildCallbackDetailsPanel(prefix);
            },

            _buildCallbackDetailsPanel: function (prefix) {
                var div = this.createElement('div', null, { 'class': 'iwt-account-indented-panel' });

                // telephone div
                var telephoneDiv = this.createChildElement(div, 'div', null, { 'class': 'iwt-form-field-div' });
                this.createChildElement(telephoneDiv, 'label', null, { 'class': 'iwt-form-label', 'for': prefix + '-telephone' }, null, localization.TelephoneLabel);
                var childDiv = this.createChildElement(telephoneDiv, 'div', null, { 'class': 'iwt-textbox-container' });
                var maximumFieldLengths = webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths);
                this._telephoneTextBox = this.createChildElement(childDiv, 'input', null, { 'type': 'tel', 'class': 'iwt-textbox', 'maxlength': maximumFieldLengths.get_telephoneMaximumLength(), 'id': prefix + '-telephone', 'name': prefix + '-telephone' });
                this._addErrorDiv(telephoneDiv);

                // subject div
                var subjectDiv = this.createChildElement(div, 'div', null, { 'class': 'iwt-form-field-div' });
                this.createChildElement(subjectDiv, 'label', null, { 'class': 'iwt-form-label iwt-subject-label', 'for': prefix + '-subject' }, null, localization.DescriptionLabel);
                childDiv = this.createChildElement(subjectDiv, 'div', null, { 'class': 'iwt-textbox-container' });
                this._subjectTextArea = this.createChildElement(childDiv, 'textarea', prefix + '-subject', { 'class': 'iwt-subject-textarea', 'maxlength': this._maxSubjectLen, 'name': prefix + '-subject' });
                Element.observe(this._subjectTextArea, 'keyup', this._onKeyUpTextArea.bindAsEventListener(this));
                this._addErrorDiv(subjectDiv);

                this.addRequiredField(ui.FormFieldTypes.Telephone, this._telephoneTextBox);
                this.addRequiredField(ui.FormFieldTypes.Subject, this._subjectTextArea);

                return div;
            },

            _doHtml5FormValidation: function () {
                return $j('#iwt-callback-form-panel form').get(0).checkValidity();
            },

            _doNonHtml5FormValidation: function () {
                var numErrors = 0;
                if (this._isAuthenticatedRadioClicked()) {
                    numErrors += this._validateField(this._authenticatedIdentifierTextBox, ui.FormFieldTypes.Username);
                    numErrors += this._validateField(this._authenticatedCredentialsTextBox, ui.FormFieldTypes.Password);
                }

                numErrors += this._validateField(this._subjectTextArea, ui.FormFieldTypes.Subject);
                numErrors += this._validateField(this._telephoneTextBox, ui.FormFieldTypes.Telephone);

                // if errors are present, show the status and return
                if (numErrors > 0) {
                    if (numErrors == 1) {
                        this.setErrorStatus(localization.OneErrorWithCallbackData);
                    }
                    else {
                        this.setErrorStatus(localization.MultipleErrorsWithCallbackData.replace('%0', numErrors));
                    }
                    return false;
                }
                return true;
            },

            _onValidatedSubmit: function () {
                this.setBusy();
                var subject = this._getValueIfAvailable(this._subjectTextArea);
                this._callbackParameters.set_subject(subject);

                var telephone = this._getValueIfAvailable(this._telephoneTextBox);
                this._callbackParameters.set_telephone(telephone);

                if (this._isAuthenticatedRadioClicked()) {
                    var username = this._getValueIfAvailable(this._authenticatedIdentifierTextBox);
                    this._callbackParameters.set_participantName(username);

                    var password = this._getValueIfAvailable(this._authenticatedCredentialsTextBox);
                    this._callbackParameters.set_participantCredentials(password);
                }
                else {
                    var name = this._getValueIfAvailable(this._anonymousIdentifierTextBox);
                    if (!name) {
                        name = localization.AnonymousUser;
                    }

                    this._callbackParameters.set_participantName(name);
                    this._callbackParameters.set_participantCredentials(null);
                }
                this._createCallback();
            },

            _createCallback: function () {
                try {
                    this._callbackManager.createCallback(this._callbackParameters);
                }
                catch (ex) {
                    this.clearBusy();
                    common.Debug.traceError("Caught unhandled exception:\n" + ex);
                    common.Debug.alert("Caught unhandled exception:\n" + ex);
                    webservices.ProblemReporter.sendProblemReport(ex, "CallbackLoginFormPanel._createCallback()");
                }
            },

            /**
             * Key handler.  Enforces maximum length, since the HTML textarea tag has no "maxlength" attribute.
             */
            _onKeyUpTextArea: function (evt) {
                // This method will be called for special keys in Firefox, but not in IE.  Just ignore them.
                if (evt.keyCode == 37 || // Left arrow
                    evt.keyCode == 38 || // Up arrow
                    evt.keyCode == 39 || // Right arrow
                    evt.keyCode == 40 || // Down arrow
                    evt.keyCode == 8 || // Backspace
                    evt.keyCode == 93 || // Right-click menu key
                    evt.keyCode == 91 || // Window key
                    evt.keyCode == 45 || // Insert
                    evt.keyCode == 46 || // Delete
                    evt.keyCode == 35 || // End
                    evt.keyCode == 36 || // Home
                    evt.keyCode == 33 || // PgUp
                    evt.keyCode == 34 || // PgDn
                    evt.keyCode == 116 || // Ctrl+F5 (reload)
                    evt.keyCode == 192)   // Alt, when used in combination with another key.  For instance,
                // if Alt-LeftArrow is pressed to go back, this method will be
                // called twice, once with 192 and then again with 37.  If Alt is
                // pressed by itself, this method will not be called.
                {
                    return;
                }

                var len = this._subjectTextArea.value.length;

                if (len >= this._maxSubjectLen) {
                    evt.stop();

                    // Handle the case in which the user just pasted a large block of text
                    this._subjectTextArea.value = this._subjectTextArea.value.substr(0, this._maxSubjectLen);
                }
            }
        });
    /**
     * CallbackStatusPanel class
     * Implements the panel in which the user manages previously-created Callbacks.
     * This is an abstract class. @see WebServicesCallbackStatusPanel.
     */
    ui.CallbackStatusPanel = Class.create(ui.Control,
        {
            /**
             * Constructor
             */
            initialize: function ($super) {
                this._cssClass = 'iwt-callback-status-panel';

                var domObject = this._buildDomObject();
                this._validateDomObject();

                $super(domObject);

                if (this._isStatusSupported()) {
                    this._statusFieldsDisplay = webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.StatusFieldsDisplay);
                }
            },

            /**
             * destructor
             */
            destroy: function () {
                this._statusFieldsDisplay = null;
            },

            // methods

            /**
             * What to do when the panel gets focus.
             * Currently does nothing, since there are no textboxes, radio buttons, etc.
             */
            focus: function () {
                // Nothing to do
            },

            /**
             * Resets the panel to its initial appearance.
             */
            reset: function () {
                this._callbackCreationSuccessPanel.hide();
                this.showDisconnectButtonPanel();
                this.hideAgentPhoto();
                this.hideCallbackParameters();
                this.hideStatus();
                this.setStatusIndicator(null);
                this.clearBusy();
            },

            /**
             * Show the panel indicating that a callback has been created successfully
             */
            showCallbackCreationSuccessPanel: function () {
                this._callbackCreationSuccessPanel.show();
            },

            /**
             * Show the panel containing the disconnect button (and hide the disconnect failure panel)
             */
            showDisconnectButtonPanel: function () {
                if (this._isDisconnectSupported()) {
                    Element.hide(this._disconnectedPanel);
                    Element.hide(this._disconnectFailurePanel);
                    Element.show(this._disconnectButtonPanel);
                }
            },

            /**
             * Shows the busy indicator
             */
            setBusy: function () {
                Element.show(this._busyImage);
            },

            /**
             * Hides the busy indicator
             */
            clearBusy: function () {
                Element.hide(this._busyImage);
            },

            /**
             * Show the  panel that informs the user that the Callback has been disconnected by the agent.
             * (If it had been disconnected by the user, the Callback creation form would be shown again.)
             */
            showDisconnectedPanel: function () {
                this.setStatusIndicator('Disconnected');
                this._callbackCreationSuccessPanel.hide();
                this.hideAgentPhoto();
                this.hideCallbackParameters();
                this.hideStatus();
                Element.hide(this._statusFailurePanel);
                Element.hide(this._disconnectFailurePanel);
                Element.show(this._disconnectedPanel);
                this.clearBusy();
            },

            /**
             * Show the disconnect failure panel.
             * The disconnect button panel is not hidden, so that the user may re-attempt the disconnect.
             */
            showDisconnectFailurePanel: function () {
                if (this._isDisconnectSupported()) {
                    this.setStatusIndicator(null);
                    Element.hide(this._statusFailurePanel);
                    Element.show(this._disconnectFailurePanel);
                    Element.hide(this._disconnectedPanel);
                    this.clearBusy();
                }
            },

            /**
             * Abstract method, implemented in subclass.
             * Does the work of disconnecting the callback.
             */
            disconnect: function () {
                throw common.ExceptionFactory.createException("CallbackStatusPanel.disconnect(): Abstract method not overridden by child class!");
            },

            /**
             * Sets the displayed participant name, telephone number, subject, and creation date/time of the callback.
             *
             * @param participantName The name or username of the web user who has created the callback request
             * @param telephone The telephone number at which the participant indicated they would like to be called
             * @param subject The subject of the callback (which the web user entered in the CallbackLoginPanel)
             * @param creationDateTime A Javascript Date object containing the timestamp of when the callback request was created
             */
            showCallbackParameters: function (participantName, telephone, subject, creationDateTime) {
                if (!this._isStatusSupported()) {
                    return;
                }

                if (this._statusFieldsDisplay.get_showSubject()) {
                    $j(this._subjectSpan).text(subject);
                    Element.show(this._subjectSpan);
                }
                else {
                    Element.hide(this._subjectSpan);
                }

                var showingAtLeastOneField = false; // (Excluding the subject)

                if (this._statusFieldsDisplay.get_showName()) {
                    $j(this._participantNameField).text(participantName);
                    showingAtLeastOneField = true;
                }

                if (this._statusFieldsDisplay.get_showTelephone()) {
                    $j(this._telephoneNumberField).text(telephone);
                    showingAtLeastOneField = true;
                }

                if (this._statusFieldsDisplay.get_showCreationDateTime()) {
                    $j(this._creationDateTimeField).text(ui.DateTimeFormatter.formatTimeForDisplay(creationDateTime, true));
                    showingAtLeastOneField = true;
                }

                if (showingAtLeastOneField) {
                    Element.show(this._parameterFieldsContainerDiv);
                }
            },

            /**
             * Hides the displayed subject of the callback
             */
            hideCallbackParameters: function () {
                if (this._isStatusSupported()) {
                    Element.hide(this._parameterFieldsContainerDiv);
                    Element.hide(this._subjectSpan);
                }
            },

            /**
             * Sets the status indicator (quick visual reference of what state the callback is in).
             *
             * @param status A key into the L10N resource file. Do not pass plain text, or the status indicator's value will be set to null and a warning will be traced.
             */
            setStatusIndicator: function (statusKey) {
                if (!this._isStatusSupported()) {
                    return;
                }

                if (statusKey) {
                    try {
                        var status = localization[statusKey];
                        $j(this._statusIndicator).text(status);
                        Element.show(this._statusIndicator);
                    } catch (e) {
                        common.Debug.traceWarning('Received status indicator "' + statusKey + '" is not a resource file key: ' + e);
                    }
                }
                else {
                    Element.hide(this._statusIndicator);
                }
            },

            /**
             * Sets the status fields and makes the panel visible
             * @params A Javascript object containing any or all of the following fields:
             * assignedAgentName, interactionState, estimatedCallbackTime (specified in seconds after now),
             * queueWaitTime (in seconds), queuePosition, queueName, longestWaitTime (in seconds),
             * interactionsWaitingCount, loggedInAgentsCount, availableAgentsCount
             */
            showStatus: function (params) {
                if (!this._isStatusSupported()) {
                    return;
                }

                Element.hide(this._statusFailurePanel);

                if (this._statusFieldsDisplay.get_showAssignedAgentName() && params.assignedAgentName) {
                    $j(this._assignedAgentField).text(params.assignedAgentName);
                    Element.show(this._assignedAgentDiv);
                }
                else {
                    Element.hide(this._assignedAgentDiv);
                }

                if (this._statusFieldsDisplay.get_showInteractionState() && params.interactionState && !(params.interactionState.match(/\%\d+\%/))) {
                    $j(this._callbackStateField).text(params.interactionState);
                    Element.show(this._callbackStateDiv);
                }
                else {
                    Element.hide(this._callbackStateDiv);
                }

                if (this._statusFieldsDisplay.get_showEstimatedCallbackTime() && params.estimatedCallbackTime && params.estimatedCallbackTime > 0) {
                    $j(this._estimatedCallbackTimeField).text(this._statusFieldsDisplay.formatTimeDuration("TimeDuration", params.estimatedCallbackTime));
                    Element.show(this._estimatedCallbackTimeDiv);
                }
                else {
                    Element.hide(this._estimatedCallbackTimeDiv);
                }

                if (this._statusFieldsDisplay.get_showQueueWaitTime() && params.queueWaitTime && params.queueName && params.queueWaitTime > 0) {
                    $j(this._queueWaitTimeLabel).text(localization.WaitTimeLabel);
                    $j(this._queueWaitTimeField).text(this._statusFieldsDisplay.formatTimeDuration("TimeDuration", params.queueWaitTime));
                    Element.show(this._queueWaitTimeDiv);
                }
                else {
                    Element.hide(this._queueWaitTimeDiv);
                }

                if (this._statusFieldsDisplay.get_showQueuePosition() && params.queuePosition && params.queueName && params.queuePosition > 0) {
                    $j(this._queuePositionLabel).text(localization.QueuePositionLabel.replace('%0', params.queueName));
                    $j(this._queuePositionField).text(params.queuePosition);
                    Element.show(this._queuePositionDiv);
                }
                else {
                    Element.hide(this._queuePositionDiv);
                }

                if (this._statusFieldsDisplay.get_showLongestWaitTime() && params.longestWaitTime && params.longestWaitTime > 0) {
                    $j(this._longestWaitTimeField).text(this._statusFieldsDisplay.formatTimeDuration("TimeDuration", params.longestWaitTime));
                    Element.show(this._longestWaitTimeDiv);
                }
                else {
                    Element.hide(this._longestWaitTimeDiv);
                }

                if (this._statusFieldsDisplay.get_showInteractionsWaitingCount() && params.interactionsWaitingCount && params.interactionsWaitingCount >= 0) {
                    $j(this._interactionsWaitingCountField).text(params.interactionsWaitingCount);
                    Element.show(this._interactionsWaitingCountDiv);
                }
                else {
                    Element.hide(this._interactionsWaitingCountDiv);
                }

                if (this._statusFieldsDisplay.get_showLoggedInAgentsCount() && params.loggedInAgentsCount && params.loggedInAgentsCount >= 0) {
                    $j(this._loggedInAgentsCountField).text(params.loggedInAgentsCount);
                    Element.show(this._loggedInAgentsCountDiv);
                }
                else {
                    Element.hide(this._loggedInAgentsCountDiv);
                }

                if (this._statusFieldsDisplay.get_showAvailableAgentsCount() && params.availableAgentsCount && params.availableAgentsCount >= 0) {
                    $j(this._availableAgentsCountField).text(params.availableAgentsCount);
                    Element.show(this._availableAgentsCountDiv);
                }
                else {
                    Element.hide(this._availableAgentsCountDiv);
                }

                Element.show(this._statusFieldsContainerDiv);
            },

            /**
             * Hides the status fields of the callback
             */
            hideStatus: function () {
                if (this._isStatusSupported()) {
                    Element.hide(this._statusFieldsContainerDiv);
                }
            },

            /**
             * Shows the failure message
             */
            showStatusFailure: function () {
                if (this._isStatusSupported()) {
                    Element.hide(this._statusFieldsContainerDiv);
                    this.setStatusIndicator(null);
                    this.hideAgentPhoto();
                    Element.show(this._statusFailurePanel);
                    Element.show(this._domObject);
                }
            },

            /**
             * Displays the photo at the supplied URL as the agent photo.
             *
             * @param url The URL of the agent's photo
             */
            showAgentPhoto: function (url) {
                if (this._isStatusSupported()) {
                    this._assignedAgentPhoto.src = "/" + webservices.Servers.CurrentUriFragment + url;
                    Element.show(this._assignedAgentPhoto);
                }
            },

            /**
             * Hides the agent's photo
             */
            hideAgentPhoto: function () {
                if (this._isStatusSupported()) {
                    Element.hide(this._assignedAgentPhoto);
                    this._assignedAgentPhoto.src = "";
                }
            },

            /**
             * Abstract method, implemented in subclass.
             * Does the work of querying the status.
             */
            queryStatus: function () {
                throw common.ExceptionFactory.createException("CallbackStatusPanel.queryStatus(): Abstract method not overridden by child class!");
            },

            // private methods

            _buildDomObject: function () {
                // Root panel
                this._panelContainerDiv = this.createElement('div', null, { 'class': this._cssClass });

                row = this.createChildElement(this._panelContainerDiv, 'div', null, { 'class': 'iwt-callback-notices-container' });
                this._addCallbackCreationSuccessPanel(row);
                this._addDisconnectedPanel(row);

                row = this.createChildElement(this._panelContainerDiv, 'div', null, { 'class': 'iwt-callback-subject-and-status-indicator-container' });
                this._addSubjectPanel(row);
                this._addStatusIndicator(row);

                row = this.createChildElement(this._panelContainerDiv, 'div', null, { 'class': 'iwt-callback-status-and-avatar-container' });
                this._addStatusPanel(row);
                this._addAssignedAgentPhotoDiv(row);

                row = this.createChildElement(this._panelContainerDiv, 'div', null, { 'class': 'iwt-callback-disconnect-button-panel-container' });
                this._addDisconnectButtonPanel(row);

                row = this.createChildElement(this._panelContainerDiv, 'div', null, { 'class': 'iwt-callback-failure-panel-container' });
                this._addFailureContainerDiv(row);

                return this._panelContainerDiv;
            },

            _addCallbackCreationSuccessPanel: function (parent) {
                var div = this.createElement('div', null, { 'class': 'iwt-callback-creation-success-panel' }, { 'display': 'none' });
                // A table is used so that if the window is small enough that the span's text wraps to a second line, it won't flow around the image.
                var table = this.createChildElement(div, 'table');
                var row = this.createChildElement(table, 'row');
                var leftTd = this.createChildElement(row, 'td', null, { 'class': 'iwt-callback-creation-success-panel-left' });
                var rightTd = this.createChildElement(row, 'td', null, { 'class': 'iwt-callback-creation-success-panel-right' });
                this.createChildElement(leftTd, 'img', null, { 'src': 'img/check.png' });
                this.createChildElement(rightTd, 'span', null, { 'class': 'iwt-label' }, null, localization.CallbackSucceeded);
                this._callbackCreationSuccessPanel = div;
                parent.appendChild(div);
            },

            _addDisconnectedPanel: function (parent) {
                var div = this.createElement('div', null, { 'class': 'iwt-callback-disconnected-panel' }, { 'display': 'none' });
                // A table is used so that if the window is small enough that the span's text wraps to a second line, it won't flow around the image.
                var table = this.createChildElement(div, 'table');
                var row = this.createChildElement(table, 'row');
                var leftTd = this.createChildElement(row, 'td', null, { 'class': 'iwt-callback-disconnected-panel-left' });
                var rightTd = this.createChildElement(row, 'td', null, { 'class': 'iwt-callback-disconnected-panel-right' });
                this.createChildElement(leftTd, 'img', null, { 'src': 'img/error.png' });
                this.createChildElement(rightTd, 'span', null, { 'class': 'iwt-label' }, null, localization.CallbackNoLongerExists);
                this._disconnectedPanel = div;
                parent.appendChild(div);
            },

            _addSubjectPanel: function (parent) {
                if (!this._isStatusSupported()) {
                    return;
                }

                var subjectDiv = this.createChildElement(parent, 'div', null, { 'class': 'iwt-callback-status-subject-div' });
                this._subjectSpan = this.createChildElement(subjectDiv, 'div', null, { 'class': 'iwt-callback-status-subject' });
            },

            _addStatusIndicator: function (parent) {
                if (this._isStatusSupported()) {
                    var container = this.createChildElement(parent, 'div', null, { 'class': 'iwt-callback-status-indicator-container' });
                    this._statusIndicator = this.createChildElement(container, 'div', null, { 'class': 'iwt-callback-status-indicator' }, { 'display': 'none' });
                }
            },

            _addDisconnectButtonPanel: function (parent) {
                if (this._isDisconnectSupported()) {
                    this._disconnectButtonPanel = this.createChildElement(parent, 'div', null, { 'class': 'iwt-callback-disconnect-button-panel' }, { 'display': 'none' });
                    var disconnectButton = this.createChildElement(this._disconnectButtonPanel, 'input', null, { 'type': 'button', 'class': 'iwt-callback-disconnect-button', 'value': localization.DisconnectCallback, 'name': 'iwt-callback-disconnect-button' });
                    Element.observe(disconnectButton, 'click', this._onClickDisconnectButton.bindAsEventListener(this));
                    this._busyImage = this.createChildElement(this._disconnectButtonPanel, 'img', null, { 'class': 'iwt-busy-image', 'src': 'img/spinner.gif' }, { 'display': 'none' });
                }
            },

            _addStatusPanel: function (parent) {
                if (!this._isStatusSupported()) {
                    return;
                }

                var div = this.createChildElement(parent, 'div', null, { 'class': 'iwt-callback-status-fields-container' });
                var form = this.createChildElement(div, 'form', null, { 'class': 'iwt-callback-status-form', 'role': 'form' });

                // Container for fields that the web user entered him/herself
                this._parameterFieldsContainerDiv = this.createChildElement(form, 'div', null, null, { 'display': 'none' });

                // Web user's name or username
                this._makeStatusField(this._parameterFieldsContainerDiv, 'participantName', localization.CallbackCreatorNameLabel);

                // Creation date/time
                this._makeStatusField(this._parameterFieldsContainerDiv, 'creationDateTime', localization.CallbackCreationDateTimeLabel);

                // Telephone number
                this._makeStatusField(this._parameterFieldsContainerDiv, 'telephoneNumber', localization.TelephoneLabel);

                // Container for status fields obtained from IC
                this._statusFieldsContainerDiv = this.createChildElement(form, 'div', null, null, { 'display': 'none' });

                // Assigned agent
                this._makeStatusField(this._statusFieldsContainerDiv, 'assignedAgent', localization.AssignedAgentLabel);

                // Interaction state
                this._makeStatusField(this._statusFieldsContainerDiv, 'callbackState', localization.CallbackStateLabel);

                // Queue wait time
                this._makeStatusField(this._statusFieldsContainerDiv, 'queueWaitTime', null);

                // Estimated callback time
                this._makeStatusField(this._statusFieldsContainerDiv, 'estimatedCallbackTime', localization.EstimatedCallbackTimeLabel);

                // Queue position
                this._makeStatusField(this._statusFieldsContainerDiv, 'queuePosition', null);

                // Longest wait time
                this._makeStatusField(this._statusFieldsContainerDiv, 'longestWaitTime', localization.LongestWaitTimeLabel);

                // Calls waiting count
                this._makeStatusField(this._statusFieldsContainerDiv, 'interactionsWaitingCount', localization.InteractionsWaitingCountLabel);

                // Logged in agents count
                this._makeStatusField(this._statusFieldsContainerDiv, 'loggedInAgentsCount', localization.LoggedInAgentsCountLabel);

                // Available agents count
                this._makeStatusField(this._statusFieldsContainerDiv, 'availableAgentsCount', localization.AvailableAgentsCountLabel);
            },

            _makeStatusField: function (parent, name, text) {
                var div = this.createChildElement(parent, 'div', null, { 'class': 'iwt-form-field-div' });
                this['_' + name + 'Label'] = this.createChildElement(div, 'label', null, { 'class': 'iwt-callback-status-key' }, null, text);
                var div2 = this.createChildElement(div, 'div', null, { 'class': 'iwt-callback-status-value' });
                this['_' + name + 'Field'] = this.createChildElement(div2, 'p', null, { 'class': 'iwt-callback-status-field' });
                this['_' + name + 'Div'] = div;
            },

            _addAssignedAgentPhotoDiv: function (parent) {
                var div = this.createChildElement(parent, 'div', null, { 'class': 'iwt-callback-participant-avatar-div' });
                if (this._isStatusSupported()) {
                    this._assignedAgentPhoto = this.createChildElement(div, 'img', null, { 'class': 'iwt-callback-participant-avatar' }, { 'display': 'none' });
                }
            },

            _addFailureContainerDiv: function (parent) {
                if (this._isStatusSupported() || this._isDisconnectSupported()) {
                    this._failureContainerDiv = this.createChildElement(parent, 'div', null, { 'class': 'iwt-callback-failure-panel' });
                }
                this._addStatusFailurePanel();
                this._addDisconnectFailurePanel();
            },

            _addStatusFailurePanel: function () {
                if (this._isStatusSupported()) {
                    this._statusFailurePanel = this.createChildElement(this._failureContainerDiv, 'div', null, { 'class': 'iwt-callback-status-failure' }, { 'display': 'none' });
                    this.createChildElement(this._statusFailurePanel, 'img', null, { 'src': 'img/error.png' });
                    this.createChildElement(this._statusFailurePanel, 'span', null, { 'class': 'iwt-label' }, null, localization.CallbackStatusFailed);
                }
            },

            _addDisconnectFailurePanel: function () {
                if (this._isDisconnectSupported()) {
                    // The panel that informs the user that the disconnect has failed
                    this._disconnectFailurePanel = this.createChildElement(this._failureContainerDiv, 'div', null, { 'class': 'iwt-callback-disconnect-failure-panel' }, { 'display': 'none' });
                    this.createChildElement(this._disconnectFailurePanel, 'img', null, { 'src': 'img/error.png' });
                    this.createChildElement(this._disconnectFailurePanel, 'span', null, { 'class': 'iwt-label' }, null, localization.DisconnectCallbackFailed);
                }
            },

            _validateDomObject: function () {
                if ((this._isDisconnectSupported() && !this._disconnectFailurePanel) ||
                    (this._isStatusSupported() && !this._statusFailurePanel) ||
                    (!this._callbackCreationSuccessPanel)) {
                    throw common.ExceptionFactory.createException("CallbackStatusPanel not built properly!");
                }
            },

            _isStatusSupported: function () {
                return webservices.CapabilityRepository.isCallbackStatusCapabilityEnabled();
            },

            _isDisconnectSupported: function () {
                return webservices.CapabilityRepository.isDisconnectCallbackCapabilityEnabled();
            },

            _isReconnectSupported: function () {
                return webservices.CapabilityRepository.isReconnectCallbackCapabilityEnabled();
            },

            _onClickDisconnectButton: function () {
                this.setBusy();
                this.disconnect(); // Abstract method
            }
        });
    /**
     * WebServicesCallbackStatusPanel class
     *
     * Handles the logic of the panel in which the web user may view the status of a callback.  For the
     * UI, @see CallbackStatusPanel.
     */
    ui.WebServicesCallbackStatusPanel = Class.create(ui.CallbackStatusPanel,
        {
            /**
             * When a callback is created, this determines how
             * long (in milliseconds) before its status is polled.
             * After that, it is polled every SUBSEQUENT_POLL_INTERVAL milliseconds.
             */
            INITIAL_POLL_INTERVAL: 1500,

            /**
             * This determines how often (in milliseconds) a Callback's
             * status should be polled.  But, after one is initially created,
             * the first poll is done after INITIAL_POLL_INTERVAL milliseconds.
             */
            SUBSEQUENT_POLL_INTERVAL: 10000,

            m_initialPollTimerId: null,
            m_isConnected: false,

            /**
             * Constructor
             *
             * @param callbackManager An instance of a subclass of webservices.CallbackManagerBase
             */
            initialize: function ($super, callbackManager) {
                this._callbackManager = callbackManager;
                this._statusPollTimer = null;
                this._participantId = null;

                $super();

                this.addImplementedInterface(webservices.Interfaces.ICallbackCreationNotificationObserver, webservices);
                webservices.NotificationRegistry.registerObserver(this, webservices.Interfaces.ICallbackCreationNotification);

                if (this._isDisconnectSupported()) {
                    this.addImplementedInterface(webservices.Interfaces.ICallbackDisconnectNotificationObserver, webservices);
                    this.addImplementedInterface(webservices.Interfaces.ICallbackDisconnectFailureNotificationObserver, webservices);
                    webservices.NotificationRegistry.registerObserver(this, webservices.Interfaces.ICallbackDisconnectNotification);
                    webservices.NotificationRegistry.registerObserver(this, webservices.Interfaces.ICallbackDisconnectFailureNotification);
                }

                if (this._isReconnectSupported()) {
                    this.addImplementedInterface(webservices.Interfaces.ICallbackReconnectNotificationObserver, webservices);
                    webservices.NotificationRegistry.registerObserver(this, webservices.Interfaces.ICallbackReconnectNotification);
                }

                if (this._isStatusSupported()) {
                    this.addImplementedInterface(webservices.Interfaces.ICallbackStatusNotificationObserver, webservices);
                    this.addImplementedInterface(webservices.Interfaces.ICallbackStatusFailureNotificationObserver, webservices);
                    this.addImplementedInterface(webservices.Interfaces.IPartyInfoNotificationObserver, webservices);
                    webservices.NotificationRegistry.registerObserver(this, webservices.Interfaces.ICallbackStatusNotification);
                    webservices.NotificationRegistry.registerObserver(this, webservices.Interfaces.ICallbackStatusFailureNotification);
                    webservices.NotificationRegistry.registerObserver(this, webservices.Interfaces.IPartyInfoNotification);
                }
            },

            /**
             * destructor
             */
            destroy: function () {
                this._destroyTimer();

                this._callbackManager = null;
            },

            // methods

            /**
             * Called when the user clicks the "Disconnect" button in the UI.  Disconnects the callback.
             */
            disconnect: function () {
                if (!this._isDisconnectSupported()) {
                    throw common.ExceptionFactory.createException("WebServicesCallbackStatusPanel.disconnect(): Disconnect capability not supported by server!");
                }
                if (this.m_isConnected) {
                    this.setBusy();
                    this._callbackManager.disconnect(this._participantId);
                } else {
                    // No need to go through callbackManager/IC.  Just create and send the disconnected notification from here, since the server-side part is already done.
                    webservices.NotificationRegistry.process(webservices.NotificationFactory.createCallbackDisconnectNotification(this._participantId));
                }
            },

            /**
             * Queries the status of the callback.
             */
            queryStatus: function () {
                if (!this._isStatusSupported()) {
                    throw common.ExceptionFactory.createException("WebServicesCallbackStatusPanel.queryStatus(): QueryStatus capability not supported by server!");
                }

                common.Debug.traceMethodEntered("WebServicesCallbackStatusPanel.queryStatus()");
                try {
                    this._callbackManager.queryStatus(this._participantId);
                }
                catch (e) {
                    common.Debug.traceWarning("WebServicesCallbackStatusPanel.queryStatus(): Caught exception: " + e);
                }
                common.Debug.traceMethodExited("WebServicesCallbackStatusPanel.queryStatus()");
            },

            /**
             * This method is called when the recurring status poll timer fires.
             * Do not call it directly.
             * The status poll timer only runs when there is a callback to poll.
             */
            onStatusPollTimer: function () {
                common.Debug.traceMethodEntered("WebServicesCallbackStatusPanel.onStatusPollTimer()");
                this.queryStatus();
                common.Debug.traceMethodExited("WebServicesCallbackStatusPanel.onStatusPollTimer()");
            },

            /**
             * Respond to notification that a Callback was created successfully.
             *
             * @param callbackCreationNotification An implementation of ICallbackCreationNotification
             */
            processCallbackCreationNotification: function (notification) {
                common.Debug.traceMethodEntered("WebServicesCallbackStatusPanel.processCallbackCreationNotification()");
                common.Interface.ensureImplements(notification, webservices.Interfaces.ICallbackCreationNotification);

                this._participantId = notification.get_participantId();
                // Wait a bit before polling its status, so that ACD can start to route it.
                var _self = this;
                m_initialPollTimerId = window.setTimeout(_self._doInitialStatusQuery.bind(_self), this.INITIAL_POLL_INTERVAL);
                this.m_isConnected = true;
                this.showCallbackCreationSuccessPanel();
                this.showDisconnectButtonPanel();
                var participantName = notification.get_participantName();
                var telephone = notification.get_telephone();
                var subject = notification.get_subject() || notification.get_callbackId();

                if (ui.DateTimeFormatter) {
                    delete ui.DateTimeFormatter;
                }
                ui.DateTimeFormatter = new ui._Internal._DateTimeFormatter(notification.get_dateFormat(), notification.get_timeFormat());
                var creationDateTime = notification.get_creationDateTime();
                this.showCallbackParameters(participantName, telephone, subject, creationDateTime);

                common.Debug.traceMethodExited("WebServicesCallbackStatusPanel.processCallbackCreationNotification()");
            },

            /**
             * Respond to notification that a Callback has been disconnected
             * @param notification An implementation of ICallbackDisconnectNotification
             */
            processCallbackDisconnectNotification: function (notification) {
                common.Debug.traceMethodEntered("WebServicesCallbackStatusPanel.processCallbackDisconnectNotification()");
                common.Interface.ensureImplements(notification, webservices.Interfaces.ICallbackDisconnectNotification);

                if (m_initialPollTimerId) {
                    // If the callback was canceled within INITIAL_POLL_INTERVAL milliseconds of creation,
                    // there is still a pending call to _doInitialStatusQuery() which must be stopped.
                    window.clearTimeout(m_initialPollTimerId);
                }

                var participantId = notification.get_participantId();
                if (participantId == this._participantId) {
                    this._destroyTimer();
                    this.reset();
                    this._participantId = null;
                }

                common.Debug.traceMethodExited("WebServicesCallbackStatusPanel.processCallbackDisconnectNotification()");
            },

            /**
             * Respond to notification that a Callback was reconnected successfully.
             *
             * @param callbackReconnectNotification An implementation of ICallbackReconnectNotification
             */
            processCallbackReconnectNotification: function (notification) {
                common.Debug.traceMethodEntered("WebServicesCallbackStatusPanel.processCallbackReconnectNotification()");
                common.Interface.ensureImplements(notification, webservices.Interfaces.ICallbackReconnectNotification);

                this._participantId = notification.get_participantId();
                common.Debug.traceNote("WebServicesCallbackStatusPanel.processCallbackReconnectNotification(): participant ID changed to: " + this._participantId);
                this.m_isConnected = true;
                var _self = this;
                m_initialPollTimerId = window.setTimeout(_self._doInitialStatusQuery.bind(_self), this.INITIAL_POLL_INTERVAL);
                this.showCallbackCreationSuccessPanel();
                this.showDisconnectButtonPanel();

                // TODO: Show participantName, telephone, subject, and creationDateTime?

                common.Debug.traceMethodExited("WebServicesCallbackStatusPanel.processCallbackReconnectNotification()");
            },

            /**
             * Respond to notification that an attempt to disconnect a Callback has failed
             * @param notification CallbackDisconnectFailureNotification
             */
            processCallbackDisconnectFailureNotification: function (notification) {
                common.Debug.traceMethodEntered("WebServicesCallbackStatusPanel.processCallbackDisconnectFailureNotification()");
                common.Interface.ensureImplements(notification, webservices.Interfaces.ICallbackDisconnectFailureNotification);
                common.Debug.traceError("WebServicesCallbackDisconnectPanel.processCallbackDisconnectFailureNotification() received error: " + notification.get_error().get_errorCode());

                this.showDisconnectFailurePanel();

                common.Debug.traceMethodExited("WebServicesCallbackStatusPanel.processCallbackDisconnectFailureNotification()");
            },

            /**
             * Respond to notification that a Callback's status has been received
             * @param notification CallbackStatusNotification
             */
            processCallbackStatusNotification: function (notification) {
                common.Debug.traceMethodEntered("WebServicesCallbackStatusPanel.processCallbackStatusNotification()");
                common.Interface.ensureImplements(notification, webservices.Interfaces.ICallbackStatusNotification);

                var webVisitorParticipantId = notification.get_participantId();
                if (webVisitorParticipantId == this._participantId) {
                    var params = new Object();
                    params.assignedAgentName = notification.get_assignedAgentName();
                    params.interactionState = notification.get_interactionState();
                    params.estimatedCallbackTime = notification.get_estimatedCallbackTime();
                    params.queueWaitTime = notification.get_queueWaitTime();
                    params.queuePosition = notification.get_queuePosition();
                    params.queueName = notification.get_queueName();
                    params.longestWaitTime = notification.get_longestWaitTime();
                    params.interactionsWaitingCount = notification.get_interactionsWaitingCount();
                    params.loggedInAgentsCount = notification.get_loggedInAgentsCount();
                    params.availableAgentsCount = notification.get_availableAgentsCount();
                    var indicator = notification.get_statusIndicator();

                    this.showStatus(params);
                    this.setStatusIndicator(indicator);
                }
                common.Debug.traceMethodExited("WebServicesCallbackStatusPanel.processCallbackStatusNotification()");
            },

            /**
             * Respond to notification that an attempt to get a Callback's status has failed
             * @param notification CallbackStatusFailureNotification
             */
            processCallbackStatusFailureNotification: function (notification) {
                common.Debug.traceMethodEntered("WebServicesCallbackStatusPanel.processCallbackStatusFailureNotification()");
                common.Interface.ensureImplements(notification, webservices.Interfaces.ICallbackStatusFailureNotification);

                common.Debug.traceError("WebServicesCallbackStatusPanel.processCallbackStatusFailureNotification() received error: " + notification.get_error().get_errorCode());

                var unknownEntityCode = webservices.ErrorCodes.ERROR + "." +
                    webservices.ErrorCodes.WEBSVC + "." +
                    webservices.ErrorCodes.UNKNOWNENTITY;
                var unknownSessionCode = unknownEntityCode + "." + webservices.ErrorCodes.SESSION;
                if (notification.get_error().get_errorCode() == unknownSessionCode || notification.get_error().get_errorCode() == unknownEntityCode) {
                    // The callback was disconnected
                    this.showDisconnectedPanel();
                    // Quit polling for the callback's status
                    this._destroyTimer();
                    // Make the button just affect the UI, not actually send the disconnect request
                    this.m_isConnected = false;
                } else if (this._participantId) {
                    this.showStatusFailure();
                }
                // else there was a race condition between the status request and the callback being disconnected, so no need to show the status failure message.

                common.Debug.traceMethodExited("WebServicesCallbackStatusPanel.processCallbackStatusFailureNotification()");
            },

            /**
             * Respond to receipt of information (name, photo location) about a party involved in a Callback
             *
             * @param notification
             */
            processPartyInfoNotification: function (notification) {
                common.Debug.traceMethodEntered("WebServicesCallbackStatusPanel.processPartyInfoNotification()");
                common.Interface.ensureImplements(notification, webservices.Interfaces.IPartyInfoNotification);

                if (notification.get_localParticipantId() == this._participantId) {
                    var agentPhoto = notification.get_photo();
                    if (agentPhoto) {
                        this.showAgentPhoto(agentPhoto);
                    }
                    else {
                        this.hideAgentPhoto();
                    }
                }

                common.Debug.traceMethodExited("WebServicesCallbackStatusPanel.processPartyInfoNotification()");
            },

            /**
             * Called when the parent container is shown.
             * Resumes status polling, if appropriate
             */
            parentShown: function () {
                common.Debug.traceMethodEntered("WebServicesCallbackStatusPanel.parentShown()");
                if (this._statusPollTimer && !this._statusPollTimer.isRunning()) {
                    // The timer was stopped by a previous call to parentHidden()
                    this._doInitialStatusQuery();
                }
                common.Debug.traceMethodExited("WebServicesCallbackStatusPanel.parentShown()");
            },

            /**
             * Called when the parent container is hidden.
             * Stops status polling, if appropriate
             */
            parentHidden: function () {
                common.Debug.traceMethodEntered("WebServicesCallbackStatusPanel.parentHidden()");
                if (this._statusPollTimer && this._statusPollTimer.isRunning()) {
                    this._statusPollTimer.stop();
                }
                common.Debug.traceMethodExited("WebServicesCallbackStatusPanel.parentHidden()");
            },

            reset: function () {
                m_isConnected = false;
                ui.CallbackStatusPanel.prototype.reset.call(this);
            },

            // private methods

            /**
             * Query a callback's status, and start a recurring timer to do so again and again.
             */
            _doInitialStatusQuery: function () {
                common.Debug.traceMethodEntered("WebServicesCallbackStatusPanel._doInitialStatusQuery()");
                m_initialPollTimerId = null;
                if (this._isStatusSupported()) {
                    this._createAndStartTimer();

                    this.queryStatus();
                }
                else {
                    common.Debug.traceNote("WebServicesCallbackStatusPanel._doInitialStatusQuery(): QueryStatus capability not supported by server");
                }

                common.Debug.traceMethodExited("WebServicesCallbackStatusPanel._doInitialStatusQuery()");
            },

            _createAndStartTimer: function () {
                common.Debug.traceMethodEntered("WebServicesCallbackStatusPanel._createAndStartTimer()");
                if (this._isStatusSupported()) // Should be redundant since only called from within an identical if block
                {
                    this._destroyTimer(); // If we were previously polling for a different callback's status, quit.
                    var _self = this;
                    this._statusPollTimer = new webservices.RecurringTimer(this.SUBSEQUENT_POLL_INTERVAL);
                    this._statusPollTimer.registerSuccessListener(function () { _self.onStatusPollTimer(); });
                    this._statusPollTimer.start();
                }
                else {
                    common.Debug.traceNote("WebServicesCallbackStatusPanel._createAndStartTimer(): QueryStatus capability not supported by server");
                }
                common.Debug.traceMethodExited("WebServicesCallbackStatusPanel._createAndStartTimer()");
            },

            _destroyTimer: function () {
                common.Debug.traceMethodEntered("WebServicesCallbackStatusPanel._destroyTimer()");
                if (this._statusPollTimer) {
                    if (this._statusPollTimer.isRunning()) {
                        this._statusPollTimer.stop();
                    }
                    this._statusPollTimer.destroy();
                    delete this._statusPollTimer;
                    this._statusPollTimer = null;
                }
                common.Debug.traceMethodExited("WebServicesCallbackStatusPanel._destroyTimer()");
            }
        });
    /**
     * CallbackContainerPanel class
     * This panel contains the panels in which the user creates Callbacks and manages previously-created Callbacks.
     */
    ui.CallbackContainerPanel = Class.create(ui.Control,
        {
            /**
             * constructor
             *
             * @param callbackManager An instance of a subclass of webservices.CallbackManagerBase
             * @param registerFormContainer The Panel that contains the registration form.  Must have a showRegisterForm() method.
             * @param callbackParameters An instance of CallbackParameters
             * @param requiredFields Optional parameter.  An array of FormFieldTypes, indicating which fields are required on the callback request form.
             */
            initialize: function ($super, callbackManager, registerFormContainer, callbackParameters, requiredFields) {
                this._callbackManager = callbackManager;

                var domObject = this._buildDomObject(registerFormContainer, callbackParameters, requiredFields);
                this._validateDomObject();

                $super(domObject);

                this.addImplementedInterface(webservices.Interfaces.ICallbackCreationNotificationObserver, webservices);
                webservices.NotificationRegistry.registerObserver(this, webservices.Interfaces.ICallbackCreationNotification);

                if (webservices.CapabilityRepository.isDisconnectCallbackCapabilityEnabled()) {
                    this.addImplementedInterface(webservices.Interfaces.ICallbackDisconnectNotificationObserver, webservices);
                    webservices.NotificationRegistry.registerObserver(this, webservices.Interfaces.ICallbackDisconnectNotification);
                }
            },

            /**
             * destructor
             */
            destroy: function () {
                ui.Control.prototype.destroy.call(this);
            },

            // methods

            /**
             * Determines which form field should get focus when the overall form does.
             */
            focus: function () {
                if (this._loginFormPanel && this._loginFormPanel.isVisible()) {
                    this._loginFormPanel.focus();
                }
                else if (this._statusPanel && this._statusPanel.isVisible()) {
                    this._statusPanel.focus();
                }
            },


            /**
             * Clears the fields of the panel.
             */
            reset: function () {
                if (this._loginFormPanel && this._loginFormPanel.isVisible()) {
                    this._loginFormPanel.reset();
                }
                else if (this._statusPanel && this._statusPanel.isVisible()) {
                    this._statusPanel.reset();
                }
            },

            /**
             * Extends Control.show() to tell status panel to resume polling if necessary
             */
            show: function () {
                ui.Control.prototype.show.call(this);
                if (this._statusPanel) {
                    this._statusPanel.parentShown();
                }
            },

            /**
             * Extends Control.hide() to tell status panel to pause polling if necessary
             */
            hide: function () {
                ui.Control.prototype.hide.call(this);
                if (this._statusPanel) {
                    this._statusPanel.parentHidden();
                }
            },

            /**
             * Respond to notification that a Callback was created successfully.
             *
             * @param callbackCreationNotification Contents ignored, may possibly be used in the future.
             */
            processCallbackCreationNotification: function (notification) {
                common.Interface.ensureImplements(notification, webservices.Interfaces.ICallbackCreationNotification);
                this._loginFormPanel.hide();
                this._statusPanel.show();
                this._loginFormPanel.clearStatus();
                this._statusPanel.focus();
            },

            /**
             * Respond to notification that a Callback has been disconnected
             * @param notification CallbackDisconnectNotification
             */
            processCallbackDisconnectNotification: function (notification) {
                common.Interface.ensureImplements(notification, webservices.Interfaces.ICallbackDisconnectNotification);
                this._loginFormPanel.reset();
                this._statusPanel.hide();
                this._loginFormPanel.show();
                this._loginFormPanel.focus();
                this._statusPanel.reset();
            },

            // private methods

            _buildDomObject: function (registerFormContainer, callbackParameters, requiredFields) {
                this._panelContainerDiv = this.createElement('div', 'iwt-callback-container-panel');
                this._addPanels(registerFormContainer, callbackParameters, requiredFields);
                return this._panelContainerDiv;
            },

            _addPanels: function (registerFormContainer, callbackParameters, requiredFields) {
                var panel = new ui.CallbackLoginFormPanel(this._callbackManager, registerFormContainer, callbackParameters, requiredFields);
                this._panelContainerDiv.appendChild(panel.get_domObject());
                this._loginFormPanel = panel;

                // Note: depending on which capabilities are enabled, this panel may contain nothing more
                // than the message that the Callback was created successfully.
                var panel = new ui.WebServicesCallbackStatusPanel(this._callbackManager);
                panel.hide();
                this._panelContainerDiv.appendChild(panel.get_domObject());
                this._statusPanel = panel;
            },

            _validateDomObject: function () {
                if (!this._statusPanel) {
                    throw common.ExceptionFactory.createException("CallbackContainerPanel not built properly!");
                }
            }
        });
    /**
     * ChatLoginFormPanel class
     * Implements the panel in which the user types their name (and perhaps password) to begin a chat.
     */
    ui.ChatLoginFormPanel = Class.create(ui.LoginFormPanelBase,
        {
            /**
             * constructor
             *
             * @param chatManager An instance of a subclass of webservices.ChatManagerBase
             * @param registerFormContainer The Panel that contains the registration form.  Must have
             * @param chatParameters An instance of ChatParameters
             * @param requiredFields An array of FormFieldTypes, indicating which fields are required on this form. Optional.
             */
            initialize: function ($super, chatManager, registerFormContainer, chatParameters, requiredFields) {
                var allowedAccessTypes = this.AUTHENTICATION_NONE;
                if (webservices.CapabilityRepository.isChatTrackerAuthenticationCapabilityEnabled()) {
                    allowedAccessTypes |= this.AUTHENTICATION_TRACKER;
                }
                if (webservices.CapabilityRepository.isChatAnonymousAuthenticationCapabilityEnabled()) {
                    allowedAccessTypes |= this.AUTHENTICATION_ANONYMOUS;
                }

                $super(registerFormContainer, localization.StartChatButton, 'iwt-chat-form-panel', allowedAccessTypes, requiredFields);

                this._chatParameters = chatParameters;
                this._chatManager = chatManager;

                this.addImplementedInterface(webservices.Interfaces.IChatCreationFailureNotificationObserver, webservices);
                webservices.NotificationRegistry.registerObserver(this, webservices.Interfaces.IChatCreationFailureNotification);
            },

            /**
             * destructor
             */
            destroy: function () {
                this._chatManager = null;

                ui.LoginFormPanelBase.prototype.destroy.call(this);
            },

            // methods

            /**
             * Clears the fields of the login form.
             */
            reset: function () {
                ui.LoginFormPanelBase.prototype.reset.call(this);
            },

            /**
             * Respond to notification that an attempt to create a Chat has failed.
             *
             * @param chatCreationFailureNotification Contains an error indicating the reason for the failure.
             * @see _createChat()
             * @see ChatManager.login()
             */
            processChatCreationFailureNotification: function (chatCreationFailureNotification) {
                var error = chatCreationFailureNotification.get_error();
                var text = ui.ErrorDisplayTextBuilder.build(error, localization.LoginFailed);
                this.setErrorStatus(text);
                this.clearBusy();
                this.enableSubmitButton(true);
            },

            _buildExtraFormFields: function () {
                // overload this in a derived class if you need to add extra form fields
                var div = this.createElement('div', null, { 'class': 'iwt-account-indented-panel' });

                if (!webservices.CapabilityRepository.isTranscriptCapabilityEnabled()) {
                    return div;
                }

                // eMail Transcript checkbox div
                var emailTranscriptDiv = this.createChildElement(div, 'div', null, { 'class': 'iwt-form-field-div' });
                var columnSpecDiv = this.createChildElement(emailTranscriptDiv, 'div', null, { 'class': 'iwt-form-field-no-label' });
                var checkboxDiv = this.createChildElement(columnSpecDiv, 'div', null, { 'class': 'iwt-checkbox' });
                var label = this.createChildElement(checkboxDiv, 'label', null, { 'class': 'iwt-radio-button-checkbox-label iwt-chat-form-panel-transcript-option-label', 'for': 'iwt-chat-form-panel-transcript-option' }, null, localization.TranscriptLabel);
                this._transcriptOptionCheckBox = this.createChildElement(label, 'input', 'iwt-chat-form-panel-transcript-option', { 'type': 'checkbox', 'class': 'iwt-checkbox', 'name': 'iwt-chat-form-panel-transcript-option' });
                Element.observe(this._transcriptOptionCheckBox, 'click', this._onClickTranscriptOption.bindAsEventListener(this));

                // e-Mail Address div
                this._emailDiv = this.createChildElement(div, 'div', null, { 'class': 'iwt-form-field-div' });
                this.createChildElement(this._emailDiv, 'label', null, { 'class': 'iwt-form-label', 'for': 'iwt-chat-form-panel-email-address' }, null, localization.TranscriptEmailLabel);
                var maximumFieldLengths = webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths);
                var childDiv = this.createChildElement(this._emailDiv, 'div', null, { 'class': 'iwt-textbox-container' });
                this._emailTextBox = this.createChildElement(childDiv, 'input', 'iwt-chat-form-panel-email-address', { 'type': 'email', 'class': 'iwt-textbox', 'maxlength': maximumFieldLengths.get_emailMaximumLength(), 'name': 'iwt-chat-form-panel-email-address' });
                this._addErrorDiv(this._emailDiv);

                Element.hide(this._emailDiv);

                return div;
            },

            // private methods

            _onClickTranscriptOption: function () {
                if (this._transcriptOptionCheckBox.checked) {
                    Element.show(this._emailDiv);
                    this._emailTextBox.focus();
                    this.addRequiredField(ui.FormFieldTypes.TranscriptEmail, this._emailTextBox);
                }
                else {
                    Element.hide(this._emailDiv);
                    this.removeRequiredField(ui.FormFieldTypes.TranscriptEmail, this._emailTextBox);
                }
            },

            _doHtml5FormValidation: function () {
                return $j('#iwt-chat-form-panel form').get(0).checkValidity();
            },

            _doNonHtml5FormValidation: function () {
                var numErrors = 0;
                if (this._isAuthenticatedRadioClicked()) {
                    numErrors += this._validateField(this._authenticatedIdentifierTextBox, ui.FormFieldTypes.Username);
                    numErrors += this._validateField(this._authenticatedCredentialsTextBox, ui.FormFieldTypes.Password);
                }

                var transcriptRequired = false;
                if (webservices.CapabilityRepository.isTranscriptCapabilityEnabled()) {
                    transcriptRequired = this._transcriptOptionCheckBox.checked;
                    if (transcriptRequired) {
                        var oldNumErrors = numErrors;
                        numErrors += this._validateField(this._emailTextBox, ui.FormFieldTypes.TranscriptEmail);

                        if (numErrors == oldNumErrors) {
                            var email = this._getValueIfAvailable(this._emailTextBox);
                            var index = email.lastIndexOf("@");
                            if (index == -1 || index == 0 || index == email.length - 1) {
                                this._showFieldError(this._emailTextBox, localization.InvalidEmail);
                                ++numErrors;
                            }
                            else {
                                this._hideFieldError(this._emailTextBox);
                            }
                        }
                    }
                }

                // if errors are present, show the status and return
                if (numErrors > 0) {
                    if (numErrors == 1) {
                        this.setErrorStatus(localization.OneErrorWithChatData);
                    }
                    else {
                        this.setErrorStatus(localization.MultipleErrorsWithChatData.replace('%0', numErrors));
                    }

                    this.enableSubmitButton(true);
                    return false;
                }
                return true;
            },

            /**
             * Called when the user clicks the "Start Chat" button, and the form fields have been validated.
             * Marshalls values, then passes control to _createChat().
             */
            _onValidatedSubmit: function () {
                this.setBusy();
                var transcriptRequired = false;
                if (webservices.CapabilityRepository.isTranscriptCapabilityEnabled()) {
                    transcriptRequired = this._transcriptOptionCheckBox.checked;
                }
                this._chatParameters.set_transcriptOption(transcriptRequired);

                var email = this._getValueIfAvailable(this._emailTextBox);
                this._chatParameters.set_transcriptEmailAddress(email);

                if (this._isAuthenticatedRadioClicked()) {
                    var username = this._getValueIfAvailable(this._authenticatedIdentifierTextBox);
                    this._chatParameters.set_participantName(username);

                    var password = this._getValueIfAvailable(this._authenticatedCredentialsTextBox);
                    this._chatParameters.set_participantCredentials(password);
                }
                else {
                    var name = this._getValueIfAvailable(this._anonymousIdentifierTextBox);
                    if (!name) {
                        name = localization.AnonymousUser;
                    }
                    this._chatParameters.set_participantName(name);
                    this._chatParameters.set_participantCredentials(null);
                }
                this._createChat();
            },

            /**
             * Begins a chat.
             */
            _createChat: function () {
                try {
                    this._chatManager.login(this._chatParameters);
                }
                catch (ex) {
                    this.clearBusy();
                    common.Debug.traceError("Caught unhandled exception:\n" + ex);
                    common.Debug.alert("Caught unhandled exception:\n" + ex);
                    webservices.ProblemReporter.sendProblemReport(ex, "ChatLoginFormPanel._createChat()");
                }
            }
        });
    /**
     * RegistrationFormPanel class
     * This is the panel that is shown when the user clicks "Register New Account".  It allows them
     * to create an account within tracker, that may then be used to create authenticated chats and/or callbacks.
     *
     * Do not instantiate this class directly.  Use
     * webservices.CustomizationFactoryRegistry.create_instance(webservices.CustomizableFactoryTypes.RegistrationFormPanel, args)
     * args shall be a JSON object with the following properties:
     * registrationManager: An instance of a class derived from RegistrationManagerBase.
     * registerFormContainer: The Panel that contains this registration form.  Must have a showRegisterForm() method.
     * registrationCallback: The function to call once the registration attempt is complete (if it succeeds).  May be null.
     * form: An existing form to add the registration formfields to.  May be null, in which case a new form will be created.
     */
    ui._Internal._DefaultRegistrationFormPanel = Class.create(ui.FormPanelBase,
        {
            /**
             * Constructor
             *
             * @param args A Javascript object with the following members:
             * registrationManager An instance of a class derived from RegistrationManagerBase.
             * registerFormContainer The Panel that contains this registration form.  Must have a showRegisterForm() method.
             * registrationCallback The function to call once the registration attempt is complete (if it succeeds).  May be null.
             * form An existing form to add the registration formfields to.  May be null, in which case a new form will be created.
             */
            initialize: function ($super, args) {
                if (args.form) {
                    this._form = args.form;
                }
                else {
                    this._form = this.createDefaultForm();
                }

                $super(args.registerFormContainer, localization.Register, 'iwt-register-form-panel');

                this._registrationManager = args.registrationManager;
                this._externalRegistrationCallback = args.registrationCallback;
            },

            /**
             * Destructor
             */
            destroy: function () {
                this._registrationManager = null;

                ui.FormPanelBase.prototype.destroy.call(this);
            },

            // public methods

            /**
             * Called when this form receives focus.  Does some UI alignment, and delegates focus to the top field in the form.
             */
            focus: function () {
                // username textbox should always be here, but just in case
                if (this._authenticatedIdentifierTextBox) {
                    try {
                        this._authenticatedIdentifierTextBox.focus();
                    } catch (e) {
                        common.Debug.traceWarning('Could not focus the correct textbox.');
                    }
                }
            },

            /**
             * Resets the form to its original state.
             */
            reset: function () {
                ui.FormPanelBase.prototype.reset.call(this);
                this._clearTextboxIfAvailable(this._authenticatedIdentifierTextBox);
                this._clearTextboxIfAvailable(this._authenticatedCredentialsTextBox);
                this._clearTextboxIfAvailable(this._confirmPasswordTextBox);
                this._clearTextboxIfAvailable(this._firstNameTextBox);
                this._clearTextboxIfAvailable(this._middleNameTextBox);
                this._clearTextboxIfAvailable(this._lastNameTextBox);
                this._clearTextboxIfAvailable(this._departmentTextBox);
                this._clearTextboxIfAvailable(this._companyTextBox);
                this._clearTextboxIfAvailable(this._jobTitleTextBox);
                this._clearTextboxIfAvailable(this._assistantNameTextBox);
                this._clearTextboxIfAvailable(this._homeStreetAddressTextBox);
                this._clearTextboxIfAvailable(this._homeCityTextBox);
                this._clearTextboxIfAvailable(this._homeStateTextBox);
                this._clearTextboxIfAvailable(this._homePostalCodeTextBox);
                this._clearTextboxIfAvailable(this._homeCountryTextBox);
                this._clearTextboxIfAvailable(this._homeEmailTextBox);
                this._clearTextboxIfAvailable(this._homePhoneTextBox);
                this._clearTextboxIfAvailable(this._homePhone2TextBox);
                this._clearTextboxIfAvailable(this._homeFaxTextBox);
                this._clearTextboxIfAvailable(this._homePagerTextBox);
                this._clearTextboxIfAvailable(this._homeMobileTextBox);
                this._clearTextboxIfAvailable(this._homeUrlTextBox);
                this._clearTextboxIfAvailable(this._businessStreetAddressTextBox);
                this._clearTextboxIfAvailable(this._businessCityTextBox);
                this._clearTextboxIfAvailable(this._businessStateTextBox);
                this._clearTextboxIfAvailable(this._businessPostalCodeTextBox);
                this._clearTextboxIfAvailable(this._businessCountryTextBox);
                this._clearTextboxIfAvailable(this._businessEmailTextBox);
                this._clearTextboxIfAvailable(this._businessPhoneTextBox);
                this._clearTextboxIfAvailable(this._businessPhone2TextBox);
                this._clearTextboxIfAvailable(this._businessFaxTextBox);
                this._clearTextboxIfAvailable(this._businessPagerTextBox);
                this._clearTextboxIfAvailable(this._businessMobileTextBox);
                this._clearTextboxIfAvailable(this._businessUrlTextBox);
                this._clearTextboxIfAvailable(this._assistantPhoneTextBox);
                this._clearTextboxIfAvailable(this._remarksTextBox);
                this.enableFormFields();
            },

            createDefaultForm: function () {
                common.Debug.traceMethodEntered("RegistrationFormPanel.createDefaultForm()");
                var section = new ui.FormSection(localization.Account)
                    .addFieldByFieldType(ui.FormFieldTypes.Username)
                    .addFieldByFieldType(ui.FormFieldTypes.Password)
                    .addFieldByFieldType(ui.FormFieldTypes.ConfirmPassword);
                frm = new ui.Form([section]);

                common.Debug.traceMethodExited("RegistrationFormPanel.createDefaultForm()");
                return frm;
            },

            enableFormFields: function () {
                this._enableElement(this._authenticatedIdentifierTextBox);
                this._enableElement(this._authenticatedCredentialsTextBox);
                this._enableElement(this._confirmPasswordTextBox);
                this._enableElement(this._firstNameTextBox);
                this._enableElement(this._middleNameTextBox);
                this._enableElement(this._lastNameTextBox);
                this._enableElement(this._departmentTextBox);
                this._enableElement(this._companyTextBox);
                this._enableElement(this._jobTitleTextBox);
                this._enableElement(this._assistantNameTextBox);
                this._enableElement(this._homeStreetAddressTextBox);
                this._enableElement(this._homeCityTextBox);
                this._enableElement(this._homeStateTextBox);
                this._enableElement(this._homePostalCodeTextBox);
                this._enableElement(this._homeCountryTextBox);
                this._enableElement(this._homeEmailTextBox);
                this._enableElement(this._homePhoneTextBox);
                this._enableElement(this._homePhone2TextBox);
                this._enableElement(this._homeFaxTextBox);
                this._enableElement(this._homePagerTextBox);
                this._enableElement(this._homeMobileTextBox);
                this._enableElement(this._homeUrlTextBox);
                this._enableElement(this._businessStreetAddressTextBox);
                this._enableElement(this._businessCityTextBox);
                this._enableElement(this._businessStateTextBox);
                this._enableElement(this._businessPostalCodeTextBox);
                this._enableElement(this._businessCountryTextBox);
                this._enableElement(this._businessEmailTextBox);
                this._enableElement(this._businessPhoneTextBox);
                this._enableElement(this._businessPhone2TextBox);
                this._enableElement(this._businessFaxTextBox);
                this._enableElement(this._businessPagerTextBox);
                this._enableElement(this._businessMobileTextBox);
                this._enableElement(this._businessUrlTextBox);
                this._enableElement(this._assistantPhoneTextBox);
                this._enableElement(this._remarksTextBox);
            },

            disableFormFields: function () {
                this._disableElement(this._authenticatedIdentifierTextBox);
                this._disableElement(this._authenticatedCredentialsTextBox);
                this._disableElement(this._confirmPasswordTextBox);
                this._disableElement(this._firstNameTextBox);
                this._disableElement(this._middleNameTextBox);
                this._disableElement(this._lastNameTextBox);
                this._disableElement(this._departmentTextBox);
                this._disableElement(this._companyTextBox);
                this._disableElement(this._jobTitleTextBox);
                this._disableElement(this._assistantNameTextBox);
                this._disableElement(this._homeStreetAddressTextBox);
                this._disableElement(this._homeCityTextBox);
                this._disableElement(this._homeStateTextBox);
                this._disableElement(this._homePostalCodeTextBox);
                this._disableElement(this._homeCountryTextBox);
                this._disableElement(this._homeEmailTextBox);
                this._disableElement(this._homePhoneTextBox);
                this._disableElement(this._homePhone2TextBox);
                this._disableElement(this._homeFaxTextBox);
                this._disableElement(this._homePagerTextBox);
                this._disableElement(this._homeMobileTextBox);
                this._disableElement(this._homeUrlTextBox);
                this._disableElement(this._businessStreetAddressTextBox);
                this._disableElement(this._businessCityTextBox);
                this._disableElement(this._businessStateTextBox);
                this._disableElement(this._businessPostalCodeTextBox);
                this._disableElement(this._businessCountryTextBox);
                this._disableElement(this._businessEmailTextBox);
                this._disableElement(this._businessPhoneTextBox);
                this._disableElement(this._businessPhone2TextBox);
                this._disableElement(this._businessFaxTextBox);
                this._disableElement(this._businessPagerTextBox);
                this._disableElement(this._businessMobileTextBox);
                this._disableElement(this._businessUrlTextBox);
                this._disableElement(this._assistantPhoneTextBox);
                this._disableElement(this._remarksTextBox);
            },

            // private methods

            _buildInnerPanel: function (prefix) {
                var container = this.createElement('div', null, { 'class': 'iwt-form-container' });
                var sections = this._form.get_sections();
                for (var i = 0; i < sections.length; ++i) {
                    var section = sections[i];
                    if (section.get_name()) {
                        container.appendChild(this._buildSectionHeader(section.get_name()));
                    }

                    var sectionFields = section.get_fields();
                    if (sectionFields) {
                        for (var j = 0; j < sectionFields.length; ++j) {
                            var field = sectionFields[j];
                            container.appendChild(this._buildFieldDiv(field));
                        }
                    }
                }

                this._buttonPanel = this._buildButtonPanel();
                container.appendChild(this._buttonPanel);

                this.addRequiredField(ui.FormFieldTypes.Username, this._authenticatedIdentifierTextBox);
                this.addRequiredField(ui.FormFieldTypes.Password, this._authenticatedCredentialsTextBox);
                this.addRequiredField(ui.FormFieldTypes.ConfirmPassword, this._confirmPasswordTextBox);

                return container;
            },

            _buildSectionHeader: function (text) {
                var div = this.createElement('div', null, { 'class': 'iwt-form-section-header' });
                this.createChildElement(div, 'h2', null, null, null, text);
                return div;
            },

            _buildFieldDiv: function (field) {
                var type = field.get_type();

                if (type == ui.FormFieldTypes.Username) { return this._buildUserNameFieldDiv(); }
                if (type == ui.FormFieldTypes.Password) { return this._buildPasswordFieldDiv(); }
                if (type == ui.FormFieldTypes.ConfirmPassword) { return this._buildConfirmPasswordFieldDiv(); }

                if (type == ui.FormFieldTypes.FirstName) { return this._buildFirstNameFieldDiv(); }
                if (type == ui.FormFieldTypes.MiddleName) { return this._buildMiddleNameFieldDiv(); }
                if (type == ui.FormFieldTypes.LastName) { return this._buildLastNameFieldDiv(); }

                if (type == ui.FormFieldTypes.HomeStreetAddress) { return this._buildHomeStreetAddressFieldDiv(); }
                if (type == ui.FormFieldTypes.HomeCity) { return this._buildHomeCityFieldDiv(); }
                if (type == ui.FormFieldTypes.HomeState) { return this._buildHomeStateFieldDiv(); }
                if (type == ui.FormFieldTypes.HomePostalCode) { return this._buildHomePostalCodeFieldDiv(); }
                if (type == ui.FormFieldTypes.HomeCountry) { return this._buildHomeCountryFieldDiv(); }
                if (type == ui.FormFieldTypes.HomeEmail) { return this._buildHomeEmailFieldDiv(); }
                if (type == ui.FormFieldTypes.HomePhone) { return this._buildHomePhoneFieldDiv(); }
                if (type == ui.FormFieldTypes.HomePhone2) { return this._buildHomePhone2FieldDiv(); }
                if (type == ui.FormFieldTypes.HomeFax) { return this._buildHomeFaxFieldDiv(); }
                if (type == ui.FormFieldTypes.HomePager) { return this._buildHomePagerFieldDiv(); }
                if (type == ui.FormFieldTypes.HomeMobile) { return this._buildHomeMobileFieldDiv(); }
                if (type == ui.FormFieldTypes.HomeUrl) { return this._buildHomeUrlFieldDiv(); }

                if (type == ui.FormFieldTypes.Department) { return this._buildDepartmentFieldDiv(); }
                if (type == ui.FormFieldTypes.Company) { return this._buildCompanyFieldDiv(); }
                if (type == ui.FormFieldTypes.JobTitle) { return this._buildJobTitleFieldDiv(); }
                if (type == ui.FormFieldTypes.AssistantName) { return this._buildAssistantNameFieldDiv(); }
                if (type == ui.FormFieldTypes.AssistantPhone) { return this._buildAssistantPhoneFieldDiv(); }
                if (type == ui.FormFieldTypes.BusinessStreetAddress) { return this._buildBusinessStreetAddressFieldDiv(); }
                if (type == ui.FormFieldTypes.BusinessCity) { return this._buildBusinessCityFieldDiv(); }
                if (type == ui.FormFieldTypes.BusinessState) { return this._buildBusinessStateFieldDiv(); }
                if (type == ui.FormFieldTypes.BusinessPostalCode) { return this._buildBusinessPostalCodeFieldDiv(); }
                if (type == ui.FormFieldTypes.BusinessCountry) { return this._buildBusinessCountryFieldDiv(); }
                if (type == ui.FormFieldTypes.BusinessEmail) { return this._buildBusinessEmailFieldDiv(); }
                if (type == ui.FormFieldTypes.BusinessPhone) { return this._buildBusinessPhoneFieldDiv(); }
                if (type == ui.FormFieldTypes.BusinessPhone2) { return this._buildBusinessPhone2FieldDiv(); }
                if (type == ui.FormFieldTypes.BusinessFax) { return this._buildBusinessFaxFieldDiv(); }
                if (type == ui.FormFieldTypes.BusinessPager) { return this._buildBusinessPagerFieldDiv(); }
                if (type == ui.FormFieldTypes.BusinessMobile) { return this._buildBusinessMobileFieldDiv(); }
                if (type == ui.FormFieldTypes.BusinessUrl) { return this._buildBusinessUrlFieldDiv(); }

                if (type == ui.FormFieldTypes.Remarks) { return this._buildRemarksFieldDiv(); }

                throw common.ExceptionFactory.createException(field + ' (type=' + type + ') is not a known field');
            },

            _buildUserNameFieldDiv: function () {
                var results = this._buildLabeledTextBoxFieldDiv('UserName', webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths).get_usernameMaximumLength());
                this._authenticatedIdentifierTextBox = results.textBox;
                return results.div;
            },

            _buildPasswordFieldDiv: function () {
                var results = this._buildLabeledPasswordTextBoxFieldDiv('Password');
                this._authenticatedCredentialsTextBox = results.textBox;
                return results.div;
            },

            _buildConfirmPasswordFieldDiv: function () {
                var results = this._buildLabeledPasswordTextBoxFieldDiv('ConfirmPassword');
                this._confirmPasswordTextBox = results.textBox;
                return results.div;
            },

            _buildFirstNameFieldDiv: function () {
                var results = this._buildLabeledTextBoxFieldDiv('firstName', webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths).get_firstNameMaximumLength());
                this._firstNameTextBox = results.textBox;
                return results.div;
            },

            _buildMiddleNameFieldDiv: function () {
                var results = this._buildLabeledTextBoxFieldDiv('middleName', webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths).get_middleNameMaximumLength());
                this._middleNameTextBox = results.textBox;
                return results.div;
            },

            _buildLastNameFieldDiv: function () {
                var results = this._buildLabeledTextBoxFieldDiv('lastName', webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths).get_lastNameMaximumLength());
                this._lastNameTextBox = results.textBox;
                return results.div;
            },

            _buildDepartmentFieldDiv: function () {
                var results = this._buildLabeledTextBoxFieldDiv('department', webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths).get_departmentMaximumLength());
                this._departmentTextBox = results.textBox;
                return results.div;
            },

            _buildCompanyFieldDiv: function () {
                var results = this._buildLabeledTextBoxFieldDiv('company', webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths).get_companyMaximumLength());
                this._companyTextBox = results.textBox;
                return results.div;
            },

            _buildJobTitleFieldDiv: function () {
                var results = this._buildLabeledTextBoxFieldDiv('jobTitle', webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths).get_jobTitleMaximumLength());
                this._jobTitleTextBox = results.textBox;
                return results.div;
            },

            _buildAssistantNameFieldDiv: function () {
                var results = this._buildLabeledTextBoxFieldDiv('assistantName', webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths).get_nameMaximumLength());
                this._assistantNameTextBox = results.textBox;
                return results.div;
            },

            _buildHomeStreetAddressFieldDiv: function () {
                var results = this._buildLabeledTextBoxFieldDiv('homeStreetAddress', webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths).get_addressMaximumLength());
                this._homeStreetAddressTextBox = results.textBox;
                return results.div;
            },

            _buildHomeCityFieldDiv: function () {
                var results = this._buildLabeledTextBoxFieldDiv('homeCity', webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths).get_cityMaximumLength());
                this._homeCityTextBox = results.textBox;
                return results.div;
            },

            _buildHomeStateFieldDiv: function () {
                var results = this._buildLabeledTextBoxFieldDiv('homeState', webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths).get_stateMaximumLength());
                this._homeStateTextBox = results.textBox;
                return results.div;
            },

            _buildHomePostalCodeFieldDiv: function () {
                var results = this._buildLabeledTextBoxFieldDiv('homePostalCode', webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths).get_postalCodeMaximumLength());
                this._homePostalCodeTextBox = results.textBox;
                return results.div;
            },

            _buildHomeCountryFieldDiv: function () {
                var results = this._buildLabeledTextBoxFieldDiv('homeCountry', webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths).get_countryMaximumLength());
                this._homeCountryTextBox = results.textBox;
                return results.div;
            },

            _buildHomeEmailFieldDiv: function () {
                var results = this._buildLabeledEmailBoxFieldDiv('homeEmail', webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths).get_emailMaximumLength());
                this._homeEmailTextBox = results.textBox;
                return results.div;
            },

            _buildHomePhoneFieldDiv: function () {
                var results = this._buildLabeledTelephoneBoxFieldDiv('homePhone', webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths).get_telephoneMaximumLength());
                this._homePhoneTextBox = results.textBox;
                return results.div;
            },

            _buildHomePhone2FieldDiv: function () {
                var results = this._buildLabeledTelephoneBoxFieldDiv('homePhone2', webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths).get_telephoneMaximumLength());
                this._homePhone2TextBox = results.textBox;
                return results.div;
            },

            _buildHomeFaxFieldDiv: function () {
                var results = this._buildLabeledTelephoneBoxFieldDiv('homeFax', webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths).get_telephoneMaximumLength());
                this._homeFaxTextBox = results.textBox;
                return results.div;
            },

            _buildHomePagerFieldDiv: function () {
                var results = this._buildLabeledTelephoneBoxFieldDiv('homePager', webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths).get_telephoneMaximumLength());
                this._homePagerTextBox = results.textBox;
                return results.div;
            },

            _buildHomeMobileFieldDiv: function () {
                var results = this._buildLabeledTelephoneBoxFieldDiv('homeMobile', webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths).get_telephoneMaximumLength());
                this._homeMobileTextBox = results.textBox;
                return results.div;
            },

            _buildHomeUrlFieldDiv: function () {
                var results = this._buildLabeledUrlBoxFieldDiv('homeUrl', webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths).get_urlMaximumLength());
                this._homeUrlTextBox = results.textBox;
                return results.div;
            },

            _buildBusinessStreetAddressFieldDiv: function () {
                var results = this._buildLabeledTextBoxFieldDiv('businessStreetAddress', webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths).get_addressMaximumLength());
                this._businessStreetAddressTextBox = results.textBox;
                return results.div;
            },

            _buildBusinessCityFieldDiv: function () {
                var results = this._buildLabeledTextBoxFieldDiv('businessCity', webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths).get_cityMaximumLength());
                this._businessCityTextBox = results.textBox;
                return results.div;
            },

            _buildBusinessStateFieldDiv: function () {
                var results = this._buildLabeledTextBoxFieldDiv('businessState', webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths).get_stateMaximumLength());
                this._businessStateTextBox = results.textBox;
                return results.div;
            },

            _buildBusinessPostalCodeFieldDiv: function () {
                var results = this._buildLabeledTextBoxFieldDiv('businessPostalCode', webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths).get_postalCodeMaximumLength());
                this._businessPostalCodeTextBox = results.textBox;
                return results.div;
            },

            _buildBusinessCountryFieldDiv: function () {
                var results = this._buildLabeledTextBoxFieldDiv('businessCountry', webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths).get_countryMaximumLength());
                this._businessCountryTextBox = results.textBox;
                return results.div;
            },

            _buildBusinessEmailFieldDiv: function () {
                var results = this._buildLabeledEmailBoxFieldDiv('businessEmail', webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths).get_emailMaximumLength());
                this._businessEmailTextBox = results.textBox;
                return results.div;
            },

            _buildBusinessPhoneFieldDiv: function () {
                var results = this._buildLabeledTelephoneBoxFieldDiv('businessPhone', webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths).get_telephoneMaximumLength());
                this._businessPhoneTextBox = results.textBox;
                return results.div;
            },

            _buildBusinessPhone2FieldDiv: function () {
                var results = this._buildLabeledTelephoneBoxFieldDiv('businessPhone2', webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths).get_telephoneMaximumLength());
                this._businessPhone2TextBox = results.textBox;
                return results.div;
            },

            _buildBusinessFaxFieldDiv: function () {
                var results = this._buildLabeledTelephoneBoxFieldDiv('businessFax', webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths).get_telephoneMaximumLength());
                this._businessFaxTextBox = results.textBox;
                return results.div;
            },

            _buildBusinessPagerFieldDiv: function () {
                var results = this._buildLabeledTelephoneBoxFieldDiv('businessPager', webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths).get_telephoneMaximumLength());
                this._businessPagerTextBox = results.textBox;
                return results.div;
            },

            _buildBusinessMobileFieldDiv: function () {
                var results = this._buildLabeledTelephoneBoxFieldDiv('businessMobile', webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths).get_telephoneMaximumLength());
                this._businessMobileTextBox = results.textBox;
                return results.div;
            },

            _buildBusinessUrlFieldDiv: function () {
                var results = this._buildLabeledUrlBoxFieldDiv('businessUrl', webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths).get_urlMaximumLength());
                this._businessUrlTextBox = results.textBox;
                return results.div;
            },

            _buildAssistantPhoneFieldDiv: function () {
                var results = this._buildLabeledTelephoneBoxFieldDiv('assistantPhone', webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths).get_telephoneMaximumLength());
                this._assistantPhoneTextBox = results.textBox;
                return results.div;
            },

            _buildRemarksFieldDiv: function () {
                var results = this._buildLabeledTextBoxFieldDiv('remarks', webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths).get_remarksMaximumLength());
                this._remarksTextBox = results.textBox;
                return results.div;
            },

            _buildLabeledPasswordTextBoxFieldDiv: function (id) {
                return this._buildLabeledInputFieldDiv(id, 'password', webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths).get_passwordMaximumLength());
            },

            _buildLabeledTextBoxFieldDiv: function (id, maxLength) {
                return this._buildLabeledInputFieldDiv(id, 'text', maxLength);
            },

            _buildLabeledEmailBoxFieldDiv: function (id, maxLength) {
                return this._buildLabeledInputFieldDiv(id, 'email', maxLength);
            },

            _buildLabeledTelephoneBoxFieldDiv: function (id, maxLength) {
                return this._buildLabeledInputFieldDiv(id, 'tel', maxLength);
            },

            _buildLabeledUrlBoxFieldDiv: function (id, maxLength) {
                return this._buildLabeledInputFieldDiv(id, 'url', maxLength);
            },

            _buildLabeledInputFieldDiv: function (id, inputType, maxLength) {
                var div = this.createElement('div', null, { 'class': 'iwt-form-field-div' });
                this.createChildElement(div, 'label', null, { 'class': 'iwt-form-label', 'for': id }, null, localization[id + 'Label']);
                var childDiv = this.createChildElement(div, 'div', null, { 'class': 'iwt-textbox-container' });
                textBox = this.createChildElement(childDiv, 'input', null, { 'type': inputType, 'class': 'iwt-textbox', 'maxlength': maxLength, 'id': id, 'name': id });
                this._addErrorDiv(div);

                return { textBox: textBox, div: div };
            },

            _doHtml5FormValidation: function () {
                var form = $j('.iwt-register-form-panel form').get(0);
                var password = this._getValueIfAvailable(this._authenticatedCredentialsTextBox);
                var confirmPassword = this._getValueIfAvailable(this._confirmPasswordTextBox);

                if (password != confirmPassword) {
                    this._authenticatedCredentialsTextBox.setCustomValidity(localization.PasswordsDoNotMatch);
                } else {
                    this._authenticatedCredentialsTextBox.setCustomValidity(""); // Have to clear it, otherwise if they submit w/ non-matching password and then again with matching password, they'll still get the error
                }

                return form.checkValidity();
            },

            _doNonHtml5FormValidation: function () {
                var numErrors = 0;
                numErrors += this._validateField(this._authenticatedIdentifierTextBox, ui.FormFieldTypes.Username);
                numErrors += this._validateField(this._firstNameTextBox, ui.FormFieldTypes.FirstName);
                numErrors += this._validateField(this._middleNameTextBox, ui.FormFieldTypes.MiddleName);
                numErrors += this._validateField(this._lastNameTextBox, ui.FormFieldTypes.LastName);
                numErrors += this._validateField(this._homeStreetAddressTextBox, ui.FormFieldTypes.HomeStreetAddress);
                numErrors += this._validateField(this._homeCityTextBox, ui.FormFieldTypes.HomeCity);
                numErrors += this._validateField(this._homeStateTextBox, ui.FormFieldTypes.HomeState);
                numErrors += this._validateField(this._homePostalCodeTextBox, ui.FormFieldTypes.HomePostalCode);
                numErrors += this._validateField(this._homeCountryTextBox, ui.FormFieldTypes.HomeCountry);
                numErrors += this._validateField(this._homeEmailTextBox, ui.FormFieldTypes.HomeEmail);
                numErrors += this._validateField(this._homePhoneTextBox, ui.FormFieldTypes.HomePhone);
                numErrors += this._validateField(this._homePhone2TextBox, ui.FormFieldTypes.HomePhone2);
                numErrors += this._validateField(this._homeFaxTextBox, ui.FormFieldTypes.HomeFax);
                numErrors += this._validateField(this._homePagerTextBox, ui.FormFieldTypes.HomePager);
                numErrors += this._validateField(this._homeMobileTextBox, ui.FormFieldTypes.HomeMobile);
                numErrors += this._validateField(this._homeUrlTextBox, ui.FormFieldTypes.HomeUrl);
                numErrors += this._validateField(this._departmentTextBox, ui.FormFieldTypes.Department);
                numErrors += this._validateField(this._companyTextBox, ui.FormFieldTypes.Company);
                numErrors += this._validateField(this._jobTitleTextBox, ui.FormFieldTypes.JobTitle);
                numErrors += this._validateField(this._assistantNameTextBox, ui.FormFieldTypes.AssistantName);
                numErrors += this._validateField(this._assistantPhoneTextBox, ui.FormFieldTypes.AssistantPhone);
                numErrors += this._validateField(this._businessStreetAddressTextBox, ui.FormFieldTypes.BusinessStreetAddress);
                numErrors += this._validateField(this._businessCityTextBox, ui.FormFieldTypes.BusinessCity);
                numErrors += this._validateField(this._businessStateTextBox, ui.FormFieldTypes.BusinessState);
                numErrors += this._validateField(this._businessPostalCodeTextBox, ui.FormFieldTypes.BusinessPostalCode);
                numErrors += this._validateField(this._businessCountryTextBox, ui.FormFieldTypes.BusinessCountry);
                numErrors += this._validateField(this._businessEmailTextBox, ui.FormFieldTypes.BusinessEmail);
                numErrors += this._validateField(this._businessPhoneTextBox, ui.FormFieldTypes.BusinessPhone);
                numErrors += this._validateField(this._businessPhone2TextBox, ui.FormFieldTypes.BusinessPhone2);
                numErrors += this._validateField(this._businessFaxTextBox, ui.FormFieldTypes.BusinessFax);
                numErrors += this._validateField(this._businessPagerTextBox, ui.FormFieldTypes.BusinessPager);
                numErrors += this._validateField(this._businessMobileTextBox, ui.FormFieldTypes.BusinessMobile);
                numErrors += this._validateField(this._businessUrlTextBox, ui.FormFieldTypes.BusinessUrl);
                numErrors += this._validateField(this._remarksTextBox, ui.FormFieldTypes.Remarks);

                // need to manually check the password and confirm password if confirm password is there
                if (this._authenticatedCredentialsTextBox && this._confirmPasswordTextBox) {
                    var password = this._getValueIfAvailable(this._authenticatedCredentialsTextBox);
                    var confirmPassword = this._getValueIfAvailable(this._confirmPasswordTextBox);

                    if (password != confirmPassword) {
                        numErrors += 2;

                        this._showFieldError(this._authenticatedCredentialsTextBox, localization.PasswordsDoNotMatch);
                        this._showFieldError(this._confirmPasswordTextBox, localization.PasswordsDoNotMatch);
                    }
                    else {
                        numErrors += this._validateField(this._authenticatedCredentialsTextBox, ui.FormFieldTypes.Password);
                        numErrors += this._validateField(this._confirmPasswordTextBox, ui.FormFieldTypes.ConfirmPassword);
                    }
                }
                else {
                    numErrors += this._validateField(this._authenticatedCredentialsTextBox, ui.FormFieldTypes.Password);
                    numErrors += this._validateField(this._confirmPasswordTextBox, ui.FormFieldTypes.ConfirmPassword);
                }

                // if errors are present, show the status and return
                if (numErrors > 0) {
                    if (numErrors == 1) {
                        this.setErrorStatus(localization.OneErrorWithRegistrationData);
                    }
                    else {
                        this.setErrorStatus(localization.MultipleErrorsWithRegistrationData.replace('%0', numErrors));
                    }

                    return false;
                }
                return true;
            },

            _onValidatedSubmit: function () {
                var username = this._getValueIfAvailable(this._authenticatedIdentifierTextBox);
                var password = this._getValueIfAvailable(this._authenticatedCredentialsTextBox);
                var confirmPassword = this._getValueIfAvailable(this._confirmPasswordTextBox);
                var firstName = this._getValueIfAvailable(this._firstNameTextBox);
                var middleName = this._getValueIfAvailable(this._middleNameTextBox);
                var lastName = this._getValueIfAvailable(this._lastNameTextBox);
                var department = this._getValueIfAvailable(this._departmentTextBox);
                var company = this._getValueIfAvailable(this._companyTextBox);
                var jobTitle = this._getValueIfAvailable(this._jobTitleTextBox);
                var assistantName = this._getValueIfAvailable(this._assistantNameTextBox);
                var homeStreetAddress = this._getValueIfAvailable(this._homeStreetAddressTextBox);
                var homeCity = this._getValueIfAvailable(this._homeCityTextBox);
                var homeState = this._getValueIfAvailable(this._homeStateTextBox);
                var homePostalCode = this._getValueIfAvailable(this._homePostalCodeTextBox);
                var homeCountry = this._getValueIfAvailable(this._homeCountryTextBox);
                var homeEmail = this._getValueIfAvailable(this._homeEmailTextBox);
                var homePhone = this._getValueIfAvailable(this._homePhoneTextBox);
                var homePhone2 = this._getValueIfAvailable(this._homePhone2TextBox);
                var homeFax = this._getValueIfAvailable(this._homeFaxTextBox);
                var homePager = this._getValueIfAvailable(this._homePagerTextBox);
                var homeMobile = this._getValueIfAvailable(this._homeMobileTextBox);
                var homeUrl = this._getValueIfAvailable(this._homeUrlTextBox);
                var businessStreetAddress = this._getValueIfAvailable(this._businessStreetAddressTextBox);
                var businessCity = this._getValueIfAvailable(this._businessCityTextBox);
                var businessState = this._getValueIfAvailable(this._businessStateTextBox);
                var businessPostalCode = this._getValueIfAvailable(this._businessPostalCodeTextBox);
                var businessCountry = this._getValueIfAvailable(this._businessCountryTextBox);
                var businessEmail = this._getValueIfAvailable(this._businessEmailTextBox);
                var businessPhone = this._getValueIfAvailable(this._businessPhoneTextBox);
                var businessPhone2 = this._getValueIfAvailable(this._businessPhone2TextBox);
                var businessFax = this._getValueIfAvailable(this._businessFaxTextBox);
                var businessPager = this._getValueIfAvailable(this._businessPagerTextBox);
                var businessMobile = this._getValueIfAvailable(this._businessMobileTextBox);
                var businessUrl = this._getValueIfAvailable(this._businessUrlTextBox);
                var assistantPhone = this._getValueIfAvailable(this._assistantPhoneTextBox);
                var remarks = this._getValueIfAvailable(this._remarksTextBox);

                this._register(username, password,
                    firstName, middleName, lastName,
                    homeStreetAddress, homeCity, homeState, homePostalCode, homeCountry,
                    homeEmail, homePhone, homePhone2, homeFax, homePager, homeMobile, homeUrl,
                    department, company, jobTitle,
                    assistantName, assistantPhone,
                    businessStreetAddress, businessCity, businessState, businessPostalCode, businessCountry,
                    businessEmail, businessPhone, businessPhone2, businessFax, businessPager, businessMobile, businessUrl,
                    remarks);
            },

            _register: function (webLogin, webPassword,
                                 firstName, middleName, lastName,
                                 homeStreetAddress, homeCity, homeState, homePostalCode, homeCountry,
                                 homeEmail, homePhone, homePhone2, homeFax, homePager, homeMobile, homeUrl,
                                 department, company, jobTitle,
                                 assistantName, assistantPhone,
                                 businessStreetAddress, businessCity, businessState, businessPostalCode, businessCountry,
                                 businessEmail, businessPhone, businessPhone2, businessFax, businessPager, businessMobile, businessUrl,
                                 remarks) {
                try {
                    this.setBusy();
                    this.disableFormFields();
                    this._registrationManager.register(webLogin, webPassword,
                        firstName, middleName, lastName,
                        homeStreetAddress, homeCity, homeState, homePostalCode, homeCountry,
                        homeEmail, homePhone, homePhone2, homeFax, homePager, homeMobile, homeUrl,
                        department, company, jobTitle,
                        assistantName, assistantPhone,
                        businessStreetAddress, businessCity, businessState, businessPostalCode, businessCountry,
                        businessEmail, businessPhone, businessPhone2, businessFax, businessPager, businessMobile,
                        businessUrl, remarks,
                        this._registerCallback.bind(this));
                }
                catch (ex) {
                    this.clearBusy();
                    common.Debug.traceError("Caught unhandled exception:\n" + ex);
                    common.Debug.alert("Caught unhandled exception:\n" + ex);
                    webservices.ProblemReporter.sendProblemReport(ex, "RegistrationFormPanel._register()");
                    this.reset();
                }
            },

            _registerCallback: function (success, error) {
                if (success) {
                    this.reset();
                    this.setStatus(localization.RegistrationSucceeded, true);

                    if (this._externalRegistrationCallback) {
                        this._externalRegistrationCallback();
                    }
                }
                else {
                    var text = ui.ErrorDisplayTextBuilder.build(error, localization.RegistrationFailed);
                    this.setErrorStatus(text);
                    this.clearBusy();
                    this.enableFormFields();
                    this.enableSubmitButton(true);
                }
            }
        });
    // Register namespaces
    ui.registerChildNamespace("PageModes");

    /**
     * PageModes enums
     * These represent the types of interactions that may be handled by this web application, i.e. which
     * interaction types' GUIs should be displayed.
     * @see the pageMode param of ui.Page.load()
     */
    ui.PageModes.CHAT = 1;
    ui.PageModes.CALLBACK = 2;
    // Future interaction types shall be 4, 8, 16, etc. so that they may be logically ORed together.

    ui.PageModes.CHAT_AND_CALLBACK = ui.PageModes.CHAT + ui.PageModes.CALLBACK;
    /**
     * FormContainerPanel class
     * This is the base panel which contains the chat login form, callback login form, and registration form.
     */
    ui.FormContainerPanel = Class.create(ui.Control,
        {
            /**
             * Constructor
             *
             * @param chatManager A ChatManagerBase subclass
             * @param callbackManager A CallbackManagerBase subclass
             * @param registrationManager A RegistrationManagerBase subclass
             * @param pageMode Bitfield.  See ui.PageModes.
             * @param chatParameters An instance of ChatParameters
             * @param callbackParameters An instance of CallbackParameters
             */
            initialize: function ($super, chatManager, callbackManager, registrationManager, pageMode, chatParameters, callbackParameters) {
                var numArgs = 7;
                if (arguments.length != numArgs) {
                    throw common.ExceptionFactory.createException("FormContainerPanel constructor called with " + arguments.length + " arguments, but expected " + numArgs + ".");
                }

                this._chatManager = chatManager;
                this._callbackManager = callbackManager;
                this._registrationManager = registrationManager;
                this._pageMode = pageMode;
                this._chatParameters = chatParameters;
                this._callbackParameters = callbackParameters;

                // for debugging only
                var domain = common.Utilities.getQueryStringValue("domain");
                if (domain) {
                    webservices.Servers.Domain = domain;
                }

                // for debugging only
                var useHttps = common.Utilities.getQueryStringValue("https");
                if (useHttps) {
                    webservices.Servers.UseHttps = (useHttps == "1");
                }

                this._selectedPanel = null;
                this._chatPanel = null;
                this._callbackCreationPanel = null;
                this._registerPanel = null;

                var domObject = this._buildDomObject();
                this._validateDomObject();

                $super(domObject);
            },

            constructUI: function () {
                this._containerDiv.appendChild(this._buildTabsDiv());
                this._panelContainerDiv = this.createChildElement(this._containerDiv, 'div', null, { 'class': 'iwt-tab-content' });
                this._addPanels();
                this.focus();
            },

            /**
             * destructor
             */
            destroy: function () {
                ui.Control.prototype.destroy.call(this);
            },

            // Public methods

            /**
             * Called when focus is given to the panel.  Simply gives focus to whichever subpanel is active.
             */
            focus: function () {
                if (this._selectedPanel) {
                    this._selectedPanel.focus();
                }
            },

            /**
             * Resets the panel to the state which it was in prior to any activity taking place.
             */
            reset: function () {
                if (this._chatPanel) {
                    this._chatPanel.reset();
                }
                if (this._callbackCreationPanel) {
                    this._callbackCreationPanel.reset();
                }
                if (this._registerPanel) {
                    this._registerPanel.reset();
                }

                ui.Page.reset();
            },

            /**
             * Returns true if the panel allows chats, false otherwise.
             */
            isChatPageMode: function () {
                return (this._pageMode & ui.PageModes.CHAT);
            },

            /**
             * Returns true if the panel allows callbacks, false otherwise.
             */
            isCallbackPageMode: function () {
                return (this._pageMode & ui.PageModes.CALLBACK);
            },

            /**
             * Given a DOM element identifying a hyperlink, this method will disable that link.
             *
             * @param link A DOM element identifying a hyperlink
             */
            disableLink: function (link) {
                if (link) {
                    Element.addClassName(link, 'iwt-link-disabled');
                    Element.writeAttribute(link, 'enabled', 'false');
                }
            },

            /**
             * Given a DOM element identifying a hyperlink, this method will enable that link.
             *
             * @param link A DOM element identifying a hyperlink
             */
            enableLink: function (link) {
                if (link) {
                    Element.removeClassName(link, 'iwt-link-disabled');
                    Element.writeAttribute(link, 'enabled', 'true');
                }
            },

            /**
             * Causes the registration form to be displayed.
             */
            showRegisterForm: function () {
                this._onClickRegisterTab();
            },

            // Private methods

            _buildTabsDiv: function () {
                var div = this.createElement('div', null, { 'class': 'iwt-form-tabs-container' });
                this._panelTabsUl = this.createChildElement(div, 'ul', 'iwt-tabs', { 'class': 'iwt-form-tabs' });
                return div;
            },

            _isChatSupported: function () {
                var tabVisibility = webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.TabVisibility);
                if (tabVisibility.hideStartChatTab()) {
                    return false;
                }

                if (!(webservices.CapabilityRepository.isStartChatCapabilityEnabled() && this.isChatPageMode())) {
                    return false;
                }

                var authChat = webservices.CapabilityRepository.isChatTrackerAuthenticationCapabilityEnabled();
                var anonChat = webservices.CapabilityRepository.isChatAnonymousAuthenticationCapabilityEnabled();

                return authChat || anonChat;
            },

            _isCallbackCreationSupported: function () {
                var tabVisibility = webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.TabVisibility);
                if (tabVisibility.hideStartCallbackTab()) {
                    return false;
                }

                if (!(webservices.CapabilityRepository.isCreateCallbackCapabilityEnabled() && this.isCallbackPageMode())) {
                    return false;
                }

                var authCallback = webservices.CapabilityRepository.isCallbackTrackerAuthenticationCapabilityEnabled();
                var anonCallback = webservices.CapabilityRepository.isCallbackAnonymousAuthenticationCapabilityEnabled();

                return authCallback || anonCallback;
            },

            _isRegisterSupported: function () {
                var tabVisibility = webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.TabVisibility);
                if (tabVisibility.hideRegisterNewAccountTab()) {
                    return false;
                }

                return webservices.CapabilityRepository.isTrackerRegistrationCapabilityEnabled();
            },

            _onClickChatTab: function (event) {
                this._selectedPanel = this._chatPanel;
                this.focus();
            },

            _onClickCallbackTab: function (event) {
                this._selectedPanel = this._callbackCreationPanel;
                this.focus();
            },

            _onClickRegisterTab: function (event) {
                this._selectedPanel = this._registerPanel;
                this.focus();
            },

            _addPanels: function () {
                var isFirstPanel = true;
                if (this._isChatSupported()) {
                    var panel = new ui.ChatLoginFormPanel(this._chatManager, this, this._chatParameters, null);
                    if (isFirstPanel) {
                        panel.get_domObject().addClassName('active');
                        isFirstPanel = false;
                    }
                    this._panelContainerDiv.appendChild(panel.get_domObject());
                    this._chatPanel = panel;
                }

                if (this._isCallbackCreationSupported()) {
                    var panel = new ui.CallbackContainerPanel(this._callbackManager, this, this._callbackParameters, null);
                    if (isFirstPanel) {
                        panel.get_domObject().addClassName('active');
                        isFirstPanel = false;
                    }
                    this._panelContainerDiv.appendChild(panel.get_domObject());
                    this._callbackCreationPanel = panel;
                }

                if (this._isRegisterSupported()) {
                    var args = { "registrationManager": this._registrationManager, "registerFormContainer": this, "registrationCallback": null, "form": null };
                    var panel = webservices.CustomizationFactoryRegistry.create_instance(webservices.CustomizableFactoryTypes.RegistrationFormPanel, args);
                    if (isFirstPanel) {
                        panel.get_domObject().addClassName('active');
                        isFirstPanel = false;
                    }
                    this._panelContainerDiv.appendChild(panel.get_domObject());
                    this._registerPanel = panel;
                }

                this._addTabs();
            },

            _addTabs: function () {
                var ul = this._panelTabsUl;
                var _self = this;
                var isFirstTab = true;

                if (this._isChatSupported()) {
                    var classes = (isFirstTab ? { 'class': 'active' } : null);
                    isFirstTab = false;

                    this._chatTab = this.createChildElement(ul, 'li', null, classes/*{'class': className}*/);
                    var a = this.createChildElement(this._chatTab, 'a', 'iwt-chat-tab', { 'href': '#iwt-chat-form-panel', 'data-toggle': 'tab' }, null, localization.StartChatTab);
                    $j('a#iwt-chat-tab').on('shown.bs.tab', function (e) { _self._onClickChatTab(e); });
                }

                if (this._isCallbackCreationSupported()) {
                    var classes = (isFirstTab ? { 'class': 'active' } : null);
                    isFirstTab = false;

                    this._callbackCreationTab = this.createChildElement(ul, 'li', null, classes/*{'class': className}*/);
                    var a = this.createChildElement(this._callbackCreationTab, 'a', 'iwt-callback-tab', { 'href': '#iwt-callback-container-panel', 'data-toggle': 'tab' }, null, localization.StartCallbackTab);
                    $j('a#iwt-callback-tab').on('shown.bs.tab', function (e) { _self._onClickCallbackTab(e); });

                    if (this._isRegisterSupported()) {
                        var classes = (isFirstTab ? { 'class': 'active' } : null);
                        isFirstTab = false;

                        this._registerTab = this.createChildElement(ul, 'li', null, classes/*{'class': className}*/);
                        var a = this.createChildElement(this._registerTab, 'a', 'iwt-register-tab', { 'href': '#iwt-register-form-panel', 'data-toggle': 'tab' }, null, localization.RegisterNewAccountTab);
                        $j('a#iwt-register-tab').on('shown.bs.tab', function (e) { _self._onClickRegisterTab(e); });
                    }
                }
            },

            _buildDomObject: function () {
                var div = this.createElement('div', null, { 'class': 'iwt-login-container' });
                div.appendChild(this._buildInnerDiv());
                this.createChildElement(div, 'div', null, { 'class': 'iwt-disclaimer' }, null, localization.Disclaimer);
                return div;
            },

            _buildInnerDiv: function () {
                this._containerDiv = document.createElement('div');
                this.createChildElement(this._containerDiv, 'h1', null, { 'class': 'iwt-page-header' }, null, localization.LoginContainerHeaderText);
                return this._containerDiv;
            },

            _validateDomObject: function () {
                if (!this._containerDiv) {
                    throw common.ExceptionFactory.createException("Container div not found");
                }
            }
        });
    /**
     * MessagesPanel class
     * This is the panel that displays the transcript of past messages in the chat.
     * This class handles only the UI functionality of the panel.  The logic functionality
     * is implemented in WebServicesReceivedMessagesPanel.
     */
    ui.MessagesPanel = Class.create(ui.Control,
        {
            // constants
            SENDER_DIV_CLASS: 'iwt-message-sender',

            /**
             * Constructor
             *
             * @param acceptHtml If true, HTML-formatted messages are allowed to be displayed.  If false, any HTML tags received will be displayed to the user, instead of rendered.
             */
            initialize: function ($super, acceptHtml) {
                var numArgs = 2;
                if (arguments.length != numArgs) {
                    throw common.ExceptionFactory.createException("MessagesPanel constructor called with " + arguments.length + " arguments, but expected " + numArgs + ".");
                }

                this._linkifier = webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.Linkifier);

                $super(this._buildDomObject());

                this._acceptHtml = acceptHtml;
                this.reset();
            },

            /**
             * Destructor
             */
            destroy: function () {
                ui.Control.prototype.destroy.call(this);
            },

            // public methods

            /**
             * Adds a message to the panel, from the "System" as opposed to a human participant.
             *
             * @param text The message to add
             * @param time The timestamp to display beside the message
             * @param timedOut If true, treat this message as though it was received late.  It will be displayed in a way that makes it obvious that it is out of order.
             */
            addUnauthoredMessage: function (text, time, timedOut) {
                common.Debug.traceMethodEntered("MessagesPanel.addUnauthoredMessage()");
                var ret = this.addGenericMessage(text, "text/html", time, webservices.ParticipantRepository.get_systemParticipantId(), timedOut, true);
                common.Debug.traceMethodExited("MessagesPanel.addUnauthoredMessage()");
                return ret;
            },

            /**
             * Adds a message to the panel, that was typed by a human participant or handler, is not *just* a hyperlink, and is not
             * a file transfer message.
             *
             * @param text The message to add
             * @param contentType The mime type of the text.  Likely either "text/plain" or "text/html".
             * @param time The timestamp to display beside the message
             * @param senderId The ID of whomever sent the message
             * @param timedOut If true, treat this message as though it was received late.  It will be displayed in a way that makes it obvious that it is out of order.
             */
            addAuthoredMessage: function (text, contentType, time, senderId, timedOut) {
                common.Debug.traceMethodEntered("MessagesPanel.addAuthoredMessage()");
                if (null != text && text.length > 0 && (("text/html" != contentType.toLowerCase()) || !this._acceptHtml)) {
                    // Received HTML & accept HTML: Render
                    // Received HTML & do not accept HTML: Display tags
                    // Received text & accept HTML: Display tags
                    // Received text & do not accept HTML: Display tags
                    text = webservices.Utilities.escapeHTML(text);
                }
                this.addGenericMessage(text, contentType, time, senderId, timedOut, false);
                common.Debug.traceMethodExited("MessagesPanel.addAuthoredMessage()");
            },

            /**
             * Adds a message to the panel.
             *
             * @param text The message to add
             * @param contentType The mime type of the text.  Likely either "text/plain" or "text/html".
             * @param time The timestamp to display beside the message
             * @param senderId The ID of whomever sent the message
             * @param timedOut If true, treat this message as though it was received late.  It will be displayed in a way that makes it obvious that it is out of order.
             * @param skipLinkifier If true, the Linkifier will not be used to turn URLs into hyperlinks.  Useful for messages that contain HTML which should be rendered for the user.
             */
            addGenericMessage: function (text, contentType, time, senderId, timedOut, skipLinkifier) {
                common.Debug.traceMethodEntered("MessagesPanel.addGenericMessage()");

                if (timedOut) {
                    this.addUnauthoredMessage(localization.OutOfOrderMessage, new Date());
                    this._lastSenderId = null;
                    this._lastUl = null;

                    var lateMsg = this._addMessage(text, time, senderId, skipLinkifier);

                    Element.addClassName(lateMsg, 'iwt-late-message');

                    // reset state
                    this._lastSenderId = null;
                    this._lastUl = null;
                }
                else {
                    this._addMessage(text, time, senderId, skipLinkifier);
                }

                this.storeChatMessages();
                common.Debug.traceMethodExited("MessagesPanel.addGenericMessage()");
            },

            /**
             * Adds a message to the panel where the message consists of only a hyperlink
             *
             * @param text The clickable text
             * @param url The URL to display when the text is clicked
             * @param time The timestamp to display beside the link
             * @param senderId The ID of whomever sent the link
             * @param timedOut If true, treat this link as though it was received late.  It will be displayed in a way that makes it obvious that it is out of order.
             */
            addAuthoredLinkMessage: function (text, url, time, senderId, timedOut) {
                common.Debug.traceMethodEntered("MessagesPanel.addAuthoredLinkMessage()");

                if (text != url) {
                    // Trust that caller knows what it's doing.
                    var linkHtml = this._linkifier.createLink(url, text);
                    // Since the <a> tag was just added above, tell addGenericMessage() to skip calling the linkifier.
                    this.addGenericMessage(linkHtml, "text/html", time, senderId, timedOut, true);
                }
                else {
                    // This may be something like "http://www.somewhere.com Try this link".
                    // Don't simply wrap an <a> tag around it here - let the linkifier scan it
                    // and put the tags in the appropriate places.
                    this.addGenericMessage(text, "text/html", time, senderId, timedOut, false);
                }

                common.Debug.traceMethodExited("MessagesPanel.addAuthoredLinkMessage()");
            },

            /**
             * Changes the name displayed for a group of messages
             *
             * @param newName The new name to display
             * @param senderId The id of chat participant who sent the messages to be affected
             */
            changeMessageGroupsName: function (newName, senderId) {
                var liArray = this._getLIsWithSenderId(senderId);
                if (liArray && (liArray.length > 0)) {
                    for (var i = 0; i < liArray.length; ++i) {
                        this._changeMessageGroupName(liArray[i], newName);
                    }
                }
            },

            /**
             * Resets this panel to its original state
             */
            reset: function () {
                // initialize members
                this._lastSenderId = null;
                this._lastUl = null;
                this._lastTime = null;

                // remove all list items
                if (this._messagesList.hasChildNodes()) {
                    while (this._messagesList.childNodes.length >= 1) {
                        this._messagesList.removeChild(this._messagesList.firstChild);
                    }
                }
            },

            restoreAllChatMessages: function () {
                var pId = sessionStorage.getItem('participantId');

                if (!pId || pId.length <= 0) {
                    return;
                }

                var messages = JSON.parse(sessionStorage.getItem('chatMessages'));

                if (!messages || messages.length == 0) {
                    return;
                }

                // remove first 2 children to delete link msg and last message prior to refresh
                // this prevents duplication of the last message
                this._messagesList.removeChild(this._messagesList.firstChild);
                this._messagesList.removeChild(this._messagesList.firstChild);
                this._messagesList.insertAdjacentHTML('afterBegin', messages);

                this._scrollToBottom();

                // clear message history
                sessionStorage.removeItem('participantId');
                sessionStorage.removeItem('chatMessages');
            },

            restoreLastChatMessage: function () {
                var pId = sessionStorage.getItem('participantId');

                if (!pId || pId.length <= 0) {
                    return;
                }

                var message = JSON.parse(sessionStorage.getItem('lastChatMessage'));

                if (!message || message.length == 0) {
                    return;
                }

                this.addAuthoredLinkMessage("Click here to recover chat history", "javascript:;", null, webservices.ParticipantRepository.get_systemParticipantId());
                $j(this._messagesList.firstChild).find('.iwc-message-link').attr('target', '');
                this._messagesList.firstChild.addEventListener('click', this.restoreAllChatMessages.bind(this));
                this._messagesList.insertAdjacentHTML('beforeEnd', message);

                sessionStorage.setItem('lastChatMessage', null);
            },

            storeChatMessages: function () {
                if (!this._messagesList.hasChildNodes()) {
                    return;
                }

                var messageHistory = null;
                restoreLink = $j(this._messagesList.firstChild).find(".iwc-message-link[target=''], .iwc-message-link[href='javascript:;']");
                if (restoreLink && restoreLink.length > 0) {
                    var tempMessageList = $j('<div> </div>')[0];
                    tempMessageList.insertAdjacentHTML('afterBegin', JSON.parse(sessionStorage.getItem('chatMessages')));

                    for (var i = 0; i < this._messagesList.childNodes.length; i++) {
                        if (i < 2)
                            continue;
                        if (this._messagesList[i]) {
                            tempMessageList.insertAdjacentHTML('beforeEnd', this._messagesList[i]);
                            sessionStorage.setItem('lastChatMessage', JSON.stringify(this._messagesList[i]));
                        }
                    }

                    sessionStorage.setItem('chatMessages', JSON.stringify(tempMessageList.innerHTML));
                }
                else {
                    sessionStorage.setItem('chatMessages', JSON.stringify(this._messagesList.innerHTML));
                    sessionStorage.setItem('lastChatMessage', JSON.stringify(this._messagesList.lastChild.outerHTML));
                }

                var pId = webservices.ParticipantRepository.get_currentParticipantId();
                sessionStorage.setItem('participantId', pId);
            },

            // private methods

            _buildDomObject: function () {
                this._messagesList = this.createElement('div', 'messagesPanel', { 'class': 'iwt-received-messages-panel' });
                return this._messagesList;
            },

            _buildSenderDiv: function (senderId) {
                var div = this.createElement('div', null, { 'class': 'iwt-message-sender-container' });
                this.createChildElement(div, 'div', null, { 'class': this.SENDER_DIV_CLASS }, null, webservices.ParticipantDisplayNameFormatter.formatDisplayNameFromId(senderId));
                return div;
            },

            _buildMessage: function (text, time, addDash, skipLinkifier) {
                var msg = this.createElement('div', null, { 'class': 'iwt-message' });
                // Put time before text. Will leave them that way for xs, but use CSS to swap them for sm, md, lg.
                if (time) {
                    var e = this._buildMessageTimeDiv(time);
                    msg.appendChild(e);

                    if (!this._isTimeNearPrevious(time)) {
                        Element.addClassName(e, 'iwt-message-time-near-previous');
                    }
                }

                msg.appendChild(this._buildMessageTextDiv(text, addDash, skipLinkifier));
                this.createChildElement(msg, 'div', null, { 'class': 'iwt-message-vertical-spacer' }, null, "&nbsp;");
                return msg;
            },

            _isTimeNearPrevious: function (time) {
                return !this._isSameMinute(this._lastTime, time);
            },

            _isSameMinute: function (time1, time2) {
                common.ParameterValidation.validate([time1, time2], [{ "type": Date }, { "type": Date }]);

                if (!time1) {
                    return false;
                }

                if (!time2) {
                    return false;
                }

                return ((time1.getFullYear() == time2.getFullYear()) &&
                    (time1.getMonth() == time2.getMonth()) &&
                    (time1.getDate() == time2.getDate()) &&
                    (time1.getHours() == time2.getHours()) &&
                    (time1.getMinutes() == time2.getMinutes()));
            },

            _isSameDay: function (time1, time2) {
                common.ParameterValidation.validate([time1, time2], [{ "type": Date }, { "type": Date }]);

                if (!time1) {
                    return false;
                }

                if (!time2) {
                    return false;
                }

                return ((time1.getFullYear() == time2.getFullYear()) &&
                    (time1.getMonth() == time2.getMonth()) &&
                    (time1.getDate() == time2.getDate()));
            },

            _buildMessageTextDiv: function (text, addDash, skipLinkifier) {
                if (!skipLinkifier) {
                    text = this._linkifier.linkifyText(text);
                }

                // We want to turn plaintext newlines into HTML, so that the
                // web user can see line breaks included in sent messages.
                text = text.replace(/\r?\n/g, "<br>");
                var wrapper = this.createElement('div', null, { 'class': 'iwt-message-text-wrapper' });
                var child = this.createChildElement(wrapper, 'div', null, { 'class': 'iwt-message-text' }, null, text);

                if (addDash) {
                    Element.addClassName(child, ((webservices.Utilities.isBrowserIE() && document.body.dir == 'rtl') ? 'iwt-arrow-IE-fix' : 'iwt-arrow'));
                }
                return wrapper;
            },

            _buildMessageTimeDiv: function (time) {
                var div = this.createElement('div', null, { 'class': 'iwt-message-time-container' });
                this.createChildElement(div, 'div', null, { 'class': 'iwt-message-time' }, null, ui.DateTimeFormatter.formatTimeForDisplay(time, !this._isSameDay(this._lastTime, time)));
                $j(div).hide();

                return div;
            },

            _showHiddenMessage: function (message) {
                $j(message).show(); // Creating an anonymous function as an arg to show(), which calls _onMessageShown(), would be the preferred way but does not work in all browsers :(
                window.setTimeout(this._onMessageShown.bind(this, message), 10);
            },

            _onMessageShown: function (message) {
                common.Debug.traceMethodEntered("MessagesPanel._onMessageShown()");

                this._scrollToBottom();

                common.Debug.traceMethodExited("MessagesPanel._onMessageShown()");
            },

            _scrollToBottom: function () {
                this._messagesList.scrollTop = this._messagesList.scrollHeight; // Scroll to the bottom, now that the new message is visible
            },

            _getLongestWordLength: function (str) {
                var words = str.split(" ");

                //  Find longest word and get length of that.
                var longestWordLength = 0;
                for (var i = 0; i < words.length; i++) {
                    if (words[i].length > longestWordLength) {
                        longestWordLength = words[i].length;
                    }
                }
                return longestWordLength;
            },

            _enforceMaximumWordLength: function (str, allowableWordLength) {
                // At this point, special characters that were typed by chat parties have already been converted to HTML entities, e.g. if
                // the agent said "your payment must be received in < 2 weeks" then str will contain "&lt;" instead of "<".
                // But if the agent said "Go to www.company.com" then str will contain "<a href="http://www.company.com">www.company.com</a>".

                if (-1 == str.indexOf('<')) {
                    // Easy case - no HTML
                    var pattern = new RegExp("(\\S{" + allowableWordLength + "})(\\S)");
                    var bChanged = true;
                    while (bChanged) {
                        var oldStr = str;
                        str = str.replace(pattern, "$1 $2");
                        bChanged = (oldStr != str);
                    }
                    return str;
                } else {
                    // Harder case - HTML is present
                    var firstTagBeginIdx = str.indexOf('<');
                    var firstTagEndIdx = str.indexOf('>') + 1;
                    var beforeTag = str.substring(0, firstTagBeginIdx);
                    var tag = str.substring(firstTagBeginIdx, firstTagEndIdx);
                    var afterTag = str.substring(firstTagEndIdx);
                    return this._enforceMaximumWordLength(beforeTag, allowableWordLength)   // The part before the first HTML tag.  Recurse; will be the easy case.
                        + tag                                                            // The tag itself
                        + this._enforceMaximumWordLength(afterTag, allowableWordLength); // Recurse on the part after the first HTML tag; may be easy or harder.
                }
            },

            _showHiddenTimeElement: function (message) {
                var timeElement = this._getTimeElement(message);
                if (timeElement) {
                    $j(timeElement).show();
                }
            },

            _getTimeElement: function (message) {
                var timeElements = Element.select(message, '.iwt-message-time-container');
                if (timeElements && timeElements.length == 1) {
                    return timeElements[0];
                }

                return null;
            },

            _addMessage: function (text, time, senderId, skipLinkifier) {
                common.Debug.traceMethodEntered("MessagesPanel._addMessage()");
                var message;
                if (!this._lastSenderId || (this._lastSenderId != senderId)) {
                    var originalName = null;
                    if (senderId != webservices.ParticipantRepository.get_systemParticipantId()) {
                        originalName = webservices.ParticipantDisplayNameFormatter.formatDisplayNameFromId(senderId);
                        //}

                        //var messageLi = this.createHiddenChildElement(this._messagesList, 'li', null, {'senderId': senderId, 'originalName': originalName});

                        //var wrapperDiv = this.createChildElement(messageLi, 'div');
                        //if(senderId != webservices.ParticipantRepository.get_systemParticipantId())
                        //{
                        this._messagesList.appendChild(this._buildSenderDiv(senderId));
                    }
                }
                //var ul = this.createChildElement(wrapperDiv, 'ul');
                message = this._buildMessage(text, time, (senderId != webservices.ParticipantRepository.get_systemParticipantId()), skipLinkifier);
                $j(message).hide();

                var className;
                if (senderId == webservices.ParticipantRepository.get_currentParticipantId()) {
                    className = 'iwt-message-from-self';
                }
                else if (senderId == webservices.ParticipantRepository.get_systemParticipantId()) {
                    className = 'iwt-message-from-system';
                }
                else {
                    className = 'iwt-message-from-agent';
                }
                Element.addClassName(message, className);
                this._messagesList.appendChild(message);
                this._showHiddenMessage(message);
                this._showHiddenTimeElement(message);  // TODO: Is this necessary? Does it work correctly?

                // save the members
                this._lastSenderId = senderId;
                //this._lastUl = ul;
                this._lastTime = time;

                common.Debug.traceMethodExited("MessagesPanel._addMessage()");
                return message;
            },

            _getLIsWithSenderId: function (senderId) {
                return Element.select(this._messagesList, '[senderId="' + senderId + '"]');
            },

            _changeMessageGroupName: function (li, newName) {
                var originalName = this._getOriginalNameFromMessageGroupLi(li);
                if (originalName != newName) {
                    var senderDiv = this._getSenderDivFromMessageGroupLi(li);
                    if (senderDiv) {
                        this._setNameOnSenderDiv(senderDiv, newName, originalName);
                    }
                }
            },

            _getOriginalNameFromMessageGroupLi: function (li) {
                return Element.readAttribute(li, 'originalName');
            },

            _getSenderDivFromMessageGroupLi: function (li) {
                var divArray = Element.select(li, 'div[class="' + this.SENDER_DIV_CLASS + '"]');
                if (divArray && (divArray.length > 0)) {
                    return divArray[0];
                }

                return null;
            },

            _setNameOnSenderDiv: function (senderDiv, newName, originalName) {
                if (senderDiv) {
                    senderDiv.text(newName);
                    var originalSpan = $("<span style='margin-left:10px;color:#ccc'></span>");
                    originalSpan.text('(' + originalName + ')');
                    senderId.append(originalSpan);
                }
            }
        });
    /**
     * WebServicesReceivedMessagesPanel class
     * This class handles the logic functionality of the panel that displays the transcript
     * of past messages in the chat.  The UI functionality is implemented in MessagesPanel.
     *
     */
    ui.WebServicesReceivedMessagesPanel = Class.create(ui.MessagesPanel,
        {
            /**
             * Constructor
             *
             * @param acceptHtml If true, HTML-formatted messages are allowed to be displayed.  If false, any HTML tags received will be displayed to the user, instead of rendered.
             */
            initialize: function ($super, acceptHtml) {
                var numArgs = 2;
                if (arguments.length != numArgs) {
                    throw common.ExceptionFactory.createException("WebServicesReceivedMessagesPanel constructor called with " + arguments.length + " arguments, but expected " + numArgs + ".");
                }

                $super(acceptHtml);

                this.addImplementedInterface(webservices.Interfaces.IParticipantJoinedNotificationObserver, webservices);
                this.addImplementedInterface(webservices.Interfaces.IParticipantLeftNotificationObserver, webservices);
                this.addImplementedInterface(webservices.Interfaces.IParticipantVoicemailNotificationObserver, webservices);
                this.addImplementedInterface(webservices.Interfaces.IReceivedTextNotificationObserver, webservices);
                this.addImplementedInterface(webservices.Interfaces.IReceivedUrlNotificationObserver, webservices);
                this.addImplementedInterface(webservices.Interfaces.IReceivedFileNotificationObserver, webservices);
                this.addImplementedInterface(webservices.Interfaces.IFailoverUINotificationObserver, webservices);
                this.addImplementedInterface(webservices.Interfaces.IResumedPollingNotificationObserver, webservices);
                this.addImplementedInterface(webservices.Interfaces.IChatReconnectFailureNotificationObserver, webservices);
                this.addImplementedInterface(webservices.Interfaces.IRefreshPageNotificationObserver, webservices);

                this._isConnected = true;
                this._showMoreMessages = true;
                this._isFirstAttempt = true;
            },

            // public methods

            /**
             * Implementation of IParticipantJoinedNotificationObserver
             * Currently does nothing - stubbed here for future enhancement.
             *
             * @param notification Something that implements of IParticipantJoinedNotification
             */
            processParticipantJoinedNotification: function (notification) {
                common.Interface.ensureImplements(notification, webservices.Interfaces.IParticipantJoinedNotification);
            },

            /**
             * Implementation of IParticipantLeftNotificationObserver
             * Adds a message to the panel indicating that the participant has left the chat.
             *
             * @param notification Something that implements IParticipantLeftNotification
             */
            processParticipantLeftNotification: function (notification) {
                common.Interface.ensureImplements(notification, webservices.Interfaces.IParticipantLeftNotification);

                if (this._showMoreMessages) {
                    if (notification.get_participantId() == webservices.ParticipantRepository.get_currentParticipantId()) {
                        this._addSystemMessage(localization.DisconnectedFromChat, notification.get_dateTime(), notification.get_isTimedOut());
                    }
                }
            },

            /**
             * Implementation of IReceivedTextNotificationObserver
             * Adds the received message to the panel.
             *
             * @param notification Something that implements IReceivedTextNotification
             */
            processReceivedTextNotification: function (notification) {
                common.Interface.ensureImplements(notification, webservices.Interfaces.IReceivedTextNotification);

                if (this._showMoreMessages) {
                    this.addAuthoredMessage(notification.get_messageText(), notification.get_contentType(), notification.get_dateTime(), notification.get_participantId(), notification.get_isTimedOut());
                }
            },

            /**
             * Implementation of IReceivedUrlNotificationObserver
             * Adds the received URL to the panel.
             *
             * @param notification Something that implements IReceivedUrlNotification
             */
            processReceivedUrlNotification: function (notification) {
                common.Interface.ensureImplements(notification, webservices.Interfaces.IReceivedUrlNotification);

                if (this._showMoreMessages) {
                    this.addAuthoredLinkMessage(notification.get_messageUrl(), notification.get_messageUrl(), notification.get_dateTime(), notification.get_participantId(), notification.get_isTimedOut());
                }
            },

            /**
             * Implementation of IReceivedFileNotificationObserver
             * Adds a link to the received file to the panel.
             *
             * @param notification Something that implements IReceivedFileNotification
             */
            processReceivedFileNotification: function (notification) {
                common.Interface.ensureImplements(notification, webservices.Interfaces.IReceivedFileNotification);

                if (this._showMoreMessages) {
                    var filename = decodeURIComponent(this._getFileName(notification.get_messageRelativeUrl()));
                    this.addAuthoredLinkMessage(filename, this._createFullUrl(notification.get_messageRelativeUrl()), notification.get_dateTime(), notification.get_participantId(), notification.get_isTimedOut());
                }
            },

            /**
             * Implementation of IFailoverUINotificationObserver
             * Adds a message to the panel indicating there was an error connecting to the server.
             *
             * @param notification Something that implements IFailoverUINotification
             */
            processFailoverUINotification: function (notification) {
                common.Interface.ensureImplements(notification, webservices.Interfaces.IFailoverUINotification);

                if (this._showMoreMessages) {
                    if (this._isConnected) {
                        this._isConnected = false;
                    }
                }
            },

            /**
             * Implementation of IResumedPollingNotificationObserver
             * Adds a message to the panel indicating successful resumption of polling
             *
             * @param notification Something that implements IResumedPollingNotification
             */
            processResumedPollingNotification: function (notification) {
                common.Interface.ensureImplements(notification, webservices.Interfaces.IResumedPollingNotification);

                if (this._showMoreMessages) {
                    if (!this._isConnected) {
                        this._isConnected = true;
                        if (!this._isFirstAttempt) {
                            this._addSystemMessage(localization.SuccessfullyReconnectedServer, new Date(), false);
                            this._isFirstAttempt = true; //reset the status
                        }

                    }
                }
            },

            /**
             * Implementation of IChatReconnectFailureNotificationObserver
             * Adds a message to the panel indicating failure to reconnect a chat to the server
             *
             * @param notification Something that implements IChatReconnectFailureNotification
             */
            processChatReconnectFailureNotification: function (notification) {
                common.Interface.ensureImplements(notification, webservices.Interfaces.IChatReconnectFailureNotification);
            },

            /**
             * Implementation of IRefreshPageNotificationObserver
             * Adds a message to the panel instructing the user to refresh the page to begin a new chat.
             *
             * @param notification Something that implements IRefreshPageNotification
             */
            processRefreshPageNotification: function (notification) {
                common.Interface.ensureImplements(notification, webservices.Interfaces.IRefreshPageNotification);

                if (this._showMoreMessages) {
                    var url;

                    if (notification.get_newUriFragment()) {
                        //Changed by Ian.Mathew for SCR 83216
                        url = webservices.Utilities.setQueryStringParameterToUrl(location.href, "server", notification.get_newUriFragment());
                        //url = webservices.Utilities.appendQueryStringParameterToUrl(location.href, "server", notification.get_newUriFragment());
                    }
                    else {
                        url = webservices.Utilities.removeEndingPoundCharacter(location.href);
                    }

                    var msg = localization.NeedPageRefresh_Format.replace("{0}", url);
                    this._addSystemMessage(msg, new Date(), false);

                    // if we got this notification, no matter what else we get, we can't act on it
                    this._showMoreMessages = false;
                }
            },

            /**
             * Implementation of IParticipantVoicemailNotificationObserver
             * Adds a message to the panel instructing the user to leave a message, since no agents are available.
             *
             * @param notification Something that implements IParticipantVoicemailNotification
             */
            processParticipantVoicemailNotification: function (notification) {
                common.Interface.ensureImplements(notification, webservices.Interfaces.IParticipantVoicemailNotification);

                if (this._showMoreMessages) {
                    var text = localization.PleaseLeaveMessage.replace('%0', this._formatName(notification.get_participantId()));
                    this._addSystemMessage(text, notification.get_dateTime(), notification.get_isTimedOut());
                }
            },

            // private methods

            _formatName: function (id, name) {
                if (!name) {
                    var participant = webservices.ParticipantRepository.get_participant(id);
                    if (participant) {
                        name = participant.get_name();
                    }
                }

                return webservices.ParticipantDisplayNameFormatter.formatDisplayNameFromIdAndName(id, name);
            },

            _getFileName: function (relativeUrl) {
                return webservices.Utilities.getFileNameFromUrl(relativeUrl);
            },

            _createFullUrl: function (relativeUrl) {
                return webservices.Servers.buildUrl(webservices.Servers.CurrentUriFragment, relativeUrl);
            },

            _addSystemMessage: function (text, dateTime, get_isTimedOut) {
                this.addUnauthoredMessage(text, dateTime, get_isTimedOut);
            }
        });
    // Register namespaces
    ui.registerChildNamespace("_Internal");

    /**
     * (UI) LanguageCodeConverter class
     * This extends webservices.LanguageCodeConverter (note the package name) to
     * provide additional language code conversion functionality specific to the UI implementation. At this time,
     * that includes only functionality pertaining to the CK Editor.
     *
     * Provides methods pertaining to the use of language codes (aka IETF Tags).  Examples of these tags are:
     * en-US = English as spoken in the US
     * en-GB = English as spoken in Great Britain
     * de-CH = German as spoken in Switzerland
     * ...etc.
     *
     * Note that generally the region portion of a language code is capitalized, but this is merely a convention, and
     * this web application does not follow that convention.
     *
     * There is no need to instantiate this class - a singleton instance called ui.LanguageCodeConverter is available.
     */
    ui._Internal.LanguageCodeConverter = Class.create(webservices.LanguageCodeConverter, {
        /**
         * Constructor does nothing because all the functionality is essentially static
         */
        initialize: function () {
        },

        /**
         * Returns the language code which CKEditor expects, given a language code used by IC.
         * If CKEditor doesn't use the exact same language codes as IC, this is the place to convert them.
         *
         * @param languageCode The language code in use by IC.
         */
        convertLanguageCodeToCKEditorLanguageCode: function (languageCode) {
            if (!languageCode) {
                return "en";
            }

            // All string comparisons below should be case-insensitive, so convert languageCode
            // to lower case.  Any future language codes or tokens that are added below should
            // be added in lower case!
            languageCode = languageCode.toLowerCase();

            var firstToken = this.getFirstToken(languageCode);

            if (firstToken == "af") return "af";
            if (firstToken == "ar") return "ar";
            if (firstToken == "bg") return "bg";
            if (firstToken == "bn") return "bn";
            if (firstToken == "bs") return "bs";
            if (firstToken == "ca") return "ca";
            if (firstToken == "cs") return "cs";
            if (firstToken == "da") return "da";
            if (firstToken == "de") return "de";
            if (firstToken == "el") return "el";
            if (languageCode == "en-au") return "en-au";
            if (languageCode == "en-ca") return "en-ca";
            if (languageCode == "en-uk") return "en-uk";
            if (firstToken == "en") return "en";
            if (firstToken == "eo") return "eo";
            if (firstToken == "es") return "es";
            if (firstToken == "et") return "et";
            if (firstToken == "eu") return "eu";
            if (firstToken == "fa") return "fa";
            if (firstToken == "fi") return "fi";
            if (firstToken == "fo") return "fo";
            if (languageCode == "fr-ca") return "fr-ca";
            if (firstToken == "fr") return "fr";
            if (firstToken == "gl") return "gl";
            if (firstToken == "gu") return "gu";
            if (firstToken == "he") return "he";
            if (firstToken == "hi") return "hi";
            if (firstToken == "hr") return "hr";
            if (firstToken == "hu") return "hu";
            if (firstToken == "is") return "is";
            if (firstToken == "it") return "it";
            if (firstToken == "ja") return "ja";
            if (firstToken == "km") return "km";
            if (firstToken == "ko") return "ko";
            if (firstToken == "lt") return "lt";
            if (firstToken == "lv") return "lv";
            if (firstToken == "mn") return "mn";
            if (firstToken == "ms") return "ms";
            if (firstToken == "nb") return "nb";
            if (firstToken == "nl") return "nl";
            if (firstToken == "no") return "no";
            if (firstToken == "pl") return "pl";
            if (languageCode == "pt-br") return "pt-br";
            if (firstToken == "pt") return "pt";
            if (firstToken == "ro") return "ro";
            if (firstToken == "ru") return "ru";
            if (firstToken == "sk") return "sk";
            if (firstToken == "sl") return "sl";
            if (languageCode == "sr-latn") return "sr-latn";
            if (firstToken == "sr") return "sr";
            if (firstToken == "sv") return "sv";
            if (firstToken == "th") return "th";
            if (firstToken == "tr") return "tr";
            if (firstToken == "uk") return "uk";
            if (firstToken == "vi") return "vi";
            if (languageCode == "zh-cn") return "zh-cn";
            if (firstToken == "zh") return "zh";

            return "en";
        },

        currentLanguageIsRightToLeft: function () {
            return ("rtl" == localization.TextDirection);
        }
    });
    ui.LanguageCodeConverter = new ui._Internal.LanguageCodeConverter();
    /**
     * SendOnEnterPanel class
     *
     * Handles the UI of the label and checkbox that allow the user to choose whether
     * pressing the Enter key will send the message, or just insert a carriage return
     * into the text.
     *
     * Accompanies a ComposeMessagePanel.
     *
     * @see ComposeMessagePanel.
     * @see WebServicesComposeMessagePanel.
     */
    ui.SendOnEnterPanel = Class.create(ui.Control,
        {
            /**
             * Constructor
             *
             * @param languageCode  The code (i.e. fr-ca) that specifies which language the editor's tooltips, etc. should appear in.  Case-insensitive.
             */
            initialize: function ($super, languageCode) {
                this._languageCode = languageCode || 'en-us';
                $super(this._buildDomObject());
            },

            /**
             * Resets the panel to its default state
             */
            reset: function () {
                try {
                    this._sendOnEnterCheckboxDomObject.checked = webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.SendOnEnter).getSendOnEnterByDefault(this._languageCode);
                    this._sendNotification();
                } catch (e) {
                    common.Debug.traceError('Caught exception trying to get default send-on-enter behaviour: ' + e);
                }
            },

            _buildDomObject: function () {
                var domObject = this.createElement('div', null, { 'class': 'iwt-send-on-enter-container' });
                var innerDiv = this.createChildElement(domObject, 'div', null, { 'class': 'iwt-send-on-enter-inner-container' });
                this.createChildElement(innerDiv, 'label', null, { 'class': 'iwt-send-on-enter-checkbox-label', 'for': 'iwt-send-on-enter-checkbox' }, null, localization.SendOnEnter);
                this._sendOnEnterCheckboxDomObject = this.createChildElement(innerDiv, 'input', 'iwt-send-on-enter-checkbox', { 'type': 'checkbox', 'class': 'iwt-send-on-enter-checkbox', 'name': 'iwt-send-on-enter-checkbox' });
                this.reset();
                this._sendOnEnterCheckboxDomObject.observe('change', this._onChangeSendOnEnterCheckbox.bindAsEventListener(this));
                this._sendNotification();

                return domObject;
            },

            _onChangeSendOnEnterCheckbox: function (evt) {
                this._sendNotification();
                if (evt) {
                    evt.stop();
                }
            },

            _sendNotification: function () {
                webservices.NotificationRegistry.process(webservices.NotificationFactory.createSendOnEnterNotification(this._sendOnEnterCheckboxDomObject.checked));
            }
        });

    /**
     * ComposeMessagePanel class
     *
     * Handles the UI of the panel in which the web user may type messages to the agent.  For the
     * logic, @see WebServicesComposeMessagePanel.
     */
    ui.ComposeMessagePanel = Class.create(ui.Control,
        {
            /**
             * Constructor
             *
             * @param useHtmlEditor If true, WYSIWYG controls will be displayed.  If false, only a plain text editor will be displayed.  Note that the WYSIWYG editor is not supported at this time.
             * @param languageCode  The code (i.e. fr-ca) that specifies which language the editor's tooltips, etc. should appear in.  Case-insensitive.
             */
            initialize: function ($super, useHtmlEditor, languageCode) {
                if ((arguments.length < 1) || (arguments.length > 4)) {
                    throw common.ExceptionFactory.createException("ComposeMessagePanel constructor called with " + arguments.length + " arguments, but expected 1 - 3.");
                }

                // initialize members
                this._editor = null;
                this._useHtmlEditor = (useHtmlEditor === true);
                this._languageCode = languageCode;
                this._isSendingEnabled = true;
                this._sendOnEnter = true;

                $super(this._buildDomObject());
                this._validateDomObject();

                this._enableSendButton(false);

                this._attachHandlers();
            },

            /**
             * destructor
             */
            destroy: function () {
                ui.Control.prototype.destroy.call(this);
            },

            // public methods

            /**
             * Returns true if WYSIWYG controls are/will be displayed.  Returns false if only a plain text editor is/will be displayed.
             * Note that the WYSIWYG editor is not supported at this time.
             */
            get_useHtmlEditor: function () {
                return this._useHtmlEditor;
            },

            /**
             * Enable or disable the panel.
             *
             * @param enabled If true, the panel will be enabled.  If false, the panel will be disabled.
             */
            enable: function (enabled) {
                this._textAreaDomObject.disabled = !enabled;

                if (enabled) {
                    this._enableSendButtonTimer.start();
                } else {
                    this._enableSendButtonTimer.stop();
                }

                if (this._isMessageTextEmpty()) {
                    this._buttonDomObject.disabled = true;
                }
                else {
                    this._buttonDomObject.disabled = !enabled;
                }
            },

            /**
             * Resets the panel back to its original state.  Text will be cleared and the send button will be disabled.
             */
            reset: function () {
                this._clearMessageText();
                this._enableSendButton(false);
            },

            /**
             * Should be called when the panel receives focus.  Simply diverts focus to the text entry field within the panel.
             */
            focus: function () {
                this._focusEditTextBox();
            },

            /**
             * Enable the panel to send text, or disable the panel from sending text.
             * If the parameter is true AND text is present in the text box, the send button will be enabled.
             * Otherwise the send button will be disabled.
             *
             * @param enable If true, sending will be enabled.  If false, sending will be disabled.
             */
            enableSending: function (enable) {
                this._isSendingEnabled = enable;
                this._enableSendButton(!this._isMessageTextEmpty());
            },

            // private methods

            _attachHandlers: function () {
                Event.observe(this._buttonDomObject, 'click', this._onClickSendButton.bindAsEventListener(this));
                Event.observe(this._textAreaDomObject, 'focusin', this._onComposeMessageInputGotFocus.bindAsEventListener(this));
                Event.observe(this._textAreaDomObject, 'focusout', this._onComposeMessageInputLostFocus.bindAsEventListener(this));

                if (!this._useHtmlEditor) {
                    this._textAreaDomObject.observe('keyup', this._onKeyUpTextBox.bindAsEventListener(this));
                }

                this._enableSendButtonTimer = new webservices.RecurringTimer(300);
                var _self = this;
                this._enableSendButtonTimer.registerSuccessListener(function () { _self._onEnableSendButtonTimer(); });
            },

            _onComposeMessageInputGotFocus: function (e) {
                webservices.ProblemReporter.sendProblemReport("Programmer error - abstract method not overridden. This code should be unreachable.", "ComposeMessagePanel._onComposeMessageInputLostFocus()");
            },

            _onComposeMessageInputLostFocus: function (e) {
                webservices.ProblemReporter.sendProblemReport("Programmer error - abstract method not overridden. This code should be unreachable.", "ComposeMessagePanel._onComposeMessageInputLostFocus()");
            },

            _onEnableSendButtonTimer: function () {
                this._enableSendButton(!this._isMessageTextEmpty());
            },

            _onKeyUpTextBox: function (evt) {
                if (this._isEnterKey(evt)) {
                    if (!this._isMessageTextEmpty()) {
                        if (this._sendOnEnter) {
                            this._onClickSendButton();
                        }
                    }
                    else {
                        this._clearMessageText();
                    }
                }
            },

            _isEnterKey: function (evt) {
                if (this._useHtmlEditor) {
                    return (!evt.data.$.shiftKey && (evt.data.getKey() == 13));
                }
                else {
                    return !evt.shiftKey && (evt.keyCode == 13);
                }
            },

            _onClickSendButton: function () {
                if (this._isSendingEnabled) {
                    var text = this._getMessageText();
                    if (text) {
                        this._clearMessageText();
                        this._enableSendButton(false);
                        this._sendMessage(text);
                        this._focusEditTextBox();
                    }
                }
            },

            _onMessageSendFailed: function (errorMessage, messageThatFailedToSend) {
                common.Debug.traceMethodEntered("ComposeMessagePanel._onMessageSendFailed()");
                /*
            if (errorMessage)
            {
                // TODO: Make MainPanel implement IStatusManager and call setErrorStatus() on it. Also make _onClickSendButton() call that.clearStatus()
            }
            */

                if (messageThatFailedToSend) {
                    this._setMessageText(messageThatFailedToSend);
                }

                this._enableSendButton(true);
                this._focusEditTextBox();
                common.Debug.traceMethodExited("ComposeMessagePanel._onMessageSendFailed()");
            },

            _sendMessage: function (text) {
                window.alert("Due to a programmatic error, this message can not be sent. A problem report will be created.\n" + text);
                webservices.ProblemReporter.sendProblemReport("Programmer error - abstract method not overridden. This code should be unreachable.", "ComposeMessagePanel._sendMessage()");
            },

            _enableSendButton: function (enabled) {
                if (!this._isSendingEnabled) {
                    enabled = false;
                }

                this._buttonDomObject.disabled = !enabled;
            },

            _getMessageText: function () {
                var text = '';

                if (this._useHtmlEditor) {
                    var editor = this._getEditor();
                    if (editor) {
                        text = editor.getData();
                        text = this._cleanHtmlOutput(text);
                    }
                }
                else {
                    text = this._textAreaDomObject.value;
                    text = this._cleanPlainTextOutput(text);
                }

                return text;
            },

            _cleanHtmlOutput: function (text) {
                var strippedText = text;

                var whitespaceArray = ['<p>\n\t&nbsp;</p>', '\n', '\r', '\t', '&nbsp;', '<p>', '</p>', '<div>', '</div>'];
                strippedText = this._removeAllPrefixes(strippedText, whitespaceArray);
                strippedText = this._removeAllSuffixes(strippedText, whitespaceArray);

                return strippedText;
            },

            _removeAllPrefixes: function (text, prefixArray) {
                var strippedText = text;

                var originalText = null;
                do {
                    originalText = strippedText;
                    strippedText = this._removePrefixes(originalText, prefixArray);
                }
                while (strippedText != originalText);

                return strippedText;
            },

            _removePrefixes: function (text, prefixArray) {
                for (var i = 0; i < prefixArray.length; ++i) {
                    text = this._removePrefix(text, prefixArray[i]);
                }

                return text;
            },

            _removePrefix: function (text, prefix) {
                if (text.length >= prefix.length) {
                    if (text.substr(0, prefix.length) == prefix) {
                        return text.substr(prefix.length, text.length - prefix.length);
                    }
                }

                return text;
            },

            _removeAllSuffixes: function (text, suffixArray) {
                var strippedText = text;

                var originalText = null;
                do {
                    originalText = strippedText;
                    strippedText = this._removeSuffixes(originalText, suffixArray);
                }
                while (strippedText != originalText);

                return strippedText;
            },

            _removeSuffixes: function (text, suffixArray) {
                for (var i = 0; i < suffixArray.length; ++i) {
                    text = this._removeSuffix(text, suffixArray[i]);
                }

                return text;
            },

            _removeSuffix: function (text, suffix) {
                if (text.length >= suffix.length) {
                    if (text.substr(text.length - suffix.length, suffix.length) == suffix) {
                        return text.substr(0, text.length - suffix.length);
                    }
                }

                return text;
            },

            _cleanPlainTextOutput: function (text) {
                if ((text.length > 0) && (text[0] == '\n')) {
                    text = text.substring(1);
                }
                return text;
            },

            _clearMessageText: function () {
                this._setMessageText('');
            },

            _setMessageText: function (text) {
                if (this._useHtmlEditor) {
                    var editor = this._getEditor();
                    if (editor) {
                        this._setEditorText(text);
                    }
                }
                else {
                    this._textAreaDomObject.value = text;
                }
            },

            _setEditorText: function (text) {
                // this works, but it seems to undo the keyup handler and can't put it back
                // editor.setData(text);

                var iframe = window.frames[0];
                if (iframe.document) {
                    var bodies = iframe.document.getElementsByTagName('body');
                    if (bodies && bodies.length == 1) {
                        var body = bodies[0];
                        body.innerHTML = text;
                    }
                }
            },

            _isMessageTextEmpty: function () {
                if (this._getMessageText().length === 0) {
                    return true;
                }
                return this._getMessageText().strip().length === 0;
            },

            _getEditor: function () {
                return this._editor;
                //        return CKEDITOR.instances['input-panel'];
            },

            _focusEditTextBox: function () {
                try {
                    if (this._useHtmlEditor) {
                        this._getEditor().focus();
                    }
                    else {
                        this._textAreaDomObject.focus();
                    }
                } catch (e) {
                }
            },

            _validateDomObject: function () {
                if (!this._textAreaDomObject) {
                    throw common.ExceptionFactory.createException("Text box row not found;");
                }

                if (!this._buttonDomObject) {
                    throw common.ExceptionFactory.createException("Button not found;");
                }
            },

            _buildDomObject: function () {
                var domObject = this.createElement('div', null, { 'class': 'iwt-compose-message-panel', 'useHtmlEditor': (this._useHtmlEditor ? 'true' : 'false') });
                var formObject = this.createChildElement(domObject, 'form', null, { 'class': 'iwt-compose-message-form', 'action': '#' });
                formObject.onsubmit = function () { return false; }
                this._textAreaDomObject = this.createChildElement(formObject, 'textarea', 'iwt-compose-message-textarea', { 'class': 'iwt-input', 'name': 'iwt-compose-message-textarea' });
                this._buttonDomObject = this.createChildElement(formObject, 'input', 'iwt-sendButton', { 'type': 'button', 'value': localization.Send, 'class': 'iwt-send-button', 'name': 'iwt-send-button' });

                if (this._useHtmlEditor) {
                    this._useCkEditor();
                }

                return domObject;
            },

            _useCkEditor: function () {
                var options = {
                    skin: 'office2003',
                    width: '602px',
                    height: '60px',
                    toolbar:
                        [
                            ['FontSize', 'Bold', 'Italic', '-', 'TextColor', 'BGColor']
                        ]
                };

                if (this._languageCode) {
                    options.language = ui.LanguageCodeConverter.convertLanguageCodeToCKEditorLanguageCode(this._languageCode);
                }

                this._editor = CKEDITOR.replace(this._textAreaDomObject, options);

                this._editor.config.resize_enabled = false;
                this._editor.config.toolbarCanCollapse = false;

                // even though the document is supposed to be loaded, we still need to give CKEditor a little extra time
                // before attaching handlers
                this._setCKActionsTimeout();
            },

            _setCKActionsTimeout: function () {
                window.setTimeout(this._postTimeoutCKActions.bindAsEventListener(this), 1000);
            },

            _postTimeoutCKActions: function () {
                if (!this._readyForCKActions()) {
                    this._setCKActionsTimeout();
                }
                else {
                    this._attachCKHandlers();
                    this._hideStatusBar();
                }
            },

            _readyForCKActions: function () {
                var editor = this._getEditor();
                if (editor) {
                    return !(!(editor.document));
                }

                return false;
            },

            _hideStatusBar: function () {
                var ckeditorArray = Element.select(this.get_domObject(), '.cke_editor');
                if (ckeditorArray && ckeditorArray.length == 1) {
                    var tableRowArray = Element.select(ckeditorArray[0], 'tr');
                    if (tableRowArray && tableRowArray.length == 3) {
                        Element.setStyle(tableRowArray[2], { display: 'none' });
                    }
                }
            },

            _attachCKHandlers: function () {
                var editor = this._getEditor();
                var editorDocument = editor.document;
                var self = this;
                editorDocument.on('keyup', function (event) {
                    self._onKeyUpTextBox(event);
                });
            }
        });
    /**
     * WebServicesComposeMessagePanel class
     *
     * Handles the logic of the panel in which the web user may type messages to the agent.  For the
     * UI, @see ComposeMessagePanel.
     */
    ui.WebServicesComposeMessagePanel = Class.create(ui.ComposeMessagePanel,
        {
            /**
             * Constructor
             *
             * @param typingIndicator An instance of a class derived from webservicesTypingIndicatorBase, which will be notified when the user starts or stops typing.
             * @param useHtmlEditor If true, a WYSIWYG editor will be displayed.  If false, a plain text editor will be displayed.  Note that the WYSIWYG editor is not supported at this time.
             * @param languageCode  The code (i.e. fr-ca) that specifies which language the editor's tooltips, etc. should appear in.  Case-insensitive.
             */
            initialize: function ($super, typingIndicator, useHtmlEditor, languageCode) {
                if ((arguments.length == 0) || (arguments.length > 5)) {
                    throw common.ExceptionFactory.createException("WebServicesComposeMessagePanel constructor called with " + arguments.length + " arguments, but expected 1-4.");
                }

                $super(useHtmlEditor, languageCode);

                this.addImplementedInterface(webservices.Interfaces.IChatCreationNotificationObserver, webservices);
                this.addImplementedInterface(webservices.Interfaces.IParticipantLeftNotificationObserver, webservices);
                this.addImplementedInterface(webservices.Interfaces.IFailoverUINotificationObserver, webservices);
                this.addImplementedInterface(webservices.Interfaces.IResumedPollingNotificationObserver, webservices);
                this.addImplementedInterface(webservices.Interfaces.IRefreshPageNotificationObserver, webservices);
                this.addImplementedInterface(webservices.Interfaces.ISendOnEnterNotificationObserver, webservices);

                this._typingIndicator = typingIndicator;
                this._awaitingReconnect = false;
                this._neverReenable = false;
            },

            // public methods

            /**
             * Setter for the chat manager
             *
             * @param chatManager An instance of a subclass of webservices.ChatManagerBase
             */
            set_chatManager: function (chatManager) {
                this._chatManager = chatManager;
            },

            /**
             * Disables this panel when the current user ceases being a participant in the chat.
             *
             * @param notification Something that implements webservices.Interfaces.IParticipantLeftNotification
             */
            processParticipantLeftNotification: function (notification) {
                common.Interface.ensureImplements(notification, webservices.Interfaces.IParticipantLeftNotification);
                if (notification.get_participantId() == webservices.ParticipantRepository.get_currentParticipantId()) {
                    this.enable(false);
                }
            },

            /**
             * Event listener for failovers
             *
             * @param notification Something that implements webservices.Interfaces.IFailoverNotification
             */
            processFailoverUINotification: function (notification) {
                common.Interface.ensureImplements(notification, webservices.Interfaces.IFailoverUINotification);

                this._awaitingReconnect = true;
                this.enable(false);
                this.enableSending(false);
            },

            /**
             * Event listener for resumption of polling following reconnection of the chat
             *
             * @param notification Something that implements webservices.Interfaces.IResumedPollingNotification
             */
            processResumedPollingNotification: function (notification) {
                common.Interface.ensureImplements(notification, webservices.Interfaces.IResumedPollingNotification);

                if (!this._neverReenable) {
                    this._awaitingReconnect = false;
                    this.enable(true);
                    this.enableSending(true);
                }
            },

            /**
             * Event listener for creation of a chat
             *
             * @param notification Something that implements webservices.Interfaces.IChatCreationNotification
             */
            processChatCreationNotification: function (notification) {
                common.Interface.ensureImplements(notification, webservices.Interfaces.IChatCreationNotification);

                if (!this._neverReenable) {
                    this._awaitingReconnect = false;
                    this.enableSending(true);
                }
            },

            /**
             * Event listener.  Will be called if the user refreshes the page.  Disables the panel AND makes it so that it
             * can never be enabled again, since it is no longer visible.
             *
             * @param notification Something that implements IRefreshPageNotification
             */
            processRefreshPageNotification: function (notification) {
                common.Interface.ensureImplements(notification, webservices.Interfaces.IRefreshPageNotification);

                this.enable(false);
                this.enableSending(false);

                // if we got this notification, no matter what else we get, we can't act on it
                this._neverReenable = true;
            },

            /**
             * Event listener.  Will be called if the user toggles the "Send on Enter" checkbox.
             *
             * @param notification Something that implements ISendOnEnterNotification
             */
            processSendOnEnterNotification: function (notification) {
                common.Interface.ensureImplements(notification, webservices.Interfaces.ISendOnEnterNotification);

                this._sendOnEnter = notification.get_shouldSendOnEnter();
                this.focus();
            },

            // private methods

            /**
             * This class is a subclass of ui.ComposeMessagePanel.  This method essentially calls
             * super.enable().  However, if the chat is awaiting reconnection or in a state in which it must never
             * be re-enabled, the parameter to super.enable() will be false, regardless of what is passed to this method.
             *
             * @param enabled If true AND the chat is connected, the UI panel will be enabled.  If false OR the chat is not connected, the UI panel will be disabled.
             */
            enable: function (enabled) {
                if (this._awaitingReconnect || this._neverReenable) {
                    enabled = false;
                }
                ui.ComposeMessagePanel.prototype.enable.call(this, enabled);
            },

            /**
             * This class is a subclass of ui.ComposeMessagePanel.  This method essentially calls
             * super.enableSending().  However, if the chat is not connected, the parameter to super.enableSending() will be
             * false, regardless of what is passed to this method.
             *
             * @param enabled If true AND the chat is connected, the UI panel will indicate that sending is enabled.  If false OR the chat is not connected, the UI panel will indicate that sending is disabled.
             */
            enableSending: function (enabled) {
                if (this._awaitingReconnect || this._neverReenable) {
                    enabled = false;
                }
                ui.ComposeMessagePanel.prototype.enableSending.call(this, enabled);
            },

            _onKeyUpTextBox: function (evt) {
                try {
                    this._typingIndicator.keyPressed();
                    ui.ComposeMessagePanel.prototype._onKeyUpTextBox.call(this, evt); // Allow superclass to also handle the event
                }
                catch (ex) {
                    common.Debug.traceError(ex.message);
                    common.Debug.alert(ex.message);
                    webservices.ProblemReporter.sendProblemReport(ex, "WebServicesComposeMessagePanel._onKeyUpTextBox()");
                }
            },

            _onComposeMessageInputGotFocus: function (e) {
                this._dispatchCustomEvent('composeMsgInputFocusIn');
            },

            _onComposeMessageInputLostFocus: function (e) {
                this._dispatchCustomEvent('composeMsgInputFocusOut');
            },

            // dispatch a custom event to bubble up to the containing object
            _dispatchCustomEvent: function (type) {
                var focusEvent = new CustomEvent("composeInputFocusChange", {
                    detail: {
                        eventType: type
                    },
                    bubbles: true,
                    cancelable: false
                });
                this._textAreaDomObject.dispatchEvent(focusEvent);
            },

            _sendMessage: function (text) {
                this._chatManager.sendMessage(text, this.get_useHtmlEditor(), this._onMessageSendAttemptCompleted.bind(this, text));
            },

            /**
             * Called when an attempt to send a message has finished, whether successful or not.
             *
             * @param text The message that we attempted to send
             * @param success Whether the attempt succeeded
             * @param response An instance of ChatResponse. All the events, etc. will have already been handled before getting to this point - it is included here only to allow any error condition to be examined.
             */
            _onMessageSendAttemptCompleted: function (text, success, response) {
                common.Debug.traceMethodEntered("WebServicesComposeMessagePanel._onMessageSendAttemptCompleted()");
                if (!success) {
                    common.Debug.traceError(ui.ErrorDisplayTextBuilder.build(response.get_statusReason(), 'Failed to send message'));
                    webservices.ProblemReporter.sendProblemReport(response, "WebServicesComposeMessagePanel._sendCallback()");

                    this._onMessageSendFailed(localization.FailedToSendMessage, text);
                }
                common.Debug.traceMethodExited("WebServicesComposeMessagePanel._onMessageSendAttemptCompleted()");
            }
        });
    /**
     * ParticipantsPanel class
     * This is the panel that displays the list of participants that are currently members of the chat.
     */
    ui.ParticipantsPanel = Class.create(ui.Control,
        {
            /**
             * Constructor
             */
            initialize: function ($super) {
                var numArgs = 1;
                if (arguments.length != numArgs) {
                    throw common.ExceptionFactory.createException("ParticipantsPanel constructor called with " + arguments.length + " arguments, but expected " + numArgs + ".");
                }

                $super(this._buildDomObject());
                this._validateDomObject();
            },

            /**
             * Destructor
             */
            destroy: function () {
                ui.Control.prototype.destroy.call(this);
            },

            // public methods

            /**
             * This method resets the panel to its original state.  It clears the list of participants.
             */
            reset: function () {
                $j(this._list).empty();
            },

            // private methods

            _buildParticipantDomObjectId: function (participantId) {
                return 'iwt-chat-participant-' + participantId;
            },

            _getParticipantDomObject: function (participantId) {
                return document.getElementById(this._buildParticipantDomObjectId(participantId));
            },

            _getParticipantNameElements: function (participantId) {
                var domObject = this._getParticipantDomObject(participantId);
                if (domObject) {
                    return Element.select(domObject, '[participant-name=true]');
                }

                return null;
            },

            _getParticipantImageDivs: function (participantId) {
                var domObject = this._getParticipantDomObject(participantId);
                if (domObject) {
                    return Element.select(domObject, '[participant-avatar=true]');
                }

                return null;
            },

            _getParticipantSupplementalInfo: function (participantId) {
                var domObject = this._getParticipantDomObject(participantId);
                if (!domObject) {
                    common.Debug.traceWarning('No participant with id: ' + participantId);
                }
                else {
                    var elementArray = Element.select(domObject, '.iwt-chat-participant-popover-supplementalInfo');
                    if (elementArray && elementArray.length == 1) {
                        return elementArray[0];
                    }
                }
                return null;
            },

            _getParticipantPopover: function (participantId) {
                var domObject = this._getParticipantDomObject(participantId);
                if (!domObject) {
                    common.Debug.traceWarning('No participant with id: ' + participantId);
                }
                else {
                    var elementArray = Element.select(domObject, 'div.iwt-chat-participant-popover');
                    if (elementArray && elementArray.length == 1) {
                        return elementArray[0];
                    }
                }
                return null;
            },

            _addParticipantSelf: function (participantId, participantName) {
                var participant = this._addParticipant(participantId, participantName);
                Element.addClassName(participant, 'iwt-chat-participant-self');
            },

            _addParticipantOther: function (participantId, participantName) {
                var participant = this._addParticipant(participantId, participantName);
                Element.addClassName(participant, 'iwt-chat-participant-other');
                this._addParticipantPopover(participant, participantId, participantName);
            },

            _addParticipant: function (participantId, participantName) {
                var row = this.createChildElement(this._list, 'div', this._buildParticipantDomObjectId(participantId), { 'class': 'iwt-chat-participant' });

                var avatar = this.createChildElement(row, 'div', null, { 'class': 'iwt-chat-participant-avatar-cell' });
                this.createChildElement(avatar, 'div', null, { 'participant-avatar': 'true', 'class': 'iwt-chat-participant-avatar' });

                var typingIndicator = this.createChildElement(row, 'div', null, { 'class': 'iwt-chat-participant-typing-indicator-cell' });
                var imgDiv = this.createChildElement(typingIndicator, 'div', null, { 'class': 'iwt-chat-participant-typing-indicator-img' });

                this.createChildElement(row, 'div', null, { 'participant-name': 'true', 'class': 'iwt-chat-participant-name' }, null, webservices.ParticipantDisplayNameFormatter.formatDisplayNameFromIdAndName(participantId, participantName));
                this.createChildElement(row, 'div', null, { 'class': 'iwt-chat-participant-typing-status' }, null, localization.Typing);

                this._markParticipantOrder();

                return row;
            },

            _addParticipantPopover: function (parent, participantId, participantName) {
                var popoverDiv = this.createChildElement(parent, 'div', null, { 'class': 'iwt-chat-participant-popover' }, null);
                var container = this.createChildElement(popoverDiv, 'div', null, { 'class': 'iwt-chat-participant-popover-content' });
                var left = this.createChildElement(container, 'div', null, { 'class': 'iwt-chat-participant-popover-avatar-div' });
                this.createChildElement(left, 'div', null, { 'participant-avatar': 'true', 'class': 'iwt-chat-participant-popover-avatar' });
                var right = this.createChildElement(container, 'div', null, { 'class': 'iwt-chat-participant-popover-text-div' });
                this.createChildElement(right, 'span', null, { 'participant-name': 'true', 'class': 'iwt-chat-participant-popover-name' }, null, webservices.ParticipantDisplayNameFormatter.formatDisplayNameFromIdAndName(participantId, participantName));
                this.createChildElement(right, 'br');
                this.createChildElement(right, 'span', null, { 'class': 'iwt-chat-participant-popover-supplementalInfo' });

                Element.hide(popoverDiv);
                var _self = this;
                Element.observe(parent, 'click', this._toggleParticipantPopover.bind(_self, participantId));
            },

            _removeParticipant: function (participantId) {
                var domObject = this._getParticipantDomObject(participantId);
                if (domObject) {
                    Element.remove(domObject);
                }

                this._markParticipantOrder();
            },

            _markParticipantOrder: function () {
                if (this._list.childNodes.length >= 1) {
                    Element.removeClassName(this._list.childNodes[0], 'iwt-chat-not-first-participant');
                    for (var i = 1; i < this._list.childNodes.length; ++i) {
                        Element.addClassName(this._list.childNodes[i], 'iwt-chat-not-first-participant');
                    }
                }
            },

            _setParticipantName: function (participantId, newParticipantName) {
                var elementArray = this._getParticipantNameElements(participantId);
                if (!elementArray || elementArray.length < 1) {
                    common.Debug.traceWarning('No name tag for participant with id: ' + participantId);
                }
                else {
                    for (var i = 0; i < elementArray.length; ++i) {
                        var div = elementArray[i];
                        // IE doesn't respect the height of the row after doing this fade out/fade in trick
                        if (!common.Browser.isIE()) {
                            $j(div).fadeOut("normal");
                            $j(div).hide();
                        }

                        $j(div).text(newParticipantName);

                        if (!common.Browser.isIE()) {
                            $j(div).fadeIn("normal");
                        }
                    }
                }
            },

            _setParticipantStartedTyping: function (participantId) {
                var participant = this._getParticipantDomObject(participantId);
                if (!participant) {
                    common.Debug.traceWarning('No participant with id: ' + participantId);
                }
                else {
                    Element.addClassName(participant, 'iwt-chat-participant-typing');
                }
            },

            _setParticipantStoppedTyping: function (participantId) {
                var participant = this._getParticipantDomObject(participantId);
                if (!participant) {
                    common.Debug.traceWarning('No participant with id: ' + participantId);
                }
                else {
                    Element.removeClassName(participant, 'iwt-chat-participant-typing');
                }
            },

            _setParticipantPhoto: function (participantId, url) {
                var divArray = this._getParticipantImageDivs(participantId);
                if (!divArray || divArray.length < 1) {
                    common.Debug.traceWarning('No photo tag for participant with id: ' + participantId);
                }
                else {
                    if (url) {
                        var fullUrl = "/" + webservices.Servers.CurrentUriFragment + url;
                        for (var i = 0; i < divArray.length; ++i) {
                            var imgDiv = divArray[i];
                            imgDiv.style.backgroundImage = "url(" + fullUrl + ")";
                            imgDiv.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + fullUrl + "', sizingMethod='scale')"; // IE hack to resize the big image into a small div
                            Element.show(imgDiv);
                        }
                    }
                    else {
                        for (var i = 0; i < divArray.length; ++i) {
                            // Hide only if there is not a default/generic avatar.
                            var style = divArray[i].currentStyle || window.getComputedStyle(divArray[i]); // IE way || all other browsers way
                            if (!style.backgroundImage) {
                                Element.hide(divArray[i]);
                            }
                        }
                    }
                }
            },

            _setParticipantLastRespondedTime: function (participantId, dateTime) {
                var span = this._getParticipantSupplementalInfo(participantId);
                if (!span) {
                    common.Debug.traceWarning('No last responded tag for participant with id: ' + participantId);
                }
                else {
                    var formattedTime = ui.DateTimeFormatter.formatTimeForDisplay(dateTime, false);
                    $j(span).text(localization.LastRespondedTime.replace('%0', formattedTime));
                }
            },

            _toggleParticipantPopover: function (participantId) {
                if (this.isPhotoAvailable(participantId)) {
                    var popover = this._getParticipantPopover(participantId);
                    if (popover) {
                        if (popover.visible()) {
                            Element.hide(popover);
                        } else {
                            Element.show(popover);
                        }
                    }
                }
            },

            _setParticipantActive: function (participantId) {
                var elementArray = this._getParticipantNameElements(participantId);
                if (!elementArray || elementArray.length < 1) {
                    common.Debug.traceWarning('No participant with id: ' + participantId);
                }
                else {
                    for (var i = 0; i < elementArray.length; ++i) {
                        Element.removeClassName(elementArray[i], 'iwt-chat-participant-held');
                    }
                }
            },

            _setParticipantHeld: function (participantId) {
                var elementArray = this._getParticipantNameElements(participantId);
                if (!elementArray || elementArray.length < 1) {
                    common.Debug.traceWarning('No participant with id: ' + participantId);
                }
                else {
                    for (var i = 0; i < elementArray.length; ++i) {
                        Element.addClassName(elementArray[i], 'iwt-chat-participant-held');
                    }
                }
            },

            _buildDomObject: function () {
                var participantsPanel = this.createElement('div', 'participantsPanel', { 'class': 'iwt-chat-participants-panel' });

                var tabVisibility = webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.TabVisibility);
                if (!tabVisibility.disablePrintableChatHistory()) {
                    var viewPrintableChatHistoryDiv = this.createChildElement(participantsPanel, 'div', null, { 'class': 'iwt-print-div' });
                    var viewPrintableChatHistoryLink = this.createChildElement(viewPrintableChatHistoryDiv, 'a', null, { 'href': '#', 'class': 'iwt-chat-printable-history-link' }, null, localization.PrintableChatHistory);
                    Element.observe(viewPrintableChatHistoryLink, 'click', this._onClickViewPrintableChatHistory.bindAsEventListener(this));
                }

                var wrapperDiv = this.createChildElement(participantsPanel, 'div', null, { 'class': 'iwt-participants-panel-list-container' });
                this._list = this.createChildElement(wrapperDiv, 'div', 'iwt-participants-panel-list');

                return participantsPanel;
            },

            _onClickViewPrintableChatHistory: function () {
                var messages = webservices.ReceivedMessageRepository.get_messages();
                var html = this._formatMessagesIntoHtml(messages);
                this._popUpWindow(html);
            },

            _formatMessagesIntoHtml: function (messages) {
                var dir = localization.TextDirection;
                var lang = localization.LanguageCode;

                var pre = '<html>' +
                    '<head>' +
                    '    <title>' +
                    localization.ChatHistory +
                    '</title>' +
                    '<link rel="Stylesheet" type="text/css" href="printableHistory.css" media="all" />' +
                    '</head>' +
                    '<body dir="' + dir + '" lang="' + lang + '">' +
                    '<a href="javascript:window.print()">' +
                    localization.Print +
                    '</a>' +
                    '<table>';

                var post = '</table>' +
                    '<a href="javascript:window.print()">' +
                    localization.Print +
                    '</a>' +
                    '<div class="linkDisclaimerDiv"><i>' +
                    localization.LinkDisclaimer +
                    '</i></div>' +
                    '</body>' +
                    '</html>';


                var content = '';
                this._lastMessageDate = null;
                for (var i = 0; i < messages.length; ++i) {
                    var message = messages[i];
                    content += this._formatMessageIntoHtml(message);
                }

                return pre + content + post;
            },

            _formatMessageIntoHtml: function (message) {
                common.Interface.ensureImplements(message, webservices.Interfaces.IMessageData);

                var html = '<tr><td class="time">' +
                    ui.DateTimeFormatter.formatTimeForDisplay(message.get_date(), (this._lastMessageDate != message.get_date().getDate())) +
                    '</td><td class="name">' + message.get_name() + ':</td><td class="message">' +
                    webservices.Utilities.escapeHTML(message.get_text()) + '</td></tr>';

                this._lastMessageDate = message.get_date().getDate();

                return html;
            },

            _popUpWindow: function (html) {
                common.Debug.traceMethodEntered("ParticipantsPanel._popUpWindow()");
                var windowTitle = 'Chat_History';
                var windowFeatures = 'width=' + (screen.width * 3 / 4) + ', height=' + (screen.height * 3 / 4) + ', dependent=no, toolbar=no, location=no, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=yes';

                try {
                    var newWin = window.open('', windowTitle, windowFeatures);
                    newWin.document.write(html);
                    newWin.document.close();
                }
                catch (ex) {
                    common.Debug.traceError("Caught unhandled exception:\n" + ex);
                    common.Debug.alert("Caught unhandled exception:\n" + ex);
                    webservices.ProblemReporter.sendProblemReport(ex, "ParticipantsPanel._popUpWindow()");
                    window.alert(localization.ErrorOpeningWindow);
                }
                common.Debug.traceMethodExited("ParticipantsPanel._popUpWindow()");
            },

            _validateDomObject: function () {
                if (!this._list) {
                    throw common.ExceptionFactory.createException("Participant list not found");
                }
            }
        });
    /**
     * WebServicesParticipantsPanel class
     * Listens for notifications that a chat participant has joined the conversation, left the conversation, put the
     * conversation on hold, etc. and then calls the appropriate methods of the superclass.
     * Basically, this class is the "glue" between NotificationRegistry and ParticipantsPanel.
     */
    ui.WebServicesParticipantsPanel = Class.create(ui.ParticipantsPanel,
        {
            /**
             * constructor
             */
            initialize: function ($super) {
                var numArgs = 1;
                if (arguments.length != numArgs) {
                    throw common.ExceptionFactory.createException("WebServicesParticipantsPanel constructor called with " + arguments.length + " arguments, but expected " + numArgs + ".");
                }

                $super();

                this.addImplementedInterface(webservices.Interfaces.IParticipantJoinedNotificationObserver, webservices);
                this.addImplementedInterface(webservices.Interfaces.IParticipantLeftNotificationObserver, webservices);
                this.addImplementedInterface(webservices.Interfaces.IParticipantNameChangedNotificationObserver, webservices);
                this.addImplementedInterface(webservices.Interfaces.IParticipantStartedTypingNotificationObserver, webservices);
                this.addImplementedInterface(webservices.Interfaces.IParticipantStoppedTypingNotificationObserver, webservices);
                this.addImplementedInterface(webservices.Interfaces.IChatReconnectUINotificationObserver, webservices);
                this.addImplementedInterface(webservices.Interfaces.IPartyInfoNotificationObserver, webservices);

                // For the popover
                this.addImplementedInterface(webservices.Interfaces.IReceivedTextNotificationObserver, webservices);
                this.addImplementedInterface(webservices.Interfaces.IReceivedUrlNotificationObserver, webservices);
                this.addImplementedInterface(webservices.Interfaces.IReceivedFileNotificationObserver, webservices);

                // for debugging only
                this.addImplementedInterface(webservices.Interfaces.IParticipantActiveNotificationObserver, webservices);
                this.addImplementedInterface(webservices.Interfaces.IParticipantHeldNotificationObserver, webservices);
                // for debugging only
            },

            // public methods

            /**
             * Called when a participant has joined the chat.  Calls whatever is necessary to make the UI reflect this.
             *
             * @param notification Something that implements IParticipantJoinedNotification
             */
            processParticipantJoinedNotification: function (notification) {
                common.Interface.ensureImplements(notification, webservices.Interfaces.IParticipantJoinedNotification);

                var id = notification.get_participantId();
                var name = webservices.ParticipantRepository.get_participant(id).get_name();
                if (webservices.ParticipantRepository.get_currentParticipantId() == id) {
                    this._addParticipantSelf(id, name);
                }
                else {
                    this._addParticipantOther(id, name);
                }
            },

            /**
             * Event listener for reconnection of the chat
             *
             * @param notification Something that implements webservices.Interfaces.IChatReconnectUINotification
             */
            processChatReconnectUINotification: function (notification) {
                common.Interface.ensureImplements(notification, webservices.Interfaces.IChatReconnectUINotification);

                this.reset();
            },

            /**
             * Called when a participant has left the chat.  Calls whatever is necessary to make the UI reflect this.
             *
             * @param notification Something that implements IParticipantLeftNotification
             */
            processParticipantLeftNotification: function (notification) {
                common.Interface.ensureImplements(notification, webservices.Interfaces.IParticipantLeftNotification);
                this._removeParticipant(notification.get_participantId());
            },

            /**
             * Called when a participant's name has changed.  Calls whatever is necessary to make the UI reflect this.
             *
             * @param notification Something that implements IParticipantNameChangedNotification
             */
            processParticipantNameChangedNotification: function (notification) {
                common.Interface.ensureImplements(notification, webservices.Interfaces.IParticipantNameChangedNotification);
                this._setParticipantName(notification.get_participantId(), notification.get_newParticipantName());
            },

            /**
             * For debugging only
             * @param notification Something that implements IParticipantActiveNotification
             */
            processParticipantActiveNotification: function (notification) {
                common.Interface.ensureImplements(notification, webservices.Interfaces.IParticipantActiveNotification);
                this._setParticipantActive(notification.get_participantId());
            },

            /**
             * Called when a participant has placed the chat on hold.  Calls whatever is necessary to make the UI reflect this.
             *
             * @param notification Something that implements IParticipantHeldNotification
             */
            processParticipantHeldNotification: function (notification) {
                common.Interface.ensureImplements(notification, webservices.Interfaces.IParticipantHeldNotification);
                this._setParticipantHeld(notification.get_participantId());
            },

            /**
             * Called when a participant has started typing.  Calls whatever is necessary to make the UI reflect this.
             *
             * @param notification Something that implements IParticipantStartedTypingNotification
             */
            processParticipantStartedTypingNotification: function (notification) {
                common.Interface.ensureImplements(notification, webservices.Interfaces.IParticipantStartedTypingNotification);
                this._setParticipantStartedTyping(notification.get_participantId());
            },

            /**
             * Called when a participant has stopped typing.  Calls whatever is necessary to make the UI reflect this.
             *
             * @param notification Something that implements IParticipantStoppedTypingNotification
             */
            processParticipantStoppedTypingNotification: function (notification) {
                common.Interface.ensureImplements(notification, webservices.Interfaces.IParticipantStoppedTypingNotification);
                this._setParticipantStoppedTyping(notification.get_participantId());
            },

            /**
             * Respond to receipt of information (name, photo location) about a
             * party involved in an interaction (not necessarily this interaction!)
             *
             * @param notification
             */
            processPartyInfoNotification: function (notification) {
                common.Debug.traceMethodEntered("WebServicesParticipantsPanel.processPartyInfoNotification()");
                common.Interface.ensureImplements(notification, webservices.Interfaces.IPartyInfoNotification);

                if (notification.get_localParticipantId() == webservices.ParticipantRepository.get_currentParticipantId()) {
                    var agentPhoto = notification.get_photo();
                    if (agentPhoto) {
                        this._setParticipantPhoto(notification.get_remoteParticipantId(), agentPhoto);
                    }
                    else {
                        this._setParticipantPhoto(notification.get_remoteParticipantId(), null);
                    }
                }

                common.Debug.traceMethodExited("WebServicesParticipantsPanel.processPartyInfoNotification()");
            },

            /**
             * Implementation of IReceivedTextNotificationObserver
             * Updates the last response time in the participant's popover
             *
             * @param notification Something that implements IReceivedTextNotification
             */
            processReceivedTextNotification: function (notification) {
                common.Interface.ensureImplements(notification, webservices.Interfaces.IReceivedTextNotification);

                this._participantResponded(notification.get_participantId(), notification.get_dateTime());
            },

            /**
             * Implementation of IReceivedUrlNotificationObserver
             * Adds the received URL to the panel.
             *
             * @param notification Something that implements IReceivedUrlNotification
             */
            processReceivedUrlNotification: function (notification) {
                common.Interface.ensureImplements(notification, webservices.Interfaces.IReceivedUrlNotification);

                this._participantResponded(notification.get_participantId(), notification.get_dateTime());
            },

            /**
             * Implementation of IReceivedFileNotificationObserver
             * Adds a link to the received file to the panel.
             *
             * @param notification Something that implements IReceivedFileNotification
             */
            processReceivedFileNotification: function (notification) {
                common.Interface.ensureImplements(notification, webservices.Interfaces.IReceivedFileNotification);

                this._participantResponded(notification.get_participantId(), notification.get_dateTime());
            },

            /**
             * Returns true if the supplied participantId specifies a participant whose photo is known.
             * Returns false otherwise.
             *
             * @param participantId A GUID identifying a participant
             * @return boolean
             */
            isPhotoAvailable: function (participantId) {
                var agent = webservices.ParticipantRepository.get_participant(participantId);
                if (agent) {
                    if (agent.get_photo()) {
                        return true;
                    }
                }
                return false;
            },

            // private methods

            _participantResponded: function (participantId, dateTime) {
                if (webservices.ParticipantRepository.get_currentParticipantId() != participantId &&
                    webservices.ParticipantRepository.get_systemParticipantId() != participantId) {
                    this._setParticipantLastRespondedTime(participantId, dateTime);
                }
            }
        });
    /**
     * MainPanel class
     * This is the panel that is shown when a chat is in progress.
     */
    ui.MainPanel = Class.create(ui.Control,
        {
            /**
             * Constructor
             *
             * @param useHtmlEditor If true, a WYSIWYG editor will be used.  If false, a simple textbox will be used.  Note that the WYSIWYG editor is not supported at this time.
             * @param languageCode  The code (i.e. fr-ca) that specifies which language the editor's tooltips, etc. should appear in.  Case-insensitive.
             */
            initialize: function ($super, useHtmlEditor, languageCode) {
                if ((arguments.length < 2) || (arguments.length > 3)) {
                    throw common.ExceptionFactory.createException("MainPanel constructor called with " + arguments.length + " arguments, but expected 2 or 3.");
                }

                // Assumption: ((want to display HTML editor) == (allow displaying received messages as HTML)).  If this becomes false,
                // stop using the variable "useHtmlEditor" for both purposes, and have 2 variables instead.
                this._receivedMessagesPanel = new ui.WebServicesReceivedMessagesPanel(useHtmlEditor);
                this._composeMessagePanel = new ui.WebServicesComposeMessagePanel(webservices.Json.TypingIndicator, useHtmlEditor, languageCode);
                this._participantsPanel = new ui.WebServicesParticipantsPanel();

                // If false, user will be asked to confirm that they really do want to exit the chat.  If true,
                // the confirmation step will be skipped.
                this._exitButtonShouldOnlyExit = false;

                this._bindControls();

                this._sendOnEnterPanel = new ui.SendOnEnterPanel(languageCode); // Since this publishes ISendOnEnterNotifications and _composeMessagePanel observes them, this should be created after _bindControls().

                var domObject = this._buildDomObject();

                $super(domObject);

                this.addImplementedInterface(webservices.Interfaces.IParticipantLeftNotificationObserver, webservices);
                this.addImplementedInterface(webservices.Interfaces.IChatCompletionFailureNotificationObserver, webservices);
            },

            /**
             * Destructor
             */
            destroy: function () {
                this._receivedMessagesPanel.destroy();
                delete this._receivedMessagesPanel;
                this._receivedMessagesPanel = null;

                this._composeMessagePanel.destroy();
                delete this._composeMessagePanel;
                this._composeMessagePanel = null;

                this._participantsPanel.destroy();
                delete this._participantsPanel;
                this._participantsPanel = null;

                this._sendOnEnterPanel.destroy();
                delete this._sendOnEnterPanel;
                this._sendOnEnterPanel = null;

                ui.Control.prototype.destroy.call(this);
            },

            // public methods

            /**
             * Sets the ChatManager, for both this panel and the WebServicesComposeMessagePanel which it contains.
             *
             * @param chatManager An instance of a subclass of webservices.ChatManagerBase
             */
            set_chatManager: function (chatManager) {
                this._chatManager = chatManager;
                this._composeMessagePanel.set_chatManager(chatManager);
            },

            /**
             * Causes this panel (and all sub-panels) to become enabled or disabled.
             *
             * @param enabled If true, this panel will be enabled.  If false, this panel will be disabled.
             */
            enable: function (enabled) {
                this._receivedMessagesPanel.enable(enabled);
                this._participantsPanel.enable(enabled);
                this._composeMessagePanel.enable(enabled);
                this._sendOnEnterPanel.enable(enabled);
            },

            /**
             * Resets this panel back to its initial state.
             */
            reset: function () {
                this._receivedMessagesPanel.reset();
                this._participantsPanel.reset();
                this._composeMessagePanel.reset();
                this._sendOnEnterPanel.reset();
                this._exitButtonShouldOnlyExit = false;
            },

            /**
             * Called when the panel receives focus.  Simply delegates the focus to the WebServicesComposeMessagePanel.
             */
            focus: function () {
                this._composeMessagePanel.focus();
                this._receivedMessagesPanel.restoreLastChatMessage();
            },

            /**
             * Called whenever a participant leaves the chat.
             * This implements the webservices.Interfaces.IParticipantLeftNotificationObserver interface.
             * Checks to see if the participant who left is the web user whose browser is running this code.  If so, calls
             * ChatManager to free resources, and disables the prompt given by the Exit button.
             *
             * @param notification An implementation of IParticipantLeftNotification, so that the ID of the participant who left can be known.
             */
            processParticipantLeftNotification: function (notification) {
                common.Debug.traceMethodEntered("MainPanel.processParticipantLeftNotification()");
                common.Interface.ensureImplements(notification, webservices.Interfaces.IParticipantLeftNotification);

                if (notification.get_participantId() == webservices.ParticipantRepository.get_currentParticipantId()) {
                    common.Debug.traceNote("The current participant has left.");

                    // the current user was forced out, so change the exit button from logout to just plain exit
                    this._exitButtonShouldOnlyExit = true;
                }
                common.Debug.traceMethodExited("MainPanel.processParticipantLeftNotification()");
            },

            /**
             * Respond to notification that an attempt to exit a chat has failed.
             *
             * @param chatCompletionFailureNotification Contains an error indicating the reason for the failure.
             * @see _createChat()
             * @see ChatManager.login()
             */
            processChatCompletionFailureNotification: function (chatCompletionFailureNotification) {
                var error = chatCompletionFailureNotification.get_error();
                common.Debug.traceError("Failed to exit chat: " + error.get_errorCode());
            },

            //storeChatMessages: function () {
            //    this._receivedMessagesPanel.storeChatMessages();
            //},

            // private methods

            _onClickExitButton: function () {
                common.Debug.traceMethodEntered("MainPanel._onClickExitButton()");
                if (this._exitButtonShouldOnlyExit) {
                    // Force a notification
                    webservices.NotificationRegistry.process(webservices.NotificationFactory.createChatCompletionNotification());
                }
                else {
                    common.Debug.traceNote("Displaying Javascript confirmation dialog.");
                    if (window.confirm(localization.ExitChatWarning)) {
                        this._chatManager.exitChat();
                    }
                }
                common.Debug.traceMethodExited("MainPanel._onClickExitButton()");
            },

            _bindControls: function () {
                webservices.NotificationRegistry.registerObserver(this._composeMessagePanel, webservices.Interfaces.IParticipantLeftNotification);
                webservices.NotificationRegistry.registerObserver(this._composeMessagePanel, webservices.Interfaces.IFailoverUINotification);
                webservices.NotificationRegistry.registerObserver(this._composeMessagePanel, webservices.Interfaces.IResumedPollingNotification);
                webservices.NotificationRegistry.registerObserver(this._composeMessagePanel, webservices.Interfaces.IChatCreationNotification);
                webservices.NotificationRegistry.registerObserver(this._composeMessagePanel, webservices.Interfaces.IRefreshPageNotification);
                webservices.NotificationRegistry.registerObserver(this._composeMessagePanel, webservices.Interfaces.ISendOnEnterNotification);

                webservices.NotificationRegistry.registerObserver(this._receivedMessagesPanel, webservices.Interfaces.IParticipantJoinedNotification);
                webservices.NotificationRegistry.registerObserver(this._receivedMessagesPanel, webservices.Interfaces.IParticipantLeftNotification);
                webservices.NotificationRegistry.registerObserver(this._receivedMessagesPanel, webservices.Interfaces.IReceivedTextNotification);
                webservices.NotificationRegistry.registerObserver(this._receivedMessagesPanel, webservices.Interfaces.IReceivedUrlNotification);
                webservices.NotificationRegistry.registerObserver(this._receivedMessagesPanel, webservices.Interfaces.IReceivedFileNotification);
                webservices.NotificationRegistry.registerObserver(this._receivedMessagesPanel, webservices.Interfaces.IParticipantVoicemailNotification);
                webservices.NotificationRegistry.registerObserver(this._receivedMessagesPanel, webservices.Interfaces.IFailoverUINotification);
                webservices.NotificationRegistry.registerObserver(this._receivedMessagesPanel, webservices.Interfaces.IResumedPollingNotification);
                webservices.NotificationRegistry.registerObserver(this._receivedMessagesPanel, webservices.Interfaces.IChatReconnectFailureNotification);
                webservices.NotificationRegistry.registerObserver(this._receivedMessagesPanel, webservices.Interfaces.IRefreshPageNotification);

                webservices.NotificationRegistry.registerObserver(this._participantsPanel, webservices.Interfaces.IParticipantJoinedNotification);
                webservices.NotificationRegistry.registerObserver(this._participantsPanel, webservices.Interfaces.IParticipantLeftNotification);
                webservices.NotificationRegistry.registerObserver(this._participantsPanel, webservices.Interfaces.IParticipantNameChangedNotification);
                webservices.NotificationRegistry.registerObserver(this._participantsPanel, webservices.Interfaces.IParticipantStartedTypingNotification);
                webservices.NotificationRegistry.registerObserver(this._participantsPanel, webservices.Interfaces.IParticipantStoppedTypingNotification);
                webservices.NotificationRegistry.registerObserver(this._participantsPanel, webservices.Interfaces.IChatReconnectUINotification);
                webservices.NotificationRegistry.registerObserver(this._participantsPanel, webservices.Interfaces.IPartyInfoNotification);

                // For the popover only
                webservices.NotificationRegistry.registerObserver(this._participantsPanel, webservices.Interfaces.IReceivedTextNotification);
                webservices.NotificationRegistry.registerObserver(this._participantsPanel, webservices.Interfaces.IReceivedUrlNotification);
                webservices.NotificationRegistry.registerObserver(this._participantsPanel, webservices.Interfaces.IReceivedFileNotification);

                // for debugging only
                webservices.NotificationRegistry.registerObserver(this._participantsPanel, webservices.Interfaces.IParticipantActiveNotification);
                webservices.NotificationRegistry.registerObserver(this._participantsPanel, webservices.Interfaces.IParticipantHeldNotification);
                // for debugging only

                // this needs to be last since it calls the actual exit chat functionality
                // (or create a CurrentParticipantLeftNotification to eliminate this condition)
                webservices.NotificationRegistry.registerObserver(this, webservices.Interfaces.IParticipantLeftNotification);
                webservices.NotificationRegistry.registerObserver(this, webservices.Interfaces.IChatCompletionFailureNotification);
            },

            _buildDomObject: function () {
                var outerDiv = this.createElement('div', 'chatContainerPanel', { 'class': 'iwt-chat-container-panel' });

                // Top
                outerDiv.appendChild(this._buildTitleHeader());

                // Middle
                var middleDiv = this.createChildElement(outerDiv, 'div', null, { 'class': 'iwt-chat-container-panel-middle' });
                middleDiv.appendChild(this._participantsPanel.get_domObject());
                middleDiv.appendChild(this._receivedMessagesPanel.get_domObject());
                middleDiv.appendChild(this._composeMessagePanel.get_domObject());

                // Bottom
                var bottomDiv = this.createChildElement(outerDiv, 'div', null, { 'class': 'iwt-chat-container-panel-bottom' });

                var sendOnEnterPanelDom = this._sendOnEnterPanel.get_domObject();
                bottomDiv.appendChild(sendOnEnterPanelDom);

                var buttonDiv = this.createChildElement(bottomDiv, 'div', null, { 'class': 'iwt-chat-exit-button-container' });
                var button = this.createChildElement(buttonDiv, 'input', 'exitButton', { 'type': 'button', 'value': localization.Exit, 'class': 'iwt-exit-button', 'name': 'iwt-exit-button' });
                Element.observe(button, 'click', this._onClickExitButton.bindAsEventListener(this));

                return outerDiv;
            },

            _buildTitleHeader: function () {
                return this.createElement('h1', null, { 'class': 'iwt-page-header' }, null, localization.MainPanelHeaderText);
            }
        });
    // Register namespaces
    ui.registerChildNamespace("_Internal");

    /**
     * _DateTimeFormatter class
     *
     * Formats dates and times according to formats which adhere to:
     * http://msdn.microsoft.com/en-us/library/dd317787%28v=vs.85%29.aspx
     * http://msdn.microsoft.com/en-us/library/dd318148%28v=vs.85%29.aspx
     */
    ui._Internal._DateTimeFormatter = Class.create(
        {
            /**
             * Constructor.  Does nothing.
             */
            initialize: function (dateFormat, timeFormat) {
                if (null == dateFormat) {
                    // If an SU1 (or higher) Javascript client starts a chat with a GA webserver,
                    // dateFormat and timeFormat will be null.  Use the value from the resource file
                    // as a fallback.
                    dateFormat = localization.FallbackDateFormat;
                }
                this.set_dateFormat(dateFormat);

                if (null == timeFormat) {
                    timeFormat = localization.FallbackTimeFormat;
                }
                this.set_timeFormat(timeFormat);

                if ("1" == localization.OverrideDateTimeFormats) {
                    try {
                        // Allow the date format to be overridden by the custom resource file.
                        this.set_dateFormat(localization.DateFormat);
                    } catch (ex) {
                        // get() already displayed an error to the console.
                    }

                    try {
                        this.set_timeFormat(localization.TimeFormat);
                    } catch (ex) {
                        // get() already displayed an error to the console.
                    }
                }
            },

            /**
             * Sets the date format
             *
             * @param dateFormat The format in which dates will be displayed
             */
            set_dateFormat: function (dateFormat) {
                this._dateFormat = dateFormat;
            },

            /**
             * Sets the time format
             *
             * @param timeFormat The format in which times will be displayed
             */
            set_timeFormat: function (timeFormat) {
                this._timeFormat = timeFormat;
            },

            /**
             * Formats a date/timestamp for display
             *
             * @param dateTime A Javascript Date object representing the date/timestamp to format
             * @param showDate A boolean. If true, the date and time will be included. If false, only the time will be included.
             */
            formatTimeForDisplay: function (dateTime, showDate) {
                try {
                    if (showDate) {
                        // Include the date
                        return this.formatDate(dateTime) + " " + this.formatTime(dateTime);
                    }
                    else {
                        // Do not include the date
                        return this.formatTime(dateTime);
                    }
                } catch (ex) {
                    common.Debug.traceError(ex.message);
                    return dateTime.toString() + ex.message;
                }
            },

            /**
             * Formats a date
             *
             * @param date A date to format
             */
            formatDate: function (date) {
                var ret = this._dateFormat; // Example: "M/d/yyyy"

                // Example: It is Wednesday the 3rd, and this._dateFormat = "dddd d". Ignore month and year for now.
                // If we do /dddd/ first and /d/ second, we'll get "We3nes3ay 3".
                // But, if we do /d/ first and /dddd/ second, we'll get "3333 3".
                // The solution is to replace dddd with a placeholder, then do /d/, then change the
                // placeholder back to dddd, and finally do /dddd/.
                var placeholder1 = "#####";
                var placeholder2 = "!!!!!";
                var placeholder3 = "-----";
                var placeholder4 = "_____";
                var placeholder5 = "=====";
                var placeholder6 = "~~~~~";

                ret = ret.replace(/dddd/g, placeholder1);
                ret = ret.replace(/ddd/g, placeholder2);
                ret = ret.replace(/MMMM/g, placeholder3);
                ret = ret.replace(/MMM/g, placeholder4);
                ret = ret.replace(/gg/g, placeholder5);
                ret = ret.replace(/g/g, placeholder6);

                ret = ret.replace(/yyyyy?/g, date.getFullYear());
                var twoDigitYear = date.getFullYear() % 100;
                ret = ret.replace(/yy/g, twoDigitYear >= 10 ? twoDigitYear : "0" + twoDigitYear);
                ret = ret.replace(/y/g, date.getFullYear() % 10);

                var day = date.getDate();
                ret = ret.replace(/dd/g, (day >= 10 ? day : "0" + day));
                ret = ret.replace(/d/g, day);

                var month = date.getMonth() + 1;  // getMonth() returns 0 for January ... 11 for December
                ret = ret.replace(/MM/g, (month >= 10 ? month : "0" + month));
                ret = ret.replace(/M/g, month);

                ret = ret.replace(new RegExp(placeholder1, "g"), localization["DayOfWeek" + date.getDay()]);
                ret = ret.replace(new RegExp(placeholder2, "g"), localization["AbbreviatedDayOfWeek" + date.getDay()]);
                ret = ret.replace(new RegExp(placeholder3, "g"), localization["Month" + month]);
                ret = ret.replace(new RegExp(placeholder4, "g"), localization["AbbreviatedMonth" + month]);
                ret = ret.replace(new RegExp(placeholder5, "g"), localization.Era);
                ret = ret.replace(new RegExp(placeholder6, "g"), localization.AbbreviatedEra);

                return ret;
            },

            /**
             * Formats a time
             *
             * @param time A time to format
             */
            formatTime: function (time) {
                var ret = this._timeFormat; // Example: "h:mm:ss tt"

                var hours = time.getHours();  // 0...23
                var hoursOnTwelveHourClock = hours % 12;
                if (hoursOnTwelveHourClock == 0) {
                    hoursOnTwelveHourClock = 12;
                }
                ret = ret.replace(/HH/g, (hours >= 10 ? hours : "0" + hours));
                ret = ret.replace(/H/g, hours);
                ret = ret.replace(/hh/g, (hoursOnTwelveHourClock >= 10 ? hoursOnTwelveHourClock : "0" + hoursOnTwelveHourClock));
                ret = ret.replace(/h/g, hoursOnTwelveHourClock);

                var minutes = time.getMinutes();
                ret = ret.replace(/mm/g, (minutes >= 10 ? minutes : "0" + minutes));
                ret = ret.replace(/m/g, minutes);

                var seconds = time.getSeconds();
                ret = ret.replace(/ss/g, (seconds >= 10 ? seconds : "0" + seconds));
                ret = ret.replace(/s/g, seconds);

                var ampm = (hours < 12 ? "AM" : "PM");
                ret = ret.replace(/tt/g, localization[ampm]);
                ret = ret.replace(/t/g, localization["Abbreviated" + ampm]);

                return ret;
            }
        });
    /**
     * WebChat class
     * The main object of the UI side of the chat.
     */
    ui.WebChat = Class.create(ui.Control,
        {
            /**
             * Constructor
             *
             * @param chatManager A ChatManagerBase subclass
             * @param callbackManager A CallbackManagerBase subclass
             * @param registrationManager A RegistrationManagerBase subclass
             * @param pageMode Bitfield.  See ui.PageModes.
             * @param chatParameters An instance of ChatParameters
             * @param callbackParameters An instance of CallbackParameters
             * @param shouldWarnOnClose If true, clicking the Exit button during a chat will result in a prompt for confirmation.
             *                          If false, no confirmation prompt will be given, and the exit button will immediately exit the chat.
             * @param useHtmlEditor If true, the web user will be shown an editor which allows him/her to change font, text
             *                      size, color, etc.  If false, the web user will only be able to enter plain text.
             *                      Note that the HTML editor is not supported at this time.
             * @param languageCode An IETF Language Tag to indicate which spoken language will be used for the
             *  				   chats/callbacks.  For instance, pass "en-us" for U.S. English, or "de-ch" for German as
             *  				   spoken in Switzerland.
             * @param chatFollowupUrl Optional.  If included, a new browser will be launched to display this URL upon completion
             *                    of a chat.  The URL will not be displayed upon creation of a callback.
             */
            initialize: function ($super, chatManager, callbackManager, registrationManager, pageMode, chatParameters, callbackParameters, shouldWarnOnClose, useHtmlEditor, languageCode, chatFollowupUrl) {
                common.Debug.traceMethodEntered("WebChat.initialize()");
                if ((arguments.length < 1) || (arguments.length > 11)) {
                    throw common.ExceptionFactory.createException("WebChat constructor called with " + arguments.length + " arguments, but expected between 1 and 11.");
                }

                // check our dependencies
                common.DependencyValidators.requirePrototypeVersion("1.6.1");
                common.DependencyValidators.requireJQueryVersion("1.3.2");

                try {
                    // check the browser version
                    // TODO: What versions of Safari are we supporting? or does it matter?
                    // TODO: Are we supporting Chrome?
                    if (common.Browser.isFireFox()) {
                        var version = common.Browser.getFireFoxVersion(navigator.userAgent);
                        if (version && version.isLessThan(new common.Version('3.5'))) {
                            window.alert(localization.FireFoxVersionError);
                            return;
                        }
                    }
                    if (common.Browser.isIE()) {
                        var version = common.Browser.getIEVersion(navigator.userAgent);
                        if (version && version.isLessThan(new common.Version('9'))) {
                            window.alert(localization.IEVersionError);
                            return;
                        }
                    }
                } catch (e) {
                }

                // initialize members
                this._isChatConnected = false;
                this._chatFollowupUrl = chatFollowupUrl;

                // save members
                this._shouldWarnOnClose = shouldWarnOnClose;
                this._chatManager = chatManager;
                this._callbackManager = callbackManager;
                this._registrationManager = registrationManager;

                // initialize ui controls: login panel (if necessary, i.e. if the information collected
                // on that panel is not already known from some external source) and main panel.
                var loginInfoSource = webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.LoginInfoSource);
                var chatParticipantName = loginInfoSource.get_chatUsername();
                if (common.Utilities.isNullOrEmptyString(chatParticipantName)) {
                    var callbackParticipantName = loginInfoSource.get_callbackUsername();
                    if ((null != callbackParticipantName) && (0 < callbackParticipantName.length)) {
                        var participantCredentials = loginInfoSource.get_callbackPassword();
                        var telephone = loginInfoSource.get_callbackTelephone();
                        var subject = loginInfoSource.get_callbackDescription();

                        // If telephone and/or subject are blank, don't bother the WebProcessorBridge.
                        if (!(telephone && subject)) {
                            var error = webservices.ErrorCodes.ERROR + "." +
                                webservices.ErrorCodes.WEBSVC + "." +
                                webservices.ErrorCodes.CONTENT + "." +
                                webservices.ErrorCodes.MISSINGDATA;
                            webservices.NotificationRegistry.process(webservices.NotificationFactory.createCallbackCreationFailureNotification(new webservices.Error(error)));
                        }
                        else {
                            callbackParameters.set_telephone(telephone);
                            callbackParameters.set_subject(subject);
                            callbackParameters.set_participantName(callbackParticipantName);
                            callbackParameters.set_participantCredentials(participantCredentials);
                            this._callbackManager.createCallback(callbackParameters);
                        }
                    }
                    else {
                        this._loginContainerPanel = new ui.FormContainerPanel(this._chatManager, this._callbackManager,
                            this._registrationManager,
                            pageMode, chatParameters,
                            callbackParameters);
                    }
                }
                this._mainPanel = new ui.MainPanel(useHtmlEditor, languageCode);

                // build and validate the DOM
                var domObject = this._buildDomObject();
                this._validateDomObject();

                $super(domObject);

                this.addImplementedInterface(webservices.Interfaces.IPageBeforeUnloadNotificationObserver, webservices);
                this.addImplementedInterface(webservices.Interfaces.IChatCreationNotificationObserver, webservices);
                this.addImplementedInterface(webservices.Interfaces.IChatCompletionNotificationObserver, webservices);
                webservices.NotificationRegistry.registerObserver(this, webservices.Interfaces.IPageBeforeUnloadNotification);
                webservices.NotificationRegistry.registerObserver(this, webservices.Interfaces.IChatCreationNotification);
                webservices.NotificationRegistry.registerObserver(this, webservices.Interfaces.IChatCompletionNotification);

                this._closeWindowMessageIsEnabled = false;
                this._enableControls(false);
                this._mainPanel.hide();

                if (!common.Utilities.isNullOrEmptyString(chatParticipantName)) {
                    chatParameters.set_participantName(chatParticipantName);
                    chatParameters.set_participantCredentials(loginInfoSource.get_chatPassword());
                    this._chatManager.login(chatParameters);
                }

                common.Debug.traceMethodExited("WebChat.initialize()");
            },

            /**
             * Destructor
             */
            destroy: function () {
                common.Debug.traceMethodEntered("WebChat.destroy()");
                if (this._isChatConnected) {
                    this._showChatFollowupUrl();
                }

                if (this._loginContainerPanel) {
                    this._loginContainerPanel.destroy();
                    delete this._loginContainerPanel;
                    this._loginContainerPanel = null;
                }

                this._mainPanel.destroy();
                delete this._mainPanel;
                this._mainPanel = null;

                webservices.WebServicesInitialization.destroy();

                ui.Control.prototype.destroy.call(this);
                common.Debug.traceMethodExited("WebChat.destroy()");
            },

            // public methods

            getLoginContainerPanel: function () {
                return this._loginContainerPanel;
            },

            /**
             * Called when the chat receives focus.  Simply delegates focus to a sub-panel.
             */
            focus: function () {
                if (this._loginContainerPanel) {
                    this._loginContainerPanel.focus();
                    // Could just as easily do main panel here as well.
                }
                else {
                    this._mainPanel.focus();
                }
            },

            /**
             * Callback that is called when a response to the request for server configuration is received.
             */
            onServerConfigurationRetrieved: function () {
                if (this._loginContainerPanel) {
                    this._loginContainerPanel.onServerConfigurationRetrieved();
                }
            },

            /**
             * Called at cleanup time.
             */
            onUnload: function () {
                common.Debug.traceMethodEntered("WebChat.onUnload()");
                //if (this._isChatConnected) {
                //    common.Debug.traceAlways("Storing the chat!");
                //    this._mainPanel.storeChatMessages();
                //}
                common.Debug.traceMethodExited("WebChat.onUnload()");
            },

            /**
             * Respond to notification that a Chat was created successfully.
             *
             * @param chatCreationNotification Contains the ID of the current participant (i.e. the one whose browser is currently executing this code, and who is attempting to log in)
             */
            processChatCreationNotification: function (chatCreationNotification) {
                common.Debug.traceMethodEntered("WebChat.processChatCreationNotification()");
                var participantID = chatCreationNotification.get_currentParticipantId();
                var chatID = chatCreationNotification.get_currentChatId();

                if (ui.DateTimeFormatter) {
                    delete ui.DateTimeFormatter;
                }
                ui.DateTimeFormatter = new ui._Internal._DateTimeFormatter(chatCreationNotification.get_dateFormat(), chatCreationNotification.get_timeFormat());

                this._chatManager.startChat(chatID, participantID);

                if (this._loginContainerPanel) {
                    this._loginContainerPanel.hide();
                }

                this._mainPanel.set_chatManager(this._chatManager);
                this._mainPanel.enable(true);
                this._mainPanel.show();

                if (this._shouldWarnOnClose) {
                    this._enableCloseWindowMessage();
                }

                this._enableControls(true);

                this._mainPanel.focus();

                this._isChatConnected = true;
                common.Debug.traceMethodExited("WebChat.processChatCreationNotification()");
            },

            /**
             * Respond to notification that a Chat was exited.
             *
             * @param chatCompletionNotification Notification object. Contents ignored.
             */
            processChatCompletionNotification: function (chatCompletionNotification) {
                common.Debug.traceMethodEntered("WebChat.processChatCompletionNotification()");
                this._isChatConnected = false;

                this._disableCloseWindowMessage();

                this._showChatFollowupUrl();

                this._mainPanel.set_chatManager(null);
                this._mainPanel.hide();
                this._mainPanel.enable(false);
                this._mainPanel.reset();

                if (this._loginContainerPanel) {
                    this._loginContainerPanel.reset();
                    this._loginContainerPanel.show();
                }

                this._enableControls(false);

                if (this._loginContainerPanel) {
                    this._loginContainerPanel.focus();
                }
                common.Debug.traceMethodExited("WebChat.processChatCompletionNotification()");
            },

            /**
             * Implementation of webservices.Interfaces.IPageBeforeUnloadNotificationObserver
             *
             * @param notification IPageBeforeUnloadNotification
             */
            processPageBeforeUnloadNotification: function (notification) {
                if (this._closeWindowMessageIsEnabled) {
                    return localization.ClosePageWarning;
                }
            },

            // private methods

            _enableCloseWindowMessage: function () {
                this._closeWindowMessageIsEnabled = true;
            },

            _disableCloseWindowMessage: function () {
                this._closeWindowMessageIsEnabled = false;
            },

            /**
             * Display the chat followup URL (i.e. for a survey or something), if one has been set.
             * TODO:  Is there value in appending something like "&interactionID=1234" to the followup URL?
             */
            _showChatFollowupUrl: function () {
                if (this._chatFollowupUrl) {
                    window.open(this._chatFollowupUrl, "_blank");
                }
            },

            _enableControls: function (enabled) {
                this._mainPanel.enable(enabled);
            },

            _validateDomObject: function () {
                var loginInfoSource = webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.LoginInfoSource);
                if (!this._loginContainerPanel &&
                    !loginInfoSource.get_chatUsername() &&
                    !loginInfoSource.get_callbackUsername()) {
                    // The login container panel should exist, but does not.
                    throw common.ExceptionFactory.createException("Login panel not found");
                }

                if (!this._mainPanel) {
                    throw common.ExceptionFactory.createException("Main panel not found");
                }
            },

            _buildDomObject: function () {
                var outerDiv = this.createElement('div', null, { 'class': 'iwt-web-chat' });
                if (this._loginContainerPanel) {
                    outerDiv.appendChild(this._loginContainerPanel.get_domObject());
                }
                outerDiv.appendChild(this._mainPanel.get_domObject());
                return outerDiv;
            }
        });
    // Register namespaces
    ui.registerChildNamespace("_Internal");

    /**
     * Page class
     * Represents the root UI container for the Chat/Callback web app.
     * Do not instantiate - use the singleton, ui.Page.
     */
    ui._Internal._Page = Class.create(common.InterfaceImplementation,
        {
            /**
             * Default constructor.  This object is a singleton (see declaration immediately after this class),
             * so no need to call this directly.
             */
            initialize: function ($super) {
                common.Debug.traceMethodEntered("Page.initialize()");
                var numArgs = 1;
                if (arguments.length != numArgs) {
                    throw common.ExceptionFactory.createException("Page constructor called with " + arguments.length + " arguments, but expected " + numArgs + ".");
                }

                this._numServerConfigRequestFailovers = 0;

                $super();

                common.Debug.traceMethodExited("Page.initialize()");
            },

            // methods

            /**
             * When called, this method will display the ININ Chat/Callback UI.
             *
             * @param params A Javascript object containing key/value pairs as specified below.  All are
             * required unless otherwise specified:
             *
             * currentUriFragment The URI fragment that reverse proxies to the preferred xIC server.
             *                    See description of next param.
             * uriFragments An array of URI fragments identifying the xIC server(s).  Since AJAX requests can only be
             *  			made to the originating server, it is necessary to configure a reverse proxy in order for
             *  			the requests to get to the xIC server(s).  If this Javascript was accessed from
             *  			http://this-server/somePage.html, then it cannot make AJAX requests to
             *  			http://xIC-server-1:8114/..., even if there weren't a firewall in the way.  So, perhaps
             *  			this-server was configured in a way such that:
             *  			http://this-server/something/websvcs/serverConfiguration reverse proxies to
             *  			http://xIC-server-1:8114/websvcs/serverConfiguration, and
             *  			http://this-server/somethingElse/websvcs/serverConfiguration reverse proxies to
             *  			http://xIC-server-2:8114/websvcs/serverConfiguration.  In that case, the value passed for
             *  			this param should be [ "something", "somethingElse" ].
             * pageMode Bitfield.  See ui.PageModes.
             * chatTarget The name of the queue to which chats should be sent.
             *            May be null if chats were not included in pageMode param.
             * chatTargetType "Workgroup" or "User", depending on the queue type of the previous param.
             *                May be null if chats were not included in pageMode param.
             * callbackTarget The name of the queue to which callbacks should be sent.
             *                May be null if callbacks were not included in pageMode param.
             * callbackTargetType "Workgroup" or "User", depending on the queue type of the previous param.
             *  				  May be null if callbacks were not included in pageMode param.
             * customInfo Customers wishing to customize chats may set this to any data.  It will be set as
             *            the value of the CUSTOM_INFO attribute on the interaction.
             * defaultLanguageCode An IETF Language Tag to indicate which spoken language will be used as the default for the
             *  				   chats/callbacks.  For instance, pass "en-us" for U.S. English, or "de-ch" for German as
             *                     spoken in Switzerland.  This can be overriden, in order from highest to lowest,
             *                     by: 1. directly overriding by calling Bootloader.setLanguage(), 2. web user's
             *                     browser settings, 3. web user's OS settings.
             * useHttps true/false value indicating whether HTTPS shall be used for the communication between the
             *  		web browser and web server.  This is distinct from the issue of whether HTTPS should be used
             *  		between the web server and the xIC server - that is determined by the reverse proxy
             *  		configuration.  If not supplied, a warning will be logged and true will be assumed.
             * chatFollowupUrl Optional.  If included, a new browser will be launched to display this URL upon completion
             *                 of a chat.  The URL will not be displayed upon creation of a callback.
             * callbackAttributes Optional.  An object containing key/value pairs.  If supplied, all
             *                    keys and values must be strings.  These fields will be passed to WebProcessorBridge
             *                    and set as attributes on the Callback (but each key will be prefixed with a constant
             *                    to form the actual attribute name).
             * callbackRoutingContexts Optional. An instance of webservices.RoutingContexts that specifies how
             *                         Callbacks should be routed.
             * chatRoutingContexts Optional. An instance of webservices.RoutingContexts that specifies how
             *                         Chats should be routed.
             */
            load: function (params) {
                common.Debug.traceMethodEntered("Page.load()");

                if (arguments.length != 1) {
                    throw common.ExceptionFactory.createException("Page.load() called with " + arguments.length + " arguments, but expected 1.  Make sure there is not a version mismatch between the HTML and Javascript files.");
                }

                params = this._verifyLoadParameters(params);

                this._defaultLanguageCode = params.defaultLanguageCode;
                this._hostDomain = params.hostDomain;

                // initialize API
                webservices.WebServicesInitialization.initialize(params.currentUriFragment, params.uriFragments, params.useHttps);

                this._partyManager = new webservices.Json.PartyManager(
                    webservices.Json.GenericResponseBuilder,
                    webservices.CapabilityRepository,
                    webservices.Json.FailoverHandler);

                this._pageMode = params.pageMode;

                if (params.pageMode & ui.PageModes.CHAT) {
                    this._chatParameters = new webservices.ChatParameters(params.chatTarget, params.chatTargetType, params.customInfo, params.chatRoutingContext);
                    this._chatFollowupUrl = params.chatFollowupUrl;
                    this._useHtmlEditor = false; // Only plaintext is supported in 4.0 GA, maybe we will support HTML chat in a future release.
                    this._chatManager = new webservices.Json.ChatManager(
                        webservices.Json.GenericResponseBuilder,
                        webservices.CapabilityRepository,
                        webservices.Json.TypingIndicator,
                        webservices.Json.FailoverHandler,
                        this._useHtmlEditor);
                    this._chatManager.set_partyManager(this._partyManager);
                }

                if (params.pageMode & ui.PageModes.CALLBACK) {
                    this._callbackParameters = new webservices.CallbackParameters(params.callbackTarget, params.callbackTargetType, params.customInfo, params.callbackAttributes, params.callbackRoutingContexts);
                    this._callbackManager = new webservices.Json.CallbackManager(
                        webservices.Json.GenericResponseBuilder,
                        webservices.CapabilityRepository,
                        webservices.Json.FailoverHandler);
                    this._callbackManager.set_partyManager(this._partyManager);
                }

                this._registrationManager = new webservices.Json.RegistrationManager(
                    webservices.Json.GenericResponseBuilder,
                    webservices.CapabilityRepository,
                    webservices.Json.FailoverHandler);

                this.addImplementedInterface(webservices.Interfaces.IPageUnloadNotificationObserver, webservices);
                webservices.NotificationRegistry.registerObserver(this, webservices.Interfaces.IPageUnloadNotification);

                window.onbeforeunload = function (evt) {
                    var returnValue = webservices.NotificationRegistry.process(webservices.NotificationFactory.createPageBeforeUnloadNotification());
                    if (null != returnValue) {
                        common.Debug.traceNote("Displaying prompt: " + returnValue);
                        if (evt) {
                            evt.returnValue = returnValue;  // IE, Firefox 3 and earlier
                        }
                        return returnValue; // Safari
                    }
                };
                window.onunload = function () {
                    common.Debug.traceMethodEntered("Page anonymous window.onunload handler");
                    webservices.NotificationRegistry.process(webservices.NotificationFactory.createPageUnloadNotification());
                    common.Debug.traceMethodExited("Page anonymous window.onunload handler");
                };

                webservices.Json.ServerConfigurationManager.getServerConfiguration(this._serverConfigurationCallback.bind(this));

                // listen for postMessage
                window.addEventListener('message', this._respondToPostMessage.bind(this), false);

                // listen for custom event
                var bodyElem = this.getBody();
                bodyElem.addEventListener('composeInputFocusChange', this._respondToComposeInputChangeEvent.bind(this));

                common.Debug.traceMethodExited("Page.load()");
            },

            /**
             * Gets the Element to which the chat UI should be added.
             * Initially searches for something whose id is "iwt-container", but
             * if that is not found, just returns the element representing the page body.
             */
            getContainingElement: function () {
                var parent = document.getElementById('iwt-container');
                if (!parent) {
                    parent = this.getBody();
                }
                return parent;
            },

            /**
             * Convenience method to get the DOM element representing the body tag of the HTML page containing the
             * chat/callback UI.
             */
            getBody: function () {
                return document.getElementsByTagName('body')[0];
            },

            processPageUnloadNotification: function (notification) {
                common.Debug.traceMethodEntered("Page.processPageUnloadNotification()");
                common.Interface.ensureImplements(notification, webservices.Interfaces.IPageUnloadNotification);
                this.destroy();
                common.Debug.traceMethodExited("Page.processPageUnloadNotification()");
            },

            /**
             * Cleans up the application's resources.
             */
            destroy: function () {
                common.Debug.traceMethodEntered("Page.destroy()");
                try {
                    if (this._webChat) {
                        this._webChat.onUnload();
                        this._webChat.destroy();
                        delete this._webChat;
                        this._webChat = null;
                    }

                    if (this._chatManager) {
                        this._chatManager.destroy();
                        delete this._chatManager;
                        this._chatManager = null;
                    }

                    if (this._callbackManager) {
                        this._callbackManager.destroy();
                        delete this._callbackManager;
                        this._callbackManager = null;
                    }

                    if (this._registrationManager) {
                        this._registrationManager.destroy();
                        delete this._registrationManager;
                        this._registrationManager = null;
                    }

                    if (this._partyManager) {
                        this._partyManager.destroy();
                        delete this._partyManager;
                        this._partyManager = null;
                    }

                    common.InterfaceImplementation.prototype.destroy.call(this);
                }
                catch (ex) {
                    common.Debug.traceError(ex.message);
                    common.Debug.breakpoint();
                    common.Debug.alert(ex.message);
                }
                common.Debug.traceMethodExited("Page.destroy()");
            },

            /**
             * Resets the Page to the state which it was in prior to any activity taking place.
             */
            reset: function () {
                this._numServerConfigRequestFailovers = 0;
            },

            // private methods

            _respondToPostMessage: function (e) {
                if (this._hostDomain != e.origin && this._hostDomain != '*')
                    return;

                if (e.data == 'chatExit') {
                    this._chatManager.exitChat();
                    this.destroy();
                    sessionStorage.removeItem('participantId', null);
                    sessionStorage.removeItem('chatMessages', null);
                    sessionStorage.removeItem('lastChatMessage', null);
                    e.source.postMessage('chatExited', this._hostDomain);
                }
            },

            _respondToComposeInputChangeEvent: function (event) {
                window.parent.postMessage(event.detail.eventType, this._hostDomain);
            },

            _verifyLoadParameters: function (params) {
                if (!params) {
                    throw common.ExceptionFactory.createException("No parameters specified to Page.load()!");
                }

                if (!params.currentUriFragment) {
                    throw common.ExceptionFactory.createException("No current URI fragment specified!");
                }

                if (!params.uriFragments) {
                    throw common.ExceptionFactory.createException("No URI fragments specified");
                }

                if (!params.pageMode) {
                    throw common.ExceptionFactory.createException("Page mode not specified");
                }

                if (params.pageMode & ui.PageModes.CHAT) {
                    if (!params.chatTarget) {
                        throw common.ExceptionFactory.createException("Chat target not specified");
                    }

                    if (!params.chatTargetType) {
                        common.Debug.traceWarning('Chat target type not specified, assuming "Workgroup".');
                        params.chatTargetType = "Workgroup";
                    }
                }

                if (params.pageMode & ui.PageModes.CALLBACK) {
                    if (!params.callbackTarget) {
                        throw common.ExceptionFactory.createException("Callback target not specified");
                    }

                    if (!params.callbackTargetType) {
                        common.Debug.traceWarning('Callback target type not specified, assuming "Workgroup".');
                        params.callbackTargetType = "Workgroup";
                    }
                }

                if (!params.defaultLanguageCode) {
                    common.Debug.traceWarning("Default language not specified, assuming en-us");
                    params.defaultLanguageCode = "en-us";
                }

                if (!(params.useHttps === true || params.useHttps === false)) {
                    common.Debug.traceWarning("useHttps not specified, assuming true");
                    params.useHttps = true;
                }

                if (!params.hostDomain || params.hostDomain.length <= 0) {
                    throw common.ExceptionFactory.createException("Host domain not specified");
                }

                return params;
            },

            _serverConfigurationCallback: function (success) {
                common.Debug.traceMethodEntered("Page._serverConfigurationCallback()");
                try {
                    if (success) {
                        common.Debug.traceStatus("Server configuration obtained successfully.");
                        window.parent.postMessage("ServerConfig", this._hostDomain);
                        window.parent.postMessage("Server configuration obtained successfully.", this._hostDomain);
                        //window.parent.postMessage("ServerConfig", 'http://localhost:8185');
                        //window.parent.postMessage("ServerConfig", 'http://ui-dev.nina-nuance.com');
                        //window.parent.postMessage("Server configuration obtained successfully.", 'https://agent-preprod-ma.nuance-va.com');
                        //window.parent.postMessage("Server configuration obtained successfully.", 'https://agent-preprod.nuance-va.com');
                        //window.parent.postMessage("Server configuration obtained successfully.", 'https://www.ipaustralia.gov.au');
                        //window.parent.postMessage("Server configuration obtained successfully.", 'https://vabeta.govcms.acsitefactory.com');
                        this._constructUI();
                    }
                    else {
                        if (this._shouldSwitchoverAndTryToGetServerConfigurationAgain()) {
                            common.Debug.traceStatus("Going to switch over, and try again to obtain server configuration.");
                            webservices.Servers.switchCurrentServer();
                            this._numServerConfigRequestFailovers++;
                            webservices.Json.ServerConfigurationManager.getServerConfiguration(this._serverConfigurationCallback.bind(this));
                        }
                        else {
                            common.Debug.traceStatus("Failed to obtain server configuration.");
                            this._constructFailureUI();
                        }
                    }
                }
                catch (ex) {
                    common.Debug.breakpoint();
                    common.Debug.traceError(ex.message);
                    if (ex.stack) {
                        common.Debug.traceStatus(ex.stack);
                    }
                    common.Debug.alert(ex.message);
                    webservices.ProblemReporter.sendProblemReport(ex, "Page._serverConfigurationCallback()");
                }
                common.Debug.traceMethodExited("Page._serverConfigurationCallback()");
            },

            _shouldSwitchoverAndTryToGetServerConfigurationAgain: function () {
                if (!webservices.Servers.isConfiguredForSwitchover()) {
                    // In this case, the retry logic was already handled
                    // in AjaxManagerBase._shouldRequestBeRetriedBasedOnMessageTypeAndRetryCount().
                    return false;
                }

                // Adding 1 because retryCounts maintains the number of times to REtry.  So, for instance,
                // initial try + 3 retries = 4 total tries.
                var retryCounts = webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.RetryCounts);
                var numTimesToTry = webservices.Servers.get_numberOfServers() *
                    (1 + retryCounts.get_serverConfigurationRetries());

                return (this._numServerConfigRequestFailovers < numTimesToTry);
            },

            _constructUI: function () {
                common.Debug.traceMethodEntered("Page._constructUI()");

                var lang = document.body.lang = localization.LanguageCode;
                document.body.dir = localization.TextDirection;

                // initialize ui controls
                this._webChat = new ui.WebChat(this._chatManager, this._callbackManager, this._registrationManager, this._pageMode, this._chatParameters, this._callbackParameters, true, this._useHtmlEditor, lang, this._chatFollowupUrl);

                // add the controls to the page
                Element.insert(this.getContainingElement(), { bottom: this._webChat.get_domObject() });

                this._webChat.focus();

                var loginContainerPanel = this._webChat.getLoginContainerPanel();
                if (loginContainerPanel)  // Will not exist if bypassing the login form
                {
                    loginContainerPanel.constructUI();
                }

                $j(window).resize(function () { webservices.NotificationRegistry.process(webservices.NotificationFactory.createWindowResizedNotification()) });

                common.Debug.traceMethodExited("Page._constructUI()");
            },

            _constructFailureUI: function () {
                common.Debug.traceMethodEntered("Page._constructFailureUI()");
                this.getContainingElement().appendChild(this._buildErrorPanel());
                common.Debug.traceMethodExited("Page._constructFailureUI()");
            },

            _buildErrorPanel: function () {
                common.Debug.traceMethodEntered("Page._buildErrorPanel()");
                var msg = "There was an error connecting to the server";
                try {
                    msg = localization.ErrorConnectingToServer;
                }
                catch (ex) {
                    /*
                 * If we're in this method, we've failed to get server configuration.
                 * Javascript can't "see" the web browser's language settings, so we rely on the server configuration response
                 * to include the value of the HTTP Accept-Language parameter.  Since we didn't receive that, localization has
                 * not been loaded yet, so we will certainly land in this catch clause.  So, this message will be in English.
                 */
                }
                var divError = new Element('div', { 'class': 'iwt-load-error' });
                divError.appendChild(new Element('img', { 'src': 'img/error.png' }));
                var msgElement = new Element('span', null);
                $j(msgElement).text(msg);
                divError.appendChild(msgElement);
                common.Debug.traceMethodExited("Page._buildErrorPanel()");
                return divError;
            }
        });

    /**
     * Singleton instance of _Page class.
     */
    ui.Page = new ui._Internal._Page();
    // Register namespaces
    ui.registerChildNamespace("_Internal");

    /**
     * _DefaultLoginInfoSource class
     *
     * Do not instantiate this class directly.  Use
     * webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.LoginInfoSource)
     *
     * In the default installation, a page is shown which allows the user to
     * select between tabs for Chat, Callback, and Registration.  What goes on
     * "behind the scenes" is that ui.LoginInfoSourceFactory is called
     * to get a source for login info (username, password, Callback telephone number,
     * Callback subject).  An instance of this class is returned.  However, this class
     * has no knowledge of what the login info should be, so all of its methods return
     * null.  Therefore, the page with the three tabs is shown, to allow the user to
     * enter the login info.
     *
     * However, if the user's information is already known (i.e., if it exists
     * in some external source, such as a cookie, database, the form submission
     * data from some external form, etc.) then the page with the three tabs may
     * be bypassed.  In this case the user may be sent directly into a Chat, or
     * a Callback may be created without interaction from the User.
     *
     * To do this, simply create a subclass of this class, and implement the various
     * methods to return the login info that is obtained from the external source.
     * Then edit the customizations.LoginInfoSourceFactory class, to
     * return an instance of the subclass, rather than an instance of this class.
     *
     * Please see also webservices.Notification.  This class
     * contains Notifications that are sent upon creation of a Chat or Callback,
     * completion of a Chat, and failure to create a Chat or Callback.  Customizations
     * which subclass _DefaultLoginInfoSource will likely also want to add
     * process*Notification() events for these Notification types, so that they
     * may perform appropriate UI tasks for those events.
     */
    ui._Internal._DefaultLoginInfoSource = Class.create(
        {
            /**
             * Constructor.  Does nothing.
             */
            initialize: function () {
            },

            /**
             * A subclass may override this method to skip the login page, and begin a Chat
             * right away using a username obtained from some other source (for instance,
             * a cookie, form data posted from a previous page, etc.)
             */
            get_chatUsername: function () {
                return null;
            },

            /**
             * If a subclass overrides get_chatUsername() to return non-null, this method may
             * optionally be overridden to return the password of that user.  If an anonymous Chat is
             * desired, simply override get_chatUsername() but not get_chatPassword().
             */
            get_chatPassword: function () {
                return null;
            },

            /**
             * A subclass may override this method (and others below) to skip the login
             * page, and begin a Callback right away using a username obtained from
             * some other source (for instance, a cookie, form data posted from a
             * previous page, etc.)
             *
             * Note that if get_chatUsername() is also overridden and returns a non-null
             * value, that will take priority and a Chat will be started, not a Callback.
             */
            get_callbackUsername: function () {
                return null;
            },

            /**
             * If a subclass overrides get_callbackUsername() to return non-null, this method may
             * optionally be overridden to return the password of that user.  If an anonymous Callback is
             * desired, simply override get_callbackUsername() but not get_callbackPassword().
             */
            get_callbackPassword: function () {
                return null;
            },

            /**
             * If a subclass overrides get_callbackUsername() to return non-null, this method shall
             * be overridden to return the telephone number of that user.
             */
            get_callbackTelephone: function () {
                return null;
            },

            /**
             * If a subclass overrides get_callbackUsername() to return non-null, this method shall
             * be overridden to return the subject which that user wishes to discuss.
             */
            get_callbackDescription: function () {
                return null;
            }
        });
    // Register namespaces
    ui.registerChildNamespace("_Internal");

    /**
     * DefaultMaximumFieldLengths class
     *
     * Do not instantiate this class directly.  Use
     * webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.MaximumFieldLengths)
     *
     * In the default installation, each text field within the 3 tabs will allow the user
     * to enter up to the maximum number of characters that Tracker will support for that
     * data type.
     *
     * If it is desired to have a different maximum length for one or more fields, the
     * following steps may be taken:
     * 1. Create a subclass of this class.  Override one or methods to return a different number.
     *    Note that it is not advisable to increase the returned values, as they are by default
     *    set to the maximum data length which Tracker can handle.
     *    Also note that this will have no effect on the pixel width of these fields - that can
     *    be changed by editing the ".iwt-text-box" selector of the CSS.
     * 2. Change the line in customizations.MaximumFieldLengthsFactory that
     *    instantiates a new ui._Internal._DefaultMaximumFieldLengths.
     *    Make that line instead create an instance of the subclass from step 1.
     */
    ui._Internal._DefaultMaximumFieldLengths = Class.create(
        {
            // Do not change these values (unless the Tracker DB Schema changes)
            TRACKER_USERNAME_MAXIMUM_LENGTH: 100,
            TRACKER_PASSWORD_MAXIMUM_LENGTH: 64,
            TRACKER_FIRST_NAME_MAXIMUM_LENGTH: 50,
            TRACKER_MIDDLE_NAME_MAXIMUM_LENGTH: 50,
            TRACKER_LAST_NAME_MAXIMUM_LENGTH: 50,
            TRACKER_NAME_MAXIMUM_LENGTH: 128,
            TRACKER_TELEPHONE_MAXIMUM_LENGTH: 255,
            TRACKER_SUBJECT_MAXIMUM_LENGTH: 2000,
            TRACKER_ADDRESS_MAXIMUM_LENGTH: 255,
            TRACKER_CITY_MAXIMUM_LENGTH: 50,
            TRACKER_STATE_MAXIMUM_LENGTH: 50,
            TRACKER_POSTAL_CODE_MAXIMUM_LENGTH: 20,
            TRACKER_COUNTRY_MAXIMUM_LENGTH: 50,
            TRACKER_EMAIL_MAXIMUM_LENGTH: 255,
            TRACKER_URL_MAXIMUM_LENGTH: 255,
            TRACKER_DEPARTMENT_MAXIMUM_LENGTH: 50,
            TRACKER_COMPANY_MAXIMUM_LENGTH: 100,
            TRACKER_JOB_TITLE_MAXIMUM_LENGTH: 100,
            TRACKER_REMARKS_MAXIMUM_LENGTH: 2000,

            /**
             * Constructor.  Does nothing.
             */
            initialize: function () {
            },

            /**
             * Override this method with one that returns a different number to alter the maximum
             * number of characters that a web user is allowed to type into a username field
             */
            get_usernameMaximumLength: function () {
                return this.TRACKER_USERNAME_MAXIMUM_LENGTH;
            },

            /**
             * Override this method with one that returns a different number to alter the maximum
             * number of characters that a web user is allowed to type into a password field
             */
            get_passwordMaximumLength: function () {
                return this.TRACKER_PASSWORD_MAXIMUM_LENGTH;
            },

            /**
             * Override this method with one that returns a different number to alter the maximum
             * number of characters that a web user is allowed to type into a first name field
             */
            get_firstNameMaximumLength: function () {
                return this.TRACKER_FIRST_NAME_MAXIMUM_LENGTH;
            },

            /**
             * Override this method with one that returns a different number to alter the maximum
             * number of characters that a web user is allowed to type into a middle name field
             */
            get_middleNameMaximumLength: function () {
                return this.TRACKER_MIDDLE_NAME_MAXIMUM_LENGTH;
            },

            /**
             * Override this method with one that returns a different number to alter the maximum
             * number of characters that a web user is allowed to type into a last name field
             */
            get_lastNameMaximumLength: function () {
                return this.TRACKER_LAST_NAME_MAXIMUM_LENGTH;
            },

            /**
             * Override this method with one that returns a different number to alter the maximum
             * number of characters that a web user is allowed to type into a name field (currently
             * used in two places: the name field of the web user when they choose "I don't have
             * an account", and the "Assistant Name" field).
             */
            get_nameMaximumLength: function () {
                return this.TRACKER_NAME_MAXIMUM_LENGTH;
            },

            /**
             * Override this method with one that returns a different number to alter the maximum
             * number of characters that a web user is allowed to type into a telephone (or fax, etc.) number field
             */
            get_telephoneMaximumLength: function () {
                return this.TRACKER_TELEPHONE_MAXIMUM_LENGTH;
            },

            /**
             * Override this method with one that returns a different number to alter the maximum
             * number of characters that a web user is allowed to type into a callback subject field
             */
            get_subjectMaximumLength: function () {
                return this.TRACKER_SUBJECT_MAXIMUM_LENGTH;
            },

            /**
             * Override this method with one that returns a different number to alter the maximum
             * number of characters that a web user is allowed to type into a street address field
             */
            get_addressMaximumLength: function () {
                return this.TRACKER_ADDRESS_MAXIMUM_LENGTH;
            },

            /**
             * Override this method with one that returns a different number to alter the maximum
             * number of characters that a web user is allowed to type into a city name field
             */
            get_cityMaximumLength: function () {
                return this.TRACKER_CITY_MAXIMUM_LENGTH;
            },

            /**
             * Override this method with one that returns a different number to alter the maximum
             * number of characters that a web user is allowed to type into a state (or province/territory) field
             */
            get_stateMaximumLength: function () {
                return this.TRACKER_STATE_MAXIMUM_LENGTH;
            },

            /**
             * Override this method with one that returns a different number to alter the maximum
             * number of characters that a web user is allowed to type into a postal code field
             */
            get_postalCodeMaximumLength: function () {
                return this.TRACKER_POSTAL_CODE_MAXIMUM_LENGTH;
            },

            /**
             * Override this method with one that returns a different number to alter the maximum
             * number of characters that a web user is allowed to type into a country field
             */
            get_countryMaximumLength: function () {
                return this.TRACKER_COUNTRY_MAXIMUM_LENGTH;
            },

            /**
             * Override this method with one that returns a different number to alter the maximum
             * number of characters that a web user is allowed to type into an email field
             */
            get_emailMaximumLength: function () {
                return this.TRACKER_EMAIL_MAXIMUM_LENGTH;
            },

            /**
             * Override this method with one that returns a different number to alter the maximum
             * number of characters that a web user is allowed to type into a URL field
             */
            get_urlMaximumLength: function () {
                return this.TRACKER_URL_MAXIMUM_LENGTH;
            },

            /**
             * Override this method with one that returns a different number to alter the maximum
             * number of characters that a web user is allowed to type into a department name field
             */
            get_departmentMaximumLength: function () {
                return this.TRACKER_DEPARTMENT_MAXIMUM_LENGTH;
            },

            /**
             * Override this method with one that returns a different number to alter the maximum
             * number of characters that a web user is allowed to type into a company name field
             */
            get_companyMaximumLength: function () {
                return this.TRACKER_COMPANY_MAXIMUM_LENGTH;
            },

            /**
             * Override this method with one that returns a different number to alter the maximum
             * number of characters that a web user is allowed to type into a job title field
             */
            get_jobTitleMaximumLength: function () {
                return this.TRACKER_JOB_TITLE_MAXIMUM_LENGTH;
            },

            /**
             * Override this method with one that returns a different number to alter the maximum
             * number of characters that a web user is allowed to type into a remarks field
             */
            get_remarksMaximumLength: function () {
                return this.TRACKER_REMARKS_MAXIMUM_LENGTH;
            }

        });
    // Register namespaces
    ui.registerChildNamespace("_Internal");

    /**
     * _DefaultTabVisibility class
     *
     * Do not instantiate this class directly.  Use
     * webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.TabVisibility)
     *
     * By default:
     *
     * 1. The "Start Chat" tab is displayed if the Web Processor Bridge
     * includes "start" and ("supportChatAuthenticationTracker" or "supportChatAuthenticationAnonymous")
     * in the list of chat capabilities (part of the server configuration response).
     *
     * 2. The "Start Callback" tab is displayed if "create" and ("supportCallbackAuthenticationTracker"
     * or "supportCallbackAuthenticationAnonymous") is included in the list of callback capabilities.
     *
     * 3. The "Register New Account" tab is displayed if "supportRegistrationTracker"
     * is included in the list of common capabilities.
     *
     * However, currently the Web Processor Bridge always includes all of the above.
     * Therefore, this class (or a subclass thereof, depending on what
     * customizations.TabVisibilityFactory returns) is queried to determine whether
     * each tab should be shown or not.
     *
     * To prevent certain tabs from displayed:
     * 1. Create a subclass of this class which overrides one or more methods in this class.
     * 2. Modify TabVisibilityFactory to return an instance of the new subclass instead
     *    of an instance of this class.
     */
    ui._Internal._DefaultTabVisibility = Class.create(
        {
            /**
             * Constructor.  Does nothing.
             */
            initialize: function () {
            },

            /**
             * If a subclass overrides this return value to true, the "Start Chat" tab will
             * not be displayed.
             */
            hideStartChatTab: function () {
                return false;
            },

            /**
             * If a subclass overrides this return value to true, the "Start Callback" tab will
             * not be displayed.
             */
            hideStartCallbackTab: function () {
                return false;
            },

            /**
             * If a subclass overrides this return value to true, the "Register New Account" tab will
             * not be displayed, and the "Create an account" link on the other two tabs will also be hidden.
             */
            hideRegisterNewAccountTab: function () {
                return false;
            },

            /**
             * If this method returns false, the link to display a printable chat transcript
             * will be displayed.  If it returns true, the link will not be displayed.
             *
             * In the default implementation, false is returned.  However, subclasses may
             * override this method if the link is not (always) desired.
             *
             * If true is returned, the resource strings "ClosePageWarning" and "ExitPageWarning"
             * should be reworded, since they mention the ability to print a transcript.
             *
             * @return boolean indicating whether the printable chat history link should be hidden.
             */
            disablePrintableChatHistory: function () {
                return false;
            }
        });
    // Register namespaces
    ui.registerChildNamespace("_Internal");

    /**
     * _DefaultExtraCssClasses class
     *
     * Do not instantiate this class directly.  Use
     * webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.ExtraCSSClasses)
     *
     * Interaction Web Tools uses Bootstrap (http://www.getbootstrap.com) for layout.  However, some customers may wish to
     * not use Bootstrap, or may wish to change the specific ways in which Bootstrap is used.  Using IWT's customization
     * framework to replace this class with a different one is the way to make that change.
     */
    ui._Internal._DefaultExtraCssClasses = Class.create(
        {
            // Set up some default grid column widths for our forms
            _default_sm_label: 3,
            _default_sm_optional_label: 2,
            _default_md_label: 3,
            _default_md_optional_label: 2,
            _default_lg_label: 2,
            _default_lg_optional_label: 1,

            /**
             * Constructor.  Sets up a mapping of IWT's CSS classes and IDs to Bootstrap's CSS classes.
             */
            initialize: function () {
                this._default_sm_textbox = 12 - (this._default_sm_label);
                this._default_sm_optional_textbox = 12 - (this._default_sm_label + this._default_sm_optional_label);
                this._default_md_textbox = 12 - (this._default_md_label);
                this._default_md_optional_textbox = 12 - (this._default_md_label + this._default_md_optional_label);
                this._default_lg_textbox = 12 - (this._default_lg_label);
                this._default_lg_optional_textbox = 12 - (this._default_lg_label + this._default_lg_optional_label);

                this._map =
                    {
                        '.iwt-form-tabs': ['nav', 'nav-tabs'],
                        '.iwt-tab-content': ['tab-content'],
                        '#iwt-chat-form-panel': ['tab-pane'],
                        '#iwt-callback-container-panel': ['tab-pane'],
                        '#iwt-register-form-panel': ['tab-pane'],
                        '.iwt-form': ['form-horizontal'],
                        '.iwt-form-field-div': ['form-group'],
                        '.iwt-radio': ['radio'],
                        '.iwt-checkbox': ['checkbox'],
                        '.iwt-textbox': ['form-control'],
                        '.iwt-subject-textarea': ['form-control'],
                        '.iwt-form-submit-button': ['btn', 'btn-lg', 'btn-primary'],

                        '.iwt-form-label': ['col-sm-' + this._default_sm_label, 'col-md-' + this._default_md_label, 'col-lg-' + this._default_lg_label, 'control-label'],
                        '.iwt-optional-label': ['col-sm-' + this._default_sm_optional_label, 'col-sm-push-' + this._default_sm_optional_textbox, 'col-md-' + this._default_md_optional_label, 'col-md-push-' + this._default_md_optional_textbox, 'col-lg-' + this._default_lg_optional_label, 'col-lg-push-' + this._default_lg_optional_textbox],
                        '.iwt-textbox-container': ['col-sm-' + this._default_sm_textbox, 'col-md-' + this._default_md_textbox, 'col-lg-' + this._default_lg_textbox],
                        '.iwt-textbox-container-optional': ['col-sm-' + this._default_sm_optional_textbox, 'col-sm-pull-' + this._default_sm_optional_label, 'col-md-' + this._default_md_optional_textbox, 'col-md-pull-' + this._default_md_optional_label, 'col-lg-' + this._default_lg_optional_textbox, 'col-lg-pull-' + this._default_lg_optional_label],
                        '.iwt-form-field-no-label': ['col-sm-' + this._default_sm_textbox, 'col-sm-offset-' + this._default_sm_label, 'col-md-' + this._default_md_textbox, 'col-md-offset-' + this._default_md_label, 'col-lg-' + this._default_lg_textbox, 'col-lg-offset-' + this._default_lg_label],
                        '.iwt-form-field-error': ['col-sm-' + this._default_sm_textbox, 'col-sm-offset-' + this._default_sm_label, 'col-md-' + this._default_md_textbox, 'col-md-offset-' + this._default_md_label, 'col-lg-' + this._default_lg_textbox, 'col-lg-offset-' + this._default_lg_label],
                        '.iwt-form-button-div': ['col-sm-' + this._default_sm_textbox, 'col-sm-offset-' + this._default_sm_label, 'col-md-' + this._default_md_textbox, 'col-md-offset-' + this._default_md_label, 'col-lg-' + this._default_lg_textbox, 'col-lg-offset-' + this._default_lg_label],

                        '.iwt-callback-status-panel': ['iwt-contains-floating-child'],
                        '.iwt-callback-notices-container': ['row'],
                        '.iwt-callback-subject-and-status-indicator-container': ['row'],
                        '.iwt-callback-status-and-avatar-container': ['row'],
                        '.iwt-callback-disconnect-button-panel-container': ['row'],
                        '.iwt-callback-failure-panel-container': ['row'],
                        '.iwt-callback-status-key': ['col-xs-6 control-label'],
                        '.iwt-callback-status-value': ['col-xs-6'],
                        '.iwt-callback-status-field': ['form-control-static'],
                        '.iwt-callback-participant-avatar-div': ['col-sm-3'],
                        '.iwt-callback-failure-panel': ['col-sm-12'],
                        '.iwt-callback-status-fields-container': ['col-sm-9'],
                        '.iwt-callback-status-form': ['form-horizontal'],
                        '.iwt-callback-disconnect-button': ['btn', 'btn-danger', 'btn-lg'],
                        '.iwt-callback-creation-success-panel': ['col-xs-12'],
                        '.iwt-callback-disconnected-panel': ['col-xs-12'],
                        '.iwt-callback-status-subject-div': ['col-sm-9'],
                        '.iwt-callback-status-indicator-container': ['col-sm-3'],
                        '.iwt-callback-disconnect-button-panel': ['col-sm-3', 'col-sm-offset-3'],
                        '.iwt-callback-status-failure-container': ['col-sm-12'],

                        '.iwt-chat-participants-panel': ['row'],
                        '.iwt-chat-printable-history-link': ['pull-right'],
                        '.iwt-print-div': ['col-lg-3', 'col-lg-push-9', 'col-sm-4', 'col-sm-push-8'],
                        '.iwt-participants-panel-list-container': ['col-lg-9', 'col-lg-pull-3', 'col-sm-8', 'col-sm-pull-4'],
                        '.iwt-chat-participant-popover-content': ['iwt-contains-floating-child'],
                        '.iwt-message-sender-container': ['row'],
                        '.iwt-message-sender': ['col-sm-12'],
                        '.iwt-message': ['row'],
                        '.iwt-message-vertical-spacer': ['visible-xs', 'col-xs-12'],
                        '.iwt-message-text-wrapper': ['col-lg-9', 'col-lg-pull-3', 'col-sm-8', 'col-sm-pull-4', 'col-xs-12'],
                        '.iwt-message-time-container': ['col-lg-3', 'col-lg-push-9', 'col-sm-4', 'col-sm-push-8', 'col-xs-12'],
                        '.iwt-message-time': ['sm-pull-right'],
                        '.iwt-send-on-enter-container': ['col-xs-12', 'col-sm-9', 'col-sm-push-3'],
                        '.iwt-send-on-enter-inner-container': ['sm-pull-right'],
                        '.iwt-chat-container-panel-bottom': ['row'],
                        '.iwt-chat-exit-button-container': ['col-xs-12', 'col-sm-3', 'col-sm-pull-9'],
                        '.iwt-compose-message-panel': ['row'],
                        '#iwt-compose-message-textarea': ['col-xs-8', 'col-sm-10'],
                        '.iwt-send-button': ['btn', 'btn-lg', 'btn-primary', 'col-xs-4', 'col-sm-2'],
                        '.iwt-exit-button': ['btn', 'btn-lg', 'btn-danger']
                    };

                // Language-specific maps

                // In Spanish, the text for "Email Address" wraps to a second line in "sm", so widen the left column of the forms.
                this._map_es = this._generateGridMapping(
                    {
                        'sm_label': 6,
                        'md_label': 4,
                        'lg_label': 3
                    });

                this._map_ja = this._generateGridMapping({
                    'sm_optional_label': 3,
                    'lg_optional_label': 2
                });

                this._map_ru = this._generateGridMapping({
                    'sm_label': 4,
                    'lg_label': 3,
                    'lg_optional_label': 2
                });
                $j.extend(this._map_ru,
                    {
                        '.iwt-print-div': ['col-lg-3', 'col-lg-push-9', 'col-sm-5', 'col-sm-push-7'],
                        '.iwt-participants-panel-list-container': ['col-lg-9', 'col-lg-pull-3', 'col-sm-7', 'col-sm-pull-5']
                    });

                this._map_tr =
                    {
                        '.iwt-optional-label': ['col-sm-2', 'col-sm-push-7', 'col-lg-2', 'col-lg-push-8'],
                        '.iwt-textbox-container-optional': ['col-sm-7', 'col-sm-pull-2', 'col-lg-8', 'col-lg-pull-2']
                    };

                var languageCode = localization.LanguageCode;
                languageCode = languageCode.replace("-", "_");
                this._languageMap = this["_map_" + languageCode];
            },

            /**
             * Takes an IWT CSS class/id, and returns an array of the Bootstrap class(es) that should also be used on the specified elements.
             *
             * Example:
             * getExtraCssClassesFor('.iwt-form-tabs') returns ['nav', 'nav-tabs']
             *
             * Since the return value may only specify CSS class(es), not id(s), the "." will not be present.
             * Note that more complex CSS selectors, such as ".iwt-form-tabs-container > .iwt-form-tabs" may not be used.
             */
            getExtraCssClassesFor: function (iwtCssSelector) {
                if (this._languageMap && this._languageMap[iwtCssSelector]) {
                    return this._languageMap[iwtCssSelector];
                }
                return this._map[iwtCssSelector] || null;
            },

            _generateGridMapping: function (params) {
                var sm_label = params.sm_label || this._default_sm_label;
                var sm_optional_label = params.sm_optional_label || this._default_sm_optional_label;
                var sm_textbox = 12 - (sm_label);
                var sm_optional_textbox = 12 - (sm_label + sm_optional_label);
                var md_label = params.md_label || this._default_md_label;
                var md_optional_label = params.md_optional_label || this._default_md_optional_label;
                var md_textbox = 12 - (md_label);
                var md_optional_textbox = 12 - (md_label + md_optional_label);
                var lg_label = params.lg_label || this._default_lg_label;
                var lg_optional_label = params.lg_optional_label || this._default_lg_optional_label;
                var lg_textbox = 12 - (lg_label);
                var lg_optional_textbox = 12 - (lg_label + lg_optional_label);
                return {
                    '.iwt-form-label': ['col-sm-' + sm_label, 'col-md-' + md_label, 'col-lg-' + lg_label, 'control-label'],
                    '.iwt-optional-label': ['col-sm-' + sm_optional_label, 'col-sm-push-' + sm_optional_textbox, 'col-md-' + md_optional_label, 'col-md-push-' + md_optional_textbox, 'col-lg-' + lg_optional_label, 'col-lg-push-' + lg_optional_textbox],
                    '.iwt-textbox-container': ['col-sm-' + sm_textbox, 'col-md-' + md_textbox, 'col-lg-' + lg_textbox],
                    '.iwt-textbox-container-optional': ['col-sm-' + sm_optional_textbox, 'col-sm-pull-' + sm_optional_label, 'col-md-' + md_optional_textbox, 'col-md-pull-' + md_optional_label, 'col-lg-' + lg_optional_textbox, 'col-lg-pull-' + lg_optional_label],
                    '.iwt-form-field-no-label': ['col-sm-' + sm_textbox, 'col-sm-offset-' + sm_label, 'col-md-' + md_textbox, 'col-md-offset-' + md_label, 'col-lg-' + lg_textbox, 'col-lg-offset-' + lg_label],
                    '.iwt-form-field-error': ['col-sm-' + sm_textbox, 'col-sm-offset-' + sm_label, 'col-md-' + md_textbox, 'col-md-offset-' + md_label, 'col-lg-' + lg_textbox, 'col-lg-offset-' + lg_label],
                    '.iwt-form-button-div': ['col-sm-' + sm_textbox, 'col-sm-offset-' + sm_label, 'col-md-' + md_textbox, 'col-md-offset-' + md_label, 'col-lg-' + lg_textbox, 'col-lg-offset-' + lg_label]
                };
            }
        });

    // Register namespaces
    ui.registerChildNamespace("_Internal");

    /**
     * _DefaultStatusFieldsDisplay class
     *
     * Do not instantiate this class directly.  Use
     * webservices.CustomizationFactoryRegistry.get_instance(webservices.CustomizableSingletonFactoryTypes.StatusFieldsDisplay)
     *
     * Controls whether the following fields are displayed in the Callback Status Panel.  By default, all are displayed.
     * Assigned Agent Name
     * Interaction State
     * Estimated Callback Time
     * Queue Wait Time
     * Queue Position
     * Longest Wait Time
     * Interactions Waiting Count
     * Logged In Agents Count
     * Available Agents Count
     * Subject (entered by web user)
     * Creation Time (time the callback request was submitted by web user)
     * Web User's name (if anonymous) or username (if authenticated)
     * Web user's telephone number
     */
    ui._Internal._DefaultStatusFieldsDisplay = Class.create(
        {
            /**
             * Constructor.  Does nothing.
             */
            initialize: function () {
            },

            /**
             * This method returns whether the assigned agent's name should be displayed
             * in the callback status panel.
             *
             * @return Boolean
             */
            get_showAssignedAgentName: function () {
                return true;
            },

            /**
             * This method returns whether the interaction state should be displayed
             * in the callback status panel.
             *
             * @return Boolean
             */
            get_showInteractionState: function () {
                return true;
            },

            /**
             * This method returns whether the assigned estimated callback time should be displayed
             * in the callback status panel.
             *
             * @return Boolean
             */
            get_showEstimatedCallbackTime: function () {
                return true;
            },

            /**
             * This method returns whether the queue wait time should be displayed
             * in the callback status panel.
             *
             * @return Boolean
             */
            get_showQueueWaitTime: function () {
                return true;
            },

            /**
             * This method returns whether the callback's position in the queue should be displayed
             * in the callback status panel.
             *
             * @return Boolean
             */
            get_showQueuePosition: function () {
                return true;
            },

            /**
             * This method returns whether the longest wait time of interactions in the queue should be displayed
             * in the callback status panel.
             *
             * @return Boolean
             */
            get_showLongestWaitTime: function () {
                return true;
            },

            /**
             * This method returns whether the number of interactions waiting on
             * the queue should be displayed in the callback status panel.
             *
             * @return Boolean
             */
            get_showInteractionsWaitingCount: function () {
                return true;
            },

            /**
             * This method returns whether the number of agents logged in should be displayed
             * in the callback status panel.
             *
             * @return Boolean
             */
            get_showLoggedInAgentsCount: function () {
                return true;
            },

            /**
             * This method returns whether the number of available agents should be displayed
             * in the callback status panel.
             *
             * @return Boolean
             */
            get_showAvailableAgentsCount: function () {
                return true;
            },

            /**
             * This method returns whether the callback's subject (as entered by the web user)
             * should be displayed in the callback status panel.
             *
             * @return Boolean
             */
            get_showSubject: function () {
                return true;
            },

            /**
             * This method returns whether the creation date/time of the callback should be displayed
             * in the callback status panel.
             *
             * @return Boolean
             */
            get_showCreationDateTime: function () {
                return true;
            },

            /**
             * This method returns whether the web user's name (if anonymous) or username (if authenticated)
             * should be displayed in the callback status panel.
             *
             * @return Boolean
             */
            get_showName: function () {
                return true;
            },

            /**
             * This method returns whether the web user's telephone number should be displayed
             * in the callback status panel.
             *
             * @return Boolean
             */
            get_showTelephone: function () {
                return true;
            },

            /**
             * Takes a prefix common to several resource keys, and a number of seconds, and
             * returns a localized string displaying that time duration.
             *
             * This is a customization point, to allow customers to tweak the number
             * of seconds before display.  This could be used to make the shortest displayed
             * time be 5 minutes, or to build in some over- or under-estimation, or to display
             * only increments of 5 minutes, etc. for instance.
             *
             * In this implementation, if seconds represents...
             * ...zero to 89 seconds, the returned value will be the resource
             * whose key is: resourcePrefix + "_Minute"
             * ...between 90 seconds and 45 minutes, the returned value will be the
             * rounded number of minutes substituted into the resource whose
             * key is: resourcePrefix + "_Minutes"
             * ...between 46 and 89 minutes, the returned value will be the resource
             * whose key is: resourcePrefix + "_Hour"
             * ...between 90 minutes and 20 hours, the returned value will be the rounded number
             * of hours substituted into the resource whose key is: resourcePrefix + "_Hours"
             * ...at least 20 hours but less than 36 hours, the returned value will be the
             * resource whose key is: resourcePrefix + "_Day"
             * ...at least 36 hours, the returned value will be the rounded number of days substituted
             * into the resource whose key is: resourcePrefix + "_Hours"
             *
             * In a later SU, this method will be changed to correctly handle the special rules for writing
             * plural numbers in languages such as Russian and Polish.
             *
             * @param resourcePrefix - A prefix common to several keys in the resource file. This method may append "_Minute", "_Minutes", "_Hour", "_Hours".
             * @param seconds - integer number of seconds
             * @return Localized string
             */
            formatTimeDuration: function (resourcePrefix, seconds) {
                var timeDuration = new webservices.TimeDuration(seconds);
                var resourceSuffix = "";

                if (timeDuration.getTotalSeconds() <= 89) {
                    return localization[resourcePrefix + "_Minute"];
                }
                else if (timeDuration.getTotalMinutes() <= 45) {
                    var nMinutesToDisplay = timeDuration.getRoundedMinutes();
                    return localization[resourcePrefix + "_Minutes"].replace('%0', nMinutesToDisplay);
                }
                else if (timeDuration.getTotalMinutes() <= 89) {
                    return localization[resourcePrefix + "_Hour"];
                }
                else if (timeDuration.getTotalHours() <= 20) {
                    var nHoursToDisplay = timeDuration.getRoundedHours();
                    return localization[resourcePrefix + "_Hours"].replace('%0', nHoursToDisplay);
                }
                else if (timeDuration.getTotalHours() <= 36) {
                    return localization[resourcePrefix + "_Day"];
                }
                else {
                    nDaysToDisplay = timeDuration.getRoundedDays();
                    return localization[resourcePrefix + "_Days"].replace('%0', nDaysToDisplay);
                }
            }
        });


    return ui;
});
