(function(g3, $, window, document, undefined){
/**
 * @summmary
 * g3.utils
 * --------
 * @desc
 * A global object with utility functions.
 * @namespace {Object} g3.utils
 * @version 0.1
 * @author {@link https:/github.com/centurianii}
 * @copyright MIT licence
 */
g3.utils = g3.utils || {};

/**
 * @summary
 * g3.utils.id
 * -----------
 * @desc
 * The file `id`.
 * @var {String} g3.utils.id
 */
g3.utils.id = 'iuGXtklwZorkyG6kJ2zYlKHf';

/**
 * @summary
 * g3.utils.warning
 * ----------------
 * @desc
 * Prints a warning at the console, if `console.warn()` or `console.log()` do exist.
 * @function g3.utils.warning
 * @param {String} message The message to be print
 * @return {undefined}
 */
g3.utils.warning = function(message){
   if (window.console.warn) {
      console.warn(message);
   } else if (window.console.log) {
      console.log(message);
   }
};

/**
 * @summary
 * g3.utils.printHTML
 * ------------------
 * @desc
 * Replaces the `<` character in html code with the equivalent `&lt;` so that it 
 * can be inserted in a html page!
 * @function g3.utils.printHTML
 * @param {String} html The string to be converted
 * @return {String} Returns the initial string with the `<` character replaced 
 *    by the html equivalent entity `&lt;`
 */
g3.utils.printHTML = function(html){
   if(typeof html === 'string')
      return html.replace(/</g, '&lt;');
   else
      return html;
};

/**
 * @summary
 * g3.utils.revertPrintHTML
 * ------------------------
 * @desc
 * Replaces the `&lt;` characters in a string with the equivalent `<` so that it 
 * can be inserted in text fields.
 * @function g3.utils.revertPrintHTML
 * @param {String} str The string to be converted
 * @return {String} Returns the initial string with the `&lt;` characters replaced 
 *    by the html equivalent `<`
 */
g3.utils.revertPrintHTML = function(str){
   if(typeof str === 'string')
      return str.replace(/&lt;/g, '<');
   else
      return str;
};

/**
 * @summary
 * g3.utils.randomString
 * ---------------------
 * @desc
 * Returns a random string that is built by characters taken from a default set
 * or by a passed one.
 * @function g3.utils.randomString
 * @param {Number} len The length of the returned string
 * @param {String} charSet The character set in use
 * @param {String} grammar If true then, 1st character is only a character from 
 *    alphabet
 * @return {String} Returns a random string of characters
 * @see {@link http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript?rq=1|stackoverflow.com}
 */
g3.utils.randomString = function(len, charSet, grammar){
   charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var result = '', ndx;
   for (var i = 0; i < len; i++){
      ndx = Math.floor(Math.random() * charSet.length);
      result += charSet.substring(ndx, ndx+1);
   }
   if (grammar === true) {
      while (g3.utils.type(result[0]*1) != 'nan'){
         ndx = Math.floor(Math.random() * charSet.length);
         result = charSet.substring(ndx, ndx+1) + result.slice(1);
      }
   }
   return result;
};

/**
 * @summary
 * g3.utils.type
 * -------------
 * @desc
 * Returns a lowercase string representation of an object's constructor.
 * @function g3.utils.type
 * @param {Type} obj Object of any type, native, host or custom
 * @return {String} Returns a lowercase string representing the object's 
 *    constructor or NaN for this specific object
 * @see {@link http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/|perfectionkills.com}, 
 * {@link http://stackoverflow.com/questions/3215046/differentiating-between-arrays-and-hashes-in-javascript|stackoverflow.com} and 
 * {@link http://javascript.info/tutorial/type-detection|javascript.info}
 */
g3.utils.type = function (obj){
   if(obj === null)
      return 'null';
   else if(typeof obj === 'undefined')
      return 'undefined';
   
   var type = Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1].toLowerCase();
   
   // hack for NaN type so we can test: g3.utils.type(obj) == 'nan'
   if((type == 'number') && isNaN(obj))
      type = 'nan';
      
   return type;
};

/**
 * @summary
 * g3.utils.contains
 * -----------------
 * @desc
 * Extends Array.indexOf() in a better way.
 * 
 * It returns true only when it finds the 2nd argument, the passed sub-string, 
 * into the 1st one which is an array of mixed types or a string. In all other 
 * cases, it returns false.
 * 
 * More explicitly:
 * 1) the empty string, '', as a 2nd argument always returns false, 
 * 
 * 2) a mixed array of strings and any other type, it returns true if it contains 
 *    the sub-string, 
 * 
 * 3) a mixed array of any type except strings, it always returns false.
 * @function g3.utils.contains
 * @param {String|String[]} strArr A string or an array of strings
 * @return {Boolean} It returns true only when the 2nd argument is found 
 *    somewhere in the first one. In all other cases, it returns false.
 */
g3.utils.contains = function(strArr, str){
   if(!strArr || !str || (g3.utils.type(str) !== 'string'))
      return false;
   if(g3.utils.type(strArr) === 'string')
      return (strArr.indexOf(str) > -1);
   else if((g3.utils.type(strArr) === 'array') && (strArr.length > 0)){
      for(var i = 0; i < strArr.length; i++){
         if(strArr[i] && (g3.utils.type(strArr[i]) === 'string') && (strArr[i].indexOf(str) > -1))
            return true;
      }
      return false;
   }else
      return false;
}

/**
 * @summary
 * g3.utils.addDate
 * ----------------
 * @desc
 * Adds any date string to a Date object.
 * 
 * The date string can be in any format like 'ny:nw:nd:nh:nm:ns' where 'n' are
 * numbers and 'y' is for 'years', 'w' is for weeks, 'd' for days, 'h' for 
 * hours, 'm' for minutes and 's' for seconds. You can even pass alternatives 
 * like 'Y' or 'Year' or 'YEar' etc.
 * 
 * The string's delimiter can be anything you like.
 * @function g3.utils.addDate
 * @param {String} t The date string to add
 * @param {Date} date The Date object
 * @param {String} delim The delimiter used inside the date string
 * @return {undefined|Date} A Date object if you forgot to give a valid Date 
 *    as 2nd argument
 */
g3.utils.addDate = function (t, date, delim) {
   var delim = (delim)? delim : ':',
       x = 0,
       z = 0,
       arr = (t)? t.split(delim) : '',
       result = false;
   
   for(var i = 0; i < arr.length; i++) {
      z = parseInt(arr[i], 10);
      if (z != NaN) {
         var y = /^\d+?y/i.test(arr[i])? 31556926: 0; //years
         var w = /^\d+?w/i.test(arr[i])? 604800: 0;   //weeks
         var d = /^\d+?d/i.test(arr[i])? 86400: 0;    //days
         var h = /^\d+?h/i.test(arr[i])? 3600: 0;     //hours
         var m = /^\d+?m/i.test(arr[i])? 60: 0;       //minutes
         var s = /^\d+?s/i.test(arr[i])? 1: 0;        //seconds
         x += z * (y + w + d + h + m + s);
      }
   }
   if (g3.utils.type(date) != 'date') {
      result = true;
      date = new Date();
   }
   date.setSeconds(date.getSeconds() + x);
   if (result)
      return date;
}

/**
 * @summary
 * g3.utils.isVisible
 * ------------------
 * @desc
 * A simple function that decides if an element is (partially) visible in
 * viewport. It uses jQuery.
 * @function g3.utils.isVisible
 * @param {Object} elem An element from the DOM
 * @return {Boolean} True if it is at least partially visible
 */
g3.utils.isVisible = function (elem) {
   var elementTop = $(elem).offset().top,
       elementBottom = elementTop + $(elem).outerHeight(),
       viewportTop = $(window).scrollTop(),
       viewportBottom = viewportTop + $(window).height();
   
   return (elementBottom > viewportTop) && (elementTop < viewportBottom);
}

/**
 * @summary
 * g3.utils.isEmptyObject
 * ----------------------
 * @desc
 * Returns a boolean indicating if the identifier contains members or not.
 * 
 * It accepts native types (number, date, string, arrays), functions, and native 
 * or host objects.
 * @function g3.utils.isEmptyObject
 * @param {*} obj Any object type; native, host or custom
 * @param {String} proto A string with value `prototype` searches the prototype 
 *    chain of the given object or else, prototype is not followed
 * @return {Boolean} Returns true only if argument contains members that are 
 *    enumerable but when they are not then, the result is ambiguous!
 * @see {@link http://stackoverflow.com/questions/2673121/how-to-check-if-object-has-any-properties-in-javascript}
 */
g3.utils.isEmptyObject = function(obj, proto){
   var result = true;
   if(obj === null)
      return result;
   //Operator typeof reports everything that can be iterated -except functions!- 
   //as objects.
   if((typeof obj === 'object') || (typeof obj === 'function')){
      for(var prop in obj){
         if((g3.utils.type(proto) === 'string') && (proto === 'prototype')){
            result = false;
            break;
         }else{
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
               result = false;
               break;
            }
         }
      }
      //overwrite previous result! (new ECMA 5 properties)
      //FF Error: returns 5 prototype properties on functions and 1 on arrays
      //as their own!
      /*if(typeof Object.getOwnPropertyNames === 'function'){
         result = (Object.getOwnPropertyNames(obj).length === 0);
      }*/
   }
   return result;
};

