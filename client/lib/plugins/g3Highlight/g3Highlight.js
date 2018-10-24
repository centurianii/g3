(function(g3, $, window, document, undefined){
/**
 * @summary
 * A wrapper class for different highlight projects.
 * @desc
 * It loads the project's files and handles the nodes according to the requirements
 * of the library.
 * 
 * **_A note on libraries_**: before switching to a new one call a `this.destroy()` 
 * to get rid off previous files.
 * 
 * **_A note on languages and themes_**: user arguments should contain the first word 
 * (up to a `.` character) of the last part of a filepath/url, see 
 * {@link g3.Highlight.resources} and {@link g3.Highlight.resourceFilterKeys}.
 * 
 * **_A note on extending this class_**: all `switch...case` blocks in code that use
 * the keys from {@link g3.Highlight.resources}.
 * 
 * It supports:
 * - [Highlight](https://highlightjs.org/),
 * 
 * - [rainbow](https://craig.is/making/rainbows),
 * 
 * - **_add yours_**!.
 * @class g3.Highlight
 * @version 0.1
 * @author https:/github.com/centurianii
 * @copyright MIT licence
 */
g3.Highlight = g3.Class(g3.hybrid('Highlight'), g3.hybridStatic('Highlight'), {
   STATIC: {
      /**
       * @summary
       * This object will become instance property `this.defaults`, see 
       * {@link g3.hybrid.defaults}.
       * @var {Object} defaults
       * @memberof g3.Highlight
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
         name: 'g3Highlight',
         parent: window.document,
         nodes: [],
         plugins: '',
         library: 'highlightjs', // add yours!
         language: null,
         theme: 'default',
         /* ---end user options--- */
         /* Custom events */
         on: []
      },
      
      /**
       * @summary
       * List of supported libraries.
       * @var {string[]} g3.Highlight.libraries
       */
      libraries: ['highlightjs'],
      
      /**
       * @summary
       * Local paths of loaded resources.
       * @desc
       * The keys of this object are the same as those in {@link g3.Highlight.resources} 
       * and every key represents a library with value a local path.
       * 
       * Pay attention that you should give values in {@link g3.Highlight.resources}
       * that when combined with one from these paths they give a valid filepath.
       * @var {Object} g3.Highlight.paths
       */
      paths: {},
      
      /**
       * @summary
       * A collection of deferreds used to observe the loading of resources.
       * @desc
       * The keys of this object are the same as those in {@link g3.Highlight.resources} 
       * and every key represents a library with value an array of deferreds 
       * resolved when the relevant js files are loaded.
       * 
       * This approach allows us to have dynamic loading of javascript files; we
       * drop support for css styles as they are applied automatically by the 
       * browser's css engine.
       * @var {Object} g3.Highlight.resourceDfds
       */
      resourceDfds: {},
      
      /**
       * @summary
       * A collection of ids for loaded resourses.
       * @desc
       * The keys of this object are the same as those in {@link g3.Highlight.resources} 
       * and every key represents a library with value an array of resource ids.
       * 
       * In case we change library or a theme or we force rebuild, we can easily 
       * remove specific `<link>` or `<script>` tags.
       * @var {Object} g3.Highlight.resourceIds
       */
      resourceIds: {},
      
      /**
       * @summary
       * A collection of key-values per library used in resource filtering.
       * @desc
       * The keys of this object are the same as those in {@link g3.Highlight.resources} 
       * and every key represents a library with value an object used to filter 
       * the resources:
       * ``` javascript
       * {
       *    languages: <2nd string from last in paths> ,
       *    themes: <2nd string from last in paths>
       * }
       * ```
       * 
       * If these keys for a library, namely `languages` and `themes`, fail to 
       * correlate with the relevant strings in {@link g3.Highlight.resources} the 
       * code fails to load the proper resources!
       * 
       * Value of keys:
       * 
       * - `libraries` represents the last folder in a language filepath
       * 
       * - `themes` represents the last folder in a theme filepath.
       * @var {Object} g3.Highlight.resourceFilterKeys
       */
      resourceFilterKeys: {
         'highlightjs': {
            languages: 'languages',
            themes: 'styles'
         },
         'rainbow': {
            languages: 'language',
            themes: 'themes'
         }
      },
      
      /**
       * @summary
       * A collection of library files.
       * @desc
       * The keys of this object are the same as those in {@link g3.Highlight.resourceDfds} 
       * and {@link g3.Highlight.resourceIds} and every key represents a library
       * with value an array of resource files.
       * @var {Object} g3.Highlight.resources
       */
      resources: {
         'highlightjs': [
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/actionscript.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/apache.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/bash.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/coffeescript.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/cpp.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/css.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/http.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/javascript.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/json.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/markdown.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/php.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/shell.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/sql.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/agate.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/androidstudio.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/arduino-light.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/arta.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/ascetic.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-cave-dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-cave-light.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-dune-dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-dune-light.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-estuary-dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-estuary-light.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-forest-dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-forest-light.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-heath-dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-heath-light.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-lakeside-dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-lakeside-light.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-plateau-dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-plateau-light.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-savanna-dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-savanna-light.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-seaside-dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-seaside-light.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-sulphurpool-dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-sulphurpool-light.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atom-one-dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atom-one-light.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/brown-paper.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/brown-papersq.png',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/codepen-embed.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/color-brewer.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/darcula.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/darkula.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/default.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/docco.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/dracula.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/far.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/foundation.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/github-gist.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/github.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/googlecode.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/grayscale.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/gruvbox-dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/hopscotch.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/hybrid.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/idea.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/ir-black.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/kimbie.dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/kimbie.light.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/magula.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/mono-blue.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/monokai-sublime.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/monokai.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/obsidian.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/ocean.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/paraiso-dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/paraiso-light.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/pojoaque.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/purebasic.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/qtcreator_dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/qtcreator_light.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/railscasts.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/rainbow.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/routeros.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/school-book.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/solarized-dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/solarized-light.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/sunburst.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/tomorrow-night-blue.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/tomorrow-night-bright.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/tomorrow-night-eighties.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/tomorrow-night.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/tomorrow.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/vs.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/vs2015.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/xcode.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/xt256.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/zenburn.min.css'
         ],
         'rainbow': [
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/js/rainbow.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/js/language/coffeescript.js',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/js/language/c.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/js/language/css.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/js/language/html.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/js/language/javascript.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/js/language/php.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/js/language/shell.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/themes/all-hallows-eve.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/themes/blackboard.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/themes/dreamweaver.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/themes/espresso-libre.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/themes/github.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/themes/kimbie-dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/themes/kimbie-light.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/themes/monokai.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/themes/obsidian.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/themes/paraiso-dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/themes/paraiso-light.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/themes/pastie.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/themes/solarized-dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/themes/solarized-light.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/themes/sunburst.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/themes/tomorrow-night.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/themes/tricolore.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/themes/twilight.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/themes/zenburnesque.min.css'
         ]
         // add yours!
      },
      
      /**
       * @summary
       * Returns an array of supported languages for the selected library or, an
       * empty array.
       * @desc
       * Every language is taken from the first word of the last part of the 
       * filepath/url as it is given at {@link g3.Highlight.resources} for a 
       * specific library.
       * @function g3.Highlight.languages
       * @param {string} library A key name from {@link g3.Highlight.resources}
       * @return {string[]} An array of supported languages
       */
      languages: function(library){ 
         var result = [],
             arr = g3.Highlight.resources[library],
             i,
             tmp;
         
         for(i = 0; i < arr.length; i++){
            if(/\.js$/.test(arr[i]) && ((tmp = new RegExp('\\/' + g3.Highlight.resourceFilterKeys[library].languages + '\\/(.*?)\\.', 'i').exec(arr[i])) !== null))
                  result.push(tmp[1]);
         }
         
         return result;
      },
      
      /**
       * @summary
       * Returns an array of supported themes for the selected library or, an
       * empty array.
       * @desc
       * Every theme is taken from the first word of the last part of the 
       * filepath/url as it is given at {@link g3.Highlight.resources} for a 
       * specific library.
       * @function g3.Highlight.themes
       * @param {string} library A key name from {@link g3.Highlight.resources}
       * @return {string[]} An array of supported themes
       */
      themes: function(library){ 
         var result = [],
             arr = g3.Highlight.resources[library],
             i,
             tmp;
         
         for(i = 0; i < arr.length; i++){
            if(/\.css$/.test(arr[i]) && ((tmp = new RegExp('\\/' + g3.Highlight.resourceFilterKeys[library].themes + '\\/(.*?)\\.', 'i').exec(arr[i])) !== null))
                  result.push(tmp[1]);
         }
         
         return result;
      },
      
      /**
       * @summary
       * Returns a unique id.
       * @desc
       * The length is controlled by the argument.
       * @function g3.Highlight.getId
       * @param {String} idLength The length of the id
       * @return {String} A unique id
       */
      getId: function(idLength){
         var id;
         
         id = g3.utils.randomString(idLength, null, true);
         while($('#' + id).length)
            id = g3.utils.randomString(idLength, null, true);
         
         return id;
      },
      
      /**
       * @var {string} id
       * @memberof g3.Highlight
       */
      id: 'Tn1dYbtrAKsizce1qlQkkwTu',
      
      /**
       * @var {string} name
       * @memberof g3.Highlight
       */
      name: 'g3.Highlight',
      
      /**
       * @var {string} version
       * @memberof g3.Highlight
       */
      version: '0.1',
      
      /**
       * @summary
       * [centurianii](https:/github.com/centurianii)
       * @var {string} author
       * @memberof g3.Highlight
       */
      author: 'https:/github.com/centurianii',
      
      /**
       * @var {string} copyright
       * @memberof g3.Highlight
       */
      copyright: 'MIT licenced'
   },
   
   /**
    * @summary 
    * Constructor.
    * @function g3.Highlight.constructor
    * @return {Object} An object of this class
    */
   constructor: function(options){
      var myClass = 'Highlight';
      this.init(options);
      this.instance.newBuild[myClass] = false;
   },
   
   prototype: {
      /**
       * @summary
       * It (re)-initializes an object.
       * @function g3.Highlight#init
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
         debug['switch'] = this.switch(options, 'Highlight');
         debug['getNodes'] = this.getNodes(options);
         debug['build'] = this.build();
         debug['applyEvents'] = this.applyEvents();
         
         // 3. update 'options.debug'
         (options && (g3.utils.type(options.debug) === 'object')) && $.extend(true, options.debug, debug);
         
         // 4. store last working set of 'this.defaults'
         this.instance.lastDefaults = this.defaults;
         
         return this;
      },
      
      /**
       * @summary
       * It (re)-initializes an object.
       * @desc
       * It should be called by {@link g3.Highlight#init}.
       * @function g3.Highlight#build
       * @return {Boolean} True, if it alters nodes
       */
      build: function(){
         var result = false,
             self = this,
             i,
             tmp,
             prop;
         
         // 1. validation rules
         this.validationSet1();
         
         // 2. resource loading is pending
         if((g3.Highlight.resourceDfds[this.defaults.library] && g3.Highlight.resourceDfds[this.defaults.library]['all'] && (g3.Highlight.resourceDfds[this.defaults.library]['all'].state() == 'pending'))){
            return result;
         }
         
         // 3. load resources
         result = true;
         // 3.1. first run
         if(!g3.Highlight.resourceDfds[this.defaults.library])
            g3.Highlight.resourceDfds[this.defaults.library]= {};
         if(!g3.Highlight.resourceIds[this.defaults.library])
            g3.Highlight.resourceIds[this.defaults.library]= [];
         // 3.2. a control deferred for the requested files
         g3.Highlight.resourceDfds[this.defaults.library]['all'] = new $.Deferred();
         // 3.3. load files
         for(i = 0; i < g3.Highlight.resources[this.defaults.library].length; i++){
            prop = g3.Highlight.resources[this.defaults.library][i];
            if((filterResource(prop) == 'library') || (filterResource(prop) == 'language'))
               appendJs(prop);
            else if(filterResource(prop) == 'theme')
               appendCss(prop);
         }
         tmp = [];
         for(prop in g3.Highlight.resourceDfds[this.defaults.library]){
            if(prop != 'all')
               tmp.push(g3.Highlight.resourceDfds[this.defaults.library][prop]);
         }
         if(tmp.length)
            $.when.apply($, tmp).done(apply);
         else
            apply();
         
         // applies library formation
         function apply(){
            g3.Highlight.resourceDfds[self.defaults.library]['all'].resolve();
            $(self.instance.nodes).each(function(){
               var $n = $(this);
               
               $n.attr('data-lang', self.defaults.language);
               self.unFormat(this);
               
               switch(self.defaults.library){
                  case 'highlightjs':
                     $n.addClass(self.defaults.language);
                     hljs.highlightBlock(this);
                     $n.attr('data-lang', self.defaults.language);
                     break;
                     // add yours!
                  default:
                     throw new g3.Error('We couldn\'t reach some code for library ' + self.defaults.library, 'Error.Highlight.g3', new Error());
               }
            });
         }
         
         // filter only the resources from user arguments based on a pattern of url paths:
         // 2nd from last in path contains g3.Highlight.resourceFilterKeys[library].languages: is a language file
         // 2nd from last in path contains g3.Highlight.resourceFilterKeys[library].themes: is a theme
         // 2nd from last in path does not contains g3.Highlight.resourceFilterKeys[library].languages & 
         // the file ends to '.js': is a library file
         function filterResource(resource){
            var tmp;
            
            if(/\.js$/.test(resource)){
               if((tmp = new RegExp('\\/' + g3.Highlight.resourceFilterKeys[self.defaults.library].languages + '\\/(.*?)\\.[^\\/]*$', 'i').exec(resource)) !== null){
                  if(tmp[1] == self.defaults.language)
                     return 'language';
               }else
                  return 'library';
            }else if(/\.css$/.test(resource)){
               if(((tmp = new RegExp('\\/' + g3.Highlight.resourceFilterKeys[self.defaults.library].themes + '\\/(.*?)\\.[^\\/]*$', 'i').exec(resource)) !== null) && (tmp[1] == self.defaults.theme))
                  return 'theme';
            }
            return false;
         }
         
         // returns a real source path
         function normalizeUrl(url){
            var tmp;
            
            if(/^(http:|https:)?\/\//.test(url))
               tmp = '';
            else
               tmp = g3.Highlight.paths[self.defaults.library];
            return tmp + url;
         }
         
         // accepts paths from 'g3.Highlight.resources[library]'
         function appendCss(url){
            var win = g3.utils.getWindow(self.instance.parent),
                $node,
                id = g3.Highlight.getId(5);
            
            if(g3.Highlight.resourceDfds[self.defaults.library][url] === true)
               return;
            
            g3.Highlight.resourceDfds[self.defaults.library][url] = true;
            removeExistedCss();
            g3.Highlight.resourceIds[self.defaults.library].push(id);
            
            $node = $('<link></link>').data('highlight', {file: url, library: self.defaults.library});
            $node.attr({'rel': 'stylesheet', 'type': 'text/css', 'id': id, 'href': normalizeUrl(url)});
            $node.appendTo(win.document.getElementsByTagName('head')[0]);
         }
         
         // removes existed css files for libraries that do not support multiple themes per page!
         function removeExistedCss(){
            var arr = g3.Highlight.resourceIds[self.defaults.library],
                i,
                url,
                tmp;
            
            switch(self.defaults.library){
               case 'a super library!':
                  return;
               // add your library that supports multiple themes per page!
            }
            
            // lame libraries
            for(i = 0; i < arr.length; i++){
               if($('#' + arr[i]).length && (tmp = $('#' + arr[i]).attr('href'))){
                  url = g3.Highlight.resources[self.defaults.library].indexOf(tmp);
                  if(url > -1){
                     $('#' + arr[i]).remove();
                     arr.splice(i, 1);
                     i--;
                     // remove theme
                     url = g3.Highlight.resources[self.defaults.library][url];
                     // prepare for a new load
                     g3.Highlight.resourceDfds[self.defaults.library][url] = false;
                  }
               }
            }
         }
         
         // accepts paths from 'g3.Highlight.resources[library]'
         function appendJs(url){
            var win = g3.utils.getWindow(self.defaults.parent),
                $node,
                id = g3.Highlight.getId(5);
            
            if(g3.Highlight.resourceDfds[self.defaults.library][url] && (g3.Highlight.resourceDfds[self.defaults.library][url].state() == 'resolved'))
               return;
            
            g3.Highlight.resourceDfds[self.defaults.library][url] = new $.Deferred();
            g3.Highlight.resourceIds[self.defaults.library].push(id);
            
            g3.utils.createScriptNode({
               tag: 'body',
               src: normalizeUrl(url),
               type: 'text/javascript',
               id: id,
               win: self.defaults.parent,
               data: {'highlight': {file: url, library: self.defaults.library}},
               callback: function(){
                  g3.Highlight.resourceDfds[this.highlight.library][this.highlight.file].resolve();
               }
            });
         }
         
         return result;
      },
      
      /**
       * @summary
       * A collection of validation rules used throughout the code.
       * @function g3.Highlight#validate
       * @param {string} key A category of validation rules
       * @param {string} value A value to test the validation rules on
       * @return {boolean} True if the value passes the validation rules
       */
      validate: function(key, value){
         switch(key){
            case 'node':
               if(value.toUpperCase() == 'PRE')
                  return true;
               else
                  return false;
               break;
            case 'library':
               if(g3.Highlight.libraries.indexOf(value) > -1)
                  return true;
               else
                  return false;
               break;
            case 'language':
               if(g3.Highlight.languages(this.defaults.library).indexOf(value) > -1)
                  return true;
               else
                  return false;
               break;
            case 'resource':
               if(!g3.Highlight.resources[value] || (g3.utils.type(g3.Highlight.resources[value]) != 'array') || !g3.Highlight.resources[value].length)
                  return false;
               else
                  return true;
               break;
         }
         return false;
      },
      
      /**
       * @summary
       * Applies a collection of validation rules.
       * @desc
       * If a rule does not pass, it throws an exception.
       * @function g3.Highlight#validationSet1
       * @return {undefined}
       */
      validationSet1: function(){
         var self = this;
         
         if(!this.validate('library', this.defaults.library))
            throw new g3.Error('User argument for key "library" should be a name from the list of supported libraries, see g3.Highlight.libraries', 'Error.Highlight.g3', new Error());
         if(!this.validate('language', this.defaults.language))
            throw new g3.Error('User argument for key "language" should be a name from the list of supported languages for that library, see g3.Highlight.languages(library)', 'Error.Highlight.g3', new Error());
         if(!this.validate('resource', this.defaults.library))
            throw new g3.Error('There are no supported resources for library ' + this.defaults.library, 'Error.Highlight.g3', new Error());
         $(this.instance.nodes).each(function(){
            if(!self.validate('node', this.nodeName))
               throw new g3.Error('g3.Highlight acts only on a collection of <pre> tags!', 'Error.Highlight.g3', new Error());
         });
      },
      
      /**
       * @summary
       * Reverts changes for a specific node in `this.instance.nodes`.
       * @function g3.Highlight#unFormat
       * @param {object} node A node reference
       * @return {Object} An object of this class
       */
      unFormat: function(node){
         var self = this,
             $n = $(node),
             tmp = $n.attr('class'),
             i;
         
         switch(self.defaults.library){
            case 'highlightjs':
               $n.attr('class', removeLanguages(tmp)).removeClass('hljs').attr('data-lang', 'unformatted');
               $n.html($n.text());
               break;
               // add yours!
         }
         
         function removeLanguages(str){
            if((g3.utils.type(str) == 'string') && str.length){
               str = str.replace(/^\s+|\s+$/mg, '');
               for(i = 0; i < g3.Highlight.languages(self.defaults.library).length; i++)
                  str = g3.utils.clearString(str, ' ', g3.Highlight.languages(self.defaults.library)[i]);
            }
            return str;
         }
         
         return self;
      },
      
      /**
       * @summary
       * Reverts changes in `this.instance.nodes`.
       * @function g3.Highlight#destroy
       * @return {Object} An object of this class
       */
      destroy: function(){
         var self = this,
            arr = g3.Highlight.resourceIds[self.defaults.library],
            i;
         
         // 1. validation rules
         this.validationSet1();
         
         // 2. remove library's files
         if(g3.utils.type(arr) == 'array')
            for(i = 0; i < arr.length; i++)
               $('#' + arr[i]).remove();
         g3.Highlight.resourceDfds[this.defaults.library]= {};
         g3.Highlight.resourceIds[self.defaults.library] = [];
         
         // 3. unformat
         $(self.instance.allNodes).each(function(){
            self.unFormat(this);
         });
         
         // 4. delete object from 'g3.Highlight.instances[]'
         g3.Highlight.destroy(self.instance.name);
         
         return self;
      },
      
      /**
       * @summary
       * Handles events in `this.instance.nodes`.
       * @desc
       * It should be called by {@link g3.Highlight#init}.
       * @function g3.Highlight#applyEvents
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
       * @function g3.Highlight#toString
       * @return {String} The name of the class
       */
      toString: function(){
         return '[Object g3.Highlight]';
      }
   }
});
}(window.g3 = window.g3 || {}, jQuery, window, document));

// connect g3.Highlight to jquery:
g3.Highlight.library('jquery');

/*
 * Add all nodes to current:
 * this.instance.nodes += this.instance.allNodes
 * ---------------------------------------------
 */
g3.Highlight.defaults.plugins += ' addBack';
g3.Highlight.plugin({
   name: 'addBack',
   /**
    * @summary
    * Adds `this.instance.allNodes` to `this.instance.nodes`.
    * @function g3.Highlight#addBack
    * @return {Object} An object of this class
    */
   addBack: function(){
      this.instance.nodes = $(this.instance.nodes).add(this.instance.allNodes).get();
      return this;
   }
});
