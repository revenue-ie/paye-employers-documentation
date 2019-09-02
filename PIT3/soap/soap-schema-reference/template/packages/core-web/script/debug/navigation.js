var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var BrowserInfo = (function () {
            function BrowserInfo() {
                this.test = "test";
                var ua = navigator.userAgent.toLowerCase();
                var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
                    /(webkit)[ \/]([\w.]+)/.exec(ua) ||
                    /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
                    /(msie) ([\w.]+)/.exec(ua) ||
                    ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
                    [];
                this.name = match[1] || "";
                this.version = parseInt(match[2] || "0");
            }
            return BrowserInfo;
        }());
        Content.BrowserInfo = BrowserInfo;
        var Browser = (function () {
            function Browser() {
            }
            /**
             * Return Microsoft Internet Explorer (major) version number, or 0 for others.
             */
            Browser.msIeVersion = function () {
                if (Browser.info.name == "msie") {
                    return Browser.info.version;
                }
                else {
                    return 0; // is other browser
                }
            };
            /**
             * Get a document instance from a given page element.
             */
            Browser.getDocumentInstance = function (element) {
                var elementSelector = null;
                if (!(element instanceof jQuery)) {
                    elementSelector = $(element);
                }
                else {
                    elementSelector = element;
                }
                // Find the container element
                var root = elementSelector.hasClass("content-root") ? elementSelector : elementSelector.parents(".content-root");
                if (root.length == 0) {
                    root = $("body");
                }
                else {
                    root = $(root.get(0));
                }
                // Now we have the root, check for a document object
                if (root.data("innovasys-document") != null) {
                    return root.data("innovasys-document");
                }
                else {
                    // No existing document, create a new one
                    var newDocument = new Innovasys.Content.Document(root.get(0));
                    root.data("innovasys-document", newDocument);
                    return newDocument;
                }
            };
            /**
             * Returns the current window location href.
             */
            Browser.getWindowLocationHref = function () {
                return window.location.href;
            };
            /**
             * Navigate to a new url.
             * @param url The url to navigate to.
             * @param replace Pass true in order to replace the current entry in the browser history.
             */
            Browser.navigateTo = function (url, replace) {
                if (replace === void 0) { replace = false; }
                if (replace) {
                    window.location.replace(url);
                }
                else {
                    window.location.href = url;
                }
            };
            /**
             * Cross browser helper for stopping event propogation.
             */
            Browser.stopPropagation = function (e) {
                if (e.stopPropagation) {
                    e.stopPropagation();
                }
                else {
                    e.returnValue = false;
                }
            };
            /**
             * Loads a stylesheet from the specified Url.
             */
            Browser.loadStylesheet = function (stylesheetUrl, stylesheetId, beforeElementId, onLoaded) {
                if (onLoaded === void 0) { onLoaded = null; }
                var id = "file" + this.dynamicallyLoadedFileIndex;
                this.dynamicallyLoadedFileIndex++;
                var attributes = { "data-stylesheet-id": stylesheetId };
                yepnope.injectCss({ href: stylesheetUrl, attrs: attributes }, function () {
                    onLoaded(id);
                });
                return id;
            };
            /**
             * Loads a script file from the specified Url.
             */
            Browser.loadScript = function (scriptUrl, scriptId, beforeElementId, onLoaded) {
                if (onLoaded === void 0) { onLoaded = null; }
                var id = "file" + this.dynamicallyLoadedFileIndex;
                this.dynamicallyLoadedFileIndex++;
                var attributes = { "data-script-id": scriptId };
                yepnope.injectJs({ src: scriptUrl, attrs: attributes }, function () {
                    onLoaded(id);
                });
                return id;
            };
            Browser.resizeIFrames = function (selector, ignoreOffScreen) {
                if (ignoreOffScreen === void 0) { ignoreOffScreen = false; }
                var maxHeight = 0;
                var minAllowedHeight = 0;
                try {
                    minAllowedHeight = $(window.top).height();
                }
                catch (ex) {
                    minAllowedHeight = $(window).height();
                }
                $('iframe', selector).each(function (index, element) {
                    if ($(element).is(":visible") && (ignoreOffScreen || $(element).offset().left >= 0)) {
                        // Only resize if visible
                        var currentHeight = 0;
                        var doc = null;
                        try {
                            doc = element.contentDocument ? element.contentDocument : (element.contentWindow.document || element.document);
                        }
                        catch (ex) {
                        }
                        if (doc != null) {
                            // Firefox throws an error here, so we trap and fallback
                            try {
                                currentHeight = $(doc).height();
                            }
                            catch (ex) {
                                currentHeight = minAllowedHeight;
                            }
                        }
                        else {
                            currentHeight = minAllowedHeight;
                        }
                        var lastHeight = $(element).data('last-height');
                        if (!lastHeight)
                            lastHeight = 0;
                        var heightDifference = currentHeight - lastHeight;
                        if (heightDifference > 10 || (heightDifference < 0 && heightDifference < 10)) {
                            var parent = $(element).parent();
                            if (parent.get(0).tagName == "DIV" && currentHeight < parent.height()) {
                                // Resize to at least the containing DIV height
                                currentHeight = parent.height();
                            }
                            if (currentHeight < minAllowedHeight) {
                                // Make sure at least as high as the window
                                currentHeight = minAllowedHeight;
                            }
                            $(element).height((currentHeight) + "px");
                            $(element).data('last-height', currentHeight);
                        }
                    }
                    else if (!$(element).is(":visible")) {
                        // Not visible, collapse to zero
                        $(element).height(0);
                        $(element).data('last-height', 0);
                    }
                    if (currentHeight > maxHeight) {
                        // Record the maximum iframe height
                        maxHeight = currentHeight;
                    }
                });
                var busy = $("#i-busy");
                if (busy.length != 0) {
                    busy.height(maxHeight);
                }
                return maxHeight;
            };
            Browser.showElement = function (element) {
                // Firefox does not remove a display: none on show so we check for that specifically here
                element.show();
                if (element.css('display') == 'none') {
                    $('body').css('display', 'block');
                }
            };
            /**
             * Works around a jQuery setAttribute bug for a specific IE mode used by MSHV and Help 2.x (with IE11 installed)
             */
            Browser.checkForIe7ModeJqueryBug = function () {
                if (Browser.info.name == "msie" && Browser.info.version <= 7) {
                    var MshvAttributeSetWorkaround = {
                        set: function (elem, value, name) {
                            elem.setAttribute(name, value);
                            return elem.getAttributeNode(name);
                        }
                    };
                    if ($ != null && $.attrHooks != null) {
                        var attributeHooks = $.attrHooks;
                        attributeHooks["aria-describedby"] = MshvAttributeSetWorkaround;
                        attributeHooks["aria-live"] = MshvAttributeSetWorkaround;
                        attributeHooks["aria-atomic"] = MshvAttributeSetWorkaround;
                        attributeHooks["aria-hidden"] = MshvAttributeSetWorkaround;
                    }
                }
            };
            /** Indicates that we are running in a design time environment (i.e. the editor) */
            Browser.isDesignTime = false;
            /** Indicates that animations should be disabled */
            Browser.isAnimationDisabled = false;
            /** Provides access to more information about the browser agent etc. */
            Browser.info = new BrowserInfo();
            /** Index for dynamically loaded stylesheets */
            Browser.dynamicallyLoadedFileIndex = 0;
            return Browser;
        }());
        Content.Browser = Browser;
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
var overrides = Innovasys.overrides;
if (document.compatMode != "BackCompat"
    || !(location.protocol == 'ms-xhelp:' || location.href.indexOf('ms.help?') != -1 || location.href.indexOf('?method=page&') != -1)) {
    if (overrides == null || !overrides.isHideBodyDuringLoadDisabled) {
        // Prevent flickering by setting body to display:none during initialization
        document.write('<style type="text/css">body{display:none}</style>');
    }
}
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        /**
         * Encapsulates a left and top position.
         */
        var ElementPosition = (function () {
            function ElementPosition(left, top) {
                this.left = left;
                this.top = top;
            }
            ;
            return ElementPosition;
        }());
        Content.ElementPosition = ElementPosition;
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var DomHelpers = (function () {
            function DomHelpers() {
            }
            /**
             * Returns an elements absolute position, allowing for the non-scrolling header
             * @param element The element to find the absolute position of
             */
            DomHelpers.getElementPosition = function (element) {
                var offsetLeft = 0;
                var offsetTop = 0;
                while (element) {
                    // Allow for the scrolling body region in IE
                    if (Content.Browser.msIeVersion() > 4) {
                        offsetLeft += (element.offsetLeft - element.scrollLeft);
                        offsetTop += (element.offsetTop - element.scrollTop);
                    }
                    else {
                        offsetLeft += element.offsetLeft;
                        offsetTop += element.offsetTop;
                    }
                    element = element.offsetParent;
                }
                if (navigator.userAgent.indexOf('Mac') != -1
                    && typeof document.body.leftMargin != 'undefined') {
                    offsetLeft += document.body.leftMargin;
                    offsetTop += document.body.topMargin;
                }
                return new Content.ElementPosition(offsetLeft, offsetTop);
            };
            /**
             * Returns the text from the containing table. Uses this as the context element from which to find the containing table.
             */
            DomHelpers.getTextFromContainingTable = function (element) {
                var parentTable = $($(element).parents('table').get(0));
                var tableCell = parentTable.find('td').get(0);
                if (tableCell != null) {
                    if (tableCell.textContent != null) {
                        return tableCell.textContent;
                    }
                    else if (tableCell.innerText != null) {
                        return tableCell.innerText;
                    }
                    else {
                        return $(tableCell).text();
                    }
                }
            };
            return DomHelpers;
        }());
        Content.DomHelpers = DomHelpers;
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
/* .NET Framework Help Topic Resolution */
// This function is Copyright 2006 Innovasys Limited. No reproduction or usage
//  allowed other than in documentation generated by licensed Innovasys products
function resolveHelp2Keyword(keyword, onlineKeyword) {
    var url = "";
    try {
        // Try the current namespace
        url = findHelp2Keyword(getCurrentHelp2Namespace(), keyword);
        if (url == "") {
            // Try the likely namespaces first, most recent first
            url = findHelp2Keyword("MS.VSCC.v80", keyword);
            if (url == "") {
                url = findHelp2Keyword("MS.VSCC.2003", keyword);
                if (url == "") {
                    url = findHelp2Keyword("MS.VSCC", keyword);
                }
            }
        }
        // URL found in one of the known VSCC namespaces
        if (url != "") {
            return url;
        }
        else {
            var registryWalker = new ActiveXObject("HxDs.HxRegistryWalker");
            var namespaces = registryWalker.RegisteredNamespaceList("MS.VSCC");
            var namespace, namespaceName;
            if (namespaces.Count > 0) {
                for (var n = 1; n <= namespaces.Count; n++) {
                    namespace = namespaces.Item(n);
                    namespaceName = namespace.Name;
                    if (namespaceName.substring(0, 7) == "MS.VSCC") {
                        switch (namespaceName) {
                            case "MS.VSCC.v80":
                                break;
                            case "MS.VSCC.2003":
                                break;
                            case "MS.VSCC":
                                break;
                            default:
                                url = findHelp2Keyword(namespaceName, "");
                                if (url != "") {
                                    return url;
                                }
                        }
                    }
                }
            }
        }
    }
    catch (e) { }
    // No match found in any applicable namespace
    // Msdn doesn't support links to individual overloads, only to the master page
    //  so we trim off the brackets when directing to Msdn
    var bracketPosition = onlineKeyword.indexOf("(");
    if (bracketPosition != -1) {
        onlineKeyword = onlineKeyword.substring(0, bracketPosition);
    }
    return "http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k(" + onlineKeyword + ")&rd=true";
}
function findHelp2Keyword(namespaceName, keyword) {
    var session, topics;
    if (namespaceName.length > 0) {
        try {
            session = new ActiveXObject("HxDs.HxSession");
            session.Initialize("ms-help://" + namespaceName, 0);
            topics = session.Query(keyword, "!DefaultAssociativeIndex", 0, "");
            if (topics.Count > 0) {
                return topics(1).URL;
            }
        }
        catch (e) { }
    }
    return "";
}
function navigateToHelp2Keyword(keyword, onlineKeyword, replacePage) {
    window.status = "Resolving link. Please wait a moment...";
    var url = resolveHelp2Keyword(keyword, onlineKeyword);
    window.status = "";
    if (url.substring(0, 25) === "http://msdn.microsoft.com" && window.parent != null) {
        // MSDN no longer support hosting in an IFRAME so open in new browser window 
        window.open(url, "_blank");
    }
    else if (replacePage == true) {
        location.replace(url);
    }
    else {
        location.href = url;
    }
}
function getCurrentHelp2Namespace() {
    var namespace = "";
    var location = window.location;
    if (location.protocol == "ms-help:") {
        namespace = location.hostname;
        if (namespace.substring(0, 2) == "//")
            namespace = namespace.substring(2);
    }
    return namespace;
}
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        /**
         * Wrapper for handling load/save to localstorage. Handles the difference in functionality when executing at design time
         *  and in a CHM.
         */
        var LocalStorageHandler = (function () {
            function LocalStorageHandler(attributePrefix) {
                if (attributePrefix === void 0) { attributePrefix = ""; }
                this.attributePrefix = attributePrefix;
                this.storageMethod = "native";
                this.cookieData = null;
                this.storageElement = null;
                var windowLocalStorage;
                try {
                    // Edge throws an exception when querying localStorage in local file system output
                    windowLocalStorage = window.localStorage;
                }
                catch (e) { }
                if (!windowLocalStorage) {
                    if (location.protocol == "ms-its:") {
                        // Cookies don't work in CHM so we use userdata behavior instead
                        this.storageMethod = "userdata";
                        var storageElement = $("<link />");
                        storageElement.css("behavior", "url(#default#userdata)");
                        storageElement.appendTo("body");
                        this.storageElement = storageElement.get(0);
                        this.storageElement.load("localStorage");
                    }
                    else {
                        // If local storage isn't available, fall back to cookie storage
                        this.storageMethod = "cookie";
                        var cookieValue = $.cookie("localStorage");
                        if (cookieValue) {
                            this.cookieData = JSON.parse(cookieValue);
                        }
                        else {
                            this.cookieData = {};
                        }
                    }
                }
            }
            LocalStorageHandler.prototype.load = function (name) {
                // local storage automatically saves
            };
            LocalStorageHandler.prototype.save = function (name) {
                // local storage automatically saves
            };
            LocalStorageHandler.prototype.setAttribute = function (key, value) {
                if (this.attributePrefix != null) {
                    key = this.attributePrefix + key;
                }
                if (this.storageMethod == "native") {
                    if (value == null || undefined == value) {
                        window.localStorage.removeItem(key);
                    }
                    else {
                        window.localStorage.setItem(key, value);
                    }
                }
                else if (this.storageMethod == "cookie") {
                    if (value == null) {
                        this.cookieData[key] = null;
                    }
                    else {
                        this.cookieData[key] = value + '';
                    }
                    $.cookie("localStorage", JSON.stringify(this.cookieData), { expires: 365, path: "/", domain: "" });
                }
                else if (this.storageMethod == "userdata") {
                    this.storageElement.setAttribute(key, value + '');
                    // Save method is added by the userdata behavior
                    this.storageElement.save("localStorage");
                }
            };
            LocalStorageHandler.prototype.getAttribute = function (key) {
                if (this.attributePrefix != null) {
                    key = this.attributePrefix + key;
                }
                if (this.storageMethod == "native") {
                    return window.localStorage.getItem(key);
                }
                else if (this.storageMethod == "cookie") {
                    if (this.cookieData[key] === undefined) {
                        return null;
                    }
                    else {
                        return this.cookieData[key];
                    }
                }
                else if (this.storageMethod == "userdata") {
                    return this.storageElement.getAttribute(key);
                }
            };
            return LocalStorageHandler;
        }());
        Content.LocalStorageHandler = LocalStorageHandler;
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        /**
         * A message object, used for cross frame communication.
         */
        var WindowMessage = (function () {
            function WindowMessage(messageType, messageData) {
                this.messageType = messageType;
                this.messageData = messageData;
            }
            return WindowMessage;
        }());
        Content.WindowMessage = WindowMessage;
        /**
         * Cross frame messaging utility functionality.
         */
        var Messaging = (function () {
            function Messaging() {
            }
            /**
             * Returns true if PostMessage support is available in the current browser.
             */
            Messaging.isPostMessageEnabled = function () {
                return (window['postMessage'] != null);
            };
            /**
             * Registers to receive message events incoming to the current window.
             * @param receiver The receiving event handler.
             */
            Messaging.addMessageListener = function (receiver) {
                if (Messaging.isPostMessageEnabled()) {
                    if (window['addEventListener']) {
                        window.addEventListener("message", receiver, false);
                    }
                    else {
                        window.attachEvent("onmessage", receiver);
                    }
                }
            };
            /**
             * Removes a previous registered window event listener
             * @param receiver The receiving event handler.
             */
            Messaging.removeMessageListener = function (receiver) {
                if (Messaging.isPostMessageEnabled()) {
                    if (window['addEventListener']) {
                        window.removeEventListener("message", receiver, false);
                    }
                    else {
                        window.detachEvent("onmessage", receiver);
                    }
                }
            };
            /**
             * Gets a WindowMessage object from string message data.
             * @param data The string containing the message data (format MessageType|MessageData).
             */
            Messaging.getMessageFromData = function (data) {
                var separator = data.indexOf("|");
                var messageType = null;
                var messageData = null;
                if (separator != -1) {
                    messageType = data.substring(0, separator);
                    messageData = data.substring(separator + 1);
                }
                else {
                    messageType = data;
                    messageData = "";
                }
                return new WindowMessage(messageType, messageData);
            };
            Messaging.routeMessageToFrameElement = function (windowName, messageType, messageData) {
                var element = document.getElementById(windowName);
                if (element != null && element.contentWindow != null) {
                    Messaging.routeMessageToWindow(element.contentWindow, messageType, messageData);
                }
            };
            Messaging.routeMessageToWindow = function (window, messageType, messageData) {
                if (window != null && self != window) {
                    if (window != null && window.postMessage != null) {
                        window.postMessage(messageType + "|" + messageData, "*");
                    }
                }
            };
            Messaging.routeMessageToParentFrame = function (messageType, messageData) {
                if (parent != null && self != parent) {
                    this.routeMessageToWindow(parent, messageType, messageData);
                }
            };
            return Messaging;
        }());
        Content.Messaging = Messaging;
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var DocumentFeatureBase = (function () {
            function DocumentFeatureBase(documentInstance) {
                this.documentInstance = null;
                this._responsiveConfiguration = null;
                this.documentInstance = documentInstance;
            }
            DocumentFeatureBase.prototype.initializeDocument = function () {
            };
            DocumentFeatureBase.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                if (isInitialLoad === void 0) { isInitialLoad = false; }
            };
            DocumentFeatureBase.prototype.onMessage = function (message) {
            };
            DocumentFeatureBase.prototype.getName = function () {
                throw new Error("Feature name not implemented");
            };
            DocumentFeatureBase.prototype.ensureElementVisible = function (element) {
            };
            DocumentFeatureBase.prototype.beforeSetElementVisibility = function (element, isVisible, isImmediate) {
                return false;
            };
            DocumentFeatureBase.prototype.afterSetElementVisibility = function (element, isVisible) {
            };
            DocumentFeatureBase.prototype.populateResponsiveConfiguration = function (configuration) {
            };
            DocumentFeatureBase.prototype.applyResponsiveConfiguration = function (configuration) {
            };
            /**
             * Returns a number used to determine the order of content initialization amongst document features.
             */
            DocumentFeatureBase.prototype.initializeContentOrdinal = function () {
                return 0;
            };
            return DocumentFeatureBase;
        }());
        Content.DocumentFeatureBase = DocumentFeatureBase;
        var DocumentFeatureConfiguration = (function () {
            function DocumentFeatureConfiguration() {
            }
            DocumentFeatureConfiguration.registerDocumentFeatureFactory = function (factory) {
                DocumentFeatureConfiguration._featureFactories.push(factory);
            };
            DocumentFeatureConfiguration.getFeatureFactories = function () {
                return DocumentFeatureConfiguration._featureFactories;
            };
            // TODO: Would be useful to key this array so that a feature factory can override a default implementation
            DocumentFeatureConfiguration._featureFactories = [];
            return DocumentFeatureConfiguration;
        }());
        Content.DocumentFeatureConfiguration = DocumentFeatureConfiguration;
        var ResponsiveConfiguration = (function () {
            function ResponsiveConfiguration(profileName, clickTargets) {
                if (clickTargets === void 0) { clickTargets = []; }
                this.profileName = profileName;
                this.clickTargets = clickTargets;
                this.stylesheetUrls = [];
                this.tablesToPivot = [];
            }
            return ResponsiveConfiguration;
        }());
        Content.ResponsiveConfiguration = ResponsiveConfiguration;
        var ResponsiveClickTarget = (function () {
            function ResponsiveClickTarget(className, kind) {
                this.className = className;
                this.kind = kind;
            }
            return ResponsiveClickTarget;
        }());
        Content.ResponsiveClickTarget = ResponsiveClickTarget;
        var ResponsiveTable = (function () {
            function ResponsiveTable(selector, onAfterPivot) {
                if (onAfterPivot === void 0) { onAfterPivot = null; }
                this.selector = selector;
                this.onAfterPivot = onAfterPivot;
            }
            return ResponsiveTable;
        }());
        Content.ResponsiveTable = ResponsiveTable;
        (function (ResponsiveClickTargetKind) {
            ResponsiveClickTargetKind[ResponsiveClickTargetKind["auto"] = 0] = "auto";
            ResponsiveClickTargetKind[ResponsiveClickTargetKind["inline"] = 1] = "inline";
            ResponsiveClickTargetKind[ResponsiveClickTargetKind["block"] = 2] = "block";
        })(Content.ResponsiveClickTargetKind || (Content.ResponsiveClickTargetKind = {}));
        var ResponsiveClickTargetKind = Content.ResponsiveClickTargetKind;
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Document = (function () {
            function Document(rootElement, id) {
                var _this = this;
                if (id === void 0) { id = ""; }
                /** Handle to the local storage instance */
                this._localStorageInstance = null;
                /** Indicates if this document instance has been unloaded */
                this._isUnloaded = true;
                /** Provides an id that can be used to disambiguate this document if it is loaded in a parent document */
                this.id = "";
                /** The root element of this logical document */
                this.rootElement = null;
                /** JQuery selector representing the root element of this document */
                this.rootSelector = null;
                /** Indicates that this page should be highlighted as new */
                this.isNew = false;
                /** Indicates that automatic responsive functionality is enabled */
                this.isResponsiveEnabled = false;
                /** Indicates that the body should be made visible after loading is complete. Can be set to false if waiting on dynamically loaded stylesheets */
                this.setBodyVisibleAfterLoadComplete = true;
                /** Indicates that this is a content document. Content documents inform the parent frames on load */
                this.isContentDocument = true;
                this._features = null;
                this.id = id;
                this.rootElement = rootElement;
                this.rootSelector = $(rootElement);
                this.rootSelector.data("innovasys-document", this);
                // Create the features instances according to configuration. Some factories may return null if the feature
                //  is not required for this document.
                this._features = $.map(Content.DocumentFeatureConfiguration.getFeatureFactories(), function (factory, index) {
                    return factory.createInstance(_this);
                });
                // Initialize the features.
                $.each(this._features, function (index, feature) {
                    feature.initializeDocument();
                });
            }
            /**
             * Get a local storage instance, initializing the first time it is called.
             */
            Document.prototype.getLocalStorage = function () {
                if (Content.Browser.isDesignTime) {
                    try {
                        if (window.external.IsInnovasysDesigner) {
                            this._localStorageInstance = window.external;
                        }
                    }
                    catch (e) { }
                }
                if (!this._localStorageInstance) {
                    this._localStorageInstance = new Content.LocalStorageHandler(this.id);
                }
                return this._localStorageInstance;
            };
            /**
             * Called once the DOM has loaded. Performs content initialization.
             */
            Document.prototype.load = function () {
                var _this = this;
                // If running in a frame, set up a message listener and let
                //  the parent frame know we have loaded
                if (this.id == "") {
                    // Running in a frame - listen for commands
                    if (Innovasys.Content.Messaging.isPostMessageEnabled()) {
                        this._windowMessageEventListener = function (ev) { return _this.receiveMessage(ev); };
                        Innovasys.Content.Messaging.addMessageListener(this._windowMessageEventListener);
                        if (this.isContentDocument) {
                            // Notify the parent frame that we have loaded, and give it our page title
                            Content.Messaging.routeMessageToParentFrame("loaded", location.href);
                            Content.Messaging.routeMessageToParentFrame("updatePageTitle", document.title);
                        }
                    }
                }
                // Configure our document content for each of the features
                this.initializeContent(this.rootSelector, true);
                if (this.id == "" && this.setBodyVisibleAfterLoadComplete) {
                    // Resume rendering updates after loading complete
                    $('body').css('display', 'block');
                }
            };
            Document.prototype.unload = function () {
                if (this.id == "") {
                    // Running in a frame - remove message listener
                    if (Innovasys.Content.Messaging.isPostMessageEnabled() && this._windowMessageEventListener != null) {
                        Innovasys.Content.Messaging.removeMessageListener(this._windowMessageEventListener);
                    }
                }
                this._isUnloaded = true;
            };
            /**
             * Initializes new DOM content, either on page load or subsequently when new content is created.
             */
            Document.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                if (isInitialLoad === void 0) { isInitialLoad = false; }
                $.each(this._features.sort(function (a, b) {
                    return a.initializeContentOrdinal() - b.initializeContentOrdinal();
                }), function (index, feature) {
                    feature.initializeContent(rootSelector, isInitialLoad);
                });
            };
            /**
             * Creates, populates and returns a responsive configuration instance.
             */
            Document.prototype.getResponsiveConfiguration = function (profileName) {
                var configuration = new Content.ResponsiveConfiguration(profileName);
                $.each(this._features, function (index, feature) {
                    feature.populateResponsiveConfiguration(configuration);
                });
                return configuration;
            };
            /**
             * Applies a responsive configuration.
             */
            Document.prototype.applyResponsiveConfiguration = function (responsiveConfiguration) {
                $.each(this._features, function (index, feature) {
                    feature.applyResponsiveConfiguration(responsiveConfiguration);
                });
            };
            /**
             * Cross frame message processor.
             * @param event The message event containing message data.
             */
            Document.prototype.receiveMessage = function (event) {
                var message = null;
                try {
                    message = Innovasys.Content.Messaging.getMessageFromData(event.data);
                }
                catch (ex) {
                }
                this.processWindowMessage(message);
            };
            /**
             * Process the passed message.
             */
            Document.prototype.processWindowMessage = function (message) {
                if (message) {
                    switch (message.messageType) {
                        case "refresh":
                            document.location.reload();
                            break;
                        default:
                            if (this._features != null) {
                                $.each(this._features, function (index, feature) {
                                    feature.onMessage(message);
                                });
                            }
                    }
                }
            };
            /**
             * Ensures that the passed element is visible. Calls document features to apply
             *  any necessary logic (e.g. where the element is within a collapsed section or tab)
             */
            Document.prototype.ensureElementVisible = function (element) {
                $.each(this._features, function (index, feature) {
                    feature.ensureElementVisible(element);
                });
            };
            /**
             * Toggle the state of an element or elements.
             * @param elements JQuery selector representing Element(s) to toggle state for.
             * @param isImmediate When set to true, animations are disabled.
             * @param isVisible Indicates if the element(s) should be made visible or not.
             */
            Document.prototype.setElementVisibility = function (elements, isVisible, isImmediate) {
                var _this = this;
                return elements.each(function (index, element) {
                    var cancelDefault = false;
                    // Allow features to add custom behavior and/or prevent default
                    $.each(_this._features, function (index, feature) {
                        if (!cancelDefault) {
                            if (feature.beforeSetElementVisibility(element, isVisible, isImmediate) == true) {
                                cancelDefault = true;
                            }
                        }
                    });
                    if (!cancelDefault) {
                        if (($(element).css("display") != "none") != isVisible) {
                            if ($(element).css("display") == "none") {
                                if (isImmediate || Content.Browser.isAnimationDisabled) {
                                    // Element is currently not visible - make it visible
                                    var originalDisplay = $(element).data("i-original-display");
                                    if (originalDisplay != null) {
                                        $(element).css("display", originalDisplay);
                                        $(element).data("i-original-display", null);
                                    }
                                    else {
                                        if (element.tagName == 'TR') {
                                            $(element).css("display", "table-row");
                                        }
                                        else {
                                            $(element).css("display", "block");
                                        }
                                    }
                                }
                                else {
                                    $(element).slideDown("fast");
                                }
                            }
                            else {
                                // Element is currently visible, hide
                                $(element).data("i-original-display", $(element).css("display"));
                                if (isImmediate || Content.Browser.isAnimationDisabled) {
                                    $(element).hide();
                                }
                                else {
                                    $(element).slideUp("fast");
                                }
                            }
                        }
                        $.each(_this._features, function (index, feature) {
                            feature.afterSetElementVisibility(element, isVisible);
                        });
                    }
                });
            };
            /**
             * Returns a feature matching the passed name
             */
            Document.prototype.getFeatureByName = function (name) {
                if (name == null) {
                    return null;
                }
                var matchingFeatures = $.map(this._features, function (feature, index) {
                    if (feature.getName().toLowerCase() === name.toLowerCase()) {
                        return feature;
                    }
                    else {
                        return null;
                    }
                });
                if (matchingFeatures.length > 0) {
                    return matchingFeatures[0];
                }
            };
            return Document;
        }());
        Content.Document = Document;
        var DocumentMessageNames = (function () {
            function DocumentMessageNames() {
            }
            DocumentMessageNames.quickSearch = "quickSearch";
            DocumentMessageNames.resetQuickSearch = "resetquicksearch";
            DocumentMessageNames.insertNavigationHeader = "insertNavigationHeader";
            DocumentMessageNames.searchHighlightComplete = "searchHighlightComplete";
            return DocumentMessageNames;
        }());
        Content.DocumentMessageNames = DocumentMessageNames;
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var ResponsiveDocumentFeatureFactory = (function () {
                function ResponsiveDocumentFeatureFactory() {
                }
                ResponsiveDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new ResponsiveDocumentFeature(documentInstance);
                };
                return ResponsiveDocumentFeatureFactory;
            }());
            Features.ResponsiveDocumentFeatureFactory = ResponsiveDocumentFeatureFactory;
            var ResponsiveDocumentFeature = (function (_super) {
                __extends(ResponsiveDocumentFeature, _super);
                function ResponsiveDocumentFeature(documentInstance) {
                    _super.call(this, documentInstance);
                    this._pendingResponsiveFiles = new Array();
                    this._configuration = null;
                }
                ResponsiveDocumentFeature.prototype.getName = function () {
                    return "Responsive";
                };
                ResponsiveDocumentFeature.prototype.initializeDocument = function () {
                    Innovasys.Content.Messaging.addMessageListener(function (ev) {
                    });
                };
                ResponsiveDocumentFeature.prototype.checkPendingResponsiveFilesLoad = function (loadedId) {
                    this._pendingResponsiveFiles = $.map(this._pendingResponsiveFiles, function (item, index) {
                        if (item == loadedId) {
                            // This item now loaded, exclude from pending array
                            return null;
                        }
                        else {
                            return item;
                        }
                    });
                    if (this._pendingResponsiveFiles.length == 0) {
                        // All loaded
                        this.onResponsiveFilesLoaded();
                    }
                };
                ResponsiveDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    var _this = this;
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    if (isInitialLoad == true) {
                        var deviceType = this.getDeviceType().toLowerCase();
                        // Gather the responsive configuration
                        var configuration = this.documentInstance.getResponsiveConfiguration(deviceType);
                        if (this.documentInstance.isResponsiveEnabled) {
                            switch (deviceType) {
                                case "mobile":
                                    $('.i-hidden-mobile, .i-visible-tablet, .i-visible-desktop').css('display', 'hidden');
                                    break;
                                case "tablet":
                                    $('.i-hidden-tablet, .i-visible-mobile, .i-visible-desktop').css('display', 'hidden');
                                    break;
                                case "desktop":
                                    $('.i-hidden-desktop, .i-visible-mobile, .i-visible-tablet').css('display', 'hidden');
                                    break;
                            }
                            if (deviceType != "desktop") {
                                // Find and add any stylesheets with data-responsive-{profileName} attributes
                                $("link[data-responsive-" + deviceType + "]").each(function (index, stylesheet) {
                                    var responsiveStylesheets = $(stylesheet).attr("data-responsive-" + deviceType);
                                    if (responsiveStylesheets != null) {
                                        // Defer setting body visible while we wait for our custom stylesheet to load
                                        _this.documentInstance.setBodyVisibleAfterLoadComplete = false;
                                        $.each(responsiveStylesheets.split(","), function (index, url) {
                                            // Give the stylesheet a link so we can remove it later if the responsive style changes
                                            _this._pendingResponsiveFiles.push(Content.Browser.loadStylesheet(url, "data-responsive-" + deviceType, "responsive-marker", function (stylesheetId) {
                                                _this.checkPendingResponsiveFilesLoad(stylesheetId);
                                            }));
                                        });
                                    }
                                });
                                // Find any stylesheet references stored in css/responsive script tags
                                $("script[type='i-url-container/css']").each(function (index, scriptElement) {
                                    var scriptContainer = $(scriptElement);
                                    var displayModes = scriptContainer.data("responsive-display-modes");
                                    if (displayModes != null && displayModes.toLowerCase().indexOf(deviceType) != -1) {
                                        var url = $.trim(scriptContainer.html());
                                        _this.documentInstance.setBodyVisibleAfterLoadComplete = false;
                                        // Give the stylesheet a link so we can remove it later if the responsive style changes
                                        _this._pendingResponsiveFiles.push(Content.Browser.loadStylesheet(url, "data-responsive-" + deviceType, "responsive-marker", function (stylesheetId) {
                                            _this.checkPendingResponsiveFilesLoad(stylesheetId);
                                        }));
                                    }
                                });
                                // Find any script references stored in css/responsive script tags
                                $("script[type='i-url-container/script']").each(function (index, scriptElement) {
                                    var scriptContainer = $(scriptElement);
                                    var displayModes = scriptContainer.data("responsive-display-modes");
                                    if (displayModes != null && displayModes.toLowerCase().indexOf(deviceType) != -1) {
                                        var url = $.trim(scriptContainer.html());
                                        _this.documentInstance.setBodyVisibleAfterLoadComplete = false;
                                        // Give the stylesheet a link so we can remove it later if the responsive style changes
                                        _this._pendingResponsiveFiles.push(Content.Browser.loadScript(url, "data-responsive-" + deviceType, "responsive-marker", function (scriptId) {
                                            _this.checkPendingResponsiveFilesLoad(scriptId);
                                        }));
                                    }
                                });
                            }
                            if (configuration.profileName == "mobile" || configuration.profileName == "tablet") {
                                switch (configuration.profileName) {
                                    case "mobile":
                                        configuration.clickTargets.push(new Content.ResponsiveClickTarget(".i-link>a,"
                                            + ".i-member-link a", Content.ResponsiveClickTargetKind.block));
                                        break;
                                    case "tablet":
                                        configuration.clickTargets.push(new Content.ResponsiveClickTarget(".i-breadcrumbs-container a,"
                                            + "#i-after-header-content .i-page-link,"
                                            + "#i-after-header-content .i-popup-link,"
                                            + "#i-after-header-content .i-function-link", Content.ResponsiveClickTargetKind.inline));
                                        configuration.clickTargets.push(new Content.ResponsiveClickTarget("a[href='#top']", Content.ResponsiveClickTargetKind.block));
                                        break;
                                }
                                // Add some default click targets - apply to both mobile and tablet                
                                configuration.clickTargets.push(new Content.ResponsiveClickTarget("#i-footer-content>a,"
                                    + "#i-after-header-content .i-function-link", Content.ResponsiveClickTargetKind.inline));
                                configuration.clickTargets.push(new Content.ResponsiveClickTarget("#i-seealso-section-content a,"
                                    + ".i-in-this-topic-container a", Content.ResponsiveClickTargetKind.block));
                                // And default pivot tables
                                configuration.tablesToPivot.push(new Content.ResponsiveTable("table.pivot-table,table.i-pivot-table"));
                            }
                        }
                        this._configuration = configuration;
                        if (this._pendingResponsiveFiles.length == 0) {
                            // No pending files, immediately apply                   
                            this.onResponsiveFilesLoaded();
                        }
                    }
                };
                ResponsiveDocumentFeature.prototype.initializeContentOrdinal = function () {
                    return 999;
                };
                ResponsiveDocumentFeature.prototype.applyResponsiveConfiguration = function (configuration) {
                    var _this = this;
                    // Apply the custom click targets
                    $.each(configuration.clickTargets, function (index, clickTarget) {
                        _this.applyClickTarget(clickTarget);
                    });
                    // Pivot tables
                    $.each(configuration.tablesToPivot, function (index, responsiveTable) {
                        $(responsiveTable.selector).each(function (index, table) {
                            var pivotDiv = ResponsiveDocumentFeature.pivotTable(table);
                            if (pivotDiv != null && responsiveTable.onAfterPivot != null) {
                                responsiveTable.onAfterPivot($(table), pivotDiv);
                            }
                        });
                    });
                };
                ResponsiveDocumentFeature.prototype.onMessage = function (message) {
                    if (message) {
                        switch (message.messageType) {
                            case Content.DocumentMessageNames.insertNavigationHeader:
                                this.insertNavigationHeader();
                                break;
                            case Content.DocumentMessageNames.searchHighlightComplete:
                                $('a#i-remove-highlighting').css('display', 'inline');
                                break;
                        }
                    }
                };
                ResponsiveDocumentFeature.prototype.insertNavigationHeader = function () {
                    var _this = this;
                    if ($('body > div.navigation-header').length == 0) {
                        var header = $('<div class="i-navigation-header"><div class="i-inner-container"></div></div>');
                        var innercontainer = header.find('.i-inner-container').first();
                        $('<a href="#" id="i-nav-previous"><i class="icon-arrow-left"/></a>').appendTo(innercontainer);
                        $('<a href="#" id="i-nav-index"><i class="icon-list"/></a>').appendTo(innercontainer);
                        $('<a href="#" id="i-nav-toc"><i class="icon-book"/></a>').appendTo(innercontainer);
                        $('<a href="#" id="i-nav-search"><i class="icon-search"/></a>').appendTo(innercontainer);
                        $('<a href="#" id="i-nav-next"><i class="icon-arrow-right"/></a>').appendTo(innercontainer);
                        $('<a href="#" id="i-remove-highlighting" class="btn-warning"><i class="icon-remove icon-white"></i></a>').appendTo(innercontainer);
                        if ($('.i-search-highlight').length) {
                            // Highlighted search items have been added to the body so show the remove highlights button
                            innercontainer.children('#i-remove-highlighting').css('display', 'inline');
                        }
                        innercontainer.children('a')
                            .off("click.responsive")
                            .on("click.responsive", function (eventObject) {
                            var webframe = window.parent;
                            if (typeof webframe != "undefined") {
                                switch ($(eventObject.currentTarget).attr('id')) {
                                    case "i-nav-previous":
                                        Content.Messaging.routeMessageToParentFrame("navigate", "previous");
                                        break;
                                    case "i-nav-next":
                                        Content.Messaging.routeMessageToParentFrame("navigate", "next");
                                        break;
                                    case "i-nav-index":
                                    case "i-nav-toc":
                                    case "i-nav-search":
                                        var paneId = $(eventObject.currentTarget).attr('id');
                                        if (paneId.substring(0, 2) == "i-") {
                                            paneId = paneId.substring(2);
                                        }
                                        Content.Messaging.routeMessageToParentFrame("openNavigationPane", paneId);
                                        break;
                                    case "i-remove-highlighting":
                                        // Instruct search highlighting to remove any existing highlights
                                        _this.documentInstance.processWindowMessage(new Content.WindowMessage(Content.DocumentMessageNames.resetQuickSearch, null));
                                        break;
                                }
                            }
                        });
                        header.prependTo($('body'));
                        if ($('html').data('responsive-load-complete') == true) {
                            // Async load of responsive files already complete so make the body visible
                            $('html').addClass('i-loaded');
                            Content.Browser.showElement($('body'));
                            $('html').data('responsive-load-complete', null);
                        }
                    }
                };
                ResponsiveDocumentFeature.prototype.applyClickTarget = function (clickTarget) {
                    var buttonClassName = (clickTarget.kind == Content.ResponsiveClickTargetKind.inline) ? "btn btn-mini btn-xs" : "btn";
                    $(clickTarget.className).addClass(buttonClassName);
                };
                ResponsiveDocumentFeature.prototype.getDeviceType = function () {
                    if (!this.documentInstance.isResponsiveEnabled) {
                        // Responsive disabled - always desktop
                        return "DESKTOP";
                    }
                    var forcedDisplayMode = this.getForcedDisplayMode();
                    if (forcedDisplayMode != null) {
                        return forcedDisplayMode;
                    }
                    if (Modernizr.touch) {
                        if (Modernizr.mq("screen and (orientation: portrait) and (max-device-width: 600px)")) {
                            return "MOBILE";
                        }
                        else if (Modernizr.mq("screen and (orientation: landscape) and (max-device-width: 767px)")) {
                            return "MOBILE";
                        }
                        else {
                            return "TABLET";
                        }
                    }
                    else if (navigator.userAgent.indexOf('Windows Phone OS') != -1) {
                        return "MOBILE";
                    }
                    return "DESKTOP";
                };
                /**
                 * Returns any forced display mode set by the containing frame.
                 */
                ResponsiveDocumentFeature.prototype.getForcedDisplayMode = function () {
                    var overrides = Innovasys.overrides || {};
                    if (overrides != null
                        && typeof overrides.forcedDisplayMode != "undefined"
                        && overrides.forcedDisplayMode != null) {
                        return overrides.forcedDisplayMode;
                    }
                    if (window.location.hash == "#ForceDisplayDesktop") {
                        return "DESKTOP";
                    }
                    else if (window.location.hash == "#ForceDisplayMobile") {
                        return "MOBILE";
                    }
                    else if (window.location.hash == "#ForceDisplayTablet") {
                        return "TABLET";
                    }
                    // Only check local storage here if we are in a frame - the parent frame sets the local storage
                    // value for overriding the default behavior so we only need to check it if we are actually running
                    // in a frame
                    if (self != top) {
                        var currentPath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
                        var responsiveStorageId = 'innovasys-responsive-' + currentPath.replace(/[^a-zA-Z0-9_\-]/g, "");
                        if (this.documentInstance.getLocalStorage().getAttribute(responsiveStorageId) != null) {
                            return this.documentInstance.getLocalStorage().getAttribute(responsiveStorageId);
                        }
                    }
                    return null;
                };
                /**
                 * Forces a specific responsive display mode when the document loads. The forced display mode is set in local storage
                 *  so will be used by all subsequent page loads until it is reset.
                 */
                ResponsiveDocumentFeature.prototype.setForcedDisplayMode = function (displayMode) {
                    var currentPath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
                    var responsiveStorageId = 'innovasys-responsive-' + currentPath.replace(/[^a-zA-Z0-9_\-]/g, "");
                    this.documentInstance.getLocalStorage().setAttribute(responsiveStorageId, displayMode);
                };
                /**
                 * Called after responsive setup completes.
                 */
                ResponsiveDocumentFeature.prototype.onResponsiveFilesLoaded = function () {
                    this.documentInstance.applyResponsiveConfiguration(this._configuration);
                    if (this._configuration.profileName != "desktop") {
                        if (!this.documentInstance.isContentDocument || $('body > div.i-navigation-header').length != 0) {
                            // Navigation header already loaded, or not a content document so make the body visible;
                            $('html').addClass('i-loaded');
                            Content.Browser.showElement($('body'));
                        }
                        else {
                            // Navigation header not loaded yet, add a flag here so that when the header has finished loaded it will make
                            // the body visible
                            $('html').data('responsive-load-complete', true);
                        }
                    }
                };
                ResponsiveDocumentFeature.pivotTable = function (table) {
                    var sourceTable = $(table);
                    var container = $('<div class="i-pivot-table-container"></div>');
                    var labels = {};
                    var pivotColumnIndex = sourceTable.find("tr").children("td.i-pivot-column, th.i-pivot-column").first().index();
                    // No column found to pivot on so just return here
                    if (pivotColumnIndex == -1) {
                        return null;
                    }
                    // Get the labels for each new row in the new table for the first row in the source table
                    sourceTable.find('tr:first-child').children('td:not(.i-pivot-column), th:not(.i-pivot-column)').each(function (index, cell) {
                        labels[index.toString()] = $(cell).text();
                    });
                    sourceTable.find('tr').each(function (index, row) {
                        if (index > 0) {
                            var newTable = $('<table class="i-pivot-table i-section-content"></table>');
                            var header;
                            $(row).children('td').each(function (index, cell) {
                                if (index == pivotColumnIndex) {
                                    header = $('<div class="i-section-heading"><span class="btn">' + $(cell).text() + '</span></div>');
                                }
                                else {
                                    // Add a new row for each column in the source table
                                    var row = $('<tr><td>' + labels[index.toString()] + '</td></tr>');
                                    $(cell).clone().appendTo(row);
                                    row.find('td a').addClass('btn btn-mini btn-xs');
                                    row.appendTo(newTable);
                                }
                            });
                            header.appendTo(container);
                            newTable.appendTo(container);
                        }
                    });
                    return container;
                };
                return ResponsiveDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.ResponsiveDocumentFeature = ResponsiveDocumentFeature;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.ResponsiveDocumentFeatureFactory());

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var NavigationMessageNames = (function () {
                function NavigationMessageNames() {
                }
                NavigationMessageNames.syncTableOfContents = "syncToC";
                NavigationMessageNames.select = "select";
                NavigationMessageNames.shrinkIFrames = "shrinkIframes";
                NavigationMessageNames.loaded = "loaded";
                NavigationMessageNames.toggleTocPrevious = "toggle-toc-previous";
                NavigationMessageNames.toggleTocNext = "toggle-toc-next";
                NavigationMessageNames.navigate = "navigate";
                NavigationMessageNames.activated = "activated";
                NavigationMessageNames.updateNavigationButtons = "update-navigation-buttons";
                NavigationMessageNames.updatePageTitle = "updatePageTitle";
                NavigationMessageNames.openNavigationPane = "openNavigationPane";
                NavigationMessageNames.closeNavigationPane = "closeNavigationPane";
                NavigationMessageNames.insertRemoveHighlighting = "insertRemoveHighlighting";
                return NavigationMessageNames;
            }());
            Features.NavigationMessageNames = NavigationMessageNames;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var NavigationDocumentFeatureFactory = (function () {
                function NavigationDocumentFeatureFactory() {
                }
                NavigationDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new NavigationDocumentFeature(documentInstance);
                };
                return NavigationDocumentFeatureFactory;
            }());
            Features.NavigationDocumentFeatureFactory = NavigationDocumentFeatureFactory;
            var NavigationDocumentFeature = (function (_super) {
                __extends(NavigationDocumentFeature, _super);
                function NavigationDocumentFeature(documentInstance) {
                    _super.call(this, documentInstance);
                    this._rootSelector = null;
                    this._isIframeResizeTimerDisabled = false;
                    this._isAccordionView = true;
                    this._navigationFrames = ["i-toc", "i-index", "i-search"];
                    this._isEnabled = false;
                    this.isTocNavigationEnabled = false;
                    this.isStartOfToc = false;
                    this.isEndOfToc = false;
                }
                NavigationDocumentFeature.prototype.getName = function () {
                    return "Navigation";
                };
                NavigationDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    this._rootSelector = rootSelector;
                    if ($("#i-navigation-container", this._rootSelector).length > 0) {
                        this._isEnabled = true;
                    }
                };
                NavigationDocumentFeature.prototype.populateResponsiveConfiguration = function (configuration) {
                    if (!this._isEnabled) {
                        return;
                    }
                };
                NavigationDocumentFeature.prototype.onMessage = function (message) {
                    if (!this._isEnabled) {
                        return;
                    }
                    switch (message.messageType) {
                        case Features.NavigationMessageNames.syncTableOfContents:
                            Content.Messaging.routeMessageToFrameElement("i-toc", message.messageType, message.messageData);
                            break;
                        case Features.NavigationMessageNames.select:
                            this.selectNavigationFrame(message.messageData);
                            break;
                        case Features.NavigationMessageNames.shrinkIFrames:
                            this.shrinkFrame($("iframe#i-toc,iframe#i-index,iframe#i-search"));
                            break;
                        case Features.NavigationMessageNames.loaded:
                            // Forward message to search pane so that search highlights can be rendered
                            Content.Messaging.routeMessageToFrameElement("i-search", message.messageType, message.messageData);
                            break;
                        case Content.DocumentMessageNames.quickSearch:
                        case Content.DocumentMessageNames.searchHighlightComplete:
                            // Pass to parent frame handler so it can be forwarded on to the content frame
                            Content.Messaging.routeMessageToWindow(parent, message.messageType, message.messageData);
                            break;
                        case Features.NavigationMessageNames.toggleTocPrevious:
                            this.isStartOfToc = (message.messageData == "true");
                            $("#i-toc-header #i-previous").toggleClass("i-arrow-left-disabled", this.isStartOfToc);
                            break;
                        case Features.NavigationMessageNames.toggleTocNext:
                            this.isEndOfToc = (message.messageData == "true");
                            $("#i-toc-header #i-next").toggleClass("i-arrow-right-disabled", this.isEndOfToc);
                            break;
                        case Features.NavigationMessageNames.navigate:
                            if (message.messageData == "previous" || message.messageData == "next") {
                                this.navigateToc(message.messageData);
                            }
                            else {
                                Content.Messaging.routeMessageToWindow(parent, message.messageType, message.messageData);
                            }
                            break;
                    }
                };
                NavigationDocumentFeature.prototype.navigateToc = function (direction) {
                    Content.Messaging.routeMessageToFrameElement("i-toc", Features.NavigationMessageNames.navigate, direction);
                };
                NavigationDocumentFeature.prototype.applyResponsiveConfiguration = function (configuration) {
                    var _this = this;
                    if (!this._isEnabled) {
                        return;
                    }
                    if (configuration.profileName != "desktop") {
                        // Tablet & Mobile
                        this._isAccordionView = false;
                        // Hide the accordion elements
                        $(".i-header, .i-header.ui-state-active").css("display", "none");
                        if (Modernizr.touch) {
                            $("iframe").attr("scrolling", "no");
                        }
                        $(window)
                            .off("resize.navigation")
                            .on("resize.navigation", function () {
                            _this.addCloseButtonChevrons();
                        });
                        $("#i-close-pane", this._rootSelector)
                            .off("click.navigation", "a.btn, i.i-image")
                            .on("click.navigation", "a.btn, i.i-image", function (event) {
                            event.preventDefault();
                            var webContentFrame = window.parent;
                            Content.Messaging.routeMessageToWindow(webContentFrame, Features.NavigationMessageNames.closeNavigationPane, null);
                        });
                        // Resize the iframes and set a timer to keep them sized
                        Content.Browser.resizeIFrames(this._rootSelector);
                        setInterval(function () {
                            if (!_this._isIframeResizeTimerDisabled) {
                                Content.Browser.resizeIFrames(_this._rootSelector);
                            }
                        }, 500);
                    }
                    else {
                        // Desktop
                        this._isAccordionView = true;
                        if ($("#i-accordion", this._rootSelector).length > 0) {
                            $("#i-accordion", this._rootSelector).accordion({ heightStyle: "fill" });
                            // Initial resize
                            setTimeout(function () {
                                $("#i-accordion", _this._rootSelector).accordion("refresh");
                            }, 1);
                            // Resize immediately when the window resizes
                            $(window)
                                .off("resize.navigation")
                                .on("resize.navigation", function () {
                                if ($("#i-accordion", _this._rootSelector).data("ui-accordion") != null) {
                                    $("#i-accordion", _this._rootSelector).accordion("refresh");
                                }
                            });
                            // Check for resize periodically after load (to workaround a resize bug in IE)
                            setInterval(function () {
                                //$("#i-accordion", this._rootSelector).accordion("refresh");
                            }, 500);
                            // Notify the websearch iframe to set focus in the search box
                            $("#i-accordion", this._rootSelector)
                                .off("accordionactivate.navigation")
                                .on("accordionactivate.navigation", function (event, ui) {
                                if (ui.newHeader.attr("id") == "i-search-header") {
                                    Content.Messaging.routeMessageToFrameElement("i-search", Features.NavigationMessageNames.activated, null);
                                }
                            });
                        }
                        else if ($("#i-tabstrip", this._rootSelector).length > 0) {
                            // Change default duration on the tabs
                            var options = {
                                heightStyle: "fill"
                            };
                            //// Only animate if not design time and animation enabled
                            //options.show = { opacity: 'toggle', duration: 'fast' };
                            //options.hide = { opacity: 'toggle', duration: 'fast' };
                            // Tab strip
                            $("#i-tabstrip", this._rootSelector).tabs(options);
                            // Initial resize
                            setTimeout(function () {
                                $("#i-tabstrip", _this._rootSelector).tabs("refresh");
                            }, 1);
                            // Resize immediately when the window resizes
                            $(window)
                                .off("resize.navigation")
                                .on("resize.navigation", function () {
                                if ($("#i-tabstrip", _this._rootSelector).data("ui-tabs") != null) {
                                    $("#i-tabstrip", _this._rootSelector).tabs("refresh");
                                }
                            });
                        }
                        if (this.isTocNavigationEnabled) {
                            var arrowContainer = $('<div class="i-arrow-container"></div>');
                            arrowContainer.append('<div class="i-arrow i-arrow-right" id="i-next"></div>');
                            arrowContainer.append('<div class="i-arrow i-arrow-left" id="i-previous"></div>');
                            $("#i-toc-header", this._rootSelector).append(arrowContainer);
                            $("#i-toc-header #i-next", this._rootSelector)
                                .off("click.tocnavigation")
                                .on("click.tocnavigation", function () {
                                if (!_this.isEndOfToc) {
                                    _this.navigateToc("next");
                                }
                            });
                            $("#i-toc-header #i-previous", this._rootSelector)
                                .off("click.tocnavigation")
                                .on("click.tocnavigation", function () {
                                if (!_this.isStartOfToc) {
                                    _this.navigateToc("previous");
                                }
                            });
                        }
                    }
                };
                NavigationDocumentFeature.prototype.shrinkFrame = function (frameSelector) {
                    frameSelector.height(null);
                    frameSelector.data("last-height", null);
                    frameSelector.css("display", "none");
                };
                NavigationDocumentFeature.prototype.selectNavigationFrame = function (frameId) {
                    if (frameId != null && frameId.indexOf("nav-") == 0) {
                        frameId = "i-" + frameId.substring(4);
                    }
                    for (var x = 0; x < this._navigationFrames.length; x++) {
                        var currentFrameId = this._navigationFrames[x];
                        var isSelected = (currentFrameId === frameId);
                        if (isSelected) {
                            if (this._isAccordionView) {
                                $("#i-accordion").accordion("option", "active", x);
                            }
                            else {
                                $("iframe#" + currentFrameId).css("display", "block");
                            }
                        }
                        else {
                            $("iframe#" + currentFrameId).css("display", "none");
                        }
                    }
                    if (!this._isAccordionView) {
                        Content.Browser.resizeIFrames(this._rootSelector, true);
                    }
                };
                NavigationDocumentFeature.prototype.addCloseButtonChevrons = function () {
                    var topWindowHeight = 0;
                    try {
                        topWindowHeight = $(window.top).height();
                    }
                    catch (ex) {
                        topWindowHeight = $(window).height();
                    }
                    var closePaneHeight = Math.max($("#i-close-pane").height(), topWindowHeight);
                    $("#i-close-pane > i.i-image").remove();
                    for (var i = topWindowHeight / 2; i < closePaneHeight; i += topWindowHeight) {
                        var image = $('<i class="i-image"></i>');
                        image.css("top", i + "px");
                        image.appendTo("#i-close-pane");
                    }
                };
                return NavigationDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.NavigationDocumentFeature = NavigationDocumentFeature;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.NavigationDocumentFeatureFactory());
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var TableOfContentsDocumentFeatureFactory = (function () {
                function TableOfContentsDocumentFeatureFactory() {
                }
                TableOfContentsDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new TableOfContentsDocumentFeature(documentInstance);
                };
                return TableOfContentsDocumentFeatureFactory;
            }());
            Features.TableOfContentsDocumentFeatureFactory = TableOfContentsDocumentFeatureFactory;
            var TableOfContentsDocumentFeature = (function (_super) {
                __extends(TableOfContentsDocumentFeature, _super);
                function TableOfContentsDocumentFeature(documentInstance) {
                    _super.call(this, documentInstance);
                    this._lastSelectedNode = null;
                    this._ignoreSyncRequest = false;
                    this._selectedNodeIndex = -1;
                    this._firstNodeIndex = -1;
                    this._lastNodeIndex = -1;
                    this._tocNodeCount = -1;
                    this._selectedNodeHref = null;
                    this._rootSelector = null;
                    this._isTocConstructed = false;
                    this._isMobileToc = false;
                    this._isEnabled = false;
                    this.syncTocUrl = null;
                }
                TableOfContentsDocumentFeature.prototype.getName = function () {
                    return "TableOfContents";
                };
                TableOfContentsDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    if (isInitialLoad) {
                        this._rootSelector = rootSelector;
                        if ($("#i-toc-container", this._rootSelector).length > 0) {
                            this._isEnabled = true;
                            this._indexNodes();
                        }
                    }
                };
                TableOfContentsDocumentFeature.prototype.populateResponsiveConfiguration = function (configuration) {
                    if (!this._isEnabled) {
                        return;
                    }
                };
                TableOfContentsDocumentFeature.prototype.applyResponsiveConfiguration = function (configuration) {
                    if (!this._isEnabled) {
                        return;
                    }
                    if (configuration.profileName == "desktop") {
                        $("html").removeClass("ui-mobile").removeClass("ui-mobile-rendering");
                        // Desktop
                        this.constructDesktopToc($("ul#i-root", this._rootSelector));
                        this._isTocConstructed = true;
                    }
                    else {
                        // Mobile/Tablet
                        $("ul#i-root", this._rootSelector).css("display", "none");
                        this.constructMobileToC();
                        this._isMobileToc = true;
                        this._isTocConstructed = true;
                        $("ul#i-root", this._rootSelector).addClass("visible");
                    }
                    if (this.syncTocUrl != null) {
                        var url = this.syncTocUrl;
                        this.syncTocUrl = null;
                        this.syncTocNodeToUrl(url);
                    }
                };
                TableOfContentsDocumentFeature.prototype.onMessage = function (message) {
                    if (!this._isEnabled) {
                        return;
                    }
                    switch (message.messageType) {
                        case Features.NavigationMessageNames.navigate:
                            if (message.messageData) {
                                var anchor = null;
                                if (message.messageData == "next") {
                                    anchor = this.moveToNextNode();
                                }
                                else if (message.messageData == "previous") {
                                    anchor = this.moveToPreviousNode();
                                }
                                if (anchor != null && anchor.length) {
                                    this._ignoreSyncRequest = false;
                                    this.syncTocNode(anchor);
                                    // Ignore the next ToC node sync request as it will come from the webframe when the content has finished loading
                                    this._ignoreSyncRequest = true;
                                    if (anchor.attr("href").substring(0, 1) != "#") {
                                        var webframe = window.parent.parent;
                                        Content.Messaging.routeMessageToWindow(webframe, Features.NavigationMessageNames.navigate, anchor.attr("href"));
                                    }
                                }
                            }
                            break;
                        case Features.NavigationMessageNames.updateNavigationButtons:
                            this.updateNavigationButtons();
                            break;
                        case Features.NavigationMessageNames.syncTableOfContents:
                            this.syncTocNodeToUrl(message.messageData);
                            break;
                    }
                };
                TableOfContentsDocumentFeature.prototype.updateNavigationButtons = function () {
                    Content.Messaging.routeMessageToWindow(window.parent, Features.NavigationMessageNames.toggleTocNext, this.isLastNodeSelected() ? "true" : "false");
                    Content.Messaging.routeMessageToWindow(window.parent, Features.NavigationMessageNames.toggleTocPrevious, this.isFirstNodeSelected() ? "true" : "false");
                };
                TableOfContentsDocumentFeature.prototype.moveToNextNode = function () {
                    return this._moveNode(false);
                };
                TableOfContentsDocumentFeature.prototype.moveToPreviousNode = function () {
                    return this._moveNode(true);
                };
                TableOfContentsDocumentFeature.prototype.setSelectedNode = function (anchor) {
                    this._selectedNodeIndex = parseInt(anchor.attr("data-node-index"));
                    this._selectedNodeHref = anchor.attr("href");
                };
                TableOfContentsDocumentFeature.prototype.isLastNodeSelected = function () {
                    if (this._tocNodeCount == -1) {
                        this._tocNodeCount = this._getAnchors().length;
                    }
                    return this._selectedNodeIndex == this._lastNodeIndex;
                };
                TableOfContentsDocumentFeature.prototype.isFirstNodeSelected = function () {
                    return this._selectedNodeIndex == this._firstNodeIndex;
                };
                TableOfContentsDocumentFeature.prototype._getAnchors = function () {
                    return this._rootSelector.find("#i-toc-container > ul#i-root a[data-node-index]");
                };
                TableOfContentsDocumentFeature.prototype._moveNode = function (isPrevious) {
                    var anchors = this._getAnchors();
                    if (isPrevious) {
                        if (this._selectedNodeIndex > 0) {
                            do {
                                this._selectedNodeIndex--;
                            } while (anchors.eq(this._selectedNodeIndex).attr("href").substring(0, 1) == "#" && this._selectedNodeIndex > 0);
                        }
                    }
                    else {
                        if (anchors.length - 1 > this._selectedNodeIndex) {
                            do {
                                this._selectedNodeIndex++;
                            } while (anchors.eq(this._selectedNodeIndex).attr("href").substring(0, 1) == "#" && anchors.length - 1 > this._selectedNodeIndex);
                        }
                    }
                    return anchors.eq(this._selectedNodeIndex);
                };
                TableOfContentsDocumentFeature.prototype.isPageSelected = function (anchor) {
                    return (anchor.attr("href") == this._selectedNodeHref);
                };
                TableOfContentsDocumentFeature.prototype.constructDesktopToc = function (root) {
                    this.processListElement(root);
                };
                TableOfContentsDocumentFeature.prototype.expandOrCollapseClickHandler = function (event) {
                    var siblingList = $(event.target).nextAll("ul");
                    this.expandOrCollapseNode(siblingList, true);
                };
                TableOfContentsDocumentFeature.prototype.nodeClickHandler = function (element) {
                    this.selectNodeElement(element);
                    if (element.attr("href") != "#") {
                        Content.Messaging.routeMessageToWindow(window.parent.parent, Features.NavigationMessageNames.navigate, element.attr("href"));
                    }
                    // Don't collapse the nested list when clicking on a node (do expand it if it is collapsed)
                    if (!$(element).prev("ins").hasClass("i-collapse")) {
                        // expand /collapse child
                        var siblingList = element.nextAll("ul");
                        this.expandOrCollapseNode(siblingList, true);
                    }
                    this.updateNavigationButtons();
                };
                TableOfContentsDocumentFeature.prototype.selectNodeElement = function (element) {
                    if (this._lastSelectedNode != null) {
                        // Remove selected highlighting from previously selected node
                        this._lastSelectedNode.removeClass("i-selected");
                    }
                    element.removeClass("i-hover");
                    element.addClass("i-selected");
                    this._lastSelectedNode = element;
                    this.setSelectedNode(element);
                };
                TableOfContentsDocumentFeature.prototype.expandOrCollapseNode = function (listElement, isAnimationEnabled) {
                    var _this = this;
                    if (isAnimationEnabled === void 0) { isAnimationEnabled = true; }
                    if (listElement.length) {
                        if (listElement.length > 1) {
                            // Process individually
                            listElement.each(function (index, element) {
                                _this.expandOrCollapseNode($(element), isAnimationEnabled);
                            });
                            return;
                        }
                        if (!listElement.hasClass("i-visible")) {
                            this.processListElement(listElement);
                        }
                        if (isAnimationEnabled) {
                            listElement.slideToggle(200, function () {
                                listElement.toggleClass("i-visible");
                                listElement.css("display", "");
                            });
                        }
                        else {
                            listElement.toggleClass("i-visible");
                        }
                        // Swap icons for open and closed books
                        var icon = listElement.prev("a").children("ins");
                        if (icon.hasClass("i-icon-1"))
                            icon.removeClass("i-icon-1").addClass("i-icon-2");
                        else if (icon.hasClass("i-icon-2"))
                            icon.removeClass("i-icon-2").addClass("i-icon-1");
                        else if (icon.hasClass("i-icon-3"))
                            icon.removeClass("i-icon-3").addClass("i-icon-4");
                        else if (icon.hasClass("i-icon-4"))
                            icon.removeClass("i-icon-4").addClass("i-icon-3");
                        listElement.prevAll("ins").toggleClass("i-expand i-collapse");
                    }
                };
                TableOfContentsDocumentFeature.prototype.processListElement = function (listElement) {
                    var _this = this;
                    if (listElement.length) {
                        if (listElement.length > 1) {
                            // Process individually
                            listElement.each(function (index, element) {
                                _this.processListElement($(element));
                            });
                            return;
                        }
                        if (listElement.hasClass("i-root")) {
                            listElement.addClass("i-visible");
                        }
                        listElement.children("li").each(function (index, listItemElement) {
                            var hasNestedList = false;
                            var listItem = $(listItemElement);
                            listItem.children("ul").each(function (index, childListElement) {
                                if ($(childListElement).children().length > 0) {
                                    hasNestedList = true;
                                }
                                else {
                                    // Remove any empty <ul> elements
                                    $(childListElement).remove();
                                }
                            });
                            var anchor = listItem.children("a");
                            // Add an <ins> node for the expand / collapse icon if one doesn't already exist
                            if (listItemElement.firstChild.nodeName != "INS") {
                                var spacer = $('<ins class="i-spacer"></ins>');
                                if (hasNestedList) {
                                    spacer.addClass("i-expandorcollapse");
                                    spacer.addClass("i-expand");
                                    spacer
                                        .off("click.toc")
                                        .on("click.toc", function (event) {
                                        _this.expandOrCollapseClickHandler(event);
                                    });
                                }
                                spacer.prependTo(listItem);
                            }
                            // Add an <ins> node for the node icon
                            if (anchor.children("ins").length == 0) {
                                var icon = $('<ins class="i-icon"></ins>');
                                var iconIndex = parseInt(listItem.attr("rel"));
                                var iconClassIndex = iconIndex;
                                var isNew = listItem.data("is-new") == "True";
                                if (hasNestedList) {
                                    if (iconIndex <= 0) {
                                        if (isNew) {
                                            iconClassIndex = 3;
                                        }
                                        else {
                                            iconClassIndex = 1;
                                        }
                                    }
                                }
                                else {
                                    if (iconIndex <= 0) {
                                        if (isNew) {
                                            iconClassIndex = 10;
                                        }
                                        else {
                                            iconClassIndex = 9;
                                        }
                                    }
                                }
                                icon.addClass("i-icon-" + iconClassIndex);
                                icon.prependTo(anchor);
                            }
                            anchor
                                .off("click.toc")
                                .on("click.toc", function (event) {
                                _this.nodeClickHandler($(event.currentTarget));
                                event.preventDefault();
                                Content.Browser.stopPropagation(event);
                            });
                            anchor
                                .off("hover.toc")
                                .on("hover.toc", function () {
                                if (!$(this).hasClass("i-selected")) {
                                    $(this).addClass("i-hover");
                                }
                            }, function () {
                                $(this).removeClass("i-hover");
                            });
                        });
                    }
                };
                TableOfContentsDocumentFeature.prototype.syncTocNodeToUrl = function (url) {
                    if (!this._isTocConstructed) {
                        // ToC not available yet, postpone.
                        this.syncTocUrl = url;
                        return;
                    }
                    var anchor = $('div#i-toc-container > ul a[href="' + decodeURIComponent(url) + '"]', this._rootSelector).first();
                    if (anchor != null
                        && anchor.length
                        && !this._ignoreSyncRequest
                        && !this.isPageSelected(anchor)) {
                        this.setSelectedNode(anchor);
                        this.syncTocNode(anchor);
                    }
                    if (this._ignoreSyncRequest) {
                        this._ignoreSyncRequest = false;
                    }
                };
                TableOfContentsDocumentFeature.prototype.syncTocNode = function (anchor) {
                    if (this._isMobileToc) {
                        this.setSelectedNode(anchor);
                        var parentList = anchor.parent().closest("ul");
                        this.buildToCPage(parentList.attr("id"));
                    }
                    else {
                        // Only sync if there wasn't a previously selected node or the new node is different from the currently selected node
                        if (anchor.length && ((this._lastSelectedNode != null
                            && anchor.data("node-index") != this._lastSelectedNode.data("node-index")) || this._lastSelectedNode == null)) {
                            this.selectNodeElement(anchor);
                            this.expandParents(anchor, false);
                            // scroll selected anchor into view (don't use scrollInToView here as that causes problems with the iframe)
                            $("html, body").animate({
                                scrollTop: anchor.offset().top
                            }, 200);
                            this.updateNavigationButtons();
                        }
                    }
                };
                TableOfContentsDocumentFeature.prototype.expandParents = function (element, isAnimationEnabled, parents) {
                    if (parents === void 0) { parents = null; }
                    var parentListElement = element.parent().closest("ul");
                    if (parentListElement.length == 0) {
                        for (var i = parents.length - 1; i > -1; i--) {
                            this.expandOrCollapseNode(parents[i], isAnimationEnabled);
                        }
                        return;
                    }
                    else {
                        if (parents == undefined || parents == null) {
                            parents = [];
                        }
                        // Only expand if it isn't the root, isn't already expanded or hasn't been procesed yet
                        if (!parentListElement.hasClass("i-root")) {
                            var spacer = parentListElement.prevAll("ins.i-spacer");
                            if (spacer.length == 0 || spacer.hasClass("i-expand")) {
                                parents.push(parentListElement);
                            }
                        }
                        this.expandParents(parentListElement, isAnimationEnabled, parents);
                    }
                };
                TableOfContentsDocumentFeature.prototype.buildToCPage = function (listId) {
                    if (listId == "i-root") {
                        listId = "i-root-node";
                    }
                    var tocPageId = listId;
                    if (listId == "i-root-node") {
                        listId = "i-root";
                    }
                    if ($.mobile.activePage.length && $.mobile.activePage.attr("id") == listId) {
                        // Current active ToC page so just highlight the selected Url
                        this._highlightSelectedNode();
                        return;
                    }
                    // If the ToC page already exists in the DOM then just change to it
                    if ($("div#" + tocPageId, this._rootSelector).length) {
                        $.mobile.changePage($("div#" + tocPageId, this._rootSelector), { dataUrl: tocPageId });
                        return;
                    }
                    var list = $("ul#" + listId, this._rootSelector).first();
                    var title = list.prev("a").text();
                    var backId = list.parent().closest("ul").attr("id");
                    var newPage = $('<div data-role="page" id="' + tocPageId + '"></div>');
                    var header = $('<div data-role="header" data-theme="b"></div>');
                    if (backId == "i-root") {
                        backId = "i-root-node";
                    }
                    if (listId != "i-root") {
                        // Add a header to all child pages
                        // Add a back button to the header (just icon no text)
                        $('<a href="#' + backId + '" data-icon="arrow-l" data-iconpos="notext">Back</a>').appendTo(header);
                        $("<h1>" + title + "</h1>").appendTo(header);
                        header.appendTo(newPage);
                    }
                    var pageList = list.clone();
                    // remove any nested lists
                    pageList.find("ul").remove();
                    // remove any inline css (i.e. display: none on root page)
                    pageList.css("display", "");
                    // display as a JQM listview
                    pageList.attr("data-role", "listview");
                    // get rid of the temporary id from the cloned list
                    pageList.removeAttr("id");
                    // remove the ">" icon from links directly to pages
                    pageList.find("a:not(a[href^='#node-'])")
                        .closest("li").attr("data-icon", "false");
                    pageList.appendTo(newPage);
                    // Add the new page to the main container, mobile-ize it then transition to it 
                    newPage.appendTo($("div#i-toc-container", this._rootSelector));
                    newPage.page();
                    $.mobile.changePage(newPage, { dataUrl: tocPageId });
                    // Highlight the selected node
                    this._highlightSelectedNode();
                };
                TableOfContentsDocumentFeature.prototype._onBeforePageChange = function (event, pageData) {
                    // data.toPage will be the page href on the first call (div element on the second)
                    if (typeof pageData.toPage === "string") {
                        if (pageData.toPage.match(/(#node-(\d+)|#i-root-node)/)) {
                            var pageId = pageData.toPage.substring(pageData.toPage.lastIndexOf("#") + 1, pageData.toPage.length);
                            if ($("div#" + pageId).length == 0) {
                                // Build the new ToC page and prevent JQM from handling this event
                                this.buildToCPage(pageId);
                                event.preventDefault();
                            }
                        }
                        else {
                            event.preventDefault();
                        }
                    }
                };
                TableOfContentsDocumentFeature.prototype._onVirtualClick = function (event) {
                    var anchor = $(event.target);
                    // Intercept clicks to content links here as we need to query the anchor element
                    if (anchor.attr("href") != null
                        && anchor.attr("href").substring(0, 1) != "#") {
                        event.preventDefault();
                        this.setSelectedNode(anchor);
                        this._highlightSelectedNode();
                        // Ignore the next ToC node sync request as it will come from the webframe when the content has finished loading
                        this._ignoreSyncRequest = true;
                        var webContentFrame = window.parent.parent;
                        if (typeof webContentFrame != "undefined") {
                            Content.Messaging.routeMessageToWindow(webContentFrame, Features.NavigationMessageNames.navigate, anchor.attr("href"));
                        }
                    }
                };
                TableOfContentsDocumentFeature.prototype._onPageChange = function (event, pageData) {
                    // Called after sucessfully switching to the next ToC page, if the page we came from isn't the
                    // root page then remove it from the DOM
                    if (typeof pageData.options.fromPage != "undefined"
                        && pageData.toPage.attr("id") != pageData.options.fromPage.attr("id")) {
                        pageData.options.fromPage.remove();
                    }
                    this._highlightSelectedNode();
                };
                TableOfContentsDocumentFeature.prototype.constructMobileToC = function () {
                    var _this = this;
                    $(document)
                        .off("pagebeforechange.toc")
                        .on("pagebeforechange.toc", function (event, pageData) {
                        _this._onBeforePageChange(event, pageData);
                    });
                    $(document)
                        .off("pagechange.toc")
                        .on("pagechange.toc", function (event, pageData) {
                        _this._onPageChange(event, pageData);
                    });
                    this._rootSelector
                        .off("vclick.toc")
                        .on("vclick.toc", function (event, pageData) {
                        _this._onVirtualClick(event);
                    });
                    var TocNodeIndex = 0;
                    $("li>a", this._rootSelector).each(function (a) {
                        var ul = $(this).next("ul");
                        if (ul.length) {
                            if ($(this).attr("href") != "#") {
                                // If the li has a link to a page then add a new li to the child ul so that it will be displayed
                                // as the first item on the new page
                                var listItem = $("<li></li>").prepend($(this).clone());
                                ul.prepend(listItem);
                            }
                            // Add an id to the list element which will be moved to the page div later
                            ul.attr("id", "node-" + TocNodeIndex);
                            // Point the anchor in the list item to the child list
                            $(this).attr("href", "#node-" + TocNodeIndex);
                            TocNodeIndex++;
                        }
                    });
                    // Index the anchor nodes again as they will have changed since loading the page
                    this._indexNodes();
                    // Add the root page
                    var rootPage = $('<div data-role="page" id="i-root-node"></div>');
                    var rootList = $("ul#i-root")
                        .clone()
                        .removeAttr("id")
                        .removeAttr("style")
                        .attr("data-role", "listview");
                    rootList.find("ul").remove();
                    rootList.find("a:not(a[href*=#node-])")
                        .closest("li")
                        .attr("data-icon", "false");
                    rootList.appendTo(rootPage);
                    rootPage.appendTo($("div#i-toc-container", this._rootSelector));
                    // Manually initialize JQM
                    $.mobile.initializePage();
                };
                TableOfContentsDocumentFeature.prototype._highlightSelectedNode = function () {
                    $("div.ui-page a.ui-btn-active", this._rootSelector)
                        .removeClass("ui-btn-active");
                    $("div.ui-page li", this._rootSelector)
                        .find('a[data-node-index="' + this._selectedNodeIndex + '"]')
                        .first().addClass("ui-btn-active");
                };
                TableOfContentsDocumentFeature.prototype._indexNodes = function () {
                    var _this = this;
                    var nodeIndex = 0;
                    $("ul.i-root a", this._rootSelector).each(function (index, element) {
                        if (_this._firstNodeIndex == -1 && $(element).attr("href").substring(0, 1) != "#") {
                            _this._firstNodeIndex = nodeIndex;
                        }
                        $(element).attr("data-node-index", nodeIndex);
                        nodeIndex++;
                    });
                    this._lastNodeIndex = nodeIndex - 1;
                };
                return TableOfContentsDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.TableOfContentsDocumentFeature = TableOfContentsDocumentFeature;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.TableOfContentsDocumentFeatureFactory());
// Disable JQM page initialization
$(document)
    .off("mobileinit.navigation")
    .on("mobileinit.navigation", function () {
    $.mobile.autoInitializePage = false;
    $.mobile.defaultPageTransition = "none";
});
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var TopFrameDocumentFeatureFactory = (function () {
                function TopFrameDocumentFeatureFactory() {
                }
                TopFrameDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new TopFrameDocumentFeature(documentInstance);
                };
                return TopFrameDocumentFeatureFactory;
            }());
            Features.TopFrameDocumentFeatureFactory = TopFrameDocumentFeatureFactory;
            var TopFrameDocumentFeature = (function (_super) {
                __extends(TopFrameDocumentFeature, _super);
                function TopFrameDocumentFeature(documentInstance) {
                    _super.call(this, documentInstance);
                    this.defaultTopic = null;
                    this.baseTitle = null;
                    this._rootSelector = null;
                    this._responsiveProfileName = "desktop";
                    this._isIframeResizeTimerDisabled = false;
                    this._isEnabled = false;
                    this.layout = null;
                }
                TopFrameDocumentFeature.prototype.getName = function () {
                    return "TopFrame";
                };
                TopFrameDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    if (isInitialLoad) {
                        this._rootSelector = rootSelector;
                        this.baseTitle = document.title;
                    }
                    this._isEnabled = ($("#i-top-frame-container", rootSelector).length > 0);
                };
                TopFrameDocumentFeature.prototype.populateResponsiveConfiguration = function (configuration) {
                    if (!this._isEnabled) {
                        return;
                    }
                };
                TopFrameDocumentFeature.prototype.applyResponsiveConfiguration = function (configuration) {
                    var _this = this;
                    if (!this._isEnabled) {
                        return;
                    }
                    this._responsiveProfileName = configuration.profileName;
                    if (configuration.profileName == "desktop") {
                        // Desktop
                        this.layout = $(".i-layout-container", this.documentInstance.rootSelector).layout({
                            resizeWhileDragging: true,
                            west__size: 270,
                            maskIframesOnResize: true
                        });
                        this.onContentLoaded(null);
                    }
                    else {
                        // Tablet & Mobile
                        $("iframe#i-nav", this.documentInstance.rootSelector)
                            .css("left", -$(window).width())
                            .css("display", "block");
                        $(window).resize(function () {
                            if ($("iframe#i-nav", _this.documentInstance.rootSelector).css("left") != "0px") {
                                $("iframe#i-nav", _this.documentInstance.rootSelector).css("left", -$(window).width());
                            }
                            TopFrameDocumentFeature._fixSubPixelWidth($("iframe#i-nav", _this.documentInstance.rootSelector));
                        });
                        // Scroll back to the top of page on a new page load
                        $("iframe#i-content", this._rootSelector).load(function () {
                            _this._rootSelector.scrollTop(0);
                        });
                        this.onContentLoaded(null);
                        // Resize the iframes and set a timer to keep them sized
                        Content.Browser.resizeIFrames(this._rootSelector);
                        setInterval(function () {
                            if (!_this._isIframeResizeTimerDisabled) {
                                var maxHeight = Content.Browser.resizeIFrames(_this._rootSelector);
                                if (maxHeight > 0 && maxHeight != $("body").height()) {
                                    _this._rootSelector.height(maxHeight);
                                }
                            }
                        }, 500);
                    }
                    this.navigate(this.getDefaultTopic());
                };
                TopFrameDocumentFeature.prototype.onMessage = function (message) {
                    if (!this._isEnabled) {
                        return;
                    }
                    switch (message.messageType) {
                        case Features.NavigationMessageNames.updateNavigationButtons:
                            // Route to webnav
                            Content.Messaging.routeMessageToFrameElement("i-nav", message.messageType, message.messageData);
                            break;
                        case Features.NavigationMessageNames.loaded:
                            this.onContentLoaded(message.messageData);
                            // Forward message to webnav
                            Content.Messaging.routeMessageToFrameElement("i-nav", message.messageType, message.messageData);
                            break;
                        case Features.NavigationMessageNames.updatePageTitle:
                            this.updatePageTitle(message.messageData);
                            break;
                        case Content.DocumentMessageNames.quickSearch:
                        case Content.DocumentMessageNames.searchHighlightComplete:
                        case Features.NavigationMessageNames.insertRemoveHighlighting:
                            // Pass to content window
                            Content.Messaging.routeMessageToFrameElement("i-content", message.messageType, message.messageData);
                            break;
                        case Features.NavigationMessageNames.navigate:
                            this.navigate(message.messageData);
                            break;
                        case Features.NavigationMessageNames.openNavigationPane:
                            this.openNavigationPane(message.messageData);
                            break;
                        case Features.NavigationMessageNames.closeNavigationPane:
                            this.closeNavigationPane();
                            break;
                    }
                };
                TopFrameDocumentFeature.prototype.openNavigationPane = function (messageData) {
                    var _this = this;
                    this._isIframeResizeTimerDisabled = true;
                    // Activate the desired item in the navigation bar
                    Content.Messaging.routeMessageToFrameElement("i-nav", Features.NavigationMessageNames.select, messageData);
                    switch (this._responsiveProfileName) {
                        case "mobile":
                            $("#i-nav", this.documentInstance.rootSelector).css("width", "100%");
                            break;
                        case "tablet":
                            $("iframe#i-nav", this.documentInstance.rootSelector)
                                .css("width", "50%")
                                .data("widthDivisor", 0.5);
                            TopFrameDocumentFeature._fixSubPixelWidth($("iframe#i-nav", this.documentInstance.rootSelector));
                            break;
                    }
                    if (this._responsiveProfileName != "desktop") {
                        // Resize webnav and webcontent to their content height
                        Content.Browser.resizeIFrames(this._rootSelector, true);
                        // Show the gray overlay
                        $("#i-busy", this.documentInstance.rootSelector).show();
                        // Bring in the navbar
                        $("iframe#i-nav", this.documentInstance.rootSelector)
                            .css("visibility", "visible")
                            .animate({ left: "0" }, 600, "swing", function () {
                            _this._isIframeResizeTimerDisabled = false;
                        });
                    }
                };
                TopFrameDocumentFeature.prototype.closeNavigationPane = function () {
                    var _this = this;
                    if (this._responsiveProfileName == "desktop") {
                        return;
                    }
                    if ($("iframe#i-nav", this.documentInstance.rootSelector).css("left") == "0px") {
                        this._isIframeResizeTimerDisabled = true;
                        // Close the navbar
                        $("iframe#i-nav", this.documentInstance.rootSelector).animate({ left: "-" + $("iframe#i-nav").css("width") }, 400, "swing", function () {
                            $("iframe#i-nav", _this.documentInstance.rootSelector)
                                .css("visibility", "hidden");
                            // Remove the gray overlay
                            $("#i-busy", _this.documentInstance.rootSelector).hide();
                            // Resize the navbar back to default - window height
                            $("iframe#i-nav", _this.documentInstance.rootSelector).height($(window).height())
                                .data("last-height", $(window).height());
                            // Tell the navbar to shrink it's frame sizes
                            Content.Messaging.routeMessageToFrameElement("i-nav", Features.NavigationMessageNames.shrinkIFrames, null);
                            _this._isIframeResizeTimerDisabled = false;
                        });
                    }
                };
                TopFrameDocumentFeature.prototype.getCurrentPageName = function () {
                    if (window.location.hash != "") {
                        return window.location.hash.substring(1);
                    }
                    else {
                        return this.getDefaultTopic();
                    }
                };
                TopFrameDocumentFeature.prototype.onContentLoaded = function (url) {
                    var _this = this;
                    this.updateLocation(url);
                    setTimeout(function () {
                        Content.Messaging.routeMessageToFrameElement("i-nav", Features.NavigationMessageNames.syncTableOfContents, _this.getCurrentPageName());
                    }, 500);
                    if (this._responsiveProfileName != "desktop") {
                        Content.Messaging.routeMessageToFrameElement("i-content", Content.DocumentMessageNames.insertNavigationHeader, null);
                    }
                };
                TopFrameDocumentFeature.prototype.updatePageTitle = function (pageTitle) {
                    if (pageTitle != null) {
                        document.title = this.baseTitle + " - " + pageTitle;
                    }
                };
                TopFrameDocumentFeature.prototype.updateLocation = function (url) {
                    if (url != null) {
                        var pageName = url.substring(url.lastIndexOf("/") + 1);
                        if ("#" + pageName != document.location.hash) {
                            if (window.history.replaceState) {
                                try {
                                    window.history.replaceState("", "", "#" + pageName);
                                }
                                catch (ex) {
                                }
                            }
                            else {
                                window.location.replace("#" + pageName);
                            }
                        }
                    }
                };
                TopFrameDocumentFeature.prototype.getDefaultTopic = function () {
                    var qs = window.location.search;
                    if (qs != null && qs.length > 0)
                        return qs.substring(1) + window.location.hash;
                    else if (window.location.hash != null && window.location.hash.length > 0)
                        return window.location.hash.substring(1);
                    else
                        return this.defaultTopic;
                };
                TopFrameDocumentFeature.prototype.navigate = function (messageData) {
                    // ToC previous/next navigation
                    if (messageData == "next" || messageData == "previous") {
                        Content.Messaging.routeMessageToFrameElement("i-nav", "navigate", messageData);
                    }
                    else {
                        // Navigate to specific page
                        if ($("#i-content", this._rootSelector).attr("src") != messageData
                            || (window.location.hash.length > 0 && window.location.hash.substring(1) != messageData)
                            || (window.location.search.length > 0 && window.location.search.substring(1) != messageData)
                            || (window.location.hash.length == 0 && window.location.search.length == 0)) {
                            // Default content frame height back to the window height - to stop the content frame
                            //  growing to the largest doc size over time
                            if (this._responsiveProfileName != "desktop") {
                                $("#i-content", this._rootSelector).height($(window).height());
                            }
                            $("#i-content", this._rootSelector).attr("src", messageData);
                        }
                        if (this._responsiveProfileName != "desktop") {
                            this.closeNavigationPane();
                        }
                    }
                };
                TopFrameDocumentFeature._fixSubPixelWidth = function (element) {
                    element.width(Math.floor($(window).width() * element.data("widthDivisor")));
                };
                /**
                 * Forces a specific responsive display mode when the document loads. The forced display mode is set in local storage
                 *  so will be used by all subsequent page loads until it is reset.
                 */
                TopFrameDocumentFeature.prototype.setForcedDisplayMode = function (displayMode) {
                    this.documentInstance.getFeatureByName("Responsive").setForcedDisplayMode(displayMode);
                    if (displayMode != null) {
                        var overrides = Innovasys.overrides || (Innovasys.overrides = {});
                        $.extend(overrides, {
                            forcedDisplayMode: displayMode
                        });
                    }
                };
                return TopFrameDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.TopFrameDocumentFeature = TopFrameDocumentFeature;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.TopFrameDocumentFeatureFactory());
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var SearchDocumentFeatureFactory = (function () {
                function SearchDocumentFeatureFactory() {
                }
                SearchDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new SearchDocumentFeature(documentInstance);
                };
                return SearchDocumentFeatureFactory;
            }());
            Features.SearchDocumentFeatureFactory = SearchDocumentFeatureFactory;
            var SearchDocumentFeature = (function (_super) {
                __extends(SearchDocumentFeature, _super);
                function SearchDocumentFeature(documentInstance) {
                    _super.call(this, documentInstance);
                    this._webSearchPendingHighlight = null;
                    this._highlightColors = [];
                    this._rootSelector = null;
                    this._isEnabled = false;
                    this._isFullTextSearchPositionDataAvailable = false;
                    this._isFullTextSearchObjects = false;
                    this._results = null;
                    this._clickedResult = null;
                }
                SearchDocumentFeature.prototype.getName = function () {
                    return "Search";
                };
                SearchDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    var _this = this;
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    if (isInitialLoad) {
                        this._rootSelector = rootSelector;
                        var overrides = Innovasys.overrides;
                        if (overrides != null && overrides.isFullTextSearchPositionDataAvailable) {
                            this._isFullTextSearchPositionDataAvailable = true;
                        }
                        if (overrides != null && overrides.isFullTextSearchObjects) {
                            this._isFullTextSearchObjects = true;
                        }
                    }
                    if ($("#i-search-container", this._rootSelector).length > 0) {
                        this._isEnabled = true;
                        $("#i-search", rootSelector)
                            .off("keyup.search")
                            .on("keyup.search", function (event) {
                            if (event.keyCode == 13) {
                                $("#i-execute-search").click();
                            }
                        });
                        $("#i-execute-search", rootSelector)
                            .off("click.search")
                            .on("click.search", function () {
                            _this.executeSearch();
                        });
                        $("#i-search-container", this._rootSelector)
                            .off("click.search", ".i-result")
                            .on("click.search", ".i-result", function (event) {
                            event.preventDefault();
                            _this.showSearchResult($(event.target).attr("href"), parseInt($(event.target).attr("data-result-index")));
                        });
                    }
                };
                SearchDocumentFeature.prototype.populateResponsiveConfiguration = function (configuration) {
                    if (!this._isEnabled) {
                        return;
                    }
                    if (configuration.profileName != "desktop") {
                        configuration.clickTargets.push(new Content.ResponsiveClickTarget("#i-execute-search", Content.ResponsiveClickTargetKind.block));
                    }
                };
                SearchDocumentFeature.prototype.applyResponsiveConfiguration = function (configuration) {
                    if (!this._isEnabled) {
                        return;
                    }
                    if (configuration.profileName != "desktop") {
                        $("#i-highlight", this._rootSelector).attr("checked", "true");
                    }
                };
                SearchDocumentFeature.prototype.executeSearch = function () {
                    // Show searching div
                    $("#i-search-container", this._rootSelector).hide();
                    $("#i-searching-overlay", this._rootSelector).show();
                    // do search
                    var searchResult = this.buildSearchResults();
                    // Show resuls div
                    $("#i-searching-overlay", this._rootSelector).hide();
                    $("#i-search-container", this._rootSelector).show();
                    // show results
                    if (searchResult == true) {
                        // show resulta div
                        $("#i-results", this._rootSelector).show();
                    }
                };
                SearchDocumentFeature.prototype.buildSearchResults = function () {
                    // get search string
                    var searchText = $("#i-search", this._rootSelector).val();
                    if (searchText.length == 0) {
                        return false;
                    }
                    // make lowercase for easy comparison later on
                    searchText = searchText.toLowerCase();
                    // tokenise
                    var tokens = searchText.split(" ");
                    // build keywords array & query string
                    var query = "";
                    var lastTokenWasOperator = true;
                    var lastTokenWasKeyword = false;
                    var phrase = null;
                    var searchTermIndex = 0;
                    var searchTerms = [];
                    for (var tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
                        if (tokens[tokenIndex].length > 0) {
                            var token = tokens[tokenIndex];
                            // strip out any delimiters & whitespace
                            //token = token.replace(new RegExp("\'", "ig"), "");
                            //token = token.replace(new RegExp("\"", "ig"), "");
                            token = token.replace(new RegExp(",", "ig"), "");
                            if (phrase != null) {
                                phrase += (" " + token);
                                if (token.charAt(token.length - 1) == "\"") {
                                    // Last word in the phrase. Set as the token and clear.
                                    token = phrase.substring(1, phrase.length - 1);
                                    phrase = null;
                                }
                                else {
                                    token = null;
                                }
                            }
                            else if (token.charAt(0) == "\"") {
                                // First word of a phrase
                                phrase = token;
                                token = null;
                            }
                            if (token != null) {
                                // add to array
                                if ((token == "or") || (token == "and")) {
                                    // only add it if not just had an operator
                                    if (lastTokenWasOperator == false) {
                                        // add to the query string
                                        if (token == "or") {
                                            query += " || ";
                                        }
                                        else if (token == "and") {
                                            query += " && ";
                                        }
                                        lastTokenWasOperator = true;
                                        lastTokenWasKeyword = false;
                                    }
                                }
                                else {
                                    // we just had a keyword ?
                                    if (lastTokenWasKeyword) {
                                        // add default OR operator
                                        query += " || ";
                                    }
                                    // add to query string
                                    query += ("(searchTerms.indexOf(\"" + token + "\") >= 0)");
                                    lastTokenWasOperator = false;
                                    lastTokenWasKeyword = true;
                                    // add to keywords array
                                    searchTerms[searchTermIndex] = token;
                                    searchTermIndex++;
                                }
                            }
                        }
                    }
                    if (searchTerms.length == 0) {
                        return false;
                    }
                    if (query != "" && query.length > 4) {
                        // Handle the case where the last word is an operator
                        if (query.substring(query.length - 4) == " && "
                            || query.substring(query.length - 4) == " || ") {
                            query = query.substring(0, query.length - 4);
                        }
                    }
                    // load files & stopwords arrays
                    var searchFiles = [];
                    var allWords = [];
                    if (this._isFullTextSearchObjects) {
                        // Pass constructor to initialization function
                        Innovasys.Content.Features.buildSearchFilesAndKeywords(searchFiles, allWords, SearchFile);
                    }
                    else {
                        // Pass 2 arrays and build SearchFile array from them
                        var indexFiles = [];
                        var indexTitles = [];
                        Innovasys.Content.Features.buildSearchIndexArray(indexFiles, indexTitles, allWords);
                        for (var fileIndex = 0; fileIndex < indexFiles.length; fileIndex++) {
                            var newSearchFile = new SearchFile(indexFiles[fileIndex], indexTitles[fileIndex], 0);
                            searchFiles[fileIndex] = newSearchFile;
                        }
                    }
                    // build list of files containing keywords
                    var searchResults = this.populateSearchResults(searchFiles, allWords, searchTerms);
                    // build results list
                    searchResults = this.buildResultsArray(query, searchResults);
                    // write results to document
                    this.outputResults(searchResults);
                    this._results = searchResults;
                    // return success
                    return true;
                };
                SearchDocumentFeature.escapeForRegEx = function (source) {
                    return source.replace(/[-\/\\^$+.()|[\]{}]/g, '\\$&');
                };
                ;
                SearchDocumentFeature.prototype.populateSearchResults = function (searchFiles, allWords, searchTerms) {
                    var searchResults = [];
                    // build lookup arrays
                    for (var searchTermIndex = 0; searchTermIndex < searchTerms.length; searchTermIndex++) {
                        var searchTerm = searchTerms[searchTermIndex];
                        var searchTermWordMatch = new SearchTermWordMatch(searchTerm, []);
                        if (searchTerm.indexOf(" ") != -1) {
                            // Phrase - find several matching words where the file matches the first word, and the 
                            //  relative position is the same as in the phrase
                            var searchTermWords = searchTerm.split(" ");
                            var firstSearchTermWord = searchTermWords[0];
                            var basePosition = -1;
                            var baseResults = this.populateSearchResults(searchFiles, allWords, [firstSearchTermWord]);
                            for (var searchTermWordIndex = 1; searchTermWordIndex < searchTermWords.length; searchTermWordIndex++) {
                                var results = this.populateSearchResults(searchFiles, allWords, [searchTermWords[searchTermWordIndex]]);
                                baseResults = $.map(baseResults, function (baseResult, index) {
                                    if (baseResult != undefined) {
                                        // A search result for secondary phrase words requires that the words be in a file we have already found at the
                                        //  base result + searchTermWordIndex
                                        var matchingBaseResults = $.map(results, function (searchResult, index) {
                                            if (searchResult != undefined && searchResult.fileIndex == baseResult.fileIndex) {
                                                // For each keyword in the base result, look for a match for any of the keywords in this result
                                                var baseKeywords = baseResult.keywords.split(",");
                                                for (var baseKeywordIndex = 0; baseKeywordIndex < baseKeywords.length; baseKeywordIndex++) {
                                                    var baseKeyword = baseKeywords[baseKeywordIndex];
                                                    if (baseKeyword != "") {
                                                        var thisKeywords = searchResult.keywords.split(",");
                                                        for (var thisKeywordIndex = 0; thisKeywordIndex < thisKeywords.length; thisKeywordIndex++) {
                                                            var thisKeyword = thisKeywords[thisKeywordIndex];
                                                            if (thisKeyword != "") {
                                                                // Matching position?
                                                                var matchingBasePositions = $.map((baseResult.keywordPositions[baseKeyword]), function (basePosition, index) {
                                                                    var matchingKeywordPositions = $.map(searchResult.keywordPositions[thisKeyword], function (position, index) {
                                                                        if (position == (basePosition + searchTermWordIndex)) {
                                                                            return position;
                                                                        }
                                                                        else {
                                                                            return null;
                                                                        }
                                                                    });
                                                                    if (matchingKeywordPositions.length > 0) {
                                                                        return basePosition;
                                                                    }
                                                                    else {
                                                                        return null;
                                                                    }
                                                                });
                                                                if (matchingBasePositions.length > 0) {
                                                                    // Found a match at the next word position in the same file
                                                                    // Add the keyword and rank to the base result
                                                                    baseResult.searchTerms = searchTerm + ",";
                                                                    baseResult.keywords += searchResult.keywords;
                                                                    baseResult.rank += searchResult.rank;
                                                                    return baseResult;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            return null;
                                        });
                                        if (matchingBaseResults.length > 0) {
                                            return baseResult;
                                        }
                                        else {
                                            return null;
                                        }
                                    }
                                });
                            }
                            return baseResults;
                        }
                        else if (searchTerm.indexOf("*") != -1 || searchTerm.indexOf("?") != -1) {
                            // Wildcard - find potentially several matching words
                            var searchTermRegExp = new RegExp("^" + SearchDocumentFeature.escapeForRegEx(searchTerm).replace(/\*/g, ".*").replace(/\?/g, ".") + "$", "i");
                            for (var word in allWords) {
                                if (allWords.hasOwnProperty(word) && word.substring(1).match(searchTermRegExp) != null) {
                                    // Matched
                                    searchTermWordMatch.matchedWords.push(word.substring(1));
                                }
                            }
                            // Sort on matched word length (reverse)
                            searchTermWordMatch.matchedWords = searchTermWordMatch.matchedWords.sort(function (a, b) {
                                return b.length - a.length;
                            });
                        }
                        else {
                            // Single word - just lookup in index and if found add to list of words
                            if (allWords["_" + searchTerm] != undefined) {
                                searchTermWordMatch.matchedWords.push(searchTerm);
                            }
                        }
                        // All of the above will yield one or more words. We then go through the matched words, building a search result entry with a 
                        //  ranking value.
                        if (searchTermWordMatch != null) {
                            for (var searchTermWordMatchIndex = 0; searchTermWordMatchIndex < searchTermWordMatch.matchedWords.length; searchTermWordMatchIndex++) {
                                var matchedWord = searchTermWordMatch.matchedWords[searchTermWordMatchIndex];
                                // get indices of files containing word
                                var matchedWordData = allWords["_" + searchTermWordMatch.matchedWords[searchTermWordMatchIndex]];
                                // tokenize indices
                                var fileIndexes = matchedWordData.split(",");
                                for (var index = 0; index < fileIndexes.length; index++) {
                                    var fileIndex;
                                    var rank = 0;
                                    var positions = null;
                                    if (this._isFullTextSearchPositionDataAvailable) {
                                        // Store file index, position data and a rank value in the search result
                                        fileIndex = parseInt(fileIndexes[index].split(":")[0]);
                                        var rankAsString = fileIndexes[index].split(":")[1];
                                        positions = $.map(rankAsString.split("|"), function (positionAsString, index) {
                                            return parseInt(positionAsString);
                                        });
                                        if (positions.length > 0) {
                                            rank = positions[0];
                                        }
                                    }
                                    else {
                                        // No positional data available - we store just the file index in the search result
                                        fileIndex = parseInt(fileIndexes[index]);
                                    }
                                    var searchResult = null;
                                    if (searchResults[fileIndex] == undefined) {
                                        // New file not encountered yet
                                        searchResult = new SearchResult(fileIndex, rank, matchedWord + ",", searchTermWordMatch.searchTerm + ",");
                                        if (searchFiles[fileIndex] != undefined) {
                                            // Store url and title
                                            searchResult.searchFile = searchFiles[fileIndex];
                                        }
                                        searchResults[fileIndex] = searchResult;
                                    }
                                    else {
                                        // Existing file, add to the rank
                                        searchResult = searchResults[fileIndex];
                                        if (searchResult.keywords.indexOf(matchedWord + ",") == -1) {
                                            // New word match in this file
                                            searchResult.rank += rank;
                                            searchResult.keywords += (matchedWord + ",");
                                        }
                                        if (searchResult.searchTerms.indexOf(searchTermWordMatch.searchTerm + ",") == -1) {
                                            // New search term match in this file
                                            searchResult.rank += rank;
                                            searchResult.searchTerms += (searchTermWordMatch.searchTerm + ",");
                                        }
                                    }
                                    if (positions != null) {
                                        if (searchResult.keywordPositions == null) {
                                            searchResult.keywordPositions = [];
                                        }
                                        searchResult.keywordPositions[matchedWord] = positions;
                                    }
                                }
                            }
                        }
                    }
                    // Return array ordered by rank
                    if (this._isFullTextSearchPositionDataAvailable) {
                        searchResults = searchResults.sort(function (a, b) {
                            var value = a.rank - b.rank;
                            if (value == 0) {
                                // Use file rank to disambiguate
                                value = a.searchFile.rank - b.searchFile.rank;
                                if (value == 0) {
                                    return a.fileIndex - b.fileIndex;
                                }
                            }
                            return value;
                        });
                    }
                    return searchResults;
                };
                SearchDocumentFeature.prototype.buildResultsArray = function (query, searchResults) {
                    var results = [];
                    for (var index = 0; index < searchResults.length; index++) {
                        if (searchResults[index] != undefined) {
                            var searchTerms = searchResults[index].searchTerms;
                            var result = false;
                            try {
                                result = eval(query);
                            }
                            catch (ex) {
                            }
                            if (result == true) {
                                results.push(searchResults[index]);
                            }
                        }
                    }
                    return results;
                };
                SearchDocumentFeature.prototype.getPhrase = function (name) {
                    var span = $("#phrase_" + name);
                    if (span.length > 0) {
                        return span.html();
                    }
                };
                SearchDocumentFeature.prototype.outputResults = function (searchResults) {
                    // init table html
                    var tableHtml = "<hr /><p class=\"i-search-title\">"
                        + this.getPhrase("Search_SearchResults") + "</p>";
                    tableHtml += "<table class=\"i-result-list\">";
                    var resultIndex = 0;
                    // add results to table
                    var resultCount = 0;
                    for (var resultIndex = 0; resultIndex < searchResults.length; resultIndex++) {
                        var searchResult = searchResults[resultIndex];
                        var className = null;
                        if (searchResults[resultIndex] != undefined) {
                            if (resultIndex == 0)
                                className = "i-top-row";
                            else if (resultIndex == searchResults.length)
                                className = "i-bottom-row";
                            else
                                className = "i-inner-row";
                            // add row text
                            tableHtml += "<tr><td class=\"" + className + "\">"
                                + (resultCount + 1) + ":</td><td class=\"" + className + "\"><a class=\"i-result btn\" target=\"i-content\" href=\"" + searchResult.searchFile.url + "\" data-result-index=\"" + resultIndex + "\">"
                                + searchResult.searchFile.title + "</a></td></tr>";
                            // incr total
                            resultCount++;
                        }
                    }
                    // add footer
                    tableHtml += "</table><p>" + resultCount + " " + this.getPhrase("Search_ResultCount") + "</p>";
                    // set it
                    $("#i-results", this._rootSelector).html(tableHtml);
                };
                SearchDocumentFeature.prototype.showSearchResult = function (hRef, resultIndex) {
                    var highlight = $("#i-highlight", this._rootSelector);
                    var webframe = null;
                    if (window.parent != null && window.parent.parent != null) {
                        webframe = window.parent.parent;
                    }
                    if (highlight.is(":checked")) {
                        // message listener takes care of highlight when the content loads
                        this._webSearchPendingHighlight = hRef;
                    }
                    if (webframe != null) {
                        Content.Messaging.routeMessageToWindow(webframe, Features.NavigationMessageNames.navigate, hRef);
                        Content.Messaging.routeMessageToWindow(webframe, Features.NavigationMessageNames.closeNavigationPane, null);
                        if (resultIndex != null) {
                            this._clickedResult = this._results[resultIndex];
                        }
                    }
                };
                SearchDocumentFeature.prototype.highlightContentFrame = function () {
                    Content.Messaging.routeMessageToWindow(parent, Content.DocumentMessageNames.resetQuickSearch, null);
                    if (this._clickedResult != null) {
                        var keywords = this._clickedResult.keywords.split(",");
                        for (var x = 0; x < keywords.length; x++) {
                            var keyword = keywords[x];
                            if (keyword != null && keyword != "") {
                                Content.Messaging.routeMessageToWindow(parent, Content.DocumentMessageNames.quickSearch, keywords[x]);
                            }
                        }
                    }
                    Content.Messaging.routeMessageToWindow(parent, Content.DocumentMessageNames.searchHighlightComplete, null);
                };
                SearchDocumentFeature.prototype.getKeywordArray = function () {
                    // get search string
                    var searchText = $("#i-search", this._rootSelector).val();
                    if (searchText.length == 0) {
                        return null;
                    }
                    // make lowercase for easy comparison later on
                    searchText = searchText.toLowerCase();
                    // tokenise
                    var tokens = searchText.split(" ");
                    // build keywords array
                    var keywords = [];
                    for (var tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
                        if (tokens[tokenIndex].length > 0) {
                            var token = tokens[tokenIndex];
                            // strip out any delimiters & whitespace
                            token = token.replace(new RegExp("\'", "ig"), "");
                            token = token.replace(new RegExp("\"", "ig"), "");
                            token = token.replace(new RegExp(",", "ig"), "");
                            // add to array
                            if (!((token == "or") || (token == "and"))) {
                                // add to keywords array
                                keywords.push(token);
                            }
                        }
                    }
                    return keywords;
                };
                SearchDocumentFeature.prototype.onMessage = function (message) {
                    if (!this._isEnabled) {
                        return;
                    }
                    switch (message.messageType) {
                        case Features.NavigationMessageNames.activated:
                            $("#i-search", this._rootSelector).focus();
                            break;
                        case Features.NavigationMessageNames.loaded:
                            if (message.messageData.indexOf(this._webSearchPendingHighlight) != -1) {
                                // If the content loaded is our pending search navigate, apply the search highlights
                                this.highlightContentFrame();
                            }
                            this._webSearchPendingHighlight = null;
                            break;
                        case Content.DocumentMessageNames.quickSearch:
                        case Content.DocumentMessageNames.searchHighlightComplete:
                            // Pass to parent frame handler and onwards to the content frame
                            Content.Messaging.routeMessageToWindow(parent, message.messageType, message.messageData);
                            break;
                    }
                };
                return SearchDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.SearchDocumentFeature = SearchDocumentFeature;
            var SearchResult = (function () {
                function SearchResult(fileIndex, rank, keywords, searchTerms) {
                    this.fileIndex = fileIndex;
                    this.rank = rank;
                    this.keywords = keywords;
                    this.searchTerms = searchTerms;
                    this.rank = rank;
                }
                return SearchResult;
            }());
            Features.SearchResult = SearchResult;
            var SearchFile = (function () {
                function SearchFile(url, title, rank) {
                    this.url = url;
                    this.title = title;
                    this.rank = rank;
                }
                return SearchFile;
            }());
            Features.SearchFile = SearchFile;
            var SearchTermWordMatch = (function () {
                function SearchTermWordMatch(searchTerm, matchedWords) {
                    this.searchTerm = searchTerm;
                    this.matchedWords = matchedWords;
                }
                return SearchTermWordMatch;
            }());
            Features.SearchTermWordMatch = SearchTermWordMatch;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.SearchDocumentFeatureFactory());
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var IndexDocumentFeatureFactory = (function () {
                function IndexDocumentFeatureFactory() {
                }
                IndexDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new IndexDocumentFeature(documentInstance);
                };
                return IndexDocumentFeatureFactory;
            }());
            Features.IndexDocumentFeatureFactory = IndexDocumentFeatureFactory;
            var IndexDocumentFeature = (function (_super) {
                __extends(IndexDocumentFeature, _super);
                function IndexDocumentFeature(documentInstance) {
                    _super.call(this, documentInstance);
                    this._isFilterVisibility = false;
                    this._isEnabled = false;
                    this._rootSelector = null;
                }
                IndexDocumentFeature.prototype.getName = function () {
                    return "Index";
                };
                IndexDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    //if (e.keyCode == 13) {
                    //    var contentFrame = contentFrame();
                    //    contentFrame.document.location.href = lastSelectedElement.href;
                    //}
                    var _this = this;
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    this._rootSelector = rootSelector;
                    if ($("#i-index-container", rootSelector).length > 0) {
                        this._isEnabled = true;
                        $("#i-search", this._rootSelector)
                            .off("keyup.index")
                            .on("keyup.index", function (event) {
                            if (event.keyCode == 13) {
                                var selectedHref = $("a.i-selected", _this._rootSelector).filter("[href]").first().attr("href");
                                if (selectedHref != null) {
                                    // Route message to parent window to navigate to the selected entry
                                    Content.Messaging.routeMessageToWindow(parent, Features.NavigationMessageNames.navigate, selectedHref);
                                }
                            }
                            else {
                                setTimeout(function () {
                                    _this.findIndexEntry();
                                }, 1);
                            }
                        });
                        // Resize the results and search boxes
                        $("#i-index-container", rootSelector)
                            .off("resize.index")
                            .on("resize.index", function () {
                            setTimeout(function () {
                                var indexContainer = $("#i-index-container");
                                var indexBody = $("#i-index-body");
                                indexContainer.css("height", (indexContainer.height() - 20) + "px");
                                indexContainer.css("width", (indexContainer.width()) + "px");
                            }, 1);
                        });
                    }
                };
                IndexDocumentFeature.prototype.populateResponsiveConfiguration = function (configuration) {
                    if (this._isEnabled && configuration.profileName != "desktop") {
                        configuration.clickTargets.push(new Content.ResponsiveClickTarget("#i-index-body a", Content.ResponsiveClickTargetKind.block));
                    }
                };
                IndexDocumentFeature.prototype.applyResponsiveConfiguration = function (configuration) {
                    if (this._isEnabled && configuration.profileName != "desktop") {
                        this._isFilterVisibility = true;
                        // Close the navigation pane when a result is selected
                        $("#i-index-body", this._rootSelector)
                            .off("click.index", "a")
                            .on("click.index", "a", function () {
                            if (window.parent != null && window.parent.parent != null) {
                                Content.Messaging.routeMessageToWindow(window.parent.parent, Features.NavigationMessageNames.closeNavigationPane, null);
                            }
                        });
                    }
                };
                IndexDocumentFeature.prototype.findIndexEntry = function () {
                    var term = $("#i-search", this._rootSelector).val();
                    term = term.toLowerCase();
                    if (this._isFilterVisibility) {
                        // Filter the list to only show matching
                        var regex = new RegExp("^" + term, "i");
                        var found = false;
                        $("a,span", this._rootSelector.find("#i-index-body")).each(function (index, element) {
                            if ($(element).text().match(regex)) {
                                $(element).css("display", "inline-block");
                                $(element).next("br").css("display", "inline");
                                $(element).next("blockquote").css("display", "block");
                            }
                            else {
                                $(element).css("display", "none");
                                $(element).next("br").css("display", "none");
                                $(element).next("blockquote").css("display", "none");
                            }
                        });
                        $("a,span", this._rootSelector.find("#i-index-body")).each(function (index, element) {
                            if ($(element).css("display") == "inline-block") {
                                // Make sure the parents are visible also
                                $(element).parents("blockquote").each(function (index, blockQuoteElement) {
                                    var parentElement = $(blockQuoteElement).prev("a,span");
                                    parentElement.css("display", "inline-block");
                                    parentElement.next("br").css("display", "inline");
                                    parentElement.next("blockquote").css("display", "block");
                                });
                            }
                        });
                    }
                    else {
                        $(".i-selected", this._rootSelector).removeClass("i-selected");
                        if (term != null) {
                            // Find any matching terms
                            var anchor = $("a,span", this._rootSelector.find("#i-index-body")).filter(function (index, element) {
                                if (term != null && term != "" && $(element).text().substring(0, term.length).toLowerCase() === term) {
                                    return element;
                                }
                            });
                            var bodyElement = $("#i-index-body", this._rootSelector).get(0);
                            if (anchor.length > 0) {
                                // Found at least one match. Scroll to the first entry and mark all as selected
                                bodyElement.scrollTop = anchor.get(0).offsetTop - anchor.outerHeight(true);
                                anchor.toggleClass("i-selected", true);
                            }
                            else {
                                // Scroll back to the top of the index
                                bodyElement.scrollTop = 0;
                            }
                        }
                    }
                };
                return IndexDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.IndexDocumentFeature = IndexDocumentFeature;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.IndexDocumentFeatureFactory());

//# sourceMappingURL=innovasys.navigation.js.map
