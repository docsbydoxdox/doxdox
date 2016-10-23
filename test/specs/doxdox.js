const doxdox = require('../../lib/doxdox');

describe('doxdox', () => {

    describe('loadParser', () => {

        it('loads dox parser', done => {

            doxdox.loadParser({'parser': 'dox'}).then(() => {

                done();

            });

        });

        it('fails on invalid parser', done => {

            doxdox.loadParser({'parser': 'invalid'}).catch(() => {

                done();

            });

        });

    });

    describe('loadPlugin', () => {

        it('loads markdown plugin', done => {

            doxdox.loadPlugin({'layout': 'markdown'}).then(() => {

                done();

            });

        });

        it('loads custom handlebars plugin when file is specified', done => {

            doxdox.loadPlugin({'layout': './test/fixtures/template.hbs'}).then(() => {

                done();

            });

        });

        it('fails on invalid plugin', done => {

            doxdox.loadPlugin({'layout': 'invalid'}).catch(() => {

                done();

            });

        });

        it('fails on invalid custom template', done => {

            doxdox.loadPlugin({'layout': './test/fixtures/template.html'}).catch(() => {

                done();

            });

        });

    });

});
