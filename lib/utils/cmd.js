const fs = require('fs');
const path = require('path');

/**
 * Finds package.json file from either the directory the script was called from or a supplied path.
 *
 *     console.log(findPackageFileInPath());
 *     console.log(findPackageFileInPath('./package.json'));
 *     console.log(findPackageFileInPath('~/git/github/doxdox/'));
 *
 * @param {String} [input] Directory or file.
 * @return {String} Path to package.json file.
 * @public
 */

const findPackageFileInPath = input => {

    if (!input) {

        input = process.cwd();

    }

    if (fs.existsSync(input)) {

        const stat = fs.statSync(input);

        if (stat.isDirectory()) {

            return path.resolve(path.join(input, '/package.json'));

        } else if (stat.isFile()) {

            return path.resolve(path.join(path.dirname(input), '/package.json'));

        }

    }

    return null;

};

module.exports = {
    findPackageFileInPath
};
