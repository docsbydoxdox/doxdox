import { promises as fs } from 'fs';

import { join } from 'path';

import { File } from 'doxdox-core';

export default async (cwd: string, path: string): Promise<File> =>
    await parseString(path, await fs.readFile(join(cwd, path), 'utf8'));

export const parseString = async (
    path: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    content: string
): Promise<File> => {
    return { path, methods: [] };
};
