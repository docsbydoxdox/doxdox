#!/usr/bin/env node

import { EOL } from 'os';

import { promises as fs } from 'fs';

import { dirname, join, resolve } from 'path';

import { execSync } from 'child_process';

import { fileURLToPath } from 'url';

import { globby } from 'globby';

import updateNotifier from 'simple-update-notifier';

import parseCmdArgs from 'parse-cmd-args';

import doxdox, {
    findFileInPath,
    findParentNodeModules,
    getProjectPackage,
    getRootDirPath,
    loadPlugin,
    parseConfigFromCLI,
    parseIgnoreConfig
} from 'doxdox-core';

import { Doc, File } from 'doxdox-core';

const defaultPaths = ['**/*.js'];

const helpDocs = `Usage: doxdox <path> ... [options]

Options:

 -h, --help             Display this help message.
 -v, --version          Display the current installed version.
 -n, --name             Sets name of project.
 -d, --description      Sets description of project.
 -i, --ignore           Comma separated list of paths to ignore.
 -l, --parser           Parser used to parse the source files with. Defaults to jsdoc.
 -r, --renderer         Renderer to generate the documentation with. Defaults to Markdown.
 -o, --output           File to save documentation to. Defaults to stdout.
 -p, --package          Sets location of package.json file.

Included Layouts:

 - Markdown (default)    (https://daringfireball.net/projects/markdown)
 - Bootstrap             (https://getbootstrap.com)
 - JSON`;

const args = parseCmdArgs(null, {
    requireUserInput: true
});

const cwd = process.cwd();

const showHelp = Boolean(args.flags['-h'] || args.flags['--help'] || false);
const showVersion = Boolean(
    args.flags['-v'] || args.flags['--version'] || false
);

const overrideName = String(args.flags['-n'] || args.flags['--name'] || '');
const overrideDescription = String(
    args.flags['-d'] || args.flags['--description'] || ''
);
const overrideIgnore = String(args.flags['-i'] || args.flags['--ignore'] || '');
const overrideParser = String(
    args.flags['-l'] || args.flags['--parser'] || 'jsdoc'
);
const overrideRenderer = String(
    args.flags['-r'] || args.flags['--renderer'] || 'markdown'
);
const overrideOutput = String(args.flags['-o'] || args.flags['--output'] || '');
const overridePackage = String(
    args.flags['-p'] || args.flags['--package'] || ''
);

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

        updateNotifier({ pkg });

        if (showVersion) {
            process.stdout.write(`${pkg.version}${EOL}`);

            process.exit();
        }
    }

    const paths = await globby(
        (args.inputs.length ? args.inputs : defaultPaths).concat(
            parseIgnoreConfig(overrideIgnore.split(',').join(EOL))
        ),
        {
            cwd,
            ignoreFiles: ['.doxdoxignore'],
            gitignore: true
        }
    );

    const cliConfig = parseConfigFromCLI(args.raw);

    const localNodeModulesDir = await findParentNodeModules(
        dirname(fileURLToPath(import.meta.url))
    );

    const globalNodeModulesDir = resolve(
        join(execSync('npm get prefix').toString().trim(), './lib/node_modules')
    );

    if (!localNodeModulesDir || !globalNodeModulesDir) {
        throw new Error('node_modules directory was not found');
    }

    const loadedParser = await loadPlugin<
        (cwd: string, path: string) => Promise<File>
    >(
        [localNodeModulesDir, globalNodeModulesDir].filter(Boolean),
        'doxdox-parser-',
        overrideParser.toLowerCase()
    );

    const loadedRenderer = await loadPlugin<(doc: Doc) => Promise<string>>(
        [localNodeModulesDir, globalNodeModulesDir].filter(Boolean),
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
        version: pkg.version,
        homepage: pkg.homepage,
        config: {
            ...pkg.doxdoxConfig,
            ...cliConfig
        }
    });

    if (overrideOutput) {
        await fs.mkdir(dirname(overrideOutput), { recursive: true });

        await fs.writeFile(overrideOutput, output);
    } else {
        process.stdout.write(output);
    }
})();
