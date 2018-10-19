(function(g3, $, window, document){
g3.headlessStatic = function(myClass){
   /**
    * The return of `g3.headlessStatic` is a supplementary object which converts 
    * to a mixin for the final defining class with the help of the class factory 
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
    * For inheritance and an explanation of why we do not use 
    * `{STATIC: {defaults: {...}}` here, see {@link g3.hybrid}.
    * @mixin g3.headlessStatic
    * @version 0.1
    * @author {@link https:/github.com/centurianii}
    * @copyright MIT licence
    */
   return {
      /*
       * The static members of an object built on g3.headless + g3.Class: g3[myClass]
       * ============================================================================
       */
       
      STATIC: {
         /** How user options are merged with defaults */
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
          * It can be altered temporarily to parents with method 
          * {@link g3.headlessStatic.inherits} (the reversed argument 
          * value is assigned to property `store`).
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
