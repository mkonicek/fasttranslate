var googleTranslate = function () {
    
    var translateUrl = "https://ajax.googleapis.com/ajax/services/language/translate";
    var detectUrl = "https://ajax.googleapis.com/ajax/services/language/detect";
    var apiKey = "ABQIAAAAyVe43xCSbPm2ujTjdoIuHhTNFBTXcVoi_aH6YNJgFN7Emd4MJBS4E3dOq2L8GfPssVEyePXYxdy1aQ";
    //var translateUrl = "https://www.googleapis.com/language/translate/v2";
    //var detectUrl = "https://www.googleapis.com/language/translate/v2/detect";
    //var apiKey = "AIzaSyBQW4pQeEFnJVfu13NIQxCDdv41wb_B778";
    
    return {   
        // Translate auto->defaultLang.
        // If inputStr is in defaultLang, translate to foreignLang.
        // onSuccess: function(string translatedStr, string sourceLang, string targetLang) 
        // onError: function(string message)
        translateSmart: function(defaultLang, foreignLang, inputStr, onSuccess, onError) 
        {
           googleTranslate.detect(inputStr, 
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
                      // Instead of using some random detected language, assume user 
                      // typed the word in their default lang.
                      from = defaultLang;
                      to = foreignLang;
                  }
                  if (to == '') {
                      // translating from default lang, but no foreign lang given
                      onError("No target language.");
                      return;
                  }
                  googleTranslate.translate(from, to, inputStr, 
                    function(translatedStr) { 
                        // show translated string
                        onSuccess(translatedStr, from, to); 
                    }, 
                    function(errorMessage) { onError(errorMessage); } );
              }, 
              function(errorMessage) { onError(errorMessage); } 
          );
        },
        
        // langFrom, langTo: language code string (e.g. 'en')  
        // onSuccess: function(string translatedStr) 
        // onError: function(string message)
        translate: function(langFrom, langTo, inputStr, onSuccess, onError) 
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
    				        //onError(result.responseDetails);
                        } else {
                            onSuccess(result.responseData.translatedText);
						}
					},  
    				error: function(XMLHttpRequest, textStatus, errorThrown) {
						onError(textStatus);
					}  
    			});
        },
        
        // langFrom, langTo: language code string (e.g. 'en')  
        // onSuccess: function(string detectedLangCode, float confidence) 
        // onError: function(string message)
        detect: function(inputStr, onSuccess, onError) 
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
    }
}();