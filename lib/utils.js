var fs = require('fs'),
    path = require('path'),
    q = require('q'),
    hbs = require('handlebars'),
    helpers = require('../lib/helpers')(hbs),
    admzip = require('adm-zip'),
    temp = require('temp').track(),
    sqlite3 = require('sqlite3').verbose();

module.exports.buildDashDocSet = function (input) {

    var deferred = new q.defer(),
        zip = new admzip(),
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

                if (method.tags.property) {

                    method.tags.property.forEach(function (property) {

                        db.run('INSERT OR IGNORE INTO searchIndex(name, type, path) VALUES ($name, $type, $path);', {
                            $name: method.name + '.' + property.name,
                            $type: 'Property',
                            $path: method.uid + '.html#//apple_ref/cpp/Property/' + property.name
                        });

                    });

                }

            });

        });

    });

    db.close(function (err) {

        if (err) { return deferred.reject(err); }

        zip.addFile(
            input.title + '.docset/Contents/Resources/docSet.dsidx',
            fs.readFileSync(tempdb.path)
        );

        deferred.resolve(zip.toBuffer());

    });

    return deferred.promise;

};


module.exports.buildWiki = function (input) {

    var deferred = new q.defer(),
        zip = new admzip(),
        template = require('../templates/wiki/methods.hbs');

    input.uid = module.exports.formatStringForUID(input.title);

    input.files.forEach(function (file) {

        file.methods.forEach(function (method) {

            zip.addFile(
                file.name + '/' + method.name + '.md',
                template(method)
            );

        });

    });

    deferred.resolve(zip.toBuffer());

    return deferred.promise;

};

module.exports.findPackagePath = function (input) {

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

    content = content.replace(/\.prototype|\(\)/g, '');

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

    data.forEach(function (item) {

        var method = {},
            params = {
                required: [],
                optional: []
            };

        if (!item.ignore && item.ctx) {

            method.uid = module.exports.formatStringForUID(file + '-' + item.ctx.string);

            method.isPrivate = item.isPrivate;
            method.type = item.ctx.type;
            method.name = module.exports.formatStringForName(item.ctx.string);

            method.description = item.description.summary;
            method.body = item.description.body;

            method.tags = {};
            method.tags.example = [];

            item.tags.forEach(function (tag_data) {

                var tag = {};

                if (method.tags[tag_data.type] === undefined) {

                    method.tags[tag_data.type] = [];

                }

                if (tag_data.types && tag_data.types.length) {

                    if (tag_data.name) {

                        tag.name = tag_data.name.replace(/^\[|\]$/g, '');
                        tag.isOptional = tag_data.optional;

                    }

                    tag.types = tag_data.types;

                    tag.description = tag_data.description;

                    method.tags[tag_data.type].push(tag);

                } else if (tag_data.string) {

                    method.tags[tag_data.type].push(tag_data.string);

                }

            });

            if (method.tags.param) {

                method.tags.param.forEach(function (param) {

                    if (param.name && !param.name.match(/\./)) {

                        if (param.isOptional) {

                            params.optional.push(param.name);

                        } else {

                            params.required.push(param.name);

                        }

                    }

                });

                method.params = params.required.join(', ');

                if (params.optional.length) {

                    if (method.params) {

                        method.params += '[, ' + params.optional.join(', ') + ']';

                    } else {

                        method.params += '[' + params.optional.join(', ') + ']';

                    }

                }

            }

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

        options.exception = /\/(\.git|node_modules|bower_components|test(s)?|gruntfile\.js|gulpfile\.js)$|\.min/i;

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
