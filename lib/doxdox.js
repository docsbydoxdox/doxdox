'use strict';

const fs = require('fs');

const globby = require('globby');

const loaders = require('./loaders');

const formatPathsArrayToIgnore = require('./utils').formatPathsArrayToIgnore;

const DEFAULT_IGNORE_PATHS = [
    '!./{node_modules,bower_components,test,tests}/**',
    '!./Gruntfile.js',
    '!./Gulpfile.js'
];

const REPLACE_FILENAME_REGEXP = new RegExp(`^(${process.cwd()}/|./)`);

/**
 * Parse an input file with parser.
 *
 *     parseInput('src/main.js', {'parser': 'dox'}).then(files => {});
 *
 * @param {String} input File to parse.
 * @param {Object} config Configuration object.
 * @param {String} config.parser String representing the parser to be used.
 * @return {Object} Promise
 * @public
 */

const parseInput = (input, config) =>
    loaders.loadParser(config).then(parser => new Promise((resolve, reject) => {

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
 * Parse array of directory globs and/or files, and then render the parsed data through the defined layout plugin.
 *
 *     parseInputs(['src/main.js'], {'parser': 'dox', 'layout': 'markdown'}).then(content => {});
 *
 * @param {Array} inputs Array of directory globs and/or files.
 * @param {Object} config Configuration object.
 * @param {String} config.parser String representing the parser to be used.
 * @param {String} config.layout String representing the layout plugin to be used.
 * @return {Object} Promise
 * @public
 */

const parseInputs = (inputs, config) => loaders.loadPlugin(config).then(plugin =>
        globby(inputs.concat(
            DEFAULT_IGNORE_PATHS,
            formatPathsArrayToIgnore(config.ignore)
        ), {'nodir': true}).then(files =>
            Promise.all(files.map(input => parseInput(input, config))))
                .then(files => plugin(Object.assign({
                    files
                }, config))));

module.exports = {
    parseInput,
    parseInputs
};
