const assert = require('assert');
const fs = require('fs');

const doxdox = require('../../lib/doxdox');

describe('doxdox', () => {

    describe('parseInput', () => {

        it('parses input from file', () =>
            doxdox.parseFile('./lib/doxdox.js', {'parser': 'dox'}));

    });

    describe('fail to parseInput on missing file', () => {

        it('fails to parse input from invalid file', () =>
            doxdox.parseFile('test.js', {'parser': 'dox'}).catch(err => {

                if (err) {

                    console.log(err);

                }

            }));

    });

    describe('parseFiles', () => {

        it('parses multiple input from array', () =>
            doxdox.parseFiles(['./lib/doxdox.js'], {
                'description': '',
                'ignore': [],
                'layout': 'markdown',
                'parser': 'dox',
                'title': 'Untitled Project'
            }).then(content => {

                assert.equal(content, fs.readFileSync('./test/fixtures/doxdox.md', 'utf8'));

            }));

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
