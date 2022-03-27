import { EOL } from 'os';

import { promises as fs } from 'fs';

import { resolve, dirname } from 'path';

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
    fileName = 'package.json'
): Promise<string | null> => {
    try {
        const inputDirectory = (await fs.stat(input)).isFile()
            ? dirname(input)
            : input;

        const filePath = resolve(inputDirectory, fileName);

        const fileStat = await fs.stat(filePath);

        if (fileStat.isFile()) {
            return filePath;
        }
    } catch (err) {
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
    // eslint-disable-next-line no-magic-numbers
    maxDepth = 5
): Promise<string | null> => {
    if (maxDepth > 0) {
        try {
            const nodeModulesPath = resolve(currentDirectory, 'node_modules');

            if (await fs.stat(nodeModulesPath)) {
                return nodeModulesPath;
            }
        } catch (_) {
            const parentDirectory = resolve(currentDirectory, '..');

            return await findParentNodeModules(parentDirectory, --maxDepth);
        }
    }

    return null;
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
        const { name, description, version, exports, homepage, doxdoxConfig } =
            JSON.parse(await fs.readFile(projectPackagePath, 'utf8'));

        return {
            name,
            description,
            version,
            exports,
            homepage,
            doxdoxConfig
        };
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
 * Parse config key/value pairs from raw CLI flags.
 *
 *     console.log(await parseConfigFromCLI([['-c', 'key=value']]));
 *
 * @param {[string, string | boolean][]} rawFlags Raw flags from the CLI.
 * @return {{ [key in string]: string | boolean }} Configs key/value pairs.
 * @public
 */

export const parseConfigFromCLI = (
    rawFlags: [string, string | boolean][]
): {
    [key in string]: string | boolean;
} =>
    rawFlags
        .filter(([flag]) => ['-c', '--config'].includes(flag))
        .reduce((all, [, config]) => {
            const [key, value] = String(config).split('=');

            if (['true', 'false'].includes(value)) {
                return { ...all, [key]: value === 'true' ? true : false };
            } else {
                return { ...all, [key]: value };
            }
        }, {});

/**
 * Parse contents of ignore file.
 *
 *     console.log(await parseIgnoreConfig('node_modules/'));
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
