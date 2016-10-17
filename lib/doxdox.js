const fs = require('fs');

const parseInput = (input, config) => new Promise((resolve, reject) => {

    let parser = () => null;

    if (!config.parser) {

        parser = require('doxdox-parser-dox');

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
                    'methods': parser(data, {'file': input}),
                    'name': input.replace(process.cwd(), '')
                });

            });

        }

        return false;

    });

});

const parseInputs = (inputs, config) => new Promise(resolve => {

    let layout = () => null;

    if (!config.layout || config.layout === 'markdown') {

        layout = require('doxdox-plugin-markdown');

    }

    if (inputs.length) {

        Promise.all(inputs.map(input => parseInput(input, config)))
            .then(files => layout(Object.assign({
                files
            }, config)))
            .then(resolve);

    }

});

module.exports = {
    parseInputs
};
