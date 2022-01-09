function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
class EventEmitter {
  constructor() {
    _defineProperty(this, "listenersMap", new Map());
  }

  addListener(event, listener) {
    const listeners = this.listenersMap.get(event);

    if (listeners === undefined) {
      this.listenersMap.set(event, [listener]);
    } else {
      const index = listeners.indexOf(listener);

      if (index < 0) {
        listeners.push(listener);
      }
    }
  }

  emit(event, ...args) {
    const listeners = this.listenersMap.get(event);

    if (listeners !== undefined) {
      if (listeners.length === 1) {
        // No need to clone or try/catch
        const listener = listeners[0];
        listener.apply(null, args);
      } else {
        let didThrow = false;
        let caughtError = null;
        const clonedListeners = Array.from(listeners);

        for (let i = 0; i < clonedListeners.length; i++) {
          const listener = clonedListeners[i];

          try {
            listener.apply(null, args);
          } catch (error) {
            if (caughtError === null) {
              didThrow = true;
              caughtError = error;
            }
          }
        }

        if (didThrow) {
          throw caughtError;
        }
      }
    }
  }

  removeAllListeners() {
    this.listenersMap.clear();
  }

  removeListener(event, listener) {
    const listeners = this.listenersMap.get(event);

    if (listeners !== undefined) {
      const index = listeners.indexOf(listener);

      if (index >= 0) {
        listeners.splice(index, 1);
      }
    }
  }

}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn) {
  var module = { exports: {} };
	return fn(module, module.exports), module.exports;
}

/* eslint complexity: [2, 18], max-statements: [2, 33] */

var shams$1 = function hasSymbols() {
  if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') {
    return false;
  }

  if (typeof Symbol.iterator === 'symbol') {
    return true;
  }

  var obj = {};
  var sym = Symbol('test');
  var symObj = Object(sym);

  if (typeof sym === 'string') {
    return false;
  }

  if (Object.prototype.toString.call(sym) !== '[object Symbol]') {
    return false;
  }

  if (Object.prototype.toString.call(symObj) !== '[object Symbol]') {
    return false;
  } // temp disabled per https://github.com/ljharb/object.assign/issues/17
  // if (sym instanceof Symbol) { return false; }
  // temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
  // if (!(symObj instanceof Symbol)) { return false; }
  // if (typeof Symbol.prototype.toString !== 'function') { return false; }
  // if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }


  var symVal = 42;
  obj[sym] = symVal;

  for (sym in obj) {
    return false;
  } // eslint-disable-line no-restricted-syntax, no-unreachable-loop


  if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) {
    return false;
  }

  if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) {
    return false;
  }

  var syms = Object.getOwnPropertySymbols(obj);

  if (syms.length !== 1 || syms[0] !== sym) {
    return false;
  }

  if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
    return false;
  }

  if (typeof Object.getOwnPropertyDescriptor === 'function') {
    var descriptor = Object.getOwnPropertyDescriptor(obj, sym);

    if (descriptor.value !== symVal || descriptor.enumerable !== true) {
      return false;
    }
  }

  return true;
};

var shams = function hasToStringTagShams() {
  return shams$1() && !!Symbol.toStringTag;
};

var origSymbol = typeof Symbol !== 'undefined' && Symbol;

var hasSymbols$1 = function hasNativeSymbols() {
  if (typeof origSymbol !== 'function') {
    return false;
  }

  if (typeof Symbol !== 'function') {
    return false;
  }

  if (typeof origSymbol('foo') !== 'symbol') {
    return false;
  }

  if (typeof Symbol('bar') !== 'symbol') {
    return false;
  }

  return shams$1();
};

/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr$1 = Object.prototype.toString;
var funcType = '[object Function]';

var implementation = function bind(that) {
  var target = this;

  if (typeof target !== 'function' || toStr$1.call(target) !== funcType) {
    throw new TypeError(ERROR_MESSAGE + target);
  }

  var args = slice.call(arguments, 1);
  var bound;

  var binder = function () {
    if (this instanceof bound) {
      var result = target.apply(this, args.concat(slice.call(arguments)));

      if (Object(result) === result) {
        return result;
      }

      return this;
    } else {
      return target.apply(that, args.concat(slice.call(arguments)));
    }
  };

  var boundLength = Math.max(0, target.length - args.length);
  var boundArgs = [];

  for (var i = 0; i < boundLength; i++) {
    boundArgs.push('$' + i);
  }

  bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

  if (target.prototype) {
    var Empty = function Empty() {};

    Empty.prototype = target.prototype;
    bound.prototype = new Empty();
    Empty.prototype = null;
  }

  return bound;
};

var functionBind = Function.prototype.bind || implementation;

var src = functionBind.call(Function.call, Object.prototype.hasOwnProperty);

var undefined$1;
var $SyntaxError = SyntaxError;
var $Function = Function;
var $TypeError = TypeError; // eslint-disable-next-line consistent-return

var getEvalledConstructor = function (expressionSyntax) {
  try {
    return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
  } catch (e) {}
};

var $gOPD$1 = Object.getOwnPropertyDescriptor;

if ($gOPD$1) {
  try {
    $gOPD$1({}, '');
  } catch (e) {
    $gOPD$1 = null; // this is IE 8, which has a broken gOPD
  }
}

var throwTypeError = function () {
  throw new $TypeError();
};

var ThrowTypeError = $gOPD$1 ? function () {
  try {
    // eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
    arguments.callee; // IE 8 does not throw here

    return throwTypeError;
  } catch (calleeThrows) {
    try {
      // IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
      return $gOPD$1(arguments, 'callee').get;
    } catch (gOPDthrows) {
      return throwTypeError;
    }
  }
}() : throwTypeError;
var hasSymbols = hasSymbols$1();

var getProto$1 = Object.getPrototypeOf || function (x) {
  return x.__proto__;
}; // eslint-disable-line no-proto


var needsEval = {};
var TypedArray = typeof Uint8Array === 'undefined' ? undefined$1 : getProto$1(Uint8Array);
var INTRINSICS = {
  '%AggregateError%': typeof AggregateError === 'undefined' ? undefined$1 : AggregateError,
  '%Array%': Array,
  '%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined$1 : ArrayBuffer,
  '%ArrayIteratorPrototype%': hasSymbols ? getProto$1([][Symbol.iterator]()) : undefined$1,
  '%AsyncFromSyncIteratorPrototype%': undefined$1,
  '%AsyncFunction%': needsEval,
  '%AsyncGenerator%': needsEval,
  '%AsyncGeneratorFunction%': needsEval,
  '%AsyncIteratorPrototype%': needsEval,
  '%Atomics%': typeof Atomics === 'undefined' ? undefined$1 : Atomics,
  '%BigInt%': typeof BigInt === 'undefined' ? undefined$1 : BigInt,
  '%Boolean%': Boolean,
  '%DataView%': typeof DataView === 'undefined' ? undefined$1 : DataView,
  '%Date%': Date,
  '%decodeURI%': decodeURI,
  '%decodeURIComponent%': decodeURIComponent,
  '%encodeURI%': encodeURI,
  '%encodeURIComponent%': encodeURIComponent,
  '%Error%': Error,
  '%eval%': eval,
  // eslint-disable-line no-eval
  '%EvalError%': EvalError,
  '%Float32Array%': typeof Float32Array === 'undefined' ? undefined$1 : Float32Array,
  '%Float64Array%': typeof Float64Array === 'undefined' ? undefined$1 : Float64Array,
  '%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined$1 : FinalizationRegistry,
  '%Function%': $Function,
  '%GeneratorFunction%': needsEval,
  '%Int8Array%': typeof Int8Array === 'undefined' ? undefined$1 : Int8Array,
  '%Int16Array%': typeof Int16Array === 'undefined' ? undefined$1 : Int16Array,
  '%Int32Array%': typeof Int32Array === 'undefined' ? undefined$1 : Int32Array,
  '%isFinite%': isFinite,
  '%isNaN%': isNaN,
  '%IteratorPrototype%': hasSymbols ? getProto$1(getProto$1([][Symbol.iterator]())) : undefined$1,
  '%JSON%': typeof JSON === 'object' ? JSON : undefined$1,
  '%Map%': typeof Map === 'undefined' ? undefined$1 : Map,
  '%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols ? undefined$1 : getProto$1(new Map()[Symbol.iterator]()),
  '%Math%': Math,
  '%Number%': Number,
  '%Object%': Object,
  '%parseFloat%': parseFloat,
  '%parseInt%': parseInt,
  '%Promise%': typeof Promise === 'undefined' ? undefined$1 : Promise,
  '%Proxy%': typeof Proxy === 'undefined' ? undefined$1 : Proxy,
  '%RangeError%': RangeError,
  '%ReferenceError%': ReferenceError,
  '%Reflect%': typeof Reflect === 'undefined' ? undefined$1 : Reflect,
  '%RegExp%': RegExp,
  '%Set%': typeof Set === 'undefined' ? undefined$1 : Set,
  '%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols ? undefined$1 : getProto$1(new Set()[Symbol.iterator]()),
  '%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined$1 : SharedArrayBuffer,
  '%String%': String,
  '%StringIteratorPrototype%': hasSymbols ? getProto$1(''[Symbol.iterator]()) : undefined$1,
  '%Symbol%': hasSymbols ? Symbol : undefined$1,
  '%SyntaxError%': $SyntaxError,
  '%ThrowTypeError%': ThrowTypeError,
  '%TypedArray%': TypedArray,
  '%TypeError%': $TypeError,
  '%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined$1 : Uint8Array,
  '%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined$1 : Uint8ClampedArray,
  '%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined$1 : Uint16Array,
  '%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined$1 : Uint32Array,
  '%URIError%': URIError,
  '%WeakMap%': typeof WeakMap === 'undefined' ? undefined$1 : WeakMap,
  '%WeakRef%': typeof WeakRef === 'undefined' ? undefined$1 : WeakRef,
  '%WeakSet%': typeof WeakSet === 'undefined' ? undefined$1 : WeakSet
};

var doEval = function doEval(name) {
  var value;

  if (name === '%AsyncFunction%') {
    value = getEvalledConstructor('async function () {}');
  } else if (name === '%GeneratorFunction%') {
    value = getEvalledConstructor('function* () {}');
  } else if (name === '%AsyncGeneratorFunction%') {
    value = getEvalledConstructor('async function* () {}');
  } else if (name === '%AsyncGenerator%') {
    var fn = doEval('%AsyncGeneratorFunction%');

    if (fn) {
      value = fn.prototype;
    }
  } else if (name === '%AsyncIteratorPrototype%') {
    var gen = doEval('%AsyncGenerator%');

    if (gen) {
      value = getProto$1(gen.prototype);
    }
  }

  INTRINSICS[name] = value;
  return value;
};

var LEGACY_ALIASES = {
  '%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
  '%ArrayPrototype%': ['Array', 'prototype'],
  '%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
  '%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
  '%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
  '%ArrayProto_values%': ['Array', 'prototype', 'values'],
  '%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
  '%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
  '%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
  '%BooleanPrototype%': ['Boolean', 'prototype'],
  '%DataViewPrototype%': ['DataView', 'prototype'],
  '%DatePrototype%': ['Date', 'prototype'],
  '%ErrorPrototype%': ['Error', 'prototype'],
  '%EvalErrorPrototype%': ['EvalError', 'prototype'],
  '%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
  '%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
  '%FunctionPrototype%': ['Function', 'prototype'],
  '%Generator%': ['GeneratorFunction', 'prototype'],
  '%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
  '%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
  '%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
  '%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
  '%JSONParse%': ['JSON', 'parse'],
  '%JSONStringify%': ['JSON', 'stringify'],
  '%MapPrototype%': ['Map', 'prototype'],
  '%NumberPrototype%': ['Number', 'prototype'],
  '%ObjectPrototype%': ['Object', 'prototype'],
  '%ObjProto_toString%': ['Object', 'prototype', 'toString'],
  '%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
  '%PromisePrototype%': ['Promise', 'prototype'],
  '%PromiseProto_then%': ['Promise', 'prototype', 'then'],
  '%Promise_all%': ['Promise', 'all'],
  '%Promise_reject%': ['Promise', 'reject'],
  '%Promise_resolve%': ['Promise', 'resolve'],
  '%RangeErrorPrototype%': ['RangeError', 'prototype'],
  '%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
  '%RegExpPrototype%': ['RegExp', 'prototype'],
  '%SetPrototype%': ['Set', 'prototype'],
  '%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
  '%StringPrototype%': ['String', 'prototype'],
  '%SymbolPrototype%': ['Symbol', 'prototype'],
  '%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
  '%TypedArrayPrototype%': ['TypedArray', 'prototype'],
  '%TypeErrorPrototype%': ['TypeError', 'prototype'],
  '%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
  '%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
  '%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
  '%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
  '%URIErrorPrototype%': ['URIError', 'prototype'],
  '%WeakMapPrototype%': ['WeakMap', 'prototype'],
  '%WeakSetPrototype%': ['WeakSet', 'prototype']
};
var $concat = functionBind.call(Function.call, Array.prototype.concat);
var $spliceApply = functionBind.call(Function.apply, Array.prototype.splice);
var $replace = functionBind.call(Function.call, String.prototype.replace);
var $strSlice = functionBind.call(Function.call, String.prototype.slice);
/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */

var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g;
/** Used to match backslashes in property paths. */

var stringToPath = function stringToPath(string) {
  var first = $strSlice(string, 0, 1);
  var last = $strSlice(string, -1);

  if (first === '%' && last !== '%') {
    throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
  } else if (last === '%' && first !== '%') {
    throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
  }

  var result = [];
  $replace(string, rePropName, function (match, number, quote, subString) {
    result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
  });
  return result;
};
/* end adaptation */


var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
  var intrinsicName = name;
  var alias;

  if (src(LEGACY_ALIASES, intrinsicName)) {
    alias = LEGACY_ALIASES[intrinsicName];
    intrinsicName = '%' + alias[0] + '%';
  }

  if (src(INTRINSICS, intrinsicName)) {
    var value = INTRINSICS[intrinsicName];

    if (value === needsEval) {
      value = doEval(intrinsicName);
    }

    if (typeof value === 'undefined' && !allowMissing) {
      throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
    }

    return {
      alias: alias,
      name: intrinsicName,
      value: value
    };
  }

  throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
};

var getIntrinsic = function GetIntrinsic(name, allowMissing) {
  if (typeof name !== 'string' || name.length === 0) {
    throw new $TypeError('intrinsic name must be a non-empty string');
  }

  if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
    throw new $TypeError('"allowMissing" argument must be a boolean');
  }

  var parts = stringToPath(name);
  var intrinsicBaseName = parts.length > 0 ? parts[0] : '';
  var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
  var intrinsicRealName = intrinsic.name;
  var value = intrinsic.value;
  var skipFurtherCaching = false;
  var alias = intrinsic.alias;

  if (alias) {
    intrinsicBaseName = alias[0];
    $spliceApply(parts, $concat([0, 1], alias));
  }

  for (var i = 1, isOwn = true; i < parts.length; i += 1) {
    var part = parts[i];
    var first = $strSlice(part, 0, 1);
    var last = $strSlice(part, -1);

    if ((first === '"' || first === "'" || first === '`' || last === '"' || last === "'" || last === '`') && first !== last) {
      throw new $SyntaxError('property names with quotes must have matching quotes');
    }

    if (part === 'constructor' || !isOwn) {
      skipFurtherCaching = true;
    }

    intrinsicBaseName += '.' + part;
    intrinsicRealName = '%' + intrinsicBaseName + '%';

    if (src(INTRINSICS, intrinsicRealName)) {
      value = INTRINSICS[intrinsicRealName];
    } else if (value != null) {
      if (!(part in value)) {
        if (!allowMissing) {
          throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
        }

        return void undefined$1;
      }

      if ($gOPD$1 && i + 1 >= parts.length) {
        var desc = $gOPD$1(value, part);
        isOwn = !!desc; // By convention, when a data property is converted to an accessor
        // property to emulate a data property that does not suffer from
        // the override mistake, that accessor's getter is marked with
        // an `originalValue` property. Here, when we detect this, we
        // uphold the illusion by pretending to see that original data
        // property, i.e., returning the value rather than the getter
        // itself.

        if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
          value = desc.get;
        } else {
          value = value[part];
        }
      } else {
        isOwn = src(value, part);
        value = value[part];
      }

      if (isOwn && !skipFurtherCaching) {
        INTRINSICS[intrinsicRealName] = value;
      }
    }
  }

  return value;
};

var callBind = createCommonjsModule(function (module) {

  var $apply = getIntrinsic('%Function.prototype.apply%');
  var $call = getIntrinsic('%Function.prototype.call%');
  var $reflectApply = getIntrinsic('%Reflect.apply%', true) || functionBind.call($call, $apply);
  var $gOPD = getIntrinsic('%Object.getOwnPropertyDescriptor%', true);
  var $defineProperty = getIntrinsic('%Object.defineProperty%', true);
  var $max = getIntrinsic('%Math.max%');

  if ($defineProperty) {
    try {
      $defineProperty({}, 'a', {
        value: 1
      });
    } catch (e) {
      // IE 8 has a broken defineProperty
      $defineProperty = null;
    }
  }

  module.exports = function callBind(originalFunction) {
    var func = $reflectApply(functionBind, $call, arguments);

    if ($gOPD && $defineProperty) {
      var desc = $gOPD(func, 'length');

      if (desc.configurable) {
        // original length, plus the receiver, minus any additional arguments (after the receiver)
        $defineProperty(func, 'length', {
          value: 1 + $max(0, originalFunction.length - (arguments.length - 1))
        });
      }
    }

    return func;
  };

  var applyBind = function applyBind() {
    return $reflectApply(functionBind, $apply, arguments);
  };

  if ($defineProperty) {
    $defineProperty(module.exports, 'apply', {
      value: applyBind
    });
  } else {
    module.exports.apply = applyBind;
  }
});

