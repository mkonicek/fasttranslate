let EXPORTED_SYMBOLS = ["hello", "greeter"];

// global function
function hello(msg)
{
  alert(msg);
}

var greeter = function (){

return {
  hello : function(msg)
  {
    alert(msg);
  },
  
  getSel : function() {
    return document.commandDispatcher.focusedWindow.getSelection().toString();
  }
}
}();