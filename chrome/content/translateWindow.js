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
    
    fillLanguagesCombo();
  
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
            // show translation if some text was selected
            refreshTranslation();
        }
    }
});  // window.load

// Translates input text and shows translation in output
function refreshTranslation() {
    googleTranslate.translateSmart(defaultLang(), targetLang(), input(),
      // output translate string
      function(translatedStr) { setOutput(translatedStr); },
      // output error message
      function(errorMessage) { setOutput(errorMessage); }
    );
}

function fillLanguagesCombo() {
    allLangs = allLanguages.getLanguages();
    $(cmbLangFilterId).empty();
    $.each(allLangs, function(key, value) {   
         $(cmbLangFilterId).
              append($("<option />").
              attr("value",key).
              text(value)); 
    });
}

var cmbLangFilterId = '#cmbLangFilter';
var txtInputId = '#txtInput';
var outputId = '#outputSpan';

function defaultLang() {
    return "en";
}

function targetLang() {
    return $(cmbLangFilterId).val();
}

function input() {
    return $(txtInputId).val();
}

function setInput(v){
    return $(txtInputId).val(v);
}

function output() {
    return $(outputId).html();
}

function setOutput(v) {
    $(outputId).text(v);
}

