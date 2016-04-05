(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var meteorInstall = Package['modules-runtime'].meteorInstall;

/* Package-scope variables */
var Buffer, process;

var require = meteorInstall({"node_modules":{"meteor":{"modules":{"client.js":["./stubs.js","./buffer.js","./process.js","./css",function(require,exports){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/modules/client.js                                                                                   //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
require("./stubs.js");                                                                                          // 1
require("./buffer.js");                                                                                         // 2
require("./process.js");                                                                                        // 3
                                                                                                                // 4
exports.addStyles = require("./css").addStyles;                                                                 // 5
                                                                                                                // 6
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"buffer.js":["buffer",function(require){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/modules/buffer.js                                                                                   //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
try {                                                                                                           // 1
  Buffer = global.Buffer || require("buffer").Buffer;                                                           // 2
} catch (noBuffer) {}                                                                                           // 3
                                                                                                                // 4
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"css.js":function(require,exports){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/modules/css.js                                                                                      //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
var doc = document;                                                                                             // 1
var head = doc.getElementsByTagName("head").item(0);                                                            // 2
                                                                                                                // 3
exports.addStyles = function (css) {                                                                            // 4
  var style = doc.createElement("style");                                                                       // 5
                                                                                                                // 6
  style.setAttribute("type", "text/css");                                                                       // 7
                                                                                                                // 8
  // https://msdn.microsoft.com/en-us/library/ms535871(v=vs.85).aspx                                            // 9
  var internetExplorerSheetObject =                                                                             // 10
    style.sheet || // Edge/IE11.                                                                                // 11
    style.styleSheet; // Older IEs.                                                                             // 12
                                                                                                                // 13
  if (internetExplorerSheetObject) {                                                                            // 14
    internetExplorerSheetObject.cssText = css;                                                                  // 15
  } else {                                                                                                      // 16
    style.appendChild(doc.createTextNode(css));                                                                 // 17
  }                                                                                                             // 18
                                                                                                                // 19
  return head.appendChild(style);                                                                               // 20
};                                                                                                              // 21
                                                                                                                // 22
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"process.js":["process",function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/modules/process.js                                                                                  //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
try {                                                                                                           // 1
  // The application can run `npm install process` to provide its own                                           // 2
  // process stub; otherwise this module will provide a partial stub.                                           // 3
  process = global.process || require("process");                                                               // 4
} catch (noProcess) {                                                                                           // 5
  process = {};                                                                                                 // 6
}                                                                                                               // 7
                                                                                                                // 8
if (Meteor.isServer) {                                                                                          // 9
  // Make require("process") work on the server in all versions of Node.                                        // 10
  meteorInstall({                                                                                               // 11
    node_modules: {                                                                                             // 12
      "process.js": function (r, e, module) {                                                                   // 13
        module.exports = process;                                                                               // 14
      }                                                                                                         // 15
    }                                                                                                           // 16
  });                                                                                                           // 17
} else {                                                                                                        // 18
  process.platform = "browser";                                                                                 // 19
  process.nextTick = process.nextTick || Meteor._setImmediate;                                                  // 20
}                                                                                                               // 21
                                                                                                                // 22
if (typeof process.env !== "object") {                                                                          // 23
  process.env = {};                                                                                             // 24
}                                                                                                               // 25
                                                                                                                // 26
_.extend(process.env, meteorEnv);                                                                               // 27
                                                                                                                // 28
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"stubs.js":["meteor-node-stubs",function(require){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/modules/stubs.js                                                                                    //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
try {                                                                                                           // 1
  // When meteor-node-stubs is installed in the application's root                                              // 2
  // node_modules directory, requiring it here installs aliases for stubs                                       // 3
  // for all Node built-in modules, such as fs, util, and http.                                                 // 4
  require("meteor-node-stubs");                                                                                 // 5
} catch (noStubs) {}                                                                                            // 6
                                                                                                                // 7
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]}},"meteor-node-stubs":{"package.json":function(require,exports){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// node_modules/meteor-node-stubs/package.json                                                                  //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
exports.name = "meteor-node-stubs";                                                                             // 1
exports.version = "0.2.1";                                                                                      // 2
exports.main = "index.js";                                                                                      // 3
                                                                                                                // 4
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":["./map.json",function(require,exports){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// node_modules/meteor-node-stubs/index.js                                                                      //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
var map = require("./map.json");                                                                                // 1
var meteorAliases = {};                                                                                         // 2
                                                                                                                // 3
Object.keys(map).forEach(function (id) {                                                                        // 4
  if (typeof map[id] === "string") {                                                                            // 5
    try {                                                                                                       // 6
      exports[id] = meteorAliases[id + ".js"] =                                                                 // 7
        require.resolve(map[id]);                                                                               // 8
    } catch (e) {                                                                                               // 9
      // Resolution can fail at runtime if the stub was not included in the                                     // 10
      // bundle because nothing depended on it.                                                                 // 11
    }                                                                                                           // 12
  } else {                                                                                                      // 13
    exports[id] = map[id];                                                                                      // 14
    meteorAliases[id + ".js"] = function(){};                                                                   // 15
  }                                                                                                             // 16
});                                                                                                             // 17
                                                                                                                // 18
if (typeof meteorInstall === "function") {                                                                      // 19
  meteorInstall({                                                                                               // 20
    // Install the aliases into a node_modules directory one level up from                                      // 21
    // the root directory, so that they do not clutter the namespace                                            // 22
    // available to apps and packages.                                                                          // 23
    "..": {                                                                                                     // 24
      node_modules: meteorAliases                                                                               // 25
    }                                                                                                           // 26
  });                                                                                                           // 27
}                                                                                                               // 28
                                                                                                                // 29
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"map.json":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// node_modules/meteor-node-stubs/map.json                                                                      //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
module.exports = {                                                                                              // 1
  "assert": "assert/",                                                                                          // 2
  "buffer": "buffer/",                                                                                          // 3
  "child_process": null,                                                                                        // 4
  "cluster": null,                                                                                              // 5
  "console": "console-browserify",                                                                              // 6
  "constants": "constants-browserify",                                                                          // 7
  "crypto": "crypto-browserify",                                                                                // 8
  "dgram": null,                                                                                                // 9
  "dns": null,                                                                                                  // 10
  "domain": "domain-browser",                                                                                   // 11
  "events": "events/",                                                                                          // 12
  "fs": null,                                                                                                   // 13
  "http": "http-browserify",                                                                                    // 14
  "https": "https-browserify",                                                                                  // 15
  "module": null,                                                                                               // 16
  "net": null,                                                                                                  // 17
  "os": "os-browserify/browser.js",                                                                             // 18
  "path": "path-browserify",                                                                                    // 19
  "process": "process/browser.js",                                                                              // 20
  "punycode": "punycode/",                                                                                      // 21
  "querystring": "querystring-es3/",                                                                            // 22
  "readline": null,                                                                                             // 23
  "repl": null,                                                                                                 // 24
  "stream": "stream-browserify",                                                                                // 25
  "_stream_duplex": "readable-stream/duplex.js",                                                                // 26
  "_stream_passthrough": "readable-stream/passthrough.js",                                                      // 27
  "_stream_readable": "readable-stream/readable.js",                                                            // 28
  "_stream_transform": "readable-stream/transform.js",                                                          // 29
  "_stream_writable": "readable-stream/writable.js",                                                            // 30
  "string_decoder": "string_decoder/",                                                                          // 31
  "sys": "util/util.js",                                                                                        // 32
  "timers": "timers-browserify",                                                                                // 33
  "tls": null,                                                                                                  // 34
  "tty": "tty-browserify",                                                                                      // 35
  "url": "url/",                                                                                                // 36
  "util": "util/util.js",                                                                                       // 37
  "vm": "vm-browserify",                                                                                        // 38
  "zlib": "browserify-zlib"                                                                                     // 39
};                                                                                                              // 40
                                                                                                                // 41
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"deps":{"buffer.js":["buffer/",function(require){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// node_modules/meteor-node-stubs/deps/buffer.js                                                                //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
require("buffer/");                                                                                             // 1
                                                                                                                // 2
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"process.js":["process/browser.js",function(require){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// node_modules/meteor-node-stubs/deps/process.js                                                               //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
require("process/browser.js");                                                                                  // 1
                                                                                                                // 2
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"domain.js":["domain-browser",function(require){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// node_modules/meteor-node-stubs/deps/domain.js                                                                //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
require("domain-browser");                                                                                      // 1
                                                                                                                // 2
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]},"node_modules":{"buffer":{"package.json":function(require,exports){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// node_modules/meteor-node-stubs/node_modules/buffer/package.json                                              //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
exports.name = "buffer";                                                                                        // 1
exports.version = "4.5.0";                                                                                      // 2
exports.main = "index.js";                                                                                      // 3
                                                                                                                // 4
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":["base64-js","ieee754","isarray",function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// node_modules/meteor-node-stubs/node_modules/buffer/index.js                                                  //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
/*!                                                                                                             // 1
 * The buffer module from node.js, for the browser.                                                             // 2
 *                                                                                                              // 3
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>                                        // 4
 * @license  MIT                                                                                                // 5
 */                                                                                                             // 6
/* eslint-disable no-proto */                                                                                   // 7
                                                                                                                // 8
'use strict'                                                                                                    // 9
                                                                                                                // 10
var base64 = require('base64-js')                                                                               // 11
var ieee754 = require('ieee754')                                                                                // 12
var isArray = require('isarray')                                                                                // 13
                                                                                                                // 14
exports.Buffer = Buffer                                                                                         // 15
exports.SlowBuffer = SlowBuffer                                                                                 // 16
exports.INSPECT_MAX_BYTES = 50                                                                                  // 17
Buffer.poolSize = 8192 // not used by this implementation                                                       // 18
                                                                                                                // 19
var rootParent = {}                                                                                             // 20
                                                                                                                // 21
/**                                                                                                             // 22
 * If `Buffer.TYPED_ARRAY_SUPPORT`:                                                                             // 23
 *   === true    Use Uint8Array implementation (fastest)                                                        // 24
 *   === false   Use Object implementation (most compatible, even IE6)                                          // 25
 *                                                                                                              // 26
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,                           // 27
 * Opera 11.6+, iOS 4.2+.                                                                                       // 28
 *                                                                                                              // 29
 * Due to various browser bugs, sometimes the Object implementation will be used even                           // 30
 * when the browser supports typed arrays.                                                                      // 31
 *                                                                                                              // 32
 * Note:                                                                                                        // 33
 *                                                                                                              // 34
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,                          // 35
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.                                                // 36
 *                                                                                                              // 37
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.                                     // 38
 *                                                                                                              // 39
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of                       // 40
 *     incorrect length in some situations.                                                                     // 41
                                                                                                                // 42
 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they                       // 43
 * get the Object implementation, which is slower but behaves correctly.                                        // 44
 */                                                                                                             // 45
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined                                           // 46
  ? global.TYPED_ARRAY_SUPPORT                                                                                  // 47
  : typedArraySupport()                                                                                         // 48
                                                                                                                // 49
function typedArraySupport () {                                                                                 // 50
  try {                                                                                                         // 51
    var arr = new Uint8Array(1)                                                                                 // 52
    arr.foo = function () { return 42 }                                                                         // 53
    return arr.foo() === 42 && // typed array instances can be augmented                                        // 54
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`                                    // 55
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`                                       // 56
  } catch (e) {                                                                                                 // 57
    return false                                                                                                // 58
  }                                                                                                             // 59
}                                                                                                               // 60
                                                                                                                // 61
function kMaxLength () {                                                                                        // 62
  return Buffer.TYPED_ARRAY_SUPPORT                                                                             // 63
    ? 0x7fffffff                                                                                                // 64
    : 0x3fffffff                                                                                                // 65
}                                                                                                               // 66
                                                                                                                // 67
/**                                                                                                             // 68
 * The Buffer constructor returns instances of `Uint8Array` that have their                                     // 69
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of                              // 70
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods                              // 71
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it                                // 72
 * returns a single octet.                                                                                      // 73
 *                                                                                                              // 74
 * The `Uint8Array` prototype remains unmodified.                                                               // 75
 */                                                                                                             // 76
function Buffer (arg) {                                                                                         // 77
  if (!(this instanceof Buffer)) {                                                                              // 78
    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.                                    // 79
    if (arguments.length > 1) return new Buffer(arg, arguments[1])                                              // 80
    return new Buffer(arg)                                                                                      // 81
  }                                                                                                             // 82
                                                                                                                // 83
  if (!Buffer.TYPED_ARRAY_SUPPORT) {                                                                            // 84
    this.length = 0                                                                                             // 85
    this.parent = undefined                                                                                     // 86
  }                                                                                                             // 87
                                                                                                                // 88
  // Common case.                                                                                               // 89
  if (typeof arg === 'number') {                                                                                // 90
    return fromNumber(this, arg)                                                                                // 91
  }                                                                                                             // 92
                                                                                                                // 93
  // Slightly less common case.                                                                                 // 94
  if (typeof arg === 'string') {                                                                                // 95
    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')                                  // 96
  }                                                                                                             // 97
                                                                                                                // 98
  // Unusual.                                                                                                   // 99
  return fromObject(this, arg)                                                                                  // 100
}                                                                                                               // 101
                                                                                                                // 102
// TODO: Legacy, not needed anymore. Remove in next major version.                                              // 103
Buffer._augment = function (arr) {                                                                              // 104
  arr.__proto__ = Buffer.prototype                                                                              // 105
  return arr                                                                                                    // 106
}                                                                                                               // 107
                                                                                                                // 108
function fromNumber (that, length) {                                                                            // 109
  that = allocate(that, length < 0 ? 0 : checked(length) | 0)                                                   // 110
  if (!Buffer.TYPED_ARRAY_SUPPORT) {                                                                            // 111
    for (var i = 0; i < length; i++) {                                                                          // 112
      that[i] = 0                                                                                               // 113
    }                                                                                                           // 114
  }                                                                                                             // 115
  return that                                                                                                   // 116
}                                                                                                               // 117
                                                                                                                // 118
function fromString (that, string, encoding) {                                                                  // 119
  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'                                        // 120
                                                                                                                // 121
  // Assumption: byteLength() return value is always < kMaxLength.                                              // 122
  var length = byteLength(string, encoding) | 0                                                                 // 123
  that = allocate(that, length)                                                                                 // 124
                                                                                                                // 125
  that.write(string, encoding)                                                                                  // 126
  return that                                                                                                   // 127
}                                                                                                               // 128
                                                                                                                // 129
function fromObject (that, object) {                                                                            // 130
  if (Buffer.isBuffer(object)) return fromBuffer(that, object)                                                  // 131
                                                                                                                // 132
  if (isArray(object)) return fromArray(that, object)                                                           // 133
                                                                                                                // 134
  if (object == null) {                                                                                         // 135
    throw new TypeError('must start with number, buffer, array or string')                                      // 136
  }                                                                                                             // 137
                                                                                                                // 138
  if (typeof ArrayBuffer !== 'undefined') {                                                                     // 139
    if (object.buffer instanceof ArrayBuffer) {                                                                 // 140
      return fromTypedArray(that, object)                                                                       // 141
    }                                                                                                           // 142
    if (object instanceof ArrayBuffer) {                                                                        // 143
      return fromArrayBuffer(that, object)                                                                      // 144
    }                                                                                                           // 145
  }                                                                                                             // 146
                                                                                                                // 147
  if (object.length) return fromArrayLike(that, object)                                                         // 148
                                                                                                                // 149
  return fromJsonObject(that, object)                                                                           // 150
}                                                                                                               // 151
                                                                                                                // 152
function fromBuffer (that, buffer) {                                                                            // 153
  var length = checked(buffer.length) | 0                                                                       // 154
  that = allocate(that, length)                                                                                 // 155
  buffer.copy(that, 0, 0, length)                                                                               // 156
  return that                                                                                                   // 157
}                                                                                                               // 158
                                                                                                                // 159
function fromArray (that, array) {                                                                              // 160
  var length = checked(array.length) | 0                                                                        // 161
  that = allocate(that, length)                                                                                 // 162
  for (var i = 0; i < length; i += 1) {                                                                         // 163
    that[i] = array[i] & 255                                                                                    // 164
  }                                                                                                             // 165
  return that                                                                                                   // 166
}                                                                                                               // 167
                                                                                                                // 168
// Duplicate of fromArray() to keep fromArray() monomorphic.                                                    // 169
function fromTypedArray (that, array) {                                                                         // 170
  var length = checked(array.length) | 0                                                                        // 171
  that = allocate(that, length)                                                                                 // 172
  // Truncating the elements is probably not what people expect from typed                                      // 173
  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior                                    // 174
  // of the old Buffer constructor.                                                                             // 175
  for (var i = 0; i < length; i += 1) {                                                                         // 176
    that[i] = array[i] & 255                                                                                    // 177
  }                                                                                                             // 178
  return that                                                                                                   // 179
}                                                                                                               // 180
                                                                                                                // 181
function fromArrayBuffer (that, array) {                                                                        // 182
  array.byteLength // this throws if `array` is not a valid ArrayBuffer                                         // 183
                                                                                                                // 184
  if (Buffer.TYPED_ARRAY_SUPPORT) {                                                                             // 185
    // Return an augmented `Uint8Array` instance, for best performance                                          // 186
    that = new Uint8Array(array)                                                                                // 187
    that.__proto__ = Buffer.prototype                                                                           // 188
  } else {                                                                                                      // 189
    // Fallback: Return an object instance of the Buffer class                                                  // 190
    that = fromTypedArray(that, new Uint8Array(array))                                                          // 191
  }                                                                                                             // 192
  return that                                                                                                   // 193
}                                                                                                               // 194
                                                                                                                // 195
function fromArrayLike (that, array) {                                                                          // 196
  var length = checked(array.length) | 0                                                                        // 197
  that = allocate(that, length)                                                                                 // 198
  for (var i = 0; i < length; i += 1) {                                                                         // 199
    that[i] = array[i] & 255                                                                                    // 200
  }                                                                                                             // 201
  return that                                                                                                   // 202
}                                                                                                               // 203
                                                                                                                // 204
// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.                                      // 205
// Returns a zero-length buffer for inputs that don't conform to the spec.                                      // 206
function fromJsonObject (that, object) {                                                                        // 207
  var array                                                                                                     // 208
  var length = 0                                                                                                // 209
                                                                                                                // 210
  if (object.type === 'Buffer' && isArray(object.data)) {                                                       // 211
    array = object.data                                                                                         // 212
    length = checked(array.length) | 0                                                                          // 213
  }                                                                                                             // 214
  that = allocate(that, length)                                                                                 // 215
                                                                                                                // 216
  for (var i = 0; i < length; i += 1) {                                                                         // 217
    that[i] = array[i] & 255                                                                                    // 218
  }                                                                                                             // 219
  return that                                                                                                   // 220
}                                                                                                               // 221
                                                                                                                // 222
if (Buffer.TYPED_ARRAY_SUPPORT) {                                                                               // 223
  Buffer.prototype.__proto__ = Uint8Array.prototype                                                             // 224
  Buffer.__proto__ = Uint8Array                                                                                 // 225
  if (typeof Symbol !== 'undefined' && Symbol.species &&                                                        // 226
      Buffer[Symbol.species] === Buffer) {                                                                      // 227
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97                                  // 228
    Object.defineProperty(Buffer, Symbol.species, {                                                             // 229
      value: null,                                                                                              // 230
      configurable: true                                                                                        // 231
    })                                                                                                          // 232
  }                                                                                                             // 233
} else {                                                                                                        // 234
  // pre-set for values that may exist in the future                                                            // 235
  Buffer.prototype.length = undefined                                                                           // 236
  Buffer.prototype.parent = undefined                                                                           // 237
}                                                                                                               // 238
                                                                                                                // 239
function allocate (that, length) {                                                                              // 240
  if (Buffer.TYPED_ARRAY_SUPPORT) {                                                                             // 241
    // Return an augmented `Uint8Array` instance, for best performance                                          // 242
    that = new Uint8Array(length)                                                                               // 243
    that.__proto__ = Buffer.prototype                                                                           // 244
  } else {                                                                                                      // 245
    // Fallback: Return an object instance of the Buffer class                                                  // 246
    that.length = length                                                                                        // 247
  }                                                                                                             // 248
                                                                                                                // 249
  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1                                                // 250
  if (fromPool) that.parent = rootParent                                                                        // 251
                                                                                                                // 252
  return that                                                                                                   // 253
}                                                                                                               // 254
                                                                                                                // 255
function checked (length) {                                                                                     // 256
  // Note: cannot use `length < kMaxLength` here because that fails when                                        // 257
  // length is NaN (which is otherwise coerced to zero.)                                                        // 258
  if (length >= kMaxLength()) {                                                                                 // 259
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +                                    // 260
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')                                     // 261
  }                                                                                                             // 262
  return length | 0                                                                                             // 263
}                                                                                                               // 264
                                                                                                                // 265
function SlowBuffer (subject, encoding) {                                                                       // 266
  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)                                   // 267
                                                                                                                // 268
  var buf = new Buffer(subject, encoding)                                                                       // 269
  delete buf.parent                                                                                             // 270
  return buf                                                                                                    // 271
}                                                                                                               // 272
                                                                                                                // 273
Buffer.isBuffer = function isBuffer (b) {                                                                       // 274
  return !!(b != null && b._isBuffer)                                                                           // 275
}                                                                                                               // 276
                                                                                                                // 277
Buffer.compare = function compare (a, b) {                                                                      // 278
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {                                                             // 279
    throw new TypeError('Arguments must be Buffers')                                                            // 280
  }                                                                                                             // 281
                                                                                                                // 282
  if (a === b) return 0                                                                                         // 283
                                                                                                                // 284
  var x = a.length                                                                                              // 285
  var y = b.length                                                                                              // 286
                                                                                                                // 287
  var i = 0                                                                                                     // 288
  var len = Math.min(x, y)                                                                                      // 289
  while (i < len) {                                                                                             // 290
    if (a[i] !== b[i]) break                                                                                    // 291
                                                                                                                // 292
    ++i                                                                                                         // 293
  }                                                                                                             // 294
                                                                                                                // 295
  if (i !== len) {                                                                                              // 296
    x = a[i]                                                                                                    // 297
    y = b[i]                                                                                                    // 298
  }                                                                                                             // 299
                                                                                                                // 300
  if (x < y) return -1                                                                                          // 301
  if (y < x) return 1                                                                                           // 302
  return 0                                                                                                      // 303
}                                                                                                               // 304
                                                                                                                // 305
Buffer.isEncoding = function isEncoding (encoding) {                                                            // 306
  switch (String(encoding).toLowerCase()) {                                                                     // 307
    case 'hex':                                                                                                 // 308
    case 'utf8':                                                                                                // 309
    case 'utf-8':                                                                                               // 310
    case 'ascii':                                                                                               // 311
    case 'binary':                                                                                              // 312
    case 'base64':                                                                                              // 313
    case 'raw':                                                                                                 // 314
    case 'ucs2':                                                                                                // 315
    case 'ucs-2':                                                                                               // 316
    case 'utf16le':                                                                                             // 317
    case 'utf-16le':                                                                                            // 318
      return true                                                                                               // 319
    default:                                                                                                    // 320
      return false                                                                                              // 321
  }                                                                                                             // 322
}                                                                                                               // 323
                                                                                                                // 324
Buffer.concat = function concat (list, length) {                                                                // 325
  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')                         // 326
                                                                                                                // 327
  if (list.length === 0) {                                                                                      // 328
    return new Buffer(0)                                                                                        // 329
  }                                                                                                             // 330
                                                                                                                // 331
  var i                                                                                                         // 332
  if (length === undefined) {                                                                                   // 333
    length = 0                                                                                                  // 334
    for (i = 0; i < list.length; i++) {                                                                         // 335
      length += list[i].length                                                                                  // 336
    }                                                                                                           // 337
  }                                                                                                             // 338
                                                                                                                // 339
  var buf = new Buffer(length)                                                                                  // 340
  var pos = 0                                                                                                   // 341
  for (i = 0; i < list.length; i++) {                                                                           // 342
    var item = list[i]                                                                                          // 343
    item.copy(buf, pos)                                                                                         // 344
    pos += item.length                                                                                          // 345
  }                                                                                                             // 346
  return buf                                                                                                    // 347
}                                                                                                               // 348
                                                                                                                // 349
function byteLength (string, encoding) {                                                                        // 350
  if (typeof string !== 'string') string = '' + string                                                          // 351
                                                                                                                // 352
  var len = string.length                                                                                       // 353
  if (len === 0) return 0                                                                                       // 354
                                                                                                                // 355
  // Use a for loop to avoid recursion                                                                          // 356
  var loweredCase = false                                                                                       // 357
  for (;;) {                                                                                                    // 358
    switch (encoding) {                                                                                         // 359
      case 'ascii':                                                                                             // 360
      case 'binary':                                                                                            // 361
      // Deprecated                                                                                             // 362
      case 'raw':                                                                                               // 363
      case 'raws':                                                                                              // 364
        return len                                                                                              // 365
      case 'utf8':                                                                                              // 366
      case 'utf-8':                                                                                             // 367
        return utf8ToBytes(string).length                                                                       // 368
      case 'ucs2':                                                                                              // 369
      case 'ucs-2':                                                                                             // 370
      case 'utf16le':                                                                                           // 371
      case 'utf-16le':                                                                                          // 372
        return len * 2                                                                                          // 373
      case 'hex':                                                                                               // 374
        return len >>> 1                                                                                        // 375
      case 'base64':                                                                                            // 376
        return base64ToBytes(string).length                                                                     // 377
      default:                                                                                                  // 378
        if (loweredCase) return utf8ToBytes(string).length // assume utf8                                       // 379
        encoding = ('' + encoding).toLowerCase()                                                                // 380
        loweredCase = true                                                                                      // 381
    }                                                                                                           // 382
  }                                                                                                             // 383
}                                                                                                               // 384
Buffer.byteLength = byteLength                                                                                  // 385
                                                                                                                // 386
function slowToString (encoding, start, end) {                                                                  // 387
  var loweredCase = false                                                                                       // 388
                                                                                                                // 389
  start = start | 0                                                                                             // 390
  end = end === undefined || end === Infinity ? this.length : end | 0                                           // 391
                                                                                                                // 392
  if (!encoding) encoding = 'utf8'                                                                              // 393
  if (start < 0) start = 0                                                                                      // 394
  if (end > this.length) end = this.length                                                                      // 395
  if (end <= start) return ''                                                                                   // 396
                                                                                                                // 397
  while (true) {                                                                                                // 398
    switch (encoding) {                                                                                         // 399
      case 'hex':                                                                                               // 400
        return hexSlice(this, start, end)                                                                       // 401
                                                                                                                // 402
      case 'utf8':                                                                                              // 403
      case 'utf-8':                                                                                             // 404
        return utf8Slice(this, start, end)                                                                      // 405
                                                                                                                // 406
      case 'ascii':                                                                                             // 407
        return asciiSlice(this, start, end)                                                                     // 408
                                                                                                                // 409
      case 'binary':                                                                                            // 410
        return binarySlice(this, start, end)                                                                    // 411
                                                                                                                // 412
      case 'base64':                                                                                            // 413
        return base64Slice(this, start, end)                                                                    // 414
                                                                                                                // 415
      case 'ucs2':                                                                                              // 416
      case 'ucs-2':                                                                                             // 417
      case 'utf16le':                                                                                           // 418
      case 'utf-16le':                                                                                          // 419
        return utf16leSlice(this, start, end)                                                                   // 420
                                                                                                                // 421
      default:                                                                                                  // 422
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)                                   // 423
        encoding = (encoding + '').toLowerCase()                                                                // 424
        loweredCase = true                                                                                      // 425
    }                                                                                                           // 426
  }                                                                                                             // 427
}                                                                                                               // 428
                                                                                                                // 429
// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect                          // 430
// Buffer instances.                                                                                            // 431
Buffer.prototype._isBuffer = true                                                                               // 432
                                                                                                                // 433
Buffer.prototype.toString = function toString () {                                                              // 434
  var length = this.length | 0                                                                                  // 435
  if (length === 0) return ''                                                                                   // 436
  if (arguments.length === 0) return utf8Slice(this, 0, length)                                                 // 437
  return slowToString.apply(this, arguments)                                                                    // 438
}                                                                                                               // 439
                                                                                                                // 440
Buffer.prototype.equals = function equals (b) {                                                                 // 441
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')                                     // 442
  if (this === b) return true                                                                                   // 443
  return Buffer.compare(this, b) === 0                                                                          // 444
}                                                                                                               // 445
                                                                                                                // 446
Buffer.prototype.inspect = function inspect () {                                                                // 447
  var str = ''                                                                                                  // 448
  var max = exports.INSPECT_MAX_BYTES                                                                           // 449
  if (this.length > 0) {                                                                                        // 450
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')                                                 // 451
    if (this.length > max) str += ' ... '                                                                       // 452
  }                                                                                                             // 453
  return '<Buffer ' + str + '>'                                                                                 // 454
}                                                                                                               // 455
                                                                                                                // 456
Buffer.prototype.compare = function compare (b) {                                                               // 457
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')                                     // 458
  if (this === b) return 0                                                                                      // 459
  return Buffer.compare(this, b)                                                                                // 460
}                                                                                                               // 461
                                                                                                                // 462
Buffer.prototype.indexOf = function indexOf (val, byteOffset) {                                                 // 463
  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff                                                          // 464
  else if (byteOffset < -0x80000000) byteOffset = -0x80000000                                                   // 465
  byteOffset >>= 0                                                                                              // 466
                                                                                                                // 467
  if (this.length === 0) return -1                                                                              // 468
  if (byteOffset >= this.length) return -1                                                                      // 469
                                                                                                                // 470
  // Negative offsets start from the end of the buffer                                                          // 471
  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)                                        // 472
                                                                                                                // 473
  if (typeof val === 'string') {                                                                                // 474
    if (val.length === 0) return -1 // special case: looking for empty string always fails                      // 475
    return String.prototype.indexOf.call(this, val, byteOffset)                                                 // 476
  }                                                                                                             // 477
  if (Buffer.isBuffer(val)) {                                                                                   // 478
    return arrayIndexOf(this, val, byteOffset)                                                                  // 479
  }                                                                                                             // 480
  if (typeof val === 'number') {                                                                                // 481
    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {                            // 482
      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)                                           // 483
    }                                                                                                           // 484
    return arrayIndexOf(this, [ val ], byteOffset)                                                              // 485
  }                                                                                                             // 486
                                                                                                                // 487
  function arrayIndexOf (arr, val, byteOffset) {                                                                // 488
    var foundIndex = -1                                                                                         // 489
    for (var i = 0; byteOffset + i < arr.length; i++) {                                                         // 490
      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {                                // 491
        if (foundIndex === -1) foundIndex = i                                                                   // 492
        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex                                   // 493
      } else {                                                                                                  // 494
        foundIndex = -1                                                                                         // 495
      }                                                                                                         // 496
    }                                                                                                           // 497
    return -1                                                                                                   // 498
  }                                                                                                             // 499
                                                                                                                // 500
  throw new TypeError('val must be string, number or Buffer')                                                   // 501
}                                                                                                               // 502
                                                                                                                // 503
function hexWrite (buf, string, offset, length) {                                                               // 504
  offset = Number(offset) || 0                                                                                  // 505
  var remaining = buf.length - offset                                                                           // 506
  if (!length) {                                                                                                // 507
    length = remaining                                                                                          // 508
  } else {                                                                                                      // 509
    length = Number(length)                                                                                     // 510
    if (length > remaining) {                                                                                   // 511
      length = remaining                                                                                        // 512
    }                                                                                                           // 513
  }                                                                                                             // 514
                                                                                                                // 515
  // must be an even number of digits                                                                           // 516
  var strLen = string.length                                                                                    // 517
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')                                                   // 518
                                                                                                                // 519
  if (length > strLen / 2) {                                                                                    // 520
    length = strLen / 2                                                                                         // 521
  }                                                                                                             // 522
  for (var i = 0; i < length; i++) {                                                                            // 523
    var parsed = parseInt(string.substr(i * 2, 2), 16)                                                          // 524
    if (isNaN(parsed)) throw new Error('Invalid hex string')                                                    // 525
    buf[offset + i] = parsed                                                                                    // 526
  }                                                                                                             // 527
  return i                                                                                                      // 528
}                                                                                                               // 529
                                                                                                                // 530
function utf8Write (buf, string, offset, length) {                                                              // 531
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)                              // 532
}                                                                                                               // 533
                                                                                                                // 534
function asciiWrite (buf, string, offset, length) {                                                             // 535
  return blitBuffer(asciiToBytes(string), buf, offset, length)                                                  // 536
}                                                                                                               // 537
                                                                                                                // 538
function binaryWrite (buf, string, offset, length) {                                                            // 539
  return asciiWrite(buf, string, offset, length)                                                                // 540
}                                                                                                               // 541
                                                                                                                // 542
function base64Write (buf, string, offset, length) {                                                            // 543
  return blitBuffer(base64ToBytes(string), buf, offset, length)                                                 // 544
}                                                                                                               // 545
                                                                                                                // 546
function ucs2Write (buf, string, offset, length) {                                                              // 547
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)                           // 548
}                                                                                                               // 549
                                                                                                                // 550
Buffer.prototype.write = function write (string, offset, length, encoding) {                                    // 551
  // Buffer#write(string)                                                                                       // 552
  if (offset === undefined) {                                                                                   // 553
    encoding = 'utf8'                                                                                           // 554
    length = this.length                                                                                        // 555
    offset = 0                                                                                                  // 556
  // Buffer#write(string, encoding)                                                                             // 557
  } else if (length === undefined && typeof offset === 'string') {                                              // 558
    encoding = offset                                                                                           // 559
    length = this.length                                                                                        // 560
    offset = 0                                                                                                  // 561
  // Buffer#write(string, offset[, length][, encoding])                                                         // 562
  } else if (isFinite(offset)) {                                                                                // 563
    offset = offset | 0                                                                                         // 564
    if (isFinite(length)) {                                                                                     // 565
      length = length | 0                                                                                       // 566
      if (encoding === undefined) encoding = 'utf8'                                                             // 567
    } else {                                                                                                    // 568
      encoding = length                                                                                         // 569
      length = undefined                                                                                        // 570
    }                                                                                                           // 571
  // legacy write(string, encoding, offset, length) - remove in v0.13                                           // 572
  } else {                                                                                                      // 573
    var swap = encoding                                                                                         // 574
    encoding = offset                                                                                           // 575
    offset = length | 0                                                                                         // 576
    length = swap                                                                                               // 577
  }                                                                                                             // 578
                                                                                                                // 579
  var remaining = this.length - offset                                                                          // 580
  if (length === undefined || length > remaining) length = remaining                                            // 581
                                                                                                                // 582
  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {                              // 583
    throw new RangeError('attempt to write outside buffer bounds')                                              // 584
  }                                                                                                             // 585
                                                                                                                // 586
  if (!encoding) encoding = 'utf8'                                                                              // 587
                                                                                                                // 588
  var loweredCase = false                                                                                       // 589
  for (;;) {                                                                                                    // 590
    switch (encoding) {                                                                                         // 591
      case 'hex':                                                                                               // 592
        return hexWrite(this, string, offset, length)                                                           // 593
                                                                                                                // 594
      case 'utf8':                                                                                              // 595
      case 'utf-8':                                                                                             // 596
        return utf8Write(this, string, offset, length)                                                          // 597
                                                                                                                // 598
      case 'ascii':                                                                                             // 599
        return asciiWrite(this, string, offset, length)                                                         // 600
                                                                                                                // 601
      case 'binary':                                                                                            // 602
        return binaryWrite(this, string, offset, length)                                                        // 603
                                                                                                                // 604
      case 'base64':                                                                                            // 605
        // Warning: maxLength not taken into account in base64Write                                             // 606
        return base64Write(this, string, offset, length)                                                        // 607
                                                                                                                // 608
      case 'ucs2':                                                                                              // 609
      case 'ucs-2':                                                                                             // 610
      case 'utf16le':                                                                                           // 611
      case 'utf-16le':                                                                                          // 612
        return ucs2Write(this, string, offset, length)                                                          // 613
                                                                                                                // 614
      default:                                                                                                  // 615
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)                                   // 616
        encoding = ('' + encoding).toLowerCase()                                                                // 617
        loweredCase = true                                                                                      // 618
    }                                                                                                           // 619
  }                                                                                                             // 620
}                                                                                                               // 621
                                                                                                                // 622
Buffer.prototype.toJSON = function toJSON () {                                                                  // 623
  return {                                                                                                      // 624
    type: 'Buffer',                                                                                             // 625
    data: Array.prototype.slice.call(this._arr || this, 0)                                                      // 626
  }                                                                                                             // 627
}                                                                                                               // 628
                                                                                                                // 629
function base64Slice (buf, start, end) {                                                                        // 630
  if (start === 0 && end === buf.length) {                                                                      // 631
    return base64.fromByteArray(buf)                                                                            // 632
  } else {                                                                                                      // 633
    return base64.fromByteArray(buf.slice(start, end))                                                          // 634
  }                                                                                                             // 635
}                                                                                                               // 636
                                                                                                                // 637
function utf8Slice (buf, start, end) {                                                                          // 638
  end = Math.min(buf.length, end)                                                                               // 639
  var res = []                                                                                                  // 640
                                                                                                                // 641
  var i = start                                                                                                 // 642
  while (i < end) {                                                                                             // 643
    var firstByte = buf[i]                                                                                      // 644
    var codePoint = null                                                                                        // 645
    var bytesPerSequence = (firstByte > 0xEF) ? 4                                                               // 646
      : (firstByte > 0xDF) ? 3                                                                                  // 647
      : (firstByte > 0xBF) ? 2                                                                                  // 648
      : 1                                                                                                       // 649
                                                                                                                // 650
    if (i + bytesPerSequence <= end) {                                                                          // 651
      var secondByte, thirdByte, fourthByte, tempCodePoint                                                      // 652
                                                                                                                // 653
      switch (bytesPerSequence) {                                                                               // 654
        case 1:                                                                                                 // 655
          if (firstByte < 0x80) {                                                                               // 656
            codePoint = firstByte                                                                               // 657
          }                                                                                                     // 658
          break                                                                                                 // 659
        case 2:                                                                                                 // 660
          secondByte = buf[i + 1]                                                                               // 661
          if ((secondByte & 0xC0) === 0x80) {                                                                   // 662
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)                                     // 663
            if (tempCodePoint > 0x7F) {                                                                         // 664
              codePoint = tempCodePoint                                                                         // 665
            }                                                                                                   // 666
          }                                                                                                     // 667
          break                                                                                                 // 668
        case 3:                                                                                                 // 669
          secondByte = buf[i + 1]                                                                               // 670
          thirdByte = buf[i + 2]                                                                                // 671
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {                                    // 672
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)          // 673
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {                  // 674
              codePoint = tempCodePoint                                                                         // 675
            }                                                                                                   // 676
          }                                                                                                     // 677
          break                                                                                                 // 678
        case 4:                                                                                                 // 679
          secondByte = buf[i + 1]                                                                               // 680
          thirdByte = buf[i + 2]                                                                                // 681
          fourthByte = buf[i + 3]                                                                               // 682
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {    // 683
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {                                           // 685
              codePoint = tempCodePoint                                                                         // 686
            }                                                                                                   // 687
          }                                                                                                     // 688
      }                                                                                                         // 689
    }                                                                                                           // 690
                                                                                                                // 691
    if (codePoint === null) {                                                                                   // 692
      // we did not generate a valid codePoint so insert a                                                      // 693
      // replacement char (U+FFFD) and advance only 1 byte                                                      // 694
      codePoint = 0xFFFD                                                                                        // 695
      bytesPerSequence = 1                                                                                      // 696
    } else if (codePoint > 0xFFFF) {                                                                            // 697
      // encode to utf16 (surrogate pair dance)                                                                 // 698
      codePoint -= 0x10000                                                                                      // 699
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)                                                               // 700
      codePoint = 0xDC00 | codePoint & 0x3FF                                                                    // 701
    }                                                                                                           // 702
                                                                                                                // 703
    res.push(codePoint)                                                                                         // 704
    i += bytesPerSequence                                                                                       // 705
  }                                                                                                             // 706
                                                                                                                // 707
  return decodeCodePointsArray(res)                                                                             // 708
}                                                                                                               // 709
                                                                                                                // 710
// Based on http://stackoverflow.com/a/22747272/680742, the browser with                                        // 711
// the lowest limit is Chrome, with 0x10000 args.                                                               // 712
// We go 1 magnitude less, for safety                                                                           // 713
var MAX_ARGUMENTS_LENGTH = 0x1000                                                                               // 714
                                                                                                                // 715
function decodeCodePointsArray (codePoints) {                                                                   // 716
  var len = codePoints.length                                                                                   // 717
  if (len <= MAX_ARGUMENTS_LENGTH) {                                                                            // 718
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()                                 // 719
  }                                                                                                             // 720
                                                                                                                // 721
  // Decode in chunks to avoid "call stack size exceeded".                                                      // 722
  var res = ''                                                                                                  // 723
  var i = 0                                                                                                     // 724
  while (i < len) {                                                                                             // 725
    res += String.fromCharCode.apply(                                                                           // 726
      String,                                                                                                   // 727
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)                                                            // 728
    )                                                                                                           // 729
  }                                                                                                             // 730
  return res                                                                                                    // 731
}                                                                                                               // 732
                                                                                                                // 733
function asciiSlice (buf, start, end) {                                                                         // 734
  var ret = ''                                                                                                  // 735
  end = Math.min(buf.length, end)                                                                               // 736
                                                                                                                // 737
  for (var i = start; i < end; i++) {                                                                           // 738
    ret += String.fromCharCode(buf[i] & 0x7F)                                                                   // 739
  }                                                                                                             // 740
  return ret                                                                                                    // 741
}                                                                                                               // 742
                                                                                                                // 743
function binarySlice (buf, start, end) {                                                                        // 744
  var ret = ''                                                                                                  // 745
  end = Math.min(buf.length, end)                                                                               // 746
                                                                                                                // 747
  for (var i = start; i < end; i++) {                                                                           // 748
    ret += String.fromCharCode(buf[i])                                                                          // 749
  }                                                                                                             // 750
  return ret                                                                                                    // 751
}                                                                                                               // 752
                                                                                                                // 753
function hexSlice (buf, start, end) {                                                                           // 754
  var len = buf.length                                                                                          // 755
                                                                                                                // 756
  if (!start || start < 0) start = 0                                                                            // 757
  if (!end || end < 0 || end > len) end = len                                                                   // 758
                                                                                                                // 759
  var out = ''                                                                                                  // 760
  for (var i = start; i < end; i++) {                                                                           // 761
    out += toHex(buf[i])                                                                                        // 762
  }                                                                                                             // 763
  return out                                                                                                    // 764
}                                                                                                               // 765
                                                                                                                // 766
function utf16leSlice (buf, start, end) {                                                                       // 767
  var bytes = buf.slice(start, end)                                                                             // 768
  var res = ''                                                                                                  // 769
  for (var i = 0; i < bytes.length; i += 2) {                                                                   // 770
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)                                                   // 771
  }                                                                                                             // 772
  return res                                                                                                    // 773
}                                                                                                               // 774
                                                                                                                // 775
Buffer.prototype.slice = function slice (start, end) {                                                          // 776
  var len = this.length                                                                                         // 777
  start = ~~start                                                                                               // 778
  end = end === undefined ? len : ~~end                                                                         // 779
                                                                                                                // 780
  if (start < 0) {                                                                                              // 781
    start += len                                                                                                // 782
    if (start < 0) start = 0                                                                                    // 783
  } else if (start > len) {                                                                                     // 784
    start = len                                                                                                 // 785
  }                                                                                                             // 786
                                                                                                                // 787
  if (end < 0) {                                                                                                // 788
    end += len                                                                                                  // 789
    if (end < 0) end = 0                                                                                        // 790
  } else if (end > len) {                                                                                       // 791
    end = len                                                                                                   // 792
  }                                                                                                             // 793
                                                                                                                // 794
  if (end < start) end = start                                                                                  // 795
                                                                                                                // 796
  var newBuf                                                                                                    // 797
  if (Buffer.TYPED_ARRAY_SUPPORT) {                                                                             // 798
    newBuf = this.subarray(start, end)                                                                          // 799
    newBuf.__proto__ = Buffer.prototype                                                                         // 800
  } else {                                                                                                      // 801
    var sliceLen = end - start                                                                                  // 802
    newBuf = new Buffer(sliceLen, undefined)                                                                    // 803
    for (var i = 0; i < sliceLen; i++) {                                                                        // 804
      newBuf[i] = this[i + start]                                                                               // 805
    }                                                                                                           // 806
  }                                                                                                             // 807
                                                                                                                // 808
  if (newBuf.length) newBuf.parent = this.parent || this                                                        // 809
                                                                                                                // 810
  return newBuf                                                                                                 // 811
}                                                                                                               // 812
                                                                                                                // 813
/*                                                                                                              // 814
 * Need to make sure that buffer isn't trying to write out of bounds.                                           // 815
 */                                                                                                             // 816
function checkOffset (offset, ext, length) {                                                                    // 817
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')                              // 818
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')                      // 819
}                                                                                                               // 820
                                                                                                                // 821
Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {                              // 822
  offset = offset | 0                                                                                           // 823
  byteLength = byteLength | 0                                                                                   // 824
  if (!noAssert) checkOffset(offset, byteLength, this.length)                                                   // 825
                                                                                                                // 826
  var val = this[offset]                                                                                        // 827
  var mul = 1                                                                                                   // 828
  var i = 0                                                                                                     // 829
  while (++i < byteLength && (mul *= 0x100)) {                                                                  // 830
    val += this[offset + i] * mul                                                                               // 831
  }                                                                                                             // 832
                                                                                                                // 833
  return val                                                                                                    // 834
}                                                                                                               // 835
                                                                                                                // 836
Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {                              // 837
  offset = offset | 0                                                                                           // 838
  byteLength = byteLength | 0                                                                                   // 839
  if (!noAssert) {                                                                                              // 840
    checkOffset(offset, byteLength, this.length)                                                                // 841
  }                                                                                                             // 842
                                                                                                                // 843
  var val = this[offset + --byteLength]                                                                         // 844
  var mul = 1                                                                                                   // 845
  while (byteLength > 0 && (mul *= 0x100)) {                                                                    // 846
    val += this[offset + --byteLength] * mul                                                                    // 847
  }                                                                                                             // 848
                                                                                                                // 849
  return val                                                                                                    // 850
}                                                                                                               // 851
                                                                                                                // 852
Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {                                            // 853
  if (!noAssert) checkOffset(offset, 1, this.length)                                                            // 854
  return this[offset]                                                                                           // 855
}                                                                                                               // 856
                                                                                                                // 857
Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {                                      // 858
  if (!noAssert) checkOffset(offset, 2, this.length)                                                            // 859
  return this[offset] | (this[offset + 1] << 8)                                                                 // 860
}                                                                                                               // 861
                                                                                                                // 862
Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {                                      // 863
  if (!noAssert) checkOffset(offset, 2, this.length)                                                            // 864
  return (this[offset] << 8) | this[offset + 1]                                                                 // 865
}                                                                                                               // 866
                                                                                                                // 867
Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {                                      // 868
  if (!noAssert) checkOffset(offset, 4, this.length)                                                            // 869
                                                                                                                // 870
  return ((this[offset]) |                                                                                      // 871
      (this[offset + 1] << 8) |                                                                                 // 872
      (this[offset + 2] << 16)) +                                                                               // 873
      (this[offset + 3] * 0x1000000)                                                                            // 874
}                                                                                                               // 875
                                                                                                                // 876
Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {                                      // 877
  if (!noAssert) checkOffset(offset, 4, this.length)                                                            // 878
                                                                                                                // 879
  return (this[offset] * 0x1000000) +                                                                           // 880
    ((this[offset + 1] << 16) |                                                                                 // 881
    (this[offset + 2] << 8) |                                                                                   // 882
    this[offset + 3])                                                                                           // 883
}                                                                                                               // 884
                                                                                                                // 885
Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {                                // 886
  offset = offset | 0                                                                                           // 887
  byteLength = byteLength | 0                                                                                   // 888
  if (!noAssert) checkOffset(offset, byteLength, this.length)                                                   // 889
                                                                                                                // 890
  var val = this[offset]                                                                                        // 891
  var mul = 1                                                                                                   // 892
  var i = 0                                                                                                     // 893
  while (++i < byteLength && (mul *= 0x100)) {                                                                  // 894
    val += this[offset + i] * mul                                                                               // 895
  }                                                                                                             // 896
  mul *= 0x80                                                                                                   // 897
                                                                                                                // 898
  if (val >= mul) val -= Math.pow(2, 8 * byteLength)                                                            // 899
                                                                                                                // 900
  return val                                                                                                    // 901
}                                                                                                               // 902
                                                                                                                // 903
Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {                                // 904
  offset = offset | 0                                                                                           // 905
  byteLength = byteLength | 0                                                                                   // 906
  if (!noAssert) checkOffset(offset, byteLength, this.length)                                                   // 907
                                                                                                                // 908
  var i = byteLength                                                                                            // 909
  var mul = 1                                                                                                   // 910
  var val = this[offset + --i]                                                                                  // 911
  while (i > 0 && (mul *= 0x100)) {                                                                             // 912
    val += this[offset + --i] * mul                                                                             // 913
  }                                                                                                             // 914
  mul *= 0x80                                                                                                   // 915
                                                                                                                // 916
  if (val >= mul) val -= Math.pow(2, 8 * byteLength)                                                            // 917
                                                                                                                // 918
  return val                                                                                                    // 919
}                                                                                                               // 920
                                                                                                                // 921
Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {                                              // 922
  if (!noAssert) checkOffset(offset, 1, this.length)                                                            // 923
  if (!(this[offset] & 0x80)) return (this[offset])                                                             // 924
  return ((0xff - this[offset] + 1) * -1)                                                                       // 925
}                                                                                                               // 926
                                                                                                                // 927
Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {                                        // 928
  if (!noAssert) checkOffset(offset, 2, this.length)                                                            // 929
  var val = this[offset] | (this[offset + 1] << 8)                                                              // 930
  return (val & 0x8000) ? val | 0xFFFF0000 : val                                                                // 931
}                                                                                                               // 932
                                                                                                                // 933
Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {                                        // 934
  if (!noAssert) checkOffset(offset, 2, this.length)                                                            // 935
  var val = this[offset + 1] | (this[offset] << 8)                                                              // 936
  return (val & 0x8000) ? val | 0xFFFF0000 : val                                                                // 937
}                                                                                                               // 938
                                                                                                                // 939
Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {                                        // 940
  if (!noAssert) checkOffset(offset, 4, this.length)                                                            // 941
                                                                                                                // 942
  return (this[offset]) |                                                                                       // 943
    (this[offset + 1] << 8) |                                                                                   // 944
    (this[offset + 2] << 16) |                                                                                  // 945
    (this[offset + 3] << 24)                                                                                    // 946
}                                                                                                               // 947
                                                                                                                // 948
Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {                                        // 949
  if (!noAssert) checkOffset(offset, 4, this.length)                                                            // 950
                                                                                                                // 951
  return (this[offset] << 24) |                                                                                 // 952
    (this[offset + 1] << 16) |                                                                                  // 953
    (this[offset + 2] << 8) |                                                                                   // 954
    (this[offset + 3])                                                                                          // 955
}                                                                                                               // 956
                                                                                                                // 957
Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {                                        // 958
  if (!noAssert) checkOffset(offset, 4, this.length)                                                            // 959
  return ieee754.read(this, offset, true, 23, 4)                                                                // 960
}                                                                                                               // 961
                                                                                                                // 962
Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {                                        // 963
  if (!noAssert) checkOffset(offset, 4, this.length)                                                            // 964
  return ieee754.read(this, offset, false, 23, 4)                                                               // 965
}                                                                                                               // 966
                                                                                                                // 967
Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {                                      // 968
  if (!noAssert) checkOffset(offset, 8, this.length)                                                            // 969
  return ieee754.read(this, offset, true, 52, 8)                                                                // 970
}                                                                                                               // 971
                                                                                                                // 972
Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {                                      // 973
  if (!noAssert) checkOffset(offset, 8, this.length)                                                            // 974
  return ieee754.read(this, offset, false, 52, 8)                                                               // 975
}                                                                                                               // 976
                                                                                                                // 977
function checkInt (buf, value, offset, ext, max, min) {                                                         // 978
  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')                            // 979
  if (value > max || value < min) throw new RangeError('value is out of bounds')                                // 980
  if (offset + ext > buf.length) throw new RangeError('index out of range')                                     // 981
}                                                                                                               // 982
                                                                                                                // 983
Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {                     // 984
  value = +value                                                                                                // 985
  offset = offset | 0                                                                                           // 986
  byteLength = byteLength | 0                                                                                   // 987
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)                      // 988
                                                                                                                // 989
  var mul = 1                                                                                                   // 990
  var i = 0                                                                                                     // 991
  this[offset] = value & 0xFF                                                                                   // 992
  while (++i < byteLength && (mul *= 0x100)) {                                                                  // 993
    this[offset + i] = (value / mul) & 0xFF                                                                     // 994
  }                                                                                                             // 995
                                                                                                                // 996
  return offset + byteLength                                                                                    // 997
}                                                                                                               // 998
                                                                                                                // 999
Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {                     // 1000
  value = +value                                                                                                // 1001
  offset = offset | 0                                                                                           // 1002
  byteLength = byteLength | 0                                                                                   // 1003
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)                      // 1004
                                                                                                                // 1005
  var i = byteLength - 1                                                                                        // 1006
  var mul = 1                                                                                                   // 1007
  this[offset + i] = value & 0xFF                                                                               // 1008
  while (--i >= 0 && (mul *= 0x100)) {                                                                          // 1009
    this[offset + i] = (value / mul) & 0xFF                                                                     // 1010
  }                                                                                                             // 1011
                                                                                                                // 1012
  return offset + byteLength                                                                                    // 1013
}                                                                                                               // 1014
                                                                                                                // 1015
Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {                                   // 1016
  value = +value                                                                                                // 1017
  offset = offset | 0                                                                                           // 1018
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)                                                      // 1019
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)                                                    // 1020
  this[offset] = (value & 0xff)                                                                                 // 1021
  return offset + 1                                                                                             // 1022
}                                                                                                               // 1023
                                                                                                                // 1024
function objectWriteUInt16 (buf, value, offset, littleEndian) {                                                 // 1025
  if (value < 0) value = 0xffff + value + 1                                                                     // 1026
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {                                           // 1027
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>                                  // 1028
      (littleEndian ? i : 1 - i) * 8                                                                            // 1029
  }                                                                                                             // 1030
}                                                                                                               // 1031
                                                                                                                // 1032
Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {                             // 1033
  value = +value                                                                                                // 1034
  offset = offset | 0                                                                                           // 1035
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)                                                    // 1036
  if (Buffer.TYPED_ARRAY_SUPPORT) {                                                                             // 1037
    this[offset] = (value & 0xff)                                                                               // 1038
    this[offset + 1] = (value >>> 8)                                                                            // 1039
  } else {                                                                                                      // 1040
    objectWriteUInt16(this, value, offset, true)                                                                // 1041
  }                                                                                                             // 1042
  return offset + 2                                                                                             // 1043
}                                                                                                               // 1044
                                                                                                                // 1045
Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {                             // 1046
  value = +value                                                                                                // 1047
  offset = offset | 0                                                                                           // 1048
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)                                                    // 1049
  if (Buffer.TYPED_ARRAY_SUPPORT) {                                                                             // 1050
    this[offset] = (value >>> 8)                                                                                // 1051
    this[offset + 1] = (value & 0xff)                                                                           // 1052
  } else {                                                                                                      // 1053
    objectWriteUInt16(this, value, offset, false)                                                               // 1054
  }                                                                                                             // 1055
  return offset + 2                                                                                             // 1056
}                                                                                                               // 1057
                                                                                                                // 1058
function objectWriteUInt32 (buf, value, offset, littleEndian) {                                                 // 1059
  if (value < 0) value = 0xffffffff + value + 1                                                                 // 1060
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {                                           // 1061
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff                                         // 1062
  }                                                                                                             // 1063
}                                                                                                               // 1064
                                                                                                                // 1065
Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {                             // 1066
  value = +value                                                                                                // 1067
  offset = offset | 0                                                                                           // 1068
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)                                                // 1069
  if (Buffer.TYPED_ARRAY_SUPPORT) {                                                                             // 1070
    this[offset + 3] = (value >>> 24)                                                                           // 1071
    this[offset + 2] = (value >>> 16)                                                                           // 1072
    this[offset + 1] = (value >>> 8)                                                                            // 1073
    this[offset] = (value & 0xff)                                                                               // 1074
  } else {                                                                                                      // 1075
    objectWriteUInt32(this, value, offset, true)                                                                // 1076
  }                                                                                                             // 1077
  return offset + 4                                                                                             // 1078
}                                                                                                               // 1079
                                                                                                                // 1080
Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {                             // 1081
  value = +value                                                                                                // 1082
  offset = offset | 0                                                                                           // 1083
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)                                                // 1084
  if (Buffer.TYPED_ARRAY_SUPPORT) {                                                                             // 1085
    this[offset] = (value >>> 24)                                                                               // 1086
    this[offset + 1] = (value >>> 16)                                                                           // 1087
    this[offset + 2] = (value >>> 8)                                                                            // 1088
    this[offset + 3] = (value & 0xff)                                                                           // 1089
  } else {                                                                                                      // 1090
    objectWriteUInt32(this, value, offset, false)                                                               // 1091
  }                                                                                                             // 1092
  return offset + 4                                                                                             // 1093
}                                                                                                               // 1094
                                                                                                                // 1095
Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {                       // 1096
  value = +value                                                                                                // 1097
  offset = offset | 0                                                                                           // 1098
  if (!noAssert) {                                                                                              // 1099
    var limit = Math.pow(2, 8 * byteLength - 1)                                                                 // 1100
                                                                                                                // 1101
    checkInt(this, value, offset, byteLength, limit - 1, -limit)                                                // 1102
  }                                                                                                             // 1103
                                                                                                                // 1104
  var i = 0                                                                                                     // 1105
  var mul = 1                                                                                                   // 1106
  var sub = value < 0 ? 1 : 0                                                                                   // 1107
  this[offset] = value & 0xFF                                                                                   // 1108
  while (++i < byteLength && (mul *= 0x100)) {                                                                  // 1109
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF                                                        // 1110
  }                                                                                                             // 1111
                                                                                                                // 1112
  return offset + byteLength                                                                                    // 1113
}                                                                                                               // 1114
                                                                                                                // 1115
Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {                       // 1116
  value = +value                                                                                                // 1117
  offset = offset | 0                                                                                           // 1118
  if (!noAssert) {                                                                                              // 1119
    var limit = Math.pow(2, 8 * byteLength - 1)                                                                 // 1120
                                                                                                                // 1121
    checkInt(this, value, offset, byteLength, limit - 1, -limit)                                                // 1122
  }                                                                                                             // 1123
                                                                                                                // 1124
  var i = byteLength - 1                                                                                        // 1125
  var mul = 1                                                                                                   // 1126
  var sub = value < 0 ? 1 : 0                                                                                   // 1127
  this[offset + i] = value & 0xFF                                                                               // 1128
  while (--i >= 0 && (mul *= 0x100)) {                                                                          // 1129
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF                                                        // 1130
  }                                                                                                             // 1131
                                                                                                                // 1132
  return offset + byteLength                                                                                    // 1133
}                                                                                                               // 1134
                                                                                                                // 1135
Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {                                     // 1136
  value = +value                                                                                                // 1137
  offset = offset | 0                                                                                           // 1138
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)                                                  // 1139
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)                                                    // 1140
  if (value < 0) value = 0xff + value + 1                                                                       // 1141
  this[offset] = (value & 0xff)                                                                                 // 1142
  return offset + 1                                                                                             // 1143
}                                                                                                               // 1144
                                                                                                                // 1145
Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {                               // 1146
  value = +value                                                                                                // 1147
  offset = offset | 0                                                                                           // 1148
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)                                              // 1149
  if (Buffer.TYPED_ARRAY_SUPPORT) {                                                                             // 1150
    this[offset] = (value & 0xff)                                                                               // 1151
    this[offset + 1] = (value >>> 8)                                                                            // 1152
  } else {                                                                                                      // 1153
    objectWriteUInt16(this, value, offset, true)                                                                // 1154
  }                                                                                                             // 1155
  return offset + 2                                                                                             // 1156
}                                                                                                               // 1157
                                                                                                                // 1158
Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {                               // 1159
  value = +value                                                                                                // 1160
  offset = offset | 0                                                                                           // 1161
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)                                              // 1162
  if (Buffer.TYPED_ARRAY_SUPPORT) {                                                                             // 1163
    this[offset] = (value >>> 8)                                                                                // 1164
    this[offset + 1] = (value & 0xff)                                                                           // 1165
  } else {                                                                                                      // 1166
    objectWriteUInt16(this, value, offset, false)                                                               // 1167
  }                                                                                                             // 1168
  return offset + 2                                                                                             // 1169
}                                                                                                               // 1170
                                                                                                                // 1171
Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {                               // 1172
  value = +value                                                                                                // 1173
  offset = offset | 0                                                                                           // 1174
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)                                      // 1175
  if (Buffer.TYPED_ARRAY_SUPPORT) {                                                                             // 1176
    this[offset] = (value & 0xff)                                                                               // 1177
    this[offset + 1] = (value >>> 8)                                                                            // 1178
    this[offset + 2] = (value >>> 16)                                                                           // 1179
    this[offset + 3] = (value >>> 24)                                                                           // 1180
  } else {                                                                                                      // 1181
    objectWriteUInt32(this, value, offset, true)                                                                // 1182
  }                                                                                                             // 1183
  return offset + 4                                                                                             // 1184
}                                                                                                               // 1185
                                                                                                                // 1186
Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {                               // 1187
  value = +value                                                                                                // 1188
  offset = offset | 0                                                                                           // 1189
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)                                      // 1190
  if (value < 0) value = 0xffffffff + value + 1                                                                 // 1191
  if (Buffer.TYPED_ARRAY_SUPPORT) {                                                                             // 1192
    this[offset] = (value >>> 24)                                                                               // 1193
    this[offset + 1] = (value >>> 16)                                                                           // 1194
    this[offset + 2] = (value >>> 8)                                                                            // 1195
    this[offset + 3] = (value & 0xff)                                                                           // 1196
  } else {                                                                                                      // 1197
    objectWriteUInt32(this, value, offset, false)                                                               // 1198
  }                                                                                                             // 1199
  return offset + 4                                                                                             // 1200
}                                                                                                               // 1201
                                                                                                                // 1202
