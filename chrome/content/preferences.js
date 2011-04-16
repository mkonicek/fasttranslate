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