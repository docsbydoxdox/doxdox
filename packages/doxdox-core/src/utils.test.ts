import assert from 'assert';

import { promises as fs } from 'fs';

import { join } from 'path';

import {
    findFileInPath,
    findParentNodeModules,
    getProjectPackage,
    getRootDirPath,
    isDirectory,
    isFile,
    parseIgnoreConfig,
    sanitizePath,
    slugify
} from './utils';

describe('utils', () => {
    describe('findFileInPath', () => {
        it('find package with input directory', async () => {
            assert.equal(
                await findFileInPath('./'),
                join(process.cwd(), './package.json')
            );
        });

        it('find package with input file', async () => {
            assert.equal(
                await findFileInPath('./package.json'),
                join(process.cwd(), './package.json')
            );
        });

        it('fail to find package with input non package.json file', async () => {
            assert.equal(await findFileInPath('./jest.config.js'), null);
        });

        it('fail to find package with invalid directory', async () => {
            assert.equal(await findFileInPath('../testing'), null);
        });
    });

    describe('findParentNodeModules', () => {
        it('find node_modules with input directory', async () => {
            assert.equal(
                await findParentNodeModules('./'),
                join(process.cwd(), '../../node_modules')
            );
        });
        it('fail to find node_modules with input directory with depth of 1', async () => {
            assert.notEqual(
                await findParentNodeModules('./', 1),
                join(process.cwd(), '../../node_modules')
            );
        });
    });

    describe('getProjectPackage', () => {
        it('gets contents from project package', async () => {
            const { name, description, version, exports } = JSON.parse(
                await fs.readFile('./package.json', 'utf8')
            );

            assert.deepEqual(await getProjectPackage('./'), {
                name,
                description,
                version,
                exports
            });
        });
        it('file to get contents from folder without package file', async () => {
            assert.deepEqual(await getProjectPackage('./src/'), {});
        });
    });

    describe('getRootDirPath', () => {
        it('get dir path', () => {
            assert.equal(getRootDirPath(), join(process.cwd(), './src'));
        });
    });

    describe('isDirectory', () => {
        it('return true with directory input', async () => {
            assert.equal(await isDirectory('./'), true);
        });
        it('return false with file input', async () => {
            assert.equal(await isDirectory('./package.json'), false);
        });
        it('return false with invalid input', async () => {
            assert.equal(await isDirectory('./invalid.txt'), false);
        });
    });

    describe('isFile', () => {
        it('return true with file input', async () => {
            assert.equal(await isFile('./package.json'), true);
        });
        it('return false with directory input', async () => {
            assert.equal(await isFile('./'), false);
        });
        it('return false with invalid input', async () => {
            assert.equal(await isFile('./invalid.txt'), false);
        });
    });

    describe('parseIgnoreConfig', () => {
        it('parse ignore config', () => {
            assert.deepEqual(
                parseIgnoreConfig(`**/*.test.*
            ./coverage/
            ./dist/`),
                ['!**/*.test.*', '!./coverage/', '!./dist/']
            );
        });
        it('parse ignore config with empty lines', () => {
            assert.deepEqual(
                parseIgnoreConfig(`**/*.test.*

            ./coverage/

            ./dist/`),
                ['!**/*.test.*', '!./coverage/', '!./dist/']
            );
        });
        it('parse ignore config with ! leading characters', () => {
            assert.deepEqual(
                parseIgnoreConfig(`!**/*.test.*

            !./coverage/

            !./dist/`),
                ['!**/*.test.*', '!./coverage/', '!./dist/']
            );
        });
        it('parse ignore config with empty contents', () => {
            assert.deepEqual(parseIgnoreConfig(''), []);
        });
    });

    describe('sanitizePath', () => {
        it('sanitize path', () => {
            assert.equal(
                sanitizePath(
                    'file:///Users/scottdoxey/git/github/doxdox/packages/doxdox-cli/dist/src/index.js'
                ),
                '/Users/scottdoxey/git/github/doxdox/packages/doxdox-cli/dist/src/index.js'
            );
        });
    });

    describe('slugify', () => {
        it('slugify path', () => {
            assert.equal(slugify('./src/utils.ts'), 'src-utils-ts');
        });
    });
});