/**
 * @summary
 * g3.utils.isMobile
 * -----------------
 * @desc
 * Creates an object with member functions that test if the client's browser 
 * belongs to a specific family of devices.
 * @function g3.utils.isMobile
 * @return {Boolean}
 * @see {@link https://stackoverflow.com/questions/32570067/how-to-detect-whether-browser-is-ios-android-or-desktop-using-jquery}, 
 * {@link https://bitsrc.io/tomlandau/simple-js/global/is-mobile/code#src/global/isMobile.js}
 */
g3.utils.isMobile = {
   getUserAgent: function() {
      return navigator.userAgent;
   },
   Android: function() {
      return /Android/i.test(this.getUserAgent()) && !this.Windows();
   },
   BlackBerry: function() {
      return /BlackBerry|BB10|PlayBook/i.test(this.getUserAgent());;
   },
   iPhone: function() {
      return /iPhone/i.test(this.getUserAgent()) && !this.iPad() && !this.Windows();
   },
   iPod: function() {
      return /iPod/i.test(this.getUserAgent());
   },
   iPad: function() {
      return /iPad/i.test(this.getUserAgent());
   },
   iOS: function() {
      return (this.iPad() || this.iPod() || this.iPhone());
   },
   Opera: function() {
      return /Opera Mini/i.test(this.getUserAgent());
   },
   Windows: function() {
      return /Windows Phone|IEMobile|WPDesktop/i.test(this.getUserAgent());
   },
   KindleFire: function() {
      return /Kindle Fire|Silk|KFAPWA|KFSOWI|KFJWA|KFJWI|KFAPWI|KFAPWI|KFOT|KFTT|KFTHWI|KFTHWA|KFASWI|KFTBWI|KFMEWI|KFFOWI|KFSAWA|KFSAWI|KFARWI/i.test(this.getUserAgent());
   },
   any: function() {
      return (this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows());
   }
};

