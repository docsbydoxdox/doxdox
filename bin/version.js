#!/usr/bin/env node

import { join } from 'node:path';

import { readFile, writeFile } from 'node:fs/promises';

import semver from 'semver';

import parseCmdArgs from 'parse-cmd-args';

const { inputs } = parseCmdArgs(null, {
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

                const { prerelease } = semver.parse(pkg.version);

                const nextVersion = semver.inc(
                    pkg.version,
                    inputs[0],
                    prerelease[0]
                );

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

    await Promise.all(
        workspaces.map(async workspace => {
            const pkg = await loadAndParsePackageFile(
                join(workspace, './package.json')
            );

            ['dependencies', 'peerDependencies', 'devDependencies'].map(
                type => {
                    if (pkg[type]) {
                        Object.keys(pkg[type]).map(dependency => {
                            if (Object.keys(versions).includes(dependency)) {
                                pkg[type][dependency] =
                                    versions[dependency].version;
                            }
                        });
                    }
                }
            );

            await writeFile(
                join(workspace, './package.json'),
                `${JSON.stringify(pkg, null, 2)}\n`
            );
        })
    );

    console.log(versions);
})();
