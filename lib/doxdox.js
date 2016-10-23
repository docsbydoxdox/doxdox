const fs = require('fs');

const globby = require('globby');

const HANDLEBARS_REGEX = /\.(hbs|handlebars)$/;

const DEFAULT_IGNORE_PATHS = [
    '!**/{node_modules,bower_components,test}/**',
    '!**/Gruntfile.js',
    '!**/Gulpfile.js'
];

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

const parseInput = (input, config) =>
    loadParser(config).then(parser => new Promise((resolve, reject) => {

        fs.readFile(input, 'utf8', (err, data) => {

            if (err) {

                return reject(err);

            }

            const filename = input.replace(`${process.cwd()}/`, '');

            return resolve({
                'methods': parser(data, filename),
                'name': filename
            });

        });

    }));

const parseInputs = (inputs, config) => loadPlugin(config).then(layout =>
        globby(inputs.concat(DEFAULT_IGNORE_PATHS), {'nodir': true}).then(files =>
            Promise.all(files.map(input => parseInput(input, config))))
                .then(files => layout(Object.assign({
                    files
                }, config))));

module.exports = {
    parseInput,
    parseInputs
};
