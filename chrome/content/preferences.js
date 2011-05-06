// Persistently (locally) stores selected languages.

// We are using Firefox preferences (instead of local storage) because 
// Firefox does not support local storage in file:/// protocol (Chrome does).
// Maybe the FF team will change this in the final FF4, but we still want to
// support FF3. 

// Constructor of Preferences object.
var Preferences = function()
{
    this.defaultStarredLangs = [];
    this.defaultTargetLang = '';
    this.defaultDefaultLang = firefox.getBrowserLang().split("-")[0];
    this.firefoxPrefs = this.getFirefoxPreferences();
    
    this.starredLangs = this.defaultStarredLangs;
    this.targetLang = this.defaultTargetLang;
    this.defaultLang = this.defaultDefaultLang;
    
    this.load();
    return this;
}

// Returns true if persistence of preferences is available.
Preferences.prototype.isAvailable = function()
{
    return this.firefoxPrefs != '';
}  

Preferences.prototype.getTargetLang = function() 
{
    return this.targetLang; 
}
       
Preferences.prototype.setTargetLang = function(langCode) 
{
    this.targetLang = langCode;
    this.save(); 
}

Preferences.prototype.getDefaultLang = function() 
{
    return this.defaultLang; 
}
      
Preferences.prototype.setDefaultLang = function(langCode) 
{
    this.defaultLang = langCode;
    this.save(); 
}
 
// Gets array of starred languages.    
Preferences.prototype.getStarredLangs = function() 
{
    return this.starredLangs;
} 

// Adds a lang code to the collection of starred languages.
Preferences.prototype.addStarredLang = function(langCode)
{
    if (this.starredLangs.contains(langCode)) {
        return;
    }
    this.starredLangs.push(langCode); 
    this.save();   
}

// Removes a lang code from the collection of starred languages.
Preferences.prototype.removeStarredLang = function(langCode)
{
    this.starredLangs.remove(langCode);
    this.save();   
}

// Loads the values from FF property service.
Preferences.prototype.load = function() 
{
    if (this.firefoxPrefs.prefHasUserValue("targetLang")) {
        this.targetLang = this.firefoxPrefs.getCharPref("targetLang"); 
    }
    if (this.firefoxPrefs.prefHasUserValue("defaultLang")) {
        this.defaultLang = this.firefoxPrefs.getCharPref("defaultLang");    
    }
    if (this.firefoxPrefs.prefHasUserValue("starredLangs")) {
        var loadedLangs = this.firefoxPrefs.getCharPref("starredLangs"); 
        this.starredLangs = JSON.parse(loadedLangs);    // porting to Chrome: JSON is FF specific
    }
}  

// Saves all preferences. 
Preferences.prototype.save = function() 
{
    if (!this.isAvailable()) {
        return;
    }
    this.firefoxPrefs.setCharPref("targetLang", this.getTargetLang());
    this.firefoxPrefs.setCharPref("defaultLang", this.getDefaultLang());
    this.firefoxPrefs.setCharPref("starredLangs", JSON.stringify(this.getStarredLangs())); // porting to Chrome: JSON is FF specific
    this.getFirefoxPrefsService().savePrefFile(null);
}                  

Preferences.prototype.getFirefoxPrefsService = function()
{
    return Components.classes["@mozilla.org/preferences-service;1"]
                .getService(Components.interfaces.nsIPrefService);
}

// Get the Firefox preferences object for fastranslate addon.
Preferences.prototype.getFirefoxPreferences = function()
{
    try {
        return this.getFirefoxPrefsService().getBranch("extensions.mkonicek.fasttranslate.");
    } catch(msg) {
        alert(msg);
        return '';
    }
}