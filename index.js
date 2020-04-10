"use strict";
var mongoose = require("mongoose");
var util = require("util");

module.exports.loadType = function (mongoose) {
  mongoose.Types.BrazilianCurrency = mongoose.SchemaTypes.BrazilianCurrency = BrazilianCurrency;
  return BrazilianCurrency;
};

function BrazilianCurrency(path, options) {
  mongoose.SchemaTypes.Number.call(this, path, options);
}

/*!
 * inherits
 */

util.inherits(BrazilianCurrency, mongoose.SchemaTypes.Number);

BrazilianCurrency.prototype.cast = function (val) {
  if (isType("String", val)) {
    var currencyAsString = val.toString();
    var findDigitsAndDotRegex = /\d*\,\d{1,2}/;
    var findCommasAndLettersRegex = /[\.\$a-zA-Z]+/g;
    var findNegativeRegex = /^-/;
    var currency;
    currencyAsString = currencyAsString.replace(findCommasAndLettersRegex, "");    
    currency = findDigitsAndDotRegex
      .exec(currencyAsString + ",0")[0]
      .replace(",", "."); // Adds .0 so it works with whole numbers    
    if (findNegativeRegex.test(currencyAsString)) {
      return (currency * -100).toFixed(0) * 1;
    } else {
      return (currency * 100).toFixed(0) * 1;
    }
  } else if (isType("Number", val)) {
    return val.toFixed(0) * 1;
  } else {
    return new Error("Should pass in a number or string");
  }
};

/**
 * isType(type, obj)
 * Supported types: 'Function', 'String', 'Number', 'Date', 'RegExp',
 * 'Arguments'
 * source: https://github.com/jashkenas/underscore/blob/1.5.2/underscore.js#L996
 */

function isType(type, obj) {
  return Object.prototype.toString.call(obj) == "[object " + type + "]";
}
