// Not used anymore. Delete.

let EXPORTED_SYMBOLS = ["GoogleTranslate"];

const Cc = Components.classes;
const Ci = Components.interfaces;

let _langDict = {
    "auto": "auto",
    "af": "afrikaans",
    "sq": "albanian",
    "ar": "arabic",
    "be": "belarusian",
    "bg": "bulgarian",
    "ca": "catalan",
    "zh-CN": "chineseS",
    "zh-TW": "chineseT",
    "hr": "croatian",
    "cs": "czech",
    "da": "danish",
    "nl": "dutch",
    "en": "english",
    "et": "estonian",
    "tl": "filipino",
    "fi": "finnish",
    "fr": "french",
    "gl": "galician",
    "de": "german",
    "el": "greek",
    "iw": "hebrew",
    "hi": "hindi",
    "hu": "hungarian",
    "is": "icelandic",
    "id": "indonesian",
    "ga": "irish",
    "it": "italian",
    "ja": "japanese",
    "ko": "korean",
    "lv": "latvian",
    "lt": "lithuanian",
    "mk": "macedonian",
    "ms": "malay",
    "mt": "maltese",
    "no": "norwegian",
    "fa": "persian",
    "pl": "polish",
    "pt": "portuguese",
    "ro": "romanian",
    "ru": "russian",
    "sr": "serbian",
    "sk": "slovak",
    "sl": "slovenian",
    "es": "spanish",
    "sw": "swahili",
    "sv": "swedish",
    "th": "thai",
    "tr": "turkish",
    "uk": "ukrainian",
    "vi": "vietnamese",
    "cy": "welsh",
    "yi": "yiddish"
};

var GoogleTranslate = function () {

    // App version check
    //var appInfo = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULAppInfo);
    //var versionChecker = Components.classes["@mozilla.org/xpcom/version-comparator;1"].getService(Components.interfaces.nsIVersionComparator);
    
    var console = Cc["@mozilla.org/consoleservice;1"].getService(Ci.nsIConsoleService);
    var log = function(msg) {
                console.logStringMessage(msg);
    }
    
    return {    
        translate: function(langFrom, langTo, text, onLoadFn, onErrorFn) 
        {
          var url = this.getTranslateUrl(langFrom, langTo, text);
          var req = Cc["@mozilla.org/xmlextras/xmlhttprequest;1"]  
                          .createInstance(Ci.nsIXMLHttpRequest);

          req.addEventListener("load", (function() {
              if (req.status !== 200) {
                  onErrorFn(req.statusText);
                  return;
              }
               
              log(req.responseText);
              var response = JSON.parse(req.responseText);

              if (!response.responseData || response.responseStatus !== 200) {
                  onErrorFn(response.responseDetails);
                  return;
              }

              var translatedText = response.responseData.translatedText;
              onLoadFn(translatedText, response.responseData.detectedSourceLanguage || null);
           }), false);

           req.addEventListener("error", onErrorFn, false);

           req.open("GET", url, true);
           req.send(null);
       },
       
       detect: function(text, onLoadFn, onErrorFn) 
       {
          var url = this.getDetectUrl(text);
          var req = Cc["@mozilla.org/xmlextras/xmlhttprequest;1"]  
                          .createInstance(Ci.nsIXMLHttpRequest);

          req.addEventListener("load", (function() {
              if (req.status !== 200) {
                  onErrorFn(req.statusText);
                  return;
              }
               
              log(req.responseText);
              var response = JSON.parse(req.responseText);

              if (!response.responseData || response.responseStatus !== 200) {
                  onErrorFn(response.responseDetails);
                  return;
              }

              var detectedLang = response.responseData.language;
              onLoadFn(detectedLang, response.responseData.isReliable);
           }), false);

           req.addEventListener("error", onErrorFn, false);

           req.open("GET", url, true);
           req.send(null);
       },

       getTranslateUrl: function(langFrom, langTo, text) 
       {
           return 'https://ajax.googleapis.com/ajax/services/language/translate?v=1.0&format=text&langpair=' + langFrom + '%7C' + langTo + '&q=' + encodeURIComponent(text);
       },
       
       getDetectUrl: function(text) 
       {
           return 'https://ajax.googleapis.com/ajax/services/language/detect?v=1.0&q=' + encodeURIComponent(text);
       }
       
       /*trim: function(str) {
          return (str || "").replace(/^\s+|\s+$/g, "");
       }*/
    };
}();


