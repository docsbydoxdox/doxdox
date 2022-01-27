import assert from 'assert';

import { promises as fs } from 'fs';

import { join } from 'path';

import {
    findFileInPath,
    getRootDirPath,
    getIgnoreConfigInPath,
    parseIgnoreConfig,
    slugify,
    getProjectPackage
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

    describe('getIgnoreConfigInPath', () => {
        it('find ignore config with input directory', async () => {
            assert.deepEqual(await getIgnoreConfigInPath('./'), [
                '!**/*.test.*',
                '!./coverage/',
                '!./dist/'
            ]);
        });

        it('find ignore config with input file', async () => {
            assert.deepEqual(await getIgnoreConfigInPath('./.doxdoxignore'), [
                '!**/*.test.*',
                '!./coverage/',
                '!./dist/'
            ]);
        });

        it('fail to find ignore config with input non .doxdoxignore file', async () => {
            assert.deepEqual(
                await getIgnoreConfigInPath('./jest.config.js'),
                []
            );
        });

        it('fail to find ignore config with invalid directory', async () => {
            assert.deepEqual(await getIgnoreConfigInPath('../testing'), []);
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

    describe('slugify', () => {
        it('slugify path', () => {
            assert.equal(slugify('./src/utils.ts'), 'src-utils-ts');
        });
    });
});
