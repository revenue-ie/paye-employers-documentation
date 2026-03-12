// Copyright (c) 2023 - 2025 Contiem. Ltd. All rights reserved.
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/* eslint @typescript-eslint/no-unused-vars: "off" */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var browserInfoConstants = {
            minHeightChange: 10,
            ie7Version: 7
        };
        var BrowserInfo = /** @class */ (function () {
            function BrowserInfo() {
                var ua = BrowserInfo.getUserAgent().toLowerCase();
                var match = /(chrome)[ /]([\w.]+)/.exec(ua) ||
                    /(webkit)[ /]([\w.]+)/.exec(ua) ||
                    /(opera)(?:.*version|)[ /]([\w.]+)/.exec(ua) ||
                    /(msie) ([\w.]+)/.exec(ua) ||
                    ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
                    [];
                this.name = match[1] || "";
                var versionIndex = 2;
                this.version = parseInt(match[versionIndex] || "0", 10);
            }
            /**
             * Returns the current user agent string
             */
            BrowserInfo.getUserAgent = function () {
                return navigator.userAgent;
            };
            return BrowserInfo;
        }());
        Content.BrowserInfo = BrowserInfo;
        var Browser = /** @class */ (function () {
            function Browser() {
            }
            /**
             * Return Microsoft Internet Explorer (major) version number, or 0 for others.
             */
            Browser.msIeVersion = function () {
                if (Browser.info.name === "msie") {
                    // is Microsoft Internet Explorer; return version number
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
                var elementSelector;
                if (!(element instanceof jQuery)) {
                    elementSelector = $(element);
                }
                else {
                    elementSelector = element;
                }
                // Find the container element
                var root = elementSelector.hasClass("content-root") ? elementSelector : elementSelector.parents(".content-root");
                if (root.length === 0) {
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
                    var newDocument = new Content.Document(root.get(0));
                    root.data("innovasys-document", newDocument);
                    return newDocument;
                }
            };
            /**
             * Returns basic information about the current browser location.
             */
            Browser.getLocationInfo = function () {
                return location;
            };
            /**
             * Return the current document compatMode value.
             */
            Browser.getCompatMode = function () {
                return document.compatMode;
            };
            /**
             * Reload the current page.
             */
            Browser.reload = function () {
                location.reload();
            };
            /**
             * Replace the current location.
             */
            Browser.replaceLocation = function (newLocation) {
                if (window.history.replaceState) {
                    try {
                        window.history.replaceState("", "", "#".concat(newLocation));
                    }
                    catch (ex) {
                        // May fail with security exception on local file system
                    }
                }
                else {
                    window.location.replace("#".concat(newLocation));
                }
            };
            /**
             * Navigate to a new url.
             * @param url The url to navigate to.
             * @param replace Pass true in order to replace the current entry in the browser history.
             */
            Browser.navigateTo = function (url, replace) {
                if (replace) {
                    window.location.replace(url);
                }
                else {
                    window.location.href = url;
                }
            };
            /**
             * Cross browser helper for stopping event propagation.
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
                var id = "file".concat(this.dynamicallyLoadedFileIndex);
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
                var id = "file".concat(this.dynamicallyLoadedFileIndex);
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
                var minAllowedHeight;
                try {
                    minAllowedHeight = $(window.top).height();
                }
                catch (ex) {
                    minAllowedHeight = $(window).height();
                }
                $("iframe", selector).each(function (index, element) {
                    var currentHeight = 0;
                    if ($(element).is(":visible") && (ignoreOffScreen || $(element).offset().left >= 0)) {
                        // Only resize if visible
                        var doc = null;
                        try {
                            doc = element.contentDocument
                                ? element.contentDocument
                                : (element.contentWindow.document || element.document);
                        }
                        catch (exDocument) {
                            // Security may prevent access if frame hasn't loaded or is cross origin
                        }
                        if (doc != null) {
                            // Firefox throws an error here, so we trap and fallback
                            try {
                                currentHeight = $(doc).height();
                            }
                            catch (exHeight) {
                                currentHeight = minAllowedHeight;
                            }
                        }
                        else {
                            currentHeight = minAllowedHeight;
                        }
                        var lastHeight = $(element).data("last-height");
                        if (!lastHeight) {
                            lastHeight = 0;
                        }
                        var heightDifference = currentHeight - lastHeight;
                        if (heightDifference > browserInfoConstants.minHeightChange
                            || (heightDifference < 0 && heightDifference < browserInfoConstants.minHeightChange)) {
                            var parent_1 = $(element).parent();
                            if (parent_1.get(0).tagName === "DIV" && currentHeight < parent_1.height()) {
                                // Resize to at least the containing DIV height
                                currentHeight = parent_1.height();
                            }
                            if (currentHeight < minAllowedHeight) {
                                // Make sure at least as high as the window
                                currentHeight = minAllowedHeight;
                            }
                            $(element).height("".concat(currentHeight, "px"));
                            $(element).data("last-height", currentHeight);
                        }
                    }
                    else if (!$(element).is(":visible")) {
                        // Not visible, collapse to zero
                        $(element).height(0);
                        $(element).data("last-height", 0);
                    }
                    if (currentHeight > maxHeight) {
                        // Record the maximum iframe height
                        maxHeight = currentHeight;
                    }
                });
                var busy = $("#i-busy");
                if (busy.length !== 0) {
                    busy.height(maxHeight);
                }
                return maxHeight;
            };
            Browser.showElement = function (query, tagName) {
                // Firefox does not remove a display: none on show so we check for that specifically here
                query.show();
                if (tagName === "body") {
                    $("body").css("display", "block");
                }
            };
            /**
             * Works around a jQuery setAttribute bug for a specific IE mode used by MSHV and Help 2.x (with IE11 installed)
             */
            Browser.checkForIe7ModeJqueryBug = function () {
                if (Browser.info.name === "msie" && Browser.info.version <= browserInfoConstants.ie7Version) {
                    var mshvAttributeSetWorkaround = {
                        set: function (elem, value, name) {
                            elem.setAttribute(name, value);
                            return elem.getAttributeNode(name);
                        }
                    };
                    if ($ != null && $.attrHooks != null) {
                        var attributeHooks = $.attrHooks;
                        attributeHooks["aria-describedby"] = mshvAttributeSetWorkaround;
                        attributeHooks["aria-live"] = mshvAttributeSetWorkaround;
                        attributeHooks["aria-atomic"] = mshvAttributeSetWorkaround;
                        attributeHooks["aria-hidden"] = mshvAttributeSetWorkaround;
                    }
                }
            };
            Browser.getQueryStringParameter = function (name) {
                name = name.replace(/[[]/, "\\[").replace(/[\]]/, "\\]");
                var regex = new RegExp("[\\?&]".concat(name, "=([^&#]*)"));
                var results = regex.exec(Browser.getLocationInfo().search);
                return results == null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
            };
            Browser.isCompiledHelp = function () {
                var currentHref = "".concat(Browser.getLocationInfo().href, ".");
                var currentProtocol = Browser.getLocationInfo().protocol;
                if (currentHref.indexOf("mk:@MSITStore") === 0) {
                    return true;
                }
                else if (currentHref.indexOf("ms-its:") === 0) {
                    return true;
                }
                else if (currentProtocol === "ms-help:") {
                    return true;
                }
                else if (currentProtocol === "ms-xhelp:" ||
                    currentHref.indexOf("ms.help?") !== -1 ||
                    currentHref.indexOf("?method=page&") !== -1) {
                    return true;
                }
                return false;
            };
            Browser.isEditor = function () {
                return location.protocol === "about:";
            };
            /**
             * Returns a unique id, randomnly generated and checked for uniqueness in the DOM
             */
            Browser.getUniqueId = function () {
                var idlength = 10;
                var getId = function () {
                    var idValue = "";
                    for (var i = 0; i < idlength; i++) {
                        idValue += Browser._idCharacters[Math.floor(Math.random() * Browser._idCharacters.length)];
                    }
                    return idValue;
                };
                var id = getId();
                while ($("#".concat(id)).length > 0) {
                    id = getId();
                }
                return id;
            };
            /**
             * Returns common feature settings
             */
            Browser.getCommonSettings = function () {
                return (Innovasys.overrides || Innovasys.settings) || {};
            };
            /**
             * Compares 2 version strings and returns an integer indicating the result. < 0 if a < b, > 0 if a > b, 0 if a = b
             */
            Browser.compareVersionStrings = function (a, b) {
                var regExStrip0 = /(\.0+)+$/;
                var segmentsA = a.replace(regExStrip0, "").split(".");
                var segmentsB = b.replace(regExStrip0, "").split(".");
                var l = Math.min(segmentsA.length, segmentsB.length);
                for (var i = 0; i < l; i++) {
                    var diff = parseInt(segmentsA[i], 10) - parseInt(segmentsB[i], 10);
                    if (diff) {
                        return diff;
                    }
                }
                return segmentsA.length - segmentsB.length;
            };
            /**
             * Creates or returns a <style> element to contain custom style markup
             */
            Browser.getDynamicStyleContainer = function (id) {
                var $dynamicStyleElement = $("#".concat(id));
                if ($dynamicStyleElement.length === 0) {
                    $dynamicStyleElement = $("<style type=\"text/css\" id=\"".concat(id, "\"></style>"));
                    $("head").append($dynamicStyleElement);
                }
                return $dynamicStyleElement;
            };
            Browser.isElementInView = function (element, fullyInView) {
                if (element == null) {
                    return false;
                }
                if (!$(element).is(":visible")) {
                    return false;
                }
                var pageTop = $(window).scrollTop();
                var pageBottom = pageTop + $(window).height();
                var elementTop = $(element).offset().top;
                var elementBottom = elementTop + $(element).height();
                if (fullyInView) {
                    return ((pageTop < elementTop) && (pageBottom > elementBottom));
                }
                else {
                    return ((elementTop <= pageBottom) && (elementBottom >= pageTop));
                }
            };
            /** Indicates that we are running in a design time environment (i.e. the editor) */
            Browser.isDesignTime = false;
            /** Indicates that animations should be disabled */
            Browser.isAnimationDisabled = false;
            Browser.isAutoResponsive = false;
            /** Provides access to more information about the browser agent etc. */
            Browser.info = new BrowserInfo();
            /** Index for dynamically loaded stylesheets */
            Browser.dynamicallyLoadedFileIndex = 0;
            Browser._idCharacters = "_0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".split("");
            return Browser;
        }());
        Content.Browser = Browser;
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
/* eslint @typescript-eslint/no-explicit-any: "off" */
var overrides = (Innovasys.overrides || Innovasys.settings);
if (document.compatMode !== "BackCompat"
    || !(location.protocol === "ms-xhelp:"
        || location.href.indexOf("ms.help?") !== -1
        || location.href.indexOf("?method=page&") !== -1)) {
    if (overrides == null || !overrides.isHideBodyDuringLoadDisabled) {
        // Prevent flickering by setting body to display:none during initialization
        document.write("<style type=\"text/css\">body{display:none;}</style>");
    }
    else if (overrides.isOverflowClippedDuringLoad) {
        // Prevent adding of a vertical scrollbar during load
        document.write("<style type=\"text/css\">body{overflow-y:hidden;}</style>");
    }
}
/* eslint @typescript-eslint/no-unused-vars: "off" */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        /**
         * Encapsulates a left and top position.
         */
        var ElementPosition = /** @class */ (function () {
            /* eslint-disable-next-line no-useless-constructor */
            function ElementPosition(left, top) {
                this.left = left;
                this.top = top;
            }
            return ElementPosition;
        }());
        Content.ElementPosition = ElementPosition;
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var DomHelpers = /** @class */ (function () {
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
                    var MSIE_4_VERSION = 4;
                    // Allow for the scrolling body region in IE
                    if (Content.Browser.msIeVersion() > MSIE_4_VERSION) {
                        offsetLeft += (element.offsetLeft - element.scrollLeft);
                        offsetTop += (element.offsetTop - element.scrollTop);
                    }
                    else {
                        offsetLeft += element.offsetLeft;
                        offsetTop += element.offsetTop;
                    }
                    element = element.offsetParent;
                }
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                var leftMargin = document.body.leftMargin;
                if (Content.BrowserInfo.getUserAgent().indexOf("Mac") !== -1
                    && typeof leftMargin !== "undefined") {
                    offsetLeft += leftMargin;
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    offsetTop += document.body.topMargin;
                }
                return new Content.ElementPosition(offsetLeft, offsetTop);
            };
            /**
             * Returns the text from the containing table. Uses this as the context element from which to find the containing table.
             */
            DomHelpers.getTextFromContainingTable = function (element) {
                var parentTableQuery = $(element)
                    .parents("table")
                    .get(0);
                var parentTable = $(parentTableQuery);
                var tableCell = parentTable.find("td").get(0);
                var preCell = $(tableCell).find("pre");
                var elemsToUse = [];
                if (preCell && preCell.length > 0) {
                    elemsToUse = preCell.toArray();
                }
                else {
                    elemsToUse.push(tableCell);
                }
                var textResult = "";
                for (var index = 0; index < elemsToUse.length; ++index) {
                    var elemTmp = elemsToUse[index];
                    if (elemTmp != null) {
                        if (elemTmp.textContent != null) {
                            textResult += elemTmp.textContent;
                        }
                        else if (elemTmp.innerText != null) {
                            textResult += elemTmp.innerText;
                        }
                        else {
                            textResult += $(elemTmp).text();
                        }
                    }
                }
                return textResult;
            };
            return DomHelpers;
        }());
        Content.DomHelpers = DomHelpers;
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
/* .NET Framework Help Topic Resolution */
var getCurrentHelp2Namespace = function () {
    var namespace = "";
    var location = Innovasys.Content.Browser.getLocationInfo();
    if (location.protocol === "ms-help:") {
        namespace = location.hostname;
        var URL_PREFIX_LENGTH = 2;
        if (namespace.substring(0, URL_PREFIX_LENGTH) === "//") {
            namespace = namespace.substring(URL_PREFIX_LENGTH);
        }
    }
    return namespace;
};
var findHelp2Keyword = function (namespaceName, keyword) {
    if (namespaceName.length > 0) {
        try {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            var session = new ActiveXObject("HxDs.HxSession");
            session.Initialize("ms-help://".concat(namespaceName), 0);
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            var topics = session.Query(keyword, "!DefaultAssociativeIndex", 0, "");
            if (topics.Count > 0) {
                return topics(1).URL;
            }
        }
        catch (e) {
            //
        }
    }
    return "";
};
// This function is Copyright 2006 Innovasys Limited. No reproduction or usage
//  allowed other than in documentation generated by licensed Innovasys products
var resolveHelp2Keyword = function (keyword, onlineKeyword) {
    var url = "";
    try {
        // Try the current namespace
        url = findHelp2Keyword(getCurrentHelp2Namespace(), keyword);
        if (url === "") {
            // Try the likely namespaces first, most recent first
            url = findHelp2Keyword("MS.VSCC.v80", keyword);
            if (url === "") {
                url = findHelp2Keyword("MS.VSCC.2003", keyword);
                if (url === "") {
                    url = findHelp2Keyword("MS.VSCC", keyword);
                }
            }
        }
        // URL found in one of the known VSCC namespaces
        if (url !== "") {
            return url;
        }
        else {
            // For future proofing, try other VSCC namespaces
            var registryWalker = new ActiveXObject("HxDs.HxRegistryWalker");
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            var namespaces = registryWalker.RegisteredNamespaceList("MS.VSCC");
            if (namespaces.Count > 0) {
                for (var n = 1; n <= namespaces.Count; n++) {
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    var namespace = namespaces.Item(n);
                    var namespaceName = namespace.Name;
                    var PREFIX_LENGTH = 7;
                    if (namespaceName.substring(0, PREFIX_LENGTH) === "MS.VSCC") {
                        switch (namespaceName) {
                            case "MS.VSCC.v80":
                                break;
                            case "MS.VSCC.2003":
                                break;
                            case "MS.VSCC":
                                break;
                            default:
                                url = findHelp2Keyword(namespaceName, "");
                                if (url !== "") {
                                    return url;
                                }
                        }
                    }
                }
            }
        }
    }
    catch (e) {
        //
    }
    // No match found in any applicable namespace
    // Msdn doesn't support links to individual overloads, only to the master page
    //  so we trim off the brackets when directing to Msdn
    var bracketPosition = onlineKeyword.indexOf("(");
    if (bracketPosition !== -1) {
        onlineKeyword = onlineKeyword.substring(0, bracketPosition);
    }
    var keywordForUrl = onlineKeyword.replace("`", "-").toLowerCase();
    return "https://docs.microsoft.com/dotnet/api/".concat(keywordForUrl);
};
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var navigateToHelp2Keyword = function (keyword, onlineKeyword, replacePage) {
    window.status = "Resolving link. Please wait a moment...";
    var url = resolveHelp2Keyword(keyword, onlineKeyword);
    window.status = "";
    var MSDN_PREFIX_LENGTH = 25;
    var DOCS_PREFIX_LENGTH = 26;
    if ((url.substring(0, MSDN_PREFIX_LENGTH) === "http://msdn.microsoft.com"
        || url.substring(0, DOCS_PREFIX_LENGTH) === "https://docs.microsoft.com") &&
        window.parent != null) {
        // MSDN no longer support hosting in an IFRAME so open in new browser window
        var win = window.open('about:blank', '_blank');
        urlExistsInnov(url, function () { win.location.href = url; }, function () {
            var parentUrl = url.substring(0, url.lastIndexOf("."));
            urlExistsInnov(parentUrl, function () { win.location.href = parentUrl; }, function () { win.location.href = url; });
        });
    }
    else if (replacePage) {
        location.replace(url);
    }
    else {
        location.href = url;
    }
};
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var urlExistsInnov = function (url, successCallBack, notfoundCallBack) {
    $.ajax({
        url: url,
        dataType: "jsonp",
        statusCode: {
            200: function (response) {
                successCallBack();
            },
            404: function (response) {
                notfoundCallBack();
            }
        }
    });
};
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        /**
         * Wrapper for handling load/save to localstorage. Handles the difference in functionality when executing at design time
         *  and in a CHM.
         */
        var LocalStorageHandler = /** @class */ (function () {
            function LocalStorageHandler(attributePrefix) {
                if (attributePrefix === void 0) { attributePrefix = ""; }
                this.attributePrefix = attributePrefix;
                this.storageMethod = "native";
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                this.cookieData = null;
                this.storageElement = null;
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                var windowLocalStorage;
                try {
                    // Edge throws an exception when querying localStorage in local file system output
                    windowLocalStorage = window.localStorage;
                }
                catch (e) {
                    //
                }
                if (!windowLocalStorage) {
                    if (location.protocol === "ms-its:") {
                        // Cookies don't work in CHM so we use userdata behavior instead
                        this.storageMethod = "userdata";
                        var storageElement = $("<link />");
                        storageElement.css("behavior", "url(#default#userdata)");
                        storageElement.appendTo("body");
                        this.storageElement = storageElement.get(0);
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        this.storageElement.load("localStorage");
                    }
                    else {
                        // If local storage isn't available, fall back to cookie storage
                        this.storageMethod = "cookie";
                        var cookieValue = Cookies.get("localStorage");
                        if (cookieValue) {
                            this.cookieData = JSON.parse(cookieValue);
                        }
                        else {
                            this.cookieData = {};
                        }
                    }
                }
            }
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            LocalStorageHandler.prototype.load = function (name) {
                // local storage automatically saves
            };
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            LocalStorageHandler.prototype.save = function (name) {
                // local storage automatically saves
            };
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            LocalStorageHandler.prototype.setAttribute = function (key, value) {
                if (this.attributePrefix != null) {
                    key = this.attributePrefix + key;
                }
                if (this.storageMethod === "native") {
                    if (value == null || typeof value === "undefined") {
                        window.localStorage.removeItem(key);
                    }
                    else {
                        window.localStorage.setItem(key, value);
                    }
                }
                else if (this.storageMethod === "cookie") {
                    if (value == null) {
                        this.cookieData[key] = null;
                    }
                    else {
                        this.cookieData[key] = "".concat(value);
                    }
                    Cookies.set("localStorage", JSON.stringify(this.cookieData), { expires: 365, path: "/", domain: "" });
                }
                else if (this.storageMethod === "userdata") {
                    this.storageElement.setAttribute(key, "".concat(value));
                    // Save method is added by the userdata behavior
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    this.storageElement.save("localStorage");
                }
            };
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            LocalStorageHandler.prototype.getAttribute = function (key) {
                if (this.attributePrefix != null) {
                    key = this.attributePrefix + key;
                }
                if (this.storageMethod === "native") {
                    return window.localStorage.getItem(key);
                }
                else if (this.storageMethod === "cookie") {
                    if (typeof this.cookieData[key] === "undefined") {
                        return null;
                    }
                    else {
                        return this.cookieData[key];
                    }
                }
                else if (this.storageMethod === "userdata") {
                    return this.storageElement.getAttribute(key);
                }
            };
            return LocalStorageHandler;
        }());
        Content.LocalStorageHandler = LocalStorageHandler;
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        /**
         * A message object, used for cross frame communication.
         */
        var WindowMessage = /** @class */ (function () {
            /* eslint-disable-next-line no-useless-constructor */
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
        var Messaging = /** @class */ (function () {
            function Messaging() {
            }
            /**
             * Returns true if PostMessage support is available in the current browser.
             */
            Messaging.isPostMessageEnabled = function () {
                return (window.postMessage != null);
            };
            /**
             * Registers to receive message events incoming to the current window.
             * @param receiver The receiving event handler.
             */
            Messaging.addMessageListener = function (receiver) {
                if (Messaging.isPostMessageEnabled()) {
                    if (window.addEventListener) {
                        window.addEventListener("message", receiver, false);
                    }
                    else {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
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
                    if (window.addEventListener) {
                        window.removeEventListener("message", receiver, false);
                    }
                    else {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        window.detachEvent("onmessage", receiver);
                    }
                }
            };
            /**
             * Gets a WindowMessage object from string message data.
             * @param data The string containing the message data (format MessageType|MessageData).
             */
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            Messaging.getMessageFromData = function (data) {
                var separator = data.indexOf("|");
                var messageType;
                var messageData;
                if (separator !== -1) {
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
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                if (element != null && element.contentWindow != null) {
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    Messaging.routeMessageToWindow(element.contentWindow, messageType, messageData);
                }
            };
            Messaging.routeMessageToWindow = function (window, messageType, messageData) {
                if (window != null && self !== window) {
                    if (window != null && window.postMessage != null) {
                        window.postMessage("".concat(messageType, "|").concat(messageData), "*");
                    }
                }
            };
            Messaging.routeMessageToParentFrame = function (messageType, messageData) {
                if (parent != null && self !== parent) {
                    this.routeMessageToWindow(parent, messageType, messageData);
                }
            };
            return Messaging;
        }());
        Content.Messaging = Messaging;
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var ResponsiveClickTargetKind;
        (function (ResponsiveClickTargetKind) {
            ResponsiveClickTargetKind[ResponsiveClickTargetKind["auto"] = 0] = "auto";
            ResponsiveClickTargetKind[ResponsiveClickTargetKind["inline"] = 1] = "inline";
            ResponsiveClickTargetKind[ResponsiveClickTargetKind["block"] = 2] = "block";
        })(ResponsiveClickTargetKind = Content.ResponsiveClickTargetKind || (Content.ResponsiveClickTargetKind = {}));
        var DocumentFeatureBase = /** @class */ (function () {
            /* eslint-disable-next-line no-useless-constructor */
            function DocumentFeatureBase(documentInstance) {
                if (documentInstance === void 0) { documentInstance = null; }
                this.documentInstance = documentInstance;
            }
            DocumentFeatureBase.prototype.initializeDocument = function () {
                //
            };
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            DocumentFeatureBase.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                //
            };
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            DocumentFeatureBase.prototype.onMessage = function (message) {
                //
            };
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            DocumentFeatureBase.prototype.ensureElementVisible = function (element) {
                //
            };
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            DocumentFeatureBase.prototype.beforeSetElementVisibility = function (element, isVisible, isImmediate) {
                return false;
            };
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            DocumentFeatureBase.prototype.afterSetElementVisibility = function (element, isVisible) {
                //
            };
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            DocumentFeatureBase.prototype.populateResponsiveConfiguration = function (configuration) {
                //
            };
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            DocumentFeatureBase.prototype.applyResponsiveConfiguration = function (configuration) {
                //
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
        var DocumentFeatureConfiguration = /** @class */ (function () {
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
        var ResponsiveConfiguration = /** @class */ (function () {
            /* eslint-disable-next-line no-useless-constructor */
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
        var ResponsiveClickTarget = /** @class */ (function () {
            /* eslint-disable-next-line no-useless-constructor */
            function ResponsiveClickTarget(className, kind) {
                this.className = className;
                this.kind = kind;
            }
            return ResponsiveClickTarget;
        }());
        Content.ResponsiveClickTarget = ResponsiveClickTarget;
        var ResponsiveTable = /** @class */ (function () {
            /* eslint-disable-next-line no-useless-constructor */
            function ResponsiveTable(selector, onAfterPivot) {
                if (onAfterPivot === void 0) { onAfterPivot = null; }
                this.selector = selector;
                this.onAfterPivot = onAfterPivot;
            }
            return ResponsiveTable;
        }());
        Content.ResponsiveTable = ResponsiveTable;
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
/* Userdata support in CHMs requires pages are loaded under the ms-its protocol and not mk:@MSITStore */
var currentLocation = "".concat(location.href, ".");
var mkPrefix = "mk:@MSITStore";
if (currentLocation.indexOf(mkPrefix) === 0) {
    var restOfUrl = currentLocation.substring(mkPrefix.length + 1, currentLocation.length - 1);
    var newLocation = "ms-its:".concat(restOfUrl);
    location.replace(newLocation);
}
/* eslint @typescript-eslint/no-unused-vars: "off" */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Document = /** @class */ (function () {
            function Document(rootElement, id) {
                if (id === void 0) { id = ""; }
                var _this = this;
                /** Indicates if this document instance has been unloaded */
                this._isUnloaded = true;
                /** Provides an id that can be used to disambiguate this document if it is loaded in a parent document */
                this.id = "";
                this.id = id;
                this.rootElement = rootElement;
                this.rootSelector = $(rootElement);
                this._featureSettings = {};
                this.setBodyVisibleAfterLoadComplete = true;
                this.isNew = false;
                this.isResponsiveEnabled = false;
                this.isContentDocument = true;
                this.rootSelector.data("innovasys-document", this);
                // Create the features instances according to configuration. Some factories may return null if the feature
                //  is not required for this document.
                this._features = $.map(Content.DocumentFeatureConfiguration.getFeatureFactories(), function (factory) { return factory.createInstance(_this); });
                // Initialize the features.
                $.each(this._features, function (index, feature) {
                    feature.initializeDocument();
                });
                if (Content.Browser.isDesignTime) {
                    $("body").addClass("i-designtime");
                }
                if (Content.Browser.isEditor()) {
                    $("body").addClass("i-editor");
                }
            }
            /**
             * Get a local storage instance, initializing the first time it is called.
             */
            Document.prototype.getLocalStorage = function () {
                if (Content.Browser.isDesignTime) {
                    try {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        if (window.external.IsInnovasysDesigner) {
                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            this._localStorageInstance = window.external;
                        }
                    }
                    catch (e) {
                        //
                    }
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
                var overrides = Content.Browser.getCommonSettings();
                if (overrides.isNew) {
                    this.isNew = true;
                }
                // If running in a frame, set up a message listener and let
                //  the parent frame know we have loaded
                if (this.id === "") {
                    // Running in a frame - listen for commands
                    if (Content.Messaging.isPostMessageEnabled()) {
                        this._windowMessageEventListener = function (ev) { return _this.receiveMessage(ev); };
                        Content.Messaging.addMessageListener(this._windowMessageEventListener);
                        if (this.isContentDocument) {
                            // Notify the parent frame that we have loaded, and give it our page title
                            Content.Messaging.routeMessageToParentFrame("loaded", location.href);
                            Content.Messaging.routeMessageToParentFrame("updatePageTitle", document.title);
                        }
                    }
                }
                // Add a class to the body that indicates that kind of navigation we are using
                if (overrides.navigationKind !== "inpage") {
                    $("body").addClass("i-navigation-frames");
                }
                else {
                    $("body").addClass("i-navigation-inpage");
                }
                // Configure our document content for each of the features
                this.initializeContent(this.rootSelector, true);
                if (this.id === "" && this.setBodyVisibleAfterLoadComplete) {
                    // Resume rendering updates after loading complete
                    this.setBodyVisible();
                }
            };
            Document.prototype.setBodyVisible = function () {
                $("html").addClass("i-loaded");
                Content.Browser.showElement($("body"), "body");
                setTimeout(function () {
                    if (Content.Browser.getCommonSettings().isOverflowClippedDuringLoad) {
                        $("body").css("overflow-y", "auto");
                    }
                    $(".i-busy-overlay").hide();
                }, 1);
            };
            Document.prototype.unload = function () {
                if (this.id === "") {
                    // Running in a frame - remove message listener
                    if (Content.Messaging.isPostMessageEnabled() && this._windowMessageEventListener != null) {
                        Content.Messaging.removeMessageListener(this._windowMessageEventListener);
                    }
                }
                this._isUnloaded = true;
            };
            /**
             * Initializes new DOM content, either on page load or subsequently when new content is created.
             */
            Document.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                if (isInitialLoad === void 0) { isInitialLoad = false; }
                $.each(this._features.sort(function (a, b) { return a.initializeContentOrdinal() - b.initializeContentOrdinal(); }), function (_, feature) {
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
                var message;
                try {
                    message = Content.Messaging.getMessageFromData(event.data);
                }
                catch (ex) {
                    // Catch exceptions that can fire at design time
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
                    $.each(_this._features, function (_, feature) {
                        if (!cancelDefault) {
                            if (feature.beforeSetElementVisibility(element, isVisible, isImmediate) === true) {
                                cancelDefault = true;
                            }
                        }
                    });
                    if (!cancelDefault) {
                        if ($(element).css("display") !== "none" !== isVisible) {
                            if ($(element).css("display") === "none") {
                                if (isImmediate || Content.Browser.isAnimationDisabled) {
                                    // Element is currently not visible - make it visible
                                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                    var originalDisplay = $(element).data("i-original-display");
                                    if (originalDisplay != null) {
                                        $(element).css("display", originalDisplay);
                                        $(element).data("i-original-display", null);
                                    }
                                    else {
                                        if (element.tagName === "TR") {
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
                        $.each(_this._features, function (_, feature) {
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
            Document.prototype.getFeatureSettings = function (name, getBaseSettings) {
                if (name == null) {
                    return null;
                }
                if (this._featureSettings[name] != null) {
                    return this._featureSettings[name];
                }
                else {
                    var baseSettings = getBaseSettings != null ? getBaseSettings() : {};
                    var newSettings = void 0;
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    var defaults = Innovasys.overrides || Innovasys.settings;
                    var defaultSettings = defaults == null ? null : defaults[name.toLowerCase()];
                    if (defaultSettings != null) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        newSettings = __assign(__assign({}, baseSettings), defaultSettings);
                    }
                    else {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        newSettings = __assign({}, baseSettings);
                    }
                    this._featureSettings[name] = newSettings;
                    return newSettings;
                }
            };
            return Document;
        }());
        Content.Document = Document;
        var DocumentMessageNames = /** @class */ (function () {
            function DocumentMessageNames() {
            }
            DocumentMessageNames.quickSearch = "quickSearch";
            DocumentMessageNames.resetQuickSearch = "resetQuickSearch";
            DocumentMessageNames.insertNavigationHeader = "insertNavigationHeader";
            DocumentMessageNames.searchHighlightComplete = "searchHighlightComplete";
            return DocumentMessageNames;
        }());
        Content.DocumentMessageNames = DocumentMessageNames;
        var RootMessageNames = /** @class */ (function () {
            function RootMessageNames() {
            }
            RootMessageNames.navigate = "navigate";
            RootMessageNames.openNavigationPane = "openNavigationPane";
            return RootMessageNames;
        }());
        Content.RootMessageNames = RootMessageNames;
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var INNOVASYS_PREFIX_LENGTH = 2;
            var ResponsiveDocumentFeature = /** @class */ (function (_super) {
                __extends(ResponsiveDocumentFeature, _super);
                function ResponsiveDocumentFeature() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this._pendingResponsiveFiles = [];
                    _this._configuration = null;
                    return _this;
                }
                ResponsiveDocumentFeature.pivotTable = function (table) {
                    var sourceTable = $(table);
                    var container = $("<div class=\"i-pivot-table-container\"></div>");
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    var labels = {};
                    var pivotColumnIndex = sourceTable
                        .find("tr")
                        .children("td.i-pivot-column, th.i-pivot-column")
                        .first()
                        .index();
                    // No column found to pivot on so just return here
                    if (pivotColumnIndex === -1) {
                        return null;
                    }
                    // Get the labels for each new row in the new table for the first row in the source table
                    sourceTable
                        .find("tr:first-child")
                        .children("td, th")
                        .each(function (index, cell) {
                        labels[index.toString()] = $(cell).text();
                    });
                    sourceTable.find("tr").each(function (index, row) {
                        if (index > 0) {
                            var newTable_1 = $("<table class=\"i-pivot-table i-section-content\"></table>");
                            var header_1;
                            $(row)
                                .children("td")
                                .each(function (cellIndex, cell) {
                                if (cellIndex === pivotColumnIndex) {
                                    header_1 = $("<div class=\"i-section-heading\"><span class=\"btn\">".concat($(cell).text(), "</span></div>"));
                                }
                                else {
                                    // Add a new row for each column in the source table
                                    var newRow = $("<tr><td>".concat(labels[cellIndex.toString()], "</td></tr>"));
                                    $(cell)
                                        .clone()
                                        .appendTo(newRow);
                                    newRow.find("td a").addClass("btn btn-mini btn-xs");
                                    newRow.appendTo(newTable_1);
                                }
                            });
                            if (header_1 != null) {
                                header_1.appendTo(container);
                            }
                            newTable_1.appendTo(container);
                        }
                    });
                    return container;
                };
                ResponsiveDocumentFeature.prototype.getName = function () {
                    return "Responsive";
                };
                ResponsiveDocumentFeature.prototype.getFeatureSettings = function () {
                    return this.documentInstance.getFeatureSettings("responsive", this.getDefaultFeatureSettings);
                };
                ResponsiveDocumentFeature.prototype.getDefaultFeatureSettings = function () {
                    return {
                        isEnabled: false,
                        displayMode: null
                    };
                };
                ResponsiveDocumentFeature.prototype.checkPendingResponsiveFilesLoad = function (loadedId) {
                    this._pendingResponsiveFiles = $.map(this._pendingResponsiveFiles, function (item) {
                        if (item === loadedId) {
                            // This item now loaded, exclude from pending array
                            return null;
                        }
                        else {
                            return item;
                        }
                    });
                    if (this._pendingResponsiveFiles.length === 0) {
                        // All loaded
                        this.onResponsiveFilesLoaded();
                    }
                };
                ResponsiveDocumentFeature.prototype.isEnabled = function () {
                    return this.documentInstance.isResponsiveEnabled || this.getFeatureSettings().isEnabled;
                };
                ResponsiveDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    var _this = this;
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    if (isInitialLoad) {
                        var deviceType_1 = this.getDeviceType().toLowerCase();
                        // Gather the responsive configuration
                        var configuration = this.documentInstance.getResponsiveConfiguration(deviceType_1);
                        if (this.isEnabled()) {
                            switch (deviceType_1) {
                                case "mobile":
                                    $(".i-hidden-mobile, .i-visible-tablet, .i-visible-desktop").css("display", "none");
                                    break;
                                case "tablet":
                                    $(".i-hidden-tablet, .i-visible-mobile, .i-visible-desktop").css("display", "none");
                                    break;
                                case "desktop":
                                    $(".i-hidden-desktop, .i-visible-mobile, .i-visible-tablet").css("display", "none");
                                    break;
                                // No default
                            }
                            if (deviceType_1 !== "desktop") {
                                // Find and add any stylesheets with data-responsive-{profileName} attributes
                                $("link[data-responsive-".concat(deviceType_1, "]")).each(function (index, stylesheet) {
                                    var responsiveStylesheets = $(stylesheet).attr("data-responsive-".concat(deviceType_1));
                                    if (responsiveStylesheets != null) {
                                        // Defer setting body visible while we wait for our custom stylesheet to load
                                        _this.documentInstance.setBodyVisibleAfterLoadComplete = false;
                                        $.each(responsiveStylesheets.split(","), function (_, url) {
                                            // Give the stylesheet a link so we can remove it later if the responsive style changes
                                            _this._pendingResponsiveFiles.push(Content.Browser.loadStylesheet(url, "data-responsive-".concat(deviceType_1), "responsive-marker", function (stylesheetId) {
                                                _this.checkPendingResponsiveFilesLoad(stylesheetId);
                                            }));
                                        });
                                    }
                                });
                                // Find any stylesheet references stored in css/responsive script tags
                                $("script[type='i-url-container/css']").each(function (index, scriptElement) {
                                    var scriptContainer = $(scriptElement);
                                    var displayModes = scriptContainer.data("responsive-display-modes");
                                    if (displayModes != null && displayModes.toLowerCase().indexOf(deviceType_1) !== -1) {
                                        var url = $.trim(scriptContainer.html());
                                        _this.documentInstance.setBodyVisibleAfterLoadComplete = false;
                                        // Give the stylesheet a link so we can remove it later if the responsive style changes
                                        _this._pendingResponsiveFiles.push(Content.Browser.loadStylesheet(url, "data-responsive-".concat(deviceType_1), "responsive-marker", function (stylesheetId) {
                                            _this.checkPendingResponsiveFilesLoad(stylesheetId);
                                        }));
                                    }
                                });
                                // Find any script references stored in css/responsive script tags
                                $("script[type='i-url-container/script']").each(function (index, scriptElement) {
                                    var scriptContainer = $(scriptElement);
                                    var displayModes = scriptContainer.data("responsive-display-modes");
                                    if (displayModes != null && displayModes.toLowerCase().indexOf(deviceType_1) !== -1) {
                                        var url = $.trim(scriptContainer.html());
                                        _this.documentInstance.setBodyVisibleAfterLoadComplete = false;
                                        // Give the stylesheet a link so we can remove it later if the responsive style changes
                                        _this._pendingResponsiveFiles.push(Content.Browser.loadScript(url, "data-responsive-".concat(deviceType_1), "responsive-marker", function (scriptId) {
                                            _this.checkPendingResponsiveFilesLoad(scriptId);
                                        }));
                                    }
                                });
                            }
                            if (configuration.profileName === "mobile" || configuration.profileName === "tablet") {
                                switch (configuration.profileName) {
                                    case "mobile":
                                        configuration.clickTargets.push(new Content.ResponsiveClickTarget(".i-link>a,"
                                            + ".i-member-link a", Content.ResponsiveClickTargetKind.block));
                                        configuration.clickTargets.push(new Content.ResponsiveClickTarget("#i-actions-content .i-page-link,"
                                            + "#i-actions-content .i-popup-link,"
                                            + "#i-actions-content .i-function-link", Content.ResponsiveClickTargetKind.inline));
                                        break;
                                    case "tablet":
                                        configuration.clickTargets.push(new Content.ResponsiveClickTarget(".i-breadcrumbs-container a,"
                                            + "#i-after-header-content .i-page-link,"
                                            + "#i-after-header-content .i-popup-link,"
                                            + "#i-after-header-content .i-function-link,"
                                            + "#i-actions-content .i-page-link,"
                                            + "#i-actions-content .i-popup-link,"
                                            + "#i-actions-content .i-function-link", Content.ResponsiveClickTargetKind.inline));
                                        configuration.clickTargets.push(new Content.ResponsiveClickTarget("a[href='#top']", Content.ResponsiveClickTargetKind.block));
                                        break;
                                    // No default
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
                        if (this._pendingResponsiveFiles.length === 0) {
                            // No pending files, immediately apply
                            this.onResponsiveFilesLoaded();
                        }
                    }
                };
                ResponsiveDocumentFeature.prototype.initializeContentOrdinal = function () {
                    var CONTENT_ORDINAL = 999;
                    return CONTENT_ORDINAL;
                };
                ResponsiveDocumentFeature.prototype.applyResponsiveConfiguration = function (configuration) {
                    var _this = this;
                    // Apply the custom click targets
                    $.each(configuration.clickTargets, function (_, clickTarget) {
                        _this.applyClickTarget(clickTarget);
                    });
                    // Pivot tables
                    $.each(configuration.tablesToPivot, function (_tableIndex, responsiveTable) {
                        $(responsiveTable.selector).each(function (_elementIndex, table) {
                            var pivotDiv = ResponsiveDocumentFeature.pivotTable(table);
                            if (pivotDiv != null) {
                                if (responsiveTable.onAfterPivot != null) {
                                    responsiveTable.onAfterPivot($(table), pivotDiv);
                                }
                                else {
                                    $(table).replaceWith(pivotDiv);
                                }
                            }
                        });
                    });
                    // Wire up any responsive switches
                    $(".i-responsive-switch")
                        .off("click.responsive")
                        .on("click.responsive", function (eventObject) {
                        var displayMode = $(eventObject.currentTarget).data("i-responsive-mode");
                        if (displayMode !== "") {
                            _this.setForcedDisplayMode(displayMode);
                            Content.Browser.reload();
                        }
                    });
                    $(".i-responsive-select")
                        .val(configuration.profileName)
                        .off("change.responsive")
                        .on("change.responsive", function (eventObject) {
                        var selectedValue = $(eventObject.currentTarget).val();
                        if (selectedValue !== "") {
                            _this.setForcedDisplayMode(selectedValue);
                            Content.Browser.reload();
                        }
                    });
                };
                ResponsiveDocumentFeature.prototype.onMessage = function (message) {
                    if (message) {
                        switch (message.messageType) {
                            case Content.DocumentMessageNames.insertNavigationHeader:
                                this.insertNavigationHeader();
                                break;
                            case Content.DocumentMessageNames.searchHighlightComplete:
                                $("a#i-remove-highlighting").css("display", "inline");
                                break;
                            // No default
                        }
                    }
                };
                ResponsiveDocumentFeature.prototype.insertNavigationHeader = function () {
                    var _this = this;
                    if ($("body > div.navigation-header").length === 0) {
                        var header = $("<div class=\"i-navigation-header\"><div class=\"i-inner-container\"></div></div>");
                        var innercontainer = header.find(".i-inner-container").first();
                        $("<a href=\"#\" id=\"i-nav-previous\"><i class=\"icon-arrow-left\"/></a>")
                            .appendTo(innercontainer);
                        $("<a href=\"#\" id=\"i-nav-index\"><i class=\"icon-list\"/></a>")
                            .appendTo(innercontainer);
                        $("<a href=\"#\" id=\"i-nav-toc\"><i class=\"icon-book\"/></a>")
                            .appendTo(innercontainer);
                        $("<a href=\"#\" id=\"i-nav-search\"><i class=\"icon-search\"/></a>")
                            .appendTo(innercontainer);
                        $("<a href=\"#\" id=\"i-nav-next\"><i class=\"icon-arrow-right\"/></a>")
                            .appendTo(innercontainer);
                        $("<a href=\"#\" id=\"i-remove-highlighting\" class=\"btn-warning\"><i class=\"icon-remove icon-white\"></i></a>")
                            .appendTo(innercontainer);
                        if ($(".i-search-highlight").length) {
                            // Highlighted search items have been added to the body so show the remove highlights button
                            innercontainer.children("#i-remove-highlighting").css("display", "inline");
                        }
                        innercontainer.children("a")
                            .off("click.responsive")
                            .on("click.responsive", function (eventObject) {
                            var webframe = window.parent;
                            if (typeof webframe != "undefined") {
                                switch ($(eventObject.currentTarget).attr("id")) {
                                    case "i-nav-previous":
                                        Content.Messaging.routeMessageToParentFrame(Content.RootMessageNames.navigate, "previous");
                                        break;
                                    case "i-nav-next":
                                        Content.Messaging.routeMessageToParentFrame(Content.RootMessageNames.navigate, "next");
                                        break;
                                    case "i-nav-index":
                                    case "i-nav-toc":
                                    case "i-nav-search":
                                        var paneId = $(eventObject.currentTarget).attr("id");
                                        if (paneId.substring(0, INNOVASYS_PREFIX_LENGTH) === "i-") {
                                            paneId = paneId.substring(INNOVASYS_PREFIX_LENGTH);
                                        }
                                        Content.Messaging.routeMessageToParentFrame(Content.RootMessageNames.openNavigationPane, paneId);
                                        break;
                                    case "i-remove-highlighting":
                                        // Instruct search highlighting to remove any existing highlights
                                        _this.documentInstance.processWindowMessage(new Content.WindowMessage(Content.DocumentMessageNames.resetQuickSearch, null));
                                        break;
                                    // No default
                                }
                            }
                        });
                        header.prependTo($("body"));
                        if ($("html").data("responsive-load-complete") === true) {
                            // Async load of responsive files already complete so make the body visible
                            this.documentInstance.setBodyVisible();
                            $("html").data("responsive-load-complete", null);
                        }
                    }
                };
                ResponsiveDocumentFeature.prototype.applyClickTarget = function (clickTarget) {
                    var buttonClassName = (clickTarget.kind === Content.ResponsiveClickTargetKind.inline) ? "btn btn-mini btn-xs" : "btn";
                    $(clickTarget.className).addClass(buttonClassName);
                };
                ResponsiveDocumentFeature.prototype.getDeviceType = function () {
                    if (!this.isEnabled()) {
                        // Responsive disabled - always desktop
                        return "DESKTOP";
                    }
                    var forcedDisplayMode = this.getForcedDisplayMode();
                    if (forcedDisplayMode != null) {
                        return forcedDisplayMode;
                    }
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
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
                    else if (navigator.userAgent.indexOf("Windows Phone OS") !== -1) {
                        // Specific check for windows phone as Modernizr returns false for the touch property
                        return "MOBILE";
                    }
                    return "DESKTOP";
                };
                /**
                 * Returns any forced display mode set by the containing frame.
                 */
                ResponsiveDocumentFeature.prototype.getForcedDisplayMode = function () {
                    var overrides = Content.Browser.getCommonSettings();
                    if (typeof overrides.forcedDisplayMode != "undefined"
                        && overrides.forcedDisplayMode != null) {
                        return overrides.forcedDisplayMode;
                    }
                    if (this.getFeatureSettings().displayMode != null) {
                        return this.getFeatureSettings().displayMode;
                    }
                    var location = Content.Browser.getLocationInfo();
                    if (location.hash === "#ForceDisplayDesktop") {
                        return "DESKTOP";
                    }
                    else if (location.hash === "#ForceDisplayMobile") {
                        return "MOBILE";
                    }
                    else if (location.hash === "#ForceDisplayTablet") {
                        return "TABLET";
                    }
                    // Only check local storage here if we are in a frame - the parent frame sets the local storage
                    // value for overriding the default behavior so we only need to check it if we are actually running
                    // in a frame
                    var currentPath = location.pathname.substring(0, location.pathname.lastIndexOf("/"));
                    var responsiveStorageId = "innovasys-responsive-".concat(currentPath.replace(/[^a-zA-Z0-9_\-]/g, ""));
                    if (this.documentInstance.getLocalStorage().getAttribute(responsiveStorageId) != null) {
                        return this.documentInstance.getLocalStorage().getAttribute(responsiveStorageId);
                    }
                    return null;
                };
                /**
                 * Forces a specific responsive display mode when the document loads. The forced display mode is set in local storage
                 *  so will be used by all subsequent page loads until it is reset.
                 */
                ResponsiveDocumentFeature.prototype.setForcedDisplayMode = function (displayMode) {
                    var location = Content.Browser.getLocationInfo();
                    var currentPath = location.pathname.substring(0, location.pathname.lastIndexOf("/"));
                    var responsiveStorageId = "innovasys-responsive-".concat(currentPath.replace(/[^a-zA-Z0-9_\-]/g, ""));
                    this.documentInstance.getLocalStorage().setAttribute(responsiveStorageId, displayMode);
                };
                /**
                 * Called after responsive setup completes.
                 */
                ResponsiveDocumentFeature.prototype.onResponsiveFilesLoaded = function () {
                    var overrides = Content.Browser.getCommonSettings();
                    this.documentInstance.applyResponsiveConfiguration(this._configuration);
                    if (this._configuration.profileName !== "desktop") {
                        if (!this.documentInstance.isContentDocument
                            || overrides.navigationKind === "inpage"
                            || $("body > div.i-navigation-header").length !== 0) {
                            // Navigation header already loaded, or not a content document or a page with
                            //  inpage navigation so make the body visible;
                            this.documentInstance.setBodyVisible();
                        }
                        else {
                            // Navigation header not loaded yet, add a flag here so that when the header has finished loaded it will make
                            //  the body visible
                            $("html").data("responsive-load-complete", true);
                        }
                    }
                    $("html").addClass("i-responsive-".concat(this._configuration.profileName));
                };
                return ResponsiveDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.ResponsiveDocumentFeature = ResponsiveDocumentFeature;
            var ResponsiveDocumentFeatureFactory = /** @class */ (function () {
                function ResponsiveDocumentFeatureFactory() {
                }
                ResponsiveDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new ResponsiveDocumentFeature(documentInstance);
                };
                return ResponsiveDocumentFeatureFactory;
            }());
            Features.ResponsiveDocumentFeatureFactory = ResponsiveDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.ResponsiveDocumentFeatureFactory());
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var FixedToTopDocumentFeature = /** @class */ (function (_super) {
                __extends(FixedToTopDocumentFeature, _super);
                function FixedToTopDocumentFeature() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.isPinned = false;
                    return _this;
                }
                FixedToTopDocumentFeature.prototype.getName = function () {
                    return "Fixed to Top";
                };
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                FixedToTopDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    var _this = this;
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    if ($(".i-fixed-to-top").length > 0) {
                        var scrollEventId = "scroll.fixed-to-top";
                        var resizeEventId = "resize.fixed-to-top";
                        setTimeout(function () { return _this.refresh(); }, 1);
                        $(window)
                            .off(scrollEventId)
                            .on(scrollEventId, function () { return _this.refresh(); })
                            .off(resizeEventId)
                            .on(resizeEventId, function () { return _this.refresh(); });
                    }
                };
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                FixedToTopDocumentFeature.prototype.applyResponsiveConfiguration = function (configuration) {
                    var _this = this;
                    setTimeout(function () { return _this.refresh(); }, 1);
                };
                FixedToTopDocumentFeature.prototype.refresh = function () {
                    var bodyTop = this.getBodyContentPosition();
                    var $fixedToTop = $(".i-fixed-to-top");
                    var scrollTop = $(window).scrollTop();
                    var isPinnedNewValue = (scrollTop > bodyTop);
                    if (this.isPinned !== isPinnedNewValue) {
                        this.isPinned = isPinnedNewValue;
                        $fixedToTop.toggleClass("i-is-fixed", isPinnedNewValue);
                        if (this.isPinned) {
                            $fixedToTop.css("top", "0");
                        }
                    }
                    if (!this.isPinned) {
                        var topValue = bodyTop - scrollTop;
                        $(".i-fixed-to-top").css("top", topValue > 0 ? "".concat(topValue, "px") : "");
                    }
                };
                FixedToTopDocumentFeature.prototype.getBodyContentPosition = function () {
                    var bodyContentPosition = $("#i-body-content-container", this.rootSelector).position();
                    if (bodyContentPosition != null) {
                        return bodyContentPosition.top;
                    }
                };
                return FixedToTopDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.FixedToTopDocumentFeature = FixedToTopDocumentFeature;
            var FixedToTopDocumentFeatureFactory = /** @class */ (function () {
                function FixedToTopDocumentFeatureFactory() {
                }
                FixedToTopDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new FixedToTopDocumentFeature(documentInstance);
                };
                return FixedToTopDocumentFeatureFactory;
            }());
            Features.FixedToTopDocumentFeatureFactory = FixedToTopDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.FixedToTopDocumentFeatureFactory());
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var ThemeDocumentFeature = /** @class */ (function (_super) {
                __extends(ThemeDocumentFeature, _super);
                function ThemeDocumentFeature() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ThemeDocumentFeature.prototype.getName = function () {
                    return "Theme";
                };
                ThemeDocumentFeature.prototype.getDefaultSettings = function () {
                    return {
                        defaultThemeOption: null,
                        isThemeSelectionEnabled: false
                    };
                };
                ThemeDocumentFeature.prototype.getFeatureSettings = function () {
                    return this.documentInstance.getFeatureSettings("theme", this.getDefaultSettings);
                };
                /* eslint @typescript-eslint/no-unused-vars: "off" */
                ThemeDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    var _this = this;
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    this._rootSelector = rootSelector;
                    var settings = this.getFeatureSettings();
                    if (settings.isThemeSelectionEnabled) {
                        $(".i-theme-select", rootSelector)
                            .off("change.theme")
                            .on("change.theme", function (eventObject) {
                            var themeName = $(eventObject.currentTarget).data("theme-name");
                            var stylesheetUrl = $(eventObject.currentTarget).val();
                            var themeOption = $("option[value='".concat(stylesheetUrl, "']"), $(eventObject.currentTarget)).data("theme-option");
                            _this.onThemeSelected(themeName, themeOption, stylesheetUrl, true);
                        });
                    }
                    $(".i-theme-select", rootSelector).each(function (index, element) {
                        var $element = $(element);
                        var themeName = $element.data("theme-name");
                        if (themeName != null) {
                            var themeOptionToApply = _this.documentInstance.getLocalStorage()
                                .getAttribute("i-theme-".concat(themeName));
                            if (themeOptionToApply == null) {
                                themeOptionToApply = settings.defaultThemeOption;
                            }
                            if (themeOptionToApply != null) {
                                var themeOption = $("option[data-theme-option='".concat(themeOptionToApply, "']"), $element);
                                if (themeOption.length > 0) {
                                    $element.val(themeOption.val());
                                    _this.onThemeSelected(themeName, themeOptionToApply, themeOption.val(), false);
                                }
                            }
                        }
                    });
                    if (!settings.isThemeSelectionEnabled) {
                        $(".i-theme-selection-container").hide();
                    }
                    else {
                        $(".i-theme-selection-container").show();
                    }
                };
                ThemeDocumentFeature.prototype.onThemeSelected = function (themeName, themeValue, stylesheetUrl, saveSelection) {
                    // Remove any existing theme stylesheets
                    var existingStylesheets = $("link[data-theme-name='".concat(themeName, "']"));
                    existingStylesheets.remove();
                    // Add the new one (if not "none")
                    if (stylesheetUrl !== "none") {
                        $("head").append("<link rel=\"stylesheet\" href=\"".concat(stylesheetUrl, "\" type=\"text/css\" data-theme-name=\"").concat(themeName, "\" />"));
                    }
                    // Add a class to the root
                    $(".i-theme-select option", this._rootSelector).each(function (index, element) {
                        var optionValue = $(element).data("theme-option");
                        $("html").toggleClass("i-theme-".concat(themeName, "-").concat(optionValue), optionValue === themeValue);
                    });
                    if (saveSelection) {
                        // Save as the current preference
                        this.documentInstance.getLocalStorage().setAttribute("i-theme-".concat(themeName), themeValue);
                    }
                };
                return ThemeDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.ThemeDocumentFeature = ThemeDocumentFeature;
            var ThemeDocumentFeatureFactory = /** @class */ (function () {
                function ThemeDocumentFeatureFactory() {
                }
                ThemeDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new ThemeDocumentFeature(documentInstance);
                };
                return ThemeDocumentFeatureFactory;
            }());
            Features.ThemeDocumentFeatureFactory = ThemeDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.ThemeDocumentFeatureFactory());
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var DynamicStylesDocumentFeature = /** @class */ (function (_super) {
                __extends(DynamicStylesDocumentFeature, _super);
                function DynamicStylesDocumentFeature() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this._addedStyles = { dynamicWordBreak: null };
                    return _this;
                }
                DynamicStylesDocumentFeature.prototype.getName = function () {
                    return "DynamicStyles";
                };
                DynamicStylesDocumentFeature.prototype.getDefaultSettings = function () {
                    return {
                        isDynamicWordWrapEnabled: false,
                        isDynamicWordWrapUpdateOnResizeEnabled: true
                    };
                };
                DynamicStylesDocumentFeature.prototype.getFeatureSettings = function () {
                    return this.documentInstance.getFeatureSettings("dynamicstyles", this.getDefaultSettings);
                };
                DynamicStylesDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    var _this = this;
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    if (isInitialLoad) {
                        this._rootSelector = rootSelector;
                    }
                    var settings = this.getFeatureSettings();
                    if (!settings.isDynamicWordWrapEnabled) {
                        return;
                    }
                    // No dynamic styles in compiled help or at design time
                    if (!Content.Browser.isCompiledHelp() && !Content.Browser.isDesignTime) {
                        var $bodyContent = $("#i-body-content", this._rootSelector);
                        if ($bodyContent.length > 0) {
                            setTimeout(function () {
                                _this.updateDynamicWordBreak();
                            });
                            if (settings.isDynamicWordWrapUpdateOnResizeEnabled) {
                                $(window).off("resize.dynamicstyles")
                                    .on("resize.dynamicstyles", function () {
                                    _this.updateDynamicWordBreak();
                                });
                            }
                        }
                    }
                };
                DynamicStylesDocumentFeature.prototype.updateDynamicWordBreak = function () {
                    var styleId = "i-dynamic-word-break";
                    var $bodyContent = $("#i-body-content", this._rootSelector);
                    var bodyContent = $bodyContent.get(0);
                    if (this._addedStyles.dynamicWordBreak != null) {
                        // Style already added. If the current width is > applied width, remove and re-evaluate
                        if (bodyContent.offsetWidth > this._addedStyles.dynamicWordBreak) {
                            $("#".concat(styleId)).remove();
                            this._addedStyles.dynamicWordBreak = null;
                        }
                        else {
                            return;
                        }
                    }
                    if (bodyContent.offsetWidth < bodyContent.scrollWidth
                        && ($("table", $bodyContent).length > 0)) {
                        this._addedStyles.dynamicWordBreak = bodyContent.offsetWidth;
                        var $dynamicStylesElement = Content.Browser.getDynamicStyleContainer(styleId);
                        $dynamicStylesElement.html("td {word-break: break-all;}");
                    }
                };
                return DynamicStylesDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.DynamicStylesDocumentFeature = DynamicStylesDocumentFeature;
            var DynamicStylesDocumentFeatureFactory = /** @class */ (function () {
                function DynamicStylesDocumentFeatureFactory() {
                }
                DynamicStylesDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new DynamicStylesDocumentFeature(documentInstance);
                };
                return DynamicStylesDocumentFeatureFactory;
            }());
            Features.DynamicStylesDocumentFeatureFactory = DynamicStylesDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.DynamicStylesDocumentFeatureFactory());
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var DarkModeDocumentFeature = /** @class */ (function (_super) {
                __extends(DarkModeDocumentFeature, _super);
                function DarkModeDocumentFeature() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this._optimalColors = {};
                    return _this;
                }
                DarkModeDocumentFeature.prototype.findReadableColorOnDarkBackground = function (color) {
                    if (this._optimalColors[color.toHex8String()]) {
                        return this._optimalColors[color.toHex8String()];
                    }
                    var maximumLightening = 100;
                    var lighteningIncrement = 1;
                    var resolvedColor;
                    for (var i = 1; i < maximumLightening; i += lighteningIncrement) {
                        var possibleColor = color.clone().lighten(i);
                        if (tinycolor.isReadable(possibleColor, "#333")) {
                            resolvedColor = possibleColor;
                            break;
                        }
                    }
                    if (resolvedColor == null) {
                        resolvedColor = tinycolor("#ccc");
                    }
                    this._optimalColors[color.toHex8String()] = resolvedColor;
                    return resolvedColor;
                };
                DarkModeDocumentFeature.prototype.getName = function () {
                    return "DarkMode";
                };
                DarkModeDocumentFeature.prototype.getDefaultSettings = function () {
                    return {
                        isEnabled: false,
                        isAlwaysDarkMode: false
                    };
                };
                DarkModeDocumentFeature.prototype.getFeatureSettings = function () {
                    return this.documentInstance.getFeatureSettings("darkmode", this.getDefaultSettings);
                };
                DarkModeDocumentFeature.prototype.initializeDocument = function () {
                    var _this = this;
                    var settings = this.getFeatureSettings();
                    if (settings.isEnabled) {
                        if (settings.isAlwaysDarkMode) {
                            $("html").addClass("i-dark");
                        }
                        else {
                            if (window.matchMedia) {
                                var matchMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
                                var matchMediaListener = function (queryList, isAddDarkModificationsDisabled) {
                                    if (isAddDarkModificationsDisabled === void 0) { isAddDarkModificationsDisabled = false; }
                                    if (queryList.matches) {
                                        $("html").addClass("i-dark");
                                        if (!isAddDarkModificationsDisabled) {
                                            _this.addDarkModifications();
                                        }
                                    }
                                    else {
                                        if ($("html").hasClass("i-dark")) {
                                            _this.removeDarkModifications();
                                            $("html").removeClass("i-dark");
                                        }
                                    }
                                };
                                matchMediaListener(matchMediaQuery, true);
                                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                matchMediaQuery.addListener(matchMediaListener);
                            }
                        }
                    }
                };
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                DarkModeDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    if ($("html").hasClass("i-dark")) {
                        this.addDarkModifications();
                    }
                };
                DarkModeDocumentFeature.prototype.addDarkModifications = function () {
                    var _this = this;
                    var $inlineColors = $("pre [style]");
                    $inlineColors.each(function (_, element) {
                        if (element.style.color) {
                            var originalColor = tinycolor(element.style.color);
                            var color = _this.findReadableColorOnDarkBackground(originalColor);
                            if (color.toHex8String() !== originalColor.toHex8String()) {
                                $(element).data("i-original-color", element.style.color);
                                element.style.color = color.toHex8String();
                            }
                        }
                    });
                };
                DarkModeDocumentFeature.prototype.removeDarkModifications = function () {
                    var $inlineColors = $("pre [style]");
                    $inlineColors.each(function (_, element) {
                        var $element = $(element);
                        if ($element.data("i-original-color")) {
                            element.style.color = $element.data("i-original-color");
                            $element.removeData("i-original-color");
                        }
                    });
                };
                return DarkModeDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.DarkModeDocumentFeature = DarkModeDocumentFeature;
            var DarkModeDocumentFeatureFactory = /** @class */ (function () {
                function DarkModeDocumentFeatureFactory() {
                }
                DarkModeDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new DarkModeDocumentFeature(documentInstance);
                };
                return DarkModeDocumentFeatureFactory;
            }());
            Features.DarkModeDocumentFeatureFactory = DarkModeDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.DarkModeDocumentFeatureFactory());
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var replacementList = [
                { 'base': 'A', 'letters': /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g },
                { 'base': 'AA', 'letters': /[\uA732]/g },
                { 'base': 'AE', 'letters': /[\u00C6\u01FC\u01E2]/g },
                { 'base': 'AO', 'letters': /[\uA734]/g },
                { 'base': 'AU', 'letters': /[\uA736]/g },
                { 'base': 'AV', 'letters': /[\uA738\uA73A]/g },
                { 'base': 'AY', 'letters': /[\uA73C]/g },
                { 'base': 'B', 'letters': /[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g },
                { 'base': 'C', 'letters': /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g },
                { 'base': 'D', 'letters': /[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g },
                { 'base': 'DZ', 'letters': /[\u01F1\u01C4]/g },
                { 'base': 'Dz', 'letters': /[\u01F2\u01C5]/g },
                { 'base': 'E', 'letters': /[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g },
                { 'base': 'F', 'letters': /[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g },
                { 'base': 'G', 'letters': /[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g },
                { 'base': 'H', 'letters': /[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g },
                { 'base': 'I', 'letters': /[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g },
                { 'base': 'J', 'letters': /[\u004A\u24BF\uFF2A\u0134\u0248]/g },
                { 'base': 'K', 'letters': /[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g },
                { 'base': 'L', 'letters': /[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g },
                { 'base': 'LJ', 'letters': /[\u01C7]/g },
                { 'base': 'Lj', 'letters': /[\u01C8]/g },
                { 'base': 'M', 'letters': /[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g },
                { 'base': 'N', 'letters': /[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g },
                { 'base': 'NJ', 'letters': /[\u01CA]/g },
                { 'base': 'Nj', 'letters': /[\u01CB]/g },
                { 'base': 'O', 'letters': /[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g },
                { 'base': 'OI', 'letters': /[\u01A2]/g },
                { 'base': 'OO', 'letters': /[\uA74E]/g },
                { 'base': 'OU', 'letters': /[\u0222]/g },
                { 'base': 'P', 'letters': /[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g },
                { 'base': 'Q', 'letters': /[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g },
                { 'base': 'R', 'letters': /[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g },
                { 'base': 'S', 'letters': /[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g },
                { 'base': 'T', 'letters': /[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g },
                { 'base': 'TZ', 'letters': /[\uA728]/g },
                { 'base': 'U', 'letters': /[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g },
                { 'base': 'V', 'letters': /[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g },
                { 'base': 'VY', 'letters': /[\uA760]/g },
                { 'base': 'W', 'letters': /[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g },
                { 'base': 'X', 'letters': /[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g },
                { 'base': 'Y', 'letters': /[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g },
                { 'base': 'Z', 'letters': /[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g },
                { 'base': 'a', 'letters': /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g },
                { 'base': 'aa', 'letters': /[\uA733]/g },
                { 'base': 'ae', 'letters': /[\u00E6\u01FD\u01E3]/g },
                { 'base': 'ao', 'letters': /[\uA735]/g },
                { 'base': 'au', 'letters': /[\uA737]/g },
                { 'base': 'av', 'letters': /[\uA739\uA73B]/g },
                { 'base': 'ay', 'letters': /[\uA73D]/g },
                { 'base': 'b', 'letters': /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g },
                { 'base': 'c', 'letters': /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g },
                { 'base': 'd', 'letters': /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g },
                { 'base': 'dz', 'letters': /[\u01F3\u01C6]/g },
                { 'base': 'e', 'letters': /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g },
                { 'base': 'f', 'letters': /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g },
                { 'base': 'g', 'letters': /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g },
                { 'base': 'h', 'letters': /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g },
                { 'base': 'hv', 'letters': /[\u0195]/g },
                { 'base': 'i', 'letters': /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g },
                { 'base': 'j', 'letters': /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g },
                { 'base': 'k', 'letters': /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g },
                { 'base': 'l', 'letters': /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g },
                { 'base': 'lj', 'letters': /[\u01C9]/g },
                { 'base': 'm', 'letters': /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g },
                { 'base': 'n', 'letters': /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g },
                { 'base': 'nj', 'letters': /[\u01CC]/g },
                { 'base': 'o', 'letters': /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g },
                { 'base': 'oi', 'letters': /[\u01A3]/g },
                { 'base': 'ou', 'letters': /[\u0223]/g },
                { 'base': 'oo', 'letters': /[\uA74F]/g },
                { 'base': 'p', 'letters': /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g },
                { 'base': 'q', 'letters': /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g },
                { 'base': 'r', 'letters': /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g },
                { 'base': 's', 'letters': /[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g },
                { 'base': 't', 'letters': /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g },
                { 'base': 'tz', 'letters': /[\uA729]/g },
                { 'base': 'u', 'letters': /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g },
                { 'base': 'v', 'letters': /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g },
                { 'base': 'vy', 'letters': /[\uA761]/g },
                { 'base': 'w', 'letters': /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g },
                { 'base': 'x', 'letters': /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g },
                { 'base': 'y', 'letters': /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g },
                { 'base': 'z', 'letters': /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g }
            ];
            ;
            var DiacriticsHelper = /** @class */ (function () {
                /* eslint-disable-next-line no-useless-constructor */
                function DiacriticsHelper() {
                }
                DiacriticsHelper.prototype.removeDiacritics = function (str) {
                    for (var i = 0; i < replacementList.length; i++) {
                        str = str.replace(replacementList[i].letters, replacementList[i].base);
                    }
                    return str;
                };
                return DiacriticsHelper;
            }());
            Features.DiacriticsHelper = DiacriticsHelper;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var NavigationMessageNames = /** @class */ (function () {
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
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var navigationConstants = {
                navigationDelay: 500,
                navigationPrefixLength: 4
            };
            var NavigationDocumentFeature = /** @class */ (function (_super) {
                __extends(NavigationDocumentFeature, _super);
                function NavigationDocumentFeature() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this._rootSelector = null;
                    _this._isIframeResizeTimerDisabled = false;
                    _this._isAccordionView = true;
                    _this._navigationFrames = ["i-toc", "i-index", "i-search"];
                    _this._isEnabled = false;
                    _this.isTocNavigationEnabled = false;
                    _this.isStartOfToc = false;
                    _this.isEndOfToc = false;
                    return _this;
                }
                NavigationDocumentFeature.prototype.getName = function () {
                    return "Navigation";
                };
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                NavigationDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    this._rootSelector = rootSelector;
                    if ($("#i-navigation-container", this._rootSelector).length > 0) {
                        this._isEnabled = true;
                    }
                };
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
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
                            this.isStartOfToc = (message.messageData === "true");
                            $("#i-toc-header #i-previous").toggleClass("i-arrow-left-disabled", this.isStartOfToc);
                            break;
                        case Features.NavigationMessageNames.toggleTocNext:
                            this.isEndOfToc = (message.messageData === "true");
                            $("#i-toc-header #i-next").toggleClass("i-arrow-right-disabled", this.isEndOfToc);
                            break;
                        case Features.NavigationMessageNames.navigate:
                            if (message.messageData === "previous" || message.messageData === "next") {
                                this.navigateToc(message.messageData);
                            }
                            else {
                                Content.Messaging.routeMessageToWindow(parent, message.messageType, message.messageData);
                            }
                            break;
                        // No default
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
                    if (configuration.profileName !== "desktop") {
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
                        }, navigationConstants.navigationDelay);
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
                            // Notify the websearch iframe to set focus in the search box
                            $("#i-accordion", this._rootSelector)
                                .off("accordionactivate.navigation")
                                .on("accordionactivate.navigation", function (_, ui) {
                                if (ui.newHeader.attr("id") === "i-search-header") {
                                    Content.Messaging.routeMessageToFrameElement("i-search", Features.NavigationMessageNames.activated, null);
                                }
                            });
                        }
                        else if ($("#i-tabstrip", this._rootSelector).length > 0) {
                            // Change default duration on the tabs
                            var options = {
                                heightStyle: "fill"
                            };
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
                            var arrowContainer = $("<div class=\"i-arrow-container\"></div>");
                            arrowContainer.append("<div class=\"i-arrow i-arrow-right\" id=\"i-next\"></div>");
                            arrowContainer.append("<div class=\"i-arrow i-arrow-left\" id=\"i-previous\"></div>");
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
                    if (frameId != null && frameId.indexOf("nav-") === 0) {
                        frameId = "i-".concat(frameId.substring(navigationConstants.navigationPrefixLength));
                    }
                    for (var x = 0; x < this._navigationFrames.length; x++) {
                        var currentFrameId = this._navigationFrames[x];
                        var isSelected = (currentFrameId === frameId);
                        if (isSelected) {
                            if (this._isAccordionView) {
                                $("#i-accordion").accordion("option", "active", x);
                            }
                            else {
                                $("iframe#".concat(currentFrameId)).css("display", "block");
                            }
                        }
                        else {
                            $("iframe#".concat(currentFrameId)).css("display", "none");
                        }
                    }
                    if (!this._isAccordionView) {
                        Content.Browser.resizeIFrames(this._rootSelector, true);
                    }
                };
                NavigationDocumentFeature.prototype.addCloseButtonChevrons = function () {
                    var topWindowHeight;
                    try {
                        topWindowHeight = $(window.top).height();
                    }
                    catch (ex) {
                        topWindowHeight = $(window).height();
                    }
                    var closePaneHeight = Math.max($("#i-close-pane").height(), topWindowHeight);
                    $("#i-close-pane > i.i-image").remove();
                    /* eslint-disable-next-line no-magic-numbers */
                    for (var i = topWindowHeight / 2; i < closePaneHeight; i += topWindowHeight) {
                        var image = $("<i class=\"i-image\"></i>");
                        image.css("top", "".concat(i, "px"));
                        image.appendTo("#i-close-pane");
                    }
                };
                return NavigationDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.NavigationDocumentFeature = NavigationDocumentFeature;
            var NavigationDocumentFeatureFactory = /** @class */ (function () {
                function NavigationDocumentFeatureFactory() {
                }
                NavigationDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new NavigationDocumentFeature(documentInstance);
                };
                return NavigationDocumentFeatureFactory;
            }());
            Features.NavigationDocumentFeatureFactory = NavigationDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.NavigationDocumentFeatureFactory());
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var tableOfContentsConstants = {
                slideToggleDelay: 200,
                iconIndexFolderNew: 3,
                iconIndexFolder: 1,
                iconIndexPageNew: 10,
                iconIndexPage: 9
            };
            var TableOfContentsDocumentFeature = /** @class */ (function (_super) {
                __extends(TableOfContentsDocumentFeature, _super);
                function TableOfContentsDocumentFeature() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this._lastSelectedNode = null;
                    _this._ignoreSyncRequest = false;
                    _this._selectedNodeIndex = -1;
                    _this._firstNodeIndex = -1;
                    _this._lastNodeIndex = -1;
                    _this._tocNodeCount = -1;
                    _this._selectedNodeHref = null;
                    _this._rootSelector = null;
                    _this._isTocConstructed = false;
                    _this._isMobileToc = false;
                    _this._isEnabled = false;
                    _this.syncTocUrl = null;
                    return _this;
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
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                TableOfContentsDocumentFeature.prototype.populateResponsiveConfiguration = function (configuration) {
                    if (!this._isEnabled) {
                        return;
                    }
                };
                TableOfContentsDocumentFeature.prototype.applyResponsiveConfiguration = function (configuration) {
                    if (!this._isEnabled) {
                        return;
                    }
                    if (configuration.profileName === "desktop") {
                        $("html")
                            .removeClass("ui-mobile")
                            .removeClass("ui-mobile-rendering");
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
                                if (message.messageData === "next") {
                                    anchor = this.moveToNextNode();
                                }
                                else if (message.messageData === "previous") {
                                    anchor = this.moveToPreviousNode();
                                }
                                if (anchor != null && anchor.length) {
                                    this._ignoreSyncRequest = false;
                                    this.syncTocNode(anchor);
                                    // Ignore the next ToC node sync request as it will come from the webframe when the content has finished loading
                                    this._ignoreSyncRequest = true;
                                    if (anchor.attr("href").substring(0, 1) !== "#") {
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
                        // No default
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
                    this._selectedNodeIndex = parseInt(anchor.attr("data-node-index"), 10);
                    this._selectedNodeHref = anchor.attr("href");
                };
                TableOfContentsDocumentFeature.prototype.isLastNodeSelected = function () {
                    if (this._tocNodeCount === -1) {
                        this._tocNodeCount = this._getAnchors().length;
                    }
                    return this._selectedNodeIndex === this._lastNodeIndex;
                };
                TableOfContentsDocumentFeature.prototype.isFirstNodeSelected = function () {
                    return this._selectedNodeIndex === this._firstNodeIndex;
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
                            } while (anchors.eq(this._selectedNodeIndex)
                                .attr("href")
                                .substring(0, 1) === "#" && this._selectedNodeIndex > 0);
                        }
                    }
                    else {
                        if (anchors.length - 1 > this._selectedNodeIndex) {
                            do {
                                this._selectedNodeIndex++;
                            } while (anchors.eq(this._selectedNodeIndex)
                                .attr("href")
                                .substring(0, 1) === "#" && anchors.length - 1 > this._selectedNodeIndex);
                        }
                    }
                    return anchors.eq(this._selectedNodeIndex);
                };
                TableOfContentsDocumentFeature.prototype.isPageSelected = function (anchor) {
                    return (anchor.attr("href") === this._selectedNodeHref);
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
                    if (element.attr("href") !== "#") {
                        Content.Messaging.routeMessageToWindow(window.parent.parent, Features.NavigationMessageNames.navigate, element.attr("href"));
                    }
                    // Don't collapse the nested list when clicking on a node (do expand it if it is collapsed)
                    if (!$(element)
                        .prev("ins")
                        .hasClass("i-collapse")) {
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
                            listElement.each(function (_, element) {
                                _this.expandOrCollapseNode($(element), isAnimationEnabled);
                            });
                            return;
                        }
                        if (!listElement.hasClass("i-visible")) {
                            this.processListElement(listElement);
                        }
                        if (isAnimationEnabled) {
                            listElement.slideToggle(tableOfContentsConstants.slideToggleDelay, function () {
                                listElement.toggleClass("i-visible");
                                listElement.css("display", "");
                            });
                        }
                        else {
                            listElement.toggleClass("i-visible");
                        }
                        // Swap icons for open and closed books
                        var icon = listElement.prev("a").children("ins");
                        if (icon.hasClass("i-icon-1")) {
                            icon.removeClass("i-icon-1").addClass("i-icon-2");
                        }
                        else if (icon.hasClass("i-icon-2")) {
                            icon.removeClass("i-icon-2").addClass("i-icon-1");
                        }
                        else if (icon.hasClass("i-icon-3")) {
                            icon.removeClass("i-icon-3").addClass("i-icon-4");
                        }
                        else if (icon.hasClass("i-icon-4")) {
                            icon.removeClass("i-icon-4").addClass("i-icon-3");
                        }
                        listElement.prevAll("ins").toggleClass("i-expand i-collapse");
                    }
                };
                TableOfContentsDocumentFeature.prototype.processListElement = function (listElement) {
                    var _this = this;
                    if (listElement.length) {
                        if (listElement.length > 1) {
                            // Process individually
                            listElement.each(function (_, element) {
                                _this.processListElement($(element));
                            });
                            return;
                        }
                        if (listElement.hasClass("i-root")) {
                            listElement.addClass("i-visible");
                        }
                        listElement.children("li").each(function (_, listItemElement) {
                            var hasNestedList = false;
                            var listItem = $(listItemElement);
                            listItem.children("ul").each(function (__, childListElement) {
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
                            if (listItemElement.firstChild.nodeName !== "INS") {
                                var spacer = $("<ins class=\"i-spacer\"></ins>");
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
                            if (anchor.children("ins").length === 0) {
                                var icon = $("<ins class=\"i-icon\"></ins>");
                                var iconIndex = parseInt(listItem.attr("rel"), 10);
                                var iconClassIndex = iconIndex;
                                var isNew = listItem.data("is-new") === "True";
                                if (hasNestedList) {
                                    if (iconIndex <= 0) {
                                        if (isNew) {
                                            iconClassIndex = tableOfContentsConstants.iconIndexFolderNew;
                                        }
                                        else {
                                            iconClassIndex = tableOfContentsConstants.iconIndexFolder;
                                        }
                                    }
                                }
                                else {
                                    if (iconIndex <= 0) {
                                        if (isNew) {
                                            iconClassIndex = tableOfContentsConstants.iconIndexPageNew;
                                        }
                                        else {
                                            iconClassIndex = tableOfContentsConstants.iconIndexPage;
                                        }
                                    }
                                }
                                icon.addClass("i-icon-".concat(iconClassIndex));
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
                                .on("hover.toc", function (event) {
                                if (!$(event.currentTarget).hasClass("i-selected")) {
                                    $(event.currentTarget).addClass("i-hover");
                                }
                            }, function (event) {
                                $(event.currentTarget).removeClass("i-hover");
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
                    var updatedUrl = url;
                    if (url.split("#").length > 1) {
                        updatedUrl = url.substring(0, url.indexOf("#"));
                    }
                    else if (url.split("?").length > 1) {
                        updatedUrl = url.substring(0, url.indexOf("?"));
                    }
                    var anchor = $("div#i-toc-container > ul a[href=\"".concat(decodeURIComponent(updatedUrl), "\"]"), this._rootSelector).first();
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
                            && anchor.data("node-index") !== this._lastSelectedNode.data("node-index")) || this._lastSelectedNode == null)) {
                            this.selectNodeElement(anchor);
                            this.expandParents(anchor, false);
                            // scroll selected anchor into view (don't use scrollInToView here as that causes problems with the iframe)
                            $("html, body").animate({
                                scrollTop: anchor.offset().top
                            }, tableOfContentsConstants.slideToggleDelay);
                            this.updateNavigationButtons();
                        }
                    }
                };
                TableOfContentsDocumentFeature.prototype.expandParents = function (element, isAnimationEnabled, parents) {
                    if (parents === void 0) { parents = null; }
                    var parentListElement = element.parent().closest("ul");
                    if (parentListElement.length === 0) {
                        for (var i = parents.length - 1; i > -1; i--) {
                            this.expandOrCollapseNode(parents[i], isAnimationEnabled);
                        }
                        return;
                    }
                    else {
                        if (typeof parents === "undefined" || parents == null) {
                            parents = [];
                        }
                        // Only expand if it isn't the root, isn't already expanded or hasn't been procesed yet
                        if (!parentListElement.hasClass("i-root")) {
                            var spacer = parentListElement.prevAll("ins.i-spacer");
                            if (spacer.length === 0 || spacer.hasClass("i-expand")) {
                                parents.push(parentListElement);
                            }
                        }
                        this.expandParents(parentListElement, isAnimationEnabled, parents);
                    }
                };
                TableOfContentsDocumentFeature.prototype.buildToCPage = function (listId) {
                    if (listId === "i-root") {
                        listId = "i-root-node";
                    }
                    var tocPageId = listId;
                    if (listId === "i-root-node") {
                        listId = "i-root";
                    }
                    if ($.mobile.activePage.length && $.mobile.activePage.attr("id") === listId) {
                        // Current active ToC page so just highlight the selected Url
                        this._highlightSelectedNode();
                        return;
                    }
                    // If the ToC page already exists in the DOM then just change to it
                    if ($("div#".concat(tocPageId), this._rootSelector).length) {
                        $.mobile.changePage($("div#".concat(tocPageId), this._rootSelector), { dataUrl: tocPageId });
                        return;
                    }
                    var list = $("ul#".concat(listId), this._rootSelector).first();
                    var title = list.prev("a").text();
                    var backId = list
                        .parent()
                        .closest("ul")
                        .attr("id");
                    var newPage = $("<div data-role=\"page\" id=\"".concat(tocPageId, "\"></div>"));
                    var header = $("<div data-role=\"header\" data-theme=\"b\"></div>");
                    if (backId === "i-root") {
                        backId = "i-root-node";
                    }
                    if (listId !== "i-root") {
                        // Add a header to all child pages
                        // Add a back button to the header (just icon no text)
                        $("<a href=\"#".concat(backId, "\" data-icon=\"arrow-l\" data-iconpos=\"notext\">Back</a>")).appendTo(header);
                        $("<h1>".concat(title, "</h1>")).appendTo(header);
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
                        .closest("li")
                        .attr("data-icon", "false");
                    pageList.appendTo(newPage);
                    // Add the new page to the main container, mobile-ize it then transition to it
                    newPage.appendTo($("div#i-toc-container", this._rootSelector));
                    newPage.page();
                    $.mobile.changePage(newPage, { dataUrl: tocPageId });
                    // Highlight the selected node
                    this._highlightSelectedNode();
                };
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                TableOfContentsDocumentFeature.prototype._onBeforePageChange = function (event, pageData) {
                    // data.toPage will be the page href on the first call (div element on the second)
                    if (typeof pageData.toPage === "string") {
                        if (pageData.toPage.match(/(#node-(\d+)|#i-root-node)/)) {
                            var pageId = pageData.toPage.substring(pageData.toPage.lastIndexOf("#") + 1, pageData.toPage.length);
                            if ($("div#".concat(pageId)).length === 0) {
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
                        && anchor.attr("href").substring(0, 1) !== "#") {
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
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                TableOfContentsDocumentFeature.prototype._onPageChange = function (_, pageData) {
                    // Called after sucessfully switching to the next ToC page, if the page we came from isn't the
                    // root page then remove it from the DOM
                    if (typeof pageData.options.fromPage != "undefined"
                        && pageData.toPage.attr("id") !== pageData.options.fromPage.attr("id")) {
                        pageData.options.fromPage.remove();
                    }
                    this._highlightSelectedNode();
                };
                TableOfContentsDocumentFeature.prototype.constructMobileToC = function () {
                    var _this = this;
                    $(document)
                        .off("pagebeforechange.toc")
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        .on("pagebeforechange.toc", function (event, pageData) {
                        _this._onBeforePageChange(event, pageData);
                    });
                    $(document)
                        .off("pagechange.toc")
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        .on("pagechange.toc", function (event, pageData) {
                        _this._onPageChange(event, pageData);
                    });
                    this._rootSelector
                        .off("vclick.toc")
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        .on("vclick.toc", function (event) {
                        _this._onVirtualClick(event);
                    });
                    var tocNodeIndex = 0;
                    $("li>a", this._rootSelector).each(function (_, anchorElement) {
                        var ul = $(anchorElement).next("ul");
                        if (ul.length) {
                            if ($(anchorElement).attr("href") !== "#") {
                                // If the li has a link to a page then add a new li to the child ul so that it will be displayed
                                // as the first item on the new page
                                var listItem = $("<li></li>").prepend($(anchorElement).clone());
                                ul.prepend(listItem);
                            }
                            // Add an id to the list element which will be moved to the page div later
                            ul.attr("id", "node-".concat(tocNodeIndex));
                            // Point the anchor in the list item to the child list
                            $(anchorElement).attr("href", "#node-".concat(tocNodeIndex));
                            tocNodeIndex++;
                        }
                    });
                    // Index the anchor nodes again as they will have changed since loading the page
                    this._indexNodes();
                    // Add the root page
                    var rootPage = $("<div data-role=\"page\" id=\"i-root-node\"></div>");
                    var rootList = $("ul#i-root")
                        .clone()
                        .removeAttr("id")
                        .removeAttr("style")
                        .attr("data-role", "listview");
                    rootList.find("ul").remove();
                    rootList.find("a:not(a[href*='#node-'])")
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
                        .find("a[data-node-index=\"".concat(this._selectedNodeIndex, "\"]"))
                        .first()
                        .addClass("ui-btn-active");
                };
                TableOfContentsDocumentFeature.prototype._indexNodes = function () {
                    var _this = this;
                    var nodeIndex = 0;
                    $("ul.i-root a", this._rootSelector).each(function (_, element) {
                        if (_this._firstNodeIndex === -1
                            && $(element)
                                .attr("href")
                                .substring(0, 1) !== "#") {
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
            var TableOfContentsDocumentFeatureFactory = /** @class */ (function () {
                function TableOfContentsDocumentFeatureFactory() {
                }
                TableOfContentsDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new TableOfContentsDocumentFeature(documentInstance);
                };
                return TableOfContentsDocumentFeatureFactory;
            }());
            Features.TableOfContentsDocumentFeatureFactory = TableOfContentsDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.TableOfContentsDocumentFeatureFactory());
// Disable JQM page initialization
$(document)
    .off("mobileinit.navigation")
    .on("mobileinit.navigation", function () {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    $.mobile.autoInitializePage = false;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    $.mobile.defaultPageTransition = "none";
});
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var topFrameConstants = {
                iFrameResizeDelay: 500,
                navBarSwingDuration: 600,
                navBarCloseDuration: 400,
                syncDelay: 500,
                widthDivisor: 0.5
            };
            var TopFrameDocumentFeature = /** @class */ (function (_super) {
                __extends(TopFrameDocumentFeature, _super);
                function TopFrameDocumentFeature() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.defaultTopic = null;
                    _this.baseTitle = null;
                    _this._rootSelector = null;
                    _this._responsiveProfileName = "desktop";
                    _this._isIframeResizeTimerDisabled = false;
                    _this._isEnabled = false;
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    _this.layout = null;
                    return _this;
                }
                TopFrameDocumentFeature._fixSubPixelWidth = function (element) {
                    element.width(Math.floor($(window).width() * element.data("widthDivisor")));
                };
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
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
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
                    if (configuration.profileName === "desktop") {
                        // Desktop
                        this.layout = $(".i-layout-container", this.documentInstance.rootSelector).layout({
                            resizeWhileDragging: true,
                            /* eslint-disable-next-line @typescript-eslint/naming-convention */
                            west__size: 395,
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
                            if ($("iframe#i-nav", _this.documentInstance.rootSelector).css("left") !== "0px") {
                                $("iframe#i-nav", _this.documentInstance.rootSelector).css("left", -$(window).width());
                            }
                            TopFrameDocumentFeature._fixSubPixelWidth($("iframe#i-nav", _this.documentInstance.rootSelector));
                        });
                        // Scroll back to the top of page on a new page load
                        $("iframe#i-content", this._rootSelector)
                            .on("load.topframe", function () {
                            _this._rootSelector.scrollTop(0);
                        });
                        this.onContentLoaded(null);
                        // Resize the iframes and set a timer to keep them sized
                        Content.Browser.resizeIFrames(this._rootSelector);
                        setInterval(function () {
                            if (!_this._isIframeResizeTimerDisabled) {
                                var maxHeight = Content.Browser.resizeIFrames(_this._rootSelector);
                                if (maxHeight > 0 && maxHeight !== $("body").height()) {
                                    _this._rootSelector.height(maxHeight);
                                }
                            }
                        }, topFrameConstants.iFrameResizeDelay);
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
                        // No default
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
                                .data("widthDivisor", topFrameConstants.widthDivisor);
                            TopFrameDocumentFeature._fixSubPixelWidth($("iframe#i-nav", this.documentInstance.rootSelector));
                            break;
                        // No default
                    }
                    if (this._responsiveProfileName !== "desktop") {
                        // Resize webnav and webcontent to their content height
                        Content.Browser.resizeIFrames(this._rootSelector, true);
                        // Show the gray overlay
                        $("#i-busy", this.documentInstance.rootSelector).show();
                        // Bring in the navbar
                        $("iframe#i-nav", this.documentInstance.rootSelector)
                            .css("visibility", "visible")
                            .animate({ left: "0" }, topFrameConstants.navBarSwingDuration, "swing", function () {
                            _this._isIframeResizeTimerDisabled = false;
                        });
                    }
                };
                TopFrameDocumentFeature.prototype.closeNavigationPane = function () {
                    var _this = this;
                    if (this._responsiveProfileName === "desktop") {
                        return;
                    }
                    if ($("iframe#i-nav", this.documentInstance.rootSelector).css("left") === "0px") {
                        this._isIframeResizeTimerDisabled = true;
                        // Close the navbar
                        $("iframe#i-nav", this.documentInstance.rootSelector).animate({
                            left: "-".concat($("iframe#i-nav").css("width"))
                        }, topFrameConstants.navBarCloseDuration, "swing", function () {
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
                    var location = Content.Browser.getLocationInfo();
                    if (location.hash !== "") {
                        return location.hash.substring(1);
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
                    }, topFrameConstants.syncDelay);
                    if (this._responsiveProfileName !== "desktop") {
                        Content.Messaging.routeMessageToFrameElement("i-content", Content.DocumentMessageNames.insertNavigationHeader, null);
                    }
                };
                TopFrameDocumentFeature.prototype.updatePageTitle = function (pageTitle) {
                    if (pageTitle != null) {
                        document.title = "".concat(this.baseTitle, " - ").concat(pageTitle);
                    }
                };
                TopFrameDocumentFeature.prototype.updateLocation = function (url) {
                    if (url != null) {
                        var location_1 = Content.Browser.getLocationInfo();
                        var pageName = url.substring(url.lastIndexOf("/") + 1);
                        if ("#".concat(pageName) !== location_1.hash && "?".concat(pageName) !== location_1.search) {
                            Content.Browser.replaceLocation(pageName);
                        }
                    }
                };
                TopFrameDocumentFeature.prototype.getDefaultTopic = function () {
                    var topic = null;
                    var location = Content.Browser.getLocationInfo();
                    var qs = location.search;
                    if (qs != null && qs.length > 0) {
                        topic = qs.substring(1) + location.hash;
                    }
                    else if (location.hash != null && location.hash.length > 0) {
                        topic = location.hash.substring(1);
                    }
                    if (topic == null || this.isUrl(topic)) {
                        topic = this.defaultTopic;
                    }
                    return topic;
                };
                TopFrameDocumentFeature.prototype.isUrl = function (possibleUrl) {
                    return /^[\d\D\.]*:/.test(possibleUrl);
                };
                TopFrameDocumentFeature.prototype.navigate = function (messageData) {
                    // ToC previous/next navigation
                    if (messageData === "next" || messageData === "previous") {
                        Content.Messaging.routeMessageToFrameElement("i-nav", "navigate", messageData);
                    }
                    else {
                        // Navigate to specific page
                        var location_2 = Content.Browser.getLocationInfo();
                        if ($("#i-content", this._rootSelector).attr("src") !== messageData
                            || (location_2.hash.length > 0 && location_2.hash.substring(1) !== messageData)
                            || (location_2.search.length > 0 && location_2.search.substring(1) !== messageData)
                            || (location_2.hash.length === 0 && location_2.search.length === 0)) {
                            // Default content frame height back to the window height - to stop the content frame
                            //  growing to the largest doc size over time
                            if (this._responsiveProfileName !== "desktop") {
                                $("#i-content", this._rootSelector).height($(window).height());
                            }
                            $("#i-content", this._rootSelector).attr("src", messageData);
                        }
                        if (this._responsiveProfileName !== "desktop") {
                            this.closeNavigationPane();
                        }
                    }
                };
                /**
                 * Forces a specific responsive display mode when the document loads. The forced display mode is set in local storage
                 *  so will be used by all subsequent page loads until it is reset.
                 */
                TopFrameDocumentFeature.prototype.setForcedDisplayMode = function (displayMode) {
                    this.documentInstance.getFeatureByName("Responsive").setForcedDisplayMode(displayMode);
                    if (displayMode != null) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        var overrides_1 = Innovasys.overrides
                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            || Innovasys.settings
                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            || (Innovasys.settings = Innovasys.overrides = {});
                        $.extend(overrides_1, {
                            forcedDisplayMode: displayMode
                        });
                    }
                };
                return TopFrameDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.TopFrameDocumentFeature = TopFrameDocumentFeature;
            var TopFrameDocumentFeatureFactory = /** @class */ (function () {
                function TopFrameDocumentFeatureFactory() {
                }
                TopFrameDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new TopFrameDocumentFeature(documentInstance);
                };
                return TopFrameDocumentFeatureFactory;
            }());
            Features.TopFrameDocumentFeatureFactory = TopFrameDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.TopFrameDocumentFeatureFactory());
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var searchConstants = {
                enterKeyCode: 13,
                minOperatorLength: 4
            };
            var SearchFile = /** @class */ (function () {
                /* eslint-disable-next-line no-useless-constructor */
                function SearchFile(url, title, rank) {
                    this.url = url;
                    this.title = title;
                    this.rank = rank;
                }
                return SearchFile;
            }());
            Features.SearchFile = SearchFile;
            var SearchTermWordMatch = /** @class */ (function () {
                /* eslint-disable-next-line no-useless-constructor */
                function SearchTermWordMatch(searchTerm, matchedWords) {
                    this.searchTerm = searchTerm;
                    this.matchedWords = matchedWords;
                }
                return SearchTermWordMatch;
            }());
            Features.SearchTermWordMatch = SearchTermWordMatch;
            var SearchResult = /** @class */ (function () {
                function SearchResult(fileIndex, rank, keywords, searchTerm) {
                    this.fileIndex = fileIndex;
                    this.rank = rank;
                    this.keywords = keywords;
                    this.searchTerm = searchTerm;
                    this.rank = rank;
                }
                return SearchResult;
            }());
            Features.SearchResult = SearchResult;
            var searchDocumentFeature;
            var SearchDocumentFeature = /** @class */ (function (_super) {
                __extends(SearchDocumentFeature, _super);
                function SearchDocumentFeature(documentInstance) {
                    var _this = _super.call(this, documentInstance) || this;
                    _this._webSearchPendingHighlight = null;
                    _this._rootSelector = null;
                    _this._isEnabled = false;
                    _this._isFullTextSearchPositionDataAvailable = false;
                    _this._isFullTextSearchObjects = false;
                    _this._isFullTextSearchFrameless = false;
                    _this._results = null;
                    _this._clickedResult = null;
                    _this._diacriticsHelper = null;
                    _this.currentPage = 1;
                    _this.resultsPerPage = 10;
                    searchDocumentFeature = _this;
                    return _this;
                }
                SearchDocumentFeature.escapeForRegEx = function (source) {
                    return source.replace(/[-\/\\^$+.()|[\]{}]/g, "\\$&");
                };
                SearchDocumentFeature.prototype.getName = function () {
                    return "Search";
                };
                SearchDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    var _this = this;
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    if (isInitialLoad) {
                        this._rootSelector = rootSelector;
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        var overrides_2 = (Innovasys.overrides || Innovasys.settings);
                        if (overrides_2 != null && overrides_2.isFullTextSearchPositionDataAvailable) {
                            this._isFullTextSearchPositionDataAvailable = true;
                        }
                        if (overrides_2 != null && overrides_2.isFullTextSearchObjects) {
                            this._isFullTextSearchObjects = true;
                        }
                        if (overrides_2 != null && overrides_2.isFullTextSearchFrameless) {
                            this._isFullTextSearchFrameless = true;
                        }
                    }
                    this._diacriticsHelper = new Features.DiacriticsHelper;
                    if ($("#i-search-container", this._rootSelector).length > 0) {
                        this._isEnabled = true;
                        if (this._results !== null && this._results.length > 0) {
                            this.outputResults(this._results);
                        }
                        $("#i-search", rootSelector)
                            .off("keyup.search")
                            .on("keyup.search", function (event) {
                            if (event.keyCode === searchConstants.enterKeyCode) {
                                $("#i-execute-search").click();
                            }
                        });
                        $("#i-execute-search", rootSelector)
                            .off("click.search")
                            .on("click.search", function () {
                            _this.executeSearch();
                        });
                        $("#i-results-container", this._rootSelector)
                            .off("click.search", ".i-result")
                            .on("click.search", ".i-result", function (event) {
                            event.preventDefault();
                            _this.showSearchResult($(event.target).attr("href"), $(event.target).attr("data-result-terms"), parseInt($(event.target).attr("data-result-index"), 10));
                        });
                    }
                    // Set up click handler for highlight checkbox
                    $("#i-highlight", rootSelector)
                        .off("click.search")
                        .on("click.search", function () {
                        if (_this._results && _this._results.length > 0) {
                            _this.outputResults(_this._results);
                        }
                        else {
                            var searchText = $("#i-search", _this._rootSelector).val();
                            if (searchText.length > 0) {
                                _this.executeSearch();
                            }
                        }
                    });
                    var querystringSearchText = Content.Browser.getQueryStringParameter("query");
                    if (querystringSearchText != null && querystringSearchText !== "") {
                        $("#i-search", rootSelector).val(querystringSearchText);
                        this.executeSearch();
                    }
                };
                SearchDocumentFeature.prototype.populateResponsiveConfiguration = function (configuration) {
                    if (!this._isEnabled) {
                        return;
                    }
                    if (configuration.profileName !== "desktop") {
                        configuration.clickTargets.push(new Content.ResponsiveClickTarget("#i-execute-search", Content.ResponsiveClickTargetKind.block));
                    }
                };
                SearchDocumentFeature.prototype.applyResponsiveConfiguration = function (configuration) {
                    if (!this._isEnabled) {
                        return;
                    }
                    if (configuration.profileName !== "desktop") {
                        $("#i-highlight", this._rootSelector).attr("checked", "true");
                    }
                };
                SearchDocumentFeature.prototype.executeSearch = function () {
                    // Show searching div
                    $("#i-search-container", this._rootSelector).hide();
                    $("#i-results-container", this._rootSelector).hide();
                    $("#i-searching-overlay", this._rootSelector).show();
                    // do search
                    var searchResult = this.buildSearchResults();
                    // Show results div
                    $("#i-searching-overlay", this._rootSelector).hide();
                    $("#i-search-container", this._rootSelector).show();
                    $("#i-results-container", this._rootSelector).show();
                    // show results
                    if (searchResult === true) {
                        // show results div
                        $("#i-results", this._rootSelector).show();
                    }
                };
                SearchDocumentFeature.prototype.buildSearchResults = function () {
                    try {
                        // get search string
                        var searchText = $("#i-search", this._rootSelector).val();
                        if (searchText.length === 0) {
                            this._results = [];
                            this.outputResults(this._results);
                            return false;
                        }
                        // make lowercase for easy comparison later on
                        searchText = searchText.toLowerCase();
                        // Tokenize and clean search text
                        var tokens = this.tokenizeSearchText(searchText);
                        // Build query and search terms
                        var queryData = this.buildQueryAndTerms(tokens);
                        var query = queryData.query;
                        var searchTerms = queryData.searchTerms;
                        // load files & stopwords arrays
                        var searchFiles = [];
                        var allWords = [];
                        if (this._isFullTextSearchObjects) {
                            // Pass constructor to initialization function
                            Features.buildSearchFilesAndKeywords(searchFiles, allWords, SearchFile);
                        }
                        else {
                            // Pass 2 arrays and build SearchFile array from them
                            var indexFiles = [];
                            var indexTitles = [];
                            Features.buildSearchIndexArray(indexFiles, indexTitles, allWords);
                            for (var fileIndex = 0; fileIndex < indexFiles.length; fileIndex++) {
                                var newSearchFile = new SearchFile(indexFiles[fileIndex], indexTitles[fileIndex], 0);
                                searchFiles[fileIndex] = newSearchFile;
                            }
                        }
                        // build results list
                        var searchResults = this.populateSearchResults(searchFiles, allWords, searchTerms);
                        if (this.currentPage !== 1) {
                            this.currentPage = 1;
                        }
                        this._results = this.buildResultsArray(query, searchResults);
                        // write results to document
                        this.outputResults(this._results);
                        // return success
                        return true;
                    }
                    catch (exception) {
                        console.error("An exception was thrown while implementing the search. Please try again.", exception);
                        return false; // Error in search
                    }
                };
                SearchDocumentFeature.prototype.tokenizeSearchText = function (searchText) {
                    if (searchText === null || searchText === undefined || searchText === "")
                        return [];
                    var tokens = [];
                    var regex = /["']([^"']+)["']|[^(]*\([^()]*\)|([^\s]+)/gi;
                    var match;
                    while ((match = regex.exec(searchText)) !== null) {
                        var pushed = false;
                        // Start from 1 to skip the full match at index 0
                        for (var i = 1; i < match.length; i++) {
                            if (match[i]) {
                                tokens.push(match[i]);
                                pushed = true;
                            }
                        }
                        // If no group matched, push the whole match
                        if (!pushed && match[0]) {
                            tokens.push(match[0]);
                        }
                    }
                    return tokens;
                };
                SearchDocumentFeature.prototype.buildQueryAndTerms = function (tokens) {
                    var query = "";
                    var searchTerms = [];
                    var lastTokenWasOperator = true;
                    for (var i = 0; i < tokens.length; i++) {
                        var token = tokens[i];
                        if (token.length > 0) {
                            if (token === "or" || token === "and") {
                                if (!lastTokenWasOperator) {
                                    query += token === "or" ? " || " : " && ";
                                    lastTokenWasOperator = true;
                                }
                            }
                            else {
                                if (!lastTokenWasOperator) {
                                    query += " || ";
                                }
                                query += '(searchTerms.indexOf("' + token + '") >= 0)';
                                searchTerms.push(token);
                                lastTokenWasOperator = false;
                            }
                        }
                    }
                    return { query: query, searchTerms: searchTerms };
                };
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                SearchDocumentFeature.prototype.populateSearchResults = function (searchFiles, allWords, searchTerms) {
                    var _this = this;
                    var searchResults = [];
                    var contentArray = [];
                    var titleArray = [];
                    this.populateTitleContentArrays(allWords, searchFiles, titleArray, contentArray);
                    // Process each search term
                    var searchTermRegExp = null;
                    for (var a = 0; a < searchTerms.length; a++) {
                        var searchTerm = searchTerms[a];
                        var searchTermWordMatch = new SearchTermWordMatch(searchTerm, []);
                        if (searchTerm.indexOf("*") !== -1 || searchTerm.indexOf("?") !== -1) {
                            // Wildcard match
                            searchTermRegExp = new RegExp("^" + SearchDocumentFeature.escapeForRegEx(searchTerm)
                                .replace(/\*/g, ".*")
                                .replace(/\?/g, ".") + "$", "i");
                        }
                        var sortedResults = null;
                        if (searchTermRegExp != null) {
                            sortedResults = this.sort(contentArray, searchTermRegExp);
                        }
                        else {
                            // Regular term match
                            searchTerm = searchTerm.replace(/"/g, "");
                            sortedResults = this.sort(contentArray, searchTerm);
                        }
                        // Build search results for matched words
                        if (sortedResults != null) {
                            for (var b = 0; b < sortedResults.length; b++) {
                                var matchedResult = sortedResults[b].item;
                                var rank = sortedResults[b].rank;
                                var fileIndexValue = matchedResult.split('¬')[0];
                                var fileContent = matchedResult.split("¬")[1];
                                var searchTerm_1 = searchTermWordMatch.searchTerm.replace(/"/g, "");
                                var positions = this.getTermOrPhrasePositions(fileContent, searchTerm_1);
                                var fileIndex = 0;
                                fileIndex = parseInt(fileIndexValue, 10);
                                var isPhrase = /\s/.test(searchTerm_1);
                                if (isPhrase && (!positions || positions.length === 0)) {
                                    continue; // Skip this result, as it matches invalid phrase locations
                                }
                                var locatedSearchResult = searchResults[fileIndex];
                                if (typeof locatedSearchResult === "undefined") {
                                    locatedSearchResult = new SearchResult(fileIndex, rank, fileContent + ",", searchTermWordMatch.searchTerm + ",");
                                    if (typeof searchFiles[fileIndex] !== "undefined") {
                                        locatedSearchResult.searchFile = searchFiles[fileIndex];
                                        // Increase rank if the search term is found in the title
                                        if (searchFiles[fileIndex].title.toLowerCase().indexOf(searchTerm_1.toLowerCase()) !== -1) {
                                            locatedSearchResult.rank += 10; // Arbitrary boost value
                                        }
                                    }
                                    searchResults[fileIndex] = locatedSearchResult;
                                }
                                else {
                                    if (locatedSearchResult.keywords.indexOf(fileContent + ",") === -1) {
                                        locatedSearchResult.keywords += fileContent + ",";
                                    }
                                    if (locatedSearchResult.searchTerm.indexOf(searchTermWordMatch.searchTerm + ",") === -1) {
                                        locatedSearchResult.searchTerm += searchTermWordMatch.searchTerm + ",";
                                        locatedSearchResult.rank += rank;
                                    }
                                }
                                if (positions != null) {
                                    if (locatedSearchResult.keywordPositions == null) {
                                        locatedSearchResult.keywordPositions = {};
                                    }
                                    locatedSearchResult.keywordPositions["_".concat(searchTerm_1)] = positions;
                                }
                            }
                        }
                    }
                    // Split search results into title matches and non-title matches
                    var titleMatches = [];
                    var nonTitleMatches = [];
                    searchResults.sort(function (a, b) {
                        // Helper: returns true if any search term is a phrase and is found in keywords
                        function hasExactPhrase(result) {
                            var terms = result.searchTerm.split(',').map(function (t) { return t.trim(); }).filter(Boolean);
                            return terms.some(function (term) { return term.indexOf(' ') !== -1 &&
                                result.keywords.toLowerCase().indexOf(term.toLowerCase()) !== -1; });
                        }
                        // Helper: returns the number of unique search terms found in keywords
                        function countUniqueTerms(result) {
                            var terms = result.searchTerm.split(',').map(function (t) { return t.trim(); }).filter(Boolean);
                            var count = 0;
                            for (var _i = 0, terms_1 = terms; _i < terms_1.length; _i++) {
                                var term = terms_1[_i];
                                if (result.keywords.toLowerCase().indexOf(term.toLowerCase()) !== -1) {
                                    count++;
                                }
                            }
                            return count;
                        }
                        // 1. Prioritize exact phrase matches
                        var aExactPhrase = hasExactPhrase(a);
                        var bExactPhrase = hasExactPhrase(b);
                        if (aExactPhrase !== bExactPhrase) {
                            if (aExactPhrase)
                                a.rank += 1000;
                            if (bExactPhrase)
                                b.rank += 1000;
                        }
                        // 2. Prioritize results matching more unique words
                        var aWordCount = countUniqueTerms(a);
                        var bWordCount = countUniqueTerms(b);
                        if (aWordCount !== bWordCount) {
                            // Boost for multiple words
                            if (aWordCount > 1)
                                a.rank += 10 * aWordCount;
                            if (bWordCount > 1)
                                b.rank += 10 * bWordCount;
                        }
                        // 3. Fallback to rank
                        return b.rank - a.rank;
                    });
                    for (var _i = 0, searchResults_1 = searchResults; _i < searchResults_1.length; _i++) {
                        var searchResult = searchResults_1[_i];
                        if (searchResult && searchResult.searchFile) {
                            var isTitleMatch = false;
                            for (var _a = 0, searchTerms_1 = searchTerms; _a < searchTerms_1.length; _a++) {
                                var searchTerm_2 = searchTerms_1[_a];
                                if (searchResult.searchFile.title.toLowerCase().indexOf(searchTerm_2.toLowerCase()) !== -1) {
                                    isTitleMatch = true;
                                    break;
                                }
                            }
                            if (isTitleMatch) {
                                titleMatches.push(searchResult);
                            }
                            else {
                                nonTitleMatches.push(searchResult);
                            }
                        }
                    }
                    // Ensure title matches have a higher rank than non-title matches
                    var wordMatches = [];
                    var titleLower;
                    var allTermsInTitle = true;
                    var isExact = false;
                    var isWordMatch = false;
                    var _loop_1 = function (titleMatch) {
                        for (var _d = 0, nonTitleMatches_1 = nonTitleMatches; _d < nonTitleMatches_1.length; _d++) {
                            var nonTitleMatch = nonTitleMatches_1[_d];
                            if (titleMatch.rank <= nonTitleMatch.rank) {
                                titleMatch.rank = nonTitleMatch.rank + 10;
                            }
                        }
                        // Increment titleMatch rank based on the number of instances of search terms in the keywords
                        var keywordInstances = 0;
                        for (var _e = 0, searchTerms_2 = searchTerms; _e < searchTerms_2.length; _e++) {
                            var searchTerm_3 = searchTerms_2[_e];
                            var regex = new RegExp(searchTerm_3, 'gi');
                            var matches = titleMatch.keywords.match(regex);
                            if (matches) {
                                keywordInstances += matches.length;
                            }
                        }
                        // Add keyword instances to the rank
                        titleMatch.rank += keywordInstances;
                        // Add alphabetical ranking for any title matches that are equal
                        equalRankTitles = titleMatches.filter(function (t) { return t.rank === titleMatch.rank; });
                        if (equalRankTitles.length > 1) {
                            // Sort so titles containing all search terms come first, then exact matches, then substring word matches, then alphabetically
                            equalRankTitles.sort(function (a, b) {
                                var aTitle = a.searchFile.title.toLowerCase();
                                var bTitle = b.searchFile.title.toLowerCase();
                                // Check if all search terms are in the title
                                var allTermsInA = true, allTermsInB = true;
                                for (var c = 0; c < searchTerms.length; c++) {
                                    if (aTitle.indexOf(searchTerms[c].toLowerCase()) === -1)
                                        allTermsInA = false;
                                    if (bTitle.indexOf(searchTerms[c].toLowerCase()) === -1)
                                        allTermsInB = false;
                                }
                                if (allTermsInA !== allTermsInB)
                                    return allTermsInB ? 1 : -1;
                                // Check for exact title match
                                var aExact = false, bExact = false;
                                for (var d = 0; d < searchTerms.length; d++) {
                                    if (aTitle === searchTerms[d].toLowerCase())
                                        aExact = true;
                                    if (bTitle === searchTerms[d].toLowerCase())
                                        bExact = true;
                                }
                                if (aExact !== bExact)
                                    return bExact ? 1 : -1;
                                // Check for whole word match in title (e.g. "RSSItem" in "RSSItem Constructor" but not in "RssItems Property")
                                function hasWholeWord(title, term) {
                                    var re = new RegExp("\\b" + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "\\b", "i");
                                    return re.test(title);
                                }
                                var aWordMatch = false, bWordMatch = false;
                                for (var e = 0; e < searchTerms.length; e++) {
                                    if (hasWholeWord(aTitle, searchTerms[e]))
                                        aWordMatch = true;
                                    if (hasWholeWord(bTitle, searchTerms[e]))
                                        bWordMatch = true;
                                }
                                if (aWordMatch !== bWordMatch)
                                    return bWordMatch ? 1 : -1;
                                return aTitle.localeCompare(bTitle);
                            });
                            for (var f = 0; f < equalRankTitles.length; f++) {
                                wordMatches = [];
                                titleLower = equalRankTitles[f].searchFile.title.toLowerCase();
                                allTermsInTitle = true;
                                isExact = false;
                                isWordMatch = false;
                                for (var g = 0; g < searchTerms.length; g++) {
                                    if (titleLower.indexOf(searchTerms[g].toLowerCase()) === -1)
                                        allTermsInTitle = false;
                                    if (titleLower === searchTerms[g].toLowerCase())
                                        isExact = true;
                                    // Whole word match
                                    if (this_1.hasWholeWord(titleLower, searchTerms[g])) {
                                        isWordMatch = true;
                                        wordMatches.push(isWordMatch);
                                    }
                                }
                                if (allTermsInTitle || isExact) {
                                    equalRankTitles[f].rank += 2000; // Boost for exact match
                                }
                                if (isWordMatch) {
                                    for (var w = 0; w < wordMatches.length; w++) {
                                        if (wordMatches[w]) {
                                            equalRankTitles[f].rank += 500; // Boost for each whole word match
                                        }
                                    }
                                }
                                else {
                                    equalRankTitles[f].rank += f;
                                }
                            }
                            for (var g = 0; g < titleMatches.length; g++) {
                                wordMatches = [];
                                titleLower = titleMatches[g].searchFile.title.toLowerCase();
                                allTermsInTitle = true;
                                isExact = false;
                                isWordMatch = false;
                                for (var h = 0; h < searchTerms.length; h++) {
                                    if (titleLower.indexOf(searchTerms[h].toLowerCase()) === -1)
                                        allTermsInTitle = false;
                                    if (titleLower === searchTerms[h].toLowerCase())
                                        isExact = true;
                                    // Whole word match
                                    if (this_1.hasWholeWord(titleLower, searchTerms[h])) {
                                        isWordMatch = true;
                                        wordMatches.push(isWordMatch);
                                    }
                                }
                                if (allTermsInTitle || isExact) {
                                    titleMatches[g].rank += 2000; // Boost for exact match
                                }
                                if (isWordMatch) {
                                    for (var w = 0; w < wordMatches.length; w++) {
                                        if (wordMatches[w] === true) {
                                            titleMatches[g].rank += 500; // Boost for each whole word match
                                        }
                                    }
                                }
                                else {
                                    titleMatches[g].rank += g;
                                }
                            }
                        }
                    };
                    var this_1 = this, equalRankTitles;
                    for (var _b = 0, titleMatches_1 = titleMatches; _b < titleMatches_1.length; _b++) {
                        var titleMatch = titleMatches_1[_b];
                        _loop_1(titleMatch);
                    }
                    // Ensure all search results that match titles exact have a higher rank that others
                    for (var _c = 0, titleMatches_2 = titleMatches; _c < titleMatches_2.length; _c++) {
                        var titleMatch = titleMatches_2[_c];
                        wordMatches = [];
                        titleLower = titleMatch.searchFile.title.toLowerCase();
                        allTermsInTitle = true;
                        isExact = false;
                        isWordMatch = false;
                        var isTitleStartsWithTerm = false;
                        for (var k = 0; k < searchTerms.length; k++) {
                            var termLower = searchTerms[k].toLowerCase();
                            if (titleLower.indexOf(termLower) === -1)
                                allTermsInTitle = false;
                            if (titleLower === termLower)
                                isExact = true;
                            // Whole word match
                            if (this.hasWholeWord(titleLower, searchTerms[k])) {
                                isWordMatch = true;
                                wordMatches.push(isWordMatch);
                            }
                            // Title starts with term and is followed by space or is the only word
                            if (titleLower.indexOf(termLower) === 0 &&
                                (titleLower.length === termLower.length ||
                                    titleLower.charAt(termLower.length) === ' ')) {
                                isTitleStartsWithTerm = true;
                            }
                        }
                        if (isTitleStartsWithTerm) {
                            titleMatch.rank += 3000; // Highest boost for title starting with term
                        }
                        if (allTermsInTitle || isExact) {
                            titleMatch.rank += 2000; // Boost for exact match
                        }
                        if (isWordMatch) {
                            for (var w = 0; w < wordMatches.length; w++) {
                                if (wordMatches[w] === true) {
                                    titleMatch.rank += 500; // Boost for each whole word match
                                }
                            }
                        }
                    }
                    // Find the minimum rank among title matches (or use a high default if none)
                    var minTitleRank = titleMatches.length > 0
                        ? Math.min.apply(Math, titleMatches.map(function (t) { return t.rank; })) : 1000000;
                    // Find the max term instance count among non-title matches
                    var maxInstanceCount = 0;
                    nonTitleMatches.forEach(function (result) {
                        var count = _this.countTermInstancesExcludingTitle(result, searchTerms);
                        result.__instanceCount = count;
                        if (count > maxInstanceCount)
                            maxInstanceCount = count;
                    });
                    // Sort non-title matches by number of term instances (descending)
                    nonTitleMatches.forEach(function (result, idx) {
                        // Spread the ranks just below minTitleRank, highest instance count gets highest rank
                        // If there are N non-title matches, their ranks will be minTitleRank-1, minTitleRank-2, ...
                        result.rank = minTitleRank - (maxInstanceCount > 0 ? ((maxInstanceCount - result.__instanceCount) + 1) : (idx + 1));
                    });
                    // Combine the lists and sort by rank
                    searchResults = __spreadArray(__spreadArray([], titleMatches, true), nonTitleMatches, true).sort(function (a, b) {
                        if (a.rank !== b.rank) {
                            return b.rank - a.rank; // Descending rank
                        }
                        var aTitle = a.searchFile && a.searchFile.title ? a.searchFile.title.toLowerCase() : "";
                        var bTitle = b.searchFile && b.searchFile.title ? b.searchFile.title.toLowerCase() : "";
                        return aTitle.localeCompare(bTitle); // Ascending alphabetical
                    });
                    return searchResults;
                };
                SearchDocumentFeature.prototype.countTermInstancesExcludingTitle = function (result, searchTerms) {
                    if (!result || !result.searchFile || !result.keywords)
                        return 0;
                    var title = result.searchFile.title || "";
                    var keywords = result.keywords || "";
                    // Remove the title from the keywords string (case-insensitive)
                    var titleIndex = keywords.toLowerCase().indexOf(title.toLowerCase());
                    if (titleIndex !== -1) {
                        keywords = keywords.substring(0, titleIndex) + keywords.substring(titleIndex + title.length);
                    }
                    var count = 0;
                    for (var _i = 0, searchTerms_3 = searchTerms; _i < searchTerms_3.length; _i++) {
                        var term = searchTerms_3[_i];
                        var regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
                        var matches = keywords.match(regex);
                        if (matches)
                            count += matches.length;
                    }
                    return count;
                };
                SearchDocumentFeature.prototype.hasWholeWord = function (title, term) {
                    if (!title || !term)
                        return false;
                    var lowerTitle = title.toLowerCase();
                    var lowerTerm = term.toLowerCase();
                    // Exact match
                    if (lowerTitle === lowerTerm)
                        return true;
                    // Whole word match (word boundary)
                    var re = new RegExp("\\b" + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "\\b", "i");
                    if (re.test(title))
                        return true;
                    // Substring within a word
                    return lowerTitle.indexOf(lowerTerm) !== -1;
                };
                SearchDocumentFeature.prototype.getTermOrPhrasePositions = function (matchedWord, searchTerm) {
                    var wordPositions = [];
                    var searchTermLower = searchTerm.toLowerCase();
                    var matchedWordLower = matchedWord.toLowerCase();
                    // Only match contiguous phrases (not across newlines or tags)
                    // \s matches whitespace, [^\S\r\n] matches whitespace except newlines
                    var phraseRegex = new RegExp(searchTermLower.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "g");
                    var match;
                    while ((match = phraseRegex.exec(matchedWordLower)) !== null) {
                        var position = match.index;
                        // Calculate the number of words before the matched position
                        var wordsBefore = matchedWordLower.substring(0, position).split(/\s+/).length - 1;
                        wordPositions.push([wordsBefore]);
                    }
                    return wordPositions;
                };
                SearchDocumentFeature.prototype.sort = function (items, sortTerm) {
                    var _this = this;
                    var sorterResult = window.matchSorter.matchSorter(items, sortTerm, {
                        threshold: window.matchSorter.rankings.CONTAINS
                    });
                    // Extract the ranking value from the results
                    var rankIndex = 0;
                    var rankedResults = sorterResult.map(function (result) {
                        rankIndex += 1;
                        return {
                            item: result,
                            rank: rankIndex + _this.getTermCount(result, sortTerm)
                        };
                    });
                    return rankedResults;
                };
                SearchDocumentFeature.prototype.getTermCount = function (result, term) {
                    var regex = typeof term === 'string' ? new RegExp(term, 'gi') : term;
                    var matches = result.match(regex);
                    return matches ? matches.length : 0;
                };
                ;
                SearchDocumentFeature.prototype.buildResultsArray = function (query, searchResults) {
                    var results = [];
                    for (var _i = 0, searchResults_2 = searchResults; _i < searchResults_2.length; _i++) {
                        var searchResult = searchResults_2[_i];
                        if (searchResult !== undefined && searchResult !== null) {
                            // Note: Used in eval below
                            var searchTerms = searchResult.searchTerm.replace(/"/g, "");
                            var result = false;
                            try {
                                /* eslint-disable-next-line no-eval */
                                result = eval(query);
                            }
                            catch (ex) {
                                // Entered term caused a Javascript syntax error
                            }
                            if (result) {
                                results.push(searchResult);
                            }
                        }
                    }
                    return results;
                };
                SearchDocumentFeature.prototype.getPhrase = function (name) {
                    var span = $("#phrase_".concat(name));
                    if (span.length > 0) {
                        return span.html();
                    }
                };
                SearchDocumentFeature.prototype.outputResults = function (searchResults) {
                    // Calculate pagination
                    var totalPages = Math.ceil(searchResults.length / this.resultsPerPage);
                    var startIndex = (this.currentPage - 1) * this.resultsPerPage;
                    var endIndex = Math.min(startIndex + this.resultsPerPage, searchResults.length);
                    if (totalPages === 0) {
                        this.currentPage = 0;
                    }
                    // init table html
                    var tableHtml = "<hr /><p class=\"i-search-title\">".concat(this.getPhrase("Search_SearchResults"), "</p>");
                    tableHtml += "<table class=\"i-result-list\">";
                    // add results to table
                    for (var i = startIndex; i < endIndex; i++) {
                        var searchResult = searchResults[i];
                        if (typeof searchResult !== "undefined") {
                            var snippetInformation = this.getSnippet(searchResult);
                            var firstSnippet = snippetInformation.firstSnippet;
                            var displaySnippet = snippetInformation.displaySnippet;
                            if (displaySnippet.indexOf(' ...') !== displaySnippet.length - 4) {
                                displaySnippet += ' ...';
                            }
                            var markedSnippets = '<div>' + displaySnippet + '</div>';
                            tableHtml += "<tr class=\"i-result-tr\">";
                            tableHtml += "<td>";
                            tableHtml += "<h3><a class=\"i-result\" ".concat(!this._isFullTextSearchFrameless ? "target=\"i-content\" " : "", "href=\"").concat(searchResult.searchFile.url, "\" data-result-terms=\"").concat(searchResult.searchTerm, "\" data-result-index=\"").concat(searchResult.fileIndex, "\">").concat(searchResult.searchFile.title, "</a></h3>");
                            tableHtml += "<div class=\"i-result-url\">".concat(searchResult.searchFile.url, "</div>");
                            tableHtml += "<div class=\"i-result-snippet\">";
                            tableHtml += "<div class=\"expander\" onclick=\"const content = this.nextElementSibling; content.style.display = content.style.display === 'none' ? 'block' : 'none'; const icon = this.querySelector('.i-expander-icon'); icon.classList.toggle('expanded');   icon.classList.toggle('collapsed');\"><div class=\"i-expander-icon collapsed\"></div><span class=\"i-snippet-centre\" >".concat(firstSnippet, "</span></div>");
                            tableHtml += "<div class=\"expander-content\" style=\"display: none;\">".concat(markedSnippets, "</div>");
                            tableHtml += "<div class=\"i-result-keywords\">".concat(this.formatKeywordInstances(searchResult.searchTerm, snippetInformation.termInstances), "</div>");
                            tableHtml += "</div>";
                            tableHtml += "</td>";
                            tableHtml += "</tr>";
                        }
                    }
                    // add pagination controls
                    tableHtml += "</table>";
                    tableHtml += "<p>".concat(searchResults.length, " ").concat(this.getPhrase("Search_ResultCount"), "</p>");
                    // set it
                    $("#i-results", this._rootSelector).html(tableHtml);
                    var paginationHtml = "<button id=\"i-first-search-page\" ".concat(this.currentPage === 1 || this.currentPage === 0 ? 'disabled' : '', ">First</button>\n    <button id=\"i-previous-search-page\" ").concat(this.currentPage === 1 || this.currentPage === 0 ? 'disabled' : '', ">Previous</button>\n    <span class=\"pagination-info\">Page ").concat(this.currentPage, " / ").concat(totalPages, "</span>\n    <button id=\"i-next-search-page\" ").concat(this.currentPage === totalPages ? 'disabled' : '', ">Next</button>\n    <button id=\"i-last-search-page\" ").concat(this.currentPage === totalPages ? 'disabled' : '', ">Last</button>");
                    $(".pagination", this._rootSelector).html(paginationHtml);
                    // Add event listeners for pagination buttons
                    var self = this; // Capture the correct `this` context
                    if (this.currentPage > 1) {
                        document.getElementById("i-first-search-page").onclick = function () {
                            searchDocumentFeature.changePage(1);
                        };
                        document.getElementById("i-previous-search-page").onclick = function () {
                            searchDocumentFeature.changePage(self.currentPage - 1);
                        };
                    }
                    if (this.currentPage < totalPages) {
                        document.getElementById("i-next-search-page").onclick = function () {
                            searchDocumentFeature.changePage(self.currentPage + 1);
                        };
                        document.getElementById("i-last-search-page").onclick = function () {
                            searchDocumentFeature.changePage(totalPages);
                        };
                    }
                };
                SearchDocumentFeature.prototype.changePage = function (page) {
                    this.currentPage = page;
                    this.outputResults(this._results);
                };
                SearchDocumentFeature.prototype.getSnippet = function (searchResult) {
                    var highlight = $("#i-highlight", this._rootSelector);
                    var displaySnippet = null;
                    var searchTerms = searchResult.searchTerm.split(',').map(function (term) { return term.trim(); }).filter(function (term) { return term !== ""; });
                    var firstHighlightSnippet = null;
                    var termInstances = {};
                    var searchText = "";
                    var term = null;
                    var i = 0;
                    var title = searchResult.searchFile.title || "";
                    var titleLower = title.toLowerCase();
                    for (i = 0; i < searchTerms.length; i++) {
                        term = searchTerms[i];
                        searchText = searchResult.keywords;
                        var searchTermLower = term.toLowerCase();
                        var searchTextLower = searchText.toLowerCase();
                        if ((displaySnippet !== null && displaySnippet !== undefined) || (firstHighlightSnippet !== null && firstHighlightSnippet !== undefined)) {
                            if (highlight.is(":checked") === true) {
                                firstHighlightSnippet = this.highlightAvailableTerms(firstHighlightSnippet, searchTermLower, titleLower);
                                firstHighlightSnippet = this.highlightAvailableTermsWithoutDiacritics(firstHighlightSnippet, searchTermLower, titleLower);
                                displaySnippet = this.highlightAvailableTerms(displaySnippet, searchTermLower, titleLower);
                                displaySnippet = this.highlightAvailableTermsWithoutDiacritics(displaySnippet, searchTermLower, titleLower);
                            }
                            continue;
                        }
                        var position = searchTextLower.indexOf(searchTermLower);
                        // Fix: declare lowerTermWithoutDiacritics before use
                        var lowerTermWithoutDiacritics = searchTermLower;
                        if (position === -1) {
                            var searchTextWithoutDiacritics = this._diacriticsHelper.removeDiacritics(searchTextLower);
                            lowerTermWithoutDiacritics = this._diacriticsHelper.removeDiacritics(searchTermLower);
                            position = searchTextWithoutDiacritics.indexOf(lowerTermWithoutDiacritics);
                        }
                        while (position !== -1) {
                            // Find the end of the title in the keywords string
                            var searchTextLower = searchText.toLowerCase();
                            var titleIdx = searchTextLower.indexOf(titleLower);
                            var snippetStart = 0;
                            // If the title is found, start after the title
                            if (titleIdx !== -1) {
                                snippetStart = titleIdx + title.length;
                            }
                            // Only consider matches after the title
                            if (position < snippetStart) {
                                position = searchTextLower.indexOf(searchTermLower, snippetStart);
                                if (position === -1) {
                                    position = searchTextLower.indexOf(lowerTermWithoutDiacritics, snippetStart);
                                }
                                else {
                                    // If the position is still before the title, continue searching
                                    continue;
                                }
                            }
                            var start = Math.max(position - 60, snippetStart);
                            var end = Math.min(position + searchTermLower.length + 60, searchText.length);
                            var snippet = searchText.substring(start, end);
                            // Highlight the search term in the snippet (but not in the title)
                            var highlightSnippet = highlight.is(":checked") === true ? this.highlightAvailableTerms(snippet, searchTermLower, titleLower) : snippet;
                            highlightSnippet = highlight.is(":checked") === true ? this.highlightAvailableTermsWithoutDiacritics(highlightSnippet, lowerTermWithoutDiacritics, titleLower) : highlightSnippet;
                            var expandIdx = snippet.indexOf("Expand All");
                            var collapseIdx = snippet.indexOf("Collapse All");
                            var afterIdx = -1;
                            if (expandIdx !== -1) {
                                afterIdx = expandIdx + "Expand All".length;
                            }
                            else if (collapseIdx !== -1) {
                                afterIdx = collapseIdx + "Collapse All".length;
                            }
                            if (afterIdx !== -1) {
                                // Find the first word after "Expand All" or "Collapse All"
                                var rest = snippet.substring(afterIdx).trim();
                                var firstWordMatch = rest.match(/^\w+/);
                                if (firstWordMatch) {
                                    var firstWordIdx = snippet.indexOf(firstWordMatch[0], afterIdx);
                                    // Rebuild snippet from the first word after the marker
                                    snippet = snippet.substring(firstWordIdx, end);
                                }
                            }
                            // Set the first highlighted snippet (120 characters)
                            if (firstHighlightSnippet === null || firstHighlightSnippet === undefined) {
                                firstHighlightSnippet = highlightSnippet;
                                if (start > snippetStart) {
                                    firstHighlightSnippet = '... ' + firstHighlightSnippet;
                                }
                                if (end < searchText.length) {
                                    firstHighlightSnippet = firstHighlightSnippet + ' ...';
                                }
                            }
                            // Update or add the term in the termInstances list
                            if (!termInstances[term]) {
                                termInstances[term] = 0;
                            }
                            start = Math.max(position - 120, snippetStart);
                            end = Math.min(position + searchTermLower.length + 126, searchText.length);
                            snippet = searchText.substring(start, end);
                            // Check for "Expand All" or "Collapse All" in the snippet
                            afterIdx = -1;
                            if (expandIdx !== -1) {
                                afterIdx = expandIdx + "Expand All".length;
                            }
                            else if (collapseIdx !== -1) {
                                afterIdx = collapseIdx + "Collapse All".length;
                            }
                            if (afterIdx !== -1) {
                                // Find the first word after "Expand All" or "Collapse All"
                                var rest = snippet.substring(afterIdx).trim();
                                var firstWordMatch = rest.match(/^\w+/);
                                if (firstWordMatch) {
                                    var firstWordIdx = snippet.indexOf(firstWordMatch[0], afterIdx);
                                    // Rebuild snippet from the first word after the marker
                                    snippet = snippet.substring(firstWordIdx, end);
                                }
                            }
                            // Highlight the search term in the snippet (but not in the title)
                            displaySnippet = highlight.is(":checked") === true ? this.highlightAvailableTerms(snippet, searchTermLower, titleLower) : snippet;
                            break;
                        }
                        // Ensure all terms in termInstances are accounted for, even if not found in the current snippet
                        for (var _i = 0, searchTerms_4 = searchTerms; _i < searchTerms_4.length; _i++) {
                            var currentTerm = searchTerms_4[_i];
                            if (!termInstances[currentTerm]) {
                                termInstances[currentTerm] = 0; // Add the term with a count of 0 if it does not exist
                            }
                        }
                    }
                    // Update any snippets that have any additional search terms in them
                    for (var k = 0; k < searchTerms.length; k++) {
                        if (searchText !== null && searchText !== undefined) {
                            // Find the end of the title in the keywords/content
                            var title = searchResult.searchFile.title || "";
                            var searchTextLower = searchText.toLowerCase();
                            var titleLower = title.toLowerCase();
                            var titleIdx = searchTextLower.indexOf(titleLower);
                            var highlightStart = 0;
                            if (titleIdx !== -1) {
                                highlightStart = titleIdx + title.length;
                            }
                            // Only highlight after the title
                            var beforeTitle = searchText.substring(0, highlightStart);
                            var afterTitle = searchText.substring(highlightStart);
                            if (afterTitle.indexOf(searchTerms[k]) === -1 &&
                                afterTitle.indexOf(this._diacriticsHelper.removeDiacritics(searchTerms[k])) === -1) {
                                // If the search term is not found after the title, highlight it
                                searchText = this.highlightAvailableTerms(searchText, searchTerms[k], titleLower);
                                searchText = this.highlightAvailableTermsWithoutDiacritics(searchText, searchTerms[k], titleLower);
                            }
                            else {
                                var highlightedAfterTitle = this.highlightAvailableTerms(afterTitle, searchTerms[k], titleLower);
                                highlightedAfterTitle = this.highlightAvailableTermsWithoutDiacritics(highlightedAfterTitle, searchTerms[k], titleLower);
                                searchText = beforeTitle + highlightedAfterTitle;
                            }
                        }
                        if (firstHighlightSnippet !== null && firstHighlightSnippet !== undefined && highlight.is(":checked") === true) {
                            firstHighlightSnippet = this.highlightAvailableTerms(firstHighlightSnippet, searchTerms[k], titleLower);
                            firstHighlightSnippet = this.highlightAvailableTermsWithoutDiacritics(firstHighlightSnippet, searchTerms[k], titleLower);
                        }
                        if (displaySnippet !== null && displaySnippet !== undefined && highlight.is(":checked") === true) {
                            displaySnippet = this.highlightAvailableTerms(displaySnippet, searchTerms[k], titleLower);
                            displaySnippet = this.highlightAvailableTermsWithoutDiacritics(displaySnippet, searchTerms[k], titleLower);
                        }
                    }
                    for (var j = 0; j < searchTerms.length; j++) {
                        var count = 0;
                        // Only count terms that are actually inside highlight spans
                        var tempDiv = document.createElement("div");
                        tempDiv.innerHTML = searchText;
                        var highlights = tempDiv.querySelectorAll("span.i-search-highlight");
                        for (var h = 0; h < highlights.length; h++) {
                            if (this._diacriticsHelper.removeDiacritics(highlights[h].textContent.toLowerCase()) === this._diacriticsHelper.removeDiacritics(searchTerms[j]) ||
                                highlights[h].textContent.toLowerCase() === searchTerms[j]) {
                                count++;
                            }
                        }
                        if (!termInstances[searchTerms[j]]) {
                            termInstances[searchTerms[j]] = 0;
                        }
                        termInstances[searchTerms[j]] += count;
                    }
                    firstHighlightSnippet = this.cleanSnippet(firstHighlightSnippet);
                    displaySnippet = this.cleanSnippet(displaySnippet);
                    return { firstSnippet: firstHighlightSnippet, displaySnippet: displaySnippet, termInstances: termInstances };
                };
                SearchDocumentFeature.prototype.cleanSnippet = function (snippet) {
                    if (!snippet)
                        return snippet;
                    // Allow a wide range of non-Latin scripts and pictographs, plus common punctuation, tags, and ellipsis.
                    // Unicode ranges include: CJK, Hiragana, Katakana, Hangul, Thai, Devanagari, Arabic, Hebrew, Greek, Cyrillic,
                    // Georgian, Armenian, Ethiopic, Tamil, Bengali, Lao, Khmer, Myanmar, and various pictographs and symbols.
                    // \u4E00-\u9FFF (CJK Unified Ideographs)
                    // \u3040-\u309F (Hiragana)
                    // \u30A0-\u30FF (Katakana)
                    // \uAC00-\uD7AF (Hangul Syllables)
                    // \u0E00-\u0E7F (Thai)
                    // \u0900-\u097F (Devanagari)
                    // \u0600-\u06FF (Arabic)
                    // \u0590-\u05FF (Hebrew)
                    // \u0370-\u03FF (Greek)
                    // \u0400-\u04FF (Cyrillic)
                    // \u10A0-\u10FF (Georgian)
                    // \u0530-\u058F (Armenian)
                    // \u1200-\u137F (Ethiopic)
                    // \u0B80-\u0BFF (Tamil)
                    // \u0980-\u09FF (Bengali)
                    // \u0ED0-\u0EFF (Lao)
                    // \u1780-\u17FF (Khmer)
                    // \u1000-\u109F (Myanmar)
                    // \u1F300-\u1F5FF (Miscellaneous Symbols and Pictographs)
                    // \u1F600-\u1F64F (Emoticons)
                    // \u1F680-\u1F6FF (Transport and Map Symbols)
                    // \u1F700-\u1F77F (Alchemical Symbols)
                    // \u1F780-\u1F7FF (Geometric Shapes Extended)
                    // \u1F800-\u1F8FF (Supplemental Arrows-C)
                    // \u1F900-\u1F9FF (Supplemental Symbols and Pictographs)
                    // \u1FA00-\u1FA6F (Chess Symbols)
                    // \u1FA70-\u1FAFF (Symbols and Pictographs Extended-A)
                    return snippet.replace(/(?!<[^>]*>)(?!\.\.\.)([^\w\s.,;:!?'"’ء״׳()\[\]{}\-<>=\/\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF\u0E00-\u0E7F\u0900-\u097F\u0600-\u06FF\u0590-\u05FF\u0370-\u03FF\u0400-\u04FF\u10A0-\u10FF\u0530-\u058F\u1200-\u137F\u0B80-\u0BFF\u0980-\u09FF\u0ED0-\u0EFF\u1780-\u17FF\u1000-\u109F\u1F300-\u1F5FF\u1F600-\u1F64F\u1F680-\u1F6FF\u1F700-\u1F77F\u1F780-\u1F7FF\u1F800-\u1F8FF\u1F900-\u1F9FF\u1FA00-\u1FA6F\u1FA70-\u1FAFF])/g, "");
                };
                SearchDocumentFeature.prototype.getNextAvailableMatch = function (text, term, startIdx) {
                    var idx = text.indexOf(term, startIdx);
                    mainLoop: while (idx !== -1) {
                        // Fast check for being inside a tag using lastIndexOf instead of char-by-char loop
                        var lastLt = text.lastIndexOf('<span', idx);
                        var lastGt = text.lastIndexOf('span>', idx);
                        if (lastLt === -1 || lastGt > lastLt) {
                            // Not inside a tag
                            var before = text.substring(0, idx);
                            var openTag = before.lastIndexOf('<span class="i-search-highlight">');
                            var closeTag = before.lastIndexOf('</span>');
                            if (openTag === -1 || openTag < closeTag) {
                                return idx;
                            }
                        }
                        idx = text.indexOf(term, idx + term.length);
                    }
                    return -1;
                };
                SearchDocumentFeature.prototype.highlightAvailableTerms = function (text, term, title) {
                    var result = '';
                    var searchText = String(text); // Ensure text is a string
                    var lowerText = searchText.toLowerCase();
                    var lowerTerm = String(term).toLowerCase(); // Ensure term is a string
                    // Find the index of the title
                    var startIndex = 0;
                    // Now, search for and highlight the term from the determined startIndex
                    var lastIdx = startIndex;
                    var currentSearchText = searchText.substring(startIndex);
                    var currentLowerText = lowerText.substring(startIndex);
                    // Re-define idx using the substring
                    var idx = this.getNextAvailableMatch(currentLowerText, lowerTerm, 0);
                    while (idx !== -1) {
                        result += currentSearchText.substring(lastIdx - startIndex, idx);
                        var highlightedText = currentSearchText.substring(idx, idx + lowerTerm.length);
                        result += "<span class=\"i-search-highlight\">".concat(highlightedText, "</span>");
                        lastIdx = idx + lowerTerm.length + startIndex; // Adjust lastIdx to be relative to the original string
                        idx = this.getNextAvailableMatch(currentLowerText, lowerTerm, idx + lowerTerm.length);
                    }
                    // Add any remaining text
                    if (lastIdx < searchText.length) {
                        result += searchText.substring(lastIdx);
                    }
                    return result;
                };
                SearchDocumentFeature.prototype.highlightAvailableTermsWithoutDiacritics = function (text, term, title) {
                    // ES5 only, diacritic-insensitive fallback used only if there are NO existing highlight spans
                    if (text == null || term == null)
                        return text;
                    var originalText = String(text);
                    // If already highlighted, don't touch (requirement: only run if no highlight spans)
                    if (originalText.indexOf('i-search-highlight') !== -1)
                        return originalText;
                    var rawTerm = String(term);
                    if (rawTerm.length === 0)
                        return originalText;
                    if (!this._diacriticsHelper || typeof this._diacriticsHelper.removeDiacritics !== "function")
                        return originalText;
                    // Normalized (diacritics removed) versions (assumes helper is length-preserving; if not, mapping would be required)
                    var normText = this._diacriticsHelper.removeDiacritics(originalText);
                    var normTerm = this._diacriticsHelper.removeDiacritics(rawTerm);
                    if (!normTerm)
                        return originalText;
                    var result = '';
                    var searchText = String(normText); // Ensure text is a string
                    var lowerText = searchText.toLowerCase();
                    var lowerTerm = String(normTerm).toLowerCase(); // Ensure term is a string
                    // Find the index of the title
                    var startIndex = 0;
                    // Now, search for and highlight the term from the determined startIndex
                    var lastIdx = startIndex;
                    var currentSearchText = searchText.substring(startIndex);
                    var currentLowerText = lowerText.substring(startIndex);
                    // Re-define idx using the substring
                    var idx = this.getNextAvailableMatch(currentLowerText, lowerTerm, 0);
                    while (idx !== -1) {
                        result += originalText.substring(lastIdx - startIndex, idx);
                        var highlightedText = originalText.substring(idx, idx + lowerTerm.length);
                        result += "<span class=\"i-search-highlight\">".concat(highlightedText, "</span>");
                        lastIdx = idx + lowerTerm.length + startIndex; // Adjust lastIdx to be relative to the original string
                        idx = this.getNextAvailableMatch(currentLowerText, lowerTerm, idx + lowerTerm.length);
                    }
                    // Add any remaining text
                    if (lastIdx < searchText.length) {
                        result += searchText.substring(lastIdx);
                    }
                    return result;
                };
                SearchDocumentFeature.prototype.formatKeywordInstances = function (searchTerm, termInstances) {
                    var formattedInstances = "<strong>Keywords Instances:</strong><br />";
                    var terms = searchTerm.split(',').map(function (term) { return term.trim(); }).filter(function (term) { return term !== ""; });
                    for (var _i = 0, terms_2 = terms; _i < terms_2.length; _i++) {
                        var term = terms_2[_i];
                        var count = termInstances[term];
                        if (count !== undefined && count !== null) {
                            formattedInstances += '<div class="i-keyword">' + term + ' (' + count + ')</div>';
                        }
                    }
                    if (formattedInstances === "<strong>Keywords Instances:</strong><br />") {
                        formattedInstances = "";
                    }
                    else {
                        formattedInstances = formattedInstances.replace(/<div class="i-keyword">(<\/div>)+/g, ""); // Remove empty divs
                    }
                    return formattedInstances;
                };
                SearchDocumentFeature.prototype.showSearchResult = function (hRef, resultTerms, resultIndex) {
                    var highlight = $("#i-highlight", this._rootSelector);
                    var webFrame = null;
                    if (window.parent != null && window.parent.parent != null) {
                        webFrame = window.parent.parent;
                    }
                    if (highlight.is(":checked")) {
                        // message listener takes care of highlight when the content loads
                        this._webSearchPendingHighlight = hRef;
                    }
                    if (!this._isFullTextSearchFrameless && webFrame != null) {
                        // full text search, navigate to the result in the content frame
                        if (resultTerms != null && highlight.is(":checked")) {
                            if (resultIndex !== null) {
                                this._clickedResult = this.getClickedResult(resultIndex);
                                if (hRef !== this._clickedResult.searchFile.url) {
                                    hRef = this._clickedResult.searchFile.url;
                                }
                                if (resultTerms !== this._clickedResult.searchTerm) {
                                    resultTerms = this._clickedResult.searchTerm;
                                }
                            }
                            hRef = "".concat(hRef, "?highlight=").concat(encodeURIComponent(resultTerms));
                        }
                        Content.Messaging.routeMessageToWindow(webFrame, Features.NavigationMessageNames.navigate, hRef);
                        Content.Messaging.routeMessageToWindow(webFrame, Features.NavigationMessageNames.closeNavigationPane, null);
                    }
                    else {
                        // frameless search, navigate to the result
                        if (resultTerms != null && highlight.is(":checked")) {
                            if (resultIndex !== null) {
                                this._clickedResult = this.getClickedResult(resultIndex);
                                if (hRef !== this._clickedResult.searchFile.url) {
                                    hRef = this._clickedResult.searchFile.url;
                                }
                                if (resultTerms !== this._clickedResult.searchTerm) {
                                    resultTerms = this._clickedResult.searchTerm;
                                }
                            }
                            hRef = "".concat(hRef, "?highlight=").concat(encodeURIComponent(resultTerms));
                        }
                        Content.Browser.navigateTo(hRef, false);
                    }
                };
                SearchDocumentFeature.prototype.getClickedResult = function (resultIndex) {
                    var clickedResult = this._results[resultIndex];
                    if (clickedResult === undefined || clickedResult === null || clickedResult.fileIndex !== resultIndex) {
                        var foundResult = this._results.filter(function (x) { return x.fileIndex === resultIndex; });
                        if (foundResult.length > 0) {
                            clickedResult = foundResult[0];
                        }
                        else {
                            // If not found, fallback to the first result
                            clickedResult = this._results[resultIndex];
                        }
                    }
                    return clickedResult;
                };
                SearchDocumentFeature.prototype.highlightContentFrame = function () {
                    Content.Messaging.routeMessageToWindow(parent, Content.DocumentMessageNames.resetQuickSearch, null);
                    if (this._clickedResult != null) {
                        var terms = this._clickedResult.searchTerm.split(",");
                        for (var _i = 0, terms_3 = terms; _i < terms_3.length; _i++) {
                            var term = terms_3[_i];
                            if (term != null && term !== "") {
                                Content.Messaging.routeMessageToWindow(parent, Content.DocumentMessageNames.quickSearch, term);
                            }
                        }
                    }
                    Content.Messaging.routeMessageToWindow(parent, Content.DocumentMessageNames.searchHighlightComplete, null);
                };
                SearchDocumentFeature.prototype.getKeywordArray = function () {
                    // get search string
                    var searchText = $("#i-search", this._rootSelector).val();
                    if (searchText.length === 0) {
                        return null;
                    }
                    // make lowercase for easy comparison later on
                    searchText = searchText.toLowerCase();
                    // tokenise
                    var tokens = searchText.split(" ");
                    // build keywords array
                    var terms = [];
                    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
                        var token = tokens_1[_i];
                        if (token.length > 0) {
                            // strip out any delimiters & whitespace
                            token = token.replace(new RegExp("\'", "ig"), "");
                            token = token.replace(new RegExp("\"", "ig"), "");
                            token = token.replace(new RegExp(",", "ig"), "");
                            // add to array
                            if (!((token === "or") || (token === "and"))) {
                                // add to keywords array
                                terms.push(token);
                            }
                        }
                    }
                    return terms;
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
                            if (message.messageData.indexOf(this._webSearchPendingHighlight) !== -1) {
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
                        // No default
                    }
                };
                SearchDocumentFeature.prototype.populateTitleContentArrays = function (allWords, searchFiles, titleArray, contentArray) {
                    for (var index = 1; index < searchFiles.length; index++) {
                        var titleAndContentValue = allWords["_" + index];
                        if (titleAndContentValue != null) {
                            var marker = "Content¬";
                            var markerIdx = titleAndContentValue.indexOf(marker);
                            if (markerIdx !== -1) {
                                var title = titleAndContentValue.substring(0, markerIdx - 1);
                                var content = titleAndContentValue.substring(markerIdx);
                                var actualTitle = index + "¬" + (title.split('¬')[1] || "");
                                var actualContent = index + "¬" + (content.split('¬')[1] || "");
                                if (actualContent !== "" &&
                                    actualContent !== undefined &&
                                    contentArray.indexOf(actualContent) === -1) {
                                    if (content.indexOf(title) === -1) {
                                        actualContent = "".concat(index, "\u00AC").concat(title.split('¬')[1], " ").concat(content.split('¬')[1]);
                                    }
                                    contentArray.push(actualContent);
                                }
                                if (actualTitle !== "" &&
                                    actualTitle !== undefined &&
                                    titleArray.indexOf(actualTitle) === -1) {
                                    titleArray.push(actualTitle);
                                }
                            }
                        }
                    }
                };
                return SearchDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.SearchDocumentFeature = SearchDocumentFeature;
            var SearchDocumentFeatureFactory = /** @class */ (function () {
                function SearchDocumentFeatureFactory() {
                }
                SearchDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new SearchDocumentFeature(documentInstance);
                };
                return SearchDocumentFeatureFactory;
            }());
            Features.SearchDocumentFeatureFactory = SearchDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.SearchDocumentFeatureFactory());
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var indexConstants = {
                enterKeyCode: 13,
                heightMargin: 20
            };
            var IndexDocumentFeature = /** @class */ (function (_super) {
                __extends(IndexDocumentFeature, _super);
                function IndexDocumentFeature() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this._isFilterVisibility = false;
                    _this._isEnabled = false;
                    _this._rootSelector = null;
                    _this._diacriticsHelper = null;
                    return _this;
                }
                IndexDocumentFeature.prototype.getName = function () {
                    return "Index";
                };
                IndexDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    var _this = this;
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    if (isInitialLoad) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        var overrides_3 = (Innovasys.overrides || Innovasys.settings);
                        if (overrides_3 != null && overrides_3.isIndexFilterVisibility) {
                            this._isFilterVisibility = true;
                        }
                    }
                    this._diacriticsHelper = new Features.DiacriticsHelper;
                    this._rootSelector = rootSelector;
                    if ($("#i-index-container", rootSelector).length > 0) {
                        this._isEnabled = true;
                        $("#i-index-container #i-search", this._rootSelector)
                            .off("keyup.index")
                            .on("keyup.index", function (event) {
                            if (event.keyCode === indexConstants.enterKeyCode) {
                                var selectedHref = $("a.i-selected", _this._rootSelector)
                                    .filter("[href]")
                                    .first()
                                    .attr("href");
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
                                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                indexContainer.css("height", "".concat(indexContainer.height() - indexConstants.heightMargin, "px"));
                                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                indexContainer.css("width", "".concat(indexContainer.width(), "px"));
                            }, 1);
                        });
                    }
                };
                IndexDocumentFeature.prototype.populateResponsiveConfiguration = function (configuration) {
                    if (this._isEnabled && configuration.profileName !== "desktop") {
                        configuration.clickTargets.push(new Content.ResponsiveClickTarget("#i-index-body a", Content.ResponsiveClickTargetKind.block));
                    }
                };
                IndexDocumentFeature.prototype.applyResponsiveConfiguration = function (configuration) {
                    if (this._isEnabled && configuration.profileName !== "desktop") {
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
                    var diacriticsRemoverFunc = this._diacriticsHelper.removeDiacritics;
                    var term = $("#i-index-container #i-search", this._rootSelector).val();
                    term = this._diacriticsHelper.removeDiacritics(term.toLowerCase());
                    if (this._isFilterVisibility) {
                        // Filter the list to only show matching
                        var regex_1 = new RegExp("^".concat(term), "i");
                        var diacriticsRemoverFunc_1 = this._diacriticsHelper.removeDiacritics;
                        $("a,span", this._rootSelector.find("#i-index-body")).each(function (_, element) {
                            if (diacriticsRemoverFunc_1($(element)
                                .text())
                                .match(regex_1)) {
                                $(element).css("display", "inline-block");
                                $(element)
                                    .next("br")
                                    .css("display", "inline");
                                $(element)
                                    .next("blockquote")
                                    .css("display", "block");
                            }
                            else {
                                $(element).css("display", "none");
                                $(element)
                                    .next("br")
                                    .css("display", "none");
                                $(element)
                                    .next("blockquote")
                                    .css("display", "none");
                            }
                        });
                        $("a,span", this._rootSelector.find("#i-index-body")).each(function (index, element) {
                            if ($(element).css("display") === "inline-block") {
                                // Make sure the parents are visible also
                                $(element)
                                    .parents("blockquote")
                                    .each(function (_, blockQuoteElement) {
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
                            var anchor = $("a,span", this._rootSelector.find("#i-index-body"))
                                .filter(function (_, element) {
                                if (term != null && term !== ""
                                    && diacriticsRemoverFunc($(element)
                                        .text())
                                        .substring(0, term.length)
                                        .toLowerCase() === term) {
                                    return true;
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
            var IndexDocumentFeatureFactory = /** @class */ (function () {
                function IndexDocumentFeatureFactory() {
                }
                IndexDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new IndexDocumentFeature(documentInstance);
                };
                return IndexDocumentFeatureFactory;
            }());
            Features.IndexDocumentFeatureFactory = IndexDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.IndexDocumentFeatureFactory());

//# sourceMappingURL=innovasys.navigation.js.map
