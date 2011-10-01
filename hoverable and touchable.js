/*
 * jQuery Hoverable
 *
 * Simplified BSD License (@see License)
 * @author        Gregor Schwab
 * @copyright     (c) 2010 Gregor Schwab
 * Usage: $(elem).Touchable() (@see Readme.md)
 * @version 0.0.4
 * @requires jQuery Touchable
 */

(function($) {
  var Touchable=$.Touchable;
  $.fn.Hoverable = function(conf) {
      return this.each(function() {
      var t= $(this).data['Hoverable']=new Hoverable(this, conf);
      return t;
    });
  }
  $.fn.newHover = function(fn1, fn2, disableHover) {
      return this.each(function() {
        $(this).bind('newHoverIn', fn1).bind('newHoverOut', fn2);
    });
  }
  $.fn.newHover2 = function(fn1, fn2) {
      return this.each(function() {
        $(this).bind('newHoverIn2', fn1).bind('newHoverOut2', fn2);
    });
  }
  /**
   * @constructor
   */
  function Hoverable(elem, conf)
  {

    var self=this;
    this.logging=false; //set to false to disabele logging default false gets overwritten by conf see below
    var log=function(a){if(self.logging && (typeof console !== 'undefined')){
       console.log(Array.prototype.slice.call(arguments));}
       }; //private logging function

    this.elem=elem;
    //test for touchable
    if(!$(elem).Touchable) throw new Error('Hoverable depends on Touchable! Please be sure to include Touchable in your project.')
    this.$elem=$(elem).Touchable(conf);

    this.inHover=false;
    this.target=null;


    if (typeof conf!=='undefined'){
      if(typeof conf.disableHover!=='undefined'){this.disableHover=conf.disableHover;}
      else{this.disableHover=false;}
      if(typeof conf.logging!=='undefined'){this.logging=conf.logging;}
    }


    //longTap is the new Hover ;)
    if (!this.disableHover){
      this.$elem.mouseenter(genericHover);
      this.$elem.bind('mouseleave', genericHover);
    }


    this.$elem.bind('longTap', genericHover);
    this.$elem.bind('touchableend', genericHover);

    function genericHover(e, touch){
      if(e.type==='touchableend' ||e.type==='mouseleave'){
        log('Touchable newHoverOut');
        //this.$elem.unbind('touchend', genericHover);//don't have to unbind mouseleave .unbind('mouseleave', genericHover);
        return self.$elem.trigger('newHoverOut', self);
      }
        log('Touchable newHoverIn');
				self.$elem.trigger('newHoverIn', self); //trigger a genericHover see Readme
    }

    //mousemove is the new Hover ;)
    if (!this.disableHover){
      this.$elem.bind('mouseenter', genericHover2);
      this.$elem.bind('mouseleave', genericHover2);
    }
    self.$elem.bind('touchablestart', function(e, touch){
      self.$elem.bind('touchablemove', genericHover2);
    }, false);
    self.$elem.bind('touchableend', function(e, touch){
      self.$elem.unbind('touchablemove', genericHover2);
      genericHover2(e, touch);
    }, false);


    //this.$elem.bind('touchend', genericHover2);
    function genericHover2(e, touch){
      if(e.type==='touchableend'||e.type==='touchend'){
        log('Touchable newHoverOut2');
        self.inHover=false;
        return self.$elem.trigger('newHoverOut2', self);
      }else if(e.type==='mouseenter'){
          log('Touchable newHoverIn2');
          return self.$elem.trigger('newHoverIn2', self);
      }else if(e.type==='mouseleave'){
        log('Touchable newHoverOut2');
        return self.$elem.trigger('newHoverOut2', self);
      }
      if (e.type == 'touchablemove'){
        if(touch instanceof Touchable){
          //var x=touch.currentTouch.x; var y=touch.currentTouch.y;
          var hitTarget = self.hitTarget; //document.elementFromPoint(x, y);
 /*         if(typeof hitTarget==='undefined'||hitTarget===null&&self.target!==null) {var target=self.target;var currentTarget=self.target}//just if the browser looses memory
          else{var target=hittarget}//first the hittarget
          if(self.logging){console.log('target '+target+' x, y:'+x,+' ' +y);}
        }else{
          var target = e.target;
        }*/
          log('Touchable target ID/node'+ ' hitTarget'+ ' ' +
           hitTarget+'e.target'+e.target + ' e.currentTarget'+e.currentTarget+
           ' self in hover'+self.inHover);
          //lets see if we can macth our element...still playing with the right settings here cause browsers seem to have differenes in what they pass as an event.target
          var pass=false;
          //not good cause it goes on paragraphs but can be used to test for being outside the view element
          //if (typeof hitTarget !== 'undefined' && hitTarget === self.$elem.get(0) ){pass=true;}
          //if (typeof hitTarget !== 'undefined' && hitTarget !== self.$elem.get(0) ){pass=false;}
          //gives info to the inner element too
          //else if (typeof self.target !== 'undefined' && self.target === self.$elem.get(0)){pass=true;}//Chrome
           //relates to the this pointer the touchmove event was bound to (normally document)
          //else if (typeof self.currentTarget !== 'undefined' && self.currentTarget === self.$elem.get(0)){pass=true;}//iPad has it in currentTarget
          //e.target might work too
          //else if (typeof e.target !== 'undefined' && e.target === self.$elem.get(0)){pass=true;}
          //the winner is:
          if (typeof e.currentTarget !== 'undefined' && e.currentTarget === self.$elem.get(0)){pass=true;}
          if(pass&& !self.inHover){
            self.inHover=true;
            log('Touchable newHoverIn2');
            self.$elem.trigger('newHoverIn2', self);
            //e.stopPropagation();//we are talking about touchablemove event here
          }
          else if (pass===false && self.inHover){
            self.inHover=false;
            log('Touchable newHoverOut2');
            self.$elem.trigger('newHoverOut2', self);
            //e.stopPropagation(); //we are talking about touchablemove event here
          }
        }
      }
    }
  }
})(jQuery);//end closure

