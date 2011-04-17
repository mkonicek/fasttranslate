// Uninteresting parts of translateWindow.js, to separate boilerplate from logic.

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
    return preferences.targetLang;
}

function setTargetLang(lang) {
    preferences.targetLang = lang;
    setTargetLangRefreshUI();
}

function setTargetLangRefreshUI()
{
    var targetLang = getTargetLang();
    refreshTranslation();
    // remove selected class from all
    $('#cStarredLanguages .starredLang').removeClass('starredLangSelected');
    // add selected class to 1 selected
    $('#cStarredLanguages .cStarredLang.' + targetLang + ' .starredLang').addClass('starredLangSelected');
}
   
function getDefaultLang() {
    return preferences.getDefaultLang();
}

function setDefaultLang(lang) {
    preferences.setDefaultLang(lang);
}

function getStarredLangs() {
    return preferences.starredLangs;
}

function addStarredLang(langCode, langName) {
    if (preferences.getStarredLangs().contains(langCode)) {
        return;
    }
    preferences.addStarredLang(langCode);
    initStarredLangUI(langCode, langName);
}

function removeStarredLang(langCode) {
    preferences.removeStarredLang(langCode);
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