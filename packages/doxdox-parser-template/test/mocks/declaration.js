/* eslint-disable */

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

const findFileInPath = async (input, fileName = 'package.json') => {};

/**
 * Get the root directory of the package, supplied path or URL.
 *
 * @param {string?} [url] Optional path or URL.
 * @return {string} Directory path.
 * @public
 */

const getRootDirPath = url => {};

/**
 * Get the current working directory.
 *
 * @return {string} Directory path.
 * @public
 */

const getCurrentWorkingDirectory = () => {};
