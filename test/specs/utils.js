const assert = require('assert');

const utils = require('../../lib/utils');

describe('doxdox utils', () => {

    describe('findPackageFileInPath', () => {

        it('find package without input', () => {

            assert.equal(utils.findPackageFileInPath(), `${process.cwd()}/package.json`);

        });

        it('find package with input directory', () => {

            assert.equal(utils.findPackageFileInPath('./'), `${process.cwd()}/package.json`);

        });

        it('find package with input file', () => {

            assert.equal(utils.findPackageFileInPath('./package.json'), `${process.cwd()}/package.json`);

        });

        it('find package with input non package.json file', () => {

            assert.equal(utils.findPackageFileInPath('./index.js'), `${process.cwd()}/package.json`);

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

});
