/*
 * jQuery Touchable
 *
 * Simplified BSD License (@see License)
 * @author        Gregor Schwab
 * @copyright     (c) 2010 Gregor Schwab
 * Usage Command Line: $(elem).Touchable() (@see Readme.md)
 * @requires jQuery
 */

var Touchable;
(function($) {
  $.fn.Touchable = function() {
      return this.each(function() {
      // Do your awesome plugin stuff here
      return new Touchable(this);
    });
  }
  Touchable = function (elem)
  {
    this.elem=elem;    
    this.$elem=$(elem);
    this.is_doubleTap=false;
    this.is_currentlyTouching=false;
    this.isOneFingerGesture = false;
    this.logging=true;
    this.startTouch={x:0,y:0};
    this.currentTouch={x:0,y:0};      
    this.previousTouch={x:0,y:0};
    this.currentDelta={x:0,y:0};//measured from previous move event
    this.currentStartDelta={x:0,y:0}; //measured from start   
    this.currentPosition={x:0,y:0};
    this.doubleTapTimer, this.longTapTimer;

    var self=this;
    //add touchstart eventlistener    
    elem.addEventListener('touchstart', touchstart, false);
    this.$elem.bind('mousedown', touchstart);
    
    function scrollTo(dx, dy){
            var _m = self.$elem;
            var x = _m.scrollLeft() + dx;
            var y = _m.scrollTop() + dy;
            _m.scrollLeft(x).scrollTop(y);
    }
    
    function touchstart (e) {
      if(typeof e.touches!== "undefined")
        {
        if(self.logging){console.log('Touchable Touchstart touches length ' + e.touches.length);}            
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
				
  				self.elem.addEventListener('touchmove', touchmove, false);
  				self.elem.addEventListener('touchend', touchend, false);    			
			}else{
        if(self.logging){console.log('Touchable Touchstart touches length ' + e.pageX + ' ' + e.pageY);}			  
  				self.startTouch.x = self.previousTouch.x = e.pageX;
  				self.startTouch.y = self.previousTouch.y = e.pageY; 
  				$(document).mousemove(touchmove);
  				$(document).mouseup(touchend);  							  
			}
			e.preventDefault();
			
			//setup double tapping 
			if (!self.inDoubleTap) {
				self.inDoubleTap = true;
				//setup a timer
				self.doubleTapTimer = setTimeout(function() {
					self.inDoubleTap = false;
				}, 500);
			} else {//we are double tapping
				// call function to run if double-tap
				if(self.logging){console.log('Touchable doubleTap')};
				self.$elem.trigger('doubleTap', self); //trigger a doubleTap
				//reset doubleTap state
				clearTimeout(self.doubleTapTimer);
				self.inDoubleTap = false;			     
      }  			
			//setup long tapping and long mousedown
			//setup a timer
		  self.longTapTimer = setTimeout(function() {
		    if(self.logging){console.log('Touchable longTap')};
			  $(self.elem).trigger('longTap', self); //trigger a longTap
			}, 1000);
			
		  if(self.logging){console.log('Touchable Tap')};				  			
			$(self.elem).trigger('tap', self); //trigger a tap
	

		}


		//called on iPad/iPhone when touches started and the finger is moved
		function touchmove(e) {
		  
		  if (typeof e.touches !== 'undefined'){
      if(self.logging){console.log('Touchable Touchsmove touches length ' + e.touches.length);}              		    
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
			e.preventDefault();
			
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
      if(self.logging){console.log('Touchable Touchmove self ' + self.currentStartDelta.x);}            
      $(self.elem).trigger('touchmove', self);
      
			//clear the long tap timer on mousemove
  		if (self.longTapTimer) clearTimeout(self.longTapTimer);
		}		
    function touchend(e) {
      if (typeof e.touches !== 'undefined'){
  			if (e.targetTouches.length > 0)
  				return false;
    		self.elem.removeEventListener('touchmove', touchmove, true);
    		self.elem.removeEventListener('touchend', touchend, true);    				
			}else{
    		$(document).unbind('mousemove',touchmove);
    		$(document).unbind('mouseup',touchend);      					  
			}

			e.preventDefault();
			self.isCurrentlyTouching = false;
			//clear the long tap timer on mouseup
  		if (self.longTapTimer) clearTimeout(self.longTapTimer);  			
      if(self.logging){console.log('Touchable Touchend self ' + self.currentStartDelta.x);}              			
      $(self.elem).trigger('touchend', self);
			if(self.logging){console.log('Touchable: touchend')};

		}      
  }
})(jQuery);//end closure
