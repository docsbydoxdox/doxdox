'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Finds package.json file from either the directory the script was called from or a supplied path.
 *
 *     console.log(findPackageFileInPath());
 *     console.log(findPackageFileInPath('./package.json'));
 *     console.log(findPackageFileInPath('~/git/github/doxdox/'));
 *
 * @param {String} [input] Directory or file.
 * @return {String} Path to package.json file.
 * @public
 */

const findPackageFileInPath = input => {

    let pkgPath = null;

    if (!input) {

        input = process.cwd();

    }

    if (fs.existsSync(input)) {

        const stat = fs.statSync(input);

        if (stat.isFile()) {

            pkgPath = path.resolve(path.join(path.dirname(input), '/package.json'));

        } else {

            pkgPath = path.resolve(path.join(input, '/package.json'));

        }

    }

    return pkgPath;

};

/**
 * Format an array of directories and/or files to be ignored by globby by adding a "!" at the beginning of each path.
 *
 *     console.log(formatPathsArrayToIgnore([]));
 *
 * @param {Array} paths Array of directories and/or files.
 * @return {Array} Modified array of directories and/or files.
 * @public
 */

const formatPathsArrayToIgnore = paths =>
    paths.map(path => `!${path.replace(/^!/, '')}`);

module.exports = {
    findPackageFileInPath,
    formatPathsArrayToIgnore
};