function checkIEEE754 (buf, value, offset, ext, max, min) {                                                     // 1203
  if (offset + ext > buf.length) throw new RangeError('index out of range')                                     // 1204
  if (offset < 0) throw new RangeError('index out of range')                                                    // 1205
}                                                                                                               // 1206
                                                                                                                // 1207
function writeFloat (buf, value, offset, littleEndian, noAssert) {                                              // 1208
  if (!noAssert) {                                                                                              // 1209
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)                        // 1210
  }                                                                                                             // 1211
  ieee754.write(buf, value, offset, littleEndian, 23, 4)                                                        // 1212
  return offset + 4                                                                                             // 1213
}                                                                                                               // 1214
                                                                                                                // 1215
Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {                               // 1216
  return writeFloat(this, value, offset, true, noAssert)                                                        // 1217
}                                                                                                               // 1218
                                                                                                                // 1219
Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {                               // 1220
  return writeFloat(this, value, offset, false, noAssert)                                                       // 1221
}                                                                                                               // 1222
                                                                                                                // 1223
function writeDouble (buf, value, offset, littleEndian, noAssert) {                                             // 1224
  if (!noAssert) {                                                                                              // 1225
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)                      // 1226
  }                                                                                                             // 1227
  ieee754.write(buf, value, offset, littleEndian, 52, 8)                                                        // 1228
  return offset + 8                                                                                             // 1229
}                                                                                                               // 1230
                                                                                                                // 1231
Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {                             // 1232
  return writeDouble(this, value, offset, true, noAssert)                                                       // 1233
}                                                                                                               // 1234
                                                                                                                // 1235
Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {                             // 1236
  return writeDouble(this, value, offset, false, noAssert)                                                      // 1237
}                                                                                                               // 1238
                                                                                                                // 1239
// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)                                    // 1240
Buffer.prototype.copy = function copy (target, targetStart, start, end) {                                       // 1241
  if (!start) start = 0                                                                                         // 1242
  if (!end && end !== 0) end = this.length                                                                      // 1243
  if (targetStart >= target.length) targetStart = target.length                                                 // 1244
  if (!targetStart) targetStart = 0                                                                             // 1245
  if (end > 0 && end < start) end = start                                                                       // 1246
                                                                                                                // 1247
  // Copy 0 bytes; we're done                                                                                   // 1248
  if (end === start) return 0                                                                                   // 1249
  if (target.length === 0 || this.length === 0) return 0                                                        // 1250
                                                                                                                // 1251
  // Fatal error conditions                                                                                     // 1252
  if (targetStart < 0) {                                                                                        // 1253
    throw new RangeError('targetStart out of bounds')                                                           // 1254
  }                                                                                                             // 1255
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')                      // 1256
  if (end < 0) throw new RangeError('sourceEnd out of bounds')                                                  // 1257
                                                                                                                // 1258
  // Are we oob?                                                                                                // 1259
  if (end > this.length) end = this.length                                                                      // 1260
  if (target.length - targetStart < end - start) {                                                              // 1261
    end = target.length - targetStart + start                                                                   // 1262
  }                                                                                                             // 1263
                                                                                                                // 1264
  var len = end - start                                                                                         // 1265
  var i                                                                                                         // 1266
                                                                                                                // 1267
  if (this === target && start < targetStart && targetStart < end) {                                            // 1268
    // descending copy from end                                                                                 // 1269
    for (i = len - 1; i >= 0; i--) {                                                                            // 1270
      target[i + targetStart] = this[i + start]                                                                 // 1271
    }                                                                                                           // 1272
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {                                                       // 1273
    // ascending copy from start                                                                                // 1274
    for (i = 0; i < len; i++) {                                                                                 // 1275
      target[i + targetStart] = this[i + start]                                                                 // 1276
    }                                                                                                           // 1277
  } else {                                                                                                      // 1278
    Uint8Array.prototype.set.call(                                                                              // 1279
      target,                                                                                                   // 1280
      this.subarray(start, start + len),                                                                        // 1281
      targetStart                                                                                               // 1282
    )                                                                                                           // 1283
  }                                                                                                             // 1284
                                                                                                                // 1285
  return len                                                                                                    // 1286
}                                                                                                               // 1287
                                                                                                                // 1288
// fill(value, start=0, end=buffer.length)                                                                      // 1289
Buffer.prototype.fill = function fill (value, start, end) {                                                     // 1290
  if (!value) value = 0                                                                                         // 1291
  if (!start) start = 0                                                                                         // 1292
  if (!end) end = this.length                                                                                   // 1293
                                                                                                                // 1294
  if (end < start) throw new RangeError('end < start')                                                          // 1295
                                                                                                                // 1296
  // Fill 0 bytes; we're done                                                                                   // 1297
  if (end === start) return                                                                                     // 1298
  if (this.length === 0) return                                                                                 // 1299
                                                                                                                // 1300
  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')                            // 1301
  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')                                   // 1302
                                                                                                                // 1303
  var i                                                                                                         // 1304
  if (typeof value === 'number') {                                                                              // 1305
    for (i = start; i < end; i++) {                                                                             // 1306
      this[i] = value                                                                                           // 1307
    }                                                                                                           // 1308
  } else {                                                                                                      // 1309
    var bytes = utf8ToBytes(value.toString())                                                                   // 1310
    var len = bytes.length                                                                                      // 1311
    for (i = start; i < end; i++) {                                                                             // 1312
      this[i] = bytes[i % len]                                                                                  // 1313
    }                                                                                                           // 1314
  }                                                                                                             // 1315
                                                                                                                // 1316
  return this                                                                                                   // 1317
}                                                                                                               // 1318
                                                                                                                // 1319
// HELPER FUNCTIONS                                                                                             // 1320
// ================                                                                                             // 1321
                                                                                                                // 1322
var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g                                                                    // 1323
                                                                                                                // 1324
function base64clean (str) {                                                                                    // 1325
  // Node strips out invalid characters like \n and \t from the string, base64-js does not                      // 1326
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')                                                          // 1327
  // Node converts strings with length < 2 to ''                                                                // 1328
  if (str.length < 2) return ''                                                                                 // 1329
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not                       // 1330
  while (str.length % 4 !== 0) {                                                                                // 1331
    str = str + '='                                                                                             // 1332
  }                                                                                                             // 1333
  return str                                                                                                    // 1334
}                                                                                                               // 1335
                                                                                                                // 1336
function stringtrim (str) {                                                                                     // 1337
  if (str.trim) return str.trim()                                                                               // 1338
  return str.replace(/^\s+|\s+$/g, '')                                                                          // 1339
}                                                                                                               // 1340
                                                                                                                // 1341
function toHex (n) {                                                                                            // 1342
  if (n < 16) return '0' + n.toString(16)                                                                       // 1343
  return n.toString(16)                                                                                         // 1344
}                                                                                                               // 1345
                                                                                                                // 1346
function utf8ToBytes (string, units) {                                                                          // 1347
  units = units || Infinity                                                                                     // 1348
  var codePoint                                                                                                 // 1349
  var length = string.length                                                                                    // 1350
  var leadSurrogate = null                                                                                      // 1351
  var bytes = []                                                                                                // 1352
                                                                                                                // 1353
  for (var i = 0; i < length; i++) {                                                                            // 1354
    codePoint = string.charCodeAt(i)                                                                            // 1355
                                                                                                                // 1356
    // is surrogate component                                                                                   // 1357
    if (codePoint > 0xD7FF && codePoint < 0xE000) {                                                             // 1358
      // last char was a lead                                                                                   // 1359
      if (!leadSurrogate) {                                                                                     // 1360
        // no lead yet                                                                                          // 1361
        if (codePoint > 0xDBFF) {                                                                               // 1362
          // unexpected trail                                                                                   // 1363
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)                                                   // 1364
          continue                                                                                              // 1365
        } else if (i + 1 === length) {                                                                          // 1366
          // unpaired lead                                                                                      // 1367
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)                                                   // 1368
          continue                                                                                              // 1369
        }                                                                                                       // 1370
                                                                                                                // 1371
        // valid lead                                                                                           // 1372
        leadSurrogate = codePoint                                                                               // 1373
                                                                                                                // 1374
        continue                                                                                                // 1375
      }                                                                                                         // 1376
                                                                                                                // 1377
      // 2 leads in a row                                                                                       // 1378
      if (codePoint < 0xDC00) {                                                                                 // 1379
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)                                                     // 1380
        leadSurrogate = codePoint                                                                               // 1381
        continue                                                                                                // 1382
      }                                                                                                         // 1383
                                                                                                                // 1384
      // valid surrogate pair                                                                                   // 1385
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000                                 // 1386
    } else if (leadSurrogate) {                                                                                 // 1387
      // valid bmp char, but last char was a lead                                                               // 1388
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)                                                       // 1389
    }                                                                                                           // 1390
                                                                                                                // 1391
    leadSurrogate = null                                                                                        // 1392
                                                                                                                // 1393
    // encode utf8                                                                                              // 1394
    if (codePoint < 0x80) {                                                                                     // 1395
      if ((units -= 1) < 0) break                                                                               // 1396
      bytes.push(codePoint)                                                                                     // 1397
    } else if (codePoint < 0x800) {                                                                             // 1398
      if ((units -= 2) < 0) break                                                                               // 1399
      bytes.push(                                                                                               // 1400
        codePoint >> 0x6 | 0xC0,                                                                                // 1401
        codePoint & 0x3F | 0x80                                                                                 // 1402
      )                                                                                                         // 1403
    } else if (codePoint < 0x10000) {                                                                           // 1404
      if ((units -= 3) < 0) break                                                                               // 1405
      bytes.push(                                                                                               // 1406
        codePoint >> 0xC | 0xE0,                                                                                // 1407
        codePoint >> 0x6 & 0x3F | 0x80,                                                                         // 1408
        codePoint & 0x3F | 0x80                                                                                 // 1409
      )                                                                                                         // 1410
    } else if (codePoint < 0x110000) {                                                                          // 1411
      if ((units -= 4) < 0) break                                                                               // 1412
      bytes.push(                                                                                               // 1413
        codePoint >> 0x12 | 0xF0,                                                                               // 1414
        codePoint >> 0xC & 0x3F | 0x80,                                                                         // 1415
        codePoint >> 0x6 & 0x3F | 0x80,                                                                         // 1416
        codePoint & 0x3F | 0x80                                                                                 // 1417
      )                                                                                                         // 1418
    } else {                                                                                                    // 1419
      throw new Error('Invalid code point')                                                                     // 1420
    }                                                                                                           // 1421
  }                                                                                                             // 1422
                                                                                                                // 1423
  return bytes                                                                                                  // 1424
}                                                                                                               // 1425
                                                                                                                // 1426
