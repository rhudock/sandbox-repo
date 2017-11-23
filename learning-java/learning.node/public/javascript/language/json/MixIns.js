	/**
	 * MixIns defines reusable interfaces with default implementations that
	 * can be added to a target object at runtime.
	 * @namespace Holds functionality related to Mix-ins.
	 */
	var MixIns = (function(){
		/** @inner */
		function _throwNoImpl(){
			throw (""+this.getID()+": "+arguments.callee.name+" requires override.");
		}

        function wrapWithTryCatch(code) {
            // window.console is used because Inq.log() is not available in XFormExternsions
            return "try{" + code + "}catch(e){if(window.console)window.console.error('ERROR:' + e.message);};\n";
        }

		/**
		 * Document Absorber class here
		 * @name Absorber
		 * @class
		 */
		var Absorber =
		/**
		 * This is an API that can be mixed into other objects
		 * @lends Absorber#
		 */
		{
			/**
			 * Absorbs the contents of the argument object into self
			 * @param {Object} absorbee object to absorb fields from
			 * @param {boolean} [agregateFlag] Optional flag, if true, then nested 1st level objects are augmented, not overwritten.
			 * @returns this for chaining convenience
			 */
			absorb: function(absorbee, agregateFlag) {
				if(absorbee){
					for(var name in absorbee) {
						if ((typeOf(this[name]) == 'object') && (typeOf(absorbee[name]) == 'object') && agregateFlag) {
							MixIns.mixAbsorber(this[name]);
							this[name].absorb(absorbee[name]);
						} else {
							this[name]=absorbee[name];
						}
					}
				}
				return this;
			}
		};

		/**
		 * Add the RemoteCaller interface to a target object.
		 * The target object will gain the following methods:
		 * onRemoteCallback, callRemote, getRID
		 * @class
		 * @name RemoteCaller
		 */
		var RemoteCaller =
			/**
			 * This is an API that can be mixed into other objects
			 * @lends RemoteCaller#
			 */
		{
				/**
				 * callback on a remote call
				 */
				onRemoteCallback: _throwNoImpl,
				/**
				 * calls out a round trip message to a remote server via a url
				 * @param {string} url properly formatted base url to communicate
				 * @param {object} data name-value pairs to be sent to the server
				 */
				callRemote: function(url, data){
					ROM.doRemoteCall(url, data, this);
				},
				send: function(url, data) {
					ROM.send(url, data);
				}
		};

		/**
		 * Support for resource interface
		 * @class
		 * @name Resource
		 */
		var Resource =
			/**
			 * This is an API that can be mixed into other objects
			 * @lends Resource#
			 */
		{
				/**
				 * "super" type constructor. REQUIRED on construction.
				 * @param {string} id The resource id
				 */
				_resource: function(id){
					this._rsrcID = id;
				},
				/**
				 * Writes name-value pairs to resource. If value is undefined, name-value pair is deleted from resource.
				 * @param {string} name name part to be saved
				 * @param {object} value value to be saved with the name.
				 * 	If undefined, name-value pair is deleted from resource.
				 */
				write: _throwNoImpl,
				/**
				 * Reads an object from the resource.
				 * @param {string} name name of the object to be retrieved from resource
				 */
				read: _throwNoImpl,
				/**
				 * helper method to serialize values.
				 * @param {object} o object to be serialized
				 * @return {string} string value of the object
				 * @public
				 */
				_serialize: _throwNoImpl,
				/**
				 * helper method to de-serialize strings to objects.
				 * @param {string} o string to be deserialized
				 * @return {object} object or null if either not deserialzable or not found
				 * @public
				 * @throws {string} error on de-serialization
				 */
				_deserialize: _throwNoImpl,
				/**
				 * obtains the resource id for the resource
				 */
				getResourceID: function(){
					return this._rsrcID;
				}
		};

		/**
		 * Support for DataReadyListener interface
		 * @class
		 * @name DataReadyListener
		 * @see PersistenceMgr
		 */
		var DataReadyListener =
			/**
			 * This is an API that can be mixed into other objects
			 * @lends DataReadyListener#
			 */
		{
			/**
			 * Invoked when a data ready evt is fired
			 */
				onDataReady: _throwNoImpl
		};


		/**
		 * Support for Persistable interface
		 * @class
		 * @name Persistable
		 * @see PersistenceMgr
		 */
		var Persistable =
			/**
			 * This is an API that can be mixed into other objects
			 * @lends Persistable#
			 */
		{
				/**
				 * obtains the persistable's id
				 * @return {string} string id
				 */
				getPersistentID: _throwNoImpl,
				/**
				 * loads the persistable's data from serialzed repository to memory
				 */
				load: _throwNoImpl,
				/**
				 * saves the persistables memory data to data repository
				 */
				save: _throwNoImpl,
				/**
				 * invoked as data ready listener
				 * @borrows DataReadyListener#onDataReady ad #onDataReady
				 */
				onDataReady: _throwNoImpl
		};

		/**
		 * Document FrameworkModule class here
		 * @name FrameworkModule
		 * @class
		 */
		var FrameworkModule =
			/**
			 * This is an API that can be mixed into other objects
			 * @lends FrameworkModule#
			 */
		{
				_frameworkModule: function(id){
					this._id = id;
				},
				getID: function(){ return this._id;},
				/**
				 * initialized a module. Contract: internal init only. No linkage.
				 */
				init: _throwNoImpl,
				/**
				 * starts a module.
				 */
				start: _throwNoImpl,
				/**
				 * resets a module completely.
				 */
				reset: _throwNoImpl
		};

		/**
		 * Document Observable class here
		 * @name Observable
		 * @class
		 */
		var Observable = (function(){
			var retval =
			/**
			 * This is an API that can be mixed into other objects
			 * @lends Observable#
			 */
			{
				/**
					* adds an array of listeners to the class
					*/
				addListeners: function(_arr){
					for(var idx=0; idx < _arr.length; idx++){
						this.addListener(_arr[idx]);
					}
				},

				/**
				 * Must be invoked with constructor
					* @public
					*/
				_observable: function(){
					this._listeners = [];
					this.observable=true;
				},

				/**
					* clears all listeners in the class
					*/
				clearListeners: function(){
					this._listeners=[];
				},
				/**
					* generic event firing method for use by any Observable mixin
					* @public
					*/
				_fireEvt: function(vfcn, evt){
					for(var idx=0; idx < this._listeners.length; idx++){
						var listener = this._listeners[idx];
						vfcn(listener, evt);
						if (typeof listener.onAnyEvent == "function") {
							listener.onAnyEvent(evt);
						}
					}
				},
				/**
					* adds a listener
					*/
				addListener: function(l){
					if(l && (this.isListener(l) || l.onAnyEvent)){
						this._listeners.push(l);
					}
				},
				/**
					* Determines if a given object is an acceptable listener for this class.
					* Overriding this method is required.
					* @throws {String} if the method is invoked without override
					*/
			isListener: _throwNoImpl
			};
			return retval;
		})();


		/**
		 * Document JSON MixIn here
		 * @constructor
		 * @class JSON
		 * @name JSON
		 * @field
		 */
		var JSON = (function(){
			function f(n){
				return n<10?'0'+n:n;
			}
			if(typeof Date.prototype.toJSON!=='function'){
				/** @ignore */
				Date.prototype.toJSON=function(key){
					return this.getTime();
				};
				/** @ignore */
				String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON =
					function(key){
						return this.valueOf();
					};
			}
			var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapeable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},rep;
			function quote(string){
				escapeable.lastIndex=0;
				return escapeable.test(string)?'"'+string.replace(escapeable,function(a){var c=meta[a];if(typeof c==='string'){return c;}return'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+string+'"';
			}
			function str(key,holder){
				var i,k,v,length,mind=gap,partial,value=holder[key];
				if(value&&typeof value==='object'&&typeof value.toJSON==='function'){
					value=value.toJSON(key);
				}
				if(typeof rep==='function'){
					value=rep.call(holder,key,value);
				}
				switch(typeof value){
				case'string':return quote(value);
				case'number':return isFinite(value)?String(value):'null';
                case'boolean':case'null':return String(value);
				case'object':
					if(!value){
						return'null';
					}
					gap+=indent;
					partial=[];
					if(typeof value.length==='number'&&!value.propertyIsEnumerable('length')){
						length=value.length;
						for(i=0;i < length;i+=1){
							partial[i]=str(i,value)||'null';
						}
						v=partial.length===0?'[]':gap?'[\n'+gap+partial.join(',\n'+gap)+'\n'+mind+']':'['+partial.join(',')+']';
						gap=mind;return v;
					}
					if(rep&&typeof rep==='object'){
						length=rep.length;
						for(i=0;i < length;i+=1){
							k=rep[i];
							if(typeof k==='string'){
								v=str(k,value);
								if(v){
									partial.push(k+(gap?': ':':')+v);
								}
							}
						}
					}else{
						for(k in value){
							if (k != "") {
								try {
									if(Object.hasOwnProperty.call(value,k)){
										v=str(k,value);
										if(v){
											partial.push(k+(gap?': ':':')+v);
										}
									}
								} catch (e) {
									var eMsg = 'Exception at Object.hasOwnProperty.call(' + value + ', ' + k + ') ';
									eMsg += catchFormatter(e) + ' in JSON.str(' + key + ', ' + holder + ')';
									ROM.post(urls.loggingURL, {level:'WARN', line: (eMsg)});
								}
							}
						}
					}
					v=partial.length===0?'{}':gap?'{\n'+gap+partial.join(',\n'+gap)+'\n'+mind+'}':'{'+partial.join(',')+'}';
					gap=mind;
					return v;
				}
			}

			function clone(object){			
				return parse(stringify(object));
			}
			
			function stringify(value,replacer,space){
				if(typeof value=="undefined" || value==null) {
					return null;
				}
				var i;
				gap='';
				indent='';
				if(typeof space==='number'){
					for(i=0;i < space;i+=1){
						indent+=' ';
					}
				}else if(typeof space==='string'){
					indent=space;
				}
				rep=replacer;
				if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){
					throw new Error('JSON.stringify');
				}
				return str('',{'':value});
			}

			function parse(text,reviver){
				if(!text) return null;
				var j;
				function walk(holder,key){
					var k,v,value=holder[key];
					if(value&&typeof value==='object'){
						for(k in value){
							if(Object.hasOwnProperty.call(value,k)){
								v=walk(value,k);
								if(v!==undefined){
									value[k]=v;
								}else{
									delete value[k];
								}
							}
						}
					}
					return reviver.call(holder,key,value);
				}
				cx.lastIndex=0;
				if(cx.test(text)){
					text=text.replace(cx,function(a){return'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);});
				}
				//if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/(?:[\w-])+|"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){
					j=eval('('+text+')');
					return typeof reviver==='function'?walk({'':j},''):j;
				//}
				//throw new SyntaxError('JSON.parse');
			}

			var retval =
			/**
			 * This is an API that can be mixed into other objects
			 * @lends JSON#
			 */
			{
				
				/**
				 * converts a given Object into a new object instance
				 * @function
				 * @param object, object to be cloned
				 * @return new object
				 * @throws {Error} When JS object is not "stringifiable"
				 */
				clone: clone,
									
				/**
				 *  converts a given object to JSON string
				 *  @function
				 *  @param value val
				 *  @param replacer replacer
				 *  @param space space
				 *  @throws {SyntaxError} When invalid JSON string is parsed
				 */
				stringify: stringify,
				/**
				 * converts a given JSON string to an object
				 * @function
				 * @param text text to be parsed into an object. Must be valid JSON string to succeed
				 * @param reviver
				 * @throws {Error} When JS object is not "stringifiable"
				 */
				parse: parse
			};
			return retval;
		})();

		/**
		 * This mixin is for objects that need to be able to clone themself.
		 * @name Cloneable
		 * @class Cloneable
		 */
		var Cloneable = (function(){
			var retval =
			/**
			* This is an API that can be mixed into other objects
			* @lends Cloneable#
			*/
			{

				/**
				* Returns clone of the object.
				* Overriding this method is required.
				* @throws {String} if the method is invoked without override
				*/
				clone: function(){
					return JSON.parse(JSON.stringify(this));
				}
			};

			return retval;
		})();

		var mixIn = function(mixable){
			if(mixable){
				for(var name in mixable){
					if(!this[name]) {
						if(this.prototype) {
							this.prototype[name]=mixable[name];
						} else {
							this[name] = mixable[name];
						}
					}
				}
			}
			return this;
		};

		function prepare(_class){
			if(_class){
				_class.mixIn = mixIn;
			}
			return _class;
		}

		function mixAbsorber(o){
			if(!o){
				o= {};
			}
			o.absorb = Absorber.absorb;
			return o;
		}

		function clonize(o){
			if(!!o && typeOf(o)=="object"){
				o.clone = function(){
					return JSON.parse(JSON.stringify(this));
				}
			}
			return o;
		}

		/**
		 * Settable allows set chaining.
		 * @param {Object} the object instance to be made into a "settable".
		 * If null or undefined, a new object settable will be created and returned. If
		 * non-object is passed it will not be mixed (ignored).
		 * Ex. var o = MixIns.mixSettable().set("a",123).set(2, "foo");
		 */
		function mixSettable(o){
			if(isNullOrUndefined(o)){
				o = {};
			}
			if(!!o && typeOf(o)=="object"){
				/**
				 * sets a name value to this object.
				 * @param n {any} assigns the given value to the name.
				 * Will not assign if null or undefined.
				 * @param v {any} Value for the given name to be assigned to the object
				 * @returns this object always.
				 */
				o.set = function(n,v){
					if(!!n || n===0 || n === ""){
						this[n]=v;
					}else{
						log("Settable: Unable to set n,v=("+n+","+v+") on "+this.toString()+". \n"+getStackTrace(new Error()));
					}
					return this;
				};
			}
			return o;
		}
		/**
		 * Removable allows remove chaining.
		 * @param {Object} the object instance to be made into a "settable".
		 * If null or undefined, a new object settable will be created and returned. If
		 * non-object is passed it will not be mixed (ignored).
		 * Ex. var o = MixIns.mixSettable().set("a",123).set(2, "foo");
		 */
		function mixRemovable(o){
			if(isNullOrUndefined(o)){
				o = {};
			}
			if(!!o && typeOf(o)=="object"){
				/**
				 * Removes a named value from this object.
				 * @param n {any} assigns the given value to the name.
				 * Will not assign if null or undefined.
				 * @returns this object always.
				 */
				o.remove = function(n){
					if(!!n || n===0 || n === ""){
						delete this[n];
					}
					return this;
				};
			}
			return o;
		}
		/**
		 * Renamable allows remove chaining.
		 * @param {Object} the object instance to be made into a "settable".
		 * If null or undefined, a new object settable will be created and returned. If
		 * non-object is passed it will not be mixed (ignored).
		 * Ex. var o = MixIns.mixSettable().set("a",123).set(2, "foo");
		 */
		function mixRenamable(o){
			if(isNullOrUndefined(o)){
				o = {};
			}
			if(!!o && typeOf(o)=="object"){
				/**
				 * Renames a named value in this object.
				 * @param n {any} assigns the given value to the name.
				 * Will not assign if null or undefined.
				 * @returns this object always.
				 */
				o.rename = function(on,nn){
					if((!!on || on===0 || on === "") && (!!nn || nn===0 || nn === "")){
						var v = this[on];
						if(!!v || v===0){
							delete this[on];
						}
						this[nn]=v;
					}
					return this;
				};
			}
			return o;
		}
		function unmixMutatable(o){
			delete o.rename;
			delete o.remove;
			delete o.set;
			return o;
		}
		
		function mixMutatable(o){
			o = mixRemovable(o);
			o = mixSettable(o);
			o = mixRenamable(o);
			return o;
		}

		return {
			prepare: prepare,
			Observable: Observable,
			JSON: JSON,
			mixMutatable: mixMutatable,
			unmixMutatable:unmixMutatable,
			mixAbsorber: mixAbsorber,
			Absorber: Absorber,
			Resource: Resource,
			Persistable: Persistable,
			FrameworkModule:FrameworkModule,
			RemoteCaller:RemoteCaller,
			clonize: clonize,
			Cloneable:Cloneable,
            wrapWithTryCatch:wrapWithTryCatch
		};
	})();
	
