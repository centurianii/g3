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
       * @prop {*[]} arguments An array that is passed as arguments to the method/function
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
