# Changelog

## 2.0.3 (May 30, 2017)

- Fixed issue with loading plugins via absolute paths.
- Updated packages.
- Updated tests.

## 2.0.2 (February 15, 2017)

- Set the rejection reason to an Error object.
- Updated documentation.
- Updated packages.
- Added yarn support.

## 2.0.1 (December 15, 2016)

- Prevent update notification from displaying when piping output.
- Updated packages.

## 2.0.0 (December 8, 2016)

- Changed `parseInput` to `parseFile`
- Added `setConfigDefaults` method.
- Added ability to load custom parsers.
- Filter out files with no methods.
- Updated packages.

## 1.1.3 (November 7, 2016)

- Added update-notifier.

## 1.1.2 (November 4, 2016)

- Added local plugin resolution.
- Updated packages.

## 1.1.1 (October 28, 2016)

- Fixed issue with loading custom parsers and plugins.

## 1.1.0 (October 25, 2016)

- Added ignore flag.
- Added "tests" to default ignored folder names.

## 1.0.1 (October 24, 2016)

- Fixed issue with pattern matching.

## 1.0.0 (October 24, 2016)

- Rewrite to support custom parsers and plugins.

## 0.1.15 (August 21, 2016)

- Updated packages.

## 0.1.14 (May 15, 2016)

- Updated packages.

## 0.1.13 (May 4, 2016)

- Improved regular expression for matching excluded directories and files.
- Added support for multiple inputs.
- Updated packages.

## 0.1.12 (April 3, 2016)

- Fixed issue locating package.json file.
- Updated packages.

## 0.1.11 (March 25, 2016)

- Updated packages.

## 0.1.10 (November 13, 2015)

- Fixed regression with output generated via non-promise logic.

## 0.1.9 (November 2, 2015)

- Support for Node.js 0.12, 4.0, 5.0
- Updated packages.

## 0.1.8 (August 3, 2015)

- Updated packages.

## 0.1.7 (May 31, 2015)

- Updated packages.

## 0.1.6 (April 12, 2015)

- Updated packages.
- Fixed Markdown issue with underscores in method names.
- Fixed Markdown issue with headers on npmjs.com

## 0.1.5 (April 5, 2015)

- Updated packages.
- Added support for node 0.12.x.
- Updated tests.

## 0.1.4 (February 19, 2015)

- Added export to wiki.
- Updated packages.

## 0.1.3 (January 26, 2015)

- Added highlight.js support to markdown content.
- Updated `promise` and `marked` packages.

## 0.1.2 (January 13, 2015)

- Removed parameters from Dash search index. ([@Kapeli](https://github.com/Kapeli))
- Use FQN when adding properties to Dash search index. ([@Kapeli](https://github.com/Kapeli))
- Optimized Dash tooltips. ([@Kapeli](https://github.com/Kapeli))
- Fixed a bug where a missing property would cause app to crash.

## 0.1.1 (January 1, 2015)

- Added tests.
- Bootstrap template now includes parameters after each function name with optional brackets.
- Markdown template now includes parameters after each function name with optional brackets.
- Dash template now includes parameters after each function name with optional brackets.
- Added parameters and properties to dash export.

## 0.1.0 (December 24, 2014)

- Restructured data returned from `utils.parseData` method.
- Renamed method `utils.findPackage` to `utils.findPackagePath` to better reflect it's purpose.
- package.json contents is now passed through to the template as `pkg`.
- Bootstrap template redesigned.
- Bootstrap template updated to include homepage link and version number.
- Bootstrap template now includes deeplinks to individual files.
- Removed options from Bootstrap template for toggling code blocks and private methods.
- Consolidated Bootstrap template resources.
- Markdown template updated to include homepage link and version number.
- Fixed issue with improperly detecting language through highlight.js handlebars helper.

## 0.0.18 (December 12, 2014)

- Improved Dash docset generation.
- Removed brackets from around optional tag names.

## 0.0.17 (December 7, 2014)

- Removed paragraph tag from descriptions.
- Forced language on highlight method.

## 0.0.16 (December 6, 2014)

- Added promise to buildDashDocSet method.

## 0.0.15 (December 5, 2014)

- Added offline support to dash documentation.

## 0.0.14 (December 5, 2014)

- Added new export to Dash.
- Updated to latest version of dox.

## 0.0.13 (October 16, 2014)

- Large code blocks are now pre-highlighted.
- Updated to latest version of dox.

## 0.0.12 (October 2, 2014)

- Added text overflow to methods to prevent overlapping body content.

## 0.0.11 (September 11, 2014)

- Removed tag made redundant by doxdox 0.5.0 update.
- Fixed bug related to relative directories.
- Added findPackage method to utils.

## 0.0.10 (September 8, 2014)

- Updated to latest version of Handlebars.

## 0.0.9 (September 6, 2014)

- Fixed issue with relative source paths.
- Updated to latest version of dox.

## 0.0.8 (September 5, 2014)

- Updated to latest version of dox.

## 0.0.7 (August 18, 2014)

- Added support for examples tag.
- Added support for returns tag.
- Added both `bower_components` and `gulpfile` to default walk exceptions.

## 0.0.6 (August 17, 2014)

- Added support for custom Handlebars templates.
- Improved built-in template selection (now case insensitive).

## 0.0.5 (August 17, 2014)

- Added support for crawling directories.
- Added support for pulling title and description from package.json files.
- Added "Back to Top" link.
- Minor visual changes.

## 0.0.4 (August 10, 2014)

- Improved Node.js support with the addition of a new method: parseFile.

## 0.0.3 (August 10, 2014)

- Updated doxdox to be importable through Node.js

## 0.0.2 (August 7, 2014)

- Added output flag.
- Added syntax highlighting to Bootstrap layout.

## 0.0.1 (August 3, 2014)

- Initial public release.
