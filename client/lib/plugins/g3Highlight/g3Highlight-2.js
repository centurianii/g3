(function(g3, $, window, document, undefined){
/**
 * @summary
 * A wrapper class for different highlight projects.
 * @desc
 * It loads the project's files and handles the nodes according to the requirements
 * of the library.
 * 
 * Some notes:
 * 
 * - It does not use the _`all()`_ feature of many libraries that apply modifications
 * to every `pre` tag out there (bad feature) or the autoloading one (also bad),
 * 
 * - it works only on `pre` tags, period,
 * 
 * - language `unformatted` is added to remove language formations that can be 
 *   hardcoded in cached pages,
 * 
 * - it avoids resource re-loading on pages that have them hardcoded.
 * 
 * Overall, **it makes the transition to another library a breeze**.
 * 
 * **_A note on libraries_**: before switching to a new one call a `this.destroy()` 
 * to get rid off previous files. User argument should be a value from {@link g3.Highlight.getLibraries}.
 * 
 * **_A note on languages and themes_**: user arguments are contained in the 
 * results of {@link g3.Highlight.getLanguages} and {@link g3.Highlight.getThemes}, 
 * see {@link g3.Highlight.resourceFilterKeys}.
 * 
 * **_A note on extending this class_**: all `switch...case` blocks in code that 
 * use the keys (libraries) from {@link g3.Highlight.getLibraries}.
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
       *  @prop {integer} idLength The length of assigned ids on loaded resources
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
         library: 'prism', // add yours!
         language: null,
         theme: 'default',
         libraryPlugins: null,
         idLength: 5
         /* ---end user options--- */
      },
      
      /**
       * @summary
       * List of supported libraries.
       * @var {string[]} g3.Highlight.getLibraries
       */
      getLibraries: ['highlightjs', 'rainbow', 'prism'],
      
      /**
       * @summary
       * Local paths of loaded resources.
       * @desc
       * The keys of this object are taken from {@link g3.Highlight.getLibraries} 
       * and every key has a value a local path.
       * 
       * Pay attention that you should give values in {@link g3.Highlight.resources}
       * that when combined with ones from these paths they give a valid filepath.
       * @var {Object} g3.Highlight.paths
       */
      paths: {},
      
      /**
       * @summary
       * A collection of deferreds used to observe the loading of resources.
       * @desc
       * The keys of this object are taken from {@link g3.Highlight.getLibraries} 
       * and every key has a value an array of deferreds resolved when the 
       * relevant js files are loaded.
       * 
       * This approach allows us to have dynamic loading of javascript files; we
       * drop support for css styles as they are handled by the browser's css 
       * engine.
       * @var {Object} g3.Highlight.resourceDfds
       */
      resourceDfds: {},
      
      /**
       * @summary
       * A collection of deferreds used to observe the loading of plugins.
       * @desc
       * The keys of this object are taken from {@link g3.Highlight.getLibraries} 
       * and every key has a value an array of deferreds resolved when the 
       * relevant plugin files are loaded.
       * 
       * Normally, plugins of a library are called after the loading of all it's
       * resources that leads to a pipe of promises.
       * @var {Object} g3.Highlight.pluginDfds
       */
      pluginDfds: {},
      
      /**
       * @summary
       * A collection of ids for loaded resourses.
       * @desc
       * The keys of this object are taken from {@link g3.Highlight.getLibraries} 
       * and every key has a value an array of resource ids.
       * 
       * In case we change library or a theme or we destroy it, we can easily 
       * remove specific `<link>` or `<script>` tags.
       * @var {Object} g3.Highlight.resourceIds
       */
      resourceIds: {},
      
      /**
       * @summary
       * A collection of key-values per library used in resource filtering.
       * @desc
       * The keys of this object are taken from {@link g3.Highlight.getLibraries} 
       * and every key has as value an object used to filter the resources:
       * ``` javascript
       * {
       *    languages: <2nd string from last in paths> ,
       *    themes: <2nd string from last in paths>,
       *    plugins: <a unique string in path>
       * }
       * ```
       * 
       * The values of the above keys are taken from {@link g3.Highlight.resources}
       * and represent:
       * - for languages and themes the 2nd from last part of a filepath,
       * 
       * - for plugins a unique string in the filepath.
       * 
       * This class will try to load every resource for a library apart from the 
       * filepaths that fall into these restrictions which are further filtered 
       * compared with user options so that only those that pass the comparison 
       * will be loaded.
       * @var {Object} g3.Highlight.resourceFilterKeys
       */
      resourceFilterKeys: {
         'highlightjs': {
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
         }
      },
      
      /**
       * @summary
       * Given a url it returns the actual url as it appears at the browser's
       * `link` or `script` tags.
       * @desc
       * If you use in {@link g3.Highlight.resources} a part of the actual url 
       * then this method is extremely important as it attaches {@link g3.Highlight.paths}
       * to them and returns the result.
       * 
       * On the other hand, it's wrong to search {@link g3.Highlight.resources} 
       * for values returned by this method.
       * @function g3.Highlight.normalizeUrl
       * @param {string} library The library key from {@link g3.Highlight.resources}
       * @param {string} url The url in {@link g3.Highlight.resources}
       * @return {string} The actual url applied by the browser
       */
      normalizeUrl: function(library, url){
         var tmp;
            
         if(/^http[s]?:\/\//.test(url))
            tmp = '';
         else
            tmp = g3.Highlight.paths[library];
         return tmp + url;
      },
      
      /**
       * @summary
       * It selects a default theme from the list {@link g3.Highlight.getThemes}.
       * @var {Object} g3.Highlight.defaultThemes
       */
      defaultThemes: {
         'highlightjs': 'default',
         'rainbow': 'dreamweaver',
         'prism': 'prism'
      },
      
      /**
       * @summary
       * A collection of library files.
       * @desc
       * The keys of this object are taken from {@link g3.Highlight.getLibraries}.
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
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/languages/sas.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/languages/scss.min.js',
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
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/js/rainbow.js',
            'https://cdnjs.cloudflare.com/ajax/libs/rainbow/1.2.0/js/language/generic.min.js',
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
         ],
         'prism': [
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/prism.min.js',
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
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/components/prism-sql.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/themes/prism-coy.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/themes/prism-dark.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/themes/prism-funky.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/themes/prism-okaidia.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/themes/prism-solarizedlight.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/themes/prism-tomorrow.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/themes/prism-twilight.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/themes/prism.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/plugins/line-numbers/prism-line-numbers.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/plugins/line-numbers/prism-line-numbers.min.js'
         ]
         // add yours!
      },
      
      /**
       * @summary
       * Returns an array of supported languages for the selected library or, an
       * empty array.
       * @desc
       * Every language comes from the last part of the filepath/url as it is 
       * given in {@link g3.Highlight.resources}.
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
             arr = g3.Highlight.resources[library],
             i,
             tmp;
         
         for(i = 0; i < arr.length; i++){
            if(/\.js$/.test(arr[i]) && ((tmp = new RegExp('\\/' + g3.Highlight.resourceFilterKeys[library].languages + '\\/(.*?)\\.', 'i').exec(arr[i])) !== null)){
               switch(library){
                  case 'prism':
                     result.push(tmp[1].slice(tmp[1].indexOf('-') + 1));
                     break;
                  // add yours!
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
            // add yours!
         }
         
         return result;
      },
      
      /**
       * @summary
       * Returns an array of supported themes for the selected library or, an
       * empty array.
       * @desc
       * Every theme comes from the last part of the filepath/url as it is given 
       * in {@link g3.Highlight.resources}.
       * @function g3.Highlight.getThemes
       * @param {string} library A key in {@link g3.Highlight.getLibraries}
       * @return {string[]} An array of supported themes
       */
      getThemes: function(library){ 
         var result = [],
             arr = g3.Highlight.resources[library],
             i,
             tmp;
         
         for(i = 0; i < arr.length; i++){
            if(/\.css$/.test(arr[i]) && ((tmp = new RegExp('\\/' + g3.Highlight.resourceFilterKeys[library].themes + '\\/(.*?)\\.', 'i').exec(arr[i])) !== null)){
               switch(library){
                  case 'prism':
                     result.push(tmp[1].slice(tmp[1].indexOf('-') + 1));
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
       * Returns an array of supported plugins for the selected library or, an
       * empty array.
       * @desc
       * Every plugin comes from the last part of the filepath/url as it is given 
       * in {@link g3.Highlight.resources}.
       * @function g3.Highlight.getPlugins
       * @param {string} library A key in {@link g3.Highlight.getLibraries}
       * @return {string[]} An array of supported plugins
       */
      getPlugins: function(library){ 
         var result = [],
             arr = g3.Highlight.resources[library],
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
         
         return result;
      },
      
      /**
       * @summary
       * Returns a unique id.
       * @desc
       * The length is controlled by the argument.
       * @function g3.Highlight.getId
       * @param {String} idLength The length of the id
       * @param {object} context The space where the ids are compared against so 
       *    as to be unique (this document or another in a frame)
       * @return {String} A unique id
       */
      getId: function(idLength, context){
         var id;
         
         id = g3.utils.randomString(idLength, null, true);
         if(!context)
            context = window.document;
         if(g3.utils.type(context) == 'object')
            context = g3.utils.getWindow(context.defaults.parent);
         while($('#' + id, context).length)
            id = g3.utils.randomString(idLength, null, true);
         
         return id;
      },
      
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
             i,
             libraryList = [],
             pluginList = [],
             prop,
             filter,
             existedResources;
         
         // 1. validation rules
         validate();
         
         // 2. resource loading is pending
         if(g3.Highlight.resourceDfds[this.defaults.library] && g3.Highlight.resourceDfds[this.defaults.library]['all'] && (g3.Highlight.resourceDfds[this.defaults.library]['all'].state() == 'pending')){
            return result;
         }
         
         // 3. language = 'unformatted'
         result = true;
         if(this.defaults.language == 'unformatted'){
            $(self.instance.allNodes).each(function(){
               self.unFormat(this);
            });
            return result;
         }
         
         // 4. load resources
         // 4.1. first run
         if(!g3.Highlight.resourceDfds[this.defaults.library])
            g3.Highlight.resourceDfds[this.defaults.library]= {};
         if(!g3.Highlight.pluginDfds[this.defaults.library])
            g3.Highlight.pluginDfds[this.defaults.library]= {};
         if(!g3.Highlight.resourceIds[this.defaults.library])
            g3.Highlight.resourceIds[this.defaults.library]= [];
         // 4.2. a central deferred for the requested files
         g3.Highlight.resourceDfds[this.defaults.library]['all'] = new $.Deferred();
         g3.Highlight.pluginDfds[this.defaults.library]['all'] = new $.Deferred();
         // 4.3. existed resources
         existedResources = collectResources();
         // 4.4. load files
         for(i = 0; i < g3.Highlight.resources[this.defaults.library].length; i++){
            prop = g3.Highlight.resources[this.defaults.library][i];
            filter = filterResource(prop);
            if((filter == 'library') || (filter == 'language')){
               appendJs(prop, filter);
               libraryList.push(g3.Highlight.resourceDfds[this.defaults.library][prop]);
            }else if(filter == 'plugin'){
               appendJs(prop, filter);
               pluginList.push(g3.Highlight.pluginDfds[this.defaults.library][prop]);
            }else if((filter == 'theme') || (filter == 'style'))
               appendCss(prop);
         }
         if(libraryList.length)
            $.when.apply($, libraryList).done(plugins);
         else
            plugins();
         
         // 5. applies plugins
         function plugins(){
            g3.Highlight.pluginDfds[self.defaults.library]['all'].resolve();
            if(pluginList.length)
               $.when.apply($, pluginList).done(apply);
            else
               apply();
         }
         
         // 6. applies library formation
         function apply(){
            g3.Highlight.resourceDfds[self.defaults.library]['all'].resolve();
            $(self.instance.nodes).each(function(){
               var $n = $(this);
               
               self.unFormat(this);
               $n.attr('data-lang', self.defaults.language);
               
               switch(self.defaults.library){
                  case 'highlightjs':
                     $n.addClass(self.defaults.language);
                     hljs.highlightBlock(this);
                     $n.attr('data-lang', self.defaults.language);
                     break;
                  case 'rainbow':
                     Rainbow.defer = true;
                     $n.wrapInner('<code data-language="' + self.defaults.language + '"></code>').attr('data-lang', self.defaults.language);
                     Rainbow.color($n[0]);
                     break;
                  case 'prism':
                     $n.removeClass('language-' + self.defaults.language).wrapInner('<code class="language-' + self.defaults.language + '"></code>').attr('data-lang', self.defaults.language);
                     Prism.highlightAllUnder($n[0]);
                     break;
                  // add yours!
                  default:
                     throw new g3.Error('We couldn\'t reach some code for library ' + self.defaults.library, 'Error.Highlight.g3', new Error());
               }
            });
         }
         
         // validation rules
         function validate(){
            if(!self.validate('library', self.defaults.library))
               throw new g3.Error('User argument for key "library" should be a name from the list of supported libraries, see g3.Highlight.getLibraries', 'Error.Highlight.g3', new Error());
            if(!self.validate('language', self.defaults.language))
               throw new g3.Error('User argument for key "language" should be a name from the list of supported languages for that library, see g3.Highlight.getLanguages(library)', 'Error.Highlight.g3', new Error());
            if(!self.validate('resource', self.defaults.library))
               throw new g3.Error('There are no supported resources for library ' + this.defaults.library, 'Error.Highlight.g3', new Error());
            $(self.instance.nodes).each(function(){
               if(!self.validate('node', this.nodeName))
                  throw new g3.Error('g3.Highlight acts only on a collection of &lt;pre&gt; tags!', 'Error.Highlight.g3', new Error());
            });
         }
         
         // accepts paths from 'g3.Highlight.resources[library]'
         // it returns 'library' for .js and 'style' for .css filepaths respectively 
         // apart from those that contain 'g3.Highlight.resourceFilterKeys[library].languages'
         // or '.themes' or 'plugins' which are filtered against user options 
         // 'language' or 'theme' or 'plugins' or specific library needs and 
         // returns either a string or false
         function filterResource(url){
            var tmp;
            
            if(/\.js$/.test(url)){
               if((tmp = new RegExp('\\/' + g3.Highlight.resourceFilterKeys[self.defaults.library].languages + '\\/(.*?)\\.[^\\/]*$', 'i').exec(url)) !== null){
                  if(tmp[1] == self.defaults.language)
                     return 'language';
                  // apply modifications
                  switch(self.defaults.library){
                     case 'rainbow':
                        if(tmp[1] == 'generic')
                           return 'library';
                        break;
                     case 'prism':
                        if(tmp[1] == 'prism-' + self.defaults.language)
                           return 'language';
                        break;
                     // add yours!
                  }
                  // returns false at end!
               }else if(new RegExp('\\/' + g3.Highlight.resourceFilterKeys[self.defaults.library].plugins + '\\/', 'i').test(url)){
                  switch(self.defaults.library){
                     case 'prism':
                        tmp = url.slice(url.lastIndexOf('/') + 1);
                        tmp = tmp.slice(0, tmp.indexOf('.'));
                        tmp = tmp.slice('prism-'.length);
                        if((g3.utils.type(self.defaults.libraryPlugins) == 'string') && (self.defaults.libraryPlugins.indexOf(tmp) > -1))
                           return 'plugin';
                        break;
                     // add yours!
                  }
                  // returns false at end!
               }else
                  return 'library';
            }else if(/\.css$/.test(url)){
               if((tmp = new RegExp('\\/' + g3.Highlight.resourceFilterKeys[self.defaults.library].themes + '\\/(.*?)\\.[^\\/]*$', 'i').exec(url)) !== null){
                  if(tmp[1] == self.defaults.theme)
                     return 'theme';
                  // add these theme if 'default' does not exist
                  switch(self.defaults.library){
                     case 'rainbow':
                        if((self.defaults.theme == 'default') && (tmp[1] == g3.Highlight.defaultThemes['rainbow']))
                           return 'theme';
                        break;
                     case 'prism':
                        if(tmp[1] == 'prism-' + self.defaults.theme)
                           return 'theme';
                        if((self.defaults.theme == 'default') && (tmp[1] == g3.Highlight.defaultThemes['prism']))
                           return 'theme';
                        break;
                     // add yours!
                  }
                  // returns false at end!
               }else
                  return 'style';
            }
            return false;
         }
         
         // accepts paths from 'g3.Highlight.resources[library]'
         function appendCss(url){
            var win = g3.utils.getWindow(self.instance.parent),
                $node,
                id = g3.Highlight.getId(self.defaults.idLength);
            
            if((g3.Highlight.resourceDfds[self.defaults.library][url] === true) || (existedResources.indexOf(url) > -1))
               return;
            
            g3.Highlight.resourceDfds[self.defaults.library][url] = true;
            removeExistedCss();
            g3.Highlight.resourceIds[self.defaults.library].push(id);
            
            $node = $('<link></link>').data('highlight', {file: url, library: self.defaults.library});
            $node.attr({'rel': 'stylesheet', 'type': 'text/css', 'id': id, 'href': g3.Highlight.normalizeUrl(self.defaults.library, url)});
            $node.appendTo(win.document.getElementsByTagName('head')[0]);
         }
         
         // removes existed css files (themes) for libraries that do not support 
         // multiple themes per page!
         function removeExistedCss(){
            var arr = g3.Highlight.resourceIds[self.defaults.library],
                i,
                j,
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
                  for(j = 0; j < g3.Highlight.resources[self.defaults.library].length; j++){
                     if(tmp == g3.Highlight.normalizeUrl(g3.Highlight.resources[self.defaults.library][j])){
                        // remove .css file
                        $('#' + arr[i]).remove();
                        arr.splice(i, 1);
                        i--;
                        // prepare for a new load
                        url = g3.Highlight.resources[self.defaults.library][j];
                        g3.Highlight.resourceDfds[self.defaults.library][url] = false;
                     }
                  }
               }
            }
         }
         
         // accepts paths from 'g3.Highlight.resources[library]'
         function appendJs(url, filter){
            var win = g3.utils.getWindow(self.defaults.parent),
                node,
                id = g3.Highlight.getId(self.defaults.idLength);
            
            if((g3.Highlight.resourceDfds[self.defaults.library][url] && (g3.Highlight.resourceDfds[self.defaults.library][url].state() == 'resolved')) || (g3.Highlight.pluginDfds[self.defaults.library][url] && (g3.Highlight.pluginDfds[self.defaults.library][url].state() == 'resolved')) || (existedResources.indexOf(url) > -1))
               return;
            
            if((filter == 'library') || (filter == 'language')){
               g3.Highlight.resourceDfds[self.defaults.library][url] = new $.Deferred();
               callback = 'resource';
            }else if(filter == 'plugin'){
               g3.Highlight.pluginDfds[self.defaults.library][url] = new $.Deferred();
               callback = 'plugin';
            }
            g3.Highlight.resourceIds[self.defaults.library].push(id);
            
            node = g3.utils.createScriptNode({
               tag: 'body',
               src: g3.Highlight.normalizeUrl(self.defaults.library, url),
               type: 'text/javascript',
               id: id,
               win: self.defaults.parent,
               data: {'highlight': {file: url, library: self.defaults.library, filter: filter}},
               callback: function(){
                  if((filter == 'library') || (filter == 'language'))
                     g3.Highlight.resourceDfds[this.highlight.library][this.highlight.file].resolve();
                  else if(filter == 'plugin')
                     g3.Highlight.pluginDfds[this.highlight.library][this.highlight.file].resolve();
               }
            });
            if(filter == 'library'){
               switch(self.defaults.library){
                  case 'prism':
                     $(node).attr('data-manual', '');
                     break;
                  // add yours!
               }
            }
         }
         
         // collects existed resources from 'g3.Highlight.resources[library]' 
         // and assigns unique ids
         function collectResources(){
            var arr = [];
            
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
                  for(i = 0; i < g3.Highlight.resources[self.defaults.library].length; i++){
                     if(url == g3.Highlight.normalizeUrl(self.defaults.library, g3.Highlight.resources[self.defaults.library][i])){
                        if(!id){
                           id = g3.Highlight.getId(self.defaults.idLength);
                           $n.attr('id', id);
                        }
                        if(g3.Highlight.resourceIds[self.defaults.library].indexOf(id) < 0)
                           g3.Highlight.resourceIds[self.defaults.library].push(id);
                        arr.push(g3.Highlight.resources[self.defaults.library][i]);
                     }
                  }
               }
            });
            
            return arr;
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
               if(g3.Highlight.getLibraries.indexOf(value) > -1)
                  return true;
               else
                  return false;
               break;
            case 'language':
               if(g3.Highlight.getLanguages(this.defaults.library).indexOf(value) > -1)
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
            case 'rainbow':
               $n.attr('data-lang', 'unformatted');
               $n.html($n.text());
               break;
            case 'prism':
               $n.attr('data-lang', 'unformatted').each(function(){
                  var $n = $(this);
                  $n.attr('class', g3.utils.clearString($n.attr('class'), ' ', 'language-\\w'));
               });
               $n.html($n.text());
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
       * Removes objects, files and changes in `this.instance.nodes` for one or 
       * all objects.
       * @desc
       * If you pass as argument `true` or the string `all` then `destroy` 
       * will remove all files with sources/filepaths that exist in {@link g3.Highlight.resources}
       * along with `g3.Highlight` objects.
       * @function g3.Highlight#destroy
       * @prop {string|boolean} all If `true` or `all` it destroys all objects 
       *    and files even hard-coded ones
       * @return {Object} An object of this class
       */
      destroy: function(all){
         var self = this,
            all = ((all === true) || (all == 'all'))? true: false,
            arr = [],
            prop,
            i;
         
         // 1. full destroy
         if(all){
            for(i = 0; i < g3.Highlight.instances.length; i++){
               self = g3.Highlight.instances[i].hybrid;
               singleDestroy(self.defaults.library, g3.Highlight.instances[i].id);
            }
            for(prop in g3.Highlight.resources){
               for(i = 0; i < g3.Highlight.resources[prop].length; i++){
                  arr.push(g3.Highlight.normalizeUrl(prop, g3.Highlight.resources[prop][i]));
               }
            }
            $('link', g3.utils.getWindow(self.defaults.parent).document).filter(function(){
               return (arr.indexOf($(this).attr('href')) > -1);
            }).remove();
            $('script', g3.utils.getWindow(self.defaults.parent).document).filter(function(){
               return (arr.indexOf($(this).attr('src')) > -1);
            }).remove();
         
         // 2. partial destroy
         }else{
            singleDestroy(this.defaults.library, this.instance.name);
         }
         
         // 'self' is re-assigned from the caller function
         function singleDestroy(library, objectName){
            var arr = g3.Highlight.resourceIds[library];
            
            // 3.1. validation rules
            validate(library, objectName);
            
            // 3.2. remove library's files
            if(g3.utils.type(arr) == 'array')
               for(i = 0; i < arr.length; i++)
                  $('#' + arr[i]).remove();
            g3.Highlight.resourceDfds[library]= {};
            g3.Highlight.resourceIds[library] = [];
            
            // 3.3. unformat
            $(g3.Highlight.get(objectName).instance.allNodes).each(function(){
               self.unFormat(this);
            });
            
            // 3.4. delete object from 'g3.Highlight.instances[]'
            g3.Highlight.destroy(objectName);
         }
         
         // validation rules
         function validate(library, objectName){
            if(!self.validate('library', library))
               throw new g3.Error('User argument for key "library" should be a name from the list of supported libraries, see g3.Highlight.getLibraries', 'Error.Highlight.g3', new Error());
            $(g3.Highlight.get(objectName).instance.allNodes).each(function(){
               if(!self.validate('node', this.nodeName))
                  throw new g3.Error('g3.Highlight acts only on a collection of &lt;pre&gt; tags!', 'Error.Highlight.g3', new Error());
            });
         }
         
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
