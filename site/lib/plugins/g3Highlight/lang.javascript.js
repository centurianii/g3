(function(g3, $, window, document){
var pre = g3.Highlight.defaults.pre;
g3.Highlight.plugin({
   name: 'javascript',
   
   /*
    * regex patterns
    * --------------
    * 1st level values: arrays for basic match
    * 2nd level values: at key 0 is the regex, at key 1 is the class name, at 
    * key 2 is the regex index reposition or an array with regexs for extended 
    * match! Reposition index is necessary when the regex matches not only the 
    * string to search but also a few characters after/before.
    */
   patterns: [
      /* multi-line comments + at-commands + emails + urls */
      [
         /(?:\/\*(?:.|[\r\n])*?\*\/)/g,
         pre + 'comment',
         
         //e.g. @module {g3.Highlight}
         [
            /(?:@(?:module|class)\s*{.*?})/ig,
            pre + 'classname'
         ],
         
         //e.g. @function {g3.Highlight.init}
         [
            /(?:@(?:function|object)\s*{.*?})/ig,
            pre + 'function'
         ],
         
         //e.g. @constructor
         [
            /(?:@(?:constructor|static|public|priveleged))/ig,
            pre + 'access'
         ],
         
         //e.g. @param {Object|String} 'options'
         [
            /(?:@param\s*{.*?}\s*(?:\'.*?\')?)/ig,
            pre + 'usertype'
         ],
         
         //e.g. @return {Object}
         [
            /(?:@return\s*{.*?})/ig,
            pre + 'usertype'
         ],
         
         //e.g. @version
         [
            /(?:@(?:version|author|copyright|reference))/ig,
            pre + 'legal'
         ],
         
         /* emails */
         [
            /\b[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,4}\b/ig,
            pre + 'url'
         ],
         
         /* urls, see: http://stackoverflow.com/questions/161738/what-is-the-best-regular-expression-to-check-if-a-string-is-a-valid-url */
         [
            /\b(?:ht|f)tp(?:s?)(?:\:\/\/[0-9A-Z])(?:[-.\w]*)(?:(?::\d+)?)(?:\?([a-z0-9$_\.\+!\*\'\(\),;:@&=-]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9$_\.\+!\*\'\(\),;:@&=-]|%[0-9a-f]{2})*)?\b/ig,
            pre + 'url'
         ],
         
         /* new lines */
         [
            /\n/g,
            pre + 'newline'
         ]
      ],
      /* single-line comments + at-commands + emails + urls */
      [
         /(?:\/\/.*$)/mg,
         pre + 'comment',
         
         //e.g. @module {g3.Highlight}
         [
            /(?:@(?:module|class)\s*{.*?})/ig,
            pre + 'classname'
         ],
         
         //e.g. @function {g3.Highlight.init}
         [
            /(?:@(?:function|object)\s*{.*?})/ig,
            pre + 'function'
         ],
         
         //e.g. @constructor
         [
            /(?:@(?:constructor|public|priveleged))/ig,
            pre + 'access'
         ],
         
         //e.g. @param {Object|String} 'options'
         [
            /(?:@param\s*{.*?}\s*(?:\'.*?\')?)/ig,
            pre + 'usertype'
         ],
         
         //e.g. @return {Object}
         [
            /(?:@return\s*{.*?})/ig,
            pre + 'usertype'
         ],
         
         //e.g. @version
         [
            /(?:@(?:version|author|copyright|reference))/ig,
            pre + 'legal'
         ],
         
         /* emails */
         [
            /\b[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,4}\b/ig,
            pre + 'url'
         ],
         
         /* urls, see: http://stackoverflow.com/questions/161738/what-is-the-best-regular-expression-to-check-if-a-string-is-a-valid-url */
         [
            /\b(?:ht|f)tp(?:s?)(?:\:\/\/[0-9A-Z])(?:[-.\w]*)(?:(?::\d+)?)(?:\?([a-z0-9$_\.\+!\*\'\(\),;:@&=-]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9$_\.\+!\*\'\(\),;:@&=-]|%[0-9a-f]{2})*)?\b/ig,
            pre + 'url'
         ]
      ],
      /* strings (multi-line that end with \\n) + special chars */
      [
         /(?:'(?:.*?|(?:.*?\\\n)*?).*?[^\\\n]')|(?:"(?:.*?|(?:.*?\\\n)*?).*?[^\\\n]")/g,
         pre + 'string',
         [
            /(?:\\[^ \n\r\t])/g,
            pre + 'specialchar'
         ],
         
         /* new lines */
         [
            /\n/g,
            pre + 'newline'
         ]
      ],
      /* reserved words */
      [
         /\b(?:abstract|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|final|finally|for|function|goto|if|implements|in|instanceof|interface|native|new|null|private|protected|prototype|public|return|static|super|switch|synchronized|throw|throws|this|transient|true|try|typeof|var|volatile|while|with)\b/g,
         pre + 'keyword'
      ],
      /* predefined variables */
      [
         /\b(?:Math|Infinity|NaN|undefined|arguments)\b/g,
         pre + 'predef_var'
      ],
      /* predefined functions */
      [
         /\b(?:Array|Boolean|Date|Error|EvalError|Function|Number|Object|RangeError|ReferenceError|RegExp|String|SyntaxError|TypeError|URIError|decodeURI|decodeURIComponent|encodeURI|encodeURIComponent|eval|isFinite|isNaN|parseFloat|parseInt)\b/g,
         pre + 'predef_func'
      ],
      [
         /(?:[A-Z_$])\w*(?=[ \t\n]*\(.*?\n*.*?\))/ig,
         pre + 'function'
      ],
      
      /* signed numbers with decimals and exponential */
      [
         /(?:\b[+-]?\d*\.?\d+)(?:e[+-]?\d*\.?\d+)?|(?:\be[+-]?\d*\.?\d+)/ig,
         pre + 'number'
      ],
      /* signed hexadecimals without exponential */
      [
         /(?:\b[+-]?0x[\dA-F]*\.?[\dA-F]*)/ig,
         pre + 'number'
      ],
      /* symbols */
      [
         /(?:~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|)/g,
         pre + 'symbol'
      ],
      [
         /(?:\+\+|--)(?!\s*\d)/g,
         pre + 'symbol'
      ],
      /* html entities */
      [
         /(?:&[^ \n\r\t]*?;)/g,
         pre + 'symbol'
      ],
      /* regular expressions (detects single-line comments but it's ok as comments are longer!) */
      [
         /(?=[^\\]{1})(?:\/.+?[^\\\n]{1}\/g?i?m?\b)/g,
         pre + 'regexp'
      ],
      [
         /\{|\}/g,
         pre + 'cbracket'
      ],
      /* new lines */
      [
         /\n/g,
         pre + 'newline'
      ]
   ]
});
}(window.g3 = window.g3 || {}, jQuery, window, document));
