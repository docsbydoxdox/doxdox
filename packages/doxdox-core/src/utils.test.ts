import { promises as fs } from 'fs';

import { join } from 'path';

import {
    findFileInPath,
    findParentNodeModules,
    getProjectPackage,
    getRootDirPath,
    isDirectory,
    isFile,
    multiLinePatternMatch,
    parseConfigFromCLI,
    parseIgnoreConfig,
    slugify
} from './utils';

describe('utils', () => {
    describe('findFileInPath', () => {
        it('find package with input directory', async () => {
            expect(await findFileInPath('./')).toEqual(
                join(process.cwd(), './package.json')
            );
        });

        it('find package with input file', async () => {
            expect(await findFileInPath('./package.json')).toEqual(
                join(process.cwd(), './package.json')
            );
        });

        it('fail to find package with input non package.json file', async () => {
            expect(await findFileInPath('./jest.config.js')).toBeNull();
        });

        it('fail to find package with invalid directory', async () => {
            expect(await findFileInPath('../testing')).toBeNull();
        });
    });

    describe('findParentNodeModules', () => {
        it('find node_modules with input directory', async () => {
            expect(await findParentNodeModules('./')).toEqual(
                join(process.cwd(), '../../node_modules')
            );
        });
        it('fail to find node_modules with input directory with depth of 1', async () => {
            expect(await findParentNodeModules('./', 1)).toBeNull();
        });
    });

    describe('getProjectPackage', () => {
        it('gets contents from project package', async () => {
            const { name, description, version, exports } = JSON.parse(
                await fs.readFile('./package.json', 'utf8')
            );

            expect(await getProjectPackage('./')).toEqual(
                expect.objectContaining({
                    name,
                    description,
                    version,
                    exports
                })
            );
        });
        it('file to get contents from folder without package file', async () => {
            expect(await getProjectPackage('./src/')).toEqual({});
        });
    });

    describe('getRootDirPath', () => {
        it('get dir path', () => {
            expect(getRootDirPath()).toEqual(join(process.cwd(), './src'));
        });
    });

    describe('isDirectory', () => {
        it('return true with directory input', async () => {
            expect(await isDirectory('./')).toBeTruthy();
        });
        it('return false with file input', async () => {
            expect(await isDirectory('./package.json')).toBeFalsy();
        });
        it('return false with invalid input', async () => {
            expect(await isDirectory('./invalid.txt')).toBeFalsy();
        });
    });

    describe('isFile', () => {
        it('return true with file input', async () => {
            expect(await isFile('./package.json')).toBeTruthy();
        });
        it('return false with directory input', async () => {
            expect(await isFile('./')).toBeFalsy();
        });
        it('return false with invalid input', async () => {
            expect(await isFile('./invalid.txt')).toBeFalsy();
        });
    });

    describe('multiLinePatternMatch', () => {
        it('find pattern in content', async () => {
            expect(
                multiLinePatternMatch(
                    `/**
 * Get the current working directory.
 *
 * @return {string} Directory path.
 * @public
 */

function getCurrentWorkingDirectory() {}`,
                    `/**
 * Get the current working directory.
 *
 * @return {string} Directory path.
 * @public
 */`
                )
            ).toEqual(
                expect.objectContaining({ matched: true, start: 0, end: 6 })
            );
        });
        it('fail to find pattern', async () => {
            expect(multiLinePatternMatch('', '// @ts-ignore')).toEqual(
                expect.objectContaining({ matched: false })
            );
        });
    });

    describe('parseConfigFromCLI', () => {
        it('parse config', () => {
            expect(
                parseConfigFromCLI([
                    ['--version', true],
                    ['-c', 'key1=value1'],
                    ['-c', 'key2=value2'],
                    ['--config', 'boolean1=true'],
                    ['--config', 'boolean2=false']
                ])
            ).toEqual(
                expect.objectContaining({
                    key1: 'value1',
                    key2: 'value2',
                    boolean1: true,
                    boolean2: false
                })
            );
        });
    });

    describe('parseIgnoreConfig', () => {
        it('parse ignore config', () => {
            expect(
                parseIgnoreConfig(`**/*.test.*
            ./coverage/
            ./dist/`)
            ).toEqual(
                expect.arrayContaining([
                    '!**/*.test.*',
                    '!./coverage/',
                    '!./dist/'
                ])
            );
        });
        it('parse ignore config with empty lines', () => {
            expect(
                parseIgnoreConfig(`**/*.test.*

            ./coverage/

            ./dist/`)
            ).toEqual(
                expect.arrayContaining([
                    '!**/*.test.*',
                    '!./coverage/',
                    '!./dist/'
                ])
            );
        });
        it('parse ignore config with ! leading characters', () => {
            expect(
                parseIgnoreConfig(`!**/*.test.*

            !./coverage/

            !./dist/`)
            ).toEqual(
                expect.arrayContaining([
                    '!**/*.test.*',
                    '!./coverage/',
                    '!./dist/'
                ])
            );
        });
        it('parse ignore config with empty contents', () => {
            expect(parseIgnoreConfig('')).toEqual([]);
        });
    });

    describe('slugify', () => {
        it('slugify path', () => {
            expect(slugify('./src/utils.ts')).toEqual('src-utils-ts');
        });
    });
});
