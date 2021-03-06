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
