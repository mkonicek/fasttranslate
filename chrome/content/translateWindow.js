// Object containing persistent user preferences (call save() to persist).
// Passed from overlay.js (for FF security reasons).
var preferences = {
    starredLangs : ['es', 'de'],
    targetLang : 'es',
    defaultLang : 'en'
};

var optionsFirstTime = true;

$(window).load(function() {
    // Argument passed from caller (overlay.js)
    if (window.arguments == undefined) {
        // not running as a browser plugin
        return;
    }
    
    // Passed preferences object (we have to pass it from overlay.js
    // for security reasons)
    preferences = window.arguments[0];
    alert("window.load " + preferences.starredLangs);
    applyPreferences();
    
    var browserSelectedText = window.arguments[1];
    if (browserSelectedText != '') {
        setInput(browserSelectedText);
        // show translation if some text was selected
        refreshTranslation();
    }
});

function applyPreferences() {
	initStarredLanguagesUI();
    setTargetLangRefreshUI();
    alert("applyPreferences: setting default cmb val to " + getDefaultLang());
    cmbDefaultLang.val(getDefaultLang());
}

$(document).ready(function() {
    initControls();

    // Default state
    setInput('');
    txtInput.focus();
    
    txtInput.autoResizeTextArea();
	txtInput.keyup(function(event) {
	   refreshTranslation();
	});
	
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
            cmbDefaultLang.val(getDefaultLang());
            cmbDefaultLang.makeComboBox();
            optionsFirstTime = false;
        }
        cOptions.slideToggle(200, function () {
            var cmbInput = $('#cCmbDefaultLang .ui-autocomplete-input');
            cmbInput.select();
        });
    });
    cmbDefaultLang.change(function(event) {
        // add lang to starred langs
        var selectedDefaultLang = cmbDefaultLang.val();
        setDefaultLang(selectedDefaultLang);
        refreshTranslation();
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
    googleTranslate.translateSmart(getDefaultLang(), getTargetLang(), getInput(),
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

function initStarredLanguagesUI() {
    alert("initing starred UI " + getStarredLangs());
    cStarredLanguages.empty();
    $.each(getStarredLangs(), function(index, langCode) {
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
    });
    delButton = starredLangListItem.find('.starredLangDel');
    delButton.click(function(event) {
        starredLangListItem.slideUp(400, function() { $(this).remove(); } );
        removeStarredLang(langCode);
    });
}

