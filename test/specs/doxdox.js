const assert = require('assert');
const fs = require('fs');

const doxdox = require('../../lib/doxdox');

describe('doxdox', () => {

    describe('parseInput', () => {

        it('parses input from file', done => {

            doxdox.parseInput('./lib/doxdox.js', {'parser': 'dox'}).then(() => {

                done();

            });

        });

    });

    describe('parseInputs', () => {

        it('parses multiple input from array', done => {

            doxdox.parseInputs(['./lib/doxdox.js'], {
                'description': '',
                'layout': 'markdown',
                'parser': 'dox',
                'title': 'Untitled Project'
            }).then(content => {

                assert.equal(content, fs.readFileSync('./test/fixtures/doxdox.md', 'utf8'));

                done();

            });

        });

    });

});
