var fs = require('fs'),
    path = require('path'),
    dox = require('dox'),
    hbs = require('handlebars'),
    helpers = require('../lib/helpers')(hbs),
    Promise = require('promise'),
    utils = require('../lib/utils');

var templates = {
    bootstrap: require('../templates/bootstrap.hbs'),
    markdown: require('../templates/markdown.hbs'),
    dash: utils.buildDashDocSet
};

exports.parseInput = function (input, config) {

    var files = [],
        stat;

    if (fs.existsSync(input)) {

        stat = fs.statSync(input);

        if (stat.isDirectory()) {

            utils.walk(input).forEach(function (file) {

                files.push({
                    name: file.replace(input, '').replace(/^\//, ''),
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

    return exports.parseScripts(files, config);

};

exports.parseScripts = function (scripts, config) {

    var files = [],
        content,
        template;

    scripts.forEach(function (script) {

        var methods = dox.parseComments(script.contents);

        if (methods) {

            files.push({
                name: script.name,
                methods: utils.parseData(methods, script.name)
            });

        }

    });

    if (fs.existsSync(path.resolve(config.layout))) {

        template = require(path.resolve(config.layout));

    } else if (templates[config.layout.toLowerCase()]) {

        template = templates[config.layout.toLowerCase()];

    }

    if (template) {

        content = template({
            title: config.title,
            description: config.description,
            files: files
        });

        if (typeof content.then === 'function') {

            content.then(function (output) {

                content = output;

            });

        }

    } else {

        console.error('Invalid layout specified.' + '\n');

    }

    return new Promise(function (resolve) {

        resolve(content);

    });

};
