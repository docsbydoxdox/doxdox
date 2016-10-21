const fs = require('fs');

const globby = require('globby');

const DEFAULT_IGNORE_PATHS = [
    '!**/{node_modules,bower_components,test}/**',
    '!**/Gruntfile.js',
    '!**/Gulpfile.js'
];

const parseInput = (input, config) => new Promise((resolve, reject) => {

    let parser = () => null;

    if (config.parser) {

        const parserString = `doxdox-parser-${config.parser}`;

        try {

            if (require.resolve(parserString)) {

                parser = require(parserString);

            }

        } catch (err) {

            reject('Invalid parser specified.');

        }

    }

    fs.readFile(input, 'utf8', (err, data) => {

        if (err) {

            return reject(err);

        }

        return resolve({
            'methods': parser(data, input),
            'name': input.replace(process.cwd(), '')
        });

    });

});

const parseInputs = (inputs, config) => new Promise((resolve, reject) => {

    let layout = () => null;

    if (config.layout) {

        const layoutString = `doxdox-plugin-${config.layout}`;

        try {

            if (require.resolve(layoutString)) {

                layout = require(layoutString);

            }

        } catch (err) {

            reject('Invalid layout specified.');

        }

    }

    if (inputs.length) {

        globby(inputs.concat(DEFAULT_IGNORE_PATHS), {'nodir': true}).then(files =>
            Promise.all(files.map(input => parseInput(input, config))))
                .then(files => layout(Object.assign({
                    files
                }, config)))
                .then(resolve)
                .catch(reject);

    }

});

module.exports = {
    parseInputs
};
