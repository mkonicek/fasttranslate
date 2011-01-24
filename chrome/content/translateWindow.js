cmbLangFilter = '';
txtInput = '';
txtOutput = '';
cStarredLanguages = '';

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

    initControls();

    // Default state
    setInput('');
    txtInput.focus();
    
    fillLanguagesCombo();
    fillStarredLanguages();
  
    // Register events
	txtInput.keyup(function(event) {
	   refreshTranslation();
	});
	
	cmbLangFilter.change(function(event) {
	   selectedLangCode = cmbLangFilter.val();
	   addStarredLang(selectedLangCode, allLanguages.langName(selectedLangCode));
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
    cmbLangFilter.empty();
    $.each(allLanguages.getLanguages(), function(langCode, langName) {   
         cmbLangFilter.
              append($("<option />").
              attr("value", langCode).
              text(langName)); 
    });
}

function fillStarredLanguages() {
    starredLangs = ['es', 'pl', 'de'];
    allLangs = allLanguages.getLanguages();
    cStarredLanguages.empty();
    $.each(starredLangs, function(index, langCode) {
        langName = allLangs[langCode];
        addStarredLang(langCode, langName);
    });
}

function initControls() {
    cmbLangFilter = $('#cmbLangFilter');
    txtInput = $('#txtInput');
    txtOutput = $('#outputSpan');
    cStarredLanguages = $('#starredLanguages');
}

function selectTargetLanguage(langCode) {
    cmbLangFilter.val(langCode);
    refreshTranslation();
}

function addStarredLang(langCode, langName) {
    anchor = 
        $('<a href="#"/>').
        attr("class", "targetLangSel").
        text(langName);
    anchor.click(function(event) {
        selectTargetLanguage(langCode);
    });
    cStarredLanguages.append($('<li />').append(anchor));
}

function defaultLang() {
    return "en";
}

function targetLang() {
    return cmbLangFilter.val();
}

function input() {
    return txtInput.val();
}

function setInput(v){
    txtInput.val(v);
}

function output() {
    return txtOutput.html();
}

function setOutput(v) {
    txtOutput.text(v);
}