/**
 * @summary
 * g3.utils.getEventLock
 * ---------------------
 * @desc
 * Set it as a go-no-go switch at the begining of a starting event handler and 
 * forget it. Similar call `g3.utils.deleteEventLock(key, eventLock)` at the 
 * begining of the corresponding ending event handler. It is used for handlers 
 * on multiple events for different devices that we don't want to run multiple 
 * times. Events should come in pairs: a starting and an ending event.
 * 
 * It operates on a private variable visible in an isolated context with name
 * `eventLock` and uses another `eventLockDelay`; both are passed as arguments.
 * 
 *  `eventLock` should be declared as an empty object that will be filled with
 * objects '{primary: <event type>, pid: <integer>}'.
 * 
 * `eventLockDelay` should be assigned an integer denoting a time frame greater 
 * than the execution duration of the starting event handler.
 * 
 * If hardware changes during a session, just press input device more than 
 * `eventLockDelay` to make it primary. See {@link g3.utils.setEventLock} and 
 * {@link g3.utils.deleteEventLock}.
 * @function g3.utils.getEventLock
 * @param {Object} evt The event object
 * @param {String} key The key in the private variable `eventLock` for a pair of
 *    event handlers
 * @param {Object} eventLock A private object of objects 
 *    '{primary: <event type>, pid: <integer>}'
 * @param {Object} eventLockDelay A private variable for primary event detection
 *    on a continuous press
 * @return {Boolean} True for the primary event at the specific hardware operated
 *    in user's machine at that time
 */
