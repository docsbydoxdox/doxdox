import { promises as fs } from 'fs';

import { platform } from 'os';

import { dirname, join } from 'path';

import spawn from 'spawn-please';

import { findParentNodeModules, sanitizePath, slugify } from 'doxdox-core';

import { File } from 'doxdox-core';

import { Jsdoc } from './types';

const parser = async (cwd: string, path: string): Promise<File> => {
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
            .filter(
                (jsdoc: Jsdoc) =>
                    jsdoc.kind === 'function' && !jsdoc.undocumented
            )
            .map((jsdoc: Jsdoc) => {
                const params = (jsdoc.params || []).map(
                    ({ name, description = '', type = {} }) => ({
                        name,
                        description,
                        types: type.names || []
                    })
                );

                const returns = (jsdoc.returns || []).map(
                    ({ name, description = '', type = {} }) => ({
                        name,
                        description,
                        types: type.names || []
                    })
                );

                const isPrivate =
                    jsdoc.access === 'private' ||
                    (jsdoc.tags &&
                        jsdoc.tags.findIndex(
                            tag =>
                                tag.title === 'api' && tag.value === 'private'
                        ) !== -1) ||
                    false;

                return {
                    slug: `${slugify(path)}-${slugify(jsdoc.name)}`,
                    name: jsdoc.name,
                    fullName: `${jsdoc.name}(${params
                        .map(param => param.name)
                        .filter(name => name && !name.match(/\./))
                        .join(', ')})`,
                    description: jsdoc.description || '',
                    params,
                    returns,
                    private: isPrivate
                };
            })
            .sort((a, b) => {
                if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) {
                    return -1;
                }
                if (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) {
                    return 1;
                }
                return 0;
            });

        return { path, methods };
    } catch (err: any) {
        if (process.env.DEBUG) {
            console.error(err);
        }
    }

    return { path, methods: [] };
};

export const parseContents = async (
    tempDir: string,
    path: string,
    content: string
): Promise<File> => {
    const tempPath = `${tempDir}/${path}`;

    await fs.mkdir(dirname(tempPath), { recursive: true });

    await fs.writeFile(tempPath, content);

    const file = await parser(tempDir, path);

    try {
        await fs.unlink(tempPath);
        await fs.rm(tempDir, { recursive: true });
    } catch (error) {
        console.log(error);
    }

    return file;
};

export default parser;
