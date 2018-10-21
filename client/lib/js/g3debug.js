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
 * 2. no argument defaults to static `g3.debug.noFollow` values of what not to 
 *    search for, see {@link g3.debug.noFollow}, 
 * 
 * 3. a space delimited string of types makes them not searchable, e.g. if it is 
 *    the value `string` analysis excludes `string` types etc.
 * @param {*} obj An identifier of any type that is to be analysed
 * @param {Integer} maxDepth The maximum depth to look for; zero-based
 * @param {Boolean|null|String} noFollow Manipulates analysis on types 
 * @return {Object} A debugging object
 * @version 0.2
 * @author {@link https:/github.com/centurianii}
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
      //search prototype chain if it's not excluded from argument 'noFollow'
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
 * {@link https:/github.com/centurianii}
 * @var {String} author
 * @memberof g3.debug
 */
g3.debug.author = 'https:/github.com/centurianii';
/**
 * @summary g3.debug.copyright
 * ---------------------------
 * @desc
 * MIT licence, copyright {@link https:/github.com/centurianii}.
 * @var {String} copyright
 * @memberof g3.debug
 */
g3.debug.copyright = 'MIT licence, copyright https:/github.com/centurianii';
}(window.g3 = window.g3 || {}, jQuery, window, document));
