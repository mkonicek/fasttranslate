// Constructor of Preferences object.
var Preferences = function()
{
    this.defaultStarredLangs : ['es', 'de'];
    this.defaultTargetLang: 'es';
    this.defaultDefaultLang: 'en';
    this.firefoxPrefs = this.getFirefoxPreferences();
}

// Returns true if persistence of preferences is available.
Preference.prototype.isAvailable = function()
{
    return this.firefoxPrefs != '';
}

// Get target language.
Preference.prototype.getTargetLang = function() 
{
    if (!prefs.prefHasUserValue("targetLang")) {
        alert('not present, return default');
        return this.defaultTargetLang;
    }
    return prefs.getCharPref("targetLang");    
}
    
// Sets target language.    
Preference.prototype.setTargetLang = function(langCode) 
{
    alert('setting to ' + langCode);
    prefs.setCharPref("targetLang", langCode);
    alert('set ' + prefs.getCharPref("targetLang"));  
}
 
// Gets array of starred languages.    
Preference.prototype.getStarredLangs = function() 
{
    if (!prefs.prefHasUserValue("starredLangs")) {
        return prefs.defaultStarred;
    }
    return prefs.getCharPref("starredLangs");
} 
 
// Sets array of starred languages.   
Preference.prototype.setStarredLangs = function(arrayLangCodes) 
{
    alert("saving " + arrayLangCodes);
    prefs.setCharPref("starredLangs", arrayLangCodes);     // TODO serialize
}  

// Saves all preferences. 
Preference.prototype.save = function() 
{
    if (!this.isAvailable()) {
        return;
    }
    alert('saving');
    this.getFirefoxPrefsService().savePrefFile(null);
    alert('saved');
} 

// Get the fastranslate Firefox preferences object.
Preference.prototype.getFirefoxPreferences = function()
{
    try {
      return getFirefoxPrefsService().getBranch("extensions.mkonicek.fasttranslate.");
    } catch(msg) {
        alert(msg);
        return '';
    }
}                    

// Get the Firefox preferences service.
Preferences.prototype.getFirefoxPrefsService = function()
{
    return Components.classes["@mozilla.org/preferences-service;1"]
                .getService(Components.interfaces.nsIPrefService);
}