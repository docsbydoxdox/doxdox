import { EOL } from 'os';

import { promises as fs } from 'fs';

import { resolve, join, dirname } from 'path';

import { fileURLToPath } from 'url';

import { Package } from './types';

/**
 * Finds file in path.
 *
 *     console.log(await findFileInPath('./', 'package.json'));
 *     console.log(await findFileInPath('../', 'package.json'));
 *     console.log(await findFileInPath('~/git/github/doxdox/', '.package.json'));
 *
 * @param {string} [input] Directory to check for file.
 * @param {string?} [fileName = 'package.json'] File name to check for.
 * @return {Promise<string | null>} Path to package.json file.
 * @public
 */

export const findFileInPath = async (
    input: string,
    fileName: string = 'package.json'
): Promise<string | null> => {
    try {
        const inputDirectory = (await fs.stat(input)).isFile()
            ? dirname(input)
            : input;

        const filePath = resolve(join(inputDirectory, fileName));

        const fileStat = await fs.stat(filePath);

        if (fileStat.isFile()) {
            return filePath;
        }
    } catch (err: any) {
        if (process.env.DEBUG) {
            console.error(err);
        }
    }

    return null;
};

/**
 * Finds the closest node_module folder in the parent directories.
 *
 * @param {string} [currentDirectory] Current directory.
 * @param {number} [maxDepth] Optional max depth.
 * @return {Promise<string | null>} Path to node_modules directory.
 * @public
 */

export const findParentNodeModules = async (
    currentDirectory: string,
    maxDepth: number = 5
): Promise<string | null> => {
    if (maxDepth > 0) {
        try {
            const nodeModulesPath = resolve(currentDirectory, './node_modules');

            if (await fs.stat(nodeModulesPath)) {
                return nodeModulesPath;
            }
        } catch (_) {
            const parentDirectory = resolve(currentDirectory, '../');

            return await findParentNodeModules(parentDirectory, --maxDepth);
        }
    }

    return null;
};

/**
 * Return list of ignored paths and files.
 *
 *     console.log(await getIgnoreConfigInPath('./'));
 *     console.log(await getIgnoreConfigInPath('./.doxdoxignore'));
 *     console.log(await getIgnoreConfigInPath('~/git/github/doxdox/'));
 *
 * @param {string} [input] Directory to check for ignore config file.
 * @return {Promise<string[]>} List of ignored paths and files.
 * @public
 */

export const getIgnoreConfigInPath = async (
    input: string
): Promise<string[]> => {
    const ignorePath = await findFileInPath(input, '.doxdoxignore');

    if (ignorePath) {
        const ignoreContents = await fs.readFile(ignorePath, 'utf8');

        return parseIgnoreConfig(ignoreContents);
    }

    return [];
};

/**
 * Returns basic information from a projects package file.
 *
 * @return {Promise<Package>} Basic information from a package file.
 * @public
 */

export const getProjectPackage = async (cwd: string): Promise<Package> => {
    const projectPackagePath = await findFileInPath(cwd);

    if (projectPackagePath) {
        const { name, description, version, exports } = JSON.parse(
            await fs.readFile(projectPackagePath, 'utf8')
        );

        return { name, description, version, exports };
    }

    return {};
};

/**
 * Get the root directory of the package, supplied path or URL.
 *
 * @param {string?} [url] Optional path or URL.
 * @return {string} Directory path.
 * @public
 */

export const getRootDirPath = (url?: string): string =>
    dirname(fileURLToPath(url || import.meta.url));

/**
 * Checks to see if path is a directory.
 *
 * @param {string} [path] Path to check.
 * @return {Promise<boolean>}
 * @public
 */

export const isDirectory = async (path: string): Promise<boolean> => {
    try {
        return (await fs.stat(path)).isDirectory();
    } catch (_) {
        return false;
    }
};

/**
 * Checks to see if path is a file.
 *
 * @param {string} [path] Path to check.
 * @return {Promise<boolean>}
 * @public
 */

export const isFile = async (path: string): Promise<boolean> => {
    try {
        return (await fs.stat(path)).isFile();
    } catch (_) {
        return false;
    }
};

/**
 * Parse contents of ignore file.
 *
 *     console.log(await parseIgnoreConfig('./'));
 *     console.log(await getIgnoreConfigInPath('./.doxdoxignore'));
 *     console.log(await getIgnoreConfigInPath('~/git/github/doxdox/'));
 *
 * @param {string} [contents] Contents of ignore file.
 * @return {string[]} List of ignored paths and files.
 * @public
 */

export const parseIgnoreConfig = (contents: string): string[] =>
    contents
        .trim()
        .split(EOL)
        .filter(line => line.trim())
        .map(line => `!${line.trim().replace(/^!/, '')}`);

/**
 * Sanitizes given path or url.
 *
 * @param {string} [url] Path or url.
 * @return {Promise<string>} Sanitized path.
 * @public
 */

export const sanitizePath = (path: string): string => new URL(path).pathname;

/**
 * Slugify a value for use as an anchor.
 *
 * @return {string} Contents to slugify.
 * @public
 */

export const slugify = (contents: string): string =>
    contents
        .toLowerCase()
        .replace(/[^a-z]+/g, '-')
        .replace(/^-|-$/, '');
