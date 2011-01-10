if ("undefined" === typeof(UtilChrome)) {

    var UtilChrome = {
        // debug
        log: function(msg) {
            if (!!window.dump) {
                window.dump("[fasttranslate] " + msg + "\n");
            }
            Components.classes["@mozilla.org/consoleservice;1"]
              .getService(Components.interfaces.nsIConsoleService)
              .logStringMessage(msg);
        }
    };
}
