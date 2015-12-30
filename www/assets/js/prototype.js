if (!String.prototype.trim) {
	String.prototype.trim = function() {
		return this.replace(/(^\s*)|(\s*$)/gi, "");
	}
}

if (!String.prototype.isEmpty) {
	String.prototype.isEmpty = function() {
		return (this.length === 0 || !this.trim());
	}
}