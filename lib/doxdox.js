var fs = require('fs'),
    path = require('path'),
    dox = require('dox'),
    hbs = require('handlebars'),
    helpers = require('../lib/helpers')(hbs),
    Promise = require('promise'),
    utils = require('../lib/utils');

module.exports.templates = {
    bootstrap: require('../templates/bootstrap.hbs'),
    markdown: require('../templates/markdown.hbs'),
    dash: utils.buildDashDocSet
};

module.exports.parseInput = function (input, config, pkg) {

    var files = [],
        stat;

    if (fs.existsSync(input)) {

        stat = fs.statSync(input);

        if (stat.isDirectory()) {

            utils.walk(input).forEach(function (file) {

                files.push({
                    name: file.replace(input, '').replace(/^[\.\/]{1,2}/, ''),
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

        process.stdout.write('File or directory not found.\n');
        process.kill();

    }

    return exports.parseScripts(files, config, pkg);

};

module.exports.parseScripts = function (scripts, config, pkg) {

    var files = [],
        content,
        template;

    scripts.forEach(function (script) {

        var methods = utils.parseData(
            dox.parseComments(script.contents, { raw: true }),
            script.name
        );

        if (methods.length) {

            files.push({
                name: script.name,
                methods: methods
            });

        }

    });

    if (fs.existsSync(path.resolve(config.layout))) {

        template = require(path.resolve(config.layout));

    } else if (exports.templates[config.layout.toLowerCase()]) {

        template = exports.templates[config.layout.toLowerCase()];

    }

    if (template) {

        content = template({
            title: config.title,
            description: config.description,
            files: files,
            pkg: pkg
        });

        if (typeof content.then === 'function') {

            content.then(function (output) {

                content = output;

            });

        }

    } else {

        console.error('Invalid layout specified.\n');

    }

    return new Promise(function (resolve) {

        resolve(content);

    });

};
