/**
 * Copyright (c) 1998-2015 Browser Capabilities Project
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * @category   browscap-js
 * @package    helper
 * @copyright  1998-2015 Browser Capabilities Project
 * @license    http://www.opensource.org/licenses/MIT MIT License
 * @link       https://github.com/mimmi20/browscap-js/
 */

"use strict";

/**
 * includes general functions for the work with patterns
 *
 * @category   browscap-js
 * @package    helper
 * @author     Thomas Müller <mimmi20@live.de>
 * @copyright  Copyright (c) 1998-2015 Browser Capabilities Project
 * @license    http://www.opensource.org/licenses/MIT MIT License
 * @link       https://github.com/mimmi20/browscap-js/
 */
module.exports = function SubKey (options) {
    const HEX_CHARS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                       'a', 'b', 'c', 'd', 'e', 'f'];

    // Set default parameter values
    this.options = Object.assign({
        patternCacheBytes: 2,
        iniPartCacheBytes: 3
    }, options);


    /// Utility function of generating all possible cache subkeys of length `n`
    function* _yieldSubKeys(n) {
        if (n > 1) {
            for (var char of HEX_CHARS) {
                for (var chars of _yieldSubKeys(n - 1)) {
                    yield (char + chars);
                }
            }
        } else if (n == 1) {
            yield* HEX_CHARS;
        }
    }


    /**
     * Gets the subkey for the pattern cache file, generated from the given string
     *
     * @param  string
     * @return string
     */
    this.getPatternCacheSubkey = function getPatternCacheSubkey (string) {
        return string.substring(0, this.options.patternCacheBytes);
    };

    /**
     * Gets all subkeys for the pattern cache files
     *
     * @return Object
     */
    this.getAllPatternCacheSubkeys = function getAllPatternCacheSubkeys () {
        return _yieldSubKeys(this.options.patternCacheBytes);
    };

    /**
     * Gets the sub key for the ini parts cache file, generated from the given string
     *
     * @param string
     * @return string
     */
    this.getIniPartCacheSubKey = function getIniPartCacheSubKey (string) {
        return string.substring(0, this.options.iniPartCacheBytes);
    };

    /**
     * Gets all sub keys for the inipart cache files
     *
     * @return Array
     */
    this.getAllIniPartCacheSubKeys = function getAllIniPartCacheSubKeys () {
        return _yieldSubKeys(this.options.iniPartCacheBytes);
    };
};
