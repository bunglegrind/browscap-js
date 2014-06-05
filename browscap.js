var jsonfile = './browscap.preprocessed.json';

exports.setJson = function (filename) {
  jsonfile = filename;
};

exports.getBrowser = function (userAgent) {
  var browsers, patterns, re, key, found, matches, browsersindex;

  patterns = require(jsonfile).patterns;
  browsers = require(jsonfile).browsers;

  // Test user agent against each browser regex
  for (var pattern in patterns) {
    if (!patterns.hasOwnProperty(pattern)) {
      continue;
    }

    re = new RegExp(pattern.replace(/@/g, ''), 'i');

    if (re.test(userAgent)) {
      patternData = patterns[pattern];
      found = false;
      matches = userAgent.match(re);

      if (matches.length === 1) {
        browsersindex = patternData;
        found = true;
      } else {
        var matchString = '@' + matches.join('|');
console.log(matchString);
        if (patternData[matchString]) {
          browsersindex = patternData[matchString];
          found = true;
          console.log('matchString found !!!');
        } else {
          console.log('matchString not found');
        }
      }
console.log(found);
console.log(matches);
console.log(browsersindex);
console.log(browsers[browsersindex]);
      if (found && browsers[browsersindex]) {
        var browser = {
          browser_name: userAgent,
          browser_name_regex: pattern.toLowerCase().trim()
        };
        var browserData = JSON.parse(browsers[browsersindex]);

        for (var property in browserData) {
          if (!browserData.hasOwnProperty(property)) {
            continue;
          }

          browser[property] = browserData[property];
        }

        var browserParentData = browserData;

        while (browserParentData['Parent']) {
          browserParentData = JSON.parse(browsers[browserParentData['Parent']]);

          for (var propertyParent in browserParentData) {
            if (!browserParentData.hasOwnProperty(propertyParent)) {
              continue;
            }

            if (browser.hasOwnProperty(propertyParent)) {
              continue;
            }

            browser[propertyParent] = browserParentData[propertyParent];
          }
        }

        if (browser['Parent']) {
          var userAgents = require(jsonfile).userAgents;
          browser['Parent'] = userAgents[browser['Parent']];
        }

        return browser;
      }
    }
  }

  // return default
  return {
    Comment:"Default Browser",
    Browser:"Default Browser",
    Version:"0.0",
    MajorVer:"0",
    MinorVer:"0",
    Platform:"unknown",
    Platform_Version:"unknown",
    Alpha:false,
    Beta:false,
    Win16:false,
    Win32:false,
    Win64:false,
    Frames:false,
    IFrames:false,
    Tables:false,
    Cookies:false,
    BackgroundSounds:false,
    JavaScript:false,
    VBScript:false,
    JavaApplets:false,
    ActiveXControls:false,
    isMobileDevice:false,
    isTablet:false,
    isSyndicationReader:false,
    Crawler:false,
    CssVersion:"0",
    AolVersion:"0"
  };
};
