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
   g3.throttle = function(func, options, arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9){
      var state = {
         pid: null,
         last: 0
      };
      if(typeof func !== 'function')
         return null;
      if(!options || (typeof options.delay !== 'number'))
         return func;
      //default options.fireFirst
      if(typeof options.fireFirst === 'undefined')
         options.fireFirst = true;
      //default options.fireLast
      if(typeof options.fireLast === 'undefined')
         options.fireLast = true;
      
      //usually 'callback()' is called without arguments, a.k.a event handler!
      //but, arguments do passed through the closure above!
      //we use Function.call() instead of Function.apply() because named 
      //arguments do cover the sooo poor case of just an array argument that 
      //Function.apply() imposes(!!)
      function callback(evt){
         var elapsed = new Date().getTime() - state.last;
         function exec(){
            state.last = new Date().getTime();
            if(!options.context || (typeof options.context != 'object'))
               if(evt)
                  return func(evt, arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
               else
                  return func(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
            else
               if(evt)
                  return func.call(options.context, evt, arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
               else
                  return func.call(options.context, arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
         }
         //execute immediately
         if(elapsed > options.delay){
            if((state.last > 0) || (options.fireFirst === true))
               exec();
            else
               state.last = 1;
         //reset & re-schedule execution
         }else if (options.fireLast === true){
            clearTimeout(state.pid);
            state.pid = setTimeout(exec, options.delay - elapsed);
         }
      }
      
      return callback;
   }
}(window.g3 = window.g3 || {}, jQuery, window, document));

(function(g3, window, document, undefined){
/**
 * @constructs g3.measure
 * @summary
 * Returns an object that contains utility methods and properties that calculate 
 * the dimensions and position of an element, window, document or viewport or the 
 * value and unit in a string. 
 * @desc
 * In case of a number object, it behaves as in the case of a string. 
 * 
 * When the passed argument is:
 * 
 * - `window.screen` or `"screen"`: it returns `{width: <value>, height: <value>}`,
 * 
 * - `"viewport"`: returns `{left: <value>, top: <value>, width: <value>, height: <value>}`,
 *      `left` and `top` values are measured from document respective edges and 
 *      give the amount of scroll,
 * 
 * - `document` or `"document"`: returns `{width: <value>, height: <value>}`,
 * 
 * - a node reference: returns immediate on built the following object
 * 
 * ```
 * {
 *    outerWidth: ..., 
 *    innerWidth: ..., 
 *    outerHeight: ..., 
 *    innerHeight: ..., 
 *    width: ..., 
 *    height: ..., 
 *    left: ...,              // from document left
 *    top: ...,               // from document top
 *    viewLeft:...,           // from viewport left
 *    viewTop: ...,           // from viewport top
 *    viewRight: ...,         // from viewport right
 *    viewBottom: ...,        // from viewport bottom
 *    visible: ...
 *    intersect: <function>,
 *    adjucent: <function>
 * }
 * ```
 * 
 * - number: returns object `{value: <value>, unit: undefined}`,
 * 
 * - `<string>`: returns object `{value: <value>, unit: <value>}` as it parses 
 *      numeric values from the start extracting the number from the unit part. 
 *      If there is not a unit, it uses `undefined` by default. If number can't 
 *      be found, returns null,
 * 
 * - anything else: returns `null`.
 * 
 * `outer*` values include `border + padding + content`. `inner*` values don't 
 * include border. 
 * 
 * Property `visible` is a boolean `true` if the element is visible on viewport, 
 * `false` if not or, a string that is built up from the words: `top`, `right`, 
 * `bottom` and `left` if the relevant sides of the element are visible.
 * 
 * @param {String|Object} el A string or a node reference that we want to 
 *    calculate it's dimensions and position
 * @param {Window} win A window reference or if null, the current one
 * @return {Boolean|null|Object} Depending on passed `el` argument the return 
 *    contains different values
 * @version 0.1
 * @author https:/github.com/centurianii
 * @copyright MIT licence
 */
g3.measure = function(el, win){
   if(!win || (win.self !== win) || (win.window !== win))
      win = window;

   var width,
       height,
       left,
       top,
       outerWidth,
       innerWidth,
       outerHeight,
       innerHeight,
       obj,
       tmp,
       unit;
   
   if((el === win.screen) || (el === 'screen')){
      if(el === 'screen')
         el = win.screen;
      return {'width': el.width, 'height': el.height};
   }else if(el === 'viewport'){
      left = win.document.documentElement.scrollLeft || win.document.body.parentNode.scrollLeft || win.document.body.scrollLeft || win.pageXOffset;
      top = win.document.documentElement.scrollTop || win.document.body.parentNode.scrollTop || win.document.body.scrollTop || win.pageYOffset;
      width = win.document.documentElement.clientWidth;
      height = win.document.documentElement.clientHeight;
      return {'left': left, 'top': top, 'width': width, 'height': height};
   }else if((el === win.document) || (el === 'document')){
      if(el === 'document')
         el = win.document;
      width = win.document.documentElement.scrollWidth;
      height = win.document.documentElement.scrollHeight;
      return {'width': width, 'height': height};
   }else if(el && (typeof el === 'object') && ((el.nodeType === 1) || (el.nodeType === 3))){
      outerWidth = el.offsetWidth;
      innerWidth = el.clientWidth;
      outerHeight = el.offsetHeight;
      innerHeight = el.clientHeight;
      obj = {
         'outerWidth': outerWidth,
         'innerWidth': innerWidth,
         'outerHeight': outerHeight,
         'innerHeight': innerHeight,
         
         /**
          * @summary
          * If the element is fully visible/not visible returns `true`/`false`.
          * @desc
          * For partially visible elements it returns an object: 
          * `{viewLeft: <value>, viewTop: <value>, width: <value>, height: <value>}` of 
          * the intersection between viewport and element's area which is considered that 
          * one who contains `border + padding + content`. The `width` and `height` refer 
          * to the visible area of the element.
          * 
          * If you want to calculate distances from adjucent sides of viewport see 
          * {@link g3.measure#adjucent}.
          * @function g3.measure#intersect
          * @memberof g3.measure
          * @return {Boolean|Object}
          */
         intersect: function(){return _intersect.call(this, win);},
         
         /**
          * @summary
          * If the element is not visible returns false.
          * 
          * @desc
          * For fully/partially visible elements it returns an object: 
          * `{left: <value>, top: <value>, right: <value>, bottom: <value>}` of the
          * distances between the element's area and the sides of the viewport so that 
          *  `left` counts from left side, `right` from right side etc.
          * @function g3.measure#adjucent
          * @memberof g3.measure
          * @return {false|Object}
          */
         adjucent: function(){return _adjucent.call(this, win);}
      };
      //sets 'width', 'height'
      _size.call(obj, el, win);
      //sets 'left', 'top', 'viewLeft', 'viewTop', 'viewBottom', 'viewRight'
      _position.call(obj, el, win);
      //sets 'visible'
      _visible.call(obj, win);
      return obj;
   }else if(typeof el === 'number')
      return {'value': el, 'unit': undefined};
   else if((typeof el === 'string') && (el !== '')){
      tmp = el.match(/[^\+\-\s0-9\.;]+/gi);
      if(!tmp)
         unit = undefined;
      else
         unit = tmp[0];
      tmp = parseFloat(el);
      //try to avoid this interpreter bug (or ECMA 'standard'): isNaN(null) === false! (get lost!%@)
      //although: isNaN(parseFloat(null)) === true! (correct)
      if(isNaN(tmp))
         return null;
      else
         return {'value': tmp, 'unit': unit};
   }else
      return null;
   
   function _size(el, win){
      var width, height;
      if(win.getComputedStyle){
         width = parseFloat(win.getComputedStyle(el).getPropertyValue('width'));
         height = parseFloat(win.getComputedStyle(el).getPropertyValue('height'));
      //IE<=8
      }else if(el.currentStyle){
         width = parseFloat(el.currentStyle.getAttribute('width'));
         height = parseFloat(el.currentStyle.getAttribute('height'));
      //padding errors!
      }else{
         width = this['innerWidth'];
         height = this['innerHeight'];
      }
      this['width'] = width;
      this['height'] =  height;
      return this;
   }
   
   function _position(el, win){
      //use viewport
      _inViewport.call(this, el, win);
      if(el.getBoundingClientRect){
         var view = g3.measure('viewport', win);
         this['left'] =  this['viewLeft'] + view['left'];
         this['top'] = this['viewTop'] + view['top'];
      }
      return this;
   }
   
   function _inViewport(el, win){
      if(el.getBoundingClientRect){
         var tmp = el.getBoundingClientRect();
         this['viewTop'] = tmp['top'];
         this['viewLeft'] = tmp['left'];
         this['viewBottom'] = tmp['bottom'];
         this['viewRight'] = tmp['right'];
      }else{
         var view = g3.measure('viewport', win);
         //move tree upwards
         var x = 0, y = 0;
         while(el != null){
            x += el.offsetLeft;
            y += el.offsetTop;
            el = el.offsetParent;
         }
         this['left'] =  x;
         this['top'] = y;
         this['viewTop'] = this['top'] - view['top'];
         this['viewLeft'] = this['left'] - view['left'];
         this['viewBottom'] = this['viewTop'] + this['outerHeight'];
         this['viewRight'] = this['viewLeft'] + this['outerWidth'];
      }
      return this;
   }
   
   function _visible(win){
      var view = g3.measure('viewport', win),
          result = 0;
      //x-axis collision: right, left sides
      if((this['viewTop'] < view['height']) && (this['viewBottom'] > 0)){
         if((this['viewRight'] >= 0) && (this['viewRight'] <= view['width']))
            result += 2;
         if((this['viewLeft'] >= 0) && (this['viewLeft'] <= view['width']))
            result += 8;
      }
      //y-axis collision: top, bottom sides
      if((this['viewRight'] > 0) && (this['viewLeft'] < view['width'])){
         if((this['viewTop'] >= 0) && (this['viewTop'] <= view['height']))
            result += 1;
         if((this['viewBottom'] >= 0) && (this['viewBottom'] <= view['height']))
            result += 4;
      }
      //now binary 'result' contains false or side collision with this order:
      //left-bottom-right-top
      if(result === 0)
         this.visible = false;
      else if(result === 15)
         this.visible =  true;
      else{
         var tmp, res = '';
         tmp = result & parseInt('0001', 2);
         if(Number(tmp).toString(2).slice(0, 1) === '1')
            res += 'top ';
         tmp = result & parseInt('0010', 2);
         if(Number(tmp).toString(2).slice(0, 1) === '1')
            res += 'right ';
         tmp = result & parseInt('0100', 2);
         if(Number(tmp).toString(2).slice(0, 1) === '1')
            res += 'bottom ';
         tmp = result & parseInt('1000', 2);
         if(Number(tmp).toString(2).slice(0, 1) === '1')
            res += 'left';
         res = res.replace(/^\s+|\s+$/g, '');
         this.visible = res;
      }
   }
   
   function _intersect(win){
      var visible = this.visible,
          viewport = g3.measure('viewport', win),
          viewLeft, viewTop, width, height;
      
      if(visible === true)
         return true;
      if(visible === false)
         return false;
      //left, width
      if(visible.indexOf('left') >= 0){
         viewLeft = this.viewLeft;
         if(visible.indexOf('right') >= 0)
            width = this.outerWidth;
         else
            width = viewport.width - this.viewLeft;
      }else{
         viewLeft = 0;
         if(visible.indexOf('right') >= 0)
            width = this.viewRight;
         else
            width = viewport.width;
      }
      //top, height
      if(visible.indexOf('top') >= 0){
         viewTop = this.viewTop;
         if(visible.indexOf('bottom') >= 0)
            height = this.outerHeight;
         else
            height = viewport.height - this.viewTop;
      }else{
         viewTop = 0;
         if(visible.indexOf('bottom') >= 0)
            height = this.viewBottom;
         else
            height = viewport.height;
      }
      return {'viewLeft': viewLeft, 'viewTop': viewTop, 'width': width, 'height': height};
   }
   
   function _adjucent(win){
      var visible = this.visible,
          viewport = g3.measure('viewport', win),
          left, top, right, bottom;
      
      if(visible === false)
         return false;
      if(visible === true)
         visible = 'top right bottom left';
      //left
      if(visible.indexOf('left') >= 0)
         left = this.viewLeft;
      else
         left = 0;
      //right
      if(visible.indexOf('right') >= 0)
         right = viewport.width - this.viewRight;
      else
         right = 0;
      //top
      if(visible.indexOf('top') >= 0)
         top = this.viewTop;
      else
         top = 0;
      //bottom
      if(visible.indexOf('bottom') >= 0)
         bottom = viewport.height - this.viewBottom;
      else
         bottom = 0;
      return {'left': left, 'top': top, 'right': right, 'bottom': bottom};
   }
};
}(window.g3 = window.g3 || {}, window, document));

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
