const fs = require('fs');
const path = require('path');

const Handlebars = require('handlebars');

/**
 * Custom Handlebars template plugin for doxdox.
 *
 * @example parseInputs(inputs, {'parser': 'dox', 'layout': 'template.hbs'}).then(content => console.log(content));
 * @param {Array} data Methods parsed using a doxdox parser.
 * @return {Promise} Promise with generated content.
 * @public
 */

const plugin = data => new Promise((resolve, reject) => {

    fs.readFile(path.join(process.cwd(), data.layout), 'utf8', (err, contents) => {

        if (err) {

            return reject(err);

        }

        const template = Handlebars.compile(contents);

        return resolve(template(data));

    });

});

module.exports = plugin;
