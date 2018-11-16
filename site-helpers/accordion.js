/*
 * Accordion
 * ---------
 */
$(function(){
   
   $('.T73auXqB6A1R7oKOBA8BDesP').off('click').on('click', '.accordion-text', function(){
      var $n = $(this);
      
      if($n.closest('li').hasClass('open'))
         return;
      $n.closest('.T73auXqB6A1R7oKOBA8BDesP').children('ul').children('li').removeClass('open');
      $n.closest('li').addClass('open');
   });

   $('.T73auXqB6A1R7oKOBA8BDesP').each(function(){
      if($(this).hasClass('scroll'))
         $(this).data({scroll: true});
   });
   
   var oneTransition = (function(){
      var $parent,
          type,
          callback,
          unlockCallback,
          newCallback,
          start = 'webkitTransitionStart otransitionstart oTransitionStart msTransitionStart transitionstart',
          end = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';
      
      unlockCallback = function(){
         $parent.data('oneTransitionLock', false);
      };
      
      newCallback = function(e){
         if($parent.data('oneTransitionLock'))
            return;
         else
            $parent.data('oneTransitionLock', true);
         
         callback.call($parent[0], e);
      };
      
      return function(){
         var args = Array.prototype.slice.call(arguments, 0);
         
         $parent = $(args[0]);     // 1st arg
         type = args[1];           // 2nd arg
         callback = args[2];       // 3rd arg
         
         if((args.length < 3) || ((type != 'start') && (type != 'end')) || (typeof(callback) != 'function'))
            return;
         
         //$parent.off(start).off(end);
         if(type == 'start'){
            $parent.data('oneTransitionLock', false);
            $parent.on(start, newCallback);
            $parent.on(end, unlockCallback);
         }else if(type == 'end'){
            $parent.on(start, unlockCallback);
            $parent.on(end, newCallback);
         }
      }
   })();
   /*
   oneTransition($('.T73auXqB6A1R7oKOBA8BDesP')[0], 'end', function(e){
      var root = $(e.target).closest('.T73auXqB6A1R7oKOBA8BDesP');
      
      if(root.data('scroll')){
         root.addClass('scroll');
      }
      console.log('end');
   });
   */
   oneTransition($('.T73auXqB6A1R7oKOBA8BDesP')[0], 'end', function(e){
      initiateSplitView(null, $('.T73auXqB6A1R7oKOBA8BDesP > ul > li.open').find('.GruPRo4wTuRiZad3aSF7qH0z'));
   });
   
/*
 * Split view
 * ----------
 */
   function initiateSplitView(event, target){
      var $parent;
      
      if(target)
         $parent = $(target);
      else
         $parent = $('.GruPRo4wTuRiZad3aSF7qH0z');
      
      $parent.each(function(){
         var $parent = $(this),
             $top,
             $handle,
             contentWidth,
             height,
             skewAngle;
         
         height = $parent.parent().height();
         $parent.height(height);
         $parent.find('.panel').height(height).find('.content').height(height);
         
         if(!$parent.hasClass('percent'))
            return;
         
         $top = $parent.find('.panel.top');
         height = $parent.height();
         skewAngle = 30;
         
         if($parent.hasClass('skewed')){
            //$top.css({'margin-left': -(height/2)/Math.tan((90 - skewAngle)*Math.PI/180)});
            $top.css({'margin-left': -(height/2)/1.7320508075688767});
            $top.children('.content').css({'margin-left': (height/2)/1.7320508075688767});
         }
         
         contentWidth = $parent.width();
         $parent.find('.panel .content').width(contentWidth);
         $handle = $parent.find('.handle');
         if($handle.data('memory'))
            return;
         //$handle.css({left: contentWidth - (height/2)/Math.tan((90 - skewAngle)*Math.PI/180)});
         $handle.css({left: contentWidth - (height/2)/1.7320508075688767});
      });
   }
   
   initiateSplitView();
   $(window).on('resize', function(e){initiateSplitView(e);});
   
   $('.GruPRo4wTuRiZad3aSF7qH0z').on('click', '.panel', function(event){
      var $parent = $(this).closest('.GruPRo4wTuRiZad3aSF7qH0z'),
          $top = $parent.find('.panel.top'),
          $content = $parent.find('.panel.top .content'),
          $handle = $parent.find('.handle'),
          width = $top.width() + parseInt($top.css('margin-left'), 10),
          height = $top.height(),
          marginHack = Math.abs(parseInt($top.css('margin-left'), 10)),
          skewAngle = 30,              // hardcoded
          skewCompl = 90 - skewAngle,  // hardcoded
          clientX = 0,
          clientY = 0,
          newX = 0,
          newY = 0,
          delta = 0;
      
      $handle.data('memory', true);
      
      // Get the mouse position in parent coordinates
      clientX = event.pageX - $parent.offset().left;
      clientY = event.pageY - $parent.offset().top;
      
      // Define a new coordinate system that is placed at the center and 
      // middle of handler in relation with the parent coordinate system
      // and rotate that system -(90 - skew angle), i.e. -60 deg.
      // Set as base system the new one and let the system defined at
      // the top left of parent be the new one with rotation +60 deg plus
      // an axis disposition.
      // Our new "base" system is connected with the parent with:
      // https://en.wikipedia.org/wiki/Rotation_of_axes, eq. 5, 6
      // (after applying the disposition of axis)
      // newX = (clientX - width)*cos60 - (clientY - height/2)*sin60
      // newY = (clientX - width)*sin60 + (clientY - height/2)*cos60
      newX = (clientX - width)*0.5 - (clientY - height/2)*0.8660254037844386;
      newY = (clientX - width)*0.8660254037844386 + (clientY - height/2)*0.5;
    
      // Find horizontal distance of user click from handler (new coordinate system)
      // if(newX >= 0) delta = newY/Math.sin(skewCompl*Math.PI/180);
      // else delta = newY/Math.cos(skewAngle*Math.PI/180);
      delta = newY/0.8660254037844386;
      
      // Move the handle.
      $handle.css({left: width + delta + 'px'});
    
      // Adjust the top panel width.
      $top.css({width: width + marginHack + delta + 'px'});
   });
});
