EReg = function(r,opt) {
	opt = opt.split("u").join("");/*  'u' (utf8) depends on page encoding*/
	this.r = new RegExp(r,opt);
};

/** @private @type {Array} */
EReg.__name__ = ["EReg"];

/**
 * customReplace
 *
 * $type TFun([{ name => s, t => TInst(String,[]), opt => false },{ name => f, t => TFun([{ name => , t => TInst(EReg,[]), opt => false }],TInst(String,[])), opt => false }],TInst(String,[]))
 * @public
 * @this EReg
 * @param {string}  s 
 * @param {TFun([{ name => , t => TInst(EReg,[]), opt => false }],TInst(String,[]))}  f 
 * @return {string}
 */
EReg.prototype.customReplace = function(s,f) {
	var /** @type {StringBuf} */ buf = new StringBuf();
	while(true) {
		if(!this.match(s)) break;
		buf.b += Std.string(this.matchedLeft());
		buf.b += Std.string(f(this));
		s = this.matchedRight();
	}
	buf.b += Std.string(s);
	return buf.b;
};


/**
 * replace
 *
 * $type TFun([{ name => s, t => TInst(String,[]), opt => false },{ name => by, t => TInst(String,[]), opt => false }],TInst(String,[]))
 * @public
 * @this EReg
 * @param {string}  s 
 * @param {string}  by 
 * @return {string}
 */
EReg.prototype.replace = function(s,by) {
	return s.replace(this.r,by);
};


/**
 * split
 *
 * $type TFun([{ name => s, t => TInst(String,[]), opt => false }],TInst(Array,[TInst(String,[])]))
 * @public
 * @this EReg
 * @param {string}  s 
 * @return {Array}
 */
EReg.prototype.split = function(s) {
	var /** @type {string} */ d = "#__delim__#";
	return s.replace(this.r,d).split(d);
};


/**
 * matchedPos
 *
 * $type TFun([],TAnonymous(<anonymous>))
 * @public
 * @this EReg
 * @return {TAnonymous(<anonymous>)}
 */
EReg.prototype.matchedPos = function() {
	if(this.r.m == null) throw "No string matched";
	return { pos : this.r.m.index, len : this.r.m[0].length};
};


/**
 * matchedRight
 *
 * $type TFun([],TInst(String,[]))
 * @public
 * @this EReg
 * @return {string}
 */
EReg.prototype.matchedRight = function() {
	if(this.r.m == null) throw "No string matched";
	var /** @type {number} */ sz = this.r.m.index + this.r.m[0].length;
	return this.r.s.substr(sz,this.r.s.length - sz);
};


/**
 * matchedLeft
 *
 * $type TFun([],TInst(String,[]))
 * @public
 * @this EReg
 * @return {string}
 */
EReg.prototype.matchedLeft = function() {
	if(this.r.m == null) throw "No string matched";
	return this.r.s.substr(0,this.r.m.index);
};


/**
 * matched
 *
 * $type TFun([{ name => n, t => TInst(Int,[]), opt => false }],TInst(String,[]))
 * @public
 * @this EReg
 * @param {number}  n 
 * @return {string}
 */
EReg.prototype.matched = function(n) {
	return this.r.m != null && n >= 0 && n < this.r.m.length?this.r.m[n]:(function($this) {
		var $r;
		throw "EReg::matched";
		return $r;
	}(this));
};


/**
 * match
 *
 * $type TFun([{ name => s, t => TInst(String,[]), opt => false }],TEnum(Bool,[]))
 * @public
 * @this EReg
 * @param {string}  s 
 * @return {boolean}
 */
EReg.prototype.match = function(s) {
	if(this.r.global) this.r.lastIndex = 0;
	this.r.m = this.r.exec(s);
	this.r.s = s;
	return this.r.m != null;
};

/** @private @type {null} */
EReg.prototype.r = null;
/** @type {EReg} */
EReg.prototype.__class__ = EReg;
