var hljs = require('highlight.js'),
    markdown = require('markdown-it')({
        html: true,
        highlight: function (code) {
            return hljs.highlight('javascript', code).value;
        }
    });

module.exports = function (hbs) {

    hbs.registerHelper('highlightBlock', function (block) {

        return hljs.highlight('javascript', block).value;

    });

    hbs.registerHelper('markdown', function (block) {

        return markdown.render(block);

    });

};
