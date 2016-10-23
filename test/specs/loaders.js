const loaders = require('../../lib/loaders');

describe('loaders', () => {

    describe('loadParser', () => {

        it('loads dox parser', done => {

            loaders.loadParser({'parser': 'dox'}).then(() => {

                done();

            });

        });

        it('fails on invalid parser', done => {

            loaders.loadParser({'parser': 'invalid'}).catch(() => {

                done();

            });

        });

    });

    describe('loadPlugin', () => {

        it('loads markdown plugin', done => {

            loaders.loadPlugin({'layout': 'markdown'}).then(() => {

                done();

            });

        });

        it('loads custom handlebars plugin when file is specified', done => {

            loaders.loadPlugin({'layout': './test/fixtures/template.hbs'}).then(() => {

                done();

            });

        });

        it('fails on invalid plugin', done => {

            loaders.loadPlugin({'layout': 'invalid'}).catch(() => {

                done();

            });

        });

        it('fails on invalid custom template', done => {

            loaders.loadPlugin({'layout': './test/fixtures/template.html'}).catch(() => {

                done();

            });

        });

    });

});