var $indexOf$1 = callBind(getIntrinsic('String.prototype.indexOf'));

var callBound = function callBoundIntrinsic(name, allowMissing) {
  var intrinsic = getIntrinsic(name, !!allowMissing);

  if (typeof intrinsic === 'function' && $indexOf$1(name, '.prototype.') > -1) {
    return callBind(intrinsic);
  }

  return intrinsic;
};

var hasToStringTag$3 = shams();
var $toString$2 = callBound('Object.prototype.toString');

var isStandardArguments = function isArguments(value) {
  if (hasToStringTag$3 && value && typeof value === 'object' && Symbol.toStringTag in value) {
    return false;
  }

  return $toString$2(value) === '[object Arguments]';
};

var isLegacyArguments = function isArguments(value) {
  if (isStandardArguments(value)) {
    return true;
  }

  return value !== null && typeof value === 'object' && typeof value.length === 'number' && value.length >= 0 && $toString$2(value) !== '[object Array]' && $toString$2(value.callee) === '[object Function]';
};

var supportsStandardArguments = function () {
  return isStandardArguments(arguments);
}();

isStandardArguments.isLegacyArguments = isLegacyArguments; // for tests

var isArguments = supportsStandardArguments ? isStandardArguments : isLegacyArguments;

var toStr = Object.prototype.toString;
var fnToStr = Function.prototype.toString;
var isFnRegex = /^\s*(?:function)?\*/;
var hasToStringTag$2 = shams();
var getProto = Object.getPrototypeOf;

var getGeneratorFunc = function () {
  // eslint-disable-line consistent-return
  if (!hasToStringTag$2) {
    return false;
  }

  try {
    return Function('return function*() {}')();
  } catch (e) {}
};

var GeneratorFunction;

var isGeneratorFunction = function isGeneratorFunction(fn) {
  if (typeof fn !== 'function') {
    return false;
  }

  if (isFnRegex.test(fnToStr.call(fn))) {
    return true;
  }

  if (!hasToStringTag$2) {
    var str = toStr.call(fn);
    return str === '[object GeneratorFunction]';
  }

  if (!getProto) {
    return false;
  }

  if (typeof GeneratorFunction === 'undefined') {
    var generatorFunc = getGeneratorFunc();
    GeneratorFunction = generatorFunc ? getProto(generatorFunc) : false;
  }

  return getProto(fn) === GeneratorFunction;
};

var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

var foreach = function forEach(obj, fn, ctx) {
  if (toString.call(fn) !== '[object Function]') {
    throw new TypeError('iterator must be a function');
  }

  var l = obj.length;

  if (l === +l) {
    for (var i = 0; i < l; i++) {
      fn.call(ctx, obj[i], i, obj);
    }
  } else {
    for (var k in obj) {
      if (hasOwn.call(obj, k)) {
        fn.call(ctx, obj[k], k, obj);
      }
    }
  }
};

var possibleNames = ['BigInt64Array', 'BigUint64Array', 'Float32Array', 'Float64Array', 'Int16Array', 'Int32Array', 'Int8Array', 'Uint16Array', 'Uint32Array', 'Uint8Array', 'Uint8ClampedArray'];
var g$3 = typeof globalThis === 'undefined' ? commonjsGlobal : globalThis;

var availableTypedArrays = function availableTypedArrays() {
  var out = [];

  for (var i = 0; i < possibleNames.length; i++) {
    if (typeof g$3[possibleNames[i]] === 'function') {
      out[out.length] = possibleNames[i];
    }
  }

  return out;
};

var $gOPD = getIntrinsic('%Object.getOwnPropertyDescriptor%', true);

if ($gOPD) {
  try {
    $gOPD([], 'length');
  } catch (e) {
    // IE 8 has a broken gOPD
    $gOPD = null;
  }
}

var getOwnPropertyDescriptor = $gOPD;

var $toString$1 = callBound('Object.prototype.toString');
var hasToStringTag$1 = shams();
var g$2 = typeof globalThis === 'undefined' ? commonjsGlobal : globalThis;
var typedArrays$1 = availableTypedArrays();

var $indexOf = callBound('Array.prototype.indexOf', true) || function indexOf(array, value) {
  for (var i = 0; i < array.length; i += 1) {
    if (array[i] === value) {
      return i;
    }
  }

  return -1;
};

var $slice$1 = callBound('String.prototype.slice');
var toStrTags$1 = {};
var getPrototypeOf$1 = Object.getPrototypeOf; // require('getprototypeof');

if (hasToStringTag$1 && getOwnPropertyDescriptor && getPrototypeOf$1) {
  foreach(typedArrays$1, function (typedArray) {
    var arr = new g$2[typedArray]();

    if (Symbol.toStringTag in arr) {
      var proto = getPrototypeOf$1(arr);
      var descriptor = getOwnPropertyDescriptor(proto, Symbol.toStringTag);

      if (!descriptor) {
        var superProto = getPrototypeOf$1(proto);
        descriptor = getOwnPropertyDescriptor(superProto, Symbol.toStringTag);
      }

      toStrTags$1[typedArray] = descriptor.get;
    }
  });
}

var tryTypedArrays$1 = function tryAllTypedArrays(value) {
  var anyTrue = false;
  foreach(toStrTags$1, function (getter, typedArray) {
    if (!anyTrue) {
      try {
        anyTrue = getter.call(value) === typedArray;
      } catch (e) {
        /**/
      }
    }
  });
  return anyTrue;
};

var isTypedArray = function isTypedArray(value) {
  if (!value || typeof value !== 'object') {
    return false;
  }

  if (!hasToStringTag$1 || !(Symbol.toStringTag in value)) {
    var tag = $slice$1($toString$1(value), 8, -1);
    return $indexOf(typedArrays$1, tag) > -1;
  }

  if (!getOwnPropertyDescriptor) {
    return false;
  }

  return tryTypedArrays$1(value);
};

var $toString = callBound('Object.prototype.toString');
var hasToStringTag = shams();
var g$1 = typeof globalThis === 'undefined' ? commonjsGlobal : globalThis;
var typedArrays = availableTypedArrays();
var $slice = callBound('String.prototype.slice');
var toStrTags = {};
var getPrototypeOf = Object.getPrototypeOf; // require('getprototypeof');

if (hasToStringTag && getOwnPropertyDescriptor && getPrototypeOf) {
  foreach(typedArrays, function (typedArray) {
    if (typeof g$1[typedArray] === 'function') {
      var arr = new g$1[typedArray]();

      if (Symbol.toStringTag in arr) {
        var proto = getPrototypeOf(arr);
        var descriptor = getOwnPropertyDescriptor(proto, Symbol.toStringTag);

        if (!descriptor) {
          var superProto = getPrototypeOf(proto);
          descriptor = getOwnPropertyDescriptor(superProto, Symbol.toStringTag);
        }

        toStrTags[typedArray] = descriptor.get;
      }
    }
  });
}

var tryTypedArrays = function tryAllTypedArrays(value) {
  var foundName = false;
  foreach(toStrTags, function (getter, typedArray) {
    if (!foundName) {
      try {
        var name = getter.call(value);

        if (name === typedArray) {
          foundName = name;
        }
      } catch (e) {}
    }
  });
  return foundName;
};

var whichTypedArray = function whichTypedArray(value) {
  if (!isTypedArray(value)) {
    return false;
  }

  if (!hasToStringTag || !(Symbol.toStringTag in value)) {
    return $slice($toString(value), 8, -1);
  }

  return tryTypedArrays(value);
};

var types = createCommonjsModule(function (module, exports) {

  function uncurryThis(f) {
    return f.call.bind(f);
  }

  var BigIntSupported = typeof BigInt !== 'undefined';
  var SymbolSupported = typeof Symbol !== 'undefined';
  var ObjectToString = uncurryThis(Object.prototype.toString);
  var numberValue = uncurryThis(Number.prototype.valueOf);
  var stringValue = uncurryThis(String.prototype.valueOf);
  var booleanValue = uncurryThis(Boolean.prototype.valueOf);

  if (BigIntSupported) {
    var bigIntValue = uncurryThis(BigInt.prototype.valueOf);
  }

  if (SymbolSupported) {
    var symbolValue = uncurryThis(Symbol.prototype.valueOf);
  }

  function checkBoxedPrimitive(value, prototypeValueOf) {
    if (typeof value !== 'object') {
      return false;
    }

    try {
      prototypeValueOf(value);
      return true;
    } catch (e) {
      return false;
    }
  }

  exports.isArgumentsObject = isArguments;
  exports.isGeneratorFunction = isGeneratorFunction;
  exports.isTypedArray = isTypedArray; // Taken from here and modified for better browser support
  // https://github.com/sindresorhus/p-is-promise/blob/cda35a513bda03f977ad5cde3a079d237e82d7ef/index.js

  function isPromise(input) {
    return typeof Promise !== 'undefined' && input instanceof Promise || input !== null && typeof input === 'object' && typeof input.then === 'function' && typeof input.catch === 'function';
  }

  exports.isPromise = isPromise;

  function isArrayBufferView(value) {
    if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
      return ArrayBuffer.isView(value);
    }

    return isTypedArray(value) || isDataView(value);
  }

  exports.isArrayBufferView = isArrayBufferView;

  function isUint8Array(value) {
    return whichTypedArray(value) === 'Uint8Array';
  }

  exports.isUint8Array = isUint8Array;

  function isUint8ClampedArray(value) {
    return whichTypedArray(value) === 'Uint8ClampedArray';
  }

  exports.isUint8ClampedArray = isUint8ClampedArray;

  function isUint16Array(value) {
    return whichTypedArray(value) === 'Uint16Array';
  }

  exports.isUint16Array = isUint16Array;

  function isUint32Array(value) {
    return whichTypedArray(value) === 'Uint32Array';
  }

  exports.isUint32Array = isUint32Array;

  function isInt8Array(value) {
    return whichTypedArray(value) === 'Int8Array';
  }

  exports.isInt8Array = isInt8Array;

  function isInt16Array(value) {
    return whichTypedArray(value) === 'Int16Array';
  }

  exports.isInt16Array = isInt16Array;

  function isInt32Array(value) {
    return whichTypedArray(value) === 'Int32Array';
  }

  exports.isInt32Array = isInt32Array;

  function isFloat32Array(value) {
    return whichTypedArray(value) === 'Float32Array';
  }

  exports.isFloat32Array = isFloat32Array;

  function isFloat64Array(value) {
    return whichTypedArray(value) === 'Float64Array';
  }

  exports.isFloat64Array = isFloat64Array;

  function isBigInt64Array(value) {
    return whichTypedArray(value) === 'BigInt64Array';
  }

  exports.isBigInt64Array = isBigInt64Array;

  function isBigUint64Array(value) {
    return whichTypedArray(value) === 'BigUint64Array';
  }

  exports.isBigUint64Array = isBigUint64Array;

  function isMapToString(value) {
    return ObjectToString(value) === '[object Map]';
  }

  isMapToString.working = typeof Map !== 'undefined' && isMapToString(new Map());

  function isMap(value) {
    if (typeof Map === 'undefined') {
      return false;
    }

    return isMapToString.working ? isMapToString(value) : value instanceof Map;
  }

  exports.isMap = isMap;

  function isSetToString(value) {
    return ObjectToString(value) === '[object Set]';
  }

  isSetToString.working = typeof Set !== 'undefined' && isSetToString(new Set());

  function isSet(value) {
    if (typeof Set === 'undefined') {
      return false;
    }

    return isSetToString.working ? isSetToString(value) : value instanceof Set;
  }

  exports.isSet = isSet;

  function isWeakMapToString(value) {
    return ObjectToString(value) === '[object WeakMap]';
  }

  isWeakMapToString.working = typeof WeakMap !== 'undefined' && isWeakMapToString(new WeakMap());

  function isWeakMap(value) {
    if (typeof WeakMap === 'undefined') {
      return false;
    }

    return isWeakMapToString.working ? isWeakMapToString(value) : value instanceof WeakMap;
  }

  exports.isWeakMap = isWeakMap;

  function isWeakSetToString(value) {
    return ObjectToString(value) === '[object WeakSet]';
  }

  isWeakSetToString.working = typeof WeakSet !== 'undefined' && isWeakSetToString(new WeakSet());

  function isWeakSet(value) {
    return isWeakSetToString(value);
  }

  exports.isWeakSet = isWeakSet;

  function isArrayBufferToString(value) {
    return ObjectToString(value) === '[object ArrayBuffer]';
  }

  isArrayBufferToString.working = typeof ArrayBuffer !== 'undefined' && isArrayBufferToString(new ArrayBuffer());

  function isArrayBuffer(value) {
    if (typeof ArrayBuffer === 'undefined') {
      return false;
    }

    return isArrayBufferToString.working ? isArrayBufferToString(value) : value instanceof ArrayBuffer;
  }

  exports.isArrayBuffer = isArrayBuffer;

  function isDataViewToString(value) {
    return ObjectToString(value) === '[object DataView]';
  }

  isDataViewToString.working = typeof ArrayBuffer !== 'undefined' && typeof DataView !== 'undefined' && isDataViewToString(new DataView(new ArrayBuffer(1), 0, 1));

  function isDataView(value) {
    if (typeof DataView === 'undefined') {
      return false;
    }

    return isDataViewToString.working ? isDataViewToString(value) : value instanceof DataView;
  }

  exports.isDataView = isDataView; // Store a copy of SharedArrayBuffer in case it's deleted elsewhere

  var SharedArrayBufferCopy = typeof SharedArrayBuffer !== 'undefined' ? SharedArrayBuffer : undefined;

  function isSharedArrayBufferToString(value) {
    return ObjectToString(value) === '[object SharedArrayBuffer]';
  }

  function isSharedArrayBuffer(value) {
    if (typeof SharedArrayBufferCopy === 'undefined') {
      return false;
    }

    if (typeof isSharedArrayBufferToString.working === 'undefined') {
      isSharedArrayBufferToString.working = isSharedArrayBufferToString(new SharedArrayBufferCopy());
    }

    return isSharedArrayBufferToString.working ? isSharedArrayBufferToString(value) : value instanceof SharedArrayBufferCopy;
  }

  exports.isSharedArrayBuffer = isSharedArrayBuffer;

  function isAsyncFunction(value) {
    return ObjectToString(value) === '[object AsyncFunction]';
  }

  exports.isAsyncFunction = isAsyncFunction;

  function isMapIterator(value) {
    return ObjectToString(value) === '[object Map Iterator]';
  }

  exports.isMapIterator = isMapIterator;

  function isSetIterator(value) {
    return ObjectToString(value) === '[object Set Iterator]';
  }

  exports.isSetIterator = isSetIterator;

  function isGeneratorObject(value) {
    return ObjectToString(value) === '[object Generator]';
  }

  exports.isGeneratorObject = isGeneratorObject;

  function isWebAssemblyCompiledModule(value) {
    return ObjectToString(value) === '[object WebAssembly.Module]';
  }

  exports.isWebAssemblyCompiledModule = isWebAssemblyCompiledModule;

  function isNumberObject(value) {
    return checkBoxedPrimitive(value, numberValue);
  }

  exports.isNumberObject = isNumberObject;

  function isStringObject(value) {
    return checkBoxedPrimitive(value, stringValue);
  }

  exports.isStringObject = isStringObject;

  function isBooleanObject(value) {
    return checkBoxedPrimitive(value, booleanValue);
  }

  exports.isBooleanObject = isBooleanObject;

  function isBigIntObject(value) {
    return BigIntSupported && checkBoxedPrimitive(value, bigIntValue);
  }

  exports.isBigIntObject = isBigIntObject;

  function isSymbolObject(value) {
    return SymbolSupported && checkBoxedPrimitive(value, symbolValue);
  }

  exports.isSymbolObject = isSymbolObject;

  function isBoxedPrimitive(value) {
    return isNumberObject(value) || isStringObject(value) || isBooleanObject(value) || isBigIntObject(value) || isSymbolObject(value);
  }

  exports.isBoxedPrimitive = isBoxedPrimitive;

  function isAnyArrayBuffer(value) {
    return typeof Uint8Array !== 'undefined' && (isArrayBuffer(value) || isSharedArrayBuffer(value));
  }

  exports.isAnyArrayBuffer = isAnyArrayBuffer;
  ['isProxy', 'isExternal', 'isModuleNamespaceObject'].forEach(function (method) {
    Object.defineProperty(exports, method, {
      enumerable: false,
      value: function () {
        throw new Error(method + ' is not supported in userland');
      }
    });
  });
});

var isBuffer = function isBuffer(arg) {
  return arg instanceof Buffer;
};

var inherits_browser = createCommonjsModule(function (module) {
  if (typeof Object.create === 'function') {
    // implementation from standard node.js 'util' module
    module.exports = function inherits(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
          constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
      }
    };
  } else {
    // old school shim for old browsers
    module.exports = function inherits(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor;

        var TempCtor = function () {};

        TempCtor.prototype = superCtor.prototype;
        ctor.prototype = new TempCtor();
        ctor.prototype.constructor = ctor;
      }
    };
  }
});

var inherits = createCommonjsModule(function (module) {
  try {
    var util$1 = util;
    /* istanbul ignore next */

    if (typeof util$1.inherits !== 'function') throw '';
    module.exports = util$1.inherits;
  } catch (e) {
    /* istanbul ignore next */
    module.exports = inherits_browser;
  }
});

