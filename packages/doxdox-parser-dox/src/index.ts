import { promises as fs } from 'fs';

import { slugify } from 'doxdox-core';

import { File, Method } from 'doxdox-core';

import dox from 'dox';

import { Jsdoc } from './types';

const formatParameter = (param: string | null): string | null =>
    param ? param.toString().replace(/\[|\]/gu, '') : null;

export default async (cwd: string, path: string): Promise<File> =>
    await parseString(path, await fs.readFile(path, 'utf8'));

export const parseString = async (
    path: string,
    content: string
): Promise<File> => {
    const docs = dox.parseComments(content, {
        raw: true,
        skipSingleStar: true
    }) as Jsdoc[];

    const methods = docs
        .filter(method => !method.ignore && method.ctx)
        .map(method => {
            const params = (method.tags || [])
                .filter(tag => tag.type === 'param')
                .map(({ name = null, description = null, types = {} }) => ({
                    name: formatParameter(name),
                    description,
                    types: types || []
                }));

            const returns = (method.tags || [])
                .filter(tag => tag.type === 'return' || tag.type === 'returns')
                .map(({ name = null, description = null, types = {} }) => ({
                    name: formatParameter(name),
                    description,
                    types: types || []
                }));

            const isFunction =
                params.length > 0 ||
                method.ctx.type === 'constructor' ||
                method.ctx.type === 'method' ||
                method.ctx.type === 'function' ||
                (method.ctx.type === 'declaration' &&
                    (method.ctx.value?.match(/^(async )?\(/) ||
                        method.ctx.string?.match(/\)$/)));

            const name = method.ctx.cons
                ? `${method.ctx.cons}.${method.ctx.name}`
                : method.ctx.name;

            const fullName = isFunction
                ? `${name}(${params
                      .map(param => param.name)
                      .filter(name => name && !name.match(/\./))
                      .join(', ')})`
                : name;

            return {
                type: method.ctx.type,
                slug: `${slugify(path)}-${slugify(method.ctx.string)}`,
                name,
                fullName,
                description: method.description.full || null,
                params,
                returns,
                private: method.isPrivate
            } as Method;
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
};
