const assert = require('assert');

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

        it('loads dox parser', () => loaders.loadParser({'parser': 'dox'}));

        it('fails on invalid parser', () =>
            loaders.loadParser({'parser': 'invalid'}).catch(err => {

                if (err) {

                    console.log(err);

                }

            }));

    });

    describe('loadPlugin', () => {

        it('loads markdown plugin', () => loaders.loadPlugin({'layout': 'markdown'}));

        it('loads custom handlebars plugin when file is specified', () =>
            loaders.loadPlugin({'layout': './test/fixtures/template.hbs'}));

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

        it('load custom plugin via JavaScript file', () =>
            loaders.loadPlugin({'layout': './test/fixtures/plugin.js'}));

    });

});
