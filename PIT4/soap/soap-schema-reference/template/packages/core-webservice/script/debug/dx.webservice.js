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
            var ChmCompatibilityDocumentFeatureFactory = (function () {
                function ChmCompatibilityDocumentFeatureFactory() {
                }
                ChmCompatibilityDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    var currentLocation = Content.Browser.getWindowLocationHref() + ".";
                    if (currentLocation.indexOf("mk:@MSITStore") == 0) {
                        return new ChmCompatibilityDocumentFeature(documentInstance);
                    }
                    return null;
                };
                return ChmCompatibilityDocumentFeatureFactory;
            }());
            Features.ChmCompatibilityDocumentFeatureFactory = ChmCompatibilityDocumentFeatureFactory;
            var ChmCompatibilityDocumentFeature = (function (_super) {
                __extends(ChmCompatibilityDocumentFeature, _super);
                function ChmCompatibilityDocumentFeature(documentInstance) {
                    _super.call(this, documentInstance);
                }
                ChmCompatibilityDocumentFeature.prototype.getName = function () {
                    return "CHM Compatibility";
                };
                ChmCompatibilityDocumentFeature.prototype.initializeDocument = function () {
                    /* Userdata support in CHMs requires pages are loaded under the ms-its protocol and not mk:@MSITStore */
                    var currentLocation = Content.Browser.getWindowLocationHref() + ".";
                    if (currentLocation.indexOf("mk:@MSITStore") == 0) {
                        var newLocation = "ms-its:" + currentLocation.substring(14, currentLocation.length - 1);
                        Innovasys.Content.Browser.navigateTo(newLocation);
                    }
                };
                return ChmCompatibilityDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.ChmCompatibilityDocumentFeature = ChmCompatibilityDocumentFeature;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.ChmCompatibilityDocumentFeatureFactory());
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var CopyCodeDocumentFeatureFactory = (function () {
                function CopyCodeDocumentFeatureFactory() {
                }
                CopyCodeDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new CopyCodeDocumentFeature(documentInstance);
                };
                return CopyCodeDocumentFeatureFactory;
            }());
            Features.CopyCodeDocumentFeatureFactory = CopyCodeDocumentFeatureFactory;
            var CopyCodeDocumentFeature = (function (_super) {
                __extends(CopyCodeDocumentFeature, _super);
                function CopyCodeDocumentFeature(documentInstance) {
                    _super.call(this, documentInstance);
                }
                CopyCodeDocumentFeature.prototype.getName = function () {
                    return "Copy Code";
                };
                CopyCodeDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    var eventId = "click.i-copy-code";
                    // Wire up the copy code functionality
                    if (location.protocol == 'mk:' || Content.Browser.msIeVersion() > 0 || Content.Browser.isDesignTime) {
                        // In CHM or IE use the inbuilt IE clipboard support
                        rootSelector
                            .off(eventId, ".i-copy-code")
                            .on(eventId, ".i-copy-code", function (eventObject) {
                            var textValue = Innovasys.Content.DomHelpers.getTextFromContainingTable(eventObject.currentTarget);
                            window.clipboardData.setData('Text', textValue);
                            alert("Copied text to clipboard:\n\n " + textValue);
                            Content.Browser.stopPropagation(eventObject);
                        });
                    }
                    else if (location.protocol == "file:") {
                        rootSelector
                            .off(eventId, ".i-copy-code")
                            .on(eventId, ".i-copy-code", function (eventObject) {
                            // Cannot copy to clipboard from local content in browsers other than IE
                            alert("Cannot copy to the clipboard as browser security restrictions prevent copying to the clipboard from local Html content");
                            Content.Browser.stopPropagation(eventObject);
                        });
                    }
                    else {
                        // Use zero clipboard for other scenarios
                        ZeroClipboard.config({ moviePath: 'script/ZeroClipboard.swf' });
                        var zeroClipboardClient = new ZeroClipboard($('.i-copy-code'));
                        zeroClipboardClient.on('ready', function (event) {
                            // Movie is loaded
                            zeroClipboardClient.on("copy", function (event) {
                                var clipboard = event.clipboardData;
                                clipboard.setData("text/plain", Innovasys.Content.DomHelpers.getTextFromContainingTable(this));
                            });
                            zeroClipboardClient.on('aftercopy', function (event) {
                                var text = event.data['text/plain'];
                                if (text.length > 500) {
                                    text = text.substr(0, 500) + "...\n\n(" + (text.length - 500) + " characters not shown)";
                                }
                                alert("Copied text to clipboard:\n\n " + text);
                            });
                        });
                    }
                };
                CopyCodeDocumentFeature.prototype.populateResponsiveConfiguration = function (configuration) {
                    switch (configuration.profileName) {
                        case "tablet":
                            break;
                        case "mobile":
                            break;
                    }
                    // Dropdown Header as a button
                    configuration.clickTargets.push(new Content.ResponsiveClickTarget(".i-copy-code", Content.ResponsiveClickTargetKind.inline));
                };
                return CopyCodeDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.CopyCodeDocumentFeature = CopyCodeDocumentFeature;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.CopyCodeDocumentFeatureFactory());
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var HighlightTextDocumentFeatureFactory = (function () {
                function HighlightTextDocumentFeatureFactory() {
                }
                HighlightTextDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new HighlightTextDocumentFeature(documentInstance);
                };
                return HighlightTextDocumentFeatureFactory;
            }());
            Features.HighlightTextDocumentFeatureFactory = HighlightTextDocumentFeatureFactory;
            var HighlightTextDocumentFeature = (function (_super) {
                __extends(HighlightTextDocumentFeature, _super);
                function HighlightTextDocumentFeature(documentInstance) {
                    _super.call(this, documentInstance);
                    // Stores the first found match so we can scroll to it
                    this._firstMatch = null;
                }
                HighlightTextDocumentFeature.prototype.getName = function () {
                    return "Highlight Text";
                };
                HighlightTextDocumentFeature.prototype.onMessage = function (message) {
                    if (message != null) {
                        switch (message.messageType) {
                            case Content.DocumentMessageNames.quickSearch:
                                this.highlightText(message.messageData);
                                break;
                            case Content.DocumentMessageNames.resetQuickSearch:
                                this.removeAllHighlights();
                                break;
                            case Content.DocumentMessageNames.searchHighlightComplete:
                                this.searchHighlightComplete();
                                break;
                        }
                    }
                };
                HighlightTextDocumentFeature.prototype.highlightText = function (text) {
                    var rootElement = this.documentInstance.rootElement;
                    if (text != "") {
                        this.highlightTextInElement(rootElement, text);
                    }
                };
                HighlightTextDocumentFeature.prototype.searchHighlightComplete = function () {
                    // Scroll to the first hit if it's not already visible
                    if (this._firstMatch != null) {
                        var rootElement = this.documentInstance.rootElement;
                        var ownerDocument = rootElement.ownerDocument;
                        if (Innovasys.Content.DomHelpers.getElementPosition(this._firstMatch).top > ownerDocument.documentElement.scrollTop + ownerDocument.documentElement.clientHeight
                            || Innovasys.Content.DomHelpers.getElementPosition(this._firstMatch).top < ownerDocument.documentElement.scrollTop) {
                            ownerDocument.documentElement.scrollTop = this._firstMatch.offsetTop;
                        }
                    }
                    this._firstMatch = null;
                };
                /**
                 * Finds some specific text and wraps with a search result highlight element.
                 * @param element The root element to search through.
                 * @param text The text to find.
                 */
                HighlightTextDocumentFeature.prototype.highlightTextInElement = function (element, text) {
                    var textRegExp = new RegExp("\\b" + this.escapeForRegExp(text) + "\\b", "gi");
                    var node = null;
                    var nodeText = null;
                    var lowerCaseNodeText = null;
                    var highlightSpan = null;
                    var remainingText = null;
                    var textNode = null;
                    var ownerDocument = element.ownerDocument;
                    // Traverse the document backwards otherwise the DOM returns stale objects as
                    //  we make modifications
                    for (var x = element.childNodes.length - 1; x >= 0; x--) {
                        node = element.childNodes[x];
                        var checkedElementVisible = false;
                        // Text Node
                        if (node.nodeType == 3) {
                            nodeText = node.nodeValue;
                            lowerCaseNodeText = nodeText.toLowerCase();
                            for (var pos = lowerCaseNodeText.search(textRegExp); pos >= 0; pos = lowerCaseNodeText.search(textRegExp)) {
                                // Create a span to mark up the highlight
                                highlightSpan = ownerDocument.createElement("SPAN");
                                highlightSpan.className = "i-search-highlight";
                                highlightSpan.appendChild(ownerDocument.createTextNode(nodeText.substring(pos, pos + text.length)));
                                // Insert the span containing the term
                                remainingText = ownerDocument.createTextNode(nodeText.substring(pos + text.length, nodeText.length));
                                node.nodeValue = nodeText.substring(0, pos);
                                highlightSpan = node.parentNode.insertBefore(highlightSpan, node.nextSibling);
                                remainingText = node.parentNode.insertBefore(remainingText, highlightSpan.nextSibling);
                                // Store the first (last)hit so we can scroll to it
                                this._firstMatch = highlightSpan;
                                // Skip past the new nodes we've added
                                node = node.nextSibling.nextSibling;
                                nodeText = node.nodeValue;
                                lowerCaseNodeText = nodeText.toLowerCase();
                                if (!checkedElementVisible) {
                                    // Delegate responsibility to the document and features
                                    this.documentInstance.ensureElementVisible(node.parentElement);
                                    checkedElementVisible = true;
                                }
                            }
                        }
                        else if (node.nodeType == 1) {
                            var elementNode = node;
                            // To ensure we don't modify script or go over
                            //  highlights we have already applied
                            if (elementNode.nodeName != "SCRIPT" && !(elementNode.nodeName == "SPAN" && elementNode.className == "i-search-highlight")) {
                                this.highlightTextInElement(elementNode, text);
                            }
                        }
                    }
                };
                /**
                 * Returns any search highlight spans in this document.
                 */
                HighlightTextDocumentFeature.prototype.getHighlightSpans = function () {
                    return this.documentInstance.rootSelector.find(".i-search-highlight");
                };
                /**
                 * Merge any adjacent text nodes (left behind from search highlight)
                 * @param parentNode The node to start searching from.
                 */
                HighlightTextDocumentFeature.cleanUpTextNodes = function (parentNode) {
                    var node = null;
                    var lastNode = null;
                    var mergeCount = null;
                    do {
                        mergeCount = 0;
                        for (var x = 1; x < parentNode.childNodes.length; x++) {
                            node = parentNode.childNodes[x];
                            lastNode = node.previousSibling;
                            if (node.nodeType == 3 && lastNode.nodeType == 3) {
                                node.nodeValue = lastNode.nodeValue + node.nodeValue;
                                parentNode.removeChild(lastNode);
                                mergeCount++;
                            }
                        }
                    } while (mergeCount > 0);
                    for (var x = 0; x < parentNode.childNodes.length; x++) {
                        HighlightTextDocumentFeature.cleanUpTextNodes(parentNode.childNodes[x]);
                    }
                };
                /**
                 * Remove any search highlight spans.
                 */
                HighlightTextDocumentFeature.prototype.removeAllHighlights = function () {
                    var spans = this.getHighlightSpans();
                    spans.each(function (index, element) {
                        var span = $(element);
                        span.replaceWith(span.html());
                    });
                    // This process may have resulted in multiple contiguous text nodes
                    //  which could cause problems with subsequent search highlight operations
                    // So we join any continguous text nodes here
                    HighlightTextDocumentFeature.cleanUpTextNodes(this.documentInstance.rootElement);
                    $("#i-remove-highlighting").hide();
                };
                HighlightTextDocumentFeature.prototype.escapeForRegExp = function (source) {
                    return source.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                };
                return HighlightTextDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.HighlightTextDocumentFeature = HighlightTextDocumentFeature;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.HighlightTextDocumentFeatureFactory());
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var MarkAsNewDocumentFeatureFactory = (function () {
                function MarkAsNewDocumentFeatureFactory() {
                }
                MarkAsNewDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new MarkAsNewDocumentFeature(documentInstance);
                };
                return MarkAsNewDocumentFeatureFactory;
            }());
            Features.MarkAsNewDocumentFeatureFactory = MarkAsNewDocumentFeatureFactory;
            var MarkAsNewDocumentFeature = (function (_super) {
                __extends(MarkAsNewDocumentFeature, _super);
                function MarkAsNewDocumentFeature(documentInstance) {
                    _super.call(this, documentInstance);
                }
                MarkAsNewDocumentFeature.prototype.getName = function () {
                    return "Mark As New";
                };
                MarkAsNewDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    if (this.documentInstance.isNew && isInitialLoad == true) {
                        rootSelector.addClass('i-is-new');
                    }
                    ;
                };
                return MarkAsNewDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.MarkAsNewDocumentFeature = MarkAsNewDocumentFeature;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.MarkAsNewDocumentFeatureFactory());
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var Help2CompatibilityDocumentFeatureFactory = (function () {
                function Help2CompatibilityDocumentFeatureFactory() {
                }
                Help2CompatibilityDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    if (location.protocol == "ms-help:") {
                        return new Help2CompatibilityDocumentFeature(documentInstance);
                    }
                    return null;
                };
                return Help2CompatibilityDocumentFeatureFactory;
            }());
            Features.Help2CompatibilityDocumentFeatureFactory = Help2CompatibilityDocumentFeatureFactory;
            /**
             * Handles any compatibility issues when content is served in Microsoft Help 2.x
             */
            var Help2CompatibilityDocumentFeature = (function (_super) {
                __extends(Help2CompatibilityDocumentFeature, _super);
                function Help2CompatibilityDocumentFeature(documentInstance) {
                    _super.call(this, documentInstance);
                }
                Help2CompatibilityDocumentFeature.prototype.getName = function () {
                    return "Microsoft Help 2.x Compatibility";
                };
                Help2CompatibilityDocumentFeature.prototype.initializeDocument = function () {
                    // Works around a jQuery setAttribute bug for a specific IE mode used by MSHV and Help 2.x (with IE11 installed)
                    Content.Browser.checkForIe7ModeJqueryBug();
                };
                return Help2CompatibilityDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.Help2CompatibilityDocumentFeature = Help2CompatibilityDocumentFeature;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
// Register factory
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.Help2CompatibilityDocumentFeatureFactory());
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var HelpViewerCompatibilityDocumentFeatureFactory = (function () {
                function HelpViewerCompatibilityDocumentFeatureFactory() {
                }
                HelpViewerCompatibilityDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    if (HelpViewerCompatibilityDocumentFeature.isMicrosoftHelpViewer()) {
                        return new HelpViewerCompatibilityDocumentFeature(documentInstance);
                    }
                    return null;
                };
                return HelpViewerCompatibilityDocumentFeatureFactory;
            }());
            Features.HelpViewerCompatibilityDocumentFeatureFactory = HelpViewerCompatibilityDocumentFeatureFactory;
            /**
             * Handles any compatibility issues when content is served in Microsoft Help Viewer.
             */
            var HelpViewerCompatibilityDocumentFeature = (function (_super) {
                __extends(HelpViewerCompatibilityDocumentFeature, _super);
                function HelpViewerCompatibilityDocumentFeature(documentInstance) {
                    _super.call(this, documentInstance);
                }
                HelpViewerCompatibilityDocumentFeature.prototype.getName = function () {
                    return "Microsoft Help Viewer Compatibility";
                };
                HelpViewerCompatibilityDocumentFeature.prototype.initializeDocument = function () {
                    // Removes any unwanted branding files
                    HelpViewerCompatibilityDocumentFeature.removeExternalFile(/branding.*\.css/g, "css");
                    // Fix urls in stylesheets
                    HelpViewerCompatibilityDocumentFeature.fixStyles();
                    // Works around a jQuery setAttribute bug for a specific IE mode used by MSHV and Help 2.x (with IE11 installed)
                    Content.Browser.checkForIe7ModeJqueryBug();
                };
                HelpViewerCompatibilityDocumentFeature.prototype.initializeContent = function (rootElement) {
                    // Fixes any content issues (e.g.link and resource url issues)
                    if (HelpViewerCompatibilityDocumentFeature.isMicrosoftHelpViewerVersion2()) {
                        // Microsoft Help Viewer 2.x (Visual Studio 2012+) patches
                        $('body').hide();
                        // Standard url() references in stylesheets don't work in MSHV 2 so we have to reference
                        //  an additional stylesheet with alternate syntax
                        $('link').each(function () {
                            var mshvStylesheet = $(this).attr('data-mshv2-stylesheet');
                            if (mshvStylesheet) {
                                var newStylesheetHref = 'ms-xhelp:///?;' + mshvStylesheet;
                                HelpViewerCompatibilityDocumentFeature._pendingStylesheets.push(newStylesheetHref);
                                $('head').append('<link rel="stylesheet" href="' + newStylesheetHref + '" type="text/css" />');
                            }
                        });
                        // Fix any id links to work around bug in VS 2012 RC Help Viewer
                        $('a').each(function () {
                            var href = $(this).attr('href');
                            if (href && href.indexOf('ms-xhelp:///?id=') != -1) {
                                $(this).attr('href', href.replace('ms-xhelp:///?id=', 'ms-xhelp:///?method=page&id='));
                            }
                        });
                        Content.Browser.showElement($('body'));
                    }
                    else {
                        // Microsoft Help Viewer 1 (Visual Studio 2010) patches
                        // Standard url() references in stylesheets don't work in MSHV 2 so we have to reference
                        //  an additional stylesheet with alternate syntax for those references to work in MSHV 1
                        $('link').each(function () {
                            var mshvStylesheet = $(this).attr('data-mshv1-stylesheet');
                            if (mshvStylesheet) {
                                var newStylesheetHref = HelpViewerCompatibilityDocumentFeature.resourceBaseUrl() + mshvStylesheet;
                                HelpViewerCompatibilityDocumentFeature._pendingStylesheets.push(newStylesheetHref);
                                $('head').append('<link rel="stylesheet" href="' + newStylesheetHref + '" type="text/css" />');
                            }
                        });
                        // Fix double line breaks
                        $('BR').filter(function () { return $(this).next().is('BR'); }).remove();
                        // Fix bookmark links
                        $('A').each(function () {
                            // Check for bookmark links - currently prefixed with the full page url
                            var anchorHref = $(this).attr('href');
                            if (anchorHref && anchorHref.indexOf('#') != -1) {
                                var bookmark = anchorHref.substring(anchorHref.indexOf('#'));
                                if (anchorHref.substring(0, anchorHref.indexOf('#')) == location.href) {
                                    // Bookmark in this document
                                    $(this).attr('target', '_self');
                                }
                            }
                        });
                        // Make sure stylesheets are all fixed up
                        HelpViewerCompatibilityDocumentFeature.fixStyles();
                    }
                };
                ;
                /**
                 * Removes any referenced files that match the passed pattern (scripts and stylesheets).
                 * @param filename Filename pattern (regular expression).
                 * @param filetype Indicates the type of file ("js" or "css", so that we know what tags / attributes to look in.
                 */
                HelpViewerCompatibilityDocumentFeature.removeExternalFile = function (filename, filetype) {
                    var targetTagName = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none";
                    var targetAttribute = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none";
                    $(targetTagName).each(function (index) {
                        if ($(this).attr(targetAttribute).match(filename))
                            this.parentNode.removeChild(this);
                    });
                };
                /**
                 * Discovers the base url for resource requests so that we can fix up images etc.
                 */
                HelpViewerCompatibilityDocumentFeature.resourceBaseUrl = function () {
                    if (Content.Browser.isDesignTime) {
                        return '';
                    }
                    else {
                        // Get the first script tag
                        var script = $('#mshs_support_script').get(0);
                        // Extract the src which is a full resource url to within our origin .mshc
                        var scriptSrc = script.src;
                        var scriptUrl = null;
                        if (HelpViewerCompatibilityDocumentFeature.isMicrosoftHelpViewerVersion2()) {
                            // HV 2
                            var startIndex = scriptSrc.indexOf('&id=');
                            scriptUrl = scriptSrc.substring(0, startIndex);
                            startIndex = scriptSrc.indexOf('&', startIndex + 1);
                            scriptUrl = scriptUrl + scriptSrc.substring(startIndex) + "&id=";
                        }
                        else {
                            // HV 1
                            // Get the portion up to the ; (the base url for resource references)
                            var startIndex = scriptSrc.indexOf(';') + 1;
                            scriptUrl = scriptSrc.substring(0, startIndex);
                        }
                        return scriptUrl;
                    }
                };
                HelpViewerCompatibilityDocumentFeature.fixStyles = function () {
                    // Fix Javascript rules using urls
                    var stylesheets = document.styleSheets;
                    if (stylesheets && stylesheets.length > 0) {
                        // Waiting on any stylesheets to load?
                        if (HelpViewerCompatibilityDocumentFeature._pendingStylesheets.length != 0) {
                            for (var pendingStylesheetIndex = 0; pendingStylesheetIndex < HelpViewerCompatibilityDocumentFeature._pendingStylesheets.length; pendingStylesheetIndex++) {
                                var pendingStylesheetHref = HelpViewerCompatibilityDocumentFeature._pendingStylesheets[pendingStylesheetIndex];
                                var foundStylesheet = false;
                                for (var stylesheetindex = 0; stylesheetindex < (stylesheets.length); stylesheetindex++) {
                                    var stylesheet = stylesheets[stylesheetindex];
                                    if (stylesheet.href != null && stylesheet.href == pendingStylesheetHref) {
                                        // Found the pending stylesheet - check that the rules have loaded
                                        var rules = null;
                                        try {
                                            if (stylesheet.rules) {
                                                rules = stylesheet.rules;
                                            }
                                            else {
                                                rules = stylesheet.cssRules;
                                            }
                                        }
                                        catch (ex) { }
                                        ;
                                        if (rules != null && rules.length > 0) {
                                            foundStylesheet = true;
                                        }
                                        break;
                                    }
                                }
                                if (!foundStylesheet) {
                                    // Could not locate the stylesheet, try again in a bit
                                    if (HelpViewerCompatibilityDocumentFeature._pendingStylesheetTimer == null) {
                                        HelpViewerCompatibilityDocumentFeature._pendingStylesheetTimer = window.setInterval(HelpViewerCompatibilityDocumentFeature.fixStyles, 50);
                                    }
                                    return;
                                }
                            }
                            if (HelpViewerCompatibilityDocumentFeature._pendingStylesheetTimer != null) {
                                clearInterval(HelpViewerCompatibilityDocumentFeature._pendingStylesheetTimer);
                                HelpViewerCompatibilityDocumentFeature._pendingStylesheetTimer = null;
                            }
                        }
                        for (var stylesheetindex = 0; stylesheetindex < (stylesheets.length); stylesheetindex++) {
                            var stylesheet = stylesheets[stylesheetindex];
                            var rules;
                            try {
                                if (stylesheet.rules) {
                                    rules = stylesheet.rules;
                                }
                                else {
                                    rules = stylesheet.cssRules;
                                }
                            }
                            catch (ex) { }
                            ;
                            if (rules) {
                                for (var ruleindex = 0; ruleindex < rules.length; ruleindex++) {
                                    var rule = rules[ruleindex];
                                    if (rule.style.backgroundImage) {
                                        if (rule.style.backgroundImage.substring(0, 4) == 'url(') {
                                            var backgroundText = rule.style.backgroundImage;
                                            var originalUrl = null;
                                            if (rule.style.backgroundImage.indexOf('127.0.0.1') != -1) {
                                                // Chrome - rule returned as full url
                                                originalUrl = backgroundText.substring(backgroundText.indexOf('/', backgroundText.indexOf('127.0.0.1')) + 5, backgroundText.lastIndexOf(')'));
                                            }
                                            else if (backgroundText.indexOf('../') != -1) {
                                                // IE - rule returned as original, with a .. prefix
                                                originalUrl = backgroundText.substring(backgroundText.indexOf('../') + 2, backgroundText.lastIndexOf(')'));
                                            }
                                            else {
                                                // Relative url
                                                originalUrl = backgroundText.substring(0, backgroundText.lastIndexOf(')'));
                                            }
                                            originalUrl = originalUrl.replace("\"", "");
                                            var newUrl = 'url(\"' + HelpViewerCompatibilityDocumentFeature.resourceBaseUrl() + originalUrl + '\")';
                                            backgroundText = newUrl + backgroundText.substring(backgroundText.indexOf(')') + 1);
                                            rule.style.backgroundImage = backgroundText;
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
                /**
                 * Returns true if this page is executing in the context of the Microsoft Help Viewer (v1.x or v2.x).
                 */
                HelpViewerCompatibilityDocumentFeature.isMicrosoftHelpViewer = function () {
                    return (location.protocol == 'ms-xhelp:' || location.href.indexOf('ms.help?') != -1 || location.href.indexOf('?method=page&') != -1);
                };
                /**
                 * Returns true if this page is executing in the context of the Microsoft Help Viewer v2.x.
                 */
                HelpViewerCompatibilityDocumentFeature.isMicrosoftHelpViewerVersion2 = function () {
                    var script = $('#mshs_support_script').get(0);
                    var scriptSrc = script.src;
                    return (scriptSrc.indexOf("method=asset") != -1);
                };
                /**
                 * Adjusts the passed url so that it is a valid Microsoft Help Viewer asset url when running under Microsoft Help Viewer.
                 */
                HelpViewerCompatibilityDocumentFeature.fixUrl = function (url) {
                    if (HelpViewerCompatibilityDocumentFeature.isMicrosoftHelpViewer()) {
                        var originalUrl = null;
                        if (url.indexOf('127.0.0.1') != -1) {
                            // Chrome - rule returned as full url
                            originalUrl = url.substring(url.indexOf('/', url.indexOf('127.0.0.1')) + 5, url.length);
                            originalUrl = originalUrl.replace("\"", "");
                        }
                        else if (url.indexOf('../') != -1) {
                            // IE - rule returned as original, with a .. prefix
                            originalUrl = url.substring(url.indexOf('../') + 2, url.lastIndexOf(')'));
                            originalUrl = originalUrl.replace("\"", "");
                        }
                        else {
                            // Relative url in MSHV 2.0
                            originalUrl = url.replace(new RegExp("/", "g"), "\\");
                        }
                        if (originalUrl.indexOf("/help/") != -1) {
                            originalUrl = originalUrl.substring(originalUrl.indexOf("/", originalUrl.indexOf("/help/") + 5), originalUrl.length);
                        }
                        var newUrl = HelpViewerCompatibilityDocumentFeature.resourceBaseUrl() + originalUrl;
                        return newUrl;
                    }
                    else {
                        return url;
                    }
                };
                HelpViewerCompatibilityDocumentFeature._pendingStylesheets = new Array();
                HelpViewerCompatibilityDocumentFeature._pendingStylesheetTimer = null;
                return HelpViewerCompatibilityDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.HelpViewerCompatibilityDocumentFeature = HelpViewerCompatibilityDocumentFeature;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
// Register factory
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.HelpViewerCompatibilityDocumentFeatureFactory());
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var PopupLinksDocumentFeatureFactory = (function () {
                function PopupLinksDocumentFeatureFactory() {
                }
                PopupLinksDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new PopupLinksDocumentFeature(documentInstance);
                };
                return PopupLinksDocumentFeatureFactory;
            }());
            Features.PopupLinksDocumentFeatureFactory = PopupLinksDocumentFeatureFactory;
            var PopupLinksDocumentFeature = (function (_super) {
                __extends(PopupLinksDocumentFeature, _super);
                function PopupLinksDocumentFeature(documentInstance) {
                    _super.call(this, documentInstance);
                }
                PopupLinksDocumentFeature.prototype.getName = function () {
                    return "Popup Links";
                };
                PopupLinksDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    var _this = this;
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    // Configure any popup links
                    rootSelector.find('.i-popup-link').each(function (index, element) {
                        _this.configurePopupLink(element);
                    });
                };
                /**
                 * Configures an individual popup link element.
                 * @param element The element to configure as a popup link.
                 */
                PopupLinksDocumentFeature.prototype.configurePopupLink = function (element) {
                    var _this = this;
                    var linkElement = $(element);
                    var content = null;
                    var contentSource = linkElement.attr('data-popup-contentsource');
                    if (contentSource) {
                        // Get content from a jQuery selector
                        content = this.documentInstance.rootSelector.find(contentSource);
                    }
                    else {
                        // Content declared inline
                        content = linkElement.attr('data-popup-content');
                        if (content != null) {
                            var r = /\\u([\d\w]{4})/gi;
                            content = content.replace(r, function (match, group) {
                                return String.fromCharCode(parseInt(group, 16));
                            });
                            content = content.replace(/\\n/g, '\n').replace(/\\r/g, '\r');
                        }
                    }
                    if (content != null) {
                        var showEvent = linkElement.attr('data-popup-showevent');
                        if (!showEvent) {
                            // Default show event to click
                            showEvent = 'click';
                        }
                        var titleText = linkElement.attr('data-popup-title');
                        if (!titleText) {
                            // Default title to link caption
                            titleText = linkElement.text();
                        }
                        var classes = '';
                        var customClasses = linkElement.attr('data-popup-classes');
                        if (customClasses) {
                            // Custom coloring or effect class
                            classes = classes + ' ' + customClasses;
                        }
                        var adjustX = 0;
                        if (linkElement.padding().left != 0) {
                            // Adjust the padding of the tip by the same amount as the link element padding
                            adjustX = linkElement.padding().left;
                        }
                        var showOptions = { event: showEvent };
                        var hideOptions = { delay: 500, fixed: true };
                        if (Content.Browser.isAnimationDisabled) {
                            showOptions.effect = false;
                            hideOptions.effect = false;
                        }
                        linkElement.qtip({
                            content: {
                                text: content,
                                title: { text: titleText }
                            },
                            position: {
                                my: 'top left',
                                at: 'bottom left',
                                adjust: { x: adjustX },
                                viewport: $(window),
                                container: this.documentInstance.rootSelector
                            },
                            show: showOptions,
                            hide: hideOptions,
                            events: {
                                render: function (event, api) {
                                    // Sets up bindings for click events on checkboxes contained on the popup
                                    var tooltip = api.elements.tooltip;
                                    _this.onPopupRender(tooltip);
                                }
                            },
                            style: { classes: classes }
                        });
                    }
                };
                PopupLinksDocumentFeature.prototype.onPopupRender = function (element) {
                    this.documentInstance.initializeContent(element);
                };
                return PopupLinksDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.PopupLinksDocumentFeature = PopupLinksDocumentFeature;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.PopupLinksDocumentFeatureFactory());
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var QuirksModeCompatibilityDocumentFeatureFactory = (function () {
                function QuirksModeCompatibilityDocumentFeatureFactory() {
                }
                QuirksModeCompatibilityDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    var msIeVersion = Content.Browser.msIeVersion();
                    if (document.compatMode != 'CSS1Compat' || (msIeVersion > 0 && msIeVersion <= 8)) {
                        // Quirks mode feature is active if running in compatibility mode or IE8 or lower
                        return new QuirksModeCompatibilityDocumentFeature(documentInstance);
                    }
                    return null;
                };
                return QuirksModeCompatibilityDocumentFeatureFactory;
            }());
            Features.QuirksModeCompatibilityDocumentFeatureFactory = QuirksModeCompatibilityDocumentFeatureFactory;
            var QuirksModeCompatibilityDocumentFeature = (function (_super) {
                __extends(QuirksModeCompatibilityDocumentFeature, _super);
                function QuirksModeCompatibilityDocumentFeature(documentInstance) {
                    _super.call(this, documentInstance);
                }
                QuirksModeCompatibilityDocumentFeature.prototype.getName = function () {
                    return "Quirks Mode Compatibility";
                };
                QuirksModeCompatibilityDocumentFeature.prototype.initializeDocument = function () {
                    // Prevent expand flickering when IE or CHM running in quirks mode
                    if (document.compatMode != 'CSS1Compat') {
                        // Define overriding method.
                        jQuery.fx.prototype.hide = function () {
                            // Remember where we started, so that we can go back to it later
                            this.options.orig[this.prop] = jQuery.style(this.elem, this.prop);
                            this.options.hide = true;
                            // Begin the animation
                            this.custom(this.cur(), 1);
                        };
                    }
                };
                QuirksModeCompatibilityDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    if (Content.Browser.isDesignTime) {
                        return;
                    }
                    // Fix quirks mode rendering issues
                    if (document.compatMode != 'CSS1Compat'
                        || Content.Browser.info.name == "msie" && Content.Browser.info.version <= 8) {
                        // Quirks mode without first-child support
                        var addFirstChildClassNames = (document.compatMode != 'CSS1Compat');
                        var contentSections = rootSelector.find('.i-section-content,.i-description-content,.i-returns-content,.i-description,.i-box-content');
                        contentSections.each(function (index) {
                            if (addFirstChildClassNames) {
                                $(this).children().first().addClass('i-first-child');
                            }
                            $(this).children().last().addClass('i-last-child');
                        });
                        if (addFirstChildClassNames) {
                            rootSelector.find('table.i-syntax-table th:first-child').addClass('i-first-child');
                            rootSelector.find('td>p:first-child').addClass('i-first-child');
                        }
                        rootSelector.find('table.i-syntax-table th:last-child').addClass('i-last-child');
                        rootSelector.find('td>p:last-child').addClass('i-last-child');
                        rootSelector.find('p+p').addClass('i-adjacent-paragraph');
                        rootSelector.find('h4+.i-returns-content').addClass('i-returns-content-after-heading');
                        rootSelector.find('.i-example-section-content p+div').addClass('i-example-after-paragraph');
                    }
                };
                return QuirksModeCompatibilityDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.QuirksModeCompatibilityDocumentFeature = QuirksModeCompatibilityDocumentFeature;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.QuirksModeCompatibilityDocumentFeatureFactory());
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var SyntaxTabsDocumentFeatureFactory = (function () {
                function SyntaxTabsDocumentFeatureFactory() {
                }
                SyntaxTabsDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new SyntaxTabsDocumentFeature(documentInstance);
                };
                return SyntaxTabsDocumentFeatureFactory;
            }());
            Features.SyntaxTabsDocumentFeatureFactory = SyntaxTabsDocumentFeatureFactory;
            var SyntaxTabsDocumentFeature = (function (_super) {
                __extends(SyntaxTabsDocumentFeature, _super);
                function SyntaxTabsDocumentFeature(documentInstance) {
                    _super.call(this, documentInstance);
                }
                SyntaxTabsDocumentFeature.prototype.getName = function () {
                    return "Syntax Tabs";
                };
                SyntaxTabsDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    var localStorage = this.documentInstance.getLocalStorage();
                    var selectedTabIndex = localStorage.getAttribute('i-tab-container-selected-tab-index');
                    if (!selectedTabIndex) {
                        selectedTabIndex = 0;
                    }
                    // Change default duration on the tabs
                    var options = {
                        active: selectedTabIndex,
                        selected: selectedTabIndex,
                        activate: function (event, ui) {
                            localStorage.setAttribute('i-tab-container-selected-tab-index', ui.newTab.index());
                        },
                        select: function (event, ui) {
                            localStorage.setAttribute('i-tab-container-selected-tab-index', ui.index);
                        }
                    };
                    if (!Content.Browser.isDesignTime && !Content.Browser.isAnimationDisabled) {
                        // Only animate if not design time and animation enabled
                        options.show = { opacity: 'toggle', duration: 'fast' };
                        options.hide = { opacity: 'toggle', duration: 'fast' };
                    }
                    rootSelector.find('.i-tab-container').tabs(options);
                };
                SyntaxTabsDocumentFeature.prototype.onMessage = function (message) {
                };
                ;
                SyntaxTabsDocumentFeature.prototype.initializeContentOrdinal = function () {
                    return 99;
                };
                return SyntaxTabsDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.SyntaxTabsDocumentFeature = SyntaxTabsDocumentFeature;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.SyntaxTabsDocumentFeatureFactory());
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var TabsDocumentFeatureFactory = (function () {
                function TabsDocumentFeatureFactory() {
                }
                TabsDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new TabsDocumentFeature(documentInstance);
                };
                return TabsDocumentFeatureFactory;
            }());
            Features.TabsDocumentFeatureFactory = TabsDocumentFeatureFactory;
            var TabsDocumentFeature = (function (_super) {
                __extends(TabsDocumentFeature, _super);
                function TabsDocumentFeature(documentInstance) {
                    _super.call(this, documentInstance);
                }
                TabsDocumentFeature.prototype.getName = function () {
                    return "Tabs";
                };
                TabsDocumentFeature.prototype.beforeSetElementVisibility = function (element, isVisible, isImmediate) {
                    if (!isVisible && element.tagName == 'LI' && $(element).parent().hasClass('ui-tabs-nav')) {
                        // If we are hiding a tab, make sure it isn't the selected tab
                        var selectedTabClassName = ($.ui.version < "1.8") ? "ui-tabs-selected" : "ui-tabs-active";
                        if ($(element).hasClass(selectedTabClassName)) {
                            var tabContainer = $($(element).parents(".i-tab-container").get(0));
                            var firstVisibleTab;
                            firstVisibleTab = tabContainer.find("li:visible:not(." + selectedTabClassName + "):first");
                            if (firstVisibleTab) {
                                if ($.ui.version < "1.8") {
                                    tabContainer.tabs("option", "selected", firstVisibleTab.index());
                                }
                                else {
                                    tabContainer.tabs("option", "active", firstVisibleTab.index());
                                }
                            }
                        }
                    }
                    return false;
                };
                TabsDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    if (location.href == "about:blank") {
                        // Ensure that all tabs references are treated as local at design time
                        $.widget("ui.tabs", $.ui.tabs, {
                            _isLocal: function (anchor) {
                                if (anchor.href.indexOf("#") != -1) {
                                    return true;
                                }
                                else {
                                    return this._super(anchor);
                                }
                            }
                        });
                    }
                };
                TabsDocumentFeature.prototype.afterSetElementVisibility = function (element, isVisible) {
                    var tabContainer = $($(element).parents(".i-tab-container").get(0));
                    if (tabContainer != null && tabContainer.data("ui-tabs") != null) {
                        tabContainer.tabs("refresh");
                    }
                };
                TabsDocumentFeature.prototype.initializeContentOrdinal = function () {
                    // Make sure we apply our design time fix for tabs before other features use the ui.tabs widget
                    return -1;
                };
                return TabsDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.TabsDocumentFeature = TabsDocumentFeature;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.TabsDocumentFeatureFactory());
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var ToggleSectionDocumentFeatureFactory = (function () {
                function ToggleSectionDocumentFeatureFactory() {
                }
                ToggleSectionDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new ToggleSectionDocumentFeature(documentInstance);
                };
                return ToggleSectionDocumentFeatureFactory;
            }());
            Features.ToggleSectionDocumentFeatureFactory = ToggleSectionDocumentFeatureFactory;
            var ToggleSectionDocumentFeature = (function (_super) {
                __extends(ToggleSectionDocumentFeature, _super);
                function ToggleSectionDocumentFeature(documentInstance) {
                    _super.call(this, documentInstance);
                }
                ToggleSectionDocumentFeature.prototype.getName = function () {
                    return "Toggle Sections";
                };
                /** The id value that is used to save/load state from local storage and to disambiguate event handlers. */
                ToggleSectionDocumentFeature.prototype.getToggleSetId = function () {
                    return "i-toggle-section";
                };
                /** Css class name of the section link to toggle all */
                ToggleSectionDocumentFeature.prototype.getToggleAllLinkClassName = function () {
                    return "i-toggle-all-sections";
                };
                /** Css class name of the section heading div */
                ToggleSectionDocumentFeature.prototype.getToggleHeadingClassName = function () {
                    return "i-section-heading";
                };
                /** Css class name of the section content div following each section heading */
                ToggleSectionDocumentFeature.prototype.getToggleContentClassName = function () {
                    return "i-section-content";
                };
                /** Css class name of the collapse all label */
                ToggleSectionDocumentFeature.prototype.getToggleAllLabelClassName = function () {
                    return "i-collapse-all";
                };
                /** Css class name of the expand all label */
                ToggleSectionDocumentFeature.prototype.getUnToggleAllLabelClassName = function () {
                    return "i-expand-all";
                };
                /** The suffix used for toggle class name and when saving toggle state */
                ToggleSectionDocumentFeature.prototype.getToggledSuffix = function () {
                    return "-collapsed";
                };
                /** Set to true to automatically save the toggle state between page loads */
                ToggleSectionDocumentFeature.prototype.isSaveStateEnabled = function () {
                    return true;
                };
                ToggleSectionDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    var _this = this;
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    // Wire up click handler for the "Expand All / Collapse All" link
                    var eventId = "click." + this.getToggleSetId();
                    rootSelector
                        .off(eventId, "." + this.getToggleAllLinkClassName())
                        .on(eventId, "." + this.getToggleAllLinkClassName(), function (eventObject) {
                        var desiredExpanded = !(rootSelector.find("." + _this.getToggleHeadingClassName() + "." + _this.getToggleHeadingClassName() + _this.getToggledSuffix()).length == 0);
                        rootSelector.find("." + _this.getToggleHeadingClassName()).each(function (index, element) {
                            var isExpanded = !$(element).hasClass(_this.getToggleHeadingClassName() + _this.getToggledSuffix());
                            if (isExpanded != desiredExpanded) {
                                _this.toggleSection($(element));
                            }
                        });
                        Content.Browser.stopPropagation(eventObject);
                    });
                    this.loadToggleSectionState(rootSelector.find("." + this.getToggleHeadingClassName()));
                    // Click Event handler
                    rootSelector
                        .off(eventId, "." + this.getToggleHeadingClassName())
                        .on(eventId, "." + this.getToggleHeadingClassName(), function (eventObject) {
                        _this.toggleSection($(eventObject.currentTarget));
                        Content.Browser.stopPropagation(eventObject);
                    });
                    // Set the initial state of the "Expand All" / "Collapse All" link
                    if (!Content.Browser.isDesignTime) {
                        this.setToggleAllSectionsVisibility();
                    }
                };
                ToggleSectionDocumentFeature.prototype.ensureElementVisible = function (element) {
                    var _this = this;
                    $(element).parents("." + this.getToggleContentClassName()).prev("." + this.getToggleHeadingClassName()).each(function (index, element) {
                        var isExpanded = !$(element).hasClass(_this.getToggleHeadingClassName() + _this.getToggledSuffix());
                        if (!isExpanded) {
                            _this.toggleSection($(element));
                        }
                    });
                };
                /**
                 * Toggle a given section or sections.
                 * @param elements The JQuery selector containing the element or elements to toggle.
                 * @param isImmediate When set to true, animations are disabled.
                 */
                ToggleSectionDocumentFeature.prototype.toggleSection = function (elements, isImmediate) {
                    var _this = this;
                    if (isImmediate === void 0) { isImmediate = false; }
                    var result = elements.each(function (index, element) {
                        var sectionDiv = $(element).next("." + _this.getToggleContentClassName());
                        if (sectionDiv) {
                            var isCurrentlyToggled = $(element).hasClass(_this.getToggleHeadingClassName() + _this.getToggledSuffix());
                            _this.toggleElement(sectionDiv, isImmediate);
                            $(element).toggleClass(_this.getToggleHeadingClassName() + _this.getToggledSuffix(), !isCurrentlyToggled);
                            if (_this.isSaveStateEnabled()) {
                                if (isCurrentlyToggled) {
                                    // No longer collapsed
                                    _this.documentInstance.getLocalStorage().setAttribute(_this.getToggleSetId() + _this.getToggledSuffix() + "-" + $(element).attr("id"), null);
                                }
                                else {
                                    // Is now collapsed
                                    _this.documentInstance.getLocalStorage().setAttribute(_this.getToggleSetId() + _this.getToggledSuffix() + "-" + $(element).attr("id"), "true");
                                }
                            }
                        }
                    });
                    this.updateToggleAllSectionsLinkLabel();
                    return result;
                };
                /**
                 * Executes the toggle function, allowing derived types to override the default method (slideToggle).
                 */
                ToggleSectionDocumentFeature.prototype.toggleElement = function (element, isImmediate) {
                    var isCurrentlyHidden = (element.css("display") == "none");
                    this.documentInstance.setElementVisibility(element, isCurrentlyHidden, isImmediate);
                };
                /**
                 * Load saved state of a toggle section or sections from local storage.
                 * @param elements JQuery selector representing Element(s) to load and set the toggle state for.
                 */
                ToggleSectionDocumentFeature.prototype.loadToggleSectionState = function (elements) {
                    var _this = this;
                    if (this.isSaveStateEnabled()) {
                        return elements.each(function (index, element) {
                            var attributeValue = _this.documentInstance.getLocalStorage().getAttribute(_this.getToggleSetId() + _this.getToggledSuffix() + "-" + $(element).attr('id'));
                            if (attributeValue == 'true') {
                                _this.toggleSection($(element), true);
                            }
                        });
                    }
                    else {
                        return elements;
                    }
                };
                /**
                 * Update the labels for the "Expand All" / "Collapse All" link
                 */
                ToggleSectionDocumentFeature.prototype.updateToggleAllSectionsLinkLabel = function () {
                    var rootSelector = this.documentInstance.rootSelector;
                    var allSectionsToggled = (rootSelector.find("." + this.getToggleHeadingClassName() + "." + this.getToggleHeadingClassName() + this.getToggledSuffix()).length == 0);
                    rootSelector.find("." + this.getToggleAllLabelClassName()).css('display', allSectionsToggled ? 'inline' : 'none');
                    rootSelector.find("." + this.getUnToggleAllLabelClassName()).css('display', allSectionsToggled ? 'none' : 'inline');
                };
                /**
                 * Set the visibility of the "Expand All" / "Collapse All" link depending on whether the page contains
                 *  at least one toggle section.
                 */
                ToggleSectionDocumentFeature.prototype.setToggleAllSectionsVisibility = function () {
                    var rootSelector = this.documentInstance.rootSelector;
                    if (rootSelector.find("." + this.getToggleHeadingClassName()).length > 0) {
                        // Sections - show
                        rootSelector.find("." + this.getToggleAllLinkClassName()).show();
                    }
                    else {
                        // No sections - hide
                        rootSelector.find("." + this.getToggleAllLinkClassName()).hide();
                    }
                };
                ToggleSectionDocumentFeature.prototype.populateResponsiveConfiguration = function (configuration) {
                    if (configuration.profileName == "mobile" || configuration.profileName == "tablet") {
                        switch (configuration.profileName) {
                            case "tablet":
                                break;
                            case "mobile":
                                // Headings as buttons
                                configuration.clickTargets.push(new Content.ResponsiveClickTarget("." + this.getToggleHeadingClassName(), Content.ResponsiveClickTargetKind.block));
                                break;
                        }
                    }
                };
                return ToggleSectionDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.ToggleSectionDocumentFeature = ToggleSectionDocumentFeature;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
$.fn.slideFadeToggle = function (speed, easing, callback) {
    return this.animate({ opacity: 'toggle', height: 'toggle' }, speed, easing, callback);
};
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.ToggleSectionDocumentFeatureFactory());
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var ToggleDropDownDocumentFeatureFactory = (function () {
                function ToggleDropDownDocumentFeatureFactory() {
                }
                ToggleDropDownDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new ToggleDropDownDocumentFeature(documentInstance);
                };
                return ToggleDropDownDocumentFeatureFactory;
            }());
            Features.ToggleDropDownDocumentFeatureFactory = ToggleDropDownDocumentFeatureFactory;
            var ToggleDropDownDocumentFeature = (function (_super) {
                __extends(ToggleDropDownDocumentFeature, _super);
                function ToggleDropDownDocumentFeature(documentInstance) {
                    _super.call(this, documentInstance);
                }
                ToggleDropDownDocumentFeature.prototype.getName = function () {
                    return "Drop Downs";
                };
                /** The id value that is used to save/load state from local storage and to disambiguate event handlers. */
                ToggleDropDownDocumentFeature.prototype.getToggleSetId = function () {
                    return "i-drop-downs";
                };
                /** Css class name of the section link to toggle all */
                ToggleDropDownDocumentFeature.prototype.getToggleAllLinkClassName = function () {
                    return "i-toggle-all-dropdowns";
                };
                /** Css class name of the section heading div */
                ToggleDropDownDocumentFeature.prototype.getToggleHeadingClassName = function () {
                    return "i-dropdown-heading";
                };
                /** Css class name of the section content div following each section heading */
                ToggleDropDownDocumentFeature.prototype.getToggleContentClassName = function () {
                    return "i-dropdown-content";
                };
                /** Css class name of the collapse all label */
                ToggleDropDownDocumentFeature.prototype.getToggleAllLabelClassName = function () {
                    return "i-show-all-dropdowns";
                };
                /** Css class name of the expand all label */
                ToggleDropDownDocumentFeature.prototype.getUnToggleAllLabelClassName = function () {
                    return "i-hide-all-dropdowns";
                };
                /** The suffix used for toggle class name and when saving toggle state */
                ToggleDropDownDocumentFeature.prototype.getToggledSuffix = function () {
                    return "-expanded";
                };
                /** Set to true to automatically save the toggle state between page loads */
                ToggleDropDownDocumentFeature.prototype.isSaveStateEnabled = function () {
                    return false;
                };
                ToggleDropDownDocumentFeature.prototype.toggleElement = function (element, isImmediate) {
                    if (isImmediate || Content.Browser.isAnimationDisabled) {
                        element.toggle();
                    }
                    else {
                        element.slideFadeToggle('fast');
                    }
                };
                ToggleDropDownDocumentFeature.prototype.populateResponsiveConfiguration = function (configuration) {
                    if (configuration.profileName == "mobile" || configuration.profileName == "tablet") {
                        switch (configuration.profileName) {
                            case "tablet":
                                break;
                            case "mobile":
                                break;
                        }
                        // Dropdown Header as a button
                        configuration.clickTargets.push(new Content.ResponsiveClickTarget("." + this.getToggleHeadingClassName() + ",." + this.getToggleAllLabelClassName() + ",." + this.getUnToggleAllLabelClassName(), Content.ResponsiveClickTargetKind.block));
                    }
                };
                return ToggleDropDownDocumentFeature;
            }(Features.ToggleSectionDocumentFeature));
            Features.ToggleDropDownDocumentFeature = ToggleDropDownDocumentFeature;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.ToggleDropDownDocumentFeatureFactory());
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var ViewInFrameDocumentFeatureFactory = (function () {
                function ViewInFrameDocumentFeatureFactory() {
                }
                ViewInFrameDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new ViewInFrameDocumentFeature(documentInstance);
                };
                return ViewInFrameDocumentFeatureFactory;
            }());
            Features.ViewInFrameDocumentFeatureFactory = ViewInFrameDocumentFeatureFactory;
            var ViewInFrameDocumentFeature = (function (_super) {
                __extends(ViewInFrameDocumentFeature, _super);
                function ViewInFrameDocumentFeature(documentInstance) {
                    _super.call(this, documentInstance);
                }
                ViewInFrameDocumentFeature.prototype.getName = function () {
                    return "View In Frame";
                };
                ViewInFrameDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    var link = $(".i-view-in-frame-link", rootSelector);
                    // Display / hide link to root page if running outside the navigation frame in web output
                    if (window.self !== window.top || location.protocol == "ms-its:") {
                        // Running in a frameset or CHM, hide the link
                        link.hide();
                    }
                    else {
                        // Not running in a navigation frame, set the link target to the web root page
                        // Get the current page name
                        var pageName = location.href.substring(location.href.lastIndexOf("/") + 1);
                        if (pageName.indexOf("#") != -1) {
                            pageName = pageName.substring(0, pageName.indexOf("#"));
                        }
                        // Append to root page name
                        var framePage = link.data("root-page") + "#" + pageName;
                        link.attr('href', framePage);
                        link.show();
                    }
                };
                ViewInFrameDocumentFeature.prototype.onMessage = function (message) {
                };
                ;
                return ViewInFrameDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.ViewInFrameDocumentFeature = ViewInFrameDocumentFeature;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.ViewInFrameDocumentFeatureFactory());
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var LightboxDocumentFeatureFactory = (function () {
                function LightboxDocumentFeatureFactory() {
                }
                LightboxDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new LightboxDocumentFeature(documentInstance);
                };
                return LightboxDocumentFeatureFactory;
            }());
            Features.LightboxDocumentFeatureFactory = LightboxDocumentFeatureFactory;
            var LightboxDocumentFeature = (function (_super) {
                __extends(LightboxDocumentFeature, _super);
                function LightboxDocumentFeature(documentInstance) {
                    _super.call(this, documentInstance);
                }
                LightboxDocumentFeature.prototype.getName = function () {
                    return "Lightbox";
                };
                LightboxDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    $("a.i-thumbnail").slimbox({}, null, function (el) {
                        return (this == el) || ((this.rel.length > 8) && (this.rel == el.rel));
                    });
                };
                LightboxDocumentFeature.prototype.applyResponsiveConfiguration = function (configuration) {
                    // Remove slimbox click handler in responsive mode
                    if (configuration.profileName == "mobile" || configuration.profileName == "tablet") {
                        $("i-thumbnail").off("click");
                    }
                };
                return LightboxDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.LightboxDocumentFeature = LightboxDocumentFeature;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.LightboxDocumentFeatureFactory());
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var VideoDocumentFeatureFactory = (function () {
                function VideoDocumentFeatureFactory() {
                }
                VideoDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new VideoDocumentFeature(documentInstance);
                };
                return VideoDocumentFeatureFactory;
            }());
            Features.VideoDocumentFeatureFactory = VideoDocumentFeatureFactory;
            var VideoDocumentFeature = (function (_super) {
                __extends(VideoDocumentFeature, _super);
                function VideoDocumentFeature(documentInstance) {
                    _super.call(this, documentInstance);
                }
                VideoDocumentFeature.prototype.getName = function () {
                    return "Video";
                };
                VideoDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    $(".i-video-youtube").each(function (index, containerElement) {
                        var container = $(containerElement);
                        var iframe = container.children("iframe");
                        var autoplay = (container.data("autoplay") == "True");
                        var autoresize = (container.data("autoresize") == "True");
                        var showrelated = (container.data("showrelated") == "True");
                        var theme = container.data("theme") || "";
                        var movieId = container.data("movieid");
                        var src = "http://www.youtube.com/embed/" + movieId + "?&theme=" + theme + "&autohide=1";
                        src += ("&autoplay=" + (autoplay ? "1" : "0"));
                        src += ("&rel=" + (showrelated ? "1" : "0"));
                        iframe.attr('src', src);
                        if (autoresize) {
                            var currentLocation = document.location + "";
                            if (Content.Browser.isDesignTime || currentLocation == "about:blank" || currentLocation.indexOf("ms-its:") == 0) {
                                // CHM or design time
                                iframe.attr('width', 64).attr('height', 39);
                            }
                            else {
                                iframe.attr('width', 64).attr('height', 36);
                            }
                            ;
                            container.fitVids();
                        }
                        else {
                            iframe.attr('width', parseInt("%%width%%")).attr('height', parseInt("%%height%%"));
                        }
                    });
                };
                return VideoDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.VideoDocumentFeature = VideoDocumentFeature;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.VideoDocumentFeatureFactory());

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
            var ContentFilterDocumentFeature = (function (_super) {
                __extends(ContentFilterDocumentFeature, _super);
                function ContentFilterDocumentFeature(documentInstance) {
                    _super.call(this, documentInstance);
                }
                ContentFilterDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    var _this = this;
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    // Initialize the language filtering check boxes
                    var eventId = "click.toggle";
                    var checkboxSelector = "." + this.getCheckboxClassName();
                    rootSelector
                        .off(eventId, checkboxSelector)
                        .on(eventId, checkboxSelector, function (eventObject) {
                        _this.toggleCheckbox($(eventObject.currentTarget));
                        Content.Browser.stopPropagation(eventObject);
                    });
                    this.loadToggleCheckboxState($(checkboxSelector));
                    this.updateFilterLabel();
                };
                /**
                 * Toggle the checked state of a checkbox or checkboxes.
                 * @param elements JQuery selector representing Element(s) to load and set the toggle state for.
                 * @param isImmediate When set to true, animations are disabled.
                 */
                ContentFilterDocumentFeature.prototype.toggleCheckbox = function (elements, isImmediate) {
                    var _this = this;
                    if (isImmediate === void 0) { isImmediate = false; }
                    elements.each(function (index, element) {
                        var isChecked = $(element).is(":checked");
                        if (!$(element).is(":checked")) {
                            _this.documentInstance.getLocalStorage().setAttribute('checkbox-unchecked-' + $(element).attr('id'), 'true');
                        }
                        else {
                            _this.documentInstance.getLocalStorage().setAttribute('checkbox-unchecked-' + $(element).attr('id'), null);
                        }
                        var toggleClassName = $(element).attr("data-toggleclass");
                        if (toggleClassName != null) {
                            _this.documentInstance.setElementVisibility($('.' + toggleClassName), isChecked, isImmediate);
                        }
                    });
                    this.updateFilterLabel();
                    return elements;
                };
                /**
                 * Load saved state of a Checkbox or Checkboxes from local storage.
                 * @param elements JQuery selector representing Element(s) to load and set the checkbox state for.
                 */
                ContentFilterDocumentFeature.prototype.loadToggleCheckboxState = function (elements) {
                    var _this = this;
                    return elements.each(function (index, element) {
                        var attributeValue = _this.documentInstance.getLocalStorage().getAttribute('checkbox-unchecked-' + $(element).attr('id'));
                        if (attributeValue == 'true') {
                            $(element).prop('checked', false);
                            _this.toggleCheckbox($(element), true);
                        }
                    });
                };
                /**
                 * Overriden in derived classes to return the class name (without leading ".") of the checkboxes associated with
                 *  this filter.
                 */
                ContentFilterDocumentFeature.prototype.getCheckboxClassName = function () {
                    return null;
                };
                /**
                 * Overriden by derived classes to update the label describing the current filter (where required).
                 */
                ContentFilterDocumentFeature.prototype.updateFilterLabel = function () {
                };
                return ContentFilterDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.ContentFilterDocumentFeature = ContentFilterDocumentFeature;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));

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
            var DesignTimeDocumentFeatureFactory = (function () {
                function DesignTimeDocumentFeatureFactory() {
                }
                DesignTimeDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    if (Content.Browser.isDesignTime) {
                        return new DesignTimeDocumentFeature(documentInstance);
                    }
                    return null;
                };
                return DesignTimeDocumentFeatureFactory;
            }());
            Features.DesignTimeDocumentFeatureFactory = DesignTimeDocumentFeatureFactory;
            var DesignTimeDocumentFeature = (function (_super) {
                __extends(DesignTimeDocumentFeature, _super);
                function DesignTimeDocumentFeature(documentInstance) {
                    _super.call(this, documentInstance);
                }
                DesignTimeDocumentFeature.prototype.getName = function () {
                    return "Design Time";
                };
                DesignTimeDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    var _this = this;
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    if (isInitialLoad == true) {
                        // Create design time interaction divs
                        $('<div/>', {
                            id: 'hsDesignTimeLoad',
                            click: function () {
                                var scrollPosition = _this.documentInstance.getLocalStorage().getAttribute('scrollPosition');
                                if (scrollPosition) {
                                    $(window).scrollTop(scrollPosition);
                                }
                            }
                        }).appendTo(rootSelector).css("display", "none");
                        $('<div/>', {
                            id: 'hsDesignTimeSave',
                            click: function () {
                                _this.documentInstance.getLocalStorage().setAttribute('scrollPosition', $(window).scrollTop());
                            }
                        }).appendTo(rootSelector).css("display", "none");
                        $('<div/>', {
                            id: 'i-design-time-initialize',
                            click: function (e) {
                                var newContentElement = $(document.getElementById($(e.currentTarget).data("element-id")));
                                _this.documentInstance.initializeContent(newContentElement, false);
                            }
                        }).appendTo(rootSelector).css('display', 'none');
                        // Disable animation at design time
                        Content.Browser.isAnimationDisabled = true;
                    }
                };
                return DesignTimeDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.DesignTimeDocumentFeature = DesignTimeDocumentFeature;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.DesignTimeDocumentFeatureFactory());

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
            var LanguageFilterDocumentFeatureFactory = (function () {
                function LanguageFilterDocumentFeatureFactory() {
                }
                LanguageFilterDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new LanguageFilterDocumentFeature(documentInstance);
                };
                return LanguageFilterDocumentFeatureFactory;
            }());
            Features.LanguageFilterDocumentFeatureFactory = LanguageFilterDocumentFeatureFactory;
            var LanguageFilterDocumentFeature = (function (_super) {
                __extends(LanguageFilterDocumentFeature, _super);
                function LanguageFilterDocumentFeature(documentInstance) {
                    _super.call(this, documentInstance);
                    this._linkSelector = ".i-language-filter";
                    this._allLabelSelector = "label.i-language-filter-all";
                    this._languageLabelSelectorPrefix = "label.i-language-filter-";
                    this._languageNameAttributeName = "data-languagename";
                    this._filteredContentClassNamePrefix = "i-filtered-content-";
                    this._toggleClassAttributeName = "data-toggleclass";
                }
                LanguageFilterDocumentFeature.prototype.getName = function () {
                    return "Language Filter";
                };
                LanguageFilterDocumentFeature.prototype.getCheckboxClassName = function () {
                    return "i-toggle-language-checkbox";
                };
                LanguageFilterDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    // Move VB and VBUsage to a common Syntax-VB div
                    var tabContainers = $(".i-tab-container", rootSelector);
                    tabContainers.each(function (index, element) {
                        var tabContainer = $(element);
                        if ($("a[href='#i-syntax-VBAll']", tabContainer).length > 0) {
                            $("<div>", { id: "i-syntax-VBAll", class: "i-code" })
                                .append($("#i-syntax-VB", tabContainer))
                                .append("&nbsp;")
                                .append($("#i-syntax-VBUsage", tabContainer))
                                .appendTo(tabContainer);
                        }
                    });
                    _super.prototype.initializeContent.call(this, rootSelector);
                };
                LanguageFilterDocumentFeature.prototype.toggleCheckbox = function (element, isImmediate) {
                    if (isImmediate === void 0) { isImmediate = false; }
                    var rootSelector = this.documentInstance.rootSelector;
                    // Base implementation shows/hides the related content
                    var result = _super.prototype.toggleCheckbox.call(this, element, isImmediate);
                    var isChecked = element.is(":checked");
                    var toggleClassName = element.attr(this._toggleClassAttributeName);
                    // Wrapper for toggleCheckBox that hides the consolidated VB section
                    //  if both VB and VBUsage are hidden
                    if (toggleClassName == this._filteredContentClassNamePrefix + "VBUsage"
                        || toggleClassName == this._filteredContentClassNamePrefix + "VB") {
                        var isVbChecked = rootSelector.find("." + this.getCheckboxClassName() + "[data-languagename='VB']").is(":checked");
                        var isVbUsageChecked = rootSelector.find("." + this.getCheckboxClassName() + "[data-languagename='VBUsage']").is(":checked");
                        if ((isChecked && !(isVbChecked && isVbUsageChecked))
                            || (!isChecked && !isVbChecked && !isVbUsageChecked)) {
                            this.documentInstance.setElementVisibility(rootSelector.find("." + this._filteredContentClassNamePrefix + "VBAll"), isChecked, isImmediate);
                        }
                    }
                    return result;
                };
                LanguageFilterDocumentFeature.prototype.updateFilterLabel = function () {
                    // Set caption of language filter to reflect current set
                    var targetLabel = null;
                    var allCheckboxes = $("." + this.getCheckboxClassName());
                    var allCheckedCheckboxes = allCheckboxes.filter(":checked");
                    var allLabels = $(this._linkSelector + " label");
                    if (allCheckedCheckboxes.length == allCheckboxes.length) {
                        // All languages	
                        targetLabel = $(this._linkSelector + " " + this._allLabelSelector);
                    }
                    else if (allCheckedCheckboxes.length == 0) {
                    }
                    else if (allCheckedCheckboxes.length == 1) {
                        // Single language
                        var languageName = allCheckedCheckboxes.attr(this._languageNameAttributeName);
                        targetLabel = $(this._linkSelector + " " + this._languageLabelSelectorPrefix + languageName
                            + "," + this._linkSelector + " .i-" + languageName + "-label");
                    }
                    else {
                        // Multiple languages
                        if (allCheckedCheckboxes.length == 2
                            && allCheckedCheckboxes.filter("[" + this._languageNameAttributeName + "^='VB']").length == 2) {
                            // 2 languages, both VB
                            targetLabel = $(this._linkSelector + " " + this._languageLabelSelectorPrefix + "vball");
                        }
                        else {
                            targetLabel = $(this._linkSelector + " " + this._languageLabelSelectorPrefix + "multiple");
                        }
                    }
                    allLabels.css("display", "none");
                    if (targetLabel != null) {
                        targetLabel.css("display", "inline");
                    }
                };
                return LanguageFilterDocumentFeature;
            }(Features.ContentFilterDocumentFeature));
            Features.LanguageFilterDocumentFeature = LanguageFilterDocumentFeature;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.LanguageFilterDocumentFeatureFactory());

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
            var MemberFilterDocumentFeatureFactory = (function () {
                function MemberFilterDocumentFeatureFactory() {
                }
                MemberFilterDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new MemberFilterDocumentFeature(documentInstance);
                };
                return MemberFilterDocumentFeatureFactory;
            }());
            Features.MemberFilterDocumentFeatureFactory = MemberFilterDocumentFeatureFactory;
            var MemberFilterDocumentFeature = (function (_super) {
                __extends(MemberFilterDocumentFeature, _super);
                function MemberFilterDocumentFeature(documentInstance) {
                    _super.call(this, documentInstance);
                }
                MemberFilterDocumentFeature.prototype.getName = function () {
                    return "Member Filter";
                };
                MemberFilterDocumentFeature.prototype.getCheckboxClassName = function () {
                    return "i-toggle-filter-checkbox";
                };
                MemberFilterDocumentFeature.prototype.updateFilterLabel = function () {
                    var rootSelector = this.documentInstance.rootSelector;
                    var isFiltered = !$('#i-inherited-checkbox').is(':checked') || !$('#i-protected-checkbox').is(':checked');
                    rootSelector.find('.i-members-all').css('display', isFiltered ? 'none' : 'inline');
                    rootSelector.find('.i-members-filtered').css('display', isFiltered ? 'inline' : 'none');
                };
                return MemberFilterDocumentFeature;
            }(Features.ContentFilterDocumentFeature));
            Features.MemberFilterDocumentFeature = MemberFilterDocumentFeature;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.MemberFilterDocumentFeatureFactory());

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
            var DxBaseDocumentFeature = (function (_super) {
                __extends(DxBaseDocumentFeature, _super);
                function DxBaseDocumentFeature(documentInstance) {
                    _super.call(this, documentInstance);
                }
                DxBaseDocumentFeature.prototype.populateResponsiveConfiguration = function (configuration) {
                    if (configuration.profileName == "mobile" || configuration.profileName == "tablet") {
                        switch (configuration.profileName) {
                            case "tablet":
                                configuration.clickTargets.push(new Content.ResponsiveClickTarget(".i-section-content>a:last-child", Content.ResponsiveClickTargetKind.block));
                                break;
                            case "mobile":
                                break;
                        }
                    }
                };
                return DxBaseDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.DxBaseDocumentFeature = DxBaseDocumentFeature;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));

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
            var DxWebServiceDocumentFeatureFactory = (function () {
                function DxWebServiceDocumentFeatureFactory() {
                }
                DxWebServiceDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new DxWebServiceDocumentFeature(documentInstance);
                };
                return DxWebServiceDocumentFeatureFactory;
            }());
            Features.DxWebServiceDocumentFeatureFactory = DxWebServiceDocumentFeatureFactory;
            var DxWebServiceDocumentFeature = (function (_super) {
                __extends(DxWebServiceDocumentFeature, _super);
                function DxWebServiceDocumentFeature(documentInstance) {
                    _super.call(this, documentInstance);
                }
                DxWebServiceDocumentFeature.prototype.getName = function () {
                    return "dx-webservice";
                };
                DxWebServiceDocumentFeature.prototype.populateResponsiveConfiguration = function (configuration) {
                    _super.prototype.populateResponsiveConfiguration.call(this, configuration);
                    if (configuration.profileName == "mobile" || configuration.profileName == "tablet") {
                        switch (configuration.profileName) {
                            case "tablet":
                                break;
                            case "mobile":
                                break;
                        }
                        configuration.clickTargets.push(new Content.ResponsiveClickTarget(".i-item-summary a", Content.ResponsiveClickTargetKind.inline));
                    }
                };
                DxWebServiceDocumentFeature.prototype.applyResponsiveConfiguration = function (configuration) {
                    if (configuration.profileName == "mobile" || configuration.profileName == "tablet") {
                        switch (configuration.profileName) {
                            case "tablet":
                                break;
                            case "mobile":
                                break;
                        }
                    }
                };
                return DxWebServiceDocumentFeature;
            }(Features.DxBaseDocumentFeature));
            Features.DxWebServiceDocumentFeature = DxWebServiceDocumentFeature;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.DxWebServiceDocumentFeatureFactory());

//# sourceMappingURL=innovasys.dx.webservice.js.map
