'use strict';

const fs = require('fs');

const globby = require('globby');

const loaders = require('./loaders');

const formatPathsArrayToIgnore = require('./utils').formatPathsArrayToIgnore;
const setConfigDefaults = require('./utils').setConfigDefaults;

const DEFAULT_IGNORE_PATHS = [
    '!./{node_modules,bower_components,test,tests}/**',
    '!./Gruntfile.js',
    '!./Gulpfile.js'
];

const REPLACE_FILENAME_REGEXP = new RegExp(`^(${process.cwd()}/|./)`);

/**
 * Parse a file with custom parser.
 *
 *     parseFile('src/main.js', {'parser': 'dox'}).then(files => {});
 *
 * @param {String} input File to parse.
 * @param {Object} config Configuration object.
 * @param {String} config.parser String representing the parser to be used.
 * @return {Object} Promise
 * @public
 */

const parseFile = (input, config) =>
    loaders.loadParser(setConfigDefaults(config)).then(parser => new Promise((resolve, reject) => {

        fs.readFile(input, 'utf8', (err, data) => {

            if (err) {

                return reject(err);

            }

            const filename = input.replace(REPLACE_FILENAME_REGEXP, '');

            return resolve({
                'methods': parser(data, filename),
                'name': filename
            });

        });

    }));


/**
 * Parse array of files, and then render the parsed data through the defined layout plugin.
 *
 *     parseFiles(['src/main.js'], {'ignore': [], 'parser': 'dox', 'layout': 'markdown'}).then(content => {});
 *
 * @param {Array} inputs Array of directory globs and/or files.
 * @param {Object} config Configuration object.
 * @param {String} config.ignore Array of paths to ignore.
 * @param {String} config.parser String representing the parser to be used.
 * @param {String} config.layout String representing the layout plugin to be used.
 * @return {Object} Promise
 * @public
 */

const parseFiles = (files, config) => loaders.loadPlugin(setConfigDefaults(config)).then(plugin =>
    Promise.all(files.map(input => parseFile(input, config)))
        .then(files => plugin(Object.assign({
            'files': files.filter(file => file.methods.length)
        }, setConfigDefaults(config)))));

/**
 * Parse array of directory globs and/or files, and then render the parsed data through the defined layout plugin.
 *
 *     parseInputs(['src/*.js'], {'ignore': [], 'parser': 'dox', 'layout': 'markdown'}).then(content => {});
 *
 * @param {Array} inputs Array of directory globs and/or files.
 * @param {Object} config Configuration object.
 * @param {String} config.ignore Array of paths to ignore.
 * @param {String} config.parser String representing the parser to be used.
 * @param {String} config.layout String representing the layout plugin to be used.
 * @return {Object} Promise
 * @public
 */

const parseInputs = (inputs, config) => globby(inputs.concat(DEFAULT_IGNORE_PATHS,
    formatPathsArrayToIgnore(setConfigDefaults(config).ignore)
), {'nodir': true}).then(files => parseFiles(files, config));


module.exports = {
    parseFile,
    parseFiles,
    parseInputs
};
