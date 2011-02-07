
function getFastTranslatePreferences() {
    var prefs = Components.classes["@mozilla.org/preferences-service;1"]
                .getService(Components.interfaces.nsIPrefService);
    prefs = prefs.getBranch("extensions.mkonicek.fasttranslate.");
    return prefs;
}

var prefs = getFastTranslatePreferences();

var ffPrefs = {
    
    defaultStarred : ['es'],
    defaultTargetLang: 'es',
    
    // returns string lang code
    getTargetLang: function() {
        if (!prefs.prefHasUserValue("targetLang")) {
            alert('not present, return default');
            return ffPrefs.defaultTargetLang;
        }
        return prefs.getCharPref("targetLang");    
    },
    
    // takes string lang code
    setTargetLang: function(langCode) {
        alert('setting to ' + langCode);
        prefs.setCharPref("targetLang", langCode);
        alert('set ' + prefs.getCharPref("targetLang"));  
    },
    
    // returns array of lang code strings
    getStarredLangs: function() {
        if (!prefs.prefHasUserValue("starred")) {
            return prefs.defaultStarred;
        }
        return prefs.getCharPref("starred");
    }, 
    
    // takes array of lang code strings
    setStarredLangs: function(arrayLangCodes) {
        prefs.setCharPref("starred", arrayLangCodes);     // TODO serialize
    },  
    
    // saves all preferences
    savePreferences: function() {
        var prefService = Components.classes["@mozilla.org/preferences-service;1"]
                        .getService(Components.interfaces.nsIPrefService);
        alert('saving');
        prefService.savePrefFile(null);
        alert('saved');
    } 
}

var firefox = {
    getBrowserLang: function() {
        var mozPrefs = Components.classes["@mozilla.org/preferences-service;1"]
                        .getService(Components.interfaces.nsIPrefService);
        return mozPrefs.getBranch("general.").getCharPref("useragent.locale");  
    }
}

var openWindowCommand = {

    run : function () { 
        var clickedNode = document.popupNode;
        var selectedText  = this.getSelectedText(clickedNode);
        
        var windowUrl = 'resource://fasttranslate/translateWindow.html';
        // dependent makes window close when Firefox closes
        var windowFeatures = "dependent,centerscreen,resizable,innerWidth=650,innerHeight=400";
        //windowFeatures += ",titlebar=no";
        window.openDialog(windowUrl, "Translate", windowFeatures, selectedText, ffPrefs);
        
        //alert("body overlay " + $('body').html());
        //$('body').append('<div>Body append overlay!</div>'); 
        //var windowUrl = 'file:///D:/code/firefox/fasttranslate/chrome/content/fasttranslate/translateWindow.html';
        //var windowUrl = 'resource://fasttranslate/translateWindow.html';
        /*$('<div>Hello</div>').dialog({
				      //autoOpen: false,
				      title: "Translate",
				      width: 650,
				      height: 450
			  }); */
        
        // this is how to get resource strings into javascript
        //var ui_strings = document.getElementById("ui_strings");
        //ui_strings.getString("menuitem.title");
    },
    
    getSelectedText : function(clickedNode) {
        if (clickedNode != null) {
          // Special node types - input or textarea
          var clickedNodeName = clickedNode.localName.toLowerCase();
          if ((clickedNodeName == "textarea") || (clickedNodeName == "input" && clickedNode.type == "text")) {
              return clickedNode.value.substring(clickedNode.selectionStart, clickedNode.selectionEnd);
          }
        }
        // Generic way to get selection
        return document.commandDispatcher.focusedWindow.getSelection().toString();
    }
};
