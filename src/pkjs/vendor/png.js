
/*
 * MIT LICENSE
 * Copyright (c) 2011 Devon Govett
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
 * to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 * BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

'use strict';

var zlib;
if (typeof require !== 'undefined') {
  zlib = require('../vendor/zlib');
} else {
  zlib = window.zlib;
}

require('../polyfills/strings');
require('../polyfills/array');

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var PNG = (function () {
    var APNG_DISPOSE_OP_NONE = 0;
    var APNG_DISPOSE_OP_BACKGROUND = 1;
    var APNG_DISPOSE_OP_PREVIOUS = 2;
    var APNG_BLEND_OP_SOURCE = 0;
    var APNG_BLEND_OP_OVER = 1;

    var PNG = (function () {
      _createClass(PNG, null, [{
        key: 'load',
        value: function load(url, canvas, callback) {
          if (typeof canvas === 'function') {
            callback = canvas;
          }

          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.responseType = 'arraybuffer';
          xhr.onload = function () {
            var data = new Uint8Array(xhr.response || xhr.mozResponseArrayBuffer);
            var png = new PNG(data);
            if (typeof (canvas && canvas.getContext) === 'function') {
              png.render(canvas);
            }
            return typeof callback === 'function' ? callback(png) : undefined;
          };

          return xhr.send(null);
        }
      }]);

      function PNG(data1) {
        _classCallCheck(this, PNG);

        var i = undefined;
        this.data = data1;
        this.pos = 8; // Skip the default header

        this.palette = [];
        this.imgData = [];
        this.transparency = {};
        this.animation = null;
        this.text = {};
        var frame = null;

        while (true) {
          var data;
          var chunkSize = this.readUInt32();
          var section = '';
          for (i = 0; i < 4; i++) {
            section += String.fromCharCode(this.data[this.pos++]);
          }

          switch (section) {
            case 'IHDR':
              // we can grab  interesting values from here (like width, height, etc)
              this.width = this.readUInt32();
              this.height = this.readUInt32();
              this.bits = this.data[this.pos++];
              this.colorType = this.data[this.pos++];
              this.compressionMethod = this.data[this.pos++];
              this.filterMethod = this.data[this.pos++];
              this.interlaceMethod = this.data[this.pos++];
              break;

            case 'acTL':
              // we have an animated PNG
              this.animation = {
                numFrames: this.readUInt32(),
                numPlays: this.readUInt32() || Infinity,
                frames: []
              };
              break;

            case 'PLTE':
              this.palette = this.read(chunkSize);
              break;

            case 'fcTL':
              if (frame) {
                this.animation.frames.push(frame);
              }

              this.pos += 4; // skip sequence number
              frame = {
                width: this.readUInt32(),
                height: this.readUInt32(),
                xOffset: this.readUInt32(),
                yOffset: this.readUInt32()
              };

              var delayNum = this.readUInt16();
              var delayDen = this.readUInt16() || 100;
              frame.delay = 1000 * delayNum / delayDen;

              frame.disposeOp = this.data[this.pos++];
              frame.blendOp = this.data[this.pos++];
              frame.data = [];
              break;

            case 'IDAT':
            case 'fdAT':
              if (section === 'fdAT') {
                this.pos += 4; // skip sequence number
                chunkSize -= 4;
              }

              data = frame && frame.data || this.imgData;
              for (i = 0; i < chunkSize; i++) {
                data.push(this.data[this.pos++]);
              }
              break;

            case 'tRNS':
              // This chunk can only occur once and it must occur after the
              // PLTE chunk and before the IDAT chunk.
              this.transparency = {};
              switch (this.colorType) {
                case 3:
                  // Indexed color, RGB. Each byte in this chunk is an alpha for
                  // the palette index in the PLTE ("palette") chunk up until the
                  // last non-opaque entry. Set up an array, stretching over all
                  // palette entries which will be 0 (opaque) or 1 (transparent).
                  this.transparency.indexed = this.read(chunkSize);
                  var short = 255 - this.transparency.indexed.length;
                  if (short > 0) {
                    for (i = 0; i < short; i++) {
                      this.transparency.indexed.push(255);
                    }
                  }
                  break;
                case 0:
                  // Greyscale. Corresponding to entries in the PLTE chunk.
                  // Grey is two bytes, range 0 .. (2 ^ bit-depth) - 1
                  this.transparency.grayscale = this.read(chunkSize)[0];
                  break;
                case 2:
                  // True color with proper alpha channel.
                  this.transparency.rgb = this.read(chunkSize);
                  break;
              }
              break;

            case 'tEXt':
              var text = this.read(chunkSize);
              var index = text.indexOf(0);
              var key = String.fromCharCode.apply(String, text.slice(0, index));
              this.text[key] = String.fromCharCode.apply(String, text.slice(index + 1));
              break;

            case 'IEND':
              if (frame) {
                this.animation.frames.push(frame);
              }

              // we've got everything we need!
              switch (this.colorType) {
                case 0:
                case 3:
                case 4:
                  this.colors = 1;
                  break;
                case 2:
                case 6:
                  this.colors = 3;
                  break;
              }

              this.hasAlphaChannel = ([4, 6].indexOf(this.colorType) != -1);
              var colors = this.colors + (this.hasAlphaChannel ? 1 : 0);
              this.pixelBitlength = this.bits * colors;

              switch (this.colors) {
                case 1:
                  this.colorSpace = 'DeviceGray';
                  break;
                case 3:
                  this.colorSpace = 'DeviceRGB';
                  break;
              }

              this.imgData = new Uint8Array(this.imgData);
              return;
              break;

            default:
              // unknown (or unimportant) section, skip it
              this.pos += chunkSize;
          }

          this.pos += 4; // Skip the CRC

          if (this.pos > this.data.length) {
            throw new Error('Incomplete or corrupt PNG file');
          }
        }
      }

      _createClass(PNG, [{
        key: 'read',
        value: function read(bytes) {
          var result = new Array(bytes);
          for (var i = 0; i < bytes; i++) {
            result[i] = this.data[this.pos++];
          }
          return result;
        }
      }, {
        key: 'readUInt32',
        value: function readUInt32() {
          var b1 = this.data[this.pos++] << 24;
          var b2 = this.data[this.pos++] << 16;
          var b3 = this.data[this.pos++] << 8;
          var b4 = this.data[this.pos++];
          return b1 | b2 | b3 | b4;
        }
      }, {
        key: 'readUInt16',
        value: function readUInt16() {
          var b1 = this.data[this.pos++] << 8;
          var b2 = this.data[this.pos++];
          return b1 | b2;
        }
      }, {
        key: 'decodePixels',
        value: function decodePixels(data) {
          if (data == null) {
            data = this.imgData;
          }
          if (data.length === 0) {
            return new Uint8Array(0);
          }

          data = new Zlib.Inflate(data);
          data = data.decompress();

          var width = this.width;
          var height = this.height;

          var pixelBytes = this.pixelBitlength / 8;

          var pixels = new Uint8Array(width * height * pixelBytes);
          var _data = data;
          var length = _data.length;

          var pos = 0;

          function pass(x0, y0, dx, dy) {
            var singlePass = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];

            var w = Math.ceil((width - x0) / dx);
            var h = Math.ceil((height - y0) / dy);
            var scanlineLength = pixelBytes * w;
            var buffer = singlePass ? pixels : new Uint8Array(scanlineLength * h);
            var row = 0;
            var c = 0;
            while (row < h && pos < length) {
              var byte, col, i, left, upper;
              switch (data[pos++]) {
                case 0:
                  // None
                  for (i = 0; i < scanlineLength; i++) {
                    buffer[c++] = data[pos++];
                  }
                  break;

                case 1:
                  // Sub
                  for (i = 0; i < scanlineLength; i++) {
                    byte = data[pos++];
                    left = i < pixelBytes ? 0 : buffer[c - pixelBytes];
                    buffer[c++] = (byte + left) % 256;
                  }
                  break;

                case 2:
                  // Up
                  for (i = 0; i < scanlineLength; i++) {
                    byte = data[pos++];
                    col = (i - i % pixelBytes) / pixelBytes;
                    upper = row && buffer[(row - 1) * scanlineLength + col * pixelBytes + i % pixelBytes];
                    buffer[c++] = (upper + byte) % 256;
                  }
                  break;

                case 3:
                  // Average
                  for (i = 0; i < scanlineLength; i++) {
                    byte = data[pos++];
                    col = (i - i % pixelBytes) / pixelBytes;
                    left = i < pixelBytes ? 0 : buffer[c - pixelBytes];
                    upper = row && buffer[(row - 1) * scanlineLength + col * pixelBytes + i % pixelBytes];
                    buffer[c++] = (byte + Math.floor((left + upper) / 2)) % 256;
                  }
                  break;

                case 4:
                  // Paeth
                  for (i = 0; i < scanlineLength; i++) {
                    var paeth, upperLeft;
                    byte = data[pos++];
                    col = (i - i % pixelBytes) / pixelBytes;
                    left = i < pixelBytes ? 0 : buffer[c - pixelBytes];

                    if (row === 0) {
                      upper = upperLeft = 0;
                    } else {
                      upper = buffer[(row - 1) * scanlineLength + col * pixelBytes + i % pixelBytes];
                      upperLeft = col && buffer[(row - 1) * scanlineLength + (col - 1) * pixelBytes + i % pixelBytes];
                    }

                    var p = left + upper - upperLeft;
                    var pa = Math.abs(p - left);
                    var pb = Math.abs(p - upper);
                    var pc = Math.abs(p - upperLeft);

                    if (pa <= pb && pa <= pc) {
                      paeth = left;
                    } else if (pb <= pc) {
                      paeth = upper;
                    } else {
                      paeth = upperLeft;
                    }

                    buffer[c++] = (byte + paeth) % 256;
                  }
                  break;

                default:
                  throw new Error('Invalid filter algorithm: ' + data[pos - 1]);
              }

              if (!singlePass) {
                var pixelsPos = ((y0 + row * dy) * width + x0) * pixelBytes;
                var bufferPos = row * scanlineLength;
                for (i = 0; i < w; i++) {
                  for (var j = 0; j < pixelBytes; j++) {
                    pixels[pixelsPos++] = buffer[bufferPos++];
                  }pixelsPos += (dx - 1) * pixelBytes;
                }
              }

              row++;
            }
          }

          if (this.interlaceMethod === 1) {
            /*
              1 6 4 6 2 6 4 6
              7 7 7 7 7 7 7 7
              5 6 5 6 5 6 5 6
              7 7 7 7 7 7 7 7
              3 6 4 6 3 6 4 6
              7 7 7 7 7 7 7 7
              5 6 5 6 5 6 5 6
              7 7 7 7 7 7 7 7
            */
            pass(0, 0, 8, 8); // 1
            pass(4, 0, 8, 8); // 2
            pass(0, 4, 4, 8); // 3
            pass(2, 0, 4, 4); // 4
            pass(0, 2, 2, 4); // 5
            pass(1, 0, 2, 2); // 6
            pass(0, 1, 1, 2); // 7
          } else {
              pass(0, 0, 1, 1, true);
            }
          return pixels;
        }
      }, {
        key: 'decodePalette',
        value: function decodePalette() {
          var palette = this.palette;
          var length = palette.length;

          var transparency = this.transparency.indexed || [];
          var ret = new Uint8Array((transparency.length || 0) + length);
          var pos = 0;
          var c = 0;

          for (var i = 0; i < length; i += 3) {
            var left;
            ret[pos++] = palette[i];
            ret[pos++] = palette[i + 1];
            ret[pos++] = palette[i + 2];
            ret[pos++] = (left = transparency[c++]) != null ? left : 255;
          }

          return ret;
        }
      }, {
        key: 'copyToImageData',
        value: function copyToImageData(imageData, pixels) {
          var j = undefined,
              k = undefined;
          var colors = this.colors;

          var palette = null;
          var alpha = this.hasAlphaChannel;

          if (this.palette.length) {
            palette = this._decodedPalette || (this._decodedPalette = this.decodePalette());
            colors = 4;
            alpha = true;
          }

          var data = imageData.data || imageData;
          var length = data.length;

          var input = palette || pixels;
          var i = j = 0;

          if (colors === 1) {
            while (i < length) {
              k = palette ? pixels[i / 4] * 4 : j;
              var v = input[k++];
              data[i++] = v;
              data[i++] = v;
              data[i++] = v;
              data[i++] = alpha ? input[k++] : 255;
              j = k;
            }
          } else {
            while (i < length) {
              k = palette ? pixels[i / 4] * 4 : j;
              data[i++] = input[k++];
              data[i++] = input[k++];
              data[i++] = input[k++];
              data[i++] = alpha ? input[k++] : 255;
              j = k;
            }
          }
        }
      }, {
        key: 'decode',
        value: function decode() {
          var ret = new Uint8Array(this.width * this.height * 4);
          this.copyToImageData(ret, this.decodePixels());
          return ret;
        }
      }, {
        key: 'decodeFrames',
        value: function decodeFrames(ctx) {
          if (!this.animation) {
            return;
          }

          for (var i = 0; i < this.animation.frames.length; i++) {
            var frame = this.animation.frames[i];
            var imageData = ctx.createImageData(frame.width, frame.height);
            var pixels = this.decodePixels(new Uint8Array(frame.data));

            this.copyToImageData(imageData, pixels);
            frame.imageData = imageData;
          }
        }
      }, {
        key: 'renderFrame',
        value: function renderFrame(ctx, number) {
          var frames = this.animation.frames;

          var frame = frames[number];
          var prev = frames[number - 1];

          // if we're on the first frame, clear the canvas
          if (number === 0) {
            ctx.clearRect(0, 0, this.width, this.height);
          }

          // check the previous frame's dispose operation
          if ((prev && prev.disposeOp) === APNG_DISPOSE_OP_BACKGROUND) {
            ctx.clearRect(prev.xOffset, prev.yOffset, prev.width, prev.height);
          } else if ((prev && prev.disposeOp) === APNG_DISPOSE_OP_PREVIOUS) {
            ctx.putImageData(prev.imageData, prev.xOffset, prev.yOffset);
          }

          // APNG_BLEND_OP_SOURCE overwrites the previous data
          if (frame.blendOp === APNG_BLEND_OP_SOURCE) {
            ctx.clearRect(frame.xOffset, frame.yOffset, frame.width, frame.height);
          }

          // draw the current frame
          return ctx.drawImage(frame.image, frame.xOffset, frame.yOffset);
        }
      }, {
        key: 'animate',
        value: function animate(ctx) {
          var _this = this;

          var frameNumber = 0;
          var _animation = this.animation;
          var numFrames = _animation.numFrames;
          var frames = _animation.frames;
          var numPlays = _animation.numPlays;

          var doFrame = function doFrame() {
            var f = frameNumber++ % numFrames;
            var frame = frames[f];
            _this.renderFrame(ctx, f);

            if (numFrames > 1 && frameNumber / numFrames < numPlays) {
              _this.animation._timeout = setTimeout(doFrame, frame.delay);
            }
          };

          doFrame();
        }
      }, {
        key: 'stopAnimation',
        value: function stopAnimation() {
          return clearTimeout(this.animation && this.animation._timeout);
        }
      }, {
        key: 'render',
        value: function render(canvas) {
          // if this canvas was displaying another image before,
          // stop the animation on it
          if (canvas._png) {
            canvas._png.stopAnimation();
          }

          canvas._png = this;
          canvas.width = this.width;
          canvas.height = this.height;
          var ctx = canvas.getContext('2d');

          if (this.animation) {
            this.decodeFrames(ctx);
            return this.animate(ctx);
          } else {
            var data = ctx.createImageData(this.width, this.height);
            this.copyToImageData(data, this.decodePixels());
            return ctx.putImageData(data, 0, 0);
          }
        }
      }]);

      return PNG;
    })();
    return PNG
  })();

module.exports = PNG;
