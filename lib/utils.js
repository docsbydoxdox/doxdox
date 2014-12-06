var fs = require('fs'),
    path = require('path'),
    hbs = require('handlebars'),
    helpers = require('../lib/helpers')(hbs),
    admzip = require('adm-zip'),
    temp = require('temp').track(),
    sqlite3 = require('sqlite3').verbose();

module.exports.buildDashDocSet = function (input) {

    var zip = new admzip(),
        tempdb = temp.openSync('temp.sqlite'),
        db = new sqlite3.Database(tempdb.path);

    input.uid = module.exports.formatStringForUID(input.title);

    zip.addFile(
        input.title + '.docset/Contents/Resources/Documents/index.html',
        require('../templates/dash/index.hbs')(input)
    );

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
                        $path: 'index.html#' + method.ctx.uid
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

        if (input.output) {

            fs.writeFileSync(input.output, zip.toBuffer(), 'utf8');

        }

    });

    if (!input.output) {

        console.error('Not avalible through stdout. Please use the --output flag instead.');

    }

    return false;

};

module.exports.findPackage = function (input) {

    var stat,
        pkg;

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

    data.forEach(function (methods) {

        if (methods.ctx) {

            methods.ctx.uid = file + '-' + module.exports.formatStringForUID(methods.ctx.string);

        }

        if (methods.tags) {

            methods.tags.forEach(function (tag) {

                if (tag.types) {

                    tag.types.forEach(function (type, index) {

                        if (type.match(/\?/g)) {

                            tag.types[index] = type.replace(/\?/g, '');

                        }

                    });

                }

            });

        }

    });

    return data;

};

module.exports.walk = function (dir, opts) {

    var files = [];

    if (!opts) {

        opts = {};

    }

    if (!opts.match) {

        opts.match = /\.js$/;

    }

    if (!opts.exception) {

        opts.exception = /\.git|\.min|node_modules|bower_components|test|gruntfile|gulpfile/i;

    }

    if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {

        fs.readdirSync(dir).forEach(function (file) {

            var stat;

            file = path.normalize(dir + '/' + file);

            stat = fs.statSync(file);

            if (stat.isDirectory() && !file.match(opts.exception)) {

                files = files.concat(module.exports.walk(file, opts));

            } else if (stat.isFile() && file.match(opts.match) && !file.match(opts.exception)) {

                files.push(file);

            }

        });

    }

    return files;

};
