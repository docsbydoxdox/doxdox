export * from './types.js';
export * from './utils.js';
export * from './loader.js';

import { Doc, File } from './types.js';

export default async (
    cwd: string,
    paths: string[],
    parser: (cwd: string, path: string) => Promise<File>,
    renderer: (doc: Doc) => Promise<string>,
    options: { name?: string; description?: string; version?: string } = {}
) =>
    Promise.all(paths.map(async path => await parser(cwd, path))).then(
        async files => await renderer({ ...options, files })
    );
