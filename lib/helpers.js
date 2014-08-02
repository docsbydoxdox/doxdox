module.exports = function (hbs) {

    hbs.registerHelper('ifCond', function (a, b, options) {
        return a === b ? options.fn(this) : options.inverse(this);
    });

    hbs.registerHelper('formatId', function (name) {
        return String(name).toLowerCase().replace(/[^\w\.]+/g, '');
    });

    hbs.registerHelper('formatName', function (name) {
        return String(name).replace(/\.prototype/g, '');
    });

};
