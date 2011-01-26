cmbLangFilter = '';
txtInput = '';
txtOutput = '';
cStarredLanguages = '';

starredLangs = ['es', 'pl', 'de', 'nl'];
targetLangCode = starredLangs[0];

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
    setTargetLang(targetLangCode);
  
    // Register events
	txtInput.keyup(function(event) {
	   refreshTranslation();
	});
	
	cmbLangFilter.change(function(event) {
	   // Add selected lang to starred langs
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
    if (input() == '') {
        setOutput('');
        return;
    }
    googleTranslate.translateSmart(defaultLang(), targetLang(), input(),
      // output translate string
      function(translatedStr) { setOutput(translatedStr); },
      // output error message
      function(errorMessage) { setOutput(errorMessage); }
    );
}

function initControls() {
    cmbLangFilter = $('#cmbLangFilter');
    txtInput = $('#txtInput');
    txtOutput = $('#outputSpan');
    cStarredLanguages = $('#starredLanguages');
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
    allLangs = allLanguages.getLanguages();
    cStarredLanguages.empty();
    $.each(starredLangs, function(index, langCode) {
        langName = allLangs[langCode];
        initStarredLangUI(langCode, langName);
    });
}

function selectTargetLanguage(langCode) {
    cmbLangFilter.val(langCode);
    refreshTranslation();
}

function initStarredLangUI(langCode, langName) {
    var starredLangListItem = $(
        '<li class="starredLangItem">\
            <div class="cStarredLang">\
            <a href="#" class="starredLang">Spanish</a>\
            <a href="#" class="starredLangDel">x</a>  <!-- label with css bg image -->\
            </div>\
        </li>');
    // $.get("starredLanguage.html", function(data){}); // was slower
    cStarredLanguages.append(starredLangListItem);
    anchor = starredLangListItem.find('.starredLang');
    anchor.text(langName);
    anchor.click(function(event) {
        selectTargetLanguage(langCode);
    });
    delButton = starredLangListItem.find('.starredLangDel');
    delButton.click(function(event) {   // without 'var' this behaves strange
        starredLangListItem.slideUp(400, function() { $(this).remove(); } );
    });
}

function addStarredLang(langCode, langName) {
    if (starredLangs.contains(langCode))
        return;
    starredLangs.push(langCode);
    initStarredLangUI(langCode, langName);
}

function defaultLang() {
    return "en";
}

function targetLang() {
    return cmbLangFilter.val();
}

function setTargetLang(langCode) {
    return cmbLangFilter.val(langCode);
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