var util = createCommonjsModule(function (module, exports) {
  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.
  var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors || function getOwnPropertyDescriptors(obj) {
    var keys = Object.keys(obj);
    var descriptors = {};

    for (var i = 0; i < keys.length; i++) {
      descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
    }

    return descriptors;
  };

  var formatRegExp = /%[sdj%]/g;

  exports.format = function (f) {
    if (!isString(f)) {
      var objects = [];

      for (var i = 0; i < arguments.length; i++) {
        objects.push(inspect(arguments[i]));
      }

      return objects.join(' ');
    }

    var i = 1;
    var args = arguments;
    var len = args.length;
    var str = String(f).replace(formatRegExp, function (x) {
      if (x === '%%') return '%';
      if (i >= len) return x;

      switch (x) {
        case '%s':
          return String(args[i++]);

        case '%d':
          return Number(args[i++]);

        case '%j':
          try {
            return JSON.stringify(args[i++]);
          } catch (_) {
            return '[Circular]';
          }

        default:
          return x;
      }
    });

    for (var x = args[i]; i < len; x = args[++i]) {
      if (isNull(x) || !isObject(x)) {
        str += ' ' + x;
      } else {
        str += ' ' + inspect(x);
      }
    }

    return str;
  }; // Mark that a method should not be used.
  // Returns a modified function which warns once by default.
  // If --no-deprecation is set, then it is a no-op.


  exports.deprecate = function (fn, msg) {
    if (typeof process !== 'undefined' && process.noDeprecation === true) {
      return fn;
    } // Allow for deprecating things in the process of starting up.


    if (typeof process === 'undefined') {
      return function () {
        return exports.deprecate(fn, msg).apply(this, arguments);
      };
    }

    var warned = false;

    function deprecated() {
      if (!warned) {
        if (process.throwDeprecation) {
          throw new Error(msg);
        } else if (process.traceDeprecation) {
          console.trace(msg);
        } else {
          console.error(msg);
        }

        warned = true;
      }

      return fn.apply(this, arguments);
    }

    return deprecated;
  };

  var debugs = {};
  var debugEnvRegex = /^$/;

  if (process.env.NODE_DEBUG) {
    var debugEnv = process.env.NODE_DEBUG;
    debugEnv = debugEnv.replace(/[|\\{}()[\]^$+?.]/g, '\\$&').replace(/\*/g, '.*').replace(/,/g, '$|^').toUpperCase();
    debugEnvRegex = new RegExp('^' + debugEnv + '$', 'i');
  }

  exports.debuglog = function (set) {
    set = set.toUpperCase();

    if (!debugs[set]) {
      if (debugEnvRegex.test(set)) {
        var pid = process.pid;

        debugs[set] = function () {
          var msg = exports.format.apply(exports, arguments);
          console.error('%s %d: %s', set, pid, msg);
        };
      } else {
        debugs[set] = function () {};
      }
    }

    return debugs[set];
  };
  /**
   * Echos the value of a value. Trys to print the value out
   * in the best way possible given the different types.
   *
   * @param {Object} obj The object to print out.
   * @param {Object} opts Optional options object that alters the output.
   */

  /* legacy: obj, showHidden, depth, colors*/


  function inspect(obj, opts) {
    // default options
    var ctx = {
      seen: [],
      stylize: stylizeNoColor
    }; // legacy...

    if (arguments.length >= 3) ctx.depth = arguments[2];
    if (arguments.length >= 4) ctx.colors = arguments[3];

    if (isBoolean(opts)) {
      // legacy...
      ctx.showHidden = opts;
    } else if (opts) {
      // got an "options" object
      exports._extend(ctx, opts);
    } // set default options


    if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
    if (isUndefined(ctx.depth)) ctx.depth = 2;
    if (isUndefined(ctx.colors)) ctx.colors = false;
    if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
    if (ctx.colors) ctx.stylize = stylizeWithColor;
    return formatValue(ctx, obj, ctx.depth);
  }

  exports.inspect = inspect; // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics

  inspect.colors = {
    'bold': [1, 22],
    'italic': [3, 23],
    'underline': [4, 24],
    'inverse': [7, 27],
    'white': [37, 39],
    'grey': [90, 39],
    'black': [30, 39],
    'blue': [34, 39],
    'cyan': [36, 39],
    'green': [32, 39],
    'magenta': [35, 39],
    'red': [31, 39],
    'yellow': [33, 39]
  }; // Don't use 'blue' not visible on cmd.exe

  inspect.styles = {
    'special': 'cyan',
    'number': 'yellow',
    'boolean': 'yellow',
    'undefined': 'grey',
    'null': 'bold',
    'string': 'green',
    'date': 'magenta',
    // "name": intentionally not styling
    'regexp': 'red'
  };

  function stylizeWithColor(str, styleType) {
    var style = inspect.styles[styleType];

    if (style) {
      return '\u001b[' + inspect.colors[style][0] + 'm' + str + '\u001b[' + inspect.colors[style][1] + 'm';
    } else {
      return str;
    }
  }

  function stylizeNoColor(str, styleType) {
    return str;
  }

  function arrayToHash(array) {
    var hash = {};
    array.forEach(function (val, idx) {
      hash[val] = true;
    });
    return hash;
  }

  function formatValue(ctx, value, recurseTimes) {
    // Provide a hook for user-specified inspect functions.
    // Check that value is an object with an inspect function on it
    if (ctx.customInspect && value && isFunction(value.inspect) && // Filter out the util module, it's inspect function is special
    value.inspect !== exports.inspect && // Also filter out any prototype objects using the circular check.
    !(value.constructor && value.constructor.prototype === value)) {
      var ret = value.inspect(recurseTimes, ctx);

      if (!isString(ret)) {
        ret = formatValue(ctx, ret, recurseTimes);
      }

      return ret;
    } // Primitive types cannot have properties


    var primitive = formatPrimitive(ctx, value);

    if (primitive) {
      return primitive;
    } // Look up the keys of the object.


    var keys = Object.keys(value);
    var visibleKeys = arrayToHash(keys);

    if (ctx.showHidden) {
      keys = Object.getOwnPropertyNames(value);
    } // IE doesn't make error fields non-enumerable
    // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx


    if (isError(value) && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
      return formatError(value);
    } // Some type of object without properties can be shortcutted.


    if (keys.length === 0) {
      if (isFunction(value)) {
        var name = value.name ? ': ' + value.name : '';
        return ctx.stylize('[Function' + name + ']', 'special');
      }

      if (isRegExp(value)) {
        return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
      }

      if (isDate(value)) {
        return ctx.stylize(Date.prototype.toString.call(value), 'date');
      }

      if (isError(value)) {
        return formatError(value);
      }
    }

    var base = '',
        array = false,
        braces = ['{', '}']; // Make Array say that they are Array

    if (isArray(value)) {
      array = true;
      braces = ['[', ']'];
    } // Make functions say that they are functions


    if (isFunction(value)) {
      var n = value.name ? ': ' + value.name : '';
      base = ' [Function' + n + ']';
    } // Make RegExps say that they are RegExps


    if (isRegExp(value)) {
      base = ' ' + RegExp.prototype.toString.call(value);
    } // Make dates with properties first say the date


    if (isDate(value)) {
      base = ' ' + Date.prototype.toUTCString.call(value);
    } // Make error with message first say the error


    if (isError(value)) {
      base = ' ' + formatError(value);
    }

    if (keys.length === 0 && (!array || value.length == 0)) {
      return braces[0] + base + braces[1];
    }

    if (recurseTimes < 0) {
      if (isRegExp(value)) {
        return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
      } else {
        return ctx.stylize('[Object]', 'special');
      }
    }

    ctx.seen.push(value);
    var output;

    if (array) {
      output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
    } else {
      output = keys.map(function (key) {
        return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
      });
    }

    ctx.seen.pop();
    return reduceToSingleString(output, base, braces);
  }

  function formatPrimitive(ctx, value) {
    if (isUndefined(value)) return ctx.stylize('undefined', 'undefined');

    if (isString(value)) {
      var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '').replace(/'/g, "\\'").replace(/\\"/g, '"') + '\'';
      return ctx.stylize(simple, 'string');
    }

    if (isNumber(value)) return ctx.stylize('' + value, 'number');
    if (isBoolean(value)) return ctx.stylize('' + value, 'boolean'); // For some reason typeof null is "object", so special case here.

    if (isNull(value)) return ctx.stylize('null', 'null');
  }

  function formatError(value) {
    return '[' + Error.prototype.toString.call(value) + ']';
  }

  function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
    var output = [];

    for (var i = 0, l = value.length; i < l; ++i) {
      if (hasOwnProperty(value, String(i))) {
        output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
      } else {
        output.push('');
      }
    }

    keys.forEach(function (key) {
      if (!key.match(/^\d+$/)) {
        output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
      }
    });
    return output;
  }

  function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
    var name, str, desc;
    desc = Object.getOwnPropertyDescriptor(value, key) || {
      value: value[key]
    };

    if (desc.get) {
      if (desc.set) {
        str = ctx.stylize('[Getter/Setter]', 'special');
      } else {
        str = ctx.stylize('[Getter]', 'special');
      }
    } else {
      if (desc.set) {
        str = ctx.stylize('[Setter]', 'special');
      }
    }

    if (!hasOwnProperty(visibleKeys, key)) {
      name = '[' + key + ']';
    }

    if (!str) {
      if (ctx.seen.indexOf(desc.value) < 0) {
        if (isNull(recurseTimes)) {
          str = formatValue(ctx, desc.value, null);
        } else {
          str = formatValue(ctx, desc.value, recurseTimes - 1);
        }

        if (str.indexOf('\n') > -1) {
          if (array) {
            str = str.split('\n').map(function (line) {
              return '  ' + line;
            }).join('\n').substr(2);
          } else {
            str = '\n' + str.split('\n').map(function (line) {
              return '   ' + line;
            }).join('\n');
          }
        }
      } else {
        str = ctx.stylize('[Circular]', 'special');
      }
    }

    if (isUndefined(name)) {
      if (array && key.match(/^\d+$/)) {
        return str;
      }

      name = JSON.stringify('' + key);

      if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
        name = name.substr(1, name.length - 2);
        name = ctx.stylize(name, 'name');
      } else {
        name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
        name = ctx.stylize(name, 'string');
      }
    }

    return name + ': ' + str;
  }

  function reduceToSingleString(output, base, braces) {
    var length = output.reduce(function (prev, cur) {
      if (cur.indexOf('\n') >= 0) ;
      return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
    }, 0);

    if (length > 60) {
      return braces[0] + (base === '' ? '' : base + '\n ') + ' ' + output.join(',\n  ') + ' ' + braces[1];
    }

    return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
  } // NOTE: These type checking functions intentionally don't use `instanceof`
  // because it is fragile and can be easily faked with `Object.create()`.


  exports.types = types;

  function isArray(ar) {
    return Array.isArray(ar);
  }

  exports.isArray = isArray;

  function isBoolean(arg) {
    return typeof arg === 'boolean';
  }

  exports.isBoolean = isBoolean;

  function isNull(arg) {
    return arg === null;
  }

  exports.isNull = isNull;

  function isNullOrUndefined(arg) {
    return arg == null;
  }

  exports.isNullOrUndefined = isNullOrUndefined;

  function isNumber(arg) {
    return typeof arg === 'number';
  }

  exports.isNumber = isNumber;

  function isString(arg) {
    return typeof arg === 'string';
  }

  exports.isString = isString;

  function isSymbol(arg) {
    return typeof arg === 'symbol';
  }

  exports.isSymbol = isSymbol;

  function isUndefined(arg) {
    return arg === void 0;
  }

  exports.isUndefined = isUndefined;

  function isRegExp(re) {
    return isObject(re) && objectToString(re) === '[object RegExp]';
  }

  exports.isRegExp = isRegExp;
  exports.types.isRegExp = isRegExp;

  function isObject(arg) {
    return typeof arg === 'object' && arg !== null;
  }

  exports.isObject = isObject;

  function isDate(d) {
    return isObject(d) && objectToString(d) === '[object Date]';
  }

  exports.isDate = isDate;
  exports.types.isDate = isDate;

  function isError(e) {
    return isObject(e) && (objectToString(e) === '[object Error]' || e instanceof Error);
  }

  exports.isError = isError;
  exports.types.isNativeError = isError;

  function isFunction(arg) {
    return typeof arg === 'function';
  }

  exports.isFunction = isFunction;

  function isPrimitive(arg) {
    return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || typeof arg === 'symbol' || // ES6 symbol
    typeof arg === 'undefined';
  }

  exports.isPrimitive = isPrimitive;
  exports.isBuffer = isBuffer;

  function objectToString(o) {
    return Object.prototype.toString.call(o);
  }

  function pad(n) {
    return n < 10 ? '0' + n.toString(10) : n.toString(10);
  }

  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; // 26 Feb 16:19:34

  function timestamp() {
    var d = new Date();
    var time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
    return [d.getDate(), months[d.getMonth()], time].join(' ');
  } // log is just a thin wrapper to console.log that prepends a timestamp


  exports.log = function () {
    console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
  };
  /**
   * Inherit the prototype methods from one constructor into another.
   *
   * The Function.prototype.inherits from lang.js rewritten as a standalone
   * function (not on Function.prototype). NOTE: If this file is to be loaded
   * during bootstrapping this function needs to be rewritten using some native
   * functions as prototype setup using normal JavaScript does not work as
   * expected during bootstrapping (see mirror.js in r114903).
   *
   * @param {function} ctor Constructor function which needs to inherit the
   *     prototype.
   * @param {function} superCtor Constructor function to inherit prototype from.
   */


  exports.inherits = inherits;

  exports._extend = function (origin, add) {
    // Don't do anything if add isn't an object
    if (!add || !isObject(add)) return origin;
    var keys = Object.keys(add);
    var i = keys.length;

    while (i--) {
      origin[keys[i]] = add[keys[i]];
    }

    return origin;
  };

  function hasOwnProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }

  var kCustomPromisifiedSymbol = typeof Symbol !== 'undefined' ? Symbol('util.promisify.custom') : undefined;

  exports.promisify = function promisify(original) {
    if (typeof original !== 'function') throw new TypeError('The "original" argument must be of type Function');

    if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
      var fn = original[kCustomPromisifiedSymbol];

      if (typeof fn !== 'function') {
        throw new TypeError('The "util.promisify.custom" argument must be of type Function');
      }

      Object.defineProperty(fn, kCustomPromisifiedSymbol, {
        value: fn,
        enumerable: false,
        writable: false,
        configurable: true
      });
      return fn;
    }

    function fn() {
      var promiseResolve, promiseReject;
      var promise = new Promise(function (resolve, reject) {
        promiseResolve = resolve;
        promiseReject = reject;
      });
      var args = [];

      for (var i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
      }

      args.push(function (err, value) {
        if (err) {
          promiseReject(err);
        } else {
          promiseResolve(value);
        }
      });

      try {
        original.apply(this, args);
      } catch (err) {
        promiseReject(err);
      }

      return promise;
    }

    Object.setPrototypeOf(fn, Object.getPrototypeOf(original));
    if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn,
      enumerable: false,
      writable: false,
      configurable: true
    });
    return Object.defineProperties(fn, getOwnPropertyDescriptors(original));
  };

  exports.promisify.custom = kCustomPromisifiedSymbol;

  function callbackifyOnRejected(reason, cb) {
    // `!reason` guard inspired by bluebird (Ref: https://goo.gl/t5IS6M).
    // Because `null` is a special error value in callbacks which means "no error
    // occurred", we error-wrap so the callback consumer can distinguish between
    // "the promise rejected with null" or "the promise fulfilled with undefined".
    if (!reason) {
      var newReason = new Error('Promise was rejected with a falsy value');
      newReason.reason = reason;
      reason = newReason;
    }

    return cb(reason);
  }

  function callbackify(original) {
    if (typeof original !== 'function') {
      throw new TypeError('The "original" argument must be of type Function');
    } // We DO NOT return the promise as it gives the user a false sense that
    // the promise is actually somehow related to the callback's execution
    // and that the callback throwing will reject the promise.


    function callbackified() {
      var args = [];

      for (var i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
      }

      var maybeCb = args.pop();

      if (typeof maybeCb !== 'function') {
        throw new TypeError('The last argument must be of type Function');
      }

      var self = this;

      var cb = function () {
        return maybeCb.apply(self, arguments);
      }; // In true node style we process the callback on `nextTick` with all the
      // implications (stack, `uncaughtException`, `async_hooks`)


      original.apply(this, args).then(function (ret) {
        process.nextTick(cb.bind(null, null, ret));
      }, function (rej) {
        process.nextTick(callbackifyOnRejected.bind(null, rej, cb));
      });
    }

    Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
    Object.defineProperties(callbackified, getOwnPropertyDescriptors(original));
    return callbackified;
  }

  exports.callbackify = callbackify;
});

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
const TREE_OPERATION_ADD = 1;
const TREE_OPERATION_REMOVE = 2;
const TREE_OPERATION_REORDER_CHILDREN = 3;
const TREE_OPERATION_UPDATE_TREE_BASE_DURATION = 4;
const TREE_OPERATION_UPDATE_ERRORS_OR_WARNINGS = 5;
const TREE_OPERATION_REMOVE_ROOT = 6;
const LOCAL_STORAGE_FILTER_PREFERENCES_KEY = 'React::DevTools::componentFilters';

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
// WARNING
// The values below are referenced by ComponentFilters (which are saved via localStorage).
// Do not change them or it will break previously saved user customizations.
// If new element types are added, use new numbers rather than re-ordering existing ones.
//
// Changing these types is also a backwards breaking change for the standalone shell,
// since the frontend and backend must share the same values-
// and the backend is embedded in certain environments (like React Native).
const ElementTypeClass = 1;
const ElementTypeFunction = 5;
const ElementTypeForwardRef = 6;
const ElementTypeHostComponent = 7;
const ElementTypeMemo = 8;
const ElementTypeRoot = 11;
// These types may be used to visually distinguish types,
// or to enable/disable certain functionality.

// WARNING
// The values below are referenced by ComponentFilters (which are saved via localStorage).
// Do not change them or it will break previously saved user customizations.
// If new filter types are added, use new numbers rather than re-ordering existing ones.
const ComponentFilterElementType = 1;

var iterator = function (Yallist) {
  Yallist.prototype[Symbol.iterator] = function* () {
    for (let walker = this.head; walker; walker = walker.next) {
      yield walker.value;
    }
  };
};

