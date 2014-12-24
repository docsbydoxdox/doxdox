var fs = require('fs'),
    path = require('path'),
    hbs = require('handlebars'),
    helpers = require('../lib/helpers')(hbs),
    Promise = require('promise'),
    admzip = require('adm-zip'),
    temp = require('temp').track(),
    sqlite3 = require('sqlite3').verbose();

module.exports.buildDashDocSet = function (input) {

    return new Promise(function (resolve) {

        var zip = new admzip(),
            tempdb = temp.openSync('temp.sqlite'),
            db = new sqlite3.Database(tempdb.path),
            template = require('../templates/dash/method.hbs');

        input.uid = module.exports.formatStringForUID(input.title);

        input.files.forEach(function (file) {

            file.methods.forEach(function (method) {

                zip.addFile(
                    input.title + '.docset/Contents/Resources/Documents/' + method.uid + '.html',
                    template(method)
                );

            });

        });

        zip.addFile(
            input.title + '.docset/Contents/Info.plist',
            require('../templates/dash/plist.hbs')(input)
        );

        [
            'bootstrap/bootstrap.min.css',
            'highlight.js/github.min.css'
        ].forEach(function (resource) {

            zip.addLocalFile(
                path.join(__dirname, '../templates/dash/resources/' + resource),
                input.title + '.docset/Contents/Resources/Documents/resources/' + path.dirname(resource)
            );

        });

        db.serialize(function () {

            db.run('CREATE TABLE searchIndex(id INTEGER PRIMARY KEY, name TEXT, type TEXT, path TEXT);');
            db.run('CREATE UNIQUE INDEX anchor ON searchIndex (name, type, path);');

            input.files.forEach(function (file) {

                file.methods.forEach(function (method) {

                    db.run('INSERT OR IGNORE INTO searchIndex(name, type, path) VALUES ($name, $type, $path);', {
                        $name: method.name,
                        $type: method.type.replace(/^[a-z]/, function (match) { return match.toUpperCase(); }),
                        $path: method.uid + '.html'
                    });

                });

            });

        });

        db.close(function () {

            zip.addFile(
                input.title + '.docset/Contents/Resources/docSet.dsidx',
                fs.readFileSync(tempdb.path)
            );

            resolve(zip.toBuffer());

        });

    });

};

module.exports.findPackage = function (input) {

    var pkg,
        stat;

    if (fs.existsSync(input)) {

        stat = fs.statSync(input);

        if (stat.isDirectory()) {

            pkg = path.normalize(path.resolve(input) + '/package.json');

        } else if (stat.isFile()) {

            pkg = path.normalize(path.resolve(path.dirname(input)) + '/package.json');

        }

    }

    return pkg;

};

module.exports.formatStringForName = function (content) {

    content = String(content);

    content = content.replace(/\.prototype/g, '');

    return content;

};

module.exports.formatStringForUID = function (content) {

    content = String(content).toLowerCase();

    content = content.replace(/[^\w\.]+/g, '-');
    content = content.replace(/^-|-$/g, '');

    return content;

};

module.exports.parseData = function (data, file) {

    var methods = [];

    data.forEach(function (data_method) {

        var method = {};

        if (!data_method.ignore && data_method.ctx) {

            method.uid = module.exports.formatStringForUID(file + '-' + data_method.ctx.string);

            method.isPrivate = data_method.isPrivate;
            method.type = data_method.ctx.type;
            method.name = module.exports.formatStringForName(data_method.ctx.string);

            method.description = data_method.description.summary;
            method.body = data_method.description.body;

            method.tags = {};
            method.tags.example = [];

            data_method.tags.forEach(function (data_tag) {

                var tag = {};

                if (method.tags[data_tag.type] === undefined) {

                    method.tags[data_tag.type] = [];

                }

                if (data_tag.types && data_tag.types.length) {

                    if (data_tag.name) {

                        tag.name = data_tag.name.replace(/^\[|\]$/g, '');
                        tag.isOptional = data_tag.optional;

                    }

                    tag.types = data_tag.types;

                    tag.description = data_tag.description;

                    method.tags[data_tag.type].push(tag);

                } else if (data_tag.string) {

                    method.tags[data_tag.type].push(data_tag.string);

                }

            });

            methods.push(method);

        }

    });

    return methods;

};

module.exports.walk = function (dir, options) {

    var files = [];

    if (!options) {

        options = {};

    }

    if (!options.match) {

        options.match = /\.js$/;

    }

    if (!options.exception) {

        options.exception = /\.git|\.min|node_modules|bower_components|test|gruntfile|gulpfile/i;

    }

    if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {

        fs.readdirSync(dir).forEach(function (file) {

            var stat;

            file = path.normalize(dir + '/' + file);

            stat = fs.statSync(file);

            if (stat.isDirectory() && !file.match(options.exception)) {

                files = files.concat(module.exports.walk(file, options));

            } else if (stat.isFile() && file.match(options.match) && !file.match(options.exception)) {

                files.push(file);

            }

        });

    }

    return files;

};
