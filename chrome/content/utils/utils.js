Array.prototype.contains = function(value) {
    return ($.inArray(value, this) != -1)
}

Array.prototype.remove = function(value) {
    idx = this.indexOf(value);
    if (idx != -1) this.splice(idx, 1);
}