var yallist = Yallist;
Yallist.Node = Node;
Yallist.create = Yallist;

function Yallist(list) {
  var self = this;

  if (!(self instanceof Yallist)) {
    self = new Yallist();
  }

  self.tail = null;
  self.head = null;
  self.length = 0;

  if (list && typeof list.forEach === 'function') {
    list.forEach(function (item) {
      self.push(item);
    });
  } else if (arguments.length > 0) {
    for (var i = 0, l = arguments.length; i < l; i++) {
      self.push(arguments[i]);
    }
  }

  return self;
}

Yallist.prototype.removeNode = function (node) {
  if (node.list !== this) {
    throw new Error('removing node which does not belong to this list');
  }

  var next = node.next;
  var prev = node.prev;

  if (next) {
    next.prev = prev;
  }

  if (prev) {
    prev.next = next;
  }

  if (node === this.head) {
    this.head = next;
  }

  if (node === this.tail) {
    this.tail = prev;
  }

  node.list.length--;
  node.next = null;
  node.prev = null;
  node.list = null;
  return next;
};

Yallist.prototype.unshiftNode = function (node) {
  if (node === this.head) {
    return;
  }

  if (node.list) {
    node.list.removeNode(node);
  }

  var head = this.head;
  node.list = this;
  node.next = head;

  if (head) {
    head.prev = node;
  }

  this.head = node;

  if (!this.tail) {
    this.tail = node;
  }

  this.length++;
};

Yallist.prototype.pushNode = function (node) {
  if (node === this.tail) {
    return;
  }

  if (node.list) {
    node.list.removeNode(node);
  }

  var tail = this.tail;
  node.list = this;
  node.prev = tail;

  if (tail) {
    tail.next = node;
  }

  this.tail = node;

  if (!this.head) {
    this.head = node;
  }

  this.length++;
};

Yallist.prototype.push = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    push(this, arguments[i]);
  }

  return this.length;
};

Yallist.prototype.unshift = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    unshift(this, arguments[i]);
  }

  return this.length;
};

Yallist.prototype.pop = function () {
  if (!this.tail) {
    return undefined;
  }

  var res = this.tail.value;
  this.tail = this.tail.prev;

  if (this.tail) {
    this.tail.next = null;
  } else {
    this.head = null;
  }

  this.length--;
  return res;
};

Yallist.prototype.shift = function () {
  if (!this.head) {
    return undefined;
  }

  var res = this.head.value;
  this.head = this.head.next;

  if (this.head) {
    this.head.prev = null;
  } else {
    this.tail = null;
  }

  this.length--;
  return res;
};

Yallist.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this;

  for (var walker = this.head, i = 0; walker !== null; i++) {
    fn.call(thisp, walker.value, i, this);
    walker = walker.next;
  }
};

Yallist.prototype.forEachReverse = function (fn, thisp) {
  thisp = thisp || this;

  for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
    fn.call(thisp, walker.value, i, this);
    walker = walker.prev;
  }
};

Yallist.prototype.get = function (n) {
  for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.next;
  }

  if (i === n && walker !== null) {
    return walker.value;
  }
};

Yallist.prototype.getReverse = function (n) {
  for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.prev;
  }

  if (i === n && walker !== null) {
    return walker.value;
  }
};

Yallist.prototype.map = function (fn, thisp) {
  thisp = thisp || this;
  var res = new Yallist();

  for (var walker = this.head; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this));
    walker = walker.next;
  }

  return res;
};

Yallist.prototype.mapReverse = function (fn, thisp) {
  thisp = thisp || this;
  var res = new Yallist();

  for (var walker = this.tail; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this));
    walker = walker.prev;
  }

  return res;
};

Yallist.prototype.reduce = function (fn, initial) {
  var acc;
  var walker = this.head;

  if (arguments.length > 1) {
    acc = initial;
  } else if (this.head) {
    walker = this.head.next;
    acc = this.head.value;
  } else {
    throw new TypeError('Reduce of empty list with no initial value');
  }

  for (var i = 0; walker !== null; i++) {
    acc = fn(acc, walker.value, i);
    walker = walker.next;
  }

  return acc;
};

Yallist.prototype.reduceReverse = function (fn, initial) {
  var acc;
  var walker = this.tail;

  if (arguments.length > 1) {
    acc = initial;
  } else if (this.tail) {
    walker = this.tail.prev;
    acc = this.tail.value;
  } else {
    throw new TypeError('Reduce of empty list with no initial value');
  }

  for (var i = this.length - 1; walker !== null; i--) {
    acc = fn(acc, walker.value, i);
    walker = walker.prev;
  }

  return acc;
};

Yallist.prototype.toArray = function () {
  var arr = new Array(this.length);

  for (var i = 0, walker = this.head; walker !== null; i++) {
    arr[i] = walker.value;
    walker = walker.next;
  }

  return arr;
};

Yallist.prototype.toArrayReverse = function () {
  var arr = new Array(this.length);

  for (var i = 0, walker = this.tail; walker !== null; i++) {
    arr[i] = walker.value;
    walker = walker.prev;
  }

  return arr;
};

Yallist.prototype.slice = function (from, to) {
  to = to || this.length;

  if (to < 0) {
    to += this.length;
  }

  from = from || 0;

  if (from < 0) {
    from += this.length;
  }

  var ret = new Yallist();

  if (to < from || to < 0) {
    return ret;
  }

  if (from < 0) {
    from = 0;
  }

  if (to > this.length) {
    to = this.length;
  }

  for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
    walker = walker.next;
  }

  for (; walker !== null && i < to; i++, walker = walker.next) {
    ret.push(walker.value);
  }

  return ret;
};

Yallist.prototype.sliceReverse = function (from, to) {
  to = to || this.length;

  if (to < 0) {
    to += this.length;
  }

  from = from || 0;

  if (from < 0) {
    from += this.length;
  }

  var ret = new Yallist();

  if (to < from || to < 0) {
    return ret;
  }

  if (from < 0) {
    from = 0;
  }

  if (to > this.length) {
    to = this.length;
  }

  for (var i = this.length, walker = this.tail; walker !== null && i > to; i--) {
    walker = walker.prev;
  }

  for (; walker !== null && i > from; i--, walker = walker.prev) {
    ret.push(walker.value);
  }

  return ret;
};

Yallist.prototype.splice = function (start, deleteCount, ...nodes) {
  if (start > this.length) {
    start = this.length - 1;
  }

  if (start < 0) {
    start = this.length + start;
  }

  for (var i = 0, walker = this.head; walker !== null && i < start; i++) {
    walker = walker.next;
  }

  var ret = [];

  for (var i = 0; walker && i < deleteCount; i++) {
    ret.push(walker.value);
    walker = this.removeNode(walker);
  }

  if (walker === null) {
    walker = this.tail;
  }

  if (walker !== this.head && walker !== this.tail) {
    walker = walker.prev;
  }

  for (var i = 0; i < nodes.length; i++) {
    walker = insert(this, walker, nodes[i]);
  }

  return ret;
};

Yallist.prototype.reverse = function () {
  var head = this.head;
  var tail = this.tail;

  for (var walker = head; walker !== null; walker = walker.prev) {
    var p = walker.prev;
    walker.prev = walker.next;
    walker.next = p;
  }

  this.head = tail;
  this.tail = head;
  return this;
};

function insert(self, node, value) {
  var inserted = node === self.head ? new Node(value, null, node, self) : new Node(value, node, node.next, self);

  if (inserted.next === null) {
    self.tail = inserted;
  }

  if (inserted.prev === null) {
    self.head = inserted;
  }

  self.length++;
  return inserted;
}

function push(self, item) {
  self.tail = new Node(item, self.tail, null, self);

  if (!self.head) {
    self.head = self.tail;
  }

  self.length++;
}

function unshift(self, item) {
  self.head = new Node(item, null, self.head, self);

  if (!self.tail) {
    self.tail = self.head;
  }

  self.length++;
}

function Node(value, prev, next, list) {
  if (!(this instanceof Node)) {
    return new Node(value, prev, next, list);
  }

  this.list = list;
  this.value = value;

  if (prev) {
    prev.next = this;
    this.prev = prev;
  } else {
    this.prev = null;
  }

  if (next) {
    next.prev = this;
    this.next = next;
  } else {
    this.next = null;
  }
}

try {
  // add if support for Symbol.iterator is present
  iterator(Yallist);
} catch (er) {}

const MAX = Symbol('max');
const LENGTH = Symbol('length');
const LENGTH_CALCULATOR = Symbol('lengthCalculator');
const ALLOW_STALE = Symbol('allowStale');
const MAX_AGE = Symbol('maxAge');
const DISPOSE = Symbol('dispose');
const NO_DISPOSE_ON_SET = Symbol('noDisposeOnSet');
const LRU_LIST = Symbol('lruList');
const CACHE = Symbol('cache');
const UPDATE_AGE_ON_GET = Symbol('updateAgeOnGet');

const naiveLength = () => 1; // lruList is a yallist where the head is the youngest
// item, and the tail is the oldest.  the list contains the Hit
// objects as the entries.
// Each Hit object has a reference to its Yallist.Node.  This
// never changes.
//
// cache is a Map (or PseudoMap) that matches the keys to
// the Yallist.Node object.


class LRUCache {
  constructor(options) {
    if (typeof options === 'number') options = {
      max: options
    };
    if (!options) options = {};
    if (options.max && (typeof options.max !== 'number' || options.max < 0)) throw new TypeError('max must be a non-negative number'); // Kind of weird to have a default max of Infinity, but oh well.

    this[MAX] = options.max || Infinity;
    const lc = options.length || naiveLength;
    this[LENGTH_CALCULATOR] = typeof lc !== 'function' ? naiveLength : lc;
    this[ALLOW_STALE] = options.stale || false;
    if (options.maxAge && typeof options.maxAge !== 'number') throw new TypeError('maxAge must be a number');
    this[MAX_AGE] = options.maxAge || 0;
    this[DISPOSE] = options.dispose;
    this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false;
    this[UPDATE_AGE_ON_GET] = options.updateAgeOnGet || false;
    this.reset();
  } // resize the cache when the max changes.


  set max(mL) {
    if (typeof mL !== 'number' || mL < 0) throw new TypeError('max must be a non-negative number');
    this[MAX] = mL || Infinity;
    trim(this);
  }

  get max() {
    return this[MAX];
  }

  set allowStale(allowStale) {
    this[ALLOW_STALE] = !!allowStale;
  }

  get allowStale() {
    return this[ALLOW_STALE];
  }

  set maxAge(mA) {
    if (typeof mA !== 'number') throw new TypeError('maxAge must be a non-negative number');
    this[MAX_AGE] = mA;
    trim(this);
  }

  get maxAge() {
    return this[MAX_AGE];
  } // resize the cache when the lengthCalculator changes.


  set lengthCalculator(lC) {
    if (typeof lC !== 'function') lC = naiveLength;

    if (lC !== this[LENGTH_CALCULATOR]) {
      this[LENGTH_CALCULATOR] = lC;
      this[LENGTH] = 0;
      this[LRU_LIST].forEach(hit => {
        hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key);
        this[LENGTH] += hit.length;
      });
    }

    trim(this);
  }

  get lengthCalculator() {
    return this[LENGTH_CALCULATOR];
  }

  get length() {
    return this[LENGTH];
  }

  get itemCount() {
    return this[LRU_LIST].length;
  }

  rforEach(fn, thisp) {
    thisp = thisp || this;

    for (let walker = this[LRU_LIST].tail; walker !== null;) {
      const prev = walker.prev;
      forEachStep(this, fn, walker, thisp);
      walker = prev;
    }
  }

  forEach(fn, thisp) {
    thisp = thisp || this;

    for (let walker = this[LRU_LIST].head; walker !== null;) {
      const next = walker.next;
      forEachStep(this, fn, walker, thisp);
      walker = next;
    }
  }

  keys() {
    return this[LRU_LIST].toArray().map(k => k.key);
  }

  values() {
    return this[LRU_LIST].toArray().map(k => k.value);
  }

  reset() {
    if (this[DISPOSE] && this[LRU_LIST] && this[LRU_LIST].length) {
      this[LRU_LIST].forEach(hit => this[DISPOSE](hit.key, hit.value));
    }

    this[CACHE] = new Map(); // hash of items by key

    this[LRU_LIST] = new yallist(); // list of items in order of use recency

    this[LENGTH] = 0; // length of items in the list
  }

  dump() {
    return this[LRU_LIST].map(hit => isStale(this, hit) ? false : {
      k: hit.key,
      v: hit.value,
      e: hit.now + (hit.maxAge || 0)
    }).toArray().filter(h => h);
  }

  dumpLru() {
    return this[LRU_LIST];
  }

  set(key, value, maxAge) {
    maxAge = maxAge || this[MAX_AGE];
    if (maxAge && typeof maxAge !== 'number') throw new TypeError('maxAge must be a number');
    const now = maxAge ? Date.now() : 0;
    const len = this[LENGTH_CALCULATOR](value, key);

    if (this[CACHE].has(key)) {
      if (len > this[MAX]) {
        del(this, this[CACHE].get(key));
        return false;
      }

      const node = this[CACHE].get(key);
      const item = node.value; // dispose of the old one before overwriting
      // split out into 2 ifs for better coverage tracking

      if (this[DISPOSE]) {
        if (!this[NO_DISPOSE_ON_SET]) this[DISPOSE](key, item.value);
      }

      item.now = now;
      item.maxAge = maxAge;
      item.value = value;
      this[LENGTH] += len - item.length;
      item.length = len;
      this.get(key);
      trim(this);
      return true;
    }

    const hit = new Entry(key, value, len, now, maxAge); // oversized objects fall out of cache automatically.

    if (hit.length > this[MAX]) {
      if (this[DISPOSE]) this[DISPOSE](key, value);
      return false;
    }

    this[LENGTH] += hit.length;
    this[LRU_LIST].unshift(hit);
    this[CACHE].set(key, this[LRU_LIST].head);
    trim(this);
    return true;
  }

  has(key) {
    if (!this[CACHE].has(key)) return false;
    const hit = this[CACHE].get(key).value;
    return !isStale(this, hit);
  }

  get(key) {
    return get(this, key, true);
  }

  peek(key) {
    return get(this, key, false);
  }

  pop() {
    const node = this[LRU_LIST].tail;
    if (!node) return null;
    del(this, node);
    return node.value;
  }

  del(key) {
    del(this, this[CACHE].get(key));
  }

  load(arr) {
    // reset the cache
    this.reset();
    const now = Date.now(); // A previous serialized cache has the most recent items first

    for (let l = arr.length - 1; l >= 0; l--) {
      const hit = arr[l];
      const expiresAt = hit.e || 0;
      if (expiresAt === 0) // the item was created without expiration in a non aged cache
        this.set(hit.k, hit.v);else {
        const maxAge = expiresAt - now; // dont add already expired items

        if (maxAge > 0) {
          this.set(hit.k, hit.v, maxAge);
        }
      }
    }
  }

  prune() {
    this[CACHE].forEach((value, key) => get(this, key, false));
  }

}

const get = (self, key, doUse) => {
  const node = self[CACHE].get(key);

  if (node) {
    const hit = node.value;

    if (isStale(self, hit)) {
      del(self, node);
      if (!self[ALLOW_STALE]) return undefined;
    } else {
      if (doUse) {
        if (self[UPDATE_AGE_ON_GET]) node.value.now = Date.now();
        self[LRU_LIST].unshiftNode(node);
      }
    }

    return hit.value;
  }
};

const isStale = (self, hit) => {
  if (!hit || !hit.maxAge && !self[MAX_AGE]) return false;
  const diff = Date.now() - hit.now;
  return hit.maxAge ? diff > hit.maxAge : self[MAX_AGE] && diff > self[MAX_AGE];
};

const trim = self => {
  if (self[LENGTH] > self[MAX]) {
    for (let walker = self[LRU_LIST].tail; self[LENGTH] > self[MAX] && walker !== null;) {
      // We know that we're about to delete this one, and also
      // what the next least recently used key will be, so just
      // go ahead and set it now.
      const prev = walker.prev;
      del(self, walker);
      walker = prev;
    }
  }
};

const del = (self, node) => {
  if (node) {
    const hit = node.value;
    if (self[DISPOSE]) self[DISPOSE](hit.key, hit.value);
    self[LENGTH] -= hit.length;
    self[CACHE].delete(hit.key);
    self[LRU_LIST].removeNode(node);
  }
};

class Entry {
  constructor(key, value, length, now, maxAge) {
    this.key = key;
    this.value = value;
    this.length = length;
    this.now = now;
    this.maxAge = maxAge || 0;
  }

}

const forEachStep = (self, fn, node, thisp) => {
  let hit = node.value;

  if (isStale(self, hit)) {
    del(self, node);
    if (!self[ALLOW_STALE]) hit = undefined;
  }

  if (hit) fn.call(thisp, hit.value, hit.key, self);
};

var lruCache = LRUCache;

/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var b = "function" === typeof Symbol && Symbol.for,
    c = b ? Symbol.for("react.element") : 60103,
    d = b ? Symbol.for("react.portal") : 60106,
    e = b ? Symbol.for("react.fragment") : 60107,
    f = b ? Symbol.for("react.strict_mode") : 60108,
    g = b ? Symbol.for("react.profiler") : 60114,
    h = b ? Symbol.for("react.provider") : 60109,
    k = b ? Symbol.for("react.context") : 60110,
    l = b ? Symbol.for("react.async_mode") : 60111,
    m = b ? Symbol.for("react.concurrent_mode") : 60111,
    n = b ? Symbol.for("react.forward_ref") : 60112,
    p = b ? Symbol.for("react.suspense") : 60113,
    q = b ? Symbol.for("react.suspense_list") : 60120,
    r = b ? Symbol.for("react.memo") : 60115,
    t = b ? Symbol.for("react.lazy") : 60116,
    v = b ? Symbol.for("react.block") : 60121,
    w = b ? Symbol.for("react.fundamental") : 60117,
    x = b ? Symbol.for("react.responder") : 60118,
    y = b ? Symbol.for("react.scope") : 60119;

