(function(g3, $, window, document, undefined){
/**
 * @summmary
 * g3
 * --
 * @desc
 * A global object that holds all classes, functions, variables.
 * @namespace {Object} g3
 * @version 0.1
 * @author https:/github.com/centurianii
 * @copyright MIT licence
 */

/**
 * @summmary
 * g3.utils
 * --------
 * @desc
 * A global object with utility functions.
 * @namespace {Object} g3.utils
 * @version 0.1
 * @author https:/github.com/centurianii
 * @copyright MIT licence
 */
g3.utils = g3.utils || {};

/**
 * @summary
 * The file `id`.
 * @var {String} g3.utils.id
 */
g3.utils.id = 'iuGXtklwZorkyG6kJ2zYlKHf';

/**
 * @summary
 * Prints a warning at the console, if `console.warn()` exists else, it uses 
 * `console.log()`.
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
 * Returns a random string that is built by characters taken from a default set
 * or from a passed one.
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
 * Between strings and/or array of strings, it returns an array of common members.
 * @desc
 * If no common element has been found between the arguments, an empty array is 
 * returned.
 * @function g3.utils.intersect
 * @param {*} args Any number of strings or arrays of strings 
 * @return {string[]} It returns an array of all the common elements
 */
g3.utils.intersect = function(){
   var args = Array.prototype.slice.call(arguments, 0),
       arg,
       i,
       tmp,
       arr = [],
       found;
   
   for(i = 0; i < args.length; i++){
      if(g3.utils.type(args[i]) != 'array')
         args[i] = [args[i]];
   }
   
   if(args.length == 0)
      return arr;
   
   if(args.length == 1)
      return args[0];
   
   arg = args.shift();
   while((arg !== undefined) && (args.length >= 1)){
      tmp = arg.shift();
      while(tmp !== undefined){
         found = true;
         for(i = 0; i < args.length; i++){
            if(args[i].indexOf(tmp) == -1){
               found = false;
               break;
            }
         }
         if(found)
            arr.push(tmp);
         tmp = arg.shift();
      }
      arg = args.shift();
   }
   return arr;
}

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

g3.utils.isVisible = function (elem) {
   var elementTop = $(elem).offset().top,
       elementBottom = elementTop + $(elem).outerHeight(),
       viewportTop = $(window).scrollTop(),
       viewportBottom = viewportTop + $(window).height();
   
   return (elementBottom > viewportTop) && (elementTop < viewportBottom);
}

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
   }
   return result;
};

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

g3.utils.setEventLock = function(evt, key, eventLock){
   eventLock[key].primary = evt.type;
};

g3.utils.deleteEventLock = function(key, eventLock){
   clearTimeout(eventLock[key].pid);
}

g3.utils.getWindow = function(node){
   if(node && ((node.nodeType == 1) || (node.nodeType == 3))){
      if(node.ownerDocument){
         return node.ownerDocument.defaultView || node.ownerDocument.parentWindow;
      }else{
         while(node.parentNode)
            node = node.parentNode;
         return node.defaultView || node.parentWindow;
      }
   }else if(g3.utils.type(node) == 'htmldocument')
      return node.parentWindow || node.defaultView;
   else if((node === node.self) && (node === node.window))
      return node;
   return window;
};

