'use strict';

/**
 * main class
 *
 * @category   browscap-js
 * @author     Thomas Müller <mimmi20@live.de>
 * @copyright  Copyright (c) 1998-2015 Browser Capabilities Project
 * @license    http://www.opensource.org/licenses/MIT MIT License
 * @link       https://github.com/mimmi20/browscap-js/
 */
class Browscap {
    /**
     * @param {string} cacheDir
     */
    constructor(cacheDir, cacheOptions) {
        if (typeof cacheDir === 'undefined') {
            cacheDir = require('path').dirname(require.resolve('browscap-json-cache-files')) + '/sources/';
        }

        this.cacheDir = cacheDir;
        this.cacheOptions = cacheOptions;
    }

    /**
     * parses the given user agent to get the information about the browser
     *
     * if no user agent is given, it uses {@see \BrowscapPHP\Helper\Support} to get it
     *
     * @param {string} userAgent the user agent string
     *
     * @return {object}
     */
    getBrowser(userAgent) {
        const Ini = require('./parser');
        const GetPattern = require('./helper/pattern');
        const BrowscapCache = require('browscap-js-cache');
        const cache = new BrowscapCache(this.cacheDir, this.cacheOptions);
        const GetData = require('./helper/data');
        const patternHelper = new GetPattern(cache, this.cacheOptions);
        const dataHelper = new GetData(cache, this.cacheOptions);

        const parser = new Ini(patternHelper, dataHelper);

        const promise = parser.getBrowser(userAgent);

        // Unpack already resolved promises to ensure backward compatibility
        let result;
        promise.then((value) => {
            result = value;
        });
        if (typeof result === 'undefined') {
            return promise;
        } else {
            return result;
        }
    }
}

module.exports = Browscap;
