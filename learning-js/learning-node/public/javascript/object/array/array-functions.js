/**
 * Inheritance Functions
 */
function extend(subClass, superClass) {
   var F = function() {
   };
   F.prototype = superClass.prototype;
   subClass.prototype = new F();
   subClass.prototype.constructor = subClass;

   subClass.superclass = superClass.prototype;
   if (superClass.prototype.constructor == Object.prototype.constructor) {
      superClass.prototype.constructor = superClass;
   }
}


/**
 *  Array.
 *  String.
 *
 */

(function () {

   /**
    * Remove elements of array and return a new array.
    * copy from http://ejohn.org/blog/javascript-array-remove/
    * @param from
    * @param to
    */
   Array.prototype.remove = function(from, to) {
      var rest = this.slice((to || from) + 1 || this.length);
      this.length = from < 0 ? this.length + from : from;
      return this.push.apply(this, rest);
   };

   /**
    *  Remove the element with the given value.
    *  @param s
    */
   Array.prototype.removeElement = function(s) {
      for (i = 0; i < this.length; i++) {
         if (s == this[i]) this.splice(i, 1);
      }
   };

   // To copy an Array in javascript
   // Ref: http://www.sematopia.com/?p=12
   Array.prototype.copy = function() {
      return this.slice();
   };

   // Shakes values in an array
   Array.prototype.shakeArray = function() {
      var lArr = this.copy();
      var newArr = new Array();
      var lArr_length = lArr.length;
      var sel = 0;
      for (i = 0; i < lArr_length; i++) {
         sel = Math.floor(Math.random() * lArr.length);
         newArr.push(lArr[sel]);
         lArr.splice(sel, 1);
      }

      return newArr;
   };

   /**
    *  Return a random value from the array
    */
   Array.prototype.pickAValue = function() {
      return this(Math.floor(Math.random() * this.length));
   };

   /*
    When an array is created in a map behavior, for example arrayname [string key]
    the index can not be iterated with integer for loop.
    This function assumes the key is another index and used to create its value and
    provide mechanism to iterate it.
    */
   Array.prototype.listValue = function(indArray) {
      var returnArray = new Array();
      for (i = 0; i < indArray.length; i++)
         returnArray[i] = this[indArray[i]];
      return returnArray;
   };


   /**
    * Add trim function to the String object.
    * ^\s means white space.
    */
   String.prototype.trim = function () {
      return this.replace(/^\s*/, "").replace(/\s*$/, "");
   };


   /**
    * Source from http://www.xinotes.org/notes/note/884/
    *
    */
   if (typeof Array.prototype.map !== 'function') {
      Array.prototype.map = function(fn) {
         for (var i = 0,r = [],l = this.length; i < l; r.push(fn(this[i++])));
         return r;
      };
   }


})();