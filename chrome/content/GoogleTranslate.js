var googleTranslate = function () {
    
    var translateUrl = "https://ajax.googleapis.com/ajax/services/language/translate";
    var detectUrl = "https://ajax.googleapis.com/ajax/services/language/detect";
    
    return {   
        // Translate auto->defaultLang.
        // If inputStr is in defaultLang, translate to foreignLang.
        // onSuccess: function(string detectedLangCode, bool isReliable) 
        // onError: function(string message)
        translateSmart: function(defaultLang, foreignLang, inputStr, onSuccess, onError) 
        {
           googleTranslate.detect(inputStr, 
              function(detectedLang, isReliable) {
                  // from anything to defaultLang 
                  var from = detectedLang;
                  var to = defaultLang; 
                  // if input is in defaultLang, output foreignLang
                  if (from == defaultLang) {
                    to = foreignLang;   
                  }
                  googleTranslate.translate(from, to, inputStr, 
                    function(translatedStr) { 
                      // show translated string
                      onSuccess(translatedStr); 
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
                    langpair: langFrom + '|' + langTo },
    				success: function(result) {
    				    if (!result.responseData) {
    				        onError('Google could not translate to ' + langTo + '.');
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
        // onSuccess: function(string detectedLangCode, bool isReliable) 
        // onError: function(string message)
        detect: function(inputStr, onSuccess, onError) 
        {
           $.ajax({  
    				url: detectUrl,  
    				dataType: 'jsonp',
            data: { q: inputStr,
                    v: '1.0' },
    				success: function(result) {
    				    if (!result.responseData) {
    				        onError(result.responseDetails);
                        } else {
    				        onSuccess(result.responseData.language, result.responseData.isReliable);
    				    }    
    				},  
    				error: function(XMLHttpRequest, textStatus, errorThrown) {
    				    onError(textStatus);
    				}  
    			});
        }
    }
}();