g3.utils.getEventLock = function(evt, key, eventLock, eventLockDelay){
   if(typeof(eventLock[key]) == 'undefined'){
      eventLock[key] = {};
      eventLock[key].primary = evt.type;
      return true;
   }
   if(evt.type == eventLock[key].primary)
      return true;
   else
      return false;
   
   eventLock[key].pid = setTimeout(closure, eventLockDelay);
   
   function closure(){
      g3.utils.setEventLock(evt, key, eventLock);
      //eventLock[key] = setTimeout(closure, eventLockDelay);
   }
};

/**
 * @summary
 * g3.utils.setEventLock
 * ---------------------
 * @desc
 * Used by {@link g3.utils.getEventLock}.
 * @function g3.utils.setEventLock
 * @param {Object} evt The event object
 * @param {String} key The key in the private variable `eventLock` for a pair of
 *    event handlers
 * @param {Object} eventLock A private object of objects 
 *    '{primary: <event type>, pid: <integer>}'
 * @return {undefined}
 */
g3.utils.setEventLock = function(evt, key, eventLock){
   eventLock[key].primary = evt.type;
};

/**
 * @summary
 * g3.utils.deleteEventLock
 * ------------------------
 * @desc
 * Set it at the begining of an ending event handler and forget it, see 
 * {@link g3.utils.getEventLock}.
 * @function g3.utils.deleteEventLock
 * @param {String} key The key in the private variable `eventLock` for a pair of
 *    event handlers
 * @param {Object} eventLock A private object of objects 
 *    '{primary: <event type>, pid: <integer>}'
 * @return {undefined}
 */
g3.utils.deleteEventLock = function(key, eventLock){
   clearTimeout(eventLock[key].pid);
}

/**
 * @summary
 * g3.utils.getWindow
 * ------------------
 * @desc
 * Given a node, it returns the containing window.
 * @function g3.utils.getWindow
 * @param {Object} node A DOM Node that belongs to the window a reference of 
 *    which we want to return
 * @return {Object} On success, it returns the node's parent window or the current
 *    one if `node` isn't a reference to an element
 */
g3.utils.getWindow = function(node){
   if(node && ((node.nodeType == 1) || (node.nodeType == 3))){
      if(node.ownerDocument){
         return node.ownerDocument.defaultView || node.ownerDocument.parentWindow;
      }else{
         while(node.parentNode)
            node = node.parentNode;
         return node.defaultView || node.parentWindow;
      }
   }
   return window;
};


