// We are using Firefox preferences (instead of local storage) because 
// Firefox does not support local storage in file:/// protocol (Chrome does).
// Maybe the FF team will change it in the final FF4, but we still want to
// support FF3.

// Constructor of Preferences object.
var DefaultPreferences = function()
{
    this.defaultStarredLangs = ['es'];
    this.defaultTargetLang = 'es';
    this.defaultDefaultLang = 'en';
    
    this.starredLangs = this.defaultStarredLangs;
    this.targetLang = this.defaultTargetLang;
    this.defaultLang = this.defaultDefaultLang;
    
    this.load();
    return this;
}

// Returns true if persistence of preferences is available.
DefaultPreferences.prototype.isAvailable = function()
{
    return true;
}  

// Get target language.
DefaultPreferences.prototype.getTargetLang = function() 
{
    return this.targetLang; 
}
    
// Sets target language.    
DefaultPreferences.prototype.setTargetLang = function(langCode) 
{
    this.targetLang = langCode;
    this.save(); 
}

// Get default language.
DefaultPreferences.prototype.getDefaultLang = function() 
{
    return this.defaultLang; 
}
    
// Sets default language.    
DefaultPreferences.prototype.setDefaultLang = function(langCode) 
{
    this.defaultLang = langCode;
    this.save(); 
}
 
// Gets array of starred languages.    
DefaultPreferences.prototype.getStarredLangs = function() 
{
    return this.starredLangs;
} 

// Adds a lang code to the collection of starred languages.
DefaultPreferences.prototype.addStarredLang = function(langCode)
{
    if (this.starredLangs.contains(langCode)) {
        return;
    }
    this.starredLangs.push(langCode); 
    this.save();   
}

// Removes a lang code from the collection of starred languages.
DefaultPreferences.prototype.removeStarredLang = function(langCode)
{
    this.starredLangs.remove(langCode);
    this.save();   
}

// Loads the values from FF property service.
DefaultPreferences.prototype.load = function() 
{
    
}  

// Saves all preferences. 
DefaultPreferences.prototype.save = function() 
{
   
}                  