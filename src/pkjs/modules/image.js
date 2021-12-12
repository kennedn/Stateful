require("../polyfills/array")
var PNG = require('../vendor/png');
var PNGEncoder = require('../vendor/png-encoder');


window.global = window;
var Buffer = require('buffer/').Buffer;

var globals = require('./globals');
for (var key in globals) {
  window[key] = globals[key];
}

var image = {};

var getPos = function(width, x, y) {
  return y * width * 4 + x * 4;
};

//! Convert an RGB pixel array into a single grey color
var getPixelGrey = function(pixels, pos) {
  return ((pixels[pos] + pixels[pos + 1] + pixels[pos + 2]) / 3) & 0xFF;
};

//! Convert an RGB pixel array into a single uint8 2 bitdepth per channel color
var getPixelColorUint8 = function(pixels, pos) {
  var r = Math.min(Math.max(parseInt(pixels[pos    ] / 64 + 0.5), 0), 3);
  var g = Math.min(Math.max(parseInt(pixels[pos + 1] / 64 + 0.5), 0), 3);
  var b = Math.min(Math.max(parseInt(pixels[pos + 2] / 64 + 0.5), 0), 3);
  var a = Math.min(Math.max(parseInt(pixels[pos + 3] / 64 + 0.5), 0), 3);
  return (a << 6) | (r << 4) | (g << 2) | b;
};

//! Get an RGB vector from an RGB pixel array
var getPixelColorRGB8 = function(pixels, pos) {
  return [pixels[pos], pixels[pos + 1], pixels[pos + 2], pixels[pos + 3]];
};

//! Normalize the color channels to be identical
image.greyscale = function(pixels, width, height, converter) {
  converter = converter || getPixelGrey;
  for (var y = 0, yy = height; y < yy; ++y) {
    for (var x = 0, xx = width; x < xx; ++x) {
      var pos = getPos(width, x, y);
      var newColor = converter(pixels, pos);
      for (var i = 0; i < 3; ++i) {
        pixels[pos + i] = newColor;
      }
    }
  }
};

//! Convert to an RGBA pixel array into a row major matrix raster
image.toRaster = function(pixels, width, height, converter) {
  converter = converter || getPixelColorRGB8;
  var matrix = [];
  for (var y = 0, yy = height; y < yy; ++y) {
    var row = matrix[y] = [];
    for (var x = 0, xx = width; x < xx; ++x) {
      var pos = getPos(width, x, y);
      row[x] = converter(pixels, pos);
    }
  }
  return matrix;
};

image.dithers = {};

image.dithers['floyd-steinberg'] = [
  [ 1, 0, 7/16],
  [-1, 1, 3/16],
  [ 0, 1, 5/16],
  [ 1, 1, 1/16]];

image.dithers['jarvis-judice-ninke'] = [
  [ 1, 0, 7/48],
  [ 2, 0, 5/48],
  [-2, 1, 3/48],
  [-1, 1, 5/48],
  [ 0, 1, 7/48],
  [ 1, 1, 5/48],
  [ 2, 1, 3/48],
  [-2, 2, 1/48],
  [-1, 2, 3/48],
  [ 0, 2, 5/48],
  [ 1, 2, 3/48],
  [ 2, 2, 1/48]];

image.dithers.sierra = [
  [ 1, 0, 5/32],
  [ 2, 0, 3/32],
  [-2, 1, 2/32],
  [-1, 1, 4/32],
  [ 0, 1, 5/32],
  [ 1, 1, 4/32],
  [ 2, 1, 2/32],
  [-1, 2, 2/32],
  [ 0, 2, 3/32],
  [ 1, 2, 2/32]];

image.dithers['default'] = image.dithers.sierra;

//! Get the nearest normalized grey color
var getChannelGrey = function(color) {
  return color >= 128 ? 255 : 0;
};

//! Get the nearest normalized 2 bitdepth color
var getChannel2 = function(color) {
  return Math.min(Math.max(parseInt(color / 64 + 0.5), 0) * 64, 255);
};

image.dither = function(pixels, width, height, dithers, converter) {
  converter = converter || getChannel2;
  dithers = dithers || image.dithers['default'];
  var numDithers = dithers.length;
  for (var y = 0, yy = height; y < yy; ++y) {
    for (var x = 0, xx = width; x < xx; ++x) {
      var pos = getPos(width, x, y);
      for (var i = 0; i < 3; ++i) {
        var oldColor = pixels[pos + i];
        var newColor = converter(oldColor);
        var error = oldColor - newColor;
        pixels[pos + i] = newColor;
        for (var j = 0; j < numDithers; ++j) {
          var dither = dithers[j];
          var x2 = x + dither[0], y2 = y + dither[1];
          if (x2 >= 0 && x2 < width && y < height) {
            pixels[getPos(width, x2, y2) + i] += parseInt(error * dither[2]);
          }
        }
      }
    }
  }
};

//! Dither a pixel buffer by image properties
image.ditherByProps = function(pixels, img, converter) {
  if (img.dither) {
    var dithers = image.dithers[img.dither];
    image.dither(pixels, img.width, img.height, dithers, converter);
  }
};

image.resizeNearest = function(pixels, width, height, newWidth, newHeight) {
  var newPixels = new Array(newWidth * newHeight * 4);
  var widthRatio = width / newWidth;
  var heightRatio = height / newHeight;
  for (var y = 0, yy = newHeight; y < yy; ++y) {
    for (var x = 0, xx = newWidth; x < xx; ++x) {
      var x2 = parseInt(x * widthRatio);
      var y2 = parseInt(y * heightRatio);
      var pos2 = getPos(width, x2, y2);
      var pos = getPos(newWidth, x, y);
      for (var i = 0; i < 4; ++i) {
        newPixels[pos + i] = pixels[pos2 + i];
      }
    }
  }
  return newPixels;
};

