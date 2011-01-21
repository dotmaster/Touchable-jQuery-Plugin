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
