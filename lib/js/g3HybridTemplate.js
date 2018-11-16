(function(g3, $, window, document, undefined){
/**
 * @summary
 * Public class 'g3.HybridTemplate'.
 * Replace `HybridTemplate` with your classname.
 * @desc
 * This class implements a proposal/paradigm of the use of the {@link g3.Class}
 * factory as descibed at {@link g3.hybrid}:
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
 *               buildn: function(){
 *                  // ...
 *               },
 *               toString: function(){
 *                  return '[Object g3.myClass]';
 *               },
 *               // ...
 *            }
 *         }
 *      );
 * // connect g3.myClass to jquery:
 * g3.myClass.library('jquery');
 * ```
 * 
 * INSTANCE FUNCTIONS
 * ------------------
 * -
 * 
 * PROTOTYPE METHODS
 * -----------------
 * - `g3.HybridTemplate.addLibrary`, see {@link g3.hybrid#addLibrary},
 * 
 * - `g3.HybridTemplate.to`, see {@link g3.hybrid#to},
 * 
 * - `g3.HybridTemplate.end`, see {@link g3.hybrid#end},
 * 
 * - `g3.HybridTemplate.switch`, see {@link g3.hybrid#switch},
 * 
 * - `g3.HybridTemplate.getNodes`, see {@link g3.hybrid#getNodes},
 * 
 * - `g3.HybridTemplate.toString`, see {@link g3.hybrid#toString}.
 *
 * STATIC FUNCTIONS
 * ----------------
 * - `g3.HybridTemplate.library`, see {@link g3.hybridStatic.library},
 *
 * - `g3.HybridTemplate.plugin`, see {@link g3.hybridStatic.plugin},
 *
 * - `g3.HybridTemplate.destroy`, see {@link g3.hybridStatic.destroy},
 *
 * - `g3.HybridTemplate.get`, see '{@link g3.hybridStatic.get},
 *
 * - `g3.HybridTemplate.add`, see {@link g3.hybridStatic.add},
 * 
 * - `g3.HybridTemplate.Singleton`, see {@link g3.hybridStatic.Singleton},
 * 
 * - `g3.HybridTemplate.inherits`, see {@link g3.hybridStatic.inherits}.
 * 
 * @class g3.HybridTemplate
 * @version 0.1
 * @author https:/github.com/centurianii
 * @copyright MIT licence
 */
g3.HybridTemplate = g3.Class(g3.hybrid('HybridTemplate'), g3.hybridStatic('HybridTemplate'), {
   STATIC: {
      /**
       * @summary g3.HybridTemplate.defaults
       * -----------------------------------
       * @desc 
       * Static property **`g3.HybridTemplate.defaults`**.
       * Replace `HybridTemplate` with your classname.
       * 
       * This object will become instance property `this.defaults`, see 
       * {@link g3.hybrid.defaults}.
       * @var {Object} defaults
       * @memberof g3.HybridTemplate
       * @prop {String} name Name of stored object, should provide your own names
       * @prop {Object} parent Parent node whose children will be searched for
       * @prop {Object[]} nodes A static temporary node collection that is 
       *    filled during instance re-initialization by an external library 
       *    like jquery (see {@link g3.hybridStatic.library})
       * @prop {String} plugins A space delimited string of all plugin names
       *    that will become prototypal methods with the names listed inside
       * @prop {String[]} on An array of events handled by this class
       */
      defaults: {
         /* 
          * User supplied options
          * ---------------------
          */
         name: 'g3HybridTemplate',
         parent: window.document,
         nodes: [],
         plugins: '',
         /* ---end user options--- */
         /* Custom events */
         on: []
      },
      
      /**
       * @summary g3.HybridTemplate.id
       * -----------------------------
       * @desc
       * Static property **`g3.HybridTemplate.id`**.
       * Replace `HybridTemplate` with your classname.
       * @var {string} id
       * @memberof g3.HybridTemplate
       */
      id: 'Tn1dYbtrAKsizce1qlQkkwTu',
      
      /**
       * @summary g3.HybridTemplate.name
       * -------------------------------
       * @desc
       * Static property **`g3.HybridTemplate.name`**.
       * Replace `HybridTemplate` with your classname.
       * @var {string} name
       * @memberof g3.HybridTemplate
       */
      name: 'g3.HybridTemplate',
      
      /**
       * @summary g3.HybridTemplate.version
       * ----------------------------------
       * @desc
       * Static property **`g3.HybridTemplate.version`**.
       * Replace `HybridTemplate` with your classname.
       * @var {string} version
       * @memberof g3.HybridTemplate
       */
      version: '0.1',
      
      /**
       * @summary g3.HybridTemplate.author
       * ---------------------------------
       * @desc
       * Static property **`g3.HybridTemplate.author`**.
       * Replace `HybridTemplate` with your classname.
       * @var {string} author
       * @memberof g3.HybridTemplate
       */
      author: 'https:/github.com/centurianii',
      
      /**
       * @summary g3.HybridTemplate.copyright
       * ------------------------------------
       * @desc
       * Static property **`g3.HybridTemplate.copyright`**.
       * Replace `HybridTemplate` with your classname.
       * @var {string} copyright
       * @memberof g3.HybridTemplate
       */
      copyright: 'closed licence, copyright https:/github.com/centurianii'
   },
   
   /**
    * @summary 
    * g3.HybridTemplate.constructor
    * -----------------------------
    * @desc
    * This property will become class's construction method, 
    * **`g3.HybridTemplate.constructor()`**.
    * Replace `HybridTemplate` with your classname.
    * 
    * If you use inheritance, a.k.a. this is a 2nd or greater level class, you 
    * need to explicitly call `g3.myClass.inherits(true);` as a first command 
    * before construction and `g3.myClass.inherits(false);` immediately after to 
    * avoid object storage in all parent classes or, disable storage by passing 
    * to argument-object a key `store: false`. 
    * @function g3.HybridTemplate.constructor
    * @return {Object} An object of this class
    */
   constructor: function(options){
      var myClass = 'HybridTemplate';
      // if inheritance level is n > 1 and you want object storage:
      //g3[myClass].add(this.defaults.name, this);
      this.initn(options);
      this.instance.newBuild[myClass] = false;
   },
   
   prototype: {
      /**
       * @summary 
       * g3.HybridTemplate.prototype.initn
       * ---------------------------------
       * @desc
       * This property will become class's prototype method, 
       * **`g3.HybridTemplate.prototype.initn()`**.
       * Replace `HybridTemplate` with your classname.
       * 
       * It (re)-initializes an object.
       * @function g3.HybridTemplate#initn
       * @return {Object} An object of this class
       */
      initn: function(options){
         var debug = {};
         
         // 1. If NOT called from constructor
         if(this.instance.newBuild['HybridTemplate'] === false)
            g3.HybridTemplate.Super.prototype['initn-1'].call(this, options);
            
         // 2. call functions
         /* To initiate debug: pass in 'options' a key 'debug' with value 
          * an external object! Collect results through the passed external object!
          * All functions read 'this.instance.nodes' except 'this.getNodes()'
          * which builds them by merging 'this.defaults.nodes' with 'options.nodes'!
          */
         debug['switch'] = this.switch(options, 'HybridTemplate');
         debug['getNodes'] = this.getNodes(options);
         debug['buildn'] = this.buildn();
         debug['applyEvents'] = this.applyEvents();
         
         // 3. update 'options.debug'
         (options && (g3.utils.type(options.debug) === 'object')) && $.extend(true, options.debug, debug);
         
         // 4. store last working set of 'this.defaults'
         this.instance.lastDefaults = this.defaults;
         
         return this;
      },
      
      /**
       * @summary 
       * g3.HybridTemplate.prototype.buildn
       * ----------------------------------
       * @desc
       * This property will become class's prototype method, 
       * **`g3.HybridTemplate.prototype.buildn()`**.
       * Replace `HybridTemplate` with your classname.
       * 
       * It (re)-initializes an object.
       * 
       * It should be called by {@link g3.HybridTemplate#initn}.
       * @function g3.HybridTemplate#buildn
       * @return {Boolean} True, if it alters nodes
       */
      buildn: function(){
         var result = false,
             self = this;
         
         $(self.instance.nodes).each(function(){
            var $n = $(this);
            
            //write your code here...
         });

         return result;
      },
      
      /**
       * @summary 
       * g3.HybridTemplate.prototype.destroy
       * -----------------------------------
       * @desc
       * This property will become class's prototype method, 
       * **`g3.HybridTemplate.prototype.destroy()`**.
       * Replace `HybridTemplate` with your classname.
       * 
       * Reverts changes in `this.instance.nodes` and in object's internal state.
       * @function g3.HybridTemplate#destroy
       * @return {Object} An object of this class
       */
      destroy: function(){
         var self = this;
         
         // 1. call parent
         g3.HybridTemplate.Super.prototype.destroy.call(self);
         
         /*               ||
          * ==============\/================
          * RETURN FROM INHERITANCE CHAIN...
          * ==============||================
          *               \/
          */
         
         // 2. write your code here...
         $(self.instance.allNodes).each(function(){
            var $n = $(this);
            
            //...
         });
         
         // 3. delete object from 'g3.HybridTemplate.instances[]'
         g3.HybridTemplate.destroy(self.instance.name);
         
         return self;
      },
      
      /**
       * @summary 
       * g3.HybridTemplate.prototype.applyEvents
       * ---------------------------------------
       * @desc
       * This property will become class's prototype method, 
       * **`g3.HybridTemplate.prototype.applyEvents()`**.
       * Replace `HybridTemplate` with your classname.
       * 
       * Handles events in `this.instance.nodes`.
       * 
       * It should be called by {@link g3.HybridTemplate#init}.
       * @function g3.HybridTemplate#applyEvents
       * @return {Boolean} True, if it re-assigns event handlers
       */
      applyEvents: function(){
         var result = false,
             self = this;
         
         // 1. remove event handlers
         if(!this.defaults.events){
            $(self.instance.nodes).each(function(){
               var $n = $(this);
               
               //write your code here...
            });
         }
         
         // 2. apply event handlers for events in 'this.defaults.on[]'
         if(this.defaults.events){
            $(self.instance.nodes).each(function(){
               var $n = $(this);
               
               //write your code here...
            });
         }
         
         return result;
      },
      
      /**
       * @summary 
       * g3.HybridTemplate.prototype.toString
       * ------------------------------------
       * @desc
       * This property will become class's prototype method, 
       * **`g3.HybridTemplate.prototype.toString()`**.
       *  Replace `HybridTemplate` with your classname.
       * @function g3.HybridTemplate#toString
       * @return {String} The name of the class
       */
      toString: function(){
         return '[Object g3.HybridTemplate]';
      }
   }
});
}(window.g3 = window.g3 || {}, jQuery, window, document));

// connect g3.HybridTemplate to jquery:
g3.HybridTemplate.library('jquery');

/*
 * Add all nodes to current:
 * this.instance.nodes += this.instance.allNodes
 * ---------------------------------------------
 */
g3.HybridTemplate.defaults.plugins += ' addBack';
g3.HybridTemplate.plugin({
   name: 'addBack',
   /**
    * @summary 
    * g3.HybridTemplate.prototype.addBack
    * -----------------------------------
    * @desc
    * This property will become class's prototype method, 
    * **`g3.HybridTemplate.prototype.addBack()`**.
    * Replace `HybridTemplate` with your classname.
    * 
    * Adds `this.instance.allNodes` to `this.instance.nodes`.
    * @function g3.HybridTemplate#addBack
    * @return {Object} An object of this class
    */
   addBack: function(){
      this.instance.nodes = $(this.instance.nodes).add(this.instance.allNodes).get();
      return this;
   }
});
