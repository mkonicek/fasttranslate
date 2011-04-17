$.prototype.autoResizeTextArea = function() {
    this.autoResize({
        // http://james.padolsey.com/javascript/jquery-plugin-autoresize/
        animate : false,
        limit : 500,
        // More extra space:
        extraSpace : 20
    });
}

$.prototype.toggleText = function(text1, text2) {
    if (this.text() == text1) {
        this.text(text2);
    } else if (this.text() == text2) {
        this.text(text1);
    }
}