var fs = require('fs');

module.exports.walk = function (dir, opts) {

    var files = [];

    if (!opts) {
        opts = {};
    }

    if (!opts.match) {
        opts.match = /\.js$/;
    }

    if (!opts.exception) {
        opts.exception = /\.git|\.min|node_modules|test|gruntfile/i;
    }

    if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {

        fs.readdirSync(dir).forEach(function (file) {

            var stat;

            file = (dir + '/' + file).replace(/\/+/g, '/');

            stat = fs.statSync(file);

            if (stat.isFile() &&
                    file.match(opts.match) &&
                    !file.match(opts.exception)) {

                files.push(file);

            } else if (stat.isDirectory() &&
                    !file.match(opts.exception)) {

                files = files.concat(module.exports.walk(file + '/', opts));

            }

        });

    }

    return files;

};

module.exports.parseData = function (data) {

    data.forEach(function (methods) {

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
