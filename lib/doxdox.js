var fs = require('fs'),
    path = require('path'),
    q = require('q'),
    dox = require('dox'),
    hbs = require('handlebars'),
    helpers = require('../lib/helpers')(hbs),
    utils = require('../lib/utils');

module.exports.templates = {
    bootstrap: require('../templates/bootstrap.hbs'),
    markdown: require('../templates/markdown.hbs'),
    dash: utils.buildDashDocSet,
    wiki: utils.buildWiki
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

    var deferred = new q.defer(),
        files = [],
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

    if (exports.templates[config.layout.toLowerCase()]) {

        template = exports.templates[config.layout.toLowerCase()];

    } else if (fs.existsSync(path.resolve(config.layout))) {

        template = require(path.resolve(config.layout));

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

                deferred.resolve(output);

            });

        }

    } else {

        console.error('Invalid layout specified.\n');

    }

    return deferred.promise;

};
