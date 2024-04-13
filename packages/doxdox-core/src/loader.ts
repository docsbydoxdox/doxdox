import { join, resolve } from 'node:path';

import { pathToFileURL } from 'node:url';

import { getProjectPackage, isDirectory, isFile } from './utils.js';

/**
 * Load plugin from package directory.
 *
 *     const plugin = await loadPluginFromPackagePath('./doxdox-parser-jsdoc');
 *
 * @param {string} [path] Directory containing a plugin package.
 * @return {Promise<T | null>} Plugin default method.
 * @public
 */

export const loadPluginFromPackagePath = async <T>(
    path: string
): Promise<T | null> => {
    try {
        const pkg = await getProjectPackage(path);

        if (pkg.exports) {
            return await loadPluginFromFile(join(path, pkg.exports));
        }
    } catch (err) {
        if (process.env.DEBUG) {
            console.error(err);
        }

        throw new Error(`${path} plugin was not found!`);
    }

    return null;
};

/**
 * Load plugin from path.
 *
 *     const plugin = await loadPluginFromFile('./doxdox-renderer-json/dist/index.js');
 *
 * @param {string} [path] Plugin file path.
 * @return {Promise<T | null>} Plugin default method.
 * @public
 */

export const loadPluginFromFile = async <T>(
    path: string
): Promise<T | null> => {
    try {
        return (await import(pathToFileURL(resolve(path)).href)).default;
    } catch (err) {
        if (process.env.DEBUG) {
            console.error(err);
        }

        throw new Error(`${path} plugin was not found!`);
    }
};

/**
 * Load plugin from file or directory.
 *
 *     const plugin = await loadPlugin([process.cwd()], null, './renderer.js');
 *     const plugin = await loadPlugin(['../node_modules'], 'doxdox-renderer-', 'json');
 *
 * @param {string[]} [directories] Root directories to load plugin from.
 * @param {string} [prefix] Optional prefix to attach to the pathOrPackage.
 * @param {string} [pathOrPackage] Path or package name.
 * @return {Promise<T | null>} Plugin default method.
 * @public
 */

export const loadPlugin = async <T>(
    directories: string[],
    prefix: string | null,
    pathOrPackage: string
): Promise<T | null> => {
    const prefixPattern = new RegExp(`^${prefix || ''}`);

    try {
        if (await isFile(pathOrPackage)) {
            return await loadPluginFromFile(pathOrPackage);
        } else if (await isDirectory(pathOrPackage)) {
            return await loadPluginFromPackagePath(pathOrPackage);
        } else {
            for (let i = 0; i < directories?.length; i += 1) {
                const path = join(
                    directories[i],
                    `${prefix}${pathOrPackage.replace(prefixPattern, '')}`
                );

                if (await isDirectory(path)) {
                    return await loadPluginFromPackagePath(path);
                }
            }
        }
    } catch (err) {
        if (process.env.DEBUG) {
            console.error(err);
        }

        throw new Error(
            `${prefix}${pathOrPackage.replace(
                prefixPattern,
                ''
            )} plugin was not found!`
        );
    }

    return null;
};