function asciiToBytes (str) {                                                                                   // 1427
  var byteArray = []                                                                                            // 1428
  for (var i = 0; i < str.length; i++) {                                                                        // 1429
    // Node's code seems to be doing this and not & 0x7F..                                                      // 1430
    byteArray.push(str.charCodeAt(i) & 0xFF)                                                                    // 1431
  }                                                                                                             // 1432
  return byteArray                                                                                              // 1433
}                                                                                                               // 1434
                                                                                                                // 1435
function utf16leToBytes (str, units) {                                                                          // 1436
  var c, hi, lo                                                                                                 // 1437
  var byteArray = []                                                                                            // 1438
  for (var i = 0; i < str.length; i++) {                                                                        // 1439
    if ((units -= 2) < 0) break                                                                                 // 1440
                                                                                                                // 1441
    c = str.charCodeAt(i)                                                                                       // 1442
    hi = c >> 8                                                                                                 // 1443
    lo = c % 256                                                                                                // 1444
    byteArray.push(lo)                                                                                          // 1445
    byteArray.push(hi)                                                                                          // 1446
  }                                                                                                             // 1447
                                                                                                                // 1448
  return byteArray                                                                                              // 1449
}                                                                                                               // 1450
                                                                                                                // 1451
function base64ToBytes (str) {                                                                                  // 1452
  return base64.toByteArray(base64clean(str))                                                                   // 1453
}                                                                                                               // 1454
                                                                                                                // 1455
