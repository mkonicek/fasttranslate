$.prototype.autoResizeTextArea = function() {
    this.autoResize({
        // http://james.padolsey.com/javascript/jquery-plugin-autoresize/
        animate : false,
        limit : 500,
        // More extra space:
        extraSpace : 20
    });
}