const assert = require('assert');
const path = require('path');

const loaders = require('../../lib/loaders');

describe('loaders', () => {

    describe('findPackagePath', () => {

        it('find package', () =>
            loaders.findPackagePath('doxdox-parser-dox'));

        it('fail to find package', () =>

            loaders.findPackagePath('doxdox-parser-jsdoc').then(parser => {

                assert.deepEqual(parser, []);

            })

        );

        it('fail to find package when file is passed', () =>

            loaders.findPackagePath('.bin/dox').then(parser => {

                assert.deepEqual(parser, []);

            })

        );

    });

    describe('loadParser', () => {

        const PARSER_PATH = './test/fixtures/parser.js';
        const PARSER_PATH_ABSOLUTE = path.resolve(PARSER_PATH);

        it('loads dox parser', () =>
            loaders.loadParser({'parser': 'dox'})
                .then(parser => assert.equal(typeof parser, 'function')));

        it('loads custom parser when file is specified', () =>
            loaders.loadParser({'parser': PARSER_PATH})
                .then(parser => assert.equal(typeof parser, 'function')));

        it.skip('loads custom parser when file (absolute path) is specified', () =>
            loaders.loadParser({'parser': PARSER_PATH_ABSOLUTE})
                .then(parser => assert.equal(typeof parser, 'function')));

        it('fails on invalid parser', () =>
            loaders.loadParser({'parser': 'invalid'}).catch(err => {

                if (err) {

                    console.log(err);

                }

            }));

        it('fails on invalid custom parser', () =>
            loaders.loadParser({'parser': './test/fixtures/template.html'}).catch(err => {

                if (err) {

                    console.log(err);

                }

            }));

    });

    describe('loadPlugin', () => {

        const TEMPLATE_PATH = './test/fixtures/template.hbs';
        const TEMPLATE_PATH_ABSOLUTE = path.resolve(TEMPLATE_PATH);

        const PLUGIN_PATH = './test/fixtures/plugin.js';
        const PLUGIN_PATH_ABSOLUTE = path.resolve(PLUGIN_PATH);

        it('loads markdown plugin', () =>
            loaders.loadPlugin({'layout': 'markdown'})
                .then(plugin => assert.equal(typeof plugin, 'function')));

        it('loads custom handlebars plugin when file is specified', () =>
            loaders.loadPlugin({'layout': TEMPLATE_PATH})
                .then(plugin => assert.equal(typeof plugin, 'function')));

        it.skip('loads custom handlebars plugin when file (absolute path) is specified', () =>
            loaders.loadPlugin({'layout': TEMPLATE_PATH_ABSOLUTE})
                .then(plugin => assert.equal(typeof plugin, 'function')));

        it('load custom plugin via JavaScript file', () =>
            loaders.loadPlugin({'layout': PLUGIN_PATH})
                .then(plugin => assert.equal(typeof plugin, 'function')));

        it.skip('load custom plugin via JavaScript file (absolute path)', () =>
            loaders.loadPlugin({'layout': PLUGIN_PATH_ABSOLUTE})
                .then(plugin => assert.equal(typeof plugin, 'function')));

        it('fails on invalid plugin', () =>
            loaders.loadPlugin({'layout': 'invalid'}).catch(err => {

                if (err) {

                    console.log(err);

                }

            }));

        it('fails on invalid custom template', () =>
            loaders.loadPlugin({'layout': './test/fixtures/template.html'}).catch(err => {

                if (err) {

                    console.log(err);

                }

            }));

    });

});