function blitBuffer (src, dst, offset, length) {                                                                // 1456
  for (var i = 0; i < length; i++) {                                                                            // 1457
    if ((i + offset >= dst.length) || (i >= src.length)) break                                                  // 1458
    dst[i + offset] = src[i]                                                                                    // 1459
  }                                                                                                             // 1460
  return i                                                                                                      // 1461
}                                                                                                               // 1462
                                                                                                                // 1463
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]},"base64-js":{"package.json":function(require,exports){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// node_modules/meteor-node-stubs/node_modules/base64-js/package.json                                           //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
exports.name = "base64-js";                                                                                     // 1
exports.version = "1.0.4";                                                                                      // 2
exports.main = "lib/b64.js";                                                                                    // 3
                                                                                                                // 4
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"b64.js":function(require,exports){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// node_modules/meteor-node-stubs/node_modules/base64-js/lib/b64.js                                             //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
;(function (exports) {                                                                                          // 1
  'use strict'                                                                                                  // 2
                                                                                                                // 3
  var i                                                                                                         // 4
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'                                 // 5
  var lookup = []                                                                                               // 6
  for (i = 0; i < code.length; i++) {                                                                           // 7
    lookup[i] = code[i]                                                                                         // 8
  }                                                                                                             // 9
  var revLookup = []                                                                                            // 10
                                                                                                                // 11
  for (i = 0; i < code.length; ++i) {                                                                           // 12
    revLookup[code.charCodeAt(i)] = i                                                                           // 13
  }                                                                                                             // 14
  revLookup['-'.charCodeAt(0)] = 62                                                                             // 15
  revLookup['_'.charCodeAt(0)] = 63                                                                             // 16
                                                                                                                // 17
  var Arr = (typeof Uint8Array !== 'undefined')                                                                 // 18
    ? Uint8Array                                                                                                // 19
    : Array                                                                                                     // 20
                                                                                                                // 21
  function decode (elt) {                                                                                       // 22
    var v = revLookup[elt.charCodeAt(0)]                                                                        // 23
    return v !== undefined ? v : -1                                                                             // 24
  }                                                                                                             // 25
                                                                                                                // 26
  function b64ToByteArray (b64) {                                                                               // 27
    var i, j, l, tmp, placeHolders, arr                                                                         // 28
                                                                                                                // 29
    if (b64.length % 4 > 0) {                                                                                   // 30
      throw new Error('Invalid string. Length must be a multiple of 4')                                         // 31
    }                                                                                                           // 32
                                                                                                                // 33
    // the number of equal signs (place holders)                                                                // 34
    // if there are two placeholders, than the two characters before it                                         // 35
    // represent one byte                                                                                       // 36
    // if there is only one, then the three characters before it represent 2 bytes                              // 37
    // this is just a cheap hack to not do indexOf twice                                                        // 38
    var len = b64.length                                                                                        // 39
    placeHolders = b64.charAt(len - 2) === '=' ? 2 : b64.charAt(len - 1) === '=' ? 1 : 0                        // 40
                                                                                                                // 41
    // base64 is 4/3 + up to two characters of the original data                                                // 42
    arr = new Arr(b64.length * 3 / 4 - placeHolders)                                                            // 43
                                                                                                                // 44
    // if there are placeholders, only get up to the last complete 4 chars                                      // 45
    l = placeHolders > 0 ? b64.length - 4 : b64.length                                                          // 46
                                                                                                                // 47
    var L = 0                                                                                                   // 48
                                                                                                                // 49
    function push (v) {                                                                                         // 50
      arr[L++] = v                                                                                              // 51
    }                                                                                                           // 52
                                                                                                                // 53
    for (i = 0, j = 0; i < l; i += 4, j += 3) {                                                                 // 54
      tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
      push((tmp & 0xFF0000) >> 16)                                                                              // 56
      push((tmp & 0xFF00) >> 8)                                                                                 // 57
      push(tmp & 0xFF)                                                                                          // 58
    }                                                                                                           // 59
                                                                                                                // 60
    if (placeHolders === 2) {                                                                                   // 61
      tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)                                     // 62
      push(tmp & 0xFF)                                                                                          // 63
    } else if (placeHolders === 1) {                                                                            // 64
      tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
      push((tmp >> 8) & 0xFF)                                                                                   // 66
      push(tmp & 0xFF)                                                                                          // 67
    }                                                                                                           // 68
                                                                                                                // 69
    return arr                                                                                                  // 70
  }                                                                                                             // 71
                                                                                                                // 72
  function encode (num) {                                                                                       // 73
    return lookup[num]                                                                                          // 74
  }                                                                                                             // 75
                                                                                                                // 76
  function tripletToBase64 (num) {                                                                              // 77
    return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)   // 78
  }                                                                                                             // 79
                                                                                                                // 80
  function encodeChunk (uint8, start, end) {                                                                    // 81
    var temp                                                                                                    // 82
    var output = []                                                                                             // 83
    for (var i = start; i < end; i += 3) {                                                                      // 84
      temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])                                            // 85
      output.push(tripletToBase64(temp))                                                                        // 86
    }                                                                                                           // 87
    return output.join('')                                                                                      // 88
  }                                                                                                             // 89
                                                                                                                // 90
  function uint8ToBase64 (uint8) {                                                                              // 91
    var i                                                                                                       // 92
    var extraBytes = uint8.length % 3 // if we have 1 byte left, pad 2 bytes                                    // 93
    var output = ''                                                                                             // 94
    var parts = []                                                                                              // 95
    var temp, length                                                                                            // 96
    var maxChunkLength = 16383 // must be multiple of 3                                                         // 97
                                                                                                                // 98
    // go through the array every three bytes, we'll deal with trailing stuff later                             // 99
                                                                                                                // 100
    for (i = 0, length = uint8.length - extraBytes; i < length; i += maxChunkLength) {                          // 101
      parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > length ? length : (i + maxChunkLength)))          // 102
    }                                                                                                           // 103
                                                                                                                // 104
    // pad the end with zeros, but make sure to not forget the extra bytes                                      // 105
    switch (extraBytes) {                                                                                       // 106
      case 1:                                                                                                   // 107
        temp = uint8[uint8.length - 1]                                                                          // 108
        output += encode(temp >> 2)                                                                             // 109
        output += encode((temp << 4) & 0x3F)                                                                    // 110
        output += '=='                                                                                          // 111
        break                                                                                                   // 112
      case 2:                                                                                                   // 113
        temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])                                       // 114
        output += encode(temp >> 10)                                                                            // 115
        output += encode((temp >> 4) & 0x3F)                                                                    // 116
        output += encode((temp << 2) & 0x3F)                                                                    // 117
        output += '='                                                                                           // 118
        break                                                                                                   // 119
      default:                                                                                                  // 120
        break                                                                                                   // 121
    }                                                                                                           // 122
                                                                                                                // 123
    parts.push(output)                                                                                          // 124
                                                                                                                // 125
    return parts.join('')                                                                                       // 126
  }                                                                                                             // 127
                                                                                                                // 128
  exports.toByteArray = b64ToByteArray                                                                          // 129
  exports.fromByteArray = uint8ToBase64                                                                         // 130
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))                                             // 131
                                                                                                                // 132
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"ieee754":{"package.json":function(require,exports){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// node_modules/meteor-node-stubs/node_modules/ieee754/package.json                                             //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
exports.name = "ieee754";                                                                                       // 1
exports.version = "1.1.6";                                                                                      // 2
exports.main = "index.js";                                                                                      // 3
                                                                                                                // 4
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// node_modules/meteor-node-stubs/node_modules/ieee754/index.js                                                 //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
exports.read = function (buffer, offset, isLE, mLen, nBytes) {                                                  // 1
  var e, m                                                                                                      // 2
  var eLen = nBytes * 8 - mLen - 1                                                                              // 3
  var eMax = (1 << eLen) - 1                                                                                    // 4
  var eBias = eMax >> 1                                                                                         // 5
  var nBits = -7                                                                                                // 6
  var i = isLE ? (nBytes - 1) : 0                                                                               // 7
  var d = isLE ? -1 : 1                                                                                         // 8
  var s = buffer[offset + i]                                                                                    // 9
                                                                                                                // 10
  i += d                                                                                                        // 11
                                                                                                                // 12
  e = s & ((1 << (-nBits)) - 1)                                                                                 // 13
  s >>= (-nBits)                                                                                                // 14
  nBits += eLen                                                                                                 // 15
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}                                    // 16
                                                                                                                // 17
  m = e & ((1 << (-nBits)) - 1)                                                                                 // 18
  e >>= (-nBits)                                                                                                // 19
  nBits += mLen                                                                                                 // 20
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}                                    // 21
                                                                                                                // 22
  if (e === 0) {                                                                                                // 23
    e = 1 - eBias                                                                                               // 24
  } else if (e === eMax) {                                                                                      // 25
    return m ? NaN : ((s ? -1 : 1) * Infinity)                                                                  // 26
  } else {                                                                                                      // 27
    m = m + Math.pow(2, mLen)                                                                                   // 28
    e = e - eBias                                                                                               // 29
  }                                                                                                             // 30
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)                                                               // 31
}                                                                                                               // 32
                                                                                                                // 33
exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {                                          // 34
  var e, m, c                                                                                                   // 35
  var eLen = nBytes * 8 - mLen - 1                                                                              // 36
  var eMax = (1 << eLen) - 1                                                                                    // 37
  var eBias = eMax >> 1                                                                                         // 38
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)                                              // 39
  var i = isLE ? 0 : (nBytes - 1)                                                                               // 40
  var d = isLE ? 1 : -1                                                                                         // 41
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0                                                   // 42
                                                                                                                // 43
  value = Math.abs(value)                                                                                       // 44
                                                                                                                // 45
  if (isNaN(value) || value === Infinity) {                                                                     // 46
    m = isNaN(value) ? 1 : 0                                                                                    // 47
    e = eMax                                                                                                    // 48
  } else {                                                                                                      // 49
    e = Math.floor(Math.log(value) / Math.LN2)                                                                  // 50
    if (value * (c = Math.pow(2, -e)) < 1) {                                                                    // 51
      e--                                                                                                       // 52
      c *= 2                                                                                                    // 53
    }                                                                                                           // 54
    if (e + eBias >= 1) {                                                                                       // 55
      value += rt / c                                                                                           // 56
    } else {                                                                                                    // 57
      value += rt * Math.pow(2, 1 - eBias)                                                                      // 58
    }                                                                                                           // 59
    if (value * c >= 2) {                                                                                       // 60
      e++                                                                                                       // 61
      c /= 2                                                                                                    // 62
    }                                                                                                           // 63
                                                                                                                // 64
    if (e + eBias >= eMax) {                                                                                    // 65
      m = 0                                                                                                     // 66
      e = eMax                                                                                                  // 67
    } else if (e + eBias >= 1) {                                                                                // 68
      m = (value * c - 1) * Math.pow(2, mLen)                                                                   // 69
      e = e + eBias                                                                                             // 70
    } else {                                                                                                    // 71
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)                                                    // 72
      e = 0                                                                                                     // 73
    }                                                                                                           // 74
  }                                                                                                             // 75
                                                                                                                // 76
  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}                              // 77
                                                                                                                // 78
  e = (e << mLen) | m                                                                                           // 79
  eLen += mLen                                                                                                  // 80
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}                               // 81
                                                                                                                // 82
  buffer[offset + i - d] |= s * 128                                                                             // 83
}                                                                                                               // 84
                                                                                                                // 85
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"isarray":{"package.json":function(require,exports){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// node_modules/meteor-node-stubs/node_modules/isarray/package.json                                             //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
exports.name = "isarray";                                                                                       // 1
exports.version = "1.0.0";                                                                                      // 2
exports.main = "index.js";                                                                                      // 3
                                                                                                                // 4
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// node_modules/meteor-node-stubs/node_modules/isarray/index.js                                                 //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
var toString = {}.toString;                                                                                     // 1
                                                                                                                // 2
module.exports = Array.isArray || function (arr) {                                                              // 3
  return toString.call(arr) == '[object Array]';                                                                // 4
};                                                                                                              // 5
                                                                                                                // 6
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"process":{"browser.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// node_modules/meteor-node-stubs/node_modules/process/browser.js                                               //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
// shim for using process in browser                                                                            // 1
                                                                                                                // 2
var process = module.exports = {};                                                                              // 3
var queue = [];                                                                                                 // 4
var draining = false;                                                                                           // 5
var currentQueue;                                                                                               // 6
var queueIndex = -1;                                                                                            // 7
                                                                                                                // 8
function cleanUpNextTick() {                                                                                    // 9
    draining = false;                                                                                           // 10
    if (currentQueue.length) {                                                                                  // 11
        queue = currentQueue.concat(queue);                                                                     // 12
    } else {                                                                                                    // 13
        queueIndex = -1;                                                                                        // 14
    }                                                                                                           // 15
    if (queue.length) {                                                                                         // 16
        drainQueue();                                                                                           // 17
    }                                                                                                           // 18
}                                                                                                               // 19
                                                                                                                // 20
function drainQueue() {                                                                                         // 21
    if (draining) {                                                                                             // 22
        return;                                                                                                 // 23
    }                                                                                                           // 24
    var timeout = setTimeout(cleanUpNextTick);                                                                  // 25
    draining = true;                                                                                            // 26
                                                                                                                // 27
    var len = queue.length;                                                                                     // 28
    while(len) {                                                                                                // 29
        currentQueue = queue;                                                                                   // 30
        queue = [];                                                                                             // 31
        while (++queueIndex < len) {                                                                            // 32
            if (currentQueue) {                                                                                 // 33
                currentQueue[queueIndex].run();                                                                 // 34
            }                                                                                                   // 35
        }                                                                                                       // 36
        queueIndex = -1;                                                                                        // 37
        len = queue.length;                                                                                     // 38
    }                                                                                                           // 39
    currentQueue = null;                                                                                        // 40
    draining = false;                                                                                           // 41
    clearTimeout(timeout);                                                                                      // 42
}                                                                                                               // 43
                                                                                                                // 44
process.nextTick = function (fun) {                                                                             // 45
    var args = new Array(arguments.length - 1);                                                                 // 46
    if (arguments.length > 1) {                                                                                 // 47
        for (var i = 1; i < arguments.length; i++) {                                                            // 48
            args[i - 1] = arguments[i];                                                                         // 49
        }                                                                                                       // 50
    }                                                                                                           // 51
    queue.push(new Item(fun, args));                                                                            // 52
    if (queue.length === 1 && !draining) {                                                                      // 53
        setTimeout(drainQueue, 0);                                                                              // 54
    }                                                                                                           // 55
};                                                                                                              // 56
                                                                                                                // 57
// v8 likes predictible objects                                                                                 // 58
function Item(fun, array) {                                                                                     // 59
    this.fun = fun;                                                                                             // 60
    this.array = array;                                                                                         // 61
}                                                                                                               // 62
Item.prototype.run = function () {                                                                              // 63
    this.fun.apply(null, this.array);                                                                           // 64
};                                                                                                              // 65
process.title = 'browser';                                                                                      // 66
process.browser = true;                                                                                         // 67
process.env = {};                                                                                               // 68
process.argv = [];                                                                                              // 69
process.version = ''; // empty string to avoid regexp issues                                                    // 70
process.versions = {};                                                                                          // 71
                                                                                                                // 72
function noop() {}                                                                                              // 73
                                                                                                                // 74
process.on = noop;                                                                                              // 75
process.addListener = noop;                                                                                     // 76
process.once = noop;                                                                                            // 77
process.off = noop;                                                                                             // 78
process.removeListener = noop;                                                                                  // 79
process.removeAllListeners = noop;                                                                              // 80
process.emit = noop;                                                                                            // 81
                                                                                                                // 82
process.binding = function (name) {                                                                             // 83
    throw new Error('process.binding is not supported');                                                        // 84
};                                                                                                              // 85
                                                                                                                // 86
process.cwd = function () { return '/' };                                                                       // 87
process.chdir = function (dir) {                                                                                // 88
    throw new Error('process.chdir is not supported');                                                          // 89
};                                                                                                              // 90
process.umask = function() { return 0; };                                                                       // 91
                                                                                                                // 92
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"domain-browser":{"package.json":function(require,exports){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// node_modules/meteor-node-stubs/node_modules/domain-browser/package.json                                      //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
exports.name = "domain-browser";                                                                                // 1
exports.version = "1.1.7";                                                                                      // 2
exports.main = "./index.js";                                                                                    // 3
                                                                                                                // 4
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":["events",function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// node_modules/meteor-node-stubs/node_modules/domain-browser/index.js                                          //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
// This file should be ES5 compatible                                                                           // 1
/* eslint prefer-spread:0, no-var:0, prefer-reflect:0, no-magic-numbers:0 */                                    // 2
'use strict'                                                                                                    // 3
module.exports = (function () {                                                                                 // 4
	// Import Events                                                                                               // 5
	var events = require('events')                                                                                 // 6
                                                                                                                // 7
	// Export Domain                                                                                               // 8
	var domain = {}                                                                                                // 9
	domain.createDomain = domain.create = function () {                                                            // 10
		var d = new events.EventEmitter()                                                                             // 11
                                                                                                                // 12
		function emitError (e) {                                                                                      // 13
			d.emit('error', e)                                                                                           // 14
		}                                                                                                             // 15
                                                                                                                // 16
		d.add = function (emitter) {                                                                                  // 17
			emitter.on('error', emitError)                                                                               // 18
		}                                                                                                             // 19
		d.remove = function (emitter) {                                                                               // 20
			emitter.removeListener('error', emitError)                                                                   // 21
		}                                                                                                             // 22
		d.bind = function (fn) {                                                                                      // 23
			return function () {                                                                                         // 24
				var args = Array.prototype.slice.call(arguments)                                                            // 25
				try {                                                                                                       // 26
					fn.apply(null, args)                                                                                       // 27
				}                                                                                                           // 28
				catch (err) {                                                                                               // 29
					emitError(err)                                                                                             // 30
				}                                                                                                           // 31
			}                                                                                                            // 32
		}                                                                                                             // 33
		d.intercept = function (fn) {                                                                                 // 34
			return function (err) {                                                                                      // 35
				if ( err ) {                                                                                                // 36
					emitError(err)                                                                                             // 37
				}                                                                                                           // 38
				else {                                                                                                      // 39
					var args = Array.prototype.slice.call(arguments, 1)                                                        // 40
					try {                                                                                                      // 41
						fn.apply(null, args)                                                                                      // 42
					}                                                                                                          // 43
					catch (err) {                                                                                              // 44
						emitError(err)                                                                                            // 45
					}                                                                                                          // 46
				}                                                                                                           // 47
			}                                                                                                            // 48
		}                                                                                                             // 49
		d.run = function (fn) {                                                                                       // 50
			try {                                                                                                        // 51
				fn()                                                                                                        // 52
			}                                                                                                            // 53
			catch (err) {                                                                                                // 54
				emitError(err)                                                                                              // 55
			}                                                                                                            // 56
			return this                                                                                                  // 57
		}                                                                                                             // 58
		d.dispose = function () {                                                                                     // 59
			this.removeAllListeners()                                                                                    // 60
			return this                                                                                                  // 61
		}                                                                                                             // 62
		d.enter = d.exit = function () {                                                                              // 63
			return this                                                                                                  // 64
		}                                                                                                             // 65
		return d                                                                                                      // 66
	}                                                                                                              // 67
	return domain                                                                                                  // 68
}).call(this)                                                                                                   // 69
                                                                                                                // 70
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]},"events":{"package.json":function(require,exports){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// node_modules/meteor-node-stubs/node_modules/events/package.json                                              //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
exports.name = "events";                                                                                        // 1
exports.version = "1.1.0";                                                                                      // 2
exports.main = "./events.js";                                                                                   // 3
                                                                                                                // 4
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"events.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// node_modules/meteor-node-stubs/node_modules/events/events.js                                                 //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
// Copyright Joyent, Inc. and other Node contributors.                                                          // 1
//                                                                                                              // 2
// Permission is hereby granted, free of charge, to any person obtaining a                                      // 3
// copy of this software and associated documentation files (the                                                // 4
// "Software"), to deal in the Software without restriction, including                                          // 5
// without limitation the rights to use, copy, modify, merge, publish,                                          // 6
// distribute, sublicense, and/or sell copies of the Software, and to permit                                    // 7
// persons to whom the Software is furnished to do so, subject to the                                           // 8
// following conditions:                                                                                        // 9
//                                                                                                              // 10
// The above copyright notice and this permission notice shall be included                                      // 11
// in all copies or substantial portions of the Software.                                                       // 12
//                                                                                                              // 13
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS                                      // 14
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF                                                   // 15
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN                                    // 16
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,                                     // 17
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR                                        // 18
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE                                    // 19
// USE OR OTHER DEALINGS IN THE SOFTWARE.                                                                       // 20
                                                                                                                // 21
function EventEmitter() {                                                                                       // 22
  this._events = this._events || {};                                                                            // 23
  this._maxListeners = this._maxListeners || undefined;                                                         // 24
}                                                                                                               // 25
module.exports = EventEmitter;                                                                                  // 26
                                                                                                                // 27
// Backwards-compat with node 0.10.x                                                                            // 28
EventEmitter.EventEmitter = EventEmitter;                                                                       // 29
                                                                                                                // 30
EventEmitter.prototype._events = undefined;                                                                     // 31
EventEmitter.prototype._maxListeners = undefined;                                                               // 32
                                                                                                                // 33
// By default EventEmitters will print a warning if more than 10 listeners are                                  // 34
// added to it. This is a useful default which helps finding memory leaks.                                      // 35
EventEmitter.defaultMaxListeners = 10;                                                                          // 36
                                                                                                                // 37
// Obviously not all Emitters should be limited to 10. This function allows                                     // 38
// that to be increased. Set to zero for unlimited.                                                             // 39
EventEmitter.prototype.setMaxListeners = function(n) {                                                          // 40
  if (!isNumber(n) || n < 0 || isNaN(n))                                                                        // 41
    throw TypeError('n must be a positive number');                                                             // 42
  this._maxListeners = n;                                                                                       // 43
  return this;                                                                                                  // 44
};                                                                                                              // 45
                                                                                                                // 46
EventEmitter.prototype.emit = function(type) {                                                                  // 47
  var er, handler, len, args, i, listeners;                                                                     // 48
                                                                                                                // 49
  if (!this._events)                                                                                            // 50
    this._events = {};                                                                                          // 51
                                                                                                                // 52
  // If there is no 'error' event listener then throw.                                                          // 53
  if (type === 'error') {                                                                                       // 54
    if (!this._events.error ||                                                                                  // 55
        (isObject(this._events.error) && !this._events.error.length)) {                                         // 56
      er = arguments[1];                                                                                        // 57
      if (er instanceof Error) {                                                                                // 58
        throw er; // Unhandled 'error' event                                                                    // 59
      }                                                                                                         // 60
      throw TypeError('Uncaught, unspecified "error" event.');                                                  // 61
    }                                                                                                           // 62
  }                                                                                                             // 63
                                                                                                                // 64
  handler = this._events[type];                                                                                 // 65
                                                                                                                // 66
  if (isUndefined(handler))                                                                                     // 67
    return false;                                                                                               // 68
                                                                                                                // 69
  if (isFunction(handler)) {                                                                                    // 70
    switch (arguments.length) {                                                                                 // 71
      // fast cases                                                                                             // 72
      case 1:                                                                                                   // 73
        handler.call(this);                                                                                     // 74
        break;                                                                                                  // 75
      case 2:                                                                                                   // 76
        handler.call(this, arguments[1]);                                                                       // 77
        break;                                                                                                  // 78
      case 3:                                                                                                   // 79
        handler.call(this, arguments[1], arguments[2]);                                                         // 80
        break;                                                                                                  // 81
      // slower                                                                                                 // 82
      default:                                                                                                  // 83
        args = Array.prototype.slice.call(arguments, 1);                                                        // 84
        handler.apply(this, args);                                                                              // 85
    }                                                                                                           // 86
  } else if (isObject(handler)) {                                                                               // 87
    args = Array.prototype.slice.call(arguments, 1);                                                            // 88
    listeners = handler.slice();                                                                                // 89
    len = listeners.length;                                                                                     // 90
    for (i = 0; i < len; i++)                                                                                   // 91
      listeners[i].apply(this, args);                                                                           // 92
  }                                                                                                             // 93
                                                                                                                // 94
  return true;                                                                                                  // 95
};                                                                                                              // 96
                                                                                                                // 97
EventEmitter.prototype.addListener = function(type, listener) {                                                 // 98
  var m;                                                                                                        // 99
                                                                                                                // 100
  if (!isFunction(listener))                                                                                    // 101
    throw TypeError('listener must be a function');                                                             // 102
                                                                                                                // 103
  if (!this._events)                                                                                            // 104
    this._events = {};                                                                                          // 105
                                                                                                                // 106
  // To avoid recursion in the case that type === "newListener"! Before                                         // 107
  // adding it to the listeners, first emit "newListener".                                                      // 108
  if (this._events.newListener)                                                                                 // 109
    this.emit('newListener', type,                                                                              // 110
              isFunction(listener.listener) ?                                                                   // 111
              listener.listener : listener);                                                                    // 112
                                                                                                                // 113
  if (!this._events[type])                                                                                      // 114
    // Optimize the case of one listener. Don't need the extra array object.                                    // 115
    this._events[type] = listener;                                                                              // 116
  else if (isObject(this._events[type]))                                                                        // 117
    // If we've already got an array, just append.                                                              // 118
    this._events[type].push(listener);                                                                          // 119
  else                                                                                                          // 120
    // Adding the second element, need to change to array.                                                      // 121
    this._events[type] = [this._events[type], listener];                                                        // 122
                                                                                                                // 123
  // Check for listener leak                                                                                    // 124
  if (isObject(this._events[type]) && !this._events[type].warned) {                                             // 125
    if (!isUndefined(this._maxListeners)) {                                                                     // 126
      m = this._maxListeners;                                                                                   // 127
    } else {                                                                                                    // 128
      m = EventEmitter.defaultMaxListeners;                                                                     // 129
    }                                                                                                           // 130
                                                                                                                // 131
    if (m && m > 0 && this._events[type].length > m) {                                                          // 132
      this._events[type].warned = true;                                                                         // 133
      console.error('(node) warning: possible EventEmitter memory ' +                                           // 134
                    'leak detected. %d listeners added. ' +                                                     // 135
                    'Use emitter.setMaxListeners() to increase limit.',                                         // 136
                    this._events[type].length);                                                                 // 137
      if (typeof console.trace === 'function') {                                                                // 138
        // not supported in IE 10                                                                               // 139
        console.trace();                                                                                        // 140
      }                                                                                                         // 141
    }                                                                                                           // 142
  }                                                                                                             // 143
                                                                                                                // 144
  return this;                                                                                                  // 145
};                                                                                                              // 146
                                                                                                                // 147
EventEmitter.prototype.on = EventEmitter.prototype.addListener;                                                 // 148
                                                                                                                // 149
EventEmitter.prototype.once = function(type, listener) {                                                        // 150
  if (!isFunction(listener))                                                                                    // 151
    throw TypeError('listener must be a function');                                                             // 152
                                                                                                                // 153
  var fired = false;                                                                                            // 154
                                                                                                                // 155
  function g() {                                                                                                // 156
    this.removeListener(type, g);                                                                               // 157
                                                                                                                // 158
    if (!fired) {                                                                                               // 159
      fired = true;                                                                                             // 160
      listener.apply(this, arguments);                                                                          // 161
    }                                                                                                           // 162
  }                                                                                                             // 163
                                                                                                                // 164
  g.listener = listener;                                                                                        // 165
  this.on(type, g);                                                                                             // 166
                                                                                                                // 167
  return this;                                                                                                  // 168
};                                                                                                              // 169
                                                                                                                // 170
// emits a 'removeListener' event iff the listener was removed                                                  // 171
EventEmitter.prototype.removeListener = function(type, listener) {                                              // 172
  var list, position, length, i;                                                                                // 173
                                                                                                                // 174
  if (!isFunction(listener))                                                                                    // 175
    throw TypeError('listener must be a function');                                                             // 176
                                                                                                                // 177
  if (!this._events || !this._events[type])                                                                     // 178
    return this;                                                                                                // 179
                                                                                                                // 180
  list = this._events[type];                                                                                    // 181
  length = list.length;                                                                                         // 182
  position = -1;                                                                                                // 183
                                                                                                                // 184
  if (list === listener ||                                                                                      // 185
      (isFunction(list.listener) && list.listener === listener)) {                                              // 186
    delete this._events[type];                                                                                  // 187
    if (this._events.removeListener)                                                                            // 188
      this.emit('removeListener', type, listener);                                                              // 189
                                                                                                                // 190
  } else if (isObject(list)) {                                                                                  // 191
    for (i = length; i-- > 0;) {                                                                                // 192
      if (list[i] === listener ||                                                                               // 193
          (list[i].listener && list[i].listener === listener)) {                                                // 194
        position = i;                                                                                           // 195
        break;                                                                                                  // 196
      }                                                                                                         // 197
    }                                                                                                           // 198
                                                                                                                // 199
    if (position < 0)                                                                                           // 200
      return this;                                                                                              // 201
                                                                                                                // 202
    if (list.length === 1) {                                                                                    // 203
      list.length = 0;                                                                                          // 204
      delete this._events[type];                                                                                // 205
    } else {                                                                                                    // 206
      list.splice(position, 1);                                                                                 // 207
    }                                                                                                           // 208
                                                                                                                // 209
    if (this._events.removeListener)                                                                            // 210
      this.emit('removeListener', type, listener);                                                              // 211
  }                                                                                                             // 212
                                                                                                                // 213
  return this;                                                                                                  // 214
};                                                                                                              // 215
                                                                                                                // 216
EventEmitter.prototype.removeAllListeners = function(type) {                                                    // 217
  var key, listeners;                                                                                           // 218
                                                                                                                // 219
  if (!this._events)                                                                                            // 220
    return this;                                                                                                // 221
                                                                                                                // 222
  // not listening for removeListener, no need to emit                                                          // 223
  if (!this._events.removeListener) {                                                                           // 224
    if (arguments.length === 0)                                                                                 // 225
      this._events = {};                                                                                        // 226
    else if (this._events[type])                                                                                // 227
      delete this._events[type];                                                                                // 228
    return this;                                                                                                // 229
  }                                                                                                             // 230
                                                                                                                // 231
  // emit removeListener for all listeners on all events                                                        // 232
  if (arguments.length === 0) {                                                                                 // 233
    for (key in this._events) {                                                                                 // 234
      if (key === 'removeListener') continue;                                                                   // 235
      this.removeAllListeners(key);                                                                             // 236
    }                                                                                                           // 237
    this.removeAllListeners('removeListener');                                                                  // 238
    this._events = {};                                                                                          // 239
    return this;                                                                                                // 240
  }                                                                                                             // 241
                                                                                                                // 242
  listeners = this._events[type];                                                                               // 243
                                                                                                                // 244
  if (isFunction(listeners)) {                                                                                  // 245
    this.removeListener(type, listeners);                                                                       // 246
  } else if (listeners) {                                                                                       // 247
    // LIFO order                                                                                               // 248
    while (listeners.length)                                                                                    // 249
      this.removeListener(type, listeners[listeners.length - 1]);                                               // 250
  }                                                                                                             // 251
  delete this._events[type];                                                                                    // 252
                                                                                                                // 253
  return this;                                                                                                  // 254
};                                                                                                              // 255
                                                                                                                // 256
EventEmitter.prototype.listeners = function(type) {                                                             // 257
  var ret;                                                                                                      // 258
  if (!this._events || !this._events[type])                                                                     // 259
    ret = [];                                                                                                   // 260
  else if (isFunction(this._events[type]))                                                                      // 261
    ret = [this._events[type]];                                                                                 // 262
  else                                                                                                          // 263
    ret = this._events[type].slice();                                                                           // 264
  return ret;                                                                                                   // 265
};                                                                                                              // 266
                                                                                                                // 267
EventEmitter.prototype.listenerCount = function(type) {                                                         // 268
  if (this._events) {                                                                                           // 269
    var evlistener = this._events[type];                                                                        // 270
                                                                                                                // 271
    if (isFunction(evlistener))                                                                                 // 272
      return 1;                                                                                                 // 273
    else if (evlistener)                                                                                        // 274
      return evlistener.length;                                                                                 // 275
  }                                                                                                             // 276
  return 0;                                                                                                     // 277
};                                                                                                              // 278
                                                                                                                // 279
EventEmitter.listenerCount = function(emitter, type) {                                                          // 280
  return emitter.listenerCount(type);                                                                           // 281
};                                                                                                              // 282
                                                                                                                // 283
function isFunction(arg) {                                                                                      // 284
  return typeof arg === 'function';                                                                             // 285
}                                                                                                               // 286
                                                                                                                // 287
function isNumber(arg) {                                                                                        // 288
  return typeof arg === 'number';                                                                               // 289
}                                                                                                               // 290
                                                                                                                // 291
function isObject(arg) {                                                                                        // 292
  return typeof arg === 'object' && arg !== null;                                                               // 293
}                                                                                                               // 294
                                                                                                                // 295
function isUndefined(arg) {                                                                                     // 296
  return arg === void 0;                                                                                        // 297
}                                                                                                               // 298
                                                                                                                // 299
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{"extensions":[".js",".json"]});
var exports = require("./node_modules/meteor/modules/client.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package.modules = exports, {
  meteorInstall: meteorInstall,
  Buffer: Buffer,
  process: process
});

})();