/**
 * @summary
 * g3.utils.createStyleNode
 * ------------------------
 * @desc
 * Creates a style element with rules passed as text and adds it at head, body or
 * as a child of a node reference.
 * 
 * You can pass an object as argument with members all the argument names
 * in this definition.
 * @function g3.utils.createStyleNode
 * @param {String} cssText It contains all the css rules
 * @param {String} tag The parent of the created link element, defaults to `head`
 * @param {String} media The `media` property of a style
 * @param {String} type The `type` property of a style
 * @param {String} id The `id` property of a style
 * @param {Object} win The host window object or any child node, defaults to 
 *    `window`
 * @return {False|Object} Returns false on failure during construction otherwise, 
 *    the created style node
 */
g3.utils.createStyleNode = function(cssText, tag, media, type, id, win){
   var obj = cssText;
   //overwrite arguments in case of a first argument object
   if(typeof obj === 'object'){
      tag = obj.tag;
      media = obj.media;
      type = obj.type;
      id = obj.id;
      win = obj.win;
      cssText = obj.cssText; //always last!
   }
   if(!win || (win.self !== win) || !(win.window == win))
      win = window;
   //convert 'tag' to node reference
   if(!tag)
      tag = 'head';
   if(typeof tag === 'string'){
      tag = tag.toLowerCase();
      if((tag !== 'head') && (tag !== 'body'))
         tag = win.document.getElementsByTagName('head')[0];
      else
         tag = win.document.getElementsByTagName(tag)[0];
   }
   if(!tag.nodeType || (typeof cssText !== 'string'))
      return false;
   try{
      var style = win.document.createElement('style');
      style.setAttribute('type', type);
      style.setAttribute('media', media);
      style.setAttribute('id', id);
   }catch(e){
      return false;
   }
   try{
      //also covers WebKit hack :(
      style.appendChild(win.document.createTextNode(cssText));
      //style.innerHTML = cssText;
   }catch(e){
      try{
         style.styleSheet.cssText = cssText;
      }catch(e){
         return false;
      }
   }
   tag.appendChild(style);
   return style;
};
/**
 * @summary
 * g3.utils.createScriptNode
 * -------------------------
 * @desc
 * Creates a script element and adds it at `<head>` or at `<body>`. It returns 
 * the newly created node or false.
 * 
 * By giving a frame window, the script is built on that farme. By giving any 
 * node inside that window, it is converted to the parent window.
 * 
 * If a `callback` is given then:
 * - it is called on `load` event and,
 * 
 * - `this` inside the function refers to the script node.
 * 
 * You can pass an object as argument with members all the argument names
 * in this definition.
 * @function g3.utils.createScriptNode
 * @param {String|null} text Commands for the script node
 * @param {String} tag Defaults to `head`, values `[head|body]`
 * @param {String} src The `src` property of a script
 * @param {String} type The `type` property of a script
 * @param {String} id The `id` property of a script
 * @param {Object} win The host window object or any child node, defaults to 
 *    `window`
 * @param {Object} data Assigns data to the script node
 * @param {Function} callback A callback function where `this` refers to the 
 *    script node
 * @return {False|Object} Returns false on failure otherwise, the created script
 *    node
 */
