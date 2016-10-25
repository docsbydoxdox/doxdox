const loaders = require('../../lib/loaders');

describe('loaders', () => {

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

    });

});
