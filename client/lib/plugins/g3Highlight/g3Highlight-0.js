/********************************Class Highlight********************************
 * A class for highlighting source code based on regular expression pattern 
 * matching. It is extensible with language files and it's internal plugin 
 * mechanism allows more functionalities to be added.
 * @module {g3.Highlight}
 *
 * @version 0.1
 * @author Scripto JS Editor by Centurian Comet.
 * @copyright MIT licence.
 ******************************************************************************/
(function(g3, $, window, document){
/*
 * Add necessary functions from 'g3.utils' namespace.
 */
g3.utils = g3.utils || {};
g3.utils.type = (typeof g3.utils.type === 'function')? g3.utils.type : function (obj){
   if(obj === null)
      return 'null';
   else if(typeof obj === 'undefined')
      return 'undefined';
   return Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1].toLowerCase();
};
g3.utils.getWindow = (typeof g3.utils.getWindow === 'function')? g3.utils.getWindow : function(node){
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
g3.utils.Array = (typeof g3.utils.Array === 'object')? g3.utils.Array : {
   indexOf: function(){
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
   },
   concatR: function(){
      if (!Array.prototype.concatR){
         Array.prototype.concatR = function (){
            if ( this === undefined || this === null ){
               throw new TypeError( '"this" is null or not defined' );
            }
            var arr = Array.prototype.slice.call(arguments, 0),
                i, j;
            for(i = 0; i < arr.length; i++){
               if(g3.utils.type(arr[i]) === 'array')
                  for(j = 0; j < arr[i].length; j++)
                     Array.prototype.push(this, arr[i][j]);
               else
                  Array.prototype.push(this, arr[i]);
            }
         };
      }
   }
};
g3.utils.Array.indexOf();
g3.utils.Array.concatR();
g3.utils.clearString = (typeof g3.utils.clearString === 'function')? g3.utils.clearString : function(str, delim){
   var props, 
       arr, 
       reg,
       i;
   
   if((typeof str !== 'string') || !str || (typeof delim !== 'string') || !delim)
      return str;
   //get properties from arguments
   props = Array.prototype.slice.call(arguments, 2);
   if(props.length === 0)
      return str;
   //build regex
   for(i = 0; i < props.length; i++){
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
   for(i = 0; i < arr.length; i++){
      if(arr[i].search(reg) !== -1){
         arr.splice(i, 1);
         i--;
      }
   }
   str = arr.join(delim);
   return str;
}

/********************************Class Highlight********************************
 * Public class 'g3.Highlight'.
 * A class for highlighting source code based on regular expression pattern 
 * matching. Actually, it highlights or de-highlights every given text contained 
 * in any type of node while it maintains html entities so that display doesn't 
 * break. Especially interesting is that it allows unlimited levels of nested 
 * regular expressions in the language files resulting in unlimited levels of 
 * formatted-highlighted text!
 * @module {g3.Highlight}
 * @constructor
 * @param {Object|String}
 * - if it is a string then, the relevant named object is returned, 
 * - if it is an object then, a new object is built, stored in static array 
 *   'g3.Highlight.instances[]', instance method 'this.init()' is called and the 
 *   object is returned,
 * - if nothing of the above happens because of name conflict or no-argument 
 *   then, it throws an error.
 * @return {Object} returns an object of class g3.Highlight.
 *
 * INSTANCE METHODS
 * ----------------
 * @function {g3.Highlight.init}
 * @public
 * @param {Object|String} 'options' is the argument used during construction or  
 * during calls by an existed object or when an external library jump-in 
 * applies. In any case the following apply:
 * - if it is a string then, the relevant named object is returned, 
 * - if it is an object then, an (existed) object is re-initialized or is built,
 * - if nothing of the above happens then, it throws an error.
 * @return {Object} (Re-)Initializes and returns an object of g3.Highlight.
 *
 * @function {g3.Highlight.addLibrary}
 * It is called on object creation or during jump-ins from external libraries to 
 * a g3.Highlight object.
 * @public
 * @param {String} 'name' a name of the library that each object stores in 
 * instance property 'libraries'.
 * @param {String} 'lib' a reference of an object from a library.
 * @return {} Undefined.
 *
 * @function {g3.Highlight.to}
 * @public
 * @param {String} 'name' a name of the library whose object will be returned.
 * @return {Object} An object of a library.
 *
 * @function {g3.Highlight.end}
 * An alias of 'g3.Highlight.to()'.
 * @public
 * @param {String} 'name' a name of the library whose object will be returned.
 * @return {Object} An object of a library.
 *
 * STATIC FUNCTIONS
 * ----------------
 * @function {g3.Highlight.library}
 * It defines:
 * 1. a new plugin method '$.fn.g3.[myClass]' that accepts as 1st argument 
 *    'myClass' the name of an existed class 'g3.[myClass]' and as 2nd 'options' 
 *    the same as function 'init()' (for the 3rd argument read below),
 * 2. a new static method '$.g3.[myClass]' that returns the constructor function  
 *    under 'g3' based on argument, e.g. 'g3.[myClass]'.
 * When the plugin is called the following apply based on 'options':
 * - if it is a string then, the relevant named object is returned and depending
 *   on 3rd argument 'fill' the object's array 'this.options.nodes' is extended
 *   (added) by the new set of nodes unless if 'fill' is set to false 
 *   explicitly, 
 * - if it is an object then, a new object is built with the same behaviour in 
 *   'this.options.nodes' as above,
 * - if nothing of the above happens then, the plugin returns the class 
 *   construction function 'g3.[myClass]'.
 * @static
 * @param {String} 'lib' a name of the library which is to be extended by a new
 * method named by the second argument.
 * @return {Function} Returns the class construction function 'g3.[myClass]'.
 *
 * @function {g3.Highlight.plugin}
 * @static
 * @param {Object} 'obj' is a custom object whose functions will become instance
 * members of an object resulting in an object mixin. It is called in source 
 * when we want to extend functionality of objects and the plugin is stored in
 * static property 'g3.Highlight.plugins' with the form: {'id': obj.name, 
 * 'plugin': obj}. Every plugin object should have the property 'name' or else 
 * an error is thrown.
 * @return {Function} Returns the class construction function 'g3.Highlight'.
 *
 * @function {g3.Highlight.destroy}
 * @static
 * @param {String} 'name' the name of the object to destroy. It leaves the text 
 * formatted in purpose as there is a function to revert formatting should user 
 * wanted it to happen before.
 * @return {Function} Returns the class construction function 'g3.Highlight'.
 *
 * @function {g3.Highlight.get}
 * @static
 * @param {String} 'name' the name of the object to return.
 * @return {Object} An object of g3.Highlight.
 * It is called statically from 'g3.Highlight' or from a library plugin and in 
 * this case:
 * - it updates the library reference inside the object with 'this.addLibrary()'
 * - it extends array 'this.options.nodes' with the new set of nodes depending 
 *   on the plugin's argument 'fill'.
 *
 * @function {g3.Highlight.add}
 * It is called during object construction and adds the object to static array
 * property 'g3.Highlight.instances' with the form: {'id': obj.name, 
 * 'highlight': obj}. If the object already exists, it is not stored and an 
 * error is thrown.
 * @static
 * @param {String} 'id' the name of the object to add. 
 * @param {Object} 'obj' the object reference.
 * @return {Function} Returns the class construction function 'g3.Highlight'.
 *
 * @version 0.1
 * @author Scripto JS Editor by Centurian Comet.
 * @copyright MIT licence.
 * @reference
 ******************************************************************************/
g3.Highlight = g3.Class({
   /* 
    * MVC initial state
    * -----------------
    * the initial data state diagram
    */
   STATIC: {
      defaults: {
      /*
       * Model
       * =====
       */
         /*
          * Object
          * ------
          */
         /* name of stored object, should provide your own names */
         name: 'g3Highlight',
         
         /* the name of the plugins to attach */
         plugins: 'addBack escapeHtml',
         
         /* the url of the language files used by ajax */
         url: '../../plugins/g3Highlight/',
         
         /* allow function override of plugins: user's preference doesn't count 
            as code uses static 'g3.Highlight.defaults.override'! */
         override: false,
			
			/* nothing to load when node attribute 'data-lang' takes this value */
			noFile: 'unformatted',
         
         /*
          * Nodes
          * -----
          */
         /* parent node whose children will be searched for */
         parent: '',
                  
         /* nodes to search for, replace with your own e.g.: ['.myclass .mysubclass pre'] */
         selectors: [], //['pre', 'code', 'textarea'],
         
         /* class names of already highlighted nodes, see 'selectors' */
         formatClass: 'g3Highlight',
         
         /* tag used to highlight text portions */
         formatTag: 'span',
         
         /* class prefix of formatted nodes: user's preference doesn't count as
            code uses static 'g3.Highlight.defaults.pre'! */
         pre: 'ht-',
         
         /* automatically fill nodes by the external library */
         autoFill: true,
         
         /* a temp node collection during initialization given by an external 
          * library like jquery */
         nodes: [],
         
      /*
       * View
       * ====
       */
         /* what tag to use when formatting text on 'convert' */
         tag: 'span',
         
         /* format text with one of values: [false|true|text]; doesn't apply on 
          * already converted, see 'formatClass'; value 'text' removes all 
          * formatting of text from this object */
         convert: true,
         
         /* add/remove line numbers with one of values: [false|true] */
         lineNumbers: true,
         
         /* start line numbering value */
         start: 1,
         
      /*
       * Controller
       * ==========
       */
         /* ajax event on asynchronous communication */
         ajax: {'convert': 'convert.highlight.g3'}
      },
      
      instances: [],
      
      plugins: {},
      
      library: function(name, myClass){
         if(name === 'jquery'){
            
            $.g3 = function(myClass, options){
               if(options)
                  //calls constructor function with argument
                  return new g3[myClass](options);
               else
                  //connect the static members between the 2 libraries
                  return g3[myClass];
            };
            
            $.fn.g3 = function(myClass, options, fill){
               //1. connect library instance with the static members
               if((g3.utils.type(options) === 'null') || (g3.utils.type(options) === 'undefined'))
                  return $.g3[myClass];
               //2. return an instance of g3[myClass] based on name and update instance's options.nodes & reference to jquery
               else if(g3.utils.type(options) === 'string')
                  return g3[myClass].get(options, 'jquery', this, fill);
               //3. nothing to do
               else if(!(g3.utils.type(options) === 'object'))
                  return this;
               //4. create an instance
               if(options['destroy']){
                  g3[myClass].destroy(options['destroy']);
                  //should not delete again on repetitive re-entries!
                  delete options['destroy'];
               }
               
               //set options.nodes
               if(g3.utils.type(options.nodes) !== 'array')
                  options.nodes = [];
               if((options.autoFill === true) || ((options.autoFill !== false) && (g3[myClass].defaults.autoFill === true)))
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
      
      plugin: function(obj){
         if(g3.utils.type(obj) !== 'object')
            return this;
         
         if(!obj.name)
            throw new g3.Error('No plugin name found. Nothing stored to g3.Highlight::plugins array.', 'Error.Highlight.g3', new Error());
         
         if(g3.Highlight.plugins.hasOwnProperty(obj.name))
            throw new g3.Error('Plugin name collision. Nothing stored to g3.Highlight::plugins array.', 'Error.Highlight.g3', new Error());
         
         g3.Highlight.plugins[obj.name] = obj;
         //'name' property isn't needed any more!
         delete obj.name;
         
         return this;
      },
      
      //g3.Highlight.destroy() doesn't show the same tolerance like g3.Highlight.get()
      //it's more strict like g3.Highlight.add()
      destroy: function(name){
         var i;
         
         for(i = 0; i < g3.Highlight.instances.length; i++){
            if(g3.Highlight.instances[i].id === name){
               
               //1. destroy object
               g3.Highlight.instances[i].highlight = null;
               g3.Highlight.instances.splice(i, 1);
               
               return this;
            }
         }
         return this;
      },
      
      //get object from 'g3' namespace or from library
      //to get al the list don't supply argument
      //if one is found, it returns it as object and not as array of objects
      //if none is found, it returns null
      //when it is used from within a library you can specify two more arguments
      //which is the name of the library and its reference that will replace the
      //current one to allow object-to-library chaining!
      get: function(name){
         var tmp = [],
             libName = arguments[1], //passed implicitly by the library!
             lib = arguments[2], //passed implicitly by the library!
             fill = arguments[3], //passed implicitly by the library!
             i;
         
         if(g3.utils.type(name) === 'string')
            name = new RegExp('^' + name + '$');
         for(i = 0; i < g3.Highlight.instances.length; i++){
            if(g3.Highlight.instances[i].id.search(name) > -1)
               tmp.push(g3.Highlight.instances[i].highlight);
         }
         
         if(tmp.length === 0)
            return null;
         else{
            
            //1. called from 'g3' namespace!
            if(!libName || !lib)
               return (tmp.length === 1)? tmp[0]: tmp;
            
            //2. called from within a library!
            tmp = tmp[tmp.length - 1];
            tmp.addLibrary(libName, lib);
            
            //set tmp.options.nodes
            if(fill !== false)
               tmp.options.nodes = lib.add(tmp.options.nodes).get();
            
            return tmp;
         }
      },
      
      add: function(id, obj){
         var i;
         
         //care for overlaps: throws an error
         for(i = 0; i < g3.Highlight.instances.length; i++){
            if(g3.Highlight.instances[i].id === id)
               throw new g3.Error('Highlight instance name \'' + id + '\' overlaps existing. Nothing stored to g3.Highlight::instances array.', 'Error.Highlight.g3', new Error());
         }
         g3.Highlight.instances.push({'id': id, 'highlight': obj});
         return this;
      },
      
      key: 'ZKMOKw8MM08wmWlNQrpfIktf',
      className: 'g3.Highlight',
      version: '0.1',
      copyright: 'MIT, https:/github.com/centurianii'
   },
   
   constructor: function(options){
      if(typeof options === 'string')
         return g3.Highlight.get(options);
      
      if(g3.utils.type(options) !== 'object')
         throw new g3.Error('Highlight constructor failed. No options were given. Nothing stored to g3.Highlight::instances array.', 'Error.Highlight.g3', new Error());
      
      //destroy & delete in options
      if(options['destroy']){
         g3.Highlight.destroy(options['destroy']);
         //should not delete again on repetitive calls of 'init()'!
         delete options['destroy'];
      }
     
      //pre-initialization action
      options.name = (options.name)? options.name: g3.Highlight.defaults.name;
      
      //activate functional plugins
      var plugins = (g3.utils.type(g3.Highlight.defaults.plugins) === 'string')? g3.Highlight.defaults.plugins: null,
          tmp;
      if(plugins)
         for(tmp in g3.Highlight.plugins)
            if(plugins.indexOf(tmp) > -1)
               g3.Class.extend(g3.Highlight.prototype, g3.Highlight.plugins[tmp], g3.Highlight.defaults.override, 'function');
      
      //store object in class's list
      g3.Highlight.add(options.name, this);
      this.init(options);
   },
   
   //it should be private but it is called by external libraries!
   //only one library reference per name so it can holds the last library state!
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
   
   //continue to jquery after this
   to: function(name){
      var i;
      
      //every instance holds only one reference of a specific library
      for(i = 0; i < this.libraries.length; i++)
         if(this.libraries[i].id === name)
           return this.libraries[i].lib;
   },
   
   //continue to jquery after this
   end: function(name){
      this.to(name);
   },
   
   /*
    * Init function
    * -------------
    * object initialization
    */
   init: function(options){
      //1. it is a fresh build
      if(!this.instance){
         /*
          * MVC transient state: memorized + constants
          * ------------------------------------------
          */
         //1. switchboard
         this.options = $.extend({}, g3.Highlight.defaults, options);
         //2. constants
         this.libraries = [];
         if(!options.parent || !options.parent.nodeType)
            this.options.parent = window.document;
         this.options.name = this.options.name.replace(/^\s+|\s+$/g, '');
         //3. memory
         this.instance = {
            name: this.options.name, 
            parent: this.options.parent,
            win: g3.utils.getWindow(this.options.parent),
            firstBuilt: true,
            /* all functions read this set except getNodes() that writes to */
            $nodes: $(),
            $nodesLeft: $(),
            /* all event handlers read from this set */
            $allNodes: $()
         };

      //2. it is a method call from an existed object or, the return from a library (jquery.g3Highlight('name').init(...))
      }else if(g3.utils.type(options) !== 'object'){
         this.instance.firstBuilt = false;
         return this;
      }
      
      /*
       * MVC transient state: memorized + temporary
       * ------------------------------------------
       * temporary should be reset before processing
       */
      reset(this);
      this.options = $.extend({}, this.options, options);
      //revert to initial this.options.name|parent
      this.options.name = this.instance.name;
      this.options.parent = this.instance.parent;
      //correct some critical options that can break the code!
      if(!this.options.formatTag)
         this.options.formatTag = 'span';
      if(!this.options.pre)
         this.options.pre = 'ht-';
      //add ajax behaviour
      this.instance.eventDriven = false;
      this.instance.eventEnd = false;
      this.instance.languages = '';
      //informative only, no real use!
      this.instance.firstBuilt = false;
      
      //the 'this' reference used by privileged functions
      var self = this,
          debug = {};
		
      //synchronize function execution when ajax is used
      worker();
      
      return this;
   
      /*
       * MVC functions
       * -------------
       * the functional diagram: use of instance variables, 'this.instance' and 
       * options, 'this.options'
       */
      //private privileged function works on public instance variable 'this.options'
      //resets only temporary options which have connected functions or, resets variables after ajax events
      function reset(self){
         self.options.convert = true;
         self.options.lineNumbers = true;
      }
      
      //private privileged function
      //assigns jobs to functions by re-calculating the node set making the 
      //whole project ajax friendly, i.e. asynchronous based without altering
      //the code of existed functions involved!
      function worker(evt){
         var $nodes,
             lang,
             tmp,
             i;
         
         //1. initiate instance nodes & events & fire 1st execution cycle & return
         //to initiate debug: pass in options a key 'debug' with value an external object!
         //collect results through the passed external object!
         if(!evt){
            debug['getNodes'] = getNodes(); //builds public self.instance.$nodes
            self.instance.$nodesLeft = self.instance.$nodes;
            debug['applyEvents'] = applyEvents();
            $(self.instance.parent).trigger(self.options.ajax['convert']);
            return false;
         }
         
         //2. check for asynchronous process & initiate worker nodes for this execution cycle
         if(self.options.convert === true){
            self.instance.$nodes = $();
            self.instance.$nodesLeft.each(function(){
               $n = $(this);
               //language is defined as a node attribute, e.g. data-lang="javascript"
					//do NOT use $n.data('lang') as it stores initial attribute value of 'data-lang'!
               lang = $n.attr('data-lang');
					
               if(lang && !$n.hasClass(self.options.formatClass)){
                  if(g3.Highlight.plugins.hasOwnProperty(lang)){
                     self.instance.$nodesLeft = self.instance.$nodesLeft.not($n);
                     self.instance.$nodes = self.instance.$nodes.add($n);
                  }else{
                     self.instance.eventDriven = true;
                     if(self.instance.languages.indexOf(lang) === -1)
                           self.instance.languages += ' ' + lang;
                  }
               }
            });
         }
         
         //3. call functions (synchronous) because of lock issues on 'self.instance.$nodes'!
         debug['convert'] = convert();
         debug['applyLineNumbers'] = applyLineNumbers();
         
//g3.evaluator.getInstance().console.log('1.convert: '+debug['convert']);
//g3.evaluator.getInstance().console.log('2.eventDriven: '+self.instance.eventDriven);
//g3.evaluator.getInstance().console.log('3.eventEnd: '+self.instance.eventEnd);

         //4. fill in this.options['debug'] object
         if(g3.utils.type(self.options['debug']) === 'object'){
            g3.Class.extend(self.options['debug'], debug);
            if(!self.instance.languages || self.instance.eventEnd)
               delete self.options['debug'];
         }
         
         //5. load files (asynchronous) which leads to more execution cycles
         if(!self.instance.eventEnd && self.instance.languages){
            tmp = self.instance.languages.split(' ');
            for(i = 0; i < tmp.length; i++)
               if(tmp[i])
                  load(tmp[i]);
				self.instance.eventEnd = true;
         }
         return false;
      }
      
      //private privileged function
      function load(file){
         if(file !== self.options.noFile)
				$.ajax({
					url: self.options.url + 'lang.' + file + '.js',
					type: 'GET',
					dataType: 'text',
					success: function(data, status, xhr){
						try{
							eval(data);
							$(self.instance.parent).trigger(self.options.ajax['convert']);
						}catch(e){
							throw new g3.Error('Process ' + file + ' file error. Can\'t highlight ' + file + ' code.' +
							'\nData: ' + data + '\nStatus: ' + status + '\nxhr: ' + xhr, 'Error.Highlight.g3', new Error(e));
						}
					},
					error: function(xhr, status, errorThrown){
						throw new g3.Error('Ajax ' + file + ' file load error.\nStatus: ' +
						status + '\nxhr: ' + xhr + '\nError: ' + errorThrown, 'Error.Highlight.g3', new Error(errorThrown));
					}
				});
      }
      
      //private privileged function works on public instance variable 'this.options'
      function getNodes(){
         var result = false,
             i;
         
         if(self.options.nodes && self.options.nodes.length){
            self.instance.$nodes = $(self.options.nodes);
            self.options.nodes = [];
            result = true;
         }
         
         if((g3.utils.type(self.options.selectors) === 'array') && self.options.selectors.length){
            for(i = 0; i < self.options.selectors.length; i++){
               self.instance.$nodes = self.instance.$nodes.add($(self.options.selectors[i], self.instance.parent));
            }
            result = true;
         }
         
         if(self.instance.$nodes.length){
            self.instance.$allNodes = self.instance.$allNodes.add(self.instance.$nodes);
         }
         
         return result;
      }
      
      //private privileged function works on public instance variables 'this.instance' and 'this.options'
      function convert(){
         if(!self.options.convert || !self.instance.$nodes.length)
            return false;
         
         var result = false,
             $n,
             lang;
         
         self.instance.$nodes.each(function(){
            $n = $(this);
            lang = $n.attr('data-lang');
            
            if(lang)
               if(!$n.hasClass(self.options.formatClass) && (self.options.convert === true)){
                  //function 'worker()' should already have scaled down the 
                  //working node set based on existed language files
                  //if(g3.Highlight.plugins.hasOwnProperty(lang)){
                     $n.addClass(self.options.formatClass);
                     formatText($n, lang);
                     result = true;
                  //}
               }else if($n.hasClass(self.options.formatClass) && (self.options.convert === 'text')){
                  $n.removeClass(self.options.formatClass);
                  $n.html(self.escapeHtml($n.text()));
                  result = true;
               }
         });
         
         return result;
      }
      
      //private privileged function
      //$n should be a node of type 1, repetitive calls shouldn't reformat (see 'self.options.pre')!
      function formatText($n, lang){
         var cls = $n.attr('class');
         if(!cls || (g3.utils.type(cls) !== 'string') || !cls.length)
            cls = true;
         else
            cls = (cls.indexOf(self.options.pre) === -1);
         
         //the node has NOT been formatted before
         if(cls){
            //.......
            //'contents()' doesn't work on textareas
            $n.contents().each(function(){
               if(this.nodeType === 3)
                  $(this).replaceWith(highlight(lang, this.nodeValue));
               else if(this.nodeType === 1)
                  formatText($(this), lang);
            });
         }
      }
      
      //private privileged function
      //returns a highlighted text
      function highlight(lang, text){
         if(!g3.Highlight.plugins[lang] || !text.length)
            return text;
      
         //format of 'patterns', an array of arrays; at 0: regex, at 1: class name, 
         //at 2: start reposition or array of sub-patterns, at 3: end reposition 
         //or array of sub-patterns, at 4+: more sub-patterns
         var patterns = g3.Highlight.plugins[lang].patterns,
             matches = [], //info of sub-strings found
             cont,
             tmp;
         
         //1. find regex match indexes
         match(text, patterns, matches);
         
         //2. ascend array
         cont = true;
         while(cont){
            cont = false;
            for(i = 0; i < matches.length - 1; i++){
               if(matches[i].start > matches[i+1].start){
                  tmp = {};
                  g3.Class.extend(tmp, matches[i]);
                  g3.Class.extend(matches[i], matches[i+1]);
                  g3.Class.extend(matches[i+1], tmp);
                  cont = true;
               }
            }
         }
         
         //3. return highlighted text with special character replacement
         return combineMatches(text, matches);
      }
      /*
      //private privileged function
      function combineMatches(text, matches){
         var tmp,
             txt,
             m, //used for recursion
             next,
             i,
             j;
         
         if(!matches.length)
            return text;
         
         //1. correct the start index in all matches[i].start by subtracting matches[i].dis
         //2. replace special html character '<' with '&lt;' or even better call a plugin like 'escapeHtml()'
         //3. add the head before the first match
         tmp = self.escapeHtml(text.substr(0, matches[0].start - matches[0].dis));
         i = 0;
         while(i < matches.length){
            txt = self.escapeHtml(text.substr(matches[i].start - matches[i].dis, matches[i].length));
            next = matches[i].start + matches[i].length - matches[i].dis;
            j = i + 1,
            m = [];
            
            //4. add the matched text
            //4.i. combine all the sub-matches if they exist
            while((j < matches.length) && (matches[j].level > matches[i].level) && (matches[j].start < next)){
               m.push(matches[j]);
               j++;
            }
            if(m.length){
               tmp += '<' + self.options.formatTag + ' class="' + matches[i].cls + '">' + combineMatches(txt, m) + '</' + self.options.formatTag + '>';
               i = j;
            //4.ii. or, use the matched text
            }else{
               tmp += '<' + self.options.formatTag + ' class="' + matches[i].cls + '">' + txt + '</' + self.options.formatTag + '>';
               i++;
            }
            //5. add the tail after the match (which is the head before the next match)
            if(i < matches.length)
               tmp += self.escapeHtml(text.substr(next, matches[i].start - next - matches[i].dis));
            else
               tmp += self.escapeHtml(text.substr(next));
         }
         
         return tmp;
      }
      */
      
      //i, length: the indexes start (including)-end (not including) used in recursion
      //private privileged function
      function combineMatches(text, matches, i, length){
         var tmp = '',
             txt,
             next = 0,
             j,
             k,
             pre,
             post;
         
         if(!matches.length)
            return text;
         
         if(!i){
            i = 0;
            length = matches.length;
         }
         
         //1. correct the start index of given (sub-)text in all 'matches[i].start' by subtracting matches[i].dis
         //2. replace special html character '<' with '&lt;' or even better call a plugin like 'escapeHtml()'
         while(i < length){
            //3. add the head before the first match based or relevant character indexes
            tmp += self.escapeHtml(text.substr(next, matches[i].start - next - matches[i].dis));
            txt = self.escapeHtml(text.substr(matches[i].start - matches[i].dis, matches[i].length));
            next = matches[i].start + matches[i].length - matches[i].dis;
            j = i + 1;
            
            //4. find all higher-level indexes and do a recursion
            while((j < length) && (matches[j].level > matches[i].level) && (matches[j].start < next))
               j++;
            if(j - i > 1){
               tmp += '<' + self.options.formatTag + ' class="' + matches[i].cls + '">' + combineMatches(txt, matches, i+1, j) + '</' + self.options.formatTag + '>';
               i = j;
            //5. or, add the matched text 
            }else{
               pre = post = '';
               //5.i. if the matched text is a newline apply tag-deflation based on lower-level matches
               if(matches[i].cls === (g3.Highlight.defaults.pre + 'newline')){
                  j = i - 1;
                  k = i;
                  while(j >= 0){
                     if(matches[j].level < matches[k].level){
                        pre += '</' + self.options.formatTag + '>';
                        post = '<' + self.options.formatTag + ' class="' + matches[j].cls + '">' + post;
                        k = j;
                     }
                     j--;
                  }
               }
               tmp +=  pre + '<' + self.options.formatTag + ' class="' + matches[i].cls + '">' + txt + '</' + self.options.formatTag + '>' + post;
               i++;
            }
         }
         tmp += self.escapeHtml(text.substr(next));
         
         return tmp;
      }
      
      //repetitive matches of pattern (sub-)arrays applied on a (sub-)text
      //all function calls fill external array 'matches[]'
      //'level': the level of matches stored in 'matches[i].level' and used in 
      //'combineMatches()' to identify if recursion should start when it's value 
      //is higher than the previous one,
      //'dis': the index displacement of the start index of the found matches so 
      //they can be put in order compared with all the other because recursion 
      //on new sub-text starts at index 0; later in 'combineMatches()' we will
      //use 'matches[i].dis' to reposition start index in it's relevant position
      //in the sub-text,
      //'matches[i].start': the absolute start index of pattern inside the text
      //so that, ordering and elimination rules can apply,
      //'matches[i].sp': used in recursion only to mark a sub-array that can 
      //contain other sub-arrays of patterns.
      //private privileged function
      function match(text, p, matches, lev, dis){
         lev = (!lev)? 0: lev;
         dis = (!dis)? 0: dis;
         var m = [], //will be merged with 'matches[]'
             i, //for index
             r, //regex result object
             start_dis = 0, //index disposition at start
             end_dis = 0, //index disposition at end
             cont,
             tmp,
             j, //for index
             sp; //a sub-patterns array for recursion
         
         //1. 1st level pattern search
         for(i = 0; i < p.length; i++){
            if(g3.utils.type(p[i][2]) === 'number')
               start_dis = p[i][2];
            if(g3.utils.type(p[i][3]) === 'number')
               end_dis = p[i][3];
            while((r = p[i][0].exec(text))!== null)
               m.push({start: r.index + start_dis + dis, length: (p[i][0].lastIndex + end_dis - r.index - start_dis), cls: p[i][1], sp: i, level: lev, dis: dis});
            start_dis = 0;
            end_dis = 0;
         }
         
         //2. ascend array
         cont = true;
         while(cont){
            cont = false;
            for(i = 0; i < m.length - 1; i++)
               if(m[i].start > m[i+1].start){
                  tmp = {};
                  g3.Class.extend(tmp, m[i]);
                  g3.Class.extend(m[i], m[i+1]);
                  g3.Class.extend(m[i+1], tmp);
                  cont = true;
               }
         }
         
         //3. eliminate m: keep low-order indexes!
         tmp = [];
         //3.i. find overlaps or shortest length on same index and fill indexes array 'tmp[]'
         for(i = 0; i < m.length; i++){
            for(j = i + 1; j < m.length; j++){
               if(m[j].start > m[i].start){
                  if(m[j].start < m[i].start + m[i].length)
                     tmp.push(j);
               }else if(m[i].start > m[j].start){
                  if(m[i].start < m[j].start + m[j].length){
                     tmp.push(i);
                     break;
                  }
               //m[j].start === m[i].start
               }else if(m[j].length <= m[i].length)
                     tmp.push(j);
               else{
                  tmp.push(i);
                  break;
               }
            }
         }
         
         //3.ii. ascend array 'tmp[]'
         cont = true;
         while(cont){
            cont = false;
            for(i = 0; i < tmp.length - 1; i++)
               if(tmp[i] > tmp[i+1]){
                  j = tmp[i];
                  tmp[i] = tmp[i+1];
                  tmp[i+1] = j;
                  cont = true;
               }
         }
         
         //3.iii. clear repetitive values in indexes array 'tmp[]'
         for(i = tmp.length - 1; i > 0; i--)
            if(tmp[i] === tmp[i-1]){
               tmp.splice(i, 1);
            }
         
         //3.iv. clear array 'm[]'
         for(i = tmp.length - 1; i >= 0; i--)
            m.splice(tmp[i], 1);
         
         //4. copy by reference m->matches
         matches.concatR(m);
         
         //5. 2nd level pattern search
         //array 'm[]' might have records that refer to sub-texts and to relevant indexes of sub-patterns in 'p'
         for(i = 0; i < m.length; i++){
            tmp = p[m[i].sp]; //a sub-array
            
            //start recursion
            if(g3.utils.type(tmp[tmp.length -1]) === 'array'){
               sp = []; //we don't need non-array values!
               for(j = 0; j < tmp.length; j++)
                  if(g3.utils.type(tmp[j]) === 'array')
                     sp.push(tmp[j]);
               match(text.substr(m[i].start, m[i].length), sp, matches, lev + 1, dis + m[i].start);
            }
         }
      }
      
      //private privileged function works on public instance variables 'this.instance' and 'this.options'
      function applyLineNumbers(){
         if(!self.instance.$nodes.length)
            return false;
         
         var result = false,
             $n,
             tmp1,
             tmp2;
         
         self.instance.$nodes.each(function(){
            $n = $(this);
            
            if($n.hasClass(self.options.formatClass)){
               if(self.options.lineNumbers && !$n.children('ol').length){
                  addNumbers($n);
                  result = true;
               }else if(!self.options.lineNumbers && $n.children('ol').length){
                  tmp1 = $n.find('li');
                  tmp2 = '';
                  tmp1.each(function(){
                     tmp2 += this.innerHTML;
                  });
                  $n.html(tmp2);
                  result = true;
               }
            }
         });
         
         return result;
      }
      /*
      //private privileged function
      function wrapNewlines($n){
         var reg = /\n/g,
             $node,
             r,
             text,
             tmp,
             next;
         
         $n.contents().each(function(){
            $node = $(this);
            
            if((this.nodeType === 3) && (this.nodeValue.indexOf('\n') > -1)){
               text = this.nodeValue;
               next = 0;
               tmp = '';
               
               //while((r = reg.exec(text))!== null){
               //   tmp += text.substr(next, r.index - next) + '<span class="newline">' + text.substr(r.index, 1) + '</span>';
               //   next = r.index + 1;
               //}
               //tmp += text.substr(next);
               //$node.replaceWith(tmp);
               
               if((r = reg.exec(text))!== null){
                  tmp = text.substr(next, r.index - next) + '<span class="newline">' + text.substr(r.index, 1) + '</span>';
                  next = r.index + 1;
                  while((r = reg.exec(text))!== null){
                     tmp += text.substr(next, r.index - next) + '<span class="newline">' + text.substr(r.index, 1) + '</span>';
                     next = r.index + 1;
                  }
                  tmp += text.substr(next);
                  $node.replaceWith(tmp);
               }
            }else if((this.nodeType === 1) && !$node.hasClass('newline'))
               wrapNewlines($node);
         });
      }
      */
      //private privileged function
      function addNumbers($n){
         if($n.children('ol').length)
            return;
         
         var tmp;
         
         //1. wrap target with 'ol'
         $n.wrapInner('<ol start="' + self.options.start + '"></ol>');
         
         //2. find closest parent of every '.newline'
         $n.find('.' + g3.Highlight.defaults.pre + 'newline').parent().each(function(){
            tmp = $();
            
            //3. collect all childs of parent up to the next '.newline' including & wrap with 'li'
            $(this).contents().each(function(){
               if($(this).hasClass(g3.Highlight.defaults.pre + 'newline')){
                  tmp = tmp.add(this);
                  tmp.wrapAll('<li></li>');
                  tmp = $();
               }else
                  tmp = tmp.add(this);
            });
            
            //4. wrap rest of childs with 'li'
            if(tmp.length)
               tmp.wrapAll('<li></li>');
         });
      }
      
      //private privileged function
      function applyEvents(){
         $(self.instance.parent).on(self.options.ajax['convert'], worker);
         return true;
      }
   }
});
}(window.g3 = window.g3 || {}, jQuery, window, document));

//interface g3.Highlight to jquery:
g3.Highlight.library('jquery', 'Highlight');

g3.Highlight.plugin({
   name: 'addBack',
   /*
    * Add all nodes to current
    * ------------------------
    */
   addBack: function(){
      this.instance.$nodes = this.instance.$nodes.add(this.instance.$allNodes);
      return this;
   }
});

g3.Highlight.plugin({
   name: 'escapeHtml',
   /*
    * Add all nodes to current
    * ------------------------
    */
   escapeHtml: function(text){
      if((g3.utils.type(text) === 'string') && text.length)
         return text.replace(/</gi, '&lt;');
      else
         return text;
   }
});
