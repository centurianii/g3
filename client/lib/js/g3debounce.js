/*******************************Function debounce*******************************
 * Implements a debounce function that restricts it's repeated calls to one at 
 * the end and/or the beginning of a time window where successive calls have a
 * time distance less than that defined in user's arguments. 
 * This implementation presents some unique capabilities:
 * 1. It contains an argument passing mechanism through the g3.debounce() function 
 *    even if the caller can't pass arguments at all! 
 * 2. We can pass the context of 'this' so that it can be used inside the function!
 * 3. It detects and passes an implicit argument from the caller as it happens
 *    in event handling functions.
 * 
 * From version v.0.2 if the caller of function 'func' passes an implicit argument 
 * and also exists 'options.context' then, their order into the final called 
 * function is 'options.context' and then the implicit argument.
 * 
 * @module {g3}
 * @function {g3.debounce}
 * @public
 * @param {Function} 'func' is the function that it will be called eventually.
 * @param {Object} 'options' is an object consisting of properties as options
 * - 'delay': (Number) successive calls that have a time distance less than this
 *      number are considered as a time window that does not call the function, 
 * - 'context': (Object) is the context under which the function will be 
 *      executed. if it is omitted then the function is called as usual,
 * - 'fireFirst': (Boolean) if we want to call the function at the start of the 
 *      time window, defaults to false,
 * - 'fireLast': (Boolean) if we want to call the function at the end of the 
 *      time window, defaults to true except when 'firefirst' is true (turns to false).
 * @param {Anything} 'arg0' to 'arg9' are arguments that are passed to function
 * 'func', the first argument.
 * @return {Anything} Anything that the passed function returns.
 *
 * @version 0.2
 * @author Scripto JS Editor by Centurian Comet.
 * @copyright MIT licence.
 ******************************************************************************/
(function(g3, $, window, document, undefined){
   g3.debounce = function(func, options, arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9){
      var state = {
         pid: null,
         last: 0
      };
      if(typeof func !== 'function')
         return null;
      if(!options || (typeof options.delay !== 'number'))
         return func;
      //default options.fireFirst = false
      if(typeof options.fireFirst === 'undefined')
         options.fireFirst = false;
      //default options.fireLast = false when options.fireFirst === true
      if((options.fireFirst === true) && (typeof options.fireLast === 'undefined'))
         options.fireLast = false;
      //default options.fireLast
      if(typeof options.fireLast === 'undefined')
         options.fireLast = true;
      
      //usually 'callback()' is called without arguments, a.k.a event handler!
      //but, arguments do passed through the closure above!
      //we use Function.call() instead of Function.apply() because named 
      //arguments do cover the sooo poor case of just an array argument that 
      //Function.apply() imposes(!!)
      function callback(evt){
         var tmp = new Date().getTime();
         var elapsed = tmp - state.last;
         state.last = new Date().getTime();
         function exec(){
            //state.last = new Date().getTime();
            if(!options.context || (typeof options.context != 'object')) {
               if(evt)
                  return func(evt, arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
               else
                  return func(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
            } else {
               if(evt)
                  return func.call(options.context, evt, arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
               else
                  return func.call(options.context, arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
            }
         }
         //execute at start
         if(options.fireFirst === true){
            if(elapsed >= options.delay)
               exec();
         }
         //execute at end
         if(options.fireLast === true){
            clearTimeout(state.pid);
            state.pid = setTimeout(exec, options.delay);
         }
      }
      
      return callback;
   }
}(window.g3 = window.g3 || {}, jQuery, window, document));
