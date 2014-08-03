module.exports = function (hbs) {

    var context;

    hbs.registerHelper('ifCond', function (a, b, options) {
        return a === b ? options.fn(this) : options.inverse(this);
    });

    hbs.registerHelper('formatId', function (name) {
        return String(name).toLowerCase().replace(/[^\w\.]+/g, '');
    });

    hbs.registerHelper('formatName', function (name) {
        return String(name).replace(/\.prototype/g, '');
    });

    hbs.registerHelper('registerContext', function () {
        context = this;
    });

    hbs.registerHelper('registerVariable', function (name, value) {
        context[name] = value;
    });

};
