

/**
 * Function has one argument and adds the argument's attributes to its caller 'this'
 * So a caller will have additional attributes and functions.
 * 
 * @param mixable
 * @returns
 */

function mixIn(mixable) {
	if (mixable) {
		for ( var name in mixable) {
			if (!this[name]) {
				if (this.prototype) {
					this.prototype[name] = mixable[name];
				} else {
					this[name] = mixable[name];
				}
			}
		}
	}
	return this;
}