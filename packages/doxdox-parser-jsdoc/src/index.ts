import { platform } from 'os';

import { dirname, join } from 'path';

import spawn from 'spawn-please';

import { File, sanitizePath } from 'doxdox-core';

import { findParentNodeModules, slugify } from 'doxdox-core';

import { Jsdoc } from './types';

export default async (cwd: string, path: string): Promise<File> => {
    try {
        const nodeModulesDir = await findParentNodeModules(
            dirname(sanitizePath(import.meta.url))
        );

        if (!nodeModulesDir) {
            throw new Error('node_modules directory was not found');
        }

        const output = await spawn(
            join(
                nodeModulesDir,
                `.bin/${platform() === 'win32' ? 'jsdoc.cmd' : 'jsdoc'}`
            ),
            ['--explain', join(cwd, path)]
        );

        const docs = JSON.parse(output) as Jsdoc[];

        const methods = docs
            .filter((jsdoc: Jsdoc) => jsdoc.kind === 'function')
            .map((jsdoc: Jsdoc) => {
                const params = (jsdoc.params || []).map(
                    ({ name, description, type }) => ({
                        name,
                        description,
                        types: type.names
                    })
                );

                const returns = (jsdoc.returns || []).map(
                    ({ name, description, type }) => ({
                        name,
                        description,
                        types: type.names
                    })
                );

                return {
                    slug: `${slugify(path)}-${slugify(jsdoc.name)}`,
                    name: jsdoc.name,
                    fullName: `${jsdoc.name}(${params
                        .map(param => param.name)
                        .filter(name => !name?.match(/\./))
                        .join(', ')})`,
                    description: jsdoc.description,
                    params,
                    returns,
                    private: jsdoc.access === 'private'
                };
            });

        return { path, methods };
    } catch (err: any) {
        if (process.env.DEBUG) {
            console.error(err);
        }
    }

    return { path, methods: [] };
};
