var fs = require('fs'),
    dox = require('dox'),
    hbs = require('handlebars'),
    helpers = require('../lib/helpers')(hbs),
    utils = require('../lib/utils');

var templates = {
    bootstrap: require('../templates/bootstrap.hbs'),
    markdown: require('../templates/markdown.hbs')
};

exports.parseScript = function (script, output, config) {

    fs.exists(script, function (exists) {

        var content,
            data;

        if (exists) {

            data = dox.parseComments(fs.readFileSync(script, 'utf8'));

            if (templates[config.layout]) {

                content = templates[config.layout]({
                    title: config.title,
                    description: config.description,
                    methods: utils.parseData(data)
                });

                if (output) {

                    fs.writeFileSync(output, content, 'utf8');

                } else {

                    process.stdout.write(content);

                }

            } else {

                process.stdout.write('Invalid layout specified.' + '\n');

            }

        } else {

            process.stdout.write('File not found.' + '\n');

        }

    });

}

