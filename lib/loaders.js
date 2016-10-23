const fs = require('fs');

const HANDLEBARS_REGEX = /\.(hbs|handlebars)$/;

/**
 * Load parser based on user defined choice.
 *
 *     loadParser({'parser': 'dox'}).then(parser => {});
 *
 * @param {Object} config Configuration object.
 * @param {String} config.parser String representing the parser to be loaded.
 * @return {Object} Promise
 * @private
 */

const loadParser = config => new Promise((resolve, reject) => {

    const parserString = `doxdox-parser-${config.parser}`;

    try {

        if (require.resolve(parserString)) {

            resolve(require(parserString));

        }

    } catch (err) {

        reject('Invalid parser specified.');

    }

});

/**
 * Load layout plugin based on user defined choice.
 *
 *     loadPlugin({'layout': 'markdown'}).then(plugin => {});
 *     loadPlugin({'layout': 'templates/README.md'}).then(plugin => {});
 *
 * @param {Object} config Configuration object.
 * @param {String} config.layout String representing the layout plugin to be loaded.
 * @return {Object} Promise
 * @private
 */

const loadPlugin = config => new Promise((resolve, reject) => {

    fs.stat(config.layout, (err, stats) => {

        if (err) {

            const layoutString = `doxdox-plugin-${config.layout}`;

            try {

                if (require.resolve(layoutString)) {

                    resolve(require(layoutString));

                }

            } catch (err) {

                reject('Invalid layout specified.');

            }

        } else if (stats && stats.isFile() && config.layout.match(HANDLEBARS_REGEX)) {

            resolve(require('doxdox-plugin-handlebars'));

        } else {

            reject('Invalid layout specified.');

        }

        return false;

    });

});

module.exports = {
    loadParser,
    loadPlugin
};
