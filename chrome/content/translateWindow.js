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
var targetLang = 'es';
var defaultLang = 'en';

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
    setTargetLang(preferencesObject.getTargetLang());
}

function savePreferences() {
    preferencesObject.setTargetLang(targetLang);
    preferencesObject.save();
}

$(document).ready(function() {
    initControls();

    // Default state
    setInput('');
    txtInput.focus();
    
    setTargetLang(targetLang);
    
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
        var selectedLang = cmbAddStarredLang.val();
        cAddStarredLang.slideToggle(400);
        btnAddStarredLang.slideToggle(400);
        addStarredLang(selectedLang, allLanguages.getLangName(selectedLang));
        refreshTranslation();
	});
    cmbAddStarredLang.makeComboBox();
    
    // options
    cOptions.hide();
    btnOptions.click(function() {
        if (optionsFirstTime) { 
            fillLanguagesSelect(cmbDefaultLang);
            cmbDefaultLang.val(defaultLang);
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
    if (getInput() == '') {
        setOutput('');
        return;
    }
    googleTranslate.translateSmart(defaultLang, getTargetLang(), getInput(),
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
        initStarredLangUI(langCode, allLanguages.getLangName(langCode));
    });
}

function initStarredLangUI(langCode, langName) {
    var starredLangListItem = $(
        '<li class="starredLangItem">\
            <div class="cStarredLang">\
            <a href="#" class="starredLang">Spanish</a>\
            <a href="#" class="starredLangDel">x</a>  <!-- TODO label with css bg image -->\
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

function getTargetLang() {
    return targetLang;
}

function setTargetLang(lang) {
    targetLang = lang;
    txtTargetLangName.text(allLanguages.getLangName(lang));
    refreshTranslation();
}

function getDefaultLang() {
    return defaultLang;
}

function setDefaultLang(lang) {
    defaultLang = lang;
}

function getInput() {
    return txtInput.val();
}

function setInput(v){
    txtInput.val(v);
}

function getOutput() {
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

