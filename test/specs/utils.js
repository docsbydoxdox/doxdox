const assert = require('assert');
const path = require('path');

const utils = require('../../lib/utils');

describe('doxdox utils', () => {

    describe('findPackageFileInPath', () => {

        it('find package without input', () => {

            assert.equal(
                utils.findPackageFileInPath(),
                path.join(process.cwd(), 'package.json')
            );

        });

        it('find package with input directory', () => {

            assert.equal(
                utils.findPackageFileInPath('./'),
                path.join(process.cwd(), 'package.json')
            );

        });

        it('find package with input file', () => {

            assert.equal(
                utils.findPackageFileInPath('./package.json'),
                path.join(process.cwd(), 'package.json')
            );

        });

        it('find package with input non package.json file', () => {

            assert.equal(
                utils.findPackageFileInPath('./index.js'),
                path.join(process.cwd(), 'package.json')
            );

        });

        it('fail to find package with invalid directory', () => {

            assert.equal(utils.findPackageFileInPath('./testing'), null);

        });

    });

    describe('formatPathsArrayToIgnore', () => {

        it('convert values in array', () => {

            assert.deepEqual(utils.formatPathsArrayToIgnore(['./src']), ['!./src']);

        });

        it('do nothing with empty array', () => {

            assert.deepEqual(utils.formatPathsArrayToIgnore([]), []);

        });

    });

    describe('setConfigDefaults', () => {

        it('set defaults on empty object', () => {

            assert.deepEqual(utils.setConfigDefaults({}), {
                'ignore': [],
                'parser': 'dox',
                'plugin': 'markdown'
            });

        });

        it('set defaults with no object', () => {

            assert.deepEqual(utils.setConfigDefaults(), {
                'ignore': [],
                'parser': 'dox',
                'plugin': 'markdown'
            });

        });

        it('set defaults on object with custom values', () => {

            assert.deepEqual(
                utils.setConfigDefaults({
                    'plugin': 'bootstrap'
                }),
                {
                    'ignore': [],
                    'parser': 'dox',
                    'plugin': 'bootstrap'
                }
            );

        });

    });

});
