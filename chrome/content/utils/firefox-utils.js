var firefox = {
    getBrowserLang: function() {
        var mozPrefs = Components.classes["@mozilla.org/preferences-service;1"]
                        .getService(Components.interfaces.nsIPrefService);
        return mozPrefs.getBranch("general.").getCharPref("useragent.locale");  
    }
}