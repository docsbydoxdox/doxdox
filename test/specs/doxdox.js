const assert = require('assert');
const fs = require('fs');

const mock = require('mock-fs');

const doxdox = require('../../lib/doxdox');

describe('doxdox', () => {

    describe('parseInput', () => {

        it('parses input from file', () =>
            doxdox.parseInput('./lib/doxdox.js', {'parser': 'dox'}));

    });

    describe('parseInput (with mock-fs)', () => {

        before(() => {

            mock();

        });

        it('fails to parse input from invalid file', () =>
            doxdox.parseInput('', {'parser': 'dox'}).catch(err => {

                if (err) {

                    console.log(err);

                }

            }));

        after(() => {

            mock.restore();

        });

    });

    describe('parseInputs', () => {

        it('parses multiple input from array', () =>
            doxdox.parseInputs(['./lib/doxdox.js'], {
                'description': '',
                'ignore': [],
                'layout': 'markdown',
                'parser': 'dox',
                'title': 'Untitled Project'
            }).then(content => {

                assert.equal(content, fs.readFileSync('./test/fixtures/doxdox.md', 'utf8'));

            }));

    });

});