g3.utils.createStyleNode = function(cssText, tag, media, type, id, win){
   var obj = cssText,
       style;
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
      style = win.document.createElement('style');
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

g3.utils.createScriptNode = function(text, tag, src, type, id, win, data, callback){
   var obj = text,
       prop,
       script;
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
      script = win.document.createElement('script');
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

g3.utils.clearString = function(str, delim, arg){
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

(function(g3, $, window, document, undefined){
   g3.debounce = function(func, options, arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9){
      var state = {
         pid: null,
         last: 0
      };
      if(typeof func !== 'function')
         return null;
      if(!options || (typeof options.delay !== 'number'))
         return func;
      //default options.fireFirst = false
      if(typeof options.fireFirst === 'undefined')
         options.fireFirst = false;
      //default options.fireLast = false when options.fireFirst === true
      if((options.fireFirst === true) && (typeof options.fireLast === 'undefined'))
         options.fireLast = false;
      //default options.fireLast
      if(typeof options.fireLast === 'undefined')
         options.fireLast = true;
      
      //usually 'callback()' is called without arguments, a.k.a event handler!
      //but, arguments do passed through the closure above!
      //we use Function.call() instead of Function.apply() because named 
      //arguments do cover the sooo poor case of just an array argument that 
      //Function.apply() imposes(!!)
      function callback(evt){
         var tmp = new Date().getTime();
         var elapsed = tmp - state.last;
         state.last = new Date().getTime();
         function exec(){
            //state.last = new Date().getTime();
            if(!options.context || (typeof options.context != 'object')) {
               if(evt)
                  return func(evt, arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
               else
                  return func(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
            } else {
               if(evt)
                  return func.call(options.context, evt, arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
               else
                  return func.call(options.context, arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
            }
         }
         //execute at start
         if(options.fireFirst === true){
            if(elapsed >= options.delay)
               exec();
         }
         //execute at end
         if(options.fireLast === true){
            clearTimeout(state.pid);
            state.pid = setTimeout(exec, options.delay);
         }
      }
      
      return callback;
   }
}(window.g3 = window.g3 || {}, jQuery, window, document));

(function(g3, $, window, document, undefined){
/**
 * @constructs g3.debug
 * @summary
 * The return of `g3.debug` when called as function is an object for debugging 
 * purposes.
 * @desc
 * Internally, `g3.debug` stores:
 * - a flattened representation of the object that we pass as 1st argument and 
 * 
 * - functions that can stringify that argument.
 * 
 * These functions can print native types (number, boolean, string, date, array, etc.), 
 * functions and objects of any type native, host or custom in the form of:
 * - `value` for simple types or, 
 * 
 * - `[depth] key -> value` for complex ones.
 * 
 * Circular references are never followed. 
 * 
 * Flattened representation of objects
 * -----------------------------------
 * A flattened representation of the tree-structure of an object is a 2-dimensional 
 * `array(i, j)` whose index `i` stores a 3 to 5-cell linear sub-array where: 
 * 1. sub-index `0`, `(i, 0)`, keeps the depth of the current member, 
 * 
 * 2. sub-index `1`, `(i, 1)`, keeps the name of the member, 
 * 
 * 3. sub-index `2`, `(i, 2)`, keeps the member's value, 
 * 
 * 4. sub-index `3`, `(i, 3)`, keeps a formatted string of this value and 
 * 
 * 5. sub-index `4`, `(i, 4)`, keeps possible references of that value in other 
 *    places in the tree. 
 * 
 * This representation exhibits some interesting behaviours:
 *
 * 1) Between two successive&#42; depths with the same value, `n` at `(i, 0)` and `(i + j, 0)`
 *    exist all members of the object at `(i, 1)` as in the following example:
 * 
 * (&#42;)successive = there is not a number less than n bettwen them.
 * 
 * ```
 * members        |(i+j,0)->depth|(i+j,1)->member|(i+j, 2)->value
 * .............  | .........    | .........     | .........
 * |--[a]         |(i,   0)->n   |(i,   1)->'a'  |(i,   1)->'custom object' <---|
 * |   |--[b]     |(i+1, 0)->n+1 |(i+1, 1)->'b'  |(i+1, 1)->'custom object' \   | members of
 * |   |   |--[c] |(i+2, 0)->n+2 |(i+2, 1)->'c'  |(i+2, 1)->'value of c'    |----
 * |   |--[d]     |(i+3, 0)->n+1 |(i+3, 1)->'d'  |(i+3, 1)->'value of d'    /
 * |--[e]         |(i+4, 0)->n   |(i+4, 1)->'e'  |(i+4, 1)->'value of e'  |----> not a member
 * ............   | .........    | .........     | .........
 *```
 * 
 * 2) Similarly, successive&#42; entries with the same depth n+1 are all members of the 
 * object at depth n at the entry immediate before the first of them. Example: 
 * at n+1 we can see 2 members of an object at depth n.
 * 
 * (&#42;)successive = there is not a number less than n between them.
 * 
 * Parameters
 * ----------
 * The 2nd argument controls the depth of the analysis.
 * 
 * The 3rd argument, `noFollow`, controls the way searches are executed:
 * 1. `false` or empty string makes every passed argument searchable,
 * 
 * 2. no argument defaults to static values {@link g3.debug.noFollow} of what 
 *    not to search for,
 * 
 * 3. a space delimited string of types makes them not searchable, e.g. if it is 
 *    the value `string` analysis excludes `string` types etc.
 * @param {*} obj An identifier of any type that is to be analysed
 * @param {Integer} maxDepth The maximum depth to look for; zero-based
 * @param {Boolean|null|String} noFollow Manipulates analysis on types 
 * @return {Object} A debugging object
 * @version 0.2
 * @author https:/github.com/centurianii
 * @copyright MIT licence
 */
g3.debug = function(obj, maxDepth, noFollow){ //construct with argument
   var tree = [], refs = [], max = 0, proto,
   natives = ['boolean', 'string', 'undefined', 'null', 'nan', 'number', 'date', 'object', 'function', 'array', 'regexp'];
   
   //some initialization
   function _init(){
      refs.push(-1);
      if((g3.utils.type(maxDepth) === 'number') && (maxDepth > 0))
         max = maxDepth;
      //false for 3rd argument means the user wants everything to be followed (traversed) down the tree
      if(noFollow === false)
         noFollow = '';
      //absence of 3rd argument means user leaves the function to decide
      if(g3.utils.type(noFollow) !== 'string')
         noFollow = g3.debug.noFollow;
      noFollow = noFollow.toLowerCase();
      //search prototype chain if it's not mentioned in argument 'noFollow'
      if(noFollow.indexOf('prototype') === -1)
         proto = 'prototype';
   }
   
   //define iterability on passed argument: this is not the same as object's 
   //emptiness in cases where it isn't empty! 
   //e.g. we want strings to be printed as strings and not as arrays!
   function _isIterable(obj, ndx){
      //1. basic check of iterability
      var result = !g3.utils.isEmptyObject(obj, proto), tmp;
      //2. make all unknown types iterable
      tmp = _describeValue(obj).toLowerCase();
      if(tmp.indexOf('unknown') > -1)
         result = true;
      //3. apply rules of 3rd argument at g3.debug() that make object non-iterable
      if(noFollow.indexOf(g3.utils.type(obj)) > -1)
         result = false;
      else if((noFollow.indexOf('reference') > -1) && ndx && tree[ndx] && 
         (tree[ndx].length === 5) && 
         (tree[ndx][4].indexOf('reference') > -1))
         result = false;
      else if((noFollow.indexOf('unknown') > -1) && (tmp.indexOf('unknown') > -1))
         result = false;
      return result;
   }
   
   function _traverse(o, i){
      var value, tmp, circular, ref, level;
      
      if(_isIterable(o)){
         for (var property in o){
            /* 1. Find values
             * --------------
             * can't give numbers as properties, 
             * e.g.: Mozila's number-properties of 'style' object!!!
             */
            property += '';
            try{
               value = o[property];
            }catch(e){
               //Attention: 4th cell should be a string!
               tree.push([i, property, '[Error]', e.toString(), '[Error]']);
               continue;
            }
            
            /* 2. Print type & value
             * ---------------------
             * add a new record of depth-property-value-descriptor
             */
            tree.push([i, property, value, _describeValue(value)]);
            
            /* 3. Start recursion
             * ------------------
             * Operator typeof reports everything that can be iterated -except 
             * functions!- as objects. Attention: don't analyze or store nulls
             * because we'll have too many annoying reference messages!
             */
            if((value !== null) && ((typeof value === 'function') || (typeof value === 'object'))){
               ref = false;
               circular = false;
               //1. search for references
               for(var j = 1; j < refs.length; j++){
                  if(tree[refs[j]][2] === value){
                     ref = true;
                     tmp = 'references object at index ' + (refs[j] + 1);
                     break;
                  }
               }
               //2. search for circular references
               if(obj === value){
                  circular = true;
                  tmp = 'circular reference of the root object';
               }else if(tree.length > 1){
                  level = tree[tree.length - 1][0];
                  for(var k = 1; k < tree.length; k++){
                     if(tree[tree.length - 1 - k][0] < level){
                        level = tree[tree.length - 1 - k][0];
                        if(tree[tree.length - 1 - k][2] === value){
                           circular = true;
                           tmp = 'circular reference of object at index ' + (tree.length - k);
                           break;
                        }
                     }
                  }
               }
               
               //add a 5th cell in record!
               if(ref || circular)
                  tree[tree.length - 1].push(tmp);
               
               //update object store
               if(!ref && !circular)
                  refs.push(tree.length - 1);
               //start recursion with new 2nd arg but keep original!
               if((!circular) && (i < max) && _isIterable(value, tree.length - 1))
                  _traverse(value, i+1);
            }
         }
      //_traverse(o, i) was called with a non-iterable argument!
      //shouldn't come here from a recursion!
      }else if(o === obj)
         tree.push([null, null, _describeValue(o)]);
   };
   
   //instead of the value of a property, we'll store a string description as a 
   //4th cell so that we can apply text formations before returning a value from '.toHtml()'
   //Attention: we don't handle images as natives because Firefox reports them 
   //as empty objects and the only way to iterate over is to declare them unknown types!
   function _describeValue(value){
      var tmp = '', type = g3.utils.type(value);
      
      if(natives.indexOf(type) > -1){
         if(type === 'boolean')
            tmp = (typeof value === 'object')?'Boolean['+value.toString()+']':'['+value.toString()+']';
         else if(type === 'string')
            tmp = (typeof value === 'object')?'String['+value.toString()+']':(value)? value.toString(): '\'\'';
         else if(type === 'undefined')
            tmp = 'undefined';
         else if(type === 'null')
            tmp = '[null]';
         else if(type === 'nan')
            tmp = '[NaN]';
         else if(type === 'number')
            tmp = (typeof value === 'object')?'Number['+value.toString()+']':value.toString();
         else if(type === 'date')
            tmp = 'Date['+value.toString()+']';
         else if(type === 'object')
            if(g3.utils.isEmptyObject(value, proto))
               tmp = 'Object[{}]';
            else
               tmp = 'Object['+value+']'; //avoid use of .toString()
         else if(type === 'function'){
            tmp = 'Function[';
            if(value.toString)
               tmp += value.toString().slice(0, value.toString().indexOf('{')+1).replace(/\n|\r|[\b]/g, '') + '...}';
            tmp += ']';
         }else if(type === 'array')
            /*typeof operator can't differentiate object from literal construction!*/
            tmp = 'Array['+value.toString()+']';
         else if(type === 'regexp')
            /*typeof operator can't differentiate object from literal construction!*/
            tmp = 'RegExp['+ value.toString() + ']';
      }else
         tmp = 'Unknown[' + value + ']'; //avoid use of .toString()
      
      return tmp;
   }
   
   //should be called only for records with 4 members, i.e. when '_traverse()' 
   //has been iterated the passed argument at least 1 time!
   function _formatRow(record){
      var c_i = g3.debug.color.level, c_prop = g3.debug.color.property, c_val = g3.debug.color.value, c_ref = g3.debug.color.reference, tmp = '';
      if((record.length === 5) && ((record[4].indexOf('Error') > -1) || (record[4].indexOf('circular') > -1))){
         c_val = 'red';
         c_ref = 'red';
      }
      if(record[0] !== null)
         tmp += '<span style="color: '+c_i+'">[' + record[0] + '] </span>';
      if(record[1] !== null)
         tmp += '<span style="color: '+c_prop+'">' + record[1] + '</span> <span style="font-size: 1.4em">&#8594;</span> ';
      tmp += '<span style="color: '+c_val+'">' + g3.utils.printHTML(record[3]).replace(/\n/g, '<br />') + '</span><br />';
      if(record.length >= 5)
         tmp += '<span style="color: '+c_ref+'; font-style: italic">' + g3.utils.printHTML(record[4]).replace(/\n/g, '<br />') + '</span>';
      return tmp;
   }
   
   function _toString(){
      var tmp = _describeValue(obj) + '\n';
      for(var i = 0; i < tree.length; i++){
         if(tree[i][0] !== null)
            tmp += '[' + tree[i][0] + '] ';
         if(tree[i][1] !== null)
            tmp += tree[i][1] + ' -> ';
         if(tree[i].length >= 4)
            tmp += tree[i][3] + '\n';
         if(tree[i].length >= 5)
            tmp += tree[i][4] + '\n';
      }
      return tmp;
   }
   
   function _toHtml(tag){
      var tmp, start, end;
      if(g3.utils.type(tag) !== 'string')
         tag = 'ol';
      else{
         tag = tag.toLowerCase();
         if(tag.indexOf('o') >= 0)
            tag = 'ol';
         else if(tag.indexOf('u') >= 0)
            tag = 'ul';
         else
            tag = 'ol';
      }
      if(tree.length > 1){
         tmp = '<p style="font-weight: bold;">' + _describeValue(obj) + '<p/><'+tag+' style="padding: 0 40px;">';
         start = '<li>';
         end = '</li>';
      }else if(tree.length === 1)
         return tree[0][2] + '<br />';
      else if(tree.length < 1)
         return '';
      
      for(var i = 0; i < tree.length; i++)
         tmp += start + '<p style="margin: 0 0 0 '+tree[i][0]*2+'em">'+_formatRow(tree[i])+'</p>' + end;
      if(tree.length > 1)
         tmp += '</'+tag+'>';
      return tmp;
   }
   
   function _popup(tag){
      if(g3.utils.type(tag) !== 'string')
         tag = 'pre';
      else{
         tag = tag.toLowerCase();
         if(tag.indexOf('o') >= 0)
            tag = 'ol';
         else if(tag.indexOf('u') >= 0)
            tag = 'ul';
         else if(tag.indexOf('pre') >= 0)
            tag = 'pre';
         else
            tag = 'pre';
      }
      var w = window.open("about:blank");
      w.document.open();
      w.document.writeln("<HTML><BODY>");
      if(tag === 'pre'){
         w.document.writeln("<PRE>");
         w.document.writeln(this.toString());
         w.document.writeln("</PRE>");
      }else
         w.document.writeln(this.toHtml(tag));
      
      w.document.writeln("</BODY></HTML>");
      w.document.close();
      return this;
   }
   
   _init();
   _traverse(obj, 0);
   
   return {
      /**
       * @summary g3.debug.toString
       * --------------------------
       * @desc
       * Returns a string representation of the structure based on a 0-based index
       * of the form: `index [depth] key -> value`.
       * 
       * Each pair ends with a newline character, i.e. '\n'.
       * @function g3.debug#toString
       * @return {String} A string representation of the structure
       */
      toString: _toString,
      
      /**
       * @summary g3.debug.toHtml
       * ------------------------
       * @desc
       * Returns an html representation of the structure based on a 0-based index
       * of the form: `index [depth] key -> value`.
       * @function g3.debug#toHtml
       * 
       * @return {Object} This object
       */
      toHtml: _toHtml,
      
      /**
       * @summary g3.debug.popup
       * -----------------------
       * @desc
       * Opens a new window and writes an html string with formation that follows 
       * the passed argument.
       * @function g3.debug#popup
       * @param {String} tag One of the strings: `[pre, o, u]` with default 
       * value `pre` that represent formation html tags
       * @return {Object} This object
       */
      popup: _popup
   };
};

// **************************************************
//  STATIC METHODS
// **************************************************
/**
 * @summary g3.debug.setColor
 * --------------------------
 * @desc
 * Sets color values of static property {@link g3.debug.color}.
 * @function g3.debug.setColor
 * @param {Object} arg An object with the form `{level: ..., property: ..., value: ..., reference: ...}`
 * @return {Function} The construction function {@link g3.debug}
 */
g3.debug.setColor = function(arg){
   for(var prop in arg)
      if(g3.utils.type(arg[prop]) === 'string')
         g3.debug.color[prop] = arg[prop];
   return g3.debug;
};
/**
 * @summary g3.debug.setNoFollow
 * -----------------------------
 * @desc
 * It changes static property {@link g3.debug.noFollow} by adding or removing 
 * sub-strings.
 * 
 * To add one or more sub-strings pass an argument with the strings space separated
 * starting with a `+`, like `+prototype +reference`. Similarly to exclude start 
 * with a `-`, like `-reference` or any combination, like `+prototype -reference`.
 * 
 * Acceptable sub-strings:
 * - `prototype`, 
 * 
 * - `reference(s)`, 
 * 
 * - `unknown`, 
 * 
 * - `boolean`, 
 * 
 * - `string`, 
 * 
 * - `undefined`,
 * 
 * - `null`, 
 * 
 * - `nan`,
 * 
 * - `number`, 
 * 
 * - `date`, 
 * 
 * - `object`, 
 * 
 * - `function`, 
 * 
 * - `array`, 
 * 
 * - `regexp`.
 * @function g3.debug.setNoFollow
 * @param {Object} arg An object with the form `{level: ..., property: ..., value: ..., reference: ...}`
 * @return {Function} The construction function {@link g3.debug}
 */
g3.debug.setNoFollow = function(arg){
   if(g3.utils.type(arg) !== 'string')
      return g3.debug;
   var arr = arg.split(/\s/g), i, tmp;
   for(i = 0; i < arr.length; i++)
      if(!arr[i]){
         arr.splice(i, 1);
         i--;
      }
   for(i = 0; i < arr.length; i++){
      tmp = arr[i].slice(1);
      if(arr[i].indexOf('+') > -1){
         if(tmp && (g3.debug.noFollow.indexOf(tmp) === -1))
            g3.debug.noFollow += ' ' + tmp;
      }else if(arr[i].indexOf('-') > -1){
         if(tmp && (g3.debug.noFollow.indexOf(tmp) > -1))
            g3.debug.noFollow = g3.utils.clearString(g3.debug.noFollow, ' ', tmp);
      }else{
         if(i === 0)
            g3.debug.noFollow = arr[i] + ' ';
         else
            g3.debug.noFollow += arr[i] + ' ';
      }
   }
   g3.debug.noFollow = g3.debug.noFollow.replace(/^\s+|\s+$/g, '');
   return g3.debug;
};

// **************************************************
//  STATIC PROPERTIES
// **************************************************
/**
 * @summary g3.debug.color
 * -----------------------
 * @desc
 * An object with members that contain color values for the output of {@link g3.debug#toHtml}.
 * 
 * The values follow the syntax of the css `color` property.
 * The format of this object is: 
 * ```
 * {
 *    level: ..., 
 *    property: ..., 
 *    value: ..., 
 *    reference: ...
 * }
 * ```
 * @var {Object} color
 * @prop {String} level Colorizes the depth of a property
 * @prop {String} property Colorizes the property
 * @prop {String} value Colorizes the value of a property
 * @prop {String} reference Colorizes found cyclic references
 * @memberof g3.debug
 */
g3.debug.color = {
   level: 'brown',
   property: 'blue',
   value: 'blue',
   reference: 'brown'
};
/**
 * @summary g3.debug.noFollow
 * --------------------------
 * @desc
 * A space delimited string of types that we don't want to iterate on.
 * 
 * Defaults to **`string array references prototype`**.
 * @var {String} noFollow
 * @memberof g3.debug
 */
g3.debug.noFollow = 'string array references prototype';
/**
 * @summary g3.debug.id
 * --------------------
 * @desc
 * `Q1uXNSTUV2JX5pge4dzSay8b`
 * @var {String} id
 * @memberof g3.debug
 */
g3.debug.id = 'Q1uXNSTUV2JX5pge4dzSay8b';
/**
 * @summary g3.debug.name
 * ----------------------
 * @desc
 * `g3.debug`
 * @var {String} name
 * @memberof g3.debug
 */
g3.debug.name = 'g3.debug';
/**
 * @summary g3.debug.version
 * -------------------------
 * @desc
 * `0.2`
 * @var {String} version
 * @memberof g3.debug
 */
g3.debug.version = '0.2';
/**
 * @summary g3.debug.author
 * ------------------------
 * @desc
 * [centurianii](https:/github.com/centurianii)
 * @var {String} author
 * @memberof g3.debug
 */
g3.debug.author = 'https:/github.com/centurianii';
/**
 * @summary g3.debug.copyright
 * ---------------------------
 * @desc
 * MIT licence, copyright [centurianii](https:/github.com/centurianii).
 * @var {String} copyright
 * @memberof g3.debug
 */
g3.debug.copyright = 'MIT licence, copyright https:/github.com/centurianii';
}(window.g3 = window.g3 || {}, jQuery, window, document));

(function(g3, $, window, document, undefined){
/**
 * @summary
 * A graphical client testing tool for batch processing javascript commands.
 * It uses eval() and emulates console.log() in all clients even in IE browsers.
 * @constructs g3.evaluator
 * @version 1.1
 * @author https:/github.com/centurianii
 * @copyright MIT licence
 */
g3.evaluator = (function(){
   var evaluator,
       highlightName = 'evaluator_highlight',
       highlightLib = 'prettify',
       highlightPlugins = 'line-numbers',
       loaderName = 'evaluator_loader',
       warning = 'g3.evaluator: Failed to build g3.Highlight object with name: "' + highlightName + '" for library "' + highlightLib + '". You have to load g3.Loader also.';
   
   /*
    * initialization function:
    * contains event handlers and tree manipulation
    */
   function init(){
      /*
       * 'global' variables
       */
      var nodes = {
         $console: $("form#console pre"), /*see evaluator.console*/
         $frameSrc: $("form#loadFrame input[type='text']"), /*see 'load/remove frame button actions'*/
         frameParent: $('#stub').get(0),
         $idNodes: $("form#html #idHtml"),  /*see 'load body html button actions'*/
         $h_name: $('form#header-addRemoveLib #libName'),   /*see 'add/remove header library button actions'*/
         $h_path: $('form#header-addRemoveLib #libPath'),
         $f_name: $('form#footer-addRemoveLib #footer-libName'), /*see 'add/remove footer library button actions'*/
         $f_path: $('form#footer-addRemoveLib #footer-libPath'),
         $title: $('form#blackboard input#title'),       /*see 'blackboard button actions'*/
         $panel: $('form#addRemovePanel #panelTitle'),   /*see 'add/remove panel button actions'*/
         $blackboard: $('#blackboard textarea')          /*see 'load to blackboard behaviour'*/
      };
      
      /*
       * evaluation function
       * execution context: Function code
       * variable object: Activation object
       * ref.: http://perfectionkills.com/understanding-delete/
       */
      function evalExpr(value, win){
         if(win && (win.self === win) && (win.window == win))
            value = 'window = win;' + value;
         var re = /console.log/g;
         value = value.replace(re, 'evaluator.console.log');
         try{
            eval(value);
         }catch(e){
            //alert(e);
            throw e;
         }
      }
      window.onerror = printError;
      function printError(msg, url, line){
         evaluator.console.log(msg+'\nat: '+url+'\nline: '+line);
         return true;
      }
      
      /*
       * set/edit [contenteditable] nodes
       */
      document.title = $("#header h1").text();
      $("[contenteditable] ~ span").click(function(){
         var $that = $(this);
         
         $that.toggleClass('edit');
         if($that.hasClass('edit'))
            $that.prev().prop('contenteditable', 'true');
         else{
            $that.prev().prop('contenteditable', 'false');
            //$('title', document.getElementsByTagName('head')[0]).text($(this).siblings('h1').text());
            if($("#header h1").get(0) == $that.prev().get(0))
               document.title = $("#header h1").text();
         }
      });
      
      /*
       * load/remove frame button actions
       */
      $("form#loadFrame legend").click(function(){
         $("form#loadFrame div").slideToggle();
      });
      $("form#loadFrame button, form#loadFrame input[type='button']").click(function(event){
         if($(this).val() === 'Load file in frame'){
            evaluator.loadFrame(nodes.frameParent, nodes.$frameSrc.val());
            //$('<iframe>').addClass('TbeFgQ7NMLTOVYjdRDjVMaoN frame').prop('src', nodes.$frameSrc.val()).appendTo('#stub');
         }else if($(this).val() === 'Remove frame'){
            evaluator.deleteFrame(nodes.frameParent);
            //$('#stub iframe').remove();
         }else if($(this).val() === 'Clone frame to stub (JQuery)'){
            evaluator.$load(nodes.frameParent, nodes.$frameSrc.val(), {});
         }else if($(this).val() === 'Clone frame to stub-HEAD'){
            //evaluator.cloneFrame(nodes.frameParent, nodes.$frameSrc.val());
            evaluator.cloneFrame(nodes.frameParent);
         }else if($(this).val() === 'Remove cloned'){
            evaluator.removeCloned(nodes.frameParent);
         }
      });
      
      /*
       * load html button actions
       */
      $("form#html legend").click(function(){
         $("form#html div").slideToggle();
      });
      $("form#html button, form#html input[type='button']").click(function(event){
         if($(this).val() === 'Load'){
            var txt = h_txt = b_txt = '',
                ids = nodes.$idNodes.val().replace(/^\s+|\s+$/g, ''),
                $b_nodes, $h_nodes;
            
            $("form#html fieldset > div").css('display', 'none');
            $("form#blackboard textarea").css({width: '100%', height: 'auto'});
            
            // 1. nodes included/excluded
            if(ids == '')
               ids = [];
            else
               ids = ids.split(/\s+|\s*,\s*|\s*;\s*|\s*\|\s*/);
            // 2. nodes to parse
            if(ids.length > 0){
               // 2.1. Include
               if($('#html #whichHtml option:nth-of-type(1)').prop('selected') == true){
                  $h_nodes = $(ids.toString(), document.getElementsByTagName('head')[0]);
                  $b_nodes = $(ids.toString(), document.body);
               // 2.2. Exclude
               }else if($('#html #whichHtml option:nth-of-type(2)').prop('selected') == true){
                  $h_nodes = $(document.getElementsByTagName('head')[0]).contents();
                  $b_nodes = $(document.body).contents();
                  for(var i = 0; i < ids.length; i++){
                     $h_nodes = $h_nodes.not($(ids[i]));
                     $b_nodes = $b_nodes.not($(ids[i]));
                  }
               }
            }
            // 3. node html
            if(ids.length == 0){
               txt = document.getElementsByTagName('head')[0].outerHTML + '\n';
               txt += document.body.outerHTML + '\n';
               txt = '<!doctype html>\n<html>\n' + txt + '</html>';
            }else{
               // 3.1. header html
               $h_nodes.each(function(){
                  if(this.nodeType == 3)
                     h_txt += this.nodeValue;
                  else if(this.nodeType == 8)
                     h_txt += '<!--'+this.nodeValue+'-->';
                  else
                     h_txt += this.outerHTML;
               });
               h_txt = '<head>' + h_txt + '</head>\n';
               // 3.2. body html
               $b_nodes.each(function(){
                  if(this.nodeType == 3)
                     b_txt += this.nodeValue;
                  else if(this.nodeType == 8)
                     b_txt += '<!--'+this.nodeValue+'-->';
                  else
                     b_txt += this.outerHTML;
               });
               b_txt = '<body>' + b_txt + '</body>\n';
               txt = '<!doctype html>\n<html>\n' + h_txt + b_txt + '</html>\n';
            }
            $(event.target).siblings('textarea').val(txt);
         }else if($(this).val() === 'Clear'){
            $(event.target).siblings('textarea').val('');
         }
      });
      
      /*
       * add/remove header library button actions:
       * input's data-id will become the script's id and
       * input's value will become the script's path
       */
      $("form#header-addRemoveLib legend").click(function(){
         $("form#header-addRemoveLib div").slideToggle();
      });
      $("form#header-addRemoveLib button, form#header-addRemoveLib input[type='button']").click(function(event){
         var found, $tmp, id, txt;
         
         if($(this).val() === 'Add'){
            found = false;
            if(nodes.$h_name.val()){
               $('form#header-libraries label').each(function(){
                  if($(this).text() === nodes.$h_name.val()){
                     found = true;
                     return false;
                  }
               });
               if(!found){
                  id = g3.utils.randomString(5);
                  txt = '<li><label class="label" for="' + id + '">' +
                        nodes.$h_name.val() +'</label><input type="checkbox" id="' +
                        id + '" data-id="' + g3.utils.randomString(5) + '" value="' + nodes.$h_path.val() + '" /></li>';
                  $("#header-libraries ol").append(txt);
               }
            }
         }else if($(this).val() === 'Remove'){
            found = -1;
            if(nodes.$h_name.val()){
               $('form#header-libraries li label').each(function(ndx){
                  if($(this).text() === nodes.$h_name.val()){
                     found = ndx;
                     return false;
                  }
               });
               if(found > -1){
                  $tmp = $("form#header-libraries li").eq(found);
                  // remove script
                  id = $tmp.find('input').data('id');
                  $(document.getElementsByTagName('head')[0]).children('[id='+id+']').remove();
                  // remove list
                  $tmp.remove();
               }
            }
         }
      });
      
      /*
       * add/remove footer library button actions:
       * input's data-id will become the script's id and
       * input's value will become the script's path
       */
      $("form#footer-addRemoveLib legend").click(function(){
         $("form#footer-addRemoveLib div").slideToggle();
      });
      $("form#footer-addRemoveLib button, form#footer-addRemoveLib input[type='button']").click(function(event){
         var found, $tmp, id, txt;
         
         if($(this).val() === 'Add'){
            found = false;
            if(nodes.$f_name.val()){
               $('form#footer-libraries label').each(function(){
                  if($(this).text() === nodes.$f_name.val()){
                     found = true;
                     return false;
                  }
               });
               if(!found){
                  id = g3.utils.randomString(5);
                  txt = '<li><label class="label" for="' + id + '">' +
                        nodes.$f_name.val() +'</label><input type="checkbox" id="' +
                        id + '" data-id="' + g3.utils.randomString(5) + '" value="' + nodes.$f_path.val() + '" /></li>';
                  $("#footer-libraries ol").append(txt);
               }
            }
         }else if($(this).val() === 'Remove'){
            found = -1;
            if(nodes.$f_name.val()){
               $('form#footer-libraries li label').each(function(ndx){
                  if($(this).text() === nodes.$f_name.val()){
                     found = ndx;
                     return false;
                  }
               });
               if(found > -1){
                  $tmp = $("form#footer-libraries li").eq(found);
                  // remove script
                  //$(document.getElementById($tmp.find('input').data('id'))).remove();
                  $('#' + $tmp.find('input').data('id')).remove();
                  // remove list
                  $tmp.remove();
               }
            }
         }
      });
      
      /*
       * load all header libraries check box behaviour
       */
      $("#header-loadAll").prop('checked', false);
      $("#header-loadAll").on('change', function(event){
         var delay = 0;
         $('form#header-libraries input[type="checkbox"]').each(function(){
            var $node = $(this);
            setTimeout(function(){$node.trigger('click')}, delay += 300);
         });
      });
      
      /*
       * load all footer libraries check box behaviour
       */
      $("#footer-loadAll").prop('checked', false);
      $("#footer-loadAll").on('change', function(event){
         var delay = 0;
         $('form#footer-libraries input[type="checkbox"]').each(function(){
            var $node = $(this);
            setTimeout(function(){$node.trigger('click')}, delay += 300);
         });
      });
      
      /*
       * Slide on/off header libraries
       */
      $("form#header-libraries legend").click(function(){
         $("form#header-libraries div").slideToggle();
      });
      
      /*
       * header library check box behaviours
       */
      $('#memorize-header').prop('checked', true);
      $("#header-libraries").on('change', 'input', function(event){
         var $that = $(this), $first, $last, x, y, tmp, 
             $checked = $("#header-libraries input:checked"), 
             length,
             $script = $(document.getElementsByTagName('head')[0]).children('[id='+$that.data('id')+']'),
             frozen = $('#memorize-header').prop('checked');
         
         if($that.is('#memorize-header'))
            return;
         
         if(frozen)
            length = $checked.length - 1; // do NOT include frozen checkbox!
         else
            length = $checked.length;
         
         // 1. No link tag exists but 'input' is checked
         if($script.length === 0 && $that.prop("checked")){
            // 1.1. set attribute
            //$that.attr('checked', true);
            // 1.2. remove duplicates coming from iframe
            y = $that.val();
            tmp = y.indexOf('/' + document.location.hostname + '/');
            if(tmp >= 0)
               y = y.slice(tmp + document.location.hostname.length + 1);
            $(document.getElementsByTagName('head')[0]).children('link').filter(function(ndx){
               x = $(this).prop('href');
               tmp = x.indexOf('/' + document.location.hostname + '/');
               if(tmp >= 0)
                  x = x.slice(tmp + document.location.hostname.length + 1);
               if(x == y)
                  return true;
               else
                  return false;
            }).remove();
            // 1.3. insert a new link tag
            // 1.3.1. after all existed links having property 'id'
            if(length > 1){
               $last = $(document.getElementsByTagName('head')[0]).children('[id]').filter(
                  function(ndx){
                     if($(this).prop('id').length)
                        return true;
                     else
                        return false;
                  }
               ).last();
               if($last.length)
                  $('<link></link>').attr({'rel': 'stylesheet', 'media': 'screen', 'id': $that.data('id'), 'type': 'text/css', 'href': $that.val()}).insertAfter($last);
               else
                  $('<link></link>').attr({'rel': 'stylesheet', 'media': 'screen', 'id': $that.data('id'), 'type': 'text/css', 'href': $that.val()}).append(document.getElementsByTagName('head')[0]);
            // 1.3.2. insert the first link before all existed links
            }else{
               $first = $(document.getElementsByTagName('head')[0]).children('link, style').first();
               $('<link></link>').attr({'rel': 'stylesheet', 'media': 'screen', 'id': $that.data('id'), 'type': 'text/css', 'href': $that.val()}).insertBefore($first);
            }
            // 1.4. re-arrange list of libraries
            if(!frozen){
               // 1.4.1. move first 'li' tag of 'input' above all 'li's
               if(($checked.length == 1) && ($("#header-libraries li").length > 1))
                  $that.closest('li').insertBefore($("#header-libraries li").first());
               // 1.4.2. move 'li' tag of 'input' just under previous checked 'li's
               else if($checked.length > 1)
                  $that.closest('li').insertAfter($checked.eq($checked.length - 2).closest('li'));
            }
         }
         
         // 2. Link tag exists but 'input' is unchecked
         if($script.length > 0 && !$that.prop("checked")){
            // 2.1. remove attribute
            //$that.attr('checked', false);
            // 2.2. remove relative script
            $script.remove();
            // 2.3. move 'li' tag of 'input' just under last checked
            if(!frozen && (length > 0))
               $that.closest('li').insertAfter($checked.last().closest('li'));
         }
      });
      
      /*
       * trigger header library check box events on load & remove existed header scripts
       */ 
      $("#header-libraries input").each(function(){
         var $that = $(this);
         
         if($that.is('#memorize-footer'))
            return;
         
         // 1. load library
         if($that.prop("checked"))
            $that.trigger('change');
         
         // 2. remove library if loaded
         else{
            $(document.getElementsByTagName('head')[0]).children('[id='+$that.data('id')+']').remove();
         }
      });
      
      /*
       * Slide on/off footer libraries
       */
      $("form#footer-libraries legend").click(function(){
         $("form#footer-libraries div").slideToggle();
      });
      
      /*
       * footer library check box behaviours
       */
      $('#memorize-footer').prop('checked', true);
      $("#footer-libraries").on('change', 'input', function(event){
         var $that = $(this), $last, x, y, tmp, 
             $checked = $("#footer-libraries input:checked"),
             length,
             $script = $(document.getElementById($(this).data('id'))),
             frozen = $('#memorize-footer').prop('checked');
         
         if($that.is('#memorize-footer'))
            return;
         
         if(frozen)
            length = $checked.length - 1; // do NOT include frozen checkbox!
         else
            length = $checked.length;
         
         // 1. No script tag exists but 'input' is checked
         if(($script.length === 0) && $that.prop("checked")){
            // 1.1. set attribute
            //$that.attr('checked', true);
            // 1.2. remove duplicates coming from iframe
            y = $that.val();
            tmp = y.indexOf('/' + document.location.hostname + '/');
            if(tmp >= 0)
               y = y.slice(tmp + document.location.hostname.length + 1);
            $(document.getElementsByTagName('body')[0]).children('script').filter(function(ndx){
               x = $(this).prop('src');
               tmp = x.indexOf('/' + document.location.hostname + '/');
               if(tmp >= 0)
                  x = x.slice(tmp + document.location.hostname.length + 1);
               if(x == y)
                  return true;
               else
                  return false;
            }).remove();
            // 1.3. insert a new script tag
            tmp = $('<script></script>').attr({'id': $that.data('id'), 'type': 'text/javascript', 'src': $that.val()}).appendTo('body');
            tmp[0].setAttribute("async", "");
             // 1.4. re-arrange list of libraries
            if(!frozen){
               // 1.4.1. move first 'li' tag of 'input' above all 'li's
               if(($checked.length == 1) && ($("#footer-libraries li").length > 1))
                  $that.closest('li').insertBefore($("#footer-libraries li").first());
               // 1.4.2. move 'li' tag of 'input' just under previous checked 'li's
               else if($checked.length > 1)
                  $that.closest('li').insertAfter($checked.eq($checked.length - 2).closest('li'));
            }
         }
         
         // 2. Script tag exists but 'input' is unchecked
         if($script.length && !$that.prop("checked")){
            // 2.1. remove attribute
            //$that.attr('checked', false);
            // 2.2. remove relative script
            $script.remove();
            // 2.3. move 'li' tag of 'input' just under last checked
            if(!frozen && (length > 0))
               $that.closest('li').insertAfter($checked.last().closest('li'));
         }
      });
      
      /*
       * trigger footer library check box events on load & remove existed body scripts
       */ 
      $("#footer-libraries input").each(function(){
         var $that = $(this);
         
         if($that.is('#memorize-footer'))
            return;
         
         // 1. load library
         if($that.prop("checked"))
            $that.trigger('change');
         
         // 2. remove library if loaded
         else{
            $('#' + $that.data('id')).remove();
         }
      });   
      
      /*
       * private variables for active panel, tab title and data
       */
      var panelState = {
         $tabbedData: null,   /*the active panel*/
         $title: null,        /*the active tab title*/
         $data: null          /*the data of the active tab title*/
      };
      
      /*
       * state of common buttons 'save' and 'save as': 0-disabled, 1-enabled
       * and a handler 'apply()' that accepts a 'state' object as argument
       */
      var buttonState = {
         buttons: {
            save: null,
            saveAs: null
         },
         state: {
            save: 0,
            saveAs: 0
         },
         //apply/remove 'disabled' property on buttons
         apply: function(obj){
            if(obj){
               this.state.save = obj.save;
               this.state.saveAs = obj.saveAs;
            }
            if(this.state.save === 0)
               $(this.buttons.save).prop('disabled', 'disabled');
            else
               $(this.buttons.save).removeAttr('disabled');
            if(this.state.saveAs === 0)
               $(this.buttons.saveAs).prop('disabled', 'disabled');
            else
               $(this.buttons.saveAs).removeAttr('disabled');
            return this;
         },
         //create object references to actual buttons
         init: function(){
            var self = this;
            $("form#blackboard button, form#blackboard input[type='button']").each(function(){
               if($(this).val() === 'Save')
                  self.buttons.save = this;
               if($(this).val() === 'Save to a new tab')
                  self.buttons.saveAs = this;
            });
            return this;
         }
      };
      
      /*
       * equal board height check box behaviour
       */
      $("#boardHeights").prop('checked', false);
      $("#boardHeights").on('change', function(event){
         if($(this).prop('checked'))
            $('#boardWrapper > *').each(function(){
               $(this).addClass('height');            
            });
         else
            $('#boardWrapper > *').each(function(){
               $(this).removeClass('height');
            });
      }).change();
      
      /*
       * single column board width check box behaviour
       */
      $("#boardWidthSingle").prop('checked', false);
      $("#boardWidthSingle").on('change', function(event){
         if($(this).prop('checked'))
            $('#boardWrapper > *').each(function(){
               $(this).addClass('width');            
            });
         else
            $('#boardWrapper > *').each(function(){
               $(this).removeClass('width');
            });
      }).change();
      
      /*
       * disable panels & buttons initially
       */
      if(!panelState.$tabbedData){
         $('#tabbedDataWrapper .tabbedData .titleBar .title, #tabbedDataWrapper .tabbedData .tabBar .title').removeClass('enabled');
         buttonState.init().apply();
      }
      
      
      /*
       * auto-expand blackboard textarea
       */
      function debouncedTextarea(e){
        //this.scrollHeight - this.scrollTop === this.clientHeight
        e.target.style.height = e.target.scrollHeight + 'px';
      }
      $("form#blackboard textarea").on('input', 
         g3.debounce(function(e){
            debouncedTextarea(e);
            }, 
            {delay: 100, fireLast: true}
         )
      );
      
      /*
       * blackboard button actions
       */
      $("form#blackboard button, form#blackboard input[type='button']").click(function(event){
         var lang = $('#lang option:selected').val(),
             pre;
         
         if($(this).val() === 'Execute!'){
            evaluator.console.pile = false;
            evalExpr($(event.target).siblings('textarea').val());
         }else if(panelState.$data && $(this).val() === 'Save'){
            if(!nodes.$title.val() || (nodes.$title.val() !== panelState.$title.text())){
               nodes.$title.after('<span id = "message"><span style="color: red; padding: 0 2px;">Error on title!</span><span id="suggestedTitle" style="cursor: pointer"> Suggested: \''+panelState.$title.text()+'\' (click to load)</span></span>');
            }else{
               pre = panelState.$data.find('pre').
                     attr('data-lang', lang).
                     text(g3.utils.printHTML($(event.target).siblings('textarea').val()));
               try{
                  pre.g3('Highlight', highlightName).init({language: lang});
               }catch(e){
                  g3.utils.warning(warning);
               }
            }
         }else if(panelState.$tabbedData && ($(this).val() === 'Save to a new tab')){
            //find tab info at closest parent
            var titles = [], $tabs, length = 1;
            if(panelState.$title)
               $tabs =  panelState.$title.closest('.tabs');
            else
               $tabs = $('.tabs', panelState.$tabbedData).eq(0);
            $tabs.find('.title').each(function(){
               titles.push($(this).text());
            });
            length += $('.title', $tabs).length;
            if(!nodes.$title.val() || ($.inArray(nodes.$title.val(), titles) >= 0)){
               if(nodes.$title.next('#message').length == 0)
                  nodes.$title.after('<span id = "message"><span style="color: red; padding: 0 2px;">Error on title!</span><span id="suggestedTitle" style="cursor: pointer"> Suggested: \'Tab '+length+'\' (click to load)</span></span>');
            }else{
               $tabs.append('<div class="tabBar"><div class="title">' + g3.utils.printHTML(nodes.$title.val()) + '</div><div class="close">X</div></div>');
               var $newData;
               if(panelState.$data)
                  $newData = $('<div class="data"><pre data-lang="' + lang + '"></pre></div>').appendTo(panelState.$data.closest('.tabs'));
               else
                  $newData = $('<div class="data"><pre data-lang="' + lang + '"></pre></div>').appendTo($('.tabs', panelState.$tabbedData).eq(1));
               pre = $('pre', $newData);
               pre.html(g3.utils.printHTML($(event.target).siblings('textarea').val()));
               try{
                  pre.g3('Highlight', highlightName).init({language: lang});
               }catch(e){
                  g3.utils.warning(warning);
               }
               if(panelState.$title)
                  pre.closest('.data').addClass('hide');
            }
         }else if($(this).val() === 'Clear'){
            $(event.target).siblings('textarea').val('').end().siblings('[id=title]').val('');
         }
      });
      
      /*
       * language select boxes
       */
      var languages = [];
      $('#lang, #lang-global').html('<option value="unformatted" selected="">unformatted</option>').on('click', function(){
         var tmp = '', sel, i;
         
         if(languages.length)
            return false;
         
         try{
            languages = g3.Highlight.getLanguages(highlightLib);
            languages.sort();
         }catch(e){
            tmp = '<option value="unformatted" selected>unformatted</option>';
            g3.utils.warning(warning);
         }
         for(i = 0; i < languages.length; i++){
            if(languages[i] == 'unformatted')
               sel = 'selected';
            else
               sel = '';
            tmp += '<option value="' + languages[i] + '" ' + sel + '>' + languages[i] + '</option>';
         }
         $('#lang, #lang-global').html(tmp);
      });
      
      
      /*
       * console button actions
       */
       $("form#console button, form#console input[type='button']").click(function(event){
         if($(this).val() === 'Clear'){
            nodes.$console.html('');
         }
      });
      
      /*
       * add/remove panel button actions:
       * label's text will become the script's id and
       * input's value will become the script's path
       */
      $("form#addRemovePanel legend").click(function(){
         $("form#addRemovePanel div").slideToggle();
      });
      $("form#addRemovePanel button, form#addRemovePanel input[type='button']").click(function(event){
         if($(this).val() === 'Add'){
            var found = false;
            if(nodes.$panel.val()){
               $('#tabbedDataWrapper .tabbedData .titleBar .title').each(function(){
                  if($(this).text() === nodes.$panel.val()){
                     found = true;
                     return false;
                  }
               });
               if(!found){
                  var txt = '<div class="gridTabbedData"><div class="tabbedData"><div class="titleBar"><div class="wrap"><p class="title">' +
                  nodes.$panel.val() + '</p><button class="load">Load tab</button></div></div><div class="tabs"></div><div class="tabs"></div></div></div>';
                  $('#tabbedDataWrapper').append(txt);
               }
            }
         }else if($(this).val() === 'Remove'){
            var found = -1;
            if(nodes.$panel.val()){
               $('#tabbedDataWrapper .tabbedData .titleBar .title').each(function(ndx){
                  if($(this).text() === nodes.$panel.val()){
                     $(this).closest('.tabbedData').closest('.gridTabbedData').remove();
                     return false;
                  }
               });
            }
         }
      });
      
      /*
       * next to title error message behaviour
       */
      $('form#blackboard').on('click', 'span#suggestedTitle', function(){
            var tmp = $(this).text().match(/'(.*)'/);
            $('form#blackboard input#title').val(tmp[1]);
            $('form#blackboard #message').remove();
      });
      
      /*
       * equal panel height check box behaviour
       */
      $("#panelHeights").prop('checked', false);
      $("#panelHeights").on('change', function(event){
         if($(this).prop('checked'))
            $('.tabbedData').each(function(){
               $(this).addClass('height');            
            });
         else
            $('.tabbedData').each(function(){
               $(this).removeClass('height');            
            });
      }).change();
      
      /*
       * single column panel width check box behaviour
       */
      $("#panelWidthSingle").prop('checked', false);
      $("#panelWidthSingle").on('change', function(event){
         if($(this).prop('checked'))
            $('.gridTabbedData').each(function(){
               $(this).addClass('width');            
            });
         else
            $('.gridTabbedData').each(function(){
               $(this).removeClass('width');            
            });
      }).change();
      
      /*
       * un-highlight button behaviour
       */
      $("#b3N3K").on('click', function(event){
         try{
            $('.tabbedData .data pre').g3('Highlight', highlightName).init({language: 'unformatted'});
         }catch(e){
            g3.utils.warning(warning);
         }
         return false;
      });
      
      /*
       * highlight button behaviour
       */
      $("#R7pQK").on('click', function(event){
         try{
            $('.tabbedData .data pre').g3('Highlight', highlightName).init({language: $('#lang-global option:selected').val()});
         }catch(e){
            g3.utils.warning(warning);
         }
         return false;
      });
      
      /*
       * panel title behaviour: '.tabbedData .titleBar .title'
       * delegator on '.tabbedDataWrapper'
       * defines private 'panelState.$tabbedData' variable
       */
      $('#tabbedDataWrapper').on('click', '.tabbedData .titleBar .title', function(event){
         var $newTabbedData;
         //repeated clicks on panel title
         if(panelState.$tabbedData && (panelState.$tabbedData.find('.titleBar .title').is($(this))))
            return false;
         //enable 'save as' button
         buttonState.apply({saveAs: 1});
         $newTabbedData = $(this).closest('.tabbedData');
         //disable 'save' button and all panel titles on first click
         if(!panelState.$tabbedData){
            buttonState.apply({save: 0});
            $('.tabbedData .titleBar .title').removeClass('enabled'); //this panel's title is set lower
         //disable previous 'save' button, panel title and tab title when a new panel is activated
         }else if(!$newTabbedData.is(panelState.$tabbedData)){
            buttonState.apply({save: 0});
            panelState.$tabbedData.find('.titleBar .title').removeClass('enabled');
            //panelState.$tabbedData.find('.titleBar .title').addClass('visited');
            //if a tab title fired this event (see tab title behaviours), let 
            //private 'panelState.$title' and 'panelState.$data' to be handled by 
            //that handler else, nullify them here
            if(panelState.$title && !event.tabbedData){
               panelState.$title.removeClass('enabled');
               panelState.$title.addClass('visited');
               panelState.$title = null;
               panelState.$data = null;
            }
         }
         //enable panel's title
         $(this).addClass('enabled');
         //define new private 'panelState.$tabbedData'
         panelState.$tabbedData = $newTabbedData;
      });
      
      /*
       * load to blackboard behaviour: '.tabbedData .titleBar .load'
       * delegator on '.tabbedDataWrapper'
       */
      $('#tabbedDataWrapper').on('click', '.tabbedData .titleBar .load', function(){
         if(panelState.$tabbedData){
            var tmp = '', pre, lang;
            panelState.$tabbedData.find('.tabs .data').each(function(){
               if(!$(this).hasClass('hide')){
                  $("form#blackboard textarea").css({width: '100%', height: 'auto'});
                  pre = $(this).find('pre');
                  tmp = g3.utils.revertPrintHTML(pre.text());
                  lang = pre.attr('data-lang');
                  try{
                     tmp = g3.utils.revertPrintHTML(g3.Highlight.get(highlightName).getText(pre));
                  }catch(e){
                     g3.utils.warning(warning);
                  }
               }
            });
            nodes.$blackboard.val(tmp);
            if(panelState.$title)
               $('input#title').val(g3.utils.revertPrintHTML(panelState.$title.text()));
         }
      });
      
      /*
       * tab title behaviours: '.tabbedData .tabs .tabBar .title'
       * delegator on '.tabbedDataWrapper'
       * defines private 'panelState.$tabbedData', 'panelState.$title' and 'panelState.$data' variables
       */
      $('#tabbedDataWrapper').on('click', '.tabbedData .tabs .tabBar .title', function(event){
         var $newTab = $(this);
         //toggle tab title and data on repeated clicks, also, if no tab is enabled 
         //then, nullify variables 'panelState.$title' and 'panelState.$data' and disable 'save' button
         if(panelState.$title && panelState.$title.is($newTab)){
            panelState.$title.toggleClass('enabled');
            if(panelState.$title.hasClass('enabled')){
               $('.data', panelState.$title.closest('.tabbedData')).each(function(){
                  if(panelState.$data.is($(this)))
                     panelState.$data.removeClass('hide');
                  else
                     $(this).addClass('hide');
               });
            }else{
               $('.data', panelState.$title.closest('.tabbedData')).each(function(){
                  $(this).removeClass('hide');
               });
               buttonState.apply({save: 0});
               panelState.$title = null;
               panelState.$data = null;
            }
            return false;
         }
         //when jumping to another panel, add visited to previous tab title if exists
         if(panelState.$tabbedData && panelState.$title && !panelState.$tabbedData.is($newTab.closest('.tabbedData')))
            panelState.$title.addClass('visited');
         //remove all visited tab titles of this panel
         $newTab.closest('.tabs').find('.title').removeClass('visited');
         //disable previous tab title
         if(panelState.$title)
            panelState.$title.removeClass('enabled');
         //trigger present panel title behaviour that defines new private 'panelState.$tabbedData'
         // $(this) === $(event.target);
         $newTab.closest('.tabbedData').find('.titleBar .title').trigger({
            type: 'click',
            tabbedData: 'custom'
         });
         //define new private 'panelState.$title'
         panelState.$title = $newTab;
         panelState.$title.addClass('enabled');
         //enable buttons
         buttonState.apply({save: 1, saveAs: 1});
         //find tab index in closest parent
         var $tabs = $newTab.closest('.tabs');
         var tab;
         $('.title', $tabs).each(function(ndx){
            if(this === event.target){
               tab = ndx;
               return false;
            }
         });
         //show relevant content at that index
         $('.data', panelState.$tabbedData).each(function(ndx){
            if(ndx === tab){
               //define new private 'panelState.$data'
               panelState.$data = $(this);
               panelState.$data.removeClass('hide');
            }else
               $(this).addClass('hide');
         });
      });
      
      /*
       * tab close behaviours: '.tabbedData .tabs .tabBar .close'
       * delegators on '.tabs' (do not alter private 'panelState.$tabbedData' variable)
       */
      $('#tabbedDataWrapper').on('click', '.tabbedData .tabs .tabBar .close', function(event){
         //nullify sibling panelState.$title and connected panelState.$data
         if($(this).siblings('.title').is(panelState.$title)){
            buttonState.apply({save: 0});
            panelState.$title = null;
            panelState.$data = null;
         }
         //find tab index in closest parent
         var $tabs = $(this).closest('.tabs');
         var tab;
         $('.close', $tabs).each(function(ndx){
            if(this === event.target){
               tab = ndx;
               return false;
            }
         });
         //remove relevant data at that index
         $('.data', $tabs.closest('.tabbedData')).each(function(ndx){
            if(ndx === tab){
               $(this).remove();
               return false;
            }
         });
         //remove tab bar
         $(this).closest('.tabBar').remove();
      });
      
      var loadOnce = false;
      var clonedOnce = false;
      var cloned = [];
      
      function clone(){
         var framewin = $(nodes.frameParent).children('iframe').get(0).contentWindow,
             head = document.getElementsByTagName('head')[0],
             frameHead = framewin.document.getElementsByTagName('head')[0],
             node;
         //copy all frame's body child nodes except scripts because aren't simple nodes:
         //all browsers fail when scripts from frame's body are added to a node!
         //$(framewin.document.body).contents().appendTo(nodes.frameParent);
         $(framewin.document.body).contents().filter(function(){
            if(this.nodeName && this.nodeName.toLowerCase() === 'script')
               return false;
            else
               return true;
         }).appendTo(nodes.frameParent);
         //now, copy scripts
         $(framewin.document.body).children().filter(function(){
            if(this.nodeName && this.nodeName.toLowerCase() === 'script')
               return true;
            else
               return false;
         }).each(function(){
            /* deprecated
            var args = {'text': $(this).html(), 'tag': nodes.frameParent, 'src': this.src, 'type': this.type, 'id': this.id};
            cloned.push(g3.utils.createScriptNode(args));
            */
            //attention: error in FF if an empty src is set!
            var tmp = (this.src)? $('<script>' + $(this).html() + '</script>').attr({'src': this.src, 'type': this.type, 'id': this.id}).appendTo(nodes.frameParent).get(0) : $('<script>' + $(this).html() + '</script>').attr({'type': this.type, 'id': this.id}).appendTo(nodes.frameParent).get(0);
            cloned.push(tmp);
         });
         //copy frame's head
         $(frameHead).children().each(function(){
            //copy styles
            if(this.nodeName.toLowerCase() === 'style'){
               /* deprecated
               var args = {'cssText': $(this).html(), 'tag': 'head', 'media': this.media, 'type': this.type, 'id': this.id};
               cloned.push(g3.utils.createStyleNode(args));
               */
               cloned.push($('<style>' + $(this).html() + '</style>').attr({'media': this.media, 'id': this.id, 'type': this.type}).appendTo(document.getElementsByTagName('head')[0]).get(0));
            }
            //copy links
            if(this.nodeName.toLowerCase() === 'link'){
               /* deprecated 
               var args = {'tag': 'head', 'media': this.media, 'type': this.type, 'id': this.id, 'rel': this.rel, 'href': this.href};
               cloned.push(g3.utils.createLinkNode(args));
               */
               cloned.push($('<link>').appendTo(document.getElementsByTagName('head')[0]).attr({'media': this.media, 'id': this.id, 'type': this.type, 'rel': this.rel}).attr('href', this.href).get(0));
            }
            //copy scripts: IE8 error when this.text() is used!
            if(this.nodeName.toLowerCase() === 'script'){
               /* deprecated
               var args = {'text': $(this).html(), 'tag': 'head', 'src': this.src, 'type': this.type, 'id': this.id};
               cloned.push(g3.utils.createScriptNode(args));
               */
               var tmp = (this.src)? $('<script>' + $(this).html() + '</script>').attr({'src': this.src, 'type': this.type, 'id': this.id}).appendTo(document.getElementsByTagName('head')[0]).get(0) : $('<script>' + $(this).html() + '</script>').attr({'type': this.type, 'id': this.id}).appendTo(document.getElementsByTagName('head')[0]).get(0);
               cloned.push(tmp);
            }
         });
         evaluator.deleteFrame(nodes.frameParent);
         $('#stub').removeClass('hide');
      }
      
      evaluator = {
         /**
          * @summary
          * A in browser `console` object of functions located at `g3.evaluator`.
          * @var {object} g3.evaluator#console
          */
         console: {
            /**
             * 
             */
            pile: false, //pile writing
            
            /**
             * @summary
             * A in browser `console.log` function.
             * @desc
             * User's batch commands that contain the string `console.log(value, n, nofollow)`
             * are sent to this function that:
             * - a) calls native 'console.log(value)' and immediately after 
             * 
             * - b) calls {@link g3.debug} with the above arguments and sends 
             *      result to page's console area.
             * @function log
             * @memberof g3.evaluator#console
             * @param {*} value An identifier of any type that we want to be analysed
             * @param {number} n The maximum depth to look for when the identifier
             *    is serached; zero-based
             * @param {boolean} nofollow see {@link g3.debug} for a discussion
             * @return {Object} The console object {@link g3.evaluator#console}
             */
            log: function(value, n, nofollow){
               //IE8 returns form with id="console"!
               if(console && console.log)
                  console.log(value);
               if(!this.pile)
                  nodes.$console.html('');
               this.pile = true;
               nodes.$console.html(nodes.$console.html() + g3.debug(value, n, nofollow).toHtml());
               return this;
            }
         },
         
         // deprecated: no actual button exists
         $load: function(selector, url, data, complete){
            $(selector).load(url, data, complete).removeClass('hide');
            return this;
         },
         
         /**
          * @summary
          * Create an `iframe` and add it at the passed node or selector.
          * @desc
          * You can't re-load before removing the existed one with {@link g3.evaluator#deleteFrame}.
          * @function loadFrame
          * @memberof g3.evaluator
          * @param {string|object} selector A selector string or another JQuery 
          *    object or a node reference that will hold the `iframe`
          * @param {string} url The loaded file's url
          * @return {object} The evaluator object
          */
         loadFrame: function(selector, url){
            var node = $(selector).get(0);
            if(!node){
               alert('Error in evaluator.loadFrame() failed to find a node for passed selector: ' + selector);
               return this;
            }
            if(clonedOnce){
               alert('Attention: delete cloned in stub-HEAD before re-loading!');
               return this;
            }
            if(loadOnce){
               alert('Attention: clone in stub-HEAD or remove frame before re-loading!');
               return this;
            }
            $('<iframe>').addClass('TbeFgQ7NMLTOVYjdRDjVMaoN frame').prop('src', url).appendTo(node);
            $(node).removeClass('hide');
            loadOnce = true;
            return this;
         },
         
         /**
          * @summary
          * Deletes an `iframe` contained in the passed node or selector.
          * @function deleteFrame
          * @memberof g3.evaluator
          * @param {string|object} selector A selector string or another JQuery 
          *    object or a node reference that contains the `iframe`
          * @return {object} The evaluator object
          */
         deleteFrame: function(selector){
            var $n = $(selector);
            if(!$n.length){
               alert('Error in evaluator.deleteFrame() failed to find a node for passed selector: ' + selector);
               return this;
            }
            if(!loadOnce){
               alert('Attention: load a frame before removing!');
               return this;
            }
            $n.children('iframe').remove();
            loadOnce = false;
            return this;
         },
         
         /**
          * @summary
          * Deletes all the cloned nodes of `iframe` at the evaluator's page.
          * @desc
          * The deleted cloned nodes also include those at the header.
          * @function removeCloned
          * @memberof g3.evaluator
          * @param {string|object} selector A selector string or another JQuery 
          *    object or a node reference that contains the `iframe`
          * @return {object} The evaluator object
          */
         removeCloned: function(selector){
            var $n = $(selector).get(0);
            if(!$n.length){
               alert('Error in evaluator.removeCloned() failed to find a node for passed selector: ' + selector);
               return this;
            }
            if(!clonedOnce){
               alert('Attention: clone frame in stub-HEAD before removing!');
               return this;
            }
            for(var i = 0; i < cloned.length; i++)
               $(cloned[i]).remove();
            cloned = [];
            $n.contents().filter(function(){
               if(this.nodeName && this.nodeName.toLowerCase() === 'iframe')
                  return false;
               else
                  return true;
            }).remove();
            clonedOnce = false;
            return this;
         },
         
         /**
          * @summary
          * Copies all the nodes of an `iframe` to the evaluator's page.
          * @desc
          * The cloned nodes also include those at the header. The `iframe` at 
          * the end is deleted.
          * 
          * You can't re-clone before removing the existed ones with {@link g3.evaluator#removeCloned}.
          * @function cloneFrame
          * @memberof g3.evaluator
          * @param {string|object} selector A selector string or another JQuery 
          *    object or a node reference that contains the `iframe`
          * @return {object} The evaluator object
          */
         cloneFrame: function(selector){
            if(clonedOnce){
               alert('Attention: delete cloned in stub-HEAD before re-cloning!');
               return this;
            }
            var $n = $(selector);
            if(!$n.length){
               alert('Error in evaluator.cloneFrame() failed to find a node for passed selector: ' + selector);
               return this;
            }
            if(!loadOnce){
               alert('Attention: load a frame before cloning!');
               return this;
            }
            //Attention: nodes.frameParent instead of node is used by clone() method
            nodes.frameParent = $n.get(0);
            clone();
            loadOnce = false;
            clonedOnce = true;
            return this;
         },
         
         /**
          * @summary
          * Returns the name of the {@link g3.Highlight} object used from the 
          * evaluator.
          * @function highlight
          * @memberof g3.evaluator
          * @return {string} The name of a {@link g3.Highlight} object
          */
         highlight: function(){
            return highlightName;
         },
         
         /**
          * @summary
          * Returns the name of the library used by {@link g3.Highlight} object 
          * of the evaluator.
          * @function highlightLibrary
          * @memberof g3.evaluator
          * @return {string} The name of a {@link g3.Highlight} object
          */
         highlightLibrary: function(){
            return highlightLib;
         },
         
         /**
          * @summary
          * Returns the name of the {@link g3.Loader} object used from 
          * {@link g3.Highlight} of the evaluator.
          * @function loader
          * @memberof g3.evaluator
          * @return {string} The name of a {@link g3.Loader} object
          */
         loader: function(){
            return loaderName;
         },
         
         /**
          * @var {String} g3.evaluator#id
          */
         id: 'TbeFgQ7NMLTOVYjdRDjVMaoN',
         
         /**
          * @var {String} g3.evaluator#name
          */
         name: 'g3.evaluator',
         
         /**
          * @var {String} g3.evaluator#version
          */
         version: '1.2',
         
         /**
          * @summary
          * [centurianii](https:/github.com/centurianii)
          * @var {string} g3.evaluator#author
          */
         author: 'https:/github.com/centurianii',
         
         /**
          * @var {String} g3.evaluator#copyright
          */
         copyright: 'MIT, https:/github.com/centurianii'
      };
      return evaluator;
   }
   return {
      /**
       * @summary
       * Returns a singleton.
       * @desc
       * It initializes the evaluator objects by settings properties and assigning
       * events on nodes.
       * 
       * This method after it's first run, it returns the same object on next 
       * calls.
       * @function g3.evaluator#getInstance
       * @return {object} The evaluator object
       */
      getInstance: function(){
         try{
            if(typeof(g3.Highlight.get(highlightName)) == 'function')
               g3.Highlight({name: highlightName, library: highlightLib, loader: loaderName, plugins: highlightPlugins});
         }catch(e){
            g3.utils.warning(warning);
         }
         if(evaluator)
            return evaluator;
         else
            return init();
      }
   };
})();
}(window.g3 = window.g3 || {}, jQuery, window, document));

(function(g3, $, window, document, undefined){
   /**
    * @summary
    * A factory of class constructors that use js prototypal inheritance.
    * @desc
    * The constructor that this factory returns is an anonymous function that 
    * encapsulates the one that might have been given in the factory's 
    * arguments (last one) and succeeds even when the user did not provide a 
    * constructor even in a scenario of a long inheritance chain!
    * 
    * Objects are built with or without new operator.
    * 
    * When inheritance exists, the constructor calls implicitly the parent passing
    * all it's arguments there (if they exists).
    * 
    * We can even build inheritance on an object as a base "class"!
    * 
    * All IE versions that don't support `__proto__` property fail to populate 
    * object's prototype members to a function that will act as a class constructor.
    * 
    * Object properties `STATIC`, `constructor` and `prototype` in factory's 
    * arguments are handled in special manner (see rule 5) also, `Super` is 
    * (re-)defined in construction function when inheritance exists.
    *
    * Characteristics:
    * ----------------
    * 
    * 1) unlimited depth inheritance, 
    * 
    * 2) static members, 
    * 
    * 3) function or object mixins,
    * 
    * 4) parent/class definition/mixins are passed as first/last/intermediate 
    *    factory's arguments and they are defined as objects/functions inline or 
    *    external,
    * 
    * 5) when parent or class definition are defined as objects, respective 
    *    anonymous functions are constructed in place of constructors that follow 
    *    a rule that all members under property **`prototype`** become prototypal 
    *    members, all members under property **`STATIC`** become static members 
    *    whereas all the rest members become instance ones; the members are moved 
    *    by copy except the prototypal ones which are truly references of the 
    *    originals,
    * 
    * 6) when a mixin is defined as object, it follows rule (5) and only unique 
    *    static and prototype members are assigned to class's construction function 
    *    (unique means it doesn't overwrite),
    * 
    * 7) when a mixin is defined as function, similar to (5) it is handled as a 
    *    class construction function where only unique static and prototype members 
    *    are assigned to class's construction function (unique means it doesn't 
    *    overwrite),
    * 
    * 8) a class inherits from a parent only prototypal functions and parent's 
    *    instance properties as expected (they might be overwritten by the 
    *    constructor) which are defined by rule (5) in case of object-parent 
    *    (static members are not transfered),
    * 
    * 9) any construction function can use the special property **`Super`** to access 
    *    it's parent constructor or prototype methods with the help of 
    *    `.call(this, arg1, arg2, ...)` or `.apply(this, arguments)`,
    * 
    * 10) objects are created with or without the **`new`** operator,
    * 
    * 11) when a class constructor is called and a parent exists, that parent is 
    *     called first implicitly with the arguments of the constructor,
    * 
    * 12) when a class constructor is called the initial construction function 
    *     at class definition in factory's arguments is called last implicitly 
    *     with the arguments of the constructor.
    *
    * If the first/last argument is a function
    * ----------------------------------------
    * it complies with the following:
    * 
    * - instance properties are declared with **`this`**,
    * 
    * - static properties are assigned as function members and
    * 
    * - prototype functions are assigned to **`prototype`** property.
    *
    * If the first/last argument is an object
    * ---------------------------------------
    * it complies with the following:
    * 
    * - member `constructor` will become the new parent/class construction 
    *   function, everything defined inside the constructor with **`this`** will 
    *   become a public member, everything defined with **`var`** or 
    *   **`function`** will become a private member, these internal functions 
    *   are privileged methods,
    * 
    * - all members under property **`prototype`** of this object will become 
    *   prototypal methods,
    * 
    * - all members under property **`STATIC`** will become static members and,
    *  
    * - all the rest members of this object will become instance properties.
    *
    * Should note that duplicates in parent (static, prototype, instance members) 
    * will not overwrite those of the class construction function.
    *
    * Use of special static property **`Super`**:
    * -------------------------------------------
    * one can access the parent constructor with `NewClass.Super.call(this, arg1, arg2, ...)` 
    * and every parent's method with `NewClass.Super.prototype.method.call(this, arg1, arg2, ...)`,
    * or the equivallent `NewClass.Super.apply(this, arguments)` and 
    * `NewClass.Super.prototype.method.apply(this, arguments)`.
    * 
    * Instead of `NewClass` an externally defined construction function can use 
    * it's own name with `Super`.
    *
    * All in-between arguments, 2nd to n-1, borrow their members to the new object 
    * resulting in class or object mixins. In case of objects, the rule 6 for the 
    * mixins applies except method **`constructor`** which is not tranferred even 
    * if it does not exist at the class definition (last) argument of the factory.
    * 
    * Note that duplicate members, static or prototypal, between arguments are 
    * not overwritten so that the first one takes precedence over all the next.
    * In case of instance members, inherited duplicates are overwritten in a way
    * that last one replaces all previous.
    * @class g3.Class
    * @version 0.6
    * @author https:/github.com/centurianii
    * @copyright MIT licence
    */
   g3.Class = function () {
      var factArgs = Array.prototype.slice.call(arguments, 0), //factory arguments during definition of class
          len = factArgs.length,
          body = factArgs[len - 1],
          SuperClass = len > 1 ? factArgs[0] : null,
          SuperObject,
          implementClasses = len > 2,
          Class,
          SuperClassEmpty = function(){},
          build,
          i;
      
      if(len === 0 || (len === 1 && factArgs[0] === null))
         return function() {};
      
      /*
       * 1. Re-define constructor from last argument:
       * --------------------------------------------
       * - as last argument if last argument is a function or,
       * - as the custom function under the reserved word "constructor" if last  
       *   argument is an object with a function value at that property (this  
       *   property exists by default in all objects so we have to exclude it!).
       */
      if (typeof body === 'function'){
         build = body;
      }else if((typeof body === 'object') && (typeof body.constructor === 'function') && Object.prototype.hasOwnProperty.call(body, 'constructor')){
         build = body.constructor;  //reserved word 'constructor' when last argument is object
      }
      
      /*
       * 2. Define constructor:
       * ----------------------
       * - checks if it is called with new, 
       * - calls parent and passes all it's arguments and 
       * - calls the initial construction function.
       */
      Class = function(){
         var prop, 
             constrArgs = Array.prototype.slice.call(arguments, 0), //constructor arguments
             i;
         
         //2.1 Constructor did not called with new: pass up to 10 named arguments!
         if(!(this instanceof Class))
            //return new Class.apply(this, constrArgs);
            return new Class(constrArgs[0], constrArgs[1], constrArgs[2], constrArgs[3], constrArgs[4], constrArgs[5], constrArgs[6], constrArgs[7], constrArgs[8], constrArgs[9]);

         //2.2. Call parent
         if(Class.Super)
            Class.Super.apply(this, constrArgs);
         
         //2.3. Populate instance with instance members from initial construction object or mixins.
         if (implementClasses)
            for (i = 1; i < len - 1; i++)
               if(typeof factArgs[i] === 'object')
                  for (prop in factArgs[i])
                     if((prop !== 'STATIC') && (prop !== 'prototype') && Object.prototype.hasOwnProperty.call(factArgs[i], prop))
                        this[prop] = factArgs[i][prop];
         if (typeof body === 'object')
            for (prop in body)
               if((prop !== 'STATIC') && (prop !== 'prototype') && Object.prototype.hasOwnProperty.call(body, prop))
                  this[prop] = body[prop];
         
         //2.4. In case there is an initial construction function: pass up to 10 named arguments!
         if(build)
            build.apply(this, constrArgs);
         
         //2.5. Define instance's constructor
         this.constructor = Class;
      };
      
      /*
       * 3. Connect constructor with first argument that refers to parent.
       * -----------------------------------------------------------------
       * 'Class.Super' is a static property for function Class that points to parent!
       */
      if (SuperClass){
         //3.1. Create a parent constructor if first argument is an object
         if(typeof SuperClass === 'object'){
            SuperObject = SuperClass;
            SuperClass = function() {
               var prop,
                   constrArgs = Array.prototype.slice.call(arguments, 0);
               //3.1.1. populate parent constructor with instance members (eq. of 2.3.)
               for (prop in SuperObject)
                  if((prop !== 'STATIC') && (prop !== 'prototype') && (Object.prototype.hasOwnProperty.call(SuperObject, prop)))
                     this[prop] = SuperObject[prop];
               
               //3.1.2. call construction function (eq. of 2.4.)
               if((typeof SuperObject.constructor === 'function') && Object.prototype.hasOwnProperty.call(SuperObject, 'constructor'))
                  SuperObject.constructor.apply(this, constrArgs);
               
               //3.1.3. define instance's constructor (eq. of 2.5.)
               this.constructor = SuperClass;
            };
            //3.1.4. populate parent constructor with custom "STATIC" and "prototype" 
            //and actual prototype enumerable members of parent object (eq. of 4.2.)
            extendClassByObject(SuperClass, SuperObject, true);
         }
         
         //in case "build" is an external function and we want to call "Class"'s 
         //parent: in this case if there is property "build.Super" it will be overwritten!
         if(build)
            build.Super = SuperClass;
         
         //3.2. Connect constructor with parent using an intermediate function:
         SuperClassEmpty.prototype = SuperClass.prototype;
            Class.prototype = new SuperClassEmpty();
            Class.prototype.constructor = Class;
         Class.Super = SuperClass;
         
         //3.3. Populate constructor with enumerable static members from parent 
         //by avoiding duplicates!
            //g3.Class.extend(Class, SuperClass, false);
      }
      
      /*
       * 4. Populate constructor from definition.
       * ----------------------------------------
       * We refer to the initial constructor and/or the definition object.
       */
      //4.1. in case initial constructor is a function with members
      if(build){
         g3.Class.extend(Class, build, true);
         g3.Class.extend(Class.prototype, build.prototype, true);
      }
      //4.2. in case initial constructor is an object (complements 2.3)
      if(typeof body === 'object')
         extendClassByObject(Class, body, true);
      
      /*
       * 5. Populate constructor from object or class mixins.
       * ----------------------------------------------------
       * If a mixin is an object then, it's a partial population (complements 2.3)
       */
      if (implementClasses)
         for (i = 1; i < len - 1; i++)
            if(typeof factArgs[i] === 'object')
               extendClassByObject(Class, factArgs[i], false);
            else if(typeof factArgs[i] === 'function'){
               g3.Class.extend(Class, factArgs[i], false);
               g3.Class.extend(Class.prototype, factArgs[i].prototype, false);
            }
      
      /*
       * 6. A static 'toString()' for the derived constructors
       */
      Class.toString = function(){
         return '[Object g3.Class]';
      };
      
      return Class;
   };
   
   /**
    * @summary extendClassByObject
    * ----------------------------
    * @desc
    * It populates 1st argument `Class`, a construction function, with members 
    * from 2nd argument `extension`, an object:
    * 
    * - if object contains a key `STATIC` with value an object then, it's
    *   members will become static members of constructor `Class` and
    * 
    * - if object contains a key `prototype` with value an object then, it's
    *   members will become prototype members of constructor `Class`.
    * @function g3.Class~extendClassByObject
    * @memberof g3.Class
    * @param {Function} Class A construction function
    * @param {Object} extension The extension object
    * @param {Boolean|null} override If it is true, it allows members from `extension` 
    * to overwrite members of `Class`
    * @param {String|null} type The type of members from `extension` that are 
    * allowed to be copied. If the string 'function' is given then, only functional 
    * members are copied. If we want everything to be copied then, don't supply 
    * this argument. Values allowed are those returned by the `typeof` operator.
    * @return {undefined}
    */
   function extendClassByObject(Class, extension, override, type) {
      if (extension.STATIC)
         g3.Class.extend(Class, extension.STATIC, override);
      
      if (extension.prototype)
         g3.Class.extend(Class.prototype, extension.prototype, override);
      
      if (extension.__proto__)
         g3.Class.extend(Class.prototype, extension.__proto__, override);
   };
   
   /**
    * @summary g3.Class.extend
    * ------------------------
    * @desc
    * This property is a static method of `g3.Class`, **`g3.Class.extend()`**.
    * 
    * It makes a shallow copy of enumerable members from argument `extension` to 
    * `obj`
    * @function g3.Class.extend
    * @memberof g3.Class
    * @param {Function|Object} obj The object or function that is going to be 
    * extended.
    * @param {Function|Object} extension The object or function whose members 
    * are going to be copied.
    * @param {Boolean|null} override If duplicate members from `extension` are 
    * allowed to be copied, defaults to `true`.
    * @param {String|null} type The type of members from `extension` that are 
    * allowed to be copied. If the string 'function' is given then, only functional 
    * members are copied. If we want everything to be copied then, don't supply 
    * this argument. Values allowed are those returned by the `typeof` operator.
    * @return {undefined}
    */
   g3.Class.extend = function (obj, extension, override, type) {
      var prop;
      if (override === false) {
         for (prop in extension)
            if (!(prop in obj))
               if(!type)
                  obj[prop] = extension[prop];
               else if(typeof extension[prop] === type)
                  obj[prop] = extension[prop];
      } else {
         for (prop in extension)
            if(!type)
               obj[prop] = extension[prop];
            else if(typeof extension[prop] === type)
               obj[prop] = extension[prop];
      }
   };
   
   /**
    * @summary g3.Class.toString
    * --------------------------
    * @desc
    * This function is a static method of `g3.Class`, **`g3.Class.toString()`**.
    * 
    * It overwrites native behaviour and instead of the source code it returns
    * the classname.
    * @function g3.Class.toString
    * @return {String} The classname
    */
   g3.Class.toString = function(){
      return 'g3.Class';
   };
   
   /**
    * @summary g3.Class.id
    * --------------------
    * @desc
    * `I8VqVVXVJsXjxir3ERfld81H`
    * @var {string} id
    * @memberof g3.Class
    */
   g3.Class.id = 'I8VqVVXVJsXjxir3ERfld81H';
   
   /**
    * @summary g3.Class.version
    * -------------------------
    * @desc
    * `0.6`
    * @var {string} version
    * @memberof g3.Class
    */
   g3.Class.version = '0.6';
   
   /**
    * @summary g3.Class.author
    * ------------------------
    * @desc
    * {@link https:/github.com/centurianii}
    * @var {string} author
    * @memberof g3.Class
    */
   g3.Class.author = 'https:/github.com/centurianii';
   
   /**
    * @summary g3.Class.copyright
    * ---------------------------
    * @desc
    * MIT licence, copyright [centurianii](https:/github.com/centurianii).
    * @var {string} copyright
    * @memberof g3.Class
    */
   g3.Class.copyright = 'MIT licence, copyright https:/github.com/centurianii';
}(window.g3 = window.g3 || {}, jQuery, window, document));

(function(g3, $, window, document, undefined){
/**
 * @summary
 * A custom error class.
 * @version 0.1
 * @id nOtmfvNjCXhPQr0gLqSyMXYq
 * @author https:/github.com/centurianii
 * @copyright MIT licence
 * @class
 */
g3.Error = g3.Class(Error, {
   constructor: function(message, name, original) {
      g3.Error.Super.call(this);
      this.original = original;
      this.name = name || 'Error.g3';
      this.message = message || 'A g3.Error was thrown!';
      (original)? this.stack = this.original.stack: this.stack = null;
      this.message += '\n---STACK---\n' + this.stack;
  }
});
}(window.g3 = window.g3 || {}, jQuery, window, document));

(function(g3, $, window, document){
/**
 * @constructs g3.hybrid
 * @summary
 * The return of `g3.hybrid` is a supplementary object which forms a **root 
 * parent** defining class with the help of the class factory {@link g3.Class}.
 * @desc
 * It provides the constructor and the static and prototype members under the 
 * context of the class that {@link g3.Class} will try to build, i.e. 
 * **`g3[myClass]`**, or **`g3.myClass`** and for that reason the passed 
 * argument should be a string of the name of that class: 
 * 
 * ``` javascript
 * g3.myClass = 
 *      g3.Class(
 *         g3.hybrid(myClass), 
 *         g3.hybridStatic(myClass),
 *         {
 *            STATIC: {...}, 
 *            constructor: function (...){...},
 *            ...
 *         }
 *      );
 * ```
 * 
 * In the above example, `g3.myClass` is the first child of `g3.hybrid(myClass)`.
 * 
 * Hybrid classes are integrated with `jQuery`, see {@link g3.hybridStatic.library}
 * and support jump-in, jump-out between object and `jQuery` collection, see 
 * {@link g3.hybrid#to}.
 * 
 * See an explanation at {@link g3.Class} of what this notation means, in short:
 * 
 * 1) 1st argument is the parent,
 * 
 * 2) 2nd argument up to second from the end is the mixins,
 * 
 * 3) last argument is the function/object definition of the new class,
 * 
 * 4) properties under key `STATIC` become static properties,
 * 
 * 5) properties under key `prototype` become class methods,
 * 
 * 6) the key `constructor` becomes the class constructor and
 * 
 * 7) all the rest properties/methods become instance (inner) ones.
 * 
 * As static members are not copied between classes in the inheritance tree nor
 * from mixins to the defining class if they overlap, we only merge 
 * `{STATIC: {defaults: {...}}` with user options to form an instance property 
 * `this.defaults` of class **`g3[myClass]`**, see next & {@link g3.HybridTemplate}.
 * 
 * Inheritance in hybrid classes: 
 * ------------------------------
 * 1) We define the new class as
 * ``` javascript
 * g3.myClass = 
 *      g3.Class(
 *         g3.ParentClass, 
 *         g3.hybridStatic(myClass),
 *         mixin1,
 *         mixin2,
 *         ...
 *         {
 *            STATIC: {
 *               defaults: {
 *                  ...
 *               },
 *               
 *            }, 
 *            constructor: function(options){
 *               var myClass = 'myClass';
 *               // if inheritance level > 1 and you want object storage:
 *               //g3[myClass].add(this.defaults.name, this);
 *               // n = depth of class
 *               this.initn(options);
 *               this.instance.newBuild[myClass] = false;
 *            },
 *            prototype: {
 *               // n = depth of class
 *               initn: function(options){
 *                  // 1. If NOT called from constructor
 *                  if(this.instance.newBuild['myClass'] === false)
 *                     g3.myClass.Super.prototype.init.call(this, options);
 * 
 *                  var debug = {};
 *                  // 2. call functions
 *                  debug['switch'] = this.switch(options, 'myClass');
 *                  debug['getNodes'] = this.getNodes(options);
 *                  debug['buildn'] = this.buildn();
 * 
 *                  // 3. update 'options.debug'
 *                  (options && (g3.utils.type(options.debug) == 'object')) && 
 *                  $.extend(true, options.debug, debug);
 * 
 *                  // 4. store last working set of 'this.defaults'
 *                  this.instance.lastDefaults = this.defaults;
 *                  return this;
 *               },
 *               build2: function(){
 *                  // ...
 *               },
 *               toString: function(){
 *                  return '[Object g3.myClass]';
 *               },
 *               // ...
 *            }
 *         }
 *      );
 * ```
 * 
 * 2) All static members in the hierarchy tree are accessible as 
 *    `g3[myClass].Super.Super...` 
 *    A special case applies to the static property `g3[myClass].defaults` where 
 *    all of them down in the hierarchy tree, starting from this root and ending 
 *    to `g3[myClass]`, are merged with user options to instance `this.defaults`.
 * 
 * 3) The following static properties should exist in every class thus, they are 
 *    moved to {@link g3.hybridStatic} :
 * 
 *    a) `store`, see {@link g3.hybridStatic.store}, {@link g3.headlessStatic.store}
 * 
 *    b) `override`, see {@link g3.hybridStatic.override}, {@link g3.headlessStatic.override}
 * 
 *    c) `options`, see {@link g3.hybridStatic.options}, {@link g3.headlessStatic.options}
 * 
 *    d) `autoFill`, see {@link g3.hybridStatic.autoFill}, {@link g3.headlessStatic.autoFill}
 * 
 *    e) `instances`, see {@link g3.hybridStatic.instances}, {@link g3.headlessStatic.instances}
 * 
 *    f) `plugins`, see {@link g3.hybridStatic.plugins}, {@link g3.headlessStatic.plugins}.
 * 
 * 4) Before a child object creation we call static `g3[myClass].inherits(true)`  
 *    to block reduntant storage of this object in `g3.Parent.instances` array 
 *    which may also rise a name conflict! 
 *    To start storing parent objects again reverse option and call  
 *    `g3[myClass].inherits(false)`.
 *    
 *    Alternatively, before child object creation, simply set static 
 *    `g3.hybridStatic.store = false;` or, pass in options a key-value like 
 *    `store: false` and use variables to store your objects built from classes.
 * 
 * @param {String} myClass The name of the new class that is to be built
 * @return {Function} A new class constructor
 * @version 0.2
 * @author https:/github.com/centurianii
 * @copyright MIT licence
 */
g3.hybrid = function(myClass){
   return {
      /*
       * Partly the static members of an object built with g3.hybrid + g3.Class: g3[myClass]
       * ===================================================================================
       * 
       */
      STATIC: {
         /**
          * @summary g3.hybrid.defaults
          * ---------------------------
          * @desc 
          * This property will become static property of this root parent, 
          * **`[root].defaults`**.
          * 
          * The static properties from all the hierarchy tree will be merged with
          * **`g3[myClass].defaults`** and moved finally to instance 
          * **`this.defaults`**, see {@link g3.hybrid.constructor} 
          * and {@link g3.hybridStatic.options}.
          * @var {Object} defaults
          * @memberof g3.hybrid
          * @prop {String} name Name of stored object, should provide your own names
          * @prop {Object} parent Parent node whose children will be searched for
          * @prop {Object[]} nodes A static temporary node collection that is 
          *    filled during instance re-initialization by an external library 
          *    like jquery (see {@link g3.hybridStatic.library})
          * @prop {String} plugins A space delimited string of all plugin names
          * that will become prototypal methods with the names listed inside
          */
         defaults: {
            name: 'g3hybrid',
            parent: window.document,
            nodes: [],
            plugins: ''
         },
         
         /**
          * @summary g3.hybrid.inherits
          * ---------------------------
          * @desc
          * Derived classes do not define this.
          * 
          * This method normally exists at the `*Static` mixins ({@link g3.hybridStatic}, 
          * {@link g3.headlessStatic}) so that {@link g3.Class} can 
          * populate it to the derived classes but as this class acts as a root 
          * we need to re-define the method with dummy behaviour.
          * 
          * See {@link g3.hybridStatic.inherits}.
          * @function g3.hybrid.inherits
          * @memberof g3.hybrid
          * @param {Boolean} exists Dummy parameter
          * @return {undefined}
          */
         inherits: function(exists){
            // dummy
         },
         
         /**
          * @summary g3.hybrid.id
          * ---------------------
          * @desc
          * `IFSbza0JCwraRq3PFPX3oYEp`
          * 
          * It shows the id of this root class that is produced by {@link g3.Class}.
          * Derived classes have their own.
          * @var {String} id
          * @memberof g3.hybrid
          */
         id: 'IFSbza0JCwraRq3PFPX3oYEp',
         /**
          * @summary g3.hybrid.name
          * -----------------------
          * @desc
          * `g3.hybrid`
          * 
          * It shows the name of this root class that is produced by {@link g3.Class}.
          * Derived classes have their own.
          * @var {String} name
          * @memberof g3.hybrid
          */
         name: 'g3.hybrid',
         /**
          * @summary g3.hybrid.version
          * --------------------------
          * @desc
          * `0.2`
          * 
          * It shows the version of this root class that is produced by {@link g3.Class}.
          * Derived classes have their own.
          * @var {String} version
          * @memberof g3.hybrid
          */
         version: '0.2',
         /**
          * @summary g3.hybrid.author
          * -------------------------
          * @desc
          * [centurianii](https:/github.com/centurianii)
          * 
          * It shows the author of this root class that is produced by {@link g3.Class}.
          * Derived classes have their own.
          * @var {String} author
          * @memberof g3.hybrid
          */
         author: 'https:/github.com/centurianii',
         /**
          * @summary g3.hybrid.copyright
          * ----------------------------
          * @desc
          * MIT licence, copyright [centurianii](https:/github.com/centurianii).
          * 
          * It shows the copyright of this root class that is produced by {@link g3.Class}.
          * Derived classes have their own.
          * @var {String} copyright
          * @memberof g3.hybrid
          */
         copyright: 'MIT licence, copyright https:/github.com/centurianii'
      },
        
      /*
       * The public members of an object built on g3.hybrid + g3.Class: g3[myClass]
       * ==========================================================================
       */
      prototype: {
         /**
          * @summary 
          * g3.hybrid.prototype.addLibrary
          * ------------------------------
          * @desc 
          * This property will become class's prototype method, 
          * **`g3[myClass].prototype.addLibrary()`**.
          * 
          * It is called always implicitly on object creation from a library 
          * plugin of `g3[myClass]` like jQuery.
          * 
          * Populates `this.libraries` with: "{id: [name], lib: [library reference]}`.
          * 
          * It should be private but it is called by external libraries!
          * 
          * It stores the last library state.
          * @function g3.hybrid#addLibrary
          * @param {String} name A name of the external library that each object 
          *    stores in instance property `this.libraries`
          * @param {String} lib An external library reference
          * @return {undefined}
          */
         addLibrary: function(name, lib){
            var i;
            
            for(i = 0; i < this.libraries.length; i++){
               if(this.libraries[i].id === name){
                  this.libraries[i]['lib'] = lib;
                  return;
               }
            }
            this.libraries.push({'id': name, 'lib': lib});
         },
         
         /**
          * @summary 
          * g3.hybrid.prototype.to
          * ----------------------
          * @desc
          * This property will become class's prototype method, 
          * **`g3[myClass].prototype.to()`**.
          * 
          * It is called when from an object `g3[myClass]` we want to jump-in to 
          * the library object.
          * @function g3.hybrid#to
          * @param {String} name A name of the library whose object will be returned
          * @return {Object} An external reference to a library at the state it
          * was last time we jumped-out into this object
          */
         to: function(name){
            var i;
            
            /* every instance holds only one reference of a specific library */
            for(i = 0; i < this.libraries.length; i++)
               if(this.libraries[i].id === name)
                 return this.libraries[i].lib;
         },
         
         /**
          * @summary 
          * g3.hybrid.prototype.end
          * -----------------------
          * @desc
          * This property will become class's prototype method, 
          * **`g3[myClass].prototype.end()`**.
          * 
          * It is an alias of {@link g3.hybrid#to}.
          * @function g3.hybrid#end
          * @param {String} name A name of the library whose object will be 
          *    returned
          * @return {Object} A pointer to a library that represents it's current 
          *    state
          */
         end: function(name){
            this.to(name);
         },
         
         /**
          * @summary 
          * g3.hybrid.prototype.switch
          * --------------------------
          * @desc
          * This property will become class's prototype method, 
          * **`g3[myClass].prototype.switch()`**.
          * 
          * It is the first method that is called from `this.init(options)`.
          * 
          * It merges to instance `this.defaults` all static `defaults` from the 
          * hierarchy tree along with the argument `options` passed to the 
          * constructor or to `g3[myClass].prototype.init(options)` method.
          * 
          * The constructor of this class, `g3.hybrid`, actually does this merging
          * but child classes should call `switch()` passing their classname as 
          * 2nd argument to enforce merging of static `defaults` in the hierarchy 
          * chain.
          * 
          * If first argument is not an object, it returns false.
          * 
          * The idea behind `this.defaults` is actually to not have to give a 
          * bunch of options/methods to initialize an object but instead having 
          * objects with initial "state" and users that operate upon specific 
          * keys every time.
          * 
          * We introduce a working model of "select some nodes-operate upon-jump 
          * to other nodes-operate upon" and so on, at the same or different 
          * objects.
          * 
          * As we said, it's basic role is to merge all static defaults with 
          * user argument `options` to an instance `this.defaults` as follows:
          * 
          * - if `g3[myClass].options == 'defaults'` the merge happens as 
          *   overlapping from Super -> Class -> argument `options`,
          * 
          * - if `g3[myClass].options == 'last'` the merge happens as 
          *   overlapping from `this.instance.lastDefaults` -> argument `options`.
          * 
          * Every `init()` ends with `this.instance.lastDefaults = this.defaults;`,
          * see {@link g3.hybrid}.
          * @function g3.hybrid#switch
          * @param {Object} options Argument passed during construction or in 
          *    `this.init(options)`
          * @return {Boolean} False if the argument is not object, true on success
          */
         switch: function(options, myClass){
            var tmp,
                self = this;
            
            if(g3.utils.type(options) != 'object')
               return false;
            
            /* 1. read switch "options" with values "last" or "defaults" */
            tmp = (options.options)? options.options : g3[myClass].options;
            
            /* 2. merge options */
            if(tmp.indexOf("last") > -1){
               /* 2.1. "this.instance.lastDefaults" -> argument "options" */
               // 2.1.1. chained 'init()'
               if(this.instance.newBuild[myClass] === false)
                  tmp = {};
               // 2.1.2. on construction
               else
                  tmp = g3[myClass].defaults;
               this.defaults = $.extend(true, {}, self.instance.lastDefaults, tmp, options);
               
            }else{
               /* 2.2. Super -> Class -> argument "options" */
               this.defaults = $.extend(true, {}, self.defaults, g3[myClass].defaults, options);
            }
            delete this.defaults.debug;
            
            return true;
         },
         
         /**
          * @summary 
          * g3.hybrid.prototype.getNodes
          * ----------------------------
          * @desc
          * This property will become class's prototype method, 
          * **`g3[myClass].prototype.getNodes()`**.
          * 
          * It is the second method that is called from `this.init(options)`.
          * 
          * It's basic role is to fill instance properties `this.instance.nodes` 
          * and `this.instance.allNodes` which later are used by all the member 
          * functions of the produced class `g3[myClass]`.
          * 
          * It takes into account the fact that the external library might have 
          * filled `this.defaults.nodes` or user might have given `options.nodes` 
          * in a way that all of them are merged to `options.nodes` (this is done 
          * by {@link g3.hybridStatic.library} during object construction 
          * from an external library).
          * @function g3.hybrid#getNodes
          * @param {Object} options Argument passed during construction or in 
          *    `this.init(options)`
          * @return {Boolean} False if there are no nodes to parse else, true
          */
         getNodes: function(options){
            var result = false,
                self = this;

            /* 1. handle property "options.nodes" */
            if((g3.utils.type(options) == 'object') && (g3.utils.type(options.nodes) == 'array') && options.nodes.length){
               /* 1.1. fill "this.instance.nodes" */
               this.instance.nodes = $(options.nodes).add(self.defaults.nodes).get();
               /* 1.2. empty transient stores "options.nodes" and "this.defaults.nodes" */
               delete options.nodes;
               delete this.defaults.nodes;
               /* 1.3. fill "this.instance.allNodes" */
               this.instance.allNodes = $(self.instance.allNodes).add(self.instance.nodes).get();
               result = true;
            /* 2. handle property "this.defaults.nodes" */
            }else if((g3.utils.type(self.defaults.nodes) == 'array') && self.defaults.nodes.length){
               /* 2.1. fill "this.instance.nodes" */
               this.instance.nodes = $(self.defaults.nodes).get();
               /* 2.2. empty transient store "this.defaults.nodes" */
               delete this.defaults.nodes;
               /* 2.3. fill "this.instance.allNodes" */
               this.instance.allNodes = $(self.instance.allNodes).add(self.instance.nodes).get();
               result = true;
            }

            return result;
         },
         
         /**
          * @summary 
          * g3.hybrid.prototype.toString
          * ----------------------------
          * @desc
          * This property will become class's prototype method, 
          * **`g3[myClass].prototype.toString()`**.
          * 
          * Overwrites `Object.prototype.toString()` so that the return value will
          * be `[Object g3.myClass]`, where `myClass` is the 1st level class above
          * this one `g3.hybrid`. You should define your own for every
          * child class 2nd level and up in the inheritance tree.
          * @function g3.hybrid#toString
          * @return {String} The name of the class
          */
         toString: function(){
            return '[Object g3.' + myClass + ']';
         }
      },
      
      /**
       * @summary 
       * g3.hybrid.constructor
       * ---------------------
       * @desc 
       * The constructor function of the root parent of **`g3[myClass]`**.
       * 
       * We say that `g3[myClass]` is the 1st level class but actually there is a 
       * higher root class, this one, `g3.hybrid` that uses this constructor.
       * 
       * The arguments passed to the `g3[myClass]` constructor become arguments 
       * for this one with the help of {@link g3.Class} factory.
       * You should pass an object argument or it throws an error.
       * 
       * The idea behind `g3[myClass].defaults` is actually not having to give a
       * bunch of options/methods to initialize an object but instead to have 
       * objects with initial "state" and users that operate upon specific keys 
       * every time.
       * 
       * A nice feature would be to accept a string and return the stored object
       * under this key but there is no way to stop object creation when the 
       * passed string represents a duplicate name and force the returning of 
       * that stored object.
       * @function g3.hybrid.constructor
       * @param {Object} options Object that can have as members all properties
       *    that exist at the combined static `defaults` from all the hierarchy tree
       * @return {Object} An object of this root class
       */
      constructor: function(options){
         /* 1. Called without object argument */
         if(g3.utils.type(options) !== 'object')
            throw new g3.Error(myClass+' constructor failed. No object-options were given. Nothing stored to static g3.'+myClass+'.instances array.', 'Error.'+myClass+'.g3', new Error());
         
         /*
          * 2. Called with an object argument: if we have a parent class 
          * (inheritance) then, "this.instance" exists and for that reason we 
          * have to check "this.instance.newBuild[myClass]" (also exists
          * "this.instance.newBuild[parentClass]")
          */
         if(!this.instance || (g3.utils.type(this.instance.newBuild[myClass]) == 'undefined')){
            // 2.1. destroy
            if(options['destroy']){
               g3[myClass].destroy(options['destroy']);
               delete options['destroy'];
            }
            
            /* 2.2. A switchboard: Super -> Class -> user "options" result in: "this.defaults" */
            this.defaults = $.extend(true, {}, g3.hybrid.defaults, g3[myClass].defaults, options);
            delete this.defaults.debug;
            if(g3.utils.type(this.defaults.name) !== 'string')
               this.defaults.name = g3[myClass].defaults.name;
            if(this.defaults.name)
               this.defaults.name = this.defaults.name.replace(/^\s+|\s+$/g, '');
            if(!this.defaults.parent || !this.defaults.parent.nodeType)
               this.defaults.parent = window.document;
            
            /* 2.3. global store */
            if((options.store === true) || ((options.store !== false) && (g3[myClass].store === true)))
               g3[myClass].add(this.defaults.name, this);
            
            /* 2.4. memory */
            if(!this.instance)
               this.instance = {};
            this.instance.name = this.defaults.name;
            this.instance.parent = this.defaults.parent;
            if(!this.instance.nodes)
               this.instance.nodes = [];     // working nodes for member functions
            if(!this.instance.allNodes)
               this.instance.allNodes = [];  // stores all nodes not only the working ones
            if(!this.instance.newBuild)
               this.instance.newBuild = {};
            this.instance.newBuild[myClass] = true;
            if(!this.instance.on)
               this.instance.on = {};        // events to be assigned as name-function/node(?)
            if(!this.instance.off)
               this.instance.off = {};       // events to be deleted as name-function/node(?)
            this.instance.lastDefaults = this.defaults;
            if(!this.libraries)
               this.libraries = [];
            
            /*
             * 2.5. plugins
             * user adds a plugin name in "this.defaults.plugins" as: 
             * g3[myClass].defaults.plugins += " <name>" and the constructor 
             * calls the plugin definition function that is attached on static 
             * object "g3[myClass].plugins"
             */
            var plugins = (g3.utils.type(this.defaults.plugins) === 'string')? this.defaults.plugins: null, 
                override = false,
                tmp;
            
            if((options.override === true) || ((options.override !== false) && (g3[myClass].override === true)))
               override = true;
            
            if(plugins){
               for(tmp in g3[myClass].plugins){
                  if(plugins.indexOf(tmp) > -1)
                     g3.Class.extend(g3[myClass].prototype, g3[myClass].plugins[tmp], override, 'function');
               }
            }
         }
         
         /* 2.6. continue to "init()" */
      }
   };
}
}(window.g3 = window.g3 || {}, jQuery, window, document));

(function(g3, $, window, document){
g3.hybridStatic = function(myClass){
   /**
    * @desc
    * The return of `g3.hybridStatic` is a supplementary object which becomes 
    * a mixin of the final defining class with the help of the class factory 
    * {@link g3.Class}.
    * 
    * It provides the static members under the context of the class that 
    * {@link g3.Class} will try to build, i.e. **`g3[myClass]`**, or **`g3.myClass`** 
    * and for that reason the passed argument should be a string of the name of 
    * that class: 
    * ``` javascript
    * g3.myClass = 
    *      g3.Class(
    *         g3.hybrid(myClass), 
    *         g3.hybridStatic(myClass),
    *         {
    *            STATIC: {...}, 
    *            constructor: function (...){...},
    *            ...
    *         }
    *      );
    * ```
    * 
    * For inheritance see {@link g3.hybrid}.
    * @mixin g3.hybridStatic
    * @version 0.2
    * @author https:/github.com/centurianii
    * @copyright MIT licence
    */
   return {
      /*
       * The static members of an object built on g3.hybrid + g3.Class: g3[myClass]
       * ==========================================================================
       */
      STATIC: {
         /**
          * @summary g3.hybridStatic.STATIC.autoFill
          * ----------------------------------------
          * @desc
          * This property will become static property of `g3[myClass]`, 
          * **`g3[myClass].autoFill`**.
          * 
          * It allows the external library to fill nodes automatically on object 
          * creation.
          * 
          * It can be altered by `options.autoFill` in passed argument, see 
          * {@link g3.hybridStatic.library}.
          * @var g3.hybridStatic.autoFill
          * @memberof g3.hybridStatic
          * @return {undefined}
          */
         autoFill: true,
         
         /**
          * @summary g3.hybridStatic.STATIC.options
          * ---------------------------------------
          * @desc
          * This property will become static property of `g3[myClass]`, 
          * **`g3[myClass].options`**.
          * 
          * It controls how user options are merged with defaults. Values are 
          * `[last|default(s)]`.
          * 
          * It can be altered by `options.options` in passed argument, see 
          * {@link g3.hybrid#switch}.
          * @var g3.hybridStatic.options
          * @memberof g3.hybridStatic
          * @return {undefined}
          */
         options: "last",  //[|default(s)]
         
         /**
          * @summary g3.hybridStatic.STATIC.override
          * ----------------------------------------
          * @desc
          * This property will become static property of `g3[myClass]`, 
          * **`g3[myClass].override`**.
          * 
          * It allows prototypal method override by plugin functions.
          * 
          * It can be altered by `options.override` in passed argument.
          * @var g3.hybridStatic.override
          * @memberof g3.hybridStatic
          * @return {undefined}
          */
         override: false,
         
         /**
          * @summary g3.hybridStatic.STATIC.store
          * -------------------------------------
          * @desc
          * This property will become static property of `g3[myClass]`, 
          * **`g3[myClass].store`**.
          * 
          * It allows/blocks instance storage for this class at static property
          * `g3[myClass].instances`.
          * 
          * It can be altered by `options.store` in passed argument.
          * 
          * It can be altered temporarily to parents with method 
          * {@link g3.hybridStatic.inherits} (the reversed argument value is 
          * assigned to property `store`).
          * @var g3.hybridStatic.store
          * @memberof g3.hybridStatic
          * @return {undefined}
          */
         store: true,
         
         /**
          * @summary g3.hybridStatic.STATIC.instances
          * -----------------------------------------
          * @desc
          * This property will become static property of `g3[myClass]`, 
          * **`g3[myClass].instances`**.
          * 
          * It stores instances of this class.
          * @var g3.hybridStatic.instances
          * @memberof g3.hybridStatic
          * @return {undefined}
          */
         instances: [],
         
         /**
          * @summary g3.hybridStatic.STATIC.plugins
          * ---------------------------------------
          * @desc
          * This property will become static property of `g3[myClass]`, 
          * **`g3[myClass].plugins`**.
          * 
          * It contains plugin definitions that extend prototypal class methods
          * in the form of:
          * 
          * ``` javascript
          * { 
          *    '[function-name]': function(){
          *                          ...
          *                       }
          * }
          * ```
          * 
          * Method {@link g3.hybridStatic.plugin} updates this object.
          * @var g3.hybridStatic.plugins
          * @memberof g3.hybridStatic
          * @return {undefined}
          */
         plugins: {},
         
         /**
          * @summary g3.hybridStatic.STATIC.library
          * ---------------------------------------
          * @desc
          * This property will become static method of `g3[myClass]`, 
          * **`g3[myClass].library()`**.
          * 
          * When accepts as argument the string `jquery`, it defines:
          * 
          * 1. a new static method `$.g3` with arguments `myClass` and `options`
          *    that behaves as the constructor function, e.g. `g3[myClass](options)` 
          * 
          * 2. a new plugin method `$.fn.g3` that accepts as 1st argument 
          *    `myClass` a classname, as 2nd `options` an object or a string and 
          *    an optional 3rd `update` of type boolean, e.g. 
          *    `[library].g3(myClass, options, update)`.
          *
          * The static method `g3[myClass].library` is called once after the 
          * class definition. It is part of the definition of `g3[myClass]` and
          * results in the definition of the above two methods, `$.g3` and `$.fn.g3`.
          * 
          * 1. Calling `$.g3(myClass, options)` results to the following based on `options`:
          * 
          * 1.1 if `options` is null, it returns the class constructor `g3[myClass]`,
          * 
          * 1.2 if `options` is a string then, the relevant named instance is returned,
          * 
          * 1.3 if `options` is an object then, a new instance is built and returned,
          * 
          * 1.4 if nothing of the above happens or no instance has been found, 
          *     then, the plugin returns the external library.
          * 
          * 2. Calling `$.fn.g3(myClass, options, update)` results to the following based on `options`:
          * 
          * 2.1 if `options` is null, it returns the class constructor `g3[myClass]`,
          * 
          * 2.2 if `options` is a string then, the relevant named instance is returned. 
          *     Unless explicitly set `update == false` the instance's property 
          *     `this.defaults.nodes` is extended by the new set of nodes, e.g. 
          *     `$(...).g3(myClass, options[, update)]`,
          * 
          * 2.3 if `options` is an object then, a new instance is built and returned. 
          *     Unless explicitly set `options.autoFill == false` or 
          *     `g3[myClass].autoFill == false`, the nodes found are stored in 
          *     argument `options.nodes`, e.g. `$(...).g3(myClass, options[, update)]`,
          * 
          * 2.4 if nothing of the above happens or no instance has been found, 
          *     then, the plugin returns the external library.
          * 
          * In cases 1.2 and 2.2, if many instances have been found, an array is 
          * returned (that shouldn' happen see {@link g3.hybridStatic.get}).
          * @function g3.hybridStatic.library
          * @memberof g3.hybridStatic
          * @param {String} lib A name of the library which is to be extended by 
          *    a new method named by the second argument
          * @return {Function|Object} Returns the class construction function `g3[myClass]` or,
          *    an object of that class or, the function that builds the external library or,
          *    an object from that external library
          */
         library: function(lib){
            if(lib === 'jquery'){
               $.g3 = function(myClass, options){
                  /* 1.connect the static members between the 2 libraries */
                  if((g3.utils.type(options) === 'null') || (g3.utils.type(options) === 'undefined'))
                     return g3[myClass];
                  /* 2. return an instance of g3[myClass] based on name */
                  else if(g3.utils.type(options) === 'string')
                     return g3[myClass].get(options);
                  /* 3. nothing to do */
                  else if(g3.utils.type(options) !== 'object')
                     return this;
                  /* 4. create an instance */
                  else
                     return new g3[myClass](options);
               };
               
               $.fn.g3 = function(myClass, options, update){
                  /* 1. connect library instance with the static members */
                  if((g3.utils.type(options) === 'null') || (g3.utils.type(options) === 'undefined'))
                     return $.g3(myClass);
                  /* 
                   * 2. return an instance of g3[myClass] based on name and update instance's
                   *    this.defaults.nodes & reference to jquery
                   */
                  else if(g3.utils.type(options) === 'string')
                     return g3[myClass].get(options, 'jquery', this, update);
                  /* 3. nothing to do */
                  else if(g3.utils.type(options) !== 'object')
                     return this;
                  /* 4. create an instance */
                  if(options['destroy']){
                     g3[myClass].get(options['destroy']).destroy();
                     //should not delete again on repetitive re-entries!
                     delete options['destroy'];
                  }
                  
                  //set options.nodes
                  if(g3.utils.type(options.nodes) !== 'array')
                     options.nodes = [];
                  
                  if((options.autoFill === true) || ((options.autoFill !== false) && (g3[myClass].autoFill === true)))
                     options.nodes = this.add(options.nodes).get();
                  
                  //it breaks jquery but, public instance method this.end/to('jquery') returns it!
                  var obj = new g3[myClass](options);

                  //store library reference
                  obj.addLibrary('jquery', this);
                  
                  return obj;
               }
            }
            //other libraries go here...
            return this;
         },
         
         /**
          * @summary g3.hybridStatic.STATIC.plugin
          * --------------------------------------
          * @desc
          * This property will become static method of `g3[myClass]`, 
          * **`g3[myClass].plugin()`**.
          * 
          * It updates static property {@link g3.hybridStatic.plugins} with a new 
          * function-member that will become a prototypal one under conditions (see 
          * below).
          * 
          * Object should be passed as:
          * ``` javascript
          * {
          *    name: '<function-name>', 
          *    <function-name>: function(){
          *       ...
          *    }
          * }
          * ```
          * 
          * You can forget this method and update directly {@link g3.hybridStatic.plugins}:
          * 
          * ``` javascript
          * g3.myClass.plugins['<function-name>'] = function(){
          *    ...
          * }
          * ```
          * 
          * This method throws an error if plugin names are not unique.
          * 
          * On top of calling this method, you should add the plugin names with 
          * either one of the following ways:
          * 
          * - at `STATIC.defaults.plugins` during class definition to have them 
          *   activated by the constructor automatically or,
          * 
          * - after class definition and before construction like 
          *   `g3.myClass.defaults.plugins += " <function-name>";` with the same 
          *   result as previous or,
          * 
          * - during construction with user argument `plugins`.
          * 
          * In the first and third options `plugins` is a space delimited string 
          * of all plugin names that you want to activate (see the space that 
          * prepends the name in the second one).
          * 
          * See {@link g3.hybridStatic.plugins} and {@link g3.hybrid.defaults}.
          * @function g3.hybridStatic.plugin
          * @memberof g3.hybridStatic
          * @param {Object} obj A custom object
          * @return {Function} Returns the class construction function `g3[myClass]`
          */
         plugin: function(obj){
            if(g3.utils.type(obj) !== 'object')
               return this;
            
            if(!obj.name)
               throw new g3.Error('No plugin name found. Nothing stored to g3.' + myClass + '::plugins array.', 'Error.' + myClass + '.g3', new Error());
            
            if(g3[myClass].plugins.hasOwnProperty(obj.name))
               throw new g3.Error('Plugin name collision. Nothing stored to g3.' + myClass + '::plugins array.', 'Error.' + myClass + '.g3', new Error());
            
            g3[myClass].plugins[obj.name] = obj;
            delete obj.name;  //othrwise it will be attached to prototype!
            
            return this;
         },
         
         /**
          * @summary g3.hybridStatic.STATIC.destroy
          * ---------------------------------------
          * @desc
          * This property will become static method of `g3[myClass]`, 
          * **`g3[myClass].destroy()`**.
          * 
          * It deletes an instance of `g3[myClass]` at the static array 
          * `g3[myClass].instances[]` based on the unique name that every 
          * instance should have.
          * @function g3.hybridStatic.destroy
          * @memberof g3.hybridStatic
          * @param {String} name The name of the object to destroy
          * @return {Function} Returns the class construction function `g3[myClass]`
          */
         destroy: function(name){
            for(var i = 0; i < g3[myClass].instances.length; i++){
               if(g3[myClass].instances[i].id === name){
                  //destroy object
                  g3[myClass].instances[i].hybrid = null;
                  g3[myClass].instances.splice(i, 1);
                  
                  return this;
               }
            }
            return this;
         },
         
         /**
          * @summary g3.hybridStatic.STATIC.get
          * -----------------------------------
          * @desc
          * This property will become static method of `g3[myClass]`, 
          * **`g3[myClass].get()`**.
          * 
          * It is called as `g3[myClass].get(name)` or from an external library 
          * as `[library].g3(myClass, name)` or `[library].g3(myClass).get(name)`.
          * 
          * If it is called by an external library during plugin construction of 
          * `g3[myClass]` it accepts 3 more arguments: name of library, 
          * reference (`this`) of library and a boolean [true|false], see 
          * {@link g3.hybridStatic.library}.
          * 
          * Case: no object found.
          * If no object of `g3[myClass]` is found it returns the context it was 
          * run, i.e. the window or the library.
          * 
          * Case: one object found.
          * If only one object of `g3[myClass]` was found:
          * 
          * - it returns that object,
          * 
          * - it updates the library reference inside that object with 
          *   `this.addLibrary()`, only if 4th argument isn't false,
          * 
          * - it extends array `this.defaults.nodes` with the new set of nodes,
          *   , only if 4th argument isn't false.
          * 
          * The 4th argument is the 3rd argument during object construction by 
          * an external library, see {@link g3.hybridStatic.library}.
          * 
          * Case: many objects found.
          * It behaves as one object was found except that it returns the array 
          * of objects found. Note that we shouldn't fall in this case as only 
          * one object exists with this name, see {@link g3.hybridStatic.add}.
          * @function g3.hybridStatic.get
          * @memberof g3.hybridStatic
          * @param {String} name The name of the object to return
          * @param {String} libName The name of the library
          * @param {Object} lib An external library reference
          * @param {Boolean} update True to allow object to store an updated 
          *    reference of the library and at the same time to store the 
          *    collection of nodes to instance property `this.defaults.nodes`
          * @return {Object|Object[]} A reference to an external library or an 
          * object of `g3[myClass]` or an array of objects of `g3[myClass]`
          */
         get: function(name){
            var tmp = [],
                libName = arguments[1],   //library name: passed implicitly by the library!
                lib = arguments[2],       //library pointer: passed implicitly by the library!
                update = arguments[3],    //boolean: passed implicitly by the library!
                i,
                l;
            
            if(g3.utils.type(name) === 'string')
               name = new RegExp('^' + name + '$');
            for(i = 0; i < g3[myClass].instances.length; i++){
               if(g3[myClass].instances[i].id.search(name) > -1)
                  tmp.push(g3[myClass].instances[i].hybrid);
            }

            l = tmp.length;
            if(l === 0){
               return this;
            }else{
               /*
                * 1. Called from within a library!
                * Sets g3[myClass].instances[i].hybrid.defaults.nodes
                */
               if(libName && lib) {
                  for(i = 0; i < l; i++){
                     if(update !== false){
                        tmp[i].addLibrary(libName, lib);
                        tmp[i].defaults.nodes = lib.get();
                     }
                  }
               }
               
               /* 2. Called from "g3" namespace or a library */
               if(l == 1)
                  return tmp[0];
               else
                  return tmp;
            }
         },
         
         /**
          * @summary g3.hybridStatic.STATIC.add
          * -----------------------------------
          * @desc
          * This property will become static method of `g3[myClass]`, 
          * **`g3[myClass].add()`**.
          * 
          * It is called during instance construction and adds this instance to 
          * static array `g3[myClass].instances` with records of the form: 
          * `{id: g3[myClass].instance.name, hybrid: obj}`. 
          * 
          * If the object already exists, it is not stored and an error is thrown,
          * see {@link g3.hybrid.constructor}.
          * @function g3.hybridStatic.add
          * @memberof g3.hybridStatic
          * @param {String} id The name of the object to add.
          * @param {Object} obj The object reference
          * @return {Function} Returns the class construction function `g3[myClass]`
          */
         add: function(id, obj){
            var i;
            
            //care for overlaps: throws an error
            for(i = 0; i < g3[myClass].instances.length; i++){
               if(g3[myClass].instances[i].id === id)
                  throw new g3.Error(myClass + ' instance name \'' + id + '\' overlaps existing. Nothing stored to g3.' + myClass + '::instances array.', 'Error.' + myClass + '.g3', new Error());
            }
            g3[myClass].instances.push({'id': id, 'hybrid': obj});
            return this;
         },
         
         /**
          * @summary g3.hybridStatic.STATIC.Singleton
          * -----------------------------------------
          * @desc
          * This property will become static method of `g3[myClass]` that 
          * returns a singleton object, **`g3[myClass].Singleton()`**.
          * @function g3.hybridStatic.Singleton
          * @memberof g3.hybridStatic
          * @return {myClass} An object of class `myClass`
          */
         Singleton: (function(){
            var that;
            return function(options){
               if(!that){
                  options = options || {};
                  that = g3[myClass](options);
               }
               return that;
            };
         }()),
         
         /**
          * @summary g3.hybridStatic.STATIC.inherits
          * ----------------------------------------
          * @desc
          * This property will become static method of `g3[myClass]`, 
          * **`g3[myClass].inherits()`**.
          * 
          * This method exists at the this mixin so that {@link g3.Class} 
          * can populate it to the derived classes.
          * 
          * On passing true it blocks object storage at the static property 
          * `instances` into all the parents of `g3[myClass]`.
          * 
          * This method comes as a necessity or side-effect of having object
          * storage into the class and is controlled by static property 
          * `g3[myClass].store`, see {@link g3.hybridStatic.store}.
          * @function g3.hybridStatic.inherits
          * @memberof g3.hybridStatic
          * @param {Boolean} exists True blocks object storage higher into the 
          *    hierarchy tree
          * @return {undefined}
          */
         inherits: function(exists){
            g3[myClass].Super.store = !exists;
            g3[myClass].Super.inherits(exists);
         },
         
         /**
          * @summary g3.hybridStatic.STATIC.toString
          * ----------------------------------------
          * @desc
          * This property will become static method of `g3[myClass]`,  
          * **`g3[myClass].toString()`**.
          * 
          * Overwrites `Object.toString()` so that the return value will
          * be `[Object g3.myClass]`, where `myClass` is the name of the class 
          * passed during construction.
          * @function g3.hybridStatic.toString
          * @memberof g3.hybridStatic
          * @return {String} The name of the class
          */
         toString: function(){
            return '[Object g3.' + myClass + ']';
         },
         
         /**
          * @summary g3.hybridStatic.STATIC.id
          * ----------------------------------
          * @desc
          * This property will become static property of `g3[myClass]`, 
          * **`g3[myClass].id`**.
          * @var {String} id
          * @memberof g3.hybridStatic
          */
         id: 'hDzkTzwMIiI2rzoy8ArQn8Xq',
         
         /**
          * @summary g3.hybridStatic.STATIC.name
          * ------------------------------------
          * @desc
          * This property will become static property of `g3[myClass]`, 
          * **`g3[myClass].name`**.
          * @var {String} name
          * @memberof g3.hybridStatic
          */
         name: 'g3.hybridStatic',
         
         /**
          * @summary g3.hybridStatic.STATIC.version
          * ---------------------------------------
          * @desc
          * This property will become static property of `g3[myClass]`, 
          * **`g3[myClass].version`**.
          * @var {String} version
          * @memberof g3.hybridStatic
          */
         version: '0.2',
         
         /**
          * @summary g3.hybridStatic.STATIC.author
          * --------------------------------------
          * @desc
          * This property will become static property of `g3[myClass]`, 
          * **`g3[myClass].author`**.
          * @var {String} author
          * @memberof g3.hybridStatic
          */
         author: 'https:/github.com/centurianii',
         
         /**
          * @summary g3.hybridStatic.STATIC.copyright
          * -----------------------------------------
          * @desc
          * This property will become static property of `g3[myClass]`, 
          * **`g3[myClass].copyright`**.
          * @var {String} copyright
          * @memberof g3.hybridStatic
          */
         copyright: 'MIT licence, copyright https:/github.com/centurianii'
      }
   }
}
}(window.g3 = window.g3 || {}, jQuery, window, document));

(function(g3, $, window, document){
/**
 * @constructs g3.headless
 * @summary
 * The return of `g3.headless` is a supplementary object which forms a root 
 * **parent** defining class with the help of the class factory {@link g3.Class}.
 * @desc
 * It provides the constructor and the static and prototype members under the 
 * context of the class that {@link g3.Class} will try to build, i.e. 
 * **`g3[myClass]`** or **`g3.myClass`** and for that reason the passed argument 
 * should be a string of the name of that class: 
 * ```
 * g3.myClass = 
 *      g3.Class(
 *         g3.headless(myClass), 
 *         g3.headlessStatic(myClass),
 *         {
 *            STATIC: {...}, 
 *            constructor: function (...){...},
 *            ...
 *         }
 *      );
 * ```
 * 
 * In the above example, `g3.myClass` is the first child of `g3.headless(myClass)`.
 * 
 * This base helper object is targeted for classes with no node manipulation.
 * 
 * For inheritance see {@link g3.hybrid}.
 * 
 * @param {String} myClass The name of the new class that is to be built
 * @return {Function} A new class constructor
 * @version 0.1
 * @author {@link https:/github.com/centurianii}
 * @copyright MIT licence
 */
g3.headless = function(myClass){
   return {
      /*
       * The static members of an object built on g3.headless + g3.Class: g3[myClass]
       * ============================================================================
       */
      STATIC: {
         /**
          * @summary g3.headless.STATIC.defaults
          * ------------------------------------
          * @desc 
          * This property will become static property of this root parent, 
          * **`[root].defaults`**.
          * 
          * The static properties from all the hierarchy tree will be merged with
          * **`g3[myClass].defaults`** and moved finally to instance 
          * **`this.defaults`**, see {@link g3.headless.constructor} 
          * and {@link g3.headlessStatic.options}.
          * @var {Object} defaults
          * @memberof g3.headless
          * @prop {String} name Name of stored object, should provide your own names
          * @prop {Object} parent Parent node whose children will be searched for
          * @prop {String} plugins A space delimited string of all plugin names
          *    that will become prototypal methods with the names listed inside
          */
         defaults: {
            name: 'g3headless',
            parent: window.document,
            plugins: ''
         },
         
         /**
          * @summary g3.headless.STATIC.inherits
          * ------------------------------------
          * @desc
          * This property will become static method of this root parent, 
          * **`[root].inherits()`**.
          * 
          * This method normally exists at the `*Static` mixins ({@link g3.hybridStatic}, 
          * {@link g3.headlessStatic}) so that {@link g3.Class} can 
          * populate it to the derived classes but as this class acts as a root 
          * we need to re-define the method with dummy behaviour.
          * 
          * See {@link g3.headlessStatic.inherits}.
          * @function g3.headless.inherits
          * @memberof g3.headless
          * @param {Boolean} exists Dummy parameter
          * @return {undefined}
          */
         inherits: function(exists){
            // dummy
         },
         
         /**
          * @summary g3.headless.STATIC.id
          * ------------------------------
          * @desc
          * `oCQbHf5ZP6umL9JWfiFSnf14`
          * 
          * It shows the id of this root class that is produced by {@link g3.Class}.
          * Derived classes have their own.
          * @var {String} id
          * @memberof g3.headless
          */
         id: 'oCQbHf5ZP6umL9JWfiFSnf14',
         /**
          * @summary g3.headless.STATIC.name
          * --------------------------------
          * @desc
          * `g3.headless`
          * 
          * It shows the name of this root class that is produced by {@link g3.Class}.
          * Derived classes have their own.
          * @var {String} name
          * @memberof g3.headless
          */
         name: 'g3.headless',
         /**
          * @summary g3.headless.STATIC.version
          * -----------------------------------
          * @desc
          * `0.1`
          * 
          * It shows the version of this root class that is produced by {@link g3.Class}.
          * Derived classes have their own.
          * @var {String} version
          * @memberof g3.headless
          */
         version: '0.1',
         /**
          * @summary g3.headless.STATIC.author
          * ----------------------------------
          * @desc
          * [centurianii](https:/github.com/centurianii)
          * 
          * It shows the author of this root class that is produced by {@link g3.Class}.
          * Derived classes have their own.
          * @var {String} author
          * @memberof g3.headless
          */
         author: 'https:/github.com/centurianii',
         /**
          * @summary g3.headless.STATIC.copyright
          * -------------------------------------
          * @desc
          * MIT licence, copyright [centurianii](https:/github.com/centurianii).
          * 
          * It shows the copyright of this root class that is produced by {@link g3.Class}.
          * Derived classes have their own.
          * @var {String} copyright
          * @memberof g3.headless
          */
         copyright: 'MIT licence, copyright https:/github.com/centurianii'
      },
      
      /*
       * The public members of an object built on g3.headless + g3.Class: g3[myClass]
       * ============================================================================
       */
      prototype: {
         /**
          * @summary 
          * g3.headless.prototype.switch
          * ----------------------------
          * @desc
          * This property will become class's prototype method, 
          * **`g3[myClass].prototype.switch()`**.
          * 
          * It is the first method that is called from `this.init(options)`.
          * 
          * See {@link g3.hybrid#switch} but everything about nodes does
          * not apply here.
          * @function g3.headless#switch
          * @param {Object} options Argument passed during construction or in 
          *    `his.init(options)`
          * @return {Boolean} False if the argument is not object or if it is 
          *    called from the constructor, true on success
          */
         switch: function(options, myClass){
            var tmp,
                self = this;
            
            if((g3.utils.type(options) !== 'object') || this.instance.newBuild[myClass])
               return false;
            
            // 1. read switch "options" with values "last" or "defaults"
            tmp = (options.options)? options.options : g3[myClass].options;
            
            // 2. merge options
            if(tmp.indexOf("last") > -1)
               // 2.1. "this.instance.lastDefaults" -> argument "options"
               this.defaults = $.extend(true, {}, self.instance.lastDefaults, g3[myClass].defaults, options);
            else
               // 2.2. Super -> Class -> argument "options"
               this.defaults = $.extend(true, {}, self.defaults, g3[myClass].defaults, options);
            delete this.defaults.debug;
            
            return true;
         },
         
         /**
          * @summary 
          * g3.headless.prototype.toString
          * ------------------------------
          * @desc
          * This property will become class's prototype method, 
          * **`g3[myClass].prototype.toString()`**.
          * 
          * Overwrites `Object.prototype.toString()` so that the return value will
          * be `[Object g3.myClass]`, where `myClass` is the name of the class 
          * passed during construction.
          * @function g3.headless#toString
          * @return {String} The name of the class.
          */
         toString: function(){
            return '[Object g3.' + myClass + ']';
         }
      },
      
      /**
       * @summary 
       * g3.headless.constructor
       * -----------------------
       * @desc 
       * The constructor function of the root parent of **`g3[myClass]`**.
       * 
       * See {@link g3.hybrid.constructor}.
       * @function g3.headless.constructor
       * @param {Object} options Object that contains as members all properties
       *    that can be found at static `g3[myClass].defaults`
       * @return {Object} An object of class `g3[myClass]`
       */
      constructor: function(options){
         // 1. called without object argument
         if(g3.utils.type(options) !== 'object')
            throw new g3.Error(myClass+' constructor failed. No object-options were given. Nothing stored to static g3.'+myClass+'.instances array.', 'Error.'+myClass+'.g3', new Error());

         /* 2. Called with an object argument */
         if(!this.instance || (g3.utils.type(this.instance.newBuild[myClass]) == 'undefined')){
            // 2.1. destroy
            if(options['destroy']){
               g3[myClass].destroy(options['destroy']);
               delete options['destroy'];
            }
            
            /* 2.2. A switchboard: Super -> Class -> user "options" result in: "this.defaults" */
            this.defaults = $.extend(true, {}, g3.hybrid.defaults, g3[myClass].defaults, options);
            delete this.defaults.debug;
            if(g3.utils.type(this.defaults.name) !== 'string')
               this.defaults.name = g3[myClass].defaults.name;
            if(this.defaults.name)
               this.defaults.name = this.defaults.name.replace(/^\s+|\s+$/g, '');
            if(!this.defaults.parent || !this.defaults.parent.nodeType)
               this.defaults.parent = window.document;
            
            /* 2.3. global store */
            if((options.store === true) || ((options.store !== false) && (g3[myClass].store === true)))
               g3[myClass].add(this.defaults.name, this);
            
            /* 2.4. memory */
            if(!this.instance)
               this.instance = {};
            this.instance.name = this.defaults.name;
            this.instance.parent = this.defaults.parent;
            this.instance.lastDefaults = this.defaults;
            if(!this.instance.newBuild)
               this.instance.newBuild = {};
            this.instance.newBuild[myClass] = true;
            
            /*
             * 2.5. plugins
             * user adds a plugin name in "this.defaults.plugins" as: 
             * g3[myClass].defaults.plugins += " <name>" and the constructor 
             * calls the plugin definition function that is attached on static 
             * object "g3[myClass].plugins"
             */
            var plugins = (g3.utils.type(this.defaults.plugins) === 'string')? this.defaults.plugins: null, 
                override = false,
                tmp;
            
            if((options.override === true) || ((options.override !== false) && (g3[myClass].override === true)))
               override = true;
            
            if(plugins){
               for(tmp in g3[myClass].plugins){
                  if(plugins.indexOf(tmp) > -1)
                     g3.Class.extend(g3[myClass].prototype, g3[myClass].plugins[tmp], override, 'function');
               }
            }
         }
         
         // 2.6. continue to 'init()'
      }
   }
}
}(window.g3 = window.g3 || {}, jQuery, window, document));

(function(g3, $, window, document){
g3.headlessStatic = function(myClass){
   /**
    * @desc
    * The return of `g3.headlessStatic` is a supplementary object which becomes 
    * a mixin of the final defining class with the help of the class factory 
    * {@link g3.Class}.
    * 
    * It provides the static members under the context of the class that 
    * {@link g3.Class} will try to build, i.e. **`g3[myClass]`**, or **`g3.myClass`** 
    * and for that reason the passed argument should be a string of the name of 
    * that class: 
    * 
    * ``` javascript
    * g3.myClass = 
    *      g3.Class(
    *         g3.headless(myClass), 
    *         g3.headlessStatic(myClass),
    *         {
    *            STATIC: {...}, 
    *            constructor: function (...){...},
    *            ...
    *         }
    *      );
    * ```
    * 
    * For inheritance see {@link g3.hybrid}.
    * @mixin g3.headlessStatic
    * @version 0.1
    * @author https:/github.com/centurianii
    * @copyright MIT licence
    */
   return {
      /*
       * The static members of an object built on g3.headless + g3.Class: g3[myClass]
       * ============================================================================
       */
       
      STATIC: {
         /**
          * @summary g3.headlessStatic.STATIC.options
          * -----------------------------------------
          * @desc
          * This property will become static property of `g3[myClass]`, 
          * **`g3[myClass].options`**.
          * 
          * It controls how user options are merged with defaults. Values are 
          * `[last|default(s)]`.
          * 
          * It can be altered by `options.options` in passed argument, see 
          * {@link g3.headless#switch}.
          * @var g3.headlessStatic.options
          * @memberof g3.headlessStatic
          * @return {undefined}
          */
         options: "last",  //[|default(s)]
         
         /**
          * @summary g3.headlessStatic.STATIC.override
          * ------------------------------------------
          * @desc
          * This property will become static property of `g3[myClass]`, 
          * **`g3[myClass].override`**.
          * 
          * It allows prototypal method override by plugin functions.
          * 
          * It can be altered by `options.override` in passed argument.
          * @var g3.headlessStatic.override
          * @memberof g3.headlessStatic
          * @return {undefined}
          */
         override: false,
         
         /**
          * @summary g3.headlessStatic.STATIC.store
          * ---------------------------------------
          * @desc
          * This property will become static property of `g3[myClass]`, 
          * **`g3[myClass].store`**.
          * 
          * It allows/blocks instance storage for this class at static property
          * `g3[myClass].instances`.
          * 
          * It can be altered by `options.store` in passed argument.
          * 
          * It can be altered during construction for the anchestors of this class 
          * with method {@link g3.headlessStatic.inherits} (the reversed argument 
          * value is assigned to every anchestor's property `store`).
          * @var g3.headlessStatic.store
          * @memberof g3.headlessStatic
          * @return {undefined}
          */
         store: true,
         
         /**
          * @summary g3.headlessStatic.STATIC.instances
          * -------------------------------------------
          * @desc
          * This property will become static property of `g3[myClass]`, 
          * **`g3[myClass].instances`**.
          * 
          * It stores instances of this class.
          * @var g3.headlessStatic.instances
          * @memberof g3.headlessStatic
          * @return {undefined}
          */
         instances: [],
         
         /**
          * @summary g3.headlessStatic.STATIC.plugins
          * -----------------------------------------
          * @desc
          * This property will become static property of `g3[myClass]`, 
          * **`g3[myClass].plugins`**.
          * 
          * It conatins plugin definitions that extend prototypal class methods
          * in the form of:
          * 
          * ``` javascript
          * { 
          *    '[function-name]': function(){
          *                          ...
          *                       }
          * }
          * ```
          * 
          * see {@link g3.headlessStatic.plugin}.
          * @var g3.headlessStatic.plugins
          * @memberof g3.headlessStatic
          * @return {undefined}
          */
         plugins: {},
         
         /**
          * @summary g3.headlessStatic.STATIC.plugin
          * ----------------------------------------
          * @desc
          * This property will become static method of `g3[myClass]`, 
          * **`g3[myClass].plugin()`**.
          * 
          * It updates static property `g3[myClass].plugins` with a new object, 
          * see {@link g3.hybridStatic.plugin}.
          * @function g3.headlessStatic.plugin
          * @memberof g3.headlessStatic
          * @param {Object} obj A custom object
          * @return {Function} Returns the class construction function `g3[myClass]`
          */
         plugin: function(obj){
            if(g3.utils.type(obj) !== 'object')
               return this;
            
            if(!obj.name)
               throw new g3.Error('No plugin name found. Nothing stored to g3.' + myClass + '::plugins array.', 'Error.' + myClass + '.g3', new Error());
            
            if(g3[myClass].plugins.hasOwnProperty(obj.name))
               throw new g3.Error('Plugin name collision. Nothing stored to g3.' + myClass + '::plugins array.', 'Error.' + myClass + '.g3', new Error());
            
            g3[myClass].plugins[obj.name] = obj;
            delete obj.name;  //othrwise it will be attached to prototype!
            
            return this;
         },
         
         /**
          * @summary g3.headlessStatic.STATIC.destroy
          * -----------------------------------------
          * @desc
          * This property will become static method of `g3[myClass]`, 
          * **`g3[myClass].destroy()`**.
          * 
          * It deletes an instance of `g3[myClass]` at the static array 
          * `g3[myClass].instances[]` based on the unique name that every 
          * instance should have.
          * @function g3.headlessStatic.destroy
          * @memberof g3.headlessStatic
          * @param {String} name The name of the object to destroy
          * @return {Function} Returns the class construction function `g3[myClass]`
          */
         destroy: function(name){
            for(var i = 0; i < g3[myClass].instances.length; i++){
               if(g3[myClass].instances[i].id === name){
                  //destroy object
                  g3[myClass].instances[i].hybrid = null;
                  g3[myClass].instances.splice(i, 1);
                  
                  return this;
               }
            }
            return this;
         },
         
         /**
          * @summary g3.headlessStatic.STATIC.get
          * -------------------------------------
          * @desc
          * This property will become static method of `g3[myClass]`, 
          * **`g3[myClass].get()`**.
          * 
          * It is called as `g3[myClass].get(name)` or from an external library 
          * as `[library].g3(myClass, name)` or `[library].g3(myClass).get(name)`,
          * see {@link g3.hybridStatic.get}.
          * @function g3.headlessStatic.get
          * @memberof g3.headlessStatic
          * @param {String} name The name of the object to return
          * @return {Object|Object[]} A reference to an external library or an 
          * object of `g3[myClass]` or an array of objects of `g3[myClass]`
          */
         get: function(name){
            var tmp = [],
                i,
                l;

            if(g3.utils.type(name) === 'string')
               name = new RegExp('^' + name + '$');
            for(i = 0; i < g3[myClass].instances.length; i++){
               if(g3[myClass].instances[i].id.search(name) > -1)
                  tmp.push(g3[myClass].instances[i].hybrid);
            }

            l = tmp.length;
            if(l === 0){
               return this;
            }else{
               if(l === 1)
                  return tmp[0];
               else
                  return tmp;
            }
         },
         
         /**
          * @summary g3.headlessStatic.STATIC.add
          * -------------------------------------
          * @desc
          * This property will become static method of `g3[myClass]`, 
          * **`g3[myClass].add()`**.
          * 
          * It is called during instance construction and adds this instance to 
          * static array `g3[myClass].instances` with records of the form: 
          * `{id: g3[myClass].instance.name, hybrid: obj}`. 
          * 
          * If the object already exists, it is not stored and an error is thrown,
          * see {@link g3.headless.constructor}.
          * @function g3.headlessStatic.add
          * @memberof g3.headlessStatic
          * @param {String} id The name of the object to add.
          * @param {Object} obj The object reference
          * @return {Function} Returns the class construction function `g3[myClass]`
          */
         add: function(id, obj){
            var i;
            
            //care for overlaps: throws an error
            for(i = 0; i < g3[myClass].instances.length; i++){
               if(g3[myClass].instances[i].id === id)
                  throw new g3.Error(myClass + ' instance name \'' + id + '\' overlaps existing. Nothing stored to g3.' + myClass + '::instances array.', 'Error.' + myClass + '.g3', new Error());
            }
            g3[myClass].instances.push({'id': id, 'hybrid': obj});
            return this;
         },
         
         /**
          * @summary g3.headlessStatic.STATIC.Singleton
          * -------------------------------------------
          * @desc
          * This property will become static method of `g3[myClass]` that 
          * returns a singleton object, **`g3[myClass].Singleton()`**.
          * @function g3.headlessStatic.Singleton
          * @memberof g3.headlessStatic
          * @return {myClass} An object of class `myClass`
          */
         Singleton: (function(){
            var that;
            return function(options){
               if(!that){
                  options = options || {};
                  that = g3[myClass](options);
               }
               return that;
            };
         }()),
         
         /**
          * @summary g3.headlessStatic.STATIC.inherits
          * ------------------------------------------
          * @desc
          * This property will become static method of `g3[myClass]`, 
          * **`g3[myClass].inherits()`**.
          * 
          * This method exists at the this mixin so that {@link g3.Class} 
          * can populate it to the derived classes, see 
          * {@link g3.hybridStatic.inherits}.
          * @function g3.headlessStatic.inherits
          * @memberof g3.headlessStatic
          * @param {Boolean} exists True blocks object storage higher into the 
          *    hierarchy tree
          * @return {undefined}
          */
         inherits: function(exists){
            g3[myClass].Super.store = !exists;
            g3[myClass].Super.inherits(exists);
         },
         
         /**
          * @summary g3.headlessStatic.STATIC.toString
          * ------------------------------------------
          * @desc
          * This property will become static method of `g3[myClass]`,  
          * **`g3[myClass].toString()`**.
          * 
          * Overwrites `Object.toString()` so that the return value will
          * be `[Object g3.myClass]`, where `myClass` is the name of the class 
          * passed during construction.
          * @function g3.headlessStatic.toString
          * @memberof g3.headlessStatic
          * @return {String} The name of the class
          */
         toString: function(){
            return '[Object g3.' + myClass + ']';
         },
         
         /**
          * @summary g3.headlessStatic.STATIC.id
          * ------------------------------------
          * @desc
          * This property will become static property of `g3[myClass]`, 
          * **`g3[myClass].id`**.
          * @var {String} id
          * @memberof g3.headlessStatic
          */
         id: 'QVMkNskigzuker3aOsPBFsV0',
         
         /**
          * @summary g3.headlessStatic.STATIC.name
          * --------------------------------------
          * @desc
          * This property will become static property of `g3[myClass]`, 
          * **`g3[myClass].name`**.
          * @var {String} name
          * @memberof g3.headlessStatic
          */
         name: 'g3.headlessStatic',
         
         /**
          * @summary g3.headlessStatic.STATIC.version
          * -----------------------------------------
          * @desc
          * This property will become static property of `g3[myClass]`, 
          * **`g3[myClass].version`**.
          * @var {String} version
          * @memberof g3.headlessStatic
          */
         version: '0.1',
         
         /**
          * @summary g3.headlessStatic.STATIC.author
          * ----------------------------------------
          * @desc
          * This property will become static property of `g3[myClass]`, 
          * **`g3[myClass].author`**.
          * @var {String} author
          * @memberof g3.headlessStatic
          */
         author: 'https:/github.com/centurianii',
         
         /**
          * @summary g3.headlessStatic.STATIC.copyright
          * -------------------------------------------
          * @desc
          * This property will become static property of `g3[myClass]`, 
          * **`g3[myClass].copyright`**.
          * @var {String} copyright
          * @memberof g3.headlessStatic
          */
         copyright: 'MIT licence, copyright https:/github.com/centurianii'
      }
   }
}
}(window.g3 = window.g3 || {}, jQuery, window, document));

(function(g3, $, window, document, undefined){
/**
 * @summary
 * A class that can load lists of resources (.js, .css) in order and execute 
 * callbacks on a per list basis.
 * @desc
 * Some functions need to be executed after the loading of specific files and at
 * the same time such ordered list of loaded files can form bigger chains.
 * 
 * In these scenarios of timely executed functions after specific files have been
 * loaded this class can provide answers.
 * 
 * Specifically, it supports:
 * 
 * - asynchronous execution of callbacks,
 * 
 * - callabacks as functions or object methods with any number of arguments,
 * 
 * - success ({@link g3.Loader#done}) and failure handlers ({@link g3.Loader#fail}),
 * 
 * - any number of callbacks passed as arguments to {@link g3.Loader#done} or 
 *   {@link g3.Loader#fail},
 * 
 * - emits custom events to callbacks context on success or failure,
 * 
 * - can prepend and/or append custom strings to paths before loading, see 
 *   {@link g3.Loader.defaults} which is an argument template of {@link g3.Loader#init},
 * 
 * - loads asynchronously a list of files, see {@link g3.Loader#load} - waits for 
 *   the list to complete - executes callbacks - loads another list etc. 
 *   (sequential list loading),
 * 
 * - lists are named automatically or by the user, see {@link g3.Loader#register}, 
 * 
 * - register lists and start loading later,
 * 
 * - automatic detection of existed resources (avoids double loading),
 * 
 * - automatic id asignement of all requested resources,
 * 
 * - ability to destroy relevant nodes (`<link>` and `<script>` tags) for a 
 *   named list or for all lists, see {@link g3.Loader#destroy} and
 * 
 * - the immense advantages of a {@link g3.hybrid} class system.
 * 
 * The above are succeeded by only six methods:
 * 
 * - {@link g3.Loader#init},
 * 
 * - {@link g3.Loader#register},
 * 
 * - {@link g3.Loader#load},
 * 
 * - {@link g3.Loader#done},
 * 
 * - {@link g3.Loader#fail},
 * 
 * - {@link g3.Loader#destroy}.
 * 
 * Every `load` creates an internal deferred that is resolved when it's connected
 * named list of resources is resolved or it is rejected when at least one resource 
 * fails. At the first case, success callbacks are called and at the second the 
 * fail callbacks.
 * 
 * Pay attention of the internal state of `this.instance`:
 * 
 * ``` javascript
 * |--> dfds
 * |     |
 * |     |--> all   :  deferred
 * |     |--> defs  :  list of deferreds
 * |     |--> list  :  list of urls
 * |
 * |--> existedIds :  list of tag ids
 * |
 * |--> loadedIds  :  list of tag ids
 * ```
 * 
 * Also there is a static `g3.Loader`:
 * ``` javascript
 * |--> errorIds
 * ```
 * 
 * Examples:
 * 
 * 1) **`load()` with arguments a list and callbacks**
 * 
 * ``` javascript
 * g3.Loader.init({name: ..., parent: ...}).
 * 
 *    load(urls[],                             [load these] -> asynchronous
 *       {                   \                         |
 *          method: ...,     |                       E |
 *          context: ...,     > success callback     X t
 *          arguments: ...   |                       E h
 *       },                  /                       C e
 *       {                  \                        U n
 *          method: ...,     |                       T |
 *          context: ...,     > failure callback     E |
 *          arguments: ...   |                         |
 *       }                   /                         |
 *    ).                                               |
 *                                                     v
 *    load(urls[], success, failure).          [load these] -> asynchronous
 * 
 *    load(urls[], success, failure)....
 * ```
 * 2) **`load()` with callbacks at `done()` and `fail()`**
 * 
 * ``` javascript
 * g3.Loader.init({name: ..., parent: ...}).
 * 
 *    load(urls[]).                            [load these] -> asynchronous
 *    done({                 \                         |
 *          method: ...,     |                         |
 *          context: ...,     > success callback #1    |
 *          arguments: ...   |                       E |
 *       },                  /                       X t
 *       {                   \                       E h
 *          method: ...,     |                       C e
 *          context: ...,     > success callback #2  U n
 *          arguments: ...   |                       T |
 *       },                  /                       E |
 *       ...                                           |
 *    ).                                               |
 *    fail(callback, callback, ...).                   |
 *                                                     v
 *    load(urls[]).                            [load these] -> asynchronous
 *    done(callback, callback, ...).
 *    fail(callback, callback, ...)....
 * ```
 * 
 * 3) **multiple quartets `init()` that change urls with `load()`, `done()` and `fail()`**
 * 
 * ``` javascript
 * g3.Loader.init({name: ..., parent: ..., prepend: ..., append: ...}).
 *    load(urls[]).                            [load these] -> asynchronous
 *    done(callback, callback, ...).                 E |
 *    fail(callback, callback, ...).                 X t
 *    done(callback, callback, ...).                 E h
 *    fail(callback, callback, ...).                 C e
 *                                                   U n
 *                                                   T |
 *                                                   E |
 *    init({prepend: ..., append: ...}).               v
 *    load(urls[]).                            [load these] -> asynchronous
 *    done(callback, callback, ...).
 *    fail(callback, callback, ...)....
 * ```
 * 
 * 4) **multiple doubles `init()` and `load()` that change urls followed by `done()` and `fail()`**
 * 
 *  ``` javascript
 * g3.Loader.init({name: ..., parent: ..., prepend: ..., append: ...}).
 *    load(urls[]).                            [load these] -> asynchronous
 *    init({prepend: ..., append: ...}).                 t h e n&#42;
 *    load(urls[]).                            [load these] -> asynchronous
 * 
 *    done(callback, callback, ...).
 *    fail(callback, callback, ...)....
 * ```
 * (&#42;)To solve the problem of sequential loading of the two lists at (4) whereas,
 * you only wanted to change the paths it's better to use `register()` under the
 * same name and then `load()`.
 * 
 * To use `register()` in all the above examples replace `load(urls[])` with 
 * ``` javascript
 *    register(urls[], name).
 *    load(name).
 * ```
 * @class g3.Loader
 * @version 0.1
 * @author https:/github.com/centurianii
 * @copyright MIT licence
 */
g3.Loader = g3.Class(g3.headless('Loader'), g3.hybridStatic('Loader'), {
   STATIC: {
      /**
       * @summary
       * This object will become instance property `this.defaults`, see 
       * {@link g3.hybrid.defaults}.
       * @var {Object} defaults
       * @memberof g3.Loader
       * @prop {String} name Name of stored object, should provide your own names
       * @prop {Object} parent The document that might this object be connected with
       * @prop {String} plugins A space delimited string of all plugin names
       *    that will become prototypal methods with the names listed inside
       * @prop {string} prepend A string to prepend to all urls that will be given next
       * @prop {string} append A string to append to all urls that will be given next
       * @prop {string} script Values `"head"` or `"body"` where scripts will be 
       *    added; defaults to `"body"`
       * @prop {integer} idLength The length of assigned ids on loaded resources
       * @prop {object[]} trigger An array of objects we want to be notified
       * @prop {String[]} on An array of events handled by this class
       */
      defaults: {
         /* 
          * User supplied options
          * ---------------------
          */
         name: 'g3Loader',
         parent: window.document,
         plugins: '',
         prepend: '',
         append: '',
         script: 'body',
         idLength: 5,
         trigger: [],
         /* ---end user options--- */
         /* Custom events */
         on: ['error', 'done.Loader.g3', 'fail.Loader.g3']
      },
      
      /**
       * @summary
       * A template of values for user arguments.
       * @desc
       * Such user arguments are used in {@link g3.Loader#load}, {@link g3.Loader#done} 
       * or {@link g3.Loader#fail}.
       * @var {Object} g3.Loader.callbackTemplate
       * @prop {string|object} method The name of an object's method or a function
       * @prop {object} context The object that owns this method or `this` reference 
       *     inside a function; defaults to `window`
       * @prop {*} arguments An array that is passed as arguments to the method/function
       */
      callbackTemplate: {
         method: 'method',
         context: 'context',
         arguments: 'arguments'
      },
      
      /**
       * @summary
       * A template of values for internal object `this.instance.dfds`.
       * @desc
       * For every list of resources there is one structure like this.
       * 
       * The keys of `this.instance.dfds` are given by the user, see {@link g3.Loader#register},
       * or automatically from {@link g3.Loader#load}.
       * @var {Object} g3.Loader.dfdsTemplate
       * @prop {object} all A deferred that is resolved when all resources for 
       *    this list are loaded
       * @prop {string[]} list An array of urls
       * @prop {object[]} defs An array of deferreds parallel to member `list`
       */
      dfdsTemplate: {
         all: null,
         list: [],
         defs: []
      },
      
      /**
       * @summary
       * Returns a unique id.
       * @desc
       * The length is controlled by the argument taht is given by an object of 
       * this class.
       * @function g3.Loader.getId
       * @param {String} idLength The length of the id
       * @param {object} context The space where the ids are compared against so 
       *    as to be unique (defaults to this window or the window of `this.defaults.parent`)
       * @return {String} A unique id
       */
      getId: function(idLength, context){
         var id;
         
         id = g3.utils.randomString(idLength, null, true);
         if(!context)
            context = window;
         if(g3.utils.type(context) == 'object')
            context = g3.utils.getWindow(context.defaults.parent);
         while($('#' + id, context).length)
            id = g3.utils.randomString(idLength, null, true);
         
         return id;
      },
      
      /**
       * @summary
       * It is filled with node ids that fail to load their url.
       * @var {object[]} errorIds
       * @memberof g3.Loader
       */
      errorIds: [],
      
      /**
       * @summary
       * A singleton static method that attaches a error handler at the window.
       * @desc
       * It stores the ids of the failed nodes to {@link g3.Loader.errorIds} 
       * and rejects the relevant deferreds with the help of the info stored in
       * the nodes about the object containing the above deferreds.
       * @function g3.Loader.error
       * @memberof g3.Loader
       * @return {boolean} True after every run
       */
      error: (function(){
         var activate = false;
         return function(enable){
            if(!activate){
               activate = true;
               window.addEventListener('error', function(e){
                  g3.Loader.errorIds.push(e.target.id);
                  //throw new g3.Error('Node(#id:' + e.target.id + ') failed to load url, see g3Loader.errorIds', 'Error.Loader.g3', new Error());
                  if(e.target.loader)
                     e.target.loader.context.instance.dfds[e.target.loader.name].defs[e.target.loader.index].reject();
               }, true);
            }
            return activate;
         };
      }()),
      
      /**
       * @summary
       * We change the way user arguments are merged with static defaults as we
       * want to erase memory effects between successive calls.
       * @var {string} options
       * @memberof g3.Loader
       */
      options: 'defaults',
      
      /**
       * @var {string} id
       * @memberof g3.Loader
       */
      id: 'Ze2X2pvVaXEorGfWzCnO2XEB',
      
      /**
       * @var {string} name
       * @memberof g3.Loader
       */
      name: 'g3.Loader',
      
      /**
       * @var {string} version
       * @memberof g3.Loader
       */
      version: '0.1',
      
      /**
       * @summary
       * [centurianii](https:/github.com/centurianii)
       * @var {string} author
       * @memberof g3.Loader
       */
      author: 'https:/github.com/centurianii',
      
      /**
       * @var {string} copyright
       * @memberof g3.Loader
       */
      copyright: 'MIT licenced'
   },
   
   /**
    * @summary 
    * Constructor.
    * @function g3.Loader.constructor
    * @return {Object} An object of this class
    */
   constructor: function(options){
      var myClass = 'Loader';
      this.instance.loadedIds = [];          // resource ids
      this.instance.dfds = {};               // deferreds per list
      this.instance.existedIds = [];         // node ids (hardcoded? different object?)
      this.instance.previous = null;         // the last name used in 'this.register()' or 'this.load()'
      this.instance.current = null;          // the current name used in 'this.register()' or 'this.load()'
      this.init(options);
      g3.Loader.error();
      this.instance.newBuild[myClass] = false;
   },
   
   prototype: {
      /**
       * @summary
       * It (re)-initializes an object.
       * @function g3.Loader#init
       * @return {Object} An object of this class
       */
      init: function(options){
         var debug = {};
            
         // 1. call functions
         /* To initiate debug: pass in 'options' a key 'debug' with value 
          * an external object! Collect results through the passed external object!
          * All functions read 'this.instance.nodes' except 'this.getNodes()'
          * which builds them by merging 'this.defaults.nodes' with 'options.nodes'!
          */
         debug['switch'] = this.switch(options, 'Loader');
         
         // 3. update 'options.debug'
         (options && (g3.utils.type(options.debug) === 'object')) && $.extend(true, options.debug, debug);
         
         // 4. store last working set of 'this.defaults'
         this.instance.lastDefaults = this.defaults;
         
         return this;
      },
      
      /**
       * @summary
       * Stores a list of resources for future loading.
       * @desc
       * User can give an empty list as 1st argument which remains immutable.
       * 
       * User can give a name as 2nd argument or leave it to the class.
       * 
       * When user gives a name the method returns `this`. If the name exists 
       * then an error is thrown. Spaces in names are replaced by underscores.
       * 
       * When the method finds a name, an object `{name: <name>, list: <list>}` 
       * is returned whose members contain the unique internal name of the list 
       * and a copy of the initial list reduced by the existed resources.
       * @function g3.Loader#register
       * @param {string[]} list A list of urls
       * @param {string} name The list's internal name
       * @return {object|string} The curent class object or the name
       */
      register: function(list, name){
         var result = self = this,
             list = [].concat(list),
             i;
         
         if(g3.utils.type(list) != 'array')
            throw new g3.Error('Provide an empty array or an array of urls', 'Error.Loader.g3', new Error());
         if(!name || (g3.utils.type(name) != 'string') || (name.trim() == '')){
            name = g3.utils.randomString(this.defaults.idLength, null, true);
            while(this.instance.dfds[name])
               name = g3.utils.randomString(this.defaults.idLength, null, true);
            result = {name: name};
         }else{
            name = name.trim().replace(/\s{1,}/g, '_');
            if(this.instance.dfds[name])
               throw new g3.Error('Name "' + name + '" is already registered', 'Error.Loader.g3', new Error());
         }
         
         this.instance.dfds[name] = {};
         collectResources(list);
         if(result !== this)
            result.list = list;
         this.instance.lastLoadedIds = [];
         this.instance.dfds[name].all = null;
         this.instance.dfds[name].list = list;
         this.instance.dfds[name].defs = [];
         
         // collects existed resource ids to 'this.instance.existedIds' & assigns 
         // unique ids to them, modifies list to full url and removes duplicates 
         // in list from existed resources
         function collectResources(){
            $('link, script', g3.utils.getWindow(self.defaults.parent).document).each(function(ndx, node){
               var $n = $(node),
                   url,
                   id,
                   i;
               
               if(node.nodeName.toUpperCase() == 'LINK')
                  url = $n.attr('href');
               else if(node.nodeName.toUpperCase() == 'SCRIPT')
                  url = $n.attr('src');
               
               if(url){
                  id = $n.attr('id');
                  url = modifyUrl(null, null, url, self.defaults.parent);
                  for(i = 0; i < list.length; i++){
                     list[i] = modifyUrl(self.defaults.prepend, self.defaults.append, list[i], self.defaults.parent);
                     if(url == list[i]){
                        if(!id){
                           id = g3.Loader.getId(self.defaults.idLength, self.defaults.parent);
                           $n.attr('id', id);
                        }
                        if(self.instance.existedIds.indexOf(id) < 0){
                           self.instance.existedIds.push(id);
                        }
                        list.splice(i, 1);
                        i--;
                     }
                  }
               }
               
            });
         }
         /*
         // keep only the part after the host
         function stripUrl(url, win){
            var re;
            
            if((g3.utils.type(url) != 'string') || (url == ''))
               return false;
            
            // 1. find containing window
            win = g3.utils.getWindow(win);
            if(!win)
               win = window;
            
            // 2. drop 'http[s]' part from 'url'
            if(/^http[s]?\/\//.test(url))
               url = url.substr(url.indexOf('/'));
            
            // 3. drop host part from 'url'
            re = new RegExp('^(//)?' + win.document.location.hostname + '/');
            if(re.test(url))
               url = url.substr(url.indexOf(win.document.location.hostname) + win.document.location.hostname.length);
            
            // 4. start 'url' with '/'
            if(url[0] != '/')
               url = '/' + url;
            
            return url;
         }
         */
         // apply user additions to paths: only '/a/path' or 'a/path' can accept 'prepend'
         function modifyUrl(prepend, append, url, win){
            var win = g3.utils.getWindow(win),
                tmp = ''
                prepend = (g3.utils.type(prepend) == 'string')? prepend.trim() : '',
                append = (g3.utils.type(append) == 'string')? append.trim() : '',
                url = url.trim();
            
            if(!win)
               win = window;
            url = url + append;
            if(!/^http[s]?:/.test(url)){
               tmp = win.document.location.protocol;
               if(!/^\/\//.test(url)){
                  url = prepend + url;
                  tmp = tmp + '//';
                  if(url[0] == '/')
                     url = url.slice(1);
                  if(url.indexOf(win.document.location.hostname) != 0)
                     tmp = tmp + win.document.location.hostname + '/';
               }
            }
               
            return tmp + url;
         }
         
         return result;
      },
      
      /**
       * @summary
       * Loads a list of resources and calls callback functions described by 
       * {@link g3.Loader.callbackTemplate}.
       * @desc
       * User can give as 1st argument either an empty array or an array of urls 
       * or it's name that has registered previously with {@link g3.Loader#register}.
       * 
       * User can give as 2nd argument a success callback object or chain this 
       * method with {@link g3.Loader#done}.
       * 
       * User can give as 3rd argument a failure callback object or chain this 
       * method with {@link g3.Loader#fail}.
       * 
       * Both methods accept one extra argument at the end of `callback.arguments` 
       * an array of the attached ids (`<script>` or `<link>`) independent of 
       * loading status, also see {@link g3.Loader.errorIds}.
       * @function g3.Loader#load
       * @param {string[]|string} list A list of urls or it's registered name
       * @param {object} success The success callback object
       * @param {object} fail The failure callback object
       * @return {object} The curent class object
       */
      load: function(list, success, fail){
         var self = this,
             tmp,
             name,
             lastLoadedIds,
             i;
         
         if(g3.utils.type(list) == 'string'){
            name = list;
            if(!this.instance.dfds[name])
               throw new g3.Error('Un-registered name "' + name + '"', 'Error.Loader.g3', new Error());
            // do NOT reload the same list!
            if(this.instance.dfds[name].all)
               throw new g3.Error('An attempt was made to re-call a already loaded list with name "' + name + '"', 'Error.Loader.g3', new Error());
            list = this.instance.dfds[name].list;
         }else if(g3.utils.type(list) == 'array'){
            tmp = this.register(list);
            name = tmp.name;
            list = tmp.list;
         }else
            throw new g3.Error('1st argument should be a registered list name or an array of urls', 'Error.Loader.g3', new Error());
         // do NOT store empty lists!
         /*if(!list.length){
            delete this.instance.dfds[name];
            delete this.instance.loadedIds[name];
            delete this.instance.existedIds[name];
            return;
         }*/
         
         // CHAIN WITH DONE-FAIL:start
         lastLoadedIds = this.instance.lastLoadedIds;
         this.instance.previous = this.instance.current;
         this.instance.current = name;
         // :end
         
         // RESOURCE LIST LOAD CONTROLLERS:start
         this.instance.dfds[name].all = new $.Deferred();
         for(i = 0; i < this.instance.dfds[name].list.length; i++){
            if(filterResource(this.instance.dfds[name].list[i]) == 'js'){
               this.instance.dfds[name].defs.push(new $.Deferred());
               appendJs(this.instance.dfds[name].list[i], i);
            }else if(filterResource(this.instance.dfds[name].list[i]) == 'css'){
               this.instance.dfds[name].defs.push(new $.Deferred());
               appendCss(this.instance.dfds[name].list[i], i);
            }else
               this.instance.dfds[name].defs.push(false);
         }
         // :end
         
         // THE CORE:start
         if(this.instance.previous)
            this.instance.dfds[this.instance.previous].all.done(apply).fail(failCall);
         else
            apply();
         //:end
         
         function apply(){
            var arr = [],
                i;
            
            for(i = 0; i < self.instance.dfds[name].list.length; i++){
               if(g3.utils.type(self.instance.dfds[name].defs[i]) == 'object')
                  arr.push(self.instance.dfds[name].defs[i]);
            }
            $.when.apply($, arr).done(successCall).fail(failCall);
         }
         
         function successCall(){
            var context = (success && success.context)? success.context : g3.utils.getWindow(self.defaults.parent),
                args = (success && g3.utils.type(success.arguments) == 'array')? success.arguments : [],
                i;
            
            for(i = 0; i < self.defaults.trigger.length; i++)
               $(self.defaults.trigger[i]).trigger(self.defaults.on[1], [self.instance.lastLoadedIds]);
            
            // connect with next 'load'
            self.instance.dfds[name].all.resolve();
            
            if((g3.utils.type(success) != 'object') || !success.method)
               return;
            args.push(self.instance.lastLoadedIds);
            success.method.apply(context, args);
         }
         
         function failCall(){
            var context = (fail && fail.context)? fail.context : g3.utils.getWindow(self.defaults.parent),
                args = (fail && g3.utils.type(fail.arguments) == 'array')? fail.arguments : [],
                i;
            
            for(i = 0; i < self.defaults.trigger.length; i++)
               $(self.defaults.trigger[i]).trigger(self.defaults.on[2], [self.instance.lastLoadedIds]);
            
            // connect with next 'load'
            self.instance.dfds[name].all.reject();
            
            if((g3.utils.type(fail) != 'object') || !fail.method)
               return;
            args.push(self.instance.lastLoadedIds);
            fail.method.apply(context, args);
         }
         
         function filterResource(url){
            if(/\.js$/.test(url) || /\.js[^A-Za-z0-9\/_\.+-]/.test(url))
               return 'js';
            else if(/\.css$/.test(url) || /\.css[^A-Za-z0-9\/_\.+-]/.test(url))
               return 'css';
            else
               return 'other';
         }
         
         function appendJs(url, ndx){
            var win = g3.utils.getWindow(self.defaults.parent),
                id = g3.Loader.getId(self.defaults.idLength, self.defaults.parent);
            
            self.instance.loadedIds.push(id);
            self.instance.lastLoadedIds.push(id);
            
            g3.utils.createScriptNode({
               tag: self.defaults.script,
               src: url,
               type: 'text/javascript',
               id: id,
               win: win,
               data: {'loader': {context: self, name: name, index: ndx}},
               callback: function(){
                  this.loader.context.instance.dfds[this.loader.name].defs[this.loader.index].resolve();
               }
            });
            
            return id;
         }
         
         function appendCss(url, ndx){
            var win = g3.utils.getWindow(self.instance.parent),
                $node,
                id = g3.Loader.getId(self.defaults.idLength, self.defaults.parent);
            
            self.instance.loadedIds.push(id);
            self.instance.lastLoadedIds.push(id);
            
            $node = $('<link></link>').data('loader', {context: self, name: name, index: ndx});
            $node.attr({'rel': 'stylesheet', 'type': 'text/css', 'id': id, 'href': url});
            $node.appendTo(win.document.getElementsByTagName('head')[0]).on('load', function(){
               var loader = $(this).data('loader');
               
               loader.context.instance.dfds[loader.name].defs[loader.index].resolve();
            });
            
            return id;
         }
         
         return this;
      },
      
      /**
       * @summary
       * Calls success callback functions described by {@link g3.Loader.callbackTemplate}.
       * @desc
       * The callback function (`callback.method`) accepts one extra argument 
       * at the end of `callback.arguments` an array of the attached ids 
       * (`<script>` or `<link>`) independent of loading status, also see 
       * {@link g3.Loader.errorIds}.
       * @function g3.Loader#load
       * @param {...object} callback One or more success callback objects
       * @return {object} The curent class object
       */
      done: function(callback){
         var self = this,
             args = Array.prototype.slice.call(arguments, 0),
             name,
             lastLoadedIds = this.instance.lastLoadedIds;
         
         // THE CORE:start
         if(this.instance.current){
            name = this.instance.current;
            this.instance.dfds[this.instance.current].all.done(successCall);
         }else
            successCall();
         //:end
         
         function successCall(){
            var i;
            
            for(i = 0; i < args.length; i++)
               if((g3.utils.type(args[i]) == 'object') && args[i].method)
                  call(args[i]);
         }
         
         function call(success){
            var context = (success.context)? success.context : g3.utils.getWindow(self.defaults.parent),
                args = (g3.utils.type(success.arguments) == 'array')? success.arguments : [];
            
            if(name)
               args.push(lastLoadedIds);
            success.method.apply(context, args);
         }
         
         return this;
      },
      
      /**
       * @summary
       * Calls failure callback functions described by {@link g3.Loader.callbackTemplate}.
       * @desc
       * The callback function (`callback.method`) accepts one extra argument 
       * at the end of `callback.arguments` an array of all the attached ids 
       * (`<script>` or `<link>`) independent of loading status, also see 
       * {@link g3.Loader.errorIds}.
       * @function g3.Loader#fail
       * @param {...object} fail One or more failure callback objects
       * @return {object} The curent class object
       */
      fail: function(callback){
         var self = this,
             args = Array.prototype.slice.call(arguments, 0),
             name,
             lastLoadedIds = this.instance.lastLoadedIds;
         
         // THE CORE:start
         if(this.instance.current){
            name = this.instance.current;
            this.instance.dfds[this.instance.current].all.fail(failCall);
         }else
            failCall();
         //:end
         
         function failCall(){
            var i;
            
            for(i = 0; i < args.length; i++)
               if((g3.utils.type(args[i]) == 'object') && args[i].method)
                  call(args[i]);
         }
         
         function call(fail){
            var context = (fail.context)? fail.context : g3.utils.getWindow(self.defaults.parent),
                args = (g3.utils.type(fail.arguments) == 'array')? fail.arguments : [];
            
            if(name)
               args.push(lastLoadedIds);
            fail.method.apply(context, args);
         }
         
         return this;
      },
      
      /**
       * @summary
       * Removes objects and loaded resources.
       * @desc
       * It leaves existed resources, `this.instance.existedIds`, untouched unless 
       * if you pass argument `true` or `all` in which case, it destroys **existed**
       * urls too contained in given resource lists.
       * @function g3.Loader#destroy
       * @prop {string|boolean} all If `true` or `all` it destroys all resources 
       *    with urls contained in given resource lists of this object
       * @return {Object} An object of this class
       */
      destroy: function(){
         var self = this,
             all = ((all === true) || (all == 'all'))? true: false,
             arr = this.instance.loadedIds,
             i;
         
         if(all)
            arr = arr.concat(self.instance.existedIds);
         
         for(i = 0; i < arr.length; i++)
            $('#' + arr[i]).remove();
         
         g3.Loader.destroy(this.instance.name);
         
         return this;
      },
      
      /**
       * @function g3.Loader#toString
       * @return {String} The name of the class
       */
      toString: function(){
         return '[Object g3.Loader]';
      }
   }
});
}(window.g3 = window.g3 || {}, jQuery, window, document));

(function(g3, $, window, document, undefined){
/**
 * @summary
 * A wrapper class for different highlight projects.
 * @desc
 * It loads the project's files and handles the nodes according to the requirements
 * of each library.
 * 
 * Some notes:
 * 
 * - It does not use the _`all()`_ feature of many libraries that apply modifications
 * to every `pre` tag in page (bad feature) or the autoloading one (also bad),
 * 
 * - it works only on `pre` tags,
 * 
 * - language `unformatted` is added to remove language formations that can be 
 *   a hardcoded part of cached pages,
 * 
 * - it avoids resource re-loading on pages that have them hardcoded as it uses 
 *   {@link g3.Loader} class.
 * 
 * Overall, **it makes the transition to another library a breeze**.
 * 
 * **_A note on libraries_**: before switching to a new one call a `this.destroy()` 
 * to get rid off previous files. User argument should be a value from {@link g3.Highlight.getLibraries}.
 * 
 * **_A note on languages and themes_**: user values should be between those 
 * returned by {@link g3.Highlight.getLanguages} and {@link g3.Highlight.getThemes}.
 * 
 * **_A note on extending this class_**: you have to add code in all `switch...case` 
 * blocks and extend static resources {@link g3.Highlight.libraries}, 
 * {@link g3.Highlight.languages}, {@link g3.Highlight.themes} and {@link g3.Highlight.plugins}.
 * 
 * It supports:
 * - [Highlight](https://highlightjs.org/),
 * 
 * - [rainbow](https://craig.is/making/rainbows),
 * 
 * - [prism](https://prismjs.com/index.html),
 * 
 * - **_add yours_**!.
 * @class g3.Highlight
 * @version 0.1
 * @author https:/github.com/centurianii
 * @copyright MIT licence
 */
g3.Highlight = g3.Class(g3.hybrid('Highlight'), g3.hybridStatic('Highlight'), {
   STATIC: {
      /**
       * @summary
       * This object will become instance property `this.defaults`, see 
       * {@link g3.hybrid.defaults}.
       * @var {Object} defaults
       * @memberof g3.Highlight
       * @prop {String} name Name of stored object, should provide your own names
       * @prop {Object} parent Parent node whose children will be searched for
       * @prop {Object[]} nodes A static temporary node collection that is 
       *    filled during instance re-initialization by an external library 
       *    like jquery (see {@link g3.hybridStatic.library})
       *  @prop {String} plugins A space delimited string of all plugin names
       *    that will become prototypal methods with the names listed inside
       * @prop {string} library The name of one of the recorded libraries, see
       *    {@link g3.Highlight.getLibraries}
       * @prop {string} language The name of a supported language, see 
       *    {@link g3.Highlight.getLanguages}
       * @prop {string} theme The name of a supported theme, see 
       *    {@link g3.Highlight.getThemes}
       * @prop {integer} idLength The length of assigned ids on loaded resources
       * @prop {integer} start Line number start
       * @prop {string} loader The name of a {@link g3.Loader} object used for 
       *    resource loading in every instance of this class
       */
      defaults: {
         /* 
          * User supplied options
          * ---------------------
          */
         name: 'g3Highlight',
         parent: window.document,
         nodes: [],
         plugins: '',
         library: 'prettify', // add yours!
         language: 'generic',
         theme: 'default',
         start: 1,
         /* g3.Loader options */
         loader: 'loader',
         prepend: '',
         append: '',
         script: 'body',
         idLength: 5,
         trigger: []
         /* ---end user options--- */
      },
      
      /**
       * @summary
       * Local paths of loaded resources.
       * @desc
       * The keys of this object are taken from {@link g3.Highlight.getLibraries} 
       * and every key has a value a local path.
       * 
       * Pay attention that you should give values in {@link g3.Highlight.libraries}
       * that when combined with ones from these paths they give a valid filepath.
       * @var {Object} g3.Highlight.paths
       */
      paths: {
         'highlight': {
            prepend: '',
            append: ''
         },
         'rainbow': {
            prepend: '',
            append: ''
         },
         'prism': {
            prepend: '',
            append: ''
         },
         'syntaxhighlighter': {
            prepend: '',
            append: ''
         },
         'prettify': {
            prepend: '',
            append: ''
         }
         // add yours!
      },
      
      /**
       * @summary
       * A collection of deferreds used to observe the loading of resources per 
       * library. Don't alter it.
       * @desc
       * The keys of this object are taken from {@link g3.Highlight.getLibraries}.
       * @var {Object} g3.Highlight.dfds
       */
      dfds: {},
      
      /**
       * @summary
       * It selects a default theme from the list {@link g3.Highlight.getThemes}.
       * @var {Object} g3.Highlight.defaultThemes
       */
      defaultThemes: {
         'highlight': 'default',
         'rainbow': 'dreamweaver',
         'prism': 'prism',
         'prettify': 'prettify'
      },
      
      /**
       * @summary
       * A collection of library files.
       * @desc
       * The keys of this object are taken from {@link g3.Highlight.getLibraries}.
       * @var {Object} g3.Highlight.libraries
       */
      libraries: {
         'highlight': [
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js'
         ],
         'rainbow': [
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/js/rainbow.js'
         ],
         'prism': [
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/prism.min.js'
         ],
         'prettify': [
            'https://cdnjs.cloudflare.com/ajax/libs/prettify/r298/prettify.min.js'
         ]
         // add yours!
      },
      
      /**
       * @summary
       * A collection of language files.
       * @desc
       * The keys of this object are taken from {@link g3.Highlight.getLibraries}.
       * @var {Object} g3.Highlight.languages
       */
      languages: {
         'highlight': [
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/actionscript.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/apache.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/bash.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/coffeescript.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/cpp.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/css.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/http.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/javascript.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/json.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/markdown.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/php.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/languages/sas.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/languages/scss.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/shell.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/sql.min.js'
         ],
         'rainbow': [
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/js/language/generic.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/js/language/coffeescript.js',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/js/language/c.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/js/language/css.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/js/language/html.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/js/language/javascript.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/js/language/php.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/js/language/shell.min.js'
         ],
         'prism': [
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/components/prism-actionscript.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/components/prism-apacheconf.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/components/prism-bash.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/components/prism-coffeescript.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/components/prism-cpp.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/components/prism-css.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/components/prism-http.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/components/prism-javascript.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/components/prism-json.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/components/prism-markdown.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/components/prism-php.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/components/prism-powershell.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/components/prism-sass.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/components/prism-scss.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/components/prism-sql.min.js'
         ],
         'prettify': [
            'https://cdnjs.cloudflare.com/ajax/libs/prettify/r298/lang-basic.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/prettify/r298/lang-css.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/prettify/r298/lang-sql.min.js'
         ]
         // add yours!
      },
      
      /**
       * @summary
       * A collection of library themes.
       * @desc
       * The keys of this object are taken from {@link g3.Highlight.getLibraries}.
       * @var {Object} g3.Highlight.themes
       */
      themes: {
         'highlight': [
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/agate.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/androidstudio.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/arduino-light.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/arta.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/ascetic.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-cave-dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-cave-light.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-dune-dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-dune-light.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-estuary-dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-estuary-light.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-forest-dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-forest-light.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-heath-dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-heath-light.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-lakeside-dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-lakeside-light.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-plateau-dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-plateau-light.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-savanna-dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-savanna-light.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-seaside-dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-seaside-light.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-sulphurpool-dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-sulphurpool-light.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atom-one-dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atom-one-light.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/brown-paper.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/brown-papersq.png',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/codepen-embed.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/color-brewer.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/darcula.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/darkula.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/default.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/docco.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/dracula.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/far.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/foundation.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/github-gist.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/github.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/googlecode.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/grayscale.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/gruvbox-dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/hopscotch.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/hybrid.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/idea.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/ir-black.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/kimbie.dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/kimbie.light.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/magula.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/mono-blue.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/monokai-sublime.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/monokai.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/obsidian.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/ocean.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/paraiso-dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/paraiso-light.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/pojoaque.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/purebasic.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/qtcreator_dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/qtcreator_light.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/railscasts.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/rainbow.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/routeros.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/school-book.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/solarized-dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/solarized-light.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/sunburst.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/tomorrow-night-blue.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/tomorrow-night-bright.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/tomorrow-night-eighties.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/tomorrow-night.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/tomorrow.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/vs.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/vs2015.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/xcode.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/xt256.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/zenburn.min.css'
         ],
         'rainbow': [
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/themes/all-hallows-eve.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/themes/blackboard.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/themes/dreamweaver.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/themes/espresso-libre.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/themes/github.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/themes/kimbie-dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/themes/kimbie-light.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/themes/monokai.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/themes/obsidian.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/themes/paraiso-dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/themes/paraiso-light.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/themes/pastie.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/themes/solarized-dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/themes/solarized-light.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/themes/sunburst.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/themes/tomorrow-night.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/themes/tricolore.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/themes/twilight.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/themes/zenburnesque.min.css'
         ],
         'prism': [
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/themes/prism-coy.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/themes/prism-dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/themes/prism-funky.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/themes/prism-okaidia.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/themes/prism-solarizedlight.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/themes/prism-tomorrow.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/themes/prism-twilight.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/themes/prism.min.css'
         ],
         'prettify': [
            '/g3/lib/plugins/g3Highlight/prettify/prettify-default.css',
            '/g3/lib/plugins/g3Highlight/prettify/prettify-desert.css',
            '/g3/lib/plugins/g3Highlight/prettify/prettify-doxy.css',
            '/g3/lib/plugins/g3Highlight/prettify/prettify-sons-of-obsidian.css',
            '/g3/lib/plugins/g3Highlight/prettify/prettify-sunburst.css'
         ]
         // add yours!
      },
      
      /**
       * @summary
       * A collection of library plugins.
       * @desc
       * The keys of this object are taken from {@link g3.Highlight.getLibraries}.
       * @var {Object} g3.Highlight.plugins
       */
      plugins: {
         'highlight': [],
         'rainbow': [],
         'prism': [
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/plugins/line-numbers/prism-line-numbers.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/plugins/line-numbers/prism-line-numbers.min.js'
         ],
         'prettify': []
         // add yours!
      },
      
      /**
       * @summary
       * A collection of key-values per library used in resource filtering.
       * @desc
       * The keys of this object are taken from {@link g3.Highlight.getLibraries} 
       * and every key has as value an object used to filter the resources:
       * ``` javascript
       * {
       *    languages: <2nd path from last in paths> ,
       *    themes: <2nd path from last in paths>,
       *    plugins: <a unique string in path>
       * }
       * ```
       * @var {Object} g3.Highlight.resourceFilterKeys
       */
      resourceFilterKeys: {
         'highlight': {
            languages: 'languages',
            themes: 'styles',
            plugins: 'plugins'
         },
         'rainbow': {
            languages: 'language',
            themes: 'themes',
            plugins: 'plugins'
         },
         'prism': {
            languages: 'components',
            themes: 'themes',
            plugins: 'plugins'
         },
         'prettify': {
            languages: 'prettify',
            themes: 'prettify',
            plugins: 'prettify'
         }
      },
      
      /**
       * @summary
       * List of supported libraries.
       * @var {string[]} g3.Highlight.getLibraries
       */
      getLibraries: function(){
         return ['highlight', 'rainbow', 'prism', 'prettify'];
      },
      
      /**
       * @summary
       * Returns an array of supported languages for the selected library or, an
       * empty array.
       * @desc
       * Every language comes from the last part of the filepath/url as it is 
       * given in {@link g3.Highlight.libraries}.
       * 
       * We added language `unformatted` to support unformat actions on 
       * pre-formatted `pre` blocks whose contents are replaced by their text 
       * (**attention:**  it destroys existed formations but not the g3.Highlight 
       * object).
       * @function g3.Highlight.getLanguages
       * @param {string} library A key in {@link g3.Highlight.getLibraries}
       * @return {string[]} An array of supported languages
       */
      getLanguages: function(library){ 
         var result = ['unformatted'],
             arr = g3.Highlight.languages[library],
             i,
             tmp;
         
         for(i = 0; i < arr.length; i++){
            if(/\.js$/.test(arr[i]) && ((tmp = new RegExp('\\/' + g3.Highlight.resourceFilterKeys[library].languages + '\\/(.*?)\\.', 'i').exec(arr[i])) !== null)){
               switch(library){
                  case 'prism':
                     result.push(tmp[1].slice(tmp[1].indexOf('-') + 1));
                     break;
                  // add yours!
                  case 'prettify':
                     result.push(tmp[1].slice(tmp[1].indexOf('-') + 1));
                     break;
                  default:
                     result.push(tmp[1]);
               }
            }
         }
         
         // add some special languages
         switch(library){
            case 'prism':
               result.push('none');
               break;
            case 'prettify':
               result.push('generic');
               break;
            // add yours!
         }
         
         return result;
      },
      
      /**
       * @summary
       * Returns an array of a language url for a given language and library.
       * @desc
       * It reverses {@link g3.Highlight.getLanguages}.
       * @function g3.Highlight.languageUrl
       * @param {string} language A key in {@link g3.Highlight.getLanguages}
       * @param {string} library A key in {@link g3.Highlight.getLibraries}
       * @return {string[]} An array of a language url
       */
      languageUrl: function(language, library){
         var l = [],
             i;
         
         for(i = 0; i < g3.Highlight.languages[library].length; i++)
            if(g3.Highlight.filterResource(g3.Highlight.languages[library][i], language, library))
               l.push(g3.Highlight.languages[library][i]);
         
         return l;
      },

      /**
       * @summary
       * Returns an array of supported themes for the selected library or, an
       * empty array.
       * @desc
       * Every theme comes from the last part of the filepath/url as it is given 
       * in {@link g3.Highlight.themes}.
       * @function g3.Highlight.getThemes
       * @param {string} library A key in {@link g3.Highlight.getLibraries}
       * @return {string[]} An array of supported themes
       */
      getThemes: function(library){
         var result = ['default'],
             arr = g3.Highlight.themes[library],
             i,
             tmp;
         
         for(i = 0; i < arr.length; i++){
            if(/\.css$/.test(arr[i]) && ((tmp = new RegExp('\\/' + g3.Highlight.resourceFilterKeys[library].themes + '\\/(.*?)\\.', 'i').exec(arr[i])) !== null)){
               switch(library){
                  case 'prism':
                     result.push(tmp[1].slice(tmp[1].indexOf('-') + 1));
                     break;
                  case 'prettify':
                     tmp = tmp[1].slice(tmp[1].indexOf('/') + 1);
                     tmp = tmp.slice(tmp.indexOf('-') + 1);
                     if(tmp != 'default')
                        result.push(tmp.slice(tmp.indexOf('-') + 1));
                     break;
                  // add yours!
                  default:
                     result.push(tmp[1]);
               }
            }
         }
         
         return result;
      },
      
      /**
       * @summary
       * Returns an array of a theme url for a given theme and library.
       * @desc
       * It reverses {@link g3.Highlight.getThemes}.
       * @function g3.Highlight.themeUrl
       * @param {string} theme A key in {@link g3.Highlight.getThemes}
       * @param {string} library A key in {@link g3.Highlight.getLibraries}
       * @return {string[]} An array of a theme url
       */
      themeUrl: function(theme, library){
         var t = [],
             i;
         
         for(i = 0; i < g3.Highlight.themes[library].length; i++)
            if(g3.Highlight.filterResource(g3.Highlight.themes[library][i], theme, library))
               t.push(g3.Highlight.themes[library][i]);
         
         return t;
      },
      
      /**
       * @summary
       * Returns an array of supported plugins for the selected library or, an
       * empty array.
       * @desc
       * Every plugin comes from the last part of the filepath/url as it is given 
       * in {@link g3.Highlight.plugins}.
       * @function g3.Highlight.getPlugins
       * @param {string} library A key in {@link g3.Highlight.getLibraries}
       * @return {string[]} An array of supported plugins
       */
      getPlugins: function(library){ 
         var result = [],
             arr = g3.Highlight.plugins[library],
             i,
             tmp;
         
         for(i = 0; i < arr.length; i++){
            if(/\.js$/.test(arr[i]) && (new RegExp('\\/' + g3.Highlight.resourceFilterKeys[library].plugins + '\\/', 'i').test(arr[i]))){
               switch(library){
                  case 'prism':
                     tmp = arr[i].slice(arr[i].lastIndexOf('/') + 1);
                     tmp = tmp.slice(0, tmp.indexOf('.'));
                     result.push(tmp.slice('prism-'.length));
                     break;
                  // add yours!
               }
            }
         }
         switch(library){
            case 'prettify':
               result.push('line-numbers');
               break;
            // add yours!
         }
         
         return result;
      },
      
      /**
       * @summary
       * Returns an array of plugin urls for a given plugin string and library.
       * @desc
       * It reverses {@link g3.Highlight.getPlugins}.
       * @function g3.Highlight.pluginUrl
       * @param {string} plugins A space delimited string of plugins taken from 
       *    {@link g3.Highlight.getPlugins}
       * @param {string} library A key in {@link g3.Highlight.getLibraries}
       * @return {string[]} An array of plugin urls
       */
      pluginUrl: function(plugins, library){
         var pluginList = [],
             p = [],
             i, 
             j;
         
         pluginList = plugins.split(' ');
         for(i = 0; i < pluginList.length; i++){
            pluginList[i] = pluginList[i].trim();
            if(pluginList[i] == ''){
               pluginList.splice(i, 1);
               i--;
            }
         }
         
         for(i = 0; i < pluginList.length; i++){
            for(j = 0; j < g3.Highlight.plugins[library].length; j++){
               if(g3.Highlight.filterResource(g3.Highlight.plugins[library][j], pluginList[i], library))
                  p.push(g3.Highlight.plugins[library][j]);
            }
         }
         
         return p;
      },
      
      /**
       * @summary
       * It filters url paths against a search string and returns true/false.
       * @desc
       * Argument `against` is anything from {@link g3.Highlight.getLanguages}, 
       * {@link g3.Highlight.getThemes} or {@link g3.Highlight.getPlugins}. It 
       * uses {@link g3.Highlight.resourceFilterKeys}.
       * 
       * Argument `library` comes from {@link g3.Highlight.getLibraries}.
       * 
       * It is used by the "reversed" functions {@link g3.Highlight.languageUrl},
       * {@link g3.Highlight.themeUrl} and {@link g3.Highlight.pluginUrl}.
       * @function g3.Highlight.filterResource
       * @param {string} url The url to test
       * @param {string} against The string that `url` is compared against
       * @param {string} library The library currently in use
       * @return {boolean} True if url exists in the resources that `against` 
       *    represents for a given library
       */
      filterResource: function(url, against, library){
         var tmp;
         
         if((g3.utils.type(against) != 'string') || (against == ''))
            return false;
         
         // 1. .js
         if(/\.js[^\/]*$/.test(url)){
            
            // 1.1. .js for languages
            if((tmp = new RegExp('\\/' + g3.Highlight.resourceFilterKeys[library].languages + '\\/(.*?)\\.[^\\/]*$', 'i').exec(url)) !== null){
               if(tmp[1] == against)
                  return true;
               // search more...
               switch(library){
                  case 'rainbow':
                     if(tmp[1] == 'generic')
                        return true;
                     break;
                  case 'prism':
                     if(tmp[1] == 'prism-' + against)
                        return true;
                     break;
                  case 'prettify':
                     if(tmp[1].indexOf(against) > -1)
                        return true;
                     break;
                  // add yours!
               }
               // landed here? ...returns false at end!
            
            // 1.2. .js for plugins
            }else if(new RegExp('\\/' + g3.Highlight.resourceFilterKeys[library].plugins + '\\/', 'i').exec(url) !== null){
               switch(library){
                  case 'prism':
                     if(url.indexOf(against) > -1)
                        return true;
                     break;
                  case 'prettify':
                     break;
                  // add yours!
               }
               // landed here? ...returns false at end!
            }
            // landed here? ...returns false at end!
         
         // 2. .css
         }else if(/\.css[^\/]*$/.test(url)){
            if((tmp = new RegExp('\\/' + g3.Highlight.resourceFilterKeys[library].themes + '\\/(.*?)\\.[^\\/]*$', 'i').exec(url)) !== null){
               
               // 2.1 .css for themes
               if(tmp[1] == against)
                  return true;
               // search more...
               switch(library){
                  case 'rainbow':
                     if((against == 'default') && (tmp[1] == g3.Highlight.defaultThemes['rainbow']))
                        return true;
                     break;
                  case 'prism':
                     if(tmp[1] == 'prism-' + against)
                        return true;
                     if((against == 'default') && (tmp[1] == g3.Highlight.defaultThemes['prism']))
                        return true;
                     break;
                  case 'prettify':
                     if(tmp[1].indexOf(against) > -1)
                        return true;
                     break;
                  // add yours!
               }
               // landed here? ...returns false at end!
            }else if((tmp = new RegExp('\\/' + g3.Highlight.resourceFilterKeys[library].plugins + '\\/(.*?)\\.[^\\/]*$', 'i').exec(url)) !== null){
               
               // 2.2 .css for plugins
               if(tmp[1] == against)
                  return true;
               // search more...
               switch(library){
                  case 'prism':
                     if(tmp[1].indexOf(against) > -1)
                        return true;
                     break;
                  // add yours!
               }
               // landed here? ...returns false at end!
            }
            // landed here? ...returns false at end!
         }
         return false;
      },
      
      /**
       * @summary
       * Returns or destroys a unique {@link g3.Loader} object.
       * @desc
       * Pass string `destroy` to destroy this hidden object that is used from 
       * an object `g3.Highlight`.
       * 
       * Pass any other string as a name of the {@link g3.Loader} object.
       * 
       * It's up to you to decide the form of connection:
       * 
       * 1) one object `g3.Highlight` that stores it's resources to one object of
       *    `g3.Loader` or,
       * 
       * 2) many-to-one.
       * 
       * In case (2), the destroy of one `g3.Highlight` object destroys all 
       * resources of other objects too.
       * @function g3.Highlight.loader
       * @param {string} action The name of the loader or the string `destroy`
       * @return {object} A unique {@link g3.Loader} object
       */
      loader: (function(){
         var loader;
         
         return function(action){
            if(action === 'destroy'){
               loader = null;
               return loader;
            }else{
               if(!loader)
                  loader = g3.Loader({name: action});
               return loader;
            }
         }
      })(),
      
      /**
       * @var {string} id
       * @memberof g3.Highlight
       */
      id: 'bDpe2bmnlsZTz7TEMJ4Y0FUq',
      
      /**
       * @var {string} name
       * @memberof g3.Highlight
       */
      name: 'g3.Highlight',
      
      /**
       * @var {string} version
       * @memberof g3.Highlight
       */
      version: '0.1',
      
      /**
       * @summary
       * [centurianii](https:/github.com/centurianii)
       * @var {string} author
       * @memberof g3.Highlight
       */
      author: 'https:/github.com/centurianii',
      
      /**
       * @var {string} copyright
       * @memberof g3.Highlight
       */
      copyright: 'MIT licenced'
   },
   
   /**
    * @summary 
    * Constructor.
    * @function g3.Highlight.constructor
    * @return {Object} An object of this class
    */
   constructor: function(options){
      var myClass = 'Highlight';
      this.init(options);
      this.instance.newBuild[myClass] = false;
   },
   
   prototype: {
      /**
       * @summary
       * It (re)-initializes an object.
       * @function g3.Highlight#init
       * @return {Object} An object of this class
       */
      init: function(options){
         var debug = {};
            
         // 1. call functions
         /* To initiate debug: pass in 'options' a key 'debug' with value 
          * an external object! Collect results through the passed external object!
          * All functions read 'this.instance.nodes' except 'this.getNodes()'
          * which builds them by merging 'this.defaults.nodes' with 'options.nodes'!
          */
         debug['switch'] = this.switch(options, 'Highlight');
         debug['getNodes'] = this.getNodes(options);
         debug['build'] = this.build();
         
         // 3. update 'options.debug'
         (options && (g3.utils.type(options.debug) === 'object')) && $.extend(true, options.debug, debug);
         
         // 4. store last working set of 'this.defaults'
         this.instance.lastDefaults = this.defaults;
         
         return this;
      },
      
      /**
       * @summary
       * It (re)-initializes an object.
       * @desc
       * It should be called by {@link g3.Highlight#init}.
       * @function g3.Highlight#build
       * @return {Boolean} True, if it alters nodes
       */
      build: function(){
         var result = false,
             self = this,
             existedResources;
         
         // 1. validation rules
         validate();
         
         // 2. resource loading is pending
         if(g3.Highlight.dfds[this.defaults.library] && (g3.Highlight.dfds[this.defaults.library].state() == 'pending')){
            return result;
         }
         
         // 3. language = 'unformatted'
         result = true;
         if(this.defaults.language == 'unformatted'){
            $(self.instance.allNodes).each(function(){
               self.unFormat(this);
            });
            this.instance.allNodes = []; // we don't need this as it consumes memory of removed nodes
            return result;
         }
         
         // 4. load resources
         if(!g3.Highlight.dfds[this.defaults.library])
            g3.Highlight.dfds[this.defaults.library] = new $.Deferred();
         
         /*
          * g3.Loader REDUCES COMPLEXITY: start
          */
         g3.Highlight.loader(this.defaults.loader).
         
         init({
            prepend: g3.Highlight.paths[self.defaults.library].prepend || self.defaults.prepend,
            append: g3.Highlight.paths[self.defaults.library].append || self.defaults.append,
            script: self.defaults.script,
            idLength: self.defaults.idLength,
            trigger: self.defaults.trigger
         }).
         
         load(g3.Highlight.libraries[self.defaults.library]).
         done({method: success, context: self}).
         fail({method: fail, context: self}).
         
         load(g3.Highlight.languageUrl(self.defaults.language, self.defaults.library)).
         
         load(g3.Highlight.themeUrl(self.defaults.theme, self.defaults.library)).
         done({method: removeTheme, context: self}).
         
         load(g3.Highlight.pluginUrl(self.defaults.plugins, self.defaults.library)).
         done({method: applyLibrary, context: self}).
         done({method: applyPlugins, context: self});
         /*
          * :end
          */
         
         // 5. library load 'success'
         function success(ids){
            // nothing to do!
            if(ids.length === 0)
               return;
               
            g3.Highlight.dfds[self.defaults.library].resolve();
            
            switch(self.defaults.library){
               case 'prism':
                  $('#' + ids[0]).attr('data-manual', '');
                  break;
               // add yours!
            }
         }
         
         // 6. library load 'fail'
         function fail(ids){
            if(g3.Highlight.dfds[self.defaults.library].state() == 'pending')
               g3.Highlight.dfds[self.defaults.library].reject();
            throw new g3.Error('Couldn\'t load library "' + self.defaults.library + '"', 'Error.Highlight.g3', new Error());
         }
         
         // 7. remove previous theme
         function removeTheme(ids){
            var loaderIds = g3.Highlight.loader(self.defaults.loader).instance.loadedIds.concat(g3.Highlight.loader(self.defaults.loader).instance.existedIds),
                arr = [],
                tmp,
                i;
            
            // nothing to do!
            if(ids.length === 0)
               return;
            
            switch(self.defaults.library){
               case 'a super library!':
                  return;
               // add your library that supports multiple themes per page!
            }
            
            // lame libraries
            $('link').filter(function(ndx, el){
               var id = $(this).attr('id'),
                   tmp,
                   themes = g3.Highlight.themes[self.defaults.library],
                   found = false,
                   i;
               
               // loaded recently
               if(ids.indexOf(id) > -1)
                  return false;
               // not loaded previously
               if(loaderIds.indexOf(id) < 0){
                  return false;
               // loaded previously
               }else{
                  tmp = $(this).attr('href');
                  for(i = 0; i < themes.length; i++){
                     if((tmp.indexOf(themes[i]) > -1) || (themes[i].indexOf(tmp) > -1)){
                        found = true;
                        arr.push(id);
                        break;
                     }
                  }
               }
               return found;
            }).remove();
            
            tmp = g3.Highlight.loader(self.defaults.loader).instance.loadedIds;
            for(i = 0; i < tmp.length; i++){
               if(arr.indexOf(tmp[i]) > -1){
                  tmp.splice(i, 1);
                  i--;
               }
            }
         }
         
         // 8. apply library, language & theme
         function applyLibrary(ids){
            $(self.instance.nodes).each(function(){
               var $n = $(this);
               
               self.unFormat(this);
               $n.attr('data-lang', self.defaults.language);
               
               switch(self.defaults.library){
                  case 'highlight':
                     $n.addClass(self.defaults.language);
                     hljs.highlightBlock(this);
                     break;
                  case 'rainbow':
                     Rainbow.defer = true;
                     $n.wrapInner('<code data-language="' + self.defaults.language + '"></code>');
                     Rainbow.color($n[0]);
                     break;
                  case 'prism':
                     $n.wrapInner('<code class="language-' + self.defaults.language + '"></code>');
                     Prism.highlightAllUnder($n[0]);
                     break;
                  case 'prettify':
                     $n.addClass('full prettyprint lang-' + self.defaults.language);
                     break;
                  // add yours!
                  default:
                     throw new g3.Error('We couldn\'t reach some code for library ' + self.defaults.library, 'Error.Highlight.g3', new Error());
               }
            });
            switch(self.defaults.library){
               case 'prettify':
                  if(self.defaults.plugins.indexOf('line-numbers') < 0)
                     PR.prettyPrint();
                  break;
            }
         }
         
         // 9. apply plugins
         function applyPlugins(ids){
            
            $(self.instance.nodes).each(function(){
               var $n = $(this);
               
               if($n.attr('data-lang')){
                  switch(self.defaults.library){
                     case 'prism':
                        if(self.defaults.plugins.indexOf('line-numbers') > -1){
                           $n.addClass("line-numbers").attr('data-start', self.defaults.start).css({'counter-reset': 'linenumber ' + (self.defaults.start*1 - 1)});
                        }
                        break;
                     case 'prettify':
                        if(self.defaults.plugins.indexOf('line-numbers') > -1)
                           $n.addClass("linenums");
                        break;
                     // add yours!
                  }
               }
            });
            switch(self.defaults.library){
               case 'prettify':
                  if(self.defaults.plugins.indexOf('line-numbers') > -1)
                     PR.prettyPrint();
                  break;
            }
         }
         
         /*
          * HELPERS
          * -------
          */                  
         // validation rules for 'build()'
         function validate(){
            if(!self.validate('library', self.defaults.library))
               throw new g3.Error('User argument for key "library" should be a name from the list of supported libraries, see g3.Highlight.getLibraries', 'Error.Highlight.g3', new Error());
            if(!self.validate('language', self.defaults.language))
               throw new g3.Error('User argument for key "language" should be a name from the list of supported languages for that library, see g3.Highlight.getLanguages(library)', 'Error.Highlight.g3', new Error());
            if(!self.validate('theme', self.defaults.theme))
               throw new g3.Error('Library ' + self.defaults.library + ' does not support theme ' + self.defaults.theme, 'Error.Highlight.g3', new Error());
            $(self.instance.nodes).each(function(){
               if(!self.validate('node', this.nodeName))
                  throw new g3.Error('g3.Highlight acts only on a collection of &lt;pre&gt; tags!', 'Error.Highlight.g3', new Error());
            });
         }
         
         return result;
      },
      
      /**
       * @summary
       * A collection of validation rules for user input or node collection.
       * @desc
       * There are five categories:
       * 
       * 1) `node`,
       * 
       * 2) `library`: tests user input against {@link g3.Highlight.libraries},
       * 
       * 3) `language`: tests user input against {@link g3.Highlight.languages},
       * 
       * 4) `theme`: tests user input against {@link g3.Highlight.themes} and
       * 
       * 5) `plugin`: tests user input against {@link g3.Highlight.plugins}.
       * @function g3.Highlight#validate
       * @param {string} category A category of validation rules
       * @param {string} value A value to test the validation rules on
       * @return {boolean} True if the value passes the validation rules
       */
      validate: function(category, value){
         switch(category){
            case 'node':
               if(value.toUpperCase() == 'PRE')
                  return true;
               else
                  return false;
               break;
            case 'library':
               if((g3.Highlight.getLibraries().indexOf(value) < 0) || !g3.Highlight.libraries[value] || (g3.utils.type(g3.Highlight.libraries[value]) != 'array') || !g3.Highlight.libraries[value].length)
                  return false;
               else
                  return true;
               break;
            case 'language':
               if(g3.Highlight.getLanguages(this.defaults.library).indexOf(value) > -1)
                  return true;
               else
                  return false;
               break;
            case 'theme':
               if(g3.Highlight.getThemes(this.defaults.library).indexOf(value) > -1)
                  return true;
               else
                  return false;
               break;
            case 'plugin':
               if(g3.Highlight.getPlugins(this.defaults.library).indexOf(value) > -1)
                  return true;
               else
                  return false;
               break;
         }
         return false;
      },
      
      /**
       * @summary
       * Extracts text from formatted `<pre>` blocks including newline marks.
       * @function g3.Highlight#getText
       * @param {object} node A node reference
       * @return {string} The extracted text
       */
      getText: function(node){
         var self = this,
             $n = $(node),
             li,
             tmp;
         
         switch(self.defaults.library){
            case 'highlight':
               return $n.text();
            case 'rainbow':
               return $n.text();
            case 'prism':
               return $n.text();
            case 'prettify':
               li = $n.children('ol').children('li');
               if(li.length){
                  tmp = '';
                  li.each(function(){
                     tmp += $(this).text() + '\n';
                  });
               }else
                  tmp = $n.text();
               return tmp;
            // add yours!
         }
      },
      
      /**
       * @summary
       * Reverts changes for a specific node in `this.instance.nodes`.
       * @function g3.Highlight#unFormat
       * @param {object} node A node reference
       * @return {Object} An object of this class
       */
      unFormat: function(node){
         var self = this,
             $n = $(node),
             tmp = $n.attr('class'),
             text = self.getText(node),
             i;
         
         $n.attr('data-lang', 'unformatted');
         switch(self.defaults.library){
            case 'highlight':
               $n.attr('class', removeLanguages(tmp)).removeClass('hljs');
               $n.html(text);
               break;
            case 'rainbow':
               $n.html(text);
               break;
            case 'prism':
               $n.attr('class', g3.utils.clearString($n.attr('class'), ' ', 'language-\\w', 'line-numbers'));
               $n.html(text);
               break;
            case 'prettify':
               $n.attr('class', g3.utils.clearString($n.attr('class'), ' ', 'lang-\\w', 'full', 'linenums', 'prettyprint', 'prettyprinted'));
               $n.html(text);
               break;
            // add yours!
         }
         
         function removeLanguages(str){
            if((g3.utils.type(str) == 'string') && str.length){
               str = str.replace(/^\s+|\s+$/mg, '');
               for(i = 0; i < g3.Highlight.getLanguages(self.defaults.library).length; i++)
                  str = g3.utils.clearString(str, ' ', g3.Highlight.getLanguages(self.defaults.library)[i]);
            }
            return str;
         }
         
         return self;
      },
      
      /**
       * @summary
       * Removes object and resources. Reverts changes in `this.instance.nodes`.
       * @desc
       * Resource urls exist in {@link g3.Highlight.libraries}, 
       * {@link g3.Highlight.languages}, {@link g3.Highlight.themes} and 
       * {@link g3.Highlight.plugins}.
       * 
       * If you pass `true` or `all`, it destroys **existed** urls too which are
       * contained in the above lists and haven't been handled by {@link g3.Highlight.loader}.
       * @function g3.Highlight#destroy
       * @prop {string|boolean} all If `true` or `all` it destroys all resources 
       *    with urls contained in static resource lists of this class
       * @return {undefined}
       */
      destroy: function(all){
         var self = this,
             all = ((all === true) || (all == 'all'))? true: false,
             arr = g3.Highlight.loader(this.defaults.loader).instance.loadedIds,
             tmp;
         
         g3.Highlight.loader(this.defaults.loader).destroy(all);
         g3.Highlight.loader('destroy');
         $(self.instance.allNodes).each(function(){
            self.unFormat(this);
         });
         
         g3.Highlight.destroy(this.instance.name);
         
         return this;
      },
      
      /**
       * @function g3.Highlight#toString
       * @return {String} The name of the class
       */
      toString: function(){
         return '[Object g3.Highlight]';
      }
   }
});
}(window.g3 = window.g3 || {}, jQuery, window, document));

// connect g3.Highlight to jquery:
g3.Highlight.library('jquery');

/*
 * Add all nodes to current:
 * this.instance.nodes += this.instance.allNodes
 * ---------------------------------------------
 */
g3.Highlight.defaults.plugins += ' addBack';
g3.Highlight.plugin({
   name: 'addBack',
   /**
    * @summary
    * Adds `this.instance.allNodes` to `this.instance.nodes`.
    * @function g3.Highlight#addBack
    * @return {Object} An object of this class
    */
   addBack: function(){
      this.instance.nodes = $(this.instance.nodes).add(this.instance.allNodes).get();
      return this;
   }
});
