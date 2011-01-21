
0.0.1 / 2010-12-21
------------------

* Initial release



0.0.3 / 2010-01-11
------------------

* Fixed bug with addEventListener not working in IE
* merged with branch gh-pages
* Made anchor links not preventDefault by default on touchstart event (affected mobile safari not firing click events on anchor elements)

0.0.4 / 2010-01-21
------------------

* reengineered the anchor link fix, cause I didn't like the approach taken in 0.0.3. The approach in 0.0.3 fixed the problem not at it's source, namely the browser inconsistency on mobile devices, which seem to mis-interpretate preventDefault as a stopPropagation, thus not fireing any other events bound to that object. This was not affectin only Anchor Elements, so I decided to let touchstart again prevent default, and included instead a special fix for mobile browsers in that I fire a click event on touchend manually. Don't know if this is a better fix, but it seems a bit more elegant to me right now. 
* added hittarget to touch event: as mobile browsers results on event targets differ from desktop, I added a 3rd target which is evaluated by using document.elementFromPoint and especially oin mobile Safari gives the right touch target (whereas currentTarget and Target won't
* fixed the logging function
* pass the options passed to Hoverable to the internal Touchable object too
