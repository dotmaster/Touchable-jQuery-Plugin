# Touchable #

Touchable is a jQuery Class that unifies touch and mouse events over different platforms like desktops and mobile devices with touchscrennes (like Android, iPad, iPod Touch, iPhone etc.)
The name Touchable therefore might be a bit confusing, cause it actually is a generic "Touch" which involves also mouse events. For convenience they are all called "Touches".

## Usage ##

Right now Touchable supports four basic events, all events when bound with jQuery's bind function get a touch object passed in as second argument
* touchmove: fired when the user touched or clicked with the mouse and moves to another position. Right now Touchable supports up to 2 fingers. If 2 fingers are on screen the lower left is taken as a reference.
* touchend: fired when the user ended a touch
* longTap: fired when the user stays with his mouse or finger on an item for 1 second
* doubleTap: fired when the user taps two times within half of a second


you use it by initializing Touchable on a view element, like so:
var div = $(<div>).Touchable();
then you bind to the events
div.bind('touchmove', function(e, touch){})
notice, that each event gets passed a touch object, besides the normal event object. The Touch object has the following properties:


* startTouch: this is where the touch or mousedown event originated
* currentTouch: this is where we are right now with our finger or mouse     
* previousTouch: for internal calculations of the previous position of the mouse pointer or finger, used for deltas see below
* currentDelta: measured from previous move event
* currentStartDelta, currentPosition: the relative position, measured from start calculated in different ways, but should be the same


## Todos ##

* support more gestures like swiping,...