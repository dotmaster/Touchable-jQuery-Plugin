#!/usr/bin/env node
var util = require('util');
var Step = require('step');
var exec = require('child_process').exec;

//var md = require("node-markdown").Markdown;
//var path=require('path'), fs=require('fs');
var nmd = require('nmd')
var errors=[];
var verbose=true;
var callme = function callme(command, err, stdout, stderr){
    if(err &&  err.length==0) return;//reset the empty array passed in
    util.print('\n'+ stylize(!err) +'output of command: '+ command + '\n');      
    (stdout && verbose && err) && util.print('\nstdout:\n' + stdout);
    (stderr && verbose && err) && util.print('\nstderr:\n' + stderr);      
}
function stylize(ok){
  if (ok)
    return '\033[32m' + 'OK ' +
           '\033[39m';
  else
    return '\033[35m' + 'FAIL ' +
           '\033[39m';                   
}

       
var commands=[];
var oldCommand="";
var add = function(command){
  function stepCommand(command, oldCommand){
    return function(err, stdout, stderr){        
      callme(oldCommand, err, stdout, stderr)
      if(command) exec(command, this)        
    }
  }
  commands.push(stepCommand(command, oldCommand))
  oldCommand = command;
};

process.chdir('.');
console.log('Working directory: ' + process.cwd());
add('git checkout gh-pages');
add('nmd Readme.md -o index.html');      
add('ln -s hoverable.js demo/hoverable.js');
add('ln -s touchable.js demo/touchable.js');
add('git commit');
add('git checkout master');
add('');

Step.apply(this, commands);

/*exec('git checkout gh-pages', function(e, so, se){
  console.log('')
});*/