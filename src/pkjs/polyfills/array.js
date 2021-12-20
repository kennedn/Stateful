
if(!Array.prototype.indexOf){
  Array.prototype.indexOf = (function(Object, max, min){
    "use strict";
    return function indexOf(member, fromIndex) {
      if(this===null||this===undefined)throw TypeError("Array.prototype.indexOf called on null or undefined");

      var that = Object(this), Len = that.length >>> 0, i = min(fromIndex | 0, Len);
      if (i < 0) i = max(0, Len+i); else if (i >= Len) return -1;

      if(member===void 0){ for(; i !== Len; ++i) if(that[i]===void 0 && i in that) return i; // undefined
      }else if(member !== member){   for(; i !== Len; ++i) if(that[i] !== that[i]) return i; // NaN
      }else                           for(; i !== Len; ++i) if(that[i] === member) return i; // all else

      return -1; // if the value was not found, then return -1
    };
  })(Object, Math.max, Math.min);
}
if (!Array.prototype.includes) {
	Array.prototype.includes = function(search, start) {
		'use strict';
		if (search instanceof RegExp) {
			throw TypeError('first argument must not be a RegExp');
		}
		if (start === undefined) { start = 0; }
		return this.indexOf(search, start) !== -1;
	};
}

if (!Array.prototype.fill) {
  Object.defineProperty(Array.prototype, 'fill', {
    value: function(value) {

      // Steps 1-2.
      if (this == null) {
        throw new TypeError('this is null or not defined');
      }

      var O = Object(this);

      // Steps 3-5.
      var len = O.length >>> 0;

      // Steps 6-7.
      var start = arguments[1];
      var relativeStart = start >> 0;

      // Step 8.
      var k = relativeStart < 0 ?
        Math.max(len + relativeStart, 0) :
        Math.min(relativeStart, len);

      // Steps 9-10.
      var end = arguments[2];
      var relativeEnd = end === undefined ?
        len : end >> 0;

      // Step 11.
      var finalValue = relativeEnd < 0 ?
        Math.max(len + relativeEnd, 0) :
        Math.min(relativeEnd, len);

      // Step 12.
      while (k < finalValue) {
        O[k] = value;
        k++;
      }

      // Step 13.
      return O;
    }
  });
}