function z(a) {
  if ("object" === typeof a && null !== a) {
    var u = a.$$typeof;

    switch (u) {
      case c:
        switch (a = a.type, a) {
          case l:
          case m:
          case e:
          case g:
          case f:
          case p:
            return a;

          default:
            switch (a = a && a.$$typeof, a) {
              case k:
              case n:
              case t:
              case r:
              case h:
                return a;

              default:
                return u;
            }

        }

      case d:
        return u;
    }
  }
}

function A(a) {
  return z(a) === m;
}

var AsyncMode = l;
var ConcurrentMode = m;
var ContextConsumer = k;
var ContextProvider = h;
var Element = c;
var ForwardRef = n;
var Fragment = e;
var Lazy = t;
var Memo = r;
var Portal = d;
var Profiler = g;
var StrictMode = f;
var Suspense = p;

var isAsyncMode = function (a) {
  return A(a) || z(a) === l;
};

var isConcurrentMode = A;

var isContextConsumer = function (a) {
  return z(a) === k;
};

var isContextProvider = function (a) {
  return z(a) === h;
};

var isElement = function (a) {
  return "object" === typeof a && null !== a && a.$$typeof === c;
};

var isForwardRef = function (a) {
  return z(a) === n;
};

var isFragment = function (a) {
  return z(a) === e;
};

var isLazy = function (a) {
  return z(a) === t;
};

var isMemo = function (a) {
  return z(a) === r;
};

var isPortal = function (a) {
  return z(a) === d;
};

var isProfiler = function (a) {
  return z(a) === g;
};

var isStrictMode = function (a) {
  return z(a) === f;
};

var isSuspense = function (a) {
  return z(a) === p;
};

var isValidElementType = function (a) {
  return "string" === typeof a || "function" === typeof a || a === e || a === m || a === g || a === f || a === p || a === q || "object" === typeof a && null !== a && (a.$$typeof === t || a.$$typeof === r || a.$$typeof === h || a.$$typeof === k || a.$$typeof === n || a.$$typeof === w || a.$$typeof === x || a.$$typeof === y || a.$$typeof === v);
};

var typeOf = z;
var reactIs_production_min = {
  AsyncMode: AsyncMode,
  ConcurrentMode: ConcurrentMode,
  ContextConsumer: ContextConsumer,
  ContextProvider: ContextProvider,
  Element: Element,
  ForwardRef: ForwardRef,
  Fragment: Fragment,
  Lazy: Lazy,
  Memo: Memo,
  Portal: Portal,
  Profiler: Profiler,
  StrictMode: StrictMode,
  Suspense: Suspense,
  isAsyncMode: isAsyncMode,
  isConcurrentMode: isConcurrentMode,
  isContextConsumer: isContextConsumer,
  isContextProvider: isContextProvider,
  isElement: isElement,
  isForwardRef: isForwardRef,
  isFragment: isFragment,
  isLazy: isLazy,
  isMemo: isMemo,
  isPortal: isPortal,
  isProfiler: isProfiler,
  isStrictMode: isStrictMode,
  isSuspense: isSuspense,
  isValidElementType: isValidElementType,
  typeOf: typeOf
};

/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var reactIs_development = createCommonjsModule(function (module, exports) {

  if (process.env.NODE_ENV !== "production") {
    (function () {
      // nor polyfill, then a plain number is used for performance.

      var hasSymbol = typeof Symbol === 'function' && Symbol.for;
      var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
      var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
      var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
      var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
      var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
      var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
      var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
      // (unstable) APIs that have been removed. Can we remove the symbols?

      var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
      var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
      var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
      var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
      var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
      var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
      var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
      var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
      var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
      var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
      var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

      function isValidElementType(type) {
        return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
        type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
      }

      function typeOf(object) {
        if (typeof object === 'object' && object !== null) {
          var $$typeof = object.$$typeof;

          switch ($$typeof) {
            case REACT_ELEMENT_TYPE:
              var type = object.type;

              switch (type) {
                case REACT_ASYNC_MODE_TYPE:
                case REACT_CONCURRENT_MODE_TYPE:
                case REACT_FRAGMENT_TYPE:
                case REACT_PROFILER_TYPE:
                case REACT_STRICT_MODE_TYPE:
                case REACT_SUSPENSE_TYPE:
                  return type;

                default:
                  var $$typeofType = type && type.$$typeof;

                  switch ($$typeofType) {
                    case REACT_CONTEXT_TYPE:
                    case REACT_FORWARD_REF_TYPE:
                    case REACT_LAZY_TYPE:
                    case REACT_MEMO_TYPE:
                    case REACT_PROVIDER_TYPE:
                      return $$typeofType;

                    default:
                      return $$typeof;
                  }

              }

            case REACT_PORTAL_TYPE:
              return $$typeof;
          }
        }

        return undefined;
      } // AsyncMode is deprecated along with isAsyncMode


      var AsyncMode = REACT_ASYNC_MODE_TYPE;
      var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
      var ContextConsumer = REACT_CONTEXT_TYPE;
      var ContextProvider = REACT_PROVIDER_TYPE;
      var Element = REACT_ELEMENT_TYPE;
      var ForwardRef = REACT_FORWARD_REF_TYPE;
      var Fragment = REACT_FRAGMENT_TYPE;
      var Lazy = REACT_LAZY_TYPE;
      var Memo = REACT_MEMO_TYPE;
      var Portal = REACT_PORTAL_TYPE;
      var Profiler = REACT_PROFILER_TYPE;
      var StrictMode = REACT_STRICT_MODE_TYPE;
      var Suspense = REACT_SUSPENSE_TYPE;
      var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

      function isAsyncMode(object) {
        {
          if (!hasWarnedAboutDeprecatedIsAsyncMode) {
            hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

            console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
          }
        }
        return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
      }

      function isConcurrentMode(object) {
        return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
      }

      function isContextConsumer(object) {
        return typeOf(object) === REACT_CONTEXT_TYPE;
      }

      function isContextProvider(object) {
        return typeOf(object) === REACT_PROVIDER_TYPE;
      }

      function isElement(object) {
        return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
      }

      function isForwardRef(object) {
        return typeOf(object) === REACT_FORWARD_REF_TYPE;
      }

      function isFragment(object) {
        return typeOf(object) === REACT_FRAGMENT_TYPE;
      }

      function isLazy(object) {
        return typeOf(object) === REACT_LAZY_TYPE;
      }

      function isMemo(object) {
        return typeOf(object) === REACT_MEMO_TYPE;
      }

      function isPortal(object) {
        return typeOf(object) === REACT_PORTAL_TYPE;
      }

      function isProfiler(object) {
        return typeOf(object) === REACT_PROFILER_TYPE;
      }

      function isStrictMode(object) {
        return typeOf(object) === REACT_STRICT_MODE_TYPE;
      }

      function isSuspense(object) {
        return typeOf(object) === REACT_SUSPENSE_TYPE;
      }

      exports.AsyncMode = AsyncMode;
      exports.ConcurrentMode = ConcurrentMode;
      exports.ContextConsumer = ContextConsumer;
      exports.ContextProvider = ContextProvider;
      exports.Element = Element;
      exports.ForwardRef = ForwardRef;
      exports.Fragment = Fragment;
      exports.Lazy = Lazy;
      exports.Memo = Memo;
      exports.Portal = Portal;
      exports.Profiler = Profiler;
      exports.StrictMode = StrictMode;
      exports.Suspense = Suspense;
      exports.isAsyncMode = isAsyncMode;
      exports.isConcurrentMode = isConcurrentMode;
      exports.isContextConsumer = isContextConsumer;
      exports.isContextProvider = isContextProvider;
      exports.isElement = isElement;
      exports.isForwardRef = isForwardRef;
      exports.isFragment = isFragment;
      exports.isLazy = isLazy;
      exports.isMemo = isMemo;
      exports.isPortal = isPortal;
      exports.isProfiler = isProfiler;
      exports.isStrictMode = isStrictMode;
      exports.isSuspense = isSuspense;
      exports.isValidElementType = isValidElementType;
      exports.typeOf = typeOf;
    })();
  }
});

