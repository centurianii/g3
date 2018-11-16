(function(g3, window, document, undefined){
/**
 * @constructs g3.measure
 * @summary
 * Returns an object that contains utility methods and properties that calculate 
 * the dimensions and position of an element, window, document or viewport or the 
 * value and unit in a string. 
 * @desc
 * In case of a number object, it behaves as in the case of a string. 
 * 
 * When the passed argument is:
 * 
 * - `window.screen` or `"screen"`: it returns `{width: <value>, height: <value>}`,
 * 
 * - `"viewport"`: returns `{left: <value>, top: <value>, width: <value>, height: <value>}`,
 *      `left` and `top` values are measured from document respective edges and 
 *      give the amount of scroll,
 * 
 * - `document` or `"document"`: returns `{width: <value>, height: <value>}`,
 * 
 * - a node reference: returns immediate on built the following object
 * 
 * ```
 * {
 *    outerWidth: ..., 
 *    innerWidth: ..., 
 *    outerHeight: ..., 
 *    innerHeight: ..., 
 *    width: ..., 
 *    height: ..., 
 *    left: ...,              // from document left
 *    top: ...,               // from document top
 *    viewLeft:...,           // from viewport left
 *    viewTop: ...,           // from viewport top
 *    viewRight: ...,         // from viewport right
 *    viewBottom: ...,        // from viewport bottom
 *    visible: ...
 *    intersect: <function>,
 *    adjucent: <function>
 * }
 * ```
 * 
 * - number: returns object `{value: <value>, unit: undefined}`,
 * 
 * - `<string>`: returns object `{value: <value>, unit: <value>}` as it parses 
 *      numeric values from the start extracting the number from the unit part. 
 *      If there is not a unit, it uses `undefined` by default. If number can't 
 *      be found, returns null,
 * 
 * - anything else: returns `null`.
 * 
 * `outer*` values include `border + padding + content`. `inner*` values don't 
 * include border. 
 * 
 * Property `visible` is a boolean `true` if the element is visible on viewport, 
 * `false` if not or, a string that is built up from the words: `top`, `right`, 
 * `bottom` and `left` if the relevant sides of the element are visible.
 * 
 * @param {String|Object} el A string or a node reference that we want to 
 *    calculate it's dimensions and position
 * @param {Window} win A window reference or if null, the current one
 * @return {Boolean|null|Object} Depending on passed `el` argument the return 
 *    contains different values
 * @version 0.1
 * @author https:/github.com/centurianii
 * @copyright MIT licence
 */
g3.measure = function(el, win){
   if(!win || (win.self !== win) || (win.window !== win))
      win = window;

   var width,
       height,
       left,
       top,
       outerWidth,
       innerWidth,
       outerHeight,
       innerHeight,
       obj,
       tmp,
       unit;
   
   if((el === win.screen) || (el === 'screen')){
      if(el === 'screen')
         el = win.screen;
      return {'width': el.width, 'height': el.height};
   }else if(el === 'viewport'){
      left = win.document.documentElement.scrollLeft || win.document.body.parentNode.scrollLeft || win.document.body.scrollLeft || win.pageXOffset;
      top = win.document.documentElement.scrollTop || win.document.body.parentNode.scrollTop || win.document.body.scrollTop || win.pageYOffset;
      width = win.document.documentElement.clientWidth;
      height = win.document.documentElement.clientHeight;
      return {'left': left, 'top': top, 'width': width, 'height': height};
   }else if((el === win.document) || (el === 'document')){
      if(el === 'document')
         el = win.document;
      width = win.document.documentElement.scrollWidth;
      height = win.document.documentElement.scrollHeight;
      return {'width': width, 'height': height};
   }else if(el && (typeof el === 'object') && ((el.nodeType === 1) || (el.nodeType === 3))){
      outerWidth = el.offsetWidth;
      innerWidth = el.clientWidth;
      outerHeight = el.offsetHeight;
      innerHeight = el.clientHeight;
      obj = {
         'outerWidth': outerWidth,
         'innerWidth': innerWidth,
         'outerHeight': outerHeight,
         'innerHeight': innerHeight,
         
         /**
          * @summary
          * If the element is fully visible/not visible returns `true`/`false`.
          * @desc
          * For partially visible elements it returns an object: 
          * `{viewLeft: <value>, viewTop: <value>, width: <value>, height: <value>}` of 
          * the intersection between viewport and element's area which is considered that 
          * one who contains `border + padding + content`. The `width` and `height` refer 
          * to the visible area of the element.
          * 
          * If you want to calculate distances from adjucent sides of viewport see 
          * {@link g3.measure#adjucent}.
          * @function g3.measure#intersect
          * @memberof g3.measure
          * @return {Boolean|Object}
          */
         intersect: function(){return _intersect.call(this, win);},
         
         /**
          * @summary
          * If the element is not visible returns false.
          * 
          * @desc
          * For fully/partially visible elements it returns an object: 
          * `{left: <value>, top: <value>, right: <value>, bottom: <value>}` of the
          * distances between the element's area and the sides of the viewport so that 
          *  `left` counts from left side, `right` from right side etc.
          * @function g3.measure#adjucent
          * @memberof g3.measure
          * @return {false|Object}
          */
         adjucent: function(){return _adjucent.call(this, win);}
      };
      //sets 'width', 'height'
      _size.call(obj, el, win);
      //sets 'left', 'top', 'viewLeft', 'viewTop', 'viewBottom', 'viewRight'
      _position.call(obj, el, win);
      //sets 'visible'
      _visible.call(obj, win);
      return obj;
   }else if(typeof el === 'number')
      return {'value': el, 'unit': undefined};
   else if((typeof el === 'string') && (el !== '')){
      tmp = el.match(/[^\+\-\s0-9\.;]+/gi);
      if(!tmp)
         unit = undefined;
      else
         unit = tmp[0];
      tmp = parseFloat(el);
      //try to avoid this interpreter bug (or ECMA 'standard'): isNaN(null) === false! (get lost!%@)
      //although: isNaN(parseFloat(null)) === true! (correct)
      if(isNaN(tmp))
         return null;
      else
         return {'value': tmp, 'unit': unit};
   }else
      return null;
   
   function _size(el, win){
      var width, height;
      if(win.getComputedStyle){
         width = parseFloat(win.getComputedStyle(el).getPropertyValue('width'));
         height = parseFloat(win.getComputedStyle(el).getPropertyValue('height'));
      //IE<=8
      }else if(el.currentStyle){
         width = parseFloat(el.currentStyle.getAttribute('width'));
         height = parseFloat(el.currentStyle.getAttribute('height'));
      //padding errors!
      }else{
         width = this['innerWidth'];
         height = this['innerHeight'];
      }
      this['width'] = width;
      this['height'] =  height;
      return this;
   }
   
   function _position(el, win){
      //use viewport
      _inViewport.call(this, el, win);
      if(el.getBoundingClientRect){
         var view = g3.measure('viewport', win);
         this['left'] =  this['viewLeft'] + view['left'];
         this['top'] = this['viewTop'] + view['top'];
      }
      return this;
   }
   
   function _inViewport(el, win){
      if(el.getBoundingClientRect){
         var tmp = el.getBoundingClientRect();
         this['viewTop'] = tmp['top'];
         this['viewLeft'] = tmp['left'];
         this['viewBottom'] = tmp['bottom'];
         this['viewRight'] = tmp['right'];
      }else{
         var view = g3.measure('viewport', win);
         //move tree upwards
         var x = 0, y = 0;
         while(el != null){
            x += el.offsetLeft;
            y += el.offsetTop;
            el = el.offsetParent;
         }
         this['left'] =  x;
         this['top'] = y;
         this['viewTop'] = this['top'] - view['top'];
         this['viewLeft'] = this['left'] - view['left'];
         this['viewBottom'] = this['viewTop'] + this['outerHeight'];
         this['viewRight'] = this['viewLeft'] + this['outerWidth'];
      }
      return this;
   }
   
   function _visible(win){
      var view = g3.measure('viewport', win),
          result = 0;
      //x-axis collision: right, left sides
      if((this['viewTop'] < view['height']) && (this['viewBottom'] > 0)){
         if((this['viewRight'] >= 0) && (this['viewRight'] <= view['width']))
            result += 2;
         if((this['viewLeft'] >= 0) && (this['viewLeft'] <= view['width']))
            result += 8;
      }
      //y-axis collision: top, bottom sides
      if((this['viewRight'] > 0) && (this['viewLeft'] < view['width'])){
         if((this['viewTop'] >= 0) && (this['viewTop'] <= view['height']))
            result += 1;
         if((this['viewBottom'] >= 0) && (this['viewBottom'] <= view['height']))
            result += 4;
      }
      //now binary 'result' contains false or side collision with this order:
      //left-bottom-right-top
      if(result === 0)
         this.visible = false;
      else if(result === 15)
         this.visible =  true;
      else{
         var tmp, res = '';
         tmp = result & parseInt('0001', 2);
         if(Number(tmp).toString(2).slice(0, 1) === '1')
            res += 'top ';
         tmp = result & parseInt('0010', 2);
         if(Number(tmp).toString(2).slice(0, 1) === '1')
            res += 'right ';
         tmp = result & parseInt('0100', 2);
         if(Number(tmp).toString(2).slice(0, 1) === '1')
            res += 'bottom ';
         tmp = result & parseInt('1000', 2);
         if(Number(tmp).toString(2).slice(0, 1) === '1')
            res += 'left';
         res = res.replace(/^\s+|\s+$/g, '');
         this.visible = res;
      }
   }
   
   function _intersect(win){
      var visible = this.visible,
          viewport = g3.measure('viewport', win),
          viewLeft, viewTop, width, height;
      
      if(visible === true)
         return true;
      if(visible === false)
         return false;
      //left, width
      if(visible.indexOf('left') >= 0){
         viewLeft = this.viewLeft;
         if(visible.indexOf('right') >= 0)
            width = this.outerWidth;
         else
            width = viewport.width - this.viewLeft;
      }else{
         viewLeft = 0;
         if(visible.indexOf('right') >= 0)
            width = this.viewRight;
         else
            width = viewport.width;
      }
      //top, height
      if(visible.indexOf('top') >= 0){
         viewTop = this.viewTop;
         if(visible.indexOf('bottom') >= 0)
            height = this.outerHeight;
         else
            height = viewport.height - this.viewTop;
      }else{
         viewTop = 0;
         if(visible.indexOf('bottom') >= 0)
            height = this.viewBottom;
         else
            height = viewport.height;
      }
      return {'viewLeft': viewLeft, 'viewTop': viewTop, 'width': width, 'height': height};
   }
   
   function _adjucent(win){
      var visible = this.visible,
          viewport = g3.measure('viewport', win),
          left, top, right, bottom;
      
      if(visible === false)
         return false;
      if(visible === true)
         visible = 'top right bottom left';
      //left
      if(visible.indexOf('left') >= 0)
         left = this.viewLeft;
      else
         left = 0;
      //right
      if(visible.indexOf('right') >= 0)
         right = viewport.width - this.viewRight;
      else
         right = 0;
      //top
      if(visible.indexOf('top') >= 0)
         top = this.viewTop;
      else
         top = 0;
      //bottom
      if(visible.indexOf('bottom') >= 0)
         bottom = viewport.height - this.viewBottom;
      else
         bottom = 0;
      return {'left': left, 'top': top, 'right': right, 'bottom': bottom};
   }
};
}(window.g3 = window.g3 || {}, window, document));
