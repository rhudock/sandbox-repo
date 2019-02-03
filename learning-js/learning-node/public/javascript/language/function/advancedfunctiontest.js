

/**
 *
 *  Test for http://ejohn.org/apps/learn/
 *
 */

 $(function() {

// The .bind method from Prototype.js 
Function.prototype.bind = function(){ 
  var fn = this, args = Array.prototype.slice.call(arguments), object = args.shift(); 
  return function(){ 
    return fn.apply(object, 
      args.concat(Array.prototype.slice.call(arguments))); 
  }; 
};

module("Function Test");

test("Default test", function() {

  ok(assert( true, "I'll pass." )); 
  ok(assert( "truey", "So will I." )); 
  ok(assert( false, "I'll fail." )); 
  ok(assert( null, "So will I." )); 
  log( "Just a simple log", "of", "values.", true ); 
  error( "I'm an error!" );

});


function assert(pass, msg){
  var type = pass ? "PASS" : "FAIL";
  jQuery("#results").append("<li class='" + type + "'><b>" + type + "</b> " + msg + "</li>");
}

function error(msg){
  jQuery("#results").append("<li class='ERROR'><b>ERROR</b> " + msg + "</li>");
}

function log(){
  var msg = "";
  for ( var i = 0; i < arguments.length; i++ ) {
    msg += " " + arguments[i];
  }
  jQuery("#results").append("<li class='LOG'><b>LOG</b> " + msg + "</li>");
}

});