#!/usr/bin/env node

import { EOL } from 'os';

import { promises as fs } from 'fs';

import { dirname, join } from 'path';

import { globby } from 'globby';

import updateNotifier from 'update-notifier';

import parseCmdArgs from 'parse-cmd-args';

import doxdox, {
    findFileInPath,
    findParentNodeModules,
    getIgnoreConfigInPath,
    getRootDirPath,
    parseIgnoreConfig,
    loadPlugin,
    sanitizePath,
    getProjectPackage
} from 'doxdox-core';

import { Doc, File } from 'doxdox-core';

const defaultPaths = ['**/*.js'];

const defaultIgnorePatterns = ['!node_modules/'];

const helpDocs = `Usage: doxdox <path> ... [options]

Options:

 -h, --help             Display this help message.
 -v, --version          Display the current installed version.
 -n, --name             Sets name of project.
 -d, --description      Sets description of project.
 -i, --ignore           Comma separated list of paths to ignore.
 -r, --renderer         Renderer to generate the documentation with. Defaults to Markdown.
 -o, --output           File to save documentation to. Defaults to stdout.
 -p, --package          Sets location of package.json file.

Included Layouts:

 - Markdown (default)    (https://daringfireball.net/projects/markdown)
 - Bootstrap             (https://getbootstrap.com)
 - JSON`;

const args: { flags: { [key in string]: string }; input?: string } =
    parseCmdArgs(null, {
        requireUserInput: true
    });

const cwd = process.cwd();

const showHelp = args.flags['-h'] || args.flags['--help'];
const showVersion = args.flags['-v'] || args.flags['--version'];

const overrideName = args.flags['-n'] || args.flags['--name'];
const overrideDescription = args.flags['-d'] || args.flags['--description'];
const overrideIgnore = args.flags['-i'] || args.flags['--ignore'] || '';
const overrideRenderer =
    args.flags['-r'] || args.flags['--renderer'] || 'markdown';
const overrideOutput = args.flags['-o'] || args.flags['--output'] || false;
const overridePackage = args.flags['-p'] || args.flags['--package'];

(async () => {
    const pkgPath = await findFileInPath(
        join(getRootDirPath(import.meta.url), '..')
    );

    if (showHelp) {
        process.stdout.write(`${helpDocs}${EOL}`);

        process.exit();
    }

    if (pkgPath) {
        const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf8'));

        const notifier = updateNotifier({ pkg });

        notifier.notify();

        if (showVersion) {
            process.stdout.write(`${pkg.version}${EOL}`);

            process.exit();
        }
    }

    const paths = await globby(
        (args.input ? [args.input] : defaultPaths).concat([
            ...defaultIgnorePatterns,
            ...parseIgnoreConfig(overrideIgnore.split(',').join(EOL)),
            ...(await getIgnoreConfigInPath(cwd))
        ]),
        {
            cwd
        }
    );

    const nodeModulesDir = await findParentNodeModules(
        dirname(sanitizePath(import.meta.url))
    );

    if (!nodeModulesDir) {
        throw new Error('node_modules directory was not found');
    }

    const loadedParser = await loadPlugin<
        (cwd: string, path: string) => Promise<File>
    >(nodeModulesDir, 'doxdox-parser-', 'jsdoc');

    const loadedRenderer = await loadPlugin<(doc: Doc) => Promise<string>>(
        nodeModulesDir,
        'doxdox-renderer-',
        overrideRenderer.toLowerCase()
    );

    if (!loadedParser) {
        throw new Error('Parser missing!');
    }

    if (!loadedRenderer) {
        throw new Error('Renderer missing!');
    }

    const pkg = await getProjectPackage(overridePackage || cwd);

    const output = await doxdox(cwd, paths, loadedParser, loadedRenderer, {
        name: overrideName || pkg.name || 'Untitled Project',
        description: overrideDescription || pkg.description || '',
        version: pkg.version
    });

    if (overrideOutput) {
        await fs.writeFile(overrideOutput, output);
    } else {
        process.stdout.write(output);
    }
})();