const assert = require('assert');

const findPackageFileInPath = require('../../lib/utils').findPackageFileInPath;

describe('doxdox util cmd', () => {

    describe('findPackageFileInPath', () => {

        it('findPackageFileInPath without input', () => {

            assert.deepEqual(findPackageFileInPath(), `${process.cwd()}/package.json`);

        });

        it('findPackageFileInPath with input directory', () => {

            assert.deepEqual(findPackageFileInPath('./'), `${process.cwd()}/package.json`);

        });

        it('findPackageFileInPath with input file', () => {

            assert.deepEqual(findPackageFileInPath('./package.json'), `${process.cwd()}/package.json`);

        });

    });

});
