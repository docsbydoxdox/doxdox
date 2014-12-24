var hljs = require('highlight.js'),
    marked = require('marked');

module.exports = function (hbs) {

    hbs.registerHelper('highlightBlock', function (block) {

        return hljs.highlight('javascript', block).value;

    });

    hbs.registerHelper('markdown', function (block) {

        return marked(block);

    });

};
