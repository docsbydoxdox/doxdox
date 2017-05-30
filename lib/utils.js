'use strict';

const fs = require('fs');
const path = require('path');

const DEFAULT_CONFIG_IGNORE_PATHS = [];
const DEFAULT_CONFIG_PARSER = 'dox';
const DEFAULT_CONFIG_PLUGIN = 'markdown';

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

    if (!input) {

        input = process.cwd();

    }

    try {

        const stat = fs.statSync(input);

        if (stat.isFile()) {

            return path.resolve(path.join(path.dirname(input), 'package.json'));

        } else if (stat.isDirectory()) {

            return path.resolve(path.join(input, 'package.json'));

        }

    } catch (err) {

        process.stderr.write(`${err.toString()}\n`);

    }

    return null;

};

/**
 * Format an array of directories and/or files to be ignored by globby by adding a "!" at the beginning of each path.
 *
 *     console.log(formatPathsArrayToIgnore(['./src']));
 *
 * @param {Array} paths Array of directories and/or files.
 * @return {Array} Modified array of directories and/or files.
 * @public
 */

const formatPathsArrayToIgnore = paths =>
    paths.map(path => `!${path.replace(/^!/, '')}`);

/**
 * Sets default configuration values.
 *
 *     console.log(setConfigDefaults({}));
 *
 * @param {Object} config Custom configuration object.
 * @return {Object} Modified configuration object.
 * @public
 */

const setConfigDefaults = config => Object.assign({
    'ignore': DEFAULT_CONFIG_IGNORE_PATHS,
    'parser': DEFAULT_CONFIG_PARSER,
    'plugin': DEFAULT_CONFIG_PLUGIN
}, config);

module.exports = {
    findPackageFileInPath,
    formatPathsArrayToIgnore,
    setConfigDefaults
};