createCommonjsModule(function (module) {

  if (process.env.NODE_ENV === 'production') {
    module.exports = reactIs_production_min;
  } else {
    module.exports = reactIs_development;
  }
});

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
function localStorageGetItem(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}
function localStorageSetItem(key, value) {
  try {
    return localStorage.setItem(key, value);
  } catch (error) {}
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
// Try to reuse the already encoded strings.

new lruCache({
  max: 1000
});
function utfDecodeString(array) {
  // Avoid spreading the array (e.g. String.fromCodePoint(...array))
  // Functions arguments are first placed on the stack before the function is called
  // which throws a RangeError for large arrays.
  // See github.com/facebook/react/issues/22293
  let string = '';

  for (let i = 0; i < array.length; i++) {
    const char = array[i];
    string += String.fromCodePoint(char);
  }

  return string;
}
function getDefaultComponentFilters() {
  return [{
    type: ComponentFilterElementType,
    value: ElementTypeHostComponent,
    isEnabled: true
  }];
}
function getSavedComponentFilters() {
  try {
    const raw = localStorageGetItem(LOCAL_STORAGE_FILTER_PREFERENCES_KEY);

    if (raw != null) {
      return JSON.parse(raw);
    }
  } catch (error) {}

  return getDefaultComponentFilters();
}
function saveComponentFilters(componentFilters) {
  localStorageSetItem(LOCAL_STORAGE_FILTER_PREFERENCES_KEY, JSON.stringify(componentFilters));
}
function separateDisplayNameAndHOCs(displayName, type) {
  if (displayName === null) {
    return [null, null];
  }

  let hocDisplayNames = null;

  switch (type) {
    case ElementTypeClass:
    case ElementTypeForwardRef:
    case ElementTypeFunction:
    case ElementTypeMemo:
      if (displayName.indexOf('(') >= 0) {
        const matches = displayName.match(/[^()]+/g);

        if (matches != null) {
          displayName = matches.pop();
          hocDisplayNames = matches;
        }
      }

      break;
  }

  if (type === ElementTypeMemo) {
    if (hocDisplayNames === null) {
      hocDisplayNames = ['Memo'];
    } else {
      hocDisplayNames.unshift('Memo');
    }
  } else if (type === ElementTypeForwardRef) {
    if (hocDisplayNames === null) {
      hocDisplayNames = ['ForwardRef'];
    } else {
      hocDisplayNames.unshift('ForwardRef');
    }
  }

  return [displayName, hocDisplayNames];
} // Pulled from react-compat
// https://github.com/developit/preact-compat/blob/7c5de00e7c85e2ffd011bf3af02899b63f699d3a/src/index.js#L349

function shallowDiffers(prev, next) {
  for (const attribute in prev) {
    if (!(attribute in next)) {
      return true;
    }
  }

  for (const attribute in next) {
    if (prev[attribute] !== next[attribute]) {
      return true;
    }
  }

  return false;
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
// This format can then be quickly exported (and re-imported).

function prepareProfilingDataFrontendFromBackendAndStore(dataBackends, operationsByRootID, snapshotsByRootID) {
  const dataForRoots = new Map();
  dataBackends.forEach(dataBackend => {
    dataBackend.dataForRoots.forEach(({
      commitData,
      displayName,
      initialTreeBaseDurations,
      rootID
    }) => {
      const operations = operationsByRootID.get(rootID);

      if (operations == null) {
        throw Error(`Could not find profiling operations for root "${rootID}"`);
      }

      const snapshots = snapshotsByRootID.get(rootID);

      if (snapshots == null) {
        throw Error(`Could not find profiling snapshots for root "${rootID}"`);
      } // Do not filter empty commits from the profiler data!
      // Hiding "empty" commits might cause confusion too.
      // A commit *did happen* even if none of the components the Profiler is showing were involved.


      const convertedCommitData = commitData.map((commitDataBackend, commitIndex) => ({
        changeDescriptions: commitDataBackend.changeDescriptions != null ? new Map(commitDataBackend.changeDescriptions) : null,
        duration: commitDataBackend.duration,
        effectDuration: commitDataBackend.effectDuration,
        fiberActualDurations: new Map(commitDataBackend.fiberActualDurations),
        fiberSelfDurations: new Map(commitDataBackend.fiberSelfDurations),
        passiveEffectDuration: commitDataBackend.passiveEffectDuration,
        priorityLevel: commitDataBackend.priorityLevel,
        timestamp: commitDataBackend.timestamp,
        updaters: commitDataBackend.updaters !== null ? commitDataBackend.updaters.map(serializedElement => {
          const [serializedElementDisplayName, serializedElementHocDisplayNames] = separateDisplayNameAndHOCs(serializedElement.displayName, serializedElement.type);
          return { ...serializedElement,
            displayName: serializedElementDisplayName,
            hocDisplayNames: serializedElementHocDisplayNames
          };
        }) : null
      }));
      dataForRoots.set(rootID, {
        commitData: convertedCommitData,
        displayName,
        initialTreeBaseDurations: new Map(initialTreeBaseDurations),
        operations,
        rootID,
        snapshots
      });
    });
  });
  return {
    dataForRoots,
    imported: false
  };
} // Converts a Profiling data export into the format required by the Store.
const formatDuration = duration => Math.round(duration * 10) / 10 || '<0.1';

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

const rootToCommitTreeMap = new Map();
function getCommitTree({
  commitIndex,
  profilerStore,
  rootID
}) {
  if (!rootToCommitTreeMap.has(rootID)) {
    rootToCommitTreeMap.set(rootID, []);
  }

  const commitTrees = rootToCommitTreeMap.get(rootID);

  if (commitIndex < commitTrees.length) {
    return commitTrees[commitIndex];
  }

  const {
    profilingData
  } = profilerStore;

  if (profilingData === null) {
    throw Error(`No profiling data available`);
  }

  const dataForRoot = profilingData.dataForRoots.get(rootID);

  if (dataForRoot == null) {
    throw Error(`Could not find profiling data for root "${rootID}"`);
  }

  const {
    operations
  } = dataForRoot;

  if (operations.length <= commitIndex) {
    throw Error(`getCommitTree(): Invalid commit "${commitIndex}" for root "${rootID}". There are only "${operations.length}" commits.`);
  }

  let commitTree = null;

  for (let index = commitTrees.length; index <= commitIndex; index++) {
    // Commits are generated sequentially and cached.
    // If this is the very first commit, start with the cached snapshot and apply the first mutation.
    // Otherwise load (or generate) the previous commit and append a mutation to it.
    if (index === 0) {
      const nodes = new Map(); // Construct the initial tree.

      recursivelyInitializeTree(rootID, 0, nodes, dataForRoot); // Mutate the tree

      if (operations != null && index < operations.length) {
        commitTree = updateTree({
          nodes,
          rootID
        }, operations[index]);

        commitTrees.push(commitTree);
      }
    } else {
      const previousCommitTree = commitTrees[index - 1];
      commitTree = updateTree(previousCommitTree, operations[index]);

      commitTrees.push(commitTree);
    }
  }

  return commitTree;
}

function recursivelyInitializeTree(id, parentID, nodes, dataForRoot) {
  const node = dataForRoot.snapshots.get(id);

  if (node != null) {
    nodes.set(id, {
      id,
      children: node.children,
      displayName: node.displayName,
      hocDisplayNames: node.hocDisplayNames,
      key: node.key,
      parentID,
      treeBaseDuration: dataForRoot.initialTreeBaseDurations.get(id),
      type: node.type
    });
    node.children.forEach(childID => recursivelyInitializeTree(childID, id, nodes, dataForRoot));
  }
}

function updateTree(commitTree, operations) {
  // Clone the original tree so edits don't affect it.
  const nodes = new Map(commitTree.nodes); // Clone nodes before mutating them so edits don't affect them.

  const getClonedNode = id => {
    const clonedNode = Object.assign({}, nodes.get(id));
    nodes.set(id, clonedNode);
    return clonedNode;
  };

  let i = 2;
  let id = null; // Reassemble the string table.

  const stringTable = [null // ID = 0 corresponds to the null string.
  ];
  const stringTableSize = operations[i++];
  const stringTableEnd = i + stringTableSize;

  while (i < stringTableEnd) {
    const nextLength = operations[i++];
    const nextString = utfDecodeString(operations.slice(i, i + nextLength));
    stringTable.push(nextString);
    i += nextLength;
  }

  while (i < operations.length) {
    const operation = operations[i];

    switch (operation) {
      case TREE_OPERATION_ADD:
        id = operations[i + 1];
        const type = operations[i + 2];
        i += 3;

        if (nodes.has(id)) {
          throw new Error(`Commit tree already contains fiber "${id}". This is a bug in React DevTools.`);
        }

        if (type === ElementTypeRoot) {
          i++; // supportsProfiling flag

          i++; // hasOwnerMetadata flag

          const node = {
            children: [],
            displayName: null,
            hocDisplayNames: null,
            id,
            key: null,
            parentID: 0,
            treeBaseDuration: 0,
            // This will be updated by a subsequent operation
            type
          };
          nodes.set(id, node);
        } else {
          const parentID = operations[i];
          i++;
          i++; // ownerID

          const displayNameStringID = operations[i];
          const displayName = stringTable[displayNameStringID];
          i++;
          const keyStringID = operations[i];
          const key = stringTable[keyStringID];
          i++;

          const parentNode = getClonedNode(parentID);
          parentNode.children = parentNode.children.concat(id);
          const node = {
            children: [],
            displayName,
            hocDisplayNames: null,
            id,
            key,
            parentID,
            treeBaseDuration: 0,
            // This will be updated by a subsequent operation
            type
          };
          nodes.set(id, node);
        }

        break;

      case TREE_OPERATION_REMOVE:
        {
          const removeLength = operations[i + 1];
          i += 2;

          for (let removeIndex = 0; removeIndex < removeLength; removeIndex++) {
            id = operations[i];
            i++;

            if (!nodes.has(id)) {
              throw new Error(`Commit tree does not contain fiber "${id}". This is a bug in React DevTools.`);
            }

            const node = getClonedNode(id);
            const parentID = node.parentID;
            nodes.delete(id);

            if (!nodes.has(parentID)) ; else {
              const parentNode = getClonedNode(parentID);

              parentNode.children = parentNode.children.filter(childID => childID !== id);
            }
          }

          break;
        }

      case TREE_OPERATION_REMOVE_ROOT:
        {
          throw Error('Operation REMOVE_ROOT is not supported while profiling.');
        }

      case TREE_OPERATION_REORDER_CHILDREN:
        {
          id = operations[i + 1];
          const numChildren = operations[i + 2];
          const children = operations.slice(i + 3, i + 3 + numChildren);
          i = i + 3 + numChildren;

          const node = getClonedNode(id);
          node.children = Array.from(children);
          break;
        }

      case TREE_OPERATION_UPDATE_TREE_BASE_DURATION:
        {
          id = operations[i + 1];
          const node = getClonedNode(id);
          node.treeBaseDuration = operations[i + 2] / 1000; // Convert microseconds back to milliseconds;

          i += 3;
          break;
        }

      case TREE_OPERATION_UPDATE_ERRORS_OR_WARNINGS:
        id = operations[i + 1];
        operations[i + 2];
        operations[i + 3];
        i += 4;

        break;

      default:
        throw Error(`Unsupported Bridge operation "${operation}"`);
    }
  }

  return {
    nodes,
    rootID: commitTree.rootID
  };
}

function invalidateCommitTrees() {
  rootToCommitTreeMap.clear();
} // DEBUG

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
const cachedChartData$1 = new Map();
function getChartData$1({
  commitIndex,
  commitTree,
  profilerStore,
  rootID
}) {
  const commitDatum = profilerStore.getCommitData(rootID, commitIndex);
  const {
    fiberActualDurations,
    fiberSelfDurations
  } = commitDatum;
  const {
    nodes
  } = commitTree;
  const chartDataKey = `${rootID}-${commitIndex}`;

  if (cachedChartData$1.has(chartDataKey)) {
    return cachedChartData$1.get(chartDataKey);
  }

  const idToDepthMap = new Map();
  const renderPathNodes = new Set();
  const rows = [];
  let maxDepth = 0;
  let maxSelfDuration = 0; // Generate flame graph structure using tree base durations.

  const walkTree = (id, rightOffset, currentDepth) => {
    idToDepthMap.set(id, currentDepth);
    const node = nodes.get(id);

    if (node == null) {
      throw Error(`Could not find node with id "${id}" in commit tree`);
    }

    const {
      children,
      displayName,
      hocDisplayNames,
      key,
      treeBaseDuration
    } = node;
    const actualDuration = fiberActualDurations.get(id) || 0;
    const selfDuration = fiberSelfDurations.get(id) || 0;
    const didRender = fiberActualDurations.has(id);
    const name = displayName || 'Anonymous';
    const maybeKey = key !== null ? ` key="${key}"` : '';
    let maybeBadge = '';

    if (hocDisplayNames !== null && hocDisplayNames.length > 0) {
      maybeBadge = ` (${hocDisplayNames[0]})`;
    }

    let label = `${name}${maybeBadge}${maybeKey}`;

    if (didRender) {
      label += ` (${formatDuration(selfDuration)}ms of ${formatDuration(actualDuration)}ms)`;
    }

    maxDepth = Math.max(maxDepth, currentDepth);
    maxSelfDuration = Math.max(maxSelfDuration, selfDuration);
    const chartNode = {
      actualDuration,
      didRender,
      id,
      label,
      name,
      offset: rightOffset - treeBaseDuration,
      selfDuration,
      treeBaseDuration
    };

    if (currentDepth > rows.length) {
      rows.push([chartNode]);
    } else {
      rows[currentDepth - 1].push(chartNode);
    }

    for (let i = children.length - 1; i >= 0; i--) {
      const childID = children[i];
      const childChartNode = walkTree(childID, rightOffset, currentDepth + 1);
      rightOffset -= childChartNode.treeBaseDuration;
    }

    return chartNode;
  };

  let baseDuration = 0; // Special case to handle unmounted roots.

  if (nodes.size > 0) {
    // Skip over the root; we don't want to show it in the flamegraph.
    const root = nodes.get(rootID);

    if (root == null) {
      throw Error(`Could not find root node with id "${rootID}" in commit tree`);
    } // Don't assume a single root.
    // Component filters or Fragments might lead to multiple "roots" in a flame graph.


    for (let i = root.children.length - 1; i >= 0; i--) {
      const id = root.children[i];
      const node = nodes.get(id);

      if (node == null) {
        throw Error(`Could not find node with id "${id}" in commit tree`);
      }

      baseDuration += node.treeBaseDuration;
      walkTree(id, baseDuration, 1);
    }

    fiberActualDurations.forEach((duration, id) => {
      let node = nodes.get(id);

      if (node != null) {
        let currentID = node.parentID;

        while (currentID !== 0) {
          if (renderPathNodes.has(currentID)) {
            // We've already walked this path; we can skip it.
            break;
          } else {
            renderPathNodes.add(currentID);
          }

          node = nodes.get(currentID);
          currentID = node != null ? node.parentID : 0;
        }
      }
    });
  }

  const chartData = {
    baseDuration,
    depth: maxDepth,
    idToDepthMap,
    maxSelfDuration,
    renderPathNodes,
    rows
  };
  cachedChartData$1.set(chartDataKey, chartData);
  return chartData;
}
function invalidateChartData$1() {
  cachedChartData$1.clear();
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
const cachedChartData = new Map();
function getChartData({
  commitIndex,
  commitTree,
  profilerStore,
  rootID
}) {
  const commitDatum = profilerStore.getCommitData(rootID, commitIndex);
  const {
    fiberActualDurations,
    fiberSelfDurations
  } = commitDatum;
  const {
    nodes
  } = commitTree;
  const chartDataKey = `${rootID}-${commitIndex}`;

  if (cachedChartData.has(chartDataKey)) {
    return cachedChartData.get(chartDataKey);
  }

  let maxSelfDuration = 0;
  const chartNodes = [];
  fiberActualDurations.forEach((actualDuration, id) => {
    const node = nodes.get(id);

    if (node == null) {
      throw Error(`Could not find node with id "${id}" in commit tree`);
    }

    const {
      displayName,
      key,
      parentID,
      type
    } = node; // Don't show the root node in this chart.

    if (parentID === 0) {
      return;
    }

    const selfDuration = fiberSelfDurations.get(id) || 0;
    maxSelfDuration = Math.max(maxSelfDuration, selfDuration);
    const name = displayName || 'Anonymous';
    const maybeKey = key !== null ? ` key="${key}"` : '';
    let maybeBadge = '';

    if (type === ElementTypeForwardRef) {
      maybeBadge = ' (ForwardRef)';
    } else if (type === ElementTypeMemo) {
      maybeBadge = ' (Memo)';
    }

    const label = `${name}${maybeBadge}${maybeKey} (${formatDuration(selfDuration)}ms)`;
    chartNodes.push({
      id,
      label,
      name,
      value: selfDuration
    });
  });
  const chartData = {
    maxValue: maxSelfDuration,
    nodes: chartNodes.sort((a, b) => b.value - a.value)
  };
  cachedChartData.set(chartDataKey, chartData);
  return chartData;
}
function invalidateChartData() {
  cachedChartData.clear();
}

class ProfilingCache {
  constructor(profilerStore) {
    _defineProperty(this, "_fiberCommits", new Map());

    _defineProperty(this, "getCommitTree", ({
      commitIndex,
      rootID
    }) => getCommitTree({
      commitIndex,
      profilerStore: this._profilerStore,
      rootID
    }));

    _defineProperty(this, "getFiberCommits", ({
      fiberID,
      rootID
    }) => {
      const cachedFiberCommits = this._fiberCommits.get(fiberID);

      if (cachedFiberCommits != null) {
        return cachedFiberCommits;
      }

      const fiberCommits = [];

      const dataForRoot = this._profilerStore.getDataForRoot(rootID);

      dataForRoot.commitData.forEach((commitDatum, commitIndex) => {
        if (commitDatum.fiberActualDurations.has(fiberID)) {
          fiberCommits.push(commitIndex);
        }
      });

      this._fiberCommits.set(fiberID, fiberCommits);

      return fiberCommits;
    });

    _defineProperty(this, "getFlamegraphChartData", ({
      commitIndex,
      commitTree,
      rootID
    }) => getChartData$1({
      commitIndex,
      commitTree,
      profilerStore: this._profilerStore,
      rootID
    }));

    _defineProperty(this, "getRankedChartData", ({
      commitIndex,
      commitTree,
      rootID
    }) => getChartData({
      commitIndex,
      commitTree,
      profilerStore: this._profilerStore,
      rootID
    }));

    this._profilerStore = profilerStore;
  }

  invalidate() {
    this._fiberCommits.clear();

    invalidateCommitTrees();
    invalidateChartData$1();
    invalidateChartData();
  }

}

class ProfilerStore extends EventEmitter {
  // Suspense cache for lazily calculating derived profiling data.
  // Temporary store of profiling data from the backend renderer(s).
  // This data will be converted to the ProfilingDataFrontend format after being collected from all renderers.
  // Data from the most recently completed profiling session,
  // or data that has been imported from a previously exported session.
  // This object contains all necessary data to drive the Profiler UI interface,
  // even though some of it is lazily parsed/derived via the ProfilingCache.
  // Snapshot of all attached renderer IDs.
  // Once profiling is finished, this snapshot will be used to query renderers for profiling data.
  //
  // This map is initialized when profiling starts and updated when a new root is added while profiling;
  // Upon completion, it is converted into the exportable ProfilingDataFrontend format.
  // Snapshot of the state of the main Store (including all roots) when profiling started.
  // Once profiling is finished, this snapshot can be used along with "operations" messages emitted during profiling,
  // to reconstruct the state of each root for each commit.
  // It's okay to use a single root to store this information because node IDs are unique across all roots.
  //
  // This map is initialized when profiling starts and updated when a new root is added while profiling;
  // Upon completion, it is converted into the exportable ProfilingDataFrontend format.
  // Map of root (id) to a list of tree mutation that occur during profiling.
  // Once profiling is finished, these mutations can be used, along with the initial tree snapshots,
  // to reconstruct the state of each root for each commit.
  //
  // This map is only updated while profiling is in progress;
  // Upon completion, it is converted into the exportable ProfilingDataFrontend format.
  // The backend is currently profiling.
  // When profiling is in progress, operations are stored so that we can later reconstruct past commit trees.
  // Tracks whether a specific renderer logged any profiling data during the most recent session.
  // After profiling, data is requested from each attached renderer using this queue.
  // So long as this queue is not empty, the store is retrieving and processing profiling data from the backend.
  constructor(bridge, store, defaultIsProfiling) {
    super();

    _defineProperty(this, "_dataBackends", []);

    _defineProperty(this, "_dataFrontend", null);

    _defineProperty(this, "_initialRendererIDs", new Set());

    _defineProperty(this, "_initialSnapshotsByRootID", new Map());

    _defineProperty(this, "_inProgressOperationsByRootID", new Map());

    _defineProperty(this, "_isProfiling", false);

    _defineProperty(this, "_rendererIDsThatReportedProfilingData", new Set());

    _defineProperty(this, "_rendererQueue", new Set());

    _defineProperty(this, "_takeProfilingSnapshotRecursive", (elementID, profilingSnapshots) => {
      const element = this._store.getElementByID(elementID);

      if (element !== null) {
        const snapshotNode = {
          id: elementID,
          children: element.children.slice(0),
          displayName: element.displayName,
          hocDisplayNames: element.hocDisplayNames,
          key: element.key,
          type: element.type
        };
        profilingSnapshots.set(elementID, snapshotNode);
        element.children.forEach(childID => this._takeProfilingSnapshotRecursive(childID, profilingSnapshots));
      }
    });

    _defineProperty(this, "onBridgeOperations", operations => {
      // The first two values are always rendererID and rootID
      const rendererID = operations[0];
      const rootID = operations[1];

      if (this._isProfiling) {
        let profilingOperations = this._inProgressOperationsByRootID.get(rootID);

        if (profilingOperations == null) {
          profilingOperations = [operations];

          this._inProgressOperationsByRootID.set(rootID, profilingOperations);
        } else {
          profilingOperations.push(operations);
        }

        if (!this._initialRendererIDs.has(rendererID)) {
          this._initialRendererIDs.add(rendererID);
        }

        if (!this._initialSnapshotsByRootID.has(rootID)) {
          this._initialSnapshotsByRootID.set(rootID, new Map());
        }

        this._rendererIDsThatReportedProfilingData.add(rendererID);
      }
    });

    _defineProperty(this, "onBridgeProfilingData", dataBackend => {
      if (this._isProfiling) {
        // This should never happen, but if it does- ignore previous profiling data.
        return;
      }

      const {
        rendererID
      } = dataBackend;

      if (!this._rendererQueue.has(rendererID)) {
        throw Error(`Unexpected profiling data update from renderer "${rendererID}"`);
      }

      this._dataBackends.push(dataBackend);

      this._rendererQueue.delete(rendererID);

      if (this._rendererQueue.size === 0) {
        this._dataFrontend = prepareProfilingDataFrontendFromBackendAndStore(this._dataBackends, this._inProgressOperationsByRootID, this._initialSnapshotsByRootID);

        this._dataBackends.splice(0);

        this.emit('isProcessingData');
      }
    });

    _defineProperty(this, "onBridgeShutdown", () => {
      this._bridge.removeListener('operations', this.onBridgeOperations);

      this._bridge.removeListener('profilingData', this.onBridgeProfilingData);

      this._bridge.removeListener('profilingStatus', this.onProfilingStatus);

      this._bridge.removeListener('shutdown', this.onBridgeShutdown);
    });

    _defineProperty(this, "onProfilingStatus", isProfiling => {
      if (isProfiling) {
        this._dataBackends.splice(0);

        this._dataFrontend = null;

        this._initialRendererIDs.clear();

        this._initialSnapshotsByRootID.clear();

        this._inProgressOperationsByRootID.clear();

        this._rendererIDsThatReportedProfilingData.clear();

        this._rendererQueue.clear(); // Record all renderer IDs initially too (in case of unmount)
        // eslint-disable-next-line no-for-of-loops/no-for-of-loops


        for (const rendererID of this._store.rootIDToRendererID.values()) {
          if (!this._initialRendererIDs.has(rendererID)) {
            this._initialRendererIDs.add(rendererID);
          }
        } // Record snapshot of tree at the time profiling is started.
        // This info is required to handle cases of e.g. nodes being removed during profiling.


        this._store.roots.forEach(rootID => {
          const profilingSnapshots = new Map();

          this._initialSnapshotsByRootID.set(rootID, profilingSnapshots);

          this._takeProfilingSnapshotRecursive(rootID, profilingSnapshots);
        });
      }

      if (this._isProfiling !== isProfiling) {
        this._isProfiling = isProfiling; // Invalidate suspense cache if profiling data is being (re-)recorded.
        // Note that we clear again, in case any views read from the cache while profiling.
        // (That would have resolved a now-stale value without any profiling data.)

        this._cache.invalidate();

        this.emit('isProfiling'); // If we've just finished a profiling session, we need to fetch data stored in each renderer interface
        // and re-assemble it on the front-end into a format (ProfilingDataFrontend) that can power the Profiler UI.
        // During this time, DevTools UI should probably not be interactive.

        if (!isProfiling) {
          this._dataBackends.splice(0);

          this._rendererQueue.clear(); // Only request data from renderers that actually logged it.
          // This avoids unnecessary bridge requests and also avoids edge case mixed renderer bugs.
          // (e.g. when v15 and v16 are both present)


          this._rendererIDsThatReportedProfilingData.forEach(rendererID => {
            if (!this._rendererQueue.has(rendererID)) {
              this._rendererQueue.add(rendererID);

              this._bridge.send('getProfilingData', {
                rendererID
              });
            }
          });

          this.emit('isProcessingData');
        }
      }
    });

    this._bridge = bridge;
    this._isProfiling = defaultIsProfiling;
    this._store = store;
    bridge.addListener('operations', this.onBridgeOperations);
    bridge.addListener('profilingData', this.onBridgeProfilingData);
    bridge.addListener('profilingStatus', this.onProfilingStatus);
    bridge.addListener('shutdown', this.onBridgeShutdown); // It's possible that profiling has already started (e.g. "reload and start profiling")
    // so the frontend needs to ask the backend for its status after mounting.

    bridge.send('getProfilingStatus');
    this._cache = new ProfilingCache(this);
  }

  getCommitData(rootID, commitIndex) {
    if (this._dataFrontend !== null) {
      const dataForRoot = this._dataFrontend.dataForRoots.get(rootID);

      if (dataForRoot != null) {
        const commitDatum = dataForRoot.commitData[commitIndex];

        if (commitDatum != null) {
          return commitDatum;
        }
      }
    }

    throw Error(`Could not find commit data for root "${rootID}" and commit "${commitIndex}"`);
  }

  getDataForRoot(rootID) {
    if (this._dataFrontend !== null) {
      const dataForRoot = this._dataFrontend.dataForRoots.get(rootID);

      if (dataForRoot != null) {
        return dataForRoot;
      }
    }

    throw Error(`Could not find commit data for root "${rootID}"`);
  } // Profiling data has been recorded for at least one root.


  get didRecordCommits() {
    return this._dataFrontend !== null && this._dataFrontend.dataForRoots.size > 0;
  }

  get isProcessingData() {
    return this._rendererQueue.size > 0 || this._dataBackends.length > 0;
  }

  get isProfiling() {
    return this._isProfiling;
  }

  get profilingCache() {
    return this._cache;
  }

  get profilingData() {
    return this._dataFrontend;
  }

  set profilingData(value) {
    if (this._isProfiling) {
      console.warn('Profiling data cannot be updated while profiling is in progress.');
      return;
    }

    this._dataBackends.splice(0);

    this._dataFrontend = value;

    this._initialRendererIDs.clear();

    this._initialSnapshotsByRootID.clear();

    this._inProgressOperationsByRootID.clear();

    this._cache.invalidate();

    this.emit('profilingData');
  }

  clear() {
    this._dataBackends.splice(0);

    this._dataFrontend = null;

    this._initialRendererIDs.clear();

    this._initialSnapshotsByRootID.clear();

    this._inProgressOperationsByRootID.clear();

    this._rendererQueue.clear(); // Invalidate suspense cache if profiling data is being (re-)recorded.
    // Note that we clear now because any existing data is "stale".


    this._cache.invalidate();

    this.emit('profilingData');
  }

  startProfiling() {
    this._bridge.send('startProfiling', this._store.recordChangeDescriptions); // Don't actually update the local profiling boolean yet!
    // Wait for onProfilingStatus() to confirm the status has changed.
    // This ensures the frontend and backend are in sync wrt which commits were profiled.
    // We do this to avoid mismatches on e.g. CommitTreeBuilder that would cause errors.

  }

  stopProfiling() {
    this._bridge.send('stopProfiling'); // Don't actually update the local profiling boolean yet!
    // Wait for onProfilingStatus() to confirm the status has changed.
    // This ensures the frontend and backend are in sync wrt which commits were profiled.
    // We do this to avoid mismatches on e.g. CommitTreeBuilder that would cause errors.

  }

}

// as well as the earliest NPM version (e.g. "4.13.0") that protocol is supported by on the frontend.
// This enables an older frontend to display an upgrade message to users for a newer, unsupported backend.

// Bump protocol version whenever a backwards breaking change is made
// in the messages sent between BackendBridge and FrontendBridge.
// This mapping is embedded in both frontend and backend builds.
//
// The backend protocol will always be the latest entry in the BRIDGE_PROTOCOL array.
//
// When an older frontend connects to a newer backend,
// the backend can send the minNpmVersion and the frontend can display an NPM upgrade prompt.
//
// When a newer frontend connects with an older protocol version,
// the frontend can use the embedded minNpmVersion/maxNpmVersion values to display a downgrade prompt.
const BRIDGE_PROTOCOL = [// This version technically never existed,
// but a backwards breaking change was added in 4.11,
// so the safest guess to downgrade the frontend would be to version 4.10.
{
  version: 0,
  minNpmVersion: '"<4.11.0"',
  maxNpmVersion: '"<4.11.0"'
}, {
  version: 1,
  minNpmVersion: '4.13.0',
  maxNpmVersion: null
}];
const currentBridgeProtocol = BRIDGE_PROTOCOL[BRIDGE_PROTOCOL.length - 1];

const LOCAL_STORAGE_COLLAPSE_ROOTS_BY_DEFAULT_KEY = 'React::DevTools::collapseNodesByDefault';
const LOCAL_STORAGE_RECORD_CHANGE_DESCRIPTIONS_KEY = 'React::DevTools::recordChangeDescriptions';

/**
 * The store is the single source of truth for updates from the backend.
 * ContextProviders can subscribe to the Store for specific things they want to provide.
 */
class Store extends EventEmitter {
  // Computed whenever _errorsAndWarnings Map changes.
  // Should new nodes be collapsed by default when added to the tree?
  // Map of ID to number of recorded error and warning message IDs.
  // At least one of the injected renderers contains (DEV only) owner metadata.
  // Map of ID to (mutable) Element.
  // Elements are mutated to avoid excessive cloning during tree updates.
  // The InspectedElement Suspense cache also relies on this mutability for its WeakMap usage.
  // Should the React Native style editor panel be shown?
  // Can the backend use the Storage API (e.g. localStorage)?
  // If not, features like reload-and-profile will not work correctly and must be disabled.
  // Can DevTools use sync XHR requests?
  // If not, features like reload-and-profile will not work correctly and must be disabled.
  // This current limitation applies only to web extension builds
  // and will need to be reconsidered in the future if we add support for reload to React Native.
  // Older backends don't support an explicit bridge protocol,
  // so we should timeout eventually and show a downgrade message.
  // Map of element (id) to the set of elements (ids) it owns.
  // This map enables getOwnersListForElement() to avoid traversing the entire tree.
  // Incremented each time the store is mutated.
  // This enables a passive effect to detect a mutation between render and commit phase.
  // This Array must be treated as immutable!
  // Passive effects will check it for changes between render and mount.
  // Renderer ID is needed to support inspection fiber props, state, and hooks.
  // These options may be initially set by a confiugraiton option when constructing the Store.
  // In the case of "supportsProfiling", the option may be updated based on the injected renderers.
  // Total number of visible elements (within all roots).
  // Used for windowing purposes.
  constructor(_bridge, config) {
    super();

    _defineProperty(this, "_cachedErrorCount", 0);

    _defineProperty(this, "_cachedWarningCount", 0);

    _defineProperty(this, "_cachedErrorAndWarningTuples", null);

    _defineProperty(this, "_collapseNodesByDefault", true);

    _defineProperty(this, "_errorsAndWarnings", new Map());

    _defineProperty(this, "_hasOwnerMetadata", false);

    _defineProperty(this, "_idToElement", new Map());

    _defineProperty(this, "_isNativeStyleEditorSupported", false);

    _defineProperty(this, "_isBackendStorageAPISupported", false);

    _defineProperty(this, "_isSynchronousXHRSupported", false);

    _defineProperty(this, "_nativeStyleEditorValidAttributes", null);

    _defineProperty(this, "_onBridgeProtocolTimeoutID", null);

    _defineProperty(this, "_ownersMap", new Map());

    _defineProperty(this, "_recordChangeDescriptions", false);

    _defineProperty(this, "_revision", 0);

    _defineProperty(this, "_roots", []);

    _defineProperty(this, "_rootIDToCapabilities", new Map());

    _defineProperty(this, "_rootIDToRendererID", new Map());

    _defineProperty(this, "_supportsNativeInspection", true);

    _defineProperty(this, "_supportsProfiling", false);

    _defineProperty(this, "_supportsReloadAndProfile", false);

    _defineProperty(this, "_supportsTimeline", false);

    _defineProperty(this, "_supportsTraceUpdates", false);

    _defineProperty(this, "_unsupportedBridgeProtocol", null);

    _defineProperty(this, "_unsupportedRendererVersionDetected", false);

    _defineProperty(this, "_weightAcrossRoots", 0);

    _defineProperty(this, "_adjustParentTreeWeight", (parentElement, weightDelta) => {
      let isInsideCollapsedSubTree = false;

      while (parentElement != null) {
        parentElement.weight += weightDelta; // Additions and deletions within a collapsed subtree should not bubble beyond the collapsed parent.
        // Their weight will bubble up when the parent is expanded.

        if (parentElement.isCollapsed) {
          isInsideCollapsedSubTree = true;
          break;
        }

        parentElement = this._idToElement.get(parentElement.parentID);
      } // Additions and deletions within a collapsed subtree should not affect the overall number of elements.


      if (!isInsideCollapsedSubTree) {
        this._weightAcrossRoots += weightDelta;
      }
    });

    _defineProperty(this, "onBridgeNativeStyleEditorSupported", ({
      isSupported,
      validAttributes
    }) => {
      this._isNativeStyleEditorSupported = isSupported;
      this._nativeStyleEditorValidAttributes = validAttributes || null;
      this.emit('supportsNativeStyleEditor');
    });

    _defineProperty(this, "onBridgeOperations", operations => {

      let haveRootsChanged = false;
      let haveErrorsOrWarningsChanged = false; // The first two values are always rendererID and rootID

      const rendererID = operations[0];
      const addedElementIDs = []; // This is a mapping of removed ID -> parent ID:

      const removedElementIDs = new Map(); // We'll use the parent ID to adjust selection if it gets deleted.

      let i = 2; // Reassemble the string table.

      const stringTable = [null // ID = 0 corresponds to the null string.
      ];
      const stringTableSize = operations[i++];
      const stringTableEnd = i + stringTableSize;

      while (i < stringTableEnd) {
        const nextLength = operations[i++];
        const nextString = utfDecodeString(operations.slice(i, i + nextLength));
        stringTable.push(nextString);
        i += nextLength;
      }

      while (i < operations.length) {
        const operation = operations[i];

        switch (operation) {
          case TREE_OPERATION_ADD:
            {
              const id = operations[i + 1];
              const type = operations[i + 2];
              i += 3;

              if (this._idToElement.has(id)) {
                this._throwAndEmitError(Error(`Cannot add node "${id}" because a node with that id is already in the Store.`));
              }

              let ownerID = 0;
              let parentID = null;

              if (type === ElementTypeRoot) {

                const supportsProfiling = operations[i] > 0;
                i++;
                const hasOwnerMetadata = operations[i] > 0;
                i++;
                this._roots = this._roots.concat(id);

                this._rootIDToRendererID.set(id, rendererID);

                this._rootIDToCapabilities.set(id, {
                  hasOwnerMetadata,
                  supportsProfiling
                });

                this._idToElement.set(id, {
                  children: [],
                  depth: -1,
                  displayName: null,
                  hocDisplayNames: null,
                  id,
                  isCollapsed: false,
                  // Never collapse roots; it would hide the entire tree.
                  key: null,
                  ownerID: 0,
                  parentID: 0,
                  type,
                  weight: 0
                });

                haveRootsChanged = true;
              } else {
                parentID = operations[i];
                i++;
                ownerID = operations[i];
                i++;
                const displayNameStringID = operations[i];
                const displayName = stringTable[displayNameStringID];
                i++;
                const keyStringID = operations[i];
                const key = stringTable[keyStringID];
                i++;

                if (!this._idToElement.has(parentID)) {
                  this._throwAndEmitError(Error(`Cannot add child "${id}" to parent "${parentID}" because parent node was not found in the Store.`));
                }

                const parentElement = this._idToElement.get(parentID);

                parentElement.children.push(id);
                const [displayNameWithoutHOCs, hocDisplayNames] = separateDisplayNameAndHOCs(displayName, type);
                const element = {
                  children: [],
                  depth: parentElement.depth + 1,
                  displayName: displayNameWithoutHOCs,
                  hocDisplayNames,
                  id,
                  isCollapsed: this._collapseNodesByDefault,
                  key,
                  ownerID,
                  parentID: parentElement.id,
                  type,
                  weight: 1
                };

                this._idToElement.set(id, element);

                addedElementIDs.push(id);

                this._adjustParentTreeWeight(parentElement, 1);

                if (ownerID > 0) {
                  let set = this._ownersMap.get(ownerID);

                  if (set === undefined) {
                    set = new Set();

                    this._ownersMap.set(ownerID, set);
                  }

                  set.add(id);
                }
              }

              break;
            }

          case TREE_OPERATION_REMOVE:
            {
              const removeLength = operations[i + 1];
              i += 2;

              for (let removeIndex = 0; removeIndex < removeLength; removeIndex++) {
                const id = operations[i];

                if (!this._idToElement.has(id)) {
                  this._throwAndEmitError(Error(`Cannot remove node "${id}" because no matching node was found in the Store.`));
                }

                i += 1;

                const element = this._idToElement.get(id);

                const {
                  children,
                  ownerID,
                  parentID,
                  weight
                } = element;

                if (children.length > 0) {
                  this._throwAndEmitError(Error(`Node "${id}" was removed before its children.`));
                }

                this._idToElement.delete(id);

                let parentElement = null;

                if (parentID === 0) {

                  this._roots = this._roots.filter(rootID => rootID !== id);

                  this._rootIDToRendererID.delete(id);

                  this._rootIDToCapabilities.delete(id);

                  haveRootsChanged = true;
                } else {

                  parentElement = this._idToElement.get(parentID);

                  if (parentElement === undefined) {
                    this._throwAndEmitError(Error(`Cannot remove node "${id}" from parent "${parentID}" because no matching node was found in the Store.`));
                  }

                  const index = parentElement.children.indexOf(id);
                  parentElement.children.splice(index, 1);
                }

                this._adjustParentTreeWeight(parentElement, -weight);

                removedElementIDs.set(id, parentID);

                this._ownersMap.delete(id);

                if (ownerID > 0) {
                  const set = this._ownersMap.get(ownerID);

                  if (set !== undefined) {
                    set.delete(id);
                  }
                }

                if (this._errorsAndWarnings.has(id)) {
                  this._errorsAndWarnings.delete(id);

                  haveErrorsOrWarningsChanged = true;
                }
              }

              break;
            }

          case TREE_OPERATION_REMOVE_ROOT:
            {
              i += 1;
              const id = operations[1];

              const recursivelyDeleteElements = elementID => {
                const element = this._idToElement.get(elementID);

                this._idToElement.delete(elementID);

                if (element) {
                  // Mostly for Flow's sake
                  for (let index = 0; index < element.children.length; index++) {
                    recursivelyDeleteElements(element.children[index]);
                  }
                }
              };

              const root = this._idToElement.get(id);

              recursivelyDeleteElements(id);

              this._rootIDToCapabilities.delete(id);

              this._rootIDToRendererID.delete(id);

              this._roots = this._roots.filter(rootID => rootID !== id);
              this._weightAcrossRoots -= root.weight;
              break;
            }

          case TREE_OPERATION_REORDER_CHILDREN:
            {
              const id = operations[i + 1];
              const numChildren = operations[i + 2];
              i += 3;

              if (!this._idToElement.has(id)) {
                this._throwAndEmitError(Error(`Cannot reorder children for node "${id}" because no matching node was found in the Store.`));
              }

              const element = this._idToElement.get(id);

              const children = element.children;

              if (children.length !== numChildren) {
                this._throwAndEmitError(Error(`Children cannot be added or removed during a reorder operation.`));
              }

              for (let j = 0; j < numChildren; j++) {
                const childID = operations[i + j];
                children[j] = childID;
              }

              i += numChildren;

              break;
            }

          case TREE_OPERATION_UPDATE_TREE_BASE_DURATION:
            // Base duration updates are only sent while profiling is in progress.
            // We can ignore them at this point.
            // The profiler UI uses them lazily in order to generate the tree.
            i += 3;
            break;

          case TREE_OPERATION_UPDATE_ERRORS_OR_WARNINGS:
            const id = operations[i + 1];
            const errorCount = operations[i + 2];
            const warningCount = operations[i + 3];
            i += 4;

            if (errorCount > 0 || warningCount > 0) {
              this._errorsAndWarnings.set(id, {
                errorCount,
                warningCount
              });
            } else if (this._errorsAndWarnings.has(id)) {
              this._errorsAndWarnings.delete(id);
            }

            haveErrorsOrWarningsChanged = true;
            break;

          default:
            this._throwAndEmitError(Error(`Unsupported Bridge operation "${operation}"`));

        }
      }

      this._revision++; // Any time the tree changes (e.g. elements added, removed, or reordered) cached inidices may be invalid.

      this._cachedErrorAndWarningTuples = null;

      if (haveErrorsOrWarningsChanged) {
        let errorCount = 0;
        let warningCount = 0;

        this._errorsAndWarnings.forEach(entry => {
          errorCount += entry.errorCount;
          warningCount += entry.warningCount;
        });

        this._cachedErrorCount = errorCount;
        this._cachedWarningCount = warningCount;
      }

      if (haveRootsChanged) {
        const prevSupportsProfiling = this._supportsProfiling;
        this._hasOwnerMetadata = false;
        this._supportsProfiling = false;

        this._rootIDToCapabilities.forEach(({
          hasOwnerMetadata,
          supportsProfiling
        }) => {
          if (hasOwnerMetadata) {
            this._hasOwnerMetadata = true;
          }

          if (supportsProfiling) {
            this._supportsProfiling = true;
          }
        });

        this.emit('roots');

        if (this._supportsProfiling !== prevSupportsProfiling) {
          this.emit('supportsProfiling');
        }
      }

      this.emit('mutated', [addedElementIDs, removedElementIDs]);
    });

    _defineProperty(this, "onBridgeOverrideComponentFilters", componentFilters => {
      this._componentFilters = componentFilters;
      saveComponentFilters(componentFilters);
    });

    _defineProperty(this, "onBridgeShutdown", () => {

      const bridge = this._bridge;
      bridge.removeListener('operations', this.onBridgeOperations);
      bridge.removeListener('overrideComponentFilters', this.onBridgeOverrideComponentFilters);
      bridge.removeListener('shutdown', this.onBridgeShutdown);
      bridge.removeListener('isBackendStorageAPISupported', this.onBackendStorageAPISupported);
      bridge.removeListener('isNativeStyleEditorSupported', this.onBridgeNativeStyleEditorSupported);
      bridge.removeListener('isSynchronousXHRSupported', this.onBridgeSynchronousXHRSupported);
      bridge.removeListener('unsupportedRendererVersion', this.onBridgeUnsupportedRendererVersion);
      bridge.removeListener('bridgeProtocol', this.onBridgeProtocol);

      if (this._onBridgeProtocolTimeoutID !== null) {
        clearTimeout(this._onBridgeProtocolTimeoutID);
        this._onBridgeProtocolTimeoutID = null;
      }
    });

    _defineProperty(this, "onBackendStorageAPISupported", isBackendStorageAPISupported => {
      this._isBackendStorageAPISupported = isBackendStorageAPISupported;
      this.emit('supportsReloadAndProfile');
    });

    _defineProperty(this, "onBridgeSynchronousXHRSupported", isSynchronousXHRSupported => {
      this._isSynchronousXHRSupported = isSynchronousXHRSupported;
      this.emit('supportsReloadAndProfile');
    });

    _defineProperty(this, "onBridgeUnsupportedRendererVersion", () => {
      this._unsupportedRendererVersionDetected = true;
      this.emit('unsupportedRendererVersionDetected');
    });

    _defineProperty(this, "onBridgeProtocol", bridgeProtocol => {
      if (this._onBridgeProtocolTimeoutID !== null) {
        clearTimeout(this._onBridgeProtocolTimeoutID);
        this._onBridgeProtocolTimeoutID = null;
      }

      if (bridgeProtocol.version !== currentBridgeProtocol.version) {
        this._unsupportedBridgeProtocol = bridgeProtocol;
      } else {
        // If we should happen to get a response after timing out...
        this._unsupportedBridgeProtocol = null;
      }

      this.emit('unsupportedBridgeProtocolDetected');
    });

    _defineProperty(this, "onBridgeProtocolTimeout", () => {
      this._onBridgeProtocolTimeoutID = null; // If we timed out, that indicates the backend predates the bridge protocol,
      // so we can set a fake version (0) to trigger the downgrade message.

      this._unsupportedBridgeProtocol = BRIDGE_PROTOCOL[0];
      this.emit('unsupportedBridgeProtocolDetected');
    });

    this._collapseNodesByDefault = localStorageGetItem(LOCAL_STORAGE_COLLAPSE_ROOTS_BY_DEFAULT_KEY) === 'true';
    this._recordChangeDescriptions = localStorageGetItem(LOCAL_STORAGE_RECORD_CHANGE_DESCRIPTIONS_KEY) === 'true';
    this._componentFilters = getSavedComponentFilters();
    let isProfiling = false;

    if (config != null) {
      isProfiling = config.isProfiling === true;
      const {
        supportsNativeInspection,
        supportsProfiling,
        supportsReloadAndProfile,
        supportsTimeline,
        supportsTraceUpdates
      } = config;
      this._supportsNativeInspection = supportsNativeInspection !== false;

      if (supportsProfiling) {
        this._supportsProfiling = true;
      }

      if (supportsReloadAndProfile) {
        this._supportsReloadAndProfile = true;
      }

      if (supportsTimeline) {
        this._supportsTimeline = true;
      }

      if (supportsTraceUpdates) {
        this._supportsTraceUpdates = true;
      }
    }

    this._bridge = _bridge;

    _bridge.addListener('operations', this.onBridgeOperations);

    _bridge.addListener('overrideComponentFilters', this.onBridgeOverrideComponentFilters);

    _bridge.addListener('shutdown', this.onBridgeShutdown);

    _bridge.addListener('isBackendStorageAPISupported', this.onBackendStorageAPISupported);

    _bridge.addListener('isNativeStyleEditorSupported', this.onBridgeNativeStyleEditorSupported);

    _bridge.addListener('isSynchronousXHRSupported', this.onBridgeSynchronousXHRSupported);

    _bridge.addListener('unsupportedRendererVersion', this.onBridgeUnsupportedRendererVersion);

    this._profilerStore = new ProfilerStore(_bridge, this, isProfiling); // Verify that the frontend version is compatible with the connected backend.
    // See github.com/facebook/react/issues/21326

    if (config != null && config.checkBridgeProtocolCompatibility) {
      // Older backends don't support an explicit bridge protocol,
      // so we should timeout eventually and show a downgrade message.
      this._onBridgeProtocolTimeoutID = setTimeout(this.onBridgeProtocolTimeout, 10000);

      _bridge.addListener('bridgeProtocol', this.onBridgeProtocol);

      _bridge.send('getBridgeProtocol');
    }
  } // This is only used in tests to avoid memory leaks.


  assertExpectedRootMapSizes() {
    if (this.roots.length === 0) {
      // The only safe time to assert these maps are empty is when the store is empty.
      this.assertMapSizeMatchesRootCount(this._idToElement, '_idToElement');
      this.assertMapSizeMatchesRootCount(this._ownersMap, '_ownersMap');
    } // These maps should always be the same size as the number of roots


    this.assertMapSizeMatchesRootCount(this._rootIDToCapabilities, '_rootIDToCapabilities');
    this.assertMapSizeMatchesRootCount(this._rootIDToRendererID, '_rootIDToRendererID');
  } // This is only used in tests to avoid memory leaks.


  assertMapSizeMatchesRootCount(map, mapName) {
    const expectedSize = this.roots.length;

    if (map.size !== expectedSize) {
      this._throwAndEmitError(Error(`Expected ${mapName} to contain ${expectedSize} items, but it contains ${map.size} items\n\n${util.inspect(map, {
        depth: 20
      })}`));
    }
  }

  get collapseNodesByDefault() {
    return this._collapseNodesByDefault;
  }

  set collapseNodesByDefault(value) {
    this._collapseNodesByDefault = value;
    localStorageSetItem(LOCAL_STORAGE_COLLAPSE_ROOTS_BY_DEFAULT_KEY, value ? 'true' : 'false');
    this.emit('collapseNodesByDefault');
  }

  get componentFilters() {
    return this._componentFilters;
  }

  set componentFilters(value) {
    if (this._profilerStore.isProfiling) {
      // Re-mounting a tree while profiling is in progress might break a lot of assumptions.
      // If necessary, we could support this- but it doesn't seem like a necessary use case.
      this._throwAndEmitError(Error('Cannot modify filter preferences while profiling'));
    } // Filter updates are expensive to apply (since they impact the entire tree).
    // Let's determine if they've changed and avoid doing this work if they haven't.


    const prevEnabledComponentFilters = this._componentFilters.filter(filter => filter.isEnabled);

    const nextEnabledComponentFilters = value.filter(filter => filter.isEnabled);
    let haveEnabledFiltersChanged = prevEnabledComponentFilters.length !== nextEnabledComponentFilters.length;

    if (!haveEnabledFiltersChanged) {
      for (let i = 0; i < nextEnabledComponentFilters.length; i++) {
        const prevFilter = prevEnabledComponentFilters[i];
        const nextFilter = nextEnabledComponentFilters[i];

        if (shallowDiffers(prevFilter, nextFilter)) {
          haveEnabledFiltersChanged = true;
          break;
        }
      }
    }

    this._componentFilters = value; // Update persisted filter preferences stored in localStorage.

    saveComponentFilters(value); // Notify the renderer that filter preferences have changed.
    // This is an expensive operation; it unmounts and remounts the entire tree,
    // so only do it if the set of enabled component filters has changed.

    if (haveEnabledFiltersChanged) {
      this._bridge.send('updateComponentFilters', value);
    }

    this.emit('componentFilters');
  }

  get errorCount() {
    return this._cachedErrorCount;
  }

  get hasOwnerMetadata() {
    return this._hasOwnerMetadata;
  }

  get nativeStyleEditorValidAttributes() {
    return this._nativeStyleEditorValidAttributes;
  }

  get numElements() {
    return this._weightAcrossRoots;
  }

  get profilerStore() {
    return this._profilerStore;
  }

  get recordChangeDescriptions() {
    return this._recordChangeDescriptions;
  }

  set recordChangeDescriptions(value) {
    this._recordChangeDescriptions = value;
    localStorageSetItem(LOCAL_STORAGE_RECORD_CHANGE_DESCRIPTIONS_KEY, value ? 'true' : 'false');
    this.emit('recordChangeDescriptions');
  }

  get revision() {
    return this._revision;
  }

  get rootIDToRendererID() {
    return this._rootIDToRendererID;
  }

  get roots() {
    return this._roots;
  }

  get supportsNativeInspection() {
    return this._supportsNativeInspection;
  }

  get supportsNativeStyleEditor() {
    return this._isNativeStyleEditorSupported;
  }

  get supportsProfiling() {
    return this._supportsProfiling;
  }

  get supportsReloadAndProfile() {
    // Does the DevTools shell support reloading and eagerly injecting the renderer interface?
    // And if so, can the backend use the localStorage API and sync XHR?
    // All of these are currently required for the reload-and-profile feature to work.
    return this._supportsReloadAndProfile && this._isBackendStorageAPISupported && this._isSynchronousXHRSupported;
  }

  get supportsTimeline() {
    return this._supportsTimeline;
  }

  get supportsTraceUpdates() {
    return this._supportsTraceUpdates;
  }

  get unsupportedBridgeProtocol() {
    return this._unsupportedBridgeProtocol;
  }

  get unsupportedRendererVersionDetected() {
    return this._unsupportedRendererVersionDetected;
  }

  get warningCount() {
    return this._cachedWarningCount;
  }

  containsElement(id) {
    return this._idToElement.get(id) != null;
  }

  getElementAtIndex(index) {
    if (index < 0 || index >= this.numElements) {
      console.warn(`Invalid index ${index} specified; store contains ${this.numElements} items.`);
      return null;
    } // Find which root this element is in...


    let rootID;
    let root;
    let rootWeight = 0;

    for (let i = 0; i < this._roots.length; i++) {
      rootID = this._roots[i];
      root = this._idToElement.get(rootID);

      if (root.children.length === 0) {
        continue;
      } else if (rootWeight + root.weight > index) {
        break;
      } else {
        rootWeight += root.weight;
      }
    } // Find the element in the tree using the weight of each node...
    // Skip over the root itself, because roots aren't visible in the Elements tree.


    let currentElement = root;
    let currentWeight = rootWeight - 1;

    while (index !== currentWeight) {
      const numChildren = currentElement.children.length;

      for (let i = 0; i < numChildren; i++) {
        const childID = currentElement.children[i];

        const child = this._idToElement.get(childID);

        const childWeight = child.isCollapsed ? 1 : child.weight;

        if (index <= currentWeight + childWeight) {
          currentWeight++;
          currentElement = child;
          break;
        } else {
          currentWeight += childWeight;
        }
      }
    }

    return currentElement || null;
  }

  getElementIDAtIndex(index) {
    const element = this.getElementAtIndex(index);
    return element === null ? null : element.id;
  }

  getElementByID(id) {
    const element = this._idToElement.get(id);

    if (element == null) {
      console.warn(`No element found with id "${id}"`);
      return null;
    }

    return element;
  } // Returns a tuple of [id, index]


  getElementsWithErrorsAndWarnings() {
    if (this._cachedErrorAndWarningTuples !== null) {
      return this._cachedErrorAndWarningTuples;
    } else {
      const errorAndWarningTuples = [];

      this._errorsAndWarnings.forEach((_, id) => {
        const index = this.getIndexOfElementID(id);

        if (index !== null) {
          let low = 0;
          let high = errorAndWarningTuples.length;

          while (low < high) {
            const mid = low + high >> 1;

            if (errorAndWarningTuples[mid].index > index) {
              high = mid;
            } else {
              low = mid + 1;
            }
          }

          errorAndWarningTuples.splice(low, 0, {
            id,
            index
          });
        }
      }); // Cache for later (at least until the tree changes again).


      this._cachedErrorAndWarningTuples = errorAndWarningTuples;
      return errorAndWarningTuples;
    }
  }

  getErrorAndWarningCountForElementID(id) {
    return this._errorsAndWarnings.get(id) || {
      errorCount: 0,
      warningCount: 0
    };
  }

  getIndexOfElementID(id) {
    const element = this.getElementByID(id);

    if (element === null || element.parentID === 0) {
      return null;
    } // Walk up the tree to the root.
    // Increment the index by one for each node we encounter,
    // and by the weight of all nodes to the left of the current one.
    // This should be a relatively fast way of determining the index of a node within the tree.


    let previousID = id;
    let currentID = element.parentID;
    let index = 0;

    while (true) {
      const current = this._idToElement.get(currentID);

      const {
        children
      } = current;

      for (let i = 0; i < children.length; i++) {
        const childID = children[i];

        if (childID === previousID) {
          break;
        }

        const child = this._idToElement.get(childID);

        index += child.isCollapsed ? 1 : child.weight;
      }

      if (current.parentID === 0) {
        // We found the root; stop crawling.
        break;
      }

      index++;
      previousID = current.id;
      currentID = current.parentID;
    } // At this point, the current ID is a root (from the previous loop).
    // We also need to offset the index by previous root weights.


    for (let i = 0; i < this._roots.length; i++) {
      const rootID = this._roots[i];

      if (rootID === currentID) {
        break;
      }

      const root = this._idToElement.get(rootID);

      index += root.weight;
    }

    return index;
  }

  getOwnersListForElement(ownerID) {
    const list = [];

    const element = this._idToElement.get(ownerID);

    if (element != null) {
      list.push({ ...element,
        depth: 0
      });

      const unsortedIDs = this._ownersMap.get(ownerID);

      if (unsortedIDs !== undefined) {
        const depthMap = new Map([[ownerID, 0]]); // Items in a set are ordered based on insertion.
        // This does not correlate with their order in the tree.
        // So first we need to order them.
        // I wish we could avoid this sorting operation; we could sort at insertion time,
        // but then we'd have to pay sorting costs even if the owners list was never used.
        // Seems better to defer the cost, since the set of ids is probably pretty small.

        const sortedIDs = Array.from(unsortedIDs).sort((idA, idB) => this.getIndexOfElementID(idA) - this.getIndexOfElementID(idB)); // Next we need to determine the appropriate depth for each element in the list.
        // The depth in the list may not correspond to the depth in the tree,
        // because the list has been filtered to remove intermediate components.
        // Perhaps the easiest way to do this is to walk up the tree until we reach either:
        // (1) another node that's already in the tree, or (2) the root (owner)
        // at which point, our depth is just the depth of that node plus one.

        sortedIDs.forEach(id => {
          const innerElement = this._idToElement.get(id);

          if (innerElement != null) {
            let parentID = innerElement.parentID;
            let depth = 0;

            while (parentID > 0) {
              if (parentID === ownerID || unsortedIDs.has(parentID)) {
                depth = depthMap.get(parentID) + 1;
                depthMap.set(id, depth);
                break;
              }

              const parent = this._idToElement.get(parentID);

              if (parent == null) {
                break;
              }

              parentID = parent.parentID;
            }

            if (depth === 0) {
              this._throwAndEmitError(Error('Invalid owners list'));
            }

            list.push({ ...innerElement,
              depth
            });
          }
        });
      }
    }

    return list;
  }

  getRendererIDForElement(id) {
    let current = this._idToElement.get(id);

    while (current != null) {
      if (current.parentID === 0) {
        const rendererID = this._rootIDToRendererID.get(current.id);

        return rendererID == null ? null : rendererID;
      } else {
        current = this._idToElement.get(current.parentID);
      }
    }

    return null;
  }

  getRootIDForElement(id) {
    let current = this._idToElement.get(id);

    while (current != null) {
      if (current.parentID === 0) {
        return current.id;
      } else {
        current = this._idToElement.get(current.parentID);
      }
    }

    return null;
  }

  isInsideCollapsedSubTree(id) {
    let current = this._idToElement.get(id);

    while (current != null) {
      if (current.parentID === 0) {
        return false;
      } else {
        current = this._idToElement.get(current.parentID);

        if (current != null && current.isCollapsed) {
          return true;
        }
      }
    }

    return false;
  } // TODO Maybe split this into two methods: expand() and collapse()


  toggleIsCollapsed(id, isCollapsed) {
    let didMutate = false;
    const element = this.getElementByID(id);

    if (element !== null) {
      if (isCollapsed) {
        if (element.type === ElementTypeRoot) {
          this._throwAndEmitError(Error('Root nodes cannot be collapsed'));
        }

        if (!element.isCollapsed) {
          didMutate = true;
          element.isCollapsed = true;
          const weightDelta = 1 - element.weight;

          let parentElement = this._idToElement.get(element.parentID);

          while (parentElement != null) {
            // We don't need to break on a collapsed parent in the same way as the expand case below.
            // That's because collapsing a node doesn't "bubble" and affect its parents.
            parentElement.weight += weightDelta;
            parentElement = this._idToElement.get(parentElement.parentID);
          }
        }
      } else {
        let currentElement = element;

        while (currentElement != null) {
          const oldWeight = currentElement.isCollapsed ? 1 : currentElement.weight;

          if (currentElement.isCollapsed) {
            didMutate = true;
            currentElement.isCollapsed = false;
            const newWeight = currentElement.isCollapsed ? 1 : currentElement.weight;
            const weightDelta = newWeight - oldWeight;

            let parentElement = this._idToElement.get(currentElement.parentID);

            while (parentElement != null) {
              parentElement.weight += weightDelta;

              if (parentElement.isCollapsed) {
                // It's important to break on a collapsed parent when expanding nodes.
                // That's because expanding a node "bubbles" up and expands all parents as well.
                // Breaking in this case prevents us from over-incrementing the expanded weights.
                break;
              }

              parentElement = this._idToElement.get(parentElement.parentID);
            }
          }

          currentElement = currentElement.parentID !== 0 ? this.getElementByID(currentElement.parentID) : null;
        }
      } // Only re-calculate weights and emit an "update" event if the store was mutated.


      if (didMutate) {
        let weightAcrossRoots = 0;

        this._roots.forEach(rootID => {
          const {
            weight
          } = this.getElementByID(rootID);
          weightAcrossRoots += weight;
        });

        this._weightAcrossRoots = weightAcrossRoots; // The Tree context's search reducer expects an explicit list of ids for nodes that were added or removed.
        // In this  case, we can pass it empty arrays since nodes in a collapsed tree are still there (just hidden).
        // Updating the selected search index later may require auto-expanding a collapsed subtree though.

        this.emit('mutated', [[], new Map()]);
      }
    }
  }

  // The Store should never throw an Error without also emitting an event.
  // Otherwise Store errors will be invisible to users,
  // but the downstream errors they cause will be reported as bugs.
  // For example, https://github.com/facebook/react/issues/21402
  // Emitting an error event allows the ErrorBoundary to show the original error.
  _throwAndEmitError(error) {
    this.emit('error', error); // Throwing is still valuable for local development
    // and for unit testing the Store itself.

    throw error;
  }

}

export default Store;
