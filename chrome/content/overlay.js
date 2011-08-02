// The command called when the context menu item or shortcut fires.
var openWindowCommand = {

    run : function () { 
        
        var windowUrl = 'resource://fasttranslate/translateWindow.html';
        // dependent - close window when Firefox closes
        var windowFeatures = "dependent,centerscreen,resizable,innerWidth=650,innerHeight=400";
        //windowFeatures += ",titlebar=no";     
        var domNode = document.popupNode;
        if (domNode == null) {
            // if invoked by shortcut, use the focused node
            domNode = document.commandDispatcher.focusedElement;
        }
        var windowParams = {
            // passing preferences like this is necessary for security reasons:
            // if preferences.js is just included in translateWindow.html, it does not
            // have permissions to access Firefox preferences
            preferences: new Preferences(),
            selectedText: this.getSelectedText(domNode),
            isOpenedFromTextArea: this.isTextArea(domNode),
            insertTextCallback: this.insertText
        };
        window.openDialog(windowUrl, "Translate", windowFeatures, windowParams);
    },
    
    insertText: function(text) {
        // get the focused node again (storing it caused errors)
        // This can be a different node than the original because user can change focus
        // while the translate window is open, but doing so is uncommon and does not cause any crashes.
        var focusedDomNode = document.commandDispatcher.focusedElement;
        if ((typeof focusedDomNode !== 'undefined') && focusedDomNode != null) {
            focusedDomNode.value = focusedDomNode.value + text;
        }
    },
    
    // Returns the string selected in the browser
    getSelectedText: function(clickedNode) {
        if (openWindowCommand.isTextArea(clickedNode)) {
            return clickedNode.value.substring(clickedNode.selectionStart, clickedNode.selectionEnd);
        }
        // Generic way to get selection
        return document.commandDispatcher.focusedWindow.getSelection().toString();
    },
    
    // Returns true if DOM node is input or textarea
    isTextArea: function(clickedNode) {
        if (clickedNode == null) {
            return false;
        }     
        var clickedNodeName = clickedNode.localName.toLowerCase();
        if ((clickedNodeName == "textarea") || (clickedNodeName == "input" && clickedNode.type == "text")) {
            return true;    
        }
        return false;
    },
};