image.resizeSample = function(pixels, width, height, newWidth, newHeight) {
  var newPixels = new Array(newWidth * newHeight * 4);
  var widthRatio = width / newWidth;
  var heightRatio = height / newHeight;
  for (var y = 0, yy = newHeight; y < yy; ++y) {
    for (var x = 0, xx = newWidth; x < xx; ++x) {
      var x2 = Math.min(parseInt(x * widthRatio), width - 1);
      var y2 = Math.min(parseInt(y * heightRatio), height - 1);
      var pos = getPos(newWidth, x, y);
      for (var i = 0; i < 4; ++i) {
        newPixels[pos + i] = ((pixels[getPos(width, x2  , y2  ) + i] +
                               pixels[getPos(width, x2+1, y2  ) + i] +
                               pixels[getPos(width, x2  , y2+1) + i] +
                               pixels[getPos(width, x2+1, y2+1) + i]) / 4) & 0xFF;
      }
    }
  }
  return newPixels;
};


image.resize = function(pixels, width, height, newWidth, newHeight) {
  if (newWidth == width && newHeight == height) {
    return pixels;
  }

  if (newWidth < width || newHeight < height) {
    return image.resizeSample(pixels, width, height, newWidth, newHeight);
  } else {
    return image.resizeNearest(pixels, width, height, newWidth, newHeight);
  }
};

//! Convert to a GBitmap with bitdepth 1
image.toGbitmap1 = function(pixels, width, height) {
  var rowBytes = width * 4;

  var gpixels = [];
  var growBytes = Math.ceil(width / 32) * 4;
  for (var i = 0, ii = height * growBytes; i < ii; ++i) {
    gpixels[i] = 0;
  }

  for (var y = 0, yy = height; y < yy; ++y) {
    for (var x = 0, xx = width; x < xx; ++x) {
      var grey = 0;
      var pos = getPos(width, x, y);
      for (var j = 0; j < 3; ++j) {
        grey += pixels[pos + j];
      }
      grey /= 3 * 255;
      if (grey >= 0.5) {
        var gbytePos = y * growBytes + parseInt(x / 8);
        gpixels[gbytePos] += 1 << (x % 8);
      }
    }
  }

  return gpixels;
};

//! Convert to a PNG with total color bitdepth 8
image.toPng8 = function(pixels, width, height) {
  var raster = image.toRaster(pixels, width, height, getPixelColorRGB8);

  var palette = [];
  var transparency = [];
  var colorMap = {};
  var numColors = 0;
  for (var y = 0, yy = height; y < yy; ++y) {
    var row = raster[y];
    for (var x = 0, xx = width; x < xx; ++x) {
      var color = row[x];
      var hash = getPixelColorUint8(color, 0);
      if (!(hash in colorMap)) {
        colorMap[hash] = numColors;
        transparency[numColors] = color[color.length - 1];
        palette[numColors++] = color.slice(0,3);
      }
      row[x] = colorMap[hash];
    }
  }
  var bitdepth = 8;
  var colorType = 3; // 8-bit palette
  var bytes = PNGEncoder.encode(raster, bitdepth, colorType, palette, transparency);

  debug(1, "PNG8: data:image/png;base64," + Buffer.from(bytes.array).toString('base64'));
  return bytes.array;
};

//! Convert to a PNG with total color bitdepth 2
image.toPng2 = function(pixels, width, height) {

  image.greyscale(pixels, width, height);
  var raster = image.toRaster(pixels, width, height, getPixelColorRGB8);
  for (var y = 0, yy = height; y < yy; ++y) {
    var row = raster[y];
    for (var x = 0, xx = width; x < xx; ++x) {
      var color = row[x];
      var transparency = color[color.length -1];
      var gray = color[0];

      if (transparency < 64) {
        row[x] = 0;
      } else {
        row[x] = Math.floor(((gray * 2) / 255) + 1)
      }
    }
  }
  var bitdepth = 2;
  var colorType = 3; // 8-bit palette
  // Create simple 4 bit palette (2^bitdepth) with channels: alpha, black, gray, white
  var palette = [0, 0, 128, 255].map(function(v) { return Array(3).fill(v); });
  var transparency = [0];
  var bytes = PNGEncoder.encode(raster, bitdepth, colorType, palette, transparency);

  debug(1, "PNG8: data:image/png;base64," + Buffer.from(bytes.array).toString('base64'));
  return bytes.array;
};

image.load = function(url) {
  PNG.load(url, function(png) {
    var pixels = png.decode();
    if(png.colorType == 3) {
      var rawPalette = png.decodePalette();
      var rawpixels = png.decodePixels();
      var rawPalette = Object.keys(rawPalette).map(function(key) { return rawPalette[key]; });
      var palette = [];
      var chunkSize = 3;
      for (var i = 0; i < rawPalette.length; i += chunkSize) {
        palette.push(rawPalette.slice(i, i + chunkSize));
      }
    }
    var target_width = ICON_SIZE_PX;
    var target_height = ICON_SIZE_PX;
    pixels = image.resize(pixels, png.width, png.height, target_width, target_height);
    png.width = target_width;
    png.height = target_height;
    // image.dither(pixels, png.width, png.height, image.dithers['default'], getChannel2)
    var bytes = PNGEncoder.encode(image.toRaster(pixels, png.width, png.height), 8, 6);
    debug(1, "PNG8: data:image/png;base64," + Buffer.from(bytes.array).toString('base64'));
    image.toPng8(pixels, png.width, png.height);
    image.toPng2(pixels, png.width, png.height);
  });
  // return pixels;
};

module.exports = image;