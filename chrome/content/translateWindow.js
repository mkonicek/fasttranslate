// controls
cmbLangFilter = '';
cCmbLangFilter = '';
cmbDefaultLang = '';
txtInput = '';
txtOutput = '';
cStarredLanguages = '';
btnAddStarredLang = '';
cOptions = '';
txtTargetLangName = '';
btnOptions = '';
btnRelace = '';

optionsFirstTime = true;

starredLangs = ['es', 'pl', 'de', 'nl'];
targetLangCode = 'es';
defaultLangCode = 'en';

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
    
    fillLanguagesSelect(cmbLangFilter);
    fillStarredLanguages();
    setTargetLang(targetLangCode);
  
    // Register events
	txtInput.keyup(function(event) {
	   refreshTranslation();
	});
	
	cmbLangFilter.change(function(event) {
	   // Add selected lang to starred langs
	   selectedLangCode = cmbLangFilter.val();
	   cCmbLangFilter.slideToggle(200);
	   addStarredLang(selectedLangCode, allLanguages.langName(selectedLangCode));
	   refreshTranslation();
	});
	
	txtInput.autoResizeTextArea();
    cmbLangFilter.makeComboBox();
    
    cCmbLangFilter.hide();
    
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
    
    btnAddStarredLang.click(function(event) {
        cmbInput = $('#cCmbLangFilter .ui-autocomplete-input');
        cmbInput.val('');
        cCmbLangFilter.slideToggle(200);
        cmbInput.focus();
    }); 
    
    btnReplace.click(function() { alert('a'); })
    btnReplace.toggle();
    
    window.onkeyup = function (event) {
		if (event.keyCode == 27) {
			window.close ();
		}
	}
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
    googleTranslate.translateSmart(defaultLangCode, targetLang(), input(),
      // output translate string
      function(translatedStr) { setOutput(unescape(translatedStr)); },
      // output error message
      function(errorMessage) { setOutput(errorMessage); }
    );
}

function fillLanguagesSelect(select) {
    //comboBox.empty();  // leave the one dummy item there, so that combo stays empty
    $.each(allLanguages.getLanguages(), function(langCode, langName) {   
         select.
              append($("<option />").
              attr("value", langCode).
              text(langName)); 
    });
}

function fillStarredLanguages() {
    cStarredLanguages.empty();
    $.each(starredLangs, function(index, langCode) {
        initStarredLangUI(langCode, allLanguages.langName(langCode));
    });
}

function addStarredLang(langCode, langName) {
    if (starredLangs.contains(langCode))
        return;
    starredLangs.push(langCode);
    initStarredLangUI(langCode, langName);
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
    });
    delButton = starredLangListItem.find('.starredLangDel');
    delButton.click(function(event) {   // without 'var starredLangListItem' this behaves strange
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
    cmbLangFilter = $('#cmbLangFilter');
    cCmbLangFilter = $('#cCmbLangFilter');
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

