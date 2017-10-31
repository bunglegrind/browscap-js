"use strict";

module.exports = function Browscap (cacheDir, cacheOptions) {
  if (typeof cacheDir === 'undefined') {
    cacheDir = require('path').dirname(require.resolve('browscap-json-cache-files')) + '/sources/';
  }

  this.cacheDir     = cacheDir;
  this.cacheOptions = cacheOptions;

  /**
   * parses the given user agent to get the information about the browser
   *
   * if no user agent is given, it uses {@see \BrowscapPHP\Helper\Support} to get it
   *
   * @param userAgent the user agent string
   */
  this.getBrowser = function getBrowser (userAgent) {
    var Ini           = require('./parser');
    var Quoter        = require('./helper/quoter');
    var quoter        = new Quoter();
    var GetPattern    = require('./helper/pattern');
    var BrowscapCache = require('browscap-js-cache');
    var cache         = new BrowscapCache(this.cacheDir, this.cacheOptions);
    var GetData       = require('./helper/data');
    var patternHelper = new GetPattern(cache, this.cacheOptions);
    var dataHelper    = new GetData(cache, quoter, this.cacheOptions);

    var parser = new Ini(patternHelper, dataHelper);

    var promise = parser.getBrowser(userAgent);

    // Unpack already resolved promises to ensure backward compatibility
    var result;
    promise.then((value) => {
      result = value;
    });
    if (typeof(result) === "undefined") {
      return promise;
    } else {
      return result;
    }
  };
};
