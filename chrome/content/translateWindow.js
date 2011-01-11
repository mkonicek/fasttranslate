var txtInputId = '#txtInput';
var outputId = '#outputSpan';

var languages = {
    'cs':'Czech',
    'en':'English',
    'es':'Spanish',
    'pl':'Polish',
    'pl':'German'
} 

$(document).ready(function() {
  /*var a = $('<div>Hello world!</div>');
          //var b = a.load('translateWindow.html');
          //alert(JSON.stringify(b));
  a.dialog({
      //autoOpen: false,
      title: "Translate",
      width: 650,
      height: 450
  });
  alert("body" + $('body').html());
  $('body').append('<div>Body append!</div>');*/

    // Default state
    setInput("");
    $(txtInputId).focus();
  
    // Register events
	$(txtInputId).keyup(function(event) {
	   refreshTranslation();
	});
});   // document.ready

$(window).load(function() {
    // Argument passed from caller (overlay.js)
    if (window.arguments != undefined) {
        var browserSelectedText = window.arguments[0];
        if (browserSelectedText != '') {
            setInput(browserSelectedText);
            refreshTranslation();
        }
    }
});  // window.load

// Translates input text and shows translation in output
function refreshTranslation() {
    googleTranslate.translateSmart("en", "pl", getInput(),
      // output translate string
      function(translatedStr) { 
        setOutput(translatedStr); 
      },
      // output error message
      function(errorMessage) { setOutput(errorMessage); }
    );
}

function getInput() {
    return $(txtInputId).val();
}

function setInput(v){
    return $(txtInputId).val(v);
}

function getOutput() {
    return $(outputId).html();
}

function setOutput(v) {
    $(outputId).text(v);
}

