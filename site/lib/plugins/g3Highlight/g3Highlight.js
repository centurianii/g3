(function(g3, $, window, document, undefined){
/**
 * @summary
 * A wrapper class for different highlight projects.
 * @desc
 * It loads the project's files and handles the nodes according to the requirements
 * of each library.
 * 
 * Some notes:
 * 
 * - It does not use the _`all()`_ feature of many libraries that apply modifications
 * to every `pre` tag in page (bad feature) or the autoloading one (also bad),
 * 
 * - it works only on `pre` tags,
 * 
 * - language `unformatted` is added to remove language formations that can be 
 *   a hardcoded part of cached pages,
 * 
 * - it avoids resource re-loading on pages that have them hardcoded as it uses 
 *   {@link g3.Loader} class.
 * 
 * Overall, **it makes the transition to another library a breeze**.
 * 
 * **_A note on libraries_**: before switching to a new one call a `this.destroy()` 
 * to get rid off previous files. User argument should be a value from {@link g3.Highlight.getLibraries}.
 * 
 * **_A note on languages and themes_**: user values should be between those 
 * returned by {@link g3.Highlight.getLanguages} and {@link g3.Highlight.getThemes}.
 * 
 * **_A note on extending this class_**: you have to add code in all `switch...case` 
 * blocks and extend static resources {@link g3.Highlight.libraries}, 
 * {@link g3.Highlight.languages}, {@link g3.Highlight.themes} and {@link g3.Highlight.plugins}.
 * 
 * It supports:
 * - [Highlight](https://highlightjs.org/),
 * 
 * - [rainbow](https://craig.is/making/rainbows),
 * 
 * - [prism](https://prismjs.com/index.html),
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
       *  @prop {String} plugins A space delimited string of all plugin names
       *    that will become prototypal methods with the names listed inside
       * @prop {string} library The name of one of the recorded libraries, see
       *    {@link g3.Highlight.getLibraries}
       * @prop {string} language The name of a supported language, see 
       *    {@link g3.Highlight.getLanguages}
       * @prop {string} theme The name of a supported theme, see 
       *    {@link g3.Highlight.getThemes}
       * @prop {integer} idLength The length of assigned ids on loaded resources
       * @prop {integer} start Line number start
       * @prop {string} loader The name of a {@link g3.Loader} object used for 
       *    resource loading in every instance of this class
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
         library: 'prettify', // add yours!
         language: 'generic',
         theme: 'default',
         start: 1,
         /* g3.Loader options */
         loader: 'loader',
         prepend: '',
         append: '',
         script: 'body',
         idLength: 5,
         trigger: []
         /* ---end user options--- */
      },
      
      /**
       * @summary
       * Local paths of loaded resources.
       * @desc
       * The keys of this object are taken from {@link g3.Highlight.getLibraries} 
       * and every key has a value a local path.
       * 
       * Pay attention that you should give values in {@link g3.Highlight.libraries}
       * that when combined with ones from these paths they give a valid filepath.
       * @var {Object} g3.Highlight.paths
       */
      paths: {
         'highlight': {
            prepend: '',
            append: ''
         },
         'rainbow': {
            prepend: '',
            append: ''
         },
         'prism': {
            prepend: '',
            append: ''
         },
         'syntaxhighlighter': {
            prepend: '',
            append: ''
         },
         'prettify': {
            prepend: '',
            append: ''
         }
         // add yours!
      },
      
      /**
       * @summary
       * A collection of deferreds used to observe the loading of resources per 
       * library. Don't alter it.
       * @desc
       * The keys of this object are taken from {@link g3.Highlight.getLibraries}.
       * @var {Object} g3.Highlight.dfds
       */
      dfds: {},
      
      /**
       * @summary
       * It selects a default theme from the list {@link g3.Highlight.getThemes}.
       * @var {Object} g3.Highlight.defaultThemes
       */
      defaultThemes: {
         'highlight': 'default',
         'rainbow': 'dreamweaver',
         'prism': 'prism',
         'prettify': 'prettify'
      },
      
      /**
       * @summary
       * A collection of library files.
       * @desc
       * The keys of this object are taken from {@link g3.Highlight.getLibraries}.
       * @var {Object} g3.Highlight.libraries
       */
      libraries: {
         'highlight': [
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js'
         ],
         'rainbow': [
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/js/rainbow.js'
         ],
         'prism': [
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/prism.min.js'
         ],
         'prettify': [
            'https://cdnjs.cloudflare.com/ajax/libs/prettify/r298/prettify.min.js'
         ]
         // add yours!
      },
      
      /**
       * @summary
       * A collection of language files.
       * @desc
       * The keys of this object are taken from {@link g3.Highlight.getLibraries}.
       * @var {Object} g3.Highlight.languages
       */
      languages: {
         'highlight': [
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
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/languages/sas.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/languages/scss.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/shell.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/sql.min.js'
         ],
         'rainbow': [
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/js/language/generic.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/js/language/coffeescript.js',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/js/language/c.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/js/language/css.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/js/language/html.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/js/language/javascript.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/js/language/php.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/js/language/shell.min.js'
         ],
         'prism': [
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/components/prism-actionscript.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/components/prism-apacheconf.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/components/prism-bash.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/components/prism-coffeescript.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/components/prism-cpp.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/components/prism-css.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/components/prism-http.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/components/prism-javascript.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/components/prism-json.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/components/prism-markdown.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/components/prism-php.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/components/prism-powershell.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/components/prism-sass.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/components/prism-scss.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/components/prism-sql.min.js'
         ],
         'prettify': [
            'https://cdnjs.cloudflare.com/ajax/libs/prettify/r298/lang-basic.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/prettify/r298/lang-css.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/prettify/r298/lang-sql.min.js'
         ]
         // add yours!
      },
      
      /**
       * @summary
       * A collection of library themes.
       * @desc
       * The keys of this object are taken from {@link g3.Highlight.getLibraries}.
       * @var {Object} g3.Highlight.themes
       */
      themes: {
         'highlight': [
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
         ],
         'prism': [
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/themes/prism-coy.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/themes/prism-dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/themes/prism-funky.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/themes/prism-okaidia.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/themes/prism-solarizedlight.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/themes/prism-tomorrow.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/themes/prism-twilight.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/themes/prism.min.css'
         ],
         'prettify': [
            '/g3/lib/plugins/g3Highlight/prettify/prettify-default.css',
            '/g3/lib/plugins/g3Highlight/prettify/prettify-desert.css',
            '/g3/lib/plugins/g3Highlight/prettify/prettify-doxy.css',
            '/g3/lib/plugins/g3Highlight/prettify/prettify-sons-of-obsidian.css',
            '/g3/lib/plugins/g3Highlight/prettify/prettify-sunburst.css'
         ]
         // add yours!
      },
      
      /**
       * @summary
       * A collection of library plugins.
       * @desc
       * The keys of this object are taken from {@link g3.Highlight.getLibraries}.
       * @var {Object} g3.Highlight.plugins
       */
      plugins: {
         'highlight': [],
         'rainbow': [],
         'prism': [
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/plugins/line-numbers/prism-line-numbers.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/plugins/line-numbers/prism-line-numbers.min.js'
         ],
         'prettify': []
         // add yours!
      },
      
      /**
       * @summary
       * A collection of key-values per library used in resource filtering.
       * @desc
       * The keys of this object are taken from {@link g3.Highlight.getLibraries} 
       * and every key has as value an object used to filter the resources:
       * ``` javascript
       * {
       *    languages: <2nd path from last in paths> ,
       *    themes: <2nd path from last in paths>,
       *    plugins: <a unique string in path>
       * }
       * ```
       * @var {Object} g3.Highlight.resourceFilterKeys
       */
      resourceFilterKeys: {
         'highlight': {
            languages: 'languages',
            themes: 'styles',
            plugins: 'plugins'
         },
         'rainbow': {
            languages: 'language',
            themes: 'themes',
            plugins: 'plugins'
         },
         'prism': {
            languages: 'components',
            themes: 'themes',
            plugins: 'plugins'
         },
         'prettify': {
            languages: 'prettify',
            themes: 'prettify',
            plugins: 'prettify'
         }
      },
      
      /**
       * @summary
       * List of supported libraries.
       * @var {string[]} g3.Highlight.getLibraries
       */
      getLibraries: function(){
         return ['highlight', 'rainbow', 'prism', 'prettify'];
      },
      
      /**
       * @summary
       * Returns an array of supported languages for the selected library or, an
       * empty array.
       * @desc
       * Every language comes from the last part of the filepath/url as it is 
       * given in {@link g3.Highlight.libraries}.
       * 
       * We added language `unformatted` to support unformat actions on 
       * pre-formatted `pre` blocks whose contents are replaced by their text 
       * (**attention:**  it destroys existed formations but not the g3.Highlight 
       * object).
       * @function g3.Highlight.getLanguages
       * @param {string} library A key in {@link g3.Highlight.getLibraries}
       * @return {string[]} An array of supported languages
       */
      getLanguages: function(library){ 
         var result = ['unformatted'],
             arr = g3.Highlight.languages[library],
             i,
             tmp;
         
         for(i = 0; i < arr.length; i++){
            if(/\.js$/.test(arr[i]) && ((tmp = new RegExp('\\/' + g3.Highlight.resourceFilterKeys[library].languages + '\\/(.*?)\\.', 'i').exec(arr[i])) !== null)){
               switch(library){
                  case 'prism':
                     result.push(tmp[1].slice(tmp[1].indexOf('-') + 1));
                     break;
                  // add yours!
                  case 'prettify':
                     result.push(tmp[1].slice(tmp[1].indexOf('-') + 1));
                     break;
                  default:
                     result.push(tmp[1]);
               }
            }
         }
         
         // add some special languages
         switch(library){
            case 'prism':
               result.push('none');
               break;
            case 'prettify':
               result.push('generic');
               break;
            // add yours!
         }
         
         return result;
      },
      
      /**
       * @summary
       * Returns an array of a language url for a given language and library.
       * @desc
       * It reverses {@link g3.Highlight.getLanguages}.
       * @function g3.Highlight.languageUrl
       * @param {string} language A key in {@link g3.Highlight.getLanguages}
       * @param {string} library A key in {@link g3.Highlight.getLibraries}
       * @return {string[]} An array of a language url
       */
      languageUrl: function(language, library){
         var l = [],
             i;
         
         for(i = 0; i < g3.Highlight.languages[library].length; i++)
            if(g3.Highlight.filterResource(g3.Highlight.languages[library][i], language, library))
               l.push(g3.Highlight.languages[library][i]);
         
         return l;
      },

      /**
       * @summary
       * Returns an array of supported themes for the selected library or, an
       * empty array.
       * @desc
       * Every theme comes from the last part of the filepath/url as it is given 
       * in {@link g3.Highlight.themes}.
       * @function g3.Highlight.getThemes
       * @param {string} library A key in {@link g3.Highlight.getLibraries}
       * @return {string[]} An array of supported themes
       */
      getThemes: function(library){
         var result = ['default'],
             arr = g3.Highlight.themes[library],
             i,
             tmp;
         
         for(i = 0; i < arr.length; i++){
            if(/\.css$/.test(arr[i]) && ((tmp = new RegExp('\\/' + g3.Highlight.resourceFilterKeys[library].themes + '\\/(.*?)\\.', 'i').exec(arr[i])) !== null)){
               switch(library){
                  case 'prism':
                     result.push(tmp[1].slice(tmp[1].indexOf('-') + 1));
                     break;
                  case 'prettify':
                     tmp = tmp[1].slice(tmp[1].indexOf('/') + 1);
                     tmp = tmp.slice(tmp.indexOf('-') + 1);
                     if(tmp != 'default')
                        result.push(tmp.slice(tmp.indexOf('-') + 1));
                     break;
                  // add yours!
                  default:
                     result.push(tmp[1]);
               }
            }
         }
         
         return result;
      },
      
      /**
       * @summary
       * Returns an array of a theme url for a given theme and library.
       * @desc
       * It reverses {@link g3.Highlight.getThemes}.
       * @function g3.Highlight.themeUrl
       * @param {string} theme A key in {@link g3.Highlight.getThemes}
       * @param {string} library A key in {@link g3.Highlight.getLibraries}
       * @return {string[]} An array of a theme url
       */
      themeUrl: function(theme, library){
         var t = [],
             i;
         
         for(i = 0; i < g3.Highlight.themes[library].length; i++)
            if(g3.Highlight.filterResource(g3.Highlight.themes[library][i], theme, library))
               t.push(g3.Highlight.themes[library][i]);
         
         return t;
      },
      
      /**
       * @summary
       * Returns an array of supported plugins for the selected library or, an
       * empty array.
       * @desc
       * Every plugin comes from the last part of the filepath/url as it is given 
       * in {@link g3.Highlight.plugins}.
       * @function g3.Highlight.getPlugins
       * @param {string} library A key in {@link g3.Highlight.getLibraries}
       * @return {string[]} An array of supported plugins
       */
      getPlugins: function(library){ 
         var result = [],
             arr = g3.Highlight.plugins[library],
             i,
             tmp;
         
         for(i = 0; i < arr.length; i++){
            if(/\.js$/.test(arr[i]) && (new RegExp('\\/' + g3.Highlight.resourceFilterKeys[library].plugins + '\\/', 'i').test(arr[i]))){
               switch(library){
                  case 'prism':
                     tmp = arr[i].slice(arr[i].lastIndexOf('/') + 1);
                     tmp = tmp.slice(0, tmp.indexOf('.'));
                     result.push(tmp.slice('prism-'.length));
                     break;
                  // add yours!
               }
            }
         }
         switch(library){
            case 'prettify':
               result.push('line-numbers');
               break;
            // add yours!
         }
         
         return result;
      },
      
      /**
       * @summary
       * Returns an array of plugin urls for a given plugin string and library.
       * @desc
       * It reverses {@link g3.Highlight.getPlugins}.
       * @function g3.Highlight.pluginUrl
       * @param {string} plugins A space delimited string of plugins taken from 
       *    {@link g3.Highlight.getPlugins}
       * @param {string} library A key in {@link g3.Highlight.getLibraries}
       * @return {string[]} An array of plugin urls
       */
      pluginUrl: function(plugins, library){
         var pluginList = [],
             p = [],
             i, 
             j;
         
         pluginList = plugins.split(' ');
         for(i = 0; i < pluginList.length; i++){
            pluginList[i] = pluginList[i].trim();
            if(pluginList[i] == ''){
               pluginList.splice(i, 1);
               i--;
            }
         }
         
         for(i = 0; i < pluginList.length; i++){
            for(j = 0; j < g3.Highlight.plugins[library].length; j++){
               if(g3.Highlight.filterResource(g3.Highlight.plugins[library][j], pluginList[i], library))
                  p.push(g3.Highlight.plugins[library][j]);
            }
         }
         
         return p;
      },
      
      /**
       * @summary
       * It filters url paths against a search string and returns true/false.
       * @desc
       * Argument `against` is anything from {@link g3.Highlight.getLanguages}, 
       * {@link g3.Highlight.getThemes} or {@link g3.Highlight.getPlugins}. It 
       * uses {@link g3.Highlight.resourceFilterKeys}.
       * 
       * Argument `library` comes from {@link g3.Highlight.getLibraries}.
       * 
       * It is used by the "reversed" functions {@link g3.Highlight.languageUrl},
       * {@link g3.Highlight.themeUrl} and {@link g3.Highlight.pluginUrl}.
       * @function g3.Highlight.filterResource
       * @param {string} url The url to test
       * @param {string} against The string that `url` is compared against
       * @param {string} library The library currently in use
       * @return {boolean} True if url exists in the resources that `against` 
       *    represents for a given library
       */
      filterResource: function(url, against, library){
         var tmp;
         
         if((g3.utils.type(against) != 'string') || (against == ''))
            return false;
         
         // 1. .js
         if(/\.js[^\/]*$/.test(url)){
            
            // 1.1. .js for languages
            if((tmp = new RegExp('\\/' + g3.Highlight.resourceFilterKeys[library].languages + '\\/(.*?)\\.[^\\/]*$', 'i').exec(url)) !== null){
               if(tmp[1] == against)
                  return true;
               // search more...
               switch(library){
                  case 'rainbow':
                     if(tmp[1] == 'generic')
                        return true;
                     break;
                  case 'prism':
                     if(tmp[1] == 'prism-' + against)
                        return true;
                     break;
                  case 'prettify':
                     if(tmp[1].indexOf(against) > -1)
                        return true;
                     break;
                  // add yours!
               }
               // landed here? ...returns false at end!
            
            // 1.2. .js for plugins
            }else if(new RegExp('\\/' + g3.Highlight.resourceFilterKeys[library].plugins + '\\/', 'i').exec(url) !== null){
               switch(library){
                  case 'prism':
                     if(url.indexOf(against) > -1)
                        return true;
                     break;
                  case 'prettify':
                     break;
                  // add yours!
               }
               // landed here? ...returns false at end!
            }
            // landed here? ...returns false at end!
         
         // 2. .css
         }else if(/\.css[^\/]*$/.test(url)){
            if((tmp = new RegExp('\\/' + g3.Highlight.resourceFilterKeys[library].themes + '\\/(.*?)\\.[^\\/]*$', 'i').exec(url)) !== null){
               
               // 2.1 .css for themes
               if(tmp[1] == against)
                  return true;
               // search more...
               switch(library){
                  case 'rainbow':
                     if((against == 'default') && (tmp[1] == g3.Highlight.defaultThemes['rainbow']))
                        return true;
                     break;
                  case 'prism':
                     if(tmp[1] == 'prism-' + against)
                        return true;
                     if((against == 'default') && (tmp[1] == g3.Highlight.defaultThemes['prism']))
                        return true;
                     break;
                  case 'prettify':
                     if(tmp[1].indexOf(against) > -1)
                        return true;
                     break;
                  // add yours!
               }
               // landed here? ...returns false at end!
            }else if((tmp = new RegExp('\\/' + g3.Highlight.resourceFilterKeys[library].plugins + '\\/(.*?)\\.[^\\/]*$', 'i').exec(url)) !== null){
               
               // 2.2 .css for plugins
               if(tmp[1] == against)
                  return true;
               // search more...
               switch(library){
                  case 'prism':
                     if(tmp[1].indexOf(against) > -1)
                        return true;
                     break;
                  // add yours!
               }
               // landed here? ...returns false at end!
            }
            // landed here? ...returns false at end!
         }
         return false;
      },
      
      /**
       * @summary
       * Returns or destroys a unique {@link g3.Loader} object.
       * @desc
       * Pass string `destroy` to destroy this hidden object that is used from 
       * an object `g3.Highlight`.
       * 
       * Pass any other string as a name of the {@link g3.Loader} object.
       * 
       * It's up to you to decide the form of connection:
       * 
       * 1) one object `g3.Highlight` that stores it's resources to one object of
       *    `g3.Loader` or,
       * 
       * 2) many-to-one.
       * 
       * In case (2), the destroy of one `g3.Highlight` object destroys all 
       * resources of other objects too.
       * @function g3.Highlight.loader
       * @param {string} action The name of the loader or the string `destroy`
       * @return {object} A unique {@link g3.Loader} object
       */
      loader: (function(){
         var loader;
         
         return function(action){
            if(action === 'destroy'){
               loader = null;
               return loader;
            }else{
               if(!loader)
                  loader = g3.Loader({name: action});
               return loader;
            }
         }
      })(),
      
      /**
       * @var {string} id
       * @memberof g3.Highlight
       */
      id: 'bDpe2bmnlsZTz7TEMJ4Y0FUq',
      
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
             existedResources;
         
         // 1. validation rules
         validate();
         
         // 2. resource loading is pending
         if(g3.Highlight.dfds[this.defaults.library] && (g3.Highlight.dfds[this.defaults.library].state() == 'pending')){
            return result;
         }
         
         // 3. language = 'unformatted'
         result = true;
         if(this.defaults.language == 'unformatted'){
            $(self.instance.allNodes).each(function(){
               self.unFormat(this);
            });
            this.instance.allNodes = []; // we don't need this as it consumes memory of removed nodes
            return result;
         }
         
         // 4. load resources
         if(!g3.Highlight.dfds[this.defaults.library])
            g3.Highlight.dfds[this.defaults.library] = new $.Deferred();
         
         /*
          * g3.Loader REDUCES COMPLEXITY: start
          */
         g3.Highlight.loader(this.defaults.loader).
         
         init({
            prepend: g3.Highlight.paths[self.defaults.library].prepend || self.defaults.prepend,
            append: g3.Highlight.paths[self.defaults.library].append || self.defaults.append,
            script: self.defaults.script,
            idLength: self.defaults.idLength,
            trigger: self.defaults.trigger
         }).
         
         load(g3.Highlight.libraries[self.defaults.library]).
         done({method: success, context: self}).
         fail({method: fail, context: self}).
         
         load(g3.Highlight.languageUrl(self.defaults.language, self.defaults.library)).
         
         load(g3.Highlight.themeUrl(self.defaults.theme, self.defaults.library)).
         done({method: removeTheme, context: self}).
         
         load(g3.Highlight.pluginUrl(self.defaults.plugins, self.defaults.library)).
         done({method: applyLibrary, context: self}).
         done({method: applyPlugins, context: self});
         /*
          * :end
          */
         
         // 5. library load 'success'
         function success(ids){
            // nothing to do!
            if(ids.length === 0)
               return;
               
            g3.Highlight.dfds[self.defaults.library].resolve();
            
            switch(self.defaults.library){
               case 'prism':
                  $('#' + ids[0]).attr('data-manual', '');
                  break;
               // add yours!
            }
         }
         
         // 6. library load 'fail'
         function fail(ids){
            if(g3.Highlight.dfds[self.defaults.library].state() == 'pending')
               g3.Highlight.dfds[self.defaults.library].reject();
            throw new g3.Error('Couldn\'t load library "' + self.defaults.library + '"', 'Error.Highlight.g3', new Error());
         }
         
         // 7. remove previous theme
         function removeTheme(ids){
            var loaderIds = g3.Highlight.loader(self.defaults.loader).instance.loadedIds.concat(g3.Highlight.loader(self.defaults.loader).instance.existedIds),
                arr = [],
                tmp,
                i;
            
            // nothing to do!
            if(ids.length === 0)
               return;
            
            switch(self.defaults.library){
               case 'a super library!':
                  return;
               // add your library that supports multiple themes per page!
            }
            
            // lame libraries
            $('link').filter(function(ndx, el){
               var id = $(this).attr('id'),
                   tmp,
                   themes = g3.Highlight.themes[self.defaults.library],
                   found = false,
                   i;
               
               // loaded recently
               if(ids.indexOf(id) > -1)
                  return false;
               // not loaded previously
               if(loaderIds.indexOf(id) < 0){
                  return false;
               // loaded previously
               }else{
                  tmp = $(this).attr('href');
                  for(i = 0; i < themes.length; i++){
                     if((tmp.indexOf(themes[i]) > -1) || (themes[i].indexOf(tmp) > -1)){
                        found = true;
                        arr.push(id);
                        break;
                     }
                  }
               }
               return found;
            }).remove();
            
            tmp = g3.Highlight.loader(self.defaults.loader).instance.loadedIds;
            for(i = 0; i < tmp.length; i++){
               if(arr.indexOf(tmp[i]) > -1){
                  tmp.splice(i, 1);
                  i--;
               }
            }
         }
         
         // 8. apply library, language & theme
         function applyLibrary(ids){
            $(self.instance.nodes).each(function(){
               var $n = $(this);
               
               self.unFormat(this);
               $n.attr('data-lang', self.defaults.language);
               
               switch(self.defaults.library){
                  case 'highlight':
                     $n.addClass(self.defaults.language);
                     hljs.highlightBlock(this);
                     break;
                  case 'rainbow':
                     Rainbow.defer = true;
                     $n.wrapInner('<code data-language="' + self.defaults.language + '"></code>');
                     Rainbow.color($n[0]);
                     break;
                  case 'prism':
                     $n.wrapInner('<code class="language-' + self.defaults.language + '"></code>');
                     Prism.highlightAllUnder($n[0]);
                     break;
                  case 'prettify':
                     $n.addClass('full prettyprint lang-' + self.defaults.language);
                     break;
                  // add yours!
                  default:
                     throw new g3.Error('We couldn\'t reach some code for library ' + self.defaults.library, 'Error.Highlight.g3', new Error());
               }
            });
            switch(self.defaults.library){
               case 'prettify':
                  if(self.defaults.plugins.indexOf('line-numbers') < 0)
                     PR.prettyPrint();
                  break;
            }
         }
         
         // 9. apply plugins
         function applyPlugins(ids){
            
            $(self.instance.nodes).each(function(){
               var $n = $(this);
               
               if($n.attr('data-lang')){
                  switch(self.defaults.library){
                     case 'prism':
                        if(self.defaults.plugins.indexOf('line-numbers') > -1){
                           $n.addClass("line-numbers").attr('data-start', self.defaults.start).css({'counter-reset': 'linenumber ' + (self.defaults.start*1 - 1)});
                        }
                        break;
                     case 'prettify':
                        if(self.defaults.plugins.indexOf('line-numbers') > -1)
                           $n.addClass("linenums");
                        break;
                     // add yours!
                  }
               }
            });
            switch(self.defaults.library){
               case 'prettify':
                  if(self.defaults.plugins.indexOf('line-numbers') > -1)
                     PR.prettyPrint();
                  break;
            }
         }
         
         /*
          * HELPERS
          * -------
          */                  
         // validation rules for 'build()'
         function validate(){
            if(!self.validate('library', self.defaults.library))
               throw new g3.Error('User argument for key "library" should be a name from the list of supported libraries, see g3.Highlight.getLibraries', 'Error.Highlight.g3', new Error());
            if(!self.validate('language', self.defaults.language))
               throw new g3.Error('User argument for key "language" should be a name from the list of supported languages for that library, see g3.Highlight.getLanguages(library)', 'Error.Highlight.g3', new Error());
            if(!self.validate('theme', self.defaults.theme))
               throw new g3.Error('Library ' + self.defaults.library + ' does not support theme ' + self.defaults.theme, 'Error.Highlight.g3', new Error());
            $(self.instance.nodes).each(function(){
               if(!self.validate('node', this.nodeName))
                  throw new g3.Error('g3.Highlight acts only on a collection of &lt;pre&gt; tags!', 'Error.Highlight.g3', new Error());
            });
         }
         
         return result;
      },
      
      /**
       * @summary
       * A collection of validation rules for user input or node collection.
       * @desc
       * There are five categories:
       * 
       * 1) `node`,
       * 
       * 2) `library`: tests user input against {@link g3.Highlight.libraries},
       * 
       * 3) `language`: tests user input against {@link g3.Highlight.languages},
       * 
       * 4) `theme`: tests user input against {@link g3.Highlight.themes} and
       * 
       * 5) `plugin`: tests user input against {@link g3.Highlight.plugins}.
       * @function g3.Highlight#validate
       * @param {string} category A category of validation rules
       * @param {string} value A value to test the validation rules on
       * @return {boolean} True if the value passes the validation rules
       */
      validate: function(category, value){
         switch(category){
            case 'node':
               if(value.toUpperCase() == 'PRE')
                  return true;
               else
                  return false;
               break;
            case 'library':
               if((g3.Highlight.getLibraries().indexOf(value) < 0) || !g3.Highlight.libraries[value] || (g3.utils.type(g3.Highlight.libraries[value]) != 'array') || !g3.Highlight.libraries[value].length)
                  return false;
               else
                  return true;
               break;
            case 'language':
               if(g3.Highlight.getLanguages(this.defaults.library).indexOf(value) > -1)
                  return true;
               else
                  return false;
               break;
            case 'theme':
               if(g3.Highlight.getThemes(this.defaults.library).indexOf(value) > -1)
                  return true;
               else
                  return false;
               break;
            case 'plugin':
               if(g3.Highlight.getPlugins(this.defaults.library).indexOf(value) > -1)
                  return true;
               else
                  return false;
               break;
         }
         return false;
      },
      
      /**
       * @summary
       * Extracts text from formatted `<pre>` blocks including newline marks.
       * @function g3.Highlight#getText
       * @param {object} node A node reference
       * @return {string} The extracted text
       */
      getText: function(node){
         var self = this,
             $n = $(node),
             li,
             tmp;
         
         switch(self.defaults.library){
            case 'highlight':
               return $n.text();
            case 'rainbow':
               return $n.text();
            case 'prism':
               return $n.text();
            case 'prettify':
               li = $n.children('ol').children('li');
               if(li.length){
                  tmp = '';
                  li.each(function(){
                     tmp += $(this).text() + '\n';
                  });
               }else
                  tmp = $n.text();
               return tmp;
            // add yours!
         }
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
             text = self.getText(node),
             i;
         
         $n.attr('data-lang', 'unformatted');
         switch(self.defaults.library){
            case 'highlight':
               $n.attr('class', removeLanguages(tmp)).removeClass('hljs');
               $n.html(text);
               break;
            case 'rainbow':
               $n.html(text);
               break;
            case 'prism':
               $n.attr('class', g3.utils.clearString($n.attr('class'), ' ', 'language-\\w', 'line-numbers'));
               $n.html(text);
               break;
            case 'prettify':
               $n.attr('class', g3.utils.clearString($n.attr('class'), ' ', 'lang-\\w', 'full', 'linenums', 'prettyprint', 'prettyprinted'));
               $n.html(text);
               break;
            // add yours!
         }
         
         function removeLanguages(str){
            if((g3.utils.type(str) == 'string') && str.length){
               str = str.replace(/^\s+|\s+$/mg, '');
               for(i = 0; i < g3.Highlight.getLanguages(self.defaults.library).length; i++)
                  str = g3.utils.clearString(str, ' ', g3.Highlight.getLanguages(self.defaults.library)[i]);
            }
            return str;
         }
         
         return self;
      },
      
      /**
       * @summary
       * Removes object and resources. Reverts changes in `this.instance.nodes`.
       * @desc
       * Resource urls exist in {@link g3.Highlight.libraries}, 
       * {@link g3.Highlight.languages}, {@link g3.Highlight.themes} and 
       * {@link g3.Highlight.plugins}.
       * 
       * If you pass `true` or `all`, it destroys **existed** urls too which are
       * contained in the above lists and haven't been handled by {@link g3.Highlight.loader}.
       * @function g3.Highlight#destroy
       * @prop {string|boolean} all If `true` or `all` it destroys all resources 
       *    with urls contained in static resource lists of this class
       * @return {undefined}
       */
      destroy: function(all){
         var self = this,
             all = ((all === true) || (all == 'all'))? true: false,
             arr = g3.Highlight.loader(this.defaults.loader).instance.loadedIds,
             tmp;
         
         g3.Highlight.loader(this.defaults.loader).destroy(all);
         g3.Highlight.loader('destroy');
         $(self.instance.allNodes).each(function(){
            self.unFormat(this);
         });
         
         g3.Highlight.destroy(this.instance.name);
         
         return this;
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
