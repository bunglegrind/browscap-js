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
 * @package    parser
 * @copyright  1998-2015 Browser Capabilities Project
 * @license    http://www.opensource.org/licenses/MIT MIT License
 * @link       https://github.com/mimmi20/browscap-js/
 */

'use strict';

const GetData = require('../helper/data');
const SynchronousPromise = require('synchronous-promise').SynchronousPromise;

/**
 * json parser class
 *
 * @category   browscap-js
 * @package    parser
 * @author     Thomas Müller <mimmi20@live.de>
 * @copyright  Copyright (c) 1998-2015 Browser Capabilities Project
 * @license    http://www.opensource.org/licenses/MIT MIT License
 * @link       https://github.com/mimmi20/browscap-js/
 */
class Ini {
    /**
     * @param {PatternHelper} patternHelper
     * @param {GetData} dataHelper
     */
    constructor(patternHelper, dataHelper) {
        this.patternHelper = patternHelper;
        this.dataHelper = dataHelper;
    }

    /**
     * Gets the browser data formatr for the given user agent
     * (or null if no data avaailble, no even the default browser)
     *
     * @param {string} userAgent
     * @return {object|null}
     */
    getBrowser(userAgent) {
        userAgent = userAgent.toLowerCase();

        return this.patternHelper.getPatterns(userAgent).then(
            function _patternListLoopFn(patternList) {
                const _patternListLoop = _patternListLoopFn.bind(this);

                if (patternList.length === 0) {
                    // return default
                    return GetData.getDefaultProperties();
                }

                const patterns = patternList.shift();

                const patternToMatch = new RegExp('^(?:' + patterns.join(')|(?:') + ')$', 'i');

                if (!patternToMatch.test(userAgent)) {
                    return _patternListLoop(patternList);
                }

                return SynchronousPromise.all(
                    patterns
                        .map((patternText) => {
                            const pattern = patternText.replace(new RegExp('\\[\\\\d\\]', 'gi'), '(\\d)');
                            const quotedPattern = new RegExp('^' + pattern + '$', 'i');

                            return [pattern, quotedPattern];
                        })
                        .filter((item) => {
                            const quotedPattern = item[1];
                            return quotedPattern.test(userAgent);
                        })
                        .map((item) => {
                            let pattern = item[0];
                            const quotedPattern = item[1];
                            const matches = userAgent.match(quotedPattern);

                            // Insert the digits back into the pattern, so that we can search the settings for it
                            if (matches.length > 1) {
                                matches.shift();

                                for (let k = 0; k < matches.length; k++) {
                                    const numPos = pattern.indexOf('(\\d)');
                                    const sub = pattern.substr(numPos, 4);
                                    pattern = pattern.replace(sub, matches[k]);
                                }
                            }

                            return this.dataHelper.getSettings(pattern, {});
                        })
                ).then((patternSettings) => {
                    for (let settings of patternSettings) {
                        // Try to get settings - as digits have been replaced to speed up the pattern search,
                        // we won't always find the data in the first step - so check if settings have been found and if not,
                        // search for the next pattern.
                        let hasResult = false;

                        for (let property in settings) {
                            if (settings.hasOwnProperty(property)) {
                                hasResult = true;
                                break;
                            }
                        }
                        if (hasResult) {
                            return settings;
                        }
                    }

                    return _patternListLoop(patternList);
                });
            }.bind(this)
        );
    }
}

module.exports = Ini;
