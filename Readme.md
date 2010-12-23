# Touchable #

Touchable is a very lightweight (3,12kb) jQuery Class that unifies touch and mouse events over different platforms like desktops and mobile devices with touchscreens (like Android, iPad, iPod Touch, iPhone etc.)
The name Touchable therefore might be a bit confusing, cause we actually generate a generic "Touch" which involves also mouse events. For convenience they are all called "Touches".

Touchable really doesn't depend that much on jQuery, so it should work with other libraries like [Zepto][] too. Havent tested that though.
[Zepto]: http://zeptojs.com/

# Hoverable #

Hoverable is built upon Touchable and is a very lightweight (1,7kB) jQuery Class that unifies hover events over different platforms like desktops and mobile devices with touchscreens (like Android, iPad, iPod Touch, iPhone etc.)
It introduces a new event called 

* **newHover(2)**: following my [blog][] article about UI design and my postulate, that Long Tap is the new Hover. Fired when the user hovers with the mouse or longTaps an element. Hovever if you want to you can set it up to a touchmove event too, which will fire a genericHover2 event.


##Testing##
right now I have tested Touchable on the following devices and browsers Chrome, Firefox, Safari, iPad Simulator, iPad, iPhone. But it should work quite everywhere. If you have any bug notes drop me a line.

##Demo##
I have setup a demo site for Hoverable on [connect-mi.com][]
[connect-mi.com]: http://connect-mi.com/

## Usage ##

Right now Touchable supports five basic events and Hoverable adds two generic Hover events, all events when bound with jQuery's bind function get a touch object passed in as second argument

TOUCHABLE
==========
* **touchablemove**: fired when the user touched or clicked with the mouse and moves to another position. Right now Touchable supports up to 2 fingers. If 2 fingers are on screen the lower left is taken as a reference.
* **touchableend**: fired when the user ended a touch
* **tap**: fired when the user clicks with his mouse or taps with his finger
* **longTap**: fired when the user stays with his mouse or finger on an item for 1 second
* **doubleTap**: fired when the user taps two times within half of a second
[blog]: http://grenzgenial.com/
[ajaxian]: http://ajaxian.com/archives/mouseovers-on-touch-devices

HOVERABLE
==========
* **newHover(2)**: Fired when the user hovers with the mouse or longTaps an element. Hovever if you want to you can set it up to a touchmove event too, which will fire a genericHover2 event.


you use it by initializing Touchable on a view element, like so:

    var div = $(<div>).Touchable();

or

    var div = $(<div>).Hoverable(); //which cretaes a Touchable internally
    
then you bind to the events

    div.bind('touchmove', function(e, touch){})
    div.bind('newHover2', function in(e, touch){}, function out(e, touch){})
    
notice, that each event gets passed a touch object, besides the normal event object. The Touch object has the following properties: 


* startTouch: this is where the touch or mousedown event originated
* currentTouch: this is where we are right now with our finger or mouse     
* previousTouch: for internal calculations of the previous position of the mouse pointer or finger, used for deltas see below
* currentDelta: measured from previous move event
* currentStartDelta, currentPosition: the relative position, measured from start calculated in different ways, but should be the same


## Todos ##

* support more gestures like swiping,...