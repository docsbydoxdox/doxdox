const fs = require('fs');

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

    fs.stat(input, (err, stats) => {

        if (err) {

            return reject(err);

        }

        if (stats.isFile()) {

            fs.readFile(input, 'utf8', (err, data) => {

                if (err) {

                    return reject(err);

                }

                return resolve({
                    'methods': parser(data, input),
                    'name': input.replace(process.cwd(), '')
                });

            });

        }

        return false;

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

        Promise.all(inputs.map(input => parseInput(input, config)))
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
