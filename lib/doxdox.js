var fs = require('fs'),
    path = require('path'),
    dox = require('dox'),
    hbs = require('handlebars'),
    helpers = require('../lib/helpers')(hbs),
    utils = require('../lib/utils');

var templates = {
    bootstrap: require('../templates/bootstrap.hbs'),
    markdown: require('../templates/markdown.hbs')
};

exports.parseInput = function (input, output, config) {

    var files = [],
        stat;

    if (fs.existsSync(input)) {

        stat = fs.statSync(input);

        if (stat.isDirectory()) {

            utils.walk(input).forEach(function (file) {

                files.push({
                    name: file.replace(input, ''),
                    contents: fs.readFileSync(file, 'utf8')
                });

            });

        } else if (stat.isFile()) {

            files.push({
                name: path.basename(input),
                contents: fs.readFileSync(input, 'utf8')
            });

        }

    } else {

        process.stdout.write('File or directory not found.' + '\n');
        process.kill();

    }

    return exports.parseScripts(files, output, config);

};

exports.parseScripts = function (scripts, output, config) {

    var files = [],
        content;

    scripts.forEach(function (script) {

        var methods = dox.parseComments(script.contents);

        if (methods) {

            files.push({
                name: script.name,
                methods: utils.parseData(methods, script.name)
            });

        }

    });

    if (templates[config.layout]) {

        content = templates[config.layout]({
            title: config.title,
            description: config.description,
            files: files
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