/*
 * jQuery Touchable
 *
 * Simplified BSD License (@see License)
 * @author        Gregor Schwab
 * @copyright     (c) 2010 Gregor Schwab
 * Usage Command Line: $(elem).Touchable() (@see Readme.md)
 * @version 0.0.5
 * @requires jQuery
 */


(function($) {

   $.fn.Touchable = function(conf) {
       return this.each(function() {
       var t= $(this).data['Touchable']=new Touchable(this, conf);
       return t;
     });
   }
   $.fn.newHover = function(fn1, fn2, disableHover) {
       return this.each(function() {
         $(this).bind('newHoverIn', fn1).bind('newHoverOut', fn2);
     });
   }
   $.fn.newHover2 = function(fn1, fn2) {
       return this.each(function() {
         $(this).bind('newHoverIn2', fn1).bind('newHoverOut2', fn2);
     });
   }

    $.Touchable=Touchable;

   /**
    * @constructor
    */

   function Touchable(elem, conf)
   {

     this.logging=false; //set to false to disabele logging gets overwritten by conf see below
     var log=function(a){if(self.logging && (typeof console !== 'undefined')){
        console.log(Array.prototype.slice.call(arguments));}
        }; //private logging function

     this.elem=elem;
     this.$elem=$(elem);
     this.is_doubleTap=false;
     this.is_currentlyTouching=false;
     this.isOneFingerGesture = false;

     this.startTouch={x:0,y:0};
     this.currentTouch={x:0,y:0};
     this.previousTouch={x:0,y:0};
     this.currentDelta={x:0,y:0};//measured from previous move event
     this.currentStartDelta={x:0,y:0}; //measured from start
     this.currentPosition={x:0,y:0};
     this.doubleTapTimer=null, this.longTapTimer=null;

     var self=this;

     if (typeof conf!=='undefined'){
       if(typeof conf.logging!=='undefined'){this.logging=conf.logging;}
     }
     //make IE happy
     var addEventListener=elem.addEventListener||elem.attachEvent
     var removeEventListener = elem.removeEventListener||elem.detachEvent
     //add touchstart eventlistener
     addEventListener.call(elem, 'touchstart', function(){self.$elem.trigger('touchstart')}, true);
     addEventListener.call(elem, 'touchend', function(){self.$elem.trigger('touchend')}, false);
     addEventListener.call(elem, 'touchmove', function(){self.$elem.trigger('touchmove')}, false);

     addEventListener.call(elem, 'touchstart', touchstart, false);
     this.$elem.mousedown(touchstart);

     function touchstart (e) {
       if(typeof e.touches!== "undefined")
         {
         log('Touchable Touchstart touches length ' + e.touches.length);
         //only handle 1 or 2 touches
   			if (e.touches.length !== 1 && e.touches.length !== 2) {
   				return false;
   			}
   			if (self.isCurrentlyTouching) {
   				return false;
   			}


   			self.isCurrentlyTouching = true;
   			if (e.touches.length == 1) { //1 finger
   				self.isOneFingerGesture = true;
   				//init pos
   				self.startTouch.x = self.previousTouch.x = e.touches[0].clientX;
   				self.startTouch.y = self.previousTouch.y = e.touches[0].clientY;
   			} else if (e.touches.length == 2) { //two fingers
   				self.isOneFingerGesture = false;
   				if (e.touches[0].clientY > e.touches[1].clientY) {//0 is lower
   					self.startTouch.x = self.previousTouch.x = e.touches[0].clientX;
   					self.startTouch.y = self.previousTouch.y = e.touches[0].clientY;
   				} else {
   					self.startTouch.x = self.previousTouch.x = self.touches[1].clientX;
   					self.startTouch.y = self.previousTouch.y = self.touches[1].clientY;
   				}
   			}

   				addEventListener.call(document, 'touchmove', touchmove, false);
   				addEventListener.call(document, 'touchend', touchend, false);
  		}else{
         log('Touchable Touchstart touches length ' + e.pageX + ' ' + e.pageY);
   				self.startTouch.x = self.previousTouch.x = e.pageX;
   				self.startTouch.y = self.previousTouch.y = e.pageY;
   				$(document).mousemove(touchmove);
   				$(document).mouseup(touchend);
  		}
  		//don't shallow links, but all the rest
  		self.target=e.target;//some browser loose the info here
      self.currentTarget=e.currentTarget;//some browser loose the info here so save it for later
      var x=self.startTouch.x; var y=self.startTouch.y;
      self.hitTarget = ( document.elementFromPoint ) ? (document.elementFromPoint(x, y)):'';
  		//if (self.hitTarget && !(self.hitTarget instanceof HTMLAnchorElement) &&!(e.currentTarget instanceof HTMLAnchorElement))
  		  e.preventDefault()


  		//setup double tapping
  		if (!self.inDoubleTap) {
  			self.inDoubleTap = true;
  			//setup a timer
  			self.doubleTapTimer = setTimeout(function() {
  				self.inDoubleTap = false;
  			}, 500);
  		} else {//we are double tapping
  			// call function to run if double-tap
  			log('Touchable doubleTap');
  			self.$elem.trigger('doubleTap', self); //trigger a doubleTap
  			//reset doubleTap state
  			clearTimeout(self.doubleTapTimer);
  			self.inDoubleTap = false;
       }
  		//setup long tapping and long mousedown
  		//setup a timer
  	  self.longTapTimer = setTimeout(function() {
  	    log('Touchable longTap'/*, self.hitTarget, self.target, self.currentTarget, self.elem*/);
  		  $(self.elem).trigger('longTap', self); //trigger a longTap
  		}, 1000);

  	  log('Touchable Tap');
  		$(self.elem).trigger('tap', self); //trigger a tap
  		$(self.elem).trigger('touchablestart', self); //trigger a tap


  	}


  	//called on iPad/iPhone when touches started and the finger is moved
  	function touchmove(e) {

  	  if (typeof e.touches !== 'undefined'){
       log('Touchable Touchsmove touches length ' + e.touches.length);
   			if (e.touches.length !== 1 && e.touches.length !== 2) //use touches to track all fingers on the screen currently (also the ones not in the pane) if there are more than 2 its a gesture
   				return false;

         //1 finger
   			if (e.touches.length == 1 || self.isOneFingerGesture) {//we ignore the second finger if we are already in movement
   				self.currentTouch.x = e.touches[0].clientX;
   				self.currentTouch.y = e.touches[0].clientY;
           //2 finger
   			} else if (self.touches.length == 2 && !self.isOneFingerGesture) {//two fingers move , take the upper finger as reference
   				if (e.touches[0].clientY > e.touches[1].clientY) {//0 is lower
   					self.currentTouch.x = e.touches[0].clientX;
   					self.currentTouch.y = e.touches[0].clientY;
   				} else {
   					self.currentTouch.x = e.touches[1].clientX;
   					self.currentTouch.y = e.touches[1].clientY;
   				}
   			}
  		}else{
  			self.currentTouch.x = e.pageX;
  			self.currentTouch.y = e.pageY;
  		}
  		//if we are moving stop any css animations currently running
  		$(self.elem).removeClass('webkitAnimate');
  		//e.preventDefault();

  		self.currentDelta.x = (self.currentTouch.x - self.previousTouch.x);///s.currentScale;
  		self.currentDelta.y = (self.currentTouch.y - self.previousTouch.y);///s.currentScale;
  		self.currentStartDelta.x = (self.currentTouch.x - self.startTouch.x);///s.currentScale;
  		self.currentStartDelta.y = (self.currentTouch.y - self.startTouch.y);///s.currentScale;
  		//just for the records (accumulation)
  		self.currentPosition.x = self.currentPosition.x + self.currentDelta.x;
  		self.currentPosition.y = self.currentPosition.y + self.currentDelta.y;
  		//reset the start position for the next delta
  		self.previousTouch.x = self.currentTouch.x;
  		self.previousTouch.y = self.currentTouch.y;
       log('Touchable Touchablemove self e.target' + e.target + 'e.currentTarget '+ e.currentTarget +' x:'+ self.currentStartDelta.x);
       //Target handling
       self.target=e.target;//some browser loose the info here
       self.currentTarget=e.currentTarget;//some browser loose the info here so save it for later
      var x=self.currentTouch.x; var y=self.currentTouch.y;
       self.hitTarget = ( document.elementFromPoint ) ? (document.elementFromPoint(x, y)):'';
       $(self.elem).trigger('touchablemove', self);

  		//clear the long tap timer on mousemove
   		if (self.longTapTimer) clearTimeout(self.longTapTimer);
  	}
     function touchend(e) {
       if (typeof e.touches !== 'undefined'){
   			if (e.targetTouches.length > 0)
   				return false;
     		removeEventListener.call(self.elem, 'touchmove', touchmove, false);
     		removeEventListener.call(self.elem, 'touchend', touchend, false);
  		}else{
     		$(document).unbind('mousemove',touchmove);
     		$(document).unbind('mouseup',touchend);
  		}

  		//e.preventDefault();
  		self.isCurrentlyTouching = false;
  		//clear the long tap timer on mouseup
   		if (self.longTapTimer) clearTimeout(self.longTapTimer);
       log('Touchable Touchend self ' + self.currentStartDelta.x);
       $(self.elem).trigger('touchableend', self);
  		 log('Touchable: touchableend');
       $(self.hitTarget).trigger('click', self);//trigger a click on the hittarget cause on iPad/Mobile Safari preventdefault seems to shallow click events
  		 log('Touchable: Hittarget click');

  	}
   }
})(jQuery);//end closure

