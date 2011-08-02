Array.prototype.contains = function(value) {
    return ($.inArray(value, this) != -1);
}

Array.prototype.remove = function(value) {
    var idx = this.indexOf(value);
    if (idx != -1) this.splice(idx, 1);
}

var utils = {};

utils.unescape = function(value) {
    var htmlNode = document.createElement('div');
    htmlNode.innerHTML = value;
    if (htmlNode.innerText) {
        return htmlNode.innerText; // IE
    }
    return htmlNode.textContent; // FF
}

// Inserts a string into original string at a given position.
// Position must be 0..original.length
utils.insertStringAtPos = function(original, insert, pos) {
    if (utils.isBlank(original)) {
        return insert;
    }
    if (utils.isBlank(insert)) {
        return original;
    }
    return original.substring(0, pos) + insert + original.substring(pos, original.length);
}

utils.isUndefinedOrNull = function(obj) {
    return (typeof obj === 'undefined') || obj === null;
}

utils.isBlank = function(obj) {
    return utils.isUndefinedOrNull(obj) || obj === '';
}
