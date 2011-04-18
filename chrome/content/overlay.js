
var openWindowCommand = {

    run : function () { 
        
        var windowUrl = 'resource://fasttranslate/translateWindow.html';
        // dependent - close window when Firefox closes
        var windowFeatures = "dependent,centerscreen,resizable,innerWidth=650,innerHeight=400";
        //windowFeatures += ",titlebar=no";     
        var clickedNode = document.popupNode;
        var windowParams = {
            // passing preferences like this is necessary for security reasons:
            // if preferences is just included by translateWindow.html, it does not
            // have permissions to access Firefox preferences
            preferences: new Preferences(),
            selectedText: this.getSelectedText(clickedNode),
            isOpenedFromTextArea: this.isTextArea(clickedNode)
        };
        window.openDialog(windowUrl, "Translate", windowFeatures, windowParams);
    },
    
    // Returns true if DOM node is input or textarea
    isTextArea: function(clickedNode) 
    {
        if (clickedNode == null) {
            return false;
        }     
        var clickedNodeName = clickedNode.localName.toLowerCase();
        if ((clickedNodeName == "textarea") || (clickedNodeName == "input" && clickedNode.type == "text")) {
            return true;    
        }
        return false;
    },
    
    // Returns the string selected in the browser
    getSelectedText: function(clickedNode) 
    {
        if (openWindowCommand.isTextArea(clickedNode)) {
            return clickedNode.value.substring(clickedNode.selectionStart, clickedNode.selectionEnd);
        }
        // Generic way to get selection
        return document.commandDispatcher.focusedWindow.getSelection().toString();
    }
};
