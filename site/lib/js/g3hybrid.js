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
