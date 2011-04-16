
var openWindowCommand = {

    run : function () { 
        var clickedNode = document.popupNode;
        var selectedText  = this.getSelectedText(clickedNode);
        
        var windowUrl = 'resource://fasttranslate/translateWindow.html';
        // dependent - close window when Firefox closes
        var windowFeatures = "dependent,centerscreen,resizable,innerWidth=650,innerHeight=400";
        //windowFeatures += ",titlebar=no";
        window.openDialog(windowUrl, "Translate", windowFeatures, selectedText, ffPrefs);
        
        // this is how to get resource strings into javascript
        //var ui_strings = document.getElementById("ui_strings");
        //ui_strings.getString("menuitem.title");
    },
    
    getSelectedText : function(clickedNode) {
        if (clickedNode != null) {
            // Special node types - input or textarea
            var clickedNodeName = clickedNode.localName.toLowerCase();
            if ((clickedNodeName == "textarea") || (clickedNodeName == "input" && clickedNode.type == "text")) {
                return clickedNode.value.substring(clickedNode.selectionStart, clickedNode.selectionEnd);
            }
        }
        // Generic way to get selection
        return document.commandDispatcher.focusedWindow.getSelection().toString();
    }
};
