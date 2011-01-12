  var connect = require('connect')
      , express = require('express')
      , sys = require('sys');
      require('assert');
  
      //Create Express frontend
var server = global.server = express.createServer();
server.use(connect.staticProvider(__dirname+'/..'));
server.use(express.errorHandler({ dumpExceptions: true, showStack: true }));                  


var port=3000;
server.listen(port);
console.log('Server Listening on http://0.0.0.0:'+port);
