#!/usr/bin/env node

import { join } from 'path';

import { readFile, writeFile } from 'fs/promises';

import { inc, parse } from 'semver';

import parseCmdArgs from 'parse-cmd-args';

const { input } = parseCmdArgs(null, {
    requireUserInput: true
});

const loadAndParsePackageFile = async path => {
    return JSON.parse(await readFile(path, 'utf8'));
};

(async () => {
    const { workspaces } = await loadAndParsePackageFile('./package.json');

    const versions = (
        await Promise.all(
            workspaces.map(async workspace => {
                const pkg = await loadAndParsePackageFile(
                    join(workspace, './package.json')
                );

                const { prerelease } = parse(pkg.version);

                const nextVersion = inc(pkg.version, input, prerelease[0]);

                await writeFile(
                    join(workspace, './package.json'),
                    `${JSON.stringify(
                        { ...pkg, version: nextVersion },
                        null,
                        2
                    )}\n`
                );

                return {
                    name: pkg.name,
                    version: nextVersion
                };
            })
        )
    ).reduce((all, workspace) => ({ ...all, [workspace.name]: workspace }), {});

    console.log(versions);
})();
