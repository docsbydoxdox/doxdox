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
