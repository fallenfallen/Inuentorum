/*
 * Keen
 */


/* Avoid exposure of some private variables */

(function () {
    
    if (window.Keen) {
        throw new Error ("It appears, that you have tried to load more than one instance of Keen on one page.");
    }

    var arr = [],
        blinks = {},
        blinkerId = null,
        blink = 0,
        blinkRef = 0,
        getXHR,
        titleMessageTimerId = null,
        titleMessages = [];
    
    function evalJSON (str) {
        try {
            str = eval ("(" + str + ")");
        } catch (e) {
            return false;
        }

        if (!Keen.isObject (str)) {
            str = false;
        }

        return str;
    }

    /*
     * Implementation note 
     * 
     * class `Keen' is to be considered as an Array.
     * Therefore, it is reasonable to use
     * `new Keen (selector, root)' and its shortcut `K (selector, root)'
     * ONLY when `selector' may get us an array of elements.
     * 
     * When there is a need to work with a single element
     * it is better to use `Ki (id)', which selects the element by id,
     * and pass it to functions in `Keen' (NOT `Keen.prototype'!)
     *
     * TODO: Remove all checks for availability of shortcut names in global scope.
     */

    function Ki (id) {
        return typeof (id) === "string" || typeof (id) === "number" ?
            document.getElementById (id) : id;
    }

    function Kt (tag, root) {
        root = Ki (root) || document;

        return root.getElementsByTagName (tag) [0];
    }

    var Keen = function (selector, root) {
        if (!root) {
            root = document;
        }
        
        if (!root.querySelectorAll) {
            throw Error ("root.querySelectorAll () is not available.");
        }
        
        var match = root.querySelectorAll (selector);
        
        if (!match.length) {
            throw Error ("Please, do not attempt to create empty Keen.");
        }
        
        Keen.merge (this, match);
    };
    
    Keen.prototype = {
        constructor: Keen,
        
        length: 0,
        push: arr.push,
        
        each: function (callback) {
            Keen.each (this, callback);
        },
        
        merge: function (supplement) {
            Keen.merge (this, supplement);
        },

        style: function (name, value) {
            this.each (function (i, v) {
                Keen.style (v, name, value);
            });
        }
    };

    Keen.extend = function () {
        var a = arguments,
            target = a [0] || {},
            i = 1,
            l = a.length,
            deep = false,
            options;

        if (typeof (target) === "boolean") {
            i = 2;
            deep = target;
            target = a [1] || {};
        }

        if (typeof (target) !== "object" && !Keen.isFunction (target)) {
            target = {};
        }

        if (i === l) {
            i--;
            target = this;
        }

        for (; i < l; i++) {
            if ((options = a [i]) != null) {
                for (var name in options) {
                    var src = target [name],
                        copy = options [name];

                    if (target === copy) {
                        continue;
                    }

                    if (deep && copy && typeof (copy) === "object" && !copy.nodeType) {
                        target [name] = Keen.extend (deep,
                                src || (copy.length != null ? [] : {}), copy);
                    } else if (copy !== undefined) {
                        target [name] = copy;
                    }
                }
            }
        }

        return target;
    };
    
    var ua = navigator.userAgent.toLowerCase (),
        logTimer = (new Date).getTime (),
        expand = +new Date, 
        UUID = 0, 
        cache = {};
    
    function normEvent (event) {
        event = event || window.event;
    
        var originalEvent = event;
        
        event = Keen.clone (originalEvent);
        event.originalEvent = originalEvent;
    
        if (!event.target) {
            event.target = event.srcElement || document;
        }
    
        // check if target is a textnode (safari)
        if (event.target.nodeType === 3) {
            event.target = event.target.parentNode;
        }
    
        if (!event.relatedTarget && event.fromElement) {
            event.relatedTarget = event.fromElement === event.target;
        }
    
        if (event.pageX === null && event.clientX != null) {
            var doc = document.documentElement, body = bodyNode;
            event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0);
            event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0);
        }
    
        if (!event.which && ((event.charCode || event.charCode === 0) ? event.charCode : event.keyCode)) {
            event.which = event.charCode || event.keyCode;
        }
    
        if (!event.metaKey && event.ctrlKey) {
            event.metaKey = event.ctrlKey;
        } else if (!event.ctrlKey && event.metaKey && browser.mac) {
            event.ctrlKey = event.metaKey;
        }
    
        // click: 1 === left; 2 === middle; 3 === right
        if (!event.which && event.button) {
            event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
        }
    
        return event;
    };

    Keen.extend ({
        browser: {
            version: (ua.match( /.+(?:me|ox|on|rv|it|era|opr|ie)[\/: ]([\d.]+)/ ) || [0,"0"])[1],
            opera: (/opera/i.test(ua) || /opr/i.test(ua)),
            msie: (/msie/i.test(ua) && !/opera/i.test(ua) || /trident\//i.test(ua)),
            msie6: (/msie 6/i.test(ua) && !/opera/i.test(ua)),
            msie7: (/msie 7/i.test(ua) && !/opera/i.test(ua)),
            msie8: (/msie 8/i.test(ua) && !/opera/i.test(ua)),
            msie9: (/msie 9/i.test(ua) && !/opera/i.test(ua)),
            mozilla: /firefox/i.test(ua),
            chrome: /chrome/i.test(ua),
            safari: (!(/chrome/i.test(ua)) && /webkit|safari|khtml/i.test(ua)),
            iphone: /iphone/i.test(ua),
            ipod: /ipod/i.test(ua),
            iphone4: /iphone.*OS 4/i.test(ua),
            ipod4: /ipod.*OS 4/i.test(ua),
            ipad: /ipad/i.test(ua),
            android: /android/i.test(ua),
            bada: /bada/i.test(ua),
            mobile: /iphone|ipod|ipad|opera mini|opera mobi|iemobile|android/i.test(ua),
            msie_mobile: /iemobile/i.test(ua),
            safari_mobile: /iphone|ipod|ipad/i.test(ua),
            opera_mobile: /opera mini|opera mobi/i.test(ua),
            opera_mini: /opera mini/i.test(ua),
            mac: /mac/i.test(ua)
        },
    
        log: function () {
            if (console && console.log) {
                var t = "[" +
                    (((new Date()).getTime() - logTimer) / 1000).toFixed (3) +
                    "]";
                
                var args = Array.prototype.slice.call(arguments);
                
                args.unshift(t);
                
                if (Keen.browser.msie || Keen.browser.mobile) {
                    console.log(args.join(" "));
                } else {
                    console.log.apply(console, args);
                }
            }
        },
        
        each: function (object, callback) {
            if (!object || !callback) {
                return object;
            }

            var length = object.length;
        
            if (length === undefined) {
                for (var name in object) {
                    if (callback.call (object [name], name, object [name]) === false) {
                        break;
                    }
                }
            } else {
                for (var i = 0;
                     i < length && callback.call (object [i], i, object [i]) !== false;
                     i++) {}
            }
        
            return object;
        },
        
        merge: function (target, supplement) {
            var len = supplement.length,
                i = target.length;
            
            for (var j = 0; j < len; j++, i++) {
                target [i] = supplement [j];
            }
            
            target.length = i;
            
            return target;
        },

        sliceTo: function (target, targetStart, source, sourceStart, end) {
            if (sourceStart === undefined) {
                sourceStart = 0;
                end = source.length;
            } else if (end === undefined) {
                end = source.length;
            }

            for (; sourceStart < end; sourceStart++, targetStart++) {
                target [targetStart] = source [sourceStart];
            }

            return target;
        },

        bind: function (f, context) {
            if (Function.prototype.bind) {
                Keen.bind = function (f) {
                    return Function.prototype.bind.apply (f, arr.slice.call (arguments, 1));
                };

                return Keen.bind.apply (this, arguments);
            }

            var args = arr.slice.call (arguments, 2);

            return function () {
                return f.apply (context, args.concat (arr.slice.call (arguments)));
            };
        },

        data: function (el, name, data) {
            if (!el) {
                throw new Error ("Keen.data accepts only valid element as argument");
            }

            var id = el [expand];
            
            if (!id) {
                id = el [expand] = ++UUID;
            }
        
            if (data !== undefined) {
                if (!cache [id]) {
                    cache [id] = {};
                    cache [id].__el = el;
                }
                
                cache [id][name] = data;
            }

            if (cache [id]) {
                return name ? cache [id][name] : cache [id];
            }
        },    
        
        clean: function (el, name) {
            var id = el ? el [expand] : false;
        
            if (!id) {
                return;
            }
        
            if (name) {
                if (cache [id]) {
                    delete cache [id][name];
        
                    name = "";
                    var count = 0;
        
                    for (name in cache [id]) {
                        if (name !== "__el") {
                            count++;
        
                            break;
                        }
                    }
        
                    if (!count) {
                        Keen.clean (el);
                    }
                }
            } else {
                Keen.event.remove (el);
                // Keen.attr.remove
                delete cache [id];
            }
        },
        
        isArray: function (obj) {
            return Object.prototype.toString.call (obj) === "[object Array]";
        },
        
        isFunction: function (obj) {
            return Object.prototype.toString.call (obj) === "[object Function]";
        },

        isObject: function (obj) {
            return Object.prototype.toString.call (obj) === "[object Object]";
        },

        isEmpty: function (obj) {
            if (!Keen.isObject (obj)) {
                return false;
            }

            for (var name in obj) {
                if (obj.hasOwnProperty (name)) {
                    return false;
                }
            }

            return true;
        },

        intval: function (value) {
            if (value === true) {
                return 1;
            }

            return parseInt (value) || 0;
        },
        
        clone: function (obj, req) {
            var newObj = Keen.isArray (obj) ? [] : {};
            
            for (var i in obj) {
                if (/webkit/i.test (ua) && (i === "layerX" || i === "layerY")) {
                    continue;
                }
                
                if (req && typeof (obj [i]) === "object" && i !== "prototype") {
                    newObj [i] = Keen.clone (obj [i]);
                } else {
                    newObj [i] = obj [i];
                }
            }
            
            return newObj;
        },

        event: {
    
            add: function (el, types, handler, custom, context) {
                /* 
                 * 3 - Node.TEXT_NODE
                 * 8 - Node.COMMENT_NODE
                 */

                if (!el || el.nodeType === 3 || el.nodeType === 8) { 
                    return;
                }
            
                var realHandler = context ? function() {
                    var newHandler = function(e) {
                        var prevData = e.data;
                        e.data = context;
                        var ret = handler.apply(this, [e]);
                        e.data = prevData;
                        return ret;
                    }
                    
                    newHandler.handler = handler;
                    
                    return newHandler;
                } () : handler;
            
                // For IE
                if (el.setInterval && el !== window) {
                    el = window;
                }
            
                var events = Keen.data (el, "events") || Keen.data (el, "events", {}),
                    handle = Keen.data (el, "handle") || Keen.data (el, "handle", function () {
                    event = normEvent (arguments [0]);
                
                    var handlers = Keen.data (arguments.callee.el, "events");
                    
                    if (!handlers || typeof (event.type) !== "string" ||
                        !handlers [event.type] || !handlers [event.type].length) {
                        return;
                    }
                
                    var eventHandlers = (handlers [event.type] || []).slice ();
                    
                    for (var i in eventHandlers) {
                        if (event.type === "mouseover" || event.type === "mouseout") {
                            var parent = event.relatedElement;
                            
                            while (parent && parent !== arguments.callee.el) {
                                try {
                                    parent = parent.parentNode; 
                                } catch(e) {
                                    parent = arguments.callee.el;
                                }
                            }
                            
                            if (parent === arguments.callee.el) {
                                continue;
                            }
                        }
                        
                        var ret = eventHandlers [i].apply (arguments.callee.el, arguments);
                        
                        if (ret === false || ret === -1) {
                            Keen.event.cancel (event);
                        }

                        if (ret === -1) {
                            return false;
                        }
                    }

                });
                
                // to prevent a memory leak
                handle.el = el;
            
                Keen.each (types.split (/\s+/), function (index, type) {
                    if (!events [type]) {
                        events [type] = [];
                        if (!custom && el.addEventListener) {
                            el.addEventListener (type, handle, false);
                        } else if (!custom && el.attachEvent) {
                            el.attachEvent ("on" + type, handle);
                        }
                    }
                    
                    events [type].push (realHandler);
                });
            
                el = null;
            },

            cancel: function (event) {
                event = (event || window.event);
                
                if (!event) {
                    return false;
                }
                
                while (event.originalEvent) {
                    event = event.originalEvent;
                }
                
                if (event.preventDefault) {
                    event.preventDefault();
                }
                
                if (event.stopPropagation) {
                    event.stopPropagation ();
                }
                
                if (event.stopImmediatePropagation) {
                    event.stopImmediatePropagation ();
                }
                
                event.cancelBubble = true;
                event.returnValue = false;
                
                return false;
            },

            remove: function (el, types, handler, useCapture) {
                if (typeof (useCapture) === "undefined") {
                    useCapture = false;
                }
            
                if (!el) {
                    return;
                }
            
                var events = Keen.data (el, "events");
            
                if (!events) {
                    return;
                }
            
                if (typeof (types) !== "string") {
                    for (var i in events) {
                        Keen.event.remove (el, i);
                    }
                    
                    return;
                }
            
                Keen.each (types.split (/\s+/), function (index, type) {
                    if (!Keen.isArray (events [type])) {
                        return;
                    }
                    
                    var l = events [type].length;
            
                    if (Keen.isFunction (handler)) {
                        for (var i = l - 1; i >= 0; i--) {
                            if (events [type][i] && 
                                (events [type][i] === handler || events [type][i].handler === handler)) {
                                events [type].splice(i, 1);
                                l--;
                                
                                break;
                            }
                        }
                    } else {
                        for (var i = 0; i < l; i++) {
                            delete events [type][i];
                        }
            
                        l = 0;
                    }
                    
                    if (!l) {
                        if (el.removeEventListener) {
                            el.removeEventListener (type, Keen.data (el, "handle"), useCapture);
                        } else if (elem.detachEvent) {
                            el.detachEvent ("on" + type, Keen.data (el, "handle"));
                        }
            
                        delete events[type];
                    }
                });
    
                if (Keen.isEmpty (events)) {
                    Keen.clean (el, "events");
                    Keen.clean (el, "handle");
                }
            },

            trigger: function (el, type, ev) {
                var handle = Keen.data (el, "handle");

                if (handle) {
                    setTimeout (function () {
                        handle.call (el, Keen.extend (ev || {}, {
                            type: type,
                            target: el
                        }));
                    }, 0);
                }
            }

        }, // End of event

        toCamelCase: function (str) {
            return str.replace (/\-(\w)/g, function (all, letter) {
                return letter.toUpperCase ();
            });
        },

        /*
         * Keen.style (el, name) - get computed style,
         * Keen.style (el, name, false) - get value only,
         * Keen.style (el, name, value) - set style.
         */

        style: function (el, name, value) {
            if (!el) {
                return "";
            }

            if (Keen.isArray (name)) {
                var ret = {};

                Keen.each (name, function (i, v) {
                    ret [v] = Keen.style (el, v, value);
                });

                return ret;
            } else if (Keen.isObject (name)) {
                return Keen.each (name, function (n, v) {
                    Keen.style (el, n, v);
                });
            }

            if (value === undefined) {
                value = true;
            }

            var get = typeof (value) === "boolean";

            if (Keen.style.hooks) {
                var hook = Keen.style.hooks [name];

                if (hook) {
                    var ret = get ? hook.get : hook.set;
                    
                    if (Keen.isFunction (ret)) {
                        ret = ret.call (this, el, value);

                        if (ret !== undefined) {
                            return ret;
                        }
                    }
                }
            }

            if (get) {
                if (!value && el.style && el.style [name]) {
                    return el.style [name];
                }

                var defaultView = document.defaultView || window;

                if (defaultView.getComputedStyle) {
                    name = name.replace (/([A-Z])/g, "-$1").toLowerCase ();

                    var computedStyle = defaultView.getComputedStyle (el, null);

                    if (computedStyle) {
                        return computedStyle.getPropertyValue (name);
                    }
                } else if (el.currentStyle) {
                    var ret = el.currentStyle [name] ||
                          el.currentStyle [Keen.toCamelCase (name)];
                    
                    if (ret === "auto") {
                        ret = 0;
                    }

                    ret = ret.toString ().split (" ");

                    Keen.each (ret, function (i, v) {
                        if (!/^\d+(px)?$/i.test (v) && /^\d/.test (v)) {
                            var left = el.style.left,
                                rsLeft = el.runtimeStyle.left;

                            el.runtimeStyle.left = el.currentStyle.left;
                            el.style.left = v || 0;
                            ret [i] = el.style.pixelLeft + "px";
                            el.style.left = left;
                            el.runtimeStyle.left = rsLeft;
                        }
                    });

                    return ret.join (" ");
                }

                return "";
            } else {
                try {
                    var isN = typeof (value) === "number";

                    if (isN && /heigth|width/i.test (name)) {
                        value = Math.abs (value);
                    }

                    el.style [name] = isN && 
                                      !/z-?index|font-?weight|opacity|zoom|line-?height/i.test (name) ?
                              value + "px" : value;
                } catch (e) {
                    Keen.log ("Keen.style () error (", e, ") on set", arguments);
                }
            }
        },

        isVisible: function (el) {
            return Keen.style (el, "display") !== "none";
        },

        isScrollTopMax: function (el) {
            if (el.scrollHeight === 0) {
                return false;
            }

            return el.scrollTop === Keen.scrollTopMax (el) || el.scrollHeight === el.clientHeight;
        },

        scrollTopMax: function (el) {
            return el.scrollHeight - el.clientHeight;
        },

        hide: function (el) {
            if (!el) {
                return;
            }

            var display = Keen.style (el, "display");

            if (display !== "none") {
                Keen.data (el, "display", display);
                Keen.style (el, "display", "none");
            }
        },

        show: function (el) {
            if (!el) {
                return;
            }

            var display = Keen.style (el, "display");

            if (display === "none") {
                display = Keen.data (el, "display");

                if (display) {
                    Keen.clean (el, "display");
                } else {
                    if (Keen.browser.msie) {
                        display = "block";
                    } else {
                        var tag = el.tagName.toLowerCase();

                        if (tag === "tr") {
                            display = "table-row";
                        } else if (tag === "table") {
                            display = "table";
                        } else {
                            display = "block";
                        }
                    }
                }

                Keen.style (el, "display", display);
            }
        },

        toRGB: function (color) {
            var result;

            if (Keen.isArray (color) && color.length === 3) {
                return color;
            }

            if (result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec (color)) {
                return [ parseInt (result [1]), parseInt (result [2]), parseInt (result [3]) ];
            }

            if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec (color)) {
                return [ 
                    parseFloat (result [1]) * 2.55,
                    parseFloat (result [2]) * 2.55,
                    parseFloat (result [3]) * 2.55
                ];
            }

            if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec (color)) {
                return [
                    parseInt (result [1], 16),
                    parseInt (result [2], 16),
                    parseInt (result [3], 16)
                ];
            }

            if (result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec (color)) {
                return [
                    parseInt (result [1] + result [1], 16),
                    parseInt (result [2] + result [2], 16),
                    parseInt (result [3] + result [3], 16)
                ];
            }
        },

        fromRGB: function (rgb) {
            if (!Keen.isArray (rgb) || rgb.length !== 3) {
                return "rgb(0, 0, 0)";
            }

            Keen.each (rgb, function (i, v) {
                rgb [i] = Math.abs (v.toFixed (0));

                if (rgb [i] > 255) {
                    rgb [i] = 255;
                }
            });

            return "rgb(" + rgb.join (", ") + ")";
        },

        color: function (el, name, computed) {
            var color;

            if (typeof (computed) !== "boolean") {
                computed = true;
            }

            do {
                color = Keen.style (el, name, computed);

                if (color.indexOf ("rgba") === 0) {
                    color = "";
                }

                if ((color !== "" && color !== "transparent") ||
                    el.tagName.toLowerCase () === "body") {
                    break;
                }

                name = "backgroundColor";
            } while (el = el.parentNode);

            return computed ? Keen.toRGB (color) || color : color;
        },

        Fx: function (el, options, name) {
            this.el = el;
            this.name = name;
            this.options = Keen.extend ({
                onComplete: function () {},
                transition: options.transition || Keen.Fx.transitions.sineInOut,
                duration: 500
            }, options || {});
        },

        /*
         * Set a watcher for field
         * to apply animation to its back
         * when user interacts with field.
         * 
         * TODO: Be careful not to apply lots of events to field
         * (I am not sure, if this is really needed).
         *
         * @param {HTMLInputElement}      field to watch
         * @param {HTMLParagraphElement}  back of field to be animated
         */

        watchField: function (field, back) {
            Keen.event.add (field, "keypress keyup input", function () {
                var tween = Keen.data (back, "tween");
                
                if (tween && tween.isTweening) {
                    tween.stop (true);
                }

                if (field.value) {
                    Keen.hide (back);
                } else {
                    Keen.show (back);
                }
            });

            Keen.event.add (field, "focus blur", function (event) {
                if (!field.value) {
                    Keen.Fx.animate (back, {
                        opacity: event.type === "blur" ? 1 : 0.4
                    }, 200, function () {
                        if (field.value) {
                            Keen.hide (back);
                        } else {
                            Keen.show (back);
                        }
                    });
                } else {
                    Keen.style (back, "opacity", 0.4);
                }
            });
        },

        /*
         * Old browsers dont implement `hasAttribute'
         */

        hasAttribute: function (el, name) {
            if (el.hasAttribute) {
                Keen.hasAttribute = function (el, name) {
                    return el.hasAttribute (name);
                };
            } else {
                /*
                 * Some browsers may return an empty string
                 * instead of `null' prior to DOM 3 Core specification.
                 */

                var value = el.getAttribute ((+new Date).toString ());

                Keen.hasAttribute = function (el, name) {
                    return el.getAttribute (name) != value;
                };
            }

            return Keen.hasAttribute (el, name);
        },

        toggle: function (el) {
            if (Keen.hasAttribute (el, "disabled")) {
                el.removeAttribute ("disabled", "");
            } else {
                el.setAttribute ("disabled", "");
            }
        },

        ajax: {
            toQuery: function (obj) {
                if (!Keen.isObject (obj)) {
                    return obj;
                }

                var ret = "";

                Keen.each (obj, function (n, v) {
                    if (!v !== null && !Keen.isFunction (v)) {
                        ret += n + "=" + Keen.ajax.encode (v) + "&";
                    }
                });

                return ret.substr (0, ret.length - 1);
            },

            fixUrl: function (url) {
                if (url.substr (0, 1) !== "/" && url.substr (0, 4) !== "http") {
                    url = "/" + url;
                }

                return url;
            },

            post: function (url, query, options) {
                var xhr = getXHR ();

                url = Keen.ajax.fixUrl (url);

                options = Keen.extend ({
                    timeout: 15000,
                    contentType: "application/x-www-form-urlencoded"
                }, options);

                if (options.contentType === "application/json") {
                    query = Keen.toJSON (query);
                } else {
                    query = Keen.ajax.toQuery (query);
                }
                
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200 &&
                            Keen.isFunction (options.onSuccess)) {
                            options.onSuccess (
                                Keen.parseJSON (xhr.responseText));
                        } else if (Keen.isFunction (options.onFail)) {
                            options.onFail (
                                Keen.parseJSON (xhr.responseText));
                        }
                    }
                };

                if (Keen.isFunction (options.onProgress)) {
                    xhr.onprogress = options.onProgress;
                }

                if (xhr.upload !== undefined &&
                    Keen.isFunction (options.onUploadProgress)) {

                    xhr.upload.onprogress = options.onUploadProgress;
                }

                try {
                    xhr.open ("POST", url, true);

                    xhr.timeout = options.timeout;

                    xhr.setRequestHeader ("X-Requested-With", "XMLHttpRequest");
                    xhr.setRequestHeader ("Content-Type", options.contentType);

                    xhr.send (query);
                } catch (e) {
                    Keen.log ("[ Keen.ajax ]", e);

                    if (options && Keen.isFunction (options.onFail)) {
                        options.onFail ();
                    }
                }
            },

            get: function (url, query, options) {
                var xhr = getXHR ();

                url = Keen.ajax.fixUrl (url);
                query = Keen.ajax.toQuery (query);

                if (query) {
                    url += "?" + query;
                }

                options = Keen.extend ({
                    timeout: 15000,
                }, options);
                
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200 &&
                            Keen.isFunction (options.onSuccess)) {
                            options.onSuccess (
                                Keen.parseJSON (xhr.responseText));
                        } else if (Keen.isFunction (options.onFail)) {
                            options.onFail (
                                Keen.parseJSON (xhr.responseText));
                        }
                    }
                };

                if (Keen.isFunction (options.onProgress)) {
                    xhr.onprogress = options.onProgress;
                }

                try {
                    xhr.open ("GET", url, true);

                    xhr.timeout = options.timeout;

                    xhr.setRequestHeader ("X-Requested-With", "XMLHttpRequest");

                    xhr.send ();
                } catch (e) {
                    Keen.log ("[ Keen.ajax ]", e);

                    if (options && Keen.isFunction (options.onFail)) {
                        options.onFail ();
                    }
                }
            },

            /* HTML5 Only */

            upload: function (url, els, options) {
                if (!Keen.isFunction (Blob)) {
                    return Keen.log ("[ Keen.ajax.upload ]", "`Blob' is required");
                }

                var origBoundary = "Keen.ajax.upload" + (+new Date).toString (16),
                    boundary = "--" + origBoundary + "\r\n",
                    data = [];

                options = Keen.extend ({
                    timeout: 72000000, /* 20 hours */
                    contentType: "multipart/form-data; boundary=" + origBoundary,
                }, options);

                var f = function (i, el) {
                    if (!Keen.hasAttribute (el, "name")) {
                        return;
                    }

                    var type = el.nodeName.toUpperCase () === "INPUT" ?
                           el.getAttribute ("type").toUpperCase () : "TEXT";

                    if (type === "FILE" && el.files === undefined) {
                        Keen.log ("Browser does not support `files' property " + 
                              "in HTMLInputElement");

                        return;
                    }

                    var descr = 'Content-Disposition: form-data; name="' + el.name + '"';

                    if (type === "FILE") {
                        descr += '; filename="';

                        Keen.each (el.files, function (i, file) {
                            var currentDescr = descr + 
                                       file.name.replace (/["]/g, "") + 
                                       '"\r\n';
                            if (file.type.length !== 0) {
                                currentDescr += "Content-Type: " + file.type +
                                           "\r\n\r\n";
                            } else {
                                currentDescr += "\r\n";
                            }

                            data.push (boundary, currentDescr, file, "\r\n",
                                   boundary);
                        });
                    } else if (el.value || el.checked) {
                        var value = el.checked ? el.checked.toString () : el.value;

                        data.push (boundary, descr, "\r\n\r\n", value, "\r\n",
                               boundary);
                    }
                };

                if (Keen.isArray (els)) {
                    Keen.each (els, f);
                } else {
                    f (0, els);
                }

                if (data.length !== 0) {
                    data [data.length - 1] = data [data.length - 1]
                                 .replace (/\r/, "--\r");

                    var blob = new Blob (data, {
                        type: "multipart/form-data"
                    });
                    
                    Keen.ajax.post (url, blob, options);
                }
            }
        },

        parseJSON: JSON && JSON.parse ? function (str) {
            try {
                return JSON.parse (str);
            } catch (e) {
                return evalJSON (str);
            }
        } : evalJSON,

        toJSON: function (str) {
            try {
                return JSON.stringify (str);
            } catch (e) {
                return "{}";
            }
        },

        createElement: function (tag, attr, style) {
            tag = document.createElement (tag);

            if (attr) {
                Keen.each (attr, function (name, value) {
                    tag.setAttribute (name, value);
                });
            }

            if (style) {
                Keen.style (tag, style);
            }

            return tag;
        },

        head: Kt ("head"),
        body: Kt ("body"),

        loadScript: function (link) {
            var script = Keen.createElement ("script", {
                type: "text/javascript",
                src: link
            });

            Keen.head.appendChild (script);

            return script;
        },

        trim: function (text) {
            return (text || "").replace (/^\s+|\s+$/g, "");
        },

        escapeHtml: function (text) {
            var map = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;",
            };

            return text.replace (/[&<>"']/g, function (char) {
                if (!map [char]) {
                    Keen.log ("unknown char has been passed into Keen.escapeHtml",
                        char.charCodeAt (0));

                    return char;
                }

                return map [char];
            })
                .replace (/\r/g, "")
                .replace (/\t/g, "&emsp;&emsp;&emsp;&emsp;&emsp;")
                .replace (/\n/g, "<br/>")
                .replace (/>\s/g, ">&nbsp;")
                .replace (/[\s]{2,}/g, function (spaces) {
                    return spaces.replace (/\s/g, "&nbsp;");
                });
        },

        class: {
            has: function (el, name) {
                return (new RegExp ("(\\s|^)" + name + "(\\s|$)")).test (el.className);
            },

            add: function (el, name) {
                if (!Keen.class.has (el, name)) {
                    el.className = (el.className ? el.className + " " : "") + name;
                }
            },

            remove: function (el, name) {
                el.className = Keen.trim ((el.className || "")
                        .replace ((new RegExp ("(\\s|^)" + name + "(\\s|$)")), ' '));
            },

            removeAll: function (el) {
                el.className = "";
            }
        },

        title: {
            add: function (text, type) {
                if (type) {
                    var obj = null;

                    Keen.each (titleMessages, function (i, v) {
                        if (v.type === type) {
                            obj = v;
                        }
                    });
                    
                    if (obj !== null) {
                        obj.text = text;
                        return;
                    }
                }

                var obj = {
                    text: text,
                    type: type
                };

                titleMessages.push (obj);

                if (titleMessageTimerId === null) {
                    var wait = false,
                        counter = 0,
                        originalTitle = document.title;

                    titleMessageTimerId = setInterval (function () {
                        if (titleMessages.length === 0) {
                            clearInterval (titleMessageTimerId);

                            titleMessageTimerId = null;
                            document.title = originalTitle;

                            return;
                        }

                        if (wait) {
                            wait = false;
                            document.title = originalTitle;
                            return;
                        }

                        document.title = titleMessages [counter].text;
                        wait = counter === titleMessages.length - 1;
                        counter = (counter + 1) % titleMessages.length;
                    }, 1000);
                }
            },

            removeAll: function () {
                titleMessages.length = 0;
            }
        },

        offsetTop: function (el) {
            var offset = 0;

            do {
                offset += el.offsetTop;
            } while ((el = el.offsetParent) && el.offsetTop !== undefined);

            return offset;
        },

        promptUnload: function (message) {
            window.onbeforeunload = function (event) {
                event = event || window.event;

                if (event) {
                    event.returnValue = message;
                }

                return message;
            };
        },

        isRealNode: function (el) {
            return el.nodeType !== 3 && el.nodeType !== 8;
        },

        cleanChildNodes: function (el) {
            var children = el.childNodes;

            for (var i = 0; i < children.length;) {
                var v = children [i];

                if (Keen.isRealNode (v)) {
                    i++;
                } else {
                    el.removeChild (v);
                }
            }
        },

        toZeroedLocaleString: function (date) {
            return date.toLocaleString ()
                .replace (/([^0-9]{1}|\b)([0-9]{1}[^0-9]{1})/g, "$10$2");
        }

    }); // End of Keen.extend

    if (Keen.isFunction (encodeURIComponent)) {
        Keen.ajax.encode = encodeURIComponent;
    } else if (Keen.isFunction (escape)) {
        Keen.ajax.encode = escape;
    }

    if (Keen.isFunction (XMLHttpRequest)) {
        getXHR = function () {
            return new XMLHttpRequest ();
        };
    } else {
        Keen.each ([ "Msxml2.XMLHTTP", "Microsoft.XMLHTTP" ], function (i, v) {
            try {
                var obj = new ActiveXObject (v);

                if (obj) {
                    v = v.substr ();
                    getXHR = function () {
                        return new ActiveXObject (v);
                    };

                    return false;
                }
            } catch (e) {}
        });
    }

    if (!Keen.ajax.encode || !getXHR) {
        Keen.log ("[ Keen.ajax ]", "Ajax incompatible browser.");

        Keen.ajax.post = function () {};
        Keen.ajax.encode = function () {
            return "";
        };
    }

    Keen.extend (Keen.Fx, {
        transitions: {
            linear: function (t, b, c, d) {
                return c * t / d + b;
            },

            sineInOut: function (t, b, c, d) {
                return -c / 2 * (Math.cos (Math.PI * t / d) - 1) + b;
            },

            halfSine: function (t, b, c, d) {
                return c * (Math.sin (Math.PI * (t / d) / 2)) + b;
            },

            easeOutBack: function (t, b, c, d) {
                var s = 1.70158;

                return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
            },

            easeInCirc: function (t, b, c, d) {
                return -c * (Math.sqrt (1 - (t /= d) * t) - 1) + b;
            },

            easeOutCirc: function (t, b, c, d) {
                return c * Math.sqrt (1 - (t = t / d - 1) * t) + b;
            },

            easeInQuint: function (t, b, c, d) {
                return c * (t /= d) * t * t * t * t + b;
            },

            easeOutQuint: function (t, b, c, d) {
                return c * ((t = t / d-1) * t * t * t * t + 1) + b;
            },

            easeOutCubic: function (t, b, c, d) {
                return c * ((t = t / d - 1) * t * t + 1) + b;
            }
        },

        timers: [],
        timerId: null,

        animate: function (el, params, duration, callback) {
            if (!el) {
                return;
            }

            if (!Keen.isFunction (callback)) {
                callback = function () {};
            }
            
            var options = Keen.extend ({
                orig: {},
                base: Keen.Fx
            }, typeof (duration) === "object" ? duration : {
                    duration: duration,
                    onComplete: callback
            });

            var tween = Keen.data (el, "tween"),
                froms = {},
                tos = {},
                units = {},
                visible = Keen.isVisible (el),
                toggleAct = visible ? "hide" : "show",
                self = this,
                p, i, name;


            if (tween && tween.isTweening) {
                /* TODO: maybe figure out something better. */

                tween.stop (false);

                var rest = tween.options.duration - tween.cTime;

                if (rest < options.duration) {
                    options.duration -= rest;
                }

                if (tween.options.show) {
                    toggleAct = "hide";
                } else if (tween.options.hide) {
                    toggleAct = "show";
                }

                Keen.extend (options.orig, tween.options.orig);
            }

            params = Keen.clone (params);

            if (params.discrete) {
                options.discrete = 1;

                delete params.discrete;
            }

            if (Keen.browser.iphone) {
                options.duration = 0;
            }

            for (p in params) {
                if (!tween && (
                    (params [p] === "show" && visible) ||
                    (params [p] === "hide" && !visible)
                    )) {
                    return options.onComplete.call (this, el);
                }

                if ((p === "height" || p === "width")) {
                    if (!params.overflow) {
                        if (options.orig.overflow === undefined) {
                            options.orig.overflow = Keen.style (el, "overflow");
                        }

                        Keen.style (el, "overflow", "hidden");
                    }

                    Keen.show (el);
                }

                if (/show|hide|toggle/.test (params [p])) {
                    if (params [p] === "toggle") {
                        params [p] = toggleAct;
                    }

                    if (params [p] === "show") {
                        var from = 0;

                        options.show = true;

                        if (options.orig [p] === undefined) {
                            options.orig [p] = Keen.style (el, p, false);

                            Keen.style (el, p, 0);
                        }

                        var old = Keen.style (el, p);

                        if (p === "height" && Keen.browser.msie6) {
                            Keen.style (el, p, 0);
                            Keen.style (el, "overflow", "");
                        } else {
                            Keen.style (el, p, options.orig [p]);
                        }

                        params [p] = parseFloat (Keen.style (el, p));
                        
                        Keen.style (el, p, old);

                        if (p === "height" && Keen.browser.msie && !params.overflow) {
                            Keen.style (el, "overflow", "hidden");
                        }
                    } else {
                        if (options.orig [p] === undefined) {
                            options.orig [p] = Keen.style (el, p, false);
                        }

                        options.hide = true;
                        params [p] = 0;
                    }
                }
            }

            if (options.show && !visible) {
                Keen.show (el);
            }
            
            tween = new options.base (el, options);

            Keen.each (params, function (name, to) {
                var from = null,
                    unit = null;

                if (/^(backgroundColor|borderBottomColor|borderLeftColor|borderRightColor|borderTopColor|color|borderColor|outlineColor)$/.test (name)) {
                    from = Keen.color (el,
                        name === "borderColor" ? "borderTopColor" : name);
                    
                    if (from === undefined) {
                        return;
                    }

                    to = Keen.toRGB (to);
                } else {
                    var parts = to.toString ().match (/^([+-]=)?([\d+-.]+)(.*)$/);

                    /*
                     * There is slight a problem with units.
                     * If units were not set explicitly, then
                     * the browser will figure them out.

                     * We make the `Keen.Fx' work with explicitly set units
                     * only if the value was applied to element's style
                     * in the same units, thus we may need to prepare
                     * the element with `Keen.style' before applying `Keen.Fx'
                     */

                    if (parts) {
                        to = parseFloat (parts [2]);

                        if (parts [1]) {
                            to = (parts [1] === "-=" ? -1 : 1) * to + to;
                        }

                        if (parts [3]) {
                            var fromParts = Keen
                                        .style (el, name, false)
                                        .match (/^([\d+-.]+)(.*)$/);

                            if (fromParts && parts [3] === fromParts [2]) {
                                from = parseFloat (fromParts [1]) || 0;
                                unit = parts [3];
                            }
                        }
                    }


                    if (!from) {
                        from = tween.cur (name);
                    }

                    if (options.hide && name === "height" && Keen.browser.msie6) {
                        Keen.style (el, {
                            height: 0,
                            overflow: ""
                        });
                    }

                    if (options.hide && name === "height" && Keen.browser.msie6) {
                        Keen.style (el, {
                            height: "",
                            overflow: "hidden"
                        });
                    }

                    if (from === 0 && (name === "width" || name === "height")) {
                        from = 1;
                    }

                    if (name === "opacity" && to > 0 && !visible) {
                        from = 0;

                        Keen.style (el, "opacity", 0);
                        Keen.show (el);
                    }
                }

                if (from !== to || (Keen.isArray (from) && from.join (",") === to.join (","))) {
                    froms [name] = from;
                    tos [name] = to;
                    
                    if (unit) {
                        units [name] = unit;
                    }
                }
            });

            tween.start (froms, tos, units);
            Keen.data (el, "tween", tween);

            return tween;
        },

        toggleLoader: function (el, options) {
            var orig = Keen.data (el, "loader");

            if (orig) {
                if (orig.stop) {
                    return orig.stop = null;
                }

                orig.stop = function () {
                    if (orig.value) {
                        el.value = orig.value;
                    }

                    if (orig.style) {
                        Keen.style (el, orig.style);
                    }

                    Keen.clean (el, "loader");
                };
            } else {
                if (!options) {
                    options = {};
                }

                orig = Keen.data (el, "loader", {});

                orig.type = options.type ? options.type : "poke";

                if (el.value && options.value) {
                    orig.value = el.value;
                    el.value = options.value;
                }

                if (!options.style) {
                    options.style = {
                        opacity: 0.6
                    };
                }

                orig.style = {};

                for (var name in options.style) {
                    orig.style [name] = Keen.style (el, name, false);
                }

                switch (orig.type) {
    
                case "poke":
                    var animate = function () {
                        if (orig.stop) {
                            return orig.stop ();
                        }

                        Keen.Fx.poke (el, options.style, animate);
                    };

                    animate ();
    
                    break;
                }
            }
        },

        /*
         * Poke the element with specified `style'
         */

        poke: function (el, style, callback) {
            if (!el || !style) {
                return;
            }

            var orig = {},
                origCopy = {};

            if (Keen.data (el, "poke")) {
                return;
            }

            Keen.data (el, "poke", true);

            for (var name in style) {
                if (/^(backgroundColor|borderBottomColor|borderLeftColor|borderRightColor|borderTopColor|color|borderColor|outlineColor)$/.test (name)) {
                    orig [name] = Keen.color (el,
                        name === "borderColor" ? "borderTopColor" : name, false);
                    origCopy [name] = Keen.style (el, name, false);
                } else {
                    orig [name] = origCopy [name] = Keen.style (el, name, false);
                }
            }

            Keen.Fx.animate (el, style, {
                duration: 200,
                onComplete: function () {
                    Keen.Fx.animate (el, orig, {
                        onComplete: function () {
                            Keen.style (el, origCopy);

                            if (Keen.isFunction (callback)) {
                                setTimeout (callback, 10, el);
                            }

                            Keen.clean (el, "poke");
                        }
                    });
                }
            });
        },

        blink: function (el, toBlink, tag) {
            if (!el && !toBlink) {
                if (tag) {
                    if (Keen.isObject (blinks [tag])) {
                        Keen.each (blinks [tag], function (i, v) {
                            Keen.Fx.blink (v, false);
                        });
                    }
                } else {
                    Keen.each (blinks, function (k, els) {
                        Keen.each (els, function (i, v) {
                            Keen.Fx.blink (v, false);
                        });
                    });
                }

                return;
            }

            if (!el) {
                return;
            }

            var b = Keen.data (el, "blink");

            if (b !== undefined) {
                if (!toBlink) {
                    Keen.clean (el, "blink");
                    delete blinks [b.tag][b.ref];
                    Keen.style (el, "opacity", b.opacity);
                }

                return;
            }

            if (toBlink === false) {
                return;
            }

            if (!tag) {
                tag = "default";
            }

            if (!Keen.isObject (blinks [tag])) {
                blinks [tag] = {};
            }

            Keen.data (el, "blink", {
                ref: blinkRef,
                tag: tag,
                opacity: Keen.style (el, "opacity")
            });

            blinks [tag][blinkRef] = el;
            blinkRef++;

            if (blinkerId === null) {
                blinkerId = setInterval (function () {
                    var count = 0;

                    Keen.each (blinks, function (k, els) {
                        Keen.each (els, function (i, v) {
                            count++;
                            Keen.style (v, "opacity", blink);
                        });
                    });
                    
                    if (count === 0) {
                        clearInterval (blinkerId);
                        blinkerId = null;
                        return;
                    }

                    blink = !blink | 0;
                }, 500);
            }
        }
    });

    /* 
     * We make this public so that
     * everybody can easily modify
     * Keen.style's behaviour.
     */

    Keen.extend (Keen.style, {
        hooks: {
            opacity: {
                get: function (el, computed) {
                    if (Keen.browser.msie) {
                        var filter = Keen
                            .style (el, "filter", computed)
                             .match (/opacity=([^)]*)/i);

                        return filter && filter [1] ? 
                               (parseFloat (filter [1]) / 100).toString () : "1";
                    }
                },

                set: function (el, value) {
                    if (Keen.browser.msie) {
                        if (value.toString ().length && value !== 1) {
                            Keen.style (el, "filter", 
                                "alpha(opacity=" + value * 100 + ")");
                        } else {
                            Keen.style (el, "filter", "");
                        }
                    }
                }
            }
        },

        compute: function (el, name, value) {
            var prev = Keen.style (el, name, false);

            Keen.style (el, name, value);

            var ret = Keen.style (el, name);

            if (!ret) {
                ret = Keen.style (el, name, false);
            }

            Keen.style (el, name, prev);

            return ret;
        }
    });

    Keen.Fx.prototype = {
        start: function (from, to, units) {
            this.from = from;
            this.to = to;
            this.units = units;
            this.time = +new Date;
            this.isTweening = true;
            
            var self = this;

            function t (gotoEnd) {
                return self.step (gotoEnd);
            }

            t.el = this.el;

            if (t () && Keen.Fx.timers.push (t) && !Keen.Fx.timerId) {
                Keen.Fx.timerId = setInterval (function () {
                    var timers = Keen.Fx.timers,
                        l = timers.length;

                    for (var i = 0; i < l; i++) {
                        if (!timers [i] ()) {
                            timers.splice (i--, 1);
                            l--;
                        }
                    }

                    if (!l) {
                        clearInterval (Keen.Fx.timerId);
                        Keen.Fx.timerId = null;
                    }
                }, 13);
            }

            return this;
        },

        stop: function (gotoEnd) {
            var timers = Keen.Fx.timers;

            for (var i = timers.length - 1; i >= 0; i--) {
                if (timers [i].el === this.el) {
                    if (gotoEnd) {
                        timers [i] (true);
                    }

                    timers.splice (i, 1);
                }
            }

            this.isTweening = false;
        },

        step: function (gotoEnd) {
            var time = +new Date;

            if (!gotoEnd && time < this.time + this.options.duration) {
                this.cTime = time - this.time;
                this.now = {};

                for (p in this.to) {
                    if (Keen.isArray (this.to [p])) {
                        var color = [], j;

                        for (j = 0; j < 3; j++) {
                            if (this.from [p] === undefined || this.to [p] === undefined) {
                                return false;
                            }

                            color.push (Math.min (parseInt (
                                this.compute (this.from [p][j], this.to [p][j])), 255));
                        }

                        this.now [p] = color;
                    } else {
                        this.now [p] = this.compute (this.from [p], this.to [p]);

                        if (this.options.discrete) {
                            this.now [p] = Keen.intval (this.now [p]);
                        }
                    }
                }

                this.update ();

                return true;
            }

            setTimeout (Keen.bind (this.options.onComplete, this, this.el), 10);

            this.now = Keen.extend (this.to, this.options.orig);
            this.update ();

            if (this.options.hide) {
                Keen.hide (this.el);
            }

            return this.isTweening = false;
        },

        compute: function (from, to) {
            var change = to - from;

            return this.options.transition (this.cTime, from, change, this.options.duration);
        },

        update: function () {
            for (var p in this.now) {
                if (Keen.isArray (this.now [p])) {
                    Keen.style (this.el, p, "rgb(" + this.now [p].join (",") + ")");
                } else {
                    Keen.style (this.el, p, 
                         this.units [p] ? this.now [p] + this.units [p] : this.now [p]);
                }
            }
        },

        cur: function (name, computed) {
            return parseFloat (Keen.style (this.el, name, computed)) || 0;
        }
    };

    Keen.each ({
        slideDown: {
            height: "show"
        },

        slideUp: {
            height: "hide"
        },

        fadeIn: {
            opacity: "show"
        },

        fadeOut: {
            opacity: "hide"
        },

        fadeToggle: {
            opacity: "toggle"
        }
    }, function (name, params) {
        Keen.Fx [name] = function (el, duration, callback) {
            return Keen.Fx.animate (el, params, duration, callback);
        };
    });

    function setShortcut (name, func) {
        if (window [name]) {
            throw new Error (name + " shortcut has already been set. Be careful! Mess may happen!");
        }

        window [name] = func;
    }

    setShortcut ("Ki", Ki);
    setShortcut ("Kt", Kt);
    setShortcut ("K", function (selector, root) {
        return new Keen (selector, root);
    });

    window.Keen = Keen;

}) ();
