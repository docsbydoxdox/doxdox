var fs = require('fs'),
    dox = require('dox'),
    hbs = require('handlebars'),
    helpers = require('../lib/helpers')(hbs),
    utils = require('../lib/utils');

var templates = {
    bootstrap: require('../templates/bootstrap.hbs'),
    markdown: require('../templates/markdown.hbs')
};

exports.parseFile = function (file, output, config) {

    if (fs.existsSync(file)) {

        return exports.parseScript(fs.readFileSync(file, 'utf8'), output, config);

    } else {

        process.stdout.write('File not found.' + '\n');

    }

}

exports.parseScript = function (script, output, config) {

    var content,
        data = dox.parseComments(script);

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

            return content;

        }

    } else {

        process.stdout.write('Invalid layout specified.' + '\n');

    }

}
