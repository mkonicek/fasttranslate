// We are using Firefox preferences (instead of local storage) because 
// Firefox does not support local storage in file:/// protocol (Chrome does).
// Maybe the FF team will change it in the final FF4, but we still want to
// support FF3.

// Constructor of Preferences object.
var Preferences = function()
{
    this.defaultStarredLangs = ['es', 'de'];
    this.defaultTargetLang = 'es';
    this.defaultDefaultLang = 'en';
    this.firefoxPrefs = this.getFirefoxPreferences();
    return this;
}

// Returns true if persistence of preferences is available.
Preferences.prototype.isAvailable = function()
{
    return this.firefoxPrefs != '';
}

// Get target language.
Preferences.prototype.getTargetLang = function() 
{
    if (!this.firefoxPrefs.prefHasUserValue("targetLang")) {
        alert('not present, return default');
        return this.defaultTargetLang;
    }
    return this.firefoxPrefs.getCharPref("targetLang");    
}
    
// Sets target language.    
Preferences.prototype.setTargetLang = function(langCode) 
{
    this.firefoxPrefs.setCharPref("targetLang", langCode); 
}
 
// Gets array of starred languages.    
Preferences.prototype.getStarredLangs = function() 
{
    if (!this.firefoxPrefs.prefHasUserValue("starredLangs")) {
        return this.firefoxPrefs.defaultStarred;
    }
    return this.firefoxPrefs.getCharPref("starredLangs");
} 
 
// Sets array of starred languages.   
Preferences.prototype.setStarredLangs = function(arrayLangCodes) 
{
    alert("saving " + arrayLangCodes);
    this.firefoxPrefs.setCharPref("starredLangs", arrayLangCodes);     // TODO serialize
}  

// Saves all preferences. 
Preferences.prototype.save = function() 
{
    if (!this.isAvailable()) {
        return;
    }
    this.getFirefoxPrefsService().savePrefFile(null);
}                  

// Get the Firefox preferences service.
Preferences.prototype.getFirefoxPrefsService = function()
{
    return Components.classes["@mozilla.org/preferences-service;1"]
                .getService(Components.interfaces.nsIPrefService);
}

// Get the fastranslate Firefox preferences object.
Preferences.prototype.getFirefoxPreferences = function()
{
    try {
      return this.getFirefoxPrefsService().getBranch("extensions.mkonicek.fasttranslate.");
    } catch(msg) {
        alert(msg);
        return '';
    }
}