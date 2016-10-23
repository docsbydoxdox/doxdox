const assert = require('assert');

const utils = require('../../lib/utils');

describe('doxdox utils', () => {

    describe('findPackageFileInPath', () => {

        it('find package without input', () => {

            assert.deepEqual(utils.findPackageFileInPath(), `${process.cwd()}/package.json`);

        });

        it('find package with input directory', () => {

            assert.deepEqual(utils.findPackageFileInPath('./'), `${process.cwd()}/package.json`);

        });

        it('find package with input file', () => {

            assert.deepEqual(utils.findPackageFileInPath('./package.json'), `${process.cwd()}/package.json`);

        });

        it('find package with input non package.json file', () => {

            assert.deepEqual(utils.findPackageFileInPath('./index.js'), `${process.cwd()}/package.json`);

        });

        it('fail to find package with invalid directory', () => {

            assert.deepEqual(utils.findPackageFileInPath('./testing'), null);

        });

    });

});
