(function(g3, $, window, document){
/**
 * @constructs g3.headless
 * @summary
 * The return of `g3.headless` is a supplementary object which forms a root 
 * **parent** defining class with the help of the class factory {@link g3.Class}.
 * @desc
 * It provides the constructor and the default and prototype members under the 
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
          * {@link https:/github.com/centurianii}
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
          * MIT licence, copyright {@link https:/github.com/centurianii}.
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
