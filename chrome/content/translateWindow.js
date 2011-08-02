
// The main logic of the FastTranslate addon.



// Preferences object containing persistent user preferences (call save() to persist).
// Passed from overlay.js (for FF security reasons).
var preferences = new DefaultPreferences();

var optionsFirstTime = true;

$(window).load(function() {
    // Argument passed from caller (overlay.js)
    if (window.arguments == undefined) {
        // not running as a browser plugin, still apply the default preferences
        applyPreferences();
        return;
    }
    
    // Arguments object passed from overlay.js
    var windowParams = window.arguments[0];
    
    // (we have to pass preferences from overlay.js for security reasons)
    preferences = windowParams.preferences;
    applyPreferences();
    
    var browserSelectedText = windowParams.selectedText;
    if (browserSelectedText != '') {
        setInput(browserSelectedText);
        // show translation if some text was selected
        refreshTranslation();
    }
    
    setIsOpenedFromTextArea(windowParams.isOpenedFromTextArea);
});

function applyPreferences() {
	initStarredLanguagesUI();
    setTargetLangRefreshUI();
    cmbDefaultLang.val(getDefaultLang());
}

$(document).ready(function() {
    initControls();
    $("#noLanguageDiv").hide();
    $("#infoDiv").hide();
    btnReplace.hide();

    // Default state
    setInput('');
    txtInput.focus();
    
    txtInput.autoResizeTextArea();
	txtInput.keyup(function(event) {
	   refreshTranslation();
	});
	
	// '+ add lang' button
    btnAddStarredLang.click(function(event) {
        openAddLangDropdown();
    });
    // add starred lang Combobox
    cAddStarredLang.hide();
	initDefaultLanguagesCombo(cmbAddStarredLang);
	cmbAddStarredLang.change(function(event) {
        addLangSelected(); 
	});
    cmbAddStarredLang.makeComboBox();
    
    // options
    cOptions.hide();
    
    // replace button
    btnReplace.click(function() { alert('a'); })
    
    registerCloseWindowByEsc();
});   // document.ready

// When user clicks the "Choose a language" helper link
function chooseLang()
{
    openAddLangDropdown();
}

// True if the "add language" UI is opened
var isAddLangOpened = false;

// Opens the "add new language" dropdown
function openAddLangDropdown()
{
    var cmbInput = $('#cAddStarredLang .ui-autocomplete-input');
    if (isAddLangOpened) {
    	cmbInput.autocomplete("search", "");
        cmbInput.focus();
    	return;
	}
    cmbInput.val('');
    btnAddStarredLang.slideToggle(200);
    cAddStarredLang.slideToggle(200, function() {
        isAddLangOpened = true;
        cmbInput.autocomplete("search", "");
        cmbInput.focus();
    });
}

// User selected a new language from the dropdown
function addLangSelected()
{
    var selectedLang = cmbAddStarredLang.val();
    closeAddLang();
    addStarredLang(selectedLang, allLanguages.getLangName(selectedLang));
    setTargetLang(selectedLang);
    refreshTranslation();
}

// Closes the "add language" UI
function closeAddLang()
{
    cAddStarredLang.slideToggle(400, function() { isAddLangOpened = false; } );
    btnAddStarredLang.slideToggle(400);
}

// Translates input text and shows translation in output
function refreshTranslation() {
    if (getInput() == '') {
        setOutput('');
        return;
    }
    if (getInput().length > 5000) {
        setOutput('Sorry, the text is too long.');
        return;
    }
    if (getStarredLangs().length !== 0) {
        $("#noLanguageDiv").hide();
    } else {
        // show 'please add language' when no languages added
        $("#noLanguageDiv").show();
        updateTranslationResult('', '', '');
        return;
    }
    googleTranslate.translateSimple(getDefaultLang(), getTargetLang(), getInput(),
        // show translated string
        function(translatedStr, sourceLang, targetLang) {
            // show visually into which lang we are translating, keep targetLang unchanged
            // updateSelectedStarredLang(targetLang);  // only needed for translateSmart
            updateTranslationResult(unescape(translatedStr), sourceLang, targetLang); 
        },
        // show error message
        function(errorMessage) { 
            if (errorMessage == googleTranslate.noTargetLangErrorMsg) { 
                setOutput("");
            } else {
                setOutput(errorMessage);
            } 
        }
    );
}

function updateTranslationResult(translatedStr, sourceLang, targetLang)
{
    setOutput(translatedStr);
}

function initDefaultLanguagesCombo(languagesSelect) {
    //comboBox.empty();  // leave the one dummy item, so that combo stays empty
    $.each(allLanguages.getLanguages(), function(langCode, langName) {   
         languagesSelect.
              append($("<option />").
              attr("value", langCode).
              text(langName)); 
    });
}

function initStarredLanguagesUI() {
    cStarredLanguages.empty();
    $.each(getStarredLangs(), function(index, langCode) {
        initStarredLangUI(langCode, allLanguages.getLangName(langCode));
    });
}

function initStarredLangUI(langCode, langName) {
    var starredLangListItem = $(
        '<li class="starredLangItem">\
            <div class="cStarredLang ' + langCode + '">\
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

