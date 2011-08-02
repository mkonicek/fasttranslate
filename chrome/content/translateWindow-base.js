// Uninteresting parts of translateWindow.js, to separate logic from boilerplate.

// controls
var cmbLangFilter = '';
var cCmbLangFilter = '';
var cmbDefaultLang = '';
var txtInput = '';
var txtOutput = '';
var cStarredLanguages = '';
var btnAddStarredLang = '';
var cOptions = '';
var btnOptions = '';
var btnRelace = '';

function getTargetLang() {
    return preferences.getTargetLang();
}

function setTargetLang(lang) {
    preferences.setTargetLang(lang);
    setTargetLangRefreshUI();
}

function setTargetLangRefreshUI()
{
    refreshTranslation();
    updateSelectedStarredLang(getTargetLang());
}

function updateSelectedStarredLang(selectedLang)
{
    // remove selected class from all
    $('#cStarredLanguages .starredLang').removeClass('starredLangSelected');
    // add selected class to 1 selected
    $('#cStarredLanguages .cStarredLang.' + selectedLang + ' .starredLang').addClass('starredLangSelected');
}
   
function getDefaultLang() {
    return preferences.getDefaultLang();
}

function setDefaultLang(lang) {
    preferences.setDefaultLang(lang);
}

function getStarredLangs() {
    return preferences.getStarredLangs();
}

function addStarredLang(langCode, langName) {
    if (preferences.getStarredLangs().contains(langCode)) {
        return;
    }
    preferences.addStarredLang(langCode);
    initStarredLangUI(langCode, langName);
}

function removeStarredLang(langCode) 
{
    if (getTargetLang() == langCode) {
        // removing current language
        var currentLangIndex = getStarredLangs().indexOf(langCode);
        if (currentLangIndex == -1) {
            // Lang being removed is not in langs. Should never happen.
            // LOG
            return;
        }
        if (currentLangIndex + 1 < getStarredLangs().length) {
            // select the next one as current
            setTargetLang(getStarredLangs()[currentLangIndex + 1]);
        } else if (currentLangIndex > 0) {
            // select the previous one if we removed the last one
            setTargetLang(getStarredLangs()[currentLangIndex - 1]);
        }
    }
    preferences.removeStarredLang(langCode);
    if (getStarredLangs().length == 0) {
        // no languages left - no target lang
        setTargetLang("");
        return;
    }
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

function setIsOpenedFromTextArea(isOpenedFromTextArea) {
    if (isOpenedFromTextArea) {
        $("#btnReplace").show();
    } else {
        $("#btnReplace").hide();
    }  
}

function initControls() {
    cmbAddStarredLang = $('#cmbAddStarredLang');
    cAddStarredLang = $('#cAddStarredLang');
    cmbDefaultLang = $('#cmbDefaultLang'); 
    txtInput = $('#txtInput');
    txtOutput = $('#outputSpan');
    cStarredLanguages = $('#starredLanguages');
    btnAddStarredLang = $('#btnAddStarredLang');
    cOptions = $('#cOptions');
    btnOptions = $('#btnOptions');
    btnReplace = $('#btnReplace').button();
}

function registerCloseWindowByEsc() {
    window.onkeyup = function (event) {
        if (event.keyCode == 27) {
        	window.close();
        }
    }
}