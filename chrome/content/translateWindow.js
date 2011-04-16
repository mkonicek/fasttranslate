// controls
var cmbLangFilter = '';
var cCmbLangFilter = '';
var cmbDefaultLang = '';
var txtInput = '';
var txtOutput = '';
var cStarredLanguages = '';
var btnAddStarredLang = '';
var cOptions = '';
var txtTargetLangName = '';
var btnOptions = '';
var btnRelace = '';

// Object containing persistent user preferences (call save() to persist).
// Passed from overlay.js (for FF security reasons).
var preferencesObject = '';

var optionsFirstTime = true;

var starredLangs = ['es', 'pl', 'de', 'nl'];
var targetLangCode = 'es';
var defaultLangCode = 'en';

$(window).load(function() {
    // Argument passed from caller (overlay.js)
    if (window.arguments == undefined) {
        // not running as a browser plugin
        return;
    }
    
    // Passed preferences object (we have to pass it from overlay.js
    // for security reasons)
    preferencesObject = window.arguments[0];
    loadPreferences();
    
    var browserSelectedText = window.arguments[1];
    if (browserSelectedText != '') {
        setInput(browserSelectedText);
        // show translation if some text was selected
        refreshTranslation();
    }
});

function loadPreferences() {
    alert(preferencesObject.getTargetLang());
    setTargetLang(preferencesObject.getTargetLang());
}

function savePreferences() {
    preferencesObject.setTargetLang(targetLangCode);
    preferencesObject.save();
}

$(document).ready(function() {
    initControls();

    // Default state
    setInput('');
    txtInput.focus();
    
    setTargetLang(targetLangCode);
    
    txtInput.autoResizeTextArea();
	txtInput.keyup(function(event) {
	   refreshTranslation();
	});
	
	// Starred languages
	initStarredLanguagesUI();
	// '+ add lang' button
    btnAddStarredLang.click(function(event) {
        var cmbInput = $('#cAddStarredLang .ui-autocomplete-input');
        cmbInput.val('');
        cAddStarredLang.slideToggle(200);
        btnAddStarredLang.slideToggle(200);
        cmbInput.focus();
    });
    // add starred lang Combobox
    cAddStarredLang.hide();
	fillLanguagesSelect(cmbAddStarredLang);
	cmbAddStarredLang.change(function(event) {
        // add lang to starred langs
        var selectedLangCode = cmbAddStarredLang.val();
        cAddStarredLang.slideToggle(400);
        btnAddStarredLang.slideToggle(400);
        addStarredLang(selectedLangCode, allLanguages.langName(selectedLangCode));
        refreshTranslation();
	});
    cmbAddStarredLang.makeComboBox();
    
    // options
    cOptions.hide();
    btnOptions.click(function() {
        if (optionsFirstTime) { 
            fillLanguagesSelect(cmbDefaultLang);
            cmbDefaultLang.val(defaultLangCode);
            cmbDefaultLang.makeComboBox();
            optionsFirstTime = false;
            cmbInput = $('#cCmbDefaultLang .ui-autocomplete-input');
        }
        cOptions.slideToggle(200, function () {
            cmbInput = $('#cCmbDefaultLang .ui-autocomplete-input');
            cmbInput.select();
        });
    });
    
    // replace button
    btnReplace.click(function() { alert('a'); })
    btnReplace.toggle();
    
    registerCloseWindowByEsc();
});   // document.ready

// Translates input text and shows translation in output
function refreshTranslation() {
    if (input() == '') {
        setOutput('');
        return;
    }
    googleTranslate.translateSmart(defaultLangCode, targetLang(), input(),
      // show translated string
      function(translatedStr) { setOutput(unescape(translatedStr)); },
      // show error message
      function(errorMessage) { setOutput(errorMessage); }
    );
}

function fillLanguagesSelect(languagesSelect) {
    //comboBox.empty();  // leave the one dummy item, so that combo stays empty
    $.each(allLanguages.getLanguages(), function(langCode, langName) {   
         languagesSelect.
              append($("<option />").
              attr("value", langCode).
              text(langName)); 
    });
}

function addStarredLang(langCode, langName) {
    if (starredLangs.contains(langCode))
        return;
    starredLangs.push(langCode);
    initStarredLangUI(langCode, langName);
}

function initStarredLanguagesUI() {
    cStarredLanguages.empty();
    $.each(starredLangs, function(index, langCode) {
        initStarredLangUI(langCode, allLanguages.langName(langCode));
    });
}

function initStarredLangUI(langCode, langName) {
    var starredLangListItem = $(
        '<li class="starredLangItem">\
            <div class="cStarredLang">\
            <a href="#" class="starredLang">Spanish</a>\
            <a href="#" class="starredLangDel">x</a>  <!-- label with css bg image -->\
            </div>\
        </li>');
    // $.get("starredLanguage.html", function(data){}); // was slow
    cStarredLanguages.append(starredLangListItem);
    anchor = starredLangListItem.find('.starredLang');
    anchor.text(langName);
    anchor.click(function(event) {
        setTargetLang(langCode);
        savePreferences();
    });
    delButton = starredLangListItem.find('.starredLangDel');
    delButton.click(function(event) {
        starredLangListItem.slideUp(400, function() { $(this).remove(); } );
        starredLangs.remove(langCode);
    });
}

function targetLang() {
    return targetLangCode;
}

function setTargetLang(langCode) {
    targetLangCode = langCode;
    txtTargetLangName.text(allLanguages.langName(langCode));
    refreshTranslation();
}

function defaultLang() {
    return defaultLangCode;
}

function setDefaultLang(langCode) {
    defaultLangCode = langCode;
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

function initControls() {
    cmbAddStarredLang = $('#cmbAddStarredLang');
    cAddStarredLang = $('#cAddStarredLang');
    cmbDefaultLang = $('#cmbDefaultLang'); 
    txtInput = $('#txtInput');
    txtOutput = $('#outputSpan');
    txtTargetLangName = $('#txtTargetLangName');
    cStarredLanguages = $('#starredLanguages');
    btnAddStarredLang = $('#btnAddStarredLang');
    cOptions = $('#cOptions');
    btnOptions = $('#btnOptions');
    btnReplace = $('#btnReplace').button();
}

function registerCloseWindowByEsc() {
    window.onkeyup = function (event) {
        if (event.keyCode == 27) {
        	window.close ();
        }
    }
}

