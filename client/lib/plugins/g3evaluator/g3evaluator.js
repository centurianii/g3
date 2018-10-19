/*********************************Object evaluator******************************
 * A graphical client testing tool for batch processing javascript commands.
 * It uses eval() and emulates console.log() in all clients even in IE browsers.
 * @module {g3.evaluator}
 *
 * @version 1.1
 * @author Scripto JS Editor by Centurian Comet.
 * @copyright MIT licence, https:/github.com/centurianii.
*******************************************************************************/
(function(g3, $, window, document, undefined){
/*********************************Object evaluator******************************
 * A graphical client testing tool for batch processing javascript commands.
 * It uses eval() and emulates console.log() in all clients even in IE browsers.
 * @module {g3.evaluator}
 *
 * @function {g3.evaluator.getInstance}
 * @constructor
 * @return {Object} It builds the node tree and assigns events on nodes.
 *
 * @object {g3.evaluator.getInstance().console}
 * @public
 * @function {g3.evaluator.getInstance().console.log}
 * @public
 * User's batch commands that contain the string 'console.log(value, n, nofollow)' 
 * are sent to this function that a) calls native 'console.log(value)' and 
 * b) sends output of 'g3.debug(value, n, nofollow).toHtml()' to page's console 
 * area.
 * @param {Type} 'value' an identifier of any type that we want to be analysed.
 * @param {Number} 'n' the maximum depth to look for when the passed identifier 
 * is a complex object, zero-based.
 * @param {Boolean} 'nofollow' if it is true, analysis excludes 'string', 
 * 'array' types and object references, if it is 'string', analysis excludes 
 * 'string' types etc., if it is false, null, empty string '' or anything other 
 * than string, analysis happens to every type as follows:
 * a) natives 'boolean', 'undefined', 'null', 'number', 'date' and 'regexp' are 
 * not analysed, b) references are followed (except circular ones) and 
 * c) 'object', 'function' and 'uknown' types are analysed (see g3.debug).
 * @return {Object} The console object.
 *
 * @function {g3.evaluator.getInstance().$load}
 * @public
 * Load a file with JQuery's '$.load()' method and add all it's contents in a 
 * given node.
 * @param {String|Object} 'selector' is a css selector string or another JQuery 
 * object or a node reference that will hold the file's contents.
 * @param {String} 'url' the file's path.
 * @param {String|Object} 'data' to be sent to the server.
 * @param {Function} 'complete' is a function callback.
 * @return {Object} The evaluator object.
 *
 * @function {g3.evaluator.getInstance().loadFrame}
 * @public
 * Create an iframe inside the given selector node and load the page with the 
 * given url.
 * @param {String|Object} 'selector' is a css selector string or another JQuery 
 * object or a node reference that will hold the iframe.
 * @param {String} 'src' the file's path.
 * @return {Object} The evaluator object.
 *
 * @function {g3.evaluator.getInstance().deleteFrame}
 * @public
 * Delete the iframe loaded with g3.evaluator.getInstance().loadFrame().
 * @param {String|Object} 'selector' is a css selector string or another JQuery 
 * object or a node reference that holds the iframe.
 * @return {Object} The evaluator object.
 *
 * @function {g3.evaluator.getInstance().cloneFrame}
 * @public
 * a) Load an html file to an iframe, b) copy all contents from the frame's body 
 * to the passed selector node, c) copy all contents from the frame's header 
 * to the evaluator's header and d) delete the iframe.
 * @param {String|Object} 'selector' is a css selector string or another JQuery 
 * object or a node reference that will hold the iframe.
 * @param {String} 'src' the file's path.
 * @return {Object} The evaluator object.
 *
 * @function {g3.evaluator.getInstance().removeCloned}
 * @public
 * a) Deletes all of the cloned frame's body contents inside the selector node 
 * and b) deletes all of the cloned frame's header contents from the evaluator's 
 * header.
 * @param {String|Object} 'selector' is a css selector string or another JQuery 
 * object or a node reference that holds the cloned frame's body contents.
 * @return {Object} The evaluator object.
 *
 * @function {g3.evaluator.getInstance().calledFromFrame}
 * @public
 * It is called from a page that will be cloned having been loaded to an iframe.
 * @param {String|Object} 'selector' is a css selector string or another JQuery 
 * object or a node reference that holds the cloned frame's body contents.
 * @return {undefined}.
 *
 * @version 1.0
 * @author Scripto JS Editor by Centurian Comet.
 * @copyright proprietary, not transferable, not disclosed, 
 * copyright https:/github.com/centurianii.
*******************************************************************************/
g3.evaluator = (function(){
   var evaluator;
   /*
    * initialization function:
    * contains event handlers and tree manipulation
    */
   function init(){
      /*
       * 'global' variables
       */
      var nodes = {
         $console: $("form#console pre"), /*see evaluator.console*/
         $frameSrc: $("form#loadFrame input[type='text']"), /*see 'load/remove frame button actions'*/
         frameParent: $('#stub').get(0),
         $idNodes: $("form#html #idHtml"),  /*see 'load body html button actions'*/
         $h_name: $('form#header-addRemoveLib #libName'),   /*see 'add/remove header library button actions'*/
         $h_path: $('form#header-addRemoveLib #libPath'),
         $f_name: $('form#footer-addRemoveLib #footer-libName'), /*see 'add/remove footer library button actions'*/
         $f_path: $('form#footer-addRemoveLib #footer-libPath'),
         $title: $('form#blackboard input#title'),       /*see 'blackboard button actions'*/
         $panel: $('form#addRemovePanel #panelTitle'),   /*see 'add/remove panel button actions'*/
         $blackboard: $('#blackboard textarea')          /*see 'load to blackboard behaviour'*/
      };
      
      /*
       * evaluation function
       * execution context: Function code
       * variable object: Activation object
       * ref.: http://perfectionkills.com/understanding-delete/
       */
      function evalExpr(value, win){
         if(win && (win.self === win) && (win.window == win))
            value = 'window = win;' + value;
         var re = /console.log/g;
         value = value.replace(re, 'evaluator.console.log');
         try{
            eval(value);
         }catch(e){
            //alert(e);
            throw e;
         }
      }
      window.onerror = printError;
      function printError(msg, url, line){
         evaluator.console.log(msg+'\nat: '+url+'\nline: '+line);
         return true;
      }
      
      /*
       * set/edit [contenteditable] nodes
       */
      document.title = $("#header h1").text();
      $("[contenteditable] ~ span").click(function(){
         var $that = $(this);
         
         $that.toggleClass('edit');
         if($that.hasClass('edit'))
            $that.prev().prop('contenteditable', 'true');
         else{
            $that.prev().prop('contenteditable', 'false');
            //$('title', document.getElementsByTagName('head')[0]).text($(this).siblings('h1').text());
            if($("#header h1").get(0) == $that.prev().get(0))
               document.title = $("#header h1").text();
         }
      });
      
      /*
       * load/remove frame button actions
       */
      $("form#loadFrame legend").click(function(){
         $("form#loadFrame div").slideToggle();
      });
      $("form#loadFrame button, form#loadFrame input[type='button']").click(function(event){
         if($(this).val() === 'Load file in frame'){
            evaluator.loadFrame(nodes.frameParent, nodes.$frameSrc.val());
            //$('<iframe>').addClass('TbeFgQ7NMLTOVYjdRDjVMaoN frame').prop('src', nodes.$frameSrc.val()).appendTo('#stub');
         }else if($(this).val() === 'Remove frame'){
            evaluator.deleteFrame(nodes.frameParent);
            //$('#stub iframe').remove();
         }else if($(this).val() === 'Clone frame to stub (JQuery)'){
            evaluator.$load(nodes.frameParent, nodes.$frameSrc.val(), {});
         }else if($(this).val() === 'Clone frame to stub-HEAD'){
            evaluator.cloneFrame(nodes.frameParent, nodes.$frameSrc.val());
         }else if($(this).val() === 'Remove cloned'){
            evaluator.removeCloned(nodes.frameParent);
         }
      });
      
      /*
       * load html button actions
       */
      $("form#html legend").click(function(){
         $("form#html div").slideToggle();
      });
      $("form#html button, form#html input[type='button']").click(function(event){
         if($(this).val() === 'Load'){
            var txt = h_txt = b_txt = '',
                ids = nodes.$idNodes.val().replace(/^\s+|\s+$/g, ''),
                $b_nodes, $h_nodes;
            
            // 1. nodes included/excluded
            if(ids == '')
               ids = [];
            else
               ids = ids.split(/\s+|\s*,\s*|\s*;\s*|\s*\|\s*/);
            // 2. nodes to parse
            if(ids.length > 0){
               // 2.1. Include
               if($('#html #whichHtml option:nth-of-type(1)').prop('selected') == true){
                  $h_nodes = $(ids.toString(), document.getElementsByTagName('head')[0]);
                  $b_nodes = $(ids.toString(), document.body);
               // 2.2. Exclude
               }else if($('#html #whichHtml option:nth-of-type(2)').prop('selected') == true){
                  $h_nodes = $(document.getElementsByTagName('head')[0]).contents();
                  $b_nodes = $(document.body).contents();
                  for(var i = 0; i < ids.length; i++){
                     $h_nodes = $h_nodes.not($(ids[i]));
                     $b_nodes = $b_nodes.not($(ids[i]));
                  }
               }
            }
            // 3. node html
            if(ids.length == 0){
               txt = document.getElementsByTagName('head')[0].outerHTML + '\n';
               txt += document.body.outerHTML + '\n';
               txt = '<!doctype html>\n<html>\n' + txt + '</html>';
            }else{
               // 3.1. header html
               $h_nodes.each(function(){
                  if(this.nodeType == 3)
                     h_txt += this.nodeValue;
                  else if(this.nodeType == 8)
                     h_txt += '<!--'+this.nodeValue+'-->';
                  else
                     h_txt += this.outerHTML;
               });
               h_txt = '<head>' + h_txt + '</head>\n';
               // 3.2. body html
               $b_nodes.each(function(){
                  if(this.nodeType == 3)
                     b_txt += this.nodeValue;
                  else if(this.nodeType == 8)
                     b_txt += '<!--'+this.nodeValue+'-->';
                  else
                     b_txt += this.outerHTML;
               });
               b_txt = '<body>' + b_txt + '</body>\n';
               txt = '<!doctype html>\n<html>\n' + h_txt + b_txt + '</html>\n';
            }
            $(event.target).siblings('textarea').val(txt);
         }else if($(this).val() === 'Clear'){
            $(event.target).siblings('textarea').val('');
         }
      });
      
      /*
       * add/remove header library button actions:
       * input's data-id will become the script's id and
       * input's value will become the script's path
       */
      $("form#header-addRemoveLib legend").click(function(){
         $("form#header-addRemoveLib div").slideToggle();
      });
      $("form#header-addRemoveLib button, form#header-addRemoveLib input[type='button']").click(function(event){
         var found, $tmp, id, txt;
         
         if($(this).val() === 'Add'){
            found = false;
            if(nodes.$h_name.val()){
               $('form#header-libraries label').each(function(){
                  if($(this).text() === nodes.$h_name.val()){
                     found = true;
                     return false;
                  }
               });
               if(!found){
                  id = g3.utils.randomString(5);
                  txt = '<li><label class="label" for="' + id + '">' +
                        nodes.$h_name.val() +'</label><input type="checkbox" id="' +
                        id + '" data-id="' + g3.utils.randomString(5) + '" value="' + nodes.$h_path.val() + '" /></li>';
                  $("#header-libraries ol").append(txt);
               }
            }
         }else if($(this).val() === 'Remove'){
            found = -1;
            if(nodes.$h_name.val()){
               $('form#header-libraries li label').each(function(ndx){
                  if($(this).text() === nodes.$h_name.val()){
                     found = ndx;
                     return false;
                  }
               });
               if(found > -1){
                  $tmp = $("form#header-libraries li").eq(found);
                  // remove script
                  id = $tmp.find('input').data('id');
                  $(document.getElementsByTagName('head')[0]).children('[id='+id+']').remove();
                  // remove list
                  $tmp.remove();
               }
            }
         }
      });
      
      /*
       * add/remove footer library button actions:
       * input's data-id will become the script's id and
       * input's value will become the script's path
       */
      $("form#footer-addRemoveLib legend").click(function(){
         $("form#footer-addRemoveLib div").slideToggle();
      });
      $("form#footer-addRemoveLib button, form#footer-addRemoveLib input[type='button']").click(function(event){
         var found, $tmp, id, txt;
         
         if($(this).val() === 'Add'){
            found = false;
            if(nodes.$f_name.val()){
               $('form#footer-libraries label').each(function(){
                  if($(this).text() === nodes.$f_name.val()){
                     found = true;
                     return false;
                  }
               });
               if(!found){
                  id = g3.utils.randomString(5);
                  txt = '<li><label class="label" for="' + id + '">' +
                        nodes.$f_name.val() +'</label><input type="checkbox" id="' +
                        id + '" data-id="' + g3.utils.randomString(5) + '" value="' + nodes.$f_path.val() + '" /></li>';
                  $("#footer-libraries ol").append(txt);
               }
            }
         }else if($(this).val() === 'Remove'){
            found = -1;
            if(nodes.$f_name.val()){
               $('form#footer-libraries li label').each(function(ndx){
                  if($(this).text() === nodes.$f_name.val()){
                     found = ndx;
                     return false;
                  }
               });
               if(found > -1){
                  $tmp = $("form#footer-libraries li").eq(found);
                  // remove script
                  //$(document.getElementById($tmp.find('input').data('id'))).remove();
                  $('#' + $tmp.find('input').data('id')).remove();
                  // remove list
                  $tmp.remove();
               }
            }
         }
      });
      
      /*
       * load all header libraries check box behaviour
       */
      $("#header-loadAll").prop('checked', false);
      $("#header-loadAll").on('change', function(event){
         var delay = 0;
         $('form#header-libraries input[type="checkbox"]').each(function(){
            var $node = $(this);
            setTimeout(function(){$node.trigger('click')}, delay += 300);
         });
      });
      
      /*
       * load all footer libraries check box behaviour
       */
      $("#footer-loadAll").prop('checked', false);
      $("#footer-loadAll").on('change', function(event){
         var delay = 0;
         $('form#footer-libraries input[type="checkbox"]').each(function(){
            var $node = $(this);
            setTimeout(function(){$node.trigger('click')}, delay += 300);
         });
      });
      
      /*
       * Slide on/off header libraries
       */
      $("form#header-libraries legend").click(function(){
         $("form#header-libraries div").slideToggle();
      });
      
      /*
       * header library check box behaviours
       */
      $('#memorize-header').prop('checked', true);
      $("#header-libraries").on('change', 'input', function(event){
         var $that = $(this), $first, $last, x, y, tmp, 
             $checked = $("#header-libraries input:checked"), 
             length,
             $script = $(document.getElementsByTagName('head')[0]).children('[id='+$that.data('id')+']'),
             frozen = $('#memorize-header').prop('checked');
         
         if($that.is('#memorize-header'))
            return;
         
         if(frozen)
            length = $checked.length - 1; // do NOT include frozen checkbox!
         else
            length = $checked.length;
         
         // 1. No link tag exists but 'input' is checked
         if($script.length === 0 && $that.prop("checked")){
            // 1.1. set attribute
            //$that.attr('checked', true);
            // 1.2. remove duplicates coming from iframe
            y = $that.val();
            tmp = y.indexOf('/' + document.location.hostname + '/');
            if(tmp >= 0)
               y = y.slice(tmp + document.location.hostname.length + 1);
            $(document.getElementsByTagName('head')[0]).children('link').filter(function(ndx){
               x = $(this).prop('href');
               tmp = x.indexOf('/' + document.location.hostname + '/');
               if(tmp >= 0)
                  x = x.slice(tmp + document.location.hostname.length + 1);
               if(x == y)
                  return true;
               else
                  return false;
            }).remove();
            // 1.3. insert a new link tag
            // 1.3.1. after all existed links having property 'id'
            if(length > 1){
               $last = $(document.getElementsByTagName('head')[0]).children('[id]').filter(
                  function(ndx){
                     if($(this).prop('id').length)
                        return true;
                     else
                        return false;
                  }
               ).last();
               if($last.length)
                  $('<link></link>').attr({'rel': 'stylesheet', 'media': 'screen', 'id': $that.data('id'), 'type': 'text/css', 'href': $that.val()}).insertAfter($last);
               else
                  $('<link></link>').attr({'rel': 'stylesheet', 'media': 'screen', 'id': $that.data('id'), 'type': 'text/css', 'href': $that.val()}).append(document.getElementsByTagName('head')[0]);
            // 1.3.2. insert the first link before all existed links
            }else{
               $first = $(document.getElementsByTagName('head')[0]).children('link, style').first();
               $('<link></link>').attr({'rel': 'stylesheet', 'media': 'screen', 'id': $that.data('id'), 'type': 'text/css', 'href': $that.val()}).insertBefore($first);
            }
            // 1.4. re-arrange list of libraries
            if(!frozen){
               // 1.4.1. move first 'li' tag of 'input' above all 'li's
               if(($checked.length == 1) && ($("#header-libraries li").length > 1))
                  $that.closest('li').insertBefore($("#header-libraries li").first());
               // 1.4.2. move 'li' tag of 'input' just under previous checked 'li's
               else if($checked.length > 1)
                  $that.closest('li').insertAfter($checked.eq($checked.length - 2).closest('li'));
            }
         }
         
         // 2. Link tag exists but 'input' is unchecked
         if($script.length > 0 && !$that.prop("checked")){
            // 2.1. remove attribute
            //$that.attr('checked', false);
            // 2.2. remove relative script
            $script.remove();
            // 2.3. move 'li' tag of 'input' just under last checked
            if(!frozen && (length > 0))
               $that.closest('li').insertAfter($checked.last().closest('li'));
         }
      });
      
      /*
       * trigger header library check box events on load & remove existed header scripts
       */ 
      $("#header-libraries input").each(function(){
         var $that = $(this);
         
         if($that.is('#memorize-footer'))
            return;
         
         // 1. load library
         if($that.prop("checked"))
            $that.trigger('change');
         
         // 2. remove library if loaded
         else{
            $(document.getElementsByTagName('head')[0]).children('[id='+$that.data('id')+']').remove();
         }
      });
      
      /*
       * Slide on/off footer libraries
       */
      $("form#footer-libraries legend").click(function(){
         $("form#footer-libraries div").slideToggle();
      });
      
      /*
       * footer library check box behaviours
       */
      $('#memorize-footer').prop('checked', true);
      $("#footer-libraries").on('change', 'input', function(event){
         var $that = $(this), $last, x, y, tmp, 
             $checked = $("#footer-libraries input:checked"),
             length,
             $script = $(document.getElementById($(this).data('id'))),
             frozen = $('#memorize-footer').prop('checked');
         
         if($that.is('#memorize-footer'))
            return;
         
         if(frozen)
            length = $checked.length - 1; // do NOT include frozen checkbox!
         else
            length = $checked.length;
         
         // 1. No script tag exists but 'input' is checked
         if(($script.length === 0) && $that.prop("checked")){
            // 1.1. set attribute
            //$that.attr('checked', true);
            // 1.2. remove duplicates coming from iframe
            y = $that.val();
            tmp = y.indexOf('/' + document.location.hostname + '/');
            if(tmp >= 0)
               y = y.slice(tmp + document.location.hostname.length + 1);
            $(document.getElementsByTagName('body')[0]).children('script').filter(function(ndx){
               x = $(this).prop('src');
               tmp = x.indexOf('/' + document.location.hostname + '/');
               if(tmp >= 0)
                  x = x.slice(tmp + document.location.hostname.length + 1);
               if(x == y)
                  return true;
               else
                  return false;
            }).remove();
            // 1.3. insert a new script tag
            tmp = $('<script></script>').attr({'id': $that.data('id'), 'type': 'text/javascript', 'src': $that.val()}).appendTo('body');
            tmp[0].setAttribute("async", "");
             // 1.4. re-arrange list of libraries
            if(!frozen){
               // 1.4.1. move first 'li' tag of 'input' above all 'li's
               if(($checked.length == 1) && ($("#footer-libraries li").length > 1))
                  $that.closest('li').insertBefore($("#footer-libraries li").first());
               // 1.4.2. move 'li' tag of 'input' just under previous checked 'li's
               else if($checked.length > 1)
                  $that.closest('li').insertAfter($checked.eq($checked.length - 2).closest('li'));
            }
         }
         
         // 2. Script tag exists but 'input' is unchecked
         if($script.length && !$that.prop("checked")){
            // 2.1. remove attribute
            //$that.attr('checked', false);
            // 2.2. remove relative script
            $script.remove();
            // 2.3. move 'li' tag of 'input' just under last checked
            if(!frozen && (length > 0))
               $that.closest('li').insertAfter($checked.last().closest('li'));
         }
      });
      
      /*
       * trigger footer library check box events on load & remove existed body scripts
       */ 
      $("#footer-libraries input").each(function(){
         var $that = $(this);
         
         if($that.is('#memorize-footer'))
            return;
         
         // 1. load library
         if($that.prop("checked"))
            $that.trigger('change');
         
         // 2. remove library if loaded
         else{
            $('#' + $that.data('id')).remove();
         }
      });   
      
      /*
       * private variables for active panel, tab title and data
       */
      var panelState = {
         $tabbedData: null,   /*the active panel*/
         $title: null,        /*the active tab title*/
         $data: null          /*the data of the active tab title*/
      };
      
      /*
       * state of common buttons 'save' and 'save as': 0-disabled, 1-enabled
       * and a handler 'apply()' that accepts a 'state' object as argument
       */
      var buttonState = {
         buttons: {
            save: null,
            saveAs: null
         },
         state: {
            save: 0,
            saveAs: 0
         },
         //apply/remove 'disabled' property on buttons
         apply: function(obj){
            if(obj){
               this.state.save = obj.save;
               this.state.saveAs = obj.saveAs;
            }
            if(this.state.save === 0)
               $(this.buttons.save).prop('disabled', 'disabled');
            else
               $(this.buttons.save).removeAttr('disabled');
            if(this.state.saveAs === 0)
               $(this.buttons.saveAs).prop('disabled', 'disabled');
            else
               $(this.buttons.saveAs).removeAttr('disabled');
            return this;
         },
         //create object references to actual buttons
         init: function(){
            var self = this;
            $("form#blackboard button, form#blackboard input[type='button']").each(function(){
               if($(this).val() === 'Save')
                  self.buttons.save = this;
               if($(this).val() === 'Save to a new tab')
                  self.buttons.saveAs = this;
            });
            return this;
         }
      };
      
      /*
       * equal board height check box behaviour
       */
      $("#boardHeights").prop('checked', false);
      $("#boardHeights").on('change', function(event){
         if($(this).prop('checked'))
            $('#boardWrapper > *').each(function(){
               $(this).addClass('height');            
            });
         else
            $('#boardWrapper > *').each(function(){
               $(this).removeClass('height');
            });
      }).change();
      
      /*
       * single column board width check box behaviour
       */
      $("#boardWidthSingle").prop('checked', false);
      $("#boardWidthSingle").on('change', function(event){
         if($(this).prop('checked'))
            $('#boardWrapper > *').each(function(){
               $(this).addClass('width');            
            });
         else
            $('#boardWrapper > *').each(function(){
               $(this).removeClass('width');
            });
      }).change();
      
      /*
       * disable panels & buttons initially
       */
      if(!panelState.$tabbedData){
         $('#tabbedDataWrapper .tabbedData .titleBar .title, #tabbedDataWrapper .tabbedData .tabBar .title').removeClass('enabled');
         buttonState.init().apply();
      }
      
      /*
       * blackboard button actions
       */
      $("form#blackboard button, form#blackboard input[type='button']").click(function(event){
         var lang = $('#lang option:selected').val();
         if($(this).val() === 'Execute!'){
            evaluator.console.pile = false;
            evalExpr($(event.target).siblings('textarea').val());
         }else if(panelState.$data && $(this).val() === 'Save'){
            if(!nodes.$title.val() || (nodes.$title.val() !== panelState.$title.text())){
               nodes.$title.after('<span id = "message"><span style="color: red; padding: 0 2px;">Error on title!</span><span id="suggestedTitle" style="cursor: pointer"> Suggested: \''+panelState.$title.text()+'\' (click to load)</span></span>');
            }else{
               panelState.$data.find('pre').
               removeClass('g3Highlight').
               attr('data-lang', lang).
               text(g3.utils.printHTML($(event.target).siblings('textarea').val())).
               g3('Highlight', {destroy: 'ht', name: 'ht', url: '../../view/g3Highlight/'});
            }
         }else if(panelState.$tabbedData && ($(this).val() === 'Save to a new tab')){
            //find tab info at closest parent
            var titles = [], $tabs, length = 1;
            if(panelState.$title)
               $tabs =  panelState.$title.closest('.tabs');
            else
               $tabs = $('.tabs', panelState.$tabbedData).eq(0);
            $tabs.find('.title').each(function(){
               titles.push($(this).text());
            });
            length += $('.title', $tabs).length;
            if(!nodes.$title.val() || ($.inArray(nodes.$title.val(), titles) >= 0)){
               if(nodes.$title.next('#message').length == 0)
                  nodes.$title.after('<span id = "message"><span style="color: red; padding: 0 2px;">Error on title!</span><span id="suggestedTitle" style="cursor: pointer"> Suggested: \'Tab '+length+'\' (click to load)</span></span>');
            }else{
               $tabs.append('<div class="tabBar"><div class="title">' + g3.utils.printHTML(nodes.$title.val()) + '</div><div class="close">X</div></div>');
               var $newData;
               if(panelState.$data)
                  $newData = $('<div class="data"><pre data-lang="' + lang + '"></pre></div>').appendTo(panelState.$data.closest('.tabs'));
               else
                  $newData = $('<div class="data"><pre data-lang="' + lang + '"></pre></div>').appendTo($('.tabs', panelState.$tabbedData).eq(1));
               $('pre', $newData).
                  html(g3.utils.printHTML($(event.target).siblings('textarea').val())).
                  g3('Highlight', {destroy: 'ht', name: 'ht', url: '/lib/plugins/g3Highlight/'});
               if(panelState.$title)
                  $('pre', $newData).closest('.data').addClass('hide');
            }
         }else if($(this).val() === 'Clear'){
            $(event.target).siblings('textarea').val('').end().siblings('[id=title]').val('');
         }
      });
      
      /*
       * console button actions
       */
       $("form#console button, form#console input[type='button']").click(function(event){
         if($(this).val() === 'Clear'){
            nodes.$console.html('');
         }
      });
      
      /*
       * add/remove panel button actions:
       * label's text will become the script's id and
       * input's value will become the script's path
       */
      $("form#addRemovePanel legend").click(function(){
         $("form#addRemovePanel div").slideToggle();
      });
      $("form#addRemovePanel button, form#addRemovePanel input[type='button']").click(function(event){
         if($(this).val() === 'Add'){
            var found = false;
            if(nodes.$panel.val()){
               $('#tabbedDataWrapper .tabbedData .titleBar .title').each(function(){
                  if($(this).text() === nodes.$panel.val()){
                     found = true;
                     return false;
                  }
               });
               if(!found){
                  var txt = '<div class="gridTabbedData"><div class="tabbedData"><div class="titleBar"><div class="wrap"><p class="title">' +
                  nodes.$panel.val() + '</p><button class="load">Load tab</button></div></div><div class="tabs"></div><div class="tabs"></div></div></div>';
                  $('#tabbedDataWrapper').append(txt);
               }
            }
         }else if($(this).val() === 'Remove'){
            var found = -1;
            if(nodes.$panel.val()){
               $('#tabbedDataWrapper .tabbedData .titleBar .title').each(function(ndx){
                  if($(this).text() === nodes.$panel.val()){
                     $(this).closest('.tabbedData').closest('.gridTabbedData').remove();
                     return false;
                  }
               });
            }
         }
      });
      
      /*
       * next to title error message behaviour
       */
      $('form#blackboard').on('click', 'span#suggestedTitle', function(){
            var tmp = $(this).text().match(/'(.*)'/);
            $('form#blackboard input#title').val(tmp[1]);
            $('form#blackboard #message').remove();
      });
      
      /*
       * equal panel height check box behaviour
       */
      $("#panelHeights").prop('checked', false);
      $("#panelHeights").on('change', function(event){
         if($(this).prop('checked'))
            $('.tabbedData').each(function(){
               $(this).addClass('height');            
            });
         else
            $('.tabbedData').each(function(){
               $(this).removeClass('height');            
            });
      }).change();
      
      /*
       * single column panel width check box behaviour
       */
      $("#panelWidthSingle").prop('checked', false);
      $("#panelWidthSingle").on('change', function(event){
         if($(this).prop('checked'))
            $('.gridTabbedData').each(function(){
               $(this).addClass('width');            
            });
         else
            $('.gridTabbedData').each(function(){
               $(this).removeClass('width');            
            });
      }).change();
      
      /*
       * panel title behaviour: '.tabbedData .titleBar .title'
       * delegator on '.tabbedDataWrapper'
       * defines private 'panelState.$tabbedData' variable
       */
      $('#tabbedDataWrapper').on('click', '.tabbedData .titleBar .title', function(event){
         //repeated clicks on panel title
         if(panelState.$tabbedData && (panelState.$tabbedData.find('.titleBar .title').is($(this))))
            return false;
         //enable 'save as' button
         buttonState.apply({saveAs: 1});
         $newTabbedData = $(this).closest('.tabbedData');
         //disable 'save' button and all panel titles on first click
         if(!panelState.$tabbedData){
            buttonState.apply({save: 0});
            $('.tabbedData .titleBar .title').removeClass('enabled'); //this panel's title is set lower
         //disable previous 'save' button, panel title and tab title when a new panel is activated
         }else if(!$newTabbedData.is(panelState.$tabbedData)){
            buttonState.apply({save: 0});
            panelState.$tabbedData.find('.titleBar .title').removeClass('enabled');
            //panelState.$tabbedData.find('.titleBar .title').addClass('visited');
            //if a tab title fired this event (see tab title behaviours), let 
            //private 'panelState.$title' and 'panelState.$data' to be handled by 
            //that handler else, nullify them here
            if(panelState.$title && !event.tabbedData){
               panelState.$title.removeClass('enabled');
               panelState.$title.addClass('visited');
               panelState.$title = null;
               panelState.$data = null;
            }
         }
         //enable panel's title
         $(this).addClass('enabled');
         //define new private 'panelState.$tabbedData'
         panelState.$tabbedData = $newTabbedData;
      });
      
      /*
       * load to blackboard behaviour: '.tabbedData .titleBar .load'
       * delegator on '.tabbedDataWrapper'
       */
      $('#tabbedDataWrapper').on('click', '.tabbedData .titleBar .load', function(){
         if(panelState.$tabbedData){
            var tmp = '';
            panelState.$tabbedData.find('.tabs .data').each(function(){
               if(!$(this).hasClass('hide'))
                  tmp += g3.utils.revertPrintHTML($(this).find('pre').text());
            });
            nodes.$blackboard.val(tmp);
            if(panelState.$title)
               $('input#title').val(g3.utils.revertPrintHTML(panelState.$title.text()));
         }
      });
      
      /*
       * tab title behaviours: '.tabbedData .tabs .tabBar .title'
       * delegator on '.tabbedDataWrapper'
       * defines private 'panelState.$tabbedData', 'panelState.$title' and 'panelState.$data' variables
       */
      $('#tabbedDataWrapper').on('click', '.tabbedData .tabs .tabBar .title', function(event){
         var $newTab = $(this);
         //toggle tab title and data on repeated clicks, also, if no tab is enabled 
         //then, nullify variables 'panelState.$title' and 'panelState.$data' and disable 'save' button
         if(panelState.$title && panelState.$title.is($newTab)){
            panelState.$title.toggleClass('enabled');
            if(panelState.$title.hasClass('enabled')){
               $('.data', panelState.$title.closest('.tabbedData')).each(function(){
                  if(panelState.$data.is($(this)))
                     panelState.$data.removeClass('hide');
                  else
                     $(this).addClass('hide');
               });
            }else{
               $('.data', panelState.$title.closest('.tabbedData')).each(function(){
                  $(this).removeClass('hide');
               });
               buttonState.apply({save: 0});
               panelState.$title = null;
               panelState.$data = null;
            }
            return false;
         }
         //when jumping to another panel, add visited to previous tab title if exists
         if(panelState.$tabbedData && panelState.$title && !panelState.$tabbedData.is($newTab.closest('.tabbedData')))
            panelState.$title.addClass('visited');
         //remove all visited tab titles of this panel
         $newTab.closest('.tabs').find('.title').removeClass('visited');
         //disable previous tab title
         if(panelState.$title)
            panelState.$title.removeClass('enabled');
         //trigger present panel title behaviour that defines new private 'panelState.$tabbedData'
         // $(this) === $(event.target);
         $newTab.closest('.tabbedData').find('.titleBar .title').trigger({
            type: 'click',
            tabbedData: 'custom'
         });
         //define new private 'panelState.$title'
         panelState.$title = $newTab;
         panelState.$title.addClass('enabled');
         //enable buttons
         buttonState.apply({save: 1, saveAs: 1});
         //find tab index in closest parent
         var $tabs = $newTab.closest('.tabs');
         var tab;
         $('.title', $tabs).each(function(ndx){
            if(this === event.target){
               tab = ndx;
               return false;
            }
         });
         //show relevant content at that index
         $('.data', panelState.$tabbedData).each(function(ndx){
            if(ndx === tab){
               //define new private 'panelState.$data'
               panelState.$data = $(this);
               panelState.$data.removeClass('hide');
            }else
               $(this).addClass('hide');
         });
      });
      
      /*
       * tab close behaviours: '.tabbedData .tabs .tabBar .close'
       * delegators on '.tabs' (do not alter private 'panelState.$tabbedData' variable)
       */
      $('#tabbedDataWrapper').on('click', '.tabbedData .tabs .tabBar .close', function(event){
         //nullify sibling panelState.$title and connected panelState.$data
         if($(this).siblings('.title').is(panelState.$title)){
            buttonState.apply({save: 0});
            panelState.$title = null;
            panelState.$data = null;
         }
         //find tab index in closest parent
         var $tabs = $(this).closest('.tabs');
         var tab;
         $('.close', $tabs).each(function(ndx){
            if(this === event.target){
               tab = ndx;
               return false;
            }
         });
         //remove relevant data at that index
         $('.data', $tabs.closest('.tabbedData')).each(function(ndx){
            if(ndx === tab){
               $(this).remove();
               return false;
            }
         });
         //remove tab bar
         $(this).closest('.tabBar').remove();
      });
      
      var loadOnce = false;
      var clonedOnce = false;
      var cloned = [];
      
      function clone(){
         var framewin = $(nodes.frameParent).children('iframe').get(0).contentWindow,
             head = document.getElementsByTagName('head')[0],
             frameHead = framewin.document.getElementsByTagName('head')[0],
             node;
         //copy all frame's body child nodes except scripts because aren't simple nodes:
         //all browsers fail when scripts from frame's body are added to a node!
         //$(framewin.document.body).contents().appendTo(nodes.frameParent);
         $(framewin.document.body).contents().filter(function(){
            if(this.nodeName && this.nodeName.toLowerCase() === 'script')
               return false;
            else
               return true;
         }).appendTo(nodes.frameParent);
         //now, copy scripts
         $(framewin.document.body).children().filter(function(){
            if(this.nodeName && this.nodeName.toLowerCase() === 'script')
               return true;
            else
               return false;
         }).each(function(){
            /* deprecated
            var args = {'text': $(this).html(), 'tag': nodes.frameParent, 'src': this.src, 'type': this.type, 'id': this.id};
            cloned.push(g3.utils.createScriptNode(args));
            */
            //attention: error in FF if an empty src is set!
            var tmp = (this.src)? $('<script>' + $(this).html() + '</script>').attr({'src': this.src, 'type': this.type, 'id': this.id}).appendTo(nodes.frameParent).get(0) : $('<script>' + $(this).html() + '</script>').attr({'type': this.type, 'id': this.id}).appendTo(nodes.frameParent).get(0);
            cloned.push(tmp);
         });
         //copy frame's head
         $(frameHead).children().each(function(){
            //copy styles
            if(this.nodeName.toLowerCase() === 'style'){
               /* deprecated
               var args = {'cssText': $(this).html(), 'tag': 'head', 'media': this.media, 'type': this.type, 'id': this.id};
               cloned.push(g3.utils.createStyleNode(args));
               */
               cloned.push($('<style>' + $(this).html() + '</style>').attr({'media': this.media, 'id': this.id, 'type': this.type}).appendTo(document.getElementsByTagName('head')[0]).get(0));
            }
            //copy links
            if(this.nodeName.toLowerCase() === 'link'){
               /* deprecated 
               var args = {'tag': 'head', 'media': this.media, 'type': this.type, 'id': this.id, 'rel': this.rel, 'href': this.href};
               cloned.push(g3.utils.createLinkNode(args));
               */
               cloned.push($('<link>').appendTo(document.getElementsByTagName('head')[0]).attr({'media': this.media, 'id': this.id, 'type': this.type, 'rel': this.rel}).attr('href', this.href).get(0));
            }
            //copy scripts: IE8 error when this.text() is used!
            if(this.nodeName.toLowerCase() === 'script'){
               /* deprecated
               var args = {'text': $(this).html(), 'tag': 'head', 'src': this.src, 'type': this.type, 'id': this.id};
               cloned.push(g3.utils.createScriptNode(args));
               */
               var tmp = (this.src)? $('<script>' + $(this).html() + '</script>').attr({'src': this.src, 'type': this.type, 'id': this.id}).appendTo(document.getElementsByTagName('head')[0]).get(0) : $('<script>' + $(this).html() + '</script>').attr({'type': this.type, 'id': this.id}).appendTo(document.getElementsByTagName('head')[0]).get(0);
               cloned.push(tmp);
            }
         });
         evaluator.deleteFrame(nodes.frameParent);
         $('#stub').removeClass('hide');
      }
      
      evaluator = {
         /*
          * generic console object with log function
          */
         console: {
            pile: false, //pile writing
            log: function(value, n, nofollow){
               //IE8 returns form with id="console"!
               if(console && console.log)
                  console.log(value);
               if(!this.pile)
                  nodes.$console.html('');
               this.pile = true;
               nodes.$console.html(nodes.$console.html() + g3.debug(value, n, nofollow).toHtml());
               return this;
            }
         },
         $load: function(selector, url, data, complete){
            $(selector).load(url, data, complete).removeClass('hide');
            return this;
         },
         loadFrame: function(selector, src){
            var node = $(selector).get(0);
            if(!node){
               alert('Error in evaluator.loadFrame() failed to find a node for passed selector: ' + selector);
               return this;
            }
            if(clonedOnce){
               alert('Attention: delete cloned in stub-HEAD before re-loading!');
               return this;
            }
            if(loadOnce){
               alert('Attention: clone in stub-HEAD or remove frame before re-loading!');
               return this;
            }
            $('<iframe>').addClass('TbeFgQ7NMLTOVYjdRDjVMaoN frame').prop('src', src).appendTo(node);
            $(node).removeClass('hide');
            loadOnce = true;
            return this;
         },
         //deletes only iframes
         deleteFrame: function(selector){
            var node = $(selector).get(0);
            if(!node){
               alert('Error in evaluator.deleteFrame() failed to find a node for passed selector: ' + selector);
               return this;
            }
            if(!loadOnce){
               alert('Attention: load a frame before removing!');
               return this;
            }
            $(node).children('iframe').remove();
            loadOnce = false;
            return this;
         },
         //deletes cloned nodes from iframes
         removeCloned: function(selector){
            var node = $(selector).get(0);
            if(!node){
               alert('Error in evaluator.removeCloned() failed to find a node for passed selector: ' + selector);
               return this;
            }
            if(!clonedOnce){
               alert('Attention: clone frame in stub-HEAD before removing!');
               return this;
            }
            for(var i = 0; i < cloned.length; i++)
               $(cloned[i]).remove();
            cloned = [];
            $(node).contents().filter(function(){
               if(this.nodeName && this.nodeName.toLowerCase() === 'iframe')
                  return false;
               else
                  return true;
            }).remove();
            clonedOnce = false;
            return this;
         },
         //once we clone, we can't re-clone before removing the cloned ones!
         cloneFrame: function(selector, src){
            if(clonedOnce){
               alert('Attention: delete cloned in stub-HEAD before re-cloning!');
               return this;
            }
            var node = $(selector).get(0);
            if(!node){
               alert('Error in evaluator.cloneFrame() failed to find a node for passed selector: ' + selector);
               return this;
            }
            if(!loadOnce){
               alert('Attention: load a frame before cloning!');
               return this;
            }
            //Attention: nodes.frameParent instead of node is used by clone() method
            nodes.frameParent = node;
            clone();
            loadOnce = false;
            clonedOnce = true;
            return this;
         },
         
         key: 'TbeFgQ7NMLTOVYjdRDjVMaoN',
         objectName: 'g3.evaluator',
         version: '1.0',
         copyright: 'MIT, https:/github.com/centurianii'
      };
      return evaluator;
   }
   return {
      getInstance: function(){
         if(evaluator)
            return evaluator;
         else
            return init();
      }
   };
})();
}(window.g3 = window.g3 || {}, jQuery, window, document));
