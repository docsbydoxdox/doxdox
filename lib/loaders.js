'use strict';

const fs = require('fs');
const {join, isAbsolute} = require('path');

const HANDLEBARS_PATTERN = /\.(hbs|handlebars)$/;
const JAVASCRIPT_PATTERN = /\.(js)$/;

const NODE_MODULE_DIRECTORIES = [
    join(__dirname, '../node_modules'),
    join(process.cwd(), 'node_modules')
];

/**
* Find which node_modules directory to load package from.
*
*     findPackagePath('doxdox-parser-dox').then(parser => {});
*     findPackagePath('doxdox-plugin-bootstrap').then(plugin => {});
*
* @param {String} pkg Package name as string.
* @return {Object} Promise
* @private
*/

const findPackagePath = pkg =>
    Promise.all(NODE_MODULE_DIRECTORIES.map(dir => new Promise(resolve => {

        const path = `${dir}/${pkg}`;

        fs.stat(path, (err, stats) => {

            if (!err && stats.isDirectory()) {

                return resolve(path);

            }

            return resolve(null);

        });

    }))).then(dirs => dirs.filter(dir => dir));

/**
 * Load parser based on user defined choice.
 *
 *     loadParser({'parser': 'dox'}).then(parser => {});
 *     loadParser({'parser': 'parser.js'}).then(parser => {});
 *
 * @param {Object} config Configuration object.
 * @param {String} config.parser String representing the parser to be loaded.
 * @return {Object} Promise
 * @private
 */

const loadParser = config => new Promise((resolve, reject) => {
    if (isAbsolute(config.parser)) {

      return config.parser

    }

    fs.stat(config.parser, (err, stats) => {

        if (err) {

            findPackagePath(`doxdox-parser-${config.parser}`).then(parser => {

                if (parser.length) {

                    resolve(require(parser[0]));

                } else {

                    reject(new Error('Invalid parser specified.'));

                }

            });

        } else if (stats && stats.isFile() && config.parser.match(JAVASCRIPT_PATTERN)) {

            resolve(require(join(process.cwd(), config.parser)));

        } else {

            reject(new Error('Invalid parser specified.'));

        }

    });

});

/**
 * Load layout plugin based on user defined choice.
 *
 *     loadPlugin({'layout': 'markdown'}).then(plugin => {});
 *     loadPlugin({'layout': 'templates/README.hbs'}).then(plugin => {});
 *     loadPlugin({'layout': 'plugin.js'}).then(plugin => {});
 *
 * @param {Object} config Configuration object.
 * @param {String} config.layout String representing the layout plugin to be loaded.
 * @return {Object} Promise
 * @private
 */

const loadPlugin = config => new Promise((resolve, reject) => {
    if (isAbsolute(config.layout)) {

      return config.layout

    }

    fs.stat(config.layout, (err, stats) => {

        if (err) {

            findPackagePath(`doxdox-plugin-${config.layout}`).then(plugin => {

                if (plugin.length) {

                    resolve(require(plugin[0]));

                } else {

                    reject(new Error('Invalid layout specified.'));

                }

            });

        } else if (stats && stats.isFile() && config.layout.match(HANDLEBARS_PATTERN)) {

            resolve(require('doxdox-plugin-handlebars'));

        } else if (stats && stats.isFile() && config.layout.match(JAVASCRIPT_PATTERN)) {

            resolve(require(join(process.cwd(), config.layout)));

        } else {

            reject(new Error('Invalid layout specified.'));

        }

    });

});

module.exports = {
    findPackagePath,
    loadParser,
    loadPlugin
};
