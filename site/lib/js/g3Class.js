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
