var fs = require('fs'),
    path = require('path');

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

                            tag.optional = true;
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