g3.utils.createScriptNode = function(text, tag, src, type, id, win, data, callback){
   var obj = text,
       prop;
   //overwrite arguments in case of a first argument object
   if(g3.utils.type(obj) === 'object'){
      tag = obj.tag;
      src = obj.src;
      type = obj.type;
      id = obj.id;
      win = obj.win;
      data = obj.data;
      callback = obj.callback;
      text = obj.text; //always last!
   }
   win = g3.utils.getWindow(win);
   if(!win || (win.self !== win) || !(win.window == win))
      win = window;
   //convert 'tag' to node reference
   if(!tag)
      tag = 'head';
   if(typeof tag === 'string'){
      tag = tag.toLowerCase();
      if((tag !== 'head') && (tag !== 'body'))
         tag = win.document.getElementsByTagName('head')[0];
      else
         tag = win.document.getElementsByTagName(tag)[0];
   }
   try{
      var script = win.document.createElement('script');
      if(type) script.setAttribute('type', type);
      if(id) script.setAttribute('id', id);
      if(g3.utils.type(data) === 'object'){
         for(prop in data)
            if(data.hasOwnProperty(prop))
               script[prop] = data[prop];
      }
      if(callback) script.addEventListener('load', callback);
      if(text && text.trim()){
         try{
            script.appendChild(win.document.createTextNode(text));
            //script.innerHTML = text;
         }catch(e){
            try{
               script.text = text;
            }catch(e){
               return false;
            }
         }
      }
      //attention: error in FF if an empty src is set!
      if(src) script.setAttribute('src', src);
   }catch(e){
      return false;
   }
   tag.appendChild(script);
   return script;
};

/**
 * @summary
 * g3.utils.clearString
 * --------------------
 * @desc
 * Given a string, it's delimited parts by a given argument are compared against 
 * a number of extra arguments, strings or regular expressions, the matches are 
 * deleted and the new string is returned.
 * 
 * @function g3.utils.clearString
 * @param {String} str The search string we want to clear
 * @param {String} delim The delimiter that splits the search string
 * @param {String|RegExp} {...*} arg Delimited parts of the initial string are 
 *    compared against these arguments after they are turned to regular expressions;
 *    strings that we want to contain special characters to be used in the regular 
 *    expression conversion should be double backslashed
 * @return {String} The third and next arguments are compared with the splitted 
 *    parts of the initial string, every match that is found it is deleted, the 
 *    result is joined and it is returned
 */
g3.utils.clearString = (typeof g3.utils.clearString === 'function')? g3.utils.clearString : function(str, delim, arg){
   var props, 
       arr, 
       reg;
   
   if((typeof str !== 'string') || !str || (typeof delim !== 'string') || !delim)
      return str;
   //get properties from arguments
   props = Array.prototype.slice.call(arguments, 2);
   if(props.length === 0)
      return str;
   //build regex
   for(var i = 0; i < props.length; i++){
      if(g3.utils.type(props[i]) === 'regexp')
         props[i] = '(?:' + props[i].source + ')';
      else if((g3.utils.type(props[i]) === 'string') || (g3.utils.type(props[i]) === 'number'))
         props[i] = '(?:' + props[i] + ')';
      else{
         props.splice(i, 1);
         i--;
      }
   }
   if(props.length === 0)
      return str;
   reg = new RegExp(props.join('|'), 'gi');
   //delete strings separated by delim
   arr = str.split(delim);
   for(var i = 0; i < arr.length; i++){
      if(arr[i].search(reg) !== -1){
         arr.splice(i, 1);
         i--;
      }
   }
   str = arr.join(delim);
   return str;
}
}(window.g3 = window.g3 || {}, jQuery, window, document));


// POLYFILLS
// see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
(function () {

  if ( typeof window.CustomEvent === "function" ) return false;

  function CustomEvent ( event, params ) {
    params = params || { bubbles: true, cancelable: true, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

// see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
(function(){
   if (!Array.prototype.indexOf || ([0, 1].indexOf(1, 2) != -1)){
      Array.prototype.indexOf = function (searchElement, fromIndex){
         if ( this === undefined || this === null ){
            throw new TypeError( '"this" is null or not defined' );
         }
         var length = this.length >>> 0; // Hack to convert object.length to a UInt32
         fromIndex = +fromIndex || 0;
         if (Math.abs(fromIndex) === Infinity){
            fromIndex = 0;
         }
         if (fromIndex < 0){
            fromIndex += length;
            if (fromIndex < 0){
               fromIndex = 0;
            }
         }
         for (;fromIndex < length; fromIndex++){
            if (this[fromIndex] === searchElement){
               return fromIndex;
            }
         }
         return -1;
      };
   }
})();
