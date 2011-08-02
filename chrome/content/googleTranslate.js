// Wraps Google's translation service and provides a bit of 'smart' logic on top of it.
// Using the 'revealing module pattern' http://addyosmani.com/resources/essentialjsdesignpatterns/book/

var googleTranslate = function () {

    var translateUrl = "http://ajax.googleapis.com/ajax/services/language/translate";
    var detectUrl = "http://ajax.googleapis.com/ajax/services/language/detect";
    var apiKey = "ABQIAAAAyVe43xCSbPm2ujTjdoIuHhTNFBTXcVoi_aH6YNJgFN7Emd4MJBS4E3dOq2L8GfPssVEyePXYxdy1aQ";
    // not using v2 currently
    //var translateUrl = "https://www.googleapis.com/language/translate/v2";
    //var detectUrl = "https://www.googleapis.com/language/translate/v2/detect";
    //var apiKey = "AIzaSyBQW4pQeEFnJVfu13NIQxCDdv41wb_B778";
    
    var noTargetLangErrorMsg = "Please specify target language.";
    
    // Wraps the Google translate 'detect' call
    // langFrom, langTo: language code string (e.g. 'en')  
    // onSuccess: function(string detectedLangCode, float confidence) 
    // onError: function(string message)
    function detect(inputStr, onSuccess, onError) 
    {
       $.ajax({  
                url: detectUrl,  
                dataType: 'jsonp',
        data: { q: inputStr,
                key: apiKey,
                v: '1.0' },
                success: function(result) {
                    if (!result.responseData) {
                        onError(result.responseDetails);
                    } else {
                        onSuccess(result.responseData.language, result.responseData.confidence);
                    }    
                },  
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    onError(textStatus);
                }  
            });
    }
    
    // 'Smart' translation:
    // Example: If user's mother tongue (defaultLang) is English,
    // then translate anything to English, except when the user actually
    // types something in English -> then translate to selected foreign language.
    // onSuccess: function(string translatedStr, string sourceLang, string targetLang) 
    // onError: function(string message)
    function translateSmart(defaultLang, foreignLang, inputStr, onSuccess, onError) 
    {
       detect(inputStr, 
          function(detectedLang, confidence) {
              // from anything to defaultLang 
              var from = detectedLang;
              var to = defaultLang; 
              // if input is in defaultLang, output foreignLang
              if (from == defaultLang) {
                  to = foreignLang;   
              }
              if (confidence < 0.003) {
                  // Special case: the input language can't really be detected (one word).
                  // Instead of using some random detected language, assume that user 
                  // typed the word in their default lang.
                  from = defaultLang;
                  to = foreignLang;
              }
              if (to == '') {
                  // translating from default lang, but no foreign lang given
                  onError(noTargetLangErrorMsg);
                  return;
              }
              translate(from, to, inputStr, 
                function(responseData) { 
                    // show translated string
                    onSuccess(responseData.translatedText, from, to); 
                }, 
                function(errorMessage) { onError(errorMessage); } );
          }, 
          function(errorMessage) { onError(errorMessage); } 
      );
    }
    
    // always translate auto->selected
    // onSuccess: function(string translatedStr, string sourceLang, string targetLang) 
    // onError: function(string message)
    function translateSimple(defaultLang, targetLang, inputStr, onSuccess, onError)
    {
        // defaultLang is not used, but kept for API compatibility with translateSmart
        // '' is for 'auto'
        translate('', targetLang, inputStr,
            function(responseData) { 
                onSuccess(responseData.translatedText, responseData.detectedSourceLanguage, targetLang); 
            }, 
            function(errorMessage) { onError(errorMessage); } 
        );
    }
        
    // Wraps the Google translate 'translate' call
    // langFrom, langTo: language code string (e.g. 'en')  
    // onSuccess: function(string responseData) (contains translatedText, detectedSourceLanguage) 
    // onError: function(string message)
    function translate(langFrom, langTo, inputStr, onSuccess, onError) 
    {
      $.ajax({  
                url: translateUrl,  
                dataType: 'jsonp',
        data: { q: inputStr,
                v: '1.0',
                key: apiKey,
                langpair: langFrom + '|' + langTo },
                success: function(result) {
                    if (!result.responseData) {
                        onError(sprintf('Google could not translate %s to %s: %s.', 
                                allLanguages.getLangName(langFrom), 
                                allLanguages.getLangName(langTo), 
                                result.responseDetails));
                    } else {
                        onSuccess(result.responseData);
                    }
                },  
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    onError(textStatus);
                }  
            });
    }
        
    return {   
        translateSmart: translateSmart,
        translateSimple: translateSimple
    }
}();