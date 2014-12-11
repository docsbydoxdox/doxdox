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
            db = new sqlite3.Database(tempdb.path);

        input.uid = module.exports.formatStringForUID(input.title);

        input.files.forEach(function (file) {

            file.methods.forEach(function (method) {

                if (!method.ignore && method.ctx) {

                    zip.addFile(
                        input.title + '.docset/Contents/Resources/Documents/' + method.ctx.uid + '.html',
                        require('../templates/dash/index.hbs')(method)
                    );

                }

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

                    if (!method.ignore && method.ctx) {

                        db.run('INSERT OR IGNORE INTO searchIndex(name, type, path) VALUES ($name, $type, $path);', {
                            $name: hbs.helpers.formatName(method.ctx.string),
                            $type: method.ctx.type.replace(/^[a-z]/, function (match) { return match.toUpperCase(); }),
                            $path: method.ctx.uid + '.html'
                        });

                    }

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

module.exports.formatStringForUID = function (content) {

    content = String(content).toLowerCase();

    content = content.replace(/[^\w\.]+/g, '-');
    content = content.replace(/^-|-$/g, '');

    return content;

};

module.exports.parseData = function (data, file) {

    data.forEach(function (method) {

        if (method.ctx) {

            method.ctx.uid = file + '-' + module.exports.formatStringForUID(method.ctx.string);

        }

        if (method.tags) {

            method.tags.forEach(function (tag) {

                if (tag.name && tag.optional) {

                    tag.name = tag.name.replace(/^\[|\]$/g, '');

                }

            });

        }

    });

    return data;

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
